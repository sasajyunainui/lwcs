/* BattleUI_Module.js - 战斗终端系统 (JS 模块版) */

class BattleUIComponent {
  constructor(container, snapshot, options = {}) {
    this.container = container;
    this.snapshot = snapshot;
    this.options = options;
    this.initDOM();
    this.initEngine();
  }

  initDOM() {
    if (!this.container.querySelector('.battle-module-scope')) {
      throw new Error('battle_ui_markup_missing');
    }
  }

  updateData(newSnapshot) {
    this.snapshot = newSnapshot;
    if (this.syncFromBattleEngine) this.syncFromBattleEngine();
  }

  destroy() {
    this.container.innerHTML = '';
  }

  initEngine() {
    const component = this;
    const snapshot = this.snapshot;
    const _options = this.options;
    const wrapperElement = this.container.querySelector('.battle-module-scope');
    if (!wrapperElement) throw new Error('battle_ui_markup_missing');
    const document = wrapperElement;
    const byId = id => wrapperElement.querySelector(`#${id}`);

    const root = typeof globalThis !== 'undefined' ? globalThis : window;
    const SHARED_SKILL_MECHANISM_REGISTRY =
      root.__LWCS_SKILL_MECHANISM_REGISTRY__ && typeof root.__LWCS_SKILL_MECHANISM_REGISTRY__ === 'object'
        ? root.__LWCS_SKILL_MECHANISM_REGISTRY__
        : null;
    const BATTLE_SKILL_MECHANISM_META = Object.freeze(SHARED_SKILL_MECHANISM_REGISTRY?.机制定义 || {});
    const BATTLE_SKILL_TARGET_SEMANTICS = Object.freeze(SHARED_SKILL_MECHANISM_REGISTRY?.目标语义表 || {});
    const BATTLE_GRANTABLE_MECHANISM_SET = new Set(
      Array.isArray(BATTLE_SKILL_TARGET_SEMANTICS.grantable) ? BATTLE_SKILL_TARGET_SEMANTICS.grantable : [],
    );
    const BATTLE_GROUP_GRANTABLE_MECHANISM_SET = new Set(
      Array.isArray(BATTLE_SKILL_TARGET_SEMANTICS.群体赋予) ? BATTLE_SKILL_TARGET_SEMANTICS.群体赋予 : [],
    );
    const BATTLE_HOSTILE_MECHANISM_SET = new Set(
      Array.isArray(BATTLE_SKILL_TARGET_SEMANTICS.hostile) ? BATTLE_SKILL_TARGET_SEMANTICS.hostile : [],
    );
    const BATTLE_CONTEXTUAL_MECHANISM_SET = new Set(
      Array.isArray(BATTLE_SKILL_TARGET_SEMANTICS.contextual) ? BATTLE_SKILL_TARGET_SEMANTICS.contextual : [],
    );
    const BATTLE_SELF_ONLY_MECHANISM_SET = new Set(
      Array.isArray(BATTLE_SKILL_TARGET_SEMANTICS.仅自身) ? BATTLE_SKILL_TARGET_SEMANTICS.仅自身 : [],
    );
    const lodashGet =
      root._ && typeof root._.get === 'function'
        ? root._.get.bind(root._)
        : (obj, path, fallback) => {
            const normalized = String(path || '')
              .split('.')
              .filter(Boolean);
            let cursor = obj;
            for (const seg of normalized) {
              if (cursor == null || typeof cursor !== 'object' || !(seg in cursor)) return fallback;
              cursor = cursor[seg];
            }
            return cursor === undefined ? fallback : cursor;
          };

    function normalizeStatPath(path) {
      return String(path || '')
        .replace(/^stat_data\./, '')
        .replace(/^\.+/, '');
    }

    function getTavernHelperRuntime() {
      const host = getHostWindow();
      if (root.TavernHelper && typeof root.TavernHelper.getVariables === 'function') return root.TavernHelper;
      if (host?.TavernHelper && typeof host.TavernHelper.getVariables === 'function') return host.TavernHelper;
      return null;
    }

    function normalizeVariablesEnvelope(rawVars) {
      if (!rawVars || typeof rawVars !== 'object') return {};
      const candidates = [
        rawVars.stat_data,
        rawVars.data?.stat_data,
        rawVars.variables?.stat_data,
        rawVars.payload?.stat_data,
        rawVars.root?.stat_data,
        rawVars.data,
        rawVars.variables,
        rawVars.payload,
        rawVars.root,
        rawVars,
      ];
      const statData = candidates.find(item => item && typeof item === 'object' && (item.char || item.world || item.sys));
      return statData ? { ...rawVars, stat_data: statData } : rawVars;
    }

    const SOUL_TOWER_MAX_AGE = 30;
    const SOUL_TOWER_TEAM_LIMIT = 7;
    const SOUL_TOWER_MAX_AGE_GAP = 3;
    const SOUL_TOWER_TOTAL_FLOORS = 108;
    const SOUL_TOWER_LAYER_RULES = Object.freeze([
      Object.freeze({
        key: 'thousand',
        label: '千年魂灵区',
        rewardTier: '千年',
        gateStart: 1,
        gateEnd: 18,
        minAge: 1000,
        maxAge: 9999,
        qualitySteps: Object.freeze(['C', 'B', 'A']),
      }),
      Object.freeze({
        key: 'ten_thousand',
        label: '万年魂灵区',
        rewardTier: '万年',
        gateStart: 19,
        gateEnd: 36,
        minAge: 10000,
        maxAge: 99999,
        qualitySteps: Object.freeze(['B', 'A', 'S']),
      }),
      Object.freeze({
        key: 'pre_beast',
        label: '万年以上魂灵区',
        rewardTier: '万年以上',
        gateStart: 37,
        gateEnd: 99,
        minAge: 10000,
        maxAge: 99999,
        qualitySteps: Object.freeze(['A', 'S']),
      }),
      Object.freeze({
        key: 'beast',
        label: '凶兽魂灵区',
        rewardTier: '凶兽级',
        gateStart: 100,
        gateEnd: 108,
        minAge: 100000,
        maxAge: 200000,
        qualitySteps: Object.freeze(['S+']),
      }),
    ]);
    const SOUL_TOWER_GUARDIAN_SPECIES_POOL = Object.freeze([
      '龙类',
      '蛛类',
      '熊类',
      '植物系',
      '海魂兽',
      '鸟类',
      '猫科',
      '蛇类',
    ]);
    const SOUL_SPIRIT_QUALITY_VALUES = Object.freeze(['F', 'D', 'C', 'B', 'A', 'S', 'S+']);
    const SOUL_SPIRIT_QUALITY_MULTIPLIER_MAP = Object.freeze({
      F: 0.82,
      D: 0.9,
      C: 1.0,
      B: 1.08,
      A: 1.18,
      S: 1.32,
      'S+': 1.48,
    });
    const SOUL_SPIRIT_QUALITY_LEVEL_OFFSET_MAP = Object.freeze({
      F: -6,
      D: -3,
      C: 0,
      B: 2,
      A: 5,
      S: 8,
      'S+': 12,
    });

    function normalizeSoulSpiritQuality(value = '') {
      const text = String(value || '')
        .trim()
        .toUpperCase()
        .replace('＋', '+')
        .replace(/\s+/g, '');
      return SOUL_SPIRIT_QUALITY_VALUES.includes(text) ? text : '';
    }

    function createEmptySoulTowerDiscountSpiritRecord() {
      return {
        层数: 0,
        名称: '',
        标准物种: '',
        年限: 0,
        品质: '',
        已使用: false,
      };
    }

    function normalizeSoulTowerDiscountSpiritRecord(record = {}) {
      if (!record || typeof record !== 'object' || Array.isArray(record)) return createEmptySoulTowerDiscountSpiritRecord();
      const next = createEmptySoulTowerDiscountSpiritRecord();
      next.层数 = Math.max(0, Math.floor(Number(record.层数 || 0)));
      next.名称 = String(record.名称 || '').trim();
      next.标准物种 = String(record.标准物种 || '').trim();
      next.年限 = Math.max(0, Math.floor(Number(record.年限 || 0)));
      next.品质 = normalizeSoulSpiritQuality(record.品质 || '');
      next.已使用 = record.已使用 === true;
      if (!(next.层数 > 0 && next.标准物种 && next.年限 > 0 && next.品质 && next.已使用 === false)) {
        return createEmptySoulTowerDiscountSpiritRecord();
      }
      if (!next.名称) next.名称 = `${next.标准物种}魂灵`;
      return next;
    }

    function buildSoulTowerDiscountSpiritDisplay(record = {}) {
      const normalized = normalizeSoulTowerDiscountSpiritRecord(record);
      if (!(normalized.层数 > 0)) return '暂无';
      return `第${normalized.层数}层 · ${normalized.标准物种} · ${normalized.年限}年 · ${normalized.品质}`;
    }

    function getCombatUnitAgeValue(unit = {}) {
      const rawAge = unit?.属性?.年龄 ?? unit?.年龄 ?? unit?.age;
      if (typeof rawAge === 'number') return Number.isFinite(rawAge) ? rawAge : NaN;
      const text = String(rawAge == null ? '' : rawAge).trim();
      if (!text) return NaN;
      const directNumber = Number(text);
      if (Number.isFinite(directNumber)) return directNumber;
      const numericText = text.match(/-?\d+(?:\.\d+)?/);
      return numericText ? Number(numericText[0]) : NaN;
    }

    function isSoulTowerEligibleUnit(unit = {}) {
      const ageValue = getCombatUnitAgeValue(unit);
      return Number.isFinite(ageValue) && ageValue > 0 && ageValue <= SOUL_TOWER_MAX_AGE;
    }

    function isSoulTowerCombatTypeValue(combatType = '') {
      return String(combatType || '').trim() === '魂灵塔冲塔';
    }

    function getSoulTowerGateMeta(floor = 0) {
      const safeFloor = Math.max(1, Math.floor(Number(floor) || 1));
      const rule =
        SOUL_TOWER_LAYER_RULES.find(item => safeFloor >= item.gateStart && safeFloor <= item.gateEnd) ||
        SOUL_TOWER_LAYER_RULES[SOUL_TOWER_LAYER_RULES.length - 1];
      const gateIndex = SOUL_TOWER_LAYER_RULES.findIndex(item => item.key === rule.key) + 1;
      const layerInGate = safeFloor - rule.gateStart + 1;
      const isGateBoss = safeFloor === rule.gateEnd;
      const layerProgress = rule.gateEnd > rule.gateStart ? (safeFloor - rule.gateStart) / (rule.gateEnd - rule.gateStart) : 1;
      return {
        floor: safeFloor,
        gateIndex,
        gateStart: rule.gateStart,
        gateEnd: rule.gateEnd,
        layerInGate,
        isGateBoss,
        gateLabel: rule.label,
        gateRangeLabel: `${rule.gateStart}-${rule.gateEnd}层`,
        rewardTier: rule.rewardTier,
        layerProgress,
        minAge: rule.minAge,
        maxAge: rule.maxAge,
        qualitySteps: rule.qualitySteps,
        isTopNine: safeFloor >= 100,
        totalFloors: SOUL_TOWER_TOTAL_FLOORS,
        key: rule.key,
      };
    }

    function getSoulTowerGuardianQualityForFloor(floor = 1) {
      const meta = getSoulTowerGateMeta(floor);
      const steps = Array.isArray(meta.qualitySteps) && meta.qualitySteps.length ? meta.qualitySteps : ['C'];
      if (steps.length === 1) return steps[0];
      const progress = Math.max(0, Math.min(1, Number(meta.layerProgress || 0)));
      const index = Math.min(steps.length - 1, Math.floor(progress * steps.length));
      return steps[index] || steps[steps.length - 1];
    }

    function buildSoulTowerGuardianAgeForFloor(floor = 1) {
      const meta = getSoulTowerGateMeta(floor);
      const minAge = Math.max(1, Math.floor(Number(meta.minAge || 1)));
      const maxAge = Math.max(minAge, Math.floor(Number(meta.maxAge || minAge)));
      if (meta.isGateBoss) return maxAge;
      const gateLength = Math.max(1, meta.gateEnd - meta.gateStart);
      const progress = Math.max(0, Math.min(1, Number(meta.layerProgress || 0)));
      const anchor = minAge + Math.round((maxAge - minAge) * progress);
      const bucket = Math.max(1, Math.floor((maxAge - minAge) / Math.max(2, gateLength + 1)));
      const variance = Math.max(0, Math.floor(bucket * 0.45));
      const offset = variance > 0 ? pickBattleSeedInt(-variance, variance) : 0;
      return Math.max(minAge, Math.min(maxAge, anchor + offset));
    }

    function buildSoulTowerGuardianSeed(floor = 1) {
      const meta = getSoulTowerGateMeta(floor);
      const species =
        SOUL_TOWER_GUARDIAN_SPECIES_POOL[Math.max(0, Math.min(SOUL_TOWER_GUARDIAN_SPECIES_POOL.length - 1, Math.floor(Math.random() * SOUL_TOWER_GUARDIAN_SPECIES_POOL.length)))] ||
        '龙类';
      const age = buildSoulTowerGuardianAgeForFloor(meta.floor);
      const quality = normalizeSoulSpiritQuality(getSoulTowerGuardianQualityForFloor(meta.floor)) || 'C';
      return {
        name: `${species}守塔魂兽`,
        来源: '临时单位',
        单位性质: '魂兽',
        数量: 1,
        标准物种: species,
        年限: age,
        品质: quality,
      };
    }

    function buildSoulTowerDiscountSpiritRecordFromGuardian(unit = {}, floor = 1) {
      const species = String(unit?.标准物种 || '').trim();
      const age = Math.max(0, Math.floor(Number(unit?.年限 || 0)));
      const quality = normalizeSoulSpiritQuality(unit?.品质 || '');
      if (!(species && age > 0 && quality)) return createEmptySoulTowerDiscountSpiritRecord();
      return {
        层数: Math.max(1, Math.floor(Number(floor) || 1)),
        名称: `${species}魂灵`,
        标准物种: species,
        年限: age,
        品质: quality,
        已使用: false,
      };
    }

    function getSoulTowerPlayerRosterUnits(combatData = {}) {
      return [combatData?.参战者?.player, ...(combatData?.参战者?.team_player || [])].filter(Boolean);
    }

    function validateSoulTowerCombatRoster(combatData = {}) {
      const roster = getSoulTowerPlayerRosterUnits(combatData);
      if (!roster.length) return { ok: false, message: '魂灵塔队伍为空。' };
      if (roster.length > SOUL_TOWER_TEAM_LIMIT) {
        return { ok: false, message: `魂灵塔队伍最多 ${SOUL_TOWER_TEAM_LIMIT} 人。` };
      }
      const invalidMember = roster.find(unit => !isSoulTowerEligibleUnit(unit));
      if (invalidMember) {
        return {
          ok: false,
          message: `${String(invalidMember?.name || invalidMember?.名称 || '队员').trim() || '队员'} 已超过 ${SOUL_TOWER_MAX_AGE} 岁，无法参与魂灵塔试炼。`,
        };
      }
      const ages = roster.map(unit => getCombatUnitAgeValue(unit)).filter(age => Number.isFinite(age) && age > 0);
      const minAge = Math.min(...ages);
      const maxAge = Math.max(...ages);
      if (maxAge - minAge > SOUL_TOWER_MAX_AGE_GAP) {
        return { ok: false, message: `魂灵塔队伍成员年龄差不能超过 ${SOUL_TOWER_MAX_AGE_GAP} 岁。` };
      }
      return { ok: true, rosterCount: roster.length, minAge, maxAge };
    }

    function hasMvuRuntime() {
      return !!getTavernHelperRuntime();
    }

    function getAllVariablesSafe() {
      try {
        const helper = getTavernHelperRuntime();
        if (!helper) return {};
        const vars = helper.getVariables({ type: 'message', message_id: 'latest' });
        if (vars && typeof vars.then === 'function') {
          console.warn('BattleUIBridge: TavernHelper.getVariables returned Promise; synchronous battle read skipped');
          return {};
        }
        return normalizeVariablesEnvelope(vars);
      } catch (error) {
        console.warn('BattleUIBridge: TavernHelper.getVariables failed', error);
        return {};
      }
    }

    function getMvuValue(path, fallback) {
      const normalized = normalizeStatPath(path);
      if (normalized === 'world.战斗' || normalized.startsWith('world.战斗.')) {
        const snapshotRoot = component?.snapshot?.rootData || snapshot?.rootData;
        const snapshotValue = lodashGet(snapshotRoot, normalized, undefined);
        if (snapshotValue !== undefined) return snapshotValue;
      }
      if (!normalized) return lodashGet(getAllVariablesSafe(), 'stat_data', fallback);
      return lodashGet(getAllVariablesSafe(), `stat_data.${normalized}`, fallback);
    }

    async function waitForMvuReady() {
      try {
        const host = getHostWindow();
        const waiter =
          typeof root.waitGlobalInitialized === 'function'
            ? root.waitGlobalInitialized.bind(root)
            : typeof host?.waitGlobalInitialized === 'function'
              ? host.waitGlobalInitialized.bind(host)
              : null;
        if (waiter) {
          await waiter('Mvu');
        }
      } catch (error) {
        console.warn('BattleUIBridge: waitForMvuReady failed', error);
      }
      return hasMvuRuntime();
    }

    function subscribeMvuUpdates(handler) {
      if (typeof handler !== 'function') return false;
      const host = getHostWindow();
      const eventName = root.Mvu?.events?.VARIABLE_UPDATE_ENDED || host?.Mvu?.events?.VARIABLE_UPDATE_ENDED;
      const eventOnFn =
        typeof root.eventOn === 'function'
          ? root.eventOn.bind(root)
          : typeof host?.eventOn === 'function'
            ? host.eventOn.bind(host)
            : null;
      if (!eventName || !eventOnFn) return false;
      eventOnFn(eventName, handler);
      return true;
    }

    function deepClonePlain(value) {
      return value == null ? value : JSON.parse(JSON.stringify(value));
    }

    function escapeJsonPointerSegment(segment) {
      return String(segment).replace(/~/g, '~0').replace(/\//g, '~1');
    }

    const COMBAT_STAT_KEYS = [
      '年龄',
      '等级',
      '系别',
      '天赋梯队',
      '邪魂师',
      'HP',
      'HP上限',
      '魂力',
      '魂力上限',
      '精神力',
      '精神力上限',
      '力量',
      '防御',
      '敏捷',
      '体力',
      '体力上限',
      '状态效果',
    ];
    const COMBAT_STATUS_KEYS = ['存活', '受伤部位', '行动', '当前领域', '位置', '横坐标', '纵坐标'];
    const COMBAT_PROCESS_SYNC_STAT_KEYS = COMBAT_STAT_KEYS.filter(key => !['HP', 'HP上限'].includes(key));
    const COMBAT_PROCESS_SYNC_STATUS_KEYS = COMBAT_STATUS_KEYS.filter(key => !['存活', '受伤部位'].includes(key));

    function sanitizeCombatPersistenceData(value) {
      if (Array.isArray(value)) return value.map(item => sanitizeCombatPersistenceData(item));
      if (!value || typeof value !== 'object') return value;
      const cleaned = {};
      Object.entries(value).forEach(([key, item]) => {
        if (key === 'is_controlled' || key === 'action_declared' || key === '_current_cast_time' || /^temp_/.test(key))
          return;
        cleaned[key] = sanitizeCombatPersistenceData(item);
      });
      return cleaned;
    }

    function isPlainRecord(value) {
      return !!value && typeof value === 'object' && !Array.isArray(value);
    }

    function isDeepEqual(left, right) {
      if (left === right) return true;
      if (Number.isNaN(left) && Number.isNaN(right)) return true;

      if (Array.isArray(left) || Array.isArray(right)) {
        if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
        for (let index = 0; index < left.length; index += 1) {
          if (!isDeepEqual(left[index], right[index])) return false;
        }
        return true;
      }

      if (isPlainRecord(left) || isPlainRecord(right)) {
        if (!isPlainRecord(left) || !isPlainRecord(right)) return false;
        const leftKeys = Object.keys(left);
        const rightKeys = Object.keys(right);
        if (leftKeys.length !== rightKeys.length) return false;
        for (let index = 0; index < leftKeys.length; index += 1) {
          const key = leftKeys[index];
          if (!Object.prototype.hasOwnProperty.call(right, key)) return false;
          if (!isDeepEqual(left[key], right[key])) return false;
        }
        return true;
      }

      return false;
    }

    function clonePersistedCombatValue(value) {
      return sanitizeCombatPersistenceData(deepClonePlain(value));
    }

    const COMBAT_STAT_RATIO_RUNTIME_TO_SCHEMA_KEY = {
      str: '力量',
      def: '防御',
      agi: '敏捷',
      sp_max: '魂力上限',
    };
    const COMBAT_STAT_RATIO_SCHEMA_TO_RUNTIME_KEY = {
      力量: 'str',
      防御: 'def',
      敏捷: 'agi',
      魂力上限: 'sp_max',
    };
    const COMBAT_EFFECT_RUNTIME_TO_SCHEMA_KEY = {
      dot_damage: '持续伤害',
      skip_turn: '跳过回合',
      armor_pen: '破防比例',
    };
    const COMBAT_EFFECT_SCHEMA_TO_RUNTIME_KEY = {
      持续伤害: 'dot_damage',
      跳过回合: 'skip_turn',
      破防比例: 'armor_pen',
    };
    const COMBAT_EFFECT_BOOLEAN_KEYS = new Set([
      'skip_turn',
      'cannot_react',
      'silence',
      'disarm',
      'blind',
      'super_armor',
    ]);
    const COMBAT_EFFECT_RUNTIME_DEFAULTS = {
      skip_turn: false,
      dot_damage: 0,
      armor_pen: 0,
    };

    function normalizeCombatStageValue(value, fallback = '宣告阶段') {
      const stage = String(value ?? '').trim();
      if (!stage) return fallback;
      if (['无', '宣告阶段', '对轰判定阶段', '回合结算阶段'].includes(stage)) return stage;
      return fallback;
    }

    function coerceRuntimeCombatEffectValue(key, value, fallback) {
      if (COMBAT_EFFECT_BOOLEAN_KEYS.has(key)) return value === true;
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) return fallback;
      return parsed;
    }

    function buildRuntimeStatRatioFromCondition(condition) {
      const runtimeMods = {};
      const rawRuntimeMods =
        condition?.面板修改比例 && typeof condition.面板修改比例 === 'object' && !Array.isArray(condition.面板修改比例)
          ? condition.面板修改比例
          : {};
      Object.entries(rawRuntimeMods).forEach(([key, value]) => {
        const runtimeKey = COMBAT_STAT_RATIO_SCHEMA_TO_RUNTIME_KEY[key] || key;
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) return;
        runtimeMods[runtimeKey] = parsed;
      });

      const rawSchemaMods =
        condition?.面板倍率 && typeof condition.面板倍率 === 'object' && !Array.isArray(condition.面板倍率)
          ? condition.面板倍率
          : {};
      Object.entries(COMBAT_STAT_RATIO_SCHEMA_TO_RUNTIME_KEY).forEach(([schemaKey, runtimeKey]) => {
        const parsed = Number(rawSchemaMods[schemaKey]);
        if (!Number.isFinite(parsed)) return;
        runtimeMods[runtimeKey] = parsed;
      });

      return runtimeMods;
    }

    function buildRuntimeCombatEffectsFromCondition(condition) {
      const normalized = createEmptyCombatEffectMap();
      const rawEffects =
        condition?.战斗效果 && typeof condition.战斗效果 === 'object' && !Array.isArray(condition.战斗效果)
          ? condition.战斗效果
          : {};

      Object.keys(normalized).forEach(runtimeKey => {
        if (rawEffects[runtimeKey] === undefined) return;
        normalized[runtimeKey] = coerceRuntimeCombatEffectValue(
          runtimeKey,
          rawEffects[runtimeKey],
          normalized[runtimeKey],
        );
      });

      Object.entries(COMBAT_EFFECT_SCHEMA_TO_RUNTIME_KEY).forEach(([schemaKey, runtimeKey]) => {
        if (rawEffects[schemaKey] === undefined) return;
        normalized[runtimeKey] = coerceRuntimeCombatEffectValue(
          runtimeKey,
          rawEffects[schemaKey],
          COMBAT_EFFECT_RUNTIME_DEFAULTS[runtimeKey] ?? normalized[runtimeKey],
        );
      });

      return normalized;
    }

    function normalizeCombatConditionForRuntime(condition) {
      const source = sanitizeCombatPersistenceData(deepClonePlain(condition || {}));
      const durationCandidate = source.duration !== undefined ? source.duration : source.持续回合;
      const durationParsed = Number(durationCandidate);
      const duration = Number.isFinite(durationParsed) ? Math.max(0, durationParsed) : 0;
      const layerParsed = Number(source.层数);
      return {
        ...source,
        类型: String(source.类型 || 'buff'),
        层数: Number.isFinite(layerParsed) ? layerParsed : 1,
        描述: String(source.描述 || '无'),
        duration,
        面板修改比例: buildRuntimeStatRatioFromCondition(source),
        战斗效果: buildRuntimeCombatEffectsFromCondition(source),
      };
    }

    function normalizeCombatConditionMapForRuntime(conditionMap) {
      if (!conditionMap || typeof conditionMap !== 'object' || Array.isArray(conditionMap)) return {};
      const normalized = {};
      Object.entries(conditionMap).forEach(([name, condition]) => {
        if (!name) return;
        normalized[name] = normalizeCombatConditionForRuntime(condition);
      });
      return normalized;
    }

    function buildSchemaStatRatioFromCondition(condition) {
      const schemaMods = {};
      const runtimeMods =
        condition?.面板修改比例 && typeof condition.面板修改比例 === 'object' && !Array.isArray(condition.面板修改比例)
          ? condition.面板修改比例
          : {};
      Object.entries(COMBAT_STAT_RATIO_RUNTIME_TO_SCHEMA_KEY).forEach(([runtimeKey, schemaKey]) => {
        const parsed = Number(runtimeMods[runtimeKey]);
        if (!Number.isFinite(parsed)) return;
        schemaMods[schemaKey] = parsed;
      });

      const rawSchemaMods =
        condition?.面板倍率 && typeof condition.面板倍率 === 'object' && !Array.isArray(condition.面板倍率)
          ? condition.面板倍率
          : {};
      Object.keys(COMBAT_STAT_RATIO_SCHEMA_TO_RUNTIME_KEY).forEach(schemaKey => {
        const parsed = Number(rawSchemaMods[schemaKey]);
        if (!Number.isFinite(parsed)) return;
        schemaMods[schemaKey] = parsed;
      });

      return schemaMods;
    }

    function buildSchemaCombatEffectsFromCondition(condition) {
      const schemaEffects = {};
      const rawEffects =
        condition?.战斗效果 && typeof condition.战斗效果 === 'object' && !Array.isArray(condition.战斗效果)
          ? condition.战斗效果
          : {};

      Object.entries(COMBAT_EFFECT_RUNTIME_TO_SCHEMA_KEY).forEach(([runtimeKey, schemaKey]) => {
        let value = rawEffects[runtimeKey];
        if (value === undefined && rawEffects[schemaKey] !== undefined) value = rawEffects[schemaKey];
        if (value === undefined) value = COMBAT_EFFECT_RUNTIME_DEFAULTS[runtimeKey];
        const normalized =
          runtimeKey === 'skip_turn' ? value === true : Number.isFinite(Number(value)) ? Number(value) : 0;
        schemaEffects[schemaKey] = normalized;
      });

      return schemaEffects;
    }

    function buildCombatConditionPersistenceSnapshot(condition) {
      const source = sanitizeCombatPersistenceData(deepClonePlain(condition || {}));
      const durationCandidate = source.持续回合 !== undefined ? source.持续回合 : source.duration;
      const durationParsed = Number(durationCandidate);
      const duration = Number.isFinite(durationParsed) ? Math.max(0, durationParsed) : 0;
      const layerParsed = Number(source.层数);
      return {
        类型: String(source.类型 || 'buff'),
        层数: Number.isFinite(layerParsed) ? layerParsed : 1,
        描述: String(source.描述 || '无'),
        持续回合: duration,
        面板倍率: buildSchemaStatRatioFromCondition(source),
        战斗效果: buildSchemaCombatEffectsFromCondition(source),
      };
    }

    function buildCombatConditionMapPersistenceSnapshot(conditionMap) {
      if (!conditionMap || typeof conditionMap !== 'object' || Array.isArray(conditionMap)) return {};
      const snapshot = {};
      Object.entries(conditionMap).forEach(([name, condition]) => {
        if (!name) return;
        snapshot[name] = buildCombatConditionPersistenceSnapshot(condition);
      });
      return snapshot;
    }

    function buildCanonicalCombatStatSnapshot(participant, statKeys = COMBAT_PROCESS_SYNC_STAT_KEYS) {
      if (!participant || typeof participant !== 'object') return undefined;
      const sourceStat = participant.属性 && typeof participant.属性 === 'object' ? participant.属性 : participant;
      const snapshot = {};
      statKeys.forEach(key => {
        if (sourceStat[key] === undefined) return;
        if (key === '状态效果') {
          snapshot[key] = buildCombatConditionMapPersistenceSnapshot(sourceStat[key]);
          return;
        }
        snapshot[key] = clonePersistedCombatValue(sourceStat[key]);
      });
      return Object.keys(snapshot).length ? snapshot : undefined;
    }

    function buildCanonicalCombatStatusSnapshot(participant, statusKeys = COMBAT_PROCESS_SYNC_STATUS_KEYS) {
      if (!participant || typeof participant !== 'object') return undefined;
      const sourceStatus = participant.状态 && typeof participant.状态 === 'object' ? participant.状态 : participant;
      const snapshot = {};
      statusKeys.forEach(key => {
        if (sourceStatus[key] !== undefined) snapshot[key] = clonePersistedCombatValue(sourceStatus[key]);
      });
      return Object.keys(snapshot).length ? snapshot : undefined;
    }

    function buildCanonicalParticipantPersistenceSnapshot(participant, options = {}) {
      if (!participant || typeof participant !== 'object') return undefined;
      const source = sanitizeCombatPersistenceData(participant);
      const snapshot = {};
      const statSnapshot = buildCanonicalCombatStatSnapshot(source);
      const statusSnapshot = buildCanonicalCombatStatusSnapshot(source);
      if (statSnapshot) snapshot.属性 = statSnapshot;
      if (statusSnapshot) snapshot.状态 = statusSnapshot;
      if (options.includeHpFields) {
        const hpSnapshot = buildCanonicalCombatStatSnapshot(source, ['HP', 'HP上限']);
        if (hpSnapshot) snapshot.属性 = { ...(snapshot.属性 || {}), ...hpSnapshot };
      }
      ['持续效果', '蓄力技能', '决策记忆', '血脉之力'].forEach(key => {
        if (source[key] !== undefined) snapshot[key] = clonePersistedCombatValue(source[key]);
      });
      const equipmentSnapshot = source.装备;
      if (equipmentSnapshot !== undefined) snapshot.装备 = clonePersistedCombatValue(equipmentSnapshot);
      return Object.keys(snapshot).length ? snapshot : undefined;
    }

    function appendJsonPatchDiff(ops, basePath, previousValue, nextValue) {
      if (!basePath) return;

      if (nextValue === undefined) {
        if (previousValue !== undefined) ops.push({ op: 'remove', path: basePath });
        return;
      }

      if (previousValue === undefined) {
        ops.push({ op: 'add', path: basePath, value: deepClonePlain(nextValue) });
        return;
      }

      if (isDeepEqual(previousValue, nextValue)) return;

      const prevIsArray = Array.isArray(previousValue);
      const nextIsArray = Array.isArray(nextValue);
      if (prevIsArray || nextIsArray) {
        ops.push({ op: 'replace', path: basePath, value: deepClonePlain(nextValue) });
        return;
      }

      const prevIsObject = isPlainRecord(previousValue);
      const nextIsObject = isPlainRecord(nextValue);
      if (prevIsObject && nextIsObject) {
        const keys = new Set([...Object.keys(previousValue), ...Object.keys(nextValue)]);
        keys.forEach(key => {
          appendJsonPatchDiff(
            ops,
            `${basePath}/${escapeJsonPointerSegment(key)}`,
            previousValue[key],
            nextValue[key],
          );
        });
        return;
      }

      ops.push({ op: 'replace', path: basePath, value: deepClonePlain(nextValue) });
    }

    function appendLegacyParticipantCleanupOps(ops, participantPath, currentCharData) {
      if (!participantPath || !currentCharData || typeof currentCharData !== 'object') return;
      const legacyKeys = new Set([...COMBAT_STAT_KEYS, ...COMBAT_STATUS_KEYS]);
      legacyKeys.forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(currentCharData, key)) return;
        ops.push({ op: 'remove', path: `${participantPath}/${escapeJsonPointerSegment(key)}` });
      });
    }

    function appendParticipantHpRecoverySnapshot(nextSnapshot, previousSnapshot, participant) {
      const sourceStat = participant?.属性 && typeof participant.属性 === 'object' ? participant.属性 : participant;
      const previousStat = previousSnapshot?.属性 && typeof previousSnapshot.属性 === 'object' ? previousSnapshot.属性 : {};
      const nextHp = Number(sourceStat?.HP);
      const prevHp = Number(previousStat?.HP);
      if (!Number.isFinite(nextHp)) return nextSnapshot;
      if (Number.isFinite(prevHp) && nextHp <= prevHp) return nextSnapshot;
      const hpFields = buildCanonicalCombatStatSnapshot(participant, ['HP', 'HP上限']);
      if (!hpFields) return nextSnapshot;
      nextSnapshot.属性 = { ...(nextSnapshot.属性 || {}), ...hpFields };
      return nextSnapshot;
    }

    function isTemporaryCombatParticipant(participant) {
      return !!(
        participant &&
        typeof participant === 'object' &&
        String(participant.来源 || '').trim() === '临时单位' &&
        String(participant.单位性质 || '').trim()
      );
    }

    function buildTemporaryCombatParticipantPersistenceSnapshot(participant) {
      if (!participant || typeof participant !== 'object') return undefined;
      const source = sanitizeCombatPersistenceData(deepClonePlain(participant));
      const snapshot = {
        name: String(source.name || '').trim() || '未知',
        来源: '临时单位',
        单位性质: String(source.单位性质 || '').trim(),
      };
      ['身份', '数量', '等级', '年限', '品质', '标准物种', '级别', '标准种族'].forEach(key => {
        if (source[key] !== undefined) snapshot[key] = clonePersistedCombatValue(source[key]);
      });
      const canonical = buildCanonicalParticipantPersistenceSnapshot(source) || {};
      Object.assign(snapshot, canonical);
      const hpFields = buildCanonicalCombatStatSnapshot(source, ['HP', 'HP上限']) || {};
      if (Object.keys(hpFields).length) {
        snapshot.属性 = { ...(snapshot.属性 || {}), ...hpFields };
      }
      if (source.状态 && typeof source.状态 === 'object') {
        snapshot.状态 = {
          ...(snapshot.状态 || {}),
          存活: source.状态.存活 !== false,
          ...(source.状态.受伤部位 !== undefined ? { 受伤部位: clonePersistedCombatValue(source.状态.受伤部位) } : {}),
        };
      }
      if (source.特殊能力 && typeof source.特殊能力 === 'object' && !Array.isArray(source.特殊能力)) {
        snapshot.特殊能力 = clonePersistedCombatValue(source.特殊能力);
      }
      return snapshot;
    }

    function pushParticipantSyncPatch(ops, participant, options = {}) {
      if (!participant || typeof participant !== 'object') return;
      if (isTemporaryCombatParticipant(participant)) return;
      const participantName = String(participant.name || '').trim();
      if (!participantName) return;

      const participantPath = `/char/${escapeJsonPointerSegment(participantName)}`;
      const currentCharData = getMvuValue(`char.${participantName}`, undefined);
      const previousSnapshot = buildCanonicalParticipantPersistenceSnapshot(currentCharData) || {};
      const nextSnapshot = buildCanonicalParticipantPersistenceSnapshot(participant);
      if (!nextSnapshot || typeof nextSnapshot !== 'object' || Object.keys(nextSnapshot).length === 0) return;
      if (options.syncHpRecoveryOnly) appendParticipantHpRecoverySnapshot(nextSnapshot, previousSnapshot, participant);
      const fieldKeys = new Set([...Object.keys(previousSnapshot), ...Object.keys(nextSnapshot)]);

      fieldKeys.forEach(key => {
        appendJsonPatchDiff(
          ops,
          `${participantPath}/${escapeJsonPointerSegment(key)}`,
          previousSnapshot[key],
          nextSnapshot[key],
        );
      });

      appendLegacyParticipantCleanupOps(ops, participantPath, currentCharData);
    }

    const COMBAT_WORLD_PERSIST_KEYS = [
      '进行中',
      '战斗类型',
      '战斗意图',
      '先攻',
      '允许撤离',
      '环境',
      '裁断结果',
      'floor',
      '大关卡',
      '大关标签',
      '关卡范围',
      '关底战',
      '魂灵塔待结算',
    ];

    const COMBAT_WORLD_TRANSIENT_KEYS = [
      '阶段',
      '裁断约束',
      '前端建议结果',
      '建议终点HP区间',
      '前端推荐终点HP',
      '预计HP伤害',
      '本次操作',
    ];

    function compactCombatParticipantForPersistence(participant) {
      if (participant === null || participant === undefined) return undefined;
      if (typeof participant === 'string' || typeof participant === 'number') {
        return { name: String(participant) };
      }
      if (typeof participant !== 'object' || Array.isArray(participant)) return undefined;
      const source = sanitizeCombatPersistenceData(participant);
      if (isTemporaryCombatParticipant(source)) {
        return buildTemporaryCombatParticipantPersistenceSnapshot(source);
      }
      const compact = {};
      const participantName = String(source.name || '').trim();
      if (participantName) compact.name = participantName;
      if (source.势力 !== undefined) compact.势力 = String(source.势力 || '');
      const aliveCandidate =
        source.存活 !== undefined
          ? source.存活
          : source.状态 && typeof source.状态 === 'object'
            ? source.状态.存活
            : undefined;
      if (aliveCandidate !== undefined) compact.存活 = aliveCandidate !== false;
      return Object.keys(compact).length ? compact : undefined;
    }

    function compactCombatDataForPersistence(combatData) {
      const source = sanitizeCombatPersistenceData(deepClonePlain(combatData || {}));
      const compact = {};

      COMBAT_WORLD_PERSIST_KEYS.forEach(key => {
        if (source[key] !== undefined) compact[key] = source[key];
      });

      const roundCandidate = source.回合;
      if (roundCandidate !== undefined) {
        const roundParsed = Number(roundCandidate);
        compact.回合 = Number.isFinite(roundParsed) ? Math.max(0, roundParsed) : 0;
      }

      const participants = source.参战者 && typeof source.参战者 === 'object' ? source.参战者 : undefined;
      if (participants) {
        const compactParticipants = {};
        const player = compactCombatParticipantForPersistence(participants.player);
        const enemy = compactCombatParticipantForPersistence(participants.enemy);
        if (player) compactParticipants.player = player;
        if (enemy) compactParticipants.enemy = enemy;
        if (Array.isArray(participants.team_player)) {
          compactParticipants.team_player = participants.team_player
            .map(compactCombatParticipantForPersistence)
            .filter(Boolean);
        }
        if (Array.isArray(participants.team_enemy)) {
          compactParticipants.team_enemy = participants.team_enemy
            .map(compactCombatParticipantForPersistence)
            .filter(Boolean);
        }
        if (Object.keys(compactParticipants).length) compact.参战者 = compactParticipants;
      }

      return compact;
    }

    function buildCombatJsonPatch(combatData, options = {}) {
      const fullCombatData = sanitizeCombatPersistenceData(deepClonePlain(combatData || {}));
      const safeCombatData = compactCombatDataForPersistence(fullCombatData);
      const ops = [];
      const previousRawCombatData = sanitizeCombatPersistenceData(getMvuValue('world.战斗', undefined));
      const previousCombatData = compactCombatDataForPersistence(previousRawCombatData);
      appendJsonPatchDiff(ops, '/world/战斗', previousCombatData, safeCombatData);
      if (previousRawCombatData && typeof previousRawCombatData === 'object') {
        COMBAT_WORLD_TRANSIENT_KEYS.forEach(key => {
          if (!Object.prototype.hasOwnProperty.call(previousRawCombatData, key)) return;
          ops.push({ op: 'remove', path: `/world/战斗/${escapeJsonPointerSegment(key)}` });
        });
      }

      const participants = fullCombatData?.参战者;
      if (!participants) return ops;
      if (options.skipParticipantSync === true) return ops;

      pushParticipantSyncPatch(ops, participants.player, options);
      pushParticipantSyncPatch(ops, participants.enemy, options);
      (participants.team_player || []).forEach(unit => pushParticipantSyncPatch(ops, unit, options));
      (participants.team_enemy || []).forEach(unit => pushParticipantSyncPatch(ops, unit, options));

      return ops;
    }

    function buildUpdateVariableText(patchOps, options = {}) {
      const analysis = String(
        options.analysis ||
          'Frontend battle arbitration already produced the exact combat result. Apply the following JSONPatch exactly as given.',
      ).trim();
      return `<UpdateVariable>\n<Analysis>${analysis}</Analysis>\n<JSONPatch>\n${JSON.stringify(patchOps || [], null, 2)}\n</JSONPatch>\n</UpdateVariable>`;
    }

    function persistCombatData(combatData, options = {}) {
      const safeCombatData = compactCombatDataForPersistence(combatData);
      const patchOps = buildCombatJsonPatch(combatData, {
        syncHpRecoveryOnly: options.syncHpRecoveryOnly !== false,
        skipParticipantSync: options.skipParticipantSync === true,
      });
      if (Array.isArray(options.extraPatchOps)) {
        patchOps.push(...options.extraPatchOps);
      }
      const updateVariableText = buildUpdateVariableText(patchOps, options);
      const detail = {
        combatData: safeCombatData,
        patchOps,
        updateVariableText,
        rootPath: '/world/战斗',
      };

      root.__lastBattleMvuUpdateRequest = detail;

      const bridge = root.BattleUIBridge || {};
      const adapter = bridge.hostAdapter || root.__battleUIHostAdapter;
      if (typeof bridge.onCombatDataChanged === 'function') {
        try {
          detail.delivery = bridge.onCombatDataChanged(detail);
        } catch (error) {
          console.warn('BattleUIBridge.onCombatDataChanged failed', error);
        }
      } else if (adapter && typeof adapter.onCombatDataChanged === 'function') {
        try {
          detail.delivery = adapter.onCombatDataChanged(detail);
        } catch (error) {
          console.warn('BattleUI hostAdapter.onCombatDataChanged failed', error);
        }
      }

      try {
        root.dispatchEvent(new CustomEvent('battle-ui-mvu-update-request', { detail }));
      } catch (error) {
        console.warn('battle-ui-mvu-update-request dispatch failed', error);
      }

      try {
        root.dispatchEvent(new CustomEvent('battle-ui-combat-data-changed', { detail }));
      } catch (error) {
        console.warn('battle-ui-combat-data-changed dispatch failed', error);
      }

      return detail;
    }

    function getHostWindow() {
      try {
        if (root.parent && root.parent !== root && root.parent.document) return root.parent;
      } catch (error) {
        console.warn('BattleUIBridge: parent window unavailable, fallback current window', error);
      }
      return root;
    }

    function getHostDocument() {
      return getHostWindow().document || document;
    }

    function findFirstElement(selectors, doc = getHostDocument()) {
      for (const selector of selectors) {
        const node = doc.querySelector(selector);
        if (node) return node;
      }
      return null;
    }

    function createInputEvent(type) {
      try {
        return new InputEvent(type, { bubbles: true, cancelable: true, composed: true });
      } catch (error) {
        return new Event(type, { bubbles: true, cancelable: true, composed: true });
      }
    }

    function setElementValue(element, value) {
      if (!element) return false;
      const nextValue = String(value ?? '');
      if (element.isContentEditable) {
        if ('textContent' in element) element.textContent = nextValue;
        if ('innerText' in element && element.innerText !== nextValue) element.innerText = nextValue;
        element.dispatchEvent(createInputEvent('input'));
        element.dispatchEvent(createInputEvent('change'));
        return true;
      }
      const prototype = element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
      if (descriptor?.set) descriptor.set.call(element, nextValue);
      else element.value = nextValue;
      element.dispatchEvent(createInputEvent('input'));
      element.dispatchEvent(createInputEvent('change'));
      return true;
    }

    function findChatInput(doc = getHostDocument()) {
      return findFirstElement(
        [
          '#send_textarea',
          '#chat_input',
          '#user-input',
          '#user_input',
          'textarea[data-testid="chat-input"]',
          'textarea[placeholder*="发送"]',
          'textarea[placeholder*="Send"]',
          'textarea[name="chat_input"]',
          'textarea[name="user_input"]',
          '[contenteditable="true"][data-testid="chat-input"]',
          'form [contenteditable="true"][role="textbox"]',
          '[contenteditable="true"][aria-label*="Send"]',
          '[contenteditable="true"][aria-label*="发送"]',
          'form textarea',
          'textarea',
        ],
        doc,
      );
    }

    function findSendButton(doc = getHostDocument()) {
      return findFirstElement(
        [
          '#send_but',
          '#send-button',
          'button[data-testid="send-button"]',
          'button[title*="Send"]',
          'button[aria-label*="Send"]',
          'button[aria-label*="发送"]',
          'button[title*="发送"]',
          'form button[type="submit"]',
        ],
        doc,
      );
    }

    function fillChatInput(text, options = {}) {
      const doc = options.document || getHostDocument();
      const input = findChatInput(doc);
      const ok = setElementValue(input, text);
      if (ok && typeof input?.focus === 'function') input.focus();
      return { ok, input };
    }

    function clickSendButton(options = {}) {
      const doc = options.document || getHostDocument();
      const button = findSendButton(doc);
      if (!button) return { ok: false, button: null };
      button.click();
      return { ok: true, button };
    }

    function queueSystemPrompt(text) {
      const prompt = String(text || '');
      root.__battlePendingSystemPrompt = prompt;
      try {
        root.dispatchEvent(new CustomEvent('battle-ui-system-prompt-ready', { detail: { systemPrompt: prompt } }));
      } catch (error) {
        console.warn('battle-ui-system-prompt-ready dispatch failed', error);
      }
      return prompt;
    }

    function deliverBattleRequest(detail, options = {}) {
      const bridge = root.BattleUIBridge || {};
      if (typeof bridge.hostSend === 'function') {
        return bridge.hostSend({ ...detail, options });
      }
      const adapter = bridge.hostAdapter || root.__battleUIHostAdapter;
      if (adapter && typeof adapter.sendUIRequest === 'function') {
        return adapter.sendUIRequest({ ...detail, options });
      }
      if (adapter && typeof adapter.sendBattleRequest === 'function') {
        return adapter.sendBattleRequest({ ...detail, options });
      }

      return {
        ok: false,
        mode: 'host-unavailable',
        reason: 'battle_host_send_unavailable',
      };
    }

    function looksLikeGenerationUrl(url) {
      return /(generate|completion|chat-completions|text-completions|api\/backends|v1\/chat\/completions|v1\/completions)/i.test(
        String(url || ''),
      );
    }

    function appendPromptText(base, extra) {
      const baseText = String(base || '').trim();
      const extraText = String(extra || '').trim();
      if (!extraText) return base;
      if (!baseText) return extraText;
      return `${baseText}\n\n${extraText}`;
    }

    function consumeQueuedSystemPromptForInjection(meta = {}) {
      const prompt = String(root.__battlePendingSystemPrompt || '').trim();
      if (!prompt) return '';
      root.__battlePendingSystemPrompt = '';
      root.__battleLastInjectedSystemPrompt = {
        prompt,
        ...meta,
        at: Date.now(),
      };
      try {
        root.dispatchEvent(
          new CustomEvent('battle-ui-system-prompt-consumed', {
            detail: root.__battleLastInjectedSystemPrompt,
          }),
        );
      } catch (error) {
        console.warn('battle-ui-system-prompt-consumed dispatch failed', error);
      }
      return prompt;
    }

    function injectSystemPromptIntoPayload(payload, prompt) {
      if (!payload || typeof payload !== 'object' || !prompt) {
        return { payload, injected: false, channel: null };
      }

      let injected = false;
      let channel = null;

      if (Array.isArray(payload.messages)) {
        const messages = payload.messages.map(msg => ({ ...msg }));
        const firstSystemIndex = messages.findIndex(msg => msg?.role === 'system');
        if (firstSystemIndex >= 0) {
          const target = { ...messages[firstSystemIndex] };
          if (typeof target.content === 'string' || target.content == null) {
            target.content = appendPromptText(target.content || '', prompt);
            messages[firstSystemIndex] = target;
          } else {
            messages.splice(firstSystemIndex, 0, { role: 'system', content: prompt });
          }
        } else {
          messages.unshift({ role: 'system', content: prompt });
        }
        payload = { ...payload, messages };
        injected = true;
        channel = 'messages.system';
      } else if (typeof payload.system === 'string' || payload.system == null) {
        payload = { ...payload, system: appendPromptText(payload.system || '', prompt) };
        injected = true;
        channel = 'system';
      } else if (typeof payload.systemPrompt === 'string' || payload.systemPrompt == null) {
        payload = { ...payload, systemPrompt: appendPromptText(payload.systemPrompt || '', prompt) };
        injected = true;
        channel = 'systemPrompt';
      } else if (typeof payload.instruction === 'string' || payload.instruction == null) {
        payload = { ...payload, instruction: appendPromptText(payload.instruction || '', prompt) };
        injected = true;
        channel = 'instruction';
      } else if (typeof payload.instructions === 'string' || payload.instructions == null) {
        payload = { ...payload, instructions: appendPromptText(payload.instructions || '', prompt) };
        injected = true;
        channel = 'instructions';
      } else if (typeof payload.prompt === 'string') {
        payload = { ...payload, prompt: `${prompt}\n\n${payload.prompt}` };
        injected = true;
        channel = 'prompt';
      }

      return { payload, injected, channel };
    }

    function patchRequestBodyIfNeeded(bodyText, url, transport) {
      const pendingPrompt = String(root.__battlePendingSystemPrompt || '').trim();
      if (!pendingPrompt || !looksLikeGenerationUrl(url) || typeof bodyText !== 'string' || !bodyText.trim()) {
        return { bodyText, injected: false, channel: null };
      }

      try {
        const payload = JSON.parse(bodyText);
        const promptToInject = consumeQueuedSystemPromptForInjection({ url: String(url || ''), transport });
        if (!promptToInject) return { bodyText, injected: false, channel: null };
        const result = injectSystemPromptIntoPayload(payload, promptToInject);
        if (!result.injected) {
          root.__battlePendingSystemPrompt = promptToInject;
          return { bodyText, injected: false, channel: null };
        }
        return {
          bodyText: JSON.stringify(result.payload),
          injected: true,
          channel: result.channel,
        };
      } catch (error) {
        return { bodyText, injected: false, channel: null };
      }
    }

    function installFetchHook() {
      const host = getHostWindow();
      if (!host || host.__battleUIFetchHookInstalled || typeof host.fetch !== 'function') return;
      const nativeFetch = host.fetch.bind(host);
      const HostRequest = host.Request || Request;

      host.fetch = async function (input, init) {
        let nextInput = input;
        let nextInit = init;
        const url = typeof input === 'string' ? input : input?.url || init?.url || '';

        if (init?.body && typeof init.body === 'string') {
          const patched = patchRequestBodyIfNeeded(init.body, url, 'fetch:init');
          if (patched.injected) {
            nextInit = { ...init, body: patched.bodyText };
          }
        } else if (typeof HostRequest !== 'undefined' && input instanceof HostRequest && !init?.body) {
          try {
            const cloned = input.clone();
            const bodyText = await cloned.text();
            const patched = patchRequestBodyIfNeeded(bodyText, url, 'fetch:request');
            if (patched.injected) {
              nextInput = new HostRequest(input, { body: patched.bodyText });
            }
          } catch (error) {
            // ignore request body patch failure
          }
        }

        return nativeFetch(nextInput, nextInit);
      };

      host.__battleUIFetchHookInstalled = true;
    }

    function installXHRHook() {
      const host = getHostWindow();
      const XHR = host?.XMLHttpRequest;
      if (!XHR || XHR.prototype.__battleUIXHRHookInstalled) return;
      const nativeOpen = XHR.prototype.open;
      const nativeSend = XHR.prototype.send;

      XHR.prototype.open = function (method, url, ...rest) {
        this.__battleUIRequestUrl = url;
        return nativeOpen.call(this, method, url, ...rest);
      };

      XHR.prototype.send = function (body) {
        if (typeof body === 'string') {
          const patched = patchRequestBodyIfNeeded(body, this.__battleUIRequestUrl, 'xhr');
          if (patched.injected) {
            body = patched.bodyText;
          }
        }
        return nativeSend.call(this, body);
      };

      XHR.prototype.__battleUIXHRHookInstalled = true;
    }

    function installHostHooks() {
      installFetchHook();
      installXHRHook();
    }

    if (typeof root.sendToAI !== 'function') {
      root.sendToAI = function (playerInput, systemPrompt, meta = {}) {
        const requestKind = String(meta?.requestKind || 'battle_arbitration');
        const detail = {
          requestSource: 'Battle_UI',
          requestKind,
          playerInput: String(playerInput || ''),
          systemPrompt: String(systemPrompt || ''),
          mvuUpdate: meta?.mvuUpdate || null,
          channels: {
            userInput: String(playerInput || ''),
            hiddenSystemPrompt: String(systemPrompt || ''),
            updateVariableText: String(meta?.mvuUpdate?.updateVariableText || ''),
            requestKind,
          },
        };
        detail.delivery = deliverBattleRequest(detail, { autoSend: meta?.autoSend !== false });
        root.__lastBattleAIRequest = detail;
        try {
          root.dispatchEvent(new CustomEvent('battle-ui-ai-request', { detail }));
        } catch (error) {
          console.warn('battle-ui-ai-request dispatch failed', error);
        }
        return detail;
      };
    }

    root.BattleUIBridge = Object.assign(root.BattleUIBridge || {}, {
      hasMvu() {
        return hasMvuRuntime();
      },
      async waitForMvuReady() {
        return waitForMvuReady();
      },
      getAllVariables() {
        return getAllVariablesSafe();
      },
      getStatData() {
        return getMvuValue('', {});
      },
      getMVU(path) {
        return getMvuValue(path);
      },
      setMVU(path, value) {
        console.warn(
          'BattleUIBridge.setMVU 未启用：当前按明月秋青规范仅从 getAllVariables()/stat_data 读取 MVU 变量。',
          path,
          value,
        );
        return false;
      },
      initCombatContext() {
        console.warn('BattleUIBridge.initCombatContext 已停用：战斗上下文应由 MVU 系统维护在 stat_data.* 下。');
        return getMvuValue('world.战斗');
      },
      getBattleContext() {
        return getMvuValue('world.战斗');
      },
      subscribeMvuUpdates(handler) {
        return subscribeMvuUpdates(handler);
      },
      persistCombatData(combatData, options = {}) {
        return persistCombatData(combatData, options);
      },
      executePlayerBattleIntent(playerInput, options = {}) {
        const impl = root.BattleUIBridge?.__executePlayerBattleIntentImpl;
        if (typeof impl === 'function') return impl(playerInput, options);
        throw new Error('battle_player_intent_engine_not_ready');
      },
      executeBattleFlow(combatData, options = {}) {
        const impl = root.BattleUIBridge?.__executeBattleFlowImpl;
        if (typeof impl === 'function') return impl(combatData, options);
        throw new Error('battle_flow_engine_not_ready');
      },
      getBattleSnapshot(combatData) {
        const impl = root.BattleUIBridge?.__getBattleSnapshotImpl;
        if (typeof impl === 'function') return impl(combatData);
        return null;
      },
      getAvailableActions(charData, combatData) {
        const impl = root.BattleUIBridge?.__getAvailableActionsImpl;
        if (typeof impl === 'function') return impl(charData, combatData);
        return [];
      },
      buildCombatJsonPatch(combatData) {
        return buildCombatJsonPatch(combatData);
      },
      buildUpdateVariableTextFromCombat(combatData, options = {}) {
        return buildUpdateVariableText(buildCombatJsonPatch(combatData), options);
      },
      getLastMvuUpdateRequest() {
        return root.__lastBattleMvuUpdateRequest || null;
      },
      setCombatContext() {
        console.warn('BattleUIBridge.setCombatContext 已停用：请通过 MVU 系统更新 stat_data.*。');
        return getMvuValue('world.战斗');
      },
      findChatInput() {
        return findChatInput();
      },
      findSendButton() {
        return findSendButton();
      },
      pushUserInput(text, options = {}) {
        const payload = String(text || '');
        const fillResult = fillChatInput(payload, options);
        const sendResult = options.autoSend === false ? { ok: false, button: null } : clickSendButton(options);
        return {
          text: payload,
          filled: !!fillResult.ok,
          sent: !!sendResult.ok,
          inputFound: !!fillResult.input,
          sendButtonFound: !!sendResult.button,
        };
      },
      setPendingSystemPrompt(text) {
        return queueSystemPrompt(text);
      },
      getPendingSystemPrompt() {
        return root.__battlePendingSystemPrompt || '';
      },
      consumePendingSystemPrompt() {
        const prompt = root.__battlePendingSystemPrompt || '';
        root.__battlePendingSystemPrompt = '';
        return prompt;
      },
      clearPendingSystemPrompt() {
        root.__battlePendingSystemPrompt = '';
      },
      setHostAdapter(adapter) {
        root.__battleUIHostAdapter = adapter || null;
        return root.__battleUIHostAdapter;
      },
      getHostAdapter() {
        return root.__battleUIHostAdapter || null;
      },
      installHostHooks() {
        installHostHooks();
      },
      getLastInjectedSystemPrompt() {
        return root.__battleLastInjectedSystemPrompt || null;
      },
      deliverBattleRequest(detail, options = {}) {
        return deliverBattleRequest(detail, options);
      },
      getLastAIRequest() {
        return root.__lastBattleAIRequest || null;
      },
    });

    root.getBattleUiMvuValue = getMvuValue;
    root.getBattleUiAllVariables = getAllVariablesSafe;
    root.waitBattleUiMvuReady = waitForMvuReady;

    function fallbackNumber(value, fallback = 0) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    }

    function fallbackEscape(value) {
      return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function fallbackUnit(unit) {
      const safeUnit = unit && typeof unit === 'object' ? unit : {};
      const stat = safeUnit.属性 && typeof safeUnit.属性 === 'object' ? safeUnit.属性 : {};
      const merged = { ...stat, ...safeUnit };
      COMBAT_STAT_KEYS.forEach(key => {
        if (stat[key] !== undefined) merged[key] = stat[key];
      });
      merged.name = safeUnit.name || stat.name || safeUnit.base?.name || '未知';
      merged.等级 = fallbackNumber(merged.等级, 0);
      merged.系别 = merged.系别 || stat.系别 || '未知系';
      merged.HP上限 = Math.max(
        1,
        fallbackNumber(merged.HP上限, fallbackNumber(stat.HP上限, fallbackNumber(merged.体力上限, fallbackNumber(stat.体力上限, 1)))),
      );
      merged.HP = Math.max(
        0,
        fallbackNumber(merged.HP, fallbackNumber(stat.HP, fallbackNumber(merged.体力, fallbackNumber(stat.体力, merged.HP上限)))),
      );
      merged.体力上限 = Math.max(1, fallbackNumber(merged.体力上限, fallbackNumber(stat.体力上限, 1)));
      merged.体力 = Math.max(0, fallbackNumber(merged.体力, fallbackNumber(stat.体力, merged.体力上限)));
      merged.魂力上限 = Math.max(1, fallbackNumber(merged.魂力上限, fallbackNumber(stat.魂力上限, 1)));
      merged.魂力 = Math.max(0, fallbackNumber(merged.魂力, fallbackNumber(stat.魂力, merged.魂力上限)));
      merged.精神力上限 = Math.max(1, fallbackNumber(merged.精神力上限, fallbackNumber(stat.精神力上限, 1)));
      merged.精神力 = Math.max(0, fallbackNumber(merged.精神力, fallbackNumber(stat.精神力, merged.精神力上限)));
      merged.力量 = fallbackNumber(merged.力量, fallbackNumber(stat.力量, 0));
      merged.防御 = fallbackNumber(merged.防御, fallbackNumber(stat.防御, 0));
      merged.敏捷 = fallbackNumber(merged.敏捷, fallbackNumber(stat.敏捷, 0));
      merged.状态效果 = merged.状态效果 || stat.状态效果 || {};
      merged.持续效果 = merged.持续效果 || {};
      merged.vit_max = merged.HP上限;
      merged.vit = merged.HP;
      merged.sta_max = merged.体力上限;
      merged.sta = merged.体力;
      merged.sp_max = merged.魂力上限;
      merged.sp = merged.魂力;
      merged.men_max = merged.精神力上限;
      merged.men = merged.精神力;
      merged.str = merged.力量;
      merged.def = merged.防御;
      merged.agi = merged.敏捷;
      return merged;
    }

    function fallbackText(id, value) {
      const node = byId(id);
      if (node) node.textContent = String(value ?? '');
    }

    function fallbackBar(id, value, max) {
      const node = byId(id);
      if (!node) return;
      const ratio = Math.max(0, Math.min(100, (fallbackNumber(value, 0) / Math.max(1, fallbackNumber(max, 1))) * 100));
      node.style.width = `${ratio}%`;
    }

    function fallbackRenderStats(id, unit) {
      const node = byId(id);
      if (!node) return;
      node.innerHTML = [
        ['系别', unit.系别 || '未知'],
        ['力', Math.round(unit.力量 || 0)],
        ['防', Math.round(unit.防御 || 0)],
        ['速', Math.round(unit.敏捷 || 0)],
      ]
        .map(([label, value]) => `<div class="stat-item"><div class="stat-label">${fallbackEscape(label)}</div><div class="stat-value">${fallbackEscape(value)}</div></div>`)
        .join('');
    }

    function fallbackRenderBuffs(id, unit) {
      const node = byId(id);
      if (!node) return;
      const conditionChips = Object.entries(unit.状态效果 || {}).slice(0, 8).map(([name, condition]) => {
        const typeText = String(condition?.类型 || condition?.type || '').toLowerCase();
        const kind = /debuff|负面|伤|弱/.test(typeText) ? 'debuff' : 'buff';
        return `<span class="tag-chip ${kind}">${fallbackEscape(name)}</span>`;
      });
      const sustainChips = Object.keys(unit.持续效果 || {}).slice(0, 4).map(name => `<span class="tag-chip sustain">${fallbackEscape(name)}</span>`);
      node.innerHTML = [...conditionChips, ...sustainChips].join('');
    }

    function fallbackRenderUnit(prefix, rawUnit) {
      const unit = fallbackUnit(rawUnit);
      fallbackText(`ui-${prefix}-lv`, `Lv.${unit.等级 || 0}`);
      fallbackText(`ui-${prefix}-name`, unit.name || (prefix === 'player' ? '玩家' : '对手'));
      fallbackText(`ui-${prefix}-hp-text`, `${Math.round(unit.HP)} / ${Math.round(unit.HP上限)}`);
      fallbackText(`ui-${prefix}-sta-text`, `${Math.round(unit.体力)} / ${Math.round(unit.体力上限)}`);
      fallbackText(`ui-${prefix}-sp-text`, `${Math.round(unit.魂力)} / ${Math.round(unit.魂力上限)}`);
      fallbackText(`ui-${prefix}-men-text`, `${Math.round(unit.精神力)} / ${Math.round(unit.精神力上限)}`);
      fallbackBar(`ui-${prefix}-hp-bar`, unit.HP, unit.HP上限);
      fallbackBar(`ui-${prefix}-sta-bar`, unit.体力, unit.体力上限);
      fallbackBar(`ui-${prefix}-sp-bar`, unit.魂力, unit.魂力上限);
      fallbackBar(`ui-${prefix}-men-bar`, unit.精神力, unit.精神力上限);
      fallbackRenderStats(`ui-${prefix}-stats`, unit);
      fallbackRenderBuffs(`ui-${prefix}-buffs`, unit);
      return unit;
    }

    function fallbackPushSkill(actions, skill, fallbackName, category) {
      if (!skill || typeof skill !== 'object') return;
      const name = String(skill.魂技名 || skill.name || fallbackName || '').trim();
      if (!name) return;
      const effects = Array.isArray(skill._效果数组) ? skill._效果数组 : [];
      const systemEffect = effects.find(effect => effect && typeof effect === 'object' && effect.cast_time !== undefined) || {};
      actions.push({
        id: `skill_${actions.length}_${name}`,
        name,
        type: 'skill',
        action_type: '释放魂技',
        category: category || '魂技',
        skill,
        raw_skill: skill,
        cast_time: fallbackNumber(skill.cast_time ?? systemEffect.cast_time, 10),
        cost_text: skill?.__fusion_display_cost_text ? String(skill.__fusion_display_cost_text) : String(skill.消耗 || systemEffect.消耗 || ''),
        enabled: true,
      });
    }

    function fallbackCollectActions(charData) {
      const actions = [];
      const char = charData && typeof charData === 'object' ? charData : {};
      Object.entries(char.武魂 || {}).forEach(([spiritName, spirit]) => {
        Object.entries(spirit?.魂灵 || {}).forEach(([, soulSpirit]) => {
          Object.entries(soulSpirit?.魂环 || {}).forEach(([ringIndex, ring]) => {
            Object.entries(ring?.魂技 || {}).forEach(([skillName, skill]) => {
              fallbackPushSkill(actions, skill, skillName, spirit?.表象名称 || spiritName || `第${ringIndex}魂环`);
            });
          });
        });
      });
      Object.entries(char.特殊能力 || {}).forEach(([name, skill]) => fallbackPushSkill(actions, skill, name, '特殊能力'));
      Object.entries(char.武魂融合技 || {}).forEach(([name, fusion]) =>
        fallbackPushSkill(actions, buildFusionCombatSkill(fusion, name), `武魂融合技·${name}`, '融合'),
      );
      actions.push(
        { id: 'basic_attack', name: '普通攻击', type: 'tactical', action_type: '常规攻击', category: '战术', cast_time: 10, cost_text: '无', enabled: true, skill: { name: '普通攻击' } },
        { id: 'guard', name: '防御', type: 'tactical', action_type: '防御', category: '战术', cast_time: 10, cost_text: '无', enabled: true, skill: { name: '防御' } },
        { id: 'evade', name: '闪避', type: 'tactical', action_type: '闪避', category: '战术', cast_time: 12, cost_text: '体力', enabled: true, skill: { name: '闪避' } },
        { id: 'flee', name: '撤离', type: 'tactical', action_type: '撤离', category: '战术', cast_time: 20, cost_text: '无', enabled: true, skill: { name: '撤离' } },
      );
      return actions;
    }

    function fallbackBuildIntent(action, combatData) {
      const safeAction = action || {};
      const queue = [{
        type: safeAction.action_type || safeAction.type || '常规攻击',
        skill: safeAction.raw_skill || safeAction.skill || { name: safeAction.name || '普通攻击' },
        cast_time: fallbackNumber(safeAction.cast_time, 10),
        target_name: combatData?.参战者?.enemy?.name || null,
      }];
      return `${safeAction.name || '普通攻击'}\n[动作队列]${JSON.stringify(queue)}[/动作队列]\n[目标]${combatData?.参战者?.enemy?.name || '对手'}[/目标]`;
    }

    function fallbackRenderActions(actions, selectedId) {
      const node = byId('ui-action-grid');
      if (!node) return;
      node.innerHTML = actions
        .map(action => {
          const selected = action.id === selectedId ? ' is-selected' : '';
          const meta = [action.cost_text, action.cast_time ? `${action.cast_time}` : ''].filter(Boolean).join(' / ');
          return `<button class="action-btn${selected}" type="button" data-action-id="${fallbackEscape(action.id)}"><span class="action-name">${fallbackEscape(action.name)}</span><span class="action-meta"><span>${fallbackEscape(action.category || '战术')}</span><span class="action-cost">${fallbackEscape(meta)}</span></span></button>`;
        })
        .join('');
      node.querySelectorAll('[data-action-id]').forEach(button => {
        button.addEventListener('click', () => {
          const state = root.BattleUI?.state || {};
          const action = (state.availableActions || []).find(item => item.id === button.dataset.actionId);
          if (!action) return;
          state.selectedAction = action;
          state.selectedSkillActions = [action];
          const output = byId('ui-intent-output');
          if (output) output.value = fallbackBuildIntent(action, state.combatData);
          fallbackRenderActions(state.availableActions || [], action.id);
        });
      });
    }

    component.syncFromBattleEngine = function syncCurrentBattlePanel() {
      const combatData = deepClonePlain(getMvuValue('world.战斗') || _options.combatData || {});
      const participants = combatData && combatData.参战者 && typeof combatData.参战者 === 'object' ? combatData.参战者 : null;
      if (!participants) return;
      const player = fallbackRenderUnit('player', participants.player);
      const enemy = fallbackRenderUnit('enemy', participants.enemy);
      const chipNode = byId('ui-combat-chips');
      if (chipNode) {
        chipNode.innerHTML = [`回合 ${Number(combatData.回合 || 0)}`, combatData.战斗类型 || '战斗', combatData.阶段 || '宣告阶段', `${player.name} → ${enemy.name}`]
          .map(item => `<span class="intent-pill">${fallbackEscape(item)}</span>`)
          .join('');
      }
      const charData = getMvuValue(`char.${player.name}`) || getMvuValue(`char.${getMvuValue('sys.玩家名') || ''}`) || participants.player;
      const availableActions = fallbackCollectActions(charData);
      const previousState = root.BattleUI?.state || {};
      const currentIntentMode = previousState.currentIntentMode || combatData.战斗意图 || '点到为止';
      const selectedAction = previousState.selectedAction && availableActions.find(action => action.id === previousState.selectedAction.id)
        ? previousState.selectedAction
        : availableActions[0] || null;
      root.BattleUI = Object.assign(root.BattleUI || {}, {
        state: {
          ...previousState,
          combatData,
          player,
          enemy,
          availableActions,
          selectedAction,
          selectedSkillActions: selectedAction ? [selectedAction] : [],
          selectedPreActions: [],
          currentMode: previousState.currentMode || 'single_round',
          currentIntentMode,
        },
        buildIntentText(actions = []) {
          return fallbackBuildIntent(actions[0] || root.BattleUI?.state?.selectedAction, root.BattleUI?.state?.combatData);
        },
        submitBattleIntent() {
          const state = root.BattleUI?.state || {};
          const action = state.selectedAction || state.availableActions?.[0] || null;
          const intentText = fallbackBuildIntent(action, state.combatData);
          const output = byId('ui-intent-output');
          if (output) output.value = intentText;
          const battleMode = state.currentMode === 'multi_round' ? 'multi_round' : 'single_round';
          state.combatData.战斗意图 = state.currentIntentMode || '点到为止';
          try {
            const result = root.BattleUIBridge?.executePlayerBattleIntent?.(intentText, {
              mode: battleMode,
              intentMode: state.currentIntentMode || '点到为止',
            });
            if (typeof component.syncFromBattleEngine === 'function') component.syncFromBattleEngine();
            root.dispatchEvent(new CustomEvent('battle-ui-submit-finished', { detail: result || { intentText } }));
            return result || { intentText };
          } catch (error) {
            const result = { intentText, mode: 'engine_error', battleMode, error };
            root.dispatchEvent(new CustomEvent('battle-ui-submit-finished', { detail: result }));
            return result;
          }
        },
      });
      fallbackRenderActions(availableActions, selectedAction?.id || '');
      const output = byId('ui-intent-output');
      if (output && selectedAction) output.value = fallbackBuildIntent(selectedAction, combatData);
      const intentModeInput = byId('ui-intent-mode');
      if (intentModeInput && intentModeInput.value !== currentIntentMode) intentModeInput.value = currentIntentMode;
      const arbitrateBtn = byId('ui-arbitrate');
      if (arbitrateBtn && !arbitrateBtn.__fallbackBattleBound) {
        arbitrateBtn.addEventListener('click', () => root.BattleUI?.submitBattleIntent?.());
        arbitrateBtn.__fallbackBattleBound = true;
        arbitrateBtn.__battleSubmitBound = true;
      }
      document.querySelectorAll('#ui-mode-group .mode-btn').forEach(btn => {
        if (btn.__battleModeBound) return;
        btn.addEventListener('click', () => {
          const normalized = btn.dataset.mode === 'multi_round' ? 'multi_round' : 'single_round';
          if (root.BattleUI && root.BattleUI.state) root.BattleUI.state.currentMode = normalized;
          document.querySelectorAll('#ui-mode-group .mode-btn').forEach(item => {
            item.classList.toggle('active', item.dataset.mode === normalized);
          });
        });
        btn.__battleModeBound = true;
      });
      if (intentModeInput && !intentModeInput.__battleIntentBound) {
        intentModeInput.addEventListener('change', () => {
          if (root.BattleUI && root.BattleUI.state) root.BattleUI.state.currentIntentMode = intentModeInput.value || '点到为止';
        });
        intentModeInput.__battleIntentBound = true;
      }
      const closeBtn = byId('ui-battle-close');
      if (closeBtn && !closeBtn.__battleCloseBound) {
        closeBtn.addEventListener('click', () => {
          root.dispatchEvent(new CustomEvent('battle-ui-close-request', { detail: { source: 'battle_ui' } }));
        });
        closeBtn.__battleCloseBound = true;
      }
    };

    component.syncFromBattleEngine();

    installHostHooks();
    /* __BATTLE_ENGINE_INLINE__ */
    function createEmptySkillSemantics() {
      return {
        主定位: '无',
        作用目标: '敌方单体',
        战术标签: [],
        优先条件: [],
        风险等级: '中',
        保留倾向: 0,
        目标偏好: [],
        友方偏好: [],
        是否持续: false,
        是否可打断: false,
        是否可被霸体免疫: true,
      };
    }

    function createEmptyBattleSummary() {
      return {
        目标规模: '单体',
        生效方式: '直接',
        爆发级别: '中',
        持续性: '无',
        风险等级: '中',
        属性建模: '无',
        极性层级: '无',
        控制强度: '无',
        回复性质: '无',
        防御性质: '无',
        协同性: '低',
        保留倾向: 0,
      };
    }

    function mapSemanticTargetToCombatTarget(target) {
      const mapping = {
        敌方单体: '敌方/单体',
        敌方群体: '敌方/群体',
        自身: '自身',
        友方单体: '己方/单体',
        友方群体: '己方/群体',
        全场: '全场',
      };
      return mapping[target] || target || '敌方/单体';
    }

    const BATTLE_SKILL_TARGET_MODELS = new Set(['自身', '友方单体', '友方群体', '敌方单体', '敌方群体', '全场']);
    const BATTLE_SKILL_TARGET_MODIFIERS = new Set([
      '受隐身筛选',
      '可被破隐',
      '可被嘲讽',
      '可被护卫重定向',
      '可被随机偏转',
      '可被锁定强化',
    ]);

    function normalizeBattleSkillTargetModel(value = '', fallback = '敌方单体') {
      const text = String(value || '').trim();
      if (BATTLE_SKILL_TARGET_MODELS.has(text)) return text;
      const derived = (() => {
        if (/友方群体|己方\/群体|全员/.test(text)) return '友方群体';
        if (/友方单体|己方\/单体/.test(text)) return '友方单体';
        if (/敌方群体/.test(text)) return '敌方群体';
        if (/敌方单体/.test(text)) return '敌方单体';
        if (/全场/.test(text)) return '全场';
        if (/自身/.test(text)) return '自身';
        return '';
      })();
      return BATTLE_SKILL_TARGET_MODELS.has(derived) ? derived : fallback;
    }

    function mapBattleTargetModelToCombatTarget(targetModel = '敌方单体') {
      return {
        自身: '自身',
        友方单体: '己方/单体',
        友方群体: '己方/群体',
        敌方单体: '敌方/单体',
        敌方群体: '敌方/群体',
        全场: '全场',
      }[normalizeBattleSkillTargetModel(targetModel)] || '敌方/单体';
    }

    function normalizeBattleSkillTargetModifiers(value = []) {
      const source = Array.isArray(value) ? value : [value];
      return Array.from(
        new Set(
          source
            .map(item => String(item || '').trim())
            .filter(item => BATTLE_SKILL_TARGET_MODIFIERS.has(item)),
        ),
      );
    }

    function inferBattleTargetModelFromLegacyTarget(text = '') {
      return normalizeBattleSkillTargetModel(text, '敌方单体');
    }

    function deriveBattleTargetResolutionStrategy(targetModel = '敌方单体') {
      return ['敌方群体', '友方群体', '全场'].includes(normalizeBattleSkillTargetModel(targetModel))
        ? '全目标独立'
        : '单目标独立';
    }

    function deriveBattleSkillTargetModifiers(skill = {}, targetModel = '敌方单体') {
      const normalizedTargetModel = normalizeBattleSkillTargetModel(targetModel, '敌方单体');
      const effects = Array.isArray(skill?._效果数组) ? skill._效果数组 : [];
      const mechanisms = effects.map(effect => String(effect?.机制 || '').trim()).filter(Boolean);
      const modifiers = [];
      if (['敌方单体', '敌方群体'].includes(normalizedTargetModel)) {
        modifiers.push('受隐身筛选', '可被嘲讽', '可被护卫重定向', '可被锁定强化');
      }
      if (mechanisms.includes('破隐')) modifiers.push('可被破隐');
      if (mechanisms.includes('随机目标') || mechanisms.includes('认知扭曲')) modifiers.push('可被随机偏转');
      return normalizeBattleSkillTargetModifiers(modifiers);
    }

    function getMechanismJudgeValue(entity, finalEntity, judgeKey) {
      const stats = finalEntity || entity || {};
      switch (judgeKey) {
        case 'men_max':
        case 'sp_max':
        case 'agi':
        case 'str':
        case 'def':
        case 'vit':
          return Number(stats[judgeKey] || 0);
        case 'vit_ratio':
          return (
            Math.max(0, Number(entity?.sta || stats?.sta || entity?.体力 || stats?.体力 || 0)) /
            Math.max(1, Number(entity?.sta_max || stats?.sta_max || entity?.体力上限 || stats?.体力上限 || 1))
          );
        case 'hp_ratio':
          return (
            Math.max(0, Number(entity?.vit || stats?.vit || 0)) /
            Math.max(1, Number(entity?.vit_max || stats?.vit_max || 1))
          );
        case 'sp_ratio':
          return (
            Math.max(0, Number(entity?.sp || stats?.sp || 0)) /
            Math.max(1, Number(entity?.sp_max || stats?.sp_max || 1))
          );
        case 'men_ratio':
          return (
            Math.max(0, Number(entity?.men || stats?.men || 0)) /
            Math.max(1, Number(entity?.men_max || stats?.men_max || 1))
          );
        default:
          return 0;
      }
    }

    function mergeRuntimePayloadToState(payload, pState) {
      if (!payload || typeof payload !== 'object') return;
      const calc = pState.计算层效果 || (pState.计算层效果 = createEmptyCombatEffectMap());
      const stateMods = pState.面板修改比例 || (pState.面板修改比例 = {});
      const statMods = payload.面板修改比例 || payload.面板修改 || {};
      ['str', 'def', 'agi', 'vit_max', 'men_max', 'sp_max'].forEach(k => {
        if (statMods[k] !== undefined) stateMods[k] = statMods[k];
      });
      [
        'skip_turn',
        'cannot_react',
        'dot_damage',
        'silence',
        'disarm',
        'blind',
        'invincible',
        'skill_seal',
        'counter_attack_ratio',
        'damage_reflect_ratio',
        'damage_share_ratio',
        'damage_reduction',
        'block_count',
        'substitute_count',
        'super_armor',
        'death_save_count',
        'revive_count',
        'revive_heal_ratio',
        'armor_pen',
        'reaction_bonus',
        'reaction_penalty',
        'attacker_speed_bonus',
        'cast_speed_bonus',
        'cast_speed_penalty',
        'hit_bonus',
        'hit_penalty',
        'dodge_bonus',
        'dodge_penalty',
        'lock_level',
        'control_success_bonus',
        'control_success_penalty',
        'control_resist_mult',
        'control_resist_bonus',
        'interrupt_bonus',
        'final_damage_mult',
        'final_damage_bonus',
        'final_heal_mult',
        'final_heal_bonus',
        'shield_gain_mult',
        'shield_gain_bonus',
        'sp_gain_ratio',
        'men_gain_ratio',
        'heal_block_ratio',
        'resource_block_ratio',
        'heal_inversion_ratio',
        'min_hp_floor',
        'hot_heal_ratio',
        'damage_share_count',
        'invincible_tier_threshold',
        'daily_trigger_limit',
        'bonus_true_damage_ratio',
        'life_steal_ratio',
      ].forEach(k => {
        if (payload[k] !== undefined) calc[k] = payload[k];
      });
    }

    const BATTLE_MECHANISM_CONSUMERS = Object.freeze({
      stealth(ctx) {
        ctx.directPayload.stealth_level = Number(ctx.effect.隐蔽度 || ctx.effect.stealth_level || 0);
        ctx.directPayload.dodge_bonus = Number(ctx.effect.dodge_bonus || 0);
        ctx.directPayload.reaction_bonus = Number(ctx.effect.reaction_bonus || 0);
        ctx.ensureStateShell(ctx.effect?.状态名称 || '隐身', ['隐身']);
      },
      reveal(ctx) {
        ctx.directPayload.hit_bonus = Number(ctx.effect.hit_bonus || 0);
        ctx.directPayload.lock_level = Number(ctx.effect.lock_level || 0);
        ctx.ensureStateShell(ctx.effect?.状态名称 || '破隐', ['破隐']);
      },
      disarm(ctx) {
        ctx.directPayload.disarm = true;
        ctx.ensureStateShell('缴械', ['缴械']);
      },
      silence(ctx) {
        ctx.directPayload.silence = true;
        ctx.ensureStateShell('沉默', ['沉默']);
      },
      slow(ctx) {
        ctx.directPayload.面板修改比例 = { agi: ctx.effect.agi_ratio || 0.8 };
        ctx.ensureStateShell('减速', ['减速']);
      },
      blind(ctx) {
        ctx.directPayload.blind = true;
        ctx.ensureStateShell('致盲', ['致盲']);
      },
      soft_control(ctx) {
        ctx.directPayload.reaction_penalty = Number(ctx.effect.reaction_penalty || 0);
        ctx.directPayload.cast_speed_penalty = Number(ctx.effect.cast_speed_penalty || 0);
        ctx.directPayload.dodge_penalty = Number(ctx.effect.dodge_penalty || 0);
        ctx.ensureStateShell(ctx.effect?.状态名称 || '软控', ['软控']);
      },
      position_lock(ctx) {
        ctx.directPayload.reaction_penalty = Number(ctx.effect.reaction_penalty || 0);
        ctx.directPayload.dodge_penalty = Number(ctx.effect.dodge_penalty || 0);
        ctx.directPayload.lock_level = Number(ctx.effect.lock_level || 0);
        ctx.ensureStateShell(ctx.effect?.状态名称 || '位移限制', ['位移限制']);
      },
      self_shift(ctx) {
        ctx.directPayload.dodge_bonus = Number(ctx.effect.dodge_bonus || 0);
        ctx.directPayload.attacker_speed_bonus = Number(ctx.effect.attacker_speed_bonus || 0);
        ctx.directPayload.reaction_bonus = Number(ctx.effect.reaction_bonus || 0);
        ctx.ensureStateShell(ctx.effect?.状态名称 || '自身位移', ['自身位移']);
      },
      hostile_shift(ctx) {
        ctx.directPayload.dodge_penalty = Number(ctx.effect.dodge_penalty || 0);
        ctx.directPayload.reaction_penalty = Number(ctx.effect.reaction_penalty || 0);
        ctx.directPayload.lock_level = Number(ctx.effect.lock_level || 0);
        ctx.ensureStateShell(ctx.effect?.状态名称 || '强制位移', ['强制位移']);
      },
      position_exchange(ctx) {
        ctx.directPayload.dodge_penalty = Number(ctx.effect.dodge_penalty || 0);
        ctx.directPayload.reaction_penalty = Number(ctx.effect.reaction_penalty || 0);
        ctx.directPayload.lock_level = Number(ctx.effect.lock_level || 0);
        ctx.ensureStateShell(ctx.effect?.状态名称 || '位移交换', ['位移交换']);
      },
      hard_lock(ctx) {
        ctx.directPayload.dodge_penalty = Number(ctx.effect.dodge_penalty || 0);
        ctx.directPayload.reaction_penalty = Number(ctx.effect.reaction_penalty || 0);
        ctx.directPayload.lock_level = Number(ctx.effect.lock_level || 0);
        ctx.ensureStateShell(ctx.effect?.状态名称 || '强制绑定/锁定', ['强制绑定/锁定']);
      },
      guard(ctx) {
        ctx.directPayload.damage_reduction = Number(ctx.effect.damage_reduction || 0);
        ctx.ensureStateShell(ctx.effect?.状态名称 || '护卫', ['护卫']);
      },
      invincible(ctx) {
        ctx.directPayload.invincible = true;
        ctx.directPayload.super_armor = true;
        ctx.directPayload.damage_reduction = Math.max(Number(ctx.directPayload.damage_reduction || 0), Number(ctx.effect.damage_reduction || 0));
        ctx.directPayload.invincible_tier_threshold = Number(ctx.effect.免疫位阶阈值 || ctx.effect.invincible_tier_threshold || 100);
        ctx.directPayload.daily_trigger_limit = Math.max(0, Number(ctx.effect.每日触发上限 || ctx.effect.daily_trigger_limit || 0));
        ctx.ensureStateShell(ctx.effect?.状态名称 || '无敌金身', ['无敌金身']);
      },
      damage_reflect(ctx) {
        ctx.directPayload.damage_reflect_ratio = Number(ctx.effect.反射比例 || ctx.effect.damage_reflect_ratio || 0);
        ctx.ensureStateShell(ctx.effect?.状态名称 || '伤害反射', ['伤害反射']);
      },
      damage_share(ctx) {
        ctx.directPayload.damage_share_ratio = Number(ctx.effect.分摊比例 || ctx.effect.damage_share_ratio || 0);
        ctx.directPayload.damage_share_count = Math.max(1, Number(ctx.effect.分摊人数 || ctx.effect.damage_share_count || 1));
        ctx.ensureStateShell(ctx.effect?.状态名称 || '伤害分摊', ['伤害分摊']);
      },
      substitute(ctx) {
        ctx.directPayload.substitute_count = Math.max(1, Number(ctx.effect.抵消次数 || ctx.effect.substitute_count || 1));
        ctx.directPayload.dodge_bonus = Math.max(Number(ctx.directPayload.dodge_bonus || 0), Number(ctx.effect.dodge_bonus || 0));
        ctx.ensureStateShell(ctx.effect?.状态名称 || '替身抵消', ['替身抵消']);
      },
      skill_seal(ctx) {
        ctx.directPayload.skill_seal = true;
        ctx.ensureStateShell(ctx.effect?.状态名称 || '封技', ['封技']);
      },
      heal_inversion(ctx) {
        ctx.directPayload.heal_inversion_ratio = Number(ctx.effect.反转比例 || ctx.effect.heal_inversion_ratio || 0);
        ctx.ensureStateShell(ctx.effect?.状态名称 || '治疗反转', ['治疗反转']);
      },
      revive(ctx) {
        ctx.directPayload.revive_count = Math.max(1, Number(ctx.effect.复苏次数 || ctx.effect.revive_count || 1));
        ctx.directPayload.revive_heal_ratio = Number(ctx.effect.复苏回血比例 || ctx.effect.revive_heal_ratio || 0.3);
        ctx.ensureStateShell(ctx.effect?.状态名称 || '复苏', ['复苏']);
      },
      target_lock(ctx) {
        ctx.directPayload.hit_bonus = Number(ctx.effect.hit_bonus || 0);
        ctx.directPayload.lock_level = Number(ctx.effect.lock_level || 0);
        ctx.ensureStateShell('目标锁定', ['目标锁定']);
      },
      expose_weakness(ctx) {
        ctx.directPayload.final_damage_mult = Number(ctx.effect.final_damage_mult || 1.1);
        ctx.directPayload.dodge_penalty = Number(ctx.effect.dodge_penalty || 0);
        ctx.directPayload.lock_level = Number(ctx.effect.lock_level || 0);
        ctx.ensureStateShell('标记弱点', ['标记弱点']);
      },
      pursuit_mark(ctx) {
        ctx.directPayload.attacker_speed_bonus = Number(ctx.effect.attacker_speed_bonus || 0);
        ctx.directPayload.hit_bonus = Number(ctx.effect.hit_bonus || 0);
        ctx.directPayload.final_damage_mult = Number(ctx.effect.final_damage_mult || 1.0);
        ctx.ensureStateShell('追击', ['追击']);
      },
      pursuit_shift(ctx) {
        ctx.directPayload.attacker_speed_bonus = Number(ctx.effect.attacker_speed_bonus || 0);
        ctx.directPayload.hit_bonus = Number(ctx.effect.hit_bonus || 0);
        ctx.directPayload.final_damage_mult = Number(ctx.effect.final_damage_mult || 1.0);
        ctx.ensureStateShell(ctx.effect?.状态名称 || '追击位移', ['追击位移']);
      },
      disengage_shift(ctx) {
        ctx.directPayload.dodge_bonus = Number(ctx.effect.dodge_bonus || 0);
        ctx.directPayload.cast_speed_bonus = Number(ctx.effect.cast_speed_bonus || 0);
        ctx.directPayload.reaction_bonus = Number(ctx.effect.reaction_bonus || 0);
        ctx.ensureStateShell(ctx.effect?.状态名称 || '脱离位移', ['脱离位移']);
      },
      counter(ctx) {
        ctx.directPayload.counter_attack_ratio = Number(ctx.effect.反击倍率 || ctx.effect.counter_attack_ratio || 0);
        ctx.directPayload.damage_reduction = Number(ctx.effect.damage_reduction || 0);
        ctx.ensureStateShell(ctx.effect?.状态名称 || '反制', ['反制']);
      },
      on_hit_counter(ctx) {
        ctx.directPayload.counter_attack_ratio = ctx.effect.反击倍率 || 0.5;
        ctx.ensureStateShell('受击反击', ['反击']);
      },
      damage_reduce(ctx) {
        ctx.directPayload.damage_reduction = ctx.effect.减伤比例 || 0.15;
        ctx.ensureStateShell('减伤', ['减伤']);
      },
      block(ctx) {
        ctx.directPayload.block_count = ctx.effect.抵消次数 || 1;
        ctx.ensureStateShell('格挡', ['格挡']);
      },
      super_armor(ctx) {
        ctx.directPayload.super_armor = true;
        ctx.directPayload.damage_reduction = Number(ctx.effect.减伤比例 || ctx.effect.damage_reduction || 0);
        ctx.ensureStateShell('霸体', ['霸体']);
      },
      anti_heal(ctx) {
        ctx.directPayload.heal_block_ratio = Number(ctx.effect.heal_block_ratio || 0);
        ctx.ensureStateShell('禁疗', ['禁疗']);
      },
      shared_vision(ctx) {
        ctx.directPayload.reaction_bonus = Number(ctx.effect.reaction_bonus || 0);
        ctx.directPayload.hit_bonus = Number(ctx.effect.hit_bonus || 0);
        ctx.directPayload.lock_level = Number(ctx.effect.lock_level || 0);
        ctx.ensureStateShell('共享视野', ['共享视野']);
      },
      clone(ctx) {
        const cloneType = String(ctx.effect.分身类型 || '').trim();
        const cloneCount = Math.max(1, Number(ctx.effect.分身数量 || 1));
        const stealth = Math.max(0, Math.min(1, Number(ctx.effect.隐蔽度 || 0)));
        const inheritRatio = Math.max(0, Math.min(1, Number(ctx.effect.实力继承比例 || 0)));
        if (cloneType === '精神力分身') {
          ctx.directPayload.reaction_bonus = Number(
            ctx.effect.reaction_bonus || Math.min(0.28, 0.04 + stealth * 0.16 + inheritRatio * 0.08),
          );
          ctx.directPayload.hit_bonus = Number(
            ctx.effect.hit_bonus || Math.min(0.3, 0.04 + inheritRatio * 0.15 + cloneCount * 0.03),
          );
          ctx.directPayload.lock_level = Number(
            ctx.effect.lock_level || Math.min(3, Math.max(1, Math.round(1 + inheritRatio * 1.2 + stealth * 0.8))),
          );
          ctx.directPayload.damage_reduction = Number(
            ctx.effect.damage_reduction || Math.min(0.18, 0.02 + stealth * 0.05 + cloneCount * 0.01),
          );
        } else {
          ctx.directPayload.dodge_bonus = Number(
            ctx.effect.dodge_bonus || Math.min(0.35, 0.05 + stealth * 0.18 + inheritRatio * 0.08 + cloneCount * 0.03),
          );
          ctx.directPayload.attacker_speed_bonus = Number(
            ctx.effect.attacker_speed_bonus || Math.min(0.24, 0.03 + inheritRatio * 0.12 + cloneCount * 0.02),
          );
          ctx.directPayload.damage_reduction = Number(
            ctx.effect.damage_reduction || Math.min(0.22, 0.02 + stealth * 0.08 + cloneCount * 0.015),
          );
          ctx.directPayload.final_damage_mult = Number(
            ctx.effect.final_damage_mult || Math.min(1.28, 1 + inheritRatio * 0.12 + Math.max(0, cloneCount - 1) * 0.04),
          );
        }
        ctx.ensureStateShell(ctx.effect?.状态名称 || ctx.effect?.分身类型 || '分身', ['分身']);
      },
      death_save(ctx) {
        ctx.directPayload.super_armor = true;
        ctx.directPayload.min_hp_floor = 1;
        ctx.directPayload.death_save_count = ctx.effect.触发次数 || 1;
        ctx.ensureStateShell('免死', ['免死']);
      },
      hard_control(ctx) {
        ctx.directPayload.skip_turn = true;
        ctx.directPayload.cannot_react = true;
        ctx.ensureStateShell(ctx.effect?.状态名称 || '硬控', ['硬控']);
      },
    });

    function applyRuntimeMechanismEffects(skill, attacker, attackerFinalStat, defender, defenderFinalStat, pState) {
      const effects = getSkillEffects(skill);
      effects.forEach(effect => {
        const mechanism = effect?.机制 || effect?.名称 || effect?.类型 || '';
        const duration = Math.max(0, Number((effect?.持续 ?? effect?.持续回合) || 0));
        const ensureStateShell = (fallbackName, extraFlags = []) => {
          const nextName = String(effect?.状态名称 || fallbackName || mechanism || '无');
          if (!nextName || nextName === '无') return;
          if (!pState.状态名称 || pState.状态名称 === '无') {
            pState.状态名称 = nextName;
            const nextTarget = String(effect?.目标 || effect?.对象 || '').trim();
            if (nextTarget) pState.目标 = nextTarget;
            if (nextTarget) pState.对象 = nextTarget;
          }
          if (duration > 0) pState.持续回合 = Math.max(Number(pState.持续回合 || 0), duration);
          pState.特殊机制标识 = mergeSpecialFlags(pState.特殊机制标识 || '无', extraFlags);
        };
        if (['标记锁定', '目标锁定', '幻境', '催眠', '认知扭曲', '斩杀补伤', '条件触发'].includes(mechanism)) {
          const judgeKey = effect.判定属性;
          const threshold = Number(effect.判定阈值 ?? 1.0);
          let success = true;
          if (judgeKey) {
            const attackerValue = getMechanismJudgeValue(attacker, attackerFinalStat, judgeKey);
            const defenderValue = getMechanismJudgeValue(defender, defenderFinalStat, judgeKey);
            if (['vit_ratio', 'hp_ratio', 'sp_ratio', 'men_ratio'].includes(judgeKey)) {
              success = defenderValue <= threshold;
            } else {
              success = attackerValue / Math.max(1, defenderValue) >= threshold;
            }
          }
          const payload = success ? effect.成功参数 || {} : effect.失败参数 || {};
          mergeRuntimePayloadToState(payload, pState);
          if (['标记锁定', '目标锁定', '幻境', '催眠', '认知扭曲'].includes(mechanism)) ensureStateShell(mechanism, [mechanism]);
        } else {
          const directPayload = {};
          const 运行时消费器 = String(getBattleSkillMechanismMeta(mechanism)?.运行时消费器 || '').trim();
          const runtimeConsumer = 运行时消费器 ? BATTLE_MECHANISM_CONSUMERS[运行时消费器] : null;
          if (mechanism === '属性变化') {
            const property = String(effect?.属性 || '').trim();
            const action = String(effect?.动作 || '').trim();
            const value = Number(effect?.数值 || 0);
            if (['str', 'def', 'agi', 'vit_max', 'sp_max', 'men_max'].includes(property) && Number.isFinite(value)) {
              directPayload.面板修改比例 = { [property]: value };
              ensureStateShell(effect?.状态名称 || '属性变化', [action || '属性变化']);
            }
            if (property === '威力' && Number.isFinite(value)) {
              directPayload.final_damage_mult = value;
              ensureStateShell(effect?.状态名称 || '威力变化', [action || '威力变化']);
            }
            if (property === '控制' && Number.isFinite(value)) {
              directPayload.control_resist_mult = value;
              ensureStateShell(effect?.状态名称 || '控制修正', [action || '控制修正']);
            }
          }
          if (mechanism === '持续恢复') {
            const property = String(effect?.属性 || '').trim();
            const value = Number(effect?.数值 || 0);
            if (property === 'vit') directPayload.hot_heal_ratio = value;
            if (property === 'sp') directPayload.sp_gain_ratio = value;
            if (property === 'men') directPayload.men_gain_ratio = value;
            ensureStateShell(effect?.状态名称 || '持续恢复', ['持续恢复']);
          }
          if (mechanism === '消耗修正') {
            const value = Number(effect?.数值 || 1);
            const action = String(effect?.动作 || '').trim();
            if (action === '消耗提高') directPayload.resource_block_ratio = Math.max(0, value - 1);
            ensureStateShell(effect?.状态名称 || '消耗修正', [action || '消耗修正']);
          }
          if (mechanism === '前摇修正') {
            const value = Number(effect?.数值 || 1);
            const action = String(effect?.动作 || '').trim();
            if (action === '前摇拉长') directPayload.cast_speed_penalty = Math.max(0, value - 1);
            else directPayload.cast_speed_bonus = Math.max(0, 1 - value);
            ensureStateShell(effect?.状态名称 || '前摇修正', [action || '前摇修正']);
          }
          if (mechanism === '掌控修正') {
            const value = Number(effect?.数值 || 1);
            const action = String(effect?.动作 || '').trim();
            if (action === '倍率压制') directPayload.control_success_penalty = Math.max(0, 1 - value);
            else directPayload.control_success_bonus = Math.max(0, value - 1);
            ensureStateShell(effect?.状态名称 || '掌控修正', ['掌控修正']);
          }
          if (mechanism === '速度修正') {
            const value = Number(effect?.数值 || 1);
            const action = String(effect?.动作 || '').trim();
            if (action === '倍率压制') {
              directPayload.reaction_penalty = Math.max(0, 1 - value);
              directPayload.dodge_penalty = Math.max(0, 1 - value);
            } else {
              directPayload.reaction_bonus = Math.max(0, value - 1);
              directPayload.attacker_speed_bonus = Math.max(0, value - 1);
              directPayload.dodge_bonus = Math.max(0, Math.max(0, value - 1) * 0.75);
            }
            ensureStateShell(effect?.状态名称 || '速度修正', ['速度修正']);
          }
          if (mechanism === '打断') directPayload.interrupt_bonus = effect.中断概率 || 1.0;
          if (mechanism === '感知干扰') {
            directPayload.hit_penalty = Number(effect.hit_penalty || 0);
            directPayload.reaction_penalty = Number(effect.reaction_penalty || 0);
            directPayload.cast_speed_penalty = Number(effect.cast_speed_penalty || 0);
            ensureStateShell(effect?.状态名称 || '感知干扰', ['感知干扰']);
          }
          if (['流血DOT', '持续伤害DOT'].includes(mechanism))
            directPayload.dot_damage = Math.max(0, Number(effect.dot_damage || effect.每回合伤害 || 0));
          if (runtimeConsumer) runtimeConsumer({ effect, mechanism, directPayload, ensureStateShell });
          if (['流血DOT', '持续伤害DOT'].includes(mechanism))
            ensureStateShell(effect?.状态名称 || (mechanism === '流血DOT' ? '流血' : '持续创伤'), [
              effect?.状态名称 || (mechanism === '流血DOT' ? '流血' : '持续伤害'),
            ]);
          if (mechanism === '嘲讽') ensureStateShell(effect?.状态名称 || '嘲讽', ['嘲讽']);
          if (Object.keys(directPayload).length > 0) {
            mergeRuntimePayloadToState(directPayload, pState);
          }
        }
      });
    }

    function mapPrimaryRoleToSkillType(role) {
      const mapping = {
        输出: '输出',
        控制: '控制',
        防御: '防御',
        辅助: '辅助',
        特殊: '辅助',
      };
      return mapping[role] || '输出';
    }

    function mergeSpecialFlags(existing, additions = []) {
      const set = new Set(
        String(existing || '无')
          .split(/[\/、,，\s]+/)
          .filter(Boolean)
          .filter(flag => flag !== '无'),
      );
      (additions || []).forEach(flag => {
        if (flag && flag !== '无') set.add(flag);
      });
      return set.size > 0 ? Array.from(set).join('/') : '无';
    }

    function formatCostObjectToString(costObj) {
      if (!costObj || typeof costObj !== 'object') return '无';
      const buildPart = obj =>
        [
          obj?.魂力 ? `魂力:${obj.魂力}` : '',
          obj?.体力 ? `体力:${obj.体力}` : '',
          obj?.精神力 ? `精神力:${obj.精神力}` : '',
        ]
          .filter(Boolean)
          .join(' ') || '无';
      const upfront = buildPart(costObj.启动 || costObj.upfront || {});
      const sustain = buildPart(costObj.维持 || costObj.sustain || {});
      return sustain !== '无' ? `${upfront} 维持:${sustain}` : upfront;
    }

    function deepClone(data) {
      return data == null ? data : JSON.parse(JSON.stringify(data));
    }

    function formatBattleCultivationLevelText(value, fallback = '0') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        if (Math.abs(parsed - 99.5) < 0.001) return '准神';
        return String(parsed);
      }
      const text = String(value ?? '').trim();
      return text || fallback;
    }

    function getSpiritNameList(char) {
      return Object.values(char?.武魂 || {})
        .map(sp => sp?.表象名称 || '')
        .filter(Boolean);
    }

    function isSpecialSupportMartialSoul(char) {
      return getSpiritNameList(char).some(name => /^(七宝|九宝)/.test(String(name || '')));
    }

    function getSupportEffectScale(caster, target) {
      if (isSpecialSupportMartialSoul(caster)) return 1;
      const casterSp = Math.max(1, caster?.sp_max || 1);
      const targetSp = Math.max(1, target?.sp_max || 1);
      const ratio = casterSp / targetSp;
      if (!Number.isFinite(ratio) || ratio <= 0) return 1;
      if (ratio >= 1) return Math.min(1.35, 1 + (Math.sqrt(ratio) - 1) * 0.35);
      return Math.max(0.72, 0.72 + 0.28 * Math.sqrt(ratio));
    }

    function getSupportCostScale(caster, target) {
      if (isSpecialSupportMartialSoul(caster)) return 1;
      const effectScale = getSupportEffectScale(caster, target);
      if (!(effectScale > 0)) return 1;
      if (effectScale >= 1) return Math.min(1.05, 1 + (effectScale - 1) * 0.2);
      return Math.max(0.78, 1 - (1 - effectScale) * 0.65);
    }

    function getSoulDriveScale(attacker, defender) {
      return Math.max(1, attacker?.sp_max || 1) / Math.max(1, defender?.sp_max || 1);
    }

    function isSupportLikeSkill(skill) {
      const mainType = inferMainTypeFromEffects(skill) || '';
      const skillType = getSkillType(skill);
      const hasFriendlyGrantable = skillCanGrantFriendlyMechanism(skill);
      const hasFriendlySupportPayload =
        skillTargetsFriendlySide(skill) &&
        getSkillEffects(skill).some(effect => isBattleAttributeSupportEffect(effect) || isBattleRecoverEffect(effect));
      return (
        ['增益类', '回复类', '防御类'].includes(mainType) ||
        ['辅助', '防御'].includes(skillType) ||
        hasFriendlyGrantable ||
        hasFriendlySupportPayload
      );
    }

    function createEmptyCombatEffectMap() {
      return {
        skip_turn: false,
        cannot_react: false,
        invincible: false,
        skill_seal: false,
        dot_damage: 0,
        armor_pen: 0,
        reaction_bonus: 0,
        reaction_penalty: 0,
        attacker_speed_bonus: 0,
        cast_speed_bonus: 0,
        cast_speed_penalty: 0,
        hit_bonus: 0,
        hit_penalty: 0,
        dodge_bonus: 0,
        dodge_penalty: 0,
        lock_level: 0,
        control_success_bonus: 0,
        control_success_penalty: 0,
        control_resist_mult: 1.0,
        control_resist_bonus: 0,
        interrupt_bonus: 0,
        final_damage_mult: 1.0,
        final_damage_bonus: 0,
        final_heal_mult: 1.0,
        final_heal_bonus: 0,
        shield_gain_mult: 1.0,
        shield_gain_bonus: 0,
        sp_gain_ratio: 0,
        men_gain_ratio: 0,
        heal_block_ratio: 0,
        hot_heal_ratio: 0,
        resource_block_ratio: 0,
        random_target_rate: 0,
        stealth_level: 0,
        min_hp_floor: 0,
        death_save_count: 0,
        revive_count: 0,
        revive_heal_ratio: 0,
        substitute_count: 0,
        damage_reflect_ratio: 0,
        damage_share_ratio: 0,
        damage_share_count: 0,
        heal_inversion_ratio: 0,
        invincible_tier_threshold: 0,
        daily_trigger_limit: 0,
        bonus_true_damage_ratio: 0,
        life_steal_ratio: 0,
        silence: false,
        disarm: false,
        blind: false,
        counter_attack_ratio: 0,
        damage_reduction: 0,
        block_count: 0,
        super_armor: false,
      };
    }

    function mergeCombatEffectMaps(base = createEmptyCombatEffectMap(), incoming = {}) {
      const seed = createEmptyCombatEffectMap();
      const result = { ...seed, ...(base || {}) };
      Object.entries(incoming || {}).forEach(([key, value]) => {
        if (!(key in seed) || value === undefined) return;
        if (['skip_turn', 'cannot_react', 'silence', 'disarm', 'blind', 'super_armor', 'invincible', 'skill_seal'].includes(key)) {
          result[key] = !!result[key] || !!value;
          return;
        }
        if (['control_resist_mult', 'final_damage_mult', 'final_heal_mult', 'shield_gain_mult'].includes(key)) {
          result[key] = Number(result[key] ?? 1) * Number(value ?? 1);
          return;
        }
        if (
          [
            'lock_level',
            'death_save_count',
            'revive_count',
            'block_count',
            'substitute_count',
            'min_hp_floor',
            'damage_share_count',
            'invincible_tier_threshold',
            'daily_trigger_limit',
          ].includes(key)
        ) {
          result[key] = Math.max(Number(result[key] ?? 0), Number(value ?? 0));
          return;
        }
        result[key] = Number(result[key] ?? 0) + Number(value ?? 0);
      });
      return result;
    }

    function hasMeaningfulCombatEffect(effectMap = {}) {
      const seed = createEmptyCombatEffectMap();
      return Object.keys(seed).some(key => {
        if (['skip_turn', 'cannot_react', 'silence', 'disarm', 'blind', 'super_armor', 'invincible', 'skill_seal'].includes(key)) {
          return !!effectMap[key];
        }
        const baseValue = Number(seed[key] ?? 0);
        const nextValue = Number(effectMap[key] ?? seed[key] ?? 0);
        return nextValue !== baseValue;
      });
    }

    const BATTLE_SKILL_SUMMARY_EFFECT_MECHANISMS = new Set([
      '属性摘要',
      '构型摘要',
      '术式摘要',
      '极性摘要',
      '属性系数摘要',
    ]);

    function isBattleSkillSummaryEffect(effect = {}) {
      const mechanism = String(effect?.机制 || '').trim();
      return !!mechanism && (BATTLE_SKILL_SUMMARY_EFFECT_MECHANISMS.has(mechanism) || effect?.summaryOnly === true);
    }

    function getBattleSkillSummaryEffects(skill = {}) {
      const rawEffects = Array.isArray(skill?._效果数组) ? skill._效果数组 : [];
      return rawEffects.filter(effect => effect && typeof effect === 'object' && isBattleSkillSummaryEffect(effect));
    }

    function getBattleSkillSummaryEffectByMechanism(skill = {}, mechanism = '') {
      const target = String(mechanism || '').trim();
      if (!target) return null;
      return getBattleSkillSummaryEffects(skill).find(effect => String(effect?.机制 || '').trim() === target) || null;
    }

    function getSkillEffects(skill) {
      const rawEffects = (Array.isArray(skill?._效果数组) ? skill._效果数组 : []).filter(
        effect => effect?.机制 !== '系统基础' && !isBattleSkillSummaryEffect(effect),
      );
      const creationEffects = rawEffects.filter(effect =>
        ['生成造物', '造物生成'].includes(String(effect?.机制 || '')),
      );
      if (!creationEffects.length) return rawEffects;
      const usageEffects = creationEffects.flatMap(effect => (Array.isArray(effect?.使用效果) ? effect.使用效果 : []));
      return usageEffects;
    }

    const BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF = Object.freeze({
      掌控: 1,
      威力: 1,
      消耗: 1,
      前摇: 1,
      控制: 1,
      速度: 1,
    });
    const BATTLE_SKILL_ATTRIBUTE_COEFF_MAP = Object.freeze({
      金: Object.freeze({ 掌控: 1.02, 威力: 1.08, 消耗: 1.0, 前摇: 0.98, 控制: 0.98, 速度: 1.02 }),
      木: Object.freeze({ 掌控: 1.08, 威力: 0.96, 消耗: 0.96, 前摇: 1.0, 控制: 1.05, 速度: 1.0 }),
      水: Object.freeze({ 掌控: 1.06, 威力: 0.98, 消耗: 0.95, 前摇: 1.0, 控制: 1.04, 速度: 1.0 }),
      火: Object.freeze({ 掌控: 0.96, 威力: 1.15, 消耗: 1.06, 前摇: 1.0, 控制: 0.95, 速度: 1.02 }),
      土: Object.freeze({ 掌控: 1.0, 威力: 1.05, 消耗: 1.0, 前摇: 1.04, 控制: 1.02, 速度: 0.95 }),
      雷: Object.freeze({ 掌控: 1.0, 威力: 1.1, 消耗: 1.03, 前摇: 0.92, 控制: 0.98, 速度: 1.12 }),
      冰: Object.freeze({ 掌控: 1.04, 威力: 1.02, 消耗: 1.0, 前摇: 1.02, 控制: 1.12, 速度: 0.95 }),
      风: Object.freeze({ 掌控: 1.0, 威力: 1.02, 消耗: 0.96, 前摇: 0.94, 控制: 0.98, 速度: 1.12 }),
      光: Object.freeze({ 掌控: 1.05, 威力: 1.03, 消耗: 0.98, 前摇: 0.98, 控制: 1.02, 速度: 1.0 }),
      暗: Object.freeze({ 掌控: 1.03, 威力: 1.08, 消耗: 1.02, 前摇: 0.98, 控制: 1.04, 速度: 1.0 }),
      空间: Object.freeze({ 掌控: 1.12, 威力: 1.0, 消耗: 1.08, 前摇: 0.96, 控制: 1.08, 速度: 1.02 }),
      创造: Object.freeze({ 掌控: 1.18, 威力: 1.12, 消耗: 1.1, 前摇: 1.0, 控制: 1.12, 速度: 1.0 }),
      毁灭: Object.freeze({ 掌控: 1.08, 威力: 1.22, 消耗: 1.14, 前摇: 1.04, 控制: 1.08, 速度: 0.98 }),
    });

    function normalizeBattleSkillAttributeToken(value = '') {
      const raw = String(value || '').trim();
      if (!raw || raw === '无') return '';
      const aliasMap = {
        金系: '金',
        木系: '木',
        水系: '水',
        火系: '火',
        土系: '土',
        雷系: '雷',
        冰系: '冰',
        风系: '风',
        光系: '光',
        暗系: '暗',
        空间系: '空间',
        创造系: '创造',
        毁灭系: '毁灭',
        光明: '光',
        黑暗: '暗',
        创世: '创造',
        灭世: '毁灭',
      };
      const normalized = aliasMap[raw] || raw;
      return BATTLE_SKILL_ATTRIBUTE_COEFF_MAP[normalized] ? normalized : '';
    }

    function normalizeBattleSkillAttributeTokens(list = []) {
      const source = Array.isArray(list) ? list : [];
      return Array.from(new Set(source.map(normalizeBattleSkillAttributeToken).filter(Boolean)));
    }

    const BATTLE_FUSION_BASE_ELEMENTS = Object.freeze(['水', '火', '风', '土']);
    const BATTLE_FUSION_ADVANCED_ELEMENTS = Object.freeze(['光', '暗', '空间']);
    const BATTLE_FUSION_LAW_ELEMENTS = Object.freeze(['创造', '毁灭']);
    const BATTLE_FUSION_ALLOWED_ELEMENTS = Object.freeze([
      ...BATTLE_FUSION_BASE_ELEMENTS,
      ...BATTLE_FUSION_ADVANCED_ELEMENTS,
      ...BATTLE_FUSION_LAW_ELEMENTS,
    ]);
    const BATTLE_FUSION_ELEMENT_ORDER = Object.freeze([...BATTLE_FUSION_ALLOWED_ELEMENTS]);
    const BATTLE_FUSION_SEMANTICS_MAP = Object.freeze({
      '水/火': Object.freeze({
        pattern: '水火蒸爆',
        multiplier: 1.18,
        failAdjust: 8,
        summary: '水火相激形成高压蒸爆，爆发显著提升。',
      }),
      '水/风': Object.freeze({
        pattern: '水风涡流',
        multiplier: 1.1,
        failAdjust: -4,
        summary: '水借风势形成涡流，融合稳定性更高。',
      }),
      '水/土': Object.freeze({
        pattern: '水土泽域',
        multiplier: 1.08,
        failAdjust: -2,
        summary: '水土交汇形成泥泽领域，控场更稳。',
      }),
      '火/风': Object.freeze({
        pattern: '火风炎岚',
        multiplier: 1.16,
        failAdjust: 6,
        summary: '烈焰借风成势，形成高速扩张的炎岚。',
      }),
      '冰/风': Object.freeze({
        pattern: '冰风霜灾',
        multiplier: 1.14,
        failAdjust: 2,
        summary: '寒流被风卷起，形成持续冻结的霜灾。',
      }),
      '光/暗': Object.freeze({
        pattern: '光暗蚀变',
        multiplier: 1.22,
        failAdjust: 12,
        summary: '光暗对冲本身就足够危险，容易形成湮灭蚀变。',
      }),
      '水/火/风': Object.freeze({
        pattern: '水火风暴',
        multiplier: 1.28,
        failAdjust: 10,
        summary: '蒸爆被风势卷起，形成持续爆裂风暴。',
      }),
      '水/土/风': Object.freeze({
        pattern: '水土风岚·泽域封场',
        multiplier: 1.18,
        failAdjust: 3,
        summary: '泥泽、气流与水势叠加，形成范围封场。',
      }),
      '水/火/土': Object.freeze({
        pattern: '水火土·蒸压熔壳',
        multiplier: 1.22,
        failAdjust: 8,
        summary: '蒸压与土壳并存，兼具压制与爆裂。',
      }),
      '水/火/风/土': Object.freeze({
        pattern: '四象归元·雷霆显化',
        multiplier: 1.24,
        failAdjust: 16,
        summary: '四基础元素归元后显化法则性雷霆，这不是普通雷属性，而是四象归一后的法则征兆。并且已可触发元素剥离。',
        derivedEffects: ['元素剥离'],
      }),
      '光/暗/空间': Object.freeze({
        pattern: '光暗空间·界域扭变',
        multiplier: 1.35,
        failAdjust: 14,
        summary: '光暗对冲叠加空间扭曲，形成界域级压制。',
      }),
      '水/火/风/土/光/暗/空间': Object.freeze({
        pattern: '七元素爆裂',
        multiplier: 1.38,
        failAdjust: 28,
        summary: '四基础元素与三进阶元素同时贯通，踏入真正的七元素爆裂台阶。',
      }),
      '创造/毁灭': Object.freeze({
        pattern: '创造毁灭·法则对冲',
        multiplier: 1.45,
        failAdjust: 18,
        summary: '法则互冲带来极高上限，也伴随极高失控风险。',
      }),
      '光/暗/创造/毁灭': Object.freeze({
        pattern: '光暗双法则·湮生对撞',
        multiplier: 1.6,
        failAdjust: 24,
        summary: '光暗对冲叠加双法则冲撞，接近失控边缘的极限融合。',
      }),
    });

    function sortBattleFusionElements(elements = []) {
      const normalized = normalizeBattleSkillAttributeTokens(elements).filter(token =>
        BATTLE_FUSION_ALLOWED_ELEMENTS.includes(token),
      );
      const orderIndex = token => {
        const index = BATTLE_FUSION_ELEMENT_ORDER.indexOf(token);
        return index >= 0 ? index : BATTLE_FUSION_ELEMENT_ORDER.length + token.charCodeAt(0);
      };
      return [...normalized].sort((a, b) => orderIndex(a) - orderIndex(b));
    }

    function buildBattleFusionKey(elements = []) {
      return sortBattleFusionElements(elements).join('/');
    }

    function resolveBattleFusionSemantics(elements = []) {
      const normalized = sortBattleFusionElements(elements);
      const key = normalized.join('/');
      const preset = BATTLE_FUSION_SEMANTICS_MAP[key];
      let multiplier = Number(preset?.multiplier || 1);
      let failAdjust = Number(preset?.failAdjust || 0);
      let pattern = String(preset?.pattern || (normalized.length ? normalized.join('/') : '未指定'));
      let summary = String(
        preset?.summary || (normalized.length ? `${normalized.join('/')} 并行融合。` : '未指定元素融合。'),
      );
      const derivedEffects = normalizeBattleSkillStringArray(preset?.derivedEffects || []);
      const hasLaw = normalized.some(token => token === '创造' || token === '毁灭');
      const hasSpace = normalized.includes('空间');
      const hasLightDark = normalized.includes('光') && normalized.includes('暗');
      if (!preset && hasSpace) {
        multiplier *= 1.08;
        failAdjust += 4;
        summary += ' 空间参与抬高融合上限。';
      }
      if (!preset && hasLightDark) {
        multiplier *= 1.1;
        failAdjust += 6;
        summary += ' 光暗对冲令结构更危险。';
      }
      if (!preset && hasLaw) {
        const lawCount = normalized.filter(token => token === '创造' || token === '毁灭').length;
        multiplier *= 1 + lawCount * 0.12;
        failAdjust += lawCount * 10;
        summary += ' 法则元素参与显著抬高上限与风险。';
      }
      return { key, elements: normalized, pattern, multiplier, failAdjust, summary, derivedEffects };
    }

    function extractBattleFusionElementsFromText(raw = '') {
      const text = String(raw || '').trim();
      if (!text) return [];
      if (/七元素/.test(text)) return [...BATTLE_FUSION_BASE_ELEMENTS, ...BATTLE_FUSION_ADVANCED_ELEMENTS];
      if (/四元素/.test(text)) return [...BATTLE_FUSION_BASE_ELEMENTS];
      const directMatches = [];
      ['创造', '毁灭', '空间', '光明', '黑暗', '创世', '灭世', '水', '火', '土', '风', '光', '暗'].forEach(token => {
        if (text.includes(token)) directMatches.push(normalizeBattleSkillAttributeToken(token));
      });
      const cleaned = text
        .replace(/多元素融合|元素融合|融合技|融合|蓄力|极致|调用|使用|释放|施展/g, ' ')
        .replace(/[、,，|｜/＋+]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const splitMatches = cleaned
        ? cleaned
            .split(' ')
            .map(normalizeBattleSkillAttributeToken)
            .filter(token => token && BATTLE_FUSION_ALLOWED_ELEMENTS.includes(token))
        : [];
      return Array.from(new Set([...directMatches, ...splitMatches].filter(Boolean)));
    }

    function buildBattleFusionPattern(elements = []) {
      return resolveBattleFusionSemantics(elements).pattern;
    }

    function collectBattleUnlockedAttributeTokens(char = {}) {
      const collected = [];
      Object.values(char?.武魂 || {}).forEach(spiritData => {
        const unlocked = Array.isArray(spiritData?.已解锁调用权) ? spiritData.已解锁调用权 : [];
        collected.push(...normalizeBattleSkillAttributeTokens(unlocked));
      });
      const bloodlineUnlocked = Array.isArray(char?.血脉之力?.已解锁调用权)
        ? char.血脉之力.已解锁调用权
        : [];
      collected.push(...normalizeBattleSkillAttributeTokens(bloodlineUnlocked));
      return Array.from(new Set(collected));
    }

    function hasBattleUnlockedAttributeSet(char = {}, required = []) {
      const unlocked = new Set(collectBattleUnlockedAttributeTokens(char));
      return normalizeBattleSkillAttributeTokens(required).every(token => unlocked.has(token));
    }

    function normalizeBattleSkillAttributeCoefficients(value = {}) {
      const normalized = { ...BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF };
      Object.keys(BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF).forEach(key => {
        const raw = Number(value?.[key] ?? BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF[key]);
        normalized[key] = Number.isFinite(raw) && raw > 0 ? raw : BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF[key];
      });
      return normalized;
    }

    function normalizeBattleSkillStringArray(value = []) {
      const source = Array.isArray(value) ? value : [];
      return Array.from(new Set(source.map(item => String(item || '').trim()).filter(Boolean)));
    }

    function normalizeBattleSkillAttributeSource(value = '') {
      const text = String(value || '').trim();
      return ['自身操控', '魂技调用'].includes(text) ? text : '无';
    }

    function normalizeBattleSkillRole(value = '') {
      const text = String(value || '').trim();
      return ['增幅器', '结构术式'].includes(text) ? text : '无';
    }

    function normalizeBattleSkillElementStructure(value = {}) {
      const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
      return {
        模式: String(source?.模式 || '无').trim() || '无',
        核心元素: normalizeBattleSkillAttributeTokens(source?.核心元素),
        驱动元素: normalizeBattleSkillAttributeTokens(source?.驱动元素),
        约束元素: normalizeBattleSkillAttributeTokens(source?.约束元素),
        触发元素: normalizeBattleSkillAttributeTokens(source?.触发元素),
        关系: Array.isArray(source?.关系) ? deepClone(source.关系) : [],
      };
    }

    function normalizeBattleSkillWuxingInvocation(value = {}) {
      const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
      return {
        模式: String(source?.模式 || '无').trim() || '无',
        调用链: normalizeBattleSkillStringArray(source?.调用链),
        回路闭合: !!source?.回路闭合,
        层级回溯: normalizeBattleSkillStringArray(source?.层级回溯),
        终态: String(source?.终态 || '无').trim() || '无',
        结果: String(source?.结果 || '无').trim() || '无',
      };
    }

    function normalizeBattleSkillPolarityInfo(value = {}) {
      const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
      return {
        polarityUnlocked: !!source?.polarityUnlocked,
        polarityMode: String(source?.polarityMode || source?.polarity || '无').trim() || '无',
      };
    }

    function getBattleSkillAttributeSummary(skill = {}) {
      return getBattleSkillSummaryEffectByMechanism(skill, '属性摘要') || {};
    }

    function getBattleSkillAttributeSource(skill = {}) {
      return normalizeBattleSkillAttributeSource(getBattleSkillAttributeSummary(skill)?.属性来源 || '');
    }

    function getBattleSkillRole(skill = {}) {
      return normalizeBattleSkillRole(getBattleSkillAttributeSummary(skill)?.魂技作用 || '');
    }

    function getBattleSkillElementStructure(skill = {}) {
      return normalizeBattleSkillElementStructure(getBattleSkillSummaryEffectByMechanism(skill, '构型摘要') || {});
    }

    function getBattleSkillWuxingInvocation(skill = {}) {
      return normalizeBattleSkillWuxingInvocation(getBattleSkillSummaryEffectByMechanism(skill, '术式摘要') || {});
    }

    function getBattleSkillPolaritySummary(skill = {}) {
      return normalizeBattleSkillPolarityInfo(getBattleSkillSummaryEffectByMechanism(skill, '极性摘要') || {});
    }

    function getBattleSkillRuntimeAttributeCoefficients(skill = {}) {
      const summary = getBattleSkillSummaryEffectByMechanism(skill, '属性系数摘要');
      return normalizeBattleSkillAttributeCoefficients(summary?.系数 || summary?.属性系数 || {});
    }

    function getBattleSkillDisplayElement(skill = {}) {
      const explicit = String(getBattleSkillAttributeSummary(skill)?.显示元素 || '').trim();
      if (explicit) return explicit;
      const attached = normalizeBattleSkillAttributeTokens(skill?.附带属性);
      return attached.length ? attached.join('/') : '无';
    }

    function hasBattleSkillAttributeStructure(skill = {}) {
      const elementStructure = getBattleSkillElementStructure(skill);
      const wuxingInvocation = getBattleSkillWuxingInvocation(skill);
      const polarityInfo = getBattleSkillPolaritySummary(skill);
      return (
        getBattleSkillAttributeSource(skill) !== '无' ||
        getBattleSkillRole(skill) !== '无' ||
        elementStructure.模式 !== '无' ||
        elementStructure.核心元素.length > 0 ||
        elementStructure.驱动元素.length > 0 ||
        elementStructure.约束元素.length > 0 ||
        elementStructure.触发元素.length > 0 ||
        elementStructure.关系.length > 0 ||
        wuxingInvocation.模式 !== '无' ||
        wuxingInvocation.调用链.length > 0 ||
        wuxingInvocation.回路闭合 ||
        wuxingInvocation.层级回溯.length > 0 ||
        wuxingInvocation.终态 !== '无' ||
        wuxingInvocation.结果 !== '无' ||
        polarityInfo.polarityUnlocked ||
        polarityInfo.polarityMode !== '无'
      );
    }

    function mergeBattleSkillAttributeCoefficientProfiles(list = []) {
      const profiles = (Array.isArray(list) ? list : []).map(profile =>
        normalizeBattleSkillAttributeCoefficients(profile || {}),
      );
      if (!profiles.length) return normalizeBattleSkillAttributeCoefficients();
      const merged = {};
      Object.keys(BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF).forEach(key => {
        merged[key] = profiles.reduce((sum, profile) => sum + Number(profile?.[key] ?? 1), 0) / profiles.length;
      });
      return normalizeBattleSkillAttributeCoefficients(merged);
    }

    function buildBattleSkillAttributeCoefficientsFromAttachedAttributes(attachedAttributes = []) {
      const attached = normalizeBattleSkillAttributeTokens(attachedAttributes);
      if (!attached.length) return normalizeBattleSkillAttributeCoefficients();
      return mergeBattleSkillAttributeCoefficientProfiles(
        attached.map(attr => BATTLE_SKILL_ATTRIBUTE_COEFF_MAP[attr] || BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF),
      );
    }

    function resolveBattleSkillAttributeCoefficients(skill = {}) {
      const attached = normalizeBattleSkillAttributeTokens(skill?.附带属性);
      const hasV2Structure = hasBattleSkillAttributeStructure(skill);
      if (!attached.length)
        return hasV2Structure
          ? getBattleSkillRuntimeAttributeCoefficients(skill)
          : normalizeBattleSkillAttributeCoefficients();
      if (hasV2Structure) return getBattleSkillRuntimeAttributeCoefficients(skill);
      return buildBattleSkillAttributeCoefficientsFromAttachedAttributes(attached);
    }

    function isNeutralBattleSkillAttributeCoefficients(coeff = {}) {
      const normalized = normalizeBattleSkillAttributeCoefficients(coeff);
      return Object.keys(BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF).every(
        key => Math.abs(Number(normalized[key] || 1) - 1) < 0.0001,
      );
    }

    function roundBattleScaledNumber(value, digits = 2) {
      const num = Number(value);
      if (!Number.isFinite(num)) return 0;
      const scaled = Number(num.toFixed(digits));
      return Number.isInteger(scaled) ? Math.trunc(scaled) : scaled;
    }

    function scaleBattleValue(value, ratio = 1, options = {}) {
      const num = Number(value);
      if (!Number.isFinite(num)) return value;
      let next = num * Number(ratio || 1);
      if (options.min !== undefined) next = Math.max(Number(options.min), next);
      if (options.max !== undefined) next = Math.min(Number(options.max), next);
      return roundBattleScaledNumber(next, options.digits ?? 2);
    }

    function scaleBattleFactor(value, ratio = 1, neutral = 1) {
      const num = Number(value);
      if (!Number.isFinite(num)) return value;
      return roundBattleScaledNumber(Number(neutral) + (num - Number(neutral)) * Number(ratio || 1), 4);
    }

    function scaleBattleLockLevel(value, ratio = 1) {
      const num = Number(value || 0);
      if (!(num > 0)) return 0;
      return Math.max(1, Math.round(num * Number(ratio || 1)));
    }

    function scaleBattleDebuffRatio(value, ratio = 1, neutral = 1) {
      const num = Number(value);
      if (!Number.isFinite(num)) return value;
      return roundBattleScaledNumber(Number(neutral) - (Number(neutral) - num) * Number(ratio || 1), 4);
    }

    function scaleBattleSupportBuffCalc(calc = {}, supportScale = 1) {
      const next = deepClone(calc || {});
      const ratio = Number(supportScale || 1);
      if (!Number.isFinite(ratio) || Math.abs(ratio - 1) < 0.0001) return next;

      ['hit_bonus', 'reaction_bonus', 'dodge_bonus', 'attacker_speed_bonus', 'cast_speed_bonus', 'interrupt_bonus'].forEach(
        key => {
          if (next[key] !== undefined) next[key] = scaleBattleValue(next[key], ratio, { digits: 4 });
        },
      );

      ['damage_reduction', 'counter_attack_ratio', 'damage_reflect_ratio', 'damage_share_ratio', 'bonus_true_damage_ratio', 'life_steal_ratio', 'sp_gain_ratio', 'men_gain_ratio', 'hot_heal_ratio', 'heal_inversion_ratio', 'revive_heal_ratio'].forEach(
        key => {
          if (next[key] !== undefined) next[key] = scaleBattleValue(next[key], ratio, { min: 0, digits: 4 });
        },
      );

      ['final_damage_mult', 'final_heal_mult', 'shield_gain_mult', 'control_resist_mult'].forEach(key => {
        if (next[key] !== undefined) next[key] = scaleBattleFactor(next[key], ratio, 1);
      });

      ['final_damage_bonus', 'final_heal_bonus', 'shield_gain_bonus'].forEach(key => {
        if (next[key] !== undefined) next[key] = scaleBattleValue(next[key], ratio, { min: 0, digits: 2 });
      });

      if (next.min_hp_floor !== undefined) next.min_hp_floor = Math.max(0, Math.round(Number(next.min_hp_floor || 0) * ratio));
      ['death_save_count', 'revive_count', 'substitute_count', 'damage_share_count', 'daily_trigger_limit'].forEach(key => {
        if (next[key] !== undefined) next[key] = Math.max(0, Math.round(Number(next[key] || 0) * ratio));
      });
      if (next.invincible_tier_threshold !== undefined)
        next.invincible_tier_threshold = Math.max(0, Number(next.invincible_tier_threshold || 0));

      return next;
    }

    function scaleSkillCostText(costText, ratio = 1) {
      const text = String(costText || '').trim();
      if (!text || text === '无' || Math.abs(Number(ratio || 1) - 1) < 0.0001) return text || '无';
      return text.replace(
        /(\d+(?:\.\d+)?)(%?)/g,
        (_, numText, suffix) =>
          `${roundBattleScaledNumber(Number(numText) * Number(ratio || 1), suffix ? 2 : 0)}${suffix}`,
      );
    }

    function ensureBattleSkillAttributeBase(skill = {}) {
      if (skill?.__attributeCoeffBase && Array.isArray(skill.__attributeCoeffBase.effects))
        return skill.__attributeCoeffBase;
      const runtimeMeta = getSkillRuntimeMeta(skill);
      const base = {
        effects: deepClone(skill?._效果数组 || []),
        cast_time: Number(runtimeMeta.cast_time ?? 0) || 0,
        cost_text: runtimeMeta.消耗 || '无',
      };
      skill.__attributeCoeffBase = deepClone(base);
      return skill.__attributeCoeffBase;
    }

    function ensureBattleTransientStateEffect(skill = {}) {
      if (!Array.isArray(skill._效果数组)) skill._效果数组 = [];
      let stateEffect = skill._效果数组.find(effect => effect?.机制 === '状态挂载');
      if (!stateEffect) {
        const targetText = getSkillTarget(skill);
        stateEffect = {
          机制: '状态挂载',
          状态名称: '无',
          目标: targetText,
          对象: targetText,
          持续回合: 0,
          面板修改比例: {},
          计算层效果: createEmptyCombatEffectMap(),
        };
        skill._效果数组.push(stateEffect);
      }
      if (!stateEffect.状态名称 || !String(stateEffect.状态名称).trim()) stateEffect.状态名称 = '无';
      if (!stateEffect.目标) stateEffect.目标 = getSkillTarget(skill);
      if (!stateEffect.对象) stateEffect.对象 = stateEffect.目标;
      if (
        !stateEffect.面板修改比例 ||
        typeof stateEffect.面板修改比例 !== 'object' ||
        Array.isArray(stateEffect.面板修改比例)
      )
        stateEffect.面板修改比例 = {};
      stateEffect.计算层效果 = mergeCombatEffectMaps(createEmptyCombatEffectMap(), stateEffect.计算层效果 || {});
      return stateEffect;
    }

    function applyAttributeCoeffToCombatSkill(skill = {}) {
      if (!skill || typeof skill !== 'object') return skill;
      const base = ensureBattleSkillAttributeBase(skill);
      skill._效果数组 = deepClone(base.effects || []);
      skill.cast_time = Number(base.cast_time ?? 0) || 0;
      skill.消耗 = String(base.cost_text || '无') || '无';

      const attached = normalizeBattleSkillAttributeTokens(skill?.附带属性);
      const hasV2Structure = hasBattleSkillAttributeStructure(skill);
      skill.附带属性 = attached;
      ['属性系数', '属性来源', '魂技作用', '元素构型', '五行调用结构', '极性信息', '元素'].forEach(key => {
        if (key in skill) delete skill[key];
      });
      const coeff = resolveBattleSkillAttributeCoefficients(skill);

      if ((!attached.length && !hasV2Structure) || isNeutralBattleSkillAttributeCoefficients(coeff)) return skill;

      const normalizedCoeff = normalizeBattleSkillAttributeCoefficients(coeff);
      const effects = Array.isArray(skill._效果数组) ? skill._效果数组 : [];
      const systemBase = effects.find(effect => effect?.机制 === '系统基础');
      const directDamageMechanisms = new Set(['直接伤害', '多段伤害', '持续伤害', '延迟爆发']);

      if (systemBase) {
        const baseCostText = String(systemBase.消耗 || skill.消耗 || '无') || '无';
        const scaledCostText = scaleSkillCostText(baseCostText, normalizedCoeff.消耗);
        systemBase.消耗 = scaledCostText;
        skill.消耗 = scaledCostText;
        const baseCastTime = Number(systemBase.cast_time ?? skill.cast_time ?? 0) || 0;
        const scaledCastTime = Math.max(baseCastTime > 0 ? 1 : 0, Math.round(baseCastTime * normalizedCoeff.前摇));
        systemBase.cast_time = scaledCastTime;
        skill.cast_time = scaledCastTime;
      } else {
        skill.消耗 = scaleSkillCostText(skill.消耗, normalizedCoeff.消耗);
        skill.cast_time = Math.max(
          skill.cast_time > 0 ? 1 : 0,
          Math.round(Number(skill.cast_time || 0) * normalizedCoeff.前摇),
        );
      }

      effects.forEach(effect => {
        const mechanism = String(effect?.机制 || effect?.名称 || effect?.类型 || '');
        if (!mechanism) return;

        if (directDamageMechanisms.has(mechanism) && effect.威力倍率 !== undefined) {
          effect.威力倍率 = scaleBattleValue(effect.威力倍率, coeff.威力, { min: 0, digits: 2 });
        }
        if (['流血DOT', '持续伤害DOT'].includes(mechanism)) {
          if (effect.dot_damage !== undefined)
            effect.dot_damage = scaleBattleValue(effect.dot_damage, coeff.威力, { min: 0, digits: 2 });
          if (effect.每回合伤害 !== undefined)
            effect.每回合伤害 = scaleBattleValue(effect.每回合伤害, coeff.威力, { min: 0, digits: 2 });
        }
        if (mechanism === '护盾' && effect.护盾值 !== undefined) {
          effect.护盾值 = scaleBattleValue(effect.护盾值, coeff.威力, { min: 0, digits: 0 });
        }
        if (mechanism === '属性变化' && effect.数值 !== undefined) {
          const property = String(effect.属性 || '').trim();
          const action = String(effect.动作 || '').trim();
          if (action === '加值' && ['vit', 'sp', 'men'].includes(property)) {
            effect.数值 = scaleBattleValue(effect.数值, coeff.威力, { min: 0, digits: 4 });
          } else if (['倍率提升', '倍率压制'].includes(action)) {
            const factor =
              property === '掌控'
                ? coeff.掌控
                : property === '控制'
                  ? coeff.控制
                  : property === '速度'
                    ? coeff.速度
                    : property === '前摇'
                      ? coeff.前摇
                      : property === '消耗'
                        ? coeff.消耗
                        : coeff.威力;
            effect.数值 =
              action === '倍率压制'
                ? scaleBattleDebuffRatio(effect.数值, factor, 1)
                : scaleBattleFactor(effect.数值, factor, 1);
          }
        }
        if (mechanism === '持续恢复' && effect.数值 !== undefined) {
          effect.数值 = scaleBattleValue(effect.数值, coeff.威力, { min: 0, digits: 4 });
        }
        if (mechanism === '消耗修正' && effect.数值 !== undefined) {
          effect.数值 =
            String(effect.动作 || '').trim() === '消耗提高'
              ? scaleBattleFactor(effect.数值, coeff.消耗, 1)
              : scaleBattleDebuffRatio(effect.数值, coeff.消耗, 1);
        }
        if (mechanism === '前摇修正' && effect.数值 !== undefined) {
          effect.数值 =
            String(effect.动作 || '').trim() === '前摇拉长'
              ? scaleBattleFactor(effect.数值, coeff.前摇, 1)
              : scaleBattleDebuffRatio(effect.数值, coeff.前摇, 1);
        }
        if (mechanism === '掌控修正' && effect.数值 !== undefined) {
          effect.数值 =
            String(effect.动作 || '').trim() === '倍率压制'
              ? scaleBattleDebuffRatio(effect.数值, coeff.掌控, 1)
              : scaleBattleFactor(effect.数值, coeff.掌控, 1);
        }
        if (mechanism === '速度修正' && effect.数值 !== undefined) {
          effect.数值 =
            String(effect.动作 || '').trim() === '倍率压制'
              ? scaleBattleDebuffRatio(effect.数值, coeff.速度, 1)
              : scaleBattleFactor(effect.数值, coeff.速度, 1);
        }
        if (mechanism === '打断' && effect.中断概率 !== undefined) {
          effect.中断概率 = scaleBattleValue(effect.中断概率, coeff.控制, { min: 0, max: 1, digits: 4 });
        }
        if (mechanism === '减速' && effect.agi_ratio !== undefined) {
          effect.agi_ratio = scaleBattleDebuffRatio(effect.agi_ratio, coeff.控制, 1);
        }
        if (mechanism === '软控') {
          if (effect.reaction_penalty !== undefined)
            effect.reaction_penalty = scaleBattleValue(effect.reaction_penalty, coeff.控制, { digits: 4 });
          if (effect.cast_speed_penalty !== undefined)
            effect.cast_speed_penalty = scaleBattleValue(effect.cast_speed_penalty, coeff.控制, { digits: 4 });
          if (effect.dodge_penalty !== undefined)
            effect.dodge_penalty = scaleBattleValue(effect.dodge_penalty, coeff.控制, { digits: 4 });
        }
        if (mechanism === '位移限制') {
          if (effect.reaction_penalty !== undefined)
            effect.reaction_penalty = scaleBattleValue(effect.reaction_penalty, coeff.控制, { digits: 4 });
          if (effect.dodge_penalty !== undefined)
            effect.dodge_penalty = scaleBattleValue(effect.dodge_penalty, coeff.控制, { digits: 4 });
          if (effect.lock_level !== undefined) effect.lock_level = scaleBattleLockLevel(effect.lock_level, coeff.控制);
        }
        if (['强制位移', '位移交换', '强制绑定/锁定'].includes(mechanism)) {
          if (effect.dodge_penalty !== undefined)
            effect.dodge_penalty = scaleBattleValue(effect.dodge_penalty, coeff.控制, { digits: 4 });
          if (effect.reaction_penalty !== undefined)
            effect.reaction_penalty = scaleBattleValue(effect.reaction_penalty, coeff.控制, { digits: 4 });
          if (effect.lock_level !== undefined) effect.lock_level = scaleBattleLockLevel(effect.lock_level, coeff.控制);
        }
        if (mechanism === '标记弱点') {
          if (effect.final_damage_mult !== undefined)
            effect.final_damage_mult = scaleBattleFactor(effect.final_damage_mult, coeff.威力, 1);
          if (effect.dodge_penalty !== undefined)
            effect.dodge_penalty = scaleBattleValue(effect.dodge_penalty, coeff.控制, { digits: 4 });
          if (effect.lock_level !== undefined) effect.lock_level = scaleBattleLockLevel(effect.lock_level, coeff.控制);
        }
        if (mechanism === '禁疗' && effect.heal_block_ratio !== undefined) {
          effect.heal_block_ratio = scaleBattleValue(effect.heal_block_ratio, coeff.控制, {
            min: 0,
            max: 1,
            digits: 4,
          });
        }
        if (mechanism === '共享视野') {
          if (effect.reaction_bonus !== undefined)
            effect.reaction_bonus = scaleBattleValue(effect.reaction_bonus, coeff.速度, { digits: 4 });
          if (effect.hit_bonus !== undefined)
            effect.hit_bonus = scaleBattleValue(effect.hit_bonus, coeff.掌控, { digits: 4 });
          if (effect.lock_level !== undefined) effect.lock_level = scaleBattleLockLevel(effect.lock_level, coeff.掌控);
        }
        if (mechanism === '分身') {
          if (effect.dodge_bonus !== undefined)
            effect.dodge_bonus = scaleBattleValue(effect.dodge_bonus, coeff.速度, { digits: 4 });
          if (effect.attacker_speed_bonus !== undefined)
            effect.attacker_speed_bonus = scaleBattleValue(effect.attacker_speed_bonus, coeff.速度, { digits: 4 });
          if (effect.reaction_bonus !== undefined)
            effect.reaction_bonus = scaleBattleValue(effect.reaction_bonus, coeff.速度, { digits: 4 });
          if (effect.hit_bonus !== undefined)
            effect.hit_bonus = scaleBattleValue(effect.hit_bonus, coeff.掌控, { digits: 4 });
          if (effect.lock_level !== undefined) effect.lock_level = scaleBattleLockLevel(effect.lock_level, coeff.掌控);
          if (effect.final_damage_mult !== undefined)
            effect.final_damage_mult = scaleBattleFactor(effect.final_damage_mult, coeff.威力, 1);
        }
        if (mechanism === '无敌金身') {
          if (effect.damage_reduction !== undefined)
            effect.damage_reduction = scaleBattleValue(effect.damage_reduction, coeff.防御 || coeff.威力, { min: 0, max: 1, digits: 4 });
        }
        if (mechanism === '伤害反射' && effect.反射比例 !== undefined) {
          effect.反射比例 = scaleBattleValue(effect.反射比例, coeff.防御 || coeff.威力, { min: 0, max: 1, digits: 4 });
        }
        if (mechanism === '伤害分摊' && effect.分摊比例 !== undefined) {
          effect.分摊比例 = scaleBattleValue(effect.分摊比例, coeff.防御 || coeff.威力, { min: 0, max: 1, digits: 4 });
        }
        if (mechanism === '治疗反转' && effect.反转比例 !== undefined) {
          effect.反转比例 = scaleBattleValue(effect.反转比例, coeff.控制 || coeff.威力, { min: 0, digits: 4 });
        }
        if (mechanism === '斩盾' && effect.斩盾倍率 !== undefined) {
          effect.斩盾倍率 = scaleBattleValue(effect.斩盾倍率, coeff.威力, { min: 0, digits: 4 });
        }
        if (mechanism === '窃取护盾' && effect.窃盾比例 !== undefined) {
          effect.窃盾比例 = scaleBattleValue(effect.窃盾比例, coeff.掌控 || coeff.威力, { min: 0, max: 1, digits: 4 });
        }
        if (mechanism === '引爆持续伤害' && effect.引爆倍率 !== undefined) {
          effect.引爆倍率 = scaleBattleValue(effect.引爆倍率, coeff.威力, { min: 0, digits: 4 });
        }
        if (mechanism === '自身位移') {
          if (effect.dodge_bonus !== undefined)
            effect.dodge_bonus = scaleBattleValue(effect.dodge_bonus, coeff.速度, { digits: 4 });
          if (effect.attacker_speed_bonus !== undefined)
            effect.attacker_speed_bonus = scaleBattleValue(effect.attacker_speed_bonus, coeff.速度, { digits: 4 });
          if (effect.reaction_bonus !== undefined)
            effect.reaction_bonus = scaleBattleValue(effect.reaction_bonus, coeff.速度, { digits: 4 });
        }
        if (mechanism === '追击位移') {
          if (effect.attacker_speed_bonus !== undefined)
            effect.attacker_speed_bonus = scaleBattleValue(effect.attacker_speed_bonus, coeff.速度, { digits: 4 });
          if (effect.hit_bonus !== undefined)
            effect.hit_bonus = scaleBattleValue(effect.hit_bonus, coeff.掌控, { digits: 4 });
          if (effect.final_damage_mult !== undefined)
            effect.final_damage_mult = scaleBattleFactor(effect.final_damage_mult, coeff.威力, 1);
        }
        if (mechanism === '脱离位移') {
          if (effect.dodge_bonus !== undefined)
            effect.dodge_bonus = scaleBattleValue(effect.dodge_bonus, coeff.速度, { digits: 4 });
          if (effect.cast_speed_bonus !== undefined)
            effect.cast_speed_bonus = scaleBattleValue(effect.cast_speed_bonus, coeff.速度, { digits: 4 });
          if (effect.reaction_bonus !== undefined)
            effect.reaction_bonus = scaleBattleValue(effect.reaction_bonus, coeff.速度, { digits: 4 });
        }
        if (mechanism === '状态挂载') {
          effect.计算层效果 = mergeCombatEffectMaps(createEmptyCombatEffectMap(), effect.计算层效果 || {});
          const calc = effect.计算层效果;
          if (calc.hit_bonus !== undefined)
            calc.hit_bonus = scaleBattleValue(calc.hit_bonus, coeff.掌控, { digits: 4 });
          if (calc.lock_level !== undefined) calc.lock_level = scaleBattleLockLevel(calc.lock_level, coeff.掌控);
          if (calc.final_damage_mult !== undefined)
            calc.final_damage_mult = scaleBattleFactor(calc.final_damage_mult, coeff.威力, 1);
          if (calc.final_damage_bonus !== undefined)
            calc.final_damage_bonus = scaleBattleValue(calc.final_damage_bonus, coeff.威力, { digits: 2 });
          if (calc.final_heal_mult !== undefined)
            calc.final_heal_mult = scaleBattleFactor(calc.final_heal_mult, coeff.威力, 1);
          if (calc.final_heal_bonus !== undefined)
            calc.final_heal_bonus = scaleBattleValue(calc.final_heal_bonus, coeff.威力, { digits: 2 });
          if (calc.shield_gain_mult !== undefined)
            calc.shield_gain_mult = scaleBattleFactor(calc.shield_gain_mult, coeff.威力, 1);
          if (calc.shield_gain_bonus !== undefined)
            calc.shield_gain_bonus = scaleBattleValue(calc.shield_gain_bonus, coeff.威力, { digits: 2 });
          if (calc.sp_gain_ratio !== undefined)
            calc.sp_gain_ratio = scaleBattleValue(calc.sp_gain_ratio, coeff.威力, { digits: 4 });
          if (calc.men_gain_ratio !== undefined)
            calc.men_gain_ratio = scaleBattleValue(calc.men_gain_ratio, coeff.威力, { digits: 4 });
          if (calc.dot_damage !== undefined)
            calc.dot_damage = scaleBattleValue(calc.dot_damage, coeff.威力, { min: 0, digits: 2 });
          if (calc.reaction_penalty !== undefined)
            calc.reaction_penalty = scaleBattleValue(calc.reaction_penalty, coeff.控制, { digits: 4 });
          if (calc.cast_speed_penalty !== undefined)
            calc.cast_speed_penalty = scaleBattleValue(calc.cast_speed_penalty, coeff.控制, { digits: 4 });
          if (calc.dodge_penalty !== undefined)
            calc.dodge_penalty = scaleBattleValue(calc.dodge_penalty, coeff.控制, { digits: 4 });
          if (calc.resource_block_ratio !== undefined)
            calc.resource_block_ratio = scaleBattleValue(calc.resource_block_ratio, coeff.控制, {
              min: 0,
              max: 1,
              digits: 4,
            });
          if (calc.random_target_rate !== undefined)
            calc.random_target_rate = scaleBattleValue(calc.random_target_rate, coeff.控制, {
              min: 0,
              max: 1,
              digits: 4,
            });
          if (calc.control_success_bonus !== undefined)
            calc.control_success_bonus = scaleBattleValue(calc.control_success_bonus, coeff.控制, { digits: 4 });
          if (calc.reaction_bonus !== undefined)
            calc.reaction_bonus = scaleBattleValue(calc.reaction_bonus, coeff.速度, { digits: 4 });
          if (calc.attacker_speed_bonus !== undefined)
            calc.attacker_speed_bonus = scaleBattleValue(calc.attacker_speed_bonus, coeff.速度, { digits: 4 });
          if (calc.cast_speed_bonus !== undefined)
            calc.cast_speed_bonus = scaleBattleValue(calc.cast_speed_bonus, coeff.速度, { digits: 4 });
          if (calc.dodge_bonus !== undefined)
            calc.dodge_bonus = scaleBattleValue(calc.dodge_bonus, coeff.速度, { digits: 4 });
        }
      });

      const precisionDelta = roundBattleScaledNumber(coeff.掌控 - 1, 4);
      if (Math.abs(precisionDelta) > 0.0001) {
        const precisionState = ensureBattleTransientStateEffect(skill);
        const calc = precisionState.计算层效果 || (precisionState.计算层效果 = createEmptyCombatEffectMap());
        calc.hit_bonus = roundBattleScaledNumber(Number(calc.hit_bonus || 0) + precisionDelta, 4);
      }

      return skill;
    }

    function getSystemBaseEffect(skill) {
      return (Array.isArray(skill?._效果数组) ? skill._效果数组 : []).find(effect => effect?.机制 === '系统基础') || {};
    }

    function getSkillRuntimeMeta(skill) {
      const systemBase = getSystemBaseEffect(skill);
      const baseType = String(systemBase?.技能类型 || '').trim();
      const baseTargetModel = normalizeBattleSkillTargetModel(
        systemBase?.目标模型 || systemBase?.对象 || '敌方单体',
        '敌方单体',
      );
      const baseTarget = mapBattleTargetModelToCombatTarget(baseTargetModel);
      const baseTargetModifiers = normalizeBattleSkillTargetModifiers(
        Array.isArray(systemBase?.目标修饰) && systemBase.目标修饰.length
          ? systemBase.目标修饰
          : deriveBattleSkillTargetModifiers(skill, baseTargetModel),
      );
      const baseResolutionStrategy = String(
        systemBase?.结算策略 || deriveBattleTargetResolutionStrategy(baseTargetModel),
      ).trim() || '单目标独立';
      const baseCostRaw = systemBase?.消耗 ?? '无';
      const baseCost =
        typeof baseCostRaw === 'object' ? formatCostObjectToString(baseCostRaw) : String(baseCostRaw || '无').trim() || '无';
      const baseCastTime = Number(systemBase?.cast_time ?? 0) || 0;
      return {
        技能类型: normalizeSkillTypeLabel(baseType || '无'),
        目标模型: baseTargetModel,
        目标修饰: baseTargetModifiers,
        结算策略: baseResolutionStrategy,
        对象: baseTarget,
        消耗: baseCost,
        cast_time: baseCastTime,
      };
    }

    function getSkillType(skill) {
      return getSkillRuntimeMeta(skill).技能类型;
    }

    function getSkillCastTime(skill) {
      return getSkillRuntimeMeta(skill).cast_time;
    }

    function getSkillCostText(skill) {
      return getSkillRuntimeMeta(skill).消耗;
    }

    function getSkillTarget(skill) {
      return getSkillRuntimeMeta(skill).对象;
    }

    function getSkillTargetModel(skill) {
      return getSkillRuntimeMeta(skill).目标模型;
    }

    function getPrimaryDamageEffect(skill) {
      return (
        getSkillEffects(skill).find(effect =>
          ['直接伤害', '多段伤害', '持续伤害', '延迟爆发'].includes(effect?.机制),
        ) || {}
      );
    }

    function getPrimaryStateEffect(skill) {
      return getSkillEffects(skill).find(effect => effect?.机制 === '状态挂载') || {};
    }

    function getPrimaryStateCalc(skill) {
      return getPrimaryStateEffect(skill)?.计算层效果 || createEmptyCombatEffectMap();
    }

    function getPrimaryStateName(skill) {
      const state = getPrimaryStateEffect(skill);
      if (state?.状态名称 && state.状态名称 !== '无') return state.状态名称;
      const fallback = getSkillEffects(skill).find(effect =>
        [
          '感知干扰',
          '隐身',
          '破隐',
          '标记锁定',
          '目标锁定',
          '幻境',
          '催眠',
          '认知扭曲',
          '禁疗',
          '缴械',
          '嘲讽',
          '护卫',
          '减速',
          '软控',
          '位移限制',
          '强制绑定/锁定',
          '自身位移',
          '强制位移',
          '位移交换',
          '追击',
          '追击位移',
          '脱离位移',
          '反制',
          '条件触发',
          '转化',
          '复制',
          '状态交换',
          '状态转移',
          '引爆持续伤害',
          '斩盾',
          '窃取护盾',
          '治疗反转',
          '封技',
          '无敌金身',
          '伤害反射',
          '伤害分摊',
          '替身抵消',
          '复苏',
          '硬控',
          '霸体',
          '护盾',
        ].includes(effect?.机制),
      );
      return fallback?.机制 || '';
    }

    function getPrimaryStateFlags(skill) {
      return String(getPrimaryStateEffect(skill)?.特殊机制标识 || '无');
    }

    function hasSkillMechanism(skill, mechanismList = []) {
      return getSkillEffects(skill).some(effect => mechanismList.includes(effect?.机制));
    }

    function getSkillMechanismLabels(skill) {
      return Array.from(
        new Set(
          getSkillEffects(skill)
            .map(effect => String(effect?.机制 || effect?.名称 || effect?.类型 || '').trim())
            .filter(Boolean),
        ),
      );
    }

    function getBattleSkillMechanismMeta(label = '') {
      const normalizedLabel = String(label || '').trim();
      if (!normalizedLabel) return null;
      const meta = BATTLE_SKILL_MECHANISM_META[normalizedLabel];
      return meta && typeof meta === 'object' ? meta : null;
    }

    function getBattleMechanismSemanticSet(semanticKey = '') {
      if (semanticKey === '可赋予') return BATTLE_GRANTABLE_MECHANISM_SET;
      if (semanticKey === '群体赋予') return BATTLE_GROUP_GRANTABLE_MECHANISM_SET;
      if (semanticKey === '敌对') return BATTLE_HOSTILE_MECHANISM_SET;
      if (semanticKey === '上下文') return BATTLE_CONTEXTUAL_MECHANISM_SET;
      if (semanticKey === '仅自身') return BATTLE_SELF_ONLY_MECHANISM_SET;
      return new Set();
    }

    function hasSkillMechanismSemantic(skill, semanticKey = '') {
      const semanticSet = getBattleMechanismSemanticSet(semanticKey);
      if (!(semanticSet.size > 0)) return false;
      return getSkillMechanismLabels(skill).some(label => semanticSet.has(label));
    }

    function skillTargetsFriendlySide(skill) {
      return ['自身', '友方单体', '友方群体', '全场'].includes(getSkillTargetModel(skill));
    }

    function skillTargetsEnemySide(skill) {
      return ['敌方单体', '敌方群体', '全场'].includes(getSkillTargetModel(skill));
    }

    function skillCanGrantFriendlyMechanism(skill) {
      return skillTargetsFriendlySide(skill) && hasSkillMechanismSemantic(skill, '可赋予');
    }

    function getSkillAiRoleTags(skill) {
      return Array.from(
        new Set(
          getSkillMechanismLabels(skill)
            .map(label => getBattleSkillMechanismMeta(label))
            .filter(meta => meta && Array.isArray(meta.决策标签))
            .flatMap(meta => meta.决策标签)
            .map(tag => String(tag || '').trim())
            .filter(Boolean),
        ),
      );
    }

    function hasSkillAiRoleTag(skill, tag = '') {
      const normalizedTag = String(tag || '').trim();
      if (!normalizedTag) return false;
      return getSkillAiRoleTags(skill).includes(normalizedTag);
    }

    function getSkillSummaryHint(skill, key = '', fallback = '') {
      const normalizedKey = String(key || '').trim();
      if (!normalizedKey) return fallback;
      const entries = getSkillMechanismLabels(skill)
        .map(label => getBattleSkillMechanismMeta(label))
        .filter(meta => meta && meta.摘要提示 && typeof meta.摘要提示 === 'object');
      for (const meta of entries) {
        const value = String(meta.摘要提示[normalizedKey] || '').trim();
        if (value) return value;
      }
      return fallback;
    }

    function findBattleSkillEffect(skill, matcher) {
      if (typeof matcher !== 'function') return null;
      return getSkillEffects(skill).find(effect => matcher(effect)) || null;
    }

    function isBattleRecoverEffect(effect, properties = []) {
      const property = String(effect?.属性 || '').trim();
      const allowAll = !Array.isArray(properties) || properties.length === 0;
      const propertyMatched = allowAll || properties.includes(property);
      if (!propertyMatched) return false;
      if (String(effect?.机制 || '').trim() === '持续恢复') return ['vit', 'sp', 'men'].includes(property);
      return (
        String(effect?.机制 || '').trim() === '属性变化' &&
        String(effect?.动作 || '').trim() === '加值' &&
        ['vit', 'sp', 'men'].includes(property)
      );
    }

    function isBattleAttributeSupportEffect(effect) {
      const mechanism = String(effect?.机制 || '').trim();
      return ['属性变化', '持续恢复', '消耗修正', '前摇修正', '掌控修正', '速度修正'].includes(mechanism);
    }

    function isBattleDebuffAttributeEffect(effect) {
      const mechanism = String(effect?.机制 || '').trim();
      const action = String(effect?.动作 || '').trim();
      if (mechanism === '消耗修正') return action === '消耗提高';
      if (mechanism === '前摇修正') return action === '前摇拉长';
      if (mechanism === '掌控修正' || mechanism === '速度修正') return action === '倍率压制';
      if (mechanism === '属性变化') return ['减值', '倍率压制'].includes(action);
      return false;
    }

    function normalizeSkillTypeLabel(raw) {
      const text = String(raw || '无');
      if (!text || text === '无') return '无';
      if (/输出|伤害|爆发|破甲|斩杀/.test(text)) return '输出';
      if (/控制|削弱|打断|沉默|禁疗|减速|软控|位移限制|锁定|束缚|缴械|驱散|干扰|扭曲|嘲讽|破隐|封技|治疗反转/.test(text)) return '控制';
      if (/防御|护盾|格挡|霸体|免死|反制|无敌|复苏|替身|分摊|反射/.test(text)) return '防御';
      if (/位移|机动|追击|脱离|隐身|护卫/.test(text)) return '辅助';
      if (/辅助|增益|回复|治疗/.test(text)) return '辅助';
      return text.split(/[\/|｜]/)[0] || text;
    }

    function inferSkillTypeFromEffects(skill) {
      const systemBase = getSystemBaseEffect(skill);
      const fromSystem = normalizeSkillTypeLabel(systemBase?.技能类型);
      if (fromSystem !== '无') return fromSystem;
      const summarySkillType = getSkillSummaryHint(skill, 'skillType', '');
      if (summarySkillType) return normalizeSkillTypeLabel(summarySkillType);
      if (
        hasSkillMechanism(skill, [
          '感知干扰',
          '破隐',
          '硬控',
          '催眠',
          '幻境',
          '标记锁定',
          '目标锁定',
          '禁疗',
          '打断',
          '缴械',
          '认知扭曲',
          '沉默',
          '减速',
          '软控',
          '位移限制',
          '强制位移',
          '位移交换',
          '强制绑定/锁定',
          '嘲讽',
          '封技',
          '治疗反转',
        ])
      )
        return '控制';
      if (hasSkillMechanism(skill, ['护盾', '减伤', '格挡', '霸体', '免死', '反制', '无敌金身', '伤害反射', '伤害分摊', '替身抵消', '复苏'])) return '防御';
      if (
        hasSkillMechanism(skill, [
          '共享视野',
          '隐身',
          '目标锁定',
          '自身位移',
          '护卫',
          '追击',
          '追击位移',
          '脱离位移',
          '分身',
          '复制',
          '状态交换',
          '状态转移',
          '条件触发',
          '转化',
          '引爆持续伤害',
          '斩盾',
          '窃取护盾',
        ]) ||
        getSkillEffects(skill).some(effect => isBattleAttributeSupportEffect(effect))
      )
        return '辅助';
      if (hasSkillMechanism(skill, ['直接伤害', '多段伤害', '持续伤害', '延迟爆发', '斩杀补伤'])) return '输出';
      if (skillTargetsEnemySide(skill) && hasSkillMechanismSemantic(skill, '敌对')) return '控制';
      if (hasSkillAiRoleTag(skill, '团队保护型')) return '辅助';
      if (hasSkillAiRoleTag(skill, '保命型')) return '防御';
      if (hasSkillAiRoleTag(skill, '规则压制型')) return '控制';
      if (skillCanGrantFriendlyMechanism(skill)) return '辅助';
      return '无';
    }

    function inferMainTypeFromEffects(skill) {
      const hintedMainType = getSkillSummaryHint(skill, 'mainType', '');
      if (hintedMainType) return hintedMainType;
      if (hasSkillMechanism(skill, ['自身位移', '强制位移', '位移交换', '隐身', '追击', '追击位移', '脱离位移'])) return '位移类';
      if (hasSkillMechanism(skill, ['分身', '复制', '状态交换', '状态转移', '引爆持续伤害', '斩盾', '窃取护盾'])) return '特殊规则类';
      if (
        hasSkillMechanism(skill, [
          '感知干扰',
          '破隐',
          '硬控',
          '催眠',
          '幻境',
          '标记锁定',
          '目标锁定',
          '禁疗',
          '打断',
          '缴械',
          '认知扭曲',
          '沉默',
          '减速',
          '软控',
          '位移限制',
          '强制绑定/锁定',
          '嘲讽',
          '封技',
          '治疗反转',
        ]) ||
        getSkillEffects(skill).some(effect => isBattleDebuffAttributeEffect(effect))
      )
        return '控制类';
      if (hasSkillMechanism(skill, ['护盾', '减伤', '格挡', '霸体', '免死', '反制', '无敌金身', '伤害反射', '伤害分摊', '替身抵消', '复苏'])) return '防御类';
      if (getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect))) return '回复类';
      if (
        hasSkillMechanism(skill, ['共享视野', '驱散增益', '隐身', '护卫', '复苏']) ||
        getSkillEffects(skill).some(effect => isBattleAttributeSupportEffect(effect))
      )
        return '增益类';
      if (hasSkillMechanism(skill, ['直接伤害', '多段伤害', '持续伤害', '延迟爆发', '斩杀补伤'])) return '伤害类';
      if (skillTargetsEnemySide(skill) && hasSkillMechanismSemantic(skill, '敌对')) return '控制类';
      if (skillCanGrantFriendlyMechanism(skill)) return '增益类';
      return '无';
    }

    function deriveBattleSummaryFromEffects(skill, baseSummary = {}) {
      const defaultSummary = createEmptyBattleSummary();
      const summary = { ...defaultSummary, ...(baseSummary || {}) };
      const systemBase = getSystemBaseEffect(skill);
      const runtimeMeta = getSkillRuntimeMeta(skill);
      const damage = getPrimaryDamageEffect(skill);
      const state = getPrimaryStateEffect(skill);
      const stateCalc = state?.计算层效果 || {};
      const targetText = String(runtimeMeta.对象 || '');
      const power = Number(damage?.威力倍率 || 0);
      const duration = Number(state?.持续回合 || 0);
      const skillName = String(skill?.name || skill?.技能名称 || '');
      const costText = String(getSkillCostText(skill) || '无');
      const attributeSource = getBattleSkillAttributeSource(skill);
      const skillRole = getBattleSkillRole(skill);
      const elementMode = String(getBattleSkillElementStructure(skill)?.模式 || '').trim() || '无';
      const wuxingMode = String(getBattleSkillWuxingInvocation(skill)?.模式 || '').trim() || '无';
      const polarityMode = String(getBattleSkillPolaritySummary(skill)?.polarityMode || '无').trim() || '无';
      const structureMode = elementMode !== '无' ? elementMode : wuxingMode;

      if (!baseSummary?.属性建模 || baseSummary.属性建模 === defaultSummary.属性建模 || baseSummary.属性建模 === '无') {
        const modelSegments = [attributeSource, skillRole, structureMode].filter(value => value && value !== '无');
        summary.属性建模 = modelSegments.length ? modelSegments.join('/') : '无';
      }
      if (!baseSummary?.极性层级 || baseSummary.极性层级 === defaultSummary.极性层级 || baseSummary.极性层级 === '无') {
        summary.极性层级 = polarityMode && polarityMode !== '无' ? polarityMode : '无';
      }
      if (
        (!baseSummary?.风险等级 || baseSummary.风险等级 === defaultSummary.风险等级 || baseSummary.风险等级 === '中') &&
        (structureMode === '逆演归一' ||
          structureMode === '阴阳合璧' ||
          (structureMode === '元素硬控' && normalizeBattleSkillAttributeTokens(skill?.附带属性).length >= 3))
      )
        summary.风险等级 = '高';

      if (!baseSummary?.目标规模 || baseSummary.目标规模 === defaultSummary.目标规模) {
        if (targetText === '全场') summary.目标规模 = '全场';
        else if (targetText.includes('群体')) summary.目标规模 = '群体';
        else summary.目标规模 = '单体';
      }

      const hasFriendlyGrantable = skillCanGrantFriendlyMechanism(skill);
      const hintedDefenseNature = getSkillSummaryHint(skill, 'defenseNature', '');
      const hintedRecoverNature = getSkillSummaryHint(skill, 'recoverNature', '');
      const hintedControlStrength = getSkillSummaryHint(skill, 'controlStrength', '');
      const hintedCooperation = getSkillSummaryHint(skill, 'cooperation', '');
      const hintedEffectMode = getSkillSummaryHint(skill, 'effectMode', '');

      if (!summary.防御性质 || summary.防御性质 === '无') {
        if (hintedDefenseNature) summary.防御性质 = hintedDefenseNature;
        else if (hasSkillMechanism(skill, ['反制'])) summary.防御性质 = '反制';
        else if (hasSkillMechanism(skill, ['免死'])) summary.防御性质 = '免死';
        else if (hasSkillMechanism(skill, ['无敌金身'])) summary.防御性质 = '无敌';
        else if (hasSkillMechanism(skill, ['复苏'])) summary.防御性质 = '复苏';
        else if (hasSkillMechanism(skill, ['替身抵消'])) summary.防御性质 = '替身';
        else if (hasSkillMechanism(skill, ['伤害分摊'])) summary.防御性质 = '分摊';
        else if (hasSkillMechanism(skill, ['伤害反射'])) summary.防御性质 = '反射';
        else if (hasSkillMechanism(skill, ['霸体'])) summary.防御性质 = '霸体';
        else if (hasSkillMechanism(skill, ['分身'])) summary.防御性质 = '分身';
        else if (hasSkillMechanism(skill, ['格挡'])) summary.防御性质 = '格挡';
        else if (hasSkillMechanism(skill, ['减伤'])) summary.防御性质 = '减伤';
        else if (hasSkillMechanism(skill, ['护盾'])) summary.防御性质 = '护盾';
      }
      if (!summary.回复性质 || summary.回复性质 === '无') {
        if (hintedRecoverNature) summary.回复性质 = hintedRecoverNature;
        else if (getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect, ['vit'])))
          summary.回复性质 = '体力恢复';
        else if (getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect, ['sp', 'men'])))
          summary.回复性质 = '资源回复';
        else if (hasSkillMechanism(skill, ['复苏'])) summary.回复性质 = '复苏';
      }
      if (!summary.控制强度 || summary.控制强度 === '无') {
        if (hintedControlStrength) summary.控制强度 = hintedControlStrength;
        else if (hasSkillMechanism(skill, ['硬控', '催眠']) || stateCalc.skip_turn === true) summary.控制强度 = '硬控';
        else if (
          hasSkillMechanism(skill, [
            '感知干扰',
            '破隐',
            '幻境',
            '标记锁定',
            '目标锁定',
            '认知扭曲',
            '沉默',
            '禁疗',
            '缴械',
            '嘲讽',
            '减速',
            '打断',
            '软控',
            '位移限制',
            '强制位移',
            '位移交换',
            '强制绑定/锁定',
          ]) ||
          getSkillEffects(skill).some(effect => isBattleDebuffAttributeEffect(effect)) ||
          Number(stateCalc.lock_level || 0) > 0 ||
          Number(stateCalc.reaction_penalty || 0) > 0 ||
          Number(stateCalc.cast_speed_penalty || 0) > 0 ||
          Number(stateCalc.dodge_penalty || 0) > 0 ||
          Number(stateCalc.resource_block_ratio || 0) > 0
        )
          summary.控制强度 = '软控';
      }
      if (!baseSummary?.协同性 || baseSummary.协同性 === defaultSummary.协同性 || baseSummary.协同性 === '无') {
        if (hintedCooperation) summary.协同性 = hintedCooperation;
        else if (
          targetText === '全场' ||
          targetText.includes('群体') ||
          hasSkillMechanism(skill, ['共享视野', '目标锁定', '召唤与场地', '驱散增益']) ||
          (hasFriendlyGrantable && summary.目标规模 !== '单体')
        )
          summary.协同性 = '高';
        else if (
          targetText.includes('己方') ||
          targetText.includes('友方') ||
          hasFriendlyGrantable ||
          getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect)) ||
          hasSkillMechanism(skill, ['分身', '隐身', '护卫'])
        )
          summary.协同性 = '中';
        else summary.协同性 = '低';
      }
      if (!baseSummary?.生效方式 || baseSummary.生效方式 === defaultSummary.生效方式 || baseSummary.生效方式 === '无') {
        if (hintedEffectMode) summary.生效方式 = hintedEffectMode;
        else if (hasSkillMechanism(skill, ['受击反击', '格挡', '反制', '条件触发'])) summary.生效方式 = '触发';
        else if (hasSkillMechanism(skill, ['延迟爆发'])) summary.生效方式 = '延迟';
        else if (
          duration > 1 ||
          hasSkillMechanism(skill, ['持续伤害', '护盾', '减伤', '霸体', '免死', '共享视野', '目标锁定', '召唤与场地', '分身', '感知干扰', '认知扭曲', '缴械', '追击', '隐身', '护卫', '嘲讽'])
        )
          summary.生效方式 = '持续';
        else summary.生效方式 = '瞬发';
      }
      if (!baseSummary?.爆发级别 || baseSummary.爆发级别 === defaultSummary.爆发级别 || baseSummary.爆发级别 === '无') {
        if (power >= 300) summary.爆发级别 = '高';
        else if (power >= 160) summary.爆发级别 = '中';
        else if (power > 0) summary.爆发级别 = '低';
        else summary.爆发级别 = '无';
      }
      if (!baseSummary?.持续性 || baseSummary.持续性 === defaultSummary.持续性 || baseSummary.持续性 === '无') {
        if (duration >= 3) summary.持续性 = '长';
        else if (duration >= 2) summary.持续性 = '中';
        else if (duration > 0) summary.持续性 = '短';
        else if (hasSkillMechanism(skill, ['召唤与场地', '共享视野', '目标锁定', '护盾', '减伤', '格挡', '霸体', '免死', '分身', '感知干扰', '认知扭曲', '缴械', '追击', '隐身', '护卫', '嘲讽']))
          summary.持续性 = '中';
        else summary.持续性 = '无';
      }
      if (!baseSummary?.保留倾向 || Number(baseSummary.保留倾向 || 0) === Number(defaultSummary.保留倾向 || 0)) {
        let reserve = 0;
        if (/真身|武魂融合技|生命之火|第八魂技|第九魂技/.test(skillName)) reserve += 35;
        if (power >= 280) reserve += 20;
        if (Number(runtimeMeta.cast_time || 0) >= 25) reserve += 15;
        if (hasSkillMechanism(skill, ['免死', '格挡', '受击反击', '反制', '条件触发', '效果反转', '高波动随机值']))
          reserve += 10;
        if (/维持|启动\)/.test(costText)) reserve += 10;
        summary.保留倾向 = Math.min(90, reserve);
      }
      return summary;
    }

    function buildConditionTacticalSnapshot(entity) {
      const entries = Object.entries(entity?.状态效果 || {});
      const buffEntries = entries.filter(([, cond]) => cond?.类型 === 'buff');
      const debuffEntries = entries.filter(([, cond]) => cond?.类型 === 'debuff');
      const hasShielded = entries.some(
        ([name, cond]) => /护盾|屏障|结界/.test(name) || Number(cond?.战斗效果?.shield_gain_mult || 1) > 1.05,
      );
      const hasDefenseBuffed = entries.some(
        ([name, cond]) => Number(cond?.面板修改比例?.def || 1) > 1.12 || /护体|罡气|霸体|真身|格挡|减伤/.test(name),
      );
      const isLockedOrControlled = entries.some(([name, cond]) => {
        const ce = cond?.战斗效果 || {};
        return (
          ce.skip_turn === true ||
          ce.cannot_react === true ||
          Number(ce.lock_level || 0) > 0 ||
          Number(ce.reaction_penalty || 0) > 0 ||
          Number(ce.cast_speed_penalty || 0) > 0 ||
          Number(ce.dodge_penalty || 0) > 0 ||
          Number(ce.resource_block_ratio || 0) > 0 ||
          /锁定|禁锢|眩晕|催眠|幻境|束缚|减速|迟缓|软控|位移限制|强制位移|位移交换/.test(name)
        );
      });
      const hasHealingTrend = entries.some(
        ([name, cond]) =>
          Number(cond?.战斗效果?.final_heal_mult || 1) > 1.0 ||
          Number(cond?.战斗效果?.final_heal_bonus || 0) > 0 ||
          Number(cond?.战斗效果?.sp_gain_ratio || 0) > 0 ||
          Number(cond?.战斗效果?.men_gain_ratio || 0) > 0 ||
          /回血|治疗|再生|回复|回魂|回精神/.test(name),
      );
      const hasDotPressure = entries.some(
        ([name, cond]) =>
          Number(cond?.战斗效果?.dot_damage || 0) > 0 || /流血|灼烧|腐蚀|中毒|撕裂|持续伤害/.test(name),
      );
      const hasBadCondition = entries.some(
        ([name, cond]) => cond?.类型 === 'debuff' && !/霸体|真身|增益|护盾/.test(name),
      );
      const hasSharedVision = entries.some(([name]) => /共享视野/.test(name));
      const hasTargetLock = entries.some(
        ([name, cond]) => /目标锁定|标记锁定/.test(name) || Number(cond?.战斗效果?.lock_level || 0) > 0,
      );
      const hasStealthed = entries.some(
        ([name, cond]) =>
          Number(cond?.战斗效果?.stealth_level || 0) > 0 || /隐身|潜行/.test(String(name || '')),
      );
      const hasReactiveDefense = entries.some(
        ([name, cond]) =>
          cond?.战斗效果?.invincible === true ||
          cond?.战斗效果?.super_armor === true ||
          Number(cond?.战斗效果?.block_count || 0) > 0 ||
          Number(cond?.战斗效果?.death_save_count || 0) > 0 ||
          Number(cond?.战斗效果?.revive_count || 0) > 0 ||
          Number(cond?.战斗效果?.substitute_count || 0) > 0 ||
          Number(cond?.战斗效果?.counter_attack_ratio || 0) > 0 ||
          Number(cond?.战斗效果?.damage_reflect_ratio || 0) > 0 ||
          Number(cond?.战斗效果?.damage_share_ratio || 0) > 0 ||
          Number(cond?.战斗效果?.damage_reduction || 0) > 0 ||
          /护盾|格挡|霸体|免死|反击|反制|无敌|复苏|替身|分摊|反射/.test(name),
      );
      const hasAntiHeal = entries.some(
        ([name, cond]) =>
          Number(cond?.战斗效果?.heal_block_ratio || 0) > 0 ||
          Number(cond?.战斗效果?.heal_inversion_ratio || 0) > 0 ||
          /禁疗|治疗反转/.test(name),
      );
      return {
        entries,
        buffCount: buffEntries.length,
        debuffCount: debuffEntries.length,
        hasShielded,
        hasDefenseBuffed,
        isLockedOrControlled,
        hasHealingTrend,
        hasDotPressure,
        hasBadCondition,
        hasSharedVision,
        hasTargetLock,
        hasStealthed,
        hasReactiveDefense,
        hasAntiHeal,
      };
    }

    function getStealthConditionEntries(targetChar) {
      if (!targetChar?.状态效果) return [];
      return Object.entries(targetChar.状态效果).filter(
        ([key, cond]) =>
          cond?.类型 === 'buff' &&
          !String(key || '').startsWith(AUTO_PROJECTED_CONDITION_PREFIX) &&
          (Number(cond?.战斗效果?.stealth_level || 0) > 0 || /隐身|潜行/.test(String(key || ''))),
      );
    }

    function removeStealthConditions(targetChar, maxCount = 99) {
      if (!targetChar?.状态效果) return [];
      const removed = [];
      getStealthConditionEntries(targetChar)
        .slice(0, Math.max(1, Number(maxCount || 99)))
        .forEach(([key]) => {
          delete targetChar.状态效果[key];
          removed.push(key);
          if (targetChar.持续效果) {
            Object.keys(targetChar.持续效果).forEach(sustainKey => {
              if (targetChar.持续效果[sustainKey]?.related_condition === key)
                delete targetChar.持续效果[sustainKey];
            });
          }
        });
      return removed;
    }

    function getForcedTauntTargetName(actorChar) {
      if (!actorChar?.状态效果) return '';
      const tauntEntry = Object.values(actorChar.状态效果).find(cond =>
        cond &&
        typeof cond === 'object' &&
        String(cond?.类型 || '') === 'debuff' &&
        String(cond?.强制目标名 || '').trim(),
      );
      return String(tauntEntry?.强制目标名 || '').trim();
    }

    function canBypassStealth(attackerChar, skill = null) {
      const attackerSnapshot = buildConditionTacticalSnapshot(attackerChar);
      return (
        attackerSnapshot.hasSharedVision ||
        attackerSnapshot.hasTargetLock ||
        hasSkillMechanism(skill, ['共享视野', '标记锁定', '目标锁定', '破隐'])
      );
    }

    function resolveGuardRedirectTarget(initialTarget, allyTeam = []) {
      if (!initialTarget?.状态效果) return null;
      const guardEntry = Object.values(initialTarget.状态效果).find(cond =>
        cond &&
        typeof cond === 'object' &&
        String(cond?.类型 || '') === 'buff' &&
        String(cond?.护卫者名 || '').trim(),
      );
      const guarderName = String(guardEntry?.护卫者名 || '').trim();
      if (!guarderName) return null;
      return (allyTeam || []).find(
        unit =>
          unit &&
          unit.name !== initialTarget.name &&
          isCombatUnitAbleToFight(unit) &&
          isCombatUnitIdentityMatch(unit, guarderName),
      ) || null;
    }

    function bindCombatMirrorField(target, source, key, options = {}) {
      if (!target || !source) return;
      if (options.preferSource && source[key] !== undefined) target[key] = source[key];
      else if (target[key] !== undefined) source[key] = target[key];
      else if (source[key] !== undefined) target[key] = source[key];

      try {
        Object.defineProperty(target, key, {
          configurable: true,
          enumerable: true,
          get() {
            return source[key];
          },
          set(value) {
            source[key] = value;
          },
        });
      } catch (e) {
        target[key] = source[key];
      }
    }

    function bindCombatAliasField(target, source, aliasKey, sourceKey, fallbackValue = 0) {
      if (!target || !source || !aliasKey || !sourceKey) return;
      if (source[sourceKey] === undefined) source[sourceKey] = fallbackValue;
      try {
        Object.defineProperty(target, aliasKey, {
          configurable: true,
          enumerable: true,
          get() {
            return source[sourceKey];
          },
          set(value) {
            source[sourceKey] = value;
          },
        });
      } catch (error) {
        target[aliasKey] = source[sourceKey];
      }
    }

    function normalizeCombatHpFields(source) {
      if (!source || typeof source !== 'object') return;
      source.HP上限 = Math.max(1, Number.isFinite(Number(source.HP上限)) ? Number(source.HP上限) : Math.max(1, Number(source.体力上限 || 1)));
      source.HP = Math.max(
        0,
        Math.min(
          source.HP上限,
          Number.isFinite(Number(source.HP)) ? Number(source.HP) : Math.max(0, Number(source.体力 || source.HP上限 || 0)),
        ),
      );
      source.体力上限 = Math.max(1, Number.isFinite(Number(source.体力上限)) ? Number(source.体力上限) : 1);
      source.体力 = Math.max(0, Math.min(source.体力上限, Number.isFinite(Number(source.体力)) ? Number(source.体力) : source.体力上限));
    }

    function getHpDrivenStaminaFactor(nextHp = 0, hpMax = 1) {
      const ratio = Math.max(0, Number(nextHp || 0)) / Math.max(1, Number(hpMax || 1));
      if (ratio <= 0.2) return 2;
      if (ratio <= 0.5) return 1;
      return 0.5;
    }

    function applyStaminaLinkFromHpChange(source, previousHp, nextHp) {
      if (!source || typeof source !== 'object') return;
      const delta = Number(nextHp || 0) - Number(previousHp || 0);
      if (!delta) return;
      const factor = getHpDrivenStaminaFactor(nextHp, source.HP上限);
      const nextStamina = Number(source.体力 || 0) + delta * factor;
      source.体力 = Math.max(0, Math.min(Number(source.体力上限 || 1), nextStamina));
    }

    function bindCombatHpAliasField(target, source) {
      if (!target || !source) return;
      normalizeCombatHpFields(source);
      try {
        Object.defineProperty(target, 'vit', {
          configurable: true,
          enumerable: true,
          get() {
            return source.HP;
          },
          set(value) {
            const previousHp = Number(source.HP || 0);
            const nextHp = Math.max(0, Math.min(Number(source.HP上限 || 1), Number(value || 0)));
            source.HP = nextHp;
            applyStaminaLinkFromHpChange(source, previousHp, nextHp);
          },
        });
        Object.defineProperty(target, 'vit_max', {
          configurable: true,
          enumerable: true,
          get() {
            return source.HP上限;
          },
          set(value) {
            source.HP上限 = Math.max(1, Number(value || 1));
            source.HP = Math.max(0, Math.min(source.HP上限, Number(source.HP || 0)));
          },
        });
      } catch (error) {
        target.vit = source.HP;
        target.vit_max = source.HP上限;
      }
    }

    function bindCombatRuntimeAliases(target, source) {
      if (!target || !source) return;
      bindCombatAliasField(target, source, 'str', '力量', 0);
      bindCombatAliasField(target, source, 'def', '防御', 0);
      bindCombatAliasField(target, source, 'agi', '敏捷', 0);
      bindCombatAliasField(target, source, 'sp', '魂力', 0);
      bindCombatAliasField(target, source, 'sp_max', '魂力上限', 1);
      bindCombatAliasField(target, source, 'men', '精神力', 0);
      bindCombatAliasField(target, source, 'men_max', '精神力上限', 1);
      bindCombatAliasField(target, source, 'sta', '体力', 0);
      bindCombatAliasField(target, source, 'sta_max', '体力上限', 1);
      bindCombatHpAliasField(target, source);
    }

    function expandCombatParticipantFromMvu(participant) {
      if (!participant || typeof participant !== 'object' || Array.isArray(participant)) return participant;
      if (isTemporaryCombatParticipant(participant)) return participant;
      if (participant.属性 && typeof participant.属性 === 'object' && participant.状态 && typeof participant.状态 === 'object') {
        return participant;
      }

      const participantName = String(participant.name || '').trim();
      if (!participantName) return participant;
      const currentCharData = getMvuValue(`char.${participantName}`, undefined);
      if (!currentCharData || typeof currentCharData !== 'object') return participant;

      const expanded = deepClonePlain(currentCharData);
      expanded.name = participantName;

      if (!expanded.属性 || typeof expanded.属性 !== 'object') expanded.属性 = {};
      if (!expanded.状态 || typeof expanded.状态 !== 'object') expanded.状态 = {};

      COMBAT_STAT_KEYS.forEach(key => {
        if (participant[key] !== undefined) expanded.属性[key] = deepClonePlain(participant[key]);
      });
      COMBAT_STATUS_KEYS.forEach(key => {
        if (participant[key] !== undefined) expanded.状态[key] = deepClonePlain(participant[key]);
      });

      if (participant.属性 && typeof participant.属性 === 'object') {
        expanded.属性 = { ...expanded.属性, ...deepClonePlain(participant.属性) };
      }
      if (participant.状态 && typeof participant.状态 === 'object') {
        expanded.状态 = { ...expanded.状态, ...deepClonePlain(participant.状态) };
      }
      if (participant.状态效果 && typeof participant.状态效果 === 'object' && !Array.isArray(participant.状态效果)) {
        expanded.状态效果 = deepClonePlain(participant.状态效果);
      }
      if (participant.持续效果 && typeof participant.持续效果 === 'object' && !Array.isArray(participant.持续效果)) {
        expanded.持续效果 = deepClonePlain(participant.持续效果);
      }
      if (participant.蓄力技能 !== undefined) expanded.蓄力技能 = deepClonePlain(participant.蓄力技能);
      if (participant.决策记忆 !== undefined) expanded.决策记忆 = deepClonePlain(participant.决策记忆);
      if (participant.当前领域 !== undefined) expanded.状态.当前领域 = deepClonePlain(participant.当前领域);
      if (participant.存活 !== undefined) expanded.状态.存活 = participant.存活 !== false;
      if (participant.势力 !== undefined) expanded.势力 = deepClonePlain(participant.势力);

      delete expanded.__combatMirrorBound;
      return expanded;
    }

    function bindCombatParticipant(char) {
      if (!char || char.__combatMirrorBound) return char;

      if (char.属性) {
        COMBAT_STAT_KEYS.forEach(key => bindCombatMirrorField(char, char.属性, key, { preferSource: true }));
        bindCombatRuntimeAliases(char, char.属性);
        bindCombatRuntimeAliases(char.属性, char.属性);
      }

      if (char.状态) {
        COMBAT_STATUS_KEYS.forEach(key => bindCombatMirrorField(char, char.状态, key));
      }

      if (!char.状态效果) {
        if (char.属性?.状态效果) char.状态效果 = char.属性.状态效果;
        else char.状态效果 = {};
      }
      char.状态效果 = normalizeCombatConditionMapForRuntime(char.状态效果);
      if (char.属性 && typeof char.属性 === 'object') char.属性.状态效果 = char.状态效果;

      if (!char.系别 && char.属性?.系别) char.系别 = char.属性.系别;
      if (!char.当前领域 && char.状态?.当前领域) char.当前领域 = char.状态.当前领域;
      if (char.存活 === undefined && char.状态?.存活 !== undefined) char.存活 = char.状态.存活;

      char.__combatMirrorBound = true;
      return char;
    }

    function hydrateCombatData(combatData) {
      if (!combatData || !combatData.参战者) return combatData;
      combatData.参战者.player = expandCombatParticipantFromMvu(combatData.参战者.player);
      combatData.参战者.enemy = expandCombatParticipantFromMvu(combatData.参战者.enemy);
      combatData.参战者.team_player = Array.isArray(combatData.参战者.team_player)
        ? combatData.参战者.team_player.map(expandCombatParticipantFromMvu)
        : [];
      combatData.参战者.team_enemy = Array.isArray(combatData.参战者.team_enemy)
        ? combatData.参战者.team_enemy.map(expandCombatParticipantFromMvu)
        : [];
      const playerRoster = [combatData.参战者.player, ...(combatData.参战者.team_player || [])].filter(
        Boolean,
      );
      const enemyRoster = [combatData.参战者.enemy, ...(combatData.参战者.team_enemy || [])].filter(
        Boolean,
      );

      const processRoster = (roster, opposingRoster) => {
        const seen = new Set();
        roster.forEach(member => {
          if (!member || seen.has(member)) return;
          seen.add(member);
          refreshParticipantProjectedState(
            member,
            roster.filter(unit => unit && unit !== member),
            opposingRoster.filter(Boolean),
          );
        });
      };

      processRoster(playerRoster, enemyRoster);
      processRoster(enemyRoster, playerRoster);

      if (combatData.参战者.player)
        combatData.参战者.player.final = buildCombatFinalStats(combatData.参战者.player);
      if (combatData.参战者.enemy)
        combatData.参战者.enemy.final = buildCombatFinalStats(combatData.参战者.enemy);
      (combatData.参战者.team_player || []).forEach(member => {
        if (member) member.final = buildCombatFinalStats(member);
      });
      (combatData.参战者.team_enemy || []).forEach(member => {
        if (member) member.final = buildCombatFinalStats(member);
      });
      return combatData;
    }

    function normalizeSkillData(skill, fallbackName = '未知技能') {
      const normalized = deepClone(skill || {});
      normalized.name = normalized.name || normalized.技能名称 || fallbackName;
      normalized.魂技名 = normalized.魂技名 || normalized.name || normalized.技能名称 || fallbackName;
      normalized.战斗摘要 = { ...createEmptyBattleSummary(), ...(normalized.战斗摘要 || {}) };
      normalized.主定位 = normalized.主定位 || normalized.战斗语义?.主定位 || normalized.技能类型 || '无';
      normalized.标签 = Array.isArray(normalized.标签) ? normalized.标签 : [];
      normalized.战斗语义 = { ...createEmptySkillSemantics(), ...(normalized.战斗语义 || {}) };
      const explicitSemanticTarget = skill?.战斗语义?.作用目标;
      const explicitPrimaryRole = skill?.主定位 || skill?.战斗语义?.主定位;
      const explicitSkillType = skill?.技能类型;
      normalized.对象 =
        normalized.对象 && normalized.对象 !== '无'
          ? normalized.对象
          : explicitSemanticTarget
            ? mapSemanticTargetToCombatTarget(explicitSemanticTarget)
            : '无';
      normalized.技能类型 =
        normalized.技能类型 && normalized.技能类型 !== '无'
          ? normalized.技能类型
          : explicitSkillType && explicitSkillType !== '无'
            ? explicitSkillType
            : explicitPrimaryRole && explicitPrimaryRole !== '无'
              ? mapPrimaryRoleToSkillType(normalized.主定位)
              : '无';
      normalized.cast_time = Number(normalized.cast_time ?? 0) || 0;
      normalized.消耗 =
        typeof normalized.消耗 === 'object' ? formatCostObjectToString(normalized.消耗) : normalized.消耗 || '无';
      normalized.附带属性 = normalizeBattleSkillAttributeTokens(normalized.附带属性);
      normalized._效果数组 = Array.isArray(normalized._效果数组) ? normalized._效果数组 : [];
      normalized.element = getBattleSkillDisplayElement(normalized);

      const existingSystemBase = getSystemBaseEffect(normalized);
      if (existingSystemBase && typeof existingSystemBase === 'object') {
        const runtimeTargetModel = normalizeBattleSkillTargetModel(
          existingSystemBase.目标模型 || existingSystemBase.对象 || normalized.对象 || explicitSemanticTarget || '敌方单体',
          '敌方单体',
        );
        existingSystemBase.目标模型 = runtimeTargetModel;
        existingSystemBase.目标修饰 = normalizeBattleSkillTargetModifiers(
          Array.isArray(existingSystemBase.目标修饰) && existingSystemBase.目标修饰.length
            ? existingSystemBase.目标修饰
            : deriveBattleSkillTargetModifiers(normalized, runtimeTargetModel),
        );
        existingSystemBase.结算策略 = String(
          existingSystemBase.结算策略 || deriveBattleTargetResolutionStrategy(runtimeTargetModel),
        ).trim() || '单目标独立';
        existingSystemBase.对象 = mapBattleTargetModelToCombatTarget(runtimeTargetModel);
      }

      const runtimeMeta = getSkillRuntimeMeta(normalized);
      if (!normalized.消耗 || normalized.消耗 === '无') {
        normalized.消耗 = runtimeMeta.消耗 || '无';
      }
      if (!normalized.对象 || normalized.对象 === '无') {
        normalized.对象 = runtimeMeta.对象 || '敌方/单体';
      }
      if (!normalized.技能类型 || normalized.技能类型 === '无') {
        normalized.技能类型 = runtimeMeta.技能类型 || '无';
      }
      if (!(normalized.cast_time > 0)) {
        normalized.cast_time = Number(runtimeMeta.cast_time ?? 0) || 0;
      }

      const hasSystemBaseEffect = normalized._效果数组.some(effect => effect?.机制 === '系统基础');
      if (!hasSystemBaseEffect) {
        normalized._效果数组.unshift({
          机制: '系统基础',
          消耗: '无',
          目标模型: normalizeBattleSkillTargetModel(normalized.对象 || explicitSemanticTarget || '敌方单体', '敌方单体'),
          目标修饰: deriveBattleSkillTargetModifiers(normalized, normalizeBattleSkillTargetModel(normalized.对象 || explicitSemanticTarget || '敌方单体', '敌方单体')),
          结算策略: deriveBattleTargetResolutionStrategy(normalizeBattleSkillTargetModel(normalized.对象 || explicitSemanticTarget || '敌方单体', '敌方单体')),
          对象: normalized.对象,
          技能类型: normalized.技能类型,
          cast_time: normalized.cast_time,
        });
      }

      applyAttributeCoeffToCombatSkill(normalized);

      return normalized;
    }

    const FUSION_SELF_SPIRIT_SLOTS = ['第一武魂', '第二武魂'];

    function getFusionSkillMode(fusionSkill = {}) {
      return fusionSkill?.融合模式 === 'self' ? 'self' : 'partner';
    }

    function splitFusionPartnerText(rawValue = '') {
      return String(rawValue || '')
        .split(/[、,，+\/|｜；;]/)
        .map(item => String(item || '').trim())
        .filter(Boolean);
    }

    function normalizeFusionSkillParticipants(fusionSkill = {}) {
      const rawParticipants = Array.isArray(fusionSkill?.融合参与者) ? fusionSkill.融合参与者 : [];
      if (rawParticipants.length) {
        return rawParticipants
          .map(participant => {
            const raw = participant && typeof participant === 'object' ? participant : {};
            const roleText = String(raw.role || raw.类型 || raw.身份 || '').trim();
            const role = roleText === 'self' || /自身|自体|本体|自己/.test(roleText) ? 'self' : 'partner';
            const charName = String(
              raw.charName || raw.char_name || raw.name || raw.角色 || raw.角色名 || raw.charKey || raw.char_key || raw.key || '',
            ).trim();
            const charKey = String(raw.charKey || raw.char_key || raw.key || raw.角色键 || '').trim();
            const spirit = String(raw.spirit || raw.spiritName || raw.spirit_name || raw.武魂 || raw.来源武魂 || '').trim();
            return { role, charName, charKey, spirit };
          })
          .filter(participant => participant.charName || participant.charKey || participant.spirit);
      }
      const mode = getFusionSkillMode(fusionSkill);
      if (mode === 'self') {
        return getFusionSkillSourceSpirits(fusionSkill).map(slot => ({ role: 'self', charName: '', charKey: '', spirit: slot }));
      }
      return splitFusionPartnerText(fusionSkill?.融合对象 || '').map(name => ({
        role: 'partner',
        charName: name,
        charKey: '',
        spirit: '',
      }));
    }

    function getFusionSkillPartnerNames(fusionSkill = {}) {
      const names = normalizeFusionSkillParticipants(fusionSkill)
        .filter(participant => participant.role !== 'self')
        .map(participant => participant.charName || participant.charKey)
        .filter(Boolean);
      return Array.from(new Set(names));
    }

    function getFusionSkillPartnerName(fusionSkill = {}) {
      const names = getFusionSkillPartnerNames(fusionSkill);
      return names.length ? names.join('、') : String(fusionSkill?.融合对象 || '').trim();
    }

    function buildFusionBattleProfile(mode = 'partner', partnerCount = 1) {
      const safeMode = mode === 'self' ? 'self' : 'partner';
      const safePartnerCount = Math.max(1, Math.floor(Number(partnerCount || 1)));
      const multiPartnerBonus = Math.min(0.12, Math.max(0, safePartnerCount - 1) * 0.05);
      if (safeMode === 'self') {
        return {
          mode: safeMode,
          partnerCount: 0,
          actorCostScale: 1.35,
          partnerPoolScale: 0,
          castTimeScale: 1.08,
          damageMult: 1.5,
          recoverMult: 1.38,
          shieldMult: 1.38,
          stateScale: 1.3,
          controlScale: 1.35,
          aftermathDuration: 2,
          aftermathPanelScale: 0.78,
          aftermathDamageMult: 0.76,
          aftermathHealMult: 0.78,
          aftermathShieldMult: 0.78,
          aftermathCastPenalty: 0.42,
          aftermathDodgePenalty: 0.15,
          aftermathReactionPenalty: 0.15,
          aftermathResourceBlock: 0.28,
        };
      }
      return {
        mode: safeMode,
        partnerCount: safePartnerCount,
        actorCostScale: 1.1,
        partnerPoolScale: 0.6,
        castTimeScale: 1.15,
        damageMult: 1.65 + multiPartnerBonus,
        recoverMult: 1.5 + multiPartnerBonus * 0.6,
        shieldMult: 1.5 + multiPartnerBonus * 0.6,
        stateScale: 1.42 + multiPartnerBonus * 0.5,
        controlScale: 1.5 + multiPartnerBonus * 0.6,
        aftermathDuration: 2,
        aftermathPanelScale: 0.82,
        aftermathDamageMult: 0.82,
        aftermathHealMult: 0.82,
        aftermathShieldMult: 0.82,
        aftermathCastPenalty: 0.35,
        aftermathDodgePenalty: 0.12,
        aftermathReactionPenalty: 0.12,
        aftermathResourceBlock: 0.22,
      };
    }

    function getFusionBattleProfileFromSkill(skill = {}) {
      return skill?.__fusion_profile && typeof skill.__fusion_profile === 'object' ? skill.__fusion_profile : null;
    }

    function buildFusionCombatSkill(fusionSkill = {}, fusionName = '武魂融合技') {
      const skill = normalizeSkillData(fusionSkill?.技能数据, `武魂融合技·${fusionName}`);
      const mode = getFusionSkillMode(fusionSkill);
      const partnerNames = getFusionSkillPartnerNames(fusionSkill);
      const profile = buildFusionBattleProfile(mode, partnerNames.length || 1);
      const effects = Array.isArray(skill._效果数组) ? skill._效果数组 : [];
      const systemBase = effects.find(effect => effect?.机制 === '系统基础');
      const baseCostText = String(systemBase?.消耗 || skill.消耗 || '无').trim() || '无';
      const actorCostText = scaleSkillCostText(baseCostText, profile.actorCostScale);
      const partnerCostRatio =
        mode === 'partner' && partnerNames.length > 0
          ? Number(profile.partnerPoolScale || 0) / Math.max(1, partnerNames.length)
          : 0;
      const partnerCostText = partnerCostRatio > 0 ? scaleSkillCostText(actorCostText, partnerCostRatio) : '无';
      const baseCastTime = Number(systemBase?.cast_time ?? skill.cast_time ?? 0) || 0;
      const nextCastTime = Math.max(baseCastTime > 0 ? 1 : 0, Math.round(baseCastTime * Number(profile.castTimeScale || 1)));

      if (systemBase) {
        systemBase.消耗 = actorCostText;
        systemBase.cast_time = nextCastTime;
      }
      skill.消耗 = actorCostText;
      skill.cast_time = nextCastTime;
      skill.source_tag = '武魂融合技';
      skill.__融合模式 = mode;
      skill.__融合对象 = partnerNames.length ? partnerNames.join('、') : '无';
      skill.__fusion_profile = { ...profile, partnerNames: [...partnerNames] };
      skill.__fusion_partner_names = [...partnerNames];
      skill.__fusion_partner_cost_text = partnerCostText;
      skill.__fusion_display_cost_text =
        partnerCostText !== '无' && partnerNames.length
          ? `${actorCostText} | 共耗(${partnerNames.join('、')}): ${partnerCostText}`
          : actorCostText;
      skill.标签 = Array.isArray(skill.标签) ? skill.标签 : [];
      if (!skill.标签.includes('武魂融合技')) skill.标签.push('武魂融合技');
      if (!skill.标签.includes(mode === 'self' ? '自体融合' : '搭档融合')) skill.标签.push(mode === 'self' ? '自体融合' : '搭档融合');
      return skill;
    }

    function getFusionSkillDisplayCostText(skill = {}) {
      const displayText = String(skill?.__fusion_display_cost_text || '').trim();
      if (displayText) return displayText;
      return getSkillCostText(skill);
    }

    function getFusionSkillSourceSpirits(fusionSkill = {}) {
      const rawSlots = Array.isArray(fusionSkill?.来源武魂) ? fusionSkill.来源武魂 : [];
      const slots = rawSlots
        .map(slot => String(slot || '').trim())
        .filter(slot => FUSION_SELF_SPIRIT_SLOTS.includes(slot));
      if (slots.length) return Array.from(new Set(slots));
      return getFusionSkillMode(fusionSkill) === 'self' ? [...FUSION_SELF_SPIRIT_SLOTS] : ['第一武魂'];
    }

    function hasUsableSpiritSlot(charData, slot) {
      return !!(charData?.武魂 && charData.武魂[slot]);
    }

    function isFusionSkillAvailable(charData, fusionSkill, alliedTeam = []) {
      if (!fusionSkill?.技能数据 || fusionSkill?.技能数据?.状态 === '未生成') return false;
      if (getFusionSkillMode(fusionSkill) === 'self') {
        const slots = getFusionSkillSourceSpirits(fusionSkill);
        return slots.length >= 2 && slots.every(slot => hasUsableSpiritSlot(charData, slot));
      }
      const partnerNames = getFusionSkillPartnerNames(fusionSkill);
      if (!partnerNames.length) return false;
      return partnerNames.every(partnerName =>
        (alliedTeam || []).some(unit => isCombatUnitIdentityMatch(unit, partnerName) && isCombatUnitAbleToFight(unit)),
      );
    }

    function buildFusionCastNarration(fusionSkill, actorName = '施术者') {
      if (getFusionSkillMode(fusionSkill) === 'self') {
        const slots = getFusionSkillSourceSpirits(fusionSkill);
        return `${actorName}将${slots.join('与')}同频共振，自体交融，悍然施展了武魂融合技！`;
      }
      return `${actorName}与${getFusionSkillPartnerName(fusionSkill) || '同伴'}气息交融，果断施展了武魂融合技！`;
    }

    function parseResourceCostValue(costStr, label, currentValue, maxValue) {
      const text = String(costStr || '');
      const currentMatch = text.match(new RegExp(`${label}:(?:当前(?:剩余)?|剩余)(\\d+)%`));
      if (currentMatch)
        return Math.floor((Math.max(0, Number(currentValue || 0)) * parseInt(currentMatch[1], 10)) / 100);
      const baseMatch = text.match(new RegExp(`${label}:(\\d+)(%?)`));
      if (!baseMatch) return 0;
      return baseMatch[2]
        ? Math.floor((Math.max(0, Number(maxValue || 0)) * parseInt(baseMatch[1], 10)) / 100)
        : parseInt(baseMatch[1], 10);
    }

    function parseSkillCostForChar(skill, char) {
      const stats = char?.属性 || char || {};
      const costStr = normalizeSkillData(skill).消耗 || getSkillCostText(skill);
      const presetCostScale = Number(skill?.__battleSupportCostScale);
      const costScale =
        Number.isFinite(presetCostScale) && presetCostScale > 0
          ? presetCostScale
          : skill && char && skill.__targetForSupportCost && isSupportLikeSkill(skill)
            ? getSupportCostScale(char, skill.__targetForSupportCost)
            : 1;
      const rawReqSp = parseResourceCostValue(
        costStr,
        '魂力',
        stats.sp ?? stats.魂力,
        stats.sp_max ?? stats.魂力上限,
      );
      const rawReqVit = parseResourceCostValue(
        costStr,
        '体力',
        stats.sta ?? stats.体力 ?? stats.vit,
        stats.sta_max ?? stats.体力上限 ?? stats.vit_max,
      );
      const rawReqMen = parseResourceCostValue(
        costStr,
        '精神力',
        stats.men ?? stats.精神力,
        stats.men_max ?? stats.精神力上限,
      );
      const reqSp = Math.floor(rawReqSp * costScale);
      const hpRatio =
        Math.max(0, Number(stats.vit ?? stats.HP ?? stats.体力 ?? 0)) /
        Math.max(1, Number(stats.vit_max ?? stats.HP上限 ?? stats.体力上限 ?? 1));
      const staminaCostScale = hpRatio <= 0.2 ? 2 : 1;
      const reqVit = Math.floor(rawReqVit * costScale * staminaCostScale);
      const reqMen = Math.floor(rawReqMen * costScale);
      const selfCanCast =
        ((stats.sp ?? stats.魂力) || 0) >= reqSp &&
        ((stats.sta ?? stats.体力 ?? stats.vit) || 0) >= reqVit &&
        ((stats.men ?? stats.精神力) || 0) >= reqMen;
      const fusionProfile = getFusionBattleProfileFromSkill(skill);
      const result = {
        reqSp,
        reqVit,
        reqMen,
        costScale,
        canCast: selfCanCast,
        failureReason: selfCanCast ? '' : '自身状态不足',
        partnerCosts: [],
      };
      if (!fusionProfile || fusionProfile.mode !== 'partner') return result;

      const partnerUnits = resolveFusionPartnerUnitsForSkill(skill, [], null, char);
      const expectedNames = Array.isArray(skill?.__fusion_partner_names) ? skill.__fusion_partner_names : [];
      if (partnerUnits.length < Math.max(1, expectedNames.length)) {
        result.canCast = false;
        result.failureReason = expectedNames.length ? `搭档[${expectedNames.join('、')}]未到位` : '搭档未到位';
        return result;
      }

      const partnerCostText = String(skill?.__fusion_partner_cost_text || '无').trim() || '无';
      const partnerCosts = partnerUnits.map(unit => {
        const parsed = parseCostStringForChar(partnerCostText, unit, 1);
        return {
          ...parsed,
          unit,
          name: String(unit?.name || unit?.名称 || '搭档').trim() || '搭档',
        };
      });
      result.partnerCosts = partnerCosts;
      const failedPartner = partnerCosts.find(item => !item.canCast);
      if (failedPartner) {
        result.canCast = false;
        result.failureReason = `${failedPartner.name}状态不足`;
      }
      return result;
    }

    function chooseWeightedOption(options) {
      const valid = (options || []).filter(option => option && option.weight > 0);
      if (valid.length === 0) return null;
      const totalWeight = valid.reduce((sum, option) => sum + option.weight, 0);
      let roll = Math.random() * totalWeight;
      for (const option of valid) {
        roll -= option.weight;
        if (roll <= 0) return option;
      }
      return valid[0];
    }

    function rollD100() {
      return Math.floor(Math.random() * 100) + 1;
    }

    function rollBranchByPriority(branches, phaseLabel) {
      const traces = [];
      for (const branch of branches || []) {
        if (!branch) continue;
        const weight = Math.max(0, Math.min(95, Math.floor(branch.weight || 0)));
        if (weight <= 0) continue;

        const roll = rollD100();
        const hit = roll <= weight;
        traces.push(
          `[${phaseLabel}] ${branch.name || '未命名分支'} 权重:${weight} Roll:${roll} 判定:${hit ? '命中' : '未命中'}`,
        );

        if (hit) {
          return { option: branch, trace: traces.join(' | '), roll, weight };
        }
      }

      return { option: null, trace: traces.join(' | ') };
    }

    function isPassiveSkillData(skill) {
      if (!skill || typeof skill !== 'object') return false;
      const rawType = getSkillType(skill);
      return /被动/.test(String(rawType || ''));
    }

    function pushUnifiedSkillMapEntries(skills, skillMap, sourceTag, options = {}) {
      const { includePassive = false, includeActive = true } = options;
      Object.entries(skillMap || {}).forEach(([skillName, skillData]) => {
        if (!skillData || skillData?.状态 === '未生成') return;
        const nSkill = normalizeSkillData(skillData, skillName);
        const isPassive = isPassiveSkillData(nSkill);
        if (isPassive && !includePassive) return;
        if (!isPassive && !includeActive) return;
        nSkill.source_tag = sourceTag;
        skills.push(nSkill);
      });
    }

    function collectUnifiedSkillEntries(charData, alliedTeam = [], options = {}) {
      const skills = [];
      const collectOptions = {
        includePassive: !!options.includePassive,
        includeActive: options.includeActive !== false,
      };

      if (charData?.武魂) {
        Object.entries(charData.武魂).forEach(([spKey, sp]) => {
          const spName = sp?.表象名称 || spKey || '武魂';
          Object.values(sp?.魂灵 || {}).forEach(ss => {
            Object.values(ss?.魂环 || {}).forEach(ring => {
              pushUnifiedSkillMapEntries(skills, ring?.魂技 || {}, spName, collectOptions);
            });
          });
        });
      }

      if (charData?.血脉之力) {
        pushUnifiedSkillMapEntries(skills, charData.血脉之力.技能 || {}, '血脉之力', collectOptions);
        pushUnifiedSkillMapEntries(skills, charData.血脉之力.被动 || {}, '血脉被动', collectOptions);
        Object.values(charData.血脉之力.气血魂环 || {}).forEach(ring => {
          pushUnifiedSkillMapEntries(skills, ring?.魂技 || {}, '气血魂技', collectOptions);
        });
      }

      Object.values(charData?.魂骨 || {}).forEach(bone => {
        pushUnifiedSkillMapEntries(skills, bone?.附带技能 || {}, '魂骨技能', collectOptions);
      });

      pushUnifiedSkillMapEntries(skills, charData?.特殊能力 || {}, '特殊能力', collectOptions);

      Object.entries(charData?.武魂融合技 || {}).forEach(([fusionName, fusionSkill]) => {
        if (!isFusionSkillAvailable(charData, fusionSkill, alliedTeam)) return;
        const nSkill = buildFusionCombatSkill(fusionSkill, fusionName);
        const isPassive = isPassiveSkillData(nSkill);
        if (isPassive && !collectOptions.includePassive) return;
        if (!isPassive && !collectOptions.includeActive) return;
        skills.push(nSkill);
      });

      return skills;
    }

    function collectPassiveCombatSkills(charData, alliedTeam = []) {
      return collectUnifiedSkillEntries(charData, alliedTeam, { includePassive: true, includeActive: false });
    }

    const AUTO_PROJECTED_CONDITION_PREFIX = '__auto__:';

    function clearAutoProjectedConditions(char) {
      if (!char?.状态效果) return;
      Object.keys(char.状态效果).forEach(key => {
        if (String(key).startsWith(AUTO_PROJECTED_CONDITION_PREFIX)) delete char.状态效果[key];
      });
    }

    function createProjectedCondition(description, type = 'buff', statMods = {}, combatEffects = {}, duration = 999) {
      return {
        类型: type,
        层数: 1,
        描述: description || '自动投影效果',
        duration,
        面板修改比例: {
          str: Number(statMods.str ?? 1),
          def: Number(statMods.def ?? 1),
          agi: Number(statMods.agi ?? 1),
          sp_max: Number(statMods.sp_max ?? 1),
          vit_max: Number(statMods.vit_max ?? 1),
          men_max: Number(statMods.men_max ?? 1),
        },
        战斗效果: mergeCombatEffectMaps(createEmptyCombatEffectMap(), combatEffects || {}),
      };
    }

    function projectPassiveSkillToConditions(char, skill) {
      if (!char?.状态效果 || !skill) return;
      const sourceName = skill.name || skill.技能名称 || '被动技能';
      getSkillEffects(skill).forEach((effect, index) => {
        const mechanism = effect?.机制 || effect?.名称 || effect?.类型 || '';
        if (mechanism === '状态挂载' && effect?.状态名称 && effect.状态名称 !== '无') {
          const specialFlag = effect.特殊机制标识 || '无';
          const calc = effect.计算层效果 || {};
          const isBuff =
            /增益|真身|被动/.test(specialFlag) ||
            Number(calc.hit_bonus || 0) > 0 ||
            Number(calc.reaction_bonus || 0) > 0 ||
            Number(calc.dodge_bonus || 0) > 0 ||
            Number(calc.final_heal_mult || 1) > 1 ||
            Number(calc.final_damage_mult || 1) > 1 ||
            calc.super_armor === true ||
            Number(calc.min_hp_floor || 0) > 0;
          char.状态效果[`${AUTO_PROJECTED_CONDITION_PREFIX}${sourceName}:${effect.状态名称}`] =
            createProjectedCondition(
              `自动投影[${sourceName}]`,
              isBuff ? 'buff' : 'debuff',
              effect.面板修改比例 || {},
              calc,
              999,
            );
          return;
        }
        if (mechanism === '属性永久强化') {
          const mult = 1 + Math.max(0, Number(effect.强化值 || 0));
          char.状态效果[`${AUTO_PROJECTED_CONDITION_PREFIX}${sourceName}:属性永久强化:${index}`] =
            createProjectedCondition(
              `自动投影[${sourceName}]·属性永久强化`,
              'buff',
              { str: mult, def: mult, agi: mult, sp_max: mult, vit_max: mult, men_max: mult },
              {},
              999,
            );
        }
      });
      const runtimeEffect = createEmptyCombatEffectMap();
      applyRuntimeMechanismEffects(skill, char, char, char, char, runtimeEffect);
      if (hasMeaningfulCombatEffect(runtimeEffect)) {
        char.状态效果[`${AUTO_PROJECTED_CONDITION_PREFIX}${sourceName}:机制投影`] = createProjectedCondition(
          `自动投影[${sourceName}]·机制效果`,
          'buff',
          {},
          runtimeEffect,
          999,
        );
      }
    }

    function getActiveStructuredDomain(char) {
      if (!char || typeof char !== 'object') return null;
      const domain = char.精神领域 || {};
      const modifiers = domain.战斗修饰 || {};
      const enabled = Object.values(modifiers).some(mod => mod?.启用);
      const isActive =
        !!domain.进行中 || String(char.当前领域 || char.状态?.当前领域 || '').includes('精神领域');
      if (!enabled || !isActive) return null;
      return { name: domain.名称 || '精神领域', modifiers };
    }

    function buildDomainSuppressionStatMods(targetStat = 'all', reduceRatio = 0.3) {
      const mult = Math.max(0.05, 1 - Math.max(0, Number(reduceRatio || 0)));
      const mods = { str: 1, def: 1, agi: 1, sp_max: 1, vit_max: 1, men_max: 1 };
      if (targetStat === 'all') return { str: mult, def: mult, agi: mult, sp_max: mult, vit_max: mult, men_max: mult };
      const keyMap = {
        str: 'str',
        def: 'def',
        agi: 'agi',
        sp: 'sp_max',
        sp_max: 'sp_max',
        vit: 'vit_max',
        vit_max: 'vit_max',
        men: 'men_max',
        men_max: 'men_max',
      };
      const mapped = keyMap[targetStat] || null;
      if (mapped) mods[mapped] = mult;
      return mods;
    }

    function resolveArmorDomainDescriptor(char) {
      const activeDomainText = String(char?.当前领域 || char?.状态?.当前领域 || '');
      if (!activeDomainText.includes('斗铠领域')) return null;

      const isFourWord = activeDomainText.includes('四字');
      const ratio = isFourWord ? 1.2 : 1.1;
      const requiredCount = isFourWord ? 2 : 1;
      const attrPool = ['sp_max', 'men_max', 'str', 'def', 'agi', 'vit_max'];
      const bracketMatch = activeDomainText.match(/\[([^\]]+)\]/);
      let selectedAttrs = bracketMatch
        ? bracketMatch[1]
            .split(/[，,]/)
            .map(attr => String(attr || '').trim())
            .filter(attr => attrPool.includes(attr))
        : [];

      if (selectedAttrs.length > requiredCount) selectedAttrs = selectedAttrs.slice(0, requiredCount);

      if (activeDomainText.includes('未定') || selectedAttrs.length < requiredCount) {
        const remaining = [...attrPool];
        selectedAttrs = [];
        while (selectedAttrs.length < requiredCount && remaining.length > 0) {
          const index = Math.floor(Math.random() * remaining.length);
          selectedAttrs.push(remaining.splice(index, 1)[0]);
        }
        char.当前领域 = isFourWord
          ? `【四字斗铠领域】全开[${selectedAttrs.join(',')}]`
          : `【三字斗铠领域】全开[${selectedAttrs.join(',')}]`;
      }

      return {
        name: String(char.当前领域 || char?.状态?.当前领域 || activeDomainText),
        ratio,
        selectedAttrs,
      };
    }

    function projectDomainConditionsForParticipant(char, opposingTeam = []) {
      if (!char?.状态效果) return;
      const armorDomain = resolveArmorDomainDescriptor(char);
      if (armorDomain) {
        const statMods = { str: 1, def: 1, agi: 1, sp_max: 1, vit_max: 1, men_max: 1 };
        armorDomain.selectedAttrs.forEach(attr => {
          statMods[attr] = armorDomain.ratio;
        });
        char.状态效果[`${AUTO_PROJECTED_CONDITION_PREFIX}斗铠领域:${armorDomain.name}`] = createProjectedCondition(
          `自动投影[${armorDomain.name}]·斗铠增幅`,
          'buff',
          statMods,
          {},
          999,
        );
      }

      const ownDomain = getActiveStructuredDomain(char);
      if (ownDomain) {
        const selfEffects = createEmptyCombatEffectMap();
        const ownMods = ownDomain.modifiers;
        if (ownMods.条件闪避?.启用) {
          const compareStat = ownMods.条件闪避.比对属性 || 'men';
          const selfValue = getMechanismJudgeValue(char, char.final || char, compareStat);
          const maxEnemy = Math.max(
            0,
            ...(opposingTeam || []).map(unit => getMechanismJudgeValue(unit, unit.final || unit, compareStat)),
          );
          const maxRatio = Math.max(1, Number(ownMods.条件闪避.最大倍率 || 1.5));
          if (maxEnemy <= selfValue * maxRatio) {
            selfEffects.dodge_bonus += 0.25;
            selfEffects.reaction_bonus += 0.1;
          }
        }
        if (ownMods.必中真伤?.启用) {
          const ratio = Math.max(0, Number(ownMods.必中真伤.真伤比例 || 0.1));
          selfEffects.hit_bonus += 0.12;
          selfEffects.lock_level = Math.max(Number(selfEffects.lock_level || 0), 1);
          selfEffects.final_damage_mult *= 1 + Math.min(0.35, ratio);
          selfEffects.bonus_true_damage_ratio += ratio;
        }
        if (ownMods.灵魂汲取?.启用) {
          selfEffects.life_steal_ratio += Math.max(0, Math.min(1, Number(ownMods.灵魂汲取.汲取比例 || 0.5)));
        }
        if (hasMeaningfulCombatEffect(selfEffects)) {
          char.状态效果[`${AUTO_PROJECTED_CONDITION_PREFIX}领域:${ownDomain.name}:自我法则`] =
            createProjectedCondition(`自动投影[${ownDomain.name}]·自我法则`, 'buff', {}, selfEffects, 999);
        }
      }

      (opposingTeam || []).forEach(enemy => {
        const enemyDomain = getActiveStructuredDomain(enemy);
        if (!enemyDomain) return;
        const mods = enemyDomain.modifiers;
        const effectMap = createEmptyCombatEffectMap();
        let statMods = { str: 1, def: 1, agi: 1, sp_max: 1, vit_max: 1, men_max: 1 };
        if (mods.属性压制?.启用)
          statMods = buildDomainSuppressionStatMods(
            mods.属性压制.目标属性 || 'all',
            mods.属性压制.削弱比例 || 0.3,
          );
        if (mods.时间迟滞?.启用) {
          const mult = Math.max(1, Number(mods.时间迟滞.蓄力倍率 || 2));
          effectMap.reaction_penalty += Math.min(0.45, (mult - 1) * 0.2);
          effectMap.cast_speed_penalty += Math.min(2, mult - 1);
          effectMap.dodge_penalty += Math.min(0.2, (mult - 1) * 0.08);
        }
        if (mods.幻境偏移?.启用) {
          const chance = Math.max(0, Math.min(0.9, Number(mods.幻境偏移.偏移概率 || 0.4)));
          effectMap.hit_penalty += Number((chance * 0.5).toFixed(2));
          effectMap.control_success_penalty += Number((chance * 0.2).toFixed(2));
          effectMap.reaction_penalty += Number((chance * 0.15).toFixed(2));
        }
        if (hasMeaningfulCombatEffect(effectMap) || Object.values(statMods).some(v => Number(v || 1) !== 1)) {
          char.状态效果[
            `${AUTO_PROJECTED_CONDITION_PREFIX}领域压制:${enemy.name || enemyDomain.name}:${char.name || '目标'}`
          ] = createProjectedCondition(`自动投影[${enemyDomain.name}]·领域压制`, 'debuff', statMods, effectMap, 999);
        }
      });
    }

    function buildCombatFinalStats(char) {
      const final = deepClone(char || {});
      final.状态效果 = deepClone(char?.状态效果 || {});
      final.战斗效果 = createEmptyCombatEffectMap();
      Object.values(final.状态效果 || {}).forEach(cond => {
        const mods = cond?.面板修改比例 || {};
        final.str = Number(final.str || 0) * Number(mods.str ?? 1);
        final.def = Number(final.def || 0) * Number(mods.def ?? 1);
        final.agi = Number(final.agi || 0) * Number(mods.agi ?? 1);
        if (final.sp_max !== undefined) final.sp_max = Number(final.sp_max || 0) * Number(mods.sp_max ?? 1);
        if (final.vit_max !== undefined) final.vit_max = Number(final.vit_max || 0) * Number(mods.vit_max ?? 1);
        if (final.men_max !== undefined) final.men_max = Number(final.men_max || 0) * Number(mods.men_max ?? 1);
        final.战斗效果 = mergeCombatEffectMaps(final.战斗效果, cond?.战斗效果 || {});
      });
      if (final.sp_max !== undefined && final.sp !== undefined) final.sp = Math.min(final.sp, final.sp_max);
      if (final.vit_max !== undefined && final.vit !== undefined) final.vit = Math.min(final.vit, final.vit_max);
      if (final.men_max !== undefined && final.men !== undefined) final.men = Math.min(final.men, final.men_max);
      final.str = Math.round(Number(final.str || 0));
      final.def = Math.round(Number(final.def || 0));
      final.agi = Math.round(Number(final.agi || 0));
      if (final.sp_max !== undefined) final.sp_max = Math.round(Number(final.sp_max || 0));
      if (final.vit_max !== undefined) final.vit_max = Math.round(Number(final.vit_max || 0));
      if (final.men_max !== undefined) final.men_max = Math.round(Number(final.men_max || 0));
      return final;
    }

    function refreshParticipantProjectedState(char, alliedTeam = [], opposingTeam = []) {
      if (!char) return char;
      bindCombatParticipant(char);
      clearAutoProjectedConditions(char);
      collectPassiveCombatSkills(char, alliedTeam).forEach(skill => projectPassiveSkillToConditions(char, skill));
      projectDomainConditionsForParticipant(char, opposingTeam);
      char.final = buildCombatFinalStats(char);
      return char;
    }

    function applyStateToCharacter(targetChar, stateModule, sourceName, forceBuff) {
      if (!targetChar || !stateModule || !stateModule.状态名称 || stateModule.状态名称 === '无') return false;
      if (!targetChar.状态效果) targetChar.状态效果 = {};

      const specialFlag = stateModule.特殊机制标识 || '无';
      const calc = stateModule.计算层效果 || {};
      const hasPositiveCalc =
        Number(calc.hit_bonus || 0) > 0 ||
        Number(calc.reaction_bonus || 0) > 0 ||
        Number(calc.dodge_bonus || 0) > 0 ||
        Number(calc.sp_gain_ratio || 0) > 0 ||
        Number(calc.men_gain_ratio || 0) > 0 ||
        Number(calc.final_heal_mult || 1.0) > 1.0 ||
        Number(calc.shield_gain_mult || 1.0) > 1.0 ||
        Number(calc.hot_heal_ratio || 0) > 0 ||
        calc.invincible === true ||
        calc.super_armor === true ||
        Number(calc.min_hp_floor || 0) > 0 ||
        Number(calc.revive_count || 0) > 0 ||
        Number(calc.substitute_count || 0) > 0;
      const isBuff =
        forceBuff === true || hasPositiveCalc || specialFlag.includes('增益') || specialFlag.includes('真身');

      targetChar.状态效果[stateModule.状态名称] = {
        类型: isBuff ? 'buff' : 'debuff',
        层数: 1,
        描述: `由[${sourceName || stateModule.状态名称}]附加`,
        duration: stateModule.持续回合 || 0,
        面板修改比例: stateModule.面板修改比例 || { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 },
        战斗效果: {
          ...createEmptyCombatEffectMap(),
          skip_turn: stateModule.计算层效果?.skip_turn ?? false,
          cannot_react: stateModule.计算层效果?.cannot_react ?? false,
          invincible: stateModule.计算层效果?.invincible ?? false,
          skill_seal: stateModule.计算层效果?.skill_seal ?? false,
          dot_damage: (stateModule.计算层效果?.dot_damage ?? stateModule.持续真伤dot) || 0,
          armor_pen: stateModule.计算层效果?.armor_pen ?? 0,
          reaction_bonus: stateModule.计算层效果?.reaction_bonus ?? 0,
          reaction_penalty: stateModule.计算层效果?.reaction_penalty ?? 0,
          attacker_speed_bonus: stateModule.计算层效果?.attacker_speed_bonus ?? 0,
          cast_speed_bonus: stateModule.计算层效果?.cast_speed_bonus ?? 0,
          cast_speed_penalty: stateModule.计算层效果?.cast_speed_penalty ?? 0,
          hit_bonus: stateModule.计算层效果?.hit_bonus ?? 0,
          hit_penalty: stateModule.计算层效果?.hit_penalty ?? 0,
          dodge_bonus: stateModule.计算层效果?.dodge_bonus ?? 0,
          dodge_penalty: stateModule.计算层效果?.dodge_penalty ?? 0,
          lock_level: stateModule.计算层效果?.lock_level ?? 0,
          control_success_bonus: stateModule.计算层效果?.control_success_bonus ?? 0,
          control_success_penalty: stateModule.计算层效果?.control_success_penalty ?? 0,
          control_resist_mult: stateModule.计算层效果?.control_resist_mult ?? 1.0,
          control_resist_bonus: stateModule.计算层效果?.control_resist_bonus ?? 0,
          interrupt_bonus: stateModule.计算层效果?.interrupt_bonus ?? 0,
          final_damage_mult: stateModule.计算层效果?.final_damage_mult ?? 1.0,
          final_damage_bonus: stateModule.计算层效果?.final_damage_bonus ?? 0,
          final_heal_mult: stateModule.计算层效果?.final_heal_mult ?? 1.0,
          final_heal_bonus: stateModule.计算层效果?.final_heal_bonus ?? 0,
          shield_gain_mult: stateModule.计算层效果?.shield_gain_mult ?? 1.0,
          shield_gain_bonus: stateModule.计算层效果?.shield_gain_bonus ?? 0,
          sp_gain_ratio: stateModule.计算层效果?.sp_gain_ratio ?? 0,
          men_gain_ratio: stateModule.计算层效果?.men_gain_ratio ?? 0,
          heal_block_ratio: stateModule.计算层效果?.heal_block_ratio ?? 0,
          hot_heal_ratio: stateModule.计算层效果?.hot_heal_ratio ?? 0,
          resource_block_ratio: stateModule.计算层效果?.resource_block_ratio ?? 0,
          stealth_level: stateModule.计算层效果?.stealth_level ?? 0,
          min_hp_floor: stateModule.计算层效果?.min_hp_floor ?? 0,
          death_save_count: stateModule.计算层效果?.death_save_count ?? 0,
          revive_count: stateModule.计算层效果?.revive_count ?? 0,
          revive_heal_ratio: stateModule.计算层效果?.revive_heal_ratio ?? 0,
          substitute_count: stateModule.计算层效果?.substitute_count ?? 0,
          damage_reflect_ratio: stateModule.计算层效果?.damage_reflect_ratio ?? 0,
          damage_share_ratio: stateModule.计算层效果?.damage_share_ratio ?? 0,
          damage_share_count: stateModule.计算层效果?.damage_share_count ?? 0,
          heal_inversion_ratio: stateModule.计算层效果?.heal_inversion_ratio ?? 0,
          invincible_tier_threshold: stateModule.计算层效果?.invincible_tier_threshold ?? 0,
          daily_trigger_limit: stateModule.计算层效果?.daily_trigger_limit ?? 0,
          bonus_true_damage_ratio: stateModule.计算层效果?.bonus_true_damage_ratio ?? 0,
          life_steal_ratio: stateModule.计算层效果?.life_steal_ratio ?? 0,
        },
      };
      return true;
    }

    function dedupeCombatTargetList(units = []) {
      const seen = new Set();
      const result = [];
      (Array.isArray(units) ? units : []).forEach(unit => {
        if (!unit) return;
        const identity = String(unit?.name || unit?.名称 || '').trim() || JSON.stringify([unit?.type, unit?.vit_max, unit?.str]);
        if (!identity || seen.has(identity)) return;
        seen.add(identity);
        result.push(unit);
      });
      return result;
    }

    function findCombatTargetInSet(targetSet = [], expectedTarget = null) {
      if (!expectedTarget) return null;
      return (
        (Array.isArray(targetSet) ? targetSet : []).find(target =>
          isCombatUnitIdentityMatch(target, expectedTarget?.name || expectedTarget),
        ) || null
      );
    }

    function resolveSkillTargetContext(skill, attacker, defender, combatData, effect = null) {
      const runtimeMeta = getSkillRuntimeMeta(skill);
      const explicitTargetText = String(effect?.目标覆盖 || effect?.目标 || effect?.对象 || '').trim();
      const baseTargetModel = explicitTargetText
        ? inferBattleTargetModelFromLegacyTarget(explicitTargetText)
        : normalizeBattleSkillTargetModel(effect?.目标模型 || runtimeMeta.目标模型 || '敌方单体', '敌方单体');
      const targetModifiers = normalizeBattleSkillTargetModifiers(
        Array.isArray(effect?.目标修饰) && effect.目标修饰.length
          ? effect.目标修饰
          : runtimeMeta.目标修饰 || [],
      );
      const resolutionStrategy = String(
        effect?.结算策略 || runtimeMeta.结算策略 || deriveBattleTargetResolutionStrategy(baseTargetModel),
      ).trim() || '单目标独立';
      const baseTargetText = explicitTargetText || mapBattleTargetModelToCombatTarget(baseTargetModel);
      const randomTargetText = String(skill?._runtime_random_target || '');
      const shouldUseRandomTarget =
        !!randomTargetText &&
        (baseTargetText.includes('随机') ||
          (targetModifiers.includes('可被随机偏转') &&
            !/自身|己方|友方/.test(baseTargetText) &&
            /敌|单体|群体|全场/.test(baseTargetText)));
      const effectiveTargetModel = shouldUseRandomTarget
        ? inferBattleTargetModelFromLegacyTarget(randomTargetText)
        : baseTargetModel;
      const targetText = shouldUseRandomTarget ? randomTargetText : mapBattleTargetModelToCombatTarget(effectiveTargetModel);
      const alliedUnits = dedupeCombatTargetList([
        attacker,
        ...((combatData?.参战者?.team_player || []).filter(Boolean)),
      ]).filter(isCombatUnitAlive);
      const hostileUnits = dedupeCombatTargetList([
        defender,
        ...((combatData?.参战者?.team_enemy || []).filter(Boolean)),
      ]).filter(isCombatUnitAlive);
      const allUnits = dedupeCombatTargetList([...alliedUnits, ...hostileUnits]).filter(isCombatUnitAlive);
      let targetSet = [];
      switch (effectiveTargetModel) {
        case '全场': {
          const prioritizedTarget = findCombatTargetInSet(allUnits, defender);
          targetSet = prioritizedTarget
            ? [prioritizedTarget, ...allUnits.filter(target => !isCombatUnitIdentityMatch(target, prioritizedTarget.name))]
            : allUnits;
          break;
        }
        case '自身':
          targetSet = attacker ? [attacker] : [];
          break;
        case '友方群体':
          targetSet = alliedUnits;
          break;
        case '友方单体': {
          const alliedTarget = findCombatTargetInSet(alliedUnits, defender) || findCombatTargetInSet(alliedUnits, attacker) || attacker;
          targetSet = alliedTarget ? [alliedTarget] : [];
          break;
        }
        case '敌方群体':
          targetSet = hostileUnits;
          break;
        case '敌方单体':
        default: {
          const hostileTarget = findCombatTargetInSet(hostileUnits, defender) || hostileUnits[0] || null;
          targetSet = hostileTarget ? [hostileTarget] : [];
          break;
        }
      }
      if (targetModifiers.includes('受隐身筛选') && !canBypassStealth(attacker, skill)) {
        const visibleTargets = targetSet.filter(target => !buildConditionTacticalSnapshot(target).hasStealthed);
        if (visibleTargets.length > 0) targetSet = visibleTargets;
      }
      if (targetModifiers.includes('可被嘲讽') && ['敌方单体', '敌方群体'].includes(effectiveTargetModel)) {
        const forcedTargetName = getForcedTauntTargetName(attacker);
        if (forcedTargetName) {
          const forcedTarget = hostileUnits.find(target => isCombatUnitIdentityMatch(target, forcedTargetName));
          if (forcedTarget) {
            targetSet =
              effectiveTargetModel === '敌方单体'
                ? [forcedTarget]
                : [forcedTarget, ...targetSet.filter(target => !isCombatUnitIdentityMatch(target, forcedTarget.name))];
          }
        }
      }
      const primaryTarget = targetSet[0] || null;
      return {
        targetModel: effectiveTargetModel,
        targetModifiers,
        resolutionStrategy,
        targetText,
        alliedSet: alliedUnits,
        hostileSet: hostileUnits,
        targetSet,
        primaryTarget,
      };
    }

    function resolveSkillEffectTargetCharacter(skill, effect, attacker, defender, combatData = null) {
      return resolveSkillTargetContext(skill, attacker, defender, combatData, effect).primaryTarget;
    }

    function resolveSkillEffectTargetCharacters(skill, effect, attacker, defender, combatData) {
      return resolveSkillTargetContext(skill, attacker, defender, combatData, effect).targetSet;
    }

    function removeNegativeConditionsByCleanse(targetChar, maxCount = 1) {
      if (!targetChar?.状态效果) return [];
      const removed = [];
      const scoreCondition = (cond = {}) => {
        const ce = cond?.战斗效果 || {};
        return (
          (ce.skip_turn ? 1000 : 0) +
          (ce.cannot_react ? 800 : 0) +
          Number(ce.lock_level || 0) * 100 +
          Number(ce.dot_damage || 0) / 10 +
          Number(cond?.duration || 0)
        );
      };
      const removable = Object.entries(targetChar.状态效果)
        .filter(
          ([key, cond]) => cond?.类型 === 'debuff' && !String(key || '').startsWith(AUTO_PROJECTED_CONDITION_PREFIX),
        )
        .sort((a, b) => scoreCondition(b[1]) - scoreCondition(a[1]));
      removable.slice(0, Math.max(1, Number(maxCount || 1))).forEach(([key]) => {
        delete targetChar.状态效果[key];
        removed.push(key);
        if (targetChar.持续效果) {
          Object.keys(targetChar.持续效果).forEach(sustainKey => {
            if (targetChar.持续效果[sustainKey]?.related_condition === key)
              delete targetChar.持续效果[sustainKey];
          });
        }
      });
      return removed;
    }

    function removePositiveConditionsByDispel(targetChar, maxCount = 1) {
      if (!targetChar?.状态效果) return [];
      const removed = [];
      const scoreCondition = (cond = {}) => {
        const ce = cond?.战斗效果 || {};
        return (
          Number(cond?.shield_value || 0) +
          Number(ce.death_save_count || 0) * 800 +
          Number(ce.block_count || 0) * 300 +
          Number(ce.damage_reduction || 0) * 500 +
          Math.max(0, Number(ce.final_damage_mult || 1) - 1) * 300 +
          Math.max(0, Number(ce.final_heal_mult || 1) - 1) * 260 +
          Math.max(0, Number(ce.shield_gain_mult || 1) - 1) * 220 +
          Number(cond?.duration || 0)
        );
      };
      const removable = Object.entries(targetChar.状态效果)
        .filter(
          ([key, cond]) => cond?.类型 === 'buff' && !String(key || '').startsWith(AUTO_PROJECTED_CONDITION_PREFIX),
        )
        .sort((a, b) => scoreCondition(b[1]) - scoreCondition(a[1]));
      removable.slice(0, Math.max(1, Number(maxCount || 1))).forEach(([key]) => {
        delete targetChar.状态效果[key];
        removed.push(key);
        if (targetChar.持续效果) {
          Object.keys(targetChar.持续效果).forEach(sustainKey => {
            if (targetChar.持续效果[sustainKey]?.related_condition === key)
              delete targetChar.持续效果[sustainKey];
          });
        }
      });
      return removed;
    }
    
    function getCombatSoulCoreCount(char) {
      return Math.max(0, Math.floor(Number(char?.魂核?.核心?.数量 || 0)));
    }

    function settleConditionsAtRoundEnd(char, label) {
      if (!char) return { log: '', totalDot: 0, expired: [] };

      let totalDot = 0;
      let expired = [];
      let parts = [];
      const conditionMap =
        char.状态效果 && typeof char.状态效果 === 'object' && !Array.isArray(char.状态效果)
          ? char.状态效果
          : {};

        Object.keys(conditionMap).forEach(key => {
          let cond = conditionMap[key];
          if (!cond) return;

          let combatEffects = cond.战斗效果 || {};
          let dot = Math.max(0, combatEffects.dot_damage || 0);
          let hotHealRatio = Math.max(0, Number(combatEffects.hot_heal_ratio || 0));
          if (dot > 0) {
            char.vit = Math.max(0, char.vit - dot);
            totalDot += dot;
            parts.push(`[状态结算] ${label}受[${key}]影响，额外损失 ${dot} 点HP`);
          }
          if (hotHealRatio > 0) {
            const maxVit = Math.max(1, Number(char.vit_max || char.vit || 1));
            const hotHeal = Math.floor(maxVit * hotHealRatio);
            const healInvertRatio = Math.max(0, Number(combatEffects.heal_inversion_ratio || 0));
            if (healInvertRatio > 0) {
              const invertedDamage = Math.max(1, Math.floor(hotHeal * Math.max(1, healInvertRatio)));
              char.vit = Math.max(0, char.vit - invertedDamage);
              if (invertedDamage > 0) parts.push(`[状态结算] ${label}的[${key}]治疗被反转，反而损失 ${invertedDamage} 点HP`);
            } else {
              char.vit = Math.min(maxVit, char.vit + hotHeal);
              if (hotHeal > 0) parts.push(`[状态结算] ${label}受[${key}]影响，额外恢复 ${hotHeal} 点HP`);
            }
          }
          if (char.vit <= 0) {
            const reviveLog = triggerReviveEffect(char, label);
            if (reviveLog) parts.push(reviveLog);
          }

          if (typeof cond.duration === 'number') {
            cond.duration -= 1;
            if (cond.duration <= 0) expired.push(key);
          }
        });

        expired.forEach(key => {
          delete conditionMap[key];
          if (String(char.当前领域 || '') === String(key)) {
            char.当前领域 = '无';
          }
          if (char.持续效果) {
            Object.keys(char.持续效果).forEach(sustainKey => {
              if (char.持续效果[sustainKey]?.related_condition === key) delete char.持续效果[sustainKey];
            });
          }
          parts.push(`[状态消散] ${label}的[${key}]已结束`);
        });

        const resourceBlockRatio = Math.min(
          1,
          Object.values(conditionMap).reduce((maxVal, cond) => {
            const value = Number(cond?.战斗效果?.resource_block_ratio || 0);
            return Math.max(maxVal, value);
          }, 0),
        );
        const coreCount = getCombatSoulCoreCount(char);
        let naturalSpRatio = 0.005;
        let naturalMenRatio = 0.005;
        if (coreCount >= 1) naturalSpRatio += 0.01;
        if (coreCount >= 2) naturalMenRatio += 0.01;
        if (coreCount >= 3) naturalSpRatio += 0.01;

        const maxSp = Math.max(0, Number(char.sp_max || 0));
        const maxMen = Math.max(0, Number(char.men_max || 0));
        if (maxSp > 0 && naturalSpRatio > 0 && resourceBlockRatio < 1) {
          const beforeSp = Math.max(0, Number(char.sp || 0));
          const recoverSp = Math.max(0, Math.floor(maxSp * naturalSpRatio * (1 - resourceBlockRatio)));
          char.sp = Math.min(maxSp, beforeSp + recoverSp);
          const actualRecoverSp = Math.max(0, Number(char.sp || 0) - beforeSp);
          if (actualRecoverSp > 0) parts.push(`[自然恢复] ${label}回合末恢复 ${actualRecoverSp} 点魂力`);
        }
        if (maxMen > 0 && naturalMenRatio > 0 && resourceBlockRatio < 1) {
          const beforeMen = Math.max(0, Number(char.men || 0));
          const recoverMen = Math.max(0, Math.floor(maxMen * naturalMenRatio * (1 - resourceBlockRatio)));
          char.men = Math.min(maxMen, beforeMen + recoverMen);
          const actualRecoverMen = Math.max(0, Number(char.men || 0) - beforeMen);
          if (actualRecoverMen > 0) parts.push(`[自然恢复] ${label}回合末恢复 ${actualRecoverMen} 点精神力`);
        }

        return { log: parts.join(' '), totalDot, expired };
      }

      function splitSkillCostModes(costStr) {
        const raw = String(costStr || '无').trim();
        if (!raw || raw === '无') return { upfront: '无', sustain: '', hasSustain: false };

        const parts = raw.split(/维持[:：]?/);
        return {
          upfront: (parts[0] || '无').trim() || '无',
          sustain: (parts[1] || '').trim(),
          hasSustain: parts.length > 1,
        };
      }

      function parseCostStringForChar(costStr, char, costScale = 1) {
        return parseSkillCostForChar(
          { 消耗: costStr || '无', __battleSupportCostScale: Number(costScale || 1) || 1 },
          char,
        );
      }

      function formatParsedCost(parsed) {
        if (!parsed) return '无消耗';
        const parts = [];
        if (parsed.reqSp) parts.push(`魂力:${parsed.reqSp}`);
        if (parsed.reqVit) parts.push(`体力:${parsed.reqVit}`);
        if (parsed.reqMen) parts.push(`精神力:${parsed.reqMen}`);
        return parts.length > 0 ? parts.join(' ') : '无消耗';
      }

      function registerSustainEffect(char, key, config) {
        if (!char || !config || !config.sustain_cost || config.sustain_cost === '无') return;
        if (!char.持续效果) char.持续效果 = {};
        char.持续效果[key] = { ...config };
      }

      function resolveActionSustainConfig(char, actionType, skill, stateName) {
        const skillName = skill?.name || actionType || stateName || '持续效果';
        const costParts = splitSkillCostModes(getSkillCostText(skill));
        const trueStateName = stateName || getPrimaryStateName(skill) || '';
        const isWuxingEscape = actionType === '五行遁法';

        if (costParts.hasSustain && costParts.sustain && costParts.sustain !== '无') {
          return {
            name: skillName,
            sustain_cost: costParts.sustain,
            effect_type: actionType?.includes('领域')
              ? 'domain'
              : actionType === '点燃生命之火'
                ? 'life_fire'
                : trueStateName || isWuxingEscape
                  ? 'condition'
                  : 'generic',
            related_condition: trueStateName || (isWuxingEscape ? '五行遁法' : ''),
          };
        }

        if (actionType === '点燃生命之火') {
          return {
            name: skillName,
            sustain_cost: `体力:${Math.max(1, Math.floor((char?.vit_max || 1) * 0.05))}`,
            effect_type: 'life_fire',
            related_condition: '',
          };
        }

        if (['展开斗铠领域', '展开精神领域', '展开武魂领域'].includes(actionType)) {
          return {
            name: skillName,
            sustain_cost: `精神力:${Math.max(30, Math.floor((char?.men_max || 1) * 0.05))}`,
            effect_type: 'domain',
            related_condition: '',
          };
        }

        if ((trueStateName || skillName).includes('真身')) {
          return {
            name: skillName,
            sustain_cost: `魂力:${Math.max(50, Math.floor((char?.sp_max || 1) * 0.05))}`,
            effect_type: 'condition',
            related_condition: trueStateName || skillName,
          };
        }

        return null;
      }

        function settleSustainEffectsAtRoundEnd(char, label) {
          if (!char?.持续效果) return { log: '', broken: [] };

          const logs = [];
          const broken = [];

          Object.entries(char.持续效果).forEach(([key, effect]) => {
            if (!effect) return;

            if (effect.effect_type === 'domain' && (!char.当前领域 || char.当前领域 === '无')) {
              delete char.持续效果[key];
              return;
            }
            if (effect.effect_type === 'life_fire' && !char.血脉之力?.生命之火) {
              delete char.持续效果[key];
              return;
            }
            if (
              effect.effect_type === 'condition' &&
              effect.related_condition &&
              !char.状态效果?.[effect.related_condition]
            ) {
              delete char.持续效果[key];
              return;
            }

            const parsed = parseCostStringForChar(
              effect.sustain_cost,
              char,
              Number(effect.support_cost_scale || 1) || 1,
            );
            if (!parsed.canCast) {
              if (effect.effect_type === 'domain') char.当前领域 = '无';
              else if (effect.effect_type === 'life_fire' && char.血脉之力)
                char.血脉之力.生命之火 = false;
              else if (effect.effect_type === 'condition' && effect.related_condition && char.状态效果)
                delete char.状态效果[effect.related_condition];

              delete char.持续效果[key];
              broken.push(effect.name || key);
              logs.push(`[维持中断] ${label}已无力维持[${effect.name || key}]，效果自动解除`);
              return;
            }

            char.sp -= parsed.reqSp;
            char.sta -= parsed.reqVit;
            char.men -= parsed.reqMen;
            logs.push(`[维持结算] ${label}维持[${effect.name || key}]，消耗 ${formatParsedCost(parsed)}`);
          });

          return { log: logs.join(' '), broken };
        }

        function getBehaviorProfile(actor, target, battleState = {}) {
          const hpRatio = (actor?.vit || 0) / Math.max(1, actor?.vit_max || 1);
          const targetHpRatio = (target?.vit || 0) / Math.max(1, target?.vit_max || 1);
          const profile = {
            aggression: 10,
            caution: 10,
            control: 10,
            mobility: 10,
            burst: 10,
            finisher: 0,
          };

          switch (actor?.type) {
            case '强攻系':
              profile.aggression += 25;
              profile.burst += 20;
              profile.caution -= 5;
              break;
            case '敏攻系':
              profile.mobility += 30;
              profile.aggression += 15;
              profile.caution += 5;
              break;
            case '防御系':
              profile.caution += 30;
              profile.control += 10;
              profile.aggression -= 10;
              break;
            case '控制系':
              profile.control += 30;
              profile.caution += 10;
              break;
            case '辅助系':
            case '治疗系':
            case '食物系':
              profile.caution += 25;
              profile.control += 15;
              profile.aggression -= 15;
              break;
          }

          if (hpRatio < 0.35) {
            profile.caution += 25;
            profile.burst += 10;
          }
          if (hpRatio < 0.2) {
            profile.caution += 35;
            profile.aggression -= 5;
          }
          if (targetHpRatio < 0.3) {
            profile.finisher += 25;
            profile.aggression += 10;
          }
          if (battleState.combatType === '死战' || battleState.isDeadlyFight) {
            profile.aggression += 15;
            profile.burst += 10;
          }
          if (battleState.combatType === '擂台切磋') {
            profile.caution += 10;
            profile.aggression -= 5;
            profile.burst -= 5;
          }
          if (battleState.isChargingHighThreat) {
            profile.control += 20;
            profile.mobility += 10;
          }
          if ((actor?.men_max || 0) > (target?.men_max || 0) * 1.2) profile.control += 10;

          return profile;
        }

        function adjustBehaviorWeight(branchName, baseWeight, actor, target, battleState = {}) {
          if (!baseWeight || baseWeight <= 0) return 0;
          const profile = getBehaviorProfile(actor, target, battleState);
          let weight = baseWeight;

          if (['武魂融合技', '点燃生命之火', '开启真身'].includes(branchName))
            weight += profile.burst * 0.8 + profile.aggression * 0.4;
          else if (branchName === '展开领域') weight += profile.control * 0.8 + profile.caution * 0.3;
          else if (branchName === '召唤魂灵') weight += profile.control * 0.5 + profile.caution * 0.3;
          else if (branchName === '穿戴装备') weight += profile.caution * 0.9;
          else if (branchName === '亡命奔逃') weight += profile.caution * 1.1 - profile.aggression * 0.4;
          else if (branchName === '危机自保') weight += profile.caution * 0.7 + profile.control * 0.5;
          else if (branchName === '强势对轰')
            weight += profile.aggression * 0.9 + profile.burst * 0.5 + profile.finisher * 0.5 - profile.caution * 0.3;
          else if (branchName === '伺机闪避') weight += profile.mobility * 0.9 + profile.caution * 0.4;
          else if (branchName === '肉体兜底') weight += profile.caution * 0.2;

          weight += Math.floor(Math.random() * 11) - 5;
          return Math.max(0, Math.floor(weight));
        }

        function ensureActorDecisionMemory(actor) {
          if (!actor)
            return {
              last_action: '',
              recent_actions: {},
              关注对象: '',
              focus_reason: '',
              focus_ttl: 0,
              countered_skills: {},
            };
          if (!actor.决策记忆) {
            actor.决策记忆 = {
              last_action: '',
              recent_actions: {},
              关注对象: '',
              focus_reason: '',
              focus_ttl: 0,
              countered_skills: {},
            };
          }
          if (!actor.决策记忆.recent_actions) actor.决策记忆.recent_actions = {};
          if (!actor.决策记忆.countered_skills) actor.决策记忆.countered_skills = {};
          if (actor.决策记忆.关注对象 === undefined) actor.决策记忆.关注对象 = '';
          if (actor.决策记忆.focus_reason === undefined) actor.决策记忆.focus_reason = '';
          if (actor.决策记忆.focus_ttl === undefined) actor.决策记忆.focus_ttl = 0;
          return actor.决策记忆;
        }

        function getActorFocusedTarget(actor, candidates = []) {
          const memory = ensureActorDecisionMemory(actor);
          if (!memory.关注对象 || Number(memory.focus_ttl || 0) <= 0) return null;
          const target = (candidates || []).find(
            unit => unit && unit.name === memory.关注对象 && isCombatUnitAbleToFight(unit),
          );
          if (target) return target;
          memory.关注对象 = '';
          memory.focus_reason = '';
          memory.focus_ttl = 0;
          return null;
        }

        function setActorFocusTarget(actor, target, reason = '', ttl = 2) {
          const memory = ensureActorDecisionMemory(actor);
          if (!target || Number(target.vit || 0) <= 0) {
            memory.关注对象 = '';
            memory.focus_reason = '';
            memory.focus_ttl = 0;
            return;
          }
          memory.关注对象 = target.name || '';
          memory.focus_reason = String(reason || '');
          memory.focus_ttl = Math.max(0, Number(ttl || 0));
        }

        function scoreCandidateAction(actor, target, battleState, candidate) {
          if (!candidate) return 0;
          const memory = ensureActorDecisionMemory(actor);
          const branchName = candidate.name || '未命名动作';
          let weight = Math.max(0, Math.floor(candidate.weight || 0));

          const repeatCount = memory.recent_actions[branchName] || 0;
          if (repeatCount > 0) weight -= repeatCount * 12;
          if (memory.last_action === branchName) weight -= 8;

          const targetHpRatio = (target?.vit || 0) / Math.max(1, target?.vit_max || 1);
          if (Number(memory.focus_ttl || 0) > 0) {
            if (
              branchName === '乘胜追击' &&
              ['control_window', 'dot_pressure', 'shared_vision_focus', 'finisher'].includes(memory.focus_reason)
            )
              weight += 10;
            if (branchName === '破防强攻' && memory.focus_reason === 'armor_break_window') weight += 8;
            if (branchName === '断疗压制' && memory.focus_reason === 'anti_heal_window') weight += 8;
          }
          if (branchName === '强势对轰' && targetHpRatio < 0.35) weight += 10;
          if (branchName === '亡命奔逃' && (actor?.vit || 0) / Math.max(1, actor?.vit_max || 1) > 0.35) weight -= 15;
          if (branchName === '危机自保' && battleState?.isChargingHighThreat) weight += 8;

          return Math.max(0, weight);
        }

        function chooseActorActionByCandidates(actor, target, battleState, candidates, phaseLabel) {
          const scoredCandidates = (candidates || []).map(candidate => ({
            ...candidate,
            weight: scoreCandidateAction(actor, target, battleState, candidate),
          }));
          return rollBranchByPriority(scoredCandidates, phaseLabel);
        }

        function getActorSkillCounterPenalty(actor, skillName) {
          if (!actor || !skillName) return 0;
          const memory = ensureActorDecisionMemory(actor);
          return Math.min(45, Number(memory.countered_skills?.[skillName] || 0) * 18);
        }

        function recordActorActionMemory(actor, actionName) {
          if (!actor || !actionName) return;
          const memory = ensureActorDecisionMemory(actor);
          Object.keys(memory.recent_actions).forEach(key => {
            memory.recent_actions[key] = Math.max(0, (memory.recent_actions[key] || 0) - 1);
            if (memory.recent_actions[key] <= 0) delete memory.recent_actions[key];
          });
          if (Number(memory.focus_ttl || 0) > 0) {
            memory.focus_ttl = Math.max(0, Number(memory.focus_ttl || 0) - 1);
            if (memory.focus_ttl <= 0) {
              memory.关注对象 = '';
              memory.focus_reason = '';
            }
          }
          Object.keys(memory.countered_skills || {}).forEach(key => {
            memory.countered_skills[key] = Math.max(0, Number(memory.countered_skills[key] || 0) - 1);
            if (memory.countered_skills[key] <= 0) delete memory.countered_skills[key];
          });
          memory.recent_actions[actionName] = (memory.recent_actions[actionName] || 0) + 2;
          memory.last_action = actionName;
        }

        function recordActorSkillCountered(actor, skillName, reason = '') {
          if (!actor || !skillName) return;
          const memory = ensureActorDecisionMemory(actor);
          memory.countered_skills[skillName] = Math.min(3, Number(memory.countered_skills[skillName] || 0) + 1);
          if (reason) memory.last_counter_reason = String(reason);
        }

        function broadcastActorFocusToTeam(actorEntry, battleState, target, reason = '', ttl = 2) {
          if (!actorEntry?.char || !battleState?.combatData || !target) return;
          const team =
            actorEntry.side === 'player'
              ? battleState.combatData.参战者.team_player || []
              : battleState.combatData.参战者.team_enemy || [];
          team.forEach(member => {
            if (!member || member.name === actorEntry.char.name) return;
            setActorFocusTarget(member, target, reason, Math.max(1, Number(ttl || 0) - 1));
          });
        }

        function evaluateActionCountered(action, finalTarget, reactionAction, settleResult, skillTargetObj = '') {
          if (!action?.skill || !finalTarget) return false;
          if (
            String(skillTargetObj || '').includes('己方') ||
            String(skillTargetObj || '').includes('友方') ||
            String(skillTargetObj || '').includes('自身')
          )
            return false;
          const skillType = getSkillType(action.skill);
          const snapshot = buildConditionTacticalSnapshot(finalTarget);
          const resultText = String(settleResult?.desc || '');
          if (skillType === '输出') {
            return (
              Number(settleResult?.dmg || 0) <= 1 &&
              (reactionAction?.type !== '无法反应' || /躲过|规避|挡下|碾碎|打断|未破防/.test(resultText))
            );
          }
          if (skillType === '控制') {
            const landed = snapshot.isLockedOrControlled || snapshot.hasBadCondition || snapshot.hasAntiHeal;
            return !landed && (reactionAction?.type !== '无法反应' || /免疫|躲过|规避|挡下/.test(resultText));
          }
          return false;
        }

        function updateActorFocusFromAction(
          actor,
          action,
          finalTarget,
          fallbackEnemyTarget = null,
          settleResult = null,
        ) {
          if (!actor || !action) return null;
          const skill = action.skill || {};
          const targetMode = getSkillTarget(skill);
          let focusTarget = null;
          let focusReason = '';
          let ttl = 0;

          if (targetMode.includes('己方') || targetMode.includes('友方')) {
            if (
              hasSkillMechanism(skill, ['共享视野']) &&
              fallbackEnemyTarget &&
              Number(fallbackEnemyTarget.vit || 0) > 0
            ) {
              focusTarget = fallbackEnemyTarget;
              focusReason = 'shared_vision_focus';
              ttl = 3;
            }
          } else if (
            !targetMode.includes('自身') &&
            finalTarget &&
            finalTarget !== actor &&
            Number(finalTarget.vit || 0) > 0
          ) {
            const snapshot = buildConditionTacticalSnapshot(finalTarget);
            const hpRatio = Math.max(0, Number(finalTarget.vit || 0)) / Math.max(1, Number(finalTarget.vit_max || 1));
            focusTarget = finalTarget;
            if (
              snapshot.isLockedOrControlled &&
              (hasSkillMechanism(skill, [
                '硬控',
                '催眠',
                '幻境',
                '标记锁定',
                '打断',
                '软控',
                '位移限制',
                '强制位移',
                '位移交换',
                '强制绑定/锁定',
              ]) ||
                Number(getPrimaryStateCalc(skill)?.lock_level || 0) > 0 ||
                Number(getPrimaryStateCalc(skill)?.reaction_penalty || 0) > 0 ||
                Number(getPrimaryStateCalc(skill)?.cast_speed_penalty || 0) > 0 ||
                Number(getPrimaryStateCalc(skill)?.dodge_penalty || 0) > 0 ||
                Number(getPrimaryStateCalc(skill)?.resource_block_ratio || 0) > 0)
            ) {
              focusReason = 'control_window';
              ttl = 3;
            } else if (
              hasSkillMechanism(skill, ['禁疗']) &&
              (snapshot.hasAntiHeal || Number(getPrimaryStateCalc(skill)?.heal_block_ratio || 0) > 0)
            ) {
              focusReason = 'anti_heal_window';
              ttl = 3;
            } else if (
              Number(getPrimaryDamageEffect(skill)?.穿透修饰 || 0) >= 15 ||
              /破甲|穿透|粉碎/.test(String(skill?.name || ''))
            ) {
              focusReason = 'armor_break_window';
              ttl = 2;
            } else if (
              snapshot.hasDotPressure ||
              hasSkillMechanism(skill, ['持续伤害']) ||
              Number(settleResult?.dmg || 0) >= Math.max(1, Number(finalTarget.vit_max || 1)) * 0.22
            )
              focusReason = 'dot_pressure';
            ttl = 2;
          } else if (hasSkillMechanism(skill, ['斩杀补伤']) || hpRatio < 0.45) {
            focusReason = 'finisher';
            ttl = hpRatio < 0.35 ? 3 : 2;
          }
        setActorFocusTarget(actor, focusTarget, focusReason, ttl);
        return { target: focusTarget, reason: focusReason, ttl };
      }

      function buildBattleStateContext(actor, target, combatData, extra = {}) {
        const canFlee = combatData?.允许撤离 !== false;
        const isDesperateNoEscape = (actor?.vit || 0) < (actor?.vit_max || 1) * 0.3 && !canFlee;
        return {
          combatType: combatData?.战斗类型 || '突发遭遇',
          isDeadlyFight:
            extra.isDeadlyFight ??
            ((combatData?.战斗类型 || '突发遭遇') === '死战' ||
              (combatData?.战斗类型 || '突发遭遇') === '突发遭遇'),
          ratio: extra.ratio ?? 1,
          playerPower: extra.playerPower ?? 0,
          isChargingHighThreat: !!extra.isChargingHighThreat,
          actorHpRatio: (actor?.vit || 0) / Math.max(1, actor?.vit_max || 1),
          targetHpRatio: (target?.vit || 0) / Math.max(1, target?.vit_max || 1),
          canFlee: canFlee,
          isDesperateNoEscape: isDesperateNoEscape,
          actor,
          target,
          combatData,
          ...extra,
        };
      }

      function normalizeBattleIntentMode(value) {
        const text = String(value || '').trim();
        if (['点到为止', '尽量生擒', '重伤压制', '必杀'].includes(text)) return text;
        return '点到为止';
      }

      function getBattleRelationRestraintFactor(attacker, target) {
        const attackerName = String(attacker?.name || '').trim();
        const relationMap = attacker?.社交?.关系 && typeof attacker.社交.关系 === 'object' ? attacker.社交.关系 : {};
        const relationData = relationMap[target?.name] || relationMap[attackerName] || {};
        const relationText = String(relationData?.关系 || '').trim();
        if (/恋人|生死之交|挚友/.test(relationText)) return 1.0;
        if (/亲密/.test(relationText)) return 0.82;
        if (/朋友/.test(relationText)) return 0.68;
        if (/认识/.test(relationText)) return 0.55;
        if (/敌视/.test(relationText)) return 0.18;
        if (/仇敌/.test(relationText)) return 0.05;
        return 0.4;
      }

      function getBattleEnvironmentSafetyFactor(combatData = {}) {
        const env = String(combatData?.环境 || '').trim();
        let score = 0.35;
        if (/试炼馆|斗魂场|演武|擂台|学院|城|塔|馆/.test(env)) score += 0.35;
        if (/荒野|黑市|深海|核心区|伏击|追杀/.test(env)) score -= 0.25;
        return Math.max(0, Math.min(1, score));
      }

      function getBattlePowerGapFactor(attacker, target) {
        const keys = ['力量', '防御', '敏捷', '体力上限', '精神力上限'];
        const diffs = keys.map(key => {
          const left = Math.max(1, Number(attacker?.[key] || attacker?.属性?.[key] || 1));
          const right = Math.max(1, Number(target?.[key] || target?.属性?.[key] || 1));
          return Math.abs(left - right) / Math.max(left, right, 1);
        });
        const avg = diffs.reduce((sum, value) => sum + value, 0) / Math.max(1, diffs.length);
        return Math.max(0, Math.min(1, avg));
      }

      function getBattleDesperationFactor(attacker) {
        const hpRatio = getCombatHpRatio(attacker);
        const staRatio = getCombatStaminaRatio(attacker);
        const score = ((1 - hpRatio) * 0.45) + ((1 - staRatio) * 0.55);
        return Math.max(0, Math.min(1, score));
      }

      function buildHpSuggestionPayload(attacker, defender, combatData, appliedDamage = 0) {
        const intentMode = normalizeBattleIntentMode(combatData?.战斗意图);
        const relationFactor = getBattleRelationRestraintFactor(attacker, defender);
        const environmentFactor = getBattleEnvironmentSafetyFactor(combatData);
        const powerGapFactor = getBattlePowerGapFactor(attacker, defender);
        const desperationFactor = getBattleDesperationFactor(attacker);
        const targetHpMax = getCombatHpMaxValue(defender);
        const targetHpCurrent = getCombatHpValue(defender);
        const controlScore = Math.max(0, Math.min(1, relationFactor * 0.45 + environmentFactor * 0.35 + powerGapFactor * 0.2 - desperationFactor * 0.35));
        let range = [0.01, 0.08];
        let suggestedResult = '重伤压制';
        if (intentMode === '尽量生擒') {
          range = controlScore >= 0.6 ? [0.2, 0.4] : [0.12, 0.28];
          suggestedResult = controlScore >= 0.58 ? '生擒制服' : '外界中断';
        } else if (intentMode === '重伤压制') {
          range = controlScore >= 0.6 ? [0.12, 0.24] : [0.05, 0.16];
          suggestedResult = '重伤压制';
        } else if (intentMode === '必杀') {
          range = [0, 0.15];
          suggestedResult = '致死确认';
        } else if (controlScore >= 0.75) {
          range = [0.35, 0.55];
          suggestedResult = '点到为止';
        } else if (controlScore >= 0.45) {
          range = [0.18, 0.35];
          suggestedResult = '点到为止';
        } else if (controlScore >= 0.2) {
          range = [0.08, 0.18];
          suggestedResult = '外界中断';
        }
        if (intentMode !== '必杀' && targetHpCurrent <= Math.ceil(targetHpMax * range[0])) {
          suggestedResult = intentMode === '尽量生擒' ? '生擒制服' : '点到为止';
        }
        const recommendedEndHp = Math.max(0, Math.min(targetHpCurrent, Math.round(targetHpMax * ((range[0] + range[1]) / 2))));
        const expectedDamage = Math.max(0, Math.max(Math.round(appliedDamage || 0), targetHpCurrent - recommendedEndHp));
        const desperationLevel = desperationFactor >= 0.75 ? '几乎失控' : desperationFactor >= 0.45 ? '失手偏高' : '稳住';
        return {
          建议终点HP区间: `${Math.round(range[0] * 100)}% - ${Math.round(range[1] * 100)}%`,
          前端推荐终点HP: recommendedEndHp,
          预计HP伤害: expectedDamage,
          前端建议结果: suggestedResult,
          裁断约束: {
            可致死: intentMode === '必杀',
            可外界介入: environmentFactor >= 0.55 || relationFactor >= 0.58,
            关系收手系数: Number(relationFactor.toFixed(3)),
            场地安全系数: Number(environmentFactor.toFixed(3)),
            实力差距系数: Number(powerGapFactor.toFixed(3)),
            绝境失手系数: Number(desperationFactor.toFixed(3)),
            失手等级: desperationLevel,
          },
        };
      }

      function chooseAndBuildActorAction(actor, target, battleState, candidates, phaseLabel, logPrefix = '') {
        const choice = chooseActorActionByCandidates(actor, target, battleState, candidates, phaseLabel);
        if (!choice.option) return null;

        const action = choice.option.build();
        recordActorActionMemory(actor, choice.option.name || action.type);
        action.log = `${logPrefix}${choice.trace} ${action.log}`.trim();
        return action;
      }

      function clearCombatAdjudicationHints(combatData) {
        if (!combatData || typeof combatData !== 'object') return;
        delete combatData.阶段;
        delete combatData.裁断约束;
        delete combatData.前端建议结果;
        delete combatData.建议终点HP区间;
        delete combatData.前端推荐终点HP;
        delete combatData.预计HP伤害;
        delete combatData.本次操作;
      }

      function normalizeSoulTowerPendingSettlement(settlement = {}) {
        if (!settlement || typeof settlement !== 'object' || Array.isArray(settlement)) return null;
        const floor = Math.max(0, Math.floor(Number(settlement.层数 || 0)));
        const spirit = normalizeSoulTowerDiscountSpiritRecord(settlement.五折魂灵 || {});
        if (!(floor > 0 && spirit.层数 > 0)) return null;
        return {
          状态: '待选择',
          层数: floor,
          区域标签: String(settlement.区域标签 || '').trim() || getSoulTowerGateMeta(floor).gateLabel,
          区间标签: String(settlement.区间标签 || '').trim() || getSoulTowerGateMeta(floor).gateRangeLabel,
          守塔名称: String(settlement.守塔名称 || '').trim() || spirit.名称 || `${spirit.标准物种}守塔魂兽`,
          五折魂灵: spirit,
          下一层: Math.min(SOUL_TOWER_TOTAL_FLOORS, Math.max(floor + 1, Math.floor(Number(settlement.下一层 || floor + 1)))),
          可继续: settlement.可继续 !== false && floor < SOUL_TOWER_TOTAL_FLOORS,
        };
      }

      function hasSoulTowerPendingSettlement(combatData = {}) {
        return !!normalizeSoulTowerPendingSettlement(combatData?.魂灵塔待结算);
      }

      function buildSoulTowerPendingSettlement(combatData = {}, defender = null) {
        const floor = Math.max(1, Math.floor(Number(combatData?.floor || 1)));
        const meta = getSoulTowerGateMeta(floor);
        const spiritRecord = buildSoulTowerDiscountSpiritRecordFromGuardian(defender, floor);
        if (!(spiritRecord.层数 > 0)) return null;
        return {
          状态: '待选择',
          层数: floor,
          区域标签: meta.gateLabel,
          区间标签: meta.gateRangeLabel,
          守塔名称: String(defender?.name || spiritRecord.名称 || '守塔魂兽').trim() || '守塔魂兽',
          五折魂灵: spiritRecord,
          下一层: Math.min(SOUL_TOWER_TOTAL_FLOORS, floor + 1),
          可继续: floor < SOUL_TOWER_TOTAL_FLOORS,
        };
      }

      function collectCombatSkills(charData, alliedTeam = []) {
        return collectUnifiedSkillEntries(charData, alliedTeam, { includePassive: false, includeActive: true });
      }

      function getBattleActionDisplayName(action) {
        const skill = action?.skill && typeof action.skill === 'object' ? action.skill : {};
        return String(
          skill.魂技名 ||
            skill.name ||
            skill.技能名称 ||
            action?.name ||
            action?.action_type ||
            action?.type ||
            '战斗行动',
        ).trim();
      }

      function shouldShowBattleActionTarget(action) {
        const skill = action?.skill && typeof action.skill === 'object' ? action.skill : {};
        const actionType = String(action?.action_type || action?.type || '');
        const skillTargetText = String(
          getSkillTarget(skill) ||
            skill.目标 ||
            skill.对象 ||
            (Array.isArray(skill._效果数组)
              ? skill._效果数组.map(effect => `${effect?.目标 || ''}${effect?.对象 || ''}`).join(' ')
              : ''),
        );
        if (/防御|闪避|撤离|治疗|回复|恢复|造物|食物/.test(actionType) && !/攻击|伤害/.test(actionType)) return false;
        if (/自身|己方|友方|食用者/.test(skillTargetText) && !/敌|对手/.test(skillTargetText)) return false;
        return true;
      }

      function buildVisibleBattlePlayerInput(rawInput, action, combatData) {
        const name = getBattleActionDisplayName(action);
        const fallbackTarget =
          action?.target_name ||
          combatData?.参战者?.enemy?.name ||
          window.BattleUIBridge?.getMVU?.('world.战斗.参战者.enemy.name') ||
          '';
        if (shouldShowBattleActionTarget(action) && fallbackTarget) return `对【${fallbackTarget}】使用【${name}】。`;
        if (/防御|闪避|撤离/.test(name)) return `执行【${name}】。`;
        return `使用【${name}】。`;
      }

      function resolvePassivePlayerStance(playerAction, npcAction) {
        const actionName = String(
          playerAction?.action_type || playerAction?.skill?.name || playerAction?.skill?.魂技名 || '防御',
        );
        const npcSkill = npcAction?.skill || null;
        const npcSkillType = getSkillType(npcSkill);
        const npcMainType = inferMainTypeFromEffects(npcSkill);
        const npcIsHostile =
          npcAction?.type === '强势对轰' ||
          npcSkillType === '输出' ||
          npcMainType === '伤害类' ||
          hasSkillMechanism(npcSkill, ['直接伤害', '多段伤害', '持续伤害', '延迟爆发', '斩杀补伤']);

        if (/防御/.test(actionName)) {
          return {
            dmg: 0,
            desc: npcIsHostile
              ? '[守势成立] 玩家没有主动出手，而是稳住架势硬接试探，成功守住了这一轮攻势。'
              : '[守势对峙] 玩家摆出防御姿态，双方短暂拉扯，谁都没有真正打出有效战果。',
            extraPatchOps: [],
          };
        }

        if (/闪避/.test(actionName)) {
          return {
            dmg: 0,
            desc: npcIsHostile
              ? '[闪避成立] 玩家没有主动出手，而是借身法拉开步点，避开了这次试探性压迫。'
              : '[游走观察] 玩家保持闪避姿态，双方都在试探彼此的节奏。',
            extraPatchOps: [],
          };
        }

        if (/撤离/.test(actionName)) {
          return {
            dmg: 0,
            desc: '[脱离尝试] 玩家没有继续交锋，而是主动寻找脱离战圈的机会，本回合未形成正面碰撞。',
            extraPatchOps: [],
          };
        }

        return {
          dmg: 0,
          desc: '[守势维持] 玩家本回合没有主动出手，战局进入短暂对峙。',
          extraPatchOps: [],
        };
      }

      function onPlayerAttack(playerInput, options = {}) {
        let combatData = window.BattleUIBridge?.getMVU('world.战斗');
        hydrateCombatData(combatData);
        let defender = combatData.参战者.enemy;
        let attacker = combatData.参战者.player;
        syncCombatActionState(attacker);
        syncCombatActionState(defender);
        const mode = options.mode === 'multi_round' ? 'multi_round' : 'single_round';
        const modeLabel = mode === 'multi_round' ? '自动续推' : '单回合';
        const maxRounds = mode === 'multi_round' ? 4 : 1;
        combatData.战斗意图 = normalizeBattleIntentMode(options.intentMode || combatData.战斗意图 || '点到为止');

        // --- 第一步：环境定调与状态快照 ---
        // 1. 状态快照与控制拦截 (完全基于 Schema 属性驱动)
        defender.is_controlled = false;
        defender.temp_agi_mult = 1.0;
        defender.temp_reaction_bonus = 0;
        defender.temp_reaction_penalty = 0;
        defender.temp_dodge_bonus = 0;
        defender.temp_dodge_penalty = 0;
        defender.temp_lock_level = 0;
        defender.temp_control_resist_mult = 1.0;
        defender.temp_cannot_react = false;

        if (defender.状态效果) {
          for (let key in defender.状态效果) {
            let cond = defender.状态效果[key];
            const ce = cond.战斗效果 || {};
            if (ce.skip_turn === true || ce.cannot_react === true) {
              defender.is_controlled = true;
            }
            if (cond.面板修改比例 && cond.面板修改比例.agi !== undefined) {
              defender.temp_agi_mult *= cond.面板修改比例.agi;
            }
            defender.temp_reaction_bonus += Number(ce.reaction_bonus || 0);
            defender.temp_reaction_penalty += Number(ce.reaction_penalty || 0);
            defender.temp_dodge_bonus += Number(ce.dodge_bonus || 0);
            defender.temp_dodge_penalty += Number(ce.dodge_penalty || 0);
            defender.temp_lock_level += Number(ce.lock_level || 0);
            defender.temp_control_resist_mult *= Number(ce.control_resist_mult || 1.0);
            if (ce.cannot_react === true) defender.temp_cannot_react = true;
          }
        }
        defender.temp_agi_mult = Math.max(0.1, defender.temp_agi_mult);

        let roundCount = 0;
        const battleLog = [];
        let clashExtraPatchOps = [];
        let continueSimulation = true;
        let visiblePlayerInput = '';

        while (
          roundCount < maxRounds &&
          continueSimulation &&
          isCombatUnitAbleToFight(attacker) &&
          isCombatUnitAbleToFight(defender)
        ) {
          roundCount++;
          let roundLog = `[第${roundCount}回合] `;

          let isCharging = attacker.蓄力技能 != null;
          let playerAction = null;

          // 1. 玩家硬控拦截扫描
          let isPlayerControlled = false;
          if (attacker.状态效果) {
            for (let key in attacker.状态效果) {
              if (
                attacker.状态效果[key].战斗效果 &&
                attacker.状态效果[key].战斗效果.skip_turn === true
              ) {
                isPlayerControlled = true;
                break;
              }
            }
          }

          if (isPlayerControlled) {
            roundLog += `[状态受控] 玩家处于硬控状态，本回合无法动作！ `;
            playerAction = { action_type: '被控挨打', cast_time: 100, skill: null };
            attacker.蓄力技能 = null;
          } else if (isCharging) {
            playerAction = attacker.蓄力技能;
            if (playerAction.cast_time <= 40) {
              roundLog += `[蓄力完成] 玩家完成了蓄力，释放了[${playerAction.skill.name}]！ `;
              attacker.蓄力技能 = null;
            } else {
              playerAction.cast_time -= 30;
              roundLog += `[蓄力中] 玩家正在为[${playerAction.skill.name}]蓄力，当前剩余前摇：${playerAction.cast_time}。本回合无法动作！ `;
              playerAction = { action_type: '蓄力挨打', cast_time: 100, skill: null };
            }
          } else {
            playerAction = parsePlayerIntent(playerInput);
            if (!visiblePlayerInput) visiblePlayerInput = buildVisibleBattlePlayerInput(playerInput, playerAction, combatData);

            // 💥【终极动作序列时间片机制】一回合能做出的总行动上限为 cast_time = 40！
            let totalTimeCost = 0;
            let validPreActions = [];
            let carryOverAction = null;

            // 1. 先把预先声明的副动作逐个填入时间槽
            if (playerAction.pre_actions && playerAction.pre_actions.length > 0) {
              for (let i = 0; i < playerAction.pre_actions.length; i++) {
                let pa = playerAction.pre_actions[i];
                if (totalTimeCost + pa.cast_time <= 40) {
                  totalTimeCost += pa.cast_time;
                  validPreActions.push(pa);
                } else {
                  // 只要超了40，后面所有的动作（包括没放出来的副动作和主动作）全部转为蓄力拖延到下一回合
                  carryOverAction = pa;
                  carryOverAction.cast_time -= Math.max(0, 40 - totalTimeCost);
                  break;
                }
              }
            }

            // 2. 如果副动作还没爆表，轮到尝试塞入主动作
            if (!carryOverAction) {
              if (totalTimeCost + playerAction.cast_time <= 40) {
                totalTimeCost += playerAction.cast_time;
                // 全套连招完成！顺利打出！
              } else {
                // 主动作超时了，转为蓄力
                carryOverAction = playerAction;
                carryOverAction.cast_time -= Math.max(0, 40 - totalTimeCost);
              }
            }

            // 执行成功挤入本回合时间片的副动作
            validPreActions.forEach(preAct => {
              let preCostLog = applyActionCost(attacker, preAct);
              if (preCostLog) roundLog += preCostLog + ' ';
              if (preAct.action_type === '穿戴装备') {
                attacker.装备[preAct.equip_target === 'armor' ? '斗铠' : '机甲'].装备状态 = '已装备';
                roundLog += `[连招生效] 玩家在电光火石间成功穿戴了${preAct.equip_target === 'armor' ? '斗铠' : '机甲'}！ `;
              }
            });
            // 为了让后续流程还能认得出主动作，必须将原本的 pre_actions 覆写为实际生效的这几个
            playerAction.pre_actions = validPreActions;

            // 3. 判定本回合到底是出手，还是蓄力挨打
            if (carryOverAction) {
              attacker.蓄力技能 = carryOverAction;
              roundLog += `[连招中断/转蓄力] 动作太过繁琐或前摇过长！玩家开始为[${carryOverAction.skill?.name || carryOverAction.action_type}]进行蓄力准备，当前剩余前摇：${carryOverAction.cast_time}。本回合失去主攻击机会！ `;
              // 主动作被没收，变成了“蓄力挨打”态，用来触发后续的防御与闪避博弈
              playerAction = { action_type: '蓄力挨打', cast_time: 100, skill: null };
            } else {
              if (playerAction.action_type !== '施法失败') {
                let costLog = applyActionCost(attacker, playerAction);
                if (costLog) roundLog += costLog + ' ';
              }
            }
          }

          const reactionRatio = calculateReactionRatio(attacker, defender, playerAction, combatData);
          const npcAction = determineNpcAction(combatData, playerAction, reactionRatio);
          const isPassivePlayerTurn = ['防御', '闪避', '撤离'].includes(String(playerAction?.action_type || ''));
          let settleResult = isPassivePlayerTurn
            ? resolvePassivePlayerStance(playerAction, npcAction)
            : executeClash(playerAction, npcAction, combatData);
          roundLog += npcAction.log + ' ' + settleResult.desc;
          if (Array.isArray(settleResult.extraPatchOps) && settleResult.extraPatchOps.length)
            clashExtraPatchOps.push(...settleResult.extraPatchOps);

          if (attacker.蓄力技能 != null) {
            let damageRatio = Number(settleResult.totalProjectedDamage || settleResult.dmg || 0) / attacker.vit_max;
            let isControlled = attacker.状态效果 && attacker.状态效果['眩晕'];

            let hasSuperArmor = false;
            if (attacker.状态效果) {
              for (let key in attacker.状态效果) {
                if (
                  attacker.状态效果[key].战斗效果?.super_armor === true ||
                  key.includes('霸体') ||
                  key.includes('真身')
                )
                  hasSuperArmor = true;
              }
            }

            const npcSkillType = getSkillType(npcAction.skill);
            if (npcAction.type === '危机自保' && npcSkillType === '控制' && getSkillCastTime(npcAction.skill) < 10) {
              if (defender.men_max > attacker.men_max || defender.agi > attacker.agi) {
                if (hasSuperArmor) {
                  roundLog += ` NPC释放[${npcAction.skill.name}]试图打断，但玩家处于霸体状态，强行免疫了控制！`;
                } else {
                  let backlashDmg = Math.floor(attacker.vit_max * 0.05);
                  attacker.vit -= backlashDmg;
                  if (!attacker.状态效果) attacker.状态效果 = {};
                  attacker.状态效果['僵直'] = {
                    类型: 'debuff',
                    层数: 1,
                    描述: '施法被打断的反噬',
                    duration: 1,
                    面板修改比例: { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 },
                    战斗效果: { skip_turn: true, dot_damage: 0, armor_pen: 0 },
                  };
                  roundLog += ` NPC释放[${npcAction.skill.name}]成功打断玩家施法！玩家遭到反噬，承受 ${backlashDmg} 点真伤并陷入[僵直]！`;
                  attacker.蓄力技能 = null;
                  let attackerUpkeep = settleSustainEffectsAtRoundEnd(attacker, '玩家');
                  let defenderUpkeep = settleSustainEffectsAtRoundEnd(defender, 'NPC');
                  if (attackerUpkeep.log) roundLog += ` ${attackerUpkeep.log}`;
                  if (defenderUpkeep.log) roundLog += ` ${defenderUpkeep.log}`;
                  let attackerRoundEnd = settleConditionsAtRoundEnd(attacker, '玩家');
                  let defenderRoundEnd = settleConditionsAtRoundEnd(defender, 'NPC');
                  if (attackerRoundEnd.log) roundLog += ` ${attackerRoundEnd.log}`;
                  if (defenderRoundEnd.log) roundLog += ` ${defenderRoundEnd.log}`;
                  syncCombatActionState(attacker);
                  syncCombatActionState(defender);
                  if (!isCombatUnitAbleToFight(attacker) || !isCombatUnitAbleToFight(defender))
                    continueSimulation = false;
                  battleLog.push(roundLog);
                  continue;
                }
              }
            }

            if (!hasSuperArmor && (damageRatio >= 0.3 || isControlled)) {
              roundLog += ` [蓄力打断] 玩家受到重创或硬控，蓄力被强制打断！`;
              attacker.蓄力技能 = null;
            } else if (hasSuperArmor && isControlled) {
              roundLog += ` [霸体强抗] 玩家遭遇硬控，但凭借霸体强行稳住阵脚，蓄力继续！`;
              delete attacker.状态效果['眩晕'];
            }
          }

          // 简单判断 NPC 是否被打断 (如果玩家伤害极高或带有硬控，视为打断)
          const playerStateCalc = getPrimaryStateCalc(playerAction.skill);
          const playerInterruptChance = Math.max(
            Number(getSkillEffects(playerAction.skill).find(e => e?.机制 === '打断')?.中断概率 || 0),
            Number(getFusionScaledInterruptChance(playerAction.skill) || 0),
          );
          let isNpcInterrupted =
            playerStateCalc.skip_turn === true ||
            getPrimaryStateFlags(playerAction.skill).includes('硬控') ||
            (playerInterruptChance > 0 && Math.random() <= Math.min(1, playerInterruptChance)) ||
            (Number(settleResult.interrupt_bonus || 0) > 0 &&
              Math.random() <= Math.min(1, Number(settleResult.interrupt_bonus || 0)));

          // --- 第四步：打击烈度与破防标尺 ---
          const damagePackage = applyResolvedDamagePackage(attacker, playerAction, settleResult, {
            primaryTarget: defender,
            combatData,
          });
          let appliedDamage = damagePackage.primaryAppliedDamage;
          if (damagePackage.log) roundLog += ` ${damagePackage.log}`;
          isNpcInterrupted = isNpcInterrupted || appliedDamage / Math.max(1, defender.vit_max) >= 0.15;
          if (npcAction.type === '穿戴装备') {
            if (!isNpcInterrupted) {
              defender.装备[npcAction.skill.equip_target === 'armor' ? '斗铠' : '机甲'].装备状态 = '已装备';
              roundLog += ` [装备生效] NPC成功穿戴了${npcAction.skill.equip_target === 'armor' ? '斗铠' : '机甲'}，防御力大增！`;
            } else {
              roundLog += ` [穿戴失败] 玩家的猛烈攻击强行打断了NPC的装备穿戴过程！`;
            }
          }
          const fusionAftermathLog = applyFusionActionAftermath(attacker, playerAction, combatData);
          if (fusionAftermathLog) roundLog += ` ${fusionAftermathLog}`;

          // --- 第五步：装备护主与战损结算 ---
          let combatType = combatData.战斗类型 || '突发遭遇';

          if (defender.vit < defender.vit_max * 0.1) {
            let hasMech = defender.装备?.机甲?.等级 !== '无' && defender.装备?.机甲?.状态 !== '重创';
            let hasArmor = defender.装备?.斗铠?.装备状态 === '已装备';

            if (combatType === '擂台切磋' && defender.vit <= defender.vit_max * 0.05) {
              defender.vit = Math.floor(defender.vit_max * 0.05); // 强制锁血 5%
              roundLog += ` [擂台保护] 胜负已分！裁判强行介入，终止了致命一击！`;
              continueSimulation = false; // 强制结束战斗
            } else if (hasMech || hasArmor) {
              defender.vit = Math.floor(defender.vit_max * 0.1);
              let armorLog = applyArmorDamage(defender);
              roundLog += ` [装备护主] 致命打击触发替死锁血！NPC HP强制锁定在10%！${armorLog}`;
            } else if (combatType === '升灵台虚拟战斗' || combatType === '魂灵塔冲塔') {
              // 虚拟战斗中，敌方体力归零照常死亡，如果是己方或判定特殊保护，需要锁定体力并标记退出
              let saveLog = triggerDeathSave(defender);
              if (saveLog) {
                defender.vit = Math.floor(defender.vit_max * 0.1);
                roundLog += ` ${saveLog}`;
              } else {
                // 虚拟环境，如果是玩家/模拟死亡也是正常走到 vit <= 0，靠 settleBattle 拦截
              }
            } else {
              let saveLog = triggerDeathSave(defender);
              if (saveLog) {
                defender.vit = Math.floor(defender.vit_max * 0.1);
                roundLog += ` ${saveLog}`;
              }
            }
          }

          let attackerUpkeep = settleSustainEffectsAtRoundEnd(attacker, '玩家');
          let defenderUpkeep = settleSustainEffectsAtRoundEnd(defender, 'NPC');
          if (attackerUpkeep.log) roundLog += ` ${attackerUpkeep.log}`;
          if (defenderUpkeep.log) roundLog += ` ${defenderUpkeep.log}`;

          let attackerRoundEnd = settleConditionsAtRoundEnd(attacker, '玩家');
          let defenderRoundEnd = settleConditionsAtRoundEnd(defender, 'NPC');
          if (attackerRoundEnd.log) roundLog += ` ${attackerRoundEnd.log}`;
          if (defenderRoundEnd.log) roundLog += ` ${defenderRoundEnd.log}`;

          syncCombatActionState(attacker);
          syncCombatActionState(defender);
          if (!isCombatUnitAbleToFight(attacker) || !isCombatUnitAbleToFight(defender)) {
            if (isCombatUnitAlive(attacker) && !isCombatUnitAbleToFight(attacker))
              roundLog += ` [体力耗尽] 玩家体力归零，陷入昏迷，无法继续行动。`;
            if (isCombatUnitAlive(defender) && !isCombatUnitAbleToFight(defender))
              roundLog += ` [体力耗尽] NPC体力归零，陷入昏迷，无法继续行动。`;
            continueSimulation = false;
          } else if (attacker.蓄力技能 == null) {
            if (mode === 'single_round') {
              continueSimulation = false;
              roundLog += ` [单回合仲裁] 当前模式为单回合，本次暗箱演算到此结束。`;
            } else {
              const continueThresholdReached = Number(settleResult.totalProjectedDamage || settleResult.dmg || 0) / Math.max(1, attacker.vit_max) >= 0.05;
              if (continueThresholdReached) {
                continueSimulation = false;
                roundLog += ` [续推终止] 本回合攻防烈度已达阈值，暗箱续推停止。`;
              } else {
                const continueRoll = Math.random();
                const continueHit = continueRoll < 0.7;
                continueSimulation = continueHit;
                roundLog += ` [续推判定] 本回合伤害未达阈值，触发70%概率续推。Roll:${continueRoll.toFixed(2)} 判定:${continueHit ? '继续' : '停止'}。`;
              }
            }
          }

          battleLog.push(roundLog);
        }

        const startingRound = Number(combatData.回合 || 0);
        combatData.回合 = startingRound + roundCount;
        syncCombatActionState(attacker);
        syncCombatActionState(defender);
        combatData.阶段 = !isCombatUnitAbleToFight(attacker) || !isCombatUnitAbleToFight(defender) ? '回合结算阶段' : '宣告阶段';
        const unresolvedReason =
          isCombatUnitAbleToFight(attacker) && isCombatUnitAbleToFight(defender)
            ? mode === 'single_round'
              ? 'single_round_limit'
              : 'simulation_stopped'
            : '';
        const battleOutcome = buildFrontEndBattleOutcome(attacker, defender, {
          unresolvedReason,
          formalEncounter: roundCount > 0,
        });
        let extraPatchOps = [];
        let settleResult = settleBattle(attacker, defender, battleOutcome, {
          mode,
          roundCount,
          maxRounds,
          unresolvedReason,
          combatData,
        });
        if (clashExtraPatchOps.length) extraPatchOps.push(...clashExtraPatchOps);
        if (settleResult.log) battleLog.push(settleResult.log);
        if (settleResult.extraPatchOps) extraPatchOps.push(...settleResult.extraPatchOps);
        const towerPendingSettlement =
          isSoulTowerCombatTypeValue(combatData?.战斗类型 || '') && battleOutcome.isVictory === true
            ? buildSoulTowerPendingSettlement(combatData, defender)
            : null;
        if (towerPendingSettlement) {
          combatData.魂灵塔待结算 = towerPendingSettlement;
          combatData.进行中 = true;
          combatData.裁断结果 = '';
          clearCombatAdjudicationHints(combatData);
          const pendingUpdate =
            window.BattleUIBridge?.persistCombatData?.(combatData, {
              analysis:
                'Frontend soul tower battle already reached a deterministic win state. Persist the pending settlement choice and wait for the player to choose whether to stop or continue.',
              extraPatchOps,
              syncHpRecoveryOnly: false,
            }) || null;
          return {
            intentText: visiblePlayerInput || String(playerInput || '战斗行动'),
            mode: 'tower_pending_choice',
            battleMode: mode,
            pendingSettlement: towerPendingSettlement,
            mvuUpdate: pendingUpdate,
          };
        }

        const hpSuggestion = buildHpSuggestionPayload(
          attacker,
          defender,
          combatData,
          Math.max(0, Number(settleResult?.dmg || 0)),
        );
        combatData.前端建议结果 = hpSuggestion.前端建议结果;
        combatData.裁断约束 = hpSuggestion.裁断约束;
        combatData.建议终点HP区间 = hpSuggestion.建议终点HP区间;
        combatData.前端推荐终点HP = hpSuggestion.前端推荐终点HP;
        combatData.预计HP伤害 = hpSuggestion.预计HP伤害;
        combatData.本次操作 = {
          批次ID: `battle-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          模式: mode,
          起始回合: startingRound + 1,
          结束回合: combatData.回合,
          玩家输入: String(visiblePlayerInput || playerInput || '战斗行动'),
          结算状态: `${battleOutcome.type}/pending_ai_confirm`,
          AI确认结果: '',
        };
        const mvuUpdate =
          window.BattleUIBridge?.persistCombatData?.(combatData, {
            analysis:
              'Frontend battle arbitration updates deterministic battle state changes (resource consumption, equipment/domain toggles, ongoing status effects, sustain effects, charging state and battle context), but does not directly settle final HP, survival or the final裁断结果. Let the plot continuation decide the terminal landing.',
            extraPatchOps,
            syncHpRecoveryOnly: false,
          }) || null;

        let systemPrompt = `<moduleSettlement>\n[battle_arbitration] 前端战斗模块已经完成本轮结算。正文只承接本次战报与结算结果，不要重新开启战斗模块，不要输出 <moduleIntent>、<UpdateVariable>、JSON、最小战斗种子或任何模块接管说明。\n</moduleSettlement>\n\n[前端暗箱演算完毕][${modeLabel}] 共进行 ${roundCount} 回合。\n战报：\n${battleLog.join('\n')}\n请严格根据战报描写画面！`;
        systemPrompt += `\n\n[前端战果类型]\n${battleOutcome.type}\n[前端战果说明]\n${battleOutcome.label}\n[战斗意图]\n${combatData.战斗意图}\n[前端建议结果]\n${combatData.前端建议结果}\n[建议终点HP区间]\n${combatData.建议终点HP区间}\n[前端推荐终点HP]\n${combatData.前端推荐终点HP}\n[预计HP伤害]\n${combatData.预计HP伤害}\n[裁断约束]\n可致死：${combatData.裁断约束?.可致死 ? '是' : '否'}；可外界介入：${combatData.裁断约束?.可外界介入 ? '是' : '否'}；关系收手系数：${combatData.裁断约束?.关系收手系数}；场地安全系数：${combatData.裁断约束?.场地安全系数}；实力差距系数：${combatData.裁断约束?.实力差距系数}；绝境失手系数：${combatData.裁断约束?.绝境失手系数}；失手等级：${combatData.裁断约束?.失手等级}\n前端只提供战报、约束与建议，不直接决定本轮是否结束战斗，也不直接落定双方最终HP/存活。请你根据战报、战斗意图、前端建议结果与建议终点HP区间，自行判断：1. 本轮是否结束战斗；2. 双方各自还剩多少HP；3. 是否产生击倒/制服/濒死压制/外界中断/强制撤离/致死确认。\n请按正常 MVU 变量维护写入你最终认可的结果：/char/${attacker.name}/属性/HP、/char/${attacker.name}/状态/存活、/char/${defender.name}/属性/HP、/char/${defender.name}/状态/存活、/char/${defender.name}/状态/受伤部位；若战斗应继续，保留 /world/战斗/进行中 = true；若战斗应结束，再写入 /world/战斗/裁断结果 并将 /world/战斗/进行中 设为 false。`;
        sendToAI(visiblePlayerInput || String(playerInput || '战斗行动').split('\n')[0] || '战斗行动', systemPrompt, {
          mvuUpdate,
          requestKind: 'battle_arbitration',
        });
        return {
          intentText: visiblePlayerInput || String(playerInput || '战斗行动'),
          mode: 'engine_arbitrated',
          battleMode: mode,
          aiRequest: root.__lastBattleAIRequest || null,
        };
      }

        root.BattleUIBridge = Object.assign(root.BattleUIBridge || {}, {
        __executePlayerBattleIntentImpl(playerInput, options = {}) {
          const battleMode = options.mode === 'multi_round' ? 'multi_round' : 'single_round';
          const result = onPlayerAttack(String(playerInput || ''), {
            mode: battleMode,
            intentMode: options.intentMode,
          });
          return result || {
            intentText: String(playerInput || ''),
            mode: 'engine_arbitrated',
            battleMode,
            aiRequest: root.__lastBattleAIRequest || null,
          };
        },
        __executeBattleFlowImpl(combatData, options = {}) {
          const state = root.BattleUI?.state || {};
          const actionList = [
            ...(state.selectedPreActions || []),
            state.selectedSkillActions?.[state.selectedSkillActions.length - 1] || state.selectedAction,
          ].filter(Boolean);
          const intentText =
            String(options.intentText || '').trim() ||
            String(root.BattleUI?.buildIntentText?.(actionList) || '').trim() ||
            String(root.__battleLastIntentText || '').trim();
          if (!intentText) throw new Error('battle_intent_empty');
          return root.BattleUIBridge.__executePlayerBattleIntentImpl(intentText, options);
        },
      });

      // ==========================================
      // 📍 2. 战前消耗与战后结算区 (彻底净化版)
      // ==========================================
      function findCombatUnitByName(combatData, rawName = '') {
        const wanted = String(rawName || '').trim();
        if (!combatData || !wanted) return null;
        const roster = [
          combatData?.参战者?.player,
          combatData?.参战者?.enemy,
          ...(combatData?.参战者?.team_player || []),
          ...(combatData?.参战者?.team_enemy || []),
        ].filter(Boolean);
        return roster.find(unit => String(unit?.name || '').trim() === wanted) || null;
      }

      function isCombatUnitIdentityMatch(unit, rawIdentity = '') {
        const wanted = String(rawIdentity || '').trim();
        if (!unit || !wanted) return false;
        const candidates = [
          unit.name,
          unit.名称,
          unit.charKey,
          unit.char_key,
          unit.key,
        ]
          .map(value => String(value || '').trim())
          .filter(Boolean);
        return candidates.includes(wanted);
      }

      function getCurrentBattleContextSnapshot() {
        return window.BattleUIBridge?.getBattleContext?.() || window.BattleUIBridge?.getMVU?.('world.战斗') || null;
      }

      function getBattleRosterUnits(combatData) {
        return [
          combatData?.参战者?.player,
          combatData?.参战者?.enemy,
          ...(combatData?.参战者?.team_player || []),
          ...(combatData?.参战者?.team_enemy || []),
        ].filter(Boolean);
      }

      function resolveFusionPartnerUnitsForSkill(skill = {}, alliedTeam = [], battleContext = null, actorRef = null) {
        const partnerNames = Array.isArray(skill?.__fusion_partner_names) ? skill.__fusion_partner_names : [];
        if (!partnerNames.length) return [];
        const roster = [
          ...(Array.isArray(alliedTeam) ? alliedTeam : []),
          ...getBattleRosterUnits(battleContext || getCurrentBattleContextSnapshot()),
        ].filter(Boolean);
        const actorName = String(actorRef?.name || actorRef?.名称 || actorRef?.charKey || '').trim();
        const matchedUnits = [];
        partnerNames.forEach(partnerName => {
          const unit = roster.find(candidate => {
            if (!candidate) return false;
            if (actorName && isCombatUnitIdentityMatch(candidate, actorName)) return false;
            if (matchedUnits.includes(candidate)) return false;
            return isCombatUnitIdentityMatch(candidate, partnerName);
          });
          if (unit) matchedUnits.push(unit);
        });
        return matchedUnits;
      }

      function deductParsedCostFromUnit(targetUnit, parsed = {}) {
        if (!targetUnit || !parsed) return;
        const stats = targetUnit.属性 || targetUnit;
        stats.sp = Math.max(0, Number(stats.sp ?? stats.魂力 ?? 0) - Number(parsed.reqSp || 0));
        stats.sta = Math.max(0, Number(stats.sta ?? stats.体力 ?? stats.vit ?? 0) - Number(parsed.reqVit || 0));
        stats.men = Math.max(0, Number(stats.men ?? stats.精神力 ?? 0) - Number(parsed.reqMen || 0));
      }

      function scaleFusionPanelModifierMap(panelMods = {}, fusionProfile = null) {
        if (!fusionProfile) return { ...(panelMods || {}) };
        const next = { ...(panelMods || {}) };
        const ratio = Number(fusionProfile.stateScale || 1);
        Object.keys(next).forEach(key => {
          const value = Number(next[key]);
          if (!Number.isFinite(value) || Math.abs(value - 1) < 0.0001) return;
          next[key] = value >= 1 ? scaleBattleFactor(value, ratio, 1) : scaleBattleDebuffRatio(value, ratio, 1);
        });
        return next;
      }

      function scaleFusionCombatEffectMap(calc = {}, fusionProfile = null) {
        if (!fusionProfile) return { ...(calc || {}) };
        const next = mergeCombatEffectMaps(createEmptyCombatEffectMap(), calc || {});
        const damageScale = Number(fusionProfile.damageMult || 1);
        const recoverScale = Number(fusionProfile.recoverMult || 1);
        const shieldScale = Number(fusionProfile.shieldMult || 1);
        const stateScale = Number(fusionProfile.stateScale || 1);
        const controlScale = Number(fusionProfile.controlScale || 1);

        ['hit_bonus', 'reaction_bonus', 'dodge_bonus', 'attacker_speed_bonus', 'cast_speed_bonus', 'interrupt_bonus', 'control_success_bonus'].forEach(
          key => {
            if (next[key] !== undefined) next[key] = scaleBattleValue(next[key], controlScale, { digits: 4 });
          },
        );
        ['reaction_penalty', 'hit_penalty', 'dodge_penalty', 'cast_speed_penalty', 'control_success_penalty'].forEach(key => {
          if (next[key] !== undefined) next[key] = scaleBattleValue(next[key], controlScale, { digits: 4 });
        });
        ['damage_reduction', 'counter_attack_ratio', 'damage_reflect_ratio', 'damage_share_ratio', 'sp_gain_ratio', 'men_gain_ratio', 'hot_heal_ratio', 'heal_block_ratio', 'resource_block_ratio', 'random_target_rate', 'stealth_level', 'bonus_true_damage_ratio', 'life_steal_ratio', 'heal_inversion_ratio', 'revive_heal_ratio'].forEach(
          key => {
            if (next[key] !== undefined) next[key] = scaleBattleValue(next[key], key.includes('heal') || key.includes('gain') ? recoverScale : stateScale, {
              min: 0,
              max: key.includes('ratio') || key.includes('reduction') || key.includes('block') ? 1 : undefined,
              digits: 4,
            });
          },
        );
        if (next.lock_level !== undefined) next.lock_level = scaleBattleLockLevel(next.lock_level, controlScale);
        if (next.dot_damage !== undefined) next.dot_damage = scaleBattleValue(next.dot_damage, damageScale, { min: 0, digits: 2 });
        ['death_save_count', 'revive_count', 'substitute_count', 'damage_share_count', 'daily_trigger_limit'].forEach(key => {
          if (next[key] !== undefined) next[key] = Math.max(0, Math.round(Number(next[key] || 0) * stateScale));
        });
        if (next.invincible_tier_threshold !== undefined) next.invincible_tier_threshold = Math.max(0, Number(next.invincible_tier_threshold || 0));
        if (next.final_damage_mult !== undefined) next.final_damage_mult = scaleBattleFactor(next.final_damage_mult, damageScale, 1);
        if (next.final_damage_bonus !== undefined) next.final_damage_bonus = scaleBattleValue(next.final_damage_bonus, damageScale, { min: 0, digits: 2 });
        if (next.final_heal_mult !== undefined) next.final_heal_mult = scaleBattleFactor(next.final_heal_mult, recoverScale, 1);
        if (next.final_heal_bonus !== undefined) next.final_heal_bonus = scaleBattleValue(next.final_heal_bonus, recoverScale, { min: 0, digits: 2 });
        if (next.shield_gain_mult !== undefined) next.shield_gain_mult = scaleBattleFactor(next.shield_gain_mult, shieldScale, 1);
        if (next.shield_gain_bonus !== undefined) next.shield_gain_bonus = scaleBattleValue(next.shield_gain_bonus, shieldScale, { min: 0, digits: 2 });
        if (next.control_resist_mult !== undefined) next.control_resist_mult = scaleBattleFactor(next.control_resist_mult, stateScale, 1);
        if (next.control_resist_bonus !== undefined) next.control_resist_bonus = scaleBattleValue(next.control_resist_bonus, stateScale, { digits: 4 });
        if (next.min_hp_floor !== undefined) next.min_hp_floor = Math.max(0, Math.round(Number(next.min_hp_floor || 0) * stateScale));
        if (next.death_save_count !== undefined) next.death_save_count = Math.max(0, Math.round(Number(next.death_save_count || 0) * stateScale));
        return next;
      }

      function getFusionScaledInterruptChance(skill = {}) {
        const interruptEffect = getSkillEffects(skill).find(effect => effect?.机制 === '打断') || {};
        const baseChance = Number(interruptEffect?.中断概率 || 0);
        const fusionProfile = getFusionBattleProfileFromSkill(skill);
        if (!fusionProfile) return baseChance;
        return scaleBattleValue(baseChance, Number(fusionProfile.controlScale || 1), { min: 0, max: 1, digits: 4 });
      }

      function createFusionAftermathCondition(fusionProfile = {}, skillName = '武魂融合技') {
        return {
          类型: 'debuff',
          层数: 1,
          描述: `施展[${skillName}]后的共鸣透支`,
          duration: Math.max(1, Math.round(Number(fusionProfile.aftermathDuration || 2))),
          面板修改比例: {
            str: Number(fusionProfile.aftermathPanelScale || 0.82),
            def: Number(fusionProfile.aftermathPanelScale || 0.82),
            agi: Number(fusionProfile.aftermathPanelScale || 0.82),
            sp_max: 1.0,
          },
          战斗效果: {
            ...createEmptyCombatEffectMap(),
            final_damage_mult: Number(fusionProfile.aftermathDamageMult || 0.82),
            final_heal_mult: Number(fusionProfile.aftermathHealMult || 0.82),
            shield_gain_mult: Number(fusionProfile.aftermathShieldMult || 0.82),
            cast_speed_penalty: Number(fusionProfile.aftermathCastPenalty || 0.35),
            dodge_penalty: Number(fusionProfile.aftermathDodgePenalty || 0.12),
            reaction_penalty: Number(fusionProfile.aftermathReactionPenalty || 0.12),
            resource_block_ratio: Number(fusionProfile.aftermathResourceBlock || 0.22),
          },
        };
      }

      function applyFusionAftermathCondition(targetUnit, fusionProfile = {}, skillName = '武魂融合技') {
        if (!targetUnit) return false;
        if (!targetUnit.状态效果) targetUnit.状态效果 = {};
        const nextCondition = createFusionAftermathCondition(fusionProfile, skillName);
        const existing = targetUnit.状态效果['融合后虚弱'];
        if (existing && typeof existing === 'object') {
          existing.duration = Math.max(Number(existing.duration || 0), Number(nextCondition.duration || 0));
          existing.描述 = nextCondition.描述;
          existing.面板修改比例 = nextCondition.面板修改比例;
          existing.战斗效果 = nextCondition.战斗效果;
        } else {
          targetUnit.状态效果['融合后虚弱'] = nextCondition;
        }
        return true;
      }

      function applyFusionActionAftermath(attackerChar, playerAction, battleContext = null) {
        if (!playerAction?.skill || playerAction.__fusion_aftermath_applied) return '';
        const fusionProfile = getFusionBattleProfileFromSkill(playerAction.skill);
        if (!fusionProfile) return '';
        const skillName = String(playerAction.skill?.name || playerAction.skill?.魂技名 || '武魂融合技').trim() || '武魂融合技';
        const partnerUnits = Array.isArray(playerAction.__fusion_partner_units) && playerAction.__fusion_partner_units.length
          ? playerAction.__fusion_partner_units
          : resolveFusionPartnerUnitsForSkill(playerAction.skill, [], battleContext, attackerChar);
        const affectedUnits = [attackerChar, ...partnerUnits].filter((unit, index, list) => unit && list.indexOf(unit) === index);
        if (!affectedUnits.length) return '';
        affectedUnits.forEach(unit => applyFusionAftermathCondition(unit, fusionProfile, skillName));
        playerAction.__fusion_aftermath_applied = true;
        const affectedNames = affectedUnits.map(unit => unit?.name || unit?.名称 || '施术者').filter(Boolean);
        return `[融合反噬] ${affectedNames.join('、')}施展[${skillName}]后经络与精神同步透支，全部陷入[融合后虚弱]。`;
      }

      function resolveSupportCostTarget(attackerChar, playerAction) {
        const skill = playerAction?.skill;
        if (!skill || !isSupportLikeSkill(skill)) return null;
        const targetText = String(getSkillTarget(skill) || '').trim();
        if (!targetText) return null;
        if (/自身/.test(targetText)) return attackerChar || null;
        const battleContext = window.BattleUIBridge?.getBattleContext?.() || window.BattleUIBridge?.getMVU?.('world.战斗') || null;
        const preferredName = String(playerAction?.target_name || '').trim();
        if (/己方|友方/.test(targetText)) {
          const ally = findCombatUnitByName(battleContext, preferredName);
          return ally || attackerChar || null;
        }
        if (/敌/.test(targetText)) {
          return findCombatUnitByName(battleContext, preferredName) || battleContext?.参战者?.enemy || null;
        }
        return attackerChar || null;
      }

      function applyActionCost(attackerChar, playerAction) {
        const stats = attackerChar.属性 || attackerChar;
        const status = attackerChar.状态 || {};
        let log = '';

        // 💥 1. 通用真实面板扣费逻辑 (支持固定值与百分比，绝不硬编码！)
        if (playerAction.skill && playerAction.skill.消耗 !== '无') {
          const supportCostTarget = resolveSupportCostTarget(attackerChar, playerAction);
          if (supportCostTarget) playerAction.skill.__targetForSupportCost = supportCostTarget;
          const costParts = splitSkillCostModes(playerAction.skill.消耗);
          const parsedCost = parseSkillCostForChar(
            { ...playerAction.skill, 消耗: costParts.upfront || '无' },
            attackerChar,
          );
          delete playerAction.skill.__targetForSupportCost;

          if (parsedCost.canCast) {
            deductParsedCostFromUnit(attackerChar, parsedCost);
            playerAction.__fusion_partner_units = Array.isArray(parsedCost.partnerCosts)
              ? parsedCost.partnerCosts.map(item => item.unit).filter(Boolean)
              : [];
            const partnerCostParts = [];
            (parsedCost.partnerCosts || []).forEach(partnerCost => {
              deductParsedCostFromUnit(partnerCost.unit, partnerCost);
              partnerCostParts.push(`${partnerCost.name}:${formatParsedCost(partnerCost)}`);
            });

            const sustainConfig = resolveActionSustainConfig(
              attackerChar,
              playerAction.action_type,
              playerAction.skill,
              getPrimaryStateName(playerAction.skill) || '无',
            );
            const shouldRegisterSustain =
              costParts.hasSustain ||
              ['展开斗铠领域', '展开精神领域', '展开武魂领域', '点燃生命之火'].includes(playerAction.action_type) ||
              (sustainConfig?.related_condition || sustainConfig?.name || '').includes('真身');
            if (shouldRegisterSustain && sustainConfig) {
              if (costParts.hasSustain && costParts.sustain) sustainConfig.sustain_cost = costParts.sustain;
              sustainConfig.support_cost_scale = parsedCost.costScale || 1;
              registerSustainEffect(
                attackerChar,
                `${playerAction.action_type || 'skill'}:${playerAction.skill.name}`,
                sustainConfig,
              );
            }

            log = `[战前消耗] 释放[${playerAction.skill.name}]，自身扣除 ${formatParsedCost(parsedCost)}${partnerCostParts.length ? `；共鸣分担 ${partnerCostParts.join('；')}` : ''}。${shouldRegisterSustain ? '(已登记持续维持)' : ''}`;
          } else {
            playerAction.action_type = '施法失败';
            log = `[状态枯竭] ${parsedCost.failureReason || '自身状态不足'}，无法支撑[${playerAction.skill.name}]的启动消耗，施法失败！`;
            return log;
          }
        }

        // 💥 2. 纯机制类状态切换 (不涉及具体数值伤害，仅改变底层状态)
        if (playerAction.action_type === '吸血反哺') {
          let ratio = playerAction.heal_ratio > 0 ? playerAction.heal_ratio : 0.3;
          let spGain = Math.floor(stats.sp_max * ratio);
          let vitGain = Math.floor((stats.sta_max || stats.vit_max || 1) * ratio);
          stats.sp = Math.min(stats.sp_max, stats.sp + spGain);
          stats.sta = Math.min(stats.sta_max || stats.vit_max || 1, (stats.sta || 0) + vitGain);
          log = `[机制反哺] 触发吸血/减耗机制，强制恢复状态！`;
        } else if (playerAction.action_type === '元素剥离') {
          if (!hasBattleUnlockedAttributeSet(attackerChar, ['水', '火', '风', '土'])) {
            playerAction.action_type = '法则失败';
            log = `[权限不足] 尚未集齐水火风土四基础调用权，无法发动元素剥离！`;
          } else {
            applyStateToCharacter(
              defenderChar,
              {
                状态名称: '元素剥离',
                特殊机制标识: '削弱/高阶衍生',
                持续回合: 2,
                面板修改比例: { str: 1.0, def: 0.82, agi: 0.96, sp_max: 1.0, vit_max: 1.0, men_max: 0.97 },
                计算层效果: { ...createEmptyCombatEffectMap(), reaction_penalty: 0.08, control_resist_mult: 0.9 },
              },
              '元素剥离',
              false,
            );
            log = `[元素剥离] 凑齐水火风土后的另类调用发动，直接剥离目标外层元素结构与属性护持！`;
          }
        } else if (playerAction.action_type === '五行剥离') {
          if (!hasBattleUnlockedAttributeSet(attackerChar, ['金', '木', '水', '火', '土'])) {
            playerAction.action_type = '法则失败';
            log = `[权限不足] 尚未集齐金木水火土五行调用权，无法发动五行剥离！`;
          } else {
            applyStateToCharacter(
              defenderChar,
              {
                状态名称: '五行剥离',
                特殊机制标识: '削弱/高阶衍生',
                持续回合: 2,
                面板修改比例: { str: 1.0, def: 0.75, agi: 0.92, sp_max: 1.0, vit_max: 1.0, men_max: 0.95 },
                计算层效果: {
                  ...createEmptyCombatEffectMap(),
                  reaction_penalty: 0.12,
                  control_resist_mult: 0.82,
                  lock_level: 1,
                },
              },
              '五行剥离',
              false,
            );
            log = `[五行剥离] 集齐五行后的另类调用发动，目标五行护持被强行剥离，结构与反应同步受压！`;
          }
        } else if (playerAction.action_type === '五行遁法') {
          const attackerBaseSp = Math.max(1, Number(attackerChar?.sp_max || attackerChar?.属性?.sp_max || 1));
          const defenderBaseSp = Math.max(1, Number(defenderChar?.sp_max || defenderChar?.属性?.sp_max || 1));
          const armorReady = defenderChar?.装备?.斗铠?.装备状态 === '已装备';
          const mechReady =
            defenderChar?.装备?.机甲?.装备状态 === '已装备' && defenderChar?.装备?.机甲?.状态 !== '重创';
          const canDisableMetalEquip = defenderBaseSp <= attackerBaseSp * 1.1;
          if (!hasBattleUnlockedAttributeSet(attackerChar, ['金', '木', '水', '火', '土'])) {
            playerAction.action_type = '法则失败';
            log = `[权限不足] 尚未集齐金木水火土五行调用权，无法发动五行遁法！`;
          } else {
            applyStateToCharacter(
              attackerChar,
              {
                状态名称: '五行遁法',
                特殊机制标识: '增益/高阶衍生',
                持续回合: 2,
                面板修改比例: { str: 1.0, def: 1.0, agi: 1.12, sp_max: 1.0, vit_max: 1.0, men_max: 1.05 },
                计算层效果: {
                  ...createEmptyCombatEffectMap(),
                  dodge_bonus: 0.18,
                  reaction_bonus: 0.1,
                  attacker_speed_bonus: 0.08,
                  cast_speed_bonus: 0.08,
                },
              },
              '五行遁法',
              true,
            );
            const disabledEquipments = [];
            if (canDisableMetalEquip && armorReady) {
              defenderChar.装备.斗铠.装备状态 = '失效';
              disabledEquipments.push('斗铠');
            }
            if (canDisableMetalEquip && mechReady) {
              defenderChar.装备.机甲.装备状态 = '失效';
              disabledEquipments.push('机甲');
            }
            log = `[五行遁法] 集齐五行后的另类调用发动，自身遁入五行流转，身法、规避与反应显著提升！`;
            if (disabledEquipments.length)
              log += ` [金属失效] 对方基础魂力未超过自身 10%，${disabledEquipments.join('、')}被五行遁法压制而暂时失效！`;
            else if ((armorReady || mechReady) && !canDisableMetalEquip)
              log += ` [装备稳固] 对方基础魂力超出压制阈值，金属装备未被撼动。`;
          }
        } else if (playerAction.action_type === '点燃生命之火') {
          if (attackerChar.血脉之力) {
            attackerChar.血脉之力.生命之火 = true;
            const sustainConfig = resolveActionSustainConfig(
              attackerChar,
              playerAction.action_type,
              playerAction.skill,
              '',
            );
            if (sustainConfig)
              registerSustainEffect(
                attackerChar,
                `life_fire:${playerAction.skill?.name || '点燃生命之火'}`,
                sustainConfig,
              );
            log += ` [底蕴透支] 强行点燃生命之火！气血如烘炉般燃烧，全属性临时翻倍！(警告：战后熄灭将面临毁灭性反噬)`;
          } else {
            playerAction.action_type = '法则失败';
            log = `[状态枯竭] 未觉醒相关血脉，无法点燃生命之火！`;
          }
        }
        // 领域状态挂载 (扣费已在上面通用逻辑完成，这里只挂载标识)
        else if (playerAction.action_type === '展开斗铠领域') {
          status.当前领域 =
            attackerChar.装备?.斗铠?.等级 >= 4 ? '【四字斗铠领域】全开(未定)' : '【三字斗铠领域】全开(未定)';
          const sustainConfig = resolveActionSustainConfig(
            attackerChar,
            playerAction.action_type,
            playerAction.skill,
            '',
          );
          if (sustainConfig) registerSustainEffect(attackerChar, `domain:${playerAction.action_type}`, sustainConfig);
          log += ` [领域降临] 斗铠法则主场展开！`;
        } else if (playerAction.action_type === '展开精神领域') {
          status.当前领域 = '【精神领域】全开';
          const sustainConfig = resolveActionSustainConfig(
            attackerChar,
            playerAction.action_type,
            playerAction.skill,
            '',
          );
          if (sustainConfig) registerSustainEffect(attackerChar, `domain:${playerAction.action_type}`, sustainConfig);
          log += ` [领域降临] 精神法则主场展开！`;
        } else if (playerAction.action_type === '展开武魂领域') {
          status.当前领域 = '【武魂领域】全开';
          const sustainConfig = resolveActionSustainConfig(
            attackerChar,
            playerAction.action_type,
            playerAction.skill,
            '',
          );
          if (sustainConfig) registerSustainEffect(attackerChar, `domain:${playerAction.action_type}`, sustainConfig);
          log += ` [领域降临] 武魂本源领域展开！`;
        }

        return log;
      }

      function settleBattle(attackerChar, defenderChar, battleOutcome = {}, options = {}) {
        let log = '';
        let extraPatchOps = [];
        let attackerStats = attackerChar.属性 || attackerChar;
        let defenderStats = defenderChar.属性 || defenderChar;
        let defenderName = defenderChar.name || '敌人';

        // 读取战斗类型
        let combatData = options.combatData || window.BattleUIBridge?.getMVU('world.战斗');
        let combatType = combatData.战斗类型 || '突发遭遇';
        const preferredPlayerName = String(window.BattleUIBridge?.getMVU('sys.玩家名') || '').trim();
        const attackerName = String(
          attackerChar?.name || combatData?.参战者?.player?.name || preferredPlayerName || '',
        ).trim();
        const attackerPath = `/char/${escapeJsonPointerSegment(attackerName)}`;
        let inventory = (attackerName ? window.BattleUIBridge?.getMVU(`char.${attackerName}.背包`) : null) || {};
        const currentTick = Number(window.BattleUIBridge?.getMVU('world.时间.tick') || 0);
        const defenderFlags = getCombatTargetSpeciesFlags(defenderChar);
        const isBeast = defenderFlags.isBeast;
        const isAbyss = defenderFlags.isAbyss;
        const isBeastOrAbyss = defenderFlags.isBeastOrAbyss;
        const validDefenderName = !!(defenderName && defenderName !== '敌人' && defenderName !== '未知');
        const outcome =
          battleOutcome && typeof battleOutcome === 'object'
            ? battleOutcome
            : buildFrontEndBattleOutcome(attackerChar, defenderChar, {
                unresolvedReason: options.unresolvedReason || '',
                formalEncounter: true,
              });
        const isVictoryOutcome = outcome.isVictory === true;
        const isDrawOutcome = outcome.isDraw === true;
        const isUnresolvedOutcome = outcome.isUnresolved === true;
        const shouldRecordCombatHistory = outcome.formalEncounter !== false && !isBeastOrAbyss && validDefenderName;
        let historyCountBefore = 0;
        if (shouldRecordCombatHistory) {
          const existingHistory = attackerChar?.战斗历史?.[defenderName];
          historyCountBefore = Math.max(0, Number(existingHistory?.次数 || 0));
        }

        // --- 触发世界战斗图鉴录入 ---
        let bestiary = window.BattleUIBridge?.getMVU('world.图鉴') || {};
        if (isBeastOrAbyss && validDefenderName) {
          let monsterEntry = bestiary[defenderName];
          if (!monsterEntry) {
            extraPatchOps.push({
              op: 'add',
              path: `/world/图鉴/${defenderName}`,
              value: { 交手次数: 1, 首次记录: `由 ${attackerName} 在${combatType}中遭遇` },
            });
          } else {
            extraPatchOps.push({
              op: 'replace',
              path: `/world/图鉴/${defenderName}/交手次数`,
              value: (monsterEntry.交手次数 || 1) + 1,
            });
          }
        }

        if (combatType === '升灵台虚拟战斗') {
          if (isVictoryOutcome) {
            let killedAge = combatData.killed_age || defenderStats.age || 100;
            let partySize = combatData.party_size || 1;
            let ticket = combatData.ascension_ticket || '初级升灵台门票';
            let maxAge = ticket === '高级升灵台门票' ? 100000 : ticket === '中级升灵台门票' ? 20000 : 3000;
            killedAge = Math.min(killedAge, maxAge);

            let rings = Object.keys(attackerChar.魂环 || {});
            let totalRings = rings.length;
            if (totalRings > 0) {
              let gain = Math.floor(killedAge / partySize / totalRings);
              log = `[升灵台结算] 击溃虚拟魂兽！化为纯净修为能量涌入体内(${partySize}人平分)，拥有 ${totalRings} 个魂环均获得大约 ${gain} 年修为提升！(请 AI 描写吸收能量的画面)`;
              rings.forEach(rIndex => {
                const oldAge = attackerChar.魂环[rIndex].年限 || 10;
                extraPatchOps.push({
                  op: 'replace',
                  path: `${attackerPath}/魂环/${rIndex}/年限`,
                  value: oldAge + gain,
                });
              });
            } else {
              log = `[升灵台结算] 虚拟魂兽已被击溃！但玩家尚未拥有魂环，无法吸收升灵能量，能量缓缓消散...`;
            }
          } else if (outcome.isDefeat === true || isDrawOutcome) {
            log = `[升灵台保护] 玩家受到致命创伤，升灵台保护机制触发！一道接引光芒落下，强制将其弹出升灵台。(虚拟战败，无实质损伤，但终止了本次历练)`;
            attackerChar.vit = 1;
          } else {
            log = `[升灵台仲裁] 本次交锋暂未分出胜负，升灵台能量回路仍在持续运转。`;
          }
          return { log, extraPatchOps };
        }

        if (combatType === '魂灵塔冲塔') {
          const rosterCheck = validateSoulTowerCombatRoster(combatData);
          if (!rosterCheck.ok) {
            log = `[魂灵塔资格驳回] ${rosterCheck.message}`;
            return { log, extraPatchOps };
          }
          let floor = combatData.floor || 1;
          const gateMeta = getSoulTowerGateMeta(floor);
          if (isVictoryOutcome) {
            log = `🏆[冲塔成功] ${gateMeta.gateLabel}${gateMeta.isGateBoss ? '关底' : ''}镇守第 ${floor} 层的 ${defenderName} 被彻底击溃！当前守塔魂灵已锁定为可选购买目标，请决定是结束冲塔并保留资格，还是继续冲击下一层。`;
          } else if (outcome.isDefeat === true || isDrawOutcome) {
            log = `💀[冲塔失败] 玩家遭到 ${defenderName} 重创，魂灵塔阵法排斥之力发动，将其强行传送出塔外！(请 AI 描写重伤弹出塔外的虚弱状态)`;
            attackerChar.vit = 1;
          } else {
            log = `[冲塔仲裁] 本次交锋尚未形成通关结果，魂灵塔考核仍在继续。`;
          }
          return { log, extraPatchOps };
        }

        if (isVictoryOutcome) {
          let lvDiff = defenderStats.lv - attackerStats.lv;

          if (lvDiff <= -5) {
            log = `[实战结算] 击败了对手，但因等级碾压(等级差≤-5)，毫无实战感悟，收益为 0。`;
          } else {
            let myTalentScore =
              { 绝世妖孽: 5, 顶级天才: 4, 天才: 3, 优秀: 2, 正常: 1, 劣等: 0 }[attackerStats.talent_tier] || 1;
            let targetTalentScore = 1;

            if (isBeastOrAbyss) {
              if (defenderStats.age >= 100000) targetTalentScore = 5;
              else if (defenderStats.age >= 10000) targetTalentScore = 3;
              else if (defenderStats.age >= 1000) targetTalentScore = 2;
              else targetTalentScore = 0;
            } else {
              targetTalentScore =
                { 绝世妖孽: 5, 顶级天才: 4, 天才: 3, 优秀: 2, 正常: 1, 劣等: 0 }[defenderStats.talent_tier] || 1;
            }
            let talentMult = Math.max(0.1, 1 + (targetTalentScore - myTalentScore) * 0.2);

            let lvMult = 1.0;
            if (lvDiff >= 3) lvMult = 1.5 + (lvDiff - 3) * 0.2;

            let historyMult = 1.0;
            if (!isBeastOrAbyss) {
              if (historyCountBefore === 1) historyMult = 0.5;
              else if (historyCountBefore === 2) historyMult = 0.1;
              else if (historyCountBefore >= 3) historyMult = 0;
            }

            let finalMult = talentMult * lvMult * historyMult;

            if (finalMult <= 0) {
              log = `[实战结算] 击败了对手，但因多次交手已无新感悟，收益递减为 0。`;
            } else {
              let baseGain = 10;
              let finalGain = Math.floor(baseGain * finalMult);

              if (finalGain > 0) {
                if (!attackerStats.训练加成)
                  attackerStats.训练加成 = { str: 0, def: 0, agi: 0, vit_max: 0, men_max: 0, sp_max: 0 };
                attackerStats.训练加成.str += finalGain;
                attackerStats.训练加成.def += finalGain;
                attackerStats.训练加成.agi += finalGain;
                attackerStats.训练加成.vit_max += finalGain;
                attackerStats.训练加成.men_max += Math.floor(finalGain * 0.5);
                log = `[实战结算] 战斗胜利！(等级差:${lvDiff}, 天赋乘区:${talentMult.toFixed(1)}, 递减:${historyMult}) 获得 ${finalGain} 点实战六维成长！`;
              } else {
                log = `[实战结算] 战斗胜利，但综合评估后收益微乎其微。`;
              }
            }
          }
          if (combatType === '擂台切磋') {
            log += ` 🏆[擂台结算] 堂堂正正地赢得了比赛！(请 AI 描写观众的欢呼与对手的反应)`;
          } else if (isBeastOrAbyss) {
            if (isAbyss) {
              log += outcome.isLethalCandidate
                ? ` [深渊濒死] 深渊生物已被打入致命区，但正式死亡与战功结算仍待后续裁断。`
                : ` [深渊压制] 深渊生物已失去继续作战能力，后续生死由剧情与 AI 裁断。`;
            } else {
              log += outcome.isLethalCandidate
                ? ` [魂兽濒死] 魂兽已被打入濒死边缘，是否正式死亡与是否形成猎魂结算仍待后续裁断。`
                : ` [魂兽压制] 魂兽已被重创压制，是否死亡与是否形成猎魂结算仍待后续裁断。`;
            }
          } else {
            log += outcome.isLethalCandidate
              ? ` [致命压制] 敌人已被打入濒死边缘，生死仍待后续裁断。`
              : ` [战果确认] 敌人已被彻底制服，暂未触发致死结算。`;
          }
        } else if (isDrawOutcome) {
          log = `[实战结算] 双方均已失去继续作战能力，战局以两败俱伤暂告段落。`;
        } else if (isUnresolvedOutcome) {
          if (options.unresolvedReason === 'single_round_limit') {
            log = `[实战结算] 单回合仲裁结束，当前尚未分出胜负，双方仍在激烈对峙。`;
          } else if (options.unresolvedReason === 'simulation_stopped') {
            log = `[实战结算] 暗箱续推暂告一段落，当前仍未决出胜负，战局进入新的对峙阶段。`;
          } else if (outcome.label) {
            log = `[实战结算] ${outcome.label}，本次交锋暂未形成最终战果。`;
          } else {
            log = `[实战结算] 当前仍未决出胜负，战局进入新的对峙阶段。`;
          }
        } else {
          log = `[实战结算] 自身失去继续作战能力，本次交锋未能取胜。`;
        }

        if (shouldRecordCombatHistory) {
          if (!attackerChar.战斗历史 || typeof attackerChar.战斗历史 !== 'object') attackerChar.战斗历史 = {};
          if (!attackerChar.战斗历史[defenderName] || typeof attackerChar.战斗历史[defenderName] !== 'object') {
            attackerChar.战斗历史[defenderName] = { 次数: 0, 最近tick: 0 };
          }
          attackerChar.战斗历史[defenderName].次数 = Math.max(
            0,
            Number(attackerChar.战斗历史[defenderName].次数 || 0),
          ) + 1;
          attackerChar.战斗历史[defenderName].最近tick = currentTick;
        }

        return { log, extraPatchOps };
      }

      function applyArmorDamage(defender) {
        let log = '';
        if (defender.装备.机甲.等级 !== '无' && defender.装备.机甲.状态 !== '重创') {
          if (defender.装备.机甲.状态 === '完好') {
            defender.装备.机甲.状态 = '受损';
            defender.装备.机甲.品质系数 = 0.5;
            log = `[战损] 敌方最外层的机甲装甲大面积凹陷，状态降级为【受损】！`;
          } else if (defender.装备.机甲.状态 === '受损') {
            defender.装备.机甲.状态 = '重创';
            defender.装备.机甲.品质系数 = 0;
            log = `[战损] 敌方机甲核心法阵爆裂，状态降级为【重创】，彻底瘫痪！`;
          }
          return log;
        }
        if (defender.装备.斗铠.装备状态 === '已装备') {
          let parts = Object.keys(defender.装备.斗铠.parts);
          let intactParts = parts.filter(p => defender.装备.斗铠.parts[p].状态 === '完好');
          if (intactParts.length > 0) {
            let targetPart = intactParts[Math.floor(Math.random() * intactParts.length)];
            defender.装备.斗铠.parts[targetPart].状态 = '碎裂';
            defender.装备.斗铠.parts[targetPart].品质系数 = 0;
            log = `[战损] 敌方贴身的斗铠【${targetPart}】承受不住透体的重击，轰然碎裂！`;
          }
        }
        return log;
      }

      function triggerDeathSave(defender) {
        if (!defender?.状态效果) return null;
        const candidate = Object.entries(defender.状态效果)
          .map(([key, cond]) => ({ key, cond, ce: cond?.战斗效果 || {} }))
          .filter(entry => Number(entry.ce.death_save_count || 0) > 0)
          .sort((a, b) => Number(b.ce.death_save_count || 0) - Number(a.ce.death_save_count || 0))[0];
        if (!candidate) return null;
        if (!candidate.cond.战斗效果) candidate.cond.战斗效果 = {};
        const nextCount = Math.max(0, Number(candidate.cond.战斗效果.death_save_count || 0) - 1);
        candidate.cond.战斗效果.death_save_count = nextCount;
        return `[濒死守护] ${defender.name || '目标'}触发[${candidate.key}]，强行保住最后一口气！剩余保护次数:${nextCount}`;
      }

      function formatBattleDayKeyFromTick(tickValue) {
        const safeTick = Math.max(0, Number(tickValue || 0));
        const totalMinutes = safeTick * 10;
        const days = Math.floor(totalMinutes / (24 * 60));
        const years = Math.floor(days / 360);
        const months = Math.floor((days % 360) / 30) + 1;
        const currentDay = (days % 30) + 1;
        return `${20000 + years}-${months}-${currentDay}`;
      }

      function getCombatUnitTierNumber(entity = {}) {
        const candidates = [
          entity?.final?.lv,
          entity?.lv,
          entity?.等级,
          entity?.对标等级,
          entity?.属性?.对标等级,
          entity?.属性?.等级,
        ];
        for (const candidate of candidates) {
          const parsed = Number(candidate);
          if (Number.isFinite(parsed)) return parsed;
        }
        const text = [
          entity?.境界,
          entity?.属性?.境界,
          entity?.战力对标,
          entity?.属性?.战力对标,
          entity?.称号,
          entity?.属性?.称号,
        ]
          .map(value => String(value || '').trim())
          .filter(Boolean)
          .join(' ');
        if (/准神/.test(text)) return 99.5;
        if (/神级|百级|真神|一级神|二级神|三级神/.test(text)) return 100;
        return 0;
      }

      function ensureMechanismTriggerLedger(char) {
        if (!char || typeof char !== 'object') return {};
        if (!char.机制触发记录 || typeof char.机制触发记录 !== 'object') char.机制触发记录 = {};
        return char.机制触发记录;
      }

      function consumeDailyMechanismTrigger(char, mechanismKey = '', limitPerDay = 0, currentTick = null) {
        const safeLimit = Math.max(0, Number(limitPerDay || 0));
        if (!(safeLimit > 0)) return { allowed: true, remaining: Infinity, used: 0, dayKey: '' };
        const ledger = ensureMechanismTriggerLedger(char);
        const dayKey = formatBattleDayKeyFromTick(
          currentTick == null ? Number(window.BattleUIBridge?.getMVU('world.时间.tick') || 0) : currentTick,
        );
        const key = String(mechanismKey || '未命名机制').trim() || '未命名机制';
        let entry = ledger[key];
        if (!entry || typeof entry !== 'object' || String(entry.日期 || '') !== dayKey) {
          entry = { 日期: dayKey, 次数: 0 };
          ledger[key] = entry;
        }
        if (Number(entry.次数 || 0) >= safeLimit) {
          return {
            allowed: false,
            remaining: 0,
            used: Number(entry.次数 || 0),
            dayKey,
          };
        }
        entry.次数 = Math.max(0, Number(entry.次数 || 0)) + 1;
        return {
          allowed: true,
          remaining: Math.max(0, safeLimit - Number(entry.次数 || 0)),
          used: Number(entry.次数 || 0),
          dayKey,
        };
      }

      function getCombatAlliesForUnit(combatData, unit) {
        if (!combatData || !unit) return [];
        const playerSide = [combatData?.参战者?.player, ...(combatData?.参战者?.team_player || [])].filter(Boolean);
        const enemySide = [combatData?.参战者?.enemy, ...(combatData?.参战者?.team_enemy || [])].filter(Boolean);
        if (playerSide.some(member => isCombatUnitIdentityMatch(member, unit?.name || unit))) {
          return playerSide.filter(member => member && !isCombatUnitIdentityMatch(member, unit?.name || unit));
        }
        if (enemySide.some(member => isCombatUnitIdentityMatch(member, unit?.name || unit))) {
          return enemySide.filter(member => member && !isCombatUnitIdentityMatch(member, unit?.name || unit));
        }
        return [];
      }

      function collectShieldConditionEntries(char) {
        if (!char?.状态效果) return [];
        return Object.entries(char.状态效果)
          .map(([key, cond]) => ({ key, cond, shieldValue: Math.max(0, Number(cond?.shield_value || 0)) }))
          .filter(entry => entry.shieldValue > 0)
          .sort((a, b) => b.shieldValue - a.shieldValue);
      }

      function triggerReviveEffect(targetChar, label = '目标') {
        if (!targetChar?.状态效果) return null;
        const candidate = Object.entries(targetChar.状态效果)
          .map(([key, cond]) => ({ key, cond, ce: cond?.战斗效果 || {} }))
          .filter(entry => Number(entry.ce.revive_count || 0) > 0)
          .sort((a, b) => Number(b.ce.revive_count || 0) - Number(a.ce.revive_count || 0))[0];
        if (!candidate) return null;
        if (!candidate.cond.战斗效果) candidate.cond.战斗效果 = {};
        const nextCount = Math.max(0, Number(candidate.cond.战斗效果.revive_count || 0) - 1);
        candidate.cond.战斗效果.revive_count = nextCount;
        const healRatio = Math.max(0.05, Number(candidate.cond.战斗效果.revive_heal_ratio || 0.25));
        const maxVit = Math.max(1, Number(targetChar.vit_max || 1));
        const restoreAmount = Math.max(1, Math.floor(maxVit * healRatio));
        targetChar.vit = Math.min(maxVit, Math.max(restoreAmount, Number(targetChar.vit || 0) + restoreAmount));
        if (!targetChar.状态 || typeof targetChar.状态 !== 'object') targetChar.状态 = {};
        targetChar.状态.行动 = '战斗';
        return `[复苏触发] ${label}借[${candidate.key}]重燃战意，恢复 ${restoreAmount} 点HP！剩余复苏次数:${nextCount}`;
      }

      function applyShieldToCharacter(targetChar, shieldAmount, duration = 1, sourceName = '护盾') {
        const amount = Math.max(0, Math.floor(Number(shieldAmount || 0)));
        if (!targetChar || amount <= 0) return 0;
        if (!targetChar.状态效果) targetChar.状态效果 = {};
        const stateName = /护盾|屏障|结界/.test(String(sourceName || ''))
          ? String(sourceName || '护盾')
          : `${sourceName || '护盾'}护盾`;
        const existing = targetChar.状态效果[stateName];
        if (existing) {
          existing.duration = Math.max(Number(existing.duration || 0), Number(duration || 0));
          existing.shield_value = Math.max(0, Number(existing.shield_value || 0)) + amount;
          return amount;
        }
        targetChar.状态效果[stateName] = {
          类型: 'buff',
          层数: 1,
          描述: `由[${sourceName || stateName}]附加`,
          duration: Number(duration || 0),
          面板修改比例: { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 },
          战斗效果: { ...createEmptyCombatEffectMap() },
          shield_value: amount,
        };
        return amount;
      }

      function resolveReactiveDefenseOnDamage(attacker, defender, incomingDamage, options = {}) {
        let damage = Math.max(0, Math.floor(Number(incomingDamage || 0)));
        if (!defender?.状态效果 || damage <= 0) return { damage, counterDamage: 0, log: '', sharedDamageEntries: [] };
        const parts = [];
        let counterDamage = 0;
        const sharedDamageEntries = [];
        const attackerTier = getCombatUnitTierNumber(attacker);
        const currentTick = Number(options?.currentTick ?? (window.BattleUIBridge?.getMVU('world.时间.tick') || 0));
        for (const [key, cond] of Object.entries(defender.状态效果)) {
          const ce = cond?.战斗效果 || {};
          if (!ce.invincible) continue;
          const tierThreshold = Math.max(0, Number(ce.invincible_tier_threshold || 100));
          const belowThreshold = tierThreshold > 0 ? attackerTier < tierThreshold : true;
          if (!belowThreshold) continue;
          const quota = consumeDailyMechanismTrigger(
            defender,
            `${defender.name || '目标'}:${key}:无敌金身`,
            Number(ce.daily_trigger_limit || 0),
            currentTick,
          );
          if (!quota.allowed) {
            parts.push(`[无敌金身耗尽] ${defender.name || '目标'}的[${key}]今日触发次数已满，无法继续豁免。`);
            continue;
          }
          damage = 0;
          parts.push(
            `[无敌金身] ${defender.name || '目标'}以[${key}]强行豁免了神级以下攻击，本日剩余触发:${quota.remaining === Infinity ? '∞' : quota.remaining}。`,
          );
          return { damage, counterDamage, log: parts.join(' '), sharedDamageEntries };
        }
        for (const [key, cond] of Object.entries(defender.状态效果)) {
          const ce = cond?.战斗效果 || {};
          if (Number(ce.substitute_count || 0) > 0) {
            if (cond.战斗效果) cond.战斗效果.substitute_count = Math.max(0, Number(ce.substitute_count || 0) - 1);
            damage = 0;
            parts.push(`[替身抵消] ${defender.name || '目标'}以[${key}]替掉了本次伤害。`);
            return { damage, counterDamage, log: parts.join(' '), sharedDamageEntries };
          }
        }
        for (const [key, cond] of Object.entries(defender.状态效果)) {
          const ce = cond?.战斗效果 || {};
          if (Number(ce.block_count || 0) > 0) {
            if (cond.战斗效果) cond.战斗效果.block_count = Math.max(0, Number(ce.block_count || 0) - 1);
            damage = 0;
            parts.push(`[格挡触发] ${defender.name || '目标'}以[${key}]抵消了本次攻击！`);
            return { damage, counterDamage, log: parts.join(' '), sharedDamageEntries };
          }
        }
        if (damage > 0) {
          for (const [key, cond] of Object.entries(defender.状态效果)) {
            const shieldValue = Math.max(0, Number(cond?.shield_value || 0));
            if (shieldValue <= 0) continue;
            const absorbed = Math.min(damage, shieldValue);
            cond.shield_value = Math.max(0, shieldValue - absorbed);
            damage -= absorbed;
            parts.push(`[护盾吸收] ${defender.name || '目标'}的[${key}]吸收了 ${absorbed} 点伤害。`);
            if (cond.shield_value <= 0) {
              delete defender.状态效果[key];
              parts.push(`[护盾破碎] ${defender.name || '目标'}的[${key}]被彻底击碎。`);
            }
            if (damage <= 0) break;
          }
        }
        if (damage > 0) {
          const allies = getCombatAlliesForUnit(options?.combatData || getCurrentBattleContextSnapshot(), defender).filter(
            ally => isCombatUnitAlive(ally),
          );
          for (const [key, cond] of Object.entries(defender.状态效果)) {
            const ce = cond?.战斗效果 || {};
            const shareRatio = Math.max(0, Math.min(1, Number(ce.damage_share_ratio || 0)));
            const shareCount = Math.max(0, Math.round(Number(ce.damage_share_count || 0)));
            if (!(shareRatio > 0) || !(shareCount > 0) || !allies.length) continue;
            const selectedAllies = allies.slice(0, shareCount);
            if (!selectedAllies.length) continue;
            const sharedTotal = Math.max(1, Math.floor(damage * shareRatio));
            const selfRemain = Math.max(0, damage - sharedTotal);
            const perTargetDamage = Math.max(1, Math.floor(sharedTotal / selectedAllies.length));
            damage = selfRemain;
            selectedAllies.forEach((ally, index) => {
              const finalSharedDamage =
                index === selectedAllies.length - 1
                  ? Math.max(1, sharedTotal - perTargetDamage * Math.max(0, selectedAllies.length - 1))
                  : perTargetDamage;
              sharedDamageEntries.push({
                target: ally,
                damage: Math.max(1, finalSharedDamage),
                kind: 'shared',
                from: defender,
              });
            });
            parts.push(
              `[伤害分摊] ${defender.name || '目标'}借[${key}]将 ${sharedTotal} 点伤害分摊给${selectedAllies
                .map(ally => ally?.name || '队友')
                .join('、')}。`,
            );
            break;
          }
        }
        if (damage > 0) {
          for (const [key, cond] of Object.entries(defender.状态效果)) {
            const ce = cond?.战斗效果 || {};
            const ratio = Number(ce.counter_attack_ratio || 0);
            if (ratio > 0) {
              counterDamage = Math.max(counterDamage, Math.max(1, Math.floor(damage * ratio)));
              parts.push(`[反击触发] ${defender.name || '目标'}借[${key}]展开反击，回震 ${counterDamage} 点伤害！`);
            }
            const reflectRatio = Number(ce.damage_reflect_ratio || 0);
            if (reflectRatio > 0) {
              const reflectDamage = Math.max(1, Math.floor(damage * reflectRatio));
              counterDamage = Math.max(counterDamage, reflectDamage);
              parts.push(`[伤害反射] ${defender.name || '目标'}借[${key}]反弹了 ${reflectDamage} 点伤害！`);
            }
          }
        }
        return { damage, counterDamage, log: parts.join(' '), sharedDamageEntries };
      }

      function resolveCastInterruptOnDamage(
        targetChar,
        attackAction,
        inflictedDamage,
        settleResult = {},
        label = '目标',
      ) {
        if (!targetChar?.蓄力技能) return '';
        const targetEffects = targetChar.状态效果
          ? Object.values(targetChar.状态效果).map(c => c?.战斗效果 || {})
          : [];
        const hasSuperArmor =
          targetEffects.some(ce => ce?.super_armor === true) ||
          Object.keys(targetChar.状态效果 || {}).some(key => /霸体|真身/.test(String(key || '')));
        const damageRatio = Math.max(0, Number(inflictedDamage || 0)) / Math.max(1, Number(targetChar.vit_max || 1));
        const stateCalc = getPrimaryStateCalc(attackAction?.skill);
        const specialFlags = String(getPrimaryStateEffect(attackAction?.skill)?.特殊机制标识 || '无');
        const interruptEffect = getSkillEffects(attackAction?.skill).find(effect => effect?.机制 === '打断') || {};
        const interruptChance = Math.max(
          0,
          Math.max(Number(interruptEffect?.中断概率 || 0), Number(getFusionScaledInterruptChance(attackAction?.skill) || 0)),
          Number(settleResult?.interrupt_bonus || 0),
        );
        const hardControl =
          stateCalc.skip_turn === true || stateCalc.cannot_react === true || specialFlags.includes('硬控');
        const controlled = targetEffects.some(ce => ce?.skip_turn === true || ce?.cannot_react === true);
        const interruptTriggered = interruptChance > 0 && Math.random() <= Math.min(1, interruptChance);
        if (hasSuperArmor && (hardControl || interruptTriggered))
          return `[霸体强抗] ${label}凭借霸体稳住阵脚，蓄力未被打断！`;
        if (!hasSuperArmor && (damageRatio >= 0.3 || hardControl || controlled || interruptTriggered)) {
          targetChar.蓄力技能 = null;
          return interruptTriggered
            ? `[打断生效] ${label}的蓄力被强行打断！`
            : `[蓄力打断] ${label}受到重创或控制，蓄力被强制打断！`;
        }
        return '';
      }

      function summarizeProjectedDamageEntries(targetResults = []) {
        const entries = Array.isArray(targetResults)
          ? targetResults
              .map((entry, index) => {
                if (!entry?.target) return null;
                return {
                  ...entry,
                  damage: Math.max(0, Math.floor(Number(entry?.damage || 0))),
                  kind: entry?.kind || (index === 0 ? 'primary' : 'secondary'),
                };
              })
              .filter(Boolean)
          : [];
        const primaryEntry = entries.find(entry => entry.kind === 'primary') || entries[0] || null;
        const primaryDamage = Math.max(0, Number(primaryEntry?.damage || 0));
        const totalDamage = entries.reduce((sum, entry) => sum + Math.max(0, Number(entry?.damage || 0)), 0);
        return {
          entries,
          primaryEntry,
          primaryDamage,
          totalDamage,
        };
      }

      function refreshSettleResultProjectedDamage(settleResult = {}) {
        const summary = summarizeProjectedDamageEntries(settleResult?.targetResults || []);
        if (summary.entries.length > 0) {
          settleResult.targetResults = summary.entries;
          settleResult.dmg = summary.primaryDamage;
          settleResult.totalProjectedDamage = summary.totalDamage;
        } else {
          settleResult.dmg = Math.max(0, Math.floor(Number(settleResult?.dmg || 0)));
          settleResult.totalProjectedDamage = settleResult.dmg;
          settleResult.targetResults = [];
        }
        return settleResult;
      }

      function appendProjectedDamageToSettleResult(settleResult = {}, targetChar, damage = 0, kind = 'secondary') {
        if (!settleResult || !targetChar) return settleResult;
        const normalizedDamage = Math.max(0, Math.floor(Number(damage || 0)));
        if (!(normalizedDamage > 0)) return settleResult;
        const targetName = targetChar?.name || targetChar?.名称 || '目标';
        if (!Array.isArray(settleResult.targetResults)) settleResult.targetResults = [];
        const existing = settleResult.targetResults.find(entry => entry?.target && isCombatUnitIdentityMatch(entry.target, targetName));
        if (existing) {
          existing.damage = Math.max(0, Number(existing.damage || 0)) + normalizedDamage;
          if (existing.kind !== 'primary' && kind === 'primary') existing.kind = 'primary';
        } else {
          settleResult.targetResults.push({
            target: targetChar,
            targetName,
            damage: normalizedDamage,
            kind,
          });
        }
        return refreshSettleResultProjectedDamage(settleResult);
      }

      function applyResolvedDamagePackage(attacker, attackAction, settleResult = {}, options = {}) {
        const primaryTarget = options.primaryTarget || null;
        const targetResults =
          Array.isArray(settleResult?.targetResults) && settleResult.targetResults.length
            ? settleResult.targetResults
            : primaryTarget
              ? [{ target: primaryTarget, targetName: primaryTarget?.name || '目标', damage: Number(settleResult?.dmg || 0), kind: 'primary' }]
              : [];
        const logParts = [];
        let primaryAppliedDamage = 0;
        let totalAppliedDamage = 0;
        targetResults.forEach((targetEntry, index) => {
          const targetChar = targetEntry?.target;
          if (!targetChar) return;
          bindCombatParticipant(targetChar);
          const targetFinalStat = targetChar.final || buildCombatFinalStats(targetChar);
          const incomingDamage = Math.max(0, Math.floor(Number(targetEntry?.damage || 0)));
          if (!(incomingDamage > 0)) return;
          const reactiveDefense = resolveReactiveDefenseOnDamage(attacker, targetChar, incomingDamage, options);
          let finalDamage = reactiveDefense.damage;
          if (reactiveDefense.counterDamage > 0) {
            attacker.vit = Math.max(0, Number(attacker.vit || 0) - reactiveDefense.counterDamage);
          }
          if (reactiveDefense.log) logParts.push(reactiveDefense.log);
          let appliedDamage = 0;
          if (finalDamage > 0) {
            const defThreshold = Math.max(1, Number(targetFinalStat.def || targetChar.def || 0)) * 0.1;
            if (finalDamage < defThreshold) {
              targetChar.vit = Math.max(0, Number(targetChar.vit || 0) - 1);
              appliedDamage = 1;
              logParts.push(
                targetEntry?.kind === 'primary'
                  ? `[未破防] 对${targetChar.name || '目标'}仅造成 1 点强制伤害。`
                  : `[群体擦伤] ${targetChar.name || '目标'}仅承受 1 点擦伤伤害。`,
              );
            } else {
              targetChar.vit = Math.max(0, Number(targetChar.vit || 0) - finalDamage);
              appliedDamage = finalDamage;
              logParts.push(
                targetEntry?.kind === 'primary'
                  ? `[命中结算] 对${targetChar.name || '目标'}造成 ${finalDamage} 点最终伤害。`
                  : `[群体命中] ${targetChar.name || '目标'}承受 ${finalDamage} 点伤害。`,
              );
              if (finalDamage > Number(targetFinalStat.sp_max || targetChar.sp_max || 0) * 0.5) {
                if (!targetChar.状态效果) targetChar.状态效果 = {};
                targetChar.状态效果['重度流血'] = {
                  类型: 'debuff',
                  层数: 1,
                  描述: '重创导致的流血',
                  duration: 3,
                  面板修改比例: { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 },
                  战斗效果: {
                    ...createEmptyCombatEffectMap(),
                    dot_damage: Math.floor(Number(targetFinalStat.vit_max || targetChar.vit_max || 0) * 0.05),
                  },
                };
                logParts.push(`[重创打击] ${targetChar.name || '目标'}被附加[重度流血]状态！`);
              }
            }
          }
          if (Array.isArray(reactiveDefense.sharedDamageEntries) && reactiveDefense.sharedDamageEntries.length) {
            reactiveDefense.sharedDamageEntries.forEach(sharedEntry => {
              const sharedTarget = sharedEntry?.target;
              const sharedDamage = Math.max(0, Math.floor(Number(sharedEntry?.damage || 0)));
              if (!sharedTarget || !(sharedDamage > 0)) return;
              bindCombatParticipant(sharedTarget);
              sharedTarget.vit = Math.max(0, Number(sharedTarget.vit || 0) - sharedDamage);
              logParts.push(
                `[分摊结算] ${sharedTarget.name || '队友'}替${targetChar.name || '目标'}承受了 ${sharedDamage} 点伤害。`,
              );
              if (sharedTarget.vit <= 0) {
                const reviveLog = triggerReviveEffect(sharedTarget, sharedTarget.name || '队友');
                if (reviveLog) logParts.push(reviveLog);
              }
            });
          }
          const interruptLog = resolveCastInterruptOnDamage(
            targetChar,
            attackAction,
            appliedDamage,
            settleResult,
            targetChar.name || `目标${index + 1}`,
          );
          if (interruptLog) logParts.push(interruptLog);
          if (targetChar.vit <= 0) {
            const reviveLog = triggerReviveEffect(targetChar, targetChar.name || `目标${index + 1}`);
            if (reviveLog) logParts.push(reviveLog);
          }
          if (targetEntry?.kind === 'primary' || (index === 0 && !primaryAppliedDamage)) {
            primaryAppliedDamage = appliedDamage;
          }
          totalAppliedDamage += appliedDamage;
        });
        return {
          log: logParts.join(' '),
          primaryAppliedDamage,
          totalAppliedDamage,
        };
      }

      // ==========================================
      // 📍 战斗生存/失能判定
      // ==========================================
      function getCombatHpValue(char) {
        const stats = char?.属性 && typeof char.属性 === 'object' ? char.属性 : char || {};
        return Math.max(0, Number(char?.vit ?? stats.vit ?? char?.HP ?? stats.HP ?? 0));
      }

      function getCombatHpMaxValue(char) {
        const stats = char?.属性 && typeof char.属性 === 'object' ? char.属性 : char || {};
        return Math.max(1, Number(char?.vit_max ?? stats.vit_max ?? char?.HP上限 ?? stats.HP上限 ?? 1));
      }

      function getCombatStaminaValue(char) {
        const stats = char?.属性 && typeof char.属性 === 'object' ? char.属性 : char || {};
        return Math.max(0, Number(char?.sta ?? stats.sta ?? char?.体力 ?? stats.体力 ?? 0));
      }

      function getCombatStaminaMaxValue(char) {
        const stats = char?.属性 && typeof char.属性 === 'object' ? char.属性 : char || {};
        return Math.max(1, Number(char?.sta_max ?? stats.sta_max ?? char?.体力上限 ?? stats.体力上限 ?? 1));
      }

      function getCombatHpRatio(char) {
        return getCombatHpValue(char) / getCombatHpMaxValue(char);
      }

      function getCombatStaminaRatio(char) {
        return getCombatStaminaValue(char) / getCombatStaminaMaxValue(char);
      }

      function isCombatUnitAlive(char) {
        return getCombatHpValue(char) > 0;
      }

      function isCombatUnitAbleToFight(char) {
        return isCombatUnitAlive(char) && getCombatStaminaValue(char) > 0;
      }

      function syncCombatActionState(char) {
        if (!char || typeof char !== 'object') return;
        if (!char.状态 || typeof char.状态 !== 'object') char.状态 = {};
        if (!isCombatUnitAlive(char)) {
          char.状态.行动 = '无法行动';
          return;
        }
        if (!isCombatUnitAbleToFight(char)) {
          char.状态.行动 = '昏迷';
          return;
        }
        char.状态.行动 = '战斗';
      }

      function getCombatTargetSpeciesFlags(char = {}) {
        const social = char?.社交 && typeof char.社交 === 'object' ? char.社交 : {};
        const factionMap = social?.势力 && typeof social.势力 === 'object' ? social.势力 : {};
        const factionNames = Object.keys(factionMap);
        const stats = char?.属性 && typeof char.属性 === 'object' ? char.属性 : char || {};
        const age = Math.max(0, Number(stats?.age ?? stats?.年龄 ?? 0));
        const isBeast =
          factionNames.includes('魂兽一族') ||
          factionNames.some(name => String(name || '').includes('魂兽')) ||
          age >= 100;
        const isAbyss =
          factionNames.includes('深渊生物') ||
          factionNames.some(name => String(name || '').includes('深渊'));
        return {
          isBeast,
          isAbyss,
          isBeastOrAbyss: isBeast || isAbyss,
        };
      }

      function buildFrontEndBattleOutcome(attacker, defender, options = {}) {
        const attackerAlive = isCombatUnitAlive(attacker);
        const defenderAlive = isCombatUnitAlive(defender);
        const attackerAbleToFight = isCombatUnitAbleToFight(attacker);
        const defenderAbleToFight = isCombatUnitAbleToFight(defender);
        const unresolvedReason = String(options.unresolvedReason || '').trim();
        const formalEncounter = options.formalEncounter !== false;
        const outcome = {
          type: '未分胜负',
          label: '对峙未决',
          formalEncounter,
          unresolvedReason,
          attackerAlive,
          defenderAlive,
          attackerAbleToFight,
          defenderAbleToFight,
          isVictory: false,
          isDefeat: false,
          isDraw: false,
          isUnresolved: false,
          isGeneralVictory: false,
          isLethalCandidate: false,
        };

        if (!attackerAbleToFight && !defenderAbleToFight) {
          outcome.type = '两败俱伤';
          outcome.label = attackerAlive || defenderAlive ? '双方同时失能' : '同归于尽';
          outcome.isDraw = true;
          return outcome;
        }

        if (!defenderAbleToFight) {
          outcome.type = defenderAlive ? '一般胜利' : '致命压制待裁断';
          outcome.label = defenderAlive ? '制服取胜' : '致命压制待裁断';
          outcome.isVictory = true;
          outcome.isGeneralVictory = defenderAlive;
          outcome.isLethalCandidate = !defenderAlive;
          return outcome;
        }

        if (!attackerAbleToFight) {
          outcome.type = '失败';
          outcome.label = attackerAlive ? '力竭落败' : '重创败退';
          outcome.isDefeat = true;
          return outcome;
        }

        outcome.isUnresolved = true;
        if (unresolvedReason === 'single_round_limit') {
          outcome.label = '单回合试探';
        } else if (unresolvedReason === 'simulation_stopped') {
          outcome.label = '续推中断';
        } else if (unresolvedReason === 'external_interrupt') {
          outcome.label = '外界中断';
        }
        return outcome;
      }

      // ==========================================
      // 📍 核心结算区：动作博弈与交锋
      // ==========================================
      function calculateReactionRatio(attacker, defender, playerAction, combatData) {
        const atkCombat = attacker?.状态效果
          ? Object.values(attacker.状态效果).map(c => c?.战斗效果 || {})
          : [];
        const totalAtkSpeedBonus = atkCombat.reduce((sum, ce) => sum + Number(ce.attacker_speed_bonus || 0), 0);
        const totalCastSpeedBonus = atkCombat.reduce((sum, ce) => sum + Number(ce.cast_speed_bonus || 0), 0);
        const totalCastSpeedPenalty = atkCombat.reduce((sum, ce) => sum + Number(ce.cast_speed_penalty || 0), 0);

        let castPenalty = Math.min(
          0.9,
          Math.max(0, playerAction.cast_time / 100 - totalCastSpeedBonus + totalCastSpeedPenalty),
        );
        let attackerSpeed = attacker.agi * (1 - castPenalty) + totalAtkSpeedBonus;

        let defenderReaction =
          defender.agi * (defender.temp_agi_mult || 1.0) +
          defender.men_max +
          (defender.temp_reaction_bonus || 0) -
          (defender.temp_reaction_penalty || 0);
        let ratio = defenderReaction / Math.max(1, attackerSpeed);

        if (defender.temp_cannot_react) ratio = 0;

        if (combatData && combatData.先攻 !== '无' && combatData.先攻 !== defender.name) {
          ratio *= 0.5;
        }

        return ratio;
      }

      function estimateIncomingActionThreat(attacker, defender, playerAction, combatData) {
        const skill = playerAction?.skill && typeof playerAction.skill === 'object' ? playerAction.skill : null;
        const defaultThreat = {
          targetHitsDefender: false,
          projectedDamage: 0,
          projectedDamageRatio: 0,
          projectedRemainingHp: Math.max(0, Number(defender?.vit || 0)),
          lethalRisk: false,
          severeDamage: false,
          moderateDamage: false,
          severeControl: false,
          shieldBreakThreat: false,
          antiHealThreat: false,
          skillSealThreat: false,
          dotDetonateThreat: false,
          attackerTier: getCombatUnitTierNumber(attacker),
          bypassesInvincible: getCombatUnitTierNumber(attacker) >= 100,
        };
        if (!attacker || !defender || !skill) return defaultThreat;

        const runtimeMeta = getSkillRuntimeMeta(skill);
        const targetContext = resolveSkillTargetContext(skill, attacker, defender, combatData, getPrimaryDamageEffect(skill));
        const targetHitsDefender = targetContext.targetSet.some(target => isCombatUnitIdentityMatch(target, defender?.name || defender));
        if (!targetHitsDefender) return defaultThreat;

        const attackerFinalStat = attacker.final || buildCombatFinalStats(attacker);
        const defenderFinalStat = defender.final || buildCombatFinalStats(defender);
        const pClash = getPrimaryDamageEffect(skill);
        const pStateCalc = getPrimaryStateCalc(skill);
        const pStateFlags = getPrimaryStateFlags(skill);
        const attackerConditionEffects = attacker.状态效果
          ? Object.values(attacker.状态效果).map(c => c?.战斗效果 || {})
          : [];
        const defenderConditionEffects = defender.状态效果
          ? Object.values(defender.状态效果).map(c => c?.战斗效果 || {})
          : [];
        const skillPower = Math.max(0, Number(pClash?.威力倍率 || 0));
        const dmgType = String(pClash?.伤害类型 || '物理近战');
        const conditionArmorPen = attackerConditionEffects.reduce((sum, ce) => {
          const raw = Number(ce.armor_pen || 0);
          return sum + (Math.abs(raw) <= 1 ? raw * 100 : raw);
        }, 0);
        let projectedDamage = 0;
        let actualDef = Number(defenderFinalStat.def || defender.def || 1) * (1 - ((pClash?.穿透修饰 || 0) + conditionArmorPen) / 100);
        actualDef = Math.max(1, actualDef);
        const soulDriveScale = getSoulDriveScale(attacker, defender);
        if (dmgType === '物理近战') {
          projectedDamage = skillPower * (Number(attackerFinalStat.str || attacker.str || 0) / actualDef) * soulDriveScale;
        } else if (dmgType === '能量AOE') {
          projectedDamage = skillPower * (Number(attackerFinalStat.men_max || attacker.men_max || 0) / actualDef) * soulDriveScale;
        } else if (dmgType === '纯精神冲击') {
          projectedDamage =
            skillPower *
            (Number(attackerFinalStat.men_max || attacker.men_max || 0) /
              Math.max(1, Number(defenderFinalStat.men_max || defender.men_max || 1)));
        }
        const attackerFinalDamageMult = attackerConditionEffects.reduce(
          (mult, ce) => mult * Number(ce.final_damage_mult || 1.0),
          1.0,
        );
        const attackerFinalDamageBonus = attackerConditionEffects.reduce(
          (sum, ce) => sum + Number(ce.final_damage_bonus || 0),
          0,
        );
        const defenderReduction = Math.min(
          0.9,
          defenderConditionEffects.reduce((maxVal, ce) => Math.max(maxVal, Number(ce.damage_reduction || 0)), 0),
        );
        const extraTrueDamage = attackerConditionEffects.reduce(
          (sum, ce) =>
            sum + Math.floor((Number(attackerFinalStat.men_max || attacker.men_max || 0) || 0) * Number(ce.bonus_true_damage_ratio || 0)),
          0,
        );
        projectedDamage = projectedDamage * (1 - defenderReduction) * attackerFinalDamageMult + attackerFinalDamageBonus + extraTrueDamage;
        const shieldPressure = collectShieldConditionEntries(defender).reduce((sum, entry) => sum + Number(entry.shieldValue || 0), 0);
        const projectedDamageAfterShield = Math.max(0, Math.floor(projectedDamage - shieldPressure));
        const currentHp = Math.max(0, Number(defender.vit || 0));
        const maxHp = Math.max(1, Number(defender.vit_max || 1));
        const projectedDamageRatio = projectedDamageAfterShield / maxHp;
        const projectedRemainingHp = Math.max(0, currentHp - projectedDamageAfterShield);
        const executeEffect = getSkillEffects(skill).find(effect => effect?.机制 === '斩杀补伤') || null;
        let executeThreat = false;
        if (executeEffect) {
          const judgeKey = String(executeEffect.判定属性 || 'hp_ratio');
          const threshold = Number(executeEffect.判定阈值 ?? 0.2);
          const attackerValue = getMechanismJudgeValue(attacker, attackerFinalStat, judgeKey);
          const defenderValue = getMechanismJudgeValue(defender, defenderFinalStat, judgeKey);
          if (['vit_ratio', 'hp_ratio', 'sp_ratio', 'men_ratio'].includes(judgeKey)) executeThreat = defenderValue <= Math.max(threshold, 0.35);
          else executeThreat = attackerValue / Math.max(1, defenderValue) >= threshold;
        }
        const severeControl =
          pStateCalc.skip_turn === true ||
          pStateCalc.cannot_react === true ||
          pStateCalc.skill_seal === true ||
          Number(pStateCalc.lock_level || 0) >= 2 ||
          Number(pStateCalc.reaction_penalty || 0) >= 0.2 ||
          Number(pStateCalc.cast_speed_penalty || 0) >= 0.2 ||
          hasSkillMechanism(skill, ['硬控', '催眠', '幻境', '封技']);
        const enemySnapshot = buildConditionTacticalSnapshot(defender);
        const shieldBreakThreat =
          enemySnapshot.hasShielded &&
          (hasSkillMechanism(skill, ['斩盾']) ||
            Number(pClash?.穿透修饰 || 0) >= 20 ||
            /破甲|穿透|粉碎|斩盾/.test(String(skill?.name || '')));
        const antiHealThreat =
          hasSkillMechanism(skill, ['禁疗', '治疗反转']) ||
          Number(pStateCalc.heal_block_ratio || 0) > 0 ||
          Number(pStateCalc.heal_inversion_ratio || 0) > 0;
        const dotDetonateThreat = hasSkillMechanism(skill, ['引爆持续伤害']) && enemySnapshot.debuffCount > 0;
        const skillSealThreat = hasSkillMechanism(skill, ['封技']) || pStateCalc.skill_seal === true;
        const lethalRisk =
          projectedDamageAfterShield >= currentHp * 0.95 ||
          projectedRemainingHp <= 0 ||
          (executeThreat && currentHp / maxHp <= 0.45);
        const severeDamage =
          lethalRisk ||
          projectedDamageRatio >= 0.3 ||
          projectedDamageAfterShield >= currentHp * 0.5 ||
          skillPower >= 260;
        const moderateDamage =
          severeDamage ||
          projectedDamageRatio >= 0.18 ||
          projectedDamageAfterShield >= currentHp * 0.28 ||
          skillPower >= 180;
        return {
          ...defaultThreat,
          targetHitsDefender,
          projectedDamage: projectedDamageAfterShield,
          projectedDamageRatio: Number(projectedDamageRatio.toFixed(4)),
          projectedRemainingHp,
          lethalRisk,
          severeDamage,
          moderateDamage,
          severeControl,
          shieldBreakThreat,
          antiHealThreat,
          skillSealThreat,
          dotDetonateThreat,
        };
      }

      function formatBattleTickToCalendarDateText(tickValue) {
        const safeTick = Math.max(0, Number(tickValue || 0));
        const totalMinutes = safeTick * 10;
        const days = Math.floor(totalMinutes / (24 * 60));
        const years = Math.floor(days / 360);
        const months = Math.floor((days % 360) / 30) + 1;
        const currentDay = (days % 30) + 1;
        const remainderMinutes = totalMinutes % (24 * 60);
        const hours = Math.floor(remainderMinutes / 60);
        const mins = remainderMinutes % 60;
        return `斗罗历${20000 + years}年${months}月${currentDay}日 ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      }

      function buildSkillCreationPatchBundle(skill, inventory = {}, ownerName = '') {
        const effects = Array.isArray(skill?._效果数组) ? skill._效果数组 : [];
        const creationEffects = effects.filter(effect => ['生成造物', '造物生成'].includes(String(effect?.机制 || '')));
        if (!creationEffects.length) return { patchOps: [], log: '' };

        const patchOps = [];
        const logs = [];
        const preferredOwnerName = String(window.BattleUIBridge?.getMVU('sys.玩家名') || '').trim();
        const currentTick = Number(window.BattleUIBridge?.getMVU('world.时间.tick') || 0);
        const resolvedOwnerName = String(ownerName || preferredOwnerName || '').trim();
        if (!resolvedOwnerName) return { patchOps: [], log: '' };
        const ownerPath = `/char/${escapeJsonPointerSegment(resolvedOwnerName)}/背包`;

        creationEffects.forEach(effect => {
          const itemName = String(skill?.魂技名 || effect?.魂技名 || skill?.name || '临时造物').trim() || '临时造物';
          const escapedItemName = escapeJsonPointerSegment(itemName);
          const addCount = Math.max(1, Number(effect?.数量 || 1));
          const template = deepClone(effect?.背包模板 || {});
          const itemType = String(effect?.产物类型 || '魂技造物');
          const triggerMode = String(effect?.触发方式 || (itemType === '食物' ? '食用' : '使用'));
          const relativeExpiryTick = Math.max(0, Number(effect?.有效期tick || 0));
          const nextItem = {
            ...template,
            数量: addCount,
            类型: itemType,
            触发方式: triggerMode,
            使用效果: deepClone(Array.isArray(effect?.使用效果) ? effect.使用效果 : []),
            来源技能: String(template?.来源技能 || skill?.魂技名 || effect?.魂技名 || itemName),
          };
          if (relativeExpiryTick > 0) {
            nextItem.有效期至tick = currentTick + relativeExpiryTick;
            nextItem.有效期至 = formatBattleTickToCalendarDateText(nextItem.有效期至tick);
          } else {
            nextItem.有效期至tick = 0;
            nextItem.有效期至 = '无';
          }
          if (!nextItem.描述 && template?.描述) nextItem.描述 = template.描述;

          const currentItem = inventory[itemName];
          const itemPath = `${ownerPath}/${escapedItemName}`;
          const nextItemValue =
            currentItem && typeof currentItem === 'object'
              ? {
                  ...deepClonePlain(currentItem),
                  ...nextItem,
                  数量: Number(currentItem.数量 || 0) + addCount,
                }
              : nextItem;
          appendJsonPatchDiff(patchOps, itemPath, currentItem, nextItemValue);

          if (itemType === '食物') logs.push(`生成了可食用造物【${itemName}】×${addCount}`);
          else logs.push(`生成了临时造物【${itemName}】×${addCount}`);
        });

        return {
          patchOps,
          log: logs.length ? ` [造物生成] ${logs.join('，')}。` : '',
        };
      }

      function executeClash(playerAction, npcAction, combatData) {
        hydrateCombatData(combatData);
        let attacker = combatData.参战者.player;
        let attackerFinalStat = attacker.final || attacker;
        let defender = combatData.参战者.enemy;
        let defenderFinalStat = defender.final || defender;
        let result = { dmg: 0, desc: '', extraPatchOps: [], targetResults: [] };

        playerAction.skill = normalizeSkillData(
          playerAction.skill || {
            name: '普通攻击',
            技能类型: '输出',
            _效果数组: [
              { 机制: '系统基础', 消耗: '无', 对象: '敌方/单体', 技能类型: '输出', cast_time: 10 },
              { 机制: '直接伤害', 目标: '敌方单体', 威力倍率: 100, 伤害类型: '物理近战', 穿透修饰: 0 },
            ],
          },
          playerAction.skill?.name || '普通攻击',
        );
        if (npcAction.skill) {
          npcAction.skill = normalizeSkillData(
            npcAction.skill,
            npcAction.skill.name || npcAction.skill.技能名称 || '未知技能',
          );
        }

        const getEffect = (sk, types) => getSkillEffects(sk).find(e => types.includes(e.机制)) || {};

        let pClash = getEffect(playerAction.skill, ['直接伤害', '多段伤害', '持续伤害', '延迟爆发']);
        let pState = getEffect(playerAction.skill, ['状态挂载']);
        if (!pState || typeof pState !== 'object' || Array.isArray(pState)) pState = {};
        if (!pState.状态名称) pState.状态名称 = '无';
        if (!pState.特殊机制标识) pState.特殊机制标识 = '无';
        if (!pState.目标) pState.目标 = getSkillTarget(playerAction.skill);
        if (!pState.面板修改比例 || typeof pState.面板修改比例 !== 'object') pState.面板修改比例 = {};
        if (!pState.计算层效果 || typeof pState.计算层效果 !== 'object')
          pState.计算层效果 = createEmptyCombatEffectMap();
        if (typeof pState.持续回合 !== 'number') pState.持续回合 = Number(pState.持续回合 || 0);
        let nClash = getEffect(npcAction.skill, [
          '直接伤害',
          '多段伤害',
          '持续伤害',
          '延迟爆发',
          '护盾',
          '减伤',
          '格挡',
        ]);

        applyRuntimeMechanismEffects(
          playerAction.skill,
          attacker,
          attackerFinalStat,
          defender,
          defenderFinalStat,
          pState,
        );

        let aStr = attackerFinalStat.str;
        let aAgi = attackerFinalStat.agi;
        let dAgi = defenderFinalStat.agi;

        let hasSuperArmor = false;
        if (attacker.状态效果) {
          for (let key in attacker.状态效果) {
            if (
              attacker.状态效果[key].战斗效果?.super_armor === true ||
              key.includes('霸体') ||
              key.includes('真身')
            )
              hasSuperArmor = true;
          }
        }

        const npcSkillType = getSkillType(npcAction.skill);
        if (npcAction.type === '危机自保' && npcSkillType === '控制' && getSkillCastTime(npcAction.skill) < 10) {
          if (defenderFinalStat.men_max > attackerFinalStat.men_max || dAgi > aAgi) {
            if (hasSuperArmor) {
              result.desc = `NPC释放[${npcAction.skill.name}]试图打断，但玩家处于霸体状态，强行免疫了控制！`;
            } else {
              result.desc = `NPC释放[${npcAction.skill.name}]成功打断玩家施法！玩家遭到反噬。`;
              return result;
            }
          }
        }

        const actorCharData = attacker?.name ? window.BattleUIBridge?.getMVU(`char.${attacker.name}`) : null;
        const preferredPlayerName = String(window.BattleUIBridge?.getMVU('sys.玩家名') || '').trim();
        const attackerName = String(attacker?.name || preferredPlayerName || '').trim();
        const canPersistCreation = !!attackerName;
        const creationPatchBundle = buildSkillCreationPatchBundle(
          playerAction.skill,
          actorCharData?.背包 || attacker?.背包 || {},
          attackerName,
        );
        if (canPersistCreation && creationPatchBundle.patchOps.length > 0) {
          result.extraPatchOps = creationPatchBundle.patchOps;
          result.desc += creationPatchBundle.log;
          const hasDirectClash = Number(pClash.威力倍率 || 0) > 0;
          const hasStateApply = String(pState?.状态名称 || '无') !== '无';
          if (!hasDirectClash && !hasStateApply) return result;
        }

        const skillRuntimeMeta = getSkillRuntimeMeta(playerAction.skill);
        let grazeMultiplier = 1.0;

        const pCalc = pState.计算层效果 || {};
        const currentSkillHitBonus = Number(pCalc.hit_bonus || 0);
        const currentSkillHitPenalty = Number(pCalc.hit_penalty || 0);
        const currentSkillDodgePenalty = Number(pCalc.dodge_penalty || 0);
        const currentSkillLockLevel = Number(pCalc.lock_level || 0);
        let attackerConditionEffects = attacker.状态效果
          ? Object.values(attacker.状态效果).map(c => c?.战斗效果 || {})
          : [];
        const attackerIsSilenced = attackerConditionEffects.some(ce => ce?.silence === true);
        const attackerIsDisarmed = attackerConditionEffects.some(ce => ce?.disarm === true);
        const attackerIsBlinded = attackerConditionEffects.some(ce => ce?.blind === true);
        const attackerIsSkillSealed = attackerConditionEffects.some(ce => ce?.skill_seal === true);
        const attackerInterruptBonus = attackerConditionEffects.reduce(
          (sum, ce) => sum + Number(ce?.interrupt_bonus || 0),
          0,
        );
        const actionEffects = getSkillEffects(playerAction.skill);
        const directHealEffect = actionEffects.find(effect => isBattleRecoverEffect(effect, ['vit'])) || null;
        const directSpEffect = actionEffects.find(effect => isBattleRecoverEffect(effect, ['sp'])) || null;
        const directMenEffect = actionEffects.find(effect => isBattleRecoverEffect(effect, ['men'])) || null;
        const directCleanseEffect = actionEffects.find(effect => ['解控', '净化'].includes(effect?.机制)) || null;
        const directDispelEffect = actionEffects.find(effect => effect?.机制 === '驱散增益') || null;
        const directStealBuffEffect = actionEffects.find(effect => effect?.机制 === '窃取增益') || null;
        const directRevealEffect = actionEffects.find(effect => effect?.机制 === '破隐') || null;
        const directTauntEffect = actionEffects.find(effect => effect?.机制 === '嘲讽') || null;
        const directGuardEffect = actionEffects.find(effect => effect?.机制 === '护卫') || null;
        const directShieldBreakEffect = actionEffects.find(effect => effect?.机制 === '斩盾') || null;
        const directShieldStealEffect = actionEffects.find(effect => effect?.机制 === '窃取护盾') || null;
        const directDotDetonateEffect = actionEffects.find(effect => effect?.机制 === '引爆持续伤害') || null;
        const directStatusTransferEffect = actionEffects.find(effect => effect?.机制 === '状态转移') || null;
        const directVolatileEffect = actionEffects.find(effect => effect?.机制 === '高波动随机值') || null;
        const directExecuteEffect = actionEffects.find(effect => effect?.机制 === '斩杀补伤') || null;
        const directDamageToHealEffect = actionEffects.find(effect => effect?.机制 === '伤害转回复') || null;
        const directShieldEffect = actionEffects.find(effect => effect?.机制 === '护盾') || null;
        const directFieldEffect = actionEffects.find(effect => effect?.机制 === '召唤与场地') || null;
        const directCopyEffect = actionEffects.find(effect => effect?.机制 === '复制') || null;
        const directStateExchangeEffect = actionEffects.find(effect => effect?.机制 === '状态交换') || null;
        const selfMirrorEffect = actionEffects.find(effect => effect?.机制 === '自身也受影响') || null;
        const directRandomTargetEffect = actionEffects.find(effect => effect?.机制 === '随机目标') || null;
        const directSelfSacrificeEffect = actionEffects.find(effect => effect?.机制 === '自残换收益') || null;
        const skillName = String(
          playerAction?.skill?.name || playerAction?.skill?.技能名称 || playerAction?.action_type || '',
        );
        const fusionProfile = getFusionBattleProfileFromSkill(playerAction.skill);
        if (directRevealEffect) {
          const revealTargets = resolveSkillEffectTargetCharacters(
            playerAction.skill,
            directRevealEffect,
            attacker,
            defender,
            combatData,
          );
          const revealLogs = [];
          revealTargets.forEach(revealTarget => {
            const removedStealth = removeStealthConditions(revealTarget, Number(directRevealEffect.破隐层级 || 99));
            if (removedStealth.length > 0) {
              revealLogs.push(`${revealTarget === attacker ? '自身' : revealTarget.name}现出身形，失去了[${removedStealth.join('/')}]`);
            }
          });
          if (revealLogs.length > 0) {
            result.desc += ` [破隐生效] ${revealLogs.join('；')}。`;
            attackerConditionEffects = attacker.状态效果
              ? Object.values(attacker.状态效果).map(c => c?.战斗效果 || {})
              : [];
          }
        }
        const isBasicAttack =
          !playerAction?.skill || skillName === '普通攻击' || playerAction?.action_type === '常规攻击';
        const isPhysicalMeleeAction = String(pClash.伤害类型 || '') === '物理近战';
        const mirrorEffectToSelf = effect => (effect ? { ...effect, 目标: '自身', 对象: '自身' } : null);
        if (playerAction?.skill) delete playerAction.skill._runtime_random_target;
        const conditionRandomTargetRate = Math.max(
          0,
          ...attackerConditionEffects.map(ce => Number(ce?.random_target_rate || 0)),
        );
        const directRandomTargetRate = Number(directRandomTargetEffect?.偏移概率 || 0);
        const effectiveRandomTargetRate = Math.max(directRandomTargetRate, conditionRandomTargetRate);
        if (effectiveRandomTargetRate > 0) {
          const originalTargetModel = normalizeBattleSkillTargetModel(skillRuntimeMeta.目标模型 || '敌方单体', '敌方单体');
          if (!['自身', '友方单体', '友方群体'].includes(originalTargetModel)) {
            const redirectChance = Math.max(0, Math.min(1, effectiveRandomTargetRate));
            const redirectedToSelf = Math.random() < redirectChance;
            playerAction.skill._runtime_random_target = redirectedToSelf
              ? '自身'
              : mapBattleTargetModelToCombatTarget(originalTargetModel);
            const sourceTag = directRandomTargetRate >= conditionRandomTargetRate ? '随机目标' : '认知扭曲';
            result.desc += redirectedToSelf
              ? ` [${sourceTag}] 技能轨迹紊乱，本次目标偏转为自身。`
              : ` [${sourceTag}] 技能轨迹紊乱，但仍锁定原目标。`;
          }
        }
        const effectTargetsSelf = effect =>
          !!effect && resolveSkillEffectTargetCharacter(playerAction.skill, effect, attacker, defender) === attacker;
        const damageTargetContext = resolveSkillTargetContext(playerAction.skill, attacker, defender, combatData, pClash);
        const resolvedDamageTargets = dedupeCombatTargetList(damageTargetContext.targetSet).filter(Boolean);
        const primaryResolvedTarget = damageTargetContext.primaryTarget || null;
        const targetsFriendlySkill = ['自身', '友方单体', '友方群体'].includes(damageTargetContext.targetModel);
        const hostileTargetRedirectedToSelf =
          String(playerAction?.skill?._runtime_random_target || '') === '自身' &&
          ['敌方单体', '敌方群体', '全场'].includes(normalizeBattleSkillTargetModel(skillRuntimeMeta.目标模型, '敌方单体'));
        if (attackerIsSilenced && !isBasicAttack) {
          result.desc = `[沉默压制] ${attacker.name || '攻击方'}被沉默，无法顺利释放[${skillName || '技能'}]！`;
          result.interrupt_bonus = attackerInterruptBonus;
          return result;
        }
        if (attackerIsDisarmed && (isBasicAttack || isPhysicalMeleeAction)) {
          result.desc = `[缴械压制] ${attacker.name || '攻击方'}被缴械，无法完成${isBasicAttack ? '普通攻击' : '近战技'}！`;
          result.interrupt_bonus = attackerInterruptBonus;
          return result;
        }
        if (attackerIsSkillSealed && !isBasicAttack) {
          result.desc = `[封技压制] ${attacker.name || '攻击方'}的技能回路被封死，当前无法施展[${skillName || '技能'}]！`;
          result.interrupt_bonus = attackerInterruptBonus;
          return result;
        }
        const attackerHitBonus = attackerConditionEffects.reduce((sum, ce) => sum + Number(ce.hit_bonus || 0), 0);
        const attackerHitPenalty =
          attackerConditionEffects.reduce((sum, ce) => sum + Number(ce.hit_penalty || 0), 0) +
          (attackerIsBlinded ? 0.35 : 0);

        let remainPower = pClash.威力倍率 || 0;

        if (npcAction.type === '强势对轰') {
          remainPower -= nClash.威力倍率 || 0;
          if (remainPower <= 0) {
            result.desc = `NPC的[${npcAction.skill.name}]威力更胜一筹，碾碎了玩家的攻击！`;
            return result;
          }
          result.desc = `双方对轰！玩家威力占优，余威继续命中。`;
        } else if (npcAction.type === '危机自保' && npcSkillType === '防御') {
          remainPower -= nClash.威力倍率 || 0;
          if (remainPower <= 0) {
            result.desc = `NPC的防御技能完美挡下了这一击。`;
            return result;
          }
          result.desc = `攻击突破了NPC的防御技能阻碍。`;
        }

        let dmgType = pClash.伤害类型 || '物理近战';

        const conditionArmorPen = attackerConditionEffects.reduce((sum, ce) => {
          const raw = Number(ce.armor_pen || 0);
          return sum + (Math.abs(raw) <= 1 ? raw * 100 : raw);
        }, 0);
        const isAOE =
          resolvedDamageTargets.length > 1 || damageTargetContext.targetModel === '全场' || pClash.伤害类型 === '纯精神冲击';
        let fluctuation = 0.9 + Math.random() * 0.2;
        if (directVolatileEffect) {
          const low = Number(directVolatileEffect.波动下限 ?? 0.5);
          const high = Number(directVolatileEffect.波动上限 ?? 1.8);
          if (Number.isFinite(low) && Number.isFinite(high) && high > low) {
            fluctuation = low + Math.random() * (high - low);
            result.desc += ` [高波动] 技能威力剧烈波动，本次倍率:${fluctuation.toFixed(2)}。`;
          }
        }
        const totalFinalDamageMult = attackerConditionEffects.reduce(
          (mult, ce) => mult * Number(ce.final_damage_mult || 1.0),
          1.0,
        );
        const totalFinalDamageBonus = attackerConditionEffects.reduce(
          (sum, ce) => sum + Number(ce.final_damage_bonus || 0),
          0,
        );
        const totalTrueDamageRatio = attackerConditionEffects.reduce(
          (sum, ce) => sum + Number(ce.bonus_true_damage_ratio || 0),
          0,
        );
        const directDamageToHealRatio = Number(directDamageToHealEffect?.转换比例 || 0);
        const totalLifeStealRatio =
          attackerConditionEffects.reduce((sum, ce) => sum + Number(ce.life_steal_ratio || 0), 0) +
          Number(pClash.吸血比例 || 0) +
          directDamageToHealRatio;
        const extraTrueDamagePerTarget =
          totalTrueDamageRatio > 0
            ? Math.floor((attackerFinalStat.men_max || attacker.men_max || 0) * totalTrueDamageRatio)
            : 0;
        if (extraTrueDamagePerTarget > 0) {
          result.desc += ` [法则追伤] 每个命中目标额外附加 ${extraTrueDamagePerTarget} 点真实伤害。`;
        }
        if (Number(pClash.威力倍率 || 0) > 0 && !resolvedDamageTargets.length) {
          result.desc += ` [索敌失败] 当前没有可被命中的有效目标。`;
        }

        const resolveProjectedDamageAgainstTarget = (targetObj, index) => {
          if (!targetObj) return null;
          bindCombatParticipant(targetObj);
          const targetFinalStat = targetObj.final || buildCombatFinalStats(targetObj);
          const targetConditionEffects = targetObj.状态效果
            ? Object.values(targetObj.状态效果).map(c => c?.战斗效果 || {})
            : [];
          const targetName = targetObj === attacker ? '自身' : targetObj.name || `目标${index + 1}`;
          const targetUsesReactionAction =
            targetObj === primaryResolvedTarget && !targetsFriendlySkill && targetObj !== attacker;
          const targetEffectiveAgi = Number(targetFinalStat.agi || targetObj.agi || 0) * Number(targetObj.temp_agi_mult || 1);
          const targetDodgeBonus = Number(targetObj.temp_dodge_bonus || 0);
          const targetDodgePenalty = Number(targetObj.temp_dodge_penalty || 0) + currentSkillDodgePenalty;
          const targetLockLevel = Number(targetObj.temp_lock_level || 0) + currentSkillLockLevel;
          const localLogParts = [];
          let localGrazeMultiplier = grazeMultiplier;
          const allowEvasion = !targetsFriendlySkill || (hostileTargetRedirectedToSelf && targetObj === attacker);
          if (allowEvasion && remainPower > 0) {
            const hitDelta = currentSkillHitBonus + attackerHitBonus - (currentSkillHitPenalty + attackerHitPenalty);
            if (targetUsesReactionAction && !isAOE && npcAction.type === '伺机闪避') {
              const absoluteDodgeThreshold = (aAgi + attackerFinalStat.men_max) * 1.5;
              if (targetEffectiveAgi + targetDodgeBonus > absoluteDodgeThreshold) {
                localLogParts.push(`[绝对闪避] ${targetName}残影一晃，完全躲过了攻击。`);
                return {
                  target: targetObj,
                  targetName,
                  damage: 0,
                  kind: index === 0 ? 'primary' : 'secondary',
                  logs: localLogParts,
                };
              }
            }
            const dodgeScale = targetUsesReactionAction && !isAOE && npcAction.type === '伺机闪避' ? 50 : 24;
            const grazeWindow = targetUsesReactionAction && !isAOE && npcAction.type === '伺机闪避' ? 30 : 14;
            let dodgeRate = (targetEffectiveAgi / Math.max(1, aAgi + attackerFinalStat.men_max)) * dodgeScale;
            dodgeRate += targetDodgeBonus * 100 - targetDodgePenalty * 100;
            dodgeRate -= hitDelta * 100;
            dodgeRate -= targetLockLevel * 8;
            dodgeRate = Math.max(0, Math.min(targetUsesReactionAction ? 95 : 72, dodgeRate));
            const dodgeRoll = Math.random() * 100;
            if (dodgeRoll < dodgeRate) {
              localLogParts.push(
                targetUsesReactionAction && !isAOE && npcAction.type === '伺机闪避'
                  ? `[主动闪避] ${targetName}凭借敏捷优势惊险躲过了攻击。`
                  : `[闪避判定] ${targetName}提前预判轨迹，规避了本次攻击。`,
              );
              return {
                target: targetObj,
                targetName,
                damage: 0,
                kind: index === 0 ? 'primary' : 'secondary',
                logs: localLogParts,
              };
            }
            if (dodgeRoll < dodgeRate + grazeWindow) {
              const grazePercent = (dodgeRoll - dodgeRate) / Math.max(1, grazeWindow);
              if (targetUsesReactionAction && !isAOE && npcAction.type === '伺机闪避') {
                localGrazeMultiplier = 0.3 + 0.5 * grazePercent;
              } else {
                localGrazeMultiplier = 0.45 + 0.35 * grazePercent;
              }
              localLogParts.push(
                `[擦伤命中] ${targetName}未能完全避开，只承受 ${(localGrazeMultiplier * 100).toFixed(0)}% 伤害。`,
              );
              if (attackerIsBlinded) localLogParts.push(`[目盲干扰] 攻击轨迹受到视觉偏差影响。`);
            }
          }

          let actualDef = Number(targetFinalStat.def || targetObj.def || 1) * (1 - ((pClash.穿透修饰 || 0) + conditionArmorPen) / 100);
          actualDef = Math.max(1, actualDef);
          const soulDriveScale = getSoulDriveScale(attacker, targetObj);
          let projectedDamage = 0;
          if (dmgType === '物理近战') projectedDamage = remainPower * (aStr / actualDef) * soulDriveScale;
          else if (dmgType === '能量AOE')
            projectedDamage = remainPower * (attackerFinalStat.men_max / actualDef) * soulDriveScale;
          else if (dmgType === '纯精神冲击')
            projectedDamage =
              remainPower * ((attackerFinalStat.men_max || attacker.men_max || 0) / Math.max(1, Number(targetFinalStat.men_max || targetObj.men_max || 1)));

          if (targetUsesReactionAction && npcAction.type === '肉体兜底') {
            projectedDamage /= 1.2;
            localLogParts.push(`[肉体兜底] ${targetName}强行收缩防御，用肉身硬抗了这一击。`);
          }

          const activeReactionShield = targetUsesReactionAction ? Math.max(0, Number(nClash.护盾值 || 0)) : 0;
          if (activeReactionShield > 0) {
            projectedDamage = Math.max(0, projectedDamage - activeReactionShield);
            if (projectedDamage === 0) {
              localLogParts.push(`[主动护盾] ${targetName}借临时护盾完全吃下了本次冲击。`);
            } else {
              localLogParts.push(`[主动护盾] ${targetName}先被护盾吸收一部分冲击，余威继续压入本体。`);
            }
          }

          projectedDamage *= fluctuation * localGrazeMultiplier;
          const targetDamageReduction = Math.min(
            0.9,
            targetConditionEffects.reduce((maxVal, ce) => Math.max(maxVal, Number(ce.damage_reduction || 0)), 0),
          );
          projectedDamage = projectedDamage * (1 - targetDamageReduction) * totalFinalDamageMult + totalFinalDamageBonus;
          if (extraTrueDamagePerTarget > 0) projectedDamage += extraTrueDamagePerTarget;

          if (directExecuteEffect) {
            const judgeKey = String(directExecuteEffect.判定属性 || 'vit_ratio');
            const threshold = Number(directExecuteEffect.判定阈值 ?? 0.2);
            let executeSuccess = true;
            if (judgeKey) {
              const attackerValue = getMechanismJudgeValue(attacker, attackerFinalStat, judgeKey);
              const defenderValue = getMechanismJudgeValue(targetObj, targetFinalStat, judgeKey);
              if (['vit_ratio', 'hp_ratio', 'sp_ratio', 'men_ratio'].includes(judgeKey))
                executeSuccess = defenderValue <= threshold;
              else executeSuccess = attackerValue / Math.max(1, defenderValue) >= threshold;
            }
            const execPayload = executeSuccess ? directExecuteEffect.成功参数 || {} : directExecuteEffect.失败参数 || {};
            const execMult = Number(execPayload.final_damage_mult || 1);
            const execBonus = Number(execPayload.final_damage_bonus || 0);
            if (execMult !== 1 || execBonus !== 0) {
              projectedDamage = projectedDamage * execMult + execBonus;
              if (executeSuccess) localLogParts.push(`[斩杀补伤] ${targetName}跌入收割阈值，追加杀伤生效。`);
            }
          }

          if (fusionProfile && projectedDamage > 0) {
            projectedDamage *= Number(fusionProfile.damageMult || 1);
          }

          return {
            target: targetObj,
            targetName,
            damage: Math.max(0, Math.floor(projectedDamage)),
            kind: index === 0 ? 'primary' : 'secondary',
            logs: localLogParts,
          };
        };

        const projectedTargetEntries = resolvedDamageTargets
          .map((targetObj, index) => resolveProjectedDamageAgainstTarget(targetObj, index))
          .filter(Boolean);
        result.targetResults = projectedTargetEntries.map(entry => ({
          target: entry.target,
          targetName: entry.targetName,
          damage: entry.damage,
          kind: entry.kind,
        }));
        const projectedLogs = projectedTargetEntries.flatMap(entry => entry.logs || []).filter(Boolean);
        if (projectedLogs.length > 0) result.desc += ` ${projectedLogs.join(' ')}`;
        if (fusionProfile && projectedTargetEntries.some(entry => Number(entry.damage || 0) > 0)) {
          result.desc += ` [融合共鸣] 武魂交叠后的极限共振将杀伤再度推高。`;
        }
        refreshSettleResultProjectedDamage(result);
        result = applyHighTierMechanics(attacker, defender, playerAction, result);

        if (directSelfSacrificeEffect && Number(directSelfSacrificeEffect.体力代价 || 0) > 0) {
          result.desc += ` [自残换收益] 额外献祭 ${Number(directSelfSacrificeEffect.体力代价 || 0)} 点体力，换取 x${Number(directSelfSacrificeEffect.增伤倍率 || 1.25).toFixed(2)} 威力。`;
        }
        if (isAOE && Array.isArray(result.targetResults) && result.targetResults.length > 1) {
          result.desc += ` [群体索敌] 共锁定 ${result.targetResults.length} 个目标，逐个独立结算。`;
        }

        if (Number(result.totalProjectedDamage || 0) > 0 && totalLifeStealRatio > 0 && !Number(result.backlash_dmg || 0)) {
          const lifeStealAmount = Math.floor(Number(result.totalProjectedDamage || 0) * totalLifeStealRatio);
          if (lifeStealAmount > 0) {
            attacker.vit = Math.min(
              attackerFinalStat.vit_max || attacker.vit_max || attacker.vit,
              attacker.vit + lifeStealAmount,
            );
            result.desc +=
              directDamageToHealRatio > 0
                ? ` [伤转回生] 玩家将部分伤害转化为回复，额外恢复了 ${lifeStealAmount} 点HP。`
                : ` [吸取反哺] 玩家额外恢复了 ${lifeStealAmount} 点HP。`;
          }
        }

        if (Number(result.backlash_dmg || 0) > 0) {
          const backlashDamage = Math.max(0, Math.floor(Number(result.backlash_dmg || 0)));
          attacker.vit = Math.max(0, Number(attacker.vit || 0) - backlashDamage);
          result.desc += ` [反噬结算] 玩家额外承受了 ${backlashDamage} 点反噬伤害。`;
        }
        if (Number(result.totalProjectedDamage || 0) > 0) {
          result.desc += isAOE
            ? ` 本次共投射 ${Number(result.totalProjectedDamage || 0)} 点伤害。`
            : ` 造成了 ${Number(result.dmg || 0)} 点最终伤害。`;
          if (selfMirrorEffect && primaryResolvedTarget !== attacker) {
            const selfEchoDamage = Math.max(1, Math.floor(Number(result.dmg || 0)));
            attacker.vit = Math.max(0, Number(attacker.vit || 0) - selfEchoDamage);
            result.desc += ` [自身反馈] 技能余波同步反噬自身，额外承受 ${selfEchoDamage} 点伤害。`;
          }
        }
        const isHostileSkillTarget =
          !targetsFriendlySkill || hostileTargetRedirectedToSelf;
        if (isHostileSkillTarget) {
          const brokenStealth = removeStealthConditions(attacker, 99);
          if (brokenStealth.length > 0) {
            result.desc += ` [破隐结算] ${attacker.name || '施术者'}出手后现出身形，失去了[${brokenStealth.join('/')}]。`;
          }
        }
        const getEffectTargetContext = effect =>
          resolveSkillTargetContext(playerAction.skill, attacker, defender, combatData, effect);

        const applyImmediateRecoveryEffect = (effect, resourceKey, labelText) => {
          if (!effect || Number(result.backlash_dmg || 0) > 0) return 0;
          const effectTargetContext = getEffectTargetContext(effect);
          const targetUnits = effectTargetContext.targetSet;
          const ratio = Number(effect.数值 || 0);
          if (!(ratio > 0) || !targetUnits.length) return 0;
          const isFriendly = ['自身', '友方单体', '友方群体'].includes(effectTargetContext.targetModel);
          let totalRecovered = 0;
          targetUnits.forEach(targetObj => {
            const targetFinalStat = targetObj?.final || buildCombatFinalStats(targetObj);
            const supportScale = isFriendly ? getSupportEffectScale(attacker, targetObj) : 1;
            const targetConditionEffects = targetObj.状态效果
              ? Object.values(targetObj.状态效果).map(c => c?.战斗效果 || {})
              : [];
            let maxResource = 0;
            if (resourceKey === 'vit') maxResource = Number(targetFinalStat.vit_max || targetObj.vit_max || 0);
            else if (resourceKey === 'sp') maxResource = Number(targetFinalStat.sp_max || targetObj.sp_max || 0);
            else maxResource = Number(targetFinalStat.men_max || targetObj.men_max || 0);
            if (!(maxResource > 0)) return;
            const totalHealBlockRatio =
              resourceKey === 'vit'
                ? Math.min(
                    1,
                    targetConditionEffects.reduce((maxVal, ce) => Math.max(maxVal, Number(ce.heal_block_ratio || 0)), 0),
                  )
                : 0;
            const totalFinalHealMult =
              resourceKey === 'vit'
                ? attackerConditionEffects.reduce((mult, ce) => mult * Number(ce.final_heal_mult || 1.0), 1.0)
                : 1.0;
            const totalFinalHealBonus =
              resourceKey === 'vit'
                ? attackerConditionEffects.reduce((sum, ce) => sum + Number(ce.final_heal_bonus || 0), 0)
                : 0;
            const totalResourceBlockRatio =
              resourceKey === 'vit'
                ? 0
                : Math.min(
                    1,
                    targetConditionEffects.reduce(
                      (maxVal, ce) => Math.max(maxVal, Number(ce.resource_block_ratio || 0)),
                      0,
                    ),
                  );
            let amount = Math.floor(
              maxResource *
                ratio *
                supportScale *
                (resourceKey === 'vit' ? totalFinalHealMult * (1 - totalHealBlockRatio) : 1 - totalResourceBlockRatio),
            );
            if (fusionProfile) amount = Math.floor(amount * Number(fusionProfile.recoverMult || 1));
            if (resourceKey === 'vit') amount += totalFinalHealBonus;
            amount = Math.max(0, amount);
            if (!amount) return;
            const healInvertRatio =
              resourceKey === 'vit'
                ? Math.max(0, targetConditionEffects.reduce((maxVal, ce) => Math.max(maxVal, Number(ce.heal_inversion_ratio || 0)), 0))
                : 0;
            if (resourceKey === 'vit' && healInvertRatio > 0) {
              const invertedDamage = Math.max(1, Math.floor(amount * Math.max(1, healInvertRatio)));
              targetObj.vit = Math.max(0, Number(targetObj.vit || 0) - invertedDamage);
              totalRecovered += invertedDamage;
              result.desc += ` [治疗反转] ${targetObj === attacker ? '自身' : targetObj.name}的治疗被扭成伤害，反而损失了 ${invertedDamage} 点HP。`;
              return;
            }
            targetObj[resourceKey] = Math.min(maxResource, Number(targetObj[resourceKey] || 0) + amount);
            totalRecovered += amount;
            result.desc += ` [机制触发] ${targetObj === attacker ? '自身' : targetObj.name}恢复了 ${amount} 点${labelText}。`;
          });
          return totalRecovered;
        };

        const applyShieldEffect = effect => {
          if (!effect || Number(result.backlash_dmg || 0) > 0) return 0;
          const effectTargetContext = getEffectTargetContext(effect);
          const targetUnits = effectTargetContext.targetSet;
          let totalShield = 0;
          targetUnits.forEach(targetObj => {
            const isFriendly =
              targetObj === attacker || ['自身', '友方单体', '友方群体'].includes(effectTargetContext.targetModel);
            const supportScale = isFriendly ? getSupportEffectScale(attacker, targetObj) : 1;
            const totalShieldGainMult = attackerConditionEffects.reduce(
              (mult, ce) => mult * Number(ce.shield_gain_mult || 1.0),
              1.0,
            );
            const totalShieldGainBonus = attackerConditionEffects.reduce(
              (sum, ce) => sum + Number(ce.shield_gain_bonus || 0),
              0,
            );
            const baseShield = Number(effect.护盾值 || 0);
            let shieldAmount = Math.floor(baseShield * supportScale * totalShieldGainMult) + totalShieldGainBonus;
            if (fusionProfile) shieldAmount = Math.floor(shieldAmount * Number(fusionProfile.shieldMult || 1));
            shieldAmount = Math.max(0, shieldAmount);
            if (!shieldAmount) return;
            applyShieldToCharacter(
              targetObj,
              shieldAmount,
              Number(effect.持续回合 || 1),
              String(effect.状态名称 || skillName || '护盾'),
            );
            totalShield += shieldAmount;
            result.desc += ` [护盾生成] ${targetObj === attacker ? '自身' : targetObj.name}获得 ${shieldAmount} 点护盾。`;
          });
          return totalShield;
        };

        const applyFieldEffect = effect => {
          if (!effect) return false;
          const effectTargetContext = getEffectTargetContext(effect);
          const isHostileField = ['敌方单体', '敌方群体'].includes(effectTargetContext.targetModel);
          const fieldHolder = isHostileField ? defender : attacker;
          const fieldName = String(effect?.实体名称 || effect?.状态名称 || `${skillName || '场地效果'}`);
          if (!fieldHolder || !fieldName || fieldName === '无') return false;
          if (!fieldHolder.状态效果) fieldHolder.状态效果 = {};
          const existing = fieldHolder.状态效果[fieldName];
          if (existing) {
            existing.duration = Math.max(Number(existing.duration || 0), Number(effect?.持续回合 || 0));
            existing.描述 = effect?.核心机制描述 || existing.描述 || `由[${skillName || fieldName}]展开`;
          } else {
            fieldHolder.状态效果[fieldName] = {
              类型: isHostileField ? 'debuff' : 'buff',
              层数: 1,
              描述: effect?.核心机制描述 || `由[${skillName || fieldName}]展开`,
              duration: Number(effect?.持续回合 || 0),
              面板修改比例: { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 },
              战斗效果: { ...createEmptyCombatEffectMap() },
              field_desc: effect?.核心机制描述 || '',
            };
          }
          if (/领域|场地|结界/.test(fieldName)) fieldHolder.当前领域 = fieldName;
          result.desc += ` [场地展开] ${fieldHolder === attacker ? '自身' : fieldHolder.name}展开了[${fieldName}]。`;
          return true;
        };

        const removeConditionWithSustain = (char, key) => {
          if (!char?.状态效果 || !char.状态效果[key]) return null;
          const snapshot = deepClone(char.状态效果[key]);
          delete char.状态效果[key];
          if (char.持续效果) {
            Object.keys(char.持续效果).forEach(sustainKey => {
              if (char.持续效果[sustainKey]?.related_condition === key) delete char.持续效果[sustainKey];
            });
          }
          return snapshot;
        };

        const putConditionWithUniqueKey = (char, baseKey, cond) => {
          if (!char) return '';
          if (!char.状态效果) char.状态效果 = {};
          let key = String(baseKey || '状态').trim() || '状态';
          if (!char.状态效果[key]) {
            char.状态效果[key] = cond;
            return key;
          }
          let index = 1;
          while (char.状态效果[`${key}·${index}`]) index += 1;
          const nextKey = `${key}·${index}`;
          char.状态效果[nextKey] = cond;
          return nextKey;
        };

        const isTransferableConditionEntry = ([key, cond], expectedType = 'any') => {
          if (!key || !cond) return false;
          if (String(key).startsWith(AUTO_PROJECTED_CONDITION_PREFIX)) return false;
          if (expectedType !== 'any' && String(cond?.类型 || '') !== expectedType) return false;
          if (Number(cond?.shield_value || 0) > 0) return false;
          if (cond?.field_desc) return false;
          if (/护盾|屏障|结界|领域|场地/.test(String(key))) return false;
          return true;
        };

        const scoreTransferableCondition = (cond = {}) => {
          const ce = cond?.战斗效果 || {};
          let score = Number(cond?.duration || 0);
          score += ce.skip_turn ? 1000 : 0;
          score += ce.cannot_react ? 800 : 0;
          score += Number(ce.lock_level || 0) * 100;
          score += Number(ce.counter_attack_ratio || 0) * 120;
          score += Number(ce.damage_reduction || 0) * 100;
          score += Math.max(0, Number(ce.final_damage_mult || 1) - 1) * 120;
          score += Math.max(0, Number(ce.final_heal_mult || 1) - 1) * 100;
          score += Number(ce.dot_damage || 0) / 5;
          score += Number(ce.heal_block_ratio || 0) * 100;
          score += Number(ce.resource_block_ratio || 0) * 100;
          score += Number(ce.reaction_bonus || 0) * 60;
          score += Number(ce.reaction_penalty || 0) * 60;
          score += Number(ce.dodge_bonus || 0) * 60;
          score += Number(ce.dodge_penalty || 0) * 60;
          score += Number(ce.hit_bonus || 0) * 60;
          score += Number(ce.cast_speed_bonus || 0) * 60;
          score += Number(ce.cast_speed_penalty || 0) * 60;
          Object.values(cond?.面板修改比例 || {}).forEach(value => {
            score += Math.abs(Number(value || 1) - 1) * 100;
          });
          return score;
        };

        const pickTransferableCondition = (char, preferredTypes = ['any']) => {
          if (!char?.状态效果) return null;
          for (const expectedType of preferredTypes) {
            const candidates = Object.entries(char.状态效果)
              .filter(entry => isTransferableConditionEntry(entry, expectedType))
              .sort((a, b) => scoreTransferableCondition(b[1]) - scoreTransferableCondition(a[1]));
            if (candidates.length > 0) return { key: candidates[0][0], cond: candidates[0][1] };
          }
          return null;
        };

        const applyStatusTransferEffect = effect => {
          if (!effect) return false;
          const targetObj = resolveSkillEffectTargetCharacter(playerAction.skill, effect, attacker, defender, combatData);
          if (!targetObj || targetObj === attacker) {
            result.desc += ` [状态转移] 缺少有效转移目标。`;
            return false;
          }
          const transferMode = String(effect?.转移类型 || '自身负面->目标').trim() || '自身负面->目标';
          const sourceChar = /目标/.test(transferMode) ? targetObj : attacker;
          const candidate = /目标正面->自身/.test(transferMode)
            ? pickTransferableCondition(targetObj, ['buff'])
            : pickTransferableCondition(sourceChar, ['debuff', 'buff']);
          if (!candidate) {
            result.desc += ` [状态转移] 没有找到可转移的状态。`;
            return false;
          }
          const moved = removeConditionWithSustain(sourceChar, candidate.key);
          if (!moved) {
            result.desc += ` [状态转移] 目标状态已失效。`;
            return false;
          }
          const receiver = sourceChar === attacker ? targetObj : attacker;
          moved.描述 = `由[${skillName || '技能'}]自${sourceChar.name || '自身'}转移至${receiver.name || '自身'}`;
          const nextKey = putConditionWithUniqueKey(receiver, candidate.key, moved);
          result.desc += ` [状态转移] ${sourceChar === attacker ? '自身' : sourceChar.name}的[${candidate.key}]被转移到${receiver === attacker ? '自身' : receiver.name}，现为[${nextKey}]。`;
          return true;
        };

        const applyDotDetonateEffect = effect => {
          if (!effect) return 0;
          const targetUnits = resolveSkillEffectTargetCharacters(playerAction.skill, effect, attacker, defender, combatData);
          const ratio = Math.max(0.1, Number(effect?.引爆倍率 || effect?.detonate_ratio || 1));
          let totalAddedDamage = 0;
          targetUnits.forEach(targetObj => {
            if (!targetObj?.状态效果) return;
            let consumedDot = 0;
            Object.entries(targetObj.状态效果).forEach(([key, cond]) => {
              const dotDamage = Math.max(0, Number(cond?.战斗效果?.dot_damage || 0));
              if (!(dotDamage > 0)) return;
              consumedDot += dotDamage;
              if (effect?.消耗持续伤害 !== false) removeConditionWithSustain(targetObj, key);
            });
            if (!(consumedDot > 0)) return;
            const bonusDamage = Math.max(1, Math.floor(consumedDot * ratio));
            appendProjectedDamageToSettleResult(result, targetObj, bonusDamage, targetObj === primaryResolvedTarget ? 'primary' : 'secondary');
            totalAddedDamage += bonusDamage;
            result.desc += ` [持续引爆] ${targetObj === attacker ? '自身' : targetObj.name}身上的持续伤害被引爆，追加 ${bonusDamage} 点伤害。`;
          });
          return totalAddedDamage;
        };

        const applyShieldBreakEffect = effect => {
          if (!effect) return 0;
          const targetUnits = resolveSkillEffectTargetCharacters(playerAction.skill, effect, attacker, defender, combatData);
          const ratio = Math.max(0, Number(effect?.斩盾倍率 || effect?.shield_break_ratio || 1));
          let totalAddedDamage = 0;
          targetUnits.forEach(targetObj => {
            const shieldEntries = collectShieldConditionEntries(targetObj);
            if (!shieldEntries.length) return;
            let removedShield = 0;
            shieldEntries.forEach(entry => {
              removedShield += entry.shieldValue;
              delete targetObj.状态效果[entry.key];
            });
            if (!(removedShield > 0)) return;
            const bonusDamage = Math.max(1, Math.floor(removedShield * Math.max(0.2, ratio)));
            appendProjectedDamageToSettleResult(result, targetObj, bonusDamage, targetObj === primaryResolvedTarget ? 'primary' : 'secondary');
            totalAddedDamage += bonusDamage;
            result.desc += ` [斩盾爆破] ${targetObj === attacker ? '自身' : targetObj.name}的护盾被一并斩碎，追加 ${bonusDamage} 点伤害。`;
          });
          return totalAddedDamage;
        };

        const applyStealShieldEffect = effect => {
          if (!effect) return 0;
          const targetUnits = resolveSkillEffectTargetCharacters(playerAction.skill, effect, attacker, defender, combatData);
          const ratio = Math.max(0, Number(effect?.窃盾比例 || effect?.shield_steal_ratio || 0.5));
          let totalShield = 0;
          targetUnits.forEach(targetObj => {
            const shieldEntries = collectShieldConditionEntries(targetObj);
            if (!shieldEntries.length) return;
            shieldEntries.forEach(entry => {
              const stolen = Math.max(0, Math.floor(entry.shieldValue * ratio));
              if (!(stolen > 0)) return;
              entry.cond.shield_value = Math.max(0, entry.shieldValue - stolen);
              if (entry.cond.shield_value <= 0) delete targetObj.状态效果[entry.key];
              applyShieldToCharacter(attacker, stolen, Math.max(1, Number(effect?.持续回合 || 1)), `${skillName || '技能'}窃盾`);
              totalShield += stolen;
              result.desc += ` [窃取护盾] 从${targetObj === attacker ? '自身' : targetObj.name}身上夺取 ${stolen} 点护盾转移给施术者。`;
            });
          });
          return totalShield;
        };

        const directMechanismConsumerMap = {
          status_transfer: applyStatusTransferEffect,
          dot_detonate: applyDotDetonateEffect,
          shield_break: applyShieldBreakEffect,
          shield_steal: applyStealShieldEffect,
        };

        const runDirectMechanismConsumer = effect => {
          if (!effect) return false;
          const 运行时消费器 = String(getBattleSkillMechanismMeta(effect?.机制 || effect?.名称 || effect?.类型 || '')?.运行时消费器 || '').trim();
          const consumer = 运行时消费器 ? directMechanismConsumerMap[运行时消费器] : null;
          return consumer ? consumer(effect) : false;
        };

        const applyCopyEffect = effect => {
          if (!effect) return false;
          const sourceObj = resolveSkillEffectTargetCharacter(playerAction.skill, effect, attacker, defender);
          const candidate = pickTransferableCondition(sourceObj, [
            String(effect?.复制类型 || 'buff') === 'debuff' ? 'debuff' : 'buff',
          ]);
          if (!candidate) {
            result.desc += ` [规则复制] 未找到可复制的状态。`;
            return false;
          }
          const copied = deepClone(candidate.cond);
          copied.duration = Math.max(1, Number(effect?.持续回合 || copied.duration || 1));
          copied.描述 = `由[${skillName || '技能'}]复制自${sourceObj === attacker ? '自身' : sourceObj.name || '目标'}的[${candidate.key}]`;
          const copiedKey = putConditionWithUniqueKey(attacker, `${candidate.key}·复制`, copied);
          result.desc += ` [规则复制] 自身复制了${sourceObj === attacker ? '自身' : sourceObj.name || '目标'}的[${candidate.key}]，获得[${copiedKey}]。`;
          return true;
        };

        const applyStealBuffEffect = effect => {
          if (!effect) return false;
          const stealCount = Math.max(1, Number(effect?.窃取数量 || 1));
          const sourceTargets = resolveSkillEffectTargetCharacters(
            playerAction.skill,
            effect,
            attacker,
            defender,
            combatData,
          );
          const stolenLogs = [];
          sourceTargets.forEach(sourceObj => {
            const stolen = [];
            for (let index = 0; index < stealCount; index += 1) {
              const candidate = pickTransferableCondition(sourceObj, ['buff']);
              if (!candidate) break;
              const removed = removeConditionWithSustain(sourceObj, candidate.key);
              if (!removed) break;
              removed.描述 = `由[${skillName || '技能'}]自${sourceObj === attacker ? '自身' : sourceObj.name || '目标'}窃取`;
              const copiedKey = putConditionWithUniqueKey(attacker, `${candidate.key}·窃取`, removed);
              stolen.push({ from: candidate.key, to: copiedKey });
            }
            if (stolen.length) {
              stolenLogs.push(`${sourceObj === attacker ? '自身' : sourceObj.name || '目标'}失去了[${stolen.map(item => item.from).join('/')}]，自身获得[${stolen.map(item => item.to).join('/')}]`);
            }
          });
          if (!stolenLogs.length) {
            result.desc += ` [窃取失败] 未找到可窃取的增益状态。`;
            return false;
          }
          result.desc += ` [窃取增益] ${stolenLogs.join('；')}。`;
          return true;
        };

        const applyStateExchangeEffect = effect => {
          if (!effect) return false;
          const targetObj = resolveSkillEffectTargetCharacter(playerAction.skill, effect, attacker, defender);
          if (!targetObj || targetObj === attacker) {
            result.desc += ` [状态交换] 缺少有效交换目标。`;
            return false;
          }
          const ownCandidate = pickTransferableCondition(attacker, ['debuff', 'buff']);
          const targetCandidate = pickTransferableCondition(targetObj, ['buff', 'debuff']);
          if (!ownCandidate || !targetCandidate) {
            result.desc += ` [状态交换] 双方没有形成可交换的状态组合。`;
            return false;
          }
          const ownSnapshot = removeConditionWithSustain(attacker, ownCandidate.key);
          const targetSnapshot = removeConditionWithSustain(targetObj, targetCandidate.key);
          if (!ownSnapshot || !targetSnapshot) {
            result.desc += ` [状态交换] 交换过程中状态已失效。`;
            return false;
          }
          ownSnapshot.描述 = `由[${skillName || '技能'}]自${attacker.name || '自身'}交换至${targetObj.name || '目标'}`;
          targetSnapshot.描述 = `由[${skillName || '技能'}]自${targetObj.name || '目标'}交换至${attacker.name || '自身'}`;
          const ownNewKey = putConditionWithUniqueKey(targetObj, ownCandidate.key, ownSnapshot);
          const targetNewKey = putConditionWithUniqueKey(attacker, targetCandidate.key, targetSnapshot);
          result.desc += ` [状态交换] 自身的[${ownCandidate.key}]与${targetObj.name || '目标'}的[${targetCandidate.key}]完成交换，现分别变为[${targetNewKey}]与[${ownNewKey}]。`;
          return true;
        };

        if (directHealEffect) {
          applyImmediateRecoveryEffect(directHealEffect, 'vit', 'HP');
          if (selfMirrorEffect && !effectTargetsSelf(directHealEffect))
            applyImmediateRecoveryEffect(mirrorEffectToSelf(directHealEffect), 'vit', 'HP');
        }

        if (directSpEffect) {
          applyImmediateRecoveryEffect(directSpEffect, 'sp', '魂力');
          if (selfMirrorEffect && !effectTargetsSelf(directSpEffect))
            applyImmediateRecoveryEffect(mirrorEffectToSelf(directSpEffect), 'sp', '魂力');
        } else if ((pState.计算层效果?.sp_gain_ratio || 0) > 0) {
          const selfResourceBlockRatio = Math.min(
            1,
            attackerConditionEffects.reduce((maxVal, ce) => Math.max(maxVal, Number(ce.resource_block_ratio || 0)), 0),
          );
          attacker.sp = Math.min(
            attackerFinalStat.sp_max || attacker.sp_max || 0,
            attacker.sp +
              Math.floor(
                (attackerFinalStat.sp_max || attacker.sp_max || 0) *
                  pState.计算层效果.sp_gain_ratio *
                  (1 - selfResourceBlockRatio),
              ),
          );
        }
        if (directMenEffect) {
          applyImmediateRecoveryEffect(directMenEffect, 'men', '精神力');
          if (selfMirrorEffect && !effectTargetsSelf(directMenEffect))
            applyImmediateRecoveryEffect(mirrorEffectToSelf(directMenEffect), 'men', '精神力');
        } else if ((pState.计算层效果?.men_gain_ratio || 0) > 0) {
          const selfResourceBlockRatio = Math.min(
            1,
            attackerConditionEffects.reduce((maxVal, ce) => Math.max(maxVal, Number(ce.resource_block_ratio || 0)), 0),
          );
          attacker.men = Math.min(
            attackerFinalStat.men_max || attacker.men_max || 0,
            attacker.men +
              Math.floor(
                (attackerFinalStat.men_max || attacker.men_max || 0) *
                  pState.计算层效果.men_gain_ratio *
                  (1 - selfResourceBlockRatio),
              ),
          );
        }

          if (directCleanseEffect) {
            const cleanseTargets = resolveSkillEffectTargetCharacters(
              playerAction.skill,
              directCleanseEffect,
              attacker,
              defender,
              combatData,
            );
            cleanseTargets.forEach(cleanseTarget => {
              const removed = removeNegativeConditionsByCleanse(cleanseTarget, Number(directCleanseEffect.清除层级 || 1));
              if (removed.length > 0)
                result.desc += ` [净化生效] ${cleanseTarget === attacker ? '自身' : cleanseTarget.name}清除了[${removed.join('/')}]。`;
              else
                result.desc += ` [净化生效] ${cleanseTarget === attacker ? '自身' : cleanseTarget.name}当前没有可清除的负面状态。`;
            });
            if (selfMirrorEffect && !effectTargetsSelf(directCleanseEffect)) {
              const removedSelf = removeNegativeConditionsByCleanse(
                attacker,
                Number(directCleanseEffect.清除层级 || 1),
              );
              if (removedSelf.length > 0) result.desc += ` [自身反馈] 自身同步清除了[${removedSelf.join('/')}]。`;
            }
          }
          if (directDispelEffect) {
            const dispelTargets = resolveSkillEffectTargetCharacters(
              playerAction.skill,
              directDispelEffect,
              attacker,
              defender,
              combatData,
            );
            dispelTargets.forEach(dispelTarget => {
              const removed = removePositiveConditionsByDispel(dispelTarget, Number(directDispelEffect.驱散数量 || 1));
              if (removed.length > 0)
                result.desc += ` [驱散生效] ${dispelTarget === attacker ? '自身' : dispelTarget.name}失去了[${removed.join('/')}]。`;
              else
                result.desc += ` [驱散生效] ${dispelTarget === attacker ? '自身' : dispelTarget.name}当前没有可驱散的增益状态。`;
            });
            if (selfMirrorEffect && !effectTargetsSelf(directDispelEffect)) {
              const removedSelf = removePositiveConditionsByDispel(
                attacker,
                Number(directDispelEffect.驱散数量 || 1),
              );
              if (removedSelf.length > 0) result.desc += ` [自身反馈] 自身同步失去了[${removedSelf.join('/')}]。`;
            }
          }
          if (directStealBuffEffect) {
            applyStealBuffEffect(directStealBuffEffect);
          }
          if (directShieldEffect) {
            applyShieldEffect(directShieldEffect);
            if (selfMirrorEffect && !effectTargetsSelf(directShieldEffect))
              applyShieldEffect(mirrorEffectToSelf(directShieldEffect));
          }
          if (directFieldEffect) {
            applyFieldEffect(directFieldEffect);
            if (selfMirrorEffect) applyFieldEffect(mirrorEffectToSelf(directFieldEffect));
          }
          if (directCopyEffect) {
            applyCopyEffect(directCopyEffect);
          }
          if (directStateExchangeEffect) {
            applyStateExchangeEffect(directStateExchangeEffect);
          }
          [directStatusTransferEffect, directDotDetonateEffect, directShieldBreakEffect, directShieldStealEffect]
            .filter(Boolean)
            .forEach(effect => {
              runDirectMechanismConsumer(effect);
            });

          const hasDirectDamageEffect = Number(pClash.威力倍率 || 0) > 0;
          if (
            pState.状态名称 &&
            pState.状态名称 !== '无' &&
            (Number(result.totalProjectedDamage || result.dmg || 0) > 0 || hostileTargetRedirectedToSelf || !hasDirectDamageEffect)
          ) {
            const stateTargetContext = getEffectTargetContext(pState);
            const stateTargets = stateTargetContext.targetSet;
            const stateTargetsFriendly = ['自身', '友方单体', '友方群体'].includes(stateTargetContext.targetModel);
            stateTargets.forEach(targetObj => {
              const targetFinalStat = targetObj?.final || buildCombatFinalStats(targetObj);
              const selfRedirectedDebuff =
                hostileTargetRedirectedToSelf && targetObj === attacker && !stateTargetsFriendly;
              let isBuff =
                (!selfRedirectedDebuff && targetObj === attacker) ||
                stateTargetsFriendly ||
                String(pState.特殊机制标识 || '无').includes('增益') ||
                pState.计算层效果?.super_armor === true ||
                Number(pState.计算层效果?.min_hp_floor || 0) > 0 ||
                Number(pState.计算层效果?.hot_heal_ratio || 0) > 0;
              const supportScale = isBuff ? getSupportEffectScale(attacker, targetObj) : 1;
              let scaledMods = { ...(pState.面板修改比例 || {}) };
              ['str', 'def', 'agi', 'men_max', 'sp_max'].forEach(k => {
                if (scaledMods[k] !== undefined && scaledMods[k] !== 1.0) {
                  scaledMods[k] = 1 + (scaledMods[k] - 1) * supportScale;
                }
              });
              let scaledCalc = isBuff
                ? scaleBattleSupportBuffCalc(pState.计算层效果 || {}, supportScale)
                : { ...(pState.计算层效果 || {}) };
              if (fusionProfile) {
                scaledMods = scaleFusionPanelModifierMap(scaledMods, fusionProfile);
                scaledCalc = scaleFusionCombatEffectMap(scaledCalc, fusionProfile);
              }

              let isImmune = false;
              const isControlLike =
                !isBuff &&
                (pState.计算层效果?.skip_turn === true ||
                  pState.计算层效果?.cannot_react === true ||
                  Number(pState.计算层效果?.control_success_bonus || 0) > 0);
              if (isControlLike) {
                let atkStat = pClash.伤害类型 === '物理近战' ? aStr : attackerFinalStat.men_max;
                let defStat =
                  pClash.伤害类型 === '物理近战'
                    ? Number(targetFinalStat.str || targetObj.str || 0)
                    : Number(targetFinalStat.men_max || targetObj.men_max || 0);
                const controlResistMult = Number(
                  targetObj.temp_control_resist_mult || targetFinalStat?.战斗效果?.control_resist_mult || 1.0,
                );
                if (defStat > atkStat * (1.5 / Math.max(0.01, controlResistMult))) isImmune = true;
              }
              const invincibleThreshold = Math.max(
                0,
                targetConditionEffects.reduce((maxVal, ce) => Math.max(maxVal, Number(ce.invincible_tier_threshold || 0)), 0),
              );
              if (invincibleThreshold > 0 && getCombatUnitTierNumber(attacker) < invincibleThreshold) {
                isImmune = true;
              }

              if (isImmune) {
                result.desc += ` 但${targetObj === attacker ? '自身' : targetObj.name}凭借绝对的属性碾压，强行豁免了[${pState.状态名称}]控制！`;
                return;
              }
              if (!targetObj.状态效果) targetObj.状态效果 = {};
              targetObj.状态效果[pState.状态名称] = {
                类型: isBuff ? 'buff' : 'debuff',
                层数: 1,
                描述: `由[${playerAction.skill.name}]附加`,
                duration: pState.持续回合,
                面板修改比例: scaledMods,
                战斗效果: {
                  ...createEmptyCombatEffectMap(),
                  silence: scaledCalc?.silence ?? false,
                  disarm: scaledCalc?.disarm ?? false,
                  blind: scaledCalc?.blind ?? false,
                  invincible: scaledCalc?.invincible ?? false,
                  skill_seal: scaledCalc?.skill_seal ?? false,
                  counter_attack_ratio: scaledCalc?.counter_attack_ratio ?? 0,
                  damage_reflect_ratio: scaledCalc?.damage_reflect_ratio ?? 0,
                  damage_share_ratio: scaledCalc?.damage_share_ratio ?? 0,
                  damage_reduction: scaledCalc?.damage_reduction ?? 0,
                  block_count: scaledCalc?.block_count ?? 0,
                  substitute_count: scaledCalc?.substitute_count ?? 0,
                  super_armor: scaledCalc?.super_armor ?? false,
                  death_save_count: scaledCalc?.death_save_count ?? 0,
                  revive_count: scaledCalc?.revive_count ?? 0,
                  revive_heal_ratio: scaledCalc?.revive_heal_ratio ?? 0,
                  hit_bonus: isBuff ? (scaledCalc?.hit_bonus ?? 0) : 0,
                  dodge_penalty: isBuff ? 0 : (scaledCalc?.dodge_penalty ?? 0),
                  dodge_bonus: isBuff ? (scaledCalc?.dodge_bonus ?? 0) : 0,
                  lock_level: isBuff ? 0 : (scaledCalc?.lock_level ?? 0),
                  control_resist_mult: scaledCalc?.control_resist_mult ?? 1.0,
                  skip_turn: scaledCalc?.skip_turn ?? false,
                  cannot_react: scaledCalc?.cannot_react ?? false,
                  dot_damage: scaledCalc?.dot_damage ?? pState.持续真伤dot,
                  armor_pen: scaledCalc?.armor_pen ?? 0,
                  reaction_bonus: scaledCalc?.reaction_bonus ?? 0,
                  reaction_penalty: scaledCalc?.reaction_penalty ?? 0,
                  attacker_speed_bonus: scaledCalc?.attacker_speed_bonus ?? 0,
                  cast_speed_bonus: scaledCalc?.cast_speed_bonus ?? 0,
                  cast_speed_penalty: scaledCalc?.cast_speed_penalty ?? 0,
                  hit_penalty: scaledCalc?.hit_penalty ?? 0,
                  control_success_bonus: scaledCalc?.control_success_bonus ?? 0,
                  control_success_penalty: scaledCalc?.control_success_penalty ?? 0,
                  control_resist_bonus: scaledCalc?.control_resist_bonus ?? 0,
                  interrupt_bonus: scaledCalc?.interrupt_bonus ?? 0,
                  final_damage_mult: scaledCalc?.final_damage_mult ?? 1.0,
                  final_damage_bonus: scaledCalc?.final_damage_bonus ?? 0,
                  final_heal_mult: scaledCalc?.final_heal_mult ?? 1.0,
                  final_heal_bonus: scaledCalc?.final_heal_bonus ?? 0,
                  shield_gain_mult: scaledCalc?.shield_gain_mult ?? 1.0,
                  shield_gain_bonus: scaledCalc?.shield_gain_bonus ?? 0,
                  sp_gain_ratio: scaledCalc?.sp_gain_ratio ?? 0,
                  men_gain_ratio: scaledCalc?.men_gain_ratio ?? 0,
                  heal_block_ratio: scaledCalc?.heal_block_ratio ?? 0,
                  hot_heal_ratio: scaledCalc?.hot_heal_ratio ?? 0,
                  resource_block_ratio: scaledCalc?.resource_block_ratio ?? 0,
                  heal_inversion_ratio: scaledCalc?.heal_inversion_ratio ?? 0,
                  random_target_rate: scaledCalc?.random_target_rate ?? 0,
                  stealth_level: scaledCalc?.stealth_level ?? 0,
                  min_hp_floor: scaledCalc?.min_hp_floor ?? 0,
                  death_save_count: scaledCalc?.death_save_count ?? 0,
                  damage_share_count: scaledCalc?.damage_share_count ?? 0,
                  invincible_tier_threshold: scaledCalc?.invincible_tier_threshold ?? 0,
                  daily_trigger_limit: scaledCalc?.daily_trigger_limit ?? 0,
                },
              };
              if (directTauntEffect && targetObj !== attacker) {
                targetObj.状态效果[pState.状态名称].强制目标名 = attacker.name || '';
              }
              if (directGuardEffect) {
                targetObj.状态效果[pState.状态名称].护卫者名 = attacker.name || '';
              }
              let targetNameStr = targetObj === attacker ? '自身' : 'NPC';
              result.desc += ` 并对${targetNameStr}施加了[${pState.状态名称}]状态！`;
              if (selfMirrorEffect && targetObj !== attacker) {
                if (!attacker.状态效果) attacker.状态效果 = {};
                const mirrorKey = `${pState.状态名称}·自返`;
                attacker.状态效果[mirrorKey] = deepClone(targetObj.状态效果[pState.状态名称]);
                attacker.状态效果[mirrorKey].描述 = `由[${playerAction.skill.name}]同步反馈`;
                result.desc += ` [自身反馈] 施术者同步获得了[${mirrorKey}]效果。`;
              }
            });
          }

          result.interrupt_bonus = attackerInterruptBonus;
          return result;
        }

        function buildStrategicCandidates(
          defender,
          attacker,
          combatData,
          playerAction,
          ratio,
          availableSkills,
          allyTeam,
          makeNpcAction,
        ) {
          const combatType = combatData.战斗类型 || '突发遭遇';
          const isDeadlyFight = combatType === '死战' || combatType === '突发遭遇';
          const lvDiff = (attacker.lv || 1) - (defender.lv || 1);
          const playerPower = Number(getPrimaryDamageEffect(playerAction.skill)?.威力倍率 || 0) || 0;
          const isChargingHighThreat =
            !!attacker.蓄力技能 ||
            playerAction.action_type === '蓄力挨打' ||
            ((playerAction.cast_time || 0) >= 20 && playerPower >= 120);
          const activeBuffs = Object.keys(defender.状态效果 || {});
          const behaviorState = buildBattleStateContext(defender, attacker, combatData, {
            combatType,
            isDeadlyFight,
            ratio,
            isChargingHighThreat,
            playerPower,
          });

          const strategicBranches = [];

          if (defender.武魂融合技) {
            Object.entries(defender.武魂融合技).forEach(([fusionName, fusionSkill]) => {
              if (!isFusionSkillAvailable(defender, fusionSkill, allyTeam)) return;

              let weight = 0;
              if (isDeadlyFight) {
                if (lvDiff >= 5) weight += 80;
                if (isChargingHighThreat) weight += 60;
                if (defender.vit < defender.vit_max * 0.5) weight += 30;
              } else if (defender.vit < defender.vit_max * 0.4 || isChargingHighThreat) {
                weight += 50;
              }

              strategicBranches.push({
                name: '武魂融合技',
                weight: adjustBehaviorWeight('武魂融合技', weight, defender, attacker, behaviorState),
                build() {
                  const skill = buildFusionCombatSkill(fusionSkill, fusionName);
                  skill.name = `武魂融合技·${skill.name}`;
                  return makeNpcAction(
                    '武魂融合技',
                    `[绝地反击] 面对${lvDiff >= 5 ? '不可战胜的强敌' : '巨大的压力'}，${buildFusionCastNarration(fusionSkill, defender.name || 'NPC')}`,
                    skill,
                  );
                },
              });
            });
          }

          const trueBodySkill = availableSkills.find(skill => {
            const stateName = getPrimaryStateName(skill) || '';
            return /真身/.test(skill.name || '') || /真身/.test(stateName);
          });
          if (trueBodySkill) {
            const trueBodyState = getPrimaryStateName(trueBodySkill) || '无';
            if (!activeBuffs.includes(trueBodyState)) {
              let weight = 0;
              if (isDeadlyFight) {
                if (lvDiff >= 0) weight += 70;
                if (isChargingHighThreat) weight += 60;
              } else if (defender.vit < defender.vit_max * 0.6 || isChargingHighThreat) {
                weight += 50;
              }

              strategicBranches.push({
                name: '开启真身',
                weight: adjustBehaviorWeight('开启真身', weight, defender, attacker, behaviorState),
                build() {
                  const sustainConfig = resolveActionSustainConfig(defender, '开启真身', trueBodySkill, trueBodyState);
                  applyStateToCharacter(defender, getPrimaryStateEffect(trueBodySkill), trueBodySkill.name, true);
                  if (sustainConfig) registerSustainEffect(defender, `truebody:${trueBodySkill.name}`, sustainConfig);
                  return makeNpcAction(
                    '开启真身',
                    `[质变底牌] NPC仰天长啸，第七魂环闪耀，直接释放了[${trueBodySkill.name}]！`,
                    trueBodySkill,
                  );
                },
              });
            }
          }

          const lifeFireSkill = defender.血脉之力?.技能?.['点燃生命之火'];
          if (
            isDeadlyFight &&
            lifeFireSkill &&
            !defender.血脉之力?.生命之火 &&
            behaviorState.isDesperateNoEscape
          ) {
            let weight = 0;
            if (lvDiff >= 10 && defender.vit < defender.vit_max * 0.8) weight += 60;
            else if (defender.vit < defender.vit_max * 0.3) weight += 80;
            if (isChargingHighThreat) weight += 25;

            let fireLog = `[绝命搏杀] 面对${lvDiff >= 10 ? '令人绝望的实力差距' : '生死绝境'}，NPC做出了极其疯狂的举动！强行点燃了生命之火做殊死一搏！`;
            if (!behaviorState.canFlee) {
              fireLog = `[困兽犹斗] 被迫背水一战，已经退无可退！NPC被逼入绝境，发出一声绝望的狂吼，强行点燃了生命之火，誓要同归于尽！`;
            }
            strategicBranches.push({
              name: '点燃生命之火',
              weight: adjustBehaviorWeight('点燃生命之火', weight, defender, attacker, behaviorState),
              build() {
                const sustainConfig = resolveActionSustainConfig(defender, '点燃生命之火', lifeFireSkill, '');
                defender.血脉之力.生命之火 = true;
                if (sustainConfig)
                  registerSustainEffect(defender, `life_fire:${lifeFireSkill.name || '点燃生命之火'}`, sustainConfig);
                return makeNpcAction('点燃生命之火', fireLog, lifeFireSkill);
              },
            });
          }

          const hasDomain =
            (defender.当前领域 || '无') === '无' && (defender.装备?.斗铠?.等级 >= 3 || defender.men_max >= 30000);
          if (hasDomain) {
            let weight = 0;
            if (defender.vit >= defender.vit_max * 0.9) weight += 40;
            if (defender.vit < defender.vit_max * 0.5) weight += 80;
            if (isChargingHighThreat) weight += 30;

            strategicBranches.push({
              name: '展开领域',
              weight: adjustBehaviorWeight('展开领域', weight, defender, attacker, behaviorState),
              build() {
                const actionType = defender.装备?.斗铠?.等级 >= 3 ? '展开斗铠领域' : '展开精神领域';
                const sustainConfig = resolveActionSustainConfig(defender, actionType, null, '');
                defender.当前领域 =
                  actionType === '展开斗铠领域'
                    ? defender.装备?.斗铠?.等级 >= 4
                      ? '【四字斗铠领域】全开(未定)'
                      : '【三字斗铠领域】全开(未定)'
                    : '【精神领域】全开';
                if (sustainConfig) registerSustainEffect(defender, `domain:${actionType}`, sustainConfig);
                return makeNpcAction(actionType, `[主场展开] NPC不愿陷入被动，果断张开领域法则抢占先机！`);
              },
            });
          }

          let bestSpirit = null;
          let maxSpiritLv = 0;
          Object.values(defender.武魂 || {}).forEach(sp => {
            Object.values(sp.魂灵 || {}).forEach(ss => {
              if (ss.状态 === '活跃' && ss.战力面板?.对标等级 > maxSpiritLv) {
                maxSpiritLv = ss.战力面板.对标等级;
                bestSpirit = ss;
              }
            });
          });
          if (bestSpirit && defender.men >= 500) {
            let weight = 0;
            const playerLv = attacker.lv || 1;
            if (maxSpiritLv >= playerLv - 15) {
              weight += 20;
              if (maxSpiritLv >= playerLv) weight += 40;
              if (defender.vit >= defender.vit_max * 0.9) weight += 30;
            }
            strategicBranches.push({
              name: '召唤魂灵',
              weight: adjustBehaviorWeight('召唤魂灵', weight, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '召唤魂灵',
                  `[战术召唤] NPC消耗精神力，将【${bestSpirit.表象名称}】实体化召唤至战场！(对标等级: ${formatBattleCultivationLevelText(maxSpiritLv, '0')})`,
                );
              },
            });
          }

          const hasArmor = defender.装备?.斗铠?.等级 > 0 && defender.装备?.斗铠?.装备状态 !== '已装备';
          const hasMech =
            defender.装备?.机甲?.等级 !== '无' &&
            defender.装备?.机甲?.状态 !== '重创' &&
            defender.装备?.机甲?.装备状态 !== '已装备';
          if (hasArmor || hasMech) {
            let armorLv = defender.装备?.斗铠?.等级 || 0;
            let isRejected = defender.装备?.斗铠?._已排异 || false;
            let minQ = Infinity;
            let pCount = 0;

            if (hasArmor && defender.装备?.斗铠?.parts) {
              Object.values(defender.装备.斗铠.parts).forEach(part => {
                if (part.状态 !== '未打造' && part.状态 !== '重创') {
                  if (part.品质系数 < minQ) minQ = part.品质系数;
                  pCount++;
                }
              });
            }

            let armorCast = Math.max(0, 20 - armorLv * 5);
            if (armorLv === 1 && !isRejected && minQ > 1.2 && pCount > 0) armorCast = Math.max(0, armorCast - 5);
            const mechLv = defender.装备?.机甲?.等级 || '无';
            const mechCast = mechLv === '红级' ? 0 : 50;
            const equipCastTime = hasArmor ? armorCast : mechCast;

            let weight = 0;
            let decisionLog = '';
            if (equipCastTime === 0) weight += 500;
            if (combatType === '死战' && defender.vit >= defender.vit_max * 0.95) {
              weight += 200;
              decisionLog = '面临生死决战，NPC不敢托大，开局便试图引动装备护体！';
            }
            if (playerPower >= 150) {
              weight += 80;
              decisionLog = '感受到对方攻击中蕴含的毁灭性波动，NPC深知肉体无法硬抗，强行尝试穿戴装备！';
            }
            if ((playerAction.cast_time || 0) > equipCastTime || ratio >= 1.2) {
              weight += 60;
              if (!decisionLog) decisionLog = 'NPC察觉到对方前摇破绽，从容地开始释放装备。';
            }
            if (defender.vit < defender.vit_max * 0.4) {
              weight += 50;
              if (!decisionLog) decisionLog = '身受重创的NPC陷入绝境，拼着被打断的风险也要强行穿戴装备！';
            }

            weight -= equipCastTime;
            strategicBranches.push({
              name: '穿戴装备',
              weight: adjustBehaviorWeight('穿戴装备', weight, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '穿戴装备',
                  `[战术决断] ${decisionLog || 'NPC准备强化自身防御层级。'} (前摇: ${equipCastTime})`,
                  {
                    name: hasArmor ? '斗铠附体' : '召唤机甲',
                    技能类型: '辅助',
                    cast_time: equipCastTime,
                    equip_target: hasArmor ? 'armor' : 'mech',
                  },
                );
              },
            });
          }

          const hasMechOrArmor =
            (defender.装备?.机甲?.等级 !== '无' && defender.装备?.机甲?.状态 !== '重创') ||
            defender.装备?.斗铠?.装备状态 === '已装备';
          if (
            behaviorState.canFlee &&
            combatType !== '擂台切磋' &&
            defender.vit < defender.vit_max * 0.15 &&
            !hasMechOrArmor
          ) {
            strategicBranches.push({
              name: '亡命奔逃',
              weight: adjustBehaviorWeight('亡命奔逃', 50, defender, attacker, behaviorState),
              build() {
                return makeNpcAction('亡命奔逃', `[濒死溃逃] NPC身受重创，丧失了战意，放弃防守转身亡命奔逃！`);
              },
            });
          } else if (!behaviorState.canFlee && defender.vit < defender.vit_max * 0.15) {
            // 如果濒死但无法逃跑，给肉体兜底和死斗加一点补救权重
            behaviorState.isDesperateNoEscape = true;
          }

          return { strategicBranches, behaviorState, combatType, activeBuffs };
        }

        function buildNpcSkillCandidateContext(
          defender,
          attacker,
          playerAction,
          availableSkills,
          behaviorState,
          activeBuffs,
          isLowHealth,
        ) {
          const attackerSpeed = attacker.agi - (playerAction.cast_time || 0) * 10;
          const isChargingHighThreat = !!behaviorState?.isChargingHighThreat;
          const threatProfile = estimateIncomingActionThreat(attacker, defender, playerAction, behaviorState?.combatData);
          const validSkills = availableSkills.filter(skill => {
            const castTime = getSkillCastTime(skill);
            const npcSpeed = defender.agi - castTime * 10;
            const cost = parseSkillCostForChar(skill, defender);
            return cost.canCast && npcSpeed > Math.max(1, attackerSpeed) * 0.8;
          });

          function pickSkillWithWeight(skills) {
            const weighted = (skills || []).map(skill => {
              const stateName = getPrimaryStateName(skill) || '无';
              const skillType = getSkillType(skill);
              if (stateName !== '无' && ['辅助', '防御'].includes(skillType) && activeBuffs.includes(stateName)) {
                return {
                  skill,
                  weight: 0,
                  name: skill.name || '未命名技能',
                  build() {
                    return skill;
                  },
                };
              }

              let weight = 10;
              const skillType2 = getSkillType(skill);
              const skillCastTime = getSkillCastTime(skill);
              const skillPower = Number(getPrimaryDamageEffect(skill)?.威力倍率 || 0) || 0;
              if (isSupportLikeSkill(skill)) {
                const targetForCost = String(getSkillTarget(skill)).includes('敌方') ? attacker : defender;
                skill.__targetForSupportCost = targetForCost;
              }
              const cost = parseSkillCostForChar(skill, defender);
              delete skill.__targetForSupportCost;
              const spRatio = cost.reqSp > 0 ? cost.reqSp / Math.max(1, defender.sp) : 0;
              const vitRatio = cost.reqVit > 0 ? cost.reqVit / Math.max(1, defender.sta || defender.体力 || 1) : 0;

              if (defender.type === '强攻系') {
                if (skillType2 === '输出') weight += 40 + Math.floor(skillPower / 10);
                if (skillType2 === '防御') weight += 20;
              } else if (defender.type === '敏攻系') {
                if (skillType2 === '输出' && skillCastTime <= 15) weight += 60;
                if (skillType2 === '输出' && skillCastTime > 20) weight -= 30;
              } else if (defender.type === '防御系') {
                if (skillType2 === '防御') weight += 80;
                if (skillType2 === '输出') weight += 10;
              } else if (defender.type === '控制系') {
                if (skillType2 === '控制') weight += 80;
              } else if (['辅助系', '治疗系', '食物系'].includes(defender.type)) {
                if (skillType2 === '辅助') weight += 80;
                if (skillType2 === '防御') weight += 50;
                if (skillType2 === '输出') weight -= 30;
              }

              const isUltimate =
                skillPower >= 200 || /真身|第八魂技|第九魂技|武魂融合技|生命之火/.test(skill.name || '');
              if (isUltimate) {
                const enemyHpRatio = attacker.vit / Math.max(1, attacker.vit_max);
                const myHpRatio = defender.vit / Math.max(1, defender.vit_max);
                if (behaviorState.combatType === '擂台切磋') weight -= 30;
                else {
                  if (enemyHpRatio < 0.4) weight += 60;
                  if (myHpRatio < 0.3) weight += 50;
                  if (enemyHpRatio > 0.8 && myHpRatio > 0.8) weight -= 20;
                }
              }

              weight -= Math.floor(skillCastTime / 5);
              if (!isLowHealth) {
                if (spRatio > 0.5 || vitRatio > 0.5) weight = Math.floor(weight * 0.3);
                else if (spRatio > 0.3 || vitRatio > 0.3) weight = Math.floor(weight * 0.7);
              } else if (vitRatio > 0.5) {
                weight = Math.floor(weight * 0.5);
              }

              const summary = deriveBattleSummaryFromEffects(skill);
              const mainType = inferMainTypeFromEffects(skill) || '无';
              const 决策标签 = getSkillAiRoleTags(skill);
              const enemyHpRatio = attacker.vit / Math.max(1, attacker.vit_max);
              const selfHpRatio = defender.vit / Math.max(1, defender.vit_max);
              const fieldActive = Object.keys(defender.状态效果 || {}).some(k => /领域|场地|结界|召唤/.test(k));
              const enemySnapshot = buildConditionTacticalSnapshot(attacker);
              const selfSnapshot = buildConditionTacticalSnapshot(defender);
              const allyCount = behaviorState.alliesCount || 1;
              const selfSpRatio = Math.max(0, Number(defender.sp || 0)) / Math.max(1, Number(defender.sp_max || 1));
              const selfMenRatio = Math.max(0, Number(defender.men || 0)) / Math.max(1, Number(defender.men_max || 1));
              const hasFriendlyGrantable = skillCanGrantFriendlyMechanism(skill);
              const hasHostileSemantic = skillTargetsEnemySide(skill) && hasSkillMechanismSemantic(skill, '敌对');
              const hasAntiHeal = hasSkillMechanism(skill, ['禁疗']);
              const hasSharedVision = hasSkillMechanism(skill, ['共享视野']);
              const hasCounter = hasSkillMechanism(skill, ['受击反击', '反制']);
              const hasBlock = hasSkillMechanism(skill, ['格挡']);
              const hasShield = hasSkillMechanism(skill, ['护盾']);
              const hasDeathSave = hasSkillMechanism(skill, ['免死']);
              const hasClone = hasSkillMechanism(skill, ['分身']);
              const hasInvincible = hasSkillMechanism(skill, ['无敌金身']);
              const hasReflect = hasSkillMechanism(skill, ['伤害反射']);
              const hasDamageShare = hasSkillMechanism(skill, ['伤害分摊']);
              const hasSubstitute = hasSkillMechanism(skill, ['替身抵消']);
              const hasRevive = hasSkillMechanism(skill, ['复苏']);
              const hasSkillSeal = hasSkillMechanism(skill, ['封技']);
              const hasHealInvert = hasSkillMechanism(skill, ['治疗反转']);
              const hasDotDetonate = hasSkillMechanism(skill, ['引爆持续伤害']);
              const hasShieldBreak = hasSkillMechanism(skill, ['斩盾']);
              const hasShieldSteal = hasSkillMechanism(skill, ['窃取护盾']);
              const hasExecute = hasSkillMechanism(skill, ['斩杀补伤']);
              const hasResourceRecover = getSkillEffects(skill).some(effect =>
                isBattleRecoverEffect(effect, ['sp', 'men']),
              );
              const hasHeal = getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect, ['vit']));
              const hasDotPressure = hasSkillMechanism(skill, ['持续伤害']);
              const hasDelayBurst = hasSkillMechanism(skill, ['延迟爆发']);
              const hasVolatile = hasSkillMechanism(skill, ['高波动随机值']);
              const hasReflectiveConvert = hasSkillMechanism(skill, ['伤害转回复', '回复转伤害', '效果反转']);
              const penetrationValue = Number(getPrimaryDamageEffect(skill)?.穿透修饰 || 0);
              const actorMemory = ensureActorDecisionMemory(defender);
              const counterPenalty = getActorSkillCounterPenalty(defender, skill.name || skill.技能名称 || '');

              if (['控制类', '削弱类'].includes(mainType)) weight += 15;
              if (mainType === '增益类' && behaviorState.round <= 2) weight += 20;
              if (mainType === '特殊规则类') weight -= 5;
              if (决策标签.includes('保命型') && (selfHpRatio < 0.55 || isChargingHighThreat)) weight += 12;
              if (决策标签.includes('团队保护型') && allyCount > 1) weight += 10;
              if (决策标签.includes('规则压制型') && (isChargingHighThreat || enemySnapshot.hasShielded || enemySnapshot.hasHealingTrend))
                weight += 10;

              if (summary.控制强度 === '硬控' && isChargingHighThreat) weight += 60;
              else if (summary.控制强度 === '软控' && isChargingHighThreat) weight += 35;

              if (
                mainType === '伤害类' &&
                summary.目标规模 === '单体' &&
                summary.爆发级别 === '高' &&
                enemyHpRatio < 0.35
              )
                weight += 50;
              if (mainType === '伤害类' && summary.目标规模 === '群体' && behaviorState.round <= 1) weight += 25;

              if (summary.防御性质 !== '无' && selfHpRatio < 0.5) weight += 30;
              if (summary.防御性质 === '免死' && selfHpRatio < 0.35) weight += 40;
              if (hasClone && (behaviorState.round <= 2 || selfHpRatio < 0.65)) weight += 25;

              if (summary.回复性质 !== '无' && (selfHpRatio < 0.6 || selfSnapshot.hasBadCondition)) weight += 35;
              if (summary.回复性质 === '净化' && selfSnapshot.hasBadCondition) weight += 60;

              if (summary.协同性 === '高' && (behaviorState.alliesCount || 1) > 1) weight += 20;
              else if (summary.协同性 === '中' && (behaviorState.alliesCount || 1) > 1) weight += 10;
              if (hasFriendlyGrantable && allyCount > 1) {
                weight += summary.目标规模 === '单体' ? 8 : 18;
                if (selfHpRatio < 0.55 || behaviorState.round <= 2) weight += 10;
              }
              if (hasHostileSemantic && summary.控制强度 !== '无' && isChargingHighThreat) weight += 10;

              if (summary.生效方式 === '持续') weight += fieldActive ? -30 : 20;
              if (summary.生效方式 === '延迟') {
                if (behaviorState.round <= 1) weight += 15;
                else if (enemyHpRatio < 0.3) weight -= 10;
              }
              if (summary.生效方式 === '触发') weight += 5;

              if (summary.爆发级别 === '高' && enemyHpRatio < 0.4) weight += 20;
              if (summary.持续性 === '长' && behaviorState.round <= 2) weight += 15;
              if (summary.持续性 === '中' && behaviorState.combatType !== '擂台切磋') weight += 10;

              if (hasAntiHeal) {
                if (enemySnapshot.hasAntiHeal) weight -= 35;
                else if (['辅助系', '治疗系', '食物系'].includes(attacker.type) || enemySnapshot.hasHealingTrend)
                  weight += 45;
                else if (enemyHpRatio > 0.55) weight += 20;
              }
              if (hasSharedVision && allyCount > 1) {
                if (selfSnapshot.hasSharedVision) weight -= 30;
                else weight += 30;
              }
              if (hasCounter && (isChargingHighThreat || selfHpRatio < 0.55))
                weight += selfSnapshot.hasReactiveDefense ? 8 : 22;
              if (hasBlock && (isChargingHighThreat || selfHpRatio < 0.5))
                weight += selfSnapshot.hasReactiveDefense ? 10 : 28;
              if (hasShield && selfHpRatio < 0.55) weight += selfSnapshot.hasShielded ? 6 : 24;
              if (hasDeathSave && selfHpRatio < 0.35) weight += 55;
              if (hasInvincible && (isChargingHighThreat || selfHpRatio < 0.28)) weight += 85;
              if (hasReflect && (isChargingHighThreat || enemyHpRatio > 0.45)) weight += 24;
              if (hasDamageShare && allyCount > 1 && selfHpRatio < 0.45) weight += 28;
              if (hasSubstitute && (selfHpRatio < 0.55 || behaviorState.round <= 2)) weight += 26;
              if (hasRevive && selfHpRatio < 0.3) weight += 62;
              if (hasExecute && enemyHpRatio < 0.35) weight += 40;
              if (hasSkillSeal && isChargingHighThreat) weight += 58;
              if (hasHealInvert && (enemySnapshot.hasHealingTrend || ['辅助系', '治疗系', '食物系'].includes(attacker.type)))
                weight += 42;
              if (hasDotDetonate && enemySnapshot.debuffCount > 0) weight += 38 + enemySnapshot.debuffCount * 6;
              if (hasShieldBreak && enemySnapshot.hasShielded) weight += 44;
              if (hasShieldSteal && enemySnapshot.hasShielded && selfHpRatio < 0.7) weight += 32;
              if (hasResourceRecover && (selfSpRatio < 0.4 || selfMenRatio < 0.4))
                weight += selfSnapshot.hasHealingTrend ? 10 : 30;
              if (hasHeal && selfHpRatio < 0.45) weight += selfSnapshot.hasHealingTrend ? 8 : 28;
              if (enemySnapshot.hasShielded && (penetrationValue >= 20 || skillPower >= 180)) weight += 24;
              if (enemySnapshot.hasDefenseBuffed && penetrationValue >= 15) weight += 18;
              if (enemySnapshot.isLockedOrControlled) {
                if (summary.爆发级别 === '高') weight += 18;
                if (hasDelayBurst || skillCastTime >= 18) weight += 12;
                if (hasExecute && enemyHpRatio < 0.45) weight += 15;
                if (summary.控制强度 === '软控') weight -= 20;
                else if (summary.控制强度 === '硬控' && !isChargingHighThreat) weight -= 8;
              }
              if (enemySnapshot.debuffCount > 0 && hasDotPressure) weight += 10;
              if (selfSnapshot.hasReactiveDefense && (hasCounter || hasBlock || hasShield || hasDeathSave))
                weight -= 12;
              if (hasVolatile) {
                if (behaviorState.isDesperateNoEscape || selfHpRatio < 0.35 || enemyHpRatio < 0.35) weight += 12;
                else weight -= 10;
              }
              if (hasReflectiveConvert) {
                if (enemySnapshot.buffCount > 0 || selfHpRatio < 0.5 || enemyHpRatio < 0.5) weight += 15;
              }
              if (threatProfile.targetHitsDefender) {
                if (threatProfile.severeDamage || threatProfile.lethalRisk) {
                  if (hasInvincible) weight += threatProfile.bypassesInvincible ? 0 : 110;
                  if (hasDeathSave || hasRevive) weight += 70;
                  if (hasSubstitute) weight += 66;
                  if (hasDamageShare && allyCount > 1) weight += 58;
                  if (hasShield || hasBlock) weight += 36;
                } else if (threatProfile.moderateDamage) {
                  if (hasShield || hasBlock || hasCounter) weight += 18;
                  if (hasReflect) weight += 12;
                }
                if (threatProfile.severeControl) {
                  if (hasSharedVision || hasClone || hasInvincible) weight += 12;
                  if (skillType2 === '控制') weight -= 8;
                }
              }
              if (Number(actorMemory.focus_ttl || 0) > 0) {
                if (actorMemory.focus_reason === 'control_window') {
                  if (summary.爆发级别 === '高' || hasExecute) weight += 16;
                  if (summary.控制强度 !== '无') weight -= 10;
                } else if (
                  actorMemory.focus_reason === 'shared_vision_focus' &&
                  summary.目标规模 === '单体' &&
                  summary.爆发级别 !== '无'
                )
                  weight += 18;
                else if (
                  actorMemory.focus_reason === 'dot_pressure' &&
                  (hasDotPressure || hasExecute || summary.爆发级别 === '高')
                )
                  weight += 14;
                else if (
                  actorMemory.focus_reason === 'anti_heal_window' &&
                  (hasDotPressure || hasExecute || summary.爆发级别 !== '无')
                )
                  weight += 10;
                else if (
                  actorMemory.focus_reason === 'armor_break_window' &&
                  (penetrationValue >= 15 || summary.爆发级别 === '高')
                )
                  weight += 10;
                else if (actorMemory.focus_reason === 'finisher' && (hasExecute || summary.爆发级别 !== '无'))
                  weight += 18;
              }
              if (counterPenalty > 0) weight -= counterPenalty;

              if (summary.保留倾向 >= 70 && !(isChargingHighThreat || enemyHpRatio < 0.35 || selfHpRatio < 0.35))
                weight -= 30;
              else if (summary.保留倾向 >= 40 && !(isChargingHighThreat || enemyHpRatio < 0.45 || selfHpRatio < 0.45))
                weight -= 15;

              return {
                skill,
                weight: Math.max(0, weight),
                name: skill.name || '未命名技能',
                build() {
                  return skill;
                },
              };
            });

            const picked = rollBranchByPriority(weighted, '行为预演/技能选择');
            if (!picked.option) return { skill: null, trace: picked.trace };
            return { skill: picked.option.build(), trace: picked.trace };
          }

          const defSkills = validSkills.filter(skill => {
            const skillType = getSkillType(skill);
            const mainType = inferMainTypeFromEffects(skill);
            return (
              skillType === '防御' ||
              mainType === '防御类' ||
              hasSkillAiRoleTag(skill, '保命型') ||
              hasSkillAiRoleTag(skill, '团队保护型') ||
              hasSkillMechanism(skill, ['护盾', '减伤', '格挡', '霸体', '免死', '分身', '无敌金身', '伤害反射', '伤害分摊', '替身抵消', '复苏']) ||
              skillType === '控制'
            );
          });
          const atkSkills = validSkills.filter(skill => {
            const skillType = getSkillType(skill);
            const mainType = inferMainTypeFromEffects(skill);
            return (
              skillType === '输出' ||
              mainType === '伤害类' ||
              hasSkillMechanism(skill, ['直接伤害', '多段伤害', '持续伤害', '延迟爆发', '斩杀补伤'])
            );
          });
          const controlSkills = validSkills.filter(skill => {
            const mainType = inferMainTypeFromEffects(skill);
            const calc = getPrimaryStateCalc(skill);
            const flags = getPrimaryStateFlags(skill);
            const summary = deriveBattleSummaryFromEffects(skill);
            return (
              mainType === '控制类' ||
              mainType === '削弱类' ||
              hasSkillAiRoleTag(skill, '规则压制型') ||
              summary.控制强度 === '硬控' ||
              summary.控制强度 === '软控' ||
              (skillTargetsEnemySide(skill) && hasSkillMechanismSemantic(skill, '敌对')) ||
              hasSkillMechanism(skill, [
                '硬控',
                '催眠',
                '幻境',
                '标记锁定',
                '打断',
                '沉默',
                '禁疗',
                '减速',
                '软控',
                '位移限制',
                '强制位移',
                '位移交换',
                '强制绑定/锁定',
              ]) ||
              Number(calc.lock_level || 0) > 0 ||
              Number(calc.reaction_penalty || 0) > 0 ||
              Number(calc.cast_speed_penalty || 0) > 0 ||
              Number(calc.dodge_penalty || 0) > 0 ||
              Number(calc.resource_block_ratio || 0) > 0 ||
              flags.includes('硬控')
            );
          });

          const defSkillPick = pickSkillWithWeight(defSkills);
          const atkSkillPick = pickSkillWithWeight(atkSkills);
          const controlSkillPick = pickSkillWithWeight(controlSkills);
          const antiHealSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => hasSkillMechanism(skill, ['禁疗'])),
          );
          const pierceSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => {
              const dmg = getPrimaryDamageEffect(skill);
              return Number(dmg?.穿透修饰 || 0) >= 15 || /破甲|穿透|粉碎/.test(String(skill?.name || ''));
            }),
          );
          const executeSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => {
              const dmg = getPrimaryDamageEffect(skill);
              return (
                hasSkillMechanism(skill, ['斩杀补伤']) ||
                (inferMainTypeFromEffects(skill) === '伤害类' && Number(dmg?.威力倍率 || 0) >= 220)
              );
            }),
          );
          const recoverSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect))),
          );
          const teamSupportSkillPick = pickSkillWithWeight(
            validSkills.filter(
              skill =>
                hasSkillMechanism(skill, ['共享视野']) ||
                skillCanGrantFriendlyMechanism(skill) ||
                (getSkillType(skill) === '辅助' && deriveBattleSummaryFromEffects(skill).协同性 === '高'),
            ),
          );
          const invincibleSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => hasSkillMechanism(skill, ['无敌金身'])),
          );
          const shieldBreakSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => hasSkillMechanism(skill, ['斩盾'])),
          );
          const shieldStealSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => hasSkillMechanism(skill, ['窃取护盾'])),
          );
          const dotDetonateSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => hasSkillMechanism(skill, ['引爆持续伤害'])),
          );
          const skillSealSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => hasSkillMechanism(skill, ['封技'])),
          );
          const healInvertSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => hasSkillMechanism(skill, ['治疗反转'])),
          );
          const statusTransferSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => hasSkillMechanism(skill, ['状态转移'])),
          );
          const reactiveDefenseSkillPick = pickSkillWithWeight(
            validSkills.filter(skill =>
              hasSkillMechanism(skill, ['受击反击', '反制', '格挡', '护盾', '免死', '霸体', '分身', '无敌金身', '伤害反射', '伤害分摊', '替身抵消', '复苏']),
            ),
          );

          const defSkill = defSkillPick.skill;
          const atkSkill = atkSkillPick.skill;
          const hardControlSkill = controlSkillPick.skill || controlSkills[0] || null;
          const antiHealSkill = antiHealSkillPick.skill || null;
          const pierceSkill = pierceSkillPick.skill || null;
          const executeSkill = executeSkillPick.skill || null;
          const recoverSkill = recoverSkillPick.skill || null;
          const teamSupportSkill = teamSupportSkillPick.skill || null;
          const invincibleSkill = invincibleSkillPick.skill || null;
          const shieldBreakSkill = shieldBreakSkillPick.skill || null;
          const shieldStealSkill = shieldStealSkillPick.skill || null;
          const dotDetonateSkill = dotDetonateSkillPick.skill || null;
          const skillSealSkill = skillSealSkillPick.skill || null;
          const healInvertSkill = healInvertSkillPick.skill || null;
          const statusTransferSkill = statusTransferSkillPick.skill || null;
          const reactiveDefenseSkill = reactiveDefenseSkillPick.skill || defSkill || null;
          const npcAtkPower = Number(getPrimaryDamageEffect(atkSkill)?.威力倍率 || 0);
          const skillTraceLog = [
            defSkillPick.trace,
            atkSkillPick.trace,
            controlSkillPick.trace,
            antiHealSkillPick.trace,
            pierceSkillPick.trace,
            executeSkillPick.trace,
            recoverSkillPick.trace,
            teamSupportSkillPick.trace,
            invincibleSkillPick.trace,
            shieldBreakSkillPick.trace,
            shieldStealSkillPick.trace,
            dotDetonateSkillPick.trace,
            skillSealSkillPick.trace,
            healInvertSkillPick.trace,
            statusTransferSkillPick.trace,
            reactiveDefenseSkillPick.trace,
          ]
            .filter(Boolean)
            .join(' | ');

          return {
            defSkill,
            atkSkill,
            hardControlSkill,
            antiHealSkill,
            pierceSkill,
            executeSkill,
            recoverSkill,
            teamSupportSkill,
            invincibleSkill,
            shieldBreakSkill,
            shieldStealSkill,
            dotDetonateSkill,
            skillSealSkill,
            healInvertSkill,
            statusTransferSkill,
            reactiveDefenseSkill,
            npcAtkPower,
            skillTraceLog,
            threatProfile,
          };
        }

        function buildTacticalCandidates(
          defender,
          attacker,
          playerAction,
          behaviorState,
          skillContext,
          makeNpcAction,
          isSupport,
          isLowHealth,
        ) {
          const {
            defSkill,
            atkSkill,
            hardControlSkill,
            antiHealSkill,
            pierceSkill,
            executeSkill,
            recoverSkill,
            teamSupportSkill,
            invincibleSkill,
            shieldBreakSkill,
            shieldStealSkill,
            dotDetonateSkill,
            skillSealSkill,
            healInvertSkill,
            statusTransferSkill,
            reactiveDefenseSkill,
            npcAtkPower,
            threatProfile,
          } = skillContext;
          const playerPower = behaviorState.playerPower || 0;
          const isChargingHighThreat = !!behaviorState.isChargingHighThreat;
          const enemySnapshot = buildConditionTacticalSnapshot(attacker);
          const selfSnapshot = buildConditionTacticalSnapshot(defender);
          const enemyHpRatio = attacker.vit / Math.max(1, attacker.vit_max);
          const selfHpRatio = defender.vit / Math.max(1, defender.vit_max);
          const selfSpRatio = Math.max(0, Number(defender.sp || 0)) / Math.max(1, Number(defender.sp_max || 1));
          const selfMenRatio = Math.max(0, Number(defender.men || 0)) / Math.max(1, Number(defender.men_max || 1));
          const allyCount = behaviorState.alliesCount || 1;
          const lethalThreat = !!threatProfile?.lethalRisk;
          const severeThreat = !!threatProfile?.severeDamage;
          const severeControlThreat = !!threatProfile?.severeControl;
          const reactiveThreat = severeThreat || severeControlThreat || !!threatProfile?.moderateDamage;

          let isLockedBySpirit = false;
          if ((playerAction.cast_time || 0) > 0) {
            const pState = getPrimaryStateEffect(playerAction.skill) || {};
            const pCalc = getPrimaryStateCalc(playerAction.skill);
            const hasStructuredLock = Number(pCalc.lock_level || 0) > 0;
            const hasCompatFlagLock =
              getPrimaryStateFlags(playerAction.skill).includes('锁定') ||
              getPrimaryStateFlags(playerAction.skill).includes('威压');
            if (hasStructuredLock || hasCompatFlagLock) {
              if (attacker.men_max > defender.men_max) isLockedBySpirit = true;
            }
          }

          const tacticalBranches = [];

          if (reactiveThreat) {
            const emergencyDefenseSkill =
              (!threatProfile?.bypassesInvincible && invincibleSkill) ||
              reactiveDefenseSkill ||
              defSkill ||
              recoverSkill ||
              null;
            if (emergencyDefenseSkill) {
              tacticalBranches.push({
                name: '极限保命',
                weight: adjustBehaviorWeight(
                  '危机自保',
                  lethalThreat ? 155 : severeThreat ? 132 : 108,
                  defender,
                  attacker,
                  behaviorState,
                ),
                build() {
                  const severityText = lethalThreat ? '已逼近致命线' : severeControlThreat ? '可能被一举封死节奏' : '将承受重创';
                  return makeNpcAction(
                    '危机自保',
                    `[反应判定成功] NPC瞬间判断自己${severityText}，立即交出[${emergencyDefenseSkill.name}]进行极限保命！`,
                    emergencyDefenseSkill,
                  );
                },
              });
            }
          }

          const atkSummary = atkSkill ? deriveBattleSummaryFromEffects(atkSkill) : createEmptyBattleSummary();
          const executeSummary = executeSkill
            ? deriveBattleSummaryFromEffects(executeSkill)
            : createEmptyBattleSummary();
          const atkCastTime = getSkillCastTime(atkSkill);
          const executeCastTime = getSkillCastTime(executeSkill);

          if (enemySnapshot.hasHealingTrend && antiHealSkill && !enemySnapshot.hasAntiHeal) {
            tacticalBranches.push({
              name: '断疗压制',
              weight: adjustBehaviorWeight('断疗压制', 95, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '断疗压制',
                  `[战术封锁] NPC敏锐察觉到对手恢复节奏已成，立刻以[${antiHealSkill.name}]强行断疗压制！`,
                  antiHealSkill,
                );
              },
            });
          }
          if ((enemySnapshot.hasShielded || enemySnapshot.hasDefenseBuffed) && pierceSkill) {
            tacticalBranches.push({
              name: '破防强攻',
              weight: adjustBehaviorWeight(
                '破防强攻',
                enemySnapshot.hasShielded ? 90 : 75,
                defender,
                attacker,
                behaviorState,
              ),
              build() {
                return makeNpcAction(
                  '破防强攻',
                  `[破防识别] NPC判断常规打击难以奏效，改以[${pierceSkill.name}]强行撕开防御层！`,
                  pierceSkill,
                );
              },
            });
          }
          if (enemySnapshot.hasShielded && shieldBreakSkill) {
            tacticalBranches.push({
              name: '斩盾爆破',
              weight: adjustBehaviorWeight('破防强攻', 104, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '破防强攻',
                  `[护盾识别] NPC判断常规伤害会被护盾吞掉，直接以[${shieldBreakSkill.name}]斩碎护盾层！`,
                  shieldBreakSkill,
                );
              },
            });
          }
          if (enemySnapshot.hasShielded && shieldStealSkill && selfHpRatio < 0.75) {
            tacticalBranches.push({
              name: '夺盾续战',
              weight: adjustBehaviorWeight('危机自保', 84, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '危机自保',
                  `[护盾夺取] NPC判断自身续战压力偏大，转而用[${shieldStealSkill.name}]夺走对手护盾补强自身。`,
                  shieldStealSkill,
                );
              },
            });
          }
          if (enemySnapshot.debuffCount > 0 && dotDetonateSkill) {
            tacticalBranches.push({
              name: '持续引爆',
              weight: adjustBehaviorWeight('乘胜追击', enemyHpRatio < 0.5 ? 98 : 78, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '乘胜追击',
                  `[引爆窗口] NPC察觉对手身上已叠起持续伤害，立刻以[${dotDetonateSkill.name}]引爆全部压血。`,
                  dotDetonateSkill,
                );
              },
            });
          }
          if ((attacker?.蓄力技能 || isChargingHighThreat || (playerAction.cast_time || 0) >= 15) && skillSealSkill) {
            tacticalBranches.push({
              name: '封技断流',
              weight: adjustBehaviorWeight('危机自保', 112, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '危机自保',
                  `[术路封锁] NPC判断对手技能前摇已成，立即以[${skillSealSkill.name}]封死其后续术路。`,
                  skillSealSkill,
                );
              },
            });
          }
          if (enemySnapshot.hasHealingTrend && healInvertSkill && !enemySnapshot.hasAntiHeal) {
            tacticalBranches.push({
              name: '逆疗封锁',
              weight: adjustBehaviorWeight('断疗压制', 100, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '断疗压制',
                  `[逆疗反制] NPC识别到对手恢复链成型，果断用[${healInvertSkill.name}]把治疗窗口反拧成伤害。`,
                  healInvertSkill,
                );
              },
            });
          }
          if (selfSnapshot.hasBadCondition && statusTransferSkill) {
            tacticalBranches.push({
              name: '移祸转压',
              weight: adjustBehaviorWeight('危机自保', 76, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '危机自保',
                  `[移祸脱身] NPC不愿继续背着异常状态硬拼，转而用[${statusTransferSkill.name}]把压力甩回对手。`,
                  statusTransferSkill,
                );
              },
            });
          }
          if ((enemySnapshot.isLockedOrControlled || enemyHpRatio < 0.4) && executeSkill) {
            tacticalBranches.push({
              name: '乘胜追击',
              weight: adjustBehaviorWeight(
                '乘胜追击',
                enemyHpRatio < 0.35 ? 105 : 80,
                defender,
                attacker,
                behaviorState,
              ),
              build() {
                return makeNpcAction(
                  '乘胜追击',
                  `[收割窗口] NPC看准对手露出的破绽，立刻释放[${executeSkill.name}]试图完成收割！`,
                  executeSkill,
                );
              },
            });
          }
          if (
            (selfSpRatio < 0.35 || selfMenRatio < 0.35 || selfHpRatio < 0.45) &&
            recoverSkill &&
            !(selfSnapshot.hasHealingTrend && selfHpRatio > 0.55 && selfSpRatio > 0.45 && selfMenRatio > 0.45)
          ) {
            tacticalBranches.push({
              name: '稳态回气',
              weight: adjustBehaviorWeight('稳态回气', 72, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '稳态回气',
                  `[调整节奏] NPC判断硬拼将迅速透支，转而以[${recoverSkill.name}]修补状态链。`,
                  recoverSkill,
                );
              },
            });
          }
          if (allyCount > 1 && teamSupportSkill && !selfSnapshot.hasSharedVision) {
            tacticalBranches.push({
              name: '战术协同',
              weight: adjustBehaviorWeight('战术协同', 68, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '战术协同',
                  `[协同铺垫] NPC选择用[${teamSupportSkill.name}]为己方建立更高效的集火与联动节奏。`,
                  teamSupportSkill,
                );
              },
            });
          }
          if (
            (isChargingHighThreat || playerPower >= 220 || selfHpRatio < 0.45) &&
            reactiveDefenseSkill &&
            !selfSnapshot.hasReactiveDefense
          ) {
            tacticalBranches.push({
              name: '借力守势',
              weight: adjustBehaviorWeight('借力守势', 88, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '借力守势',
                  `[借势防御] NPC放弃盲目硬拼，转而用[${reactiveDefenseSkill.name}]等待对手失衡反噬。`,
                  reactiveDefenseSkill,
                );
              },
            });
          }

          if (
            selfSnapshot.hasSharedVision &&
            atkSkill &&
            atkSummary.目标规模 === '单体' &&
            atkSummary.爆发级别 !== '无'
          ) {
            tacticalBranches.push({
              name: '协同点杀',
              weight: adjustBehaviorWeight('协同点杀', enemyHpRatio < 0.5 ? 86 : 70, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '协同点杀',
                  `[视野锁头] NPC借助共享视野完成目标校准，立刻以[${atkSkill.name}]集中打穿要害！`,
                  atkSkill,
                );
              },
            });
          }

          if (enemySnapshot.isLockedOrControlled && atkSkill && (atkSummary.爆发级别 === '高' || atkCastTime >= 18)) {
            tacticalBranches.push({
              name: '连段爆发',
              weight: adjustBehaviorWeight('连段爆发', 82, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '连段爆发',
                  `[顺势爆发] NPC看准对手已被压制，果断接上[${atkSkill.name}]扩大伤害窗口！`,
                  atkSkill,
                );
              },
            });
          }

          if (enemySnapshot.hasDotPressure && executeSkill) {
            tacticalBranches.push({
              name: '压血收束',
              weight: adjustBehaviorWeight(
                '压血收束',
                enemyHpRatio < 0.45 ? 88 : 68,
                defender,
                attacker,
                behaviorState,
              ),
              build() {
                return makeNpcAction(
                  '压血收束',
                  `[持续压杀] NPC判断对手已被持续伤害拖入危险区，立刻以[${executeSkill.name}]完成收束。`,
                  executeSkill,
                );
              },
            });
          }

          if (defender.type === '强攻系' && atkSkill && selfHpRatio > 0.4 && playerPower <= npcAtkPower * 1.7) {
            tacticalBranches.push({
              name: '强攻压制',
              weight: adjustBehaviorWeight('强攻压制', enemyHpRatio < 0.5 ? 84 : 72, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '强攻压制',
                  `[正面压制] 身为强攻系，NPC更倾向以[${atkSkill.name}]持续压迫对手，不给其调整空间。`,
                  atkSkill,
                );
              },
            });
          }

          if (defender.type === '敏攻系' && (executeSkill || atkSkill)) {
            const agileStrike = executeSkill && executeCastTime <= 18 ? executeSkill : atkSkill;
            if (agileStrike) {
              tacticalBranches.push({
                name: '游击收割',
                weight: adjustBehaviorWeight(
                  '游击收割',
                  enemyHpRatio < 0.5 ? 90 : 70,
                  defender,
                  attacker,
                  behaviorState,
                ),
                build() {
                  return makeNpcAction(
                    '游击收割',
                    `[游击切入] 敏攻系NPC抓住节奏缝隙，以[${agileStrike.name}]高速切入撕开战局。`,
                    agileStrike,
                  );
                },
              });
            }
          }

          if (defender.type === '防御系' && reactiveDefenseSkill && !selfSnapshot.hasReactiveDefense) {
            tacticalBranches.push({
              name: '坚壁反制',
              weight: adjustBehaviorWeight(
                '坚壁反制',
                isChargingHighThreat || playerPower >= 220 ? 92 : 74,
                defender,
                attacker,
                behaviorState,
              ),
              build() {
                return makeNpcAction(
                  '坚壁反制',
                  `[以守待攻] 防御系NPC更擅长把战局拖入自己的节奏，先用[${reactiveDefenseSkill.name}]筑起反制层。`,
                  reactiveDefenseSkill,
                );
              },
            });
          }

          if (defender.type === '控制系' && hardControlSkill && !enemySnapshot.isLockedOrControlled) {
            tacticalBranches.push({
              name: '连锁控制',
              weight: adjustBehaviorWeight('连锁控制', 88, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '连锁控制',
                  `[节奏封锁] 控制系NPC优先争夺节奏，试图用[${hardControlSkill.name}]建立状态链优势。`,
                  hardControlSkill,
                );
              },
            });
          }

          if (
            ['辅助系', '治疗系', '食物系'].includes(defender.type) &&
            allyCount > 1 &&
            teamSupportSkill &&
            !selfSnapshot.hasSharedVision
          ) {
            tacticalBranches.push({
              name: '统筹增援',
              weight: adjustBehaviorWeight('统筹增援', 82, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '统筹增援',
                  `[团队统筹] 辅助型NPC更重视整体节奏，优先用[${teamSupportSkill.name}]为己方建立协同优势。`,
                  teamSupportSkill,
                );
              },
            });
          }

          if (isLockedBySpirit && defSkill) {
            tacticalBranches.push({
              name: '危机自保',
              weight: adjustBehaviorWeight('危机自保', 120, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '危机自保',
                  `[气机锁定] NPC被玩家恐怖的精神力死死锁定，不敢轻举妄动，只能全力转为防御！`,
                  defSkill,
                );
              },
            });
          } else if (isChargingHighThreat) {
            if (hardControlSkill) {
              tacticalBranches.push({
                name: '危机自保',
                weight: adjustBehaviorWeight('危机自保', 120, defender, attacker, behaviorState),
                build() {
                  return makeNpcAction(
                    '危机自保',
                    `[破绽捕捉] NPC察觉到玩家正在蓄力，果断释放[${hardControlSkill.name}]试图打断！`,
                    hardControlSkill,
                  );
                },
              });
            }
            if (atkSkill) {
              tacticalBranches.push({
                name: '强势对轰',
                weight: adjustBehaviorWeight('强势对轰', 90, defender, attacker, behaviorState),
                build() {
                  return makeNpcAction(
                    '强势对轰',
                    `[破绽捕捉] NPC见玩家露出极大的前摇破绽，立刻释放[${atkSkill.name}]企图趁机重创玩家！`,
                    atkSkill,
                  );
                },
              });
            }
            tacticalBranches.push({
              name: '伺机闪避',
              weight: adjustBehaviorWeight('伺机闪避', 60, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '伺机闪避',
                  `[致命预警] NPC察觉到毁灭性的蓄力波动，但无力打断，只能全力游走试图拉开距离。`,
                );
              },
            });
          } else if (isSupport || isLowHealth || playerPower >= 250) {
            if (defSkill) {
              tacticalBranches.push({
                name: '危机自保',
                weight: adjustBehaviorWeight('危机自保', 60, defender, attacker, behaviorState),
                build() {
                  return makeNpcAction(
                    '危机自保',
                    `[谨慎应对] NPC判断局势不利，选择以[${defSkill.name}]稳住阵脚。`,
                    defSkill,
                  );
                },
              });
            }
            if (atkSkill) {
              let clashWeight = playerPower > npcAtkPower * 1.5 ? 20 : 55;
              tacticalBranches.push({
                name: '强势对轰',
                weight: adjustBehaviorWeight('强势对轰', clashWeight, defender, attacker, behaviorState),
                build() {
                  return makeNpcAction(
                    '强势对轰',
                    playerPower > npcAtkPower * 1.5
                      ? `[孤注一掷] 尽管身处劣势，NPC仍狠下心正面搏杀！`
                      : `[强势对轰] NPC不甘示弱，释放[${atkSkill.name}]正面迎击！`,
                    atkSkill,
                  );
                },
              });
            }
            tacticalBranches.push({
              name: '伺机闪避',
              weight: adjustBehaviorWeight('伺机闪避', 85, defender, attacker, behaviorState),
              build() {
                return makeNpcAction('伺机闪避', `[劣势规避] NPC判断继续硬拼代价过高，选择战术性闪避。`);
              },
            });
          } else {
            if (atkSkill) {
              tacticalBranches.push({
                name: '强势对轰',
                weight: adjustBehaviorWeight('强势对轰', 75, defender, attacker, behaviorState),
                build() {
                  return makeNpcAction(
                    '强势对轰',
                    `[主动进攻] NPC抓住节奏，释放[${atkSkill.name}]尝试夺回主动权！`,
                    atkSkill,
                  );
                },
              });
            }
            if (defSkill) {
              tacticalBranches.push({
                name: '危机自保',
                weight: adjustBehaviorWeight('危机自保', 45, defender, attacker, behaviorState),
                build() {
                  return makeNpcAction('危机自保', `[稳扎稳打] NPC选择先用[${defSkill.name}]保护自身。`, defSkill);
                },
              });
            }
            tacticalBranches.push({
              name: '伺机闪避',
              weight: adjustBehaviorWeight('伺机闪避', 30, defender, attacker, behaviorState),
              build() {
                return makeNpcAction('伺机闪避', `[战术拉扯] NPC利用身法周旋，试图重排节奏。`);
              },
            });
          }

          tacticalBranches.push({
            name: '肉体兜底',
            weight: adjustBehaviorWeight('肉体兜底', 20, defender, attacker, behaviorState),
            build() {
              return makeNpcAction('肉体兜底', `[从容应对] NPC无合适魂技，收缩防御，准备肉体硬抗。`, null, {
                def_mult: 1.2,
              });
            },
          });

          return tacticalBranches;
        }
      
      // ==========================================
      // 📍 NPC 决策逻辑 (真实读取版)
        // ==========================================
        function determineNpcAction(combatData, playerAction, ratio) {
          hydrateCombatData(combatData);
          let defender = combatData.参战者.enemy;
          let attacker = combatData.参战者.player;

          function makeNpcAction(type, log, skill = null, extra = {}) {
            return Object.assign(
              {
                type,
                log,
                skill: skill ? normalizeSkillData(skill, skill.name || skill.技能名称 || type) : null,
                def_mult: 1.0,
              },
              extra,
            );
          }

          if (ratio < 0.5) {
            return makeNpcAction(
              '无法反应',
              '[速度碾压] NPC根本无法看清攻击轨迹，来不及做出任何反应！本回合防御力减半。',
              null,
              { def_mult: 0.5 },
            );
          }

          const combatType = combatData.战斗类型 || '突发遭遇';
          const isDeadlyFight = combatType === '死战' || combatType === '突发遭遇';
          const lvDiff = (attacker.lv || 1) - (defender.lv || 1);
          const playerPower = Number(getPrimaryDamageEffect(playerAction.skill)?.威力倍率 || 0) || 0;
          const isChargingHighThreat =
            !!attacker.蓄力技能 ||
            playerAction.action_type === '蓄力挨打' ||
            ((playerAction.cast_time || 0) >= 20 && playerPower >= 120);
          const isSupport = ['辅助系', '治疗系', '食物系'].includes(defender.type);
          const isLowHealth = defender.vit < defender.vit_max * 0.3;
          const activeBuffs = Object.keys(defender.状态效果 || {});
          const allyTeam = combatData.参战者.team_enemy || [];
          const availableSkills = collectCombatSkills(defender, allyTeam);
          const strategicContext = buildStrategicCandidates(
            defender,
            attacker,
            combatData,
            playerAction,
            ratio,
            availableSkills,
            allyTeam,
            makeNpcAction,
          );
          const behaviorState = strategicContext.behaviorState;
          const strategicAction = chooseAndBuildActorAction(
            defender,
            attacker,
            behaviorState,
            strategicContext.strategicBranches,
            '行为预演/战略阶段',
          );
          if (strategicAction) return strategicAction;
          const skillContext = buildNpcSkillCandidateContext(
            defender,
            attacker,
            playerAction,
            availableSkills,
            behaviorState,
            activeBuffs,
            isLowHealth,
          );
          const tacticalBranches = buildTacticalCandidates(
            defender,
            attacker,
            playerAction,
            behaviorState,
            skillContext,
            makeNpcAction,
            isSupport,
            isLowHealth,
          );

          const tacticalAction = chooseAndBuildActorAction(
            defender,
            attacker,
            behaviorState,
            tacticalBranches,
            '行为预演/战术阶段',
            `${skillContext.skillTraceLog ? skillContext.skillTraceLog + ' | ' : ''}`,
          );
          if (tacticalAction) return tacticalAction;
          const tacticalChoice = chooseActorActionByCandidates(
            defender,
            attacker,
            behaviorState,
            tacticalBranches,
            '行为预演/战术阶段',
          );
          return makeNpcAction(
            '肉体兜底',
            `${skillContext.skillTraceLog ? skillContext.skillTraceLog + ' | ' : ''}${tacticalChoice.trace ? tacticalChoice.trace + ' ' : ''}[从容应对] NPC无合适魂技，收缩防御，准备肉体硬抗。`,
            null,
            { def_mult: 1.2 },
          );
        }

        // ==========================================
        // 📍 5. 高阶机制伤害修饰与炸膛判定
        // ==========================================
        function applyHighTierMechanics(attackerChar, defenderChar, playerAction, baseResult) {
          let result = { ...baseResult };
          refreshSettleResultProjectedDamage(result);
          const primaryTargetEntry = summarizeProjectedDamageEntries(result.targetResults).primaryEntry;
          const primaryTarget = primaryTargetEntry?.target || defenderChar || null;
          let attackerStats = attackerChar.属性 || attackerChar;
          let defenderStats = primaryTarget?.属性 || primaryTarget || defenderChar?.属性 || defenderChar || {};
          const unlockedAttributeSet = new Set(collectBattleUnlockedAttributeTokens(attackerChar));
          const rewriteTargetResultsDamage = mapper => {
            if (!Array.isArray(result.targetResults) || !result.targetResults.length) return;
            result.targetResults = result.targetResults.map((entry, index) => ({
              ...entry,
              damage: Math.max(0, Math.floor(Number(mapper(entry, index) ?? entry.damage ?? 0))),
            }));
            refreshSettleResultProjectedDamage(result);
          };

          const skillElementLabel = getBattleSkillDisplayElement(playerAction.skill || {});
          let isHoly = skillElementLabel === '神圣' || skillElementLabel === '光明' || skillElementLabel === '生命';
          if (isHoly) {
            let doubledTargets = 0;
            rewriteTargetResultsDamage(entry => {
              const targetStats = entry?.target?.属性 || entry?.target || {};
              if (targetStats.is_evil) {
                doubledTargets += 1;
                return Number(entry?.damage || 0) * 2;
              }
              return Number(entry?.damage || 0);
            });
            if (doubledTargets > 0) {
              const targetSuffix = doubledTargets > 1 ? `，共压制 ${doubledTargets} 个邪属性目标` : '';
              result.desc += ` [神圣克制] 纯粹的光明之力如同沸水泼雪，无视等级压制，对邪魂师造成双倍真实伤害${targetSuffix}！`;
            }
          }

          if (playerAction.action_type === '多元素融合') {
            const fusionElements = sortBattleFusionElements(
              playerAction.fusionElements || playerAction.skill?.附带属性 || [],
            );
            const fusionSemantics = resolveBattleFusionSemantics(fusionElements);
            const missingFusionPermissions = fusionElements.filter(token => !unlockedAttributeSet.has(token));
            const gatedFusionSemantics = missingFusionPermissions.length
              ? {
                  ...fusionSemantics,
                  multiplier: 1,
                  failAdjust: 0,
                  derivedEffects: [],
                  summary: `${fusionSemantics.summary} 但当前缺少调用权：${missingFusionPermissions.join('/')}，只能按普通并行融合处理。`,
                }
              : fusionSemantics;
            const fusionPattern = String(
              gatedFusionSemantics.pattern || playerAction.fusionPattern || buildBattleFusionPattern(fusionElements),
            );
            const fusionLabel = fusionElements.length ? fusionPattern : `${fusionElements.length || 2}种元素`;
            let elementCount = fusionElements.length || 2;
            let isSilverDragon =
              attackerChar.血脉之力?.血脉?.includes('银龙王') ||
              Object.values(attackerChar.武魂 || {}).some(sp => sp.表象名称?.includes('元素使'));

            let failRate = 0;
            if (!isSilverDragon) {
              let baseFailRate = (elementCount - 1) * 35 + Number(gatedFusionSemantics.failAdjust || 0);
              let menAdvantage = (attackerStats.men / defenderStats.men_max) * 15;
              failRate = Math.max(5, baseFailRate - menAdvantage);
            }

            let roll = Math.floor(Math.random() * 100) + 1;
            if (fusionElements.length) {
              result.desc += ` [组合语义] ${gatedFusionSemantics.pattern}：${gatedFusionSemantics.summary}`;
              if (Array.isArray(gatedFusionSemantics.derivedEffects) && gatedFusionSemantics.derivedEffects.length) {
                result.desc += ` [衍生能力] ${gatedFusionSemantics.derivedEffects.join(' / ')}`;
              }
            }

            if (roll <= failRate) {
              rewriteTargetResultsDamage(() => 0);
              result.backlash_dmg = Math.floor(attackerStats.vit_max * 0.3);
              result.desc += ` [元素炸膛] 精神力失控！${fusionLabel}在手中轰然引爆，遭到极致反噬！(Roll: ${roll} <= 炸膛率: ${Math.floor(failRate)}%)`;
            } else {
              let multiplier = Math.pow(1.5, elementCount - 1) * Number(gatedFusionSemantics.multiplier || 1);
              if (isSilverDragon) result.desc += ` [血脉特权] 银龙王血脉无视元素排斥，炸膛率强制归零！`;
              if (playerAction.is_charged) {
                multiplier *= 1.5;
                result.desc += ` [极致蓄力] 元素被压缩到极致！`;
              }
              rewriteTargetResultsDamage(entry => Number(entry?.damage || 0) * multiplier);
              result.desc += ` [元素共鸣] ${fusionLabel}完美融合！威力呈指数级暴涨！(威力倍率: x${multiplier.toFixed(2)})`;
            }
          }

          return refreshSettleResultProjectedDamage(result);
        }

        // ==========================================
        // 📍 6. 辅助区：意图解析与NPC决策 (真实读取版)
        // ==========================================
        function parseSerializedPlayerActionQueue(playerInput) {
          const source = String(playerInput || '');
          const match = source.match(/\[动作队列\]([\s\S]*?)\[\/动作队列\]/i);
          if (!match) return [];
          try {
            const parsed = JSON.parse(match[1]);
            return Array.isArray(parsed) ? parsed.filter(item => item && typeof item === 'object') : [];
          } catch (error) {
            console.warn('battle action queue parse failed', error);
            return [];
          }
        }

        function buildPlayerActionFromSerializedEntry(entry) {
          if (!entry || typeof entry !== 'object') return null;
          const actionType = String(entry.action_type || entry.type || entry.skill?.技能类型 || '常规攻击').trim() || '常规攻击';
          const rawSkill = entry.skill && typeof entry.skill === 'object' ? entry.skill : { name: actionType };
          const skillName = String(
            rawSkill.魂技名 || rawSkill.name || rawSkill.技能名称 || actionType,
          ).trim() || actionType;
          const nextAction = {
            action_type: actionType,
            cast_time: Number(entry.cast_time ?? rawSkill.cast_time ?? 10) || 10,
            is_charged: entry.is_charged === true,
            skill: normalizeSkillData(rawSkill, skillName),
          };
          if (entry.equip_target) nextAction.equip_target = String(entry.equip_target || '').trim();
          if (entry.heal_ratio !== undefined) nextAction.heal_ratio = Number(entry.heal_ratio || 0) || 0;
          if (Array.isArray(entry.fusionElements)) {
            nextAction.fusionElements = normalizeBattleSkillAttributeTokens(entry.fusionElements);
          }
          if (entry.fusionPattern) nextAction.fusionPattern = String(entry.fusionPattern || '').trim();
          return nextAction;
        }

        function parsePlayerIntent(playerInput) {
          let combatData = window.BattleUIBridge?.getMVU('world.战斗');
          hydrateCombatData(combatData);
          let attacker = combatData.参战者.player;
          const preferredPlayerName = String(window.BattleUIBridge?.getMVU('sys.玩家名') || attacker?.name || '').trim();
          let charData =
            (attacker?.name ? window.BattleUIBridge?.getMVU('char.' + attacker.name) : null) ||
            (preferredPlayerName ? window.BattleUIBridge?.getMVU('char.' + preferredPlayerName) : null);
          bindCombatParticipant(charData);

          let action = {
            action_type: '常规攻击',
            cast_time: 10,
            is_charged: false,
            skill: normalizeSkillData(
              {
                name: '普通攻击',
                _效果数组: [
                  { 机制: '系统基础', 消耗: '无', 对象: '敌方/单体', 技能类型: '输出', cast_time: 10 },
                  { 机制: '直接伤害', 目标: '敌方单体', 威力倍率: 100, 伤害类型: '物理近战', 穿透修饰: 0 },
                ],
              },
              '普通攻击',
            ),
          };
          if (!charData) return action;

          const serializedQueue = parseSerializedPlayerActionQueue(playerInput);
          if (serializedQueue.length) {
            const queueActions = serializedQueue.map(buildPlayerActionFromSerializedEntry).filter(Boolean);
            if (queueActions.length) {
              const mainAction = queueActions[queueActions.length - 1];
              const preActions = queueActions.slice(0, -1);
              if (preActions.length) mainAction.pre_actions = preActions;
              return mainAction;
            }
          }

          if (/防御/.test(playerInput) && !/普通攻击|攻击|伤害/.test(playerInput)) {
            action.action_type = '防御';
            action.cast_time = 10;
            action.skill = normalizeSkillData({ name: '防御', 技能类型: '防御', 消耗: '无', cast_time: 10 }, '防御');
            return action;
          }
          if (/闪避/.test(playerInput)) {
            action.action_type = '闪避';
            action.cast_time = 12;
            action.skill = normalizeSkillData({ name: '闪避', 技能类型: '防御', 消耗: '体力', cast_time: 12 }, '闪避');
            return action;
          }
          if (/撤离|逃跑|逃走|脱离/.test(playerInput)) {
            action.action_type = '撤离';
            action.cast_time = 20;
            action.skill = normalizeSkillData({ name: '撤离', 技能类型: '辅助', 消耗: '无', cast_time: 20 }, '撤离');
            return action;
          }

          let matchedSkill = null;
          let matchedSkillName = '';
          // 为了支持多重施法，我们需要找出所有被提及的技能。但为了保持单技能模式兜底，我们先选出最主要的那个。
          // TODO: 后续可以升级为返回技能数组，这里先保留主技能逻辑，把时间累计放进 pre_actions 处理中
          let directSkills = collectCombatSkills(charData, combatData.参战者.team_player || []);
          directSkills.forEach(skill => {
            let plainName = (skill.name || '').replace(/^武魂融合技·/, '');
            if (playerInput.includes(skill.name) || (plainName && playerInput.includes(plainName))) {
              // 如果提及多个，这里会被覆盖为最后一个，目前作为主动作
              matchedSkill = skill;
              matchedSkillName = skill.name;
            }
          });

          if (matchedSkill) {
            action.action_type = matchedSkillName.includes('武魂融合技') ? '武魂融合技' : '释放魂技';
            action.cast_time = getSkillCastTime(matchedSkill) || 10;
            action.skill = normalizeSkillData(matchedSkill, matchedSkillName);
          }

          // 💥 [核心改造] 副动作(Pre-Actions)多维复合解析引擎
          // 把玩家提及的额外操作统一压入 pre_actions 数组。之后会在外层判断总 cast_time。
          action.pre_actions = [];

          // 1. 生命之火 (通常认为是极速瞬间爆发)
          if (playerInput.includes('生命之火')) {
            let lifeFireSkillData = charData.血脉之力?.技能?.['点燃生命之火'];
            if (lifeFireSkillData) {
              action.pre_actions.push({
                action_type: '点燃生命之火',
                skill: normalizeSkillData(lifeFireSkillData, '点燃生命之火'),
                cast_time: 5, // 给一点微小的基础耗时，防止无限套娃
              });
            }
          }

          // 2. 穿戴斗铠 (极其吃前摇)
          if (
            playerInput.includes('斗铠') &&
            (playerInput.includes('穿') || playerInput.includes('释放') || playerInput.includes('附体'))
          ) {
            let armorLv = charData.装备?.斗铠?.等级 || 1;
            let isRejected = charData.装备?.斗铠?._已排异 || false;
            let minQ = Infinity;
            let pCount = 0;
            if (charData.装备?.斗铠?.parts) {
              Object.values(charData.装备.斗铠.parts).forEach(p => {
                if (p.状态 !== '未打造' && p.状态 !== '重创') {
                  if (p.品质系数 < minQ) minQ = p.品质系数;
                  pCount++;
                }
              });
            }

            let armorCast = Math.max(0, 20 - armorLv * 5);
            if (armorLv === 1 && !isRejected && minQ > 1.2 && pCount > 0) {
              armorCast = Math.max(0, armorCast - 5);
            }

            // 不再硬性判断是否瞬间，统统塞进去，外层的 40上限 机制会教他做人
            action.pre_actions.push({
              action_type: '穿戴装备',
              equip_target: 'armor',
              cast_time: armorCast,
              skill: normalizeSkillData({
                name: armorCast <= 0 ? '斗铠瞬间附体' : '斗铠附体读条',
                技能类型: '辅助',
                消耗: '无',
              }),
            });
            playerInput = playerInput.replace(/斗铠/g, '已解析的斗铠');
          }

          // 3. 展开各类领域 (通常较快)
          if (playerInput.includes('斗铠领域')) {
            action.pre_actions.push({
              action_type: '展开斗铠领域',
              cast_time: 0,
              skill: normalizeSkillData({ name: '展开斗铠领域', 技能类型: '辅助', 消耗: '无' }),
            });
          } else if (playerInput.includes('精神领域')) {
            action.pre_actions.push({
              action_type: '展开精神领域',
              cast_time: 0,
              skill: normalizeSkillData({ name: '展开精神领域', 技能类型: '辅助', 消耗: '无' }),
            });
          } else if (playerInput.includes('武魂领域')) {
            action.pre_actions.push({
              action_type: '展开武魂领域',
              cast_time: 0,
              skill: normalizeSkillData({ name: '展开武魂领域', 技能类型: '辅助', 消耗: '无' }),
            });
          }

          // 4. 武魂融合技判定 (这是一个巨大的主动作，会覆盖掉普通的释放魂技)
          if (playerInput.includes('武魂融合技')) {
            let hasFusion = false;
            Object.entries(charData.武魂融合技 || {}).forEach(([fusionName, fusionSkill]) => {
              if (!isFusionSkillAvailable(charData, fusionSkill, combatData.参战者.team_player || [])) return;
              hasFusion = true;
              action.action_type = '武魂融合技';
              action.skill = buildFusionCombatSkill(fusionSkill, fusionName);
              action.skill.name = `武魂融合技·${action.skill.name}`;
              action.cast_time = getSkillCastTime(action.skill) || 30;
            });
            if (!hasFusion) {
              action.action_type = '施法失败';
              action.cast_time = 0;
            }
          } else if (!matchedSkill) {
            // 如果没有任何武魂融合技、也没有匹配到具体魂技，但是匹配到了一些其它的特殊主动作
            if (playerInput.includes('多元素融合')) {
              action.action_type = '多元素融合';
              action.fusionElements = extractBattleFusionElementsFromText(playerInput);
              action.fusionPattern = buildBattleFusionPattern(action.fusionElements);
              if (playerInput.includes('蓄力')) action.is_charged = true;
              let isSilverDragon =
                charData.血脉之力?.血脉?.includes('银龙王') ||
                Object.values(charData.武魂 || {}).some(sp => sp.表象名称?.includes('元素使'));
              if (isSilverDragon) action.cast_time = 5;
              action.skill = normalizeSkillData({
                name: '多元素融合',
                技能类型: '输出',
                消耗: '无',
                附带属性: action.fusionElements || [],
              });
            } else if (playerInput.includes('元素剥离')) {
              action.action_type = '元素剥离';
              action.cast_time = 15;
              action.skill = normalizeSkillData({
                name: '元素剥离',
                技能类型: '控制',
                消耗: '魂力:15% 精神力:20%',
                cast_time: 15,
              });
            } else if (playerInput.includes('五行剥离')) {
              action.action_type = '五行剥离';
              action.cast_time = 18;
              action.skill = normalizeSkillData({
                name: '五行剥离',
                技能类型: '控制',
                消耗: '魂力:18% 精神力:25%',
                cast_time: 18,
              });
            } else if (playerInput.includes('五行遁法')) {
              action.action_type = '五行遁法';
              action.cast_time = 12;
              action.skill = normalizeSkillData({
                name: '五行遁法',
                技能类型: '辅助',
                消耗: '魂力:12% 精神力:18% 维持:精神力:8%',
                cast_time: 12,
              });
            } else if (playerInput.includes('吸血反哺')) {
              action.action_type = '吸血反哺';
              action.heal_ratio = 0.3;
            } else if (playerInput.includes('机甲') && (playerInput.includes('召唤') || playerInput.includes('进入'))) {
              // 普通机甲同理，必须作为主动作读条
              action.action_type = '穿戴装备';
              let mechLv = charData.装备?.机甲?.等级 || '黄级';
              action.cast_time = mechLv === '红级' ? 0 : 50;
              action.equip_target = 'mech';
              action.skill = normalizeSkillData({ name: '召唤机甲', 技能类型: '辅助', 消耗: '无' });
            }
          }

          return action;
        }

        // ==========================================
        // 📍 团战前置：行动轴与索敌逻辑
        // ==========================================

        // 1. 生成全局行动轴
        function generateActionQueue(combatData) {
          let allFighters = [];

          (combatData.参战者.team_player || []).forEach(p => {
            bindCombatParticipant(p);
            syncCombatActionState(p);
            if (isCombatUnitAbleToFight(p)) allFighters.push({ char: p, side: 'player' });
          });
          (combatData.参战者.team_enemy || []).forEach(e => {
            bindCombatParticipant(e);
            syncCombatActionState(e);
            if (isCombatUnitAbleToFight(e)) allFighters.push({ char: e, side: 'enemy' });
          });

          let typePriority = {
            辅助系: 1,
            控制系: 2,
            敏攻系: 2,
            强攻系: 2,
            精神系: 2,
            元素系: 2,
            防御系: 3,
            治疗系: 3,
            食物系: 3,
          };

          allFighters.sort((a, b) => {
            let pA = typePriority[a.char.type] || 4;
            let pB = typePriority[b.char.type] || 4;
            if (pA !== pB) return pA - pB;

            let agiA = a.char.agi;
            let agiB = b.char.agi;
            return agiB - agiA;
          });

          return allFighters;
        }

        // 2. D100 索敌逻辑
        function findTarget(attackerChar, enemyTeam) {
          bindCombatParticipant(attackerChar);
          (enemyTeam || []).forEach(bindCombatParticipant);
          let validTargets = enemyTeam.filter(t => isCombatUnitAbleToFight(t));
          if (validTargets.length === 0) return null;
          const forcedTauntTargetName = getForcedTauntTargetName(attackerChar);
          if (forcedTauntTargetName) {
            const forcedTarget = validTargets.find(target => isCombatUnitIdentityMatch(target, forcedTauntTargetName));
            if (forcedTarget) return forcedTarget;
          }
          const attackerSnapshot = buildConditionTacticalSnapshot(attackerChar);
          if (!attackerSnapshot.hasSharedVision && !attackerSnapshot.hasTargetLock) {
            const visibleTargets = validTargets.filter(target => !buildConditionTacticalSnapshot(target).hasStealthed);
            if (visibleTargets.length > 0) validTargets = visibleTargets;
          }
          if (validTargets.length === 1) return validTargets[0];

          let totalWeight = 0;
          let weightedTargets = validTargets.map(target => {
            let weight = 10;
            let isSupport = ['辅助系', '治疗系', '食物系', '控制系'].includes(target.type);
            let isTank = ['防御系', '强攻系'].includes(target.type);
            let hpRatio = target.vit / target.vit_max;

            if (attackerChar.type === '敏攻系') {
              if (isSupport) weight += 60;
              if (hpRatio < 0.3) weight += 30;
            } else if (attackerChar.type === '强攻系') {
              if (isTank) weight += 50;
              if (hpRatio < 0.5) weight += 40;
            } else if (attackerChar.type === '控制系') {
              if (isTank) weight += 40;
              if (isSupport) weight += 40;
            } else {
              if (hpRatio < 0.5) weight += 50;
            }

            totalWeight += weight;
            return { target: target, weight: weight };
          });

          let roll = Math.random() * totalWeight;
          for (let wt of weightedTargets) {
            roll -= wt.weight;
            if (roll <= 0) return wt.target;
          }
          return weightedTargets[0].target;
        }

        function findAllyTarget(actorChar, allyTeam) {
          if (!allyTeam || allyTeam.length === 0) return actorChar;
          let validAllies = allyTeam.filter(t => isCombatUnitAlive(t));
          if (validAllies.length === 0) return actorChar;

          let lowestHpRatio = 1.0;
          let targetAlly = actorChar;

          for (let ally of validAllies) {
            bindCombatParticipant(ally);
            let hpRatio = ally.vit / Math.max(1, ally.vit_max);
            if (hpRatio < lowestHpRatio) {
              lowestHpRatio = hpRatio;
              targetAlly = ally;
            }
          }
          return targetAlly;
        }

        function scoreEnemyTargetForSkill(attackerChar, target, skill) {
          bindCombatParticipant(attackerChar);
          bindCombatParticipant(target);
          const snapshot = buildConditionTacticalSnapshot(target);
          const attackerSnapshot = buildConditionTacticalSnapshot(attackerChar);
          const summary = deriveBattleSummaryFromEffects(skill);
          const 决策标签 = getSkillAiRoleTags(skill);
          const dmg = getPrimaryDamageEffect(skill);
          const hpRatio = Math.max(0, Number(target.vit || 0)) / Math.max(1, Number(target.vit_max || 1));
          const power = Number(dmg?.威力倍率 || 0);
          const penetration = Number(dmg?.穿透修饰 || 0);
          const isSupport = ['辅助系', '治疗系', '食物系', '控制系'].includes(target.type);
          const isTank = ['防御系', '强攻系'].includes(target.type);
          let weight = 10;

          if (attackerChar.type === '敏攻系') {
            if (isSupport) weight += 45;
            if (hpRatio < 0.4) weight += 30;
          } else if (attackerChar.type === '强攻系') {
            if (isTank) weight += 20;
            if (hpRatio < 0.5) weight += 25;
          } else if (attackerChar.type === '控制系') {
            if (isSupport) weight += 35;
            if (!snapshot.isLockedOrControlled) weight += 15;
          } else {
            if (hpRatio < 0.5) weight += 25;
          }

          if (hasSkillMechanism(skill, ['禁疗'])) {
            if (snapshot.hasAntiHeal) weight -= 40;
            if (snapshot.hasHealingTrend || isSupport) weight += 70;
          }
          if (hasSkillMechanism(skill, ['斩杀补伤']) || (summary.爆发级别 === '高' && power >= 180)) {
            if (hpRatio < 0.35) weight += 80;
            else if (hpRatio < 0.55) weight += 25;
            if (snapshot.isLockedOrControlled) weight += 20;
            if (snapshot.hasDotPressure) weight += 15;
          }
          if (penetration >= 15 || /破甲|穿透|粉碎/.test(String(skill?.name || ''))) {
            if (snapshot.hasShielded) weight += 60;
            if (snapshot.hasDefenseBuffed || isTank) weight += 35;
          }
          if (summary.控制强度 !== '无') {
            if (!snapshot.isLockedOrControlled) weight += 30;
            else weight -= 25;
            if (target.蓄力技能) weight += 35;
          }
          if (hasSkillMechanism(skill, ['持续伤害'])) {
            if (hpRatio > 0.55) weight += 20;
            if (snapshot.debuffCount > 0) weight += 15;
            if (hpRatio < 0.25) weight -= 15;
          }
          if (hasSkillMechanism(skill, ['引爆持续伤害']) && snapshot.debuffCount > 0) {
            weight += 40 + snapshot.debuffCount * 6;
          }
          if (hasSkillMechanism(skill, ['破隐']) && snapshot.hasStealthed) weight += 75;
          if (hasSkillMechanism(skill, ['窃取增益']) && snapshot.buffCount > 0) weight += 60 + snapshot.buffCount * 8;
          if (hasSkillMechanism(skill, ['窃取护盾', '斩盾']) && snapshot.hasShielded) weight += 55;
          if (hasSkillMechanism(skill, ['治疗反转']) && snapshot.hasHealingTrend) weight += 48;
          if (hasSkillMechanism(skill, ['封技']) && target.蓄力技能) weight += 65;
          if (hasSkillMechanism(skill, ['嘲讽'])) {
            const offenseScore = Math.max(Number(target.str || 0), Number(target.men_max || 0));
            if (isSupport) weight += 20;
            weight += Math.min(45, Math.floor(offenseScore / 250));
          }
          if (决策标签.includes('规则压制型')) {
            if (snapshot.hasShielded || snapshot.hasHealingTrend || target.蓄力技能) weight += 12;
          }
          if (snapshot.hasStealthed && !canBypassStealth(attackerChar, skill) && !attackerSnapshot.hasSharedVision) {
            weight = Math.max(1, Math.floor(weight * 0.18));
          }
          return Math.max(1, weight);
        }

        function chooseEnemyTargetForSkill(attackerChar, enemyTeam, skill, fallbackTarget = null) {
          const validTargets = (enemyTeam || []).filter(target => target && isCombatUnitAbleToFight(target));
          if (validTargets.length === 0) return fallbackTarget || null;
          const forcedTauntTargetName = getForcedTauntTargetName(attackerChar);
          if (forcedTauntTargetName) {
            const forcedTarget = validTargets.find(target => isCombatUnitIdentityMatch(target, forcedTauntTargetName));
            if (forcedTarget) return forcedTarget;
          }
          const focusTarget = getActorFocusedTarget(attackerChar, validTargets);
          if (!skill) return focusTarget || fallbackTarget || validTargets[0];
          const effectiveTargets = canBypassStealth(attackerChar, skill)
            ? validTargets
            : (() => {
                const visibleTargets = validTargets.filter(target => !buildConditionTacticalSnapshot(target).hasStealthed);
                return visibleTargets.length > 0 ? visibleTargets : validTargets;
              })();
          const effectiveFocusTarget =
            focusTarget && effectiveTargets.some(target => target.name === focusTarget.name) ? focusTarget : null;
          if (effectiveTargets.length === 1) return effectiveTargets[0];
          const memory = ensureActorDecisionMemory(attackerChar);
          const summary = deriveBattleSummaryFromEffects(skill);
          const picked = chooseWeightedOption(
            effectiveTargets.map(target => {
              let weight = scoreEnemyTargetForSkill(attackerChar, target, skill);
              if (focusTarget && target.name === focusTarget.name) {
                weight += 18 + Number(memory.focus_ttl || 0) * 6;
                if (memory.focus_reason === 'control_window') {
                  if (summary.爆发级别 === '高' || hasSkillMechanism(skill, ['斩杀补伤'])) weight += 18;
                  if (summary.控制强度 !== '无') weight -= 12;
                } else if (memory.focus_reason === 'anti_heal_window') {
                  if (hasSkillMechanism(skill, ['持续伤害', '斩杀补伤']) || summary.爆发级别 !== '无') weight += 12;
                } else if (memory.focus_reason === 'armor_break_window') {
                  if (Number(getPrimaryDamageEffect(skill)?.穿透修饰 || 0) >= 15 || summary.爆发级别 === '高')
                    weight += 14;
                } else if (memory.focus_reason === 'shared_vision_focus') {
                  if (summary.目标规模 === '单体') weight += 18;
                } else if (memory.focus_reason === 'dot_pressure') {
                  if (hasSkillMechanism(skill, ['斩杀补伤', '持续伤害']) || summary.爆发级别 === '高') weight += 16;
                } else if (memory.focus_reason === 'finisher') {
                  if (hasSkillMechanism(skill, ['斩杀补伤']) || summary.爆发级别 !== '无') weight += 22;
                }
              }
              return { target, weight: Math.max(1, weight) };
            }),
          );
          return picked?.target || effectiveFocusTarget || fallbackTarget || effectiveTargets[0];
        }

        function scoreAllyTargetForSkill(actorChar, ally, skill) {
          bindCombatParticipant(actorChar);
          bindCombatParticipant(ally);
          const snapshot = buildConditionTacticalSnapshot(ally);
          const hpRatio = Math.max(0, Number(ally.vit || 0)) / Math.max(1, Number(ally.vit_max || 1));
          const spRatio = Math.max(0, Number(ally.sp || 0)) / Math.max(1, Number(ally.sp_max || 1));
          const menRatio = Math.max(0, Number(ally.men || 0)) / Math.max(1, Number(ally.men_max || 1));
          const attackScore = Math.max(Number(ally.str || 0), Number(ally.men_max || 0));
          let weight = ally.name === actorChar.name ? 12 : 10;
          if (
            getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect, ['vit'])) ||
            hasSkillMechanism(skill, ['护盾', '免死', '护卫'])
          )
            weight += Math.floor((1 - hpRatio) * 120) + (snapshot.hasBadCondition ? 15 : 0);
          if (getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect, ['sp', 'men'])))
            weight += Math.floor((1 - spRatio) * 40) + Math.floor((1 - menRatio) * 40);
          if (hasSkillMechanism(skill, ['共享视野'])) weight += Math.min(40, Math.floor(attackScore / 500));
          if (hasSkillMechanism(skill, ['护卫']) && ally.name !== actorChar.name) weight += Math.floor((1 - hpRatio) * 90) + 20;
          if (hasSkillMechanism(skill, ['嘲讽']) && ally.name === actorChar.name) weight += 35;
          if (hasSkillMechanism(skill, ['隐身'])) {
            if (ally.name === actorChar.name) weight += 18;
            if (hpRatio < 0.5) weight += 20;
          }
          if (['辅助系', '治疗系', '食物系', '控制系'].includes(ally.type)) weight += 10;
          return Math.max(1, weight);
        }

        function chooseAllyTargetForSkill(actorChar, allyTeam, skill, fallbackTarget = null) {
          const validAllies = (allyTeam || []).filter(target => target && isCombatUnitAlive(target));
          if (validAllies.length === 0) return actorChar;
          if (!skill) return fallbackTarget || validAllies[0] || actorChar;
          const picked = chooseWeightedOption(
            validAllies.map(target => ({ target, weight: scoreAllyTargetForSkill(actorChar, target, skill) })),
          );
          return picked?.target || fallbackTarget || validAllies[0] || actorChar;
        }

        function chooseTargetForActor(actorEntry, battleState) {
          if (!actorEntry || !battleState?.combatData) return null;
          const enemyTeam =
            actorEntry.side === 'player'
              ? battleState.combatData.参战者.team_enemy || []
              : battleState.combatData.参战者.team_player || [];
          const allyTeam =
            actorEntry.side === 'player'
              ? battleState.combatData.参战者.team_player || []
              : battleState.combatData.参战者.team_enemy || [];
          const focusEnemy = getActorFocusedTarget(actorEntry.char, enemyTeam);
          return {
            enemyTarget: focusEnemy || findTarget(actorEntry.char, enemyTeam),
            allyTarget: findAllyTarget(actorEntry.char, allyTeam),
          };
        }

        function buildAutoActionForActor(actorEntry, targets, battleState) {
          const actor = actorEntry?.char;
          if (!actor) return null;
          bindCombatParticipant(actor);
          const enemyTarget = targets?.enemyTarget;
          const allyTarget = targets?.allyTarget;
          if (enemyTarget) bindCombatParticipant(enemyTarget);
          if (allyTarget) bindCombatParticipant(allyTarget);

          const allyTeam =
            actorEntry.side === 'player'
              ? (battleState.combatData.参战者.team_player || []).filter(unit => unit.name !== actor.name)
              : (battleState.combatData.参战者.team_enemy || []).filter(unit => unit.name !== actor.name);

          const makeActorAction = (type, log, skill = null, extra = {}) =>
            Object.assign(
              {
                type,
                log,
                skill: skill ? normalizeSkillData(skill, skill.name || skill.技能名称 || type) : null,
                def_mult: 1.0,
              },
              extra,
            );

          const observedTargetAction = enemyTarget?.蓄力技能 || {
            action_type: '常规攻击',
            cast_time: 10,
            skill: normalizeSkillData(
              {
                name: '普通攻击',
                _效果数组: [
                  { 机制: '系统基础', 消耗: '无', 对象: '敌方/单体', 技能类型: '输出', cast_time: 10 },
                  { 机制: '直接伤害', 目标: '敌方单体', 威力倍率: 100, 伤害类型: '物理近战', 穿透修饰: 0 },
                ],
              },
              '普通攻击',
            ),
          };

          const ratio = enemyTarget?.蓄力技能
            ? calculateReactionRatio(enemyTarget, actor, observedTargetAction, {
                战斗类型: battleState.combatData.战斗类型 || '突发遭遇',
                先攻: actor.name,
                参战者: { player: enemyTarget, enemy: actor },
              })
            : 1;

          const availableSkills = collectCombatSkills(actor, allyTeam);
          const strategicContext = buildStrategicCandidates(
            actor,
            enemyTarget,
            battleState.combatData,
            observedTargetAction,
            ratio,
            availableSkills,
            allyTeam,
            makeActorAction,
          );
          const isSupport = ['辅助系', '治疗系', '食物系'].includes(actor.type);
          const isLowHealth = actor.vit < actor.vit_max * 0.3;

          const strategicAction = chooseAndBuildActorAction(
            actor,
            enemyTarget,
            strategicContext.behaviorState,
            strategicContext.strategicBranches,
            '行为预演/主动战略阶段',
          );
          const convertDecisionToTurnAction = decisionAction => {
            if (!decisionAction) return null;
            const neutralSkill = normalizeSkillData(
              {
                name: decisionAction.type || '战术动作',
                _效果数组: [{ 机制: '系统基础', 消耗: '无', 对象: '自身', 技能类型: '辅助', cast_time: 10 }],
              },
              decisionAction.type || '战术动作',
            );

            return {
              action_type: decisionAction.type || '释放技能',
              cast_time: decisionAction.skill?.cast_time || 10,
              skill: decisionAction.skill || neutralSkill,
              source: 'auto_actor',
              decision_log: decisionAction.log,
              def_mult: decisionAction.def_mult || 1.0,
            };
          };
          if (strategicAction) return convertDecisionToTurnAction(strategicAction);

          const skillContext = buildNpcSkillCandidateContext(
            actor,
            enemyTarget,
            observedTargetAction,
            availableSkills,
            strategicContext.behaviorState,
            strategicContext.activeBuffs,
            isLowHealth,
          );
          const tacticalBranches = buildTacticalCandidates(
            actor,
            enemyTarget,
            observedTargetAction,
            strategicContext.behaviorState,
            skillContext,
            makeActorAction,
            isSupport,
            isLowHealth,
          );
          const tacticalAction = chooseAndBuildActorAction(
            actor,
            enemyTarget,
            strategicContext.behaviorState,
            tacticalBranches,
            '行为预演/主动战术阶段',
            `${skillContext.skillTraceLog ? skillContext.skillTraceLog + ' | ' : ''}`,
          );
          if (tacticalAction) return convertDecisionToTurnAction(tacticalAction);

          return {
            action_type: '常规攻击',
            cast_time: 10,
            skill: normalizeSkillData(
              {
                name: '普通攻击',
                _效果数组: [
                  { 机制: '系统基础', 消耗: '无', 对象: '敌方/单体', 技能类型: '输出', cast_time: 10 },
                  { 机制: '直接伤害', 目标: '敌方单体', 威力倍率: 100, 伤害类型: '物理近战', 穿透修饰: 0 },
                ],
              },
              '普通攻击',
            ),
            source: 'auto_actor',
            decision_log: '[行为预演/主动战术阶段] 无更优动作，回落为普通攻击。',
          };
        }

        function createActorTurnCombatData(actorEntry, target, battleState) {
          const actor = actorEntry.char;
          const actorAllies =
            actorEntry.side === 'player'
              ? (battleState.combatData.参战者.team_player || []).filter(unit => unit.name !== actor.name)
              : (battleState.combatData.参战者.team_enemy || []).filter(unit => unit.name !== actor.name);
          const targetAllies =
            actorEntry.side === 'player'
              ? (battleState.combatData.参战者.team_enemy || []).filter(unit => unit.name !== target.name)
              : (battleState.combatData.参战者.team_player || []).filter(unit => unit.name !== target.name);

          return {
            战斗类型: battleState.combatData.战斗类型 || '突发遭遇',
            先攻: actor.name,
            参战者: {
              player: actor,
              enemy: target,
              team_player: actorAllies,
              team_enemy: targetAllies,
            },
          };
        }

        function isActorHardControlled(char) {
          if (!char?.状态效果) return false;
          return Object.values(char.状态效果).some(cond => cond?.战斗效果?.skip_turn === true);
        }

        function runActorTurn(actorEntry, battleState) {
          if (!actorEntry || !battleState?.combatData) return null;
          const actor = actorEntry.char;
          bindCombatParticipant(actor);
          syncCombatActionState(actor);
          if (!isCombatUnitAlive(actor)) {
            return { actor: actor.name, side: actorEntry.side, skipped: true, reason: '已失去战斗力' };
          }
          if (!isCombatUnitAbleToFight(actor)) {
            return {
              actor: actor.name,
              side: actorEntry.side,
              skipped: true,
              reason: '体力耗尽',
              log: `[团战执行] ${actor.name}体力归零，已陷入昏迷，本回合无法行动。`,
            };
          }

          if (isActorHardControlled(actor)) {
            return {
              actor: actor.name,
              side: actorEntry.side,
              skipped: true,
              reason: '处于硬控状态',
              log: `[团战执行] ${actor.name}处于硬控状态，本回合无法行动。`,
            };
          }

          const targets = chooseTargetForActor(actorEntry, battleState);
          if (!targets || !targets.enemyTarget) {
            return { actor: actor.name, side: actorEntry.side, skipped: true, reason: '无可用目标' };
          }
          bindCombatParticipant(targets.enemyTarget);
          bindCombatParticipant(targets.allyTarget);

          let action = null;
          let actionLog = '';
          if (actor.蓄力技能) {
            action = actor.蓄力技能;
            if ((action.cast_time || 0) <= 40) {
              actionLog += `[团战执行] ${actor.name}完成蓄力，释放[${action.skill?.name || action.action_type}]！ `;
              actor.蓄力技能 = null;
            } else {
              action.cast_time -= 30;
              return {
                actor: actor.name,
                side: actorEntry.side,
                target: targets.enemyTarget.name,
                charging: true,
                action,
                log: `[团战执行] ${actor.name}继续为[${action.skill?.name || action.action_type}]蓄力，剩余前摇:${action.cast_time}。`,
              };
            }
          } else {
            action = buildAutoActionForActor(actorEntry, targets, battleState);

            let totalTimeCost = 0;
            let validPreActions = [];
            let carryOverAction = null;

            if (action.pre_actions && action.pre_actions.length > 0) {
              for (let i = 0; i < action.pre_actions.length; i++) {
                let pa = action.pre_actions[i];
                if (totalTimeCost + pa.cast_time <= 40) {
                  totalTimeCost += pa.cast_time;
                  validPreActions.push(pa);
                } else {
                  carryOverAction = pa;
                  carryOverAction.cast_time -= Math.max(0, 40 - totalTimeCost);
                  break;
                }
              }
            }

            if (!carryOverAction) {
              if (totalTimeCost + (action.cast_time || 0) <= 40) {
                totalTimeCost += action.cast_time || 0;
              } else {
                carryOverAction = action;
                carryOverAction.cast_time -= Math.max(0, 40 - totalTimeCost);
              }
            }

            validPreActions.forEach(preAct => {
              const preCostLog = applyActionCost(actor, preAct);
              if (preCostLog) actionLog += preCostLog + ' ';
              if (preAct.action_type === '穿戴装备') {
                actor.装备[preAct.equip_target === 'armor' ? '斗铠' : '机甲'].装备状态 = '已装备';
                actionLog += `[连招生效] ${actor.name}趁隙穿戴了${preAct.equip_target === 'armor' ? '斗铠' : '机甲'}！`;
              }
            });
            action.pre_actions = validPreActions;

            if (carryOverAction) {
              actor.蓄力技能 = carryOverAction;
              return {
                actor: actor.name,
                side: actorEntry.side,
                target: targets.enemyTarget.name,
                charging: true,
                action: actor.蓄力技能,
                log: `[团战执行/转蓄力] 连招耗时过长，${actor.name}进入蓄力状态准备[${carryOverAction.skill?.name || carryOverAction.action_type}]，剩余前摇:${carryOverAction.cast_time}。`,
              };
            }

            if (action.action_type !== '施法失败') {
              const costLog = applyActionCost(actor, action);
              if (action.decision_log) actionLog += action.decision_log + ' ';
              if (costLog) actionLog += costLog + ' ';
            }
          }

          let finalTarget = targets.enemyTarget;
          const skillTargetMeta = getSkillRuntimeMeta(action?.skill || {});
          const skillTargetObj = skillTargetMeta.对象;
          const skillTargetModel = skillTargetMeta.目标模型;
          const targetsFriendlyTeam = ['自身', '友方单体', '友方群体'].includes(skillTargetModel);
          const enemyTeam =
            actorEntry.side === 'player'
              ? battleState.combatData.参战者.team_enemy || []
              : battleState.combatData.参战者.team_player || [];
          const allyTeam =
            actorEntry.side === 'player'
              ? [
                  actor,
                  ...(battleState.combatData.参战者.team_player || []).filter(unit => unit.name !== actor.name),
                ]
              : [
                  actor,
                  ...(battleState.combatData.参战者.team_enemy || []).filter(unit => unit.name !== actor.name),
                ];
          if (targetsFriendlyTeam && skillTargetModel !== '自身') {
            finalTarget = chooseAllyTargetForSkill(actor, allyTeam, action?.skill, targets.allyTarget || actor);
          } else if (skillTargetModel === '自身') {
            finalTarget = actor;
          } else {
            finalTarget = chooseEnemyTargetForSkill(actor, enemyTeam, action?.skill, targets.enemyTarget);
          }
          if (!finalTarget) finalTarget = targets.enemyTarget || actor;
          if (!targetsFriendlyTeam) {
            const guardRedirectTarget = resolveGuardRedirectTarget(finalTarget, enemyTeam);
            if (guardRedirectTarget && guardRedirectTarget.name !== finalTarget.name) {
              actionLog += `[护卫拦截] ${guardRedirectTarget.name}挺身挡在${finalTarget.name}身前，接下本次攻击。 `;
              finalTarget = guardRedirectTarget;
            }
          }
          action.target_name = finalTarget?.name || action.target_name || null;

          const actorTurnCombatData = createActorTurnCombatData(actorEntry, finalTarget, battleState);
          const ratio = calculateReactionRatio(actor, finalTarget, action, actorTurnCombatData);
          let reactionAction = { type: '无法反应', log: '无', skill: null, def_mult: 1.0 };
          if (finalTarget === actor || targetsFriendlyTeam) {
            reactionAction.log = `[配合] ${finalTarget.name}毫无防备地接受了${actor.name}的辅助。`;
          } else {
            reactionAction = finalTarget.is_controlled
              ? { type: '无法反应', log: `${finalTarget.name}处于被控状态，无法动作。`, skill: null, def_mult: 1.0 }
              : determineNpcAction(actorTurnCombatData, action, ratio);
          }

          const settleResult = executeClash(action, reactionAction, actorTurnCombatData);
          let turnLog =
            `${actionLog}[团战执行] ${actor.name}以[${action?.skill?.name || action?.action_type || '未知动作'}]指向[${finalTarget.name}]。 ${reactionAction.log} ${settleResult.desc}`.trim();

          const damagePackage = applyResolvedDamagePackage(actor, action, settleResult, {
            primaryTarget: finalTarget,
            combatData: actorTurnCombatData,
          });
          let appliedDamage = damagePackage.primaryAppliedDamage;
          if (damagePackage.log) turnLog += ` ${damagePackage.log}`;
          const fusionAftermathLog = applyFusionActionAftermath(actor, action, actorTurnCombatData);
          if (fusionAftermathLog) turnLog += ` ${fusionAftermathLog}`;

          if (reactionAction.type === '穿戴装备') {
            const actorStateCalc = getPrimaryStateCalc(action.skill);
            const actorInterruptChance = Math.max(
              Number(getSkillEffects(action.skill).find(e => e?.机制 === '打断')?.中断概率 || 0),
              Number(getFusionScaledInterruptChance(action.skill) || 0),
            );
            const isTargetInterrupted =
              appliedDamage / Math.max(1, finalTarget.vit_max) >= 0.15 ||
              actorStateCalc.skip_turn === true ||
              getPrimaryStateFlags(action.skill).includes('硬控') ||
              (actorInterruptChance > 0 && Math.random() <= Math.min(1, actorInterruptChance)) ||
              (Number(settleResult.interrupt_bonus || 0) > 0 &&
                Math.random() <= Math.min(1, Number(settleResult.interrupt_bonus || 0)));
            if (!isTargetInterrupted) {
              finalTarget.装备[reactionAction.skill.equip_target === 'armor' ? '斗铠' : '机甲'].装备状态 = '已装备';
              turnLog += ` [装备生效] ${finalTarget.name}成功完成装备穿戴。`;
            } else {
              turnLog += ` [穿戴失败] ${finalTarget.name}的装备穿戴被强行打断。`;
            }
          }

          if (
            finalTarget.vit < finalTarget.vit_max * 0.1 &&
            finalTarget !== actor &&
            !targetsFriendlyTeam
          ) {
            let hasMech = finalTarget.装备?.机甲?.等级 !== '无' && finalTarget.装备?.机甲?.状态 !== '重创';
            let hasArmor = finalTarget.装备?.斗铠?.装备状态 === '已装备';
            if (hasMech || hasArmor) {
              finalTarget.vit = Math.floor(finalTarget.vit_max * 0.1);
              turnLog += ` [装备护主] ${finalTarget.name}触发装备护主，强制锁血至 10%。${applyArmorDamage(finalTarget)}`;
            }
          }

          const focusUpdate = updateActorFocusFromAction(actor, action, finalTarget, targets.enemyTarget, settleResult);
          if (focusUpdate?.target) {
            broadcastActorFocusToTeam(actorEntry, battleState, focusUpdate.target, focusUpdate.reason, focusUpdate.ttl);
            const focusLabelMap = {
              control_window: '控制追击',
              anti_heal_window: '断疗压杀',
              armor_break_window: '破防追击',
              dot_pressure: '持续压血',
              finisher: '收割',
              shared_vision_focus: '集火',
            };
            turnLog += ` [战术焦点] ${actor.name}将${focusUpdate.target.name}锁为后续${focusLabelMap[focusUpdate.reason] || '追击'}目标。`;
          }
          if (evaluateActionCountered(action, finalTarget, reactionAction, settleResult, skillTargetObj)) {
            recordActorSkillCountered(
              actor,
              action?.skill?.name || action?.action_type || '',
              reactionAction?.type || settleResult?.desc || '',
            );
            turnLog += ` [战术复盘] ${actor.name}意识到[${action?.skill?.name || action?.action_type || '该招式'}]再次被有效克制，短期内会降低其使用倾向。`;
          }

          return {
            actor: actor.name,
            side: actorEntry.side,
            target: finalTarget.name,
            action,
            reactionAction,
            settleResult,
            log: turnLog,
            extraPatchOps: Array.isArray(settleResult?.extraPatchOps) ? settleResult.extraPatchOps : [],
            actorVit: actor.vit,
            targetVit: finalTarget.vit,
          };
        }

        function getTeamLivingCount(team) {
          return (team || []).filter(unit => {
            bindCombatParticipant(unit);
            syncCombatActionState(unit);
            return isCombatUnitAbleToFight(unit);
          }).length;
        }

        function settleTeamRoundEnd(combatData, logs) {
          const allUnits = [
            ...(combatData.参战者.team_player || []),
            ...(combatData.参战者.team_enemy || []),
          ];

          allUnits.forEach(unit => {
            bindCombatParticipant(unit);
            syncCombatActionState(unit);
            if (!isCombatUnitAlive(unit)) return;

            const sustainResult = settleSustainEffectsAtRoundEnd(unit, unit.name || '未知单位');
            const conditionResult = settleConditionsAtRoundEnd(unit, unit.name || '未知单位');
            syncCombatActionState(unit);
            if (sustainResult.log) logs.push(`[团战回合尾] ${sustainResult.log}`);
            if (conditionResult.log) logs.push(`[团战回合尾] ${conditionResult.log}`);
          });
        }

        function runTeamBattleSimulation(combatData, maxRounds = 3) {
          hydrateCombatData(combatData);
          if (isSoulTowerCombatTypeValue(combatData?.战斗类型 || '')) {
            const rosterCheck = validateSoulTowerCombatRoster(combatData);
            if (!rosterCheck.ok) {
              return {
                rounds: 0,
                roundStart: Number(combatData?.回合 || 0),
                roundEnd: Number(combatData?.回合 || 0),
                winner: 'unfinished',
                playerAlive: getTeamLivingCount(combatData?.参战者?.team_player || []),
                enemyAlive: getTeamLivingCount(combatData?.参战者?.team_enemy || []),
                logs: [`[魂灵塔资格驳回] ${rosterCheck.message}`],
                extraPatchOps: [],
              };
            }
          }
          let logs = [];
          let extraPatchOps = [];
          let rounds = 0;
          const startingRound = Number(combatData.回合 || 0);

          while (rounds < maxRounds) {
            rounds++;
            const currentRound = startingRound + rounds;
            combatData.回合 = currentRound;
            logs.push(`[团战第${currentRound}回合开始]`);

            const queue = generateActionQueue(combatData);
            for (const actorEntry of queue) {
              const teamPlayerAlive = getTeamLivingCount(combatData.参战者.team_player || []);
              const teamEnemyAlive = getTeamLivingCount(combatData.参战者.team_enemy || []);
              if (teamPlayerAlive <= 0 || teamEnemyAlive <= 0) break;

              const turnResult = runActorTurn(actorEntry, { combatData, round: currentRound, logs });
              if (turnResult?.log) logs.push(turnResult.log);
              if (Array.isArray(turnResult?.extraPatchOps) && turnResult.extraPatchOps.length)
                extraPatchOps.push(...turnResult.extraPatchOps);
            }

            settleTeamRoundEnd(combatData, logs);

            const teamPlayerAlive = getTeamLivingCount(combatData.参战者.team_player || []);
            const teamEnemyAlive = getTeamLivingCount(combatData.参战者.team_enemy || []);
            logs.push(`[团战回合总结] 我方存活:${teamPlayerAlive} 敌方存活:${teamEnemyAlive}`);

            if (teamPlayerAlive <= 0 || teamEnemyAlive <= 0) {
              break;
            }
          }

          const finalPlayerAlive = getTeamLivingCount(combatData.参战者.team_player || []);
          const finalEnemyAlive = getTeamLivingCount(combatData.参战者.team_enemy || []);
          const winner = finalEnemyAlive <= 0 ? 'player' : finalPlayerAlive <= 0 ? 'enemy' : 'unfinished';

          // 如果是团战模拟结束且是虚拟环境死亡，修正战利品结算与强制锁血弹出
          const combatType = combatData.战斗类型 || '突发遭遇';
          if (combatType === '升灵台虚拟战斗' || combatType === '魂灵塔冲塔') {
            if (winner === 'enemy') {
              (combatData.参战者.team_player || []).forEach(p => {
                if (p.vit <= 0) p.vit = 1;
              });
              if (combatData.参战者.player && combatData.参战者.player.vit <= 0) {
                combatData.参战者.player.vit = 1;
              }
              logs.push(`[虚拟战败保护] 玩家方全员战败，触发安全协议，强制弹出并锁定HP为 1！`);
            }
          }

          return {
            rounds,
            roundStart: startingRound + 1,
            roundEnd: Number(combatData.回合 || startingRound),
            winner,
            playerAlive: finalPlayerAlive,
            enemyAlive: finalEnemyAlive,
            logs,
            extraPatchOps,
          };
        }

        function runTeamBattleRound(combatData) {
          hydrateCombatData(combatData);
          if (isSoulTowerCombatTypeValue(combatData?.战斗类型 || '')) {
            const rosterCheck = validateSoulTowerCombatRoster(combatData);
            if (!rosterCheck.ok) {
              return {
                rounds: 0,
                roundStart: Number(combatData?.回合 || 0),
                roundEnd: Number(combatData?.回合 || 0),
                winner: 'unfinished',
                playerAlive: getTeamLivingCount(combatData?.参战者?.team_player || []),
                enemyAlive: getTeamLivingCount(combatData?.参战者?.team_enemy || []),
                logs: [`[魂灵塔资格驳回] ${rosterCheck.message}`],
                extraPatchOps: [],
              };
            }
          }
          const currentRound = Number(combatData.回合 || 0) + 1;
          combatData.回合 = currentRound;
          let logs = [`[团战第${currentRound}回合开始]`];
          let extraPatchOps = [];

          const queue = generateActionQueue(combatData);
          for (const actorEntry of queue) {
            const teamPlayerAlive = getTeamLivingCount(combatData.参战者.team_player || []);
            const teamEnemyAlive = getTeamLivingCount(combatData.参战者.team_enemy || []);
            if (teamPlayerAlive <= 0 || teamEnemyAlive <= 0) break;

            const turnResult = runActorTurn(actorEntry, { combatData, round: currentRound, logs });
            if (turnResult?.log) logs.push(turnResult.log);
            if (Array.isArray(turnResult?.extraPatchOps) && turnResult.extraPatchOps.length)
              extraPatchOps.push(...turnResult.extraPatchOps);
          }

          settleTeamRoundEnd(combatData, logs);

          const teamPlayerAlive = getTeamLivingCount(combatData.参战者.team_player || []);
          const teamEnemyAlive = getTeamLivingCount(combatData.参战者.team_enemy || []);
          const winner = teamEnemyAlive <= 0 ? 'player' : teamPlayerAlive <= 0 ? 'enemy' : 'unfinished';
          logs.push(`[团战回合总结] 我方存活:${teamPlayerAlive} 敌方存活:${teamEnemyAlive}`);

          return {
            rounds: 1,
            roundStart: currentRound,
            roundEnd: currentRound,
            winner,
            playerAlive: teamPlayerAlive,
            enemyAlive: teamEnemyAlive,
            logs,
            extraPatchOps,
          };
        }

        function ui_executeBattleFlow(combatData, options = {}) {
          if (!combatData) {
            return {
              mode: options.mode || 'single_round',
              roundsExecuted: 0,
              winner: 'unfinished',
              logs: ['[UI执行] 未提供 combatData。'],
              snapshot: null,
            };
          }

          const mode = options.mode === 'multi_round' ? 'multi_round' : 'single_round';
          const rounds = Math.max(1, Number(options.rounds || 1));
          const result =
            mode === 'multi_round' ? runTeamBattleSimulation(combatData, rounds) : runTeamBattleRound(combatData);
          const extraPatchOps = Array.isArray(result.extraPatchOps) ? result.extraPatchOps : [];
          const mvuUpdate =
            window.BattleUIBridge?.persistCombatData?.(combatData, {
              analysis:
                'Frontend team battle arbitration already produced the exact combat result. Apply the following JSONPatch exactly as given.',
              extraPatchOps,
              syncHpRecoveryOnly: true,
            }) || null;

          return {
            mode,
            roundsRequested: mode === 'multi_round' ? rounds : 1,
            roundsExecuted: result.rounds || 0,
            roundStart: result.roundStart,
            roundEnd: result.roundEnd,
            winner: result.winner || 'unfinished',
            playerAlive: result.playerAlive,
            enemyAlive: result.enemyAlive,
            extraPatchOps,
            logs: result.logs || [],
            snapshot: ui_getBattleSnapshot(combatData),
            mvuUpdate,
          };
        }

        // ==========================================
        // 📍 UI 适配器层 (对外暴露接口)
        // ==========================================

        function ui_getBattleSnapshot(combatData) {
          if (!combatData) return null;
          hydrateCombatData(combatData);

          const buildUnitSnapshot = char => {
            if (!char) return null;
            return {
              name: char.name || '未知',
              lv: char.lv || 1,
              lv_label: formatBattleCultivationLevelText(char.lv || 1, '1'),
              type: char.type || '未知系',
              vit: char.vit || 0,
              vit_max: char.vit_max || 1,
              sp: char.sp || 0,
              sp_max: char.sp_max || 1,
              men: char.men || 0,
              men_max: char.men_max || 1,
              当前领域: char.当前领域 || '无',
              状态效果: Object.entries(char.状态效果 || {}).map(([name, cond]) => ({
                name,
                type: cond.类型 || 'buff',
                duration: cond.duration || 0,
                desc: cond.描述 || '',
                skip_turn: cond.战斗效果?.skip_turn || false,
                dot: cond.战斗效果?.dot_damage || 0,
              })),
              sustains: Object.keys(char.持续效果 || {}),
              isCharging: !!char.蓄力技能,
              chargingCastTime: char.蓄力技能?.cast_time || 0,
            };
          };

          return {
            round: Number(combatData.回合 || 0),
            战斗类型: combatData.战斗类型 || '突发遭遇',
            floor: Number(combatData.floor || 0),
            大关卡: Number(combatData.大关卡 || 0),
            大关标签: combatData.大关标签 || '',
            先攻: combatData.先攻 || '无',
            player: buildUnitSnapshot(combatData.参战者.player),
            enemy: buildUnitSnapshot(combatData.参战者.enemy),
            team_player: (combatData.参战者.team_player || []).map(buildUnitSnapshot).filter(Boolean),
            team_enemy: (combatData.参战者.team_enemy || []).map(buildUnitSnapshot).filter(Boolean),
          };
        }

        function ui_getAvailableActions(charData, combatData) {
          if (!charData) return [];
          bindCombatParticipant(charData);
          const allyTeam = (combatData?.参战者?.team_player || []).filter(unit => unit.name !== charData.name);
          const availableSkills = collectCombatSkills(charData, allyTeam);

          const actions = [];

          availableSkills.forEach(skill => {
            const costParsed = parseSkillCostForChar(skill, charData);
            actions.push({
              id: `skill_${skill.name}`,
              type: 'skill',
              name: skill.name,
              category: skill.source_tag || '魂技', // 核心修改：按来源分类
              semantic_role: getSkillType(skill) || '输出',
              tags: skill.标签 || [],
              cast_time: getSkillCastTime(skill),
              cost_text: getFusionSkillDisplayCostText(skill),
              enabled: costParsed.canCast,
              reason: costParsed.canCast ? '' : (costParsed.failureReason || '状态不足'),
              raw_skill: skill,
            });
          });

          if (charData.装备?.斗铠?.等级 > 0 && charData.装备?.斗铠?.装备状态 !== '已装备') {
            actions.push({
              id: 'equip_armor',
              type: 'equip',
              name: '斗铠附体',
              category: '特殊动作',
              enabled: true,
              reason: '',
            });
          }

          if (
            charData.装备?.机甲?.等级 &&
            charData.装备.机甲.等级 !== '无' &&
            charData.装备?.机甲?.装备状态 !== '已装备' &&
            charData.装备?.机甲?.状态 !== '重创'
          ) {
            actions.push({
              id: 'equip_mech',
              type: 'equip',
              name: '召唤机甲',
              category: '特殊动作',
              enabled: true,
              reason: '',
            });
          }

          if (charData.血脉之力?.技能?.['点燃生命之火'] && !charData.血脉之力?.生命之火) {
            actions.push({
              id: 'special_lifefire',
              type: 'special',
              name: '点燃生命之火',
              category: '特殊动作',
              enabled: true,
              reason: '',
            });
          }

          if (hasBattleUnlockedAttributeSet(charData, ['水', '火', '风', '土'])) {
            const pureControlSkill = normalizeSkillData({
              name: '元素剥离',
              技能类型: '控制',
              消耗: '魂力:15% 精神力:20%',
              cast_time: 15,
            });
            const costParsed = parseSkillCostForChar(pureControlSkill, charData);
            actions.push({
              id: 'special_element_strip',
              type: 'special',
              name: '元素剥离',
              category: '纯操控',
              semantic_role: '控制',
              cast_time: getSkillCastTime(pureControlSkill),
              cost_text: getSkillCostText(pureControlSkill),
              enabled: costParsed.canCast,
              reason: costParsed.canCast ? '' : '状态不足',
              raw_skill: pureControlSkill,
            });
          }

          if (hasBattleUnlockedAttributeSet(charData, ['金', '木', '水', '火', '土'])) {
            const wuxingStripSkill = normalizeSkillData({
              name: '五行剥离',
              技能类型: '控制',
              消耗: '魂力:18% 精神力:25%',
              cast_time: 18,
            });
            const wuxingEscapeSkill = normalizeSkillData({
              name: '五行遁法',
              技能类型: '辅助',
              消耗: '魂力:12% 精神力:18% 维持:精神力:8%',
              cast_time: 12,
            });
            const stripCostParsed = parseSkillCostForChar(wuxingStripSkill, charData);
            const escapeCostParsed = parseSkillCostForChar(wuxingEscapeSkill, charData);
            actions.push({
              id: 'special_wuxing_strip',
              type: 'special',
              name: '五行剥离',
              category: '纯操控',
              semantic_role: '控制',
              cast_time: getSkillCastTime(wuxingStripSkill),
              cost_text: getSkillCostText(wuxingStripSkill),
              enabled: stripCostParsed.canCast,
              reason: stripCostParsed.canCast ? '' : '状态不足',
              raw_skill: wuxingStripSkill,
            });
            actions.push({
              id: 'special_wuxing_escape',
              type: 'special',
              name: '五行遁法',
              category: '纯操控',
              semantic_role: '辅助',
              cast_time: getSkillCastTime(wuxingEscapeSkill),
              cost_text: getSkillCostText(wuxingEscapeSkill),
              enabled: escapeCostParsed.canCast,
              reason: escapeCostParsed.canCast ? '' : '状态不足',
              raw_skill: wuxingEscapeSkill,
            });
          }

          actions.push({
            id: 'action_flee',
            type: 'tactical',
            name: '亡命奔逃',
            category: '特殊动作',
            enabled: true,
            reason: '',
          });

          return actions;
        }

        function toUiNumber(value, fallback = 0) {
          const parsed = Number(value);
          return Number.isFinite(parsed) ? parsed : fallback;
        }

        function htmlEscapeText(value) {
          return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        }

        function flattenUiCombatant(unit) {
          const safeUnit = unit && typeof unit === 'object' ? unit : {};
          const stat = safeUnit.属性 && typeof safeUnit.属性 === 'object' ? safeUnit.属性 : {};
          const status = safeUnit.状态 && typeof safeUnit.状态 === 'object' ? safeUnit.状态 : {};
          const merged = { ...stat, ...safeUnit };
          COMBAT_STAT_KEYS.forEach(key => {
            if (stat[key] !== undefined) merged[key] = stat[key];
          });
          merged.name = safeUnit.name || stat.name || safeUnit.base?.name || '未知';
          merged.lv = toUiNumber(merged.lv ?? merged.等级, toUiNumber(stat.等级, 0));
          merged.type = merged.type || merged.系别 || stat.系别 || '未知系';
          merged.hp_max = Math.max(
            1,
            toUiNumber(merged.hp_max ?? merged.HP上限, toUiNumber(stat.HP上限, toUiNumber(merged.体力上限 ?? stat.体力上限, 1))),
          );
          merged.hp = Math.max(
            0,
            toUiNumber(merged.hp ?? merged.HP, toUiNumber(stat.HP, toUiNumber(merged.体力 ?? stat.体力, merged.hp_max))),
          );
          merged.vit_max = merged.hp_max;
          merged.vit = merged.hp;
          merged.sta_max = Math.max(1, toUiNumber(merged.sta_max ?? merged.体力上限, toUiNumber(stat.体力上限, 1)));
          merged.sta = Math.max(0, toUiNumber(merged.sta ?? merged.体力, toUiNumber(stat.体力, merged.sta_max)));
          merged.sp_max = Math.max(1, toUiNumber(merged.sp_max ?? merged.魂力上限, toUiNumber(stat.魂力上限, 1)));
          merged.sp = Math.max(0, toUiNumber(merged.sp ?? merged.魂力, toUiNumber(stat.魂力, merged.sp_max)));
          merged.men_max = Math.max(
            1,
            toUiNumber(merged.men_max ?? merged.精神力上限, toUiNumber(stat.精神力上限, 1)),
          );
          merged.men = Math.max(0, toUiNumber(merged.men ?? merged.精神力, toUiNumber(stat.精神力, merged.men_max)));
          merged.str = toUiNumber(merged.str ?? merged.力量, toUiNumber(stat.力量, 0));
          merged.def = toUiNumber(merged.def ?? merged.防御, toUiNumber(stat.防御, 0));
          merged.agi = toUiNumber(merged.agi ?? merged.敏捷, toUiNumber(stat.敏捷, 0));
          merged.状态效果 = merged.状态效果 || stat.状态效果 || {};
          merged.持续效果 = merged.持续效果 || {};
          merged.alive = status.存活 !== false && safeUnit.alive !== false && merged.hp > 0;
          return merged;
        }

        function setUiText(id, value) {
          const node = byId(id);
          if (node) node.textContent = String(value ?? '');
        }

        function setUiBar(id, value, max) {
          const node = byId(id);
          if (!node) return;
          const ratio = Math.max(0, Math.min(100, (toUiNumber(value, 0) / Math.max(1, toUiNumber(max, 1))) * 100));
          node.style.width = `${ratio}%`;
        }

        function renderUiStats(containerId, unit) {
          const node = byId(containerId);
          if (!node) return;
          const stats = [
            ['系别', unit.type || '未知'],
            ['力', Math.round(unit.str || 0)],
            ['防', Math.round(unit.def || 0)],
            ['速', Math.round(unit.agi || 0)],
          ];
          node.innerHTML = stats
            .map(([label, value]) => `<div class="stat-item"><div class="stat-label">${htmlEscapeText(label)}</div><div class="stat-value">${htmlEscapeText(value)}</div></div>`)
            .join('');
        }

        function renderUiBuffs(containerId, unit) {
          const node = byId(containerId);
          if (!node) return;
          const 状态效果 = Object.entries(unit.状态效果 || {}).slice(0, 8);
          const sustains = Object.keys(unit.持续效果 || {}).slice(0, 4);
          const chips = [
            ...状态效果.map(([name, condition]) => {
              const typeText = String(condition?.类型 || condition?.type || '').toLowerCase();
              const kind = /debuff|负面|伤|弱/.test(typeText) ? 'debuff' : 'buff';
              return `<span class="tag-chip ${kind}">${htmlEscapeText(name)}</span>`;
            }),
            ...sustains.map(name => `<span class="tag-chip sustain">${htmlEscapeText(name)}</span>`),
          ];
          node.innerHTML = chips.join('');
        }

        function renderUiCombatant(prefix, unit) {
          const safeUnit = flattenUiCombatant(unit);
          setUiText(`ui-${prefix}-lv`, `Lv.${safeUnit.lv || 0}`);
          setUiText(`ui-${prefix}-name`, safeUnit.name || (prefix === 'player' ? '玩家' : '对手'));
          setUiText(`ui-${prefix}-hp-text`, `${Math.round(safeUnit.hp)} / ${Math.round(safeUnit.hp_max)}`);
          setUiText(`ui-${prefix}-sta-text`, `${Math.round(safeUnit.sta)} / ${Math.round(safeUnit.sta_max)}`);
          setUiText(`ui-${prefix}-sp-text`, `${Math.round(safeUnit.sp)} / ${Math.round(safeUnit.sp_max)}`);
          setUiText(`ui-${prefix}-men-text`, `${Math.round(safeUnit.men)} / ${Math.round(safeUnit.men_max)}`);
          setUiBar(`ui-${prefix}-hp-bar`, safeUnit.hp, safeUnit.hp_max);
          setUiBar(`ui-${prefix}-sta-bar`, safeUnit.sta, safeUnit.sta_max);
          setUiBar(`ui-${prefix}-sp-bar`, safeUnit.sp, safeUnit.sp_max);
          setUiBar(`ui-${prefix}-men-bar`, safeUnit.men, safeUnit.men_max);
          renderUiStats(`ui-${prefix}-stats`, safeUnit);
          renderUiBuffs(`ui-${prefix}-buffs`, safeUnit);
          return safeUnit;
        }

        function renderUiTeam(containerId, units, activeName = '') {
          const node = byId(containerId);
          if (!node) return;
          const list = (Array.isArray(units) ? units : []).map(flattenUiCombatant);
          node.innerHTML = list
            .map(unit => {
              const active = unit.name === activeName ? ' active' : '';
              const hpRatio = Math.max(0, Math.min(100, (unit.hp / Math.max(1, unit.hp_max)) * 100));
              return `<button class="side-card${active}" type="button"><div class="side-name">${htmlEscapeText(unit.name)}</div><div class="side-mini-bar"><div class="side-mini-fill" style="width:${hpRatio}%"></div></div></button>`;
            })
            .join('');
        }

        function findUiSkillCost(skill = {}) {
          if (skill?.__fusion_display_cost_text) return String(skill.__fusion_display_cost_text);
          const direct = skill.消耗 || skill.cost || skill.cost_text || '';
          if (direct) return String(direct);
          const effects = Array.isArray(skill._效果数组) ? skill._效果数组 : [];
          const system = effects.find(effect => effect && typeof effect === 'object' && (effect.机制 === '系统基础' || effect.机制 === '系统基础'));
          return String(system?.消耗 || system?.cost || '');
        }

        function findUiSkillCastTime(skill = {}) {
          const direct = toUiNumber(skill.cast_time ?? skill.前摇 ?? skill['前摇'], NaN);
          if (Number.isFinite(direct)) return direct;
          const effects = Array.isArray(skill._效果数组) ? skill._效果数组 : [];
          const system = effects.find(effect => effect && typeof effect === 'object' && effect.cast_time !== undefined);
          return toUiNumber(system?.cast_time, 10);
        }

        function pushUiSkillAction(actions, skill, fallbackName, source) {
          if (!skill || typeof skill !== 'object') return;
          const name = String(skill.魂技名 || skill.name || fallbackName || '').trim();
          if (!name) return;
          actions.push({
            id: `skill_${source}_${name}_${actions.length}`,
            type: 'skill',
            action_type: '释放魂技',
            name,
            category: source || '魂技',
            cast_time: findUiSkillCastTime(skill),
            cost_text: findUiSkillCost(skill),
            enabled: true,
            reason: '',
            raw_skill: skill,
            skill,
          });
        }

        function collectUiSkillActions(charData) {
          const actions = [];
          const char = charData && typeof charData === 'object' ? charData : {};
          Object.entries(char.武魂 || {}).forEach(([spiritName, spirit]) => {
            Object.entries(spirit?.魂灵 || {}).forEach(([soulSpiritName, soulSpirit]) => {
          Object.entries(soulSpirit?.魂环 || {}).forEach(([ringIndex, ring]) => {
                Object.entries(ring?.魂技 || {}).forEach(([skillName, skill]) => {
                  pushUiSkillAction(actions, skill, skillName, spirit?.表象名称 || spiritName || soulSpiritName || `第${ringIndex}魂环`);
                });
              });
            });
          });
          Object.entries(char.特殊能力 || {}).forEach(([name, skill]) => pushUiSkillAction(actions, skill, name, '特殊能力'));
          Object.entries(char.武魂融合技 || {}).forEach(([name, fusion]) => {
            pushUiSkillAction(actions, buildFusionCombatSkill(fusion, name), `武魂融合技·${name}`, '融合');
          });
          actions.push(
            { id: 'basic_attack', type: 'tactical', action_type: '常规攻击', name: '普通攻击', category: '战术', cast_time: 10, cost_text: '无', enabled: true, skill: { name: '普通攻击' } },
            { id: 'guard', type: 'tactical', action_type: '防御', name: '防御', category: '战术', cast_time: 10, cost_text: '无', enabled: true, skill: { name: '防御' } },
            { id: 'evade', type: 'tactical', action_type: '闪避', name: '闪避', category: '战术', cast_time: 12, cost_text: '体力', enabled: true, skill: { name: '闪避' } },
            { id: 'flee', type: 'tactical', action_type: '撤离', name: '撤离', category: '战术', cast_time: 20, cost_text: '无', enabled: true, skill: { name: '撤离' } },
          );
          return actions;
        }

        root.BattleUIBridge = Object.assign(root.BattleUIBridge || {}, {
          executeBattleFlow(combatData, options = {}) {
            return ui_executeBattleFlow(combatData, options);
          },
          getBattleSnapshot(combatData) {
            return ui_getBattleSnapshot(combatData);
          },
          getAvailableActions(charData, combatData) {
            return ui_getAvailableActions(charData, combatData);
          },
        });

        function getUiCombatData() {
          const combatData = window.BattleUIBridge?.getMVU('world.战斗');
          if (combatData && typeof combatData === 'object') return deepClonePlain(combatData);
          return deepClonePlain(_options.combatData || {});
        }

        function renderUiChips(combatData, player, enemy) {
          const node = byId('ui-combat-chips');
          if (!node) return;
          const chips = [
            `回合 ${Number(combatData.回合 || 0)}`,
            combatData.战斗类型 || '战斗',
            combatData.阶段 || '宣告阶段',
            `${player.name || '玩家'} → ${enemy.name || '对手'}`,
          ];
          node.innerHTML = chips.map(item => `<span class="intent-pill">${htmlEscapeText(item)}</span>`).join('');
        }

        function renderUiActionFilters(actions, activeCategory) {
          const node = byId('ui-action-filters');
          if (!node) return;
          const categories = ['全部', ...Array.from(new Set(actions.map(action => action.category || '战术')))];
          node.innerHTML = categories
            .map(category => `<button class="filter-btn${category === activeCategory ? ' active' : ''}" type="button" data-category="${htmlEscapeText(category)}">${htmlEscapeText(category)}</button>`)
            .join('');
          node.querySelectorAll('[data-category]').forEach(button => {
            button.addEventListener('click', () => {
              const state = window.BattleUI?.state || {};
              state.activeCategory = button.dataset.category || '全部';
              renderUiActionGrid(state.availableActions || [], state.activeCategory);
              renderUiActionFilters(state.availableActions || [], state.activeCategory);
            });
          });
        }

        function renderUiActionGrid(actions, activeCategory = '全部') {
          const node = byId('ui-action-grid');
          if (!node) return;
          const state = window.BattleUI?.state || {};
          const selectedId = state.selectedAction?.id || '';
          const filtered = activeCategory && activeCategory !== '全部'
            ? actions.filter(action => (action.category || '战术') === activeCategory)
            : actions;
          node.innerHTML = filtered
            .map(action => {
              const selected = action.id === selectedId ? ' is-selected' : '';
              const disabled = action.enabled === false ? ' disabled' : '';
              const meta = [action.cost_text, action.cast_time ? `${action.cast_time}` : ''].filter(Boolean).join(' / ');
              return `<button class="action-btn${selected}" type="button" data-action-id="${htmlEscapeText(action.id)}"${disabled}><span class="action-name">${htmlEscapeText(action.name)}</span><span class="action-meta"><span>${htmlEscapeText(action.category || '战术')}</span><span class="action-cost">${htmlEscapeText(meta)}</span></span></button>`;
            })
            .join('');
          node.querySelectorAll('[data-action-id]').forEach(button => {
            button.addEventListener('click', () => {
              const state = window.BattleUI?.state || {};
              const action = (state.availableActions || []).find(item => item.id === button.dataset.actionId);
              if (!action || action.enabled === false) return;
              state.selectedAction = action;
              state.selectedSkillActions = [action];
              const output = byId('ui-intent-output');
              if (output) output.value = buildIntentText([action]);
              renderUiActionGrid(state.availableActions || [], state.activeCategory || '全部');
            });
          });
        }

        function setUiBattleMode(mode) {
          const normalized = mode === 'multi_round' ? 'multi_round' : 'single_round';
          if (window.BattleUI && window.BattleUI.state) {
            window.BattleUI.state.currentMode = normalized;
          }
          document.querySelectorAll('#ui-mode-group .mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === normalized);
          });
        }

        function setUiIntentMode(mode) {
          const normalized = String(mode || '点到为止').trim() || '点到为止';
          if (window.BattleUI && window.BattleUI.state) window.BattleUI.state.currentIntentMode = normalized;
          const select = byId('ui-intent-mode');
          if (select && select.value !== normalized) select.value = normalized;
        }

        async function initBattleUiFromMvu() {
          syncFromBattleEngine();
        }

        function syncFromBattleEngine() {
          const combatData = getUiCombatData();
          if (!combatData || !combatData.参战者) return;
          hydrateCombatData(combatData);
          const player = renderUiCombatant('player', combatData.参战者.player);
          const enemy = renderUiCombatant('enemy', combatData.参战者.enemy);
          const teamPlayer = [combatData.参战者.player, ...(combatData.参战者.team_player || [])];
          const teamEnemy = [combatData.参战者.enemy, ...(combatData.参战者.team_enemy || [])];
          renderUiTeam('ui-team-player', teamPlayer, player.name);
          renderUiTeam('ui-team-enemy', teamEnemy, enemy.name);
          renderUiChips(combatData, player, enemy);

          const charData =
            window.BattleUIBridge?.getMVU(`char.${player.name}`) ||
            window.BattleUIBridge?.getMVU(`char.${window.BattleUIBridge?.getMVU('sys.玩家名') || ''}`) ||
            combatData.参战者.player;
          const availableActions = collectUiSkillActions(charData);
          const previousState = window.BattleUI?.state || {};
          const activeCategory = previousState.activeCategory || '全部';
          const currentIntentMode = previousState.currentIntentMode || combatData.战斗意图 || '点到为止';
          const pendingTowerSettlement = normalizeSoulTowerPendingSettlement(combatData.魂灵塔待结算);
          const selectedAction = previousState.selectedAction && availableActions.find(action => action.id === previousState.selectedAction.id)
            ? previousState.selectedAction
            : availableActions[0] || null;
          window.BattleUI = Object.assign(window.BattleUI || {}, {
            state: {
              ...previousState,
              combatData,
              player,
              enemy,
              availableActions,
              activeCategory,
              selectedAction,
              selectedSkillActions: selectedAction ? [selectedAction] : [],
              selectedPreActions: [],
              currentMode: previousState.currentMode || 'single_round',
              currentIntentMode,
              pendingTowerSettlement,
            },
          });
          setUiBattleMode(window.BattleUI.state.currentMode);
          setUiIntentMode(window.BattleUI.state.currentIntentMode);
          renderUiActionFilters(availableActions, activeCategory);
          renderUiActionGrid(availableActions, activeCategory);
          const output = byId('ui-intent-output');
          if (output && selectedAction) output.value = buildIntentText([selectedAction]);
          renderSoulTowerSettlementPanel(pendingTowerSettlement);
        }

        component.syncFromBattleEngine = syncFromBattleEngine;

        function buildSerializedEntryFromAction(action) {
          if (!action) return null;
          const skill = action.raw_skill || action.skill || {};
          const type = action.action_type || action.type || skill.技能类型 || '输出';
          const name = action.name || skill.name || '';
          const actionObj = {
            type,
            skill,
            cast_time: Number(action.cast_time ?? skill.cast_time ?? 0) || 0,
            target_name: window.BattleUIBridge?.getMVU('world.战斗.参战者.enemy.name') || null,
          };
          if (type === '穿戴装备') actionObj.equip_target = /机甲/.test(name) ? 'mech' : 'armor';
          if (type === '吸血反哺') actionObj.heal_ratio = action.heal_ratio || 0.3;
          if (type === '多元素融合') {
            actionObj.fusionElements = normalizeBattleSkillAttributeTokens(action.fusionElements || []);
            actionObj.fusionPattern = String(
              action.fusionPattern || buildBattleFusionPattern(actionObj.fusionElements),
            );
          }
          if (action.is_charged) actionObj.is_charged = true;
          return actionObj;
        }

        function buildIntentText(actions) {
          const state = window.BattleUI?.state || {};
          const fallbackActions = [
            ...(state.selectedPreActions || []),
            state.selectedSkillActions?.[state.selectedSkillActions.length - 1] || state.selectedAction,
          ].filter(Boolean);
          const sourceActions = Array.isArray(actions) && actions.length ? actions : fallbackActions;
          const queue = sourceActions.map(buildSerializedEntryFromAction).filter(Boolean);
          const parts = [];
          if (queue.length) {
            parts.push(queue.map(action => action.skill?.魂技名 || action.skill?.name || action.type).filter(Boolean).join('，'));
            parts.push(`[动作队列]${JSON.stringify(queue)}[/动作队列]`);
          }
          const target = window.BattleUIBridge?.getMVU('world.战斗.参战者.enemy.name');
          if (target) parts.push(`[目标]${target}[/目标]`);
          return parts.join('\n');
        }

        function renderSoulTowerSettlementPanel(pendingSettlement = null) {
          const node = byId('ui-tower-settlement');
          const arbitrateBtn = byId('ui-arbitrate');
          const intentModeInput = byId('ui-intent-mode');
          const modeButtons = Array.from(document.querySelectorAll('#ui-mode-group .mode-btn'));
          if (!node) return;
          if (!pendingSettlement) {
            node.hidden = true;
            node.innerHTML = '';
            if (arbitrateBtn) arbitrateBtn.disabled = false;
            if (intentModeInput) intentModeInput.disabled = false;
            modeButtons.forEach(btn => {
              btn.disabled = false;
            });
            return;
          }
          node.hidden = false;
          if (arbitrateBtn) arbitrateBtn.disabled = true;
          if (intentModeInput) intentModeInput.disabled = true;
          modeButtons.forEach(btn => {
            btn.disabled = true;
          });
          const spiritText = buildSoulTowerDiscountSpiritDisplay(pendingSettlement.五折魂灵);
          const continueButton = pendingSettlement.可继续
            ? `<button class="ghost-btn tower-settlement-action" type="button" data-tower-settlement="continue">继续下一层</button>`
            : `<span class="tower-settlement-note">已抵达魂灵塔顶层，无法继续上冲。</span>`;
          node.innerHTML = `
            <div class="tower-settlement-card">
              <div class="tower-settlement-head">
                <b>魂灵塔通关待选择</b>
                <span>${htmlEscapeText(pendingSettlement.区域标签 || '魂灵塔')}</span>
              </div>
              <div class="tower-settlement-body">
                <span>当前可五折魂灵：${htmlEscapeText(spiritText)}</span>
                <span>选择结束将保留该资格；选择继续会立即放弃它并进入第${htmlEscapeText(pendingSettlement.下一层 || pendingSettlement.层数 + 1)}层。</span>
              </div>
              <div class="tower-settlement-actions">
                <button class="ghost-btn tower-settlement-action primary" type="button" data-tower-settlement="end">结束并保留资格</button>
                ${continueButton}
              </div>
            </div>
          `;
          node.querySelectorAll('[data-tower-settlement]').forEach(button => {
            button.addEventListener('click', () => {
              const action = button.getAttribute('data-tower-settlement') || 'end';
              window.BattleUI?.resolveSoulTowerSettlement?.(action);
            });
          });
        }

        function resolveSoulTowerSettlement(action = 'end') {
          const choice = action === 'continue' ? 'continue' : 'end';
          const state = window.BattleUI?.state || {};
          const combatData = deepClonePlain(getUiCombatData() || state.combatData || {});
          if (!combatData || !combatData.参战者) return { ok: false, reason: 'combat_missing' };
          hydrateCombatData(combatData);
          const pendingSettlement = normalizeSoulTowerPendingSettlement(combatData.魂灵塔待结算);
          if (!pendingSettlement) return { ok: false, reason: 'tower_settlement_missing' };
          const playerName = String(combatData?.参战者?.player?.name || state.player?.name || '').trim();
          if (!playerName) return { ok: false, reason: 'player_missing' };
          const currentRecord = window.BattleUIBridge?.getMVU(`char.${playerName}.魂灵塔记录`) || {};
          const nextHighestFloor = Math.max(
            Math.floor(Number(currentRecord?.最高层 || 0)),
            Math.floor(Number(pendingSettlement.层数 || 0)),
          );
          const nextTowerRecord = {
            最高层: nextHighestFloor,
            当前五折魂灵: choice === 'end'
              ? pendingSettlement.五折魂灵
              : createEmptySoulTowerDiscountSpiritRecord(),
          };
          clearCombatAdjudicationHints(combatData);
          delete combatData.魂灵塔待结算;
          combatData.本次操作 = undefined;
          combatData.前端建议结果 = undefined;
          combatData.裁断约束 = undefined;
          combatData.建议终点HP区间 = undefined;
          combatData.前端推荐终点HP = undefined;
          combatData.预计HP伤害 = undefined;
          const extraPatchOps = [
            {
              op: 'replace',
              path: `/char/${escapeJsonPointerSegment(playerName)}/魂灵塔记录`,
              value: nextTowerRecord,
            },
          ];

          if (choice === 'continue' && pendingSettlement.可继续) {
            const nextFloor = Math.min(SOUL_TOWER_TOTAL_FLOORS, Math.max(1, Math.floor(Number(pendingSettlement.下一层 || pendingSettlement.层数 + 1))));
            const nextMeta = getSoulTowerGateMeta(nextFloor);
            combatData.floor = nextFloor;
            combatData.回合 = 0;
            combatData.进行中 = true;
            combatData.裁断结果 = '';
            combatData.阶段 = '宣告阶段';
            combatData.大关卡 = nextMeta.gateIndex;
            combatData.大关标签 = nextMeta.gateLabel;
            combatData.关卡范围 = nextMeta.gateRangeLabel;
            combatData.关底战 = nextMeta.isGateBoss;
            combatData.参战者.enemy = buildSoulTowerGuardianSeed(nextFloor);
            combatData.参战者.team_enemy = [];
            extraPatchOps.push({
              op: 'replace',
              path: '/sys/系统播报',
              value: `[魂灵塔] 已放弃第${pendingSettlement.层数}层的五折资格，继续挑战第${nextFloor}层。`,
            });
          } else {
            combatData.进行中 = false;
            combatData.裁断结果 = `魂灵塔第${pendingSettlement.层数}层通关`;
            extraPatchOps.push({
              op: 'replace',
              path: '/sys/系统播报',
              value: `[魂灵塔] 已结束本次冲塔，保留当前五折目标：${buildSoulTowerDiscountSpiritDisplay(pendingSettlement.五折魂灵)}。`,
            });
          }

          const detail =
            window.BattleUIBridge?.persistCombatData?.(combatData, {
              analysis:
                choice === 'continue'
                  ? 'Frontend soul tower settlement advanced to the next floor. Apply the patched battle state and latest tower record exactly as given.'
                  : 'Frontend soul tower settlement ended the run and preserved the latest discount target. Apply the patched tower record and close the battle context.',
              extraPatchOps,
              syncHpRecoveryOnly: false,
            }) || null;
          return {
            ok: true,
            action: choice,
            floor: pendingSettlement.层数,
            nextFloor: pendingSettlement.下一层,
            delivery: detail?.delivery || null,
          };
        }

        function submitBattleIntent() {
          const state = window.BattleUI?.state || {};
          if (state.pendingTowerSettlement) {
            return {
              ok: false,
              mode: 'tower_pending_choice',
              message: '魂灵塔通关后需先选择结束或继续，当前不能直接再次结算。',
            };
          }
          const battleMode = state.currentMode === 'multi_round' ? 'multi_round' : 'single_round';
          state.combatData.战斗意图 = state.currentIntentMode || '点到为止';
          const queue = [
            ...(state.selectedPreActions || []),
            state.selectedSkillActions?.[state.selectedSkillActions.length - 1],
          ].filter(Boolean);
          const intentText = buildIntentText(queue);
          const output = byId('ui-intent-output');
          if (output) output.value = intentText;
          window.__battleLastIntentText = intentText;

          let result = { intentText, mode: 'intent_only', battleMode };
          try {
              window.dispatchEvent(new CustomEvent('battle-ui-intent-submit', { detail: { intentText, battleMode, intentMode: state.currentIntentMode || '点到为止' } }));
          } catch (error) {
            console.warn('battle-ui-intent-submit dispatch failed', error);
          }

          if (typeof onPlayerAttack === 'function') {
            try {
              onPlayerAttack(intentText, { mode: battleMode, intentMode: state.currentIntentMode || '点到为止' });
              if (typeof syncFromBattleEngine === 'function') syncFromBattleEngine();
              result = {
                intentText,
                mode: 'engine_arbitrated',
                battleMode,
                aiRequest: window.__lastBattleAIRequest || null,
              };
            } catch (error) {
              console.error('battle arbitration failed', error);
              result = { intentText, mode: 'engine_error', battleMode, error };
            }
          } else {
            result = { intentText, mode: 'engine_unavailable', battleMode, error: 'battle_engine_unavailable' };
          }

          try {
            window.dispatchEvent(new CustomEvent('battle-ui-submit-finished', { detail: result }));
          } catch (error) {
            console.warn('battle-ui-submit-finished dispatch failed', error);
          }
          return result;
        }

        function bindUIEvents() {
          document.querySelectorAll('#ui-mode-group .mode-btn').forEach(btn => {
            if (btn.__battleModeBound) return;
            btn.addEventListener('click', () => {
              setUiBattleMode(btn.dataset.mode);
            });
            btn.__battleModeBound = true;
          });

          const intentModeInput = byId('ui-intent-mode');
          if (intentModeInput && !intentModeInput.__battleIntentBound) {
            intentModeInput.addEventListener('change', () => {
              setUiIntentMode(intentModeInput.value || '点到为止');
            });
            intentModeInput.__battleIntentBound = true;
          }

          const arbitrateBtn = byId('ui-arbitrate');
          if (arbitrateBtn && !arbitrateBtn.__battleSubmitBound) {
            arbitrateBtn.addEventListener('click', submitBattleIntent);
            arbitrateBtn.__battleSubmitBound = true;
          }

          const closeBtn = byId('ui-battle-close');
          if (closeBtn && !closeBtn.__battleCloseBound) {
            closeBtn.addEventListener('click', () => {
              window.dispatchEvent(new CustomEvent('battle-ui-close-request', { detail: { source: 'battle_ui' } }));
            });
            closeBtn.__battleCloseBound = true;
          }
        }

        const originalInit = typeof initBattleUiFromMvu === 'function' ? initBattleUiFromMvu : null;
        if (originalInit) {
          initBattleUiFromMvu = async function () {
            await originalInit();
            bindUIEvents();
          window.BattleUI = Object.assign(window.BattleUI || {}, {
              buildIntentText,
              submitBattleIntent,
              resolveSoulTowerSettlement,
            });
          };
        }

        initBattleUiFromMvu();
      }
}

window.BattleUIComponent = BattleUIComponent;
window.mountBattleUI = function(containerElement, snapshot, options = {}) {
  return new BattleUIComponent(containerElement, snapshot, options);
};


