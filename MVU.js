import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';
import { TimelineEvents } from 'https://cdn.jsdelivr.net/gh/sasajyunainui/lwcs@V1.38/timeline.js';
import { IntelEvents } from 'https://cdn.jsdelivr.net/gh/sasajyunainui/lwcs@V1.35/IntelEvents.js';

const TRAVEL_METHOD_COEFFICIENT = {
  步行: 1.0,
  校园短驳车: 0.4,
  魂导汽车: 0.5,
  魂导列车: 0.2,
  远洋巨轮: 0.8,
  '飞行(机甲/斗铠)': 0.05,
  '空间传送(极限斗罗)': 0.01,
  '空间传送(神级)': 0,
};

const ABYSS_LORE_DICT = {
  深渊铁律: {
    不死特性:
      '深渊生物被普通攻击击杀后会化为能量回归深渊重生。只有被【黄金龙枪】、【白银龙枪】或血神军团特制武器击杀，才能彻底吞噬其生命能量。',
    位面结构: '共108层，每层由一位帝王统治。前36层对标普通封号斗罗，中36层对标超级斗罗，后36层对标极限斗罗及半神。',
  },
  炮灰与中坚: {
    四爪蝙蝠: { 战力对标: '10~39级', 特性: '数量庞大，超声波侦查与攻击' },
    六爪蝙蝠: { 战力对标: '40~69级', 特性: '体积大，强力音波攻击' },
    深渊炸弹蜂: { 战力对标: '10~39级', 特性: '受蜂帝指挥，极度惧怕次声波，可自爆' },
    噬蜥: { 战力对标: '10~69级', 特性: '吞噬生命能量，防御极强，弱点是眼睛' },
    六爪魔: { 战力对标: '40~69级', 特性: '擅长隐藏偷袭，释放大片密集地刺' },
    巴安: { 战力对标: '70~89级', 特性: '体型如肉山，防御极强，拥有再生能力，喷吐魔焰' },
    守护天牛: { 战力对标: '70~89级', 特性: '防御力极其惊人，张开双翼形成巨大护盾' },
    深渊猛犸: { 战力对标: '70~89级', 特性: '体型巨大，攻防极其出色，最凶猛的冲锋者' },
    深渊魔傀: { 战力对标: '70~89级', 特性: '最强空军，双头两条命，身体承受力极强' },
  },
  高阶种族: {
    黑皇族: { 战力对标: '90级以上', 特性: '人类形态，最强一脉，释放黑色旋涡吞噬能量' },
    魔魅族: { 战力对标: '90级以上', 特性: '速度奇快，释放死咒，绝望战刀' },
    深渊恶镰: { 战力对标: '90级以上', 特性: '深渊执法者，极致速度与杀戮，掌握空间之法' },
    附体魔: { 战力对标: '90级以上', 特性: '精神体，善于隐藏，能附体并控制目标' },
  },
  十大帝君: {
    灵帝: { 排名: 2, 战力对标: '准神', 特性: '深渊灵龙，深渊大军统帅，精神力是神元境的5倍，无敌迷雾与虚弱之光' },
    烈帝: { 排名: 3, 战力对标: '百级(神级)', 特性: '魂力百级，近战极其恐怖，手持巨大长戟' },
    魔帝: { 排名: 4, 战力对标: '准神', 特性: '深渊魔傀之主，体力百级(深渊第一强硬)，黑暗天域' },
    智帝: { 排名: 5, 战力对标: '准神', 特性: '深渊第一强控，绝对成立的战场分割能力【九宫格】' },
    化帝: { 排名: 7, 战力对标: '准神', 特性: '千变万化，能变换成各种深渊领主的战斗形态' },
    黑帝: { 排名: 9, 战力对标: '准神', 特性: '黑皇族之主，擅长吞噬能力' },
    蜂帝: { 排名: 10, 战力对标: '准神', 特性: '深渊炸弹蜂之主，精神力极强，群体爆炸攻击' },
  },
  至高主宰: {
    深渊圣君: { 战力对标: '神级', 特性: '深渊位面之主，实力无限接近于神' },
  },
};

function getAbyssStats(tier, species) {
  let lv = 10;
  let speciesMult = { str: 1.0, def: 1.0, agi: 1.0, vit_max: 1.0, men_max: 1.0, sp_max: 1.0 };

  if (tier === '低阶生物') {
    lv = 20 + Math.floor(Math.random() * 20);
    speciesMult = { str: 0.8, def: 0.8, agi: 1.2, vit_max: 0.8, men_max: 0.5, sp_max: 1.0 };
  } else if (tier === '中阶生物') {
    lv = 40 + Math.floor(Math.random() * 30);
    speciesMult = { str: 1.2, def: 1.2, agi: 1.0, vit_max: 1.2, men_max: 0.8, sp_max: 1.2 };
  } else if (tier === '高阶生物') {
    lv = 70 + Math.floor(Math.random() * 20);
    speciesMult = { str: 1.5, def: 1.5, agi: 1.5, vit_max: 1.5, men_max: 1.2, sp_max: 1.5 };
  } else if (tier === '深渊王者' || tier === '深渊帝君') {
    lv = 99;
    speciesMult = { str: 2.0, def: 2.0, agi: 2.0, vit_max: 2.0, men_max: 2.0, sp_max: 2.0 };
  }

  if (species.includes('蝙蝠') || species.includes('魔魅') || species.includes('恶镰')) {
    speciesMult.agi *= 1.5;
    speciesMult.def *= 0.7;
  } else if (species.includes('巴安') || species.includes('天牛') || species.includes('猛犸')) {
    speciesMult.def *= 1.8;
    speciesMult.vit_max *= 1.8;
    speciesMult.agi *= 0.6;
  } else if (species.includes('黑皇')) {
    speciesMult.sp_max *= 1.5;
    speciesMult.men_max *= 1.5;
  }
  const base = getBaseStats(lv);
  const finalStats = {
    种族: species,
    等阶: tier,
    对标等级: lv,
    str: Math.floor(base.str * speciesMult.str),
    def: Math.floor(base.def * speciesMult.def),
    agi: Math.floor(base.agi * speciesMult.agi),
    vit_max: Math.floor(base.vit_max * speciesMult.vit_max),
    men_max: Math.floor(base.men_max * speciesMult.men_max),
    sp_max: Math.floor(base.sp_max * speciesMult.sp_max),
  };

  if (species === '灵帝') {
    finalStats.对标等级 = 99.5;
    finalStats.men_max = 250000;
  } else if (species === '烈帝') {
    finalStats.对标等级 = 100;
    const godBase = getBaseStats(100);
    finalStats.sp_max = godBase.sp_max;
    finalStats.str = Math.floor(godBase.str * 1.5);
  } else if (species === '魔帝') {
    finalStats.对标等级 = 99.5;
    const godBase = getBaseStats(100);
    finalStats.vit_max = godBase.vit_max;
    finalStats.def = Math.floor(godBase.def * 2.0);
  } else if (species === '智帝' || species === '化帝' || species === '黑帝' || species === '蜂帝') {
    finalStats.对标等级 = 99.5;
    const demiGodBase = getBaseStats(99.5);
    finalStats.sp_max = Math.floor(demiGodBase.sp_max * 1.5);
  } else if (species === '深渊圣君') {
    finalStats.对标等级 = 100;
    const godBase = getBaseStats(100);
    finalStats.str = godBase.str * 3;
    finalStats.def = godBase.def * 3;
    finalStats.vit_max = godBase.vit_max * 3;
    finalStats.sp_max = godBase.sp_max * 3;
    finalStats.men_max = godBase.men_max * 3;
  }

  return finalStats;
}

const MAP_IMAGE_WIDTH = 3174;
const MAP_IMAGE_HEIGHT = 2246;
const MAP_COORD_SYSTEM_IMAGE = 'image';
const MAP_COORD_SYSTEM_LOCAL = 'local';

function isWorldMapId(mapId = 'map_douluo_world') {
  return !mapId || mapId === 'map_douluo_world';
}

const MAP_TRAVEL_SCALE_BY_LEVEL = {
  world: 1,
  city: 0.07,
  facility: 0.02,
};

function cloneJsonValue(值, 回退值 = {}) {
  try {
    return structuredClone(值);
  } catch (错误) {}
  try {
    return JSON.parse(JSON.stringify(值));
  } catch (错误) {}
  return 回退值;
}

function 追加系统播报文本(数据对象 = {}, 文本 = '', 分隔符 = ' ') {
  if (!数据对象 || typeof 数据对象 !== 'object') return '';
  if (!数据对象.sys || typeof 数据对象.sys !== 'object') 数据对象.sys = {};
  const 清洗文本 = String(文本 || '').trim();
  if (!清洗文本) return String(数据对象.sys.系统播报 || '');
  const 原播报 = String(数据对象.sys.系统播报 || '').trim();
  const 现有播报 = 原播报 && 原播报 !== '初始化' ? 原播报 : '';
  const 安全分隔符 = String(分隔符 || ' ').trim() || ' ';
  数据对象.sys.系统播报 = `${现有播报}${现有播报 ? 安全分隔符 : ''}${清洗文本}`.trim();
  return 数据对象.sys.系统播报;
}

let 最近旧选择回响签名 = '';

function normalizeTravelMapLevel(level = 'world') {
  const safeLevel = String(level || 'world')
    .trim()
    .toLowerCase();
  if (safeLevel === 'facility' || safeLevel === 'district') return 'facility';
  if (safeLevel === 'city') return 'city';
  if (safeLevel === 'world' || safeLevel === 'continent' || safeLevel === 'region') return 'world';
  return 'world';
}

function getTravelScaleByMapLevel(level = 'world') {
  return MAP_TRAVEL_SCALE_BY_LEVEL[normalizeTravelMapLevel(level)] || MAP_TRAVEL_SCALE_BY_LEVEL.world;
}

function getMapNodeCommonPathDepth(startPath = [], endPath = []) {
  const a = Array.isArray(startPath) ? startPath : [];
  const b = Array.isArray(endPath) ? endPath : [];
  const maxDepth = Math.min(a.length, b.length);
  let depth = 0;
  for (let i = 0; i < maxDepth; i++) {
    if (a[i] !== b[i]) break;
    depth++;
  }
  return depth;
}

function resolveTravelMapLevel(startLoc, endLoc, sd = null, coordSystem = MAP_COORD_SYSTEM_IMAGE) {
  const safeCoordSystem = String(coordSystem || MAP_COORD_SYSTEM_IMAGE).trim();
  if (safeCoordSystem === MAP_COORD_SYSTEM_IMAGE) return 'world';
  if (!sd) return 'city';
  const startEntry = findMapNodeEntry(startLoc, sd);
  const endEntry = findMapNodeEntry(endLoc, sd);
  const startPath = Array.isArray(startEntry?.path) ? startEntry.path : [];
  const endPath = Array.isArray(endEntry?.path) ? endEntry.path : [];
  const commonDepth = getMapNodeCommonPathDepth(startPath, endPath);
  if (commonDepth >= 3) return 'facility';
  if (commonDepth >= 2) return 'city';
  if (startPath.length >= 3 || endPath.length >= 3) return 'facility';
  if (startPath.length >= 2 || endPath.length >= 2) return 'city';
  return 'world';
}

let FLAT_LOCATIONS = {};
function refreshFlatLocationsFromTree(node, name) {
  if (node.x !== undefined && node.y !== undefined) {
    FLAT_LOCATIONS[name] = { x: node.x, y: node.y };
    if (!node.coord_system) node.coord_system = node.level <= 2 ? MAP_COORD_SYSTEM_IMAGE : MAP_COORD_SYSTEM_LOCAL;
  }
  if (node.子节点) {
    for (const childName in node.子节点) {
      refreshFlatLocationsFromTree(node.子节点[childName], childName);
    }
  }
}

function calculateTravelResourceCost(method, distance, char = {}) {
  const 属性 = char.属性 || {};
  const 财富 = char.财富 || {};
  const 装备 = char.装备 || {};
  const lv = Number(属性.等级 || 0);
  const hasDoukai = Number(装备?.斗铠?.等级 || 0) > 0 && String(装备?.斗铠?.装备状态 || '未装备') === '已装备';
  const hasMecha =
    String(装备?.机甲?.等级 || '无') !== '无' && String(装备?.机甲?.装备状态 || '未装备') === '已装备';

  let fedCoin = 0;
  let sp = 0;
  let vit = 0;
  let canAfford = true;
  let reason = '';
  let note = '';

  if (method === '步行') {
    vit = Math.max(1, Math.floor(distance * 4));
  } else if (method === '校园短驳车') {
    fedCoin = Math.max(1, Math.floor(distance * 2));
    note = '校内通勤';
  } else if (['魂导列车', '魂导汽车', '远洋巨轮'].includes(method)) {
    fedCoin = Math.floor(distance * 10);
  } else if (method === '飞行(机甲/斗铠)') {
    if (hasDoukai) {
      sp = Math.floor(distance * 12);
      vit = Math.max(1, Math.floor(distance * 2));
      note = '斗铠飞行';
    } else if (hasMecha) {
      sp = Math.floor(distance * 10);
      vit = Math.max(1, Math.floor(distance));
      fedCoin = Math.max(1, Math.floor(distance * 3));
      note = '机甲飞行';
    } else if (lv >= 70) {
      sp = Math.floor(distance * 20);
      vit = Math.max(1, Math.floor(distance * 5));
      note = '肉身飞行';
    } else {
      canAfford = false;
      reason = '需70级以上或装备机甲/斗铠';
    }
  } else if (method === '空间传送(极限斗罗)') {
    if (lv >= 98) {
      note = '极限传送';
    } else {
      canAfford = false;
      reason = '需极限斗罗或特殊权限';
    }
  } else if (method === '空间传送(神级)') {
    note = '神级传送';
  }

  const curCoin = Number(财富.联邦币 || 0);
  const curSp = Number(属性.魂力 || 0);
  const curVit = Number(属性.体力 || 0);
  if (canAfford && fedCoin > curCoin) {
    canAfford = false;
    reason = '联邦币不足';
  }
  if (canAfford && sp > curSp) {
    canAfford = false;
    reason = '魂力不足';
  }
  if (canAfford && vit > curVit) {
    canAfford = false;
    reason = '体力不足';
  }

  return { fedCoin, sp, vit, canAfford, reason, note };
}

function findMapNodeEntry(targetName, sd) {
  let found = null;
  const safeTargetName = String(targetName || '').trim();
  const visit = (node, name, path = []) => {
    if (found || !node) return;
    if (sd && typeof node.condition === 'function' && !node.condition(sd)) return;
    const nextPath = [...path, name];
    if (name === safeTargetName) {
      found = { name, node, path: nextPath };
      return;
    }
    if (node.子节点) {
      Object.keys(node.子节点).forEach(childName => {
        visit(node.子节点[childName], childName, nextPath);
      });
    }
  };

  if (sd && sd.world && sd.world.地点) {
    Object.keys(sd.world.地点).forEach(locName => {
      visit(sd.world.地点[locName], locName, []);
    });
  }

  if (!found && sd && sd.world && sd.world.地点 && safeTargetName.includes('-')) {
    const rawSegments = safeTargetName
      .split('-')
      .map(seg => String(seg || '').trim())
      .filter(Boolean);
    const pathSegments = rawSegments.filter(seg => seg !== '斗罗大陆' && seg !== '斗灵大陆');
    if (pathSegments.length >= 1) {
      let currentNode = sd.world.地点[pathSegments[0]];
      const currentPath = [];
      if (currentNode && !(typeof currentNode.condition === 'function' && !currentNode.condition(sd))) {
        currentPath.push(pathSegments[0]);
        if (pathSegments.length === 1) {
          found = {
            name: currentPath[0],
            node: currentNode,
            path: currentPath,
          };
        } else {
          let valid = true;
          for (let i = 1; i < pathSegments.length; i++) {
            const seg = pathSegments[i];
            currentNode = currentNode?.子节点?.[seg];
            if (!currentNode || (typeof currentNode.condition === 'function' && !currentNode.condition(sd))) {
              valid = false;
              break;
            }
            currentPath.push(seg);
          }
          if (valid && currentNode) {
            found = {
              name: currentPath[currentPath.length - 1],
              node: currentNode,
              path: currentPath,
            };
          }
        }
      }
    }
  }

  return found;
}

function isWorldLocationName(locName, sd) {
  if (!locName || !sd) return false;
  if (sd?.world?.动态地点?.[locName]) {
    return isWorldMapId(sd.world.动态地点[locName].地图ID || 'map_douluo_world');
  }
  const entry = findMapNodeEntry(locName, sd);
  return !!(entry && Array.isArray(entry.path) && entry.path.length <= 1);
}

const TypeMultipliers = {
  强攻系: { sp_max: 1.0, men_max: 1.0, str: 1.0, def: 1.0, agi: 1.0, vit_max: 1.0 },
  防御系: { sp_max: 1.0, men_max: 1.0, str: 0.9, def: 1.5, agi: 0.7, vit_max: 1.0 },
  敏攻系: { sp_max: 1.0, men_max: 1.0, str: 0.8, def: 0.7, agi: 1.6, vit_max: 0.8 },
  控制系: { sp_max: 1.0, men_max: 1.2, str: 0.9, def: 0.8, agi: 1.1, vit_max: 0.9 },
  辅助系: { sp_max: 1.2, men_max: 1.2, str: 0.7, def: 0.6, agi: 0.8, vit_max: 0.7 },
  食物系: { sp_max: 1.2, men_max: 1.2, str: 0.7, def: 0.6, agi: 0.8, vit_max: 0.7 },
  治疗系: { sp_max: 1.2, men_max: 1.2, str: 0.7, def: 0.6, agi: 0.8, vit_max: 0.7 },
  精神系: { sp_max: 1.0, men_max: 1.7, str: 0.7, def: 0.6, agi: 0.8, vit_max: 0.7 },
  元素系: { sp_max: 1.0, men_max: 1.5, str: 0.8, def: 0.6, agi: 0.8, vit_max: 0.7 },
};

const ArmorBaseStats = {
  1: { sp_max: 20000, men_max: 1000, str: 5000, agi: 2500, vit_max: 5000 },
  2: { sp_max: 25000, men_max: 2000, str: 8000, agi: 4000, vit_max: 8000 },
  3: { sp_max: 34090, men_max: 3000, str: 10785, agi: 4490, vit_max: 10785 },
  4: { sp_max: 105910, men_max: 5000, str: 17215, agi: 8010, vit_max: 17215 },
};
const MechBaseStats = {
  黄级: { sp_max: 5500, men_max: 225, str: 750, agi: 375, vit_max: 750 },
  紫级: { sp_max: 5500, men_max: 225, str: 750, agi: 375, vit_max: 750 },
  黑级: { sp_max: 21053, men_max: 2237, str: 6052, agi: 3026, vit_max: 6052 },
  红级: { sp_max: 34090, men_max: 3000, str: 10785, agi: 4490, vit_max: 10785 },
};

const JobExpThresholds = [0, 1000, 5000, 12000, 60000, 80000, 400000, 500000, 3000000, 99999999];
function getRingBonus(age) {
  return {
    str: Math.floor(age * 0.05),
    def: Math.floor(age * 0.05),
    agi: Math.floor(age * 0.05),
    vit_max: Math.floor(age * 0.05),
    men_max: Math.floor(age * 0.01),
    sp_max: Math.floor(age * 0.1),
  };
}
function getRingColorByAge(age) {
  const safeAge = Math.max(0, Math.floor(Number(age) || 0));
  if (safeAge >= 200000) return '橙金';
  if (safeAge >= 100000) return '红';
  if (safeAge >= 10000) return '黑';
  if (safeAge >= 1000) return '紫';
  if (safeAge >= 100) return '黄';
  return '白';
}

const SOUL_TOWER_MAX_AGE = 30;

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
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return createEmptySoulTowerDiscountSpiritRecord();
  }
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

function formatSoulTowerDiscountSpiritSummary(record = {}) {
  const normalized = normalizeSoulTowerDiscountSpiritRecord(record);
  if (!(normalized.层数 > 0)) return '无';
  return `第${normalized.层数}层 ${normalized.标准物种} ${normalized.年限}年 ${normalized.品质}`;
}

function getCharacterAgeNumber(char = {}) {
  const rawAge = char?.属性?.年龄;
  if (typeof rawAge === 'number') return Number.isFinite(rawAge) ? rawAge : NaN;
  const text = String(rawAge == null ? '' : rawAge).trim();
  if (!text) return NaN;
  const directNumber = Number(text);
  if (Number.isFinite(directNumber)) return directNumber;
  const numericText = text.match(/-?\d+(?:\.\d+)?/);
  return numericText ? Number(numericText[0]) : NaN;
}

function isSoulTowerEligibleCharacter(char = {}) {
  const ageValue = getCharacterAgeNumber(char);
  return Number.isFinite(ageValue) && ageValue > 0 && ageValue <= SOUL_TOWER_MAX_AGE;
}

function syncSoulTowerRecordEligibility(char = {}) {
  if (!char || typeof char !== 'object') return;
  if (!isSoulTowerEligibleCharacter(char)) {
    delete char.魂灵塔记录;
    return;
  }
  if (!char.魂灵塔记录 || typeof char.魂灵塔记录 !== 'object' || Array.isArray(char.魂灵塔记录)) {
    char.魂灵塔记录 = { 最高层: 0, 当前五折魂灵: createEmptySoulTowerDiscountSpiritRecord() };
    return;
  }
  char.魂灵塔记录.最高层 = Math.max(0, Math.floor(Number(char.魂灵塔记录.最高层 || 0)));
  char.魂灵塔记录.当前五折魂灵 = normalizeSoulTowerDiscountSpiritRecord(char.魂灵塔记录.当前五折魂灵);
}

function createDefaultRingSkillShell() {
  return {
    ['\u9b42\u6280\u540d']: AI_TODO_SKILL_NAME,
    ['\u753b\u9762\u63cf\u8ff0']: '\u672a\u77e5',
    ['\u6548\u679c\u63cf\u8ff0']: '\u672a\u77e5',
    _\u6548\u679c\u6570\u7ec4: [],
  };
}

function buildDefaultRingSkillMap(ringIndex, ringAge) {
  const safeRingIndex = Math.max(1, Math.floor(Number(ringIndex) || 1));
  const baseSkillKey = `\u7b2c${safeRingIndex}\u9b42\u6280`;
  const skills = {
    [baseSkillKey]: createDefaultRingSkillShell(),
  };
  if (Math.floor(Number(ringAge) || 0) >= 100000) {
    skills[`${baseSkillKey}\u00b7\u5176\u4e8c`] = createDefaultRingSkillShell();
  }
  return skills;
}

function getBeastStats(age, species) {
  let lv = 1;
  if (age >= 100000) {
    lv = 90 + Math.floor((age - 100000) / 100000);
  } else if (age >= 10000) {
    lv = 50 + Math.floor((age - 10000) / 2250);
  } else if (age >= 1000) {
    lv = 30 + Math.floor((age - 1000) / 450);
  } else if (age >= 100) {
    lv = 10 + Math.floor((age - 100) / 45);
  } else {
    lv = Math.max(1, Math.floor(age / 10));
  }

  const speciesType = resolveSoulSpiritSpeciesCategory(species);
  const qualityKey = normalizeSoulSpiritQuality(species?.品质 || '') || normalizeSoulSpiritQuality(arguments[2] || '');
  const qualityMult = SOUL_SPIRIT_QUALITY_MULTIPLIER_MAP[qualityKey] || 1.0;
  const qualityLevelOffset = SOUL_SPIRIT_QUALITY_LEVEL_OFFSET_MAP[qualityKey] || 0;
  lv = Math.max(1, lv + qualityLevelOffset);

  const base = getBaseStats(lv);

  const speciesMult = {
    龙类: { str: 1.5, vit_max: 1.5, def: 1.3, agi: 0.9 },
    蛛类: { agi: 1.6, str: 0.8, def: 0.8 },
    熊类: { str: 1.8, def: 1.5, agi: 0.6 },
    植物系: { vit_max: 2.0, str: 0.7, def: 0.8 },
    海魂兽: { sp_max: 1.3, men_max: 1.2, agi: 1.1 },
    鸟类: { agi: 1.8, str: 0.7, vit_max: 0.8 },
    猫科: { agi: 1.5, str: 1.2, def: 0.9 },
    蛇类: { agi: 1.4, str: 1.0, def: 0.9, men_max: 1.1 },
  }[speciesType] || { str: 1.0, def: 1.0, agi: 1.0, vit_max: 1.0, men_max: 1.0, sp_max: 1.0 };

  return {
    年限: age,
    对标等级: lv,
    str: Math.floor(base.str * (speciesMult.str || 1.0) * qualityMult),
    def: Math.floor(base.def * (speciesMult.def || 1.0) * qualityMult),
    agi: Math.floor(base.agi * (speciesMult.agi || 1.0) * qualityMult),
    vit_max: Math.floor(base.vit_max * (speciesMult.vit_max || 1.0) * qualityMult),
    men_max: Math.floor(base.men_max * (speciesMult.men_max || 1.0) * qualityMult),
    sp_max: Math.floor(base.sp_max * (speciesMult.sp_max || 1.0) * qualityMult),
  };
}

function isSoulBeastCharacter(char = {}) {
  return !!(Number(char?.属性?.年龄 || 0) >= 10000 || char?.社交?.势力?.['魂兽一族']);
}

function formatCultivationLevelText(level, fallback = '未知') {
  const numericLevel = Number(level);
  if (Number.isFinite(numericLevel)) {
    if (Math.abs(numericLevel - 99.5) < 0.001) return '准神';
    return String(numericLevel);
  }
  const text = String(level ?? '').trim();
  return text || fallback;
}

function getNextCultivationLevelStep(currentLevel = 0) {
  const safeLevel = Math.max(0, Number(currentLevel) || 0);
  if (safeLevel >= 100) return null;
  if (safeLevel >= 99.5) return 100;
  if (safeLevel >= 99) return 99.5;
  return Math.floor(safeLevel) + 1;
}

function isSoulRingGateLevel(level) {
  const numericLevel = Number(level);
  if (!Number.isFinite(numericLevel) || numericLevel >= 100) return false;
  if (Math.abs(numericLevel - Math.round(numericLevel)) > 0.001) return false;
  return Math.round(numericLevel) % 10 === 0;
}

function formatBreakthroughLevelText(level) {
  const numericLevel = Number(level);
  const text = formatCultivationLevelText(level, '未知');
  return Number.isFinite(numericLevel) && Math.abs(numericLevel - 99.5) < 0.001 ? text : `${text}级`;
}

function autoBreakthrough(data) {
  _(data.char).forEach((c, charName) => {
    if (!c.状态?.存活) return;
    const isBeast = isSoulBeastCharacter(c);
    if (isBeast) return;
    const pendingRingState = String(c.状态?.待选魂环?.状态 || '').trim();
    if (pendingRingState && !['已处理', 'handled', '无'].includes(pendingRingState)) return;

    const isSameNodeGroup = (c1, c2) => {
      if (!c1 || !c2) return false;
      const loc1 = c1.状态?.位置 || '';
      const loc2 = c2.状态?.位置 || '';
      if (loc1 && loc2 && loc1 === loc2) return true;
      const dyn = data.world?.动态地点 || {};
      const p1 = dyn[loc1]?.归属父节点 || loc1.split('-').slice(0, -1).join('-');
      const p2 = dyn[loc2]?.归属父节点 || loc2.split('-').slice(0, -1).join('-');
      return p1 && p2 && p1 === p2;
    };

    while (true) {
      const currentLv = Math.max(0, Number(c.属性?.等级 || 0));
      if (currentLv >= 100) return;
      const nextLevelStep = getNextCultivationLevelStep(currentLv);
      if (nextLevelStep === null) return;

      const baseSoulPowerForBreakthrough = Math.max(
        0,
        Math.floor(Number(c.属性?.突破魂力上限 ?? c.属性?.基础魂力上限 ?? 0))
      );
      const nextLevelSoulRequirement = getCharacterBaseSoulPowerRequirementAtLevel(c, nextLevelStep);
      if (baseSoulPowerForBreakthrough < nextLevelSoulRequirement) return;

      const coreCount = c.魂核?.核心?.数量 || 0;
      let maxLv = 69;
      if (coreCount === 1) maxLv = 89;
      else if (coreCount === 2) maxLv = 98;
      else if (coreCount >= 3) maxLv = 150;
      maxLv = Math.min(maxLv, getCharacterSoulRingLevelCap(c));
      if (currentLv >= maxLv) return;

      c.属性.等级 = nextLevelStep;
      const newLv = Number(c.属性.等级 || nextLevelStep);
      const newLvText = formatBreakthroughLevelText(newLv);
      let shouldStopAfterThisBreak = false;
      if (isSoulRingGateLevel(newLv)) {
        const ringIndex = Math.round(newLv / 10);
        const spiritKeys = Object.keys(c.武魂 || {});
        if (spiritKeys.length === 0) return;

        const isPlayer = charName === data.sys?.玩家名;
        const playerChar = data.char[data.sys?.玩家名];
        const isNearPlayer = !isPlayer && isSameNodeGroup(c, playerChar);

        for (const spiritKey of spiritKeys) {
          const targetSpirit = c.武魂[spiritKey];
          if (!targetSpirit || typeof targetSpirit !== 'object') continue;
          if (!targetSpirit.魂灵) targetSpirit.魂灵 = {};

          let ringAssigned = false;
          let candidateSpirit = null;

          _(targetSpirit.魂灵).forEach((ss, ssName) => {
            if (ringAssigned || candidateSpirit) return;

            let cap = 1;
            if (ss.年限 >= 10000) cap = 4;
            else if (ss.年限 >= 1000) cap = 3;
            else if (ss.年限 >= 100) cap = 2;

            const currentRingsCount = Object.keys(ss.魂环 || {}).length;
            if (currentRingsCount < cap) {
              candidateSpirit = { ss, ssName };
            }
          });

          if (candidateSpirit) {
            const { ss, ssName } = candidateSpirit;
            if (isPlayer) {
              if (!c.状态) c.状态 = {};
              c.状态.待选魂环 = {
                武魂槽位: spiritKey,
                候选魂灵: [ssName],
                待生成魂环位: ringIndex,
                状态: '待选择',
                来源: '修为突破',
              };
              ringAssigned = true;
              shouldStopAfterThisBreak = true;
              if (data.sys.系统播报 === '初始化' || !data.sys.系统播报) data.sys.系统播报 = '';
              data.sys.系统播报 += ` [修为突破] ${charName} 踏入 ${newLvText}！已达到第 ${ringIndex} 魂环门槛，当前魂灵【${ssName}】可继续衍生魂环，请决定是否立即生成。`;
            } else if (isNearPlayer && data.sys?.系统播报 !== '初始化') {
              ringAssigned = true;
              shouldStopAfterThisBreak = true;
              if (data.sys.系统播报 === '初始化' || !data.sys.系统播报) data.sys.系统播报 = '';
              data.sys.系统播报 += ` [修为突破] ${charName} 踏入 ${newLvText}！已达到第 ${ringIndex} 魂环门槛，但当前场景内请通过剧情决定其【${ssName}】是否为【${spiritKey}】衍生新魂环。`;
            } else {
              const newRingColor = getRingColorByAge(ss.年限);
              ss.魂环[ringIndex.toString()] = {
                年限: ss.年限,
                颜色: newRingColor,
                魂技: {
                  [`第${ringIndex}魂技`]: {
                    魂技名: AI_TODO_SKILL_NAME,
                    画面描述: '未知',
                    效果描述: '未知',
                    _效果数组: [],
                  },
                },
              };
              ss.魂环[ringIndex.toString()].魂技 = buildDefaultRingSkillMap(ringIndex, ss.年限);
              ringAssigned = true;
              if (data.sys.系统播报 === '初始化' || !data.sys.系统播报) data.sys.系统播报 = '';
              data.sys.系统播报 += ` [修为突破] ${charName} 踏入 ${newLvText}！其【${ssName}】底蕴深厚，自动为【${spiritKey}】衍生出第 ${ringIndex} 个魂环！`;
            }
          }

          if (!ringAssigned) {
            let currentSpiritsCount = 0;
            _(c.武魂).forEach(sp => {
              currentSpiritsCount += Object.keys(sp.魂灵 || {}).length;
            });
            const realmLimit =
              { 灵元境: 1, 灵通境: 2, 灵海境: 5, 灵渊境: 9, 灵域境: 99, 神元境: 999 }[
                c.属性.精神境界 || c.属性.精神力_realm
              ] || 1;

            if (data.sys.系统播报 === '初始化' || !data.sys.系统播报) data.sys.系统播报 = '';
            if (currentSpiritsCount >= realmLimit) {
              data.sys.系统播报 += ` [修为突破] ${charName} 踏入 ${newLvText}！但精神力仅为【${c.属性.精神境界 || c.属性.精神力_realm}】，无法承载更多魂灵，【${spiritKey}】暂缓附加魂环！`;
            } else if (isPlayer) {
              data.sys.系统播报 += ` [修为突破] ${charName} 踏入 ${newLvText}！达到魂环门槛，但当前未有可继续产环的魂灵，需通过剧情吸收新魂灵后方可附环。`;
            } else if (isNearPlayer) {
              data.sys.系统播报 += ` [修为突破] ${charName} 踏入 ${newLvText}！达到魂环门槛，但当前场景内禁止后台立即生成新魂灵，请通过剧情处理。`;
            }
            shouldStopAfterThisBreak = true;
          }

          if (ringAssigned || shouldStopAfterThisBreak) break;
        }
      } else {
        if (data.sys.系统播报 === '初始化' || !data.sys.系统播报) data.sys.系统播报 = '';
        data.sys.系统播报 += ` [修为突破] ${charName} 踏入 ${newLvText}！`;
      }

      if (shouldStopAfterThisBreak) return;
    }
  });
}

function getCharacterBaseSoulPowerTypeMultiplier(char = {}) {
  let maxTypeMult = 0;
  const spiritKeys = Object.keys(char?.武魂 || {});
  if (spiritKeys.length > 0) {
    spiritKeys.forEach(key => {
      const tm = TypeMultipliers[char?.武魂?.[key]?.type] || TypeMultipliers['强攻系'];
      maxTypeMult = Math.max(maxTypeMult, Number(tm?.sp_max || 0));
    });
  }
  if (maxTypeMult <= 0) {
    maxTypeMult = Number((TypeMultipliers[char?.属性?.系别] || TypeMultipliers['强攻系'])?.sp_max || 1);
  }
  return Math.max(0.1, maxTypeMult || 1);
}

function getCharacterBaseSoulPowerRequirementAtLevel(char = {}, level = 1) {
  const safeLevel = Math.max(1, Number(level) || 1);
  const typeMultiplier = getCharacterBaseSoulPowerTypeMultiplier(char);
  const dualSpiritSoulCoeff = getDualSpiritSoulPowerCoeff(char);
  const hiddenVar = Math.max(0.1, Number(char?.属性?.底子波动 || 1));
  return Math.floor(getBaseStats(safeLevel).sp_max * typeMultiplier * dualSpiritSoulCoeff * hiddenVar);
}

function getCharacterCurrentRingAndBoneSoulPowerBonus_ACU(char = {}) {
  let boneBonus = 0;
  _(char?.魂骨 || {}).forEach((bone, part) => {
    if (Number(bone?.年限 || 0) <= 0) return;
    const ringBonus = getRingBonus(Number(bone.年限 || 0));
    if (part === '躯干魂骨') boneBonus += ringBonus.sp_max * 2;
    else boneBonus += ringBonus.sp_max;
  });

  let ringBonusTotal = 0;
  _(char?.武魂 || {}).forEach(spiritData => {
    _(spiritData?.魂灵 || {}).forEach(ss => {
      const compMult = Math.max(0.1, (ss?.契合度 !== undefined ? ss.契合度 : 100) / 100);
      _(ss?.魂环 || {}).forEach(ring => {
        if (Number(ring?.年限 || 0) > 0) {
          ringBonusTotal += Math.floor(getRingBonus(Number(ring.年限 || 0)).sp_max * compMult);
        }
      });
    });
    _(spiritData?.独立魂环 || {}).forEach(ring => {
      if (Number(ring?.年限 || 0) > 0) {
        ringBonusTotal += Math.floor(getRingBonus(Number(ring.年限 || 0)).sp_max);
      }
    });
  });
  return Math.max(0, Math.floor(ringBonusTotal + boneBonus));
}

function getCharacterActualSoulRingCount(char = {}) {
  let total = 0;
  Object.values(char?.武魂 || {}).forEach(spiritData => {
    if (!spiritData || typeof spiritData !== 'object') return;
    Object.values(spiritData?.魂灵 || {}).forEach(soulSpirit => {
      if (!soulSpirit || typeof soulSpirit !== 'object') return;
      Object.values(soulSpirit?.魂环 || {}).forEach(ringData => {
        if (!ringData || typeof ringData !== 'object') return;
        const hasAge = Number(ringData?.年限 || 0) > 0;
        const hasSkill = Object.keys(ringData?.魂技 || {}).length > 0;
        if (hasAge || hasSkill) total += 1;
      });
    });
    Object.values(spiritData?.独立魂环 || {}).forEach(ringData => {
      if (!ringData || typeof ringData !== 'object') return;
      const hasAge = Number(ringData?.年限 || 0) > 0;
      const hasSkill = Object.keys(ringData?.魂技 || {}).length > 0;
      if (hasAge || hasSkill) total += 1;
    });
  });
  return Math.max(0, total);
}

function 计算武魂当前魂环数量_V1(spiritData = {}) {
  let 总数 = 0;
  Object.values(spiritData?.魂灵 || {}).forEach(魂灵数据 => {
    if (!魂灵数据 || typeof 魂灵数据 !== 'object') return;
    总数 += Object.values(魂灵数据?.魂环 || {}).filter(魂环数据 => 魂环数据 && typeof 魂环数据 === 'object').length;
  });
  总数 += Object.values(spiritData?.独立魂环 || {}).filter(魂环数据 => 魂环数据 && typeof 魂环数据 === 'object').length;
  return Math.max(0, 总数);
}

function 角色存在七字武魂_V1(char = {}) {
  return Object.entries(char?.武魂 || {}).some(([武魂键, 武魂数据]) => {
    const 名称 = String(武魂数据?.表象名称 || 武魂键 || '').trim();
    return 名称.includes('七');
  });
}

function getCharacterSoulRingLevelCap(char = {}) {
  const ringCount = getCharacterActualSoulRingCount(char);
  return Math.min(100, Math.max(10, (ringCount + 1) * 10));
}

const FactionDistribution = {
  唐门: {
    hq: '史莱克城',
    branches: [
      '天斗城',
      '东海城',
      '明都',
      '天海城',
      '星罗城',
      '灵波城',
      '傲来城',
      '北海城',
      '烈火盆地',
      '上陵城',
      '天定城',
      '海陆城',
    ],
  },
  传灵塔: {
    hq: '史莱克城',
    branches: [
      '天斗城',
      '东海城',
      '明都',
      '天海城',
      '星罗城',
      '灵波城',
      '傲来城',
      '北海城',
      '烈火盆地',
      '上陵城',
      '天定城',
      '海陆城',
    ],
  },

  锻造师协会: {
    hq: '明都',
    branches: [
      '天斗城',
      '东海城',
      '明都',
      '天海城',
      '星罗城',
      '灵波城',
      '傲来城',
      '北海城',
      '烈火盆地',
      '上陵城',
      '天定城',
      '海陆城',
    ],
  },
  机甲师协会: {
    hq: '明都',
    branches: [
      '天斗城',
      '东海城',
      '明都',
      '天海城',
      '星罗城',
      '灵波城',
      '傲来城',
      '北海城',
      '烈火盆地',
      '上陵城',
      '天定城',
      '海陆城',
    ],
  },
  制造师协会: {
    hq: '明都',
    branches: [
      '天斗城',
      '东海城',
      '明都',
      '天海城',
      '星罗城',
      '灵波城',
      '傲来城',
      '北海城',
      '烈火盆地',
      '上陵城',
      '天定城',
      '海陆城',
    ],
  },
  设计师协会: {
    hq: '明都',
    branches: [
      '天斗城',
      '东海城',
      '明都',
      '天海城',
      '星罗城',
      '灵波城',
      '傲来城',
      '北海城',
      '烈火盆地',
      '上陵城',
      '天定城',
      '海陆城',
    ],
  },
  修理师协会: {
    hq: '明都',
    branches: [
      '天斗城',
      '东海城',
      '明都',
      '天海城',
      '星罗城',
      '灵波城',
      '傲来城',
      '北海城',
      '烈火盆地',
      '上陵城',
      '天定城',
      '海陆城',
    ],
  },
  战神殿: {
    hq: '明都',
    branches: [],
  },
  圣灵教: {
    hq: '秘密据点',
    branches: ['天斗城', '灵波城', '极北之地'],
  },

  史莱克学院: {
    hq: '史莱克城',
    branches: [],
  },
  日月皇家魂师学院: {
    hq: '明都',
    branches: [],
  },
  怪物学院: {
    hq: '星罗城',
    branches: [],
  },
  星罗皇家学院: {
    hq: '星罗城',
    branches: [],
  },
  天定星空魂师学院: {
    hq: '天定城',
    branches: [],
  },
  东海学院: {
    hq: '东海城',
    branches: [],
  },
  天海中级学院: {
    hq: '天海城',
    branches: [],
  },
  海陆中级学院: {
    hq: '海陆城',
    branches: [],
  },
  红山学院: {
    hq: '傲来城',
    branches: [],
  },

  斗罗联邦: {
    hq: '明都',
    branches: ['斗罗大陆'],
  },
  星罗帝国: {
    hq: '星罗城',
    branches: ['星罗大陆'],
  },
  斗灵帝国: {
    hq: '天斗城(斗灵帝国)',
    branches: ['灵波城', '斗灵大陆'],
  },
  血神军团: {
    hq: '无尽山脉',
    branches: [],
  },
  本体宗: {
    hq: '天斗城',
    branches: [],
  },
  泰坦巨猿家族: {
    hq: '天斗城',
    branches: [],
  },
  蓝电霸王龙家族: {
    hq: '隐世之地',
    branches: [],
  },
};

function getBaseStats(lv) {
  let spBase = 100;
  if (lv <= 10) spBase = 100 + (lv - 1) * 73.66;
  else if (lv <= 30) spBase = 763 + (lv - 10) * 161.85;
  else if (lv <= 50) spBase = 4000 + Math.pow(lv - 30, 2) * 27.5;
  else if (lv <= 70) spBase = 15000 + (lv - 50) * 1000;
  else if (lv <= 90) spBase = 35000 + (lv - 70) * 1250;
  else if (lv <= 95) spBase = 60000 + (lv - 90) * 6818;
  else if (lv < 98) spBase = 94090 + (lv - 95) * 15303.3;
  else if (lv === 98) spBase = 140000;
  else if (lv === 99) spBase = 200000;
  else if (lv === 99.5) spBase = 400000;
  else if (lv >= 100) spBase = 700000;
  spBase = Math.floor(spBase);

  let strBase = 10;
  if (lv <= 10) strBase = 10 + (lv - 1) * 4.66;
  else if (lv <= 30) strBase = 52 + (lv - 10) * 22.4;
  else if (lv <= 50) strBase = 500 + Math.pow(lv - 30, 2) * 3.75;
  else if (lv <= 70) strBase = 2000 + Math.pow(lv - 50, 2) * 12.5;
  else if (lv <= 90) strBase = 7000 + (lv - 70) * 400;
  else if (lv <= 95) strBase = 15000 + (lv - 90) * 2157;
  else if (lv < 98) strBase = 25785 + (lv - 95) * 3071.6;
  else if (lv === 98) strBase = 35000;
  else if (lv === 99) strBase = 43000;
  else if (lv === 99.5) strBase = 60000;
  else if (lv >= 100) strBase = 80000;
  strBase = Math.floor(strBase);

  let menBase = lv;
  if (lv <= 20) menBase = lv;
  else if (lv <= 30) menBase = 20 + (lv - 20) * 3;
  else if (lv <= 50) menBase = 50 + Math.pow(lv - 30, 2) * 1.125;
  else if (lv <= 70) menBase = 500 + Math.pow(lv - 50, 2) * 6.25;
  else if (lv <= 90) menBase = 3000 + (lv - 70) * 100;
  else if (lv <= 95) menBase = 5000 + (lv - 90) * 600;
  else if (lv < 98) menBase = 8000 + (lv - 95) * 2000;
  else if (lv === 98) menBase = 15000;
  else if (lv === 99) menBase = 19000;
  else if (lv === 99.5) menBase = 23000;
  else if (lv >= 100) menBase = 50000;

  return {
    sp_max: spBase,
    men_max: Math.floor(menBase),
    str: strBase,
    def: strBase,
    agi: Math.floor(strBase / 2),
    vit_max: strBase,
  };
}

function hashBattleSeedValue(seedText = '') {
  const text = String(seedText || '');
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createBattleSeedRng(seedText = '') {
  let state = hashBattleSeedValue(seedText) || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function withBattleSeedRandom(seedText, runner) {
  const nativeRandom = Math.random;
  const rng = createBattleSeedRng(seedText);
  Math.random = () => rng();
  try {
    return runner(rng);
  } finally {
    Math.random = nativeRandom;
  }
}

function pickBattleSeedItem(items = [], rng = Math.random) {
  if (!Array.isArray(items) || !items.length) return '';
  return items[Math.max(0, Math.min(items.length - 1, Math.floor(rng() * items.length)))] || items[0];
}

function pickBattleSeedInt(min = 0, max = min, rng = Math.random) {
  const low = Math.floor(Math.min(min, max));
  const high = Math.floor(Math.max(min, max));
  if (high <= low) return low;
  return low + Math.floor(rng() * (high - low + 1));
}

function estimateTemporaryHumanSkillCount(level = 1) {
  const safeLevel = Math.max(1, Math.floor(Number(level || 1)));
  if (safeLevel >= 80) return 4;
  if (safeLevel >= 50) return 3;
  if (safeLevel >= 30) return 2;
  return 1;
}

function estimateTemporaryMonsterSkillCount(unitNature = '魂兽', seed = {}) {
  if (unitNature === '魂兽') {
    const age = Math.max(0, Math.floor(Number(seed?.年限 || 0)));
    if (age >= 100000) return 4;
    if (age >= 10000) return 3;
    if (age >= 1000) return 2;
    return 1;
  }
  const tier = String(seed?.级别 || '').trim();
  if (tier === '深渊帝君' || tier === '深渊王者') return 4;
  if (tier === '高阶生物') return 3;
  if (tier === '中阶生物') return 2;
  return 1;
}

function estimateTemporaryHumanSkillAge(level = 1) {
  const safeLevel = Math.max(1, Math.floor(Number(level || 1)));
  if (safeLevel >= 90) return 100000;
  if (safeLevel >= 70) return 50000;
  if (safeLevel >= 50) return 10000;
  if (safeLevel >= 30) return 1000;
  if (safeLevel >= 20) return 300;
  return 100;
}

function buildTemporaryCombatSkillMap(seedText, unitName, combatType, level, skillCount, ageEquivalent, talentTier = '正常') {
  const total = Math.max(0, Math.min(4, Math.floor(Number(skillCount || 0))));
  if (total <= 0) return {};
  const skillMap = {};
  for (let index = 1; index <= total; index += 1) {
    skillMap[`魂技${index}`] = createDefaultRingSkillShell();
  }
  withBattleSeedRandom(`${seedText}|skills|${unitName}|${combatType}|${level}`, () => {
    ensureSkillMapGenerated(skillMap, (_, skillName) => ({
      type: combatType || '强攻系',
      talentTier: talentTier || '正常',
      age: Math.max(100, Number(ageEquivalent || 100)),
      ringIndex: Math.max(1, Number(String(skillName || '').replace(/[^\d]/g, '') || 1)),
      compatibility: 100,
      preferredSecondary: [],
      currentTick: 0,
      textContext: {
        spiritName: unitName || skillName,
        type: combatType || '强攻系',
      },
    }));
  });
  Object.keys(skillMap).forEach((skillName, index) => {
    const skill = skillMap[skillName];
    if (!skill || typeof skill !== 'object') return;
    skill.魂技名 = `魂技${index + 1}`;
    skill.画面描述 = '未知';
    skill.效果描述 = '未知';
  });
  return skillMap;
}

function buildTemporaryCombatEquipmentShell() {
  return {
    武器: { 名称: '无', 品阶: '无', 属性加成: { 魂力上限: 0, 精神力上限: 0, 力量: 0, 防御: 0, 敏捷: 0, 体力上限: 0 } },
    斗铠: { 等级: 0, 名称: '无', 领域: '无', 材质: '无', 装备状态: '未装备', 部件: {} },
    机甲: { 等级: '无', 型号: '无', 材质: '无', 状态: '完好', 装备状态: '未装备', 武装: '无', 品质系数: 1.0 },
  };
}

function resolveTemporaryHumanCombatType(identity = '魂师', rng = Math.random) {
  if (identity === '军人') {
    return pickBattleSeedItem(['强攻系', '强攻系', '防御系', '敏攻系', '控制系'], rng) || '强攻系';
  }
  return pickBattleSeedItem(['强攻系', '敏攻系', '防御系', '控制系', '辅助系', '治疗系', '食物系'], rng) || '强攻系';
}

function resolveTemporaryHumanMechGrade(level = 1) {
  if (level >= 90) return '红级';
  if (level >= 70) return '黑级';
  if (level >= 50) return '紫级';
  return '黄级';
}

function resolveTemporaryHumanArmorLevel(level = 1) {
  if (level >= 90) return 4;
  if (level >= 80) return 3;
  if (level >= 70) return 2;
  return 1;
}

function applyTemporaryHumanEquipment(stats, equipment, identity = '魂师', level = 1, rng = Math.random) {
  const safeStats = stats;
  if (identity === '普通人') return safeStats;

  const allowMech =
    identity === '军人'
      ? level >= 20 && rng() < (level >= 70 ? 0.85 : level >= 50 ? 0.75 : 0.65)
      : level >= 30 && rng() < (level >= 70 ? 0.65 : level >= 50 ? 0.45 : 0.25);
  if (allowMech) {
    const mechGrade = resolveTemporaryHumanMechGrade(level);
    equipment.机甲.等级 = mechGrade;
    equipment.机甲.型号 = `${mechGrade}制式机甲`;
    equipment.机甲.装备状态 = '已装备';
    const mechMult = mechGrade === '红级' ? 1.35 : mechGrade === '黑级' ? 1.22 : mechGrade === '紫级' ? 1.14 : 1.08;
    safeStats.sp_max = Math.floor(safeStats.sp_max * mechMult);
    safeStats.men_max = Math.floor(safeStats.men_max * Math.max(1.02, mechMult - 0.03));
    safeStats.def = Math.floor(safeStats.def * (mechMult + 0.08));
    safeStats.agi = Math.floor(safeStats.agi * Math.max(1.02, mechMult - 0.01));
    safeStats.vit_max = Math.floor(safeStats.vit_max * (mechMult + 0.05));
  }

  const allowArmor =
    identity === '军人'
      ? level >= 60 && rng() < (level >= 90 ? 0.4 : level >= 80 ? 0.28 : 0.15)
      : level >= 50 && rng() < (level >= 80 ? 0.5 : level >= 70 ? 0.35 : 0.18);
  if (allowArmor) {
    const armorLevel = resolveTemporaryHumanArmorLevel(level);
    equipment.斗铠.等级 = armorLevel;
    equipment.斗铠.名称 = `${armorLevel}字斗铠`;
    equipment.斗铠.装备状态 = '已装备';
    const armorMult = armorLevel === 4 ? 1.42 : armorLevel === 3 ? 1.28 : armorLevel === 2 ? 1.18 : 1.1;
    safeStats.str = Math.floor(safeStats.str * armorMult);
    safeStats.def = Math.floor(safeStats.def * (armorMult + 0.1));
    safeStats.vit_max = Math.floor(safeStats.vit_max * (armorMult + 0.05));
    safeStats.sp_max = Math.floor(safeStats.sp_max * Math.max(1.03, armorMult - 0.08));
  }
  return safeStats;
}

function inferTemporarySoulBeastCombatType(species = '', stats = {}) {
  const text = String(species || '').trim();
  if (/植物|藤|草|花|树/.test(text)) return '控制系';
  if (/海|鱼|鲸|鲨|章|蚌/.test(text)) return '控制系';
  if (/蛛|鸟|鹰|雕|蛇|猫|豹|狼|狐|蝠/.test(text)) return '敏攻系';
  if (/熊|猿|牛|犀|龟|象/.test(text)) return '防御系';
  if (Number(stats?.men_max || 0) > Number(stats?.str || 0) * 1.3) return '控制系';
  if (Number(stats?.agi || 0) > Number(stats?.def || 0) * 1.2) return '敏攻系';
  if (Number(stats?.def || 0) > Number(stats?.agi || 0) * 1.2) return '防御系';
  return '强攻系';
}

function inferTemporaryAbyssCombatType(species = '', stats = {}) {
  const text = String(species || '').trim();
  if (/蝙蝠|魔魅|恶镰/.test(text)) return '敏攻系';
  if (/灵帝|智帝|附体魔|黑皇/.test(text)) return '控制系';
  if (/巴安|天牛|猛犸|魔傀/.test(text)) return '防御系';
  if (Number(stats?.men_max || 0) > Number(stats?.str || 0) * 1.3) return '控制系';
  if (Number(stats?.agi || 0) > Number(stats?.def || 0) * 1.2) return '敏攻系';
  if (Number(stats?.def || 0) > Number(stats?.agi || 0) * 1.2) return '防御系';
  return '强攻系';
}

function buildTemporaryCombatSkeleton(name = '未知单位', unitNature = '人类') {
  return {
    name,
    来源: '临时单位',
    单位性质: unitNature,
    属性: {
      等级: 0,
      系别: '未知系',
      HP: 1,
      HP上限: 1,
      体力: 1,
      体力上限: 1,
      魂力: 0,
      魂力上限: 0,
      精神力: 1,
      精神力上限: 1,
      力量: 1,
      防御: 1,
      敏捷: 1,
      状态效果: {},
    },
    状态: {
      存活: true,
      当前领域: '无',
    },
    装备: buildTemporaryCombatEquipmentShell(),
    持续效果: {},
    蓄力技能: null,
    自创魂技: {},
    社交: { 势力: {} },
  };
}

function buildTemporaryHumanCombatant(seed = {}, slotName = 'enemy') {
  const identity = String(seed?.身份 || '普通人').trim();
  const quantity = Math.max(1, Math.floor(Number(seed?.数量 || 1)));
  const level = identity === '普通人' ? 0 : Math.max(1, Math.floor(Number(seed?.等级 || 1)));
  const unitName = String(seed?.名称 || seed?.name || slotName || '临时单位').trim() || '临时单位';
  const battleSeedText = `${unitName}|${identity}|${quantity}|${level}|${slotName}`;
  return withBattleSeedRandom(battleSeedText, rng => {
    const next = buildTemporaryCombatSkeleton(unitName, '人类');
    next.身份 = identity;
    next.数量 = quantity;
    if (identity === '普通人') {
      const hpMax = pickBattleSeedInt(48, 82, rng);
      const menMax = pickBattleSeedInt(8, 16, rng);
      next.属性.等级 = 0;
      next.属性.系别 = '普通人';
      next.属性.HP上限 = hpMax;
      next.属性.HP = hpMax;
      next.属性.体力上限 = hpMax;
      next.属性.体力 = hpMax;
      next.属性.魂力上限 = 0;
      next.属性.魂力 = 0;
      next.属性.精神力上限 = menMax;
      next.属性.精神力 = menMax;
      next.属性.力量 = pickBattleSeedInt(6, 10, rng);
      next.属性.防御 = pickBattleSeedInt(5, 9, rng);
      next.属性.敏捷 = pickBattleSeedInt(6, 10, rng);
      return next;
    }

    const combatType = resolveTemporaryHumanCombatType(identity, rng);
    const base = getBaseStats(level);
    const typeMult = TypeMultipliers[combatType] || TypeMultipliers['强攻系'];
    const variance = 0.92 + rng() * 0.16;
    const derived = {
      str: Math.floor(base.str * typeMult.str * variance),
      def: Math.floor(base.def * typeMult.def * variance),
      agi: Math.floor(base.agi * typeMult.agi * variance),
      vit_max: Math.floor(base.vit_max * typeMult.vit_max * variance),
      men_max: Math.floor(base.men_max * typeMult.men_max * variance),
      sp_max: Math.floor(base.sp_max * typeMult.sp_max * variance),
    };
    applyTemporaryHumanEquipment(derived, next.装备, identity, level, rng);
    next.属性.等级 = level;
    next.属性.系别 = combatType;
    next.属性.HP上限 = Math.max(1, derived.vit_max);
    next.属性.HP = next.属性.HP上限;
    next.属性.体力上限 = next.属性.HP上限;
    next.属性.体力 = next.属性.体力上限;
    next.属性.魂力上限 = Math.max(1, derived.sp_max);
    next.属性.魂力 = next.属性.魂力上限;
    next.属性.精神力上限 = Math.max(1, derived.men_max);
    next.属性.精神力 = next.属性.精神力上限;
    next.属性.力量 = Math.max(1, derived.str);
    next.属性.防御 = Math.max(1, derived.def);
    next.属性.敏捷 = Math.max(1, derived.agi);
    next.自创魂技 = buildTemporaryCombatSkillMap(
      battleSeedText,
      unitName,
      combatType,
      level,
      estimateTemporaryHumanSkillCount(level),
      estimateTemporaryHumanSkillAge(level),
      identity === '军人' ? '优秀' : '正常',
    );
    return next;
  });
}

function buildTemporarySoulBeastCombatant(seed = {}, slotName = 'enemy') {
  const unitName = String(seed?.名称 || seed?.name || slotName || '魂兽').trim() || '魂兽';
  const species = String(seed?.标准物种 || '').trim();
  const age = Math.max(1, Math.floor(Number(seed?.年限 || 1)));
  const quantity = Math.max(1, Math.floor(Number(seed?.数量 || 1)));
  const quality = String(seed?.品质 || '').trim();
  const stats = getBeastStats(age, species, quality);
  const combatType = inferTemporarySoulBeastCombatType(species, stats);
  const next = buildTemporaryCombatSkeleton(unitName, '魂兽');
  next.数量 = quantity;
  next.年限 = age;
  next.标准物种 = species;
  if (quality) next.品质 = quality;
  next.属性.年龄 = age;
  next.属性.等级 = Number(stats.对标等级 || 1);
  next.属性.系别 = combatType;
  next.属性.HP上限 = Math.max(1, Number(stats.vit_max || 1));
  next.属性.HP = next.属性.HP上限;
  next.属性.体力上限 = next.属性.HP上限;
  next.属性.体力 = next.属性.体力上限;
  next.属性.魂力上限 = Math.max(1, Number(stats.sp_max || 1));
  next.属性.魂力 = next.属性.魂力上限;
  next.属性.精神力上限 = Math.max(1, Number(stats.men_max || 1));
  next.属性.精神力 = next.属性.精神力上限;
  next.属性.力量 = Math.max(1, Number(stats.str || 1));
  next.属性.防御 = Math.max(1, Number(stats.def || 1));
  next.属性.敏捷 = Math.max(1, Number(stats.agi || 1));
  next.社交.势力['魂兽一族'] = { 身份: '敌对', 权限级: 1 };
  next.自创魂技 = buildTemporaryCombatSkillMap(
    `${unitName}|魂兽|${species}|${age}|${slotName}`,
    unitName,
    combatType,
    Number(stats.对标等级 || 1),
    estimateTemporaryMonsterSkillCount('魂兽', seed),
    age,
    '正常',
  );
  return next;
}

function buildTemporaryAbyssCombatant(seed = {}, slotName = 'enemy') {
  const unitName = String(seed?.名称 || seed?.name || slotName || '深渊生物').trim() || '深渊生物';
  const race = String(seed?.标准种族 || '').trim();
  const tier = String(seed?.级别 || '').trim();
  const quantity = Math.max(1, Math.floor(Number(seed?.数量 || 1)));
  const stats = withBattleSeedRandom(`${unitName}|深渊|${race}|${tier}|${slotName}`, () => getAbyssStats(tier, race));
  const combatType = inferTemporaryAbyssCombatType(race, stats);
  const next = buildTemporaryCombatSkeleton(unitName, '深渊');
  next.数量 = quantity;
  next.级别 = tier;
  next.标准种族 = race;
  next.属性.等级 = Number(stats.对标等级 || 1);
  next.属性.系别 = combatType;
  next.属性.HP上限 = Math.max(1, Number(stats.vit_max || 1));
  next.属性.HP = next.属性.HP上限;
  next.属性.体力上限 = next.属性.HP上限;
  next.属性.体力 = next.属性.体力上限;
  next.属性.魂力上限 = Math.max(1, Number(stats.sp_max || 1));
  next.属性.魂力 = next.属性.魂力上限;
  next.属性.精神力上限 = Math.max(1, Number(stats.men_max || 1));
  next.属性.精神力 = next.属性.精神力上限;
  next.属性.力量 = Math.max(1, Number(stats.str || 1));
  next.属性.防御 = Math.max(1, Number(stats.def || 1));
  next.属性.敏捷 = Math.max(1, Number(stats.agi || 1));
  next.社交.势力['深渊生物'] = { 身份: '敌对', 权限级: 1 };
  next.自创魂技 = buildTemporaryCombatSkillMap(
    `${unitName}|深渊|${race}|${tier}|${slotName}`,
    unitName,
    combatType,
    Number(stats.对标等级 || 1),
    estimateTemporaryMonsterSkillCount('深渊', seed),
    Math.max(1000, Number(stats.对标等级 || 1) * 1000),
    '正常',
  );
  return next;
}

function mergeTemporaryCombatRuntimeState(existing = {}, generated = {}) {
  const next = _.cloneDeep(generated || {});
  const existingStat = existing?.属性 && typeof existing.属性 === 'object' ? existing.属性 : {};
  const existingStatus = existing?.状态 && typeof existing.状态 === 'object' ? existing.状态 : {};
  if (!next.属性 || typeof next.属性 !== 'object') next.属性 = {};
  if (!next.状态 || typeof next.状态 !== 'object') next.状态 = {};

  ['HP', 'HP上限', '体力', '体力上限', '魂力', '魂力上限', '精神力', '精神力上限', '力量', '防御', '敏捷', '等级', '系别', '年龄', '状态效果'].forEach(key => {
    if (existingStat[key] !== undefined) next.属性[key] = _.cloneDeep(existingStat[key]);
  });
  ['存活', '当前领域', '行动', '位置', '横坐标', '纵坐标'].forEach(key => {
    if (existingStatus[key] !== undefined) next.状态[key] = _.cloneDeep(existingStatus[key]);
  });
  if (existing?.装备 && typeof existing.装备 === 'object') next.装备 = _.cloneDeep(existing.装备);
  if (existing?.持续效果 && typeof existing.持续效果 === 'object') next.持续效果 = _.cloneDeep(existing.持续效果);
  if (existing?.蓄力技能 !== undefined) next.蓄力技能 = _.cloneDeep(existing.蓄力技能);
  if (existing?.自创魂技 && typeof existing.自创魂技 === 'object') next.自创魂技 = _.cloneDeep(existing.自创魂技);
  return next;
}

function findCombatCharKeyByName(data = {}, participantName = '') {
  const safeName = String(participantName || '').trim();
  if (!safeName || !data?.char || typeof data.char !== 'object') return '';
  if (data.char[safeName]) return safeName;
  const match = Object.keys(data.char).find(charKey => {
    const charData = data.char[charKey];
    const displayName = String(charData?.name || charData?.base?.name || '').trim();
    return displayName && displayName === safeName;
  });
  return match || '';
}

function buildExpandedBattleParticipantFromChar(data = {}, charKey = '', roleName = '敌对') {
  const sourceChar = data?.char?.[charKey];
  if (!sourceChar || typeof sourceChar !== 'object') return null;
  const participant = _.cloneDeep(sourceChar);
  participant.name = String(participant.name || participant?.base?.name || charKey).trim() || charKey;
  participant.势力 = roleName;
  if (!participant.状态 || typeof participant.状态 !== 'object') participant.状态 = {};
  participant.状态.存活 = participant.状态.存活 !== false;
  return participant;
}

function buildExpandedTemporaryBattleParticipant(seed = {}, slotKey = 'enemy') {
  const unitNature = String(seed?.单位性质 || '').trim();
  if (unitNature === '人类') return buildTemporaryHumanCombatant(seed, slotKey);
  if (unitNature === '魂兽') return buildTemporarySoulBeastCombatant(seed, slotKey);
  if (unitNature === '深渊') return buildTemporaryAbyssCombatant(seed, slotKey);
  return null;
}

function expandBattleParticipantEntry(data = {}, participant = null, slotKey = 'enemy') {
  if (!participant || typeof participant !== 'object' || Array.isArray(participant)) return null;
  const participantName = String(participant.name || '').trim();
  const charKey = findCombatCharKeyByName(data, participantName);
  if (charKey) return buildExpandedBattleParticipantFromChar(data, charKey, slotKey === 'player' ? '己方' : '敌对');

  const generated = buildExpandedTemporaryBattleParticipant(participant, slotKey);
  if (!generated) return _.cloneDeep(participant);
  return mergeTemporaryCombatRuntimeState(participant, generated);
}

function expandBattleParticipantArray(data = {}, items = [], slotKey = 'team_enemy') {
  return (Array.isArray(items) ? items : []).flatMap((participant, index) =>
    explodeBattleParticipantQuantity(data, participant, `${slotKey}_${index + 1}`),
  ).filter(Boolean);
}

function explodeBattleParticipantQuantity(data = {}, participant = null, slotKey = 'enemy') {
  const expanded = expandBattleParticipantEntry(data, participant, slotKey);
  if (!expanded) return [];
  const hasExpandedStats = !!(expanded.属性 && typeof expanded.属性 === 'object');
  if (hasExpandedStats) return [expanded];
  const quantity = Math.max(1, Math.floor(Number(participant?.数量 || expanded?.数量 || 1)));
  const results = [];
  for (let index = 1; index <= quantity; index += 1) {
    const cloneSeed = _.cloneDeep(participant);
    const baseName = String(cloneSeed?.name || '').trim() || `临时单位${index}`;
    const displayName = index === 1 ? baseName : `${baseName}·${index}`;
    cloneSeed.name = displayName;
    cloneSeed.数量 = 1;
    const nextExpanded = expandBattleParticipantEntry(data, cloneSeed, `${slotKey}_${index}`);
    if (nextExpanded) results.push(nextExpanded);
  }
  return results;
}

function expandWorldBattleParticipants(data = {}) {
  const battle = data?.world?.战斗;
  const participants = battle?.参战者;
  if (!battle || typeof battle !== 'object' || !participants || typeof participants !== 'object') return;

  const nextParticipants = {
    player: null,
    enemy: null,
    team_player: [],
    team_enemy: [],
  };

  const playerExpanded = explodeBattleParticipantQuantity(data, participants.player, 'player');
  nextParticipants.player = playerExpanded[0] || null;
  if (playerExpanded.length > 1) nextParticipants.team_player.push(...playerExpanded.slice(1));

  const enemyExpanded = explodeBattleParticipantQuantity(data, participants.enemy, 'enemy');
  nextParticipants.enemy = enemyExpanded[0] || null;
  if (enemyExpanded.length > 1) nextParticipants.team_enemy.push(...enemyExpanded.slice(1));

  nextParticipants.team_player.push(...expandBattleParticipantArray(data, participants.team_player, 'team_player'));
  nextParticipants.team_enemy.push(...expandBattleParticipantArray(data, participants.team_enemy, 'team_enemy'));

  if (nextParticipants.player) nextParticipants.player.势力 = '己方';
  if (nextParticipants.enemy) nextParticipants.enemy.势力 = '敌对';
  nextParticipants.team_player.forEach(unit => {
    if (unit && typeof unit === 'object') unit.势力 = '己方';
  });
  nextParticipants.team_enemy.forEach(unit => {
    if (unit && typeof unit === 'object') unit.势力 = '敌对';
  });

  battle.参战者 = nextParticipants;
}

if (typeof globalThis !== 'undefined') {
  globalThis.__MVU_EXPAND_WORLD_BATTLE_PARTICIPANTS__ = function attachExpandedBattleParticipants(rootData = {}) {
    if (!rootData || typeof rootData !== 'object') return rootData;
    expandWorldBattleParticipants(rootData);
    return rootData;
  };
}

const SKILL_GENERATION_LAYERS = {
  L1: { name: '主机制大类', purpose: '决定技能的核心骨架' },
  L2: { name: '子机制', purpose: '决定技能的主要表现方式' },
  L3: { name: '副机制', purpose: '给技能附加第二效果' },
  L4: { name: '变异机制', purpose: '扭曲技能效果或代价，不代表更强' },
  L5: { name: '品质层', purpose: '决定数值强弱，与1-100抽到的机制种类无关' },
  L6: { name: '表现层', purpose: '用于命名、画面描述、特效摘要' },
};

const SKILL_MAIN_MECHANIC_POOL_V1 = {
  伤害类: {
    desc: '以直接造成伤害为核心结果的技能骨架',
    children: ['单体伤害', '群体伤害', '多段伤害', '延迟爆发', '持续伤害'],
  },
  控制类: {
    desc: '以限制行动、施法、位置或节奏为核心结果的技能骨架',
    children: ['硬控', '软控', '位移限制', '节奏打断'],
  },
  削弱类: {
    desc: '以压制面板、恢复效率、消耗或节奏为核心结果的技能骨架',
    children: ['单属性削弱', '多属性削弱', '禁疗', '消耗提高', '前摇拉长', '掌控压制'],
  },
  增益类: {
    desc: '以强化自身或友方面板、掌控或行动效率为核心结果的技能骨架',
    children: ['单属性增益', '多属性增益', '全属性增益', '消耗降低', '前摇缩短', '掌控提升', '速度提升'],
  },
  防御类: {
    desc: '以承伤、生存、防反、免疫类效果为核心结果的技能骨架',
    children: ['护盾', '减伤', '格挡/抵消', '霸体', '免死/锁血'],
  },
  回复类: {
    desc: '以恢复当前生命、魂力、精神力或清除异常为核心结果的技能骨架',
    children: ['体力恢复', '魂力恢复', '精神恢复', '持续恢复', '净化/解控'],
  },
  '感知/认知类': {
    desc: '以干涉感知、认知、情报或判断为核心结果的技能骨架',
    children: ['感知干扰', '标记锁定', '共享视野', '幻境', '催眠', '认知扭曲'],
  },
  位移类: {
    desc: '以改变自身、敌方或双方空间位置关系为核心结果的技能骨架',
    children: ['自身位移', '强制位移', '位移交换', '追击位移', '脱离位移'],
  },
  特殊规则类: {
    desc: '以修改战斗规则、触发条件、效果归属或目标关系为核心结果的技能骨架',
    children: ['分身', '复制', '反制', '转化', '状态交换', '强制绑定/锁定', '条件触发', '规则改写'],
  },
};

const SKILL_DELIVERY_FORM_POOL_V1 = [
  '直接生效',
  '自身附体',
  '远程命中',
  '范围展开',
  '召唤承载',
  '造物承载',
  '标记触发',
  '延迟触发',
];

const SKILL_MAIN_MECHANIC_DISTRIBUTION_V1 = {
  强攻系: [
    { min: 1, max: 50, main: '伤害类' },
    { min: 51, max: 66, main: '增益类' },
    { min: 67, max: 80, main: '防御类' },
    { min: 81, max: 88, main: '控制类' },
    { min: 89, max: 94, main: '削弱类' },
    { min: 95, max: 97, main: '位移类' },
    { min: 98, max: 99, main: '回复类' },
    { min: 100, max: 100, main: '特殊规则类' },
  ],
  控制系: [
    { min: 1, max: 34, main: '控制类' },
    { min: 35, max: 60, main: '削弱类' },
    { min: 61, max: 76, main: '感知/认知类' },
    { min: 77, max: 86, main: '位移类' },
    { min: 87, max: 93, main: '伤害类' },
    { min: 94, max: 99, main: '防御类' },
    { min: 100, max: 100, main: '特殊规则类' },
  ],
  食物系: [
    { min: 1, max: 40, main: '回复类' },
    { min: 41, max: 80, main: '增益类' },
    { min: 81, max: 85, main: '防御类' },
    { min: 86, max: 90, main: '感知/认知类' },
    { min: 91, max: 95, main: '特殊规则类' },
    { min: 96, max: 100, main: '伤害类' },
  ],
  精神系: [
    { min: 1, max: 26, main: '感知/认知类' },
    { min: 27, max: 46, main: '控制类' },
    { min: 47, max: 62, main: '削弱类' },
    { min: 63, max: 78, main: '伤害类' },
    { min: 79, max: 90, main: '增益类' },
    { min: 91, max: 100, main: '特殊规则类' },
  ],
  防御系: [
    { min: 1, max: 42, main: '防御类' },
    { min: 43, max: 62, main: '增益类' },
    { min: 63, max: 76, main: '伤害类' },
    { min: 77, max: 86, main: '控制类' },
    { min: 87, max: 93, main: '削弱类' },
    { min: 94, max: 99, main: '回复类' },
    { min: 100, max: 100, main: '特殊规则类' },
  ],
  敏攻系: [
    { min: 1, max: 42, main: '伤害类' },
    { min: 43, max: 62, main: '位移类' },
    { min: 63, max: 76, main: '增益类' },
    { min: 77, max: 86, main: '控制类' },
    { min: 87, max: 93, main: '削弱类' },
    { min: 94, max: 99, main: '防御类' },
    { min: 100, max: 100, main: '特殊规则类' },
  ],
  元素系: [
    { min: 1, max: 38, main: '伤害类' },
    { min: 39, max: 58, main: '控制类' },
    { min: 59, max: 72, main: '削弱类' },
    { min: 73, max: 84, main: '防御类' },
    { min: 85, max: 92, main: '增益类' },
    { min: 93, max: 97, main: '位移类' },
    { min: 98, max: 100, main: '特殊规则类' },
  ],
  辅助系: [
    { min: 1, max: 34, main: '增益类' },
    { min: 35, max: 56, main: '回复类' },
    { min: 57, max: 74, main: '防御类' },
    { min: 75, max: 86, main: '感知/认知类' },
    { min: 87, max: 94, main: '削弱类' },
    { min: 95, max: 99, main: '特殊规则类' },
    { min: 100, max: 100, main: '伤害类' },
  ],
  治疗系: [
    { min: 1, max: 44, main: '回复类' },
    { min: 45, max: 66, main: '防御类' },
    { min: 67, max: 82, main: '增益类' },
    { min: 83, max: 90, main: '感知/认知类' },
    { min: 91, max: 96, main: '特殊规则类' },
    { min: 97, max: 100, main: '伤害类' },
  ],
};

const SKILL_ARCHETYPE_POOL_V1 = {
  伤害类: ['直接伤害', '多段伤害', '延迟爆发', '持续伤害'],
  控制类: ['硬控', '软控', '位移限制', '节奏打断'],
  削弱类: ['单属性削弱', '多属性削弱', '禁疗', '消耗提高', '前摇拉长', '掌控压制'],
  增益类: ['单属性增益', '多属性增益', '全属性增益', '消耗降低', '前摇缩短', '掌控提升', '速度提升', '修炼增益'],
  防御类: ['护盾', '减伤', '格挡/抵消', '霸体', '免死/锁血', '无敌金身', '伤害反射', '伤害分摊', '替身抵消', '复苏'],
  回复类: ['体力恢复', '魂力恢复', '精神恢复', '持续恢复', '净化/解控'],
  '感知/认知类': ['感知干扰', '标记锁定', '共享视野', '幻境', '催眠', '认知扭曲'],
  位移类: ['自身位移', '强制位移', '位移交换', '追击位移', '脱离位移'],
  特殊规则类: ['分身', '复制', '反制', '转化', '状态交换', '状态转移', '强制绑定/锁定', '条件触发', '规则改写', '引爆持续伤害', '斩盾', '窃取护盾', '吞噬', '能力共享', '机制抹消'],
};

const AUTO_GENERATED_EXCLUSIVE_MAIN_ARCHETYPES_V1 = new Set([
  '吞噬',
  '能力共享',
  '机制抹消',
  '状态转移',
  '引爆持续伤害',
  '斩盾',
  '窃取护盾',
  '无敌金身',
  '替身抵消',
  '复苏',
  '伤害分摊',
  '伤害反射',
]);

const SPECIAL_RULE_EXPANDED_ARCHETYPE_SET_V1 = new Set([
  '吞噬',
  '能力共享',
  '机制抹消',
  '状态转移',
  '引爆持续伤害',
  '斩盾',
  '窃取护盾',
]);

const SKILL_DELIVERY_FORM_BY_TYPE_V1 = {
  强攻系: ['直接生效', '自身附体', '远程命中'],
  控制系: ['直接生效', '范围展开', '延迟触发', '标记触发'],
  食物系: ['造物承载', '延迟触发', '远程命中'],
  精神系: ['直接生效', '标记触发', '延迟触发', '范围展开'],
  防御系: ['自身附体', '直接生效', '范围展开'],
  敏攻系: ['直接生效', '远程命中', '自身附体'],
  元素系: ['远程命中', '范围展开', '延迟触发', '直接生效'],
  辅助系: ['直接生效', '范围展开', '标记触发'],
  治疗系: ['直接生效', '范围展开', '标记触发'],
};

const SKILL_ATTRIBUTE_HINTS_BY_TYPE_V1 = {
  强攻系: ['力量', '魂力', '防御'],
  控制系: ['魂力', '精神力', '敏捷'],
  食物系: ['魂力', '精神力'],
  精神系: ['精神力', '魂力'],
  防御系: ['防御', '魂力'],
  敏攻系: ['敏捷', '力量', '魂力'],
  元素系: ['精神力', '魂力', '敏捷'],
  辅助系: ['魂力', '精神力', '防御'],
  治疗系: ['魂力', '精神力'],
};

function pickRandom(list = []) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

const SKILL_SECONDARY_BY_MAIN_V1 = {
  伤害类: ['穿透', '吸血', '斩杀补伤', '流血DOT', '打断', '反击', '追击', '引爆持续伤害', '斩盾', '吞噬'],
  控制类: ['打断', '沉默', '减速', '致盲', '迟缓', '禁疗', '缴械', '嘲讽', '破隐', '封技'],
  削弱类: ['禁疗', '减速', '迟缓', '标记弱点', '缴械', '驱散增益', '破隐', '治疗反转', '封技', '斩盾', '吞噬', '机制抹消'],
  增益类: ['小护盾', '净化', '解控', '共享视野', '隐身', '护卫', '无敌金身', '复苏', '能力共享', '修炼增益'],
  防御类: ['小护盾', '反击', '净化', '解控', '护卫', '嘲讽', '无敌金身', '伤害反射', '伤害分摊', '替身抵消', '复苏'],
  回复类: ['净化', '解控', '小护盾', '魂力恢复', '精神恢复', '驱散增益', '护卫', '复苏', '能力共享', '修炼增益'],
  '感知/认知类': ['标记弱点', '共享视野', '目标锁定', '打断', '沉默', '缴械', '驱散增益', '窃取增益', '破隐'],
  位移类: ['打断', '反击', '标记弱点', '缴械', '隐身', '破隐'],
  特殊规则类: ['共享视野', '标记弱点', '净化', '驱散增益', '窃取增益', '隐身', '护卫', '状态转移', '引爆持续伤害', '斩盾', '窃取护盾', '吞噬', '能力共享', '机制抹消', '治疗反转', '封技', '无敌金身', '伤害反射', '伤害分摊', '替身抵消', '复苏'],
};

const SKILL_SECONDARY_TYPE_BIAS_V1 = {
  强攻系: ['斩盾', '引爆持续伤害', '无敌金身', '伤害反射', '反击', '追击'],
  防御系: ['伤害反射', '复苏', '护卫'],
  敏攻系: ['隐身', '追击', '破隐', '替身抵消', '无敌金身', '斩盾'],
  控制系: ['封技', '治疗反转', '目标锁定', '缴械', '驱散增益', '嘲讽', '伤害分摊', '吞噬', '机制抹消'],
  精神系: ['状态转移', '封技', '治疗反转', '窃取增益', '目标锁定', '隐身', '吞噬', '能力共享', '机制抹消'],
  元素系: ['引爆持续伤害', '斩盾', '封技', '治疗反转', '驱散增益', '破隐', '吞噬', '机制抹消'],
  辅助系: ['护卫', '复苏', '共享视野', '驱散增益', '窃取护盾', '无敌金身', '伤害分摊', '能力共享'],
  治疗系: ['复苏', '护卫', '驱散增益', '共享视野', '无敌金身', '窃取护盾', '伤害分摊', '能力共享'],
  食物系: ['修炼增益', '复苏', '驱散增益', '共享视野', '窃取护盾', '治疗反转', '护卫', '能力共享'],
};

const SKILL_MECHANISM_DEFAULT_META_V1 = Object.freeze({
  可主机制: false,
  可副机制: false,
  目标语义: '上下文',
  群体赋予: false,
  仅自身: false,
  副作用模板: Object.freeze([]),
  运行时消费器: '',
  摘要提示: Object.freeze({}),
  设计台参数定义: Object.freeze([]),
  designerMainHint: '',
  designerSubHint: '',
  designerSecondaryHint: '',
});

function createSkillMechanismParamDefV1(type = 'text', key = '', label = '', placeholder = '', extra = {}) {
  return Object.freeze({
    type,
    key: String(key || '').trim(),
    label: String(label || '').trim(),
    placeholder: String(placeholder || '').trim(),
    ...extra,
  });
}

function createSkillMechanismMetaV1(meta = {}) {
  return Object.freeze({
    ...SKILL_MECHANISM_DEFAULT_META_V1,
    ...meta,
    摘要提示: Object.freeze(meta.摘要提示 && typeof meta.摘要提示 === 'object' ? meta.摘要提示 : {}),
    设计台参数定义: Object.freeze(Array.isArray(meta.设计台参数定义) ? meta.设计台参数定义.filter(Boolean) : []),
    副作用模板: Object.freeze(
      Array.isArray(meta.副作用模板)
        ? meta.副作用模板
            .map(item => normalizeSkillSideEffectEntry(item))
            .filter(Boolean)
        : [],
    ),
  });
}

const SKILL_SIDE_EFFECT_TRIGGER_OPTIONS_V1 = Object.freeze(['施放后', '命中后', '回合结束时', '状态结束后']);
const SKILL_SIDE_EFFECT_TARGET_OPTIONS_V1 = Object.freeze(['施术者', '状态持有者', '受术目标', '双方']);

function normalizeSkillSideEffectStatMap(value = {}) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const normalized = {};
  ['str', 'def', 'agi', 'vit_max', 'sp_max', 'men_max'].forEach(key => {
    const parsed = Number(source[key]);
    if (Number.isFinite(parsed) && parsed > 0) normalized[key] = Number(parsed.toFixed(4));
  });
  return normalized;
}

function normalizeSkillSideEffectCombatMap(value = {}) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const normalized = {};
  const booleanKeys = ['skip_turn', '致死'];
  const ratioKeys = ['random_target_rate', 'hit_penalty', 'dodge_penalty', 'cast_speed_penalty', 'control_success_penalty'];
  booleanKeys.forEach(key => {
    if (source[key] === true) normalized[key] = true;
  });
  ratioKeys.forEach(key => {
    const parsed = Number(source[key]);
    if (Number.isFinite(parsed) && parsed > 0) normalized[key] = Number(parsed.toFixed(4));
  });
  return normalized;
}

function normalizeSkillSideEffectEntry(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const 副作用类型 = String(value.副作用类型 || '').trim();
  if (!副作用类型) return null;
  const rawTrigger = String(value.触发时机 || '施放后').trim();
  const 触发时机 = SKILL_SIDE_EFFECT_TRIGGER_OPTIONS_V1.includes(rawTrigger) ? rawTrigger : '施放后';
  const rawTarget = String(value.生效对象 || '施术者').trim();
  const 生效对象 = SKILL_SIDE_EFFECT_TARGET_OPTIONS_V1.includes(rawTarget) ? rawTarget : '施术者';
  const rawDuration = Number(value.持续回合 ?? value.duration ?? 0);
  const 持续回合 = Number.isFinite(rawDuration) ? Math.max(0, Math.round(rawDuration)) : 0;
  const rawChance = Number(value.触发概率 ?? 1);
  const 触发概率 = Number.isFinite(rawChance) ? Math.max(0, Math.min(1, Number(rawChance.toFixed(4)))) : 1;
  const 面板修改比例 = normalizeSkillSideEffectStatMap(value.面板修改比例);
  const 战斗效果 = normalizeSkillSideEffectCombatMap(value.战斗效果);
  const 关联状态 = String(value.关联状态 || '').trim();
  const normalized = {
    副作用类型,
    触发时机,
    生效对象,
    持续回合,
    触发概率,
  };
  if (safeEntries(面板修改比例).length) normalized.面板修改比例 = 面板修改比例;
  if (safeEntries(战斗效果).length) normalized.战斗效果 = 战斗效果;
  if (关联状态) normalized.关联状态 = 关联状态;
  return normalized;
}

function normalizeSkillSideEffectList(value = []) {
  const source = Array.isArray(value) ? value : [];
  return source
    .map(item => normalizeSkillSideEffectEntry(item))
    .filter(Boolean);
}

function buildAutoGeneratedSkillSideEffectListV1(mutation = [], context = {}) {
  const 变异机制 = Array.isArray(mutation) ? mutation.map(item => String(item || '').trim()).filter(Boolean) : [];
  const 侧效列表 = [];
  const 主状态名 = String(context.状态名称 || context.主机制原型 || '状态效果').trim() || '状态效果';
  if (变异机制.includes('增益附副作用')) {
    侧效列表.push({
      副作用类型: '全属性降低',
      触发时机: '状态结束后',
      生效对象: '状态持有者',
      持续回合: Math.max(1, Number(context.副作用持续回合 || 2)),
      触发概率: 1,
      关联状态: 主状态名,
      面板修改比例: { str: 0.88, def: 0.88, agi: 0.88, vit_max: 0.92, sp_max: 0.9, men_max: 0.9 },
    });
  }
  if (变异机制.includes('高波动随机值')) {
    侧效列表.push({
      副作用类型: '增幅失控',
      触发时机: '回合结束时',
      生效对象: '状态持有者',
      持续回合: 1,
      触发概率: 0.4,
      关联状态: 主状态名,
      战斗效果: { random_target_rate: 0.35, hit_penalty: 0.08, cast_speed_penalty: 0.08 },
    });
  }
  return normalizeSkillSideEffectList(侧效列表);
}

const SKILL_MECHANISM_META_V1 = (() => {
  const map = {};
  const num = (key, label, placeholder = '', step = '0.1', extra = {}) =>
    createSkillMechanismParamDefV1('number', key, label, placeholder, { step, ...extra });
  const text = (key, label, placeholder = '', extra = {}) =>
    createSkillMechanismParamDefV1('text', key, label, placeholder, extra);
  const select = (key, label, optionsKey = '', placeholder = '未设置', extra = {}) =>
    createSkillMechanismParamDefV1('select', key, label, placeholder, { optionsKey, ...extra });
  const register = (labels, meta = {}) => {
    const normalizedLabels = Array.isArray(labels) ? labels : [labels];
    normalizedLabels
      .map(label => String(label || '').trim())
      .filter(Boolean)
      .forEach(label => {
        map[label] = createSkillMechanismMetaV1({
          designerMainHint: label,
          designerSubHint: label,
          designerSecondaryHint: label,
          运行时消费器: label,
          ...meta,
        });
      });
  };

  register(['直接伤害', '单体伤害'], {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'direct_damage',
    摘要提示: { skillType: '输出', mainType: '伤害类', effectMode: '瞬发' },
    designerMainHint: '伤害类',
    designerSubHint: '单体伤害',
    设计台参数定义: [num('powerRatio', '威力倍率', '1.25'), num('hitCount', '命中次数', '1', '1')],
  });
  register('群体伤害', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'direct_damage',
    摘要提示: { skillType: '输出', mainType: '伤害类', cooperation: '高', effectMode: '瞬发' },
    designerMainHint: '伤害类',
    designerSubHint: '群体伤害',
    设计台参数定义: [num('powerRatio', '威力倍率', '1.05'), text('range', '作用范围', '前方扇形 / 半径8米')],
  });
  register('多段伤害', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'multi_damage',
    摘要提示: { skillType: '输出', mainType: '伤害类', effectMode: '持续' },
    designerMainHint: '伤害类',
    designerSubHint: '多段伤害',
    设计台参数定义: [
      num('segmentRatio', '每段倍率', '0.45'),
      num('segmentCount', '段数', '3', '1'),
      text('segmentInterval', '段间间隔', '短促连击'),
    ],
  });
  register('延迟爆发', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'delay_burst',
    摘要提示: { skillType: '输出', mainType: '伤害类', effectMode: '延迟' },
    designerMainHint: '伤害类',
    designerSubHint: '延迟爆发',
    设计台参数定义: [
      num('burstRatio', '爆发倍率', '1.8'),
      text('delayWindow', '延迟时长', '1回合 / 3秒'),
      text('triggerRule', '触发条件', '计时结束 / 再次命中'),
    ],
  });
  register('持续伤害', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'dot_damage',
    摘要提示: { skillType: '输出', mainType: '伤害类', effectMode: '持续' },
    designerMainHint: '伤害类',
    designerSubHint: '持续伤害',
    设计台参数定义: [
      num('dotRatio', '每跳倍率', '0.35'),
      num('duration', '持续回合', '3', '1'),
      num('stackLimit', '叠层上限', '1', '1'),
    ],
  });
  register('硬控', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'hard_control',
    摘要提示: { skillType: '控制', mainType: '控制类', controlStrength: '硬控' },
    designerMainHint: '控制类',
    designerSubHint: '硬控',
    设计台参数定义: [
      num('duration', '持续回合', '2', '1'),
      num('controlPower', '控制强度', '1.0'),
      text('breakRule', '解除条件', '受击 / 净化'),
    ],
  });
  register('软控', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'soft_control',
    摘要提示: { skillType: '控制', mainType: '控制类', controlStrength: '软控' },
    designerMainHint: '控制类',
    designerSubHint: '软控',
    设计台参数定义: [num('slowRatio', '控制幅度', '0.3'), num('duration', '持续回合', '2', '1')],
  });
  register('位移限制', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'position_lock',
    摘要提示: { skillType: '控制', mainType: '控制类', controlStrength: '软控' },
    designerMainHint: '控制类',
    designerSubHint: '位移限制',
    设计台参数定义: [
      num('limitPower', '限制强度', '0.2'),
      num('duration', '持续回合', '2', '1'),
      text('lockRange', '封锁范围', '半径5米'),
    ],
  });
  register(['节奏打断', '打断'], {
    可主机制: true,
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'interrupt',
    摘要提示: { skillType: '控制', mainType: '控制类', effectMode: '瞬发' },
    designerMainHint: '控制类',
    designerSubHint: '节奏打断',
    designerSecondaryHint: '打断',
    设计台参数定义: [select('interruptWindow', '打断时机', 'INTERRUPT_WINDOW'), num('extraDelay', '追加僵直', '0.5')],
  });
  register('封技', {
    可主机制: true,
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'skill_seal',
    摘要提示: { skillType: '控制', mainType: '控制类', controlStrength: '软控' },
    designerMainHint: '控制类',
    designerSubHint: '封技',
    designerSecondaryHint: '封技',
    设计台参数定义: [num('duration', '持续回合', '2', '1'), select('muteScope', '限制范围', 'MUTE_SCOPE')],
  });
  register('单属性削弱', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'attribute_debuff',
    摘要提示: { skillType: '控制', mainType: '削弱类' },
    designerMainHint: '削弱类',
    designerSubHint: '单属性削弱',
    设计台参数定义: [
      select('debuffAttr', '削弱属性', 'ATTRIBUTE'),
      num('reduceRatio', '压制倍率', '0.8'),
      num('duration', '持续回合', '2', '1'),
    ],
  });
  register('多属性削弱', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'attribute_debuff',
    摘要提示: { skillType: '控制', mainType: '削弱类' },
    designerMainHint: '削弱类',
    designerSubHint: '多属性削弱',
    设计台参数定义: [
      select('debuffAttrGroup', '属性组', 'ATTRIBUTE_GROUP'),
      num('reduceRatio', '压制倍率', '0.8'),
      num('duration', '持续回合', '2', '1'),
    ],
  });
  register('禁疗', {
    可主机制: true,
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'anti_heal',
    摘要提示: { skillType: '控制', mainType: '削弱类', controlStrength: '软控' },
    designerMainHint: '削弱类',
    designerSubHint: '禁疗',
    designerSecondaryHint: '禁疗',
    设计台参数定义: [num('banHealRatio', '禁疗幅度', '1.0'), num('duration', '持续回合', '2', '1')],
  });
  register('治疗反转', {
    可主机制: true,
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'heal_inversion',
    摘要提示: { skillType: '控制', mainType: '削弱类', controlStrength: '软控' },
    designerMainHint: '削弱类',
    designerSubHint: '治疗反转',
    designerSecondaryHint: '治疗反转',
    设计台参数定义: [num('invertRatio', '反转倍率', '1.0'), num('duration', '持续回合', '2', '1')],
  });
  register('消耗提高', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'cost_increase',
    摘要提示: { skillType: '控制', mainType: '削弱类' },
    designerMainHint: '削弱类',
    designerSubHint: '消耗提高',
    设计台参数定义: [num('gainRatio', '提高倍率', '1.2'), num('duration', '持续回合', '2', '1')],
  });
  register('前摇拉长', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'windup_increase',
    摘要提示: { skillType: '控制', mainType: '削弱类' },
    designerMainHint: '削弱类',
    designerSubHint: '前摇拉长',
    设计台参数定义: [num('gainRatio', '拉长倍率', '1.2'), num('duration', '持续回合', '2', '1')],
  });
  register('掌控压制', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'mastery_reduce',
    摘要提示: { skillType: '控制', mainType: '削弱类' },
    designerMainHint: '削弱类',
    designerSubHint: '掌控压制',
    设计台参数定义: [num('reduceRatio', '压制倍率', '0.85'), num('duration', '持续回合', '2', '1')],
  });
  register('速度压制', {
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'speed_reduce',
    摘要提示: { skillType: '控制', mainType: '削弱类' },
    designerSecondaryHint: '减速',
    设计台参数定义: [num('slowRatio', '压制幅度', '0.3'), num('duration', '持续回合', '2', '1')],
  });
  register('单属性增益', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'attribute_buff',
    摘要提示: { skillType: '辅助', mainType: '增益类', cooperation: '中' },
    designerMainHint: '增益类',
    designerSubHint: '单属性增益',
    设计台参数定义: [
      select('buffAttr', '增幅对象', 'ATTRIBUTE'),
      num('gainRatio', '增幅倍率', '1.3'),
      num('duration', '持续回合', '3', '1'),
    ],
  });
  register('多属性增益', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'attribute_buff',
    摘要提示: { skillType: '辅助', mainType: '增益类', cooperation: '高' },
    designerMainHint: '增益类',
    designerSubHint: '多属性增益',
    设计台参数定义: [
      select('buffAttrGroup', '属性组', 'ATTRIBUTE_GROUP'),
      num('gainRatio', '增幅倍率', '1.2'),
      num('duration', '持续回合', '3', '1'),
    ],
  });
  register('全属性增益', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'attribute_buff',
    摘要提示: { skillType: '辅助', mainType: '增益类', cooperation: '高' },
    designerMainHint: '增益类',
    designerSubHint: '全属性增益',
    设计台参数定义: [num('allGainRatio', '全属性倍率', '1.15'), num('duration', '持续回合', '2', '1')],
  });
  register('消耗降低', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'cost_reduce',
    摘要提示: { skillType: '辅助', mainType: '增益类' },
    designerMainHint: '增益类',
    designerSubHint: '消耗降低',
    设计台参数定义: [num('gainRatio', '降低倍率', '0.85'), num('duration', '持续回合', '3', '1')],
  });
  register('前摇缩短', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'windup_reduce',
    摘要提示: { skillType: '辅助', mainType: '增益类' },
    designerMainHint: '增益类',
    designerSubHint: '前摇缩短',
    设计台参数定义: [num('gainRatio', '缩短倍率', '0.85'), num('duration', '持续回合', '2', '1')],
  });
  register('掌控提升', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'mastery_raise',
    摘要提示: { skillType: '辅助', mainType: '增益类' },
    designerMainHint: '增益类',
    designerSubHint: '掌控提升',
    设计台参数定义: [num('gainRatio', '提升倍率', '1.2'), num('duration', '持续回合', '3', '1')],
  });
  register('速度提升', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'speed_raise',
    摘要提示: { skillType: '辅助', mainType: '增益类' },
    designerMainHint: '增益类',
    designerSubHint: '速度提升',
    设计台参数定义: [num('gainRatio', '提升倍率', '1.15'), num('duration', '持续回合', '2', '1')],
  });
  register('修炼增益', {
    可主机制: true,
    可副机制: true,
    目标语义: '可赋予',
    运行时消费器: 'cultivation_boost',
    摘要提示: { skillType: '辅助', mainType: '增益类', effectMode: '持续' },
    designerMainHint: '增益类',
    designerSubHint: '修炼增益',
    designerSecondaryHint: '修炼增益',
    设计台参数定义: [num('cultivateRatio', '修炼倍率', '1.2'), num('duration', '持续回合', '6', '1')],
  });
  register(['护盾', '小护盾'], {
    可主机制: true,
    可副机制: true,
    目标语义: '可赋予',
    运行时消费器: 'shield',
    摘要提示: { skillType: '防御', mainType: '防御类', defenseNature: '护盾', effectMode: '持续' },
    designerMainHint: '防御类',
    designerSubHint: '护盾',
    designerSecondaryHint: '小护盾',
    设计台参数定义: [
      num('shieldRatio', '护盾倍率', '0.8'),
      num('duration', '持续回合', '2', '1'),
      select('shieldCap', '护盾上限', 'SHIELD_CAP'),
    ],
  });
  register('减伤', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'damage_reduce',
    摘要提示: { skillType: '防御', mainType: '防御类', defenseNature: '减伤', effectMode: '持续' },
    designerMainHint: '防御类',
    designerSubHint: '减伤',
    设计台参数定义: [
      num('reduceRatio', '减伤比例', '0.35'),
      num('duration', '持续回合', '2', '1'),
      text('damageType', '覆盖类型', '物理 / 元素 / 全伤'),
    ],
  });
  register(['格挡', '格挡/抵消'], {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'block',
    摘要提示: { skillType: '防御', mainType: '防御类', defenseNature: '格挡', effectMode: '触发' },
    designerMainHint: '防御类',
    designerSubHint: '格挡/抵消',
    设计台参数定义: [
      num('blockCount', '格挡次数', '1', '1'),
      text('blockCap', '单次上限', '最多抵消一次大招'),
      text('triggerRule', '触发条件', '受击瞬间'),
    ],
  });
  register('霸体', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'super_armor',
    摘要提示: { skillType: '防御', mainType: '防御类', defenseNature: '霸体', effectMode: '持续' },
    designerMainHint: '防御类',
    designerSubHint: '霸体',
    设计台参数定义: [
      num('duration', '持续回合', '2', '1'),
      select('immuneLevel', '免控级别', 'IMMUNE_LEVEL'),
      num('reduceRatio', '额外减伤', '0.2'),
    ],
  });
  register(['免死', '免死/锁血'], {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'death_save',
    摘要提示: { skillType: '防御', mainType: '防御类', defenseNature: '免死', effectMode: '触发' },
    designerMainHint: '防御类',
    designerSubHint: '免死/锁血',
    设计台参数定义: [
      text('triggerThreshold', '触发阈值', '低于20%生命'),
      text('lockBloodFloor', '锁血下限', '保留1点 / 10%'),
      text('cooldown', '冷却/次数', '每战1次'),
    ],
  });
  register('无敌金身', {
    可主机制: true,
    可副机制: true,
    目标语义: '可赋予',
    运行时消费器: 'invincible',
    摘要提示: { skillType: '防御', mainType: '防御类', defenseNature: '无敌', effectMode: '触发' },
    designerMainHint: '防御类',
    designerSubHint: '无敌金身',
    designerSecondaryHint: '无敌金身',
    设计台参数定义: [
      num('duration', '持续回合', '2', '1'),
      num('dailyLimit', '每日触发', '3', '1'),
      num('tierThreshold', '免疫位阶', '100', '0.5'),
      num('reduceRatio', '附带减伤', '0.18'),
    ],
  });
  register('伤害反射', {
    可主机制: true,
    可副机制: true,
    目标语义: '可赋予',
    运行时消费器: 'damage_reflect',
    摘要提示: { skillType: '防御', mainType: '防御类', defenseNature: '反射', effectMode: '触发' },
    designerMainHint: '防御类',
    designerSubHint: '伤害反射',
    designerSecondaryHint: '伤害反射',
    设计台参数定义: [
      num('reflectRatio', '反射比例', '0.25'),
      num('duration', '持续回合', '2', '1'),
      text('reflectRule', '触发条件', '受击后'),
    ],
  });
  register('伤害分摊', {
    可主机制: true,
    可副机制: true,
    目标语义: '可赋予',
    群体赋予: true,
    运行时消费器: 'damage_share',
    摘要提示: { skillType: '防御', mainType: '防御类', defenseNature: '分摊', cooperation: '高', effectMode: '触发' },
    designerMainHint: '防御类',
    designerSubHint: '伤害分摊',
    designerSecondaryHint: '伤害分摊',
    设计台参数定义: [
      num('shareRatio', '分摊比例', '0.35'),
      num('shareCount', '分摊人数', '1', '1'),
      num('duration', '持续回合', '2', '1'),
    ],
  });
  register('替身抵消', {
    可主机制: true,
    可副机制: true,
    目标语义: '可赋予',
    运行时消费器: 'substitute',
    摘要提示: { skillType: '防御', mainType: '防御类', defenseNature: '替身', effectMode: '触发' },
    designerMainHint: '防御类',
    designerSubHint: '替身抵消',
    designerSecondaryHint: '替身抵消',
    设计台参数定义: [
      num('substituteCount', '抵消次数', '1', '1'),
      num('duration', '持续回合', '2', '1'),
      text('substituteRule', '触发条件', '受击时'),
    ],
  });
  register('复苏', {
    可主机制: true,
    可副机制: true,
    目标语义: '可赋予',
    运行时消费器: 'revive',
    摘要提示: { skillType: '防御', mainType: '防御类', defenseNature: '复苏', recoverNature: '复苏', effectMode: '触发' },
    designerMainHint: '防御类',
    designerSubHint: '复苏',
    designerSecondaryHint: '复苏',
    设计台参数定义: [
      num('reviveCount', '复苏次数', '1', '1'),
      num('reviveHealRatio', '复苏回血', '0.25'),
      num('duration', '持续回合', '3', '1'),
    ],
  });
  register('体力恢复', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'recover_vit',
    摘要提示: { skillType: '辅助', mainType: '回复类', recoverNature: '体力恢复' },
    designerMainHint: '回复类',
    designerSubHint: '体力恢复',
    设计台参数定义: [num('recoverRatio', '回复倍率', '0.35'), num('repeatCount', '生效次数', '1', '1')],
  });
  register('魂力恢复', {
    可主机制: true,
    可副机制: true,
    目标语义: '可赋予',
    运行时消费器: 'recover_sp',
    摘要提示: { skillType: '辅助', mainType: '回复类', recoverNature: '资源回复' },
    designerMainHint: '回复类',
    designerSubHint: '魂力恢复',
    designerSecondaryHint: '魂力恢复',
    设计台参数定义: [num('recoverRatio', '回复倍率', '0.35'), num('repeatCount', '生效次数', '1', '1')],
  });
  register('精神恢复', {
    可主机制: true,
    可副机制: true,
    目标语义: '可赋予',
    运行时消费器: 'recover_men',
    摘要提示: { skillType: '辅助', mainType: '回复类', recoverNature: '资源回复' },
    designerMainHint: '回复类',
    designerSubHint: '精神恢复',
    designerSecondaryHint: '精神恢复',
    设计台参数定义: [num('recoverRatio', '回复倍率', '0.35'), num('repeatCount', '生效次数', '1', '1')],
  });
  register('持续恢复', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'recover_over_time',
    摘要提示: { skillType: '辅助', mainType: '回复类', recoverNature: '持续恢复', effectMode: '持续' },
    designerMainHint: '回复类',
    designerSubHint: '持续恢复',
    设计台参数定义: [
      num('recoverRatio', '每回合倍率', '0.2'),
      num('duration', '持续回合', '3', '1'),
      num('stackLimit', '叠层上限', '2', '1'),
    ],
  });
  register(['净化/解控', '净化', '解控'], {
    可主机制: true,
    可副机制: true,
    目标语义: '可赋予',
    运行时消费器: 'cleanse',
    摘要提示: { skillType: '辅助', mainType: '回复类', recoverNature: '净化' },
    designerMainHint: '回复类',
    designerSubHint: '净化/解控',
    designerSecondaryHint: '解控',
    设计台参数定义: [
      num('cleanseCount', '清除条目数', '2', '1'),
      select('cleansePriority', '净化优先级', 'CLEANSE_PRIORITY'),
      select('extraGain', '附带收益', 'CLEANSE_GAIN'),
    ],
  });
  register('感知干扰', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'perception_disturb',
    摘要提示: { skillType: '控制', mainType: '感知/认知类', controlStrength: '软控' },
    designerMainHint: '感知/认知类',
    designerSubHint: '感知干扰',
    设计台参数定义: [num('disturbPower', '干扰强度', '0.12'), num('duration', '持续回合', '2', '1')],
  });
  register('标记锁定', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'judge_effect',
    摘要提示: { skillType: '控制', mainType: '感知/认知类', controlStrength: '软控' },
    designerMainHint: '感知/认知类',
    designerSubHint: '标记锁定',
    设计台参数定义: [
      num('markDuration', '标记时长', '2', '1'),
      num('targetCap', '锁定目标数', '1', '1'),
      select('trackingRule', '追踪规则', 'TRACKING_RULE'),
    ],
  });
  register('共享视野', {
    可主机制: true,
    可副机制: true,
    目标语义: '上下文',
    运行时消费器: 'shared_vision',
    摘要提示: { skillType: '辅助', mainType: '感知/认知类', cooperation: '高', effectMode: '持续' },
    designerMainHint: '感知/认知类',
    designerSubHint: '共享视野',
    designerSecondaryHint: '共享视野',
    设计台参数定义: [
      text('shareRange', '共享范围', '队伍 / 半径30米'),
      num('duration', '持续回合', '3', '1'),
      select('infoDepth', '共享深度', 'INFO_DEPTH'),
    ],
  });
  register('幻境', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'judge_effect',
    摘要提示: { skillType: '控制', mainType: '感知/认知类', controlStrength: '硬控' },
    designerMainHint: '感知/认知类',
    designerSubHint: '幻境',
    设计台参数定义: [
      text('illusionRange', '幻境范围', '半径8米'),
      num('duration', '持续回合', '2', '1'),
      num('illusionPower', '幻术强度', '1.1'),
    ],
  });
  register('催眠', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'judge_effect',
    摘要提示: { skillType: '控制', mainType: '感知/认知类', controlStrength: '硬控' },
    designerMainHint: '感知/认知类',
    designerSubHint: '催眠',
    设计台参数定义: [
      num('duration', '睡眠回合', '2', '1'),
      select('wakeRule', '唤醒条件', 'WAKE_RULE'),
      text('hitRule', '命中条件', '视线锁定 / 声波接触'),
    ],
  });
  register('认知扭曲', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'judge_effect',
    摘要提示: { skillType: '控制', mainType: '感知/认知类', controlStrength: '软控' },
    designerMainHint: '感知/认知类',
    designerSubHint: '认知扭曲',
    设计台参数定义: [num('twistPower', '扭曲强度', '0.18'), num('duration', '持续回合', '2', '1')],
  });
  register('目标锁定', {
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'target_lock',
    摘要提示: { skillType: '控制', mainType: '感知/认知类', controlStrength: '软控' },
    designerMainHint: '感知/认知类',
    designerSubHint: '标记锁定',
    designerSecondaryHint: '目标锁定',
    设计台参数定义: [
      num('duration', '持续回合', '2', '1'),
      num('hitBonus', '命中增益', '0.1'),
      num('lockLevel', '锁定层级', '1', '1'),
    ],
  });
  register('自身位移', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'self_shift',
    摘要提示: { skillType: '辅助', mainType: '位移类', effectMode: '持续' },
    designerMainHint: '位移类',
    designerSubHint: '自身位移',
    设计台参数定义: [text('moveDistance', '位移距离', '5米')],
  });
  register('强制位移', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'hostile_shift',
    摘要提示: { skillType: '控制', mainType: '位移类', controlStrength: '软控' },
    designerMainHint: '位移类',
    designerSubHint: '强制位移',
    设计台参数定义: [text('moveDistance', '位移距离', '4米'), num('repeatCount', '触发次数', '1', '1')],
  });
  register('位移交换', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'position_exchange',
    摘要提示: { skillType: '控制', mainType: '位移类', controlStrength: '软控' },
    designerMainHint: '位移类',
    designerSubHint: '位移交换',
    设计台参数定义: [
      text('exchangeRange', '交换范围', '8米'),
      num('duration', '持续回合', '2', '1'),
      text('triggerRule', '交换条件', '命中标记目标'),
    ],
  });
  register('追击位移', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'pursuit_shift',
    摘要提示: { skillType: '辅助', mainType: '位移类', effectMode: '持续' },
    designerMainHint: '位移类',
    designerSubHint: '追击位移',
    设计台参数定义: [
      text('moveDistance', '追击距离', '6米'),
      text('followWindow', '追击窗口', '命中后1秒'),
      num('extraRatio', '追加倍率', '0.3'),
    ],
  });
  register('脱离位移', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'disengage_shift',
    摘要提示: { skillType: '辅助', mainType: '位移类', effectMode: '持续' },
    designerMainHint: '位移类',
    designerSubHint: '脱离位移',
    设计台参数定义: [
      text('moveDistance', '脱离距离', '7米'),
      text('escapeRule', '脱离条件', '生命低于50%'),
      select('extraGain', '脱离收益', 'ESCAPE_GAIN'),
    ],
  });
  register(['追击'], {
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'pursuit_mark',
    摘要提示: { skillType: '辅助', mainType: '位移类', effectMode: '持续' },
    designerMainHint: '位移类',
    designerSubHint: '追击位移',
    designerSecondaryHint: '追击',
    设计台参数定义: [
      text('followWindow', '追击窗口', '命中后1秒'),
      num('bonusRatio', '追击倍率', '1.2'),
      num('duration', '持续回合', '2', '1'),
    ],
  });
  register('分身', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'clone',
    摘要提示: { skillType: '防御', mainType: '特殊规则类', defenseNature: '分身', effectMode: '持续' },
    designerMainHint: '特殊规则类',
    designerSubHint: '分身',
    设计台参数定义: [
      select('cloneType', '分身类型', 'CLONE_TYPE'),
      num('cloneCount', '分身数量', '2', '1'),
      num('stealthRatio', '隐蔽度', '0.45'),
      num('inheritRatio', '实力继承', '0.55'),
      num('duration', '持续回合', '2', '1'),
      text('cloneName', '分身称谓', '影分身 / 心像'),
    ],
  });
  register('复制', {
    可主机制: true,
    目标语义: '上下文',
    运行时消费器: 'copy_status',
    摘要提示: { skillType: '辅助', mainType: '特殊规则类' },
    designerMainHint: '特殊规则类',
    designerSubHint: '复制',
    设计台参数定义: [
      select('copyTarget', '复制对象', 'COPY_TARGET'),
      num('fidelity', '保真度', '0.8'),
      text('duration', '维持时长', '2回合'),
    ],
  });
  register('反制', {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'counter',
    摘要提示: { skillType: '防御', mainType: '特殊规则类', defenseNature: '反制', effectMode: '触发' },
    designerMainHint: '特殊规则类',
    designerSubHint: '反制',
    设计台参数定义: [
      select('counterTarget', '反制对象', 'COUNTER_TARGET'),
      text('triggerRule', '触发条件', '被锁定时 / 命中前'),
      num('duration', '持续回合', '2', '1'),
      num('counterRatio', '反制倍率', '1.0'),
    ],
  });
  register(['转化', '伤害转回复'], {
    可主机制: true,
    目标语义: '可赋予',
    运行时消费器: 'damage_to_heal',
    摘要提示: { skillType: '辅助', mainType: '特殊规则类' },
    designerMainHint: '特殊规则类',
    designerSubHint: '转化',
    设计台参数定义: [text('convertPath', '转化方向', '伤害→回复'), num('convertRatio', '转化比率', '0.6')],
  });
  register('回复转伤害', {
    可主机制: false,
    目标语义: '敌对',
    运行时消费器: 'heal_to_damage',
    摘要提示: { skillType: '控制', mainType: '特殊规则类' },
    designerMainHint: '特殊规则类',
    designerSubHint: '转化',
    设计台参数定义: [text('convertPath', '转化方向', '回复→伤害'), num('convertRatio', '转化比率', '0.6')],
  });
  register('状态交换', {
    可主机制: true,
    目标语义: '上下文',
    运行时消费器: 'status_exchange',
    摘要提示: { skillType: '辅助', mainType: '特殊规则类' },
    designerMainHint: '特殊规则类',
    designerSubHint: '状态交换',
    设计台参数定义: [
      select('exchangeTarget', '交换对象', 'EXCHANGE_TARGET'),
      num('exchangeCount', '交换层数', '1', '1'),
      text('triggerRule', '交换条件', '双方同时命中'),
    ],
  });
  register('状态转移', {
    可主机制: true,
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'status_transfer',
    摘要提示: { skillType: '控制', mainType: '特殊规则类' },
    designerMainHint: '特殊规则类',
    designerSubHint: '状态转移',
    designerSecondaryHint: '状态转移',
    设计台参数定义: [text('transferMode', '转移模式', '自身负面->目标'), text('triggerRule', '转移条件', '命中后')],
  });
  register('强制绑定/锁定', {
    可主机制: true,
    目标语义: '敌对',
    运行时消费器: 'hard_lock',
    摘要提示: { skillType: '控制', mainType: '特殊规则类', controlStrength: '软控' },
    designerMainHint: '特殊规则类',
    designerSubHint: '强制绑定/锁定',
    设计台参数定义: [
      num('bindDuration', '绑定回合', '2', '1'),
      num('targetCap', '绑定目标数', '1', '1'),
      text('releaseRule', '解除条件', '超距离 / 净化'),
    ],
  });
  register('条件触发', {
    可主机制: true,
    目标语义: '上下文',
    运行时消费器: 'judge_effect',
    摘要提示: { skillType: '辅助', mainType: '特殊规则类', effectMode: '触发' },
    designerMainHint: '特殊规则类',
    designerSubHint: '条件触发',
    设计台参数定义: [
      text('triggerRule', '触发条件', '受击 / 低血 / 计时结束'),
      num('triggerCount', '触发次数', '1', '1'),
      select('triggerResult', '触发结果', 'TRIGGER_RESULT'),
    ],
  });
  register('规则改写', {
    可主机制: true,
    目标语义: '仅自身',
    仅自身: true,
    运行时消费器: 'self_rule_rewrite',
    摘要提示: { skillType: '辅助', mainType: '特殊规则类', effectMode: '触发' },
    designerMainHint: '特殊规则类',
    designerSubHint: '规则改写',
    设计台参数定义: [select('rewriteDepth', '改写幅度', 'REWRITE_DEPTH')],
  });
  register('高波动随机值', {
    目标语义: '仅自身',
    仅自身: true,
    运行时消费器: 'self_random_variance',
    摘要提示: { skillType: '辅助', mainType: '特殊规则类' },
  });
  register('自身也受影响', {
    目标语义: '仅自身',
    仅自身: true,
    运行时消费器: 'self_mirror',
    摘要提示: { skillType: '辅助', mainType: '特殊规则类' },
  });
  register('随机目标', {
    目标语义: '仅自身',
    仅自身: true,
    运行时消费器: 'random_target_shift',
    摘要提示: { skillType: '控制', mainType: '特殊规则类' },
  });
  register('自残换收益', {
    目标语义: '仅自身',
    仅自身: true,
    运行时消费器: 'self_sacrifice_gain',
    摘要提示: { skillType: '辅助', mainType: '特殊规则类' },
  });
  register('炸环', {
    可主机制: true,
    可副机制: true,
    目标语义: '仅自身',
    仅自身: true,
    运行时消费器: 'ring_burst_gain',
    摘要提示: { skillType: '辅助', mainType: '特殊规则类' },
    designerMainHint: '特殊规则类',
    designerSubHint: '炸环',
    designerSecondaryHint: '炸环',
    设计台参数定义: [
      num('恢复时长tick', '恢复时长tick', '4320', '1'),
      num('年限增幅系数', '年限增幅系数', '0.18'),
      text('增幅字段', '增幅字段', '威力倍率,final_damage_mult,final_heal_mult,shield_gain_mult'),
    ],
  });
  register('引爆持续伤害', {
    可主机制: true,
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'dot_detonate',
    摘要提示: { skillType: '输出', mainType: '特殊规则类', effectMode: '瞬发' },
    designerMainHint: '特殊规则类',
    designerSubHint: '引爆持续伤害',
    designerSecondaryHint: '引爆持续伤害',
    设计台参数定义: [num('detonateRatio', '引爆倍率', '1.2'), text('consumeMode', '消耗规则', '消耗全部持续伤害')],
  });
  register('斩盾', {
    可主机制: true,
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'shield_break',
    摘要提示: { skillType: '输出', mainType: '特殊规则类' },
    designerMainHint: '特殊规则类',
    designerSubHint: '斩盾',
    designerSecondaryHint: '斩盾',
    设计台参数定义: [num('shieldBreakRatio', '斩盾倍率', '0.6')],
  });
  register('窃取护盾', {
    可主机制: true,
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'shield_steal',
    摘要提示: { skillType: '控制', mainType: '特殊规则类' },
    designerMainHint: '特殊规则类',
    designerSubHint: '窃取护盾',
    designerSecondaryHint: '窃取护盾',
    设计台参数定义: [num('shieldStealRatio', '窃盾比例', '0.45'), num('duration', '持续回合', '2', '1')],
  });
  register('吞噬', {
    可主机制: true,
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'resource_drain',
    摘要提示: { skillType: '控制', mainType: '特殊规则类', controlStrength: '软控' },
    designerMainHint: '特殊规则类',
    designerSubHint: '吞噬',
    designerSecondaryHint: '吞噬',
    设计台参数定义: [
      select('resourceType', '吞噬资源', 'RESOURCE_TRANSFER_TYPE'),
      num('drainRatio', '吞噬比例', '0.18'),
      num('convertRatio', '转化比例', '1.0'),
    ],
  });
  register('能力共享', {
    可主机制: true,
    可副机制: true,
    目标语义: '可赋予',
    群体赋予: true,
    运行时消费器: 'resource_refeed',
    摘要提示: { skillType: '辅助', mainType: '回复类', recoverNature: '资源回复', cooperation: '高' },
    designerMainHint: '特殊规则类',
    designerSubHint: '能力共享',
    designerSecondaryHint: '能力共享',
    设计台参数定义: [
      select('resourceType', '共享资源', 'RESOURCE_TRANSFER_TYPE'),
      num('refeedRatio', '共享比例', '0.2'),
    ],
  });
  register('机制抹消', {
    可主机制: true,
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'mechanism_suppress',
    摘要提示: { skillType: '控制', mainType: '特殊规则类', controlStrength: '软控', effectMode: '持续' },
    designerMainHint: '特殊规则类',
    designerSubHint: '机制抹消',
    designerSecondaryHint: '机制抹消',
    设计台参数定义: [
      select('suppressTarget', '抹消目标', 'MECHANISM_SUPPRESS_TARGET'),
      select('suppressMode', '抹消方式', 'MECHANISM_SUPPRESS_MODE'),
      num('duration', '持续回合', '2', '1'),
    ],
  });
  register('效果反转', {
    目标语义: '敌对',
    运行时消费器: 'effect_reverse',
    摘要提示: { skillType: '控制', mainType: '特殊规则类' },
  });
  register('驱散增益', {
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'dispel_buff',
    摘要提示: { skillType: '控制', mainType: '削弱类' },
    designerMainHint: '削弱类',
    designerSubHint: '单属性削弱',
    designerSecondaryHint: '驱散增益',
    设计台参数定义: [num('dispelCount', '驱散数量', '1', '1')],
  });
  register('窃取增益', {
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'steal_buff',
    摘要提示: { skillType: '控制', mainType: '特殊规则类' },
    designerMainHint: '特殊规则类',
    designerSubHint: '复制',
    designerSecondaryHint: '窃取增益',
    设计台参数定义: [num('stealCount', '窃取数量', '1', '1')],
  });
  register('隐身', {
    可副机制: true,
    目标语义: '可赋予',
    运行时消费器: 'stealth',
    摘要提示: { skillType: '辅助', mainType: '增益类', effectMode: '持续' },
    designerMainHint: '增益类',
    designerSubHint: '单属性增益',
    designerSecondaryHint: '隐身',
    设计台参数定义: [
      num('duration', '持续回合', '2', '1'),
      num('stealthRatio', '隐蔽度', '0.3'),
      num('dodgeBonus', '闪避增益', '0.1'),
      num('reactionBonus', '反应增益', '0.08'),
    ],
  });
  register('护卫', {
    可副机制: true,
    目标语义: '可赋予',
    群体赋予: true,
    运行时消费器: 'guard',
    摘要提示: { skillType: '防御', mainType: '防御类', cooperation: '高', effectMode: '持续' },
    designerMainHint: '防御类',
    designerSubHint: '伤害分摊',
    designerSecondaryHint: '护卫',
    设计台参数定义: [num('duration', '持续回合', '2', '1'), num('reduceRatio', '护卫减伤', '0.1')],
  });
  register('嘲讽', {
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'taunt',
    摘要提示: { skillType: '控制', mainType: '控制类', controlStrength: '软控' },
    designerMainHint: '控制类',
    designerSubHint: '软控',
    designerSecondaryHint: '嘲讽',
    设计台参数定义: [num('duration', '持续回合', '2', '1'), text('focusRule', '聚火规则', '强制优先自身')],
  });
  register('破隐', {
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'reveal',
    摘要提示: { skillType: '控制', mainType: '控制类' },
    designerMainHint: '控制类',
    designerSubHint: '节奏打断',
    designerSecondaryHint: '破隐',
    设计台参数定义: [num('hitBonus', '命中增益', '0.1'), num('lockLevel', '锁定层级', '1', '1')],
  });
  register(['减速', '迟缓'], {
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'slow',
    摘要提示: { skillType: '控制', mainType: '控制类', controlStrength: '软控' },
    designerMainHint: '控制类',
    designerSubHint: '软控',
    designerSecondaryHint: '减速',
    设计台参数定义: [num('slowRatio', '减速幅度', '0.3'), num('duration', '持续回合', '2', '1')],
  });
  register('致盲', {
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'blind',
    摘要提示: { skillType: '控制', mainType: '控制类', controlStrength: '软控' },
    designerMainHint: '控制类',
    designerSubHint: '软控',
    designerSecondaryHint: '致盲',
    设计台参数定义: [num('duration', '致盲回合', '2', '1'), select('blindEffect', '影响内容', 'BLIND_EFFECT')],
  });
  register('沉默', {
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'silence',
    摘要提示: { skillType: '控制', mainType: '控制类', controlStrength: '软控' },
    designerMainHint: '控制类',
    designerSubHint: '软控',
    designerSecondaryHint: '沉默',
    设计台参数定义: [num('duration', '沉默回合', '2', '1'), select('muteScope', '限制范围', 'MUTE_SCOPE')],
  });
  register('缴械', {
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'disarm',
    摘要提示: { skillType: '控制', mainType: '控制类', controlStrength: '软控' },
    designerMainHint: '控制类',
    designerSubHint: '软控',
    designerSecondaryHint: '缴械',
    设计台参数定义: [num('duration', '缴械回合', '2', '1'), text('disarmScope', '限制范围', '近战 / 武器技')],
  });
  register('标记弱点', {
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'expose_weakness',
    摘要提示: { skillType: '控制', mainType: '削弱类' },
    designerMainHint: '削弱类',
    designerSubHint: '单属性削弱',
    designerSecondaryHint: '标记弱点',
    设计台参数定义: [select('weakPointType', '弱点类型', 'WEAK_POINT_TYPE'), num('duration', '持续回合', '2', '1')],
  });
  register('斩杀补伤', {
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'judge_effect',
    摘要提示: { skillType: '输出', mainType: '伤害类' },
    designerMainHint: '伤害类',
    designerSubHint: '单体伤害',
    designerSecondaryHint: '斩杀补伤',
    设计台参数定义: [text('executeLine', '触发血线', '低于25%'), num('bonusRatio', '补伤倍率', '0.5')],
  });
  register('穿透', {
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'armor_penetration',
    摘要提示: { skillType: '输出', mainType: '伤害类' },
    designerMainHint: '伤害类',
    designerSubHint: '单体伤害',
    designerSecondaryHint: '穿透',
    设计台参数定义: [
      num('penetrationRatio', '穿透比例', '0.25'),
      select('penetrationTarget', '穿透对象', 'PENETRATION_TARGET'),
    ],
  });
  register('吸血', {
    可副机制: true,
    目标语义: '上下文',
    运行时消费器: 'lifesteal',
    摘要提示: { skillType: '输出', mainType: '伤害类' },
    designerMainHint: '伤害类',
    designerSubHint: '单体伤害',
    designerSecondaryHint: '吸血',
    设计台参数定义: [
      num('lifestealRatio', '吸取比例', '0.2'),
      select('resourceType', '吸取资源', 'LIFESTEAL_RESOURCE'),
    ],
  });
  register('流血DOT', {
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'dot_damage',
    摘要提示: { skillType: '输出', mainType: '伤害类', effectMode: '持续' },
    designerMainHint: '伤害类',
    designerSubHint: '持续伤害',
    designerSecondaryHint: '流血DOT',
    设计台参数定义: [num('dotRatio', '每跳倍率', '0.2'), num('duration', '持续回合', '3', '1')],
  });
  register('伤害链', {
    可主机制: true,
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'dot_detonate',
    摘要提示: { skillType: '输出', mainType: '特殊规则类', effectMode: '触发' },
    designerMainHint: '特殊规则类',
    designerSubHint: '伤害链',
    designerSecondaryHint: '伤害链',
    设计台参数定义: [
      num('chainRatio', '链式比例', '0.45'),
      num('chainTargets', '链式目标数', '2', '1'),
      num('duration', '持续回合', '2', '1'),
    ],
  });
  register('生命链接', {
    可主机制: true,
    可副机制: true,
    目标语义: '上下文',
    运行时消费器: 'damage_share',
    摘要提示: { skillType: '防御', mainType: '特殊规则类', defenseNature: '分摊', cooperation: '高', effectMode: '持续' },
    designerMainHint: '特殊规则类',
    designerSubHint: '生命链接',
    designerSecondaryHint: '生命链接',
    设计台参数定义: [
      num('shareRatio', '分摊比例', '0.35'),
      num('duration', '持续回合', '3', '1'),
      text('linkRule', '链接规则', '双方同步承受比例伤害'),
    ],
  });
  register('延长持续伤害', {
    可主机制: true,
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'dot_damage',
    摘要提示: { skillType: '控制', mainType: '特殊规则类', effectMode: '持续' },
    designerMainHint: '特殊规则类',
    designerSubHint: '延长持续伤害',
    designerSecondaryHint: '延长持续伤害',
    设计台参数定义: [
      num('extendRounds', '延长回合', '1', '1'),
      num('stackDelta', '层数变化', '0', '1'),
      text('scope', '作用范围', '目标全部DOT'),
    ],
  });
  register('压缩持续伤害', {
    可主机制: true,
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'dot_detonate',
    摘要提示: { skillType: '输出', mainType: '特殊规则类', effectMode: '瞬发' },
    designerMainHint: '特殊规则类',
    designerSubHint: '压缩持续伤害',
    designerSecondaryHint: '压缩持续伤害',
    设计台参数定义: [
      num('compressRatio', '压缩倍率', '1.35'),
      num('consumeRounds', '压缩回合', '1', '1'),
      text('convertRule', '转化规则', '将后续DOT折算为本回合伤害'),
    ],
  });
  register('拆层转存', {
    可主机制: true,
    可副机制: true,
    目标语义: '上下文',
    运行时消费器: 'copy_status',
    摘要提示: { skillType: '辅助', mainType: '特殊规则类', effectMode: '触发' },
    designerMainHint: '特殊规则类',
    designerSubHint: '拆层转存',
    designerSecondaryHint: '拆层转存',
    设计台参数定义: [
      num('splitLayers', '拆层数量', '1', '1'),
      text('storeTarget', '转存目标', '自身/友方'),
      num('duration', '持续回合', '2', '1'),
    ],
  });
  register('资源燃烧', {
    可主机制: true,
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'resource_drain',
    摘要提示: { skillType: '控制', mainType: '特殊规则类', controlStrength: '软控', effectMode: '持续' },
    designerMainHint: '特殊规则类',
    designerSubHint: '资源燃烧',
    designerSecondaryHint: '资源燃烧',
    设计台参数定义: [
      select('resourceType', '燃烧资源', 'RESOURCE_TRANSFER_TYPE'),
      num('burnRatio', '每回合燃烧', '0.12'),
      num('duration', '持续回合', '2', '1'),
    ],
  });
  register('资源锁定', {
    可主机制: true,
    可副机制: true,
    目标语义: '敌对',
    运行时消费器: 'cost_increase',
    摘要提示: { skillType: '控制', mainType: '特殊规则类', controlStrength: '软控', effectMode: '持续' },
    designerMainHint: '特殊规则类',
    designerSubHint: '资源锁定',
    designerSecondaryHint: '资源锁定',
    设计台参数定义: [
      num('lockRatio', '锁定比例', '0.5'),
      num('duration', '持续回合', '2', '1'),
      text('lockRule', '限制规则', '资源回复与转化受阻'),
    ],
  });
  register(['反击', '受击反击'], {
    可副机制: true,
    目标语义: '可赋予',
    运行时消费器: 'on_hit_counter',
    摘要提示: { skillType: '防御', mainType: '防御类', defenseNature: '反制', effectMode: '触发' },
    designerMainHint: '防御类',
    designerSubHint: '伤害反射',
    designerSecondaryHint: '反击',
    设计台参数定义: [select('counterRule', '反击条件', 'COUNTER_RULE'), num('counterRatio', '反击倍率', '0.8')],
  });
  register('造物生成', {
    目标语义: '仅自身',
    仅自身: true,
    运行时消费器: 'construct_create',
    摘要提示: { skillType: '辅助', mainType: '特殊规则类' },
  });
  register('召唤与场地', {
    可主机制: true,
    可副机制: true,
    目标语义: '上下文',
    运行时消费器: 'construct_create',
    摘要提示: { skillType: '辅助', mainType: '特殊规则类', cooperation: '高', effectMode: '持续' },
    designerMainHint: '特殊规则类',
    designerSubHint: '召唤与场地',
    designerSecondaryHint: '召唤与场地',
    设计台参数定义: [
      text('entityName', '实体名称', '嗜血领域'),
      num('duration', '持续回合', '3', '1'),
      num('inheritRatio', '继承比例', '0.35'),
      text('coreMechanism', '核心描述', '友军增益光环 / 敌方压制场'),
    ],
  });

  return Object.freeze(map);
})();

function buildSkillMechanismTargetSemanticsV1(metaMap = {}) {
  const 可赋予 = [];
  const 群体赋予 = [];
  const 敌对 = [];
  const 上下文 = [];
  const 仅自身 = [];
  Object.entries(metaMap || {}).forEach(([label, meta]) => {
    if (!meta || typeof meta !== 'object') return;
    if (meta.仅自身 === true || meta.目标语义 === '仅自身') 仅自身.push(label);
    if (meta.群体赋予 === true) 群体赋予.push(label);
    if (meta.目标语义 === '可赋予') 可赋予.push(label);
    else if (meta.目标语义 === '敌对') 敌对.push(label);
    else if (meta.目标语义 === '上下文') 上下文.push(label);
  });
  return Object.freeze({
    可赋予: Object.freeze(Array.from(new Set(可赋予)).sort()),
    群体赋予: Object.freeze(Array.from(new Set(群体赋予)).sort()),
    敌对: Object.freeze(Array.from(new Set(敌对)).sort()),
    上下文: Object.freeze(Array.from(new Set(上下文)).sort()),
    仅自身: Object.freeze(Array.from(new Set(仅自身)).sort()),
  });
}

const SKILL_MECHANISM_TARGET_SEMANTICS_V1 = buildSkillMechanismTargetSemanticsV1(SKILL_MECHANISM_META_V1);
const SKILL_MECHANISM_SELF_ONLY_V1 = SKILL_MECHANISM_TARGET_SEMANTICS_V1.仅自身;

const SKILL_MECHANISM_REGISTRY_V1 = Object.freeze({
  mainArchetypes: Object.freeze(SKILL_ARCHETYPE_POOL_V1),
  secondaryByMain: Object.freeze(SKILL_SECONDARY_BY_MAIN_V1),
  secondaryTypeBias: Object.freeze(SKILL_SECONDARY_TYPE_BIAS_V1),
  机制定义: Object.freeze(SKILL_MECHANISM_META_V1),
  仅自身: SKILL_MECHANISM_SELF_ONLY_V1,
  目标语义表: SKILL_MECHANISM_TARGET_SEMANTICS_V1,
});

if (typeof globalThis !== 'undefined') {
  globalThis.__LWCS_SKILL_MECHANISM_REGISTRY__ = SKILL_MECHANISM_REGISTRY_V1;
  try {
    if (typeof window !== 'undefined' && window.parent && window.parent !== window && !window.parent.__LWCS_SKILL_MECHANISM_REGISTRY__) {
      window.parent.__LWCS_SKILL_MECHANISM_REGISTRY__ = SKILL_MECHANISM_REGISTRY_V1;
    }
  } catch (error) {}
  try {
    if (typeof window !== 'undefined' && window.top && window.top !== window && !window.top.__LWCS_SKILL_MECHANISM_REGISTRY__) {
      window.top.__LWCS_SKILL_MECHANISM_REGISTRY__ = SKILL_MECHANISM_REGISTRY_V1;
    }
  } catch (error) {}
}

const SOUL_SPIRIT_SECONDARY_OPTIONS_V1 = Array.from(
  new Set(Object.values(SKILL_SECONDARY_BY_MAIN_V1).flat().filter(label => !!SKILL_MECHANISM_META_V1[String(label || '').trim()])),
).sort();

function normalizeSkillGradeSymbol(value = 'B') {
  const text = String(value || '').trim().toUpperCase();
  if (['S+', 'S', 'A', 'B', 'C', 'D', 'F'].includes(text)) return text;
  return 'B';
}

function normalizeSkillTableGrade(value = 'B') {
  const grade = normalizeSkillGradeSymbol(value);
  if (grade === 'S+') return 'S';
  if (grade === 'D' || grade === 'F') return 'C';
  return ['S', 'A', 'B', 'C'].includes(grade) ? grade : 'B';
}

function getSecondaryGenerationChance(grade = 'B', ringIndex = 1) {
  const normalizedGrade = normalizeSkillGradeSymbol(grade);
  const table = {
    F: 8,
    D: 14,
    C: 40,
    B: 46,
    A: 16,
    S: 3,
    'S+': 1,
  };
  return Number(table[normalizedGrade] ?? table.B);
}

function getSecondaryDoubleChance(grade = 'B', ringIndex = 1) {
  const normalizedGrade = normalizeSkillGradeSymbol(grade);
  const table = {
    F: 0,
    D: 0,
    C: 2,
    B: 4,
    A: 1,
    S: 0,
    'S+': 0,
  };
  return Number(table[normalizedGrade] ?? 0);
}

function getSecondaryMutationChance(grade = 'B', ringIndex = 1) {
  const normalizedGrade = normalizeSkillGradeSymbol(grade);
  const table = {
    F: 0,
    D: 0,
    C: 1,
    B: 2,
    A: 1,
    S: 0,
    'S+': 0,
  };
  return Number(table[normalizedGrade] ?? 0);
}

function getSecondaryRingScale(ringIndex = 1) {
  const ring = Math.max(1, Number(ringIndex || 1));
  if (ring < 3) return 0;
  if (ring === 3) return 0.35;
  if (ring === 4) return 0.5;
  if (ring === 5) return 0.7;
  if (ring === 6) return 0.85;
  if (ring === 7) return 1.0;
  if (ring === 8) return 1.15;
  return 1.3;
}

const 魂技年限档位阈值_V1 = Object.freeze([100, 1000, 10000, 100000, 1000000]);
const 魂技年限次数进阶阈值_V1 = Object.freeze([1000, 10000, 100000, 1000000]);
const 魂技年限次数字段集合_V1 = new Set([
  '命中次数',
  '触发次数',
  '每日触发上限',
  '抵消次数',
  '复苏次数',
  '分摊人数',
  '驱散数量',
  '窃取数量',
  '转移数量',
  '复制数量',
  '清除层级',
  'death_save_count',
  'revive_count',
  'substitute_count',
  'damage_share_count',
  'daily_trigger_limit',
]);

function 限幅数值_V1(值, 下限 = -Infinity, 上限 = Infinity) {
  const 数值 = Number(值);
  if (!Number.isFinite(数值)) return Math.max(下限, Math.min(上限, 0));
  return Math.max(下限, Math.min(上限, 数值));
}

function 四舍五入技能数值_V1(值, 位数 = 2) {
  const 数值 = Number(值);
  if (!Number.isFinite(数值)) return 0;
  return Number(数值.toFixed(位数));
}

function 获取魂技位伤害倍率_V1(魂环位 = 1) {
  const 魂技位 = Math.max(1, Math.floor(Number(魂环位 || 1)));
  const 倍率表 = Object.freeze({
    1: 1,
    2: 1.55,
    3: 2.35,
    4: 3.55,
    5: 5.35,
    6: 8,
    7: 1,
    8: 14.5,
    9: 25,
  });
  if (倍率表[魂技位]) return 倍率表[魂技位];
  return 四舍五入技能数值_V1(25 * Math.pow(1.22, 魂技位 - 9), 2);
}

function 获取魂技位防御倍率_V1(魂环位 = 1) {
  const 魂技位 = Math.max(1, Math.floor(Number(魂环位 || 1)));
  const 倍率表 = Object.freeze({
    1: 1,
    2: 1.25,
    3: 1.6,
    4: 2.05,
    5: 2.65,
    6: 3.4,
    7: 1,
    8: 4.4,
    9: 5.6,
  });
  if (倍率表[魂技位]) return 倍率表[魂技位];
  return 四舍五入技能数值_V1(5.6 * Math.pow(1.15, 魂技位 - 9), 2);
}

function 获取年限档位信息_V1(年限 = 0) {
  const 安全年限 = Math.max(0, Math.floor(Number(年限 || 0)));
  let 档位起点 = 0;
  let 档位终点 = 100;
  for (let 序号 = 0; 序号 < 魂技年限档位阈值_V1.length; 序号 += 1) {
    const 当前阈值 = 魂技年限档位阈值_V1[序号];
    if (安全年限 >= 当前阈值) {
      档位起点 = 当前阈值;
      档位终点 = 魂技年限档位阈值_V1[序号 + 1] || 当前阈值 * 10;
    }
  }
  const 档内跨度 = Math.max(1, 档位终点 - 档位起点);
  const 档内进度 = 档位起点 > 0 ? 限幅数值_V1((安全年限 - 档位起点) / 档内跨度, 0, 1) : 0;
  return { 年限: 安全年限, 档位起点, 档位终点, 档内进度 };
}

function 计算年限档内消耗系数_V1(年限 = 0) {
  const 档位 = 获取年限档位信息_V1(年限);
  if (档位.档位起点 <= 0) return 1;
  return 四舍五入技能数值_V1(1 - 0.5 * 档位.档内进度, 4);
}

function 计算年限跨档次数增量_V1(旧年限 = 0, 新年限 = 0) {
  const 旧值 = Math.max(0, Math.floor(Number(旧年限 || 0)));
  const 新值 = Math.max(0, Math.floor(Number(新年限 || 0)));
  if (!(新值 > 旧值)) return 0;
  return 魂技年限次数进阶阈值_V1.filter(阈值 => 旧值 < 阈值 && 新值 >= 阈值).length;
}

function 缩放消耗文本数值_V1(消耗文本 = '', 倍率 = 1) {
  const 系数 = Number(倍率);
  if (!Number.isFinite(系数) || Math.abs(系数 - 1) <= 0.0001) return 消耗文本;
  return String(消耗文本 || '无').replace(/(魂力|体力|精神力)([:：])(\d+)(%?)/g, (原文, 名称, 分隔, 数字, 百分号) => {
    if (百分号) return 原文;
    const 新值 = Math.max(0, Math.round(Number(数字 || 0) * 系数));
    return `${名称}${分隔}${新值}`;
  });
}

function 缩放消耗结构数值_V1(消耗值, 倍率 = 1) {
  if (typeof 消耗值 === 'string') return 缩放消耗文本数值_V1(消耗值, 倍率);
  if (Array.isArray(消耗值)) return 消耗值.map(条目 => 缩放消耗结构数值_V1(条目, 倍率));
  if (消耗值 && typeof 消耗值 === 'object') {
    Object.keys(消耗值).forEach(键名 => {
      const 原值 = 消耗值[键名];
      if (['魂力', '体力', '精神力', 'sp', 'vit', 'men'].includes(String(键名))) {
        const 数值 = Number(原值);
        if (Number.isFinite(数值)) 消耗值[键名] = Math.max(0, Math.round(数值 * 倍率));
        return;
      }
      消耗值[键名] = 缩放消耗结构数值_V1(原值, 倍率);
    });
  }
  return 消耗值;
}

function 遍历技能效果数值容器_V1(效果 = {}, 回调 = () => {}) {
  if (!效果 || typeof 效果 !== 'object') return;
  const 已访问 = new Set();
  const 访问 = 容器 => {
    if (!容器 || typeof 容器 !== 'object' || 已访问.has(容器)) return;
    已访问.add(容器);
    回调(容器);
  };
  访问(效果);
  访问(效果.参数);
  访问(效果.计算层效果);
  访问(效果.成功参数);
  访问(效果.失败参数);
  访问(效果.面板修改比例);
}

function 缩放容器数值字段_V1(容器 = {}, 字段 = '', 倍率 = 1, 选项 = {}) {
  if (!容器 || typeof 容器 !== 'object' || !(字段 in 容器)) return;
  const 原值 = Number(容器[字段]);
  if (!Number.isFinite(原值) || 原值 <= 0) return;
  const 下限 = Number.isFinite(Number(选项.下限)) ? Number(选项.下限) : 0;
  const 上限 = Number.isFinite(Number(选项.上限)) ? Number(选项.上限) : Infinity;
  const 位数 = Number.isFinite(Number(选项.位数)) ? Number(选项.位数) : 2;
  容器[字段] = 四舍五入技能数值_V1(限幅数值_V1(原值 * 倍率, 下限, 上限), 位数);
}

function 缩放倍率型字段_V1(容器 = {}, 字段 = '', 倍率 = 1, 上限 = 8) {
  if (!容器 || typeof 容器 !== 'object' || !(字段 in 容器)) return;
  const 原值 = Number(容器[字段]);
  if (!Number.isFinite(原值) || Math.abs(原值 - 1) <= 0.001) return;
  const 增幅倍率 = Math.sqrt(Math.max(0.01, Number(倍率 || 1)));
  容器[字段] = 四舍五入技能数值_V1(限幅数值_V1(1 + (原值 - 1) * 增幅倍率, 0, 上限), 2);
}

function 放大比例型字段_V1(容器 = {}, 字段 = '', 倍率 = 1, 上限 = 0.85) {
  if (!容器 || typeof 容器 !== 'object' || !(字段 in 容器)) return;
  const 原值 = Number(容器[字段]);
  if (!Number.isFinite(原值) || 原值 <= 0) return;
  const 基础比例 = 限幅数值_V1(原值, 0, 上限);
  const 指数 = Math.sqrt(Math.max(0.01, Number(倍率 || 1)));
  容器[字段] = 四舍五入技能数值_V1(限幅数值_V1(1 - Math.pow(1 - 基础比例, 指数), 0, 上限), 4);
}

function 技能效果是伤害结算相关_V1(效果 = {}) {
  const 机制 = String(效果?.机制 || '').trim();
  if (/伤害|DOT|斩杀|引爆|斩盾|追击|破甲|输出/.test(机制)) return true;
  let 命中 = false;
  遍历技能效果数值容器_V1(效果, 容器 => {
    if (
      容器.威力倍率 !== undefined ||
      容器.dot_damage !== undefined ||
      容器.每回合伤害 !== undefined ||
      容器.持续伤害 !== undefined ||
      容器.引爆倍率 !== undefined ||
      容器.斩盾倍率 !== undefined
    )
      命中 = true;
    if (String(容器.属性 || '').trim() === '威力') 命中 = true;
  });
  return 命中;
}

function 技能效果是防御结算相关_V1(效果 = {}) {
  const 机制 = String(效果?.机制 || '').trim();
  if (/护盾|防御|减伤|格挡|霸体|免死|无敌|反射|分摊|替身|复苏|护卫/.test(机制)) return true;
  let 命中 = false;
  遍历技能效果数值容器_V1(效果, 容器 => {
    if (
      容器.护盾值 !== undefined ||
      容器.damage_reduction !== undefined ||
      容器.减伤比例 !== undefined ||
      容器.damage_reflect_ratio !== undefined ||
      容器.反射比例 !== undefined ||
      容器.damage_share_ratio !== undefined ||
      容器.分摊比例 !== undefined
    )
      命中 = true;
    if (String(容器.属性 || '').trim() === 'def') 命中 = true;
  });
  return 命中;
}

function 应用伤害类魂技位倍率_V1(效果 = {}, 倍率 = 1) {
  遍历技能效果数值容器_V1(效果, 容器 => {
    ['威力倍率', 'dot_damage', '每回合伤害', '持续伤害', 'final_damage_bonus'].forEach(字段 =>
      缩放容器数值字段_V1(容器, 字段, 倍率, { 下限: 0, 位数: 2 }),
    );
    ['引爆倍率', '斩盾倍率'].forEach(字段 => 缩放容器数值字段_V1(容器, 字段, Math.sqrt(倍率), { 下限: 0, 位数: 2 }));
    缩放倍率型字段_V1(容器, 'final_damage_mult', 倍率, 12);
    if (String(容器.属性 || '').trim() === '威力' && Number(容器.数值 || 0) > 1) 缩放倍率型字段_V1(容器, '数值', 倍率, 12);
  });
}

function 应用防御类魂技位倍率_V1(效果 = {}, 倍率 = 1) {
  遍历技能效果数值容器_V1(效果, 容器 => {
    ['护盾值', 'shield_gain_bonus', 'final_heal_bonus'].forEach(字段 =>
      缩放容器数值字段_V1(容器, 字段, 倍率, { 下限: 0, 位数: 2 }),
    );
    ['damage_reduction', '减伤比例'].forEach(字段 => 放大比例型字段_V1(容器, 字段, 倍率, 0.82));
    ['damage_reflect_ratio', '反射比例'].forEach(字段 => 放大比例型字段_V1(容器, 字段, 倍率, 0.9));
    ['damage_share_ratio', '分摊比例'].forEach(字段 => 放大比例型字段_V1(容器, 字段, 倍率, 0.88));
    ['revive_heal_ratio', '复苏回血比例'].forEach(字段 => 放大比例型字段_V1(容器, 字段, 倍率, 0.75));
    缩放倍率型字段_V1(容器, 'shield_gain_mult', 倍率, 10);
    缩放倍率型字段_V1(容器, 'final_heal_mult', Math.sqrt(倍率), 8);
    if (String(容器.属性 || '').trim() === 'def' && Number(容器.数值 || 0) > 1) 缩放倍率型字段_V1(容器, '数值', 倍率, 10);
  });
}

function 是否七九武魂名称_V1(武魂名称 = '') {
  return /[七九]/.test(String(武魂名称 || '').trim());
}

function 是否辅助系名称_V1(系别 = '') {
  return String(系别 || '').trim() === '辅助系';
}

function 读取七九辅助单体目标模型_V1(值 = '') {
  const 文本 = String(值 || '').trim();
  if (!文本) return '';
  const 目标模型 = normalizeSkillTargetModel(文本, '');
  if (['自身', '友方单体', '友方群体', '全场'].includes(目标模型)) return '友方单体';
  if (/自身|友方单体|友方群体|己方\/单体|己方\/群体|己方单体|己方群体|全员|全体|全场/.test(文本)) return '友方单体';
  return '';
}

function 写入七九辅助单体目标_V1(容器 = {}) {
  if (!容器 || typeof 容器 !== 'object' || Array.isArray(容器)) return;
  ['目标模型', '目标'].forEach(字段 => {
    if (!(字段 in 容器)) return;
    const 单体目标 = 读取七九辅助单体目标模型_V1(容器[字段]);
    if (单体目标) 容器[字段] = 单体目标;
  });
  if ('对象' in 容器) {
    const 单体目标 = 读取七九辅助单体目标模型_V1(容器.对象);
    if (单体目标) 容器.对象 = mapSkillTargetModelToCombatTarget(单体目标);
  }
  if (String(容器.机制 || '').trim() === '系统基础') {
    容器.目标模型 = '友方单体';
    容器.对象 = mapSkillTargetModelToCombatTarget('友方单体');
    容器.结算策略 = getSkillTargetResolutionStrategy('友方单体');
  }
}

function 应用七九辅助魂技基础效果_V1(效果数组 = [], 上下文 = {}) {
  const 当前魂环数量 = Math.max(1, Math.floor(Number(上下文.当前魂环数量 || 1)));
  const 基础倍率 = 四舍五入技能数值_V1(1 + 当前魂环数量 * 0.1, 2);
  const 基础比例 = 四舍五入技能数值_V1(当前魂环数量 * 0.1, 2);
  效果数组.forEach(效果 => {
    写入七九辅助单体目标_V1(效果);
    遍历技能效果数值容器_V1(效果, 容器 => {
      写入七九辅助单体目标_V1(容器);
      const 属性 = String(容器.属性 || '').trim();
      const 动作 = String(容器.动作 || '').trim();
      if (['str', 'def', 'agi', 'men_max', 'sp_max', 'vit_max', '威力', '控制', '掌控', '速度'].includes(属性) && /倍率提升|提升/.test(动作)) {
        容器.数值 = 基础倍率;
      }
      if (容器.面板修改比例 && typeof 容器.面板修改比例 === 'object') {
        Object.keys(容器.面板修改比例).forEach(键名 => {
          if (Number(容器.面板修改比例[键名] || 0) > 1) 容器.面板修改比例[键名] = 基础倍率;
        });
      }
      ['final_heal_mult', 'shield_gain_mult', 'control_resist_mult', 'mastery_ratio', 'speed_ratio'].forEach(字段 => {
        if (Number(容器[字段] || 0) > 1) 容器[字段] = Math.max(Number(容器[字段] || 1), 基础倍率);
      });
      ['sp_gain_ratio', 'men_gain_ratio', 'hot_heal_ratio'].forEach(字段 => {
        if (Number(容器[字段] || 0) > 0) 容器[字段] = Math.max(Number(容器[字段] || 0), 基础比例);
      });
    });
  });
}

function 应用生成魂技固化数值规则_V1(效果数组 = [], 上下文 = {}) {
  if (!Array.isArray(效果数组) || !效果数组.length) return 效果数组;
  const 来源类别 = String(上下文.来源类别 || 上下文.sourceCategory || '').trim() || '魂技';
  if (来源类别 !== '魂技') return 效果数组;
  const 魂环位 = Math.max(1, Math.floor(Number(上下文.魂环位 || 上下文.ringIndex || 1)));
  if (魂环位 === 7) return 效果数组;
  const 系别 = String(上下文.系别 || 上下文.type || '').trim();
  const 武魂名称 = String(上下文.武魂名称 || 上下文.martialSoulName || '').trim();
  if (是否辅助系名称_V1(系别) && 是否七九武魂名称_V1(武魂名称)) {
    应用七九辅助魂技基础效果_V1(效果数组, 上下文);
    return 效果数组;
  }
  const 伤害倍率 = 获取魂技位伤害倍率_V1(魂环位);
  const 防御倍率 = 获取魂技位防御倍率_V1(魂环位);
  效果数组.forEach(效果 => {
    if (技能效果是伤害结算相关_V1(效果)) 应用伤害类魂技位倍率_V1(效果, 伤害倍率);
    if (技能效果是防御结算相关_V1(效果)) 应用防御类魂技位倍率_V1(效果, 防御倍率);
  });
  if (!是否辅助系名称_V1(系别) && 是否七九武魂名称_V1(武魂名称)) {
    效果数组.forEach(效果 => {
      if (技能效果是伤害结算相关_V1(效果)) 应用伤害类魂技位倍率_V1(效果, 1.4);
    });
  }
  return 效果数组;
}

function 应用年限变化到技能效果数组_V1(skill = {}, 旧年限 = 0, 新年限 = 0) {
  if (!skill || typeof skill !== 'object' || !Array.isArray(skill._效果数组)) return false;
  const 旧值 = Math.max(0, Math.floor(Number(旧年限 || 0)));
  const 新值 = Math.max(0, Math.floor(Number(新年限 || 0)));
  if (!(新值 > 旧值)) return false;
  const 旧消耗系数 = 计算年限档内消耗系数_V1(旧值);
  const 新消耗系数 = 计算年限档内消耗系数_V1(新值);
  const 消耗倍率 = 旧消耗系数 > 0 ? 新消耗系数 / 旧消耗系数 : 1;
  if (Math.abs(消耗倍率 - 1) > 0.0001) {
    if (skill.消耗 !== undefined) skill.消耗 = 缩放消耗结构数值_V1(skill.消耗, 消耗倍率);
    const 系统基础 = skill._效果数组.find(效果 => String(效果?.机制 || '').trim() === '系统基础');
    if (系统基础 && 系统基础.消耗 !== undefined) 系统基础.消耗 = 缩放消耗结构数值_V1(系统基础.消耗, 消耗倍率);
  }
  const 次数增量 = 计算年限跨档次数增量_V1(旧值, 新值);
  if (次数增量 > 0) {
    skill._效果数组.forEach(效果 => {
      遍历技能效果数值容器_V1(效果, 容器 => {
        魂技年限次数字段集合_V1.forEach(字段 => {
          if (!(字段 in 容器)) return;
          const 原值 = Number(容器[字段]);
          if (!Number.isFinite(原值) || 原值 <= 0) return;
          容器[字段] = Math.max(1, Math.round(原值 + 次数增量));
        });
      });
    });
  }
  return Math.abs(消耗倍率 - 1) > 0.0001 || 次数增量 > 0;
}

function getPotentialSecondaryOptionsByType(type = '强攻系') {
  const mainTable = SKILL_MAIN_MECHANIC_DISTRIBUTION_V1[type] || SKILL_MAIN_MECHANIC_DISTRIBUTION_V1['强攻系'] || [];
  const mains = Array.from(new Set(mainTable.map(item => item?.main).filter(Boolean)));
  const typeBias = SKILL_SECONDARY_TYPE_BIAS_V1[type] || [];
  return Array.from(new Set([...typeBias, ...mains.flatMap(main => SKILL_SECONDARY_BY_MAIN_V1[main] || [])]));
}

function pickUniqueRandom(list = [], count = 1) {
  const pool = Array.isArray(list) ? [...list] : [];
  const result = [];
  while (pool.length > 0 && result.length < count) {
    const index = Math.floor(Math.random() * pool.length);
    result.push(pool[index]);
    pool.splice(index, 1);
  }
  return result;
}

function buildFuelModelByType(type, main) {
  if (type === '精神系') return '精神主导';
  if (type === '食物系') return '纯耗魂力';
  if (type === '控制系') return main === '控制类' || main === '削弱类' ? '附加微量精神力' : '纯耗魂力';
  if (type === '治疗系') return '附加微量精神力';
  if (type === '辅助系') return '魂神平摊';
  if (type === '元素系') return '魂神平摊';
  if (type === '防御系') return main === '防御类' ? '附加常规体力' : '纯耗魂力';
  if (type === '敏攻系') return main === '位移类' ? '附加常规体力' : '纯耗魂力';
  return '纯耗魂力';
}

function rollWeightedBucket(table = [], roll = 1) {
  const normalizedRoll = Math.max(1, Math.min(100, Number(roll) || 1));
  let cursor = 0;
  for (const item of table) {
    cursor += Number(item.weight || 0);
    if (normalizedRoll <= cursor) return item.value;
  }
  return table[table.length - 1]?.value || null;
}

function judgeSkillGrade(talentTier, ringAge, ringIndex, compatibility = 100, sourceQuality = '') {
  const roll = Math.floor(Math.random() * 100) + 1;
  const talentScore = { 绝世妖孽: 100, 顶级天才: 80, 天才: 60, 优秀: 40, 正常: 20, 劣等: 0, 天赋极差: -100 }[talentTier] || 20;
  const normalizedQuality = normalizeSoulSpiritQuality(sourceQuality);
  const sourceQualityScore =
    {
      F: -55,
      D: -30,
      C: -8,
      B: 18,
      A: 46,
      S: 74,
      'S+': 96,
    }[normalizedQuality] || 0;
  const totalScore = roll + talentScore + sourceQualityScore;
  const grade = totalScore >= 220 ? 'S' : totalScore >= 152 ? 'A' : totalScore >= 96 ? 'B' : totalScore >= 52 ? 'C' : 'D';
  return {
    grade,
    totalScore,
    quality: { D: 'D级_粗糙', C: 'C级_劣质', B: 'B级_普通', A: 'A级_优秀', S: 'S级_极品' }[grade],
    scoreRoll: roll,
    sourceQuality: normalizedQuality || '无',
  };
}

function rollMainMechanicByGrade(type, grade, roll) {
  const safeGrade = normalizeSkillTableGrade(grade);
  const table = SKILL_MAIN_MECHANIC_DISTRIBUTION_V1[type] || SKILL_MAIN_MECHANIC_DISTRIBUTION_V1['强攻系'];
  const gradeCap = { C: 80, B: 90, A: 100, S: 100 }[safeGrade] || 100;
  const effectiveRoll = Math.min(Math.max(1, roll), gradeCap);
  return table.find(item => effectiveRoll >= item.min && effectiveRoll <= item.max)?.main || '伤害类';
}

function normalizeWeightedTableTotal(table = [], totalWeight = 100) {
  const source = Array.isArray(table)
    ? table
        .map(item => ({
          value: item?.value,
          weight: Math.max(0, Number(item?.weight || 0)),
        }))
        .filter(item => item.value && item.weight > 0)
    : [];
  if (!source.length) return [];
  const safeTotal = Math.max(1, Math.floor(Number(totalWeight || 100)));
  const currentTotal = source.reduce((sum, item) => sum + item.weight, 0);
  if (!(currentTotal > 0)) return source;
  let assigned = 0;
  return source.map((item, index) => {
    if (index === source.length - 1) {
      return { ...item, weight: Math.max(1, safeTotal - assigned) };
    }
    const scaled = Math.max(1, Math.round((item.weight / currentTotal) * safeTotal));
    assigned += scaled;
    return { ...item, weight: scaled };
  });
}

function isAutoGeneratedExclusiveMainArchetype(archetype = '') {
  return AUTO_GENERATED_EXCLUSIVE_MAIN_ARCHETYPES_V1.has(String(archetype || '').trim());
}

function isRouguRabbitFlavorSource(text = '') {
  const safeText = String(text || '').trim();
  if (!safeText) return false;
  return /(柔骨兔|柔骨|骨兔|月兔|玉兔|魅兔|兔)/.test(safeText);
}

function rebalanceWeightedTableWithPreferredValue(table = [], preferredValue = '', preferredWeight = 0) {
  const source = Array.isArray(table) ? table.map(item => ({ ...item })) : [];
  const target = source.find(item => item?.value === preferredValue);
  if (!target || !(preferredWeight > 0)) return source;
  const remainingWeight = Math.max(0, 100 - preferredWeight);
  const otherItems = source.filter(item => item?.value !== preferredValue);
  const otherTotal = otherItems.reduce((sum, item) => sum + Math.max(0, Number(item?.weight || 0)), 0);
  target.weight = preferredWeight;
  if (!(otherTotal > 0)) return source;
  let assigned = 0;
  otherItems.forEach((item, index) => {
    if (index === otherItems.length - 1) {
      item.weight = Math.max(0, remainingWeight - assigned);
      return;
    }
    const scaled = Math.max(0, Math.round((Math.max(0, Number(item.weight || 0)) / otherTotal) * remainingWeight));
    item.weight = scaled;
    assigned += scaled;
  });
  return source;
}

function buildDefenseArchetypeWeightedTableByContext(grade, type = '强攻系', sourceName = '') {
  const safeGrade = normalizeSkillTableGrade(grade);
  const baseTables = {
    C: [
      { value: '护盾', weight: 48 },
      { value: '减伤', weight: 23 },
      { value: '格挡/抵消', weight: 10 },
      { value: '无敌金身', weight: 5 },
      { value: '伤害反射', weight: 4 },
      { value: '伤害分摊', weight: 4 },
      { value: '替身抵消', weight: 4 },
      { value: '复苏', weight: 2 },
    ],
    B: [
      { value: '护盾', weight: 30 },
      { value: '减伤', weight: 18 },
      { value: '格挡/抵消', weight: 15 },
      { value: '霸体', weight: 15 },
      { value: '免死/锁血', weight: 5 },
      { value: '无敌金身', weight: 6 },
      { value: '伤害反射', weight: 4 },
      { value: '伤害分摊', weight: 4 },
      { value: '替身抵消', weight: 2 },
      { value: '复苏', weight: 1 },
    ],
    A: [
      { value: '护盾', weight: 20 },
      { value: '减伤', weight: 18 },
      { value: '格挡/抵消', weight: 15 },
      { value: '霸体', weight: 12 },
      { value: '免死/锁血', weight: 8 },
      { value: '无敌金身', weight: 9 },
      { value: '伤害反射', weight: 6 },
      { value: '伤害分摊', weight: 5 },
      { value: '替身抵消', weight: 4 },
      { value: '复苏', weight: 3 },
    ],
    S: [
      { value: '护盾', weight: 12 },
      { value: '减伤', weight: 13 },
      { value: '格挡/抵消', weight: 12 },
      { value: '霸体', weight: 10 },
      { value: '免死/锁血', weight: 16 },
      { value: '无敌金身', weight: 15 },
      { value: '伤害反射', weight: 8 },
      { value: '伤害分摊', weight: 6 },
      { value: '替身抵消', weight: 4 },
      { value: '复苏', weight: 4 },
    ],
  };
  let table = (baseTables[safeGrade] || baseTables.B).map(item => ({ ...item }));
  if (type === '防御系') {
    table = rebalanceWeightedTableWithPreferredValue(table, '无敌金身', { C: 2, B: 3, A: 4, S: 6 }[safeGrade] || 3);
    table = rebalanceWeightedTableWithPreferredValue(table, '替身抵消', { C: 1, B: 1, A: 2, S: 2 }[safeGrade] || 1);
    table = rebalanceWeightedTableWithPreferredValue(table, '伤害反射', { C: 12, B: 15, A: 20, S: 26 }[safeGrade] || 15);
    table = rebalanceWeightedTableWithPreferredValue(table, '伤害分摊', { C: 4, B: 5, A: 6, S: 8 }[safeGrade] || 5);
  } else if (type === '敏攻系') {
    table = rebalanceWeightedTableWithPreferredValue(table, '无敌金身', { C: 16, B: 24, A: 34, S: 45 }[safeGrade] || 24);
    table = rebalanceWeightedTableWithPreferredValue(table, '替身抵消', { C: 24, B: 34, A: 44, S: 56 }[safeGrade] || 34);
  } else if (type === '强攻系') {
    table = rebalanceWeightedTableWithPreferredValue(table, '无敌金身', { C: 8, B: 12, A: 18, S: 24 }[safeGrade] || 12);
    table = rebalanceWeightedTableWithPreferredValue(table, '伤害反射', { C: 10, B: 16, A: 24, S: 32 }[safeGrade] || 16);
  } else if (type === '控制系') {
    table = rebalanceWeightedTableWithPreferredValue(table, '伤害分摊', { C: 14, B: 22, A: 30, S: 40 }[safeGrade] || 22);
  } else if (type === '辅助系') {
    table = rebalanceWeightedTableWithPreferredValue(table, '伤害分摊', { C: 18, B: 28, A: 38, S: 48 }[safeGrade] || 28);
    table = rebalanceWeightedTableWithPreferredValue(table, '复苏', { C: 16, B: 24, A: 34, S: 44 }[safeGrade] || 24);
  } else if (type === '治疗系') {
    table = rebalanceWeightedTableWithPreferredValue(table, '伤害分摊', { C: 12, B: 20, A: 28, S: 36 }[safeGrade] || 20);
    table = rebalanceWeightedTableWithPreferredValue(table, '复苏', { C: 20, B: 30, A: 42, S: 54 }[safeGrade] || 30);
  }
  if (isRouguRabbitFlavorSource(sourceName)) {
    table = rebalanceWeightedTableWithPreferredValue(table, '无敌金身', { C: 30, B: 45, A: 58, S: 72 }[safeGrade] || 45);
  }
  return table;
}

function buildSpecialRuleArchetypeWeightedTableByContext(grade, type = '强攻系') {
  const safeGrade = normalizeSkillTableGrade(grade);
  const baseTables = {
    C: [
      { value: '条件触发', weight: 39 },
      { value: '分身', weight: 21 },
      { value: '强制绑定/锁定', weight: 10 },
      { value: '反制', weight: 10 },
      { value: '转化', weight: 8 },
      { value: '状态交换', weight: 3 },
      { value: '复制', weight: 2 },
      { value: '规则改写', weight: 2 },
      { value: '状态转移', weight: 1 },
      { value: '引爆持续伤害', weight: 1 },
      { value: '斩盾', weight: 1 },
      { value: '窃取护盾', weight: 2 },
      { value: '吞噬', weight: 2 },
      { value: '能力共享', weight: 2 },
      { value: '机制抹消', weight: 1 },
    ],
    B: [
      { value: '条件触发', weight: 25 },
      { value: '分身', weight: 18 },
      { value: '强制绑定/锁定', weight: 16 },
      { value: '反制', weight: 12 },
      { value: '转化', weight: 10 },
      { value: '状态交换', weight: 6 },
      { value: '复制', weight: 4 },
      { value: '规则改写', weight: 3 },
      { value: '状态转移', weight: 2 },
      { value: '引爆持续伤害', weight: 2 },
      { value: '斩盾', weight: 1 },
      { value: '窃取护盾', weight: 1 },
      { value: '吞噬', weight: 2 },
      { value: '能力共享', weight: 2 },
      { value: '机制抹消', weight: 2 },
    ],
    A: [
      { value: '分身', weight: 12 },
      { value: '复制', weight: 10 },
      { value: '反制', weight: 16 },
      { value: '转化', weight: 9 },
      { value: '状态交换', weight: 12 },
      { value: '强制绑定/锁定', weight: 10 },
      { value: '条件触发', weight: 7 },
      { value: '规则改写', weight: 10 },
      { value: '状态转移', weight: 5 },
      { value: '引爆持续伤害', weight: 4 },
      { value: '斩盾', weight: 3 },
      { value: '窃取护盾', weight: 2 },
      { value: '吞噬', weight: 4 },
      { value: '能力共享', weight: 4 },
      { value: '机制抹消', weight: 3 },
    ],
    S: [
      { value: '分身', weight: 10 },
      { value: '复制', weight: 9 },
      { value: '反制', weight: 15 },
      { value: '转化', weight: 8 },
      { value: '状态交换', weight: 10 },
      { value: '强制绑定/锁定', weight: 9 },
      { value: '条件触发', weight: 6 },
      { value: '规则改写', weight: 12 },
      { value: '状态转移', weight: 8 },
      { value: '引爆持续伤害', weight: 5 },
      { value: '斩盾', weight: 5 },
      { value: '窃取护盾', weight: 3 },
      { value: '吞噬', weight: 5 },
      { value: '能力共享', weight: 5 },
      { value: '机制抹消', weight: 4 },
    ],
  };
  let table = (baseTables[safeGrade] || baseTables.B).map(item => ({ ...item }));
  if (type === '精神系') {
    table = rebalanceWeightedTableWithPreferredValue(table, '状态转移', { C: 18, B: 28, A: 38, S: 50 }[safeGrade] || 28);
    table = rebalanceWeightedTableWithPreferredValue(table, '吞噬', { C: 14, B: 22, A: 32, S: 44 }[safeGrade] || 22);
    table = rebalanceWeightedTableWithPreferredValue(table, '能力共享', { C: 10, B: 16, A: 24, S: 34 }[safeGrade] || 16);
    table = rebalanceWeightedTableWithPreferredValue(table, '机制抹消', { C: 12, B: 20, A: 30, S: 40 }[safeGrade] || 20);
  }
  if (type === '控制系') {
    table = rebalanceWeightedTableWithPreferredValue(table, '状态转移', { C: 12, B: 20, A: 28, S: 36 }[safeGrade] || 20);
    table = rebalanceWeightedTableWithPreferredValue(table, '机制抹消', { C: 14, B: 22, A: 34, S: 46 }[safeGrade] || 22);
  }
  if (type === '强攻系') {
    table = rebalanceWeightedTableWithPreferredValue(table, '斩盾', { C: 10, B: 16, A: 24, S: 32 }[safeGrade] || 16);
  }
  if (type === '敏攻系') {
    table = rebalanceWeightedTableWithPreferredValue(table, '斩盾', { C: 14, B: 22, A: 30, S: 38 }[safeGrade] || 22);
  }
  if (type === '元素系') {
    table = rebalanceWeightedTableWithPreferredValue(table, '斩盾', { C: 12, B: 20, A: 30, S: 40 }[safeGrade] || 20);
    table = rebalanceWeightedTableWithPreferredValue(table, '引爆持续伤害', { C: 16, B: 24, A: 34, S: 46 }[safeGrade] || 24);
    table = rebalanceWeightedTableWithPreferredValue(table, '吞噬', { C: 12, B: 18, A: 26, S: 34 }[safeGrade] || 18);
  }
  if (type === '辅助系' || type === '治疗系') {
    table = rebalanceWeightedTableWithPreferredValue(table, '窃取护盾', { C: 10, B: 16, A: 24, S: 30 }[safeGrade] || 16);
    table = rebalanceWeightedTableWithPreferredValue(table, '能力共享', { C: 14, B: 22, A: 32, S: 42 }[safeGrade] || 22);
  }
  if (type === '食物系') {
    table = rebalanceWeightedTableWithPreferredValue(table, '能力共享', { C: 12, B: 18, A: 28, S: 36 }[safeGrade] || 18);
  }
  return table;
}

function getSpecialRuleExpansionChance(grade = 'B', type = '强攻系') {
  const gradeKey = normalizeSkillGradeSymbol(grade);
  const base = { F: 2, D: 4, C: 6, B: 10, A: 16, S: 22, 'S+': 25 }[gradeKey] || 10;
  const bonus =
    {
      精神系: 10,
      控制系: 8,
      元素系: 6,
      辅助系: 4,
      治疗系: 4,
      食物系: 3,
    }[String(type || '强攻系').trim()] || 0;
  return Math.max(4, Math.min(40, base + bonus));
}

function rollSpecialRuleArchetypeByContext(grade, type = '强攻系', roll = 1) {
  const sourceTable = buildSpecialRuleArchetypeWeightedTableByContext(grade, type);
  const baseTable = normalizeWeightedTableTotal(
    sourceTable.filter(item => !SPECIAL_RULE_EXPANDED_ARCHETYPE_SET_V1.has(String(item?.value || '').trim())),
  );
  const expandedTable = normalizeWeightedTableTotal(
    sourceTable.filter(item => SPECIAL_RULE_EXPANDED_ARCHETYPE_SET_V1.has(String(item?.value || '').trim())),
  );
  const normalizedRoll = Math.max(1, Math.min(100, Number(roll) || 1));
  const expansionChance = expandedTable.length ? getSpecialRuleExpansionChance(grade, type) : 0;
  if (expandedTable.length && normalizedRoll <= expansionChance) {
    const expansionRoll = Math.max(1, Math.min(100, Math.ceil((normalizedRoll / Math.max(1, expansionChance)) * 100)));
    return rollWeightedBucket(expandedTable, expansionRoll) || expandedTable[0]?.value || '条件触发';
  }
  if (baseTable.length) {
    const baseWindow = Math.max(1, 100 - expansionChance);
    const shiftedRoll = Math.max(1, normalizedRoll - expansionChance);
    const baseRoll = Math.max(1, Math.min(100, Math.ceil((shiftedRoll / baseWindow) * 100)));
    return rollWeightedBucket(baseTable, baseRoll) || baseTable[0]?.value || '条件触发';
  }
  return rollWeightedBucket(expandedTable, 50) || expandedTable[0]?.value || '条件触发';
}

function rollSubModelByGrade(mainMechanic, grade, roll, context = {}) {
  const safeGrade = normalizeSkillTableGrade(grade);
  const tables = {
    伤害类: {
      C: [
        { value: '直接伤害', weight: 70 },
        { value: '多段伤害', weight: 20 },
        { value: '持续伤害', weight: 10 },
      ],
      B: [
        { value: '直接伤害', weight: 50 },
        { value: '多段伤害', weight: 25 },
        { value: '持续伤害', weight: 15 },
        { value: '延迟爆发', weight: 10 },
      ],
      A: [
        { value: '直接伤害', weight: 35 },
        { value: '多段伤害', weight: 25 },
        { value: '持续伤害', weight: 20 },
        { value: '延迟爆发', weight: 20 },
      ],
      S: [
        { value: '直接伤害', weight: 25 },
        { value: '多段伤害', weight: 25 },
        { value: '持续伤害', weight: 25 },
        { value: '延迟爆发', weight: 25 },
      ],
    },
    控制类: {
      C: [
        { value: '软控', weight: 70 },
        { value: '节奏打断', weight: 20 },
        { value: '位移限制', weight: 10 },
      ],
      B: [
        { value: '软控', weight: 45 },
        { value: '硬控', weight: 25 },
        { value: '节奏打断', weight: 20 },
        { value: '位移限制', weight: 10 },
      ],
      A: [
        { value: '软控', weight: 30 },
        { value: '硬控', weight: 30 },
        { value: '节奏打断', weight: 15 },
        { value: '位移限制', weight: 15 },
        { value: '软控', weight: 10 },
      ],
      S: [
        { value: '软控', weight: 20 },
        { value: '硬控', weight: 35 },
        { value: '节奏打断', weight: 15 },
        { value: '位移限制', weight: 20 },
        { value: '节奏打断', weight: 10 },
      ],
    },
    削弱类: {
      C: [
        { value: '单属性削弱', weight: 70 },
        { value: '消耗提高', weight: 15 },
        { value: '前摇拉长', weight: 10 },
        { value: '禁疗', weight: 5 },
      ],
      B: [
        { value: '单属性削弱', weight: 40 },
        { value: '多属性削弱', weight: 25 },
        { value: '消耗提高', weight: 10 },
        { value: '前摇拉长', weight: 10 },
        { value: '掌控压制', weight: 10 },
        { value: '禁疗', weight: 5 },
      ],
      A: [
        { value: '单属性削弱', weight: 25 },
        { value: '多属性削弱', weight: 25 },
        { value: '消耗提高', weight: 12 },
        { value: '前摇拉长', weight: 12 },
        { value: '掌控压制', weight: 11 },
        { value: '禁疗', weight: 15 },
      ],
      S: [
        { value: '单属性削弱', weight: 16 },
        { value: '多属性削弱', weight: 20 },
        { value: '消耗提高', weight: 14 },
        { value: '前摇拉长', weight: 14 },
        { value: '掌控压制', weight: 16 },
        { value: '禁疗', weight: 20 },
      ],
    },
    增益类: {
      C: [
        { value: '单属性增益', weight: 70 },
        { value: '消耗降低', weight: 15 },
        { value: '前摇缩短', weight: 10 },
        { value: '速度提升', weight: 5 },
      ],
      B: [
        { value: '单属性增益', weight: 40 },
        { value: '多属性增益', weight: 20 },
        { value: '消耗降低', weight: 12 },
        { value: '前摇缩短', weight: 12 },
        { value: '掌控提升', weight: 8 },
        { value: '速度提升', weight: 8 },
      ],
      A: [
        { value: '单属性增益', weight: 25 },
        { value: '多属性增益', weight: 20 },
        { value: '全属性增益', weight: 10 },
        { value: '消耗降低', weight: 15 },
        { value: '前摇缩短', weight: 10 },
        { value: '掌控提升', weight: 10 },
        { value: '速度提升', weight: 10 },
      ],
      S: [
        { value: '单属性增益', weight: 15 },
        { value: '多属性增益', weight: 20 },
        { value: '全属性增益', weight: 15 },
        { value: '消耗降低', weight: 15 },
        { value: '前摇缩短', weight: 10 },
        { value: '掌控提升', weight: 15 },
        { value: '速度提升', weight: 10 },
      ],
    },
    防御类: {
      C: buildDefenseArchetypeWeightedTableByContext('C', context?.type || '强攻系', context?.sourceName || ''),
      B: buildDefenseArchetypeWeightedTableByContext('B', context?.type || '强攻系', context?.sourceName || ''),
      A: buildDefenseArchetypeWeightedTableByContext('A', context?.type || '强攻系', context?.sourceName || ''),
      S: buildDefenseArchetypeWeightedTableByContext('S', context?.type || '强攻系', context?.sourceName || ''),
    },
    回复类: {
      C: [
        { value: '体力恢复', weight: 65 },
        { value: '魂力恢复', weight: 15 },
        { value: '精神恢复', weight: 10 },
        { value: '持续恢复', weight: 5 },
        { value: '净化/解控', weight: 5 },
      ],
      B: [
        { value: '体力恢复', weight: 35 },
        { value: '魂力恢复', weight: 20 },
        { value: '精神恢复', weight: 20 },
        { value: '持续恢复', weight: 15 },
        { value: '净化/解控', weight: 10 },
      ],
      A: [
        { value: '体力恢复', weight: 25 },
        { value: '魂力恢复', weight: 20 },
        { value: '精神恢复', weight: 20 },
        { value: '持续恢复', weight: 20 },
        { value: '净化/解控', weight: 15 },
      ],
      S: [
        { value: '体力恢复', weight: 18 },
        { value: '魂力恢复', weight: 20 },
        { value: '精神恢复', weight: 20 },
        { value: '持续恢复', weight: 22 },
        { value: '净化/解控', weight: 20 },
      ],
    },
    '感知/认知类': {
      C: [
        { value: '感知干扰', weight: 35 },
        { value: '标记锁定', weight: 35 },
        { value: '幻境', weight: 20 },
        { value: '催眠', weight: 10 },
      ],
      B: [
        { value: '感知干扰', weight: 20 },
        { value: '标记锁定', weight: 25 },
        { value: '共享视野', weight: 15 },
        { value: '幻境', weight: 20 },
        { value: '催眠', weight: 10 },
        { value: '认知扭曲', weight: 10 },
      ],
      A: [
        { value: '感知干扰', weight: 15 },
        { value: '标记锁定', weight: 20 },
        { value: '共享视野', weight: 20 },
        { value: '幻境', weight: 15 },
        { value: '催眠', weight: 15 },
        { value: '认知扭曲', weight: 15 },
      ],
      S: [
        { value: '标记锁定', weight: 20 },
        { value: '共享视野', weight: 20 },
        { value: '幻境', weight: 15 },
        { value: '催眠', weight: 15 },
        { value: '认知扭曲', weight: 30 },
      ],
    },
    特殊规则类: {
      C: buildSpecialRuleArchetypeWeightedTableByContext('C', context?.type || '强攻系'),
      B: buildSpecialRuleArchetypeWeightedTableByContext('B', context?.type || '强攻系'),
      A: buildSpecialRuleArchetypeWeightedTableByContext('A', context?.type || '强攻系'),
      S: buildSpecialRuleArchetypeWeightedTableByContext('S', context?.type || '强攻系'),
    },
    位移类: {
      C: [
        { value: '自身位移', weight: 70 },
        { value: '强制位移', weight: 30 },
      ],
      B: [
        { value: '自身位移', weight: 45 },
        { value: '强制位移', weight: 25 },
        { value: '位移交换', weight: 15 },
        { value: '追击位移', weight: 15 },
      ],
      A: [
        { value: '自身位移', weight: 30 },
        { value: '强制位移', weight: 25 },
        { value: '位移交换', weight: 20 },
        { value: '追击位移', weight: 15 },
        { value: '脱离位移', weight: 10 },
      ],
      S: [
        { value: '自身位移', weight: 20 },
        { value: '强制位移', weight: 20 },
        { value: '位移交换', weight: 20 },
        { value: '追击位移', weight: 20 },
        { value: '脱离位移', weight: 20 },
      ],
    },
  };
  const table = tables[mainMechanic]?.[safeGrade] || [
    { value: SKILL_ARCHETYPE_POOL_V1[mainMechanic]?.[0] || '无', weight: 100 },
  ];
  if (mainMechanic === '特殊规则类') {
    return rollSpecialRuleArchetypeByContext(grade, context?.type || '强攻系', roll);
  }
  return rollWeightedBucket(normalizeWeightedTableTotal(table), roll) || table[0]?.value || '无';
}

function rollTargetModelByGrade(mainMechanic, grade, roll, subModel = '', type = '') {
  const safeGrade = normalizeSkillTableGrade(grade);
  const offensive = {
    C: [{ value: '敌方单体', weight: 100 }],
    B: [
      { value: '敌方单体', weight: 80 },
      { value: '敌方群体', weight: 20 },
    ],
    A: [
      { value: '敌方单体', weight: 50 },
      { value: '敌方群体', weight: 45 },
      { value: '全场', weight: 5 },
    ],
    S: [
      { value: '敌方单体', weight: 35 },
      { value: '敌方群体', weight: 50 },
      { value: '全场', weight: 15 },
    ],
  };
  const support = {
    C: [
      { value: '自身', weight: 70 },
      { value: '友方单体', weight: 30 },
    ],
    B: [
      { value: '自身', weight: 45 },
      { value: '友方单体', weight: 40 },
      { value: '友方群体', weight: 15 },
    ],
    A: [
      { value: '自身', weight: 20 },
      { value: '友方单体', weight: 45 },
      { value: '友方群体', weight: 35 },
    ],
    S: [
      { value: '自身', weight: 10 },
      { value: '友方单体', weight: 30 },
      { value: '友方群体', weight: 50 },
      { value: '全场', weight: 10 },
    ],
  };
  const foodSupport = {
    C: [
      { value: '友方单体', weight: 55 },
      { value: '友方群体', weight: 40 },
      { value: '全场', weight: 5 },
    ],
    B: [
      { value: '友方单体', weight: 35 },
      { value: '友方群体', weight: 55 },
      { value: '全场', weight: 10 },
    ],
    A: [
      { value: '友方单体', weight: 20 },
      { value: '友方群体', weight: 60 },
      { value: '全场', weight: 20 },
    ],
    S: [
      { value: '友方单体', weight: 10 },
      { value: '友方群体', weight: 60 },
      { value: '全场', weight: 30 },
    ],
  };
  const cognitiveShared = {
    C: [
      { value: '自身', weight: 60 },
      { value: '友方单体', weight: 40 },
    ],
    B: [
      { value: '自身', weight: 30 },
      { value: '友方单体', weight: 45 },
      { value: '友方群体', weight: 25 },
    ],
    A: [
      { value: '自身', weight: 10 },
      { value: '友方单体', weight: 35 },
      { value: '友方群体', weight: 55 },
    ],
    S: [
      { value: '友方单体', weight: 25 },
      { value: '友方群体', weight: 60 },
      { value: '全场', weight: 15 },
    ],
  };
  const cognitiveHostile = {
    C: [{ value: '敌方单体', weight: 100 }],
    B: [
      { value: '敌方单体', weight: 75 },
      { value: '敌方群体', weight: 25 },
    ],
    A: [
      { value: '敌方单体', weight: 45 },
      { value: '敌方群体', weight: 45 },
      { value: '全场', weight: 10 },
    ],
    S: [
      { value: '敌方单体', weight: 30 },
      { value: '敌方群体', weight: 50 },
      { value: '全场', weight: 20 },
    ],
  };
  const special = {
    C: [
      { value: '敌方单体', weight: 70 },
      { value: '自身', weight: 30 },
    ],
    B: [
      { value: '敌方单体', weight: 50 },
      { value: '自身', weight: 20 },
      { value: '友方单体', weight: 20 },
      { value: '敌方群体', weight: 10 },
    ],
    A: [
      { value: '敌方单体', weight: 35 },
      { value: '敌方群体', weight: 25 },
      { value: '自身', weight: 15 },
      { value: '友方单体', weight: 15 },
      { value: '全场', weight: 10 },
    ],
    S: [
      { value: '敌方单体', weight: 20 },
      { value: '敌方群体', weight: 20 },
      { value: '自身', weight: 15 },
      { value: '友方单体', weight: 15 },
      { value: '友方群体', weight: 15 },
      { value: '全场', weight: 15 },
    ],
  };
  const mobility = {
    C: [
      { value: '自身', weight: 70 },
      { value: '敌方单体', weight: 30 },
    ],
    B: [
      { value: '自身', weight: 45 },
      { value: '敌方单体', weight: 40 },
      { value: '敌方群体', weight: 15 },
    ],
    A: [
      { value: '自身', weight: 25 },
      { value: '敌方单体', weight: 45 },
      { value: '敌方群体', weight: 25 },
      { value: '全场', weight: 5 },
    ],
    S: [
      { value: '自身', weight: 15 },
      { value: '敌方单体', weight: 35 },
      { value: '敌方群体', weight: 35 },
      { value: '全场', weight: 15 },
    ],
  };
  let tableSet = offensive;
  if (type === '食物系' && ['增益类', '防御类', '回复类', '特殊规则类'].includes(mainMechanic)) tableSet = foodSupport;
  else if (['增益类', '防御类', '回复类'].includes(mainMechanic)) tableSet = support;
  else if (['辅助系', '治疗系'].includes(type) && mainMechanic === '特殊规则类') tableSet = support;
  else if (mainMechanic === '感知/认知类') tableSet = subModel === '共享视野' ? cognitiveShared : cognitiveHostile;
  else if (mainMechanic === '特殊规则类' && subModel === '分身') tableSet = support;
  else if (mainMechanic === '特殊规则类') tableSet = special;
  else if (mainMechanic === '位移类') tableSet = mobility;
  return rollWeightedBucket(tableSet[safeGrade] || tableSet.C, roll) || '敌方单体';
}

function rollAttributeDirectionByType(type, subModel, roll) {
  void roll;
  const hints = SKILL_ATTRIBUTE_HINTS_BY_TYPE_V1[type] || ['魂力'];
  if (['全属性增益'].includes(subModel)) return ['力量', '防御', '敏捷', '精神力', '魂力'];
  if (['魂力恢复'].includes(subModel)) return ['魂力'];
  if (['精神恢复'].includes(subModel)) return ['精神力'];
  if (['体力恢复', '持续恢复', '净化/解控'].includes(subModel)) {
    const resourceHints = hints.filter(v => ['魂力', '精神力'].includes(v));
    return resourceHints.length > 0 ? pickUniqueRandom(resourceHints, 1) : ['气血'];
  }
  if (['多属性增益', '多属性削弱'].includes(subModel)) return pickUniqueRandom(hints, 2);
  return pickUniqueRandom(hints, 1);
}

function rollExtraMechanics(main, grade, ringIndex, preferredSecondary = [], type = '强攻系') {
  const weightedPool = buildSecondaryWeightedPool(main, type, preferredSecondary);
  let secondary = [];
  let mutation = [];
  const secondaryChance = getSecondaryGenerationChance(grade, ringIndex);
  const doubleChance = getSecondaryDoubleChance(grade, ringIndex);
  const mutationChance = getSecondaryMutationChance(grade, ringIndex);
  if (weightedPool.length > 0 && Math.random() * 100 < secondaryChance) {
    const count = Math.random() * 100 < doubleChance ? 2 : 1;
    secondary = pickUniqueWeightedRandom(weightedPool, count);
  }
  if (secondary.length > 0 && Math.random() * 100 < mutationChance)
    mutation = pickUniqueRandom(SKILL_MUTATION_MECHANIC_TYPES_V1, 1);
  return { secondary, mutation };
}

function rollSkillBlueprint(type, grade, ringIndex, preferredSecondary = [], options = {}) {
  const mainRoll = Math.floor(Math.random() * 100) + 1;
  const main = rollMainMechanicByGrade(type, grade, mainRoll);
  const subRoll = Math.floor(Math.random() * 100) + 1;
  const sourceName =
    String(options?.sourceName || options?.spiritName || options?.speciesName || options?.martialSoulName || '').trim();
  const subModel = rollSubModelByGrade(main, grade, subRoll, {
    type,
    sourceName,
  });
  const targetRoll = Math.floor(Math.random() * 100) + 1;
  const targetModel = rollTargetModelByGrade(main, grade, targetRoll, subModel, type);
  const attrRoll = Math.floor(Math.random() * 100) + 1;
  const attrHints = rollAttributeDirectionByType(type, subModel, attrRoll);
  const isExclusiveMain = isAutoGeneratedExclusiveMainArchetype(subModel);
  const extra = isExclusiveMain ? { secondary: [], mutation: [] } : rollExtraMechanics(main, grade, ringIndex, preferredSecondary, type);
  const deliveryPool = SKILL_DELIVERY_FORM_BY_TYPE_V1[type] || ['直接生效'];
  const delivery = type === '食物系' ? '造物承载' : subModel === '分身' ? '召唤承载' : pickRandom(deliveryPool) || '直接生效';

  return {
    系别来源: type,
    主机制大类: main,
    主机制原型: subModel,
    目标模型: targetModel,
    副机制: extra.secondary,
    变异机制: extra.mutation,
    释放形态: delivery,
    加成属性候选: [...attrHints],
    燃料模型: buildFuelModelByType(type, main),
    独占主机制: isExclusiveMain,
    _主机制骰: mainRoll,
    _子模型骰: subRoll,
    _目标模型骰: targetRoll,
    _属性方向骰: attrRoll,
  };
}

function findMainMechanicGroupByArchetype(主机制原型 = '') {
  const normalizedArchetype = String(主机制原型 || '').trim();
  if (!normalizedArchetype) return '';
  for (const [主机制大类, 原型列表] of Object.entries(SKILL_ARCHETYPE_POOL_V1 || {})) {
    if ((Array.isArray(原型列表) ? 原型列表 : []).includes(normalizedArchetype)) return 主机制大类;
  }
  return '';
}

function normalizeBlueprintOverrideForAutoGenerate(blueprintOverride = {}, type = '强攻系', grade = 'B', ringIndex = 1, preferredSecondary = [], options = {}) {
  const sourceName =
    String(options?.sourceName || options?.spiritName || options?.textContext?.spiritName || options?.speciesName || options?.martialSoulName || '')
      .trim();
  const explicitMain = String(blueprintOverride?.主机制大类 || '').trim();
  const explicitArchetype = String(blueprintOverride?.主机制原型 || '').trim();
  const main = explicitMain || findMainMechanicGroupByArchetype(explicitArchetype) || rollMainMechanicByGrade(type, grade, 50);
  const archetype = explicitArchetype || rollSubModelByGrade(main, grade, 50, { type, sourceName });
  const targetModel = normalizeSkillTargetModel(
    blueprintOverride?.目标模型 || rollTargetModelByGrade(main, grade, 50, archetype, type),
    '敌方单体',
  );
  const deliveryPool = SKILL_DELIVERY_FORM_BY_TYPE_V1[type] || ['直接生效'];
  const delivery =
    String(blueprintOverride?.释放形态 || '').trim() ||
    (type === '食物系' ? '造物承载' : archetype === '分身' ? '召唤承载' : pickRandom(deliveryPool) || '直接生效');
  const attrHints =
    Array.isArray(blueprintOverride?.加成属性候选) && blueprintOverride.加成属性候选.length
      ? [...blueprintOverride.加成属性候选]
      : [...rollAttributeDirectionByType(type, archetype, 50)];
  const isExclusiveMain = isAutoGeneratedExclusiveMainArchetype(archetype);
  const secondary = isExclusiveMain
    ? []
    : Array.isArray(blueprintOverride?.副机制)
      ? [...blueprintOverride.副机制]
      : [...preferredSecondary];
  const mutation = isExclusiveMain
    ? []
    : Array.isArray(blueprintOverride?.变异机制)
      ? [...blueprintOverride.变异机制]
      : [];
  const fuelModel =
    blueprintOverride?.燃料模型 && typeof blueprintOverride.燃料模型 === 'object'
      ? { ...blueprintOverride.燃料模型 }
      : buildFuelModelByType(type, main);
  const 多方向决策 = String(blueprintOverride?.是否多方向 || '').trim();
  const 是否多方向 = 多方向决策 === '是' || 多方向决策 === '否' ? 多方向决策 : '';
  const 多方向类型原始 = String(blueprintOverride?.多方向类型 || '').trim();
  const 多方向类型 = 技能多方向类型候选_V1.includes(多方向类型原始) ? 多方向类型原始 : '';
  return {
    系别来源: type,
    主机制大类: main,
    主机制原型: archetype,
    目标模型: targetModel,
    副机制: secondary,
    变异机制: mutation,
    释放形态: delivery,
    加成属性候选: attrHints,
    燃料模型: fuelModel,
    是否多方向,
    多方向类型,
    独占主机制: isExclusiveMain,
    _主机制骰: Number(blueprintOverride?._主机制骰 ?? -1),
    _子模型骰: Number(blueprintOverride?._子模型骰 ?? -1),
    _目标模型骰: Number(blueprintOverride?._目标模型骰 ?? -1),
    _属性方向骰: Number(blueprintOverride?._属性方向骰 ?? -1),
  };
}

function normalizeConstructTarget(target, fallback = '自身') {
  const text = String(target || fallback || '自身');
  if (/友方群体|己方\/群体|全员/.test(text)) return '友方群体';
  if (/友方单体|己方\/单体/.test(text)) return '友方单体';
  if (/敌方群体/.test(text)) return '敌方群体';
  if (/敌方单体/.test(text)) return '敌方单体';
  if (/全场/.test(text)) return '全场';
  return '自身';
}

const SKILL_TARGET_MODEL_VALUES_V1 = Object.freeze(['自身', '友方单体', '友方群体', '敌方单体', '敌方群体', '全场']);
const SKILL_TARGET_SCALE_VALUES_V1 = Object.freeze(['自身', '单体', '群体', '全场']);
const SKILL_TARGET_MODIFIER_VALUES_V1 = Object.freeze([
  '受隐身筛选',
  '可被破隐',
  '可被嘲讽',
  '可被护卫重定向',
  '可被随机偏转',
  '可被锁定强化',
]);
const SKILL_DIRECTION_TAG_VALUES_V1 = Object.freeze(['增幅', '压制', '锁定', '限制', '转译', '置换']);
const 技能多方向类型候选_V1 = Object.freeze([
  '无',
  '增幅压制',
  '锁定限制',
  '转译置换',
  '增幅压制锁定',
  '转译置换限制',
]);
const AUTO_GENERATED_MULTI_DIRECTION_MAIN_ARCHETYPES_V1 = new Set([
  '状态交换',
  '状态转移',
  '规则改写',
  '转化',
  '条件触发',
  '强制绑定/锁定',
  '标记锁定',
  '认知扭曲',
  '位移限制',
  '共享视野',
]);

function normalizeSkillTargetScale(value = '', fallback = '单体') {
  const text = String(value || '').trim();
  if (SKILL_TARGET_SCALE_VALUES_V1.includes(text)) return text;
  if (text === '自身') return '自身';
  if (text === '全场') return '全场';
  if (/群体/.test(text)) return '群体';
  if (/单体/.test(text)) return '单体';
  return SKILL_TARGET_SCALE_VALUES_V1.includes(fallback) ? fallback : '单体';
}

function deriveSkillTargetScaleFromModel(targetModel = '敌方单体') {
  const normalized = normalizeSkillTargetModel(targetModel, '敌方单体');
  if (normalized === '自身') return '自身';
  if (normalized === '全场') return '全场';
  if (normalized.includes('群体')) return '群体';
  return '单体';
}

const 技能执行黑名单键表_V1 = Object.freeze([
  '文本',
  '描述',
  '效果描述',
  '副作用说明',
  '对象差异条件文案',
]);
const 技能对象差异规则条件候选_V1 = Object.freeze([
  '自身',
  '友方',
  '敌方',
  '邪魂师',
  '深渊生物',
  '魂兽',
  '施术者低血量',
  '施术者高血量',
  '目标低血量',
  '目标高血量',
  '目标有状态',
  '目标无状态',
  '目标有护盾',
  '目标无护盾',
]);
const 技能对象差异规则处理候选_V1 = Object.freeze([
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
const 技能执行黑名单键集合_V1 = new Set(技能执行黑名单键表_V1);
const 技能执行效果保留键集合_V1 = new Set(['机制', '目标模型', '持续回合', '触发时机', '参数', '对象差异规则', '分支标记']);
const 技能执行系统基础保留键集合_V1 = new Set([
  '机制',
  '技能来源',
  '技能类型',
  '目标模型',
  '结算策略',
  '消耗',
  'cast_time',
  '副作用列表',
]);

function 归一化执行效果目标模型_V1(value = '', fallback = '敌方单体') {
  const text = String(value || '').trim();
  if (!text) return normalizeSkillTargetModel(fallback, '敌方单体');
  const aliasMap = {
    '己方/单体': '友方单体',
    '己方/群体': '友方群体',
    '敌方/单体': '敌方单体',
    '敌方/群体': '敌方群体',
    食用者: '友方单体',
    使用者: '自身',
    随机目标: normalizeSkillTargetModel(fallback, '敌方单体'),
  };
  return normalizeSkillTargetModel(aliasMap[text] || text, normalizeSkillTargetModel(fallback, '敌方单体'));
}

function 收口执行对象差异规则条目_V1(value = {}, recordViolation = () => {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  Object.keys(value).forEach(key => {
    if (技能执行黑名单键集合_V1.has(key)) recordViolation(`对象差异规则.${key}`);
  });
  const 条件原始 = Array.isArray(value.条件)
    ? value.条件
    : String(value.条件 || value.匹配 || value.对象 || value.target || '')
      .split(/[\/|,，、\s]+/)
      .filter(Boolean);
  const 条件 = Array.from(new Set(条件原始.map(item => String(item || '').trim()).filter(item =>
    技能对象差异规则条件候选_V1.includes(item),
  )));
  if (!条件.length) return null;
  const 处理原始 = String(value.处理 || value.动作 || value.action || '覆盖').trim() || '覆盖';
  const 处理 = 技能对象差异规则处理候选_V1.includes(处理原始) ? 处理原始 : '覆盖';
  const 参数原始 = value.参数 && typeof value.参数 === 'object' && !Array.isArray(value.参数) ? value.参数 : {};
  const 参数 = cloneJsonValue(参数原始);
  Object.entries(value).forEach(([key, raw]) => {
    if (['条件', '匹配', '对象', 'target', '处理', '动作', 'action', '参数'].includes(key)) return;
    if (技能执行黑名单键集合_V1.has(key)) return;
    if (raw === undefined) return;
    if (typeof raw === 'string' && !raw.trim()) return;
    参数[key] = cloneJsonValue(raw);
  });
  const normalized = {
    条件,
    处理,
  };
  if (Object.keys(参数).length > 0) normalized.参数 = 参数;
  return normalized;
}

function 收口执行对象差异规则列表_V1(value = [], recordViolation = () => {}) {
  return (Array.isArray(value) ? value : [])
    .map(item => 收口执行对象差异规则条目_V1(item, recordViolation))
    .filter(Boolean);
}

function 收口执行副作用条目_V1(value = {}, recordViolation = () => {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  Object.keys(value).forEach(key => {
    if (技能执行黑名单键集合_V1.has(key)) recordViolation(`副作用列表.${key}`);
  });
  const 副作用类型 = String(value.副作用类型 || '').trim();
  if (!副作用类型) return null;
  const 触发时机 = String(value.触发时机 || '施放后').trim() || '施放后';
  const 生效对象 = String(value.生效对象 || '施术者').trim() || '施术者';
  const 持续回合 = Math.max(0, Math.round(Number(value.持续回合 || 0)));
  const 概率源 = Number(value.触发概率 ?? 1);
  const 触发概率 = Number.isFinite(概率源) ? Math.max(0, Math.min(1, Number(概率源.toFixed(4)))) : 1;
  const 参数原始 = value.参数 && typeof value.参数 === 'object' && !Array.isArray(value.参数) ? value.参数 : {};
  const 参数 = cloneJsonValue(参数原始);
  if (value.面板修改比例 && typeof value.面板修改比例 === 'object' && !Array.isArray(value.面板修改比例))
    参数.面板修改比例 = cloneJsonValue(value.面板修改比例);
  if (value.战斗效果 && typeof value.战斗效果 === 'object' && !Array.isArray(value.战斗效果))
    参数.战斗效果 = cloneJsonValue(value.战斗效果);
  if (String(value.关联状态 || '').trim()) 参数.关联状态 = String(value.关联状态 || '').trim();
  Object.entries(value).forEach(([key, raw]) => {
    if (['副作用类型', '触发时机', '生效对象', '持续回合', '触发概率', '参数', '面板修改比例', '战斗效果', '关联状态'].includes(key))
      return;
    if (技能执行黑名单键集合_V1.has(key)) return;
    if (raw === undefined) return;
    if (typeof raw === 'string' && !raw.trim()) return;
    参数[key] = cloneJsonValue(raw);
  });
  const normalized = { 副作用类型, 触发时机, 生效对象, 持续回合, 触发概率 };
  if (Object.keys(参数).length > 0) normalized.参数 = 参数;
  return normalized;
}

function 收口执行副作用列表_V1(value = [], recordViolation = () => {}) {
  return normalizeSkillSideEffectList(Array.isArray(value) ? value : [])
    .map(item => 收口执行副作用条目_V1(item, recordViolation))
    .filter(Boolean);
}

function 收口执行效果条目_V1(value = {}, fallbackTargetModel = '敌方单体', recordViolation = () => {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const 机制 = String(value.机制 || '').trim();
  if (!机制 || 机制 === '系统基础' || isSkillSummaryEffect(value)) return null;
  Object.keys(value).forEach(key => {
    if (技能执行黑名单键集合_V1.has(key)) recordViolation(`${机制}.${key}`);
  });
  const 目标模型 = 归一化执行效果目标模型_V1(value.目标模型 || value.目标 || value.对象, fallbackTargetModel);
  const 持续回合 = Math.max(
    0,
    Math.round(Number(value.持续回合 ?? value.持续 ?? 0)),
  );
  const 触发时机 = String(value.触发时机 || value.触发 || '').trim();
  const 参数 = {};
  const 参数原始 = value.参数 && typeof value.参数 === 'object' && !Array.isArray(value.参数) ? value.参数 : {};
  Object.entries(参数原始).forEach(([key, raw]) => {
    if (!key || 技能执行黑名单键集合_V1.has(key)) return;
    if (raw === undefined) return;
    if (typeof raw === 'string' && !raw.trim()) return;
    参数[key] = cloneJsonValue(raw);
  });
  Object.entries(value).forEach(([key, raw]) => {
    if (
      [
        '机制',
        '目标模型',
        '目标',
        '对象',
        '持续回合',
        '持续',
        '触发时机',
        '触发',
        '参数',
        '对象差异规则',
      ].includes(key)
    )
      return;
    if (技能执行黑名单键集合_V1.has(key)) return;
    if (raw === undefined) return;
    if (typeof raw === 'string' && !raw.trim()) return;
    参数[key] = cloneJsonValue(raw);
  });
  const 对象差异规则 = 收口执行对象差异规则列表_V1(value.对象差异规则 || [], recordViolation);
  const 分支标记 = String(value.分支标记 || '').trim();
  const normalized = { 机制, 目标模型 };
  if (持续回合 > 0) normalized.持续回合 = 持续回合;
  if (触发时机) normalized.触发时机 = 触发时机;
  if (Object.keys(参数).length > 0) normalized.参数 = 参数;
  if (对象差异规则.length > 0) normalized.对象差异规则 = 对象差异规则;
  if (分支标记) normalized.分支标记 = 分支标记;
  return normalized;
}

function 收口执行系统基础条目_V1(value = {}, fallbackTargetModel = '敌方单体', recordViolation = () => {}) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  Object.keys(source).forEach(key => {
    if (技能执行黑名单键集合_V1.has(key)) recordViolation(`系统基础.${key}`);
  });
  const 目标模型 = 归一化执行效果目标模型_V1(source.目标模型 || source.对象, fallbackTargetModel);
  const 副作用列表 = 收口执行副作用列表_V1(source.副作用列表 || [], recordViolation);
  const normalized = {
    机制: '系统基础',
    技能来源: String(source.技能来源 || '魂技').trim() || '魂技',
    技能类型: String(source.技能类型 || '无').trim() || '无',
    目标模型,
    结算策略: String(source.结算策略 || getSkillTargetResolutionStrategy(目标模型)).trim() || '单目标独立',
    消耗: source.消耗 === undefined ? '无' : cloneJsonValue(source.消耗),
    cast_time: Number(source.cast_time ?? 0) || 0,
  };
  if (副作用列表.length > 0) normalized.副作用列表 = 副作用列表;
  return normalized;
}

function 收口技能执行效果数组_V1(effectArray = [], options = {}) {
  const source = Array.isArray(effectArray) ? effectArray : [];
  const recordViolation = () => {};
  const systemSource = source.find(effect => String(effect?.机制 || '').trim() === '系统基础') || {};
  const fallbackTargetModel = normalizeSkillTargetModel(options.目标模型 || '敌方单体', '敌方单体');
  const systemBase = 收口执行系统基础条目_V1(systemSource, fallbackTargetModel, recordViolation);
  const effectList = source
    .filter(effect => String(effect?.机制 || '').trim() !== '系统基础')
    .map(effect => 收口执行效果条目_V1(effect, systemBase.目标模型, recordViolation))
    .filter(Boolean);
  return [systemBase, ...effectList];
}

function 收口技能执行结构_V1(skill = {}, options = {}) {
  if (!skill || typeof skill !== 'object') return skill;
  skill._效果数组 = 收口技能执行效果数组_V1(skill._效果数组 || [], options);
  return skill;
}

function buildAutoGeneratedDirectionCountByGrade(grade = 'B') {
  if (grade === 'S') return 6;
  if (grade === 'A') return 5;
  return 4;
}

function isAutoGeneratedMultiDirectionArchetype(archetype = '') {
  return AUTO_GENERATED_MULTI_DIRECTION_MAIN_ARCHETYPES_V1.has(String(archetype || '').trim());
}

function 构建多方向标签序列_V1(多方向类型 = '', 方向数量 = 0) {
  const 类型 = String(多方向类型 || '').trim();
  const 映射 = {
    增幅压制: ['增幅', '压制'],
    锁定限制: ['锁定', '限制'],
    转译置换: ['转译', '置换'],
    增幅压制锁定: ['增幅', '压制', '锁定'],
    转译置换限制: ['转译', '置换', '限制'],
  };
  const 基础序列 = Array.isArray(映射[类型]) ? [...映射[类型]] : [];
  const 最终序列 = [...基础序列];
  SKILL_DIRECTION_TAG_VALUES_V1.forEach(tag => {
    if (!最终序列.includes(tag)) 最终序列.push(tag);
  });
  const 安全方向数量 = Math.max(0, Number(方向数量 || 0));
  return 安全方向数量 > 0 ? 最终序列.slice(0, 安全方向数量) : 最终序列;
}

function 解析多方向类型标签_V1(多方向类型 = '') {
  const 类型 = String(多方向类型 || '').trim();
  const 映射 = {
    增幅压制: ['增幅', '压制'],
    锁定限制: ['锁定', '限制'],
    转译置换: ['转译', '置换'],
    增幅压制锁定: ['增幅', '压制', '锁定'],
    转译置换限制: ['转译', '置换', '限制'],
  };
  return Array.isArray(映射[类型]) ? [...映射[类型]] : [];
}

function buildAutoGeneratedDirectionEffectTemplate(directionTag = '压制', targetModel = '敌方单体', grade = 'B') {
  const duration = grade === 'S' ? 3 : grade === 'A' ? 3 : 2;
  if (directionTag === '增幅') {
    return [
      {
        机制: '属性变化',
        目标: targetModel,
        属性: 'agi',
        动作: '倍率提升',
        数值: Number(({ C: 1.12, B: 1.18, A: 1.24, S: 1.3 }[grade] || 1.18).toFixed(2)),
        持续: duration,
        触发: '立即生效',
      },
      {
        机制: '掌控修正',
        目标: targetModel,
        属性: '掌控',
        动作: '倍率提升',
        数值: Number(({ C: 1.08, B: 1.12, A: 1.16, S: 1.2 }[grade] || 1.12).toFixed(2)),
        持续: duration,
        触发: '立即生效',
      },
    ];
  }
  if (directionTag === '锁定') {
    return [
      {
        机制: '目标锁定',
        目标: targetModel,
        lock_level: grade === 'S' ? 3 : grade === 'A' ? 2 : 1,
        持续回合: duration,
      },
      {
        机制: '标记锁定',
        目标: targetModel,
        持续回合: duration,
        判定属性: 'agi',
        判定阈值: Number(({ C: 1.0, B: 1.05, A: 1.1, S: 1.15 }[grade] || 1.05).toFixed(2)),
      },
    ];
  }
  if (directionTag === '限制') {
    return [
      {
        机制: '位移限制',
        目标: targetModel,
        持续回合: duration,
        reaction_penalty: Number(({ C: 0.14, B: 0.2, A: 0.26, S: 0.32 }[grade] || 0.2).toFixed(2)),
        dodge_penalty: Number(({ C: 0.12, B: 0.18, A: 0.22, S: 0.26 }[grade] || 0.18).toFixed(2)),
        lock_level: grade === 'S' ? 3 : grade === 'A' ? 2 : 1,
      },
      {
        机制: '速度修正',
        目标: targetModel,
        属性: '速度',
        动作: '倍率压制',
        数值: Number(({ C: 0.86, B: 0.82, A: 0.78, S: 0.72 }[grade] || 0.82).toFixed(2)),
        持续: duration,
        触发: '立即生效',
      },
    ];
  }
  if (directionTag === '转译') {
    return [
      {
        机制: '转化',
        目标: targetModel,
        转化方向: '伤害→削弱',
        转化比例: Number(({ C: 0.2, B: 0.28, A: 0.36, S: 0.42 }[grade] || 0.28).toFixed(2)),
      },
      {
        机制: '条件触发',
        目标: targetModel,
        判定属性: 'hp_ratio',
        判定阈值: 0.45,
        成功参数: { final_damage_mult: Number(({ C: 1.06, B: 1.12, A: 1.2, S: 1.28 }[grade] || 1.12).toFixed(2)) },
      },
    ];
  }
  if (directionTag === '置换') {
    return [
      {
        机制: '状态转移',
        目标: targetModel,
        转移类型: '自身负面->目标',
        转移数量: grade === 'S' ? 2 : 1,
        触发条件: '命中后',
      },
      {
        机制: '状态交换',
        目标: targetModel,
        交换数量: 1,
        优先策略: '自身负面换目标正面',
      },
    ];
  }
  return [
    {
      机制: '速度修正',
      目标: targetModel,
      属性: '速度',
      动作: '倍率压制',
      数值: Number(({ C: 0.88, B: 0.84, A: 0.8, S: 0.75 }[grade] || 0.84).toFixed(2)),
      持续: duration,
      触发: '立即生效',
    },
    {
      机制: '软控',
      目标: targetModel,
      持续回合: duration,
      reaction_penalty: Number(({ C: 0.12, B: 0.16, A: 0.2, S: 0.26 }[grade] || 0.16).toFixed(2)),
      cast_speed_penalty: Number(({ C: 0.1, B: 0.14, A: 0.18, S: 0.22 }[grade] || 0.14).toFixed(2)),
      dodge_penalty: Number(({ C: 0.1, B: 0.14, A: 0.18, S: 0.22 }[grade] || 0.14).toFixed(2)),
    },
  ];
}

function 根据方向标签解析分支目标模型_V1(方向标签 = '', 基准目标模型 = '敌方单体') {
  const 标签 = String(方向标签 || '').trim();
  const 基准 = normalizeSkillTargetModel(基准目标模型, '敌方单体');
  if (标签 === '增幅') {
    if (基准 === '全场' || 基准 === '友方群体') return '友方群体';
    if (基准 === '友方单体') return '友方单体';
    return '友方单体';
  }
  if (['压制', '锁定', '限制'].includes(标签)) {
    if (基准 === '全场') return '敌方群体';
    if (基准 === '敌方群体') return '敌方群体';
    if (基准 === '敌方单体') return '敌方单体';
    if (基准 === '友方群体') return '敌方群体';
    return '敌方单体';
  }
  return 基准;
}

function 构建自动多方向分支列表_V1(targetModel = '敌方单体', grade = 'B', 多方向类型 = '') {
  const 类型标签 = 解析多方向类型标签_V1(多方向类型);
  const 分支数量 = 类型标签.length > 0 ? 类型标签.length : buildAutoGeneratedDirectionCountByGrade(grade);
  const 方向标签序列 = 构建多方向标签序列_V1(类型标签.length > 0 ? 多方向类型 : '', 分支数量);
  const 分支列表 = [];
  for (let index = 0; index < 分支数量; index += 1) {
    const 方向标签 = 方向标签序列[index] || '压制';
    const 分支标记 = `分支${index + 1}`;
    const 分支目标模型 = 根据方向标签解析分支目标模型_V1(方向标签, targetModel);
    const 原始效果列表 = buildAutoGeneratedDirectionEffectTemplate(方向标签, 分支目标模型, grade);
    const 分支效果数组 = clonePackedSkillEffects(Array.isArray(原始效果列表) ? 原始效果列表 : [])
      .filter(effect => String(effect?.机制 || '').trim() && String(effect?.机制 || '').trim() !== '系统基础')
      .map(effect => ({
        ...cloneJsonValue(effect),
        分支标记,
      }));
    if (!分支效果数组.length) continue;
    分支列表.push({ 分支标记, 分支效果数组 });
  }
  return 分支列表;
}

function normalizeSkillTargetModel(value = '', fallback = '敌方单体') {
  const text = String(value || '').trim();
  if (SKILL_TARGET_MODEL_VALUES_V1.includes(text)) return text;
  const derived = normalizeConstructTarget(text, fallback);
  return SKILL_TARGET_MODEL_VALUES_V1.includes(derived) ? derived : fallback;
}

function mapSkillTargetModelToCombatTarget(targetModel = '敌方单体') {
  return {
    自身: '自身',
    友方单体: '己方/单体',
    友方群体: '己方/群体',
    敌方单体: '敌方/单体',
    敌方群体: '敌方/群体',
    全场: '全场',
  }[normalizeSkillTargetModel(targetModel)] || '敌方/单体';
}

function normalizeSkillTargetModifierList(value = []) {
  const source = Array.isArray(value) ? value : [value];
  return Array.from(
    new Set(
      source
        .map(item => String(item || '').trim())
        .filter(item => SKILL_TARGET_MODIFIER_VALUES_V1.includes(item)),
    ),
  );
}

function buildGeneratedSkillTargetModifiers(targetModel = '敌方单体', archetype = '', secondary = [], mutation = []) {
  const normalizedTargetModel = normalizeSkillTargetModel(targetModel);
  const normalizedSecondary = Array.isArray(secondary) ? secondary.map(item => String(item || '').trim()) : [];
  const normalizedMutation = Array.isArray(mutation) ? mutation.map(item => String(item || '').trim()) : [];
  const modifiers = [];
  if (['敌方单体', '敌方群体'].includes(normalizedTargetModel)) {
    modifiers.push('受隐身筛选', '可被嘲讽', '可被护卫重定向', '可被锁定强化');
  }
  if (['敌方单体', '敌方群体', '全场'].includes(normalizedTargetModel) && normalizedSecondary.includes('破隐')) {
    modifiers.push('可被破隐');
  }
  if (
    ['敌方单体', '敌方群体'].includes(normalizedTargetModel) &&
    (normalizedMutation.includes('随机目标') || String(archetype || '').trim() === '认知扭曲')
  ) {
    modifiers.push('可被随机偏转');
  }
  return normalizeSkillTargetModifierList(modifiers);
}

function getSkillTargetResolutionStrategy(targetModel = '敌方单体') {
  return ['敌方群体', '友方群体', '全场'].includes(normalizeSkillTargetModel(targetModel))
    ? '全目标独立'
    : '单目标独立';
}

function buildConstructUsableEffects(baseEffects, defaultTarget, skillType = '') {
  const usable = [];
  (Array.isArray(baseEffects) ? baseEffects : []).forEach(effect => {
    if (!effect || typeof effect !== 'object') return;
    const mechanism = String(effect.机制 || '').trim();
    if (!mechanism || mechanism === '系统基础' || mechanism === '造物生成' || mechanism === '造物留场') return;
    let target = normalizeConstructTarget(effect.目标 || effect.对象 || defaultTarget, defaultTarget);
    if (skillType === '食物系') target = '食用者';
    const summaryText = buildSingleSkillEffectSummary(effect);
    if (['直接伤害', '多段伤害', '持续伤害', '延迟爆发'].includes(mechanism) || effect.威力倍率) {
      usable.push({
        target,
        type: 'damage',
        description: effect.描述 || summaryText || '使用后对目标造成伤害',
        value: { 威力倍率: effect.威力倍率 || 0, 伤害类型: effect.伤害类型 || '无', 穿透修饰: effect.穿透修饰 || 0 },
      });
      return;
    }
    if (mechanism === '护盾' || effect.护盾值) {
      usable.push({
        target,
        type: 'shield',
        description: effect.描述 || summaryText || '使用后生成护盾',
        value: effect.护盾值 || 0,
      });
      return;
    }
    if (mechanism === '修炼增益') {
      const 持续回合 = Math.max(1, Number(effect.持续回合 || effect.持续 || 6));
      const 持续tick = Math.max(6, Math.round(Number(effect.持续tick || 持续回合 * 6)));
      const 修炼倍率 = Math.max(1.01, Number(effect.修炼速度倍率 || effect.修炼倍率 || effect.训练倍率 || 1.2));
      usable.push({
        target,
        type: 'buff',
        description: effect.描述 || summaryText || '使用后提升修炼速度',
        value: {
          持续: 持续回合,
          持续tick,
          修炼速度倍率: Number(修炼倍率.toFixed(4)),
          修炼倍率说明: String(effect.修炼倍率说明 || '魂技机制:修炼增益'),
        },
      });
      return;
    }
    if (
      [
        '属性变化',
        '持续恢复',
        '消耗提高',
        '消耗降低',
        '前摇拉长',
        '前摇缩短',
        '掌控修正',
        '速度修正',
      ].includes(mechanism)
    ) {
      const property = String(effect.属性 || '').trim();
      const action = String(effect.动作 || mechanism).trim();
      const value = Number(effect.数值 || 0);
      const duration = getSkillEffectDuration(effect);
      if (['vit', 'sp', 'men'].includes(property) && (action === '加值' || mechanism === '持续恢复')) {
        usable.push({
          target,
          type: 'heal',
          description: effect.描述 || summaryText || '使用后恢复目标状态',
          value: {
            属性: property,
            动作: action || (mechanism === '持续恢复' ? '持续恢复' : '加值'),
            数值: value,
            持续: duration,
          },
        });
        return;
      }
      usable.push({
        target,
        type: /倍率压制|消耗提高|前摇拉长/.test(action || mechanism) ? 'debuff' : 'buff',
        description: effect.描述 || summaryText || mechanism,
        value: {
          属性: property,
          动作: action,
          数值: value,
          持续: duration,
          触发: String(effect.触发 || '').trim(),
        },
      });
      return;
    }
    const stateValue = {};
    if (effect.面板修改比例 && typeof effect.面板修改比例 === 'object') stateValue.statMods = effect.面板修改比例;
    if (effect.stat_mods && typeof effect.stat_mods === 'object') stateValue.statMods = effect.stat_mods;
    if (effect.计算层效果 && typeof effect.计算层效果 === 'object') stateValue.combatEffects = effect.计算层效果;
    if (effect.成功参数 && typeof effect.成功参数 === 'object') stateValue.success = effect.成功参数;
    if (effect.失败参数 && typeof effect.失败参数 === 'object') stateValue.fail = effect.失败参数;
    if (Number(effect.持续回合 || 0) > 0) stateValue.durationRounds = Number(effect.持续回合 || 0);
    if (Number(effect.清除层级 || 0) > 0) stateValue.cleanseLevel = Number(effect.清除层级 || 0);
    if (effect.agi_ratio !== undefined) stateValue.agiRatio = effect.agi_ratio;
    if (effect.heal_block_ratio !== undefined) stateValue.healBlockRatio = effect.heal_block_ratio;
    if (effect.反转类型 !== undefined) stateValue.invertType = effect.反转类型;
    if (Object.keys(stateValue).length) {
      usable.push({
        target,
        type: /禁疗|减速|硬控|催眠|沉默|标记|幻境|效果反转/.test(mechanism) ? 'debuff' : 'buff',
        description: effect.描述 || effect.特殊机制标识 || summaryText || mechanism,
        value: stateValue,
      });
      return;
    }
    if (effect.描述 || effect.特殊机制标识 || summaryText)
      usable.push({
        target,
        type: 'custom',
        description: effect.描述 || effect.特殊机制标识 || summaryText,
        value: effect.value ?? 0,
      });
  });
  if (!usable.length)
    usable.push({
      target: skillType === '食物系' ? '食用者' : normalizeConstructTarget(defaultTarget, '自身'),
      type: 'custom',
      description: '使用后触发对应魂技效果',
      value: 0,
    });
  return usable;
}

function buildSkillCombatProfile(blueprint, qualityCtx = {}) {
  const main = blueprint?.主机制大类 || '伤害类';
  const archetype = blueprint?.主机制原型 || '单体伤害';
  const attrs = Array.isArray(blueprint?.加成属性候选) ? blueprint.加成属性候选 : ['魂力'];
  const delivery = blueprint?.释放形态 || '直接生效';
  const secondary = Array.isArray(blueprint?.副机制) ? blueprint.副机制 : [];
  const mutation = Array.isArray(blueprint?.变异机制) ? blueprint.变异机制 : [];
  const quality = qualityCtx.quality || 'B级_普通';
  const ringIndex = Number(qualityCtx.ringIndex || 1);
  const type = blueprint?.系别来源 || qualityCtx.type || '强攻系';
  const fuelModel = blueprint?.燃料模型 || buildFuelModelByType(type, main);
  const targetModel = blueprint?.目标模型 || '敌方单体';
  const targetMap = {
    自身: '自身',
    友方单体: '己方/单体',
    友方群体: '己方/群体',
    敌方单体: '敌方/单体',
    敌方群体: '敌方/群体',
    全场: '全场',
  };

  const powerMap = { D级_粗糙: 40, C级_劣质: 60, B级_普通: 120, A级_优秀: 200, S级_极品: 300 };
  const castMap = { D级_粗糙: [0, 6], C级_劣质: [0, 8], B级_普通: [5, 15], A级_优秀: [15, 30], S级_极品: [30, 55] };
  const powerBase = Math.max(1, Math.round(powerMap[quality] || 120));
  const castRange = castMap[quality] || [5, 15];
  const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  const randomRangeRaw = (min, max) => (min === max ? min : min + Math.random() * (max - min));
  const grade = { D级_粗糙: 'C', C级_劣质: 'C', B级_普通: 'B', A级_优秀: 'A', S级_极品: 'S' }[quality] || 'B';
  const gradeFactor = { C: 1, B: 2, A: 3, S: 4 }[grade] || 2;
  const secondaryEffectScale = getSecondaryRingScale(ringIndex);
  const secondaryDurationScale = Math.max(0.7, secondaryEffectScale);
  const randomInRange = table => {
    const [min, max] = table?.[grade] || table?.C || table?.B || [1, 1];
    if (min === max) return min;
    return Number((min + Math.random() * (max - min)).toFixed(2));
  };
  const pickStatKey = (directions = []) => {
    const ordered = Array.isArray(directions) ? directions : [];
    if (ordered.includes('力量')) return 'str';
    if (ordered.includes('防御')) return 'def';
    if (ordered.includes('敏捷')) return 'agi';
    if (ordered.includes('精神力')) return 'men_max';
    if (ordered.includes('魂力')) return 'sp_max';
    return 'str';
  };
  const pickStatKeys = (directions = [], count = 2) => {
    const map = { 力量: 'str', 防御: 'def', 敏捷: 'agi', 精神力: 'men_max', 魂力: 'sp_max' };
    const keys = directions.map(d => map[d]).filter(Boolean);
    return Array.from(new Set(keys)).slice(0, count);
  };

  const 战斗 = {
    技能类型: '输出',
    目标模型: normalizeSkillTargetModel(targetModel, '敌方单体'),
    目标修饰: [],
    结算策略: '单目标独立',
    对象: targetMap[targetModel] || '敌方/单体',
    cast_time: randInt(castRange[0], castRange[1]),
    消耗: '无',
    仲裁逻辑: {
      瞬间交锋模块: { 基础威力倍率: 0, 伤害类型: '无', 穿透修饰: 0, 护盾绝对值: 0, 瞬间恢复比例: 0 },
      状态挂载模块: {
        状态名称: '无',
        持续回合: 0,
        面板修改比例: { str: 1.0, def: 1.0, agi: 1.0, men_max: 1.0, sp_max: 1.0 },
        特殊机制标识: '无',
        持续真伤dot: 0,
        计算层效果: {
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
          stealth_level: 0,
          bonus_true_damage_ratio: 0,
          life_steal_ratio: 0,
          cost_ratio: 1.0,
          windup_ratio: 1.0,
          mastery_ratio: 1.0,
          speed_ratio: 1.0,
        },
      },
      召唤与场地模块: { 实体名称: '无', 持续回合: 0, 继承属性比例: 0, 核心机制描述: '无' },
    },
  };

  const clash = 战斗.仲裁逻辑.瞬间交锋模块;
  const state = 战斗.仲裁逻辑.状态挂载模块;
  const field = 战斗.仲裁逻辑.召唤与场地模块;
  战斗.目标模型 = normalizeSkillTargetModel(targetModel, '敌方单体');
  战斗.目标修饰 = buildGeneratedSkillTargetModifiers(战斗.目标模型, archetype, secondary, mutation);
  战斗.结算策略 = getSkillTargetResolutionStrategy(战斗.目标模型);
  战斗.对象 = mapSkillTargetModelToCombatTarget(战斗.目标模型);
  const scaleStatMods = factor => {
    ['str', 'def', 'agi', 'men_max', 'sp_max'].forEach(k => {
      const value = state.面板修改比例[k];
      if (value !== undefined && value !== 1.0) {
        state.面板修改比例[k] = Number((1 + (value - 1) * factor).toFixed(2));
      }
    });
  };
  const targetFactor = (() => {
    if (['伤害类'].includes(main)) {
      if (targetModel === '敌方群体') return Number(randomRangeRaw(0.6, 0.75).toFixed(2));
      if (targetModel === '全场') return Number(randomRangeRaw(0.4, 0.55).toFixed(2));
      return 1;
    }
    if (['控制类', '削弱类'].includes(main)) {
      if (targetModel === '敌方群体') return Number(randomRangeRaw(0.7, 0.85).toFixed(2));
      if (targetModel === '全场') return Number(randomRangeRaw(0.5, 0.7).toFixed(2));
      return 1;
    }
    if (['增益类', '回复类'].includes(main)) {
      if (targetModel === '友方群体') return Number(randomRangeRaw(0.65, 0.8).toFixed(2));
      if (targetModel === '全场') return Number(randomRangeRaw(0.45, 0.6).toFixed(2));
      return 1;
    }
    if (['防御类'].includes(main)) {
      if (targetModel === '友方单体') return Number(randomRangeRaw(0.9, 1.0).toFixed(2));
      if (targetModel === '友方群体') return Number(randomRangeRaw(0.6, 0.75).toFixed(2));
      if (targetModel === '全场') return Number(randomRangeRaw(0.45, 0.6).toFixed(2));
      return 1;
    }
    return 1;
  })();

  const getDamageType = () => {
    if (type === '精神系') return '纯精神冲击';
    if (type === '食物系') return '异常/毒素/爆炸';
    if (type === '控制系') return '能量AOE';
    return '物理近战';
  };

  if (main === '伤害类') {
    战斗.技能类型 = '输出';
    clash.基础威力倍率 = Math.round(powerBase * targetFactor);
    clash.伤害类型 = getDamageType();
    if (archetype === '多段伤害') clash.基础威力倍率 = Math.round(powerBase * 0.85);
    if (archetype === '延迟爆发') {
      战斗.cast_time += 10;
      state.状态名称 = '蓄势标记';
      state.持续回合 = 1;
    }
    if (archetype === '持续伤害') {
      state.状态名称 = '持续创伤';
      state.持续回合 = 3;
      state.持续真伤dot = Math.round(powerBase * 0.4 * targetFactor);
      state.计算层效果.dot_damage = state.持续真伤dot;
    }
  } else if (main === '控制类') {
    战斗.技能类型 = '控制';
    state.状态名称 = archetype;
    state.持续回合 = ['硬控', '位移限制'].includes(archetype) ? 1 : 2;
    state.特殊机制标识 = archetype === '硬控' ? '硬控' : archetype;
    if (archetype === '软控') {
      state.计算层效果.reaction_penalty = Number(
        randomInRange({ C: [0.05, 0.08], B: [0.08, 0.12], A: [0.12, 0.18], S: [0.18, 0.25] }).toFixed(2),
      );
      state.计算层效果.cast_speed_penalty = Number(
        randomInRange({ C: [0.15, 0.25], B: [0.25, 0.4], A: [0.4, 0.6], S: [0.6, 0.9] }).toFixed(2),
      );
      state.计算层效果.dodge_penalty = Number(
        randomInRange({ C: [0.03, 0.05], B: [0.05, 0.08], A: [0.08, 0.12], S: [0.12, 0.18] }).toFixed(2),
      );
    }
    if (archetype === '位移限制') {
      state.计算层效果.reaction_penalty = Number(
        randomInRange({ C: [0.05, 0.08], B: [0.08, 0.12], A: [0.12, 0.18], S: [0.18, 0.25] }).toFixed(2),
      );
      state.计算层效果.dodge_penalty = Number(
        randomInRange({ C: [0.05, 0.08], B: [0.08, 0.12], A: [0.12, 0.18], S: [0.18, 0.25] }).toFixed(2),
      );
      state.计算层效果.lock_level = { C: 1, B: 1, A: 2, S: 2 }[grade] || 1;
    }
    if (archetype === '节奏打断') {
      state.特殊机制标识 = '打断';
      state.计算层效果.interrupt_bonus = 1.0;
      state.计算层效果.cast_speed_penalty = Number(
        randomInRange({ C: [0.1, 0.2], B: [0.2, 0.35], A: [0.35, 0.55], S: [0.55, 0.8] }).toFixed(2),
      );
      state.计算层效果.windup_ratio = Number((1 + (state.计算层效果.cast_speed_penalty || 0)).toFixed(2));
    }
    if (archetype === '硬控') state.计算层效果.skip_turn = true;
  } else if (main === '削弱类') {
    战斗.技能类型 = '控制';
    state.状态名称 = archetype;
    state.持续回合 = { C: 1, B: 2, A: 3, S: 4 }[grade] || 2;
    if (archetype === '单属性削弱') {
      state.面板修改比例[pickStatKey(attrs)] = randomInRange({
        C: [0.88, 0.92],
        B: [0.8, 0.88],
        A: [0.7, 0.8],
        S: [0.55, 0.7],
      });
    }
    if (archetype === '多属性削弱') {
      const keys = pickStatKeys(attrs, 2);
      keys.forEach(k => {
        state.面板修改比例[k] = randomInRange({ C: [0.92, 0.95], B: [0.86, 0.9], A: [0.78, 0.84], S: [0.68, 0.76] });
      });
    }
    if (archetype === '禁疗') {
      state.特殊机制标识 = '禁疗';
      state.计算层效果.heal_block_ratio = Number(
        randomInRange({ C: [0.2, 0.3], B: [0.35, 0.5], A: [0.5, 0.7], S: [0.75, 1.0] }).toFixed(2),
      );
    }
    if (archetype === '消耗提高') {
      const ratio = randomInRange({ C: [1.08, 1.15], B: [1.15, 1.25], A: [1.25, 1.4], S: [1.4, 1.6] });
      state.计算层效果.cost_ratio = Number(ratio.toFixed(2));
      state.计算层效果.resource_block_ratio = Number((ratio - 1).toFixed(2));
    }
    if (archetype === '前摇拉长') {
      const ratio = randomInRange({ C: [1.08, 1.14], B: [1.14, 1.24], A: [1.24, 1.38], S: [1.38, 1.55] });
      state.计算层效果.windup_ratio = Number(ratio.toFixed(2));
      state.计算层效果.cast_speed_penalty = Number((ratio - 1).toFixed(2));
    }
    if (archetype === '掌控压制') {
      const ratio = randomInRange({ C: [0.92, 0.96], B: [0.84, 0.92], A: [0.74, 0.84], S: [0.62, 0.76] });
      state.计算层效果.mastery_ratio = Number(ratio.toFixed(2));
      state.计算层效果.control_success_penalty = Number((1 - ratio).toFixed(2));
    }
    if (targetFactor < 1) state.持续回合 = Math.max(1, Math.round(state.持续回合 * targetFactor));
    scaleStatMods(targetFactor);
  } else if (main === '增益类') {
    战斗.技能类型 = '辅助';
    state.状态名称 = archetype;
    state.持续回合 = { C: 2, B: 3, A: 3, S: 4 }[grade] || 3;
    if (archetype === '单属性增益') {
      const key = pickStatKey(attrs);
      state.面板修改比例[key] = randomInRange({ C: [1.08, 1.12], B: [1.15, 1.28], A: [1.3, 1.55], S: [1.6, 2.0] });
    } else if (archetype === '多属性增益') {
      const keys = pickStatKeys(attrs, 2);
      const ratio = randomInRange({ C: [1.05, 1.08], B: [1.1, 1.18], A: [1.18, 1.32], S: [1.3, 1.5] });
      keys.forEach(k => {
        state.面板修改比例[k] = ratio;
      });
    } else if (archetype === '全属性增益') {
      const ratio = randomInRange({ C: [1.02, 1.05], B: [1.06, 1.12], A: [1.12, 1.22], S: [1.22, 1.38] });
      ['str', 'def', 'agi', 'men_max', 'sp_max'].forEach(k => {
        state.面板修改比例[k] = ratio;
      });
    } else if (archetype === '消耗降低') {
      const ratio = randomInRange({ C: [0.94, 0.97], B: [0.88, 0.95], A: [0.8, 0.9], S: [0.72, 0.84] });
      state.计算层效果.cost_ratio = Number(ratio.toFixed(2));
    } else if (archetype === '前摇缩短') {
      const ratio = randomInRange({ C: [0.94, 0.97], B: [0.88, 0.94], A: [0.8, 0.9], S: [0.72, 0.84] });
      state.计算层效果.windup_ratio = Number(ratio.toFixed(2));
      state.计算层效果.cast_speed_bonus = Number((1 - ratio).toFixed(2));
    } else if (archetype === '掌控提升') {
      const ratio = randomInRange({ C: [1.05, 1.08], B: [1.08, 1.15], A: [1.15, 1.25], S: [1.25, 1.4] });
      state.计算层效果.mastery_ratio = Number(ratio.toFixed(2));
      state.计算层效果.control_success_bonus = Number((ratio - 1).toFixed(2));
    } else if (archetype === '速度提升') {
      const ratio = randomInRange({ C: [1.05, 1.08], B: [1.08, 1.14], A: [1.14, 1.22], S: [1.22, 1.35] });
      const bonus = Number((ratio - 1).toFixed(2));
      state.计算层效果.speed_ratio = Number(ratio.toFixed(2));
      state.计算层效果.attacker_speed_bonus = bonus;
      state.计算层效果.reaction_bonus = Number((bonus * 0.9).toFixed(2));
      state.计算层效果.dodge_bonus = Number((bonus * 0.75).toFixed(2));
    }
    if (targetFactor < 1) state.持续回合 = Math.max(1, Math.round(state.持续回合 * Math.max(0.8, targetFactor)));
    scaleStatMods(targetFactor);
  } else if (main === '防御类') {
    战斗.技能类型 = '防御';
    state.状态名称 = archetype;
    state.持续回合 = { C: 1, B: 2, A: 2, S: 3 }[grade] || 2;
    if (archetype === '护盾') {
      const mult = randomInRange({ C: [10, 15], B: [15, 22], A: [22, 32], S: [30, 45] });
      clash.护盾绝对值 = Math.round(powerBase * mult * targetFactor);
    }
    if (archetype === '减伤') {
      const reduce = randomInRange({ C: [0.1, 0.15], B: [0.15, 0.25], A: [0.25, 0.4], S: [0.4, 0.6] });
      state.特殊机制标识 = `减伤:${Math.round(reduce * 100 * targetFactor)}%`;
      state.计算层效果.control_resist_mult = Number((1 + reduce * targetFactor).toFixed(2));
    }
    if (archetype === '格挡/抵消') state.特殊机制标识 = gradeFactor >= 3 ? '抵消一次完整技能' : '抵消一次攻击';
    if (archetype === '霸体') {
      state.特殊机制标识 = '霸体';
      state.计算层效果.damage_reduction = Number(
        randomInRange({ C: [0.08, 0.12], B: [0.12, 0.18], A: [0.18, 0.25], S: [0.25, 0.35] }).toFixed(2),
      );
    }
    if (archetype === '免死/锁血') {
      state.特殊机制标识 = '免死';
      state.计算层效果.min_hp_floor = 1;
      state.计算层效果.death_save_count = gradeFactor >= 4 ? 2 : 1;
    }
    if (archetype === '无敌金身') {
      state.持续回合 = Math.max(state.持续回合, { C: 1, B: 2, A: 3, S: 4 }[grade] || 2);
      const reduce = randomInRange({ C: [0.12, 0.16], B: [0.18, 0.24], A: [0.24, 0.34], S: [0.34, 0.45] });
      state.特殊机制标识 = '无敌金身/每日3次/神级以下免疫';
      state.计算层效果.invincible = true;
      state.计算层效果.super_armor = true;
      state.计算层效果.invincible_tier_threshold = 100;
      state.计算层效果.daily_trigger_limit = 3;
      state.计算层效果.damage_reduction = Number((reduce * Math.max(0.9, targetFactor)).toFixed(2));
    }
    if (archetype === '伤害反射') {
      state.持续回合 = Math.max(state.持续回合, { C: 1, B: 2, A: 3, S: 4 }[grade] || 2);
      const reflect = randomInRange({ C: [0.18, 0.26], B: [0.26, 0.36], A: [0.36, 0.5], S: [0.5, 0.65] });
      state.特殊机制标识 = `伤害反射:${Math.round(reflect * 100)}%`;
      state.计算层效果.damage_reflect_ratio = Number((reflect * Math.max(0.9, targetFactor)).toFixed(2));
      state.计算层效果.damage_reduction = Math.max(
        Number(state.计算层效果.damage_reduction || 0),
        Number((reflect * 0.35).toFixed(2)),
      );
    }
    if (archetype === '伤害分摊') {
      state.持续回合 = Math.max(state.持续回合, { C: 1, B: 2, A: 3, S: 4 }[grade] || 2);
      const share = randomInRange({ C: [0.24, 0.3], B: [0.32, 0.42], A: [0.42, 0.55], S: [0.55, 0.7] });
      const shareCount = grade === 'S' ? 3 : gradeFactor >= 2 ? 2 : 1;
      state.特殊机制标识 = `伤害分摊:${Math.round(share * 100)}%/${shareCount}人`;
      state.计算层效果.damage_share_ratio = Number((share * Math.max(0.9, targetFactor)).toFixed(2));
      state.计算层效果.damage_share_count = shareCount;
    }
    if (archetype === '替身抵消') {
      state.持续回合 = Math.max(state.持续回合, { C: 1, B: 2, A: 3, S: 4 }[grade] || 2);
      const substituteCount = grade === 'S' ? 3 : gradeFactor >= 2 ? 2 : 1;
      state.特殊机制标识 = `替身抵消:${substituteCount}次`;
      state.计算层效果.substitute_count = substituteCount;
      state.计算层效果.dodge_bonus = Math.max(
        Number(state.计算层效果.dodge_bonus || 0),
        Number(randomInRange({ C: [0.08, 0.12], B: [0.12, 0.18], A: [0.18, 0.26], S: [0.26, 0.36] }).toFixed(2)),
      );
    }
    if (archetype === '复苏') {
      state.持续回合 = Math.max(state.持续回合, { C: 2, B: 3, A: 4, S: 4 }[grade] || 3);
      const reviveRatio = randomInRange({ C: [0.22, 0.3], B: [0.3, 0.4], A: [0.4, 0.52], S: [0.52, 0.65] });
      state.特殊机制标识 = `复苏:${Math.round(reviveRatio * 100)}%`;
      state.计算层效果.revive_count = grade === 'S' ? 2 : 1;
      state.计算层效果.revive_heal_ratio = Number((reviveRatio * Math.max(0.9, targetFactor)).toFixed(2));
    }
    if (targetFactor < 1) state.持续回合 = Math.max(1, Math.round(state.持续回合 * Math.max(0.8, targetFactor)));
  } else if (main === '回复类') {
    战斗.技能类型 = '辅助';
    if (archetype === '体力恢复')
      clash.瞬间恢复比例 = Number(
        (randomInRange({ C: [8, 12], B: [12, 20], A: [20, 35], S: [35, 60] }) * targetFactor).toFixed(2),
      );
    if (archetype === '魂力恢复') {
      const restore = Math.round(randomInRange({ C: [5, 8], B: [8, 12], A: [12, 18], S: [18, 25] }) * targetFactor);
      state.特殊机制标识 = `魂力恢复:${restore}%`;
      state.计算层效果.sp_gain_ratio = Number((restore / 100).toFixed(2));
    }
    if (archetype === '精神恢复') {
      const restore = Math.round(randomInRange({ C: [5, 8], B: [8, 12], A: [12, 18], S: [18, 25] }) * targetFactor);
      state.特殊机制标识 = `精神恢复:${restore}%`;
      state.计算层效果.men_gain_ratio = Number((restore / 100).toFixed(2));
    }
    if (archetype === '持续恢复') {
      state.状态名称 = '持续恢复';
      state.持续回合 = { C: 2, B: 3, A: 3, S: 4 }[grade] || 3;
      state.持续真伤dot = 0;
      clash.瞬间恢复比例 = Number(
        (randomInRange({ C: [3, 5], B: [5, 7], A: [7, 10], S: [10, 15] }) * targetFactor).toFixed(2),
      );
    }
    if (archetype === '净化/解控') {
      const cleanse =
        { C: '净化1个常规负面', B: '净化1-2个常规负面', A: '净化2个或1个较强负面', S: '净化多个或高层级负面' }[grade] ||
        '净化1个常规负面';
      state.特殊机制标识 = `净化/解控/${cleanse}`;
    }
    if (targetFactor < 1)
      state.持续回合 = Math.max(1, Math.round((state.持续回合 || 0) * Math.max(0.8, targetFactor))) || state.持续回合;
  } else if (main === '感知/认知类') {
    战斗.技能类型 = '辅助';
    state.状态名称 = archetype;
    state.持续回合 = 2;
    if (archetype === '感知干扰') {
      state.特殊机制标识 = '感知干扰';
      state.计算层效果.hit_penalty = Number(
        randomInRange({ C: [0.05, 0.1], B: [0.1, 0.16], A: [0.16, 0.24], S: [0.24, 0.35] }).toFixed(2),
      );
      state.计算层效果.reaction_penalty = Number(
        randomInRange({ C: [0.04, 0.08], B: [0.08, 0.12], A: [0.12, 0.2], S: [0.2, 0.28] }).toFixed(2),
      );
      if (gradeFactor >= 3) {
        state.计算层效果.cast_speed_penalty = Number(
          randomInRange({ A: [0.08, 0.14], S: [0.14, 0.22] }).toFixed(2),
        );
      }
    }
    if (archetype === '标记锁定') {
      state.特殊机制标识 = '锁定';
      state.计算层效果.lock_level = { C: 1, B: 1, A: 2, S: 3 }[grade] || 1;
      state.计算层效果.hit_bonus = Number(
        randomInRange({ C: [0.05, 0.1], B: [0.1, 0.15], A: [0.15, 0.25], S: [0.25, 0.35] }).toFixed(2),
      );
      state.计算层效果.dodge_penalty = Number(
        randomInRange({ C: [0.05, 0.08], B: [0.08, 0.12], A: [0.12, 0.18], S: [0.18, 0.25] }).toFixed(2),
      );
    }
    if (archetype === '共享视野') {
      state.特殊机制标识 = '共享视野';
      state.计算层效果.reaction_bonus = Number(
        randomInRange({ C: [0.05, 0.1], B: [0.1, 0.15], A: [0.15, 0.25], S: [0.25, 0.35] }).toFixed(2),
      );
      state.计算层效果.hit_bonus = Number(
        randomInRange({ C: [0.05, 0.1], B: [0.1, 0.15], A: [0.15, 0.25], S: [0.25, 0.35] }).toFixed(2),
      );
      state.计算层效果.lock_level = { C: 1, B: 1, A: 2, S: 2 }[grade] || 1;
    }
    if (archetype === '幻境') {
      state.特殊机制标识 = '幻境';
      const generalRatio = randomInRange({ C: [0.93, 0.97], B: [0.88, 0.94], A: [0.8, 0.9], S: [0.68, 0.85] });
      const agiRatio = randomInRange({ C: [0.9, 0.95], B: [0.82, 0.9], A: [0.72, 0.82], S: [0.6, 0.75] });
      state.面板修改比例.str = generalRatio;
      state.面板修改比例.def = generalRatio;
      state.面板修改比例.men_max = generalRatio;
      state.面板修改比例.agi = agiRatio;
      state.计算层效果.reaction_penalty = Number(
        randomInRange({ C: [0.05, 0.1], B: [0.1, 0.2], A: [0.2, 0.35], S: [0.35, 0.5] }).toFixed(2),
      );
      if (gradeFactor >= 3) {
        state.计算层效果.skip_turn = true;
        state.计算层效果.cannot_react = true;
      }
    }
    if (archetype === '催眠') {
      state.特殊机制标识 = '硬控/催眠';
      state.计算层效果.skip_turn = true;
      state.计算层效果.cannot_react = true;
    }
    if (archetype === '认知扭曲') {
      state.特殊机制标识 = '认知扭曲';
      state.计算层效果.hit_penalty = Number(
        randomInRange({ C: [0.08, 0.12], B: [0.12, 0.18], A: [0.18, 0.26], S: [0.26, 0.36] }).toFixed(2),
      );
      state.计算层效果.control_success_penalty = Number(
        randomInRange({ C: [0.05, 0.08], B: [0.08, 0.12], A: [0.12, 0.18], S: [0.18, 0.26] }).toFixed(2),
      );
      state.计算层效果.cast_speed_penalty = Number(
        randomInRange({ C: [0.04, 0.08], B: [0.08, 0.12], A: [0.12, 0.18], S: [0.18, 0.24] }).toFixed(2),
      );
      state.计算层效果.random_target_rate = Number(
        randomInRange({ C: [0.12, 0.2], B: [0.2, 0.3], A: [0.3, 0.42], S: [0.42, 0.56] }).toFixed(2),
      );
    }
  } else if (main === '位移类') {
    战斗.技能类型 = '辅助';
    state.状态名称 = archetype;
    state.持续回合 = ['位移交换'].includes(archetype) ? 2 : 1;
    state.特殊机制标识 = archetype;
    if (archetype === '自身位移') {
      state.计算层效果.dodge_bonus = Number(
        randomInRange({ C: [0.05, 0.08], B: [0.08, 0.12], A: [0.12, 0.18], S: [0.18, 0.25] }).toFixed(2),
      );
      state.计算层效果.attacker_speed_bonus = Number(
        randomInRange({ C: [0.03, 0.05], B: [0.05, 0.08], A: [0.08, 0.12], S: [0.12, 0.18] }).toFixed(2),
      );
      state.计算层效果.reaction_bonus = Number(
        randomInRange({ C: [0.03, 0.05], B: [0.05, 0.08], A: [0.08, 0.12], S: [0.12, 0.18] }).toFixed(2),
      );
    }
    if (archetype === '强制位移') {
      state.计算层效果.dodge_penalty = Number(
        randomInRange({ C: [0.05, 0.08], B: [0.08, 0.12], A: [0.12, 0.18], S: [0.18, 0.25] }).toFixed(2),
      );
      state.计算层效果.reaction_penalty = Number(
        randomInRange({ C: [0.03, 0.05], B: [0.05, 0.08], A: [0.08, 0.12], S: [0.12, 0.18] }).toFixed(2),
      );
      state.计算层效果.lock_level = { C: 1, B: 1, A: 2, S: 2 }[grade] || 1;
    }
    if (archetype === '位移交换') {
      state.计算层效果.dodge_penalty = Number(
        randomInRange({ C: [0.08, 0.12], B: [0.12, 0.18], A: [0.18, 0.25], S: [0.25, 0.35] }).toFixed(2),
      );
      state.计算层效果.reaction_penalty = Number(
        randomInRange({ C: [0.05, 0.08], B: [0.08, 0.12], A: [0.12, 0.18], S: [0.18, 0.25] }).toFixed(2),
      );
      state.计算层效果.lock_level = { C: 1, B: 2, A: 2, S: 3 }[grade] || 1;
    }
    if (archetype === '追击位移') {
      state.计算层效果.attacker_speed_bonus = Number(
        randomInRange({ C: [0.05, 0.08], B: [0.08, 0.12], A: [0.12, 0.18], S: [0.18, 0.25] }).toFixed(2),
      );
      state.计算层效果.hit_bonus = Number(
        randomInRange({ C: [0.05, 0.08], B: [0.08, 0.12], A: [0.12, 0.18], S: [0.18, 0.25] }).toFixed(2),
      );
      state.计算层效果.final_damage_mult = Number(
        randomInRange({ C: [1.05, 1.12], B: [1.12, 1.2], A: [1.2, 1.3], S: [1.3, 1.45] }).toFixed(2),
      );
    }
    if (archetype === '脱离位移') {
      state.计算层效果.dodge_bonus = Number(
        randomInRange({ C: [0.08, 0.12], B: [0.12, 0.18], A: [0.18, 0.25], S: [0.25, 0.35] }).toFixed(2),
      );
      state.计算层效果.cast_speed_bonus = Number(
        randomInRange({ C: [0.03, 0.05], B: [0.05, 0.08], A: [0.08, 0.12], S: [0.12, 0.18] }).toFixed(2),
      );
      state.计算层效果.reaction_bonus = Number(
        randomInRange({ C: [0.05, 0.08], B: [0.08, 0.12], A: [0.12, 0.18], S: [0.18, 0.25] }).toFixed(2),
      );
    }
  } else if (main === '特殊规则类') {
    战斗.技能类型 = '辅助';
    state.状态名称 = archetype;
    state.持续回合 = 2;
    state.特殊机制标识 = archetype;
    if (archetype === '强制绑定/锁定') {
      战斗.技能类型 = '控制';
      state.持续回合 = { C: 1, B: 2, A: 2, S: 3 }[grade] || 2;
      state.计算层效果.lock_level = { C: 1, B: 2, A: 2, S: 3 }[grade] || 1;
      state.计算层效果.dodge_penalty = Number(
        randomInRange({ C: [0.05, 0.08], B: [0.08, 0.12], A: [0.12, 0.18], S: [0.18, 0.25] }).toFixed(2),
      );
      state.计算层效果.reaction_penalty = Number(
        randomInRange({ C: [0.05, 0.08], B: [0.08, 0.12], A: [0.12, 0.18], S: [0.18, 0.25] }).toFixed(2),
      );
    }
    if (archetype === '反制') {
      战斗.技能类型 = '防御';
      state.持续回合 = { C: 1, B: 2, A: 2, S: 3 }[grade] || 2;
      state.计算层效果.counter_attack_ratio = Number(
        randomInRange({ C: [0.35, 0.5], B: [0.5, 0.75], A: [0.75, 1.0], S: [1.0, 1.25] }).toFixed(2),
      );
      state.计算层效果.damage_reduction = Number(
        randomInRange({ C: [0.08, 0.12], B: [0.12, 0.18], A: [0.18, 0.25], S: [0.25, 0.35] }).toFixed(2),
      );
    }
    if (archetype === '条件触发') {
      战斗.技能类型 = '输出';
      state.持续回合 = 0;
      state.计算层效果.final_damage_mult = Number(
        randomInRange({ C: [1.1, 1.18], B: [1.18, 1.28], A: [1.28, 1.42], S: [1.42, 1.6] }).toFixed(2),
      );
      state.计算层效果.hit_bonus = Number(
        randomInRange({ C: [0.03, 0.05], B: [0.05, 0.08], A: [0.08, 0.12], S: [0.12, 0.18] }).toFixed(2),
      );
    }
    if (archetype === '转化') {
      战斗.技能类型 = '输出';
      state.持续回合 = 0;
      clash.基础威力倍率 = Math.max(
        Number(clash.基础威力倍率 || 0),
        Math.round(powerBase * randomInRange({ C: [0.55, 0.75], B: [0.75, 1.0], A: [1.0, 1.25], S: [1.25, 1.55] })),
      );
      clash.伤害类型 = clash.伤害类型 === '无' ? getDamageType() : clash.伤害类型;
      state.计算层效果.life_steal_ratio = Number(
        randomInRange({ C: [0.08, 0.12], B: [0.12, 0.18], A: [0.18, 0.25], S: [0.25, 0.35] }).toFixed(2),
      );
      state.特殊机制标识 = [state.特殊机制标识, '伤害转回复'].filter(v => v && v !== '无').join('/') || '伤害转回复';
    }
    if (archetype === '吞噬') {
      战斗.技能类型 = '控制';
      state.持续回合 = 0;
      state.特殊机制标识 = [state.特殊机制标识, '吞噬'].filter(v => v && v !== '无').join('/') || '吞噬';
    }
    if (archetype === '能力共享') {
      战斗.技能类型 = '辅助';
      state.持续回合 = 0;
      state.特殊机制标识 = [state.特殊机制标识, '能力共享'].filter(v => v && v !== '无').join('/') || '能力共享';
    }
    if (archetype === '机制抹消') {
      战斗.技能类型 = '控制';
      state.持续回合 = { C: 1, B: 2, A: 2, S: 3 }[grade] || 2;
      state.特殊机制标识 = [state.特殊机制标识, '机制抹消'].filter(v => v && v !== '无').join('/') || '机制抹消';
    }
    if (archetype === '复制') {
      战斗.技能类型 = '辅助';
      state.持续回合 = { C: 1, B: 2, A: 2, S: 3 }[grade] || 2;
      state.特殊机制标识 = [state.特殊机制标识, '复制增益'].filter(v => v && v !== '无').join('/') || '复制增益';
    }
    if (archetype === '分身') {
      战斗.技能类型 = '辅助';
      战斗.对象 = '自身';
      const cloneType =
        type === '精神系' || type === '控制系'
          ? '精神力分身'
          : type === '敏攻系' || type === '强攻系'
            ? '物理分身'
            : gradeFactor >= 3
              ? '精神力分身'
              : '物理分身';
      const cloneCount = Math.min(4, Math.max(1, gradeFactor >= 4 ? 3 : gradeFactor >= 2 ? 2 : 1));
      const stealth = randomInRange({ C: [0.25, 0.38], B: [0.38, 0.52], A: [0.52, 0.68], S: [0.68, 0.85] });
      const inheritRatio = randomInRange({ C: [0.35, 0.45], B: [0.45, 0.6], A: [0.6, 0.78], S: [0.78, 0.9] });
      state.状态名称 = cloneType;
      state.持续回合 = { C: 1, B: 2, A: 2, S: 3 }[grade] || 2;
      state.特殊机制标识 = [state.特殊机制标识, '分身'].filter(v => v && v !== '无').join('/') || '分身';
      state.分身元数据 = {
        分身类型: cloneType,
        分身数量: cloneCount,
        隐蔽度: Number(stealth.toFixed(2)),
        实力继承比例: Number(inheritRatio.toFixed(2)),
      };
      if (cloneType === '精神力分身') {
        state.计算层效果.reaction_bonus = Number(Math.min(0.28, 0.04 + stealth * 0.16 + inheritRatio * 0.08).toFixed(2));
        state.计算层效果.hit_bonus = Number(Math.min(0.3, 0.04 + inheritRatio * 0.15 + cloneCount * 0.03).toFixed(2));
        state.计算层效果.lock_level = Math.min(3, Math.max(1, Math.round(1 + inheritRatio * 1.2 + stealth * 0.8)));
        state.计算层效果.damage_reduction = Number(Math.min(0.18, 0.02 + stealth * 0.05 + cloneCount * 0.01).toFixed(2));
      } else {
        state.计算层效果.dodge_bonus = Number(Math.min(0.35, 0.05 + stealth * 0.18 + inheritRatio * 0.08 + cloneCount * 0.03).toFixed(2));
        state.计算层效果.attacker_speed_bonus = Number(Math.min(0.24, 0.03 + inheritRatio * 0.12 + cloneCount * 0.02).toFixed(2));
        state.计算层效果.damage_reduction = Number(Math.min(0.22, 0.02 + stealth * 0.08 + cloneCount * 0.015).toFixed(2));
        state.计算层效果.final_damage_mult = Number(Math.min(1.28, 1 + inheritRatio * 0.12 + Math.max(0, cloneCount - 1) * 0.04).toFixed(2));
      }
    }
    if (archetype === '状态交换') {
      战斗.技能类型 = '辅助';
      state.持续回合 = 0;
      state.特殊机制标识 = [state.特殊机制标识, '状态交换'].filter(v => v && v !== '无').join('/') || '状态交换';
    }
    if (archetype === '规则改写') {
      战斗.技能类型 = '输出';
      state.持续回合 = 0;
      clash.基础威力倍率 = Math.max(
        Number(clash.基础威力倍率 || 0),
        Math.round(powerBase * randomInRange({ C: [0.45, 0.65], B: [0.65, 0.9], A: [0.9, 1.2], S: [1.2, 1.5] })),
      );
      clash.伤害类型 = clash.伤害类型 === '无' ? getDamageType() : clash.伤害类型;
      const rewriteFlags = ['高波动随机值'];
      if (gradeFactor >= 2) rewriteFlags.push('随机目标');
      if (gradeFactor >= 4) rewriteFlags.push('自身也受影响');
      state.特殊机制标识 = [state.特殊机制标识, ...rewriteFlags].filter(v => v && v !== '无').join('/') || '规则改写';
    }
  }

  if (secondary.includes('穿透')) {
    const pierceBase = quality === 'S级_极品' ? 50 : quality === 'A级_优秀' ? 35 : quality === 'B级_普通' ? 20 : 10;
    clash.穿透修饰 = Math.max(clash.穿透修饰, Math.max(1, Math.round(pierceBase * secondaryEffectScale)));
  }
  if (secondary.includes('吸血')) {
    const leechBase = quality === 'S级_极品' ? 35 : quality === 'A级_优秀' ? 20 : quality === 'B级_普通' ? 10 : 5;
    clash.瞬间恢复比例 = Math.max(clash.瞬间恢复比例, Math.max(1, Math.round(leechBase * secondaryEffectScale)));
  }
  if (secondary.includes('打断'))
    state.特殊机制标识 = String(state.特殊机制标识 || '无').includes('打断')
      ? state.特殊机制标识
      : [state.特殊机制标识, '打断'].filter(v => v && v !== '无').join('/') || '打断';
  if (secondary.includes('流血DOT')) {
    state.状态名称 = state.状态名称 === '无' ? '流血' : state.状态名称;
    state.持续回合 = Math.max(state.持续回合, 2);
    state.持续真伤dot = Math.max(state.持续真伤dot, Math.max(1, Math.round(powerBase * 0.18 * secondaryEffectScale)));
    state.计算层效果.dot_damage = Math.max(Number(state.计算层效果.dot_damage || 0), Number(state.持续真伤dot || 0));
  }
  if (secondary.includes('小护盾'))
    clash.护盾绝对值 = Math.max(clash.护盾绝对值, Math.max(1, Math.round(powerBase * 1.2 * secondaryEffectScale)));
  if (secondary.includes('净化') || secondary.includes('解控'))
    state.特殊机制标识 = [state.特殊机制标识, '净化/解控'].filter(v => v && v !== '无').join('/') || '净化/解控';
  if (secondary.includes('斩杀补伤')) {
    const executeThreshold = { C: 15, B: 20, A: 25, S: 30 }[grade] || 20;
    const executeBonusBase =
      { C: 10, B: 15, A: Math.round(randomRangeRaw(20, 30)), S: Math.round(randomRangeRaw(30, 50)) }[grade] || 15;
    const executeBonus = Math.max(5, Math.round(executeBonusBase * secondaryEffectScale));
    state.特殊机制标识 = [state.特殊机制标识, `斩杀补伤:${executeThreshold}%/${executeBonus}%`]
      .filter(v => v && v !== '无')
      .join('/');
    state.计算层效果.final_damage_mult = Math.max(
      Number((1 + executeBonus / 100).toFixed(2)),
      state.计算层效果.final_damage_mult || 1.0,
    );
  }
  if (secondary.includes('反击'))
    state.特殊机制标识 = [state.特殊机制标识, gradeFactor >= 3 ? '受击反击(完整技能)' : '受击反击']
      .filter(v => v && v !== '无')
      .join('/');
  if (secondary.includes('沉默')) {
    state.状态名称 = state.状态名称 === '无' ? '沉默' : state.状态名称;
    state.持续回合 = Math.max(
      state.持续回合,
      Math.max(
        1,
        Math.round(
          ({ C: 1, B: Math.round(randomRangeRaw(1, 2)), A: 2, S: Math.round(randomRangeRaw(2, 3)) }[grade] || 1) *
            secondaryDurationScale,
        ),
      ),
    );
    state.特殊机制标识 = [state.特殊机制标识, '沉默'].filter(v => v && v !== '无').join('/');
  }
  if (secondary.includes('减速') || secondary.includes('迟缓')) {
    state.状态名称 = state.状态名称 === '无' ? (secondary.includes('迟缓') ? '迟缓' : '减速') : state.状态名称;
    state.持续回合 = Math.max(
      state.持续回合,
      Math.max(1, Math.round(({ C: 1, B: 2, A: 3, S: 3 }[grade] || 2) * secondaryDurationScale)),
    );
    state.面板修改比例.agi = Math.min(
      state.面板修改比例.agi,
      randomInRange({ C: [0.92, 0.96], B: [0.85, 0.92], A: [0.75, 0.85], S: [0.65, 0.78] }),
    );
  }
  if (secondary.includes('致盲')) {
    state.状态名称 = state.状态名称 === '无' ? '致盲' : state.状态名称;
    state.持续回合 = Math.max(
      state.持续回合,
      Math.max(1, Math.round(({ C: 1, B: 1, A: 2, S: 2 }[grade] || 1) * secondaryDurationScale)),
    );
    state.特殊机制标识 = [state.特殊机制标识, '致盲'].filter(v => v && v !== '无').join('/');
    state.计算层效果.blind = true;
  }
  if (secondary.includes('禁疗'))
    state.特殊机制标识 = [state.特殊机制标识, `禁疗:${{ C: 1, B: 2, A: 2, S: 3 }[grade] || 1}回合`]
      .filter(v => v && v !== '无')
      .join('/');
  if (secondary.includes('标记弱点')) {
    const weaknessDuration = Math.max(1, Math.round(({ C: 1, B: 2, A: 3, S: 4 }[grade] || 1) * secondaryDurationScale));
    const weaknessMult = Number(
      (1 + ({ C: 0.05, B: 0.08, A: 0.12, S: 0.18 }[grade] || 0.08) * secondaryEffectScale).toFixed(2),
    );
    const weaknessDodgePenalty = Number(
      (({ C: 0.05, B: 0.08, A: 0.12, S: 0.16 }[grade] || 0.08) * secondaryEffectScale).toFixed(2),
    );
    const weaknessLockLevel = Math.max(
      1,
      Math.round(({ C: 1, B: 1, A: 2, S: 2 }[grade] || 1) * secondaryDurationScale),
    );
    state.状态名称 = state.状态名称 === '无' ? '标记弱点' : state.状态名称;
    state.持续回合 = Math.max(state.持续回合, weaknessDuration);
    state.特殊机制标识 = [state.特殊机制标识, `标记弱点:${weaknessDuration}回合`]
      .filter(v => v && v !== '无')
      .join('/');
    state.计算层效果.final_damage_mult = Math.max(Number(state.计算层效果.final_damage_mult || 1), weaknessMult);
    state.计算层效果.dodge_penalty = Math.max(Number(state.计算层效果.dodge_penalty || 0), weaknessDodgePenalty);
    state.计算层效果.lock_level = Math.max(Number(state.计算层效果.lock_level || 0), weaknessLockLevel);
  }
  if (secondary.includes('共享视野'))
    state.特殊机制标识 = [state.特殊机制标识, `共享视野:${{ C: 1, B: 2, A: 3, S: 4 }[grade] || 1}回合`]
      .filter(v => v && v !== '无')
      .join('/');
  if (secondary.includes('目标锁定')) {
    const lockDuration = Math.max(1, Math.round(({ C: 1, B: 2, A: 2, S: 3 }[grade] || 1) * secondaryDurationScale));
    const lockHitBonus = Number(
      (({ C: 0.04, B: 0.07, A: 0.1, S: 0.14 }[grade] || 0.07) * secondaryEffectScale).toFixed(2),
    );
    const lockLevel = Math.max(1, Math.round(({ C: 1, B: 1, A: 2, S: 2 }[grade] || 1) * secondaryDurationScale));
    state.状态名称 = state.状态名称 === '无' ? '目标锁定' : state.状态名称;
    state.持续回合 = Math.max(state.持续回合, lockDuration);
    state.特殊机制标识 = [state.特殊机制标识, `目标锁定:${{ C: 1, B: 2, A: 2, S: 3 }[grade] || 1}回合`]
      .filter(v => v && v !== '无')
      .join('/');
    state.计算层效果.hit_bonus = Math.max(Number(state.计算层效果.hit_bonus || 0), lockHitBonus);
    state.计算层效果.lock_level = Math.max(Number(state.计算层效果.lock_level || 0), lockLevel);
  }
  if (secondary.includes('隐身')) {
    const stealthDuration = Math.max(1, Math.round(({ C: 1, B: 2, A: 2, S: 3 }[grade] || 1) * secondaryDurationScale));
    const stealthLevel = Number(
      (({ C: 0.18, B: 0.28, A: 0.4, S: 0.55 }[grade] || 0.28) * secondaryEffectScale).toFixed(2),
    );
    const dodgeBonus = Number(
      (({ C: 0.06, B: 0.1, A: 0.14, S: 0.2 }[grade] || 0.1) * secondaryEffectScale).toFixed(2),
    );
    const reactionBonus = Number(
      (({ C: 0.04, B: 0.07, A: 0.1, S: 0.14 }[grade] || 0.07) * secondaryEffectScale).toFixed(2),
    );
    state.状态名称 = state.状态名称 === '无' ? '隐身' : state.状态名称;
    state.持续回合 = Math.max(state.持续回合, stealthDuration);
    state.特殊机制标识 = [state.特殊机制标识, `隐身:${stealthDuration}回合`]
      .filter(v => v && v !== '无')
      .join('/');
    state.计算层效果.stealth_level = Math.max(Number(state.计算层效果.stealth_level || 0), stealthLevel);
    state.计算层效果.dodge_bonus = Math.max(Number(state.计算层效果.dodge_bonus || 0), dodgeBonus);
    state.计算层效果.reaction_bonus = Math.max(Number(state.计算层效果.reaction_bonus || 0), reactionBonus);
  }
  if (secondary.includes('护卫')) {
    const guardDuration = Math.max(1, Math.round(({ C: 1, B: 2, A: 2, S: 3 }[grade] || 1) * secondaryDurationScale));
    const guardReduction = Number(
      (({ C: 0.06, B: 0.1, A: 0.14, S: 0.18 }[grade] || 0.1) * secondaryEffectScale).toFixed(2),
    );
    state.状态名称 = state.状态名称 === '无' ? '护卫' : state.状态名称;
    state.持续回合 = Math.max(state.持续回合, guardDuration);
    state.特殊机制标识 = [state.特殊机制标识, `护卫:${guardDuration}回合`]
      .filter(v => v && v !== '无')
      .join('/');
    state.计算层效果.damage_reduction = Math.max(Number(state.计算层效果.damage_reduction || 0), guardReduction);
  }
  if (secondary.includes('嘲讽')) {
    const tauntDuration = Math.max(1, Math.round(({ C: 1, B: 1, A: 2, S: 2 }[grade] || 1) * secondaryDurationScale));
    state.状态名称 = state.状态名称 === '无' ? '嘲讽' : state.状态名称;
    state.持续回合 = Math.max(state.持续回合, tauntDuration);
    state.特殊机制标识 = [state.特殊机制标识, `嘲讽:${tauntDuration}回合`]
      .filter(v => v && v !== '无')
      .join('/');
  }
  if (secondary.includes('窃取增益'))
    state.特殊机制标识 = [state.特殊机制标识, '窃取增益'].filter(v => v && v !== '无').join('/');
  if (secondary.includes('破隐'))
    state.特殊机制标识 = [state.特殊机制标识, '破隐'].filter(v => v && v !== '无').join('/');
  if (secondary.includes('追击')) {
    const chaseDuration = Math.max(1, Math.round(({ C: 1, B: 1, A: 2, S: 2 }[grade] || 1) * secondaryDurationScale));
    const chaseHitBonus = Number(
      (({ C: 0.03, B: 0.06, A: 0.09, S: 0.12 }[grade] || 0.06) * secondaryEffectScale).toFixed(2),
    );
    const chaseSpeedBonus = Number(
      (({ C: 0.03, B: 0.05, A: 0.08, S: 0.1 }[grade] || 0.05) * secondaryEffectScale).toFixed(2),
    );
    const chaseDamageMult = Number(
      (1 + ({ C: 0.04, B: 0.06, A: 0.1, S: 0.14 }[grade] || 0.06) * secondaryEffectScale).toFixed(2),
    );
    state.状态名称 = state.状态名称 === '无' ? '追击' : state.状态名称;
    state.持续回合 = Math.max(state.持续回合, chaseDuration);
    state.特殊机制标识 = [state.特殊机制标识, `追击:${chaseDuration}回合`]
      .filter(v => v && v !== '无')
      .join('/');
    state.计算层效果.hit_bonus = Math.max(Number(state.计算层效果.hit_bonus || 0), chaseHitBonus);
    state.计算层效果.attacker_speed_bonus = Math.max(Number(state.计算层效果.attacker_speed_bonus || 0), chaseSpeedBonus);
    state.计算层效果.final_damage_mult = Math.max(Number(state.计算层效果.final_damage_mult || 1), chaseDamageMult);
  }
  if (secondary.includes('无敌金身')) {
    const goldenDuration = Math.max(1, Math.round(({ C: 1, B: 1, A: 1, S: 2 }[grade] || 1) * Math.max(0.75, secondaryDurationScale)));
    state.状态名称 = state.状态名称 === '无' ? '无敌金身' : state.状态名称;
    state.持续回合 = Math.max(state.持续回合, goldenDuration);
    state.特殊机制标识 = [state.特殊机制标识, `无敌金身:${goldenDuration}回合/每日3次/神级以下免疫`]
      .filter(v => v && v !== '无')
      .join('/');
    state.计算层效果.invincible = true;
    state.计算层效果.super_armor = true;
    state.计算层效果.invincible_tier_threshold = Math.max(Number(state.计算层效果.invincible_tier_threshold || 0), 100);
    state.计算层效果.daily_trigger_limit = Math.max(Number(state.计算层效果.daily_trigger_limit || 0), grade === 'S' ? 2 : 1);
    state.计算层效果.damage_reduction = Math.max(Number(state.计算层效果.damage_reduction || 0), Number(({ C: 0.05, B: 0.08, A: 0.12, S: 0.18 }[grade] || 0.08)));
  }
  if (secondary.includes('伤害反射')) {
    const reflectDuration = Math.max(1, Math.round(({ C: 1, B: 1, A: 2, S: 2 }[grade] || 1) * Math.max(0.75, secondaryDurationScale)));
    const reflectRatio = Number((({ C: 0.1, B: 0.16, A: 0.24, S: 0.36 }[grade] || 0.16) * secondaryEffectScale).toFixed(2));
    state.状态名称 = state.状态名称 === '无' ? '伤害反射' : state.状态名称;
    state.持续回合 = Math.max(state.持续回合, reflectDuration);
    state.特殊机制标识 = [state.特殊机制标识, `伤害反射:${reflectDuration}回合`].filter(v => v && v !== '无').join('/');
    state.计算层效果.damage_reflect_ratio = Math.max(Number(state.计算层效果.damage_reflect_ratio || 0), reflectRatio);
  }
  if (secondary.includes('伤害分摊')) {
    const shareDuration = Math.max(1, Math.round(({ C: 1, B: 1, A: 2, S: 2 }[grade] || 1) * Math.max(0.75, secondaryDurationScale)));
    const shareRatio = Number((({ C: 0.14, B: 0.22, A: 0.3, S: 0.4 }[grade] || 0.22) * secondaryEffectScale).toFixed(2));
    const shareCount = 1;
    state.状态名称 = state.状态名称 === '无' ? '伤害分摊' : state.状态名称;
    state.持续回合 = Math.max(state.持续回合, shareDuration);
    state.特殊机制标识 = [state.特殊机制标识, `伤害分摊:${shareDuration}回合`].filter(v => v && v !== '无').join('/');
    state.计算层效果.damage_share_ratio = Math.max(Number(state.计算层效果.damage_share_ratio || 0), shareRatio);
    state.计算层效果.damage_share_count = Math.max(Number(state.计算层效果.damage_share_count || 0), shareCount);
  }
  if (secondary.includes('替身抵消')) {
    const substituteDuration = Math.max(1, Math.round(({ C: 1, B: 1, A: 1, S: 2 }[grade] || 1) * Math.max(0.75, secondaryDurationScale)));
    const substituteCount = Math.max(1, Math.round(({ C: 1, B: 1, A: 1, S: 2 }[grade] || 1)));
    state.状态名称 = state.状态名称 === '无' ? '替身抵消' : state.状态名称;
    state.持续回合 = Math.max(state.持续回合, substituteDuration);
    state.特殊机制标识 = [state.特殊机制标识, `替身抵消:${substituteCount}次`].filter(v => v && v !== '无').join('/');
    state.计算层效果.substitute_count = Math.max(Number(state.计算层效果.substitute_count || 0), substituteCount);
    state.计算层效果.dodge_bonus = Math.max(Number(state.计算层效果.dodge_bonus || 0), Number(({ C: 0.03, B: 0.05, A: 0.08, S: 0.1 }[grade] || 0.05)));
  }
  if (secondary.includes('治疗反转')) {
    const invertDuration = Math.max(1, Math.round(({ C: 1, B: 1, A: 2, S: 2 }[grade] || 1) * secondaryDurationScale));
    const invertRatio = Number((({ C: 1.0, B: 1.0, A: 1.15, S: 1.3 }[grade] || 1.0) * secondaryEffectScale).toFixed(2));
    state.状态名称 = state.状态名称 === '无' ? '治疗反转' : state.状态名称;
    state.持续回合 = Math.max(state.持续回合, invertDuration);
    state.特殊机制标识 = [state.特殊机制标识, `治疗反转:${invertDuration}回合`].filter(v => v && v !== '无').join('/');
    state.计算层效果.heal_inversion_ratio = Math.max(Number(state.计算层效果.heal_inversion_ratio || 0), invertRatio);
  }
  if (secondary.includes('封技')) {
    const sealDuration = Math.max(1, Math.round(({ C: 1, B: 1, A: 2, S: 2 }[grade] || 1) * secondaryDurationScale));
    state.状态名称 = state.状态名称 === '无' ? '封技' : state.状态名称;
    state.持续回合 = Math.max(state.持续回合, sealDuration);
    state.特殊机制标识 = [state.特殊机制标识, `封技:${sealDuration}回合`].filter(v => v && v !== '无').join('/');
    state.计算层效果.skill_seal = true;
  }
  if (secondary.includes('复苏')) {
    const reviveDuration = Math.max(1, Math.round(({ C: 1, B: 1, A: 2, S: 2 }[grade] || 1) * Math.max(0.75, secondaryDurationScale)));
    const reviveHealRatio = Number((({ C: 0.12, B: 0.18, A: 0.26, S: 0.34 }[grade] || 0.18) * secondaryEffectScale).toFixed(2));
    state.状态名称 = state.状态名称 === '无' ? '复苏' : state.状态名称;
    state.持续回合 = Math.max(state.持续回合, reviveDuration);
    state.特殊机制标识 = [state.特殊机制标识, `复苏:${reviveDuration}回合`].filter(v => v && v !== '无').join('/');
    state.计算层效果.revive_count = Math.max(Number(state.计算层效果.revive_count || 0), 1);
    state.计算层效果.revive_heal_ratio = Math.max(Number(state.计算层效果.revive_heal_ratio || 0), reviveHealRatio);
  }
  if (secondary.includes('状态转移'))
    state.特殊机制标识 = [state.特殊机制标识, '状态转移'].filter(v => v && v !== '无').join('/');
  if (secondary.includes('引爆持续伤害'))
    state.特殊机制标识 = [state.特殊机制标识, '引爆持续伤害'].filter(v => v && v !== '无').join('/');
  if (secondary.includes('斩盾'))
    state.特殊机制标识 = [state.特殊机制标识, '斩盾'].filter(v => v && v !== '无').join('/');
  if (secondary.includes('窃取护盾'))
    state.特殊机制标识 = [state.特殊机制标识, '窃取护盾'].filter(v => v && v !== '无').join('/');
  if (secondary.includes('魂力恢复'))
    state.特殊机制标识 = [
      state.特殊机制标识,
      `魂力恢复:${Math.max(1, Math.round(randomInRange({ C: [5, 8], B: [8, 12], A: [12, 18], S: [18, 25] }) * secondaryEffectScale))}%`,
    ]
      .filter(v => v && v !== '无')
      .join('/');
  if (secondary.includes('精神恢复'))
    state.特殊机制标识 = [
      state.特殊机制标识,
      `精神恢复:${Math.max(1, Math.round(randomInRange({ C: [5, 8], B: [8, 12], A: [12, 18], S: [18, 25] }) * secondaryEffectScale))}%`,
    ]
      .filter(v => v && v !== '无')
      .join('/');

  const baseCost = Math.max(10, Math.round(60 + powerBase * 0.42 + ringIndex * 8));
  let spCost = 0,
    vitCost = 0,
    menCost = 0,
    selfSacrificeVitCost = 0;
  switch (fuelModel) {
    case '精神主导':
      menCost = Math.floor(baseCost * 0.7);
      spCost = Math.floor(baseCost * 0.3);
      break;
    case '附加微量精神力':
      spCost = baseCost;
      menCost = Math.floor(baseCost * 0.1);
      break;
    case '附加常规体力':
      spCost = baseCost;
      vitCost = Math.floor(baseCost * 0.15);
      break;
    case '附加大量体力':
      spCost = baseCost;
      vitCost = Math.floor(baseCost * 0.25);
      break;
    case '魂神平摊':
      spCost = Math.floor(baseCost * 0.5);
      menCost = Math.floor(baseCost * 0.5);
      break;
    default:
      spCost = baseCost;
  }
  if (mutation.includes('自残换收益')) {
    selfSacrificeVitCost = 30 + ringIndex * 10;
    clash.基础威力倍率 = Math.round(clash.基础威力倍率 * 1.25);
    vitCost += selfSacrificeVitCost;
    state.特殊机制标识 = [state.特殊机制标识, '自残换收益'].filter(v => v && v !== '无').join('/');
  }
  if (mutation.includes('高波动随机值')) {
    const swing = Number(randomRangeRaw(0.5, 1.8).toFixed(2));
    if (clash.基础威力倍率 > 0) clash.基础威力倍率 = Math.round(clash.基础威力倍率 * swing);
    if (clash.护盾绝对值 > 0) clash.护盾绝对值 = Math.round(clash.护盾绝对值 * swing);
    if (clash.瞬间恢复比例 > 0) clash.瞬间恢复比例 = Number((clash.瞬间恢复比例 * swing).toFixed(2));
    state.特殊机制标识 = [state.特殊机制标识, `高波动:${swing}`].filter(v => v && v !== '无').join('/');
  }
  if (mutation.includes('回复转伤害') && clash.瞬间恢复比例 > 0) {
    clash.基础威力倍率 = Math.max(clash.基础威力倍率, Math.round(powerBase * (clash.瞬间恢复比例 / 20)));
    clash.伤害类型 = clash.伤害类型 === '无' ? getDamageType() : clash.伤害类型;
    clash.瞬间恢复比例 = 0;
    state.特殊机制标识 = [state.特殊机制标识, '回复转伤害'].filter(v => v && v !== '无').join('/');
  }
  if (mutation.includes('伤害转回复') && clash.基础威力倍率 > 0) {
    clash.瞬间恢复比例 = Math.max(clash.瞬间恢复比例, { C: 8, B: 12, A: 18, S: 25 }[grade] || 10);
    state.特殊机制标识 = [state.特殊机制标识, '伤害转回复'].filter(v => v && v !== '无').join('/');
  }
  if (mutation.includes('效果反转')) {
    const flipped = state.面板修改比例;
    ['str', 'def', 'agi', 'men_max', 'sp_max'].forEach(k => {
      if (flipped[k] > 1) flipped[k] = Number((1 - (flipped[k] - 1) * 0.75).toFixed(2));
      else if (flipped[k] < 1) flipped[k] = Number((1 + (1 - flipped[k]) * 0.75).toFixed(2));
    });
    state.特殊机制标识 = [state.特殊机制标识, '效果反转'].filter(v => v && v !== '无').join('/');
  }
  if (mutation.includes('自身也受影响'))
    state.特殊机制标识 = [state.特殊机制标识, '自身也受影响'].filter(v => v && v !== '无').join('/');
  if (mutation.includes('随机目标'))
    state.特殊机制标识 = [state.特殊机制标识, '随机目标'].filter(v => v && v !== '无').join('/');
  战斗.消耗 =
    [`魂力:${spCost}`, vitCost > 0 ? `体力:${vitCost}` : '', menCost > 0 ? `精神力:${menCost}` : '']
      .filter(Boolean)
      .join(' | ') || '无';

  if (delivery === '延迟触发') 战斗.cast_time += 8;
  if (delivery === '范围展开') 战斗.cast_time += 5;
  if (delivery === '自身附体') 战斗.cast_time = Math.max(0, 战斗.cast_time - 5);

  if (delivery === '范围展开' || delivery === '召唤承载') {
    const isSummonCarrier = delivery === '召唤承载';
    if (String(field.实体名称 || '无') === '无') {
      const baseName = String(archetype || main || (isSummonCarrier ? '召唤体' : '场地效果'));
      field.实体名称 = /领域|场|结界|阵|召唤/.test(baseName)
        ? baseName
        : isSummonCarrier
          ? `${baseName}召唤体`
          : `${baseName}领域`;
    }
    field.持续回合 = Math.max(
      Number(field.持续回合 || 0),
      Number(state.持续回合 || 0),
      isSummonCarrier ? Math.max(1, gradeFactor) : Math.max(2, gradeFactor),
    );
    if (isSummonCarrier)
      field.继承属性比例 = Math.max(Number(field.继承属性比例 || 0), Number((0.2 + gradeFactor * 0.1).toFixed(2)));
    if (String(field.核心机制描述 || '无') === '无') {
      field.核心机制描述 = isSummonCarrier
        ? `召唤承载/${main || '特殊规则'}/${archetype || '实体化'}`
        : `范围展开/${main || '辅助'}/${archetype || '领域增幅'}`;
    }
  }

  return 战斗;
}

function isSkillTodoText(text) {
  const value = String(text || '').trim();
  return !value || value === '未知' || /待补全/i.test(value);
}

function clonePackedSkillEffects(effects) {
  return JSON.parse(JSON.stringify(Array.isArray(effects) ? effects : []));
}

function isSkillSummaryEffect(effect = {}) {
  void effect;
  return false;
}

function getSkillSummaryEffects(packedEffects) {
  void packedEffects;
  return [];
}

function getSkillSummaryEffectByMechanism(packedEffects, mechanism = '') {
  void packedEffects;
  void mechanism;
  return null;
}

function getMeaningfulSkillEffects(packedEffects) {
  return (Array.isArray(packedEffects) ? packedEffects : []).filter(
    effect => effect && typeof effect === 'object' && String(effect.机制 || '') !== '系统基础',
  );
}

function buildSkillTargetLabel(target) {
  const map = {
    自身: '自身',
    友方单体: '一名己方目标',
    友方群体: '己方群体',
    敌方单体: '一名敌方目标',
    敌方群体: '敌方群体',
    全场: '全场',
    食用者: '食用者',
    使用者: '使用者',
  };
  return map[String(target || '目标')] || String(target || '目标');
}

function formatTickToCalendarDateText(tickValue) {
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

function formatTickToCalendarDateTimeText(tickValue) {
  return formatTickToCalendarDateText(tickValue);
}

function formatTickDurationAsDayText(tickValue) {
  const safeTick = Math.max(0, Number(tickValue || 0));
  const totalMinutes = Math.max(10, Math.round(safeTick * 10));
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const mins = totalMinutes % 60;
  if (days > 0) {
    return hours > 0 ? `${days}天${hours}小时` : `${days}天`;
  }
  if (hours > 0) {
    if (mins > 0) return `${hours}小时${mins}分钟`;
    return `${hours}小时`;
  }
  if (mins === 30) return '半小时';
  return `${mins}分钟`;
}

function buildConstructExpiryText(durationTick = 0, expiryTick = 0) {
  const absoluteTick = Math.max(0, Number(expiryTick || 0));
  if (absoluteTick > 0) return `有效期至${formatTickToCalendarDateText(absoluteTick)}`;
  const duration = Math.max(0, Number(durationTick || 0));
  if (duration > 0) return `约可保留${formatTickDurationAsDayText(duration)}`;
  return '';
}

function buildCreationUsageEffects(packedEffects, type = '') {
  const isFood = type === '食物系';
  return clonePackedSkillEffects(getMeaningfulSkillEffects(packedEffects))
    .filter(effect => !['生成造物', '造物生成'].includes(String(effect?.机制 || '')))
    .map(effect => {
      if (!effect || typeof effect !== 'object') return effect;
      const cloned = { ...effect };
      if (isFood) {
        cloned.目标 = '食用者';
        if (cloned.对象 !== undefined) cloned.对象 = '食用者';
      }
      return cloned;
    });
}

function formatSkillNumber(value, digits = 0) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return '0';
  const fixed = digits > 0 ? num.toFixed(digits) : String(Math.round(num));
  return fixed.replace(/\.?0+$/, '');
}

function formatSkillPercent(value, alreadyPercent = false) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return '0%';
  const percentValue = alreadyPercent ? num : num * 100;
  const digits = Math.abs(percentValue % 1) < 0.0001 ? 0 : 2;
  return formatSkillNumber(percentValue, digits) + '%';
}

const SKILL_EFFECT_PROPERTY_LABELS = Object.freeze({
  str: '力量',
  def: '防御',
  agi: '敏捷',
  vit_max: '体力上限',
  sp_max: '魂力上限',
  men_max: '精神力上限',
  vit: '体力',
  sp: '魂力',
  men: '精神力',
  掌控: '掌控',
  威力: '威力',
  消耗: '消耗',
  前摇: '前摇',
  控制: '控制',
  速度: '速度',
});

function buildSkillEffectPropertyLabel(property = '') {
  const key = String(property || '').trim();
  return SKILL_EFFECT_PROPERTY_LABELS[key] || key || '属性';
}

function getSkillEffectDuration(effect = {}) {
  const raw = effect?.持续 !== undefined ? effect.持续 : effect?.持续回合;
  const duration = Number(raw || 0);
  return Number.isFinite(duration) ? Math.max(0, duration) : 0;
}

function normalizeSkillPackedNumericValue(value, digits = 2) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return 0;
  return Number(num.toFixed(digits));
}

function buildPackedAttributeEffect(mechanism, target, property, action, value, duration = 0, trigger = '立即生效') {
  const num = normalizeSkillPackedNumericValue(value);
  if (!Number.isFinite(num)) return null;
  return {
    机制: mechanism,
    对象: target || '自身',
    属性: property,
    动作: action,
    数值: num,
    持续: Math.max(0, Number(duration || 0)),
    触发: trigger || '立即生效',
  };
}

function buildPackedAttributeEffectsFromRatios(target, statMods = {}, duration = 0) {
  const effects = [];
  Object.entries(statMods || {}).forEach(([property, ratio]) => {
    const num = Number(ratio || 0);
    if (!Number.isFinite(num) || Math.abs(num - 1) <= 0.001) return;
    effects.push(
      buildPackedAttributeEffect(
        '属性变化',
        target,
        property,
        num >= 1 ? '倍率提升' : '倍率压制',
        num,
        duration,
        duration > 0 ? '状态持续' : '立即生效',
      ),
    );
  });
  return effects.filter(Boolean);
}

function buildPackedRecoverAttributeEffect(target, property, ratio, duration = 0, overtime = false) {
  const num = Number(ratio || 0);
  if (!Number.isFinite(num) || num <= 0) return null;
  return buildPackedAttributeEffect(
    overtime ? '持续恢复' : '属性变化',
    target,
    property,
    overtime ? '持续恢复' : '加值',
    num,
    overtime ? duration : 0,
    overtime ? '每回合' : '立即生效',
  );
}

function buildSingleSkillEffectSummary(effect) {
  const 机甲 = String(effect?.机制 || '');
  const target = buildSkillTargetLabel(effect?.目标 || effect?.对象 || '目标');
  switch (机甲) {
    case '直接伤害': {
      const damageType = effect.伤害类型 && effect.伤害类型 !== '无' ? effect.伤害类型 : '伤害';
      return '对' + target + '造成1次' + damageType + '打击，威力系数' + formatSkillNumber(effect.威力倍率);
    }
    case '多段伤害': {
      const damageType = effect.伤害类型 && effect.伤害类型 !== '无' ? effect.伤害类型 : '伤害';
      return '对' + target + '打出多段' + damageType + '，总威力系数约为' + formatSkillNumber(effect.威力倍率);
    }
    case '持续伤害':
      return '对' + target + '施加持续伤害，基础威力系数' + formatSkillNumber(effect.威力倍率);
    case '延迟爆发':
      return '短暂蓄势后对' + target + '引爆一次威力系数' + formatSkillNumber(effect.威力倍率) + '的伤害';
    case '护盾':
      return '为' + target + '附加' + formatSkillNumber(effect.护盾值) + '点护盾';
    case '属性变化': {
      const property = String(effect?.属性 || '').trim();
      const action = String(effect?.动作 || '').trim();
      const value = Number(effect?.数值 || 0);
      const duration = getSkillEffectDuration(effect);
      const label = buildSkillEffectPropertyLabel(property);
      const durationText = duration > 0 ? `，持续${formatSkillNumber(duration)}回合` : '';
      if (action === '加值') {
        if (['vit', 'sp', 'men'].includes(property)) return '为' + target + '恢复' + formatSkillPercent(value) + label;
        return '使' + target + '的' + label + '提高' + formatSkillPercent(value) + durationText;
      }
      if (action === '减值') return '使' + target + '的' + label + '降低' + formatSkillPercent(value) + durationText;
      if (action === '倍率提升') return '使' + target + '的' + label + '提升' + formatSkillPercent(Math.abs(value - 1)) + durationText;
      if (action === '倍率压制') return '使' + target + '的' + label + '压制' + formatSkillPercent(Math.abs(1 - value)) + durationText;
      return '使' + target + '的' + label + '发生变化' + durationText;
    }
    case '持续恢复': {
      const property = String(effect?.属性 || '').trim();
      const value = Number(effect?.数值 || 0);
      const duration = getSkillEffectDuration(effect);
      const label = buildSkillEffectPropertyLabel(property);
      return (
        '使' +
        target +
        '每回合恢复' +
        formatSkillPercent(value) +
        label +
        '，持续' +
        formatSkillNumber(duration) +
        '回合'
      );
    }
    case '消耗提高':
    case '消耗降低': {
      const value = Number(effect?.数值 || 0);
      const duration = getSkillEffectDuration(effect);
      const durationText = duration > 0 ? `，持续${formatSkillNumber(duration)}回合` : '';
      if (机甲 === '消耗提高')
        return '使' + target + '的自身能力消耗提高' + formatSkillPercent(Math.abs(value - 1)) + durationText;
      return '使' + target + '的自身能力消耗降低' + formatSkillPercent(Math.abs(1 - value)) + durationText;
    }
    case '前摇拉长':
    case '前摇缩短': {
      const value = Number(effect?.数值 || 0);
      const duration = getSkillEffectDuration(effect);
      const durationText = duration > 0 ? `，持续${formatSkillNumber(duration)}回合` : '';
      if (机甲 === '前摇拉长')
        return '使' + target + '的自身能力前摇拉长' + formatSkillPercent(Math.abs(value - 1)) + durationText;
      return '使' + target + '的自身能力前摇缩短' + formatSkillPercent(Math.abs(1 - value)) + durationText;
    }
    case '掌控修正': {
      const value = Number(effect?.数值 || 0);
      const duration = getSkillEffectDuration(effect);
      const durationText = duration > 0 ? `，持续${formatSkillNumber(duration)}回合` : '';
      if (String(effect?.动作 || '').trim() === '倍率压制')
        return '使' + target + '的掌控压制' + formatSkillPercent(Math.abs(1 - value)) + durationText;
      return '使' + target + '的掌控提升' + formatSkillPercent(Math.abs(value - 1)) + durationText;
    }
    case '速度修正': {
      const value = Number(effect?.数值 || 0);
      const duration = getSkillEffectDuration(effect);
      const durationText = duration > 0 ? `，持续${formatSkillNumber(duration)}回合` : '';
      if (String(effect?.动作 || '').trim() === '倍率压制')
        return '使' + target + '的速度压制' + formatSkillPercent(Math.abs(1 - value)) + durationText;
      return '使' + target + '的速度提升' + formatSkillPercent(Math.abs(value - 1)) + durationText;
    }
    case '修炼增益': {
      const duration = Math.max(1, Number(effect?.持续回合 || effect?.持续 || 6));
      const ratio = Math.max(1.01, Number(effect?.修炼速度倍率 || effect?.修炼倍率 || effect?.训练倍率 || 1.2));
      return '使' + target + '的修炼效率提升至 x' + formatSkillNumber(ratio, 2) + '，持续' + formatSkillNumber(duration) + '回合';
    }
    case '解控':
    case '净化':
      return (
        '为' +
        target +
        '清除负面状态' +
        (Number(effect.清除层级 || 0) > 0 ? '（层级' + formatSkillNumber(effect.清除层级) + '）' : '')
      );
    case '驱散增益':
      return '驱散' + target + '的增益状态' + (Number(effect.驱散数量 || 0) > 0 ? '（数量' + formatSkillNumber(effect.驱散数量) + '）' : '');
    case '窃取增益':
      return '窃取' + target + '的增益状态' + (Number(effect.窃取数量 || 0) > 0 ? '（数量' + formatSkillNumber(effect.窃取数量) + '）' : '');
    case '窃取护盾':
      return '窃取' + target + '当前护盾并转移给自身';
    case '吞噬':
      return (
        '吞噬' +
        target +
        '的' +
        String(effect.资源类型 || '魂力/精神力') +
        '并回流给施术者' +
        (Number(effect.夺取比例 || 0) > 0 ? '（比例' + formatSkillPercent(effect.夺取比例) + '）' : '')
      );
    case '能力共享':
      return (
        '与' +
        target +
        '共享' +
        String(effect.资源类型 || '魂力/精神力') +
        (Number(effect.反灌比例 || 0) > 0 ? '（比例' + formatSkillPercent(effect.反灌比例) + '）' : '')
      );
    case '机制抹消': {
      const targetLabel = String(effect.抹消目标 || effect.机制抹消目标 || '复苏');
      const modeLabel = String(effect.抹消方式 || effect.机制抹消方式 || '移除并封锁');
      return '抹消' + target + '的[' + targetLabel + ']机制，持续' + formatSkillNumber(effect.持续回合) + '回合' + (modeLabel ? `（${modeLabel}）` : '');
    }
    case '感知干扰':
      return '扰乱' + target + '的感知判断，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '标记锁定':
      return '锁定' + target + '，持续' + formatSkillNumber(effect.持续回合) + '回合，并提高命中与锁定强度';
    case '目标锁定':
      return '锁定' + target + '的行动轨迹，持续' + formatSkillNumber(effect.持续回合) + '回合，提高追踪命中';
    case '隐身':
      return '使' + target + '进入隐身状态，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '破隐':
      return '强制拆除' + target + '的隐身伪装，并提高后续命中';
    case '共享视野':
      return '与' + target + '共享视野，持续' + formatSkillNumber(effect.持续回合) + '回合，提高反应与命中';
    case '幻境':
      return '对' + target + '施加幻境干扰，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '催眠':
      return '尝试催眠' + target + '，成功后持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '认知扭曲':
      return '扭曲' + target + '的认知与判断，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '禁疗':
      return '对' + target + '施加禁疗，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '缴械':
      return '使' + target + '缴械，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '沉默':
      return '使' + target + '沉默' + formatSkillNumber(effect.持续回合) + '回合';
    case '减速':
      return '使' + target + '减速，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '追击':
      return '对' + target + '建立追击节奏，持续' + formatSkillNumber(effect.持续回合) + '回合，提高速度、命中与追击伤害';
    case '引爆持续伤害':
      return '引爆' + target + '身上的持续伤害效果，转化为即时伤害';
    case '护卫':
      return '为' + target + '提供护卫拦截，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '嘲讽':
      return '迫使' + target + '优先把火力集中到施术者身上，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '无敌金身':
      return '使' + target + '进入无敌金身，神级以下攻击每日最多豁免' + formatSkillNumber(effect.每日触发上限 || 3) + '次';
    case '伤害反射':
      return '使' + target + '在受击后反弹部分伤害，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '伤害分摊':
      return '使' + target + '将部分伤害分摊给友军，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '替身抵消':
      return '使' + target + '获得替身抵消层数，抵消' + formatSkillNumber(effect.抵消次数 || 1) + '次伤害';
    case '状态转移':
      return '将自身异常或目标状态进行单向转移';
    case '斩盾':
      return '直接斩碎' + target + '的护盾并转化为额外伤害';
    case '治疗反转':
      return '使' + target + '受到的治疗在持续期间反转为伤害';
    case '封技':
      return '封锁' + target + '的技能回路，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '复苏':
      return '为' + target + '附加一次复苏机会，濒死后恢复部分HP';
    case '硬控':
      return '强行控制' + target + '，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '打断':
      return '对' + target + '附带高优先级打断';
    case '斩杀补伤':
      return '在目标血量低于阈值时，对' + target + '追加斩杀补伤';
    case '受击反击':
      return '使自身在受击后触发一次反击，反击系数' + formatSkillNumber(effect.反击倍率, 2);
    case '减伤':
      return '使' + target + '获得' + formatSkillPercent(effect.减伤比例) + '减伤';
    case '格挡':
      return '使' + target + '获得' + formatSkillNumber(effect.抵消次数) + '次格挡';
    case '霸体':
      return '使' + target + '进入霸体状态，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '分身': {
      const cloneType = String(effect.分身类型 || '分身');
      const cloneCount = Math.max(1, Number(effect.分身数量 || 1));
      const stealth = Number(effect.隐蔽度 || 0);
      const inheritRatio = Number(effect.实力继承比例 || 0);
      return (
        '使' +
        target +
        '分出' +
        formatSkillNumber(cloneCount) +
        '体' +
        cloneType +
        '，隐蔽度' +
        formatSkillPercent(stealth) +
        '，继承实力' +
        formatSkillPercent(inheritRatio)
      );
    }
    case '免死':
      return (
        '使' +
        target +
        '在' +
        formatSkillNumber(effect.持续回合) +
        '回合内获得' +
        formatSkillNumber(effect.触发次数) +
        '次濒死保护'
      );
    case '高波动随机值':
      return (
        '使技能效果在' +
        formatSkillNumber(effect.波动下限, 2) +
        '至' +
        formatSkillNumber(effect.波动上限, 2) +
        '倍之间波动'
      );
    case '自身也受影响':
      return '技能效果会同步反馈至自身';
    case '回复转伤害':
      return '将原本的回复效果转化为伤害输出';
    case '伤害转回复':
      return '将部分伤害转化为自身回复';
    case '效果反转':
      return '使增益与减益方向发生反转';
    case '召唤与场地': {
      const entityName = String(effect.实体名称 || effect.状态名称 || '场地效果');
      const duration = Number(effect.持续回合 || 0);
      const coreText = String(effect.核心机制描述 || '').trim();
      let text = '展开【' + entityName + '】';
      if (duration > 0) text += '，持续' + formatSkillNumber(duration) + '回合';
      if (coreText && coreText !== '无') text += '，核心效果：' + coreText;
      return text;
    }
    case '属性永久强化':
      return (
        '永久强化基础属性' + (Number(effect.强化值 || 0) > 0 ? '，强化幅度约' + formatSkillPercent(effect.强化值) : '')
      );
    case '状态挂载': {
      const stateName = String(effect.状态名称 || '状态');
      const duration = Number(effect.持续回合 || 0);
      const statMods = effect.面板修改比例 && typeof effect.面板修改比例 === 'object' ? effect.面板修改比例 : {};
      const calc = effect.计算层效果 && typeof effect.计算层效果 === 'object' ? effect.计算层效果 : {};
      const statLabels = {
        str: '力量',
        def: '防御',
        agi: '敏捷',
        vit_max: '体力上限',
        men_max: '精神力上限',
        sp_max: '魂力上限',
      };
      const segments = [];
      Object.entries(statMods).forEach(([key, value]) => {
        const num = Number(value);
        if (!Number.isFinite(num) || Math.abs(num - 1) < 0.001 || !statLabels[key]) return;
        segments.push(`${statLabels[key]}${num > 1 ? '提升' : '降低'}${formatSkillPercent(Math.abs(num - 1))}`);
      });
      if (Number(calc.final_damage_mult || 1) > 1)
        segments.push('伤害提升' + formatSkillPercent(Number(calc.final_damage_mult || 1) - 1));
      if (Number(calc.final_heal_mult || 1) > 1)
        segments.push('治疗提升' + formatSkillPercent(Number(calc.final_heal_mult || 1) - 1));
      if (Number(calc.shield_gain_mult || 1) > 1)
        segments.push('护盾提升' + formatSkillPercent(Number(calc.shield_gain_mult || 1) - 1));
      if (Number(calc.control_resist_mult || 1) > 1) segments.push('抗控制提高');
      if (Number(calc.death_save_count || 0) > 0)
        segments.push('获得' + formatSkillNumber(calc.death_save_count) + '次濒死保护');
      if (Number(calc.revive_count || 0) > 0) segments.push('附带' + formatSkillNumber(calc.revive_count) + '次复苏');
      if (Number(calc.substitute_count || 0) > 0) segments.push('拥有' + formatSkillNumber(calc.substitute_count) + '次替身抵消');
      if (Number(calc.damage_reflect_ratio || 0) > 0) segments.push('反弹' + formatSkillPercent(Number(calc.damage_reflect_ratio || 0)) + '伤害');
      if (Number(calc.damage_share_ratio || 0) > 0) segments.push('分摊' + formatSkillPercent(Number(calc.damage_share_ratio || 0)) + '承伤');
      if (Number(calc.heal_inversion_ratio || 0) > 0) segments.push('治疗反转');
      if (calc.skill_seal === true) segments.push('封锁技能回路');
      if (calc.invincible === true) segments.push('无敌金身护体');
      const stateHint = String(effect.特殊机制标识 || '').trim();
      if (stateHint && stateHint !== '无' && !segments.includes(stateHint)) segments.push(stateHint);
      let text = '进入【' + stateName + '】状态';
      if (duration > 0) text += '，持续' + formatSkillNumber(duration) + '回合';
      if (segments.length > 0) text += '，' + segments.slice(0, 4).join('，');
      return text;
    }
    case '生成造物':
    case '造物生成': {
      const itemName = String(effect.魂技名 || AI_TODO_SKILL_NAME);
      const itemType = String(effect.产物类型 || '');
      const isFood = itemType === '食物';
      const itemCount = Math.max(1, Number(effect.数量 || 1));
      const expiryText = String(effect.有效期间 || buildConstructExpiryText(effect.有效期tick || 0, 0));
      const usageSegments = getMeaningfulSkillEffects(effect.使用效果)
        .map(buildSingleSkillEffectSummary)
        .filter(Boolean)
        .slice(0, 2);
      let text = isFood ? '生成可食用的【' + itemName + '】' : '生成可存入背包的【' + itemName + '】';
      if (itemCount > 1) text += '×' + itemCount;
      if (expiryText) text += '，' + expiryText;
      if (usageSegments.length > 0) {
        text += `，${isFood ? '食用后' : '使用后'}${usageSegments.join('；')}`;
      } else {
        text += `，${isFood ? '食用后' : '使用后'}触发封存的魂技效果`;
      }
      return text;
    }
    default:
      if (Number(effect?.持续回合 || 0) > 0)
        return '对' + target + '施加【' + 机甲 + '】效果，持续' + formatSkillNumber(effect.持续回合) + '回合';
      return '对' + target + '施加【' + 机甲 + '】效果';
  }
}

function buildSkillEffectDescriptionFromPackedEffects(packedEffects) {
  const effects = getMeaningfulSkillEffects(packedEffects);
  if (effects.length === 0) return '无';
  const isConstructEffect = effect => ['生成造物', '造物生成'].includes(String(effect?.机制 || ''));
  const createEffects = effects.filter(isConstructEffect);
  const normalEffects = effects.filter(effect => !isConstructEffect(effect));
  const orderedEffects = createEffects.length > 0 ? createEffects : normalEffects;
  const segments = [];
  orderedEffects.forEach(effect => {
    const summary = buildSingleSkillEffectSummary(effect);
    if (summary && !segments.includes(summary)) segments.push(summary);
  });
  if (segments.length === 0) return '无';
  return segments.join('；') + '。';
}

function buildSkillEffectReferenceText(packedEffects) {
  const summary = buildSkillEffectDescriptionFromPackedEffects(packedEffects);
  return summary && summary !== '无' ? summary.replace(/。$/, '') : '';
}

function buildSkillSummaryReferenceText(packedEffects) {
  void packedEffects;
  return '';
}

function getSkillAttributeGateGuideText() {
  return '技能只写本招实际调用到的属性与演化，不要把武魂全部潜力属性塞进同一招；高阶属性表现优先遵守“已解锁属性 + 魂力/精神力负荷”双门槛，不直接写死等级线；五行相关必须先集齐金木水火土后才可写五行剥离/五行遁法；元素融合的基础源属性为水/火/风/土，四基础元素齐备可导向元素剥离，雷若出现只能作为四元素归元后的法则性显化；水火风土光暗空间齐备时才可导向七元素爆裂';
}

function buildSkillAttributeReferenceText(skill = {}) {
  if (!skill || typeof skill !== 'object') return '';
  const attrs = normalizeSkillAttachedAttributeArray(skill?.附带属性);
  const segments = [];
  const summaryText = buildSkillSummaryReferenceText(skill?._效果数组 || []);
  if (attrs.length && (!summaryText || !summaryText.includes('附带属性：')))
    segments.push(`附带属性：${attrs.join('/')}`);
  if (summaryText) segments.push(summaryText);
  return segments.join('；');
}

function compactSkillHintText(text = '', maxLen = 72) {
  const raw = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!raw) return '';
  if (raw.length <= maxLen) return raw;
  return raw.slice(0, maxLen) + '...';
}

function buildSkillEffectTodoText(packedEffects, skill = null) {
  const referenceText = compactSkillHintText(buildSkillEffectReferenceText(packedEffects), 80);
  const attributeText = compactSkillHintText(buildSkillAttributeReferenceText(skill), 56);
  if (!referenceText && !attributeText) return AI_TODO_SKILL_EFFECT;
  const parts = [];
  if (referenceText) parts.push(`参考效果数组摘要：${referenceText}`);
  if (attributeText) parts.push(`属性参考：${attributeText}`);
  return `待补全（${parts.join('；')}；请只补全效果，不新增机制）`;
}

function buildSkillVisualDescriptionFromPackedEffects(packedEffects, context = {}) {
  const effects = getMeaningfulSkillEffects(packedEffects);
  if (effects.length === 0) return '无';
  const referenceText = compactSkillHintText(buildSkillEffectReferenceText(packedEffects), 72);
  if (!referenceText) return AI_TODO_SKILL_VISUAL;
  const parts = [];
  if (referenceText) parts.push(`参考效果数组摘要：${referenceText}`);
  return `待补全（${parts.join('；')}；请只补全发动画面，不重复机制条文）`;
}

function buildTemporaryConstructDurationTicks(grade, ringIndex) {
  const baseMap = { C: 96, B: 144, A: 288, S: 432 };
  return (baseMap[grade] || 144) + Math.max(0, Number(ringIndex || 1) - 1) * 24;
}

function buildTemporaryConstructUsageText(usageEffects) {
  const list = Array.isArray(usageEffects) ? usageEffects : [];
  if (!list.length) return '';
  const hasPackedEffects = list.some(
    effect => effect && typeof effect === 'object' && String(effect.机制 || '').trim(),
  );
  if (hasPackedEffects) {
    const effectText = buildSkillEffectReferenceText(list);
    return effectText;
  }
  const simpleSegments = list.map(effect => String(effect?.description || '').trim()).filter(Boolean);
  return simpleSegments.length ? simpleSegments.slice(0, 3).join('；') : '';
}

function buildTemporaryConstructDescription(itemName, usageEffects, ttl, options = {}) {
  const typeText = String(options.type || '');
  const isFood = typeText === '食物' || typeText === '食物系';
  const effectText = buildTemporaryConstructUsageText(usageEffects);
  const triggerText = isFood ? '食用' : '使用';
  let text = '【' + itemName + '】。';
  if (effectText && effectText !== '无') {
    text += triggerText + '后效果：' + effectText.replace(/。$/, '') + '。';
  } else {
    text += triggerText + '后会触发对应魂技效果。';
  }
  return text;
}

function hydrateSkillTextByPackedEffects(skill, context = {}, options = {}) {
  if (!skill || !Array.isArray(skill._效果数组) || skill._效果数组.length === 0) return skill;
  if (
    options.forceVisual ||
    typeof skill.画面描述 !== 'string' ||
    !skill.画面描述.trim() ||
    isSkillTodoText(skill.画面描述)
  )
    skill.画面描述 = buildSkillVisualDescriptionFromPackedEffects(skill._效果数组, { ...context, skill });
  if (
    options.forceEffect ||
    typeof skill.效果描述 !== 'string' ||
    !skill.效果描述.trim() ||
    isSkillTodoText(skill.效果描述)
  )
    skill.效果描述 = buildSkillEffectTodoText(skill._效果数组, skill);
  return skill;
}

const SKILL_SECONDARY_MECHANIC_TYPES_V1 = {
  伤害附加: ['穿透', '吸血', '斩杀补伤', '流血DOT', '追击', '反击', '引爆持续伤害', '斩盾', '吞噬'],
  控制附加: ['打断', '沉默', '减速', '致盲', '迟缓', '禁疗', '缴械', '封技'],
  防御附加: ['小护盾', '短减伤', '反伤', '霸体短附加', '护卫', '嘲讽', '无敌金身', '伤害反射', '伤害分摊', '替身抵消', '复苏'],
  回复附加: ['魂力恢复', '精神恢复', '净化', '解控', '驱散增益', '护卫', '复苏', '治疗反转', '能力共享'],
  情报附加: ['标记弱点', '共享视野', '目标锁定', '感知干扰', '认知扭曲', '破隐'],
  特殊附加: ['窃取增益', '隐身', '嘲讽', '护卫', '状态转移', '窃取护盾', '吞噬', '能力共享', '机制抹消'],
  代价附加: ['自损', '异常耗蓝', '随机副作用'],
};

const SKILL_MUTATION_MECHANIC_TYPES_V1 = [
  '自残换收益',
  '增益附副作用',
  '回复转伤害',
  '伤害转回复',
  '效果反转',
  '自身也受影响',
  '随机目标',
  '高波动随机值',
  '技能复制',
  '阵营错位/锁定',
];

const NUMERIC_STAT_BONUS_KEYS = ['力量', '防御', '敏捷', '体力上限', '精神力上限'];

function normalizeDiscreteStatBonusInteger(value = 0) {
  const numeric = Number(value || 0);
  if (!Number.isFinite(numeric)) return 0;
  if (numeric > 0) return Math.floor(numeric);
  if (numeric < 0) return Math.ceil(numeric);
  return 0;
}

function createNumericStatBonusMap(seed = {}) {
  const source = seed && typeof seed === 'object' ? seed : {};
  return {
    力量: normalizeDiscreteStatBonusInteger(source.力量),
    防御: normalizeDiscreteStatBonusInteger(source.防御),
    敏捷: normalizeDiscreteStatBonusInteger(source.敏捷),
    体力上限: normalizeDiscreteStatBonusInteger(source.体力上限),
    精神力上限: normalizeDiscreteStatBonusInteger(source.精神力上限),
  };
}

function createExtendedStatBonusMap(seed = {}) {
  return {
    ...createNumericStatBonusMap(seed),
    魂力上限: normalizeDiscreteStatBonusInteger(seed && seed.魂力上限),
  };
}

function addNumericStatBonusValue(bonusMap = {}, statKey = '', delta = 0) {
  if (!NUMERIC_STAT_BONUS_KEYS.includes(statKey)) return 0;
  const total = Number((bonusMap && bonusMap[statKey]) || 0) + Number(delta || 0);
  if (!Number.isFinite(total)) return Number((bonusMap && bonusMap[statKey]) || 0);
  bonusMap[statKey] = normalizeDiscreteStatBonusInteger(total);
  return bonusMap[statKey];
}

function addNumericStatBonusEntries(bonusMap = {}, deltaMap = {}) {
  Object.entries(deltaMap || {}).forEach(([statKey, delta]) => {
    addNumericStatBonusValue(bonusMap, statKey, delta);
  });
}

function ensureNumericStatBonusMap(target = {}, fieldName = '') {
  const normalized = createNumericStatBonusMap(fieldName ? target?.[fieldName] : target);
  if (fieldName) {
    target[fieldName] = normalized;
    return target[fieldName];
  }
  Object.assign(target, normalized);
  return target;
}

const 武魂相关度基础待补全提示词 = '待补全(请根据双方武魂系别/属性体系与剧情协同填写0-100基础分，通常为0)';

function 计算武魂相关度关系加成(好感度 = 0) {
  const 安全好感度 = Number(好感度 || 0);
  if (!Number.isFinite(安全好感度)) return 0;
  return Math.max(0, Math.min(20, Math.floor(Math.max(0, 安全好感度) / 10)));
}

function 读取武魂相关度基础值(关系数据 = {}) {
  const 原值 = Number(关系数据?.武魂相关度基础);
  if (!Number.isFinite(原值)) return null;
  return Math.max(0, Math.min(100, Math.floor(原值)));
}

function 规范武魂相关度基础字段(关系数据 = {}) {
  if (!关系数据 || typeof 关系数据 !== 'object') return;
  const 基础值 = 读取武魂相关度基础值(关系数据);
  关系数据.武魂相关度基础 = 基础值 == null ? 武魂相关度基础待补全提示词 : 基础值;
  delete 关系数据.武魂相关度关系加成;
  delete 关系数据.武魂相关度总分;
  delete 关系数据.武魂相关度状态;
  delete 关系数据.武魂相关度说明;
  delete 关系数据.武魂相关度更新时间tick;
}

function 计算武魂相关度总分(关系数据 = {}) {
  const 基础值 = 读取武魂相关度基础值(关系数据);
  const 关系加成 = 计算武魂相关度关系加成(关系数据?.好感度);
  const 原始总分 = (基础值 == null ? 0 : 基础值) + 关系加成;
  return Math.max(0, Math.min(100, Math.floor(原始总分)));
}

function 构建默认社交关系数据() {
  return {
    关系: '陌生',
    好感度: 0,
    关系路线: '朋友线',
    对方身份: '无',
    好感加成: '无',
    武魂相关度基础: 武魂相关度基础待补全提示词,
  };
}

function buildNumericStatBonusSummary(bonusMap = {}) {
  const labels = {
    力量: '力量',
    防御: '防御',
    敏捷: '敏捷',
    体力上限: '体力上限',
    精神力上限: '精神力上限',
    魂力上限: '魂力上限',
  };
  const segments = [];
  Object.entries(createExtendedStatBonusMap(bonusMap)).forEach(([key, value]) => {
    const amount = Math.floor(Number(value || 0));
    if (amount > 0 && labels[key]) segments.push(`${labels[key]}+${amount}`);
  });
  return segments.join('，') || '无';
}

function getPersistentSoulPowerBonusFromPermanentRecords(char = {}) {
  return Object.values(char?.血脉之力?.永久加成 || {}).reduce(
    (total, record) => total + normalizeDiscreteStatBonusInteger(record?.属性加成?.魂力上限),
    0,
  );
}

function isNoSoulPowerTalentTier(talentTier = '') {
  return String(talentTier || '').trim() === '天赋极差';
}

const TOP_TALENT_LATE_BLOOM_THRESHOLD_ACU = 1.03;
const TOP_TALENT_LATE_BLOOM_GROWTH_MULTIPLIER_ACU = 3.0;
const TOP_TALENT_LATE_BLOOM_STAGE3_CHANCE_MULTIPLIER_ACU = 2.5 / 0.9;
const TOP_TALENT_LATE_BLOOM_STAGE3_BOTTLENECK_MULTIPLIER_ACU = 8.0;
const TALENT_BACKGROUND_SCORE_BONUS_ACU = Object.freeze({
  平民: 0,
  普通势力: 20,
  一流势力: 50,
  顶级势力: 80,
});
const TALENT_BACKGROUND_RARE_BONUS_ODDS_ACU = Object.freeze({
  平民: Object.freeze({ 顶级天才: 0.001, 绝世妖孽: 0.0002 }),
  普通势力: Object.freeze({ 顶级天才: 0.003, 绝世妖孽: 0.0005 }),
  一流势力: Object.freeze({ 顶级天才: 0.008, 绝世妖孽: 0.001 }),
  顶级势力: Object.freeze({ 顶级天才: 0, 绝世妖孽: 0 }),
});
const TALENT_SCORE_THRESHOLDS_ACU = Object.freeze({
  正常: 450,
  优秀: 750,
  天才: 950,
  顶级天才: 1051,
  绝世妖孽: 1071,
});
const GOOD_TALENT_LATE_BLOOM_THRESHOLD_ACU = 1.0456;
const GOOD_TALENT_LATE_BLOOM_GROWTH_MULTIPLIER_ACU = 11.1174;
const GOOD_TALENT_LATE_BLOOM_STAGE12_CHANCE_MULTIPLIER_ACU = 4.8226;
const GOOD_TALENT_LATE_BLOOM_STAGE1_BOTTLENECK_MULTIPLIER_ACU = 3.3162;
const GOOD_TALENT_LATE_BLOOM_STAGE2_BOTTLENECK_MULTIPLIER_ACU = 3.3910;
const GOOD_TALENT_STAGE1_GROWTH_MULTIPLIER_ACU = 1.5632;
const GOOD_TALENT_STAGE2_GROWTH_MULTIPLIER_ACU = 1.7770;
const GOOD_TALENT_STAGE3_GROWTH_MULTIPLIER_ACU = 1.1850;
const GOOD_TALENT_LATE_BLOOM_START_AGE_ACU = 33;
function isTopTalentLateBloom_ACU(char = {}) {
  return (
    String(char?.属性?.天赋梯队 || '').trim() === '顶级天才' &&
    Number(char?.属性?.底子波动 || 0) >= TOP_TALENT_LATE_BLOOM_THRESHOLD_ACU
  );
}

function isGoodTalentLateBloom_ACU(char = {}) {
  return (
    String(char?.属性?.天赋梯队 || '').trim() === '优秀' &&
    Number(char?.属性?.底子波动 || 0) >= GOOD_TALENT_LATE_BLOOM_THRESHOLD_ACU
  );
}

function getSpiritHerbSoulPowerGain_ACU(age = 0) {
  return Math.max(10, Math.floor(Math.max(0, Number(age || 0)) * 0.1));
}

function getUpgradedTalentTier_ACU(currentTier = '') {
  const talentOrder = ['天赋极差', '劣等', '正常', '优秀', '天才', '顶级天才', '绝世妖孽'];
  const normalizedTier = String(currentTier || '').trim();
  const index = talentOrder.indexOf(normalizedTier);
  if (index < 0) return normalizedTier || '正常';
  if (index >= talentOrder.length - 1) return talentOrder[index];
  return talentOrder[index + 1];
}

function applyHundredThousandSpiritHerbBonus_ACU(char = {}) {
  if (!char?.属性 || Number(char?.状态?.吸收灵物年限 || 0) < 100000) return [];
  const messages = [];
  const originalHiddenVar = Math.max(0.1, Number(char.属性?.底子波动 || 1));
  char.属性.底子波动 = Number((originalHiddenVar + 0.03).toFixed(4));
  messages.push(`底子提升至 ${char.属性.底子波动.toFixed(4)}`);

  if (originalHiddenVar > 1.02) {
    const currentTier = String(char.属性?.天赋梯队 || '').trim() || '正常';
    const nextTier = getUpgradedTalentTier_ACU(currentTier);
    if (nextTier && nextTier !== currentTier) {
      char.属性.天赋梯队 = nextTier;
      messages.push(`天赋由【${currentTier}】提升为【${nextTier}】`);
    }
  }
  return messages;
}

function getTalentCultivationStopAge_ACU(talentTier = '') {
  return (
    {
      劣等: 40,
      正常: 50,
      优秀: 60,
      天才: 90,
      顶级天才: 100,
      绝世妖孽: 120,
    }[String(talentTier || '').trim()] ?? null
  );
}

function canTalentContinueCultivating_ACU(char = {}) {
  const stopAge = getTalentCultivationStopAge_ACU(char?.属性?.天赋梯队);
  if (!Number.isFinite(Number(stopAge))) return true;
  return Number(char?.属性?.年龄 || 0) < Number(stopAge);
}

function normalizeNoSoulPowerCharacterData(char = {}) {
  if (!char || typeof char !== 'object') return char;
  if (!char.属性 || typeof char.属性 !== 'object') char.属性 = {};
  if (!char.武魂 || typeof char.武魂 !== 'object') char.武魂 = {};
  if (!char.装备 || typeof char.装备 !== 'object') char.装备 = {};
  if (!char.装备.斗铠 || typeof char.装备.斗铠 !== 'object') char.装备.斗铠 = {};
  if (!char.装备.机甲 || typeof char.装备.机甲 !== 'object') char.装备.机甲 = {};
  if (!char.装备.武器 || typeof char.装备.武器 !== 'object') char.装备.武器 = {};

  char.属性.等级 = 0;
  char.属性.系别 = '普通人';
  char.属性.等级惩罚 = 0;
  char.属性.魂力 = 0;
  char.属性.魂力上限 = 0;
  char.属性.基础魂力上限 = 0;
  char.属性.突破魂力上限 = 0;
  char.属性.永久魂力加成 = 0;
  char.属性.精神境界 = '无';
  char.属性.上次灵物等级 = -20;

  if (char.状态 && typeof char.状态 === 'object') delete char.状态.待选魂环;

  const trimmedSpirits = {};
  Object.keys(char.武魂 || {}).forEach(spiritKey => {
    const spiritData = char.武魂?.[spiritKey];
    const spiritName = String(spiritData?.表象名称 || spiritData?.名称 || spiritKey || '无').trim() || '无';
    trimmedSpirits[spiritKey] = {
      名称: spiritName,
      表象名称: spiritName,
    };
  });
  char.武魂 = trimmedSpirits;

  char.魂核 = {};
  char.魂骨 = {};
  char.武魂融合技 = {};

  if (char.血脉之力 && typeof char.血脉之力 === 'object') {
    char.血脉之力.核心 = '未凝聚';
    char.血脉之力.解封层数 = 0;
    char.血脉之力.技能 = {};
    char.血脉之力.被动 = {};
    char.血脉之力.气血魂环 = {};
    char.血脉之力.永久加成 = {};
  }

  char.装备.斗铠.等级 = 0;
  char.装备.斗铠.名称 = '无';
  char.装备.斗铠.装备状态 = '未装备';
  char.装备.斗铠.领域 = '无';
  char.装备.斗铠.材质 = '无';
  char.装备.斗铠.部件 = {};
  char.装备.斗铠._属性加成 = { 等效等级: 0, 魂力上限: 0, 精神力上限: 0, 力量: 0, 防御: 0, 敏捷: 0, 体力上限: 0 };

  char.装备.机甲.等级 = '无';
  char.装备.机甲.型号 = '无';
  char.装备.机甲.材质 = '无';
  char.装备.机甲.状态 = '完好';
  char.装备.机甲.装备状态 = '未装备';
  char.装备.机甲.武装 = '无';
  char.装备.机甲.品质系数 = 1.0;
  char.装备.机甲._属性加成 = { 魂力上限: 0, 精神力上限: 0, 力量: 0, 防御: 0, 敏捷: 0, 体力上限: 0 };

  return char;
}

function shouldIgnoreStaticRingBoneSoulPowerByFormula(char = {}, context = {}) {
  const playerName = String(context?.playerName || '').trim();
  const charName = String(context?.charName || '').trim();
  const explicitLevel = Math.max(0, Math.floor(Number(context?.explicitLevel || 0)));
  const breakthroughSeed = Math.max(0, Math.floor(Number(context?.breakthroughSoulPowerSeed || 0)));
  const baseWithoutRingBone = Math.max(0, Math.floor(Number(context?.baseWithoutRingBoneSoulPower || 0)));
  const ringBoneSoulPowerBonus = Math.max(0, Math.floor(Number(context?.ringBoneSoulPowerBonus || 0)));

  if (!char || typeof char !== 'object') return false;
  if (!playerName || !charName || charName === playerName) return false;
  if (explicitLevel <= 1) return false;
  if (!(ringBoneSoulPowerBonus > 0)) return false;

  const tolerance = Math.max(3, Math.ceil(ringBoneSoulPowerBonus * 0.02));
  return (
    breakthroughSeed <= baseWithoutRingBone + tolerance &&
    breakthroughSeed < baseWithoutRingBone + ringBoneSoulPowerBonus - tolerance
  );
}

function getDualSpiritSoulPowerCoeff(char = {}) {
  const spiritEntries = Object.entries(char?.武魂 || {}).filter(([, spiritData]) => spiritData && typeof spiritData === 'object');
  return spiritEntries.length >= 2 ? 1.2 : 1.0;
}

function normalizeStatHpFields(stat = {}) {
  if (!stat || typeof stat !== 'object') return { HP: 0, HP上限: 1 };
  const hpMaxFallback = Math.max(1, Number(stat.体力上限 || 1));
  const hpMax = Math.max(1, Number.isFinite(Number(stat.HP上限)) ? Number(stat.HP上限) : hpMaxFallback);
  const hpFallback = Number.isFinite(Number(stat.体力)) ? Number(stat.体力) : hpMax;
  const hp = Math.max(0, Math.min(hpMax, Number.isFinite(Number(stat.HP)) ? Number(stat.HP) : hpFallback));
  stat.HP上限 = hpMax;
  stat.HP = hp;
  return { HP: hp, HP上限: hpMax };
}

function getComputedWoundLevelFromStat(stat = {}) {
  const { HP, HP上限 } = normalizeStatHpFields(stat);
  const ratio = HP / Math.max(1, HP上限);
  if (ratio <= 0.05 && HP > 0) return '濒死';
  if (ratio <= 0.2) return '重伤';
  if (ratio <= 0.5) return '轻伤';
  return '无';
}

function getComputedWoundRecoveryRatioFromStat(stat = {}) {
  const woundLevel = getComputedWoundLevelFromStat(stat);
  if (woundLevel === '轻伤') return 0.7;
  if (woundLevel === '重伤') return 0.3;
  if (woundLevel === '濒死') return 0.05;
  return 1.0;
}

function getComputedFatiguePenaltyMultiplierFromStat(stat = {}) {
  const vitMax = Math.max(1, Number(stat?.体力上限 || 1));
  const vit = Math.max(0, Math.min(vitMax, Number(stat?.体力 || 0)));
  const ratio = vit / vitMax;
  if (ratio > 0.5) return 1.0;
  if (ratio > 0.3) return 0.9;
  if (ratio > 0.1) return 0.7;
  return 0.5;
}

const GOLDEN_DRAGON_PERMANENT_BONUS_NODES = {
  7: {
    名称: '【第七层·体魄升华I】',
    描述: '永久额外提升基础力量、体力、防御与魂力上限5%。',
    百分比: { 力量: 0.05, 防御: 0.05, 体力上限: 0.05, 魂力上限: 0.05 },
  },
  9: {
    名称: '【第九层·体魄升华II】·永久成长',
    描述: '解封时按当前体力上限额外固化10%永久成长。',
    百分比: { 体力上限: 0.1 },
  },
  13: {
    名称: '【第十三层·体魄升华III】',
    描述: '永久额外提升基础力量、体力、防御与魂力上限5%。',
    百分比: { 力量: 0.05, 防御: 0.05, 体力上限: 0.05, 魂力上限: 0.05 },
  },
  15: {
    名称: '【第十五层·体魄升华IV】',
    描述: '永久额外提升基础力量、体力、防御与魂力上限5%。',
    百分比: { 力量: 0.05, 防御: 0.05, 体力上限: 0.05, 魂力上限: 0.05 },
  },
};

const GOLDEN_DRAGON_NON_SKILL_NODE_NAMES = new Set(
  Object.entries(GOLDEN_DRAGON_PERMANENT_BONUS_NODES)
    .filter(([seal]) => [7, 13, 15].includes(Number(seal)))
    .map(([, node]) => node?.名称)
    .filter(Boolean),
);

function applyGoldenDragonPermanentBonusNodes(char, currentStats = {}) {
  if (!char?.血脉之力 || !String(char.血脉之力.血脉 || '').includes('金龙王'))
    return createExtendedStatBonusMap();
  if (!char.属性 || typeof char.属性 !== 'object') return createExtendedStatBonusMap();
  if (!char.血脉之力.永久加成 || typeof char.血脉之力.永久加成 !== 'object')
    char.血脉之力.永久加成 = {};
  const trainedBonus = ensureNumericStatBonusMap(char.属性, '训练加成');
  const totalAdded = createExtendedStatBonusMap();
  const virtualStats = createExtendedStatBonusMap(currentStats);
  Object.entries(GOLDEN_DRAGON_PERMANENT_BONUS_NODES)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .forEach(([sealKey, node]) => {
      const sealLv = Number(sealKey || 0);
      if (sealLv <= 0 || sealLv > Number(char.血脉之力?.解封层数 || 0)) return;
      const recordKey = String(node?.名称 || `第${sealLv}层永久成长`);
      if (char.血脉之力.永久加成[recordKey]) return;
      const appliedBonus = createExtendedStatBonusMap();
      Object.entries(node?.百分比 || {}).forEach(([statKey, ratio]) => {
        const gain = Math.max(
          0,
          Math.floor(Math.max(0, Number(virtualStats[statKey] || 0)) * Math.max(0, Number(ratio || 0))),
        );
        appliedBonus[statKey] = gain;
        totalAdded[statKey] += gain;
        if (statKey !== '魂力上限') {
          trainedBonus[statKey] = Number(trainedBonus[statKey] || 0) + gain;
        }
        virtualStats[statKey] = Number(virtualStats[statKey] || 0) + gain;
      });
      const effectText = buildNumericStatBonusSummary(appliedBonus);
      char.血脉之力.永久加成[recordKey] = {
        名称: recordKey,
        描述: String(node?.描述 || '无'),
        来源层级: sealLv,
        状态: '已固化',
        属性加成: appliedBonus,
        效果描述: effectText === '无' ? String(node?.描述 || '无') : `解封时已按当前属性固化：${effectText}`,
      };
    });
  return totalAdded;
}

const GoldenDragonSkills = {
  1: {
    技能名称: '【第一层·金龙爪(右)】',
    状态: '已固化',
    画面描述: '右臂异化为巨大的暗金龙爪，附带霸道的“粉碎”特性，能轻易捏碎同阶魂师的武魂与防御。',
    效果描述: '对单体造成极高的物理伤害，无视目标40%的防御力。若目标处于护盾状态，将对其护盾造成双倍破坏。',
    _效果数组: [
      { 机制: '系统基础', 消耗: '体力:150', 对象: '敌方/单体', 技能类型: '输出/破甲', cast_time: 10 },
      { 机制: '直接伤害', 目标: '敌方单体', 威力倍率: 200, 伤害类型: '物理近战', 穿透修饰: 40 },
    ],
  },
  2: {
    技能名称: '【第二层·金龙体】',
    状态: '已固化',
    画面描述: '金鳞蔓延至右侧躯干，气血透体而出，肉体强度获得全方位跨阶暴涨。',
    效果描述: '进入霸体状态，自身力量与防御临时提升50%。',
    _效果数组: [
      { 机制: '系统基础', 消耗: '体力:100(启动)+20/回合(维持)', 对象: '自身', 技能类型: '增益/防御', cast_time: 5 },
      { 机制: '霸体', 目标: '自身', 持续回合: 3 },
      { 机制: '属性变化', 对象: '自身', 属性: 'str', 动作: '倍率提升', 数值: 1.5, 持续: 3, 触发: '状态持续' },
      { 机制: '属性变化', 对象: '自身', 属性: 'def', 动作: '倍率提升', 数值: 1.5, 持续: 3, 触发: '状态持续' },
    ],
  },
  3: {
    技能名称: '【第三层·金龙吼】',
    状态: '已固化',
    画面描述: '胸口爆发出震天动地的龙吟，实质化的音波夹杂着上位龙族的恐怖威压席卷全场。',
    效果描述: '对范围内敌人造成群体伤害，附加1回合眩晕，并削弱其20%全属性（对龙类效果翻倍）。',
    _效果数组: [
      { 机制: '系统基础', 消耗: '体力:300', 对象: '敌方/群体', 技能类型: '控制/削弱', cast_time: 15 },
      { 机制: '直接伤害', 目标: '敌方群体', 威力倍率: 150, 伤害类型: '物理远程', 穿透修饰: 10 },
      { 机制: '硬控', 目标: '敌方群体', 持续回合: 1 },
      { 机制: '属性变化', 对象: '敌方群体', 属性: 'str', 动作: '倍率压制', 数值: 0.8, 持续: 2, 触发: '状态持续' },
      { 机制: '属性变化', 对象: '敌方群体', 属性: 'def', 动作: '倍率压制', 数值: 0.8, 持续: 2, 触发: '状态持续' },
      { 机制: '属性变化', 对象: '敌方群体', 属性: 'agi', 动作: '倍率压制', 数值: 0.8, 持续: 2, 触发: '状态持续' },
      { 机制: '属性变化', 对象: '敌方群体', 属性: 'men_max', 动作: '倍率压制', 数值: 0.8, 持续: 2, 触发: '状态持续' },
    ],
  },
  4: {
    技能名称: '【第四层·金龙霸体】',
    状态: '已固化',
    画面描述: '全身龙鳞瞬间闭合，化作一层坚不可摧的暗金铠甲，硬抗毁灭性打击。',
    效果描述: '凝聚巨额护盾，防御力翻倍，持续2回合，期间免疫一次致死打击。',
    _效果数组: [
      { 机制: '系统基础', 消耗: '体力:500', 对象: '自身', 技能类型: '防御/护盾', cast_time: 5 },
      { 机制: '护盾', 目标: '自身', 护盾值: 5000, 持续回合: 2 },
      { 机制: '免死', 目标: '自身', 持续回合: 2, 触发次数: 1 },
      { 机制: '属性变化', 对象: '自身', 属性: 'def', 动作: '倍率提升', 数值: 2.0, 持续: 2, 触发: '状态持续' },
    ],
  },
  5: {
    技能名称: '【第五层·金龙爪(左)】',
    状态: '已固化',
    画面描述: '左臂异化为带有“撕裂”特性的金龙爪，双爪交击的脆鸣是精神幻境的绝对克星。',
    效果描述: '对单体造成高额伤害并施加撕裂流血。若双爪共鸣可解除强控与幻境。',
    _效果数组: [
      { 机制: '系统基础', 消耗: '体力:150', 对象: '敌方/单体', 技能类型: '输出/真伤', cast_time: 10 },
      { 机制: '直接伤害', 目标: '敌方单体', 威力倍率: 200, 伤害类型: '物理近战', 穿透修饰: 20 },
      { 机制: '状态挂载', 状态名称: '撕裂流血', 持续回合: 3, 计算层效果: { dot_damage: 1000 } },
      { 机制: '解控', 目标: '自身', 清除层级: 2 },
    ],
  },
  6: {
    技能名称: '【第六层·金龙镇威】',
    状态: '已固化',
    画面描述: '发出一声震天动地的纯正龙吟，声波中蕴含着金龙王至高无上的血脉威压，令万兽臣服。',
    效果描述: '全场大幅度压制，降低所有敌人15%全属性面板，必定打断正在蓄力的敌人。',
    _效果数组: [
      { 机制: '系统基础', 消耗: '体力:200 | 精神力:800', 对象: '全场', 技能类型: '控制/削弱', cast_time: 10 },
      { 机制: '打断', 目标: '全场', 中断概率: 1.0 },
      { 机制: '属性变化', 对象: '敌方群体', 属性: 'str', 动作: '倍率压制', 数值: 0.85, 持续: 2, 触发: '状态持续' },
      { 机制: '属性变化', 对象: '敌方群体', 属性: 'def', 动作: '倍率压制', 数值: 0.85, 持续: 2, 触发: '状态持续' },
      { 机制: '属性变化', 对象: '敌方群体', 属性: 'agi', 动作: '倍率压制', 数值: 0.85, 持续: 2, 触发: '状态持续' },
      { 机制: '属性变化', 对象: '敌方群体', 属性: 'men_max', 动作: '倍率压制', 数值: 0.85, 持续: 2, 触发: '状态持续' },
    ],
  },
  7: null,
  8: {
    技能名称: '【第八层·嗜血领域】',
    状态: '已固化',
    画面描述: '暗金色的光环以自身为中心轰然扩散，点燃了领域内所有友军的气血。',
    效果描述: '展开领域：范围内友军力量、防御、体力临时提升15%，并小幅强化魂力恢复效率。',
    _效果数组: [
      { 机制: '系统基础', 消耗: '体力:500(启动)+100/回合', 对象: '全场', 技能类型: '领域/增益', cast_time: 20 },
      { 机制: '召唤与场地', 实体名称: '嗜血领域', 持续回合: 5, 核心机制描述: '友军增益光环' },
      { 机制: '属性变化', 对象: '友方群体', 属性: 'str', 动作: '倍率提升', 数值: 1.15, 持续: 5, 触发: '状态持续' },
      { 机制: '属性变化', 对象: '友方群体', 属性: 'def', 动作: '倍率提升', 数值: 1.15, 持续: 5, 触发: '状态持续' },
      { 机制: '属性变化', 对象: '友方群体', 属性: 'vit_max', 动作: '倍率提升', 数值: 1.15, 持续: 5, 触发: '状态持续' },
      { 机制: '持续恢复', 对象: '友方群体', 属性: 'sp', 动作: '持续恢复', 数值: 0.1, 持续: 5, 触发: '每回合' },
    ],
  },
  9: {
    技能名称: '【第九层·体魄升华II】',
    状态: '已固化',
    画面描述: '心脏跳动如战鼓，气血生生不息，再无枯竭之忧。',
    效果描述: '被动：战斗中自然体力恢复量强制翻倍。',
    _效果数组: [
      { 机制: '系统基础', 消耗: '无', 对象: '自身', 技能类型: '被动', cast_time: 0 },
      { 机制: '状态挂载', 状态名称: '生生不息', 持续回合: 999, 计算层效果: { final_heal_mult: 2.0 } },
    ],
  },
  10: {
    技能名称: '【第十层·金龙飞翔】',
    状态: '已固化',
    画面描述: '气血漩涡压缩化为龙核，背后展开巨大暗金龙翼。突进并引爆毁灭性气血之力。',
    效果描述: '大幅提升自身机动性。若目标防御极低，命中时施加最大生命值15%的绝对真实伤害。',
    _效果数组: [
      { 机制: '系统基础', 消耗: '体力:1000', 对象: '敌方/单体', 技能类型: '位移/爆发', cast_time: 15 },
      { 机制: '直接伤害', 目标: '敌方单体', 威力倍率: 300, 伤害类型: '物理近战', 穿透修饰: 50 },
      {
        机制: '斩杀补伤',
        目标: '敌方单体',
        判定属性: 'def_ratio',
        判定阈值: 0.5,
        成功参数: { dot_damage: '15%_max_hp' },
        失败参数: {},
      },
    ],
  },
  11: {
    技能名称: '【第十一层·金龙罡气】',
    状态: '已固化',
    画面描述: '体表自然流转着一层坚不可摧的暗金色罡气，散发着上位龙族的恐怖威压。',
    效果描述: '被动：体表常驻金龙罡气护体，防御力提升20%。',
    _效果数组: [
      { 机制: '系统基础', 消耗: '无', 对象: '自身', 技能类型: '被动/防御', cast_time: 0 },
      { 机制: '属性变化', 对象: '自身', 属性: 'def', 动作: '倍率提升', 数值: 1.2, 持续: 999, 触发: '常驻' },
    ],
  },
  12: {
    技能名称: '【第十二层·金龙镇狱杀】',
    状态: '已固化',
    画面描述: '无数暗金色的巨龙虚影从天而降，化作绝对的重力囚笼，将整片空间彻底镇杀。',
    效果描述: '对大范围敌人造成毁灭性打击，强制施加禁锢，使其无法移动与闪避。',
    _效果数组: [
      {
        机制: '系统基础',
        消耗: '体力:2000 | 精神力:1000',
        对象: '敌方/群体',
        技能类型: '高阶控制/爆发',
        cast_time: 30,
      },
      { 机制: '直接伤害', 目标: '敌方群体', 威力倍率: 400, 伤害类型: '物理远程', 穿透修饰: 30 },
      { 机制: '状态挂载', 状态名称: '镇狱禁锢', 持续回合: 1, 计算层效果: { cannot_react: true, dodge_penalty: -1.0 } },
    ],
  },
  13: null,
  14: {
    技能名称: '【第十四层·金龙真身】',
    状态: '已固化',
    画面描述: '彻底化身为长达百米的纯血暗金巨龙。气血不枯，不死不灭的战争机器。',
    效果描述: '消耗5000体力，立即回满体力并进入5回合金龙真身。期间获得极强濒死保护，所有金龙王血脉技能威力提升100%。',
    _效果数组: [
      { 机制: '系统基础', 消耗: '体力:5000', 对象: '自身', 技能类型: '真身/绝技', cast_time: 20 },
      { 机制: '免死', 目标: '自身', 持续回合: 5, 触发次数: 99 },
      { 机制: '属性变化', 对象: '自身', 属性: '威力', 动作: '倍率提升', 数值: 2.0, 持续: 5, 触发: '状态持续' },
      { 机制: '属性变化', 对象: '自身', 属性: 'vit', 动作: '加值', 数值: 1.0, 持续: 0, 触发: '立即生效' },
    ],
  },
  15: null,
  16: {
    技能名称: '【第十六层·黄金龙瀑】',
    状态: '已固化',
    画面描述: '第八血脉魂环化作液态的黄金光辉环绕周身，拥有独立神级灵性，自动护主。',
    效果描述: '面临致命攻击或强控时自动触发，消耗体力抵消攻击并提供高额适应性增益。',
    _效果数组: [
      { 机制: '系统基础', 消耗: '体力:10%', 对象: '自身', 技能类型: '被动/反制', cast_time: 0 },
      { 机制: '受击反击', 目标: '自身', 持续回合: 999, 核心机制描述: '自动抵消致命伤害/强控' },
      { 机制: '免死', 目标: '自身', 持续回合: 999, 触发次数: 99 },
    ],
  },
};

function isPassiveSkillStructData(skill) {
  if (!skill || typeof skill !== 'object') return false;
  const effects = Array.isArray(skill._效果数组) ? skill._效果数组 : [];
  const systemBase = effects.find(effect => effect && effect.机制 === '系统基础') || {};
  const rawType = String(systemBase.技能类型 || skill.技能类型 || '').trim();
  return /被动/.test(rawType);
}

function buildSeventhRingTrueBodySkill(
  type = '强攻系',
  talentTier = '正常',
  ringAge = 10000,
  ringIndex = 7,
  compatibility = 100,
  textContext = {},
  sourceQuality = '',
) {
  const gradeInfo = judgeSkillGrade(talentTier, ringAge, ringIndex, compatibility, sourceQuality);
  const grade = normalizeSkillTableGrade(gradeInfo.grade);
  const quality = gradeInfo.quality;
  const duration = { C: 3, B: 4, A: 5, S: 6 }[grade] || 4;
  const spiritName =
    !isAiTodoText(textContext?.spiritName) && String(textContext?.spiritName || '') !== '未展露'
      ? String(textContext.spiritName).trim()
      : '';
  const skillName = spiritName ? `${spiritName}真身` : '武魂真身';
  const statMods = { str: 1.2, def: 1.2, agi: 1.2, men_max: 1.2, sp_max: 1.2 };
  const calc = { control_resist_mult: { C: 1.15, B: 1.25, A: 1.35, S: 1.5 }[grade] || 1.25 };
  const costMap = {
    C: '魂力:800',
    B: '魂力:1200',
    A: '魂力:1800 | 精神力:200',
    S: '魂力:2500 | 精神力:400',
  };
  if (type === '强攻系') {
    statMods.str = 1.55;
    statMods.def = 1.3;
    statMods.agi = 1.2;
    statMods.sp_max = 1.15;
    calc.final_damage_mult = { C: 1.2, B: 1.35, A: 1.5, S: 1.7 }[grade] || 1.35;
  } else if (type === '敏攻系') {
    statMods.agi = 1.55;
    statMods.str = 1.3;
    statMods.def = 1.15;
    calc.final_damage_mult = { C: 1.18, B: 1.3, A: 1.42, S: 1.6 }[grade] || 1.3;
  } else if (type === '防御系') {
    statMods.def = 1.6;
    statMods.sp_max = 1.15;
    calc.shield_gain_mult = { C: 1.2, B: 1.35, A: 1.5, S: 1.7 }[grade] || 1.35;
  } else if (type === '辅助系' || type === '治疗系' || type === '食物系') {
    statMods.sp_max = 1.35;
    statMods.men_max = 1.3;
    statMods.def = 1.15;
    calc.final_heal_mult = { C: 1.2, B: 1.35, A: 1.5, S: 1.7 }[grade] || 1.35;
  } else if (type === '控制系' || type === '精神系') {
    statMods.men_max = 1.55;
    statMods.agi = 1.2;
    statMods.sp_max = 1.2;
    calc.hit_bonus = { C: 0.08, B: 0.12, A: 0.18, S: 0.25 }[grade] || 0.12;
    calc.control_success_bonus = { C: 0.08, B: 0.12, A: 0.18, S: 0.25 }[grade] || 0.12;
  } else if (type === '元素系') {
    statMods.sp_max = 1.4;
    statMods.men_max = 1.25;
    statMods.agi = 1.15;
    calc.final_damage_mult = { C: 1.18, B: 1.3, A: 1.45, S: 1.6 }[grade] || 1.3;
  }
  const trueBodyEffects = [
    ...buildPackedAttributeEffectsFromRatios('自身', statMods, duration),
  ];
  if (Number(calc.control_resist_mult || 1) > 1)
    trueBodyEffects.push(
      buildPackedAttributeEffect('掌控修正', '自身', '控制', '倍率提升', Number(calc.control_resist_mult || 1), duration, '状态持续'),
    );
  if (Number(calc.final_damage_mult || 1) > 1)
    trueBodyEffects.push(
      buildPackedAttributeEffect('属性变化', '自身', '威力', '倍率提升', Number(calc.final_damage_mult || 1), duration, '状态持续'),
    );
  if (Number(calc.final_heal_mult || 1) > 1)
    trueBodyEffects.push(
      buildPackedAttributeEffect('属性变化', '自身', '威力', '倍率提升', Number(calc.final_heal_mult || 1), duration, '状态持续'),
    );
  if (Number(calc.shield_gain_mult || 1) > 1)
    trueBodyEffects.push(
      buildPackedAttributeEffect('属性变化', '自身', 'def', '倍率提升', Number(calc.shield_gain_mult || 1), duration, '状态持续'),
    );
  if (Number(calc.control_success_bonus || 0) > 0)
    trueBodyEffects.push(
      buildPackedAttributeEffect(
        '掌控修正',
        '自身',
        '掌控',
        '倍率提升',
        Number((1 + Number(calc.control_success_bonus || 0)).toFixed(2)),
        duration,
        '状态持续',
      ),
    );
  const 生成结果 = {
    魂技名: skillName,
    画面描述: AI_TODO_SKILL_VISUAL,
    效果描述: AI_TODO_SKILL_EFFECT,
    _效果数组: [
      {
        机制: '系统基础',
        消耗: costMap[grade] || costMap.B,
        对象: '自身',
        技能类型: '真身/增幅',
        cast_time: 20,
        级别: quality,
      },
      ...trueBodyEffects.filter(Boolean),
    ],
  };
  return 收口技能执行结构_V1(生成结果, { 目标模型: '自身' });
}

function autoGenerateSkill(
  type,
  talentTier,
  ringAge,
  ringIndex,
  compatibility = 100,
  preferredSecondary = [],
  currentTick = 0,
  options = {},
) {
  const gradeInfo = judgeSkillGrade(
    talentTier,
    ringAge,
    ringIndex,
    compatibility,
    String(options?.sourceQuality || options?.来源品质 || '').trim(),
  );
  const overrideGrade = String(options?.gradeOverride || '').trim();
  const overrideQuality = String(options?.qualityOverride || '').trim();
  const rawGrade = normalizeSkillGradeSymbol(overrideGrade || gradeInfo.grade);
  const grade = normalizeSkillTableGrade(rawGrade);
  const quality = overrideQuality || gradeInfo.quality;
  const roll = gradeInfo.scoreRoll;
  const skillSourceCategory = String(options?.sourceCategory || options?.技能来源 || '魂技').trim() || '魂技';
  if (skillSourceCategory === '魂技' && Math.max(1, Number(ringIndex || 1)) === 7 && options?.forceTrueBody !== false) {
    return buildSeventhRingTrueBodySkill(
      type,
      talentTier,
      ringAge,
      ringIndex,
      compatibility,
      options?.textContext || {},
      String(options?.sourceQuality || options?.来源品质 || '').trim(),
    );
  }

  const blueprint =
    options?.blueprintOverride && typeof options.blueprintOverride === 'object'
      ? normalizeBlueprintOverrideForAutoGenerate(options.blueprintOverride, type, grade, ringIndex, preferredSecondary, options)
      : rollSkillBlueprint(type, rawGrade, ringIndex, preferredSecondary, {
          spiritName: String(options?.textContext?.spiritName || '').trim(),
          sourceName: String(options?.textContext?.spiritName || '').trim(),
        });
  const 战斗 = buildSkillCombatProfile(blueprint, { quality, ringIndex, ringAge, type });
  const main = blueprint.主机制大类;
  const archetype = blueprint.主机制原型;
  const secondary = blueprint.副机制 || [];
  const mutation = blueprint.变异机制 || [];
  const 副作用列表 = normalizeSkillSideEffectList(
    Array.isArray(options?.副作用列表) && options.副作用列表.length
      ? options.副作用列表
      : buildAutoGeneratedSkillSideEffectListV1(mutation, {
          状态名称: 战斗?.仲裁逻辑?.状态挂载模块?.状态名称 || archetype,
          主机制原型: archetype,
          副作用持续回合: Math.max(1, Math.round(Number((战斗?.仲裁逻辑?.状态挂载模块?.持续回合 || 0) || 2))),
        }),
  );
  const attrs = Array.isArray(blueprint?.加成属性候选) ? blueprint.加成属性候选 : ['魂力'];
  const gradeFactor = { C: 1, B: 2, A: 3, S: 4 }[grade] || 1;
  const selfSacrificeVitCost = mutation.includes('自残换收益') ? 30 + ringIndex * 10 : 0;
  const secondaryEffectScale = getSecondaryRingScale(ringIndex);
  const secondaryDurationScale = Math.max(0.7, secondaryEffectScale);
  const passiveMode = options?.passiveMode === true;
  const passiveNameHint = String(options?.passiveName || '').trim();
  const reverseTargetMap = {
    自身: '自身',
    '己方/单体': '友方单体',
    '己方/群体': '友方群体',
    '敌方/单体': '敌方单体',
    '敌方/群体': '敌方群体',
    全场: '全场',
  };
  const normalizedTarget = blueprint.目标模型 || reverseTargetMap[战斗.对象] || '敌方单体';
  const sharedMechanismRegistry =
    typeof globalThis !== 'undefined' &&
    globalThis.__LWCS_SKILL_MECHANISM_REGISTRY__ &&
    typeof globalThis.__LWCS_SKILL_MECHANISM_REGISTRY__ === 'object'
      ? globalThis.__LWCS_SKILL_MECHANISM_REGISTRY__
      : SKILL_MECHANISM_REGISTRY_V1;
  const mechanismTargetSemantics = sharedMechanismRegistry?.目标语义表 || {};
  const grantableMechanismSet = new Set(
    Array.isArray(mechanismTargetSemantics.可赋予) ? mechanismTargetSemantics.可赋予 : [],
  );
  const groupGrantableMechanismSet = new Set(
    Array.isArray(mechanismTargetSemantics.群体赋予) ? mechanismTargetSemantics.群体赋予 : [],
  );
  const selfOnlyMechanismSet = new Set(
    Array.isArray(mechanismTargetSemantics.仅自身) ? mechanismTargetSemantics.仅自身 : [],
  );
  const resolveSupportableBuffTarget = (fallback = '自身') => {
    if (normalizedTarget === '全场') return '友方群体';
    if (normalizedTarget.includes('敌方')) return fallback;
    return normalizedTarget || fallback;
  };
  const supportableBuffTarget = resolveSupportableBuffTarget('自身');
  const supportableGroupTarget = normalizedTarget === '全场' ? '友方群体' : normalizedTarget;
  const resolvePackedSemanticTarget = (mechanismLabel = '', fallbackTarget = normalizedTarget) => {
    const normalizedLabel = String(mechanismLabel || '').trim();
    if (!normalizedLabel) return fallbackTarget || normalizedTarget;
    if (selfOnlyMechanismSet.has(normalizedLabel)) return '自身';
    if (grantableMechanismSet.has(normalizedLabel)) {
      if (groupGrantableMechanismSet.has(normalizedLabel)) {
        if (normalizedTarget === '全场' || normalizedTarget === '友方群体') return '友方群体';
        if (normalizedTarget === '友方单体') return '友方单体';
      }
      return supportableBuffTarget;
    }
    return fallbackTarget || normalizedTarget;
  };

  const randomInRange = table => {
    const [min, max] = table?.[grade] || table?.B || [1, 1];
    return min + Math.random() * (max - min);
  };

  const clash = 战斗.仲裁逻辑?.瞬间交锋模块 || {};
  const state = 战斗.仲裁逻辑?.状态挂载模块 || {};
  const field = 战斗.仲裁逻辑?.召唤与场地模块 || {};
  const stateCalc = state.计算层效果 || {
    skip_turn: false,
    cannot_react: false,
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
    min_hp_floor: 0,
    death_save_count: 0,
    revive_count: 0,
    revive_heal_ratio: 0,
    substitute_count: 0,
    damage_reflect_ratio: 0,
    damage_share_ratio: 0,
    damage_share_count: 0,
    heal_inversion_ratio: 0,
    invincible: false,
    skill_seal: false,
    invincible_tier_threshold: 0,
    daily_trigger_limit: 0,
    stealth_level: 0,
    bonus_true_damage_ratio: 0,
    life_steal_ratio: 0,
    cost_ratio: 1.0,
    windup_ratio: 1.0,
    mastery_ratio: 1.0,
    speed_ratio: 1.0,
  };
  const packedEffects = [];
  const 是否食物系 = String(type || '').trim() === '食物系';
  const 是否神圣治疗风格 =
    ['治疗系', '辅助系'].includes(String(type || '').trim()) &&
    Array.isArray(attrs) &&
    attrs.some(token => ['神圣', '光明', '生命'].includes(String(token || '').trim()));
  const 食物恢复自服禁用规则 = Object.freeze([
    Object.freeze({ 条件: '自身', 处理: '禁用' }),
  ]);
  const 食物自服效能调整规则 = Object.freeze([
    Object.freeze({ 条件: '自身', 处理: '覆盖', 参数: Object.freeze({ 数值倍率: 0.72 }) }),
  ]);
  const 神圣逆邪规则 = Object.freeze([
    Object.freeze({ 条件: '邪魂师', 处理: '转为伤害', 参数: Object.freeze({ 伤害类型: '神圣', 伤害倍率: 1 }) }),
    Object.freeze({ 条件: '深渊生物', 处理: '转为伤害', 参数: Object.freeze({ 伤害类型: '神圣', 伤害倍率: 1 }) }),
  ]);
  const appendPackedEffectObjectDiffRules = (effect, ruleList = []) => {
    if (!effect || !Array.isArray(ruleList) || !ruleList.length) return effect;
    const baseRules = Array.isArray(effect.对象差异规则) ? clonePackedSkillEffects(effect.对象差异规则) : [];
    const mergedRules = [...baseRules, ...clonePackedSkillEffects(ruleList)];
    effect.对象差异规则 = mergedRules;
    return effect;
  };

  if ((clash.基础威力倍率 || 0) > 0) {
    packedEffects.push({
      机制:
        archetype === '多段伤害'
          ? '多段伤害'
          : archetype === '持续伤害'
            ? '持续伤害'
            : archetype === '延迟爆发'
              ? '延迟爆发'
              : '直接伤害',
      目标: normalizedTarget,
      威力倍率: clash.基础威力倍率 || 0,
      伤害类型: clash.伤害类型 || '无',
      穿透修饰: clash.穿透修饰 || 0,
      吸血比例: Number(((clash.瞬间恢复比例 || 0) / 100).toFixed(2)),
    });
  }
  if ((clash.护盾绝对值 || 0) > 0)
    packedEffects.push({
      机制: '护盾',
      目标: normalizedTarget,
      护盾值: clash.护盾绝对值 || 0,
      持续回合: state.持续回合 || 0,
    });
  packedEffects.push(...buildPackedAttributeEffectsFromRatios(normalizedTarget, state.面板修改比例 || {}, state.持续回合 || 0));
  if ((clash.瞬间恢复比例 || 0) > 0 && main === '回复类' && archetype === '体力恢复') {
    const recoverEffect = buildPackedRecoverAttributeEffect(
      normalizedTarget,
      'vit',
      Number((clash.瞬间恢复比例 / 100).toFixed(2)),
      0,
      false,
    );
    if (recoverEffect) {
      if (是否食物系) appendPackedEffectObjectDiffRules(recoverEffect, 食物恢复自服禁用规则);
      if (是否神圣治疗风格) appendPackedEffectObjectDiffRules(recoverEffect, 神圣逆邪规则);
      packedEffects.push(recoverEffect);
    }
  }
  if (main === '回复类' && archetype === '魂力恢复') {
    const recoverEffect = buildPackedRecoverAttributeEffect(normalizedTarget, 'sp', stateCalc.sp_gain_ratio || 0, 0, false);
    if (recoverEffect) {
      if (是否食物系) appendPackedEffectObjectDiffRules(recoverEffect, 食物恢复自服禁用规则);
      packedEffects.push(recoverEffect);
    }
  }
  if (main === '回复类' && archetype === '精神恢复') {
    const recoverEffect = buildPackedRecoverAttributeEffect(normalizedTarget, 'men', stateCalc.men_gain_ratio || 0, 0, false);
    if (recoverEffect) {
      if (是否食物系) appendPackedEffectObjectDiffRules(recoverEffect, 食物恢复自服禁用规则);
      packedEffects.push(recoverEffect);
    }
  }
  if (main === '回复类' && archetype === '持续恢复') {
    const recoverProperty =
      attrs.includes('精神力') && !attrs.includes('魂力')
        ? 'men'
        : attrs.includes('魂力') && !attrs.includes('精神力')
          ? 'sp'
          : 'vit';
    const recoverEffect = buildPackedRecoverAttributeEffect(
      normalizedTarget,
      recoverProperty,
      Number((clash.瞬间恢复比例 / 100).toFixed(2)),
      state.持续回合 || 0,
      true,
    );
    if (recoverEffect) {
      if (是否食物系) appendPackedEffectObjectDiffRules(recoverEffect, 食物恢复自服禁用规则);
      if (是否神圣治疗风格 && recoverProperty === 'vit') appendPackedEffectObjectDiffRules(recoverEffect, 神圣逆邪规则);
      packedEffects.push(recoverEffect);
    }
  }
  if (Math.abs(Number(stateCalc.cost_ratio || 1) - 1) > 0.001) {
    const 消耗机制 = Number(stateCalc.cost_ratio || 1) > 1 ? '消耗提高' : '消耗降低';
    const effect = buildPackedAttributeEffect(
      消耗机制,
      normalizedTarget,
      '消耗',
      消耗机制,
      Number(stateCalc.cost_ratio || 1),
      state.持续回合 || 0,
      '状态持续',
    );
    if (effect) packedEffects.push(effect);
  }
  if (Math.abs(Number(stateCalc.windup_ratio || 1) - 1) > 0.001) {
    const 前摇机制 = Number(stateCalc.windup_ratio || 1) > 1 ? '前摇拉长' : '前摇缩短';
    const effect = buildPackedAttributeEffect(
      前摇机制,
      normalizedTarget,
      '前摇',
      前摇机制,
      Number(stateCalc.windup_ratio || 1),
      state.持续回合 || 0,
      '状态持续',
    );
    if (effect) packedEffects.push(effect);
  }
  if (Math.abs(Number(stateCalc.mastery_ratio || 1) - 1) > 0.001) {
    const effect = buildPackedAttributeEffect(
      '掌控修正',
      normalizedTarget,
      '掌控',
      Number(stateCalc.mastery_ratio || 1) > 1 ? '倍率提升' : '倍率压制',
      Number(stateCalc.mastery_ratio || 1),
      state.持续回合 || 0,
      '状态持续',
    );
    if (effect) packedEffects.push(effect);
  }
  if (Math.abs(Number(stateCalc.speed_ratio || 1) - 1) > 0.001) {
    const effect = buildPackedAttributeEffect(
      '速度修正',
      normalizedTarget,
      '速度',
      Number(stateCalc.speed_ratio || 1) > 1 ? '倍率提升' : '倍率压制',
      Number(stateCalc.speed_ratio || 1),
      state.持续回合 || 0,
      '状态持续',
    );
    if (effect) packedEffects.push(effect);
  }
  if (main === '感知/认知类' && archetype === '感知干扰')
    packedEffects.push({
      机制: '感知干扰',
      目标: normalizedTarget,
      持续回合: state.持续回合 || 2,
      hit_penalty: Number(stateCalc.hit_penalty || 0),
      reaction_penalty: Number(stateCalc.reaction_penalty || 0),
      cast_speed_penalty: Number(stateCalc.cast_speed_penalty || 0),
    });
  if (main === '感知/认知类' && archetype === '标记锁定')
    packedEffects.push({
      机制: '标记锁定',
      目标: normalizedTarget,
      持续回合: state.持续回合 || 0,
      判定属性: 'men_max',
      判定阈值: { C: 1.0, B: 1.0, A: 1.05, S: 1.1 }[grade] || 1.0,
      成功参数: {
        hit_bonus: stateCalc.hit_bonus || 0,
        dodge_penalty: stateCalc.dodge_penalty || 0,
        lock_level: stateCalc.lock_level || 0,
      },
      失败参数: { hit_bonus: Number(((stateCalc.hit_bonus || 0) * 0.35).toFixed(2)), lock_level: 0 },
    });
  if (main === '感知/认知类' && archetype === '幻境')
    packedEffects.push({
      机制: '幻境',
      目标: normalizedTarget,
      持续回合: state.持续回合 || 0,
      判定属性: 'men_max',
      判定阈值: { C: 1.0, B: 1.05, A: 1.1, S: 1.15 }[grade] || 1.05,
      成功参数: {
        stat_mods: state.面板修改比例 || {},
        reaction_penalty: stateCalc.reaction_penalty || 0,
        skip_turn: stateCalc.skip_turn || false,
      },
      失败参数: {
        stat_mods: { agi: Number((1 - (1 - (state.面板修改比例?.agi || 1.0)) * 0.35).toFixed(2)) },
        reaction_penalty: Number(((stateCalc.reaction_penalty || 0) * 0.35).toFixed(2)),
      },
    });
  if (main === '感知/认知类' && archetype === '催眠')
    packedEffects.push({
      机制: '催眠',
      目标: normalizedTarget,
      持续回合: state.持续回合 || 0,
      判定属性: 'men_max',
      判定阈值: { C: 1.05, B: 1.1, A: 1.15, S: 1.2 }[grade] || 1.1,
      成功参数: { skip_turn: true, cannot_react: true },
      失败参数: {},
    });
  if (main === '感知/认知类' && archetype === '认知扭曲')
    packedEffects.push({
      机制: '认知扭曲',
      目标: normalizedTarget,
      持续回合: state.持续回合 || 0,
      判定属性: 'men_max',
      判定阈值: { C: 1.0, B: 1.05, A: 1.1, S: 1.15 }[grade] || 1.05,
      成功参数: {
        random_target_rate: Number(stateCalc.random_target_rate || 0),
        hit_penalty: Number(stateCalc.hit_penalty || 0),
        control_success_penalty: Number(stateCalc.control_success_penalty || 0),
        cast_speed_penalty: Number(stateCalc.cast_speed_penalty || 0),
      },
      失败参数: {
        hit_penalty: Number(((stateCalc.hit_penalty || 0) * 0.45).toFixed(2)),
        control_success_penalty: Number(((stateCalc.control_success_penalty || 0) * 0.45).toFixed(2)),
      },
    });
  if ((main === '感知/认知类' && archetype === '共享视野') || secondary.includes('共享视野')) {
    const secondaryOnly = !(main === '感知/认知类' && archetype === '共享视野');
    const baseDuration = state.持续回合 || { C: 1, B: 2, A: 3, S: 4 }[grade] || 2;
    const reactionBonus =
      stateCalc.reaction_bonus ||
      Number(randomInRange({ C: [0.05, 0.1], B: [0.1, 0.15], A: [0.15, 0.25], S: [0.25, 0.35] }).toFixed(2));
    const hitBonus =
      stateCalc.hit_bonus ||
      Number(randomInRange({ C: [0.05, 0.1], B: [0.1, 0.15], A: [0.15, 0.25], S: [0.25, 0.35] }).toFixed(2));
    packedEffects.push({
      机制: '共享视野',
      目标: normalizedTarget.includes('敌方') ? '友方群体' : normalizedTarget,
      持续回合: secondaryOnly ? Math.max(1, Math.round(baseDuration * secondaryDurationScale)) : baseDuration,
      reaction_bonus: secondaryOnly ? Number((reactionBonus * secondaryEffectScale).toFixed(2)) : reactionBonus,
      hit_bonus: secondaryOnly ? Number((hitBonus * secondaryEffectScale).toFixed(2)) : hitBonus,
      lock_level: secondaryOnly
        ? Math.max(1, Math.round((stateCalc.lock_level || 1) * secondaryDurationScale))
        : stateCalc.lock_level || 1,
    });
  }
  if (secondary.includes('禁疗') || (main === '削弱类' && archetype === '禁疗')) {
    const secondaryOnly = !(main === '削弱类' && archetype === '禁疗');
    const baseDuration = state.持续回合 || { C: 1, B: 2, A: 2, S: 3 }[grade] || 1;
    const healBlockRatio =
      stateCalc.heal_block_ratio ||
      Number(randomInRange({ C: [0.2, 0.3], B: [0.35, 0.5], A: [0.5, 0.7], S: [0.75, 1.0] }).toFixed(2));
    packedEffects.push({
      机制: '禁疗',
      目标: normalizedTarget,
      持续回合: secondaryOnly ? Math.max(1, Math.round(baseDuration * secondaryDurationScale)) : baseDuration,
      heal_block_ratio: secondaryOnly ? Number((healBlockRatio * secondaryEffectScale).toFixed(2)) : healBlockRatio,
    });
  }
  if (main === '回复类' && archetype === '净化/解控')
    packedEffects.push({
      机制: '解控',
      目标: resolvePackedSemanticTarget('解控'),
      清除层级: { C: 1, B: 2, A: 3, S: 4 }[grade] || 1,
    });
  if (main === '增益类' && archetype === '修炼增益') {
    const 修炼倍率 = Number(randomInRange({ C: [1.08, 1.12], B: [1.15, 1.22], A: [1.24, 1.34], S: [1.36, 1.5] }).toFixed(2));
    const 持续回合 = Math.max(2, Number(state.持续回合 || 3));
    packedEffects.push({
      机制: '修炼增益',
      目标: resolvePackedSemanticTarget('修炼增益'),
      持续回合,
      持续tick: Math.max(12, Math.round(持续回合 * 6)),
      修炼速度倍率: 修炼倍率,
      修炼倍率说明: '魂技机制:修炼增益',
    });
  }
  if (
    (main === '伤害类' || secondary.includes('流血DOT')) &&
    Math.max(Number(state.持续真伤dot || 0), Number(stateCalc.dot_damage || 0)) > 0
  ) {
    packedEffects.push({
      机制: String(state.状态名称 || '').includes('流血') ? '流血DOT' : '持续伤害DOT',
      目标: normalizedTarget,
      状态名称:
        String(state.状态名称 || '无') === '无'
          ? secondary.includes('流血DOT')
            ? '流血'
            : '持续创伤'
          : state.状态名称,
      持续回合: Math.max(1, Number(state.持续回合 || (secondary.includes('流血DOT') ? 2 : 3))),
      dot_damage: Math.max(1, Number(state.持续真伤dot || stateCalc.dot_damage || 0)),
    });
  }
  if ((secondary.includes('净化') || secondary.includes('解控')) && !packedEffects.some(e => e.机制 === '解控')) {
    packedEffects.push({
      机制: '解控',
      目标: resolvePackedSemanticTarget('解控'),
      清除层级: Math.max(1, Math.round(({ C: 1, B: 1, A: 2, S: 2 }[grade] || 1) * secondaryDurationScale)),
    });
  }
  if (secondary.includes('魂力恢复') && !packedEffects.some(e => e.机制 === '属性变化' && e.属性 === 'sp')) {
    const effect = buildPackedRecoverAttributeEffect(
      normalizedTarget,
      'sp',
      Number(
        (
          Math.max(
            1,
            Math.round(randomInRange({ C: [5, 8], B: [8, 12], A: [12, 18], S: [18, 25] }) * secondaryEffectScale),
          ) / 100
        ).toFixed(2),
      ),
      0,
      false,
    );
    if (effect) packedEffects.push(effect);
  }
  if (secondary.includes('精神恢复') && !packedEffects.some(e => e.机制 === '属性变化' && e.属性 === 'men')) {
    const effect = buildPackedRecoverAttributeEffect(
      normalizedTarget,
      'men',
      Number(
        (
          Math.max(
            1,
            Math.round(randomInRange({ C: [5, 8], B: [8, 12], A: [12, 18], S: [18, 25] }) * secondaryEffectScale),
          ) / 100
        ).toFixed(2),
      ),
      0,
      false,
    );
    if (effect) packedEffects.push(effect);
  }
  if (secondary.includes('修炼增益')) {
    const 基础倍率 = Number(randomInRange({ C: [1.06, 1.1], B: [1.1, 1.16], A: [1.16, 1.24], S: [1.24, 1.34] }).toFixed(2));
    const 修炼倍率 = Math.max(1.03, Number((1 + (基础倍率 - 1) * secondaryEffectScale).toFixed(4)));
    const 持续回合 = Math.max(1, Math.round((state.持续回合 || 2) * secondaryDurationScale));
    packedEffects.push({
      机制: '修炼增益',
      目标: resolvePackedSemanticTarget('修炼增益'),
      持续回合,
      持续tick: Math.max(6, Math.round(持续回合 * 6)),
      修炼速度倍率: 修炼倍率,
      修炼倍率说明: '魂技机制:修炼增益',
    });
  }
  if (secondary.includes('斩杀补伤')) {
    const match = String(state.特殊机制标识 || '').match(/斩杀补伤:(\d+)%\/(\d+)%/);
    const threshold = match ? Number(match[1]) / 100 : { C: 0.15, B: 0.2, A: 0.25, S: 0.3 }[grade] || 0.2;
    const mult = match ? Number((1 + Number(match[2]) / 100).toFixed(2)) : stateCalc.final_damage_mult || 1.15;
    packedEffects.push({
      机制: '斩杀补伤',
      目标: normalizedTarget,
      判定属性: 'hp_ratio',
      判定阈值: threshold,
      成功参数: { final_damage_mult: mult },
      失败参数: {},
    });
  }
  if (secondary.includes('打断')) packedEffects.push({ 机制: '打断', 目标: normalizedTarget, 中断概率: 1.0 });
  if (secondary.includes('沉默'))
    packedEffects.push({
      机制: '沉默',
      目标: normalizedTarget,
      持续回合: Math.max(1, Math.round((state.持续回合 || 1) * secondaryDurationScale)),
    });
  if (secondary.includes('缴械'))
    packedEffects.push({
      机制: '缴械',
      目标: normalizedTarget,
      持续回合: Math.max(1, Math.round((state.持续回合 || 1) * secondaryDurationScale)),
    });
  if (secondary.includes('减速') || secondary.includes('迟缓'))
    packedEffects.push({
      机制: '减速',
      目标: normalizedTarget,
      持续回合: Math.max(1, Math.round((state.持续回合 || 1) * secondaryDurationScale)),
      agi_ratio: state.面板修改比例?.agi || 0.8,
    });
  if (secondary.includes('致盲'))
    packedEffects.push({ 机制: '致盲', 目标: normalizedTarget, 持续回合: Math.max(1, Number(state.持续回合 || 1)) });
  if (secondary.includes('标记弱点'))
    packedEffects.push({
      机制: '标记弱点',
      目标: normalizedTarget,
      持续回合: Math.max(1, Number(state.持续回合 || 1)),
      final_damage_mult: Number(state.计算层效果?.final_damage_mult || 1.1),
      dodge_penalty: Number(state.计算层效果?.dodge_penalty || 0),
      lock_level: Number(state.计算层效果?.lock_level || 0),
    });
  if (secondary.includes('驱散增益'))
    packedEffects.push({
      机制: '驱散增益',
      目标: normalizedTarget,
      驱散数量: Math.max(1, Math.round(({ C: 1, B: 1, A: 2, S: 2 }[grade] || 1) * secondaryDurationScale)),
    });
  if (secondary.includes('窃取增益'))
    packedEffects.push({
      机制: '窃取增益',
      目标: normalizedTarget,
      窃取数量: Math.max(1, Math.round(({ C: 1, B: 1, A: 2, S: 2 }[grade] || 1) * secondaryDurationScale)),
    });
  if (secondary.includes('隐身'))
    packedEffects.push({
      机制: '隐身',
      目标: resolvePackedSemanticTarget('隐身'),
      持续回合: Math.max(1, Number(state.持续回合 || 1)),
      隐蔽度: Number(state.计算层效果?.stealth_level || 0),
      dodge_bonus: Number(state.计算层效果?.dodge_bonus || 0),
      reaction_bonus: Number(state.计算层效果?.reaction_bonus || 0),
    });
  if (secondary.includes('破隐'))
    packedEffects.push({
      机制: '破隐',
      目标: normalizedTarget,
      破隐层级: 99,
      hit_bonus: Number(
        (({ C: 0.05, B: 0.08, A: 0.12, S: 0.16 }[grade] || 0.08) * secondaryEffectScale).toFixed(2),
      ),
      lock_level: Math.max(1, Math.round(({ C: 1, B: 1, A: 2, S: 2 }[grade] || 1) * secondaryDurationScale)),
    });
  if (secondary.includes('护卫'))
    packedEffects.push({
      机制: '护卫',
      目标: resolvePackedSemanticTarget('护卫', supportableGroupTarget),
      持续回合: Math.max(1, Number(state.持续回合 || 1)),
      damage_reduction: Number(state.计算层效果?.damage_reduction || 0),
    });
  if (secondary.includes('嘲讽'))
    packedEffects.push({
      机制: '嘲讽',
      目标: normalizedTarget,
      持续回合: Math.max(1, Number(state.持续回合 || 1)),
    });
  if (secondary.includes('目标锁定'))
    packedEffects.push({
      机制: '目标锁定',
      目标: normalizedTarget,
      持续回合: Math.max(1, Number(state.持续回合 || 1)),
      hit_bonus: Number(state.计算层效果?.hit_bonus || 0),
      lock_level: Number(state.计算层效果?.lock_level || 0),
    });
  if (secondary.includes('追击'))
    packedEffects.push({
      机制: '追击',
      目标: normalizedTarget,
      持续回合: Math.max(1, Number(state.持续回合 || 1)),
      attacker_speed_bonus: Number(state.计算层效果?.attacker_speed_bonus || 0),
      hit_bonus: Number(state.计算层效果?.hit_bonus || 0),
      final_damage_mult: Number(state.计算层效果?.final_damage_mult || 1),
    });
  if (secondary.includes('无敌金身'))
    packedEffects.push({
      机制: '无敌金身',
      目标: resolvePackedSemanticTarget('无敌金身'),
      持续回合: Math.max(1, Number(state.持续回合 || 1)),
      每日触发上限: Math.max(1, Number(state.计算层效果?.daily_trigger_limit || 3)),
      免疫位阶阈值: Math.max(100, Number(state.计算层效果?.invincible_tier_threshold || 100)),
      damage_reduction: Number(state.计算层效果?.damage_reduction || 0),
    });
  if (secondary.includes('伤害反射'))
    packedEffects.push({
      机制: '伤害反射',
      目标: resolvePackedSemanticTarget('伤害反射'),
      持续回合: Math.max(1, Number(state.持续回合 || 1)),
      反射比例: Number(state.计算层效果?.damage_reflect_ratio || 0),
    });
  if (secondary.includes('伤害分摊'))
    packedEffects.push({
      机制: '伤害分摊',
      目标: resolvePackedSemanticTarget('伤害分摊', supportableGroupTarget),
      持续回合: Math.max(1, Number(state.持续回合 || 1)),
      分摊比例: Number(state.计算层效果?.damage_share_ratio || 0),
      分摊人数: Math.max(1, Number(state.计算层效果?.damage_share_count || 1)),
    });
  if (secondary.includes('替身抵消'))
    packedEffects.push({
      机制: '替身抵消',
      目标: resolvePackedSemanticTarget('替身抵消'),
      持续回合: Math.max(1, Number(state.持续回合 || 1)),
      抵消次数: Math.max(1, Number(state.计算层效果?.substitute_count || 1)),
      dodge_bonus: Number(state.计算层效果?.dodge_bonus || 0),
    });
  if (secondary.includes('治疗反转'))
    packedEffects.push({
      机制: '治疗反转',
      目标: normalizedTarget,
      持续回合: Math.max(1, Number(state.持续回合 || 1)),
      反转比例: Number(state.计算层效果?.heal_inversion_ratio || 1),
    });
  if (secondary.includes('封技'))
    packedEffects.push({
      机制: '封技',
      目标: normalizedTarget,
      持续回合: Math.max(1, Number(state.持续回合 || 1)),
    });
  if (secondary.includes('复苏'))
    packedEffects.push({
      机制: '复苏',
      目标: resolvePackedSemanticTarget('复苏'),
      持续回合: Math.max(1, Number(state.持续回合 || 1)),
      复苏次数: Math.max(1, Number(state.计算层效果?.revive_count || 1)),
      复苏回血比例: Number(state.计算层效果?.revive_heal_ratio || 0.25),
    });
  if (secondary.includes('反击'))
    packedEffects.push({
      机制: '受击反击',
      目标: resolvePackedSemanticTarget('受击反击'),
      持续回合: Math.max(1, Math.round((state.持续回合 || 1) * secondaryDurationScale)),
      反击倍率: Number(((gradeFactor >= 3 ? 1.0 : 0.5) * secondaryEffectScale).toFixed(2)),
    });
  if (main === '防御类' && archetype === '减伤')
    packedEffects.push({
      机制: '减伤',
      目标: normalizedTarget,
      持续回合: state.持续回合 || 1,
      减伤比例: Number(state.计算层效果?.control_resist_mult - 1 || 0.15),
    });
  if (main === '防御类' && archetype === '格挡/抵消')
    packedEffects.push({
      机制: '格挡',
      目标: normalizedTarget,
      持续回合: state.持续回合 || 1,
      抵消次数: gradeFactor >= 3 ? 2 : 1,
    });
  if (main === '防御类' && archetype === '霸体')
    packedEffects.push({
      机制: '霸体',
      目标: normalizedTarget,
      持续回合: state.持续回合 || 1,
      减伤比例: Number(state.计算层效果?.damage_reduction || 0.2),
    });
  if (main === '防御类' && archetype === '免死/锁血')
    packedEffects.push({
      机制: '免死',
      目标: normalizedTarget,
      持续回合: state.持续回合 || 1,
      触发次数: state.计算层效果?.death_save_count || 1,
    });
  if (main === '防御类' && archetype === '无敌金身')
    packedEffects.push({
      机制: '无敌金身',
      目标: resolvePackedSemanticTarget('无敌金身'),
      持续回合: state.持续回合 || 1,
      每日触发上限: Math.max(1, Number(state.计算层效果?.daily_trigger_limit || 3)),
      免疫位阶阈值: Math.max(100, Number(state.计算层效果?.invincible_tier_threshold || 100)),
      damage_reduction: Number(state.计算层效果?.damage_reduction || 0),
    });
  if (main === '防御类' && archetype === '伤害反射')
    packedEffects.push({
      机制: '伤害反射',
      目标: resolvePackedSemanticTarget('伤害反射'),
      持续回合: state.持续回合 || 1,
      反射比例: Number(state.计算层效果?.damage_reflect_ratio || 0),
      damage_reduction: Number(state.计算层效果?.damage_reduction || 0),
    });
  if (main === '防御类' && archetype === '伤害分摊')
    packedEffects.push({
      机制: '伤害分摊',
      目标: resolvePackedSemanticTarget('伤害分摊', supportableGroupTarget),
      持续回合: state.持续回合 || 1,
      分摊比例: Number(state.计算层效果?.damage_share_ratio || 0),
      分摊人数: Math.max(1, Number(state.计算层效果?.damage_share_count || 1)),
    });
  if (main === '防御类' && archetype === '替身抵消')
    packedEffects.push({
      机制: '替身抵消',
      目标: resolvePackedSemanticTarget('替身抵消'),
      持续回合: state.持续回合 || 1,
      抵消次数: Math.max(1, Number(state.计算层效果?.substitute_count || 1)),
      dodge_bonus: Number(state.计算层效果?.dodge_bonus || 0),
    });
  if (main === '防御类' && archetype === '复苏')
    packedEffects.push({
      机制: '复苏',
      目标: resolvePackedSemanticTarget('复苏'),
      持续回合: state.持续回合 || 1,
      复苏次数: Math.max(1, Number(state.计算层效果?.revive_count || 1)),
      复苏回血比例: Number(state.计算层效果?.revive_heal_ratio || 0.25),
    });
  if (archetype === '硬控') packedEffects.push({ 机制: '硬控', 目标: normalizedTarget, 持续回合: state.持续回合 || 1 });
  if (main === '控制类' && archetype === '软控')
    packedEffects.push({
      机制: '软控',
      目标: normalizedTarget,
      持续回合: state.持续回合 || 2,
      reaction_penalty: Number(state.计算层效果?.reaction_penalty || 0),
      cast_speed_penalty: Number(state.计算层效果?.cast_speed_penalty || 0),
      dodge_penalty: Number(state.计算层效果?.dodge_penalty || 0),
    });
  if (main === '控制类' && archetype === '位移限制')
    packedEffects.push({
      机制: '位移限制',
      目标: normalizedTarget,
      持续回合: state.持续回合 || 1,
      reaction_penalty: Number(state.计算层效果?.reaction_penalty || 0),
      dodge_penalty: Number(state.计算层效果?.dodge_penalty || 0),
      lock_level: Number(state.计算层效果?.lock_level || 0),
    });
  if (main === '控制类' && archetype === '节奏打断')
    packedEffects.push({
      机制: '打断',
      目标: normalizedTarget,
      中断概率: Number(state.计算层效果?.interrupt_bonus || 1.0),
    });
  if (main === '位移类' && archetype === '自身位移')
    packedEffects.push({
      机制: '自身位移',
      目标: resolvePackedSemanticTarget('自身位移'),
      持续回合: state.持续回合 || 1,
      dodge_bonus: Number(state.计算层效果?.dodge_bonus || 0),
      attacker_speed_bonus: Number(state.计算层效果?.attacker_speed_bonus || 0),
      reaction_bonus: Number(state.计算层效果?.reaction_bonus || 0),
    });
  if (main === '位移类' && archetype === '强制位移')
    packedEffects.push({
      机制: '强制位移',
      目标: normalizedTarget,
      持续回合: state.持续回合 || 1,
      dodge_penalty: Number(state.计算层效果?.dodge_penalty || 0),
      reaction_penalty: Number(state.计算层效果?.reaction_penalty || 0),
      lock_level: Number(state.计算层效果?.lock_level || 0),
    });
  if (main === '位移类' && archetype === '位移交换')
    packedEffects.push({
      机制: '位移交换',
      目标: normalizedTarget,
      持续回合: state.持续回合 || 2,
      dodge_penalty: Number(state.计算层效果?.dodge_penalty || 0),
      reaction_penalty: Number(state.计算层效果?.reaction_penalty || 0),
      lock_level: Number(state.计算层效果?.lock_level || 0),
    });
  if (main === '位移类' && archetype === '追击位移')
    packedEffects.push({
      机制: '追击位移',
      目标: resolvePackedSemanticTarget('追击位移'),
      持续回合: state.持续回合 || 1,
      attacker_speed_bonus: Number(state.计算层效果?.attacker_speed_bonus || 0),
      hit_bonus: Number(state.计算层效果?.hit_bonus || 0),
      final_damage_mult: Number(state.计算层效果?.final_damage_mult || 1.0),
    });
  if (main === '位移类' && archetype === '脱离位移')
    packedEffects.push({
      机制: '脱离位移',
      目标: resolvePackedSemanticTarget('脱离位移'),
      持续回合: state.持续回合 || 1,
      dodge_bonus: Number(state.计算层效果?.dodge_bonus || 0),
      cast_speed_bonus: Number(state.计算层效果?.cast_speed_bonus || 0),
      reaction_bonus: Number(state.计算层效果?.reaction_bonus || 0),
    });
  if (main === '特殊规则类' && archetype === '强制绑定/锁定')
    packedEffects.push({
      机制: '强制绑定/锁定',
      目标: normalizedTarget,
      持续回合: state.持续回合 || 2,
      lock_level: Number(state.计算层效果?.lock_level || 0),
      dodge_penalty: Number(state.计算层效果?.dodge_penalty || 0),
      reaction_penalty: Number(state.计算层效果?.reaction_penalty || 0),
    });
  if (main === '特殊规则类' && archetype === '反制')
    packedEffects.push({
      机制: '反制',
      目标: resolvePackedSemanticTarget('反制'),
      持续回合: state.持续回合 || 2,
      反击倍率: Number(state.计算层效果?.counter_attack_ratio || 0),
      damage_reduction: Number(state.计算层效果?.damage_reduction || 0),
    });
  if (main === '特殊规则类' && archetype === '条件触发')
    packedEffects.push({
      机制: '条件触发',
      目标: normalizedTarget,
      判定属性: 'hp_ratio',
      判定阈值: { C: 0.55, B: 0.45, A: 0.35, S: 0.25 }[grade] || 0.45,
      成功参数: {
        final_damage_mult: Number(state.计算层效果?.final_damage_mult || 1.18),
        hit_bonus: Number(state.计算层效果?.hit_bonus || 0),
      },
      失败参数: { hit_bonus: Number(((state.计算层效果?.hit_bonus || 0) * 0.5).toFixed(2)) },
    });
  if (main === '特殊规则类' && archetype === '转化')
    packedEffects.push({
      机制: '伤害转回复',
      目标: resolvePackedSemanticTarget('伤害转回复'),
      转换比例: Number(state.计算层效果?.life_steal_ratio || 0),
    });
  if (main === '特殊规则类' && archetype === '分身')
    packedEffects.push({
      机制: '分身',
      目标: resolvePackedSemanticTarget('分身'),
      状态名称: state.状态名称 || '分身',
      持续回合: state.持续回合 || 2,
      分身类型: state.分身元数据?.分身类型 || state.状态名称 || '分身',
      分身数量: Number(state.分身元数据?.分身数量 || 1),
      隐蔽度: Number(state.分身元数据?.隐蔽度 || 0.35),
      实力继承比例: Number(state.分身元数据?.实力继承比例 || 0.45),
      dodge_bonus: Number(state.计算层效果?.dodge_bonus || 0),
      attacker_speed_bonus: Number(state.计算层效果?.attacker_speed_bonus || 0),
      reaction_bonus: Number(state.计算层效果?.reaction_bonus || 0),
      hit_bonus: Number(state.计算层效果?.hit_bonus || 0),
      lock_level: Number(state.计算层效果?.lock_level || 0),
      damage_reduction: Number(state.计算层效果?.damage_reduction || 0),
      final_damage_mult: Number(state.计算层效果?.final_damage_mult || 1.0),
    });
  if (main === '特殊规则类' && archetype === '复制')
    packedEffects.push({
      机制: '复制',
      目标: normalizedTarget,
      持续回合: state.持续回合 || 2,
      复制类型: 'buff',
      复制数量: 1,
    });
  if (main === '特殊规则类' && archetype === '状态交换')
    packedEffects.push({ 机制: '状态交换', 目标: normalizedTarget, 交换数量: 1, 优先策略: '自身负面换目标正面' });
  if (main === '特殊规则类' && archetype === '状态转移')
    packedEffects.push({
      机制: '状态转移',
      目标: normalizedTarget,
      转移类型: '自身负面->目标',
      转移数量: grade === 'S' ? 3 : grade === 'A' ? 2 : 1,
      触发条件: '命中后',
    });
  const resourceDrainType =
    type === '精神系'
      ? '精神力'
      : ['辅助系', '治疗系', '食物系'].includes(type)
        ? '魂力'
        : '双资源';
  const resourceRefeedType =
    type === '精神系'
      ? '精神力'
      : ['治疗系', '辅助系', '食物系'].includes(type)
        ? '双资源'
        : '魂力';
  const mechanismSuppressTarget =
    ['控制系', '精神系'].includes(type)
      ? '控制机制'
      : type === '元素系'
        ? '护盾'
        : '复苏';
  const mainMechanismSuppressDuration = Math.max(1, Number(state.持续回合 || 2));
  const secondaryMechanismSuppressDuration = Math.max(1, Math.min(mainMechanismSuppressDuration, grade === 'S' ? 2 : 1));
  if (main === '特殊规则类' && archetype === '吞噬')
    packedEffects.push({
      机制: '吞噬',
      目标: normalizedTarget,
      资源类型: resourceDrainType,
      夺取比例: Number((({ C: 0.12, B: 0.16, A: 0.22, S: 0.28 }[grade] || 0.16) * secondaryEffectScale).toFixed(2)),
      转化比例: Number(({ C: 0.9, B: 1.0, A: 1.1, S: 1.2 }[grade] || 1.0).toFixed(2)),
    });
  if (main === '特殊规则类' && archetype === '能力共享')
    packedEffects.push(appendPackedEffectObjectDiffRules({
      机制: '能力共享',
      目标: resolvePackedSemanticTarget('能力共享'),
      资源类型: resourceRefeedType,
      反灌比例: Number((({ C: 0.12, B: 0.18, A: 0.24, S: 0.3 }[grade] || 0.18) * secondaryEffectScale).toFixed(2)),
    }, 是否食物系 ? 食物恢复自服禁用规则 : []));
  if (main === '特殊规则类' && archetype === '机制抹消')
    packedEffects.push({
      机制: '机制抹消',
      目标: normalizedTarget,
      抹消目标: mechanismSuppressTarget,
      抹消方式: '移除并封锁',
      持续回合: mainMechanismSuppressDuration,
    });
  if (main === '特殊规则类' && archetype === '引爆持续伤害')
    packedEffects.push({
      机制: '引爆持续伤害',
      目标: normalizedTarget,
      引爆倍率: Number(({ C: 1.3, B: 1.55, A: 1.8, S: 2.1 }[grade] || 1.55).toFixed(2)),
      消耗持续伤害: true,
    });
  if (main === '特殊规则类' && archetype === '斩盾')
    packedEffects.push({
      机制: '斩盾',
      目标: normalizedTarget,
      斩盾倍率: Number(({ C: 0.7, B: 0.95, A: 1.2, S: 1.5 }[grade] || 0.95).toFixed(2)),
    });
  if (main === '特殊规则类' && archetype === '窃取护盾')
    packedEffects.push({
      机制: '窃取护盾',
      目标: normalizedTarget,
      窃盾比例: Number(({ C: 0.45, B: 0.6, A: 0.78, S: 1.0 }[grade] || 0.6).toFixed(2)),
      持续回合: Math.max(2, Number(state.持续回合 || 2)),
    });
  if (secondary.includes('状态转移'))
    packedEffects.push({
      机制: '状态转移',
      目标: normalizedTarget,
      转移类型: '自身负面->目标',
      转移数量: 1,
      触发条件: '命中后',
    });
  if (secondary.includes('引爆持续伤害'))
    packedEffects.push({
      机制: '引爆持续伤害',
      目标: normalizedTarget,
      引爆倍率: Number((({ C: 1.0, B: 1.2, A: 1.35, S: 1.5 }[grade] || 1.2) * secondaryEffectScale).toFixed(2)),
      消耗持续伤害: true,
    });
  if (secondary.includes('斩盾'))
    packedEffects.push({
      机制: '斩盾',
      目标: normalizedTarget,
      斩盾倍率: Number((({ C: 0.45, B: 0.6, A: 0.8, S: 1.0 }[grade] || 0.6) * secondaryEffectScale).toFixed(2)),
    });
  if (secondary.includes('窃取护盾'))
    packedEffects.push({
      机制: '窃取护盾',
      目标: normalizedTarget,
      窃盾比例: Number((({ C: 0.3, B: 0.45, A: 0.6, S: 0.8 }[grade] || 0.45) * secondaryEffectScale).toFixed(2)),
      持续回合: Math.max(1, Number(state.持续回合 || 1)),
    });
  if (secondary.includes('吞噬'))
    packedEffects.push({
      机制: '吞噬',
      目标: normalizedTarget,
      资源类型: resourceDrainType,
      夺取比例: Number((({ C: 0.08, B: 0.12, A: 0.16, S: 0.22 }[grade] || 0.12) * secondaryEffectScale).toFixed(2)),
      转化比例: Number(({ C: 0.85, B: 0.95, A: 1.05, S: 1.15 }[grade] || 0.95).toFixed(2)),
    });
  if (secondary.includes('能力共享'))
    packedEffects.push(appendPackedEffectObjectDiffRules({
      机制: '能力共享',
      目标: resolvePackedSemanticTarget('能力共享'),
      资源类型: resourceRefeedType,
      反灌比例: Number((({ C: 0.1, B: 0.14, A: 0.18, S: 0.24 }[grade] || 0.14) * secondaryEffectScale).toFixed(2)),
    }, 是否食物系 ? 食物恢复自服禁用规则 : []));
  if (secondary.includes('机制抹消'))
    packedEffects.push({
      机制: '机制抹消',
      目标: normalizedTarget,
      抹消目标: mechanismSuppressTarget,
      抹消方式: '仅封锁后续',
      持续回合: secondaryMechanismSuppressDuration,
    });
  if (main === '特殊规则类' && archetype === '规则改写') {
    packedEffects.push({
      机制: '高波动随机值',
      目标: '自身',
      波动下限: Number(({ C: 0.75, B: 0.6, A: 0.5, S: 0.4 }[grade] || 0.6).toFixed(2)),
      波动上限: Number(({ C: 1.35, B: 1.55, A: 1.75, S: 2.0 }[grade] || 1.55).toFixed(2)),
    });
    if (gradeFactor >= 2)
      packedEffects.push({
        机制: '随机目标',
        目标: '随机目标',
        偏移概率: Number(({ B: 0.2, A: 0.35, S: 0.5 }[grade] || 0.2).toFixed(2)),
      });
    if (gradeFactor >= 4) packedEffects.push({ 机制: '自身也受影响', 目标: '自身', 双向生效: true });
  }
  if (mutation.includes('自身也受影响')) packedEffects.push({ 机制: '自身也受影响', 目标: '自身', 双向生效: true });
  if (mutation.includes('随机目标')) packedEffects.push({ 机制: '随机目标', 目标: '随机目标', 偏移概率: 0.5 });
  if (mutation.includes('高波动随机值'))
    packedEffects.push({ 机制: '高波动随机值', 目标: '自身', 波动下限: 0.5, 波动上限: 1.8 });
  if (mutation.includes('自残换收益'))
    packedEffects.push({
      机制: '自残换收益',
      目标: '自身',
      体力代价: Math.max(0, Number(selfSacrificeVitCost || 0)),
      增伤倍率: 1.25,
      已计入消耗: true,
    });
  if (mutation.includes('回复转伤害'))
    packedEffects.push({ 机制: '回复转伤害', 目标: normalizedTarget, 转换比例: 1.0 });
  if (mutation.includes('伤害转回复'))
    packedEffects.push({
      机制: '伤害转回复',
      目标: resolvePackedSemanticTarget('伤害转回复'),
      转换比例: Number(((clash.瞬间恢复比例 || 0) / 100).toFixed(2)),
    });
  if (mutation.includes('效果反转'))
    packedEffects.push({ 机制: '效果反转', 目标: normalizedTarget, 反转类型: '增减益反转' });

  const shouldPackFieldEffect =
    String(field.实体名称 || '无') !== '无' ||
    (Number(field.持续回合 || 0) > 0 && String(field.核心机制描述 || '无') !== '无');
  if (shouldPackFieldEffect) {
    packedEffects.push({
      机制: '召唤与场地',
      目标: normalizedTarget,
      实体名称: String(field.实体名称 || state.状态名称 || '场地效果'),
      持续回合: Number(field.持续回合 || state.持续回合 || 0),
      继承属性比例: Number(field.继承属性比例 || 0),
      核心机制描述: String(field.核心机制描述 || state.特殊机制标识 || '场地效果'),
    });
  }

  const hasMeaningfulStateMods = Object.values(state.面板修改比例 || {}).some(
    value => Number.isFinite(Number(value)) && Math.abs(Number(value) - 1) > 0.001,
  );
  const hasMeaningfulStateCalc = Object.entries(stateCalc || {}).some(([key, value]) => {
    if (key === 'skip_turn' || key === 'cannot_react') return value === true;
    if (
      ['control_resist_mult', 'final_damage_mult', 'final_heal_mult', 'shield_gain_mult', 'cost_ratio', 'windup_ratio', 'mastery_ratio', 'speed_ratio'].includes(
        key,
      )
    )
      return Math.abs(Number(value || 1) - 1) > 0.001;
    if (typeof value === 'boolean') return value === true;
    return Math.abs(Number(value || 0)) > 0.001;
  });
  const shouldPackGenericState = (() => {
    if (main === '伤害类') return false;
    if (['增益类', '削弱类', '回复类'].includes(main)) return false;
    if (main === '防御类')
      return !['护盾', '减伤', '格挡/抵消', '霸体', '免死/锁血', '无敌金身', '伤害反射', '伤害分摊', '替身抵消', '复苏'].includes(archetype);
    if (main === '感知/认知类') return !['感知干扰', '标记锁定', '共享视野', '幻境', '催眠', '认知扭曲'].includes(archetype);
    if (main === '控制类' && archetype === '硬控') return false;
    if (main === '特殊规则类' && ['条件触发', '转化', '复制', '状态交换', '规则改写'].includes(archetype)) return false;
    return (
      hasMeaningfulStateMods ||
      hasMeaningfulStateCalc ||
      (state.特殊机制标识 && state.特殊机制标识 !== '无') ||
      Number(state.持续回合 || 0) > 0
    );
  })();
  if (shouldPackGenericState) {
    const genericStateTarget =
      (main === '位移类' && ['自身位移', '追击位移', '脱离位移'].includes(archetype)) ||
      (main === '特殊规则类' && ['反制', '分身'].includes(archetype))
        ? resolvePackedSemanticTarget(archetype, normalizedTarget)
        : normalizedTarget;
    packedEffects.push({
      机制: '状态挂载',
      目标: genericStateTarget,
      状态名称: state.状态名称,
      持续回合: state.持续回合 || 0,
      面板修改比例: state.面板修改比例,
      计算层效果: state.计算层效果,
      特殊机制标识: state.特殊机制标识 && state.特殊机制标识 !== '无' ? String(state.特殊机制标识) : undefined,
    });
  }

  if (是否食物系) {
    const 恢复机制集合 = new Set(['持续恢复', '能力共享']);
    packedEffects.forEach(effect => {
      if (!effect || typeof effect !== 'object') return;
      const mechanism = String(effect.机制 || '').trim();
      if (!mechanism || mechanism === '系统基础') return;
      if (Array.isArray(effect.对象差异规则) && effect.对象差异规则.some(rule => {
        const condition = String(rule?.条件 || '').trim();
        const action = String(rule?.处理 || '').trim();
        return condition === '自身' && action === '禁用';
      })) {
        return;
      }
      const isRecoverAttributeEffect =
        mechanism === '属性变化' &&
        ['sp', 'men', 'vit', 'hp'].includes(String(effect.属性 || '').trim()) &&
        ['加值', '持续恢复'].includes(String(effect.动作 || '').trim());
      if (恢复机制集合.has(mechanism) || isRecoverAttributeEffect) {
        appendPackedEffectObjectDiffRules(effect, 食物恢复自服禁用规则);
        return;
      }
      appendPackedEffectObjectDiffRules(effect, 食物自服效能调整规则);
    });
  }

  const 多方向决策 = String(blueprint?.是否多方向 || '').trim();
  const 多方向类型决策 = String(blueprint?.多方向类型 || '').trim();
  const 多方向类型命中 = 技能多方向类型候选_V1.includes(多方向类型决策) ? 多方向类型决策 : '';
  const 显式禁用多方向 = 多方向决策 === '否';
  const 显式启用多方向 = 多方向决策 === '是';
  let 启用多方向 = false;
  if (显式禁用多方向) {
    启用多方向 = false;
  } else if (显式启用多方向) {
    启用多方向 = true;
  } else if (多方向类型命中 === '无') {
    启用多方向 = false;
  } else if (多方向类型命中) {
    启用多方向 = true;
  } else {
    启用多方向 = isAutoGeneratedMultiDirectionArchetype(archetype);
  }
  const 生效多方向类型 = 启用多方向 ? 多方向类型命中 : '无';
  const 命中多方向模板 =
    !passiveMode &&
    blueprint.释放形态 !== '造物承载' &&
    启用多方向 &&
    main !== '防御类' &&
    main !== '回复类';
  if (命中多方向模板) {
    const 分支列表 = 构建自动多方向分支列表_V1(normalizedTarget, grade, 生效多方向类型);
    if (分支列表.length > 0) {
      const 基础公共效果 = clonePackedSkillEffects(packedEffects);
      const 分支效果 = [];
      分支列表.forEach(分支项 => {
        const 分支名 = String(分支项?.分支标记 || '').trim();
        (Array.isArray(分支项?.分支效果数组) ? 分支项.分支效果数组 : []).forEach(effect => {
          if (!effect || typeof effect !== 'object' || Array.isArray(effect)) return;
          const 目标模型 = normalizeSkillTargetModel(effect.目标 || effect.对象 || normalizedTarget, normalizedTarget);
          分支效果.push({
            ...cloneJsonValue(effect),
            目标: 目标模型,
            对象: mapSkillTargetModelToCombatTarget(目标模型),
            分支标记: 分支名,
          });
        });
      });
      if (分支效果.length > 0) {
        packedEffects.length = 0;
        packedEffects.push(...基础公共效果, ...分支效果);
      }
    }
  }

  应用生成魂技固化数值规则_V1(packedEffects, {
    来源类别: skillSourceCategory,
    系别: type,
    魂环位: ringIndex,
    武魂名称: String(options?.martialSoulName || options?.textContext?.martialSoulName || options?.textContext?.spiritName || '').trim(),
    当前魂环数量: Math.max(1, Math.floor(Number(options?.当前魂环数量 || options?.ringCount || 1))),
  });

  if (
    skillSourceCategory === '魂技' &&
    是否辅助系名称_V1(type) &&
    是否七九武魂名称_V1(String(options?.martialSoulName || options?.textContext?.martialSoulName || options?.textContext?.spiritName || '').trim())
  ) {
    战斗.目标模型 = '友方单体';
    战斗.结算策略 = getSkillTargetResolutionStrategy('友方单体');
    战斗.对象 = mapSkillTargetModelToCombatTarget('友方单体');
  }

  if (passiveMode) {
    战斗.目标模型 = '自身';
    战斗.目标修饰 = [];
    战斗.结算策略 = '单目标独立';
    战斗.对象 = '自身';
    战斗.技能类型 = String(战斗.技能类型 || '').includes('被动')
      ? String(战斗.技能类型 || '被动')
      : String(战斗.技能类型 || '').trim()
        ? `被动/${战斗.技能类型}`
        : '被动';
    战斗.cast_time = 0;
    战斗.消耗 = '无';

    const passiveFriendlyMechs = new Set([
      '属性变化',
      '持续恢复',
      '消耗提高',
      '消耗降低',
      '前摇拉长',
      '前摇缩短',
      '掌控修正',
      '速度修正',
      '属性永久强化',
      '受击反击',
      '减伤',
      '格挡',
      '霸体',
      '免死',
      '共享视野',
      '分身',
    ]);
    const passiveEffects = [];
    packedEffects.forEach(effect => {
      const 机甲 = String(effect?.机制 || '');
      if (!passiveFriendlyMechs.has(机甲)) return;
      if (机甲 === '属性永久强化') {
        passiveEffects.push({ ...effect, 目标: '自身' });
        return;
      }
      const patched = { ...effect, 目标: '自身', 对象: '自身' };
      if (patched.持续 !== undefined) patched.持续 = Math.max(999, Number(patched.持续 || 0) || 999);
      if (patched.持续回合 !== undefined) patched.持续回合 = Math.max(999, Number(patched.持续回合 || 0) || 999);
      passiveEffects.push(patched);
    });

    const hasStablePassiveCore = passiveEffects.some(effect =>
      ['属性变化', '持续恢复', '消耗提高', '消耗降低', '前摇拉长', '前摇缩短', '掌控修正', '速度修正', '属性永久强化'].includes(
        String(effect?.机制 || ''),
      ),
    );
    if (!hasStablePassiveCore) {
      const strengthenRatio = Number(({ C: 0.03, B: 0.05, A: 0.07, S: 0.1 }[grade] || 0.05).toFixed(2));
      if (hasMeaningfulStateMods || hasMeaningfulStateCalc || (state.特殊机制标识 && state.特殊机制标识 !== '无')) {
        const passiveCoreEffects = [
          ...buildPackedAttributeEffectsFromRatios('自身', state.面板修改比例 || {}, 999),
        ];
        const pushPassiveRatioEffect = (mechanism, property, action, value) => {
          if (Math.abs(Number(value || 1) - 1) <= 0.001) return;
          const effect = buildPackedAttributeEffect(mechanism, '自身', property, action, value, 999, '常驻');
          if (effect) passiveCoreEffects.push(effect);
        };
        pushPassiveRatioEffect(Number(stateCalc.cost_ratio || 1) > 1 ? '消耗提高' : '消耗降低', '消耗', Number(stateCalc.cost_ratio || 1) > 1 ? '消耗提高' : '消耗降低', stateCalc.cost_ratio || 1);
        pushPassiveRatioEffect(Number(stateCalc.windup_ratio || 1) > 1 ? '前摇拉长' : '前摇缩短', '前摇', Number(stateCalc.windup_ratio || 1) > 1 ? '前摇拉长' : '前摇缩短', stateCalc.windup_ratio || 1);
        pushPassiveRatioEffect('掌控修正', '掌控', Number(stateCalc.mastery_ratio || 1) > 1 ? '倍率提升' : '倍率压制', stateCalc.mastery_ratio || 1);
        pushPassiveRatioEffect('速度修正', '速度', Number(stateCalc.speed_ratio || 1) > 1 ? '倍率提升' : '倍率压制', stateCalc.speed_ratio || 1);
        if (passiveCoreEffects.length > 0) {
          passiveEffects.unshift(...passiveCoreEffects);
        }
      } else {
        passiveEffects.unshift({ 机制: '属性永久强化', 目标: '自身', 强化值: strengthenRatio });
      }
    }

    packedEffects.length = 0;
    packedEffects.push(...passiveEffects);
  }

  if (blueprint.释放形态 === '造物承载') {
    const usageEffects = buildCreationUsageEffects(packedEffects, type);
    packedEffects.length = 0;
    const inventoryUsageEffects = buildConstructUsableEffects(
      usageEffects,
      type === '食物系' ? '食用者' : '自身',
      type,
    );
    const itemName = AI_TODO_SKILL_NAME;
    const ttl = buildTemporaryConstructDurationTicks(grade, ringIndex);
    const itemType = type === '食物系' ? '食物' : '魂技造物';
    const triggerMode = type === '食物系' ? '食用' : '使用';
    const itemDesc = buildTemporaryConstructDescription(itemName, inventoryUsageEffects, ttl, { type: itemType });
    packedEffects.push({
      机制: '造物生成',
      目标: '自身',
      魂技名: itemName,
      产物类型: itemType,
      数量: gradeFactor >= 4 ? 2 : 1,
      有效期tick: ttl,
      有效期间: formatTickDurationAsDayText(ttl),
      可分发: type === '食物系',
      触发方式: triggerMode,
      使用效果: usageEffects,
      背包模板: {
        数量: 1,
        类型: itemType,
        装备槽位: '无',
        品质: quality,
        品阶: type === '食物系' ? '魂技食物' : '魂技造物',
        融合参数: {},
        词条: {},
        耐久: 100,
        完整度: 100,
        市场估值: { 价格: 0, 货币: '联邦币' },
        描述: itemDesc,
        标签: ['临时造物', type === '食物系' ? '食物系' : '造物系'],
        来源技能: itemName,
      },
    });
  }

  const systemBaseEffect = buildMinimalSkillRuntimeSystemBaseEffect({
    技能来源: skillSourceCategory,
    技能类型: 战斗.技能类型 || '无',
    目标模型: 战斗.目标模型 || targetModel,
    结算策略: 战斗.结算策略 || getSkillTargetResolutionStrategy(战斗.目标模型 || targetModel),
    消耗: 战斗.消耗 || '无',
    cast_time: 战斗.cast_time || 0,
    副作用列表,
  });

  const 生成结果 = {
    魂技名: AI_TODO_SKILL_NAME,
    画面描述: AI_TODO_SKILL_VISUAL,
    效果描述: AI_TODO_SKILL_EFFECT,
    技能来源: skillSourceCategory,
    技能类型: 战斗.技能类型 || '无',
    目标模型: 战斗.目标模型 || normalizeSkillTargetModel(targetModel, '敌方单体'),
    结算策略: String(战斗.结算策略 || getSkillTargetResolutionStrategy(战斗.目标模型 || targetModel)).trim() || '单目标独立',
    消耗: 战斗.消耗 || '无',
    cast_time: 战斗.cast_time || 0,
    _效果数组: [systemBaseEffect, ...packedEffects],
  };
  return 收口技能执行结构_V1(生成结果, { 目标模型: 战斗.目标模型 || normalizeSkillTargetModel(targetModel, '敌方单体') });
}

const GENERATION_CHECK_TYPE_HINT_BY_MECHANISM_V1 = Object.freeze({
  吞噬: '精神系',
  能力共享: '辅助系',
  修炼增益: '食物系',
  机制抹消: '控制系',
  状态转移: '精神系',
  引爆持续伤害: '元素系',
  斩盾: '强攻系',
  窃取护盾: '辅助系',
  无敌金身: '敏攻系',
  伤害反射: '强攻系',
  伤害分摊: '控制系',
  替身抵消: '敏攻系',
  复苏: '治疗系',
});

const GENERATION_STRENGTH_RULES_V1 = Object.freeze({
  吞噬: Object.freeze([
    { 字段: '夺取比例', 模式: 'gt' },
    { 字段: '转化比例', 模式: 'gt' },
  ]),
  能力共享: Object.freeze([{ 字段: '反灌比例', 模式: 'gt' }]),
  修炼增益: Object.freeze([{ 字段: '修炼速度倍率', 模式: 'gt' }]),
  机制抹消: Object.freeze([
    { 字段: '抹消方式', 模式: 'pair_eq', 主期望: '移除并封锁', 副期望: '仅封锁后续' },
    { 字段: '持续回合', 模式: 'gt' },
  ]),
  状态转移: Object.freeze([{ 字段: '转移数量', 模式: 'gt' }]),
  引爆持续伤害: Object.freeze([{ 字段: '引爆倍率', 模式: 'gt' }]),
  斩盾: Object.freeze([{ 字段: '斩盾倍率', 模式: 'gt' }]),
  窃取护盾: Object.freeze([
    { 字段: '窃盾比例', 模式: 'gt' },
    { 字段: '持续回合', 模式: 'gt' },
  ]),
  无敌金身: Object.freeze([
    { 字段: '每日触发上限', 模式: 'gt' },
    { 字段: 'damage_reduction', 模式: 'gt' },
  ]),
  伤害反射: Object.freeze([
    { 字段: '反射比例', 模式: 'gt' },
    { 字段: 'damage_reduction', 模式: 'gt' },
  ]),
  伤害分摊: Object.freeze([
    { 字段: '分摊比例', 模式: 'gt' },
    { 字段: '分摊人数', 模式: 'gt' },
  ]),
  替身抵消: Object.freeze([{ 字段: '抵消次数', 模式: 'gt' }]),
  复苏: Object.freeze([{ 字段: '复苏回血比例', 模式: 'gt' }]),
});

function findPackedEffectByMechanism(效果数组 = [], mechanism = '') {
  const normalizedMechanism = String(mechanism || '').trim();
  return (
    (Array.isArray(效果数组) ? 效果数组 : []).find(effect => String(effect?.机制 || '').trim() === normalizedMechanism) || null
  );
}

function buildGenerationCarrierBlueprintForSecondary(机制名称 = '', type = '强攻系') {
  const normalizedMechanism = String(机制名称 || '').trim();
  const grantableSet = new Set(['能力共享', '无敌金身', '伤害反射', '伤害分摊', '替身抵消', '复苏']);
  if (grantableSet.has(normalizedMechanism)) {
    return {
      主机制大类: '增益类',
      主机制原型: '单属性增益',
      目标模型: normalizedMechanism === '伤害分摊' ? '友方群体' : '友方单体',
      副机制: [normalizedMechanism],
      变异机制: [],
      释放形态: ['食物系', '辅助系', '治疗系'].includes(type) ? '直接生效' : '自身附体',
    };
  }
  return {
    主机制大类: '伤害类',
    主机制原型: '直接伤害',
    目标模型: '敌方单体',
    副机制: [normalizedMechanism],
    变异机制: [],
    释放形态: '直接生效',
  };
}

function buildGenerationCheckSkillCase(options = {}) {
  const type = String(options?.系别 || options?.type || '精神系').trim() || '精神系';
  const grade = String(options?.品级 || options?.grade || 'A').trim() || 'A';
  const ringIndex = Math.max(1, Number(options?.魂环位 || options?.ringIndex || 5));
  const blueprintOverride = options?.blueprintOverride && typeof options.blueprintOverride === 'object' ? options.blueprintOverride : {};
  const blueprint = normalizeBlueprintOverrideForAutoGenerate(blueprintOverride, type, grade, ringIndex, [], options);
  const skill = autoGenerateSkill(type, 95, 100000, ringIndex, 100, [], 0, {
    sourceCategory: String(options?.技能来源 || options?.sourceCategory || '魂技').trim() || '魂技',
    gradeOverride: grade,
    qualityOverride: String(options?.品质 || options?.quality || grade).trim() || grade,
    blueprintOverride: blueprint,
    当前魂环数量: Math.max(1, Math.floor(Number(options?.当前魂环数量 || options?.ringCount || ringIndex || 1))),
    martialSoulName: String(options?.武魂名称 || options?.martialSoulName || options?.sourceName || options?.spiritName || '').trim(),
    textContext: {
      spiritName: String(options?.sourceName || options?.spiritName || '').trim(),
      martialSoulName: String(options?.武魂名称 || options?.martialSoulName || options?.sourceName || options?.spiritName || '').trim(),
    },
  });
  return { blueprint, skill };
}

function runSkillGenerationRuleChecks(options = {}) {
  const grade = String(options?.品级 || options?.grade || 'A').trim() || 'A';
  const ringIndex = Math.max(1, Number(options?.魂环位 || options?.ringIndex || 5));
  const exclusiveChecks = Array.from(AUTO_GENERATED_EXCLUSIVE_MAIN_ARCHETYPES_V1).map(mechanism => {
    const type = GENERATION_CHECK_TYPE_HINT_BY_MECHANISM_V1[mechanism] || '精神系';
    const checkCase = buildGenerationCheckSkillCase({
      系别: type,
      品级: grade,
      魂环位: ringIndex,
      blueprintOverride: {
        主机制原型: mechanism,
        副机制: ['小护盾'],
        变异机制: ['随机目标'],
        目标模型: ['能力共享', '无敌金身', '伤害反射', '伤害分摊', '替身抵消', '复苏'].includes(mechanism)
          ? '友方单体'
          : '敌方单体',
        释放形态: '直接生效',
      },
    });
    const blueprint = checkCase.blueprint;
    const passed =
      blueprint?.独占主机制 === true &&
      Array.isArray(blueprint?.副机制) &&
      blueprint.副机制.length === 0 &&
      Array.isArray(blueprint?.变异机制) &&
      blueprint.变异机制.length === 0;
    return {
      机制: mechanism,
      系别: type,
      通过: passed,
      独占主机制: blueprint?.独占主机制 === true,
      副机制数量: Array.isArray(blueprint?.副机制) ? blueprint.副机制.length : -1,
      变异机制数量: Array.isArray(blueprint?.变异机制) ? blueprint.变异机制.length : -1,
    };
  });

  const strengthChecks = Object.entries(GENERATION_STRENGTH_RULES_V1).map(([mechanism, fieldRules]) => {
    const type = GENERATION_CHECK_TYPE_HINT_BY_MECHANISM_V1[mechanism] || '精神系';
    const mainCase = buildGenerationCheckSkillCase({
      系别: type,
      品级: grade,
      魂环位: ringIndex,
      blueprintOverride: {
        主机制原型: mechanism,
        目标模型: ['能力共享', '无敌金身', '伤害反射', '伤害分摊', '替身抵消', '复苏'].includes(mechanism)
          ? mechanism === '伤害分摊'
            ? '友方群体'
            : '友方单体'
          : '敌方单体',
        释放形态: '直接生效',
      },
    });
    const secondaryCase = buildGenerationCheckSkillCase({
      系别: type,
      品级: grade,
      魂环位: ringIndex,
      blueprintOverride: buildGenerationCarrierBlueprintForSecondary(mechanism, type),
    });
    const mainEffect = findPackedEffectByMechanism(mainCase.skill?._效果数组, mechanism);
    const secondaryEffect = findPackedEffectByMechanism(secondaryCase.skill?._效果数组, mechanism);
    const fieldChecks = (Array.isArray(fieldRules) ? fieldRules : []).map(rule => {
      const field = String(rule?.字段 || '').trim();
      const mode = String(rule?.模式 || 'gt').trim();
      const mainValue = mainEffect?.[field];
      const secondaryValue = secondaryEffect?.[field];
      let passed = false;
      if (mode === 'pair_eq') {
        passed = String(mainValue || '') === String(rule?.主期望 || '') && String(secondaryValue || '') === String(rule?.副期望 || '');
      } else if (mode === 'gt') {
        passed = Number(mainValue || 0) > Number(secondaryValue || 0);
      } else if (mode === 'gte') {
        passed = Number(mainValue || 0) >= Number(secondaryValue || 0);
      } else if (mode === 'eq') {
        passed = String(mainValue || '') === String(secondaryValue || '');
      }
      return {
        字段: field,
        模式: mode,
        主值: mainValue,
        副值: secondaryValue,
        通过: passed,
      };
    });
    return {
      机制: mechanism,
      系别: type,
      通过: !!mainEffect && !!secondaryEffect && fieldChecks.every(item => item.通过),
      主效果: mainEffect,
      副效果: secondaryEffect,
      字段校验: fieldChecks,
    };
  });

  return {
    品级: grade,
    魂环位: ringIndex,
    独占主机制校验: exclusiveChecks,
    主副强度校验: strengthChecks,
    汇总: {
      独占通过数: exclusiveChecks.filter(item => item.通过).length,
      独占总数: exclusiveChecks.length,
      分档通过数: strengthChecks.filter(item => item.通过).length,
      分档总数: strengthChecks.length,
    },
  };
}

if (typeof globalThis !== 'undefined') {
  globalThis.__LWCS_BUILD_GENERATION_CHECK_SKILL__ = buildGenerationCheckSkillCase;
  globalThis.__LWCS_RUN_GENERATION_RULE_CHECKS__ = runSkillGenerationRuleChecks;
}

const AI_TODO_TEXT_PREFIX = '待补全';
const SKILL_TEXT_UNKNOWN = '未知';
const AI_TODO_SKILL_NAME =
  '待补全（填写魂技名；命名必须与所属武魂/魂灵同源，禁止无关命名；若为造物承载类技能，此名称同时作为生成物名称）';
const AI_TODO_SKILL_VISUAL = '待补全（依据魂技名与_效果数组补全发动画面，保持与机制一致，不新增机制）';
const AI_TODO_SKILL_VISUAL_STAGE1 =
  '待补全（请结合武魂特性、魂环来源魂兽特性、当前剧情上下文与机制选择（主机制/副机制1/副机制2/变异机制/是否多方向/多方向类型）补全发动画面，不新增机制）';
const AI_TODO_SKILL_EFFECT = '待补全（依据_效果数组补全效果描述，保持与机制一致，不新增机制，必须包含消耗与效果）';
const AI_TODO_SPIRIT_NAME = '待补全(填写具体武魂名，如蓝银草/蓝银皇)';
const AI_TODO_SPIRIT_DESC = '待补全(描述武魂外形、核心能力与战斗特征)';
const AI_TODO_SPIRIT_ELEMENT = '待补全(填写元素倾向；无属性也请明确写无)';
const AI_TODO_ATTRIBUTE_SYSTEM = '待补全（填写属性体系：无/元素/五行）';
const AI_TODO_ATTRIBUTE_CAPACITY = '待补全（填写可容纳属性列表：  金 / 木 / 水 / 火 / 土 / 风 / 雷 / 冰 / 光 / 暗 / 精神 / 空间 / 时间 / 创造 / 毁灭，无属性体系请填“无”）';
const AI_TODO_SOUL_SPIRIT_NAME = '待补全（魂兽名）';
const AI_TODO_SOUL_SPIRIT_DESC = '待补全（请结合魂灵物种、年限、品质补全外形、血脉特征、行动风格与能力倾向）';
const AI_TODO_SOUL_SPIRIT_QUALITY =
  '待补全（可选f/d/c/b/a/s/s+；f为劣质魂灵，如草蛇等杂血弱种；d为低劣魂灵，如普通凶性野兽型魂灵；c为普通魂灵，具备基础血脉与战斗价值；b为良品魂灵，常见强势魂兽；a为精英魂灵，稀有异种或强族后裔；s为顶尖魂灵，王族血脉或顶级龙种；s+为神话级魂灵，真龙、神兽后裔或极端变异个体）';
const AI_TODO_SOUL_BONE_SOURCE = '待补全(请填写魂骨来源的魂兽名)';
const AI_TODO_MAIN_IDENTITY = '待补全(填写当前主要公开身份)';
const AI_TODO_PERSONALITY = '待补全(根据角色设定补全性格特征)';
const AI_TODO_STATUS_LOC = '斗罗大陆-待补全(按大陆-城市-地点完整路径填写，禁止只填单一地名)';
const AI_TODO_BACKGROUND = '待补全(请结合角色的家庭出身、成长环境、资源条件、父母来历与所属圈层，补全其家世或出身背景描述)';
const AI_TODO_TALENT_RATING = '待补全(请根据角色的武魂潜力、血脉资质、悟性、心性、成长环境与资源条件，给出1-100的天赋评级分数，仅填写数字)';
function isAiTodoText(value) {
  const text = String(value || '').trim();
  return text.startsWith(AI_TODO_TEXT_PREFIX);
}

function isStorageTodoPlaceholderText(value) {
  const text = String(value || '').trim();
  if (!text) return false;
  if (text === AI_TODO_SOUL_BONE_SOURCE) return false;
  if (/^待补全\(名称格式：魂兽名\+.+魂骨/.test(text)) return false;
  return /^待补全/.test(text);
}

function clearStorageTodoPlaceholders(node) {
  if (!node || typeof node !== 'object') return node;

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const item = node[i];
      if (typeof item === 'string') {
        if (isStorageTodoPlaceholderText(item)) node[i] = '';
      } else {
        clearStorageTodoPlaceholders(item);
      }
    }
    return node;
  }

  Object.keys(node).forEach(key => {
    const value = node[key];
    if (typeof value === 'string') {
      if (isStorageTodoPlaceholderText(value)) node[key] = '';
      return;
    }
    clearStorageTodoPlaceholders(value);
  });
  return node;
}

function buildSkillNameTodoText(context = {}) {
  const rawSpiritName = String(context?.spiritName || '').trim();
  const spiritName =
    rawSpiritName && !isAiTodoText(rawSpiritName) && rawSpiritName !== '未展露' ? rawSpiritName : '所属武魂';
  const typeText = String(context?.type || '').trim();
  const foodHint = typeText === '食物系' ? '食物系命名必须围绕该武魂主材，不得替换为无关食材。' : '';
  return `待补全（填写魂技名；必须围绕【${spiritName}】同源命名并体现该武魂能力特征，禁止无关命名；需与机制选择（主机制/副机制1/副机制2/是否多方向/多方向类型）保持一致。若为造物承载类技能，此名称同时作为生成物名称。${foodHint}）`;
}

function 构建魂骨名称待生成提示词_V1(骨部位 = '魂骨') {
  const 安全部位 = String(骨部位 || '魂骨').trim() || '魂骨';
  return `待补全(名称格式：魂兽名+${安全部位}，例如暗金恐爪熊${安全部位})`;
}

function 是否有效魂骨来源_V1(value = '') {
  const 文本 = String(value || '').trim();
  if (!文本 || 文本 === '无' || 文本 === '未知') return false;
  if (isAiTodoText(文本)) return false;
  return true;
}

function 归一化魂骨名称_V1(名称 = '', 来源 = '', 骨部位 = '魂骨') {
  const 安全名称 = String(名称 || '').trim();
  const 安全部位 = String(骨部位 || '魂骨').trim() || '魂骨';
  if (是否有效魂骨来源_V1(来源)) {
    if (!安全名称 || isAiTodoText(安全名称) || /^【未鉴定之/.test(安全名称) || 安全名称 === '无') {
      return `${String(来源).trim()}${安全部位}`;
    }
    return 安全名称;
  }
  if (安全名称 && !/^【未鉴定之/.test(安全名称) && 安全名称 !== '无') return 安全名称;
  return 构建魂骨名称待生成提示词_V1(安全部位);
}

function createEmptySoulSpiritPowerPanel() {
  return {
    对标等级: 0,
    str: 0,
    def: 0,
    agi: 0,
    vit_max: 0,
    men_max: 0,
    sp_max: 0,
  };
}

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
const SOUL_SPIRIT_QUALITY_LEVEL_OFFSET_MAP = Object.freeze({ F: -6, D: -3, C: 0, B: 2, A: 5, S: 8, 'S+': 12 });
const SOUL_SPIRIT_SPECIES_CATEGORY_RULES = Object.freeze([
  {
    category: '海魂兽',
    keywords: ['海龙', '海蛇', '海马', '海魂', '鲸', '鲨', '鱼', '龟', '蟹', '虾', '贝', '章鱼', '水母', '鳗'],
  },
  { category: '龙类', keywords: ['真龙', '圣龙', '祖龙', '龙王', '龙皇', '应龙', '蛟龙', '蛟', '龙'] },
  { category: '蛛类', keywords: ['蛛', '蜘蛛'] },
  { category: '熊类', keywords: ['熊', '罴'] },
  { category: '鸟类', keywords: ['凤凰', '凤', '凰', '鸟', '鹰', '雕', '鹏', '鹤', '雀', '鸦', '隼'] },
  { category: '猫科', keywords: ['猫', '虎', '狮', '豹', '猞猁'] },
  { category: '蛇类', keywords: ['蛇', '蟒', '蚺'] },
  { category: '植物系', keywords: ['蓝银', '草', '藤', '树', '木', '花', '莲', '竹', '蘑', '植物'] },
]);

function normalizeSoulSpiritQuality(value = '') {
  const text = String(value || '')
    .trim()
    .toUpperCase()
    .replace('＋', '+')
    .replace(/\s+/g, '');
  return SOUL_SPIRIT_QUALITY_VALUES.includes(text) ? text : '';
}

function resolveSoulSpiritSpeciesCategory(species = '') {
  const text = String(species || '').trim();
  if (!text || text === '未知' || text === '未展露' || isAiTodoText(text)) return '未知';
  const direct = ['龙类', '蛛类', '熊类', '植物系', '海魂兽', '鸟类', '猫科', '蛇类'].find(item => item === text);
  if (direct) return direct;
  const matched = SOUL_SPIRIT_SPECIES_CATEGORY_RULES.find(rule =>
    rule.keywords.some(keyword => text.includes(keyword)),
  );
  return matched?.category || '未知';
}

function inferSoulSpiritQuality(武魂 = {}) {
  const age = Math.max(0, Number(武魂?.年限 || 0));
  const species = String(武魂?.表象名称 || '').trim();
  const 状态 = String(武魂?.状态 || '').trim();
  if (age <= 0 && (!species || species === '未展露' || isAiTodoText(species))) return '';

  let score = 2;
  if (age >= 200000) score += 3;
  else if (age >= 100000) score += 2;
  else if (age >= 10000) score += 1;
  else if (age > 0 && age < 30) score -= 2;
  else if (age > 0 && age < 100) score -= 1;

  if (/(真龙|圣龙|祖龙|龙王|龙皇|神兽|麒麟|凤凰|鲲鹏|比蒙|银龙|金龙)/.test(species)) score += 2;
  else if (/(龙|凤|凰|王|皇|帝|君|圣|天狐|九尾|泰坦|邪眼)/.test(species)) score += 1;
  else if (/(草|藤|虫|鼠|兔|雀|蚁)/.test(species)) score -= 1;

  if (/(残|衰|濒死|破碎|虚弱)/.test(状态)) score -= 1;
  return SOUL_SPIRIT_QUALITY_VALUES[_.clamp(score, 0, SOUL_SPIRIT_QUALITY_VALUES.length - 1)] || '';
}

function buildSoulSpiritDescriptionTodoText(武魂 = {}) {
  const species = String(武魂?.表象名称 || '').trim();
  const quality = normalizeSoulSpiritQuality(武魂?.品质 || '');
  const age = Math.max(0, Math.floor(Number(武魂?.年限 || 0)));
  const category = resolveSoulSpiritSpeciesCategory(species);
  const segments = [];
  if (species && species !== '未展露' && !isAiTodoText(species)) segments.push(`物种=${species}`);
  if (age > 0) segments.push(`年限=${age}年`);
  if (quality) segments.push(`品质=${quality}`);
  if (category !== '未知') segments.push(`类别=${category}`);
  if (!segments.length) return AI_TODO_SOUL_SPIRIT_DESC;
  return `待补全（请结合${segments.join('；')}补全魂灵外形、血脉特征、行动风格与能力倾向，避免空泛套话）`;
}

function syncSoulSpiritRuntimeData(武魂 = {}) {
  if (!武魂 || typeof 武魂 !== 'object') return 武魂;
  const currentQualityText = String(武魂?.品质 || '').trim();
  const explicitQuality = normalizeSoulSpiritQuality(currentQualityText);
  武魂.品质 = explicitQuality || currentQualityText || AI_TODO_SOUL_SPIRIT_QUALITY;

  const currentDesc = String(武魂.描述 || '').trim();
  if (!currentDesc || currentDesc === '无' || isAiTodoText(currentDesc) || currentDesc.startsWith('待补全')) {
    武魂.描述 = buildSoulSpiritDescriptionTodoText({
      ...武魂,
      品质: explicitQuality || inferSoulSpiritQuality(武魂) || 武魂.品质,
    });
  }

  const visibleSpecies =
    !isAiTodoText(武魂.表象名称) && String(武魂.表象名称 || '').trim() && 武魂.表象名称 !== '未展露'
      ? String(武魂.表象名称).trim()
      : '未知';
  const hasReadyDescription =
    currentDesc &&
    currentDesc !== '无' &&
    !isAiTodoText(currentDesc) &&
    !currentDesc.startsWith('待补全');
  const shouldExposePowerPanel = Number(武魂.年限 || 0) > 0 && visibleSpecies !== '未知' && !!explicitQuality && hasReadyDescription;
  if (!shouldExposePowerPanel) {
    delete 武魂.战力面板;
    return 武魂;
  }

  if (!武魂.战力面板 || typeof 武魂.战力面板 !== 'object') {
    武魂.战力面板 = createEmptySoulSpiritPowerPanel();
  }
  const stats = getBeastStats(武魂.年限, visibleSpecies, explicitQuality);
  武魂.战力面板.对标等级 = Number(stats.对标等级 || 0);
  武魂.战力面板.str = Number(stats.str || 0);
  武魂.战力面板.def = Number(stats.def || 0);
  武魂.战力面板.agi = Number(stats.agi || 0);
  武魂.战力面板.vit_max = Number(stats.vit_max || 0);
  武魂.战力面板.men_max = Number(stats.men_max || 0);
  武魂.战力面板.sp_max = Number(stats.sp_max || 0);
  return 武魂;
}

const SILVER_DRAGON_NINE_ELEMENTS = ['水', '火', '风', '土', '光', '暗', '空间', '创造', '毁灭'];
const WUXING_ELEMENT_SEQUENCE = ['金', '木', '水', '火', '土'];
const BASIC_SKILL_ATTRIBUTE_SEQUENCE = Object.freeze(['金', '木', '水', '火', '土', '风', '雷', '冰']);
const ADVANCED_SKILL_ATTRIBUTE_SEQUENCE = Object.freeze(['光', '暗', '精神']);
const SUPREME_SKILL_ATTRIBUTE_SEQUENCE = Object.freeze(['空间', '时间']);
const ARCANA_SKILL_ATTRIBUTE_SEQUENCE = Object.freeze(['创造', '毁灭']);
const ELEMENT_ATTRIBUTE_SEQUENCE = Object.freeze([
  ...BASIC_SKILL_ATTRIBUTE_SEQUENCE,
  ...ADVANCED_SKILL_ATTRIBUTE_SEQUENCE,
  ...SUPREME_SKILL_ATTRIBUTE_SEQUENCE,
  ...ARCANA_SKILL_ATTRIBUTE_SEQUENCE,
]);
const SKILL_ATTRIBUTE_SEQUENCE = Object.freeze([...ELEMENT_ATTRIBUTE_SEQUENCE, '五行']);
const SUPPORTED_ELEMENT_TOKENS = Object.freeze([...ELEMENT_ATTRIBUTE_SEQUENCE]);

function createSpiritElementProfile(seed = {}) {
  const rawElements = Array.isArray(seed?.elements) ? seed.elements : [];
  const elements = Array.from(new Set(rawElements.map(item => String(item || '').trim()).filter(Boolean)));
  const rawMastery = Number(seed?.mastery || 0);
  const system = String(seed?.system || (elements.length ? '元素' : '无属性'));
  const rawControlTier = Number(seed?.controlTier ?? (system === '元素' ? elements.length : 0));
  const rawWuxingTier = Number(
    seed?.wuxingTier ??
      (system === '五行' ? elements.filter(item => WUXING_ELEMENT_SEQUENCE.includes(item)).length : 0),
  );
  const controlTier = Math.max(0, Math.min(9, Number.isFinite(rawControlTier) ? Math.round(rawControlTier) : 0));
  const wuxingTier = Math.max(0, Math.min(5, Number.isFinite(rawWuxingTier) ? Math.round(rawWuxingTier) : 0));
  const derivedMode =
    system === '五行'
      ? wuxingTier >= 5
        ? '五行轮转'
        : wuxingTier === 4
          ? '四行压场'
          : wuxingTier === 3
            ? '三行扩链'
            : wuxingTier === 2
              ? '二行成链'
              : wuxingTier === 1
                ? '一行调用'
                : '无属性'
      : system === '元素'
        ? controlTier >= 9
          ? '九元素掌控'
          : controlTier >= 7
            ? '七元素掌控'
            : controlTier === 5
              ? '五元素掌控'
              : controlTier === 4
                ? '四元素掌控'
                : controlTier === 3
                  ? '三元素掌控'
                  : controlTier === 2
                    ? '双元素掌控'
                    : controlTier === 1
                      ? '单元素'
                      : '无属性'
        : '无属性';
  return {
    system,
    mode: String(seed?.mode || derivedMode),
    elements,
    controlTier,
    wuxingTier,
    polarityUnlocked: !!seed?.polarityUnlocked,
    polarityMode: String(seed?.polarityMode || '无'),
    mastery: Math.max(0, Math.min(100, Number.isFinite(rawMastery) ? rawMastery : 0)),
  };
}

function normalizeElementToken(token = '') {
  const text = String(token || '').trim();
  if (!text) return '';
  const aliasMap = {
    光明: '光',
    黑暗: '暗',
    创世: '创造',
    灭世: '毁灭',
    大地: '土',
    寒冰: '冰',
    冰霜: '冰',
  };
  const normalized = aliasMap[text] || text;
  return SUPPORTED_ELEMENT_TOKENS.includes(normalized) ? normalized : '';
}

function sortAttributeTokensBySequence(tokens = [], sequence = []) {
  const orderMap = new Map((Array.isArray(sequence) ? sequence : []).map((token, index) => [token, index]));
  return [...(Array.isArray(tokens) ? tokens : [])].sort((left, right) => {
    const leftOrder = orderMap.has(left) ? orderMap.get(left) : Number.MAX_SAFE_INTEGER;
    const rightOrder = orderMap.has(right) ? orderMap.get(right) : Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return String(left).localeCompare(String(right), 'zh-Hans-CN');
  });
}

function normalizeSkillAttributeToken(token = '') {
  const text = String(token || '').trim();
  if (!text) return '';
  if (text === '五行') return '五行';
  return normalizeElementToken(text);
}

function tokenizeElementText(raw = '') {
  const text = String(raw || '').trim();
  if (!text || text === '无' || isAiTodoText(text)) return [];
  if (/九大?元素|九元素/.test(text)) return [...SILVER_DRAGON_NINE_ELEMENTS];
  if (/五行/.test(text)) return [...WUXING_ELEMENT_SEQUENCE];
  const expanded = text
    .replace(/[、,，|｜+＋]/g, '/')
    .replace(/多元素混合|多元素掌控/g, '')
    .replace(/\s+/g, '/');
  return Array.from(new Set(expanded.split('/').map(normalizeElementToken).filter(Boolean)));
}

function normalizeAttributeTokenArray(value) {
  const rawList = Array.isArray(value) ? value : tokenizeElementText(value);
  return sortAttributeTokensBySequence(
    Array.from(new Set((Array.isArray(rawList) ? rawList : []).map(normalizeElementToken).filter(Boolean))),
    ELEMENT_ATTRIBUTE_SEQUENCE,
  );
}

function normalizeSkillAttachedAttributeArray(value = []) {
  const rawList = Array.isArray(value) ? value : [];
  return sortAttributeTokensBySequence(
    Array.from(new Set(rawList.map(normalizeSkillAttributeToken).filter(Boolean))),
    SKILL_ATTRIBUTE_SEQUENCE,
  );
}

function normalizeSkillStringArray(value = []) {
  const rawList = Array.isArray(value) ? value : [];
  return Array.from(new Set(rawList.map(item => String(item || '').trim()).filter(Boolean)));
}

function normalizeSpiritAttributeState(spiritData = {}, spiritName = '', ownerChar = {}) {
  void spiritName;
  void ownerChar;
  const rawSystem = String(spiritData?.属性体系 || '').trim();
  const explicitSystem = isAiTodoText(rawSystem) ? '' : rawSystem;
  const rawCapacity = spiritData?.可容纳属性;
  const explicitUnlocked = normalizeAttributeTokenArray(spiritData?.已解锁属性);
  const explicitCapacity = normalizeAttributeTokenArray(rawCapacity);
  if (explicitSystem || explicitUnlocked.length || explicitCapacity.length) {
    const system = ['元素', '五行'].includes(explicitSystem) ? explicitSystem : '无';
    const unlocked = explicitUnlocked;
    let capacity = explicitCapacity;
    if (!capacity.length) {
      if (system === '五行') capacity = [...WUXING_ELEMENT_SEQUENCE];
      else if (unlocked.length) capacity = [...unlocked];
      else if (system === '无' && rawSystem === '无') capacity = ['无'];
      else capacity = [AI_TODO_ATTRIBUTE_CAPACITY];
    }
    return { 属性体系: system, 已解锁属性: unlocked, 可容纳属性: capacity };
  }
  return { 属性体系: AI_TODO_ATTRIBUTE_SYSTEM, 已解锁属性: [], 可容纳属性: [AI_TODO_ATTRIBUTE_CAPACITY] };
}

function shouldKeepExtendedBloodlineData(charName = '', charData = null) {
  const explicitName = String(
    charName
      || charData?.name
      || charData?.属性?.name
      || charData?.base?.name
      || '',
  ).trim();
  return explicitName === '唐舞麟';
}

function pruneExtendedBloodlineData(charData = null, charName = '') {
  if (!charData || typeof charData !== 'object') return;
  if (shouldKeepExtendedBloodlineData(charName, charData)) return;
  const bloodline = charData.血脉之力;
  if (!bloodline || typeof bloodline !== 'object') return;
  delete bloodline.解封层数;
  delete bloodline.核心;
  delete bloodline.技能;
  delete bloodline.被动;
  delete bloodline.永久加成;
  delete bloodline.气血魂环;
}

const LIFE_FIRE_STATE_CACHE = Object.create(null);
const COMBAT_DEATH_STATE_CACHE = Object.create(null);

function buildElementProfileFromAttributeState(attributeState = {}, existingProfile = {}) {
  const rawSystem = String(attributeState?.属性体系 || '无').trim();
  const system = ['元素', '五行'].includes(rawSystem) ? rawSystem : '无';
  const unlocked = normalizeAttributeTokenArray(attributeState?.已解锁属性);
  const capacity = normalizeAttributeTokenArray(attributeState?.可容纳属性);
  const profileElements = unlocked;
  const controlTier = system === '元素' ? profileElements.length : 0;
  const wuxingTier =
    system === '五行' ? profileElements.filter(attr => WUXING_ELEMENT_SEQUENCE.includes(attr)).length : 0;
  return createSpiritElementProfile({
    system: system === '无' ? '无属性' : system,
    elements: profileElements,
    controlTier,
    wuxingTier,
    polarityUnlocked: !!existingProfile?.polarityUnlocked,
    polarityMode: String(existingProfile?.polarityMode || '无'),
    mastery: Number(existingProfile?.mastery || 0),
  });
}

function mergeSpiritAttributeStates(attributeStates = []) {
  const states = (Array.isArray(attributeStates) ? attributeStates : []).filter(state => state && typeof state === 'object');
  const unlocked = normalizeAttributeTokenArray(states.flatMap(state => state.已解锁属性 || []));
  const capacity = normalizeAttributeTokenArray(states.flatMap(state => state.可容纳属性 || []));
  const hasWuxingSystem =
    states.some(state => String(state.属性体系 || '').trim() === '五行') ||
    unlocked.some(attr => WUXING_ELEMENT_SEQUENCE.includes(attr)) ||
    capacity.some(attr => WUXING_ELEMENT_SEQUENCE.includes(attr));
  const hasElementSystem =
    states.some(state => ['元素', '五行'].includes(String(state.属性体系 || '').trim())) ||
    unlocked.length > 0 ||
    capacity.length > 0;
  return {
    属性体系: hasWuxingSystem ? '五行' : hasElementSystem ? '元素' : '无',
    已解锁属性: unlocked,
    可容纳属性: capacity.length ? capacity : [...unlocked],
  };
}

function safeEntries(obj) {
  return obj && typeof obj === 'object' ? Object.entries(obj) : [];
}

function buildCharacterCustomSkillAttributeState(char = {}) {
  const spiritStates = safeEntries(char?.武魂 || {}).map(([spiritKey, spiritData]) =>
    normalizeSpiritAttributeState(spiritData, spiritKey, char),
  );
  const 基础属性状态 = mergeSpiritAttributeStates(spiritStates);
  const 技能附带属性集合 = [];
  const 追加技能图谱附带属性 = 技能图谱 => {
    技能附带属性集合.push(...collectSkillMapAttachedAttributes(技能图谱));
  };
  safeEntries(char?.武魂 || {}).forEach(([, spiritData]) => {
    safeEntries(spiritData?.魂灵 || {}).forEach(([, soulData]) => {
      safeEntries(soulData?.魂环 || {}).forEach(([, ringData]) => {
        追加技能图谱附带属性(ringData?.魂技);
      });
    });
    safeEntries(spiritData?.独立魂环 || {}).forEach(([, ringData]) => {
      追加技能图谱附带属性(ringData?.魂技);
    });
  });
  safeEntries(char?.魂骨 || {}).forEach(([, boneData]) => {
    追加技能图谱附带属性(boneData?.附带技能);
  });
  追加技能图谱附带属性(char?.血脉之力?.技能);
  追加技能图谱附带属性(char?.血脉之力?.被动);
  追加技能图谱附带属性(char?.自创魂技);

  const 技能来源属性列表 = normalizeAttributeTokenArray(技能附带属性集合);
  if (!技能来源属性列表.length) return 基础属性状态;

  const 技能来源属性状态 = {
    属性体系: 技能来源属性列表.some(属性 => WUXING_ELEMENT_SEQUENCE.includes(属性)) ? '五行' : '元素',
    已解锁属性: 技能来源属性列表,
    可容纳属性: 技能来源属性列表,
  };
  return mergeSpiritAttributeStates([基础属性状态, 技能来源属性状态]);
}

function getCombatParticipantName(participant = null) {
  return String(participant?.name || '').trim();
}

function collectBattleSideNames(battleData = {}, sideKey = 'enemy') {
  const participants = battleData?.参战者 && typeof battleData.参战者 === 'object' ? battleData.参战者 : {};
  const result = [];
  const mainParticipant = participants[sideKey];
  const mainName = getCombatParticipantName(mainParticipant);
  if (mainName) result.push(mainName);
  const teamKey = sideKey === 'player' ? 'team_player' : sideKey === 'enemy' ? 'team_enemy' : '';
  const team = teamKey ? participants[teamKey] : null;
  if (Array.isArray(team)) {
    team.forEach(member => {
      const name = getCombatParticipantName(member);
      if (name) result.push(name);
    });
  }
  return result;
}

function pickUniqueWeightedRandom(entries = [], count = 1) {
  const pool = (Array.isArray(entries) ? entries : [])
    .map(entry => ({
      value: entry?.value,
      weight: Math.max(0, Number(entry?.weight || 0)),
    }))
    .filter(entry => entry.value && entry.weight > 0);
  const result = [];
  while (pool.length > 0 && result.length < count) {
    const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0);
    if (!(totalWeight > 0)) break;
    let roll = Math.random() * totalWeight;
    let pickedIndex = 0;
    for (let index = 0; index < pool.length; index += 1) {
      roll -= pool[index].weight;
      if (roll <= 0) {
        pickedIndex = index;
        break;
      }
    }
    result.push(pool[pickedIndex].value);
    pool.splice(pickedIndex, 1);
  }
  return result;
}

function buildSecondaryWeightedPool(main = '', type = '强攻系', preferredSecondary = []) {
  const mainSet = new Set(SKILL_SECONDARY_BY_MAIN_V1[main] || []);
  const typePotentialSet = new Set(getPotentialSecondaryOptionsByType(type));
  const typeBiasSet = new Set(SKILL_SECONDARY_TYPE_BIAS_V1[type] || []);
  const preferredSet = new Set(
    (Array.isArray(preferredSecondary) ? preferredSecondary : [])
      .map(item => String(item || '').trim())
      .filter(item => SOUL_SPIRIT_SECONDARY_OPTIONS_V1.includes(item)),
  );
  return SOUL_SPIRIT_SECONDARY_OPTIONS_V1.map(option => {
    let weight = 1;
    if (mainSet.has(option)) weight += 7;
    if (typePotentialSet.has(option)) weight += 2;
    if (typeBiasSet.has(option)) weight += 4;
    if (preferredSet.has(option)) weight += 10;
    return { value: option, weight };
  }).filter(entry => entry.weight > 0);
}

function getBattleRewardRecipientName(data = {}, defeatedName = '') {
  const targetName = String(defeatedName || '').trim();
  if (!targetName) return '';
  const battleData = data?.world?.战斗 && typeof data.world.战斗 === 'object' ? data.world.战斗 : null;
  if (!battleData) return '';
  const enemyNames = collectBattleSideNames(battleData, 'enemy');
  if (!enemyNames.includes(targetName)) return '';
  const playerNames = collectBattleSideNames(battleData, 'player');
  return playerNames[0] || '';
}

function getCombatSpeciesFlags(char = {}) {
  const social = char?.社交 && typeof char.社交 === 'object' ? char.社交 : {};
  const factionMap = social?.势力 && typeof social.势力 === 'object' ? social.势力 : {};
  const factionNames = Object.keys(factionMap);
  const age = Math.max(0, Math.floor(Number(char?.属性?.年龄 || 0)));
  const isBeast =
    factionNames.includes('魂兽一族') ||
    factionNames.some(name => String(name || '').includes('魂兽')) ||
    age >= 100;
  const isAbyss =
    factionNames.includes('深渊生物') ||
    factionNames.some(name => String(name || '').includes('深渊'));
  return { isBeast, isAbyss, age };
}

function settleInternalAbyssKillReward(data = {}, winner = {}, winnerName = '', defeated = {}, defeatedName = '') {
  const level = String(defeated?.级别 || defeated?.属性?.级别 || '').trim();
  let pts = 0;
  if (level === '低阶生物') pts = 10;
  else if (level === '中阶生物') pts = 100;
  else if (level === '高阶生物') pts = 1000;
  else if (level === '深渊王者') pts = 50000;
  if (pts <= 0) {
    追加系统播报文本(data, `[深渊战功] ${winnerName} 击杀【${defeatedName}】未识别级别，未获战功，军方评价不变。`);
    return;
  }
  if (!winner.财富 || typeof winner.财富 !== 'object') winner.财富 = {};
  winner.财富.战功 = Math.max(0, Number(winner.财富.战功 || 0) + pts);
  追加系统播报文本(data, `[深渊战功] ${winnerName} 击杀【${defeatedName}】，获得 ${pts} 点战功，军方记录已更新。`);
}

function getDeviationMultiplierValue(data = {}) {
  const raw = Number(data?.world?.偏差倍率 ?? 1);
  return Number.isFinite(raw) && raw >= 0 ? raw : 1;
}

function scaleDeviationDeltaValue(data = {}, rawDelta = 0) {
  const safeDelta = Number(rawDelta ?? 0);
  if (!Number.isFinite(safeDelta) || safeDelta === 0) return 0;
  return Number((safeDelta * getDeviationMultiplierValue(data)).toFixed(4));
}

function applyDeviationDeltaValue(data = {}, rawDelta = 0) {
  const scaledDelta = scaleDeviationDeltaValue(data, rawDelta);
  if (!data.world || typeof data.world !== 'object') data.world = {};
  const baseValue = Number(data.world.偏差值 || 0);
  const nextValue = (Number.isFinite(baseValue) ? baseValue : 0) + scaledDelta;
  data.world.偏差值 = Math.max(0, Number(nextValue.toFixed(4)));
  return scaledDelta;
}

function settleInternalSoulBeastReward(data = {}, winner = {}, winnerName = '', defeated = {}, defeatedName = '') {
  const age = Math.max(0, Math.floor(Number(defeated?.属性?.年龄 || defeated?.年限 || 0)));
  if (age <= 0) {
    追加系统播报文本(data, `[现实狩猎] ${winnerName} 击败了【${defeatedName}】，但未识别有效年限，背包无新增。`);
    return;
  }
  if (!winner.背包 || typeof winner.背包 !== 'object') winner.背包 = {};

  const ringName = `${age}年魂环`;
  if (!winner.背包[ringName]) {
    winner.背包[ringName] = { 数量: 0, 类型: '魂环', 品质: '标准', 描述: '未吸收的无主魂环' };
  }
  winner.背包[ringName].数量 = Math.max(0, Number(winner.背包[ringName].数量 || 0) + 1);
  let msg = `[现实狩猎] ${winnerName} 击杀了【${defeatedName}】，获得【${ringName}】，背包已入账。`;

  const dropRate = age >= 100000 ? 100 : (age / 100000) * 100;
  const roll = Math.floor(Math.random() * 100) + 1;
  data.sys.最近检定 = roll;
  if (roll <= dropRate) {
    const boneName = `${age}年魂骨`;
    if (!winner.背包[boneName]) {
      winner.背包[boneName] = {
        数量: 0,
        类型: '魂骨',
        品质: age >= 100000 ? '极品' : '常规',
        描述: '未吸收的无主魂骨',
      };
    }
    winner.背包[boneName].数量 = Math.max(0, Number(winner.背包[boneName].数量 || 0) + 1);
    msg += `【好运爆发】成功剥离出【${boneName}】！(Roll: ${roll} <= ${dropRate}%)`;
  }

  if (winner.状态?.位置 && String(winner.状态.位置).includes('星斗大森林')) {
    data.world.累计击杀年限 = Math.max(0, Number(data.world.累计击杀年限 || 0) + age);
    if (data.world.累计击杀年限 >= 1000000 && !data.world.兽潮已触发) {
      msg += `\n🚨 [大区警报] 星斗大森林魂兽死伤惨重(累计超100万年)，血腥气彻底引爆凶兽怒火！【兽潮】开始集结！`;
      data.world.兽潮已触发 = true;
    }
  }

  if (age >= 100000) {
    if (!winner.属性.状态效果 || typeof winner.属性.状态效果 !== 'object') winner.属性.状态效果 = {};
    winner.属性.状态效果['魂兽公敌'] = {
      类型: 'debuff',
      层数: 1,
      描述: '击杀顶级魂兽染上的极致怨气，野外魂兽仇恨锁定',
    };
    msg += `\n💀 [命运烙印] 击杀十万年/凶兽！烙上【魂兽公敌】印记！`;
  }

  追加系统播报文本(data, msg);
}

function normalizeSkillAttributeCoefficients(value = {}) {
  const fallback = { 掌控: 1, 威力: 1, 消耗: 1, 前摇: 1, 控制: 1, 速度: 1 };
  const normalized = { ...fallback };
  Object.keys(fallback).forEach(key => {
    const raw = Number(value?.[key] ?? fallback[key]);
    normalized[key] = Number.isFinite(raw) && raw > 0 ? raw : fallback[key];
  });
  return normalized;
}

const ATTRIBUTE_COEFF_MAP = Object.freeze({
  金: Object.freeze({ 掌控: 1.04, 威力: 1.1, 消耗: 1.0, 前摇: 0.98, 控制: 0.98, 速度: 1.03 }),
  木: Object.freeze({ 掌控: 1.1, 威力: 0.97, 消耗: 0.95, 前摇: 0.99, 控制: 1.08, 速度: 1.01 }),
  水: Object.freeze({ 掌控: 1.08, 威力: 0.99, 消耗: 0.94, 前摇: 0.99, 控制: 1.06, 速度: 1.01 }),
  火: Object.freeze({ 掌控: 0.96, 威力: 1.18, 消耗: 1.08, 前摇: 0.99, 控制: 0.94, 速度: 1.04 }),
  土: Object.freeze({ 掌控: 1.02, 威力: 1.08, 消耗: 1.01, 前摇: 1.05, 控制: 1.05, 速度: 0.94 }),
  风: Object.freeze({ 掌控: 1.02, 威力: 1.04, 消耗: 0.95, 前摇: 0.92, 控制: 0.99, 速度: 1.15 }),
  雷: Object.freeze({ 掌控: 1.01, 威力: 1.15, 消耗: 1.05, 前摇: 0.91, 控制: 0.99, 速度: 1.16 }),
  冰: Object.freeze({ 掌控: 1.08, 威力: 1.05, 消耗: 1.01, 前摇: 1.03, 控制: 1.15, 速度: 0.94 }),
  光: Object.freeze({ 掌控: 1.1, 威力: 1.08, 消耗: 1.0, 前摇: 0.96, 控制: 1.08, 速度: 1.03 }),
  暗: Object.freeze({ 掌控: 1.08, 威力: 1.14, 消耗: 1.05, 前摇: 0.97, 控制: 1.12, 速度: 1.02 }),
  精神: Object.freeze({ 掌控: 1.18, 威力: 1.04, 消耗: 1.07, 前摇: 0.95, 控制: 1.22, 速度: 1.05 }),
  空间: Object.freeze({ 掌控: 1.22, 威力: 1.06, 消耗: 1.14, 前摇: 0.93, 控制: 1.18, 速度: 1.08 }),
  时间: Object.freeze({ 掌控: 1.24, 威力: 1.08, 消耗: 1.18, 前摇: 0.9, 控制: 1.25, 速度: 1.12 }),
  创造: Object.freeze({ 掌控: 1.28, 威力: 1.18, 消耗: 1.16, 前摇: 0.98, 控制: 1.2, 速度: 1.03 }),
  毁灭: Object.freeze({ 掌控: 1.16, 威力: 1.32, 消耗: 1.2, 前摇: 1.05, 控制: 1.16, 速度: 0.96 }),
  五行: Object.freeze({ 掌控: 1.2, 威力: 1.16, 消耗: 0.92, 前摇: 0.95, 控制: 1.12, 速度: 1.04 }),
});

const SKILL_ATTRIBUTE_DIM_KEYS = Object.freeze(['掌控', '威力', '消耗', '前摇', '控制', '速度']);
const SKILL_ATTRIBUTE_SOURCE_VALUES = Object.freeze(['无', '自身操控', '魂技调用']);
const SKILL_ATTRIBUTE_ROLE_VALUES = Object.freeze(['无', '增幅器', '结构术式']);
const WUXING_TEN_STEM_TO_ELEMENT = Object.freeze({
  甲: '木',
  乙: '木',
  丙: '火',
  丁: '火',
  戊: '土',
  己: '土',
  庚: '金',
  辛: '金',
  壬: '水',
  癸: '水',
});
const ELEMENT_STRUCTURE_ROLE_COEFF_MAP = Object.freeze({
  核心元素: Object.freeze({ 掌控: 1.02, 威力: 1.08, 消耗: 1.03, 前摇: 1.01, 控制: 1.01, 速度: 1.0 }),
  驱动元素: Object.freeze({ 掌控: 1.08, 威力: 1.01, 消耗: 0.98, 前摇: 0.94, 控制: 1.0, 速度: 1.08 }),
  约束元素: Object.freeze({ 掌控: 1.06, 威力: 1.02, 消耗: 0.97, 前摇: 1.0, 控制: 1.08, 速度: 0.96 }),
  触发元素: Object.freeze({ 掌控: 0.99, 威力: 1.1, 消耗: 1.02, 前摇: 0.95, 控制: 1.04, 速度: 1.04 }),
});
const ELEMENT_STRUCTURE_MODE_COEFF_MAP = Object.freeze({
  元素硬控: Object.freeze({ 掌控: 1.06, 威力: 1.05, 消耗: 1.04, 前摇: 1.02, 控制: 1.05, 速度: 1.02 }),
  单元素掌控: Object.freeze({ 掌控: 1.03, 威力: 1.03, 消耗: 0.98, 前摇: 0.97, 控制: 1.02, 速度: 1.01 }),
});
const SKILL_ROLE_COEFF_MAP = Object.freeze({
  增幅器: Object.freeze({ 掌控: 1.03, 威力: 1.06, 消耗: 0.96, 前摇: 0.97, 控制: 1.02, 速度: 1.02 }),
  结构术式: Object.freeze({ 掌控: 1.06, 威力: 1.02, 消耗: 0.97, 前摇: 0.99, 控制: 1.05, 速度: 1.0 }),
});
const WUXING_INVOCATION_MODE_COEFF_MAP = Object.freeze({
  一行调用: Object.freeze({ 掌控: 1.02, 威力: 1.01, 消耗: 0.99, 前摇: 0.99, 控制: 1.01, 速度: 1.0 }),
  二行成链: Object.freeze({ 掌控: 1.05, 威力: 1.04, 消耗: 0.97, 前摇: 0.98, 控制: 1.03, 速度: 1.0 }),
  三行扩链: Object.freeze({ 掌控: 1.08, 威力: 1.07, 消耗: 0.95, 前摇: 0.97, 控制: 1.06, 速度: 1.0 }),
  四行压场: Object.freeze({ 掌控: 1.12, 威力: 1.11, 消耗: 0.93, 前摇: 0.96, 控制: 1.1, 速度: 1.01 }),
  五行轮转: Object.freeze({ 掌控: 1.18, 威力: 1.18, 消耗: 0.9, 前摇: 0.94, 控制: 1.14, 速度: 1.02 }),
  相生循环: Object.freeze({ 掌控: 1.2, 威力: 1.2, 消耗: 0.89, 前摇: 0.93, 控制: 1.15, 速度: 1.02 }),
  逆演归一: Object.freeze({ 掌控: 1.1, 威力: 1.12, 消耗: 1.08, 前摇: 1.05, 控制: 1.08, 速度: 0.98 }),
  阴阳合璧: Object.freeze({ 掌控: 1.12, 威力: 1.15, 消耗: 1.1, 前摇: 1.06, 控制: 1.1, 速度: 1.0 }),
});
const WUXING_RELATION_COEFF_MAP = Object.freeze({
  二链: Object.freeze({ 掌控: 1.03, 威力: 1.02, 消耗: 0.99, 前摇: 0.99, 控制: 1.02, 速度: 1.0 }),
  三链: Object.freeze({ 掌控: 1.05, 威力: 1.04, 消耗: 0.98, 前摇: 0.98, 控制: 1.04, 速度: 1.0 }),
  四链: Object.freeze({ 掌控: 1.08, 威力: 1.07, 消耗: 0.96, 前摇: 0.97, 控制: 1.07, 速度: 1.0 }),
  闭环: Object.freeze({ 掌控: 1.08, 威力: 1.03, 消耗: 0.94, 前摇: 0.96, 控制: 1.04, 速度: 0.99 }),
  回溯: Object.freeze({ 掌控: 1.06, 威力: 1.06, 消耗: 1.04, 前摇: 1.03, 控制: 1.06, 速度: 0.99 }),
});
const POLARITY_MODE_COEFF_MAP = Object.freeze({
  阴阳归一: Object.freeze({ 掌控: 1.08, 威力: 1.1, 消耗: 1.06, 前摇: 1.03, 控制: 1.08, 速度: 1.0 }),
  阴阳对冲: Object.freeze({ 掌控: 1.04, 威力: 1.12, 消耗: 1.08, 前摇: 1.02, 控制: 1.05, 速度: 1.02 }),
});

function multiplySkillAttributeCoefficientProfiles(list = []) {
  const profiles = (Array.isArray(list) ? list : []).map(profile => normalizeSkillAttributeCoefficients(profile || {}));
  if (!profiles.length) return normalizeSkillAttributeCoefficients();
  const multiplied = {};
  SKILL_ATTRIBUTE_DIM_KEYS.forEach(key => {
    multiplied[key] = profiles.reduce((product, profile) => product * Number(profile?.[key] ?? 1), 1);
  });
  return normalizeSkillAttributeCoefficients(multiplied);
}

function normalizeSkillAttributeSource(value = '', fallback = '无') {
  const text = String(value || '').trim();
  return SKILL_ATTRIBUTE_SOURCE_VALUES.includes(text) ? text : fallback;
}

function normalizeSkillRoleType(value = '', fallback = '无') {
  const text = String(value || '').trim();
  return SKILL_ATTRIBUTE_ROLE_VALUES.includes(text) ? text : fallback;
}

function normalizeSkillElementStructure(value = {}) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return {
    模式: String(source?.模式 || '无').trim() || '无',
    核心元素: normalizeSkillAttachedAttributeArray(source?.核心元素),
    驱动元素: normalizeSkillAttachedAttributeArray(source?.驱动元素),
    约束元素: normalizeSkillAttachedAttributeArray(source?.约束元素),
    触发元素: normalizeSkillAttachedAttributeArray(source?.触发元素),
    关系: Array.isArray(source?.关系) ? JSON.parse(JSON.stringify(source.关系)) : [],
  };
}

function hasSkillElementStructure(structure = {}) {
  const normalized = normalizeSkillElementStructure(structure);
  return (
    normalized.模式 !== '无' ||
    normalized.核心元素.length > 0 ||
    normalized.驱动元素.length > 0 ||
    normalized.约束元素.length > 0 ||
    normalized.触发元素.length > 0 ||
    normalized.关系.length > 0
  );
}

function collectSkillElementStructureAttributes(structure = {}) {
  const normalized = normalizeSkillElementStructure(structure);
  return Array.from(
    new Set([...normalized.核心元素, ...normalized.驱动元素, ...normalized.约束元素, ...normalized.触发元素]),
  );
}

function normalizeSkillWuxingInvocation(value = {}) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return {
    模式: String(source?.模式 || '无').trim() || '无',
    调用链: normalizeSkillStringArray(source?.调用链),
    回路闭合: !!source?.回路闭合,
    层级回溯: normalizeSkillStringArray(source?.层级回溯),
    终态: String(source?.终态 || '无').trim() || '无',
    结果: String(source?.结果 || '无').trim() || '无',
  };
}

function hasSkillWuxingInvocation(invocation = {}) {
  const normalized = normalizeSkillWuxingInvocation(invocation);
  return (
    normalized.模式 !== '无' ||
    normalized.调用链.length > 0 ||
    normalized.回路闭合 ||
    normalized.层级回溯.length > 0 ||
    normalized.终态 !== '无' ||
    normalized.结果 !== '无'
  );
}

function mapWuxingInvocationTokenToElement(token = '') {
  const text = String(token || '').trim();
  return WUXING_TEN_STEM_TO_ELEMENT[text] || normalizeElementToken(text);
}

function normalizeOrderedWuxingInvocationElements(list = []) {
  const source = Array.isArray(list) ? list : [];
  const ordered = [];
  const seen = new Set();
  source.forEach(token => {
    const attr = mapWuxingInvocationTokenToElement(token);
    if (!WUXING_ELEMENT_SEQUENCE.includes(attr) || seen.has(attr)) return;
    seen.add(attr);
    ordered.push(attr);
  });
  return ordered;
}

function resolveHighestLegalWuxingChain(list = []) {
  const ordered = normalizeOrderedWuxingInvocationElements(list);
  if (!ordered.length) return [];
  const available = new Set(ordered);
  const sequence = [...WUXING_ELEMENT_SEQUENCE, ...WUXING_ELEMENT_SEQUENCE];
  let best = [ordered[0]];
  for (let start = 0; start < WUXING_ELEMENT_SEQUENCE.length; start++) {
    const first = sequence[start];
    if (!available.has(first)) continue;
    const chain = [first];
    for (let step = 1; step < WUXING_ELEMENT_SEQUENCE.length; step++) {
      const next = sequence[start + step];
      if (!available.has(next) || chain.includes(next)) break;
      chain.push(next);
    }
    if (chain.length > best.length) best = chain;
  }
  return best;
}

function extractWuxingInvocationElements(invocation = {}) {
  const normalized = normalizeSkillWuxingInvocation(invocation);
  return resolveHighestLegalWuxingChain(normalized.调用链);
}

function normalizeSkillPolarityInfo(value = {}, fallback = {}) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const fallbackMode = String(fallback?.polarityMode || fallback?.polarity || '无').trim() || '无';
  const fallbackUnlocked = !!(fallback?.polarityUnlocked || (fallbackMode && fallbackMode !== '无'));
  const normalizedMode = String(source?.polarityMode || source?.polarity || fallbackMode || '无').trim() || '无';
  return {
    polarityUnlocked: !!(source?.polarityUnlocked ?? fallbackUnlocked),
    polarityMode: normalizedMode,
  };
}

function hasSkillPolarityInfo(info = {}) {
  const normalized = normalizeSkillPolarityInfo(info);
  return normalized.polarityUnlocked || normalized.polarityMode !== '无';
}

function isNeutralSkillAttributeCoefficientProfile(coeff = {}) {
  const normalized = normalizeSkillAttributeCoefficients(coeff);
  return SKILL_ATTRIBUTE_DIM_KEYS.every(key => Math.abs(Number(normalized?.[key] ?? 1) - 1) < 0.0001);
}

function getStoredSkillSystemBase(skill = {}) {
  return (Array.isArray(skill?._效果数组) ? skill._效果数组 : []).find(effect => String(effect?.机制 || '').trim() === '系统基础') || {};
}

function getStoredSkillSystemBaseParam(skill = {}, key = '') {
  const systemBase = getStoredSkillSystemBase(skill);
  const params = systemBase?.参数;
  if (!params || typeof params !== 'object' || Array.isArray(params)) return undefined;
  return params[key];
}

function getStoredSkillElementStructure(skill = {}) {
  return normalizeSkillElementStructure(getStoredSkillSystemBaseParam(skill, '元素构型') || {});
}

function getStoredSkillWuxingInvocation(skill = {}) {
  return normalizeSkillWuxingInvocation(getStoredSkillSystemBaseParam(skill, '五行调用结构') || {});
}

function getStoredSkillPolarityInfo(skill = {}) {
  return normalizeSkillPolarityInfo(getStoredSkillSystemBaseParam(skill, '极性信息') || {});
}

function getStoredSkillAttributeCoefficients(skill = {}) {
  return normalizeSkillAttributeCoefficients(getStoredSkillSystemBaseParam(skill, '属性系数') || {});
}

function getStoredSkillDisplayElement(skill = {}) {
  return String(getStoredSkillSystemBaseParam(skill, '显示元素') || '').trim();
}

function formatSkillAttributeCoefficientSummaryText(coeff = {}) {
  const normalized = normalizeSkillAttributeCoefficients(coeff);
  const segments = SKILL_ATTRIBUTE_DIM_KEYS.map(key => {
    const value = Number(normalized?.[key] ?? 1);
    if (!Number.isFinite(value) || Math.abs(value - 1) < 0.001) return '';
    return `${key}×${formatSkillNumber(value, 2)}`;
  }).filter(Boolean);
  return segments.length ? `属性系数：${segments.join('，')}` : '';
}

function buildSkillElementStructureSummaryText(structure = {}) {
  const normalized = normalizeSkillElementStructure(structure);
  const segments = [];
  const allElements = Array.from(
    new Set([...normalized.核心元素, ...normalized.驱动元素, ...normalized.约束元素, ...normalized.触发元素]),
  );
  if (normalized.模式 && normalized.模式 !== '无') segments.push(`模式:${normalized.模式}`);
  if (normalized.核心元素.length) segments.push(`核心:${normalized.核心元素.join('/')}`);
  if (normalized.驱动元素.length) segments.push(`驱动:${normalized.驱动元素.join('/')}`);
  if (normalized.约束元素.length) segments.push(`约束:${normalized.约束元素.join('/')}`);
  if (normalized.触发元素.length) segments.push(`触发:${normalized.触发元素.join('/')}`);
  if (allElements.length) segments.push('门槛:高阶元素演化优先看已解锁属性与魂力/精神力负荷');
  if (['水', '火', '风', '土'].every(token => allElements.includes(token)))
    segments.push('高阶提示:四基础元素齐备可导向元素剥离，雷仅是四元素归元后的法则性显化');
  if (['水', '火', '风', '土', '光', '暗', '空间'].every(token => allElements.includes(token)))
    segments.push('高阶提示:七元素爆裂须以水火风土光暗空间齐备为前提');
  return segments.length ? `构型：${segments.join('；')}` : '';
}

function buildSkillWuxingInvocationSummaryText(invocation = {}) {
  const normalized = normalizeSkillWuxingInvocation(invocation);
  const segments = [];
  const hasFullWuxing = WUXING_ELEMENT_SEQUENCE.every(token => normalized.调用链.includes(token));
  if (normalized.模式 && normalized.模式 !== '无') segments.push(`模式:${normalized.模式}`);
  if (normalized.调用链.length) segments.push(`调用链:${normalized.调用链.join('→')}`);
  if (normalized.回路闭合) segments.push('回路:闭环');
  if (normalized.层级回溯.length) segments.push(`回溯:${normalized.层级回溯.join('/')}`);
  if (normalized.终态 && normalized.终态 !== '无') segments.push(`终态:${normalized.终态}`);
  if (normalized.结果 && normalized.结果 !== '无') segments.push(`结果:${normalized.结果}`);
  if (normalized.调用链.length) segments.push('规则:五行调用按最高合法链理解，不按简单数量堆叠');
  if (normalized.调用链.length) segments.push('门槛:五行高阶演化优先看已解锁属性与魂力/精神力负荷');
  if (hasFullWuxing) segments.push('高阶提示:金木水火土齐备后方可导向五行剥离/五行遁法');
  else if (normalized.调用链.length) segments.push('限制:未集齐金木水火土前，不得直接写五行剥离/五行遁法');
  return segments.length ? `术式：${segments.join('；')}` : '';
}

function buildSkillPolaritySummaryText(polarityInfo = {}) {
  const normalized = normalizeSkillPolarityInfo(polarityInfo);
  if (!normalized.polarityUnlocked && normalized.polarityMode === '无') return '';
  return `极性：${normalized.polarityMode && normalized.polarityMode !== '无' ? normalized.polarityMode : '已开启'}`;
}

function replaceSkillRuntimeSummaryEffects(skill = {}, summaryEffects = []) {
  void summaryEffects;
  const baseEffects = clonePackedSkillEffects(Array.isArray(skill?._效果数组) ? skill._效果数组 : []);
  skill._效果数组 = baseEffects;
  return skill;
}

function stripSkillLegacyRuntimeFields(skill = {}) {
  ['属性来源', '魂技作用', '属性系数', '元素构型', '五行调用结构', '极性信息'].forEach(key => {
    if (key in skill) delete skill[key];
  });
  return skill;
}

function buildSkillRuntimeSummaryEffects(runtime = {}) {
  void runtime;
  return [];
}

function buildSkillMasteryAdjustmentCoefficients(mastery = 0, source = '无') {
  const ratio = Math.max(0, Math.min(1, Number(mastery || 0) / 100));
  if (ratio <= 0) return normalizeSkillAttributeCoefficients();
  if (source === '魂技调用') {
    return normalizeSkillAttributeCoefficients({
      掌控: 1 + ratio * 0.06,
      威力: 1 + ratio * 0.03,
      消耗: Math.max(0.6, 1 - ratio * 0.04),
      前摇: Math.max(0.7, 1 - ratio * 0.03),
      控制: 1 + ratio * 0.05,
      速度: 1 + ratio * 0.01,
    });
  }
  if (source === '自身操控') {
    return normalizeSkillAttributeCoefficients({
      掌控: 1 + ratio * 0.08,
      威力: 1 + ratio * 0.04,
      消耗: Math.max(0.6, 1 - ratio * 0.05),
      前摇: Math.max(0.7, 1 - ratio * 0.04),
      控制: 1 + ratio * 0.04,
      速度: 1 + ratio * 0.03,
    });
  }
  return normalizeSkillAttributeCoefficients();
}

function buildElementStructureCoefficients(structure = {}, attachedAttributes = []) {
  const normalized = normalizeSkillElementStructure(structure);
  const roleProfiles = [];
  [
    ['核心元素', normalized.核心元素],
    ['驱动元素', normalized.驱动元素],
    ['约束元素', normalized.约束元素],
    ['触发元素', normalized.触发元素],
  ].forEach(([roleKey, attrs]) => {
    const elements = normalizeSkillAttachedAttributeArray(attrs);
    if (!elements.length) return;
    roleProfiles.push(
      multiplySkillAttributeCoefficientProfiles([
        buildSkillAttributeCoefficientsFromAttachedAttributes(elements),
        ELEMENT_STRUCTURE_ROLE_COEFF_MAP[roleKey] || normalizeSkillAttributeCoefficients(),
      ]),
    );
  });
  if (!roleProfiles.length) {
    const attached = normalizeSkillAttachedAttributeArray(attachedAttributes);
    if (attached.length) roleProfiles.push(buildSkillAttributeCoefficientsFromAttachedAttributes(attached));
  }
  const baseProfile = roleProfiles.length
    ? mergeAttributeCoefficientProfiles(roleProfiles)
    : normalizeSkillAttributeCoefficients();
  const modeProfile = ELEMENT_STRUCTURE_MODE_COEFF_MAP[normalized.模式] || normalizeSkillAttributeCoefficients();
  return multiplySkillAttributeCoefficientProfiles([baseProfile, modeProfile]);
}

function buildElementSkillAmplifierCoefficients(skill = {}, context = {}, attachedAttributes = [], profile = {}) {
  void context;
  void attachedAttributes;
  const roleCoeff =
    SKILL_ROLE_COEFF_MAP[normalizeSkillRoleType(skill?.魂技作用 || '', '无')] || normalizeSkillAttributeCoefficients();
  const masteryCoeff = buildSkillMasteryAdjustmentCoefficients(profile?.mastery || 0, '自身操控');
  return multiplySkillAttributeCoefficientProfiles([roleCoeff, masteryCoeff]);
}

function composeElementControlCoefficients(structureCoeff = {}, amplifierCoeff = {}) {
  return multiplySkillAttributeCoefficientProfiles([structureCoeff, amplifierCoeff]);
}

function buildWuxingInvocationCoefficients(invocation = {}, attachedAttributes = []) {
  const normalized = normalizeSkillWuxingInvocation(invocation);
  const invocationElements = extractWuxingInvocationElements(normalized);
  const attached = invocationElements.length
    ? invocationElements
    : normalizeSkillAttachedAttributeArray(attachedAttributes);
  const elementCoeff = attached.length
    ? buildSkillAttributeCoefficientsFromAttachedAttributes(attached)
    : normalizeSkillAttributeCoefficients();
  const modeCoeff = WUXING_INVOCATION_MODE_COEFF_MAP[normalized.模式] || normalizeSkillAttributeCoefficients();
  return multiplySkillAttributeCoefficientProfiles([elementCoeff, modeCoeff]);
}

function buildWuxingRelationCoefficients(invocation = {}) {
  const normalized = normalizeSkillWuxingInvocation(invocation);
  const invocationElements = extractWuxingInvocationElements(normalized);
  const hasFullWuxing = WUXING_ELEMENT_SEQUENCE.every(attr => invocationElements.includes(attr));
  const chainCount = invocationElements.filter(attr => WUXING_ELEMENT_SEQUENCE.includes(attr)).length;
  const relationCoeff =
    normalized.回路闭合 || hasFullWuxing
      ? WUXING_RELATION_COEFF_MAP.闭环
      : chainCount >= 4
        ? WUXING_RELATION_COEFF_MAP.四链
        : chainCount >= 3
          ? WUXING_RELATION_COEFF_MAP.三链
          : chainCount >= 2
            ? WUXING_RELATION_COEFF_MAP.二链
            : normalizeSkillAttributeCoefficients();
  const returnCoeff = normalized.层级回溯.includes('阴阳')
    ? WUXING_RELATION_COEFF_MAP.回溯
    : normalizeSkillAttributeCoefficients();
  return multiplySkillAttributeCoefficientProfiles([relationCoeff, returnCoeff]);
}

function buildPolarityReturnCoefficients(polarityInfo = {}) {
  const normalized = normalizeSkillPolarityInfo(polarityInfo);
  if (!normalized.polarityUnlocked && normalized.polarityMode === '无') return normalizeSkillAttributeCoefficients();
  return POLARITY_MODE_COEFF_MAP[normalized.polarityMode] || normalizeSkillAttributeCoefficients();
}

function composeWuxingInvocationCoefficients(
  invocationCoeff = {},
  relationCoeff = {},
  polarityCoeff = {},
  masteryCoeff = {},
) {
  return multiplySkillAttributeCoefficientProfiles([invocationCoeff, relationCoeff, polarityCoeff, masteryCoeff]);
}

function inferSkillAttributeSource(profile = {}, skill = {}, context = {}) {
  const explicit = normalizeSkillAttributeSource(getStoredSkillSystemBaseParam(skill, '属性来源') || '', '无');
  if (explicit !== '无') return explicit;
  const normalizedProfile = createSpiritElementProfile(profile);
  if (hasSkillWuxingInvocation(getStoredSkillWuxingInvocation(skill)) || normalizedProfile.system === '五行')
    return '魂技调用';
  if (
    hasSkillElementStructure(getStoredSkillElementStructure(skill)) ||
    normalizedProfile.system === '元素' ||
    String(context?.type || '').includes('元素')
  )
    return '自身操控';
  return '无';
}

function inferSkillRoleType(source = '无', skill = {}) {
  const explicit = normalizeSkillRoleType(getStoredSkillSystemBaseParam(skill, '魂技作用') || '', '无');
  if (explicit !== '无') return explicit;
  if (source === '魂技调用') return '结构术式';
  if (source === '自身操控') return '增幅器';
  return '无';
}

function finalizeSkillElementStructure(skill = {}, source = '无', attachedAttributes = []) {
  const normalized = getStoredSkillElementStructure(skill);
  if (source !== '自身操控') return normalized;
  const attached = normalizeSkillAttachedAttributeArray(attachedAttributes);
  const next = { ...normalized };
  if (!hasSkillElementStructure(next) && attached.length) next.核心元素 = [...attached];
  if ((!next.模式 || next.模式 === '无') && attached.length)
    next.模式 = attached.length > 1 ? '元素硬控' : '单元素掌控';
  return normalizeSkillElementStructure(next);
}

function finalizeSkillWuxingInvocation(skill = {}, source = '无', attachedAttributes = [], polarityInfo = {}) {
  const normalized = getStoredSkillWuxingInvocation(skill);
  if (source !== '魂技调用') return normalized;
  const attached = normalizeSkillAttachedAttributeArray(attachedAttributes);
  const next = { ...normalized };
  const seedChain = next.调用链.length ? next.调用链 : attached;
  const legalChain = resolveHighestLegalWuxingChain(seedChain);
  if (legalChain.length) next.调用链 = [...legalChain];
  else if (!next.调用链.length && attached.length) next.调用链 = [attached[0]];
  const chainCount = legalChain.length;
  const hasFullWuxing = chainCount >= 5 && WUXING_ELEMENT_SEQUENCE.every(attr => next.调用链.includes(attr));
  if (!next.模式 || next.模式 === '无') {
    if (polarityInfo?.polarityUnlocked || String(polarityInfo?.polarityMode || '无') !== '无') next.模式 = '逆演归一';
    else if (hasFullWuxing) next.模式 = '五行轮转';
    else if (chainCount >= 4) next.模式 = '四行压场';
    else if (chainCount >= 3) next.模式 = '三行扩链';
    else if (chainCount >= 2) next.模式 = '二行成链';
    else if (chainCount >= 1) next.模式 = '一行调用';
  }
  next.回路闭合 = !!((next.模式 === '相生循环' || next.模式 === '五行轮转') && next.调用链.length >= 5);
  return normalizeSkillWuxingInvocation(next);
}

function resolveSkillAttachedAttributes(
  skill = {},
  context = {},
  profile = {},
  source = '无',
  elementStructure = {},
  wuxingInvocation = {},
) {
  const explicitAttached = normalizeSkillAttachedAttributeArray(skill?.附带属性);
  if (explicitAttached.length) return explicitAttached;
  const structureAttrs = collectSkillElementStructureAttributes(elementStructure);
  if (source === '自身操控' && structureAttrs.length) return structureAttrs;
  const invocationAttrs = extractWuxingInvocationElements(wuxingInvocation);
  if (source === '魂技调用' && invocationAttrs.length) return invocationAttrs;
  void context;
  void profile;
  return [];
}

function buildSkillAttributeGateContext(context = {}) {
  const unlocked = normalizeSkillAttachedAttributeArray(
    context?.unlockedAttributes || context?.elementProfile?.elements || [],
  );
  const explicitCapacity = normalizeSkillAttachedAttributeArray(context?.attributeCapacity || []);
  return {
    unlocked,
    capacity: explicitCapacity.length ? explicitCapacity : unlocked,
  };
}

function applySkillAttachedAttributeHardGate(attachedAttributes = [], context = {}) {
  const gateContext = buildSkillAttributeGateContext(context);
  let filtered = normalizeSkillAttachedAttributeArray(attachedAttributes);
  const warnings = [];

  if (gateContext.unlocked.length) {
    const missingUnlocked = filtered.filter(attr => !gateContext.unlocked.includes(attr));
    if (missingUnlocked.length) {
      warnings.push(`硬拦截: 缺少已解锁属性 ${missingUnlocked.join('/')}`);
      filtered = filtered.filter(attr => gateContext.unlocked.includes(attr));
    }
  }

  if (gateContext.capacity.length) {
    const overflow = filtered.filter(attr => !gateContext.capacity.includes(attr));
    if (overflow.length) {
      warnings.push(`硬拦截: 超出可容纳属性 ${overflow.join('/')}`);
      filtered = filtered.filter(attr => gateContext.capacity.includes(attr));
    }
  }

  return {
    attachedAttributes: filtered,
    warnings,
    gateContext,
  };
}

function constrainSkillElementStructureByAttached(structure = {}, allowedAttributes = []) {
  const normalized = normalizeSkillElementStructure(structure);
  const allowed = new Set(normalizeSkillAttachedAttributeArray(allowedAttributes));
  if (!allowed.size) return normalized;

  const next = {
    ...normalized,
    核心元素: normalized.核心元素.filter(attr => allowed.has(attr)),
    驱动元素: normalized.驱动元素.filter(attr => allowed.has(attr)),
    约束元素: normalized.约束元素.filter(attr => allowed.has(attr)),
    触发元素: normalized.触发元素.filter(attr => allowed.has(attr)),
  };
  const hasAny = next.核心元素.length || next.驱动元素.length || next.约束元素.length || next.触发元素.length;
  if (!hasAny) {
    next.模式 = '无';
    next.关系 = [];
  }
  return normalizeSkillElementStructure(next);
}

function constrainSkillWuxingInvocationByAttached(invocation = {}, allowedAttributes = []) {
  const normalized = normalizeSkillWuxingInvocation(invocation);
  const allowed = new Set(
    normalizeSkillAttachedAttributeArray(allowedAttributes).filter(attr => WUXING_ELEMENT_SEQUENCE.includes(attr)),
  );
  if (!allowed.size) return normalized;

  const filteredChain = resolveHighestLegalWuxingChain(
    normalized.调用链.map(token => mapWuxingInvocationTokenToElement(token)).filter(attr => allowed.has(attr)),
  );
  const next = { ...normalized, 调用链: filteredChain };
  if (!filteredChain.length) {
    next.模式 = '无';
    next.回路闭合 = false;
    next.层级回溯 = [];
    next.终态 = '无';
    next.结果 = '无';
  } else if (filteredChain.length < 5) {
    next.回路闭合 = false;
  }
  return normalizeSkillWuxingInvocation(next);
}

function buildSkillAttributeCoefficientsV2(skill = {}, context = {}) {
  return buildSkillRuntimeAttributeContext(skill, context).attributeCoeff;
}

function buildSkillRuntimeAttributeContext(skill = {}, context = {}) {
  const profile =
    context?.elementProfile && typeof context.elementProfile === 'object'
      ? createSpiritElementProfile(context.elementProfile)
      : createSpiritElementProfile();
  const preResolvedAttached = normalizeSkillAttachedAttributeArray(skill?.附带属性);
  const source = normalizeSkillAttributeSource(inferSkillAttributeSource(profile, skill, context), '无');
  const role = normalizeSkillRoleType(inferSkillRoleType(source, skill), '无');
  const normalizedPolarity = normalizeSkillPolarityInfo(getStoredSkillPolarityInfo(skill), {
    polarityUnlocked: profile?.polarityUnlocked,
    polarityMode: profile?.polarityMode || '无',
  });
  const initialElementStructure = finalizeSkillElementStructure(skill, source, preResolvedAttached);
  const initialWuxingInvocation = finalizeSkillWuxingInvocation(skill, source, preResolvedAttached, normalizedPolarity);
  const resolvedAttached = resolveSkillAttachedAttributes(
    skill,
    context,
    profile,
    source,
    initialElementStructure,
    initialWuxingInvocation,
  );
  const gateResult = applySkillAttachedAttributeHardGate(resolvedAttached, context);
  const attached = normalizeSkillAttachedAttributeArray(gateResult.attachedAttributes);
  const elementStructure = constrainSkillElementStructureByAttached(
    finalizeSkillElementStructure(skill, source, attached),
    attached,
  );
  const wuxingInvocation = constrainSkillWuxingInvocationByAttached(
    finalizeSkillWuxingInvocation(skill, source, attached, normalizedPolarity),
    attached,
  );
  let attributeCoeff = getStoredSkillAttributeCoefficients(skill);

  if (source === '自身操控') {
    const hasEntry = attached.length > 0 || hasSkillElementStructure(elementStructure);
    if (hasEntry) {
      const structureCoeff = buildElementStructureCoefficients(elementStructure, attached);
      const amplifierCoeff = buildElementSkillAmplifierCoefficients({ 魂技作用: role }, context, attached, profile);
      attributeCoeff = composeElementControlCoefficients(structureCoeff, amplifierCoeff);
    }
  } else if (source === '魂技调用') {
    const hasEntry =
      attached.length > 0 || hasSkillWuxingInvocation(wuxingInvocation) || hasSkillPolarityInfo(normalizedPolarity);
    if (hasEntry) {
      const invocationCoeff = buildWuxingInvocationCoefficients(wuxingInvocation, attached);
      const relationCoeff = buildWuxingRelationCoefficients(wuxingInvocation);
      const polarityCoeff = buildPolarityReturnCoefficients(normalizedPolarity);
      const masteryCoeff = buildSkillMasteryAdjustmentCoefficients(profile?.mastery || 0, '魂技调用');
      attributeCoeff = composeWuxingInvocationCoefficients(invocationCoeff, relationCoeff, polarityCoeff, masteryCoeff);
    }
  } else if (isNeutralSkillAttributeCoefficientProfile(attributeCoeff)) {
    attributeCoeff = buildDefaultSkillAttributeCoefficients(profile, context, attached);
  }

  const displayElementLabel =
    getStoredSkillDisplayElement(skill) ||
    (attached.length ? attached.join('/') : getElementProfilePrimaryLabel(profile));
  return {
    profile,
    source,
    role,
    attachedAttributes: attached,
    elementStructure,
    wuxingInvocation,
    polarityInfo: normalizedPolarity,
    attributeCoeff,
    displayElementLabel: String(displayElementLabel || '无').trim() || '无',
  };
}

function mergeAttributeCoefficientProfiles(list = []) {
  const profiles = (Array.isArray(list) ? list : []).map(profile => normalizeSkillAttributeCoefficients(profile || {}));
  if (!profiles.length) return normalizeSkillAttributeCoefficients();
  const merged = {};
  const keys = Object.keys(normalizeSkillAttributeCoefficients());
  keys.forEach(key => {
    const total = profiles.reduce((sum, profile) => sum + Number(profile?.[key] ?? 1), 0);
    merged[key] = total / profiles.length;
  });
  return normalizeSkillAttributeCoefficients(merged);
}

function buildSkillAttributeCoefficientsFromAttachedAttributes(attachedAttributes = []) {
  const attached = normalizeSkillAttachedAttributeArray(attachedAttributes);
  if (!attached.length) return normalizeSkillAttributeCoefficients();
  const profiles = attached.map(attr => ATTRIBUTE_COEFF_MAP[attr] || normalizeSkillAttributeCoefficients());
  return mergeAttributeCoefficientProfiles(profiles);
}

function pickDeterministicAttributeToken(list = [], seed = '') {
  const pool = Array.from(new Set((Array.isArray(list) ? list : []).map(normalizeSkillAttributeToken).filter(Boolean)));
  if (!pool.length) return '';
  const text = String(seed || '').trim();
  if (!text) return pool[0];
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 131 + text.charCodeAt(i)) % 2147483647;
  }
  return pool[Math.abs(hash) % pool.length];
}

function collectSkillMapAttachedAttributes(skillMap = {}) {
  const collected = [];
  Object.values(skillMap || {}).forEach(skill => {
    collected.push(...normalizeSkillAttachedAttributeArray(skill?.附带属性));
  });
  return Array.from(new Set(collected));
}

function buildDefaultSkillAttributeCoefficients(profile = {}, context = {}, attachedAttributes = []) {
  void profile;
  void context;
  return buildSkillAttributeCoefficientsFromAttachedAttributes(attachedAttributes);
}

function getElementProfilePrimaryLabel(profile = {}) {
  const normalized = createSpiritElementProfile(profile);
  if (normalized.system === '五行')
    return normalized.wuxingTier >= 5 ? '五行' : normalized.wuxingTier > 0 ? `${normalized.wuxingTier}行` : '无';
  if (normalized.controlTier >= 9) return '九元素';
  if (normalized.controlTier >= 7) return '七元素';
  if (normalized.controlTier >= 2) return `${normalized.controlTier}元素`;
  if (normalized.controlTier === 1) return normalized.elements[0] || '无';
  return '无';
}

function applySkillElementInheritance(skill = {}, context = {}) {
  if (!skill || typeof skill !== 'object') return skill;
  if (!Array.isArray(skill._效果数组)) skill._效果数组 = [];
  const runtime = buildSkillRuntimeAttributeContext(skill, context);
  skill.附带属性 = runtime.attachedAttributes;
  stripSkillLegacyRuntimeFields(skill);
  return skill;
}

function normalizeFusionRuntimeParticipants(participants = []) {
  if (!Array.isArray(participants)) return [];
  return participants
    .map(participant => {
      const safeParticipant = participant && typeof participant === 'object' ? participant : {};
      return {
        role: safeParticipant.role === 'self' ? 'self' : 'partner',
        charKey: String(safeParticipant.charKey || '').trim(),
        charName: String(safeParticipant.charName || '').trim(),
        spirit: String(safeParticipant.spirit || '').trim(),
      };
    })
    .filter(participant => participant.charKey || participant.charName || participant.spirit);
}

function findFusionSpiritDataByReference(charData = {}, spiritRef = '') {
  const safeRef = String(spiritRef || '').trim();
  if (!safeRef || !charData?.武魂 || typeof charData.武魂 !== 'object') return null;
  if (charData.武魂[safeRef] && typeof charData.武魂[safeRef] === 'object') {
    return { spiritKey: safeRef, spiritData: charData.武魂[safeRef] };
  }
  const matchedEntry = Object.entries(charData.武魂).find(([spiritKey, spiritData]) => {
    if (!spiritData || typeof spiritData !== 'object') return false;
    return spiritKey === safeRef || String(spiritData.表象名称 || '').trim() === safeRef;
  });
  return matchedEntry ? { spiritKey: matchedEntry[0], spiritData: matchedEntry[1] } : null;
}

function resolveFusionParticipantCharData(rootData = {}, ownerCharKey = '', ownerChar = {}, participant = {}) {
  const safeParticipant = participant && typeof participant === 'object' ? participant : {};
  if (safeParticipant.role === 'self') return ownerChar;
  if (safeParticipant.charKey && rootData?.char?.[safeParticipant.charKey]) return rootData.char[safeParticipant.charKey];
  const byNameKey = findCombatCharKeyByName(rootData, safeParticipant.charName || safeParticipant.charKey || '');
  return byNameKey && rootData?.char?.[byNameKey] ? rootData.char[byNameKey] : null;
}

function buildFusionSkillAttributeStateFromData(fusionSkill = {}, ownerCharKey = '', rootData = {}) {
  const ownerChar = rootData?.char?.[ownerCharKey] || {};
  const normalizedParticipants = normalizeFusionRuntimeParticipants(fusionSkill?.融合参与者 || []);
  const mergedStates = [];
  if (normalizedParticipants.length > 0) {
    normalizedParticipants.forEach(participant => {
      const charData = resolveFusionParticipantCharData(rootData, ownerCharKey, ownerChar, participant);
      const spiritMatch = findFusionSpiritDataByReference(charData, participant.spirit);
      if (!spiritMatch) return;
      mergedStates.push(normalizeSpiritAttributeState(spiritMatch.spiritData, spiritMatch.spiritKey, charData));
    });
  }
  if (!mergedStates.length) {
    const slots = getNormalizedFusionSourceSpirits(fusionSkill, ownerChar);
    slots.forEach(slot => {
      const spiritData = ownerChar?.武魂?.[slot];
      if (!spiritData || typeof spiritData !== 'object') return;
      mergedStates.push(normalizeSpiritAttributeState(spiritData, slot, ownerChar));
    });
  }
  return mergeSpiritAttributeStates(mergedStates);
}

function getFusionSkillElementProfile(fusionSkill = {}, char = {}, ownerCharKey = '', rootData = null) {
  if (rootData && typeof rootData === 'object' && ownerCharKey) {
    return buildElementProfileFromAttributeState(buildFusionSkillAttributeStateFromData(fusionSkill, ownerCharKey, rootData));
  }
  const slots = getNormalizedFusionSourceSpirits(fusionSkill, char);
  const mergedStates = [];
  slots.forEach(slot => {
    const spiritData = char?.武魂?.[slot];
    if (!spiritData || typeof spiritData !== 'object') return;
    mergedStates.push(normalizeSpiritAttributeState(spiritData, slot, char));
  });
  return buildElementProfileFromAttributeState(mergeSpiritAttributeStates(mergedStates));
}

function cloneSkillStructData(skill = {}) {
  const packedEffects = clonePackedSkillEffects(skill?._效果数组 || []);
  const attachedAttributes = normalizeSkillAttachedAttributeArray(skill?.附带属性);
  const defaultText = packedEffects.length > 0 ? undefined : SKILL_TEXT_UNKNOWN;
  const working = {
    魂技名: String(skill?.魂技名 || skill?.技能名称 || skill?.name || AI_TODO_SKILL_NAME),
    画面描述: String(skill?.画面描述 || defaultText || AI_TODO_SKILL_VISUAL),
    效果描述: String(skill?.效果描述 || defaultText || AI_TODO_SKILL_EFFECT),
    附带属性: attachedAttributes,
    _效果数组: packedEffects,
  };
  applySkillElementInheritance(working, {});
  syncConstructSkillMetadata(working);
  hydrateSkillTextByPackedEffects(working, {}, { forceVisual: true, forceEffect: true });
  return {
    魂技名: working.魂技名,
    画面描述: working.画面描述,
    效果描述: working.效果描述,
    附带属性: normalizeSkillAttachedAttributeArray(working.附带属性 || []),
    _效果数组: clonePackedSkillEffects(working._效果数组 || []),
  };
}

function syncConstructSkillMetadata(skill = {}) {
  if (!skill || !Array.isArray(skill._效果数组)) return skill;
  const resolvedSkillName =
    String(skill?.魂技名 || skill?.技能名称 || skill?.name || AI_TODO_SKILL_NAME).trim() || AI_TODO_SKILL_NAME;
  skill.魂技名 = resolvedSkillName;
  const rawEffects = clonePackedSkillEffects(skill._效果数组 || []);
  const createEffects = rawEffects.filter(effect => ['生成造物', '造物生成'].includes(String(effect?.机制 || '')));
  if (!createEffects.length) return skill;
  const existingSystemBase = rawEffects.find(effect => effect?.机制 === '系统基础') || {};
  const systemEffects = [buildMinimalSkillRuntimeSystemBaseEffect(existingSystemBase)];
  const normalizedCreateEffects = createEffects.map(effect => {
    const cloned = { ...effect };
    const isFood = String(cloned.产物类型 || '') === '食物';
    const baseUsageEffects = Array.isArray(cloned.使用效果) ? clonePackedSkillEffects(cloned.使用效果) : [];
    const inventoryUsageEffects = buildConstructUsableEffects(
      baseUsageEffects,
      isFood ? '食用者' : '自身',
      isFood ? '食物系' : '',
    );
    cloned.魂技名 = resolvedSkillName;
    cloned.使用效果 = baseUsageEffects;
    if (Number(cloned.有效期tick || 0) > 0)
      cloned.有效期间 = String(cloned.有效期间 || '').trim() || formatTickDurationAsDayText(cloned.有效期tick || 0);
    else delete cloned.有效期间;
    delete cloned.产物名称;
    delete cloned.有效期至;
    delete cloned.有效期至tick;
    const template = { ...(cloned.背包模板 && typeof cloned.背包模板 === 'object' ? cloned.背包模板 : {}) };
    template.描述 = buildTemporaryConstructDescription(
      resolvedSkillName,
      inventoryUsageEffects,
      cloned.有效期tick || 0,
      { type: cloned.产物类型 || '' },
    );
    template.来源技能 = resolvedSkillName;
    delete template.有效期至;
    delete template.有效期至tick;
    cloned.背包模板 = template;
    return cloned;
  });
  skill._效果数组 = [...systemEffects, ...normalizedCreateEffects];
  return skill;
}

const FUSION_SPIRIT_SLOTS = ['第一武魂', '第二武魂'];

function getNormalizedFusionMode(fusionSkill = {}) {
  return fusionSkill?.融合模式 === 'self' ? 'self' : 'partner';
}

function getNormalizedFusionSourceSpirits(fusionSkill = {}, char = {}) {
  const rawSlots = Array.isArray(fusionSkill?.来源武魂) ? fusionSkill.来源武魂 : [];
  let slots = rawSlots.map(slot => String(slot || '').trim()).filter(slot => FUSION_SPIRIT_SLOTS.includes(slot));
  if (!slots.length) slots = getNormalizedFusionMode(fusionSkill) === 'self' ? [...FUSION_SPIRIT_SLOTS] : ['第一武魂'];
  return Array.from(new Set(slots));
}

function buildMinimalSkillRuntimeSystemBaseEffect(source = {}) {
  const raw = source && typeof source === 'object' ? source : {};
  return 收口执行系统基础条目_V1(raw, raw?.目标模型 || '敌方单体');
}

function ensureFusionSkillMentalCost(skill, currentRatio = 0.5) {
  if (!skill || typeof skill !== 'object') return skill;
  if (!Array.isArray(skill._效果数组)) skill._效果数组 = [];
  let systemBaseIndex = skill._效果数组.findIndex(effect => effect && effect.机制 === '系统基础');
  if (systemBaseIndex < 0) {
    skill._效果数组.unshift(buildMinimalSkillRuntimeSystemBaseEffect({
      技能类型: '输出',
      对象: '敌方/单体',
      消耗: '无',
      cast_time: 30,
    }));
    systemBaseIndex = 0;
  } else {
    skill._效果数组[systemBaseIndex] = buildMinimalSkillRuntimeSystemBaseEffect(skill._效果数组[systemBaseIndex]);
  }
  const systemBase = skill._效果数组[systemBaseIndex];
  const preservedParts = String(systemBase.消耗 || '无')
    .split('|')
    .map(part => String(part || '').trim())
    .filter(part => part && part !== '无' && !/^精神力:/.test(part));
  preservedParts.push(`精神力:当前${Math.round(Math.max(0, Number(currentRatio || 0)) * 100)}%`);
  systemBase.消耗 = preservedParts.join(' | ');
  return skill;
}

function getBonePreferredSecondary(part = '') {
  const text = String(part || '');
  if (text.includes('头部')) return ['共享视野', '沉默', '标记弱点'];
  if (text.includes('躯干')) return ['小护盾', '净化', '解控'];
  if (text.includes('臂')) return ['穿透', '反击', '打断'];
  if (text.includes('腿')) return ['减速', '追击', '标记弱点'];
  return [];
}

const 技能机制决策临时字段_V1 = '机制决策临时';

function 规范化机制枚举数组_V1(list = []) {
  return Array.from(
    new Set(
      (Array.isArray(list) ? list : [])
        .map(item => String(item || '').trim())
        .filter(Boolean),
    ),
  );
}

const 技能副作用类型候选_V1 = Object.freeze([
  '全属性降低',
  '增幅失控',
  '自损反噬',
  '致死献祭',
  '精神紊乱',
  '魂力反噬',
  '命中下降',
  '动作迟缓',
  '目标错乱',
  '施法僵直',
  '状态溢出',
]);

function 构建技能机制候选池_V1() {
  const 全机制候选 = [];
  const 主机制候选 = [];
  const 副机制候选 = [];
  Object.entries(SKILL_MECHANISM_META_V1 || {}).forEach(([机制名, 元数据]) => {
    const name = String(机制名 || '').trim();
    if (!name) return;
    const meta = 元数据 && typeof 元数据 === 'object' ? 元数据 : {};
    const 可主机制 = meta.可主机制 === true;
    const 可副机制 = meta.可副机制 === true;
    if (可主机制 || 可副机制) 全机制候选.push(name);
    if (可主机制) 主机制候选.push(name);
    if (可副机制) 副机制候选.push(name);
  });
  return {
    全机制候选: 规范化机制枚举数组_V1(全机制候选),
    主机制候选: 规范化机制枚举数组_V1(主机制候选),
    副机制候选: 规范化机制枚举数组_V1(副机制候选),
  };
}

function 脚本判定副机制字段数量_V1(context = {}) {
  const 魂环位 = Math.max(1, Number(context?.ringIndex || 1));
  const 契合度原始 = Number(context?.compatibility);
  const 契合度 = Math.max(0, Math.min(100, Number.isFinite(契合度原始) ? 契合度原始 : 0));
  if (魂环位 < 2 && 契合度 < 65) return 0;
  if (魂环位 >= 5 || 契合度 >= 85) return 2;
  return 1;
}

function 脚本判定是否出现副作用字段_V1(context = {}) {
  const 品质 = String(context?.sourceQuality || context?.来源品质 || '').trim().toUpperCase();
  if (/[SＡ]/i.test(品质) || /A/.test(品质)) return false;
  const 魂环位 = Math.max(1, Number(context?.ringIndex || 1));
  return 魂环位 <= 6;
}

function 构建机制待生成提示词_V1(字段名 = '主机制', 候选列表 = [], 附加规则 = '') {
  const 名称 = String(字段名 || '机制').trim() || '机制';
  const 候选文本 = 规范化机制枚举数组_V1(候选列表).join('、') || '无';
  const 规则文本 = String(附加规则 || '').trim();
  return `待补全（请结合武魂特性、魂环来源魂兽特性与当前剧情上下文，从候选中选择最合适的${名称}并写回候选原文；同时与魂技名、画面描述保持一致；禁止输出候选外内容。候选：${候选文本}${规则文本 ? `；${规则文本}` : ''}）`;
}

function 构建多方向待生成提示词_V1() {
  return '待补全（请结合武魂特性、魂环来源魂兽特性与当前剧情上下文，并与魂技名、画面描述保持一致，在“是/否”中二选一；若该技能应具备两个及以上并行效果分支则填“是”，否则填“否”）';
}

function 构建多方向类型待生成提示词_V1(候选列表 = []) {
  const 候选文本 = 规范化机制枚举数组_V1(候选列表).join('、') || '无';
  return `待补全（请结合武魂特性、魂环来源魂兽特性与当前剧情上下文，并与魂技名、画面描述和是否多方向保持一致，从候选中选择最合适的多方向类型并写回候选原文；若是否多方向=否则填写“无”。候选：${候选文本}）`;
}

function 构建变异机制待生成提示词_V1(候选列表 = []) {
  const 候选文本 = 规范化机制枚举数组_V1(候选列表).join('、') || '无';
  return `待补全（请结合武魂特性、魂环来源魂兽特性与当前剧情上下文，判断是否需要变异机制；可为空数组，若选择则仅可从候选中多选并以数组写回候选原文；禁止输出候选外内容。候选：${候选文本}）`;
}

function 构建对象差异规则待生成提示词_V1(条件候选 = [], 处理候选 = []) {
  const 条件文本 = 规范化机制枚举数组_V1(条件候选).join('、') || '无';
  const 处理文本 = 规范化机制枚举数组_V1(处理候选).join('、') || '无';
  return `待补全（按限选结构填写对象差异规则；条目可为空数组。每条条目格式：{条件:[从条件候选多选],处理:从处理候选单选,参数:{按处理补充}}；禁止输出候选外内容。条件候选：${条件文本}；处理候选：${处理文本}）`;
}

function 规范化机制限选单值_V1(值 = '', 候选列表 = [], 默认值 = '待补全') {
  const 候选项 = 规范化机制枚举数组_V1(候选列表);
  if (!候选项.length) return 默认值;
  const 文本 = String(值 || '').trim();
  if (!文本 || /^待补全/.test(文本)) return 默认值;
  return 候选项.includes(文本) ? 文本 : 默认值;
}

function 规范化机制限选多值_V1(值 = [], 候选列表 = []) {
  const 候选项 = 规范化机制枚举数组_V1(候选列表);
  if (!候选项.length) return [];
  const 值数组 = Array.isArray(值) ? 值 : [值];
  return 规范化机制枚举数组_V1(值数组).filter(item => 候选项.includes(item));
}

function 规范化机制限选多值或待补全文本_V1(值 = [], 候选列表 = [], 默认值 = '待补全') {
  const 命中列表 = 规范化机制限选多值_V1(值, 候选列表);
  if (命中列表.length) return 命中列表;
  const 文本 = String(值 || '').trim();
  if (文本 && /^待补全/.test(文本)) return 文本;
  return 默认值;
}

function 提取机制限选命中值_V1(字段值, 候选列表 = [], 选项 = {}) {
  const 候选项 = 规范化机制枚举数组_V1(候选列表);
  if (!候选项.length) return [];
  const 允许多选 = 选项?.allowMultiple === true;
  if (允许多选) {
    return 规范化机制限选多值_V1(字段值, 候选项);
  }
  const 已选单值 = 规范化机制限选单值_V1(Array.isArray(字段值) ? 字段值[0] : 字段值, 候选项, '');
  return 已选单值 ? [已选单值] : [];
}

function 是否机制待生成文本_V1(字段值 = '') {
  return /^待补全/.test(String(字段值 || '').trim());
}

function 记录机制决策回填失败_V1(字段名 = '', 字段值 = '', 说明 = '') {
  const 安全字段名 = String(字段名 || '未知字段').trim() || '未知字段';
  const 值文本 = Array.isArray(字段值)
    ? 字段值.map(item => String(item || '').trim()).filter(Boolean).join('、')
    : String(字段值 || '').trim();
  const 说明文本 = String(说明 || '').trim();
  console.warn(
    `[技能机制决策回填失败] 字段=${安全字段名}${值文本 ? `，值=${值文本}` : ''}${说明文本 ? `，原因=${说明文本}` : ''}`,
  );
}

function 解析技能机制决策对象差异规则_V1(决策数据 = {}) {
  const 规则源 = 决策数据?.对象差异规则?.条目;
  const 规则源列表 = Array.isArray(规则源) ? 规则源 : [];
  const 规则列表 = 规则源列表
    .map(item => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
      const 条件候选 = Array.isArray(item.条件) ? item.条件 : [item.条件];
      const 条件 = 规范化机制枚举数组_V1(条件候选).filter(token => 技能对象差异规则条件候选_V1.includes(token));
      if (!条件.length) return null;
      const 处理 = String(item.处理 || '').trim();
      if (!技能对象差异规则处理候选_V1.includes(处理)) return null;
      const 参数 = item.参数 && typeof item.参数 === 'object' && !Array.isArray(item.参数)
        ? cloneJsonValue(item.参数)
        : {};
      return { 条件, 处理, 参数 };
    })
    .filter(Boolean);
  return 收口执行对象差异规则列表_V1(规则列表);
}

function 构建技能机制决策临时数据_V1(skill = {}, context = {}) {
  const 现有决策 = skill?.[技能机制决策临时字段_V1];
  const 候选池 = 构建技能机制候选池_V1();
  const 上下文 = context && typeof context === 'object' ? context : {};
  const 原机制选择 = 现有决策 && typeof 现有决策.机制选择 === 'object' && !Array.isArray(现有决策.机制选择)
    ? cloneJsonValue(现有决策.机制选择)
    : {};
  const 机制选择 = {};
  const 副机制字段数量 = 脚本判定副机制字段数量_V1(上下文);
  const 需要副作用字段 = 脚本判定是否出现副作用字段_V1(上下文);
  const 主机制待生成提示词 = 构建机制待生成提示词_V1('主机制', 候选池.主机制候选);
  const 副机制1待生成提示词 = 构建机制待生成提示词_V1('副机制1', 候选池.副机制候选, '若出现副机制则先填写副机制1');
  const 副机制2待生成提示词 = 构建机制待生成提示词_V1('副机制2', 候选池.副机制候选, '仅在脚本要求2个副机制时填写，且不能与副机制1重复');
  const 副作用待生成提示词 = 构建机制待生成提示词_V1('副作用类型', 技能副作用类型候选_V1, '仅在脚本判定出现副作用时填写');
  const 多方向待生成提示词 = 构建多方向待生成提示词_V1();
  const 多方向类型待生成提示词 = 构建多方向类型待生成提示词_V1(技能多方向类型候选_V1);
  const 变异机制待生成提示词 = 构建变异机制待生成提示词_V1(SKILL_MUTATION_MECHANIC_TYPES_V1);
  const 对象差异规则待生成提示词 = 构建对象差异规则待生成提示词_V1(
    技能对象差异规则条件候选_V1,
    技能对象差异规则处理候选_V1,
  );
  机制选择.主机制 = 规范化机制限选单值_V1(原机制选择.主机制, 候选池.主机制候选, 主机制待生成提示词);
  if (副机制字段数量 >= 1) {
    机制选择.副机制1 = 规范化机制限选单值_V1(原机制选择.副机制1, 候选池.副机制候选, 副机制1待生成提示词);
  }
  if (副机制字段数量 >= 2) {
    机制选择.副机制2 = 规范化机制限选单值_V1(原机制选择.副机制2, 候选池.副机制候选, 副机制2待生成提示词);
  }
  机制选择.变异机制 = 规范化机制限选多值或待补全文本_V1(
    原机制选择.变异机制,
    SKILL_MUTATION_MECHANIC_TYPES_V1,
    变异机制待生成提示词,
  );
  if (需要副作用字段) {
    机制选择.副作用类型 = 规范化机制限选单值_V1(原机制选择.副作用类型, 技能副作用类型候选_V1, 副作用待生成提示词);
  }
  机制选择.是否多方向 = 规范化机制限选单值_V1(原机制选择.是否多方向, ['是', '否'], 多方向待生成提示词);
  机制选择.多方向类型 = 规范化机制限选单值_V1(原机制选择.多方向类型, 技能多方向类型候选_V1, 多方向类型待生成提示词);
  const 对象差异规则 = 现有决策 && typeof 现有决策.对象差异规则 === 'object' && !Array.isArray(现有决策.对象差异规则)
    ? cloneJsonValue(现有决策.对象差异规则)
    : {};
  const 旧提示词 = String(对象差异规则.填写提示词 || '').trim();
  对象差异规则.填写提示词 = /^待补全/.test(旧提示词) ? 旧提示词 : 对象差异规则待生成提示词;
  对象差异规则.条目 = Array.isArray(对象差异规则.条目)
    ? 收口执行对象差异规则列表_V1(对象差异规则.条目)
    : [];
  return {
    机制选择,
    对象差异规则,
  };
}

function 构建副作用条目_V1(副作用类型 = '', context = {}) {
  const 类型文本 = String(副作用类型 || '').trim();
  if (!类型文本) return null;
  const 状态名 = String(context?.状态名称 || context?.主机制原型 || '技能副作用').trim() || '技能副作用';
  const 副作用映射 = {
    全属性降低: {
      副作用类型: '全属性降低',
      触发时机: '状态结束后',
      生效对象: '状态持有者',
      持续回合: 2,
      触发概率: 1,
      关联状态: 状态名,
      面板修改比例: { str: 0.9, def: 0.9, agi: 0.9, vit_max: 0.92, sp_max: 0.92, men_max: 0.92 },
    },
    增幅失控: {
      副作用类型: '增幅失控',
      触发时机: '回合结束时',
      生效对象: '状态持有者',
      持续回合: 1,
      触发概率: 0.4,
      关联状态: 状态名,
      战斗效果: { random_target_rate: 0.3, hit_penalty: 0.1, cast_speed_penalty: 0.1 },
    },
    自损反噬: {
      副作用类型: '自损反噬',
      触发时机: '施放后',
      生效对象: '施术者',
      持续回合: 0,
      触发概率: 1,
      战斗效果: { hit_penalty: 0.05 },
    },
    致死献祭: {
      副作用类型: '致死献祭',
      触发时机: '施放后',
      生效对象: '施术者',
      持续回合: 0,
      触发概率: 1,
      战斗效果: { 致死: true },
    },
    精神紊乱: {
      副作用类型: '精神紊乱',
      触发时机: '施放后',
      生效对象: '施术者',
      持续回合: 2,
      触发概率: 0.5,
      战斗效果: { control_success_penalty: 0.1 },
    },
  };
  return normalizeSkillSideEffectEntry(副作用映射[类型文本] || 副作用映射.自损反噬);
}

function 按候选方案回填技能效果数组_V1(skill = {}, context = {}) {
  if (!skill || typeof skill !== 'object') return false;
  const 决策数据 = skill?.[技能机制决策临时字段_V1];
  if (!决策数据 || typeof 决策数据 !== 'object') return false;
  const 机制选择 = 决策数据.机制选择 && typeof 决策数据.机制选择 === 'object' ? 决策数据.机制选择 : {};
  const 候选池 = 构建技能机制候选池_V1();
  const 主机制原值 = String(机制选择.主机制 || '').trim();
  if (主机制原值 && !是否机制待生成文本_V1(主机制原值) && !候选池.主机制候选.includes(主机制原值)) {
    记录机制决策回填失败_V1('主机制', 主机制原值, '不在主机制候选内');
    return false;
  }
  const 副机制1原值 = String(机制选择.副机制1 || '').trim();
  if (副机制1原值 && !是否机制待生成文本_V1(副机制1原值) && !候选池.副机制候选.includes(副机制1原值)) {
    记录机制决策回填失败_V1('副机制1', 副机制1原值, '不在副机制候选内');
    return false;
  }
  const 副机制2原值 = String(机制选择.副机制2 || '').trim();
  if (副机制2原值 && !是否机制待生成文本_V1(副机制2原值) && !候选池.副机制候选.includes(副机制2原值)) {
    记录机制决策回填失败_V1('副机制2', 副机制2原值, '不在副机制候选内');
    return false;
  }
  if (
    副机制1原值 &&
    副机制2原值 &&
    !是否机制待生成文本_V1(副机制1原值) &&
    !是否机制待生成文本_V1(副机制2原值) &&
    副机制1原值 === 副机制2原值
  ) {
    记录机制决策回填失败_V1('副机制1/副机制2', [副机制1原值, 副机制2原值], '副机制1与副机制2重复');
    return false;
  }
  const 副作用原值 = String(机制选择.副作用类型 || '').trim();
  if (副作用原值 && !是否机制待生成文本_V1(副作用原值) && !技能副作用类型候选_V1.includes(副作用原值)) {
    记录机制决策回填失败_V1('副作用类型', 副作用原值, '不在副作用候选内');
    return false;
  }
  const 多方向原值 = String(机制选择.是否多方向 || '').trim();
  if (多方向原值 && !是否机制待生成文本_V1(多方向原值) && !['是', '否'].includes(多方向原值)) {
    记录机制决策回填失败_V1('是否多方向', 多方向原值, '只能填写“是”或“否”');
    return false;
  }
  const 多方向类型原值 = String(机制选择.多方向类型 || '').trim();
  if (多方向类型原值 && !是否机制待生成文本_V1(多方向类型原值) && !技能多方向类型候选_V1.includes(多方向类型原值)) {
    记录机制决策回填失败_V1('多方向类型', 多方向类型原值, '不在多方向类型候选内');
    return false;
  }
  if (多方向原值 === '否' && 多方向类型原值 && 多方向类型原值 !== '无' && !是否机制待生成文本_V1(多方向类型原值)) {
    记录机制决策回填失败_V1('多方向类型', 多方向类型原值, '是否多方向=否时，多方向类型只能为“无”');
    return false;
  }
  if (多方向原值 === '是' && 多方向类型原值 === '无') {
    记录机制决策回填失败_V1('多方向类型', 多方向类型原值, '是否多方向=是时，多方向类型不能为“无”');
    return false;
  }
  const 主机制命中 = 提取机制限选命中值_V1(机制选择.主机制, 候选池.主机制候选);
  const 主机制原型 = String(主机制命中[0] || '').trim();
  if (!主机制原型) {
    记录机制决策回填失败_V1('主机制', 主机制原值 || '空值', '未选择有效主机制');
    return false;
  }
  let 主机制大类 = findMainMechanicGroupByArchetype(主机制原型);
  if (!主机制大类) {
    主机制大类 = Object.keys(SKILL_SECONDARY_BY_MAIN_V1 || {}).find(key =>
      Array.isArray(SKILL_SECONDARY_BY_MAIN_V1[key]) && SKILL_SECONDARY_BY_MAIN_V1[key].includes(主机制原型),
    ) || '';
  }
  if (!主机制大类) {
    记录机制决策回填失败_V1('主机制', 主机制原型, '未能映射主机制大类');
    return false;
  }

  const 副机制1命中 = 提取机制限选命中值_V1(机制选择.副机制1, 候选池.副机制候选);
  const 副机制2命中 = 提取机制限选命中值_V1(机制选择.副机制2, 候选池.副机制候选);
  const 副机制命中 = 规范化机制枚举数组_V1([...副机制1命中, ...副机制2命中]);
  const 变异机制命中 = 提取机制限选命中值_V1(机制选择.变异机制, SKILL_MUTATION_MECHANIC_TYPES_V1, {
    allowMultiple: true,
  });
  const 副作用命中 = 提取机制限选命中值_V1(机制选择.副作用类型, 技能副作用类型候选_V1);
  const 多方向命中 = 提取机制限选命中值_V1(机制选择.是否多方向, ['是', '否']);
  const 是否多方向 = String(多方向命中[0] || '').trim();
  const 多方向类型命中 = 提取机制限选命中值_V1(机制选择.多方向类型, 技能多方向类型候选_V1);
  const 多方向类型 = String(多方向类型命中[0] || '').trim();
  const 系别 = String(context?.type || '强攻系').trim() || '强攻系';
  const 天赋层级 = String(context?.talentTier || '正常').trim() || '正常';
  const 魂环年限 = Math.max(100, Number(context?.age || 1000));
  const 魂环位 = Math.max(1, Number(context?.ringIndex || 1));
  const 契合度 = Math.max(0, Math.min(100, Number(context?.compatibility || 100)));
  const 来源品质 = String(context?.sourceQuality || context?.来源品质 || '').trim();
  const 来源类别 = String(context?.sourceCategory || context?.技能来源 || '魂技').trim() || '魂技';
  const 释放形态候选 = 规范化机制枚举数组_V1(SKILL_DELIVERY_FORM_BY_TYPE_V1[系别] || ['直接生效']);
  if (系别 === '食物系' && !释放形态候选.includes('造物承载')) 释放形态候选.push('造物承载');
  const 生成结果 = autoGenerateSkill(
    系别,
    天赋层级,
    魂环年限,
    魂环位,
    契合度,
    副机制命中,
    Number(context?.currentTick || 0),
    {
      passiveMode: context?.passiveMode === true,
      passiveName: String(context?.passiveName || skill?.魂技名 || '').trim(),
      sourceCategory: 来源类别,
      sourceQuality: 来源品质,
      textContext: context?.textContext || {},
      martialSoulName: String(context?.martialSoulName || context?.textContext?.martialSoulName || '').trim(),
      当前魂环数量: Math.max(1, Math.floor(Number(context?.当前魂环数量 || context?.ringCount || 1))),
      elementProfile: context?.elementProfile || null,
      unlockedAttributes: Array.isArray(context?.unlockedAttributes) ? context.unlockedAttributes : [],
      attributeCapacity: Array.isArray(context?.attributeCapacity) ? context.attributeCapacity : [],
      elementTrigger: String(context?.elementTrigger || '').trim(),
      blueprintOverride: {
        主机制大类,
        主机制原型,
        副机制: 副机制命中,
        变异机制: 变异机制命中,
        是否多方向,
        多方向类型,
        释放形态: 释放形态候选[0] || '直接生效',
      },
    },
  );
  const 效果数组 = Array.isArray(生成结果?._效果数组) ? clonePackedSkillEffects(生成结果._效果数组) : [];
  if (!效果数组.length) return false;
  const 副作用条目 = 构建副作用条目_V1(副作用命中[0] || '', { 主机制原型 });
  if (副作用条目) {
    const 系统基础效果 = 效果数组.find(effect => String(effect?.机制 || '').trim() === '系统基础');
    if (系统基础效果 && typeof 系统基础效果 === 'object') {
      const 副作用列表 = normalizeSkillSideEffectList(系统基础效果.副作用列表 || []);
      副作用列表.push(副作用条目);
      系统基础效果.副作用列表 = 副作用列表;
    }
  }
  const 对象差异规则 = 解析技能机制决策对象差异规则_V1(决策数据);
  if (对象差异规则.length > 0) {
    const 首个效果 = 效果数组.find(effect => String(effect?.机制 || '').trim() !== '系统基础');
    if (首个效果 && typeof 首个效果 === 'object') {
      首个效果.对象差异规则 = 收口执行对象差异规则列表_V1(对象差异规则);
    }
  }
  skill._效果数组 = clonePackedSkillEffects(效果数组);
  const currentName = String(skill?.魂技名 || '').trim();
  if (!currentName || isSkillTodoText(currentName)) skill.魂技名 = buildSkillNameTodoText(context?.textContext || context);
  if (!String(skill?.画面描述 || '').trim() || isSkillTodoText(skill?.画面描述)) skill.画面描述 = AI_TODO_SKILL_VISUAL;
  if (!String(skill?.效果描述 || '').trim() || isSkillTodoText(skill?.效果描述)) skill.效果描述 = AI_TODO_SKILL_EFFECT;
  delete skill[技能机制决策临时字段_V1];
  return true;
}

function 尝试按机制决策回填技能效果数组_V1(skill = {}, context = {}) {
  if (!skill || typeof skill !== 'object') return false;
  const 已有机制决策临时 =
    skill?.[技能机制决策临时字段_V1] &&
    typeof skill[技能机制决策临时字段_V1] === 'object' &&
    !Array.isArray(skill[技能机制决策临时字段_V1]);
  const 允许注入机制决策临时 = context?.允许注入机制决策临时 === true;
  if (!已有机制决策临时) {
    if (!允许注入机制决策临时) return false;
    skill[技能机制决策临时字段_V1] = 构建技能机制决策临时数据_V1(skill, context);
  }
  return 按候选方案回填技能效果数组_V1(skill, context);
}

function 直接自动生成技能结构_V1(skill = {}, context = {}) {
  if (!skill || typeof skill !== 'object') return false;
  const 系别 = String(context?.type || '强攻系').trim() || '强攻系';
  const 天赋层级 = String(context?.talentTier || '正常').trim() || '正常';
  const 魂环年限 = Math.max(100, Number(context?.age || 1000));
  const 魂环位 = Math.max(1, Number(context?.ringIndex || 1));
  const 契合度 = Math.max(0, Math.min(100, Number(context?.compatibility || 100)));
  const 偏好副机制 = Array.isArray(context?.preferredSecondary) ? context.preferredSecondary : [];
  const 当前tick = Number(context?.currentTick || 0);
  const 生成结果 = context?.forceTrueBody === true
    ? buildSeventhRingTrueBodySkill(
        系别,
        天赋层级,
        魂环年限,
        魂环位,
        契合度,
        context?.textContext || {},
        String(context?.sourceQuality || '').trim(),
      )
    : autoGenerateSkill(系别, 天赋层级, 魂环年限, 魂环位, 契合度, 偏好副机制, 当前tick, {
        passiveMode: context?.passiveMode === true,
        passiveName: String(context?.passiveName || skill?.魂技名 || '').trim(),
        sourceCategory: String(context?.sourceCategory || context?.技能来源 || '魂技').trim() || '魂技',
        sourceQuality: String(context?.sourceQuality || context?.来源品质 || '').trim(),
        textContext: context?.textContext || {},
        martialSoulName: String(context?.martialSoulName || context?.textContext?.martialSoulName || '').trim(),
        当前魂环数量: Math.max(1, Math.floor(Number(context?.当前魂环数量 || context?.ringCount || 1))),
        elementProfile: context?.elementProfile || null,
        unlockedAttributes: Array.isArray(context?.unlockedAttributes) ? context.unlockedAttributes : [],
        attributeCapacity: Array.isArray(context?.attributeCapacity) ? context.attributeCapacity : [],
        elementTrigger: String(context?.elementTrigger || '').trim(),
      });
  const 效果数组 = Array.isArray(生成结果?._效果数组) ? clonePackedSkillEffects(生成结果._效果数组) : [];
  if (!效果数组.length) return false;

  skill._效果数组 = clonePackedSkillEffects(效果数组);
  ['技能来源', '技能类型', '目标模型', '结算策略', '消耗', 'cast_time'].forEach(字段名 => {
    if (生成结果 && 生成结果[字段名] !== undefined) skill[字段名] = cloneJsonValue(生成结果[字段名], 生成结果[字段名]);
  });
  if (!Array.isArray(skill.附带属性)) skill.附带属性 = [];
  delete skill[技能机制决策临时字段_V1];
  applySkillElementInheritance(skill, context);
  syncConstructSkillMetadata(skill);
  return skill;
}

function ensureSkillStructGenerated(skill, context = {}) {
  if (!skill || typeof skill !== 'object') return skill;
  if (!Array.isArray(skill._效果数组)) skill._效果数组 = [];
  if (typeof skill.魂技名 !== 'string' || !skill.魂技名.trim() || isSkillTodoText(skill.魂技名)) {
    skill.魂技名 = buildSkillNameTodoText(context?.textContext || context);
  }
  let hasPackedEffects = Array.isArray(skill._效果数组) && skill._效果数组.length > 0;
  if (hasPackedEffects && skill?.[技能机制决策临时字段_V1] && typeof skill[技能机制决策临时字段_V1] === 'object') {
    delete skill[技能机制决策临时字段_V1];
  }
  if (!hasPackedEffects && 尝试按机制决策回填技能效果数组_V1(skill, context)) {
    hasPackedEffects = Array.isArray(skill._效果数组) && skill._效果数组.length > 0;
  }

  if (!hasPackedEffects) {
    if (typeof skill.画面描述 !== 'string' || !skill.画面描述.trim() || isSkillTodoText(skill.画面描述))
      skill.画面描述 = AI_TODO_SKILL_VISUAL_STAGE1;
    if (typeof skill.效果描述 !== 'string' || !skill.效果描述.trim() || isSkillTodoText(skill.效果描述))
      skill.效果描述 = SKILL_TEXT_UNKNOWN;
  } else {
    if (typeof skill.画面描述 !== 'string' || !skill.画面描述.trim() || isSkillTodoText(skill.画面描述))
      skill.画面描述 = AI_TODO_SKILL_VISUAL;
    if (typeof skill.效果描述 !== 'string' || !skill.效果描述.trim() || isSkillTodoText(skill.效果描述))
      skill.效果描述 = AI_TODO_SKILL_EFFECT;
  }

  if (typeof skill.魂技名 !== 'string' || !skill.魂技名.trim() || isSkillTodoText(skill.魂技名)) {
    skill.魂技名 = buildSkillNameTodoText(context?.textContext || context);
  }

  applySkillElementInheritance(skill, context);
  if (!Array.isArray(skill._效果数组) || skill._效果数组.length === 0) return skill;
  if (skill.画面描述 === SKILL_TEXT_UNKNOWN) skill.画面描述 = AI_TODO_SKILL_VISUAL;
  if (skill.效果描述 === SKILL_TEXT_UNKNOWN) skill.效果描述 = AI_TODO_SKILL_EFFECT;
  syncConstructSkillMetadata(skill);
  return hydrateSkillTextByPackedEffects(skill, context.textContext || {});
}

function ensureSkillMapGenerated(skillMap, contextFactory = () => ({})) {
  _(skillMap || {}).forEach((skill, skillName) => {
    if (
      skill &&
      typeof skill === 'object' &&
      (!skill.魂技名 || !String(skill.魂技名).trim()) &&
      skillName &&
      !/^第\d+魂技$/.test(String(skillName).trim())
    ) {
      skill.魂技名 = String(skillName);
    }
    const 技能上下文 = contextFactory(skill, skillName) || {};
    if (!技能上下文.技能键) 技能上下文.技能键 = String(skillName || '').trim();
    ensureSkillStructGenerated(skill, 技能上下文);
  });
  return skillMap || {};
}

function 初始化补齐角色技能效果数组_V1(rootData = {}) {
  const 角色集 = rootData && rootData.char && typeof rootData.char === 'object' ? rootData.char : {};
  const 补齐技能 = (skill, context = {}) => {
    if (!skill || typeof skill !== 'object') return;
    if (Array.isArray(skill._效果数组) && skill._效果数组.length > 0) return;
    直接自动生成技能结构_V1(skill, context || {});
  };
  const 补齐技能映射 = (skillMap = {}, contextFactory = () => ({})) => {
    _(skillMap || {}).forEach((skill, skillName) => {
      if (!skill || typeof skill !== 'object') return;
      const 技能上下文 = contextFactory(skill, skillName) || {};
      if (!技能上下文.技能键) 技能上下文.技能键 = String(skillName || '').trim();
      补齐技能(skill, 技能上下文);
    });
  };

  _(角色集 || {}).forEach((char, charName) => {
    if (!char || typeof char !== 'object') return;
    const 通用技能年限 = Math.max(1000, Number(char?.属性?.等级 || 1) * 200);
    const 系别 = char?.属性?.系别 || '强攻系';
    const 天赋梯队 = char?.属性?.天赋梯队 || '正常';

    _(char.武魂 || {}).forEach((spiritData, spiritKey) => {
      if (!spiritData || typeof spiritData !== 'object') return;
      const 武魂属性状态 = normalizeSpiritAttributeState(spiritData, spiritKey, char);
      const 武魂元素画像 = buildElementProfileFromAttributeState(武魂属性状态);
      _(spiritData?.魂灵 || {}).forEach(武魂 => {
        if (!武魂 || typeof 武魂 !== 'object') return;
        const 来源品质 =
          normalizeSoulSpiritQuality(武魂?.品质 || '') ||
          inferSoulSpiritQuality(武魂) ||
          normalizeSoulSpiritQuality(spiritData?.品质 || '') ||
          inferSoulSpiritQuality(spiritData) ||
          '';
        _(武魂.魂环 || {}).forEach((ring, ringIndexStr) => {
          const 魂环位 = parseInt(ringIndexStr) || 1;
          const 当前魂环数量 = 计算武魂当前魂环数量_V1(spiritData);
          const 武魂名称 = String(spiritData?.表象名称 || spiritKey || '').trim();
          补齐技能映射(ring?.魂技, (_, skillName) => ({
            type: 系别,
            talentTier: 天赋梯队,
            age: ring?.年限,
            ringIndex: 魂环位,
            当前魂环数量,
            martialSoulName: 武魂名称,
            compatibility: 武魂.契合度 || 100,
            sourceQuality: 来源品质,
            preferredSecondary: [],
            elementProfile: 武魂元素画像,
            unlockedAttributes: 武魂属性状态.已解锁属性,
            attributeCapacity: 武魂属性状态.可容纳属性,
            elementTrigger: '继承武魂',
            sourceCategory: '魂技',
            forceTrueBody: 魂环位 === 7,
            textContext: {
              spiritName:
                !isAiTodoText(武魂.表象名称) && 武魂.表象名称 !== '未展露'
                  ? 武魂.表象名称
                  : spiritData?.表象名称 || skillName,
              type: 系别,
              spiritDesc: String(武魂?.描述 || '').trim(),
              martialSoulName: 武魂名称,
              ringSource: String(ring?.来源 || '').trim(),
            },
          }));
        });
      });

      _(spiritData?.独立魂环 || {}).forEach((ring, ringIndexStr) => {
        const 魂环位 = parseInt(ringIndexStr) || 1;
        const 当前魂环数量 = 计算武魂当前魂环数量_V1(spiritData);
        const 武魂名称 = String(spiritData?.表象名称 || spiritKey || '').trim();
        const 来源品质 =
          normalizeSoulSpiritQuality(spiritData?.品质 || '') ||
          inferSoulSpiritQuality(spiritData) ||
          '';
        补齐技能映射(ring?.魂技, (_, skillName) => ({
          type: 系别,
          talentTier: 天赋梯队,
          age: ring?.年限,
          ringIndex: 魂环位,
          当前魂环数量,
          martialSoulName: 武魂名称,
          compatibility: 100,
          sourceQuality: 来源品质,
          preferredSecondary: [],
          elementProfile: 武魂元素画像,
          unlockedAttributes: 武魂属性状态.已解锁属性,
          attributeCapacity: 武魂属性状态.可容纳属性,
          elementTrigger: '继承武魂',
          sourceCategory: '魂技',
          forceTrueBody: 魂环位 === 7,
          textContext: {
            spiritName: spiritData?.表象名称 || skillName,
            type: 系别,
            spiritDesc: String(spiritData?.描述 || '').trim(),
            martialSoulName: 武魂名称,
            ringSource: String(ring?.来源 || '').trim(),
          },
        }));
      });
    });

    _(char.魂骨 || {}).forEach((bone, bonePart) => {
      补齐技能映射(bone?.附带技能, (_, skillName) => ({
        type: 系别,
        talentTier: 天赋梯队,
        age: bone?.年限 || bone?.age || 通用技能年限,
        ringIndex: 1,
        compatibility: 100,
        preferredSecondary: getBonePreferredSecondary(bonePart),
        textContext: {
          spiritName: bone?.名称 || bonePart || skillName,
          type: 系别,
        },
      }));
    });

    const 自创属性状态 = buildCharacterCustomSkillAttributeState(char);
    const 自创元素画像 = buildElementProfileFromAttributeState(自创属性状态);
    补齐技能映射(char.自创魂技, (_, skillName) => ({
      type: 系别,
      talentTier: 天赋梯队,
      age: Math.max(1000, 通用技能年限),
      ringIndex: Math.max(1, Math.ceil(Number(char?.属性?.等级 || 1) / 10)),
      compatibility: 100,
      preferredSecondary: [],
      elementProfile: 自创元素画像,
      unlockedAttributes: 自创属性状态.已解锁属性,
      attributeCapacity: 自创属性状态.可容纳属性,
      elementTrigger: '自创',
      sourceCategory: '自创魂技',
      textContext: {
        spiritName: skillName,
        type: 系别,
      },
    }));

    补齐技能映射(char.血脉之力?.被动, (_, skillName) => ({
      type: 系别,
      talentTier: 天赋梯队,
      age: Math.max(10000, 通用技能年限),
      ringIndex: Math.max(1, Number(char.血脉之力?.解封层数 || 1)),
      compatibility: 100,
      passiveMode: true,
      passiveName: skillName,
      preferredSecondary: [],
      elementTrigger: '继承血脉',
      textContext: {
        spiritName: char.血脉之力?.血脉 || skillName,
        type: 系别,
      },
    }));

    补齐技能映射(char.血脉之力?.技能, (_, skillName) => ({
      type: 系别,
      talentTier: 天赋梯队,
      age: Math.max(10000, 通用技能年限),
      ringIndex: Math.max(1, Number(char.血脉之力?.解封层数 || 1)),
      compatibility: 100,
      preferredSecondary: [],
      elementTrigger: '继承血脉',
      textContext: {
        spiritName: char.血脉之力?.血脉 || skillName,
        type: 系别,
      },
    }));

    _(char.血脉之力?.气血魂环 || {}).forEach((ringData, ringIndexStr) => {
      const 魂环位 = parseInt(ringIndexStr) || 1;
      补齐技能映射(ringData?.魂技, (_, skillName) => ({
        type: 系别,
        talentTier: 天赋梯队,
        age: Math.max(1000, 魂环位 * 5000),
        ringIndex: 魂环位,
        compatibility: 100,
        preferredSecondary: [],
        elementTrigger: '继承血脉',
        textContext: {
          spiritName: char.血脉之力?.血脉 || skillName,
          type: 系别,
        },
      }));
    });

    _(char.武魂融合技 || {}).forEach((fusionData, fusionName) => {
      if (!fusionData || typeof fusionData !== 'object') return;
      const 融合元素画像 = getFusionSkillElementProfile(fusionData, char);
      补齐技能(fusionData?.技能数据, {
        type: 系别,
        talentTier: 天赋梯队,
        age: Math.max(10000, 通用技能年限),
        ringIndex: Math.max(1, Math.ceil(Number(char?.属性?.等级 || 1) / 10)),
        compatibility: 100,
        preferredSecondary: [],
        elementProfile: 融合元素画像,
        unlockedAttributes: 融合元素画像?.elements || [],
        attributeCapacity: 融合元素画像?.elements || [],
        elementTrigger: '融合',
        sourceCategory: '武魂融合技',
        textContext: {
          spiritName: fusionName,
          type: 系别,
        },
      });
    });
  });
  return rootData;
}

const TANGMEN_SECRET_SKILL_TEMPLATES = {
  玄天功: {
    画面描述: '玄天功内息沿经脉周天往复，魂力在循环中不断被压缩提纯，整个人的气机因此愈发绵长稳固。',
    效果描述: '被动：持续稳固自身魂力运转，小幅提升魂力上限与回复效率，并让输出更凝练稳定。',
    _效果数组: [
      { 机制: '系统基础', 消耗: '无', 对象: '自身', 技能类型: '被动/内功', cast_time: 0 },
      { 机制: '属性变化', 对象: '自身', 属性: 'sp_max', 动作: '倍率提升', 数值: 1.08, 持续: 999, 触发: '常驻' },
      { 机制: '持续恢复', 对象: '自身', 属性: 'sp', 动作: '持续恢复', 数值: 0.1, 持续: 999, 触发: '每回合' },
      { 机制: '属性变化', 对象: '自身', 属性: '威力', 动作: '倍率提升', 数值: 1.05, 持续: 999, 触发: '常驻' },
    ],
  },
  紫极魔瞳: {
    画面描述: '双瞳浮现幽紫光泽，视线仿佛能穿透雾障与魂力扰动，敌人的动作轨迹在眼底被提前拆解。',
    效果描述: '被动：持续强化精神洞察、动态视觉与锁定能力，小幅提升命中、反应与精神相关判定表现。',
    _效果数组: [
      { 机制: '系统基础', 消耗: '无', 对象: '自身', 技能类型: '被动/瞳术', cast_time: 0 },
      {
        机制: '状态挂载',
        状态名称: '紫极魔瞳',
        持续回合: 999,
        计算层效果: { hit_bonus: 0.12, reaction_bonus: 0.12, lock_level: 1, control_success_bonus: 0.08 },
      },
    ],
  },
  暗器百解: {
    画面描述: '无数暗器轨迹与发力角度在脑海中被迅速拆解重组，每一次出手都更接近教科书般的精准与狠辣。',
    效果描述: '被动：精通暗器发力与手法，小幅提升命中、穿透与打断能力；若以暗器为媒介发招，往往更难被正面化解。',
    _效果数组: [
      { 机制: '系统基础', 消耗: '无', 对象: '自身', 技能类型: '被动/技巧', cast_time: 0 },
      {
        机制: '状态挂载',
        状态名称: '暗器百解',
        持续回合: 999,
        计算层效果: { hit_bonus: 0.1, armor_pen: 0.15, interrupt_bonus: 0.1, final_damage_mult: 1.05 },
      },
    ],
  },
};

const WealthSchema = z
  .object({
    联邦币: z.coerce.number().prefault(0).describe('联邦币'),
    星罗币: z.coerce.number().prefault(0).describe('星罗币'),
    唐门积分: z.coerce.number().prefault(0).describe('唐门积分'),
    学院积分: z.coerce.number().prefault(0).describe('史莱克徽章/积分'),
    战功: z.coerce.number().prefault(0).describe('血神军团功勋'),
  })
  .prefault({});
  const BodyPartSchema = z
  .object({
    外观特征: z.string().prefault('待补全(请描写该部位的静态外观与天生敏感特征，如：粉嫩/修长/天生敏感)'),
    敏感度加成: z.coerce.number().prefault(0),
    开发度: z.coerce.number().prefault(0).describe('该部位的独立开发度(0-100)'),
    状态描述: z.string().prefault('正常').describe('当前动态状态，日常请保持"正常"'),
    体液残留: z.string().prefault('无'),
  })
  .prefault({});
const AppearanceSchema = z
  .object({
    发色: z.string().prefault('待补全(根据角色外貌补全发色)'),
    发型: z.string().prefault('待补全(根据角色发质与气质补全发型)'),
    瞳色: z.string().prefault('待补全(根据角色外貌补全瞳色)'),
    身高: z.string().prefault('待补全(根据角色设定补全身高)'),
    体型: z.string().prefault('待补全(根据角色体态补全体型)'),
    长相描述: z.string().prefault('待补全(根据角色面部特征补全长相描述)'),
    特殊特征: z
      .array(z.string())
      .prefault([])
      .describe('角色的独特之处，如伤疤、胎记、特殊神态等'),
  })
  .prefault({
    发色: '待补全(根据角色外貌补全发色)',
    发型: '待补全(根据角色发质与气质补全发型)',
    瞳色: '待补全(根据角色外貌补全瞳色)',
    身高: '待补全(根据角色设定补全身高)',
    体型: '待补全(根据角色体态补全体型)',
    长相描述: '待补全(根据角色面部特征补全长相描述)',
    特殊特征: [],
  });

const ClothingSchema = z
  .object({
    衣柜: z
      .record(
        z.string().describe('套装名称'),
        z
          .object({
            上装: z.string().prefault('待补全(根据当前套装补全上装)'),
            下装: z.string().prefault('待补全(根据当前套装补全下装)'),
            鞋子: z.string().prefault('待补全(根据当前套装补全鞋子)'),
            描述: z.string().prefault('待补全(根据套装整体补全服装描述)'),
          })
          .prefault({}),
      )
      .prefault({})
      .describe('衣柜，存放所有可换的套装'),
    着装: z.string().prefault('待补全(从衣柜中选择当前套装名)').describe('当前着装，值为衣柜里某一套的名称'),
  })
  .prefault({ 着装: '待补全(从衣柜中选择当前套装名)' });
const EquipmentSchema = z
  .object({
    武器: z
      .object({
        名称: z.string().prefault('无'),
        品阶: z.string().prefault('无').describe('品阶如: 魂导器/神器/超神器'),
        特性: z
          .record(z.string(), z.object({ 描述: z.string().prefault('无') }).prefault({}))
          .prefault({})
          .describe('附带的绝对特性，如:无视防御/吞噬/绝对禁锢'),
        属性加成: z
          .object({
            魂力上限: z.coerce.number().prefault(0),
            精神力上限: z.coerce.number().prefault(0),
            力量: z.coerce.number().prefault(0),
            防御: z.coerce.number().prefault(0),
            敏捷: z.coerce.number().prefault(0),
            体力上限: z.coerce.number().prefault(0),
          })
          .prefault({}),
      })
      .prefault({}),
    斗铠: z
      .object({
        等级: z.coerce.number().prefault(0),
        名称: z.string().prefault('无'),
        领域: z.string().prefault('无'),
        材质: z.string().prefault('无').describe('锻造金属材质'),
        装备状态: z.string().prefault('未装备'),
        部件: z
          .record(
            z.string(),
            z
              .object({
                状态: z.string().prefault('未打造'),
                品质系数: z.coerce.number().prefault(1.0),
              })
              .prefault({}),
          )
          .prefault({}),
        _属性加成: z
          .object({
            等效等级: z.coerce.number().prefault(0),
            魂力上限: z.coerce.number().prefault(0),
            精神力上限: z.coerce.number().prefault(0),
            力量: z.coerce.number().prefault(0),
            防御: z.coerce.number().prefault(0),
            敏捷: z.coerce.number().prefault(0),
            体力上限: z.coerce.number().prefault(0),
          })
          .prefault({}),
        _已排异: z.boolean().prefault(false),
      })
      .prefault({}),
    机甲: z
      .object({
        等级: z.string().prefault('无'),
        型号: z.string().prefault('无'),
        材质: z.string().prefault('无').describe('机甲金属材质'),
        状态: z.string().prefault('完好'),
        装备状态: z.string().prefault('未装备'),
        武装: z.string().prefault('无'),
        品质系数: z.coerce.number().prefault(1.0).describe('0.8为劣质，1.0为标准，1.5以上为极品，最高可达2.0'),
        _属性加成: z
          .object({
            魂力上限: z.coerce.number().prefault(0),
            精神力上限: z.coerce.number().prefault(0),
            力量: z.coerce.number().prefault(0),
            防御: z.coerce.number().prefault(0),
            敏捷: z.coerce.number().prefault(0),
            体力上限: z.coerce.number().prefault(0),
          })
          .prefault({}),
      })
      .prefault({}),
  })
  .prefault({})
  .transform(装备 => {
    if (装备.斗铠.等级 > 0) {
      let totalQuality = 0,
        count = 0;
      let maxQ = -Infinity,
        minQ = Infinity;

      _(装备.斗铠.部件).forEach(p => {
        if (p.状态 !== '未打造' && p.状态 !== '重创') {
          totalQuality += p.品质系数;
          count++;
          if (p.品质系数 > maxQ) maxQ = p.品质系数;
          if (p.品质系数 < minQ) minQ = p.品质系数;
        }
      });

      if (count > 0) {
        let avgQ = totalQuality / count;
        let base = ArmorBaseStats[装备.斗铠.等级] || ArmorBaseStats[1];
        let mult = count === 10 ? avgQ : 0.05 * avgQ * count;

        function getQualityTier(q) {
          if (q < 1.0) return 0;
          if (q <= 1.2) return 1;
          if (q <= 1.5) return 2;
          if (q <= 1.8) return 3;
          return 4;
        }
        装备.斗铠._已排异 = false;
        if (count > 1 && getQualityTier(maxQ) !== getQualityTier(minQ)) {
          mult *= 0.2;
          装备.斗铠._已排异 = true;
        }

        装备.斗铠._属性加成.魂力上限 = Math.floor(base.sp_max * mult);
        装备.斗铠._属性加成.精神力上限 = Math.floor(base.men_max * mult);
        装备.斗铠._属性加成.力量 = Math.floor(base.str * mult);
        装备.斗铠._属性加成.敏捷 = Math.floor(base.agi * mult);
        装备.斗铠._属性加成.体力上限 = Math.floor(base.vit_max * mult);
        装备.斗铠._属性加成.防御 = Math.floor(base.str * mult);
      } else {
        装备.斗铠._属性加成 = { 等效等级: 0, 魂力上限: 0, 精神力上限: 0, 力量: 0, 防御: 0, 敏捷: 0, 体力上限: 0 };
      }
    } else {
      装备.斗铠._属性加成 = { 等效等级: 0, 魂力上限: 0, 精神力上限: 0, 力量: 0, 防御: 0, 敏捷: 0, 体力上限: 0 };
    }

    if (装备.机甲.等级 !== '无' && 装备.机甲.状态 !== '重创') {
      let base = MechBaseStats[装备.机甲.等级];
      if (base) {
        let mult = 装备.机甲.品质系数 || 1.0;
        装备.机甲._属性加成.魂力上限 = Math.floor(base.sp_max * mult);
        装备.机甲._属性加成.精神力上限 = Math.floor(base.men_max * mult);
        装备.机甲._属性加成.力量 = Math.floor(base.str * mult);
        装备.机甲._属性加成.敏捷 = Math.floor(base.agi * mult);
        装备.机甲._属性加成.体力上限 = Math.floor(base.vit_max * mult);
        装备.机甲._属性加成.防御 = Math.floor(base.str * mult);
      }
    } else {
      装备.机甲._属性加成 = { 魂力上限: 0, 精神力上限: 0, 力量: 0, 防御: 0, 敏捷: 0, 体力上限: 0 };
    }

    return 装备;
  });
const SkillStructSchema = z
  .object({
    魂技名: z.string().prefault(AI_TODO_SKILL_NAME),
    画面描述: z.string().prefault(AI_TODO_SKILL_VISUAL),
    效果描述: z.string().prefault(AI_TODO_SKILL_EFFECT),
    附带属性: z.array(z.string()).prefault([]),
    _效果数组: z.array(z.any()).prefault([]).describe('打包后的_效果数组，供前端显示和后续战斗模块解析'),
    机制决策临时: (() => {
      const 枚举回退 = (候选列表 = [], 回退值 = '待补全') => {
        const 候选项 = 规范化机制枚举数组_V1(候选列表);
        return 候选项.length ? 候选项 : [回退值];
      };
      const 机制候选池 = 构建技能机制候选池_V1();
      const 主机制枚举 = 枚举回退(机制候选池.主机制候选, '待补全');
      const 副机制枚举 = 枚举回退(机制候选池.副机制候选, '待补全');
      const 变异机制枚举 = 枚举回退(SKILL_MUTATION_MECHANIC_TYPES_V1, '无');
      const 副作用枚举 = 枚举回退(技能副作用类型候选_V1, '无');
      const 多方向类型枚举 = 枚举回退(技能多方向类型候选_V1, '无');
      const 对象差异条件枚举 = 枚举回退(技能对象差异规则条件候选_V1, '自身');
      const 对象差异处理枚举 = 枚举回退(技能对象差异规则处理候选_V1, '覆盖');
      const 主机制待生成提示词 = 构建机制待生成提示词_V1('主机制', 主机制枚举);
      const 副机制1待生成提示词 = 构建机制待生成提示词_V1('副机制1', 副机制枚举, '若出现副机制则先填写副机制1');
      const 副机制2待生成提示词 = 构建机制待生成提示词_V1('副机制2', 副机制枚举, '仅在脚本要求2个副机制时填写，且不能与副机制1重复');
      const 副作用待生成提示词 = 构建机制待生成提示词_V1('副作用类型', 副作用枚举, '仅在脚本判定出现副作用时填写');
      const 多方向待生成提示词 = 构建多方向待生成提示词_V1();
      const 多方向类型待生成提示词 = 构建多方向类型待生成提示词_V1(多方向类型枚举);
      const 变异机制待生成提示词 = 构建变异机制待生成提示词_V1(变异机制枚举);
      const 对象差异规则待生成提示词 = 构建对象差异规则待生成提示词_V1(对象差异条件枚举, 对象差异处理枚举);

      const 对象差异规则临时字段 = z
        .object({
          填写提示词: z
            .union([z.literal('待补全'), z.literal(对象差异规则待生成提示词)])
            .prefault(对象差异规则待生成提示词),
          条目: z
            .array(
              z.object({
                条件: z.array(z.enum(对象差异条件枚举)).prefault([]),
                处理: z.enum(对象差异处理枚举).prefault(对象差异处理枚举[0] || '覆盖'),
                参数: z.record(z.string(), z.any()).prefault({}),
              }),
            )
            .prefault([]),
        })
        .prefault({});

      return z
        .object({
          机制选择: z
            .object({
              主机制: z.union([z.enum(主机制枚举), z.literal('待补全'), z.literal(主机制待生成提示词)]).prefault(主机制待生成提示词),
              副机制1: z.union([z.enum(副机制枚举), z.literal('待补全'), z.literal(副机制1待生成提示词)]).optional(),
              副机制2: z.union([z.enum(副机制枚举), z.literal('待补全'), z.literal(副机制2待生成提示词)]).optional(),
              变异机制: z
                .union([z.array(z.enum(变异机制枚举)), z.literal('待补全'), z.literal(变异机制待生成提示词)])
                .prefault(变异机制待生成提示词),
              副作用类型: z.union([z.enum(副作用枚举), z.literal('待补全'), z.literal(副作用待生成提示词)]).optional(),
              是否多方向: z.union([z.enum(['是', '否']), z.literal('待补全'), z.literal(多方向待生成提示词)]).prefault(多方向待生成提示词),
              多方向类型: z.union([z.enum(多方向类型枚举), z.literal('待补全'), z.literal(多方向类型待生成提示词)]).prefault(多方向类型待生成提示词),
            })
            .prefault({}),
          对象差异规则: 对象差异规则临时字段,
        })
        .optional();
    })(),
  })
  .prefault({});
const SoulBoneSchema = z
  .record(
    z.string(),
    z
      .object({
        名称: z.string().prefault(''),
        表象名称: z.string().prefault('无'),
        年限: z.coerce.number().prefault(0),
        来源: z.string().prefault(''),
        状态: z.string().prefault('已装载'),
        状态: z.string().prefault('已装载'),
        品质: z.string().prefault('无'),
        品阶: z.string().prefault('无'),
        描述: z.string().prefault('无'),
        附带技能: z.record(z.string(), SkillStructSchema).prefault({}),
        属性加成: z
          .object({
            力量: z.coerce.number().prefault(0),
            防御: z.coerce.number().prefault(0),
            敏捷: z.coerce.number().prefault(0),
            体力上限: z.coerce.number().prefault(0),
            精神力上限: z.coerce.number().prefault(0),
            魂力上限: z.coerce.number().prefault(0),
          })
          .prefault({}),
      })
      .prefault({}),
  )
  .prefault({});
const AdditiveStatBonusSchema = z
  .object({
    力量: z.coerce.number().prefault(0),
    防御: z.coerce.number().prefault(0),
    敏捷: z.coerce.number().prefault(0),
    体力上限: z.coerce.number().prefault(0),
    精神力上限: z.coerce.number().prefault(0),
    魂力上限: z.coerce.number().prefault(0),
  })
  .prefault({});
const BloodlinePermanentBonusSchema = z
  .object({
    名称: z.string().prefault('无'),
    描述: z.string().prefault('无'),
    来源层级: z.coerce.number().prefault(0),
    状态: z.string().prefault('已固化'),
    效果描述: z.string().prefault('无'),
    属性加成: AdditiveStatBonusSchema,
  })
  .prefault({});
const BloodlinePowerSchema = z
  .object({
    血脉: z.string().prefault('无').describe('血脉名称'),
    解封层数: z.coerce.number().prefault(0).describe('血脉封印解除层数'),
    核心: z.string().prefault('未凝聚').describe('气血魂核状态'),
    生命之火: z.boolean().prefault(false).describe('生命之火状态'),
    技能: z.record(z.string(), SkillStructSchema).prefault({}).describe('血脉主动散技(无魂环)'),
    被动: z.record(z.string(), SkillStructSchema).prefault({}).describe('血脉被动特性'),
    永久加成: z
      .record(z.string(), BloodlinePermanentBonusSchema)
      .prefault({})
      .describe('血脉永久成长节点，按解封时当前属性固化为固定数值'),
    气血魂环: z
      .record(
        z.string(),
        z
          .object({
            颜色: z.string().prefault('无'),
            魂技: z.record(z.string(), SkillStructSchema).prefault({}),
          })
          .prefault({}),
      )
      .prefault({})
      .describe('气血魂环与附带魂技'),
  })
  .prefault({});
const StatsSchema = z
  .object({
    年龄: z.coerce.number().prefault(0).describe('年龄(出场必填)'),
    性别: z.string().prefault('待补全(填写性别：男/女)').describe('性别'),
    等级: z
      .any()
      .transform(val => {
        if (val === '准神') return 99.5;
        let num = Number(val);
        return isNaN(num) ? 1 : num;
      })
      .prefault(1),
    上次灵物等级: z.coerce.number().prefault(-20).describe('上次吸收灵物的等级'),
    等级惩罚: z.coerce.number().prefault(0).describe('违规吸收导致的等级上限永久扣除'),
    系别: z.string().prefault('强攻系').describe('魂师系别'),
    天赋梯队: z.string().prefault('正常').describe('天赋梯队'),
    天赋评级: z.union([z.coerce.number(), z.string()]).optional().describe('AI输出的1-100天赋评分，仅用于初始化天赋判定，判定后删除'),
    背景: z.string().prefault(AI_TODO_BACKGROUND).describe('家世或出身背景描述'),
    背景阶层: z.enum(['顶级势力', '一流势力', '普通势力', '平民']).optional().describe('用于初始天赋推演的背景阶层标签'),
    邪魂师: z.boolean().prefault(false).describe('是否为邪魂师'),
    底子波动: z.coerce.number().prefault(0).describe('先天底子波动值'),
    魂力: z.coerce.number().prefault(-1).describe('当前魂力'),
    魂力上限: z.coerce.number().prefault(10).describe('魂力上限'),
    基础魂力上限: z.coerce.number().prefault(10).describe('仅用于修为成长判定的基础魂力上限(等级基础值×系别倍率×底子波动，不含装备/魂环/状态等加成)'),
    突破魂力上限: z.coerce.number().prefault(10).describe('用于修为突破判定的非装备总魂力上限(包含魂环/魂骨/仙草等永久涨幅，不包含装备)'),
    永久魂力加成: z.coerce.number().prefault(0).describe('仙草/灵物等带来的永久魂力涨幅，不包含装备'),
    精神力: z.coerce.number().prefault(-1).describe('当前精神力'),
    精神力上限: z.coerce.number().prefault(10).describe('精神力上限'),
    精神境界: z.string().prefault('灵元境'),

    力量: z.coerce.number().prefault(10).describe('力量'),
    防御: z.coerce.number().prefault(10).describe('防御'),
    敏捷: z.coerce.number().prefault(10).describe('敏捷'),
    HP: z.coerce.number().prefault(-1).describe('当前生命值/伤势值'),
    HP上限: z.coerce.number().prefault(-1).describe('生命值上限'),
    体力: z.coerce.number().prefault(-1).describe('当前体力'),
    体力上限: z.coerce.number().prefault(10).describe('体力上限'),

    训练加成: z
      .object({
        力量: z.coerce.number().prefault(0),
        防御: z.coerce.number().prefault(0),
        敏捷: z.coerce.number().prefault(0),
        体力上限: z.coerce.number().prefault(0),
        精神力上限: z.coerce.number().prefault(0),
      })
      .prefault({}),

    状态效果: z
      .record(
        z.string(),
        z
          .object({
            类型: z.string().prefault('buff'),
            层数: z.coerce.number().prefault(1),
            描述: z.string().prefault('无'),
            持续回合: z.coerce.number().prefault(1).describe('剩余持续回合数，每回合结算阶段减1'),

            面板倍率: z
              .object({
                力量: z.coerce.number().prefault(1.0),
                防御: z.coerce.number().prefault(1.0),
                敏捷: z.coerce.number().prefault(1.0),
                魂力上限: z.coerce.number().prefault(1.0),
              })
              .prefault({}),

            战斗效果: z
              .object({
                持续伤害: z.coerce.number().prefault(0).describe('每回合结算阶段扣除的绝对体力值(如：撕裂/中毒)'),
                跳过回合: z.boolean().prefault(false).describe('是否强制跳过本回合宣告(如：眩晕/冰封/镇狱禁锢)'),
                破防比例: z.coerce.number().prefault(0).describe('攻击时无视目标防御的百分比(如：粉碎/破甲)'),
              })
              .prefault({}),
          })
          .prefault({}),
      )
      .prefault({}),
  })
  .prefault({})
  .transform(data => {
    data.训练加成 = createNumericStatBonusMap(data.训练加成);

    if (data.底子波动 === 0) {
      data.底子波动 = 0.95 + Math.random() * 0.1;
    }

    if (data.魂力 < 0) data.魂力 = Math.max(0, Number(data.魂力上限 || 10));
    if (data.精神力 < 0) data.精神力 = Math.max(0, Number(data.精神力上限 || 10));
    if (data.体力 < 0) data.体力 = Math.max(0, Number(data.体力上限 || 10));
    if (data.HP上限 < 0) data.HP上限 = Math.max(1, Number(data.体力上限 || 10));
    if (data.HP < 0) data.HP = Math.max(0, Math.min(Number(data.HP上限 || 1), Number(data.体力 || data.HP上限 || 1)));
    data.HP上限 = Math.max(1, Number(data.HP上限 || 1));
    data.HP = Math.max(0, Math.min(Number(data.HP || 0), data.HP上限));

    if (data.等级 > 10 && data.训练加成.力量 === 0 && data.训练加成.精神力上限 === 0) {
      const hardWorkFactor =
        { 绝世妖孽: 1.6, 顶级天才: 1.2, 天才: 1.0, 优秀: 0.8, 正常: 0.5, 劣等: 0.2, 天赋极差: 0 }[data.天赋梯队] || 0.5;
      const baseForTrace = getBaseStats(data.等级);
      const traceMultiplier = 0.005 * (data.等级 - 10) * hardWorkFactor;
      data.训练加成.力量 = Math.floor(baseForTrace.str * traceMultiplier);
      data.训练加成.防御 = Math.floor(baseForTrace.def * traceMultiplier);
      data.训练加成.敏捷 = Math.floor(baseForTrace.agi * traceMultiplier);
      data.训练加成.体力上限 = Math.floor(baseForTrace.vit_max * traceMultiplier);
      data.训练加成.精神力上限 = Math.floor(baseForTrace.men_max * traceMultiplier);
    }
    return data;
  });

const DYNAMIC_LOCATION_NODE_TYPE_VALUES = Object.freeze([
  '主城',
  '城市',
  '城镇',
  '村落',
  '聚落',
  '遗迹',
  '大型设施',
  '海外首都',
  '禁区',
  '学院总部',
  '势力分部',
  '据点',
  '街区',
  '设施',
  '店铺',
  '临时营地',
  '地标',
  '未知',
]);

function inferDynamicLocationNodeTypeByLevel(level = 4) {
  const normalizedLevel = Math.max(0, Math.floor(Number(level || 0)));
  if (normalizedLevel <= 2) return '城市';
  if (normalizedLevel === 3) return '大型设施';
  if (normalizedLevel === 4) return '设施';
  return '地标';
}

function normalizeDynamicLocationNodeType(value = '', level = 4, locName = '') {
  const text = String(value || '').trim();
  const nameText = String(locName || '').trim();
  const sampleText = `${text}/${nameText}`;
  if (DYNAMIC_LOCATION_NODE_TYPE_VALUES.includes(text)) return text;

  const aliasMap = {
    动态地点: inferDynamicLocationNodeTypeByLevel(level),
    宿舍: '设施',
    寝室: '设施',
    房间: '设施',
    教室: '设施',
    实验室: '设施',
    图书馆: '设施',
    食堂: '设施',
    店面: '店铺',
    商铺: '店铺',
    商店: '店铺',
    酒馆: '店铺',
    客栈: '店铺',
    旅馆: '店铺',
    街道: '街区',
    街巷: '街区',
    营地: '临时营地',
    帐篷: '临时营地',
    学院: '学院总部',
    分院: '大型设施',
    宿舍楼: '大型设施',
  };
  const alias = aliasMap[text] || aliasMap[nameText];
  if (alias) return alias;
  if (/宿舍|寝室|房间|教室|实验室|图书馆|食堂|训练室|办公室|休息室/.test(sampleText)) return '设施';
  if (/店|铺|酒馆|客栈|旅馆|商会|餐馆|餐厅|药房|摊位/.test(sampleText)) return '店铺';
  if (/街|巷|路|道|广场|步行街/.test(sampleText)) return '街区';
  if (/营地|帐篷|驻地/.test(sampleText)) return '临时营地';
  if (/学院|教学楼|研究所|斗魂场|高塔|塔楼|大殿|宫/.test(sampleText)) return '大型设施';
  if (/城|都/.test(sampleText) && Math.max(0, Number(level || 0)) <= 2) return '城市';
  return inferDynamicLocationNodeTypeByLevel(level);
}

function normalizeDynamicLocationTextList(value = []) {
  return Array.isArray(value)
    ? value.map(item => String(item || '').trim()).filter(Boolean)
    : [];
}

function buildCompactDynamicLocationDisplayPayload(dynData = {}) {
  const nextData = {
    归属父节点: dynData.归属父节点,
    层级: dynData.层级,
    描述: dynData.描述,
    x: dynData.x,
    y: dynData.y,
    节点类型: normalizeDynamicLocationNodeType(dynData.节点类型 || dynData.nodeKind, dynData.层级, dynData.描述),
  };

  const faction = String(dynData.势力 || '').trim();
  if (faction && faction !== '未知') nextData.势力 = faction;

  const importance = Number(dynData.重要度 ?? dynData.importance ?? 0);
  if (Number.isFinite(importance) && importance > 0) nextData.重要度 = importance;

  const status = String(dynData.状态 || dynData.state || '').trim();
  if (status && status !== 'intact') nextData.状态 = status;

  const nodeCategory = String(dynData.节点类别 || dynData.nodeKind || '').trim();
  if (nodeCategory) nextData.节点类别 = nodeCategory;

  const interactions = normalizeDynamicLocationTextList(dynData.交互 || dynData.interactions);
  if (interactions.length) nextData.交互 = interactions;

  const services = normalizeDynamicLocationTextList(dynData.服务 || dynData.services);
  if (services.length) nextData.服务 = services;

  return nextData;
}

function pruneDynamicLocationStorageFields(locData = {}) {
  if (!locData || typeof locData !== 'object' || Array.isArray(locData)) return locData;

  const mapId = String(locData.地图ID || '').trim();
  if (mapId && mapId !== '无' && mapId !== 'map_douluo_world') locData.地图ID = mapId;
  else delete locData.地图ID;

  const icon = String(locData.图标 || locData.icon || '').trim();
  if (icon && icon !== '无' && icon !== 'marker') locData.图标 = icon;
  else delete locData.图标;
  delete locData.icon;

  const settlementId = String(locData.所属城镇ID || '').trim();
  if (settlementId && settlementId !== '无') locData.所属城镇ID = settlementId;
  else delete locData.所属城镇ID;

  const faction = String(locData.势力 || '').trim();
  if (faction && faction !== '未知') locData.势力 = faction;
  else delete locData.势力;

  const importance = Number(locData.重要度 ?? locData.importance ?? 0);
  if (Number.isFinite(importance) && importance > 0) locData.重要度 = importance;
  else delete locData.重要度;
  delete locData.importance;

  const status = String(locData.状态 || locData.state || '').trim();
  if (status && status !== 'intact') locData.状态 = status;
  else delete locData.状态;
  delete locData.state;

  const nodeCategory = String(locData.节点类别 || locData.nodeKind || '').trim();
  if (nodeCategory) locData.节点类别 = nodeCategory;
  else delete locData.节点类别;
  delete locData.nodeKind;

  const eventId = String(locData.事件ID || locData.eventId || '').trim();
  if (eventId) locData.事件ID = eventId;
  else delete locData.事件ID;
  delete locData.eventId;

  const interactions = normalizeDynamicLocationTextList(locData.交互 || locData.interactions);
  if (interactions.length) locData.交互 = interactions;
  else delete locData.交互;
  delete locData.interactions;

  const services = normalizeDynamicLocationTextList(locData.服务 || locData.services);
  if (services.length) locData.服务 = services;
  else delete locData.服务;
  delete locData.services;

  delete locData.行动槽;
  delete locData.actionSlots;
  delete locData.action_slots;
  return locData;
}

function normalizeRelationAnalysisTopTargetsInput(value = []) {
  const normalizeItem = item => ({
    对象: String(item?.对象 || '无').trim() || '无',
    关系: String(item?.关系 || '陌生').trim() || '陌生',
    好感度: Number(item?.好感度 || 0),
    路线: String(item?.路线 || '朋友线').trim() || '朋友线',
    原因: String(item?.原因 || '无').trim() || '无',
    建议行动: String(item?.建议行动 || '继续观察').trim() || '继续观察',
  });
  if (Array.isArray(value)) return value.filter(item => item && typeof item === 'object').map(normalizeItem);
  if (value && typeof value === 'object') {
    if ('对象' in value || '原因' in value || '建议行动' in value) {
      return [normalizeItem(value)];
    }
    return Object.values(value)
      .filter(item => item && typeof item === 'object')
      .map(normalizeItem);
  }
  return [];
}

const CharacterSchema = z
  .object({
    属性: StatsSchema,
    装备: EquipmentSchema,
    外貌: AppearanceSchema,
    穿搭: ClothingSchema,
    性格: z.string().prefault(AI_TODO_PERSONALITY).describe('角色的性格特征，随经历可能发生改变'),
    魂骨: SoulBoneSchema,
    血脉之力: BloodlinePowerSchema,
    魂核: z
      .object({
        核心: z
          .object({
            数量: z.coerce.number().prefault(0),
            进度: z.coerce.number().prefault(0).describe('凝聚进度(%)'),
          })
          .prefault({}),
      })
      .prefault({}),
    财富: WealthSchema,
私密档案: z
      .object({
        发情度: z.coerce.number().prefault(0).describe('当前发情度/催情值(0-100)'),
        敏感度: z.coerce.number().prefault(10).describe('身体整体敏感度基础值'),
        开发度: z.coerce.number().prefault(0).describe('身体整体开发度/调教进度(0-100)'),
        
        癖好: z.array(z.string()).prefault(['待补全(请根据角色经历，填写已觉醒的特殊癖好标签)']),
        幻想: z.array(z.string()).prefault(['待补全(请根据角色隐藏的性格，描写其内心深处渴望被对待的私密方式)']),
        
        受孕tick: z.coerce.number().prefault(-1).describe('受孕时的tick，-1表示未怀孕'),
        受孕对象: z.string().prefault('无').describe('孩子父亲'),

        _生理阶段: z.string().prefault('计算中...').describe('当前生理阶段(只读)'),
        _怀孕天数: z.coerce.number().prefault(0).describe('当前怀孕天数(只读)'),
         身材数据: z
          .object({
            胸围: z.coerce.number().prefault(0),
            腰围: z.coerce.number().prefault(0),
            臀围: z.coerce.number().prefault(0),
            罩杯: z.string().prefault('待补全(请根据角色体型填写，如A/B/C/D/E)'),
            身材描述: z.string().prefault('待补全(请描写其身材曲线与肉感)'),
          })
          .prefault({}),

        _已来初潮: z.boolean().prefault(false).describe('是否已来初潮(底层只读)'),
        生理期偏移: z.coerce.number().prefault(0).describe('生理周期偏移量(28天=4032tick，默认0)'),     
        身体部位: z
          .object({
            胸部: BodyPartSchema,
            花穴: BodyPartSchema,
			菊穴: BodyPartSchema,
            屁股: BodyPartSchema,
            大腿: BodyPartSchema,
            嘴唇: BodyPartSchema,
            脚丫: BodyPartSchema,
            尾巴: BodyPartSchema,
            耳朵: BodyPartSchema,
            鼻子: BodyPartSchema,
            腋下: BodyPartSchema,
            脖颈: BodyPartSchema,
          })
          .prefault({}),
        贴身衣物: z
          .object({
            内衣: z.string().prefault('待补全(请根据当前情境描写具体内衣款式，如蕾丝胸罩/真空/拘束具)'),
            内裤: z.string().prefault('待补全(请描写具体内裤款式，如丁字裤/C字裤/真空/贞操带)'),
            特殊道具: z.array(z.string()).prefault(['待补全(若体内或体表佩戴了跳蛋/项圈等道具请在此列出)']),
          })
          .prefault({}),

        经历次数: z
          .object({
            自慰: z.coerce.number().prefault(0),
            性交: z.coerce.number().prefault(0),
            手交: z.coerce.number().prefault(0),
            足交: z.coerce.number().prefault(0),
            口交: z.coerce.number().prefault(0),
            素股: z.coerce.number().prefault(0),
            发交: z.coerce.number().prefault(0),
            SM: z.coerce.number().prefault(0),
            COSPLAY: z.coerce.number().prefault(0),
            高潮: z.coerce.number().prefault(0),
			内射: z.coerce.number().prefault(0),
			颜射: z.coerce.number().prefault(0),
			吞精: z.coerce.number().prefault(0),
			宠物扮演: z.coerce.number().prefault(0),
          })
          .prefault({}),

        _最近高潮tick: z.coerce.number().prefault(0).describe('最近一次高潮发生的tick'),
      })
      .prefault({}),


    状态: z
      .object({
        位置: z.string().prefault(AI_TODO_STATUS_LOC).describe('当前位置绝对路径'),
        横坐标: z.coerce.number().prefault(-1).describe('当前位置横坐标'),
        纵坐标: z.coerce.number().prefault(-1).describe('当前位置纵坐标'),
        存活: z.boolean().prefault(true),
        受伤部位: z
          .record(
            z.string(),
            z
              .object({
                程度: z.enum(['轻', '中', '重']).prefault('轻'),
                描述: z.string().prefault(''),
              })
              .prefault({}),
          )
          .prefault({}),
        行动: z.string().prefault('日常').describe('行为状态: 日常/冥想/战斗/睡眠/肉体训练/精神训练'),
        当前领域: z.string().prefault('无').describe('当前正在展开的领域名称(斗铠/精神/武魂领域)'),
        吸收灵物年限: z.coerce.number().prefault(0).describe('当前正在吸收的灵物年份(阅后即焚)'),
      })
      .prefault({}),
    已掌握情报: z.array(z.string()).prefault([]).describe('该角色已解锁的核心情报列表'),

    魂灵塔记录: z
      .object({
        最高层: z.coerce.number().prefault(0).describe('历史最高通关层数'),
        当前五折魂灵: z
          .object({
            层数: z.coerce.number().prefault(0),
            名称: z.string().prefault(''),
            标准物种: z.string().prefault(''),
            年限: z.coerce.number().prefault(0),
            品质: z.string().prefault(''),
            已使用: z.boolean().prefault(false),
          })
          .prefault({})
          .describe('当前可用的魂灵塔五折购买资格，仅保留最新层的目标魂灵'),
      })
      .prefault({}),

    互动请求: z
      .object({
        目标人物: z.string().prefault('无').describe('互动对象姓名'),
        动作: z.string().prefault('无').describe('互动类型：闲聊/送礼/切磋/请教/双修/表白'),
        使用物品: z.string().prefault('无').describe('互动使用物品'),
        结果评分: z.coerce.number().prefault(0).describe('互动结果分值'),
      })
      .prefault({}),
    晋升请求: z
      .object({
        目标势力: z.string().prefault('无').describe('目标势力(如:唐门/战神殿)'),
        目标职位: z.string().prefault('无').describe('申请职位(如:红级/预备战神)'),
      })
      .prefault({}),

    捐献请求: z
      .object({
        物品名称: z.string().prefault('无').describe('捐献物品名称'),
        目标势力: z.string().prefault('无').describe('目标势力'),
        数量: z.coerce.number().prefault(1).describe('数量'),
      })
      .prefault({}),
    战斗历史: z
      .record(
        z.string(),
        z.object({ 次数: z.coerce.number().prefault(0), 最近tick: z.coerce.number().prefault(0) }).prefault({}),
      )
      .prefault({})
      .transform(data => _(data).entries().takeRight(20).fromPairs().value()),

    职业: z
      .record(
        z.string(),
        z
          .object({
            等级: z.coerce.number().prefault(0),
            经验: z.coerce.number().prefault(0),
            称号: z.string().prefault('无'),
            核心技艺: z.record(z.string(), z.boolean().prefault(true)).prefault({}),
            限制: z
              .object({ 最大融合数: z.coerce.number().prefault(1), 成功率: z.coerce.number().prefault(0) })
              .prefault({}),
          })
          .prefault({}),
      )
      .prefault({})
      .transform(jobs => {
        _(jobs).forEach(jobData => {
          while (jobData.等级 < 9 && jobData.经验 >= JobExpThresholds[jobData.等级]) {
            jobData.等级++;
          }
          jobData.限制.最大融合数 = Math.max(1, Math.floor(jobData.等级 / 2));

          if (jobData.等级 === 9) {
            let overflowExp = Math.max(0, jobData.经验 - 3000000);
            let extraRate = Math.floor(overflowExp / 500000);
            jobData.限制.成功率 = Math.min(50, 10 + extraRate);
          } else if (jobData.等级 > 0) {
            let currentBaseExp = JobExpThresholds[jobData.等级 - 1];
            let nextLevelExp = JobExpThresholds[jobData.等级];
            let progress = (jobData.经验 - currentBaseExp) / (nextLevelExp - currentBaseExp);
            progress = Math.max(0, Math.min(1, progress));

            if (jobData.等级 % 2 === 0) {
              jobData.限制.成功率 = Math.floor(80 + 15 * progress);
            } else {
              jobData.限制.成功率 = Math.floor(30 + 40 * progress);
            }
          } else {
            jobData.限制.成功率 = 0;
          }
        });
        return jobs;
      }),

    武魂: z
      .object({
        第一武魂: z
          .object({
            表象名称: z.string().prefault(AI_TODO_SPIRIT_NAME).describe('武魂名'),
            描述: z.string().prefault(AI_TODO_SPIRIT_DESC).describe('武魂的具体形态与能力描述'),
            type: z.string().prefault('强攻系'),
            属性体系: z.string().prefault(AI_TODO_ATTRIBUTE_SYSTEM).describe('武魂属性体系：无/元素/五行'),
            已解锁属性: z.array(z.string()).prefault([]).describe('当前已经真正获得的属性列表'),
            可容纳属性: z.array(z.string()).prefault([AI_TODO_ATTRIBUTE_CAPACITY]).describe('武魂理论可承载的属性上限'),
            魂灵: z
              .record(
                z.string().describe('魂灵槽位(如:第一魂灵)'),
                z
                  .object({
                    表象名称: z.string().prefault(AI_TODO_SOUL_SPIRIT_NAME).describe('魂灵物种名'),
                    描述: z.string().prefault(AI_TODO_SOUL_SPIRIT_DESC).describe('魂灵描述，由 AI 维护'),
                    年限: z.coerce.number().prefault(0),
                    品质: z.string().prefault(AI_TODO_SOUL_SPIRIT_QUALITY).describe('魂灵品质：F/D/C/B/A/S/S+'),
                    契合度: z.coerce.number().prefault(60).describe('与武魂的契合度(0-100)，影响融合难度与发挥'),
                    状态: z.string().prefault('沉睡'),
                    战力面板: z
                      .object({
                        对标等级: z.coerce.number().prefault(0),
                        str: z.coerce.number().prefault(0),
                        def: z.coerce.number().prefault(0),
                        agi: z.coerce.number().prefault(0),
                        vit_max: z.coerce.number().prefault(0),
                        men_max: z.coerce.number().prefault(0),
                        sp_max: z.coerce.number().prefault(0),
                      })
                      .optional()
                      .describe('魂灵战力面板'),
                    魂环: z
                      .record(
                        z.string().describe('第几魂环'),
                        z
                          .object({
                            年限: z.coerce.number().prefault(0),
                            颜色: z.string().prefault('无'),
                            魂技: z.record(z.string().describe('魂技名称'), SkillStructSchema).prefault({}),
                          })
                          .prefault({}),
                      )
                      .prefault({}),
                  })
                  .prefault({}),
              )
              .prefault({}),
            独立魂环: z
              .record(
                z.string().describe('第几独立魂环'),
                z
                  .object({
                    年限: z.coerce.number().prefault(0),
                    颜色: z.string().prefault('无'),
                    来源: z.string().prefault('无').describe('该独立魂环的来源，如吸收对象/无主魂环/特殊传承'),
                    魂技: z.record(z.string().describe('魂技名称'), SkillStructSchema).prefault({}),
                  })
                  .prefault({}),
              )
              .prefault({}),
          })
          .prefault({}),
        第二武魂: z
          .object({
            表象名称: z.string().prefault('未展露').describe('第二武魂名'),
            描述: z.string().prefault('无').describe('第二武魂描述'),
            type: z.string().prefault('强攻系'),
            属性体系: z.string().prefault(AI_TODO_ATTRIBUTE_SYSTEM).describe('武魂属性体系：无/元素/五行'),
            已解锁属性: z.array(z.string()).prefault([]).describe('当前已经真正获得的属性列表'),
            可容纳属性: z.array(z.string()).prefault([AI_TODO_ATTRIBUTE_CAPACITY]).describe('武魂理论可承载的属性上限'),
            魂灵: z
              .record(
                z.string().describe('魂灵槽位(如:第一魂灵)'),
                z
                  .object({
                    表象名称: z.string().prefault(AI_TODO_SOUL_SPIRIT_NAME).describe('魂灵物种名'),
                    描述: z.string().prefault(AI_TODO_SOUL_SPIRIT_DESC).describe('魂灵描述，由 AI 维护'),
                    年限: z.coerce.number().prefault(0),
                    品质: z.string().prefault(AI_TODO_SOUL_SPIRIT_QUALITY).describe('魂灵品质：F/D/C/B/A/S/S+'),
                    契合度: z.coerce.number().prefault(60).describe('与武魂的契合度(0-100)，影响融合难度与发挥'),
                    状态: z.string().prefault('沉睡'),
                    战力面板: z
                      .object({
                        对标等级: z.coerce.number().prefault(0),
                        str: z.coerce.number().prefault(0),
                        def: z.coerce.number().prefault(0),
                        agi: z.coerce.number().prefault(0),
                        vit_max: z.coerce.number().prefault(0),
                        men_max: z.coerce.number().prefault(0),
                        sp_max: z.coerce.number().prefault(0),
                      })
                      .optional()
                      .describe('魂灵战力面板'),
                    魂环: z
                      .record(
                        z.string().describe('第几魂环'),
                        z
                          .object({
                            年限: z.coerce.number().prefault(0),
                            颜色: z.string().prefault('无'),
                            魂技: z.record(z.string().describe('魂技名称'), SkillStructSchema).prefault({}),
                          })
                          .prefault({}),
                      )
                      .prefault({}),
                  })
                  .prefault({}),
              )
              .prefault({}),
            独立魂环: z
              .record(
                z.string().describe('第几独立魂环'),
                z
                  .object({
                    年限: z.coerce.number().prefault(0),
                    颜色: z.string().prefault('无'),
                    来源: z.string().prefault('无').describe('该独立魂环的来源，如吸收对象/无主魂环/特殊传承'),
                    魂技: z.record(z.string().describe('魂技名称'), SkillStructSchema).prefault({}),
                  })
                  .prefault({}),
              )
              .prefault({}),
          })
          .optional(),
      })
      .describe('固定武魂槽位')
      .prefault({}),

    功法: z
      .record(
        z.string(),
        z
          .object({
            境界: z.string().prefault('未入门'),
            lv: z.coerce.number().prefault(0),
            exp: z.coerce.number().prefault(0),
            描述: z.string().prefault('无'),
          })
          .prefault({}),
      )
      .prefault({}),
    自创魂技: z
      .record(z.string().describe('能力名称'), SkillStructSchema)
      .prefault({})
      .describe('统一自创魂技容器，承载魂环、血脉与武魂融合技以外的原创技能'),
    武魂融合技: z
      .record(
        z.string().describe('融合技名称'),
        z
          .object({
            融合模式: z
              .enum(['partner', 'self'])
              .prefault('partner')
              .describe('融合模式：partner=普通武魂融合技；self=自体武魂融合技'),
            融合对象: z.string().prefault('无').describe('partner模式下的融合对象/羁绊队友姓名；self模式固定为"无"'),
            来源武魂: z
              .array(z.enum(['第一武魂', '第二武魂']))
              .prefault([])
              .describe('参与融合的武魂槽位。自体融合通常为[第一武魂, 第二武魂]'),
            技能数据: SkillStructSchema,
          })
          .prefault({}),
      )
      .prefault({})
      .describe('武魂融合技列表（统一区分自体融合与普通融合）'),
    精神领域: z
      .object({
        名称: z.string().prefault('无').describe('精神领域名称，例如：时光回溯、情绪剥夺'),
        描述: z.string().prefault('无').describe('领域效果的具体描述，用自然语言描写'),
        进行中: z
          .boolean()
          .prefault(false)
          .describe('当前是否展开，开启门槛：基础精神力>25000。战斗中开启需消耗8000精神/回合'),
        维护消耗: z
          .object({
            精神力: z.coerce.number().prefault(0),
          })
          .prefault({}),
        战斗修饰: z
          .object({
            条件闪避: z
              .object({
                启用: z
                  .boolean()
                  .prefault(false)
                  .describe('【开启条件】若领域包含时空倒流、攻击无效化等闪避法则，请设为true'),
                比对属性: z.string().prefault('men').describe("【比对属性】填'men'(精神力比拼)"),
                最大倍率: z.coerce
                  .number()
                  .prefault(1.5)
                  .describe('【容错倍率】填1.5，意为敌方精神力不超过我方1.5倍时法则生效'),
                战报文案: z
                  .string()
                  .prefault('')
                  .describe('【战报文案】例如：时光倒流，将状态回溯至受击前，伤害无效！'),
              })
              .prefault({}),
            属性压制: z
              .object({
                启用: z
                  .boolean()
                  .prefault(false)
                  .describe('【开启条件】若领域包含剥夺情绪、降维等削弱法则，请设为true'),
                目标属性: z
                  .string()
                  .prefault('all')
                  .describe("【削弱目标】填'all'(全属性)或'str'(力量)/'men'(精神)等"),
                削弱比例: z.coerce.number().prefault(0.3).describe('【削弱比例】填0.1~0.5之间，0.3代表削弱30%属性'),
              })
              .prefault({}),
            必中真伤: z
              .object({
                启用: z
                  .boolean()
                  .prefault(false)
                  .describe('【开启条件】若领域包含因果律、必定命中、真实伤害、无视防御的法则，请设为true'),
                真伤比例: z.coerce
                  .number()
                  .prefault(0.1)
                  .describe('【真伤比例】附加自身精神力上限的百分之多少作为真实伤害，默认0.1'),
                战报文案: z
                  .string()
                  .prefault('')
                  .describe('【战报文案】例如：因果已定，无视一切防御直接粉碎精神之海！'),
              })
              .prefault({}),
            时间迟滞: z
              .object({
                启用: z
                  .boolean()
                  .prefault(false)
                  .describe('【开启条件】若领域包含时间减缓、重力禁锢等拉长敌方前摇的法则，请设为true'),
                蓄力倍率: z.coerce
                  .number()
                  .prefault(2.0)
                  .describe('【前摇惩罚倍率】填2.0，意为敌方所有技能蓄力时间翻倍'),
                战报文案: z
                  .string()
                  .prefault('')
                  .describe('【战报文案】例如：时间沼泽降临，对方的动作变得如同慢放一般。'),
              })
              .prefault({}),
            灵魂汲取: z
              .object({
                启用: z
                  .boolean()
                  .prefault(false)
                  .describe('【开启条件】若领域包含吞噬、生命汲取、血气反哺等吸血法则，请设为true'),
                汲取比例: z.coerce
                  .number()
                  .prefault(0.5)
                  .describe('【吸取比例】填0.5，意为对敌方造成的精神/生命伤害的50%将恢复给自身'),
                战报文案: z
                  .string()
                  .prefault('')
                  .describe('【战报文案】例如：吞噬领域将掠夺来的生命能量疯狂反哺己身！'),
              })
              .prefault({}),
            幻境偏移: z
              .object({
                启用: z
                  .boolean()
                  .prefault(false)
                  .describe('【开启条件】若领域包含幻境、精神致盲、让敌方动作偏移落空的法则，请设为true'),
                偏移概率: z.coerce
                  .number()
                  .prefault(0.4)
                  .describe('【偏移概率】填0.4，意为敌方有40%概率技能丢失目标或跳过回合'),
                战报文案: z
                  .string()
                  .prefault('')
                  .describe('【战报文案】例如：大梦无觉，对方彻底迷失在幻境中，技能偏离了目标！'),
              })
              .prefault({}),
          })
          .prefault({}),
      })
      .prefault({}),

    社交: z
      .object({
        声望: z.coerce.number().prefault(0),
        名望等级: z.string().prefault('籍籍无名'),
        主身份: z.string().prefault(AI_TODO_MAIN_IDENTITY).describe('当前主要公开身份'),
        公开情报: z.boolean().prefault(false).describe('是否为公开情报(声望>5000自动为true)'),
        势力: z
          .record(
            z.string(),
            z.object({ 身份: z.string().prefault('无'), 权限级: z.coerce.number().prefault(0) }).prefault({}),
          )
          .prefault({}),
        称号: z
          .record(
            z.string(),
            z.object({ 来源: z.string().prefault('无'), 声望加成: z.coerce.number().prefault(0) }).prefault({}),
          )
          .prefault({}),
        关系: z
          .record(
            z.string(),
            z
              .object({
                关系: z.string().prefault('陌生'),
                好感度: z.coerce.number().prefault(0),
                关系路线: z.string().prefault('朋友线').describe('终极分支: 朋友线/恋人线'),
                对方身份: z.string().prefault('无'),
                好感加成: z.string().prefault('无'),
                _关系阶段: z.string().prefault('陌生').describe('结构化关系阶段，默认与关系称谓同步'),
                _下一阶段: z.string().prefault('认识').describe('下一阶段名称'),
                _下一阶段阈值: z.coerce.number().prefault(11).describe('达到下一阶段所需最低好感度'),
                _可切线: z.boolean().prefault(false).describe('当前是否允许切入恋人线等特殊路线'),
                _切线限制原因: z.string().prefault('好感度不足').describe('路线切换受限时的原因'),
                _推进提示: z.string().prefault('无').describe('当前关系推进提示'),
                _维护优先级: z.string().prefault('未知').describe('关系维护优先级：高风险/待接触/可接触/优先维护'),
                上次互动tick: z.coerce.number().prefault(0).describe('最近一次互动发生的 tick'),
                上次互动动作: z.string().prefault('无').describe('最近一次互动动作'),
                最近好感变化: z.coerce.number().prefault(0).describe('最近一次互动导致的好感变化'),
                _当前关系加成: z.string().prefault('无').describe('当前已激活的关系加成说明'),
                _下档解锁加成: z.string().prefault('无').describe('下一档可解锁的羁绊加成说明'),
                _下档解锁阈值: z.coerce.number().prefault(30).describe('下一档羁绊加成所需好感度'),
                武魂相关度基础: z
                  .union([z.coerce.number(), z.string()])
                  .prefault(武魂相关度基础待补全提示词)
                  .describe('武魂相关度基础分(0-100，待补全提示词表示待AI初始化)'),
              })
              .prefault({}),
          )
          .prefault({}),
        关系分析: z
          .object({
            摘要: z.string().prefault('当前尚未积累足够的人物关系数据。'),
            关注对象: z.string().prefault('无'),
            重点对象: z
              .any()
              .transform(value => normalizeRelationAnalysisTopTargetsInput(value))
              .prefault([]),
            恋爱候选: z.array(z.string()).prefault([]),
            信任对象: z.array(z.string()).prefault([]),
            风险对象: z.array(z.string()).prefault([]),
            受阻对象: z
              .array(
                z
                  .object({
                    对象: z.string().prefault('无'),
                    原因: z.string().prefault('无'),
                  })
                  .prefault({}),
              )
              .prefault([]),
            同地对象: z.array(z.string()).prefault([]),
            可联络对象: z.array(z.string()).prefault([]),
          })
          .prefault({}),
      })
      .prefault({})
      .transform(社交 => {
        社交.公开情报 = 社交.声望 >= 5000;
        社交.名望等级 = 社交.名望等级 || '籍籍无名';

        const topTargets = [];
        const romanceCandidates = [];
        const trustTargets = [];
        const riskTargets = [];
        const blockedTargets = [];

        _(社交.关系).forEach((relData, targetName) => {
          const val = Number(relData.好感度 || 0);
          let route = relData.关系路线 || '朋友线';
          const currentRelationLabel = String(relData.关系 || relData._关系阶段 || '陌生').trim() || '陌生';
          let nextStage = '已达当前路线终点';
          let nextStageThreshold = 999;
          let progressNote = '维持当前关系即可。';
          let recommendedAction = '继续观察';
          let nextUnlockThreshold = 999;
          let nextUnlockBonus = '无';

          if (val <= -50) {
            nextStage = '敌视';
            nextStageThreshold = -10;
            progressNote = '当前处于强烈敌对状态，优先避免正面刺激。';
            recommendedAction = '先缓和冲突或制造间接修复契机';
            nextUnlockThreshold = -10;
            nextUnlockBonus = '脱离仇敌阶段';
          } else if (val <= -10) {
            nextStage = '陌生';
            nextStageThreshold = 11;
            progressNote = '关系紧张，任何互动都可能继续恶化。';
            recommendedAction = '减少高压对抗，尝试中性接触';
            nextUnlockThreshold = 11;
            nextUnlockBonus = '恢复基础接触';
          } else if (val <= 10) {
            nextStage = '认识';
            nextStageThreshold = 11;
            progressNote = '刚建立认知，适合轻量互动试探反应。';
            recommendedAction = '从闲聊、短接触或小帮助开始';
            nextUnlockThreshold = 30;
            nextUnlockBonus = '进入稳定认识阶段';
          } else if (val <= 30) {
            nextStage = '朋友';
            nextStageThreshold = 31;
            progressNote = '关系刚起步，需要持续建立信任。';
            recommendedAction = '通过同行、帮忙、请教等方式加深印象';
            nextUnlockThreshold = 60;
            nextUnlockBonus = '进入稳定朋友阶段';
          } else if (val <= 60) {
            nextStage = '亲密';
            nextStageThreshold = 61;
            progressNote = route === '恋人线' ? '已经具备推进暧昧关系的基础。' : '已经形成可靠伙伴关系。';
            recommendedAction = route === '恋人线' ? '增加私下互动或专属事件' : '安排并肩行动巩固信任';
            nextUnlockThreshold = 80;
            nextUnlockBonus = route === '恋人线' ? '进入暧昧阶段判定' : '进入高强度羁绊阶段';
          } else if (val <= 80) {
            nextStage = route === '恋人线' ? '暧昧' : '挚友';
            nextStageThreshold = 81;
            progressNote =
              route === '恋人线' ? '关系已进入高敏感阶段，适合关键表态。' : '已是核心伙伴，可承担高风险协作。';
            recommendedAction = route === '恋人线' ? '准备表白或专属确认事件' : '安排重大共同经历';
            nextUnlockThreshold = 95;
            nextUnlockBonus = route === '恋人线' ? '确认恋人关系' : '确认生死之交';
          } else {
            progressNote = route === '恋人线' ? '关系已接近或进入恋人阶段。' : '关系已接近或进入生死之交阶段。';
            recommendedAction = route === '恋人线' ? '维护专属陪伴与排他性事件' : '作为核心盟友长期经营';
          }

          relData._关系阶段 = currentRelationLabel;
          relData._下一阶段 = nextStage;
          relData._下一阶段阈值 = nextStageThreshold;
          relData._可切线 = route !== '恋人线' && val >= 60;
          relData._切线限制原因 = relData._可切线
            ? '无'
            : route === '恋人线'
              ? '当前已处于恋人线'
              : '好感度需达到 60 后才能稳定切入恋人线';
          relData._推进提示 = progressNote;
          relData._维护优先级 = val <= -10 ? '高风险' : val <= 10 ? '待接触' : val <= 60 ? '可接触' : '优先维护';
          relData._当前关系加成 = relData.好感加成 || '无';
          relData._下档解锁加成 = nextUnlockBonus;
          relData._下档解锁阈值 = nextUnlockThreshold;
          规范武魂相关度基础字段(relData);

          topTargets.push({
            对象: targetName,
            关系: currentRelationLabel,
            好感度: val,
            路线: route,
            原因: progressNote,
            建议行动: recommendedAction,
          });

          if (val >= 60) trustTargets.push(targetName);
          if (route === '恋人线' && val >= 60) romanceCandidates.push(targetName);
          if (val <= -10) riskTargets.push(targetName);
          if (!relData._可切线 && route !== '恋人线' && val < 60) {
            blockedTargets.push({ 对象: targetName, 原因: relData._切线限制原因 });
          }
        });

        const sortedTopTargets = topTargets.sort((a, b) => Number(b.好感度 || 0) - Number(a.好感度 || 0));
        const fallbackFocusTarget = sortedTopTargets[0]?.对象 || '无';
        const existingTopTargets = Array.isArray(社交.关系分析.重点对象)
          ? 社交.关系分析.重点对象
          : [];
        const shouldFillFocusTarget =
          !String(社交.关系分析.关注对象 || '').trim() ||
          String(社交.关系分析.关注对象 || '').trim() === '无' ||
          isAiTodoText(社交.关系分析.关注对象);
        const shouldFillTopTargets =
          existingTopTargets.length === 0 ||
          existingTopTargets.every(
            item => !String(item?.对象 || '').trim() || String(item?.对象 || '').trim() === '无',
          );
        if (shouldFillFocusTarget) 社交.关系分析.关注对象 = fallbackFocusTarget;
        if (shouldFillTopTargets) 社交.关系分析.重点对象 = sortedTopTargets.slice(0, 5);
        if (
          !String(社交.关系分析.摘要 || '').trim() ||
          社交.关系分析.摘要 === '当前尚未积累足够的人物关系数据。'
        ) {
          社交.关系分析.摘要 = sortedTopTargets.length
            ? `当前最应关注的关系对象为${fallbackFocusTarget}，优先推进${sortedTopTargets
                .slice(0, 2)
                .map(item => item.对象)
                .join('、')}。`
            : '当前尚未积累足够的人物关系数据。';
        }
        社交.关系分析.恋爱候选 = romanceCandidates.sort(
          (a, b) => Number((社交.关系[b] || {}).好感度 || 0) - Number((社交.关系[a] || {}).好感度 || 0),
        );
        社交.关系分析.信任对象 = trustTargets.sort(
          (a, b) => Number((社交.关系[b] || {}).好感度 || 0) - Number((社交.关系[a] || {}).好感度 || 0),
        );
        社交.关系分析.风险对象 = riskTargets.sort(
          (a, b) => Number((社交.关系[a] || {}).好感度 || 0) - Number((社交.关系[b] || {}).好感度 || 0),
        );
        社交.关系分析.受阻对象 = blockedTargets;
        社交.关系分析.同地对象 = 社交.关系分析.同地对象 || [];
        社交.关系分析.可联络对象 = 社交.关系分析.可联络对象 || [];

        return 社交;
      }),

    背包: z
      .record(
        z.string(),
        z
          .object({
            数量: z.coerce.number().prefault(1),
            类型: z.string().prefault('常规'),
            装备槽位: z.string().prefault('无').describe('武器/头盔/胸铠/机甲等装备位；非装备可填无'),
            品质: z.string().prefault('无'),
            品阶: z.string().prefault('无'),
            标签: z.array(z.string()).prefault([]).describe('用于筛选或展示的标签，如火属性/票据/任务物品/稀有'),
            融合参数: z
              .object({
                数量: z.coerce.number().prefault(1).describe('融锻包含的金属种类数'),
                契合度: z.coerce.number().prefault(0).describe('融锻契合度(0-100)'),
              })
              .prefault({})
              .describe('仅用于记录融锻金属的特殊属性'),
            特效: z.record(z.string(), z.boolean().prefault(true)).prefault({}),
            词条: z
              .record(
                z.string(),
                z
                  .object({
                    类型: z.string().prefault('效果'),
                    数值: z.coerce.number().prefault(0),
                    描述: z.string().prefault('无'),
                  })
                  .prefault({}),
              )
              .prefault({})
              .describe('随机词条/铭刻/附魔/特性说明'),
            属性加成: z
              .object({
                lv_equiv: z.coerce.number().prefault(0),
                str: z.coerce.number().prefault(0),
                def: z.coerce.number().prefault(0),
                agi: z.coerce.number().prefault(0),
                vit_max: z.coerce.number().prefault(0),
                sp_max: z.coerce.number().prefault(0),
                men_max: z.coerce.number().prefault(0),
              })
              .prefault({})
              .describe('道具或装备提供的面板属性加成'),
            耐久: z
              .object({
                当前: z.coerce.number().prefault(0),
                上限: z.coerce.number().prefault(0),
              })
              .prefault({})
              .describe('装备/工具耐久；0/0 表示未启用'),
            绑定者: z.string().prefault('无'),
            使用条件: z
              .object({
                最低等级: z.coerce.number().prefault(0),
                所属势力: z.string().prefault('无'),
                最低声望: z.coerce.number().prefault(0),
                地点限制: z.string().prefault('无'),
              })
              .prefault({})
              .describe('使用或交易该道具的限制条件'),
            使用效果: z
              .array(
                z
                  .object({
                    目标: z.string().prefault('无'),
                    类型: z.string().prefault('无'),
                    描述: z.string().prefault('无'),
                    数值: z.any().prefault(null),
                    目标上限: z.string().prefault('无'),
                  })
                  .prefault({}),
              )
              .prefault([])
              .describe('使用/激活该道具后产生的效果'),
            触发方式: z.string().prefault('使用').describe('该临时道具的触发方式，如使用/食用'),
            可交易: z.boolean().prefault(true),
            堆叠上限: z.coerce.number().prefault(9999),
            来源技能: z.string().prefault('无'),
            有效期至: z.string().prefault('无').describe('展示给玩家的过期日期文本，如斗罗历X年X月X日 HH:MM'),
            有效期至tick: z.coerce
              .number()
              .prefault(0)
              .describe('大于0时表示该临时道具会在指定 tick 自动失效并从背包删除'),
            市场估值: z
              .object({ 价格: z.coerce.number().prefault(0), 货币: z.string().prefault('联邦币') })
              .prefault({}),
            描述: z.string().prefault('无'),
          })
          .prefault({}),
      )
      .prefault({}),

    记录: z
      .record(
        z.string(),
        z
          .object({
            类型: z.string().prefault('悬赏任务'),
            状态: z.string().prefault('进行中'),
            当前进度: z.coerce.number().prefault(0),
            目标进度: z.coerce.number().prefault(1),
            奖励币: z.coerce.number().prefault(0),
            奖励声望: z.coerce.number().prefault(0),
            描述: z.string().prefault('无'),
            阶段: z.coerce.number().prefault(1).describe('任务当前阶段(>=1)'),
            分支: z.string().prefault('未判定').describe('任务分支结果'),
            失败计数: z.coerce.number().prefault(0).describe('提交失败累计次数'),
            里程碑: z.array(z.string()).prefault([]).describe('已触发的阶段里程碑'),
            最后更新时间tick: z.coerce.number().prefault(0).describe('最近一次进度更新tick'),
            情报贡献值: z.coerce.number().prefault(0).describe('任务分支判定时的情报贡献值'),
            图鉴贡献值: z.coerce.number().prefault(0).describe('任务分支判定时的图鉴贡献值'),
            风险级别: z.string().prefault('中风险').describe('任务当前风险级别'),
            推荐路线: z.string().prefault('主线').describe('系统建议任务路线'),
            最近爆发tick: z.coerce.number().prefault(0).describe('最近一次节点爆发发生tick'),
          })
          .prefault({}),
      )
      .prefault({}),

    任务请求: z
      .object({
        动作: z.string().prefault('无').describe('接取/更新进度/提交/放弃'),
        任务名称: z.string().prefault('无').describe('任务名称'),
        任务描述: z.string().prefault('无').describe('任务描述与目标'),
        进度增量: z.coerce.number().prefault(0).describe('本次进度增量'),
        目标进度: z.coerce.number().prefault(1).describe('完成所需的总进度'),
        奖励币: z.coerce.number().prefault(0).describe('奖励联邦币'),
        奖励声望: z.coerce.number().prefault(0).describe('奖励声望'),
      })
      .prefault({}),
    __mvu_isPlayer: z.boolean().optional().prefault(false),
  })
  .prefault({})
  .transform(char => {
    const normalizedCharName = String(char?.name || char?.属性?.name || char?.base?.name || '').trim();
    const isPlayerCharacter = char.__mvu_isPlayer === true;
    const secondarySpirit = char.武魂 && char.武魂['第二武魂'];
    if (secondarySpirit && typeof secondarySpirit === 'object') {
      const secondaryName = String(secondarySpirit['表象名称'] || '').trim();
      const secondaryDesc = String(secondarySpirit['描述'] || '').trim();
      const secondaryAttributeState = normalizeSpiritAttributeState(secondarySpirit, '第二武魂', char);
      const hasUnlockedAttrs = secondaryAttributeState.已解锁属性.length > 0;
      const hasCapacityAttrs = secondaryAttributeState.可容纳属性.some(
        attr => attr && attr !== '无' && !isAiTodoText(attr),
      );
      const hasElementSystem = ['元素', '五行'].includes(String(secondaryAttributeState.属性体系 || '').trim());
      const hasSoulSpirits = !!(secondarySpirit.魂灵 && Object.keys(secondarySpirit.魂灵).length);
      const hasRealSecondarySpirit =
        (secondaryName && secondaryName !== '未展露' && !isAiTodoText(secondaryName)) ||
        (secondaryDesc && secondaryDesc !== '无' && !isAiTodoText(secondaryDesc)) ||
        hasElementSystem ||
        hasUnlockedAttrs ||
        hasCapacityAttrs ||
        hasSoulSpirits;

      if (!hasRealSecondarySpirit) {
        const nextSpirit = { ...(char.武魂 || {}) };
        delete nextSpirit['第二武魂'];
        char.武魂 = nextSpirit;
      }
    }

    if (char.血脉之力?.血脉 === '金龙王' && shouldKeepExtendedBloodlineData('', char)) {
      let currentSealLv = char.血脉之力.解封层数 || 0;
      if (!char.血脉之力.技能) char.血脉之力.技能 = {};
      if (!char.血脉之力.被动) char.血脉之力.被动 = {};
      if (!char.血脉之力.永久加成) char.血脉之力.永久加成 = {};
      const fixedNames = new Set([
        ...Object.values(GoldenDragonSkills || {})
          .map(skill => skill?.技能名称)
          .filter(Boolean),
        ...Array.from(GOLDEN_DRAGON_NON_SKILL_NODE_NAMES),
      ]);
      fixedNames.forEach(name => {
        delete char.血脉之力.技能[name];
        delete char.血脉之力.被动[name];
      });

      for (let i = 1; i <= currentSealLv; i++) {
        let skillData = GoldenDragonSkills[i];
        if (skillData) {
          const targetMap = isPassiveSkillStructData(skillData)
            ? char.血脉之力.被动
            : char.血脉之力.技能;
          if (!targetMap[skillData.技能名称]) {
            targetMap[skillData.技能名称] = { ...cloneSkillStructData(skillData), 状态: skillData.状态 || '已固化' };
          }
        }
      }
    }
    pruneExtendedBloodlineData(char, '');
    if (!char.自创魂技) char.自创魂技 = {};
    Object.keys(TANGMEN_SECRET_SKILL_TEMPLATES).forEach(artName => {
      if (!char.功法?.[artName]) {
        delete char.自创魂技[artName];
        return;
      }
      const template = TANGMEN_SECRET_SKILL_TEMPLATES[artName];
      if (template && !char.自创魂技[artName]) {
        char.自创魂技[artName] = cloneSkillStructData(template);
      }
    });

    if (char._initial_state_override) {
      _.merge(char, char._initial_state_override);
      delete char._initial_state_override;

      if (char.装备.斗铠.装备状态 === '已装备') {
        let armorLv = char.装备.斗铠.等级;
        const reqLv = [0, 50, 70, 80, 90][armorLv] || 0;

        if (char.属性.等级 < reqLv) {
          char.装备.斗铠.装备状态 = '未装备';
          if (!char.属性.状态效果['装备反噬'])
            char.属性.状态效果['装备反噬'] = { 类型: 'debuff', 层数: 1, 描述: '强行穿戴高阶斗铠失败，气血震荡' };
        } else if (
          char.装备.机甲.等级 !== '无' &&
          char.装备.机甲.等级 !== '红级' &&
          char.装备.机甲.状态 !== '重创' &&
          char.装备.机甲.装备状态 === '已装备'
        ) {
          char.装备.斗铠.装备状态 = '未装备';
        }
      }

      if (char.装备.机甲.装备状态 === '已装备') {
        let mechReqLv = { 黄级: 40, 紫级: 50, 黑级: 60, 红级: 80 }[char.装备.机甲.等级] || 0;
        if (char.属性.等级 < mechReqLv) {
          char.装备.机甲.装备状态 = '未装备';
          if (!char.属性.状态效果['机甲反噬'])
            char.属性.状态效果['机甲反噬'] = {
              类型: 'debuff',
              层数: 1,
              描述: '精神力与魂力不足以驾驭高阶机甲，遭到反噬',
            };
        }
      }

      const reqLv = [0, 50, 70, 80, 90][Number(char?.装备?.斗铠?.等级 || 0)] || 0;
      if (char.属性.等级 < reqLv) {
        char.装备.斗铠.装备状态 = '未装备';
        if (!char.属性.状态效果['装备反噬'])
          char.属性.状态效果['装备反噬'] = { 类型: 'debuff', 层数: 1, 描述: '强行穿戴高阶斗铠失败，气血震荡' };
      } else if (char.装备.机甲.等级 !== '无' && char.装备.机甲.等级 !== '红级' && char.装备.机甲.状态 !== '重创') {
        char.装备.斗铠.装备状态 = '未装备';
      }
    }

    {
      const currentTier = String(char.属性.天赋梯队 || '').trim();
      const hasPresetTalent = !!(currentTier && currentTier !== '正常');
      const backgroundTier = ['顶级势力', '一流势力', '普通势力', '平民'].includes(String(char.属性?.背景阶层 || '').trim())
        ? String(char.属性.背景阶层).trim()
        : '平民';
      const ageValue = Math.max(0, Number(char.属性?.年龄 || 0));
      const isEvilSoulMaster = char.属性?.邪魂师 === true;
      const shouldIgnoreFactionBackgroundForTalent = !isEvilSoulMaster && ageValue < 13;
      const effectiveBackgroundTier = isEvilSoulMaster
        ? '顶级势力'
        : shouldIgnoreFactionBackgroundForTalent
          ? '平民'
          : backgroundTier;

      if (!hasPresetTalent) {
        const rawTalentRating = Number(char.属性?.天赋评级);
        const talentRatingValue = Number.isFinite(rawTalentRating)
          ? Math.max(1, Math.min(100, Math.floor(rawTalentRating)))
          : null;
        const backgroundScoreBonus = TALENT_BACKGROUND_SCORE_BONUS_ACU[effectiveBackgroundTier] || 0;
        const talentRatingScore = Number.isFinite(talentRatingValue)
          ? Math.round((talentRatingValue - 50) * 0.1)
          : 0;
        const totalScore = Math.floor(Math.random() * 1000) + 1 + backgroundScoreBonus + talentRatingScore;
        const rareBonusOdds = TALENT_BACKGROUND_RARE_BONUS_ODDS_ACU[effectiveBackgroundTier] || TALENT_BACKGROUND_RARE_BONUS_ODDS_ACU.平民;
        const baseNoSoulPowerChance =
          {
            平民: 0.70,
            普通势力: 0.40,
            一流势力: 0.20,
            顶级势力: 0.10,
          }[effectiveBackgroundTier] ?? 0.70;
        let noSoulPowerChance = baseNoSoulPowerChance;
        if (Number.isFinite(talentRatingValue)) {
          const normalizedTalentRating = (talentRatingValue - 50) / 50;
          if (normalizedTalentRating >= 0) {
            noSoulPowerChance = noSoulPowerChance * Math.max(0.02, 1 - normalizedTalentRating * 0.9);
          } else {
            noSoulPowerChance = Math.min(0.98, noSoulPowerChance * (1 + Math.abs(normalizedTalentRating) * 0.8));
          }
        }

        let tier = '劣等';
        if (Math.random() < noSoulPowerChance) {
          tier = '天赋极差';
        } else if (rareBonusOdds.绝世妖孽 > 0 && Math.random() < rareBonusOdds.绝世妖孽) {
          tier = '绝世妖孽';
        } else if (rareBonusOdds.顶级天才 > 0 && Math.random() < rareBonusOdds.顶级天才) {
          tier = '顶级天才';
        } else if (totalScore >= TALENT_SCORE_THRESHOLDS_ACU.绝世妖孽) {
          tier = '绝世妖孽';
        } else if (totalScore >= TALENT_SCORE_THRESHOLDS_ACU.顶级天才) {
          tier = '顶级天才';
        } else if (totalScore >= TALENT_SCORE_THRESHOLDS_ACU.天才) {
          tier = '天才';
        } else if (totalScore >= TALENT_SCORE_THRESHOLDS_ACU.优秀) {
          tier = '优秀';
        } else if (totalScore >= TALENT_SCORE_THRESHOLDS_ACU.正常) {
          tier = '正常';
        }
        let innate = 3;
        let factor = 1.0;
        let maxLimit = 69;

        if (tier === '天赋极差') {
          innate = 0;
          factor = 0;
          maxLimit = 0;
        } else if (tier === '绝世妖孽') {
          innate = 10;
          factor = 4.5;
          maxLimit = 100;
        } else if (tier === '顶级天才') {
          innate = 10;
          factor = 3.8;
          maxLimit = 99;
        } else if (tier === '天才') {
          innate = 8;
          factor = 2.5;
          maxLimit = 89;
        } else if (tier === '优秀') {
          innate = 6;
          factor = 1.8;
          maxLimit = 79;
        } else if (tier === '正常') {
          innate = 3;
          factor = 1.0;
          maxLimit = 49;
        } else if (tier === '劣等') {
          innate = 1;
          factor = 0.5;
          maxLimit = 29;
        }

        char.属性.天赋梯队 = tier;

        if (char.属性.等级 === 1 && char.属性.年龄 > 6) {
          let calculatedLv = Math.floor(innate + (char.属性.年龄 - 6) * factor);
          char.属性.等级 = Math.min(maxLimit, Math.max(1, calculatedLv));
        }
      }

      delete char.属性.背景阶层;
      delete char.属性.天赋评级;
      if (isNoSoulPowerTalentTier(char.属性.天赋梯队)) {
        normalizeNoSoulPowerCharacterData(char);
        return;
      }
    }

    const explicitLevel = Math.max(0, Math.floor(Number(char.属性?.等级 || 0)));
    const baseSoulPowerSeed = Math.max(0, Math.floor(Number(char.属性?.基础魂力上限 || 0)));
    const breakthroughSoulPowerSeed = Math.max(0, Math.floor(Number(char.属性?.突破魂力上限 || 0)));
    const shouldApplyStaticHighLevelBootstrap =
      !isPlayerCharacter &&
      explicitLevel > 1 &&
      Math.max(baseSoulPowerSeed, breakthroughSoulPowerSeed) <= 10;

    if (shouldApplyStaticHighLevelBootstrap) {
      if (!char.魂核) char.魂核 = {};
      if (!char.魂核.核心 || typeof char.魂核.核心 !== 'object') char.魂核.核心 = { 数量: 0, 进度: 0 };
      if (explicitLevel >= 99 && Number(char.魂核.核心.数量 || 0) < 3) {
        char.魂核.核心.数量 = 3;
        char.魂核.核心.进度 = 0;
      } else if (explicitLevel >= 90 && Number(char.魂核.核心.数量 || 0) < 2) {
        char.魂核.核心.数量 = 2;
        char.魂核.核心.进度 = 0;
      } else if (explicitLevel >= 70 && Number(char.魂核.核心.数量 || 0) < 1) {
        char.魂核.核心.数量 = 1;
        char.魂核.核心.进度 = 0;
      }
    }

    let coreCount = char.魂核?.核心?.数量 || 0;
    let penalty = char.属性.等级惩罚 || 0;
    let maxLv = 69;
    if (coreCount === 1) maxLv = 89;
    else if (coreCount === 2) maxLv = 98;
    else if (coreCount >= 3) maxLv = 150;
    char.属性.等级 = Math.min(char.属性.等级, maxLv - penalty);

    const base = getBaseStats(char.属性.等级);
    let maxTypeMult = { sp_max: 0, men_max: 0, str: 0, def: 0, agi: 0, vit_max: 0 };
    let spiritKeys = Object.keys(char.武魂 || {});
    if (spiritKeys.length > 0) {
      spiritKeys.forEach(k => {
        let tm = TypeMultipliers[char.武魂[k].type] || TypeMultipliers['强攻系'];
        maxTypeMult.sp_max = Math.max(maxTypeMult.sp_max, tm.sp_max);
        maxTypeMult.men_max = Math.max(maxTypeMult.men_max, tm.men_max);
        maxTypeMult.str = Math.max(maxTypeMult.str, tm.str);
        maxTypeMult.def = Math.max(maxTypeMult.def, tm.def);
        maxTypeMult.agi = Math.max(maxTypeMult.agi, tm.agi);
        maxTypeMult.vit_max = Math.max(maxTypeMult.vit_max, tm.vit_max);
      });
    } else {
      maxTypeMult = { ...(TypeMultipliers[char.属性.系别] || TypeMultipliers['强攻系']) };
    }
    const typeMult = maxTypeMult;
    const hiddenVar = char.属性.底子波动;
    const naturalBaseSpMax = Math.floor(base.sp_max * typeMult.sp_max * hiddenVar);
    const cultivatedBaseSpMax = Math.max(
      naturalBaseSpMax,
      Math.floor(Number(char.属性.基础魂力上限 || 0)),
    );
    const dualSpiritSoulCoeff = getDualSpiritSoulPowerCoeff(char);
    const externalPermanentSoulPowerBonus = Math.max(0, Math.floor(Number(char.属性?.永久魂力加成 || 0)));
    let final_str = Math.floor(base.str * typeMult.str * hiddenVar) + char.属性.训练加成.力量;
    let final_def = Math.floor(base.def * typeMult.def * hiddenVar) + char.属性.训练加成.防御;
    let final_agi = Math.floor(base.agi * typeMult.agi * hiddenVar) + char.属性.训练加成.敏捷;
    let final_vit_max = Math.floor(base.vit_max * typeMult.vit_max * hiddenVar) + char.属性.训练加成.体力上限;
    let final_men_max = Math.floor(base.men_max * typeMult.men_max * hiddenVar) + char.属性.训练加成.精神力上限;
    char.属性.基础魂力上限 = cultivatedBaseSpMax;
    let final_sp_max = Math.floor(cultivatedBaseSpMax * dualSpiritSoulCoeff) + getPersistentSoulPowerBonusFromPermanentRecords(char) + externalPermanentSoulPowerBonus;
    let bName = char.血脉之力?.血脉 || '无';

    if (bName.includes('金龙王')) {
      let vitInc = final_vit_max * 9;
      final_vit_max += Math.min(vitInc, 100000);
      let strInc = final_str * 9;
      final_str += Math.min(strInc, 100000);
      let menInc = final_men_max * 4;
      final_men_max += Math.min(menInc, 20000);
    } else if (bName.includes('银龙王')) {
      let vitInc = final_vit_max * 1;
      final_vit_max += Math.min(vitInc, 20000);
      let strInc = final_str * 1;
      final_str += Math.min(strInc, 20000);
      let menInc = final_men_max * 9;
      final_men_max += Math.min(menInc, 40000);
    }
    if (char.社交?.势力?.['本体宗']) {
      let vitInc = final_vit_max * 2;
      final_vit_max += Math.min(vitInc, 40000);
    }
    let previewMen = final_men_max;
    if (previewMen >= 50000) char.属性.精神境界 = '神元境';
    else if (previewMen >= 20000) char.属性.精神境界 = '灵域境';
    else if (previewMen >= 3000) char.属性.精神境界 = '灵渊境';
    else if (previewMen >= 500) char.属性.精神境界 = '灵海境';
    else if (previewMen >= 50) char.属性.精神境界 = '灵通境';
    else char.属性.精神境界 = '灵元境';

    let tier = char.属性.天赋梯队;
    const isBeast = isSoulBeastCharacter(char);

    if (isBeast) {
      char.装备.斗铠.等级 = 0;
      char.装备.斗铠.名称 = '无';
      char.装备.斗铠.领域 = '无';
      char.装备.斗铠.材质 = '无';
      char.装备.斗铠.装备状态 = '未装备';
      char.装备.斗铠.部件 = {};
      char.装备.斗铠._属性加成 = { 等效等级: 0, 魂力上限: 0, 精神力上限: 0, 力量: 0, 防御: 0, 敏捷: 0, 体力上限: 0 };
      char.装备.斗铠._已排异 = false;
      char.装备.机甲.等级 = '无';
      char.装备.机甲.型号 = '无';
      char.装备.机甲.材质 = '无';
      char.装备.机甲.状态 = '完好';
      char.装备.机甲.装备状态 = '未装备';
      char.装备.机甲.武装 = '无';
      char.装备.机甲.品质系数 = 1.0;
      char.装备.机甲._属性加成 = { 魂力上限: 0, 精神力上限: 0, 力量: 0, 防御: 0, 敏捷: 0, 体力上限: 0 };
      char.魂骨 = {};
    }

    if (!isBeast && ['绝世妖孽', '顶级天才', '天才'].includes(tier)) {
      let armorLv = 0;
      if (char.属性.等级 >= 99) {
        armorLv = 4;
      } else if (char.属性.等级 >= 98) {
        armorLv = Math.random() < 0.5 ? 4 : 3;
      } else if (char.属性.等级 >= 90 && tier === '天才') {
        if (Math.random() < 0.5) {
          armorLv = 3;
        } else {
          armorLv = 0;
          char.装备.机甲.等级 = '红级';
          char.装备.机甲.状态 = '完好';
        }
      } else if (char.属性.等级 >= 80) armorLv = 3;
      else if (char.属性.等级 >= 70) armorLv = 2;
      else if (char.属性.等级 >= 50) armorLv = 1;

      if (char.属性.邪魂师 && armorLv > 3) {
        armorLv = 3;
      }

      if (armorLv > 0) {
        char.装备.斗铠.等级 = armorLv;
        char.装备.斗铠.装备状态 = '未装备';
        let parts = ['头盔', '胸铠', '左肩', '右肩', '左臂', '右臂', '左腿', '右腿', '战裙', '战靴'];
        parts.forEach(p => (char.装备.斗铠.部件[p] = { 状态: '完好', 品质系数: 1.0 }));
      }
    } else if (!isBeast && tier === '优秀') {
      if (char.属性.等级 >= 70) {
        char.装备.机甲.等级 = '黑级';
        char.装备.机甲.状态 = '完好';
        char.装备.机甲.装备状态 = '未装备';
      } else if (char.属性.等级 >= 50) {
        char.装备.机甲.等级 = '紫级';
        char.装备.机甲.状态 = '完好';
        char.装备.机甲.装备状态 = '未装备';
      }
    }

    let boneCount = 0;
    if (!isBeast) {
      if (char.属性.等级 >= 90) boneCount += 2;
      else if (char.属性.等级 >= 80) boneCount += 1;
    }

    if (!isBeast && boneCount > 0) {
      let boneParts = ['头部魂骨', '躯干魂骨', '右臂魂骨', '左臂魂骨', '右腿魂骨', '左腿魂骨'];

      for (let i = 0; i < Math.min(boneCount, 6); i++) {
        const 骨部位 = String(boneParts[i] || '魂骨').trim() || '魂骨';
        const 魂骨来源文本 = AI_TODO_SOUL_BONE_SOURCE;

        char.魂骨[骨部位] = {
          名称: 归一化魂骨名称_V1('', 魂骨来源文本, 骨部位),
          年限: char.属性.等级 >= 90 ? 50000 : 10000,
          来源: 魂骨来源文本,
          附带技能: { 被动增幅: cloneSkillStructData() },
        };
      }
    }

    let totalSpirits = 0;
    const genericSkillAge = Math.max(1000, Number(char.属性.等级 || 1) * 200);
    _(char.武魂 || {}).forEach((spiritData, spiritKey) => {
      if (!(spiritData && typeof spiritData === 'object')) return;
      if (!spiritData.独立魂环 || typeof spiritData.独立魂环 !== 'object') spiritData.独立魂环 = {};
      const spiritAttributeState = normalizeSpiritAttributeState(spiritData, spiritKey, char);
      spiritData.属性体系 = spiritAttributeState.属性体系;
      spiritData.已解锁属性 = spiritAttributeState.已解锁属性;
      spiritData.可容纳属性 = spiritAttributeState.可容纳属性;
      const runtimeElementProfile = buildElementProfileFromAttributeState(spiritAttributeState);
      totalSpirits += Object.keys(spiritData?.魂灵 || {}).length;
      _(spiritData?.魂灵 || {}).forEach(武魂 => {
        syncSoulSpiritRuntimeData(武魂);
        if (Object.prototype.hasOwnProperty.call(武魂, '附机制候选')) delete 武魂.附机制候选;
        const 来源品质 =
          normalizeSoulSpiritQuality(武魂?.品质 || '') ||
          inferSoulSpiritQuality(武魂) ||
          normalizeSoulSpiritQuality(spiritData?.品质 || '') ||
          inferSoulSpiritQuality(spiritData) ||
          '';

        _(武魂.魂环 || {}).forEach((ring, ringIndexStr) => {
          const ringIndex = parseInt(ringIndexStr) || 1;
          const 当前魂环数量 = 计算武魂当前魂环数量_V1(spiritData);
          const 武魂名称 = String(spiritData?.表象名称 || spiritKey || '').trim();
          ensureSkillMapGenerated(ring.魂技, (_, skillName) => ({
            type: char.属性.系别,
            talentTier: char.属性.天赋梯队,
            age: ring.年限,
            ringIndex,
            当前魂环数量,
            martialSoulName: 武魂名称,
            compatibility: 武魂.契合度 || 100,
            sourceQuality: 来源品质,
            preferredSecondary: [],
            elementProfile: runtimeElementProfile,
            unlockedAttributes: spiritAttributeState.已解锁属性,
            attributeCapacity: spiritAttributeState.可容纳属性,
            elementTrigger: '继承武魂',
            sourceCategory: '魂技',
            forceTrueBody: ringIndex === 7,
            textContext: {
              spiritName:
                !isAiTodoText(武魂.表象名称) && 武魂.表象名称 !== '未展露'
                  ? 武魂.表象名称
                  : spiritData?.表象名称 || skillName,
              type: char.属性.系别,
              spiritDesc: String(武魂?.描述 || '').trim(),
              martialSoulName: 武魂名称,
              ringSource: String(ring?.来源 || '').trim(),
            },
          }));
        });
      });

      _(spiritData?.独立魂环 || {}).forEach((ring, ringIndexStr) => {
        const ringIndex = parseInt(ringIndexStr) || 1;
        const 当前魂环数量 = 计算武魂当前魂环数量_V1(spiritData);
        const 武魂名称 = String(spiritData?.表象名称 || spiritKey || '').trim();
        const 来源品质 =
          normalizeSoulSpiritQuality(spiritData?.品质 || '') ||
          inferSoulSpiritQuality(spiritData) ||
          '';
        if (ring && typeof ring === 'object' && !String(ring.颜色 || '').trim()) ring.颜色 = getRingColorByAge(ring.年限);
        if (ring && typeof ring === 'object' && Object.prototype.hasOwnProperty.call(ring, '附机制候选')) delete ring.附机制候选;
        ensureSkillMapGenerated(ring?.魂技, (_, skillName) => ({
          type: char.属性.系别,
          talentTier: char.属性.天赋梯队,
          age: ring?.年限,
          ringIndex,
          当前魂环数量,
          martialSoulName: 武魂名称,
          compatibility: 100,
          sourceQuality: 来源品质,
          preferredSecondary: [],
          elementProfile: runtimeElementProfile,
          unlockedAttributes: spiritAttributeState.已解锁属性,
          attributeCapacity: spiritAttributeState.可容纳属性,
          elementTrigger: '继承武魂',
          sourceCategory: '魂技',
          forceTrueBody: ringIndex === 7,
          textContext: {
            spiritName: spiritData?.表象名称 || skillName,
            type: char.属性.系别,
            spiritDesc: String(spiritData?.描述 || '').trim(),
            martialSoulName: 武魂名称,
            ringSource: String(ring?.来源 || '').trim(),
          },
        }));
      });

    });

    _(char.魂骨 || {}).forEach((bone, bonePart) => {
      ensureSkillMapGenerated(bone?.附带技能, (_, skillName) => ({
        type: char.属性.系别,
        talentTier: char.属性.天赋梯队,
        age: bone?.年限 || bone?.age || genericSkillAge,
        ringIndex: 1,
        compatibility: 100,
        preferredSecondary: getBonePreferredSecondary(bonePart),
        textContext: {
          spiritName: bone?.名称 || bonePart || skillName,
          type: char.属性.系别,
        },
      }));
    });

    const customSkillAttributeState = buildCharacterCustomSkillAttributeState(char);
    const customSkillElementProfile = buildElementProfileFromAttributeState(customSkillAttributeState);
    ensureSkillMapGenerated(char.自创魂技, (_, skillName) => ({
      type: char.属性.系别,
      talentTier: char.属性.天赋梯队,
      age: Math.max(1000, genericSkillAge),
      ringIndex: Math.max(1, Math.ceil(Number(char.属性.等级 || 1) / 10)),
      compatibility: 100,
      preferredSecondary: [],
      elementProfile: customSkillElementProfile,
      unlockedAttributes: customSkillAttributeState.已解锁属性,
      attributeCapacity: customSkillAttributeState.可容纳属性,
      elementTrigger: '自创',
      sourceCategory: '自创魂技',
      textContext: {
        spiritName: skillName,
        type: char.属性.系别,
      },
    }));

    if (!char.血脉之力 || typeof char.血脉之力 !== 'object') char.血脉之力 = {};
    ensureSkillMapGenerated(char.血脉之力?.被动, (_, skillName) => ({
      type: char.属性.系别,
      talentTier: char.属性.天赋梯队,
      age: Math.max(10000, genericSkillAge),
      ringIndex: Math.max(1, Number(char.血脉之力?.解封层数 || 1)),
      compatibility: 100,
      passiveMode: true,
      passiveName: skillName,
      preferredSecondary: [],
      elementTrigger: '继承血脉',
      textContext: {
        spiritName: char.血脉之力?.血脉 || skillName,
        type: char.属性.系别,
      },
    }));

    ensureSkillMapGenerated(char.血脉之力?.技能, (_, skillName) => ({
      type: char.属性.系别,
      talentTier: char.属性.天赋梯队,
      age: Math.max(10000, genericSkillAge),
      ringIndex: Math.max(1, Number(char.血脉之力?.解封层数 || 1)),
      compatibility: 100,
      preferredSecondary: [],
      elementTrigger: '继承血脉',
      textContext: {
        spiritName: char.血脉之力?.血脉 || skillName,
        type: char.属性.系别,
      },
    }));

    _(char.血脉之力?.气血魂环 || {}).forEach((ringData, ringIndexStr) => {
      const ringIndex = parseInt(ringIndexStr) || 1;
      if (ringData && typeof ringData === 'object' && !String(ringData.颜色 || '').trim()) ringData.颜色 = '金';
      ensureSkillMapGenerated(ringData?.魂技, (_, skillName) => ({
        type: char.属性.系别,
        talentTier: char.属性.天赋梯队,
        age: Math.max(1000, ringIndex * 5000),
        ringIndex,
        compatibility: 100,
        preferredSecondary: [],
        elementTrigger: '继承血脉',
        textContext: {
          spiritName: char.血脉之力?.血脉 || skillName,
          type: char.属性.系别,
        },
      }));
    });

    _(char.武魂融合技 || {}).forEach((fusionData, fusionName) => {
      if (!fusionData || typeof fusionData !== 'object') return;
      fusionData.融合模式 = getNormalizedFusionMode(fusionData);
      fusionData.来源武魂 = getNormalizedFusionSourceSpirits(fusionData, char);
      if (fusionData.融合模式 === 'self') fusionData.融合对象 = '无';
      const fusionElementProfile = getFusionSkillElementProfile(fusionData, char);
      ensureSkillStructGenerated(fusionData?.技能数据, {
        type: char.属性.系别,
        talentTier: char.属性.天赋梯队,
        age: Math.max(10000, genericSkillAge),
        ringIndex: Math.max(1, Math.ceil(Number(char.属性.等级 || 1) / 10)),
        compatibility: 100,
        preferredSecondary: [],
        elementProfile: fusionElementProfile,
        unlockedAttributes: fusionElementProfile?.elements || [],
        attributeCapacity: fusionElementProfile?.elements || [],
        elementTrigger: '融合',
        sourceCategory: '武魂融合技',
        textContext: {
          spiritName: fusionName,
          type: char.属性.系别,
        },
      });
      ensureFusionSkillMentalCost(fusionData?.技能数据, 0.5);
    });

    const realmLimit =
      { 灵元境: 1, 灵通境: 2, 灵海境: 5, 灵渊境: 9, 灵域境: 99, 神元境: 999 }[
        char.属性.精神境界 || char.属性.精神力_realm
      ] || 1;
    if (totalSpirits > realmLimit) {
      char.属性.状态效果['精神超载'] = { 类型: 'debuff', 层数: 1, 描述: '魂灵数量超出精神力承载极限，面临崩溃风险' };
    }

    if (char.装备.斗铠.等级 > 0) {
      let totalQuality = 0,
        count = 0;
      _(char.装备.斗铠.部件).forEach(p => {
        if (p.状态 !== '未打造' && p.状态 !== '重创') {
          totalQuality += p.品质系数;
          count++;
        }
      });
      if (count > 0) {
        let avgQ = totalQuality / count;
        let base = ArmorBaseStats[char.装备.斗铠.等级] || ArmorBaseStats[1];
        let mult = count === 10 ? avgQ : 0.05 * avgQ * count;
        char.装备.斗铠._属性加成.魂力上限 = Math.floor(base.sp_max * mult);
        char.装备.斗铠._属性加成.精神力上限 = Math.floor(base.men_max * mult);
        char.装备.斗铠._属性加成.力量 = Math.floor(base.str * mult);
        char.装备.斗铠._属性加成.敏捷 = Math.floor(base.agi * mult);
        char.装备.斗铠._属性加成.体力上限 = Math.floor(base.vit_max * mult);
        char.装备.斗铠._属性加成.防御 = Math.floor(base.str * mult);
      }
    }
    if (char.装备.机甲.等级 !== '无' && char.装备.机甲.状态 !== '重创') {
      let base = MechBaseStats[char.装备.机甲.等级];
      if (base) {
        const mult = char.装备.机甲.品质系数 || 1.0;
        char.装备.机甲._属性加成.魂力上限 = Math.floor(base.sp_max * mult);
        char.装备.机甲._属性加成.精神力上限 = Math.floor(base.men_max * mult);
        char.装备.机甲._属性加成.力量 = Math.floor(base.str * mult);
        char.装备.机甲._属性加成.敏捷 = Math.floor(base.agi * mult);
        char.装备.机甲._属性加成.体力上限 = Math.floor(base.vit_max * mult);
        char.装备.机甲._属性加成.防御 = Math.floor(base.str * mult);
      }
    }

    const wpnBonus = char.装备.武器?.属性加成 || {};
    const armorBonus = char.装备.斗铠?.装备状态 === '已装备' ? char.装备.斗铠?._属性加成 || {} : {};
    const mechBonus = char.装备.机甲?.装备状态 === '已装备' ? char.装备.机甲?._属性加成 || {} : {};
    let boneBonus = { str: 0, def: 0, agi: 0, vit_max: 0, men_max: 0, sp_max: 0 };

    _(char.魂骨).forEach((bone, part) => {
      if (bone.年限 > 0) {
        let ringBonus = getRingBonus(bone.年限);

        if (part === '躯干魂骨') {
          boneBonus.str += ringBonus.str * 2;
          boneBonus.def += ringBonus.def * 2;
          boneBonus.agi += ringBonus.agi * 2;
          boneBonus.vit_max += ringBonus.vit_max * 2;
          boneBonus.sp_max += ringBonus.sp_max * 2;
        } else if (part === '头部魂骨') {
          boneBonus.men_max += ringBonus.men_max * 2;
        } else if (part === '左腿魂骨' || part === '右腿魂骨') {
          boneBonus.str += ringBonus.str;
          boneBonus.def += ringBonus.def;
          boneBonus.agi += ringBonus.agi * 2;
          boneBonus.vit_max += ringBonus.vit_max;
          boneBonus.men_max += ringBonus.men_max;
          boneBonus.sp_max += ringBonus.sp_max;
        } else if (part === '左臂魂骨' || part === '右臂魂骨') {
          boneBonus.str += ringBonus.str * 2;
          boneBonus.def += ringBonus.def;
          boneBonus.agi += ringBonus.agi;
          boneBonus.vit_max += ringBonus.vit_max;
          boneBonus.men_max += ringBonus.men_max;
          boneBonus.sp_max += ringBonus.sp_max;
        } else {
          boneBonus.str += ringBonus.str;
          boneBonus.def += ringBonus.def;
          boneBonus.agi += ringBonus.agi;
          boneBonus.vit_max += ringBonus.vit_max;
          boneBonus.men_max += ringBonus.men_max;
          boneBonus.sp_max += ringBonus.sp_max;
        }
      }
    });
    let ringTotalBonus = { str: 0, def: 0, agi: 0, vit_max: 0, men_max: 0, sp_max: 0 };
    _(char.武魂).forEach(spiritData => {
      _(spiritData.魂灵).forEach(ss => {
        let compMult = Math.max(0.1, (ss.契合度 !== undefined ? ss.契合度 : 100) / 100);

        _(ss.魂环).forEach(ring => {
          if (Number(ring?.年限 || 0) > 0 && !String(ring?.颜色 || '').trim()) {
            ring.颜色 = getRingColorByAge(ring.年限);
          }
          if (ring.年限 > 0) {
            let bonus = getRingBonus(ring.年限);
            ringTotalBonus.str += Math.floor(bonus.str * compMult);
            ringTotalBonus.def += Math.floor(bonus.def * compMult);
            ringTotalBonus.agi += Math.floor(bonus.agi * compMult);
            ringTotalBonus.vit_max += Math.floor(bonus.vit_max * compMult);
            ringTotalBonus.men_max += Math.floor(bonus.men_max * compMult);
            ringTotalBonus.sp_max += Math.floor(bonus.sp_max * compMult);
          }
        });
      });
      _(spiritData.独立魂环).forEach(ring => {
        if (Number(ring?.年限 || 0) > 0 && !String(ring?.颜色 || '').trim()) {
          ring.颜色 = getRingColorByAge(ring.年限);
        }
        if (ring?.年限 > 0) {
          let bonus = getRingBonus(ring.年限);
          ringTotalBonus.str += Math.floor(bonus.str);
          ringTotalBonus.def += Math.floor(bonus.def);
          ringTotalBonus.agi += Math.floor(bonus.agi);
          ringTotalBonus.vit_max += Math.floor(bonus.vit_max);
          ringTotalBonus.men_max += Math.floor(bonus.men_max);
          ringTotalBonus.sp_max += Math.floor(bonus.sp_max);
        }
      });
    });

    const ringBoneSoulPowerBonus = Math.floor(ringTotalBonus.sp_max + boneBonus.sp_max);
    const baseSoulPowerWithoutRingBone =
      Math.floor(cultivatedBaseSpMax * dualSpiritSoulCoeff) +
      getPersistentSoulPowerBonusFromPermanentRecords(char) +
      externalPermanentSoulPowerBonus;
    const ignoreStaticRingBoneSoulPower = shouldIgnoreStaticRingBoneSoulPowerByFormula(char, {
      charName: normalizedCharName,
      playerName: isPlayerCharacter ? normalizedCharName : '__MVU_PLAYER__',
      explicitLevel,
      breakthroughSoulPowerSeed,
      baseWithoutRingBoneSoulPower: baseSoulPowerWithoutRingBone,
      ringBoneSoulPowerBonus,
    });
    final_str = Math.floor(final_str + ringTotalBonus.str + boneBonus.str);
    final_def = Math.floor(final_def + ringTotalBonus.def + boneBonus.def);
    final_agi = Math.floor(final_agi + ringTotalBonus.agi + boneBonus.agi);
    final_vit_max = Math.floor(final_vit_max + ringTotalBonus.vit_max + boneBonus.vit_max);
    final_men_max = Math.floor(final_men_max + ringTotalBonus.men_max + boneBonus.men_max);
    final_sp_max = Math.floor(
      final_sp_max +
      (ignoreStaticRingBoneSoulPower ? 0 : ringBoneSoulPowerBonus),
    );

    const goldenDragonPermanentBonus = applyGoldenDragonPermanentBonusNodes(char, {
      力量: final_str,
      防御: final_def,
      敏捷: final_agi,
      体力上限: final_vit_max,
      精神力上限: final_men_max,
      魂力上限: final_sp_max,
    });
    final_str = Math.floor(final_str + goldenDragonPermanentBonus.力量);
    final_def = Math.floor(final_def + goldenDragonPermanentBonus.防御);
    final_agi = Math.floor(final_agi + goldenDragonPermanentBonus.敏捷);
    final_vit_max = Math.floor(final_vit_max + goldenDragonPermanentBonus.体力上限);
    final_men_max = Math.floor(final_men_max + goldenDragonPermanentBonus.精神力上限);
    final_sp_max = Math.floor(final_sp_max + goldenDragonPermanentBonus.魂力上限);
    char.属性.突破魂力上限 = Math.max(1, Math.floor(final_sp_max));

    if (final_men_max >= 50000) char.属性.精神境界 = '神元境';
    else if (final_men_max >= 20000) char.属性.精神境界 = '灵域境';
    else if (final_men_max >= 3000) char.属性.精神境界 = '灵渊境';
    else if (final_men_max >= 500) char.属性.精神境界 = '灵海境';
    else if (final_men_max >= 50) char.属性.精神境界 = '灵通境';
    else char.属性.精神境界 = '灵元境';

    char.属性.力量 = Math.floor(final_str + (wpnBonus.力量 || 0) + (armorBonus.力量 || 0) + (mechBonus.力量 || 0));
    char.属性.防御 = Math.floor(final_def + (wpnBonus.防御 || 0) + (armorBonus.防御 || 0) + (mechBonus.防御 || 0));
    char.属性.敏捷 = Math.floor(final_agi + (wpnBonus.敏捷 || 0) + (armorBonus.敏捷 || 0) + (mechBonus.敏捷 || 0));
    char.属性.体力上限 = Math.floor(
      final_vit_max + (wpnBonus.体力上限 || 0) + (armorBonus.体力上限 || 0) + (mechBonus.体力上限 || 0),
    );
    char.属性.HP上限 = Math.max(1, Number(char.属性.体力上限 || 1));
    char.属性.精神力上限 = Math.floor(
      final_men_max + (wpnBonus.精神力上限 || 0) + (armorBonus.精神力上限 || 0) + (mechBonus.精神力上限 || 0),
    );
    char.属性.魂力上限 = Math.floor(
      final_sp_max + (wpnBonus.魂力上限 || 0) + (armorBonus.魂力上限 || 0) + (mechBonus.魂力上限 || 0),
    );
    normalizeStatHpFields(char.属性);


    let rep = char.社交.声望 || 0;
    if (rep >= 10000) char.社交.名望等级 = '举世无双';
    else if (rep >= 5000) char.社交.名望等级 = '名动联邦';
    else if (rep >= 2000) char.社交.名望等级 = '威震一方';
    else if (rep >= 500) char.社交.名望等级 = '声名鹊起';
    else if (rep >= 100) char.社交.名望等级 = '初露锋芒';
    else char.社交.名望等级 = '籍籍无名';
    if (char.装备.斗铠?._已排异) {
      if (!char.属性.状态效果['回路冲突']) {
        char.属性.状态效果['回路冲突'] = {
          类型: 'debuff',
          层数: 1,
          描述: '斗铠各部件材质品质差距过大，能量回路产生排斥，气血不畅！',
          duration: 99,
          stat_mods: { str: 0.9, def: 0.9, agi: 0.9, sp_max: 0.9 },
          combat_effects: { dot_damage: 0, skip_turn: false, armor_pen: 0 },
        };
      }
    } else {
      delete char.属性.状态效果['回路冲突'];
    }

    char.属性.体力 = Math.min(char.属性.体力, char.属性.体力上限);
    char.属性.魂力 = Math.min(char.属性.魂力, char.属性.魂力上限);
    char.属性.精神力 = Math.min(char.属性.精神力, char.属性.精神力上限);

 const gender = String(char.属性?.性别 || '');
    if (!gender.includes('女') && !gender.includes('待补全')) {
      delete char.私密档案; 
    }

    return char;
  });

const FactionSchema = z
  .object({
    影响力: z.coerce.number().prefault(0),
    规模: z.coerce.number().prefault(0),
    状态: z.string().prefault('正常'),
    上级势力: z.string().prefault('无').describe('上级势力/从属关系，如：斗罗联邦'),
    关系: z.record(z.string(), z.object({ 态度: z.string().prefault('中立') }).prefault({})).prefault({}),
    成员: z.record(z.string(), z.object({ 职位: z.string().prefault('外围') }).prefault({})).prefault({}),
    战力统计: z
      .object({
        极限斗罗: z.coerce.number().prefault(0).describe('极限斗罗数量'),
        超级斗罗: z.coerce.number().prefault(0).describe('超级斗罗数量'),
        封号斗罗: z.coerce.number().prefault(0).describe('普通封号斗罗数量'),
      })
      .prefault({}),
  })
  .prefault({});
const BaseProductPool = {
  高能压缩干粮: {
    价格: 50,
    货币: '联邦币',
    类型: '补给品',
    描述: '长途旅行必备，能快速补充少量体力。',
    效果: [{ 目标: '属性.体力', 类型: 'percentage', 数值: 0.1, 目标上限: '属性.体力上限' }],
  },
  纯净水: { 价格: 10, 货币: '联邦币', 类型: '补给品', 描述: '基础的饮用水，能缓解口渴。', 效果: [] },
  初级恢复药剂: {
    价格: 500,
    货币: '联邦币',
    类型: '药剂',
    描述: '能恢复少量魂力和体力，战斗后的应急用品。',
    效果: [
      { 目标: '属性.魂力', 类型: 'percentage', 数值: 0.15, 目标上限: '属性.魂力上限' },
      { 目标: '属性.体力', 类型: 'percentage', 数值: 0.15, 目标上限: '属性.体力上限' },
    ],
  },
  中级恢复药剂: {
    价格: 2000,
    货币: '联邦币',
    类型: '药剂',
    描述: '效果显著的恢复药剂，能应对大多数战斗消耗。',
    效果: [
      { 目标: '属性.魂力', 类型: 'percentage', 数值: 0.35, 目标上限: '属性.魂力上限' },
      { 目标: '属性.体力', 类型: 'percentage', 数值: 0.35, 目标上限: '属性.体力上限' },
    ],
  },
  高级恢复药剂: {
    价格: 8000,
    货币: '联邦币',
    类型: '药剂',
    描述: '珍贵的强效恢复药剂，关键时刻能扭转战局。',
    效果: [
      { 目标: '属性.魂力', 类型: 'percentage', 数值: 0.7, 目标上限: '属性.魂力上限' },
      { 目标: '属性.体力', 类型: 'percentage', 数值: 0.7, 目标上限: '属性.体力上限' },
    ],
  },
  精神恢复冥想香: {
    价格: 1500,
    货币: '联邦币',
    类型: '药剂',
    描述: '点燃后能帮助魂师快速集中精神，恢复消耗的精神力。',
    效果: [{ 目标: '属性.精神力', 类型: 'percentage', 数值: 0.25, 目标上限: '属性.精神力上限' }],
  },
  基础解毒散: {
    价格: 300,
    货币: '联邦币',
    类型: '药剂',
    描述: '可以解除一些百年魂兽的普通毒素。',
    效果: [{ 目标: '属性.状态效果', 类型: 'remove_by_name', 数值: '普通中毒' }],
  },
  千年解毒丹: {
    价格: 2500,
    货币: '联邦币',
    类型: '药剂',
    描述: '能有效化解千年魂兽的剧毒，是魂师深入森林的保障。',
    效果: [{ 目标: '属性.状态效果', 类型: 'remove_by_name', 数值: '千年剧毒' }],
  },
  力量增幅药剂: {
    价格: 1200,
    货币: '联邦币',
    类型: '药剂',
    描述: '饮用后短时间内肌肉膨胀，力量获得显著提升。',
    效果: [
      {
        目标: '属性.状态效果',
        类型: 'add',
        数值: { 力量增幅: { 类型: 'buff', 层数: 1, 描述: '力量临时提升15%，持续3回合。', stat_mods: { str: 1.15 } } },
      },
    ],
  },
  野外生存帐篷: {
    价格: 1000,
    货币: '联邦币',
    类型: '工具',
    描述: '在野外提供一个相对安全的休息点。',
    效果: [],
  },
  照明魂导器: {
    价格: 800,
    货币: '联邦币',
    类型: '工具',
    描述: '最基础的手持照明工具，比火把方便得多。',
    效果: [],
  },
  普通铁锭: {
    价格: 200,
    货币: '联邦币',
    类型: '材料',
    描述: '最基础的锻造材料，用于练习或打造低级工具。',
    效果: [],
  },
  百锻精铁: {
    价格: 1500,
    货币: '联邦币',
    类型: '材料',
    描述: '经过百次锻打的精铁，是打造魂导器的入门材料。',
    效果: [],
  },
  一级能量核心: {
    价格: 1000,
    货币: '联邦币',
    类型: '材料',
    描述: '为低级魂导器供能的标准电池。',
    效果: [],
  },
  二级能量核心: {
    价格: 5000,
    货币: '联邦币',
    类型: '材料',
    描述: '能量输出更稳定的二级核心，适用于中阶魂导器。',
    效果: [],
  },
};

const TangmenShopProducts = {
  玄天功秘籍: {
    价格: 500,
    货币: '唐门积分',
    类型: '功法',
    描述: '唐门基础内功心法，修炼后可大幅提升魂力恢复速度与精纯度。',
    需求: { 势力: '唐门' },
    效果: [{ 目标: '功法', 类型: 'add', 数值: { 玄天功: { 境界: '入门', lv: 1, exp: 0, 描述: '唐门绝学' } } }],
  },
  紫极魔瞳秘籍: {
    价格: 500,
    货币: '唐门积分',
    类型: '功法',
    描述: '唐门瞳术，修炼后可提升视力、动态视觉与精神力。',
    需求: { 势力: '唐门' },
    效果: [{ 目标: '功法', 类型: 'add', 数值: { 紫极魔瞳: { 境界: '入门', lv: 1, exp: 0, 描述: '唐门绝学' } } }],
  },
  暗器百解: {
    价格: 2000,
    货币: '唐门积分',
    类型: '技术',
    描述: '记录了唐门上百种暗器制作与手法的总纲。',
    需求: { 势力: '唐门', 阶级: ['黄级', '紫级', '黑级', '红级', '长老', '殿主'] },
    效果: [
      { 目标: '功法', 类型: 'add', 数值: { 暗器百解: { 境界: '入门', lv: 1, exp: 0, 描述: '唐门暗器总纲' } } },
    ],
  },
  百年炽火阳泉草: {
    价格: 8000,
    货币: '唐门积分',
    类型: '灵物',
    描述: '生长于冰火两仪眼阳泉旁的百年灵草，蕴含纯粹的火属性能量。',
    需求: { 势力: '唐门', 阶级: ['黄级', '紫级', '黑级', '红级', '长老', '殿主'] },
    效果: [{ 目标: '状态.吸收灵物年限', 类型: 'set', 数值: 100 }],
  },
  千年寒极冰晶花: {
    价格: 50000,
    货币: '唐门积分',
    类型: '灵物',
    描述: '生长于冰火两仪眼寒泉旁的千年奇花，蕴含极致的冰属性能量。',
    需求: { 势力: '唐门', 阶级: ['紫级', '黑级', '红级', '长老', '殿主'] },
    效果: [{ 目标: '状态.吸收灵物年限', 类型: 'set', 数值: 1000 }],
  },
  万年望穿秋水露: {
    价格: 250000,
    货币: '唐门积分',
    类型: '灵物',
    描述: '冰火两仪眼孕育的万年仙品，服用后可极大增强精神力与视力。',
    需求: { 势力: '唐门', 阶级: ['红级', '长老', '殿主'] },
    效果: [{ 目标: '状态.吸收灵物年限', 类型: 'set', 数值: 10000 }],
  },
  万年魂骨兑换凭证: {
    价格: 500000,
    货币: '唐门积分',
    类型: '战略资源',
    描述: '唐门最高级别的奖励之一。可从宗门宝库中挑选一块万年魂骨。',
    需求: { 势力: '唐门', 阶级: ['红级', '长老', '殿主'] },
    效果: [
      { 目标: '背包', 类型: 'add', 数值: { '万年魂骨(未指定)': { 数量: 1, 类型: '魂骨', 品质: '万年' } } },
    ],
  },
};

const ShrekAcademyShopProducts = {
  百年龙鳞果: {
    价格: 500,
    货币: '学院积分',
    类型: '灵物',
    描述: '百年级别的灵果，能小幅强化气血。',
    需求: { 势力: '史莱克学院' },
    效果: [{ 目标: '状态.吸收灵物年限', 类型: 'set', 数值: 100 }],
  },
  千年海心莲子: {
    价格: 8000,
    货币: '学院积分',
    类型: '灵物',
    描述: '千年级别的仙品莲子，能显著提升精神力。',
    需求: { 势力: '史莱克学院' },
    效果: [{ 目标: '状态.吸收灵物年限', 类型: 'set', 数值: 1000 }],
  },
  万年绮罗郁金香: {
    价格: 120000,
    货币: '学院积分',
    类型: '灵物',
    描述: '万年级别的仙品，服用后可百毒不侵。',
    需求: { 势力: '史莱克学院', 阶级: ['内院弟子', '史莱克七怪', '老师', '宿老', '阁主'] },
    效果: [{ 目标: '状态.吸收灵物年限', 类型: 'set', 数值: 10000 }],
  },
  十万年绮罗郁金香: {
    价格: 3000000,
    货币: '学院积分',
    类型: '灵物',
    描述: '十万年级别的仙品，七字武魂突破八十级的重要门槛灵物。',
    需求: { 势力: '史莱克学院', 阶级: ['宿老', '阁主', '史莱克七怪'] },
    效果: [
      {
        目标: '背包',
        类型: 'add',
        数值: { 十万年绮罗郁金香: { 数量: 1, 类型: '灵物', 品质: '十万年', 描述: '七字武魂突破八十级的重要门槛灵物。' } },
      },
    ],
  },
  万年魂骨兑换凭证: {
    价格: 300000,
    货币: '学院积分',
    类型: '战略资源',
    描述: '史莱克学院内院的核心奖励。每人仅限兑换一次。',
    需求: {
      势力: '史莱克学院',
      阶级: ['内院弟子', '史莱克七怪', '老师', '宿老', '阁主'],
      限购标记: 'redeemed_10k_bone',
    },
    效果: [
      { 目标: '背包', 类型: 'add', 数值: { '万年魂骨(未指定)': { 数量: 1, 类型: '魂骨', 品质: '万年' } } },
    ],
  },
  十万年魂骨兑换凭证: {
    价格: 1000000,
    货币: '学院积分',
    类型: '战略资源',
    描述: '史莱克学院的至高奖励。每人终身仅限兑换一次。',
    需求: { 势力: '史莱克学院', 阶级: ['宿老', '阁主', '史莱克七怪'], 限购标记: 'redeemed_100k_bone' },
    效果: [
      { 目标: '背包', 类型: 'add', 数值: { '十万年魂骨(未指定)': { 数量: 1, 类型: '魂骨', 品质: '十万年' } } },
    ],
  },
};

const AssociationShopProducts = {
  锻造师协会: {
    百锻金属块: {
      价格: 50000,
      货币: '联邦币',
      类型: '材料',
      描述: '经过百次锻打的金属，是锻造师的基础材料。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 百锻金属块: { 数量: 1, 类型: '材料', 品质: '百锻' } } }],
    },
    千锻金属块: {
      价格: 500000,
      货币: '联邦币',
      类型: '材料',
      描述: '千锤百炼的稀有金属，拥有了初步的灵性。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 千锻金属块: { 数量: 1, 类型: '材料', 品质: '千锻' } } }],
    },
    灵锻金属块: {
      价格: 10000000,
      货币: '联邦币',
      类型: '材料',
      描述: '被赋予生命的金属，是四级以上锻造师的杰作。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 灵锻金属块: { 数量: 1, 类型: '材料', 品质: '灵锻' } } }],
    },
    魂锻金属块: {
      价格: 80000000,
      货币: '联邦币',
      类型: '材料',
      描述: '与灵魂相融的金属，圣匠的标志。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 魂锻金属块: { 数量: 1, 类型: '材料', 品质: '魂锻' } } }],
    },
    天锻金属块: {
      价格: 500000000,
      货币: '联邦币',
      类型: '材料',
      描述: '引动天地法则淬炼而成的神级金属。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 天锻金属块: { 数量: 1, 类型: '材料', 品质: '天锻' } } }],
    },
  },
  设计师协会: {
    一字斗铠设计图: {
      价格: 100000,
      货币: '联邦币',
      类型: '图纸',
      描述: '标准的一字斗铠设计蓝图。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 一字斗铠设计图: { 数量: 1, 类型: '图纸' } } }],
    },
    二字斗铠设计图: {
      价格: 2000000,
      货币: '联邦币',
      类型: '图纸',
      描述: '蕴含领域雏形的二字斗铠设计图。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 二字斗铠设计图: { 数量: 1, 类型: '图纸' } } }],
    },
    三字斗铠设计图: {
      价格: 20000000,
      货币: '联邦币',
      类型: '图纸',
      描述: '能够赋予斗铠真正领域的三字斗铠设计图。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 三字斗铠设计图: { 数量: 1, 类型: '图纸' } } }],
    },
    四字斗铠设计图: {
      价格: 150000000,
      货币: '联邦币',
      类型: '图纸',
      描述: '传说中的四字斗铠设计图。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 四字斗铠设计图: { 数量: 1, 类型: '图纸' } } }],
    },
  },
  机甲师协会: {
    黄级机甲现货: {
      价格: 6000000,
      货币: '联邦币',
      类型: '装备',
      描述: '制式黄级机甲(流水线白板，品质系数1.0)。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 黄级机甲现货: { 数量: 1, 类型: '装备', 品质: '黄级' } } }],
    },
    紫级机甲现货: {
      价格: 80000000,
      货币: '联邦币',
      类型: '装备',
      描述: '制式紫级机甲(流水线白板，品质系数1.0)。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 紫级机甲现货: { 数量: 1, 类型: '装备', 品质: '紫级' } } }],
    },
    黑级机甲现货: {
      价格: 1000000000,
      货币: '联邦币',
      类型: '装备',
      描述: '制式黑级机甲(流水线白板，品质系数1.0)。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 黑级机甲现货: { 数量: 1, 类型: '装备', 品质: '黑级' } } }],
    },
    红级机甲定制: {
      价格: 5000000000,
      货币: '联邦币',
      类型: '服务',
      描述: '神级机甲的顶级代工定制服务(需自备神级材料)。',
      效果: [],
    },
  },
  修理师协会: {
    基础维护套件: {
      价格: 50000,
      货币: '联邦币',
      类型: '消耗品',
      描述: '用于机甲和魂导器的日常保养。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 基础维护套件: { 数量: 1, 类型: '消耗品' } } }],
    },
    精密修复模块: {
      价格: 500000,
      货币: '联邦币',
      类型: '消耗品',
      描述: '可以修复机甲或斗铠的中度损伤。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 精密修复模块: { 数量: 1, 类型: '消耗品' } } }],
    },
    机甲超频模块: {
      价格: 500000,
      货币: '联邦币',
      类型: '消耗品',
      描述: '一次性模块，能让机甲在短时间内爆发出超越极限的性能。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 机甲超频模块: { 数量: 1, 类型: '消耗品' } } }],
    },
    斗铠本源蕴养液: {
      价格: 20000000,
      货币: '联邦币',
      类型: '消耗品',
      描述: '极其珍贵的蕴养液，能修复受损的斗铠本源。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 斗铠本源蕴养液: { 数量: 1, 类型: '消耗品' } } }],
    },
    神级重塑核心: {
      价格: 500000000,
      货币: '联邦币',
      类型: '核心部件',
      描述: '传说中的物品，据说能让彻底损毁的斗铠甚至神器重获新生。',
      效果: [{ 目标: '背包', 类型: 'add', 数值: { 神级重塑核心: { 数量: 1, 类型: '核心部件' } } }],
    },
  },
};

function markPlayerCharacterInSchemaInput(rawInput) {
  if (!rawInput || typeof rawInput !== 'object' || Array.isArray(rawInput)) return rawInput;
  const clonedInput = _.cloneDeep(rawInput);
  const markCandidate = candidate => {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return;
    const playerName = String(candidate?.sys?.玩家名 || '').trim();
    const charMap = candidate?.char;
    if (!playerName || !charMap || typeof charMap !== 'object' || Array.isArray(charMap)) return;
    Object.values(charMap).forEach(charData => {
      if (charData && typeof charData === 'object' && !Array.isArray(charData)) {
        delete charData.__mvu_isPlayer;
      }
    });
    if (charMap[playerName] && typeof charMap[playerName] === 'object' && !Array.isArray(charMap[playerName])) {
      charMap[playerName].__mvu_isPlayer = true;
      return;
    }
    const matchedKey = Object.keys(charMap).find(charKey => {
      const charData = charMap[charKey];
      if (!charData || typeof charData !== 'object' || Array.isArray(charData)) return false;
      const displayName = String(charData?.name || charData?.属性?.name || charData?.base?.name || charKey || '').trim();
      return displayName === playerName;
    });
    if (matchedKey) {
      charMap[matchedKey].__mvu_isPlayer = true;
    }
  };
  [clonedInput, clonedInput.stat_data, clonedInput.display_data].forEach(markCandidate);
  return clonedInput;
}

const SchemaRootObject = z
  .object({
    sys: z
      .object({
        玩家名: z.string().prefault('无名氏').describe('当前玩家角色姓名'),
        系统播报: z.string().prefault('初始化').describe('最近一次系统广播、突破提示或结算摘要'),
        最近检定: z.coerce.number().prefault(0).describe('最近一次D100物理检定客观点数'),
        最终成功率: z.coerce.number().prefault(0).describe('当前交互行为的最终成功率'),
      })
      .prefault({}),
    char: z.record(z.string(), CharacterSchema).prefault({}),
    org: z.record(z.string(), FactionSchema).prefault({}),
    world: z
      .object({
        时间: z
          .object({
            tick: z.coerce.number().prefault(0),
            _上次结算tick: z.coerce.number().prefault(0),
            _calendar: z.string().prefault('斗罗历X年X月X日 HH:MM'),
          })
          .prefault({}),
        偏差值: z.coerce.number().prefault(0).describe('世界线偏差值(0-100)'),
        偏差倍率: z.coerce.number().prefault(1.0).describe('偏差值累计倍率'),
        累计击杀年限: z.coerce.number().prefault(0).describe('星斗大森林累计被杀魂兽年限'),
        兽潮已触发: z.boolean().prefault(false),
        传灵塔千年魂灵开放: z.boolean().prefault(false),
        时间线: z
          .record(
            z.string(),
            z
              .object({
                触发tick: z.coerce.number().prefault(0),
                事件: z.string().prefault('无'),
                状态: z.string().prefault('pending'),
              })
              .prefault({}),
          )
          .prefault({}),
        机密情报: z
          .record(
            z.string(),
            z
              .object({
                标题: z.string().prefault('无'),
                内容: z.string().prefault('无'),
                知情规则: z.array(z.string()).prefault([]),
                知情对象: z.array(z.string()).prefault([]),
                核实状态: z.string().prefault('可疑').describe('可疑/待核实/已核实/误报'),
                核实进度: z.coerce.number().prefault(0).describe('当前情报核实推进值'),
                最近核实结果: z.string().prefault('无').describe('最近一次核实结果'),
                最近核实tick: z.coerce.number().prefault(0).describe('最近一次核实发生时间'),
                触发来源: z.string().prefault('无').describe('最近一次核实触发来源'),
                证据权重: z.coerce.number().prefault(0).describe('支持该情报为真的证据权重'),
                反证权重: z.coerce.number().prefault(0).describe('指向该情报为误报的反证权重'),
                证据来源列表: z.array(z.string()).prefault([]).describe('参与核实的来源列表'),
                核实阈值: z.coerce.number().prefault(3).describe('达到核实成功所需净证据阈值'),
                最后证据tick: z.coerce.number().prefault(0).describe('最近一次证据更新tick'),
              })
              .prefault({}),
          )
          .prefault({}),
        拍卖: z
          .object({
            状态: z.string().prefault('休市'),
            下次刷新tick: z.coerce.number().prefault(7),
            地点: z.string().prefault('无'),
            拍品: z
              .record(
                z.string(),
                z
                  .object({
                    品级: z.string().prefault('低阶'),
                    背景: z.string().prefault('无'),
                    价格: z.coerce.number().prefault(0),
                  })
                  .prefault({}),
              )
              .prefault({}),
          })
          .prefault({}),
        交易请求: z
          .object({
            动作: z.string().prefault('无').describe('AI或剧情发起的交易模块请求类型'),
            目标: z.string().prefault('').describe('交易地点、店铺或拍卖目标'),
            对象: z.string().prefault('').describe('交易对象NPC'),
            物品: z.string().prefault('').describe('交易物品名称'),
            数量: z.coerce.number().prefault(1).describe('交易数量'),
            价格: z.coerce.number().prefault(0).describe('单价或出价'),
            货币: z.string().prefault('联邦币').describe('货币类型'),
            状态: z.string().prefault('pending').describe('pending/opened/handled/无'),
            自动执行: z.boolean().prefault(false).describe('是否允许前端交易模块自动提交仲裁'),
            来源: z.string().prefault('AI').describe('请求来源'),
          })
          .prefault({}),
        委托板: z
          .record(
            z.string(),
            z
              .object({
                标题: z.string().prefault('无'),
                类型: z.string().prefault('委托'),
                描述: z.string().prefault('无'),
                框架描述: z.string().prefault('无'),
                发布者: z.string().prefault('系统'),
                面向: z.string().prefault('公开'),
                指定对象: z.string().prefault('无'),
                状态: z.string().prefault('待接取'),
                难度: z.string().prefault('中'),
                资源级别: z.string().prefault('无'),
                目标进度: z.coerce.number().prefault(1),
                奖励币: z.coerce.number().prefault(0),
                奖励声望: z.coerce.number().prefault(0),
                承接者: z.string().prefault('无'),
                生成tick: z.coerce.number().prefault(0),
              })
              .prefault({}),
          )
          .prefault({}),
        地点: z
          .record(
            z.string().describe('地点名称'),
            z
              .object({
                掌控势力: z.string().prefault('未知'),
                人口: z.coerce.number().prefault(0),
                守护军团: z.string().prefault('无'),
                经济状况: z.enum(['繁荣', '普通', '萧条', '未知']).prefault('未知'),
                x: z.coerce.number().prefault(-1),
                y: z.coerce.number().prefault(-1),
                类型: z.string().prefault('地图节点'),
                描述: z.string().prefault('无'),
                状态: z.string().prefault('intact'),
                图标: z.string().prefault('node'),
                节点类别: z.string().prefault(''),
                交互: z.array(z.string()).prefault([]),
                服务: z.array(z.string()).prefault([]),
                行动槽: z.array(z.string()).prefault([]),
                事件ID: z.string().prefault(''),
                子节点: z.record(z.string(), z.any()).prefault({}),
                商店: z
                  .record(
                    z.string().describe('商店名，如：传灵塔分店'),
                    z
                      .object({
                        库存: z
                          .record(
                            z.string().describe('商品ID或名称'),
                            z
                              .object({
                                价格: z.coerce.number().prefault(0).describe('价格'),
                                货币: z.string().prefault('联邦币').describe('货币类型'),
                                类型: z.string().prefault('物品').describe('商品类型'),
                                库存: z.coerce.number().prefault(0).describe('库存'),
                                需求声望: z.coerce.number().prefault(0).describe('声望要求'),
                                描述: z.string().prefault('').describe('物品描述'),
                                效果: z.array(z.any()).prefault([]).describe('购买效果'),
                                需求: z.record(z.string(), z.any()).prefault({}).describe('额外兑换条件'),
                              })
                              .prefault({}),
                          )
                          .prefault({})
                          .describe('商品库存列表'),
                        _下次刷新tick: z.coerce.number().prefault(0).describe('下次刷新时间'),
                      })
                      .prefault({}),
                  )
                  .prefault({})
                  .describe('该城市拥有的商店列表'),
              })
              .prefault({}),
          )
          .prefault({})
          .describe('世界主要地点的数据化索引'),

        动态地点: z
          .record(
            z.string().describe('动态生成的具体地点名称，如：东海学院旁小吃街'),
            z
              .object({
                归属父节点: z.string().describe('归属父节点名称'),
                层级: z.coerce
                  .number()
                  .prefault(4)
                  .describe('2=大地图主城/遗迹；3=城内大型设施/学院；4=街区/小店/营地'),
                描述: z.string().prefault('无'),
                x: z.coerce.number().prefault(-1).describe('地图坐标X'),
                y: z.coerce.number().prefault(-1).describe('地图坐标Y'),
                地图ID: z.string().prefault('无'),
                节点类型: z
                  .any()
                  .transform(value => normalizeDynamicLocationNodeType(value))
                  .prefault('未知')
                  .describe('地点类型'),
                图标: z.string().prefault('marker').describe('前端渲染使用的图标标识'),
                所属城镇ID: z.string().prefault('无').describe('归属城市ID'),
                势力: z.string().prefault('未知'),
                重要度: z.coerce.number().prefault(0),
                状态: z.string().prefault('intact'),
                节点类别: z.string().prefault(''),
                交互: z.array(z.string()).prefault([]),
                服务: z.array(z.string()).prefault([]),
                事件ID: z.string().prefault(''),
              })
              .prefault({}),
          )
          .prefault({})
          .transform(地点数据 => {
            _(地点数据).forEach((locData, locName) => {
              locData.节点类型 = normalizeDynamicLocationNodeType(locData.节点类型, locData.层级, locName);
              if (locData.x === -1 || locData.y === -1) {
                const siblingCoords = new Set();
                _(地点数据).forEach(otherLoc => {
                  if (otherLoc.归属父节点 === locData.归属父节点 && otherLoc.x !== -1 && otherLoc.y !== -1) {
                    siblingCoords.add(`${otherLoc.x},${otherLoc.y}`);
                  }
                });
                let newX, newY;
                let isDuplicate = true;
                let attempts = 0;
                while (isDuplicate && attempts < 100) {
                  newX = Math.floor(Math.random() * 3100);
                  newY = Math.floor(Math.random() * 2200);
                  if (!siblingCoords.has(`${newX},${newY}`)) {
                    isDuplicate = false;
                  }
                  attempts++;
                }

                locData.x = newX;
                locData.y = newY;
                siblingCoords.add(`${newX},${newY}`);
              }
            });
            return 地点数据;
          })
          .describe('随剧情动态拓展的子地图节点'),
        图鉴: z
          .record(
            z.string().describe('物种或怪物名称，如：巴安'),
            z
              .object({
                交手次数: z.coerce.number().prefault(0),
                击杀次数: z.coerce.number().prefault(0),
                图鉴档位: z.string().prefault('初识'),
                当前档经验: z.coerce.number().prefault(0),
                下档需求: z.coerce.number().prefault(3),
                最近活跃tick: z.coerce.number().prefault(0),
                最近升档tick: z.coerce.number().prefault(0),
                探索收益: z.coerce.number().prefault(0),
                战斗收益: z.coerce.number().prefault(0),
                成长倾向: z.string().prefault('均衡'),
                任务协同系数: z.coerce.number().prefault(1),
                情报协同系数: z.coerce.number().prefault(1),
                最近战斗标签: z.string().prefault('未知'),
                战斗样本数: z.coerce.number().prefault(0),
                战斗标签样本: z.record(z.string(), z.coerce.number()).prefault({}),
              })
              .catchall(z.any())
              .prefault({}),
          )
          .prefault({})
          .describe('怪物图鉴，记录已遭遇怪物的标准数据'),
        战斗: z
          .object({
            进行中: z.boolean().prefault(false).describe('是否处于战斗中'),
            战斗类型: z.string().prefault('未知').describe('战斗烈度，决定是否触发锁血保护与死亡结算'),
            先攻: z
              .string()
              .prefault('无')
              .describe('掌握先手权的角色名。若为"无"则代表公平开局；若有名字则代表突发偷袭，防守方首回合反应率减半'),
            允许撤离: z.boolean().prefault(true).describe('是否允许逃跑。若为false则代表背水一战，触发困兽机制'),
            回合: z.coerce.number().prefault(0).describe('当前回合数'),
            环境: z.string().prefault('正常').describe('战场环境或全局领域法则'),
            战斗意图: z
              .enum(['点到为止', '尽量生擒', '重伤压制', '必杀'])
              .prefault('点到为止')
              .describe('本次战斗的主观意图，决定是否允许致死与前端建议结局'),
            裁断结果: z.string().prefault(''),
            参战者: z
              .record(z.string().describe('参战槽位或参战者姓名'), z.any())
              .prefault({})
              .describe('当前战场所有参战单位的实时状态'),
          })
          .prefault({}),
      })
      .prefault({}),
  })
  .prefault({});

export const Schema = z
  .preprocess(markPlayerCharacterInSchemaInput, SchemaRootObject)
  .transform(data => {
    if (!data || typeof data !== 'object') data = {};

    const hasSchemaRootFields = value =>
      !!value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      (typeof value.sys === 'object' ||
        typeof value.world === 'object' ||
        typeof value.org === 'object' ||
        typeof value.char === 'object');
    const countSchemaRootFields = value => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return 0;
      return ['sys', 'world', 'org', 'char'].filter(key => !!value[key] && typeof value[key] === 'object').length;
    };
    const rootCandidates = [data, data.stat_data, data.display_data];
    let bestRootCandidate = data;
    let bestRootScore = countSchemaRootFields(data);
    let bestRootSize = Object.keys(data || {}).length;
    rootCandidates.forEach(candidate => {
      if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return;
      const score = countSchemaRootFields(candidate);
      const size = Object.keys(candidate).length;
      if (score > bestRootScore || (score === bestRootScore && size > bestRootSize)) {
        bestRootCandidate = candidate;
        bestRootScore = score;
        bestRootSize = size;
      }
    });
    if (bestRootCandidate !== data && bestRootScore > 0) {
      data = _.cloneDeep(bestRootCandidate);
    }

    if (!data.sys || typeof data.sys !== 'object') data.sys = {};
    if (!data.char || typeof data.char !== 'object') data.char = {};

    if (hasSchemaRootFields(data.char?.stat_data)) {
      data.char = _.cloneDeep(data.char.stat_data.char || {});
    } else if (
      data.char &&
      typeof data.char === 'object' &&
      data.char.display_data &&
      typeof data.char.display_data === 'object' &&
      data.char.display_data.char &&
      typeof data.char.display_data.char === 'object' &&
      Object.keys(data.char).length <= 8
    ) {
      data.char = _.cloneDeep(data.char.display_data.char);
    }

    if (!data.org || typeof data.org !== 'object') data.org = {};
    if (!data.world || typeof data.world !== 'object') data.world = {};
    if (data.map && typeof data.map === 'object') delete data.map;
    if (!data.world.时间 || typeof data.world.时间 !== 'object') data.world.时间 = {};
    if (!data.world.时间线 || typeof data.world.时间线 !== 'object') data.world.时间线 = {};
    if (!data.world.机密情报 || typeof data.world.机密情报 !== 'object') data.world.机密情报 = {};
    if (!data.world.动态地点 || typeof data.world.动态地点 !== 'object')
      data.world.动态地点 = {};
    if (!data.world.地点 || typeof data.world.地点 !== 'object') data.world.地点 = {};

    const RESERVED_CHAR_KEYS = new Set([
      'display_data',
      'delta_data',
      'stat_data',
      'initialized_lorebooks',
      'schema',
      'sys',
      'world',
      'org',
      'char',
      'variables',
      'payload',
      'root',
      'data',
    ]);
    Object.keys(data.char).forEach(charKey => {
      if (RESERVED_CHAR_KEYS.has(charKey)) {
        delete data.char[charKey];
        return;
      }
      const charData = data.char[charKey];
      if (!charData || typeof charData !== 'object' || Array.isArray(charData)) {
        delete data.char[charKey];
      }
    });
    Object.values(data.char).forEach(charData => {
      if (charData && typeof charData === 'object' && !Array.isArray(charData)) {
        delete charData.__mvu_isPlayer;
      }
    });

    if (typeof data.sys.玩家名 !== 'string' || !data.sys.玩家名.trim()) data.sys.玩家名 = '无名氏';
    if (typeof data.sys.系统播报 !== 'string' || !data.sys.系统播报.trim()) data.sys.系统播报 = '初始化';
    data.sys.最近检定 = Number(data.sys.最近检定 || 0);
    const 是否角色初始化补齐阶段 =
      data.sys.系统播报 === '初始化' && Math.max(0, Number(data.world?.时间?.tick || 0)) === 0;

    const appendSystemReasonText = text => {
      const safeText = String(text || '').trim();
      if (!safeText) return;
      追加系统播报文本(data, safeText);
    };

    const appendSystemReasonBatchText = (label, entries = [], options = {}) => {
      const safeLabel = String(label || '').trim();
      const normalizedEntries = Array.from(new Set((Array.isArray(entries) ? entries : [])
        .map(item => String(item || '').trim())
        .filter(Boolean)));
      if (!safeLabel || !normalizedEntries.length) return;
      const limit = Math.max(1, Number(options.limit || 3));
      const visible = normalizedEntries.slice(0, limit);
      const suffix = normalizedEntries.length > limit ? ` 等${normalizedEntries.length}项` : '';
      appendSystemReasonText(`${safeLabel} ${visible.join('；')}${suffix}`);
    };

    const compactInternalSystemReasonText = rawText => {
      const source = String(rawText || '').trim();
      if (!source) return source;
      const timelineMatches = Array.from(source.matchAll(/\[编年史推进待提交\]\s*([\s\S]*?)。已写入\s*\/world\/时间线\/[\s\S]*?handled。/g));
      const intelMatches = Array.from(source.matchAll(/\[机密情报待提交\]\s*【?([\s\S]*?)】?已写入\s*\/world\/机密情报\/[\s\S]*?handled。/g));
      let cleaned = source
        .replace(/\[编年史推进待提交\]\s*[\s\S]*?。已写入\s*\/world\/时间线\/[\s\S]*?handled。/g, ' ')
        .replace(/\[机密情报待提交\]\s*【?[\s\S]*?】?已写入\s*\/world\/机密情报\/[\s\S]*?handled。/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const summaryParts = [];
      if (timelineMatches.length) {
        const timelineItems = timelineMatches.map(match => String(match[1] || '').trim()).filter(Boolean);
        if (timelineItems.length) {
          const unique = Array.from(new Set(timelineItems));
          summaryParts.push(`[编年史待处理] ${unique.slice(0, 3).join('；')}${unique.length > 3 ? ` 等${unique.length}项` : ''}`);
        }
      }
      if (intelMatches.length) {
        const intelItems = intelMatches.map(match => String(match[1] || '').trim()).filter(Boolean);
        if (intelItems.length) {
          const unique = Array.from(new Set(intelItems));
          summaryParts.push(`[机密情报待处理] ${unique.slice(0, 3).join('；')}${unique.length > 3 ? ` 等${unique.length}项` : ''}`);
        }
      }
      return [cleaned, ...summaryParts].filter(Boolean).join(' ').trim() || source;
    };

    const upsertSecretIntel = (intelKey, payload = {}) => {
      const safeKey = String(intelKey || '').trim();
      if (!safeKey) return null;
      const previous = data.world.机密情报?.[safeKey];
      const next = {
        标题: '无',
        内容: '无',
        知情规则: [],
        知情对象: [],
        核实状态: '可疑',
        核实进度: 0,
        最近核实结果: '无',
        最近核实tick: 0,
        触发来源: '无',
        证据权重: 0,
        反证权重: 0,
        证据来源列表: [],
        核实阈值: 3,
        最后证据tick: 0,
        ...(previous && typeof previous === 'object' ? _.cloneDeep(previous) : {}),
        ...(payload && typeof payload === 'object' ? _.cloneDeep(payload) : {}),
      };
      if (!Array.isArray(next.知情规则)) next.知情规则 = [];
      if (!Array.isArray(next.知情对象)) next.知情对象 = [];
      if (!Array.isArray(next.证据来源列表)) next.证据来源列表 = [];
      const 核实状态白名单 = new Set(['可疑', '待核实', '已核实', '误报']);
      if (!核实状态白名单.has(String(next.核实状态 || '').trim())) next.核实状态 = '可疑';
      next.核实进度 = Math.max(0, Number(next.核实进度 || 0));
      next.最近核实结果 = String(next.最近核实结果 || '无').trim() || '无';
      next.最近核实tick = Math.max(0, Number(next.最近核实tick || 0));
      next.触发来源 = String(next.触发来源 || '无').trim() || '无';
      next.证据权重 = Math.max(0, Number(next.证据权重 || 0));
      next.反证权重 = Math.max(0, Number(next.反证权重 || 0));
      next.核实阈值 = Math.max(1, Number(next.核实阈值 || 3));
      next.最后证据tick = Math.max(0, Number(next.最后证据tick || 0));
      data.world.机密情报[safeKey] = next;
      return next;
    };

    const hasSecretIntel = intelKey => {
      const safeKey = String(intelKey || '').trim();
      return !!safeKey && !!data.world.机密情报?.[safeKey];
    };

    const getDefaultSecretIntelKnowers_ACU = intelKey => {
      const safeKey = String(intelKey || '').trim();
      if (!safeKey) return [];
      if (safeKey.includes('万年前的神界绝密布局')) {
        return ['唐三'];
      }
      if (safeKey.includes('血神军团镇守深渊位面')) {
        return ['史莱克高层', '战神殿高层', '传灵塔高层', '唐门高层', '联邦高层'];
      }
      return [];
    };

    const resolveSecretIntelKnowers_ACU = intelEntry => {
      const rawRules = Array.isArray(intelEntry?.知情规则)
        ? intelEntry.知情规则
        : (Array.isArray(intelEntry?.knowers) ? intelEntry.knowers : []);
      const fallbackRules = rawRules.length ? rawRules : getDefaultSecretIntelKnowers_ACU(intelEntry?.标题 || intelEntry?.内容 || '');
      const normalizedRules = Array.from(new Set(fallbackRules.map(item => String(item || '').trim()).filter(Boolean)));
      const resolvedTargets = [];
      const addTarget = name => {
        const safeName = String(name || '').trim();
        if (!safeName || resolvedTargets.includes(safeName)) return;
        resolvedTargets.push(safeName);
      };
      const matchFactionRule = (ruleText, factionName) => {
        const rule = String(ruleText || '').trim();
        const faction = String(factionName || '').trim();
        if (!rule || !faction) return false;
        const strippedRule = rule.replace(/高层/g, '').trim();
        if (!strippedRule) return false;
        if (rule === faction || strippedRule === faction) return true;
        if (rule.includes(faction) || faction.includes(strippedRule)) return true;
        if (strippedRule === '史莱克' && faction.includes('史莱克')) return true;
        if (strippedRule === '联邦' && faction.includes('联邦')) return true;
        return false;
      };

      normalizedRules.forEach(target => {
        if (data.char[target]) {
          addTarget(target);
          return;
        }
        _(data.char).forEach((charData, charName) => {
          const displayName = String(charData?.name || charData?.base?.name || charName || '').trim();
          if (displayName && displayName === target) {
            addTarget(charName);
            return;
          }
          _(charData?.社交?.势力 || {}).forEach((facData, facName) => {
            const isHighLevelRule = /高层/.test(target);
            if (isHighLevelRule) {
              if (matchFactionRule(target, facName) && Number(facData?.权限级 || 0) >= 7) addTarget(charName);
            } else if (matchFactionRule(target, facName)) {
              addTarget(charName);
            }
          });
        });
      });

      return { rules: normalizedRules, targets: resolvedTargets };
    };

    const refreshSecretIntelAudienceDistribution_ACU = () => {
      _(data.world.机密情报 || {}).forEach((intelEntry, intelKey) => {
        if (!intelEntry || typeof intelEntry !== 'object') return;
        const resolved = resolveSecretIntelKnowers_ACU({
          ...intelEntry,
          标题: intelEntry.标题 || intelKey,
        });
        intelEntry.知情规则 = resolved.rules;
        intelEntry.知情对象 = Array.from(new Set((Array.isArray(intelEntry.知情对象) ? intelEntry.知情对象 : []).concat(resolved.targets)));
        const 核实状态白名单 = new Set(['可疑', '待核实', '已核实', '误报']);
        if (!核实状态白名单.has(String(intelEntry.核实状态 || '').trim())) intelEntry.核实状态 = '可疑';
        intelEntry.核实进度 = Math.max(0, Number(intelEntry.核实进度 || 0));
        intelEntry.最近核实结果 = String(intelEntry.最近核实结果 || '无').trim() || '无';
        intelEntry.最近核实tick = Math.max(0, Number(intelEntry.最近核实tick || 0));
        intelEntry.触发来源 = String(intelEntry.触发来源 || '无').trim() || '无';
        intelEntry.证据权重 = Math.max(0, Number(intelEntry.证据权重 || 0));
        intelEntry.反证权重 = Math.max(0, Number(intelEntry.反证权重 || 0));
        intelEntry.核实阈值 = Math.max(1, Number(intelEntry.核实阈值 || 3));
        intelEntry.最后证据tick = Math.max(0, Number(intelEntry.最后证据tick || 0));
        if (!Array.isArray(intelEntry.证据来源列表)) intelEntry.证据来源列表 = [];
      });
    };

    let currentTick = Number(data.world.时间.tick || 0);
    data.world.时间.tick = currentTick;
    const 机密情报触发队列 = [];

    const 推入机密情报触发 = (来源 = '', 关键词 = []) => {
      const 安全来源 = String(来源 || '').trim();
      const 关键词列表 = Array.from(new Set((Array.isArray(关键词) ? 关键词 : [])
        .map(item => String(item || '').trim())
        .filter(Boolean)));
      if (!安全来源 || !关键词列表.length) return;
      机密情报触发队列.push({
        来源: 安全来源,
        关键词: 关键词列表,
      });
    };

    const 交易触发待处理标记 = '[交易触发待处理]';
    const 提取交易热度关键词 = 文本 => {
      const 原文 = String(文本 || '');
      const 关键词 = [];
      if (/\[买入热\]/.test(原文)) 关键词.push('买入热');
      if (/\[卖出热\]/.test(原文)) 关键词.push('卖出热');
      if (/\[竞拍热\]/.test(原文)) 关键词.push('竞拍热');
      if (/\[兑换热\]/.test(原文)) 关键词.push('兑换热');
      const 物品匹配 = 原文.match(/【([^】]{1,40})】/g) || [];
      物品匹配.slice(0, 2).forEach(文本片段 => {
        const 名称 = String(文本片段 || '').replace(/[【】]/g, '').trim();
        if (名称) 关键词.push(名称);
      });
      const 地点匹配 = 原文.match(/在([^，。！？\s]{1,24})/);
      if (地点匹配 && 地点匹配[1]) 关键词.push(String(地点匹配[1]).trim());
      return Array.from(new Set(关键词.filter(Boolean)));
    };

    const 消费交易触发标记并推入情报 = () => {
      if (!data || !data.sys || typeof data.sys !== 'object') return;
      const 播报原文 = String(data.sys.系统播报 || '').trim();
      if (!播报原文 || !播报原文.includes(交易触发待处理标记)) return;
      const 热度关键词 = 提取交易热度关键词(播报原文);
      if (热度关键词.length > 0) {
        推入机密情报触发('交易', 热度关键词);
      }
      data.sys.系统播报 = 播报原文.replace(/\[交易触发待处理\]/g, '').replace(/\s{2,}/g, ' ').trim();
    };

    const 获取任务阶段跨度 = 任务条目 => {
      const 目标进度 = Math.max(1, Number(任务条目?.目标进度 || 1));
      return Math.max(1, Math.ceil(目标进度 / 3));
    };

    const 计算任务阶段号 = 任务条目 => {
      const 当前进度 = Math.max(0, Number(任务条目?.当前进度 || 0));
      const 目标进度 = Math.max(1, Number(任务条目?.目标进度 || 1));
      const 阶段跨度 = 获取任务阶段跨度(任务条目);
      const 阶段总数 = Math.max(1, Math.ceil(目标进度 / 阶段跨度));
      const 阶段号 = Math.floor(当前进度 / 阶段跨度) + 1;
      return Math.max(1, Math.min(阶段总数, 阶段号));
    };

    const 补全任务条目字段 = (任务条目 = {}, 当前tick = 0) => {
      if (!任务条目 || typeof 任务条目 !== 'object' || Array.isArray(任务条目)) return null;
      if (!Array.isArray(任务条目.里程碑)) 任务条目.里程碑 = [];
      任务条目.失败计数 = Math.max(0, Number(任务条目.失败计数 || 0));
      任务条目.分支 = String(任务条目.分支 || '未判定').trim() || '未判定';
      任务条目.阶段 = Math.max(1, Number(任务条目.阶段 || 0)) || 1;
      任务条目.最后更新时间tick = Math.max(0, Number(任务条目.最后更新时间tick || 当前tick || 0));
      任务条目.情报贡献值 = Math.max(0, Number(任务条目.情报贡献值 || 0));
      任务条目.图鉴贡献值 = Math.max(0, Number(任务条目.图鉴贡献值 || 0));
      任务条目.风险级别 = String(任务条目.风险级别 || '中风险').trim() || '中风险';
      任务条目.推荐路线 = String(任务条目.推荐路线 || '主线').trim() || '主线';
      任务条目.最近爆发tick = Math.max(0, Number(任务条目.最近爆发tick || 0));
      if (!任务条目.阶段 || !Number.isFinite(Number(任务条目.阶段))) {
        任务条目.阶段 = 计算任务阶段号(任务条目);
      }
      return 任务条目;
    };

    const 记录任务里程碑 = (任务条目 = {}, 里程碑名 = '') => {
      if (!任务条目 || typeof 任务条目 !== 'object') return false;
      if (!Array.isArray(任务条目.里程碑)) 任务条目.里程碑 = [];
      const 安全名 = String(里程碑名 || '').trim();
      if (!安全名 || 任务条目.里程碑.includes(安全名)) return false;
      任务条目.里程碑.push(安全名);
      return true;
    };

    const 图鉴档位序列 = Object.freeze(['初识', '熟悉', '精研', '通晓', '猎王']);
    const 图鉴档位阈值表 = Object.freeze([
      Object.freeze({ 档位: '初识', 交手次数: 1, 击杀次数: 0, 探索收益: 0.005, 战斗收益: 0.005 }),
      Object.freeze({ 档位: '熟悉', 交手次数: 3, 击杀次数: 1, 探索收益: 0.01, 战斗收益: 0.01 }),
      Object.freeze({ 档位: '精研', 交手次数: 6, 击杀次数: 2, 探索收益: 0.015, 战斗收益: 0.015 }),
      Object.freeze({ 档位: '通晓', 交手次数: 10, 击杀次数: 3, 探索收益: 0.02, 战斗收益: 0.02 }),
      Object.freeze({ 档位: '猎王', 交手次数: 15, 击杀次数: 5, 探索收益: 0.03, 战斗收益: 0.03 }),
    ]);
    const 图鉴倾向映射表 = Object.freeze({
      速胜: '战斗向',
      险胜: '战斗向',
      消耗战: '探索向',
      失利: '探索向',
    });

    const 获取图鉴条目经验 = 图鉴条目 =>
      Math.max(0, Number(图鉴条目?.交手次数 || 0)) + Math.max(0, Number(图鉴条目?.击杀次数 || 0)) * 2;

    const 重算图鉴成长 = (图鉴条目 = {}, 当前tick = 0) => {
      if (!图鉴条目 || typeof 图鉴条目 !== 'object' || Array.isArray(图鉴条目)) return null;
      图鉴条目.交手次数 = Math.max(0, Number(图鉴条目.交手次数 || 0));
      图鉴条目.击杀次数 = Math.max(0, Number(图鉴条目.击杀次数 || 0));
      图鉴条目.最近战斗标签 = String(图鉴条目.最近战斗标签 || '未知').trim() || '未知';
      图鉴条目.战斗样本数 = Math.max(0, Number(图鉴条目.战斗样本数 || 0));
      if (!图鉴条目.战斗标签样本 || typeof 图鉴条目.战斗标签样本 !== 'object' || Array.isArray(图鉴条目.战斗标签样本)) {
        图鉴条目.战斗标签样本 = {};
      }
      Object.keys(图鉴条目.战斗标签样本).forEach(标签 => {
        图鉴条目.战斗标签样本[标签] = Math.max(0, Number(图鉴条目.战斗标签样本[标签] || 0));
      });

      const 原档位 = String(图鉴条目.图鉴档位 || '初识').trim() || '初识';
      let 当前阈值索引 = 0;
      图鉴档位阈值表.forEach((档位配置, 索引) => {
        if (图鉴条目.交手次数 >= Number(档位配置.交手次数 || 0) && 图鉴条目.击杀次数 >= Number(档位配置.击杀次数 || 0)) {
          当前阈值索引 = 索引;
        }
      });
      const 当前档位配置 = 图鉴档位阈值表[当前阈值索引] || 图鉴档位阈值表[0];
      图鉴条目.图鉴档位 = 当前档位配置.档位;
      图鉴条目.探索收益 = Number(当前档位配置.探索收益 || 0);
      图鉴条目.战斗收益 = Number(当前档位配置.战斗收益 || 0);
      const 当前经验 = 获取图鉴条目经验(图鉴条目);
      图鉴条目.当前档经验 = 当前经验;
      const 下档配置 = 图鉴档位阈值表[Math.min(图鉴档位阈值表.length - 1, 当前阈值索引 + 1)] || 当前档位配置;
      const 下档需求经验 = Number(下档配置.交手次数 || 0) + Number(下档配置.击杀次数 || 0) * 2;
      图鉴条目.下档需求 = Math.max(0, 下档需求经验);
      const 原活跃tick = Math.max(0, Number(图鉴条目.最近活跃tick || 0));
      图鉴条目.最近活跃tick = 当前经验 > 0 ? (原活跃tick > 0 ? 原活跃tick : Math.max(0, Number(当前tick || 0))) : 原活跃tick;
      const 是否升档 = 原档位 !== 当前档位配置.档位;
      if (是否升档) {
        图鉴条目.最近升档tick = Math.max(0, Number(当前tick || 图鉴条目.最近升档tick || 0));
      } else {
        图鉴条目.最近升档tick = Math.max(0, Number(图鉴条目.最近升档tick || 0));
      }

      const 战斗向样本 = Math.max(
        0,
        Number(图鉴条目?.战斗标签样本?.速胜 || 0) + Number(图鉴条目?.战斗标签样本?.险胜 || 0),
      );
      const 探索向样本 = Math.max(
        0,
        Number(图鉴条目?.战斗标签样本?.消耗战 || 0) + Number(图鉴条目?.战斗标签样本?.失利 || 0),
      );
      let 成长倾向 = '均衡';
      if (战斗向样本 > 探索向样本) 成长倾向 = '战斗向';
      else if (探索向样本 > 战斗向样本) 成长倾向 = '探索向';
      else {
        const 最近标签倾向 = 图鉴倾向映射表[图鉴条目.最近战斗标签] || '均衡';
        成长倾向 = 最近标签倾向;
      }
      图鉴条目.成长倾向 = 成长倾向;

      const 基础协同 = 1 + 当前阈值索引 * 0.015;
      let 任务协同系数 = 基础协同;
      let 情报协同系数 = 基础协同;
      if (成长倾向 === '战斗向') 任务协同系数 += 0.03;
      else if (成长倾向 === '探索向') 情报协同系数 += 0.03;
      else {
        任务协同系数 += 0.015;
        情报协同系数 += 0.015;
      }
      图鉴条目.任务协同系数 = Number(Math.max(1, 任务协同系数).toFixed(4));
      图鉴条目.情报协同系数 = Number(Math.max(1, 情报协同系数).toFixed(4));

      return {
        是否升档,
        原档位,
        新档位: 当前档位配置.档位,
        当前经验,
        下档需求经验,
      };
    };

    const 计算图鉴总被动 = () => {
      const 图鉴数据 = data.world?.图鉴 && typeof data.world.图鉴 === 'object' ? data.world.图鉴 : {};
      let 探索加成总和 = 0;
      let 战斗加成总和 = 0;
      let 任务协同总和 = 0;
      let 情报协同总和 = 0;
      let 条目数量 = 0;
      let 战斗向计数 = 0;
      let 探索向计数 = 0;
      const 升档播报项 = [];
      Object.entries(图鉴数据).forEach(([图鉴名, 图鉴条目]) => {
        const 成长结果 = 重算图鉴成长(图鉴条目, currentTick);
        if (!成长结果) return;
        条目数量 += 1;
        探索加成总和 += Number(图鉴条目.探索收益 || 0);
        战斗加成总和 += Number(图鉴条目.战斗收益 || 0);
        任务协同总和 += Math.max(1, Number(图鉴条目.任务协同系数 || 1));
        情报协同总和 += Math.max(1, Number(图鉴条目.情报协同系数 || 1));
        if (String(图鉴条目.成长倾向 || '') === '战斗向') 战斗向计数 += 1;
        if (String(图鉴条目.成长倾向 || '') === '探索向') 探索向计数 += 1;
        if (成长结果.是否升档) {
          升档播报项.push(`${图鉴名}:${成长结果.原档位}→${成长结果.新档位}`);
        }
      });
      if (升档播报项.length) {
        appendSystemReasonBatchText('[节点爆发][图鉴]', 升档播报项, { limit: 2 });
      }
      const 主成长倾向 = 战斗向计数 > 探索向计数 ? '战斗向' : 探索向计数 > 战斗向计数 ? '探索向' : '均衡';
      return {
        探索加成: Math.max(0, Number(探索加成总和.toFixed(4))),
        战斗加成: Math.max(0, Number(战斗加成总和.toFixed(4))),
        任务协同系数: Number((条目数量 > 0 ? 任务协同总和 / 条目数量 : 1).toFixed(4)),
        情报协同系数: Number((条目数量 > 0 ? 情报协同总和 / 条目数量 : 1).toFixed(4)),
        主成长倾向,
      };
    };

    const 图鉴总被动 = 计算图鉴总被动();

    const 应用图鉴被动到角色 = (角色 = {}, 角色名 = '') => {
      if (!角色 || typeof 角色 !== 'object') return;
      if (!角色.属性 || typeof 角色.属性 !== 'object') return;
      if (!角色.属性.状态效果 || typeof 角色.属性.状态效果 !== 'object') 角色.属性.状态效果 = {};
      const 探索加成 = Math.max(0, Number(图鉴总被动.探索加成 || 0));
      const 战斗加成 = Math.max(0, Number(图鉴总被动.战斗加成 || 0));
      if (!(探索加成 > 0 || 战斗加成 > 0)) {
        delete 角色.属性.状态效果['图鉴研究增益'];
        return;
      }
      角色.属性.状态效果['图鉴研究增益'] = {
        类型: 'buff',
        层数: 1,
        描述: `由图鉴研究积累带来的稳定增益(探索+${Math.round(探索加成 * 100)}%/战斗+${Math.round(战斗加成 * 100)}%)`,
        stat_mods: {
          str: Number((1 + 战斗加成).toFixed(4)),
          def: Number((1 + 战斗加成 * 0.7).toFixed(4)),
          agi: Number((1 + 探索加成).toFixed(4)),
          sp_max: Number((1 + 探索加成 * 0.7).toFixed(4)),
        },
      };
      if (!角色.状态 || typeof 角色.状态 !== 'object') 角色.状态 = {};
      角色.状态.图鉴被动来源 = `${角色名 || '角色'}图鉴研究`;
    };

    const 计算情报证据净值总和 = () => {
      const 情报数据 = data.world?.机密情报 && typeof data.world.机密情报 === 'object' ? data.world.机密情报 : {};
      return Object.values(情报数据).reduce((总和, 条目) => {
        if (!条目 || typeof 条目 !== 'object') return 总和;
        return 总和 + (Number(条目.证据权重 || 0) - Number(条目.反证权重 || 0));
      }, 0);
    };

    const 计算任务联动评分 = (任务条目 = {}) => {
      const 情报条目列表 = Object.values(data.world?.机密情报 || {}).filter(item => item && typeof item === 'object');
      const 已核实数 = 情报条目列表.filter(item => String(item.核实状态 || '') === '已核实').length;
      const 待核实数 = 情报条目列表.filter(item => String(item.核实状态 || '') === '待核实').length;
      const 误报数 = 情报条目列表.filter(item => String(item.核实状态 || '') === '误报').length;
      const 情报证据净值 = 计算情报证据净值总和();
      const 情报贡献值 = Math.max(0, Number((已核实数 * 2 + 待核实数 * 0.5 + 情报证据净值 * 0.2 - 误报数 * 1.5).toFixed(2)));

      const 图鉴条目列表 = Object.values(data.world?.图鉴 || {}).filter(item => item && typeof item === 'object');
      const 图鉴档位贡献值 = 图鉴条目列表.reduce((总和, 条目) => {
        const 档位索引 = Math.max(0, 图鉴档位序列.indexOf(String(条目.图鉴档位 || '初识')));
        return 总和 + 档位索引;
      }, 0);
      const 图鉴协同任务系数 = Math.max(1, Number(图鉴总被动.任务协同系数 || 1));
      const 图鉴贡献值 = Math.max(0, Number((图鉴档位贡献值 * 0.6 + (图鉴协同任务系数 - 1) * 20).toFixed(2)));

      let 风险级别 = '中风险';
      const 失败计数 = Math.max(0, Number(任务条目?.失败计数 || 0));
      if (失败计数 >= 2 || 情报贡献值 < 1.5) 风险级别 = '高风险';
      else if (失败计数 <= 0 && 情报贡献值 >= 4 && 图鉴贡献值 >= 2.5) 风险级别 = '低风险';

      let 推荐路线 = '主线';
      if (风险级别 === '高风险') 推荐路线 = '稳妥线';
      else if (情报贡献值 >= 4 && 图鉴贡献值 >= 2.5) 推荐路线 = '高收益线';

      const 任务推进系数 = Math.max(1, Number((1 + Math.min(0.25, (图鉴协同任务系数 - 1) * 0.9) + Math.min(0.12, 情报贡献值 * 0.01)).toFixed(4)));
      return {
        情报贡献值,
        图鉴贡献值,
        风险级别,
        推荐路线,
        任务推进系数,
      };
    };

    const 计算情报触发匹配分 = (情报条目 = {}, 触发项 = {}) => {
      const 关键词列表 = Array.isArray(触发项?.关键词) ? 触发项.关键词 : [];
      const 标题文本 = String(情报条目?.标题 || '').trim();
      const 内容文本 = String(情报条目?.内容 || '').trim();
      const 规则文本 = Array.isArray(情报条目?.知情规则) ? 情报条目.知情规则.join(' ') : '';
      let 匹配分 = 0;
      关键词列表.forEach(关键词 => {
        const 安全词 = String(关键词 || '').trim();
        if (!安全词) return;
        if ((标题文本 && (标题文本.includes(安全词) || 安全词.includes(标题文本))) ||
            (内容文本 && (内容文本.includes(安全词) || 安全词.includes(内容文本)))) {
          匹配分 += 2;
        } else if (规则文本 && (规则文本.includes(安全词) || 安全词.includes(规则文本))) {
          匹配分 += 1;
        } else if (标题文本 || 内容文本) {
          const 情报文本 = `${标题文本} ${内容文本}`;
          if (安全词.length >= 2 && 情报文本.includes(安全词.slice(0, 2))) 匹配分 += 1;
        }
      });
      return 匹配分;
    };

    const 推进机密情报核实流程 = () => {
      if (!机密情报触发队列.length) return;
      const 玩家名 = String(data.sys?.玩家名 || '').trim();
      const 玩家角色 = 玩家名 && data.char?.[玩家名] ? data.char[玩家名] : null;
      const 节点播报 = [];
      const 图鉴情报协同系数 = Math.max(1, Number(图鉴总被动.情报协同系数 || 1));
      机密情报触发队列.forEach(触发项 => {
        Object.entries(data.world.机密情报 || {}).forEach(([情报键, 原条目]) => {
          const 情报条目 = upsertSecretIntel(情报键, 原条目 || {});
          if (!情报条目) return;
          const 当前状态 = String(情报条目.核实状态 || '可疑').trim() || '可疑';
          if (当前状态 === '已核实' || 当前状态 === '误报') return;
          const 匹配分 = 计算情报触发匹配分(情报条目, 触发项);
          const 来源文本 = String(触发项.来源 || '未知').trim() || '未知';
          const 来源列表 = Array.isArray(情报条目.证据来源列表) ? 情报条目.证据来源列表 : [];
          const 新来源命中 = !来源列表.includes(来源文本);
          if (新来源命中) 来源列表.push(来源文本);
          情报条目.证据来源列表 = Array.from(new Set(来源列表));
          if (匹配分 > 0) {
            const 基础证据增量 = 匹配分 >= 2 ? 2 : 1;
            const 新来源增量 = 新来源命中 ? 0.8 : 0.3;
            const 协同增量 = Math.max(0, (图鉴情报协同系数 - 1) * 1.2);
            情报条目.证据权重 = Number((Math.max(0, Number(情报条目.证据权重 || 0)) + 基础证据增量 + 新来源增量 + 协同增量).toFixed(3));
          } else {
            情报条目.反证权重 = Number((Math.max(0, Number(情报条目.反证权重 || 0)) + 1 + (新来源命中 ? 0.2 : 0)).toFixed(3));
          }
          情报条目.最后证据tick = currentTick;
          情报条目.核实进度 = Math.max(1, Number(情报条目.核实进度 || 0) + 1);
          情报条目.最近核实tick = currentTick;
          情报条目.触发来源 = 来源文本;
          const 净证据值 = Number((Number(情报条目.证据权重 || 0) - Number(情报条目.反证权重 || 0)).toFixed(3));
          const 核实阈值 = Math.max(1, Number(情报条目.核实阈值 || 3));
          const 来源多样性 = Array.isArray(情报条目.证据来源列表) ? 情报条目.证据来源列表.length : 0;
          if (当前状态 === '可疑' && (匹配分 > 0 || 净证据值 > 0)) {
            情报条目.核实状态 = '待核实';
            情报条目.最近核实结果 = '待核实';
          }
          const 满足核实成功 = 净证据值 >= 核实阈值 && 来源多样性 >= 2;
          if (满足核实成功) {
            情报条目.核实状态 = '已核实';
            情报条目.最近核实结果 = '核实成功';
            if (玩家角色 && typeof 玩家角色 === 'object') {
              if (!Array.isArray(玩家角色.已掌握情报)) 玩家角色.已掌握情报 = [];
              const 线索文本 = `${String(情报条目.标题 || 情报键).trim()}:${String(情报条目.内容 || '无').trim()}`;
              if (线索文本 && !玩家角色.已掌握情报.includes(线索文本)) {
                玩家角色.已掌握情报.push(线索文本);
              }
              if (!玩家角色.属性 || typeof 玩家角色.属性 !== 'object') 玩家角色.属性 = {};
              if (!玩家角色.属性.状态效果 || typeof 玩家角色.属性.状态效果 !== 'object') 玩家角色.属性.状态效果 = {};
              玩家角色.属性.状态效果['情报核实增益'] = {
                类型: 'buff',
                层数: 1,
                描述: '核实到关键情报，短时提升行动效率',
                duration: 2,
                stat_mods: { str: 1.01, def: 1.0, agi: 1.02, sp_max: 1.02 },
              };
            }
            节点播报.push(`${String(情报条目.标题 || 情报键).trim()} 核实成功(净值${净证据值.toFixed(1)})`);
          } else if (Number(情报条目.核实进度 || 0) >= 3 && 净证据值 <= -1) {
            情报条目.核实状态 = '误报';
            情报条目.最近核实结果 = '核实失败';
            if (玩家角色 && 玩家角色.属性 && typeof 玩家角色.属性 === 'object') {
              const 体力上限 = Math.max(1, Number(玩家角色.属性.体力上限 || 玩家角色.属性.HP上限 || 1));
              const 失败代价 = Math.max(1, Math.floor(体力上限 * 0.02));
              玩家角色.属性.体力 = Math.max(0, Number(玩家角色.属性.体力 || 0) - 失败代价);
              玩家角色.属性.HP = Math.max(0, Number(玩家角色.属性.HP || 玩家角色.属性.体力 || 0) - 失败代价);
            }
            节点播报.push(`${String(情报条目.标题 || 情报键).trim()} 误报(净值${净证据值.toFixed(1)})`);
          } else {
            情报条目.最近核实结果 = '待核实';
            if (当前状态 === '可疑') 情报条目.核实状态 = '待核实';
          }
        });
      });
      appendSystemReasonBatchText('[节点爆发][情报]', 节点播报, { limit: 2 });
      机密情报触发队列.length = 0;
    };

    const formatTickToCalendarDateLocal = tickValue => {
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
    };

    const formatTickToCalendar = tickValue => formatTickToCalendarDateLocal(tickValue);
    const BASE_DAILY_LIVING_COST_ACU = 300;
    const MONTH_TICK_SPAN_ACU = 30 * 144;
    const MONTHLY_STIPEND_TICK_OFFSET_ACU = 54; // 每月1号 09:00

    const getSoulMasterStipendDaysByLevel_ACU = levelValue => {
      const level = Math.max(0, Math.floor(Number(levelValue) || 0));
      if (level <= 0) return 0;
      if (level <= 10) return 10;
      if (level <= 20) return 30;
      if (level <= 30) return 60;
      if (level <= 40) return 90;
      if (level <= 50) return 120;
      if (level <= 60) return 180;
      if (level <= 70) return 270;
      if (level <= 80) return 360;
      if (level <= 90) return 720;
      return 1800;
    };

    const isSoulMasterStipendEligible_ACU = char => {
      if (!char || typeof char !== 'object') return false;
      if (isSoulBeastCharacter(char)) return false;
      if (char?.属性?.邪魂师 === true) return false;
      const unitNature = String(char?.单位性质 || '').trim();
      if (unitNature === '魂兽' || unitNature === '深渊') return false;
      return Math.max(0, Math.floor(Number(char?.属性?.等级 || 0))) > 0;
    };

    const getMonthlyStipendCycleIndex_ACU = tickValue => {
      const safeTick = Math.max(0, Math.floor(Number(tickValue) || 0));
      if (safeTick < MONTHLY_STIPEND_TICK_OFFSET_ACU) return -1;
      return Math.floor((safeTick - MONTHLY_STIPEND_TICK_OFFSET_ACU) / MONTH_TICK_SPAN_ACU);
    };

    const getMonthlyStipendTicksCrossed_ACU = (prevTick, nextTick) => {
      const previous = Math.max(0, Math.floor(Number(prevTick) || 0));
      const current = Math.max(0, Math.floor(Number(nextTick) || 0));
      if (current <= previous) return [];
      const startCycle = getMonthlyStipendCycleIndex_ACU(previous);
      const endCycle = getMonthlyStipendCycleIndex_ACU(current);
      if (endCycle < startCycle + 1) return [];
      const ticks = [];
      for (let cycle = startCycle + 1; cycle <= endCycle; cycle++) {
        ticks.push(cycle * MONTH_TICK_SPAN_ACU + MONTHLY_STIPEND_TICK_OFFSET_ACU);
      }
      return ticks;
    };

    const DAY_TICK_SPAN_ACU = 144;
    const NIGHT_MEDITATION_START_TICK_ACU = 23 * 6;
    const NIGHT_MEDITATION_END_TICK_ACU = 7 * 6;

    const normalizeDayTickOffset_ACU = tickValue => {
      const safeTick = Number(tickValue || 0);
      const offset = safeTick % DAY_TICK_SPAN_ACU;
      return offset < 0 ? offset + DAY_TICK_SPAN_ACU : offset;
    };

    const isNightMeditationTick_ACU = tickValue => {
      const offset = normalizeDayTickOffset_ACU(tickValue);
      return offset < NIGHT_MEDITATION_END_TICK_ACU || offset >= NIGHT_MEDITATION_START_TICK_ACU;
    };

    const getNextDailyAutoBoundaryTick_ACU = (tickValue, endTick) => {
      const safeTick = Number(tickValue || 0);
      const safeEndTick = Math.max(safeTick, Number(endTick || 0));
      const dayBase = safeTick - normalizeDayTickOffset_ACU(safeTick);
      const offset = normalizeDayTickOffset_ACU(safeTick);
      let boundary = safeEndTick;
      if (offset < NIGHT_MEDITATION_END_TICK_ACU) {
        boundary = dayBase + NIGHT_MEDITATION_END_TICK_ACU;
      } else if (offset < NIGHT_MEDITATION_START_TICK_ACU) {
        boundary = dayBase + NIGHT_MEDITATION_START_TICK_ACU;
      } else {
        boundary = dayBase + DAY_TICK_SPAN_ACU;
      }
      return Math.min(safeEndTick, boundary);
    };

    const getResourceRatioForDailyAuto_ACU = (currentValue, maxValue) => {
      const upper = Math.max(1, Number(maxValue || 1));
      return Math.max(0, Math.min(1, Number(currentValue || 0) / upper));
    };

    const shouldDailyAutoSleep_ACU = char => {
      const vitRatio = getResourceRatioForDailyAuto_ACU(char?.属性?.体力, char?.属性?.体力上限);
      const menRatio = getResourceRatioForDailyAuto_ACU(char?.属性?.精神力, char?.属性?.精神力上限);
      return vitRatio < 0.45 || menRatio < 0.45 || (vitRatio < 0.6 && menRatio < 0.6);
    };

    const 城市消费倍率表_ACU = Object.freeze([1, 10, 100, 1000]);
    const 城市修炼加成表_ACU = Object.freeze([0, 0.05, 0.1, 0.2]);
    const 城市档位名称表_ACU = Object.freeze(['聚落', '城镇', '城市', '主城']);

    const 归一化地点文本_ACU = 地点 => {
      const 原文 = String(地点 || '')
        .replace(/^斗罗大陆-/, '')
        .replace(/^斗灵大陆-/, '')
        .trim();
      const 分段 = 原文.split('-').filter(Boolean);
      return {
        原文,
        末段: 分段[分段.length - 1] || 原文,
        分段,
      };
    };

    const 判断地点相容_ACU = (地点甲, 地点乙) => {
      const 甲 = 归一化地点文本_ACU(地点甲);
      const 乙 = 归一化地点文本_ACU(地点乙);
      if (!甲.原文 || !乙.原文) return 甲.原文 === 乙.原文;
      if (甲.原文 === 乙.原文 || 甲.末段 === 乙.末段) return true;
      return 甲.分段.some(片段 => 乙.分段.includes(片段));
    };

    const 读取地点信息_ACU = 角色 => {
      const 地点名 = String(角色?.状态?.位置 || '').trim();
      if (!地点名) return { 地点名: '', 地点信息: null, 文本: '' };
      const 动态地点信息 = data?.world?.动态地点?.[地点名];
      const 静态地点信息 = data?.world?.地点?.[地点名];
      const 地点信息 = 动态地点信息 && typeof 动态地点信息 === 'object' ? 动态地点信息 : 静态地点信息 || null;
      const 文本 = [
        地点名,
        地点信息?.节点类型,
        地点信息?.类型,
        地点信息?.描述,
        地点信息?.归属父节点,
      ]
        .map(项 => String(项 || '').trim())
        .filter(Boolean)
        .join(' ');
      return { 地点名, 地点信息, 文本 };
    };

    const 判定城市规模档位_ACU = 角色 => {
      const 地点上下文 = 读取地点信息_ACU(角色);
      const 文本 = 地点上下文.文本;
      if (!文本) return { 档位索引: -1, 名称: '无城市环境' };
      const 层级 = Math.max(0, Math.floor(Number(地点上下文.地点信息?.层级 || 0)));
      const 节点类型 = String(地点上下文.地点信息?.节点类型 || '').trim();
      if (/首都|皇城|帝都|都城|主城|海外首都/.test(文本) || 节点类型 === '主城') {
        return { 档位索引: 3, 名称: 城市档位名称表_ACU[3] };
      }
      if (/城|学院|塔|都会|都市/.test(文本) || ['城市', '学院总部', '大型设施'].includes(节点类型) || 层级 === 2) {
        return { 档位索引: 2, 名称: 城市档位名称表_ACU[2] };
      }
      if (/镇|村|街|巷|营地|分部|据点|市集|聚落/.test(文本) || ['城镇', '村落', '聚落', '街区', '店铺'].includes(节点类型)) {
        return { 档位索引: 1, 名称: 城市档位名称表_ACU[1] };
      }
      if (/居住|驿站|客栈|宿舍|据点|营地/.test(文本) || 层级 >= 3) {
        return { 档位索引: 0, 名称: 城市档位名称表_ACU[0] };
      }
      return { 档位索引: -1, 名称: '无城市环境' };
    };

    const 收集角色武魂属性词_ACU = 角色 => {
      const 词集合 = new Set();
      Object.entries(角色?.武魂 || {}).forEach(([槽位名, 武魂数据]) => {
        const 属性状态 = normalizeSpiritAttributeState(武魂数据 || {}, 槽位名, 角色);
        [武魂数据?.type, 武魂数据?.表象名称, 武魂数据?.属性体系, 武魂数据?.描述, ...(属性状态?.已解锁属性 || [])]
          .map(项 => String(项 || '').trim())
          .filter(Boolean)
          .forEach(词 => 词集合.add(词));
      });
      return Array.from(词集合);
    };

    const 计算地图拟态倍率_ACU = 角色 => {
      const 地点上下文 = 读取地点信息_ACU(角色);
      const 地点文本 = 地点上下文.文本;
      if (!地点文本) return { 倍率: 1, 来源: '无地点数据' };
      const 武魂词 = 收集角色武魂属性词_ACU(角色);
      if (!武魂词.length) return { 倍率: 1, 来源: '无武魂属性' };

      const 拟态规则表 = [
        { 关键词: ['冰', '雪', '寒', '冻', '霜'], 地形: /(冰|雪|寒|冻|霜|冰川|冰山)/, 加成: 0.2, 名称: '冰系拟态' },
        { 关键词: ['火', '炎', '焰', '熔', '热'], 地形: /(火山|熔岩|炎|热|地火|赤地)/, 加成: 0.2, 名称: '火系拟态' },
        { 关键词: ['水', '海', '潮', '雨', '雾'], 地形: /(海|湖|河|雨林|潮|湿地|水域)/, 加成: 0.16, 名称: '水系拟态' },
        { 关键词: ['风', '翼', '空', '云', '雷鹏'], 地形: /(高空|山巅|峡谷|风口|云层)/, 加成: 0.14, 名称: '风系拟态' },
        { 关键词: ['雷', '电', '霆'], 地形: /(雷|电|风暴|雷暴)/, 加成: 0.15, 名称: '雷系拟态' },
        { 关键词: ['土', '岩', '山', '石'], 地形: /(山|岩|矿|地脉|洞窟)/, 加成: 0.12, 名称: '土系拟态' },
        { 关键词: ['木', '林', '草', '藤', '花'], 地形: /(森林|林海|草原|藤|花海|雨林)/, 加成: 0.12, 名称: '木系拟态' },
        { 关键词: ['光', '圣'], 地形: /(圣殿|日耀|光|辉)/, 加成: 0.1, 名称: '光系拟态' },
        { 关键词: ['暗', '影', '夜', '冥'], 地形: /(夜|暗|幽|冥|影)/, 加成: 0.1, 名称: '暗系拟态' },
      ];

      let 倍率 = 1;
      const 来源列表 = [];
      拟态规则表.forEach(规则 => {
        const 命中属性 = 规则.关键词.some(关键词 => 武魂词.some(词 => String(词 || '').includes(关键词)));
        if (!命中属性) return;
        if (!规则.地形.test(地点文本)) return;
        倍率 *= 1 + Number(规则.加成 || 0);
        来源列表.push(规则.名称);
      });
      const 安全倍率 = Math.max(1, Math.min(2.2, Number(倍率.toFixed(4))));
      return {
        倍率: 安全倍率,
        来源: 来源列表.length ? 来源列表.join(' + ') : '无拟态命中',
      };
    };

    const 读取修炼食物倍率_ACU = 角色 => {
      const 状态表 = 角色?.属性?.状态效果;
      if (!状态表 || typeof 状态表 !== 'object') return { 倍率: 1, 来源: '无食物增益' };
      let 倍率 = 1;
      const 来源列表 = [];
      Object.entries(状态表).forEach(([状态名, 状态值]) => {
        if (!状态值 || typeof 状态值 !== 'object') return;
        const 结束tick = Math.max(0, Math.floor(Number(状态值.结束tick || 0)));
        if (结束tick > 0 && currentTick >= 结束tick) {
          delete 状态表[状态名];
          return;
        }
        if (结束tick <= 0) return;
        const 状态倍率 = Number(状态值.修炼速度倍率 || 0);
        if (!Number.isFinite(状态倍率) || 状态倍率 <= 1) return;
        倍率 *= 状态倍率;
        来源列表.push(状态名);
      });
      const 安全倍率 = Math.max(1, Math.min(3.5, Number(倍率.toFixed(4))));
      return { 倍率: 安全倍率, 来源: 来源列表.length ? 来源列表.join(' + ') : '无食物增益' };
    };

    const 计算关系同修倍率_ACU = (角色, 角色名 = '') => {
      const 关系表 = 角色?.社交?.关系;
      if (!关系表 || typeof 关系表 !== 'object') return { 倍率: 1, 来源: '无关系数据' };
      const 当前地点 = String(角色?.状态?.位置 || '').trim();
      const 显式同修对象 = String(角色?.状态?.同修对象 || 角色?.状态?.双修对象 || '').trim();

      let 同修对象名 = '';
      let 同修关系数据 = null;
      if (显式同修对象 && 关系表[显式同修对象]) {
        const 候选角色 = data?.char?.[显式同修对象];
        if (!候选角色 || 判断地点相容_ACU(当前地点, 候选角色?.状态?.位置 || '')) {
          同修对象名 = 显式同修对象;
          同修关系数据 = 关系表[显式同修对象];
        }
      }
      if (!同修关系数据) {
        Object.entries(关系表).forEach(([目标名, 关系数据]) => {
          if (目标名 === 角色名) return;
          const 目标角色 = data?.char?.[目标名];
          if (!目标角色) return;
          if (!判断地点相容_ACU(当前地点, 目标角色?.状态?.位置 || '')) return;
          if (!同修关系数据 || 计算武魂相关度总分(关系数据) > 计算武魂相关度总分(同修关系数据)) {
            同修对象名 = 目标名;
            同修关系数据 = 关系数据;
          }
        });
      }
      if (!同修关系数据) return { 倍率: 1, 来源: '无同修对象' };
      const 相关度总分 = 计算武魂相关度总分(同修关系数据);
      const 倍率 = Math.max(1, Number((1 + 相关度总分 * 0.0025).toFixed(4)));
      return { 倍率, 来源: 同修对象名 ? `同修:${同修对象名}` : '同修' };
    };

    const 计算修炼速度倍率_ACU = (角色, 角色名 = '', 动作模式 = '日常') => {
      const 模式 = String(动作模式 || '').trim();
      const 生效模式 = ['冥想', '肉体训练', '精神训练', '日常'].includes(模式);
      if (!生效模式) return { 倍率: 1, 构成说明: '常规', 明细: {} };

      const 同修倍率信息 = 计算关系同修倍率_ACU(角色, 角色名);
      const 拟态倍率信息 = 计算地图拟态倍率_ACU(角色);
      const 城市档位信息 = 判定城市规模档位_ACU(角色);
      const 城市修炼倍率 = 1 + (城市档位信息.档位索引 >= 0 ? Number(城市修炼加成表_ACU[城市档位信息.档位索引] || 0) : 0);
      const 食物倍率信息 = 读取修炼食物倍率_ACU(角色);
      const 总倍率 = Math.max(
        1,
        Math.min(8, Number((同修倍率信息.倍率 * 拟态倍率信息.倍率 * 城市修炼倍率 * 食物倍率信息.倍率).toFixed(4))),
      );
      return {
        倍率: 总倍率,
        构成说明: [
          `同修${同修倍率信息.倍率.toFixed(3)}`,
          `拟态${拟态倍率信息.倍率.toFixed(3)}`,
          `城市${城市修炼倍率.toFixed(3)}`,
          `食物${食物倍率信息.倍率.toFixed(3)}`,
        ].join(' × '),
        明细: {
          同修: 同修倍率信息,
          拟态: 拟态倍率信息,
          城市: {
            倍率: 城市修炼倍率,
            档位: 城市档位信息.档位索引,
            名称: 城市档位信息.名称,
          },
          食物: 食物倍率信息,
        },
      };
    };

    const 计算可负担消费档位_ACU = (存款, 基础日消费, 目标档位索引) => {
      const 安全存款 = Math.max(0, Number(存款 || 0));
      const 安全基础日消费 = Math.max(0, Number(基础日消费 || 0));
      const 安全目标档位 = Math.max(0, Math.min(3, Math.floor(Number(目标档位索引 || 0))));
      for (let 档位索引 = 安全目标档位; 档位索引 >= 0; 档位索引 -= 1) {
        const 周消费 = 安全基础日消费 * Number(城市消费倍率表_ACU[档位索引] || 1) * 7;
        if (安全存款 >= 周消费) return 档位索引;
      }
      return 0;
    };

    const normalizeCharacterActionMode_ACU = actionMode => {
      const raw = String(actionMode || '').trim() || '日常';
      return raw === '凝聚魂核' ? '冥想' : raw;
    };

    const SOUL_CORE_MEDITATION_STAGE_CONFIG_ACU = Object.freeze([
      Object.freeze({
        requiredCoreCount: 0,
        nextCoreIndex: 1,
        startLevel: 50,
        bottleneckLevel: 69,
        baseAttemptChance: 0.0125,
        talentRatioMap: Object.freeze({
          劣等: 0.08,
          正常: 0.20,
          优秀: 1.1077,
          天才: 1.12,
          顶级天才: 2.18,
          绝世妖孽: 3.2,
        }),
      }),
      Object.freeze({
        requiredCoreCount: 1,
        nextCoreIndex: 2,
        startLevel: 80,
        bottleneckLevel: 89,
        baseAttemptChance: 0.054,
        talentRatioMap: Object.freeze({
          劣等: 0.10,
          正常: 0.20,
          优秀: 0.7635,
          天才: 0.50,
          顶级天才: 0.90,
          绝世妖孽: 1.30,
        }),
      }),
      Object.freeze({
        requiredCoreCount: 2,
        nextCoreIndex: 3,
        startLevel: 95,
        bottleneckLevel: 98,
        baseAttemptChance: 0.0045,
        talentRatioMap: Object.freeze({
          劣等: 0.05,
          正常: 0.10,
          优秀: 0.20,
          天才: 0.22,
          顶级天才: 0.90,
          绝世妖孽: 4.00,
        }),
      }),
    ]);

    const getSoulCoreMeditationStageInfo_ACU = char => {
      const coreCount = Math.max(0, Math.floor(Number(char?.魂核?.核心?.数量 || 0)));
      const level = Math.max(0, Math.floor(Number(char?.属性?.等级 || 0)));
      const stageInfo = SOUL_CORE_MEDITATION_STAGE_CONFIG_ACU.find(item => item.requiredCoreCount === coreCount);
      if (!stageInfo || level < stageInfo.startLevel) return null;
      const safeSpan = Math.max(1, stageInfo.bottleneckLevel - stageInfo.startLevel);
      const proximity = Math.max(0, Math.min(1, (level - stageInfo.startLevel) / safeSpan));
      return {
        coreCount,
        nextCoreIndex: stageInfo.nextCoreIndex,
        startLevel: stageInfo.startLevel,
        bottleneckLevel: stageInfo.bottleneckLevel,
        baseAttemptChance: Number(stageInfo.baseAttemptChance || 0),
        talentRatioMap: stageInfo.talentRatioMap,
        proximity,
      };
    };

    const getSoulCoreMeditationSuccessChance_ACU = char => {
      if (!canTalentContinueCultivating_ACU(char)) return 0;
      const stageInfo = getSoulCoreMeditationStageInfo_ACU(char);
      if (!stageInfo) return 0;
      const talent = String(char?.属性?.天赋梯队 || '').trim();
      const talentRatio = stageInfo.talentRatioMap[talent] || stageInfo.talentRatioMap['正常'] || 0.55;
      const proximityRatio = 0.3 + 0.7 * Math.pow(Number(stageInfo.proximity || 0), 1.2);
      const lateBloomStage3Multiplier =
        isTopTalentLateBloom_ACU(char) &&
        Number(char?.属性?.年龄 || 0) >= 35 &&
        stageInfo.coreCount >= 2
          ? TOP_TALENT_LATE_BLOOM_STAGE3_CHANCE_MULTIPLIER_ACU
          : 1;
      const goodLateBloomStage12Multiplier =
        isGoodTalentLateBloom_ACU(char) &&
        Number(char?.属性?.年龄 || 0) >= GOOD_TALENT_LATE_BLOOM_START_AGE_ACU &&
        stageInfo.coreCount <= 1
          ? GOOD_TALENT_LATE_BLOOM_STAGE12_CHANCE_MULTIPLIER_ACU
          : 1;
      return Math.max(
        0.0001,
        Math.min(
          0.35,
          Number(stageInfo.baseAttemptChance || 0) * talentRatio * proximityRatio * lateBloomStage3Multiplier * goodLateBloomStage12Multiplier,
        ),
      );
    };

    const getSoulCoreLevelCapByCount_ACU = coreCount => {
      const safeCoreCount = Math.max(0, Math.floor(Number(coreCount || 0)));
      if (safeCoreCount <= 0) return 69;
      if (safeCoreCount === 1) return 89;
      if (safeCoreCount === 2) return 98;
      return 150;
    };

    const SOUL_CORE_BOTTLENECK_ATTEMPT_MULTIPLIER_ACU = 2.45;
    const SOUL_CORE_BOTTLENECK_PREBREAKTHROUGH_STORAGE_RATIO_ACU = 0.7;

    const getMeditationAgeDecayMultiplier_ACU = char => {
      const ageValue = Math.max(0, Number(char?.属性?.年龄 || 0));
      if (!canTalentContinueCultivating_ACU(char)) return 0;
      if (ageValue < 30) return 1.0;
      const baseDecay = ageValue < 40 ? 0.35 : 0.10;
      const talent = String(char?.属性?.天赋梯队 || '').trim();
      const talentBonus =
        talent === '天才'
          ? 0.15
          : talent === '优秀'
            ? ageValue < 40
              ? 0.069
              : 0.0493
          : talent === '顶级天才'
            ? 0.32
            : talent === '绝世妖孽'
              ? 0.30
            : 0;
      const ageDecay = Math.max(0, baseDecay + talentBonus);
      if (ageValue >= 100) return Math.max(0.01, ageDecay * 0.1);
      return ageDecay;
    };

    const getMeditationTalentRealizationMultiplier_ACU = char => {
      const ageValue = Math.max(0, Number(char?.属性?.年龄 || 0));
      const talent = String(char?.属性?.天赋梯队 || '').trim();
      const rawTalentRate =
        {
          绝世妖孽: 4.5,
          顶级天才: 3.5,
          天才: 2.5,
          优秀: 1.5,
          正常: 1.0,
          劣等: 0.5,
        }[talent] || 1.0;
      const realization = ageValue < 12
        ? ({
            劣等: 0.02,
            正常: 0.08,
            优秀: 0.16,
            天才: 0.275,
            顶级天才: 0.248,
            绝世妖孽: 0.30,
          }[talent] || 0.15)
        : ageValue < 18
          ? ({
              劣等: 0.10,
              正常: 0.22,
              优秀: 0.42,
              天才: 0.689,
              顶级天才: 0.894,
              绝世妖孽: 0.95,
            }[talent] || 0.45)
          : 1.0;
      return 1 + (rawTalentRate - 1) * realization;
    };

    const getMeditationYouthYieldMultiplier_ACU = char => {
      const ageValue = Math.max(0, Number(char?.属性?.年龄 || 0));
      if (ageValue < 12) {
        const talent = String(char?.属性?.天赋梯队 || '').trim();
        return (
          {
            劣等: 0.08,
            正常: 0.16,
            优秀: 0.26,
            天才: 0.428,
            顶级天才: 0.428,
            绝世妖孽: 0.45,
          }[talent] || 0.16
        );
      }
      if (ageValue < 18) {
        const talent = String(char?.属性?.天赋梯队 || '').trim();
        return (
          {
            劣等: 0.15,
            正常: 0.22,
            优秀: 0.7986,
            天才: 1.09,
            顶级天才: 1.09,
            绝世妖孽: 1.12,
          }[talent] || 0.28
        );
      }
      if (ageValue < 30) {
        const talent = String(char?.属性?.天赋梯队 || '').trim();
        return (
          {
            劣等: 0.20,
            正常: 0.32,
            优秀: 1.4936,
            天才: 2.76,
            顶级天才: 2.65,
            绝世妖孽: 2.8,
          }[talent] || 0.45
        );
      }
      return 1.0;
    };

    const roundRuntimeGrowthValue_ACU = value => Number(Number(value || 0).toFixed(4));

    const syncRoundedDisplaySoulPower_ACU = char => {
      if (!char?.属性) return;
      const soulPowerCap = Number(char.属性?.突破魂力上限 ?? char.属性?.魂力上限 ?? 0);
      if (Number.isFinite(soulPowerCap) && soulPowerCap > 0) {
        char.属性.魂力上限 = Math.max(1, Math.floor(soulPowerCap));
      }
      if (Number.isFinite(Number(char.属性?.魂力 || 0))) {
        char.属性.魂力 = Math.max(0, Math.min(Number(char.属性.魂力 || 0), Number(char.属性.魂力上限 || 0)));
      }
      if (Number.isFinite(Number(char.属性?.精神力 || 0)) && Number.isFinite(Number(char.属性?.精神力上限 || 0))) {
        char.属性.精神力 = Math.max(0, Math.min(Number(char.属性.精神力 || 0), Number(char.属性.精神力上限 || 0)));
      }
      if (Number.isFinite(Number(char.属性?.体力 || 0)) && Number.isFinite(Number(char.属性?.体力上限 || 0))) {
        char.属性.体力 = Math.max(0, Math.min(Number(char.属性.体力 || 0), Number(char.属性.体力上限 || 0)));
      }
      if (Number.isFinite(Number(char.属性?.HP || 0)) && Number.isFinite(Number(char.属性?.HP上限 || 0))) {
        char.属性.HP = Math.max(0, Math.min(Number(char.属性.HP || 0), Number(char.属性.HP上限 || 0)));
      }
    };

    const maybeAdvanceSoulCoreProgressByMeditation_ACU = (char, delta) => {
      if (!canTalentContinueCultivating_ACU(char)) return 0;
      const safeDelta = Math.max(0, Number(delta || 0));
      if (!(safeDelta > 0)) return 0;
      const stageInfo = getSoulCoreMeditationStageInfo_ACU(char);
      if (!stageInfo) return 0;
      if (!char.魂核) char.魂核 = {};
      if (!char.魂核.核心 || typeof char.魂核.核心 !== 'object') char.魂核.核心 = { 数量: stageInfo.coreCount, 进度: 0 };
      const chance = getSoulCoreMeditationSuccessChance_ACU(char);
      const fullAttempts = Math.floor(safeDelta / 48);
      let attempts = fullAttempts;
      const remainder = safeDelta % 48;
      if (remainder > 0 && Math.random() < remainder / 48) attempts += 1;
      if (attempts <= 0) return 0;
      let progressGain = 0;
      for (let i = 0; i < attempts; i += 1) {
        if (Math.random() <= chance) progressGain += 1;
      }
      if (progressGain <= 0) return 0;
      char.魂核.核心.进度 = Math.max(0, Number(char.魂核.核心.进度 || 0)) + progressGain;
      if (char.魂核.核心.进度 >= 100) {
        char.魂核.核心.数量 = Math.max(stageInfo.nextCoreIndex, Math.floor(Number(char.魂核.核心.数量 || 0)) + 1);
        char.魂核.核心.进度 = 0;
        return 1;
      }
      return 0;
    };

    const applyCharacterActionSegment_ACU = (c, actionMode, segmentDelta, trainedBonus, 角色名 = '') => {
      const safeDelta = Math.max(0, Number(segmentDelta || 0));
      if (!(safeDelta > 0) || !c?.属性) return;
      const normalizedActionMode = normalizeCharacterActionMode_ACU(actionMode);
      const 应用伤势恢复到生命值 = 基础恢复倍率 => {
        const 安全基础恢复倍率 = Math.max(0, Number(基础恢复倍率 || 0));
        if (!(安全基础恢复倍率 > 0)) return;
        const 生命值上限 = Math.max(1, Number(c?.属性?.HP上限 || c?.属性?.体力上限 || 1));
        const 当前生命值 = Math.max(0, Number(c?.属性?.HP || 0));
        if (当前生命值 >= 生命值上限) return;
        const 伤势恢复倍率 = Math.max(0, Number(getComputedWoundRecoveryRatioFromStat(c?.属性 || {}) || 0));
        if (!(伤势恢复倍率 > 0)) return;
        const 恢复量 = roundRuntimeGrowthValue_ACU(生命值上限 * 安全基础恢复倍率 * safeDelta * 伤势恢复倍率);
        if (!(恢复量 > 0)) return;
        c.属性.HP = Math.min(生命值上限, roundRuntimeGrowthValue_ACU(当前生命值 + 恢复量));
      };
      const 修炼倍率信息 = 计算修炼速度倍率_ACU(c, 角色名, normalizedActionMode);
      const 修炼速度倍率 = Math.max(1, Number(修炼倍率信息.倍率 || 1));
      if (!c.属性.训练加成 || typeof c.属性.训练加成 !== 'object' || Array.isArray(c.属性.训练加成)) {
        c.属性.训练加成 = createNumericStatBonusMap({});
      }
      c.属性.训练加成.修炼倍率 = Number(修炼速度倍率.toFixed(4));
      c.属性.训练加成.修炼倍率来源 = String(修炼倍率信息.构成说明 || '常规');
      const hasNoSoulPowerTalent = isNoSoulPowerTalentTier(c?.属性?.天赋梯队);
      const coreCount = c.魂核?.核心?.数量 || 0;
      let spRate = 0.01;
      let vitMenRate = 0;

      if (normalizedActionMode === '冥想') {
        spRate = coreCount === 0 ? 0.05 : coreCount === 1 ? 0.2 : coreCount === 2 ? 0.3 : 0.4;
        vitMenRate = 0.005;
        const menRate = 0.008;
        c.属性.精神力 = Math.min(c.属性.精神力上限, roundRuntimeGrowthValue_ACU(c.属性.精神力 + c.属性.精神力上限 * menRate * safeDelta));
        c.属性.体力 = Math.min(c.属性.体力上限, roundRuntimeGrowthValue_ACU(c.属性.体力 + c.属性.体力上限 * vitMenRate * safeDelta));
        应用伤势恢复到生命值(0.0008);
      } else if (normalizedActionMode === '战斗') {
        spRate = 0;
        vitMenRate = 0;
      } else if (normalizedActionMode === '睡眠') {
        spRate = 0.01;
        const sleepRate = 0.01;
        c.属性.精神力 = Math.min(c.属性.精神力上限, roundRuntimeGrowthValue_ACU(c.属性.精神力 + c.属性.精神力上限 * sleepRate * safeDelta));
        c.属性.体力 = Math.min(c.属性.体力上限, roundRuntimeGrowthValue_ACU(c.属性.体力 + c.属性.体力上限 * sleepRate * safeDelta));
        应用伤势恢复到生命值(0.0015);
      } else {
        c.属性.精神力 = Math.min(c.属性.精神力上限, roundRuntimeGrowthValue_ACU(c.属性.精神力 + c.属性.精神力上限 * vitMenRate * safeDelta));
        c.属性.体力 = Math.min(c.属性.体力上限, roundRuntimeGrowthValue_ACU(c.属性.体力 + c.属性.体力上限 * vitMenRate * safeDelta));
        应用伤势恢复到生命值(0.0004);
      }

      if (hasNoSoulPowerTalent) spRate = 0;
      c.属性.魂力 = Math.min(c.属性.魂力上限, roundRuntimeGrowthValue_ACU(c.属性.魂力 + c.属性.魂力上限 * spRate * safeDelta));

      const bloodCore = c.血脉之力?.core || '未凝聚';
      if (bloodCore !== '未凝聚') {
        c.属性.体力 = Math.min(c.属性.体力上限, roundRuntimeGrowthValue_ACU(c.属性.体力 + c.属性.体力上限 * 0.05 * safeDelta));
      }

      if (normalizedActionMode === '冥想' && !hasNoSoulPowerTalent) {
        const stageBaseRate = coreCount <= 0 ? 0.25 : coreCount === 1 ? 0.46 : coreCount === 2 ? 0.46 : 0.96;
        let baseGrowth = stageBaseRate * (safeDelta / 6);
        const talentCultRate = getMeditationTalentRealizationMultiplier_ACU(c);
        let finalGrowth = baseGrowth * talentCultRate;

        if (c.功法?.['玄天功']) finalGrowth *= 1.1;

        if (c.属性.等级 >= 20 && c.属性.等级 < 30) {
          finalGrowth *= 1.024;
        } else if (c.属性.等级 >= 30 && c.属性.等级 < 40) {
          finalGrowth *= 1.014;
        } else if (c.属性.等级 >= 40 && c.属性.等级 < 60) {
          finalGrowth *= 0.865;
        }
        if (String(c?.属性?.天赋梯队 || '').trim() === '优秀') {
          if (coreCount === 1) finalGrowth *= GOOD_TALENT_STAGE1_GROWTH_MULTIPLIER_ACU;
          else if (coreCount === 2) finalGrowth *= GOOD_TALENT_STAGE2_GROWTH_MULTIPLIER_ACU;
          else if (coreCount >= 3) finalGrowth *= GOOD_TALENT_STAGE3_GROWTH_MULTIPLIER_ACU;
        }
        finalGrowth *= getMeditationYouthYieldMultiplier_ACU(c);
        finalGrowth *= getMeditationAgeDecayMultiplier_ACU(c);
        if (isTopTalentLateBloom_ACU(c) && Number(c.属性?.年龄 || 0) >= 35 && coreCount >= 2) {
          finalGrowth *= TOP_TALENT_LATE_BLOOM_GROWTH_MULTIPLIER_ACU;
        }
        if (isGoodTalentLateBloom_ACU(c) && Number(c.属性?.年龄 || 0) >= GOOD_TALENT_LATE_BLOOM_START_AGE_ACU && coreCount >= 0) {
          finalGrowth *= GOOD_TALENT_LATE_BLOOM_GROWTH_MULTIPLIER_ACU;
        }
        finalGrowth *= 修炼速度倍率;
        finalGrowth = roundRuntimeGrowthValue_ACU(finalGrowth);
        const currentLevel = Math.max(0, Number(c.属性?.等级 || 0));
        const isSoulCoreBottlenecked = currentLevel >= getSoulCoreLevelCapByCount_ACU(coreCount) && coreCount < 3;
        const nextLevelStep = getNextCultivationLevelStep(currentLevel);
        const dualSpiritSoulCoeff = getDualSpiritSoulPowerCoeff(c);
        const currentLevelRequirement = getCharacterBaseSoulPowerRequirementAtLevel(c, currentLevel);
        const fixedSoulPowerBonusAtBottleneck =
          getPersistentSoulPowerBonusFromPermanentRecords(c) +
          Math.max(0, Math.floor(Number(c.属性?.永久魂力加成 || 0))) +
          getCharacterCurrentRingAndBoneSoulPowerBonus_ACU(c);
        const bottleneckBreakthroughCap =
          isSoulCoreBottlenecked && nextLevelStep != null
            ? Math.floor(
                currentLevelRequirement +
                  Math.max(0, getCharacterBaseSoulPowerRequirementAtLevel(c, nextLevelStep) - currentLevelRequirement) *
                    SOUL_CORE_BOTTLENECK_PREBREAKTHROUGH_STORAGE_RATIO_ACU,
              )
            : null;
        const bottleneckBaseCap =
          bottleneckBreakthroughCap != null
            ? Math.max(
                Number(c.属性?.基础魂力上限 || 0),
                Math.floor(
                  Math.max(0, bottleneckBreakthroughCap - fixedSoulPowerBonusAtBottleneck) /
                    Math.max(0.1, dualSpiritSoulCoeff),
                ),
              )
            : null;
        let soulCoreAttemptDelta = isSoulCoreBottlenecked
          ? safeDelta * SOUL_CORE_BOTTLENECK_ATTEMPT_MULTIPLIER_ACU
          : safeDelta;
        if (isSoulCoreBottlenecked && isTopTalentLateBloom_ACU(c) && Number(c.属性?.年龄 || 0) >= 35 && coreCount >= 2) {
          soulCoreAttemptDelta = safeDelta * TOP_TALENT_LATE_BLOOM_STAGE3_BOTTLENECK_MULTIPLIER_ACU;
        }
        if (isSoulCoreBottlenecked && isGoodTalentLateBloom_ACU(c) && Number(c.属性?.年龄 || 0) >= GOOD_TALENT_LATE_BLOOM_START_AGE_ACU && coreCount === 0) {
          soulCoreAttemptDelta = safeDelta * GOOD_TALENT_LATE_BLOOM_STAGE1_BOTTLENECK_MULTIPLIER_ACU;
        } else if (isSoulCoreBottlenecked && isGoodTalentLateBloom_ACU(c) && Number(c.属性?.年龄 || 0) >= GOOD_TALENT_LATE_BLOOM_START_AGE_ACU && coreCount === 1) {
          soulCoreAttemptDelta = safeDelta * GOOD_TALENT_LATE_BLOOM_STAGE2_BOTTLENECK_MULTIPLIER_ACU;
        }

        if (finalGrowth > 0) {
          const nextBaseSoulPower = Number(c.属性.基础魂力上限 || 0) + finalGrowth;
          const nextBreakthroughSoulPower =
            Number(c.属性.突破魂力上限 || c.属性.魂力上限 || 0) + finalGrowth * dualSpiritSoulCoeff;
          if (isSoulCoreBottlenecked && bottleneckBreakthroughCap != null) {
            c.属性.基础魂力上限 = roundRuntimeGrowthValue_ACU(Math.min(nextBaseSoulPower, bottleneckBaseCap));
            c.属性.突破魂力上限 = roundRuntimeGrowthValue_ACU(Math.min(nextBreakthroughSoulPower, bottleneckBreakthroughCap));
          } else {
            c.属性.基础魂力上限 = roundRuntimeGrowthValue_ACU(nextBaseSoulPower);
            c.属性.突破魂力上限 = roundRuntimeGrowthValue_ACU(nextBreakthroughSoulPower);
          }
        }
        maybeAdvanceSoulCoreProgressByMeditation_ACU(c, soulCoreAttemptDelta);
      }

      if (normalizedActionMode === '肉体训练') {
        const cycles = Math.floor(safeDelta / 6);
        let actualCycles = 0;
        for (let i = 0; i < cycles; i++) {
          if (c.属性.体力 >= c.属性.体力上限 * 0.3) {
            c.属性.体力 -= c.属性.体力上限 * 0.3;
            actualCycles++;
          } else {
            c.状态.行动 = '日常';
            break;
          }
        }
        if (actualCycles > 0) {
          const gain = 0.05 * actualCycles * 修炼速度倍率;
          addNumericStatBonusEntries(trainedBonus, {
            力量: gain,
            防御: gain,
            敏捷: gain,
            体力上限: gain,
          });
        }
      } else if (normalizedActionMode === '精神训练') {
        const cycles = Math.floor(safeDelta / 6);
        let actualCycles = 0;
        for (let i = 0; i < cycles; i++) {
          if (c.属性.精神力 > c.属性.精神力上限 * 0.1) {
            c.属性.精神力 -= c.属性.精神力 * 0.8;
            actualCycles++;
          } else {
            c.状态.行动 = '日常';
            break;
          }
        }
        if (actualCycles > 0 && c.属性.年龄 <= 40) {
          let gain = 0.02 * actualCycles * 修炼速度倍率;
          if (c.功法?.['紫极魔瞳']) gain = Math.floor(gain * 1.1);
          addNumericStatBonusValue(trainedBonus, '精神力上限', gain);
        }
      } else if (normalizedActionMode === '日常') {
        const passiveDays = safeDelta / DAY_TICK_SPAN_ACU;
        if (passiveDays > 0) {
          const passiveGain = 0.01 * passiveDays * 修炼速度倍率;
          addNumericStatBonusEntries(trainedBonus, {
            力量: passiveGain,
            防御: passiveGain,
            敏捷: passiveGain,
            体力上限: passiveGain,
          });
          if (c.属性.年龄 <= 40) {
            addNumericStatBonusValue(trainedBonus, '精神力上限', passiveGain * 0.5);
          }
        }
      }
    };

    data.world.时间._calendar = formatTickToCalendar(currentTick);

    _(data.char || {}).forEach(charData => {
      if (!charData || typeof charData !== 'object' || !charData.背包 || typeof charData.背包 !== 'object')
        return;
      Object.keys(charData.背包).forEach(itemName => {
        const item = charData.背包[itemName];
        const expiryTick = Number(item?.有效期至tick || 0);
        if (expiryTick > 0) {
          item.有效期至 = formatTickToCalendarDateLocal(expiryTick);
          if (Array.isArray(item.使用效果) && item.使用效果.length > 0) {
            item.触发方式 = item.触发方式 || (/食物/.test(String(item?.类型 || '')) ? '食用' : '使用');
            item.描述 = buildTemporaryConstructDescription(
              itemName,
              item.使用效果,
              Math.max(0, expiryTick - currentTick),
              { type: item.类型 || '', expiryTick },
            );
          }
        }
        if (expiryTick > 0 && currentTick >= expiryTick) {
          delete charData.背包[itemName];
        }
      });
    });

    const formatTickDeltaText = tickDelta => {
      const safeDelta = Math.max(0, Number(tickDelta || 0));
      const totalMinutesForDelta = safeDelta * 10;
      const deltaDays = Math.floor(totalMinutesForDelta / (24 * 60));
      const deltaRemainMinutes = totalMinutesForDelta % (24 * 60);
      const deltaHours = Math.floor(deltaRemainMinutes / 60);
      const deltaMins = deltaRemainMinutes % 60;
      const parts = [];
      if (deltaDays > 0) parts.push(`${deltaDays}天`);
      if (deltaHours > 0) parts.push(`${deltaHours}小时`);
      if (deltaMins > 0 || parts.length === 0) parts.push(`${deltaMins}分`);
      return parts.join('');
    };

    let lastTick = data.world.时间._上次结算tick ?? data.world.时间.上次结算tick ?? currentTick;
    let delta = currentTick - lastTick;
    if (delta > 0 && data.sys.系统播报 && data.sys.系统播报 !== '初始化') {
      data.sys.系统播报 = '初始化';
    }

    const 收集旧选择回响候选 = () => {
      const 回响候选列表 = [];
      const 最小回合间隔 = 3;
      const 最大任务窗口 = 432;
      const 最大互动窗口 = 216;
      const 最大情报窗口 = 432;
      const 类型优先级 = { 任务: 3, 情报: 2, 互动: 1 };

      _(data.char || {}).forEach((角色数据, 角色名) => {
        _(角色数据?.记录 || {}).forEach((任务条目, 任务名) => {
          if (!任务条目 || typeof 任务条目 !== 'object') return;
          const 更新时间tick = Math.max(0, Number(任务条目.最后更新时间tick || 0));
          if (!(更新时间tick > 0)) return;
          const 回合差 = currentTick - 更新时间tick;
          if (回合差 < 最小回合间隔 || 回合差 > 最大任务窗口) return;
          const 状态文本 = String(任务条目.状态 || '').trim();
          if (!['已完成', '已放弃', '可提交', '阶段推进'].includes(状态文本)) return;
          const 分支文本 = String(任务条目.分支 || '').trim();
          let 后果文本 = '相关势力正在依据你的处理结果重新评估你';
          if (状态文本 === '已完成' && 分支文本 === '高收益线') 后果文本 = '高风险资源线被进一步打开';
          else if (状态文本 === '已完成' && 分支文本 === '稳妥线') 后果文本 = '稳定合作路线正在升温';
          else if (状态文本 === '已放弃') 后果文本 = '委托板正在重新分配该任务';
          else if (状态文本 === '可提交') 后果文本 = '任务委托方已开始催促最终交付';
          const 回响文本 = `[旧选择回响] ${角色名}此前处理的【${任务名}】仍在发酵，${后果文本}。`;
          回响候选列表.push({
            类型: '任务',
            tick: 更新时间tick,
            签名: `任务|${角色名}|${任务名}|${更新时间tick}|${状态文本}|${分支文本}`,
            文本: 回响文本,
          });
        });
      });

      _(data.char || {}).forEach((角色数据, 角色名) => {
        _(角色数据?.社交?.关系 || {}).forEach((关系条目, 对象名) => {
          if (!关系条目 || typeof 关系条目 !== 'object') return;
          const 互动tick = Math.max(0, Number(关系条目.上次互动tick || 0));
          if (!(互动tick > 0)) return;
          const 回合差 = currentTick - 互动tick;
          if (回合差 < 最小回合间隔 || 回合差 > 最大互动窗口) return;
          const 最近动作 = String(关系条目.上次互动动作 || '').trim();
          const 最近变化 = Number(关系条目.最近好感变化 || 0);
          if ((!最近动作 || 最近动作 === '无') && 最近变化 === 0) return;
          const 路线文本 = String(关系条目.关系路线 || '朋友线').trim() || '朋友线';
          const 回响文本 = `[旧选择回响] ${角色名}对【${对象名}】的${最近动作 || '互动'}仍在发酵，当前关系倾向${路线文本}。`;
          回响候选列表.push({
            类型: '互动',
            tick: 互动tick,
            签名: `互动|${角色名}|${对象名}|${互动tick}|${最近动作}|${最近变化}|${路线文本}`,
            文本: 回响文本,
          });
        });
      });

      _(data.world?.机密情报 || {}).forEach((情报条目, 情报名) => {
        if (!情报条目 || typeof 情报条目 !== 'object') return;
        const 核实tick = Math.max(0, Number(情报条目.最近核实tick || 0));
        if (!(核实tick > 0)) return;
        const 回合差 = currentTick - 核实tick;
        if (回合差 < 最小回合间隔 || 回合差 > 最大情报窗口) return;
        const 核实结果 = String(情报条目.最近核实结果 || '').trim();
        if (!核实结果 || 核实结果 === '无') return;
        const 标题文本 = String(情报条目.标题 || 情报名 || '未命名情报').trim();
        const 回响文本 = `[旧选择回响] 情报【${标题文本}】的核实结果正在扩散：${核实结果}。`;
        回响候选列表.push({
          类型: '情报',
          tick: 核实tick,
          签名: `情报|${标题文本}|${核实tick}|${核实结果}`,
          文本: 回响文本,
        });
      });

      if (!回响候选列表.length) return null;
      回响候选列表.sort((左侧, 右侧) => {
        const tick差值 = Number(右侧.tick || 0) - Number(左侧.tick || 0);
        if (tick差值 !== 0) return tick差值;
        return Number(类型优先级[右侧.类型] || 0) - Number(类型优先级[左侧.类型] || 0);
      });
      return 回响候选列表[0] || null;
    };

    const 追加旧选择回响播报 = () => {
      if (!(delta > 0)) return;
      const 回响候选 = 收集旧选择回响候选();
      if (!回响候选 || !回响候选.文本) return;
      if (回响候选.签名 === 最近旧选择回响签名) return;
      最近旧选择回响签名 = 回响候选.签名;
      追加系统播报文本(data, 回响候选.文本);
    };

    let refreshQuestBoardFrames = () => {};
    const lowerCaseKeys = obj => {
      const QUEST_BOARD_TIER_ORDER = ['D', 'C', 'B', 'A', 'S'];
      const QUEST_BOARD_TIER_SETTINGS = Object.freeze({
        D: { rewardCoin: [500, 3000], rewardRep: [10, 30], progress: [1, 2], resourceLabel: '基础药剂/干粮' },
        C: { rewardCoin: [5000, 50000], rewardRep: [50, 150], progress: [2, 4], resourceLabel: '高级药剂/百锻精铁' },
        B: {
          rewardCoin: [100000, 1000000],
          rewardRep: [200, 500],
          progress: [3, 5],
          resourceLabel: '一字斗铠图纸/百锻金属块',
        },
        A: {
          rewardCoin: [2000000, 20000000],
          rewardRep: [1000, 3000],
          progress: [4, 6],
          resourceLabel: '黄级机甲/千锻~灵锻金属',
        },
        S: {
          rewardCoin: [50000000, 300000000],
          rewardRep: [5000, 8000],
          progress: [5, 8],
          resourceLabel: '紫级以上机甲/魂锻天锻金属/极品道具',
        },
      });
      const QUEST_BOARD_PENDING_LIMIT = 8;
      const QUEST_BOARD_PENDING_STALE_TICKS = 4032;
      const QUEST_BOARD_ARCHIVE_STALE_TICKS = 2016;

      const QUEST_BOARD_GENERAL_DESCRIPTORS = Object.freeze([
        {
          id: 'daily',
          class: 'general',
          label: '日常',
          type: '日常委托',
          publishers: ['学院后勤', '本地商会', '城市委托板'],
          maxTierIndex: 1,
          titles: {
            D: ['城内代送', '街区寻物', '校区跑腿'],
            C: ['跨区代办', '仓单核对', '药剂代购'],
          },
        },
        {
          id: 'investigation',
          class: 'general',
          label: '调查',
          type: '调查委托',
          publishers: ['传灵塔', '学院情报处', '当地执法队'],
          maxTierIndex: 4,
          titles: {
            D: ['异常足迹核查', '街区消息回收', '失物线索确认'],
            C: ['黑市货物流向追查', '外围据点摸排', '失联补给点核验'],
            B: ['危险区坐标复核', '高价值情报回收', '独立遗迹线索比对'],
            A: ['高危区域密档调查', '大额悬赏情报锁定', '独立遗迹入口勘验'],
            S: ['封存档案追索', '王级侧线目标定位', '独立禁区坐标回收'],
          },
        },
        {
          id: 'gathering',
          class: 'general',
          label: '采集',
          type: '采集委托',
          publishers: ['药剂铺', '锻造工坊', '本地商会'],
          maxTierIndex: 4,
          titles: {
            D: ['常规药草采集', '基础矿料回收', '学院配给补料'],
            C: ['高级药材采收', '百锻材料搜集', '稀有票据换货'],
            B: ['千锻主材回收', '一字斗铠辅材搜集', '高价值矿脉采样'],
            A: ['灵锻材料定向搜集', '黄级机甲部件回收', '高危资源点采收'],
            S: ['魂锻试材搜寻', '极品侧线资源回收', '天锻前置材料封存'],
          },
        },
        {
          id: 'escort',
          class: 'general',
          label: '护送',
          type: '护送委托',
          publishers: ['本地商会', '联邦驿运站', '学院后勤'],
          maxTierIndex: 4,
          titles: {
            D: ['短程货箱护送', '票据转运护航', '学员物资押送'],
            C: ['跨区补给护送', '高价药剂押运', '工坊订单转运'],
            B: ['图纸密件护送', '稀有材料押运', '贵重货物交接'],
            A: ['机密模组护送', '黄级机甲部件押运', '大宗灵锻物资转运'],
            S: ['顶级拍品侧线押送', '魂锻资源封存护航', '高危独立运输委托'],
          },
        },
        {
          id: 'battle',
          class: 'general',
          label: '战斗',
          type: '战斗委托',
          publishers: ['城市守备队', '联邦军方', '战神殿外勤', '传灵塔外勤'],
          maxTierIndex: 4,
          titles: {
            D: ['街区治安清理', '低危魂兽驱离', '外围巡逻增援'],
            C: ['小股敌对势力清剿', '中危魂兽讨伐', '外围据点拔除'],
            B: ['高危目标悬赏', '危险群落歼灭', '精英目标处置'],
            A: ['高阶讨伐令', '大型敌对据点突袭', '重赏清场委托'],
            S: ['王级侧线目标讨伐', '独立高危封锁战', '黑市武装首脑清除'],
          },
        },
      ]);

      const QUEST_BOARD_PROFESSION_DESCRIPTORS = Object.freeze([
        {
          id: 'forging',
          class: 'profession',
          label: '副职业/锻造',
          type: '副职业委托',
          publisher: '锻造师协会',
          keywords: ['锻造'],
          titles: {
            D: ['基础锻胚整形', '工坊代锻练习件'],
            C: ['百锻精铁回火', '高级器胚定型'],
            B: ['千锻部件代工', '一字斗铠外甲成型'],
            A: ['灵锻主材调合', '黄级机甲骨架锻造'],
            S: ['魂锻试作委托', '天锻前置净化'],
          },
        },
        {
          id: 'design',
          class: 'profession',
          label: '副职业/设计',
          type: '副职业委托',
          publisher: '设计师协会',
          keywords: ['设计'],
          titles: {
            D: ['基础零件草图', '常规配件制图'],
            C: ['一字斗铠构型设计', '中级模组蓝图'],
            B: ['战术组件总图', '高阶图纸修订'],
            A: ['黄级机甲整机蓝图', '二字斗铠构型设计'],
            S: ['高阶原型机结构预案', '极限构型复核'],
          },
        },
        {
          id: 'manufacture',
          class: 'profession',
          label: '副职业/制造',
          type: '副职业委托',
          publisher: '制造师协会',
          keywords: ['制造'],
          titles: {
            D: ['基础模组装配', '常规药剂器皿组装'],
            C: ['高级模块拼装', '百锻器件封装'],
            B: ['战术组件总装', '稀有订单批量制造'],
            A: ['黄级机甲核心总装', '高危环境专用模块制造'],
            S: ['顶级原型模块试装', '魂锻配套组件封装'],
          },
        },
        {
          id: 'mecha',
          class: 'profession',
          label: '副职业/机甲',
          type: '副职业委托',
          publisher: '机甲师协会',
          keywords: ['机甲'],
          titles: {
            D: ['基础机甲校准', '黄级部件调试'],
            C: ['高阶动力舱调平', '常规机甲战术适配'],
            B: ['紫级模组测试', '黑级外骨架复核'],
            A: ['黄级整机联调', '高阶机甲作战调校'],
            S: ['顶级机甲原型试运转', '魂锻级动力核心联校'],
          },
        },
        {
          id: 'repair',
          class: 'profession',
          label: '副职业/修理',
          type: '副职业委托',
          publisher: '修理师协会',
          keywords: ['修理'],
          titles: {
            D: ['基础维护检修', '常规外甲修复'],
            C: ['中度损伤修复', '高精模块排障'],
            B: ['战地返修委托', '高价值装备复原'],
            A: ['黄级机甲抢修', '灵锻装备损伤修补'],
            S: ['高阶机甲大修', '魂锻部件极限修复'],
          },
        },
      ]);

      const questBoardClampIndex = value =>
        Math.max(0, Math.min(QUEST_BOARD_TIER_ORDER.length - 1, Math.floor(Number(value || 0))));
      const questBoardPickRandom = (list = []) => {
        const pool = Array.isArray(list) ? list.filter(Boolean) : [];
        return pool.length ? pool[Math.floor(Math.random() * pool.length)] : '';
      };
      const questBoardRandomInt = (minValue, maxValue) => {
        const min = Math.floor(Math.min(minValue, maxValue));
        const max = Math.floor(Math.max(minValue, maxValue));
        return min + Math.floor(Math.random() * (max - min + 1));
      };
      const questBoardRollWeighted = (entries = []) => {
        const pool = (Array.isArray(entries) ? entries : []).filter(entry => entry && Number(entry.weight || 0) > 0);
        if (!pool.length) return null;
        const total = pool.reduce((sum, entry) => sum + Number(entry.weight || 0), 0);
        let roll = Math.random() * total;
        for (const entry of pool) {
          roll -= Number(entry.weight || 0);
          if (roll <= 0) return entry.value;
        }
        return pool[pool.length - 1].value;
      };
      const questBoardRoundCoin = value => {
        const numeric = Math.max(0, Number(value || 0));
        if (numeric >= 100000000) return Math.round(numeric / 10000000) * 10000000;
        if (numeric >= 10000000) return Math.round(numeric / 1000000) * 1000000;
        if (numeric >= 1000000) return Math.round(numeric / 100000) * 100000;
        if (numeric >= 100000) return Math.round(numeric / 10000) * 10000;
        if (numeric >= 10000) return Math.round(numeric / 1000) * 1000;
        if (numeric >= 1000) return Math.round(numeric / 100) * 100;
        return Math.round(numeric / 50) * 50;
      };

      function getQuestBoardRegionLabel(char = {}) {
        const raw = String(char?.状态?.位置 || '当前区域')
          .replace(/^斗罗大陆-/, '')
          .replace(/^斗灵大陆-/, '')
          .trim();
        const segments = raw.split('-').filter(Boolean);
        if (segments.length >= 2) return segments.slice(-2).join('-');
        return segments[0] || '当前区域';
      }

      function getQuestBoardJobLevel(char = {}, keywords = []) {
        let result = 0;
        _(char?.职业 || {}).forEach((jobData, jobName) => {
          const safeName = String(jobName || '').trim();
          if (!safeName) return;
          if (
            (Array.isArray(keywords) ? keywords : []).some(keyword => safeName.includes(String(keyword || '').trim()))
          ) {
            result = Math.max(result, Number(jobData?.等级 || 0));
          }
        });
        return result;
      }

      function getQuestBoardMaxJobLevel(char = {}) {
        let result = 0;
        _(char?.职业 || {}).forEach(jobData => {
          result = Math.max(result, Number(jobData?.等级 || 0));
        });
        return result;
      }

      function getQuestCombatTierIndex(level = 0) {
        const lv = Number(level || 0);
        if (lv < 20) return 0;
        if (lv < 40) return 1;
        if (lv < 60) return 2;
        if (lv < 80) return 3;
        return 4;
      }

      function getQuestProfessionTierIndex(jobLevel = 0) {
        const lv = Number(jobLevel || 0);
        if (lv < 2) return 0;
        if (lv < 4) return 1;
        if (lv < 6) return 2;
        if (lv < 8) return 3;
        return 4;
      }

      function getQuestMixedTierIndex(combatIndex = 0, jobIndex = 0) {
        return questBoardClampIndex(Math.round(combatIndex * 0.65 + jobIndex * 0.35));
      }

      function rollQuestTierFromBase(baseIndex = 0) {
        const tables = [
          [
            { value: 'D', weight: 84 },
            { value: 'C', weight: 16 },
          ],
          [
            { value: 'D', weight: 45 },
            { value: 'C', weight: 45 },
            { value: 'B', weight: 10 },
          ],
          [
            { value: 'D', weight: 15 },
            { value: 'C', weight: 45 },
            { value: 'B', weight: 30 },
            { value: 'A', weight: 10 },
          ],
          [
            { value: 'C', weight: 10 },
            { value: 'B', weight: 50 },
            { value: 'A', weight: 39 },
            { value: 'S', weight: 1 },
          ],
          [
            { value: 'B', weight: 28 },
            { value: 'A', weight: 70 },
            { value: 'S', weight: 2 },
          ],
        ];
        return questBoardRollWeighted(tables[questBoardClampIndex(baseIndex)] || tables[0]) || 'D';
      }

      function buildQuestBoardReward(tier = 'D', powerFactor = 0.25) {
        const cfg = QUEST_BOARD_TIER_SETTINGS[tier] || QUEST_BOARD_TIER_SETTINGS.D;
        const factor = Math.max(0.05, Math.min(0.95, Number(powerFactor || 0)));
        const coinBias = Math.min(0.95, 0.2 + factor * 0.55 + Math.random() * 0.2);
        const repBias = Math.min(0.95, 0.15 + factor * 0.6 + Math.random() * 0.2);
        const rewardCoin = questBoardRoundCoin(cfg.rewardCoin[0] + (cfg.rewardCoin[1] - cfg.rewardCoin[0]) * coinBias);
        const rewardRep = Math.max(
          cfg.rewardRep[0],
          Math.round(cfg.rewardRep[0] + (cfg.rewardRep[1] - cfg.rewardRep[0]) * repBias),
        );
        return { rewardCoin, rewardRep };
      }

      function buildQuestBoardRequiredCount(tier = 'D', descriptor = {}) {
        const cfg = QUEST_BOARD_TIER_SETTINGS[tier] || QUEST_BOARD_TIER_SETTINGS.D;
        let min = Number(cfg.progress?.[0] || 1);
        let max = Number(cfg.progress?.[1] || 1);
        if (descriptor.id === 'daily') max = Math.max(min, max - 1);
        if (descriptor.id === 'battle' || descriptor.id === 'escort') max += 1;
        if (descriptor.class === 'profession' && tier === 'S') max += 1;
        return questBoardRandomInt(min, max);
      }

      function buildQuestBoardTitle(descriptor = {}, tier = 'D') {
        const titles = descriptor?.titles?.[tier] ||
          descriptor?.titles?.A ||
          descriptor?.titles?.C ||
          descriptor?.titles?.D || [descriptor?.label || '委托'];
        return questBoardPickRandom(titles) || `${tier}级${descriptor?.label || '委托'}`;
      }

      function buildQuestBoardTextPackage(descriptor = {}, tier = 'D', context = {}) {
        const regionLabel = context.regionLabel || '当前区域';
        const publisher = context.publisher || '系统';
        const resourceLabel = context.resourceLabel || '常规资源';
        const progressCount = Math.max(1, Number(context.progressCount || 1));
        switch (descriptor.id) {
          case 'daily':
            return {
              publicDesc: `委托板仅公开：${regionLabel}附近挂出一份${tier}级日常杂务，可能涉及代送、寻物或代办，接取后才会告知具体对象与交付路线。`,
              hiddenDesc: `在${regionLabel}范围内完成一份低风险日常事务：按委托人要求处理代送、寻物或回执核对，预计需要 ${progressCount} 个阶段。该委托仅服务地方日常运转，不涉及任何主线命运节点。`,
            };
          case 'investigation':
            return {
              publicDesc: `${publisher}仅公开：需要一名外勤核查${regionLabel}周边异常情报，接取后才会发放目标坐标与比对要求。`,
              hiddenDesc: `前往${regionLabel}周边核查一条独立的异常线索，完成现场记录、对象确认与结果回传，预计需要 ${progressCount} 个阶段。该委托仅影响地方侧线调查，不涉及主线人物与命运锚点。`,
            };
          case 'gathering':
            return {
              publicDesc: `委托板仅公开：有人悬赏与【${resourceLabel}】相关的采集/寻物事务，详情需在接取后确认。`,
              hiddenDesc: `在${regionLabel}附近采集或回收与【${resourceLabel}】匹配的指定材料，并完成交割与验收，预计需要 ${progressCount} 个阶段。任务目标为独立资源补给，不涉及主线推进。`,
            };
          case 'escort':
            return {
              publicDesc: `${publisher}仅公开：需要护送一批达到【${resourceLabel}】级别的物资，接取后才会告知路线与交接人。`,
              hiddenDesc: `护送一批与【${resourceLabel}】匹配的货物穿过${regionLabel}周边节点并完成签收，途中可能遭遇独立支线冲突，预计需要 ${progressCount} 个阶段，但不会触碰主线流程。`,
            };
          case 'battle':
            return tier === 'S'
              ? {
                  publicDesc: `${publisher}仅公开：${regionLabel}附近出现需要处理的独立高危目标，悬赏面向公开魂师，具体战区与对手信息需接取后披露。`,
                  hiddenDesc: `处理一处完全独立于主线的高危战斗委托，对象为${regionLabel}外缘活动的王级/统领级侧线目标或黑市武装首脑。预计需要 ${progressCount} 个阶段，结算后仅影响地方安保与资源流向，不影响主线命运锚点。`,
                }
              : {
                  publicDesc: `${publisher}仅公开：${regionLabel}附近出现需要处理的危险目标，悬赏面向公开魂师。`,
                  hiddenDesc: `在${regionLabel}附近清理独立危险目标或小股敌对势力，并回收可证明战果的凭证，预计需要 ${progressCount} 个阶段。该委托仅影响地方治安与支线资源。`,
                };
          case 'forging':
            return {
              publicDesc: `锻造师协会仅公开：有一份${tier}级代工框架，需要具备相应锻造基础的承接者，接取后才会披露具体部件参数。`,
              hiddenDesc: `为委托方处理一件与【${resourceLabel}】匹配的锻造代工/回火/成型任务，重点考验锻造火候与材料处理，预计需要 ${progressCount} 个阶段。该订单属于独立工坊委托，不涉及主线剧情。`,
            };
          case 'design':
            return {
              publicDesc: `设计师协会仅公开：有一份${tier}级蓝图设计框架待承接，接取后才会下发详细结构约束。`,
              hiddenDesc: `为委托方完成一份与【${resourceLabel}】相关的构型设计/图纸修订任务，预计需要 ${progressCount} 个阶段。该订单属于独立设计委托，不涉及主线流程。`,
            };
          case 'manufacture':
            return {
              publicDesc: `制造师协会仅公开：有一份${tier}级组装/封装框架待承接，接取后才会告知模块清单。`,
              hiddenDesc: `为委托方完成一批与【${resourceLabel}】相关的制造/总装任务，需要处理装配、校验与交付，预计需要 ${progressCount} 个阶段。该委托为独立产线订单，不影响主线剧情。`,
            };
          case 'mecha':
            return {
              publicDesc: `机甲师协会仅公开：有一份${tier}级机甲调校框架，需要具备对应基础的承接者，接取后才会发放整机参数。`,
              hiddenDesc: `对一台与【${resourceLabel}】相匹配的机甲或动力模块进行调校、联动或测试，预计需要 ${progressCount} 个阶段。该任务属于独立技术订单，不影响主线命运节点。`,
            };
          case 'repair':
            return {
              publicDesc: `修理师协会仅公开：有一份${tier}级维护/修复框架待承接，接取后才会披露受损部件清单。`,
              hiddenDesc: `为委托方处理一件与【${resourceLabel}】相关的维护、排障或修复任务，预计需要 ${progressCount} 个阶段。该委托属于独立售后/战地返修订单，不涉及主线推进。`,
            };
          default:
            return {
              publicDesc: `${publisher}挂出了一份${tier}级公开委托框架，接取后才会披露完整目标。`,
              hiddenDesc: `完成一份与【${resourceLabel}】相关的独立支线委托，预计需要 ${progressCount} 个阶段，不涉及主线剧情节点。`,
            };
        }
      }

      function pickQuestBoardDescriptor(playerChar = {}) {
        const combatTierIndex = getQuestCombatTierIndex(Number(playerChar?.属性?.等级 || 0));
        const maxJobLevel = getQuestBoardMaxJobLevel(playerChar);
        const descriptors = [
          { descriptor: QUEST_BOARD_GENERAL_DESCRIPTORS[0], weight: 24 },
          { descriptor: QUEST_BOARD_GENERAL_DESCRIPTORS[1], weight: 14 + combatTierIndex * 3 },
          { descriptor: QUEST_BOARD_GENERAL_DESCRIPTORS[2], weight: 14 + Math.max(0, Math.floor(maxJobLevel * 1.5)) },
          { descriptor: QUEST_BOARD_GENERAL_DESCRIPTORS[3], weight: 10 + combatTierIndex * 3 },
          { descriptor: QUEST_BOARD_GENERAL_DESCRIPTORS[4], weight: 8 + combatTierIndex * 8 },
        ];
        QUEST_BOARD_PROFESSION_DESCRIPTORS.forEach(descriptor => {
          const jobLevel = getQuestBoardJobLevel(playerChar, descriptor.keywords || []);
          if (jobLevel > 0) {
            descriptors.push({ descriptor: { ...descriptor, _jobLevel: jobLevel }, weight: 4 + jobLevel * 5 });
          }
        });
        return (
          questBoardRollWeighted(descriptors.map(item => ({ value: item.descriptor, weight: item.weight }))) ||
          QUEST_BOARD_GENERAL_DESCRIPTORS[0]
        );
      }

      function resolveQuestBoardBaseTierIndex(playerChar = {}, descriptor = {}) {
        const combatTierIndex = getQuestCombatTierIndex(Number(playerChar?.属性?.等级 || 0));
        const maxJobTierIndex = getQuestProfessionTierIndex(getQuestBoardMaxJobLevel(playerChar));
        if (descriptor.class === 'profession') {
          return questBoardClampIndex(
            Math.round(getQuestProfessionTierIndex(Number(descriptor._jobLevel || 0)) * 0.75 + combatTierIndex * 0.25),
          );
        }
        if (descriptor.id === 'daily')
          return questBoardClampIndex(Math.max(0, Math.round(combatTierIndex * 0.65 + maxJobTierIndex * 0.2) - 1));
        if (descriptor.id === 'battle') return combatTierIndex;
        if (descriptor.id === 'escort')
          return questBoardClampIndex(Math.round(combatTierIndex * 0.7 + maxJobTierIndex * 0.3));
        return getQuestMixedTierIndex(combatTierIndex, maxJobTierIndex);
      }

      function buildQuestBoardFrame(playerChar = {}, currentTickValue = 0) {
        const descriptor = pickQuestBoardDescriptor(playerChar);
        if (!descriptor) return null;
        const baseTierIndex = resolveQuestBoardBaseTierIndex(playerChar, descriptor);
        let tier = rollQuestTierFromBase(baseTierIndex);
        let tierIndex = questBoardClampIndex(QUEST_BOARD_TIER_ORDER.indexOf(tier));
        const maxTierIndex = Number.isFinite(Number(descriptor.maxTierIndex))
          ? questBoardClampIndex(descriptor.maxTierIndex)
          : QUEST_BOARD_TIER_ORDER.length - 1;
        if (tierIndex > maxTierIndex) tierIndex = maxTierIndex;
        tier = QUEST_BOARD_TIER_ORDER[tierIndex] || tier;
        const regionLabel = getQuestBoardRegionLabel(playerChar);
        const publisher = descriptor.publisher || questBoardPickRandom(descriptor.publishers || ['系统']) || '系统';
        const resourceLabel = QUEST_BOARD_TIER_SETTINGS[tier]?.resourceLabel || '常规资源';
        const progressCount = buildQuestBoardRequiredCount(tier, descriptor);
        const playerLevel = Number(playerChar?.属性?.等级 || 0);
        const relevantJobLevel =
          descriptor.class === 'profession' ? Number(descriptor._jobLevel || 0) : getQuestBoardMaxJobLevel(playerChar);
        const powerFactor = Math.min(
          1,
          Math.max(
            0.05,
            (playerLevel / 100) * 0.7 + (relevantJobLevel / 10) * (descriptor.class === 'profession' ? 0.3 : 0.2),
          ),
        );
        const reward = buildQuestBoardReward(tier, powerFactor);
        const title = buildQuestBoardTitle(descriptor, tier);
        const textPackage = buildQuestBoardTextPackage(descriptor, tier, {
          regionLabel,
          publisher,
          resourceLabel,
          progressCount,
          currentTickValue,
        });
        return {
          tier,
          title,
          descriptor,
          publisher,
          resourceLabel,
          progressCount,
          rewardCoin: reward.rewardCoin,
          rewardRep: reward.rewardRep,
          publicDesc: textPackage.publicDesc,
          hiddenDesc: textPackage.hiddenDesc,
        };
      }

      refreshQuestBoardFrames = function refreshQuestBoardFrames(dataRef, currentTickValue = 0) {
        if (!dataRef?.world) return;
        if (!dataRef.world.委托板 || typeof dataRef.world.委托板 !== 'object') dataRef.world.委托板 = {};
        const board = dataRef.world.委托板;

        Object.keys(board).forEach(questId => {
          const entry = board[questId];
          if (!entry || typeof entry !== 'object') {
            delete board[questId];
            return;
          }
          const generatedTick = Number(entry.生成tick || 0);
          if (generatedTick <= 0) return;
          const age = Math.max(0, Number(currentTickValue || 0) - generatedTick);
          const 状态 = String(entry.状态 || '待接取');
          if (状态 === '待接取' && age >= QUEST_BOARD_PENDING_STALE_TICKS) delete board[questId];
          else if ((状态 === '已完成' || 状态 === '已放弃') && age >= QUEST_BOARD_ARCHIVE_STALE_TICKS)
            delete board[questId];
        });

        const pendingEntries = Object.entries(board).filter(
          ([, entry]) => String(entry?.状态 || '待接取') === '待接取',
        );
        if (pendingEntries.length >= QUEST_BOARD_PENDING_LIMIT) return;

        const playerName = String(dataRef?.sys?.玩家名 || '').trim();
        const playerChar = playerName ? dataRef?.char?.[playerName] : null;
        if (!playerChar) return;

        const combatTierIndex = getQuestCombatTierIndex(Number(playerChar?.属性?.等级 || 0));
        const maxJobLevel = getQuestBoardMaxJobLevel(playerChar);
        const spawnChance = Math.min(
          82,
          35 + Math.max(0, 5 - pendingEntries.length) * 5 + combatTierIndex * 4 + Math.floor(maxJobLevel * 1.5),
        );
        const roll = questBoardRandomInt(1, 100);
        if (roll > spawnChance) return;

        const frame = buildQuestBoardFrame(playerChar, currentTickValue);
        if (!frame) return;

        let questIdBase = `${frame.tier}级委托·${frame.title}`;
        let questId = questIdBase;
        let suffix = 2;
        while (board[questId]) {
          questId = `${questIdBase}#${suffix}`;
          suffix += 1;
        }

        board[questId] = {
          标题: frame.title,
          类型: frame.descriptor?.type || '委托',
          描述: frame.hiddenDesc || '无',
          框架描述: frame.publicDesc || '无',
          发布者: frame.publisher || '系统',
          面向: '公开',
          指定对象: '无',
          状态: '待接取',
          难度: `${frame.tier}级`,
          资源级别: frame.resourceLabel || '无',
          目标进度: frame.progressCount,
          奖励币: frame.rewardCoin,
          奖励声望: frame.rewardRep,
          承接者: '无',
          生成tick: Number(currentTickValue || 0),
        };

        if (!dataRef.sys?.系统播报 || dataRef.sys.系统播报 === '初始化') {
          追加系统播报文本(
            dataRef,
            `[委托刷新] ${frame.publisher} 挂出了一份${frame.tier}级【${frame.descriptor?.label || '公开'}】委托框架：${frame.title}。`,
          );
        }
      };

      if (typeof obj !== 'object' || obj === null) return obj;
      return Object.keys(obj).reduce((acc, key) => {
        acc[key.toLowerCase()] = obj[key];
        return acc;
      }, {});
    };

    function rollSpirit(talentTier, lv, spiritIndex, realm) {
      const roll = Math.floor(Math.random() * 100) + 1;
      const talentScore = { 绝世妖孽: 100, 顶级天才: 80, 天才: 60, 优秀: 40, 正常: 20, 劣等: 0, 天赋极差: -100 }[talentTier] || 20;
      const sequenceScore = [0, 40, 90, 150, 220, 300, 400, 500, 600][spiritIndex] || spiritIndex * 80;
      let extraLvScore = lv > 95 ? Math.floor(lv - 95) * 50 : 0;
      const totalScore = roll + talentScore + lv * 2 + sequenceScore + extraLvScore;
      let age = 50,
        cap = 1;
      if (totalScore >= 600) {
        age = 100000 + (totalScore - 600) * 1000 + Math.floor(Math.random() * 5000);
        cap = 4;
      } else if (totalScore >= 300) {
        age = 10000 + (totalScore - 300) * 200 + Math.floor(Math.random() * 2000);
        cap = 4;
      } else if (totalScore >= 240) {
        age = 1000 + (totalScore - 240) * 100 + Math.floor(Math.random() * 500);
        cap = 3;
      } else if (totalScore >= 180) {
        age = 100 + (totalScore - 180) * 10 + Math.floor(Math.random() * 50);
        cap = 2;
      }

      const realmCaps = { 灵元境: 400, 灵通境: 3000, 灵海境: 15000, 灵渊境: 100000, 灵域境: 999999, 神元境: 999999 };
      let maxAge = realmCaps[realm] || 400;
      if (age > maxAge) {
        if (maxAge >= 100000) {
          age = 100000;
          cap = 3;
        } else if (maxAge >= 15000) {
          age = 15000;
          cap = 4;
        } else if (maxAge >= 3000) {
          age = 3000;
          cap = 3;
        } else if (maxAge >= 400) {
          age = 400;
          cap = 2;
        } else {
          age = 50;
          cap = 1;
        }
      }

      const highTalent = ['绝世妖孽', '顶级天才', '天才'].includes(String(talentTier || ''));
      const shouldApplyFirstSpiritLowLevelCap = spiritIndex === 0 && lv < 30;
      if (spiritIndex === 0) {
        if (shouldApplyFirstSpiritLowLevelCap && highTalent) {
          const firstSpiritScore = Math.max(0, totalScore - 80);
          age = 100 + Math.min(200, Math.floor(firstSpiritScore * 2) + Math.floor(Math.random() * 21));
          age = Math.min(300, age);
          cap = age >= 100 ? 2 : 1;
        } else if (shouldApplyFirstSpiritLowLevelCap) {
          age = Math.min(100, Math.max(50, age));
          cap = age >= 100 ? 2 : 1;
        }
        if (cap > 2) cap = 2;
      } else if (spiritIndex <= 1 && cap > 2) {
        cap = 2;
      }
      age = Math.max(50, Math.floor(age));
      const color = getRingColorByAge(age);
      const initProvideCap = cap;
      return { age, color, cap, initProvideCap };
    }

    const resourceStateBeforeRecalc = new Map();

    _(data.char).forEach((char, charName) => {
      resourceStateBeforeRecalc.set(charName, {
        魂力: Math.max(0, Number(char.属性?.魂力 || 0)),
        魂力上限: Math.max(1, Number(char.属性?.魂力上限 || 1)),
        精神力: Math.max(0, Number(char.属性?.精神力 || 0)),
        精神力上限: Math.max(1, Number(char.属性?.精神力上限 || 1)),
        体力: Math.max(0, Number(char.属性?.体力 || 0)),
        体力上限: Math.max(1, Number(char.属性?.体力上限 || 1)),
        HP: Math.max(0, Number(char.属性?.HP || 0)),
        HP上限: Math.max(1, Number(char.属性?.HP上限 || char.属性?.体力上限 || 1)),
      });
      let isBeast = isSoulBeastCharacter(char);
      let expectedRings = isBeast ? 0 : Math.floor(char.属性.等级 / 10);
      let currentRings = 0;
      let currentSpirits = 0;
      let firstSpiritName = '未知武魂';
      syncSoulTowerRecordEligibility(char);

      if (!char.武魂) char.武魂 = {};
      let spiritKeys = Object.keys(char.武魂);
      if (spiritKeys.length > 0) {
        firstSpiritName = spiritKeys[0];
        let targetSpirit = char.武魂[firstSpiritName];
        _(targetSpirit.魂灵 || {}).forEach(ss => {
          currentSpirits++;
          if (ss.魂环) currentRings += Object.keys(ss.魂环).length;
        });
        currentRings += Object.keys(targetSpirit.独立魂环 || {}).length;
      }

      const isPlayer = charName === data.sys?.玩家名;
      const playerChar = data.char[data.sys?.玩家名];
      const isSameNodeGroup = (c1, c2) => {
        if (!c1 || !c2) return false;
        const loc1 = c1.状态?.位置 || '';
        const loc2 = c2.状态?.位置 || '';
        if (loc1 && loc2 && loc1 === loc2) return true;
        const dyn = data.world?.动态地点 || {};
        const p1 = dyn[loc1]?.归属父节点 || loc1.split('-').slice(0, -1).join('-');
        const p2 = dyn[loc2]?.归属父节点 || loc2.split('-').slice(0, -1).join('-');
        return p1 && p2 && p1 === p2;
      };
      const isNearPlayer = !isPlayer && isSameNodeGroup(char, playerChar);

      if (currentRings === 0 && expectedRings > 0 && currentSpirits === 0) {
        if (isPlayer && data.sys?.系统播报 !== '初始化') return;
        if (isNearPlayer && data.sys?.系统播报 !== '初始化') return;

        if (spiritKeys.length === 0) {
          char.武魂[firstSpiritName] = {
            表象名称: '未展露',
            type: char.属性.系别,
            魂灵: {},
            独立魂环: {},
            领域: {},
          };
          spiritKeys = [firstSpiritName];
        }

        spiritKeys.forEach(spiritKey => {
          let targetSpirit = char.武魂[spiritKey];
          if (!targetSpirit.表象名称) targetSpirit.表象名称 = '未展露';
          if (!targetSpirit.魂灵) targetSpirit.魂灵 = {};
          if (!targetSpirit.独立魂环) targetSpirit.独立魂环 = {};

          let ringsNeeded = expectedRings;
          let currentRingIndex = 1;
          let spiritIndex = 0;
          let lastAge = 0;

          const realmLimit =
            { 灵元境: 1, 灵通境: 2, 灵海境: 5, 灵渊境: 9, 灵域境: 99, 神元境: 999 }[
              char.属性.精神境界 || char.属性.精神力_realm
            ] || 1;

          let currentTotalSpirits = 0;
          _(char.武魂).forEach(sp => {
            currentTotalSpirits += Object.keys(sp.魂灵 || {}).length;
          });
          while (ringsNeeded > 0 && spiritIndex < 9 && currentTotalSpirits < realmLimit) {
            let spData = rollSpirit(
              char.属性.天赋梯队,
              char.属性.等级,
              spiritIndex,
              char.属性.精神境界 || char.属性.精神力_realm,
            );

            if (spData.age <= lastAge) {
              spData.age = lastAge + Math.floor(Math.random() * 100) + 10;
            }
            spData.age = Math.max(50, Math.floor(spData.age));
            spData.color = getRingColorByAge(spData.age);
            lastAge = spData.age;

            let ringsToProvide = Math.min(spData.initProvideCap ?? spData.cap, ringsNeeded);

            let spiritName = spiritIndex === 0 ? '第1魂灵' : `第${spiritIndex + 1}魂灵`;
            let talentBonus =
              { 绝世妖孽: 30, 顶级天才: 20, 天才: 10, 优秀: 0, 正常: -10, 劣等: -20, 天赋极差: -40 }[char.属性.天赋梯队] || 0;
            let indexBonus = spiritIndex * 5;
            let calculatedComp = Math.min(100, Math.max(0, 60 + talentBonus + indexBonus));

            targetSpirit.魂灵[spiritName] = {
              表象名称: AI_TODO_SOUL_SPIRIT_NAME,
              描述: buildSoulSpiritDescriptionTodoText({
                表象名称: AI_TODO_SOUL_SPIRIT_NAME,
                年限: spData.age,
                品质: AI_TODO_SOUL_SPIRIT_QUALITY,
                状态: '活跃',
              }),
              年限: spData.age,
              品质: AI_TODO_SOUL_SPIRIT_QUALITY,
              契合度: calculatedComp,
              状态: '活跃',
              魂环: {},
            };

            for (let i = 0; i < ringsToProvide; i++) {
              targetSpirit.魂灵[spiritName].魂环[currentRingIndex.toString()] = {
                年限: spData.age,
                颜色: getRingColorByAge(spData.age),
                魂技: {
                  [`第${currentRingIndex}魂技`]: {
                    魂技名: AI_TODO_SKILL_NAME,
                    画面描述: '未知',
                    效果描述: '未知',
                    _效果数组: [],
                  },
                },
              };
              targetSpirit.魂灵[spiritName].魂环[currentRingIndex.toString()].魂技 = buildDefaultRingSkillMap(currentRingIndex, spData.age);
              currentRingIndex++;
            }
            ringsNeeded -= ringsToProvide;
            spiritIndex++;
            currentTotalSpirits++;
          }
        });
      }
    });

    const buildUpcomingTimelinePreview = (timelineEvents, currentTick, flags = {}, limit = 5) => {
      const allEvents = Array.isArray(timelineEvents) ? timelineEvents : Object.values(timelineEvents || {}).flat();

      return allEvents
        .map(lowerCaseKeys)
        .map(event => {
          const flag = event.事件名 || event.event_name || event.flag || 'unknown_event';
          const tick = Number(event.tick || 0);
          const desc = event.description || event.trigger_background || event['描述'] || '无';
          return {
            flag,
            tick,
            eta: tick - currentTick,
            desc,
          };
        })
        .filter(event => event.flag && Number.isFinite(event.tick) && event.tick > currentTick && !flags[event.flag])
        .sort((a, b) => a.tick - b.tick)
        .slice(0, limit);
    };

    const isIntelRequestKey = requestKey => String(requestKey || '').trim().startsWith('intel_');

    const buildUpcomingTimelinePreviewText = (previewList = []) => {
      if (!Array.isArray(previewList) || previewList.length === 0) {
        return '当前暂无后续时间线节点。';
      }
      return ['接下来可能发生的时间线节点（仅供控速参考，不可提前落地）：']
        .concat(
          previewList.map((item, index) => {
            const tick = Number(item.tick || 0);
            const eta = Number(item.eta || 0);
            const desc = item.desc || '无';
            const calendarText = formatTickToCalendar(tick);
            const etaText = formatTickDeltaText(eta);
            return `${index + 1}. ${calendarText}（约 ${etaText}后）: ${desc}`;
          }),
        )
        .join('\n');
    };

    const upcomingTimelinePreview =
      typeof TimelineEvents !== 'undefined'
        ? buildUpcomingTimelinePreview(TimelineEvents, currentTick, data.world.时间线 || {}, 5)
        : [];
    if (!data.world._引导 || typeof data.world._引导 !== 'object' || Array.isArray(data.world._引导)) data.world._引导 = {};
    data.world._引导.时间线预览 = buildUpcomingTimelinePreviewText(upcomingTimelinePreview);
    const pendingTimelineReasonEntries = [];
    const pendingSecretIntelReasonEntries = [];

    if (typeof TimelineEvents !== 'undefined') {
      let dev = data.world.偏差值 || 0;

      let allEvents = Array.isArray(TimelineEvents) ? TimelineEvents : Object.values(TimelineEvents).flat();

      allEvents.map(lowerCaseKeys).forEach(event => {
        let eventKey = event.事件名 || event.event_name || event.flag;
        if (!data.world.时间线[eventKey]) {
          let drift = dev > 0 ? Math.floor((Math.random() * 2 - 1) * dev * 100) : 0;
          let actualTick = event.tick + drift;

          if (currentTick >= actualTick) {
            let {
              tick,
              event_name,
              trigger_background,
              description,
              flag,
              impact_level,
              related_mainline,
              ...updates
            } = event;

            const eventDesc =
              event.描述 ||
              description ||
              event.trigger_background ||
              event.触发背景 ||
              event.event_name ||
              event.事件名 ||
              eventKey ||
              '未知事件';
            data.world.时间线[eventKey] = {
              触发tick: actualTick,
              事件: event_name || event.事件名 || eventKey || eventDesc,
              状态: 'pending',
            };
            pendingTimelineReasonEntries.push(dev >= 40 ? `${eventDesc}(高偏差)` : eventDesc);
          }
        }
      });
    }

    if (typeof IntelEvents !== 'undefined') {
      let dev = data.world.偏差值 || 0;

      let allIntels = Array.isArray(IntelEvents) ? IntelEvents : Object.values(IntelEvents).flat();

      allIntels.map(lowerCaseKeys).forEach((intel, index) => {
        let intelKey = intel.trigger_flag ? `intel_${intel.trigger_flag}` : `intel_${intel.tick}_${index}`;
        if (!hasSecretIntel(intelKey)) {
          let drift = dev > 0 ? Math.floor((Math.random() * 2 - 1) * dev * 100) : 0;
          let actualTick = intel.tick + drift;

          if (currentTick >= actualTick) {
            if (intel.knowers || getDefaultSecretIntelKnowers_ACU(intelKey).length > 0) {
              const { rules, targets } = resolveSecretIntelKnowers_ACU({
                knowers: intel.knowers,
                标题: intel.trigger_flag || intel.content || intelKey,
              });
              const uniqueTargets = Array.from(new Set(targets.filter(Boolean)));
              upsertSecretIntel(intelKey, {
                标题: intel.trigger_flag || intel.content || intelKey,
                内容: intel.content || intel.trigger_flag || '无',
                知情规则: rules,
                知情对象: uniqueTargets,
              });
              if (uniqueTargets.length > 0) {
                const visibleTargets = uniqueTargets.slice(0, 2).join('、');
                pendingSecretIntelReasonEntries.push(`${intel.content || intel.trigger_flag || '未知情报'}→${visibleTargets}${uniqueTargets.length > 2 ? `等${uniqueTargets.length}人` : ''}`);
              }
            }

            if (dev >= 40) {
              appendSystemReasonText(
                `🚨[情报异变] 偏差值过高！刚刚解锁的【${String(intel.content || intel.trigger_flag || '未知情报').substring(0, 10)}...】情报可能已被第三方篡改或发生恶性反转，请 AI 自由推演！`,
              );
            }
          }
        }
      });
    }
    refreshSecretIntelAudienceDistribution_ACU();
    appendSystemReasonBatchText('[编年史待处理]', pendingTimelineReasonEntries);
    appendSystemReasonBatchText('[机密情报待处理]', pendingSecretIntelReasonEntries);
    data.sys.系统播报 = compactInternalSystemReasonText(data.sys.系统播报);

    const highTierSoulSpiritStatus = String(data.world.时间线?.event_clt_wannian?.状态 || '').trim();
    if (/handled|done|完成|已处理/i.test(highTierSoulSpiritStatus)) {
      data.world.传灵塔千年魂灵开放 = true;
    }

    const pruneDefaultMentalDomainState = (char = {}) => {
      const mentalDomain = char.精神领域 && typeof char.精神领域 === 'object' ? char.精神领域 : null;
      if (!mentalDomain) return;
      const domainName = String(mentalDomain.名称 || '').trim();
      const domainDesc = String(mentalDomain.描述 || '').trim();
      const domainActive = !!mentalDomain.进行中;
      const hasMeaningfulModifier = Object.values(mentalDomain.战斗修饰 || {}).some(modifier => {
        if (!modifier || typeof modifier !== 'object') return false;
        return Object.values(modifier).some(value => {
          if (typeof value === 'boolean') return value;
          if (typeof value === 'number') return value !== 0 && value !== 1;
          if (typeof value === 'string') return value.trim() && value.trim() !== '无';
          return false;
        });
      });
      const isDefaultMentalDomainShell =
        !domainActive &&
        !hasMeaningfulModifier &&
        (!domainName || domainName === '无') &&
        (!domainDesc || domainDesc === '无');
      if (isDefaultMentalDomainShell) {
        delete char.精神领域;
      } else if (!domainActive && mentalDomain.维护消耗 && Number(mentalDomain.维护消耗.精神力 || 0) <= 0) {
        delete mentalDomain.维护消耗;
      }
    };

    _(data.char).forEach(c => pruneDefaultMentalDomainState(c));

    if (delta > 0) {
      let daysPassed = Math.floor(currentTick / 144) - Math.floor(lastTick / 144);
      const stipendPayoutTicks = getMonthlyStipendTicksCrossed_ACU(lastTick, currentTick);
      const stipendReasonEntries = [];
      stipendPayoutTicks.forEach(payoutTick => {
        const payoutItems = [];
        _(data.char).forEach((c, charName) => {
          if (!isSoulMasterStipendEligible_ACU(c)) return;
          if (!c.财富 || typeof c.财富 !== 'object' || Array.isArray(c.财富)) c.财富 = {};
          const stipendDays = getSoulMasterStipendDaysByLevel_ACU(c.属性?.等级 || 0);
          const stipendAmount = stipendDays * BASE_DAILY_LIVING_COST_ACU;
          if (!(stipendAmount > 0)) return;
          c.财富.联邦币 = Math.max(0, Number(c.财富.联邦币 || 0)) + stipendAmount;
          payoutItems.push(`${charName}+${stipendAmount}`);
        });
        if (payoutItems.length) {
          stipendReasonEntries.push(`${formatTickToCalendar(payoutTick)} ${payoutItems.slice(0, 3).join('；')}${payoutItems.length > 3 ? ` 等${payoutItems.length}人` : ''}`);
        }
      });
      appendSystemReasonBatchText('[魂师津贴发放]', stipendReasonEntries, { limit: 2 });

      _(data.char).forEach((c, charName) => {
        const trainedBonus = ensureNumericStatBonusMap(c.属性, '训练加成');
        if (daysPassed > 0 && Math.random() < 0.05) {
          const locName = _.get(c, '状态.位置', '');
          const locData =
            _.get(data, ['world', '地点', locName], null) ||
            _.get(data, ['world', '动态地点', locName], null);

          const opportunities = Array.isArray(locData && locData.opportunities) ? locData.opportunities : [];

          if (opportunities.length > 0) {
            let event = opportunities[Math.floor(Math.random() * opportunities.length)];
            if (data.sys.系统播报 === '初始化' || !data.sys.系统播报) data.sys.系统播报 = '';
            data.sys.系统播报 += ` 🎲[区域机遇] ${charName} 在【${locName}】触发了特殊事件：${event}！(请 AI 自由推演细节)`;
          }
        }
        if (c.状态.位置 && c.状态.位置.includes('血神军团入伍考核')) {
          c.属性.魂力 = 0;
          if (!c.属性.状态效果['禁魔领域']) {
            c.属性.状态效果['禁魔领域'] = {
              类型: 'debuff',
              层数: 1,
              描述: '处于考核虚拟网中，魂力被绝对封印，仅能使用肉体力量与气血',
            };
          }
        } else {
          delete c.属性.状态效果['禁魔领域'];
        }

        if (c.状态.存活 && getComputedWoundLevelFromStat(c.属性) !== '濒死') {
          if (daysPassed > 0 && c.状态.行动 === '日常') {
            const 城市档位信息 = 判定城市规模档位_ACU(c);
            const 城市档位索引 = Math.max(-1, Math.min(3, Number(城市档位信息.档位索引 ?? -1)));

            if (城市档位索引 >= 0) {
              if (!c.财富 || typeof c.财富 !== 'object' || Array.isArray(c.财富)) c.财富 = {};
              const 当前存款 = Math.max(0, Number(c.财富?.联邦币 || 0));
              const 基础日消费 = BASE_DAILY_LIVING_COST_ACU;
              const 可负担档位索引 = 计算可负担消费档位_ACU(当前存款, 基础日消费, 城市档位索引);
              const 消费倍率 = Number(城市消费倍率表_ACU[可负担档位索引] || 1);
              const 实际消费 = Math.max(0, Math.floor(基础日消费 * daysPassed * 消费倍率));
              const 实际可扣 = 当前存款 >= 实际消费;
              if (可负担档位索引 < 城市档位索引) {
                appendSystemReasonText(
                  `[城市消费降档] ${charName} 所在地区档位由${城市档位名称表_ACU[城市档位索引]}(${城市消费倍率表_ACU[城市档位索引]}x)自动降为${城市档位名称表_ACU[可负担档位索引]}(${消费倍率}x)。`,
                );
              }
              if (实际可扣) {
                c.财富.联邦币 = Math.max(0, 当前存款 - 实际消费);
                delete c.属性.状态效果['饥饿'];
              } else {
                c.财富.联邦币 = 0;
                const starvationLoss = Math.max(1, Math.floor(Math.max(1, Number(c.属性.体力上限 || 1)) * 0.05 * daysPassed));
                c.属性.体力 = Math.max(0, Number(c.属性.体力 || 0) - starvationLoss);
                c.属性.状态效果['饥饿'] = {
                  类型: 'debuff',
                  层数: Math.max(1, daysPassed),
                  描述: `缺乏资金购买食物，体力额外流失 ${starvationLoss} 点，力量/防御/敏捷与魂力上限下降。`,
                  stat_mods: { str: 0.92, def: 0.92, agi: 0.9, sp_max: 0.95 },
                };
              }
            }
          }

          const declaredAction = String(c.状态.行动 || '日常').trim() || '日常';
          if (declaredAction === '凝聚魂核') c.状态.行动 = '冥想';
          const normalizedDeclaredAction = normalizeCharacterActionMode_ACU(declaredAction);
          const beforeCoreCount = Math.max(0, Math.floor(Number(c.魂核?.核心?.数量 || 0)));
          if (declaredAction === '日常') {
            let segmentTickCursor = lastTick;
            while (segmentTickCursor < currentTick) {
              const nextBoundaryTick = getNextDailyAutoBoundaryTick_ACU(segmentTickCursor, currentTick);
              const segmentDelta = Math.max(0, Number(nextBoundaryTick || 0) - Number(segmentTickCursor || 0));
              if (!(segmentDelta > 0)) break;
              const segmentAction = isNightMeditationTick_ACU(segmentTickCursor)
                ? (shouldDailyAutoSleep_ACU(c) ? '睡眠' : '冥想')
                : '日常';
              applyCharacterActionSegment_ACU(c, segmentAction, segmentDelta, trainedBonus, charName);
              segmentTickCursor = nextBoundaryTick;
            }
          } else {
            applyCharacterActionSegment_ACU(c, normalizedDeclaredAction, delta, trainedBonus, charName);
          }
          const afterCoreCount = Math.max(0, Math.floor(Number(c.魂核?.核心?.数量 || 0)));
          if (afterCoreCount > beforeCoreCount) {
            if (data.sys.系统播报 === '初始化' || !data.sys.系统播报) data.sys.系统播报 = '';
            data.sys.系统播报 += ` [境界突破] ${c.属性.年龄}岁的 ${charName || '角色'} 在冥想中成功凝聚第 ${afterCoreCount} 魂核！修为上限解锁！`;
          }
          syncRoundedDisplaySoulPower_ACU(c);
        }
      });
      autoBreakthrough(data);
      refreshQuestBoardFrames(data, currentTick);
      data.world.时间._上次结算tick = currentTick;
    } else {
      autoBreakthrough(data);
    }
    if (是否角色初始化补齐阶段) 初始化补齐角色技能效果数组_V1(data);

    _(data.char).forEach((c, charName) => {
      const trainedBonus = ensureNumericStatBonusMap(c.属性, '训练加成');
      应用图鉴被动到角色(c, charName);
      const previousResourceSnapshot = resourceStateBeforeRecalc.get(charName) || {
        魂力: Math.max(0, Number(c.属性?.魂力 || 0)),
        魂力上限: Math.max(1, Number(c.属性?.魂力上限 || 1)),
        精神力: Math.max(0, Number(c.属性?.精神力 || 0)),
        精神力上限: Math.max(1, Number(c.属性?.精神力上限 || 1)),
        体力: Math.max(0, Number(c.属性?.体力 || 0)),
        体力上限: Math.max(1, Number(c.属性?.体力上限 || 1)),
        HP: Math.max(0, Number(c.属性?.HP || 0)),
        HP上限: Math.max(1, Number(c.属性?.HP上限 || c.属性?.体力上限 || 1)),
      };
      const previousResourceRatios = {
        魂力: previousResourceSnapshot.魂力 / previousResourceSnapshot.魂力上限,
        精神力: previousResourceSnapshot.精神力 / previousResourceSnapshot.精神力上限,
        体力: previousResourceSnapshot.体力 / previousResourceSnapshot.体力上限,
        HP: previousResourceSnapshot.HP / previousResourceSnapshot.HP上限,
      };
      const isDefaultSeededResourceState =
        previousResourceSnapshot.魂力上限 <= 10 &&
        previousResourceSnapshot.精神力上限 <= 10 &&
        previousResourceSnapshot.体力上限 <= 10 &&
        previousResourceSnapshot.HP上限 <= 10 &&
        previousResourceRatios.魂力 >= 0.95 &&
        previousResourceRatios.精神力 >= 0.95 &&
        previousResourceRatios.体力 >= 0.95 &&
        previousResourceRatios.HP >= 0.95;
      const resourceRatioValues = Object.values(previousResourceRatios).filter(Number.isFinite);
      const ratioSpread = resourceRatioValues.length
        ? Math.max(...resourceRatioValues) - Math.min(...resourceRatioValues)
        : 1;
      const isKnownBuggedRecoveryRatio = [0.05, 0.3, 0.7].some(value =>
        Math.abs(previousResourceRatios.HP - value) <= 0.001,
      );
      const actionText = String(c.状态?.行动 || '').trim();
      const hasInjuryMarkers = Object.keys(c.状态?.受伤部位 || {}).length > 0;
      const looksLikePlaceholderExhaustedPack =
        previousResourceSnapshot.魂力 <= 10 &&
        previousResourceSnapshot.精神力 <= 10 &&
        previousResourceSnapshot.魂力上限 >= 1000 &&
        previousResourceSnapshot.精神力上限 >= 1000 &&
        previousResourceSnapshot.体力上限 >= 1000 &&
        previousResourceSnapshot.HP上限 >= 1000 &&
        previousResourceSnapshot.体力 <= 20 &&
        previousResourceSnapshot.HP <= 20 &&
        Math.abs(previousResourceSnapshot.体力 - previousResourceSnapshot.HP) <= 2 &&
        !data.world?.战斗?.进行中 &&
        actionText === '日常' &&
        !hasInjuryMarkers;
      const looksLikeNewCharacterDefaultLeak =
        previousResourceSnapshot.魂力 <= 10 &&
        previousResourceSnapshot.精神力 <= 10 &&
        previousResourceSnapshot.魂力上限 >= 100 &&
        previousResourceSnapshot.精神力上限 >= 20 &&
        previousResourceRatios.体力 >= 0.9 &&
        previousResourceRatios.HP >= 0.9 &&
        !data.world?.战斗?.进行中 &&
        actionText === '日常' &&
        !hasInjuryMarkers;
      const shouldResetBuggedInitializedResources =
        Math.abs(previousResourceSnapshot.HP上限 - previousResourceSnapshot.体力上限) > 1 &&
        !data.world?.战斗?.进行中 &&
        actionText !== '战斗' &&
        !hasInjuryMarkers &&
        resourceRatioValues.length === 4 &&
        ratioSpread <= 0.0015 &&
        isKnownBuggedRecoveryRatio;
      if (c.私密档案) {
        const age = Number(c.属性?.年龄 || 0);

    
        if (!c.私密档案._已来初潮) {
          if (age >= 10 && currentTick % 144 === 0) { 
            let menarcheChance = 0;
            if (age === 11) menarcheChance = 0.05;      
            else if (age === 12) menarcheChance = 0.30; 
            else if (age === 13) menarcheChance = 0.60;
            else if (age >= 14) menarcheChance = 0.95;

            if (Math.random() < menarcheChance) { 
              c.私密档案._已来初潮 = true;
              c.私密档案.生理期偏移 = 4032 - (currentTick % 4032); 
              
              if (currentTick > 0 && data.sys.系统播报 !== '初始化') {
                if (!data.sys.系统播报) data.sys.系统播报 = '';
                data.sys.系统播报 += ` [生理变化] ${charName} 迎来了初潮，正式进入青春期！`;
              }
            } else {
              c.私密档案._生理阶段 = '未初潮(青春期前)';
            }
          } else if (age < 10) {
            c.私密档案._生理阶段 = '未初潮(幼年)';
          }
        }

        if (c.私密档案._已来初潮) {
          if (c.私密档案.受孕tick > 0) {
            const pregDays = Math.floor((currentTick - c.私密档案.受孕tick) / 144);
            c.私密档案._怀孕天数 = pregDays;
            c.私密档案._生理阶段 = '孕期停经'; 

            if (pregDays >= 270 && currentTick % 144 === 0) {
              const birthChance = (pregDays - 270) / 30; 
              
              if (Math.random() < birthChance || pregDays >= 300) {
                if (data.sys.系统播报 === '初始化' || !data.sys.系统播报) data.sys.系统播报 = '';
                data.sys.系统播报 += ` [生命降生] ${charName} 经过 ${pregDays} 天的孕育，成功分娩！`;
                c.私密档案.受孕tick = -1;
                c.私密档案.受孕对象 = '无';
                c.私密档案._怀孕天数 = 0;
              }
            }
          } else {
            c.私密档案._怀孕天数 = 0;
            const cycleTick = (currentTick + c.私密档案.生理期偏移) % 4032;
            const cycleDays = cycleTick / 144;
            
            if (cycleDays <= 5) {
              c.私密档案._生理阶段 = '生理期(极度敏感/易疲劳)';
            } else if (cycleDays > 11 && cycleDays <= 16) {
              c.私密档案._生理阶段 = '排卵期(渴望繁衍/受孕率极高)';
            } else {
              c.私密档案._生理阶段 = '安全期'; 
            }
          }
        }
      }
      if (c.状态.吸收灵物年限 > 0) {
        let age = c.状态.吸收灵物年限;
        const spiritHerbGain = getSpiritHerbSoulPowerGain_ACU(age);
        if (c.属性.等级惩罚 > 0 && age >= 10000) {
          let recoverAmount = age >= 100000 ? 3 : 1;
          c.属性.等级惩罚 = Math.max(0, c.属性.等级惩罚 - recoverAmount);
          if (getComputedWoundLevelFromStat(c.属性) === '濒死') {
            c.属性.HP = Math.max(Math.ceil(c.属性.HP上限 * 0.1), Number(c.属性.HP || 0));
          }
          let 灵物播报文本 = `[本源修复] ${charName} 吸收高阶灵物，庞大的生机修补了受损的根基！恢复了 ${recoverAmount} 级等级上限。`;
          const extraHerbMessages = applyHundredThousandSpiritHerbBonus_ACU(c);
          if (extraHerbMessages.length) {
            灵物播报文本 += ` 同时${extraHerbMessages.join('，')}。`;
          }
          追加系统播报文本(data, 灵物播报文本);
        } else {
          if (c.属性.等级 - c.属性.上次灵物等级 >= 20) {
            c.属性.永久魂力加成 = Math.floor(Number(c.属性.永久魂力加成 || 0) + spiritHerbGain);
            c.属性.魂力上限 = Math.floor(Number(c.属性.魂力上限 || 0) + spiritHerbGain);
            c.属性.突破魂力上限 = Math.floor(Number(c.属性.突破魂力上限 || 0) + spiritHerbGain);
            c.属性.上次灵物等级 = c.属性.等级;
            let 灵物播报文本 = `[灵物吸收] ${charName} 成功吸收 ${age} 年灵物，魂力成长槽提升 ${spiritHerbGain} 点！`;
            const extraHerbMessages = applyHundredThousandSpiritHerbBonus_ACU(c);
            if (extraHerbMessages.length) {
              灵物播报文本 += ` 同时${extraHerbMessages.join('，')}。`;
            }
            追加系统播报文本(data, 灵物播报文本);
          } else {
            c.属性.等级惩罚 += 1;
            c.属性.状态效果['灵物反噬'] = {
              类型: 'debuff',
              层数: 1,
              描述: '短时间内强行吸收灵物，经脉受损，永久扣除1级等级上限',
            };
            追加系统播报文本(data, `[灵物反噬] ${charName} 违规连续吸收灵物！经脉受损，永久扣除 1 级等级上限！`);
          }
        }
        c.状态.吸收灵物年限 = 0;
      }

      const hadLifeFireActive = LIFE_FIRE_STATE_CACHE[charName] === true;
      if (hadLifeFireActive && c.血脉之力?.生命之火 === false) {
        追加系统播报文本(data, `[生命之火熄灭] ${charName} 透支本源，修为暴跌 3 级，陷入濒死！`);
        c.属性.等级 = Math.max(1, c.属性.等级 - 3);
        c.属性.等级惩罚 += 3;
        c.属性.HP = Math.max(1, Math.floor(c.属性.HP上限 * 0.03));
        c.属性.体力 = 1;
      }

      LIFE_FIRE_STATE_CACHE[charName] = c.血脉之力?.生命之火 === true;

      const hasSeenAliveState = Object.prototype.hasOwnProperty.call(COMBAT_DEATH_STATE_CACHE, charName);
      const isAliveNow = c.状态?.存活 !== false;
      const wasAlive = hasSeenAliveState ? COMBAT_DEATH_STATE_CACHE[charName] !== false : isAliveNow;
      if (hasSeenAliveState && wasAlive && !isAliveNow) {
        const winnerName = getBattleRewardRecipientName(data, charName);
        const winner = winnerName ? data?.char?.[winnerName] : null;
        const speciesFlags = getCombatSpeciesFlags(c);
        if (winner && typeof winner === 'object') {
          if (speciesFlags.isAbyss) {
            settleInternalAbyssKillReward(data, winner, winnerName, c, charName);
          } else if (speciesFlags.isBeast) {
            settleInternalSoulBeastReward(data, winner, winnerName, c, charName);
          }
        }
      }
      COMBAT_DEATH_STATE_CACHE[charName] = isAliveNow;

      let vitMult = 1.0,
        strMult = 1.0,
        allMult = 1.0,
        menMult = 1.0;
      if (c.血脉之力?.core !== '未凝聚') {
        vitMult = Math.max(vitMult, 1.5);
        strMult = Math.max(strMult, 1.5);
      }
      if (c.血脉之力?.生命之火 === true) {
        allMult = 2.0;
      }

      let hasDragon = false;
      _(c.武魂).forEach(sp => {
        if (/龙/.test(sp.表象名称)) hasDragon = true;
      });
      if (hasDragon) vitMult = Math.max(vitMult, 1.5);

      let eb = {
        sp:
          (c.装备?.武器?.属性加成?.魂力上限 || 0) +
          (c.装备?.斗铠?._属性加成?.魂力上限 || 0) +
          (c.装备?.机甲?._属性加成?.魂力上限 || 0),
        men:
          (c.装备?.武器?.属性加成?.精神力上限 || 0) +
          (c.装备?.斗铠?._属性加成?.精神力上限 || 0) +
          (c.装备?.机甲?._属性加成?.精神力上限 || 0),
        str:
          (c.装备?.武器?.属性加成?.力量 || 0) +
          (c.装备?.斗铠?._属性加成?.力量 || 0) +
          (c.装备?.机甲?._属性加成?.力量 || 0),
        def:
          (c.装备?.武器?.属性加成?.防御 || 0) +
          (c.装备?.斗铠?._属性加成?.防御 || 0) +
          (c.装备?.机甲?._属性加成?.防御 || 0),
        agi:
          (c.装备?.武器?.属性加成?.敏捷 || 0) +
          (c.装备?.斗铠?._属性加成?.敏捷 || 0) +
          (c.装备?.机甲?._属性加成?.敏捷 || 0),
        vit:
          (c.装备?.武器?.属性加成?.体力上限 || 0) +
          (c.装备?.斗铠?._属性加成?.体力上限 || 0) +
          (c.装备?.机甲?._属性加成?.体力上限 || 0),
      };
      if (allMult > 1.0) {
        c.属性.魂力上限 = Math.floor((c.属性.魂力上限 - eb.sp) * allMult) + eb.sp;
        c.属性.精神力上限 = Math.floor((c.属性.精神力上限 - eb.men) * allMult) + eb.men;
        c.属性.力量 = Math.floor((c.属性.力量 - eb.str) * allMult) + eb.str;
        c.属性.防御 = Math.floor((c.属性.防御 - eb.def) * allMult) + eb.def;
        c.属性.敏捷 = Math.floor((c.属性.敏捷 - eb.agi) * allMult) + eb.agi;
        c.属性.体力上限 = Math.floor((c.属性.体力上限 - eb.vit) * allMult) + eb.vit;
      }

      if (vitMult > 1.0)
        c.属性.体力上限 = Math.max(c.属性.体力上限, Math.floor((c.属性.体力上限 - eb.vit) * vitMult) + eb.vit);
      if (strMult > 1.0) c.属性.力量 = Math.max(c.属性.力量, Math.floor((c.属性.力量 - eb.str) * strMult) + eb.str);
      if (menMult > 1.0)
        c.属性.精神力上限 = Math.max(c.属性.精神力上限, Math.floor((c.属性.精神力上限 - eb.men) * menMult) + eb.men);

      if (c.状态.当前领域 && c.状态.当前领域.includes('斗铠领域')) {
        let ratio = c.状态.当前领域.includes('四字') ? 1.2 : 1.1;
        let attrs = ['魂力上限', '精神力上限', '力量', '防御', '敏捷', '体力上限'];

        if (c.状态.当前领域.includes('未定')) {
          if (ratio === 1.2) {
            let a1 = attrs.splice(Math.floor(Math.random() * attrs.length), 1)[0];
            let a2 = attrs.splice(Math.floor(Math.random() * attrs.length), 1)[0];
            c.状态.当前领域 = `【四字斗铠领域】全开[${a1},${a2}]`;
          } else {
            let a1 = attrs[Math.floor(Math.random() * attrs.length)];
            c.状态.当前领域 = `【三字斗铠领域】全开[${a1}]`;
          }
        }

        ['魂力上限', '精神力上限', '力量', '防御', '敏捷', '体力上限'].forEach(attr => {
          if (c.状态.当前领域.includes(attr)) {
            c.属性[attr] = Math.floor(c.属性[attr] * ratio);
          }
        });
      }

      let buffMods = { str: 0, def: 0, agi: 0, sp_max: 0 };
      _(c.属性.状态效果).forEach(cond => {
        if (cond.stat_mods) {
          if (cond.stat_mods.str !== 1.0) buffMods.str += cond.stat_mods.str - 1.0;
          if (cond.stat_mods.def !== 1.0) buffMods.def += cond.stat_mods.def - 1.0;
          if (cond.stat_mods.agi !== 1.0) buffMods.agi += cond.stat_mods.agi - 1.0;
          if (cond.stat_mods.sp_max !== 1.0) buffMods.sp_max += cond.stat_mods.sp_max - 1.0;
        }
      });
      if (buffMods.str !== 0) c.属性.力量 = Math.floor(c.属性.力量 * Math.max(0.1, 1.0 + buffMods.str));
      if (buffMods.def !== 0) c.属性.防御 = Math.floor(c.属性.防御 * Math.max(0.1, 1.0 + buffMods.def));
      if (buffMods.agi !== 0) c.属性.敏捷 = Math.floor(c.属性.敏捷 * Math.max(0.1, 1.0 + buffMods.agi));
      if (buffMods.sp_max !== 0) c.属性.魂力上限 = Math.floor(c.属性.魂力上限 * Math.max(0.1, 1.0 + buffMods.sp_max));

      let finalMen =
        c.属性.精神力上限 -
        (c.装备?.武器?.属性加成?.精神力上限 || 0) -
        (c.装备?.斗铠?._属性加成?.精神力上限 || 0) -
        (c.装备?.机甲?._属性加成?.精神力上限 || 0);
      if (finalMen >= 50000) c.属性.精神境界 = '神元境';
      else if (finalMen >= 20000) c.属性.精神境界 = '灵域境';
      else if (finalMen >= 3000) c.属性.精神境界 = '灵渊境';
      else if (finalMen >= 500) c.属性.精神境界 = '灵海境';
      else if (finalMen >= 50) c.属性.精神境界 = '灵通境';
      else c.属性.精神境界 = '灵元境';

      if (finalMen < 25000 && c.精神领域?.进行中) {
        c.精神领域.进行中 = false;
        if (c.状态.当前领域 && c.状态.当前领域.includes('精神领域')) {
          c.状态.当前领域 = c.状态.当前领域.replace(/精神领域/g, '').trim();
        }
      }

      c.属性.HP上限 = Math.max(1, Number(c.属性.体力上限 || c.属性.HP上限 || 1));
      const resolvePreservedRatio = key => {
        if (
          isDefaultSeededResourceState ||
          shouldResetBuggedInitializedResources ||
          looksLikePlaceholderExhaustedPack ||
          looksLikeNewCharacterDefaultLeak
        )
          return 1.0;
        return Math.max(0, Math.min(1, Number(previousResourceRatios[key] || 0)));
      };
      c.属性.魂力 = Math.max(0, Math.min(c.属性.魂力上限, Math.floor(c.属性.魂力上限 * resolvePreservedRatio('魂力'))));
      c.属性.精神力 = Math.max(0, Math.min(c.属性.精神力上限, Math.floor(c.属性.精神力上限 * resolvePreservedRatio('精神力'))));
      c.属性.体力 = Math.max(0, Math.min(c.属性.体力上限, Math.floor(c.属性.体力上限 * resolvePreservedRatio('体力'))));
      c.属性.HP = Math.max(0, Math.min(c.属性.HP上限, Math.floor(c.属性.HP上限 * resolvePreservedRatio('HP'))));
      const fatiguePenaltyMult = getComputedFatiguePenaltyMultiplierFromStat(c.属性);
      c.属性.力量 = Math.max(1, Math.floor(c.属性.力量 * fatiguePenaltyMult));
      c.属性.防御 = Math.max(1, Math.floor(c.属性.防御 * fatiguePenaltyMult));
      c.属性.敏捷 = Math.max(1, Math.floor(c.属性.敏捷 * fatiguePenaltyMult));
    });

    _(data.char).forEach((c, charName) => {
      if (!c || typeof c !== 'object' || !c.状态 || typeof c.状态 !== 'object') return;
      const 当前地点 = String(c.状态.位置 || '').trim();
      if (!当前地点) return;
      const 上次地点 = String(c.状态._情报上次地点 || '').trim();
      if (上次地点 && 上次地点 !== 当前地点) {
        推入机密情报触发('地点', [上次地点, 当前地点, charName]);
      }
      c.状态._情报上次地点 = 当前地点;
    });

    if (!data.world.战斗 || typeof data.world.战斗 !== 'object') data.world.战斗 = {};
    const 当前战斗裁断结果 = String(data.world.战斗.裁断结果 || '').trim();
    const 上次战斗裁断结果 = String(data.world.战斗._情报上次裁断结果 || '').trim();
    if (当前战斗裁断结果 && 当前战斗裁断结果 !== 上次战斗裁断结果) {
      推入机密情报触发('战斗', [当前战斗裁断结果, String(data.world.战斗.战斗类型 || '').trim()]);
    }
    data.world.战斗._情报上次裁断结果 = 当前战斗裁断结果;

    _(data.char).forEach(c => {
      _(c?.记录 || {}).forEach(任务条目 => {
        补全任务条目字段(任务条目, currentTick);
      });
    });

    _(data.char).forEach((c, charName) => {
      const trainedBonus = ensureNumericStatBonusMap(c.属性, '训练加成');
      if (c.互动请求 && c.互动请求.动作 !== '无') {
        let req = c.互动请求;
        let targetName = req.目标人物;
        let targetNPC = data.char[targetName];
        if (!targetNPC) {
          const resolvedTargetEntry = Object.entries(data.char || {}).find(([charKey, charInfo]) => {
            const displayName = String(charInfo?.name || charInfo?.base?.name || charKey || '').trim();
            return displayName && displayName === String(targetName || '').trim();
          });
          if (resolvedTargetEntry) targetNPC = resolvedTargetEntry[1];
        }
        let msg = '';

        if (!targetNPC) {
          msg = `[互动失败] 找不到目标角色【${targetName}】。`;
        } else {
          if (!c.社交.关系[targetName]) {
            c.社交.关系[targetName] = 构建默认社交关系数据();
          }
          let rel = c.社交.关系[targetName];
          规范武魂相关度基础字段(rel);
          let score = req.结果评分;
          const currentTick = Number(data.world?.时间?.tick || 0);

          if (req.动作 === '送礼') {
            if (req.使用物品 !== '无' && c.背包[req.使用物品] && c.背包[req.使用物品].数量 > 0) {
              c.背包[req.使用物品].数量 -= 1;
              if (c.背包[req.使用物品].数量 <= 0) delete c.背包[req.使用物品];

              score = Math.floor(score * 1.5) + 5;
              msg = `[社交互动] ${charName} 向 ${targetName} 赠送了【${req.使用物品}】。`;
            } else {
              msg = `[互动失败] 背包中没有足够的【${req.使用物品}】用来送礼！`;
              score = 0;
            }
          } else if (req.动作 === '请教') {
            if (rel.好感度 >= 30 && score > 0) {
              addNumericStatBonusEntries(trainedBonus, { 力量: score, 精神力上限: score });
              msg = `[社交互动] ${charName} 向 ${targetName} 请教修炼心得，受益匪浅！`;
            } else {
              msg = `[社交互动] ${charName} 试图请教 ${targetName}，但对方似乎不太愿意倾囊相授。(好感度需>=30)`;
              score = 0;
            }
          } else {
            msg = `[社交互动] ${charName} 与 ${targetName} 进行了【${req.动作}】。`;
          }

          if (score !== 0) {
            rel.好感度 += score;
            msg += ` 好感度变化：${score > 0 ? '+' : ''}${score} (当前: ${rel.好感度})。`;
          }

          if (req.动作 === '表白' && score > 0) {
            const currentRoute = String(rel.关系路线 || '朋友线');
            const targetRel =
              targetNPC.社交 && targetNPC.社交.关系 && targetNPC.社交.关系[charName]
                ? targetNPC.社交.关系[charName]
                : null;
            const targetCurrentRoute = String(targetRel?.关系路线 || '朋友线');
            const favorAfterConfess = Number(rel.好感度 || 0);
            const shouldAutoPromoteLoveRoute = currentRoute !== '恋人线' && favorAfterConfess >= 60;

            if (currentRoute === '恋人线' || targetCurrentRoute === '恋人线') {
              rel.关系路线 = '恋人线';
              if (targetRel) targetRel.关系路线 = '恋人线';
            } else if (shouldAutoPromoteLoveRoute) {
              rel.关系路线 = '恋人线';
              msg += ` 关系路线切入【恋人线】。`;
              if (targetRel) {
                targetRel.关系路线 = '恋人线';
              }
            }
          }

          rel.上次互动tick = currentTick;
          rel.上次互动动作 = req.动作;
          rel.最近好感变化 = score;
          if (!rel.对方身份 || rel.对方身份 === '无') {
            const targetIdentity = targetNPC.社交?.主身份;
            rel.对方身份 = !isAiTodoText(targetIdentity) && targetIdentity ? targetIdentity : '无';
          }

          if (!targetNPC.社交.关系[charName]) {
            targetNPC.社交.关系[charName] = 构建默认社交关系数据();
          }
          const 对侧关系 = targetNPC.社交.关系[charName];
          规范武魂相关度基础字段(对侧关系);
          targetNPC.社交.关系[charName].好感度 = rel.好感度;
          targetNPC.社交.关系[charName].关系路线 =
            rel.关系路线 || targetNPC.社交.关系[charName].关系路线 || '朋友线';
          targetNPC.社交.关系[charName].上次互动tick = currentTick;
          targetNPC.社交.关系[charName].上次互动动作 = req.动作;
          targetNPC.社交.关系[charName].最近好感变化 = score;
          if (!targetNPC.社交.关系[charName].对方身份 || targetNPC.社交.关系[charName].对方身份 === '无') {
            const sourceIdentity = c.社交?.主身份;
            targetNPC.社交.关系[charName].对方身份 =
              !isAiTodoText(sourceIdentity) && sourceIdentity ? sourceIdentity : '无';
          }
          规范武魂相关度基础字段(rel);
          规范武魂相关度基础字段(targetNPC.社交.关系[charName]);
        }

        推入机密情报触发('交互', [charName, targetName, req.动作, msg]);
        if (msg) 追加系统播报文本(data, msg);
        c.互动请求 = { 目标人物: '无', 动作: '无', 使用物品: '无', 结果评分: 0 };
      }
    });

    _(data.char).forEach((c, charName) => {
      if (c.任务请求 && c.任务请求.动作 !== '无') {
        let req = c.任务请求;
        let qName = String(req.任务名称 || '').trim();
        let msg = '';
        if (!qName || qName === '无') qName = '未命名任务';
        if (!c.记录 || typeof c.记录 !== 'object') c.记录 = {};
        if (!data.world.委托板 || typeof data.world.委托板 !== 'object') data.world.委托板 = {};
        let boardEntry = data.world.委托板[qName];

        if (req.动作 === '接取') {
          c.记录[qName] = {
            类型: (boardEntry && boardEntry.类型) || '悬赏任务',
            状态: '阶段推进',
            当前进度: 0,
            目标进度: Math.max(1, Number(req.目标进度 || 1)),
            奖励币: Math.max(0, Number(req.奖励币 || 0)),
            奖励声望: Math.max(0, Number(req.奖励声望 || 0)),
            描述: req.任务描述,
            阶段: 1,
            分支: '未判定',
            失败计数: 0,
            里程碑: ['任务接取'],
            最后更新时间tick: currentTick,
            情报贡献值: 0,
            图鉴贡献值: 0,
            风险级别: '中风险',
            推荐路线: '主线',
            最近爆发tick: 0,
          };
          if (boardEntry && typeof boardEntry === 'object') {
            boardEntry.状态 = '阶段推进';
            boardEntry.承接者 = charName;
          }
          msg = `[任务接取] ${charName} 接取了悬赏：【${qName}】。目标：${req.任务描述}。`;
        } else if (req.动作 === '更新进度' && c.记录[qName]) {
          let q = c.记录[qName];
          q = 补全任务条目字段(q, currentTick) || q;
          if (!['已完成', '已放弃'].includes(String(q.状态 || '').trim())) {
            const 原阶段 = Math.max(1, Number(q.阶段 || 1));
            const 联动评分 = 计算任务联动评分(q);
            const 原始进度增量 = Math.max(0, Number(req.进度增量 || 0));
            const 联动后进度增量 = 原始进度增量 > 0
              ? Math.max(1, Math.round(原始进度增量 * Math.max(1, Number(联动评分.任务推进系数 || 1))))
              : 0;
            q.情报贡献值 = Number(联动评分.情报贡献值 || 0);
            q.图鉴贡献值 = Number(联动评分.图鉴贡献值 || 0);
            q.风险级别 = String(联动评分.风险级别 || '中风险').trim() || '中风险';
            q.推荐路线 = String(联动评分.推荐路线 || '主线').trim() || '主线';
            q.当前进度 = Math.max(0, Number(q.当前进度 || 0) + 联动后进度增量);
            q.阶段 = 计算任务阶段号(q);
            q.状态 = '阶段推进';
            q.最后更新时间tick = currentTick;
            msg = `[任务进度] 【${qName}】阶段 ${q.阶段} 进度更新：${q.当前进度}/${q.目标进度}。`;
            if (q.阶段 > 原阶段 && 记录任务里程碑(q, `阶段${q.阶段}达成`)) {
              const 里程碑奖励币 = Math.max(1, Math.floor(Number(q.奖励币 || 0) * 0.08));
              const 里程碑奖励声望 = Math.max(1, Math.floor(Number(q.奖励声望 || 0) * 0.12));
              c.财富.联邦币 = Math.max(0, Number(c.财富.联邦币 || 0) + 里程碑奖励币);
              c.社交.声望 = Math.max(0, Number(c.社交.声望 || 0) + 里程碑奖励声望);
              q.最近爆发tick = currentTick;
              msg += ` [节点爆发][任务] 阶段里程碑达成，额外获得 ${里程碑奖励币} 联邦币 / ${里程碑奖励声望} 声望。`;
            }
            if (q.当前进度 >= q.目标进度) {
              q.状态 = '分支判定';
              const 失败计数 = Math.max(0, Number(q.失败计数 || 0));
              if (失败计数 >= 2 || q.风险级别 === '高风险') q.分支 = '稳妥线';
              else if (q.推荐路线 === '高收益线') q.分支 = '高收益线';
              else if (q.推荐路线 === '稳妥线') q.分支 = '稳妥线';
              else q.分支 = '主线';
              记录任务里程碑(q, `分支:${q.分支}`);
              q.状态 = '可提交';
              q.最近爆发tick = currentTick;
              if (boardEntry && typeof boardEntry === 'object') boardEntry.状态 = '可提交';
              msg += ` [节点爆发][任务] 已进入${q.分支}(风险:${q.风险级别})，可前往提交。`;
            } else if (boardEntry && typeof boardEntry === 'object') {
              boardEntry.状态 = '阶段推进';
            }
          }
        } else if (req.动作 === '提交' && c.记录[qName]) {
          let q = c.记录[qName];
          q = 补全任务条目字段(q, currentTick) || q;
          if (!['高收益线', '主线', '稳妥线'].includes(String(q.分支 || '').trim())) q.分支 = '主线';
          if (q.状态 === '可提交' || Number(q.当前进度 || 0) >= Number(q.目标进度 || 1)) {
            q.状态 = '已完成';
            let 实得奖励币 = Math.max(0, Number(q.奖励币 || 0));
            let 实得奖励声望 = Math.max(0, Number(q.奖励声望 || 0));
            if (q.分支 === '高收益线') {
              实得奖励币 = Math.max(0, Math.floor(实得奖励币 * 1.45));
              实得奖励声望 = Math.max(0, Math.floor(实得奖励声望 * 1.3));
            } else if (q.分支 === '稳妥线') {
              实得奖励币 = Math.max(0, Math.floor(实得奖励币 * 0.85));
              实得奖励声望 = Math.max(0, Math.floor(实得奖励声望 * 1.12));
            }
            c.财富.联邦币 = Math.max(0, Number(c.财富.联邦币 || 0) + 实得奖励币);
            c.社交.声望 = Math.max(0, Number(c.社交.声望 || 0) + 实得奖励声望);
            记录任务里程碑(q, '任务结算');
            q.最后更新时间tick = currentTick;
            q.最近爆发tick = currentTick;
            if (boardEntry && typeof boardEntry === 'object') {
              boardEntry.状态 = '已完成';
              boardEntry.承接者 = charName;
            }
            msg = `[任务完成] ${charName} 提交了【${qName}】！获得奖励：${实得奖励币} 联邦币, ${实得奖励声望} 声望！ [节点爆发][任务] 路线:${q.分支}`;
          } else {
            q.失败计数 = Math.max(0, Number(q.失败计数 || 0) + 1);
            const 回退比例 = q.分支 === '高收益线' ? 0.35 : q.分支 === '稳妥线' ? 0.2 : 0.28;
            const 回退量 = Math.max(1, Math.floor(获取任务阶段跨度(q) * 回退比例));
            q.当前进度 = Math.max(0, Number(q.当前进度 || 0) - 回退量);
            q.阶段 = 计算任务阶段号(q);
            q.状态 = '阶段推进';
            q.最后更新时间tick = currentTick;
            const 失败代价比例 = q.分支 === '高收益线' ? 0.12 : q.分支 === '稳妥线' ? 0.04 : 0.07;
            const 失败代价币 = Math.max(0, Math.floor(Number(q.奖励币 || 0) * 失败代价比例));
            const 失败代价声望 = q.分支 === '高收益线' ? 2 : 1;
            c.财富.联邦币 = Math.max(0, Number(c.财富.联邦币 || 0) - 失败代价币);
            c.社交.声望 = Math.max(0, Number(c.社交.声望 || 0) - 失败代价声望);
            if (boardEntry && typeof boardEntry === 'object') boardEntry.状态 = '阶段推进';
            q.最近爆发tick = currentTick;
            msg = `[任务提交失败] 【${qName}】进度未达标 (${q.当前进度}/${q.目标进度})，回退 ${回退量} 进度并扣除 ${失败代价币} 联邦币/${失败代价声望} 声望。 [节点爆发][任务] 路线:${q.分支}`;
          }
        } else if (req.动作 === '放弃' && c.记录[qName]) {
          const q = 补全任务条目字段(c.记录[qName], currentTick) || c.记录[qName];
          q.状态 = '已放弃';
          q.最后更新时间tick = currentTick;
          if (boardEntry && typeof boardEntry === 'object') {
            boardEntry.状态 = '待接取';
            boardEntry.承接者 = '无';
          }
          msg = `[任务放弃] ${charName} 放弃了悬赏：【${qName}】。`;
        }

        推入机密情报触发('任务', [charName, qName, req.动作, msg]);
        if (msg) 追加系统播报文本(data, msg);
        c.任务请求 = {
          动作: '无',
          任务名称: '无',
          任务描述: '无',
          进度增量: 0,
          目标进度: 1,
          奖励币: 0,
          奖励声望: 0,
        };
      }
    });
    消费交易触发标记并推入情报();
    推进机密情报核实流程();

    _(data.char).forEach((c, charName) => {
      if (c.晋升请求 && c.晋升请求.目标势力 !== '无') {
        let req = c.晋升请求;
        let fac = req.目标势力;
        let title = req.目标职位;
        let lv = c.属性.等级;
        let armorLv = c.装备.斗铠.等级;
        let mechLvStr = c.装备.机甲.等级;
        let mechLv = mechLvStr === '紫级' ? 2 : mechLvStr === '黑级' ? 3 : mechLvStr === '红级' ? 4 : 0;
        let age = c.属性.年龄;
        let realm = c.属性.精神境界 || c.属性.精神力_realm;

        let pts = c.财富.唐门积分 || 0;
        if (fac === '史莱克学院') pts = c.财富.学院积分 || 0;
        if (fac === '战神殿' || fac === '血神军团' || fac === '联邦军方') pts = c.财富.战功 || 0;

        let success = false;
        let cost = 0;
        let msg = `[晋升驳回] ${charName} 申请晋升【${fac} - ${title}】失败！硬性条件未达标。`;

        if (fac === '唐门') {
          if (title === '外门' && lv >= 30 && pts >= 1000) {
            success = true;
            cost = 1000;
          } else if (title === '黄级' && lv >= 50 && armorLv >= 1 && pts >= 5000) {
            success = true;
            cost = 5000;
          } else if (title === '紫级' && lv >= 70 && armorLv >= 2 && pts >= 20000) {
            success = true;
            cost = 20000;
          } else if (title === '黑级' && lv >= 80 && armorLv >= 3 && pts >= 50000) {
            success = true;
            cost = 50000;
          } else if (title === '红级' && lv >= 90 && armorLv >= 3 && pts >= 100000) {
            success = true;
            cost = 100000;
          } else if (title === '长老' && lv >= 95 && armorLv >= 3 && pts >= 300000) {
            success = true;
            cost = 300000;
          } else if ((title === '副殿主' || title === '殿主') && lv >= 99 && armorLv >= 4) {
            success = true;
            cost = 0;
          }
        } else if (fac === '史莱克学院') {
          if (title === '外院毕业生' && lv >= 50 && armorLv >= 1 && c.属性.年龄 <= 35) {
            success = true;
            cost = 0;
          } else if (title === '内院弟子') {
            if (
              c.属性.年龄 <= 20 &&
              armorLv >= 1 &&
              lv >= 50 &&
              ['灵海境', '灵渊境', '灵域境', '神元境'].includes(c.属性.精神境界 || c.属性.精神力_realm)
            ) {
              success = true;
              cost = 0;
            } else if (c.属性.年龄 > 20 && c.属性.年龄 <= 30 && armorLv >= 2) {
              success = true;
              cost = 0;
            }
          } else if (title === '外院老师' && lv >= 70 && armorLv >= 2) {
            success = true;
            cost = 0;
          } else if (title === '内院老师' && lv >= 90 && armorLv >= 3) {
            success = true;
            cost = 0;
          } else if (title === '宿老' && lv >= 95 && armorLv >= 3) {
            success = true;
            cost = 0;
          } else if (title === '阁主' && lv >= 99 && armorLv >= 4) {
            success = true;
            cost = 0;
          } else if (title === '七怪' && lv >= 60 && armorLv >= 2 && age <= 25) {
            success = true;
            cost = 0;
          }
        } else if (fac === '战神殿') {
          if (title === '入殿' && age >= 18) {
            success = true;
            cost = 0;
          } else if (title === '预备战神' && lv >= 80 && armorLv >= 2 && pts >= 50000) {
            success = true;
            cost = 50000;
          } else if (title === '正选战神' && lv >= 90 && armorLv >= 3) {
            success = true;
            cost = 0;
          } else if ((title === '副殿主' || title === '殿主') && lv >= 99.5 && armorLv >= 4) {
            success = true;
            cost = 0;
          }
        } else if (fac === '传灵塔') {
          if (title === '传灵师' && lv >= 30 && ['灵通境', '灵海境', '灵渊境', '灵域境', '神元境'].includes(realm)) {
            success = true;
            cost = 0;
          } else if (title === '长老' && lv >= 80 && armorLv >= 3 && ['灵渊境', '灵域境', '神元境'].includes(realm)) {
            success = true;
            cost = 0;
          } else if (title === '分塔主' && lv >= 90 && armorLv >= 3 && ['灵域境', '神元境'].includes(realm)) {
            success = true;
            cost = 0;
          } else if (title === '传灵使' && lv >= 95 && armorLv >= 3) {
            success = true;
            cost = 0;
          } else if (title === '副塔主' && lv >= 99 && armorLv >= 4) {
            success = true;
            cost = 0;
          } else if (title === '塔主' && lv >= 99.5 && armorLv >= 4) {
            success = true;
            cost = 0;
          }
        } else if (fac === '联邦军方' || fac === '血神军团') {
          let isBloodGod = fac === '血神军团' && title === '血神';

          if (isBloodGod && lv >= 90 && armorLv >= 3) {
            success = true;
            cost = 0;

            if (!c.社交.势力['联邦军方']) c.社交.势力['联邦军方'] = { 身份: '少将', 权限级: 7 };
            else c.社交.势力['联邦军方'].身份 = '少将';
          } else if (title === '少尉' && lv >= 40 && (armorLv >= 1 || mechLv >= 2) && pts >= 1000) {
            success = true;
            cost = 1000;
          } else if (title === '中尉' && lv >= 40 && (armorLv >= 1 || mechLv >= 2) && pts >= 3000) {
            success = true;
            cost = 3000;
          } else if (title === '上尉' && lv >= 40 && (armorLv >= 1 || mechLv >= 2) && pts >= 10000) {
            success = true;
            cost = 10000;
          } else if (title === '少校' && lv >= 60 && (armorLv >= 2 || mechLv >= 3) && pts >= 30000) {
            success = true;
            cost = 30000;
          } else if (title === '中校' && lv >= 60 && (armorLv >= 2 || mechLv >= 3) && pts >= 50000) {
            success = true;
            cost = 50000;
          } else if (title === '上校' && lv >= 60 && (armorLv >= 2 || mechLv >= 3) && pts >= 100000) {
            success = true;
            cost = 100000;
          } else if (title === '大校' && lv >= 60 && (armorLv >= 2 || mechLv >= 3) && pts >= 200000) {
            success = true;
            cost = 200000;
          } else if (title === '少将' && lv >= 80 && (armorLv >= 3 || mechLv >= 4) && pts >= 500000) {
            success = true;
            cost = 500000;
          } else if (title === '中将' && lv >= 80 && (armorLv >= 3 || mechLv >= 4) && pts >= 1000000) {
            success = true;
            cost = 1000000;
          } else if (title === '上将' && lv >= 80 && (armorLv >= 3 || mechLv >= 4) && pts >= 3000000) {
            success = true;
            cost = 3000000;
          } else if (title === '大将' && lv >= 99 && armorLv >= 4) {
            success = true;
            cost = 0;
          }
        } else if (fac === '圣灵教') {
          if (c.属性.邪魂师) {
            if (title === '坛主' && lv >= 70 && armorLv >= 2) {
              success = true;
              cost = 0;
            } else if (title === '长老' && lv >= 80 && armorLv >= 3) {
              success = true;
              cost = 0;
            } else if (title === '供奉' && lv >= 90 && armorLv >= 3) {
              success = true;
              cost = 0;
            } else if (title === '四大天王' && lv >= 95 && armorLv >= 3) {
              success = true;
              cost = 0;
            } else if (title === '二帝' && lv >= 99.5 && armorLv >= 3) {
              success = true;
              cost = 0;
            }
          } else {
            msg = `[晋升驳回] ${charName} 并非邪魂师(缺少 is_evil 标签)，无法加入圣灵教！`;
          }
        }
        if (success) {
          if (fac === '唐门') c.财富.唐门积分 -= cost;
          else if (fac === '史莱克学院') c.财富.学院积分 -= cost;
          else if (fac === '战神殿' || fac === '血神军团' || fac === '联邦军方') c.财富.战功 -= cost;

          if (!c.社交.势力[fac]) c.社交.势力[fac] = { 身份: title, 权限级: 1 };
          else c.社交.势力[fac].身份 = title;

          msg = `[势力晋升] 恭喜 ${charName} 成功晋升为【${fac} - ${title}】！`;
          if (cost > 0) msg += `扣除贡献/战功: ${cost}。`;
        }
        追加系统播报文本(data, msg);
        c.晋升请求 = { 目标势力: '无', 目标职位: '无' };
      }
      if (c.捐献请求 && c.捐献请求.物品名称 !== '无') {
        let req = c.捐献请求;
        let itemName = req.物品名称;

        if (!c.背包[itemName] || c.背包[itemName].数量 < req.数量) {
          追加系统播报文本(data, `[捐献失败] 背包中没有足够的【${itemName}】。`);
        } else {
          let basePrice = 10000;
          if (/天锻|四字|红级|十万年/.test(itemName)) basePrice = 100000000;
          else if (/魂锻|三字|黑级|万年/.test(itemName)) basePrice = 10000000;
          else if (/灵锻|二字|紫级|千年/.test(itemName)) basePrice = 1000000;
          else if (/千锻|一字|黄级|百年/.test(itemName)) basePrice = 100000;

          let talentMult =
            { 绝世妖孽: 2.0, 顶级天才: 1.8, 天才: 1.5, 优秀: 1.2, 正常: 1.0, 劣等: 0.5, 天赋极差: 0.1 }[c.属性.天赋梯队] || 1.0;

          let totalValue = basePrice * req.数量;
          let pointsEarned = Math.floor((totalValue / 1000) * talentMult);

          c.背包[itemName].数量 -= req.数量;
          if (c.背包[itemName].数量 <= 0) delete c.背包[itemName];

          if (req.目标势力 === '史莱克学院') c.财富.学院积分 = (c.财富.学院积分 || 0) + pointsEarned;
          else if (req.目标势力 === '战神殿' || req.目标势力 === '血神军团')
            c.财富.战功 = (c.财富.战功 || 0) + pointsEarned;
          else c.财富.唐门积分 = (c.财富.唐门积分 || 0) + pointsEarned;

          追加系统播报文本(
            data,
            `[物资捐献] ${charName} 向【${req.目标势力}】上交了 ${req.数量} 份【${itemName}】。获得 ${pointsEarned} 贡献点！`,
          );
        }
        c.捐献请求 = { 物品名称: '无', 目标势力: '无', 数量: 1 };
      }
    });

    _(data.char).forEach((c, charName) => {
      if (c.状态.位置) {
        if (c.状态.位置.includes('生命之湖') && c.属性.等级 < 90) {
          c.属性.状态效果['极致凶威压制'] = {
            类型: 'debuff',
            层数: 1,
            描述: '擅闯生命之湖，被多股凶兽级精神力锁定，随时陨落！',
          };
        } else if (c.状态.位置.includes('星斗大森林核心区') && c.属性.等级 < 50) {
          c.属性.状态效果['跨阶恐惧'] = { 类型: 'debuff', 层数: 1, 描述: '实力不足以踏足核心区，深陷高阶魂兽包围' };
          if (getComputedWoundLevelFromStat(c.属性) === '无') {
            c.属性.HP = Math.min(Number(c.属性.HP || c.属性.HP上限 || 0), Math.max(1, Math.floor(Number(c.属性.HP上限 || 1) * 0.2)));
          }
        } else if (c.状态.位置.includes('深海') && c.属性.等级 < 50) {
          c.属性.状态效果['深海压迫'] = { 类型: 'debuff', 层数: 1, 描述: '修为不足以抵御深海重压' };
        }
      }

    });
    追加旧选择回响播报();

    const REFRESH_INTERVAL = 1008;
    const 市场耗散基础触发率 = 0.22;

    _(data.world.地点).forEach((cityData, cityName) => {
      if (!cityData.商店) cityData.商店 = {};

      const groceryStoreName = '城市杂货店';
      if (!cityData.商店[groceryStoreName]) {
        cityData.商店[groceryStoreName] = { 库存: {}, 下次刷新tick: 0 };
      }
      const groceryStore = cityData.商店[groceryStoreName];

      if (currentTick >= (groceryStore.下次刷新tick || 0)) {
        let newInventory = {};
        const economy = cityData.经济状况 || '普通';
        let stockMultiplier = 1.0;
        if (economy === '繁荣') stockMultiplier = 1.5;
        else if (economy === '萧条') stockMultiplier = 0.5;

        _(BaseProductPool).forEach((item, itemName) => {
          newInventory[itemName] = {
            ...item,
            库存: Math.floor((Math.random() * 10 + 5) * stockMultiplier),
          };
        });
        groceryStore.库存 = newInventory;
        groceryStore.下次刷新tick = currentTick + REFRESH_INTERVAL;
      }
    });

    _(FactionDistribution).forEach((dist, factionName) => {
      const branchCities = Array.isArray(dist?.branches) ? dist.branches : [];
      const storeCityNames = factionName === '传灵塔'
        ? Array.from(new Set([String(dist?.hq || '').trim(), ...branchCities].filter(Boolean)))
        : branchCities;
      storeCityNames.forEach(cityName => {
        if (data.world.地点[cityName]) {
          const cityData = data.world.地点[cityName];
          const isHeadquartersStore = factionName === '传灵塔' && String(cityName || '').trim() === String(dist?.hq || '').trim();
          const storeName = isHeadquartersStore ? `${factionName}总部` : `${factionName}分店`;
          if (!cityData.商店[storeName]) {
            cityData.商店[storeName] = { 库存: {}, 下次刷新tick: 0 };
          }
          const store = cityData.商店[storeName];

          if (currentTick >= (store.下次刷新tick || 0)) {
            store.库存 = {};

            if (factionName === '唐门') _.merge(store.库存, TangmenShopProducts);
            else if (factionName === '史莱克学院') _.merge(store.库存, ShrekAcademyShopProducts);
            else if (AssociationShopProducts[factionName])
              _.merge(store.库存, AssociationShopProducts[factionName]);
            else if (factionName === '传灵塔') {
              store.库存['十年魂灵·随机型'] = {
                价格: 50000,
                货币: '联邦币',
                类型: '魂灵',
                库存: 5,
                需求声望: 0,
                描述: '最基础的人造魂灵，适合平民魂师。',
                效果: [
                  {
                    目标: '背包',
                    类型: 'add',
                    数值: { '十年魂灵(随机)': { 数量: 1, 类型: '魂灵', 品质: '十年' } },
                  },
                ],
              };
              store.库存['百年魂灵·随机型'] = {
                价格: 1000000,
                货币: '联邦币',
                类型: '魂灵',
                库存: 3,
                需求声望: 0,
                描述: '品质尚可的百年魂灵。',
                效果: [
                  {
                    目标: '背包',
                    类型: 'add',
                    数值: { '百年魂灵(随机)': { 数量: 1, 类型: '魂灵', 品质: '百年' } },
                  },
                ],
              };

              let isWanNianUnlocked = !!data.world.传灵塔千年魂灵开放;

              if (isWanNianUnlocked) {
                store.库存['千年魂灵·随机型'] = {
                  价格: 6000000,
                  货币: '联邦币',
                  类型: '魂灵',
                  库存: 2,
                  需求声望: 500,
                  描述: '技术成熟后的量产千年魂灵，价格已大幅下降。',
                  效果: [
                    {
                      目标: '背包',
                      类型: 'add',
                      数值: { '千年魂灵(随机)': { 数量: 1, 类型: '魂灵', 品质: '千年' } },
                    },
                  ],
                };
                store.库存['万年魂灵·随机型'] = {
                  价格: 100000000,
                  货币: '联邦币',
                  类型: '魂灵',
                  库存: 1,
                  需求声望: 5000,
                  描述: '传灵塔尖端科技结晶，万年级别魂灵！',
                  效果: [
                    {
                      目标: '背包',
                      类型: 'add',
                      数值: { '万年魂灵(随机)': { 数量: 1, 类型: '魂灵', 品质: '万年' } },
                    },
                  ],
                };
              } else {
                store.库存['千年魂灵·随机型'] = {
                  价格: 20000000,
                  货币: '联邦币',
                  类型: '魂灵',
                  库存: 1,
                  需求声望: 1000,
                  描述: '当前技术下极难培育的千年魂灵，造价高昂。',
                  效果: [
                    {
                      目标: '背包',
                      类型: 'add',
                      数值: { '千年魂灵(随机)': { 数量: 1, 类型: '魂灵', 品质: '千年' } },
                    },
                  ],
                };
              }

              const economy = cityData.经济状况 || '普通';
              let probMultiplier = 1.0;
              if (economy === '繁荣') probMultiplier = 1.5;
              else if (economy === '萧条') probMultiplier = 0.5;

              if (Math.random() * 100 <= 20 * probMultiplier) {
                store.库存['初级升灵台门票'] = {
                  价格: 500000,
                  货币: '联邦币',
                  类型: '门票',
                  库存: 1,
                  需求声望: 0,
                  描述: '可进入初级升灵台，最高遭遇3千年以下虚拟魂兽。',
                  效果: [],
                };
              }
              if (Math.random() * 100 <= 10 * probMultiplier) {
                store.库存['中级升灵台门票'] = {
                  价格: 5000000,
                  货币: '联邦币',
                  类型: '门票',
                  库存: 1,
                  需求声望: 1000,
                  描述: '可进入中级升灵台，最高遭遇2万年以下虚拟魂兽。',
                  效果: [],
                };
              }
              if (Math.random() * 100 <= 5 * probMultiplier) {
                store.库存['高级升灵台门票'] = {
                  价格: 50000000,
                  货币: '联邦币',
                  类型: '门票',
                  库存: 1,
                  需求声望: 5000,
                  描述: '可进入高级升灵台，最高遭遇10万年以下虚拟魂兽。',
                  效果: [],
                };
              }
              if (isHeadquartersStore) {
                store.库存['魂灵塔门票'] = {
                  价格: 20000000,
                  货币: '联邦币',
                  类型: '门票',
                  库存: 1,
                  需求声望: 2000,
                  描述: '仅限史莱克城传灵塔总部核发，可进入魂灵塔挑战当前可冲击的下一层。',
                  效果: [],
                };
              }
            }

            const economy = cityData.经济状况 || '普通';
            let probMultiplier = 1.0;
            if (economy === '繁荣') probMultiplier = 1.5;
            else if (economy === '萧条') probMultiplier = 0.2;

            if (factionName.includes('锻造师协会')) {
              tryGenerateDynamicItem(store.库存, '千锻金属块', 500000, 2, 60 * probMultiplier);
              tryGenerateDynamicItem(store.库存, '灵锻金属块', 10000000, 3, 20 * probMultiplier);
              tryGenerateDynamicItem(store.库存, '魂锻金属块', 80000000, 4, 3 * probMultiplier);
              tryGenerateDynamicItem(store.库存, '天锻金属块', 500000000, 5, 0.1 * probMultiplier);
            } else if (factionName.includes('设计师协会')) {
              tryGenerateDynamicItem(store.库存, '二字斗铠设计图', 2000000, 3, 30 * probMultiplier);
              tryGenerateDynamicItem(store.库存, '三字斗铠设计图', 20000000, 4, 5 * probMultiplier);
              tryGenerateDynamicItem(store.库存, '四字斗铠设计图', 150000000, 5, 0.5 * probMultiplier);
            }

            store.下次刷新tick = currentTick + REFRESH_INTERVAL;
          }
      }
    });
    });

    const 计算商品库存耗散量 = 当前库存 => {
      const 安全库存 = Math.max(0, Math.floor(Number(当前库存 || 0)));
      if (安全库存 <= 0) return 0;
      const 最大耗散 = 安全库存 >= 20 ? 4 : 安全库存 >= 8 ? 3 : 安全库存 >= 3 ? 2 : 1;
      return Math.max(1, Math.min(安全库存, Math.floor(Math.random() * 最大耗散) + 1));
    };

    const 执行市场自然耗散 = () => {
      if (Math.random() > 市场耗散基础触发率) return;
      const 城市列表 = Object.entries(data.world?.地点 || {}).filter(([, 城市数据]) =>
        城市数据 &&
        typeof 城市数据 === 'object' &&
        城市数据.商店 &&
        typeof 城市数据.商店 === 'object' &&
        !Array.isArray(城市数据.商店) &&
        Object.keys(城市数据.商店).length > 0
      );
      if (!城市列表.length) return;
      const 波动次数 = Math.random() < 0.75 ? 1 : 2;
      const 波动记录 = [];
      for (let i = 0; i < 波动次数; i += 1) {
        const 城市项 = 城市列表[Math.floor(Math.random() * 城市列表.length)];
        if (!城市项) continue;
        const [城市名, 城市数据] = 城市项;
        const 商店列表 = Object.entries(城市数据.商店 || {}).filter(([, 商店数据]) => {
          if (!商店数据 || typeof 商店数据 !== 'object') return false;
          const 距刷新剩余tick = Math.max(0, Number(商店数据.下次刷新tick || 0) - currentTick);
          if (距刷新剩余tick >= Math.floor(REFRESH_INTERVAL * 0.9)) return false;
          const 可售条目数 = Object.values(商店数据.库存 || {}).filter(
            条目 => 条目 && typeof 条目 === 'object' && Math.max(0, Number(条目.库存 || 0)) > 0,
          ).length;
          return 可售条目数 > 0;
        });
        if (!商店列表.length) continue;
        const [商店名, 商店数据] = 商店列表[Math.floor(Math.random() * 商店列表.length)];
        const 商品列表 = Object.entries(商店数据.库存 || {}).filter(([, 商品数据]) =>
          商品数据 &&
          typeof 商品数据 === 'object' &&
          Math.max(0, Number(商品数据.库存 || 0)) > 0
        );
        if (!商品列表.length) continue;
        const [商品名, 商品数据] = 商品列表[Math.floor(Math.random() * 商品列表.length)];
        const 当前库存 = Math.max(0, Number(商品数据.库存 || 0));
        const 耗散量 = 计算商品库存耗散量(当前库存);
        if (!(耗散量 > 0)) continue;
        const 新库存 = Math.max(0, 当前库存 - 耗散量);
        商品数据.库存 = 新库存;
        const 价格值 = Math.max(0, Number(商品数据.价格 || 0));
        const 高价值 = 价格值 >= 20000000 || /万年|十万|天锻|魂锻|四字斗铠|魂灵塔/.test(String(商品名 || ''));
        波动记录.push({
          城市名: String(城市名 || '').trim(),
          商店名: String(商店名 || '').trim(),
          商品名: String(商品名 || '').trim(),
          耗散量,
          新库存,
          高价值,
          耗尽: 新库存 <= 0,
        });
      }
      if (!波动记录.length) return;
      const 关键记录 = 波动记录.filter(项 => 项.耗尽 || 项.高价值);
      if (!关键记录.length) return;
      const 播报文本 = 关键记录
        .slice(0, 2)
        .map(项 => `${项.城市名 || '未知地区'}·${项.商店名 || '未知商店'}【${项.商品名 || '未知商品'}】-${项.耗散量}(余${项.新库存})`)
        .join('；');
      追加系统播报文本(data, `[市场波动] ${播报文本}`);
    };
    执行市场自然耗散();
    function tryGenerateDynamicItem(背包, itemName, basePrice, tier, prob) {
      if (Math.random() * 100 > prob) return;

      let metalCount = 1;
      let nameSuffix = '';
      if (tier >= 2 && itemName.includes('金属块')) {
        let roll = Math.floor(Math.random() * 100) + 1;
        if (roll <= 70) metalCount = 2;
        else if (roll <= 90) metalCount = 3;
        else if (roll <= 98) metalCount = 4;
        else metalCount = 5;
        if (metalCount > 1) nameSuffix = `(${metalCount}种金属融锻)`;
      }

      let forgeMult = 1 + (metalCount - 1) * 0.3;
      let fluctuation = 0.85 + Math.random() * 0.3;
      let finalPrice = Math.floor(basePrice * forgeMult * fluctuation);
      let 库存 = tier === 1 ? Math.floor(Math.random() * 10) + 5 : Math.floor(Math.random() * 2) + 1;

      let reqFame = 0;
      if (tier === 3) reqFame = 1000;
      else if (tier === 4) reqFame = 5000;
      else if (tier === 5) reqFame = 20000;

      背包[`[随机]${itemName}${nameSuffix}`] = {
        价格: finalPrice,
        货币: '联邦币',
        库存,
        需求声望: reqFame,
        描述: `一批限时供应的${itemName}。`,
        效果: [
          {
            目标: '背包',
            类型: 'add',
            数值: { [`${itemName}${nameSuffix}`]: { 数量: 1, 类型: '材料', 品质: '随机' } },
          },
        ],
      };
    }

    if (data && data.char) {
      if (!data.world) data.world = {};

      FLAT_LOCATIONS = {};
      if (data.world.地点) {
        for (let rootName in data.world.地点) {
          refreshFlatLocationsFromTree(data.world.地点[rootName], rootName);
        }
      }

      if (!data.world.动态地点) data.world.动态地点 = {};

      _(data.world.动态地点).forEach((locData, locName) => {
        if (locData.x === undefined) locData.x = FLAT_LOCATIONS[locData.归属父节点]?.x ?? -1;
        if (locData.y === undefined) locData.y = FLAT_LOCATIONS[locData.归属父节点]?.y ?? -1;
        if (!locData.地图ID || locData.地图ID === '无') locData.地图ID = 'map_douluo_world';
        locData.节点类型 = normalizeDynamicLocationNodeType(locData.节点类型, locData.层级, locName);
        if (!locData.icon || locData.icon === '无') locData.icon = 'marker';
        if (!locData.所属城镇ID || locData.所属城镇ID === '无') locData.所属城镇ID = '无';
      });

      // 先清空存储态占位文本，再在 display_all 打包阶段按需注入显示占位词。
      // 仅改值，不删减变量结构。
      clearStorageTodoPlaceholders(data.char);

      // travel_request 已弃用：统一移除；promotion/donate 仅玩家保留。
      const PLAYER_NAME = data.sys?.玩家名;
      _(data.char).forEach((charData, charName) => {
        if (!charData || typeof charData !== 'object') return;
        delete charData.travel_request;
        if (charName === PLAYER_NAME) {
          if (!charData.晋升请求 || typeof charData.晋升请求 !== 'object') {
            charData.晋升请求 = { 目标势力: '无', 目标职位: '无' };
          } else {
            if (charData.晋升请求.目标势力 === undefined) charData.晋升请求.目标势力 = '无';
            if (charData.晋升请求.目标职位 === undefined) charData.晋升请求.目标职位 = '无';
          }
          if (!charData.捐献请求 || typeof charData.捐献请求 !== 'object') {
            charData.捐献请求 = { 物品名称: '无', 目标势力: '无', 数量: 1 };
          } else {
            if (charData.捐献请求.物品名称 === undefined) charData.捐献请求.物品名称 = '无';
            if (charData.捐献请求.目标势力 === undefined) charData.捐献请求.目标势力 = '无';
            if (charData.捐献请求.数量 === undefined) charData.捐献请求.数量 = 1;
          }
        } else {
          delete charData.晋升请求;
          delete charData.捐献请求;
        }
      });

      _(data.char).forEach((charData, charName) => {
        if (!charData || typeof charData !== 'object') return;
        const genericSkillAge = Math.max(1000, Number(charData.属性?.等级 || 1) * 200);
        _(charData.武魂融合技 || {}).forEach((fusionData, fusionName) => {
          if (!fusionData || typeof fusionData !== 'object') return;
          fusionData.融合模式 = getNormalizedFusionMode(fusionData);
          if (fusionData.融合模式 === 'self') fusionData.融合对象 = '无';
          const fusionAttributeState = buildFusionSkillAttributeStateFromData(fusionData, charName, data);
          const fusionElementProfile = buildElementProfileFromAttributeState(fusionAttributeState);
          ensureSkillStructGenerated(fusionData?.技能数据, {
            type: charData.属性?.系别 || '强攻系',
            talentTier: charData.属性?.天赋梯队 || '正常',
            age: Math.max(10000, genericSkillAge),
            ringIndex: Math.max(1, Math.ceil(Number(charData.属性?.等级 || 1) / 10)),
            compatibility: 100,
            preferredSecondary: [],
            elementProfile: fusionElementProfile,
            unlockedAttributes: fusionAttributeState.已解锁属性,
            attributeCapacity: fusionAttributeState.可容纳属性,
            elementTrigger: '融合',
            sourceCategory: '武魂融合技',
            textContext: {
              spiritName: fusionName,
              type: charData.属性?.系别 || '强攻系',
            },
          });
          ensureFusionSkillMentalCost(fusionData?.技能数据, 0.5);
        });
      });

      const visibleChars = {};
      const protagonist = data.char[PLAYER_NAME];
      const unlocked = protagonist?.已掌握情报 || [];
      const currentLoc = protagonist?.状态?.位置 || '未知';
      const 关系 = protagonist?.社交?.关系 || {};
      const normalizeLocForMatch = location => {
        const raw = String(location || '')
          .replace(/^斗罗大陆-/, '')
          .replace(/^斗灵大陆-/, '')
          .trim();
        const segments = raw.split('-').filter(Boolean);
        return {
          raw,
          leaf: segments[segments.length - 1] || raw,
          segments,
        };
      };
      const isLocationCompatible = (baseLoc, targetLoc) => {
        const current = normalizeLocForMatch(baseLoc);
        const target = normalizeLocForMatch(targetLoc);
        if (!current.raw || !target.raw) return current.raw === target.raw;
        if (current.raw === target.raw || current.leaf === target.leaf) return true;
        return current.segments.some(seg => target.segments.includes(seg));
      };
      const cloneValue = (value, fallback = undefined) =>
        value === undefined ? fallback : JSON.parse(JSON.stringify(value));
      const toText = (value, fallback = '无') => {
        const text = String(value ?? '').trim();
        return text && text !== '未知' ? text : fallback;
      };
      const 读取本轮模块结算只读路径 = () => {
        try {
          const 当前时间 = Date.now();
          const 运行时根列表 = [];
          const 追加运行时根 = 运行时根 => {
            try {
              if (运行时根 && typeof 运行时根 === 'object' && !运行时根列表.includes(运行时根)) 运行时根列表.push(运行时根);
            } catch (error) {}
          };
          try { 追加运行时根(window); } catch (error) {}
          try { 追加运行时根(window.parent); } catch (error) {}
          try { 追加运行时根(window.top); } catch (error) {}
          try { 追加运行时根(globalThis); } catch (error) {}
          const 记录 = 运行时根列表
            .map(运行时根 => {
              try { return 运行时根.__LWCS_本轮模块结算路径__; } catch (error) { return null; }
            })
            .find(候选记录 => 候选记录 && typeof 候选记录 === 'object' && Number(候选记录.过期时间 || 0) > 当前时间);
          if (!记录 || typeof 记录 !== 'object' || Number(记录.过期时间 || 0) <= 当前时间) return [];
          return (Array.isArray(记录.路径列表) ? 记录.路径列表 : [])
            .filter(路径 => Array.isArray(路径) && 路径.length > 1)
            .map(路径 => 路径.map(片段 => String(片段 ?? '').trim()).filter(Boolean))
            .filter(路径 => 路径.length > 1 && ['sys', 'world', 'org', 'char'].includes(路径[0]));
        } catch (error) {
          return [];
        }
      };
      const 投影本轮模块结算只读字段 = (显示根 = {}, 只读路径列表 = []) => {
        if (!显示根 || typeof 显示根 !== 'object' || !Array.isArray(只读路径列表) || 只读路径列表.length === 0) return 显示根;
        只读路径列表.forEach(路径 => {
          if (!Array.isArray(路径) || 路径.length < 2) return;
          let 当前节点 = 显示根;
          for (let index = 0; index < 路径.length - 1; index += 1) {
            const 片段 = 路径[index];
            if (!当前节点 || typeof 当前节点 !== 'object' || !(片段 in 当前节点)) return;
            当前节点 = 当前节点[片段];
          }
          if (!当前节点 || typeof 当前节点 !== 'object') return;
          const 叶字段 = 路径[路径.length - 1];
          if (!叶字段 || String(叶字段).startsWith('_') || !(叶字段 in 当前节点)) return;
          const 只读叶字段 = `_${叶字段}`;
          if (!(只读叶字段 in 当前节点)) 当前节点[只读叶字段] = 当前节点[叶字段];
          delete 当前节点[叶字段];
        });
        return 显示根;
      };
      const isEmptyDisplayText = value => String(value ?? '').trim() === '';
      const ensureDisplayText = (obj, key, fallbackText = '') => {
        if (!obj || typeof obj !== 'object') return;
        if (isEmptyDisplayText(obj[key])) obj[key] = fallbackText;
      };
      const ensureDisplayStringArray = (obj, key, fallbackText = '') => {
        if (!obj || typeof obj !== 'object') return;
        const current = obj[key];
        if (Array.isArray(current)) {
          const hasExistingValue = current.some(item => String(item ?? '').trim());
          if (hasExistingValue) return;
          if (current.length > 0) {
            const next = [...current];
            next[0] = fallbackText;
            obj[key] = next;
          } else {
            obj[key] = [fallbackText];
          }
          return;
        }
        if (isEmptyDisplayText(current)) {
          obj[key] = [fallbackText];
        }
      };
      const injectDisplaySkillStructDefaults = (skill = {}, context = {}) => {
        if (!skill || typeof skill !== 'object') return;
        const hasPackedEffects = Array.isArray(skill._效果数组) && skill._效果数组.length > 0;
        const textContext = context?.textContext || context || {};
        if (isEmptyDisplayText(skill.魂技名)) skill.魂技名 = buildSkillNameTodoText(textContext);
        if (isEmptyDisplayText(skill.画面描述))
          skill.画面描述 = hasPackedEffects ? AI_TODO_SKILL_VISUAL : AI_TODO_SKILL_VISUAL_STAGE1;
        if (isEmptyDisplayText(skill.效果描述))
          skill.效果描述 = hasPackedEffects ? AI_TODO_SKILL_EFFECT : SKILL_TEXT_UNKNOWN;
        if (!Array.isArray(skill.附带属性) && (skill.附带属性 === undefined || skill.附带属性 === null || skill.附带属性 === ''))
          skill.附带属性 = [];
        if (skill?.[技能机制决策临时字段_V1] && typeof skill[技能机制决策临时字段_V1] === 'object') {
          delete skill[技能机制决策临时字段_V1];
        }
      };
      const injectDisplaySkillMapDefaults = (skillMap = {}, contextFactory = () => ({})) => {
        _(skillMap || {}).forEach((skill, skillName) => {
          if (!skill || typeof skill !== 'object') return;
          injectDisplaySkillStructDefaults(skill, contextFactory(skillName, skill) || {});
        });
      };
      const injectDisplayCharacterTodoDefaults = (charData = {}, charName = '', sourceChar = null) => {
        if (!charData || typeof charData !== 'object') return charData;
        const sourceAttr = sourceChar?.属性 && typeof sourceChar.属性 === 'object' ? sourceChar.属性 : null;

        ensureDisplayText(charData, '性格', AI_TODO_PERSONALITY);
        if (charData.属性 && typeof charData.属性 === 'object') {
          const currentBackground = String(charData.属性.背景 ?? '').trim();
          if (!currentBackground || currentBackground === '无' || isAiTodoText(currentBackground)) {
            charData.属性.背景 = AI_TODO_BACKGROUND;
          }
          const shouldDisplayTalentRatingTodo =
            !!sourceAttr && Object.prototype.hasOwnProperty.call(sourceAttr, '天赋评级');
          const currentTalentRating = String(charData.属性.天赋评级 ?? '').trim();
          if (shouldDisplayTalentRatingTodo && (!currentTalentRating || currentTalentRating === '无' || isAiTodoText(currentTalentRating))) {
            charData.属性.天赋评级 = AI_TODO_TALENT_RATING;
          }
        }
        if (charData.社交 && typeof charData.社交 === 'object') {
          ensureDisplayText(charData.社交, '主身份', AI_TODO_MAIN_IDENTITY);
          _(charData.社交.关系 || {}).forEach(relData => {
            if (!relData || typeof relData !== 'object') return;
            规范武魂相关度基础字段(relData);
          });
        }
        if (charData.状态 && typeof charData.状态 === 'object') {
          ensureDisplayText(charData.状态, '位置', AI_TODO_STATUS_LOC);
        }
        if (charData.外貌 && typeof charData.外貌 === 'object') {
          ensureDisplayText(charData.外貌, '发色', '待补全(根据角色外貌补全发色)');
          ensureDisplayText(charData.外貌, '发型', '待补全(根据角色发质与气质补全发型)');
          ensureDisplayText(charData.外貌, '瞳色', '待补全(根据角色外貌补全瞳色)');
          ensureDisplayText(charData.外貌, '身高', '待补全(根据角色设定补全身高)');
          ensureDisplayText(charData.外貌, '体型', '待补全(根据角色体态补全体型)');
          ensureDisplayText(charData.外貌, '长相描述', '待补全(根据角色面部特征补全长相描述)');
          if (!Array.isArray(charData.外貌.特殊特征)) charData.外貌.特殊特征 = [];
          else {
            charData.外貌.特殊特征 = charData.外貌.特殊特征
              .map(item => String(item ?? '').trim())
              .filter(item => item && !/^待补全\(/.test(item));
          }
        }
        if (charData.穿搭 && typeof charData.穿搭 === 'object') {
          ensureDisplayText(charData.穿搭, '着装', '待补全(从衣柜中选择当前套装名)');
          _(charData.穿搭.衣柜 || {}).forEach(wardrobeData => {
            if (!wardrobeData || typeof wardrobeData !== 'object') return;
            ensureDisplayText(wardrobeData, '上装', '待补全(根据当前套装补全上装)');
            ensureDisplayText(wardrobeData, '下装', '待补全(根据当前套装补全下装)');
            ensureDisplayText(wardrobeData, '鞋子', '待补全(根据当前套装补全鞋子)');
            ensureDisplayText(wardrobeData, '描述', '待补全(根据套装整体补全服装描述)');
          });
        }
        if (charData.私密档案 && typeof charData.私密档案 === 'object') {
          ensureDisplayStringArray(charData.私密档案, '癖好', '待补全(请根据角色经历，填写已觉醒的特殊癖好标签)');
          ensureDisplayStringArray(
            charData.私密档案,
            '幻想',
            '待补全(请根据角色隐藏的性格，描写其内心深处渴望被对待的私密方式)',
          );
          if (charData.私密档案.身材数据 && typeof charData.私密档案.身材数据 === 'object') {
            ensureDisplayText(charData.私密档案.身材数据, '罩杯', '待补全(请根据角色体型填写，如A/B/C/D/E)');
            ensureDisplayText(charData.私密档案.身材数据, '身材描述', '待补全(请描写其身材曲线与肉感)');
          }
          if (charData.私密档案.贴身衣物 && typeof charData.私密档案.贴身衣物 === 'object') {
            ensureDisplayText(
              charData.私密档案.贴身衣物,
              '内衣',
              '待补全(请根据当前情境描写具体内衣款式，如蕾丝胸罩/真空/拘束具)',
            );
            ensureDisplayText(charData.私密档案.贴身衣物, '内裤', '待补全(请描写具体内裤款式，如丁字裤/C字裤/真空/贞操带)');
            ensureDisplayStringArray(
              charData.私密档案.贴身衣物,
              '特殊道具',
              '待补全(若体内或体表佩戴了跳蛋/项圈等道具请在此列出)',
            );
          }
          _(charData.私密档案.身体部位 || {}).forEach(partData => {
            if (!partData || typeof partData !== 'object') return;
            ensureDisplayText(
              partData,
              '外观特征',
              '待补全(请描写该部位的静态外观与天生敏感特征，如：粉嫩/修长/天生敏感)',
            );
          });
        }

        _(charData.武魂 || {}).forEach((spiritData, spiritKey) => {
          if (!spiritData || typeof spiritData !== 'object') return;
          const spiritType = spiritData?.type || charData?.属性?.系别 || '强攻系';
          const isSecondarySpirit = spiritKey === '第二武魂';
          ensureDisplayText(spiritData, '表象名称', isSecondarySpirit ? '未展露' : AI_TODO_SPIRIT_NAME);
          ensureDisplayText(spiritData, '描述', isSecondarySpirit ? '无' : AI_TODO_SPIRIT_DESC);
          ensureDisplayText(spiritData, '属性体系', AI_TODO_ATTRIBUTE_SYSTEM);
          if (
            !Array.isArray(spiritData.已解锁属性) &&
            (spiritData.已解锁属性 === undefined || spiritData.已解锁属性 === null || spiritData.已解锁属性 === '')
          ) {
            spiritData.已解锁属性 = [];
          }
          if (Array.isArray(spiritData.可容纳属性)) {
            const hasCapacity = spiritData.可容纳属性.some(item => String(item ?? '').trim());
            if (!hasCapacity) spiritData.可容纳属性 = [AI_TODO_ATTRIBUTE_CAPACITY];
          } else if (
            spiritData.可容纳属性 === undefined ||
            spiritData.可容纳属性 === null ||
            spiritData.可容纳属性 === ''
          ) {
            spiritData.可容纳属性 = [AI_TODO_ATTRIBUTE_CAPACITY];
          }

          _(spiritData?.魂灵 || {}).forEach((soulSpirit, soulSpiritKey) => {
            if (!soulSpirit || typeof soulSpirit !== 'object') return;
            ensureDisplayText(soulSpirit, '表象名称', AI_TODO_SOUL_SPIRIT_NAME);
            if (isEmptyDisplayText(soulSpirit.描述))
              soulSpirit.描述 = buildSoulSpiritDescriptionTodoText(soulSpirit);
            ensureDisplayText(soulSpirit, '品质', AI_TODO_SOUL_SPIRIT_QUALITY);
            if (Object.prototype.hasOwnProperty.call(soulSpirit, '附机制候选')) delete soulSpirit.附机制候选;
            _(soulSpirit?.魂环 || {}).forEach(ringData => {
              if (!ringData || typeof ringData !== 'object') return;
              ensureDisplayText(ringData, '颜色', '无');
              injectDisplaySkillMapDefaults(ringData.魂技, skillName => ({
                type: spiritType,
                textContext: {
                  spiritName:
                    (!isAiTodoText(soulSpirit.表象名称) && soulSpirit.表象名称 !== '未展露'
                      ? soulSpirit.表象名称
                      : !isAiTodoText(spiritData.表象名称) && spiritData.表象名称 !== '未展露'
                        ? spiritData.表象名称
                        : spiritKey || soulSpiritKey || skillName),
                  type: spiritType,
                },
              }));
            });
          });
          _(spiritData?.独立魂环 || {}).forEach(ringData => {
            if (!ringData || typeof ringData !== 'object') return;
            ensureDisplayText(ringData, '颜色', '无');
            ensureDisplayText(ringData, '来源', '无');
            if (Object.prototype.hasOwnProperty.call(ringData, '附机制候选')) delete ringData.附机制候选;
            injectDisplaySkillMapDefaults(ringData.魂技, skillName => ({
              type: spiritType,
              textContext: {
                spiritName:
                  !isAiTodoText(spiritData.表象名称) && spiritData.表象名称 !== '未展露'
                    ? spiritData.表象名称
                    : spiritKey || skillName,
                type: spiritType,
              },
            }));
          });

        });

        _(charData.魂骨 || {}).forEach((boneData, bonePart) => {
          if (!boneData || typeof boneData !== 'object') return;
          const 骨部位 = String(bonePart || '魂骨').trim() || '魂骨';
          const 魂骨来源文本 = String(boneData.来源 || '').trim();
          boneData.来源 = 是否有效魂骨来源_V1(魂骨来源文本) ? 魂骨来源文本 : AI_TODO_SOUL_BONE_SOURCE;
          boneData.名称 = 归一化魂骨名称_V1(boneData.名称, boneData.来源, 骨部位);
          injectDisplaySkillMapDefaults(boneData?.附带技能, skillName => ({
            type: charData?.属性?.系别 || '强攻系',
            textContext: {
              spiritName: boneData?.名称 || 骨部位 || skillName,
              type: charData?.属性?.系别 || '强攻系',
            },
          }));
        });

        if (charData.血脉之力 && typeof charData.血脉之力 === 'object') {
          const keepExtendedBloodline = shouldKeepExtendedBloodlineData(charName, charData);
          if (!keepExtendedBloodline) {
            pruneExtendedBloodlineData(charData, charName);
          }
          const bloodlineType = charData?.属性?.系别 || '强攻系';
          if (keepExtendedBloodline) {
            injectDisplaySkillMapDefaults(charData.血脉之力?.被动, skillName => ({
              type: bloodlineType,
              textContext: {
                spiritName: charData.血脉之力?.血脉 || skillName,
                type: bloodlineType,
              },
            }));
            injectDisplaySkillMapDefaults(charData.血脉之力?.技能, skillName => ({
              type: bloodlineType,
              textContext: {
                spiritName: charData.血脉之力?.血脉 || skillName,
                type: bloodlineType,
              },
            }));
            _(charData.血脉之力?.气血魂环 || {}).forEach(ringData => {
              if (!ringData || typeof ringData !== 'object') return;
              ensureDisplayText(ringData, '颜色', '金');
              injectDisplaySkillMapDefaults(ringData?.魂技, skillName => ({
                type: bloodlineType,
                textContext: {
                  spiritName: charData.血脉之力?.血脉 || skillName,
                  type: bloodlineType,
                },
              }));
            });
          }
        }

        injectDisplaySkillMapDefaults(charData.自创魂技, skillName => ({
          type: charData?.属性?.系别 || '强攻系',
          textContext: {
            spiritName: skillName,
            type: charData?.属性?.系别 || '强攻系',
          },
        }));
        _(charData.武魂融合技 || {}).forEach((fusionData, fusionName) => {
          if (!fusionData || typeof fusionData !== 'object') return;
          injectDisplaySkillStructDefaults(fusionData.技能数据, {
            type: charData?.属性?.系别 || '强攻系',
            textContext: {
              spiritName: fusionName,
              type: charData?.属性?.系别 || '强攻系',
            },
          });
        });

        return charData;
      };
      const pruneSummaryValue = value => {
        if (value === undefined || value === null) return undefined;
        if (typeof value === 'string') {
          const text = value.trim();
          if (!text || ['无', '未知', '当前尚未积累足够的人物关系数据。'].includes(text)) return undefined;
          return value;
        }
        if (typeof value === 'number') return value === 0 ? undefined : value;
        if (typeof value === 'boolean') return value ? value : undefined;
        if (Array.isArray(value)) {
          const nextArray = value.map(item => pruneSummaryValue(item)).filter(item => item !== undefined);
          return nextArray.length > 0 ? nextArray : undefined;
        }
        if (typeof value === 'object') {
          const nextObject = {};
          Object.keys(value).forEach(key => {
            const pruned = pruneSummaryValue(value[key]);
            if (pruned !== undefined) nextObject[key] = pruned;
          });
          return Object.keys(nextObject).length > 0 ? nextObject : undefined;
        }
        return value;
      };

      const buildCharReadOnlySummary = (sourceChar = {}, visibleChar = sourceChar) => {
        const relationCards = [];
        const inventoryExtraSummary = [];
        const soulBoneStatSummary = [];
        const spiritCombatSummary = [];
        const jobSummary = [];
        const battleHistorySummary = [];
        const equipmentBonusSummary = [];

        _(sourceChar.社交?.关系 || {}).forEach((relData, targetName) => {
          relationCards.push({
            目标: targetName,
            关系: relData.关系 || '陌生',
            可接触性: relData._维护优先级 || '未知',
            推进提示: relData._推进提示 || '无',
            当前关系加成: relData._当前关系加成 || relData.好感加成 || '无',
            下一档解锁奖励: relData._下档解锁加成 || '无',
            下一档解锁门槛: Number(relData._下档解锁阈值 || 0),
            路线可切换: !!relData._可切线,
            路线受限原因: relData._切线限制原因 || '无',
            最近互动tick: Number(relData.上次互动tick || 0),
            最近互动动作: relData.上次互动动作 || '无',
            最近互动好感变化: Number(relData.最近好感变化 || 0),
          });
        });

        _(sourceChar.背包 || {}).forEach((itemData, itemName) => {
          if (!itemData || typeof itemData !== 'object') return;
          const summaryItem = { 物品: itemName };
          let hasContent = false;
          if (Number(itemData.市场估值?.价格 || 0) > 0) {
            summaryItem.市场估值_价格 = Number(itemData.市场估值?.价格 || 0);
            summaryItem.市场估值_货币 = itemData.市场估值?.货币 || '联邦币';
            hasContent = true;
          }
          if (itemData.有效期至 && itemData.有效期至 !== '无') {
            summaryItem.有效期至 = itemData.有效期至;
            hasContent = true;
          }
          if (hasContent) inventoryExtraSummary.push(summaryItem);
        });

        _(sourceChar.魂骨 || {}).forEach((boneData, boneName) => {
          if (!boneData || typeof boneData !== 'object') return;
          const statsBonus = cloneValue(boneData.属性加成 || {}, {});
          if (Object.values(statsBonus).some(value => Number(value || 0) !== 0)) {
            soulBoneStatSummary.push({
              部位: boneName,
              力量: Number(statsBonus.力量 || 0),
              防御: Number(statsBonus.防御 || 0),
              敏捷: Number(statsBonus.敏捷 || 0),
              体力上限: Number(statsBonus.体力上限 || 0),
              精神上限: Number(statsBonus.精神力上限 || 0),
              魂力上限: Number(statsBonus.魂力上限 || 0),
            });
          }
        });

        _(sourceChar.武魂 || {}).forEach((spiritData, spiritKey) => {
          const visibleSpirit = visibleChar.武魂?.[spiritKey] || spiritData || {};
          _(spiritData?.魂灵 || {}).forEach((soulSpirit, slotName) => {
            const powerPanel = soulSpirit?.战力面板;
            if (!powerPanel || typeof powerPanel !== 'object') return;
            const visibleSlot = visibleChar.武魂?.[spiritKey]?.魂灵?.[slotName] || soulSpirit || {};
            spiritCombatSummary.push({
              武魂槽位: spiritKey,
              武魂名称: visibleSpirit.表象名称 || spiritData?.表象名称 || '无',
              魂灵槽位: slotName,
              魂灵名称: visibleSlot.表象名称 || soulSpirit.表象名称 || '无',
              描述: String(visibleSlot.描述 || soulSpirit.描述 || '无'),
              品质: String(visibleSlot.品质 || soulSpirit.品质 || '无'),
              对标等级: formatCultivationLevelText(powerPanel.对标等级 || 0, '0'),
              力量: Number(powerPanel.str || 0),
              防御: Number(powerPanel.def || 0),
              敏捷: Number(powerPanel.agi || 0),
              体力上限: Number(powerPanel.vit_max || 0),
              精神上限: Number(powerPanel.men_max || 0),
              魂力上限: Number(powerPanel.sp_max || 0),
            });
          });
        });

        _(sourceChar.职业 || {}).forEach((jobData, jobName) => {
          jobSummary.push({
            职业: jobName,
            等级: Number(jobData.等级 || 0),
            称号: jobData.称号 || '无',
            成功率: Number(jobData.限制?.成功率 || 0),
            最大融合数: Number(jobData.限制?.最大融合数 || 0),
          });
        });

        _(sourceChar.战斗历史 || {}).forEach((historyData, historyName) => {
          battleHistorySummary.push({
            项目: historyName,
            次数: Number(historyData?.次数 || 0),
            最近tick: Number(historyData?.最近tick || 0),
          });
        });

        const armorBonus = cloneValue(sourceChar.装备?.斗铠?._属性加成 || {}, {});
        if (Object.values(armorBonus).some(value => Number(value || 0) !== 0)) {
          equipmentBonusSummary.push({
            装备: '斗铠',
            等效等级: Number(armorBonus.等效等级 || 0),
            力量: Number(armorBonus.力量 || 0),
            防御: Number(armorBonus.防御 || 0),
            敏捷: Number(armorBonus.敏捷 || 0),
            体力上限: Number(armorBonus.体力上限 || 0),
            精神上限: Number(armorBonus.精神力上限 || 0),
            魂力上限: Number(armorBonus.魂力上限 || 0),
          });
        }
        const mechBonus = cloneValue(sourceChar.装备?.机甲?._属性加成 || {}, {});
        if (Object.values(mechBonus).some(value => Number(value || 0) !== 0)) {
          equipmentBonusSummary.push({
            装备: '机甲',
            等效等级: 0,
            力量: Number(mechBonus.力量 || 0),
            防御: Number(mechBonus.防御 || 0),
            敏捷: Number(mechBonus.敏捷 || 0),
            体力上限: Number(mechBonus.体力上限 || 0),
            精神上限: Number(mechBonus.精神力上限 || 0),
            魂力上限: Number(mechBonus.魂力上限 || 0),
          });
        }

        const 关系分析数据 = sourceChar.社交?.关系分析 || {};

        const summary = {
          精神境界: sourceChar.属性?.精神境界 || '无',
          名望等级: sourceChar.社交?.名望等级 || '籍籍无名',
          公开情报: !!sourceChar.社交?.公开情报,
          力量: Number(sourceChar.属性?.力量 || 0),
          防御: Number(sourceChar.属性?.防御 || 0),
          敏捷: Number(sourceChar.属性?.敏捷 || 0),
          体力上限: Number(sourceChar.属性?.体力上限 || 0),
          魂力上限: Number(sourceChar.属性?.魂力上限 || 0),
          精神上限: Number(sourceChar.属性?.精神力上限 || 0),
          社交恋爱候选: cloneValue(关系分析数据.恋爱候选, []),
          社交信任对象: cloneValue(关系分析数据.信任对象, []),
          社交高风险对象: cloneValue(关系分析数据.风险对象, []),
          社交同地可接触: cloneValue(关系分析数据.同地对象, []),
          社交可联络对象: cloneValue(关系分析数据.可联络对象, []),
          社交路线受阻对象: cloneValue(关系分析数据.受阻对象, []),
          社交关系卡片: relationCards,
          魂灵战力摘要: spiritCombatSummary,
          副职业摘要: jobSummary,
          装备加成摘要: equipmentBonusSummary,
          斗铠回路冲突: !!sourceChar.装备?.斗铠?._已排异,
          魂骨属性概览: soulBoneStatSummary,
          ...(isSoulTowerEligibleCharacter(sourceChar)
            ? {
                试炼最高层: Number(sourceChar.魂灵塔记录?.最高层 || 0),
                试炼当前五折魂灵: formatSoulTowerDiscountSpiritSummary(sourceChar.魂灵塔记录?.当前五折魂灵),
              }
            : {}),
          战斗记录摘要: battleHistorySummary,
          物品附加信息: inventoryExtraSummary,
          ...(sourceChar.精神领域?.进行中 && Number(sourceChar.精神领域?.维护消耗?.精神力 || 0) > 0
            ? { 领域维护消耗: Number(sourceChar.精神领域?.维护消耗?.精神力 || 0) }
            : {}),
        };
        return pruneSummaryValue(summary) || {};
      };
      const sanitizeDisplayCharacter = (sourceChar = {}) => {
        const nextChar = cloneValue(sourceChar, {});
        if (nextChar.属性) {
          delete nextChar.属性.上次灵物等级;
          delete nextChar.属性.底子波动;
          delete nextChar.属性.天赋梯队;
          delete nextChar.属性.训练加成;
          delete nextChar.属性.精神境界;
          delete nextChar.属性.魂力上限;
          delete nextChar.属性.精神力上限;
          delete nextChar.属性.力量;
          delete nextChar.属性.防御;
          delete nextChar.属性.敏捷;
          delete nextChar.属性.体力上限;
          delete nextChar.属性.状态效果;
        }
        if (nextChar.状态) {
          delete nextChar.状态.当前领域;
        }
        delete nextChar.魂灵塔记录;
        delete nextChar.战斗历史;
        _(nextChar.职业 || {}).forEach(jobData => {
          if (jobData && typeof jobData === 'object') delete jobData.限制;
        });
        _(nextChar.社交?.称号 || {}).forEach(titleData => {
          if (titleData && typeof titleData === 'object') delete titleData.声望加成;
        });
        _(nextChar.社交?.关系 || {}).forEach(relData => {
          if (!relData || typeof relData !== 'object') return;
          delete relData.关系;
          delete relData.好感加成;
          delete relData._关系阶段;
          delete relData._下一阶段;
          delete relData._下一阶段阈值;
          delete relData._可切线;
          delete relData._切线限制原因;
          delete relData._推进提示;
          delete relData._维护优先级;
          delete relData.上次互动tick;
          delete relData.上次互动动作;
          delete relData.最近好感变化;
          delete relData._当前关系加成;
          delete relData._下档解锁加成;
          delete relData._下档解锁阈值;
        });
        if (nextChar.社交) {
          delete nextChar.社交.名望等级;
          delete nextChar.社交.公开情报;
          const rawRelationAnalysis =
            nextChar.社交.关系分析 && typeof nextChar.社交.关系分析 === 'object'
              ? nextChar.社交.关系分析
              : {};
          nextChar.社交.关系分析 =
            pruneSummaryValue({
              关注对象: toText(rawRelationAnalysis.关注对象, '无'),
              重点对象: normalizeRelationAnalysisTopTargetsInput(rawRelationAnalysis.重点对象)
                .slice(0, 3)
                .map(item => ({
                  对象: toText(item && item.对象, '无'),
                  原因: toText(item && item.原因, '无'),
                  建议行动: toText(item && item.建议行动, '继续观察'),
                })),
            }) || {};
        }
        _(nextChar.背包 || {}).forEach(itemData => {
          if (itemData && typeof itemData === 'object') {
            delete itemData.市场估值;
            delete itemData.有效期至;
          }
        });
        _(nextChar.魂骨 || {}).forEach(boneData => {
          if (!boneData || typeof boneData !== 'object') return;
          delete boneData.name;
          delete boneData.age;
          delete boneData.状态;
          delete boneData.属性加成;
        });
        if (nextChar.装备?.斗铠) {
          delete nextChar.装备.斗铠._属性加成;
          delete nextChar.装备.斗铠._已排异;
        }
        if (nextChar.装备?.机甲) {
          delete nextChar.装备.机甲._属性加成;
        }
        _(nextChar.武魂 || {}).forEach(spiritData => {
          _(spiritData?.魂灵 || {}).forEach(soulSpirit => {
            delete soulSpirit.战力面板;
          });
        });
        if (nextChar.精神领域) {
          delete nextChar.精神领域.战斗修饰;
          delete nextChar.精神领域.维护消耗;
        }
        return nextChar;
      };
      const buildFactionReadOnlySummary = (sourceFaction = {}, detailLevel = 'public') =>
        detailLevel === 'related'
          ? {
              核心战力: cloneValue(sourceFaction.战力统计, {}),
              成员数量: Object.keys(sourceFaction.成员 || {}).length,
            }
          : null;
      const sanitizeDisplayFaction = (sourceFaction = {}, detailLevel = 'public') => {
        const nextFaction = {
          影响力: Number(sourceFaction.影响力 || 0),
          规模: Number(sourceFaction.规模 || 0),
          状态: sourceFaction.状态 || '正常',
          上级势力: sourceFaction.上级势力 || '无',
          关系: cloneValue(sourceFaction.关系 || {}, {}),
        };
        const summary = buildFactionReadOnlySummary(sourceFaction, detailLevel);
        if (summary) nextFaction._summary = summary;
        return nextFaction;
      };
      const sanitizeDisplayLocation = (locData = {}, includeFull = false) =>
        includeFull
          ? {
              掌控势力: locData.掌控势力,
              人口: locData.人口,
              守护军团: locData.守护军团,
              经济状况: locData.经济状况,
              类型: locData.类型,
              描述: locData.描述,
              状态: locData.状态,
              节点类别: locData.节点类别,
              交互: cloneValue(locData.交互, []),
              服务: cloneValue(locData.服务, []),
              行动槽: cloneValue(locData.行动槽, []),
              子节点: cloneValue(locData.子节点 || {}, {}),
              商店: Object.keys(locData.商店 || {}),
            }
          : {
              类型: locData.类型,
              描述: locData.描述,
              状态: locData.状态,
              已知子节点: Object.keys(locData.子节点 || {}),
            };
      const sanitizeDisplayDynamicLocation = (dynData = {}) =>
        buildCompactDynamicLocationDisplayPayload(dynData);
      const buildWorldReadOnlySummary = (baseWorld = {}, visibleWorld = {}) => {
        const visibleStores = {};
        Object.keys(visibleWorld.地点 || {}).forEach(locName => {
          const storeNames = Object.keys(baseWorld.地点?.[locName]?.商店 || {});
          if (storeNames.length > 0) visibleStores[locName] = storeNames;
        });
        return {
          当前日期: baseWorld.时间?._calendar || '未知',
          当前地点: currentLoc,
          可见商店: visibleStores,
        };
      };

      Object.keys(data.char).forEach(charName => {
        const realCharData = data.char[charName];
        const charLoc = realCharData.状态?.位置 || '未知';

        const isProtagonist = charName === PLAYER_NAME;
        const isSameLoc = charLoc !== '未知' && isLocationCompatible(currentLoc, charLoc);
        const isKnown = !!关系[charName];

        if (isProtagonist || isSameLoc || isKnown) {
          const fakeCharData = sanitizeDisplayCharacter(realCharData);

          if (charName === '唐舞麟' && !unlocked.includes('event_ch4_06')) {
            if (fakeCharData.血脉之力) fakeCharData.血脉之力.血脉 = '未知隐性变异(尚未觉醒)';
          }
          if (charName === '古月' && !unlocked.includes('event_ch3_07')) {
            if (fakeCharData.武魂 && fakeCharData.武魂['元素使']) fakeCharData.武魂['元素使'].type = '元素系';
          }
          injectDisplayCharacterTodoDefaults(fakeCharData, charName, realCharData);
          const charSummary = buildCharReadOnlySummary(realCharData, fakeCharData);
          if (charSummary && Object.keys(charSummary).length > 0) fakeCharData._summary = charSummary;

          visibleChars[charName] = fakeCharData;
        }
      });
      if (protagonist?.社交?.关系分析) {
        const relationWeight = name => Number(protagonist?.社交?.关系?.[name]?.好感度 || 0);
        const sameLocationTargets = Object.keys(关系)
          .filter(name => {
            if (name === PLAYER_NAME) return false;
            const target = data.char[name];
            return !!target && target.状态?.位置 && isLocationCompatible(currentLoc, target.状态.位置);
          })
          .sort((a, b) => relationWeight(b) - relationWeight(a));
        const contactableTargets = Object.keys(关系)
          .filter(name => {
            if (name === PLAYER_NAME) return false;
            const target = data.char[name];
            return !!target && target.状态?.存活 !== false;
          })
          .sort((a, b) => relationWeight(b) - relationWeight(a));

        protagonist.社交.关系分析.同地对象 = sameLocationTargets;
        protagonist.社交.关系分析.可联络对象 = contactableTargets;
        if (visibleChars[PLAYER_NAME]) {
          const playerSummary = buildCharReadOnlySummary(protagonist, visibleChars[PLAYER_NAME]);
          if (playerSummary && Object.keys(playerSummary).length > 0)
            visibleChars[PLAYER_NAME]._summary = playerSummary;
          else delete visibleChars[PLAYER_NAME]._summary;
        }
      }

      const filtered_org = {};
      const relatedOrgNames = new Set(Object.keys(protagonist?.社交?.势力 || {}));
      Object.values(visibleChars).forEach(visibleChar => {
        Object.keys(visibleChar?.社交?.势力 || {}).forEach(facName => relatedOrgNames.add(facName));
      });
      _(data.org || {}).forEach((orgData, orgName) => {
        const detailLevel = relatedOrgNames.has(orgName) ? 'related' : 'public';
        filtered_org[orgName] = sanitizeDisplayFaction(orgData, detailLevel);
      });

      const filtered_sys = {
        玩家名: data.sys?.玩家名,
        系统播报: data.sys?.系统播报,
        最近检定: Number(data.sys?.最近检定 || 0),
      };

      const filtered_world = {
        时间: { tick: Number(data.world?.时间?.tick || 0), _calendar: data.world?.时间?._calendar || '未知' },
        偏差值: Number(data.world?.偏差值 || 0),
        偏差倍率: Number(data.world?.偏差倍率 || 1),
        累计击杀年限: Number(data.world?.累计击杀年限 || 0),
        兽潮已触发: !!data.world?.兽潮已触发,
        传灵塔千年魂灵开放: !!data.world?.传灵塔千年魂灵开放,
        时间线: cloneValue(data.world?.时间线 || {}, {}),
        机密情报: cloneValue(data.world?.机密情报 || {}, {}),
        拍卖: cloneValue(data.world?.拍卖 || {}, {}),
        交易请求: cloneValue(data.world?.交易请求 || {}, {}),
        委托板: cloneValue(data.world?.委托板 || {}, {}),
        图鉴: cloneValue(data.world?.图鉴 || {}, {}),
        战斗: cloneValue(data.world?.战斗 || {}, {}),
        _引导: { 时间线预览: data.world?._引导?.时间线预览 || '' },
        地点: {},
        动态地点: {},
      };

      const currentLocInfo = findMapNodeEntry(currentLoc, data);

      let currentContextNodeName = currentLocInfo?.path?.length
        ? currentLocInfo.path[currentLocInfo.path.length - 1]
        : currentLoc;

      if (
        data.world.动态地点[currentLoc]?.地图ID &&
        data.world.动态地点[currentLoc].地图ID !== '无'
      ) {
        currentContextNodeName =
          data.world.动态地点[currentLoc].归属父节点 ||
          currentLocInfo?.path?.[currentLocInfo.path.length - 1] ||
          '斗罗大陆';
      }

      _(data.world.地点).forEach((locData, locName) => {
        if (locName === currentContextNodeName || (currentLocInfo?.path && currentLocInfo.path.includes(locName))) {
          filtered_world.地点[locName] = sanitizeDisplayLocation(locData, true);
        } else {
          filtered_world.地点[locName] = sanitizeDisplayLocation(locData, false);
        }
      });

      _(data.world.动态地点).forEach((dynData, dynName) => {
        if (dynData.归属父节点 === currentContextNodeName) {
          filtered_world.动态地点[dynName] = sanitizeDisplayDynamicLocation(dynData);
        }
      });

      filtered_world._summary = buildWorldReadOnlySummary(data.world, filtered_world);

      delete data.display_chars;
      data.display_all = {
        sys: filtered_sys,
        world: filtered_world,
        org: filtered_org,
        char: visibleChars,
      };
      投影本轮模块结算只读字段(data.display_all, 读取本轮模块结算只读路径());
    }

    _(data.world?.动态地点 || {}).forEach(locData => {
      pruneDynamicLocationStorageFields(locData);
    });

    return data;
  });

function 读取事件变量数据根_V1(变量包 = {}) {
  if (变量包?.stat_data && typeof 变量包.stat_data === 'object') return 变量包.stat_data;
  return 变量包 && typeof 变量包 === 'object' ? 变量包 : {};
}

function 按路径读取对象_V1(根对象 = {}, 路径 = []) {
  let 当前 = 根对象;
  for (const 片段 of 路径) {
    if (!当前 || typeof 当前 !== 'object') return undefined;
    当前 = 当前[片段];
  }
  return 当前;
}

function 遍历数据魂环_V1(数据根 = {}, 回调 = () => {}) {
  Object.entries(数据根?.char || {}).forEach(([角色名, 角色数据]) => {
    if (!角色数据 || typeof 角色数据 !== 'object') return;
    Object.entries(角色数据?.武魂 || {}).forEach(([武魂键, 武魂数据]) => {
      if (!武魂数据 || typeof 武魂数据 !== 'object') return;
      Object.entries(武魂数据?.魂灵 || {}).forEach(([魂灵键, 魂灵数据]) => {
        if (!魂灵数据 || typeof 魂灵数据 !== 'object') return;
        Object.entries(魂灵数据?.魂环 || {}).forEach(([魂环键, 魂环数据]) => {
          if (!魂环数据 || typeof 魂环数据 !== 'object') return;
          回调(魂环数据, ['char', 角色名, '武魂', 武魂键, '魂灵', 魂灵键, '魂环', 魂环键], 角色数据);
        });
      });
      Object.entries(武魂数据?.独立魂环 || {}).forEach(([魂环键, 魂环数据]) => {
        if (!魂环数据 || typeof 魂环数据 !== 'object') return;
        回调(魂环数据, ['char', 角色名, '武魂', 武魂键, '独立魂环', 魂环键], 角色数据);
      });
    });
  });
}

function 固化本轮魂环年限变化_V1(新变量 = {}, 旧变量 = {}) {
  const 新数据 = 读取事件变量数据根_V1(新变量);
  const 旧数据 = 读取事件变量数据根_V1(旧变量);
  遍历数据魂环_V1(新数据, (新魂环, 魂环路径) => {
    const 旧魂环 = 按路径读取对象_V1(旧数据, 魂环路径);
    const 新年限 = Math.max(0, Math.floor(Number(新魂环?.年限 || 0)));
    if (!(新年限 > 0)) return;
    const 旧年限原始 = Number(旧魂环?.年限);
    const 旧年限 = Number.isFinite(旧年限原始) && 旧年限原始 > 0 ? Math.max(100, Math.floor(旧年限原始)) : 100;
    if (!(新年限 > 旧年限)) return;
    Object.values(新魂环?.魂技 || {}).forEach(技能数据 => {
      应用年限变化到技能效果数组_V1(技能数据, 旧年限, 新年限);
    });
  });
}

function 清理到期炸环恢复标记_V1(新变量 = {}) {
  const 新数据 = 读取事件变量数据根_V1(新变量);
  const 当前tick = Math.max(0, Number(新数据?.world?.时间?.tick || 0));
  遍历数据魂环_V1(新数据, 魂环数据 => {
    if (!魂环数据 || typeof 魂环数据 !== 'object') return;
    const 恢复tick = Math.max(0, Number(魂环数据?.炸环恢复tick || 0));
    if (!(恢复tick > 0 && 恢复tick <= 当前tick)) return;
    delete 魂环数据.炸环恢复tick;
    if (Object.prototype.hasOwnProperty.call(魂环数据, '炸环恢复时间')) delete 魂环数据.炸环恢复时间;
  });
}

function 同步七九辅助魂技基础效果_V1(新变量 = {}) {
  const 新数据 = 读取事件变量数据根_V1(新变量);
  Object.values(新数据?.char || {}).forEach(角色数据 => {
    if (!角色数据 || typeof 角色数据 !== 'object') return;
    if (String(角色数据?.属性?.系别 || '').trim() !== '辅助系') return;
    Object.entries(角色数据?.武魂 || {}).forEach(([武魂键, 武魂数据]) => {
      if (!武魂数据 || typeof 武魂数据 !== 'object') return;
      const 武魂名称 = String(武魂数据?.表象名称 || 武魂键 || '').trim();
      if (!是否七九武魂名称_V1(武魂名称)) return;
      const 当前魂环数量 = Math.max(1, 计算武魂当前魂环数量_V1(武魂数据));
      const 应用到魂技表 = 魂技表 => {
        Object.values(魂技表 || {}).forEach(技能数据 => {
          if (!技能数据 || typeof 技能数据 !== 'object' || !Array.isArray(技能数据._效果数组)) return;
          应用七九辅助魂技基础效果_V1(技能数据._效果数组, { 当前魂环数量 });
        });
      };
      Object.values(武魂数据?.魂灵 || {}).forEach(魂灵数据 => {
        Object.values(魂灵数据?.魂环 || {}).forEach(魂环数据 => 应用到魂技表(魂环数据?.魂技));
      });
      Object.values(武魂数据?.独立魂环 || {}).forEach(魂环数据 => 应用到魂技表(魂环数据?.魂技));
    });
  });
}

function 扣减背包物品数量_V1(背包 = {}, 物品名 = '', 数量 = 1) {
  const 条目 = 背包?.[物品名];
  if (!条目 || typeof 条目 !== 'object') return false;
  const 当前数量 = Math.max(0, Number(条目.数量 || 0));
  if (当前数量 < 数量) return false;
  条目.数量 = 当前数量 - 数量;
  if (条目.数量 <= 0) delete 背包[物品名];
  return true;
}

function 是十万年灵物条目_V1(物品名 = '', 物品数据 = {}) {
  if (!物品数据 || typeof 物品数据 !== 'object') return false;
  if (!(Number(物品数据.数量 || 0) > 0)) return false;
  const 名称文本 = String(物品名 || '').trim();
  const 合并文本 = [
    名称文本,
    物品数据.类型,
    物品数据.品质,
    物品数据.品阶,
    物品数据.描述,
    ...(Array.isArray(物品数据.标签) ? 物品数据.标签 : []),
  ].join(' ');
  const 是十万年 = /十万年/.test(合并文本) || Number(物品数据.年限 || 0) >= 100000;
  const 是灵物 = /灵物|仙草|药草|绮罗郁金香/.test(合并文本) || String(物品数据.类型 || '').trim() === '灵物';
  return 是十万年 && 是灵物;
}

function 消耗七字武魂八十级突破材料_V1(char = {}) {
  const 背包 = char?.背包 && typeof char.背包 === 'object' ? char.背包 : {};
  if (扣减背包物品数量_V1(背包, '十万年绮罗郁金香', 1)) return { 成功: true, 材料: ['十万年绮罗郁金香'] };
  const 灵物列表 = Object.entries(背包)
    .filter(([物品名, 物品数据]) => 是十万年灵物条目_V1(物品名, 物品数据))
    .map(([物品名]) => 物品名);
  const 不同灵物 = Array.from(new Set(灵物列表)).slice(0, 3);
  if (不同灵物.length < 3) return { 成功: false, 材料: [] };
  不同灵物.forEach(物品名 => 扣减背包物品数量_V1(背包, 物品名, 1));
  return { 成功: true, 材料: 不同灵物 };
}

function 处理七字武魂八十级突破更新_V1(新变量 = {}, 旧变量 = {}) {
  const 新数据 = 读取事件变量数据根_V1(新变量);
  const 旧数据 = 读取事件变量数据根_V1(旧变量);
  Object.entries(新数据?.char || {}).forEach(([角色名, 角色数据]) => {
    if (!角色数据 || typeof 角色数据 !== 'object' || !角色存在七字武魂_V1(角色数据)) return;
    const 新等级 = Math.max(0, Number(角色数据?.属性?.等级 || 0));
    const 旧等级 = Math.max(0, Number(旧数据?.char?.[角色名]?.属性?.等级 || 0));
    if (!(旧等级 < 80 && 新等级 >= 80)) return;
    const 消耗结果 = 消耗七字武魂八十级突破材料_V1(角色数据);
    if (消耗结果.成功) {
      追加系统播报文本(新数据, `[七字武魂突破] ${角色名}消耗${消耗结果.材料.map(名称 => `【${名称}】`).join('、')}，突破 80 级门槛。`);
      return;
    }
    if (!角色数据.属性 || typeof 角色数据.属性 !== 'object') 角色数据.属性 = {};
    角色数据.属性.等级 = 79;
    追加系统播报文本(新数据, `[七字武魂瓶颈] ${角色名}缺少十万年绮罗郁金香或三种不同十万年灵物，等级上限暂卡在 79。`);
  });
}

async function 注册魂技年限与突破事件_V1() {
  try {
    if (globalThis.__LWCS_魂技年限事件已注册__) return;
    if (typeof waitGlobalInitialized === 'function') await waitGlobalInitialized('Mvu');
    const 事件名 = globalThis.Mvu?.events?.VARIABLE_UPDATE_ENDED || globalThis.window?.Mvu?.events?.VARIABLE_UPDATE_ENDED;
    const 监听函数 = typeof eventOn === 'function' ? eventOn : null;
    if (!事件名 || !监听函数) return;
    globalThis.__LWCS_魂技年限事件已注册__ = true;
    监听函数(事件名, (新变量, 旧变量) => {
      固化本轮魂环年限变化_V1(新变量, 旧变量);
      清理到期炸环恢复标记_V1(新变量);
      同步七九辅助魂技基础效果_V1(新变量);
      处理七字武魂八十级突破更新_V1(新变量, 旧变量);
    });
  } catch (错误) {
    console.warn('LWCS 魂技年限事件注册失败', 错误);
  }
}

$(() => {
  registerMvuSchema(Schema);
  注册魂技年限与突破事件_V1();
});






