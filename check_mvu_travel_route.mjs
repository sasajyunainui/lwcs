import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const 根目录 = new URL('.', import.meta.url);
const 根目录路径 = fileURLToPath(根目录);
const 读取 = 文件名 => fs.readFileSync(new URL(文件名, 根目录), 'utf8');
const 断言 = (条件, 消息) => {
  if (!条件) throw new Error(消息);
};

for (const 文件名 of ['Database_Module.js', 'mvu_logic_bridge.js', 'sheep_map_restore.js']) {
  execFileSync(process.execPath, ['--check', path.join(根目录路径, 文件名)], { stdio: 'pipe' });
}

const 数据库脚本 = 读取('Database_Module.js');
const 桥接脚本 = 读取('mvu_logic_bridge.js');
const 地图脚本 = 读取('sheep_map_restore.js');

断言(/"模块":"travel"/.test(数据库脚本), '剧情推进 guard 缺少 travel 输出协议。');
断言(/return 'travel'/.test(数据库脚本), 'Database_Module.js 缺少 travel 模块归一化。');
断言(/'travel'/.test(数据库脚本) && /return '移动'/.test(数据库脚本), 'Database_Module.js 缺少 travel 路由名单或展示名。');

断言(/function 解析移动模块意图请求/.test(桥接脚本), '桥接层缺少 travel 请求解析。');
断言(/function 构建新动态地点移动补丁/.test(桥接脚本), '桥接层缺少新动态地点补丁构建。');
断言(/function 执行移动模块意图路由/.test(桥接脚本), '桥接层缺少 travel 执行入口。');
断言(/moduleKind === 'travel'/.test(桥接脚本), 'routeModuleIntentPayload 未接入 travel 分支。');
断言(/travel_parent_missing/.test(桥接脚本), '新地点缺少父级时没有硬失败分支。');
断言(/window\.__sheepMapBridge/.test(桥接脚本) && /travelToNode/.test(桥接脚本), '已知节点没有接入地图 travelToNode。');
断言(/\/world\/动态地点\/\$\{targetPath\}/.test(桥接脚本), '新地点没有写入 world.动态地点。');
断言(/\/world\/时间\/tick/.test(桥接脚本), 'travel 新地点补丁没有更新时间 tick。');

断言(/function 推导动态地点坐标/.test(地图脚本), '地图模块缺少动态地点坐标推导函数。');
断言(/deriveDynamicLocationCoord: 推导动态地点坐标/.test(地图脚本), '地图桥接未暴露 deriveDynamicLocationCoord。');
断言(!new RegExp('[\\uFFFD\\u951F]').test(数据库脚本 + 桥接脚本 + 地图脚本), '发现中文乱码片段。');

console.log('MVU travel route offline check passed.');
