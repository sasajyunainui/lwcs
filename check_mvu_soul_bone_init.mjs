import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const sourcePath = new URL('./MVU.js', import.meta.url);
let source = fs.readFileSync(sourcePath, 'utf8');

source = source
  .replace(
    "import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';",
    "import { z } from 'zod';\nimport _ from 'lodash';\nconst registerMvuSchema = () => {};",
  )
  .replace(
    "import { TimelineEvents } from 'https://cdn.jsdelivr.net/gh/sasajyunainui/lwcs@V1.38/timeline.js';",
    'const TimelineEvents = [];',
  )
  .replace(
    "import { IntelEvents } from 'https://cdn.jsdelivr.net/gh/sasajyunainui/lwcs@V1.35/IntelEvents.js';",
    'const IntelEvents = [];',
  )
  .replace(/\$\(\(\) => \{\s*注册MVU变量结构_V1\(\);\s*注册魂技年限与突破事件_V1\(\);\s*\}\);?\s*$/s, '');

source += '\nexport { 保留本轮已存在技能效果数组_V1 };\n';

const tempPath = path.join(process.cwd(), `.tmp_lwcs_mvu_schema_check_${Date.now()}.mjs`);
fs.writeFileSync(tempPath, source, 'utf8');

try {
  const { Schema, 保留本轮已存在技能效果数组_V1 } = await import(pathToFileURL(tempPath).href);
  const 初始化数据 = {
    sys: { 玩家名: '测试主角', 系统播报: '初始化' },
    world: { 时间: { tick: 0, _上次结算tick: 0 }, 地点: {}, 动态地点: {}, 机密情报: {} },
    char: {
      测试主角: {
        属性: { 年龄: 12, 等级: 40, 天赋梯队: '天才', 系别: '强攻系' },
        状态: { 位置: '斗罗大陆-史莱克城' },
        第一武魂: { 表象名称: '蓝银草', 系别: '强攻系' },
      },
      高阶魂师: {
        属性: { 年龄: 30, 等级: 91, 天赋梯队: '天才', 系别: '强攻系' },
        状态: { 位置: '斗罗大陆-史莱克城' },
        第一武魂: { 表象名称: '昊天锤', 系别: '强攻系' },
        魂骨: {
          右腿魂骨: {
            名称: '疾风豹右腿魂骨',
            年限: 10000,
            来源: '疾风豹',
            附带技能: { 被动增幅: { 魂技名: '', 画面描述: '', 效果描述: '' } },
          },
        },
      },
    },
  };
  const 初始化结果 = Schema.parse(初始化数据);
  const 高阶角色 = 初始化结果.char.高阶魂师;
  if (!高阶角色) {
    throw new Error(`初始化角色缺失：${Object.keys(初始化结果.char || {}).join('、')}`);
  }
  const 高阶魂骨技能 = 高阶角色.魂骨?.头部魂骨?.附带技能?.被动增幅;
  const 手动魂骨技能 = 高阶角色.魂骨?.右腿魂骨?.附带技能?.被动增幅;
  if (!Array.isArray(高阶魂骨技能?._效果数组) || 高阶魂骨技能._效果数组.length === 0) {
    throw new Error(`高等级初始化自动装载魂骨没有生成_效果数组：${JSON.stringify({
      魂骨: Object.keys(高阶角色.魂骨 || {}),
      技能: 高阶魂骨技能 || null,
    })}`);
  }
  if (!Array.isArray(手动魂骨技能?._效果数组) || 手动魂骨技能._效果数组.length === 0) {
    throw new Error(`新档初始化已有魂骨技能没有生成_效果数组：${JSON.stringify({
      魂骨: Object.keys(高阶角色.魂骨 || {}),
      技能: 手动魂骨技能 || null,
    })}`);
  }
  if (高阶魂骨技能.技能来源 !== undefined || 手动魂骨技能.技能来源 !== undefined) {
    throw new Error('魂骨技能不应依赖技能来源字段');
  }

  const 普通轮次结果 = Schema.parse({
    ...初始化数据,
    sys: { 玩家名: '测试主角', 系统播报: '非初始化' },
    world: { 时间: { tick: 10, _上次结算tick: 1 }, 地点: {}, 动态地点: {}, 机密情报: {} },
    char: {
      测试主角: 初始化数据.char.测试主角,
      高阶魂师: 初始化数据.char.高阶魂师,
    },
  });
  const 普通轮次魂骨技能 = 普通轮次结果.char.高阶魂师.魂骨?.右腿魂骨?.附带技能?.被动增幅;
  if (Array.isArray(普通轮次魂骨技能?._效果数组) && 普通轮次魂骨技能._效果数组.length > 0) {
    throw new Error('普通轮次不应自动生成魂骨技能_效果数组');
  }

  const 更新轮次结果 = JSON.parse(JSON.stringify(初始化结果));
  Object.values(更新轮次结果.char || {}).forEach(char => {
    Object.values(char?.魂骨 || {}).forEach(bone => {
      Object.values(bone?.附带技能 || {}).forEach(skill => {
        skill._效果数组 = [];
      });
    });
  });
  保留本轮已存在技能效果数组_V1(更新轮次结果, 初始化结果);
  const 保留后魂骨技能 = 更新轮次结果.char.高阶魂师.魂骨?.右腿魂骨?.附带技能?.被动增幅;
  if (!Array.isArray(保留后魂骨技能?._效果数组) || 保留后魂骨技能._效果数组.length === 0) {
    throw new Error('普通更新轮次不应清空上一轮已有魂骨技能_效果数组');
  }
  console.log('MVU魂骨技能初始化检查通过');
} finally {
  try {
    fs.unlinkSync(tempPath);
  } catch (_) {}
}
