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

const tempPath = path.join(process.cwd(), `.tmp_lwcs_mvu_startup_skill_${Date.now()}.mjs`);
fs.writeFileSync(tempPath, source, 'utf8');

try {
  const { Schema } = await import(pathToFileURL(tempPath).href);
  const result = Schema.parse({
    sys: { 玩家名: '测试主角', 系统播报: '初始化' },
    world: { 时间: { tick: 160080, _上次结算tick: 0 }, 地点: {}, 动态地点: {}, 时间线: {}, 机密情报: {} },
    char: {
      测试主角: {
        属性: { 年龄: 9, 等级: 21, 天赋梯队: '天才', 系别: '强攻系' },
        状态: { 位置: '斗罗大陆-东海城-东海学院' },
        第一武魂: {
          表象名称: '蓝银草',
          系别: '强攻系',
          第1魂灵: {
            表象名称: '金光',
            年限: 1000,
            状态: '活跃',
            第1魂环: {
              年限: 100,
              颜色: '黄',
              第1魂技: { 魂技名: '缠绕', 画面描述: '未知', 效果描述: '未知', 附带属性: [], _效果数组: [] },
            },
            第2魂环: {
              年限: 500,
              颜色: '黄',
              第1魂技: { 魂技名: '蓝银突刺阵', 画面描述: '未知', 效果描述: '未知', 附带属性: [], _效果数组: [] },
            },
          },
        },
      },
    },
  });

  const firstSkill = result.char.测试主角.第一武魂.第1魂灵.第1魂环.第1魂技;
  const secondSkill = result.char.测试主角.第一武魂.第1魂灵.第2魂环.第1魂技;
  if (!Array.isArray(firstSkill?._效果数组) || firstSkill._效果数组.length === 0) {
    throw new Error(`第1魂环第1魂技未生成_效果数组：${JSON.stringify(firstSkill)}`);
  }
  if (!Array.isArray(secondSkill?._效果数组) || secondSkill._效果数组.length === 0) {
    throw new Error(`第2魂环第1魂技未生成_效果数组：${JSON.stringify(secondSkill)}`);
  }
  if (result.char.测试主角.第一武魂.第1魂灵.第2魂环.第2魂技) {
    throw new Error('第2魂环不应自动创建第2魂技');
  }
  console.log('MVU开场白魂技初始化检查通过');
} finally {
  try {
    fs.unlinkSync(tempPath);
  } catch (_) {}
}
