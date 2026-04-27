;(function () {
  'use strict';

  const BRIDGE_KEY = '__MVU_DATABASE_MODULE_BRIDGE__';
  const ORIGINAL_GENERATE_KEY = '__mvuDatabaseBridgeOriginalGenerate';
  const ORIGINAL_GENERATE_RAW_KEY = '__mvuDatabaseBridgeOriginalGenerateRaw';
  const ORIGINAL_FETCH_KEY = '__mvuDatabaseBridgeOriginalFetch';
  const ORIGINAL_EVENT_EMIT_KEY = '__mvuDatabaseBridgeOriginalEventEmit';
  const ORIGINAL_CM_SEND_KEY = '__mvuDatabaseBridgeOriginalConnectionSend';

  const hostWin = (() => {
    try {
      if (window.parent && window.parent !== window && window.parent.document) return window.parent;
    } catch (error) {}
    return window;
  })();

  if (hostWin[BRIDGE_KEY]) return;

  const state = {
    installedAt: Date.now(),
    generateWrapped: false,
    generateRawWrapped: false,
    fetchWrapped: false,
    eventEmitWrapped: false,
    connectionManagerWrapped: false,
    injectedPlanningCalls: 0,
    processedPlans: 0,
    blockedPlans: 0,
    continuedPlans: 0,
    capturedPlanningResponses: 0,
    rewrittenPlanningResponses: 0,
    preflightRoutes: 0,
    lastPlanningSignature: '',
    lastPlanningSignatureAt: 0,
    lastIntent: null,
    lastAction: '',
    lastError: ''
  };

  hostWin[BRIDGE_KEY] = state;

  const MODULE_INTENT_INSTRUCTION = `
【MVU模块意图判定】
你必须在原有剧情推进输出最后追加一个机器可读块，用于前端接管可结算行为。不要输出 JS，不要声称你已经执行脚本。
格式必须严格为：
<moduleIntent>
{"module":"战斗|交易|副职业|无","confidence":0.0,"request":{},"自动执行":false}
</moduleIntent>

判定规则：
- 战斗：玩家输入或剧情推演中已经实际发起战斗、切磋、单挑、挑战、袭击、追击、伏击、技能对轰等可结算行为。包括“剧情里两人决定单挑”这类间接表述。request 使用 对象/目标地点/战斗类型。
- 交易：已经实际发起购买、出售、私下交易、竞拍、报价、成交等可结算交易。request 使用 动作/目标/对象/物品/数量/价格/货币/状态/自动执行。
- 副职业：已经实际发起锻造、制造、设计、修理、官方代工、私人代工等副职业操作。request 使用 模式/动作/目标/材料/数量/阶级/子类型/对象/执行者类型/目标地点/状态/自动执行。
- 无：只是讨论、回忆、询问规则、假设、计划但未真正发起可结算行为。
- 自动执行 只有在对象、物品/目标、数量/材料、价格或执行方式足够明确，且文本有“直接/立即/确认/执行/开始/成交”等明确执行意图时才为 true。
- 不允许把战斗、交易、副职业结果直接写死在正文规划里；只输出模块意图，让前端模块结算。
`.trim();

  function toText(value, fallback = '') {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeJsonParse(text, fallback = null) {
    try {
      return JSON.parse(text);
    } catch (error) {
      return fallback;
    }
  }

  function cloneJson(value, fallback = null) {
    try {
      if (value === undefined) return fallback;
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      return fallback;
    }
  }

  function stripModuleIntentBlocks(text) {
    return toText(text, '').replace(/<moduleIntent>[\s\S]*?<\/moduleIntent>/gi, '').trim();
  }

  function normalizeModuleIntentName(value) {
    const text = toText(value, '').trim().toLowerCase();
    if (/battle|combat|战斗|切磋|单挑/.test(text)) return '战斗';
    if (/trade|交易|购买|出售|竞拍|拍卖/.test(text)) return '交易';
    if (/profession|craft|job|副职业|工坊|锻造|制造|设计|修理|维修/.test(text)) return '副职业';
    return '无';
  }

  function normalizeModuleIntent(rawIntent) {
    if (!rawIntent || typeof rawIntent !== 'object') return null;
    const moduleName = normalizeModuleIntentName(rawIntent.module || rawIntent.kind || rawIntent.type);
    const confidenceRaw = Number(rawIntent.confidence);
    const confidence = Number.isFinite(confidenceRaw)
      ? Math.max(0, Math.min(1, confidenceRaw))
      : (moduleName === '无' ? 0 : 1);
    const request = rawIntent.request && typeof rawIntent.request === 'object' ? rawIntent.request : {};
    return {
      module: moduleName,
      confidence,
      request,
      自动执行: rawIntent.自动执行 === true
    };
  }

  function extractModuleIntentFromText(text) {
    const source = toText(text, '');
    const match = source.match(/<moduleIntent>\s*([\s\S]*?)\s*<\/moduleIntent>/i);
    if (!match) return null;
    return normalizeModuleIntent(safeJsonParse(match[1], null));
  }

  function hasModuleIntentBlock(text) {
    return /<moduleIntent>[\s\S]*?<\/moduleIntent>/i.test(toText(text, ''));
  }

  function decodeEscapedResponseText(text) {
    return toText(text, '')
      .replace(/\\r/g, '\r')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }

  function collectTextCandidates(value, output = [], depth = 0, seen = new Set()) {
    if (value === undefined || value === null || depth > 8) return output;
    if (typeof value === 'string') {
      if (value) output.push(value);
      return output;
    }
    if (typeof value !== 'object') return output;
    if (seen.has(value)) return output;
    seen.add(value);

    if (Array.isArray(value)) {
      value.forEach(item => collectTextCandidates(item, output, depth + 1, seen));
      return output;
    }

    const preferredKeys = [
      'content', 'text', 'output_text', 'message', 'mes', 'reply',
      'response', 'result', 'data', 'delta', 'choices', 'candidates',
      'parts', 'output', 'finalMessage', 'prompt', 'user_input'
    ];
    preferredKeys.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        collectTextCandidates(value[key], output, depth + 1, seen);
      }
    });

    if (depth < 4) {
      Object.keys(value).forEach(key => {
        if (!preferredKeys.includes(key)) collectTextCandidates(value[key], output, depth + 1, seen);
      });
    }

    return output;
  }

  function extractStreamDeltaText(value) {
    if (!value || typeof value !== 'object') return '';
    const parts = [];
    const push = text => {
      const valueText = toText(text, '');
      if (valueText) parts.push(valueText);
    };

    if (Array.isArray(value.choices)) {
      value.choices.forEach(choice => {
        push(choice && choice.delta && choice.delta.content);
        push(choice && choice.message && choice.message.content);
        push(choice && choice.text);
      });
    }
    if (Array.isArray(value.candidates)) {
      value.candidates.forEach(candidate => {
        const candidateParts = candidate && candidate.content && Array.isArray(candidate.content.parts)
          ? candidate.content.parts
          : [];
        candidateParts.forEach(part => push(part && part.text));
        push(candidate && candidate.text);
      });
    }
    push(value.content);
    push(value.text);
    push(value.output_text);
    return parts.join('');
  }

  function collectResponseTextCandidates(rawText) {
    const raw = toText(rawText, '');
    const candidates = [];
    if (!raw) return candidates;
    candidates.push(raw);

    const parsed = safeJsonParse(raw, null);
    if (parsed) collectTextCandidates(parsed, candidates);

    const streamParts = [];
    raw.split(/\r?\n/).forEach(line => {
      const match = line.match(/^\s*data:\s*(.*)$/);
      if (!match) return;
      const payload = match[1].trim();
      if (!payload || payload === '[DONE]') return;
      const streamObject = safeJsonParse(payload, null);
      if (!streamObject) return;
      const deltaText = extractStreamDeltaText(streamObject);
      if (deltaText) streamParts.push(deltaText);
    });
    if (streamParts.length) candidates.push(streamParts.join(''));

    return candidates;
  }

  function findPlanningTextInValue(value) {
    const candidates = typeof value === 'string'
      ? collectResponseTextCandidates(value)
      : collectTextCandidates(value, []);

    for (const candidate of candidates) {
      const variants = [candidate, decodeEscapedResponseText(candidate)];
      for (const variant of variants) {
        if (!hasModuleIntentBlock(variant)) continue;
        if (extractModuleIntentFromText(variant)) return variant;
      }
    }
    return null;
  }

  function planningSignature(text) {
    const source = toText(text, '');
    const match = source.match(/<moduleIntent>\s*([\s\S]*?)\s*<\/moduleIntent>/i);
    return match ? match[1].replace(/\s+/g, ' ').trim().slice(0, 800) : '';
  }

  function isDuplicatePlanningText(text) {
    const signature = planningSignature(text);
    if (!signature) return false;
    const now = Date.now();
    const duplicate = state.lastPlanningSignature === signature && now - state.lastPlanningSignatureAt < 5000;
    state.lastPlanningSignature = signature;
    state.lastPlanningSignatureAt = now;
    return duplicate;
  }

  function replacePlanningStrings(value, finalMessage, depth = 0, seen = new Set()) {
    if (value === undefined || value === null || depth > 8) return value;
    if (typeof value === 'string') {
      if (hasModuleIntentBlock(value) || hasModuleIntentBlock(decodeEscapedResponseText(value))) return finalMessage;
      return value;
    }
    if (typeof value !== 'object') return value;
    if (seen.has(value)) return value;
    seen.add(value);
    if (Array.isArray(value)) return value.map(item => replacePlanningStrings(item, finalMessage, depth + 1, seen));
    const next = {};
    Object.keys(value).forEach(key => {
      next[key] = replacePlanningStrings(value[key], finalMessage, depth + 1, seen);
    });
    return next;
  }

  function rewriteRawResponseText(rawText, finalMessage) {
    const raw = toText(rawText, '');
    const parsed = safeJsonParse(raw, null);
    if (parsed) {
      return JSON.stringify(replacePlanningStrings(parsed, finalMessage));
    }
    if (hasModuleIntentBlock(raw)) return finalMessage;
    return raw;
  }

  function rewriteResultValue(value, finalMessage) {
    if (typeof value === 'string') {
      return hasModuleIntentBlock(value) || hasModuleIntentBlock(decodeEscapedResponseText(value))
        ? finalMessage
        : value;
    }
    if (value && typeof value === 'object') return replacePlanningStrings(value, finalMessage);
    return value;
  }

  function createBlockedError(decision) {
    const error = new Error('MVU_MODULE_INTENT_BLOCKED');
    error.name = 'AbortError';
    error.__mvuModuleIntentBlocked = true;
    error.decision = decision;
    return error;
  }

  function hasModuleIntentInstruction(messages) {
    return Array.isArray(messages) && messages.some(msg => toText(msg && msg.content, '').includes('<moduleIntent>'));
  }

  function getStackText() {
    try {
      return toText(new Error().stack, '');
    } catch (error) {
      return '';
    }
  }

  function isLikelyDatabasePlanningMessages(messages) {
    if (!Array.isArray(messages) || !messages.length) return false;

    const stack = getStackText();
    if (/callApiWithPlotPreset_ACU|executeSinglePlotTask_ACU|runOptimizationLogic_ACU|renderPlotTaskMessages_ACU/.test(stack)) {
      return true;
    }

    const joined = messages.map(msg => toText(msg && msg.content, '')).join('\n');
    if (!joined.trim()) return false;
    if (/<tableEdit>|填表AI|templateAssistantDraft|文本优化|优化建议|远记忆归档|数据库增量更新/.test(joined)) {
      return false;
    }
    return /剧情推进|剧情任务|故事发展|用户本轮输入|本轮输入|前文故事|<用户本轮输入>|USER_INPUT|PREVIOUS_PLOT|SUMMARY_DATA/.test(joined)
      && /用户|User|USER_INPUT|本轮/.test(joined);
  }

  function appendModuleIntentInstructionToMessages(messages) {
    if (!Array.isArray(messages)) return messages;
    if (!isLikelyDatabasePlanningMessages(messages)) return messages;
    if (hasModuleIntentInstruction(messages)) return messages;

    const nextMessages = messages.map(msg => {
      if (!msg || typeof msg !== 'object') return msg;
      return { ...msg };
    });
    nextMessages.push({ role: 'user', content: MODULE_INTENT_INSTRUCTION });
    state.injectedPlanningCalls += 1;
    state.lastAction = 'inject_module_intent_instruction';
    return nextMessages;
  }

  function patchGenerateRawOptions(options) {
    if (!options || typeof options !== 'object' || !Array.isArray(options.ordered_prompts)) return options;
    const patchedMessages = appendModuleIntentInstructionToMessages(options.ordered_prompts);
    if (patchedMessages === options.ordered_prompts) return options;
    return { ...options, ordered_prompts: patchedMessages };
  }

  function patchRequestBody(body) {
    const parsed = typeof body === 'string' ? safeJsonParse(body, null) : null;
    if (!parsed || !Array.isArray(parsed.messages)) return null;
    const patchedMessages = appendModuleIntentInstructionToMessages(parsed.messages);
    if (patchedMessages === parsed.messages) return null;
    return JSON.stringify({ ...parsed, messages: patchedMessages });
  }

  function isLikelyFinalGenerationMessages(messages) {
    if (!Array.isArray(messages) || !messages.length) return false;
    if (isLikelyDatabasePlanningMessages(messages)) return false;
    const joined = messages.map(msg => toText(msg && msg.content, '')).join('\n');
    if (!joined.trim()) return false;
    if (/<tableEdit>|templateAssistantDraft|文本优化|优化建议/.test(joined)) return false;
    return /<input>[\s\S]*?<\/input>|故事信息已结束，下接用户输入内容|<Output_format>|<content>|全局回复格式铁律|<UpdateVariable>|<JSONPatch>/i.test(joined)
      && /【模块接管规则】|当剧情即将进入实际战斗|world\/战斗|交易请求|副职业工坊|锻造|制造|修理|交易|切磋|单挑|战斗/.test(joined);
  }

  function extractLatestInputFromMessages(messages) {
    if (!Array.isArray(messages)) return '';
    for (let i = messages.length - 1; i >= 0; i--) {
      const content = toText(messages[i] && messages[i].content, '');
      if (!content) continue;

      const inputMatches = [...content.matchAll(/<input>\s*([\s\S]*?)\s*<\/input>/gi)];
      if (inputMatches.length) return stripModuleIntentBlocks(inputMatches[inputMatches.length - 1][1]).trim();

      const roundMatches = [...content.matchAll(/<本轮用户输入>\s*([\s\S]*?)\s*<\/本轮用户输入>/gi)];
      if (roundMatches.length) return stripModuleIntentBlocks(roundMatches[roundMatches.length - 1][1]).trim();

      if (messages[i] && messages[i].role === 'user') {
        const plain = stripModuleIntentBlocks(content).trim();
        if (plain && plain.length < 2000) return plain;
      }
    }
    return '';
  }

  function parseRequestBodyMessages(body) {
    const parsed = typeof body === 'string' ? safeJsonParse(body, null) : null;
    return parsed && Array.isArray(parsed.messages) ? parsed.messages : null;
  }

  function getRouter() {
    try {
      if (typeof hostWin.__MVU_ROUTE_MODULE_INTENT__ === 'function') {
        return hostWin.__MVU_ROUTE_MODULE_INTENT__.bind(hostWin);
      }
    } catch (error) {}
    try {
      if (typeof window.__MVU_ROUTE_MODULE_INTENT__ === 'function') {
        return window.__MVU_ROUTE_MODULE_INTENT__.bind(window);
      }
    } catch (error) {}
    return null;
  }

  function buildRouterPayload(intent) {
    const request = intent && intent.request && typeof intent.request === 'object' ? intent.request : {};
    return {
      ...request,
      module: intent ? intent.module : '无',
      kind: intent ? intent.module : '无',
      自动执行: !!(intent && intent.自动执行),
      source: request.source || 'database_planning'
    };
  }

  function mergeInlineModuleActionIntoPlanning(finalMessage, moduleResult) {
    const action = moduleResult && (moduleResult.inlineAction || (moduleResult.routeResult && moduleResult.routeResult.inlineAction));
    const systemPrompt = toText(action && action.systemPrompt, '').trim();
    if (!systemPrompt) return stripModuleIntentBlocks(finalMessage);

    const moduleKind = toText(moduleResult && moduleResult.intent && moduleResult.intent.module, toText(action.moduleKind, 'module'));
    const requestKind = toText(action.requestKind, `module_${moduleKind}`);
    const moduleSettlement = [
      '<moduleSettlement>',
      `[${requestKind}] 前端模块已经完成本轮结算。正文只承接结果，不要重新判定胜负、价格、库存、材料消耗或产物。`,
      systemPrompt,
      '</moduleSettlement>'
    ].join('\n');

    return [stripModuleIntentBlocks(finalMessage), moduleSettlement].filter(Boolean).join('\n\n');
  }

  function showToast(type, message) {
    try {
      const toastr = hostWin.toastr || window.toastr;
      if (toastr && typeof toastr[type] === 'function') {
        toastr[type](message);
        return;
      }
    } catch (error) {}
    try {
      console[type === 'error' ? 'error' : 'info'](`[MVU数据库桥接] ${message}`);
    } catch (error) {}
  }

  async function stopGeneration() {
    try {
      const ctx = hostWin.SillyTavern && typeof hostWin.SillyTavern.getContext === 'function'
        ? hostWin.SillyTavern.getContext()
        : null;
      if (ctx && typeof ctx.stopGeneration === 'function') {
        ctx.stopGeneration();
        return;
      }
    } catch (error) {}
    try {
      if (hostWin.SillyTavern && typeof hostWin.SillyTavern.stopGeneration === 'function') {
        hostWin.SillyTavern.stopGeneration();
      }
    } catch (error) {}
  }

  async function processPlanningText(finalMessage) {
    const intent = extractModuleIntentFromText(finalMessage);
    state.processedPlans += 1;
    state.lastIntent = cloneJson(intent, intent);

    if (!intent || intent.module === '无' || intent.confidence < 0.45) {
      state.continuedPlans += 1;
      state.lastAction = 'continue_none';
      return { action: 'continue', finalMessage: stripModuleIntentBlocks(finalMessage), intent };
    }

    const router = getRouter();
    if (!router) {
      state.blockedPlans += 1;
      state.lastAction = 'block_router_unavailable';
      showToast('error', 'MVU模块路由未就绪，本轮正文生成已中止。');
      return { action: 'block', finalMessage: stripModuleIntentBlocks(finalMessage), intent, reason: 'router_unavailable' };
    }

    const payload = buildRouterPayload(intent);
    if (intent.module === '战斗') {
      const routeResult = await router(payload, { source: 'database_planning' });
      state.blockedPlans += 1;
      state.lastAction = routeResult && routeResult.handled ? 'block_battle_routed' : 'block_battle_route_failed';
      showToast(routeResult && routeResult.handled ? 'info' : 'error', routeResult && routeResult.handled
        ? '已由战斗模块接管，本轮正文生成已中止。'
        : '战斗模块接管失败，本轮正文生成已中止。');
      return {
        action: 'block',
        finalMessage: stripModuleIntentBlocks(finalMessage),
        intent,
        routeResult,
        reason: routeResult && routeResult.handled ? 'battle_routed' : 'battle_route_failed'
      };
    }

    if (intent.module === '交易' || intent.module === '副职业') {
      const routeResult = await router(payload, {
        source: 'database_planning',
        dispatchMode: 'inline',
        autoExecute: intent.自动执行 === true
      });

      if (routeResult && routeResult.handled && routeResult.inlineAction) {
        state.continuedPlans += 1;
        state.lastAction = `continue_${intent.module}_inline`;
        return {
          action: 'continue',
          finalMessage: mergeInlineModuleActionIntoPlanning(finalMessage, { intent, routeResult }),
          intent,
          routeResult
        };
      }

      state.blockedPlans += 1;
      state.lastAction = `block_${intent.module}_ui`;
      showToast('info', intent.module === '交易' ? '交易模块已打开，请补全后执行。' : '副职业工坊已打开，请补全后执行。');
      return {
        action: 'block',
        finalMessage: stripModuleIntentBlocks(finalMessage),
        intent,
        routeResult,
        reason: 'module_waiting_user'
      };
    }

    state.continuedPlans += 1;
    state.lastAction = 'continue_unknown';
    return { action: 'continue', finalMessage: stripModuleIntentBlocks(finalMessage), intent };
  }

  async function processPlanningResponseValue(value, sourceLabel = 'response') {
    const planningText = findPlanningTextInValue(value);
    if (!planningText) return null;

    if (isDuplicatePlanningText(planningText)) {
      state.lastAction = `skip_duplicate_${sourceLabel}`;
      return { action: 'continue', finalMessage: stripModuleIntentBlocks(planningText), duplicate: true };
    }

    state.capturedPlanningResponses += 1;
    state.lastAction = `capture_${sourceLabel}`;
    const decision = await processPlanningText(planningText);
    if (decision && decision.action === 'block') {
      await stopGeneration();
      throw createBlockedError(decision);
    }
    return decision;
  }

  function responseFromText(originalResponse, bodyText) {
    if (typeof Response !== 'function') return originalResponse;
    const headers = new Headers(originalResponse.headers || {});
    headers.delete('content-length');
    headers.delete('Content-Length');
    return new Response(bodyText, {
      status: originalResponse.status,
      statusText: originalResponse.statusText,
      headers
    });
  }

  async function inspectFetchPlanningResponse(response, sourceLabel = 'fetch') {
    if (!response || typeof response.clone !== 'function') return response;
    let rawText = '';
    try {
      rawText = await response.clone().text();
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);
      return response;
    }

    const decision = await processPlanningResponseValue(rawText, sourceLabel);
    if (!decision || decision.action !== 'continue' || !decision.finalMessage || decision.duplicate) {
      return response;
    }

    state.rewrittenPlanningResponses += 1;
    return responseFromText(response, rewriteRawResponseText(rawText, decision.finalMessage));
  }

  async function routePreflightModuleIntentFromMessages(messages) {
    if (!isLikelyFinalGenerationMessages(messages)) return null;
    const inputText = extractLatestInputFromMessages(messages);
    if (!inputText) return null;

    const router = getRouter();
    if (!router) return null;

    const dryRun = await router(inputText, { source: 'database_bridge_preflight', dryRun: true });
    if (!dryRun || !dryRun.handled || !dryRun.kind || !dryRun.request) return null;

    if (dryRun.kind !== '战斗') return null;

    const routeResult = await router({
      module: '战斗',
      kind: '战斗',
      request: dryRun.request,
      source: 'database_bridge_preflight'
    }, { source: 'database_bridge_preflight' });

    state.preflightRoutes += 1;
    state.blockedPlans += 1;
    state.lastIntent = {
      module: '战斗',
      confidence: 1,
      request: cloneJson(dryRun.request, dryRun.request),
      自动执行: false
    };
    state.lastAction = routeResult && routeResult.handled
      ? 'block_battle_preflight_routed'
      : 'block_battle_preflight_failed';
    showToast(routeResult && routeResult.handled ? 'info' : 'error', routeResult && routeResult.handled
      ? '战斗模块已接管，本轮正文生成已中止。'
      : '战斗模块接管失败，本轮正文生成已中止。');
    await stopGeneration();
    throw createBlockedError({
      action: 'block',
      reason: routeResult && routeResult.handled ? 'battle_preflight_routed' : 'battle_preflight_failed',
      intent: state.lastIntent,
      routeResult
    });
  }

  function getOptionsPlanningText(options) {
    if (!options || typeof options !== 'object') return null;
    if (options.injects && options.injects[0] && typeof options.injects[0].content === 'string') {
      return { target: 'injects', value: options.injects[0].content };
    }
    if (typeof options.prompt === 'string') return { target: 'prompt', value: options.prompt };
    if (typeof options.user_input === 'string') return { target: 'user_input', value: options.user_input };
    return null;
  }

  function setOptionsPlanningText(options, target, value) {
    if (!options || !target) return;
    if (target === 'injects' && options.injects && options.injects[0]) {
      options.injects[0].content = value;
    } else {
      options[target] = value;
    }
  }

  async function processGenerateOptions(options) {
    if (!options || options._mvu_database_bridge_processed) return { action: 'continue' };
    const slot = getOptionsPlanningText(options);
    if (!slot || !slot.value || !/<moduleIntent>[\s\S]*?<\/moduleIntent>/i.test(slot.value)) {
      return { action: 'continue' };
    }

    options._mvu_database_bridge_processed = true;
    const decision = await processPlanningText(slot.value);
    setOptionsPlanningText(options, slot.target, decision.finalMessage || stripModuleIntentBlocks(slot.value));
    return decision;
  }

  function getSillyContext() {
    try {
      if (hostWin.SillyTavern && typeof hostWin.SillyTavern.getContext === 'function') {
        return hostWin.SillyTavern.getContext();
      }
    } catch (error) {}
    return null;
  }

  function getChatSnapshot() {
    const ctx = getSillyContext();
    const chat = ctx && Array.isArray(ctx.chat) ? ctx.chat : null;
    if (!chat || !chat.length) return null;
    const index = chat.length - 1;
    const message = chat[index];
    return {
      chat,
      index,
      message,
      isUser: !!(message && message.is_user),
      text: toText(message && message.mes, '')
    };
  }

  function restoreLastUserMessage(snapshot) {
    if (!snapshot || !snapshot.isUser || !snapshot.message) return;
    try {
      snapshot.message.mes = snapshot.text;
      const ctx = getSillyContext();
      if (ctx && ctx.eventSource && ctx.eventTypes && ctx.eventTypes.MESSAGE_UPDATED) {
        ctx.eventSource.emit(ctx.eventTypes.MESSAGE_UPDATED, snapshot.index);
      }
    } catch (error) {}
  }

  function setTextareaValue(value) {
    try {
      const input = hostWin.document && hostWin.document.getElementById('send_textarea');
      if (!input) return;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (error) {}
  }

  async function processGenerationAfterCommandsParams(params, beforeSnapshot, beforeInputText) {
    if (!params || params._mvu_database_bridge_processed) return { action: 'continue' };
    const slot = getOptionsPlanningText(params);
    if (!slot || !/<moduleIntent>[\s\S]*?<\/moduleIntent>/i.test(slot.value || '')) {
      return { action: 'continue' };
    }

    params._mvu_database_bridge_processed = true;
    const decision = await processPlanningText(slot.value);
    setOptionsPlanningText(params, slot.target, decision.finalMessage || stripModuleIntentBlocks(slot.value));

    const afterSnapshot = getChatSnapshot();
    if (afterSnapshot && afterSnapshot.isUser && /<moduleIntent>[\s\S]*?<\/moduleIntent>/i.test(toText(afterSnapshot.message && afterSnapshot.message.mes, ''))) {
      afterSnapshot.message.mes = decision.action === 'block' && beforeSnapshot && beforeSnapshot.isUser
        ? beforeSnapshot.text
        : stripModuleIntentBlocks(afterSnapshot.message.mes);
      try {
        const ctx = getSillyContext();
        if (ctx && ctx.eventSource && ctx.eventTypes && ctx.eventTypes.MESSAGE_UPDATED) {
          ctx.eventSource.emit(ctx.eventTypes.MESSAGE_UPDATED, afterSnapshot.index);
        }
      } catch (error) {}
    }

    if (decision.action === 'block') {
      restoreLastUserMessage(beforeSnapshot);
      if (beforeInputText) setTextareaValue(beforeInputText);
      await stopGeneration();
    }

    return decision;
  }

  function installOriginalGenerateBridge() {
    const helper = hostWin.TavernHelper || window.TavernHelper;
    if (!helper || typeof hostWin.original_TavernHelper_generate_ACU !== 'function') return false;
    if (hostWin.original_TavernHelper_generate_ACU.__mvuDatabaseBridgeWrapped) {
      state.generateWrapped = true;
      return true;
    }

    const original = hostWin.original_TavernHelper_generate_ACU;
    const wrapped = async function (...args) {
      const options = args[0] && typeof args[0] === 'object' ? args[0] : null;
      const decision = await processGenerateOptions(options);
      if (decision && decision.action === 'block') {
        await stopGeneration();
        return undefined;
      }
      return await original.apply(this, args);
    };

    wrapped.__mvuDatabaseBridgeWrapped = true;
    wrapped[ORIGINAL_GENERATE_KEY] = original;
    hostWin.original_TavernHelper_generate_ACU = wrapped;
    state.generateWrapped = true;
    return true;
  }

  function installGenerateRawBridge() {
    const helper = hostWin.TavernHelper || window.TavernHelper;
    if (!helper || typeof helper.generateRaw !== 'function') return false;
    if (helper.generateRaw.__mvuDatabaseBridgeWrapped) {
      state.generateRawWrapped = true;
      return true;
    }

    const original = helper.generateRaw;
    helper.generateRaw = function (options, ...rest) {
      const patchedOptions = patchGenerateRawOptions(options);
      const shouldInspect = patchedOptions !== options || hasModuleIntentInstruction(patchedOptions && patchedOptions.ordered_prompts);
      const resultPromise = original.call(this, patchedOptions, ...rest);
      if (!shouldInspect) return resultPromise;
      return Promise.resolve(resultPromise).then(async result => {
        const decision = await processPlanningResponseValue(result, 'generateRaw');
        if (decision && decision.action === 'continue' && decision.finalMessage && !decision.duplicate) {
          state.rewrittenPlanningResponses += 1;
          return rewriteResultValue(result, decision.finalMessage);
        }
        return result;
      });
    };
    helper.generateRaw.__mvuDatabaseBridgeWrapped = true;
    helper.generateRaw[ORIGINAL_GENERATE_RAW_KEY] = original;
    state.generateRawWrapped = true;
    return true;
  }

  function installFetchBridge() {
    if (typeof hostWin.fetch !== 'function') return false;
    if (hostWin.fetch.__mvuDatabaseBridgeWrapped) {
      state.fetchWrapped = true;
      return true;
    }

    const original = hostWin.fetch;
    hostWin.fetch = function (input, init) {
      const runFetch = () => {
        let shouldInspect = false;
        let nextInit = init;
        try {
          const url = typeof input === 'string' ? input : toText(input && input.url, '');
          if (url.includes('/api/backends/chat-completions/generate') && init && typeof init.body === 'string') {
            const patchedBody = patchRequestBody(init.body);
            if (patchedBody) {
              shouldInspect = true;
              nextInit = { ...init, body: patchedBody };
            } else {
              shouldInspect = hasModuleIntentBlock(init.body);
            }
          }
        } catch (error) {
          state.lastError = error && error.message ? error.message : String(error);
        }
        const responsePromise = original.call(this, input, nextInit);
        if (!shouldInspect) return responsePromise;
        return Promise.resolve(responsePromise).then(response => inspectFetchPlanningResponse(response, 'fetch'));
      };

      try {
        const url = typeof input === 'string' ? input : toText(input && input.url, '');
        if (url.includes('/api/backends/chat-completions/generate') && init && typeof init.body === 'string') {
          const messages = parseRequestBodyMessages(init.body);
          if (messages) {
            return Promise.resolve(routePreflightModuleIntentFromMessages(messages)).then(() => runFetch());
          }
        }
      } catch (error) {
        state.lastError = error && error.message ? error.message : String(error);
      }

      return runFetch();
    };
    hostWin.fetch.__mvuDatabaseBridgeWrapped = true;
    hostWin.fetch[ORIGINAL_FETCH_KEY] = original;
    state.fetchWrapped = true;
    return true;
  }

  function installEventEmitBridge() {
    const ctx = getSillyContext();
    const eventSource = ctx && ctx.eventSource;
    const eventTypes = ctx && ctx.eventTypes;
    if (!eventSource || typeof eventSource.emit !== 'function' || !eventTypes || !eventTypes.GENERATION_AFTER_COMMANDS) return false;
    if (eventSource.emit.__mvuDatabaseBridgeWrapped) {
      state.eventEmitWrapped = true;
      return true;
    }

    const original = eventSource.emit;
    eventSource.emit = function (eventName, ...eventArgs) {
      if (eventName !== eventTypes.GENERATION_AFTER_COMMANDS) {
        return original.call(this, eventName, ...eventArgs);
      }

      const beforeSnapshot = getChatSnapshot();
      const beforeInputText = (() => {
        try {
          const input = hostWin.document && hostWin.document.getElementById('send_textarea');
          return toText(input && input.value, '');
        } catch (error) {
          return '';
        }
      })();

      return Promise.resolve(original.call(this, eventName, ...eventArgs)).then(async result => {
        const params = eventArgs[1];
        await processGenerationAfterCommandsParams(params, beforeSnapshot, beforeInputText);
        return result;
      });
    };
    eventSource.emit.__mvuDatabaseBridgeWrapped = true;
    eventSource.emit[ORIGINAL_EVENT_EMIT_KEY] = original;
    state.eventEmitWrapped = true;
    return true;
  }

  function installConnectionManagerBridge() {
    const ctx = getSillyContext();
    const service = ctx && ctx.ConnectionManagerRequestService;
    if (!service || typeof service.sendRequest !== 'function') return false;
    if (service.sendRequest.__mvuDatabaseBridgeWrapped) {
      state.connectionManagerWrapped = true;
      return true;
    }

    const original = service.sendRequest;
    service.sendRequest = function (profileId, messages, maxTokens, ...rest) {
      const patchedMessages = appendModuleIntentInstructionToMessages(messages);
      const shouldInspect = patchedMessages !== messages || hasModuleIntentInstruction(patchedMessages);
      const resultPromise = original.call(this, profileId, patchedMessages, maxTokens, ...rest);
      if (!shouldInspect) return resultPromise;
      return Promise.resolve(resultPromise).then(async result => {
        const decision = await processPlanningResponseValue(result, 'connectionManager');
        if (decision && decision.action === 'continue' && decision.finalMessage && !decision.duplicate) {
          state.rewrittenPlanningResponses += 1;
          return rewriteResultValue(result, decision.finalMessage);
        }
        return result;
      });
    };
    service.sendRequest.__mvuDatabaseBridgeWrapped = true;
    service.sendRequest[ORIGINAL_CM_SEND_KEY] = original;
    state.connectionManagerWrapped = true;
    return true;
  }

  function installAll() {
    try {
      installGenerateRawBridge();
      installFetchBridge();
      installConnectionManagerBridge();
      installOriginalGenerateBridge();
      installEventEmitBridge();
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);
      console.warn('[MVU数据库桥接] 安装失败', error);
    }
  }

  hostWin.__MVU_DATABASE_BRIDGE_PROCESS_TEXT__ = processPlanningText;
  hostWin.__MVU_DATABASE_BRIDGE_APPEND_INTENT__ = messages => appendModuleIntentInstructionToMessages(messages);

  installAll();
  const timer = hostWin.setInterval(() => {
    installAll();
    if (state.generateRawWrapped && state.fetchWrapped && state.eventEmitWrapped && state.generateWrapped) {
      hostWin.clearInterval(timer);
    }
  }, 800);

  hostWin.setTimeout(() => {
    try {
      if (state.generateRawWrapped || state.fetchWrapped || state.eventEmitWrapped || state.generateWrapped) {
        console.info('[MVU数据库桥接] 已加载', cloneJson(state, state));
      }
    } catch (error) {}
  }, 1200);
})();
