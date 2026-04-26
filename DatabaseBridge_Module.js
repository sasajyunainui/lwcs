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
{"module":"battle|trade|profession|none","confidence":0.0,"request":{},"auto_execute":false}
</moduleIntent>

判定规则：
- battle：玩家输入或剧情推演中已经实际发起战斗、切磋、单挑、挑战、袭击、追击、伏击、技能对轰等可结算行为。包括“剧情里两人决定单挑”这类间接表述。request 使用 npcTarget/location/combatType。
- trade：已经实际发起购买、出售、私下交易、竞拍、报价、成交等可结算交易。request 使用 action/npc/item/quantity/price/currency/location。
- profession：已经实际发起锻造、制造、设计、修理、官方代工、私人代工等副职业操作。request 使用 mode/target/materials/quantity/tier/subtype/npc/executorType/location。
- none：只是讨论、回忆、询问规则、假设、计划但未真正发起可结算行为。
- auto_execute 只有在对象、物品/目标、数量/材料、价格或执行方式足够明确，且文本有“直接/立即/确认/执行/开始/成交”等明确执行意图时才为 true。
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
    if (/battle|combat|战斗|切磋|单挑/.test(text)) return 'battle';
    if (/trade|交易|购买|出售|竞拍|拍卖/.test(text)) return 'trade';
    if (/profession|craft|job|副职业|工坊|锻造|制造|设计|修理|维修/.test(text)) return 'profession';
    return 'none';
  }

  function normalizeModuleIntent(rawIntent) {
    if (!rawIntent || typeof rawIntent !== 'object') return null;
    const moduleName = normalizeModuleIntentName(rawIntent.module || rawIntent.kind || rawIntent.type);
    const confidenceRaw = Number(rawIntent.confidence);
    const confidence = Number.isFinite(confidenceRaw)
      ? Math.max(0, Math.min(1, confidenceRaw))
      : (moduleName === 'none' ? 0 : 1);
    const request = rawIntent.request && typeof rawIntent.request === 'object' ? rawIntent.request : {};
    return {
      module: moduleName,
      confidence,
      request,
      auto_execute: rawIntent.auto_execute === true || rawIntent.autoExecute === true
    };
  }

  function extractModuleIntentFromText(text) {
    const source = toText(text, '');
    const match = source.match(/<moduleIntent>\s*([\s\S]*?)\s*<\/moduleIntent>/i);
    if (!match) return null;
    return normalizeModuleIntent(safeJsonParse(match[1], null));
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
      module: intent ? intent.module : 'none',
      kind: intent ? intent.module : 'none',
      auto_execute: !!(intent && intent.auto_execute),
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

    if (!intent || intent.module === 'none' || intent.confidence < 0.45) {
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
    if (intent.module === 'battle') {
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

    if (intent.module === 'trade' || intent.module === 'profession') {
      const routeResult = await router(payload, {
        source: 'database_planning',
        dispatchMode: 'inline',
        autoExecute: intent.auto_execute === true
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
      showToast('info', intent.module === 'trade' ? '交易模块已打开，请补全后执行。' : '副职业工坊已打开，请补全后执行。');
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
      return original.call(this, patchGenerateRawOptions(options), ...rest);
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
      try {
        const url = typeof input === 'string' ? input : toText(input && input.url, '');
        if (url.includes('/api/backends/chat-completions/generate') && init && typeof init.body === 'string') {
          const patchedBody = patchRequestBody(init.body);
          if (patchedBody) {
            return original.call(this, input, { ...init, body: patchedBody });
          }
        }
      } catch (error) {
        state.lastError = error && error.message ? error.message : String(error);
      }
      return original.call(this, input, init);
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
      return original.call(this, profileId, appendModuleIntentInstructionToMessages(messages), maxTokens, ...rest);
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
