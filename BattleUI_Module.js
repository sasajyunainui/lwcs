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
    const resolveSharedSkillMechanismRegistry = () => {
      if (root.__LWCS_SKILL_MECHANISM_REGISTRY__ && typeof root.__LWCS_SKILL_MECHANISM_REGISTRY__ === 'object') {
        return root.__LWCS_SKILL_MECHANISM_REGISTRY__;
      }
      try {
        if (window.parent && window.parent !== window && window.parent.__LWCS_SKILL_MECHANISM_REGISTRY__ && typeof window.parent.__LWCS_SKILL_MECHANISM_REGISTRY__ === 'object') {
          return window.parent.__LWCS_SKILL_MECHANISM_REGISTRY__;
        }
      } catch (error) {}
      try {
        if (window.top && window.top !== window && window.top.__LWCS_SKILL_MECHANISM_REGISTRY__ && typeof window.top.__LWCS_SKILL_MECHANISM_REGISTRY__ === 'object') {
          return window.top.__LWCS_SKILL_MECHANISM_REGISTRY__;
        }
      } catch (error) {}
      return null;
    };
    const SHARED_SKILL_MECHANISM_REGISTRY = resolveSharedSkillMechanismRegistry();
    if (!root.__LWCS_SKILL_MECHANISM_REGISTRY__ && SHARED_SKILL_MECHANISM_REGISTRY) {
      root.__LWCS_SKILL_MECHANISM_REGISTRY__ = SHARED_SKILL_MECHANISM_REGISTRY;
    }
    root.__LWCS_BATTLE_RUNTIME_REGISTRY_SOURCE__ = SHARED_SKILL_MECHANISM_REGISTRY ? 'shared' : 'fallback';
    root.__LWCS_BATTLE_RUNTIME_REGISTRY_SIZE__ =
      SHARED_SKILL_MECHANISM_REGISTRY?.机制定义 && typeof SHARED_SKILL_MECHANISM_REGISTRY.机制定义 === 'object'
        ? Object.keys(SHARED_SKILL_MECHANISM_REGISTRY.机制定义).length
        : 0;
    const BATTLE_SKILL_MECHANISM_META = Object.freeze(SHARED_SKILL_MECHANISM_REGISTRY?.机制定义 || {});
    const BATTLE_SKILL_TARGET_SEMANTICS = Object.freeze(SHARED_SKILL_MECHANISM_REGISTRY?.目标语义表 || {});
    const BATTLE_GRANTABLE_MECHANISM_SET = new Set(
      Array.isArray(BATTLE_SKILL_TARGET_SEMANTICS.可赋予) ? BATTLE_SKILL_TARGET_SEMANTICS.可赋予 : [],
    );
    const BATTLE_GROUP_GRANTABLE_MECHANISM_SET = new Set(
      Array.isArray(BATTLE_SKILL_TARGET_SEMANTICS.群体赋予) ? BATTLE_SKILL_TARGET_SEMANTICS.群体赋予 : [],
    );
    const BATTLE_HOSTILE_MECHANISM_SET = new Set(
      Array.isArray(BATTLE_SKILL_TARGET_SEMANTICS.敌对) ? BATTLE_SKILL_TARGET_SEMANTICS.敌对 : [],
    );
    const BATTLE_CONTEXTUAL_MECHANISM_SET = new Set(
      Array.isArray(BATTLE_SKILL_TARGET_SEMANTICS.上下文) ? BATTLE_SKILL_TARGET_SEMANTICS.上下文 : [],
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
    const 试炼地点前缀 = '试炼-';
    const 升灵台退出地点 = '传灵塔入口';
    const 魂灵塔退出地点 = '史莱克城传灵塔总部';
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

    function 构建魂灵塔试炼地点(层数 = 1) {
      const floor = Math.min(SOUL_TOWER_TOTAL_FLOORS, Math.max(1, Math.floor(Number(层数) || 1)));
      return `${试炼地点前缀}魂灵塔-第${floor}层`;
    }

    function 解析角色键(角色名 = '') {
      const safeName = String(角色名 || '').trim();
      if (!safeName) return '';
      const 角色表 = getMvuValue('char', {}) || {};
      if (角色表 && typeof 角色表 === 'object' && Object.prototype.hasOwnProperty.call(角色表, safeName)) {
        return safeName;
      }
      const 匹配项 = Object.entries(角色表).find(([键, 数据]) => {
        const 显示名 = String(数据?.name || 数据?.base?.name || 键 || '').trim();
        return 显示名 === safeName;
      });
      return 匹配项 ? String(匹配项[0] || '').trim() : safeName;
    }

    function 构建角色位置补丁(角色名 = '', 位置 = '') {
      const safeName = String(角色名 || '').trim();
      const safeLocation = String(位置 || '').trim();
      if (!safeName || !safeLocation) return null;
      const charKey = 解析角色键(safeName);
      if (!charKey) return null;
      return {
        op: 'add',
        path: `/char/${escapeJsonPointerSegment(charKey)}/状态/位置`,
        value: safeLocation,
      };
    }

    function 构建试炼状态补丁(试炼状态 = '') {
      return {
        op: 'add',
        path: '/world/战斗/试炼状态',
        value: String(试炼状态 || '').trim(),
      };
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

    function pickBattleSeedInt(min = 0, max = min) {
      const lo = Math.floor(Number(min));
      const hi = Math.floor(Number(max));
      if (!Number.isFinite(lo) || !Number.isFinite(hi)) return 0;
      if (hi <= lo) return lo;
      return lo + Math.floor(Math.random() * (hi - lo + 1));
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

    function 获取升灵台结算队伍(combatData = {}, 默认角色名 = '') {
      const 队伍种子 = [combatData?.参战者?.player, ...(combatData?.参战者?.team_player || [])].filter(Boolean);
      const 队伍成员 = [];
      const 已收录 = new Set();
      const 加入成员 = 成员名 => {
        const safeName = String(成员名 || '').trim();
        if (!safeName) return;
        const 角色键 = 解析角色键(safeName);
        if (!角色键 || 已收录.has(角色键)) return;
        const 角色数据 = getMvuValue(`char.${角色键}`, null);
        if (!角色数据 || typeof 角色数据 !== 'object') return;
        已收录.add(角色键);
        队伍成员.push({
          角色键,
          角色名: String(角色数据.name || safeName || 角色键).trim() || 角色键,
          角色数据,
        });
      };
      队伍种子.forEach(成员 => {
        const 成员名 = String(成员?.name || 成员?.名称 || '').trim();
        if (!成员名) return;
        加入成员(成员名);
      });
      if (!队伍成员.length && 默认角色名) {
        加入成员(默认角色名);
      }
      return 队伍成员;
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
      const snapshot = {
        ...source,
        类型: String(source.类型 || 'buff'),
        层数: Number.isFinite(layerParsed) ? layerParsed : 1,
        描述: String(source.描述 || '无'),
        持续回合: duration,
        面板倍率: buildSchemaStatRatioFromCondition(source),
        战斗效果: buildSchemaCombatEffectsFromCondition(source),
      };
      delete snapshot.duration;
      delete snapshot.面板修改比例;
      return snapshot;
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
      if (source.自创魂技 && typeof source.自创魂技 === 'object' && !Array.isArray(source.自创魂技)) {
        snapshot.自创魂技 = clonePersistedCombatValue(source.自创魂技);
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
      const 包含生命字段 = options.syncHpRecoveryOnly !== true;
      const previousSnapshot =
        buildCanonicalParticipantPersistenceSnapshot(currentCharData, { includeHpFields: 包含生命字段 }) || {};
      const nextSnapshot = buildCanonicalParticipantPersistenceSnapshot(participant, { includeHpFields: 包含生命字段 });
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
      '试炼状态',
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
      merged.vit_max = merged.体力上限;
      merged.vit = merged.体力;
      merged.sta_max = merged.体力上限;
      merged.sta = merged.体力;
      merged.hp_max = merged.HP上限;
      merged.hp = merged.HP;
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
      const 技能来源 = String(systemEffect?.技能来源 || skill?.技能来源 || '').trim() || (category || '魂技');
      actions.push({
        id: `skill_${actions.length}_${name}`,
        name,
        type: 'skill',
        action_type: '释放魂技',
        category: 技能来源,
        source_detail: category || 技能来源,
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
      Object.entries(char.自创魂技 || {}).forEach(([name, skill]) => fallbackPushSkill(actions, skill, name, '自创魂技'));
      Object.entries(char.武魂融合技 || {}).forEach(([name, fusion]) =>
        fallbackPushSkill(actions, buildFusionCombatSkill(fusion, name, char), `武魂融合技·${name}`, '武魂融合技'),
      );
      actions.push(
        { id: 'basic_attack', name: '普通攻击', type: 'tactical', action_type: '常规攻击', category: '战术', cast_time: 10, cost_text: '无', enabled: true, skill: { name: '普通攻击' } },
        { id: 'guard', name: '防御', type: 'tactical', action_type: '防御', category: '战术', cast_time: 10, cost_text: '无', enabled: true, skill: { name: '防御' } },
        { id: 'evade', name: '闪避', type: 'tactical', action_type: '闪避', category: '战术', cast_time: 12, cost_text: '体力:5%', enabled: true, skill: { name: '闪避', 消耗: '体力:5%' } },
        { id: 'flee', name: '撤离', type: 'tactical', action_type: '撤离', category: '战术', cast_time: 20, cost_text: '无', enabled: true, skill: { name: '撤离' } },
      );
      return actions;
    }

    function resolveIntentTargetNameFromAction(action, combatData) {
      const safeAction = action || {};
      const skill = safeAction.raw_skill || safeAction.skill || {};
      if (safeAction.target_name) return String(safeAction.target_name || '').trim() || null;
      const playerName = String(combatData?.参战者?.player?.name || '').trim() || null;
      const enemyName = String(combatData?.参战者?.enemy?.name || '').trim() || null;
      const baseTargetText =
        String(skill?.对象 || '').trim() ||
        String(
          Array.isArray(skill?._效果数组)
            ? (skill._效果数组.find(effect => effect && effect.机制 === '系统基础')?.对象 || '')
            : '',
        ).trim();
      const effectTargetText =
        Array.isArray(skill?._效果数组)
          ? skill._效果数组
              .map(effect => String(effect?.目标 || effect?.对象 || '').trim())
              .find(Boolean) || ''
          : '';
      const targetText = baseTargetText || effectTargetText;
      if (/自身/.test(targetText)) return playerName;
      if (/友方单体|己方\/单体/.test(targetText)) return playerName;
      if (/友方群体|己方\/群体|全场/.test(targetText)) return playerName || enemyName;
      return enemyName || playerName;
    }

    function fallbackBuildIntent(action, combatData) {
      const safeAction = action || {};
      const resolvedTargetName = resolveIntentTargetNameFromAction(safeAction, combatData);
      const queue = [{
        type: safeAction.action_type || safeAction.type || '常规攻击',
        action_type: safeAction.action_type || safeAction.type || '常规攻击',
        skill: safeAction.raw_skill || safeAction.skill || { name: safeAction.name || '普通攻击' },
        cast_time: fallbackNumber(safeAction.cast_time, 10),
        target_name: resolvedTargetName,
        前摇已结算: safeAction.前摇已结算 === true,
      }];
      return `${safeAction.name || '普通攻击'}\n[动作队列]${JSON.stringify(queue)}[/动作队列]\n[目标]${resolvedTargetName || '对手'}[/目标]`;
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
    const BATTLE_SKILL_TARGET_SCALES = new Set(['自身', '单体', '群体', '全场']);
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

    function normalizeBattleSkillTargetScale(value = '', fallback = '单体') {
      const text = String(value || '').trim();
      if (BATTLE_SKILL_TARGET_SCALES.has(text)) return text;
      if (text === '自身') return '自身';
      if (text === '全场') return '全场';
      if (/群体/.test(text)) return '群体';
      if (/单体/.test(text)) return '单体';
      return BATTLE_SKILL_TARGET_SCALES.has(fallback) ? fallback : '单体';
    }

    function deriveBattleSkillTargetScaleFromModel(targetModel = '敌方单体') {
      const normalized = normalizeBattleSkillTargetModel(targetModel, '敌方单体');
      if (normalized === '自身') return '自身';
      if (normalized === '全场') return '全场';
      if (normalized.includes('群体')) return '群体';
      return '单体';
    }

    function normalizeBattleExecutionEffectTargetModel(value = '', fallback = '敌方单体') {
      const text = String(value || '').trim();
      if (!text) return normalizeBattleSkillTargetModel(fallback, '敌方单体');
      const aliasMap = {
        '己方/单体': '友方单体',
        '己方/群体': '友方群体',
        '敌方/单体': '敌方单体',
        '敌方/群体': '敌方群体',
        食用者: '友方单体',
        使用者: '自身',
        随机目标: normalizeBattleSkillTargetModel(fallback, '敌方单体'),
      };
      return normalizeBattleSkillTargetModel(aliasMap[text] || text, normalizeBattleSkillTargetModel(fallback, '敌方单体'));
    }

    function hydrateBattleExecutionEffectEntry(effect = {}, fallbackTargetModel = '敌方单体') {
      if (!effect || typeof effect !== 'object' || Array.isArray(effect)) return null;
      const mechanism = String(effect?.机制 || '').trim();
      if (!mechanism || mechanism === '系统基础') return null;
      const targetModel = normalizeBattleExecutionEffectTargetModel(
        effect?.目标模型 || effect?.目标 || effect?.对象,
        fallbackTargetModel,
      );
      const duration = Math.max(0, Math.round(Number(effect?.持续回合 ?? effect?.持续 ?? 0)));
      const trigger = String(effect?.触发时机 || effect?.触发 || '').trim();
      const params =
        effect?.参数 && typeof effect.参数 === 'object' && !Array.isArray(effect.参数) ? deepClonePlain(effect.参数) : {};
      const hydrated = {
        ...params,
        ...deepClonePlain(effect || {}),
        机制: mechanism,
        目标模型: targetModel,
        目标: targetModel,
        对象: targetModel,
      };
      delete hydrated.参数;
      if (duration > 0) hydrated.持续回合 = duration;
      if (trigger) {
        hydrated.触发时机 = trigger;
        if (!String(hydrated.触发 || '').trim()) hydrated.触发 = trigger;
      }
      return hydrated;
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
          if (judgeKey === 'vit') {
            return Math.max(0, Number(entity?.sta ?? stats?.sta ?? entity?.体力 ?? stats?.体力 ?? entity?.vit ?? stats?.vit ?? 0));
          }
          return Number(stats[judgeKey] || 0);
        case 'vit_ratio':
          return (
            Math.max(0, Number(entity?.sta || stats?.sta || entity?.体力 || stats?.体力 || 0)) /
            Math.max(1, Number(entity?.sta_max || stats?.sta_max || entity?.体力上限 || stats?.体力上限 || 1))
          );
        case 'hp_ratio':
          return (
            Math.max(0, Number(entity?.hp ?? stats?.hp ?? entity?.HP ?? stats?.HP ?? 0)) /
            Math.max(1, Number(entity?.hp_max ?? stats?.hp_max ?? entity?.HP上限 ?? stats?.HP上限 ?? 1))
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
      mechanism_suppress(ctx) {
        const state = ctx.state || {};
        state.机制抹消目标 = normalizeBattleMechanismSuppressionTargets(
          ctx.effect?.抹消目标 || ctx.effect?.机制抹消目标 || '复苏',
        );
        state.机制抹消方式 = normalizeBattleMechanismSuppressionMode(
          ctx.effect?.抹消方式 || ctx.effect?.机制抹消方式 || '移除并封锁',
        );
        ctx.ensureStateShell(ctx.effect?.状态名称 || '机制抹消', ['机制抹消']);
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
      cost_increase(ctx) {
        const ratio = Number(ctx.effect?.数值 || 1.2);
        ctx.directPayload.resource_block_ratio = Math.max(
          Number(ctx.directPayload.resource_block_ratio || 0),
          Math.max(0, ratio - 1),
        );
        ctx.ensureStateShell(ctx.effect?.状态名称 || '资源锁定', ['资源锁定']);
      },
      copy_status(ctx) {
        const splitLayers = Math.max(1, Number(ctx.effect?.拆层数量 || ctx.effect?.split_layers || 1));
        const layerBonus = Math.max(0, splitLayers * 0.02);
        ctx.directPayload.dot_damage = Math.max(
          Number(ctx.directPayload.dot_damage || 0),
          Number(ctx.effect?.dot_damage || 0),
        );
        ctx.directPayload.control_resist_mult = Math.max(
          1,
          Number(ctx.directPayload.control_resist_mult || 1) + layerBonus,
        );
        ctx.ensureStateShell(ctx.effect?.状态名称 || '拆层转存', ['拆层转存']);
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
          if (mechanism === '消耗提高' || mechanism === '消耗降低') {
            const value = Number(effect?.数值 || 1);
            directPayload.cost_ratio = value > 0 ? value : 1;
            if (mechanism === '消耗提高') directPayload.resource_block_ratio = Math.max(0, value - 1);
            ensureStateShell(effect?.状态名称 || mechanism, [mechanism]);
          }
          if (mechanism === '前摇拉长' || mechanism === '前摇缩短') {
            const value = Number(effect?.数值 || 1);
            directPayload.windup_ratio = value > 0 ? value : 1;
            if (mechanism === '前摇拉长') directPayload.cast_speed_penalty = Math.max(0, value - 1);
            else directPayload.cast_speed_bonus = Math.max(0, 1 - value);
            ensureStateShell(effect?.状态名称 || mechanism, [mechanism]);
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
          if (runtimeConsumer) runtimeConsumer({ effect, mechanism, directPayload, ensureStateShell, state: pState });
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
      const 攻方魂力上限 = Math.max(1, Number(attacker?.sp_max || attacker?.魂力上限 || 1));
      const 守方魂力上限 = Math.max(1, Number(defender?.sp_max || defender?.魂力上限 || 1));
      const 原始倍率 = 攻方魂力上限 / 守方魂力上限;
      const 柔化倍率 = Math.pow(原始倍率, 0.55);
      return Math.max(0.55, Math.min(1.85, 柔化倍率));
    }

    function 读取单位战斗效果列表(单位 = {}) {
      if (!单位?.状态效果 || typeof 单位.状态效果 !== 'object') return [];
      return Object.values(单位.状态效果)
        .map(状态 => 状态?.战斗效果 || {})
        .filter(战斗效果 => 战斗效果 && typeof 战斗效果 === 'object');
    }

    function 读取状态穿透比例(战斗效果列表 = []) {
      return 战斗效果列表.reduce((总和, 战斗效果) => {
        const 原始值 = Number(战斗效果?.armor_pen || 0);
        return 总和 + (Math.abs(原始值) <= 1 ? 原始值 * 100 : 原始值);
      }, 0);
    }

    function 计算有效穿透比例(技能穿透 = 0, 状态穿透 = 0) {
      const 原始穿透 = Math.max(0, Number(技能穿透 || 0) + Number(状态穿透 || 0));
      if (原始穿透 <= 70) return 原始穿透;
      return Math.min(92, 70 + (原始穿透 - 70) * 0.35);
    }

    function 计算穿透后防御值(基础防御 = 1, 技能穿透 = 0, 状态穿透 = 0) {
      const 有效穿透 = 计算有效穿透比例(技能穿透, 状态穿透);
      return Math.max(1, Number(基础防御 || 1) * (1 - 有效穿透 / 100));
    }

    function 计算有效闪避加值(原始加值 = 0) {
      const 数值 = Number(原始加值 || 0);
      if (!(数值 > 0)) return 数值;
      if (数值 <= 0.25) return 数值;
      return Math.min(0.45, 0.25 + (数值 - 0.25) * 0.4);
    }

    function 获取施法消耗倍率(单位 = {}) {
      const 战斗效果列表 = 读取单位战斗效果列表(单位);
      return 战斗效果列表.reduce((倍率, 战斗效果) => {
        const 显式倍率 = Number(战斗效果?.cost_ratio || 1);
        const 资源封锁倍率 = 1 + Math.max(0, Number(战斗效果?.resource_block_ratio || 0));
        return Math.max(倍率, Number.isFinite(显式倍率) && 显式倍率 > 0 ? 显式倍率 : 1, 资源封锁倍率);
      }, 1);
    }

    function 获取动作前摇倍率(单位 = {}) {
      const 战斗效果列表 = 读取单位战斗效果列表(单位);
      const 速度加成 = 战斗效果列表.reduce((总和, 战斗效果) => 总和 + Number(战斗效果?.cast_speed_bonus || 0), 0);
      const 速度惩罚 = 战斗效果列表.reduce((总和, 战斗效果) => 总和 + Number(战斗效果?.cast_speed_penalty || 0), 0);
      const 直接倍率 = 战斗效果列表.reduce((倍率, 战斗效果) => {
        const 前摇倍率 = Number(战斗效果?.windup_ratio || 1);
        return Number.isFinite(前摇倍率) && 前摇倍率 > 0 ? 倍率 * 前摇倍率 : 倍率;
      }, 1);
      const 合成倍率 = 直接倍率 * (1 - 速度加成 + 速度惩罚);
      return Math.max(0.25, Math.min(3, 合成倍率));
    }

    function 套用动作实际前摇(单位, 动作) {
      if (!动作 || typeof 动作 !== 'object' || 动作.前摇已结算 === true) return 动作;
      const 基础前摇 = Number(动作.cast_time ?? 动作.skill?.cast_time ?? 0) || 0;
      if (!(基础前摇 > 0)) {
        动作.前摇已结算 = true;
        return 动作;
      }
      const 前摇倍率 = 获取动作前摇倍率(单位);
      动作.cast_time = Math.max(1, Math.round(基础前摇 * 前摇倍率));
      动作.前摇已结算 = true;
      return 动作;
    }

    function 套用动作队列实际前摇(单位, 动作) {
      if (!动作 || typeof 动作 !== 'object') return 动作;
      if (Array.isArray(动作.pre_actions)) 动作.pre_actions.forEach(副动作 => 套用动作实际前摇(单位, 副动作));
      return 套用动作实际前摇(单位, 动作);
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
        cost_ratio: 1.0,
        windup_ratio: 1.0,
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
        if (['control_resist_mult', 'final_damage_mult', 'final_heal_mult', 'shield_gain_mult', 'cost_ratio', 'windup_ratio'].includes(key)) {
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

    function isBattleSkillSummaryEffect(effect = {}) {
      if (!effect || typeof effect !== 'object' || Array.isArray(effect)) return false;
      const mechanism = String(effect?.机制 || effect?.名称 || effect?.类型 || '').trim();
      if (!mechanism || mechanism === '系统基础') return false;
      if (mechanism === '状态挂载') {
        const stateName = String(effect?.状态名称 || '').trim();
        const duration = Math.max(0, Number(effect?.持续回合 ?? effect?.持续 ?? 0));
        const calc = effect?.计算层效果 && typeof effect.计算层效果 === 'object' ? effect.计算层效果 : {};
        const panelMods = effect?.面板修改比例 && typeof effect.面板修改比例 === 'object' ? effect.面板修改比例 : {};
        const hasPanelDelta = Object.values(panelMods).some(value => Math.abs(Number(value || 1) - 1) > 0.001);
        const hasCalc = hasMeaningfulCombatEffect(calc);
        const hasStateHint = String(effect?.特殊机制标识 || '').trim() && String(effect?.特殊机制标识 || '').trim() !== '无';
        return !!(stateName || duration > 0 || hasPanelDelta || hasCalc || hasStateHint);
      }
      const runtimeMeta = getBattleSkillMechanismMeta(mechanism);
      if (runtimeMeta && String(runtimeMeta?.运行时消费器 || '').trim()) return true;
      if (effect?.计算层效果 && typeof effect.计算层效果 === 'object' && hasMeaningfulCombatEffect(effect.计算层效果)) return true;
      if (effect?.战斗效果 && typeof effect.战斗效果 === 'object' && hasMeaningfulCombatEffect(effect.战斗效果)) return true;
      const duration = Math.max(0, Number(effect?.持续回合 ?? effect?.持续 ?? 0));
      if (duration > 0) return true;
      const keywords = ['状态名称', '伤害类型', '威力倍率', '护盾值', '数值', '动作', '资源类型', '抹消目标', '实体名称', '核心机制描述'];
      return keywords.some(key => {
        const value = effect?.[key];
        if (value === undefined || value === null) return false;
        if (typeof value === 'number') return Number.isFinite(value) && Math.abs(value) > 0;
        const text = String(value).trim();
        return !!text && text !== '无';
      });
    }

    function getBattleSkillSummaryEffects(skill = {}) {
      const effects = getSkillEffects(skill)
        .filter(effect => isBattleSkillSummaryEffect(effect))
        .map(effect => {
          const mechanism = String(effect?.机制 || effect?.名称 || effect?.类型 || '').trim();
          const runtimeMeta = getBattleSkillMechanismMeta(mechanism) || {};
          const targetModel = normalizeBattleSkillTargetModel(
            effect?.目标模型 || effect?.目标 || effect?.对象 || getSkillRuntimeMeta(skill)?.目标模型 || '敌方单体',
            '敌方单体',
          );
          const targetScale = normalizeBattleSkillTargetScale(
            deriveBattleSkillTargetScaleFromModel(targetModel),
            deriveBattleSkillTargetScaleFromModel(targetModel),
          );
          const duration = Math.max(0, Number(effect?.持续回合 ?? effect?.持续 ?? 0));
          const calc = effect?.计算层效果 && typeof effect.计算层效果 === 'object'
            ? mergeCombatEffectMaps(createEmptyCombatEffectMap(), effect.计算层效果 || {})
            : createEmptyCombatEffectMap();
          const hint = runtimeMeta?.摘要提示 && typeof runtimeMeta.摘要提示 === 'object'
            ? { ...runtimeMeta.摘要提示 }
            : {};
          const stateName = String(effect?.状态名称 || '').trim();
          const stateFlag = String(effect?.特殊机制标识 || '').trim();
          return Object.freeze({
            机制: mechanism,
            运行时消费器: String(runtimeMeta?.运行时消费器 || '').trim(),
            目标语义: String(runtimeMeta?.目标语义 || '').trim() || inferFallbackBattleMechanismSemantic(mechanism),
            目标模型: targetModel,
            目标规模: targetScale,
            持续回合: duration,
            状态名称: stateName || mechanism,
            状态标识: stateFlag && stateFlag !== '无' ? stateFlag : '',
            计算层效果: calc,
            关键参数: {
              威力倍率: Number(effect?.威力倍率 || 0),
              护盾值: Number(effect?.护盾值 || 0),
              数值: Number(effect?.数值 || 0),
              资源类型: String(effect?.资源类型 || '').trim(),
              实体名称: String(effect?.实体名称 || '').trim(),
            },
            摘要提示: hint,
            原始效果: effect,
          });
        });
      const uniqueMap = new Map();
      effects.forEach(entry => {
        const key = [
          String(entry?.机制 || '').trim(),
          String(entry?.目标模型 || '').trim(),
          String(entry?.状态名称 || '').trim(),
          String(entry?.持续回合 || 0),
          String(entry?.状态标识 || '').trim(),
        ].join('|');
        if (!uniqueMap.has(key)) uniqueMap.set(key, entry);
      });
      return Array.from(uniqueMap.values());
    }

    function getBattleSkillSummaryEffectByMechanism(skill = {}, mechanism = '') {
      const normalized = String(mechanism || '').trim();
      if (!normalized) return null;
      return getBattleSkillSummaryEffects(skill).find(effect => String(effect?.机制 || '').trim() === normalized) || null;
    }

    function getBattleDirectionRuleHpRatio(char = null) {
      if (!char) return 1;
      const hp = Math.max(0, Number(char?.hp ?? char?.HP ?? char?.final?.hp ?? 0));
      const hpMax = Math.max(1, Number(char?.hp_max ?? char?.HP上限 ?? char?.final?.hp_max ?? 1));
      return hp / hpMax;
    }

    function collectBattleSkillBranchList(skill = {}) {
      const 效果列表 = Array.isArray(skill?._效果数组) ? skill._效果数组 : [];
      return Array.from(new Set(
        效果列表
          .map(effect => String(effect?.分支标记 || '').trim())
          .filter(Boolean),
      ));
    }

    function pickBattleSkillBranchForAi(skill = {}, context = {}) {
      const 分支列表 = collectBattleSkillBranchList(skill);
      if (!分支列表.length) return '';
      const 施术者 = context?.actor || null;
      const 目标 = context?.target || null;
      const 自身血量比 = getBattleDirectionRuleHpRatio(施术者);
      const 目标敏捷 = Number(目标?.agi ?? 目标?.final?.agi ?? 0);
      const 自身敏捷 = Number(施术者?.agi ?? 施术者?.final?.agi ?? 0);
      const 高威胁窗口 = !!context?.高威胁窗口;
      let 最优分支 = { id: 分支列表[0], weight: -Infinity };
      分支列表.forEach(分支标记 => {
        const 分支效果列表 = (Array.isArray(skill?._效果数组) ? skill._效果数组 : []).filter(effect =>
          String(effect?.分支标记 || '').trim() === 分支标记,
        );
        const 分支机制集合 = new Set(分支效果列表.map(effect => String(effect?.机制 || '').trim()).filter(Boolean));
        const 是否增益分支 = ['属性变化', '持续恢复', '护盾', '减伤', '无敌金身', '伤害分摊', '伤害反射', '替身抵消', '复苏', '能力共享'].some(name => 分支机制集合.has(name));
        const 是否压制分支 = ['软控', '硬控', '位移限制', '封技', '治疗反转', '机制抹消', '吞噬', '斩盾', '引爆持续伤害', '窃取护盾', '状态转移'].some(name => 分支机制集合.has(name));
        const 是否锁定分支 = ['硬控', '位移限制', '封技', '破隐', '目标锁定'].some(name => 分支机制集合.has(name));
        let 权重 = 10;
        if (自身血量比 < 0.4 && 是否增益分支) 权重 += 24;
        if (高威胁窗口 && (是否压制分支 || 是否锁定分支)) 权重 += 22;
        if (目标敏捷 > Math.max(1, 自身敏捷) * 1.08 && 是否锁定分支) 权重 += 14;
        if (自身血量比 > 0.7 && 是否压制分支) 权重 += 8;
        if (权重 > 最优分支.weight) 最优分支 = { id: 分支标记, weight: 权重 };
      });
      return String(最优分支.id || 分支列表[0] || '').trim();
    }

    function getSkillEffects(skill) {
      const runtimeMeta = getSkillRuntimeMeta(skill);
      const 原始效果列表 = (Array.isArray(skill?._效果数组) ? skill._效果数组 : []).filter(effect => effect?.机制 !== '系统基础');
      const 造物效果列表 = 原始效果列表.filter(effect =>
        ['生成造物', '造物生成'].includes(String(effect?.机制 || '')),
      );
      const 来源效果列表 = 造物效果列表.length
        ? 造物效果列表.flatMap(effect => (Array.isArray(effect?.使用效果) ? effect.使用效果 : []))
        : 原始效果列表;
      const 分支列表 = Array.from(new Set(来源效果列表.map(effect => String(effect?.分支标记 || '').trim()).filter(Boolean)));
      const 已选分支 = String(skill?._runtime_分支标记 || '').trim();
      const 生效分支 = 分支列表.includes(已选分支) ? 已选分支 : (分支列表[0] || '');
      const 生效效果列表 = 生效分支
        ? 来源效果列表.filter(effect => {
            const 分支 = String(effect?.分支标记 || '').trim();
            return !分支 || 分支 === 生效分支;
          })
        : 来源效果列表;
      return 生效效果列表
        .map(effect => hydrateBattleExecutionEffectEntry(effect, runtimeMeta?.目标模型 || '敌方单体'))
        .filter(Boolean);
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

    function getBattleSkillSystemBaseParam(skill = {}, key = '') {
      const systemBase = getSystemBaseEffect(skill);
      const params = systemBase?.参数;
      if (!params || typeof params !== 'object' || Array.isArray(params)) return undefined;
      return params[key];
    }

    function getBattleSkillAttributeSummary(skill = {}) {
      return {
        属性来源: String(getBattleSkillSystemBaseParam(skill, '属性来源') || '').trim(),
        魂技作用: String(getBattleSkillSystemBaseParam(skill, '魂技作用') || '').trim(),
        显示元素: String(getBattleSkillSystemBaseParam(skill, '显示元素') || '').trim(),
      };
    }

    function getBattleSkillAttributeSource(skill = {}) {
      return normalizeBattleSkillAttributeSource(getBattleSkillAttributeSummary(skill).属性来源 || '');
    }

    function getBattleSkillRole(skill = {}) {
      return normalizeBattleSkillRole(getBattleSkillAttributeSummary(skill).魂技作用 || '');
    }

    function getBattleSkillElementStructure(skill = {}) {
      return normalizeBattleSkillElementStructure(getBattleSkillSystemBaseParam(skill, '元素构型') || {});
    }

    function getBattleSkillWuxingInvocation(skill = {}) {
      return normalizeBattleSkillWuxingInvocation(getBattleSkillSystemBaseParam(skill, '五行调用结构') || {});
    }

    function getBattleSkillPolaritySummary(skill = {}) {
      return normalizeBattleSkillPolarityInfo(getBattleSkillSystemBaseParam(skill, '极性信息') || {});
    }

    function getBattleSkillRuntimeAttributeCoefficients(skill = {}) {
      return normalizeBattleSkillAttributeCoefficients(getBattleSkillSystemBaseParam(skill, '属性系数') || {});
    }

    function getBattleSkillDisplayElement(skill = {}) {
      const explicit = String(getBattleSkillAttributeSummary(skill).显示元素 || '').trim();
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

      ['final_damage_mult', 'final_heal_mult', 'shield_gain_mult', 'control_resist_mult', 'cost_ratio', 'windup_ratio'].forEach(key => {
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
        if ((mechanism === '消耗提高' || mechanism === '消耗降低') && effect.数值 !== undefined) {
          effect.数值 =
            mechanism === '消耗提高'
              ? scaleBattleFactor(effect.数值, coeff.消耗, 1)
              : scaleBattleDebuffRatio(effect.数值, coeff.消耗, 1);
        }
        if ((mechanism === '前摇拉长' || mechanism === '前摇缩短') && effect.数值 !== undefined) {
          effect.数值 =
            mechanism === '前摇拉长'
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
        systemBase?.目标模型 || '敌方单体',
        '敌方单体',
      );
      const baseTargetScale = normalizeBattleSkillTargetScale(
        deriveBattleSkillTargetScaleFromModel(baseTargetModel),
      );
      const baseTarget = mapBattleTargetModelToCombatTarget(baseTargetModel);
      const baseTargetModifiers = normalizeBattleSkillTargetModifiers(
        deriveBattleSkillTargetModifiers(skill, baseTargetModel),
      );
      const baseResolutionStrategy = String(
        systemBase?.结算策略 || deriveBattleTargetResolutionStrategy(baseTargetModel),
      ).trim() || '单目标独立';
      const baseCostRaw = systemBase?.消耗 ?? '无';
      const baseCost =
        typeof baseCostRaw === 'object' ? formatCostObjectToString(baseCostRaw) : String(baseCostRaw || '无').trim() || '无';
      const baseCastTime = Number(systemBase?.cast_time ?? 0) || 0;
      return {
        技能来源: String(systemBase?.技能来源 || '魂技').trim() || '魂技',
        技能类型: normalizeSkillTypeLabel(baseType || '无'),
        目标模型: baseTargetModel,
        目标规模: baseTargetScale,
        目标修饰: baseTargetModifiers,
        结算策略: baseResolutionStrategy,
        对象: baseTarget,
        消耗: baseCost,
        cast_time: baseCastTime,
      };
    }

    const BATTLE_SKILL_SIDE_EFFECT_TRIGGER_SET = new Set(['施放后', '命中后', '回合结束时', '状态结束后']);
    const BATTLE_SKILL_SIDE_EFFECT_TARGET_SET = new Set(['施术者', '状态持有者', '受术目标', '双方']);

    function normalizeBattleSkillSideEffectStatMap(value = {}) {
      const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
      const normalized = {};
      ['str', 'def', 'agi', 'vit_max', 'sp_max', 'men_max'].forEach(key => {
        const parsed = Number(source[key]);
        if (Number.isFinite(parsed) && parsed > 0) normalized[key] = Number(parsed.toFixed(4));
      });
      return normalized;
    }

    function normalizeBattleSkillSideEffectCombatMap(value = {}) {
      const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
      const normalized = {};
      if (source.skip_turn === true) normalized.skip_turn = true;
      if (source.致死 === true) normalized.致死 = true;
      ['random_target_rate', 'hit_penalty', 'dodge_penalty', 'cast_speed_penalty', 'control_success_penalty'].forEach(key => {
        const parsed = Number(source[key]);
        if (Number.isFinite(parsed) && parsed > 0) normalized[key] = Number(parsed.toFixed(4));
      });
      return normalized;
    }

    function normalizeBattleSkillSideEffectEntry(value = {}) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
      const 副作用类型 = String(value.副作用类型 || '').trim();
      if (!副作用类型) return null;
      const rawTrigger = String(value.触发时机 || '施放后').trim();
      const 触发时机 = BATTLE_SKILL_SIDE_EFFECT_TRIGGER_SET.has(rawTrigger) ? rawTrigger : '施放后';
      const rawTarget = String(value.生效对象 || '施术者').trim();
      const 生效对象 = BATTLE_SKILL_SIDE_EFFECT_TARGET_SET.has(rawTarget) ? rawTarget : '施术者';
      const 持续回合 = Math.max(0, Math.round(Number(value.持续回合 || 0)));
      const rawChance = Number(value.触发概率 ?? 1);
      const 触发概率 = Number.isFinite(rawChance) ? Math.max(0, Math.min(1, Number(rawChance.toFixed(4)))) : 1;
      const 参数 = value.参数 && typeof value.参数 === 'object' && !Array.isArray(value.参数) ? value.参数 : {};
      const 关联状态 = String(参数.关联状态 || value.关联状态 || '').trim();
      const 面板修改比例 = normalizeBattleSkillSideEffectStatMap(参数.面板修改比例 || value.面板修改比例);
      const 战斗效果 = normalizeBattleSkillSideEffectCombatMap(参数.战斗效果 || value.战斗效果);
      const normalized = { 副作用类型, 触发时机, 生效对象, 持续回合, 触发概率 };
      if (Object.keys(面板修改比例).length > 0) normalized.面板修改比例 = 面板修改比例;
      if (Object.keys(战斗效果).length > 0) normalized.战斗效果 = 战斗效果;
      if (关联状态) normalized.关联状态 = 关联状态;
      return normalized;
    }

    function normalizeBattleSkillSideEffectList(value = []) {
      const source = Array.isArray(value) ? value : [];
      return source
        .map(item => normalizeBattleSkillSideEffectEntry(item))
        .filter(Boolean);
    }

    function getBattleSkillSideEffectList(skill = {}) {
      const systemBase = getSystemBaseEffect(skill);
      return normalizeBattleSkillSideEffectList(systemBase?.副作用列表 || []);
    }

    function resolveBattleSideEffectTargets(effect = {}, caster = null, targetSet = []) {
      const targets = Array.isArray(targetSet) ? targetSet.filter(Boolean) : [];
      const targetMode = String(effect?.生效对象 || '施术者').trim();
      if (targetMode === '受术目标' || targetMode === '状态持有者') return targets;
      if (targetMode === '双方') return Array.from(new Set([caster, ...targets].filter(Boolean)));
      return caster ? [caster] : targets;
    }

    function applyBattleSideEffectState(targetChar, effect = {}, sourceName = '', logs = []) {
      if (!targetChar) return;
      const chance = Number(effect?.触发概率 ?? 1);
      if (chance < 1 && Math.random() > chance) return;
      const 战斗效果 = effect?.战斗效果 && typeof effect.战斗效果 === 'object' && !Array.isArray(effect.战斗效果)
        ? effect.战斗效果
        : {};
      const 是否致死副作用 = 战斗效果?.致死 === true;
      if (是否致死副作用) {
        设置战斗血量值(targetChar, 0);
        let 复苏结果日志 = '';
        if (getCombatHpValue(targetChar) <= 0) {
          复苏结果日志 = triggerReviveEffect(targetChar, targetChar?.name || '目标') || '';
        }
        if (Array.isArray(logs)) {
          logs.push(`[副作用] ${targetChar.name || '目标'}触发[${effect?.副作用类型 || '未知副作用'}](${effect?.触发时机 || '施放后'})`);
          if (复苏结果日志) logs.push(复苏结果日志);
          else logs.push(`[副作用致死] ${targetChar.name || '目标'}受到致死反噬，生命归零。`);
        }
        return;
      }
      const duration = Math.max(1, Number(effect?.持续回合 || 0));
      const stateName = `副作用:${String(effect?.副作用类型 || '未知')}`;
      if (!targetChar.状态效果) targetChar.状态效果 = {};
      const nextCalc = mergeCombatEffectMaps(createEmptyCombatEffectMap(), 战斗效果);
      targetChar.状态效果[stateName] = {
        类型: 'debuff',
        层数: 1,
        描述: `由[${sourceName || '技能'}]触发`,
        duration,
        面板修改比例: effect?.面板修改比例 || {},
        战斗效果: nextCalc,
      };
      if (Array.isArray(logs)) {
        logs.push(`[副作用] ${targetChar.name || '目标'}触发[${effect?.副作用类型 || '未知副作用'}](${effect?.触发时机 || '施放后'})`);
      }
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

    function getBattleSkillSourceCategory(skill) {
      return String(getSkillRuntimeMeta(skill).技能来源 || '魂技').trim() || '魂技';
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
      if (meta && typeof meta === 'object') return meta;
      return buildFallbackBattleMechanismMeta(normalizedLabel);
    }

    function getBattleMechanismSemanticSet(semanticKey = '') {
      if (semanticKey === '可赋予') return BATTLE_GRANTABLE_MECHANISM_SET;
      if (semanticKey === '群体赋予') return BATTLE_GROUP_GRANTABLE_MECHANISM_SET;
      if (semanticKey === '敌对') return BATTLE_HOSTILE_MECHANISM_SET;
      if (semanticKey === '上下文') return BATTLE_CONTEXTUAL_MECHANISM_SET;
      if (semanticKey === '仅自身') return BATTLE_SELF_ONLY_MECHANISM_SET;
      return new Set();
    }

    const BATTLE_OUTPUT_RUNTIME_CONSUMERS = new Set([
      'direct_damage',
      'multi_damage',
      'delay_burst',
      'dot_damage',
      'dot_detonate',
      'shield_break',
      'armor_penetration',
      'lifesteal',
    ]);
    const BATTLE_CONTROL_RUNTIME_CONSUMERS = new Set([
      'hard_control',
      'soft_control',
      'position_lock',
      'interrupt',
      'skill_seal',
      'anti_heal',
      'heal_inversion',
      'cost_increase',
      'windup_increase',
      'mastery_reduce',
      'speed_reduce',
      'perception_disturb',
      'judge_effect',
      'target_lock',
      'hostile_shift',
      'position_exchange',
      'hard_lock',
      'status_transfer',
      'effect_reverse',
      'dispel_buff',
      'steal_buff',
      'resource_drain',
      'mechanism_suppress',
      'taunt',
      'reveal',
      'slow',
      'blind',
      'silence',
      'disarm',
      'expose_weakness',
    ]);
    const BATTLE_DEFENSE_RUNTIME_CONSUMERS = new Set([
      'shield',
      'damage_reduce',
      'block',
      'super_armor',
      'death_save',
      'invincible',
      'damage_reflect',
      'damage_share',
      'substitute',
      'revive',
      'guard',
      'clone',
      'counter',
      'on_hit_counter',
    ]);
    const BATTLE_SUPPORT_RUNTIME_CONSUMERS = new Set([
      'attribute_buff',
      'cost_reduce',
      'windup_reduce',
      'mastery_raise',
      'speed_raise',
      'recover_vit',
      'recover_sp',
      'recover_men',
      'recover_over_time',
      'cleanse',
      'shared_vision',
      'self_shift',
      'pursuit_shift',
      'disengage_shift',
      'damage_to_heal',
      'resource_refeed',
      'stealth',
    ]);
    const BATTLE_MOBILITY_RUNTIME_CONSUMERS = new Set([
      'self_shift',
      'hostile_shift',
      'position_exchange',
      'pursuit_shift',
      'disengage_shift',
      'pursuit_mark',
      'stealth',
    ]);
    const BATTLE_SPECIAL_RULE_RUNTIME_CONSUMERS = new Set([
      'clone',
      'copy_status',
      'counter',
      'damage_to_heal',
      'heal_to_damage',
      'status_exchange',
      'status_transfer',
      'hard_lock',
      'judge_effect',
      'self_rule_rewrite',
      'self_random_variance',
      'self_mirror',
      'random_target_shift',
      'self_sacrifice_gain',
      'dot_detonate',
      'shield_break',
      'shield_steal',
      'resource_drain',
      'resource_refeed',
      'mechanism_suppress',
      'effect_reverse',
      'construct_create',
    ]);
    const BATTLE_SUSTAIN_RUNTIME_CONSUMERS = new Set([
      'dot_damage',
      'recover_over_time',
      'shield',
      'damage_reduce',
      'super_armor',
      'shared_vision',
      'clone',
      'guard',
      'stealth',
      'taunt',
      'slow',
      'blind',
      'silence',
      'disarm',
      'target_lock',
      'perception_disturb',
    ]);
    const BATTLE_TRIGGER_RUNTIME_CONSUMERS = new Set([
      'block',
      'death_save',
      'invincible',
      'damage_reflect',
      'damage_share',
      'substitute',
      'revive',
      'counter',
      'on_hit_counter',
      'construct_create',
      'self_rule_rewrite',
    ]);

    const LOCAL_BATTLE_GROUP_GRANTABLE_CONSUMERS = new Set([
      'attribute_buff',
      'shield',
      'damage_reduce',
      'shared_vision',
      'recover_vit',
      'recover_sp',
      'recover_men',
      'recover_over_time',
      'cleanse',
      'damage_share',
      'resource_refeed',
    ]);
    const LOCAL_BATTLE_SELF_ONLY_CONSUMERS = new Set([
      'self_rule_rewrite',
      'self_random_variance',
      'self_mirror',
      'random_target_shift',
      'self_sacrifice_gain',
      'construct_create',
    ]);
    const LOCAL_BATTLE_MECHANISM_CONSUMER_BY_LABEL = Object.freeze({
      直接伤害: 'direct_damage',
      多段伤害: 'multi_damage',
      延迟爆发: 'delay_burst',
      持续伤害: 'dot_damage',
      硬控: 'hard_control',
      软控: 'soft_control',
      位移限制: 'position_lock',
      打断: 'interrupt',
      封技: 'skill_seal',
      单属性削弱: 'attribute_debuff',
      多属性削弱: 'attribute_debuff',
      禁疗: 'anti_heal',
      治疗反转: 'heal_inversion',
      消耗提高: 'cost_increase',
      前摇拉长: 'windup_increase',
      掌控压制: 'mastery_reduce',
      速度压制: 'speed_reduce',
      单属性增益: 'attribute_buff',
      多属性增益: 'attribute_buff',
      全属性增益: 'attribute_buff',
      消耗降低: 'cost_reduce',
      前摇缩短: 'windup_reduce',
      掌控提升: 'mastery_raise',
      速度提升: 'speed_raise',
      护盾: 'shield',
      减伤: 'damage_reduce',
      格挡: 'block',
      霸体: 'super_armor',
      免死: 'death_save',
      '免死/锁血': 'death_save',
      无敌金身: 'invincible',
      伤害反射: 'damage_reflect',
      伤害分摊: 'damage_share',
      替身抵消: 'substitute',
      复苏: 'revive',
      体力恢复: 'recover_vit',
      魂力恢复: 'recover_sp',
      精神恢复: 'recover_men',
      持续恢复: 'recover_over_time',
      解控: 'cleanse',
      净化: 'cleanse',
      感知干扰: 'perception_disturb',
      标记锁定: 'judge_effect',
      共享视野: 'shared_vision',
      幻境: 'judge_effect',
      催眠: 'judge_effect',
      认知扭曲: 'judge_effect',
      目标锁定: 'target_lock',
      自身位移: 'self_shift',
      强制位移: 'hostile_shift',
      位移交换: 'position_exchange',
      追击位移: 'pursuit_shift',
      脱离位移: 'disengage_shift',
      追击: 'pursuit_mark',
      分身: 'clone',
      复制: 'copy_status',
      反制: 'counter',
      受击反击: 'on_hit_counter',
      伤害转回复: 'damage_to_heal',
      回复转伤害: 'heal_to_damage',
      状态交换: 'status_exchange',
      状态转移: 'status_transfer',
      '强制绑定/锁定': 'hard_lock',
      条件触发: 'judge_effect',
      高波动随机值: 'self_random_variance',
      随机目标: 'random_target_shift',
      引爆持续伤害: 'dot_detonate',
      斩盾: 'shield_break',
      窃取护盾: 'shield_steal',
      效果反转: 'effect_reverse',
      驱散增益: 'dispel_buff',
      窃取增益: 'steal_buff',
      隐身: 'stealth',
      护卫: 'guard',
      嘲讽: 'taunt',
      破隐: 'reveal',
      减速: 'slow',
      迟缓: 'slow',
      致盲: 'blind',
      沉默: 'silence',
      缴械: 'disarm',
      标记弱点: 'expose_weakness',
      斩杀补伤: 'judge_effect',
      穿透: 'armor_penetration',
      吸血: 'lifesteal',
      流血DOT: 'dot_damage',
      召唤与场地: 'construct_create',
      吞噬: 'resource_drain',
      能力共享: 'resource_refeed',
      机制抹消: 'mechanism_suppress',
    });
    const LOCAL_BATTLE_DEFENSE_NATURE_BY_LABEL = Object.freeze({
      反制: '反制',
      受击反击: '反制',
      免死: '免死',
      '免死/锁血': '免死',
      无敌金身: '无敌',
      复苏: '复苏',
      替身抵消: '替身',
      伤害分摊: '分摊',
      伤害反射: '反射',
      霸体: '霸体',
      护卫: '护卫',
      分身: '分身',
      隐身: '分身',
      格挡: '格挡',
      减伤: '减伤',
      护盾: '护盾',
    });
    const LOCAL_BATTLE_RECOVER_NATURE_BY_LABEL = Object.freeze({
      体力恢复: '体力恢复',
      魂力恢复: '资源回复',
      精神恢复: '资源回复',
      持续恢复: '持续恢复',
      净化: '净化',
      解控: '净化',
      复苏: '复苏',
      能力共享: '资源回复',
    });
    const BATTLE_MECHANISM_SUPPRESSION_TARGET_SET = new Set([
      '复苏',
      '护盾',
      '隐身',
      '增益',
      '防御机制',
      '回复机制',
      '控制机制',
      '特殊规则',
    ]);

    function getFallbackBattleMechanismConsumer(label = '') {
      return String(LOCAL_BATTLE_MECHANISM_CONSUMER_BY_LABEL[String(label || '').trim()] || '').trim();
    }

    function normalizeBattleMechanismSuppressionTargets(value) {
      const source = Array.isArray(value) ? value : [value];
      return Array.from(
        new Set(
          source
            .flatMap(item => String(item || '').split(/[、,，/|｜；;\s]+/g))
            .map(item => String(item || '').trim())
            .filter(item => BATTLE_MECHANISM_SUPPRESSION_TARGET_SET.has(item)),
        ),
      );
    }

    function normalizeBattleMechanismSuppressionMode(value = '') {
      const text = String(value || '').trim();
      return text === '仅封锁后续' ? '仅封锁后续' : '移除并封锁';
    }

    function collectBattleMechanismTagsFromDescriptor(name = '', cond = {}) {
      const tags = [];
      const ce = cond?.战斗效果 || cond?.计算层效果 || {};
      const text = String(name || '').trim();
      if (cond?.类型 === 'buff') tags.push('增益');
      if (
        Number(cond?.shield_value || 0) > 0 ||
        /护盾|屏障|结界/.test(text)
      )
        tags.push('护盾', '防御机制', '增益');
      if (Number(ce.stealth_level || 0) > 0 || /隐身|潜行/.test(text)) tags.push('隐身', '增益');
      if (Number(ce.revive_count || 0) > 0 || /复苏/.test(text)) tags.push('复苏', '回复机制', '防御机制');
      if (
        Number(ce.death_save_count || 0) > 0 ||
        Number(ce.min_hp_floor || 0) > 0 ||
        ce.invincible === true ||
        ce.super_armor === true ||
        Number(ce.block_count || 0) > 0 ||
        Number(ce.substitute_count || 0) > 0 ||
        Number(ce.damage_reduction || 0) > 0 ||
        Number(ce.damage_reflect_ratio || 0) > 0 ||
        Number(ce.damage_share_ratio || 0) > 0
      )
        tags.push('防御机制');
      if (
        Number(ce.final_heal_mult || 1) > 1 ||
        Number(ce.final_heal_bonus || 0) > 0 ||
        Number(ce.sp_gain_ratio || 0) > 0 ||
        Number(ce.men_gain_ratio || 0) > 0 ||
        Number(ce.hot_heal_ratio || 0) > 0 ||
        /回血|治疗|再生|回复|回魂|回精神/.test(text)
      )
        tags.push('回复机制');
      if (
        ce.skip_turn === true ||
        ce.cannot_react === true ||
        ce.skill_seal === true ||
        Number(ce.lock_level || 0) > 0 ||
        Number(ce.reaction_penalty || 0) > 0 ||
        Number(ce.cast_speed_penalty || 0) > 0 ||
        Number(ce.dodge_penalty || 0) > 0 ||
        Number(ce.heal_block_ratio || 0) > 0 ||
        Number(ce.heal_inversion_ratio || 0) > 0 ||
        /封技|沉默|缴械|打断|锁定|禁疗|控制|硬控|软控|减速|迟缓|嘲讽|破隐/.test(text)
      )
        tags.push('控制机制');
      if (
        /分身|复制|状态交换|状态转移|引爆持续伤害|斩盾|窃取护盾|吞噬|能力共享|机制抹消|效果反转|共享视野|护卫/.test(text)
      )
        tags.push('特殊规则');
      return Array.from(new Set(tags));
    }

    function getActiveMechanismSuppressionEntries(targetChar) {
      if (!targetChar?.状态效果) return [];
      return Object.entries(targetChar.状态效果)
        .map(([key, cond]) => ({
          key,
          cond,
          tags: normalizeBattleMechanismSuppressionTargets(cond?.机制抹消目标 || cond?.抹消目标 || []),
          mode: normalizeBattleMechanismSuppressionMode(cond?.机制抹消方式 || cond?.抹消方式 || ''),
        }))
        .filter(entry => entry.tags.length > 0);
    }

    function isMechanismSuppressionBlocking(targetChar, tags = []) {
      const wantedTags = normalizeBattleMechanismSuppressionTargets(tags);
      if (!wantedTags.length) return false;
      return getActiveMechanismSuppressionEntries(targetChar).some(entry => {
        if (!/封锁/.test(entry.mode)) return false;
        return wantedTags.some(tag => entry.tags.includes(tag));
      });
    }

    function removeSuppressedMechanismStates(targetChar, tags = [], options = {}) {
      const wantedTags = normalizeBattleMechanismSuppressionTargets(tags);
      if (!targetChar?.状态效果 || !wantedTags.length) return [];
      const excluded = new Set(Array.isArray(options.excludeKeys) ? options.excludeKeys : []);
      const removed = [];
      Object.entries(targetChar.状态效果).forEach(([key, cond]) => {
        if (excluded.has(key)) return;
        const conditionTags = collectBattleMechanismTagsFromDescriptor(key, cond);
        if (!conditionTags.length) return;
        if (!wantedTags.some(tag => conditionTags.includes(tag))) return;
        delete targetChar.状态效果[key];
        removed.push(key);
        if (targetChar.持续效果) {
          Object.keys(targetChar.持续效果).forEach(sustainKey => {
            if (targetChar.持续效果[sustainKey]?.related_condition === key) delete targetChar.持续效果[sustainKey];
          });
        }
      });
      return removed;
    }

    function inferFallbackBattleMechanismSemantic(label = '') {
      const consumer = getFallbackBattleMechanismConsumer(label);
      if (!consumer) return '';
      if (LOCAL_BATTLE_SELF_ONLY_CONSUMERS.has(consumer)) return '仅自身';
      if (BATTLE_SUPPORT_RUNTIME_CONSUMERS.has(consumer) || BATTLE_DEFENSE_RUNTIME_CONSUMERS.has(consumer)) return '可赋予';
      if (BATTLE_OUTPUT_RUNTIME_CONSUMERS.has(consumer) || BATTLE_CONTROL_RUNTIME_CONSUMERS.has(consumer)) return '敌对';
      return '上下文';
    }

    function buildFallbackBattleMechanismMeta(label = '') {
      const normalizedLabel = String(label || '').trim();
      const consumer = getFallbackBattleMechanismConsumer(normalizedLabel);
      if (!consumer) return null;
      const summaryHints = {};
      const aiRoleTags = [];
      if (BATTLE_OUTPUT_RUNTIME_CONSUMERS.has(consumer)) {
        summaryHints.skillType = '输出';
        summaryHints.mainType = BATTLE_SPECIAL_RULE_RUNTIME_CONSUMERS.has(consumer) ? '特殊规则类' : '伤害类';
        aiRoleTags.push('规则压制型');
      } else if (BATTLE_CONTROL_RUNTIME_CONSUMERS.has(consumer)) {
        summaryHints.skillType = '控制';
        summaryHints.mainType = BATTLE_MOBILITY_RUNTIME_CONSUMERS.has(consumer) ? '位移类' : BATTLE_SPECIAL_RULE_RUNTIME_CONSUMERS.has(consumer) ? '特殊规则类' : '控制类';
        summaryHints.controlStrength = ['hard_control', 'judge_effect'].includes(consumer) && ['硬控', '催眠'].includes(normalizedLabel) ? '硬控' : '软控';
        aiRoleTags.push('规则压制型');
      } else if (BATTLE_DEFENSE_RUNTIME_CONSUMERS.has(consumer)) {
        summaryHints.skillType = '防御';
        summaryHints.mainType = BATTLE_SPECIAL_RULE_RUNTIME_CONSUMERS.has(consumer) ? '特殊规则类' : '防御类';
        aiRoleTags.push('保命型');
      } else if (BATTLE_SUPPORT_RUNTIME_CONSUMERS.has(consumer)) {
        summaryHints.skillType = ['recover_vit', 'recover_sp', 'recover_men', 'recover_over_time', 'cleanse', 'resource_refeed'].includes(consumer) ? '辅助' : '辅助';
        summaryHints.mainType = BATTLE_MOBILITY_RUNTIME_CONSUMERS.has(consumer) ? '位移类' : BATTLE_SPECIAL_RULE_RUNTIME_CONSUMERS.has(consumer) ? '特殊规则类' : ['recover_vit', 'recover_sp', 'recover_men', 'recover_over_time', 'cleanse', 'resource_refeed'].includes(consumer) ? '回复类' : '增益类';
        aiRoleTags.push('团队保护型');
      }
      if (LOCAL_BATTLE_DEFENSE_NATURE_BY_LABEL[normalizedLabel]) summaryHints.defenseNature = LOCAL_BATTLE_DEFENSE_NATURE_BY_LABEL[normalizedLabel];
      if (LOCAL_BATTLE_RECOVER_NATURE_BY_LABEL[normalizedLabel]) summaryHints.recoverNature = LOCAL_BATTLE_RECOVER_NATURE_BY_LABEL[normalizedLabel];
      if (LOCAL_BATTLE_GROUP_GRANTABLE_CONSUMERS.has(consumer) || ['共享视野', '护卫', '伤害分摊'].includes(normalizedLabel))
        summaryHints.cooperation = '高';
      if (BATTLE_TRIGGER_RUNTIME_CONSUMERS.has(consumer)) summaryHints.effectMode = '触发';
      else if (consumer === 'delay_burst') summaryHints.effectMode = '延迟';
      else if (BATTLE_SUSTAIN_RUNTIME_CONSUMERS.has(consumer)) summaryHints.effectMode = '持续';
      else summaryHints.effectMode = '瞬发';
      return {
        运行时消费器: consumer,
        目标语义: inferFallbackBattleMechanismSemantic(normalizedLabel),
        群体赋予: LOCAL_BATTLE_GROUP_GRANTABLE_CONSUMERS.has(consumer),
        仅自身: LOCAL_BATTLE_SELF_ONLY_CONSUMERS.has(consumer),
        决策标签: aiRoleTags,
        摘要提示: summaryHints,
      };
    }

    function hasSkillMechanismSemantic(skill, semanticKey = '') {
      const labels = getSkillMechanismLabels(skill);
      const semanticSet = getBattleMechanismSemanticSet(semanticKey);
      if (semanticSet.size > 0 && labels.some(label => semanticSet.has(label))) return true;
      return labels.some(label => {
        const inferred = inferFallbackBattleMechanismSemantic(label);
        if (!inferred) return false;
        if (semanticKey === '群体赋予') {
          const consumer = getFallbackBattleMechanismConsumer(label);
          return LOCAL_BATTLE_GROUP_GRANTABLE_CONSUMERS.has(consumer);
        }
        return inferred === semanticKey;
      });
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

    function getSkillRuntimeConsumerKeys(skill) {
      return Array.from(
        new Set(
          getSkillMechanismLabels(skill)
            .map(label => String(getBattleSkillMechanismMeta(label)?.运行时消费器 || '').trim())
            .filter(Boolean),
        ),
      );
    }

    function hasBattleSkillRuntimeConsumer(skill, consumerKeys = []) {
      const targetKeys = Array.isArray(consumerKeys) ? consumerKeys : [consumerKeys];
      const keySet = new Set(
        targetKeys
          .map(key => String(key || '').trim())
          .filter(Boolean),
      );
      if (!(keySet.size > 0)) return false;
      return getSkillRuntimeConsumerKeys(skill).some(key => keySet.has(key));
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

    function isBattleSkillDefensiveProfile(skill, context = {}) {
      const skillType = context.skillType || getSkillType(skill);
      const mainType = context.mainType || inferMainTypeFromEffects(skill);
      const summary = context.summary || deriveBattleSummaryFromEffects(skill);
      const 技能来源 = context.技能来源 || getBattleSkillSourceCategory(skill);
      return (
        skillType === '防御' ||
        mainType === '防御类' ||
        summary.防御性质 !== '无' ||
        summary.回复性质 === '复苏' ||
        hasSkillAiRoleTag(skill, '保命型') ||
        hasSkillAiRoleTag(skill, '团队保护型') ||
        (技能来源 === '武魂融合技' && ['防御', '辅助'].includes(skillType))
      );
    }

    function isBattleSkillOffensiveProfile(skill, context = {}) {
      const skillType = context.skillType || getSkillType(skill);
      const mainType = context.mainType || inferMainTypeFromEffects(skill);
      const summary = context.summary || deriveBattleSummaryFromEffects(skill);
      return (
        skillType === '输出' ||
        mainType === '伤害类' ||
        summary.爆发级别 !== '无' ||
        Number(getPrimaryDamageEffect(skill)?.威力倍率 || 0) > 0
      );
    }

    function isBattleSkillControlProfile(skill, context = {}) {
      const mainType = context.mainType || inferMainTypeFromEffects(skill);
      const calc = context.calc || getPrimaryStateCalc(skill);
      const flags = context.flags || getPrimaryStateFlags(skill);
      const summary = context.summary || deriveBattleSummaryFromEffects(skill);
      return (
        mainType === '控制类' ||
        mainType === '削弱类' ||
        hasSkillAiRoleTag(skill, '规则压制型') ||
        summary.控制强度 === '硬控' ||
        summary.控制强度 === '软控' ||
        (skillTargetsEnemySide(skill) && hasSkillMechanismSemantic(skill, '敌对')) ||
        Number(calc.lock_level || 0) > 0 ||
        Number(calc.reaction_penalty || 0) > 0 ||
        Number(calc.cast_speed_penalty || 0) > 0 ||
        Number(calc.dodge_penalty || 0) > 0 ||
        Number(calc.resource_block_ratio || 0) > 0 ||
        flags.includes('硬控')
      );
    }

    function isBattleSkillTeamSupportProfile(skill, context = {}) {
      const skillType = context.skillType || getSkillType(skill);
      const summary = context.summary || deriveBattleSummaryFromEffects(skill);
      const 技能来源 = context.技能来源 || getBattleSkillSourceCategory(skill);
      return (
        skillCanGrantFriendlyMechanism(skill) ||
        summary.协同性 === '高' ||
        summary.回复性质 !== '无' ||
        hasSkillAiRoleTag(skill, '团队保护型') ||
        (技能来源 === '武魂融合技' && ['辅助', '防御'].includes(skillType))
      );
    }

    function 是团队保护技能(skill, context = {}) {
      const summary = context.summary || deriveBattleSummaryFromEffects(skill);
      const 目标模型 = getSkillTargetModel(skill);
      const 防御性质 = String(summary.防御性质 || '无');
      const 友方目标 = ['友方单体', '友方群体', '全场'].includes(目标模型);
      const 团队防御性质 = ['护盾', '减伤', '格挡', '免死', '无敌', '复苏', '替身', '分摊', '护卫'].includes(防御性质);
      return (
        (友方目标 && 团队防御性质) ||
        hasSkillAiRoleTag(skill, '团队保护型') ||
        (友方目标 && hasBattleSkillRuntimeConsumer(skill, ['guard', 'damage_share', 'substitute', 'revive', 'shield', 'damage_reduce', 'death_save', 'invincible']))
      );
    }

    function isBattleSkillAntiHealProfile(skill, context = {}) {
      const summary = context.summary || deriveBattleSummaryFromEffects(skill);
      const calc = context.calc || getPrimaryStateCalc(skill);
      return (
        hasBattleSkillRuntimeConsumer(skill, ['anti_heal', 'heal_inversion']) ||
        summary.控制强度 === '软控' && Number(calc.heal_block_ratio || 0) > 0 ||
        Number(calc.heal_inversion_ratio || 0) > 0
      );
    }

    function isBattleSkillExecuteProfile(skill, context = {}) {
      const summary = context.summary || deriveBattleSummaryFromEffects(skill);
      const damage = context.damage || getPrimaryDamageEffect(skill);
      return (
        hasBattleSkillRuntimeConsumer(skill, ['judge_effect']) ||
        (summary.爆发级别 === '高' && Number(damage?.威力倍率 || 0) >= 180)
      );
    }

    function isBattleSkillShieldBreakProfile(skill, context = {}) {
      const damage = context.damage || getPrimaryDamageEffect(skill);
      return (
        hasBattleSkillRuntimeConsumer(skill, ['shield_break']) ||
        Number(damage?.穿透修饰 || 0) >= 15 ||
        /破甲|穿透|粉碎|斩盾/.test(String(skill?.name || ''))
      );
    }

    function isBattleSkillShieldStealProfile(skill) {
      return hasBattleSkillRuntimeConsumer(skill, ['shield_steal']);
    }

    function isBattleSkillDotDetonateProfile(skill) {
      return hasBattleSkillRuntimeConsumer(skill, ['dot_detonate']);
    }

    function isBattleSkillSealProfile(skill, context = {}) {
      const calc = context.calc || getPrimaryStateCalc(skill);
      return hasBattleSkillRuntimeConsumer(skill, ['skill_seal']) || calc.skill_seal === true;
    }

    function isBattleSkillTransferProfile(skill) {
      return hasBattleSkillRuntimeConsumer(skill, ['status_transfer']);
    }

    function isBattleSkillSharedVisionProfile(skill) {
      return hasBattleSkillRuntimeConsumer(skill, ['shared_vision']);
    }

    function isBattleSkillHealInvertProfile(skill, context = {}) {
      const calc = context.calc || getPrimaryStateCalc(skill);
      return hasBattleSkillRuntimeConsumer(skill, ['heal_inversion']) || Number(calc.heal_inversion_ratio || 0) > 0;
    }

    function isBattleSkillDotPressureProfile(skill) {
      return hasBattleSkillRuntimeConsumer(skill, ['dot_damage']);
    }

    function isBattleSkillRevealProfile(skill) {
      return hasBattleSkillRuntimeConsumer(skill, ['reveal']);
    }

    function isBattleSkillBuffStealProfile(skill) {
      return hasBattleSkillRuntimeConsumer(skill, ['steal_buff']);
    }

    function isBattleSkillTauntProfile(skill) {
      return hasBattleSkillRuntimeConsumer(skill, ['taunt']);
    }

    function isBattleSkillResourceDrainProfile(skill) {
      return hasBattleSkillRuntimeConsumer(skill, ['resource_drain']);
    }

    function isBattleSkillResourceRefeedProfile(skill) {
      return hasBattleSkillRuntimeConsumer(skill, ['resource_refeed']);
    }

    function getBattleSkillMechanismSuppressionTargets(skill) {
      const effect =
        getSkillEffects(skill).find(item => item?.机制 === '机制抹消') ||
        null;
      return normalizeBattleMechanismSuppressionTargets(
        effect?.抹消目标 || effect?.机制抹消目标 || [],
      );
    }

    function isBattleSkillMechanismSuppressProfile(skill) {
      return hasBattleSkillRuntimeConsumer(skill, ['mechanism_suppress']);
    }

    function isBattleSkillReactiveDefenseProfile(skill, context = {}) {
      const summary = context.summary || deriveBattleSummaryFromEffects(skill);
      return (
        isBattleSkillDefensiveProfile(skill, context) ||
        hasSkillAiRoleTag(skill, '保命型') ||
        ['护盾', '减伤', '格挡', '霸体', '免死', '无敌', '复苏', '替身', '分摊', '反射', '护卫'].includes(summary.防御性质)
      );
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
      return ['属性变化', '持续恢复', '消耗提高', '消耗降低', '前摇拉长', '前摇缩短', '掌控修正', '速度修正'].includes(mechanism);
    }

    function isBattleDebuffAttributeEffect(effect) {
      const mechanism = String(effect?.机制 || '').trim();
      const action = String(effect?.动作 || '').trim();
      if (mechanism === '消耗提高' || mechanism === '前摇拉长') return true;
      if (mechanism === '消耗降低' || mechanism === '前摇缩短') return false;
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
      if (hasBattleSkillRuntimeConsumer(skill, [...BATTLE_CONTROL_RUNTIME_CONSUMERS]) || getSkillEffects(skill).some(effect => isBattleDebuffAttributeEffect(effect)))
        return '控制';
      if (hasBattleSkillRuntimeConsumer(skill, [...BATTLE_DEFENSE_RUNTIME_CONSUMERS])) return '防御';
      if (
        skillCanGrantFriendlyMechanism(skill) ||
        hasBattleSkillRuntimeConsumer(skill, [...BATTLE_SUPPORT_RUNTIME_CONSUMERS, ...BATTLE_SPECIAL_RULE_RUNTIME_CONSUMERS]) ||
        getSkillEffects(skill).some(effect => isBattleAttributeSupportEffect(effect))
      )
        return '辅助';
      if (hasBattleSkillRuntimeConsumer(skill, [...BATTLE_OUTPUT_RUNTIME_CONSUMERS]) || Number(getPrimaryDamageEffect(skill)?.威力倍率 || 0) > 0)
        return '输出';
      if (skillTargetsEnemySide(skill) && hasSkillMechanismSemantic(skill, '敌对')) return '控制';
      if (hasSkillAiRoleTag(skill, '团队保护型')) return '辅助';
      if (hasSkillAiRoleTag(skill, '保命型')) return '防御';
      if (hasSkillAiRoleTag(skill, '规则压制型')) return '控制';
      return '无';
    }

    function inferMainTypeFromEffects(skill) {
      const hintedMainType = getSkillSummaryHint(skill, 'mainType', '');
      if (hintedMainType) return hintedMainType;
      if (hasBattleSkillRuntimeConsumer(skill, [...BATTLE_MOBILITY_RUNTIME_CONSUMERS])) return '位移类';
      if (hasBattleSkillRuntimeConsumer(skill, [...BATTLE_SPECIAL_RULE_RUNTIME_CONSUMERS])) return '特殊规则类';
      if (
        hasBattleSkillRuntimeConsumer(skill, [...BATTLE_CONTROL_RUNTIME_CONSUMERS]) ||
        getSkillEffects(skill).some(effect => isBattleDebuffAttributeEffect(effect))
      )
        return '控制类';
      if (hasBattleSkillRuntimeConsumer(skill, [...BATTLE_DEFENSE_RUNTIME_CONSUMERS])) return '防御类';
      if (getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect))) return '回复类';
      if (
        skillCanGrantFriendlyMechanism(skill) ||
        hasBattleSkillRuntimeConsumer(skill, [...BATTLE_SUPPORT_RUNTIME_CONSUMERS]) ||
        getSkillEffects(skill).some(effect => isBattleAttributeSupportEffect(effect))
      )
        return '增益类';
      if (hasBattleSkillRuntimeConsumer(skill, [...BATTLE_OUTPUT_RUNTIME_CONSUMERS]) || Number(getPrimaryDamageEffect(skill)?.威力倍率 || 0) > 0)
        return '伤害类';
      if (skillTargetsEnemySide(skill) && hasSkillMechanismSemantic(skill, '敌对')) return '控制类';
      return '无';
    }

    function deriveBattleSummaryFromEffects(skill, baseSummary = {}) {
      const defaultSummary = createEmptyBattleSummary();
      const summary = { ...defaultSummary, ...(baseSummary || {}) };
      const systemBase = getSystemBaseEffect(skill);
      const runtimeMeta = getSkillRuntimeMeta(skill);
      const 技能来源 = String(runtimeMeta.技能来源 || '魂技').trim() || '魂技';
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
      if (技能来源 === '武魂融合技') summary.风险等级 = '高';
      else if (技能来源 === '自创魂技' && ['逆演归一', '阴阳合璧', '元素硬控'].includes(structureMode))
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
        else if (hasBattleSkillRuntimeConsumer(skill, ['counter', 'on_hit_counter'])) summary.防御性质 = '反制';
        else if (hasBattleSkillRuntimeConsumer(skill, ['death_save'])) summary.防御性质 = '免死';
        else if (hasBattleSkillRuntimeConsumer(skill, ['invincible'])) summary.防御性质 = '无敌';
        else if (hasBattleSkillRuntimeConsumer(skill, ['revive'])) summary.防御性质 = '复苏';
        else if (hasBattleSkillRuntimeConsumer(skill, ['substitute'])) summary.防御性质 = '替身';
        else if (hasBattleSkillRuntimeConsumer(skill, ['damage_share'])) summary.防御性质 = '分摊';
        else if (hasBattleSkillRuntimeConsumer(skill, ['damage_reflect'])) summary.防御性质 = '反射';
        else if (hasBattleSkillRuntimeConsumer(skill, ['super_armor'])) summary.防御性质 = '霸体';
        else if (hasBattleSkillRuntimeConsumer(skill, ['guard'])) summary.防御性质 = '护卫';
        else if (hasBattleSkillRuntimeConsumer(skill, ['clone', 'stealth'])) summary.防御性质 = '分身';
        else if (hasBattleSkillRuntimeConsumer(skill, ['block'])) summary.防御性质 = '格挡';
        else if (hasBattleSkillRuntimeConsumer(skill, ['damage_reduce'])) summary.防御性质 = '减伤';
        else if (hasBattleSkillRuntimeConsumer(skill, ['shield'])) summary.防御性质 = '护盾';
      }
      if (!summary.回复性质 || summary.回复性质 === '无') {
        if (hintedRecoverNature) summary.回复性质 = hintedRecoverNature;
        else if (getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect, ['vit'])))
          summary.回复性质 = '体力恢复';
        else if (getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect, ['sp', 'men'])))
          summary.回复性质 = '资源回复';
        else if (hasBattleSkillRuntimeConsumer(skill, ['revive'])) summary.回复性质 = '复苏';
      }
      if (!summary.控制强度 || summary.控制强度 === '无') {
        if (hintedControlStrength) summary.控制强度 = hintedControlStrength;
        else if (hasBattleSkillRuntimeConsumer(skill, ['hard_control']) || stateCalc.skip_turn === true) summary.控制强度 = '硬控';
        else if (
          isBattleSkillControlProfile(skill, { calc: stateCalc, summary }) ||
          getSkillEffects(skill).some(effect => isBattleDebuffAttributeEffect(effect)) ||
          hasBattleSkillRuntimeConsumer(skill, ['soft_control', 'position_lock', 'interrupt', 'skill_seal', 'anti_heal', 'heal_inversion'])
        )
          summary.控制强度 = '软控';
      }
      if (!baseSummary?.协同性 || baseSummary.协同性 === defaultSummary.协同性 || baseSummary.协同性 === '无') {
        if (hintedCooperation) summary.协同性 = hintedCooperation;
        else if (
          targetText === '全场' ||
          targetText.includes('群体') ||
          isBattleSkillSharedVisionProfile(skill) ||
          hasBattleSkillRuntimeConsumer(skill, ['target_lock', 'construct_create', 'dispel_buff']) ||
          (hasFriendlyGrantable && summary.目标规模 !== '单体')
        )
          summary.协同性 = '高';
        else if (
          targetText.includes('己方') ||
          targetText.includes('友方') ||
          hasFriendlyGrantable ||
          getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect)) ||
          ['分身', '护卫'].includes(summary.防御性质) ||
          hasBattleSkillRuntimeConsumer(skill, ['stealth'])
        )
          summary.协同性 = '中';
        else summary.协同性 = '低';
      }
      if (技能来源 === '武魂融合技' && summary.协同性 === '低') summary.协同性 = '高';
      if (!baseSummary?.生效方式 || baseSummary.生效方式 === defaultSummary.生效方式 || baseSummary.生效方式 === '无') {
        if (hintedEffectMode) summary.生效方式 = hintedEffectMode;
        else if (hasBattleSkillRuntimeConsumer(skill, [...BATTLE_TRIGGER_RUNTIME_CONSUMERS])) summary.生效方式 = '触发';
        else if (hasBattleSkillRuntimeConsumer(skill, ['delay_burst'])) summary.生效方式 = '延迟';
        else if (
          duration > 1 ||
          hasBattleSkillRuntimeConsumer(skill, [...BATTLE_SUSTAIN_RUNTIME_CONSUMERS])
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
        else if (hasBattleSkillRuntimeConsumer(skill, [...BATTLE_SUSTAIN_RUNTIME_CONSUMERS, 'construct_create']))
          summary.持续性 = '中';
        else summary.持续性 = '无';
      }
      if (!baseSummary?.保留倾向 || Number(baseSummary.保留倾向 || 0) === Number(defaultSummary.保留倾向 || 0)) {
        let reserve = 0;
        if (/真身|武魂融合技|生命之火|第八魂技|第九魂技/.test(skillName)) reserve += 35;
        if (power >= 280) reserve += 20;
        if (Number(runtimeMeta.cast_time || 0) >= 25) reserve += 15;
        if (
          hasBattleSkillRuntimeConsumer(skill, ['death_save', 'block', 'counter', 'on_hit_counter', 'effect_reverse', 'self_random_variance']) ||
          summary.生效方式 === '触发'
        )
          reserve += 10;
        if (/维持|启动\)/.test(costText)) reserve += 10;
        summary.保留倾向 = Math.min(90, reserve);
      }
      if (技能来源 === '武魂融合技') summary.保留倾向 = Math.max(summary.保留倾向, 75);
      else if (技能来源 === '自创魂技') summary.保留倾向 = Math.max(summary.保留倾向, 28);
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
      const suppressionEntries = getActiveMechanismSuppressionEntries(entity);
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
        hasMechanismSuppression: suppressionEntries.length > 0,
        suppressedMechanisms: Array.from(new Set(suppressionEntries.flatMap(entry => entry.tags))),
      };
    }

    function getStealthConditionEntries(targetChar) {
      if (!targetChar?.状态效果) return [];
      if (isMechanismSuppressionBlocking(targetChar, ['隐身', '增益'])) return [];
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
        hasBattleSkillRuntimeConsumer(skill, ['shared_vision', 'target_lock', 'reveal'])
      );
    }

    function resolveGuardRedirectTarget(initialTarget, allyTeam = []) {
      if (!initialTarget?.状态效果) return null;
      const 护卫状态列表 = Object.entries(initialTarget.状态效果).filter(([, cond]) =>
        cond &&
        typeof cond === 'object' &&
        String(cond?.类型 || '') === 'buff' &&
        String(cond?.护卫者名 || '').trim(),
      );
      for (const [状态名, 护卫状态] of 护卫状态列表) {
        const 护卫者名 = String(护卫状态?.护卫者名 || '').trim();
        const 剩余次数 = 护卫状态?.护卫剩余次数 === undefined ? Infinity : Number(护卫状态.护卫剩余次数 || 0);
        if (!护卫者名 || !(剩余次数 > 0)) continue;
        const 护卫者 = (allyTeam || []).find(
          unit =>
            unit &&
            unit.name !== initialTarget.name &&
            isCombatUnitAbleToFight(unit) &&
            isCombatUnitIdentityMatch(unit, 护卫者名),
        );
        if (!护卫者) continue;
        if (Number.isFinite(剩余次数)) {
          护卫状态.护卫剩余次数 = Math.max(0, 剩余次数 - 1);
          if (护卫状态.护卫剩余次数 <= 0 && /普防护援/.test(状态名)) delete initialTarget.状态效果[状态名];
        }
        return 护卫者;
      }
      return null;
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
      source.HP上限 = Math.max(1, Number.isFinite(Number(source.HP上限)) ? Number(source.HP上限) : 1);
      source.HP = Math.max(
        0,
        Math.min(
          source.HP上限,
          Number.isFinite(Number(source.HP)) ? Number(source.HP) : source.HP上限,
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
        Object.defineProperty(target, 'hp', {
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
        Object.defineProperty(target, 'hp_max', {
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
        Object.defineProperty(target, 'vit', {
          configurable: true,
          enumerable: true,
          get() {
            return source.体力;
          },
          set(value) {
            source.体力 = Math.max(0, Math.min(Number(source.体力上限 || 1), Number(value || 0)));
          },
        });
        Object.defineProperty(target, 'vit_max', {
          configurable: true,
          enumerable: true,
          get() {
            return source.体力上限;
          },
          set(value) {
            source.体力上限 = Math.max(1, Number(value || 1));
            source.体力 = Math.max(0, Math.min(source.体力上限, Number(source.体力 || 0)));
          },
        });
      } catch (error) {
        target.hp = source.HP;
        target.hp_max = source.HP上限;
        target.vit = source.体力;
        target.vit_max = source.体力上限;
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
      normalized.技能来源 = String(normalized.技能来源 || normalized.source_tag || '魂技').trim() || '魂技';
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
        existingSystemBase.技能来源 = String(existingSystemBase.技能来源 || normalized.技能来源 || normalized.source_tag || '魂技').trim() || '魂技';
        existingSystemBase.技能类型 = String(existingSystemBase.技能类型 || normalized.技能类型 || '无').trim() || '无';
        const runtimeTargetModel = normalizeBattleSkillTargetModel(
          existingSystemBase.目标模型 || normalized.目标模型 || '敌方单体',
          '敌方单体',
        );
        existingSystemBase.目标模型 = runtimeTargetModel;
        existingSystemBase.结算策略 = String(
          existingSystemBase.结算策略 || deriveBattleTargetResolutionStrategy(runtimeTargetModel),
        ).trim() || '单目标独立';
        existingSystemBase.cast_time = Number(existingSystemBase.cast_time ?? normalized.cast_time ?? 0) || 0;
        existingSystemBase.消耗 =
          existingSystemBase.消耗 === undefined
            ? normalized.消耗 || '无'
            : typeof existingSystemBase.消耗 === 'object'
              ? formatCostObjectToString(existingSystemBase.消耗)
              : String(existingSystemBase.消耗 || '无').trim() || '无';
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
        const 注入目标模型 = normalizeBattleSkillTargetModel(
          normalized.对象 || explicitSemanticTarget || '敌方单体',
          '敌方单体',
        );
        normalized._效果数组.unshift({
          机制: '系统基础',
          技能来源: normalized.技能来源 || normalized.source_tag || '魂技',
          消耗: normalized.消耗 || '无',
          对象: normalized.对象 || mapBattleTargetModelToCombatTarget(注入目标模型),
          目标模型: 注入目标模型,
          结算策略: deriveBattleTargetResolutionStrategy(注入目标模型),
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

    function 读取融合相关度总分(charData = {}, fusionSkill = {}) {
      if (getFusionSkillMode(fusionSkill) === 'self') return 100;
      const partnerNames = getFusionSkillPartnerNames(fusionSkill);
      if (!partnerNames.length) return 0;
      const relationMap = charData?.社交?.关系 && typeof charData.社交.关系 === 'object' ? charData.社交.关系 : {};
      const scores = partnerNames.map(name => {
        const rel = relationMap[name];
        const base = Number(rel?.武魂相关度基础);
        const 基础分 = Number.isFinite(base) ? Math.max(0, Math.min(100, Math.floor(base))) : 0;
        const favor = Number(rel?.好感度 ?? 0);
        const 关系加成 = Number.isFinite(favor) ? Math.max(0, Math.min(20, Math.floor(Math.max(0, favor) / 10))) : 0;
        return Math.max(0, Math.min(100, 基础分 + 关系加成));
      });
      if (!scores.length) return 0;
      return Math.max(0, Math.min(100, Math.floor(Math.min(...scores))));
    }

    function 计算融合相关度倍率(相关度总分 = 100) {
      const 安全总分 = Math.max(0, Math.min(100, Number(相关度总分 || 0)));
      if (安全总分 < 70) return 0.9;
      const 进度 = (安全总分 - 70) / 30;
      return Number((1 + Math.max(0, Math.min(1, 进度)) * 0.25).toFixed(4));
    }

    function 获取融合技能可用性(charData, fusionSkill, alliedTeam = []) {
      if (!fusionSkill?.技能数据 || fusionSkill?.技能数据?.状态 === '未生成') {
        return { 可用: false, 原因: '融合技能未完成生成', 相关度总分: 0 };
      }
      if (getFusionSkillMode(fusionSkill) === 'self') {
        const slots = getFusionSkillSourceSpirits(fusionSkill);
        const 可用 = slots.length >= 2 && slots.every(slot => hasUsableSpiritSlot(charData, slot));
        return { 可用, 原因: 可用 ? '' : '自体融合缺少双武魂槽位', 相关度总分: 100 };
      }
      const partnerNames = getFusionSkillPartnerNames(fusionSkill);
      if (!partnerNames.length) return { 可用: false, 原因: '未配置融合对象', 相关度总分: 0 };
      const 搭档到位 = partnerNames.every(partnerName =>
        (alliedTeam || []).some(unit => isCombatUnitIdentityMatch(unit, partnerName) && isCombatUnitAbleToFight(unit)),
      );
      if (!搭档到位) {
        return { 可用: false, 原因: `搭档[${partnerNames.join('、')}]未到位`, 相关度总分: 0 };
      }
      const 相关度总分 = 读取融合相关度总分(charData || {}, fusionSkill || {});
      if (相关度总分 < 70) {
        return { 可用: false, 原因: `武魂相关度不足(${相关度总分}/70)`, 相关度总分 };
      }
      return { 可用: true, 原因: '', 相关度总分 };
    }

    function buildFusionBattleProfile(mode = 'partner', partnerCount = 1, 相关度总分 = 100) {
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
          相关度总分: 100,
          相关度倍率: 1,
        };
      }
      const 相关度倍率 = 计算融合相关度倍率(相关度总分);
      return {
        mode: safeMode,
        partnerCount: safePartnerCount,
        actorCostScale: 1.1,
        partnerPoolScale: 0.6,
        castTimeScale: 1.15,
        damageMult: (1.65 + multiPartnerBonus) * 相关度倍率,
        recoverMult: (1.5 + multiPartnerBonus * 0.6) * 相关度倍率,
        shieldMult: (1.5 + multiPartnerBonus * 0.6) * 相关度倍率,
        stateScale: (1.42 + multiPartnerBonus * 0.5) * 相关度倍率,
        controlScale: (1.5 + multiPartnerBonus * 0.6) * 相关度倍率,
        aftermathDuration: 2,
        aftermathPanelScale: 0.82,
        aftermathDamageMult: 0.82,
        aftermathHealMult: 0.82,
        aftermathShieldMult: 0.82,
        aftermathCastPenalty: 0.35,
        aftermathDodgePenalty: 0.12,
        aftermathReactionPenalty: 0.12,
        aftermathResourceBlock: 0.22,
        相关度总分: Math.max(0, Math.min(100, Math.floor(Number(相关度总分 || 0)))),
        相关度倍率,
      };
    }

    function getFusionBattleProfileFromSkill(skill = {}) {
      return skill?.__fusion_profile && typeof skill.__fusion_profile === 'object' ? skill.__fusion_profile : null;
    }

    function buildFusionCombatSkill(fusionSkill = {}, fusionName = '武魂融合技', charData = null) {
      const skill = normalizeSkillData(fusionSkill?.技能数据, `武魂融合技·${fusionName}`);
      const mode = getFusionSkillMode(fusionSkill);
      const partnerNames = getFusionSkillPartnerNames(fusionSkill);
      const 相关度总分 = mode === 'self' ? 100 : 读取融合相关度总分(charData || {}, fusionSkill || {});
      const profile = buildFusionBattleProfile(mode, partnerNames.length || 1, 相关度总分);
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
        systemBase.技能来源 = '武魂融合技';
        systemBase.消耗 = actorCostText;
        systemBase.cast_time = nextCastTime;
      }
      skill.技能来源 = '武魂融合技';
      skill.消耗 = actorCostText;
      skill.cast_time = nextCastTime;
      skill.source_tag = '武魂融合技';
      skill.__融合模式 = mode;
      skill.__融合对象 = partnerNames.length ? partnerNames.join('、') : '无';
      skill.__fusion_profile = { ...profile, partnerNames: [...partnerNames] };
      skill.__fusion_partner_names = [...partnerNames];
      skill.__fusion_partner_cost_text = partnerCostText;
      skill.__融合相关度总分 = Number(profile?.相关度总分 || 0);
      skill.__融合相关度倍率 = Number(profile?.相关度倍率 || 1);
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
      return !!获取融合技能可用性(charData, fusionSkill, alliedTeam).可用;
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
      const statusCostScale = 获取施法消耗倍率(char);
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
      const reqSp = Math.floor(rawReqSp * costScale * statusCostScale);
      const hpRatio =
        Math.max(0, Number(stats.hp ?? stats.HP ?? 0)) /
        Math.max(1, Number(stats.hp_max ?? stats.HP上限 ?? 1));
      const staminaCostScale = hpRatio <= 0.2 ? 2 : 1;
      const reqVit = Math.floor(rawReqVit * costScale * statusCostScale * staminaCostScale);
      const reqMen = Math.floor(rawReqMen * costScale * statusCostScale);
      const selfCanCast =
        ((stats.sp ?? stats.魂力) || 0) >= reqSp &&
        ((stats.sta ?? stats.体力 ?? stats.vit) || 0) >= reqVit &&
        ((stats.men ?? stats.精神力) || 0) >= reqMen;
      const fusionProfile = getFusionBattleProfileFromSkill(skill);
      const result = {
        reqSp,
        reqVit,
        reqMen,
        costScale: costScale * statusCostScale,
        canCast: selfCanCast,
        failureReason: selfCanCast ? '' : '自身状态不足',
        partnerCosts: [],
      };
      if (String(skill?.source_tag || skill?.技能来源 || '').trim() === '武魂融合技' && skill?.__融合可用 === false) {
        result.canCast = false;
        result.failureReason = String(skill?.__融合不可用原因 || '').trim() || '武魂融合技条件不足';
        return result;
      }
      if (!fusionProfile || fusionProfile.mode !== 'partner') return result;

      const 融合同队列表 = Array.isArray(skill?.__融合队友列表) ? skill.__融合队友列表 : [];
      const partnerUnits = resolveFusionPartnerUnitsForSkill(skill, 融合同队列表, null, char);
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
      const 展开技能分支候选 = skill => {
        const 原技能 = skill && typeof skill === 'object' ? skill : null;
        if (!原技能) return [];
        const 原始效果列表 = Array.isArray(原技能._效果数组) ? 原技能._效果数组 : [];
        const 分支列表 = Array.from(new Set(
          原始效果列表
            .map(effect => String(effect?.分支标记 || '').trim())
            .filter(Boolean),
        ));
        if (!分支列表.length) return [原技能];
        const 基础名称 = String(原技能.name || 原技能.魂技名 || 原技能.技能名称 || '未命名技能').trim() || '未命名技能';
        return 分支列表.map(分支标记 => {
          const 克隆技能 = deepClonePlain(原技能);
          克隆技能._runtime_分支标记 = 分支标记;
          克隆技能._runtime_分支展示名 = `${基础名称}·${分支标记}`;
          克隆技能.name = `${基础名称}·${分支标记}`;
          克隆技能.魂技名 = 克隆技能.name;
          return 克隆技能;
        });
      };
      Object.entries(skillMap || {}).forEach(([skillName, skillData]) => {
        if (!skillData || skillData?.状态 === '未生成') return;
        const 标准技能 = normalizeSkillData(skillData, skillName);
        const 分支候选列表 = 展开技能分支候选(标准技能);
        分支候选列表.forEach(候选技能 => {
          const 是否被动 = isPassiveSkillData(候选技能);
          if (是否被动 && !includePassive) return;
          if (!是否被动 && !includeActive) return;
          候选技能.source_tag = sourceTag;
          skills.push(候选技能);
        });
      });
    }

    function collectUnifiedSkillEntries(charData, alliedTeam = [], options = {}) {
      const skills = [];
      const collectOptions = {
        includePassive: !!options.includePassive,
        includeActive: options.includeActive !== false,
        includeUnavailableFusion: !!options.includeUnavailableFusion,
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

      pushUnifiedSkillMapEntries(skills, charData?.自创魂技 || {}, '自创魂技', collectOptions);

      Object.entries(charData?.武魂融合技 || {}).forEach(([fusionName, fusionSkill]) => {
        const 融合可用性 = 获取融合技能可用性(charData, fusionSkill, alliedTeam);
        if (!融合可用性.可用 && !collectOptions.includeUnavailableFusion) return;
        const nSkill = buildFusionCombatSkill(fusionSkill, fusionName, charData);
        const 原始效果列表 = Array.isArray(nSkill?._效果数组) ? nSkill._效果数组 : [];
        const 分支列表 = Array.from(new Set(原始效果列表.map(effect => String(effect?.分支标记 || '').trim()).filter(Boolean)));
        const 候选技能列表 = 分支列表.length
          ? 分支列表.map(branchId => {
              const 克隆技能 = deepClonePlain(nSkill);
              const 基础名称 = String(克隆技能.name || 克隆技能.魂技名 || fusionName).trim() || fusionName;
              克隆技能._runtime_分支标记 = branchId;
              克隆技能._runtime_分支展示名 = `${基础名称}·${branchId}`;
              克隆技能.name = `${基础名称}·${branchId}`;
              克隆技能.魂技名 = 克隆技能.name;
              return 克隆技能;
            })
          : [nSkill];
        候选技能列表.forEach(技能项 => {
          技能项.__融合可用 = !!融合可用性.可用;
          技能项.__融合不可用原因 = String(融合可用性.原因 || '');
          技能项.__融合相关度总分 = Number(融合可用性.相关度总分 || 技能项.__融合相关度总分 || 0);
          技能项.__融合队友列表 = Array.isArray(alliedTeam) ? alliedTeam : [];
          const 是否被动 = isPassiveSkillData(技能项);
          if (是否被动 && !collectOptions.includePassive) return;
          if (!是否被动 && !collectOptions.includeActive) return;
          skills.push(技能项);
        });
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
          cost_ratio: stateModule.计算层效果?.cost_ratio ?? 1.0,
          windup_ratio: stateModule.计算层效果?.windup_ratio ?? 1.0,
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
      const baseTargetScale = normalizeBattleSkillTargetScale(
        effect?.目标规模 || runtimeMeta?.目标规模 || '',
        deriveBattleSkillTargetScaleFromModel(effect?.目标模型 || runtimeMeta.目标模型 || '敌方单体'),
      );
      const explicitTargetText = String(effect?.目标覆盖 || effect?.目标 || effect?.对象 || '').trim();
      let baseTargetModel = explicitTargetText
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
        targetScale: baseTargetScale,
        directionId: '',
        directionSemantic: '上下文',
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
          const sideEffects = normalizeBattleSkillSideEffectList(cond.副作用列表 || []);
          let dot = Math.max(0, combatEffects.dot_damage || 0);
          let hotHealRatio = Math.max(0, Number(combatEffects.hot_heal_ratio || 0));
          if (dot > 0) {
            设置战斗血量值(char, getCombatHpValue(char) - dot);
            totalDot += dot;
            parts.push(`[状态结算] ${label}受[${key}]影响，额外损失 ${dot} 点HP`);
          }
          if (hotHealRatio > 0) {
            if (isMechanismSuppressionBlocking(char, ['回复机制'])) {
              parts.push(`[机制抹消] ${label}的回复回路被封锁，[${key}]未能提供恢复。`);
              hotHealRatio = 0;
            }
          }
          if (hotHealRatio > 0) {
            const maxVit = getCombatHpMaxValue(char);
            const hotHeal = Math.floor(maxVit * hotHealRatio);
            const healInvertRatio = Math.max(0, Number(combatEffects.heal_inversion_ratio || 0));
            if (healInvertRatio > 0) {
              const invertedDamage = Math.max(1, Math.floor(hotHeal * Math.max(1, healInvertRatio)));
              设置战斗血量值(char, getCombatHpValue(char) - invertedDamage);
              if (invertedDamage > 0) parts.push(`[状态结算] ${label}的[${key}]治疗被反转，反而损失 ${invertedDamage} 点HP`);
            } else {
              设置战斗血量值(char, Math.min(maxVit, getCombatHpValue(char) + hotHeal));
              if (hotHeal > 0) parts.push(`[状态结算] ${label}受[${key}]影响，额外恢复 ${hotHeal} 点HP`);
            }
          }
          if (getCombatHpValue(char) <= 0) {
            const reviveLog = triggerReviveEffect(char, label);
            if (reviveLog) parts.push(reviveLog);
          }

          sideEffects
            .filter(item => String(item?.触发时机 || '').trim() === '回合结束时')
            .forEach(item => {
              const boundState = String(item?.关联状态 || '').trim();
              if (boundState && boundState !== key) return;
              applyBattleSideEffectState(char, item, key, parts);
            });

          if (typeof cond.duration === 'number') {
            cond.duration -= 1;
            if (cond.duration <= 0) expired.push(key);
          }
        });

        expired.forEach(key => {
          const expiredCond = conditionMap[key];
          const endSideEffects = normalizeBattleSkillSideEffectList(expiredCond?.副作用列表 || []);
          endSideEffects
            .filter(item => String(item?.触发时机 || '').trim() === '状态结束后')
            .forEach(item => {
              const boundState = String(item?.关联状态 || '').trim();
              if (boundState && boundState !== key) return;
              applyBattleSideEffectState(char, item, key, parts);
            });
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

        const 禁用本回合自然恢复 = char.__禁用本回合自然恢复 === true;
        if (char.__禁用本回合自然恢复 !== undefined) delete char.__禁用本回合自然恢复;

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
        if (!禁用本回合自然恢复 && maxSp > 0 && naturalSpRatio > 0 && resourceBlockRatio < 1) {
          const beforeSp = Math.max(0, Number(char.sp || 0));
          const recoverSp = Math.max(0, Math.floor(maxSp * naturalSpRatio * (1 - resourceBlockRatio)));
          char.sp = Math.min(maxSp, beforeSp + recoverSp);
          const actualRecoverSp = Math.max(0, Number(char.sp || 0) - beforeSp);
          if (actualRecoverSp > 0) parts.push(`[自然恢复] ${label}回合末恢复 ${actualRecoverSp} 点魂力`);
        }
        if (!禁用本回合自然恢复 && maxMen > 0 && naturalMenRatio > 0 && resourceBlockRatio < 1) {
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

      const 行为经验随机缓存 = new WeakMap();

      function 计算行为等级分(角色 = {}) {
        const 等级 = getCombatUnitTierNumber(角色);
        if (等级 >= 99) return 50;
        if (等级 >= 95) return 45;
        if (等级 >= 90) return 40;
        if (等级 >= 80) return 35;
        if (等级 >= 70) return 30;
        if (等级 >= 60) return 25;
        if (等级 >= 50) return 20;
        if (等级 >= 40) return 15;
        if (等级 >= 30) return 10;
        if (等级 >= 20) return 5;
        return 0;
      }

      function 计算行为天赋分(角色 = {}) {
        const 属性 = 角色?.属性 && typeof 角色.属性 === 'object' ? 角色.属性 : 角色 || {};
        const 天赋梯队 = String(属性.天赋梯队 || 角色.天赋梯队 || '').trim() || '正常';
        const 天赋分表 = {
          绝世妖孽: 50,
          顶级天才: 40,
          天才: 30,
          优秀: 20,
          正常: 10,
          劣等: 0,
          天赋极差: -10,
        };
        return Object.prototype.hasOwnProperty.call(天赋分表, 天赋梯队) ? 天赋分表[天赋梯队] : 10;
      }

      function 是玩家操控角色(角色 = {}, 战斗数据 = {}) {
        const 角色名 = String(角色?.name || 角色?.名称 || '').trim();
        const 系统玩家名 = String(window.BattleUIBridge?.getMVU?.('sys.玩家名') || '').trim();
        const 参战玩家名 = String(战斗数据?.参战者?.player?.name || 战斗数据?.参战者?.player?.名称 || '').trim();
        if (!角色名) return false;
        if (系统玩家名) return 角色名 === 系统玩家名;
        return !!参战玩家名 && 角色名 === 参战玩家名;
      }

      function 读取行为战斗记录次数(角色 = {}, 目标 = {}, 战斗数据 = {}) {
        const 目标名 = String(目标?.name || 目标?.名称 || '').trim();
        if (!目标名) return 0;
        const 角色历史 = 角色?.战斗历史 && typeof 角色.战斗历史 === 'object' ? 角色.战斗历史 : {};
        const 角色历史次数 = Math.max(0, Number(角色历史?.[目标名]?.次数 || 0));
        const 图鉴 = window.BattleUIBridge?.getMVU?.('world.图鉴') || {};
        const 图鉴条目 = 图鉴 && typeof 图鉴 === 'object' ? 图鉴[目标名] : null;
        const 图鉴次数 = 是玩家操控角色(角色, 战斗数据)
          ? Math.max(0, Number(图鉴条目?.战斗样本数 ?? 图鉴条目?.交手次数 ?? 0))
          : 0;
        return Math.max(角色历史次数, 图鉴次数);
      }

      function 读取行为随机经验值(角色 = {}) {
        if (!角色 || typeof 角色 !== 'object') return Math.floor(Math.random() * 40) + 1;
        if (!行为经验随机缓存.has(角色)) 行为经验随机缓存.set(角色, Math.floor(Math.random() * 40) + 1);
        return 行为经验随机缓存.get(角色);
      }

      function 计算行为战斗经验(角色 = {}, 目标 = {}, 战斗数据 = {}) {
        const 记录分 = Math.min(40, 读取行为战斗记录次数(角色, 目标, 战斗数据) * 0.5);
        const 玩家操控 = 是玩家操控角色(角色, 战斗数据);
        const 随机分 = 玩家操控 ? 0 : 读取行为随机经验值(角色);
        const 基础经验分 = 玩家操控 ? 记录分 : Math.min(40, 随机分 + 记录分);
        const 天赋分 = 计算行为天赋分(角色);
        const 等级分 = 计算行为等级分(角色);
        const 总分 = 基础经验分 + 天赋分 + 等级分;
        const 稳定度 = 限制行为概率(总分 / 140, 0, 1);
        return {
          基础经验分,
          随机分,
          记录分,
          天赋分,
          等级分,
          总分,
          稳定度,
          玩家操控,
        };
      }

      function 获取行为经验稳定度(战斗状态 = {}) {
        const 稳定度 = Number(战斗状态?.战斗经验?.稳定度 ?? 战斗状态?.经验稳定度 ?? 0.45);
        return 限制行为概率(稳定度, 0, 1);
      }

      function 应用行为经验误判(权重 = 0, 战斗状态 = {}) {
        const 原权重 = Number(权重 || 0);
        if (!(原权重 > 0)) return 0;
        const 稳定度 = 获取行为经验稳定度(战斗状态);
        const 回归系数 = 0.72 + 稳定度 * 0.28;
        const 平滑权重 = 45 + (原权重 - 45) * 回归系数;
        const 随机幅度 = Math.round((1 - 稳定度) * 26);
        const 误判 = 随机幅度 > 0 ? Math.floor(Math.random() * (随机幅度 * 2 + 1)) - 随机幅度 : 0;
        return Math.max(0, Math.floor(平滑权重 + 误判));
      }

      function 计算行为实力差距(强方 = {}, 弱方 = {}) {
        const 强方等级 = getCombatUnitTierNumber(强方);
        const 弱方等级 = getCombatUnitTierNumber(弱方);
        const 等级差 = Math.max(0, 强方等级 - 弱方等级) / 100;
        const 强方属性 = 强方?.final || buildCombatFinalStats(强方);
        const 弱方属性 = 弱方?.final || buildCombatFinalStats(弱方);
        const 强方总值 =
          Number(强方属性.str || 强方.str || 0) +
          Number(强方属性.def || 强方.def || 0) +
          Number(强方属性.agi || 强方.agi || 0) +
          Number(强方属性.sp_max || 强方.sp_max || 0) * 0.15 +
          Number(强方属性.men_max || 强方.men_max || 0) * 0.3;
        const 弱方总值 =
          Number(弱方属性.str || 弱方.str || 0) +
          Number(弱方属性.def || 弱方.def || 0) +
          Number(弱方属性.agi || 弱方.agi || 0) +
          Number(弱方属性.sp_max || 弱方.sp_max || 0) * 0.15 +
          Number(弱方属性.men_max || 弱方.men_max || 0) * 0.3;
        const 面板差 = Math.max(0, 强方总值 - 弱方总值) / Math.max(1, 强方总值);
        return 限制行为概率(等级差 * 0.65 + 面板差 * 0.35, 0, 1);
      }

      function 判定行为绝境换伤窗口(防反方, 攻击方, 战斗数据 = {}, 预计伤害 = 0) {
        const 战斗类型 = String(战斗数据?.战斗类型 || '').trim();
        const 是虚拟战 = /虚拟|升灵台|模拟/.test(战斗类型);
        if (是虚拟战) return false;
        const 是生死战 = /死战|生死|突发遭遇|伏击|追杀/.test(战斗类型 || '突发遭遇');
        const 允许撤离 = 战斗数据?.允许撤离 !== false;
        if (!是生死战 || 允许撤离) return false;
        const 承伤比 = Math.max(0, Number(预计伤害 || 0)) / Math.max(1, getCombatHpMaxValue(防反方));
        const 实力差距 = 计算行为实力差距(攻击方, 防反方);
        return 实力差距 >= 0.28 && 承伤比 >= 0.22;
      }

      function getBehaviorProfile(actor, target, battleState = {}) {
          const hpRatio = getCombatHpRatio(actor);
          const targetHpRatio = getCombatHpRatio(target);
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
          else if (branchName === '护援队友') weight += profile.caution * 0.8 + profile.control * 0.35 - profile.aggression * 0.15;
          else if (branchName === '强势对轰')
            weight += profile.aggression * 0.9 + profile.burst * 0.5 + profile.finisher * 0.5 - profile.caution * 0.3;
          else if (branchName === '伺机闪避') weight += profile.mobility * 0.9 + profile.caution * 0.4;
          else if (branchName === '肉体兜底') weight += profile.caution * 0.2;

          const 稳定度 = 获取行为经验稳定度(battleState);
          const 随机幅度 = Math.max(2, Math.round(3 + (1 - 稳定度) * 18));
          weight += Math.floor(Math.random() * (随机幅度 * 2 + 1)) - 随机幅度;
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
          if (!target || getCombatHpValue(target) <= 0) {
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

          const targetHpRatio = getCombatHpRatio(target);
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
          if (branchName === '亡命奔逃' && getCombatHpRatio(actor) > 0.35) weight -= 15;
          if (branchName === '危机自保' && battleState?.isChargingHighThreat) weight += 8;

          return 应用行为经验误判(Math.max(0, weight), battleState);
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
              isBattleSkillSharedVisionProfile(skill) &&
              fallbackEnemyTarget &&
              getCombatHpValue(fallbackEnemyTarget) > 0
            ) {
              focusTarget = fallbackEnemyTarget;
              focusReason = 'shared_vision_focus';
              ttl = 3;
            }
          } else if (
            !targetMode.includes('自身') &&
            finalTarget &&
            finalTarget !== actor &&
            getCombatHpValue(finalTarget) > 0
          ) {
            const snapshot = buildConditionTacticalSnapshot(finalTarget);
            const hpRatio = getCombatHpRatio(finalTarget);
            focusTarget = finalTarget;
            if (
              snapshot.isLockedOrControlled &&
              (isBattleSkillControlProfile(skill, { calc: getPrimaryStateCalc(skill) }) ||
                Number(getPrimaryStateCalc(skill)?.lock_level || 0) > 0 ||
                Number(getPrimaryStateCalc(skill)?.reaction_penalty || 0) > 0 ||
                Number(getPrimaryStateCalc(skill)?.cast_speed_penalty || 0) > 0 ||
                Number(getPrimaryStateCalc(skill)?.dodge_penalty || 0) > 0 ||
                Number(getPrimaryStateCalc(skill)?.resource_block_ratio || 0) > 0)
            ) {
              focusReason = 'control_window';
              ttl = 3;
            } else if (
              isBattleSkillAntiHealProfile(skill, { calc: getPrimaryStateCalc(skill) }) &&
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
              isBattleSkillDotPressureProfile(skill) ||
              Number(settleResult?.dmg || 0) >= getCombatHpMaxValue(finalTarget) * 0.22
            ) {
              focusReason = 'dot_pressure';
              ttl = 2;
            } else if (isBattleSkillExecuteProfile(skill, { damage: getPrimaryDamageEffect(skill) }) || hpRatio < 0.45) {
              focusReason = 'finisher';
              ttl = hpRatio < 0.35 ? 3 : 2;
            }
          }
        setActorFocusTarget(actor, focusTarget, focusReason, ttl);
        return { target: focusTarget, reason: focusReason, ttl };
      }

      function buildBattleStateContext(actor, target, combatData, extra = {}) {
        const canFlee = combatData?.允许撤离 !== false;
        const isDesperateNoEscape = getCombatHpRatio(actor) < 0.3 && !canFlee;
        const 战斗经验 = 计算行为战斗经验(actor, target, combatData);
        return {
          combatType: combatData?.战斗类型 || '突发遭遇',
          isDeadlyFight:
            extra.isDeadlyFight ??
            ((combatData?.战斗类型 || '突发遭遇') === '死战' ||
              (combatData?.战斗类型 || '突发遭遇') === '突发遭遇'),
          ratio: extra.ratio ?? 1,
          playerPower: extra.playerPower ?? 0,
          isChargingHighThreat: !!extra.isChargingHighThreat,
          actorHpRatio: getCombatHpRatio(actor),
          targetHpRatio: getCombatHpRatio(target),
          canFlee: canFlee,
          isDesperateNoEscape: isDesperateNoEscape,
          战斗经验,
          经验稳定度: 战斗经验.稳定度,
          actor,
          target,
          combatData,
          ...extra,
        };
      }

      function 建立普防护援技能() {
        const 护援计算 = {
          ...createEmptyCombatEffectMap(),
          damage_reduction: 0.08,
          control_resist_mult: 1.04,
        };
        return normalizeSkillData(
          {
            name: '普防护援',
            魂技名: '普防护援',
            技能来源: '战术',
            技能类型: '防御',
            主定位: '防御',
            对象: '己方/单体',
            目标模型: '友方单体',
            消耗: '无',
            cast_time: 6,
            标签: ['团队保护型', '保命型'],
            战斗摘要: {
              防御性质: '护卫',
              协同性: '高',
              生效方式: '持续',
              持续性: '短',
              爆发级别: '无',
            },
            战斗语义: {
              主定位: '防御',
              作用目标: '友方单体',
              战术标签: ['团队保护型', '保命型'],
            },
            _效果数组: [
              {
                机制: '系统基础',
                技能来源: '战术',
                技能类型: '防御',
                消耗: '无',
                对象: '己方/单体',
                目标模型: '友方单体',
                结算策略: '单目标独立',
                cast_time: 6,
              },
              {
                机制: '状态挂载',
                状态名称: '普防护援',
                特殊机制标识: '增益/护卫',
                目标: '友方单体',
                目标模型: '友方单体',
                持续回合: 2,
                面板修改比例: { str: 1, def: 1, agi: 1, sp_max: 1 },
                计算层效果: 护援计算,
              },
              {
                机制: '护卫',
                状态名称: '普防护援',
                目标: '友方单体',
                目标模型: '友方单体',
                damage_reduction: 0.08,
                护卫次数: 1,
              },
            ],
          },
          '普防护援',
        );
      }

      function 计算队友护援压力(自身, 队友, 攻击者, 行为状态 = {}) {
        if (!队友 || !isCombatUnitAbleToFight(队友) || isCombatUnitIdentityMatch(队友, 自身?.name || 自身)) return 0;
        const 队友快照 = buildConditionTacticalSnapshot(队友);
        const 队友血量 = getCombatHpRatio(队友);
        let 压力 = Math.floor((1 - 队友血量) * 90);
        if (['辅助系', '治疗系', '食物系', '控制系'].includes(队友.type)) 压力 += 28;
        else if (['强攻系', '敏攻系', '精神系', '元素系'].includes(队友.type)) 压力 += 14;
        else if (队友.type === '防御系') 压力 -= 10;
        if (队友快照.hasBadCondition || 队友快照.isLockedOrControlled) 压力 += 18;
        if (队友快照.hasShielded || 队友快照.hasReactiveDefense) 压力 -= 14;
        if (队友.蓄力技能) 压力 += 18;
        const 攻击记忆 = ensureActorDecisionMemory(攻击者);
        if (攻击记忆.关注对象 && isCombatUnitIdentityMatch(队友, 攻击记忆.关注对象)) 压力 += 24;
        if (行为状态?.isChargingHighThreat) 压力 += 12;
        return Math.max(0, Math.floor(压力));
      }

      function 选择护援队友(自身, 己方团队 = [], 攻击者 = null, 行为状态 = {}) {
        const 队友列表 = dedupeCombatTargetList(己方团队)
          .filter(队友 => 队友 && isCombatUnitAbleToFight(队友) && !isCombatUnitIdentityMatch(队友, 自身?.name || 自身));
        if (!队友列表.length) return null;
        return 队友列表
          .map(队友 => ({ 队友, 压力: 计算队友护援压力(自身, 队友, 攻击者, 行为状态) }))
          .sort((左, 右) => 右.压力 - 左.压力)[0] || null;
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
        const 经验 = battleState?.战斗经验;
        const 经验日志 = 经验
          ? ` [行为经验] 经验:${Math.round(Number(经验.总分 || 0))}/稳定:${Math.round(Number(经验.稳定度 || 0) * 100)}%。`
          : '';
        action.log = `${logPrefix}${choice.trace}${经验日志} ${action.log}`.trim();
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
            套用动作队列实际前摇(attacker, playerAction);
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
              let preCostLog = applyActionCost(attacker, preAct, defender);
              if (preCostLog) roundLog += preCostLog + ' ';
              if (preAct.action_type === '穿戴装备') {
                const 装备槽 = ensureBattleEquipmentSlot(attacker, preAct.equip_target);
                if (装备槽) 装备槽.装备状态 = '已装备';
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
                let costLog = applyActionCost(attacker, playerAction, defender);
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
            let damageRatio = Number(settleResult.totalProjectedDamage || settleResult.dmg || 0) / getCombatHpMaxValue(attacker);
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
                  let backlashDmg = Math.floor(getCombatHpMaxValue(attacker) * 0.05);
                  设置战斗血量值(attacker, getCombatHpValue(attacker) - backlashDmg);
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
          const 行为防反日志 = 执行行为防反结算(
            attacker,
            defender,
            playerAction,
            npcAction,
            settleResult,
            damagePackage,
            combatData,
          );
          if (行为防反日志) roundLog += ` ${行为防反日志}`;
          isNpcInterrupted = isNpcInterrupted || appliedDamage / getCombatHpMaxValue(defender) >= 0.15;
          if (npcAction.type === '穿戴装备') {
            if (!isNpcInterrupted) {
              const 装备槽 = ensureBattleEquipmentSlot(defender, npcAction.skill.equip_target);
              if (装备槽) 装备槽.装备状态 = '已装备';
              roundLog += ` [装备生效] NPC成功穿戴了${npcAction.skill.equip_target === 'armor' ? '斗铠' : '机甲'}，防御力大增！`;
            } else {
              roundLog += ` [穿戴失败] 玩家的猛烈攻击强行打断了NPC的装备穿戴过程！`;
            }
          }
          const fusionAftermathLog = applyFusionActionAftermath(attacker, playerAction, combatData);
          if (fusionAftermathLog) roundLog += ` ${fusionAftermathLog}`;

          // --- 第五步：装备护主与战损结算 ---
          let combatType = combatData.战斗类型 || '突发遭遇';

          if (getCombatHpValue(defender) < getCombatHpMaxValue(defender) * 0.1) {
            let hasMech = defender.装备?.机甲?.等级 !== '无' && defender.装备?.机甲?.状态 !== '重创';
            let hasArmor = defender.装备?.斗铠?.装备状态 === '已装备';

            if (combatType === '擂台切磋' && getCombatHpValue(defender) <= getCombatHpMaxValue(defender) * 0.05) {
              设置战斗血量值(defender, Math.floor(getCombatHpMaxValue(defender) * 0.05)); // 强制锁血 5%
              roundLog += ` [擂台保护] 胜负已分！裁判强行介入，终止了致命一击！`;
              continueSimulation = false; // 强制结束战斗
            } else if (hasMech || hasArmor) {
              设置战斗血量值(defender, Math.floor(getCombatHpMaxValue(defender) * 0.1));
              let armorLog = applyArmorDamage(defender);
              roundLog += ` [装备护主] 致命打击触发替死锁血！NPC HP强制锁定在10%！${armorLog}`;
            } else if (combatType === '升灵台虚拟战斗' || combatType === '魂灵塔冲塔') {
              // 虚拟战斗中，敌方体力归零照常死亡，如果是己方或判定特殊保护，需要锁定体力并标记退出
              let saveLog = triggerDeathSave(defender);
              if (saveLog) {
                设置战斗血量值(defender, Math.floor(getCombatHpMaxValue(defender) * 0.1));
                roundLog += ` ${saveLog}`;
              } else {
              // 虚拟环境，如果是玩家/模拟死亡也是正常走到 vit <= 0，靠 settleBattle 拦截
            }
          } else {
            let saveLog = triggerDeathSave(defender);
            if (saveLog) {
              设置战斗血量值(defender, Math.floor(getCombatHpMaxValue(defender) * 0.1));
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
              const continueThresholdReached =
                Number(settleResult.totalProjectedDamage || settleResult.dmg || 0) / getCombatHpMaxValue(attacker) >= 0.05;
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

      function applyActionCost(attackerChar, playerAction, defenderChar = null) {
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
          } else if (!defenderChar) {
            playerAction.action_type = '法则失败';
            log = `[目标丢失] 当前没有可被元素剥离锁定的目标！`;
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
          } else if (!defenderChar) {
            playerAction.action_type = '法则失败';
            log = `[目标丢失] 当前没有可被五行剥离锁定的目标！`;
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
        const 战斗回合数 = Math.max(0, Number(combatData?.回合 || 0));
        const 攻方当前生命 = Math.max(0, Number(attackerStats?.HP ?? attackerStats?.体力 ?? 0));
        const 攻方生命上限 = Math.max(1, Number(attackerStats?.HP上限 ?? attackerStats?.体力上限 ?? 1));
        const 攻方生命比例 = 攻方当前生命 / 攻方生命上限;
        let 最近战斗标签 = '消耗战';
        if (outcome.isDefeat === true) 最近战斗标签 = '失利';
        else if (isVictoryOutcome) {
          if (战斗回合数 <= 2 && 攻方生命比例 >= 0.65) 最近战斗标签 = '速胜';
          else if (攻方生命比例 <= 0.35) 最近战斗标签 = '险胜';
          else 最近战斗标签 = '消耗战';
        } else if (isDrawOutcome || isUnresolvedOutcome) 最近战斗标签 = '消耗战';
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
          const 图鉴路径前缀 = `/world/图鉴/${escapeJsonPointerSegment(defenderName)}`;
          const 当前交手次数 = Math.max(0, Number(monsterEntry?.交手次数 || 0));
          const 当前击杀次数 = Math.max(0, Number(monsterEntry?.击杀次数 || 0));
          const 当前战斗样本数 = Math.max(0, Number(monsterEntry?.战斗样本数 || 0));
          const 下次战斗样本数 = 当前战斗样本数 + 1;
          const 当前标签样本 = Math.max(0, Number(monsterEntry?.战斗标签样本?.[最近战斗标签] || 0));
          const 下次标签样本 = 当前标签样本 + 1;
          const 下次交手次数 = 当前交手次数 + 1;
          const 下次击杀次数 = isVictoryOutcome ? 当前击杀次数 + 1 : 当前击杀次数;
          const 下次档经验 = 下次交手次数 + 下次击杀次数 * 2;
          if (!monsterEntry) {
            extraPatchOps.push({
              op: 'add',
              path: 图鉴路径前缀,
              value: {
                交手次数: 1,
                击杀次数: isVictoryOutcome ? 1 : 0,
                图鉴档位: '初识',
                当前档经验: isVictoryOutcome ? 3 : 1,
                下档需求: 5,
                最近活跃tick: currentTick,
                最近升档tick: 0,
                探索收益: 0,
                战斗收益: 0,
                成长倾向: '均衡',
                任务协同系数: 1,
                情报协同系数: 1,
                最近战斗标签,
                战斗样本数: 1,
                战斗标签样本: { [最近战斗标签]: 1 },
                首次记录: `由 ${attackerName} 在${combatType}中遭遇`,
              },
            });
          } else {
            extraPatchOps.push({
              op: 'replace',
              path: `${图鉴路径前缀}/交手次数`,
              value: 下次交手次数,
            });
            extraPatchOps.push({
              op: 'add',
              path: `${图鉴路径前缀}/击杀次数`,
              value: 下次击杀次数,
            });
            extraPatchOps.push({
              op: 'add',
              path: `${图鉴路径前缀}/当前档经验`,
              value: 下次档经验,
            });
            extraPatchOps.push({
              op: 'add',
              path: `${图鉴路径前缀}/最近活跃tick`,
              value: currentTick,
            });
            extraPatchOps.push({
              op: 'add',
              path: `${图鉴路径前缀}/最近战斗标签`,
              value: 最近战斗标签,
            });
            extraPatchOps.push({
              op: 'add',
              path: `${图鉴路径前缀}/战斗样本数`,
              value: 下次战斗样本数,
            });
            if (!monsterEntry.战斗标签样本 || typeof monsterEntry.战斗标签样本 !== 'object' || Array.isArray(monsterEntry.战斗标签样本)) {
              extraPatchOps.push({
                op: 'add',
                path: `${图鉴路径前缀}/战斗标签样本`,
                value: {},
              });
            }
            extraPatchOps.push({
              op: 'add',
              path: `${图鉴路径前缀}/战斗标签样本/${escapeJsonPointerSegment(最近战斗标签)}`,
              value: 下次标签样本,
            });
            if (monsterEntry.首次记录 === undefined) {
              extraPatchOps.push({
                op: 'add',
                path: `${图鉴路径前缀}/首次记录`,
                value: `由 ${attackerName} 在${combatType}中遭遇`,
              });
            }
          }
        }

        if (combatType === '升灵台虚拟战斗') {
          if (isVictoryOutcome) {
            const ticket = combatData.ascension_ticket || '初级升灵台门票';
            const ticketRange = getAscensionTicketAgeRange(ticket);
            const riotPeriod = isAscensionRiotTicket(ticket);
            const defenderIsSoulMaster = isCombatUnitSoulMaster(defenderChar);
            let killedAge = Math.max(
              ticketRange.min,
              Math.min(ticketRange.max, Number(combatData.killed_age || defenderStats.age || ticketRange.min || 100)),
            );
            const 结算队伍 = 获取升灵台结算队伍(combatData, attackerName);
            const 参与人数 = Math.max(1, 结算队伍.length);
            const ticketPercent = ticketRange.max > ticketRange.min
              ? (killedAge - ticketRange.min) / (ticketRange.max - ticketRange.min)
              : 0;
            const rewardMultiplier = defenderIsSoulMaster
              ? (riotPeriod ? getAscensionRiotRewardMultiplier(ticketPercent) : 0)
              : 1;
            const 非暴动期魂师战 = defenderIsSoulMaster && !riotPeriod;
            let 可结算成员数 = 0;
            let 无魂环成员数 = 0;
            let 有效增益样本 = 0;
            结算队伍.forEach(成员 => {
              const 魂环表 = 成员.角色数据?.魂环 && typeof 成员.角色数据.魂环 === 'object'
                ? 成员.角色数据.魂环
                : {};
              const 魂环序号列表 = Object.keys(魂环表).filter(魂环序号 => 魂环表[魂环序号] && typeof 魂环表[魂环序号] === 'object');
              if (!魂环序号列表.length) {
                无魂环成员数 += 1;
                return;
              }
              可结算成员数 += 1;
              let 成员增益 = 非暴动期魂师战 ? 0 : Math.floor((killedAge / 参与人数 / 魂环序号列表.length) * rewardMultiplier);
              if (!Number.isFinite(成员增益) || 成员增益 < 0) 成员增益 = 0;
              有效增益样本 += 成员增益;
              魂环序号列表.forEach(魂环序号 => {
                const 旧年限原值 = Number(魂环表[魂环序号]?.年限);
                const 旧年限 = Number.isFinite(旧年限原值) && 旧年限原值 > 0 ? Math.floor(旧年限原值) : 10;
                extraPatchOps.push({
                  op: 'replace',
                  path: `/char/${escapeJsonPointerSegment(成员.角色键)}/魂环/${魂环序号}/年限`,
                  value: 旧年限 + 成员增益,
                });
              });
            });
            const 增益摘要 = 可结算成员数 > 0
              ? `可结算成员${可结算成员数}人，单成员单魂环平均增益约 ${Math.floor(有效增益样本 / 可结算成员数)} 年`
              : '全队暂无可结算魂环';
            const 无魂环摘要 = 无魂环成员数 > 0 ? `，${无魂环成员数}名成员无魂环未吸收` : '';
            if (非暴动期魂师战) {
              log = `[升灵台结算] 队伍击败了魂师，但当前非暴动期，全队不结算升灵奖励。`;
            } else if (defenderIsSoulMaster) {
              log = `[升灵台结算] 队伍击败暴动期魂师！对手处于档位区间${Math.round(ticketPercent * 100)}%，倍率约 ${rewardMultiplier.toFixed(2)} 倍；${增益摘要}${无魂环摘要}。`;
            } else {
              log = `[升灵台结算] 虚拟魂兽被击溃，升灵能量按队伍(${参与人数}人)平分；${增益摘要}${无魂环摘要}。`;
            }
            const 升灵台退出补丁 = 构建角色位置补丁(attackerName, 升灵台退出地点);
            if (升灵台退出补丁) extraPatchOps.push(升灵台退出补丁);
            combatData.试炼状态 = '';
            extraPatchOps.push(构建试炼状态补丁(''));
          } else if (outcome.isDefeat === true || isDrawOutcome) {
            log = `[升灵台保护] 玩家受到致命创伤，升灵台保护机制触发！一道接引光芒落下，强制将其弹出升灵台。(虚拟战败，无实质损伤，但终止了本次历练)`;
            设置战斗血量值(attackerChar, 1);
            const 升灵台退出补丁 = 构建角色位置补丁(attackerName, 升灵台退出地点);
            if (升灵台退出补丁) extraPatchOps.push(升灵台退出补丁);
            combatData.试炼状态 = '';
            extraPatchOps.push(构建试炼状态补丁(''));
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
            设置战斗血量值(attackerChar, 1);
            const 魂灵塔退出补丁 = 构建角色位置补丁(attackerName, 魂灵塔退出地点);
            if (魂灵塔退出补丁) extraPatchOps.push(魂灵塔退出补丁);
            combatData.试炼状态 = '';
            extraPatchOps.push(构建试炼状态补丁(''));
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

      function ensureBattleEquipmentSlot(角色对象, 装备目标 = 'armor') {
        if (!角色对象 || typeof 角色对象 !== 'object') return null;
        if (!角色对象.装备 || typeof 角色对象.装备 !== 'object') 角色对象.装备 = {};
        const 装备键 = 装备目标 === 'armor' ? '斗铠' : '机甲';
        if (!角色对象.装备[装备键] || typeof 角色对象.装备[装备键] !== 'object') {
          角色对象.装备[装备键] =
            装备键 === '斗铠'
              ? { 等级: 0, 名称: '无', 领域: '无', 材质: '无', 装备状态: '未装备', parts: {} }
              : { 等级: '无', 型号: '无', 材质: '无', 状态: '完好', 装备状态: '未装备', 武装: '无', 品质系数: 1.0 };
        }
        const 装备槽 = 角色对象.装备[装备键];
        if (装备键 === '斗铠') {
          if (!装备槽.parts || typeof 装备槽.parts !== 'object') 装备槽.parts = {};
          if (!('装备状态' in 装备槽)) 装备槽.装备状态 = '未装备';
        } else {
          if (!('状态' in 装备槽)) 装备槽.状态 = '完好';
          if (!('装备状态' in 装备槽)) 装备槽.装备状态 = '未装备';
          if (!('品质系数' in 装备槽)) 装备槽.品质系数 = 1.0;
        }
        return 装备槽;
      }

      function applyArmorDamage(defender) {
        let log = '';
        const 机甲槽 = ensureBattleEquipmentSlot(defender, 'mech');
        const 斗铠槽 = ensureBattleEquipmentSlot(defender, 'armor');
        if (机甲槽?.等级 !== '无' && 机甲槽?.状态 !== '重创') {
          if (机甲槽.状态 === '完好') {
            机甲槽.状态 = '受损';
            机甲槽.品质系数 = 0.5;
            log = `[战损] 敌方最外层的机甲装甲大面积凹陷，状态降级为【受损】！`;
          } else if (机甲槽.状态 === '受损') {
            机甲槽.状态 = '重创';
            机甲槽.品质系数 = 0;
            log = `[战损] 敌方机甲核心法阵爆裂，状态降级为【重创】，彻底瘫痪！`;
          }
          return log;
        }
        if (斗铠槽?.装备状态 === '已装备') {
          let parts = Object.keys(斗铠槽.parts || {});
          let intactParts = parts.filter(p => 斗铠槽.parts?.[p]?.状态 === '完好');
          if (intactParts.length > 0) {
            let targetPart = intactParts[Math.floor(Math.random() * intactParts.length)];
            斗铠槽.parts[targetPart].状态 = '碎裂';
            斗铠槽.parts[targetPart].品质系数 = 0;
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
        if (isMechanismSuppressionBlocking(char, ['护盾', '防御机制'])) return [];
        return Object.entries(char.状态效果)
          .map(([key, cond]) => ({ key, cond, shieldValue: Math.max(0, Number(cond?.shield_value || 0)) }))
          .filter(entry => entry.shieldValue > 0)
          .sort((a, b) => b.shieldValue - a.shieldValue);
      }

      function 读取当前护盾总量(char) {
        if (!char?.状态效果 || typeof char.状态效果 !== 'object') return 0;
        return Object.values(char.状态效果).reduce((总量, 状态) => 总量 + Math.max(0, Number(状态?.shield_value || 0)), 0);
      }

      function 计算护盾软上限(char) {
        const 生命上限 = Math.max(1, Number(char?.hp_max || char?.HP上限 || char?.vit_max || char?.体力上限 || 1));
        const 魂力上限 = Math.max(1, Number(char?.sp_max || char?.魂力上限 || 1));
        return Math.max(300, Math.floor(生命上限 * 1.2 + 魂力上限 * 0.35));
      }

      function 计算护盾实得值(char, shieldAmount) {
        const 新增护盾 = Math.max(0, Math.floor(Number(shieldAmount || 0)));
        if (!(新增护盾 > 0)) return 0;
        const 当前护盾 = 读取当前护盾总量(char);
        const 软上限 = 计算护盾软上限(char);
        const 常规空间 = Math.max(0, 软上限 - 当前护盾);
        const 常规获得 = Math.min(新增护盾, 常规空间);
        const 超额获得 = Math.max(0, 新增护盾 - 常规获得);
        return Math.max(0, Math.floor(常规获得 + 超额获得 * 0.35));
      }

      function triggerReviveEffect(targetChar, label = '目标') {
        if (!targetChar?.状态效果) return null;
        if (isMechanismSuppressionBlocking(targetChar, ['复苏', '回复机制', '防御机制'])) {
          return `[复苏受阻] ${label}的复苏回路已被机制抹消封锁，无法触发！`;
        }
        const candidate = Object.entries(targetChar.状态效果)
          .map(([key, cond]) => ({ key, cond, ce: cond?.战斗效果 || {} }))
          .filter(entry => Number(entry.ce.revive_count || 0) > 0)
          .sort((a, b) => Number(b.ce.revive_count || 0) - Number(a.ce.revive_count || 0))[0];
        if (!candidate) return null;
        if (!candidate.cond.战斗效果) candidate.cond.战斗效果 = {};
        const nextCount = Math.max(0, Number(candidate.cond.战斗效果.revive_count || 0) - 1);
        candidate.cond.战斗效果.revive_count = nextCount;
        const healRatio = Math.max(0.05, Number(candidate.cond.战斗效果.revive_heal_ratio || 0.25));
        const maxVit = getCombatHpMaxValue(targetChar);
        const restoreAmount = Math.max(1, Math.floor(maxVit * healRatio));
        设置战斗血量值(targetChar, Math.min(maxVit, Math.max(restoreAmount, getCombatHpValue(targetChar) + restoreAmount)));
        if (!targetChar.状态 || typeof targetChar.状态 !== 'object') targetChar.状态 = {};
        targetChar.状态.行动 = '战斗';
        return `[复苏触发] ${label}借[${candidate.key}]重燃战意，恢复 ${restoreAmount} 点HP！剩余复苏次数:${nextCount}`;
      }

      function applyShieldToCharacter(targetChar, shieldAmount, duration = 1, sourceName = '护盾') {
        const amount = 计算护盾实得值(targetChar, shieldAmount);
        if (!targetChar || amount <= 0) return 0;
        if (isMechanismSuppressionBlocking(targetChar, ['护盾', '防御机制', '增益'])) return 0;
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
            `${defender.name || '目标'}:无敌金身`,
            Math.max(1, Number(ce.daily_trigger_limit || 3)),
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
        const damageRatio = Math.max(0, Number(inflictedDamage || 0)) / getCombatHpMaxValue(targetChar);
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
            设置战斗血量值(attacker, getCombatHpValue(attacker) - reactiveDefense.counterDamage);
          }
          if (reactiveDefense.log) logParts.push(reactiveDefense.log);
          let appliedDamage = 0;
          if (finalDamage > 0) {
            const defThreshold = Math.max(1, Number(targetFinalStat.def || targetChar.def || 0)) * 0.1;
            const ignoreDefenseThreshold = ['dot_detonate', 'shield_break'].includes(String(targetEntry?.kind || '').trim());
            if (!ignoreDefenseThreshold && finalDamage < defThreshold) {
              设置战斗血量值(targetChar, getCombatHpValue(targetChar) - 1);
              appliedDamage = 1;
              logParts.push(
                targetEntry?.kind === 'primary'
                  ? `[未破防] 对${targetChar.name || '目标'}仅造成 1 点强制伤害。`
                  : `[群体擦伤] ${targetChar.name || '目标'}仅承受 1 点擦伤伤害。`,
              );
            } else {
              设置战斗血量值(targetChar, getCombatHpValue(targetChar) - finalDamage);
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
                    dot_damage: Math.floor(getCombatHpMaxValue(targetChar) * 0.05),
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
              设置战斗血量值(sharedTarget, getCombatHpValue(sharedTarget) - sharedDamage);
              logParts.push(
                `[分摊结算] ${sharedTarget.name || '队友'}替${targetChar.name || '目标'}承受了 ${sharedDamage} 点伤害。`,
              );
              if (getCombatHpValue(sharedTarget) <= 0) {
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
          if (getCombatHpValue(targetChar) <= 0) {
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
        return Math.max(0, Number(char?.hp ?? stats.hp ?? char?.HP ?? stats.HP ?? 0));
      }

      function getCombatHpMaxValue(char) {
        const stats = char?.属性 && typeof char.属性 === 'object' ? char.属性 : char || {};
        return Math.max(1, Number(char?.hp_max ?? stats.hp_max ?? char?.HP上限 ?? stats.HP上限 ?? 1));
      }

      function getCombatStaminaValue(char) {
        const stats = char?.属性 && typeof char.属性 === 'object' ? char.属性 : char || {};
        return Math.max(0, Number(char?.sta ?? stats.sta ?? char?.体力 ?? stats.体力 ?? char?.vit ?? stats.vit ?? 0));
      }

      function getCombatStaminaMaxValue(char) {
        const stats = char?.属性 && typeof char.属性 === 'object' ? char.属性 : char || {};
        return Math.max(1, Number(char?.sta_max ?? stats.sta_max ?? char?.体力上限 ?? stats.体力上限 ?? char?.vit_max ?? stats.vit_max ?? 1));
      }

      function 设置战斗血量值(char, value) {
        if (!char || typeof char !== 'object') return 0;
        const stats = char?.属性 && typeof char.属性 === 'object' ? char.属性 : char;
        const nextValue = Math.max(0, Math.min(getCombatHpMaxValue(char), Number(value || 0)));
        if ('hp' in char || Object.prototype.hasOwnProperty.call(char, 'hp')) char.hp = nextValue;
        else char.HP = nextValue;
        if (stats && typeof stats === 'object') stats.HP = nextValue;
        return nextValue;
      }

      function 设置战斗体力值(char, value) {
        if (!char || typeof char !== 'object') return 0;
        const stats = char?.属性 && typeof char.属性 === 'object' ? char.属性 : char;
        const nextValue = Math.max(0, Math.min(getCombatStaminaMaxValue(char), Number(value || 0)));
        if ('sta' in char || Object.prototype.hasOwnProperty.call(char, 'sta')) char.sta = nextValue;
        else char.体力 = nextValue;
        if (stats && typeof stats === 'object') stats.体力 = nextValue;
        return nextValue;
      }

      function getCombatHpRatio(char) {
        return getCombatHpValue(char) / getCombatHpMaxValue(char);
      }

      function getCombatStaminaRatio(char) {
        return getCombatStaminaValue(char) / getCombatStaminaMaxValue(char);
      }

      function 执行行为防反结算(攻击方, 防反方, 原动作, 反应动作, 交锋结果, 伤害包, 战斗数据) {
        const 候选 = 交锋结果?.__行为防反候选;
        if (!候选 || 原动作?.__行为防反 === true) return '';
        const 防反者 = 候选.防反方 || 防反方;
        const 目标 = 候选.攻击方 || 攻击方;
        const 允许以命换伤 = 候选.以命换伤 === true && getCombatStaminaValue(防反者) > 0;
        if (!防反者 || !目标 || (!isCombatUnitAbleToFight(防反者) && !允许以命换伤) || !isCombatUnitAbleToFight(目标)) return '';

        let 触发概率 = Number(候选.触发概率 || 0);
        const 实际承伤 = Math.max(0, Number(伤害包?.primaryAppliedDamage || 0));
        if (候选.防反类型 === '硬抗换伤') {
          触发概率 = 计算行为防反概率({
            ...候选,
            原动作,
            反应动作,
            战斗数据,
            实际伤害: 实际承伤,
          });
        }
        if (!(触发概率 > 0)) return '';

        const 投点 = Math.random();
        const 概率文本 = `${Math.round(触发概率 * 100)}%`;
        if (投点 >= 触发概率) {
          return `[防反错失] ${防反者.name || '防守方'}抓到${候选.防反类型}窗口，但未能完成反打(概率:${概率文本})。`;
        }

        const 防反动作 = 建立行为防反动作(防反者, { ...候选, 触发概率 });
        const 防反战斗数据 = {
          战斗类型: 战斗数据?.战斗类型 || '突发遭遇',
          先攻: 防反者.name || '防反方',
          参战者: {
            player: 防反者,
            enemy: 目标,
            team_player: [防反者],
            team_enemy: [目标],
          },
        };
        const 原闪避惩罚 = 目标.temp_dodge_penalty;
        const 原锁定层级 = 目标.temp_lock_level;
        try {
          const 出手承诺 = Number(候选.出手承诺 || 0);
          目标.temp_dodge_penalty = Number(目标.temp_dodge_penalty || 0) + 出手承诺 * 0.45;
          目标.temp_lock_level = Number(目标.temp_lock_level || 0) + Math.round(出手承诺 * 4);
          const 基础反应余量 = calculateReactionRatio(防反者, 目标, 防反动作, 防反战斗数据);
          const 出手反应折损 = 限制行为概率(1 - 出手承诺 * 0.72, 0.36, 0.92);
          const 二次反应余量 = 基础反应余量 * 出手反应折损;
          const 二次反应动作 = 目标.temp_cannot_react
            ? { type: '无法反应', log: `${目标.name || '攻击方'}出手已满，二次反应受限。`, skill: null, def_mult: 1.0 }
            : determineNpcAction(防反战斗数据, 防反动作, 二次反应余量);
          const 防反结果 = executeClash(
            防反动作,
            二次反应动作,
            防反战斗数据,
          );
          const 防反伤害包 = applyResolvedDamagePackage(防反者, 防反动作, 防反结果, {
            primaryTarget: 目标,
            combatData: 防反战斗数据,
          });
          const 伤害文本 = 防反伤害包.primaryAppliedDamage > 0 ? `，造成${防反伤害包.primaryAppliedDamage}点反击伤害` : '';
          const 反应文本 = 二次反应动作?.log ? ` ${二次反应动作.log}` : '';
          const 防反名 = 允许以命换伤 ? '以命换伤' : 候选.防反类型;
          return `[行为防反] ${防反者.name || '防守方'}凭${防反名}抓住${目标.name || '攻击方'}出手后的空门${伤害文本}(概率:${概率文本}，二次反应:${Math.round(二次反应余量 * 100)}%)。${反应文本} ${防反结果.desc || ''}${防反伤害包.log ? ` ${防反伤害包.log}` : ''}`;
        } finally {
          if (原闪避惩罚 === undefined) delete 目标.temp_dodge_penalty;
          else 目标.temp_dodge_penalty = 原闪避惩罚;
          if (原锁定层级 === undefined) delete 目标.temp_lock_level;
          else 目标.temp_lock_level = 原锁定层级;
        }
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

      function isCombatUnitSoulMaster(char = {}) {
        const unitNature = String(char?.单位性质 || '').trim();
        const identity = String(char?.身份 || '').trim();
        const stats = char?.属性 && typeof char.属性 === 'object' ? char.属性 : char || {};
        return (
          unitNature === '人类' &&
          identity === '魂师' &&
          stats?.普通人 !== true
        );
      }

      function parseAscensionTicketTier(ticket = '') {
        const text = String(ticket || '').trim();
        if (/高级/.test(text)) return '高级';
        if (/中级/.test(text)) return '中级';
        return '初级';
      }

      function isAscensionRiotTicket(ticket = '') {
        return /暴动期/.test(String(ticket || ''));
      }

      function getAscensionTicketAgeRange(ticket = '') {
        const tier = parseAscensionTicketTier(ticket);
        const map = {
          初级: { min: 100, max: 3000 },
          中级: { min: 3000, max: 20000 },
          高级: { min: 20000, max: 100000 },
        };
        return map[tier] || map.初级;
      }

      function getAscensionRiotRewardMultiplier(percent = 0) {
        const safePercent = Math.max(0, Math.min(1, Number(percent) || 0));
        if (safePercent <= 0.1) return 5;
        if (safePercent <= 0.2) return 4;
        if (safePercent <= 0.5) {
          const t = (safePercent - 0.2) / 0.3;
          return 4 - t * 3;
        }
        return 1;
      }

      function isCombatUnitEvilSoulMaster(char = {}) {
        const stats = char?.属性 && typeof char.属性 === 'object' ? char.属性 : char || {};
        const social = char?.社交 && typeof char.社交 === 'object' ? char.社交 : {};
        const factionMap = social?.势力 && typeof social.势力 === 'object' ? social.势力 : {};
        const factionNames = Object.keys(factionMap).map(name => String(name || '').trim());
        const identityTexts = [
          stats?.主身份,
          social?.主身份,
          social?.身份,
          social?.称号 && typeof social.称号 === 'object' ? Object.keys(social.称号).join('/') : '',
          stats?.标签,
          social?.标签,
        ]
          .map(text => String(text || '').trim())
          .filter(Boolean)
          .join('/');
        return (
          stats?.邪魂师 === true ||
          stats?.is_evil === true ||
          stats?.evil === true ||
          /邪魂/.test(identityTexts) ||
          factionNames.some(name => /邪魂|圣灵教|深渊/.test(name))
        );
      }

    function normalizeBattleObjectDiffMatchToken(value = '') {
      const text = String(value || '').trim();
      if (!text) return '';
      if (['自身', '施术者', '自己', '本体', '自体'].includes(text)) return '自身';
      if (['友方', '己方', '队友', '同伴'].includes(text)) return '友方';
      if (['敌方', '对手', '目标方', '对面'].includes(text)) return '敌方';
      if (['邪魂师', '邪魂'].includes(text)) return '邪魂师';
      if (['深渊生物', '深渊'].includes(text)) return '深渊生物';
      if (['魂兽', '魂兽类'].includes(text)) return '魂兽';
      if (['施术者低血量', '施术者高血量', '目标低血量', '目标高血量', '目标有状态', '目标无状态', '目标有护盾', '目标无护盾'].includes(text))
        return text;
      return '';
    }

    function normalizeBattleObjectDiffMatchList(value = '') {
      const source = Array.isArray(value) ? value : [value];
      return Array.from(
        new Set(
            source
              .flatMap(item =>
                String(item || '')
                  .split(/[\/|,，、\s]+/)
                  .map(token => normalizeBattleObjectDiffMatchToken(token))
                  .filter(Boolean),
              )
              .filter(Boolean),
          ),
      );
    }

    const BATTLE_OBJECT_DIFF_ACTION_OPTIONS = new Set([
      '覆盖',
      '禁用',
      '转为伤害',
      '替换机制',
      '倍率提升',
      '倍率压制',
      '持续延长',
      '持续缩短',
      '改为自身',
      '改为友方',
      '改为敌方',
      '附加状态',
    ]);

    function normalizeBattleObjectDiffRuleEntry(value = {}, index = 0) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
      void index;
      const actionRaw = String(value.处理 || value.动作 || value.action || '覆盖').trim() || '覆盖';
      const action = BATTLE_OBJECT_DIFF_ACTION_OPTIONS.has(actionRaw) ? actionRaw : '覆盖';
      const conditionSource = value.条件 ?? '';
      const matchList = normalizeBattleObjectDiffMatchList(conditionSource);
      if (!matchList.length) return null;
        const rule = {
          匹配: matchList,
          处理: action,
          参数: {},
        };
        const explicitParams =
          value.参数 && typeof value.参数 === 'object' && !Array.isArray(value.参数) ? deepClonePlain(value.参数) : {};
        rule.参数 = explicitParams;
        if (!Object.keys(rule.参数 || {}).length) delete rule.参数;
        return rule;
      }

      function normalizeBattleObjectDiffRuleList(value = []) {
        const source = Array.isArray(value) ? value : [];
        return source
          .map((entry, index) => normalizeBattleObjectDiffRuleEntry(entry, index))
          .filter(Boolean);
      }

      function buildBattleObjectDiffTagSet(caster = null, target = null, targetContext = null) {
        const tagSet = new Set();
        if (!target) return tagSet;
        if (caster && isCombatUnitIdentityMatch(target, caster?.name || caster)) tagSet.add('自身');
        const alliedSet = Array.isArray(targetContext?.alliedSet) ? targetContext.alliedSet : [];
        const hostileSet = Array.isArray(targetContext?.hostileSet) ? targetContext.hostileSet : [];
        if (alliedSet.some(unit => isCombatUnitIdentityMatch(unit, target?.name || target))) tagSet.add('友方');
        if (hostileSet.some(unit => isCombatUnitIdentityMatch(unit, target?.name || target))) tagSet.add('敌方');
        const speciesFlags = getCombatTargetSpeciesFlags(target);
        if (speciesFlags.isAbyss) tagSet.add('深渊生物');
        if (speciesFlags.isBeast) tagSet.add('魂兽');
        if (isCombatUnitEvilSoulMaster(target)) tagSet.add('邪魂师');
        if (!tagSet.size && caster && !isCombatUnitIdentityMatch(target, caster?.name || caster)) tagSet.add('敌方');
        return tagSet;
      }

      function applyBattleObjectDiffRuleToEffect(effect = {}, rule = null) {
        const nextEffect = deepClonePlain(effect || {});
        if (!rule || typeof rule !== 'object') return nextEffect;
        const ruleParams = rule.参数 && typeof rule.参数 === 'object' && !Array.isArray(rule.参数) ? rule.参数 : {};
        nextEffect.对象差异命中规则 = Array.isArray(rule.匹配) ? rule.匹配.join('/') : '';
        nextEffect.对象差异处理 = String(rule.处理 || '').trim() || '覆盖';
        if (nextEffect.对象差异处理 === '倍率提升') {
          const scale = Number.isFinite(Number(ruleParams.数值倍率)) ? Number(ruleParams.数值倍率) : 1.2;
          ruleParams.数值倍率 = Math.max(1, Number(scale.toFixed(4)));
        }
        if (nextEffect.对象差异处理 === '倍率压制') {
          const scale = Number.isFinite(Number(ruleParams.数值倍率)) ? Number(ruleParams.数值倍率) : 0.8;
          ruleParams.数值倍率 = Math.max(0, Math.min(1, Number(scale.toFixed(4))));
        }
        if (nextEffect.对象差异处理 === '持续延长') {
          const extra = Math.max(1, Math.round(Number(ruleParams.持续回合增量 || 1)));
          const baseDuration = Math.max(0, Math.round(Number(nextEffect.持续回合 || 0)));
          nextEffect.持续回合 = baseDuration + extra;
        }
        if (nextEffect.对象差异处理 === '持续缩短') {
          const reduce = Math.max(1, Math.round(Number(ruleParams.持续回合减量 || 1)));
          const baseDuration = Math.max(0, Math.round(Number(nextEffect.持续回合 || 0)));
          nextEffect.持续回合 = Math.max(0, baseDuration - reduce);
        }
        if (nextEffect.对象差异处理 === '改为自身') {
          nextEffect.目标模型 = '自身';
          nextEffect.目标 = '自身';
          nextEffect.对象 = '自身';
        }
        if (nextEffect.对象差异处理 === '改为友方') {
          nextEffect.目标模型 = '友方单体';
          nextEffect.目标 = '友方单体';
          nextEffect.对象 = '友方单体';
        }
        if (nextEffect.对象差异处理 === '改为敌方') {
          nextEffect.目标模型 = '敌方单体';
          nextEffect.目标 = '敌方单体';
          nextEffect.对象 = '敌方单体';
        }
        if (nextEffect.对象差异处理 === '附加状态' && String(ruleParams.状态名称 || '').trim()) {
          nextEffect.附加状态名称 = String(ruleParams.状态名称 || '').trim();
        }
        if (nextEffect.对象差异处理 === '禁用') return nextEffect;
        if (nextEffect.对象差异处理 === '替换机制' && ruleParams.替换机制) {
          nextEffect.机制 = String(ruleParams.替换机制 || nextEffect.机制 || '').trim() || nextEffect.机制;
        }
        if (nextEffect.对象差异处理 === '转为伤害') {
          nextEffect.机制 = '直接伤害';
          if (!(Number(nextEffect.威力倍率 || 0) > 0)) {
            const baseRatio = Number(nextEffect.数值 || 0);
            nextEffect.威力倍率 = Math.max(1, Math.round(Math.max(0, baseRatio) * 100));
          }
          nextEffect.伤害类型 = String(ruleParams.伤害类型 || nextEffect.伤害类型 || '神圣').trim() || '神圣';
          nextEffect.对象差异伤害倍率 = Number.isFinite(Number(ruleParams.伤害倍率))
            ? Number(Number(ruleParams.伤害倍率).toFixed(4))
            : 1;
        }
        if (Number.isFinite(Number(ruleParams.数值倍率))) {
          const scale = Number(ruleParams.数值倍率);
          [
            '数值',
            '威力倍率',
            '护盾值',
            'dot_damage',
            '每回合伤害',
            '反灌比例',
            '夺取比例',
            '转化比例',
            '斩盾倍率',
            '窃盾比例',
            '引爆倍率',
            '反射比例',
            '分摊比例',
            '复苏回血比例',
          ].forEach(field => {
            const base = Number(nextEffect?.[field]);
            if (!Number.isFinite(base)) return;
            const scaled = field === '威力倍率' || field === '护盾值' || field === 'dot_damage' || field === '每回合伤害'
              ? Math.max(0, Math.round(base * scale))
              : Number((base * scale).toFixed(4));
            nextEffect[field] = scaled;
          });
        }
        if (ruleParams.覆盖字段 && typeof ruleParams.覆盖字段 === 'object') {
          Object.entries(ruleParams.覆盖字段).forEach(([key, value]) => {
            nextEffect[key] = deepClonePlain(value);
          });
        }
        return nextEffect;
      }

      function resolveBattleObjectDiffEffect(effect = {}, caster = null, target = null, targetContext = null) {
        const rules = normalizeBattleObjectDiffRuleList(effect?.对象差异规则 || []);
        if (!rules.length || !target) {
          return {
            生效: true,
            命中: false,
            命中规则: null,
            生效效果: effect,
          };
        }
        const tagSet = buildBattleObjectDiffTagSet(caster, target, targetContext);
        const casterHpRatio = getCombatHpRatio(caster);
        const targetHpRatio = getCombatHpRatio(target);
        if (casterHpRatio <= 0.35) tagSet.add('施术者低血量');
        if (casterHpRatio >= 0.7) tagSet.add('施术者高血量');
        if (targetHpRatio <= 0.35) tagSet.add('目标低血量');
        if (targetHpRatio >= 0.7) tagSet.add('目标高血量');
        const targetStateMap = target?.状态效果 && typeof target.状态效果 === 'object' ? target.状态效果 : {};
        if (Object.keys(targetStateMap).length > 0) tagSet.add('目标有状态');
        else tagSet.add('目标无状态');
        const hasShield = Object.entries(targetStateMap).some(([_, state]) => {
          const cond = state && typeof state === 'object' ? state : {};
          const shieldVal = Number(cond?.shield_value || cond?.shield || 0);
          const typeText = String(cond?.类型 || '').trim();
          return shieldVal > 0 || /护盾/.test(typeText);
        });
        if (hasShield) tagSet.add('目标有护盾');
        else tagSet.add('目标无护盾');
        const matchedRule =
          rules.find(rule => Array.isArray(rule?.匹配) && rule.匹配.some(tag => tagSet.has(normalizeBattleObjectDiffMatchToken(tag)))) ||
          null;
        if (!matchedRule) {
          return {
            生效: true,
            命中: false,
            命中规则: null,
            生效效果: effect,
          };
        }
        const resolvedEffect = applyBattleObjectDiffRuleToEffect(effect, matchedRule);
        const disabled = String(resolvedEffect?.对象差异处理 || '').trim() === '禁用';
        return {
          生效: !disabled,
          命中: true,
          命中规则: matchedRule,
          生效效果: resolvedEffect,
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
          Math.max(
            0,
            playerAction.cast_time / 100 +
              (playerAction?.前摇已结算 === true ? 0 : -totalCastSpeedBonus + totalCastSpeedPenalty),
          ),
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

      function 限制行为概率(数值 = 0, 下限 = 0, 上限 = 1) {
        const 安全数值 = Number(数值);
        if (!Number.isFinite(安全数值)) return 下限;
        return Math.max(下限, Math.min(上限, 安全数值));
      }

      function 读取行为体力比(角色 = {}) {
        const 当前体力 = Number(角色?.sta ?? 角色?.体力 ?? 角色?.属性?.体力 ?? 0);
        const 体力上限 = Math.max(1, Number(角色?.sta_max ?? 角色?.体力上限 ?? 角色?.属性?.体力上限 ?? 1));
        return 限制行为概率(当前体力 / 体力上限, 0, 1);
      }

      function 计算行为出手承诺(动作 = {}) {
        if (!动作 || 动作.__行为防反 === true) return 0.08;
        const 技能 = 动作.skill && typeof 动作.skill === 'object' ? 动作.skill : {};
        const 动作名 = String(动作.action_type || 动作.type || 技能.name || 技能.魂技名 || '').trim();
        if (/防御|闪避|撤离|观察|架势|守势/.test(动作名) && !/攻击|伤害|强攻/.test(动作名)) return 0.04;

        const 技能类型 = getSkillType(技能);
        const 运行信息 = getSkillRuntimeMeta(技能);
        const 目标模型 = normalizeBattleSkillTargetModel(运行信息.目标模型 || getSkillTarget(技能), '敌方单体');
        if (['自身', '友方单体', '友方群体'].includes(目标模型)) return 0.05;

        const 主伤害 = getPrimaryDamageEffect(技能) || {};
        const 效果列表 = getSkillEffects(技能);
        const 威力倍率 = Number(主伤害.威力倍率 || 0);
        const 伤害类型 = String(主伤害.伤害类型 || '');
        let 承诺 = 动作名 === '常规攻击' || 技能.name === '普通攻击' ? 0.16 : 0.1;

        if (技能类型 === '输出') 承诺 += 0.16;
        if (技能类型 === '控制') 承诺 += 0.08;
        if (目标模型 === '敌方单体') 承诺 += 0.04;
        if (目标模型 === '敌方群体' || 目标模型 === '全场') 承诺 += 0.02;
        if (/物理近战/.test(伤害类型)) 承诺 += 0.14;
        else if (/能量/.test(伤害类型)) 承诺 += 0.08;
        else if (/精神/.test(伤害类型)) 承诺 += 0.04;
        承诺 += Math.min(0.22, Math.max(0, 威力倍率 - 80) / 500);
        if (效果列表.some(effect => ['多段伤害', '追击', '追击位移', '强制位移', '位移交换'].includes(String(effect?.机制 || ''))))
          承诺 += 0.08;
        if (效果列表.some(effect => String(effect?.机制 || '') === '自残换收益')) 承诺 += 0.1;

        return 限制行为概率(承诺, 0.03, 0.82);
      }

      function 计算行为防反倾向(角色 = {}, 防反类型 = '') {
        const 系别 = String(角色?.type || 角色?.系别 || '').trim();
        if (防反类型 === '完美闪避') {
          if (系别 === '敏攻系') return 0.14;
          if (系别 === '精神系' || 系别 === '控制系') return 0.06;
          if (系别 === '防御系') return -0.04;
          return 0;
        }
        if (防反类型 === '硬抗换伤') {
          if (系别 === '防御系') return 0.16;
          if (系别 === '强攻系') return 0.12;
          if (系别 === '敏攻系') return -0.03;
          if (['辅助系', '治疗系', '食物系'].includes(系别)) return -0.06;
        }
        return 0;
      }

      function 计算行为防反概率(配置 = {}) {
        const 原动作 = 配置.原动作 || {};
        if (原动作.__行为防反 === true) return 0;
        const 防反方 = 配置.防反方;
        const 攻击方 = 配置.攻击方;
        if (!isCombatUnitAbleToFight(防反方) || !isCombatUnitAbleToFight(攻击方)) return 0;
        const 防反类型 = String(配置.防反类型 || '').trim();
        const 反应余量 = Number(配置.反应余量 || 0);
        if (反应余量 < 0.85) return 0;

        const 出手承诺 = Number.isFinite(Number(配置.出手承诺))
          ? Number(配置.出手承诺)
          : 计算行为出手承诺(原动作);
        const 体力比 = 读取行为体力比(防反方);
        const 战斗经验 = 配置.战斗经验 || 计算行为战斗经验(防反方, 攻击方, 配置.战斗数据 || {});
        const 经验稳定度 = 限制行为概率(Number(战斗经验?.稳定度 || 0), 0, 1);
        let 概率 = 防反类型 === '完美闪避' ? 0.06 : 0.05;
        概率 += 限制行为概率((反应余量 - 0.85) * 0.16, 0, 0.22);
        概率 += 出手承诺 * 0.32;
        概率 += 计算行为防反倾向(防反方, 防反类型);
        概率 += (体力比 - 0.35) * 0.18;
        概率 += (经验稳定度 - 0.45) * 0.12;

        if (防反类型 === '完美闪避') {
          const 闪避率 = Number(配置.闪避率 || 0);
          const 闪避投点 = Number(配置.闪避投点 || 0);
          const 闪避余量 = (闪避率 - 闪避投点) / 100;
          if (闪避余量 < 0.08) return 0;
          概率 += 限制行为概率(闪避余量 * 0.55, 0, 0.28);
          if (String(配置.反应动作?.type || '') !== '伺机闪避') 概率 *= 0.55;
          return 限制行为概率(概率, 0, 0.68);
        }

        if (防反类型 === '硬抗换伤') {
          const 伤害值 = Math.max(0, Number(配置.实际伤害 ?? 配置.预计伤害 ?? 0));
          const 承伤比 = 伤害值 / Math.max(1, getCombatHpMaxValue(防反方));
          const 战斗类型 = String(配置.战斗类型 || 配置.战斗数据?.战斗类型 || '').trim();
          const 是虚拟战 = /虚拟|升灵台|模拟/.test(战斗类型);
          const 允许绝境换伤 = 配置.以命换伤 === true && !是虚拟战;
          if (!(伤害值 > 0) || (承伤比 > 0.45 && !允许绝境换伤)) return 0;
          if (承伤比 <= 0.12) 概率 += 0.18;
          else if (承伤比 <= 0.25) 概率 += 0.08;
          else if (允许绝境换伤) {
            const 实力差距 = 计算行为实力差距(攻击方, 防反方);
            概率 = Math.max(概率 * 0.45, 0.04 + Math.min(0.16, 实力差距 * 0.18));
            概率 -= Math.max(0, 承伤比 - 0.45) * 0.28;
            概率 += (1 - 经验稳定度) * 0.05;
          } else 概率 -= (承伤比 - 0.25) * 0.9;
          if (String(配置.反应动作?.type || '') !== '肉体兜底') 概率 *= 0.7;
          return 限制行为概率(概率, 0, 允许绝境换伤 ? 0.42 : 0.58);
        }

        return 0;
      }

      function 建立行为防反动作(防反方, 防反候选 = {}) {
        const 防反类型 = 防反候选.以命换伤 === true
          ? '以命换伤'
          : String(防反候选.防反类型 || '行为防反').trim();
        const 出手承诺 = Number(防反候选.出手承诺 || 0);
        const 触发概率 = Number(防反候选.触发概率 || 0);
        const 系别 = String(防反方?.type || 防反方?.系别 || '').trim();
        const 基础威力 = 防反类型 === '完美闪避' ? 55 : 防反类型 === '以命换伤' ? 92 : 70;
        const 系别倍率 = 防反类型 === '完美闪避'
          ? 系别 === '敏攻系'
            ? 1.18
            : 系别 === '精神系'
              ? 1.08
              : 1
          : 系别 === '防御系'
            ? 1.2
            : 系别 === '强攻系'
              ? 1.15
              : 1;
        const 威力倍率 = Math.max(35, Math.floor(基础威力 * 系别倍率 * (1 + 出手承诺 * 0.65 + Math.max(0, 触发概率 - 0.25))));
        const 伤害类型 = 系别 === '精神系' ? '纯精神冲击' : 系别 === '元素系' ? '能量AOE' : '物理近战';
        return {
          action_type: '行为防反',
          type: '行为防反',
          cast_time: 0,
          __行为防反: true,
          skill: normalizeSkillData(
            {
              name: `${防反类型}防反`,
              技能类型: '输出',
              消耗: '无',
              cast_time: 0,
              _效果数组: [
                { 机制: '系统基础', 消耗: '无', 对象: '敌方/单体', 技能类型: '输出', cast_time: 0 },
                { 机制: '直接伤害', 目标: '敌方单体', 威力倍率, 伤害类型, 穿透修饰: 0 },
              ],
            },
            `${防反类型}防反`,
          ),
        };
      }

      function estimateIncomingActionThreat(attacker, defender, playerAction, combatData) {
        const skill = playerAction?.skill && typeof playerAction.skill === 'object' ? playerAction.skill : null;
        const defaultThreat = {
          targetHitsDefender: false,
          projectedDamage: 0,
          projectedDamageRatio: 0,
          projectedRemainingHp: getCombatHpValue(defender),
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
        const conditionArmorPen = 读取状态穿透比例(attackerConditionEffects);
        let projectedDamage = 0;
        let actualDef = 计算穿透后防御值(Number(defenderFinalStat.def || defender.def || 1), pClash?.穿透修饰 || 0, conditionArmorPen);
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
        const currentHp = getCombatHpValue(defender);
        const maxHp = getCombatHpMaxValue(defender);
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
          isBattleSkillControlProfile(skill, { calc: pStateCalc, summary: deriveBattleSummaryFromEffects(skill) });
        const enemySnapshot = buildConditionTacticalSnapshot(defender);
        const shieldBreakThreat =
          enemySnapshot.hasShielded &&
          isBattleSkillShieldBreakProfile(skill, { damage: pClash });
        const antiHealThreat = isBattleSkillAntiHealProfile(skill, { calc: pStateCalc });
        const dotDetonateThreat = isBattleSkillDotDetonateProfile(skill) && enemySnapshot.debuffCount > 0;
        const skillSealThreat = isBattleSkillSealProfile(skill, { calc: pStateCalc });
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

        const 施放分支 = String(playerAction?.分支标记 || playerAction?.skill?._runtime_分支标记 || '').trim();
        if (施放分支) result.desc += ` [分支选择] 当前使用${施放分支}。`;

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
        const directResourceDrainEffect = actionEffects.find(effect => effect?.机制 === '吞噬') || null;
        const 是能力共享机制效果 = effect => {
          const 机制名 = String(effect?.机制 || effect?.名称 || effect?.类型 || '').trim();
          if (!机制名) return false;
          if (机制名 === '能力共享') return true;
          return String(getBattleSkillMechanismMeta(机制名)?.运行时消费器 || '').trim() === 'resource_refeed';
        };
        const directResourceRefeedEffect = actionEffects.find(effect => 是能力共享机制效果(effect)) || null;
        const directResourceBurnEffect = actionEffects.find(effect => effect?.机制 === '资源燃烧') || null;
        const directResourceLockEffect = actionEffects.find(effect => effect?.机制 === '资源锁定') || null;
        const directDamageChainEffect = actionEffects.find(effect => effect?.机制 === '伤害链') || null;
        const directLifeLinkEffect = actionEffects.find(effect => effect?.机制 === '生命链接') || null;
        const directDotExtendEffect = actionEffects.find(effect => effect?.机制 === '延长持续伤害') || null;
        const directDotCompressEffect = actionEffects.find(effect => effect?.机制 === '压缩持续伤害') || null;
        const directDotSplitStoreEffect = actionEffects.find(effect => effect?.机制 === '拆层转存') || null;
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
        const 引爆移除状态标记集 = new Set();
        const 能力共享自身预禁用 = (() => {
          const 命中禁用规则 = effect => {
            const 规则列表 = normalizeBattleObjectDiffRuleList(effect?.对象差异规则 || []);
            return 规则列表.some(
              规则 =>
                String(规则?.处理 || '').trim() === '禁用' &&
                Array.isArray(规则?.匹配) &&
                规则.匹配.some(tag => normalizeBattleObjectDiffMatchToken(tag) === '自身'),
            );
          };
          const 运行态能力共享效果列表 = actionEffects.filter(effect => 是能力共享机制效果(effect));
          const 原始能力共享效果列表 = Array.isArray(playerAction?.skill?._效果数组)
            ? playerAction.skill._效果数组.filter(effect => 是能力共享机制效果(effect))
            : [];
          const 候选效果列表 = [...运行态能力共享效果列表, ...原始能力共享效果列表];
          const 原始效果文本 = (() => {
            try {
              return JSON.stringify(playerAction?.skill?._效果数组 || []);
            } catch (error) {
              return '';
            }
          })();
          const 原始文本命中 =
            /"机制"\s*:\s*"能力共享"/.test(原始效果文本) &&
            /"条件"\s*:\s*"自身"/.test(原始效果文本) &&
            /"处理"\s*:\s*"禁用"/.test(原始效果文本);
          return 候选效果列表.some(effect => 命中禁用规则(effect)) || 原始文本命中;
        })();
        if (能力共享自身预禁用) attacker.__禁用本回合自然恢复 = true;
        let 能力共享自身禁用命中 = 能力共享自身预禁用;
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
        const 登记行为防反候选 = (防反类型, 防反方, 参数 = {}) => {
          if (!防反方 || playerAction?.__行为防反 === true || result.__行为防反候选) return;
          const 反应余量 = Number(
            参数.反应余量 ?? calculateReactionRatio(attacker, 防反方, playerAction, combatData),
          );
          const 出手承诺 = 计算行为出手承诺(playerAction);
          const 触发概率 = 计算行为防反概率({
            防反类型,
            防反方,
            攻击方: attacker,
            原动作: playerAction,
            反应动作: npcAction,
            反应余量,
            出手承诺,
            战斗数据: combatData,
            闪避率: 参数.闪避率,
            闪避投点: 参数.闪避投点,
            预计伤害: 参数.预计伤害,
            实际伤害: 参数.实际伤害,
            以命换伤: 参数.以命换伤,
          });
          if (!(触发概率 > 0)) return;
          result.__行为防反候选 = {
            防反类型,
            防反方,
            攻击方: attacker,
            原动作: playerAction,
            反应动作: npcAction,
            反应余量,
            出手承诺,
            触发概率,
            预计伤害: Math.max(0, Number(参数.预计伤害 || 0)),
            以命换伤: 参数.以命换伤 === true,
            闪避率: Number(参数.闪避率 || 0),
            闪避投点: Number(参数.闪避投点 || 0),
          };
        };
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

        const conditionArmorPen = 读取状态穿透比例(attackerConditionEffects);
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
          const targetDodgeBonus = 计算有效闪避加值(Number(targetObj.temp_dodge_bonus || 0));
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
                登记行为防反候选('完美闪避', targetObj, {
                  闪避率: 100,
                  闪避投点: 0,
                  反应动作: npcAction,
                });
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
              if (targetUsesReactionAction && !isAOE) {
                登记行为防反候选('完美闪避', targetObj, {
                  闪避率: dodgeRate,
                  闪避投点: dodgeRoll,
                  反应动作: npcAction,
                });
              }
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

          let actualDef = 计算穿透后防御值(Number(targetFinalStat.def || targetObj.def || 1), pClash.穿透修饰 || 0, conditionArmorPen);
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
            const judgeKey = String(directExecuteEffect.判定属性 || 'hp_ratio');
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

          if (targetUsesReactionAction && !isAOE && npcAction.type === '肉体兜底' && projectedDamage > 0) {
            const 允许绝境换伤 = 判定行为绝境换伤窗口(targetObj, attacker, combatData, projectedDamage);
            const 结算后生命 = getCombatHpValue(targetObj) - projectedDamage;
            if (结算后生命 <= 0 && !允许绝境换伤) {
              return {
                target: targetObj,
                targetName,
                damage: Math.max(0, Math.floor(projectedDamage)),
                kind: index === 0 ? 'primary' : 'secondary',
                logs: localLogParts,
              };
            }
            登记行为防反候选('硬抗换伤', targetObj, {
              预计伤害: projectedDamage,
              反应动作: npcAction,
              以命换伤: 允许绝境换伤 && 结算后生命 <= 0,
            });
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
            设置战斗血量值(
              attacker,
              Math.min(getCombatHpMaxValue(attacker), getCombatHpValue(attacker) + lifeStealAmount),
            );
            result.desc +=
              directDamageToHealRatio > 0
                ? ` [伤转回生] 玩家将部分伤害转化为回复，额外恢复了 ${lifeStealAmount} 点HP。`
                : ` [吸取反哺] 玩家额外恢复了 ${lifeStealAmount} 点HP。`;
          }
        }

        if (Number(result.backlash_dmg || 0) > 0) {
          const backlashDamage = Math.max(0, Math.floor(Number(result.backlash_dmg || 0)));
          设置战斗血量值(attacker, getCombatHpValue(attacker) - backlashDamage);
          result.desc += ` [反噬结算] 玩家额外承受了 ${backlashDamage} 点反噬伤害。`;
        }
        if (Number(result.totalProjectedDamage || 0) > 0) {
          result.desc += isAOE
            ? ` 本次共投射 ${Number(result.totalProjectedDamage || 0)} 点伤害。`
            : ` 造成了 ${Number(result.dmg || 0)} 点最终伤害。`;
          if (selfMirrorEffect && primaryResolvedTarget !== attacker) {
            const selfEchoDamage = Math.max(1, Math.floor(Number(result.dmg || 0)));
            设置战斗血量值(attacker, getCombatHpValue(attacker) - selfEchoDamage);
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
        const resolveDirectMechanismTargetList = (effect, options = {}) => {
          const mechanism = String(effect?.机制 || effect?.名称 || effect?.类型 || '').trim();
          if (['资源锁定', '召唤与场地', '生命链接'].includes(mechanism)) {
            const hostileTarget = defender && defender !== attacker ? defender : null;
            const friendlyTarget = attacker || null;
            const contextHint = String(effect?.目标 || effect?.对象 || effect?.目标模型 || '').trim();
            const pickTarget = /自身|己方|友方/.test(contextHint) ? friendlyTarget : hostileTarget || friendlyTarget;
            if (options.single === true) return pickTarget || null;
            return pickTarget ? [pickTarget] : [];
          }
          const targetContext = getEffectTargetContext(effect);
          let targets = Array.isArray(targetContext?.targetSet) ? [...targetContext.targetSet] : [];
          const targetHint = String(
            effect?.目标 ||
            effect?.对象 ||
            effect?.目标覆盖 ||
            playerAction?.skill?.对象 ||
            playerAction?.skill?.目标模型 ||
            '',
          ).trim();
          const hostileHint = /敌方单体|敌方群体|敌方\/单体|敌方\/群体|敌方/.test(targetHint);
          const friendlyHint = /友方单体|友方群体|己方\/单体|己方\/群体|友方|己方|自身/.test(targetHint);
          if (hostileHint) {
            const filteredTargets = targets.filter(targetObj => targetObj && targetObj !== attacker);
            targets = filteredTargets.length > 0 ? filteredTargets : defender && defender !== attacker ? [defender] : [];
          } else if (friendlyHint && (!targets.length || targets.every(targetObj => !targetObj))) {
            targets = attacker ? [attacker] : [];
          }
          if (options.single === true) return targets[0] || null;
          return targets;
        };

        const applyImmediateRecoveryEffect = (effect, resourceKey, labelText) => {
          if (!effect || Number(result.backlash_dmg || 0) > 0) return 0;
          const effectTargetContext = getEffectTargetContext(effect);
          const targetUnits = resolveDirectMechanismTargetList(effect);
          if (!targetUnits.length) return 0;
          const isFriendly = ['自身', '友方单体', '友方群体'].includes(effectTargetContext.targetModel);
          let totalRecovered = 0;
          targetUnits.forEach(targetObj => {
            const diffResult = resolveBattleObjectDiffEffect(effect, attacker, targetObj, effectTargetContext);
            if (!diffResult.生效) {
              const 命中条件 = Array.isArray(diffResult?.命中规则?.匹配)
                ? diffResult.命中规则.匹配.join('/')
                : String(diffResult?.命中规则?.条件 || '禁用').trim();
              result.desc += ` [对象差异] ${targetObj === attacker ? '自身' : targetObj.name}命中规则[${命中条件 || '禁用'}]，本次${labelText}效果不生效。`;
              return;
            }
            const resolvedEffect = diffResult.生效效果 || effect;
            const ratio = Number(resolvedEffect.数值 || 0);
            if (!(ratio > 0)) return;
            if (isMechanismSuppressionBlocking(targetObj, ['回复机制'])) {
              result.desc += ` [机制抹消] ${targetObj === attacker ? '自身' : targetObj.name}的回复回路被封锁，${labelText}恢复未能生效。`;
              return;
            }
            const targetFinalStat = targetObj?.final || buildCombatFinalStats(targetObj);
            const supportScale = isFriendly ? getSupportEffectScale(attacker, targetObj) : 1;
            const targetConditionEffects = targetObj.状态效果
              ? Object.values(targetObj.状态效果).map(c => c?.战斗效果 || {})
              : [];
            let maxResource = 0;
            if (resourceKey === 'vit') maxResource = getCombatHpMaxValue(targetObj);
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
            const convertToDamage =
              String(resolvedEffect?.对象差异处理 || '').trim() === '转为伤害' ||
              String(resolvedEffect?.机制 || '').trim() === '直接伤害';
            if (convertToDamage) {
              const damageScale = Math.max(0, Number(resolvedEffect?.对象差异伤害倍率 ?? resolvedEffect?.伤害倍率 ?? 1));
              const damage = Math.max(1, Math.floor(amount * (damageScale > 0 ? damageScale : 1)));
              设置战斗血量值(targetObj, getCombatHpValue(targetObj) - damage);
              totalRecovered += damage;
              result.desc += ` [对象差异] ${targetObj === attacker ? '自身' : targetObj.name}命中差异规则，${labelText}被转化为 ${damage} 点伤害。`;
              return;
            }
            const healInvertRatio =
              resourceKey === 'vit'
                ? Math.max(0, targetConditionEffects.reduce((maxVal, ce) => Math.max(maxVal, Number(ce.heal_inversion_ratio || 0)), 0))
                : 0;
            if (resourceKey === 'vit' && healInvertRatio > 0) {
              const invertedDamage = Math.max(1, Math.floor(amount * Math.max(1, healInvertRatio)));
              设置战斗血量值(targetObj, getCombatHpValue(targetObj) - invertedDamage);
              totalRecovered += invertedDamage;
              result.desc += ` [治疗反转] ${targetObj === attacker ? '自身' : targetObj.name}的治疗被扭成伤害，反而损失了 ${invertedDamage} 点HP。`;
              return;
            }
            if (resourceKey === 'vit') 设置战斗血量值(targetObj, Math.min(maxResource, getCombatHpValue(targetObj) + amount));
            else targetObj[resourceKey] = Math.min(maxResource, Number(targetObj[resourceKey] || 0) + amount);
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
          const targetObj = resolveDirectMechanismTargetList(effect, { single: true });
          if (!targetObj || targetObj === attacker) {
            result.desc += ` [状态转移] 缺少有效转移目标。`;
            return false;
          }
          const transferMode = String(effect?.转移类型 || '自身负面->目标').trim() || '自身负面->目标';
          const transferCount = Math.max(1, Number(effect?.转移数量 || effect?.transfer_count || 1));
          const transferLogs = [];
          for (let index = 0; index < transferCount; index += 1) {
            const sourceChar = String(transferMode).startsWith('目标') ? targetObj : attacker;
            const candidate = /目标正面->自身/.test(transferMode)
              ? pickTransferableCondition(targetObj, ['buff'])
              : pickTransferableCondition(sourceChar, ['debuff', 'buff']);
            if (!candidate) break;
            const moved = removeConditionWithSustain(sourceChar, candidate.key);
            if (!moved) continue;
            const receiver = sourceChar === attacker ? targetObj : attacker;
            moved.描述 = `由[${skillName || '技能'}]自${sourceChar.name || '自身'}转移至${receiver.name || '自身'}`;
            const nextKey = putConditionWithUniqueKey(receiver, candidate.key, moved);
            transferLogs.push(
              `${sourceChar === attacker ? '自身' : sourceChar.name}的[${candidate.key}]被转移到${receiver === attacker ? '自身' : receiver.name}，现为[${nextKey}]`,
            );
          }
          if (!transferLogs.length) {
            result.desc += ` [状态转移] 没有找到可转移的状态。`;
            return false;
          }
          result.desc += ` [状态转移] ${transferLogs.join('；')}。`;
          return true;
        };

        const applyDotDetonateEffect = effect => {
          if (!effect) return 0;
          const 目标列表 = resolveDirectMechanismTargetList(effect);
          const targetUnits = 目标列表.length
            ? 目标列表
            : (defender && defender !== attacker ? [defender] : (attacker ? [attacker] : []));
          const ratio = Math.max(0.1, Number(effect?.引爆倍率 || effect?.detonate_ratio || 1));
          let totalAddedDamage = 0;
          targetUnits.forEach(targetObj => {
            if (!targetObj?.状态效果) return;
            let consumedDot = 0;
            const 目标标记名 = String(targetObj?.name || (targetObj === attacker ? '自身' : '') || '').trim();
            Object.entries(targetObj.状态效果).forEach(([key, cond]) => {
              const dotDamage = Math.max(0, Number(cond?.战斗效果?.dot_damage || cond?.战斗效果?.持续伤害 || 0));
              if (!(dotDamage > 0)) return;
              consumedDot += dotDamage;
              if (effect?.消耗持续伤害 !== false) {
                const 移除快照 = removeConditionWithSustain(targetObj, key);
                if (移除快照) 引爆移除状态标记集.add(`${目标标记名}::${String(key || '').trim()}`);
                else if (targetObj?.状态效果?.[key]) {
                  delete targetObj.状态效果[key];
                  引爆移除状态标记集.add(`${目标标记名}::${String(key || '').trim()}`);
                }
              }
            });
            if (!(consumedDot > 0)) return;
            const bonusDamage = Math.max(1, Math.floor(consumedDot * ratio));
            appendProjectedDamageToSettleResult(result, targetObj, bonusDamage, 'dot_detonate');
            totalAddedDamage += bonusDamage;
            result.desc += ` [持续引爆] ${targetObj === attacker ? '自身' : targetObj.name}身上的持续伤害被引爆，追加 ${bonusDamage} 点伤害。`;
          });
          return totalAddedDamage;
        };

        const applyDotDurationAdjustEffect = effect => {
          if (!effect) return false;
          const mechanism = String(effect?.机制 || '').trim();
          const targetUnits = resolveDirectMechanismTargetList(effect);
          if (!targetUnits.length) return false;
          let changed = false;
          targetUnits.forEach(targetObj => {
            if (!targetObj?.状态效果) return;
            Object.entries(targetObj.状态效果).forEach(([key, cond]) => {
              const ce = cond?.战斗效果 || {};
              if (!(Number(ce.dot_damage || 0) > 0)) return;
              const durationRaw = Number(cond?.duration || 0);
              if (mechanism === '延长持续伤害') {
                const addRounds = Math.max(1, Number(effect?.延长回合 || effect?.extend_rounds || effect?.持续回合 || 1));
                cond.duration = Math.max(durationRaw, 1) + addRounds;
                changed = true;
                return;
              }
              if (mechanism === '压缩持续伤害') {
                const consumeRounds = Math.max(1, Number(effect?.压缩回合 || effect?.consume_rounds || 1));
                const compressRatio = Math.max(1, Number(effect?.压缩倍率 || effect?.compress_ratio || 1.2));
                const usableRounds = Math.max(0, Math.min(consumeRounds, durationRaw));
                if (usableRounds > 0) {
                  const bonusDamage = Math.max(1, Math.floor(Number(ce.dot_damage || 0) * usableRounds * compressRatio));
                  appendProjectedDamageToSettleResult(result, targetObj, bonusDamage, 'dot_compress');
                  cond.duration = Math.max(0, durationRaw - usableRounds);
                  if (cond.duration <= 0) removeConditionWithSustain(targetObj, key);
                  changed = true;
                }
              }
            });
          });
          if (changed) {
            if (mechanism === '延长持续伤害') result.desc += ` [持续调制] 目标持续伤害时窗被延长。`;
            if (mechanism === '压缩持续伤害') result.desc += ` [持续压缩] 已将部分持续伤害折算为即时打击。`;
          }
          return changed;
        };

        const applyShieldBreakEffect = effect => {
          if (!effect) return 0;
          const targetUnits = resolveDirectMechanismTargetList(effect);
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
            appendProjectedDamageToSettleResult(result, targetObj, bonusDamage, 'shield_break');
            totalAddedDamage += bonusDamage;
            result.desc += ` [斩盾爆破] ${targetObj === attacker ? '自身' : targetObj.name}的护盾被一并斩碎，追加 ${bonusDamage} 点伤害。`;
          });
          return totalAddedDamage;
        };

        const applyStealShieldEffect = effect => {
          if (!effect) return 0;
          const targetUnits = resolveDirectMechanismTargetList(effect);
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

        const resolveTransferResourceKeys = rawType => {
          const text = String(rawType || '').trim();
          if (/双|混合|全部/.test(text)) return ['sp', 'men'];
          if (/精神/.test(text)) return ['men'];
          return ['sp'];
        };

        const getTransferResourceLabel = resourceKey => {
          if (resourceKey === 'men') return '精神力';
          return '魂力';
        };

        const applyResourceDrainEffect = effect => {
          if (!effect) return 0;
          const targetUnits = resolveDirectMechanismTargetList(effect);
          const ratio = Math.max(0, Number(effect?.夺取比例 || effect?.drain_ratio || 0.18));
          const convertRatio = Math.max(0, Number(effect?.转化比例 || effect?.convert_ratio || 1));
          const resourceKeys = resolveTransferResourceKeys(effect?.资源类型 || effect?.resource_type || '');
          let totalRecovered = 0;
          targetUnits.forEach(targetObj => {
            resourceKeys.forEach(resourceKey => {
              const maxKey = resourceKey === 'sp' ? 'sp_max' : 'men_max';
              const targetCurrent = Math.max(0, Number(targetObj?.[resourceKey] || 0));
              const targetMax = Math.max(1, Number(targetObj?.[maxKey] || 0));
              const attackerMax = Math.max(1, Number(attacker?.[maxKey] || 0));
              const drainAmount = Math.min(targetCurrent, Math.max(1, Math.floor(targetMax * ratio)));
              if (!(drainAmount > 0)) return;
              targetObj[resourceKey] = Math.max(0, targetCurrent - drainAmount);
              const recoverAmount = Math.max(0, Math.floor(drainAmount * convertRatio));
              const attackerBefore = Math.max(0, Number(attacker?.[resourceKey] || 0));
              const attackerAfter = recoverAmount > 0 ? Math.min(attackerMax, attackerBefore + recoverAmount) : attackerBefore;
              const actualRecover = Math.max(0, attackerAfter - attackerBefore);
              attacker[resourceKey] = attackerAfter;
              totalRecovered += actualRecover;
              result.desc += ` [吞噬] 从${targetObj === attacker ? '自身' : targetObj.name}抽离 ${drainAmount} 点${getTransferResourceLabel(resourceKey)}，施术者回收 ${actualRecover} 点。`;
            });
          });
          return totalRecovered;
        };

        const applyResourceRefeedEffect = effect => {
          if (!effect) return 0;
          const effectTargetContext = getEffectTargetContext(effect);
          const targetUnits = resolveDirectMechanismTargetList(effect);
          let totalRecovered = 0;
          targetUnits.forEach(targetObj => {
            if (能力共享自身预禁用 && targetObj === attacker) {
              能力共享自身禁用命中 = true;
              attacker.__禁用本回合自然恢复 = true;
              result.desc += ` [对象差异] 自身命中规则[自身]，能力共享不生效。`;
              return;
            }
            const diffResult = resolveBattleObjectDiffEffect(effect, attacker, targetObj, effectTargetContext);
            if (!diffResult.生效) {
              if (targetObj === attacker) {
                能力共享自身禁用命中 = true;
                attacker.__禁用本回合自然恢复 = true;
              }
              const 命中条件 = Array.isArray(diffResult?.命中规则?.匹配)
                ? diffResult.命中规则.匹配.join('/')
                : String(diffResult?.命中规则?.条件 || '禁用').trim();
              result.desc += ` [对象差异] ${targetObj === attacker ? '自身' : targetObj.name}命中规则[${命中条件 || '禁用'}]，能力共享不生效。`;
              return;
            }
            const resolvedEffect = diffResult.生效效果 || effect;
            const ratio = Math.max(0, Number(resolvedEffect?.反灌比例 || resolvedEffect?.refeed_ratio || 0.2));
            if (!(ratio > 0)) return;
            const resourceKeys = resolveTransferResourceKeys(resolvedEffect?.资源类型 || resolvedEffect?.resource_type || '');
            if (isMechanismSuppressionBlocking(targetObj, ['回复机制'])) {
              result.desc += ` [机制抹消] ${targetObj === attacker ? '自身' : targetObj.name}的回复回路被封锁，能力共享未能生效。`;
              return;
            }
            const convertToDamage =
              String(resolvedEffect?.对象差异处理 || '').trim() === '转为伤害' ||
              String(resolvedEffect?.机制 || '').trim() === '直接伤害';
            resourceKeys.forEach(resourceKey => {
              const maxKey = resourceKey === 'sp' ? 'sp_max' : 'men_max';
              const targetMax = Math.max(1, Number(targetObj?.[maxKey] || 0));
              const gainAmount = Math.max(1, Math.floor(targetMax * ratio));
              if (convertToDamage) {
                const damageScale = Math.max(0, Number(resolvedEffect?.对象差异伤害倍率 ?? resolvedEffect?.伤害倍率 ?? 1));
                const damage = Math.max(1, Math.floor(gainAmount * (damageScale > 0 ? damageScale : 1)));
                设置战斗血量值(targetObj, getCombatHpValue(targetObj) - damage);
                totalRecovered += damage;
                result.desc += ` [对象差异] ${targetObj === attacker ? '自身' : targetObj.name}的能力共享被转译为 ${damage} 点伤害。`;
                return;
              }
              const beforeValue = Math.max(0, Number(targetObj?.[resourceKey] || 0));
              const afterValue = Math.min(targetMax, beforeValue + gainAmount);
              const actualGain = Math.max(0, afterValue - beforeValue);
              if (!(actualGain > 0)) return;
              targetObj[resourceKey] = afterValue;
              totalRecovered += actualGain;
              result.desc += ` [能力共享] 向${targetObj === attacker ? '自身' : targetObj.name}共享 ${actualGain} 点${getTransferResourceLabel(resourceKey)}。`;
            });
          });
          return totalRecovered;
        };

        const applyDamageChainEffect = effect => {
          if (!effect) return 0;
          const targetUnits = resolveDirectMechanismTargetList(effect);
          const chainRatio = Math.max(0.1, Number(effect?.链式比例 || effect?.chain_ratio || 0.45));
          const chainTargets = Math.max(1, Number(effect?.链式目标数 || effect?.chain_targets || 2));
          const baseDamage = Math.max(1, Number(result?.dmg || result?.totalProjectedDamage || 0));
          let totalChainDamage = 0;
          targetUnits.slice(0, chainTargets).forEach(targetObj => {
            if (!targetObj) return;
            const chainDamage = Math.max(1, Math.floor(baseDamage * chainRatio));
            appendProjectedDamageToSettleResult(result, targetObj, chainDamage, 'damage_chain');
            totalChainDamage += chainDamage;
            result.desc += ` [伤害链] ${targetObj === attacker ? '自身' : targetObj.name}承受链式伤害 ${chainDamage} 点。`;
          });
          return totalChainDamage;
        };

        const applyLifeLinkEffect = effect => {
          if (!effect) return false;
          const targetUnits = resolveDirectMechanismTargetList(effect);
          const shareRatio = Math.max(0, Math.min(1, Number(effect?.分摊比例 || effect?.share_ratio || 0.35)));
          let linked = false;
          targetUnits.forEach(targetObj => {
            if (!targetObj || targetObj === attacker) return;
            if (!targetObj.状态效果) targetObj.状态效果 = {};
            targetObj.状态效果['生命链接'] = {
              类型: 'debuff',
              层数: 1,
              描述: `由[${skillName || '技能'}]施加生命链接`,
              duration: Math.max(1, Number(effect?.持续回合 || 2)),
              面板修改比例: { str: 1, def: 1, agi: 1, sp_max: 1 },
              战斗效果: {
                ...createEmptyCombatEffectMap(),
                damage_share_ratio: shareRatio,
              },
            };
            linked = true;
          });
          if (linked) result.desc += ` [生命链接] 已建立生命链接并同步承伤规则。`;
          return linked;
        };

        const applyResourceBurnEffect = effect => {
          if (!effect) return 0;
          const targetUnits = resolveDirectMechanismTargetList(effect);
          const burnRatio = Math.max(0, Number(effect?.每回合燃烧 || effect?.burn_ratio || 0.12));
          const resourceKeys = resolveTransferResourceKeys(effect?.资源类型 || effect?.resource_type || '');
          let totalBurned = 0;
          targetUnits.forEach(targetObj => {
            resourceKeys.forEach(resourceKey => {
              const maxKey = resourceKey === 'sp' ? 'sp_max' : 'men_max';
              const maxVal = Math.max(1, Number(targetObj?.[maxKey] || 0));
              const burnAmount = Math.max(1, Math.floor(maxVal * burnRatio));
              const beforeValue = Math.max(0, Number(targetObj?.[resourceKey] || 0));
              const afterValue = Math.max(0, beforeValue - burnAmount);
              const actualBurn = Math.max(0, beforeValue - afterValue);
              if (!(actualBurn > 0)) return;
              targetObj[resourceKey] = afterValue;
              totalBurned += actualBurn;
              result.desc += ` [资源燃烧] ${targetObj === attacker ? '自身' : targetObj.name}损失 ${actualBurn} 点${getTransferResourceLabel(resourceKey)}。`;
            });
          });
          return totalBurned;
        };

        const applyResourceLockEffect = effect => {
          if (!effect) return false;
          const targetUnits = resolveDirectMechanismTargetList(effect);
          const lockRatio = Math.max(0, Math.min(1, Number(effect?.锁定比例 || effect?.lock_ratio || 0.5)));
          let applied = false;
          targetUnits.forEach(targetObj => {
            if (!targetObj?.状态效果) targetObj.状态效果 = {};
            targetObj.状态效果['资源锁定'] = {
              类型: 'debuff',
              层数: 1,
              描述: `由[${skillName || '技能'}]施加资源锁定`,
              duration: Math.max(1, Number(effect?.持续回合 || 2)),
              面板修改比例: { str: 1, def: 1, agi: 1, sp_max: 1 },
              战斗效果: {
                ...createEmptyCombatEffectMap(),
                resource_block_ratio: lockRatio,
              },
            };
            applied = true;
          });
          if (applied) result.desc += ` [资源锁定] 目标资源通道已被锁定。`;
          return applied;
        };

        let applyCopyEffect = effect => {
          void effect;
          return false;
        };

        const directMechanismConsumerMap = {
          status_transfer: applyStatusTransferEffect,
          dot_detonate: applyDotDetonateEffect,
          shield_break: applyShieldBreakEffect,
          shield_steal: applyStealShieldEffect,
          resource_drain: applyResourceDrainEffect,
          resource_refeed: applyResourceRefeedEffect,
          copy_status: effect => applyCopyEffect(effect),
          damage_share: applyLifeLinkEffect,
          cost_increase: applyResourceLockEffect,
        };

        const runDirectMechanismConsumer = effect => {
          if (!effect) return false;
          const mechanism = String(effect?.机制 || effect?.名称 || effect?.类型 || '').trim();
          if (mechanism === '伤害链') return applyDamageChainEffect(effect);
          if (mechanism === '生命链接') return applyLifeLinkEffect(effect);
          if (mechanism === '资源燃烧') return applyResourceBurnEffect(effect);
          if (mechanism === '资源锁定') return applyResourceLockEffect(effect);
          if (mechanism === '延长持续伤害' || mechanism === '压缩持续伤害') {
            return applyDotDurationAdjustEffect(effect);
          }
          const 运行时消费器 = String(getBattleSkillMechanismMeta(effect?.机制 || effect?.名称 || effect?.类型 || '')?.运行时消费器 || '').trim();
          const consumer = 运行时消费器 ? directMechanismConsumerMap[运行时消费器] : null;
          return consumer ? consumer(effect) : false;
        };

        applyCopyEffect = effect => {
          if (!effect) return false;
          const sourceObj = resolveSkillEffectTargetCharacter(playerAction.skill, effect, attacker, defender);
          const 复制类型 = String(effect?.复制类型 || '').trim();
          const 机制名称 = String(effect?.机制 || effect?.名称 || effect?.类型 || '').trim();
          const 优先类型列表 =
            复制类型 === 'debuff'
              ? ['debuff', 'buff']
              : 复制类型 === 'buff'
                ? ['buff', 'debuff']
                : 机制名称 === '拆层转存'
                  ? ['debuff', 'buff']
                  : ['buff', 'debuff'];
          const candidate = pickTransferableCondition(sourceObj, 优先类型列表);
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
        } else if ((pState.计算层效果?.sp_gain_ratio || 0) > 0 && !能力共享自身禁用命中) {
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
        } else if ((pState.计算层效果?.men_gain_ratio || 0) > 0 && !能力共享自身禁用命中) {
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
          [
            directStatusTransferEffect,
            directDotDetonateEffect,
            directShieldBreakEffect,
            directShieldStealEffect,
            directResourceDrainEffect,
            directResourceRefeedEffect,
            directResourceBurnEffect,
            directResourceLockEffect,
            directDamageChainEffect,
            directLifeLinkEffect,
            directDotExtendEffect,
            directDotCompressEffect,
            directDotSplitStoreEffect,
          ]
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
            const skillSideEffects = getBattleSkillSideEffectList(playerAction.skill).filter(item =>
              ['回合结束时', '状态结束后'].includes(String(item?.触发时机 || '').trim()),
            );
            const stateTargetContext = getEffectTargetContext(pState);
            const stateTargets = stateTargetContext.targetSet;
            const stateTargetsFriendly = ['自身', '友方单体', '友方群体'].includes(stateTargetContext.targetModel);
            stateTargets.forEach(targetObj => {
              const 状态名 = String(pState.状态名称 || '').trim();
              const 目标标记名 = String(targetObj?.name || (targetObj === attacker ? '自身' : '') || '').trim();
              if (
                directDotDetonateEffect &&
                状态名 &&
                引爆移除状态标记集.has(`${目标标记名}::${状态名}`)
              ) {
                result.desc += ` [持续引爆] ${targetObj === attacker ? '自身' : targetObj.name}的[${状态名}]已被引爆消耗，本回合不重复附着。`;
                return;
              }
              const targetFinalStat = targetObj?.final || buildCombatFinalStats(targetObj);
              const targetConditionEffects = targetObj.状态效果
                ? Object.values(targetObj.状态效果).map(c => c?.战斗效果 || {})
                : [];
              const selfRedirectedDebuff =
                hostileTargetRedirectedToSelf && targetObj === attacker && !stateTargetsFriendly;
              let isBuff =
                (!selfRedirectedDebuff && targetObj === attacker) ||
                stateTargetsFriendly ||
                String(pState.特殊机制标识 || '无').includes('增益') ||
                pState.计算层效果?.super_armor === true ||
                Number(pState.计算层效果?.min_hp_floor || 0) > 0 ||
                Number(pState.计算层效果?.hot_heal_ratio || 0) > 0;
              const pendingStateTags = collectBattleMechanismTagsFromDescriptor(
                pState.状态名称 || playerAction.skill.name || '',
                {
                  类型: isBuff ? 'buff' : 'debuff',
                  战斗效果: pState.计算层效果 || {},
                  shield_value:
                    Number(pState.计算层效果?.shield_gain_bonus || 0) > 0 ||
                    Number(pState.计算层效果?.shield_gain_mult || 1) > 1
                      ? 1
                      : 0,
                },
              );
              if (pendingStateTags.length && isMechanismSuppressionBlocking(targetObj, pendingStateTags)) {
                result.desc += ` [机制抹消] ${targetObj === attacker ? '自身' : targetObj.name}对[${pendingStateTags.join('/')}]存在封锁，本次状态未能附着。`;
                return;
              }
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
                副作用列表: skillSideEffects.filter(item => {
                  const boundState = String(item?.关联状态 || '').trim();
                  return !boundState || boundState === pState.状态名称;
                }),
                机制抹消目标: normalizeBattleMechanismSuppressionTargets(pState.机制抹消目标 || []),
                机制抹消方式: normalizeBattleMechanismSuppressionMode(pState.机制抹消方式 || ''),
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
                  cost_ratio: scaledCalc?.cost_ratio ?? 1.0,
                  windup_ratio: scaledCalc?.windup_ratio ?? 1.0,
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
                const 护卫次数 = Math.max(0, Number(directGuardEffect.护卫次数 ?? directGuardEffect.guard_count ?? 0));
                if (护卫次数 > 0) targetObj.状态效果[pState.状态名称].护卫剩余次数 = 护卫次数;
              }
              if (targetObj.状态效果[pState.状态名称].机制抹消目标.length) {
                const removedStates = /移除/.test(targetObj.状态效果[pState.状态名称].机制抹消方式)
                  ? removeSuppressedMechanismStates(
                      targetObj,
                      targetObj.状态效果[pState.状态名称].机制抹消目标,
                      { excludeKeys: [pState.状态名称] },
                    )
                  : [];
                if (removedStates.length > 0) {
                  result.desc += ` [机制抹消] ${targetObj === attacker ? '自身' : targetObj.name}的[${removedStates.join('/')}]被直接抹除。`;
                }
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

          const immediateSideEffects = getBattleSkillSideEffectList(playerAction.skill).filter(item =>
            ['施放后', '命中后'].includes(String(item?.触发时机 || '').trim()),
          );
          if (immediateSideEffects.length > 0) {
            const sideEffectTargetContext = resolveSkillTargetContext(playerAction.skill, attacker, defender, combatData);
            const sideEffectTargets = Array.isArray(sideEffectTargetContext?.targetSet)
              ? sideEffectTargetContext.targetSet.filter(Boolean)
              : [defender].filter(Boolean);
            const sideEffectLogs = [];
            immediateSideEffects.forEach(item => {
              resolveBattleSideEffectTargets(item, attacker, sideEffectTargets).forEach(targetChar => {
                applyBattleSideEffectState(targetChar, item, playerAction.skill.name || '技能', sideEffectLogs);
              });
            });
            if (sideEffectLogs.length > 0) {
              result.desc += ` ${sideEffectLogs.join(' ')}`;
            }
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
          const 己方团队 = dedupeCombatTargetList([defender, ...((allyTeam || []).filter(Boolean))]).filter(isCombatUnitAlive);
          const 护援目标 = 选择护援队友(defender, 己方团队, attacker, {
            isChargingHighThreat,
          });
          const behaviorState = buildBattleStateContext(defender, attacker, combatData, {
            combatType,
            isDeadlyFight,
            ratio,
            isChargingHighThreat,
            playerPower,
            allyTeam: 己方团队,
            alliesCount: 己方团队.length,
            团队护援压力: Number(护援目标?.压力 || 0),
            团队护援目标名: String(护援目标?.队友?.name || ''),
          });

          const strategicBranches = [];

          if (defender.武魂融合技) {
            Object.entries(defender.武魂融合技).forEach(([fusionName, fusionSkill]) => {
              if (!isFusionSkillAvailable(defender, fusionSkill, allyTeam)) return;

              let weight = 0;
              if (isDeadlyFight) {
                if (lvDiff >= 5) weight += 80;
                if (isChargingHighThreat) weight += 60;
                if (getCombatHpRatio(defender) < 0.5) weight += 30;
              } else if (getCombatHpRatio(defender) < 0.4 || isChargingHighThreat) {
                weight += 50;
              }

              strategicBranches.push({
                name: '武魂融合技',
                weight: adjustBehaviorWeight('武魂融合技', weight, defender, attacker, behaviorState),
                build() {
                  const skill = buildFusionCombatSkill(fusionSkill, fusionName, defender);
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
              } else if (getCombatHpRatio(defender) < 0.6 || isChargingHighThreat) {
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
            if (lvDiff >= 10 && getCombatHpRatio(defender) < 0.8) weight += 60;
            else if (getCombatHpRatio(defender) < 0.3) weight += 80;
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
            if (getCombatHpRatio(defender) >= 0.9) weight += 40;
            if (getCombatHpRatio(defender) < 0.5) weight += 80;
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
                if (getCombatHpRatio(defender) >= 0.9) weight += 30;
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
            if (combatType === '死战' && getCombatHpRatio(defender) >= 0.95) {
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
            if (getCombatHpRatio(defender) < 0.4) {
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
            getCombatHpRatio(defender) < 0.15 &&
            !hasMechOrArmor
          ) {
            strategicBranches.push({
              name: '亡命奔逃',
              weight: adjustBehaviorWeight('亡命奔逃', 50, defender, attacker, behaviorState),
              build() {
                return makeNpcAction('亡命奔逃', `[濒死溃逃] NPC身受重创，丧失了战意，放弃防守转身亡命奔逃！`);
              },
            });
          } else if (!behaviorState.canFlee && getCombatHpRatio(defender) < 0.15) {
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
          选项 = {},
        ) {
          const 主动回合 = 选项.主动回合 === true;
          const attackerSpeed = attacker.agi - (playerAction.cast_time || 0) * 10;
          const isChargingHighThreat = !!behaviorState?.isChargingHighThreat;
          const threatProfile = estimateIncomingActionThreat(attacker, defender, playerAction, behaviorState?.combatData);
          const validSkills = availableSkills.filter(skill => {
            const castTime = getSkillCastTime(skill);
            const npcSpeed = defender.agi - castTime * 10;
            const cost = parseSkillCostForChar(skill, defender);
            return cost.canCast && (主动回合 || npcSpeed > Math.max(1, attackerSpeed) * 0.8);
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
                const enemyHpRatio = getCombatHpRatio(attacker);
                const myHpRatio = getCombatHpRatio(defender);
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
              const 技能来源 = String(getSkillRuntimeMeta(skill).技能来源 || '魂技').trim() || '魂技';
              const enemyHpRatio = getCombatHpRatio(attacker);
              const selfHpRatio = getCombatHpRatio(defender);
              const enemySpRatio = Math.max(0, Number(attacker.sp || 0)) / Math.max(1, Number(attacker.sp_max || 1));
              const enemyMenRatio = Math.max(0, Number(attacker.men || 0)) / Math.max(1, Number(attacker.men_max || 1));
              const fieldActive = Object.keys(defender.状态效果 || {}).some(k => /领域|场地|结界|召唤/.test(k));
              const enemySnapshot = buildConditionTacticalSnapshot(attacker);
              const selfSnapshot = buildConditionTacticalSnapshot(defender);
              const allyCount = behaviorState.alliesCount || 1;
              const selfSpRatio = Math.max(0, Number(defender.sp || 0)) / Math.max(1, Number(defender.sp_max || 1));
              const selfMenRatio = Math.max(0, Number(defender.men || 0)) / Math.max(1, Number(defender.men_max || 1));
              const hasFriendlyGrantable = skillCanGrantFriendlyMechanism(skill);
              const hasHostileSemantic = skillTargetsEnemySide(skill) && hasSkillMechanismSemantic(skill, '敌对');
              const 是团队保护 = 是团队保护技能(skill, { summary });
              const hasAntiHeal = isBattleSkillAntiHealProfile(skill, { summary });
              const defenseNature = String(summary.防御性质 || '无');
              const hasSharedVision = isBattleSkillSharedVisionProfile(skill);
              const hasCounter = defenseNature === '反制';
              const hasBlock = defenseNature === '格挡';
              const hasShield = defenseNature === '护盾';
              const hasDeathSave = defenseNature === '免死';
              const hasClone = defenseNature === '分身';
              const hasInvincible = defenseNature === '无敌';
              const hasReflect = defenseNature === '反射';
              const hasDamageShare = defenseNature === '分摊';
              const hasSubstitute = defenseNature === '替身';
              const hasRevive = defenseNature === '复苏';
              const hasSkillSeal = isBattleSkillSealProfile(skill);
              const hasHealInvert = isBattleSkillHealInvertProfile(skill);
              const hasDotDetonate = isBattleSkillDotDetonateProfile(skill);
              const hasShieldBreak = isBattleSkillShieldBreakProfile(skill);
              const hasShieldSteal = isBattleSkillShieldStealProfile(skill);
              const hasResourceDrain = isBattleSkillResourceDrainProfile(skill);
              const hasResourceRefeed = isBattleSkillResourceRefeedProfile(skill);
              const hasMechanismSuppress = isBattleSkillMechanismSuppressProfile(skill);
              const suppressTargets = hasMechanismSuppress ? getBattleSkillMechanismSuppressionTargets(skill) : [];
              const hasExecute = isBattleSkillExecuteProfile(skill, { summary });
              const hasResourceRecover = getSkillEffects(skill).some(effect =>
                isBattleRecoverEffect(effect, ['sp', 'men']),
              ) || hasResourceRefeed;
              const hasHeal = getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect, ['vit']));
              const hasDotPressure = isBattleSkillDotPressureProfile(skill);
              const hasDelayBurst = hasBattleSkillRuntimeConsumer(skill, ['delay_burst']);
              const hasVolatile = hasBattleSkillRuntimeConsumer(skill, ['self_random_variance']);
              const hasReflectiveConvert = hasBattleSkillRuntimeConsumer(skill, ['damage_to_heal', 'heal_to_damage', 'effect_reverse']);
              const penetrationValue = Number(getPrimaryDamageEffect(skill)?.穿透修饰 || 0);
              const actorMemory = ensureActorDecisionMemory(defender);
              const counterPenalty = getActorSkillCounterPenalty(defender, skill.name || skill.技能名称 || '');

              if (['控制类', '削弱类'].includes(mainType)) weight += 15;
              if (mainType === '增益类' && behaviorState.round <= 2) weight += 20;
              if (mainType === '特殊规则类') weight -= 5;
              if (决策标签.includes('保命型') && (selfHpRatio < 0.55 || isChargingHighThreat)) weight += 12;
              if (决策标签.includes('团队保护型') && allyCount > 1) weight += 10;
              if (是团队保护 && allyCount > 1) {
                const 护援压力 = Math.max(0, Number(behaviorState.团队护援压力 || 0));
                weight += 22 + Math.floor(护援压力 * 0.65);
                if (getSkillTargetModel(skill) !== '自身') weight += 18;
                if (defender.type === '防御系') weight += 18;
              }
              if (决策标签.includes('规则压制型') && (isChargingHighThreat || enemySnapshot.hasShielded || enemySnapshot.hasHealingTrend))
                weight += 10;
              if (技能来源 === '武魂融合技') {
                if (isChargingHighThreat || enemyHpRatio < 0.42 || selfHpRatio < 0.42) weight += 36;
                else weight -= 18;
              } else if (技能来源 === '自创魂技') {
                if (决策标签.includes('规则压制型') || hasHostileSemantic) weight += 12;
                if (hasFriendlyGrantable && allyCount > 1) weight += 8;
              }

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
              if (hasResourceDrain) {
                if (enemySpRatio > 0.45 || enemyMenRatio > 0.45) weight += 28;
                if (selfSpRatio < 0.5 || selfMenRatio < 0.5) weight += 12;
                if (isChargingHighThreat) weight += 10;
              }
              if (hasMechanismSuppress) {
                if ((suppressTargets.includes('复苏') || suppressTargets.includes('回复机制')) && enemySnapshot.hasHealingTrend) weight += 26;
                if ((suppressTargets.includes('护盾') || suppressTargets.includes('防御机制')) && enemySnapshot.hasShielded) weight += 24;
                if ((suppressTargets.includes('隐身') || suppressTargets.includes('增益')) && enemySnapshot.hasStealthed) weight += 24;
                if ((suppressTargets.includes('增益') || suppressTargets.includes('特殊规则')) && enemySnapshot.buffCount > 0)
                  weight += 14 + enemySnapshot.buffCount * 4;
                if (suppressTargets.includes('防御机制') && enemySnapshot.hasReactiveDefense) weight += 20;
              }
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

              const aiBranchId = pickBattleSkillBranchForAi(skill, {
                actor: defender,
                target: attacker,
                高威胁窗口: isChargingHighThreat,
              });
              if (aiBranchId) {
                const directionMechanismSet = new Set(
                  (Array.isArray(skill?._效果数组) ? skill._效果数组 : [])
                    .filter(effect => String(effect?.分支标记 || '').trim() === aiBranchId)
                    .map(effect => String(effect?.机制 || '').trim())
                    .filter(Boolean),
                );
                const isDirectionControl = ['硬控', '软控', '位移限制', '封技', '机制抹消'].some(name => directionMechanismSet.has(name));
                const isDirectionBuff = ['属性变化', '持续恢复', '护盾', '减伤', '无敌金身', '能力共享', '复苏'].some(name => directionMechanismSet.has(name));
                if (isChargingHighThreat && isDirectionControl) weight += 10;
                if (selfHpRatio < 0.4 && isDirectionBuff) weight += 10;
                skill._runtime_分支标记 = aiBranchId;
              }

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
            const summary = deriveBattleSummaryFromEffects(skill);
            const 技能来源 = getBattleSkillSourceCategory(skill);
            return isBattleSkillDefensiveProfile(skill, { skillType, mainType, summary, 技能来源 }) || skillType === '控制';
          });
          const atkSkills = validSkills.filter(skill => {
            const skillType = getSkillType(skill);
            const mainType = inferMainTypeFromEffects(skill);
            const summary = deriveBattleSummaryFromEffects(skill);
            return isBattleSkillOffensiveProfile(skill, { skillType, mainType, summary });
          });
          const controlSkills = validSkills.filter(skill => {
            const mainType = inferMainTypeFromEffects(skill);
            const calc = getPrimaryStateCalc(skill);
            const flags = getPrimaryStateFlags(skill);
            const summary = deriveBattleSummaryFromEffects(skill);
            return isBattleSkillControlProfile(skill, { mainType, calc, flags, summary });
          });

          const defSkillPick = pickSkillWithWeight(defSkills);
          const atkSkillPick = pickSkillWithWeight(atkSkills);
          const controlSkillPick = pickSkillWithWeight(controlSkills);
          const antiHealSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => isBattleSkillAntiHealProfile(skill)),
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
              return isBattleSkillExecuteProfile(skill, { damage: dmg, summary: deriveBattleSummaryFromEffects(skill) });
            }),
          );
          const recoverSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect))),
          );
          const teamSupportSkillPick = pickSkillWithWeight(
            validSkills.filter(
              skill => {
                const skillType = getSkillType(skill);
                const summary = deriveBattleSummaryFromEffects(skill);
                const 技能来源 = getBattleSkillSourceCategory(skill);
                return isBattleSkillTeamSupportProfile(skill, { skillType, summary, 技能来源 });
              },
            ),
          );
          const teamProtectSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => 是团队保护技能(skill, { summary: deriveBattleSummaryFromEffects(skill) })),
          );
          const invincibleSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => deriveBattleSummaryFromEffects(skill).防御性质 === '无敌'),
          );
          const shieldBreakSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => isBattleSkillShieldBreakProfile(skill)),
          );
          const shieldStealSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => isBattleSkillShieldStealProfile(skill)),
          );
          const dotDetonateSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => isBattleSkillDotDetonateProfile(skill)),
          );
          const skillSealSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => isBattleSkillSealProfile(skill)),
          );
          const healInvertSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => isBattleSkillHealInvertProfile(skill)),
          );
          const statusTransferSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => isBattleSkillTransferProfile(skill)),
          );
          const reactiveDefenseSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => isBattleSkillReactiveDefenseProfile(skill, { summary: deriveBattleSummaryFromEffects(skill) })),
          );

          const defSkill = defSkillPick.skill;
          const atkSkill = atkSkillPick.skill;
          const hardControlSkill = controlSkillPick.skill || controlSkills[0] || null;
          const antiHealSkill = antiHealSkillPick.skill || null;
          const pierceSkill = pierceSkillPick.skill || null;
          const executeSkill = executeSkillPick.skill || null;
          const recoverSkill = recoverSkillPick.skill || null;
          const teamSupportSkill = teamSupportSkillPick.skill || null;
          const teamProtectSkill = teamProtectSkillPick.skill || null;
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
            teamProtectSkillPick.trace,
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
            teamProtectSkill,
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
            teamProtectSkill,
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
          const enemyHpRatio = getCombatHpRatio(attacker);
          const selfHpRatio = getCombatHpRatio(defender);
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
          const 护援目标 = 选择护援队友(defender, behaviorState.allyTeam || [], attacker, behaviorState);
          const 护援压力 = Math.max(Number(behaviorState.团队护援压力 || 0), Number(护援目标?.压力 || 0));
          const 自身已筑防 =
            selfSnapshot.hasShielded ||
            selfSnapshot.hasDefenseBuffed ||
            selfSnapshot.hasReactiveDefense ||
            selfHpRatio >= 0.72;
          if (defender.type === '防御系' && allyCount > 1 && 护援目标 && 护援压力 >= 22) {
            if (teamProtectSkill) {
              tacticalBranches.push({
                name: '护援队友',
                weight: adjustBehaviorWeight(
                  '护援队友',
                  92 + Math.min(55, 护援压力),
                  defender,
                  attacker,
                  behaviorState,
                ),
                build() {
                  return makeNpcAction(
                    '护援队友',
                    `[护援判断] 防御系NPC判断${护援目标.队友.name || '队友'}承压更高，优先用[${teamProtectSkill.name}]替队友稳住阵线。`,
                    teamProtectSkill,
                  );
                },
              });
            }
            if (自身已筑防) {
              tacticalBranches.push({
                name: '护援队友',
                weight: adjustBehaviorWeight(
                  '护援队友',
                  82 + Math.min(48, 护援压力),
                  defender,
                  attacker,
                  behaviorState,
                ),
                build() {
                  return makeNpcAction(
                    '防御',
                    `[护援判断] 防御系NPC已具备承伤条件，直接以普防卡位保护${护援目标.队友.name || '队友'}。`,
                    建立普防护援技能(),
                  );
                },
              });
            }
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
            const normalizedSkill = skill ? normalizeSkillData(skill, skill.name || skill.技能名称 || type) : null;
            if (normalizedSkill) {
              const aiBranchId = pickBattleSkillBranchForAi(normalizedSkill, {
                actor: defender,
                target: attacker,
                高威胁窗口: !!(attacker?.蓄力技能 || (playerAction?.cast_time || 0) >= 20),
              });
              if (aiBranchId) normalizedSkill._runtime_分支标记 = aiBranchId;
            }
            return Object.assign(
              {
                type,
                log,
                skill: normalizedSkill,
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
          const isLowHealth = getCombatHpRatio(defender) < 0.3;
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
              result.backlash_dmg = Math.floor(getCombatHpMaxValue(attacker) * 0.3);
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
            前摇已结算: entry.前摇已结算 === true,
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
            action.skill = normalizeSkillData({ name: '闪避', 技能类型: '防御', 消耗: '体力:5%', cast_time: 12 }, '闪避');
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
          let 已命中明确分支 = false;
          // 为了支持多重施法，我们需要找出所有被提及的技能。但为了保持单技能模式兜底，我们先选出最主要的那个。
          // TODO: 后续可以升级为返回技能数组，这里先保留主技能逻辑，把时间累计放进 pre_actions 处理中
          let directSkills = collectCombatSkills(charData, combatData.参战者.team_player || []);
          directSkills.forEach(skill => {
            const 完整技能名 = String(skill.name || '').trim();
            const 去融合前缀名 = 完整技能名.replace(/^武魂融合技·/, '');
            const 主体技能名 = 去融合前缀名.replace(/·[^·\s]+$/, '');
            const 分支展示名 = String(skill?._runtime_分支展示名 || '').trim();
            const 命中明确分支 = !!(
              (完整技能名 && playerInput.includes(完整技能名)) ||
              (去融合前缀名 && playerInput.includes(去融合前缀名)) ||
              (分支展示名 && playerInput.includes(分支展示名))
            );
            const 命中主体技能 = !!(主体技能名 && playerInput.includes(主体技能名));
            if (命中明确分支) {
              matchedSkill = skill;
              matchedSkillName = 完整技能名 || 分支展示名;
              已命中明确分支 = true;
              return;
            }
            if (!已命中明确分支 && 命中主体技能 && !matchedSkill) {
              matchedSkill = skill;
              matchedSkillName = 完整技能名 || 主体技能名;
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
            let 融合失败原因 = '武魂融合技条件不足';
            Object.entries(charData.武魂融合技 || {}).forEach(([fusionName, fusionSkill]) => {
              const 融合可用性 = 获取融合技能可用性(charData, fusionSkill, combatData.参战者.team_player || []);
              if (!融合可用性.可用) {
                融合失败原因 = 融合可用性.原因 || 融合失败原因;
                return;
              }
              hasFusion = true;
              action.action_type = '武魂融合技';
              action.skill = buildFusionCombatSkill(fusionSkill, fusionName, charData);
              action.skill.name = `武魂融合技·${action.skill.name}`;
              action.cast_time = getSkillCastTime(action.skill) || 30;
            });
            if (!hasFusion) {
              action.action_type = '施法失败';
              action.cast_time = 0;
              action.log = `[融合失败] ${融合失败原因}`;
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
            let hpRatio = getCombatHpRatio(target);

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
            let hpRatio = getCombatHpRatio(ally);
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
          const 技能来源 = String(getSkillRuntimeMeta(skill).技能来源 || '魂技').trim() || '魂技';
          const dmg = getPrimaryDamageEffect(skill);
          const hpRatio = getCombatHpRatio(target);
          const spRatio = Math.max(0, Number(target.sp || 0)) / Math.max(1, Number(target.sp_max || 1));
          const menRatio = Math.max(0, Number(target.men || 0)) / Math.max(1, Number(target.men_max || 1));
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

          if (isBattleSkillAntiHealProfile(skill, { summary })) {
            if (snapshot.hasAntiHeal) weight -= 40;
            if (snapshot.hasHealingTrend || isSupport) weight += 70;
          }
          if (isBattleSkillExecuteProfile(skill, { summary, damage: dmg })) {
            if (hpRatio < 0.35) weight += 80;
            else if (hpRatio < 0.55) weight += 25;
            if (snapshot.isLockedOrControlled) weight += 20;
            if (snapshot.hasDotPressure) weight += 15;
          }
          if (isBattleSkillShieldBreakProfile(skill, { damage: dmg })) {
            if (snapshot.hasShielded) weight += 60;
            if (snapshot.hasDefenseBuffed || isTank) weight += 35;
          }
          if (summary.控制强度 !== '无') {
            if (!snapshot.isLockedOrControlled) weight += 30;
            else weight -= 25;
            if (target.蓄力技能) weight += 35;
          }
          if (isBattleSkillDotPressureProfile(skill)) {
            if (hpRatio > 0.55) weight += 20;
            if (snapshot.debuffCount > 0) weight += 15;
            if (hpRatio < 0.25) weight -= 15;
          }
          if (isBattleSkillDotDetonateProfile(skill) && snapshot.debuffCount > 0) {
            weight += 40 + snapshot.debuffCount * 6;
          }
          if (isBattleSkillRevealProfile(skill) && snapshot.hasStealthed) weight += 75;
          if (isBattleSkillBuffStealProfile(skill) && snapshot.buffCount > 0) weight += 60 + snapshot.buffCount * 8;
          if ((isBattleSkillShieldStealProfile(skill) || isBattleSkillShieldBreakProfile(skill, { damage: dmg })) && snapshot.hasShielded) weight += 55;
          if (isBattleSkillHealInvertProfile(skill) && snapshot.hasHealingTrend) weight += 48;
          if (isBattleSkillSealProfile(skill) && target.蓄力技能) weight += 65;
          if (isBattleSkillTauntProfile(skill)) {
            const offenseScore = Math.max(Number(target.str || 0), Number(target.men_max || 0));
            if (isSupport) weight += 20;
            weight += Math.min(45, Math.floor(offenseScore / 250));
          }
          if (isBattleSkillResourceDrainProfile(skill)) {
            if (spRatio > 0.45 || menRatio > 0.45) weight += 45;
            if (isSupport || target.蓄力技能) weight += 18;
          }
          if (isBattleSkillMechanismSuppressProfile(skill)) {
            const suppressTargets = getBattleSkillMechanismSuppressionTargets(skill);
            if ((suppressTargets.includes('复苏') || suppressTargets.includes('回复机制')) && snapshot.hasHealingTrend) weight += 58;
            if ((suppressTargets.includes('护盾') || suppressTargets.includes('防御机制')) && snapshot.hasShielded) weight += 52;
            if ((suppressTargets.includes('隐身') || suppressTargets.includes('增益')) && snapshot.hasStealthed) weight += 62;
            if ((suppressTargets.includes('增益') || suppressTargets.includes('特殊规则')) && snapshot.buffCount > 0)
              weight += 36 + snapshot.buffCount * 6;
            if (suppressTargets.includes('防御机制') && snapshot.hasReactiveDefense) weight += 38;
          }
          if (决策标签.includes('规则压制型')) {
            if (snapshot.hasShielded || snapshot.hasHealingTrend || target.蓄力技能) weight += 12;
          }
          if (技能来源 === '自创魂技') {
            if (snapshot.hasShielded || snapshot.hasHealingTrend || snapshot.hasStealthed) weight += 10;
          } else if (技能来源 === '武魂融合技') {
            if (hpRatio < 0.45 || snapshot.isLockedOrControlled) weight += 18;
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
                if (summary.爆发级别 === '高' || isBattleSkillExecuteProfile(skill, { summary, damage: getPrimaryDamageEffect(skill) })) weight += 18;
                if (summary.控制强度 !== '无') weight -= 12;
              } else if (memory.focus_reason === 'anti_heal_window') {
                  if (isBattleSkillDotPressureProfile(skill) || isBattleSkillExecuteProfile(skill, { summary, damage: getPrimaryDamageEffect(skill) }) || summary.爆发级别 !== '无') weight += 12;
              } else if (memory.focus_reason === 'armor_break_window') {
                  if (Number(getPrimaryDamageEffect(skill)?.穿透修饰 || 0) >= 15 || summary.爆发级别 === '高')
                    weight += 14;
              } else if (memory.focus_reason === 'shared_vision_focus') {
                  if (summary.目标规模 === '单体') weight += 18;
              } else if (memory.focus_reason === 'dot_pressure') {
                  if (isBattleSkillExecuteProfile(skill, { summary, damage: getPrimaryDamageEffect(skill) }) || isBattleSkillDotPressureProfile(skill) || summary.爆发级别 === '高') weight += 16;
              } else if (memory.focus_reason === 'finisher') {
                  if (isBattleSkillExecuteProfile(skill, { summary, damage: getPrimaryDamageEffect(skill) }) || summary.爆发级别 !== '无') weight += 22;
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
          const summary = deriveBattleSummaryFromEffects(skill);
          const 技能来源 = getBattleSkillSourceCategory(skill);
          const hpRatio = getCombatHpRatio(ally);
          const spRatio = Math.max(0, Number(ally.sp || 0)) / Math.max(1, Number(ally.sp_max || 1));
          const menRatio = Math.max(0, Number(ally.men || 0)) / Math.max(1, Number(ally.men_max || 1));
          const attackScore = Math.max(Number(ally.str || 0), Number(ally.men_max || 0));
          let weight = ally.name === actorChar.name ? 12 : 10;
          if (
            getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect, ['vit'])) ||
            ['护盾', '免死', '护卫', '复苏', '减伤', '格挡', '霸体', '无敌', '替身', '分摊', '反射'].includes(summary.防御性质)
          )
            weight += Math.floor((1 - hpRatio) * 120) + (snapshot.hasBadCondition ? 15 : 0);
          if (getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect, ['sp', 'men'])))
            weight += Math.floor((1 - spRatio) * 40) + Math.floor((1 - menRatio) * 40);
          if (isBattleSkillResourceRefeedProfile(skill))
            weight += Math.floor((1 - spRatio) * 55) + Math.floor((1 - menRatio) * 55);
          if (summary.协同性 === '高') weight += Math.min(40, Math.floor(attackScore / 500));
          if (summary.防御性质 === '护卫' && ally.name !== actorChar.name) weight += Math.floor((1 - hpRatio) * 120) + 36;
          if (是团队保护技能(skill, { summary }) && ally.name !== actorChar.name) {
            weight += Math.floor((1 - hpRatio) * 80) + 18;
            if (['辅助系', '治疗系', '食物系', '控制系'].includes(ally.type)) weight += 22;
            if (snapshot.isLockedOrControlled || snapshot.hasBadCondition) weight += 16;
            if (snapshot.hasShielded || snapshot.hasReactiveDefense) weight -= 12;
          }
          if (isBattleSkillTauntProfile(skill) && ally.name === actorChar.name) weight += 35;
          if (summary.防御性质 === '分身' || hasBattleSkillRuntimeConsumer(skill, ['stealth'])) {
            if (ally.name === actorChar.name) weight += 18;
            if (hpRatio < 0.5) weight += 20;
          }
          if (技能来源 === '武魂融合技' && ally.name !== actorChar.name) weight += 12;
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
          const isLowHealth = getCombatHpRatio(actor) < 0.3;

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
            { 主动回合: true },
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
            套用动作队列实际前摇(actor, action);

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
              const preCostLog = applyActionCost(actor, preAct, targets.enemyTarget);
              if (preCostLog) actionLog += preCostLog + ' ';
              if (preAct.action_type === '穿戴装备') {
                const 装备槽 = ensureBattleEquipmentSlot(actor, preAct.equip_target);
                if (装备槽) 装备槽.装备状态 = '已装备';
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
              const costLog = applyActionCost(actor, action, targets.enemyTarget);
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
          const 行为防反日志 = 执行行为防反结算(
            actor,
            finalTarget,
            action,
            reactionAction,
            settleResult,
            damagePackage,
            actorTurnCombatData,
          );
          if (行为防反日志) turnLog += ` ${行为防反日志}`;
          const fusionAftermathLog = applyFusionActionAftermath(actor, action, actorTurnCombatData);
          if (fusionAftermathLog) turnLog += ` ${fusionAftermathLog}`;

          if (reactionAction.type === '穿戴装备') {
            const actorStateCalc = getPrimaryStateCalc(action.skill);
            const actorInterruptChance = Math.max(
              Number(getSkillEffects(action.skill).find(e => e?.机制 === '打断')?.中断概率 || 0),
              Number(getFusionScaledInterruptChance(action.skill) || 0),
            );
            const isTargetInterrupted =
              appliedDamage / getCombatHpMaxValue(finalTarget) >= 0.15 ||
              actorStateCalc.skip_turn === true ||
              getPrimaryStateFlags(action.skill).includes('硬控') ||
              (actorInterruptChance > 0 && Math.random() <= Math.min(1, actorInterruptChance)) ||
              (Number(settleResult.interrupt_bonus || 0) > 0 &&
                Math.random() <= Math.min(1, Number(settleResult.interrupt_bonus || 0)));
            if (!isTargetInterrupted) {
              const 装备槽 = ensureBattleEquipmentSlot(finalTarget, reactionAction.skill.equip_target);
              if (装备槽) 装备槽.装备状态 = '已装备';
              turnLog += ` [装备生效] ${finalTarget.name}成功完成装备穿戴。`;
            } else {
              turnLog += ` [穿戴失败] ${finalTarget.name}的装备穿戴被强行打断。`;
            }
          }

          if (
            getCombatHpRatio(finalTarget) < 0.1 &&
            finalTarget !== actor &&
            !targetsFriendlyTeam
          ) {
            let hasMech = finalTarget.装备?.机甲?.等级 !== '无' && finalTarget.装备?.机甲?.状态 !== '重创';
            let hasArmor = finalTarget.装备?.斗铠?.装备状态 === '已装备';
            if (hasMech || hasArmor) {
              设置战斗血量值(finalTarget, Math.floor(getCombatHpMaxValue(finalTarget) * 0.1));
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
            actorVit: getCombatHpValue(actor),
            targetVit: getCombatHpValue(finalTarget),
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
                if (getCombatHpValue(p) <= 0) 设置战斗血量值(p, 1);
              });
              if (combatData.参战者.player && getCombatHpValue(combatData.参战者.player) <= 0) {
                设置战斗血量值(combatData.参战者.player, 1);
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
              hp: getCombatHpValue(char),
              hp_max: getCombatHpMaxValue(char),
              vit: getCombatStaminaValue(char),
              vit_max: getCombatStaminaMaxValue(char),
              sta: getCombatStaminaValue(char),
              sta_max: getCombatStaminaMaxValue(char),
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

        function 获取同队可行动单位(战斗数据, 角色数据) {
          const 玩家队伍 = [
            战斗数据?.参战者?.player,
            ...(Array.isArray(战斗数据?.参战者?.team_player) ? 战斗数据.参战者.team_player : []),
          ].filter(Boolean);
          const 敌方队伍 = [
            战斗数据?.参战者?.enemy,
            ...(Array.isArray(战斗数据?.参战者?.team_enemy) ? 战斗数据.参战者.team_enemy : []),
          ].filter(Boolean);
          const 角色标识 = String(角色数据?.name || 角色数据?.名称 || 角色数据?.charKey || 角色数据?.char_key || 角色数据?.key || '').trim();
          const 角色在玩家队 = 玩家队伍.some(unit => isCombatUnitIdentityMatch(unit, 角色标识));
          const 角色在敌方队 = 敌方队伍.some(unit => isCombatUnitIdentityMatch(unit, 角色标识));
          const 所在队伍 = 角色在玩家队 ? 玩家队伍 : 角色在敌方队 ? 敌方队伍 : 玩家队伍;
          const 已见 = new Set();
          return 所在队伍.filter(unit => {
            if (!unit || (角色标识 && isCombatUnitIdentityMatch(unit, 角色标识))) return false;
            const 单位标识 = String(unit?.name || unit?.名称 || unit?.charKey || unit?.char_key || unit?.key || '').trim();
            if (单位标识 && 已见.has(单位标识)) return false;
            if (单位标识) 已见.add(单位标识);
            return isCombatUnitAbleToFight(unit);
          });
        }

        function ui_getAvailableActions(charData, combatData) {
          if (!charData) return [];
          bindCombatParticipant(charData);
          const allyTeam = 获取同队可行动单位(combatData, charData);
          const availableSkills = collectUnifiedSkillEntries(charData, allyTeam, {
            includePassive: false,
            includeActive: true,
            includeUnavailableFusion: true,
          });

          const actions = [];
          actions.push(
            {
              id: 'basic_attack',
              type: 'tactical',
              action_type: '常规攻击',
              name: '普通攻击',
              category: '战术',
              cast_time: 10,
              cost_text: '无',
              enabled: true,
              reason: '',
              raw_skill: normalizeSkillData(
                {
                  name: '普通攻击',
                  _效果数组: [
                    { 机制: '系统基础', 消耗: '无', 对象: '敌方/单体', 技能类型: '输出', cast_time: 10 },
                    { 机制: '直接伤害', 目标: '敌方单体', 威力倍率: 100, 伤害类型: '物理近战', 穿透修饰: 0 },
                  ],
                },
                '普通攻击',
              ),
            },
            {
              id: 'guard',
              type: 'tactical',
              action_type: '防御',
              name: '防御',
              category: '战术',
              cast_time: 10,
              cost_text: '无',
              enabled: true,
              reason: '',
              raw_skill: normalizeSkillData({ name: '防御', 技能类型: '防御', 消耗: '无', cast_time: 10 }, '防御'),
            },
            {
              id: 'evade',
              type: 'tactical',
              action_type: '闪避',
              name: '闪避',
              category: '战术',
              cast_time: 12,
              cost_text: '体力:5%',
              enabled: parseSkillCostForChar(normalizeSkillData({ name: '闪避', 技能类型: '防御', 消耗: '体力:5%', cast_time: 12 }, '闪避'), charData).canCast,
              reason: '',
              raw_skill: normalizeSkillData({ name: '闪避', 技能类型: '防御', 消耗: '体力:5%', cast_time: 12 }, '闪避'),
            },
          );

          availableSkills.forEach(skill => {
            const costParsed = parseSkillCostForChar(skill, charData);
            const 技能来源 = String(getBattleSkillSourceCategory(skill) || skill.技能来源 || skill.source_tag || '魂技').trim() || '魂技';
            const 技能动作 = {
              id: `skill_${skill.name}`,
              type: 'skill',
              action_type: 技能来源 === '武魂融合技' ? '武魂融合技' : '释放魂技',
              name: skill.name,
              category: 技能来源,
              source_detail: skill.source_tag || 技能来源,
              semantic_role: getSkillType(skill) || '输出',
              tags: skill.标签 || [],
              cast_time: getSkillCastTime(skill),
              cost_text: getFusionSkillDisplayCostText(skill),
              enabled: costParsed.canCast,
              reason: costParsed.canCast ? '' : (costParsed.failureReason || '状态不足'),
              raw_skill: skill,
            };
            套用动作实际前摇(charData, 技能动作);
            actions.push(技能动作);
          });

          if (charData.装备?.斗铠?.等级 > 0 && charData.装备?.斗铠?.装备状态 !== '已装备') {
            const 斗铠等级 = Number(charData.装备?.斗铠?.等级 || 1);
            const 已排异 = charData.装备?.斗铠?._已排异 || false;
            let 最低品质 = Infinity;
            let 部件数量 = 0;
            Object.values(charData.装备?.斗铠?.parts || {}).forEach(部件 => {
              if (部件?.状态 !== '未打造' && 部件?.状态 !== '重创') {
                if (Number(部件?.品质系数 || 0) < 最低品质) 最低品质 = Number(部件?.品质系数 || 0);
                部件数量++;
              }
            });
            let 斗铠前摇 = Math.max(0, 20 - 斗铠等级 * 5);
            if (斗铠等级 === 1 && !已排异 && 最低品质 > 1.2 && 部件数量 > 0) 斗铠前摇 = Math.max(0, 斗铠前摇 - 5);
            const 斗铠动作 = {
              id: 'equip_armor',
              type: 'equip',
              action_type: '穿戴装备',
              name: '斗铠附体',
              category: '特殊动作',
              cast_time: 斗铠前摇,
              cost_text: '无',
              enabled: true,
              reason: '',
              equip_target: 'armor',
              raw_skill: normalizeSkillData({
                name: 斗铠前摇 <= 0 ? '斗铠瞬间附体' : '斗铠附体读条',
                技能类型: '辅助',
                消耗: '无',
                cast_time: 斗铠前摇,
              }),
            };
            套用动作实际前摇(charData, 斗铠动作);
            actions.push(斗铠动作);
          }

          if (
            charData.装备?.机甲?.等级 &&
            charData.装备.机甲.等级 !== '无' &&
            charData.装备?.机甲?.装备状态 !== '已装备' &&
            charData.装备?.机甲?.状态 !== '重创'
          ) {
            const 机甲前摇 = charData.装备?.机甲?.等级 === '红级' ? 0 : 50;
            const 机甲动作 = {
              id: 'equip_mech',
              type: 'equip',
              action_type: '穿戴装备',
              name: '召唤机甲',
              category: '特殊动作',
              cast_time: 机甲前摇,
              cost_text: '无',
              enabled: true,
              reason: '',
              equip_target: 'mech',
              raw_skill: normalizeSkillData({ name: '召唤机甲', 技能类型: '辅助', 消耗: '无', cast_time: 机甲前摇 }),
            };
            套用动作实际前摇(charData, 机甲动作);
            actions.push(机甲动作);
          }

          if (charData.血脉之力?.技能?.['点燃生命之火'] && !charData.血脉之力?.生命之火) {
            const 生命之火技能 = normalizeSkillData(charData.血脉之力?.技能?.['点燃生命之火'], '点燃生命之火');
            const 生命之火消耗 = parseSkillCostForChar(生命之火技能, charData);
            const 生命之火动作 = {
              id: 'special_lifefire',
              type: 'special',
              action_type: '点燃生命之火',
              name: '点燃生命之火',
              category: '特殊动作',
              cast_time: 5,
              cost_text: getSkillCostText(生命之火技能),
              enabled: 生命之火消耗.canCast,
              reason: 生命之火消耗.canCast ? '' : (生命之火消耗.failureReason || '状态不足'),
              raw_skill: 生命之火技能,
            };
            套用动作实际前摇(charData, 生命之火动作);
            actions.push(生命之火动作);
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
              action_type: '元素剥离',
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
              action_type: '五行剥离',
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
              action_type: '五行遁法',
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
            action_type: '撤离',
            name: '亡命奔逃',
            category: '特殊动作',
            cast_time: 20,
            cost_text: '无',
            enabled: true,
            reason: '',
            raw_skill: normalizeSkillData({ name: '撤离', 技能类型: '辅助', 消耗: '无', cast_time: 20 }, '撤离'),
          });

          actions.forEach(动作 => 套用动作实际前摇(charData, 动作));
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
            toUiNumber(merged.hp_max ?? merged.HP上限, toUiNumber(stat.HP上限, 1)),
          );
          merged.hp = Math.max(
            0,
            toUiNumber(merged.hp ?? merged.HP, toUiNumber(stat.HP, merged.hp_max)),
          );
          merged.vit_max = Math.max(1, toUiNumber(merged.vit_max ?? merged.体力上限, toUiNumber(stat.体力上限, 1)));
          merged.vit = Math.max(0, toUiNumber(merged.vit ?? merged.体力, toUiNumber(stat.体力, merged.vit_max)));
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
          const 技能来源 = String(getBattleSkillSourceCategory(skill) || skill?.技能来源 || source || '魂技').trim() || '魂技';
          actions.push({
            id: `skill_${source}_${name}_${actions.length}`,
            type: 'skill',
            action_type: '释放魂技',
            name,
            category: 技能来源,
            source_detail: source || 技能来源,
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
          Object.entries(char.自创魂技 || {}).forEach(([name, skill]) => pushUiSkillAction(actions, skill, name, '自创魂技'));
          Object.entries(char.武魂融合技 || {}).forEach(([name, fusion]) => {
            pushUiSkillAction(actions, buildFusionCombatSkill(fusion, name, char), `武魂融合技·${name}`, '武魂融合技');
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
          const categoryOrder = ['魂技', '自创魂技', '武魂融合技', '血脉技能', '战术', '特殊动作', '纯操控'];
          const categories = ['全部', ...Array.from(new Set(actions.map(action => action.category || '战术')))]
            .sort((left, right) => {
              if (left === '全部') return -1;
              if (right === '全部') return 1;
              const leftIndex = categoryOrder.includes(left) ? categoryOrder.indexOf(left) : Number.MAX_SAFE_INTEGER;
              const rightIndex = categoryOrder.includes(right) ? categoryOrder.indexOf(right) : Number.MAX_SAFE_INTEGER;
              if (leftIndex !== rightIndex) return leftIndex - rightIndex;
              return String(left).localeCompare(String(right), 'zh-Hans-CN');
            });
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
              const categoryText = String(action.category || '战术').trim() || '战术';
              const sourceDetail = String(action.source_detail || '').trim();
              const categoryHtml =
                sourceDetail && sourceDetail !== categoryText
                  ? `${htmlEscapeText(categoryText)} · ${htmlEscapeText(sourceDetail)}`
                  : htmlEscapeText(categoryText);
              return `<button class="action-btn${selected}" type="button" data-action-id="${htmlEscapeText(action.id)}"${disabled}><span class="action-name">${htmlEscapeText(action.name)}</span><span class="action-meta"><span>${categoryHtml}</span><span class="action-cost">${htmlEscapeText(meta)}</span></span></button>`;
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
          const availableActions = ui_getAvailableActions(charData, combatData);
          const previousState = window.BattleUI?.state || {};
          const activeCategory = previousState.activeCategory || '全部';
          const currentIntentMode = previousState.currentIntentMode || combatData.战斗意图 || '点到为止';
          const pendingTowerSettlement = normalizeSoulTowerPendingSettlement(combatData.魂灵塔待结算);
          const selectedAction =
            (previousState.selectedAction &&
              availableActions.find(action => action.id === previousState.selectedAction.id)) ||
            availableActions[0] ||
            null;
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
          const resolvedTargetName = resolveIntentTargetNameFromAction(action, window.BattleUI?.state?.combatData || {});
          const actionObj = {
            type,
            action_type: type,
            skill,
            cast_time: Number(action.cast_time ?? skill.cast_time ?? 0) || 0,
            target_name: resolvedTargetName,
            前摇已结算: action.前摇已结算 === true,
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
          const target =
            queue.find(action => String(action?.target_name || '').trim())?.target_name ||
            resolveIntentTargetNameFromAction(sourceActions[0], state.combatData);
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
            combatData.环境 = 构建魂灵塔试炼地点(nextFloor);
            combatData.试炼状态 = 构建魂灵塔试炼地点(nextFloor);
            combatData.参战者.enemy = buildSoulTowerGuardianSeed(nextFloor);
            combatData.参战者.team_enemy = [];
            const 冲塔续层位置补丁 = 构建角色位置补丁(playerName, 构建魂灵塔试炼地点(nextFloor));
            if (冲塔续层位置补丁) extraPatchOps.push(冲塔续层位置补丁);
            extraPatchOps.push({
              op: 'replace',
              path: '/sys/系统播报',
              value: `[魂灵塔] 已放弃第${pendingSettlement.层数}层的五折资格，继续挑战第${nextFloor}层。`,
            });
          } else {
            combatData.进行中 = false;
            combatData.裁断结果 = `魂灵塔第${pendingSettlement.层数}层通关`;
            combatData.试炼状态 = '';
            const 冲塔结束位置补丁 = 构建角色位置补丁(playerName, 魂灵塔退出地点);
            if (冲塔结束位置补丁) extraPatchOps.push(冲塔结束位置补丁);
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


