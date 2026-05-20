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

source += '\nexport { 计算装备掌控完整度_V1 };\n';

const tempPath = path.join(process.cwd(), `.tmp_lwcs_mvu_builtin_item_check_${Date.now()}.mjs`);
fs.writeFileSync(tempPath, source, 'utf8');

try {
  const { Schema, 计算装备掌控完整度_V1 } = await import(pathToFileURL(tempPath).href);
  const result = Schema.parse({
    sys: { 玩家名: '测试主角', 系统播报: '初始化' },
    world: { 时间: { tick: 0 }, 地点: {}, 动态地点: {}, 时间线: {}, 机密情报: {} },
    char: {
      测试主角: {
        属性: { 年龄: 20, 等级: 120, 天赋梯队: '天才', 系别: '强攻系' },
        状态: { 位置: '斗罗大陆-史莱克城' },
        第一武魂: { 表象名称: '蓝银草', 系别: '强攻系' },
      },
    },
  });

  const 黄金龙枪 = result.物品?.黄金龙枪;
  const 海神三叉戟 = result.物品?.海神三叉戟;
  const 奇茸通天菊 = result.物品?.十万年奇茸通天菊;

  if (!黄金龙枪 || 黄金龙枪.副职业参数?.圆满掌控等级 !== 120) throw new Error('神器内置定义缺少120级圆满掌控');
  if (!海神三叉戟 || 海神三叉戟.副职业参数?.圆满掌控等级 !== 150) throw new Error('超神器内置定义缺少150级圆满掌控');
  if (海神三叉戟.装备技能?.海神审判?.技能掌控度?.圆满等级 !== 150) throw new Error('超神器装备技能掌控等级丢失');
  if (!Array.isArray(奇茸通天菊?.使用效果) || 奇茸通天菊.使用效果[0]?.原型 !== '灵物吸收') throw new Error('十万年灵物未写入灵物吸收效果');

  const 等级119掌控 = 计算装备掌控完整度_V1(黄金龙枪, { 属性: { 等级: 119 } });
  const 等级120掌控 = 计算装备掌控完整度_V1(黄金龙枪, { 属性: { 等级: 120 } });
  const 等级149掌控 = 计算装备掌控完整度_V1(海神三叉戟, { 属性: { 等级: 149 } });
  const 等级150掌控 = 计算装备掌控完整度_V1(海神三叉戟, { 属性: { 等级: 150 } });
  if (!(等级119掌控 < 1 && 等级120掌控 === 1)) throw new Error('神器掌控完整度没有在120级到达100%');
  if (!(等级149掌控 < 1 && 等级150掌控 === 1)) throw new Error('超神器掌控完整度没有在150级到达100%');

  console.log('MVU内置神器与灵物检查通过');
} finally {
  fs.rmSync(tempPath, { force: true });
}
