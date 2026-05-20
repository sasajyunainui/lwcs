import fs from 'fs';
import vm from 'vm';

const source = fs.readFileSync(new URL('./MVU.js', import.meta.url), 'utf8');
const runtimeStart = source.indexOf('const MVU_RUNTIME_VIEW_PLACEHOLDER_V1');
const runtimeEnd = source.indexOf('function 追加系统播报文本');
if (runtimeStart < 0 || runtimeEnd < runtimeStart) throw new Error('未找到 MVU 运行时视图代码块');

const runtimeSource = source.slice(runtimeStart, runtimeEnd);
const context = {
  console,
  structuredClone,
  globalThis: {},
  _: {
    get: (obj, path, fallback) => {
      const parts = String(path || '').split('.').filter(Boolean);
      let current = obj;
      for (const part of parts) {
        if (!current || typeof current !== 'object') return fallback;
        current = current[part];
      }
      return current === undefined ? fallback : current;
    },
  },
  cloneJsonValue: (value, fallback = {}) => {
    try {
      return structuredClone(value);
    } catch (_) {}
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_) {}
    return fallback;
  },
};
context.globalThis = context;

Object.assign(context, {
  findMapNodeEntry: (loc) => ({ path: String(loc || '').split('-').filter(Boolean) }),
  取角色武魂条目_V1: char => Object.entries(char || {}).filter(([key]) => /^第\d+武魂$|^第[一二三四五六七八九十]+武魂$|^[一二三四五六七八九十]+武魂$/.test(key)),
  取武魂魂灵条目_V1: spirit => Object.entries(spirit || {}).filter(([key]) => /^第\d+魂灵$/.test(key)),
  取魂灵魂环条目_V1: soulSpirit => Object.entries(soulSpirit || {}).filter(([key]) => /^第\d+魂环$/.test(key)),
  取武魂直接魂环条目_V1: spirit => Object.entries(spirit || {}).filter(([key]) => /^第\d+魂环$/.test(key)),
  取魂环魂技条目_V1: ring => Object.entries(ring || {}).filter(([key]) => /^第\d+魂技$/.test(key)),
  取血脉气血魂环条目_V1: bloodline => Object.entries(bloodline || {}).filter(([key]) => /^第\d+气血魂环$/.test(key)),
  取气血魂环魂技条目_V1: ring => Object.entries(ring || {}).filter(([key]) => /^第\d+血脉魂技$/.test(key)),
  buildSkillNameTodoText: () => '待补全（填写魂技名）',
  buildSoulSpiritDescriptionTodoText: () => '待补全（魂灵描述）',
  构建技能机制决策临时数据_V1: () => ({ 候选: [] }),
  规范武魂相关度基础字段: () => {},
  isAiTodoText: value => /^待补全/.test(String(value || '')),
  AI_TODO_SKILL_VISUAL: '待补全（依据魂技名与_效果数组补全发动画面，保持与机制一致，不新增机制）',
  AI_TODO_SKILL_VISUAL_STAGE1: '待补全（请结合武魂特性、魂环来源魂兽特性、当前剧情上下文与机制选择补全发动画面，不新增机制）',
  AI_TODO_SKILL_EFFECT: '待补全（依据_效果数组补全效果描述，保持与机制一致，不新增机制，必须包含消耗与效果）',
  AI_TODO_PERSONALITY: '待补全(根据角色设定补全性格特征)',
  AI_TODO_BACKGROUND: '待补全(请结合角色的家庭出身、成长环境、资源条件、父母来历与所属圈层，补全其家世或出身背景描述)',
  AI_TODO_TALENT_RATING: '待补全(请根据角色的武魂潜力、血脉资质、悟性、心性、成长环境与资源条件，给出1-100的天赋评级分数，仅填写数字)',
  AI_TODO_MAIN_IDENTITY: '待补全(填写当前主要公开身份)',
  AI_TODO_STATUS_LOC: '斗罗大陆-待补全(按大陆-城市-地点完整路径填写，禁止只填单一地名)',
  AI_TODO_SPIRIT_NAME: '待补全(填写具体武魂名，如蓝银草/蓝银皇)',
  AI_TODO_SPIRIT_DESC: '待补全(描述武魂外形、核心能力与战斗特征)',
  AI_TODO_ATTRIBUTE_SYSTEM: '待补全（填写属性体系：无/元素/五行）',
  AI_TODO_ATTRIBUTE_CAPACITY: '待补全（填写可容纳属性列表）',
  AI_TODO_SOUL_SPIRIT_NAME: '待补全（魂兽名）',
  AI_TODO_SOUL_SPIRIT_QUALITY: '待补全（可选f/d/c/b/a/s/s+）',
  技能机制决策临时字段_V1: '_机制决策临时',
});

vm.runInNewContext(runtimeSource, context, { filename: 'MVU_runtime_view_block.js' });

const statData = {
  sys: { 玩家名: '唐舞麟', 系统播报: '初始化' },
  world: {
    时间: { tick: 10, _calendar: '1月1日' },
    偏差值: 1,
    偏差倍率: 1,
    累计击杀年限: 0,
    _引导: { 时间线预览: '近期关注：天斗城异动。' },
    时间线: { event1: { 事件: '天斗城异动', 状态: 'pending', 触发tick: 12 } },
    机密情报: {},
    拍卖: {},
    交易请求: {},
    委托板: {},
    图鉴: {},
    战斗: { 进行中: false },
    地点: {
      史莱克城: { 类型: '城市', 描述: '学院城', 状态: '正常', 商店: {}, 子节点: {} },
      天斗城: { 类型: '城市', 描述: '远方城市', 状态: '正常', 商店: {}, 子节点: {} },
    },
    动态地点: {
      临时营地: { 归属父节点: '史莱克城', 状态: '稳定', 描述: '临时据点' },
    },
  },
  org: {
    唐门: { 状态: '正常', 影响力: 10 },
  },
  char: {
    唐舞麟: {
      状态: { 位置: '斗罗大陆-史莱克城', HP: 100 },
      属性: { 背景: '', 等级: 10 },
      社交: { 关系: { 古月: { 好感度: 50 } }, 势力: { 唐门: {} } },
      背包: { 回春丹: { 数量: 2 } },
      第一武魂: {
        表象名称: '',
        描述: '',
        第1魂环: {
          颜色: '',
          第1魂技: {
            魂技名: '',
            画面描述: '',
            效果描述: '',
            _效果数组: [{ 原型: '伤害', 目标: '敌方单体', 属性: '魂力', 数值: 10, 描述: '蓝银草抽击' }],
          },
        },
      },
      第二武魂: {
        表象名称: '',
        描述: '',
        第1魂环: {
          颜色: '',
          第1魂技: {
            魂技名: '潮汐斩',
            画面描述: '水光凝成弧刃斩出。',
            效果描述: '对敌方单体造成水属性伤害。',
            _效果数组: [{ 原型: '伤害', 目标: '敌方单体', 属性: '魂力', 数值: 12, 描述: '水刃' }],
          },
        },
      },
    },
    古月: {
      状态: { 位置: '斗罗大陆-史莱克城', HP: 90 },
      属性: { 背景: '', 等级: 9 },
      外貌: { 发色: '', 发型: '', 瞳色: '', 身高: '', 体型: '', 长相描述: '' },
      社交: { 关系: {} },
      第一武魂: { 表象名称: '', 描述: '', 第1魂环: { 颜色: '', 第1魂技: { 魂技名: '霜华刺', 画面描述: '' } } },
    },
  },
  物品: {
    回春丹: { 类型: '药剂', 品质: '普通', 描述: '恢复药', 装备槽位: '无', 使用效果: [], 属性加成: {}, 副职业参数: {} },
  },
};

const api = context.__LWCS_MVU_RUNTIME_VIEW__;
const storyText = api.替换MVU运行时视图占位符('<status_current_variables>\n{{MVU_RUNTIME_VIEW}}\n</status_current_variables>', 'story', {
  statData,
  userInput: '服用回春丹',
});
const updateText = api.替换MVU运行时视图占位符('<status_current_variables>\n{{MVU_RUNTIME_VIEW}}\n</status_current_variables>', 'update', {
  statData,
  userInput: '听闻天斗城被摧毁，唐门震动；唐舞麟服用回春丹。',
});
const structureText = api.替换MVU运行时视图占位符('{{MVU_UPDATE_STRUCTURE_HINTS}}', 'update', {
  statData,
  userInput: '天斗城消息传来，唐门震动，唐舞麟提到回春丹。',
  aiText: '林惜梦带队抵达史莱克城。',
});
const storyStructureText = api.替换MVU运行时视图占位符('{{MVU_UPDATE_STRUCTURE_HINTS}}', 'story', {
  statData,
  userInput: '天斗城消息传来。',
});
const emptyText = api.替换MVU运行时视图占位符('<status_current_variables>\n{{MVU_RUNTIME_VIEW}}\n</status_current_variables>', 'empty', { statData });
const plotText = api.替换MVU运行时视图占位符('<status_current_variables>\n{{MVU_RUNTIME_VIEW}}\n</status_current_variables>', 'plot', { statData });

if (storyText.includes('MVU_RUNTIME_VIEW')) throw new Error('正文视图占位符未替换');
if (updateText.includes('MVU_RUNTIME_VIEW')) throw new Error('更新视图占位符未替换');
if (structureText.includes('MVU_UPDATE_STRUCTURE_HINTS')) throw new Error('更新结构提示占位符未替换');
if (!structureText.includes('[Existing MVU Entity Hits]') || !structureText.includes('[New Entity Table]')) {
  throw new Error('更新结构提示缺少命中表或新增表');
}
if (!structureText.includes('- 天斗城') || !structureText.includes('- 唐门') || !structureText.includes('- 唐舞麟') || !structureText.includes('- 回春丹')) {
  throw new Error('更新结构提示未包含本轮命中的已有实体');
}
if (structureText.includes('林惜梦')) throw new Error('更新结构提示不应猜测新增实体');
if (storyStructureText.trim()) throw new Error('正文阶段不应展开更新结构提示');
if (!plotText.includes('"时间线预览"') || !plotText.includes('天斗城异动')) throw new Error('剧情视图未包含 _引导.时间线预览');
if (storyText.includes('"时间线预览"')) throw new Error('正文视图不应包含 _引导.时间线预览');
if (updateText.includes('"_引导"')) throw new Error('更新视图不应包含 _引导');
if (updateText.includes('"_calendar"')) throw new Error('更新视图不应包含只读日历字段');
if (/"(魂力上限|精神力上限|体力上限|力量|防御|敏捷|训练加成|关系分析|_属性加成|战力面板|_填写提示)"/.test(updateText)) {
  throw new Error('更新视图包含不应发送的只读/派生字段');
}
if (/使用效果|属性加成|装备技能|副职业参数|_效果数组/.test(storyText)) {
  throw new Error('正文视图包含机制字段');
}
const 效果数组次数 = (updateText.match(/"_效果数组"/g) || []).length;
if (效果数组次数 !== 1) throw new Error(`更新视图应只为待补描述技能保留一次_效果数组：${效果数组次数}`);
if (updateText.includes('水属性伤害') || updateText.includes('水光凝成弧刃斩出')) {
  throw new Error('更新视图不应发送已补完的技能描述字段');
}
const 技能画面提示次数 = (updateText.match(/待补全（依据魂技名与_效果数组补全发动画面，保持与机制一致，不新增机制）/g) || []).length;
if (技能画面提示次数 !== 1) throw new Error(`技能画面描述提示未按类型限流：${技能画面提示次数}`);
const 角色性格提示次数 = (updateText.match(/待补全\(根据角色设定补全性格特征\)/g) || []).length;
if (角色性格提示次数 !== 1) throw new Error(`角色性格提示未按类型限流：${角色性格提示次数}`);
if (!updateText.includes('"天斗城"')) throw new Error('更新视图未包含远程命中地点');
if (!updateText.includes('"唐门"')) throw new Error('更新视图未包含命中势力');
if ('display_all' in statData || 'display_chars' in statData) throw new Error('运行时视图污染 stat_data');
if (emptyText.includes('status_current_variables') || emptyText.includes('MVU_RUNTIME_VIEW')) throw new Error('空视图没有剥离状态块');

console.log('MVU运行时视图离线检查通过');
