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
  if (node.children) {
    for (const childName in node.children) {
      refreshFlatLocationsFromTree(node.children[childName], childName);
    }
  }
}

function calculateTravelResourceCost(method, distance, char = {}) {
  const stat = char.stat || {};
  const wealth = char.wealth || {};
  const equip = char.equip || {};
  const lv = Number(stat.lv || 0);
  const hasDoukai = Number(equip?.armor?.lv || 0) > 0 && String(equip?.armor?.equip_status || '未装备') === '已装备';
  const hasMecha =
    String(equip?.mech?.lv || '无') !== '无' && String(equip?.mech?.equip_status || '未装备') === '已装备';

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

  const curCoin = Number(wealth.fed_coin || 0);
  const curSp = Number(stat.sp || 0);
  const curVit = Number(stat.vit || 0);
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
    if (node.children) {
      Object.keys(node.children).forEach(childName => {
        visit(node.children[childName], childName, nextPath);
      });
    }
  };

  if (sd && sd.world && sd.world.locations) {
    Object.keys(sd.world.locations).forEach(locName => {
      visit(sd.world.locations[locName], locName, []);
    });
  }

  if (!found && sd && sd.world && sd.world.locations && safeTargetName.includes('-')) {
    const rawSegments = safeTargetName
      .split('-')
      .map(seg => String(seg || '').trim())
      .filter(Boolean);
    const pathSegments = rawSegments.filter(seg => seg !== '斗罗大陆' && seg !== '斗灵大陆');
    if (pathSegments.length >= 1) {
      let currentNode = sd.world.locations[pathSegments[0]];
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
            currentNode = currentNode?.children?.[seg];
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
  if (sd?.world?.dynamic_locations?.[locName]) {
    return isWorldMapId(sd.world.dynamic_locations[locName].map_id || 'map_douluo_world');
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
  if (safeAge >= 100000) return '红';
  if (safeAge >= 10000) return '黑';
  if (safeAge >= 1000) return '紫';
  if (safeAge >= 100) return '黄';
  return '白';
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

function calcYouthTalentRankScore(char) {
  if (!char) return -999999;

  const age = Number(char.stat?.age || 0);
  const lv = Number(char.stat?.lv || 0);
  const rep = Number(char.social?.reputation || 0);

  if (age >= 18 || rep < 500) return -999999;

  const talentBonusMap = {
    绝世妖孽: 120,
    顶级天才: 90,
    天才: 60,
    优秀: 30,
    正常: 0,
    劣等: -30,
  };

  const talentBonus = talentBonusMap[char.stat?.talent_tier] || 0;

  return Math.floor(rep / 100 + lv * 2 + talentBonus);
}

function isSoulBeastCharacter(char = {}) {
  return !!(Number(char?.stat?.age || 0) >= 10000 || char?.social?.factions?.['魂兽一族']);
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

const CONTINENT_RANK_NON_HUMAN_FACTIONS = new Set([
  '深渊位面',
  '魂兽一族',
  '星斗大森林',
  '极北之地',
  '无尽海域',
  '自然地带',
]);

function calcContinentRankScore(char, data) {
  if (!char) return -999999;

  if (!char.status?.alive) return -999999;

  const armorLv = Number(char.equip?.armor?.lv || 0);
  if (armorLv <= 0) return -999999;

  let armorBaseScore = 0;
  if (armorLv === 1) armorBaseScore = 1500;
  else if (armorLv === 2) armorBaseScore = 3500;
  else if (armorLv === 3) armorBaseScore = 6000;
  else if (armorLv >= 4) armorBaseScore = 8500;

  let maxFactionInf = 0;
  if (char.social?.factions) {
    _(char.social.factions).forEach((facData, facName) => {
      const orgInf = Number(data?.org?.[facName]?.inf || 0);
      if (orgInf > maxFactionInf) maxFactionInf = orgInf;
    });
  }
  const factionBonus = Math.floor((maxFactionInf * 8) / 1000);

  const rep = Number(char.social?.reputation || 0);
  const reputationBonus = Math.floor((rep * 11) / 100);
  const lvBonus = Math.floor(Number(char.stat?.lv || 0) * 95);

  return Math.floor(armorBaseScore + lvBonus + reputationBonus + factionBonus);
}

function autoBreakthrough(data) {
  _(data.char).forEach((c, charName) => {
    if (!c.status?.alive) return;
    const isBeast = isSoulBeastCharacter(c);
    if (isBeast) return;

    const currentLv = c.stat.lv;
    if (currentLv >= 100) return;

    const nextLvStats = getBaseStats(currentLv + 1);

    if (c.stat.sp_max >= nextLvStats.sp_max) {
      const coreCount = c.energy?.core?.数量 || 0;
      let maxLv = 69;
      if (coreCount === 1) maxLv = 89;
      else if (coreCount === 2) maxLv = 98;
      else if (coreCount >= 3) maxLv = 150;

      if (currentLv >= maxLv) return;

      c.stat.lv += 1;
      const newLv = c.stat.lv;

      if (newLv % 10 === 0) {
        const ringIndex = newLv / 10;
        const spiritKeys = Object.keys(c.spirit || {});
        if (spiritKeys.length === 0) return;

        const isPlayer = charName === data.sys?.player_name;
        const playerChar = data.char[data.sys?.player_name];
        const isSameNodeGroup = (c1, c2) => {
          if (!c1 || !c2) return false;
          const loc1 = c1.status?.loc || '';
          const loc2 = c2.status?.loc || '';
          if (loc1 && loc2 && loc1 === loc2) return true;
          const dyn = data.world?.dynamic_locations || {};
          const p1 = dyn[loc1]?.归属父节点 || loc1.split('-').slice(0, -1).join('-');
          const p2 = dyn[loc2]?.归属父节点 || loc2.split('-').slice(0, -1).join('-');
          return p1 && p2 && p1 === p2;
        };
        const isNearPlayer = !isPlayer && isSameNodeGroup(c, playerChar);

        spiritKeys.forEach(spiritKey => {
          const targetSpirit = c.spirit[spiritKey];
          if (!targetSpirit.soul_spirits) targetSpirit.soul_spirits = {};

          let ringAssigned = false;
          let candidateSpirit = null;

          _(targetSpirit.soul_spirits).forEach((ss, ssName) => {
            if (ringAssigned || candidateSpirit) return;

            let cap = 1;
            if (ss.年限 >= 10000) cap = 4;
            else if (ss.年限 >= 1000) cap = 3;
            else if (ss.年限 >= 100) cap = 2;

            const currentRingsCount = Object.keys(ss.rings || {}).length;

            if (currentRingsCount < cap) {
              candidateSpirit = { ss, ssName };
            }
          });

          if (candidateSpirit) {
            const { ss, ssName } = candidateSpirit;
            if (isPlayer) {
              if (!c.status) c.status = {};
              c.status.pending_ring_choice = {
                武魂槽位: spiritKey,
                候选魂灵: [ssName],
                待生成魂环位: ringIndex,
                状态: '待选择',
                来源: '修为突破',
              };
              ringAssigned = true;
              if (data.sys.rsn === '初始化' || !data.sys.rsn) data.sys.rsn = '';
              data.sys.rsn += ` [修为突破] ${charName} 踏入 ${newLv} 级！已达到第 ${ringIndex} 魂环门槛，当前魂灵【${ssName}】可继续衍生魂环，请决定是否立即生成。`;
            } else if (isNearPlayer && data.sys?.rsn !== '初始化') {
              ringAssigned = true;
              if (data.sys.rsn === '初始化' || !data.sys.rsn) data.sys.rsn = '';
              data.sys.rsn += ` [修为突破] ${charName} 踏入 ${newLv} 级！已达到第 ${ringIndex} 魂环门槛，但当前场景内请通过剧情决定其【${ssName}】是否为【${spiritKey}】衍生新魂环。`;
            } else {
              const newRingColor = getRingColorByAge(ss.年限);
              ss.rings[ringIndex.toString()] = {
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
              ss.rings[ringIndex.toString()].魂技 = buildDefaultRingSkillMap(ringIndex, ss.年限);
              ringAssigned = true;
              if (data.sys.rsn === '初始化' || !data.sys.rsn) data.sys.rsn = '';
              data.sys.rsn += ` [修为突破] ${charName} 踏入 ${newLv} 级！其【${ssName}】底蕴深厚，自动为【${spiritKey}】衍生出第 ${ringIndex} 个魂环！`;
            }
          }

          if (!ringAssigned) {
            let currentSpiritsCount = 0;
            _(c.spirit).forEach(sp => {
              currentSpiritsCount += Object.keys(sp.soul_spirits || {}).length;
            });
            const realmLimit =
              { 灵元境: 1, 灵通境: 2, 灵海境: 5, 灵渊境: 9, 灵域境: 99, 神元境: 999 }[
                c.stat._men_realm || c.stat.men_realm
              ] || 1;

            if (currentSpiritsCount >= realmLimit) {
              if (data.sys.rsn === '初始化' || !data.sys.rsn) data.sys.rsn = '';
              data.sys.rsn += ` [修为突破] ${charName} 踏入 ${newLv} 级！但精神力仅为【${c.stat._men_realm || c.stat.men_realm}】，无法承载更多魂灵，【${spiritKey}】暂缓附加魂环！`;
              return;
            }

            if (isPlayer) {
              if (data.sys.rsn === '初始化' || !data.sys.rsn) data.sys.rsn = '';
              data.sys.rsn += ` [修为突破] ${charName} 踏入 ${newLv} 级！达到魂环门槛，但当前未有可继续产环的魂灵，需通过剧情吸收新魂灵后方可附环。`;
              return;
            } else if (isNearPlayer) {
              if (data.sys.rsn === '初始化' || !data.sys.rsn) data.sys.rsn = '';
              data.sys.rsn += ` [修为突破] ${charName} 踏入 ${newLv} 级！达到魂环门槛，但当前场景内禁止后台立即生成新魂灵，请通过剧情处理。`;
              return;
            }

            return;
          }
        });
      }
    }
  });
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

function refreshContinentRanking(data) {
  if (!data.world.rankings) data.world.rankings = {};
  if (!data.world.rankings.continent_wind) {
    data.world.rankings.continent_wind = {
      _last榜单: {},
      _top100: {},
    };
  }

  const board = data.world.rankings.continent_wind;
  const oldRanks = { ...(board._last榜单 || {}) };
  const realCandidates = [];
  const seatCandidates = [];
  const factionCounts = {};
  const seatUsage = {};
  const tierConfigs = [
    { key: 'limit', label: '极限斗罗', lv: 99, armorLv: 4, repMultiplier: 1.2 },
    { key: 'super', label: '超级斗罗', lv: 95, armorLv: 3, repMultiplier: 1.0 },
    { key: 'title', label: '封号斗罗', lv: 90, armorLv: 2, repMultiplier: 0.85 },
  ];
  const orgEntries = Object.entries(data.org || {}).filter(
    ([orgName, orgData]) =>
      !CONTINENT_RANK_NON_HUMAN_FACTIONS.has(orgName) &&
      orgData &&
      typeof orgData === 'object' &&
      orgData.power_stats &&
      typeof orgData.power_stats === 'object',
  );
  const clearContinentTitles = char => {
    if (!char?.social?.titles || typeof char.social.titles !== 'object') return;
    delete char.social.titles['大陆风云榜'];
    _(Object.keys(char.social.titles)).forEach(k => {
      if (/^大陆风云榜第\d+名$/.test(k)) delete char.social.titles[k];
    });
  };
  const appendSeatCandidate = (orgName, orgData, tierConfig, seatIndex) => {
    const seatName = `【${orgName}】${tierConfig.label}第${seatIndex}席`;
    const repBase = Number(orgData?.inf || 0);
    const reputation = Math.max(0, Math.floor(repBase * tierConfig.repMultiplier) - (seatIndex - 1) * 120);
    const seatChar = {
      stat: { lv: tierConfig.lv },
      equip: { armor: { lv: tierConfig.armorLv } },
      social: {
        reputation,
        factions: { [orgName]: { 身份: tierConfig.label, 权限级: 5 } },
      },
      status: { alive: true },
    };
    const score = calcContinentRankScore(seatChar, data);
    if (score <= -999999) return;
    seatCandidates.push({
      source: 'seat',
      charName: seatName,
      score,
      orgName,
      tierKey: tierConfig.key,
      seatIndex,
    });
  };

  _(data.char).forEach((char, charName) => {
    const score = calcContinentRankScore(char, data);
    if (score <= -999999) {
      clearContinentTitles(char);
      return;
    }
    realCandidates.push({ source: 'real', charName, score });

    if (!char.status?.alive || !char.social?.factions || typeof char.social.factions !== 'object') return;
    const lv = Number(char.stat?.lv || 0);
    Object.keys(char.social.factions).forEach(orgName => {
      if (!orgName || CONTINENT_RANK_NON_HUMAN_FACTIONS.has(orgName)) return;
      if (!factionCounts[orgName]) factionCounts[orgName] = { limit: 0, super: 0, title: 0 };
      if (lv >= 99) factionCounts[orgName].limit += 1;
      else if (lv >= 95) factionCounts[orgName].super += 1;
      else if (lv >= 90) factionCounts[orgName].title += 1;
    });
  });

  orgEntries.forEach(([orgName, orgData]) => {
    const current = factionCounts[orgName] || { limit: 0, super: 0, title: 0 };
    const target = {
      limit: Math.max(0, Number(orgData.power_stats.limit_douluo || 0)),
      super: Math.max(0, Number(orgData.power_stats.super_douluo || 0)),
      title: Math.max(0, Number(orgData.power_stats.title_douluo || 0)),
    };
    if (!seatUsage[orgName]) seatUsage[orgName] = { limit: 0, super: 0, title: 0 };
    tierConfigs.forEach(tierConfig => {
      const deficit = Math.max(0, Number(target[tierConfig.key] || 0) - Number(current[tierConfig.key] || 0));
      for (let i = 0; i < deficit; i += 1) {
        seatUsage[orgName][tierConfig.key] += 1;
        appendSeatCandidate(orgName, orgData, tierConfig, seatUsage[orgName][tierConfig.key]);
      }
    });
  });

  const weightedFactions = orgEntries
    .map(([orgName, orgData]) => {
      const ps = orgData?.power_stats || {};
      const weight = Math.max(
        1,
        Number(ps.limit_douluo || 0) * 6 + Number(ps.super_douluo || 0) * 3 + Number(ps.title_douluo || 0),
      );
      return { orgName, orgData, weight };
    })
    .sort((a, b) => b.weight - a.weight || Number(b.orgData?.inf || 0) - Number(a.orgData?.inf || 0));

  let extraCursor = 0;
  let extraGuard = 0;
  while (realCandidates.length + seatCandidates.length < 100 && weightedFactions.length > 0 && extraGuard < 5000) {
    extraGuard += 1;
    const picked = weightedFactions[extraCursor % weightedFactions.length];
    extraCursor += 1;
    if (!picked) break;
    if (!seatUsage[picked.orgName]) seatUsage[picked.orgName] = { limit: 0, super: 0, title: 0 };
    const usage = seatUsage[picked.orgName];
    let tierKey = 'title';
    if (usage.limit <= usage.super && usage.limit <= usage.title) tierKey = 'limit';
    else if (usage.super <= usage.title) tierKey = 'super';
    const tierConfig = tierConfigs.find(item => item.key === tierKey) || tierConfigs[2];
    usage[tierKey] += 1;
    appendSeatCandidate(picked.orgName, picked.orgData, tierConfig, usage[tierKey]);
  }

  const rankedCandidates = realCandidates
    .concat(seatCandidates)
    .sort(
      (a, b) =>
        b.score - a.score ||
        String(a.charName).localeCompare(String(b.charName), 'zh-Hans-CN', { numeric: true, sensitivity: 'base' }),
    );

  const top100 = rankedCandidates.slice(0, 100);
  const newRanks = {};
  const broadcastMsgs = [];

  top100.forEach((entry, idx) => {
    if (entry.source !== 'real') return;
    const rank = idx + 1;
    newRanks[entry.charName] = rank;
    const c = data.char[entry.charName];
    if (!c) return;

    if (!c.social || typeof c.social !== 'object') c.social = {};
    if (!c.social.titles) c.social.titles = {};
    _(Object.keys(c.social.titles)).forEach(k => {
      if (/^大陆风云榜第\d+名$/.test(k)) delete c.social.titles[k];
    });

    const wasOnBoard = !!oldRanks[entry.charName];
    const oldRank = oldRanks[entry.charName] || null;

    c.social.titles['大陆风云榜'] = { 来源: '传灵塔评定', 声望加成: 0 };
    c.social.titles[`大陆风云榜第${rank}名`] = { 来源: '传灵塔评定', 声望加成: 0 };

    if (!wasOnBoard) {
      broadcastMsgs.push(`[风云震动] ${entry.charName} 强势杀入【大陆风云榜第${rank}名】！`);
    } else {
      const diff = oldRank - rank;
      if (diff >= 5) {
        broadcastMsgs.push(`[风云异动] ${entry.charName} 排名飙升至【大陆风云榜第${rank}名】！`);
      }
    }
  });

  realCandidates.forEach(entry => {
    if (newRanks[entry.charName]) return;
    clearContinentTitles(data.char?.[entry.charName]);
  });

  _(oldRanks).forEach((oldRank, charName) => {
    if (!newRanks[charName] && data.char[charName]) {
      const c = data.char[charName];
      clearContinentTitles(c);
      if (!c.status?.alive) {
        broadcastMsgs.push(`[巨星陨落] 原风云榜第${oldRank}名 ${charName} 确认死亡，已从榜单除名！`);
      } else {
        broadcastMsgs.push(`[风云跌落] ${charName} 已遗憾跌出【大陆风云榜】。`);
      }
    }
  });

  board._top100 = _(top100)
    .map((entry, idx) => [String(idx + 1), { 角色名: entry.charName, 评分: entry.score }])
    .fromPairs()
    .value();
  board._last榜单 = newRanks;

  if (broadcastMsgs.length > 0) {
    data.sys.rsn = broadcastMsgs.slice(0, 3).join(' ');
  }
}
function refreshYouthTalentRanking(data) {
  if (!data.world.rankings) data.world.rankings = {};
  if (!data.world.rankings.youth_talent) {
    data.world.rankings.youth_talent = {
      _last榜单: {},
      _top30: {},
    };
  }

  const board = data.world.rankings.youth_talent;
  const oldRanks = { ...(board._last榜单 || {}) };

  const candidates = [];

  const currentTick = data.world.time.tick;
  const isYear7 = currentTick >= 367920 && currentTick < 420480;

  const fixedRanks = isYear7
    ? {
        舞丝朵: 9,
        龙尘: 10,
        骆桂星: 17,
        徐愉程: 19,
        杨念夏: 27,
        郑怡然: 30,
      }
    : {};

  _(data.char).forEach((char, charName) => {
    const score = calcYouthTalentRankScore(char);
    if (score <= -999999) {
      if (char.social?.titles) {
        delete char.social.titles['少年天才榜'];
        _(Object.keys(char.social.titles)).forEach(k => {
          if (/^少年天才榜第\d+名$/.test(k)) delete char.social.titles[k];
        });
      }
      return;
    }

    candidates.push({
      charName,
      score,
      reputation: Number(char.social?.reputation || 0),
      lv: Number(char.stat?.lv || 0),
    });
  });

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.reputation !== a.reputation) return b.reputation - a.reputation;
    return b.lv - a.lv;
  });

  const top30Array = new Array(30).fill(null);

  const fixedCandidates = candidates.filter(c => fixedRanks[c.charName]);

  fixedCandidates.sort((a, b) => fixedRanks[a.charName] - fixedRanks[b.charName]);

  fixedCandidates.forEach(c => {
    let targetIdx = fixedRanks[c.charName] - 1;

    while (targetIdx < 30 && top30Array[targetIdx] !== null) {
      targetIdx++;
    }

    if (targetIdx < 30) {
      top30Array[targetIdx] = c;
    }
  });

  const normalCandidates = candidates.filter(c => !fixedRanks[c.charName]);
  let normalIdx = 0;
  for (let i = 0; i < 30; i++) {
    if (top30Array[i] === null && normalIdx < normalCandidates.length) {
      top30Array[i] = normalCandidates[normalIdx++];
    }
  }

  const top30 = top30Array.filter(c => c !== null);

  const newRanks = {};
  const broadcastMsgs = [];

  top30.forEach((entry, idx) => {
    const rank = idx + 1;
    newRanks[entry.charName] = rank;

    const c = data.char[entry.charName];
    if (!c.social.titles) c.social.titles = {};

    _(Object.keys(c.social.titles)).forEach(k => {
      if (/^少年天才榜第\d+名$/.test(k)) delete c.social.titles[k];
    });

    const wasOnBoard = !!oldRanks[entry.charName];
    const oldRank = oldRanks[entry.charName] || null;

    c.social.titles['少年天才榜'] = { 来源: '传灵塔评定', 声望加成: 0 };
    c.social.titles[`少年天才榜第${rank}名`] = { 来源: '传灵塔评定', 声望加成: 0 };

    if (!wasOnBoard) {
      broadcastMsgs.push(`[榜单收录] ${entry.charName} 以 ${entry.score} 分跻身【少年天才榜第${rank}名】！`);
    } else {
      const diff = oldRank - rank;
      if (diff >= 3) {
        broadcastMsgs.push(`[榜单异动] ${entry.charName} 排名飙升至【少年天才榜第${rank}名】！`);
      } else if (diff <= -3) {
        broadcastMsgs.push(`[榜单异动] ${entry.charName} 下滑至【少年天才榜第${rank}名】。`);
      }
    }
  });

  _(oldRanks).forEach((oldRank, charName) => {
    if (!newRanks[charName] && data.char[charName]) {
      const c = data.char[charName];
      if (c.social?.titles) {
        delete c.social.titles['少年天才榜'];
        _(Object.keys(c.social.titles)).forEach(k => {
          if (/^少年天才榜第\d+名$/.test(k)) delete c.social.titles[k];
        });
      }
      broadcastMsgs.push(`[榜单跌落] ${charName} 已跌出【少年天才榜】。`);
    }
  });

  board._top30 = _(top30)
    .map((entry, idx) => [String(idx + 1), { 角色名: entry.charName, 评分: entry.score }])
    .fromPairs()
    .value();

  board._last榜单 = newRanks;

  if (broadcastMsgs.length > 0) {
    data.sys.rsn = broadcastMsgs.join(' ');
  }
}

function checkDestinyAnchors(data, currentTick) {
  if (!data.world.flags) data.world.flags = {};

  if (currentTick >= 367920 && !data.world.flags['anchor_year_7_youth_talent']) {
    const anchors = {
      舞丝朵: { age: 14, lv: 41, rep: 4500, faction: '史莱克学院' },
      龙尘: { age: 14, lv: 42, rep: 4000, faction: '日月皇家魂导师学院' },
      骆桂星: { age: 13, lv: 38, rep: 3000, faction: '史莱克学院' },
      徐愉程: { age: 13, lv: 41, rep: 2500, faction: '史莱克学院' },
      杨念夏: { age: 13, lv: 37, rep: 1500, faction: '史莱克学院' },
      郑怡然: { age: 13, lv: 36, rep: 1000, faction: '史莱克学院' },
    };
    let triggered = false;
    _(anchors).forEach((target, name) => {
      if (data.char[name]) {
        const c = data.char[name];
        c.stat.age = target.age;
        c.stat.lv = Math.max(c.stat.lv, target.lv);
        c.social.reputation = target.rep;

        if (!c.social.factions) c.social.factions = {};
        c.social.factions[target.faction] = { 身份: '外院学生', 权限级: 1 };
        triggered = true;
      }
    });

    if (triggered) {
      data.sys.rsn = `[命运锚点] 世界线收束！第七年时间锁触发，核心天才数据已强制校准。`;
      refreshYouthTalentRanking(data);
      refreshContinentRanking(data);
    }

    autoBreakthrough(data);

    data.world.flags['anchor_year_7_youth_talent'] = true;
  }
}

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
  增益类: ['单属性增益', '多属性增益', '全属性增益', '消耗降低', '前摇缩短', '掌控提升', '速度提升'],
  防御类: ['护盾', '减伤', '格挡/抵消', '霸体', '免死/锁血'],
  回复类: ['体力恢复', '魂力恢复', '精神恢复', '持续恢复', '净化/解控'],
  '感知/认知类': ['感知干扰', '标记锁定', '共享视野', '幻境', '催眠', '认知扭曲'],
  位移类: ['自身位移', '强制位移', '位移交换', '追击位移', '脱离位移'],
  特殊规则类: ['分身', '复制', '反制', '转化', '状态交换', '强制绑定/锁定', '条件触发', '规则改写'],
};

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
  伤害类: ['穿透', '吸血', '斩杀补伤', '流血DOT', '打断', '反击'],
  控制类: ['打断', '沉默', '减速', '致盲', '迟缓', '禁疗'],
  削弱类: ['禁疗', '减速', '迟缓', '标记弱点'],
  增益类: ['小护盾', '净化', '解控', '共享视野'],
  防御类: ['小护盾', '反击', '净化', '解控'],
  回复类: ['净化', '解控', '小护盾', '魂力恢复', '精神恢复'],
  '感知/认知类': ['标记弱点', '共享视野', '打断', '沉默'],
  位移类: ['打断', '反击', '标记弱点'],
  特殊规则类: ['共享视野', '标记弱点', '净化'],
};

const SOUL_SPIRIT_SECONDARY_OPTIONS_V1 = Array.from(new Set(Object.values(SKILL_SECONDARY_BY_MAIN_V1).flat())).sort();

function getSecondaryGenerationChance(grade = 'B', ringIndex = 1) {
  const ring = Math.max(1, Number(ringIndex || 1));
  if (ring < 3) return 0;
  const bucket = ring >= 9 ? '9+' : String(ring);
  const table = {
    C: { 3: 0, 4: 0, 5: 0, 6: 2, 7: 5, 8: 8, '9+': 12 },
    B: { 3: 3, 4: 5, 5: 8, 6: 12, 7: 18, 8: 25, '9+': 32 },
    A: { 3: 6, 4: 10, 5: 14, 6: 20, 7: 28, 8: 36, '9+': 45 },
    S: { 3: 10, 4: 14, 5: 20, 6: 28, 7: 38, 8: 50, '9+': 58 },
  };
  return table[String(grade || 'B').toUpperCase()]?.[bucket] || 0;
}

function getSecondaryDoubleChance(grade = 'B', ringIndex = 1) {
  const ring = Math.max(1, Number(ringIndex || 1));
  if (ring < 7) return 0;
  const bucket = ring >= 9 ? '9+' : String(ring);
  const table = {
    C: { 7: 0, 8: 0, '9+': 2 },
    B: { 7: 0, 8: 2, '9+': 4 },
    A: { 7: 5, 8: 8, '9+': 12 },
    S: { 7: 8, 8: 12, '9+': 18 },
  };
  return table[String(grade || 'B').toUpperCase()]?.[bucket] || 0;
}

function getSecondaryMutationChance(grade = 'B', ringIndex = 1) {
  const ring = Math.max(1, Number(ringIndex || 1));
  if (ring < 7) return 0;
  const bucket = ring >= 9 ? '9+' : String(ring);
  const table = {
    C: { 7: 0, 8: 0, '9+': 1 },
    B: { 7: 0, 8: 1, '9+': 2 },
    A: { 7: 2, 8: 3, '9+': 5 },
    S: { 7: 3, 8: 5, '9+': 8 },
  };
  return table[String(grade || 'B').toUpperCase()]?.[bucket] || 0;
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

function getPotentialSecondaryOptionsByType(type = '强攻系') {
  const mainTable = SKILL_MAIN_MECHANIC_DISTRIBUTION_V1[type] || SKILL_MAIN_MECHANIC_DISTRIBUTION_V1['强攻系'] || [];
  const mains = Array.from(new Set(mainTable.map(item => item?.main).filter(Boolean)));
  return Array.from(new Set(mains.flatMap(main => SKILL_SECONDARY_BY_MAIN_V1[main] || []))).sort();
}

function buildSoulSpiritSecondaryDefaultValue(type = '强攻系', ringIndex = 1) {
  if (getSecondaryGenerationChance('S', ringIndex) <= 0) return ['无'];
  const options = getPotentialSecondaryOptionsByType(type);
  if (!options.length) return [AI_TODO_SOUL_SPIRIT_SECONDARY];
  return [AI_TODO_SOUL_SPIRIT_SECONDARY.replace('）', `：${options.join(' / ')}）`)];
}

function normalizeSoulSpiritSecondaryCandidates(currentValue, type = '强攻系', ringIndex = 1) {
  const current = Array.isArray(currentValue) ? currentValue.map(v => String(v || '').trim()).filter(Boolean) : [];
  const valid = current.filter(option => SOUL_SPIRIT_SECONDARY_OPTIONS_V1.includes(option));
  if (valid.length > 0) return valid;
  const shouldAutofill =
    current.length === 0 || current.every(text => text === '无' || isAiTodoText(text) || /^待补全/.test(text));
  return shouldAutofill ? buildSoulSpiritSecondaryDefaultValue(type, ringIndex) : current;
}

function hasPendingSecondaryTodoCandidates(currentValue) {
  const current = Array.isArray(currentValue) ? currentValue.map(v => String(v || '').trim()).filter(Boolean) : [];
  if (!current.length) return false;
  return current.some(text => text !== '无' && (isAiTodoText(text) || /^待补全/.test(text)));
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

function judgeSkillGrade(talentTier, ringAge, ringIndex, compatibility = 100) {
  const roll = Math.floor(Math.random() * 100) + 1;
  const talentScore = { 绝世妖孽: 100, 顶级天才: 80, 天才: 60, 优秀: 40, 正常: 20, 劣等: 0 }[talentTier] || 20;
  const ageScore = ringAge >= 100000 ? 100 : ringAge >= 10000 ? 50 : ringAge >= 1000 ? 20 : ringAge >= 100 ? 0 : -20;
  let compScore = 0;
  if (compatibility >= 90) compScore = 20;
  else if (compatibility >= 70) compScore = 0;
  else if (compatibility >= 40) compScore = -30;
  else compScore = -60;
  const totalScore = roll + talentScore + ageScore + Number(ringIndex || 1) * 5 + compScore;
  const grade = totalScore >= 250 ? 'S' : totalScore >= 151 ? 'A' : totalScore >= 60 ? 'B' : 'C';
  return {
    grade,
    totalScore,
    quality: { C: 'C级_劣质', B: 'B级_普通', A: 'A级_优秀', S: 'S级_极品' }[grade],
    scoreRoll: roll,
  };
}

function rollMainMechanicByGrade(type, grade, roll) {
  const table = SKILL_MAIN_MECHANIC_DISTRIBUTION_V1[type] || SKILL_MAIN_MECHANIC_DISTRIBUTION_V1['强攻系'];
  const gradeCap = { C: 80, B: 90, A: 100, S: 100 }[grade] || 100;
  const effectiveRoll = Math.min(Math.max(1, roll), gradeCap);
  return table.find(item => effectiveRoll >= item.min && effectiveRoll <= item.max)?.main || '伤害类';
}

function rollSubModelByGrade(mainMechanic, grade, roll) {
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
      C: [
        { value: '护盾', weight: 60 },
        { value: '减伤', weight: 30 },
        { value: '格挡/抵消', weight: 10 },
      ],
      B: [
        { value: '护盾', weight: 40 },
        { value: '减伤', weight: 25 },
        { value: '格挡/抵消', weight: 15 },
        { value: '霸体', weight: 15 },
        { value: '免死/锁血', weight: 5 },
      ],
      A: [
        { value: '护盾', weight: 30 },
        { value: '减伤', weight: 25 },
        { value: '格挡/抵消', weight: 20 },
        { value: '霸体', weight: 15 },
        { value: '免死/锁血', weight: 10 },
      ],
      S: [
        { value: '护盾', weight: 20 },
        { value: '减伤', weight: 20 },
        { value: '格挡/抵消', weight: 20 },
        { value: '霸体', weight: 15 },
        { value: '免死/锁血', weight: 25 },
      ],
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
      C: [
        { value: '条件触发', weight: 70 },
        { value: '分身', weight: 30 },
      ],
      B: [
        { value: '分身', weight: 20 },
        { value: '条件触发', weight: 30 },
        { value: '强制绑定/锁定', weight: 20 },
        { value: '反制', weight: 15 },
        { value: '转化', weight: 15 },
      ],
      A: [
        { value: '分身', weight: 15 },
        { value: '复制', weight: 12 },
        { value: '反制', weight: 18 },
        { value: '转化', weight: 12 },
        { value: '状态交换', weight: 12 },
        { value: '强制绑定/锁定', weight: 12 },
        { value: '条件触发', weight: 9 },
        { value: '规则改写', weight: 10 },
      ],
      S: [
        { value: '分身', weight: 15 },
        { value: '复制', weight: 12 },
        { value: '反制', weight: 18 },
        { value: '转化', weight: 10 },
        { value: '状态交换', weight: 13 },
        { value: '强制绑定/锁定', weight: 10 },
        { value: '条件触发', weight: 7 },
        { value: '规则改写', weight: 15 },
      ],
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
  const table = tables[mainMechanic]?.[grade] || [
    { value: SKILL_ARCHETYPE_POOL_V1[mainMechanic]?.[0] || '无', weight: 100 },
  ];
  return rollWeightedBucket(table, roll) || table[0]?.value || '无';
}

function rollTargetModelByGrade(mainMechanic, grade, roll, subModel = '', type = '') {
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
  else if (mainMechanic === '感知/认知类') tableSet = subModel === '共享视野' ? cognitiveShared : cognitiveHostile;
  else if (mainMechanic === '特殊规则类' && subModel === '分身') tableSet = support;
  else if (mainMechanic === '特殊规则类') tableSet = special;
  else if (mainMechanic === '位移类') tableSet = mobility;
  return rollWeightedBucket(tableSet[grade] || tableSet.C, roll) || '敌方单体';
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

function rollExtraMechanics(main, grade, ringIndex, preferredSecondary = []) {
  const secondaryPool = SKILL_SECONDARY_BY_MAIN_V1[main] || [];
  const preferredPool = (preferredSecondary || []).filter(item => secondaryPool.includes(item));
  const effectivePool = preferredPool.length > 0 ? preferredPool : secondaryPool;
  let secondary = [];
  let mutation = [];
  const secondaryChance = getSecondaryGenerationChance(grade, ringIndex);
  const doubleChance = getSecondaryDoubleChance(grade, ringIndex);
  const mutationChance = getSecondaryMutationChance(grade, ringIndex);
  if (effectivePool.length > 0 && Math.random() * 100 < secondaryChance) {
    const count = Math.random() * 100 < doubleChance ? 2 : 1;
    secondary = pickUniqueRandom(effectivePool, count);
  }
  if (secondary.length > 0 && Math.random() * 100 < mutationChance)
    mutation = pickUniqueRandom(SKILL_MUTATION_MECHANIC_TYPES_V1, 1);
  return { secondary, mutation };
}

function rollSkillBlueprint(type, grade, ringIndex, preferredSecondary = []) {
  const mainRoll = Math.floor(Math.random() * 100) + 1;
  const main = rollMainMechanicByGrade(type, grade, mainRoll);
  const subRoll = Math.floor(Math.random() * 100) + 1;
  const subModel = rollSubModelByGrade(main, grade, subRoll);
  const targetRoll = Math.floor(Math.random() * 100) + 1;
  const targetModel = rollTargetModelByGrade(main, grade, targetRoll, subModel, type);
  const attrRoll = Math.floor(Math.random() * 100) + 1;
  const attrHints = rollAttributeDirectionByType(type, subModel, attrRoll);
  const extra = rollExtraMechanics(main, grade, ringIndex, preferredSecondary);
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
    _主机制骰: mainRoll,
    _子模型骰: subRoll,
    _目标模型骰: targetRoll,
    _属性方向骰: attrRoll,
  };
}

function buildSkillBattleSummary(blueprint) {
  const main = blueprint?.主机制大类 || '伤害类';
  const archetype = blueprint?.主机制原型 || '单体伤害';
  const delivery = blueprint?.释放形态 || '直接生效';
  const secondary = Array.isArray(blueprint?.副机制) ? blueprint.副机制 : [];
  const mutation = Array.isArray(blueprint?.变异机制) ? blueprint.变异机制 : [];
  const targetModel = blueprint?.目标模型 || '敌方单体';

  const summary = {
    目标规模: '单体',
    生效方式: '直接',
    爆发级别: '中',
    持续性: '无',
    风险等级: '中',
    控制强度: '无',
    回复性质: '无',
    防御性质: '无',
    协同性: '低',
    保留倾向: 0,
  };

  if (targetModel.includes('群体')) summary.目标规模 = '群体';
  else if (targetModel === '全场') summary.目标规模 = '全场';
  else if (targetModel === '自身') summary.目标规模 = '自身';
  else summary.目标规模 = '单体';

  const deliveryMap = {
    直接生效: '直接',
    自身附体: '直接',
    远程命中: '直接',
    范围展开: '持续',
    召唤承载: '触发',
    造物承载: '触发',
    标记触发: '触发',
    延迟触发: '延迟',
  };
  summary.生效方式 = deliveryMap[delivery] || '直接';

  if (['延迟爆发', '规则改写', '复制', '反制', '免死/锁血'].includes(archetype)) summary.爆发级别 = '高';
  else if (['单体伤害', '群体伤害', '多段伤害', '硬控', '全属性增益', '掌控提升', '掌控压制'].includes(archetype))
    summary.爆发级别 = '中';
  else summary.爆发级别 = '低';

  if (['持续伤害', '持续恢复', '范围展开', '分身'].includes(archetype) || ['延迟触发', '范围展开'].includes(delivery))
    summary.持续性 = '中';
  if (delivery === '范围展开') summary.持续性 = '长';

  if (['硬控'].includes(archetype)) summary.控制强度 = '硬控';
  else if (
    ['软控', '位移限制', '节奏打断', '前摇拉长', '掌控压制', '感知干扰', '幻境', '催眠', '认知扭曲'].includes(
      archetype,
    ) ||
    secondary.some(s => ['打断', '沉默', '减速', '致盲', '迟缓', '禁疗'].includes(s))
  )
    summary.控制强度 = '软控';

  if (['体力恢复', '魂力恢复', '精神恢复'].includes(archetype)) summary.回复性质 = '瞬回';
  else if (['持续恢复'].includes(archetype)) summary.回复性质 = '持续';
  else if (['净化/解控'].includes(archetype) || secondary.some(s => ['净化', '解控'].includes(s)))
    summary.回复性质 = '净化';

  if (['护盾'].includes(archetype) || secondary.includes('小护盾')) summary.防御性质 = '护盾';
  else if (['减伤'].includes(archetype)) summary.防御性质 = '减伤';
  else if (['霸体'].includes(archetype)) summary.防御性质 = '霸体';
  else if (['分身'].includes(archetype)) summary.防御性质 = '分身';
  else if (['免死/锁血'].includes(archetype)) summary.防御性质 = '免死';

  if (
    ['共享视野', '标记锁定', '多属性增益', '全属性增益', '掌控提升', '速度提升', '消耗降低'].includes(
      archetype,
    ) ||
    secondary.some(s => ['标记弱点', '共享视野'].includes(s))
  )
    summary.协同性 = '高';
  else if (['单属性增益', '感知干扰', '反制', '分身'].includes(archetype)) summary.协同性 = '中';

  if (['延迟爆发', '条件触发', '规则改写', '复制', '反制'].includes(archetype)) summary.保留倾向 = 50;
  if (['免死/锁血', '格挡/抵消'].includes(archetype)) summary.保留倾向 = 65;
  if (mutation.length > 0) summary.保留倾向 = Math.max(summary.保留倾向, 40);

  summary.风险等级 = '中';
  if (['免死/锁血', '规则改写', '复制', '反制'].includes(archetype)) summary.风险等级 = '高';
  if (mutation.some(m => ['自残换收益', '效果反转', '随机目标', '高波动随机值'].includes(m))) summary.风险等级 = '高';
  if (['体力恢复', '魂力恢复', '精神恢复', '护盾', '单属性增益'].includes(archetype) && mutation.length === 0)
    summary.风险等级 = '低';

  return summary;
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
    if (['属性变化', '持续恢复', '消耗修正', '前摇修正', '掌控修正', '速度修正'].includes(mechanism)) {
      const property = String(effect.属性 || '').trim();
      const action = String(effect.动作 || '').trim();
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
        type: /倍率压制|消耗提高|前摇拉长/.test(action) ? 'debuff' : 'buff',
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

  const powerMap = { C级_劣质: 60, B级_普通: 120, A级_优秀: 200, S级_极品: 300 };
  const castMap = { C级_劣质: [0, 8], B级_普通: [5, 15], A级_优秀: [15, 30], S级_极品: [30, 55] };
  const powerBase = powerMap[quality] || 120;
  const castRange = castMap[quality] || [5, 15];
  const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  const randomRangeRaw = (min, max) => (min === max ? min : min + Math.random() * (max - min));
  const grade = { C级_劣质: 'C', B级_普通: 'B', A级_优秀: 'A', S级_极品: 'S' }[quality] || 'B';
  const gradeFactor = { C: 1, B: 2, A: 3, S: 4 }[grade] || 2;
  const secondaryEffectScale = getSecondaryRingScale(ringIndex);
  const secondaryDurationScale = Math.max(0.7, secondaryEffectScale);
  const randomInRange = table => {
    const [min, max] = table?.[grade] || table?.B || [1, 1];
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

  const combat = {
    技能类型: '输出',
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
          resource_block_ratio: 0,
          min_hp_floor: 0,
          death_save_count: 0,
          cost_ratio: 1.0,
          windup_ratio: 1.0,
          mastery_ratio: 1.0,
          speed_ratio: 1.0,
        },
      },
      召唤与场地模块: { 实体名称: '无', 持续回合: 0, 继承属性比例: 0, 核心机制描述: '无' },
    },
  };

  const clash = combat.仲裁逻辑.瞬间交锋模块;
  const state = combat.仲裁逻辑.状态挂载模块;
  const field = combat.仲裁逻辑.召唤与场地模块;
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
    combat.技能类型 = '输出';
    clash.基础威力倍率 = Math.round(powerBase * targetFactor);
    clash.伤害类型 = getDamageType();
    if (archetype === '多段伤害') clash.基础威力倍率 = Math.round(powerBase * 0.85);
    if (archetype === '延迟爆发') {
      combat.cast_time += 10;
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
    combat.技能类型 = '控制';
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
    combat.技能类型 = '控制';
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
    combat.技能类型 = '辅助';
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
    combat.技能类型 = '防御';
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
    if (targetFactor < 1) state.持续回合 = Math.max(1, Math.round(state.持续回合 * Math.max(0.8, targetFactor)));
  } else if (main === '回复类') {
    combat.技能类型 = '辅助';
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
    combat.技能类型 = '辅助';
    state.状态名称 = archetype;
    state.持续回合 = 2;
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
    if (archetype === '认知扭曲') state.特殊机制标识 = '认知扭曲';
  } else if (main === '位移类') {
    combat.技能类型 = '辅助';
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
    combat.技能类型 = '辅助';
    state.状态名称 = archetype;
    state.持续回合 = 2;
    state.特殊机制标识 = archetype;
    if (archetype === '强制绑定/锁定') {
      combat.技能类型 = '控制';
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
      combat.技能类型 = '防御';
      state.持续回合 = { C: 1, B: 2, A: 2, S: 3 }[grade] || 2;
      state.计算层效果.counter_attack_ratio = Number(
        randomInRange({ C: [0.35, 0.5], B: [0.5, 0.75], A: [0.75, 1.0], S: [1.0, 1.25] }).toFixed(2),
      );
      state.计算层效果.damage_reduction = Number(
        randomInRange({ C: [0.08, 0.12], B: [0.12, 0.18], A: [0.18, 0.25], S: [0.25, 0.35] }).toFixed(2),
      );
    }
    if (archetype === '条件触发') {
      combat.技能类型 = '输出';
      state.持续回合 = 0;
      state.计算层效果.final_damage_mult = Number(
        randomInRange({ C: [1.1, 1.18], B: [1.18, 1.28], A: [1.28, 1.42], S: [1.42, 1.6] }).toFixed(2),
      );
      state.计算层效果.hit_bonus = Number(
        randomInRange({ C: [0.03, 0.05], B: [0.05, 0.08], A: [0.08, 0.12], S: [0.12, 0.18] }).toFixed(2),
      );
    }
    if (archetype === '转化') {
      combat.技能类型 = '输出';
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
    if (archetype === '复制') {
      combat.技能类型 = '辅助';
      state.持续回合 = { C: 1, B: 2, A: 2, S: 3 }[grade] || 2;
      state.特殊机制标识 = [state.特殊机制标识, '复制增益'].filter(v => v && v !== '无').join('/') || '复制增益';
    }
    if (archetype === '分身') {
      combat.技能类型 = '辅助';
      combat.对象 = '自身';
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
      combat.技能类型 = '辅助';
      state.持续回合 = 0;
      state.特殊机制标识 = [state.特殊机制标识, '状态交换'].filter(v => v && v !== '无').join('/') || '状态交换';
    }
    if (archetype === '规则改写') {
      combat.技能类型 = '输出';
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
  if (secondary.includes('目标锁定'))
    state.特殊机制标识 = [state.特殊机制标识, `目标锁定:${{ C: 1, B: 2, A: 2, S: 3 }[grade] || 1}回合`]
      .filter(v => v && v !== '无')
      .join('/');
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

  const baseCost = 60 + ringIndex * 20;
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
  combat.消耗 =
    [`魂力:${spCost}`, vitCost > 0 ? `体力:${vitCost}` : '', menCost > 0 ? `精神力:${menCost}` : '']
      .filter(Boolean)
      .join(' | ') || '无';

  if (delivery === '延迟触发') combat.cast_time += 8;
  if (delivery === '范围展开') combat.cast_time += 5;
  if (delivery === '自身附体') combat.cast_time = Math.max(0, combat.cast_time - 5);

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

  return combat;
}

function isSkillTodoText(text) {
  const value = String(text || '').trim();
  return !value || value === '未知' || /待补全|待补充|TODO/i.test(value);
}

function clonePackedSkillEffects(effects) {
  return JSON.parse(JSON.stringify(Array.isArray(effects) ? effects : []));
}

const SKILL_DSL_VERSION = 'v1';
const SKILL_DSL_LEGACY_FIELD_KEYS = Object.freeze([
  '画面描述',
  '效果描述',
  '附带属性',
  '_效果数组',
  '属性来源',
  '魂技作用',
  '属性系数',
  '元素构型',
  '五行调用结构',
  '极性信息',
  '元素',
  '技能类型',
  '对象',
  '加成属性',
  '特效量化参数',
]);
const SKILL_DSL_SOFT_RULES = Object.freeze([
  '五行相关需先集齐金木水火土',
  '元素剥离需先具备水火风土',
  '七元素爆裂需先具备水火风土光暗空间',
]);

function createEmptySkillDsl() {
  return {
    version: SKILL_DSL_VERSION,
    primitives: [],
    flow: [],
    gates: {
      mode: 'soft',
      required_unlocked_attrs: [],
      required_capacity_attrs: [],
      resource_budget: { sp: 0, men: 0 },
      high_tier_rules: [...SKILL_DSL_SOFT_RULES],
    },
    runtime_hint: {
      source: '无',
      role: '无',
      display_element: '无',
    },
  };
}

function normalizeSkillDslWarnings(value = []) {
  return Array.from(
    new Set((Array.isArray(value) ? value : [value]).map(item => String(item || '').trim()).filter(Boolean)),
  );
}

function normalizeSkillDslData(value = {}) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const normalized = createEmptySkillDsl();
  normalized.version = String(source.version || SKILL_DSL_VERSION).trim() || SKILL_DSL_VERSION;
  normalized.primitives = (Array.isArray(source.primitives) ? source.primitives : []).map((item, index) => {
    const primitive = item && typeof item === 'object' && !Array.isArray(item) ? item : {};
    return {
      id: String(primitive.id || `p_${index + 1}`).trim() || `p_${index + 1}`,
      kind: String(primitive.kind || 'packed_effects').trim() || 'packed_effects',
      params:
        primitive.params && typeof primitive.params === 'object' ? clonePackedSkillEffects([primitive.params])[0] : {},
      tags: Array.from(
        new Set(
          (Array.isArray(primitive.tags) ? primitive.tags : []).map(tag => String(tag || '').trim()).filter(Boolean),
        ),
      ),
    };
  });
  normalized.flow = (Array.isArray(source.flow) ? source.flow : []).map(item => {
    const flowItem = item && typeof item === 'object' && !Array.isArray(item) ? item : {};
    return {
      from: String(flowItem.from || '').trim(),
      to: String(flowItem.to || '').trim(),
      trigger: String(flowItem.trigger || '无').trim() || '无',
      condition: String(flowItem.condition || '无').trim() || '无',
    };
  });
  const gates = source.gates && typeof source.gates === 'object' && !Array.isArray(source.gates) ? source.gates : {};
  normalized.gates = {
    mode: 'soft',
    required_unlocked_attrs: normalizeSkillAttachedAttributeArray(gates.required_unlocked_attrs || []),
    required_capacity_attrs: normalizeSkillAttachedAttributeArray(gates.required_capacity_attrs || []),
    resource_budget: {
      sp: Math.max(0, Number(gates?.resource_budget?.sp || 0) || 0),
      men: Math.max(0, Number(gates?.resource_budget?.men || 0) || 0),
    },
    high_tier_rules: Array.from(
      new Set(
        (Array.isArray(gates.high_tier_rules) ? gates.high_tier_rules : SKILL_DSL_SOFT_RULES)
          .map(rule => String(rule || '').trim())
          .filter(Boolean),
      ),
    ),
  };
  const runtimeHint =
    source.runtime_hint && typeof source.runtime_hint === 'object' && !Array.isArray(source.runtime_hint)
      ? source.runtime_hint
      : {};
  normalized.runtime_hint = {
    source: normalizeSkillAttributeSource(runtimeHint.source || '', '无'),
    role: normalizeSkillRoleType(runtimeHint.role || '', '无'),
    display_element: String(runtimeHint.display_element || '无').trim() || '无',
  };
  return normalized;
}

function pickSkillDslPrimaryPrimitive(dsl = {}) {
  const normalized = normalizeSkillDslData(dsl);
  return (
    normalized.primitives.find(item =>
      ['packed_effects', 'legacy_packed_effects', 'runtime_pack'].includes(String(item?.kind || '').trim()),
    ) ||
    normalized.primitives[0] ||
    null
  );
}

function buildSkillDslFromLegacyRuntime(skill = {}, context = {}) {
  const workingSkill = skill && typeof skill === 'object' ? skill : {};
  const legacyEffects = clonePackedSkillEffects(Array.isArray(workingSkill._效果数组) ? workingSkill._效果数组 : []);
  const attachedAttributes = normalizeSkillAttachedAttributeArray(workingSkill.附带属性 || []);
  const preview = {
    魂技名: String(workingSkill.魂技名 || workingSkill.技能名称 || workingSkill.name || AI_TODO_SKILL_NAME),
    附带属性: attachedAttributes,
    _效果数组: clonePackedSkillEffects(legacyEffects),
  };
  if (!preview._效果数组.length) {
    preview._效果数组 = [{ 机制: '系统基础', 消耗: '无', 对象: '敌方/单体', 技能类型: '输出', cast_time: 0 }];
  }
  const runtime = buildSkillRuntimeAttributeContext(preview, context);
  const dsl = normalizeSkillDslData({
    version: SKILL_DSL_VERSION,
    primitives: [
      {
        id: 'core_1',
        kind: 'packed_effects',
        params: {
          effects: clonePackedSkillEffects(preview._效果数组 || []),
          attachedAttributes: normalizeSkillAttachedAttributeArray(preview.附带属性 || []),
          visualDesc: String(workingSkill.画面描述 || AI_TODO_SKILL_VISUAL),
          effectDesc: String(workingSkill.效果描述 || AI_TODO_SKILL_EFFECT),
        },
        tags: Array.from(
          new Set([String(runtime?.source || '').trim(), String(runtime?.role || '').trim()].filter(Boolean)),
        ),
      },
    ],
    flow: [],
    gates: {
      mode: 'soft',
      required_unlocked_attrs: normalizeSkillAttachedAttributeArray(preview.附带属性 || []),
      required_capacity_attrs: normalizeSkillAttachedAttributeArray(preview.附带属性 || []),
      resource_budget: { sp: 0, men: 0 },
      high_tier_rules: [...SKILL_DSL_SOFT_RULES],
    },
    runtime_hint: {
      source: normalizeSkillAttributeSource(runtime?.source || '', '无'),
      role: normalizeSkillRoleType(runtime?.role || '', '无'),
      display_element: String(runtime?.displayElementLabel || '无').trim() || '无',
    },
  });
  const warnings = normalizeSkillDslWarnings(workingSkill.dsl_warnings || []);
  return { dsl, warnings };
}

function compileSkillRuntimeFromDsl(skill = {}, context = {}) {
  const normalizedDsl = normalizeSkillDslData(skill?.dsl || {});
  const primaryPrimitive = pickSkillDslPrimaryPrimitive(normalizedDsl);
  const params =
    primaryPrimitive?.params && typeof primaryPrimitive.params === 'object' && !Array.isArray(primaryPrimitive.params)
      ? primaryPrimitive.params
      : {};
  let effects = clonePackedSkillEffects(params.effects || params.packed_effects || []);
  let attachedAttributes = normalizeSkillAttachedAttributeArray(params.attachedAttributes || params.attached || []);
  let visualDesc = String(params.visualDesc || params.visual || skill?.画面描述 || AI_TODO_SKILL_VISUAL).trim();
  let effectDesc = String(params.effectDesc || params.effect || skill?.效果描述 || AI_TODO_SKILL_EFFECT).trim();
  const warnings = normalizeSkillDslWarnings(skill?.dsl_warnings || []);

  if (!effects.length) {
    effects = [{ 机制: '系统基础', 消耗: '无', 对象: '敌方/单体', 技能类型: '输出', cast_time: 0 }];
    warnings.push('DSL缺少可编译原语，已回退为系统基础效果');
  }

  const requiredUnlocked = normalizeSkillAttachedAttributeArray(normalizedDsl?.gates?.required_unlocked_attrs || []);
  const contextUnlocked = normalizeSkillAttachedAttributeArray(
    context?.unlockedAttributes || context?.elementProfile?.elements || [],
  );
  if (contextUnlocked.length && requiredUnlocked.length) {
    const missingUnlocked = requiredUnlocked.filter(attr => !contextUnlocked.includes(attr));
    if (missingUnlocked.length) {
      warnings.push(`硬拦截: 缺少已解锁属性 ${missingUnlocked.join('/')}`);
      attachedAttributes = attachedAttributes.filter(attr => !missingUnlocked.includes(attr));
    }
  }

  const requiredCapacity = normalizeSkillAttachedAttributeArray(normalizedDsl?.gates?.required_capacity_attrs || []);
  const contextCapacity = normalizeSkillAttachedAttributeArray(context?.attributeCapacity || contextUnlocked);
  if (contextCapacity.length && requiredCapacity.length) {
    const missingCapacity = requiredCapacity.filter(attr => !contextCapacity.includes(attr));
    if (missingCapacity.length) {
      warnings.push(`硬拦截: 超出可容纳属性 ${missingCapacity.join('/')}`);
      attachedAttributes = attachedAttributes.filter(attr => !missingCapacity.includes(attr));
    }
  }

  if (!visualDesc || isSkillTodoText(visualDesc)) visualDesc = AI_TODO_SKILL_VISUAL;
  if (!effectDesc || isSkillTodoText(effectDesc)) effectDesc = AI_TODO_SKILL_EFFECT;

  return {
    effects: clonePackedSkillEffects(effects || []),
    attachedAttributes: normalizeSkillAttachedAttributeArray(attachedAttributes || []),
    visualDesc,
    effectDesc,
    warnings: normalizeSkillDslWarnings(warnings),
  };
}

function applySkillRuntimeFromDsl(skill = {}, context = {}) {
  if (!skill || typeof skill !== 'object') return skill;
  const runtime = compileSkillRuntimeFromDsl(skill, context);
  skill._效果数组 = clonePackedSkillEffects(runtime.effects || []);
  skill.附带属性 = normalizeSkillAttachedAttributeArray(runtime.attachedAttributes || []);
  skill.画面描述 = runtime.visualDesc;
  skill.效果描述 = runtime.effectDesc;
  skill.dsl_warnings = normalizeSkillDslWarnings(runtime.warnings || []);
  return skill;
}

function stripLegacySkillFieldsFromSkill(skill = {}) {
  if (!skill || typeof skill !== 'object') return skill;
  SKILL_DSL_LEGACY_FIELD_KEYS.forEach(key => {
    if (key in skill) delete skill[key];
  });
  return skill;
}

function stripLegacySkillFieldsFromSkillMap(skillMap = {}) {
  _(skillMap || {}).forEach(skill => stripLegacySkillFieldsFromSkill(skill));
  return skillMap;
}

function buildCanonicalRingSkillKey(ringIndex = 1) {
  const safeIndex = Math.max(1, Math.floor(Number(ringIndex) || 0));
  return `第${safeIndex}魂技`;
}

function normalizeSingleRingSkillSlotMap(skillMap = {}, ringIndex = 1) {
  if (!skillMap || typeof skillMap !== 'object' || Array.isArray(skillMap)) return skillMap;
  const entries = Object.entries(skillMap).filter(([, skill]) => !!skill && typeof skill === 'object' && !Array.isArray(skill));
  if (!entries.length) return skillMap;
  const canonicalKey = buildCanonicalRingSkillKey(ringIndex);
  const hasMultipleEntries = entries.length > 1;
  const hasOrdinalKey = entries.some(([rawKey]) => /^第(?:\d+|[一二三四五六七八九十百]+)魂技/u.test(String(rawKey || '').trim()));
  if (hasMultipleEntries || (hasOrdinalKey && skillMap[canonicalKey])) {
    entries.forEach(([, skill]) => stripLegacySkillFieldsFromSkill(skill));
    return skillMap;
  }
  const [rawKey, rawSkill] = entries[0];
  const normalizedSkill = rawSkill && typeof rawSkill === 'object' ? rawSkill : {};
  if (!normalizedSkill.魂技名 || !String(normalizedSkill.魂技名).trim()) {
    normalizedSkill.魂技名 = String(rawKey || canonicalKey);
  }
  if (rawKey !== canonicalKey) delete skillMap[rawKey];
  skillMap[canonicalKey] = normalizedSkill;
  stripLegacySkillFieldsFromSkill(skillMap[canonicalKey]);
  return skillMap;
}

function stripLegacySkillFieldsFromCharacter(char = {}) {
  if (!char || typeof char !== 'object') return char;
  _(char.spirit || {}).forEach(spiritData => {
    stripLegacySkillFieldsFromSkillMap(spiritData?.custom_skills || {});
    _(spiritData?.soul_spirits || {}).forEach(soulSpirit => {
      _(soulSpirit?.rings || {}).forEach((ringData, ringIndex) => {
        normalizeSingleRingSkillSlotMap(ringData?.魂技 || {}, ringIndex);
        stripLegacySkillFieldsFromSkillMap(ringData?.魂技 || {});
      });
    });
  });
  stripLegacySkillFieldsFromSkillMap(char?.secret_skills || {});
  stripLegacySkillFieldsFromSkillMap(char?.special_abilities || {});
  _(char?.martial_fusion_skills || {}).forEach(fusionData =>
    stripLegacySkillFieldsFromSkill(fusionData?.skill_data || {}),
  );
  stripLegacySkillFieldsFromSkillMap(char?.bloodline_power?.skills || {});
  stripLegacySkillFieldsFromSkillMap(char?.bloodline_power?.passives || {});
  _(char?.bloodline_power?.blood_rings || {}).forEach((ringData, ringIndex) => {
    normalizeSingleRingSkillSlotMap(ringData?.魂技 || {}, ringIndex);
    stripLegacySkillFieldsFromSkillMap(ringData?.魂技 || {});
  });
  _(char?.soul_bone || {}).forEach(boneData => stripLegacySkillFieldsFromSkillMap(boneData?.附带技能 || {}));
  return char;
}

const SKILL_SUMMARY_EFFECT_MECHANISMS = Object.freeze(['属性摘要', '构型摘要', '术式摘要', '极性摘要', '属性系数摘要']);
const SKILL_SUMMARY_EFFECT_SET = new Set(SKILL_SUMMARY_EFFECT_MECHANISMS);

function isSkillSummaryEffect(effect = {}) {
  const mechanism = String(effect?.机制 || '').trim();
  return !!mechanism && (SKILL_SUMMARY_EFFECT_SET.has(mechanism) || effect?.summaryOnly === true);
}

function getSkillSummaryEffects(packedEffects) {
  return (Array.isArray(packedEffects) ? packedEffects : []).filter(
    effect => effect && typeof effect === 'object' && isSkillSummaryEffect(effect),
  );
}

function getSkillSummaryEffectByMechanism(packedEffects, mechanism = '') {
  const target = String(mechanism || '').trim();
  if (!target) return null;
  return getSkillSummaryEffects(packedEffects).find(effect => String(effect?.机制 || '').trim() === target) || null;
}

function getMeaningfulSkillEffects(packedEffects) {
  return (Array.isArray(packedEffects) ? packedEffects : []).filter(
    effect =>
      effect && typeof effect === 'object' && String(effect.机制 || '') !== '系统基础' && !isSkillSummaryEffect(effect),
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
  const mech = String(effect?.机制 || '');
  const target = buildSkillTargetLabel(effect?.目标 || effect?.对象 || '目标');
  switch (mech) {
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
    case '消耗修正': {
      const value = Number(effect?.数值 || 0);
      const duration = getSkillEffectDuration(effect);
      const durationText = duration > 0 ? `，持续${formatSkillNumber(duration)}回合` : '';
      if (String(effect?.动作 || '').trim() === '消耗提高')
        return '使' + target + '的自身能力消耗提高' + formatSkillPercent(Math.abs(value - 1)) + durationText;
      return '使' + target + '的自身能力消耗降低' + formatSkillPercent(Math.abs(1 - value)) + durationText;
    }
    case '前摇修正': {
      const value = Number(effect?.数值 || 0);
      const duration = getSkillEffectDuration(effect);
      const durationText = duration > 0 ? `，持续${formatSkillNumber(duration)}回合` : '';
      if (String(effect?.动作 || '').trim() === '前摇拉长')
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
    case '解控':
    case '净化':
      return (
        '为' +
        target +
        '清除负面状态' +
        (Number(effect.清除层级 || 0) > 0 ? '（层级' + formatSkillNumber(effect.清除层级) + '）' : '')
      );
    case '标记锁定':
      return '锁定' + target + '，持续' + formatSkillNumber(effect.持续回合) + '回合，并提高命中与锁定强度';
    case '共享视野':
      return '与' + target + '共享视野，持续' + formatSkillNumber(effect.持续回合) + '回合，提高反应与命中';
    case '幻境':
      return '对' + target + '施加幻境干扰，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '催眠':
      return '尝试催眠' + target + '，成功后持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '禁疗':
      return '对' + target + '施加禁疗，持续' + formatSkillNumber(effect.持续回合) + '回合';
    case '沉默':
      return '使' + target + '沉默' + formatSkillNumber(effect.持续回合) + '回合';
    case '减速':
      return '使' + target + '减速，持续' + formatSkillNumber(effect.持续回合) + '回合';
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
        return '对' + target + '施加【' + mech + '】效果，持续' + formatSkillNumber(effect.持续回合) + '回合';
      return '对' + target + '施加【' + mech + '】效果';
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
  return Array.from(
    new Set(
      getSkillSummaryEffects(packedEffects)
        .map(effect => String(effect?.文本 || '').trim())
        .filter(Boolean),
    ),
  ).join('；');
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
  伤害附加: ['穿透', '吸血', '斩杀补伤', '流血DOT', '追击', '反击'],
  控制附加: ['打断', '沉默', '减速', '致盲', '迟缓', '禁疗'],
  防御附加: ['小护盾', '短减伤', '反伤', '霸体短附加'],
  回复附加: ['魂力恢复', '精神恢复', '净化', '解控'],
  情报附加: ['标记弱点', '共享视野', '目标锁定'],
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

const NUMERIC_STAT_BONUS_KEYS = ['str', 'def', 'agi', 'vit_max', 'men_max', 'sp_max'];

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
    str: normalizeDiscreteStatBonusInteger(source.str),
    def: normalizeDiscreteStatBonusInteger(source.def),
    agi: normalizeDiscreteStatBonusInteger(source.agi),
    vit_max: normalizeDiscreteStatBonusInteger(source.vit_max),
    men_max: normalizeDiscreteStatBonusInteger(source.men_max),
    sp_max: normalizeDiscreteStatBonusInteger(source.sp_max),
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

function buildNumericStatBonusSummary(bonusMap = {}) {
  const labels = {
    str: '力量',
    def: '防御',
    agi: '敏捷',
    vit_max: '体力上限',
    men_max: '精神力上限',
    sp_max: '魂力上限',
  };
  const segments = [];
  Object.entries(createNumericStatBonusMap(bonusMap)).forEach(([key, value]) => {
    const amount = Math.floor(Number(value || 0));
    if (amount > 0 && labels[key]) segments.push(`${labels[key]}+${amount}`);
  });
  return segments.join('，') || '无';
}

const GOLDEN_DRAGON_PERMANENT_BONUS_NODES = {
  7: {
    名称: '【第七层·体魄升华I】',
    描述: '永久额外提升基础力量、体力、防御与魂力上限5%。',
    百分比: { str: 0.05, def: 0.05, vit_max: 0.05, sp_max: 0.05 },
  },
  9: {
    名称: '【第九层·体魄升华II】·永久成长',
    描述: '解封时按当前体力上限额外固化10%永久成长。',
    百分比: { vit_max: 0.1 },
  },
  13: {
    名称: '【第十三层·体魄升华III】',
    描述: '永久额外提升基础力量、体力、防御与魂力上限5%。',
    百分比: { str: 0.05, def: 0.05, vit_max: 0.05, sp_max: 0.05 },
  },
  15: {
    名称: '【第十五层·体魄升华IV】',
    描述: '永久额外提升基础力量、体力、防御与魂力上限5%。',
    百分比: { str: 0.05, def: 0.05, vit_max: 0.05, sp_max: 0.05 },
  },
};

const GOLDEN_DRAGON_NON_SKILL_NODE_NAMES = new Set(
  Object.entries(GOLDEN_DRAGON_PERMANENT_BONUS_NODES)
    .filter(([seal]) => [7, 13, 15].includes(Number(seal)))
    .map(([, node]) => node?.名称)
    .filter(Boolean),
);

function applyGoldenDragonPermanentBonusNodes(char, currentStats = {}) {
  if (!char?.bloodline_power || !String(char.bloodline_power.bloodline || '').includes('金龙王'))
    return createNumericStatBonusMap();
  if (!char.stat || typeof char.stat !== 'object') return createNumericStatBonusMap();
  if (!char.bloodline_power.permanent_bonuses || typeof char.bloodline_power.permanent_bonuses !== 'object')
    char.bloodline_power.permanent_bonuses = {};
  const trainedBonus = ensureNumericStatBonusMap(char.stat, 'trained_bonus');
  const totalAdded = createNumericStatBonusMap();
  const virtualStats = createNumericStatBonusMap(currentStats);
  Object.entries(GOLDEN_DRAGON_PERMANENT_BONUS_NODES)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .forEach(([sealKey, node]) => {
      const sealLv = Number(sealKey || 0);
      if (sealLv <= 0 || sealLv > Number(char.bloodline_power?.seal_lv || 0)) return;
      const recordKey = String(node?.名称 || `第${sealLv}层永久成长`);
      if (char.bloodline_power.permanent_bonuses[recordKey]) return;
      const appliedBonus = createNumericStatBonusMap();
      Object.entries(node?.百分比 || {}).forEach(([statKey, ratio]) => {
        const gain = Math.max(
          0,
          Math.floor(Math.max(0, Number(virtualStats[statKey] || 0)) * Math.max(0, Number(ratio || 0))),
        );
        appliedBonus[statKey] = gain;
        totalAdded[statKey] += gain;
        trainedBonus[statKey] = Number(trainedBonus[statKey] || 0) + gain;
        virtualStats[statKey] = Number(virtualStats[statKey] || 0) + gain;
      });
      const effectText = buildNumericStatBonusSummary(appliedBonus);
      char.bloodline_power.permanent_bonuses[recordKey] = {
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
) {
  const gradeInfo = judgeSkillGrade(talentTier, ringAge, ringIndex, compatibility);
  const grade = gradeInfo.grade;
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
  return {
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
        标签: ['第七魂环', '武魂真身', quality],
        级别: quality,
      },
      ...trueBodyEffects.filter(Boolean),
    ],
  };
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
  const gradeInfo = judgeSkillGrade(talentTier, ringAge, ringIndex, compatibility);
  const grade = gradeInfo.grade;
  const quality = gradeInfo.quality;
  const roll = gradeInfo.scoreRoll;

  const blueprint = rollSkillBlueprint(type, grade, ringIndex, preferredSecondary);
  const summary = buildSkillBattleSummary(blueprint);
  const combat = buildSkillCombatProfile(blueprint, { quality, ringIndex, type });
  const main = blueprint.主机制大类;
  const archetype = blueprint.主机制原型;
  const secondary = blueprint.副机制 || [];
  const mutation = blueprint.变异机制 || [];
  const attrs = Array.isArray(blueprint?.加成属性候选) ? blueprint.加成属性候选 : ['魂力'];
  const gradeFactor = { C: 1, B: 2, A: 3, S: 4 }[grade] || 1;
  const selfSacrificeVitCost = mutation.includes('自残换收益') ? 30 + ringIndex * 10 : 0;
  const secondaryEffectScale = getSecondaryRingScale(ringIndex);
  const secondaryDurationScale = Math.max(0.7, secondaryEffectScale);
  const passiveMode = options?.passiveMode === true;
  const passiveNameHint = String(options?.passiveName || '').trim();
  const tagList = [
    blueprint.主机制大类,
    blueprint.主机制原型,
    blueprint.释放形态,
    ...(blueprint.副机制 || []),
    ...(blueprint.变异机制 || []),
  ].filter(Boolean);
  const reverseTargetMap = {
    自身: '自身',
    '己方/单体': '友方单体',
    '己方/群体': '友方群体',
    '敌方/单体': '敌方单体',
    '敌方/群体': '敌方群体',
    全场: '全场',
  };
  const normalizedTarget = blueprint.目标模型 || reverseTargetMap[combat.对象] || '敌方单体';

  const randomInRange = table => {
    const [min, max] = table?.[grade] || table?.B || [1, 1];
    return min + Math.random() * (max - min);
  };

  const clash = combat.仲裁逻辑?.瞬间交锋模块 || {};
  const state = combat.仲裁逻辑?.状态挂载模块 || {};
  const field = combat.仲裁逻辑?.召唤与场地模块 || {};
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
    resource_block_ratio: 0,
    min_hp_floor: 0,
    death_save_count: 0,
    cost_ratio: 1.0,
    windup_ratio: 1.0,
    mastery_ratio: 1.0,
    speed_ratio: 1.0,
  };
  const packedEffects = [];

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
    if (recoverEffect) packedEffects.push(recoverEffect);
  }
  if (main === '回复类' && archetype === '魂力恢复') {
    const recoverEffect = buildPackedRecoverAttributeEffect(normalizedTarget, 'sp', stateCalc.sp_gain_ratio || 0, 0, false);
    if (recoverEffect) packedEffects.push(recoverEffect);
  }
  if (main === '回复类' && archetype === '精神恢复') {
    const recoverEffect = buildPackedRecoverAttributeEffect(normalizedTarget, 'men', stateCalc.men_gain_ratio || 0, 0, false);
    if (recoverEffect) packedEffects.push(recoverEffect);
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
    if (recoverEffect) packedEffects.push(recoverEffect);
  }
  if (Math.abs(Number(stateCalc.cost_ratio || 1) - 1) > 0.001) {
    const effect = buildPackedAttributeEffect(
      '消耗修正',
      normalizedTarget,
      '消耗',
      Number(stateCalc.cost_ratio || 1) > 1 ? '消耗提高' : '消耗降低',
      Number(stateCalc.cost_ratio || 1),
      state.持续回合 || 0,
      '状态持续',
    );
    if (effect) packedEffects.push(effect);
  }
  if (Math.abs(Number(stateCalc.windup_ratio || 1) - 1) > 0.001) {
    const effect = buildPackedAttributeEffect(
      '前摇修正',
      normalizedTarget,
      '前摇',
      Number(stateCalc.windup_ratio || 1) > 1 ? '前摇拉长' : '前摇缩短',
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
    packedEffects.push({ 机制: '解控', 目标: normalizedTarget, 清除层级: { C: 1, B: 2, A: 3, S: 4 }[grade] || 1 });
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
      目标: normalizedTarget.includes('敌方') ? '自身' : normalizedTarget,
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
  if (secondary.includes('斩杀补伤')) {
    const match = String(state.特殊机制标识 || '').match(/斩杀补伤:(\d+)%\/(\d+)%/);
    const threshold = match ? Number(match[1]) / 100 : { C: 0.15, B: 0.2, A: 0.25, S: 0.3 }[grade] || 0.2;
    const mult = match ? Number((1 + Number(match[2]) / 100).toFixed(2)) : stateCalc.final_damage_mult || 1.15;
    packedEffects.push({
      机制: '斩杀补伤',
      目标: normalizedTarget,
      判定属性: 'vit_ratio',
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
  if (secondary.includes('反击'))
    packedEffects.push({
      机制: '受击反击',
      目标: '自身',
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
      目标: '自身',
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
      目标: '自身',
      持续回合: state.持续回合 || 1,
      attacker_speed_bonus: Number(state.计算层效果?.attacker_speed_bonus || 0),
      hit_bonus: Number(state.计算层效果?.hit_bonus || 0),
      final_damage_mult: Number(state.计算层效果?.final_damage_mult || 1.0),
    });
  if (main === '位移类' && archetype === '脱离位移')
    packedEffects.push({
      机制: '脱离位移',
      目标: '自身',
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
      目标: '自身',
      持续回合: state.持续回合 || 2,
      反击倍率: Number(state.计算层效果?.counter_attack_ratio || 0),
      damage_reduction: Number(state.计算层效果?.damage_reduction || 0),
    });
  if (main === '特殊规则类' && archetype === '条件触发')
    packedEffects.push({
      机制: '条件触发',
      目标: normalizedTarget,
      判定属性: 'vit_ratio',
      判定阈值: { C: 0.55, B: 0.45, A: 0.35, S: 0.25 }[grade] || 0.45,
      成功参数: {
        final_damage_mult: Number(state.计算层效果?.final_damage_mult || 1.18),
        hit_bonus: Number(state.计算层效果?.hit_bonus || 0),
      },
      失败参数: { hit_bonus: Number(((state.计算层效果?.hit_bonus || 0) * 0.5).toFixed(2)) },
    });
  if (main === '特殊规则类' && archetype === '转化')
    packedEffects.push({ 机制: '伤害转回复', 目标: '自身', 转换比例: Number(state.计算层效果?.life_steal_ratio || 0) });
  if (main === '特殊规则类' && archetype === '分身')
    packedEffects.push({
      机制: '分身',
      目标: '自身',
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
      目标: '自身',
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
    if (main === '防御类') return !['护盾', '减伤', '格挡/抵消', '霸体', '免死/锁血'].includes(archetype);
    if (main === '感知/认知类') return !['标记锁定', '共享视野', '幻境', '催眠'].includes(archetype);
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
    packedEffects.push({
      机制: '状态挂载',
      目标:
        (main === '位移类' && ['自身位移', '追击位移', '脱离位移'].includes(archetype)) ||
        (main === '特殊规则类' && ['反制', '分身'].includes(archetype))
          ? '自身'
          : normalizedTarget,
      状态名称: state.状态名称,
      持续回合: state.持续回合 || 0,
      面板修改比例: state.面板修改比例,
      计算层效果: state.计算层效果,
      特殊机制标识: state.特殊机制标识 && state.特殊机制标识 !== '无' ? String(state.特殊机制标识) : undefined,
    });
  }

  if (passiveMode) {
    combat.对象 = '自身';
    combat.技能类型 = String(combat.技能类型 || '').includes('被动')
      ? String(combat.技能类型 || '被动')
      : String(combat.技能类型 || '').trim()
        ? `被动/${combat.技能类型}`
        : '被动';
    combat.cast_time = 0;
    combat.消耗 = '无';

    const passiveFriendlyMechs = new Set([
      '属性变化',
      '持续恢复',
      '消耗修正',
      '前摇修正',
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
      const mech = String(effect?.机制 || '');
      if (!passiveFriendlyMechs.has(mech)) return;
      if (mech === '属性永久强化') {
        passiveEffects.push({ ...effect, 目标: '自身' });
        return;
      }
      const patched = { ...effect, 目标: '自身', 对象: '自身' };
      if (patched.持续 !== undefined) patched.持续 = Math.max(999, Number(patched.持续 || 0) || 999);
      if (patched.持续回合 !== undefined) patched.持续回合 = Math.max(999, Number(patched.持续回合 || 0) || 999);
      passiveEffects.push(patched);
    });

    const hasStablePassiveCore = passiveEffects.some(effect =>
      ['属性变化', '持续恢复', '消耗修正', '前摇修正', '掌控修正', '速度修正', '属性永久强化'].includes(
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
        pushPassiveRatioEffect('消耗修正', '消耗', Number(stateCalc.cost_ratio || 1) > 1 ? '消耗提高' : '消耗降低', stateCalc.cost_ratio || 1);
        pushPassiveRatioEffect('前摇修正', '前摇', Number(stateCalc.windup_ratio || 1) > 1 ? '前摇拉长' : '前摇缩短', stateCalc.windup_ratio || 1);
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
        market_value: { price: 0, currency: 'fed_coin' },
        描述: itemDesc,
        标签: ['临时造物', type === '食物系' ? '食物系' : '造物系'],
        来源技能: itemName,
        使用效果: inventoryUsageEffects,
        触发方式: triggerMode,
      },
    });
  }

  packedEffects.unshift({
    机制: '系统基础',
    消耗: combat.消耗 || '无',
    对象: combat.对象 || normalizedTarget,
    技能类型: combat.技能类型 || '无',
    cast_time: combat.cast_time || 0,
    标签: tagList,
    级别: quality,
  });

  return {
    魂技名: AI_TODO_SKILL_NAME,
    画面描述: AI_TODO_SKILL_VISUAL,
    效果描述: AI_TODO_SKILL_EFFECT,
    _效果数组: packedEffects,
  };
}

const AI_TODO_TEXT_PREFIX = '待补全';
const SKILL_TEXT_UNKNOWN = '未知';
const AI_TODO_SKILL_NAME =
  '待补全（填写魂技名；命名必须与所属武魂/魂灵同源，禁止无关命名；若为造物承载类技能，此名称同时作为生成物名称）';
const AI_TODO_SKILL_VISUAL = '待补全（依据魂技名与_效果数组补全发动画面，保持与机制一致，不新增机制）';
const AI_TODO_SKILL_EFFECT = '待补全（依据_效果数组补全效果描述，保持与机制一致，不新增机制，必须包含消耗与效果）';
const AI_TODO_SPIRIT_NAME = '待补全(填写具体武魂名，如蓝银草/蓝银皇)';
const AI_TODO_SPIRIT_DESC = '待补全(描述武魂外形、核心能力与战斗特征)';
const AI_TODO_SPIRIT_ELEMENT = '待补全(填写元素倾向；无属性也请明确写无)';
const AI_TODO_ATTRIBUTE_SYSTEM = '待补全（填写属性体系：无/元素/五行）';
const AI_TODO_ATTRIBUTE_CAPACITY = '待补全（填写可容纳属性列表：  金 / 木 / 水 / 火 / 土 / 风 / 雷 / 冰 / 光 / 暗 / 精神 / 空间 / 时间 / 创造 / 毁灭，无属性体系请填“无”）';
const AI_TODO_SOUL_SPIRIT_NAME = '待补全（魂兽名）';
const AI_TODO_SOUL_SPIRIT_DESC = '待生成（请结合魂灵物种、年限、品质补全外形、血脉特征、行动风格与能力倾向）';
const AI_TODO_SOUL_SPIRIT_QUALITY =
  '待生成（可选f/d/c/b/a/s/s+；f为劣质魂灵，如草蛇等杂血弱种；d为低劣魂灵，如普通凶性野兽型魂灵；c为普通魂灵，具备基础血脉与战斗价值；b为良品魂灵，常见强势魂兽；a为精英魂灵，稀有异种或强族后裔；s为顶尖魂灵，王族血脉或顶级龙种；s+为神话级魂灵，真龙、神兽后裔或极端变异个体）';
const AI_TODO_SOUL_SPIRIT_SECONDARY = '待补全（可选副机制）';
const AI_TODO_MAIN_IDENTITY = '待补全(填写当前主要公开身份)';
const AI_TODO_PERSONALITY = '待补全(根据角色设定补全性格特征)';
const AI_TODO_STATUS_LOC = '斗罗大陆-待补全(按大陆-城市-地点完整路径填写，禁止只填单一地名)';
function isAiTodoText(value) {
  const text = String(value || '').trim();
  return text.startsWith(AI_TODO_TEXT_PREFIX) || text.startsWith('待补充');
}

function isStorageTodoPlaceholderText(value) {
  const text = String(value || '').trim();
  if (!text) return false;
  return /^(待补全|待补充|待生成)/.test(text) || /TODO/i.test(text);
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
  return `待补全（填写魂技名；必须围绕【${spiritName}】同源命名并体现该武魂能力特征，禁止无关命名。若为造物承载类技能，此名称同时作为生成物名称。${foodHint}）`;
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
    _品质快照: '无',
    _物种快照: '未知',
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

function inferSoulSpiritQuality(spirit = {}) {
  const age = Math.max(0, Number(spirit?.年限 || 0));
  const species = String(spirit?.表象名称 || '').trim();
  const status = String(spirit?.状态 || '').trim();
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

  if (/(残|衰|濒死|破碎|虚弱)/.test(status)) score -= 1;
  return SOUL_SPIRIT_QUALITY_VALUES[_.clamp(score, 0, SOUL_SPIRIT_QUALITY_VALUES.length - 1)] || '';
}

function resolveSoulSpiritQuality(spirit = {}) {
  const explicit = normalizeSoulSpiritQuality(spirit?.品质 || '');
  if (explicit) return explicit;
  const inferred = inferSoulSpiritQuality(spirit);
  if (inferred) return inferred;
  const raw = String(spirit?.品质 || '').trim();
  return raw || AI_TODO_SOUL_SPIRIT_QUALITY;
}

function buildSoulSpiritDescriptionTodoText(spirit = {}) {
  const species = String(spirit?.表象名称 || '').trim();
  const quality = normalizeSoulSpiritQuality(spirit?.品质 || '');
  const age = Math.max(0, Math.floor(Number(spirit?.年限 || 0)));
  const category = resolveSoulSpiritSpeciesCategory(species);
  const segments = [];
  if (species && species !== '未展露' && !isAiTodoText(species)) segments.push(`物种=${species}`);
  if (age > 0) segments.push(`年限=${age}年`);
  if (quality) segments.push(`品质=${quality}`);
  if (category !== '未知') segments.push(`类别=${category}`);
  if (!segments.length) return AI_TODO_SOUL_SPIRIT_DESC;
  return `待生成（请结合${segments.join('；')}补全魂灵外形、血脉特征、行动风格与能力倾向，避免空泛套话）`;
}

function syncSoulSpiritRuntimeData(spirit = {}) {
  if (!spirit || typeof spirit !== 'object') return spirit;
  const resolvedQuality = resolveSoulSpiritQuality(spirit);
  spirit.品质 = resolvedQuality;

  const currentDesc = String(spirit.描述 || '').trim();
  if (!currentDesc || currentDesc === '无' || isAiTodoText(currentDesc) || currentDesc.startsWith('待生成')) {
    spirit.描述 = buildSoulSpiritDescriptionTodoText({ ...spirit, 品质: resolvedQuality });
  }

  if (!spirit.战力面板 || typeof spirit.战力面板 !== 'object') {
    spirit.战力面板 = createEmptySoulSpiritPowerPanel();
  }

  const visibleSpecies =
    !isAiTodoText(spirit.表象名称) && String(spirit.表象名称 || '').trim() && spirit.表象名称 !== '未展露'
      ? String(spirit.表象名称).trim()
      : '未知';
  const normalizedQuality = normalizeSoulSpiritQuality(resolvedQuality);
  spirit.战力面板._品质快照 = normalizedQuality || '无';
  spirit.战力面板._物种快照 = visibleSpecies;

  if (Number(spirit.年限 || 0) > 0) {
    const stats = getBeastStats(spirit.年限, visibleSpecies, resolvedQuality);
    spirit.战力面板.对标等级 = Number(stats.对标等级 || 0);
    spirit.战力面板.str = Number(stats.str || 0);
    spirit.战力面板.def = Number(stats.def || 0);
    spirit.战力面板.agi = Number(stats.agi || 0);
    spirit.战力面板.vit_max = Number(stats.vit_max || 0);
    spirit.战力面板.men_max = Number(stats.men_max || 0);
    spirit.战力面板.sp_max = Number(stats.sp_max || 0);
  }
  return spirit;
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

function normalizeBloodlineAttributeState(bloodlinePower = {}) {
  const rawSystem = String(bloodlinePower?.属性体系 || '').trim();
  const explicitSystem = isAiTodoText(rawSystem) ? '' : rawSystem;
  const rawCapacity = bloodlinePower?.可容纳属性;
  const explicitUnlocked = normalizeAttributeTokenArray(bloodlinePower?.已解锁属性);
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

function getStoredSkillElementStructure(skill = {}) {
  const summary = getSkillSummaryEffectByMechanism(skill?._效果数组, '构型摘要');
  return normalizeSkillElementStructure(summary || {});
}

function getStoredSkillWuxingInvocation(skill = {}) {
  const summary = getSkillSummaryEffectByMechanism(skill?._效果数组, '术式摘要');
  return normalizeSkillWuxingInvocation(summary || {});
}

function getStoredSkillPolarityInfo(skill = {}) {
  const summary = getSkillSummaryEffectByMechanism(skill?._效果数组, '极性摘要');
  return normalizeSkillPolarityInfo(summary || {});
}

function getStoredSkillAttributeCoefficients(skill = {}) {
  const summary = getSkillSummaryEffectByMechanism(skill?._效果数组, '属性系数摘要');
  return normalizeSkillAttributeCoefficients(summary?.系数 || summary?.属性系数 || {});
}

function getStoredSkillDisplayElement(skill = {}) {
  const summary = getSkillSummaryEffectByMechanism(skill?._效果数组, '属性摘要');
  return String(summary?.显示元素 || '').trim();
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
  const baseEffects = clonePackedSkillEffects(Array.isArray(skill?._效果数组) ? skill._效果数组 : []).filter(
    effect => !isSkillSummaryEffect(effect),
  );
  skill._效果数组 = [...baseEffects, ...clonePackedSkillEffects(summaryEffects || [])];
  return skill;
}

function stripSkillLegacyRuntimeFields(skill = {}) {
  ['属性来源', '魂技作用', '属性系数', '元素构型', '五行调用结构', '极性信息'].forEach(key => {
    if (key in skill) delete skill[key];
  });
  return skill;
}

function buildSkillRuntimeSummaryEffects(runtime = {}) {
  const attached = normalizeSkillAttachedAttributeArray(runtime?.attachedAttributes || []);
  const displayElementLabel =
    String(runtime?.displayElementLabel || (attached.length ? attached.join('/') : '无')).trim() || '无';
  const elementStructure = normalizeSkillElementStructure(runtime?.elementStructure || {});
  const wuxingInvocation = normalizeSkillWuxingInvocation(runtime?.wuxingInvocation || {});
  const polarityInfo = normalizeSkillPolarityInfo(runtime?.polarityInfo || {});
  const coeff = normalizeSkillAttributeCoefficients(runtime?.attributeCoeff || {});
  const source = normalizeSkillAttributeSource(runtime?.source || '', '无');
  const role = normalizeSkillRoleType(runtime?.role || '', '无');
  const effects = [];
  if (attached.length || displayElementLabel !== '无') {
    const textSegments = [];
    if (attached.length) textSegments.push(`附带属性：${attached.join('/')}`);
    if (source !== '无' || role !== '无')
      textSegments.push(`建模：${[source, role].filter(value => value && value !== '无').join('/')}`);
    if (displayElementLabel !== '无' && (!attached.length || displayElementLabel !== attached.join('/')))
      textSegments.push(`显示元素：${displayElementLabel}`);
    effects.push({
      机制: '属性摘要',
      summaryOnly: true,
      文本: textSegments.join('；') || `显示元素：${displayElementLabel}`,
      属性列表: [...attached],
      显示元素: displayElementLabel,
      属性来源: source,
      魂技作用: role,
    });
  }
  if (hasSkillElementStructure(elementStructure))
    effects.push({
      机制: '构型摘要',
      summaryOnly: true,
      文本: buildSkillElementStructureSummaryText(elementStructure),
      ...elementStructure,
    });
  if (hasSkillWuxingInvocation(wuxingInvocation))
    effects.push({
      机制: '术式摘要',
      summaryOnly: true,
      文本: buildSkillWuxingInvocationSummaryText(wuxingInvocation),
      ...wuxingInvocation,
    });
  if (hasSkillPolarityInfo(polarityInfo))
    effects.push({
      机制: '极性摘要',
      summaryOnly: true,
      文本: buildSkillPolaritySummaryText(polarityInfo),
      ...polarityInfo,
    });
  const coeffText = formatSkillAttributeCoefficientSummaryText(coeff);
  if (coeffText) effects.push({ 机制: '属性系数摘要', summaryOnly: true, 文本: coeffText, 系数: coeff });
  return effects.filter(effect => String(effect?.文本 || '').trim());
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
  const summary = getSkillSummaryEffectByMechanism(skill?._效果数组, '属性摘要');
  const explicit = normalizeSkillAttributeSource(summary?.属性来源 || '', '无');
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
  const summary = getSkillSummaryEffectByMechanism(skill?._效果数组, '属性摘要');
  const explicit = normalizeSkillRoleType(summary?.魂技作用 || '', '无');
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
  replaceSkillRuntimeSummaryEffects(skill, buildSkillRuntimeSummaryEffects(runtime));
  stripSkillLegacyRuntimeFields(skill);
  return skill;
}

function getFusionSkillElementProfile(fusionSkill = {}, char = {}) {
  const slots = getNormalizedFusionSourceSpirits(fusionSkill, char);
  for (const slot of slots) {
    const spiritData = char?.spirit?.[slot];
    if (!spiritData || typeof spiritData !== 'object') continue;
    const profile = buildElementProfileFromAttributeState(normalizeSpiritAttributeState(spiritData, slot, char));
    if (profile.system !== '无属性') return profile;
  }
  return buildElementProfileFromAttributeState(normalizeBloodlineAttributeState(char?.bloodline_power || {}));
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
    dsl: normalizeSkillDslData(skill?.dsl || {}),
    dsl_warnings: normalizeSkillDslWarnings(skill?.dsl_warnings || []),
  };
  if (!working._效果数组.length && Array.isArray(working.dsl?.primitives) && working.dsl.primitives.length > 0) {
    applySkillRuntimeFromDsl(working, {});
  }
  applySkillElementInheritance(working, {});
  syncConstructSkillMetadata(working);
  hydrateSkillTextByPackedEffects(working, {}, { forceVisual: true, forceEffect: true });
  const dslBundle = buildSkillDslFromLegacyRuntime(working, {});
  return {
    魂技名: working.魂技名,
    dsl: dslBundle.dsl,
    dsl_warnings: dslBundle.warnings,
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
  const systemEffects = rawEffects.filter(effect => effect?.机制 === '系统基础');
  const normalizedCreateEffects = createEffects.map(effect => {
    const cloned = { ...effect };
    const isFood = String(cloned.产物类型 || '') === '食物';
    const baseUsageEffects =
      Array.isArray(cloned.使用效果) && cloned.使用效果.length > 0
        ? clonePackedSkillEffects(cloned.使用效果)
        : buildCreationUsageEffects(rawEffects, isFood ? '食物系' : '');
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
    template.使用效果 = inventoryUsageEffects;
    template.触发方式 = cloned.触发方式 || template.触发方式 || (isFood ? '食用' : '使用');
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
  return fusionSkill?.fusion_mode === 'self' ? 'self' : 'partner';
}

function getNormalizedFusionSourceSpirits(fusionSkill = {}, char = {}) {
  const rawSlots = Array.isArray(fusionSkill?.source_spirits) ? fusionSkill.source_spirits : [];
  let slots = rawSlots.map(slot => String(slot || '').trim()).filter(slot => FUSION_SPIRIT_SLOTS.includes(slot));
  if (!slots.length) slots = getNormalizedFusionMode(fusionSkill) === 'self' ? [...FUSION_SPIRIT_SLOTS] : ['第一武魂'];
  return Array.from(new Set(slots));
}

function ensureFusionSkillMentalCost(skill, currentRatio = 0.5) {
  if (!skill || typeof skill !== 'object') return skill;
  if (!Array.isArray(skill._效果数组)) skill._效果数组 = [];
  let systemBase = skill._效果数组.find(effect => effect && effect.机制 === '系统基础');
  if (!systemBase) {
    systemBase = { 机制: '系统基础', 消耗: '无', 对象: '敌方/单体', 技能类型: '输出', cast_time: 30 };
    skill._效果数组.unshift(systemBase);
  }
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

function ensureSkillStructGenerated(skill, context = {}) {
  if (!skill || typeof skill !== 'object') return skill;
  if (!Array.isArray(skill._效果数组)) skill._效果数组 = [];
  if (typeof skill.魂技名 !== 'string' || !skill.魂技名.trim() || isSkillTodoText(skill.魂技名)) {
    skill.魂技名 = buildSkillNameTodoText(context?.textContext || context);
  }
  const hasPackedEffects = Array.isArray(skill._效果数组) && skill._效果数组.length > 0;
  const shouldDeferGeneration = !hasPackedEffects && context.deferGenerationUntilSecondaryReady === true;

  if (!hasPackedEffects) {
    if (typeof skill.画面描述 !== 'string' || !skill.画面描述.trim() || isSkillTodoText(skill.画面描述))
      skill.画面描述 = SKILL_TEXT_UNKNOWN;
    if (typeof skill.效果描述 !== 'string' || !skill.效果描述.trim() || isSkillTodoText(skill.效果描述))
      skill.效果描述 = SKILL_TEXT_UNKNOWN;
  } else {
    if (typeof skill.画面描述 !== 'string' || !skill.画面描述.trim() || isSkillTodoText(skill.画面描述))
      skill.画面描述 = AI_TODO_SKILL_VISUAL;
    if (typeof skill.效果描述 !== 'string' || !skill.效果描述.trim() || isSkillTodoText(skill.效果描述))
      skill.效果描述 = AI_TODO_SKILL_EFFECT;
  }

  const shouldGenerate = skill._效果数组.length === 0 && context.enableGenerate !== false && !shouldDeferGeneration;
  if (shouldGenerate) {
    const generated = context.forceTrueBody
      ? buildSeventhRingTrueBodySkill(
          context.type || '强攻系',
          context.talentTier || '正常',
          Math.max(100, Number(context.age || 1000)),
          Math.max(1, Number(context.ringIndex || 1)),
          Math.max(0, Math.min(100, Number(context.compatibility || 100))),
          context.textContext || {},
        )
      : autoGenerateSkill(
          context.type || '强攻系',
          context.talentTier || '正常',
          Math.max(100, Number(context.age || 1000)),
          Math.max(1, Number(context.ringIndex || 1)),
          Math.max(0, Math.min(100, Number(context.compatibility || 100))),
          Array.isArray(context.preferredSecondary) ? context.preferredSecondary : [],
          Number(context.currentTick || 0),
          {
            passiveMode: context.passiveMode === true,
            passiveName: context.passiveName || skill.魂技名 || '',
          },
        );
    Object.keys(skill).forEach(key => delete skill[key]);
    skill.魂技名 = generated.魂技名 || AI_TODO_SKILL_NAME;
    skill.画面描述 = generated.画面描述 || AI_TODO_SKILL_VISUAL;
    skill.效果描述 = generated.效果描述 || AI_TODO_SKILL_EFFECT;
    skill._效果数组 = clonePackedSkillEffects(generated._效果数组 || []);
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
    ensureSkillStructGenerated(skill, contextFactory(skill, skillName) || {});
  });
  return skillMap || {};
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
    fed_coin: z.coerce.number().prefault(0).describe('联邦币'),
    star_coin: z.coerce.number().prefault(0).describe('星罗币'),
    tang_pt: z.coerce.number().prefault(0).describe('唐门积分'),
    shrek_pt: z.coerce.number().prefault(0).describe('史莱克徽章/积分'),
    blood_pt: z.coerce.number().prefault(0).describe('血神军团功勋'),
  })
  .prefault({});
  const BodyPartSchema = z
  .object({
    外观特征: z.string().prefault('待生成(请描写该部位的静态外观与天生敏感特征，如：粉嫩/修长/天生敏感)'),
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
    wardrobe: z
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
    outfit: z.string().prefault('待补全(从衣柜中选择当前套装名)').describe('当前着装，值为衣柜里某一套的名称'),
  })
  .prefault({ outfit: '待补全(从衣柜中选择当前套装名)' });
const EquipmentSchema = z
  .object({
    wpn: z
      .object({
        name: z.string().prefault('无'),
        tier: z.string().prefault('无').describe('品阶如: 魂导器/神器/超神器'),
        traits: z
          .record(z.string(), z.object({ 描述: z.string().prefault('无') }).prefault({}))
          .prefault({})
          .describe('附带的绝对特性，如:无视防御/吞噬/绝对禁锢'),
        stats_bonus: z
          .object({
            sp_max: z.coerce.number().prefault(0),
            men_max: z.coerce.number().prefault(0),
            str: z.coerce.number().prefault(0),
            def: z.coerce.number().prefault(0),
            agi: z.coerce.number().prefault(0),
            vit_max: z.coerce.number().prefault(0),
          })
          .prefault({}),
      })
      .prefault({}),
    arm: z.string().prefault('无'),
    armor: z
      .object({
        lv: z.coerce.number().prefault(0),
        name: z.string().prefault('无'),
        domain: z.string().prefault('无'),
        material: z.string().prefault('无').describe('锻造金属材质'),
        equip_status: z.string().prefault('未装备'),
        parts: z
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
        _stats_bonus: z
          .object({
            lv_equiv: z.coerce.number().prefault(0),
            sp_max: z.coerce.number().prefault(0),
            men_max: z.coerce.number().prefault(0),
            str: z.coerce.number().prefault(0),
            def: z.coerce.number().prefault(0),
            agi: z.coerce.number().prefault(0),
            vit_max: z.coerce.number().prefault(0),
          })
          .prefault({}),
        _is_rejected: z.boolean().prefault(false),
      })
      .prefault({}),
    mech: z
      .object({
        lv: z.string().prefault('无'),
        type: z.string().prefault('无'),
        material: z.string().prefault('无').describe('机甲金属材质'),
        status: z.string().prefault('完好'),
        equip_status: z.string().prefault('未装备'),
        weapon: z.string().prefault('无'),
        品质系数: z.coerce.number().prefault(1.0).describe('0.8为劣质，1.0为标准，1.5以上为极品，最高可达2.0'),
        _stats_bonus: z
          .object({
            sp_max: z.coerce.number().prefault(0),
            men_max: z.coerce.number().prefault(0),
            str: z.coerce.number().prefault(0),
            def: z.coerce.number().prefault(0),
            agi: z.coerce.number().prefault(0),
            vit_max: z.coerce.number().prefault(0),
          })
          .prefault({}),
      })
      .prefault({}),
    accessories: z
      .record(z.string(), z.object({ 描述: z.string().prefault('无') }).prefault({}))
      .prefault({})
      .describe('储物魂导器等杂项'),
  })
  .prefault({})
  .transform(equip => {
    if (equip.armor.lv > 0) {
      let totalQuality = 0,
        count = 0;
      let maxQ = -Infinity,
        minQ = Infinity;

      _(equip.armor.parts).forEach(p => {
        if (p.状态 !== '未打造' && p.状态 !== '重创') {
          totalQuality += p.品质系数;
          count++;
          if (p.品质系数 > maxQ) maxQ = p.品质系数;
          if (p.品质系数 < minQ) minQ = p.品质系数;
        }
      });

      if (count > 0) {
        let avgQ = totalQuality / count;
        let base = ArmorBaseStats[equip.armor.lv] || ArmorBaseStats[1];
        let mult = count === 10 ? avgQ : 0.05 * avgQ * count;

        function getQualityTier(q) {
          if (q < 1.0) return 0;
          if (q <= 1.2) return 1;
          if (q <= 1.5) return 2;
          if (q <= 1.8) return 3;
          return 4;
        }
        equip.armor._is_rejected = false;
        if (count > 1 && getQualityTier(maxQ) !== getQualityTier(minQ)) {
          mult *= 0.2;
          equip.armor._is_rejected = true;
        }

        equip.armor._stats_bonus.sp_max = Math.floor(base.sp_max * mult);
        equip.armor._stats_bonus.men_max = Math.floor(base.men_max * mult);
        equip.armor._stats_bonus.str = Math.floor(base.str * mult);
        equip.armor._stats_bonus.agi = Math.floor(base.agi * mult);
        equip.armor._stats_bonus.vit_max = Math.floor(base.vit_max * mult);
        equip.armor._stats_bonus.def = Math.floor(base.str * mult);
      } else {
        equip.armor._stats_bonus = { lv_equiv: 0, sp_max: 0, men_max: 0, str: 0, def: 0, agi: 0, vit_max: 0 };
      }
    } else {
      equip.armor._stats_bonus = { lv_equiv: 0, sp_max: 0, men_max: 0, str: 0, def: 0, agi: 0, vit_max: 0 };
    }

    if (equip.mech.lv !== '无' && equip.mech.status !== '重创') {
      let base = MechBaseStats[equip.mech.lv];
      if (base) {
        let mult = equip.mech.品质系数 || 1.0;
        equip.mech._stats_bonus.sp_max = Math.floor(base.sp_max * mult);
        equip.mech._stats_bonus.men_max = Math.floor(base.men_max * mult);
        equip.mech._stats_bonus.str = Math.floor(base.str * mult);
        equip.mech._stats_bonus.agi = Math.floor(base.agi * mult);
        equip.mech._stats_bonus.vit_max = Math.floor(base.vit_max * mult);
        equip.mech._stats_bonus.def = Math.floor(base.str * mult);
      }
    } else {
      equip.mech._stats_bonus = { sp_max: 0, men_max: 0, str: 0, def: 0, agi: 0, vit_max: 0 };
    }

    return equip;
  });
const SkillStructSchema = z
  .object({
    魂技名: z.string().prefault(AI_TODO_SKILL_NAME),
    画面描述: z.string().prefault(AI_TODO_SKILL_VISUAL),
    效果描述: z.string().prefault(AI_TODO_SKILL_EFFECT),
    附带属性: z.array(z.string()).prefault([]),
    _效果数组: z.array(z.any()).prefault([]).describe('打包后的_效果数组，供前端显示和后续战斗模块解析'),
  })
  .prefault({});
const SoulBoneSchema = z
  .record(
    z.string(),
    z
      .object({
        名称: z.string().prefault('无'),
        name: z.string().prefault('无'),
        表象名称: z.string().prefault('无'),
        年限: z.coerce.number().prefault(0),
        age: z.coerce.number().prefault(0),
        来源: z.string().prefault('无'),
        状态: z.string().prefault('已装载'),
        status: z.string().prefault('已装载'),
        品质: z.string().prefault('无'),
        品阶: z.string().prefault('无'),
        描述: z.string().prefault('无'),
        附带技能: z.record(z.string(), SkillStructSchema).prefault({}),
        stats_bonus: z
          .object({
            str: z.coerce.number().prefault(0),
            def: z.coerce.number().prefault(0),
            agi: z.coerce.number().prefault(0),
            vit_max: z.coerce.number().prefault(0),
            men_max: z.coerce.number().prefault(0),
            sp_max: z.coerce.number().prefault(0),
          })
          .prefault({}),
      })
      .prefault({}),
  )
  .prefault({});
const AdditiveStatBonusSchema = z
  .object({
    str: z.coerce.number().prefault(0),
    def: z.coerce.number().prefault(0),
    agi: z.coerce.number().prefault(0),
    vit_max: z.coerce.number().prefault(0),
    men_max: z.coerce.number().prefault(0),
    sp_max: z.coerce.number().prefault(0),
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
    bloodline: z.string().prefault('无').describe('血脉名称'),
    seal_lv: z.coerce.number().prefault(0).describe('血脉封印解除层数'),
    core: z.string().prefault('未凝聚').describe('气血魂核状态'),
    life_fire: z.boolean().prefault(false).describe('生命之火状态'),
    属性体系: z.string().prefault(AI_TODO_ATTRIBUTE_SYSTEM).describe('血脉属性体系：无/元素/五行'),
    已解锁属性: z.array(z.string()).prefault([]).describe('血脉当前已经真正获得的属性列表'),
    可容纳属性: z.array(z.string()).prefault([AI_TODO_ATTRIBUTE_CAPACITY]).describe('血脉理论可承载的属性上限'),
    skills: z.record(z.string(), SkillStructSchema).prefault({}).describe('血脉主动散技(无魂环)'),
    passives: z.record(z.string(), SkillStructSchema).prefault({}).describe('血脉被动特性'),
    permanent_bonuses: z
      .record(z.string(), BloodlinePermanentBonusSchema)
      .prefault({})
      .describe('血脉永久成长节点，按解封时当前属性固化为固定数值'),
    blood_rings: z
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
    age: z.coerce.number().prefault(0).describe('年龄(出场必填)'),
    gender: z.string().prefault('待补全(填写性别：男/女)').describe('性别'),
    lv: z
      .any()
      .transform(val => {
        if (val === '准神') return 99.5;
        let num = Number(val);
        return isNaN(num) ? 1 : num;
      })
      .prefault(1),
    last_herb_lv: z.coerce.number().prefault(-20).describe('上次吸收灵物的等级'),
    lv_penalty: z.coerce.number().prefault(0).describe('违规吸收导致的等级上限永久扣除'),
    type: z.string().prefault('强攻系').describe('魂师系别'),
    talent_tier: z.string().prefault('正常').describe('天赋梯队'),
    background: z
      .string()
      .prefault('待补全(填写背景阶层：顶级势力/一流势力/普通势力/平民)')
      .describe('背景阶层标签：顶级势力/一流势力/普通势力/平民'),
    is_evil: z.boolean().prefault(false).describe('是否为邪魂师'),
    hidden_variance: z.coerce.number().prefault(0).describe('先天底子波动值'),
    innate_sp_lv: z.coerce.number().prefault(0).describe('先天魂力'),
    talent_roll: z.coerce.number().prefault(0).describe('天赋检定最终得分(D100+补正)'),

    sp: z.coerce.number().prefault(10).describe('当前魂力'),
    sp_max: z.coerce.number().prefault(10).describe('魂力上限'),
    men: z.coerce.number().prefault(10).describe('当前精神力'),
    men_max: z.coerce.number().prefault(10).describe('精神力上限'),
    _men_realm: z.string().prefault('灵元境'),

    str: z.coerce.number().prefault(10).describe('力量'),
    def: z.coerce.number().prefault(10).describe('防御'),
    agi: z.coerce.number().prefault(10).describe('敏捷'),
    vit: z.coerce.number().prefault(10).describe('当前体力'),
    vit_max: z.coerce.number().prefault(10).describe('体力上限'),

    multiplier: z
      .object({
        cultivation: z.coerce.number().prefault(1.0).describe('修炼系数'),
        str: z.coerce.number().prefault(1.0),
        def: z.coerce.number().prefault(1.0),
        agi: z.coerce.number().prefault(1.0),
        vit_max: z.coerce.number().prefault(1.0),
        men_max: z.coerce.number().prefault(1.0),
      })
      .prefault({}),

    trained_bonus: z
      .object({
        str: z.coerce.number().prefault(0),
        def: z.coerce.number().prefault(0),
        agi: z.coerce.number().prefault(0),
        vit_max: z.coerce.number().prefault(0),
        men_max: z.coerce.number().prefault(0),
        sp_max: z.coerce.number().prefault(0),
      })
      .prefault({}),

    conditions: z
      .record(
        z.string(),
        z
          .object({
            类型: z.string().prefault('buff'),
            层数: z.coerce.number().prefault(1),
            描述: z.string().prefault('无'),
            duration: z.coerce.number().prefault(1).describe('剩余持续回合数，每回合结算阶段减1'),

            stat_mods: z
              .object({
                str: z.coerce.number().prefault(1.0),
                def: z.coerce.number().prefault(1.0),
                agi: z.coerce.number().prefault(1.0),
                sp_max: z.coerce.number().prefault(1.0),
              })
              .prefault({}),

            combat_effects: z
              .object({
                dot_damage: z.coerce.number().prefault(0).describe('每回合结算阶段扣除的绝对体力值(如：撕裂/中毒)'),
                skip_turn: z.boolean().prefault(false).describe('是否强制跳过本回合宣告(如：眩晕/冰封/镇狱禁锢)'),
                armor_pen: z.coerce.number().prefault(0).describe('攻击时无视目标防御的百分比(如：粉碎/破甲)'),
              })
              .prefault({}),
          })
          .prefault({}),
      )
      .prefault({}),
  })
  .prefault({})
  .transform(data => {
    data.trained_bonus = createNumericStatBonusMap(data.trained_bonus);

    if (data.hidden_variance === 0) {
      data.hidden_variance = 0.95 + Math.random() * 0.1;
    }

    if (data.lv > 10 && data.trained_bonus.str === 0 && data.trained_bonus.men_max === 0) {
      const hardWorkFactor =
        { 绝世妖孽: 1.6, 顶级天才: 1.2, 天才: 1.0, 优秀: 0.8, 正常: 0.5, 劣等: 0.2 }[data.talent_tier] || 0.5;
      const baseForTrace = getBaseStats(data.lv);
      const traceMultiplier = 0.005 * (data.lv - 10) * hardWorkFactor;
      data.trained_bonus.str = Math.floor(baseForTrace.str * traceMultiplier);
      data.trained_bonus.def = Math.floor(baseForTrace.def * traceMultiplier);
      data.trained_bonus.agi = Math.floor(baseForTrace.agi * traceMultiplier);
      data.trained_bonus.vit_max = Math.floor(baseForTrace.vit_max * traceMultiplier);
      data.trained_bonus.men_max = Math.floor(baseForTrace.men_max * traceMultiplier);
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

function normalizeRelationAnalysisTopTargetsInput(value = []) {
  const normalizeItem = item => ({
    target: String(item?.target || '无').trim() || '无',
    relation: String(item?.relation || '陌生').trim() || '陌生',
    favor: Number(item?.favor || 0),
    route: String(item?.route || '朋友线').trim() || '朋友线',
    reason: String(item?.reason || '无').trim() || '无',
    recommended_action: String(item?.recommended_action || item?.recommendedAction || '继续观察').trim() || '继续观察',
  });
  if (Array.isArray(value)) return value.filter(item => item && typeof item === 'object').map(normalizeItem);
  if (value && typeof value === 'object') {
    if ('target' in value || 'reason' in value || 'recommended_action' in value || 'recommendedAction' in value) {
      return [normalizeItem(value)];
    }
    return Object.values(value)
      .filter(item => item && typeof item === 'object')
      .map(normalizeItem);
  }
  return [];
}

function normalizeCleanupNameArray(value = []) {
  return Array.from(
    new Set((Array.isArray(value) ? value : [value]).map(item => String(item || '').trim()).filter(Boolean)),
  );
}

function stripRelationAnalysisRemovedTargets(analysis = {}, removedNames = new Set()) {
  if (!analysis || typeof analysis !== 'object' || !removedNames.size) return analysis;
  if (removedNames.has(String(analysis.focus_target || '').trim())) analysis.focus_target = '无';
  if (Array.isArray(analysis.top_targets)) {
    analysis.top_targets = analysis.top_targets.filter(item => !removedNames.has(String(item?.target || '').trim()));
  }
  if (Array.isArray(analysis.blocked_targets)) {
    analysis.blocked_targets = analysis.blocked_targets.filter(
      item => !removedNames.has(String(item?.target || '').trim()),
    );
  }
  ['romance_candidates', 'trust_targets', 'risk_targets', 'same_location_targets', 'contactable_targets'].forEach(
    key => {
      if (!Array.isArray(analysis[key])) return;
      analysis[key] = analysis[key].filter(item => !removedNames.has(String(item || '').trim()));
    },
  );
  if (analysis.focus_target === '无' && Array.isArray(analysis.top_targets) && analysis.top_targets.length > 0) {
    analysis.focus_target = String(analysis.top_targets[0]?.target || '无').trim() || '无';
  }
  if ((!Array.isArray(analysis.top_targets) || analysis.top_targets.length === 0) && analysis.focus_target === '无') {
    analysis.summary = '当前尚未积累足够的人物关系数据。';
  }
  return analysis;
}

function applyCleanupRequest(data = {}) {
  const request = data?.sys?.cleanup_request;
  if (!request || typeof request !== 'object' || String(request.action || '无').trim() !== 'apply') return data;
  const playerName = String(data?.sys?.player_name || '').trim();
  const removedChars = normalizeCleanupNameArray(request.characters).filter(name => name && name !== playerName);
  const removedCharSet = new Set(removedChars);
  const removedLocations = normalizeCleanupNameArray(request.dynamic_locations);
  const removedLocationParentMap = {};

  removedLocations.forEach(locName => {
    removedLocationParentMap[locName] =
      String(data?.world?.dynamic_locations?.[locName]?.归属父节点 || '无').trim() || '无';
    if (data?.world?.dynamic_locations && locName in data.world.dynamic_locations)
      delete data.world.dynamic_locations[locName];
  });

  removedChars.forEach(charName => {
    if (data?.char && charName in data.char) delete data.char[charName];
    if (data?.world?.combat?.participants && charName in data.world.combat.participants) {
      delete data.world.combat.participants[charName];
    }
  });

  _(data?.char || {}).forEach(charData => {
    if (!charData || typeof charData !== 'object') return;
    if (request.purge_relations !== false) {
      if (charData.social?.relations && typeof charData.social.relations === 'object') {
        removedChars.forEach(charName => delete charData.social.relations[charName]);
      }
      if (charData.social?.relation_analysis && typeof charData.social.relation_analysis === 'object') {
        stripRelationAnalysisRemovedTargets(charData.social.relation_analysis, removedCharSet);
      }
    }
    if (request.reset_location_refs === false || !charData.status || typeof charData.status !== 'object') return;
    const currentLoc = String(charData.status.loc || '').trim();
    if (!currentLoc) return;
    removedLocations.forEach(locName => {
      if (currentLoc !== locName && !currentLoc.endsWith(`-${locName}`)) return;
      const parentName = removedLocationParentMap[locName];
      charData.status.loc = parentName && parentName !== '无' ? `斗罗大陆-${parentName}` : '未知';
    });
  });

  data.sys.cleanup_request = {
    action: '无',
    characters: [],
    dynamic_locations: [],
    purge_relations: true,
    reset_location_refs: true,
  };
  return data;
}

const CharacterSchema = z
  .object({
    stat: StatsSchema,
    equip: EquipmentSchema,
    appearance: AppearanceSchema,
    clothing: ClothingSchema,
    personality: z.string().prefault(AI_TODO_PERSONALITY).describe('角色的性格特征，随经历可能发生改变'),
    soul_bone: SoulBoneSchema,
    bloodline_power: BloodlinePowerSchema,
    energy: z
      .object({
        core: z
          .object({
            数量: z.coerce.number().prefault(0),
            progress: z.coerce.number().prefault(0).describe('凝聚进度(%)'),
          })
          .prefault({}),
      })
      .prefault({}),
    wealth: WealthSchema,
nsfw: z
      .object({
        arousal: z.coerce.number().prefault(0).describe('当前发情度/催情值(0-100)'),
        sensitivity: z.coerce.number().prefault(10).describe('身体整体敏感度基础值'),
        development_level: z.coerce.number().prefault(0).describe('身体整体开发度/调教进度(0-100)'),
        
        fetishes: z.array(z.string()).prefault(['待生成(请根据角色经历，填写已觉醒的特殊癖好标签)']),
        fantasies: z.array(z.string()).prefault(['待生成(请根据角色隐藏的性格，描写其内心深处渴望被对待的私密方式)']),
        
        menstrual_offset: z.coerce.number().prefault(() => Math.floor(Math.random() * 4032)).describe('初始生理期偏移量(28天=4032tick)'),
        conception_tick: z.coerce.number().prefault(-1).describe('受孕时的tick，-1表示未怀孕'),
        pregnancy_father: z.string().prefault('无').describe('孩子父亲'),

        _menstrual_stage: z.string().prefault('计算中...').describe('当前生理阶段(只读)'),
        _pregnancy_days: z.coerce.number().prefault(0).describe('当前怀孕天数(只读)'),
         measurements: z
          .object({
            胸围: z.coerce.number().prefault(0),
            腰围: z.coerce.number().prefault(0),
            臀围: z.coerce.number().prefault(0),
            罩杯: z.string().prefault('待生成(请根据角色体型填写，如A/B/C/D/E)'),
            身材描述: z.string().prefault('待生成(请描写其身材曲线与肉感)'),
          })
          .prefault({}),

        _has_menarche: z.boolean().prefault(false).describe('是否已来初潮(底层只读)'),
        menstrual_offset: z.coerce.number().prefault(0),     
        body_parts: z
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
        intimate_wear: z
          .object({
            内衣: z.string().prefault('待生成(请根据当前情境描写具体内衣款式，如蕾丝胸罩/真空/拘束具)'),
            内裤: z.string().prefault('待生成(请描写具体内裤款式，如丁字裤/C字裤/真空/贞操带)'),
            特殊道具: z.array(z.string()).prefault(['待生成(若体内或体表佩戴了跳蛋/项圈等道具请在此列出)']),
          })
          .prefault({}),

        experience_counts: z
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

        _recent_climax_tick: z.coerce.number().prefault(0).describe('最近一次高潮发生的tick'),
      })
      .prefault({}),


    status: z
      .object({
        loc: z.string().prefault(AI_TODO_STATUS_LOC).describe('当前位置绝对路径'),
        current_x: z.coerce.number().prefault(-1).describe('当前位置横坐标'),
        current_y: z.coerce.number().prefault(-1).describe('当前位置纵坐标'),
        alive: z.boolean().prefault(true),
        wound: z.string().prefault('无'),
        action: z.string().prefault('日常').describe('行为状态: 日常/冥想/战斗/睡眠/凝聚魂核'),
        active_domain: z.string().prefault('无').describe('当前正在展开的领域名称(斗铠/精神/武魂领域)'),
        consuming_herb_age: z.coerce.number().prefault(0).describe('当前正在吸收的灵物年份(阅后即焚)'),
      })
      .prefault({}),
    unlocked_knowledges: z.array(z.string()).prefault([]).describe('该角色已解锁的核心情报列表'),
    knowledge_unlock_request: z
      .object({
        content: z.string().prefault('无').describe('解锁的情报内容(用一句话自然语言概括)'),
        impact: z.coerce.number().prefault(0).describe('对世界线的破坏度(0-10，未填写时为0)'),
      })
      .prefault({}),

    hunt_request: z
      .object({
        killed_age: z.coerce.number().prefault(0).describe('击杀现实魂兽年限'),
        is_ferocious: z.boolean().prefault(false).describe('是否为凶兽(十万年以上)'),
      })
      .prefault({}),
    tower_records: z
      .object({
        max_floor: z.coerce.number().prefault(0).describe('历史最高通关层数'),
        discount_available: z
          .record(z.string(), z.boolean().prefault(true))
          .prefault({})
          .describe('各层五折购买资格，key为层数，true表示未使用'),
      })
      .prefault({}),
    ascension_request: z
      .object({
        ticket_type: z.string().prefault('无').describe('本次使用的升灵台门票名'),
        spirit_key: z.string().prefault('无').describe('目标武魂槽位，如：第一武魂'),
        soul_spirit_key: z.string().prefault('无').describe('目标魂灵槽位，如：第一魂灵'),
        gain_age: z.coerce.number().prefault(0).describe('本次升灵增加的魂灵年限'),
      })
      .prefault({}),
    tower_request: z
      .object({
        action: z.string().prefault('无').describe('魂灵塔操作类型，如：冲塔'),
        cleared_floor: z.coerce.number().prefault(0).describe('本次结算的最高通关层数'),
      })
      .prefault({}),

    interact_request: z
      .object({
        target_npc: z.string().prefault('无').describe('互动对象姓名'),
        action: z.string().prefault('无').describe('互动类型：闲聊/送礼/切磋/请教/双修/表白'),
        item_used: z.string().prefault('无').describe('互动使用物品'),
        ai_score: z.coerce.number().prefault(0).describe('互动结果分值'),
      })
      .prefault({}),
    promotion_request: z
      .object({
        target_faction: z.string().prefault('无').describe('目标势力(如:唐门/战神殿)'),
        target_title: z.string().prefault('无').describe('申请职位(如:红级/预备战神)'),
      })
      .prefault({}),

    donate_request: z
      .object({
        item_name: z.string().prefault('无').describe('捐献物品名称'),
        target_faction: z.string().prefault('无').describe('目标势力'),
        quantity: z.coerce.number().prefault(1).describe('数量'),
      })
      .prefault({}),
    abyss_kill_request: z
      .object({
        kill_tier: z.string().prefault('无').describe('击杀级别：低阶生物/中阶生物/高阶生物/深渊王者'),
        quantity: z.coerce.number().prefault(1).describe('击杀数量'),
      })
      .prefault({}),

    combat_history: z
      .record(
        z.string(),
        z.object({ count: z.coerce.number().prefault(0), last_tick: z.coerce.number().prefault(0) }).prefault({}),
      )
      .prefault({})
      .transform(data => _(data).entries().takeRight(20).fromPairs().value()),

    job: z
      .record(
        z.string(),
        z
          .object({
            lv: z.coerce.number().prefault(0),
            exp: z.coerce.number().prefault(0),
            title: z.string().prefault('无'),
            core_tech: z.record(z.string(), z.boolean().prefault(true)).prefault({}),
            limits: z
              .object({ max_fusion: z.coerce.number().prefault(1), success_rate: z.coerce.number().prefault(0) })
              .prefault({}),
          })
          .prefault({}),
      )
      .prefault({})
      .transform(jobs => {
        _(jobs).forEach(jobData => {
          while (jobData.lv < 9 && jobData.exp >= JobExpThresholds[jobData.lv]) {
            jobData.lv++;
          }
          jobData.limits.max_fusion = Math.max(1, Math.floor(jobData.lv / 2));

          if (jobData.lv === 9) {
            let overflowExp = Math.max(0, jobData.exp - 3000000);
            let extraRate = Math.floor(overflowExp / 500000);
            jobData.limits.success_rate = Math.min(50, 10 + extraRate);
          } else if (jobData.lv > 0) {
            let currentBaseExp = JobExpThresholds[jobData.lv - 1];
            let nextLevelExp = JobExpThresholds[jobData.lv];
            let progress = (jobData.exp - currentBaseExp) / (nextLevelExp - currentBaseExp);
            progress = Math.max(0, Math.min(1, progress));

            if (jobData.lv % 2 === 0) {
              jobData.limits.success_rate = Math.floor(80 + 15 * progress);
            } else {
              jobData.limits.success_rate = Math.floor(30 + 40 * progress);
            }
          } else {
            jobData.limits.success_rate = 0;
          }
        });
        return jobs;
      }),

    spirit: z
      .object({
        第一武魂: z
          .object({
            表象名称: z.string().prefault(AI_TODO_SPIRIT_NAME).describe('武魂名'),
            描述: z.string().prefault(AI_TODO_SPIRIT_DESC).describe('武魂的具体形态与能力描述'),
            type: z.string().prefault('强攻系'),
            属性体系: z.string().prefault(AI_TODO_ATTRIBUTE_SYSTEM).describe('武魂属性体系：无/元素/五行'),
            已解锁属性: z.array(z.string()).prefault([]).describe('当前已经真正获得的属性列表'),
            可容纳属性: z.array(z.string()).prefault([AI_TODO_ATTRIBUTE_CAPACITY]).describe('武魂理论可承载的属性上限'),
            soul_spirits: z
              .record(
                z.string().describe('魂灵槽位(如:第一魂灵)'),
                z
                  .object({
                    表象名称: z.string().prefault(AI_TODO_SOUL_SPIRIT_NAME).describe('魂灵物种名'),
                    描述: z.string().prefault(AI_TODO_SOUL_SPIRIT_DESC).describe('魂灵描述，由 AI 维护'),
                    年限: z.coerce.number().prefault(0),
                    品质: z.string().prefault(AI_TODO_SOUL_SPIRIT_QUALITY).describe('魂灵品质：F/D/C/B/A/S/S+'),
                    契合度: z.coerce.number().prefault(60).describe('与武魂的契合度(0-100)，影响融合难度与发挥'),
                    附机制候选: z.array(z.string()).prefault(['无']).describe('魂灵附机制候选'),
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
                      .prefault({})
                      .describe('魂灵战力面板'),
                    rings: z
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
            custom_skills: z
              .record(z.string().describe('自创魂技名称'), SkillStructSchema)
              .prefault({})
              .describe('不依赖固定魂环位的武魂自创魂技'),
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
            soul_spirits: z
              .record(
                z.string().describe('魂灵槽位(如:第一魂灵)'),
                z
                  .object({
                    表象名称: z.string().prefault(AI_TODO_SOUL_SPIRIT_NAME).describe('魂灵物种名'),
                    描述: z.string().prefault(AI_TODO_SOUL_SPIRIT_DESC).describe('魂灵描述，由 AI 维护'),
                    年限: z.coerce.number().prefault(0),
                    品质: z.string().prefault(AI_TODO_SOUL_SPIRIT_QUALITY).describe('魂灵品质：F/D/C/B/A/S/S+'),
                    契合度: z.coerce.number().prefault(60).describe('与武魂的契合度(0-100)，影响融合难度与发挥'),
                    附机制候选: z.array(z.string()).prefault(['无']).describe('魂灵附机制候选'),
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
                      .prefault({})
                      .describe('魂灵战力面板'),
                    rings: z
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
            custom_skills: z
              .record(z.string().describe('自创魂技名称'), SkillStructSchema)
              .prefault({})
              .describe('不依赖固定魂环位的武魂自创魂技'),
          })
          .optional(),
      })
      .describe('固定武魂槽位')
      .prefault({}),

    arts: z
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
    secret_skills: z
      .record(z.string().describe('秘技名称'), SkillStructSchema)
      .prefault({})
      .describe('非魂环类统一技能容器，如唐门绝学、宗门秘技等'),
    special_abilities: z
      .record(z.string().describe('能力名称'), SkillStructSchema)
      .prefault({})
      .describe('统一特殊能力技能容器'),
    martial_fusion_skills: z
      .record(
        z.string().describe('融合技名称'),
        z
          .object({
            fusion_mode: z
              .enum(['partner', 'self'])
              .prefault('partner')
              .describe('融合模式：partner=普通武魂融合技；self=自体武魂融合技'),
            partner: z.string().prefault('无').describe('partner模式下的融合对象/羁绊队友姓名；self模式固定为"无"'),
            source_spirits: z
              .array(z.enum(['第一武魂', '第二武魂']))
              .prefault([])
              .describe('参与融合的武魂槽位。自体融合通常为[第一武魂, 第二武魂]'),
            skill_data: SkillStructSchema,
          })
          .prefault({}),
      )
      .prefault({})
      .describe('武魂融合技列表（统一区分自体融合与普通融合）'),
    spiritual_domain: z
      .object({
        name: z.string().prefault('无').describe('精神领域名称，例如：时光回溯、情绪剥夺'),
        description: z.string().prefault('无').describe('领域效果的具体描述，用自然语言描写'),
        is_active: z
          .boolean()
          .prefault(false)
          .describe('当前是否展开，开启门槛：基础精神力>25000。战斗中开启需消耗8000精神/回合'),
        maintenance_cost: z
          .object({
            men: z.coerce.number().prefault(8000),
          })
          .prefault({ men: 8000 }),
        combat_modifiers: z
          .object({
            conditional_evasion: z
              .object({
                enabled: z
                  .boolean()
                  .prefault(false)
                  .describe('【开启条件】若领域包含时空倒流、攻击无效化等闪避法则，请设为true'),
                compare_stat: z.string().prefault('men').describe("【比对属性】填'men'(精神力比拼)"),
                max_ratio: z.coerce
                  .number()
                  .prefault(1.5)
                  .describe('【容错倍率】填1.5，意为敌方精神力不超过我方1.5倍时法则生效'),
                success_msg: z
                  .string()
                  .prefault('')
                  .describe('【战报文案】例如：时光倒流，将状态回溯至受击前，伤害无效！'),
              })
              .prefault({}),
            stat_suppression: z
              .object({
                enabled: z
                  .boolean()
                  .prefault(false)
                  .describe('【开启条件】若领域包含剥夺情绪、降维等削弱法则，请设为true'),
                target_stat: z
                  .string()
                  .prefault('all')
                  .describe("【削弱目标】填'all'(全属性)或'str'(力量)/'men'(精神)等"),
                reduce_ratio: z.coerce.number().prefault(0.3).describe('【削弱比例】填0.1~0.5之间，0.3代表削弱30%属性'),
              })
              .prefault({}),
            absolute_hit_true_dmg: z
              .object({
                enabled: z
                  .boolean()
                  .prefault(false)
                  .describe('【开启条件】若领域包含因果律、必定命中、真实伤害、无视防御的法则，请设为true'),
                true_dmg_ratio: z.coerce
                  .number()
                  .prefault(0.1)
                  .describe('【真伤比例】附加自身精神力上限的百分之多少作为真实伤害，默认0.1'),
                success_msg: z
                  .string()
                  .prefault('')
                  .describe('【战报文案】例如：因果已定，无视一切防御直接粉碎精神之海！'),
              })
              .prefault({}),
            time_dilation: z
              .object({
                enabled: z
                  .boolean()
                  .prefault(false)
                  .describe('【开启条件】若领域包含时间减缓、重力禁锢等拉长敌方前摇的法则，请设为true'),
                cast_time_multiplier: z.coerce
                  .number()
                  .prefault(2.0)
                  .describe('【前摇惩罚倍率】填2.0，意为敌方所有技能蓄力时间翻倍'),
                success_msg: z
                  .string()
                  .prefault('')
                  .describe('【战报文案】例如：时间沼泽降临，对方的动作变得如同慢放一般。'),
              })
              .prefault({}),
            soul_leech: z
              .object({
                enabled: z
                  .boolean()
                  .prefault(false)
                  .describe('【开启条件】若领域包含吞噬、生命汲取、血气反哺等吸血法则，请设为true'),
                leech_ratio: z.coerce
                  .number()
                  .prefault(0.5)
                  .describe('【吸取比例】填0.5，意为对敌方造成的精神/生命伤害的50%将恢复给自身'),
                success_msg: z
                  .string()
                  .prefault('')
                  .describe('【战报文案】例如：吞噬领域将掠夺来的生命能量疯狂反哺己身！'),
              })
              .prefault({}),
            illusion_misdirection: z
              .object({
                enabled: z
                  .boolean()
                  .prefault(false)
                  .describe('【开启条件】若领域包含幻境、精神致盲、让敌方动作偏移落空的法则，请设为true'),
                misdirection_chance: z.coerce
                  .number()
                  .prefault(0.4)
                  .describe('【偏移概率】填0.4，意为敌方有40%概率技能丢失目标或跳过回合'),
                success_msg: z
                  .string()
                  .prefault('')
                  .describe('【战报文案】例如：大梦无觉，对方彻底迷失在幻境中，技能偏离了目标！'),
              })
              .prefault({}),
          })
          .prefault({}),
      })
      .prefault({}),

    social: z
      .object({
        reputation: z.coerce.number().prefault(0),
        _fame_level: z.string().prefault('籍籍无名'),
        main_identity: z.string().prefault(AI_TODO_MAIN_IDENTITY).describe('当前主要公开身份'),
        _public_intel: z.boolean().prefault(false).describe('是否为公开情报(声望>5000自动为true)'),
        factions: z
          .record(
            z.string(),
            z.object({ 身份: z.string().prefault('无'), 权限级: z.coerce.number().prefault(0) }).prefault({}),
          )
          .prefault({}),
        titles: z
          .record(
            z.string(),
            z.object({ 来源: z.string().prefault('无'), 声望加成: z.coerce.number().prefault(0) }).prefault({}),
          )
          .prefault({}),
        relations: z
          .record(
            z.string(),
            z
              .object({
                关系: z.string().prefault('陌生'),
                好感度: z.coerce.number().prefault(0),
                relation_route: z.string().prefault('朋友线').describe('终极分支: 朋友线/恋人线'),
                npc_job: z.string().prefault('无'),
                favor_buff: z.string().prefault('无'),
                _relation_stage: z.string().prefault('陌生').describe('结构化关系阶段，默认与关系称谓同步'),
                _next_stage: z.string().prefault('认识').describe('下一阶段名称'),
                _next_stage_threshold: z.coerce.number().prefault(11).describe('达到下一阶段所需最低好感度'),
                _route_switchable: z.boolean().prefault(false).describe('当前是否允许切入恋人线等特殊路线'),
                _route_lock_reason: z.string().prefault('好感度不足').describe('路线切换受限时的原因'),
                _progress_note: z.string().prefault('无').describe('当前关系推进提示'),
                _availability: z.string().prefault('未知').describe('关系维护优先级：高风险/待接触/可接触/优先维护'),
                last_interact_tick: z.coerce.number().prefault(0).describe('最近一次互动发生的 tick'),
                last_interact_action: z.string().prefault('无').describe('最近一次互动动作'),
                recent_favor_delta: z.coerce.number().prefault(0).describe('最近一次互动导致的好感变化'),
                _current_relation_bonus: z.string().prefault('无').describe('当前已激活的关系加成说明'),
                _next_unlock_bonus: z.string().prefault('无').describe('下一档可解锁的羁绊加成说明'),
                _next_unlock_threshold: z.coerce.number().prefault(30).describe('下一档羁绊加成所需好感度'),
              })
              .prefault({}),
          )
          .prefault({}),
        relation_analysis: z
          .object({
            summary: z.string().prefault('当前尚未积累足够的人物关系数据。'),
            focus_target: z.string().prefault('无'),
            top_targets: z
              .any()
              .transform(value => normalizeRelationAnalysisTopTargetsInput(value))
              .prefault([]),
            recommended_actions: z.array(z.string()).prefault([]),
            romance_candidates: z.array(z.string()).prefault([]),
            trust_targets: z.array(z.string()).prefault([]),
            risk_targets: z.array(z.string()).prefault([]),
            blocked_targets: z
              .array(
                z
                  .object({
                    target: z.string().prefault('无'),
                    reason: z.string().prefault('无'),
                  })
                  .prefault({}),
              )
              .prefault([]),
            same_location_targets: z.array(z.string()).prefault([]),
            contactable_targets: z.array(z.string()).prefault([]),
          })
          .prefault({}),
      })
      .prefault({})
      .transform(social => {
        social._public_intel = social.reputation >= 5000;
        social._fame_level = social.fame_level || social._fame_level;

        const topTargets = [];
        const romanceCandidates = [];
        const trustTargets = [];
        const riskTargets = [];
        const blockedTargets = [];

        _(social.relations).forEach((relData, targetName) => {
          const val = Number(relData.好感度 || 0);
          let route = relData.relation_route || '朋友线';
          let nextStage = '已达当前路线终点';
          let nextStageThreshold = 999;
          let progressNote = '维持当前关系即可。';
          let recommendedAction = '继续观察';
          let nextUnlockThreshold = 999;
          let nextUnlockBonus = '无';


          if (val <= -50) relData.关系 = '仇敌';
          else if (val <= -10) relData.关系 = '敌视';
          else if (val <= 10) relData.关系 = '陌生';
          else if (val <= 30) relData.关系 = '认识';
          else if (val <= 60) relData.关系 = '朋友';
          else if (val <= 80) relData.关系 = '亲密';
          else {
            if (route === '恋人线') {
              relData.关系 = val >= 95 ? '恋人' : '暧昧';
            } else {
              relData.关系 = val >= 95 ? '生死之交' : '挚友';
            }
          }

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

          relData._relation_stage = relData.关系;
          relData._next_stage = nextStage;
          relData._next_stage_threshold = nextStageThreshold;
          relData._route_switchable = route !== '恋人线' && val >= 60;
          relData._route_lock_reason = relData._route_switchable
            ? '无'
            : route === '恋人线'
              ? '当前已处于恋人线'
              : '好感度需达到 60 后才能稳定切入恋人线';
          relData._progress_note = progressNote;
          relData._availability = val <= -10 ? '高风险' : val <= 10 ? '待接触' : val <= 60 ? '可接触' : '优先维护';
          relData._current_relation_bonus = relData.favor_buff || '无';
          relData._next_unlock_bonus = nextUnlockBonus;
          relData._next_unlock_threshold = nextUnlockThreshold;

          topTargets.push({
            target: targetName,
            relation: relData.关系,
            favor: val,
            route,
            reason: progressNote,
            recommended_action: recommendedAction,
          });

          if (val >= 60) trustTargets.push(targetName);
          if (route === '恋人线' && val >= 60) romanceCandidates.push(targetName);
          if (val <= -10) riskTargets.push(targetName);
          if (!relData._route_switchable && route !== '恋人线' && val < 60) {
            blockedTargets.push({ target: targetName, reason: relData._route_lock_reason });
          }
        });

        const sortedTopTargets = topTargets.sort((a, b) => Number(b.favor || 0) - Number(a.favor || 0));
        const fallbackFocusTarget = sortedTopTargets[0]?.target || '无';
        const existingTopTargets = Array.isArray(social.relation_analysis.top_targets)
          ? social.relation_analysis.top_targets
          : [];
        const existingRecommendedActions = Array.isArray(social.relation_analysis.recommended_actions)
          ? social.relation_analysis.recommended_actions.map(item => String(item || '').trim()).filter(Boolean)
          : [];
        const shouldFillFocusTarget =
          !String(social.relation_analysis.focus_target || '').trim() ||
          String(social.relation_analysis.focus_target || '').trim() === '无' ||
          isAiTodoText(social.relation_analysis.focus_target);
        const shouldFillTopTargets =
          existingTopTargets.length === 0 ||
          existingTopTargets.every(
            item => !String(item?.target || '').trim() || String(item?.target || '').trim() === '无',
          );
        const shouldFillRecommendedActions =
          existingRecommendedActions.length === 0 || existingRecommendedActions.every(item => item === '无');
        if (shouldFillFocusTarget) social.relation_analysis.focus_target = fallbackFocusTarget;
        if (shouldFillTopTargets) social.relation_analysis.top_targets = sortedTopTargets.slice(0, 5);
        if (shouldFillRecommendedActions) {
          social.relation_analysis.recommended_actions = Array.from(
            new Set(sortedTopTargets.map(item => String(item.recommended_action || '').trim()).filter(Boolean)),
          ).slice(0, 3);
        }
        if (
          !String(social.relation_analysis.summary || '').trim() ||
          social.relation_analysis.summary === '当前尚未积累足够的人物关系数据。'
        ) {
          social.relation_analysis.summary = sortedTopTargets.length
            ? `当前最应关注的关系对象为${fallbackFocusTarget}，优先推进${sortedTopTargets
                .slice(0, 2)
                .map(item => item.target)
                .join('、')}。`
            : '当前尚未积累足够的人物关系数据。';
        }
        social.relation_analysis.romance_candidates = romanceCandidates.sort(
          (a, b) => Number((social.relations[b] || {}).好感度 || 0) - Number((social.relations[a] || {}).好感度 || 0),
        );
        social.relation_analysis.trust_targets = trustTargets.sort(
          (a, b) => Number((social.relations[b] || {}).好感度 || 0) - Number((social.relations[a] || {}).好感度 || 0),
        );
        social.relation_analysis.risk_targets = riskTargets.sort(
          (a, b) => Number((social.relations[a] || {}).好感度 || 0) - Number((social.relations[b] || {}).好感度 || 0),
        );
        social.relation_analysis.blocked_targets = blockedTargets;
        social.relation_analysis.same_location_targets = social.relation_analysis.same_location_targets || [];
        social.relation_analysis.contactable_targets = social.relation_analysis.contactable_targets || [];

        return social;
      }),

    inventory: z
      .record(
        z.string(),
        z
          .object({
            数量: z.coerce.number().prefault(1),
            类型: z.string().prefault('常规'),
            装备槽位: z.string().prefault('无').describe('武器/头盔/胸铠/机甲/饰品等装备位；非装备可填无'),
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
                    target: z.string().prefault('无'),
                    type: z.string().prefault('无'),
                    description: z.string().prefault('无'),
                    value: z.any().prefault(null),
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
            market_value: z
              .object({ price: z.coerce.number().prefault(0), currency: z.string().prefault('fed_coin') })
              .prefault({}),
            描述: z.string().prefault('无'),
          })
          .prefault({}),
      )
      .prefault({}),

    records: z
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
          })
          .prefault({}),
      )
      .prefault({}),

    quest_request: z
      .object({
        action: z.string().prefault('无').describe('接取/更新进度/提交/放弃'),
        quest_name: z.string().prefault('无').describe('任务名称'),
        quest_desc: z.string().prefault('无').describe('任务描述与目标'),
        progress_add: z.coerce.number().prefault(0).describe('本次进度增量'),
        required_count: z.coerce.number().prefault(1).describe('完成所需的总进度'),
        reward_coin: z.coerce.number().prefault(0).describe('奖励联邦币'),
        reward_rep: z.coerce.number().prefault(0).describe('奖励声望'),
      })
      .prefault({}),
  })
  .prefault({})
  .transform(char => {
    const secondarySpirit = char.spirit && char.spirit['第二武魂'];
    if (secondarySpirit && typeof secondarySpirit === 'object') {
      const secondaryName = String(secondarySpirit['表象名称'] || '').trim();
      const secondaryDesc = String(secondarySpirit['描述'] || '').trim();
      const secondaryAttributeState = normalizeSpiritAttributeState(secondarySpirit, '第二武魂', char);
      const hasUnlockedAttrs = secondaryAttributeState.已解锁属性.length > 0;
      const hasCapacityAttrs = secondaryAttributeState.可容纳属性.some(
        attr => attr && attr !== '无' && !isAiTodoText(attr),
      );
      const hasElementSystem = ['元素', '五行'].includes(String(secondaryAttributeState.属性体系 || '').trim());
      const hasSoulSpirits = !!(secondarySpirit.soul_spirits && Object.keys(secondarySpirit.soul_spirits).length);
      const hasCustomSkills = !!(secondarySpirit.custom_skills && Object.keys(secondarySpirit.custom_skills).length);
      const hasRealSecondarySpirit =
        (secondaryName && secondaryName !== '未展露' && !isAiTodoText(secondaryName)) ||
        (secondaryDesc && secondaryDesc !== '无' && !isAiTodoText(secondaryDesc)) ||
        hasElementSystem ||
        hasUnlockedAttrs ||
        hasCapacityAttrs ||
        hasSoulSpirits ||
        hasCustomSkills;

      if (!hasRealSecondarySpirit) {
        const nextSpirit = { ...(char.spirit || {}) };
        delete nextSpirit['第二武魂'];
        char.spirit = nextSpirit;
      }
    }

    if (char.bloodline_power?.bloodline === '金龙王') {
      let currentSealLv = char.bloodline_power.seal_lv || 0;
      if (!char.bloodline_power.skills) char.bloodline_power.skills = {};
      if (!char.bloodline_power.passives) char.bloodline_power.passives = {};
      if (!char.bloodline_power.permanent_bonuses) char.bloodline_power.permanent_bonuses = {};
      const fixedNames = new Set([
        ...Object.values(GoldenDragonSkills || {})
          .map(skill => skill?.技能名称)
          .filter(Boolean),
        ...Array.from(GOLDEN_DRAGON_NON_SKILL_NODE_NAMES),
      ]);
      fixedNames.forEach(name => {
        delete char.bloodline_power.skills[name];
        delete char.bloodline_power.passives[name];
      });

      for (let i = 1; i <= currentSealLv; i++) {
        let skillData = GoldenDragonSkills[i];
        if (skillData) {
          const targetMap = isPassiveSkillStructData(skillData)
            ? char.bloodline_power.passives
            : char.bloodline_power.skills;
          if (!targetMap[skillData.技能名称]) {
            targetMap[skillData.技能名称] = { ...cloneSkillStructData(skillData), 状态: skillData.状态 || '已固化' };
          }
        }
      }
    }
    if (!char.secret_skills) char.secret_skills = {};
    Object.keys(char.arts || {}).forEach(artName => {
      const template = TANGMEN_SECRET_SKILL_TEMPLATES[artName];
      if (template && !char.secret_skills[artName]) {
        char.secret_skills[artName] = cloneSkillStructData(template);
      }
    });

    if (char._initial_state_override) {
      _.merge(char, char._initial_state_override);
      delete char._initial_state_override;

      if (char.equip.armor.equip_status === '已装备') {
        let armorLv = char.equip.armor.lv;
        const reqLv = [0, 50, 70, 80, 90][armorLv] || 0;

        if (char.stat.lv < reqLv) {
          char.equip.armor.equip_status = '未装备';
          if (!char.stat.conditions['装备反噬'])
            char.stat.conditions['装备反噬'] = { 类型: 'debuff', 层数: 1, 描述: '强行穿戴高阶斗铠失败，气血震荡' };
        } else if (
          char.equip.mech.lv !== '无' &&
          char.equip.mech.lv !== '红级' &&
          char.equip.mech.status !== '重创' &&
          char.equip.mech.equip_status === '已装备'
        ) {
          char.equip.armor.equip_status = '未装备';
        }
      }

      if (char.equip.mech.equip_status === '已装备') {
        let mechReqLv = { 黄级: 40, 紫级: 50, 黑级: 60, 红级: 80 }[char.equip.mech.lv] || 0;
        if (char.stat.lv < mechReqLv) {
          char.equip.mech.equip_status = '未装备';
          if (!char.stat.conditions['机甲反噬'])
            char.stat.conditions['机甲反噬'] = {
              类型: 'debuff',
              层数: 1,
              描述: '精神力与魂力不足以驾驭高阶机甲，遭到反噬',
            };
        }
      }

      const reqLv = [0, 50, 70, 80, 90][Number(char?.equip?.armor?.lv || 0)] || 0;
      if (char.stat.lv < reqLv) {
        char.equip.armor.equip_status = '未装备';
        if (!char.stat.conditions['装备反噬'])
          char.stat.conditions['装备反噬'] = { 类型: 'debuff', 层数: 1, 描述: '强行穿戴高阶斗铠失败，气血震荡' };
      } else if (char.equip.mech.lv !== '无' && char.equip.mech.lv !== '红级' && char.equip.mech.status !== '重创') {
        char.equip.armor.equip_status = '未装备';
      }
    }

    if (char.stat.background !== '无' && char.stat.background !== '已推演') {
      let bgBonus = 0;
      if (char.stat.background === '顶级势力') bgBonus = 80;
      else if (char.stat.background === '一流势力') bgBonus = 50;
      else if (char.stat.background === '普通势力') bgBonus = 20;
      else if (char.stat.background === '平民') bgBonus = 0;

      const currentTier = String(char.stat.talent_tier || '').trim();
      const hasPresetTalent =
        Number(char.stat.talent_roll || 0) > 0 ||
        Number(char.stat.innate_sp_lv || 0) > 0 ||
        (currentTier && currentTier !== '正常');

      if (!hasPresetTalent) {
        let roll = Math.floor(Math.random() * 100) + 1;
        let totalScore = roll + bgBonus;
        char.stat.talent_roll = totalScore;

        let tier = '正常';
        let innate = 3;
        let factor = 1.0;
        let maxLimit = 69;

        if (totalScore >= 150) {
          tier = '绝世妖孽';
          innate = 10;
          factor = 4.5;
          maxLimit = 100;
        } else if (totalScore >= 120) {
          tier = '顶级天才';
          if (totalScore >= 135) {
            innate = 10;
            factor = 3.8;
            maxLimit = 99;
          } else {
            innate = 9;
            factor = 3.8;
            maxLimit = 98;
          }
        } else if (totalScore >= 90) {
          tier = '天才';
          if (totalScore >= 105) {
            innate = 9;
            factor = 3.0;
            maxLimit = 94;
          } else {
            innate = 8;
            factor = 2.5;
            maxLimit = 89;
          }
        } else if (totalScore >= 50) {
          tier = '优秀';
          innate = totalScore >= 70 ? 7 : 6;
          factor = 1.8;
          maxLimit = 79;
        } else if (totalScore >= 20) {
          tier = '正常';
          innate = 3 + Math.floor((totalScore - 20) / 10);
          factor = 1.0;
          maxLimit = 49;
        } else {
          tier = '劣等';
          innate = totalScore >= 10 ? 2 : 1;
          factor = 0.5;
          maxLimit = 29;
        }

        char.stat.talent_tier = tier;
        char.stat.innate_sp_lv = innate;

        if (char.stat.lv === 1 && char.stat.age > 6) {
          let calculatedLv = Math.floor(innate + (char.stat.age - 6) * factor);
          char.stat.lv = Math.min(maxLimit, Math.max(1, calculatedLv));
        }
      }

      char.stat.background = '已推演';
    }

    if (char.stat.lv >= 99 && (char.energy?.core?.数量 || 0) < 3) {
      if (!char.energy) char.energy = {};
      if (!char.energy.core) char.energy.core = {};
      char.energy.core.数量 = 3;
    } else if (char.stat.lv >= 90 && (char.energy?.core?.数量 || 0) < 2) {
      if (!char.energy) char.energy = {};
      if (!char.energy.core) char.energy.core = {};
      char.energy.core.数量 = 2;
    } else if (char.stat.lv >= 70 && (char.energy?.core?.数量 || 0) < 1) {
      if (!char.energy) char.energy = {};
      if (!char.energy.core) char.energy.core = {};
      char.energy.core.数量 = 1;
    }

    let coreCount = char.energy?.core?.数量 || 0;
    let penalty = char.stat.lv_penalty || 0;
    let maxLv = 69;
    if (coreCount === 1) maxLv = 89;
    else if (coreCount === 2) maxLv = 98;
    else if (coreCount >= 3) maxLv = 150;
    char.stat.lv = Math.min(char.stat.lv, maxLv - penalty);

    const base = getBaseStats(char.stat.lv);
    let maxTypeMult = { sp_max: 0, men_max: 0, str: 0, def: 0, agi: 0, vit_max: 0 };
    let spiritKeys = Object.keys(char.spirit || {});
    if (spiritKeys.length > 0) {
      spiritKeys.forEach(k => {
        let tm = TypeMultipliers[char.spirit[k].type] || TypeMultipliers['强攻系'];
        maxTypeMult.sp_max = Math.max(maxTypeMult.sp_max, tm.sp_max);
        maxTypeMult.men_max = Math.max(maxTypeMult.men_max, tm.men_max);
        maxTypeMult.str = Math.max(maxTypeMult.str, tm.str);
        maxTypeMult.def = Math.max(maxTypeMult.def, tm.def);
        maxTypeMult.agi = Math.max(maxTypeMult.agi, tm.agi);
        maxTypeMult.vit_max = Math.max(maxTypeMult.vit_max, tm.vit_max);
      });
    } else {
      maxTypeMult = { ...(TypeMultipliers[char.stat.type] || TypeMultipliers['强攻系']) };
    }
    const typeMult = maxTypeMult;
    const hiddenVar = char.stat.hidden_variance;
    let final_str = Math.floor(base.str * typeMult.str * hiddenVar) + char.stat.trained_bonus.str;
    let final_def = Math.floor(base.def * typeMult.def * hiddenVar) + char.stat.trained_bonus.def;
    let final_agi = Math.floor(base.agi * typeMult.agi * hiddenVar) + char.stat.trained_bonus.agi;
    let final_vit_max = Math.floor(base.vit_max * typeMult.vit_max * hiddenVar) + char.stat.trained_bonus.vit_max;
    let final_men_max = Math.floor(base.men_max * typeMult.men_max * hiddenVar) + char.stat.trained_bonus.men_max;
    let final_sp_max = Math.floor(base.sp_max * typeMult.sp_max * hiddenVar) + (char.stat.trained_bonus.sp_max || 0);
    let bName = char.bloodline_power?.bloodline || '无';

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
    if (char.social?.factions?.['本体宗']) {
      let vitInc = final_vit_max * 2;
      final_vit_max += Math.min(vitInc, 40000);
    }
    let previewMen = final_men_max;
    if (previewMen >= 50000) char.stat._men_realm = '神元境';
    else if (previewMen >= 20000) char.stat._men_realm = '灵域境';
    else if (previewMen >= 3000) char.stat._men_realm = '灵渊境';
    else if (previewMen >= 500) char.stat._men_realm = '灵海境';
    else if (previewMen >= 50) char.stat._men_realm = '灵通境';
    else char.stat._men_realm = '灵元境';

    let tier = char.stat.talent_tier;
    const isBeast = isSoulBeastCharacter(char);

    if (isBeast) {
      char.equip.armor.lv = 0;
      char.equip.armor.name = '无';
      char.equip.armor.domain = '无';
      char.equip.armor.material = '无';
      char.equip.armor.equip_status = '未装备';
      char.equip.armor.parts = {};
      char.equip.armor._stats_bonus = { lv_equiv: 0, sp_max: 0, men_max: 0, str: 0, def: 0, agi: 0, vit_max: 0 };
      char.equip.armor._is_rejected = false;
      char.equip.mech.lv = '无';
      char.equip.mech.type = '无';
      char.equip.mech.material = '无';
      char.equip.mech.status = '完好';
      char.equip.mech.equip_status = '未装备';
      char.equip.mech.weapon = '无';
      char.equip.mech.品质系数 = 1.0;
      char.equip.mech._stats_bonus = { sp_max: 0, men_max: 0, str: 0, def: 0, agi: 0, vit_max: 0 };
      char.soul_bone = {};
    }

    if (!isBeast && ['绝世妖孽', '顶级天才', '天才'].includes(tier)) {
      let armorLv = 0;
      if (char.stat.lv >= 99) {
        armorLv = 4;
      } else if (char.stat.lv >= 98) {
        armorLv = Math.random() < 0.5 ? 4 : 3;
      } else if (char.stat.lv >= 90 && tier === '天才') {
        if (Math.random() < 0.5) {
          armorLv = 3;
        } else {
          armorLv = 0;
          char.equip.mech.lv = '红级';
          char.equip.mech.status = '完好';
        }
      } else if (char.stat.lv >= 80) armorLv = 3;
      else if (char.stat.lv >= 70) armorLv = 2;
      else if (char.stat.lv >= 50) armorLv = 1;

      if (char.stat.is_evil && armorLv > 3) {
        armorLv = 3;
      }

      if (armorLv > 0) {
        char.equip.armor.lv = armorLv;
        char.equip.armor.equip_status = '未装备';
        let parts = ['头盔', '胸铠', '左肩', '右肩', '左臂', '右臂', '左腿', '右腿', '战裙', '战靴'];
        parts.forEach(p => (char.equip.armor.parts[p] = { 状态: '完好', 品质系数: 1.0 }));
      }
    } else if (!isBeast && tier === '优秀') {
      if (char.stat.lv >= 70) {
        char.equip.mech.lv = '黑级';
        char.equip.mech.status = '完好';
        char.equip.mech.equip_status = '未装备';
      } else if (char.stat.lv >= 50) {
        char.equip.mech.lv = '紫级';
        char.equip.mech.status = '完好';
        char.equip.mech.equip_status = '未装备';
      }
    }

    let boneCount = 0;
    if (!isBeast) {
      if (char.stat.lv >= 90) boneCount += 2;
      else if (char.stat.lv >= 80) boneCount += 1;
    }

    if (!isBeast && boneCount > 0) {
      let boneParts = ['头部魂骨', '躯干魂骨', '右臂魂骨', '左臂魂骨', '右腿魂骨', '左腿魂骨'];
      let sourcePool = [
        '家族底蕴传承',
        '长辈私下赐予',
        '凶险秘境奇遇',
        '地下黑市重金拍得',
        '越阶猎杀变异魂兽掉落',
        '宗门宝库核心兑换',
      ];

      for (let i = 0; i < Math.min(boneCount, 6); i++) {
        let randomSource = sourcePool[Math.floor(Math.random() * sourcePool.length)];
        if (tier === '绝世妖孽') randomSource = '上古神祇遗迹传承';

        char.soul_bone[boneParts[i]] = {
          名称: `【未鉴定之${boneParts[i].replace('魂骨', '骨')}】`,
          年限: char.stat.lv >= 90 ? 50000 : 10000,
          来源: randomSource,
          附带技能: { 被动增幅: cloneSkillStructData() },
        };
      }
    }

    let totalSpirits = 0;
    const genericSkillAge = Math.max(1000, Number(char.stat.lv || 1) * 200);
    _(char.spirit || {}).forEach((spiritData, spiritKey) => {
      if (!(spiritData && typeof spiritData === 'object')) return;
      const spiritAttributeState = normalizeSpiritAttributeState(spiritData, spiritKey, char);
      spiritData.属性体系 = spiritAttributeState.属性体系;
      spiritData.已解锁属性 = spiritAttributeState.已解锁属性;
      spiritData.可容纳属性 = spiritAttributeState.可容纳属性;
      const runtimeElementProfile = buildElementProfileFromAttributeState(spiritAttributeState);
      totalSpirits += Object.keys(spiritData?.soul_spirits || {}).length;
      _(spiritData?.soul_spirits || {}).forEach(spirit => {
        syncSoulSpiritRuntimeData(spirit);

        _(spirit.rings || {}).forEach((ring, ringIndexStr) => {
          const ringIndex = parseInt(ringIndexStr) || 1;
          spirit.附机制候选 = normalizeSoulSpiritSecondaryCandidates(spirit.附机制候选, char.stat.type, ringIndex);
          ensureSkillMapGenerated(ring.魂技, (_, skillName) => ({
            type: char.stat.type,
            talentTier: char.stat.talent_tier,
            age: ring.年限,
            ringIndex,
            compatibility: spirit.契合度 || 100,
            deferGenerationUntilSecondaryReady: hasPendingSecondaryTodoCandidates(spirit.附机制候选),
            preferredSecondary: Array.isArray(spirit.附机制候选)
              ? spirit.附机制候选.filter(option => SOUL_SPIRIT_SECONDARY_OPTIONS_V1.includes(option))
              : [],
            elementProfile: runtimeElementProfile,
            unlockedAttributes: spiritAttributeState.已解锁属性,
            attributeCapacity: spiritAttributeState.可容纳属性,
            elementTrigger: '继承武魂',
            forceTrueBody: ringIndex === 7,
            textContext: {
              spiritName:
                !isAiTodoText(spirit.表象名称) && spirit.表象名称 !== '未展露'
                  ? spirit.表象名称
                  : spiritData?.表象名称 || skillName,
              type: char.stat.type,
            },
          }));
        });
      });

      ensureSkillMapGenerated(spiritData?.custom_skills, (_, skillName) => ({
        type: spiritData?.type || char.stat.type,
        talentTier: char.stat.talent_tier,
        age: genericSkillAge,
        ringIndex: Math.max(1, Math.ceil(Number(char.stat.lv || 1) / 10)),
        compatibility: 100,
        elementProfile: runtimeElementProfile,
        unlockedAttributes: spiritAttributeState.已解锁属性,
        attributeCapacity: spiritAttributeState.可容纳属性,
        elementTrigger: '继承武魂',
        preferredSecondary: [],
        textContext: {
          spiritName:
            !isAiTodoText(spiritData?.表象名称) && spiritData?.表象名称 !== '未展露'
              ? spiritData.表象名称
              : spiritKey || skillName,
          type: spiritData?.type || char.stat.type,
        },
      }));
    });

    _(char.soul_bone || {}).forEach((bone, bonePart) => {
      ensureSkillMapGenerated(bone?.附带技能, (_, skillName) => ({
        type: char.stat.type,
        talentTier: char.stat.talent_tier,
        age: bone?.年限 || bone?.age || genericSkillAge,
        ringIndex: 1,
        compatibility: 100,
        preferredSecondary: getBonePreferredSecondary(bonePart),
        textContext: {
          spiritName: bone?.名称 || bonePart || skillName,
          type: char.stat.type,
        },
      }));
    });

    ensureSkillMapGenerated(char.secret_skills, (_, skillName) => ({
      enableGenerate: false,
      textContext: {
        spiritName: skillName,
        type: char.stat.type,
      },
    }));

    ensureSkillMapGenerated(char.special_abilities, (_, skillName) => ({
      enableGenerate: false,
      textContext: {
        spiritName: skillName,
        type: char.stat.type,
      },
    }));

    if (!char.bloodline_power || typeof char.bloodline_power !== 'object') char.bloodline_power = {};
    const bloodlineAttributeState = normalizeBloodlineAttributeState(char.bloodline_power);
    char.bloodline_power.属性体系 = bloodlineAttributeState.属性体系;
    char.bloodline_power.已解锁属性 = bloodlineAttributeState.已解锁属性;
    char.bloodline_power.可容纳属性 = bloodlineAttributeState.可容纳属性;
    const bloodlineElementProfile = buildElementProfileFromAttributeState(bloodlineAttributeState);
    ensureSkillMapGenerated(char.bloodline_power?.passives, (_, skillName) => ({
      type: char.stat.type,
      talentTier: char.stat.talent_tier,
      age: Math.max(10000, genericSkillAge),
      ringIndex: Math.max(1, Number(char.bloodline_power?.seal_lv || 1)),
      compatibility: 100,
      passiveMode: true,
      passiveName: skillName,
      preferredSecondary: [],
      elementProfile: bloodlineElementProfile,
      unlockedAttributes: bloodlineAttributeState.已解锁属性,
      attributeCapacity: bloodlineAttributeState.可容纳属性,
      elementTrigger: '继承血脉',
      textContext: {
        spiritName: char.bloodline_power?.bloodline || skillName,
        type: char.stat.type,
      },
    }));

    ensureSkillMapGenerated(char.bloodline_power?.skills, (_, skillName) => ({
      type: char.stat.type,
      talentTier: char.stat.talent_tier,
      age: Math.max(10000, genericSkillAge),
      ringIndex: Math.max(1, Number(char.bloodline_power?.seal_lv || 1)),
      compatibility: 100,
      preferredSecondary: [],
      elementProfile: bloodlineElementProfile,
      unlockedAttributes: bloodlineAttributeState.已解锁属性,
      attributeCapacity: bloodlineAttributeState.可容纳属性,
      elementTrigger: '继承血脉',
      textContext: {
        spiritName: char.bloodline_power?.bloodline || skillName,
        type: char.stat.type,
      },
    }));

    _(char.bloodline_power?.blood_rings || {}).forEach((ringData, ringIndexStr) => {
      const ringIndex = parseInt(ringIndexStr) || 1;
      ensureSkillMapGenerated(ringData?.魂技, (_, skillName) => ({
        type: char.stat.type,
        talentTier: char.stat.talent_tier,
        age: Math.max(1000, ringIndex * 5000),
        ringIndex,
        compatibility: 100,
        preferredSecondary: [],
        elementProfile: bloodlineElementProfile,
        unlockedAttributes: bloodlineAttributeState.已解锁属性,
        attributeCapacity: bloodlineAttributeState.可容纳属性,
        elementTrigger: '继承血脉',
        textContext: {
          spiritName: char.bloodline_power?.bloodline || skillName,
          type: char.stat.type,
        },
      }));
    });

    _(char.martial_fusion_skills || {}).forEach((fusionData, fusionName) => {
      if (!fusionData || typeof fusionData !== 'object') return;
      fusionData.fusion_mode = getNormalizedFusionMode(fusionData);
      fusionData.source_spirits = getNormalizedFusionSourceSpirits(fusionData, char);
      if (fusionData.fusion_mode === 'self') fusionData.partner = '无';
      const fusionElementProfile = getFusionSkillElementProfile(fusionData, char);
      ensureSkillStructGenerated(fusionData?.skill_data, {
        type: char.stat.type,
        talentTier: char.stat.talent_tier,
        age: Math.max(10000, genericSkillAge),
        ringIndex: Math.max(1, Math.ceil(Number(char.stat.lv || 1) / 10)),
        compatibility: 100,
        preferredSecondary: [],
        elementProfile: fusionElementProfile,
        unlockedAttributes: fusionElementProfile?.elements || [],
        attributeCapacity: fusionElementProfile?.elements || [],
        elementTrigger: '融合',
        textContext: {
          spiritName: fusionName,
          type: char.stat.type,
        },
      });
      ensureFusionSkillMentalCost(fusionData?.skill_data, 0.5);
    });

    const realmLimit =
      { 灵元境: 1, 灵通境: 2, 灵海境: 5, 灵渊境: 9, 灵域境: 99, 神元境: 999 }[
        char.stat._men_realm || char.stat.men_realm
      ] || 1;
    if (totalSpirits > realmLimit) {
      char.stat.conditions['精神超载'] = { 类型: 'debuff', 层数: 1, 描述: '魂灵数量超出精神力承载极限，面临崩溃风险' };
    }

    if (char.equip.armor.lv > 0) {
      let totalQuality = 0,
        count = 0;
      _(char.equip.armor.parts).forEach(p => {
        if (p.状态 !== '未打造' && p.状态 !== '重创') {
          totalQuality += p.品质系数;
          count++;
        }
      });
      if (count > 0) {
        let avgQ = totalQuality / count;
        let base = ArmorBaseStats[char.equip.armor.lv] || ArmorBaseStats[1];
        let mult = count === 10 ? avgQ : 0.05 * avgQ * count;
        char.equip.armor._stats_bonus.sp_max = Math.floor(base.sp_max * mult);
        char.equip.armor._stats_bonus.men_max = Math.floor(base.men_max * mult);
        char.equip.armor._stats_bonus.str = Math.floor(base.str * mult);
        char.equip.armor._stats_bonus.agi = Math.floor(base.agi * mult);
        char.equip.armor._stats_bonus.vit_max = Math.floor(base.vit_max * mult);
        char.equip.armor._stats_bonus.def = Math.floor(base.str * mult);
      }
    }
    if (char.equip.mech.lv !== '无' && char.equip.mech.status !== '重创') {
      let base = MechBaseStats[char.equip.mech.lv];
      if (base) {
        const mult = char.equip.mech.品质系数 || 1.0;
        char.equip.mech._stats_bonus.sp_max = Math.floor(base.sp_max * mult);
        char.equip.mech._stats_bonus.men_max = Math.floor(base.men_max * mult);
        char.equip.mech._stats_bonus.str = Math.floor(base.str * mult);
        char.equip.mech._stats_bonus.agi = Math.floor(base.agi * mult);
        char.equip.mech._stats_bonus.vit_max = Math.floor(base.vit_max * mult);
        char.equip.mech._stats_bonus.def = Math.floor(base.str * mult);
      }
    }

    const wpnBonus = char.equip.wpn?.stats_bonus || {};
    const armorBonus = char.equip.armor?.equip_status === '已装备' ? char.equip.armor?._stats_bonus || {} : {};
    const mechBonus = char.equip.mech?.equip_status === '已装备' ? char.equip.mech?._stats_bonus || {} : {};
    let boneBonus = { str: 0, def: 0, agi: 0, vit_max: 0, men_max: 0, sp_max: 0 };

    _(char.soul_bone).forEach((bone, part) => {
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
    _(char.spirit).forEach(spiritData => {
      _(spiritData.soul_spirits).forEach(ss => {
        let compMult = Math.max(0.1, (ss.契合度 !== undefined ? ss.契合度 : 100) / 100);

        _(ss.rings).forEach(ring => {
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
    });

    final_str = Math.floor(final_str + ringTotalBonus.str + boneBonus.str);
    final_def = Math.floor(final_def + ringTotalBonus.def + boneBonus.def);
    final_agi = Math.floor(final_agi + ringTotalBonus.agi + boneBonus.agi);
    final_vit_max = Math.floor(final_vit_max + ringTotalBonus.vit_max + boneBonus.vit_max);
    final_men_max = Math.floor(final_men_max + ringTotalBonus.men_max + boneBonus.men_max);
    final_sp_max = Math.floor(final_sp_max + ringTotalBonus.sp_max + boneBonus.sp_max);

    const goldenDragonPermanentBonus = applyGoldenDragonPermanentBonusNodes(char, {
      str: final_str,
      def: final_def,
      agi: final_agi,
      vit_max: final_vit_max,
      men_max: final_men_max,
      sp_max: final_sp_max,
    });
    final_str = Math.floor(final_str + goldenDragonPermanentBonus.str);
    final_def = Math.floor(final_def + goldenDragonPermanentBonus.def);
    final_agi = Math.floor(final_agi + goldenDragonPermanentBonus.agi);
    final_vit_max = Math.floor(final_vit_max + goldenDragonPermanentBonus.vit_max);
    final_men_max = Math.floor(final_men_max + goldenDragonPermanentBonus.men_max);
    final_sp_max = Math.floor(final_sp_max + goldenDragonPermanentBonus.sp_max);

    if (final_men_max >= 50000) char.stat._men_realm = '神元境';
    else if (final_men_max >= 20000) char.stat._men_realm = '灵域境';
    else if (final_men_max >= 3000) char.stat._men_realm = '灵渊境';
    else if (final_men_max >= 500) char.stat._men_realm = '灵海境';
    else if (final_men_max >= 50) char.stat._men_realm = '灵通境';
    else char.stat._men_realm = '灵元境';

    char.stat.str = Math.floor(final_str + (wpnBonus.str || 0) + (armorBonus.str || 0) + (mechBonus.str || 0));
    char.stat.def = Math.floor(final_def + (wpnBonus.def || 0) + (armorBonus.def || 0) + (mechBonus.def || 0));
    char.stat.agi = Math.floor(final_agi + (wpnBonus.agi || 0) + (armorBonus.agi || 0) + (mechBonus.agi || 0));
    char.stat.vit_max = Math.floor(
      final_vit_max + (wpnBonus.vit_max || 0) + (armorBonus.vit_max || 0) + (mechBonus.vit_max || 0),
    );
    char.stat.men_max = Math.floor(
      final_men_max + (wpnBonus.men_max || 0) + (armorBonus.men_max || 0) + (mechBonus.men_max || 0),
    );
    char.stat.sp_max = Math.floor(
      final_sp_max + (wpnBonus.sp_max || 0) + (armorBonus.sp_max || 0) + (mechBonus.sp_max || 0),
    );
    if (char.stat.sp <= 10 && char.stat.vit <= 10) {
      let ratio = 1.0;
      if (char.status.wound === '轻伤') ratio = 0.7;
      else if (char.status.wound === '重伤') ratio = 0.3;
      else if (char.status.wound === '濒死') ratio = 0.05;

      char.stat.sp = Math.floor(char.stat.sp_max * ratio);
      char.stat.vit = Math.floor(char.stat.vit_max * ratio);
      char.stat.men = Math.floor(char.stat.men_max * ratio);
    } else {
      char.stat.sp = Math.min(char.stat.sp, char.stat.sp_max);
      char.stat.vit = Math.min(char.stat.vit, char.stat.vit_max);
      char.stat.men = Math.min(char.stat.men, char.stat.men_max);
    }


    let rep = char.social.reputation || 0;
    if (rep >= 10000) char.social._fame_level = '举世无双';
    else if (rep >= 5000) char.social._fame_level = '名动联邦';
    else if (rep >= 2000) char.social._fame_level = '威震一方';
    else if (rep >= 500) char.social._fame_level = '声名鹊起';
    else if (rep >= 100) char.social._fame_level = '初露锋芒';
    else char.social._fame_level = '籍籍无名';
    if (char.equip.armor?._is_rejected) {
      if (!char.stat.conditions['回路冲突']) {
        char.stat.conditions['回路冲突'] = {
          类型: 'debuff',
          层数: 1,
          描述: '斗铠各部件材质品质差距过大，能量回路产生排斥，气血不畅！',
          duration: 99,
          stat_mods: { str: 0.9, def: 0.9, agi: 0.9, sp_max: 0.9 },
          combat_effects: { dot_damage: 0, skip_turn: false, armor_pen: 0 },
        };
      }
    } else {
      delete char.stat.conditions['回路冲突'];
    }

    char.stat.vit = Math.min(char.stat.vit, char.stat.vit_max);
    char.stat.sp = Math.min(char.stat.sp, char.stat.sp_max);
    char.stat.men = Math.min(char.stat.men, char.stat.men_max);

 const gender = String(char.stat?.gender || '');
    if (!gender.includes('女') && !gender.includes('待补全')) {
      delete char.nsfw; 
    }

    return char;
  });

const FactionSchema = z
  .object({
    inf: z.coerce.number().prefault(0),
    size: z.coerce.number().prefault(0),
    status: z.string().prefault('正常'),
    parent_faction: z.string().prefault('无').describe('上级势力/从属关系，如：斗罗联邦'),
    next_refresh_tick: z.coerce.number().prefault(0),
    rel: z.record(z.string(), z.object({ 态度: z.string().prefault('中立') }).prefault({})).prefault({}),
    mem: z.record(z.string(), z.object({ 职位: z.string().prefault('外围') }).prefault({})).prefault({}),
    power_stats: z
      .object({
        limit_douluo: z.coerce.number().prefault(0).describe('极限斗罗数量'),
        super_douluo: z.coerce.number().prefault(0).describe('超级斗罗数量'),
        title_douluo: z.coerce.number().prefault(0).describe('普通封号斗罗数量'),
      })
      .prefault({}),
  })
  .prefault({});
const BaseProductPool = {
  高能压缩干粮: {
    price: 50,
    currency: 'fed_coin',
    type: '补给品',
    description: '长途旅行必备，能快速补充少量体力。',
    effects: [{ target: 'stat.vit', type: 'percentage', value: 0.1, target_max: 'stat.vit_max' }],
  },
  纯净水: { price: 10, currency: 'fed_coin', type: '补给品', description: '基础的饮用水，能缓解口渴。', effects: [] },
  初级恢复药剂: {
    price: 500,
    currency: 'fed_coin',
    type: '药剂',
    description: '能恢复少量魂力和体力，战斗后的应急用品。',
    effects: [
      { target: 'stat.sp', type: 'percentage', value: 0.15, target_max: 'stat.sp_max' },
      { target: 'stat.vit', type: 'percentage', value: 0.15, target_max: 'stat.vit_max' },
    ],
  },
  中级恢复药剂: {
    price: 2000,
    currency: 'fed_coin',
    type: '药剂',
    description: '效果显著的恢复药剂，能应对大多数战斗消耗。',
    effects: [
      { target: 'stat.sp', type: 'percentage', value: 0.35, target_max: 'stat.sp_max' },
      { target: 'stat.vit', type: 'percentage', value: 0.35, target_max: 'stat.vit_max' },
    ],
  },
  高级恢复药剂: {
    price: 8000,
    currency: 'fed_coin',
    type: '药剂',
    description: '珍贵的强效恢复药剂，关键时刻能扭转战局。',
    effects: [
      { target: 'stat.sp', type: 'percentage', value: 0.7, target_max: 'stat.sp_max' },
      { target: 'stat.vit', type: 'percentage', value: 0.7, target_max: 'stat.vit_max' },
    ],
  },
  精神恢复冥想香: {
    price: 1500,
    currency: 'fed_coin',
    type: '药剂',
    description: '点燃后能帮助魂师快速集中精神，恢复消耗的精神力。',
    effects: [{ target: 'stat.men', type: 'percentage', value: 0.25, target_max: 'stat.men_max' }],
  },
  基础解毒散: {
    price: 300,
    currency: 'fed_coin',
    type: '药剂',
    description: '可以解除一些百年魂兽的普通毒素。',
    effects: [{ target: 'stat.conditions', type: 'remove_by_name', value: '普通中毒' }],
  },
  千年解毒丹: {
    price: 2500,
    currency: 'fed_coin',
    type: '药剂',
    description: '能有效化解千年魂兽的剧毒，是魂师深入森林的保障。',
    effects: [{ target: 'stat.conditions', type: 'remove_by_name', value: '千年剧毒' }],
  },
  力量增幅药剂: {
    price: 1200,
    currency: 'fed_coin',
    type: '药剂',
    description: '饮用后短时间内肌肉膨胀，力量获得显著提升。',
    effects: [
      {
        target: 'stat.conditions',
        type: 'add',
        value: { 力量增幅: { 类型: 'buff', 层数: 1, 描述: '力量临时提升15%，持续3回合。', stat_mods: { str: 1.15 } } },
      },
    ],
  },
  野外生存帐篷: {
    price: 1000,
    currency: 'fed_coin',
    type: '工具',
    description: '在野外提供一个相对安全的休息点。',
    effects: [],
  },
  照明魂导器: {
    price: 800,
    currency: 'fed_coin',
    type: '工具',
    description: '最基础的手持照明工具，比火把方便得多。',
    effects: [],
  },
  普通铁锭: {
    price: 200,
    currency: 'fed_coin',
    type: '材料',
    description: '最基础的锻造材料，用于练习或打造低级工具。',
    effects: [],
  },
  百锻精铁: {
    price: 1500,
    currency: 'fed_coin',
    type: '材料',
    description: '经过百次锻打的精铁，是打造魂导器的入门材料。',
    effects: [],
  },
  一级能量核心: {
    price: 1000,
    currency: 'fed_coin',
    type: '材料',
    description: '为低级魂导器供能的标准电池。',
    effects: [],
  },
  二级能量核心: {
    price: 5000,
    currency: 'fed_coin',
    type: '材料',
    description: '能量输出更稳定的二级核心，适用于中阶魂导器。',
    effects: [],
  },
};

const TangmenShopProducts = {
  玄天功秘籍: {
    price: 500,
    currency: 'tang_pt',
    type: '功法',
    description: '唐门基础内功心法，修炼后可大幅提升魂力恢复速度与精纯度。',
    requirements: { faction: '唐门' },
    effects: [{ target: 'arts', type: 'add', value: { 玄天功: { 境界: '入门', lv: 1, exp: 0, 描述: '唐门绝学' } } }],
  },
  紫极魔瞳秘籍: {
    price: 500,
    currency: 'tang_pt',
    type: '功法',
    description: '唐门瞳术，修炼后可提升视力、动态视觉与精神力。',
    requirements: { faction: '唐门' },
    effects: [{ target: 'arts', type: 'add', value: { 紫极魔瞳: { 境界: '入门', lv: 1, exp: 0, 描述: '唐门绝学' } } }],
  },
  暗器百解: {
    price: 2000,
    currency: 'tang_pt',
    type: '技术',
    description: '记录了唐门上百种暗器制作与手法的总纲。',
    requirements: { faction: '唐门', rank: ['黄级', '紫级', '黑级', '红级', '长老', '殿主'] },
    effects: [
      { target: 'arts', type: 'add', value: { 暗器百解: { 境界: '入门', lv: 1, exp: 0, 描述: '唐门暗器总纲' } } },
    ],
  },
  百年炽火阳泉草: {
    price: 8000,
    currency: 'tang_pt',
    type: '灵物',
    description: '生长于冰火两仪眼阳泉旁的百年灵草，蕴含纯粹的火属性能量。',
    requirements: { faction: '唐门', rank: ['黄级', '紫级', '黑级', '红级', '长老', '殿主'] },
    effects: [{ target: 'status.consuming_herb_age', type: 'set', value: 100 }],
  },
  千年寒极冰晶花: {
    price: 50000,
    currency: 'tang_pt',
    type: '灵物',
    description: '生长于冰火两仪眼寒泉旁的千年奇花，蕴含极致的冰属性能量。',
    requirements: { faction: '唐门', rank: ['紫级', '黑级', '红级', '长老', '殿主'] },
    effects: [{ target: 'status.consuming_herb_age', type: 'set', value: 1000 }],
  },
  万年望穿秋水露: {
    price: 250000,
    currency: 'tang_pt',
    type: '灵物',
    description: '冰火两仪眼孕育的万年仙品，服用后可极大增强精神力与视力。',
    requirements: { faction: '唐门', rank: ['红级', '长老', '殿主'] },
    effects: [{ target: 'status.consuming_herb_age', type: 'set', value: 10000 }],
  },
  万年魂骨兑换凭证: {
    price: 500000,
    currency: 'tang_pt',
    type: '战略资源',
    description: '唐门最高级别的奖励之一。可从宗门宝库中挑选一块万年魂骨。',
    requirements: { faction: '唐门', rank: ['红级', '长老', '殿主'] },
    effects: [
      { target: 'inventory', type: 'add', value: { '万年魂骨(未指定)': { 数量: 1, 类型: '魂骨', 品质: '万年' } } },
    ],
  },
};

const ShrekAcademyShopProducts = {
  百年龙鳞果: {
    price: 500,
    currency: 'shrek_pt',
    type: '灵物',
    description: '百年级别的灵果，能小幅强化气血。',
    requirements: { faction: '史莱克学院' },
    effects: [{ target: 'status.consuming_herb_age', type: 'set', value: 100 }],
  },
  千年海心莲子: {
    price: 8000,
    currency: 'shrek_pt',
    type: '灵物',
    description: '千年级别的仙品莲子，能显著提升精神力。',
    requirements: { faction: '史莱克学院' },
    effects: [{ target: 'status.consuming_herb_age', type: 'set', value: 1000 }],
  },
  万年绮罗郁金香: {
    price: 120000,
    currency: 'shrek_pt',
    type: '灵物',
    description: '万年级别的仙品，服用后可百毒不侵。',
    requirements: { faction: '史莱克学院', rank: ['内院弟子', '史莱克七怪', '老师', '宿老', '阁主'] },
    effects: [{ target: 'status.consuming_herb_age', type: 'set', value: 10000 }],
  },
  万年魂骨兑换凭证: {
    price: 300000,
    currency: 'shrek_pt',
    type: '战略资源',
    description: '史莱克学院内院的核心奖励。每人仅限兑换一次。',
    requirements: {
      faction: '史莱克学院',
      rank: ['内院弟子', '史莱克七怪', '老师', '宿老', '阁主'],
      limit_tag: 'redeemed_10k_bone',
    },
    effects: [
      { target: 'inventory', type: 'add', value: { '万年魂骨(未指定)': { 数量: 1, 类型: '魂骨', 品质: '万年' } } },
    ],
  },
  十万年魂骨兑换凭证: {
    price: 1000000,
    currency: 'shrek_pt',
    type: '战略资源',
    description: '史莱克学院的至高奖励。每人终身仅限兑换一次。',
    requirements: { faction: '史莱克学院', rank: ['宿老', '阁主', '史莱克七怪'], limit_tag: 'redeemed_100k_bone' },
    effects: [
      { target: 'inventory', type: 'add', value: { '十万年魂骨(未指定)': { 数量: 1, 类型: '魂骨', 品质: '十万年' } } },
    ],
  },
};

const AssociationShopProducts = {
  锻造师协会: {
    百锻金属块: {
      price: 50000,
      currency: 'fed_coin',
      type: '材料',
      description: '经过百次锻打的金属，是锻造师的基础材料。',
      effects: [{ target: 'inventory', type: 'add', value: { 百锻金属块: { 数量: 1, 类型: '材料', 品质: '百锻' } } }],
    },
    千锻金属块: {
      price: 500000,
      currency: 'fed_coin',
      type: '材料',
      description: '千锤百炼的稀有金属，拥有了初步的灵性。',
      effects: [{ target: 'inventory', type: 'add', value: { 千锻金属块: { 数量: 1, 类型: '材料', 品质: '千锻' } } }],
    },
    灵锻金属块: {
      price: 10000000,
      currency: 'fed_coin',
      type: '材料',
      description: '被赋予生命的金属，是四级以上锻造师的杰作。',
      effects: [{ target: 'inventory', type: 'add', value: { 灵锻金属块: { 数量: 1, 类型: '材料', 品质: '灵锻' } } }],
    },
    魂锻金属块: {
      price: 80000000,
      currency: 'fed_coin',
      type: '材料',
      description: '与灵魂相融的金属，圣匠的标志。',
      effects: [{ target: 'inventory', type: 'add', value: { 魂锻金属块: { 数量: 1, 类型: '材料', 品质: '魂锻' } } }],
    },
    天锻金属块: {
      price: 500000000,
      currency: 'fed_coin',
      type: '材料',
      description: '引动天地法则淬炼而成的神级金属。',
      effects: [{ target: 'inventory', type: 'add', value: { 天锻金属块: { 数量: 1, 类型: '材料', 品质: '天锻' } } }],
    },
  },
  设计师协会: {
    一字斗铠设计图: {
      price: 100000,
      currency: 'fed_coin',
      type: '图纸',
      description: '标准的一字斗铠设计蓝图。',
      effects: [{ target: 'inventory', type: 'add', value: { 一字斗铠设计图: { 数量: 1, 类型: '图纸' } } }],
    },
    二字斗铠设计图: {
      price: 2000000,
      currency: 'fed_coin',
      type: '图纸',
      description: '蕴含领域雏形的二字斗铠设计图。',
      effects: [{ target: 'inventory', type: 'add', value: { 二字斗铠设计图: { 数量: 1, 类型: '图纸' } } }],
    },
    三字斗铠设计图: {
      price: 20000000,
      currency: 'fed_coin',
      type: '图纸',
      description: '能够赋予斗铠真正领域的三字斗铠设计图。',
      effects: [{ target: 'inventory', type: 'add', value: { 三字斗铠设计图: { 数量: 1, 类型: '图纸' } } }],
    },
    四字斗铠设计图: {
      price: 150000000,
      currency: 'fed_coin',
      type: '图纸',
      description: '传说中的四字斗铠设计图。',
      effects: [{ target: 'inventory', type: 'add', value: { 四字斗铠设计图: { 数量: 1, 类型: '图纸' } } }],
    },
  },
  机甲师协会: {
    黄级机甲现货: {
      price: 6000000,
      currency: 'fed_coin',
      type: '装备',
      description: '制式黄级机甲(流水线白板，品质系数1.0)。',
      effects: [{ target: 'inventory', type: 'add', value: { 黄级机甲现货: { 数量: 1, 类型: '装备', 品质: '黄级' } } }],
    },
    紫级机甲现货: {
      price: 80000000,
      currency: 'fed_coin',
      type: '装备',
      description: '制式紫级机甲(流水线白板，品质系数1.0)。',
      effects: [{ target: 'inventory', type: 'add', value: { 紫级机甲现货: { 数量: 1, 类型: '装备', 品质: '紫级' } } }],
    },
    黑级机甲现货: {
      price: 1000000000,
      currency: 'fed_coin',
      type: '装备',
      description: '制式黑级机甲(流水线白板，品质系数1.0)。',
      effects: [{ target: 'inventory', type: 'add', value: { 黑级机甲现货: { 数量: 1, 类型: '装备', 品质: '黑级' } } }],
    },
    红级机甲定制: {
      price: 5000000000,
      currency: 'fed_coin',
      type: '服务',
      description: '神级机甲的顶级代工定制服务(需自备神级材料)。',
      effects: [],
    },
  },
  修理师协会: {
    基础维护套件: {
      price: 50000,
      currency: 'fed_coin',
      type: '消耗品',
      description: '用于机甲和魂导器的日常保养。',
      effects: [{ target: 'inventory', type: 'add', value: { 基础维护套件: { 数量: 1, 类型: '消耗品' } } }],
    },
    精密修复模块: {
      price: 500000,
      currency: 'fed_coin',
      type: '消耗品',
      description: '可以修复机甲或斗铠的中度损伤。',
      effects: [{ target: 'inventory', type: 'add', value: { 精密修复模块: { 数量: 1, 类型: '消耗品' } } }],
    },
    机甲超频模块: {
      price: 500000,
      currency: 'fed_coin',
      type: '消耗品',
      description: '一次性模块，能让机甲在短时间内爆发出超越极限的性能。',
      effects: [{ target: 'inventory', type: 'add', value: { 机甲超频模块: { 数量: 1, 类型: '消耗品' } } }],
    },
    斗铠本源蕴养液: {
      price: 20000000,
      currency: 'fed_coin',
      type: '消耗品',
      description: '极其珍贵的蕴养液，能修复受损的斗铠本源。',
      effects: [{ target: 'inventory', type: 'add', value: { 斗铠本源蕴养液: { 数量: 1, 类型: '消耗品' } } }],
    },
    神级重塑核心: {
      price: 500000000,
      currency: 'fed_coin',
      type: '核心部件',
      description: '传说中的物品，据说能让彻底损毁的斗铠甚至神器重获新生。',
      effects: [{ target: 'inventory', type: 'add', value: { 神级重塑核心: { 数量: 1, 类型: '核心部件' } } }],
    },
  },
};
export const Schema = z
  .object({
    sys: z
      .object({
        player_name: z.string().prefault('无名氏').describe('当前玩家角色姓名'),
        rsn: z.string().prefault('初始化'),
        cleanup_request: z
          .object({
            action: z.string().prefault('无').describe('填apply时执行一次临时变量清理'),
            characters: z.array(z.string()).prefault([]).describe('要清理的临时角色名列表'),
            dynamic_locations: z.array(z.string()).prefault([]).describe('要清理的动态地点名列表'),
            purge_relations: z.boolean().prefault(true),
            reset_location_refs: z.boolean().prefault(true),
          })
          .prefault({}),
        seq: z.record(z.string(), z.object({ 事件: z.string().prefault('无') }).prefault({})).prefault({}),
        last_roll: z.coerce.number().prefault(0).describe('最近一次D100物理检定客观点数'),
        fsr: z.coerce.number().prefault(0).describe('当前交互行为的最终成功率'),
      })
      .prefault({}),
    char: z.record(z.string(), CharacterSchema).prefault({}),
    org: z.record(z.string(), FactionSchema).prefault({}),
    world: z
      .object({
        time: z
          .object({
            tick: z.coerce.number().prefault(0),
            _last_settle_tick: z.coerce.number().prefault(0),
            _calendar: z.string().prefault('斗罗历X年X月X日 HH:MM'),
            _last_lv_up: z.coerce.number().prefault(0),
          })
          .prefault({}),
        flags: z.record(z.string(), z.boolean().prefault(true)).prefault({}),
        deviation: z.coerce.number().prefault(0).describe('世界线偏差值(0-100)'),
        deviation_multiplier: z.coerce.number().prefault(1.0).describe('偏差值累计倍率'),
        forest_killed_age: z.coerce.number().prefault(0).describe('星斗大森林累计被杀魂兽年限'),
        timeline: z
          .record(
            z.string(),
            z
              .object({
                trigger_tick: z.coerce.number().prefault(0),
                event: z.string().prefault('无'),
                status: z.string().prefault('pending'),
              })
              .prefault({}),
          )
          .prefault({}),
        auction: z
          .object({
            status: z.string().prefault('休市'),
            next_tick: z.coerce.number().prefault(7),
            location: z.string().prefault('无'),
            items: z
              .record(
                z.string(),
                z
                  .object({
                    tier: z.string().prefault('低阶'),
                    lore: z.string().prefault('无'),
                    price: z.coerce.number().prefault(0),
                  })
                  .prefault({}),
              )
              .prefault({}),
          })
          .prefault({}),
        rankings: z
          .object({
            youth_talent: z
              .object({
                _last榜单: z.record(z.string(), z.coerce.number().prefault(0)).prefault({}),
                _top30: z
                  .record(
                    z.string(),
                    z
                      .object({
                        角色名: z.string().prefault('无'),
                        评分: z.coerce.number().prefault(0),
                      })
                      .prefault({}),
                  )
                  .prefault({}),
              })
              .prefault({}),
          })
          .prefault({}),
        quest_board: z
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
        locations: z
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
                type: z.string().prefault('地图节点'),
                desc: z.string().prefault('无'),
                state: z.string().prefault('intact'),
                icon: z.string().prefault('node'),
                node_kind: z.string().prefault(''),
                interactions: z.array(z.string()).prefault([]),
                services: z.array(z.string()).prefault([]),
                action_slots: z.array(z.string()).prefault([]),
                event_id: z.string().prefault(''),
                children: z.record(z.string(), z.any()).prefault({}),
                stores: z
                  .record(
                    z.string().describe('商店名，如：传灵塔分店'),
                    z
                      .object({
                        inventory: z
                          .record(
                            z.string().describe('商品ID或名称'),
                            z
                              .object({
                                price: z.coerce.number().prefault(0).describe('价格'),
                                currency: z.string().prefault('fed_coin').describe('货币类型'),
                                stock: z.coerce.number().prefault(0).describe('库存'),
                                req_fame: z.coerce.number().prefault(0).describe('声望要求'),
                                description: z.string().prefault('').describe('物品描述'),
                                effects: z.array(z.any()).prefault([]).describe('购买效果'),
                              })
                              .prefault({}),
                          )
                          .prefault({})
                          .describe('商品库存列表'),
                        _next_refresh_tick: z.coerce.number().prefault(0).describe('下次刷新时间'),
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

        dynamic_locations: z
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
                map_id: z.string().prefault('无'),
                node_type: z
                  .any()
                  .transform(value => normalizeDynamicLocationNodeType(value))
                  .prefault('未知')
                  .describe('地点类型'),
                icon: z.string().prefault('marker').describe('前端渲染使用的图标标识'),
                settlement_id: z.string().prefault('无').describe('归属城市ID'),
                faction: z.string().prefault('未知'),
                importance: z.coerce.number().prefault(0),
                state: z.string().prefault('intact'),
                node_kind: z.string().prefault(''),
                interactions: z.array(z.string()).prefault([]),
                services: z.array(z.string()).prefault([]),
                action_slots: z.array(z.string()).prefault([]),
                event_id: z.string().prefault(''),
              })
              .prefault({}),
          )
          .prefault({})
          .transform(locations => {
            _(locations).forEach((locData, locName) => {
              locData.node_type = normalizeDynamicLocationNodeType(locData.node_type, locData.层级, locName);
              if (locData.x === -1 || locData.y === -1) {
                const siblingCoords = new Set();
                _(locations).forEach(otherLoc => {
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
            return locations;
          })
          .describe('随剧情动态拓展的子地图节点'),
        bestiary: z
          .record(z.string().describe('物种或怪物名称，如：巴安'), z.object({}).prefault({}))
          .prefault({})
          .describe('怪物图鉴，记录已遭遇怪物的标准数据'),
        combat: z
          .object({
            is_active: z.boolean().prefault(false).describe('是否处于战斗中'),
            combat_type: z
              .enum(['切磋', '死战', '未知'])
              .prefault('未知')
              .describe('战斗烈度，决定是否触发锁血保护与死亡结算'),
            initiative: z
              .string()
              .prefault('无')
              .describe('掌握先手权的角色名。若为"无"则代表公平开局；若有名字则代表突发偷袭，防守方首回合反应率减半'),
            allow_flee: z.boolean().prefault(true).describe('是否允许逃跑。若为false则代表背水一战，触发困兽机制'),
            round: z.coerce.number().prefault(0).describe('当前回合数'),
            phase: z.enum(['无', '宣告阶段', '对轰判定阶段', '回合结算阶段']).prefault('无').describe('当前战斗阶段'),
            environment: z.string().prefault('正常').describe('战场环境或全局领域法则'),

            participants: z
              .record(
                z.string().describe('参战者姓名或怪物名'),
                z
                  .object({
                    faction: z.enum(['己方', '敌对', '中立']).prefault('敌对').describe('所属阵营'),
                    status: z.string().prefault('存活').describe('存活/重伤/濒死/死亡/逃跑'),
                    is_summon: z.boolean().prefault(false).describe('是否为离体参战的魂灵'),
                  })
                  .prefault({}),
              )
              .prefault({})
              .describe('当前战场所有参战单位的实时状态'),
          })
          .prefault({}),
      })
      .prefault({}),
  })
  .prefault({})
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
      return ['sys', 'world', 'org', 'char', 'map'].filter(key => !!value[key] && typeof value[key] === 'object').length;
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
    if (!data.world.time || typeof data.world.time !== 'object') data.world.time = {};
    if (!data.world.flags || typeof data.world.flags !== 'object') data.world.flags = {};
    if (!data.world.dynamic_locations || typeof data.world.dynamic_locations !== 'object')
      data.world.dynamic_locations = {};
    if (!data.world.locations || typeof data.world.locations !== 'object') data.world.locations = {};

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
      'map',
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

    if (!data.sys.seq || typeof data.sys.seq !== 'object') data.sys.seq = {};
    if (typeof data.sys.player_name !== 'string' || !data.sys.player_name.trim()) data.sys.player_name = '无名氏';
    if (typeof data.sys.rsn !== 'string' || !data.sys.rsn.trim()) data.sys.rsn = '初始化';
    data.sys.last_roll = Number(data.sys.last_roll || 0);

    let currentTick = Number(data.world.time.tick || 0);
    data.world.time.tick = currentTick;

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

    data.world.time._calendar = formatTickToCalendar(currentTick);
    applyCleanupRequest(data);

    _(data.char || {}).forEach(charData => {
      if (!charData || typeof charData !== 'object' || !charData.inventory || typeof charData.inventory !== 'object')
        return;
      Object.keys(charData.inventory).forEach(itemName => {
        const item = charData.inventory[itemName];
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
          delete charData.inventory[itemName];
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

    let lastTick = data.world.time._last_settle_tick ?? data.world.time.last_settle_tick ?? currentTick;
    let delta = currentTick - lastTick;

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
        const raw = String(char?.status?.loc || '当前区域')
          .replace(/^斗罗大陆-/, '')
          .replace(/^斗灵大陆-/, '')
          .trim();
        const segments = raw.split('-').filter(Boolean);
        if (segments.length >= 2) return segments.slice(-2).join('-');
        return segments[0] || '当前区域';
      }

      function getQuestBoardJobLevel(char = {}, keywords = []) {
        let result = 0;
        _(char?.job || {}).forEach((jobData, jobName) => {
          const safeName = String(jobName || '').trim();
          if (!safeName) return;
          if (
            (Array.isArray(keywords) ? keywords : []).some(keyword => safeName.includes(String(keyword || '').trim()))
          ) {
            result = Math.max(result, Number(jobData?.lv || 0));
          }
        });
        return result;
      }

      function getQuestBoardMaxJobLevel(char = {}) {
        let result = 0;
        _(char?.job || {}).forEach(jobData => {
          result = Math.max(result, Number(jobData?.lv || 0));
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
        const combatTierIndex = getQuestCombatTierIndex(Number(playerChar?.stat?.lv || 0));
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
        const combatTierIndex = getQuestCombatTierIndex(Number(playerChar?.stat?.lv || 0));
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
        const playerLevel = Number(playerChar?.stat?.lv || 0);
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
        if (!dataRef.world.quest_board || typeof dataRef.world.quest_board !== 'object') dataRef.world.quest_board = {};
        const board = dataRef.world.quest_board;

        Object.keys(board).forEach(questId => {
          const entry = board[questId];
          if (!entry || typeof entry !== 'object') {
            delete board[questId];
            return;
          }
          const generatedTick = Number(entry.生成tick || 0);
          if (generatedTick <= 0) return;
          const age = Math.max(0, Number(currentTickValue || 0) - generatedTick);
          const status = String(entry.状态 || '待接取');
          if (status === '待接取' && age >= QUEST_BOARD_PENDING_STALE_TICKS) delete board[questId];
          else if ((status === '已完成' || status === '已放弃') && age >= QUEST_BOARD_ARCHIVE_STALE_TICKS)
            delete board[questId];
        });

        const pendingEntries = Object.entries(board).filter(
          ([, entry]) => String(entry?.状态 || '待接取') === '待接取',
        );
        if (pendingEntries.length >= QUEST_BOARD_PENDING_LIMIT) return;

        const playerName = String(dataRef?.sys?.player_name || '').trim();
        const playerChar = playerName ? dataRef?.char?.[playerName] : null;
        if (!playerChar) return;

        const combatTierIndex = getQuestCombatTierIndex(Number(playerChar?.stat?.lv || 0));
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

        if (!dataRef.sys?.rsn || dataRef.sys.rsn === '初始化') {
          dataRef.sys.rsn = `[委托刷新] ${frame.publisher} 挂出了一份${frame.tier}级【${frame.descriptor?.label || '公开'}】委托框架：${frame.title}。`;
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
      const talentScore = { 绝世妖孽: 100, 顶级天才: 80, 天才: 60, 优秀: 40, 正常: 20, 劣等: 0 }[talentTier] || 20;
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

    _(data.char).forEach((char, charName) => {
      let isBeast = isSoulBeastCharacter(char);
      let expectedRings = isBeast ? 0 : Math.floor(char.stat.lv / 10);
      let currentRings = 0;
      let currentSpirits = 0;
      let firstSpiritName = '未知武魂';

      if (!char.spirit) char.spirit = {};
      let spiritKeys = Object.keys(char.spirit);
      if (spiritKeys.length > 0) {
        firstSpiritName = spiritKeys[0];
        let targetSpirit = char.spirit[firstSpiritName];
        _(targetSpirit.soul_spirits || {}).forEach(ss => {
          currentSpirits++;
          if (ss.rings) currentRings += Object.keys(ss.rings).length;
        });
      }

      const isPlayer = charName === data.sys?.player_name;
      const playerChar = data.char[data.sys?.player_name];
      const isSameNodeGroup = (c1, c2) => {
        if (!c1 || !c2) return false;
        const loc1 = c1.status?.loc || '';
        const loc2 = c2.status?.loc || '';
        if (loc1 && loc2 && loc1 === loc2) return true;
        const dyn = data.world?.dynamic_locations || {};
        const p1 = dyn[loc1]?.归属父节点 || loc1.split('-').slice(0, -1).join('-');
        const p2 = dyn[loc2]?.归属父节点 || loc2.split('-').slice(0, -1).join('-');
        return p1 && p2 && p1 === p2;
      };
      const isNearPlayer = !isPlayer && isSameNodeGroup(char, playerChar);

      if (currentRings === 0 && expectedRings > 0 && currentSpirits === 0) {
        if (isPlayer && data.sys?.rsn !== '初始化') return;
        if (isNearPlayer && data.sys?.rsn !== '初始化') return;

        if (spiritKeys.length === 0) {
          char.spirit[firstSpiritName] = {
            表象名称: '未展露',
            type: char.stat.type,
            soul_spirits: {},
            domains: {},
            custom_skills: {},
          };
          spiritKeys = [firstSpiritName];
        }

        spiritKeys.forEach(spiritKey => {
          let targetSpirit = char.spirit[spiritKey];
          if (!targetSpirit.表象名称) targetSpirit.表象名称 = '未展露';
          if (!targetSpirit.soul_spirits) targetSpirit.soul_spirits = {};

          let ringsNeeded = expectedRings;
          let currentRingIndex = 1;
          let spiritIndex = 0;
          let lastAge = 0;

          const realmLimit =
            { 灵元境: 1, 灵通境: 2, 灵海境: 5, 灵渊境: 9, 灵域境: 99, 神元境: 999 }[
              char.stat._men_realm || char.stat.men_realm
            ] || 1;

          let currentTotalSpirits = 0;
          _(char.spirit).forEach(sp => {
            currentTotalSpirits += Object.keys(sp.soul_spirits || {}).length;
          });
          while (ringsNeeded > 0 && spiritIndex < 9 && currentTotalSpirits < realmLimit) {
            let spData = rollSpirit(
              char.stat.talent_tier,
              char.stat.lv,
              spiritIndex,
              char.stat._men_realm || char.stat.men_realm,
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
              { 绝世妖孽: 30, 顶级天才: 20, 天才: 10, 优秀: 0, 正常: -10, 劣等: -20 }[char.stat.talent_tier] || 0;
            let indexBonus = spiritIndex * 5;
            let calculatedComp = Math.min(100, Math.max(0, 60 + talentBonus + indexBonus));

            targetSpirit.soul_spirits[spiritName] = {
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
              附机制候选: buildSoulSpiritSecondaryDefaultValue(char.stat.type, 1),
              状态: '活跃',
              战力面板: createEmptySoulSpiritPowerPanel(),
              rings: {},
            };

            for (let i = 0; i < ringsToProvide; i++) {
              targetSpirit.soul_spirits[spiritName].rings[currentRingIndex.toString()] = {
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
              targetSpirit.soul_spirits[spiritName].rings[currentRingIndex.toString()].魂技 = buildDefaultRingSkillMap(currentRingIndex, spData.age);
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
        ? buildUpcomingTimelinePreview(TimelineEvents, currentTick, data.world.flags || {}, 5)
        : [];
    delete data.world._upcoming_timeline_preview;
    delete data.world._upcoming_timeline_preview_text;
    delete data.world._cue;
    if (!data.world._引导 || typeof data.world._引导 !== 'object' || Array.isArray(data.world._引导)) data.world._引导 = {};
    delete data.world._引导.tl;
    delete data.world._引导.next_tl;
    data.world._引导.时间线预览 = buildUpcomingTimelinePreviewText(upcomingTimelinePreview);

    if (typeof TimelineEvents !== 'undefined') {
      let dev = data.world.deviation || 0;

      let allEvents = Array.isArray(TimelineEvents) ? TimelineEvents : Object.values(TimelineEvents).flat();

      allEvents.map(lowerCaseKeys).forEach(event => {
        let eventKey = event.事件名 || event.event_name || event.flag;
        if (!data.world.flags[eventKey]) {
          let drift = dev > 0 ? Math.floor((Math.random() * 2 - 1) * dev * 100) : 0;
          let actualTick = event.tick + drift;

          if (currentTick >= actualTick) {
            let {
              tick,
              event_name,
              character_name,
              trigger_background,
              description,
              faction_name,
              flag,
              impact_level,
              related_mainline,
              ...updates
            } = event;

            if (character_name && data.char[character_name]) {
              _.merge(data.char[character_name], updates);
            }

            if (faction_name && data.org[faction_name]) {
              _.merge(data.org[faction_name], updates);
            }
            if (event.faction_name && data.org[event.faction_name]) {
              data.org[event.faction_name].inf += 500;
            }

            const eventDesc =
              event.描述 ||
              description ||
              event.trigger_background ||
              event.触发背景 ||
              event.event_name ||
              event.事件名 ||
              eventKey ||
              '未知事件';
            let msg = `[编年史推进] ${eventDesc}`;

            if (dev >= 40) {
              msg += ` 🚨[世界线暴走] 当前偏差值高达 ${dev}！该历史节点已受混沌干扰，请 AI 强制魔改该事件的细节或结果！`;
            }
            data.sys.rsn = msg;
            data.world.flags[eventKey] = true;
          }
        }
      });
    }

    if (typeof IntelEvents !== 'undefined') {
      let dev = data.world.deviation || 0;

      let allIntels = Array.isArray(IntelEvents) ? IntelEvents : Object.values(IntelEvents).flat();

      allIntels.map(lowerCaseKeys).forEach((intel, index) => {
        let intelKey = intel.trigger_flag ? `intel_${intel.trigger_flag}` : `intel_${intel.tick}_${index}`;
        if (!data.world.flags[intelKey]) {
          let drift = dev > 0 ? Math.floor((Math.random() * 2 - 1) * dev * 100) : 0;
          let actualTick = intel.tick + drift;

          if (currentTick >= actualTick) {
            if (intel.knowers) {
              intel.knowers.forEach(target => {
                if (data.char[target]) {
                  data.char[target].knowledge_unlock_request = {
                    content: intel.content || intel.trigger_flag,
                    impact: intel.impact ?? 0,
                  };
                } else {
                  _(data.char).forEach((c, charName) => {
                    let isMatch = false;
                    _(c.social?.factions || {}).forEach((facData, facName) => {
                      if (target === facName) {
                        isMatch = true;
                      } else if (target.includes(facName) && target.includes('高层') && facData.权限级 >= 7) {
                        isMatch = true;
                      }
                    });

                    if (isMatch) {
                      c.knowledge_unlock_request = {
                        content: intel.content || intel.trigger_flag,
                        impact: intel.impact ?? 0,
                      };
                    }
                  });
                }
              });
            }

            if (dev >= 40) {
              if (data.sys.rsn === '初始化' || !data.sys.rsn) data.sys.rsn = '';
              data.sys.rsn += ` 🚨[情报异变] 偏差值过高！刚刚解锁的【${intel.content.substring(0, 10)}...】情报可能已被第三方篡改或发生恶性反转，请 AI 自由推演！`;
            }

            data.world.flags[intelKey] = true;
          }
        }
      });
    }

    if (!data.world.flags) data.world.flags = {};
    const hasContinentRankingData = Object.keys(data.world?.rankings?.continent_wind?._top100 || data.world?.rankings?.continent_wind?.top100 || {}).length > 0;
    const hasYouthRankingData = Object.keys(data.world?.rankings?.youth_talent?._top30 || data.world?.rankings?.youth_talent?.top30 || {}).length > 0;
    if (!data.world.flags['initial_setup_complete'] || !hasContinentRankingData || !hasYouthRankingData) {
      refreshContinentRanking(data);
      refreshYouthTalentRanking(data);
      if (!data.world.flags['initial_setup_complete']) {
        data.world.flags['initial_setup_complete'] = true;
        if (data.sys.rsn === '初始化' || !data.sys.rsn) data.sys.rsn = '';
        data.sys.rsn += ' [系统提示] 世界初始化完成！大陆风云榜与少年天才榜已完成首次排位！';
      }
    }

    if (delta > 0) {
      let daysPassed = Math.floor(currentTick / 144) - Math.floor(lastTick / 144);

      checkDestinyAnchors(data, currentTick);
      refreshYouthTalentRanking(data);
      refreshContinentRanking(data);

      _(data.char).forEach((c, charName) => {
        const trainedBonus = ensureNumericStatBonusMap(c.stat, 'trained_bonus');
        if (daysPassed > 0 && Math.random() < 0.05) {
          const locName = _.get(c, 'status.loc', '');
          const locData =
            _.get(data, ['world', 'locations', locName], null) ||
            _.get(data, ['world', 'dynamic_locations', locName], null);

          const opportunities = Array.isArray(locData && locData.opportunities) ? locData.opportunities : [];

          if (opportunities.length > 0) {
            let event = opportunities[Math.floor(Math.random() * opportunities.length)];
            if (data.sys.rsn === '初始化' || !data.sys.rsn) data.sys.rsn = '';
            data.sys.rsn += ` 🎲[区域机遇] ${charName} 在【${locName}】触发了特殊事件：${event}！(请 AI 自由推演细节)`;
          }
        }
        if (c.status.loc && c.status.loc.includes('血神军团入伍考核')) {
          c.stat.sp = 0;
          if (!c.stat.conditions['禁魔领域']) {
            c.stat.conditions['禁魔领域'] = {
              类型: 'debuff',
              层数: 1,
              描述: '处于考核虚拟网中，魂力被绝对封印，仅能使用肉体力量与气血',
            };
          }
        } else {
          delete c.stat.conditions['禁魔领域'];
        }

        if (c.status.alive && c.status.wound !== '濒死') {
          if (daysPassed > 0 && c.status.action === '日常') {
            const isCity = /城|学院|镇|塔|村|都/.test(c.status.loc);

            if (isCity) {
              let cost = 300 * daysPassed;
              if ((c.wealth?.fed_coin || 0) >= cost) {
                c.wealth.fed_coin -= cost;
                delete c.stat.conditions['饥饿'];
              } else {
                c.wealth.fed_coin = 0;
                c.stat.conditions['饥饿'] = { 类型: 'debuff', 层数: 1, 描述: '缺乏资金购买食物，体力流失加剧' };
              }
            }
          }

          let coreCount = c.energy?.core?.数量 || 0;
          let spRate = 0.01;
          // 日常/未明确动作不自动消耗体力与精神力，避免时间跳跃时把整段剧情硬判为持续消耗
          let vitMenRate = 0;

          if (c.status.action === '冥想') {
            spRate = coreCount === 0 ? 0.05 : coreCount === 1 ? 0.2 : coreCount === 2 ? 0.3 : 0.4;
            vitMenRate = 0.005;
            let menRate = 0.008;
            c.stat.men = Math.min(c.stat.men_max, Math.floor(c.stat.men + c.stat.men_max * menRate * delta));
            c.stat.vit = Math.min(c.stat.vit_max, Math.floor(c.stat.vit + c.stat.vit_max * vitMenRate * delta));
          } else if (c.status.action === '战斗') {
            spRate = 0;
            vitMenRate = 0;
            c.stat.men = c.stat.men;
            c.stat.vit = c.stat.vit;
          } else if (c.status.action === '睡眠') {
            spRate = 0.01;
            let sleepRate = 0.01;
            c.stat.men = Math.min(c.stat.men_max, Math.floor(c.stat.men + c.stat.men_max * sleepRate * delta));
            c.stat.vit = Math.min(c.stat.vit_max, Math.floor(c.stat.vit + c.stat.vit_max * sleepRate * delta));
          } else {
            c.stat.men = Math.min(c.stat.men_max, Math.floor(c.stat.men + c.stat.men_max * vitMenRate * delta));
            c.stat.vit = Math.min(c.stat.vit_max, Math.floor(c.stat.vit + c.stat.vit_max * vitMenRate * delta));
          }

          c.stat.sp = Math.min(c.stat.sp_max, Math.floor(c.stat.sp + c.stat.sp_max * spRate * delta));

          let bloodCore = c.bloodline_power?.core || '未凝聚';
          if (bloodCore !== '未凝聚') {
            c.stat.vit = Math.min(c.stat.vit_max, Math.floor(c.stat.vit + c.stat.vit_max * 0.05 * delta));
          }

          if (c.status.action === '冥想') {
            let baseGrowth = (0.2 + coreCount * 0.2) * (delta / 6);
            let talentCultRate =
              {
                绝世妖孽: 4.5,
                顶级天才: 3.5,
                天才: 2.5,
                优秀: 1.5,
                正常: 1.0,
                劣等: 0.5,
              }[c.stat.talent_tier] || 1.0;
            let finalGrowth = baseGrowth * talentCultRate * (c.stat.multiplier?.cultivation || 1.0);

            if (c.arts?.['玄天功']) finalGrowth = Math.floor(finalGrowth * 1.1);

            if (c.stat.lv >= 20 && c.stat.lv < 30) {
              finalGrowth = Math.floor(finalGrowth * 0.4);
            } else if (c.stat.lv >= 30 && c.stat.lv < 40) {
              finalGrowth = Math.floor(finalGrowth * 0.9);
            } else if (c.stat.lv >= 40 && c.stat.lv < 60) {
              finalGrowth = Math.floor(finalGrowth * 0.6);
            }

            c.stat.sp_max = Math.floor(c.stat.sp_max + finalGrowth);
          }

          if (c.status.action === '肉体训练') {
            let cycles = Math.floor(delta / 6);
            let actualCycles = 0;
            for (let i = 0; i < cycles; i++) {
              if (c.stat.vit >= c.stat.vit_max * 0.3) {
                c.stat.vit -= c.stat.vit_max * 0.3;
                actualCycles++;
              } else {
                c.status.action = '日常';
                break;
              }
            }
            if (actualCycles > 0) {
              let gain = 0.05 * (c.stat.multiplier?.cultivation || 1.0) * actualCycles;
              addNumericStatBonusEntries(trainedBonus, {
                str: gain,
                def: gain,
                agi: gain,
                vit_max: gain,
              });
            }
          } else if (c.status.action === '精神训练') {
            let cycles = Math.floor(delta / 6);
            let actualCycles = 0;
            for (let i = 0; i < cycles; i++) {
              if (c.stat.men > c.stat.men_max * 0.1) {
                c.stat.men -= c.stat.men * 0.8;
                actualCycles++;
              } else {
                c.status.action = '日常';
                break;
              }
            }
            if (actualCycles > 0 && c.stat.age <= 40) {
              let gain = 0.02 * (c.stat.multiplier?.cultivation || 1.0) * actualCycles;
              if (c.arts?.['紫极魔瞳']) gain = Math.floor(gain * 1.1);
              addNumericStatBonusValue(trainedBonus, 'men_max', gain);
            }
          } else {
            let daysPassed = Math.floor(delta / 144);
            if (daysPassed > 0) {
              let passiveGain = 0.01 * (c.stat.multiplier?.cultivation || 1.0) * daysPassed;
              addNumericStatBonusEntries(trainedBonus, {
                str: passiveGain,
                def: passiveGain,
                agi: passiveGain,
                vit_max: passiveGain,
              });

              if (c.stat.age <= 40) {
                addNumericStatBonusValue(trainedBonus, 'men_max', passiveGain * 0.5);
              }
            }
          }

          if (c.status.action === '凝聚魂核') {
            let cycles = delta / 480;
            if (cycles > 0) {
              let deduct = Math.floor(50 * cycles);
              c.stat.sp_max = Math.max(10, c.stat.sp_max - deduct);

              if (!c.energy.core) c.energy.core = { 数量: 0, progress: 0 };
              c.energy.core.progress += cycles;

              if (c.energy.core.progress >= 100) {
                c.energy.core.数量 += 1;
                c.energy.core.progress = 0;
                c.status.action = '日常';
                data.sys.rsn = `[境界突破] ${c.stat.age}岁的 ${c.stat.name || '角色'} 成功凝聚第 ${c.energy.core.数量} 魂核！修为上限解锁！`;
              }
            }
          }
        }
      });
      refreshQuestBoardFrames(data, currentTick);
      data.world.time._last_settle_tick = currentTick;
    }

    _(data.char).forEach((c, charName) => {
      if (c.knowledge_unlock_request && c.knowledge_unlock_request.content !== '无') {
        let req = c.knowledge_unlock_request;
        const finalImpact = Math.max(0, Number(req?.impact || 0));

        if (!c.unlocked_knowledges.includes(req.content)) {
          c.unlocked_knowledges.push(req.content);
          data.world.deviation = (data.world.deviation || 0) + finalImpact;
          data.sys.rsn = `[情报解锁] ${charName} 获知了关键情报：${req.content}。世界线偏差值增加 ${finalImpact}！`;
        }

        c.knowledge_unlock_request = { content: '无', impact: 0 };
      }
    });

    _(data.char).forEach((c, charName) => {
      const trainedBonus = ensureNumericStatBonusMap(c.stat, 'trained_bonus');
      if (c.nsfw) {
        const age = Number(c.stat?.age || 0);

    
        if (!c.nsfw._has_menarche) {
          if (age >= 10 && currentTick % 144 === 0) { 
            let menarcheChance = 0;
            if (age === 11) menarcheChance = 0.05;      
            else if (age === 12) menarcheChance = 0.30; 
            else if (age === 13) menarcheChance = 0.60;
            else if (age >= 14) menarcheChance = 0.95;

            if (Math.random() < menarcheChance) { 
              c.nsfw._has_menarche = true;
              c.nsfw.menstrual_offset = 4032 - (currentTick % 4032); 
              
              if (currentTick > 0 && data.sys.rsn !== '初始化') {
                if (!data.sys.rsn) data.sys.rsn = '';
                data.sys.rsn += ` [生理变化] ${charName} 迎来了初潮，正式进入青春期！`;
              }
            } else {
              c.nsfw._menstrual_stage = '未初潮(青春期前)';
            }
          } else if (age < 10) {
            c.nsfw._menstrual_stage = '未初潮(幼年)';
          }
        }

        if (c.nsfw._has_menarche) {
          if (c.nsfw.conception_tick > 0) {
            const pregDays = Math.floor((currentTick - c.nsfw.conception_tick) / 144);
            c.nsfw._pregnancy_days = pregDays;
            c.nsfw._menstrual_stage = '孕期停经'; 

            if (pregDays >= 270 && currentTick % 144 === 0) {
              const birthChance = (pregDays - 270) / 30; 
              
              if (Math.random() < birthChance || pregDays >= 300) {
                if (data.sys.rsn === '初始化' || !data.sys.rsn) data.sys.rsn = '';
                data.sys.rsn += ` [生命降生] ${charName} 经过 ${pregDays} 天的孕育，成功分娩！`;
                c.nsfw.conception_tick = -1;
                c.nsfw.pregnancy_father = '无';
                c.nsfw._pregnancy_days = 0;
              }
            }
          } else {
            c.nsfw._pregnancy_days = 0;
            const cycleTick = (currentTick + c.nsfw.menstrual_offset) % 4032;
            const cycleDays = cycleTick / 144;
            
            if (cycleDays <= 5) {
              c.nsfw._menstrual_stage = '生理期(极度敏感/易疲劳)';
            } else if (cycleDays > 11 && cycleDays <= 16) {
              c.nsfw._menstrual_stage = '排卵期(渴望繁衍/受孕率极高)';
            } else {
              c.nsfw._menstrual_stage = '安全期'; 
            }
          }
        }
      }
      if (c.status.consuming_herb_age > 0) {
        let age = c.status.consuming_herb_age;
        if (c.stat.lv_penalty > 0 && age >= 10000) {
          let recoverAmount = age >= 100000 ? 3 : 1;
          c.stat.lv_penalty = Math.max(0, c.stat.lv_penalty - recoverAmount);
          if (c.status.wound === '濒死') c.status.wound = '重伤';
          data.sys.rsn = `[本源修复] ${charName} 吸收高阶灵物，庞大的生机修补了受损的根基！恢复了 ${recoverAmount} 级等级上限。`;
        } else {
          if (c.stat.lv - c.stat.last_herb_lv >= 20) {
              if (!c.stat.trained_bonus) {
              c.stat.trained_bonus = { str: 0, def: 0, agi: 0, vit_max: 0, men_max: 0, sp_max: 0 };
            }
            if (c.stat.trained_bonus.sp_max === undefined) {
              c.stat.trained_bonus.sp_max = 0;
            }
            addNumericStatBonusValue(trainedBonus, 'sp_max', gain);
            c.stat.last_herb_lv = c.stat.lv;
            data.sys.rsn = `[灵物吸收] ${charName} 成功吸收 ${age} 年灵物，魂力成长槽提升 ${gain} 点！`;
          } else {
            c.stat.lv_penalty += 1;
            c.stat.conditions['灵物反噬'] = {
              类型: 'debuff',
              层数: 1,
              描述: '短时间内强行吸收灵物，经脉受损，永久扣除1级等级上限',
            };
            data.sys.rsn = `[灵物反噬] ${charName} 违规连续吸收灵物！经脉受损，永久扣除 1 级等级上限！`;
          }
        }
        c.status.consuming_herb_age = 0;
      }

      if (c.bloodline_power?._was_life_fire === true && c.bloodline_power?.life_fire === false) {
        data.sys.rsn = `[生命之火熄灭] ${charName} 透支本源，修为暴跌 3 级，陷入濒死！`;
        c.stat.lv = Math.max(1, c.stat.lv - 3);
        c.stat.lv_penalty += 3;
        c.status.wound = '濒死';
        c.stat.vit = 1;
      }

      if (c.bloodline_power) c.bloodline_power._was_life_fire = c.bloodline_power.life_fire;

      let vitMult = 1.0,
        strMult = 1.0,
        allMult = 1.0,
        menMult = 1.0;
      if (c.bloodline_power?.core !== '未凝聚') {
        vitMult = Math.max(vitMult, 1.5);
        strMult = Math.max(strMult, 1.5);
      }
      if (c.bloodline_power?.life_fire === true) {
        allMult = 2.0;
      }

      let hasDragon = false;
      _(c.spirit).forEach(sp => {
        if (/龙/.test(sp.表象名称)) hasDragon = true;
      });
      if (hasDragon) vitMult = Math.max(vitMult, 1.5);

      let eb = {
        sp:
          (c.equip?.wpn?.stats_bonus?.sp_max || 0) +
          (c.equip?.armor?.stats_bonus?.sp_max || 0) +
          (c.equip?.mech?.stats_bonus?.sp_max || 0),
        men:
          (c.equip?.wpn?.stats_bonus?.men_max || 0) +
          (c.equip?.armor?.stats_bonus?.men_max || 0) +
          (c.equip?.mech?.stats_bonus?.men_max || 0),
        str:
          (c.equip?.wpn?.stats_bonus?.str || 0) +
          (c.equip?.armor?.stats_bonus?.str || 0) +
          (c.equip?.mech?.stats_bonus?.str || 0),
        def:
          (c.equip?.wpn?.stats_bonus?.def || 0) +
          (c.equip?.armor?.stats_bonus?.def || 0) +
          (c.equip?.mech?.stats_bonus?.def || 0),
        agi:
          (c.equip?.wpn?.stats_bonus?.agi || 0) +
          (c.equip?.armor?.stats_bonus?.agi || 0) +
          (c.equip?.mech?.stats_bonus?.agi || 0),
        vit:
          (c.equip?.wpn?.stats_bonus?.vit_max || 0) +
          (c.equip?.armor?.stats_bonus?.vit_max || 0) +
          (c.equip?.mech?.stats_bonus?.vit_max || 0),
      };
      if (allMult > 1.0) {
        c.stat.sp_max = Math.floor((c.stat.sp_max - eb.sp) * allMult) + eb.sp;
        c.stat.men_max = Math.floor((c.stat.men_max - eb.men) * allMult) + eb.men;
        c.stat.str = Math.floor((c.stat.str - eb.str) * allMult) + eb.str;
        c.stat.def = Math.floor((c.stat.def - eb.def) * allMult) + eb.def;
        c.stat.agi = Math.floor((c.stat.agi - eb.agi) * allMult) + eb.agi;
        c.stat.vit_max = Math.floor((c.stat.vit_max - eb.vit) * allMult) + eb.vit;
      }

      if (vitMult > 1.0)
        c.stat.vit_max = Math.max(c.stat.vit_max, Math.floor((c.stat.vit_max - eb.vit) * vitMult) + eb.vit);
      if (strMult > 1.0) c.stat.str = Math.max(c.stat.str, Math.floor((c.stat.str - eb.str) * strMult) + eb.str);
      if (menMult > 1.0)
        c.stat.men_max = Math.max(c.stat.men_max, Math.floor((c.stat.men_max - eb.men) * menMult) + eb.men);

      if (c.status.active_domain && c.status.active_domain.includes('斗铠领域')) {
        let ratio = c.status.active_domain.includes('四字') ? 1.2 : 1.1;
        let attrs = ['sp_max', 'men_max', 'str', 'def', 'agi', 'vit_max'];

        if (c.status.active_domain.includes('未定')) {
          if (ratio === 1.2) {
            let a1 = attrs.splice(Math.floor(Math.random() * attrs.length), 1)[0];
            let a2 = attrs.splice(Math.floor(Math.random() * attrs.length), 1)[0];
            c.status.active_domain = `【四字斗铠领域】全开[${a1},${a2}]`;
          } else {
            let a1 = attrs[Math.floor(Math.random() * attrs.length)];
            c.status.active_domain = `【三字斗铠领域】全开[${a1}]`;
          }
        }

        ['sp_max', 'men_max', 'str', 'def', 'agi', 'vit_max'].forEach(attr => {
          if (c.status.active_domain.includes(attr)) {
            c.stat[attr] = Math.floor(c.stat[attr] * ratio);
          }
        });
      }

      let buffMods = { str: 0, def: 0, agi: 0, sp_max: 0 };
      _(c.stat.conditions).forEach(cond => {
        if (cond.stat_mods) {
          if (cond.stat_mods.str !== 1.0) buffMods.str += cond.stat_mods.str - 1.0;
          if (cond.stat_mods.def !== 1.0) buffMods.def += cond.stat_mods.def - 1.0;
          if (cond.stat_mods.agi !== 1.0) buffMods.agi += cond.stat_mods.agi - 1.0;
          if (cond.stat_mods.sp_max !== 1.0) buffMods.sp_max += cond.stat_mods.sp_max - 1.0;
        }
      });
      if (buffMods.str !== 0) c.stat.str = Math.floor(c.stat.str * Math.max(0.1, 1.0 + buffMods.str));
      if (buffMods.def !== 0) c.stat.def = Math.floor(c.stat.def * Math.max(0.1, 1.0 + buffMods.def));
      if (buffMods.agi !== 0) c.stat.agi = Math.floor(c.stat.agi * Math.max(0.1, 1.0 + buffMods.agi));
      if (buffMods.sp_max !== 0) c.stat.sp_max = Math.floor(c.stat.sp_max * Math.max(0.1, 1.0 + buffMods.sp_max));

      let finalMen =
        c.stat.men_max -
        (c.equip?.wpn?.stats_bonus?.men_max || 0) -
        (c.equip?.armor?._stats_bonus?.men_max || 0) -
        (c.equip?.mech?._stats_bonus?.men_max || 0);
      if (finalMen >= 50000) c.stat._men_realm = '神元境';
      else if (finalMen >= 20000) c.stat._men_realm = '灵域境';
      else if (finalMen >= 3000) c.stat._men_realm = '灵渊境';
      else if (finalMen >= 500) c.stat._men_realm = '灵海境';
      else if (finalMen >= 50) c.stat._men_realm = '灵通境';
      else c.stat._men_realm = '灵元境';

      if (finalMen < 25000 && c.spiritual_domain?.is_active) {
        c.spiritual_domain.is_active = false;
        if (c.status.active_domain && c.status.active_domain.includes('精神领域')) {
          c.status.active_domain = c.status.active_domain.replace(/精神领域/g, '').trim();
        }
      }

      c.stat.vit = Math.min(c.stat.vit, c.stat.vit_max);
      c.stat.sp = Math.min(c.stat.sp, c.stat.sp_max);
      c.stat.men = Math.min(c.stat.men, c.stat.men_max);
    });

    _(data.char).forEach((c, charName) => {
      const trainedBonus = ensureNumericStatBonusMap(c.stat, 'trained_bonus');
      if (c.interact_request && c.interact_request.action !== '无') {
        let req = c.interact_request;
        let targetName = req.target_npc;
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
          if (!c.social.relations[targetName]) {
            c.social.relations[targetName] = {
              关系: '陌生',
              好感度: 0,
              relation_route: '朋友线',
              npc_job: '无',
              favor_buff: '无',
            };
          }
          let rel = c.social.relations[targetName];
          let score = req.ai_score;
          const currentTick = Number(data.world?.time?.tick || 0);

          if (req.action === '送礼') {
            if (req.item_used !== '无' && c.inventory[req.item_used] && c.inventory[req.item_used].数量 > 0) {
              c.inventory[req.item_used].数量 -= 1;
              if (c.inventory[req.item_used].数量 <= 0) delete c.inventory[req.item_used];

              score = Math.floor(score * 1.5) + 5;
              msg = `[社交互动] ${charName} 向 ${targetName} 赠送了【${req.item_used}】。`;
            } else {
              msg = `[互动失败] 背包中没有足够的【${req.item_used}】用来送礼！`;
              score = 0;
            }
          } else if (req.action === '请教') {
            if (rel.好感度 >= 30 && score > 0) {
              addNumericStatBonusEntries(trainedBonus, { str: score, men_max: score });
              msg = `[社交互动] ${charName} 向 ${targetName} 请教修炼心得，受益匪浅！`;
            } else {
              msg = `[社交互动] ${charName} 试图请教 ${targetName}，但对方似乎不太愿意倾囊相授。(好感度需>=30)`;
              score = 0;
            }
          } else {
            msg = `[社交互动] ${charName} 与 ${targetName} 进行了【${req.action}】。`;
          }

          if (score !== 0) {
            rel.好感度 += score;
            msg += ` 好感度变化：${score > 0 ? '+' : ''}${score} (当前: ${rel.好感度})。`;
          }

          if (req.action === '表白' && score > 0) {
            const currentRoute = String(rel.relation_route || '朋友线');
            const targetRel =
              targetNPC.social && targetNPC.social.relations && targetNPC.social.relations[charName]
                ? targetNPC.social.relations[charName]
                : null;
            const targetCurrentRoute = String(targetRel?.relation_route || '朋友线');
            const favorAfterConfess = Number(rel.好感度 || 0);
            const shouldAutoPromoteLoveRoute = currentRoute !== '恋人线' && favorAfterConfess >= 60;

            if (currentRoute === '恋人线' || targetCurrentRoute === '恋人线') {
              rel.relation_route = '恋人线';
              if (targetRel) targetRel.relation_route = '恋人线';
            } else if (shouldAutoPromoteLoveRoute) {
              rel.relation_route = '恋人线';
              msg += ` 关系路线切入【恋人线】。`;
              if (targetRel) {
                targetRel.relation_route = '恋人线';
              }
            }
          }

          rel.last_interact_tick = currentTick;
          rel.last_interact_action = req.action;
          rel.recent_favor_delta = score;
          if (!rel.npc_job || rel.npc_job === '无') {
            const targetIdentity = targetNPC.social?.main_identity;
            rel.npc_job = !isAiTodoText(targetIdentity) && targetIdentity ? targetIdentity : '无';
          }

          if (!targetNPC.social.relations[charName]) {
            targetNPC.social.relations[charName] = {
              关系: '陌生',
              好感度: 0,
              relation_route: '朋友线',
              npc_job: '无',
              favor_buff: '无',
            };
          }
          targetNPC.social.relations[charName].好感度 = rel.好感度;
          targetNPC.social.relations[charName].relation_route =
            rel.relation_route || targetNPC.social.relations[charName].relation_route || '朋友线';
          targetNPC.social.relations[charName].last_interact_tick = currentTick;
          targetNPC.social.relations[charName].last_interact_action = req.action;
          targetNPC.social.relations[charName].recent_favor_delta = score;
          if (!targetNPC.social.relations[charName].npc_job || targetNPC.social.relations[charName].npc_job === '无') {
            const sourceIdentity = c.social?.main_identity;
            targetNPC.social.relations[charName].npc_job =
              !isAiTodoText(sourceIdentity) && sourceIdentity ? sourceIdentity : '无';
          }
        }

        if (msg) data.sys.rsn = msg;
        c.interact_request = { target_npc: '无', action: '无', item_used: '无', ai_score: 0 };
      }
    });

    _(data.char).forEach((c, charName) => {
      if (c.quest_request && c.quest_request.action !== '无') {
        let req = c.quest_request;
        let qName = req.quest_name;
        let msg = '';
        if (!data.world.quest_board || typeof data.world.quest_board !== 'object') data.world.quest_board = {};
        let boardEntry = data.world.quest_board[qName];

        if (req.action === '接取') {
          c.records[qName] = {
            类型: (boardEntry && boardEntry.类型) || '悬赏任务',
            状态: '进行中',
            当前进度: 0,
            目标进度: req.required_count,
            奖励币: req.reward_coin,
            奖励声望: req.reward_rep,
            描述: req.quest_desc,
          };
          if (boardEntry && typeof boardEntry === 'object') {
            boardEntry.状态 = '进行中';
            boardEntry.承接者 = charName;
          }
          msg = `[任务接取] ${charName} 接取了悬赏：【${qName}】。目标：${req.quest_desc}。`;
        } else if (req.action === '更新进度' && c.records[qName]) {
          let q = c.records[qName];
          if (q.状态 === '进行中') {
            q.当前进度 += req.progress_add;
            msg = `[任务进度] 【${qName}】进度更新：${q.当前进度}/${q.目标进度}。`;
            if (q.当前进度 >= q.目标进度) {
              q.状态 = '可提交';
              if (boardEntry && typeof boardEntry === 'object') boardEntry.状态 = '可提交';
              msg += ` (已达成目标，可前往提交！)`;
            }
          }
        } else if (req.action === '提交' && c.records[qName]) {
          let q = c.records[qName];
          if (q.状态 === '可提交' || q.当前进度 >= q.目标进度) {
            q.状态 = '已完成';
            c.wealth.fed_coin = (c.wealth.fed_coin || 0) + (q.奖励币 || 0);
            c.social.reputation = (c.social.reputation || 0) + (q.奖励声望 || 0);
            if (boardEntry && typeof boardEntry === 'object') {
              boardEntry.状态 = '已完成';
              boardEntry.承接者 = charName;
            }
            msg = `[任务完成] ${charName} 提交了【${qName}】！获得奖励：${q.奖励币} 联邦币, ${q.奖励声望} 声望！`;
          } else {
            msg = `[任务提交失败] 【${qName}】进度未达标 (${q.当前进度}/${q.目标进度})，NPC 拒绝结算！`;
          }
        } else if (req.action === '放弃' && c.records[qName]) {
          c.records[qName].状态 = '已放弃';
          if (boardEntry && typeof boardEntry === 'object') {
            boardEntry.状态 = '待接取';
            boardEntry.承接者 = '无';
          }
          msg = `[任务放弃] ${charName} 放弃了悬赏：【${qName}】。`;
        }

        if (msg) data.sys.rsn = msg;
        c.quest_request = {
          action: '无',
          quest_name: '无',
          quest_desc: '无',
          progress_add: 0,
          required_count: 1,
          reward_coin: 0,
          reward_rep: 0,
        };
      }
    });

    _(data.char).forEach((c, charName) => {
      if (c.promotion_request && c.promotion_request.target_faction !== '无') {
        let req = c.promotion_request;
        let fac = req.target_faction;
        let title = req.target_title;
        let lv = c.stat.lv;
        let armorLv = c.equip.armor.lv;
        let mechLvStr = c.equip.mech.lv;
        let mechLv = mechLvStr === '紫级' ? 2 : mechLvStr === '黑级' ? 3 : mechLvStr === '红级' ? 4 : 0;
        let age = c.stat.age;
        let realm = c.stat._men_realm || c.stat.men_realm;

        let pts = c.wealth.tang_pt || 0;
        if (fac === '史莱克学院') pts = c.wealth.shrek_pt || 0;
        if (fac === '战神殿' || fac === '血神军团' || fac === '联邦军方') pts = c.wealth.blood_pt || 0;

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
          if (title === '外院毕业生' && lv >= 50 && armorLv >= 1 && c.stat.age <= 35) {
            success = true;
            cost = 0;
          } else if (title === '内院弟子') {
            if (
              c.stat.age <= 20 &&
              armorLv >= 1 &&
              lv >= 50 &&
              ['灵海境', '灵渊境', '灵域境', '神元境'].includes(c.stat._men_realm || c.stat.men_realm)
            ) {
              success = true;
              cost = 0;
            } else if (c.stat.age > 20 && c.stat.age <= 30 && armorLv >= 2) {
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

            if (!c.social.factions['联邦军方']) c.social.factions['联邦军方'] = { 身份: '少将', 权限级: 7 };
            else c.social.factions['联邦军方'].身份 = '少将';
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
          if (c.stat.is_evil) {
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
          if (fac === '唐门') c.wealth.tang_pt -= cost;
          else if (fac === '史莱克学院') c.wealth.shrek_pt -= cost;
          else if (fac === '战神殿' || fac === '血神军团' || fac === '联邦军方') c.wealth.blood_pt -= cost;

          if (!c.social.factions[fac]) c.social.factions[fac] = { 身份: title, 权限级: 1 };
          else c.social.factions[fac].身份 = title;

          msg = `[势力晋升] 恭喜 ${charName} 成功晋升为【${fac} - ${title}】！`;
          if (cost > 0) msg += `扣除贡献/战功: ${cost}。`;
        }
        data.sys.rsn = msg;
        c.promotion_request = { target_faction: '无', target_title: '无' };
      }
      if (c.donate_request && c.donate_request.item_name !== '无') {
        let req = c.donate_request;
        let itemName = req.item_name;

        if (!c.inventory[itemName] || c.inventory[itemName].数量 < req.quantity) {
          data.sys.rsn = `[捐献失败] 背包中没有足够的【${itemName}】。`;
        } else {
          let basePrice = 10000;
          if (/天锻|四字|红级|十万年/.test(itemName)) basePrice = 100000000;
          else if (/魂锻|三字|黑级|万年/.test(itemName)) basePrice = 10000000;
          else if (/灵锻|二字|紫级|千年/.test(itemName)) basePrice = 1000000;
          else if (/千锻|一字|黄级|百年/.test(itemName)) basePrice = 100000;

          let talentMult =
            { 绝世妖孽: 2.0, 顶级天才: 1.8, 天才: 1.5, 优秀: 1.2, 正常: 1.0, 劣等: 0.5 }[c.stat.talent_tier] || 1.0;

          let totalValue = basePrice * req.quantity;
          let pointsEarned = Math.floor((totalValue / 1000) * talentMult);

          c.inventory[itemName].数量 -= req.quantity;
          if (c.inventory[itemName].数量 <= 0) delete c.inventory[itemName];

          if (req.target_faction === '史莱克学院') c.wealth.shrek_pt = (c.wealth.shrek_pt || 0) + pointsEarned;
          else if (req.target_faction === '战神殿' || req.target_faction === '血神军团')
            c.wealth.blood_pt = (c.wealth.blood_pt || 0) + pointsEarned;
          else c.wealth.tang_pt = (c.wealth.tang_pt || 0) + pointsEarned;

          data.sys.rsn = `[物资捐献] ${charName} 向【${req.target_faction}】上交了 ${req.quantity} 份【${itemName}】。获得 ${pointsEarned} 贡献点！`;
        }
        c.donate_request = { item_name: '无', target_faction: '无', quantity: 1 };
      }
    });

    _(data.char).forEach((c, charName) => {
      if (c.ascension_request && c.ascension_request.ticket_type !== '无') {
        let req = c.ascension_request;
        let ticketName = String(req.ticket_type || '无');
        let gainAge = Math.max(0, Math.floor(Number(req.gain_age || 0)));
        let msg = '';

        if (!c.inventory?.[ticketName] || Number(c.inventory[ticketName].数量 || 0) < 1) {
          msg = `[升灵台失败] ${charName} 缺少【${ticketName}】门票，无法完成本次升灵结算。`;
        } else {
          let spiritKey = String(req.spirit_key || '无');
          if (spiritKey === '无' || !c.spirit?.[spiritKey]) {
            spiritKey =
              Object.keys(c.spirit || {}).find(key => c.spirit?.[key]?.soul_spirits && Object.keys(c.spirit[key].soul_spirits || {}).length > 0) || '';
          }
          let spiritData = spiritKey ? c.spirit?.[spiritKey] : null;

          let soulSpiritKey = String(req.soul_spirit_key || '无');
          if (soulSpiritKey === '无' || !spiritData?.soul_spirits?.[soulSpiritKey]) {
            soulSpiritKey = spiritData ? Object.keys(spiritData.soul_spirits || {})[0] || '' : '';
          }
          let soulSpirit = soulSpiritKey ? spiritData?.soul_spirits?.[soulSpiritKey] : null;

          if (!spiritData || !soulSpirit) {
            msg = `[升灵台失败] ${charName} 当前没有可升灵的魂灵目标，未消耗门票。`;
          } else if (gainAge <= 0) {
            msg = `[升灵台失败] ${charName} 未填写有效的升灵收益年限，未消耗门票。`;
          } else {
            c.inventory[ticketName].数量 -= 1;
            if (c.inventory[ticketName].数量 <= 0) delete c.inventory[ticketName];

            let oldAge = Math.max(0, Math.floor(Number(soulSpirit.年限 || 0)));
            let newAge = oldAge + gainAge;
            soulSpirit.年限 = newAge;

            _(soulSpirit.rings || {}).forEach(ring => {
              if (!ring || typeof ring !== 'object') return;
              ring.年限 = newAge;
              ring.颜色 = getRingColorByAge(newAge);
            });

            msg = `[升灵台] ${charName} 使用【${ticketName}】为【${spiritKey}/${soulSpiritKey}】完成升灵，年限由 ${oldAge} 提升至 ${newAge}（+${gainAge}）。`;
          }
        }

        data.sys.rsn = msg;
        c.ascension_request = { ticket_type: '无', spirit_key: '无', soul_spirit_key: '无', gain_age: 0 };
      }

      if (c.tower_request && c.tower_request.action !== '无') {
        let req = c.tower_request;
        let clearedFloor = Math.max(0, Math.floor(Number(req.cleared_floor || 0)));
        let action = String(req.action || '冲塔');
        let msg = '';

        if (clearedFloor <= 0) {
          msg = `[魂灵塔记录失败] ${charName} 未提供有效的通关层数，无法登记本次${action}结果。`;
        } else {
          if (!c.tower_records || typeof c.tower_records !== 'object') c.tower_records = { max_floor: 0, discount_available: {} };
          if (!c.tower_records.discount_available || typeof c.tower_records.discount_available !== 'object')
            c.tower_records.discount_available = {};

          let oldMaxFloor = Math.max(0, Math.floor(Number(c.tower_records.max_floor || 0)));
          let newMaxFloor = Math.max(oldMaxFloor, clearedFloor);
          c.tower_records.max_floor = newMaxFloor;

          for (let floor = oldMaxFloor + 1; floor <= clearedFloor; floor += 1) {
            c.tower_records.discount_available[String(floor)] = true;
          }

          if (clearedFloor > oldMaxFloor) {
            msg = `[魂灵塔] ${charName} 本次${action}达到第 ${clearedFloor} 层，刷新历史最高层数（${oldMaxFloor} -> ${newMaxFloor}），并解锁对应层数的五折资格。`;
          } else {
            msg = `[魂灵塔] ${charName} 本次${action}达到第 ${clearedFloor} 层，未刷新历史最高层数（当前最高 ${oldMaxFloor} 层）。`;
          }
        }

        data.sys.rsn = msg;
        c.tower_request = { action: '无', cleared_floor: 0 };
      }

      if (c.abyss_kill_request && c.abyss_kill_request.kill_tier !== '无') {
        let req = c.abyss_kill_request;
        let pts = 0;

        if (req.kill_tier === '低阶生物') pts = 10 * req.quantity;
        else if (req.kill_tier === '中阶生物') pts = 100 * req.quantity;
        else if (req.kill_tier === '高阶生物') pts = 1000 * req.quantity;
        else if (req.kill_tier === '深渊王者') pts = 50000 * req.quantity;

        if (pts > 0) {
          c.wealth.blood_pt = (c.wealth.blood_pt || 0) + pts;
          data.sys.rsn = `[深渊战功] ${charName} 击杀了 ${req.quantity} 只【${req.kill_tier}】，获得 ${pts} 点战功！`;
        } else {
          data.sys.rsn = `[深渊战功] ${charName} 击杀上报异常，未获得战功。`;
        }
        c.abyss_kill_request = { kill_tier: '无', quantity: 1 };
      }
    });
    _(data.char).forEach((c, charName) => {
      if (c.status.loc) {
        if (c.status.loc.includes('生命之湖') && c.stat.lv < 90) {
          c.stat.conditions['极致凶威压制'] = {
            类型: 'debuff',
            层数: 1,
            描述: '擅闯生命之湖，被多股凶兽级精神力锁定，随时陨落！',
          };
        } else if (c.status.loc.includes('星斗大森林核心区') && c.stat.lv < 50) {
          c.stat.conditions['跨阶恐惧'] = { 类型: 'debuff', 层数: 1, 描述: '实力不足以踏足核心区，深陷高阶魂兽包围' };
          if (c.status.wound === '无') c.status.wound = '重伤';
        } else if (c.status.loc.includes('深海') && c.stat.lv < 50) {
          c.stat.conditions['深海压迫'] = { 类型: 'debuff', 层数: 1, 描述: '修为不足以抵御深海重压' };
        }
      }

      if (c.hunt_request && c.hunt_request.killed_age > 0) {
        let req = c.hunt_request;
        let age = req.killed_age;

        let ringName = `${age}年魂环`;
        if (!c.inventory[ringName])
          c.inventory[ringName] = { 数量: 0, 类型: '魂环', 品质: '标准', 描述: '未吸收的无主魂环' };
        c.inventory[ringName].数量 += 1;
        let msg = `[现实狩猎] ${charName} 击杀了 ${age} 年魂兽，获得【${ringName}】！`;

        let dropRate = age >= 100000 ? 100 : (age / 100000) * 100;
        let roll = Math.floor(Math.random() * 100) + 1;
        data.sys.last_roll = roll;
        if (roll <= dropRate) {
          let boneName = `${age}年魂骨`;
          if (!c.inventory[boneName])
            c.inventory[boneName] = {
              数量: 0,
              类型: '魂骨',
              品质: age >= 100000 ? '极品' : '常规',
              描述: '未吸收的无主魂骨',
            };
          c.inventory[boneName].数量 += 1;
          msg += `【好运爆发】成功剥离出【${boneName}】！(Roll: ${roll} <= ${dropRate}%)`;
        }

        if (c.status.loc && c.status.loc.includes('星斗大森林')) {
          data.world.forest_killed_age = (data.world.forest_killed_age || 0) + age;
          if (data.world.forest_killed_age >= 1000000 && !data.world.flags['beast_tide']) {
            msg += `\n🚨 [大区警报] 星斗大森林魂兽死伤惨重(累计超100万年)，血腥气彻底引爆凶兽怒火！【兽潮】开始集结！`;
            if (!data.world.flags) data.world.flags = {};
            data.world.flags['beast_tide'] = true;
          }
        }

        if (req.is_ferocious || age >= 100000) {
          let deviationGain = Math.floor(30 * (data.world.deviation_multiplier || 1.0));
          data.world.deviation = (data.world.deviation || 0) + deviationGain;
          c.stat.conditions['魂兽公敌'] = {
            类型: 'debuff',
            层数: 1,
            描述: '击杀顶级魂兽染上的极致怨气，野外魂兽仇恨锁定',
          };

          msg += `\n💀 [命运反噬] 击杀十万年/凶兽！世界线偏差值暴涨 ${deviationGain}！烙上【魂兽公敌】印记！`;
        }
        data.sys.rsn = msg;
        c.hunt_request = { killed_age: 0, is_ferocious: false };
      }
    });

    const REFRESH_INTERVAL = 1008;

    _(data.world.locations).forEach((cityData, cityName) => {
      if (!cityData.stores) cityData.stores = {};

      const groceryStoreName = '城市杂货店';
      if (!cityData.stores[groceryStoreName]) {
        cityData.stores[groceryStoreName] = { inventory: {}, next_refresh_tick: 0 };
      }
      const groceryStore = cityData.stores[groceryStoreName];

      if (currentTick >= (groceryStore.next_refresh_tick || 0)) {
        let newInventory = {};
        const economy = cityData.经济状况 || '普通';
        let stockMultiplier = 1.0;
        if (economy === '繁荣') stockMultiplier = 1.5;
        else if (economy === '萧条') stockMultiplier = 0.5;

        _(BaseProductPool).forEach((item, itemName) => {
          newInventory[itemName] = {
            ...item,
            stock: Math.floor((Math.random() * 10 + 5) * stockMultiplier),
          };
        });
        groceryStore.inventory = newInventory;
        groceryStore.next_refresh_tick = currentTick + REFRESH_INTERVAL;
      }
    });

    _(FactionDistribution).forEach((dist, factionName) => {
      (dist.branches || []).forEach(cityName => {
        if (data.world.locations[cityName]) {
          const cityData = data.world.locations[cityName];
          const storeName = `${factionName}分店`;
          if (!cityData.stores[storeName]) {
            cityData.stores[storeName] = { inventory: {}, next_refresh_tick: 0 };
          }
          const store = cityData.stores[storeName];

          if (currentTick >= (store.next_refresh_tick || 0)) {
            store.inventory = {};

            if (factionName === '唐门') _.merge(store.inventory, TangmenShopProducts);
            else if (factionName === '史莱克学院') _.merge(store.inventory, ShrekAcademyShopProducts);
            else if (AssociationShopProducts[factionName])
              _.merge(store.inventory, AssociationShopProducts[factionName]);
            else if (factionName === '传灵塔') {
              store.inventory['十年魂灵·随机型'] = {
                price: 50000,
                currency: 'fed_coin',
                type: '魂灵',
                stock: 5,
                req_fame: 0,
                description: '最基础的人造魂灵，适合平民魂师。',
                effects: [
                  {
                    target: 'inventory',
                    type: 'add',
                    value: { '十年魂灵(随机)': { 数量: 1, 类型: '魂灵', 品质: '十年' } },
                  },
                ],
              };
              store.inventory['百年魂灵·随机型'] = {
                price: 1000000,
                currency: 'fed_coin',
                type: '魂灵',
                stock: 3,
                req_fame: 0,
                description: '品质尚可的百年魂灵。',
                effects: [
                  {
                    target: 'inventory',
                    type: 'add',
                    value: { '百年魂灵(随机)': { 数量: 1, 类型: '魂灵', 品质: '百年' } },
                  },
                ],
              };

              let isWanNianUnlocked = data.world.flags['event_clt_wannian'];

              if (isWanNianUnlocked) {
                store.inventory['千年魂灵·随机型'] = {
                  price: 6000000,
                  currency: 'fed_coin',
                  type: '魂灵',
                  stock: 2,
                  req_fame: 500,
                  description: '技术成熟后的量产千年魂灵，价格已大幅下降。',
                  effects: [
                    {
                      target: 'inventory',
                      type: 'add',
                      value: { '千年魂灵(随机)': { 数量: 1, 类型: '魂灵', 品质: '千年' } },
                    },
                  ],
                };
                store.inventory['万年魂灵·随机型'] = {
                  price: 100000000,
                  currency: 'fed_coin',
                  type: '魂灵',
                  stock: 1,
                  req_fame: 5000,
                  description: '传灵塔尖端科技结晶，万年级别魂灵！',
                  effects: [
                    {
                      target: 'inventory',
                      type: 'add',
                      value: { '万年魂灵(随机)': { 数量: 1, 类型: '魂灵', 品质: '万年' } },
                    },
                  ],
                };
              } else {
                store.inventory['千年魂灵·随机型'] = {
                  price: 20000000,
                  currency: 'fed_coin',
                  type: '魂灵',
                  stock: 1,
                  req_fame: 1000,
                  description: '当前技术下极难培育的千年魂灵，造价高昂。',
                  effects: [
                    {
                      target: 'inventory',
                      type: 'add',
                      value: { '千年魂灵(随机)': { 数量: 1, 类型: '魂灵', 品质: '千年' } },
                    },
                  ],
                };
              }

              const economy = cityData.经济状况 || '普通';
              let probMultiplier = 1.0;
              if (economy === '繁荣') probMultiplier = 1.5;
              else if (economy === '萧条') probMultiplier = 0.5;

              if (Math.random() * 100 <= 20 * probMultiplier) {
                store.inventory['初级升灵台门票'] = {
                  price: 500000,
                  currency: 'fed_coin',
                  type: '门票',
                  stock: 1,
                  req_fame: 0,
                  description: '可进入初级升灵台，最高遭遇3千年以下虚拟魂兽。',
                  effects: [],
                };
              }
              if (Math.random() * 100 <= 10 * probMultiplier) {
                store.inventory['中级升灵台门票'] = {
                  price: 5000000,
                  currency: 'fed_coin',
                  type: '门票',
                  stock: 1,
                  req_fame: 1000,
                  description: '可进入中级升灵台，最高遭遇2万年以下虚拟魂兽。',
                  effects: [],
                };
              }
              if (Math.random() * 100 <= 5 * probMultiplier) {
                store.inventory['高级升灵台门票'] = {
                  price: 50000000,
                  currency: 'fed_coin',
                  type: '门票',
                  stock: 1,
                  req_fame: 5000,
                  description: '可进入高级升灵台，最高遭遇10万年以下虚拟魂兽。',
                  effects: [],
                };
              }
            }

            const economy = cityData.经济状况 || '普通';
            let probMultiplier = 1.0;
            if (economy === '繁荣') probMultiplier = 1.5;
            else if (economy === '萧条') probMultiplier = 0.2;

            if (factionName.includes('锻造师协会')) {
              tryGenerateDynamicItem(store.inventory, '千锻金属块', 500000, 2, 60 * probMultiplier);
              tryGenerateDynamicItem(store.inventory, '灵锻金属块', 10000000, 3, 20 * probMultiplier);
              tryGenerateDynamicItem(store.inventory, '魂锻金属块', 80000000, 4, 3 * probMultiplier);
              tryGenerateDynamicItem(store.inventory, '天锻金属块', 500000000, 5, 0.1 * probMultiplier);
            } else if (factionName.includes('设计师协会')) {
              tryGenerateDynamicItem(store.inventory, '二字斗铠设计图', 2000000, 3, 30 * probMultiplier);
              tryGenerateDynamicItem(store.inventory, '三字斗铠设计图', 20000000, 4, 5 * probMultiplier);
              tryGenerateDynamicItem(store.inventory, '四字斗铠设计图', 150000000, 5, 0.5 * probMultiplier);
            }

            store.next_refresh_tick = currentTick + REFRESH_INTERVAL;
          }
      }
    });
    });
    function tryGenerateDynamicItem(inventory, itemName, basePrice, tier, prob) {
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
      let stock = tier === 1 ? Math.floor(Math.random() * 10) + 5 : Math.floor(Math.random() * 2) + 1;

      let reqFame = 0;
      if (tier === 3) reqFame = 1000;
      else if (tier === 4) reqFame = 5000;
      else if (tier === 5) reqFame = 20000;

      inventory[`[随机]${itemName}${nameSuffix}`] = {
        price: finalPrice,
        currency: 'fed_coin',
        stock,
        req_fame: reqFame,
        description: `一批限时供应的${itemName}。`,
        effects: [
          {
            target: 'inventory',
            type: 'add',
            value: { [`${itemName}${nameSuffix}`]: { 数量: 1, 类型: '材料', 品质: '随机' } },
          },
        ],
      };
    }

    if (data && data.char) {
      if (!data.world) data.world = {};

      FLAT_LOCATIONS = {};
      if (data.world.locations) {
        for (let rootName in data.world.locations) {
          refreshFlatLocationsFromTree(data.world.locations[rootName], rootName);
        }
      }

      if (!data.world.map_patches) data.world.map_patches = {};
      if (!data.world.dynamic_locations) data.world.dynamic_locations = {};

      _(data.world.dynamic_locations).forEach((locData, locName) => {
        if (locData.x === undefined) locData.x = FLAT_LOCATIONS[locData.归属父节点]?.x ?? -1;
        if (locData.y === undefined) locData.y = FLAT_LOCATIONS[locData.归属父节点]?.y ?? -1;
        if (!locData.map_id || locData.map_id === '无') locData.map_id = 'map_douluo_world';
        locData.node_type = normalizeDynamicLocationNodeType(locData.node_type, locData.层级, locName);
        if (!locData.icon || locData.icon === '无') locData.icon = 'marker';
        if (!locData.settlement_id || locData.settlement_id === '无') locData.settlement_id = '无';
      });

      // 先清空存储态占位文本，再在 display_all 打包阶段按需注入显示占位词。
      // 仅改值，不删减变量结构。
      clearStorageTodoPlaceholders(data.char);

      // travel_request 已弃用：统一移除；promotion/donate 仅玩家保留。
      const PLAYER_NAME = data.sys?.player_name;
      _(data.char).forEach((charData, charName) => {
        if (!charData || typeof charData !== 'object') return;
        delete charData.travel_request;
        if (charName === PLAYER_NAME) {
          if (!charData.promotion_request || typeof charData.promotion_request !== 'object') {
            charData.promotion_request = { target_faction: '无', target_title: '无' };
          } else {
            if (charData.promotion_request.target_faction === undefined) charData.promotion_request.target_faction = '无';
            if (charData.promotion_request.target_title === undefined) charData.promotion_request.target_title = '无';
          }
          if (!charData.donate_request || typeof charData.donate_request !== 'object') {
            charData.donate_request = { item_name: '无', target_faction: '无', quantity: 1 };
          } else {
            if (charData.donate_request.item_name === undefined) charData.donate_request.item_name = '无';
            if (charData.donate_request.target_faction === undefined) charData.donate_request.target_faction = '无';
            if (charData.donate_request.quantity === undefined) charData.donate_request.quantity = 1;
          }
        } else {
          delete charData.promotion_request;
          delete charData.donate_request;
        }
      });

      const visibleChars = {};
      const protagonist = data.char[PLAYER_NAME];
      const unlocked = protagonist?.unlocked_knowledges || [];
      const currentLoc = protagonist?.status?.loc || '未知';
      const relations = protagonist?.social?.relations || {};
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
          skill.画面描述 = hasPackedEffects ? AI_TODO_SKILL_VISUAL : SKILL_TEXT_UNKNOWN;
        if (isEmptyDisplayText(skill.效果描述))
          skill.效果描述 = hasPackedEffects ? AI_TODO_SKILL_EFFECT : SKILL_TEXT_UNKNOWN;
        if (!Array.isArray(skill.附带属性) && (skill.附带属性 === undefined || skill.附带属性 === null || skill.附带属性 === ''))
          skill.附带属性 = [];
      };
      const injectDisplaySkillMapDefaults = (skillMap = {}, contextFactory = () => ({})) => {
        _(skillMap || {}).forEach((skill, skillName) => {
          if (!skill || typeof skill !== 'object') return;
          injectDisplaySkillStructDefaults(skill, contextFactory(skillName, skill) || {});
        });
      };
      const injectDisplayCharacterTodoDefaults = (charData = {}) => {
        if (!charData || typeof charData !== 'object') return charData;

        ensureDisplayText(charData, 'personality', AI_TODO_PERSONALITY);
        if (charData.social && typeof charData.social === 'object') {
          ensureDisplayText(charData.social, 'main_identity', AI_TODO_MAIN_IDENTITY);
        }
        if (charData.status && typeof charData.status === 'object') {
          ensureDisplayText(charData.status, 'loc', AI_TODO_STATUS_LOC);
        }
        if (charData.appearance && typeof charData.appearance === 'object') {
          ensureDisplayText(charData.appearance, '发色', '待补全(根据角色外貌补全发色)');
          ensureDisplayText(charData.appearance, '发型', '待补全(根据角色发质与气质补全发型)');
          ensureDisplayText(charData.appearance, '瞳色', '待补全(根据角色外貌补全瞳色)');
          ensureDisplayText(charData.appearance, '身高', '待补全(根据角色设定补全身高)');
          ensureDisplayText(charData.appearance, '体型', '待补全(根据角色体态补全体型)');
          ensureDisplayText(charData.appearance, '长相描述', '待补全(根据角色面部特征补全长相描述)');
          if (!Array.isArray(charData.appearance.特殊特征)) charData.appearance.特殊特征 = [];
          else {
            charData.appearance.特殊特征 = charData.appearance.特殊特征
              .map(item => String(item ?? '').trim())
              .filter(item => item && !/^待补全\(/.test(item));
          }
        }
        if (charData.clothing && typeof charData.clothing === 'object') {
          ensureDisplayText(charData.clothing, 'outfit', '待补全(从衣柜中选择当前套装名)');
          _(charData.clothing.wardrobe || {}).forEach(wardrobeData => {
            if (!wardrobeData || typeof wardrobeData !== 'object') return;
            ensureDisplayText(wardrobeData, '上装', '待补全(根据当前套装补全上装)');
            ensureDisplayText(wardrobeData, '下装', '待补全(根据当前套装补全下装)');
            ensureDisplayText(wardrobeData, '鞋子', '待补全(根据当前套装补全鞋子)');
            ensureDisplayText(wardrobeData, '描述', '待补全(根据套装整体补全服装描述)');
          });
        }
        if (charData.nsfw && typeof charData.nsfw === 'object') {
          ensureDisplayStringArray(charData.nsfw, 'fetishes', '待生成(请根据角色经历，填写已觉醒的特殊癖好标签)');
          ensureDisplayStringArray(
            charData.nsfw,
            'fantasies',
            '待生成(请根据角色隐藏的性格，描写其内心深处渴望被对待的私密方式)',
          );
          if (charData.nsfw.measurements && typeof charData.nsfw.measurements === 'object') {
            ensureDisplayText(charData.nsfw.measurements, '罩杯', '待生成(请根据角色体型填写，如A/B/C/D/E)');
            ensureDisplayText(charData.nsfw.measurements, '身材描述', '待生成(请描写其身材曲线与肉感)');
          }
          if (charData.nsfw.intimate_wear && typeof charData.nsfw.intimate_wear === 'object') {
            ensureDisplayText(
              charData.nsfw.intimate_wear,
              '内衣',
              '待生成(请根据当前情境描写具体内衣款式，如蕾丝胸罩/真空/拘束具)',
            );
            ensureDisplayText(charData.nsfw.intimate_wear, '内裤', '待生成(请描写具体内裤款式，如丁字裤/C字裤/真空/贞操带)');
            ensureDisplayStringArray(
              charData.nsfw.intimate_wear,
              '特殊道具',
              '待生成(若体内或体表佩戴了跳蛋/项圈等道具请在此列出)',
            );
          }
          _(charData.nsfw.body_parts || {}).forEach(partData => {
            if (!partData || typeof partData !== 'object') return;
            ensureDisplayText(
              partData,
              '外观特征',
              '待生成(请描写该部位的静态外观与天生敏感特征，如：粉嫩/修长/天生敏感)',
            );
          });
        }

        _(charData.spirit || {}).forEach((spiritData, spiritKey) => {
          if (!spiritData || typeof spiritData !== 'object') return;
          const spiritType = spiritData?.type || charData?.stat?.type || '强攻系';
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

          _(spiritData?.soul_spirits || {}).forEach((soulSpirit, soulSpiritKey) => {
            if (!soulSpirit || typeof soulSpirit !== 'object') return;
            ensureDisplayText(soulSpirit, '表象名称', AI_TODO_SOUL_SPIRIT_NAME);
            if (isEmptyDisplayText(soulSpirit.描述))
              soulSpirit.描述 = buildSoulSpiritDescriptionTodoText(soulSpirit);
            ensureDisplayText(soulSpirit, '品质', AI_TODO_SOUL_SPIRIT_QUALITY);
            ensureDisplayStringArray(soulSpirit, '附机制候选', AI_TODO_SOUL_SPIRIT_SECONDARY);
            _(soulSpirit?.rings || {}).forEach(ringData => {
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

          injectDisplaySkillMapDefaults(spiritData.custom_skills, skillName => ({
            type: spiritType,
            textContext: {
              spiritName:
                !isAiTodoText(spiritData?.表象名称) && spiritData?.表象名称 !== '未展露'
                  ? spiritData.表象名称
                  : spiritKey || skillName,
              type: spiritType,
            },
          }));
        });

        _(charData.soul_bone || {}).forEach((boneData, bonePart) => {
          if (!boneData || typeof boneData !== 'object') return;
          if (isEmptyDisplayText(boneData.名称)) {
            const fallbackPart = String(bonePart || '魂骨');
            boneData.名称 = `【未鉴定之${fallbackPart.replace('魂骨', '骨')}】`;
          }
          ensureDisplayText(boneData, '来源', '无');
          injectDisplaySkillMapDefaults(boneData?.附带技能, skillName => ({
            type: charData?.stat?.type || '强攻系',
            textContext: {
              spiritName: boneData?.名称 || bonePart || skillName,
              type: charData?.stat?.type || '强攻系',
            },
          }));
        });

        if (charData.bloodline_power && typeof charData.bloodline_power === 'object') {
          const bloodlineType = charData?.stat?.type || '强攻系';
          ensureDisplayText(charData.bloodline_power, '属性体系', AI_TODO_ATTRIBUTE_SYSTEM);
          if (
            !Array.isArray(charData.bloodline_power.已解锁属性) &&
            (charData.bloodline_power.已解锁属性 === undefined ||
              charData.bloodline_power.已解锁属性 === null ||
              charData.bloodline_power.已解锁属性 === '')
          ) {
            charData.bloodline_power.已解锁属性 = [];
          }
          if (Array.isArray(charData.bloodline_power.可容纳属性)) {
            const hasCapacity = charData.bloodline_power.可容纳属性.some(item => String(item ?? '').trim());
            if (!hasCapacity) charData.bloodline_power.可容纳属性 = [AI_TODO_ATTRIBUTE_CAPACITY];
          } else if (
            charData.bloodline_power.可容纳属性 === undefined ||
            charData.bloodline_power.可容纳属性 === null ||
            charData.bloodline_power.可容纳属性 === ''
          ) {
            charData.bloodline_power.可容纳属性 = [AI_TODO_ATTRIBUTE_CAPACITY];
          }
          injectDisplaySkillMapDefaults(charData.bloodline_power?.passives, skillName => ({
            type: bloodlineType,
            textContext: {
              spiritName: charData.bloodline_power?.bloodline || skillName,
              type: bloodlineType,
            },
          }));
          injectDisplaySkillMapDefaults(charData.bloodline_power?.skills, skillName => ({
            type: bloodlineType,
            textContext: {
              spiritName: charData.bloodline_power?.bloodline || skillName,
              type: bloodlineType,
            },
          }));
          _(charData.bloodline_power?.blood_rings || {}).forEach(ringData => {
            if (!ringData || typeof ringData !== 'object') return;
            injectDisplaySkillMapDefaults(ringData?.魂技, skillName => ({
              type: bloodlineType,
              textContext: {
                spiritName: charData.bloodline_power?.bloodline || skillName,
                type: bloodlineType,
              },
            }));
          });
        }

        injectDisplaySkillMapDefaults(charData.special_abilities, skillName => ({
          type: charData?.stat?.type || '强攻系',
          textContext: {
            spiritName: skillName,
            type: charData?.stat?.type || '强攻系',
          },
        }));
        injectDisplaySkillMapDefaults(charData.secret_skills, skillName => ({
          type: charData?.stat?.type || '强攻系',
          textContext: {
            spiritName: skillName,
            type: charData?.stat?.type || '强攻系',
          },
        }));

        _(charData.martial_fusion_skills || {}).forEach((fusionData, fusionName) => {
          if (!fusionData || typeof fusionData !== 'object') return;
          injectDisplaySkillStructDefaults(fusionData.skill_data, {
            type: charData?.stat?.type || '强攻系',
            textContext: {
              spiritName: fusionName,
              type: charData?.stat?.type || '强攻系',
            },
          });
        });

        return charData;
      };
      const stripPackedSkillEffect = skill => {
        if (skill && typeof skill === 'object') delete skill._效果数组;
      };
      const stripSkillMapPackedEffects = skillMap => {
        _(skillMap || {}).forEach(skill => stripPackedSkillEffect(skill));
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

        _(sourceChar.social?.relations || {}).forEach((relData, targetName) => {
          relationCards.push({
            目标: targetName,
            关系: relData.关系 || '陌生',
            可接触性: relData._availability || '未知',
            推进提示: relData._progress_note || '无',
            当前关系加成: relData._current_relation_bonus || relData.favor_buff || '无',
            下一档解锁奖励: relData._next_unlock_bonus || '无',
            下一档解锁门槛: Number(relData._next_unlock_threshold || 0),
            路线可切换: !!relData._route_switchable,
            路线受限原因: relData._route_lock_reason || '无',
            最近互动tick: Number(relData.last_interact_tick || 0),
            最近互动动作: relData.last_interact_action || '无',
            最近互动好感变化: Number(relData.recent_favor_delta || 0),
          });
        });

        _(sourceChar.inventory || {}).forEach((itemData, itemName) => {
          if (!itemData || typeof itemData !== 'object') return;
          const summaryItem = { 物品: itemName };
          let hasContent = false;
          if (Number(itemData.market_value?.price || 0) > 0) {
            summaryItem.market_value_price = Number(itemData.market_value?.price || 0);
            summaryItem.market_value_currency = itemData.market_value?.currency || 'fed_coin';
            hasContent = true;
          }
          if (itemData.有效期至 && itemData.有效期至 !== '无') {
            summaryItem.有效期至 = itemData.有效期至;
            hasContent = true;
          }
          if (hasContent) inventoryExtraSummary.push(summaryItem);
        });

        _(sourceChar.soul_bone || {}).forEach((boneData, boneName) => {
          if (!boneData || typeof boneData !== 'object') return;
          const statsBonus = cloneValue(boneData.stats_bonus || {}, {});
          if (Object.values(statsBonus).some(value => Number(value || 0) !== 0)) {
            soulBoneStatSummary.push({
              部位: boneName,
              力量: Number(statsBonus.str || 0),
              防御: Number(statsBonus.def || 0),
              敏捷: Number(statsBonus.agi || 0),
              体力上限: Number(statsBonus.vit_max || 0),
              精神上限: Number(statsBonus.men_max || 0),
              魂力上限: Number(statsBonus.sp_max || 0),
            });
          }
        });

        _(sourceChar.spirit || {}).forEach((spiritData, spiritKey) => {
          const visibleSpirit = visibleChar.spirit?.[spiritKey] || spiritData || {};
          _(spiritData?.soul_spirits || {}).forEach((soulSpirit, slotName) => {
            const visibleSlot = visibleChar.spirit?.[spiritKey]?.soul_spirits?.[slotName] || soulSpirit || {};
            spiritCombatSummary.push({
              武魂槽位: spiritKey,
              武魂名称: visibleSpirit.表象名称 || spiritData?.表象名称 || '无',
              魂灵槽位: slotName,
              魂灵名称: visibleSlot.表象名称 || soulSpirit.表象名称 || '无',
              描述: String(visibleSlot.描述 || soulSpirit.描述 || '无'),
              品质: String(visibleSlot.品质 || soulSpirit.品质 || '无'),
              对标等级: formatCultivationLevelText(soulSpirit.战力面板?.对标等级 || 0, '0'),
              力量: Number(soulSpirit.战力面板?.str || 0),
              防御: Number(soulSpirit.战力面板?.def || 0),
              敏捷: Number(soulSpirit.战力面板?.agi || 0),
              体力上限: Number(soulSpirit.战力面板?.vit_max || 0),
              精神上限: Number(soulSpirit.战力面板?.men_max || 0),
              魂力上限: Number(soulSpirit.战力面板?.sp_max || 0),
            });
          });
        });

        _(sourceChar.job || {}).forEach((jobData, jobName) => {
          jobSummary.push({
            职业: jobName,
            lv: Number(jobData.lv || 0),
            title: jobData.title || '无',
            success_rate: Number(jobData.limits?.success_rate || 0),
            max_fusion: Number(jobData.limits?.max_fusion || 0),
          });
        });

        _(sourceChar.combat_history || {}).forEach((historyData, historyName) => {
          battleHistorySummary.push({
            项目: historyName,
            count: Number(historyData?.count || 0),
            last_tick: Number(historyData?.last_tick || 0),
          });
        });

        const armorBonus = cloneValue(sourceChar.equip?.armor?._stats_bonus || {}, {});
        if (Object.values(armorBonus).some(value => Number(value || 0) !== 0)) {
          equipmentBonusSummary.push({
            装备: '斗铠',
            等效等级: Number(armorBonus.lv_equiv || 0),
            力量: Number(armorBonus.str || 0),
            防御: Number(armorBonus.def || 0),
            敏捷: Number(armorBonus.agi || 0),
            体力上限: Number(armorBonus.vit_max || 0),
            精神上限: Number(armorBonus.men_max || 0),
            魂力上限: Number(armorBonus.sp_max || 0),
          });
        }
        const mechBonus = cloneValue(sourceChar.equip?.mech?._stats_bonus || {}, {});
        if (Object.values(mechBonus).some(value => Number(value || 0) !== 0)) {
          equipmentBonusSummary.push({
            装备: '机甲',
            等效等级: 0,
            力量: Number(mechBonus.str || 0),
            防御: Number(mechBonus.def || 0),
            敏捷: Number(mechBonus.agi || 0),
            体力上限: Number(mechBonus.vit_max || 0),
            精神上限: Number(mechBonus.men_max || 0),
            魂力上限: Number(mechBonus.sp_max || 0),
          });
        }

        const relationAnalysis = sourceChar.social?.relation_analysis || {};

        const summary = {
          精神境界: sourceChar.stat?._men_realm || '无',
          名望等级: sourceChar.social?._fame_level || '籍籍无名',
          公开情报: !!sourceChar.social?._public_intel,
          力量: Number(sourceChar.stat?.str || 0),
          防御: Number(sourceChar.stat?.def || 0),
          敏捷: Number(sourceChar.stat?.agi || 0),
          体力上限: Number(sourceChar.stat?.vit_max || 0),
          魂力上限: Number(sourceChar.stat?.sp_max || 0),
          精神上限: Number(sourceChar.stat?.men_max || 0),
          社交恋爱候选: cloneValue(relationAnalysis.romance_candidates, []),
          社交信任对象: cloneValue(relationAnalysis.trust_targets, []),
          社交高风险对象: cloneValue(relationAnalysis.risk_targets, []),
          社交同地可接触: cloneValue(relationAnalysis.same_location_targets, []),
          社交可联络对象: cloneValue(relationAnalysis.contactable_targets, []),
          社交路线受阻对象: cloneValue(relationAnalysis.blocked_targets, []),
          社交关系卡片: relationCards,
          魂灵战力摘要: spiritCombatSummary,
          副职业摘要: jobSummary,
          装备加成摘要: equipmentBonusSummary,
          斗铠回路冲突: !!sourceChar.equip?.armor?._is_rejected,
          魂骨属性摘要: soulBoneStatSummary,
          试炼最高层: Number(sourceChar.tower_records?.max_floor || 0),
          试炼五折资格: Object.keys(sourceChar.tower_records?.discount_available || {}).filter(
            key => sourceChar.tower_records?.discount_available?.[key],
          ),
          战斗记录摘要: battleHistorySummary,
          物品附加信息: inventoryExtraSummary,
          领域维护消耗: Number(sourceChar.spiritual_domain?.maintenance_cost?.men || 0),
        };
        return pruneSummaryValue(summary) || {};
      };
      const sanitizeDisplayCharacter = (sourceChar = {}) => {
        const nextChar = cloneValue(sourceChar, {});
        if (nextChar.stat) {
          delete nextChar.stat.last_herb_lv;
          delete nextChar.stat.hidden_variance;
          delete nextChar.stat.talent_tier;
          delete nextChar.stat.innate_sp_lv;
          delete nextChar.stat.talent_roll;
          delete nextChar.stat.multiplier;
          delete nextChar.stat.trained_bonus;
          delete nextChar.stat._men_realm;
          delete nextChar.stat.sp_max;
          delete nextChar.stat.men_max;
          delete nextChar.stat.str;
          delete nextChar.stat.def;
          delete nextChar.stat.agi;
          delete nextChar.stat.vit_max;
          delete nextChar.stat.conditions;
        }
        if (nextChar.status) {
          delete nextChar.status.active_domain;
        }
        delete nextChar.tower_records;
        delete nextChar.combat_history;
        _(nextChar.job || {}).forEach(jobData => {
          if (jobData && typeof jobData === 'object') delete jobData.limits;
        });
        _(nextChar.social?.titles || {}).forEach(titleData => {
          if (titleData && typeof titleData === 'object') delete titleData.声望加成;
        });
        _(nextChar.social?.relations || {}).forEach(relData => {
          if (!relData || typeof relData !== 'object') return;
          delete relData.关系;
          delete relData.favor_buff;
          delete relData._relation_stage;
          delete relData._next_stage;
          delete relData._next_stage_threshold;
          delete relData._route_switchable;
          delete relData._route_lock_reason;
          delete relData._progress_note;
          delete relData._availability;
          delete relData.last_interact_tick;
          delete relData.last_interact_action;
          delete relData.recent_favor_delta;
          delete relData._current_relation_bonus;
          delete relData._next_unlock_bonus;
          delete relData._next_unlock_threshold;
        });
        if (nextChar.social) {
          delete nextChar.social._fame_level;
          delete nextChar.social._public_intel;
          const rawRelationAnalysis =
            nextChar.social.relation_analysis && typeof nextChar.social.relation_analysis === 'object'
              ? nextChar.social.relation_analysis
              : {};
          nextChar.social.relation_analysis =
            pruneSummaryValue({
              focus_target: toText(rawRelationAnalysis.focus_target, '无'),
              top_targets: normalizeRelationAnalysisTopTargetsInput(rawRelationAnalysis.top_targets)
                .slice(0, 3)
                .map(item => ({
                  target: toText(item && item.target, '无'),
                  reason: toText(item && item.reason, '无'),
                  recommended_action: toText(item && item.recommended_action, '继续观察'),
                })),
              recommended_actions: Array.isArray(rawRelationAnalysis.recommended_actions)
                ? cloneValue(rawRelationAnalysis.recommended_actions, [])
                : [],
            }) || {};
        }
        _(nextChar.inventory || {}).forEach(itemData => {
          if (itemData && typeof itemData === 'object') {
            delete itemData.market_value;
            delete itemData.有效期至;
          }
        });
        _(nextChar.soul_bone || {}).forEach(boneData => {
          if (!boneData || typeof boneData !== 'object') return;
          delete boneData.name;
          delete boneData.age;
          delete boneData.status;
          delete boneData.stats_bonus;
        });
        if (nextChar.equip?.armor) {
          delete nextChar.equip.armor._stats_bonus;
          delete nextChar.equip.armor._is_rejected;
        }
        if (nextChar.equip?.mech) {
          delete nextChar.equip.mech._stats_bonus;
        }
        _(nextChar.spirit || {}).forEach(spiritData => {
          _(spiritData?.soul_spirits || {}).forEach(soulSpirit => {
            delete soulSpirit.战力面板;
          });
        });
        if (nextChar.spiritual_domain) {
          delete nextChar.spiritual_domain.combat_modifiers;
          delete nextChar.spiritual_domain.maintenance_cost;
        }
        return nextChar;
      };
      const buildFactionReadOnlySummary = (sourceFaction = {}, detailLevel = 'public') =>
        detailLevel === 'related'
          ? {
              核心战力: cloneValue(sourceFaction.power_stats, {}),
              成员数量: Object.keys(sourceFaction.mem || {}).length,
              下次刷新tick: Number(sourceFaction.next_refresh_tick || 0),
            }
          : null;
      const sanitizeDisplayFaction = (sourceFaction = {}, detailLevel = 'public') => {
        const nextFaction = {
          inf: Number(sourceFaction.inf || 0),
          size: Number(sourceFaction.size || 0),
          status: sourceFaction.status || '正常',
          parent_faction: sourceFaction.parent_faction || '无',
          rel: cloneValue(sourceFaction.rel || {}, {}),
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
              type: locData.type,
              desc: locData.desc,
              state: locData.state,
              node_kind: locData.node_kind,
              interactions: cloneValue(locData.interactions, []),
              services: cloneValue(locData.services, []),
              action_slots: cloneValue(locData.action_slots, []),
              children: cloneValue(locData.children || {}, {}),
              商店: Object.keys(locData.stores || {}),
            }
          : {
              type: locData.type,
              desc: locData.desc,
              state: locData.state,
              known_children: Object.keys(locData.children || {}),
            };
      const sanitizeDisplayDynamicLocation = (dynData = {}) => ({
        归属父节点: dynData.归属父节点,
        层级: dynData.层级,
        描述: dynData.描述,
        x: dynData.x,
        y: dynData.y,
        node_type: normalizeDynamicLocationNodeType(dynData.node_type, dynData.层级, dynData.描述),
        faction: dynData.faction,
        importance: dynData.importance,
        state: dynData.state,
        node_kind: dynData.node_kind,
        interactions: cloneValue(dynData.interactions, []),
        services: cloneValue(dynData.services, []),
        action_slots: cloneValue(dynData.action_slots, []),
      });
      const buildWorldReadOnlySummary = (baseWorld = {}, visibleWorld = {}) => {
        const visibleStores = {};
        Object.keys(visibleWorld.locations || {}).forEach(locName => {
          const storeNames = Object.keys(baseWorld.locations?.[locName]?.stores || {});
          if (storeNames.length > 0) visibleStores[locName] = storeNames;
        });
        return {
          当前日期: baseWorld.time?._calendar || '未知',
          当前地点: currentLoc,
          可见商店: visibleStores,
        };
      };

      Object.keys(data.char).forEach(charName => {
        const realCharData = data.char[charName];
        const charLoc = realCharData.status?.loc || '未知';

        const isProtagonist = charName === PLAYER_NAME;
        const isSameLoc = charLoc !== '未知' && isLocationCompatible(currentLoc, charLoc);
        const isKnown = !!relations[charName];

        if (isProtagonist || isSameLoc || isKnown) {
          const fakeCharData = sanitizeDisplayCharacter(realCharData);

          if (charName === '唐舞麟' && !unlocked.includes('event_ch4_06')) {
            if (fakeCharData.bloodline_power) fakeCharData.bloodline_power.bloodline = '未知隐性变异(尚未觉醒)';
          }
          if (charName === '古月' && !unlocked.includes('event_ch3_07')) {
            if (fakeCharData.spirit && fakeCharData.spirit['元素使']) fakeCharData.spirit['元素使'].type = '元素系';
          }
          injectDisplayCharacterTodoDefaults(fakeCharData);
          const charSummary = buildCharReadOnlySummary(realCharData, fakeCharData);
          if (charSummary && Object.keys(charSummary).length > 0) fakeCharData._summary = charSummary;

          visibleChars[charName] = fakeCharData;
        }
      });
      if (protagonist?.social?.relation_analysis) {
        const relationWeight = name => Number(protagonist?.social?.relations?.[name]?.好感度 || 0);
        const sameLocationTargets = Object.keys(relations)
          .filter(name => {
            if (name === PLAYER_NAME) return false;
            const target = data.char[name];
            return !!target && target.status?.loc && isLocationCompatible(currentLoc, target.status.loc);
          })
          .sort((a, b) => relationWeight(b) - relationWeight(a));
        const contactableTargets = Object.keys(relations)
          .filter(name => {
            if (name === PLAYER_NAME) return false;
            const target = data.char[name];
            return !!target && target.status?.alive !== false;
          })
          .sort((a, b) => relationWeight(b) - relationWeight(a));

        protagonist.social.relation_analysis.same_location_targets = sameLocationTargets;
        protagonist.social.relation_analysis.contactable_targets = contactableTargets;
        if (visibleChars[PLAYER_NAME]) {
          const playerSummary = buildCharReadOnlySummary(protagonist, visibleChars[PLAYER_NAME]);
          if (playerSummary && Object.keys(playerSummary).length > 0)
            visibleChars[PLAYER_NAME]._summary = playerSummary;
          else delete visibleChars[PLAYER_NAME]._summary;
        }
      }

      const filtered_org = {};
      const relatedOrgNames = new Set(Object.keys(protagonist?.social?.factions || {}));
      Object.values(visibleChars).forEach(visibleChar => {
        Object.keys(visibleChar?.social?.factions || {}).forEach(facName => relatedOrgNames.add(facName));
      });
      _(data.org || {}).forEach((orgData, orgName) => {
        const detailLevel = relatedOrgNames.has(orgName) ? 'related' : 'public';
        filtered_org[orgName] = sanitizeDisplayFaction(orgData, detailLevel);
      });

      const filtered_sys = {
        player_name: data.sys?.player_name,
        rsn: data.sys?.rsn,
        seq: cloneValue(data.sys?.seq || {}, {}),
        last_roll: Number(data.sys?.last_roll || 0),
      };

      const filtered_world = {
        time: { tick: Number(data.world?.time?.tick || 0), _calendar: data.world?.time?._calendar || '未知' },
        flags: cloneValue(data.world?.flags || {}, {}),
        deviation: Number(data.world?.deviation || 0),
        deviation_multiplier: Number(data.world?.deviation_multiplier || 1),
        forest_killed_age: Number(data.world?.forest_killed_age || 0),
        timeline: cloneValue(data.world?.timeline || {}, {}),
        auction: cloneValue(data.world?.auction || {}, {}),
        rankings: cloneValue(data.world?.rankings || {}, {}),
        quest_board: cloneValue(data.world?.quest_board || {}, {}),
        bestiary: cloneValue(data.world?.bestiary || {}, {}),
        combat: cloneValue(data.world?.combat || {}, {}),
        _引导: { 时间线预览: data.world?._引导?.时间线预览 || '' },
        locations: {},
        dynamic_locations: {},
      };

      const currentLocInfo = findMapNodeEntry(currentLoc, data);

      let currentContextNodeName = currentLocInfo?.path?.length
        ? currentLocInfo.path[currentLocInfo.path.length - 1]
        : currentLoc;

      if (
        data.world.dynamic_locations[currentLoc]?.map_id &&
        data.world.dynamic_locations[currentLoc].map_id !== '无'
      ) {
        currentContextNodeName =
          data.world.dynamic_locations[currentLoc].归属父节点 ||
          currentLocInfo?.path?.[currentLocInfo.path.length - 1] ||
          '斗罗大陆';
      }

      _(data.world.locations).forEach((locData, locName) => {
        if (locName === currentContextNodeName || (currentLocInfo?.path && currentLocInfo.path.includes(locName))) {
          filtered_world.locations[locName] = sanitizeDisplayLocation(locData, true);
        } else {
          filtered_world.locations[locName] = sanitizeDisplayLocation(locData, false);
        }
      });

      _(data.world.dynamic_locations).forEach((dynData, dynName) => {
        if (dynData.归属父节点 === currentContextNodeName) {
          filtered_world.dynamic_locations[dynName] = sanitizeDisplayDynamicLocation(dynData);
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
    }

    return data;
  });

$(() => { registerMvuSchema(Schema); });
