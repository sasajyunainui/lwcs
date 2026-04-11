
    const tabs = [];
    const pages = document.querySelectorAll(".split-page");
    const viewport = document.getElementById('mvuViewport');
    const scaleWrap = document.getElementById('mvuScaleWrap');
    const canvas = document.getElementById('mvuCanvas');
    const splitOverlay = document.getElementById('splitOverlay');
    const splitTopShell = document.getElementById('splitTopShell');
    const splitTopStage = document.getElementById('splitTopStage');
    const splitBottomTime = document.getElementById('splitBottomTime');
    const splitBottomLoc = document.getElementById('splitBottomLoc');
    const splitLeftStage = document.getElementById('splitLeftStage');
    const splitRightStage = document.getElementById('splitRightStage');
    const detailModal = document.getElementById('detailModal');
    if (detailModal && detailModal.parentElement !== document.body) {
      document.body.appendChild(detailModal);
    }

    const modalPanel = detailModal ? (detailModal.querySelector('.mvu-modal-panel') || detailModal.querySelector('.modal-panel')) : null;
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalLevel = document.getElementById('modalLevel');
    const modalPath = document.getElementById('modalPath');
    const modalSummary = document.getElementById('modalSummary');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    function getModalRefs() {
      const currentDetailModal = document.getElementById('detailModal') || detailModal;
      const currentModalPanel = currentDetailModal
        ? (currentDetailModal.querySelector('.mvu-modal-panel') || currentDetailModal.querySelector('.modal-panel') || modalPanel)
        : modalPanel;
      return {
        detailModal: currentDetailModal,
        modalPanel: currentModalPanel,
        modalTitle: document.getElementById('modalTitle') || modalTitle,
        modalSubtitle: document.getElementById('modalSubtitle') || modalSubtitle,
        modalLevel: document.getElementById('modalLevel') || modalLevel,
        modalPath: document.getElementById('modalPath') || modalPath,
        modalSummary: document.getElementById('modalSummary') || modalSummary,
        modalBody: document.getElementById('modalBody') || modalBody,
        modalClose: document.getElementById('modalClose') || modalClose
      };
    }
    const BASE_CANVAS_WIDTH = 636;
    const BASE_CANVAS_HEIGHT = 462;
    const CANVAS_WIDTH = 1060;
    const CANVAS_HEIGHT = 770;
    const DESIGN_SCALE = CANVAS_WIDTH / BASE_CANVAS_WIDTH;

    const previewMap = {
      '角色切换器': {
        title: '角色浏览 / 切换弹窗',
        summary: '查看全部角色摘要，并默认聚焦当前玩家角色。',
        fields: ['sd.char', 'char[*].is_player', 'char[*].stat.lv', 'char[*].status.loc', 'char[*].social.main_identity'],
        duties: ['浏览所有角色', '切换当前查看角色', '高亮玩家角色与关键 NPC'],
        actions: ['角色卡列表', '筛选：玩家 / 阵营 / 存活状态', '切换后刷新首页摘要']
      },
      '配置面板': {
        title: '界面配置弹窗',
        summary: '纯 UI 层配置，不直接改动 MVU 业务数据。',
        fields: ['本地显示开关', '摘要显隐策略', '地图层级显示偏好'],
        duties: ['管理卡片显隐', '切换紧凑/展开视图', '保留视觉偏好'],
        actions: ['显示过滤', '字号密度', '主题切换']
      },
      '生命图谱详细页': {
        title: '生命图谱',
        summary: '档案页主面板点击后直接进入 2级弹窗，不再额外设置中转层。',
        fields: ['activeChar.stat.*', 'activeChar.status.*', 'activeChar.stat.conditions', 'activeChar.energy.core', 'activeChar.bloodline_power(基础态)'],
        duties: ['展示完整生命体征', '集中显示状态/伤势/领域', '收纳成长修正与魂核进度'],
        actions: ['分区显示基础属性', '异常状态列表', '恢复与判定说明']
      },
      '社会档案详细页': {
        title: '社会档案弹窗',
        summary: '由“名望等级”芯片进入，聚焦声望、身份与称号。',
        fields: ['activeChar.social.reputation', 'activeChar.social.fame_level', 'activeChar.social.main_identity', 'activeChar.social.titles'],
        duties: ['展示公开身份', '显示称号来源', '整理名望等级与公开情报状态'],
        actions: ['切换到关系/阵营/情报子页', '保留声望来源说明']
      },
      '所属势力详细页': {
        title: '阵营身份弹窗',
        summary: '由“所属势力”芯片进入，直接展示该角色在各势力中的身份。',
        fields: ['activeChar.social.factions'],
        duties: ['展示所属势力列表', '显示身份与权限级', '在势力矩阵中高亮当前归属'],
        actions: ['跳转势力矩阵', '查看晋升入口']
      },
      '人物关系详细页': {
        title: '人物关系弹窗',
        summary: '由“关系摘要”芯片进入，承接重型 social.relations 结构。',
        fields: ['activeChar.social.relations'],
        duties: ['显示好感度与阶段', '显示关系路线与推进提示', '展示 npc_job、favor_buff 与分析结果'],
        actions: ['查看关系路线', '查看关系推进重点']
      },
      '情报库详细页': {
        title: '情报库弹窗',
        summary: '由“已解锁情报”芯片进入，统一展开已知信息、待整理线索与战斗记录。',
        fields: ['activeChar.unlocked_knowledges', 'activeChar.knowledge_unlock_request', 'activeChar.records', 'activeChar.combat_history'],
        duties: ['展示已解锁情报', '显示待整理情报进度', '聚合近期记录与战斗摘要'],
        actions: ['按情报筛选', '跳转关联节点']
      },
      '武装工坊详细页': {
        title: '武装工坊弹窗',
        summary: '查看当前武装、斗铠部件与副职业工坊。',
        fields: ['activeChar.equip.wpn', 'activeChar.equip.armor', 'activeChar.equip.mech', 'activeChar.equip.accessories', 'activeChar.job'],
        duties: ['展示武器/斗铠/机甲', '展示装备槽位状态', '显示副职业等级与融合信息'],
        actions: ['打开斗铠总览', '查看槽位覆盖', '浏览装备摘要']
      },
      '储物仓库详细页': {
        title: '储物仓库',
        summary: '聚合当前背包与货币数据，并以仓库式视图展示核心物资。',
        fields: ['activeChar.inventory', 'activeChar.wealth'],
        duties: ['展示物品数量', '展示品质/品阶/描述', '整合多种货币与资产摘要'],
        actions: ['按分类筛选', '查看物品详情', '整理 / 使用道具']
      },
      '血脉封印详细页': {
        title: '血脉封印弹窗',
        summary: '承接血脉体系的状态模块，在 1 个页面内汇总封印层级与当前能力。',
        fields: ['activeChar.spirit', 'activeChar.soul_bone', 'activeChar.bloodline_power.skills', 'activeChar.bloodline_power.blood_rings', 'activeChar.arts / special_abilities'],
        duties: ['展示血脉本体', '展示封印/魂环/魂技', '展示当前已固化能力'],
        actions: ['按页签查看魂环 / 能力 / 魂骨 / 血脉', '悬浮魂环查看技能说明', '查看封印层级']
      },
      '全息星图主画布': {
        title: '全息星图主画布',
        summary: '星图页本身就是 1级地图页；点击主画布或节点后，直接下钻到节点详情弹窗。',
        fields: ['WORLD_MAP_TREE', 'sd.world.locations', 'sd.world.dynamic_locations', 'activeChar.status.loc'],
        duties: ['显示地图主视图', '高亮当前节点', '驱动节点级下钻'],
        actions: ['点击节点开详情', '切换图层控制', '查看跑图与交易可用性']
      },
      '当前节点详情': {
        title: '当前节点详情弹窗',
        summary: '用于查看当前位置归一化后的完整节点信息。',
        fields: ['activeChar.status.loc', 'sd.world.locations[normalizedLoc]', 'WORLD_MAP_TREE 当前节点', 'stores'],
        duties: ['展示掌控势力/人口/经济', '显示本地商店摘要', '显示父节点与子节点'],
        actions: ['跳转商店弹窗', '跳转地图层级', '查看动态地点']
      },
      '图层控制与跑图': {
        title: '图层控制 / 跑图弹窗',
        summary: '地图页直接承担地点切换与移动规划，不再显示生硬的系统说明。',
        highlights: ['切换大陆 / 城市 / 设施层级', '查看推荐移动方式', '确认目标与预计耗时'],
        duties: ['查看当前焦点与层级', '查看可用移动方式', '确认出发前的路线建议'],
        actions: ['切换地图层级', '选择目标地点', '确认是否启程']
      },
      '动态地点与扩展节点': {
        title: '动态地点弹窗',
        summary: '承接 world.dynamic_locations，避免把动态节点硬塞进地图首页。',
        fields: ['sd.world.dynamic_locations'],
        duties: ['列出剧情新增地点', '显示归属父节点', '用于补地图树的动态扩展'],
        actions: ['按父节点筛选', '跳到地图节点详情']
      },
      '天道金榜': {
        title: '天道金榜弹窗',
        summary: '少年榜与风云榜的实时摘要。',
        fields: ['sd.world.rankings.youth_talent', 'sd.world.rankings.continent_wind(运行时预留)'],
        duties: ['展示少年天才榜', '展示大陆风云榜', '提示当前角色是否上榜'],
        actions: ['查看榜单', '查看上榜角色', '观察排行榜波动']
      },
      '拍卖与警报': {
        title: '拍卖行 / 世界警报弹窗',
        summary: '拍卖状态、拍品与当前世界警报。',
        fields: ['sd.world.auction', 'sd.world.forest_killed_age'],
        duties: ['显示拍卖状态与拍品', '显示生态风险与兽潮相关阈值', '显示下次刷新时间'],
        actions: ['查看拍卖清单', '评估当前世界风险']
      },
      '势力矩阵总览': {
        title: '势力矩阵弹窗',
        summary: '满足“查看所有势力”的核心入口，不再只显示当前角色视角。',
        fields: ['sd.org', 'activeChar.social.factions'],
        duties: ['浏览所有势力', '显示影响力与底蕴', '高亮当前角色所属势力'],
        actions: ['按阵营筛选', '查看势力档案', '查看本地据点与交易关联']
      },
      '我的阵营详情': {
        title: '我的阵营弹窗',
        summary: '聚焦当前查看角色在各势力中的身份与权限。',
        fields: ['activeChar.social.factions', 'activeChar.social.main_identity', 'activeChar.social.titles'],
        duties: ['展示所属势力', '展示身份与权限级', '补充主身份与头衔'],
        actions: ['跳转势力矩阵', '查看晋升入口']
      },
      '本地据点详情': {
        title: '本地据点弹窗',
        summary: '围绕当前节点展示据点级信息，是星图与势力页的交叉入口。',
        fields: ['activeChar.status.loc', 'sd.world.locations[normalizedLoc]'],
        duties: ['显示掌控势力/人口/守护军团', '显示经济状况', '整理本地设施与商店'],
        actions: ['查看本地商店信息', '跳回地图节点详情']
      },
      '系统播报与日志': {
        title: '系统播报 / 日志弹窗',
        summary: '终端页左侧主模块，集中展示系统广播与最近日志。',
        fields: ['sd.sys.rsn', 'sd.sys.seq', 'sd.sys.last_roll', 'sd.sys.fsr'],
        duties: ['显示最新播报', '显示事件序列', '显示检定结果'],
        actions: ['按时间倒序', '保留日志筛选与复制能力']
      },
      '操作总线': {
        title: '近期安排',
        summary: '把近期要做的事按行程与待办集中收纳，让首页直接看懂接下来要做什么。',
        highlights: ['今日行程安排', '眼下最该处理的事', '动身前还缺什么'],
        duties: ['查看当前行程顺序', '查看优先待办', '查看是否适合立刻出发'],
        actions: ['调整今日路线', '按优先级处理待办']
      },
      '试炼与情报': {
        title: '试炼与情报',
        summary: '把试炼入口、近期线索和下一步调查重点放在同一页里直接看。',
        highlights: ['当前可去的试炼', '已经掌握的情报', '下一步最值得跟进的线索'],
        duties: ['查看试炼开放情况', '查看近期重点情报', '查看下一步行动建议'],
        actions: ['选择先做试炼还是先查线索', '根据消息调整远行顺序']
      },
      '近期见闻': {
        title: '近期见闻',
        summary: '将近期广播、地点动态与可跟进线索集中收纳于此。',
        highlights: ['最近广播与动态', '地点与行程相关消息', '值得跟进的线索'],
        duties: ['查看当前最重要的近期消息', '查看地点与人物的最新变化', '判断哪些动静值得优先跟进'],
        actions: ['前往相关地点继续确认', '根据消息调整今日路线']
      },
      '怪物图鉴': {
        title: '怪物图鉴',
        summary: '已遭遇的深渊生物与魂兽标准数据记录。',
        fields: ['sd.world.bestiary'],
        duties: ['查看已记录怪物', '复用物种基础数据', '回顾遭遇对象'],
        actions: ['按名称查阅', '查看已记录条目']
      },
      '森林仇恨值': {
        title: '森林仇恨值',
        summary: '星斗大森林累计击杀魂兽年限与兽潮阈值监控。',
        fields: ['sd.world.forest_killed_age', 'sd.world.flags.beast_tide'],
        duties: ['查看累计击杀年限', '评估距离兽潮阈值', '观察是否触发兽潮'],
        actions: ['查看阈值进度', '评估森林风险']
      }
    };

    function normalizeModalItems(items) {
      return (items || []).map(item => String(item || '')
        .replace(/activeChar\.[^,，\s]+/g, '当前角色信息')
        .replace(/sd\.[^,，\s]+/g, '世界状态')
        .replace(/WORLD_MAP_TREE/g, '地图节点')
        .replace(/travel[\s_]?request/gi, '出行安排')
        .replace(/knowledge_unlock_request/gi, '待整理情报')
        .replace(/unlocked_knowledges/gi, '已掌握情报')
        .replace(/player_action/gi, '玩家行动')
        .replace(/settle_result/gi, '结算结果')

        .replace(/promotion_request/gi, '晋升安排')
        .replace(/donate_request/gi, '捐赠安排')
        .replace(/hunt_request/gi, '狩猎安排')
        .replace(/ascension_request/gi, '试炼安排')
        .replace(/tower_request/gi, '魂灵塔安排')
        .replace(/request 变量/gi, '当前安排')
        .replace(/展示/g, '查看')
        .replace(/显示/g, '查看')
        .replace(/整理/g, '收纳')
        .replace(/统一管理/g, '集中查看')
        .replace(/写入/g, '生成')
        .replace(/跳转/g, '前往')
        .replace(/承接/g, '查看')
        .replace(/字段/g, '信息')
        .replace(/变量/g, '内容')
        .replace(/用于显示/g, '展示')
        .replace(/进入这里/g, '收纳于此')
        .replace(/可作为/g, '可视作')
        .replace(/预留/g, '')
        .replace(/后续/g, '')
        .replace(/运行时/g, '')
        .replace(/\(\)/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim())
        .filter(Boolean);
    }

    function renderGenericModalBody(config) {
      const focusItems = normalizeModalItems(config.highlights && config.highlights.length ? config.highlights : config.duties).slice(0, 6);
      const actionItems = normalizeModalItems(config.actions).slice(0, 6);
      const renderPills = (items, fallback, mode = '') => {
        const source = items.length ? items : [fallback];
        return `<div class="status-tag-rack">${source.map(item => `<span class="status-pill ${mode}">${item}</span>`).join('')}</div>`;
      };
      return `
        <div class="modal-block">
          <div class="modal-block-title">当前要点</div>
          ${renderPills(focusItems, '当前暂无额外要点。')}
        </div>
        <div class="modal-block">
          <div class="modal-block-title">可做事项</div>
          ${renderPills(actionItems, '暂时没有额外操作。', 'live')}
        </div>
      `;
    }

    function makeRadarSvg(labels, values, realValues = null, accent = 'cyan') {
      const size = 220;
      const cx = 110;
      const cy = 110;
      const radius = 70;
      const levels = 4;
      const angleStep = (Math.PI * 2) / labels.length;

      const point = (index, ratio) => {
        const angle = -Math.PI / 2 + angleStep * index;
        return {
          x: cx + Math.cos(angle) * radius * ratio,
          y: cy + Math.sin(angle) * radius * ratio
        };
      };

      let grids = '';
      for (let level = 1; level <= levels; level++) {
        const ratio = level / levels;
        const pts = labels.map((_, idx) => {
          const p = point(idx, ratio);
          return `${p.x},${p.y}`;
        }).join(' ');
        grids += `<polygon class="radar-grid-line" points="${pts}"></polygon>`;
      }

      const axes = labels.map((_, idx) => {
        const p = point(idx, 1);
        return `<line class="radar-axis-line" x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}"></line>`;
      }).join('');

      const shapePoints = values.map((value, idx) => {
        const p = point(idx, Math.max(0.08, Math.min(1, value / 100)));
        return `${p.x},${p.y}`;
      }).join(' ');

      const labelTexts = labels.map((label, idx) => {
        const p = point(idx, 1.22);
        let anchor = 'middle';
        if (p.x < cx - 10) anchor = 'end';
        else if (p.x > cx + 10) anchor = 'start';
        return `<text x="${p.x}" y="${p.y}" text-anchor="${anchor}" dominant-baseline="middle" class="radar-label">${label}</text>`;
      }).join('');

      const legend = labels.map((label, idx) => `
        <div class="legend-chip">
          <b>${label}</b>
          <span>${realValues ? realValues[idx] : values[idx]}</span>
        </div>
      `).join('');

      return `
        <div class="radar-shell">
          <div class="radar-visual">
            <svg class="radar-svg" viewBox="0 0 ${size} ${size}">
              ${grids}
              ${axes}
              <polygon class="radar-data-shape ${accent === 'gold' ? 'gold' : ''}" points="${shapePoints}"></polygon>
              ${labelTexts}
            </svg>
          </div>
          <div class="radar-legend">${legend}</div>
        </div>
      `;
    }

    function makeEnergyRows(items) {
      return `
        <div class="energy-stack">
          ${(items || []).map(item => `
            <div class="energy-row-block">
              <div class="energy-headline"><b>${item.label}</b><span>${item.value}</span></div>
              <div class="energy-track"><div class="energy-fill ${item.color}" style="width:${item.percent}%"></div></div>
            </div>
          `).join('')}
        </div>
      `;
    }

    function makeTileGrid(items, className = '') {
      return `
        <div class="archive-tile-grid ${className}">
          ${(items || []).map(item => `
            <div class="archive-tile">
              <b>${item.label}</b>
              <span>${item.value}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    function escapeHtmlAttr(value) {
      return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function makeInteractiveTileGrid(items, className = '') {
      return `
        <div class="archive-tile-grid ${className}">
          ${(items || []).map(item => `
            <div class="archive-tile ${item.className || ''} ${item.preview ? 'clickable' : ''}"${item.preview ? ` data-preview="${escapeHtmlAttr(item.preview)}"` : ''}>
              <b>${item.label}</b>
              <span>${item.value}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    function makeTagCloud(items, className = '') {
      return `
        <div class="tag-cloud ${className}">
          ${(items || []).map(item => `<span class="tag-chip ${item.className || ''}">${item.text}</span>`).join('')}
        </div>
      `;
    }

    function makeWalletStrip(items) {
      return `
        <div class="wallet-strip">
          ${(items || []).map(item => `
            <div class="wallet-chip ${item.className || ''}">
              <b>${item.label}</b>
              <span>${item.value}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    function makeFigureBoard(coreLabel, slots) {
      return `
        <div class="figure-board">
          <div class="figure-core">${coreLabel}</div>
          ${(slots || []).map(slot => `
            <div class="figure-slot ${slot.className || ''}" style="left:${slot.x}%;top:${slot.y}%">${slot.label}</div>
          `).join('')}
        </div>
      `;
    }

    function makeInteractiveFigureBoard(coreLabel, slots, core = {}) {
      return `
        <div class="figure-board">
          <div class="figure-core ${core.preview ? 'clickable' : ''}"${core.preview ? ` data-preview="${escapeHtmlAttr(core.preview)}"` : ''}>${coreLabel}</div>
          ${(slots || []).map(slot => `
            <div class="figure-slot ${slot.className || ''} ${slot.preview ? 'clickable' : ''}"${slot.preview ? ` data-preview="${escapeHtmlAttr(slot.preview)}"` : ''} style="left:${slot.x}%;top:${slot.y}%">${slot.label}</div>
          `).join('')}
        </div>
      `;
    }

    function summarizeArmoryValue(value) {
      if (value === undefined || value === null || value === '') return '无';
      if (Array.isArray(value)) return value.map(item => summarizeArmoryValue(item)).filter(Boolean).slice(0, 4).join(' / ') || '无';
      if (typeof value === 'object') {
        const named = value.name || value['名称'] || value.title || value['标题'];
        if (named) return String(named);
        return Object.entries(value)
          .filter(([, v]) => v !== undefined && v !== null && v !== '' && typeof v !== 'object')
          .slice(0, 4)
          .map(([k, v]) => `${k}:${v}`)
          .join(' / ') || '无';
      }
      return String(value);
    }

    function buildArmoryFieldItems(source, fieldDefs = [], limit = 10) {
      const obj = source && typeof source === 'object' ? source : {};
      const items = [];
      const usedKeys = new Set();
      (fieldDefs || []).forEach(def => {
        const keyList = Array.isArray(def && def.keys) ? def.keys : [def && (def.key || def.keys)].filter(Boolean);
        let picked;
        for (const key of keyList) {
          const value = deepGet(obj, key, undefined);
          if (value !== undefined && value !== null && value !== '') {
            picked = value;
            const marker = Array.isArray(key) ? key[0] : String(key).split('.')[0];
            if (marker) usedKeys.add(marker);
            break;
          }
        }
        if (picked !== undefined) items.push({ label: def.label, value: summarizeArmoryValue(picked) });
      });

      Object.entries(obj)
        .filter(([key, value]) => !usedKeys.has(key) && value !== undefined && value !== null && value !== '' && typeof value !== 'object')
        .slice(0, Math.max(0, limit - items.length))
        .forEach(([key, value]) => items.push({ label: key, value: summarizeArmoryValue(value) }));

      return items.length ? items.slice(0, limit) : [{ label: '状态', value: '暂无记录' }];
    }

    function buildStatsBonusItems(statsBonus, options = {}) {
      const bonus = statsBonus && typeof statsBonus === 'object' ? statsBonus : {};
      const items = [];
      if (options.includeLvEquiv) items.push({ label: '等效等级', value: String(toNumber(bonus.lv_equiv, 0)) });
      items.push(
        { label: '气血加成', value: formatNumber(toNumber(bonus.vit_max, 0)) },
        { label: '魂力加成', value: formatNumber(toNumber(bonus.sp_max, 0)) },
        { label: '精神加成', value: formatNumber(toNumber(bonus.men_max, 0)) },
        { label: '力量加成', value: formatNumber(toNumber(bonus.str, 0)) },
        { label: '防御加成', value: formatNumber(toNumber(bonus.def, 0)) },
        { label: '敏捷加成', value: formatNumber(toNumber(bonus.agi, 0)) }
      );
      return items;
    }

    function listAccessoryEntries(accessories) {
      const obj = accessories && typeof accessories === 'object' ? accessories : {};
      return Object.entries(obj).map(([name, item]) => ({
        name,
        desc: (() => {
          const desc = toText(deepGet(item, '描述', '无'), '无');
          const meta = safeEntries(item).filter(([key]) => key !== '描述').slice(0, 3).map(([key, value]) => `${toText(key, '字段')}：${value && typeof value === 'object' ? `${safeEntries(value).length}项` : toText(value, '无')}`).join(' / ');
          return meta ? `${desc} ｜ ${meta}` : desc;
        })()
      }));
    }

    function summarizeAccessoryEntries(entries) {
      if (!Array.isArray(entries) || !entries.length) return '无';
      const names = entries.slice(0, 2).map(item => item.name);
      return `${names.join(' / ')}${entries.length > 2 ? ` 等${entries.length}件` : ''}`;
    }

    function resolveArmorPartData(armor, slotLabel) {
      const source = armor && typeof armor === 'object' ? armor : {};
      const aliasMap = {
        '头盔': ['头盔', '头部', 'helmet'],
        '胸铠': ['胸铠', '胸甲', 'chest'],
        '左肩': ['左肩', '肩甲左', 'left_shoulder'],
        '右肩': ['右肩', '肩甲右', 'right_shoulder'],
        '左臂': ['左臂', '臂甲左', 'left_arm'],
        '右臂': ['右臂', '臂甲右', 'right_arm'],
        '左腿': ['左腿', '腿甲左', 'left_leg'],
        '右腿': ['右腿', '腿甲右', 'right_leg'],
        '战裙': ['战裙', '裙甲', 'skirt'],
        '战靴': ['战靴', '靴子', 'boots'],
        '戒指': ['戒指', 'ring']
      };
      const aliases = aliasMap[slotLabel] || [slotLabel];
      for (const key of aliases) {
        const found = deepGet(source, ['parts', key], null)
          || deepGet(source, ['部件', key], null)
          || deepGet(source, ['slots', key], null)
          || deepGet(source, ['components', key], null)
          || deepGet(source, key, null);
        if (found) return found;
      }
      return null;
    }

    function buildArmoryActionRequest(snapshot, actionType) {
      if (!snapshot || !snapshot.sd) return null;
      if (!isSnapshotPlayerControlled(snapshot)) return null;
      const activeKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
      if (!activeKey) return null;
      const chars = deepGet(snapshot, 'sd.char', {});
      const activeChar = chars && typeof chars === 'object' ? (chars[activeKey] || {}) : {};
      const activeName = toText(activeChar && (activeChar.name || deepGet(activeChar, 'base.name', '')), toText(snapshot.activeName, activeKey));
      const currentLoc = toText(deepGet(activeChar, 'status.loc', snapshot.currentLoc || '当前位置'), '当前位置');
      const armor = deepGet(activeChar, 'equip.armor', {});
      const mech = deepGet(activeChar, 'equip.mech', {});
      const weapon = deepGet(activeChar, 'equip.wpn', {});
      const accessoryEntries = listAccessoryEntries(deepGet(activeChar, 'equip.accessories', {}));
      const armorName = toText(armor.name || armor['名称'], '当前斗铠');
      const mechName = toText(mech.name || mech['名称'] || mech.type || mech['型号'], '当前机甲');
      const actionMap = {
        equip_mech: { title: '装备机甲', playerInput: `我要在【${currentLoc}】装备机甲【${mechName}】。`, note: `请按 MVU 装备规则将 char.equip.mech.equip_status 处理为“已装备”。若当前斗铠已装备且机甲不是红级，请同步处理斗铠卸下并清空对应 stats_bonus。` },
        unequip_mech: { title: '卸下机甲', playerInput: `我要在【${currentLoc}】解除机甲【${mechName}】的装载。`, note: `请将 char.equip.mech.equip_status 处理为“未装备”，并将 mech.stats_bonus 清零。` },
        equip_armor: { title: '穿戴斗铠', playerInput: `我要在【${currentLoc}】穿戴斗铠【${armorName}】。`, note: `请按 MVU 装备规则尝试将 char.equip.armor.equip_status 处理为“已装备”。需要校验斗铠等级门槛（1字50级/2字70级/3字80级/4字90级）；若不满足则保持未装备并写入装备反噬。若当前已装备非红级机甲，斗铠不能保持已装备。` },
        unequip_armor: { title: '卸下斗铠', playerInput: `我要在【${currentLoc}】解除斗铠【${armorName}】的装备状态。`, note: `请将 char.equip.armor.equip_status 处理为“未装备”，并将 armor.stats_bonus 清零。` }
      };
      const actionMeta = actionMap[actionType];
      if (!actionMeta) return null;
      const systemPrompt = `以下内容属于前端发起的装备管理请求，不要在正文直接复述“系统提示 / 请求类型 / JSONPatch”等术语。\n\n[装备管理]\n角色：${activeName}\n地点：${currentLoc}\n动作：${actionMeta.title}\n当前斗铠：${summarizeArmoryValue(armor.name || armor['名称'] || armor.equip_status || '无')}\n当前机甲：${summarizeArmoryValue(mech.name || mech['名称'] || mech.type || mech.status || '无')}\n当前主武器：${summarizeArmoryValue(weapon.name || weapon['名称'] || '无')}\n当前附件：${summarizeAccessoryEntries(accessoryEntries)}\n\n${actionMeta.note}\n\n请将这次操作写成自然剧情，并在需要时同步更新角色的装备状态、相关装备字段与系统播报。`;
      return {
        playerInput: actionMeta.playerInput,
        systemPrompt,
        requestKind: 'equip_manage'
      };
    }

    function makeShelfStack(items) {
      return `
        <div class="shelf-stack">
          ${(items || []).map(item => `
            <div class="shelf-card">
              <b>${item.label}</b>
              <span>${item.value}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    function makeRareShowcase(items) {
      return `
        <div class="rare-showcase">
          ${(items || []).map(item => `
            <div class="rare-item">
              <b>${item.label}</b>
              <span>${item.value}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    function makeInventoryGrid(items) {
      const attr = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

      return `
        <div class="inventory-grid">
          ${(items || []).map(item => `
            <div class="inventory-cell ${item.className || ''}"
              data-hover-title="${attr(item.name)}"
              data-hover-type="${attr(item.type || item.meta || '--')}"
              data-hover-rarity="${attr(item.rarity || '--')}"
              data-hover-qty="${attr(`×${item.qty}`)}"
              data-hover-source="${attr(item.source || '--')}"
              data-hover-usage="${attr(item.usage || item.meta || '--')}"
              data-hover-equip="${attr(item.canEquip ? 'true' : '')}"
              data-hover-tags="${attr((item.tags || []).join('|'))}">
              <div class="cell-top">
                <b>${item.name}</b>
                <span class="qty">×${item.qty}</span>
              </div>
              <div class="tier">${item.meta}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    function makeSoulChain(items) {
      return `
        <div class="soul-chain">
          ${(items || []).map(item => `
            <div class="soul-card">
              <h4 style="margin:0 0 4px;font-size:13px;color:var(--white);font-family:var(--font-title);">${item.name}</h4>
                            <div class="soul-meta">
                <div class="meta-item"><b>年限</b><span>${item.age}</span></div>
                <div class="meta-item"><b>契合度</b><span>${item.comp}</span></div>
                <div class="meta-item"><b>状态</b><span>${item.state}</span></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    function makeRingLane(items) {
      return `
        <div class="ring-lane">
          ${(items || []).map(item => `<span class="ring-chip ${item.className || ''}">${item.text}</span>`).join('')}
        </div>
      `;
    }

    function makeSealColumn(items) {
      return `
        <div class="seal-column">
          ${(items || []).map(item => `
            <div class="seal-node ${item.className || ''}">
              <span>${item.label}</span>
              <b>${item.state}</b>
            </div>
          `).join('')}
        </div>
      `;
    }

    function makeSkillStrip(items) {
      return `
        <div class="skill-strip">
          ${(items || []).map(item => `
            <div class="skill-strip-card">
              <b>${item.name}</b>
              <span>${item.desc}</span>
              <div class="skill-meta">
                ${(item.tags || []).map(tag => `<span class="skill-mini-tag">${tag}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    function makeFactionLadder(items) {
      return `
        <div class="faction-ladder">
          ${(items || []).map(item => `
            <div class="faction-row ${item.className || ''}">
              <b>${item.name}</b>
              <span>${item.desc}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    const modalPaginationState = Object.create(null);

    function makeTimelineStack(items) {
      return `
        <div class="timeline-stack">
          ${(items || []).map(item => `
            <div class="timeline-card${item && item.preview ? ' clickable' : ''}"${item && item.preview ? ` data-preview="${escapeHtmlAttr(item.preview)}"` : ''}>
              <b>${item.title}</b>
              <span>${item.desc}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    function paginateModalItems(items, previewKey, sectionKey, pageSize = 50) {
      const list = Array.isArray(items) ? items : [];
      const safePreviewKey = toText(previewKey, 'modal');
      const safeSectionKey = toText(sectionKey, 'section');
      const stateKey = `${safePreviewKey}::${safeSectionKey}`;
      const totalPages = Math.max(1, Math.ceil(list.length / Math.max(1, pageSize)));
      const currentPage = Math.max(1, Math.min(totalPages, toNumber(modalPaginationState[stateKey], 1) || 1));
      modalPaginationState[stateKey] = currentPage;
      const start = (currentPage - 1) * pageSize;
      return {
        stateKey,
        page: currentPage,
        totalPages,
        total: list.length,
        items: list.slice(start, start + pageSize)
      };
    }

    function makeModalPaginationControls(sectionKey, page, totalPages, total) {
      if (totalPages <= 1) return '';
      return `
        <div class="tag-cloud armory-quick-actions" style="margin-top:12px;justify-content:flex-end;">
          <button type="button" class="tag-chip clickable" data-page-nav="prev" data-page-section="${escapeHtmlAttr(sectionKey)}" ${page <= 1 ? 'disabled' : ''}>上一页</button>
          <span class="tag-chip">第 ${page} / ${totalPages} 页 · 共 ${total} 条</span>
          <button type="button" class="tag-chip clickable" data-page-nav="next" data-page-section="${escapeHtmlAttr(sectionKey)}" ${page >= totalPages ? 'disabled' : ''}>下一页</button>
        </div>
      `;
    }

    function makePaginatedTimelineSection(items, previewKey, sectionKey, emptyItems = [], pageSize = 50) {
      const pageData = paginateModalItems(items, previewKey, sectionKey, pageSize);
      const displayItems = pageData.items.length ? pageData.items : emptyItems;
      return `${makeTimelineStack(displayItems)}${makeModalPaginationControls(sectionKey, pageData.page, pageData.totalPages, pageData.total)}`;
    }

    function makePaginatedFactionLadder(items, previewKey, sectionKey, pageSize = 50) {
      const pageData = paginateModalItems(items, previewKey, sectionKey, pageSize);
      return `${makeFactionLadder(pageData.items)}${makeModalPaginationControls(sectionKey, pageData.page, pageData.totalPages, pageData.total)}`;
    }

    const archiveModalBuilders = Object.create(null);

    function buildEmptyRingLane(ringClass = 'ring-white', count = 10) {
      return Array.from({ length: count }).map(() => `<div class="ring ${ringClass} empty"></div>`).join('');
    }

    function buildArchiveSkeletonModal(previewKey) {
      const key = String(previewKey || '');
      const isMapNode = key.startsWith('地图节点：');
      const nodeName = isMapNode ? key.replace('地图节点：', '') : '';

      if (key === '生命图谱详细页') {
        return {
          title: '生命图谱',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">战斗轮廓</div></div>
                ${makeRadarSvg(['力量', '防御', '敏捷', '精神', '气血底盘'], [0, 0, 0, 0, 0])}
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">角色名片</div></div>
                <div class="profile-snapshot">
                  <div class="identity-card">
                    <h3>当前角色</h3>
                    <div class="identity-meta-grid">
                      <div class="meta-item"><b>年龄 / 性别</b><span></span></div>
                      <div class="meta-item"><b>等级</b><span></span></div>
                      <div class="meta-item"><b>系别</b><span></span></div>
                      <div class="meta-item"><b>天赋梯队</b><span></span></div>
                      <div class="meta-item"><b>精神境界</b><span></span></div>
                      <div class="meta-item"><b>名望</b><span></span></div>
                    </div>
                  </div>
                  <div class="status-card">
                    <h4 style="margin:0 0 6px;font-size:13px;font-family:var(--font-title);color:var(--white);">当前状态</h4>
                    <div class="status-list">
                      <div class="status-row"><b>行动状态</b><span></span></div>
                      <div class="status-row"><b>伤势</b><span></span></div>
                      <div class="status-row"><b>当前领域</b><span></span></div>
                      <div class="status-row"><b>魂核状态</b><span></span></div>
                      <div class="status-row"><b>血脉状态</b><span></span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `
        };
      }

      if (key === '社会档案详细页') {
        return {
          title: '社会档案弹窗',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">身份名片</div></div>
                <div class="profile-snapshot"><div class="identity-card"><h3>当前角色</h3>${makeTileGrid([
                  { label: '当前身份', value: '' },
                  { label: '名望层级', value: '' },
                  { label: '公开情报', value: '' },
                  { label: '主要圈层', value: '' }
                ], 'two')}</div></div>
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">社会标签</div></div>
                ${makeTagCloud([])}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">当前社会位置</div></div>
                ${makeTileGrid([
                  { label: '主公开身份', value: '' },
                  { label: '名望等级', value: '' },
                  { label: '主要圈层', value: '' },
                  { label: '公开度', value: '' },
                  { label: '阵营关联', value: '' },
                  { label: '外部印象', value: '' }
                ])}
              </div>
            </div>
          `
        };
      }

      if (key === '所属势力详细页' || key === '我的阵营详情') {
        return {
          title: key === '我的阵营详情' ? '我的阵营弹窗' : '阵营身份弹窗',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">所属阶梯</div></div>
                ${makeFactionLadder([
                  { name: '学院', desc: '', className: 'highlight' },
                  { name: '宗门', desc: '', className: '' },
                  { name: '官方', desc: '', className: '' },
                  { name: '特殊', desc: '', className: '' }
                ])}
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">当前阵营位置</div></div>
                ${makeTileGrid([
                  { label: '当前所属', value: '' },
                  { label: '身份', value: '' },
                  { label: '权限级', value: '' },
                  { label: '主要绑定', value: '' }
                ], 'two')}
              </div>
            </div>
          `
        };
      }

      if (key === '人物关系详细页') {
        return {
          title: '人物关系弹窗',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns:1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">羁绊星轨图</div></div>
                <div class="topology-board" style="min-height:280px;">
                  <svg class="topology-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line class="topology-link cyan" x1="50" y1="50" x2="20" y2="25"></line>
                    <line class="topology-link gold" x1="50" y1="50" x2="50" y2="18"></line>
                    <line class="topology-link cyan" x1="50" y1="50" x2="82" y2="25"></line>
                    <line class="topology-link alert" x1="50" y1="50" x2="25" y2="75"></line>
                    <line class="topology-link cyan" x1="50" y1="50" x2="75" y2="75"></line>
                  </svg>
                  <div class="topology-node center" style="left:50%;top:50%"><b>当前角色</b><span>自我</span></div>
                  <div class="topology-node interactive-ring" style="left:20%;top:25%"><b></b><span></span></div>
                  <div class="topology-node interactive-ring gold" style="left:50%;top:18%"><b></b><span></span></div>
                  <div class="topology-node interactive-ring" style="left:82%;top:25%"><b></b><span></span></div>
                  <div class="topology-node interactive-ring warn hover-up" style="left:25%;top:75%"><b></b><span></span></div>
                  <div class="topology-node interactive-ring hover-up" style="left:75%;top:75%"><b></b><span></span></div>
                </div>
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">核心推进线索</div></div>
                <div class="intel-layout"><div class="intel-card"><b></b><span></span></div><div class="intel-card"><b></b><span></span></div></div>
              </div>
            </div>
          `
        };
      }

      if (key === '情报库详细页') {
        return {
          title: '情报库弹窗',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns:1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">线索拓扑网络</div></div>
                <div class="intel-network-board"></div>
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">解密进度槽</div></div>
                <div class="intel-progress-slots">
                  <div class="intel-slot"><div class="intel-slot-name">已解锁情报</div><div class="intel-slot-bar-wrap"><div class="intel-slot-bar" style="width:0%;"></div></div><div class="intel-slot-value">0</div></div>
                  <div class="intel-slot"><div class="intel-slot-name">待处理线索</div><div class="intel-slot-bar-wrap"><div class="intel-slot-bar gold" style="width:0%;"></div></div><div class="intel-slot-value" style="color:var(--gold);">0</div></div>
                  <div class="intel-slot"><div class="intel-slot-name">任务记录</div><div class="intel-slot-bar-wrap"><div class="intel-slot-bar" style="width:0%; background:var(--red); box-shadow:0 0 8px var(--red);"></div></div><div class="intel-slot-value" style="color:var(--red);">0</div></div>
                </div>
              </div>
            </div>
          `
        };
      }

      if (key === '武装工坊详细页') {
        return {
          title: '武装工坊弹窗',
          body: `
            <div class="equipment-layout">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">当前装备总览</div></div>
                ${makeTileGrid([
                  { label: '斗铠', value: '' },
                  { label: '机甲', value: '' },
                  { label: '主武器', value: '' },
                  { label: '附件', value: '' },
                  { label: '副职业', value: '' },
                  { label: '战斗形态', value: '' }
                ])}
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">装备槽位分布</div></div>
                ${makeFigureBoard('当前装载', [
                  { x: 50, y: 12, label: '头盔', className: 'off' },
                  { x: 50, y: 34, label: '胸铠', className: 'off' },
                  { x: 24, y: 34, label: '左肩', className: 'off' },
                  { x: 76, y: 34, label: '右肩', className: 'off' },
                  { x: 18, y: 52, label: '左臂', className: 'off' },
                  { x: 82, y: 52, label: '右臂', className: 'off' },
                  { x: 34, y: 82, label: '左腿', className: 'off' },
                  { x: 66, y: 82, label: '右腿', className: 'off' },
                  { x: 50, y: 68, label: '战裙', className: 'off' },
                  { x: 50, y: 94, label: '战靴', className: 'off' },
                  { x: 82, y: 10, label: '戒指', className: 'off' }
                ])}
              </div>
            </div>
          `
        };
      }

      if (key === '储物仓库详细页') {
        return {
          title: '储物仓库',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">钱包条</div></div>
                ${makeWalletStrip([
                  { label: '联邦币', value: '', className: 'gold' },
                  { label: '星罗币', value: '', className: 'cyan' },
                  { label: '唐门积分', value: '', className: 'cyan' },
                  { label: '学院积分', value: '', className: 'cyan' },
                  { label: '战功', value: '', className: 'red' }
                ])}
              </div>
              <div class="archive-card full vault-main-card">
                <div class="archive-card-head"><div class="archive-card-title">背包格阵列</div></div>
                <div class="inventory-scroll-shell">${makeInventoryGrid([])}</div>
              </div>
            </div>
          `
        };
      }

      if (key === '第一武魂详细页' || key === '第二武魂详细页') {
        const badge = key === '第一武魂详细页' ? '第一武魂' : '第二武魂';
        const badgeClass = key === '第一武魂详细页' ? 'live' : 'warn';
        return {
          title: `${badge}弹窗`,
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">武魂本体</div></div>
                <div class="spirit-main-card"><h4></h4><div class="spirit-head-tags"><span class="tag-chip ${key === '第一武魂详细页' ? 'live' : 'warn'}">${badge}</span></div></div>
              </div>
              <div class="archive-card full spirit-flow-card">
                <div class="archive-card-head"><div class="archive-card-title">魂灵展开层级</div></div>
                <div class="rings soul-ring-lane">${buildEmptyRingLane(key === '第一武魂详细页' ? 'ring-white' : 'ring-gold')}</div>
              </div>
            </div>
          `
        };
      }

      if (key === '血脉封印详细页') {
        return {
          title: '血脉封印弹窗',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">血脉本体</div></div>
                <div class="spirit-main-card"><h4></h4><div class="spirit-head-tags"><span class="tag-chip warn">血脉封印</span></div></div>
              </div>
              <div class="archive-card">${makeSealColumn([
                { label: '第1层封印', state: '', className: 'locked' },
                { label: '第2层封印', state: '', className: 'locked' },
                { label: '第3层封印', state: '', className: 'locked' },
                { label: '第4层封印', state: '', className: 'locked' }
              ])}</div>
              <div class="archive-card full spirit-flow-card"><div class="archive-card-head"><div class="archive-card-title">金色魂环轨道</div></div><div class="orbit-track">${buildEmptyRingLane('ring-gold', 3)}</div></div>
            </div>
          `
        };
      }

      if (key === '编年史档案') {
        return {
          title: '编年史弹窗',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns:1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">宏观时间轴</div></div>
                <div class="history-timeline-wrap"><div class="history-timeline-track"><div class="history-node major"><div class="history-node-date"></div><div class="history-node-dot"></div><div class="history-node-label"></div></div><div class="history-node"><div class="history-node-date"></div><div class="history-node-dot"></div><div class="history-node-label"></div></div><div class="history-node"><div class="history-node-date"></div><div class="history-node-dot"></div><div class="history-node-label"></div></div></div></div>
                <div class="history-floating-card"><div class="history-floating-title">当前锚点</div><div class="history-floating-desc"></div></div>
              </div>
              <div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">近期详细日志</div></div>${makeTimelineStack([])}</div>
            </div>
          `
        };
      }

      if (key === '本地据点详情' || key === '当前节点详情' || isMapNode) {
        return {
          title: isMapNode ? `本地据点 / ${nodeName}` : (key === '当前节点详情' ? '当前节点详情' : '本地据点 / 当前节点'),
          body: `
            <div class="intel-layout">
              <div class="archive-card"><div class="archive-card-head"><div class="archive-card-title">据点概览</div></div>${makeTileGrid([
                { label: '所在地点', value: '' },
                { label: '掌控势力', value: '' },
                { label: '常住人口', value: '' },
                { label: '经济状况', value: '' },
                { label: '守护军团', value: '' },
                { label: '商店数量', value: '' }
              ])}</div>
              <div class="archive-card"><div class="archive-card-head"><div class="archive-card-title">驻地氛围</div></div><div class="relation-side-list"><div class="relation-card"><b>街区秩序</b><span></span></div><div class="relation-card"><b>补给情况</b><span></span></div><div class="relation-card"><b>交通状态</b><span></span></div></div></div>
            </div>
          `
        };
      }

      if (key === '操作总线') {
        return {
          title: '近期安排',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns:1fr;">
              <div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">当前动作</div></div>${makeTileGrid([
                { label: '当前行动', value: '' },
                { label: '所在位置', value: '' },
                { label: '伤势', value: '' },
                { label: '待处理请求', value: '' }
              ], 'two')}</div>
              <div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">请求队列</div></div>${makeTimelineStack([])}</div>
            </div>
          `
        };
      }

      if (key === '试炼与情报') {
        return {
          title: '试炼与情报',
          body: `
            <div class="intel-layout">
              <div class="archive-card"><div class="archive-card-head"><div class="archive-card-title">可前往试炼</div></div>${makeTileGrid([
                { label: '升灵台门票', value: '' },
                { label: '魂灵塔安排', value: '' },
                { label: '狩猎安排', value: '' },
                { label: '风险评估', value: '' }
              ])}</div>
              <div class="archive-card"><div class="archive-card-head"><div class="archive-card-title">已掌握情报</div></div><div class="intel-cabinet"></div></div>
            </div>
          `
        };
      }

      if (key === '近期见闻') {
        return {
          title: '近期见闻 / 城内简报',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns:1fr;">
              <div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">城内简报</div></div>${makeTimelineStack([
                { title: '学院', desc: '' },
                { title: '地区', desc: '' },
                { title: '商路', desc: '' },
                { title: '交通', desc: '' }
              ])}</div>
            </div>
          `
        };
      }

      if (key === '世界状态总览') {
        return {
          title: '世界状态弹窗',
          body: `
            <div class="archive-modal-grid">
            <div class="archive-modal-grid" style="grid-template-columns:1fr;">
              <div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">势力梯阵</div></div>${makeFactionLadder([
                { name: '学院', desc: '', className: 'highlight' },
                { name: '宗门', desc: '', className: '' },
                { name: '官方', desc: '', className: '' },
                { name: '特殊', desc: '', className: '' }
              ])}</div>
            </div>
          `
        };
      }

      if (key === '系统播报与日志') {
        return {
          title: '系统播报 / 日志弹窗',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns:1fr;">
              <div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">系统广播</div></div>${makeTimelineStack([
                { title: '最近播报', desc: '' },
                { title: '最近事件', desc: '' },
                { title: '安排摘要', desc: '' },
                { title: '情报摘要', desc: '' }
              ])}</div>
            </div>
          `
        };
      }

      return null;
    }

    let activeBattleUI = null;
    let liveSnapshot = null;
    let preferredActiveCharacterName = '';
    let currentModalPreviewKey = '';
    let mapDispatchContext = null;
    let activeSubUI = null;

    function htmlEscape(value) {
      return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function toText(value, fallback = '无') {
      if (value === undefined || value === null || value === '') return fallback;
      return String(value);
    }

    function toNumber(value, fallback = 0) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    }

    function formatNumber(value) {
      return new Intl.NumberFormat('zh-CN').format(toNumber(value, 0));
    }

    function getBaseSpMaxForLevel(lv) {
      const level = toNumber(lv, 0);
      let spBase = 100;
      if (level <= 10) spBase = 100 + (level - 1) * 73.66;
      else if (level <= 30) spBase = 763 + (level - 10) * 161.85;
      else if (level <= 50) spBase = 4000 + Math.pow(level - 30, 2) * 27.5;
      else if (level <= 70) spBase = 15000 + (level - 50) * 1000;
      else if (level <= 90) spBase = 35000 + (level - 70) * 1250;
      else if (level <= 95) spBase = 60000 + (level - 90) * 6818;
      else if (level < 98) spBase = 94090 + (level - 95) * 15303.3;
      else if (level === 98) spBase = 140000;
      else if (level === 99) spBase = 200000;
      else if (level === 99.5) spBase = 400000;
      else if (level >= 100) spBase = 700000;
      return Math.floor(spBase);
    }

    function getNextLevelSoulRequirement(stat) {
      const currentLv = toNumber(stat && stat.lv, 0);
      if (currentLv >= 100) {
        return { needed: 0, nextLevel: currentLv, isMax: true };
      }
      const currentSpMax = toNumber(stat && stat.sp_max, 0);
      const nextLevel = currentLv + 1;
      const nextSpMax = getBaseSpMaxForLevel(nextLevel);
      return {
        needed: Math.max(0, nextSpMax - currentSpMax),
        nextLevel,
        isMax: false
      };
    }

    function ratioPercent(current, max) {
      const upper = Math.max(0, toNumber(max, 0));
      if (!upper) return 0;
      return Math.max(0, Math.min(100, Math.round((toNumber(current, 0) / upper) * 100)));
    }

    function deepGet(source, path, fallback) {
      if (!source || !path) return fallback;
      const keys = Array.isArray(path) ? path : String(path).split('.');
      let current = source;
      for (const key of keys) {
        if (current == null || typeof current !== 'object' || !(key in current)) return fallback;
        current = current[key];
      }
      return current === undefined ? fallback : current;
    }

    function safeEntries(obj) {
      return obj && typeof obj === 'object' ? Object.entries(obj) : [];
    }

    function safeValues(obj) {
      return obj && typeof obj === 'object' ? Object.values(obj) : [];
    }

    function formatAge(age) {
      const value = toNumber(age, 0);
      if (value >= 100000) return `${(value / 10000).toFixed(value % 10000 === 0 ? 0 : 1)}万年`;
      if (value >= 10000) return `${(value / 10000).toFixed(value % 10000 === 0 ? 0 : 1)}万年`;
      if (value > 0) return `${formatNumber(value)}年`;
      return '未定';
    }

    function shortenText(value, max = 18) {
      const text = toText(value, '');
      if (!text) return '';
      return text.length > max ? `${text.slice(0, Math.max(1, max - 1))}…` : text;
    }

    function resolveRingTier(color, age, options = {}) {
      const key = toText(color, '').trim();
      const years = toNumber(age, NaN);
      const forceGold = !!(options && options.forceGold);

      if (forceGold) return 'gold';

      if (key === '橙' || key === '橙色' || key === '橙金' || key === '橙金色') return 'orangegold';
      if (key === '金' || key === '金色') return 'gold';
      if (key === '红' || key === '红色') return 'red';
      if (key === '黑' || key === '黑色') return 'black';
      if (key === '紫' || key === '紫色') return 'purple';
      if (key === '黄' || key === '黄色') return 'yellow';
      if (key === '白' || key === '白色') return 'white';

      if (Number.isFinite(years) && years > 0) {
        if (years >= 200000) return 'orangegold';
        if (years >= 100000) return 'red';
        if (years >= 10000) return 'black';
        if (years >= 1000) return 'purple';
        if (years >= 100) return 'yellow';
        return 'white';
      }
      return 'white';
    }

    function mapRingClass(color, age, options = {}) {
      return `ring-${resolveRingTier(color, age, options)}`;
    }

    function mapRingChipClass(color, age, options = {}) {
      return resolveRingTier(color, age, options);
    }

    function ringGlyph(color, index, age, options = {}) {
      const tier = resolveRingTier(color, age, options);
      const tierGlyphMap = {
        white: '白',
        yellow: '黄',
        purple: '紫',
        black: '黑',
        red: '红',
        gold: '金',
        orangegold: '橙'
      };
      const map = { 白: '白', 黄: '黄', 紫: '紫', 黑: '黑', 红: '红', 金: '金', 橙金: '橙' };
      const key = toText(color, '').trim();
      return map[key] || tierGlyphMap[tier] || String(index || '环');
    }

    function getMvuHost() {
      const candidates = [];
      try {
        if (window.Mvu) candidates.push(window.Mvu);
      } catch (err) {}
      try {
        if (window.top && window.top !== window && window.top.Mvu) candidates.push(window.top.Mvu);
      } catch (err) {}
      try {
        if (typeof Mvu !== 'undefined' && Mvu) candidates.push(Mvu);
      } catch (err) {}
      return candidates.find(item => item) || null;
    }

    async function waitForMvuReady() {
      try {
        if (typeof waitGlobalInitialized === 'function') {
          await waitGlobalInitialized('Mvu');
          return;
        }
      } catch (err) {}
      try {
        if (window.top && window.top !== window && typeof window.top.waitGlobalInitialized === 'function') {
          await window.top.waitGlobalInitialized('Mvu');
          return;
        }
      } catch (err) {}
    }

    async function getAllVariablesSafe() {
      const host = getMvuHost();
      if (host && typeof host.getAllVariables === 'function') {
        return await Promise.resolve(host.getAllVariables());
      }
      if (window.getAllVariables && typeof window.getAllVariables === 'function') {
        return await Promise.resolve(window.getAllVariables());
      }
      return null;
    }

    function bindMvuUpdates(handler) {
      const host = getMvuHost();
      const eventName = host && host.events ? host.events.VARIABLE_UPDATE_ENDED : '';
      const POLL_KEY = '__mvuRefreshPollTimer';
      const POLL_VIS_KEY = '__mvuRefreshPollVisibilityBound';
      const POLL_FOCUS_KEY = '__mvuRefreshPollFocusBound';
      let bound = false;

      let running = false;
      const safeHandler = async (...args) => {
        if (running) return;
        running = true;
        try {
          await Promise.resolve(handler(...args));
        } catch (error) {
          console.warn('[DragonUI] MVU 实时刷新执行失败', error);
        } finally {
          running = false;
        }
      };

      if (host && eventName && typeof host.on === 'function') {
        try {
          host.on(eventName, safeHandler);
          bound = true;
        } catch (err) {}
      }

      if (host && eventName && typeof host.addEventListener === 'function') {
        try {
          host.addEventListener(eventName, safeHandler);
          bound = true;
        } catch (err) {}
      }

      if (eventName) {
        try {
          window.addEventListener(eventName, safeHandler);
          bound = true;
        } catch (err) {}
        try {
          if (window.top && window.top !== window && typeof window.top.addEventListener === 'function') {
            window.top.addEventListener(eventName, safeHandler);
            bound = true;
          }
        } catch (err) {}
      }

      if (!window[POLL_KEY]) {
        window[POLL_KEY] = window.setInterval(safeHandler, 1500);
      }

      if (!window[POLL_VIS_KEY]) {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') safeHandler();
        });
        window[POLL_VIS_KEY] = true;
      }

      if (!window[POLL_FOCUS_KEY]) {
        window.addEventListener('focus', safeHandler);
        window[POLL_FOCUS_KEY] = true;
      }

      safeHandler();

      if (!bound) {
        if (window.__MVU_DEBUG__) {
          console.info('[DragonUI] MVU 更新事件未绑定成功，已启用 polling 兜底。');
        }
      }
    }

    function resolveRootData(vars) {
      if (!vars || typeof vars !== 'object') return null;
      const candidates = [
        vars,
        vars.data,
        vars.variables,
        vars.payload,
        vars.state,
        vars.mvu,
        vars.root
      ];
      for (const item of candidates) {
        if (!item || typeof item !== 'object') continue;
        if (item.sd && typeof item.sd === 'object') return item;
        if (item.stat_data && item.stat_data.sd && typeof item.stat_data.sd === 'object') {
          return { sd: item.stat_data.sd };
        }
        if (item.stat_data && typeof item.stat_data === 'object' && (item.stat_data.char || item.stat_data.world || item.stat_data.sys)) {
          return { sd: item.stat_data };
        }
      }
      return null;
    }

    function buildEffectiveSd(rawSd) {
      if (!rawSd || typeof rawSd !== 'object') return { sd: null, rawSd: null };

      return {
        sd: {
          sys: rawSd.sys || {},
          world: rawSd.world || {},
          org: rawSd.org || {},
          map: rawSd.map || {},
          char: rawSd.char || {}
        },
        rawSd
      };
    }

    function getPreferredActiveCharacterName() {
      return toText(preferredActiveCharacterName, '').trim();
    }

    function setPreferredActiveCharacterName(name) {
      preferredActiveCharacterName = toText(name, '').trim();
      try { window.__MVU_ACTIVE_CHARACTER__ = preferredActiveCharacterName; } catch (_) {}
      return preferredActiveCharacterName;
    }

    function isPlayerCharacterEntry(name, char, playerName = '') {
      const safeName = toText(name, '').trim();
      const safePlayerName = toText(playerName, '').trim();
      return !!safePlayerName && safeName === safePlayerName;
    }

    function isTangWulinCharacter(name = '') {
      return toText(name, '').trim() === '唐舞麟';
    }

    function getPinnedCharacterOrder(name = '') {
      const safeName = toText(name, '').trim();
      const pinnedNames = [
        ['唐舞麟'],
        ['古月娜', '古月'],
        ['谢邂'],
        ['许小言'],
        ['乐正宇'],
        ['原恩夜辉'],
        ['叶星澜'],
        ['徐笠智'],
        ['舞长空']
      ];
      for (let index = 0; index < pinnedNames.length; index += 1) {
        if (pinnedNames[index].includes(safeName)) return index + 1;
      }
      return -1;
    }

    function getCharacterDisplayPriority(name, char, options = {}) {
      const { playerName = '', currentName = '' } = options || {};
      const safeName = toText(name, '').trim();
      if (isPlayerCharacterEntry(safeName, char, playerName)) return 0;
      const pinnedOrder = getPinnedCharacterOrder(safeName);
      if (pinnedOrder >= 0) return pinnedOrder;
      if (safeName && safeName === toText(currentName, '').trim()) return 20;
      return 100;
    }

    function sortCharacterEntries(entries, options = {}) {
      return [...(Array.isArray(entries) ? entries : [])].sort((a, b) => {
        const rankDiff = getCharacterDisplayPriority(a[0], a[1], options) - getCharacterDisplayPriority(b[0], b[1], options);
        if (rankDiff !== 0) return rankDiff;
        const lvDiff = toNumber(deepGet(b[1], 'stat.lv', 0), 0) - toNumber(deepGet(a[1], 'stat.lv', 0), 0);
        if (lvDiff !== 0) return lvDiff;
        return toText(a[0], '').localeCompare(toText(b[0], ''), 'zh-Hans-CN', { numeric: true, sensitivity: 'base' });
      });
    }

    function findRealPlayerEntry(charEntries, playerName = '') {
      return sortCharacterEntries(charEntries, { playerName }).find(([name, char]) => isPlayerCharacterEntry(name, char, playerName)) || null;
    }

    function resolveActiveCharacter(sd) {
      const chars = sd && sd.char ? sd.char : {};
      const charEntries = safeEntries(chars);
      const preferredName = getPreferredActiveCharacterName();
      const sysPlayerName = toText(deepGet(sd, 'sys.player_name', ''), '').trim();
      const sortedEntries = sortCharacterEntries(charEntries, { playerName: sysPlayerName, currentName: preferredName });
      const realPlayerEntry = findRealPlayerEntry(charEntries, sysPlayerName);
      
      // 如果有偏好名字并且存在
      if (preferredName && chars[preferredName]) {
        // 如果当前偏好的不是玩家，但宇宙里已经有了真正的玩家，且并非用户显式固定的，就自动退位让贤
        const isPreferredPlayer = isPlayerCharacterEntry(preferredName, chars[preferredName], sysPlayerName);
        if (!isPreferredPlayer && realPlayerEntry && !window.__MVU_MANUAL_CHAR_SET) {
          return realPlayerEntry;
        }
        return [preferredName, chars[preferredName]];
      }

      const namedCandidates = [
        deepGet(sd, 'sys.player_name', '')
      ].filter(Boolean);

      for (const name of namedCandidates) {
        if (chars[name]) return [name, chars[name]];
      }

      if (realPlayerEntry) {
        return realPlayerEntry;
      }

      const pinnedEntry = sortedEntries.find(([name]) => getPinnedCharacterOrder(name) >= 0);
      if (pinnedEntry) {
        return pinnedEntry;
      }

      return sortedEntries[0] || ['未知角色', {}];
    }

    function isSnapshotPlayerControlled(snapshot) {
      const playerName = toText(deepGet(snapshot, 'sd.sys.player_name', ''), '').trim();
      const activeName = toText(snapshot && snapshot.activeName, '').trim();
      return isPlayerCharacterEntry(activeName, deepGet(snapshot, 'activeChar', {}), playerName);
    }

    function formatAppearanceText(appearance) {
      const data = appearance && typeof appearance === 'object' ? appearance : {};
      const parts = [
        toText(data['发色'], ''),
        toText(data['瞳色'], ''),
        toText(data['身高'], ''),
        toText(data['体型'], '')
      ].filter(Boolean);
      const features = Array.isArray(data['特殊特征']) ? data['特殊特征'].filter(Boolean) : [];
      const featureText = features.length ? `；特征：${features.join('、')}` : '';
      return parts.length ? `${parts.join(' / ')}${featureText}` : '未设定';
    }

    function normalizeLocationName(sd, rawLoc) {
      const loc = toText(rawLoc, '未知');
      const worldLocations = deepGet(sd, 'world.locations', {});
      if (worldLocations[loc]) return loc;

      const separators = ['·', '｜', '/', '→'];
      for (const separator of separators) {
        if (loc.includes(separator)) {
          const token = loc.split(separator)[0].trim();
          if (worldLocations[token]) return token;
        }
      }

      const fuzzy = safeEntries(worldLocations).find(([name]) => loc.includes(name) || name.includes(loc));
      return fuzzy ? fuzzy[0] : loc;
    }

    function resolveLocationData(sd, rawLoc) {
      const worldLocations = deepGet(sd, 'world.locations', {});
      const exact = toText(rawLoc, '未知');
      if (worldLocations[exact]) return { name: exact, data: worldLocations[exact] };
      const normalized = normalizeLocationName(sd, exact);
      if (worldLocations[normalized]) return { name: normalized, data: worldLocations[normalized] };
      return { name: normalized, data: null };
    }

    function buildSkillList(skillObj) {
      const skills = safeEntries(skillObj).map(([name, skill]) => ({
        name,
        type: toText(skill && skill['技能类型'], '未定义'),
        target: toText(skill && skill['对象'], '--'),
        bonus: toText(skill && skill['加成属性'], '无'),
        cost: toText(skill && skill['消耗'], '无消耗'),
        desc: toText(skill && skill['画面描述'], '') || toText(skill && skill['特效量化参数'], '暂无描述'),
        status: toText(skill && skill['状态'], '已觉醒'),
        mainRole: toText(skill && skill['主定位'], '无'),
        tags: (Array.isArray(skill && skill['标签']) ? skill['标签'] : []).concat(
          toText(skill && skill['技能类型'], '')
        ).filter(Boolean)
      }));

      if (skills.length) return skills;

      return [{
        name: '魂技未显现',
        type: '未觉醒',
        target: '--',
        bonus: '无',
        cost: '无',
        desc: '魂技信息尚未明晰。',
        tags: []
      }];
    }

    function buildSpiritConfig(slotName, spiritData, previewKey, badgeText, badgeClass) {
      const soulEntries = safeEntries(spiritData && spiritData.soul_spirits);
      const summaryRings = [];
      const souls = soulEntries.map(([soulName, soulData]) => {
        const ringEntries = safeEntries(soulData && soulData.rings)
          .sort((a, b) => toNumber(a[0], 0) - toNumber(b[0], 0))
          .map(([ringIndex, ring]) => {
            const skills = buildSkillList(ring && ring['魂技']);
            const ringInfo = {
              glyph: ringGlyph(ring && ring['颜色'], ringIndex, ring && ring['年限']),
              ringClass: mapRingClass(ring && ring['颜色'], ring && ring['年限']),
              title: `第${ringIndex}魂环 · ${skills[0] ? skills[0].name : soulName}`,
              desc: `${toText(ring && ring['颜色'], '未定')} / ${formatAge(ring && ring['年限'])}`,
              skills
            };
            summaryRings.push(ringInfo);
            return ringInfo;
          });

        return {
          name: soulName,
          desc: toText(soulData && soulData['表象名称'], '未展露'),
          state: toText(soulData && soulData['状态'], '未知'),
          age: formatAge(soulData && soulData['年限']),
          comp: `${toNumber(soulData && soulData['契合度'], 100)}%`,
          rings: ringEntries.length ? ringEntries : [{
            glyph: '空',
            ringClass: mapRingClass('白'),
            title: '魂环空位',
            desc: '当前未装载魂环',
            skills: buildSkillList(null)
          }]
        };
      });

      if (!souls.length) {
        souls.push({
          name: '魂灵槽位',
          desc: '尚未接入魂灵。',
          state: '未激活',
          age: '--',
          comp: '--',
          rings: [{
            glyph: '空',
            ringClass: mapRingClass('白'),
            title: '魂环空位',
            desc: '当前未装载魂环',
            skills: buildSkillList(null)
          }]
        });
      }

      const soulCount = soulEntries.length;
      const displayName = toText(spiritData && spiritData['表象名称'], slotName);
      const spiritType = toText(spiritData && spiritData['type'], '未知系');
      const element = toText(spiritData && spiritData['element'], '无');

      return {
        preview: previewKey,
        badge: badgeText,
        badgeClass,
        name: `${displayName}（${spiritType}）`,
        desc: `元素：${element} / 魂灵：${soulCount}`,
        rings: (summaryRings.length ? summaryRings : souls[0].rings).slice(0, 10),
        souls,
        slotName,
        spiritName: displayName,
        spiritType,
        spiritElement: element
      };
    }

    function buildBloodlineConfig(activeChar) {
      const bloodline = deepGet(activeChar, 'bloodline_power.bloodline', '无');
      const sealLv = toNumber(deepGet(activeChar, 'bloodline_power.seal_lv', 0), 0);
      const core = toText(deepGet(activeChar, 'bloodline_power.core', '未凝聚'), '未凝聚');
      const rawSkills = deepGet(activeChar, 'bloodline_power.skills', {});
      const rawRings = deepGet(activeChar, 'bloodline_power.blood_rings', {});
      const hasBloodlineData = toText(bloodline, '无') !== '无'
        || sealLv > 0
        || safeEntries(rawRings).length > 0
        || safeEntries(rawSkills).length > 0;
      const unlockedRingCount = Math.max(0, Math.floor(sealLv / 2));
      const ringEntries = safeEntries(deepGet(activeChar, 'bloodline_power.blood_rings', {}))
        .sort((a, b) => toNumber(a[0], 0) - toNumber(b[0], 0))
        .map(([index, ring]) => ({
          glyph: ringGlyph(ring && ring['颜色'], index, ring && ring['年限'], { forceGold: true }),
          ringClass: mapRingClass(ring && ring['颜色'], ring && ring['年限'], { forceGold: true }),
          title: `血脉环位 · ${index}`,
          desc: `${toText(ring && ring['颜色'], '未形成')} / ${safeEntries(ring && ring['魂技']).length || 0}项能力`,
          skills: buildSkillList(ring && ring['魂技'])
        }));
      const normalizedRingEntries = ringEntries.slice(0, 10);
      if (normalizedRingEntries.length < unlockedRingCount) {
        for (let index = normalizedRingEntries.length; index < unlockedRingCount && index < 10; index += 1) {
          normalizedRingEntries.push({
            glyph: 'Ⅱ',
            ringClass: 'ring-gold',
            title: `第${index + 1}枚金色魂环 · 待成形`,
            desc: '气血魂环已解锁环位，等待完整成形',
            skills: buildSkillList(index === 0 ? rawSkills : null)
          });
        }
      }

      return {
        kind: 'bloodline',
        valid: hasBloodlineData,
        preview: '血脉封印详细页',
        badge: '血脉封印',
        badgeClass: 'gold',
        name: `${toText(bloodline, '未觉醒血脉')}`,
        desc: `解封层数：${sealLv} / 气血魂核：${core}`,
        rings: normalizedRingEntries,
        bloodSkills: buildSkillList(rawSkills),
        sealLv,
        core,
        lifeFire: !!deepGet(activeChar, 'bloodline_power.life_fire', false),
        bloodline: toText(bloodline, '无')
      };
    }

    function getPrimaryFactionEntry(snapshot) {
      const preferredName = toText(
        deepGet(snapshot, 'locationData.掌控势力', snapshot && snapshot.factions && snapshot.factions[0] ? snapshot.factions[0][0] : ''),
        snapshot && snapshot.factions && snapshot.factions[0] ? snapshot.factions[0][0] : ''
      );
      const fallbackEntry = snapshot && Array.isArray(snapshot.orgEntries) && snapshot.orgEntries.length ? snapshot.orgEntries[0] : ['', {}];
      const matchedEntry = snapshot && Array.isArray(snapshot.orgEntries)
        ? (snapshot.orgEntries.find(([name]) => name === preferredName) || fallbackEntry)
        : fallbackEntry;
      return {
        name: toText(matchedEntry && matchedEntry[0], preferredName || '未知'),
        data: matchedEntry && matchedEntry[1] ? matchedEntry[1] : {}
      };
    }

    function buildFactionRelationMeta(relName, relData) {
      const safeName = toText(relName, '未知势力');
      const safeRelData = relData && typeof relData === 'object' ? relData : {};
      const attitude = toText(deepGet(safeRelData, '态度', deepGet(safeRelData, '关系', '未知')), '未知');
      const detailParts = safeEntries(safeRelData)
        .filter(([key]) => !['态度', '关系'].includes(toText(key, '')))
        .map(([key, value]) => {
          if (value && typeof value === 'object') {
            const detailCount = safeEntries(value).length;
            return `${toText(key, '关系项')} ${detailCount}项`;
          }
          const textValue = toText(value, '');
          return textValue ? `${toText(key, '关系项')} ${textValue}` : toText(key, '关系项');
        })
        .filter(Boolean);
      return {
        name: safeName,
        attitude,
        desc: detailParts.length ? `${attitude} ｜ ${detailParts.join(' / ')}` : attitude,
        className: /敌对|死敌|仇视|战争/.test(attitude) ? 'warn' : (/同盟|盟友|友好|合作|生死同盟/.test(attitude) ? 'highlight' : '')
      };
    }

    function buildFactionRelationCards(orgData, options = {}) {
      const { max = 6, emptyTitle = '暂无势力关系', emptyDesc = '当前未记录对外关系。' } = options || {};
      const relationCards = safeEntries(deepGet(orgData, 'rel', {}))
        .map(([name, relData]) => buildFactionRelationMeta(name, relData))
        .slice(0, Math.max(1, max))
        .map(item => ({ title: item.name, desc: item.desc, className: item.className }));
      return relationCards.length ? relationCards : [{ title: emptyTitle, desc: emptyDesc }];
    }

    function buildFactionRelationSummary(orgData, max = 3) {
      return safeEntries(deepGet(orgData, 'rel', {}))
        .slice(0, Math.max(1, max))
        .map(([name, relData]) => {
          const meta = buildFactionRelationMeta(name, relData);
          return `${meta.name}:${meta.attitude}`;
        })
        .join(' / ');
    }

    function getPrimaryFactionPowerStats(snapshot) {
      const preferredName = toText(
        deepGet(snapshot, 'locationData.掌控势力', snapshot && snapshot.factions && snapshot.factions[0] ? snapshot.factions[0][0] : ''),
        snapshot && snapshot.factions && snapshot.factions[0] ? snapshot.factions[0][0] : ''
      );
      const fallbackEntry = snapshot && Array.isArray(snapshot.orgEntries) && snapshot.orgEntries.length ? snapshot.orgEntries[0] : ['', {}];
      const matchedEntry = snapshot && Array.isArray(snapshot.orgEntries)
        ? (snapshot.orgEntries.find(([name]) => name === preferredName) || fallbackEntry)
        : fallbackEntry;
      const matchedName = toText(matchedEntry && matchedEntry[0], preferredName || '未知');
      const matchedData = matchedEntry && matchedEntry[1] ? matchedEntry[1] : {};
      return {
        name: matchedName,
        limit: toNumber(deepGet(matchedData, 'power_stats.limit_douluo', 0), 0),
        super: toNumber(deepGet(matchedData, 'power_stats.super_douluo', 0), 0),
        title: toNumber(deepGet(matchedData, 'power_stats.title_douluo', 0), 0)
      };
    }

    function collectPendingRequests(activeChar, sd) {
      const result = [];
      const push = (text) => {
        if (text) result.push(text);
      };

      const travel = activeChar && activeChar.travel_request;
      if (travel && (toText(travel.target_loc, '无') !== '无' || toNumber(travel.target_x, -1) !== -1)) {
        push(`出行：${toText(travel.target_loc, '未知目的地')}`);
      }


      const quest = activeChar && activeChar.quest_request;
      if (quest && toText(quest.action, '无') !== '无') {
        push(`任务：${toText(quest.quest_name, '未命名任务')}`);
      }

      const tower = activeChar && activeChar.tower_request;
      if (tower && toText(tower.action, '无') !== '无') {
        push(`魂灵塔：${toText(tower.action, '处理中')}`);
      }

      const ascension = activeChar && activeChar.ascension_request;
      if (ascension && toText(ascension.ticket_type, '无') !== '无') {
        push(`升灵台：${toText(ascension.ticket_type)}`);
      }

      const combatSummary = deepGet(sd, 'world.combat.summary', {});
      const combatAction = deepGet(combatSummary, 'player_action', {});
      if (combatAction && toText(combatAction.action_type, '无') !== '无') {
        const elementCount = toNumber(combatAction.element_count, 1);
        const chargedTag = deepGet(combatAction, 'is_charged', false) ? ' / 蓄力' : '';
        push(`战斗：${toText(combatAction.action_type)}${elementCount > 1 ? ` / ${elementCount}元素` : ''}${chargedTag}`.trim());
      }

      const combatSettle = deepGet(combatSummary, 'settle_result', {});
      if (combatSettle && (toText(combatSettle.target_npc, '无') !== '无' || toText(combatSettle.result, '无') !== '无')) {
        push(`战果：${toText(combatSettle.target_npc, '未知目标')} / ${toText(combatSettle.result, '待定')}`);
      }

      const hunt = activeChar && activeChar.hunt_request;
      if (hunt && toNumber(hunt.killed_age, 0) > 0) {
        push(`狩猎：${formatAge(hunt.killed_age)}${deepGet(hunt, 'is_ferocious', false) ? ' / 凶兽' : ''}`);
      }

      const promotion = activeChar && activeChar.promotion_request;
      if (promotion && toText(promotion.target_faction, '无') !== '无') {
        push(`晋升：${toText(promotion.target_faction)} / ${toText(promotion.target_title, '')}`.trim());
      }

      const donate = activeChar && activeChar.donate_request;
      if (donate && toText(donate.item_name, '无') !== '无') {
        push(`捐献：${toText(donate.item_name)} × ${toNumber(donate.quantity, 1)}`);
      }

      const abyssKill = activeChar && activeChar.abyss_kill_request;
      if (abyssKill && toText(abyssKill.kill_tier, '无') !== '无') {
        push(`深渊：${toText(abyssKill.kill_tier)} × ${toNumber(abyssKill.quantity, 1)}`);
      }

      const interact = activeChar && activeChar.interact_request;
      if (interact && toText(interact.action, '无') !== '无') {
        push(`互动：${toText(interact.target_npc, '未知对象')} / ${toText(interact.action, '互动')}`);
      }

      return result;
    }

    function buildRecentNewsSummary(snapshot, options = {}) {
      const { seqLimit = 2, intelLimit = 2 } = options || {};
      const globalNews = (snapshot.seqEntries || []).slice(0, Math.max(1, seqLimit)).map(([key, item]) => ({
        title: `全局 / ${key}`,
        desc: toText(deepGet(item, '事件', '暂无记录'), '暂无记录')
      }));
      const personalNews = (snapshot.unlockedKnowledges || []).slice(-Math.max(1, intelLimit)).reverse().map((text, index) => ({
        title: `个人 / 见闻 ${index + 1}`,
        desc: toText(text, '暂无记录')
      }));
      return {
        globalNews,
        personalNews,
        cards: globalNews.concat(personalNews).length ? globalNews.concat(personalNews) : [{ title: '近期见闻', desc: '暂无新的全局或个人见闻。' }],
        summary: globalNews[0] ? globalNews[0].desc : (personalNews[0] ? personalNews[0].desc : '暂无近期见闻')
      };
    }

    function buildRecentPlanSummary(snapshot, options = {}) {
      const { worldLimit = 2, recordLimit = 2 } = options || {};
      const worldPlans = (snapshot.timelineEntries || []).filter(([, item]) => toText(deepGet(item, 'status', 'pending'), 'pending') !== 'done').slice(0, Math.max(1, worldLimit)).map(([name, item]) => ({
        title: `世界 / ${name}`,
        desc: `${toText(deepGet(item, 'event', '无'), '无')} ｜ Tick ${toText(deepGet(item, 'trigger_tick', 0), '0')} ｜ ${toText(deepGet(item, 'status', 'pending'), 'pending')}`
      }));
      const personalPlans = (snapshot.recordEntries || []).filter(([, item]) => toText(item && item['状态'], '进行中') !== '已完成' && toText(item && item['状态'], '进行中') !== '已放弃').slice(0, Math.max(1, recordLimit)).map(([name, item]) => ({
        title: `个人 / ${name}`,
        desc: `${toText(item && item['描述'], '无描述')} ｜ ${toText(item && item['状态'], '进行中')} ｜ ${toNumber(item && item['当前进度'], 0)}/${toNumber(item && item['目标进度'], 1)}`
      }));
      return {
        worldPlans,
        personalPlans,
        cards: worldPlans.concat(personalPlans).length ? worldPlans.concat(personalPlans) : [{ title: '近期安排', desc: '暂无待处理的世界日程或个人任务。' }],
        summary: worldPlans[0] ? worldPlans[0].desc : (personalPlans[0] ? personalPlans[0].desc : '暂无近期安排')
      };
    }

    function buildSnapshot(sd) {
      const [activeName, activeChar] = resolveActiveCharacter(sd || {});
      const currentLoc = toText(deepGet(activeChar, 'status.loc', '未知'), '未知');
      const locationInfo = resolveLocationData(sd, currentLoc);
      const locationData = locationInfo.data || {};
      const storeNames = safeEntries(locationData && locationData.stores).map(([name]) => name);
      const dynamicLocationNames = safeEntries(deepGet(sd, 'world.dynamic_locations', {})).map(([name]) => name);
      const timelineEntries = safeEntries(deepGet(sd, 'world.timeline', {})).sort((a, b) => toNumber(deepGet(b[1], 'trigger_tick', 0), 0) - toNumber(deepGet(a[1], 'trigger_tick', 0), 0));
      const seqEntries = safeEntries(deepGet(sd, 'sys.seq', {})).sort((a, b) => toNumber(b[0], 0) - toNumber(a[0], 0));
      const factions = safeEntries(deepGet(activeChar, 'social.factions', {}));
      const relations = safeEntries(deepGet(activeChar, 'social.relations', {})).sort((a, b) => toNumber(deepGet(b[1], '好感度', 0), 0) - toNumber(deepGet(a[1], '好感度', 0), 0));
      const unlockedKnowledges = Array.isArray(activeChar && activeChar.unlocked_knowledges) ? activeChar.unlocked_knowledges : [];
      const inventoryEntries = safeEntries(activeChar && activeChar.inventory);
      const youthRankingEntries = safeEntries(deepGet(sd, 'world.rankings.youth_talent.top30', {})).sort((a, b) => toNumber(a[0], 0) - toNumber(b[0], 0));
      const continentRankingEntries = safeEntries(deepGet(sd, 'world.rankings.continent_wind.top100', {})).sort((a, b) => toNumber(a[0], 0) - toNumber(b[0], 0));
      const flagEntries = safeEntries(deepGet(sd, 'world.flags', {})).filter(([, value]) => !!value);
      const orgEntries = safeEntries(sd && sd.org).sort((a, b) => {
        const aFav = factions.some(([name]) => name === a[0]) ? 1 : 0;
        const bFav = factions.some(([name]) => name === b[0]) ? 1 : 0;
        if (aFav !== bFav) return bFav - aFav;
        return toNumber(deepGet(b[1], 'inf', 0), 0) - toNumber(deepGet(a[1], 'inf', 0), 0);
      });

      const spiritEntries = safeEntries(activeChar && activeChar.spirit);
      const primarySpirit = spiritEntries[0] ? buildSpiritConfig(spiritEntries[0][0], spiritEntries[0][1], '第一武魂详细页', '第一武魂', 'cyan') : buildSpiritConfig('第一武魂', {}, '第一武魂详细页', '第一武魂', 'cyan');
      const secondarySpirit = spiritEntries[1] ? buildSpiritConfig(spiritEntries[1][0], spiritEntries[1][1], '第二武魂详细页', '第二武魂', 'gold') : null;
      const bloodline = buildBloodlineConfig(activeChar || {});

      // --- 收集额外能力与功法，放到外层给生命图谱使用 ---
      const safeRecords = (obj) => {
        return Object.entries(obj || {}).filter(([k, v]) => k !== '无' && typeof v === 'object' && v !== null).map(([k, v]) => ({
          name: k,
          ...v
        }));
      };
      const extraSkills = [];
      safeRecords(deepGet(activeChar, 'arts', {})).forEach(art => {
        extraSkills.push({
          category: '功法绝学',
          name: art.name,
          level: `Lv.${art.lv || 1} / ${toText(art.境界, '未入门')}`,
          desc: toText(art.描述, '暂无描述')
        });
      });
      safeRecords(deepGet(activeChar, 'bloodline_power.skills', {})).forEach(skill => {
        extraSkills.push({
          category: '血脉散技',
          name: skill.name,
          level: toText(skill.状态, '已掌握'),
          desc: toText(skill.描述, '无说明')
        });
      });
      safeRecords(deepGet(activeChar, 'martial_fusion_skills', {})).forEach(fusion => {
        extraSkills.push({
          category: '武魂融合技',
          name: fusion.name,
          level: `搭档: ${toText(fusion.partner, '未知')}`,
          desc: toText(deepGet(fusion, 'skill_data.描述', '无'), '爆发技')
        });
      });
      safeRecords(deepGet(activeChar, 'special_abilities', {})).forEach(abi => {
        extraSkills.push({
          category: '特长能力',
          name: abi.name,
          level: toText(abi.类型, '被动'),
          desc: toText(abi.描述, '暂无描述')
        });
      });

      const nextNodeCandidates = [
        locationInfo.name,
        currentLoc,
        toText(deepGet(sd, 'world.auction.location', ''), ''),
        ...storeNames,
        ...safeEntries(deepGet(sd, 'world.locations', {})).map(([name]) => name),
        ...dynamicLocationNames
      ].filter(Boolean);

      const mapNodeLabels = [];
      nextNodeCandidates.forEach(name => {
        if (!mapNodeLabels.includes(name)) mapNodeLabels.push(name);
      });

      const recentTitles = safeEntries(deepGet(activeChar, 'social.titles', {})).map(([name]) => name);
      const titleEntries = safeEntries(deepGet(activeChar, 'social.titles', {}));
      const recordEntries = safeEntries(deepGet(activeChar, 'records', {}));
      const conditionEntries = safeEntries(deepGet(activeChar, 'stat.conditions', {}));
      const soulBoneEntries = safeEntries(deepGet(activeChar, 'soul_bone', {}));
      const artEntries = safeEntries(deepGet(activeChar, 'arts', {})).sort((a, b) => toNumber(deepGet(b[1], 'lv', 0), 0) - toNumber(deepGet(a[1], 'lv', 0), 0));
      const specialAbilityEntries = safeEntries(deepGet(activeChar, 'special_abilities', {}));
      const combatHistoryEntries = safeEntries(deepGet(activeChar, 'combat_history', {})).sort((a, b) => toNumber(deepGet(b[1], 'last_tick', 0), 0) - toNumber(deepGet(a[1], 'last_tick', 0), 0));
      const pendingRequests = collectPendingRequests(activeChar || {}, sd || {});
      const bestiaryEntries = safeEntries(deepGet(sd, 'world.bestiary', {}));
      const forestKilledAge = toNumber(deepGet(sd, 'world.forest_killed_age', 0), 0);
      const mapData = sd && sd.map && typeof sd.map === 'object' ? sd.map : {};
      const mapVisibleNodeEntries = safeEntries(deepGet(mapData, 'visible_nodes', {}));
      const mapVisibleSettlementEntries = safeEntries(deepGet(mapData, 'visible_settlements', {}));
      const mapVisibleDynamicEntries = safeEntries(deepGet(mapData, 'visible_dynamic_locations', {}));
      const mapActivePatchEntries = safeEntries(deepGet(mapData, 'active_patches', {}));
      const mapAvailableChildMaps = deepGet(mapData, 'available_child_maps', {}) || {};
      const mapTravelCandidates = Array.isArray(deepGet(mapData, 'travel_candidates', [])) ? deepGet(mapData, 'travel_candidates', []) : [];
      const mapCurrentFocus = deepGet(mapData, 'current_focus', {}) || {};
      const pendingIntelContent = toText(deepGet(activeChar, 'knowledge_unlock_request.content', '无'), '无');
      const pendingIntelImpact = toNumber(deepGet(activeChar, 'knowledge_unlock_request.impact', 0), 0);
      const pendingIntel = pendingIntelContent !== '无';
      const primaryFaction = factions[0] || null;
      const topRelation = relations[0] || null;
      const questRecordCount = recordEntries.filter(([, item]) => toText(item && item['状态'], '进行中') !== '已放弃').length;
      const positionText = `${toNumber(deepGet(activeChar, 'status.current_x', 0), 0)}, ${toNumber(deepGet(activeChar, 'status.current_y', 0), 0)}`;
      const warningText = toNumber(deepGet(sd, 'world.deviation', 0), 0) >= 40
        ? `偏差 ${toNumber(deepGet(sd, 'world.deviation', 0), 0)} / 高危`
        : (deepGet(sd, 'world.flags.beast_tide', false)
          ? '兽潮警报 / 已触发'
          : (flagEntries.length ? `世界旗标 ${flagEntries.length} 项` : '无'));
      const auctionStatus = toText(deepGet(sd, 'world.auction.status', '休市'), '休市');
      const auctionLocation = toText(deepGet(sd, 'world.auction.location', '无'), '无');

      return {
        sd,
        activeName,
        appearanceText: formatAppearanceText(deepGet(activeChar, 'appearance', {})),
        personalityText: toText(deepGet(activeChar, 'personality', '未设定'), '未设定'),
        activeChar: activeChar || {},
        currentLoc,
        normalizedLoc: locationInfo.name,
        positionText,
        locationData,
        storeNames,
        dynamicLocationNames,
        timelineEntries,
        latestTimeline: timelineEntries[0] || null,
        seqEntries,
        factions,
        relations,
        unlockedKnowledges,
        inventoryEntries,
        youthRankingEntries,
        continentRankingEntries,
        flagEntries,
        orgEntries,
        titleEntries,
        recordEntries,
        conditionEntries,
        soulBoneEntries,
        artEntries,
        specialAbilityEntries,
        combatHistoryEntries,
        primarySpirit,
        secondaryTrack: secondarySpirit || (bloodline.valid ? bloodline : null),
        bloodline,
        mapNodeLabels: mapNodeLabels.slice(0, 4),
        pendingRequests,
        pendingIntelCount: pendingIntel ? 1 : 0,
        pendingIntelContent,
        pendingIntelImpact,
        primaryFaction,
        topRelation,
        relationAnalysis: deepGet(activeChar, 'social.relation_analysis', {}),

        questRecordCount,
        recentTitles,
        worldAlert: warningText,
        bestiaryEntries,
        forestKilledAge,
        auctionStatus,
        auctionLocation,
        mapData,
        mapCurrentMapId: toText(deepGet(mapData, 'current_map_id', 'map_douluo_world'), 'map_douluo_world'),
        mapZoomHint: toNumber(deepGet(mapData, 'current_zoom_hint', 0), 0),
        mapCurrentFocus,
        mapVisibleNodeEntries,
        mapVisibleSettlementEntries,
        mapVisibleDynamicEntries,
        mapActivePatchEntries,
        mapAvailableChildMaps,
        mapTravelCandidates,
        publicIntel: !!deepGet(activeChar, 'social.public_intel', false),
        extraSkills
      };
    }

    function applyActiveCharacterSelection(nextName, options = {}) {
      const targetName = toText(nextName, '').trim();
      const sd = deepGet(liveSnapshot, 'sd', null);
      const chars = deepGet(sd, 'char', {});
      if (!targetName || !sd || !chars || !chars[targetName]) return false;

      window.__MVU_MANUAL_CHAR_SET = true; // 标记这是用户手动切换的角色，不再自动被后续的玩家顶掉
      setPreferredActiveCharacterName(targetName);
      liveSnapshot = buildSnapshot(sd);
      renderHeader(liveSnapshot);
      renderLiveCards(liveSnapshot);

      if (activeBattleUI && typeof activeBattleUI.updateData === 'function') {
        activeBattleUI.updateData(liveSnapshot);
      }

      if (detailModal.classList.contains('show') && currentModalPreviewKey) {
        if (options.closeModal !== false) closeModal();
        else renderModalContent(currentModalPreviewKey);
      }

      return true;
    }

    function renderHeader(snapshot) {
      const stat = deepGet(snapshot, 'activeChar.stat', {});
      const social = deepGet(snapshot, 'activeChar.social', {});
      const worldTimeText = toText(deepGet(snapshot, 'sd.world.time.calendar', '斗罗历未同步'), '斗罗历未同步');
      const headerComboHtml = `<span style="opacity:1;font-size:12px;color:#fff;">${worldTimeText}</span><span style="opacity:0.65;font-size:11px;">${snapshot.currentLoc}</span>`;
      document.querySelectorAll('.header-loc span').forEach(el => { el.innerHTML = headerComboHtml; });
      document.querySelectorAll('.char-name').forEach(el => { el.textContent = snapshot.activeName; });
      document.querySelectorAll('.archive-split-loc span').forEach(el => { el.innerHTML = headerComboHtml; });
      document.querySelectorAll('.archive-split-name-text').forEach(el => { el.textContent = snapshot.activeName; });
      if (splitBottomTime) splitBottomTime.textContent = '';
      if (splitBottomLoc) splitBottomLoc.textContent = '';

      const statusChips = document.querySelectorAll('.header-status-row .header-status-chip');
      if (statusChips[0]) statusChips[0].querySelector('span').textContent = `${toText(deepGet(snapshot, 'activeChar.status.action', '日常'), '日常')} / ${toText(deepGet(snapshot, 'activeChar.status.active_domain', '无'), '无')}`;
      if (statusChips[1]) statusChips[1].querySelector('span').textContent = `${toText(deepGet(snapshot, 'activeChar.status.wound', '无伤'), '无伤')} / ${deepGet(snapshot, 'activeChar.status.alive', true) ? '状态稳定' : '已陨落'}`;
      if (statusChips[2]) statusChips[2].querySelector('span').textContent = `${toText(deepGet(snapshot, 'activeChar.bloodline_power.bloodline', '无'), '无')} / ${toNumber(deepGet(snapshot, 'activeChar.bloodline_power.seal_lv', 0), 0)}层`;
      if (statusChips[3]) statusChips[3].querySelector('span').textContent = `斗铠${toText(deepGet(snapshot, 'activeChar.equip.armor.equip_status', '未装备'), '未装备')} / 机甲${toText(deepGet(snapshot, 'activeChar.equip.mech.lv', '无'), '无')}`;
      if (statusChips[4]) statusChips[4].querySelector('span').textContent = snapshot.worldAlert;
    }

    function buildArchiveCoreCard(snapshot) {
      const stat = deepGet(snapshot, 'activeChar.stat', {});
      const social = deepGet(snapshot, 'activeChar.social', {});
      const status = deepGet(snapshot, 'activeChar.status', {});
      const nextLevelSoul = getNextLevelSoulRequirement(stat);
      const primaryFactionName = snapshot.primaryFaction ? snapshot.primaryFaction[0] : '无';
      const primaryFactionRole = snapshot.primaryFaction ? toText(deepGet(snapshot.primaryFaction[1], '身份', '无'), '无') : '未加入';
      const topRelationText = snapshot.topRelation
        ? `${shortenText(snapshot.topRelation[0], 8)} / ${toText(deepGet(snapshot.topRelation[1], '关系', '陌生'), '陌生')} · ${toNumber(deepGet(snapshot.topRelation[1], '好感度', 0), 0)}`
        : `${snapshot.relations.length} 条`;
      const latestIntelText = snapshot.pendingIntelCount
        ? `${shortenText(snapshot.pendingIntelContent, 10)} / +${snapshot.pendingIntelImpact}`
        : (snapshot.unlockedKnowledges.length ? shortenText(snapshot.unlockedKnowledges[snapshot.unlockedKnowledges.length - 1], 12) : '暂无');
      return `
        <div class="panel-head">
          <div class="panel-title">核心生命体征</div>
          <span class="meta-pill">${htmlEscape(nextLevelSoul.isMax ? '离下一级所需魂力：已满级' : `离下一级所需魂力：${formatNumber(nextLevelSoul.needed)}`)}</span>
        </div>
        <div class="stats-grid">
          <div class="stat-item compact no-bar">
            <div class="stat-label">年龄 / 性别</div>
            <div class="stat-value">${htmlEscape(`${toText(stat.age, '0')}岁 / ${toText(stat.gender, '未知')}`)}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">修为等级</div>
            <div class="stat-value cyan">Lv.${htmlEscape(toText(stat.lv, '0'))}</div>
            <div class="line"><div class="fill" style="color: var(--cyan); width: ${ratioPercent(stat.sp, stat.sp_max)}%;"></div></div>
          </div>
          <div class="stat-item">
            <div class="stat-label">魂力 (SP)</div>
            <div class="stat-value cyan">${htmlEscape(`${formatNumber(stat.sp)} / ${formatNumber(stat.sp_max)}`)}</div>
            <div class="line"><div class="fill" style="color: var(--cyan); width: ${ratioPercent(stat.sp, stat.sp_max)}%;"></div></div>
          </div>
          <div class="stat-item compact no-bar">
            <div class="stat-label">状态概览</div>
            <div class="stat-value">${htmlEscape(`${toText(status.action, '日常')} / ${toText(status.wound, '无伤')}`)}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">气血 (VIT)</div>
            <div class="stat-value red">${htmlEscape(`${formatNumber(stat.vit)} / ${formatNumber(stat.vit_max)}`)}</div>
            <div class="line"><div class="fill" style="color: var(--red); width: ${ratioPercent(stat.vit, stat.vit_max)}%;"></div></div>
          </div>
          <div class="stat-item">
            <div class="stat-label">精神力 (MEN) · ${htmlEscape(toText(stat.men_realm, '灵元境'))}</div>
            <div class="stat-value">${htmlEscape(`${formatNumber(stat.men)} / ${formatNumber(stat.men_max)}`)}</div>
            <div class="line"><div class="fill" style="color: var(--white); width: ${ratioPercent(stat.men, stat.men_max)}%;"></div></div>
          </div>
        </div>
      `;
    }

    function buildArmoryCard(snapshot) {
      const armor = deepGet(snapshot, 'activeChar.equip.armor', {});
      const mech = deepGet(snapshot, 'activeChar.equip.mech', {});
      const weapon = deepGet(snapshot, 'activeChar.equip.wpn', {});
      const accessoryEntries = listAccessoryEntries(deepGet(snapshot, 'activeChar.equip.accessories', {}));
      const jobs = safeEntries(deepGet(snapshot, 'activeChar.job', {}));
      const jobSummary = jobs.length ? `${jobs[0][0]} Lv.${toText(deepGet(jobs[0][1], 'lv', 0), '0')}` : '未展开';
      const jobCoreTechSummary = jobs.length ? (Object.keys(deepGet(jobs[0][1], 'core_tech', {})).slice(0, 2).join(' / ') || '暂无核心技术') : '暂无核心技术';
      const jobLimitSummary = jobs.length ? `融锻上限 ${toText(deepGet(jobs[0][1], 'limits.max_fusion', 1), '1')} / 成功率 ${toText(deepGet(jobs[0][1], 'limits.success_rate', 0), '0')}%` : '暂无工坊上限';
      const armorSummary = toNumber(armor.lv, 0) > 0 ? `${toText(armor.name, `${armor.lv}字斗铠`)} / ${toText(armor.equip_status, '未装备')}` : '未装备';
      const mechSummary = toText(mech.lv, '无') !== '无' ? `${toText(mech.lv, '无')}·${toText(mech.type, '未定型')} / ${toText(mech.equip_status || mech.status, '未装备')}` : '无';
      const accessorySummary = accessoryEntries.length ? `${accessoryEntries.length}件` : '无';
      const boneCount = snapshot.soulBoneEntries ? snapshot.soulBoneEntries.length : 0;
      return `
        <div class="module-name">武装工坊</div>
        <div class="module-grid" style="grid-template-columns: repeat(3, 1fr);">
          <div class="mini-box"><b>当前斗铠</b><span>${htmlEscape(armorSummary)}</span></div>
          <div class="mini-box"><b>当前机甲</b><span>${htmlEscape(mechSummary)}</span></div>
          <div class="mini-box"><b>装载魂骨</b><span>${htmlEscape(boneCount ? `${boneCount} 块` : '未装配')}</span></div>
        </div>
      `;
    }

    function buildVaultCard(snapshot) {
      const wealth = deepGet(snapshot, 'activeChar.wealth', {});
      return `
        <div class="module-name">储物仓库</div>
        <div class="module-grid">
          <div class="mini-box"><b>物品种类</b><span>${htmlEscape(String(snapshot.inventoryEntries.length || 0))}</span></div>
          <div class="mini-box"><b>流动资金</b><span>${htmlEscape(`${formatNumber(wealth.fed_coin)} / 星罗 ${formatNumber(wealth.star_coin)}`)}</span></div>
        </div>
        <div class="module-foot">
          <span class="foot-hint">记录物资总计 ${htmlEscape(String(snapshot.inventoryEntries.length || 0))} 件</span>
          <span class="enter-chip gold-chip">${htmlEscape(`积分/战功：${formatNumber(wealth.tang_pt)} / ${formatNumber(wealth.shrek_pt)} / ${formatNumber(wealth.blood_pt)}`)}</span>
        </div>
      `;
    }

    function renderSpiritStrips(snapshot) {
      const primary = snapshot.primarySpirit;
      const secondary = snapshot.secondaryTrack;
      document.querySelectorAll('.dual-spirit-strip').forEach(strip => {
        const isSecondaryOnly = strip.classList.contains('secondary-track') || strip.classList.contains('split-secondary-left');
        const isSinglePrimary = strip.classList.contains('single-track') && !strip.classList.contains('split-secondary-left');

        if (isSecondaryOnly) {
          if (!secondary) {
            strip.style.display = 'none';
            return;
          }
          strip.style.display = '';
          strip.innerHTML = `<div class="dual-spirit-body"><div class="spirit-side primary-side"></div><div class="spirit-side secondary-side clickable" data-preview="${htmlEscape(secondary.preview)}">${secondary.kind === 'bloodline' ? renderArchiveBloodlineEntry(secondary) : renderArchiveSpiritEntry(secondary, false)}</div></div>`;
          return;
        }

        if (isSinglePrimary) {
          strip.style.display = '';
          strip.innerHTML = `<div class="dual-spirit-body"><div class="spirit-side primary-side clickable" data-preview="${htmlEscape(primary.preview)}">${renderArchiveSpiritEntry(primary, true)}</div><div class="spirit-side secondary-side clickable"></div></div>`;
          return;
        }

        if (!secondary) {
          strip.style.display = 'none';
          return;
        }

        strip.style.display = '';
        strip.innerHTML = `
          <div class="dual-spirit-body">
            <div class="spirit-side primary-side clickable" data-preview="${htmlEscape(primary.preview)}">${renderArchiveSpiritEntry(primary, true)}</div>
            <div class="spirit-side secondary-side clickable" data-preview="${htmlEscape(secondary.preview)}">${secondary.kind === 'bloodline' ? renderArchiveBloodlineEntry(secondary) : renderArchiveSpiritEntry(secondary, false)}</div>
          </div>
        `;
      });
    }


    function getMapMeta(snapshot) {
      const mapId = toText(snapshot && snapshot.mapCurrentMapId, 'map_douluo_world');
      return deepGet(snapshot, `sd.world.maps.${mapId}`, {});
    }

    function getMapDisplayName(snapshot, mapId = null) {
      const safeMapId = toText(mapId || (snapshot && snapshot.mapCurrentMapId), 'map_douluo_world');
      const explicitName = toText(deepGet(snapshot, `sd.world.maps.${safeMapId}.name`, ''), '');
      if (explicitName) return explicitName;
      if (safeMapId === 'map_douluo_world') return '斗罗大陆总图';
      if (/^map_debug_/i.test(safeMapId)) return '区域子图';
      if (/^map_/i.test(safeMapId)) return '未命名子图';
      return '未命名地图';
    }

    function getMapBounds(snapshot) {
      const mapMeta = getMapMeta(snapshot);
      return {
        minX: toNumber(deepGet(mapMeta, 'bounds.min_x', 0), 0),
        minY: toNumber(deepGet(mapMeta, 'bounds.min_y', 0), 0),
        width: Math.max(1, toNumber(deepGet(mapMeta, 'bounds.width', 2000), 2000) || 2000),
        height: Math.max(1, toNumber(deepGet(mapMeta, 'bounds.height', 2000), 2000) || 2000)
      };
    }

    function mapCoordToPercent(value, min, span, fallback) {
      const num = Number(value);
      if (!Number.isFinite(num)) return fallback;
      const ratio = (num - min) / Math.max(span, 1);
      return Math.max(8, Math.min(92, 8 + ratio * 84));
    }

    function buildDisplayMapItems(snapshot) {
      const bounds = getMapBounds(snapshot);
      const seen = new Set();
      const items = [];
      const pushItem = (name, item, extra = {}) => {
        const safeName = toText(name, '').trim();
        if (!safeName || seen.has(safeName)) return;
        seen.add(safeName);
        items.push({
          name: safeName,
          source: extra.source || toText(item && item.source, 'static'),
          type: toText(extra.type || (item && item.type) || (item && item.icon) || '节点', '节点'),
          desc: toText(extra.desc || (item && item.desc) || '无', '无'),
          state: toText(extra.state || (item && item.state) || '可见', '可见'),
          canEnter: !!(extra.canEnter || deepGet(item, 'can_enter', false) || (item && item.child_map_id && item.child_map_id !== '无')),
          childMapId: toText(extra.childMapId || (item && item.child_map_id) || '无', '无'),
          major: !!extra.major,
          current: safeName === snapshot.currentLoc || safeName === toText(deepGet(snapshot, 'mapCurrentFocus.loc', ''), ''),
          x: mapCoordToPercent(item && item.x, bounds.minX, bounds.width, 50),
          y: mapCoordToPercent(item && item.y, bounds.minY, bounds.height, 50)
        });
      };

      snapshot.mapVisibleSettlementEntries.forEach(([id, item]) => {
        pushItem(item && item.name ? item.name : id, item, { source: 'settlement', type: '主城/据点', state: toText(item && item.state, '完整'), canEnter: !!(item && item.child_map_id && item.child_map_id !== '无'), childMapId: item && item.child_map_id, major: true, desc: `状态：${toText(item && item.state, '完整')}` });
      });
      snapshot.mapVisibleNodeEntries.forEach(([name, item]) => {
        pushItem(name, item, { source: toText(item && item.source, 'static'), type: toText(item && item.type, '地图节点'), state: toText(item && item.level ? `Lv.${item.level}` : '可见', '可见'), canEnter: !!deepGet(item, 'can_enter', false), childMapId: item && item.child_map_id, major: !!deepGet(item, 'can_enter', false) || toNumber(item && item.level, 0) <= 2 });
      });
      snapshot.mapVisibleDynamicEntries.forEach(([name, item]) => {
        pushItem(name, item, { source: 'dynamic', type: '动态地点', state: '动态', canEnter: false, major: false, desc: toText(item && item.desc, '无') });
      });

      return items.slice(0, 12);
    }

    function resolveDisplayMapNode(snapshot, nodeName) {
      const settlement = snapshot.mapVisibleSettlementEntries.find(([, item]) => toText(item && item.name, '') === nodeName);
      if (settlement) return { name: nodeName, source: 'settlement', type: '主城/据点', state: toText(settlement[1] && settlement[1].state, '完整'), childMapId: toText(settlement[1] && settlement[1].child_map_id, '无'), x: settlement[1] && settlement[1].x, y: settlement[1] && settlement[1].y, desc: `状态：${toText(settlement[1] && settlement[1].state, '完整')}` };
      const node = snapshot.mapVisibleNodeEntries.find(([name]) => name === nodeName);
      if (node) return { name: nodeName, source: toText(node[1] && node[1].source, 'static'), type: toText(node[1] && node[1].type, '地图节点'), state: node[1] && node[1].level ? `Lv.${node[1].level}` : '可见', childMapId: toText(node[1] && node[1].child_map_id, '无'), x: node[1] && node[1].x, y: node[1] && node[1].y, desc: toText(node[1] && node[1].desc, '无') };
      const dynamicNode = snapshot.mapVisibleDynamicEntries.find(([name]) => name === nodeName);
      if (dynamicNode) return { name: nodeName, source: 'dynamic', type: '动态地点', state: '动态', childMapId: '无', x: dynamicNode[1] && dynamicNode[1].x, y: dynamicNode[1] && dynamicNode[1].y, desc: toText(dynamicNode[1] && dynamicNode[1].desc, '无') };
      return null;
    }

    function buildMapHeroCard(snapshot) {
      const items = buildDisplayMapItems(snapshot);
      const currentChildMapCount = safeEntries(snapshot.mapAvailableChildMaps).length;
      const currentMapDisplayName = getMapDisplayName(snapshot);
      const fallbackNodeSlots = [
        { left: '48%', top: '42%', major: true },
        { left: '28%', top: '48%', major: false },
        { left: '72%', top: '58%', major: true, current: true },
        { left: '56%', top: '74%', major: false }
      ];
      const fallbackBaseLabel = toText(snapshot.currentLoc || snapshot.normalizedLoc, '未命名节点');
      const fallbackLabels = snapshot.mapNodeLabels.length
        ? [...snapshot.mapNodeLabels]
        : [snapshot.normalizedLoc, snapshot.currentLoc].filter(label => toText(label, ''));
      while (fallbackLabels.length < 4) fallbackLabels.push(fallbackBaseLabel);
      const nodesHtml = (items.length ? items.map(item => `<div class="map-node clickable ${item.current ? 'current' : ''} ${item.canEnter ? 'origin' : ''}" data-preview="地图节点：${htmlEscape(item.name)}" style="left:${item.x}%; top:${item.y}%;"><div class="map-dot ${item.major ? 'major' : ''}"></div><div class="map-label">${htmlEscape(item.name)}</div></div>`) : fallbackNodeSlots.map((slot, index) => {
        const label = fallbackLabels[index] || snapshot.currentLoc;
        return `<div class="map-node clickable ${slot.current ? 'current' : ''}" data-preview="地图节点：${htmlEscape(label)}" style="left:${slot.left}; top:${slot.top};"><div class="map-dot ${slot.major ? 'major' : ''}"></div><div class="map-label">${htmlEscape(label)}</div></div>`;
      })).join('');
      const patchMarkers = snapshot.mapActivePatchEntries.slice(0, 3).map(([patchId, patch]) => {
        const mapMeta = getMapMeta(snapshot);
        const bounds = getMapBounds(snapshot);
        const centerX = toNumber(deepGet(patch, 'bounds.x', 0), 0) + toNumber(deepGet(patch, 'bounds.w', 0), 0) / 2;
        const centerY = toNumber(deepGet(patch, 'bounds.y', 0), 0) + toNumber(deepGet(patch, 'bounds.h', 0), 0) / 2;
        const left = mapCoordToPercent(centerX, bounds.minX, bounds.width, 50);
        const top = mapCoordToPercent(centerY, bounds.minY, bounds.height, 50);
        return `<div class="map-free-marker target" style="left:${left}%; top:${top}%">${htmlEscape(patchId.replace(/^patch_/, ''))}</div>`;
      }).join('');
      return `
        <div class="module-name">全息星图</div>
        <div class="map-canvas map-canvas-large">
          <div class="map-legend-strip">
            <span class="map-legend-chip"><i class="map-legend-dot major"></i>主节点</span>
            <span class="map-legend-chip"><i class="map-legend-dot"></i>次级节点 / 动态地点</span>
            <span class="map-legend-chip"><i class="map-legend-dot"></i>${htmlEscape(`当前地图 ${currentMapDisplayName}`)}</span>
          </div>
          <div class="map-focus-pill">${htmlEscape(`当前锚点 / ${toText(deepGet(snapshot, 'mapCurrentFocus.loc', snapshot.currentLoc), snapshot.currentLoc)}`)}</div>
          ${nodesHtml}
          ${patchMarkers}
          <div class="map-canvas-hud">
            <div class="map-hud-card live"><b>位置链</b><span>${htmlEscape(`${currentMapDisplayName} → ${snapshot.currentLoc}`)}</span></div>
            <div class="map-hud-card gold"><b>可进入子图</b><span>${htmlEscape(currentChildMapCount ? `${currentChildMapCount} 个入口` : '当前无子图入口')}</span></div>
          </div>
        </div>
        <div class="map-status-strip">
          <div class="map-status-chip live"><b>当前锚点</b><span>${htmlEscape(snapshot.currentLoc)}</span></div>
          <div class="map-status-chip"><b>当前地图</b><span>${htmlEscape(currentMapDisplayName)}</span></div>
          <div class="map-status-chip"><b>可见节点</b><span>${htmlEscape(String(items.length || fallbackLabels.filter(Boolean).length))}</span></div>
          <div class="map-status-chip gold"><b>激活补丁</b><span>${htmlEscape(String(snapshot.mapActivePatchEntries.length))}</span></div>
        </div>
        <div class="module-foot">
          <span class="foot-hint">可下钻节点：${htmlEscape(String(currentChildMapCount || safeEntries(snapshot.mapAvailableChildMaps).length))} / 可跑图 ${htmlEscape(String(snapshot.mapTravelCandidates.length || snapshot.mapNodeLabels.length))}</span>
          <span class="enter-chip">节点下钻</span>
        </div>
      `;
    }

    function buildSimpleCard(title, badge, rows) {
      return `
        <div class="simple-head">
          <div class="simple-title">${htmlEscape(title)}</div>
          ${badge ? `<span class="map-side-badge ${badge.className || ''}">${htmlEscape(badge.text)}</span>` : ''}
        </div>
        <div class="simple-list">
          ${rows.map(row => `<div class="simple-row"><b>${htmlEscape(row.label)}</b><span>${htmlEscape(row.value)}</span></div>`).join('')}
        </div>
      `;
    }

    function buildWorldHeroCard(snapshot) {
      const worldTime = toText(deepGet(snapshot, 'sd.world.time.calendar', '斗罗历未同步'), '斗罗历未同步');
      const deviation = toNumber(deepGet(snapshot, 'sd.world.deviation', 0), 0);
      const forestRatio = Math.max(0, Math.min(100, Number(((toNumber(snapshot.forestKilledAge, 0) / 1000000) * 100).toFixed(1))));
      const forestStage = forestRatio >= 100 ? '兽潮临界' : (forestRatio >= 70 ? '高度紧张' : (forestRatio >= 30 ? '持续升温' : '相对安全'));
      const latest = snapshot.latestTimeline;
      const planSummary = buildRecentPlanSummary(snapshot, { worldLimit: 1, recordLimit: 1 });
      const newsSummary = buildRecentNewsSummary(snapshot, { seqLimit: 1, intelLimit: 1 });

      return `
        <div class="module-name">时空中枢</div>
        <div class="hero-metrics">
          <div class="hero-row"><b>当前时间</b><span>${htmlEscape(worldTime)}</span></div>
          <div class="hero-row"><b>世界偏差</b><span>${htmlEscape(`${deviation} / ${deviation >= 40 ? '高危' : deviation >= 10 ? '波动' : '平稳'}`)}</span></div>
          <div class="hero-row"><b>当前阶段</b><span>${htmlEscape(latest ? latest[0] : snapshot.currentLoc)}</span></div>
        </div>
        <div class="hero-list">
          <div class="hero-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
            <b>近期安排</b><span>${htmlEscape(planSummary.summary)}</span>
          </div>
          <div class="hero-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
            <b>近期见闻</b><span>${htmlEscape(newsSummary.summary)}</span>
          </div>
          <div class="hero-row" style="flex-direction: column; align-items: flex-start; gap: 6px;">
            <b>森林仇恨值</b>
            <span>${htmlEscape(`${forestStage} / ${formatNumber(snapshot.forestKilledAge)} / 1000000`)}</span>
            <div style="width:100%;height:8px;border-radius:999px;background:rgba(255,255,255,0.08);overflow:hidden;border:1px solid rgba(150,217,228,0.12);">
              <div style="height:100%;width:${forestRatio}%;background:${forestRatio >= 100 ? 'linear-gradient(90deg,#ff6b6b,#ffb36b)' : (forestRatio >= 70 ? 'linear-gradient(90deg,#ffd36b,#ff8a5b)' : 'linear-gradient(90deg,#72e6ff,#7dffb2)')};box-shadow:0 0 10px rgba(255,180,107,0.28);"></div>
            </div>
          </div>
        </div>
        <div class="module-foot">
          <span class="foot-hint">风险摘要：${htmlEscape(snapshot.worldAlert)}</span>
        </div>
      `;
    }

    function buildOrgHeroCard(snapshot) {
      const topOrgs = snapshot.orgEntries.slice(0, 4);
      const primaryFactionEntry = getPrimaryFactionEntry(snapshot);
      const relationSummary = buildFactionRelationSummary(primaryFactionEntry && primaryFactionEntry.data ? primaryFactionEntry.data : {}, 3) || '暂无';
      return `
        <div class="module-name">势力矩阵</div>
        <div class="matrix-board">
          ${topOrgs.map(([name, data], index) => `<div class="matrix-node ${snapshot.factions.some(([fac]) => fac === name) || index === 0 ? 'gold' : ''}"><b>${htmlEscape(name)}</b><span>${htmlEscape(`影响力 ${formatNumber(data && data.inf)} / ${toText(data && data.status, '正常')}`)}</span></div>`).join('')}
        </div>
        ${(() => { const factionStats = getPrimaryFactionPowerStats(snapshot); return `
        <div class="hero-list">
          <div class="hero-row"><b>极限斗罗</b><span>${htmlEscape(String(factionStats.limit))}</span></div>
          <div class="hero-row"><b>超级斗罗</b><span>${htmlEscape(String(factionStats.super))}</span></div>
          <div class="hero-row"><b>封号斗罗</b><span>${htmlEscape(String(factionStats.title))}</span></div>
          <div class="hero-row"><b>势力关系</b><span>${htmlEscape(relationSummary)}</span></div>
        </div>
        `; })()}
        <div class="module-foot">
          <span class="foot-hint">本地高亮：${htmlEscape(toText(deepGet(snapshot, 'locationData.掌控势力', snapshot.factions[0] ? snapshot.factions[0][0] : '未知'), '未知'))}</span>
          <span class="enter-chip gold-chip">展开矩阵</span>
        </div>
      `;
    }

    function buildTerminalHeroCard(snapshot) {
      const sys = deepGet(snapshot, 'sd.sys', {});
      const recentNews = buildRecentNewsSummary(snapshot, { seqLimit: 2, intelLimit: 1 });
      const recentPlans = buildRecentPlanSummary(snapshot, { worldLimit: 2, recordLimit: 1 });
      const latestBroadcast = toText(sys.rsn, '暂无播报');
      const latestEvent = recentNews.cards[0] ? recentNews.cards[0].desc : '暂无事件';
      const pendingRequestText = recentPlans.cards[0] ? recentPlans.cards[0].desc : '暂无安排';
      const intelText = snapshot.pendingIntelCount
        ? `${snapshot.pendingIntelContent} / 新线索 ${snapshot.pendingIntelCount} 条`
        : (recentNews.personalNews[0] ? recentNews.personalNews[0].desc : '暂无新情报');
      return `
        <div class="module-name">系统播报</div>
        <div class="terminal-overview">
          <div class="terminal-metric live clickable" data-preview="近期见闻"><b>系统状态</b><span>${htmlEscape(snapshot.worldAlert.includes('高危') ? '高压同步' : '稳定')}</span></div>
          <div class="terminal-metric clickable" data-preview="系统播报与日志"><b>最近播报</b><span>${htmlEscape(shortenText(latestBroadcast, 14))}</span></div>
          <div class="terminal-metric clickable" data-preview="操作总线"><b>当前安排</b><span>${htmlEscape(recentPlans.cards.length ? `${recentPlans.cards.length} 项` : '暂无')}</span></div>
          <div class="terminal-metric gold clickable" data-preview="试炼与情报"><b>新线索</b><span>${htmlEscape(snapshot.pendingIntelCount ? `${snapshot.pendingIntelCount} 条` : '暂无')}</span></div>
        </div>
        <div class="terminal-log">
          <div class="terminal-log-head"><span>近期播报</span><b>终端在线</b></div>
          <div class="terminal-channel-strip">
            <span class="terminal-channel-chip live">播报</span>
            <span class="terminal-channel-chip">事件</span>
            <span class="terminal-channel-chip">安排</span>
            <span class="terminal-channel-chip gold">情报</span>
          </div>
          <div class="log-line sys"><b>[播报]</b> ${htmlEscape(latestBroadcast)}</div>
          <div class="log-line roll"><b>[事件]</b> ${htmlEscape(latestEvent)}</div>
          <div class="log-line bus"><b>[安排]</b> ${htmlEscape(pendingRequestText)}</div>
          <div class="log-line intel"><b>[情报]</b> ${htmlEscape(intelText)}</div>
        </div>
        <div class="module-foot">
          <span class="foot-hint">最近播报：${htmlEscape(toText(sys.rsn, '无'))}</span>
          <span class="enter-chip">展开日志</span>
        </div>
      `;
    }

    function renderLiveCards(snapshot) {
      const social = deepGet(snapshot, 'activeChar.social', {});
      const primaryFactionName = snapshot.primaryFaction ? snapshot.primaryFaction[0] : '无';
      const primaryFactionRole = snapshot.primaryFaction ? toText(deepGet(snapshot.primaryFaction[1], '身份', '无'), '无') : '未加入';
      const topRelationText = snapshot.topRelation
        ? `${shortenText(snapshot.topRelation[0], 8)} / ${toText(deepGet(snapshot.topRelation[1], '关系', '陌生'), '陌生')} · ${toNumber(deepGet(snapshot.topRelation[1], '好感度', 0), 0)}`
        : `${snapshot.relations.length} 条`;
      const latestIntelText = snapshot.pendingIntelCount
        ? `${shortenText(snapshot.pendingIntelContent, 10)} / +${snapshot.pendingIntelImpact}`
        : (snapshot.unlockedKnowledges.length ? shortenText(snapshot.unlockedKnowledges[snapshot.unlockedKnowledges.length - 1], 12) : '暂无');

      document.querySelectorAll('[data-preview="生命图谱详细页"].mvu-panel.core-card').forEach(el => { el.innerHTML = buildArchiveCoreCard(snapshot); });
      document.querySelectorAll('[data-preview="武装工坊详细页"].mvu-module-card').forEach(el => { el.innerHTML = buildArmoryCard(snapshot); });
      document.querySelectorAll('[data-preview="储物仓库详细页"].mvu-module-card').forEach(el => { el.innerHTML = buildVaultCard(snapshot); });
      renderSpiritStrips(snapshot);

      if (typeof window.__sheepMapResync === 'function') {
        try {
          window.__sheepMapResync({ center: false, syncVisual: false });
        } catch (err) {}
      } else {
        const fallbackMapDisplayName = getMapDisplayName(snapshot);
        document.querySelectorAll('[data-preview="全息星图主画布"].map-hero-card').forEach(el => { el.innerHTML = buildMapHeroCard(snapshot); });
        document.querySelectorAll('[data-preview="当前节点详情"].map-side-card').forEach(el => {
          const focusNode = resolveDisplayMapNode(snapshot, snapshot.currentLoc);
          el.innerHTML = buildSimpleCard('当前位置', { text: '当前' }, [
            { label: '地点', value: snapshot.currentLoc },
            { label: '地图', value: fallbackMapDisplayName },
            { label: '节点类型', value: focusNode ? focusNode.type : toText(deepGet(snapshot, 'locationData.掌控势力', '未知'), '未知') },
            { label: '入口', value: focusNode && focusNode.childMapId !== '无' ? '可进入子图' : '当前无子图入口' }
          ]);
        });
        document.querySelectorAll('[data-preview="图层控制与跑图"].map-side-card').forEach(el => { el.innerHTML = `
          <div class="simple-head"><div class="simple-title">图层控制</div><span class="map-side-badge gold">导航</span></div>
          <div class="map-layer-pills">
            <span class="map-layer-pill">${htmlEscape(fallbackMapDisplayName)}</span>
            <span class="map-layer-pill current">${htmlEscape(snapshot.currentLoc)}</span>
            <span class="map-layer-pill">${htmlEscape(`缩放 ${snapshot.mapZoomHint}`)}</span>
          </div>
          <div class="simple-list">
            <div class="simple-row"><b>层级</b><span>${htmlEscape(`${fallbackMapDisplayName} / 当前焦点`)}</span></div>
            <div class="simple-row"><b>移动方式</b><span>${htmlEscape(toText(deepGet(snapshot, 'activeChar.travel_request.method', '步行'), '步行'))}</span></div>
            <div class="simple-row"><b>可进子图</b><span>${htmlEscape(`${safeEntries(snapshot.mapAvailableChildMaps).length} 个`)}</span></div>
            <div class="simple-row"><b>激活补丁</b><span>${htmlEscape(`${snapshot.mapActivePatchEntries.length} 项`)}</span></div>
          </div>
        `; });
        document.querySelectorAll('[data-preview="动态地点与扩展节点"].map-side-card').forEach(el => { el.innerHTML = `
          <div class="simple-head"><div class="simple-title">动态地点</div><span class="map-side-badge">动态</span></div>
          <div class="map-event-strip">
            <span class="map-event-chip live">时间线 ${htmlEscape(String(snapshot.timelineEntries.length))}</span>
            <span class="map-event-chip">主城 ${htmlEscape(String(snapshot.mapVisibleSettlementEntries.length))}</span>
            <span class="map-event-chip warn">动态点 ${htmlEscape(String(snapshot.mapVisibleDynamicEntries.length))}</span>
            <span class="map-event-chip warn">补丁 ${htmlEscape(String(snapshot.mapActivePatchEntries.length))}</span>
          </div>
          <div class="simple-list">
            <div class="simple-row"><b>扩展节点</b><span>${htmlEscape(snapshot.mapVisibleDynamicEntries[0] ? snapshot.mapVisibleDynamicEntries[0][0] : '暂无')}</span></div>
            <div class="simple-row"><b>当前主城</b><span>${htmlEscape(snapshot.mapVisibleSettlementEntries[0] ? toText(snapshot.mapVisibleSettlementEntries[0][1] && snapshot.mapVisibleSettlementEntries[0][1].name, '暂无') : '暂无')}</span></div>
            <div class="simple-row"><b>最近变化</b><span>${htmlEscape(snapshot.latestTimeline ? snapshot.latestTimeline[0] : '无')}</span></div>
          </div>
        `; });
      }

      document.querySelectorAll('.archive-social-card .social-chip[data-preview="社会档案详细页"] span').forEach(el => { el.textContent = `${toText(social.fame_level, '籍籍无名')} / ${formatNumber(social.reputation)}`; });
      document.querySelectorAll('.archive-social-card .social-chip[data-preview="所属势力详细页"] span').forEach(el => { el.textContent = `${shortenText(primaryFactionName, 8)} / ${shortenText(primaryFactionRole, 8)}`; });
      document.querySelectorAll('.archive-social-card .social-chip[data-preview="人物关系详细页"] span').forEach(el => { el.textContent = topRelationText; });
      document.querySelectorAll('.archive-social-card .social-chip[data-preview="情报库详细页"] span').forEach(el => { el.textContent = `${snapshot.unlockedKnowledges.length} / ${latestIntelText}`; });

      document.querySelectorAll('[data-preview="世界状态总览"].hero-card').forEach(el => {
        el.classList.remove('clickable');
        el.removeAttribute('data-preview');
        el.innerHTML = buildWorldHeroCard(snapshot);
      });
      document.querySelectorAll('[data-preview="编年史档案"].mvu-simple-card').forEach(el => {
        el.style.overflow = 'hidden';
        el.style.flex = '1.2 1 0';
        el.innerHTML = buildSimpleCard('编年史', null, [
        { label: '最近事件', value: snapshot.latestTimeline ? toText(deepGet(snapshot.latestTimeline[1], 'event', snapshot.latestTimeline[0]), snapshot.latestTimeline[0]) : '暂无' },
        { label: '推进状态', value: snapshot.latestTimeline ? `${toText(deepGet(snapshot.latestTimeline[1], 'status', 'pending'), 'pending')} / Tick ${toText(deepGet(snapshot.latestTimeline[1], 'trigger_tick', 0), '0')}` : '暂无时间线' }
      ]);
        const simpleList = el.querySelector('.simple-list');
        if (simpleList) {
          simpleList.style.overflow = 'hidden';
          simpleList.style.maxHeight = 'none';
        }
      });
      document.querySelectorAll('[data-rank-card="天道金榜"].mvu-simple-card').forEach(el => { 
        el.style.overflow = 'hidden';
        el.style.flex = '0.8 1 0';
        el.innerHTML = `
          <div class="simple-head"><div class="simple-title">天道金榜</div></div>
          <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; align-items: stretch; height: 100%; min-height: 40px; overflow: hidden;">
            <div class="mvu-panel clickable" data-preview="少年天才榜" style="padding: 4px 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; min-height: 0; overflow: hidden;">
              <div style="font-size: 10px; color: #85afb8; margin-bottom: 4px;">少年天才榜</div>
              <div style="font-size: 12px; color: #fff; font-weight: bold;">${snapshot.youthRankingEntries.length} 人上榜</div>
            </div>
            <div class="mvu-panel clickable" data-preview="大陆风云榜" style="padding: 4px 10px; margin: 0; display: flex; flex-direction: column; justify-content: center; min-height: 0; overflow: hidden;">
              <div style="font-size: 10px; color: #85afb8; margin-bottom: 4px;">大陆风云榜</div>
              <div style="font-size: 12px; color: #fff; font-weight: bold;">${snapshot.continentRankingEntries.length} 人上榜</div>
            </div>
          </div>
        `; 
      });
      document.querySelectorAll('[data-preview="拍卖与警报"].mvu-simple-card').forEach(el => { el.innerHTML = buildSimpleCard('拍卖行与警报', null, [
        { label: '拍卖行', value: `${toText(deepGet(snapshot, 'sd.world.auction.status', '休市'), '休市')} / ${toText(deepGet(snapshot, 'sd.world.auction.location', '无'), '无')}` },
        { label: '生态警报', value: snapshot.worldAlert }
      ]); });

      document.querySelectorAll('[data-preview="势力矩阵总览"].hero-card').forEach(el => { el.innerHTML = buildOrgHeroCard(snapshot); });
      document.querySelectorAll('[data-preview="我的阵营详情"].mvu-simple-card').forEach(el => { el.innerHTML = buildSimpleCard('我的阵营', null, [
        { label: '当前所属', value: snapshot.factions[0] ? snapshot.factions[0][0] : '无' },
        { label: '身份', value: snapshot.factions[0] ? toText(deepGet(snapshot.factions[0][1], '身份', '无'), '无') : '未加入' }
      ]); });
      document.querySelectorAll('[data-preview="本地据点详情"].mvu-simple-card').forEach(el => { el.innerHTML = buildSimpleCard('本地据点', null, [
        { label: '掌控势力', value: toText(deepGet(snapshot, 'locationData.掌控势力', '未知'), '未知') },
        { label: '经济状况', value: `${toText(deepGet(snapshot, 'locationData.经济状况', '未知'), '未知')} / ${toText(deepGet(snapshot, 'locationData.守护军团', '守护军团未知'), '守护军团未知')}` }
      ]); });

      document.querySelectorAll('[data-preview="系统播报与日志"].terminal-hero-card').forEach(el => { el.innerHTML = buildTerminalHeroCard(snapshot); });
      document.querySelectorAll('[data-preview="操作总线"].terminal-side-card, [data-preview="操作总线"].mvu-simple-card, [data-preview="操作总线"].simple-card').forEach(el => { el.innerHTML = `
        <div class="simple-head"><div class="simple-title">近期安排</div></div>
        <div class="simple-list">
          ${(() => { const planSummary = buildRecentPlanSummary(snapshot, { worldLimit: 1, recordLimit: 1 }); return `
          <div class="simple-row"><b>世界安排</b><span>${htmlEscape(planSummary.worldPlans[0] ? planSummary.worldPlans[0].desc : '暂无')}</span></div>
          <div class="simple-row"><b>个人待办</b><span>${htmlEscape(planSummary.personalPlans[0] ? planSummary.personalPlans[0].desc : '暂无')}</span></div>
          `; })()}
        </div>
      `; });
      document.querySelectorAll('[data-preview="试炼与情报"].terminal-side-card, [data-preview="试炼与情报"].mvu-simple-card, [data-preview="试炼与情报"].simple-card').forEach(el => { el.innerHTML = `
        <div class="simple-head"><div class="simple-title">试炼与情报</div></div>
        <div class="simple-list">
          <div class="simple-row"><b>试炼入口</b><span>${htmlEscape(snapshot.inventoryEntries.some(([name]) => /门票|魂灵塔/.test(name)) ? '升灵台 / 魂灵塔 / 狩猎' : '当前无门票，仅常规狩猎')}</span></div>
          <div class="simple-row"><b>情报状态</b><span>${htmlEscape(`已掌握 ${snapshot.unlockedKnowledges.length} 条 / 新线索 ${snapshot.pendingIntelCount} 条`)}</span></div>
          <div class="simple-row"><b>深渊击杀</b><span>${htmlEscape(toText(deepGet(snapshot, 'activeChar.abyss_kill_request.kill_tier', '无'), '无') !== '无' ? `${toText(deepGet(snapshot, 'activeChar.abyss_kill_request.kill_tier', '无'), '无')} × ${toNumber(deepGet(snapshot, 'activeChar.abyss_kill_request.quantity', 1), 1)}` : '暂无待结算')}</span></div>
        </div>
      `; });
      document.querySelectorAll('[data-preview="近期见闻"].terminal-side-card, [data-preview="近期见闻"].mvu-simple-card, [data-preview="近期见闻"].simple-card').forEach(el => { el.innerHTML = `
        <div class="simple-head"><div class="simple-title">近期见闻</div></div>
        <div class="simple-list">
          ${(() => { const newsSummary = buildRecentNewsSummary(snapshot, { seqLimit: 1, intelLimit: 1 }); return `
          <div class="simple-row"><b>全局见闻</b><span>${htmlEscape(newsSummary.globalNews[0] ? newsSummary.globalNews[0].desc : '暂无')}</span></div>
          <div class="simple-row"><b>个人见闻</b><span>${htmlEscape(newsSummary.personalNews[0] ? newsSummary.personalNews[0].desc : '暂无')}</span></div>
          `; })()}
        </div>
      `; });
      document.querySelectorAll('[data-preview="怪物图鉴"].terminal-side-card, [data-preview="怪物图鉴"].mvu-simple-card, [data-preview="怪物图鉴"].simple-card').forEach(el => { el.innerHTML = `
        <div class="simple-head"><div class="simple-title">怪物图鉴</div></div>
        <div class="simple-list">
          <div class="simple-row"><b>已记录</b><span>${htmlEscape(`${snapshot.bestiaryEntries.length} 种`)}</span></div>
          <div class="simple-row"><b>最近条目</b><span>${htmlEscape(snapshot.bestiaryEntries.slice(0, 2).map(([name]) => name).join(' / ') || '暂无')}</span></div>
          <div class="simple-row"><b>图鉴状态</b><span>${htmlEscape(snapshot.bestiaryEntries.length ? '探索推进中' : '等待首次遭遇')}</span></div>
        </div>
      `; });
      document.querySelectorAll('[data-preview="任务界面"].terminal-side-card, [data-preview="任务界面"].mvu-simple-card, [data-preview="任务界面"].simple-card').forEach(el => {
        const quest = deepGet(snapshot, 'activeChar.quest_request', {});
        el.innerHTML = `
          <div class="simple-head"><div class="simple-title">任务界面</div></div>
          <div class="simple-list">
            <div class="simple-row"><b>当前任务</b><span>${htmlEscape(toText(quest.quest_name, '无') !== '无' ? toText(quest.quest_name, '未接取') : '未接取')}</span></div>
            <div class="simple-row"><b>奖励摘要</b><span>${htmlEscape(toText(quest.action, '无') !== '无' ? `金币 ${formatNumber(quest.reward_coin)} / 声望 ${formatNumber(quest.reward_rep)}` : '暂无任务')}</span></div>
            <div class="simple-row"><b>推进进度</b><span>${htmlEscape(toText(quest.action, '无') !== '无' ? `+${toNumber(quest.progress_add, 0)} / 需 ${toNumber(quest.required_count, 1)}` : '暂无进度')}</span></div>
          </div>
        `;
      });
    }

    function buildLiveArchiveModal(previewKey) {
      if (!liveSnapshot) return null;
      const snapshot = liveSnapshot;
      const stat = deepGet(snapshot, 'activeChar.stat', {});
      const social = deepGet(snapshot, 'activeChar.social', {});
      const status = deepGet(snapshot, 'activeChar.status', {});
      const wealth = deepGet(snapshot, 'activeChar.wealth', {});
      const clothing = deepGet(snapshot, 'activeChar.clothing', {});
      const wardrobeEntries = safeEntries(deepGet(snapshot, 'activeChar.clothing.wardrobe', {}));
      const armor = deepGet(snapshot, 'activeChar.equip.armor', {});
      const mech = deepGet(snapshot, 'activeChar.equip.mech', {});
      const jobs = safeEntries(deepGet(snapshot, 'activeChar.job', {}));

      if (previewKey === '全息星图主画布') {
        const mapItems = buildDisplayMapItems(snapshot);
        const patchCards = (snapshot.mapActivePatchEntries.length ? snapshot.mapActivePatchEntries : [['暂无激活补丁', { empty: true }]]).map(([name, patch]) => ({
          title: patch && patch.empty ? name : name,
          desc: patch && patch.empty ? '当前地图无激活补丁。' : `当前存在激活补丁 ｜ 区域 ${toText(deepGet(patch, 'bounds.x', 0), 0)},${toText(deepGet(patch, 'bounds.y', 0), 0)}`
        }));
        const childMapCards = (safeEntries(snapshot.mapAvailableChildMaps).length ? safeEntries(snapshot.mapAvailableChildMaps) : [['暂无子图入口', '无']]).map(([name, mapId]) => ({
          title: name,
          desc: mapId === '无' ? '当前地图暂无可进入子图。' : '可进入对应子图'
        }));
        return {
          title: `全息星图 / ${getMapDisplayName(snapshot)}`,
          summary: '读取地图数据后的当前地图总览、节点分布与补丁状态。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">地图总览</div></div>
                ${makeTileGrid([
                  { label: '当前地图', value: getMapDisplayName(snapshot) },
                  { label: '焦点位置', value: toText(deepGet(snapshot, 'mapCurrentFocus.loc', snapshot.currentLoc), snapshot.currentLoc) },
                  { label: '可见节点', value: `${mapItems.length} 个` },
                  { label: '可见主城', value: `${snapshot.mapVisibleSettlementEntries.length} 个` },
                  { label: '动态地点', value: `${snapshot.mapVisibleDynamicEntries.length} 个` },
                  { label: '激活补丁', value: `${snapshot.mapActivePatchEntries.length} 项` }
                ], 'three')}
              </div>
              <div class="archive-card"><div class="archive-card-head"><div class="archive-card-title">当前节点云图</div></div>${makeTagCloud(mapItems.slice(0, 10).map(item => ({ text: `${item.name}${item.canEnter ? ' ↘' : ''}`, className: item.current ? 'live' : (item.canEnter ? 'warn' : '') })))}</div>
              <div class="archive-card"><div class="archive-card-head"><div class="archive-card-title">可进入子图</div></div>${makeTimelineStack(childMapCards)}</div>
              <div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">激活补丁</div></div>${makeTimelineStack(patchCards)}</div>
            </div>
          `
        };
      }

      if (previewKey === '角色切换器') {
        const playerName = toText(deepGet(snapshot, 'sd.sys.player_name', ''), '');
        const charEntries = sortCharacterEntries(safeEntries(deepGet(snapshot, 'sd.char', {})), { playerName, currentName: snapshot.activeName });
        const switchCards = charEntries.length
          ? charEntries.map(([name, char]) => {
              const isCurrent = name === snapshot.activeName;
              const isPlayer = isPlayerCharacterEntry(name, char, playerName);
              const lvText = `Lv.${toText(deepGet(char, 'stat.lv', 0), '0')}`;
              const identityText = toText(deepGet(char, 'social.main_identity', deepGet(char, 'base.identity', '无')), '无');
              const locText = toText(deepGet(char, 'status.loc', '未知地点'), '未知地点');
              const actionText = toText(deepGet(char, 'status.action', '日常'), '日常');
              const searchText = [
                name,
                isPlayer ? '玩家' : '角色',
                identityText,
                locText,
                actionText,
                isTangWulinCharacter(name) ? '唐舞麟' : ''
              ].filter(Boolean).join(' ').toLowerCase();
              return `
                <button type="button" class="role-switch-tile${isCurrent ? ' active' : ''}" data-mvu-switch-char="${escapeHtmlAttr(name)}" data-switch-search="${escapeHtmlAttr(searchText)}">
                  <div class="role-switch-head"><b>${htmlEscape(name)}</b><span class="state-tag ${isCurrent ? 'live' : (isPlayer ? 'warn' : '')}">${isCurrent ? '当前查看' : (isPlayer ? '玩家' : '角色')}</span></div>
                  <div class="role-switch-meta">${htmlEscape(`${lvText} ｜ ${identityText}`)}</div>
                  <div class="role-switch-meta">${htmlEscape(`${locText} ｜ ${actionText}`)}</div>
                </button>
              `;
            }).join('')
          : '<div class="role-switch-empty">暂无可切换角色。</div>';
        return {
          title: '角色浏览 / 切换弹窗',
          summary: '查看全部角色摘要，并切换当前查看角色。',
          onMount: mountEl => {
            const inputEl = mountEl.querySelector('.role-switch-search-input');
            const countEl = mountEl.querySelector('.role-switch-search-count');
            const prevBtn = mountEl.querySelector('[data-role-page-nav="prev"]');
            const nextBtn = mountEl.querySelector('[data-role-page-nav="next"]');
            const pageIndicatorEl = mountEl.querySelector('.role-switch-page-indicator');
            const tileEls = Array.from(mountEl.querySelectorAll('.role-switch-tile'));
            let currentPage = 1;
            const pageSize = 50;
            const applyFilter = () => {
              const keyword = toText(inputEl && inputEl.value, '').trim().toLowerCase();
              const matchedTiles = [];
              tileEls.forEach(tile => {
                const haystack = toText(tile.getAttribute('data-switch-search'), '').toLowerCase();
                const matched = !keyword || haystack.includes(keyword);
                if (matched) matchedTiles.push(tile);
                tile.style.display = 'none';
              });
              const totalPages = Math.max(1, Math.ceil(matchedTiles.length / pageSize));
              currentPage = Math.max(1, Math.min(totalPages, currentPage));
              const start = (currentPage - 1) * pageSize;
              matchedTiles.slice(start, start + pageSize).forEach(tile => { tile.style.display = ''; });
              if (countEl) {
                countEl.textContent = keyword ? `匹配 ${matchedTiles.length} / ${tileEls.length} 名` : `共 ${tileEls.length} 名`;
              }
              if (pageIndicatorEl) pageIndicatorEl.textContent = `第 ${currentPage} / ${totalPages} 页`;
              if (prevBtn) prevBtn.disabled = currentPage <= 1;
              if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
            };
            if (inputEl) {
              inputEl.addEventListener('input', () => { currentPage = 1; applyFilter(); });
              setTimeout(() => {
                try { inputEl.focus(); } catch (_) {}
              }, 0);
            }
            if (prevBtn) prevBtn.addEventListener('click', () => { currentPage = Math.max(1, currentPage - 1); applyFilter(); });
            if (nextBtn) nextBtn.addEventListener('click', () => { currentPage += 1; applyFilter(); });
            applyFilter();
            return {
              destroy() {
                if (inputEl) inputEl.removeEventListener('input', applyFilter);
              }
            };
          },
          body: `
            <div class="archive-modal-grid" style="grid-template-columns:1fr;">
              <div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">查看状态</div></div>${makeTileGrid([{ label: '当前查看', value: snapshot.activeName }, { label: '玩家角色', value: playerName || snapshot.activeName }, { label: '角色总数', value: `${charEntries.length} 名` }, { label: '当前地点', value: snapshot.currentLoc }], 'two')}</div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">角色列表</div></div>
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 12px;">
                  <input type="search" class="role-switch-search-input" placeholder="搜索角色 / 身份 / 地点 / 状态" style="flex:1 1 240px;min-width:220px;height:36px;padding:0 12px;border-radius:10px;border:1px solid rgba(120,220,255,0.24);background:rgba(8,20,30,0.72);color:#dff7ff;outline:none;" />
                  <span class="role-switch-search-count" style="font-size:12px;color:rgba(220,245,255,0.72);">共 ${charEntries.length} 名</span>
                </div>
                <div class="role-switch-grid">${switchCards}</div>
                <div class="tag-cloud armory-quick-actions" style="margin-top:12px;justify-content:flex-end;">
                  <button type="button" class="tag-chip role-switch-page-btn" data-role-page-nav="prev">上一页</button>
                  <span class="tag-chip role-switch-page-indicator">第 1 / 1 页</span>
                  <button type="button" class="tag-chip role-switch-page-btn" data-role-page-nav="next">下一页</button>
                </div>
              </div>
            </div>
          `
        };
      }


      if (previewKey === '生命图谱详细页') {
        return {
          title: '生命图谱',
          summary: '基于当前角色的实时生命体征与状态摘要。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">战斗轮廓</div></div>
                ${(() => {
                  const lv = toNumber(stat.lv, 1);
                  const divisor = Math.max(1000, lv * lv * 100); // 动态基准线，确保雷达图撑满但不过爆
                  const fStr = toNumber(deepGet(snapshot, 'activeChar.stat.final.str', stat.str), 0);
                  const fDef = toNumber(deepGet(snapshot, 'activeChar.stat.final.def', stat.def), 0);
                  const fAgi = toNumber(deepGet(snapshot, 'activeChar.stat.final.agi', stat.agi), 0);
                  const fMen = toNumber(deepGet(snapshot, 'activeChar.stat.final.men_max', stat.men_max), 0);
                  const fVit = toNumber(deepGet(snapshot, 'activeChar.stat.final.vit_max', stat.vit_max), 0);
                  return makeRadarSvg(['力量', '防御', '敏捷', '精神', '气血底盘'], [
                    Math.min(100, Math.round(fStr / divisor * 100)),
                    Math.min(100, Math.round(fDef / divisor * 100)),
                    Math.min(100, Math.round(fAgi / divisor * 100)),
                    Math.min(100, Math.round(fMen / (divisor * 0.5) * 100)),
                    Math.min(100, Math.round(fVit / divisor * 100))
                  ], [formatNumber(fStr), formatNumber(fDef), formatNumber(fAgi), formatNumber(fMen), formatNumber(fVit)]);
                })()}
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">角色名片</div></div>
                <div class="profile-snapshot">
                  <div class="identity-card">
                    <h3>${htmlEscape(snapshot.activeName)}</h3>
                    <div class="identity-meta-grid">
                      <div class="meta-item"><b>年龄 / 性别</b><span>${htmlEscape(`${toText(stat.age, '0')}岁 / ${toText(stat.gender, '未知')}`)}</span></div>
                      <div class="meta-item"><b>外貌</b><span>${htmlEscape(snapshot.appearanceText)}</span></div>
                      <div class="meta-item"><b>等级</b><span>${htmlEscape(`Lv.${toText(stat.lv, '0')}`)}</span></div>
                      <div class="meta-item"><b>性格</b><span>${htmlEscape(snapshot.personalityText)}</span></div>
                      <div class="meta-item"><b>系别</b><span>${htmlEscape(toText(stat.type, '未知'))}</span></div>
                      <div class="meta-item"><b>天赋梯队</b><span>${htmlEscape(toText(stat.talent_tier, '未定'))}</span></div>
                      <div class="meta-item"><b>精神境界</b><span>${htmlEscape(toText(stat.men_realm, '灵元境'))}</span></div>
                      <div class="meta-item"><b>名望</b><span>${htmlEscape(`${toText(social.fame_level, '籍籍无名')} / ${formatNumber(social.reputation)}`)}</span></div>
                    </div>
                  </div>
                  <div class="status-card">
                    <h4 style="margin:0 0 6px;font-size:13px;font-family:var(--font-title);color:var(--white);">当前状态</h4>
                    <div class="status-list">
                      <div class="status-row"><b>行动状态</b><span>${htmlEscape(toText(status.action, '日常'))}</span></div>
                      <div class="status-row"><b>伤势</b><span>${htmlEscape(toText(status.wound, '无伤'))}</span></div>
                      <div class="status-row"><b>当前领域</b><span>${htmlEscape(toText(status.active_domain, '无'))}</span></div>
                      <div class="status-row"><b>魂核状态</b><span>${htmlEscape(`${toText(deepGet(snapshot, 'activeChar.energy.core.数量', 0), '0')} 枚 / 进度 ${toText(deepGet(snapshot, 'activeChar.energy.core.progress', 0), '0')}%`)}</span></div>
                      <div class="status-row"><b>血脉状态</b><span>${htmlEscape(`${toText(deepGet(snapshot, 'activeChar.bloodline_power.bloodline', '无'), '无')} / ${toText(deepGet(snapshot, 'activeChar.bloodline_power.seal_lv', 0), '0')}层`)}</span></div>
                      <div class="status-row"><b>灵物吸收</b><span>${htmlEscape(toNumber(status.consuming_herb_age, 0) > 0 ? `${formatNumber(toNumber(status.consuming_herb_age, 0))} 年` : '当前无吸收') }</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">功法与额外特长</div></div>
                ${makeTimelineStack(snapshot.extraSkills && snapshot.extraSkills.length ? snapshot.extraSkills.map(skill => ({
                  title: `${skill.category} - ${skill.name}`,
                  desc: `${skill.level} | ${skill.desc}`
                })) : [{ title: '暂无额外能力', desc: '该角色当前未习得特殊功法或掌握额外特长。' }])}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '社会档案详细页') {
        return {
          title: '社会档案弹窗',
          summary: '当前角色的公开身份、名望、头衔与社会可见度摘要。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">身份名片</div></div>
                <div class="profile-snapshot">
                  <div class="identity-card">
                    <h3>${htmlEscape(snapshot.activeName)}</h3>
                    <div class="identity-meta-grid">
                      <div class="meta-item"><b>当前身份</b><span>${htmlEscape(toText(social.main_identity, '无'))}</span></div>
                      <div class="meta-item"><b>名望层级</b><span>${htmlEscape(toText(social.fame_level, '籍籍无名'))}</span></div>
                      <div class="meta-item"><b>公开情报</b><span>${htmlEscape(snapshot.publicIntel ? '已公开' : '未公开')}</span></div>
                      <div class="meta-item"><b>主要圈层</b><span>${htmlEscape(snapshot.factions.map(([name]) => name).join(' / ') || '暂无')}</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">社会标签</div></div>
                ${makeTagCloud([
                  { text: snapshot.activeName, className: 'live' },
                  { text: toText(social.fame_level, '籍籍无名'), className: 'warn' },
                  { text: toText(social.main_identity, '无') },
                  { text: social.public_intel ? '公开情报' : '私密档案' },
                  { text: `称号 ${snapshot.recentTitles.length}` }
                ])}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">公开情报状态</div></div>
                ${makeTileGrid([
                  { label: '当前公开度', value: snapshot.publicIntel ? '已公开' : '未公开' },
                  { label: '公开判定', value: social.public_intel ? '达到公开阈值' : '仍属私密档案' },
                  { label: '声望阈值参考', value: '5000' },
                  { label: '当前声望', value: formatNumber(social.reputation) }
                ], 'two')}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">当前社会位置</div></div>
                ${makeTileGrid([
                  { label: '主公开身份', value: toText(social.main_identity, '无') },
                  { label: '名望等级', value: toText(social.fame_level, '籍籍无名') },
                  { label: '当前声望', value: formatNumber(social.reputation) },
                  { label: '公开度', value: snapshot.publicIntel ? '公开' : '未公开' },
                  { label: '阵营关联', value: snapshot.factions.map(([name]) => name).join(' / ') || '无' },
                  { label: '当前称号', value: snapshot.recentTitles[0] || '暂无' },
                  { label: '头衔数量', value: String(snapshot.titleEntries.length) },
                  { label: '主阵营身份', value: snapshot.primaryFaction ? `${snapshot.primaryFaction[0]} / ${toText(deepGet(snapshot.primaryFaction[1], '身份', '无'), '无')}` : '无' }
                ])}
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">当前着装</div></div>
                ${makeTileGrid([
                  { label: '当前套装', value: toText(clothing.outfit, '无') },
                  { label: '衣柜套数', value: String(wardrobeEntries.length) },
                  { label: '上装', value: toText(deepGet(clothing, ['wardrobe', clothing.outfit, '上装'], '无'), '无') },
                  { label: '下装', value: toText(deepGet(clothing, ['wardrobe', clothing.outfit, '下装'], '无'), '无') },
                  { label: '鞋子', value: toText(deepGet(clothing, ['wardrobe', clothing.outfit, '鞋子'], '无'), '无') },
                  { label: '套装描述', value: toText(deepGet(clothing, ['wardrobe', clothing.outfit, '描述'], '暂无描述'), '暂无描述') }
                ], 'two')}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">衣柜收纳</div></div>
                ${makeTimelineStack(wardrobeEntries.length ? wardrobeEntries.map(([name, item]) => ({ title: name, desc: `${toText(item && item['上装'], '无')} / ${toText(item && item['下装'], '无')} / ${toText(item && item['鞋子'], '无')} ｜ ${toText(item && item['描述'], '暂无描述')}` })) : [{ title: '暂无衣柜记录', desc: '当前角色尚未记录可切换套装。' }])}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '所属势力详细页') {
        return {
          title: '阵营身份弹窗',
          summary: '当前角色已加入势力与当前阵营位置摘要。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">所属阶梯</div></div>
                ${makeFactionLadder((snapshot.factions.length ? snapshot.factions : [['未加入势力', { 身份: '无', 权限级: 0 }]]).map(([name, info]) => ({
                  name,
                  desc: `身份：${toText(info && info['身份'], '无')} / 权限级：${toText(info && info['权限级'], '0')}`,
                  className: 'highlight'
                })))}
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">当前阵营位置</div></div>
                ${makeTileGrid([
                  { label: '当前所属', value: snapshot.factions[0] ? snapshot.factions[0][0] : '无' },
                  { label: '身份', value: snapshot.factions[0] ? toText(deepGet(snapshot.factions[0][1], '身份', '无'), '无') : '未加入' },
                  { label: '权限级', value: snapshot.factions[0] ? toText(deepGet(snapshot.factions[0][1], '权限级', 0), '0') : '0' },
                  { label: '主要绑定', value: snapshot.factions.map(([name]) => name).join(' / ') || '暂无' }
                ], 'two')}
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">阵营现实摘要</div></div>
                ${makeTagCloud([
                  { text: snapshot.factions[0] ? snapshot.factions[0][0] : '未加入势力', className: 'warn' },
                  { text: snapshot.factions[0] ? toText(deepGet(snapshot.factions[0][1], '身份', '无'), '无') : '无身份' },
                  { text: snapshot.orgEntries[0] ? snapshot.orgEntries[0][0] : '暂无主势力' },
                  { text: snapshot.currentLoc || '位置未知' }
                ])}
              </div>
            </div>
          `
        };
      }


      if (previewKey === '人物关系详细页') {
        const relationPositions = [
          { left: 20, top: 25, className: '' },
          { left: 50, top: 18, className: 'gold' },
          { left: 82, top: 25, className: '' },
          { left: 25, top: 75, className: 'warn hover-up' },
          { left: 75, top: 75, className: 'hover-up' }
        ];
        const relationNodes = snapshot.relations.slice(0, 5);
        const relationLinks = relationPositions.slice(0, relationNodes.length).map((pos, index) => {
          const lineClass = index === 1 ? 'gold' : index === 3 ? 'alert' : 'cyan';
          return `<line class="topology-link ${lineClass}" x1="50" y1="50" x2="${pos.left}" y2="${pos.top}"></line>`;
        }).join('');
        const relationHtml = relationNodes.map(([name, rel], index) => {
          const pos = relationPositions[index];
          const favor = toNumber(rel && rel['好感度'], 0);
          return `
            <div class="topology-node interactive-ring ${pos.className}" style="left:${pos.left}%;top:${pos.top}%">
              <b>${htmlEscape(name)}</b><span>${htmlEscape(toText(rel && rel['关系'], '陌生'))}</span>
              <div class="relation-hover-card">
                <span class="relation-hover-title">${htmlEscape(name)}</span>
                <span class="relation-hover-desc">${htmlEscape(`${toText(rel && rel['关系'], '陌生')} / ${toText(rel && rel['relation_route'], '朋友线')}`)}</span>
                <div class="relation-hover-tags">
                  <span class="relation-hover-chip">${htmlEscape(`好感 ${favor}`)}</span>
                  <span class="relation-hover-chip">${htmlEscape(toText(rel && rel['npc_job'], '未知身份'))}</span>
                </div>
                <div class="relation-hover-skill">
                  <span>${htmlEscape(toText(rel && rel['favor_buff'], '暂无额外关系加成说明'))}</span>
                  <span>${htmlEscape(toText(rel && rel['progress_note'], '暂无推进提示'))}</span>
                  <span>${htmlEscape(`下一阶段：${toText(rel && rel['next_stage'], '无')} / ${toNumber(rel && rel['next_stage_threshold'], 0)}`)}</span>
                  <span>${htmlEscape(`最近互动：${toText(rel && rel['last_interact_action'], '无')} / ${toNumber(rel && rel['recent_favor_delta'], 0)}`)}</span>
                  <span>${htmlEscape(`当前加成：${toText(rel && rel['current_relation_bonus'], toText(rel && rel['favor_buff'], '无'))}`)}</span>
                  <span>${htmlEscape(`下一解锁：${toText(rel && rel['next_unlock_bonus'], '无')}`)}</span>
                  <span>${htmlEscape(`关系状态：${toText(rel && rel['availability'], '未知')} / ${toText(rel && rel['route_lock_reason'], '无')}`)}</span>
                </div>
                <div class="energy-stack">
                  <div class="energy-row-block">
                    <div class="energy-headline"><b>好感度</b><span>${htmlEscape(`${favor} / ${toText(rel && rel['关系'], '陌生')}`)}</span></div>
                    <div class="energy-track"><div class="energy-fill ${favor >= 80 ? 'red' : favor >= 50 ? 'gold' : 'cyan'}" style="width:${Math.max(5, Math.min(100, favor))}%"></div></div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');

        const relationFocusTargets = Array.isArray(deepGet(snapshot, 'relationAnalysis.top_targets', []))
          ? deepGet(snapshot, 'relationAnalysis.top_targets', [])
          : [];
        const relationFocusHtml = (relationFocusTargets.length
          ? relationFocusTargets.slice(0, 2).map(item => {
              const targetName = toText(item && item.target, '未知对象');
              const detailEntry = snapshot.relations.find(([entryName]) => entryName === targetName);
              const detail = detailEntry && detailEntry[1];
              return `
                <div class="intel-card">
                  <b>${htmlEscape(`${targetName} / ${toText(item && item.relation, '陌生')}`)}</b>
                  <span>${htmlEscape(`${toText(item && item.reason, '暂无推进建议')} ｜ 建议：${toText(item && item.recommended_action, '继续观察')}`)}</span>
                  <span>${htmlEscape(`下一阶段：${toText(detail && detail['next_stage'], '无')} / ${toNumber(detail && detail['next_stage_threshold'], 0)}`)}</span>
                  <span>${htmlEscape(`最近互动：${toText(detail && detail['last_interact_action'], '无')} / ${toNumber(detail && detail['recent_favor_delta'], 0)}`)}</span>
                </div>
              `;
            }).join('')
          : snapshot.relations.slice(0, 2).map(([name, rel]) => `
              <div class="intel-card">
                <b>${htmlEscape(`${name} / ${toText(rel && rel['关系'], '陌生')}`)}</b>
                <span>${htmlEscape(`路线：${toText(rel && rel['relation_route'], '朋友线')} / 好感：${toText(rel && rel['好感度'], 0)}`)}</span>
                <span>${htmlEscape(`下一阶段：${toText(rel && rel['next_stage'], '无')} / ${toNumber(rel && rel['next_stage_threshold'], 0)}`)}</span>
                <span>${htmlEscape(`最近互动：${toText(rel && rel['last_interact_action'], '无')} / ${toNumber(rel && rel['recent_favor_delta'], 0)}`)}</span>
              </div>
            `).join('')) || '<div class="intel-card"><b>暂无关系线</b><span>关系线索仍在铺陈。</span></div>';

        const relationDetailName = toText(deepGet(snapshot, 'relationAnalysis.focus_target', deepGet(relationFocusTargets, '0.target', '')), '');
        const relationDetailEntry = relationDetailName ? snapshot.relations.find(([entryName]) => entryName === relationDetailName) : null;
        const relationDetail = relationDetailEntry && relationDetailEntry[1];
        const relationDetailHtml = relationDetail
          ? [
              { title: '焦点对象', value: relationDetailName },
              { title: '推进提示', value: toText(relationDetail && relationDetail['progress_note'], '暂无') },
              { title: '下一阶段', value: `${toText(relationDetail && relationDetail['next_stage'], '无')} / ${toNumber(relationDetail && relationDetail['next_stage_threshold'], 0)}` },
              { title: '最近互动', value: `${toText(relationDetail && relationDetail['last_interact_action'], '无')} / ${toNumber(relationDetail && relationDetail['recent_favor_delta'], 0)}` },
              { title: '当前加成', value: toText(relationDetail && relationDetail['current_relation_bonus'], '无') },
              { title: '下一解锁', value: toText(relationDetail && relationDetail['next_unlock_bonus'], '无') }
            ].map(item => `<div class="intel-card"><b>${htmlEscape(item.title)}</b><span>${htmlEscape(item.value)}</span></div>`).join('')
          : '<div class="intel-card"><b>关系细节</b><span>当前暂无可展开的关系焦点。</span></div>';

        const relationContextHtml = [
          { title: '当前在场', value: ((Array.isArray(deepGet(snapshot, 'relationAnalysis.same_location_targets', [])) ? deepGet(snapshot, 'relationAnalysis.same_location_targets', []) : []).slice(0, 4).join(' / ')) || '暂无' },
          { title: '可接触对象', value: ((Array.isArray(deepGet(snapshot, 'relationAnalysis.contactable_targets', [])) ? deepGet(snapshot, 'relationAnalysis.contactable_targets', []) : []).slice(0, 4).join(' / ')) || '暂无' },
          { title: '风险对象', value: ((Array.isArray(deepGet(snapshot, 'relationAnalysis.risk_targets', [])) ? deepGet(snapshot, 'relationAnalysis.risk_targets', []) : []).slice(0, 3).join(' / ')) || '暂无' },
          { title: '阻塞对象', value: ((Array.isArray(deepGet(snapshot, 'relationAnalysis.blocked_targets', [])) ? deepGet(snapshot, 'relationAnalysis.blocked_targets', []) : []).slice(0, 2).map(item => `${toText(item && item.target, '未知')}:${toText(item && item.reason, '无')}`).join(' / ')) || '暂无' }
        ].map(item => `<div class="intel-card"><b>${htmlEscape(item.title)}</b><span>${htmlEscape(item.value)}</span></div>`).join('');

        return {
          title: '人物关系弹窗',
          summary: '当前角色关系网络、分析结论与核心推进线索。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">羁绊星轨图</div></div>
                <div class="topology-board" style="min-height: 280px;">
                  <svg class="topology-svg" viewBox="0 0 100 100" preserveAspectRatio="none">${relationLinks}</svg>
                  <div class="topology-node center" style="left:50%;top:50%"><b>${htmlEscape(snapshot.activeName)}</b><span>自我</span></div>
                  ${relationHtml || '<div class="topology-node" style="left:50%;top:18%"><b>暂无关系对象</b><span>关系网络尚未展开</span></div>'}
                </div>
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">核心推进线索</div></div>
                <div class="intel-layout">
                  ${relationFocusHtml}
                </div>
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">关系态势</div></div>
                <div class="intel-layout">
                  <div class="intel-card"><b>分析摘要</b><span>${htmlEscape(toText(deepGet(snapshot, 'relationAnalysis.summary', '当前尚未积累足够的人物关系数据。'), '当前尚未积累足够的人物关系数据。'))}</span></div>
                  <div class="intel-card"><b>分析焦点</b><span>${htmlEscape(toText(deepGet(snapshot, 'relationAnalysis.focus_target', '无'), '无'))}</span></div>
                  <div class="intel-card"><b>推荐动作</b><span>${htmlEscape((Array.isArray(deepGet(snapshot, 'relationAnalysis.recommended_actions', [])) ? deepGet(snapshot, 'relationAnalysis.recommended_actions', []) : []).slice(0, 3).join(' / ') || '暂无')}</span></div>
                  <div class="intel-card"><b>恋爱候选</b><span>${htmlEscape((Array.isArray(deepGet(snapshot, 'relationAnalysis.romance_candidates', [])) ? deepGet(snapshot, 'relationAnalysis.romance_candidates', []) : []).slice(0, 3).join(' / ') || '暂无')}</span></div>
                  <div class="intel-card"><b>信任对象</b><span>${htmlEscape((Array.isArray(deepGet(snapshot, 'relationAnalysis.trust_targets', [])) ? deepGet(snapshot, 'relationAnalysis.trust_targets', []) : []).slice(0, 3).join(' / ') || '暂无')}</span></div>
                  <div class="intel-card"><b>风险对象</b><span>${htmlEscape((Array.isArray(deepGet(snapshot, 'relationAnalysis.risk_targets', [])) ? deepGet(snapshot, 'relationAnalysis.risk_targets', []) : []).slice(0, 3).join(' / ') || '暂无')}</span></div>
                </div>
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">关系场景分析</div></div>
                <div class="intel-layout">
                  ${relationContextHtml}
                </div>
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">关系细节</div></div>
                <div class="intel-layout">
                  ${relationDetailHtml}
                </div>
              </div>
            </div>
          `
        };
      }


      if (previewKey === '情报库详细页') {
        const intelNodes = [toText(deepGet(snapshot, 'activeChar.knowledge_unlock_request.content', '无'), '无'), ...snapshot.unlockedKnowledges.slice(-4).reverse()].filter(item => item && item !== '无');
        const coreIntel = intelNodes[0] || '暂无核心情报';
        const sideIntels = intelNodes.slice(1, 5);
        const positions = [
          { left: '20%', top: '30%' },
          { left: '80%', top: '30%' },
          { left: '30%', top: '80%' },
          { left: '70%', top: '80%' }
        ];
        const combatHistoryCards = (snapshot.combatHistoryEntries.length ? snapshot.combatHistoryEntries.slice(0, 6) : [['暂无战斗记录', { empty: true }]]).map(([name, info]) => ({
          title: info && info.empty ? name : `${name} / ${toText(info && info.count, 0)}次`,
          desc: info && info.empty ? '暂无战斗记录。' : `最近 Tick ${toText(info && info.last_tick, 0)}`
        }));
        return {
          title: '情报库弹窗',
          summary: '当前已解锁情报、待整理线索与战斗记录摘要。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">核心情报网络</div></div>
                <div class="intel-network-board">
                  <svg class="topology-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    ${positions.slice(0, sideIntels.length).map(pos => `<line class="topology-link cyan" x1="50" y1="50" x2="${pos.left.replace('%', '')}" y2="${pos.top.replace('%', '')}"></line>`).join('')}
                  </svg>
                  <div class="intel-node core" style="left:50%; top:50%;">
                    <div class="intel-node-icon">情</div>
                    <div class="intel-node-label">${htmlEscape(coreIntel)}</div>
                  </div>
                  ${sideIntels.map((item, index) => `<div class="intel-node ${index >= snapshot.unlockedKnowledges.length ? 'locked' : ''}" style="left:${positions[index].left}; top:${positions[index].top};"><div class="intel-node-icon">${index < 2 ? '线' : '?'}</div><div class="intel-node-label">${htmlEscape(item)}</div></div>`).join('')}
                </div>
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">情报进度槽</div></div>
                <div class="intel-progress-slots">
                  <div class="intel-slot"><div class="intel-slot-name">已解锁情报</div><div class="intel-slot-bar-wrap"><div class="intel-slot-bar" style="width:${Math.min(100, snapshot.unlockedKnowledges.length * 12)}%;"></div></div><div class="intel-slot-value">${snapshot.unlockedKnowledges.length}</div></div>
                  <div class="intel-slot"><div class="intel-slot-name">待整理情报</div><div class="intel-slot-bar-wrap"><div class="intel-slot-bar gold" style="width:${snapshot.pendingIntelCount ? 100 : 0}%;"></div></div><div class="intel-slot-value" style="color:var(--gold);">${snapshot.pendingIntelCount ? `${snapshot.pendingIntelCount} / +${snapshot.pendingIntelImpact}` : '0'}</div></div>
                  <div class="intel-slot"><div class="intel-slot-name">任务记录</div><div class="intel-slot-bar-wrap"><div class="intel-slot-bar" style="width:${Math.min(100, snapshot.questRecordCount * 20)}%; background:var(--red); box-shadow:0 0 8px var(--red);"></div></div><div class="intel-slot-value" style="color:var(--red);">${snapshot.questRecordCount}</div></div>
                </div>
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">战斗记录摘要</div></div>
                ${makeTimelineStack(combatHistoryCards)}
              </div>
            </div>
          `
        };
      }




      if (
        previewKey === '武装工坊详细页'
        || previewKey === '武装详情：斗铠'
        || previewKey === '武装详情：机甲'
        || previewKey === '武装详情：主武器'
        || previewKey === '武装详情：附件'
        || String(previewKey || '').startsWith('斗铠部件：')
      ) {
        const armor = deepGet(snapshot, 'activeChar.equip.armor', {});
        const mech = deepGet(snapshot, 'activeChar.equip.mech', {});
        const weapon = deepGet(snapshot, 'activeChar.equip.wpn', {});
        const accessories = deepGet(snapshot, 'activeChar.equip.accessories', {});
        const accessoryEntries = listAccessoryEntries(accessories);
        const jobs = safeEntries(deepGet(snapshot, 'activeChar.job', {}));
        const isPlayerControlled = isSnapshotPlayerControlled(snapshot);
        const armorSummary = toNumber(armor.lv, 0) > 0 ? `${toText(armor.name, `${armor.lv}字斗铠`)} / ${toText(armor.equip_status, '未装备')}` : '未装备';
        const mechSummary = toText(mech.lv, '无') !== '无' ? `${toText(mech.lv, '无')}·${toText(mech.type, '未定型')} / ${toText(mech.equip_status || mech.status, '未装备')}` : '未部署';
        const weaponSummary = weapon && (weapon.name || weapon['名称']) ? `${toText(weapon.name || weapon['名称'], '无')} / ${toText(weapon.tier || weapon['品阶'], '无品阶')}` : '无';
        const accessorySummary = summarizeAccessoryEntries(accessoryEntries);
        const jobSummary = jobs.length ? jobs.slice(0, 2).map(([name, info]) => `${name} Lv.${toText(info && info.lv, 0)}`).join(' / ') : '未掌握';
        const jobCoreTechSummary = jobs.length ? (Object.keys(deepGet(jobs[0][1], 'core_tech', {})).slice(0, 2).join(' / ') || '暂无核心技术') : '暂无核心技术';
        const jobLimitSummary = jobs.length ? `融锻上限 ${toText(deepGet(jobs[0][1], 'limits.max_fusion', 1), '1')} / 成功率 ${toText(deepGet(jobs[0][1], 'limits.success_rate', 0), '0')}%` : '暂无工坊上限';
        const battleForm = `${toText(deepGet(snapshot, 'activeChar.status.action', '日常'), '日常')} / ${toText(deepGet(snapshot, 'activeChar.status.active_domain', '常态'), '常态')}`;
        const armorExists = toNumber(armor.lv, 0) > 0 || !!toText(armor.name || armor['名称'], '');
        const mechExists = toText(mech.lv, '无') !== '无' || !!toText(mech.name || mech['名称'] || mech.type, '');
        const armorEquipped = toText(armor.equip_status, '未装备') === '已装备';
        const mechEquipped = toText(mech.equip_status, '未装备') === '已装备';
        const armorBonusItems = buildStatsBonusItems(deepGet(armor, 'stats_bonus', {}), { includeLvEquiv: true });
        const mechBonusItems = buildStatsBonusItems(deepGet(mech, 'stats_bonus', {}));
        const weaponBonusItems = buildStatsBonusItems(deepGet(weapon, 'stats_bonus', {}));
        const armorSlotDefs = [
          { x: 50, y: 12, label: '头盔', preview: '斗铠部件：头盔' },
          { x: 50, y: 34, label: '胸铠', preview: '斗铠部件：胸铠' },
          { x: 24, y: 34, label: '左肩', preview: '斗铠部件：左肩' },
          { x: 76, y: 34, label: '右肩', preview: '斗铠部件：右肩' },
          { x: 18, y: 52, label: '左臂', preview: '斗铠部件：左臂' },
          { x: 82, y: 52, label: '右臂', preview: '斗铠部件：右臂' },
          { x: 34, y: 82, label: '左腿', preview: '斗铠部件：左腿' },
          { x: 66, y: 82, label: '右腿', preview: '斗铠部件：右腿' },
          { x: 50, y: 68, label: '战裙', preview: '斗铠部件：战裙' },
          { x: 50, y: 94, label: '战靴', preview: '斗铠部件：战靴' },
          { x: 82, y: 10, label: '戒指', preview: '武装详情：附件' }
        ];
        const armorSlots = armorSlotDefs.map(slot => ({
          ...slot,
          className: slot.label === '戒指'
            ? (accessoryEntries.length ? 'on' : 'off')
            : (() => {
              const partData = resolveArmorPartData(armor, slot.label);
              const partStatus = toText(partData && partData['状态'], '未打造');
              if (!partData || partStatus === '未打造') return 'off';
              if (partStatus === '重创') return 'warn';
              return 'on';
            })()
        }));

        if (previewKey === '武装详情：斗铠') {
          return {
            title: toText(armor.name, '斗铠详情'),
            summary: '',
            body: `
              <div class="equipment-layout">
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">斗铠详情</div></div>
                  ${makeTileGrid([
                    { label: '名称', value: toText(armor.name, '无') },
                    { label: '字级', value: toNumber(armor.lv, 0) > 0 ? `${toNumber(armor.lv, 0)}字斗铠` : '无' },
                    { label: '领域', value: toText(armor.domain, '无') }
                  ])}
                </div>
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">斗铠加成</div></div>
                  ${makeTileGrid(armorBonusItems)}
                </div>
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">斗铠部件</div></div>
                  ${makeInteractiveFigureBoard(toText(armor.name, '斗铠'), armorSlots, { preview: '武装详情：斗铠' })}
                </div>
              </div>
            `
          };
        }

        if (previewKey === '武装详情：机甲') {
          return {
            title: mechExists ? toText(mech.name || mech['名称'] || mech.type, '机甲详情') : '机甲详情',
            summary: '',
            body: `
              <div class="archive-modal-grid">
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">机甲详情</div></div>
                  ${makeTileGrid([
                    { label: '级别', value: toText(mech.lv, '无') },
                    { label: '类型', value: toText(mech.type, '无') },
                    { label: '材质', value: toText(mech.material, '无') },
                    { label: '机体状态', value: toText(mech.status, '完好') },
                    { label: '装备状态', value: toText(mech.equip_status, '未装备') },
                    { label: '机载武器', value: toText(mech.weapon, '无') },
                    { label: '品质系数', value: String(deepGet(mech, '品质系数', 1)) }
                  ])}
                </div>
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">机甲加成</div></div>
                  ${makeTileGrid(mechBonusItems)}
                </div>
              </div>
            `
          };
        }

        if (previewKey === '武装详情：主武器') {
          return {
            title: toText(weapon.name || weapon['名称'], '主武器详情'),
            summary: '',
            body: `
              <div class="archive-modal-grid">
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">主武器详情</div></div>
                  ${makeTileGrid([
                    { label: '名称', value: toText(weapon.name, '无') },
                    { label: '品阶', value: toText(weapon.tier, '无') },
                    { label: '特性数', value: String(Object.keys(deepGet(weapon, 'traits', {})).length) },
                    { label: '主要特性', value: Object.keys(deepGet(weapon, 'traits', {})).slice(0, 2).join(' / ') || '无' }
                  ])}
                </div>
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">武器加成</div></div>
                  ${makeTileGrid(weaponBonusItems)}
                </div>
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">武器特性</div></div>
                  ${makeTimelineStack(safeEntries(deepGet(weapon, 'traits', {})).length ? safeEntries(deepGet(weapon, 'traits', {})).map(([name, item]) => ({ title: name, desc: toText(deepGet(item, '描述', '无'), '无') })) : [{ title: '暂无武器特性', desc: '当前主武器未记录额外特性。' }])}
                </div>
              </div>
            `
          };
        }

        if (previewKey === '武装详情：附件') {
          return {
            title: accessoryEntries.length === 1 ? accessoryEntries[0].name : '附件详情',
            summary: '',
            body: `
              <div class="archive-modal-grid">
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">附件详情</div></div>
                  ${makeTimelineStack(
                    accessoryEntries.length
                      ? accessoryEntries.map(item => ({ title: item.name, desc: item.desc }))
                      : [{ title: '暂无附件', desc: '当前未装配附件。' }]
                  )}
                </div>
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">附件摘要</div></div>
                  ${makeTileGrid([
                    { label: '附件数量', value: String(accessoryEntries.length) },
                    { label: '当前摘要', value: accessorySummary },
                    { label: '首个附件', value: accessoryEntries[0] ? accessoryEntries[0].name : '无' },
                    { label: '附加说明', value: accessoryEntries[0] ? accessoryEntries[0].desc : '当前未装配附件' }
                  ])}
                </div>
              </div>
            `
          };
        }

        if (String(previewKey || '').startsWith('斗铠部件：')) {
          const slotName = String(previewKey).replace('斗铠部件：', '');
          const partData = resolveArmorPartData(armor, slotName);
          const fallbackPartItems = [
            { label: '部位', value: slotName },
            { label: '记录', value: '当前未记录独立部件属性' },
            { label: '所属斗铠', value: armorSummary },
            { label: '附件状态', value: slotName === '戒指' ? accessorySummary : toText(armor.equip_status, '未装备') }
          ];
          return {
            title: `${slotName}详情`,
            summary: '',
            body: `
              <div class="archive-modal-grid" style="grid-template-columns:1fr;">
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">${slotName}</div></div>
                  ${makeTileGrid(partData ? [
                    { label: '状态', value: toText(partData['状态'], '未打造') },
                    { label: '品质系数', value: String(toNumber(partData['品质系数'], 1)) },
                    { label: '所属斗铠', value: toText(armor.name, '无') },
                    { label: '装配状态', value: toText(armor.equip_status, '未装备') }
                  ] : fallbackPartItems)}
                </div>
              </div>
            `
          };
        }

        const soulBoneCards = (snapshot.soulBoneEntries && snapshot.soulBoneEntries.length ? snapshot.soulBoneEntries.slice(0, 6) : [['暂无魂骨装载', { empty: true }]]).map(([slot, bone]) => ({
          title: bone && bone.empty ? slot : `${toText(bone && (bone.name || bone['名称'] || bone['表象名称'] || slot), slot)} / ${slot}`,
          desc: bone && bone.empty ? '尚未装载魂骨。' : `${toText(bone && (bone['状态'] || bone.status), '已装载')} ｜ ${toText(bone && (bone['年限'] || bone.age || bone['品质'] || bone['品阶']), '信息未标注')}`
        }));

        return {
          title: '武装工坊弹窗',
          summary: '',
          body: `
            <div class="equipment-layout armory-layout-single">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">当前武装</div></div>
                ${makeInteractiveTileGrid([
                  { label: '斗铠', value: armorSummary, preview: '武装详情：斗铠' },
                  { label: '机甲', value: mechSummary, preview: '武装详情：机甲' },
                  { label: '主武器', value: weaponSummary, preview: '武装详情：主武器' },
                  { label: '附件', value: accessorySummary, preview: '武装详情：附件' },
                  { label: '副职业', value: jobSummary },
                  { label: '战斗形态', value: battleForm }
                ])}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">魂骨装载</div></div>
                ${makeTimelineStack(soulBoneCards)}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">副职业工坊</div></div>
                ${makeTileGrid(jobs.length ? [
                  { label: '主副职', value: jobSummary },
                  { label: '核心技术', value: jobCoreTechSummary },
                  { label: '工坊上限', value: jobLimitSummary }
                ] : [{ label: '主副职', value: '未展开' }, { label: '核心技术', value: '暂无' }, { label: '工坊上限', value: '暂无' }], 'three')}
                ${isPlayerControlled ? '<div id="armoryProfessionMount"></div>' : '<div class="tag-cloud armory-quick-actions"><span class="tag-chip">仅玩家角色可进行锻造/工坊操作</span></div>'}
              </div>
            </div>
          `,
          onMount: (container) => {
            if (!isPlayerControlled) {
              return null;
            }
            const professionMount = container.querySelector('#armoryProfessionMount');
            if (professionMount && typeof window.mountProfessionUI === 'function') {
              return window.mountProfessionUI(professionMount, snapshot, {
                dispatchContext: mapDispatchContext,
                onAction: (actionData) => {
                  if (typeof window.sendToAI === 'function') {
                    window.sendToAI(actionData.playerInput, actionData.systemPrompt, { requestKind: actionData.requestKind });
                  }
                }
              });
            }
          }
        };
      }


      if (previewKey === '储物仓库详细页') {
        const inventoryCells = snapshot.inventoryEntries
          .sort((a, b) => toNumber(deepGet(b[1], 'market_value.price', b[1] && b[1]['数量']), 0) - toNumber(deepGet(a[1], 'market_value.price', a[1] && a[1]['数量']), 0))
          .slice(0, 18)
          .map(([name, item]) => ({
            name,
            qty: toNumber(item && item['数量'], 1),
            meta: `${toText(item && item['类型'], '物品')} · ${toText(item && (item['品质'] || item['品阶']), '常规')}`,
            className: /十万|天锻|神|红/.test(name + toText(item && item['品质'], '')) ? 'gold' : (/万年|魂骨|魂灵|紫/.test(name + toText(item && item['品质'], '')) ? 'purple' : ''),
            type: `${toText(item && item['类型'], '物品')} / ${toText(item && item['品阶'], toText(item && item['品质'], '普通'))}`,
            rarity: toText(item && (item['品质'] || item['品阶']), '普通'),
            source: toText(item && item['绑定者'], '背包持有'),
            usage: toText(item && item['描述'], '暂无属性说明'),
            canEquip: !!(window.EquipmentManager && window.EquipmentManager.parseEquipSlot(name, item)),
            tags: [toText(item && item['类型'], ''), toText(item && item['品质'], ''), toText(item && item['品阶'], '')].filter(Boolean)
          }));
        return {
          title: '储物仓库',
          summary: '当前背包、货币与核心物资。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">钱包条</div></div>
                ${makeWalletStrip([
                  { label: '联邦币', value: formatNumber(wealth.fed_coin), className: 'gold' },
                  { label: '星罗币', value: formatNumber(wealth.star_coin), className: 'cyan' },
                  { label: '唐门积分', value: formatNumber(wealth.tang_pt), className: 'cyan' },
                  { label: '学院积分', value: formatNumber(wealth.shrek_pt), className: 'cyan' },
                  { label: '战功', value: formatNumber(wealth.blood_pt), className: 'red' }
                ])}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">物资细项总览</div></div>
                ${makeTimelineStack(snapshot.inventoryEntries.slice(0, 8).map(([name, item]) => ({
                  title: `${name} / ${toText(item && item['类型'], '物品')}`,
                  desc: [
                    `品质 ${toText(item && (item['品质'] || item['品阶']), '普通')}`,
                    `标签 ${(Array.isArray(item && item['标签']) ? item['标签'].slice(0, 3).join(' / ') : '无') || '无'}`,
                    `耐久 ${toText(deepGet(item, ['耐久', '当前'], 0), 0)}/${toText(deepGet(item, ['耐久', '上限'], 0), 0)}`,
                    `交易 ${deepGet(item, '可交易', true) ? '可交易' : '绑定'}`,
                    `市价 ${formatNumber(deepGet(item, ['market_value', 'price'], 0))} ${toText(deepGet(item, ['market_value', 'currency'], 'fed_coin'), 'fed_coin')}`
                  ].join(' ｜ ')
                })))}
              </div>
              <div class="archive-card full vault-main-card">
                <div class="archive-card-head"><div class="archive-card-title">背包格阵列</div></div>
                <div class="inventory-inline-tools">
                  ${makeTagCloud([
                    { text: '全部', className: 'live' },
                    { text: '材料' },
                    { text: '消耗' },
                    { text: '战利品', className: 'warn' },
                    { text: '票据' },
                    { text: '特殊', className: 'warn' }
                  ])}
                  ${makeTileGrid([
                    { label: '当前视图', value: `全部 / ${snapshot.inventoryEntries.length}件` },
                    { label: '排序', value: '价值 / 稀有度优先' }
                  ], 'two compact')}
                </div>
                <div class="inventory-scroll-shell">${makeInventoryGrid(inventoryCells)}</div>
              </div>
            </div>
          `
        };
      }

      if (previewKey === '第一武魂详细页' || previewKey === '第二武魂详细页') {
        const secondaryTrack = snapshot.secondaryTrack || null;
        const config = previewKey === '第一武魂详细页'
          ? snapshot.primarySpirit
          : (secondaryTrack && secondaryTrack.kind === 'bloodline' ? null : secondaryTrack);

        if (!config) return null;
        return {
          title: `${config.badge}弹窗`,
          summary: '武魂、魂灵、魂环与魂技的实时展开。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">武魂本体</div></div>
                <div class="spirit-main-card">
                  <h4>${htmlEscape(config.spiritName)}</h4>
                  <div class="spirit-head-tags">
                    <span class="tag-chip ${config.badgeClass === 'gold' ? 'warn' : 'live'}">${htmlEscape(config.badge)}</span>
                    <span class="tag-chip">${htmlEscape(config.spiritType)}</span>
                    <span class="tag-chip">${htmlEscape(`元素：${config.spiritElement}`)}</span>
                    <span class="tag-chip">${htmlEscape(`魂灵：${config.souls.length}`)}</span>
                  </div>
                </div>
              </div>
              <div class="archive-card full spirit-flow-card">
                <div class="archive-card-head"><div class="archive-card-title">魂灵展开层级</div></div>
                <div class="soul-expand-stack">
                  ${config.souls.map(soul => `
                    <div class="soul-expand-card">
                      <div class="soul-expand-head">
                        <div>
                          <div class="soul-expand-title">${htmlEscape(soul.name)}</div>
                        </div>
                      </div>
                      <div class="soul-meta">
                        <div class="meta-item"><b>年限</b><span>${htmlEscape(soul.age)}</span></div>
                        <div class="meta-item"><b>契合度</b><span>${htmlEscape(soul.comp)}</span></div>
                      </div>
                      <div class="soul-ring-section">
                        <div class="rings soul-ring-lane">
                          ${soul.rings.map(ring => `<div class="ring ${ring.ringClass} interactive-ring">${htmlEscape(ring.glyph)}${buildRingHoverMarkup(ring)}</div>`).join('')}
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `
        };
      }




      if (previewKey === '血脉封印详细页') {
        return {
          title: '血脉封印弹窗',
          summary: '血脉层级、气血魂环与当前已固化能力。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">血脉本体</div></div>
                <div class="spirit-main-card">
                  <h4>${htmlEscape(snapshot.bloodline.bloodline)}</h4>
                  <div class="spirit-head-tags">
                    <span class="tag-chip warn">血脉封印</span>
                    <span class="tag-chip">${htmlEscape(`第${snapshot.bloodline.sealLv}层`)}</span>
                    <span class="tag-chip">${htmlEscape(snapshot.bloodline.core)}</span>
                    <span class="tag-chip">${htmlEscape(snapshot.bloodline.lifeFire ? '生命之火' : '未点燃') }</span>
                  </div>
                </div>
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">封印层级</div></div>
                ${makeSealColumn(Array.from({ length: Math.max(4, snapshot.bloodline.sealLv + 2) }).map((_, index) => ({
                  label: `第${index + 1}层封印`,
                  state: index < snapshot.bloodline.sealLv ? '已解' : (index % 2 === 1 ? '金环位' : '未解'),
                  className: index < snapshot.bloodline.sealLv ? 'active' : 'locked'
                })))}
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">当前封印能力</div></div>
                <div class="ability-detail-card">
                  <div class="ability-detail-title">${htmlEscape(snapshot.bloodline.bloodSkills[0] ? snapshot.bloodline.bloodSkills[0].name : '暂无已固化能力')}</div>
                  <div class="ring-hover-meta">
                    <div class="ring-hover-meta-row"><em>技能类型</em><strong>${htmlEscape(snapshot.bloodline.bloodSkills[0] ? snapshot.bloodline.bloodSkills[0].type : '未定义')}</strong></div>
                    <div class="ring-hover-meta-row"><em>作用对象</em><strong>${htmlEscape(snapshot.bloodline.bloodSkills[0] ? snapshot.bloodline.bloodSkills[0].target : '--')}</strong></div>
                    <div class="ring-hover-meta-row"><em>加成属性</em><strong>${htmlEscape(snapshot.bloodline.bloodSkills[0] ? snapshot.bloodline.bloodSkills[0].bonus : '无')}</strong></div>
                    <div class="ring-hover-meta-row"><em>消耗</em><strong>${htmlEscape(snapshot.bloodline.bloodSkills[0] ? snapshot.bloodline.bloodSkills[0].cost : '无')}</strong></div>
                    <div class="ring-hover-meta-row"><em>当前状态</em><strong>已固化</strong></div>
                  </div>
                  <div class="ability-detail-desc">${htmlEscape(snapshot.bloodline.bloodSkills[0] ? snapshot.bloodline.bloodSkills[0].desc : '血脉能力尚未明晰。')}</div>
                  <div class="ring-hover-tags">${(snapshot.bloodline.bloodSkills[0] ? snapshot.bloodline.bloodSkills[0].tags : ['待觉醒']).map(tag => `<span class="ring-hover-chip">${htmlEscape(tag)}</span>`).join('')}</div>
                </div>
              </div>
              <div class="archive-card full spirit-flow-card">
                <div class="archive-card-head"><div class="archive-card-title">气血魂环轨道</div></div>
                <div class="orbit-track">
                  ${snapshot.bloodline.rings.map(ring => `<div class="ring ${ring.ringClass || 'ring-gold'} interactive-ring">${htmlEscape(ring.glyph)}${buildRingHoverMarkup(ring)}</div>`).join('')}
                </div>
              </div>
            </div>
          `
        };
      }


      if (previewKey === '编年史档案') {
        const nodes = snapshot.timelineEntries.slice(0, 6).reverse();
        const focus = snapshot.latestTimeline;
        return {
          title: '编年史弹窗',
          summary: '横向时间轴与最近事件。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">宏观时间轴</div></div>
                <div class="history-timeline-wrap"><div class="history-timeline-track">
                  ${nodes.map(([name, item], index) => `
                    <div class="history-node ${index === nodes.length - 1 ? 'major' : ''}">
                      <div class="history-node-date">Tick ${htmlEscape(toText(item && item.trigger_tick, 0))}</div>
                      <div class="history-node-dot"></div>
                      <div class="history-node-label">${htmlEscape(name)}</div>
                    </div>
                  `).join('') || '<div class="history-node major"><div class="history-node-date">Tick 0</div><div class="history-node-dot"></div><div class="history-node-label">编年史未展开</div></div>'}
                </div></div>
                <div class="history-floating-card">
                  <div class="history-floating-title">${htmlEscape(focus ? `【当前锚点】${focus[0]}` : '【当前锚点】待开启')}</div>
                  <div class="history-floating-desc">${htmlEscape(focus ? toText(deepGet(focus[1], 'event', '暂无描述'), '暂无描述') : '世界时间线尚未展开。')}</div>
                </div>
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">近期详细日志</div></div>
                ${makeTimelineStack(snapshot.timelineEntries.slice(0, 5).map(([name, item]) => ({ title: `${name} / Tick ${toText(item && item.trigger_tick, 0)}`, desc: `${toText(item && item.status, 'pending')} ｜ ${toText(item && item.event, '暂无描述')}` }))) }
              </div>
            </div>
          `
        };
      }

      if (String(previewKey || '').startsWith('榜单角色：')) {
        const targetName = String(previewKey).replace('榜单角色：', '').trim();
        const targetChar = deepGet(snapshot, ['sd', 'char', targetName], null);
        const rankingEntry = snapshot.youthRankingEntries.find(([, item]) => toText(item && item['角色名'], '未知') === targetName)
          || snapshot.continentRankingEntries.find(([, item]) => toText(item && item['角色名'], '未知') === targetName)
          || null;
        const targetStat = deepGet(targetChar, 'stat', {});
        const targetSocial = deepGet(targetChar, 'social', {});
        const targetArmor = deepGet(targetChar, 'equip.armor', {});
        const targetMech = deepGet(targetChar, 'equip.mech', {});
        const targetWeapon = deepGet(targetChar, 'equip.wpn', {});
        const targetAccessories = listAccessoryEntries(deepGet(targetChar, 'equip.accessories', {}));
        const targetSpiritEntries = safeEntries(deepGet(targetChar, 'spirit', {}));
        return {
          title: `${targetName} / 角色基本信息`,
          summary: '榜单角色的轻量信息面板：属性、武魂与装备概览。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">基础信息</div></div>
                ${makeTileGrid([
                  { label: '角色名', value: targetName || '未知' },
                  { label: '榜单名次', value: rankingEntry ? `第${rankingEntry[0]}名` : '未定位' },
                  { label: '评分', value: rankingEntry ? toText(rankingEntry[1] && rankingEntry[1]['评分'], 0) : '未知' },
                  { label: '等级', value: targetChar ? `Lv.${toText(targetStat.lv, 0)}` : '未收录' },
                  { label: '系别', value: targetChar ? toText(targetStat.type, '未知') : '未收录' },
                  { label: '名望', value: targetChar ? `${toText(targetSocial.fame_level, '籍籍无名')} / ${formatNumber(targetSocial.reputation)}` : '未收录' },
                  { label: '魂力', value: targetChar ? `${formatNumber(targetStat.sp)} / ${formatNumber(targetStat.sp_max)}` : '未收录' },
                  { label: '气血', value: targetChar ? `${formatNumber(targetStat.vit)} / ${formatNumber(targetStat.vit_max)}` : '未收录' },
                  { label: '精神力', value: targetChar ? `${formatNumber(targetStat.men)} / ${formatNumber(targetStat.men_max)}` : '未收录' },
                  { label: '力量', value: targetChar ? formatNumber(targetStat.str) : '未收录' },
                  { label: '防御', value: targetChar ? formatNumber(targetStat.def) : '未收录' },
                  { label: '敏捷', value: targetChar ? formatNumber(targetStat.agi) : '未收录' }
                ], 'three')}
              </div>
              <div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">武魂概览</div></div>${makeTimelineStack(targetSpiritEntries.length ? targetSpiritEntries.map(([spiritName, spirit]) => ({ title: spiritName, desc: `类型 ${toText(spirit && spirit.type, '未知')} / 元素 ${toText(spirit && spirit.element, '无')} / 魂灵 ${safeEntries(deepGet(spirit, 'souls', {})).length}` })) : [{ title: '暂无武魂记录', desc: targetChar ? '当前角色未记录武魂数据。' : '该榜单角色暂无角色档案。' }])}</div>
              <div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">装备概览</div></div>${makeTileGrid([
                { label: '斗铠', value: targetChar ? (toText(targetArmor.name, '无') !== '无' ? `${toText(targetArmor.name, '无')} / ${toText(targetArmor.equip_status, '未装备')}` : '无') : '未收录' },
                { label: '机甲', value: targetChar ? (toText(targetMech.lv, '无') !== '无' ? `${toText(targetMech.lv, '无')}·${toText(targetMech.type, '未定型')} / ${toText(targetMech.equip_status || targetMech.status, '未装备')}` : '无') : '未收录' },
                { label: '主武器', value: targetChar ? (targetWeapon && (targetWeapon.name || targetWeapon['名称']) ? `${toText(targetWeapon.name || targetWeapon['名称'], '无')} / ${toText(targetWeapon.tier || targetWeapon['品阶'], '无品阶')}` : '无') : '未收录' },
                { label: '附件', value: targetChar ? summarizeAccessoryEntries(targetAccessories) : '未收录' }
              ], 'two')}</div>
            </div>
          `
        };
      }

      if (previewKey === '少年天才榜') {
        const lastBoardEntries = safeEntries(deepGet(snapshot, 'sd.world.rankings.youth_talent.last榜单', {})).sort((a, b) => toNumber(b[1], 0) - toNumber(a[1], 0));
        return {
          title: '少年天才榜',
          summary: '收录大陆30岁以下天资卓越者的榜单（TOP 30）。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">上期榜单快照</div></div>
                ${makePaginatedTimelineSection(lastBoardEntries.map(([name, score], index) => ({ title: `上期 ${index + 1} · ${name}`, desc: `评分 ${toText(score, 0)}`, preview: `榜单角色：${name}` })), '少年天才榜', 'last-board', [{ title: '暂无上期榜单', desc: '当前未记录 last榜单 快照。' }], 50)}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">当前排行</div></div>
                ${makePaginatedTimelineSection(snapshot.youthRankingEntries.slice(0, 30).map(([rank, item]) => ({ title: `第${rank}名 · ${toText(item && item['角色名'], '未知')}`, desc: `评分 ${toText(item && item['评分'], 0)}`, preview: `榜单角色：${toText(item && item['角色名'], '未知')}` })), '少年天才榜', 'current-board', [{ title: '暂无当前排行', desc: '当前未记录少年榜。' }], 50)}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '大陆风云榜') {
        return {
          title: '大陆风云榜',
          summary: '收录全大陆绝对实力强者的最高榜单（TOP 100）。',
          body: `
            <div class="archive-card">
              <div class="archive-card-head"><div class="archive-card-title">当前排行</div></div>
              ${makePaginatedTimelineSection(snapshot.continentRankingEntries.slice(0, 100).map(([rank, item]) => ({ title: `第${rank}名 · ${toText(item && item['角色名'], '未知')}`, desc: `评分 ${toText(item && item['评分'], 0)}`, preview: `榜单角色：${toText(item && item['角色名'], '未知')}` })), '大陆风云榜', 'current-board', [{ title: '暂无当前排行', desc: '当前未记录大陆风云榜。' }], 50)}
            </div>
          `
        };
      }

      if (previewKey === '拍卖与警报') {
        const auctionItems = safeEntries(deepGet(snapshot, 'sd.world.auction.items', {})).slice(0, 6);
        return {
          title: '拍卖行 / 世界警报弹窗',
          summary: '拍卖状态、拍品与当前世界警报。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">拍卖状态</div></div>
                ${makeTileGrid([
                  { label: '状态', value: toText(deepGet(snapshot, 'sd.world.auction.status', '休市'), '休市') },
                  { label: '地点', value: toText(deepGet(snapshot, 'sd.world.auction.location', '无'), '无') },
                  { label: '下次刷新', value: toText(deepGet(snapshot, 'sd.world.auction.next_tick', 0), '0') },
                  { label: '当前拍品', value: `${auctionItems.length} 件` }
                ], 'two')}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">拍品列表</div></div>
                ${makeTimelineStack(auctionItems.map(([name, item]) => ({ title: name, desc: `${toText(item && item.tier, '低阶')} ｜ ${formatNumber(item && item.price)} ｜ ${toText(item && item.lore, '暂无说明')}` })))}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '势力矩阵总览') {
        const primaryFactionEntry = getPrimaryFactionEntry(snapshot);
        const factionRelationCards = buildFactionRelationCards(primaryFactionEntry && primaryFactionEntry.data ? primaryFactionEntry.data : {}, {
          max: 8,
          emptyTitle: '暂无势力关系',
          emptyDesc: '当前主势力未记录对外关系。'
        });
        return {
          title: '势力矩阵弹窗',
          summary: '所有势力影响力、上下级关系与状态总览。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">势力梯阵</div></div>
                ${makePaginatedFactionLadder(snapshot.orgEntries.map(([name, item]) => ({
                  name,
                  desc: `影响力 ${formatNumber(item && item.inf)} / ${toText(item && item.status, '正常')} / 极限斗罗 ${toText(deepGet(item, 'power_stats.limit_douluo', 0), '0')} / 超级斗罗 ${toText(deepGet(item, 'power_stats.super_douluo', 0), '0')} / 封号斗罗 ${toText(deepGet(item, 'power_stats.title_douluo', 0), '0')}`,
                  className: snapshot.factions.some(([fac]) => fac === name) ? 'highlight' : ''
                })), '势力矩阵总览', 'org-ladder', 50)}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">${htmlEscape(`${primaryFactionEntry && primaryFactionEntry.name ? primaryFactionEntry.name : '主势力'}对外关系`)}</div></div>
                ${makeTimelineStack(factionRelationCards)}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">势力结构补充</div></div>
                ${makePaginatedTimelineSection(snapshot.orgEntries.map(([name, item]) => ({
                  title: name,
                  desc: `上级：${toText(item && item.parent_faction, '无')} ｜ 成员数：${safeEntries(item && item.mem).length} ｜ 下次刷新：${toText(item && item.next_refresh_tick, 0)}`
                })), '势力矩阵总览', 'org-structure', [{ title: '暂无势力结构', desc: '当前未记录势力结构补充信息。' }], 50)}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">主势力成员</div></div>
                ${makePaginatedTimelineSection(safeEntries(primaryFactionEntry && primaryFactionEntry.data && primaryFactionEntry.data.mem).map(([memberName, memberInfo]) => ({ title: memberName, desc: `职位：${toText(memberInfo && memberInfo['职位'], '外围')}` })), '势力矩阵总览', 'primary-members', [{ title: '暂无成员档案', desc: '当前主势力未记录成员名册。' }], 50)}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '我的阵营详情') {
        const currentFactionName = snapshot.factions[0] ? snapshot.factions[0][0] : '';
        const currentFactionEntry = currentFactionName
          ? (snapshot.orgEntries.find(([name]) => name === currentFactionName) || [currentFactionName, {}])
          : ['', {}];
        const currentFactionRelationCards = buildFactionRelationCards(currentFactionEntry[1] || {}, {
          max: 8,
          emptyTitle: '暂无阵营关系',
          emptyDesc: currentFactionName ? '当前所属势力未记录对外关系。' : '当前角色尚未加入可展示关系的势力。'
        });
        return {
          title: '我的阵营弹窗',
          summary: '当前角色在各势力中的身份、权限、申请与捐献动向。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">当前所属势力</div></div>
                ${makeFactionLadder((snapshot.factions.length ? snapshot.factions : [['未加入势力', { 身份: '无', 权限级: 0 }]]).map(([name, info], index) => ({
                  name,
                  desc: `身份：${toText(info && info['身份'], '无')} / 权限级：${toText(info && info['权限级'], '0')}`,
                  className: index === 0 ? 'highlight' : ''
                })))}
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">主身份摘要</div></div>
                ${makeTileGrid([
                  { label: '当前所属', value: snapshot.factions[0] ? snapshot.factions[0][0] : '无' },
                  { label: '当前身份', value: snapshot.factions[0] ? toText(deepGet(snapshot.factions[0][1], '身份', '无'), '无') : '未加入' },
                  { label: '主公开身份', value: toText(deepGet(snapshot, 'activeChar.social.main_identity', '无'), '无') },
                  { label: '当前称号', value: snapshot.recentTitles[0] || '暂无' }
                ], 'two')}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">当前阵营关系</div></div>
                ${makeTimelineStack(currentFactionRelationCards)}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">阵营事务请求</div></div>
                ${makeTimelineStack([
                  {
                    title: '晋升申请',
                    desc: toText(deepGet(snapshot, 'activeChar.promotion_request.target_faction', '无'), '无') !== '无'
                      ? `${toText(deepGet(snapshot, 'activeChar.promotion_request.target_faction', '无'), '无')} / ${toText(deepGet(snapshot, 'activeChar.promotion_request.target_title', '无'), '无')}`
                      : '当前无晋升申请'
                  },
                  {
                    title: '捐献申请',
                    desc: toText(deepGet(snapshot, 'activeChar.donate_request.item_name', '无'), '无') !== '无'
                      ? `${toText(deepGet(snapshot, 'activeChar.donate_request.item_name', '无'), '无')} × ${toNumber(deepGet(snapshot, 'activeChar.donate_request.quantity', 1), 1)} / ${toText(deepGet(snapshot, 'activeChar.donate_request.target_faction', '无'), '无')}`
                      : '当前无捐献申请'
                  },
                  {
                    title: '任务请求',
                    desc: toText(deepGet(snapshot, 'activeChar.quest_request.action', '无'), '无') !== '无'
                      ? `${toText(deepGet(snapshot, 'activeChar.quest_request.action', '无'), '无')} / ${toText(deepGet(snapshot, 'activeChar.quest_request.quest_name', '无'), '无')}`
                      : '当前无任务请求'
                  }
                ])}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">所属势力名册</div></div>
                ${makePaginatedTimelineSection(safeEntries(currentFactionEntry[1] && currentFactionEntry[1].mem).map(([memberName, memberInfo]) => ({ title: memberName, desc: `职位：${toText(memberInfo && memberInfo['职位'], '外围')}` })), '我的阵营详情', 'faction-members', [{ title: '暂无成员记录', desc: currentFactionName ? '当前所属势力尚未记录成员档案。' : '当前未加入可展示成员名册的势力。' }], 50)}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '本地据点详情' || previewKey === '当前节点详情' || previewKey.startsWith('地图节点：')) {
        const nodeName = previewKey.startsWith('地图节点：') ? previewKey.replace('地图节点：', '') : snapshot.currentLoc;
        const mapNode = resolveDisplayMapNode(snapshot, nodeName);
        const nodeInfo = resolveLocationData(snapshot.sd, nodeName);
        const nodeStores = safeEntries(nodeInfo.data && nodeInfo.data.stores);
        const localNpcEntries = safeEntries(deepGet(snapshot, 'sd.char', {}))
          .filter(([name, char]) => name !== snapshot.activeName && toText(deepGet(char, 'status.loc', ''), '') === nodeName)
          .slice(0, 4);
        const primaryNpc = localNpcEntries[0] ? localNpcEntries[0][0] : '';
        const actionButtons = [
          ...(nodeStores.length ? [{ text: '前往商店', action: 'shop', target: nodeStores[0][0], className: 'live' }] : []),
          ...(primaryNpc ? [{ text: `与${primaryNpc}交易`, action: 'trade', npcTarget: primaryNpc, className: 'warn' }, { text: `委托${primaryNpc}工坊`, action: 'craft', npcTarget: primaryNpc, executorType: 'private', className: 'warn' }, { text: `与${primaryNpc}对话`, action: 'talk', npcTarget: primaryNpc, className: 'live' }, { text: `向${primaryNpc}请教`, action: 'intel', npcTarget: primaryNpc, className: '' }, { text: `向${primaryNpc}切磋`, action: 'battle', npcTarget: primaryNpc, className: 'warn' }] : []),
          ...(!primaryNpc ? [{ text: '打开工坊', action: 'craft', executorType: 'self', className: 'live' }] : [])
        ];
        const travelTags = (snapshot.mapTravelCandidates.length ? snapshot.mapTravelCandidates : snapshot.dynamicLocationNames).filter(name => name !== nodeName).slice(0, 6);
        return {
          title: `本地据点 / ${nodeName}`,
          summary: '当前节点的地图属性、势力资料与可去方向。',
          body: `
            <div class="intel-layout">
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">据点概览</div></div>
                ${makeTileGrid([
                  { label: '所在地点', value: nodeName },
                  { label: '地图来源', value: mapNode ? mapNode.source : 'location' },
                  { label: '节点类型', value: mapNode ? mapNode.type : '普通地点' },
                  { label: '节点状态', value: mapNode ? mapNode.state : '可见' },
                  { label: '掌控势力', value: toText(nodeInfo.data && nodeInfo.data['掌控势力'], '未知') },
                  { label: '常住人口', value: formatNumber(nodeInfo.data && nodeInfo.data['人口']) },
                  { label: '经济状况', value: toText(nodeInfo.data && nodeInfo.data['经济状况'], '未知') },
                  { label: '守护军团', value: toText(nodeInfo.data && nodeInfo.data['守护军团'], '无') },
                  { label: '商店数量', value: `${nodeStores.length} 处` },
                  { label: '子图入口', value: mapNode && mapNode.childMapId !== '无' ? '可进入子图' : '无' },
                  { label: '节点坐标', value: mapNode ? `${toNumber(mapNode.x, 0)}, ${toNumber(mapNode.y, 0)}` : snapshot.positionText }
                ])}
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">驻地氛围</div></div>
                <div class="relation-side-list">
                  <div class="relation-card"><b>地区状态</b><span>${htmlEscape(toText(nodeInfo.data && nodeInfo.data['经济状况'], '未知'))}</span></div>
                  <div class="relation-card"><b>守备</b><span>${htmlEscape(toText(nodeInfo.data && nodeInfo.data['守护军团'], '无'))}</span></div>
                  <div class="relation-card"><b>地图描述</b><span>${htmlEscape(mapNode ? mapNode.desc : '地图描述待补')}</span></div>
                  <div class="relation-card"><b>补给情况</b><span>${htmlEscape(nodeStores.length ? `可见商店：${nodeStores.map(([name]) => name).join(' / ')}` : '暂未发现商铺')}</span></div>
                </div>
              </div>
            </div>
          `,
          onMount: () => null
        };
      }

      if (previewKey === '图层控制与跑图') {
        return {
          title: '图层控制 / 跑图弹窗',
          summary: '当前位置、可见层级与当前出行安排。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">当前位置与视图</div></div>
                ${makeTileGrid([
                  { label: '当前锚点', value: snapshot.currentLoc },
                  { label: '主视图', value: snapshot.normalizedLoc },
                  { label: '当前交通方式', value: toText(deepGet(snapshot, 'activeChar.travel_request.method', '步行'), '步行') },
                  { label: '动态节点', value: `${snapshot.dynamicLocationNames.length} 个` }
                ], 'two')}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '动态地点与扩展节点') {
        return {
          title: '动态地点弹窗',
          summary: '剧情推进生成的扩展节点。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">动态节点列表</div></div>
                ${makeTimelineStack(snapshot.dynamicLocationNames.map(name => ({ title: name, desc: `归属：${toText(deepGet(snapshot, ['sd', 'world', 'dynamic_locations', name, '归属父节点'], '未知'), '未知')}` })))}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '当前节点详情' || previewKey === '交易模块弹窗') {
        return {
          title: '交易与驻地信息',
          summary: '当前节点商店与可见库存。',
          body: '',
          onMount: (container) => {
            if (!isSnapshotPlayerControlled(snapshot)) {
              container.innerHTML = '<div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">只读浏览</div></div><div class="intel-layout"><div class="intel-card"><b>当前角色不可操作</b><span>非玩家角色仅允许查看，不开放交易等请求界面。</span></div></div></div>';
              return null;
            }
            if (typeof window.mountTradeUI === 'function') {
              return window.mountTradeUI(container, snapshot, {
                initialTab: tradeLaunchOptions.initialTab,
                prefillNpc: tradeLaunchOptions.prefillNpc,
                preferredStore: tradeLaunchOptions.preferredStore,
                onTradeAction: (actionData) => {
                  if (typeof window.sendToAI === 'function') {
                    window.sendToAI(actionData.playerInput, actionData.systemPrompt, { requestKind: actionData.requestKind });
                  }
                }
              });
            }
          }
        };
      }

      if (previewKey === '系统播报与日志') {
        return {
          title: '系统播报 / 日志弹窗',
          summary: '系统播报、近期事件与情报摘要。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">系统广播</div></div>
                ${makeTimelineStack([
                  { title: '最近播报', desc: toText(deepGet(snapshot, 'sd.sys.rsn', '暂无'), '暂无') },
                  { title: '最近事件', desc: snapshot.latestTimeline ? snapshot.latestTimeline[0] : '暂无事件' },
                  { title: '安排摘要', desc: snapshot.pendingRequests[0] || '暂无安排' },
                  { title: '情报摘要', desc: snapshot.pendingIntelCount ? `${snapshot.pendingIntelContent} / 新线索 ${snapshot.pendingIntelCount} 条` : '暂无新情报' }
                ].concat(snapshot.timelineEntries.slice(0, 4).map(([name, item]) => ({ title: name, desc: toText(item && (item['event'] || item['事件']), '暂无描述') }))))}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '操作总线') {
        const planSummary = buildRecentPlanSummary(snapshot, { worldLimit: 6, recordLimit: 6 });
        return {
          title: '近期安排',
          summary: '世界日程与个人待办的双视角安排板。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">当前状态</div></div>
                ${makeTileGrid([
                  { label: '当前行动', value: toText(status.action, '日常') },
                  { label: '所在位置', value: snapshot.currentLoc },
                  { label: '伤势', value: toText(status.wound, '无伤') },
                  { label: '世界安排', value: String(planSummary.worldPlans.length) },
                  { label: '个人待办', value: String(planSummary.personalPlans.length) },
                  { label: '请求摘要', value: String(snapshot.pendingRequests.length) }
                ], 'two')}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">世界日程</div></div>
                ${makeTimelineStack(planSummary.worldPlans.length ? planSummary.worldPlans : [{ title: '暂无世界安排', desc: '当前未记录待触发的世界日程。' }])}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">个人待办</div></div>
                ${makeTimelineStack(planSummary.personalPlans.length ? planSummary.personalPlans : [{ title: '暂无个人待办', desc: '当前未记录进行中的个人任务。' }])}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">请求摘要</div></div>
                ${makeTimelineStack((snapshot.pendingRequests.length ? snapshot.pendingRequests : ['暂无请求摘要']).map((item, index) => ({ title: `请求 ${index + 1}`, desc: item })))}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '试炼与情报') {
        const towerDiscountEntries = safeEntries(deepGet(snapshot, 'activeChar.tower_records.discount_available', {})).filter(([, value]) => !!value);
        return {
          title: '试炼与情报',
          summary: '当前可去试炼与已解锁情报摘要。',
          body: `
            <div class="intel-layout">
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">可前往试炼</div></div>
                ${makeTileGrid([
                  { label: '升灵台门票', value: String(snapshot.inventoryEntries.filter(([name]) => /升灵台/.test(name)).length) },
                  { label: '魂灵塔安排', value: `${toText(deepGet(snapshot, 'activeChar.tower_request.action', '无'), '无')} / 最高 ${toText(deepGet(snapshot, 'activeChar.tower_records.max_floor', 0), '0')} 层` },
                  { label: '塔层折扣', value: towerDiscountEntries.length ? `${towerDiscountEntries.length} 层可用` : '暂无' },
                  { label: '狩猎安排', value: toText(deepGet(snapshot, 'activeChar.hunt_request.killed_age', 0), '0') === '0' ? '暂无' : '待结算' },
                  { label: '深渊击杀', value: toText(deepGet(snapshot, 'activeChar.abyss_kill_request.kill_tier', '无'), '无') !== '无' ? `${toText(deepGet(snapshot, 'activeChar.abyss_kill_request.kill_tier', '无'), '无')} × ${toNumber(deepGet(snapshot, 'activeChar.abyss_kill_request.quantity', 1), 1)}` : '暂无待结算' },
                  { label: '当前战功', value: formatNumber(deepGet(snapshot, 'activeChar.wealth.blood_pt', 0)) },
                  { label: '风险评估', value: snapshot.pendingIntelCount ? `${snapshot.worldAlert} / 线索 +${snapshot.pendingIntelImpact}` : snapshot.worldAlert }
                ])}
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">已掌握情报</div></div>
                <div class="intel-cabinet">
                  ${(snapshot.unlockedKnowledges.length ? snapshot.unlockedKnowledges.slice(-4).reverse() : ['情报仍待收集']).map(item => `<div class="intel-card"><b>${htmlEscape(item)}</b><span>${htmlEscape(item)}</span></div>`).join('')}
                </div>
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">魂灵塔折扣资格</div></div>
                ${makeTimelineStack(towerDiscountEntries.length ? towerDiscountEntries.slice(0, 10).map(([floor]) => ({ title: `${floor} 层`, desc: '五折资格未使用' })) : [{ title: '暂无折扣资格', desc: '当前未记录可用五折层。' }])}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '任务界面') {
        const quest = deepGet(snapshot, 'activeChar.quest_request', {});
        const hasQuest = toText(quest.action, '无') !== '无';
        return {
          title: '任务界面',
          summary: '当前正在追踪的任务目标与进度。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">当前任务</div></div>
                ${makeTileGrid(hasQuest ? [
                  { label: '任务名称', value: toText(quest.quest_name, '未知') },
                  { label: '动作类型', value: toText(quest.action, '未知') },
                  { label: '单次进度', value: `+${toNumber(quest.progress_add, 0)}` },
                  { label: '目标需求', value: String(toNumber(quest.required_count, 1)) },
                  { label: '奖励金币', value: formatNumber(quest.reward_coin) },
                  { label: '奖励声望', value: formatNumber(quest.reward_rep) }
                ] : [{ label: '状态', value: '当前未接取任务' }], 'two')}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">任务说明</div></div>
                <div class="intel-layout"><div class="intel-card"><b>任务详情</b><span>${htmlEscape(hasQuest ? toText(quest.quest_desc, '无附加说明') : '当前没有正在追踪的任务说明。')}</span></div></div>
              </div>
            </div>
          `
        };
      }

      if (previewKey === '近期见闻') {
        const newsSummary = buildRecentNewsSummary(snapshot, { seqLimit: 8, intelLimit: 8 });
        return {
          title: '近期见闻 / 城内简报',
          summary: '全局剧情备忘录与个人情报库的合并简报。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">全局见闻</div></div>
                ${makeTimelineStack(newsSummary.globalNews.length ? newsSummary.globalNews : [{ title: '暂无全局见闻', desc: 'sys.seq 当前未记录新的剧情备忘。' }])}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">个人见闻</div></div>
                ${makeTimelineStack(newsSummary.personalNews.length ? newsSummary.personalNews : [{ title: '暂无个人见闻', desc: '当前角色尚未收录新的情报。' }])}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '怪物图鉴') {
        const bestiaryCards = (snapshot.bestiaryEntries.length ? snapshot.bestiaryEntries.slice(0, 24) : [['暂无图鉴记录', { empty: true }]]).map(([name, item]) => ({
          title: item && item.empty ? name : name,
          desc: item && item.empty
            ? '暂未记录任何深渊生物或魂兽。'
            : (safeEntries(item).length
              ? safeEntries(item).slice(0, 6).map(([key, value]) => `${toText(key, '字段')}：${value && typeof value === 'object' ? `${safeEntries(value).length}项` : toText(value, '无')}`).join(' / ')
              : '已记录基础数据，可供后续复用。')
        }));
        return {
          title: '怪物图鉴',
          summary: '已遭遇深渊生物与魂兽的标准化记录。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">图鉴总览</div></div>
                ${makeTileGrid([
                  { label: '已记录物种', value: `${snapshot.bestiaryEntries.length} 种` },
                  { label: '最近收录', value: snapshot.bestiaryEntries[0] ? snapshot.bestiaryEntries[0][0] : '暂无' },
                  { label: '可复用状态', value: snapshot.bestiaryEntries.length ? '可作为后续标准数据源' : '等待首次收录' },
                  { label: '字段覆盖', value: snapshot.bestiaryEntries[0] ? `${safeEntries(snapshot.bestiaryEntries[0][1]).length} 项` : '0 项' }
                ], 'two')}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">最近收录详情</div></div>
                ${makeTimelineStack(snapshot.bestiaryEntries[0] ? [{ title: snapshot.bestiaryEntries[0][0], desc: safeEntries(snapshot.bestiaryEntries[0][1]).length ? safeEntries(snapshot.bestiaryEntries[0][1]).map(([key, value]) => `${toText(key, '字段')}：${value && typeof value === 'object' ? `${safeEntries(value).length}项` : toText(value, '无')}`).join(' / ') : '当前仅建立了空白图鉴壳。' }] : [{ title: '暂无最近收录', desc: '当前图鉴仍为空。' }])}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">已记录物种</div></div>
                ${makeTimelineStack(bestiaryCards)}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '森林仇恨值') {
        const remaining = Math.max(0, 1000000 - snapshot.forestKilledAge);
        const progress = Math.max(0, Math.min(100, Number(((snapshot.forestKilledAge / 1000000) * 100).toFixed(1))));
        const stage = progress >= 100 ? '兽潮临界' : (progress >= 70 ? '高度紧张' : (progress >= 30 ? '持续升温' : '相对安全'));
        return {
          title: '森林仇恨值',
          summary: '星斗大森林累计击杀年限与兽潮阈值监控。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">仇恨累计</div></div>${makeTileGrid([{ label: '累计击杀年限', value: formatNumber(snapshot.forestKilledAge) }, { label: '兽潮阈值', value: '1000000' }, { label: '剩余安全空间', value: remaining > 0 ? formatNumber(remaining) : '0' }, { label: '当前阶段', value: stage }], 'two')}<div style="margin-top:12px;"><div style="display:flex;justify-content:space-between;font-size:12px;color:#bfdde4;margin-bottom:6px;"><span>阈值进度</span><span>${progress}%</span></div><div style="height:10px;border-radius:999px;background:rgba(255,255,255,0.08);overflow:hidden;border:1px solid rgba(150,217,228,0.12);"><div style="height:100%;width:${progress}%;background:${progress >= 100 ? 'linear-gradient(90deg,#ff6b6b,#ffb36b)' : (progress >= 70 ? 'linear-gradient(90deg,#ffd36b,#ff8a5b)' : 'linear-gradient(90deg,#72e6ff,#7dffb2)')};box-shadow:0 0 12px rgba(255,180,107,0.35);"></div></div></div></div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">阶段说明</div></div>
                ${makeTimelineStack([
                  { title: '0% - 29%', desc: '相对安全 / 森林尚未进入高压状态。' },
                  { title: '30% - 69%', desc: '持续升温 / 已经开始积累明显仇恨。' },
                  { title: '70% - 99%', desc: '高度紧张 / 接近恐怖阈值，应避免继续屠戮。' },
                  { title: '100%', desc: '兽潮临界 / 已达到恐怖事件触发线。' }
                ])}
              </div>
            </div>
          `
        };
      }

      return null;
    }

    async function refreshLiveSnapshot() {
      try {
        const vars = await getAllVariablesSafe();
        const root = resolveRootData(vars);
        if (!root || !root.sd) return;
        const effective = buildEffectiveSd(root.sd);
        if (!effective.sd) return;
        liveSnapshot = buildSnapshot(effective.sd);
        renderHeader(liveSnapshot);
        renderLiveCards(liveSnapshot);
        
        const isCombatActive = !!deepGet(liveSnapshot, 'sd.world.combat.is_active');
        if (isCombatActive && isSnapshotPlayerControlled(liveSnapshot)) {
          if (!activeBattleUI && typeof window.mountBattleUI === 'function') {
            activeBattleUI = window.mountBattleUI(document.getElementById('battle-overlay'), liveSnapshot, {
              onAction: (actionData) => {
                if (typeof window.sendToAI === 'function') {
                  window.sendToAI(actionData.playerInput, actionData.systemPrompt, { requestKind: actionData.requestKind });
                }
              }
            });
          } else if (activeBattleUI && typeof activeBattleUI.updateData === 'function') {
            activeBattleUI.updateData(liveSnapshot);
          }
        } else if (activeBattleUI && typeof activeBattleUI.destroy === 'function') {
          activeBattleUI.destroy();
          activeBattleUI = null;
        }

        if (detailModal.classList.contains('show') && currentModalPreviewKey) {
          if (currentModalPreviewKey === '角色切换器') {
            return;
          }
          const liveSubUiKeys = new Set(['武装工坊详细页', '储物仓库详细页', '当前节点详情', '交易模块弹窗']);
          if (
            liveSubUiKeys.has(currentModalPreviewKey)
            && activeSubUI
            && typeof activeSubUI.updateData === 'function'
          ) {
            activeSubUI.updateData(liveSnapshot);
          } else {
            renderModalContent(currentModalPreviewKey);
          }
        }
      } catch (error) {
        console.warn('[DragonUI] MVU 实时渲染失败', error);
      }
    }

    async function initLiveBindings() {
      await waitForMvuReady();
      await refreshLiveSnapshot();
      bindMvuUpdates(refreshLiveSnapshot);
    }

    function buildRingHoverMarkup(ring) {
      const skills = (ring.skills || []).map(skill => `
        <div class="ring-hover-skill">
          <b>${skill.name}</b>
          <div class="ring-hover-meta">
            <div class="ring-hover-meta-row"><em>主定位 / 状态</em><strong>${skill.mainRole || '无'} / ${skill.status || '已觉醒'}</strong></div>
            <div class="ring-hover-meta-row"><em>作用对象</em><strong>${skill.target || '--'}</strong></div>
          </div>
          <div class="ring-hover-meta-row" style="font-size:9px;color:#85afb8;margin-bottom:6px;line-height:1.3;"><em>消耗</em><br/><strong>${skill.cost || '无消耗'}</strong></div>
          <div class="ring-hover-meta-row" style="font-size:9px;color:#85afb8;margin-bottom:6px;line-height:1.3;"><em>加成属性</em><br/><strong>${skill.bonus || '无'}</strong></div>
          <span>${skill.desc || '暂无描述'}</span>
          <div class="ring-hover-tags">${(skill.tags || []).map(tag => `<span class="ring-hover-chip">${tag}</span>`).join('')}</div>
        </div>
      `).join('');

      return `<div class="ring-hover-card"><div class="ring-hover-title">${ring.title}</div><div class="ring-hover-desc">${ring.desc}</div>${skills}</div>`;
    }

    function buildSpiritRingGrid(rings, fallbackClass = 'ring-white') {
      const normalized = [...(rings || [])];
      while (normalized.length < 10) normalized.push({ empty: true, ringClass: fallbackClass });
      return normalized.slice(0, 10).map(ring => {
        if (ring.empty) return `<div class="ring ${ring.ringClass || fallbackClass} empty"></div>`;
        return `<div class="ring ${ring.ringClass || fallbackClass} interactive-ring">${ring.glyph}${buildRingHoverMarkup(ring)}</div>`;
      }).join('');
    }

    function renderArchiveSpiritEntry(config, isPrimary = false) {
      const head = isPrimary
        ? `<div class="dual-side-top"><div class="strip-head"><div class="strip-title cyan">武魂档案</div></div><span class="badge ${config.badgeClass || 'cyan'}">${config.badge}</span></div>`
        : `<div class="dual-side-top dual-side-top-right"><span class="badge ${config.badgeClass || 'gold'}">${config.badge}</span></div>`;

      return `${head}<div class="strip-name">${config.name}</div><div class="rings dual-grid ${isPrimary ? 'primary-rings' : 'secondary-rings'}">${buildSpiritRingGrid(config.rings, isPrimary ? 'ring-white' : 'ring-gold')}</div>`;
    }

    function renderArchiveBloodlineEntry(config) {
      return `
        <div class="dual-side-top dual-side-top-right">
          <span class="badge ${config.badgeClass || 'gold'}">${config.badge}</span>
        </div>
        <div class="strip-name">${config.name}</div>
        <div class="rings dual-grid secondary-rings">${buildSpiritRingGrid(config.rings, 'ring-gold')}</div>
      `;
    }

    function buildSplitShellPages() { /* 已移除克隆逻辑，交由 Vue 模板直出 */ }
    const pageMetaMap = {
      'page-archive': { title: '档案 / 个人主控', subtitle: '生命图谱、武魂轨道、社会摘要与储物入口', tag: '档案核心' },
      'page-map': { title: '星图 / 节点导航', subtitle: '当前位置、下钻路径、本地设施与动态地点', tag: '星图导航' },
      'page-world': { title: '世界 / 时空中枢', subtitle: '时间轴、偏差、金榜与拍卖警报的汇总面板', tag: '世界中枢' },
      'page-org': { title: '势力 / 矩阵沙盘', subtitle: '阵营归属、大陆格局与据点网络的视觉化入口', tag: '势力矩阵' },
      'page-terminal': { title: '终端 / 系统总线', subtitle: '系统播报、请求总线与近期见闻', tag: '系统总线' }
    };


    function setMainTab(targetId) {
      try {
        if (typeof window.__MVU_SET_TAB_STATE__ === 'function') window.__MVU_SET_TAB_STATE__(targetId);
      } catch (err) {}

      buildSplitShellPages();

      tabs.forEach(t => t.classList.toggle('active', t.dataset.target === targetId));
      pages.forEach(p => {
        const pageTarget = p.dataset && p.dataset.target ? p.dataset.target : p.id;
        p.classList.toggle('active', pageTarget === targetId);
      });

      if (viewport) viewport.classList.add('split-hidden');
      if (splitOverlay) {
        splitOverlay.classList.add('active');
        splitOverlay.classList.toggle('archive-mode', targetId === 'page-archive');
      }
      if (splitTopShell) splitTopShell.classList.remove('active');

      const leftPages = splitOverlay ? splitOverlay.querySelectorAll('.split-left-page') : [];
      const rightPages = splitOverlay ? splitOverlay.querySelectorAll('.split-right-page') : [];
      leftPages.forEach(p => p.classList.toggle('active', p.dataset.target === targetId));
      rightPages.forEach(p => p.classList.toggle('active', p.dataset.target === targetId));

      if (splitTopShell && splitTopStage) {
        const meta = pageMetaMap[targetId] || pageMetaMap['page-archive'];
        const currentHeaderLoc = document.querySelector('.header-loc span')?.textContent?.trim() || '';
        const currentHeaderTime = document.querySelector('.header-time')?.textContent?.trim() || '';
        splitTopStage.innerHTML = `
          <div class="header" style="height:100%;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
            <div style="min-width:0;display:grid;gap:4px;">
              <div style="display:flex;align-items:center;gap:8px;min-width:0;">
                <span class="modal-level-chip">${meta.tag}</span>
                <span class="modal-path-chip">SHELL / ${meta.title}</span>
              </div>
              <div style="font-family:var(--font-title);font-size:15px;color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${meta.title}</div>
              <div style="font-size:10px;line-height:1.35;color:var(--text-sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${meta.subtitle}</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex:0 0 auto;">
              <span class="split-bottom-chip">${currentHeaderTime}</span>
              <span class="split-bottom-chip live">${currentHeaderLoc}</span>
            </div>
          </div>
        `;
        splitTopShell.classList.add('active');
      }

      closeModal();
    }

    
    setMainTab('page-archive');

    function renderList(target, items) {
      target.innerHTML = (items || []).map(item => `<li>${item}</li>`).join('');
    }

    function buildDynamicPreview(key) {
      if (key.startsWith('地图节点：')) {
        const nodeName = key.replace('地图节点：', '');
        return {
          title: `地图节点 / ${nodeName}`,
          summary: '从地图节点直接展开地点详情，查看这片区域的势力、补给、商路与周边可去方向。',
          highlights: ['当前节点概况', '周边势力与商路', '最近发生的地区动向'],
          duties: ['查看节点层级与地点描述', '查看掌控势力、经济与商店情况', '查看还能继续前往的周边区域'],
          actions: ['查看本地据点', '查看可用商路', '继续下钻周边区域']
        };
      }

      return {
        title: key,
        summary: '这个模块会以统一的详情页结构展开，方便直接查看核心信息。',
        highlights: ['这里会显示该模块的核心概况', '重点信息会按阅读顺序展开', '内容会保持统一结构'],
        duties: ['查看该模块的主要信息', '查看从 1级页下钻后的重型内容', '维持统一的详情阅读结构'],
        actions: ['查看重点信息', '关闭后返回上一层']
      };
    }

    var inventoryHoverPanel = null;
    var activeInventoryHoverCell = null;
    var inventoryHoverFlipY = false;

    function ensureInventoryHoverPanel() {
      if (inventoryHoverPanel) return inventoryHoverPanel;
      inventoryHoverPanel = document.createElement('div');
      inventoryHoverPanel.className = 'inventory-hover-panel';
      document.body.appendChild(inventoryHoverPanel);
      return inventoryHoverPanel;
    }

    function hideInventoryHoverPanel() {
      if (!inventoryHoverPanel) return;
      inventoryHoverPanel.classList.remove('show');
      inventoryHoverPanel.classList.remove('flip-y');
      activeInventoryHoverCell = null;
    }

    function placeInventoryHoverPanel(panel, event) {
      const gap = 18;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const panelWidth = panel.offsetWidth || 236;
      const panelHeight = panel.offsetHeight || 168;

      let left = event.clientX + gap;
      if (left + panelWidth > vw - 12) {
        left = event.clientX - panelWidth - gap;
      }
      left = Math.max(12, Math.min(left, vw - panelWidth - 12));

      let top = event.clientY + gap;
      inventoryHoverFlipY = false;
      if (top + panelHeight > vh - 12) {
        top = event.clientY - panelHeight - gap;
        inventoryHoverFlipY = true;
      }
      top = Math.max(12, Math.min(top, vh - panelHeight - 12));

      panel.classList.toggle('flip-y', inventoryHoverFlipY);
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
    }

    function showInventoryHoverPanel(cell, event, forceRender = false) {
      const panel = ensureInventoryHoverPanel();
      if (forceRender || activeInventoryHoverCell !== cell) {
        const tags = (cell.dataset.hoverTags || '').split('|').filter(Boolean);
        panel.innerHTML = `
          <div class="inventory-hover-title">${cell.dataset.hoverTitle || ''}</div>
          <div class="inventory-hover-grid">
            <div class="meta-item"><b>类型</b><span>${cell.dataset.hoverType || '--'}</span></div>
            <div class="meta-item"><b>稀有度</b><span>${cell.dataset.hoverRarity || '--'}</span></div>
            <div class="meta-item"><b>数量</b><span>${cell.dataset.hoverQty || '--'}</span></div>
            <div class="meta-item"><b>用途</b><span>${cell.dataset.hoverUsage || '--'}</span></div>
          </div>
          <div class="inventory-hover-tags">${[cell.dataset.hoverSource || '', ...tags].filter(Boolean).map(tag => `<span class="tag-chip">${tag}</span>`).join('')}</div>
          ${cell.dataset.hoverEquip === 'true' ? `
          <button type="button" class="inventory-hover-action-btn" 
            onclick="if(window.EquipmentManager) window.EquipmentManager.performEquip(0, '${(cell.dataset.hoverTitle || '').replace(/'/g, "\\'")}');">
            穿戴装备 / 装载
          </button>
          ` : ''}
        `;
        activeInventoryHoverCell = cell;
      }
      panel.classList.add('show');
      placeInventoryHoverPanel(panel, event);
    }

    document.addEventListener('mousemove', (event) => {
      const eventTarget = event.target instanceof Element ? event.target : (event.target && event.target.parentElement ? event.target.parentElement : null);
      const cell = eventTarget ? eventTarget.closest('.inventory-cell[data-hover-title]') : null;
      if (!cell || !detailModal.classList.contains('show') || !detailModal.contains(cell)) {
        hideInventoryHoverPanel();
        return;
      }
      showInventoryHoverPanel(cell, event);
    });

    document.addEventListener('mouseleave', hideInventoryHoverPanel, true);
    document.addEventListener('scroll', hideInventoryHoverPanel, true);

    function escapeJsonPointerValue(text) {
      return String(text == null ? '' : text).split('~').join('~0').split('/').join('~1');
    }

    function normalizeMapDispatchServices(detail) {
      return Array.isArray(detail && detail.services)
        ? detail.services.map(item => toText(item, '')).filter(Boolean)
        : [];
    }

    function resolveSnapshotCharKey(snapshot, rawName) {
      const wanted = toText(rawName, '').trim();
      const chars = deepGet(snapshot, 'sd.char', {});
      if (!wanted || !chars || typeof chars !== 'object') return '';
      if (chars[wanted]) return wanted;
      for (const [charKey, charInfo] of Object.entries(chars)) {
        const displayName = toText(charInfo && (charInfo.name || deepGet(charInfo, 'base.name', '')), charKey);
        if (displayName === wanted) return charKey;
      }
      return '';
    }

    function buildMapTradeModalOptions(snapshot, dispatchDetail) {
      const detail = dispatchDetail || {};
      const services = normalizeMapDispatchServices(detail);
      const action = toText(detail.action, '');
      const npcTarget = toText(detail.npcTarget, '');
      const currentLoc = toText(snapshot && snapshot.currentLoc, '');
      const locations = deepGet(snapshot, 'sd.world.locations', {});
      const currentLocation = locations && typeof locations === 'object' ? (locations[currentLoc] || {}) : {};
      const storeMap = currentLocation && typeof currentLocation === 'object' ? (currentLocation.stores || {}) : {};

      let initialTab = 'tab-shop';
      if (action === 'bid' || services.includes('auction')) {
        initialTab = 'tab-auction';
      } else if (action === 'trade' && npcTarget && !services.some(service => ['shop', 'auction', 'black_market'].includes(service))) {
        initialTab = 'tab-private';
      } else if (action === 'trade' && !services.length) {
        initialTab = 'tab-private';
      }

      const target = toText(detail.target, '');
      let preferredStore = '';
      if (target && storeMap && typeof storeMap === 'object' && storeMap[target]) {
        preferredStore = target;
      } else if (initialTab === 'tab-shop') {
        const storeNames = Object.keys(storeMap || {});
        if (storeNames.length === 1) preferredStore = storeNames[0];
      }

      return {
        initialTab,
        prefillNpc: initialTab === 'tab-private' ? npcTarget : '',
        preferredStore
      };
    }

    function buildMapBattleInitRequest(snapshot, dispatchDetail) {
      const detail = dispatchDetail || {};
      let npcTarget = toText(detail.npcTarget, '');
      const npcTargets = Array.isArray(detail.npcTargets) ? detail.npcTargets.map(item => toText(item, '')).filter(Boolean) : [];
      if (!npcTarget && npcTargets.length === 1) npcTarget = npcTargets[0];
      if (!snapshot || !snapshot.sd || !npcTarget) return null;

      const activeKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
      const targetKey = resolveSnapshotCharKey(snapshot, npcTarget);
      if (!activeKey || !targetKey) return null;

      const chars = deepGet(snapshot, 'sd.char', {});
      const activeChar = chars && typeof chars === 'object' ? (chars[activeKey] || {}) : {};
      const targetChar = chars && typeof chars === 'object' ? (chars[targetKey] || {}) : {};
      const activeName = toText(activeChar && (activeChar.name || deepGet(activeChar, 'base.name', '')), activeKey);
      const targetName = toText(targetChar && (targetChar.name || deepGet(targetChar, 'base.name', '')), npcTarget || targetKey);
      const arenaName = toText(detail.target, toText(detail.currentLoc, toText(snapshot.currentLoc, '未知地点')));

      const patchOps = [
        { op: 'replace', path: '/sd/world/combat/is_active', value: true },
        { op: 'replace', path: '/sd/world/combat/combat_type', value: '切磋' },
        { op: 'replace', path: '/sd/world/combat/initiative', value: '无' },
        { op: 'replace', path: '/sd/world/combat/allow_flee', value: true },
        { op: 'replace', path: '/sd/world/combat/round', value: 1 },
        { op: 'replace', path: '/sd/world/combat/phase', value: '宣告阶段' },
        { op: 'replace', path: '/sd/world/combat/environment', value: `${arenaName} / 切磋` },
        { op: 'replace', path: '/sd/world/combat/summary', value: {
          player_action: { action_type: '无', element_count: 1, is_charged: false },
          settle_result: { target_npc: targetName, result: '未决', is_killed: false },
          round_count: 0,
          mode: 'single_round',
          generated_by: 'UI.html.map-action-dispatch'
        } },
        { op: 'replace', path: '/sd/world/combat/participants', value: {
          [activeKey]: { faction: '己方', status: deepGet(activeChar, 'status.alive', true) === false ? '重伤' : '存活', action_declared: '无', is_summon: false, current_cast_time: 0 },
          [targetKey]: { faction: '敌对', status: deepGet(targetChar, 'status.alive', true) === false ? '重伤' : '存活', action_declared: '无', is_summon: false, current_cast_time: 0 }
        } },
        { op: 'replace', path: `/sd/char/${escapeJsonPointerValue(activeKey)}/status/action`, value: '战斗中' },
        { op: 'replace', path: `/sd/char/${escapeJsonPointerValue(targetKey)}/status/action`, value: '应战' },
        { op: 'replace', path: '/sd/sys/rsn', value: `[切磋开始] ${activeName}在${arenaName}向${targetName}发起切磋。` }
      ];

      const systemPrompt = `以下内容属于前端已经完成的战斗初始化，不要在正文直接复述“JSONPatch / 系统分析 / 仲裁日志”等术语。

[切磋开始] ${activeName}在【${arenaName}】向【${targetName}】发起切磋。

[MVU变量更新数据]
以下为本次战斗初始化的完整 MVU 更新，请将上面的隐藏结算转写为自然剧情，正文不要直接复述 JSONPatch 或系统术语。
<UpdateVariable>
<Analysis>Battle initialized from map action.</Analysis>
<JSONPatch>
${JSON.stringify(patchOps, null, 2)}
</JSONPatch>
</UpdateVariable>`;

      return {
        playerInput: `我想在【${arenaName}】与【${targetName}】切磋。`,
        systemPrompt,
        requestKind: 'combat_action'
      };
    }

    function buildMapInteractDispatchRequest(snapshot, dispatchDetail) {
      const detail = dispatchDetail || {};
      const action = toText(detail.action, '');
      let npcTarget = toText(detail.npcTarget, '');
      const npcTargets = Array.isArray(detail.npcTargets) ? detail.npcTargets.map(item => toText(item, '')).filter(Boolean) : [];
      if (!npcTarget && npcTargets.length === 1) npcTarget = npcTargets[0];

      // MVU 的 interact_request.action 当前没有“汇报/情报”细分动作，
      // 因此地图里的 brief / intel 暂按“请教”写入，区别保留在提示词与剧情文案里。
      const interactActionMap = {
        talk: '闲聊',
        brief: '请教',
        intel: '请教'
      };
      const interactAction = toText(interactActionMap[action], '');
      if (!snapshot || !snapshot.sd || !npcTarget || !interactAction) return null;

      const activeKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
      if (!activeKey) return null;

      const chars = deepGet(snapshot, 'sd.char', {});
      const activeChar = chars && typeof chars === 'object' ? (chars[activeKey] || {}) : {};
      const activeName = toText(activeChar && (activeChar.name || deepGet(activeChar, 'base.name', '')), toText(snapshot.activeName, activeKey));
      const arenaName = toText(detail.target, toText(detail.currentLoc, toText(snapshot.currentLoc, '未知地点')));
      const currentTick = toNumber(deepGet(snapshot, 'sd.world.time.tick', 0), 0);
      const actionPromptMap = {
        talk: `我想在【${arenaName}】和【${npcTarget}】对话。`,
        brief: `我想在【${arenaName}】向【${npcTarget}】汇报情况并请示安排。`,
        intel: `我想在【${arenaName}】向【${npcTarget}】请教情报。`
      };

      const patchOps = [
        { op: 'replace', path: `/sd/char/${escapeJsonPointerValue(activeKey)}/interact_request`, value: {
          target_npc: npcTarget,
          action: interactAction,
          item_used: '无',
          ai_score: 0
        } },
        { op: 'replace', path: `/sd/char/${escapeJsonPointerValue(activeKey)}/status/action`, value: '日常' },
        { op: 'replace', path: '/sd/world/time/tick', value: currentTick + 2 },
        { op: 'replace', path: '/sd/sys/rsn', value: `[社交互动] ${activeName} 在【${arenaName}】对【${npcTarget}】发起【${interactAction}】。` }
      ];

      const systemPrompt = `以下内容属于前端已经完成的地图 NPC 互动结算，不要在正文直接复述“JSONPatch / 系统分析 / 仲裁日志”等术语。

[社交互动] ${activeName} 在【${arenaName}】对【${npcTarget}】发起【${interactAction}】。

[MVU变量更新数据]
以下为本次地图 NPC 互动的完整 MVU 更新，请将上面的隐藏结算转写为自然剧情，正文不要直接复述 JSONPatch 或系统术语。
<UpdateVariable>
<Analysis>Map NPC interaction initialized from map action.</Analysis>
<JSONPatch>
${JSON.stringify(patchOps, null, 2)}
</JSONPatch>
</UpdateVariable>`;

      return {
        playerInput: actionPromptMap[action] || `我想在【${arenaName}】与【${npcTarget}】互动。`,
        systemPrompt,
        requestKind: 'interact_request'
      };
    }

    function handleMapActionDispatch(event) {
      const detail = event && event.detail ? event.detail : {};
      const action = toText(detail.action, '');
      const services = normalizeMapDispatchServices(detail);
      if (!action && !services.length) return;
      if (!isSnapshotPlayerControlled(liveSnapshot)) {
        if (typeof window.alert === 'function') window.alert('当前为非玩家角色视角，仅允许浏览，不能发起交易/锻造/战斗等操作。');
        return;
      }

      if (action === 'craft' || services.includes('craft')) {
        mapDispatchContext = { ...detail, action, services };
        openModal('武装工坊详细页', { preserveMapDispatchContext: true });
        return;
      }

      if (['talk', 'brief', 'intel'].includes(action)) {
        const interactInit = buildMapInteractDispatchRequest(liveSnapshot, detail);
        if (!interactInit) {
          console.warn('[DragonUI] 地图 NPC 互动分发缺少有效 NPC 目标或实时快照', detail);
          if (typeof window.alert === 'function') window.alert('请先在地图右侧 NPC 列表中选定互动对象。');
          return;
        }
        mapDispatchContext = { ...detail, action, services };
        if (typeof window.sendToAI === 'function') {
          window.sendToAI(interactInit.playerInput, interactInit.systemPrompt, { requestKind: interactInit.requestKind });
        }
        return;
      }

      if (action === 'battle' || services.includes('battle')) {
        const battleInit = buildMapBattleInitRequest(liveSnapshot, detail);
        if (!battleInit) {
          console.warn('[DragonUI] 地图战斗分发缺少有效 NPC 目标或实时快照', detail);
          if (typeof window.alert === 'function') window.alert('请先在地图右侧 NPC 列表中选定切磋对象。');
          return;
        }
        mapDispatchContext = { ...detail, action, services };
        if (typeof window.sendToAI === 'function') {
          window.sendToAI(battleInit.playerInput, battleInit.systemPrompt, { requestKind: battleInit.requestKind });
        }
        return;
      }

      if (['trade', 'bid', 'shop', 'auction', 'black_market'].includes(action) || services.some(service => ['shop', 'auction', 'black_market'].includes(service))) {
        mapDispatchContext = { ...detail, action, services };
        openModal('交易网络', { preserveMapDispatchContext: true });
      }
    }

    window.addEventListener('map-action-dispatch', handleMapActionDispatch);

    function openModal(previewKey, options = {}) {
      const refs = getModalRefs();
      if (!options.preserveMapDispatchContext) {
        mapDispatchContext = null;
      }
      currentModalPreviewKey = previewKey || '';
      renderModalContent(currentModalPreviewKey, refs);
      if (!refs.detailModal) return;
      refs.detailModal.classList.add('show');
      refs.detailModal.setAttribute('aria-hidden', 'false');
    }

    function renderModalContent(previewKey, refs = getModalRefs()) {
      const {
        detailModal,
        modalPanel,
        modalTitle,
        modalSubtitle,
        modalLevel,
        modalPath,
        modalSummary,
        modalBody
      } = refs;
      if (!detailModal || !modalPanel || !modalTitle || !modalBody) {
        return;
      }
      if (activeSubUI && typeof activeSubUI.destroy === 'function') {
        activeSubUI.destroy();
        activeSubUI = null;
      }
      const liveArchive = buildLiveArchiveModal(previewKey);
      const skeletonArchive = !liveArchive && !liveSnapshot ? buildArchiveSkeletonModal(previewKey) : null;
      if (liveArchive) {
        modalPanel.classList.add('archive-mode');
        modalPanel.classList.toggle('vault-mode', previewKey === '储物仓库详细页');
        modalBody.className = previewKey === '储物仓库详细页' ? 'modal-body archive-body vault-body' : 'modal-body archive-body';
        if (modalLevel) modalLevel.textContent = '';
        if (modalPath) modalPath.textContent = '';
        modalTitle.textContent = liveArchive.title;
        if (modalSubtitle) modalSubtitle.textContent = '';
        if (modalSummary) modalSummary.textContent = '';
        modalBody.innerHTML = liveArchive.body;
        if (typeof liveArchive.onMount === 'function') {
          activeSubUI = liveArchive.onMount(modalBody);
        }
        return;
      }
      const liveRequiredKeys = new Set([
        '生命图谱详细页',
        '社会档案详细页',
        '所属势力详细页',
        '人物关系详细页',
        '情报库详细页',
        '武装工坊详细页',
        '储物仓库详细页',
        '第一武魂详细页',
        '第二武魂详细页',
        '血脉封印详细页',
        '编年史档案',
        '本地据点详情',
        '当前节点详情',
        '操作总线',
        '试炼与情报',
        '近期见闻',
        '世界状态总览',
        '势力矩阵总览',
        '我的阵营详情',
        '系统播报与日志',
        '怪物图鉴',
        '森林仇恨值'
      ]);
      if (!liveSnapshot && (liveRequiredKeys.has(previewKey) || String(previewKey || '').startsWith('地图节点：'))) {
        if (skeletonArchive) {
          const isVaultSkeleton = previewKey === '储物仓库详细页';
          modalPanel.classList.add('archive-mode');
          modalPanel.classList.toggle('vault-mode', isVaultSkeleton);
          modalBody.className = isVaultSkeleton ? 'modal-body archive-body vault-body' : 'modal-body archive-body';
          if (modalLevel) modalLevel.textContent = '';
          if (modalPath) modalPath.textContent = '';
          modalTitle.textContent = skeletonArchive.title;
          if (modalSubtitle) modalSubtitle.textContent = '';
          if (modalSummary) modalSummary.textContent = '';
          modalBody.innerHTML = skeletonArchive.body;
          return;
        }
        modalPanel.classList.add('archive-mode');
        modalPanel.classList.remove('vault-mode');
        modalBody.className = 'modal-body archive-body';
        if (modalLevel) modalLevel.textContent = '';
        if (modalPath) modalPath.textContent = '';
        modalTitle.textContent = previewKey || '详细信息';
        if (modalSubtitle) modalSubtitle.textContent = '';
        if (modalSummary) modalSummary.textContent = '';
        modalBody.innerHTML = '';
        return;
      }
      const archiveBuilder = archiveModalBuilders[previewKey];
      const isVaultModal = previewKey === '储物仓库详细页';
      if (archiveBuilder) {
        const view = archiveBuilder();
        modalPanel.classList.add('archive-mode');
        modalPanel.classList.toggle('vault-mode', isVaultModal);
        modalBody.className = isVaultModal ? 'modal-body archive-body vault-body' : 'modal-body archive-body';
        if (modalLevel) modalLevel.textContent = '';
        if (modalPath) modalPath.textContent = '';
        modalTitle.textContent = view.title;
        if (modalSubtitle) modalSubtitle.textContent = '';
        if (modalSummary) modalSummary.textContent = '';
        modalBody.innerHTML = view.body;
        return;
      }
      const config = previewMap[previewKey] || buildDynamicPreview(previewKey || '详细弹窗');
      modalPanel.classList.remove('archive-mode', 'vault-mode');
      modalBody.className = 'modal-body';
      if (modalLevel) modalLevel.textContent = '';
      if (modalPath) modalPath.textContent = '';
      modalTitle.textContent = config.title;
      if (modalSubtitle) modalSubtitle.textContent = '';
      if (modalSummary) modalSummary.textContent = '';
      modalBody.innerHTML = renderGenericModalBody(config);
    }

    function closeModal() {
      if (activeSubUI && typeof activeSubUI.destroy === 'function') {
        activeSubUI.destroy();
        activeSubUI = null;
      }
      mapDispatchContext = null;

      hideInventoryHoverPanel();
      currentModalPreviewKey = '';
      if (detailModal) detailModal.classList.remove('show', 'drawer-left');
      if (modalPanel) modalPanel.classList.remove('drawer-left', 'vault-mode');
      if (modalBody) modalBody.classList.remove('vault-body');
      if (detailModal) detailModal.setAttribute('aria-hidden', 'true');
    }

    function bindVueModalDelegation(mountEl) {
      if (!mountEl || mountEl.__mvuModalDelegationBound) return;
      mountEl.addEventListener('click', (event) => {
        const eventTarget = event.target instanceof Element ? event.target : (event.target && event.target.parentElement ? event.target.parentElement : null);
        const clickable = eventTarget ? eventTarget.closest('.clickable') : null;
        if (!clickable || !mountEl.contains(clickable)) return;

        const previewKey = clickable.dataset.preview;
        if (!previewKey) return;
        openModal(previewKey);
      });
      mountEl.__mvuModalDelegationBound = true;
    }

    document.addEventListener('click', (event) => {
      const eventTarget = event.target instanceof Element ? event.target : (event.target && event.target.parentElement ? event.target.parentElement : null);
      const clickable = eventTarget ? eventTarget.closest('.clickable') : null;
      const leftMount = document.getElementById('mvu-left-mount');
      const rightMount = document.getElementById('mvu-right-mount');
      const inLegacyShell = (canvas && canvas.contains(clickable)) || (splitOverlay && splitOverlay.contains(clickable));
      const inVueShell = (leftMount && leftMount.contains(clickable))
        || (rightMount && rightMount.contains(clickable))
        || !!(clickable && clickable.closest('.mvu-vue-wrapper'));

      if (!clickable || !(inLegacyShell || inVueShell)) return;
      const previewKey = clickable.dataset.preview;
      if (!previewKey) return;
      openModal(previewKey);
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (detailModal) detailModal.addEventListener('click', (event) => {
      const eventTarget = event.target instanceof Element ? event.target : (event.target && event.target.parentElement ? event.target.parentElement : null);
      const actionBtn = eventTarget ? eventTarget.closest('.armory-action-btn') : null;
      if (actionBtn && modalBody.contains(actionBtn)) {
        event.preventDefault();
        event.stopPropagation();
        if (!isSnapshotPlayerControlled(liveSnapshot)) {
          if (typeof window.alert === 'function') window.alert('当前为非玩家角色视角，仅允许浏览，不能进行装备/锻造等操作。');
          return;
        }
        const actionData = buildArmoryActionRequest(liveSnapshot, actionBtn.dataset.armoryAction || '');
        if (actionData && typeof window.sendToAI === 'function') {
          window.sendToAI(actionData.playerInput, actionData.systemPrompt, { requestKind: actionData.requestKind });
        }
        return;
      }

      const switchCharBtn = eventTarget ? eventTarget.closest('[data-mvu-switch-char]') : null;
      if (switchCharBtn && modalBody.contains(switchCharBtn)) {
        event.preventDefault();
        event.stopPropagation();
        const targetName = switchCharBtn.getAttribute('data-mvu-switch-char') || '';
        applyActiveCharacterSelection(targetName, { closeModal: true });
        return;
      }

      const pageBtn = eventTarget ? eventTarget.closest('[data-page-nav][data-page-section]') : null;
      if (pageBtn && modalBody.contains(pageBtn)) {
        event.preventDefault();
        event.stopPropagation();
        const sectionKey = pageBtn.getAttribute('data-page-section') || 'section';
        const nav = pageBtn.getAttribute('data-page-nav') || '';
        const stateKey = `${currentModalPreviewKey}::${sectionKey}`;
        const currentPage = Math.max(1, toNumber(modalPaginationState[stateKey], 1) || 1);
        if (nav === 'prev') modalPaginationState[stateKey] = Math.max(1, currentPage - 1);
        if (nav === 'next') modalPaginationState[stateKey] = currentPage + 1;
        renderModalContent(currentModalPreviewKey);
        return;
      }

      const previewClickable = eventTarget ? eventTarget.closest('.clickable[data-preview]') : null;
      if (previewClickable && modalBody.contains(previewClickable)) {
        event.preventDefault();
        event.stopPropagation();
        const previewKey = previewClickable.dataset.preview;
        if (previewKey) openModal(previewKey, { preserveMapDispatchContext: true });
        return;
      }

      if (event.target === detailModal) closeModal();
    });

    document.addEventListener('click', (event) => {
// =========================================================================
// 全局通知/Toast (取代浏览器原生的 alert)
// =========================================================================
window.MVU_Toast = {
  show(msg, type = 'info', duration = 3500) {
    let container = document.getElementById('mvu-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'mvu-toast-container';
      container.className = 'mvu-toast-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `mvu-toast ${type === 'error' ? 'error' : ''}`;
    toast.innerHTML = htmlEscape(msg).replace(/\n/g, '<br/>');

    const closeBtn = document.createElement('div');
    closeBtn.className = 'mvu-toast-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => {
      closeToast();
    };
    toast.appendChild(closeBtn);
    
    container.appendChild(toast);

    let hideTimeout;
    const closeToast = () => {
      if (hideTimeout) clearTimeout(hideTimeout);
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px) scale(0.95)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    };

    if (duration > 0) hideTimeout = setTimeout(closeToast, duration);
  }
};

// =========================================================================
// 装备与换装管理器 (Equipment Manager)
// 负责在前端直接处理物品栏与装备栏的对调、混穿约束验证，以及生成 JSON Patch
// =========================================================================
window.EquipmentManager = {
  async performEquip(charIndex, itemName) {
    const vars = typeof window.getAllVariables === 'function' ? await window.getAllVariables() : null;
    if (!vars || !vars.sd || !vars.sd.char) {
      window.MVU_Toast.show('获取角色数据失败，无法换装', 'error');
      return;
    }
    const charNames = Object.keys(vars.sd.char);
    const activeName = charNames[charIndex];
    if (!activeName) {
      window.MVU_Toast.show('未找到目标角色信息', 'error');
      return;
    }
    const activeChar = vars.sd.char[activeName];
    const inventory = activeChar.inventory || {};
    const equip = activeChar.equip || {};
    const soulBone = activeChar.soul_bone || {};
    const itemData = inventory[itemName];

    if (!itemData || (itemData.数量 || 0) <= 0) {
      window.MVU_Toast.show(`背包中未找到物品: ${itemName}`, 'error');
      return;
    }

    const slotInfo = this.parseEquipSlot(itemName, itemData);
    if (!slotInfo) {
      window.MVU_Toast.show(`【${itemName}】不可装备！`, 'error');
      return;
    }

    // --- 约束：不允许不同级别的斗铠混穿 ---
    if (slotInfo.mainSlot === 'armor') {
      const newTier = this.getArmorTier(itemName);
      if (newTier) {
        const armorParts = (equip.armor && equip.armor.parts) ? equip.armor.parts : {};
        for (const [key, piece] of Object.entries(armorParts)) {
          if (piece && typeof piece === 'object' && piece.name && piece.name !== '无' && key !== slotInfo.subSlot) {
            const pieceTier = this.getArmorTier(piece.name);
            if (pieceTier && pieceTier !== newTier) {
              window.MVU_Toast.show(`【换装失败】\n背包中的【${newTier}】不可与身上的【${pieceTier}】混穿！\n必须成套更换相同级别的斗铠。`, 'error');
              return;
            }
          }
        }
      }
    }
    
    // --- 约束：魂骨一经融合无法直接替换 ---
    if (slotInfo.mainSlot === 'soul_bone') {
      const existingBone = soulBone[slotInfo.subSlot];
      if (existingBone && typeof existingBone === 'object' && existingBone['名称'] && !existingBone['名称'].includes('未鉴定之')) {
        window.MVU_Toast.show(`【装载失败】\n${slotInfo.subSlot} 已融合了【${existingBone['名称']}】！\n魂骨一经融合无法直接替换，除非强行剥离！`, 'error');
        return;
      }
    }

    const patches = [];
    const charPath = `/sd/char/${this.escapePtr(activeName)}`;
    
    // 1. 扣除背包新装备
    const currentQty = itemData.数量 || 1;
    if (currentQty <= 1) {
      patches.push({ op: 'remove', path: `${charPath}/inventory/${this.escapePtr(itemName)}` });
    } else {
      patches.push({ op: 'replace', path: `${charPath}/inventory/${this.escapePtr(itemName)}/数量`, value: currentQty - 1 });
    }

    if (slotInfo.mainSlot === 'soul_bone') {
      // 魂骨装载路线：直接写入 soul_bone 下级节点
      const newBoneData = {
        名称: itemName,
        年限: itemData['年限'] || (itemData['品质'] && itemData['品质'].includes('万') ? 10000 : 1000),
        品质: itemData['品质'] || '常规',
        状态: '已装载'
      };
      patches.push({ op: 'add', path: `${charPath}/soul_bone/${slotInfo.subSlot}`, value: newBoneData });
    } else {
      // 常规装备更换路线
      let oldItem = null;
      let equipPath = `${charPath}/equip/${slotInfo.mainSlot}`;
      if (slotInfo.subSlot) {
        equipPath += `/parts/${slotInfo.subSlot}`;
        oldItem = equip[slotInfo.mainSlot]?.parts?.[slotInfo.subSlot];
      } else {
        oldItem = equip[slotInfo.mainSlot];
      }

      // 2. 取下旧装备（如果有）放入背包
      if (oldItem && typeof oldItem === 'object' && oldItem.name && oldItem.name !== '无') {
        const oldName = oldItem.name;
        const oldToInv = Object.assign({}, oldItem, { 数量: 1 });
        delete oldToInv.equip_status;
        
        if (inventory[oldName]) {
          patches.push({ op: 'replace', path: `${charPath}/inventory/${this.escapePtr(oldName)}/数量`, value: (inventory[oldName].数量 || 1) + 1 });
        } else {
          patches.push({ op: 'add', path: `${charPath}/inventory/${this.escapePtr(oldName)}`, value: oldToInv });
        }
      }

      // 3. 穿上新装备
      const newEquipData = Object.assign({}, itemData, { name: itemName });
      delete newEquipData.数量;
      if (slotInfo.subSlot && (!equip[slotInfo.mainSlot] || !equip[slotInfo.mainSlot].parts)) {
          patches.push({ op: 'add', path: `${charPath}/equip/${slotInfo.mainSlot}/parts`, value: {} });
      }

      if (oldItem !== undefined) {
        patches.push({ op: 'replace', path: equipPath, value: newEquipData });
      } else {
        patches.push({ op: 'add', path: equipPath, value: newEquipData });
      }
    }

    // 4. 提交到底层 MVU
    this.submitPatch(patches, itemName);
  },

  parseEquipSlot(name, data) {
    const tName = name || '';
    // 匹配斗铠部件
    if (/头盔|头骨/.test(tName)) return { mainSlot: 'armor', subSlot: '头盔' };
    if (/胸铠|躯干骨/.test(tName)) return { mainSlot: 'armor', subSlot: '胸铠' };
    if (/左肩/.test(tName)) return { mainSlot: 'armor', subSlot: '左肩' };
    if (/右肩/.test(tName)) return { mainSlot: 'armor', subSlot: '右肩' };
    if (/左臂/.test(tName)) return { mainSlot: 'armor', subSlot: '左臂' };
    if (/右臂/.test(tName)) return { mainSlot: 'armor', subSlot: '右臂' };
    if (/左手|手骨/.test(tName)) return { mainSlot: 'armor', subSlot: '左臂' }; // 容错兼容
    if (/右手/.test(tName)) return { mainSlot: 'armor', subSlot: '右臂' }; // 容错兼容
    if (/左腿|左腿骨/.test(tName)) return { mainSlot: 'armor', subSlot: '左腿' };
    if (/右腿|右腿骨/.test(tName)) return { mainSlot: 'armor', subSlot: '右腿' };
    if (/战裙/.test(tName)) return { mainSlot: 'armor', subSlot: '战裙' };
    if (/战靴/.test(tName)) return { mainSlot: 'armor', subSlot: '战靴' };
    if (/戒指/.test(tName)) return { mainSlot: 'armor', subSlot: '戒指' };
    
    // 匹配魂骨
    if (tName.includes('头部魂骨') || /头骨/.test(tName)) return { mainSlot: 'soul_bone', subSlot: '头部魂骨' };
    if (tName.includes('躯干魂骨') || /躯干骨/.test(tName)) return { mainSlot: 'soul_bone', subSlot: '躯干魂骨' };
    if (tName.includes('左臂魂骨') || /左臂骨/.test(tName)) return { mainSlot: 'soul_bone', subSlot: '左臂魂骨' };
    if (tName.includes('右臂魂骨') || /右臂骨/.test(tName)) return { mainSlot: 'soul_bone', subSlot: '右臂魂骨' };
    if (tName.includes('左腿魂骨') || /左腿骨/.test(tName)) return { mainSlot: 'soul_bone', subSlot: '左腿魂骨' };
    if (tName.includes('右腿魂骨') || /右腿骨/.test(tName)) return { mainSlot: 'soul_bone', subSlot: '右腿魂骨' };
    
    // 匹配其他品类
    if (/机甲/.test(tName)) return { mainSlot: 'mech', subSlot: null };
    if (/(剑|刀|枪|炮|弓|盾|锤|暗器|匕首)$/.test(tName)) return { mainSlot: 'wpn', subSlot: null };
    
    return null;
  },

  getArmorTier(name) {
    if (name.includes('一字')) return '一字斗铠';
    if (name.includes('二字')) return '二字斗铠';
    if (name.includes('三字')) return '三字斗铠';
    if (name.includes('四字')) return '四字斗铠';
    return null;
  },

  escapePtr(str) {
    return String(str).replace(/~/g, '~0').replace(/\//g, '~1');
  },

  submitPatch(patches, itemName) {
    if (typeof window.sendToAI === 'function') {
      const prompt = `[前端换装请求]\n动作: 角色穿戴了 ${itemName}\n请将以下 JSON Patch 静默应用到底层变量中，这完成了备用装备与当前装备的互相替换。\n<UpdateVariable>\n${JSON.stringify(patches, null, 2)}\n</UpdateVariable>\n此操作已通过前端换装规则约束校验。`;
      window.sendToAI(`我要换装：穿戴 ${itemName}`, prompt, { requestKind: 'equip_swap' });
    } else {
      console.log("【模拟换装Patch】", patches);
      window.MVU_Toast.show('已生成换装 JSON Patch (见控制台)，但未连接到酒馆通信接口。', 'info');
    }
  }
};

      const eventTarget = event.target instanceof Element ? event.target : (event.target && event.target.parentElement ? event.target.parentElement : null);
      const actionBtn = eventTarget ? eventTarget.closest('.map-dispatch-action-btn') : null;
      if (!actionBtn) return;

      event.preventDefault();
      event.stopPropagation();

      const detail = {
        action: actionBtn.dataset.action || '',
        target: actionBtn.dataset.target || '',
        currentLoc: actionBtn.dataset.currentLoc || '',
        npcTarget: actionBtn.dataset.npcTarget || '',
        executorType: actionBtn.dataset.executorType || '',
        services: (actionBtn.dataset.services || '').split('|').filter(Boolean)
      };

      window.dispatchEvent(new CustomEvent('map-action-dispatch', { detail }));
    }, true);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeModal();
    });

    bindVueModalDelegation(document.getElementById('mvu-left-mount'));
    bindVueModalDelegation(document.getElementById('mvu-right-mount'));

    initLiveBindings();
  
window.mvuSetMainTabExternal = setMainTab;
window.mvuSetMainTab = setMainTab;
