
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

    let modalStack = [];
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
        actions: ['查看关系路线', '查看关系推进重点', '闲聊 / 送礼 / 请教 / 切磋 / 表白']
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


    function buildStatsBonusItems(statsBonus, options = {}) {
      const bonus = statsBonus && typeof statsBonus === 'object' ? statsBonus : {};
      const items = [];
      if (options.includeLvEquiv && toNumber(bonus.lv_equiv, 0) > 0) items.push({ label: '等效等级', value: String(toNumber(bonus.lv_equiv, 0)) });
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
      if (!snapshot || !snapshot.rootData) return null;
      if (!isSnapshotPlayerControlled(snapshot)) return null;
      const activeKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
      if (!activeKey) return null;
      const chars = deepGet(snapshot, 'rootData.char', {});
      const activeChar = chars && typeof chars === 'object' ? (chars[activeKey] || {}) : {};
      const activeName = toText(activeChar && (activeChar.name || deepGet(activeChar, 'base.name', '')), toText(snapshot.activeName, activeKey));
      const currentLoc = toText(deepGet(activeChar, 'status.loc', snapshot.currentLoc || '当前位置'), '当前位置').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '');
      const armor = deepGet(activeChar, 'equip.armor', {});
      const mech = deepGet(activeChar, 'equip.mech', {});
      const weapon = deepGet(activeChar, 'equip.wpn', {});
      const accessoryEntries = listAccessoryEntries(deepGet(activeChar, 'equip.accessories', {}));
      const armorName = toText(armor.name || armor['名称'], '当前斗铠');
      const mechName = toText(mech.name || mech['名称'] || mech.type || mech['型号'], '当前机甲');
      const actionMap = {
        equip_mech: { title: '装备机甲', playerInput: `我要在【${currentLoc}】装备机甲【${mechName}】。`, note: `请按 MVU 装备规则将 char.equip.mech.equip_status 处理为“已装备”。若当前斗铠已装备且机甲不是红级，请同步处理斗铠卸下并清空对应 _stats_bonus。` },
        unequip_mech: { title: '卸下机甲', playerInput: `我要在【${currentLoc}】解除机甲【${mechName}】的装载。`, note: `请将 char.equip.mech.equip_status 处理为“未装备”，并将 mech._stats_bonus 清零。` },
        equip_armor: { title: '穿戴斗铠', playerInput: `我要在【${currentLoc}】穿戴斗铠【${armorName}】。`, note: `请按 MVU 装备规则尝试将 char.equip.armor.equip_status 处理为“已装备”。需要校验斗铠等级门槛（1字50级/2字70级/3字80级/4字90级）；若不满足则保持未装备并写入装备反噬。若当前已装备非红级机甲，斗铠不能保持已装备。` },
        unequip_armor: { title: '卸下斗铠', playerInput: `我要在【${currentLoc}】解除斗铠【${armorName}】的装备状态。`, note: `请将 char.equip.armor.equip_status 处理为“未装备”，并将 armor._stats_bonus 清零。` }
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
              data-hover-trigger="${attr(item.trigger || '--')}"
              data-hover-expiry="${attr(item.expiry || '--')}"
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
    const modalFocusState = Object.create(null);

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
            <div class="archive-modal-grid life-graph-grid">
              <div class="archive-card life-growth-card">
                <div class="archive-card-head"><div class="archive-card-title">成长信息</div></div>
                <div class="identity-growth-grid">
                  <div class="meta-item"><b>等级</b><span></span></div>
                  <div class="meta-item"><b>精神境界</b><span></span></div>
                  <div class="meta-item"><b>天赋梯队</b><span></span></div>
                  <div class="meta-item"><b>系别</b><span></span></div>
                </div>
              </div>
              <div class="archive-card life-profile-card">
                <div class="archive-card-head"><div class="archive-card-title">角色名片</div></div>
                <div class="profile-snapshot life-profile-snapshot">
                  <div class="identity-card">
                    <h3>当前角色</h3>
                    <div class="identity-panel">
                      <div class="identity-panel-title">基础描述</div>
                      <div class="identity-basic-grid">
                        <div class="meta-item"><b>年龄 / 性别</b><span></span></div>
                        <div class="meta-item"><b>性格</b><span></span></div>
                        <div class="meta-item meta-item-wide"><b>名望</b><span></span></div>
                      </div>
                    </div>
                    <div class="identity-panel identity-appearance-panel">
                      <div class="identity-panel-title">外貌概览</div>
                      <div class="identity-appearance-grid">
                        <div class="meta-item"><b>发色</b><span></span></div>
                        <div class="meta-item"><b>瞳色</b><span></span></div>
                        <div class="meta-item"><b>身高</b><span></span></div>
                        <div class="meta-item"><b>体型</b><span></span></div>
                        <div class="meta-item meta-item-wide"><b>特征</b><span></span></div>
                      </div>
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
    let activeInlineEditState = null;
    let pendingLiveRefresh = false;
    let skillDesignerDraftStateByPreviewKey = Object.create(null);

    function htmlEscape(value) {
      return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function hasUiPlaceholderToken(value) {
      const text = String(value === undefined || value === null ? '' : value).trim();
      return !!text && (/待补全|待补充|TODO/i.test(text));
    }

    function toText(value, fallback = '无') {
      if (value === undefined || value === null || value === '') return fallback;
      const text = String(value);
      return hasUiPlaceholderToken(text) ? fallback : text;
    }

    function toNumber(value, fallback = 0) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    }

    function isSkillDesignerPreviewKey(previewKey = '') {
      return String(previewKey || '').startsWith('技能设计台：');
    }

    function readCachedSkillDesignerDraft(previewKey = '') {
      const key = String(previewKey || '').trim();
      if (!key) return null;
      const draft = skillDesignerDraftStateByPreviewKey[key];
      return draft && typeof draft === 'object' ? cloneJsonValue(draft) : null;
    }

    function writeCachedSkillDesignerDraft(previewKey = '', draft = {}) {
      const key = String(previewKey || '').trim();
      if (!key) return;
      skillDesignerDraftStateByPreviewKey[key] = cloneJsonValue(draft && typeof draft === 'object' ? draft : {});
    }

    function clearCachedSkillDesignerDraft(previewKey = '') {
      const key = String(previewKey || '').trim();
      if (!key) return;
      delete skillDesignerDraftStateByPreviewKey[key];
    }

    function clearCachedSkillDesignerDrafts(previewKeys = []) {
      (Array.isArray(previewKeys) ? previewKeys : []).forEach(previewKey => {
        if (isSkillDesignerPreviewKey(previewKey)) clearCachedSkillDesignerDraft(previewKey);
      });
    }

    function formatTickToCalendarDateText(tickValue) {
      const safeTick = Math.max(0, toNumber(tickValue, 0));
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

    function cloneJsonValue(value, fallback = {}) {
      try {
        return structuredClone(value);
      } catch (error) {}
      try {
        return JSON.parse(JSON.stringify(value));
      } catch (error) {}
      return fallback;
    }

    function normalizeEditorPath(pathValue) {
      if (Array.isArray(pathValue)) {
        return pathValue
          .map(token => (typeof token === 'number' ? token : String(token ?? '').trim()))
          .filter(token => token !== '' && token !== null && token !== undefined);
      }
      const raw = String(pathValue ?? '')
        .trim()
        .replace(/^stat_data\./, '')
        .replace(/\[(\d+)\]/g, '.$1')
        .replace(/\["([^"]+)"\]/g, '.$1')
        .replace(/\['([^']+)'\]/g, '.$1');
      if (!raw) return [];
      return raw
        .split('.')
        .map(token => token.trim())
        .filter(Boolean)
        .map(token => (/^\d+$/.test(token) ? Number(token) : token));
    }

    function deepSetMutable(target, pathValue, nextValue) {
      const path = normalizeEditorPath(pathValue);
      if (!target || typeof target !== 'object' || !path.length) {
        throw new Error('变量路径不能为空。');
      }
      let current = target;
      for (let index = 0; index < path.length; index += 1) {
        const token = path[index];
        const isLast = index === path.length - 1;
        if (isLast) {
          current[token] = nextValue;
          return target;
        }
        const nextToken = path[index + 1];
        if (!current[token] || typeof current[token] !== 'object') {
          current[token] = typeof nextToken === 'number' ? [] : {};
        }
        current = current[token];
      }
      return target;
    }

    function normalizeEditorStringList(rawValue) {
      if (Array.isArray(rawValue)) {
        return rawValue.map(item => toText(item, '').trim()).filter(Boolean);
      }
      return String(rawValue ?? '')
        .split(/[\n,，、]+/g)
        .map(item => item.trim())
        .filter(Boolean);
    }

    function parseEditorInputValue(rawValue, kind = 'string') {
      const safeKind = String(kind || 'string').trim().toLowerCase();
      const text = String(rawValue ?? '');
      if (safeKind === 'number') {
        const normalized = text.trim().replace(/,/g, '');
        if (!normalized) throw new Error('数字字段不能为空。');
        const parsed = Number(normalized);
        if (!Number.isFinite(parsed)) throw new Error(`无法识别数字：${text}`);
        return parsed;
      }
      if (safeKind === 'boolean') {
        const normalized = text.trim().toLowerCase();
        if (['true', '1', 'yes', 'y', '是', '开'].includes(normalized)) return true;
        if (['false', '0', 'no', 'n', '否', '关'].includes(normalized)) return false;
        throw new Error(`无法识别布尔值：${text}`);
      }
      if (safeKind === 'json') {
        const normalized = text.trim();
        if (!normalized) return null;
        return JSON.parse(normalized);
      }
      if (safeKind === 'string_list') {
        return normalizeEditorStringList(text);
      }
      if (safeKind === 'null') return null;
      return text;
    }

    function formatEditorValue(value, kind = 'string') {
      if (value === undefined || value === null) return '';
      if (String(kind || 'string').trim().toLowerCase() === 'string_list') {
        return normalizeEditorStringList(value).join('、');
      }
      if (kind === 'json') {
        try {
          return JSON.stringify(value, null, 2);
        } catch (error) {
          return String(value);
        }
      }
      if (typeof value === 'object') {
        try {
          return JSON.stringify(value, null, 2);
        } catch (error) {
          return String(value);
        }
      }
      return String(value);
    }

    function makeInlineEditableValue(displayText, options = {}) {
      const path = Array.isArray(options.path) ? options.path : normalizeEditorPath(options.path);
      if (!path.length) return htmlEscape(displayText);
      const kind = toText(options.kind, 'string');
      const rawValue = options.rawValue !== undefined ? options.rawValue : displayText;
      const className = toText(options.className, '').trim();
      const classAttr = className ? ` ${className}` : '';
      return `<span class="mvu-inline-editable${classAttr}" tabindex="0" data-inline-editable="1" data-value-kind="${escapeHtmlAttr(kind)}" data-mvu-path="${escapeHtmlAttr(JSON.stringify(path))}" data-mvu-raw-value="${escapeHtmlAttr(formatEditorValue(rawValue, kind))}">${htmlEscape(displayText)}</span>`;
    }

    function showUiToast(message, type = 'info', duration = 3200) {
      try {
        if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') {
          window.MVU_Toast.show(message, type, duration);
          return;
        }
      } catch (error) {}
      if (type === 'error') {
        console.warn('[DragonUI]', message);
        if (typeof window.alert === 'function') window.alert(message);
      } else {
        console.log('[DragonUI]', message);
      }
    }

    const MVU_EDITOR_STORE_COMMIT_DELAY = 140;
    const mvuEditorStore = {
      statData: null,
      signature: '',
      dirty: false,
      version: 0,
      flushing: false,
      flushPromise: null,
      pendingTimer: 0,
      pendingWaiters: [],
    };

    function clearMvuEditorStorePendingTimer() {
      if (!mvuEditorStore.pendingTimer) return;
      try {
        window.clearTimeout(mvuEditorStore.pendingTimer);
      } catch (error) {}
      mvuEditorStore.pendingTimer = 0;
    }

    function settleMvuEditorStoreWaiters(error, value) {
      const waiters = Array.isArray(mvuEditorStore.pendingWaiters) ? mvuEditorStore.pendingWaiters.splice(0) : [];
      waiters.forEach(waiter => {
        if (!waiter) return;
        if (error) {
          try { waiter.reject(error); } catch (_) {}
          return;
        }
        try { waiter.resolve(value); } catch (_) {}
      });
    }

    function serializeMvuEditorStoreStatData(statData) {
      try {
        return JSON.stringify(statData == null ? null : statData);
      } catch (error) {
        return `__mvu_editor_store__${Date.now()}_${Math.random().toString(36).slice(2)}`;
      }
    }

    function writeMvuEditorStoreSnapshot(statData, options = {}) {
      const safeStatData = statData && typeof statData === 'object' ? cloneJsonValue(statData, {}) : {};
      mvuEditorStore.statData = safeStatData;
      mvuEditorStore.signature = serializeMvuEditorStoreStatData(safeStatData);
      if (!options.keepDirty) mvuEditorStore.dirty = false;
      return mvuEditorStore.statData;
    }

    function syncMvuEditorStoreFromRoot(statData, options = {}) {
      const safeStatData = statData && typeof statData === 'object' ? statData : {};
      const nextSignature = serializeMvuEditorStoreStatData(safeStatData);
      if (!options.force && mvuEditorStore.dirty) return false;
      if (!options.force && nextSignature === mvuEditorStore.signature) return false;
      writeMvuEditorStoreSnapshot(safeStatData);
      return true;
    }

    async function readLatestMvuDataByEditor() {
      await waitForMvuReady();
      const host = getMvuHost();
      if (!host || typeof host.getMvuData !== 'function' || typeof host.replaceMvuData !== 'function') {
        throw new Error('未找到可用的 MVU 写回接口。');
      }
      const currentMvuData = await Promise.resolve(host.getMvuData({ type: 'message', message_id: 'latest' }));
      if (!currentMvuData || typeof currentMvuData !== 'object') {
        throw new Error('读取当前 MVU 数据失败。');
      }
      const safeMvuData = cloneJsonValue(currentMvuData, {});
      if (!safeMvuData.stat_data || typeof safeMvuData.stat_data !== 'object') {
        safeMvuData.stat_data = {};
      }
      return { host, mvuData: safeMvuData };
    }

    async function ensureMvuEditorStoreReady(options = {}) {
      if (!options.force && mvuEditorStore.dirty && mvuEditorStore.statData && typeof mvuEditorStore.statData === 'object') {
        return mvuEditorStore.statData;
      }
      const { mvuData } = await readLatestMvuDataByEditor();
      return writeMvuEditorStoreSnapshot(mvuData.stat_data);
    }

    async function flushMvuEditorStore(options = {}) {
      clearMvuEditorStorePendingTimer();
      if (!mvuEditorStore.dirty) {
        settleMvuEditorStoreWaiters(null, mvuEditorStore.statData);
        return mvuEditorStore.statData;
      }
      if (mvuEditorStore.flushing && mvuEditorStore.flushPromise) {
        return mvuEditorStore.flushPromise.then(result => {
          if (mvuEditorStore.dirty) return flushMvuEditorStore(options);
          return result;
        });
      }
      mvuEditorStore.flushing = true;
      mvuEditorStore.flushPromise = (async () => {
        const flushVersion = mvuEditorStore.version;
        const flushStatData = cloneJsonValue(mvuEditorStore.statData, {});
        const { host, mvuData } = await readLatestMvuDataByEditor();
        const nextMvuData = cloneJsonValue(mvuData, {});
        nextMvuData.stat_data = flushStatData;
        await Promise.resolve(host.replaceMvuData(nextMvuData, { type: 'message', message_id: 'latest' }));
        if (mvuEditorStore.version === flushVersion) {
          mvuEditorStore.dirty = false;
          mvuEditorStore.signature = serializeMvuEditorStoreStatData(flushStatData);
        }
        if (options.refresh !== false) {
          await refreshLiveSnapshot();
        }
        settleMvuEditorStoreWaiters(null, nextMvuData);
        return nextMvuData;
      })().catch(error => {
        settleMvuEditorStoreWaiters(error);
        throw error;
      }).finally(() => {
        mvuEditorStore.flushing = false;
        mvuEditorStore.flushPromise = null;
        if (mvuEditorStore.dirty && !mvuEditorStore.pendingTimer) {
          scheduleMvuEditorStoreFlush(0).catch(() => {});
        }
      });
      return mvuEditorStore.flushPromise;
    }

    function scheduleMvuEditorStoreFlush(delay = MVU_EDITOR_STORE_COMMIT_DELAY) {
      clearMvuEditorStorePendingTimer();
      return new Promise((resolve, reject) => {
        mvuEditorStore.pendingWaiters.push({ resolve, reject });
        mvuEditorStore.pendingTimer = window.setTimeout(() => {
          mvuEditorStore.pendingTimer = 0;
          flushMvuEditorStore().catch(() => {});
        }, Math.max(0, toNumber(delay, MVU_EDITOR_STORE_COMMIT_DELAY)));
      });
    }

    async function mutateStatDataByEditor(mutator, options = {}) {
      if (typeof mutator !== 'function') throw new Error('变量更新器必须是函数。');
      await ensureMvuEditorStoreReady({ force: !!options.force });
      const nextStatData = cloneJsonValue(mvuEditorStore.statData, {});
      await Promise.resolve(mutator(nextStatData));
      mvuEditorStore.statData = nextStatData;
      mvuEditorStore.signature = serializeMvuEditorStoreStatData(nextStatData);
      mvuEditorStore.dirty = true;
      mvuEditorStore.version += 1;
      if (options.immediate === false) {
        return scheduleMvuEditorStoreFlush(options.delay);
      }
      return flushMvuEditorStore(options);
    }

    async function replaceStatDataByEditor(updates, options = {}) {
      const safeUpdates = Array.isArray(updates) ? updates.filter(item => item && item.path) : [];
      if (!safeUpdates.length) throw new Error('没有可写回的变量更新。');
      return mutateStatDataByEditor(statData => {
        safeUpdates.forEach(({ path, value }) => {
          deepSetMutable(statData, path, value);
        });
      }, options);
    }

    function normalizeInlineComparableValue(value, kind = 'string') {
      const safeKind = String(kind || 'string').trim().toLowerCase();
      if (safeKind === 'number') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? String(parsed) : '';
      }
      if (safeKind === 'string_list') {
        return normalizeEditorStringList(value).join('、');
      }
      if (safeKind === 'boolean') {
        return String(['true', '1', 'yes', 'y', '是', '开'].includes(String(value ?? '').trim().toLowerCase()));
      }
      return String(value ?? '');
    }

    function restoreInlineEditState(state = activeInlineEditState) {
      if (!state) return;
      if (activeInlineEditState === state) activeInlineEditState = null;
      if (state.inputEl && state.inputEl.isConnected) {
        state.inputEl.replaceWith(state.displayEl);
      }
    }

    function hasActiveInlineEdit() {
      return !!(activeInlineEditState && activeInlineEditState.inputEl && activeInlineEditState.inputEl.isConnected);
    }

    function hasFocusedEditorControl() {
      const activeEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (!activeEl) return false;
      if (activeEl.classList.contains('mvu-inline-editor-input')) return true;
      if (!activeEl.closest('.mvu-editor-form, .skill-designer-form')) return false;
      return activeEl.matches('input, textarea, select');
    }

    function hasOpenSkillDesignerModal() {
      return !!(detailModal && detailModal.classList.contains('show') && isSkillDesignerPreviewKey(currentModalPreviewKey));
    }

    function shouldPauseLiveRefresh(options = {}) {
      if (options && options.force) return false;
      return hasActiveInlineEdit() || hasFocusedEditorControl() || hasOpenSkillDesignerModal();
    }

    function flushPendingLiveRefresh(options = {}) {
      const force = !!(options && options.force);
      if (!pendingLiveRefresh && !force) return;
      pendingLiveRefresh = false;
      window.setTimeout(() => {
        refreshLiveSnapshot({ force: true });
      }, 0);
    }

    function cancelActiveInlineEdit() {
      restoreInlineEditState(activeInlineEditState);
    }

    async function commitInlineEditState(state) {
      if (!state || state.committing) return;
      state.committing = true;
      let nextValue;
      try {
        nextValue = parseEditorInputValue(state.inputEl ? state.inputEl.value : '', state.kind);
      } catch (error) {
        restoreInlineEditState(state);
        showUiToast(error && error.message ? error.message : '变量格式不正确。', 'error', 4200);
        flushPendingLiveRefresh();
        return;
      }
      const previousComparable = normalizeInlineComparableValue(state.rawValue, state.kind);
      const nextComparable = normalizeInlineComparableValue(nextValue, state.kind);
      restoreInlineEditState(state);
      if (previousComparable === nextComparable) {
        flushPendingLiveRefresh();
        return;
      }
      try {
        await replaceStatDataByEditor([{ path: state.path, value: nextValue }]);
      } catch (error) {
        showUiToast(error && error.message ? error.message : '变量写回失败。', 'error', 4200);
      } finally {
        flushPendingLiveRefresh({ force: true });
      }
    }

    function beginInlineEdit(target) {
      if (!target || !(target instanceof HTMLElement)) return;
      if (activeInlineEditState && activeInlineEditState.displayEl === target) return;
      cancelActiveInlineEdit();

      let path = [];
      try {
        path = JSON.parse(target.getAttribute('data-mvu-path') || '[]');
      } catch (error) {}
      if (!Array.isArray(path) || !path.length) return;

      const kind = target.getAttribute('data-value-kind') || 'string';
      const rawValue = target.getAttribute('data-mvu-raw-value') ?? target.textContent ?? '';
      const rect = target.getBoundingClientRect();
      const input = document.createElement('input');
      input.className = 'mvu-inline-editor-input';
      input.type = kind === 'number' ? 'number' : 'text';
      if (kind === 'number') input.step = 'any';
      input.value = formatEditorValue(rawValue, kind);
      input.style.width = `${Math.max(56, Math.ceil(rect.width) + 18)}px`;

      const state = {
        displayEl: target,
        inputEl: input,
        path,
        kind,
        rawValue,
        committing: false,
      };
      activeInlineEditState = state;

      input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();
          commitInlineEditState(state);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          restoreInlineEditState(state);
          flushPendingLiveRefresh();
        }
      });
      input.addEventListener('click', event => {
        event.stopPropagation();
      });
      input.addEventListener('blur', () => {
        commitInlineEditState(state);
      });

      target.replaceWith(input);
      input.focus();
      input.select();
    }

    function bindInlineEditing() {
      if (window.__mvuInlineEditingBound) return;
      window.__mvuInlineEditingBound = true;

      document.addEventListener('click', event => {
        const eventTarget = event.target instanceof Element ? event.target : null;
        if (!eventTarget) return;
        if (eventTarget.closest('.mvu-inline-editor-input')) {
          event.stopPropagation();
          return;
        }
        const inlineTarget = eventTarget.closest('[data-inline-editable="1"]');
        if (!inlineTarget) return;
        event.preventDefault();
        event.stopPropagation();
        beginInlineEdit(inlineTarget);
      }, true);

      document.addEventListener('keydown', event => {
        const eventTarget = event.target instanceof Element ? event.target : null;
        if (!eventTarget) return;
        if (eventTarget.classList.contains('mvu-inline-editor-input')) return;
        const inlineTarget = eventTarget.closest('[data-inline-editable="1"]');
        if (!inlineTarget) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          event.stopPropagation();
          beginInlineEdit(inlineTarget);
        }
      }, true);
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
        if (item.stat_data && typeof item.stat_data === 'object' && (item.stat_data.char || item.stat_data.world || item.stat_data.sys)) {
          return item.stat_data;
        }
        if (item.char || item.world || item.sys || item.org || item.map) {
          return item;
        }
      }
      return null;
    }

    function buildEffectiveSd(rawSd) {
      if (!rawSd || typeof rawSd !== 'object') return { rootData: null, rawData: null };

      return {
        rootData: {
          sys: rawSd.sys || {},
          world: rawSd.world || {},
          org: rawSd.org || {},
          map: rawSd.map || {},
          char: rawSd.char || {}
        },
        rawData: rawSd
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
      const playerName = toText(deepGet(snapshot, 'rootData.sys.player_name', ''), '').trim();
      const activeName = toText(snapshot && snapshot.activeName, '').trim();
      return isPlayerCharacterEntry(activeName, deepGet(snapshot, 'activeChar', {}), playerName);
    }

    function formatAppearanceMeta(appearance) {
      const data = appearance && typeof appearance === 'object' ? appearance : {};
      const features = Array.isArray(data['特殊特征'])
        ? data['特殊特征'].map(item => toText(item, '').trim()).filter(Boolean)
        : [];
      return {
        hair: toText(data['发色'], '未设定') || '未设定',
        eyes: toText(data['瞳色'], '未设定') || '未设定',
        height: toText(data['身高'], '未设定') || '未设定',
        build: toText(data['体型'], '未设定') || '未设定',
        features: features.length ? features.join('、') : '未设定'
      };
    }

    function formatAppearanceText(appearance) {
      const meta = formatAppearanceMeta(appearance);
      const parts = [
        meta.hair,
        meta.eyes,
        meta.height,
        meta.build
      ].filter(Boolean).filter(item => item !== '未设定');
      const featureText = meta.features && meta.features !== '未设定' ? `；特征：${meta.features}` : '';
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

    function isTodoPlaceholderText(value) {
      return hasUiPlaceholderToken(value);
    }

    function normalizeSkillUiText(value, fallback = '未知') {
      const text = toText(value, '').replace(/\[后台推演\]\s*/g, '').trim();
      if (!text || text === '无' || text === '未生成' || isTodoPlaceholderText(text)) return fallback;
      return text;
    }

    function summarizeUsageLikeArray(effectArray) {
      const entries = Array.isArray(effectArray) ? effectArray : [];
      const packedNames = entries
        .map(effect => toText(effect && effect['机制'], '').trim())
        .filter(Boolean)
        .filter(name => name !== '系统基础');
      if (packedNames.length) return packedNames.join(' / ');
      const descNames = entries
        .map(effect => toText(effect && effect['description'], '').trim())
        .filter(Boolean);
      return descNames.length ? descNames.slice(0, 3).join(' / ') : '未知';
    }

    function summarizeConstructEffectUi(effect) {
      const itemName = normalizeSkillUiText(effect && effect['产物名称'], '临时造物');
      const itemType = normalizeSkillUiText(effect && effect['产物类型'], '造物');
      const triggerMode = normalizeSkillUiText(effect && effect['触发方式'], itemType === '食物' ? '食用' : '使用');
      const expiry = resolveExpiryUiText(effect, '');
      const usageSummary = summarizeUsageLikeArray(effect && effect['使用效果']);
      const header = itemType === '食物' ? `生成食物【${itemName}】` : `生成造物【${itemName}】`;
      return [
        header,
        triggerMode ? `触发:${triggerMode}` : '',
        expiry ? `有效期:${expiry}` : '',
        usageSummary !== '未知' ? `${triggerMode === '食用' ? '食用后' : '使用后'}:${usageSummary}` : ''
      ].filter(Boolean).join(' / ');
    }

    function extractConstructEffectMeta(effectArray) {
      const createEffect = (Array.isArray(effectArray) ? effectArray : []).find(effect => {
        const mech = toText(effect && effect['机制'], '').trim();
        return mech === '生成造物' || mech === '造物生成';
      });
      if (!createEffect) return null;
      return { summary: summarizeConstructEffectUi(createEffect) };
    }

    const SKILL_DESIGNER_PREVIEW_PREFIX = '技能设计台：';
    const SKILL_SUMMARY_EFFECT_MECHANISM_SET = new Set(['属性摘要', '构型摘要', '术式摘要', '极性摘要', '属性系数摘要', '机制参数摘要']);
    const SKILL_DESIGNER_SKILL_TYPES = Object.freeze(['强攻系', '控制系', '食物系', '精神系', '防御系', '敏攻系', '元素系', '辅助系', '治疗系', '被动', '融合技', '功法', '特长']);
    const SKILL_DESIGNER_TARGET_OPTIONS = Object.freeze(['自身', '友方单体', '友方群体', '敌方单体', '敌方群体', '全场', '食用者', '使用者', '召唤物', '造物']);
    const SKILL_DESIGNER_MAIN_MECHANIC_POOL = Object.freeze({
      '伤害类': Object.freeze(['单体伤害', '群体伤害', '多段伤害', '延迟爆发', '持续伤害']),
      '控制类': Object.freeze(['硬控', '软控', '位移限制', '节奏打断']),
      '削弱类': Object.freeze(['单属性削弱', '多属性削弱', '禁疗', '消耗提高', '前摇拉长', '掌控压制', '速度压制']),
      '增益类': Object.freeze(['单属性增益', '多属性增益', '全属性增益', '消耗降低', '前摇缩短', '掌控提升', '速度提升']),
      '防御类': Object.freeze(['护盾', '减伤', '格挡/抵消', '霸体', '免死/锁血']),
      '回复类': Object.freeze(['体力恢复', '魂力恢复', '精神恢复', '持续恢复', '净化/解控']),
      '感知/认知类': Object.freeze(['感知干扰', '标记锁定', '共享视野', '幻境', '催眠', '认知扭曲']),
      '位移类': Object.freeze(['自身位移', '强制位移', '位移交换', '追击位移', '脱离位移']),
      '特殊规则类': Object.freeze(['复制', '反制', '转化', '状态交换', '强制绑定/锁定', '条件触发', '规则改写']),
    });
    const SKILL_DESIGNER_DELIVERY_FORM_POOL = Object.freeze(['直接生效', '自身附体', '远程命中', '范围展开', '召唤承载', '造物承载', '标记触发', '延迟触发']);
    const SKILL_DESIGNER_DELIVERY_FORM_BY_TYPE = Object.freeze({
      '强攻系': Object.freeze(['直接生效', '自身附体', '远程命中']),
      '控制系': Object.freeze(['直接生效', '范围展开', '延迟触发', '标记触发']),
      '食物系': Object.freeze(['造物承载', '延迟触发', '远程命中']),
      '精神系': Object.freeze(['直接生效', '标记触发', '延迟触发', '范围展开']),
      '防御系': Object.freeze(['自身附体', '直接生效', '范围展开']),
      '敏攻系': Object.freeze(['直接生效', '远程命中', '自身附体']),
      '元素系': Object.freeze(['远程命中', '范围展开', '延迟触发', '直接生效']),
      '辅助系': Object.freeze(['直接生效', '范围展开', '标记触发']),
      '治疗系': Object.freeze(['直接生效', '范围展开', '标记触发']),
    });
    const SKILL_DESIGNER_ATTRIBUTE_HINTS_BY_TYPE = Object.freeze({
      '强攻系': Object.freeze(['力量', '魂力', '防御']),
      '控制系': Object.freeze(['魂力', '精神力', '敏捷']),
      '食物系': Object.freeze(['魂力', '精神力']),
      '精神系': Object.freeze(['精神力', '魂力']),
      '防御系': Object.freeze(['防御', '魂力']),
      '敏攻系': Object.freeze(['敏捷', '力量', '魂力']),
      '元素系': Object.freeze(['精神力', '魂力', '敏捷']),
      '辅助系': Object.freeze(['魂力', '精神力', '防御']),
      '治疗系': Object.freeze(['魂力', '精神力']),
    });
    const SKILL_DESIGNER_SECONDARY_BY_MAIN = Object.freeze({
      '伤害类': Object.freeze(['穿透', '吸血', '斩杀补伤', '流血DOT', '打断', '反击']),
      '控制类': Object.freeze(['打断', '沉默', '减速', '致盲', '迟缓', '禁疗']),
      '削弱类': Object.freeze(['禁疗', '减速', '迟缓', '标记弱点']),
      '增益类': Object.freeze(['小护盾', '净化', '解控', '共享视野']),
      '防御类': Object.freeze(['小护盾', '反击', '净化', '解控']),
      '回复类': Object.freeze(['净化', '解控', '小护盾', '魂力恢复', '精神恢复']),
      '感知/认知类': Object.freeze(['标记弱点', '共享视野', '打断', '沉默']),
      '位移类': Object.freeze(['打断', '反击', '标记弱点']),
      '特殊规则类': Object.freeze(['共享视野', '标记弱点', '净化']),
    });
    const SKILL_DESIGNER_ATTRIBUTE_OPTIONS = Object.freeze([
      '金', '木', '水', '火', '土', '风', '雷', '冰',
      '光', '暗', '精神',
      '空间', '时间',
      '创造', '毁灭',
      '五行'
    ]);
    const SKILL_DESIGNER_BONUS_ATTRIBUTE_OPTIONS = Object.freeze(['无', '力量', '防御', '敏捷', '精神力', '魂力', '气血', '多属性']);
    const SKILL_DESIGNER_MAIN_ROLE_OPTIONS = Object.freeze(['未知', '爆发输出', '持续压制', '控制起手', '保护承伤', '回复续航', '增益辅助', '特殊规则', '被动固化']);
    const SKILL_DESIGNER_RESOURCE_TYPE_OPTIONS = Object.freeze(['无', '魂力', '精神力', '气血', '体力', '混合']);
    const SKILL_ATTRIBUTE_DIM_KEYS = Object.freeze(['掌控', '威力', '消耗', '前摇', '控制', '速度']);
    const SKILL_ATTRIBUTE_SOURCE_VALUES = Object.freeze(['无', '自身操控', '魂技调用']);
    const SKILL_ATTRIBUTE_ROLE_VALUES = Object.freeze(['无', '增幅器', '结构术式']);
    const SKILL_DESIGNER_PRIMARY_MECHANISM_HINTS = Object.freeze({
      '直接伤害': Object.freeze({ main: '伤害类', sub: '单体伤害' }),
      '多段伤害': Object.freeze({ main: '伤害类', sub: '多段伤害' }),
      '持续伤害': Object.freeze({ main: '伤害类', sub: '持续伤害' }),
      '延迟爆发': Object.freeze({ main: '伤害类', sub: '延迟爆发' }),
      '硬控': Object.freeze({ main: '控制类', sub: '硬控' }),
      '软控': Object.freeze({ main: '控制类', sub: '软控' }),
      '位移限制': Object.freeze({ main: '控制类', sub: '位移限制' }),
      '打断': Object.freeze({ main: '控制类', sub: '节奏打断', secondary: '打断' }),
      '单属性削弱': Object.freeze({ main: '削弱类', sub: '单属性削弱' }),
      '多属性削弱': Object.freeze({ main: '削弱类', sub: '多属性削弱' }),
      '禁疗': Object.freeze({ main: '削弱类', sub: '禁疗', secondary: '禁疗' }),
      '消耗提高': Object.freeze({ main: '削弱类', sub: '消耗提高' }),
      '前摇拉长': Object.freeze({ main: '削弱类', sub: '前摇拉长' }),
      '掌控压制': Object.freeze({ main: '削弱类', sub: '掌控压制' }),
      '单属性增益': Object.freeze({ main: '增益类', sub: '单属性增益' }),
      '多属性增益': Object.freeze({ main: '增益类', sub: '多属性增益' }),
      '全属性增益': Object.freeze({ main: '增益类', sub: '全属性增益' }),
      '消耗降低': Object.freeze({ main: '增益类', sub: '消耗降低' }),
      '前摇缩短': Object.freeze({ main: '增益类', sub: '前摇缩短' }),
      '掌控提升': Object.freeze({ main: '增益类', sub: '掌控提升' }),
      '速度提升': Object.freeze({ main: '增益类', sub: '速度提升' }),
      '标记弱点': Object.freeze({ main: '削弱类', sub: '单属性削弱', secondary: '标记弱点' }),
      '护盾': Object.freeze({ main: '防御类', sub: '护盾' }),
      '减伤': Object.freeze({ main: '防御类', sub: '减伤' }),
      '格挡': Object.freeze({ main: '防御类', sub: '格挡/抵消' }),
      '霸体': Object.freeze({ main: '防御类', sub: '霸体' }),
      '免死': Object.freeze({ main: '防御类', sub: '免死/锁血' }),
      '体力恢复': Object.freeze({ main: '回复类', sub: '体力恢复' }),
      '魂力恢复': Object.freeze({ main: '回复类', sub: '魂力恢复' }),
      '精神恢复': Object.freeze({ main: '回复类', sub: '精神恢复' }),
      '持续恢复': Object.freeze({ main: '回复类', sub: '持续恢复' }),
      '解控': Object.freeze({ main: '回复类', sub: '净化/解控', secondary: '解控' }),
      '净化': Object.freeze({ main: '回复类', sub: '净化/解控', secondary: '净化' }),
      '共享视野': Object.freeze({ main: '感知/认知类', sub: '共享视野', secondary: '共享视野' }),
      '标记锁定': Object.freeze({ main: '感知/认知类', sub: '标记锁定' }),
      '幻境': Object.freeze({ main: '感知/认知类', sub: '幻境' }),
      '催眠': Object.freeze({ main: '感知/认知类', sub: '催眠' }),
      '感知干扰': Object.freeze({ main: '感知/认知类', sub: '感知干扰' }),
      '认知扭曲': Object.freeze({ main: '感知/认知类', sub: '认知扭曲' }),
      '自身位移': Object.freeze({ main: '位移类', sub: '自身位移' }),
      '强制位移': Object.freeze({ main: '位移类', sub: '强制位移' }),
      '位移交换': Object.freeze({ main: '位移类', sub: '位移交换' }),
      '追击位移': Object.freeze({ main: '位移类', sub: '追击位移' }),
      '脱离位移': Object.freeze({ main: '位移类', sub: '脱离位移' }),
      '复制': Object.freeze({ main: '特殊规则类', sub: '复制' }),
      '反制': Object.freeze({ main: '特殊规则类', sub: '反制' }),
      '状态交换': Object.freeze({ main: '特殊规则类', sub: '状态交换' }),
      '强制绑定/锁定': Object.freeze({ main: '特殊规则类', sub: '强制绑定/锁定' }),
      '条件触发': Object.freeze({ main: '特殊规则类', sub: '条件触发' }),
      '效果反转': Object.freeze({ main: '特殊规则类', sub: '规则改写' }),
      '伤害转回复': Object.freeze({ main: '特殊规则类', sub: '转化' }),
      '回复转伤害': Object.freeze({ main: '特殊规则类', sub: '转化' }),
    });
    const SKILL_DESIGNER_SECONDARY_MECHANISM_HINTS = Object.freeze({
      '打断': Object.freeze(['打断']),
      '沉默': Object.freeze(['沉默']),
      '减速': Object.freeze(['减速']),
      '致盲': Object.freeze(['致盲']),
      '迟缓': Object.freeze(['迟缓']),
      '禁疗': Object.freeze(['禁疗']),
      '标记弱点': Object.freeze(['标记弱点']),
      '共享视野': Object.freeze(['共享视野']),
      '护盾': Object.freeze(['小护盾']),
      '解控': Object.freeze(['解控']),
      '净化': Object.freeze(['净化']),
      '魂力恢复': Object.freeze(['魂力恢复']),
      '精神恢复': Object.freeze(['精神恢复']),
      '受击反击': Object.freeze(['反击']),
      '反击': Object.freeze(['反击']),
    });
    const SKILL_DESIGNER_PACKED_PROPERTY_LABELS = Object.freeze({
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
    const SKILL_DESIGNER_FULL_ATTRIBUTE_KEYS = Object.freeze(['str', 'def', 'agi', 'sp_max', 'men_max']);

    function isSkillSummaryEffect(effect) {
      const mechanism = toText(effect && effect['机制'], '').trim();
      return !!mechanism && (!!(effect && effect.summaryOnly) || SKILL_SUMMARY_EFFECT_MECHANISM_SET.has(mechanism));
    }

    function normalizeSkillDesignerArray(value) {
      if (Array.isArray(value)) {
        return Array.from(new Set(value.map(item => toText(item, '').trim()).filter(Boolean)));
      }
      if (typeof value === 'string') {
        return Array.from(new Set(
          value
            .split(/[、,，/｜|]+/)
            .map(item => toText(item, '').trim())
            .filter(Boolean)
        ));
      }
      return [];
    }

    function formatSkillDesignerNumericInput(value, digits = 4) {
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) return '';
      return String(Number(parsed.toFixed(digits)));
    }

    function getSkillDesignerEffectDuration(effect = {}) {
      const candidates = [effect && effect['持续'], effect && effect['持续回合']];
      for (const item of candidates) {
        const parsed = Number(item);
        if (Number.isFinite(parsed) && parsed > 0) return parsed;
      }
      return 0;
    }

    function getSkillDesignerPackedPropertyLabel(property = '') {
      const key = normalizeSkillUiText(property, '');
      return SKILL_DESIGNER_PACKED_PROPERTY_LABELS[key] || key;
    }

    function mergeSkillDesignerMechanicParamSources(...sources) {
      const merged = {};
      sources.forEach(source => {
        safeEntries(source && typeof source === 'object' ? source : {}).forEach(([label, entry]) => {
          if (!label || !entry || typeof entry !== 'object') return;
          const nextEntry = {};
          safeEntries(entry).forEach(([key, value]) => {
            const text = normalizeSkillUiText(value, '');
            if (text) nextEntry[key] = text;
          });
          if (!safeEntries(nextEntry).length) return;
          merged[label] = { ...(merged[label] || {}), ...nextEntry };
        });
      });
      return merged;
    }

    function analyzeSkillDesignerPackedEffects(effectArray = []) {
      const effectEntries = getSkillDesignerEffectEntries(effectArray);
      const analysis = {
        effectEntries,
        primaryHints: [],
        secondaryHints: [],
        attributeBuffs: [],
        attributeDebuffs: [],
        immediateRecovers: [],
        overtimeRecovers: [],
        paramHints: [],
      };

      const pushParamHint = (label, params) => {
        if (!label || !params || typeof params !== 'object') return;
        analysis.paramHints.push({ label, params });
      };

      effectEntries.forEach(effect => {
        const mechanism = normalizeSkillUiText(effect && effect['机制'], '');
        const property = normalizeSkillUiText(effect && effect['属性'], '');
        const action = normalizeSkillUiText(effect && effect['动作'], '');
        const valueText = formatSkillDesignerNumericInput(effect && effect['数值']);
        const duration = getSkillDesignerEffectDuration(effect);
        const durationText = duration > 0 ? formatSkillDesignerNumericInput(duration, 0) : '';
        const baseHint = SKILL_DESIGNER_PRIMARY_MECHANISM_HINTS[mechanism];
        if (baseHint) {
          analysis.primaryHints.push(baseHint);
          if (baseHint.secondary) analysis.secondaryHints.push(baseHint.secondary);
        }
        normalizeSkillDesignerArray(SKILL_DESIGNER_SECONDARY_MECHANISM_HINTS[mechanism] || []).forEach(label => {
          analysis.secondaryHints.push(label);
        });

        if (mechanism === '属性变化') {
          if (action === '加值' && ['vit', 'sp', 'men'].includes(property)) {
            const sub = property === 'sp' ? '魂力恢复' : property === 'men' ? '精神恢复' : '体力恢复';
            analysis.primaryHints.push({ main: '回复类', sub });
            analysis.immediateRecovers.push({ property, valueText, durationText });
            pushParamHint(sub, { recoverRatio: valueText, repeatCount: '1' });
            return;
          }
          if (['加值', '倍率提升'].includes(action)) {
            analysis.attributeBuffs.push({ property, action, valueText, durationText });
            return;
          }
          if (['减值', '倍率压制'].includes(action)) {
            analysis.attributeDebuffs.push({ property, action, valueText, durationText });
            return;
          }
          return;
        }

        if (mechanism === '持续恢复') {
          analysis.primaryHints.push({ main: '回复类', sub: '持续恢复' });
          analysis.overtimeRecovers.push({ property, valueText, durationText });
          pushParamHint('持续恢复', { recoverRatio: valueText, duration: durationText });
          return;
        }

        if (mechanism === '消耗修正') {
          const sub = action === '消耗提高' ? '消耗提高' : '消耗降低';
          analysis.primaryHints.push({ main: action === '消耗提高' ? '削弱类' : '增益类', sub });
          pushParamHint(sub, { resourceType: '混合', gainRatio: valueText, duration: durationText });
          return;
        }

        if (mechanism === '前摇修正') {
          const sub = action === '前摇拉长' ? '前摇拉长' : '前摇缩短';
          analysis.primaryHints.push({ main: action === '前摇拉长' ? '削弱类' : '增益类', sub });
          pushParamHint(sub, { gainRatio: valueText, duration: durationText });
          return;
        }

        if (mechanism === '掌控修正') {
          const sub = action === '倍率压制' ? '掌控压制' : '掌控提升';
          analysis.primaryHints.push({ main: action === '倍率压制' ? '削弱类' : '增益类', sub });
          pushParamHint(sub, { gainRatio: valueText, duration: durationText });
          return;
        }

        if (mechanism === '速度修正') {
          const sub = action === '倍率压制' ? '速度压制' : '速度提升';
          analysis.primaryHints.push({ main: action === '倍率压制' ? '削弱类' : '增益类', sub });
          pushParamHint(sub, { gainRatio: valueText, duration: durationText });
        }
      });

      return analysis;
    }

    function buildSkillDesignerEffectBasedPrimaryMechanic(effectAnalysis = null) {
      const analysis = effectAnalysis && typeof effectAnalysis === 'object' ? effectAnalysis : null;
      if (!analysis) return { main: '', sub: '' };
      if (analysis.primaryHints.length > 0) {
        const first = analysis.primaryHints.find(hint => hint && hint.main && hint.sub) || analysis.primaryHints[0] || {};
        return {
          main: normalizeSkillUiText(first.main, ''),
          sub: normalizeSkillUiText(first.sub, ''),
        };
      }
      if (analysis.attributeBuffs.length > 0) {
        const attrSet = new Set(analysis.attributeBuffs.map(item => normalizeSkillUiText(item.property, '')).filter(Boolean));
        const sub = SKILL_DESIGNER_FULL_ATTRIBUTE_KEYS.every(key => attrSet.has(key))
          ? '全属性增益'
          : attrSet.size > 1
            ? '多属性增益'
            : '单属性增益';
        return { main: '增益类', sub };
      }
      if (analysis.attributeDebuffs.length > 0) {
        const attrSet = new Set(analysis.attributeDebuffs.map(item => normalizeSkillUiText(item.property, '')).filter(Boolean));
        return { main: '削弱类', sub: attrSet.size > 1 ? '多属性削弱' : '单属性削弱' };
      }
      return { main: '', sub: '' };
    }

    function buildSkillDesignerInferredMechanicParams(effectArray = [], draft = {}) {
      const analysis = analyzeSkillDesignerPackedEffects(effectArray);
      const inferred = {};
      const pushParams = (label, params) => {
        if (!label || !params || typeof params !== 'object') return;
        inferred[label] = { ...(inferred[label] || {}), ...params };
      };

      analysis.paramHints.forEach(entry => pushParams(entry.label, entry.params));

      const primarySub = normalizeSkillUiText(draft.primarySub, '');
      if (['单属性增益', '多属性增益', '全属性增益'].includes(primarySub) && analysis.attributeBuffs.length > 0) {
        const attrLabels = Array.from(
          new Set(analysis.attributeBuffs.map(item => getSkillDesignerPackedPropertyLabel(item.property)).filter(Boolean)),
        );
        const first = analysis.attributeBuffs[0];
        if (primarySub === '单属性增益') {
          pushParams('单属性增益', {
            buffAttr: attrLabels[0] || '',
            gainRatio: first.valueText || '',
            duration: first.durationText || '',
          });
        } else if (primarySub === '多属性增益') {
          pushParams('多属性增益', {
            buffAttrGroup: attrLabels.join('/'),
            gainRatio: first.valueText || '',
            duration: first.durationText || '',
          });
        } else {
          pushParams('全属性增益', {
            allGainRatio: first.valueText || '',
            duration: first.durationText || '',
          });
        }
      }

      if (['单属性削弱', '多属性削弱'].includes(primarySub) && analysis.attributeDebuffs.length > 0) {
        const attrLabels = Array.from(
          new Set(analysis.attributeDebuffs.map(item => getSkillDesignerPackedPropertyLabel(item.property)).filter(Boolean)),
        );
        const first = analysis.attributeDebuffs[0];
        if (primarySub === '单属性削弱') {
          pushParams('单属性削弱', {
            debuffAttr: attrLabels[0] || '',
            reduceRatio: first.valueText || '',
            duration: first.durationText || '',
          });
        } else {
          pushParams('多属性削弱', {
            debuffAttrGroup: attrLabels.join('/'),
            reduceRatio: first.valueText || '',
            duration: first.durationText || '',
          });
        }
      }

      return normalizeSkillDesignerMechanicParamMap(inferred, draft);
    }

    function normalizeSkillDesignerCoeffMap(value) {
      const source = value && typeof value === 'object' ? value : {};
      const result = {};
      SKILL_ATTRIBUTE_DIM_KEYS.forEach(key => {
        const parsed = Number(source[key]);
        result[key] = Number.isFinite(parsed) ? parsed : 1;
      });
      return result;
    }

    function getSkillDesignerEffectEntries(effectArray = []) {
      return (Array.isArray(effectArray) ? effectArray : []).filter(effect => {
        const mechanism = toText(effect && effect['机制'], '').trim();
        return !!mechanism && mechanism !== '系统基础' && !isSkillSummaryEffect(effect);
      });
    }

    function getSkillDesignerDefaultPrimarySub(primaryMain = '', target = '', type = '') {
      const normalizedMain = normalizeSkillUiText(primaryMain, '');
      const normalizedTarget = normalizeSkillUiText(target, '');
      const normalizedType = normalizeSkillUiText(type, '');
      if (normalizedMain === '伤害类') return /群体|全场/.test(normalizedTarget) ? '群体伤害' : '单体伤害';
      if (normalizedMain === '控制类') return '硬控';
      if (normalizedMain === '削弱类') return /禁疗/.test(normalizedType) ? '禁疗' : '单属性削弱';
      if (normalizedMain === '增益类') return /群体|全场/.test(normalizedTarget) ? '多属性增益' : '单属性增益';
      if (normalizedMain === '防御类') return '护盾';
      if (normalizedMain === '回复类') return '体力恢复';
      if (normalizedMain === '感知/认知类') return '标记锁定';
      if (normalizedMain === '位移类') return '自身位移';
      if (normalizedMain === '特殊规则类') return /反制/.test(normalizedType) ? '反制' : '条件触发';
      return '';
    }

    function inferSkillDesignerMainMechanicFromType(type = '', target = '', effectEntries = []) {
      const normalizedType = normalizeSkillUiText(type, '');
      if (!normalizedType || normalizedType === '未知') return { main: '', sub: '' };
      const pickSub = main => {
        const match = effectEntries.find(effect => {
          const hint = SKILL_DESIGNER_PRIMARY_MECHANISM_HINTS[normalizeSkillUiText(effect && effect['机制'], '')];
          return hint && hint.main === main && hint.sub;
        });
        return match
          ? SKILL_DESIGNER_PRIMARY_MECHANISM_HINTS[normalizeSkillUiText(match && match['机制'], '')].sub
          : getSkillDesignerDefaultPrimarySub(main, target, normalizedType);
      };

      if (/位移/.test(normalizedType)) return { main: '位移类', sub: pickSub('位移类') };
      if (/控制/.test(normalizedType)) return { main: '控制类', sub: pickSub('控制类') };
      if (/削弱|禁疗/.test(normalizedType)) return { main: '削弱类', sub: pickSub('削弱类') };
      if (/防御|护盾/.test(normalizedType)) return { main: '防御类', sub: pickSub('防御类') };
      if (/回复|治疗/.test(normalizedType)) return { main: '回复类', sub: pickSub('回复类') };
      if (/增益|辅助|领域/.test(normalizedType)) return { main: '增益类', sub: pickSub('增益类') };
      if (/感知|认知|幻境|催眠|标记/.test(normalizedType)) return { main: '感知/认知类', sub: pickSub('感知/认知类') };
      if (/输出|真伤|破甲|爆发/.test(normalizedType)) return { main: '伤害类', sub: pickSub('伤害类') };
      if (/被动|反制|规则|真身|绝技/.test(normalizedType)) return { main: '特殊规则类', sub: pickSub('特殊规则类') };
      return { main: '', sub: '' };
    }

    function inferSkillDesignerMechanicsFromEffectArray(effectArray = [], type = '', target = '') {
      const effectEntries = getSkillDesignerEffectEntries(effectArray);
      const effectAnalysis = analyzeSkillDesignerPackedEffects(effectArray);
      const effectHint = buildSkillDesignerEffectBasedPrimaryMechanic(effectAnalysis);
      const typeHint = inferSkillDesignerMainMechanicFromType(type, target, effectEntries);
      let primaryMain = normalizeSkillUiText(effectHint.main, '');
      let primarySub = normalizeSkillUiText(effectHint.sub, '');
      const secondaryCandidates = [...normalizeSkillDesignerArray(effectAnalysis.secondaryHints)];

      effectAnalysis.primaryHints.forEach(primaryHint => {
        if (!primaryHint || typeof primaryHint !== 'object') return;
        if (!primaryMain && primaryHint.main) primaryMain = normalizeSkillUiText(primaryHint.main, '');
        if (!primarySub && primaryHint.sub && (!primaryMain || normalizeSkillUiText(primaryHint.main, '') === primaryMain)) {
          primarySub = normalizeSkillUiText(primaryHint.sub, '');
        }
      });

      if (!primaryMain && typeHint.main) primaryMain = normalizeSkillUiText(typeHint.main, '');
      if (!primarySub && typeHint.sub && (!primaryMain || normalizeSkillUiText(typeHint.main, '') === primaryMain)) {
        primarySub = normalizeSkillUiText(typeHint.sub, '');
      }

      if (!primaryMain && effectEntries.some(effect => normalizeSkillUiText(effect && effect['机制'], '') === '状态挂载')) {
        primaryMain = /自身|食用者|使用者/.test(normalizeSkillUiText(target, '')) ? '增益类' : '削弱类';
      }
      if (!primarySub) primarySub = getSkillDesignerDefaultPrimarySub(primaryMain, target, type);

      effectAnalysis.primaryHints.forEach(primaryHint => {
        const secondarySub = normalizeSkillUiText(primaryHint && primaryHint.sub, '');
        if (secondarySub && secondarySub !== primarySub) secondaryCandidates.push(secondarySub);
      });
      const secondaryMechanics = normalizeSkillDesignerArray(
        secondaryCandidates.filter(label => {
          const normalizedLabel = normalizeSkillUiText(label, '');
          return !!normalizedLabel && normalizedLabel !== primarySub;
        }),
      );

      return {
        primaryMain: normalizeSkillUiText(primaryMain, ''),
        primarySub: normalizeSkillUiText(primarySub, ''),
        secondaryMechanics,
      };
    }

    function inferSkillDesignerDeliveryForm(effectArray = [], type = '', target = '') {
      const effectEntries = getSkillDesignerEffectEntries(effectArray);
      const mechanisms = effectEntries.map(effect => normalizeSkillUiText(effect && effect['机制'], ''));
      const normalizedType = normalizeSkillUiText(type, '');
      const normalizedTarget = normalizeSkillUiText(target, '');
      if (mechanisms.includes('造物生成') || /食物系/.test(normalizedType)) return '造物承载';
      if (mechanisms.includes('召唤与场地')) return '召唤承载';
      if (mechanisms.includes('条件触发') || mechanisms.includes('延迟爆发')) return '延迟触发';
      if (mechanisms.includes('标记锁定') || mechanisms.includes('标记弱点')) return '标记触发';
      if (/群体|全场/.test(normalizedTarget)) return '范围展开';

      const explicitTargets = effectEntries
        .map(effect => normalizeSkillUiText(effect && (effect['目标'] || effect['对象']), ''))
        .filter(Boolean);
      const selfOnly =
        explicitTargets.length > 0
        && explicitTargets.every(value => /自身|使用者|食用者/.test(value));
      if (selfOnly) return '自身附体';

      const hasRangedDamage = effectEntries.some(effect => /远程/.test(normalizeSkillUiText(effect && effect['伤害类型'], '')));
      if (hasRangedDamage) return '远程命中';
      return '直接生效';
    }

    function inferSkillDesignerMainRole(type = '', target = '', primaryMain = '', primarySub = '') {
      const normalizedType = normalizeSkillUiText(type, '');
      const normalizedTarget = normalizeSkillUiText(target, '');
      const normalizedMain = normalizeSkillUiText(primaryMain, '');
      const normalizedSub = normalizeSkillUiText(primarySub, '');
      if (/被动/.test(normalizedType)) return '被动固化';
      if (normalizedMain === '伤害类') return /持续/.test(normalizedSub) ? '持续压制' : '爆发输出';
      if (normalizedMain === '控制类' || normalizedMain === '削弱类') return '控制起手';
      if (normalizedMain === '防御类') return '保护承伤';
      if (normalizedMain === '回复类') return '回复续航';
      if (normalizedMain === '增益类') return '增益辅助';
      if (normalizedMain === '感知/认知类' || normalizedMain === '位移类' || normalizedMain === '特殊规则类')
        return '特殊规则';
      if (/自身|使用者|食用者/.test(normalizedTarget)) return '增益辅助';
      return '未知';
    }

    function inferSkillDesignerTags(effectArray = [], skill = {}, draft = {}) {
      const explicitTags = normalizeSkillDesignerArray((skill && skill['标签']) || (draft && draft['标签']) || []);
      if (explicitTags.length) return explicitTags;
      return normalizeSkillDesignerArray(
        getSkillDesignerEffectEntries(effectArray)
          .map(effect => normalizeSkillUiText(effect && effect['机制'], ''))
          .filter(Boolean),
      ).slice(0, 8);
    }

    function getSkillSummaryEffectByMechanism(effectArray, mechanism = '') {
      const targetMechanism = toText(mechanism, '').trim();
      if (!targetMechanism) return null;
      return (Array.isArray(effectArray) ? effectArray : []).find(effect => {
        return isSkillSummaryEffect(effect) && toText(effect && effect['机制'], '').trim() === targetMechanism;
      }) || null;
    }

    function cleanSkillDisplayName(skill, rawName = '') {
      return normalizeSkillUiText(
        (skill && skill['魂技名']) || (skill && skill['name']) || rawName.replace(/\[后台推演\]\s*/g, ''),
        '未命名魂技'
      );
    }

    function buildSkillDesignerPreviewKey(meta = {}) {
      const path = Array.isArray(meta.path) ? meta.path : [];
      if (!path.length) return '';
      const payload = {
        path,
        label: toText(meta.label, '技能'),
        category: toText(meta.category, '技能'),
        scope: toText(meta.scope, 'skill'),
      };
      return `${SKILL_DESIGNER_PREVIEW_PREFIX}${encodeURIComponent(JSON.stringify(payload))}`;
    }

    function parseSkillDesignerPreviewKey(previewKey = '') {
      const raw = toText(previewKey, '');
      if (!raw.startsWith(SKILL_DESIGNER_PREVIEW_PREFIX)) return null;
      try {
        const payload = JSON.parse(decodeURIComponent(raw.slice(SKILL_DESIGNER_PREVIEW_PREFIX.length)));
        return {
          path: Array.isArray(payload && payload.path) ? payload.path : [],
          label: toText(payload && payload.label, '技能'),
          category: toText(payload && payload.category, '技能'),
          scope: toText(payload && payload.scope, 'skill'),
        };
      } catch (error) {
        return null;
      }
    }

    function formatSkillDesignerChineseOrdinal(value, suffix = '') {
      const safeValue = Math.max(0, Math.floor(Number(value) || 0));
      if (!safeValue) return '';
      const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      let numeral = '';
      if (safeValue < 10) {
        numeral = digits[safeValue];
      } else if (safeValue < 20) {
        numeral = safeValue === 10 ? '十' : `十${digits[safeValue - 10]}`;
      } else if (safeValue < 100) {
        const tens = Math.floor(safeValue / 10);
        const ones = safeValue % 10;
        numeral = `${digits[tens]}十${ones ? digits[ones] : ''}`;
      } else {
        numeral = String(safeValue);
      }
      return `第${numeral}${suffix}`;
    }

    function formatSkillDesignerSpiritSkillLabel(skillName = '', ringIndex = '') {
      const cleanName = toText(skillName, '').trim();
      const baseLabel = formatSkillDesignerChineseOrdinal(ringIndex, '魂技');
      if (!cleanName) return baseLabel || '魂技';
      if (/^第(?:\d+|[一二三四五六七八九十百]+)魂技$/u.test(cleanName)) return baseLabel || cleanName;
      const suffixMatch = cleanName.match(/^第(?:\d+|[一二三四五六七八九十百]+)魂技(.*)$/u);
      if (suffixMatch && suffixMatch[1]) return `${baseLabel || '魂技'}${suffixMatch[1]}`;
      return cleanName;
    }

    function formatSkillDesignerWritebackLabel(previewMeta = {}) {
      const path = Array.isArray(previewMeta && previewMeta.path) ? previewMeta.path : [];
      const scope = toText(previewMeta && previewMeta.scope, 'skill');
      const label = toText(previewMeta && previewMeta.label, '').trim();
      if (scope === 'spirit_skill') {
        const ringMarkerIndex = path.findIndex(part => toText(part, '') === 'rings');
        const ringIndex = ringMarkerIndex >= 0 ? path[ringMarkerIndex + 1] : '';
        const ringLabel = formatSkillDesignerChineseOrdinal(ringIndex, '魂环');
        const skillLabel = formatSkillDesignerSpiritSkillLabel(label || path[path.length - 1], ringIndex);
        return [ringLabel, skillLabel].filter(Boolean).join(' / ') || '魂环魂技';
      }
      if (scope === 'fusion_skill') return `融合技 / ${label || '未命名技能'}`;
      if (scope === 'art') return `功法 / ${label || '未命名技能'}`;
      if (scope === 'special_ability') return `特长 / ${label || '未命名技能'}`;
      if (scope === 'blood_passive') return `血脉能力 / ${label || '未命名技能'}`;
      return path.length ? path.slice(-4).join(' / ') : (label || '未识别路径');
    }

    function resolveSkillDesignerTypeMeta(previewMeta = {}, fallbackType = '') {
      const scope = toText(previewMeta && previewMeta.scope, 'skill');
      const category = toText(previewMeta && previewMeta.category, '技能');
      const normalizedFallback = normalizeSkillUiText(fallbackType, '');
      const path = Array.isArray(previewMeta && previewMeta.path) ? previewMeta.path : [];
      const rootData = (liveSnapshot && liveSnapshot.rootData) || readLatestMvuDataByEditor() || {};

      if (scope === 'spirit_skill') {
        const spiritBasePath = path.length >= 4 ? path.slice(0, 4) : [];
        const spiritSlot = normalizeSkillUiText(spiritBasePath[3], '');
        const spiritType = normalizeSkillUiText(
          spiritBasePath.length ? deepGet(rootData, [...spiritBasePath, 'type'], '') : '',
          normalizedFallback || '未设置'
        );
        return {
          value: spiritType || '未设置',
          display: spiritSlot && spiritType ? `${spiritSlot} / ${spiritType}` : (spiritType || spiritSlot || '未设置')
        };
      }
      if (scope === 'fusion_skill') return { value: '融合技', display: '融合技' };
      if (scope === 'art') return { value: '功法', display: '功法' };
      if (scope === 'special_ability') return { value: '特长', display: '特长' };
      if (scope === 'blood_passive') return { value: '被动', display: '被动' };
      return {
        value: normalizedFallback || '未设置',
        display: normalizedFallback || category || '未设置'
      };
    }

    function readSkillDesignerDraft(skill = {}, rawName = '') {
      const safeSkill = skill && typeof skill === 'object' ? skill : {};
      const effectArray = Array.isArray(safeSkill['_效果数组']) ? safeSkill['_效果数组'] : [];
      const designDraft = safeSkill['设计稿'] && typeof safeSkill['设计稿'] === 'object' ? safeSkill['设计稿'] : {};
      const systemBase = effectArray.find(effect => toText(effect && effect['机制'], '').trim() === '系统基础') || {};
      const attributeSummary = getSkillSummaryEffectByMechanism(effectArray, '属性摘要') || {};
      const coeffSummary = getSkillSummaryEffectByMechanism(effectArray, '属性系数摘要') || {};
      const mechanicParamSummary = getSkillSummaryEffectByMechanism(effectArray, '机制参数摘要') || {};
      const resolvedType = normalizeSkillUiText(
        systemBase['技能类型'] || safeSkill['技能类型'] || designDraft['技能类型'],
        '未知',
      );
      const resolvedTarget = normalizeSkillUiText(
        systemBase['对象'] || safeSkill['对象'] || designDraft['对象'],
        '未知',
      );
      const explicitSecondaryMechanics = normalizeSkillDesignerArray(designDraft['附加机制']);
      const inferredMechanics = inferSkillDesignerMechanicsFromEffectArray(effectArray, resolvedType, resolvedTarget);
      const resolvedPrimaryMain = normalizeSkillUiText(designDraft['主机制'] || inferredMechanics.primaryMain, '');
      const resolvedPrimarySub = normalizeSkillUiText(designDraft['细分机制'] || inferredMechanics.primarySub, '');
      const resolvedSecondaryMechanics = explicitSecondaryMechanics.length
        ? explicitSecondaryMechanics
        : inferredMechanics.secondaryMechanics;
      const inferredDeliveryForm = inferSkillDesignerDeliveryForm(effectArray, resolvedType, resolvedTarget);
      const inferredMainRole = inferSkillDesignerMainRole(
        resolvedType,
        resolvedTarget,
        resolvedPrimaryMain,
        resolvedPrimarySub,
      );
      const inferredMechanicParams = buildSkillDesignerInferredMechanicParams(effectArray, {
        primaryMain: resolvedPrimaryMain,
        primarySub: resolvedPrimarySub,
        secondaryMechanics: resolvedSecondaryMechanics,
      });
      const mergedMechanicParams = mergeSkillDesignerMechanicParamSources(
        inferredMechanicParams,
        mechanicParamSummary['参数表'],
        designDraft['机制参数'],
      );
      const costConfig = parseSkillDesignerCostConfig(
        systemBase['消耗'] || safeSkill['消耗'] || designDraft['消耗'],
        designDraft['消耗资源'],
        designDraft['消耗数值'],
      );
      return {
        name: cleanSkillDisplayName(safeSkill, rawName),
        type: resolvedType,
        target: resolvedTarget,
        cost: formatSkillDesignerCostText(costConfig.resourceType, costConfig.resourceValue),
        resourceType: costConfig.resourceType,
        resourceValue: costConfig.resourceValue,
        bonus: normalizeSkillUiText(safeSkill['加成属性'] || designDraft['加成属性'], '未知'),
        mainRole: normalizeSkillUiText(safeSkill['主定位'] || designDraft['主定位'] || inferredMainRole, '未知'),
        primaryMain: resolvedPrimaryMain,
        primarySub: resolvedPrimarySub,
        deliveryForm: normalizeSkillUiText(designDraft['释放形式'] || inferredDeliveryForm, ''),
        secondaryMechanics: resolvedSecondaryMechanics,
        attachedAttributes: normalizeSkillDesignerArray(
          designDraft['附带属性']
          || attributeSummary['属性列表']
          || safeSkill['附带属性']
        ),
        attributeSource: normalizeSkillUiText(
          designDraft['属性来源'] || attributeSummary['属性来源'],
          '无'
        ),
        attributeRole: normalizeSkillUiText(
          designDraft['魂技作用'] || attributeSummary['魂技作用'],
          '无'
        ),
        coeff: normalizeSkillDesignerCoeffMap(designDraft['属性系数'] || coeffSummary['系数']),
        mechanicParams: normalizeSkillDesignerMechanicParamMap(
          mergedMechanicParams,
          {
            primaryMain: resolvedPrimaryMain,
            primarySub: resolvedPrimarySub,
            secondaryMechanics: resolvedSecondaryMechanics,
          },
        ),
        tags: inferSkillDesignerTags(effectArray, safeSkill, designDraft),
        visualDesc: normalizeSkillUiText(safeSkill['画面描述'], '未知'),
        effectDesc: normalizeSkillUiText(safeSkill['效果描述'] || safeSkill['描述'], '未知'),
        summaryText: normalizeSkillUiText(safeSkill['特效量化参数'] || designDraft['设计摘要'], ''),
      };
    }

    function formatSkillDesignerCoeffSummary(coeffMap = {}, options = {}) {
      const coeff = normalizeSkillDesignerCoeffMap(coeffMap);
      const includeAll = !!(options && options.includeAll);
      const segments = SKILL_ATTRIBUTE_DIM_KEYS
        .filter(key => includeAll || Math.abs(Number(coeff[key] || 1) - 1) > 0.001)
        .map(key => `${key}x${Number(coeff[key] || 1).toFixed(2).replace(/\.?0+$/, '')}`);
      return segments.join(' / ');
    }

    function buildSkillDesignerMechanicSummary(draft = {}) {
      const parts = [];
      const primaryMain = normalizeSkillUiText(draft.primaryMain, '');
      const primarySub = getSkillDesignerEffectivePrimaryLabel(draft);
      const deliveryForm = normalizeSkillUiText(draft.deliveryForm, '');
      const secondaryMechanics = normalizeSkillDesignerSecondarySelection(primaryMain, draft.secondaryMechanics);
      if (primaryMain) parts.push(primaryMain);
      if (primarySub && primarySub !== primaryMain) parts.push(primarySub);
      if (deliveryForm) parts.push(deliveryForm);
      let summary = parts.join(' / ');
      if (secondaryMechanics.length) {
        summary += `${summary ? ' ｜ ' : ''}附加：${secondaryMechanics.join('、')}`;
      }
      return summary;
    }

    function buildSkillDesignerExecutionSummary(draft = {}) {
      const parts = [];
      const target = normalizeSkillUiText(draft.target, '');
      const cost = formatSkillDesignerCostText(draft.costType, draft.costValue);
      const bonus = normalizeSkillUiText(draft.bonus, '');
      if (target) parts.push(`对象：${target}`);
      if (cost && cost !== '无') parts.push(`消耗：${cost}`);
      if (bonus && bonus !== '无') parts.push(`加成：${bonus}`);
      return parts.join('；');
    }

    function buildSkillDesignerAttributeSummary(draft = {}) {
      const attachedAttributes = normalizeSkillDesignerArray(draft.attachedAttributes);
      const segments = [];
      if (attachedAttributes.length) segments.push(`附带属性：${attachedAttributes.join('/')}`);
      const modelParts = [draft.attributeSource, draft.attributeRole]
        .map(value => normalizeSkillUiText(value, ''))
        .filter(value => value && value !== '无');
      if (modelParts.length) segments.push(`建模：${modelParts.join('/')}`);
      const coeffText = formatSkillDesignerCoeffSummary(draft.coeff);
      if (coeffText) segments.push(`系数：${coeffText}`);
      return segments.join('；');
    }

    function buildSkillDesignerCompactSummary(draft = {}) {
      return [
        buildSkillDesignerMechanicSummary(draft),
        buildSkillDesignerMechanicParamSummary(draft),
        buildSkillDesignerExecutionSummary(draft),
        buildSkillDesignerAttributeSummary(draft),
      ]
        .filter(Boolean)
        .join(' ｜ ');
    }

    function buildSkillDesignerRuntimeSummaryEffects(draft = {}) {
      const attachedAttributes = normalizeSkillDesignerArray(draft.attachedAttributes);
      const attributeSource = normalizeSkillUiText(draft.attributeSource, '无') || '无';
      const attributeRole = normalizeSkillUiText(draft.attributeRole, '无') || '无';
      const summaryEffects = [];
      const attributeSegments = [];
      if (attachedAttributes.length) attributeSegments.push(`附带属性：${attachedAttributes.join('/')}`);
      if (attributeSource !== '无' || attributeRole !== '无') {
        attributeSegments.push(`建模：${[attributeSource, attributeRole].filter(value => value && value !== '无').join('/')}`);
      }
      if (attributeSegments.length) {
        summaryEffects.push({
          '机制': '属性摘要',
          summaryOnly: true,
          '文本': attributeSegments.join('；'),
          '属性列表': [...attachedAttributes],
          '显示元素': attachedAttributes.join('/') || '无',
          '属性来源': attributeSource,
          '魂技作用': attributeRole,
        });
      }
      const coeff = normalizeSkillDesignerCoeffMap(draft.coeff);
      const coeffText = formatSkillDesignerCoeffSummary(coeff);
      if (coeffText) {
        summaryEffects.push({
          '机制': '属性系数摘要',
          summaryOnly: true,
          '文本': coeffText,
          '系数': coeff,
        });
      }
      const mechanicParamSummary = buildSkillDesignerMechanicParamSummary(draft);
      if (mechanicParamSummary) {
        summaryEffects.push({
          '机制': '机制参数摘要',
          summaryOnly: true,
          '文本': mechanicParamSummary,
          '参数表': cloneJsonValue(normalizeSkillDesignerMechanicParamMap(draft.mechanicParams, draft)),
        });
      }
      return summaryEffects;
    }

    function replaceSkillDesignerSummaryEffects(effectArray, summaryEffects = []) {
      const baseEffects = (Array.isArray(effectArray) ? effectArray : []).filter(effect => !isSkillSummaryEffect(effect));
      return [...baseEffects, ...cloneJsonValue(summaryEffects)];
    }

    function getSkillDesignerChildMechanicOptions(primaryMain = '') {
      return SKILL_DESIGNER_MAIN_MECHANIC_POOL[normalizeSkillUiText(primaryMain, '')] || [];
    }

    function getSkillDesignerDeliveryOptions(type = '') {
      return SKILL_DESIGNER_DELIVERY_FORM_BY_TYPE[normalizeSkillUiText(type, '')] || SKILL_DESIGNER_DELIVERY_FORM_POOL;
    }

    function getSkillDesignerSecondaryOptions(primaryMain = '') {
      return SKILL_DESIGNER_SECONDARY_BY_MAIN[normalizeSkillUiText(primaryMain, '')] || [];
    }

    function normalizeSkillDesignerSecondarySelection(primaryMain = '', values = []) {
      const optionSet = new Set(getSkillDesignerSecondaryOptions(primaryMain));
      return normalizeSkillDesignerArray(values).filter(label => optionSet.has(label));
    }

    function getSkillDesignerSecondaryOptionList(primaryMain = '', extraValues = []) {
      return normalizeSkillDesignerArray([
        ...getSkillDesignerSecondaryOptions(primaryMain),
        ...normalizeSkillDesignerSecondarySelection(primaryMain, extraValues),
      ]);
    }

    function buildSkillDesignerSelectOptions(options = [], selected = '', blankLabel = '未设置') {
      const optionList = Array.from(new Set([blankLabel ? '' : null].concat(Array.isArray(options) ? options : []).filter(value => value !== null)));
      return optionList.map(value => {
        const safeValue = value === '' ? '' : toText(value, '');
        const label = safeValue === '' ? blankLabel : safeValue;
        return `<option value=\"${escapeHtmlAttr(safeValue)}\"${safeValue === toText(selected, '') ? ' selected' : ''}>${htmlEscape(label)}</option>`;
      }).join('');
    }

    function buildSkillDesignerCheckChipList(options = [], selectedValues = [], inputName = '', extraClassResolver = null) {
      const selectedSet = new Set(normalizeSkillDesignerArray(selectedValues));
      return (Array.isArray(options) ? options : []).map(option => {
        const label = toText(option, '').trim();
        if (!label) return '';
        const extraClass = typeof extraClassResolver === 'function' ? toText(extraClassResolver(label), '') : '';
        return `
          <label class=\"skill-designer-check-chip ${selectedSet.has(label) ? 'active' : ''} ${extraClass}\">
            <input type=\"checkbox\" name=\"${escapeHtmlAttr(inputName)}\" value=\"${escapeHtmlAttr(label)}\"${selectedSet.has(label) ? ' checked' : ''} />
            <span>${htmlEscape(label)}</span>
          </label>
        `;
      }).join('');
    }

    function createSkillDesignerTextParam(key, label, placeholder = '') {
      return Object.freeze({ key, label, type: 'text', placeholder });
    }

    function createSkillDesignerNumberParam(key, label, placeholder = '', step = '0.1') {
      return Object.freeze({ key, label, type: 'number', placeholder, step });
    }

    function createSkillDesignerSelectParam(key, label, options = [], placeholder = '未设置') {
      return Object.freeze({ key, label, type: 'select', options, placeholder });
    }

    function parseSkillDesignerCostConfig(rawCost = '', explicitType = '', explicitValue = '') {
      const explicitResourceType = normalizeSkillUiText(explicitType, '');
      const explicitResourceValue = normalizeSkillUiText(explicitValue, '');
      if (explicitResourceType) {
        return {
          resourceType: SKILL_DESIGNER_RESOURCE_TYPE_OPTIONS.includes(explicitResourceType) ? explicitResourceType : '混合',
          resourceValue: explicitResourceValue,
        };
      }
      const costText = normalizeSkillUiText(rawCost, '');
      if (!costText || ['无', '未知'].includes(costText)) {
        return { resourceType: '无', resourceValue: '' };
      }
      const directType = SKILL_DESIGNER_RESOURCE_TYPE_OPTIONS.find(option => option !== '无' && option !== '混合' && costText.startsWith(option));
      if (directType) {
        return {
          resourceType: directType,
          resourceValue: costText.slice(directType.length).replace(/^[：:\s]+/, '').trim(),
        };
      }
      if (costText.startsWith('混合')) {
        return {
          resourceType: '混合',
          resourceValue: costText.slice(2).replace(/^[：:\s]+/, '').trim(),
        };
      }
      return { resourceType: '混合', resourceValue: costText };
    }

    function formatSkillDesignerCostText(resourceType = '', resourceValue = '') {
      const safeType = normalizeSkillUiText(resourceType, '无') || '无';
      const safeValue = normalizeSkillUiText(resourceValue, '');
      if (safeType === '无') return safeValue || '无';
      if (!safeValue) return safeType;
      return `${safeType} ${safeValue}`;
    }

    function getSkillDesignerMechanicParamDefs(mechanicLabel = '') {
      const label = normalizeSkillUiText(mechanicLabel, '');
      switch (label) {
        case '伤害类':
          return [
            createSkillDesignerNumberParam('powerRatio', '强度倍率', '1.25'),
            createSkillDesignerNumberParam('hitCount', '命中次数', '1', '1'),
            createSkillDesignerTextParam('range', '作用范围', '单体 / 半径3米'),
          ];
        case '控制类':
          return [
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
            createSkillDesignerNumberParam('controlPower', '控制强度', '1.0'),
            createSkillDesignerTextParam('hitRule', '命中条件', '命中后 / 破防后'),
          ];
        case '削弱类':
          return [
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
            createSkillDesignerNumberParam('weakenRatio', '削弱幅度', '0.2'),
            createSkillDesignerTextParam('affectedPanel', '影响对象', '攻击 / 防御 / 回复'),
          ];
        case '增益类':
          return [
            createSkillDesignerNumberParam('duration', '持续回合', '3', '1'),
            createSkillDesignerNumberParam('gainRatio', '增益幅度', '0.25'),
            createSkillDesignerTextParam('gainTarget', '覆盖对象', '自身 / 友方群体'),
          ];
        case '防御类':
          return [
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
            createSkillDesignerNumberParam('guardValue', '防护强度', '1.0'),
            createSkillDesignerTextParam('triggerRule', '触发条件', '受击时 / 常驻'),
          ];
        case '回复类':
          return [
            createSkillDesignerNumberParam('recoverRatio', '回复倍率', '0.3'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
            createSkillDesignerNumberParam('repeatCount', '生效次数', '1', '1'),
          ];
        case '感知/认知类':
          return [
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
            createSkillDesignerTextParam('senseRange', '感知范围', '半径20米'),
            createSkillDesignerNumberParam('disturbPower', '干扰强度', '1.0'),
          ];
        case '位移类':
          return [
            createSkillDesignerTextParam('moveDistance', '位移距离', '5米'),
            createSkillDesignerNumberParam('repeatCount', '触发次数', '1', '1'),
            createSkillDesignerTextParam('followWindow', '追击窗口', '1回合内'),
          ];
        case '特殊规则类':
          return [
            createSkillDesignerTextParam('triggerRule', '触发条件', '被击中后 / 结算前'),
            createSkillDesignerTextParam('ruleTarget', '改写对象', '单次技能 / 状态'),
            createSkillDesignerTextParam('maintainCost', '维持代价', '每回合额外消耗'),
          ];
        case '单体伤害':
          return [
            createSkillDesignerNumberParam('powerRatio', '威力倍率', '1.4'),
            createSkillDesignerNumberParam('hitCount', '命中次数', '1', '1'),
            createSkillDesignerTextParam('range', '作用范围', '单体 / 直线 / 点杀'),
          ];
        case '群体伤害':
          return [
            createSkillDesignerNumberParam('powerRatio', '威力倍率', '1.1'),
            createSkillDesignerTextParam('range', '作用半径', '半径5米'),
            createSkillDesignerNumberParam('hitCount', '命中次数', '1', '1'),
          ];
        case '多段伤害':
          return [
            createSkillDesignerNumberParam('segmentCount', '段数', '3', '1'),
            createSkillDesignerNumberParam('segmentRatio', '单段倍率', '0.45'),
            createSkillDesignerTextParam('segmentInterval', '段间间隔', '0.2秒'),
          ];
        case '延迟爆发':
          return [
            createSkillDesignerTextParam('delayWindow', '延迟时长', '1回合 / 3秒'),
            createSkillDesignerNumberParam('burstRatio', '爆发倍率', '1.8'),
            createSkillDesignerTextParam('triggerRule', '触发条件', '计时结束 / 再次引爆'),
          ];
        case '持续伤害':
          return [
            createSkillDesignerNumberParam('dotRatio', '每跳倍率', '0.35'),
            createSkillDesignerNumberParam('duration', '持续回合', '3', '1'),
            createSkillDesignerNumberParam('stackLimit', '叠层上限', '3', '1'),
          ];
        case '硬控':
          return [
            createSkillDesignerNumberParam('duration', '控制回合', '2', '1'),
            createSkillDesignerNumberParam('controlPower', '控制强度', '1.2'),
            createSkillDesignerTextParam('breakRule', '解除条件', '受伤 / 净化'),
          ];
        case '软控':
          return [
            createSkillDesignerNumberParam('duration', '控制回合', '2', '1'),
            createSkillDesignerNumberParam('slowRatio', '控制幅度', '0.3'),
            createSkillDesignerTextParam('hitRule', '命中条件', '接触后 / 视线锁定'),
          ];
        case '位移限制':
          return [
            createSkillDesignerTextParam('lockRange', '封锁范围', '半径4米'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
            createSkillDesignerNumberParam('limitPower', '限制强度', '1.0'),
          ];
        case '节奏打断':
          return [
            createSkillDesignerNumberParam('interruptCount', '可打断次数', '1', '1'),
            createSkillDesignerTextParam('interruptWindow', '打断时机', '前摇 / 吟唱中'),
            createSkillDesignerNumberParam('extraDelay', '追加僵直', '0.5'),
          ];
        case '单属性削弱':
          return [
            createSkillDesignerTextParam('debuffAttr', '压制对象', '力量 / 防御'),
            createSkillDesignerNumberParam('reduceRatio', '压制倍率', '0.8'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        case '多属性削弱':
          return [
            createSkillDesignerTextParam('debuffAttrGroup', '属性组', '力量/防御/敏捷'),
            createSkillDesignerNumberParam('reduceRatio', '统一倍率', '0.85'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        case '消耗提高':
          return [
            createSkillDesignerNumberParam('gainRatio', '提高倍率', '1.2'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        case '前摇拉长':
          return [
            createSkillDesignerNumberParam('gainRatio', '拉长倍率', '1.2'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        case '掌控压制':
          return [
            createSkillDesignerNumberParam('gainRatio', '压制倍率', '0.8'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        case '速度压制':
          return [
            createSkillDesignerNumberParam('gainRatio', '压制倍率', '0.85'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        case '单属性增益':
          return [
            createSkillDesignerTextParam('buffAttr', '增幅对象', '力量 / 防御'),
            createSkillDesignerNumberParam('gainRatio', '增幅倍率', '0.3'),
            createSkillDesignerNumberParam('duration', '持续回合', '3', '1'),
          ];
        case '多属性增益':
          return [
            createSkillDesignerTextParam('buffAttrGroup', '属性组', '力量/敏捷/防御'),
            createSkillDesignerNumberParam('gainRatio', '增幅倍率', '0.2'),
            createSkillDesignerNumberParam('duration', '持续回合', '3', '1'),
          ];
        case '全属性增益':
          return [
            createSkillDesignerNumberParam('allGainRatio', '全属性倍率', '0.15'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        case '消耗降低':
          return [
            createSkillDesignerNumberParam('gainRatio', '降低倍率', '0.85'),
            createSkillDesignerNumberParam('duration', '持续回合', '3', '1'),
          ];
        case '前摇缩短':
          return [
            createSkillDesignerNumberParam('gainRatio', '缩短倍率', '0.85'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        case '掌控提升':
          return [
            createSkillDesignerNumberParam('gainRatio', '提升倍率', '1.2'),
            createSkillDesignerNumberParam('duration', '持续回合', '3', '1'),
          ];
        case '速度提升':
          return [
            createSkillDesignerNumberParam('gainRatio', '提升倍率', '1.15'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        case '护盾':
        case '小护盾':
          return [
            createSkillDesignerNumberParam('shieldRatio', '护盾倍率', '0.8'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
            createSkillDesignerTextParam('shieldCap', '护盾上限', '基于魂力 / 基于生命'),
          ];
        case '减伤':
          return [
            createSkillDesignerNumberParam('reduceRatio', '减伤比例', '0.35'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
            createSkillDesignerTextParam('damageType', '覆盖类型', '物理 / 元素 / 全伤'),
          ];
        case '格挡/抵消':
          return [
            createSkillDesignerNumberParam('blockCount', '格挡次数', '1', '1'),
            createSkillDesignerTextParam('blockCap', '单次上限', '最多抵消一次大招'),
            createSkillDesignerTextParam('triggerRule', '触发条件', '受击瞬间'),
          ];
        case '霸体':
          return [
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
            createSkillDesignerTextParam('immuneLevel', '免控级别', '硬控 / 软控'),
            createSkillDesignerNumberParam('reduceRatio', '额外减伤', '0.2'),
          ];
        case '免死/锁血':
          return [
            createSkillDesignerTextParam('triggerThreshold', '触发阈值', '低于20%生命'),
            createSkillDesignerTextParam('lockBloodFloor', '锁血下限', '保留1点 / 10%'),
            createSkillDesignerTextParam('cooldown', '冷却/次数', '每战1次'),
          ];
        case '体力恢复':
        case '魂力恢复':
        case '精神恢复':
          return [
            createSkillDesignerNumberParam('recoverRatio', '回复倍率', '0.35'),
            createSkillDesignerNumberParam('repeatCount', '生效次数', '1', '1'),
          ];
        case '持续恢复':
          return [
            createSkillDesignerNumberParam('recoverRatio', '每回合倍率', '0.2'),
            createSkillDesignerNumberParam('duration', '持续回合', '3', '1'),
            createSkillDesignerNumberParam('stackLimit', '叠层上限', '2', '1'),
          ];
        case '净化/解控':
        case '净化':
        case '解控':
          return [
            createSkillDesignerNumberParam('cleanseCount', '净化层数', '2', '1'),
            createSkillDesignerTextParam('cleansePriority', '净化优先级', '控制 > 削弱 > 异常'),
            createSkillDesignerTextParam('extraGain', '附带收益', '回复 / 护盾 / 免疫'),
          ];
        case '感知干扰':
          return [
            createSkillDesignerNumberParam('disturbPower', '干扰强度', '1.1'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        case '标记锁定':
          return [
            createSkillDesignerNumberParam('markDuration', '标记时长', '2', '1'),
            createSkillDesignerNumberParam('targetCap', '锁定目标数', '1', '1'),
            createSkillDesignerTextParam('trackingRule', '追踪规则', '不可脱锁 / 共享坐标'),
          ];
        case '共享视野':
          return [
            createSkillDesignerTextParam('shareRange', '共享范围', '队伍 / 半径30米'),
            createSkillDesignerNumberParam('duration', '持续回合', '3', '1'),
            createSkillDesignerTextParam('infoDepth', '共享深度', '位置 / 视野 / 状态'),
          ];
        case '幻境':
          return [
            createSkillDesignerTextParam('illusionRange', '幻境范围', '半径8米'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
            createSkillDesignerNumberParam('illusionPower', '幻术强度', '1.1'),
          ];
        case '催眠':
          return [
            createSkillDesignerNumberParam('duration', '睡眠回合', '2', '1'),
            createSkillDesignerTextParam('wakeRule', '唤醒条件', '受伤 / 净化'),
            createSkillDesignerTextParam('hitRule', '命中条件', '视线锁定 / 声波接触'),
          ];
        case '认知扭曲':
          return [
            createSkillDesignerNumberParam('twistPower', '扭曲强度', '0.18'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        case '自身位移':
          return [
            createSkillDesignerTextParam('moveDistance', '位移距离', '5米'),
          ];
        case '强制位移':
          return [
            createSkillDesignerTextParam('moveDistance', '位移距离', '4米'),
            createSkillDesignerNumberParam('repeatCount', '触发次数', '1', '1'),
          ];
        case '位移交换':
          return [
            createSkillDesignerTextParam('exchangeRange', '交换范围', '8米'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
            createSkillDesignerTextParam('triggerRule', '交换条件', '命中标记目标'),
          ];
        case '追击位移':
          return [
            createSkillDesignerTextParam('moveDistance', '追击距离', '6米'),
            createSkillDesignerTextParam('followWindow', '追击窗口', '命中后1秒'),
            createSkillDesignerNumberParam('extraRatio', '追加倍率', '0.3'),
          ];
        case '脱离位移':
          return [
            createSkillDesignerTextParam('moveDistance', '脱离距离', '7米'),
            createSkillDesignerTextParam('escapeRule', '脱离条件', '生命低于50%'),
            createSkillDesignerTextParam('extraGain', '脱离收益', '隐匿 / 护盾 / 加速'),
          ];
        case '复制':
          return [
            createSkillDesignerTextParam('copyTarget', '复制对象', '招式 / 状态 / 属性'),
            createSkillDesignerNumberParam('fidelity', '保真度', '0.8'),
            createSkillDesignerTextParam('duration', '维持时长', '2回合'),
          ];
        case '反制':
          return [
            createSkillDesignerTextParam('counterTarget', '反制对象', '远程 / 控制 / 召唤'),
            createSkillDesignerTextParam('triggerRule', '触发条件', '被锁定时 / 命中前'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
            createSkillDesignerNumberParam('counterRatio', '反制倍率', '1.0'),
          ];
        case '转化':
          return [
            createSkillDesignerTextParam('convertPath', '转化方向', '伤害→护盾 / 控制→增益'),
            createSkillDesignerNumberParam('convertRatio', '转化比率', '0.6'),
          ];
        case '状态交换':
          return [
            createSkillDesignerTextParam('exchangeTarget', '交换对象', '增益 / 减益 / 标记'),
            createSkillDesignerNumberParam('exchangeCount', '交换层数', '1', '1'),
            createSkillDesignerTextParam('triggerRule', '交换条件', '双方同时命中'),
          ];
        case '强制绑定/锁定':
          return [
            createSkillDesignerNumberParam('bindDuration', '绑定回合', '2', '1'),
            createSkillDesignerNumberParam('targetCap', '绑定目标数', '1', '1'),
            createSkillDesignerTextParam('releaseRule', '解除条件', '超距离 / 净化'),
          ];
        case '条件触发':
          return [
            createSkillDesignerTextParam('triggerRule', '触发条件', '受击 / 低血 / 计时结束'),
            createSkillDesignerNumberParam('triggerCount', '触发次数', '1', '1'),
            createSkillDesignerTextParam('triggerResult', '触发结果', '爆发 / 刷新 / 召唤'),
          ];
        case '规则改写':
          return [
            createSkillDesignerTextParam('rewriteDepth', '改写幅度', '部分改写 / 完整覆盖'),
          ];
        case '穿透':
          return [
            createSkillDesignerNumberParam('penetrationRatio', '穿透比例', '0.25'),
            createSkillDesignerTextParam('penetrationTarget', '穿透对象', '防御 / 护盾 / 抗性'),
          ];
        case '吸血':
          return [
            createSkillDesignerNumberParam('lifestealRatio', '吸取比例', '0.2'),
            createSkillDesignerTextParam('resourceType', '吸取资源', '生命 / 魂力'),
          ];
        case '斩杀补伤':
          return [
            createSkillDesignerTextParam('executeLine', '触发血线', '低于25%'),
            createSkillDesignerNumberParam('bonusRatio', '补伤倍率', '0.5'),
          ];
        case '流血DOT':
          return [
            createSkillDesignerNumberParam('dotRatio', '每跳倍率', '0.2'),
            createSkillDesignerNumberParam('duration', '持续回合', '3', '1'),
          ];
        case '打断':
          return [
            createSkillDesignerTextParam('interruptWindow', '打断时机', '前摇 / 引导'),
            createSkillDesignerNumberParam('extraDelay', '追加僵直', '0.5'),
          ];
        case '反击':
          return [
            createSkillDesignerTextParam('counterRule', '反击条件', '受击后 / 格挡后'),
            createSkillDesignerNumberParam('counterRatio', '反击倍率', '0.8'),
          ];
        case '沉默':
          return [
            createSkillDesignerNumberParam('duration', '沉默回合', '2', '1'),
            createSkillDesignerTextParam('muteScope', '限制范围', '主动技 / 咏唱技'),
          ];
        case '减速':
        case '迟缓':
          return [
            createSkillDesignerNumberParam('slowRatio', '减速幅度', '0.3'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        case '致盲':
          return [
            createSkillDesignerNumberParam('duration', '致盲回合', '2', '1'),
            createSkillDesignerTextParam('blindEffect', '影响内容', '命中 / 视野 / 锁定'),
          ];
        case '禁疗':
          return [
            createSkillDesignerNumberParam('banHealRatio', '禁疗幅度', '1.0'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        case '标记弱点':
          return [
            createSkillDesignerTextParam('weakPointType', '弱点类型', '破甲 / 暴击 / 属性克制'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        default:
          return [];
      }
    }

    function getSkillDesignerMechanicParamSections(draft = {}) {
      const sections = [];
      const primaryLabel = getSkillDesignerEffectivePrimaryLabel(draft);
      const primaryMain = normalizeSkillUiText(draft.primaryMain, '');
      if (primaryLabel) {
        sections.push({ kind: 'primary', label: primaryLabel });
      } else if (primaryMain && getSkillDesignerMechanicParamDefs(primaryMain).length) {
        sections.push({ kind: 'primary', label: primaryMain });
      }
      normalizeSkillDesignerSecondarySelection(primaryMain, draft.secondaryMechanics).forEach(label => {
        sections.push({ kind: 'secondary', label });
      });
      return sections;
    }

    function collectSkillDesignerMechanicLabels(draft = {}) {
      return Array.from(new Set(
        getSkillDesignerMechanicParamSections(draft)
          .map(section => normalizeSkillUiText(section && section.label, ''))
          .filter(Boolean)
      ));
    }

    function normalizeSkillDesignerMechanicParamMap(value = {}, draft = {}) {
      const safeMap = value && typeof value === 'object' ? value : {};
      const normalized = {};
      collectSkillDesignerMechanicLabels(draft).forEach(label => {
        const defs = getSkillDesignerMechanicParamDefs(label);
        const source = safeMap[label] && typeof safeMap[label] === 'object' ? safeMap[label] : {};
        const nextEntry = {};
        defs.forEach(def => {
          const currentValue = normalizeSkillUiText(source[def.key], '');
          if (currentValue) nextEntry[def.key] = currentValue;
        });
        if (safeEntries(nextEntry).length) normalized[label] = nextEntry;
      });
      return normalized;
    }

    function buildSkillDesignerMechanicParamSummary(draft = {}) {
      const mechanicParams = normalizeSkillDesignerMechanicParamMap(draft.mechanicParams, draft);
      return collectSkillDesignerMechanicLabels(draft).map(label => {
        const defs = getSkillDesignerMechanicParamDefs(label);
        const paramState = mechanicParams[label] && typeof mechanicParams[label] === 'object' ? mechanicParams[label] : {};
        const segments = defs
          .map(def => {
            const value = normalizeSkillUiText(paramState[def.key], '');
            return value ? `${def.label}:${value}` : '';
          })
          .filter(Boolean);
        return segments.length ? `${label}(${segments.join(' / ')})` : '';
      }).filter(Boolean).join('；');
    }

    function buildSkillDesignerMechanicParamEditor(draft = {}) {
      const mechanicParams = normalizeSkillDesignerMechanicParamMap(draft.mechanicParams, draft);
      let secondaryIndex = 0;
      const sections = getSkillDesignerMechanicParamSections(draft).map(section => {
        const label = normalizeSkillUiText(section && section.label, '');
        const defs = getSkillDesignerMechanicParamDefs(label);
        if (!defs.length) return '';
        const paramState = mechanicParams[label] && typeof mechanicParams[label] === 'object' ? mechanicParams[label] : {};
        const title = section && section.kind === 'primary'
          ? `主机制 / ${label}`
          : `副机制 ${++secondaryIndex} / ${label}`;
        return `
          <div class=\"skill-designer-subsection\">
            <div class=\"mvu-editor-label\">${htmlEscape(title)}</div>
            <div class=\"mvu-editor-field-grid\">
              ${defs.map(def => {
                const currentValue = normalizeSkillUiText(paramState[def.key], '');
                if (def.type === 'select') {
                  return `
                    <label class=\"mvu-editor-field\">
                      <span class=\"mvu-editor-label\">${htmlEscape(def.label)}</span>
                      <select class=\"mvu-editor-select\" data-skill-designer-mechanic=\"${escapeHtmlAttr(label)}\" data-skill-designer-param-key=\"${escapeHtmlAttr(def.key)}\" data-skill-designer-disableable>
                        ${buildSkillDesignerSelectOptions(def.options || [], currentValue, def.placeholder || '未设置')}
                      </select>
                    </label>
                  `;
                }
                return `
                  <label class=\"mvu-editor-field\">
                    <span class=\"mvu-editor-label\">${htmlEscape(def.label)}</span>
                    <input class=\"mvu-editor-input\" type=\"${def.type === 'number' ? 'number' : 'text'}\"${def.type === 'number' ? ` step=\"${escapeHtmlAttr(def.step || '0.1')}\"` : ''} value=\"${escapeHtmlAttr(currentValue)}\"${def.placeholder ? ` placeholder=\"${escapeHtmlAttr(def.placeholder)}\"` : ''} data-skill-designer-mechanic=\"${escapeHtmlAttr(label)}\" data-skill-designer-param-key=\"${escapeHtmlAttr(def.key)}\" data-skill-designer-disableable />
                  </label>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).filter(Boolean);
      return sections.join('') || '<span class=\"tag-chip\">当前机制暂无额外参数</span>';
    }

    function readSkillDesignerMechanicParamState(mountEl, draft = {}) {
      const nextMap = {};
      collectSkillDesignerMechanicLabels(draft).forEach(label => {
        const defs = getSkillDesignerMechanicParamDefs(label);
        const entry = {};
        defs.forEach(def => {
          const input = mountEl
            ? Array.from(mountEl.querySelectorAll('[data-skill-designer-param-key]')).find(node =>
              node.getAttribute('data-skill-designer-mechanic') === label
              && node.getAttribute('data-skill-designer-param-key') === def.key,
            )
            : null;
          const value = input ? normalizeSkillUiText(input.value, '') : '';
          if (value) entry[def.key] = value;
        });
        if (safeEntries(entry).length) nextMap[label] = entry;
      });
      return nextMap;
    }

    function buildSkillDesignerFormStateFromDraft(draft = {}, previewMeta = {}) {
      const baseDraft = draft && typeof draft === 'object' ? draft : {};
      const typeMeta = resolveSkillDesignerTypeMeta(previewMeta, baseDraft.type);
      const costConfig = parseSkillDesignerCostConfig(baseDraft.cost, baseDraft.resourceType, baseDraft.resourceValue);
      const resolvedPrimaryMain = normalizeSkillUiText(baseDraft.primaryMain, '');
      const resolvedTarget = normalizeSkillUiText(baseDraft.target, '敌方单体');
      const resolvedPrimarySub = normalizeSkillUiText(
        baseDraft.primarySub,
        getSkillDesignerDefaultPrimarySub(resolvedPrimaryMain, resolvedTarget, typeMeta.value),
      );
      const coreState = {
        name: normalizeSkillUiText(baseDraft.name, toText(previewMeta && previewMeta.label, '未命名技能')),
        type: typeMeta.value,
        typeDisplay: typeMeta.display,
        target: resolvedTarget,
        cost: formatSkillDesignerCostText(costConfig.resourceType, costConfig.resourceValue),
        costType: costConfig.resourceType,
        costValue: costConfig.resourceValue,
        bonus: normalizeSkillUiText(baseDraft.bonus, '无'),
        mainRole: normalizeSkillUiText(baseDraft.mainRole, '未知'),
        primaryMain: resolvedPrimaryMain,
        primarySub: resolvedPrimarySub,
        deliveryForm: normalizeSkillUiText(baseDraft.deliveryForm, ''),
        secondaryMechanics: normalizeSkillDesignerSecondarySelection(resolvedPrimaryMain, baseDraft.secondaryMechanics),
        attachedAttributes: normalizeSkillDesignerArray(baseDraft.attachedAttributes),
        attributeSource: normalizeSkillUiText(baseDraft.attributeSource, '无') || '无',
        attributeRole: normalizeSkillUiText(baseDraft.attributeRole, '无') || '无',
        coeff: normalizeSkillDesignerCoeffMap(baseDraft.coeff),
        tags: normalizeSkillDesignerArray(baseDraft.tags),
        visualDesc: normalizeSkillUiText(baseDraft.visualDesc, ''),
        effectDesc: normalizeSkillUiText(baseDraft.effectDesc, ''),
      };
      return {
        ...coreState,
        mechanicParams: normalizeSkillDesignerMechanicParamMap(baseDraft.mechanicParams, coreState),
      };
    }

    function readSkillDesignerFormState(mountEl, previewMeta = {}) {
      const readField = key => {
        const input = mountEl ? mountEl.querySelector(`[data-skill-designer-field=\"${key}\"]`) : null;
        return input ? toText(input.value, '').trim() : '';
      };
      const readCheckedValues = name => Array.from(mountEl ? mountEl.querySelectorAll(`input[name=\"${name}\"]:checked`) : []).map(node => toText(node.value, '').trim()).filter(Boolean);
      const coeff = {};
      SKILL_ATTRIBUTE_DIM_KEYS.forEach(key => {
        const input = mountEl ? mountEl.querySelector(`[data-skill-designer-coeff=\"${key}\"]`) : null;
        const parsed = Number(input && input.value);
        coeff[key] = Number.isFinite(parsed) ? parsed : 1;
      });
      const typeMeta = resolveSkillDesignerTypeMeta(previewMeta, readField('type'));
      const baseState = {
        name: readField('name') || toText(previewMeta && previewMeta.label, '未命名技能'),
        type: typeMeta.value,
        typeDisplay: typeMeta.display,
        target: readField('target') || '敌方单体',
        costType: readField('costType') || '无',
        costValue: readField('costValue'),
        bonus: readField('bonus') || '无',
        mainRole: readField('mainRole') || '未知',
        primaryMain: readField('primaryMain'),
        primarySub: readField('primarySub'),
        deliveryForm: readField('deliveryForm'),
        secondaryMechanics: readCheckedValues('skill-secondary'),
        attachedAttributes: readCheckedValues('skill-attribute'),
        attributeSource: readField('attributeSource') || '无',
        attributeRole: readField('attributeRole') || '无',
        coeff,
        tags: normalizeSkillDesignerArray(readField('tags')),
        visualDesc: readField('visualDesc'),
        effectDesc: readField('effectDesc'),
      };
      return {
        ...baseState,
        cost: formatSkillDesignerCostText(baseState.costType, baseState.costValue),
        mechanicParams: readSkillDesignerMechanicParamState(mountEl, baseState),
      };
    }

    function ensureSkillDesignerEffectArray(skill = {}) {
      const effectArray = cloneJsonValue(Array.isArray(skill && skill['_效果数组']) ? skill['_效果数组'] : []);
      let systemBaseIndex = effectArray.findIndex(effect => toText(effect && effect['机制'], '').trim() === '系统基础');
      if (systemBaseIndex < 0) {
        effectArray.unshift({ '机制': '系统基础' });
        systemBaseIndex = 0;
      }
      if (!effectArray[systemBaseIndex] || typeof effectArray[systemBaseIndex] !== 'object') effectArray[systemBaseIndex] = { '机制': '系统基础' };
      return {
        effectArray,
        systemBase: effectArray[systemBaseIndex]
      };
    }

    const SKILL_DESIGNER_RUNTIME_PROPERTY_KEY_BY_LABEL = Object.freeze({
      '力量': 'str',
      '防御': 'def',
      '敏捷': 'agi',
      '体力上限': 'vit_max',
      '魂力上限': 'sp_max',
      '精神力上限': 'men_max',
      '体力': 'vit',
      '魂力': 'sp',
      '精神力': 'men',
      '掌控': '掌控',
      '威力': '威力',
      '消耗': '消耗',
      '前摇': '前摇',
      '控制': '控制',
      '速度': '速度',
    });
    const SKILL_DESIGNER_RUNTIME_CAST_TIME_BY_DELIVERY = Object.freeze({
      '直接生效': 10,
      '自身附体': 6,
      '远程命中': 12,
      '范围展开': 18,
      '召唤承载': 20,
      '造物承载': 20,
      '标记触发': 10,
      '延迟触发': 16,
    });

    function buildSkillDesignerRuntimeObject(source = {}) {
      const result = {};
      safeEntries(source && typeof source === 'object' ? source : {}).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (typeof value === 'string' && !value.trim()) return;
        if (Array.isArray(value) && !value.length) return;
        if (value && typeof value === 'object' && !Array.isArray(value) && !safeEntries(value).length) return;
        result[key] = value;
      });
      return result;
    }

    function parseSkillDesignerNumericInputValue(value, fallback = 0, digits = 4) {
      const rawText = toText(value, '').trim();
      if (!rawText) return Number(Number(fallback || 0).toFixed(digits));
      const match = rawText.match(/-?\d+(?:\.\d+)?/);
      const parsed = Number(match ? match[0] : rawText);
      if (!Number.isFinite(parsed)) return Number(Number(fallback || 0).toFixed(digits));
      return Number(parsed.toFixed(digits));
    }

    function parseSkillDesignerIntegerInputValue(value, fallback = 0, minimum = 0) {
      const parsed = Math.round(parseSkillDesignerNumericInputValue(value, fallback, 0));
      if (!Number.isFinite(parsed)) return Math.max(minimum, Math.round(Number(fallback || 0)));
      return Math.max(minimum, parsed);
    }

    function parseSkillDesignerPercentRatio(value, fallback = 0) {
      const rawText = toText(value, '').trim();
      if (!rawText) return Number(Number(fallback || 0).toFixed(4));
      const parsed = parseSkillDesignerNumericInputValue(rawText, fallback, 4);
      if (!Number.isFinite(parsed)) return Number(Number(fallback || 0).toFixed(4));
      if (/%/.test(rawText) || parsed > 1) return Number((parsed / 100).toFixed(4));
      return Number(parsed.toFixed(4));
    }

    function parseSkillDesignerFactorInputValue(value, fallback = 1, options = {}) {
      const rawText = toText(value, '').trim();
      const plusBase = !!(options && options.plusBase);
      if (!rawText) return Number(Number(fallback || 0).toFixed(4));
      const parsed = parseSkillDesignerNumericInputValue(rawText, fallback, 4);
      if (!Number.isFinite(parsed)) return Number(Number(fallback || 0).toFixed(4));
      if (/%/.test(rawText)) {
        const ratio = parsed / 100;
        return Number((plusBase ? 1 + ratio : ratio).toFixed(4));
      }
      if (plusBase && parsed >= 0 && parsed <= 1) return Number((1 + parsed).toFixed(4));
      return Number(parsed.toFixed(4));
    }

    function parseSkillDesignerReductionFactor(value, fallback = 0.8) {
      const rawText = toText(value, '').trim();
      if (!rawText) return Number(Number(fallback || 0).toFixed(4));
      if (/%/.test(rawText)) {
        const ratio = parseSkillDesignerPercentRatio(rawText, Math.max(0, 1 - Number(fallback || 0)));
        return Number((1 - ratio).toFixed(4));
      }
      const parsed = parseSkillDesignerNumericInputValue(rawText, fallback, 4);
      if (!Number.isFinite(parsed)) return Number(Number(fallback || 0).toFixed(4));
      if (parsed >= 0 && parsed <= 1) return Number((1 - parsed).toFixed(4));
      if (parsed > 1 && parsed <= 100) return Number((1 - parsed / 100).toFixed(4));
      return Number(parsed.toFixed(4));
    }

    function parseSkillDesignerPercentPoints(value, fallback = 0) {
      const rawText = toText(value, '').trim();
      if (!rawText) return Number(Number(fallback || 0).toFixed(2));
      const parsed = parseSkillDesignerNumericInputValue(rawText, fallback, 2);
      if (!Number.isFinite(parsed)) return Number(Number(fallback || 0).toFixed(2));
      if (parsed >= 0 && parsed <= 1) return Number((parsed * 100).toFixed(2));
      return Number(parsed.toFixed(2));
    }

    function normalizeSkillDesignerTargetForRuntime(target = '', mode = 'effect') {
      const text = normalizeSkillUiText(target, mode === 'system' ? '敌方/单体' : '敌方单体');
      const effectMap = {
        '自身': '自身',
        '友方单体': '友方单体',
        '友方群体': '友方群体',
        '敌方单体': '敌方单体',
        '敌方群体': '敌方群体',
        '全场': '全场',
        '食用者': '食用者',
        '使用者': '使用者',
        '召唤物': '召唤物',
        '造物': '造物',
        '己方/单体': '友方单体',
        '己方/群体': '友方群体',
        '敌方/单体': '敌方单体',
        '敌方/群体': '敌方群体',
      };
      const systemMap = {
        '自身': '自身',
        '友方单体': '己方/单体',
        '友方群体': '己方/群体',
        '敌方单体': '敌方/单体',
        '敌方群体': '敌方/群体',
        '全场': '全场',
        '食用者': '食用者',
        '使用者': '使用者',
        '召唤物': '召唤物',
        '造物': '造物',
        '己方/单体': '己方/单体',
        '己方/群体': '己方/群体',
        '敌方/单体': '敌方/单体',
        '敌方/群体': '敌方/群体',
      };
      const mapping = mode === 'system' ? systemMap : effectMap;
      return mapping[text] || (mode === 'system' ? '敌方/单体' : '敌方单体');
    }

    function resolveSkillDesignerSupportTargetForRuntime(target = '') {
      const normalizedTarget = normalizeSkillDesignerTargetForRuntime(target, 'effect');
      if (/敌方/.test(normalizedTarget) || normalizedTarget === '全场') return '自身';
      return normalizedTarget || '自身';
    }

    function resolveSkillDesignerSharedVisionTargetForRuntime(target = '') {
      const normalizedTarget = normalizeSkillDesignerTargetForRuntime(target, 'effect');
      if (/敌方/.test(normalizedTarget) || normalizedTarget === '全场') return '友方群体';
      return normalizedTarget || '友方群体';
    }

    function resolveSkillDesignerPropertyKeyByLabel(label = '') {
      const normalized = normalizeSkillUiText(label, '');
      return SKILL_DESIGNER_RUNTIME_PROPERTY_KEY_BY_LABEL[normalized] || normalized;
    }

    function resolveSkillDesignerPropertyKeysFromText(text = '', options = {}) {
      const includeFullSet = !!(options && options.includeFullSet);
      if (includeFullSet) return [...SKILL_DESIGNER_FULL_ATTRIBUTE_KEYS];
      return Array.from(new Set(
        normalizeSkillDesignerArray(text)
          .map(resolveSkillDesignerPropertyKeyByLabel)
          .filter(Boolean)
      ));
    }

    function getSkillDesignerMechanicParamsForRuntime(draft = {}, label = '') {
      const map = normalizeSkillDesignerMechanicParamMap(draft && draft.mechanicParams, draft || {});
      return map[label] && typeof map[label] === 'object' ? map[label] : {};
    }

    function getSkillDesignerEffectivePrimaryLabel(draft = {}) {
      const primarySub = normalizeSkillUiText(draft && draft.primarySub, '');
      if (primarySub) return primarySub;
      const primaryMain = normalizeSkillUiText(draft && draft.primaryMain, '');
      return getSkillDesignerDefaultPrimarySub(primaryMain, draft && draft.target, draft && draft.type) || primaryMain;
    }

    function estimateSkillDesignerShieldValue(shieldHint, shieldCapText = '') {
      const numericHint = parseSkillDesignerNumericInputValue(shieldHint, 0.8, 4);
      if (numericHint > 5) return Number(numericHint.toFixed(0));
      const activeChar = liveSnapshot && liveSnapshot.activeChar && typeof liveSnapshot.activeChar === 'object' ? liveSnapshot.activeChar : {};
      const vitMax = Number(
        deepGet(activeChar, 'battle.vit_max', 0)
        || deepGet(activeChar, 'battle.vit', 0)
        || deepGet(activeChar, 'vit_max', 0)
        || deepGet(activeChar, 'vit', 0)
        || 0
      );
      const spMax = Number(
        deepGet(activeChar, 'battle.sp_max', 0)
        || deepGet(activeChar, 'battle.sp', 0)
        || deepGet(activeChar, 'sp_max', 0)
        || deepGet(activeChar, 'sp', 0)
        || 0
      );
      const menMax = Number(
        deepGet(activeChar, 'battle.men_max', 0)
        || deepGet(activeChar, 'battle.men', 0)
        || deepGet(activeChar, 'men_max', 0)
        || deepGet(activeChar, 'men', 0)
        || 0
      );
      const capText = normalizeSkillUiText(shieldCapText, '');
      let baseValue = Math.max(vitMax, spMax, menMax, 100);
      if (/魂力/.test(capText)) baseValue = Math.max(spMax, 100);
      else if (/精神/.test(capText)) baseValue = Math.max(menMax, 100);
      else if (/生命|气血|体力/.test(capText)) baseValue = Math.max(vitMax, 100);
      return Math.max(1, Math.round(baseValue * Math.max(0.05, numericHint)));
    }

    function inferSkillDesignerRecoverProperty(draft = {}, fallback = 'vit') {
      const bonus = normalizeSkillUiText(draft && draft.bonus, '');
      if (/精神/.test(bonus)) return 'men';
      if (/魂力/.test(bonus)) return 'sp';
      if (/气血|生命|体力/.test(bonus)) return 'vit';
      const attached = normalizeSkillDesignerArray(draft && draft.attachedAttributes);
      if (attached.includes('精神')) return 'men';
      if (attached.includes('生命')) return 'vit';
      if (attached.some(attr => ['光', '水', '木'].includes(attr))) return 'vit';
      return fallback;
    }

    function inferSkillDesignerDamageType(draft = {}) {
      const type = normalizeSkillUiText(draft && draft.type, '');
      const deliveryForm = normalizeSkillUiText(draft && draft.deliveryForm, '');
      if (/精神/.test(type)) return '精神';
      if (/元素/.test(type)) return /远程|范围|延迟/.test(deliveryForm) ? '元素远程' : '元素近战';
      if (/控制/.test(type)) return '魂力控制';
      if (/治疗|辅助/.test(type)) return '魂力';
      if (/远程|范围|标记|延迟/.test(deliveryForm)) return '物理远程';
      return '物理近战';
    }

    function estimateSkillDesignerDotDamage(baseEffect = null, ratioHint = 0.2) {
      const ratio = parseSkillDesignerPercentRatio(ratioHint, 0.2);
      const basePower = Number(baseEffect && baseEffect['威力倍率'] || 0);
      if (basePower > 0) return Number((basePower * ratio).toFixed(2));
      return Number(Math.max(1, ratio * 100).toFixed(2));
    }

    function buildSkillDesignerPackedAttributeEffect(mechanism, target, property, action, value, duration = 0, trigger = '立即生效') {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue)) return null;
      return buildSkillDesignerRuntimeObject({
        '机制': mechanism,
        '对象': target || '自身',
        '属性': property,
        '动作': action,
        '数值': Number(numericValue.toFixed(4)),
        '持续': Math.max(0, Number(duration || 0)),
        '触发': trigger || '立即生效',
      });
    }

    function buildSkillDesignerPackedRecoverAttributeEffect(target, property, ratio, duration = 0, overtime = false) {
      const numericValue = Number(ratio);
      if (!Number.isFinite(numericValue) || numericValue <= 0) return null;
      return buildSkillDesignerPackedAttributeEffect(
        overtime ? '持续恢复' : '属性变化',
        target,
        property,
        overtime ? '持续恢复' : '加值',
        numericValue,
        overtime ? duration : 0,
        overtime ? '每回合' : '立即生效',
      );
    }

    function buildSkillDesignerAttributeEffectsForProperties(target, properties = [], action = '倍率提升', value = 1, duration = 0) {
      return (Array.isArray(properties) ? properties : [])
        .map(property => buildSkillDesignerPackedAttributeEffect(
          '属性变化',
          target,
          property,
          action,
          value,
          duration,
          duration > 0 ? '状态持续' : '立即生效',
        ))
        .filter(Boolean);
    }

    function buildSkillDesignerStateCarrierEffect(stateName, target, duration = 0, options = {}) {
      return buildSkillDesignerRuntimeObject({
        '机制': '状态挂载',
        '目标': target || '自身',
        '状态名称': stateName || '状态挂载',
        '持续回合': Math.max(0, Number(duration || 0)),
        '面板修改比例': options && options.statMods && typeof options.statMods === 'object' ? options.statMods : undefined,
        '计算层效果': options && options.calc && typeof options.calc === 'object' ? options.calc : undefined,
        '特殊机制标识': options && options.marker ? options.marker : stateName,
      });
    }

    function buildSkillDesignerSystemBaseEffect(skillSource = {}, draft = {}, previewMeta = {}) {
      const effectInfo = ensureSkillDesignerEffectArray(skillSource);
      const existing = effectInfo.systemBase && typeof effectInfo.systemBase === 'object' ? effectInfo.systemBase : {};
      const isPassive = /被动/.test(normalizeSkillUiText(draft && draft.type, '')) || toText(previewMeta && previewMeta.scope, '') === 'blood_passive';
      const systemTarget = draft && draft.deliveryForm === '造物承载'
        ? '自身'
        : normalizeSkillDesignerTargetForRuntime(draft && draft.target, 'system');
      const fallbackCastTime = SKILL_DESIGNER_RUNTIME_CAST_TIME_BY_DELIVERY[normalizeSkillUiText(draft && draft.deliveryForm, '直接生效')] || 10;
      const existingCastTime = Number(existing['cast_time']);
      const skillTypeText = (() => {
        const baseType = normalizeSkillUiText(draft && draft.type, '技能');
        if (isPassive && !/被动/.test(baseType)) return `被动/${baseType}`;
        return baseType || '技能';
      })();
      return buildSkillDesignerRuntimeObject({
        ...cloneJsonValue(existing),
        '机制': '系统基础',
        '技能类型': skillTypeText,
        '对象': systemTarget,
        '消耗': isPassive ? '无' : (draft && draft.cost) || '无',
        'cast_time': isPassive ? 0 : (Number.isFinite(existingCastTime) ? existingCastTime : fallbackCastTime),
        '标签': normalizeSkillDesignerArray(draft && draft.tags),
      });
    }

    function buildSkillDesignerPrimaryEffects(draft = {}, runtimeState = {}) {
      const primaryLabel = getSkillDesignerEffectivePrimaryLabel(draft);
      const target = runtimeState && runtimeState.target ? runtimeState.target : normalizeSkillDesignerTargetForRuntime(draft && draft.target, 'effect');
      const params = getSkillDesignerMechanicParamsForRuntime(draft, primaryLabel);
      const duration = parseSkillDesignerIntegerInputValue(
        params['duration']
        || params['markDuration']
        || params['bindDuration'],
        2,
        0
      );
      switch (primaryLabel) {
        case '单体伤害':
        case '群体伤害':
        case '多段伤害':
        case '延迟爆发':
        case '持续伤害': {
          const mechanism = primaryLabel === '多段伤害'
            ? '多段伤害'
            : primaryLabel === '延迟爆发'
              ? '延迟爆发'
              : primaryLabel === '持续伤害'
                ? '持续伤害'
                : '直接伤害';
          const powerKey = primaryLabel === '多段伤害'
            ? 'segmentRatio'
            : primaryLabel === '延迟爆发'
              ? 'burstRatio'
              : primaryLabel === '持续伤害'
                ? 'dotRatio'
                : 'powerRatio';
          const damageEffect = buildSkillDesignerRuntimeObject({
            '机制': mechanism,
            '目标': target,
            '威力倍率': parseSkillDesignerFactorInputValue(params[powerKey], primaryLabel === '延迟爆发' ? 1.8 : (primaryLabel === '持续伤害' ? 0.35 : 1.25)),
            '伤害类型': inferSkillDesignerDamageType(draft),
            '穿透修饰': 0,
            '吸血比例': 0,
            '命中次数': parseSkillDesignerIntegerInputValue(params['hitCount'], 1, 1),
            '段数': primaryLabel === '多段伤害' ? parseSkillDesignerIntegerInputValue(params['segmentCount'], 3, 1) : undefined,
            '每段倍率': primaryLabel === '多段伤害' ? parseSkillDesignerFactorInputValue(params['segmentRatio'], 0.45) : undefined,
            '段间间隔': primaryLabel === '多段伤害' ? normalizeSkillUiText(params['segmentInterval'], '') : undefined,
            '延迟时长': primaryLabel === '延迟爆发' ? normalizeSkillUiText(params['delayWindow'], '') : undefined,
            '触发条件': primaryLabel === '延迟爆发' ? normalizeSkillUiText(params['triggerRule'], '') : undefined,
            '持续回合': primaryLabel === '持续伤害' ? parseSkillDesignerIntegerInputValue(params['duration'], 3, 1) : undefined,
            '叠层上限': primaryLabel === '持续伤害' ? parseSkillDesignerIntegerInputValue(params['stackLimit'], 1, 1) : undefined,
            '作用范围': normalizeSkillUiText(params['range'], ''),
          });
          return damageEffect ? [damageEffect] : [];
        }
        case '硬控':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '硬控',
              '目标': target,
              '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              '控制强度': parseSkillDesignerFactorInputValue(params['controlPower'], 1.0),
              '解除条件': normalizeSkillUiText(params['breakRule'] || params['hitRule'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '软控': {
          const controlPenalty = parseSkillDesignerPercentRatio(params['slowRatio'], 0.3);
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '软控',
              '目标': target,
              '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              'reaction_penalty': Number(controlPenalty.toFixed(4)),
              'cast_speed_penalty': Number(Math.max(0, controlPenalty * 0.8).toFixed(4)),
              'dodge_penalty': Number(Math.max(0, controlPenalty * 0.8).toFixed(4)),
              '命中条件': normalizeSkillUiText(params['hitRule'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        }
        case '位移限制': {
          const limitPower = parseSkillDesignerPercentRatio(params['limitPower'], 0.2);
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '位移限制',
              '目标': target,
              '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              'reaction_penalty': Number(limitPower.toFixed(4)),
              'dodge_penalty': Number(limitPower.toFixed(4)),
              'lock_level': parseSkillDesignerIntegerInputValue(params['limitPower'], 1, 1),
              '封锁范围': normalizeSkillUiText(params['lockRange'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        }
        case '节奏打断':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '打断',
              '目标': target,
              '中断概率': Math.min(1, parseSkillDesignerNumericInputValue(params['interruptCount'], 1, 4)),
              '打断时机': normalizeSkillUiText(params['interruptWindow'], ''),
              '追加僵直': parseSkillDesignerNumericInputValue(params['extraDelay'], 0.5, 4),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '单属性削弱':
        case '多属性削弱': {
          const properties = resolveSkillDesignerPropertyKeysFromText(
            primaryLabel === '单属性削弱' ? params['debuffAttr'] : params['debuffAttrGroup'],
            { includeFullSet: false }
          );
          return buildSkillDesignerAttributeEffectsForProperties(
            target,
            primaryLabel === '单属性削弱' ? properties.slice(0, 1) : properties,
            '倍率压制',
            parseSkillDesignerFactorInputValue(params['reduceRatio'], 0.8),
            parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
          );
        }
        case '禁疗':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '禁疗',
              '目标': target,
              '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              'heal_block_ratio': parseSkillDesignerPercentRatio(params['banHealRatio'], 1.0),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '消耗提高':
          return [
            buildSkillDesignerPackedAttributeEffect(
              '消耗修正',
              target,
              '消耗',
              '消耗提高',
              parseSkillDesignerFactorInputValue(params['gainRatio'], 1.2),
              parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              '状态持续',
            ),
          ].filter(Boolean);
        case '前摇拉长':
          return [
            buildSkillDesignerPackedAttributeEffect(
              '前摇修正',
              target,
              '前摇',
              '前摇拉长',
              parseSkillDesignerFactorInputValue(params['gainRatio'], 1.2),
              parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              '状态持续',
            ),
          ].filter(Boolean);
        case '掌控压制':
          return [
            buildSkillDesignerPackedAttributeEffect(
              '掌控修正',
              target,
              '掌控',
              '倍率压制',
              parseSkillDesignerFactorInputValue(params['gainRatio'], 0.8),
              parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              '状态持续',
            ),
          ].filter(Boolean);
        case '速度压制':
          return [
            buildSkillDesignerPackedAttributeEffect(
              '速度修正',
              target,
              '速度',
              '倍率压制',
              parseSkillDesignerFactorInputValue(params['gainRatio'], 0.85),
              parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              '状态持续',
            ),
          ].filter(Boolean);
        case '单属性增益':
        case '多属性增益':
        case '全属性增益': {
          const properties = primaryLabel === '全属性增益'
            ? resolveSkillDesignerPropertyKeysFromText('', { includeFullSet: true })
            : resolveSkillDesignerPropertyKeysFromText(
              primaryLabel === '单属性增益' ? params['buffAttr'] : params['buffAttrGroup'],
              { includeFullSet: false }
            );
          const gainKey = primaryLabel === '全属性增益' ? 'allGainRatio' : 'gainRatio';
          const gainValue = parseSkillDesignerFactorInputValue(
            params[gainKey],
            primaryLabel === '全属性增益' ? 1.15 : 1.3,
            { plusBase: true },
          );
          return buildSkillDesignerAttributeEffectsForProperties(
            target,
            primaryLabel === '单属性增益' ? properties.slice(0, 1) : properties,
            '倍率提升',
            gainValue,
            parseSkillDesignerIntegerInputValue(params['duration'], primaryLabel === '全属性增益' ? 2 : 3, 1),
          );
        }
        case '消耗降低':
          return [
            buildSkillDesignerPackedAttributeEffect(
              '消耗修正',
              target,
              '消耗',
              '消耗降低',
              parseSkillDesignerFactorInputValue(params['gainRatio'], 0.85),
              parseSkillDesignerIntegerInputValue(params['duration'], 3, 1),
              '状态持续',
            ),
          ].filter(Boolean);
        case '前摇缩短':
          return [
            buildSkillDesignerPackedAttributeEffect(
              '前摇修正',
              target,
              '前摇',
              '前摇缩短',
              parseSkillDesignerFactorInputValue(params['gainRatio'], 0.85),
              parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              '状态持续',
            ),
          ].filter(Boolean);
        case '掌控提升':
          return [
            buildSkillDesignerPackedAttributeEffect(
              '掌控修正',
              target,
              '掌控',
              '倍率提升',
              parseSkillDesignerFactorInputValue(params['gainRatio'], 1.2),
              parseSkillDesignerIntegerInputValue(params['duration'], 3, 1),
              '状态持续',
            ),
          ].filter(Boolean);
        case '速度提升':
          return [
            buildSkillDesignerPackedAttributeEffect(
              '速度修正',
              target,
              '速度',
              '倍率提升',
              parseSkillDesignerFactorInputValue(params['gainRatio'], 1.15),
              parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              '状态持续',
            ),
          ].filter(Boolean);
        case '护盾':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '护盾',
              '目标': target,
              '护盾值': estimateSkillDesignerShieldValue(params['shieldRatio'], params['shieldCap']),
              '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              '护盾来源': normalizeSkillUiText(params['shieldCap'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '减伤':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '减伤',
              '目标': target,
              '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              '减伤比例': parseSkillDesignerPercentRatio(params['reduceRatio'], 0.35),
              '覆盖类型': normalizeSkillUiText(params['damageType'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '格挡/抵消':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '格挡',
              '目标': target,
              '持续回合': 2,
              '抵消次数': parseSkillDesignerIntegerInputValue(params['blockCount'], 1, 1),
              '单次上限': normalizeSkillUiText(params['blockCap'], ''),
              '触发条件': normalizeSkillUiText(params['triggerRule'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '霸体':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '霸体',
              '目标': target,
              '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              '免控级别': normalizeSkillUiText(params['immuneLevel'], ''),
              '减伤比例': parseSkillDesignerPercentRatio(params['reduceRatio'], 0.2),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '免死/锁血':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '免死',
              '目标': target,
              '持续回合': 3,
              '触发次数': parseSkillDesignerIntegerInputValue(params['cooldown'], 1, 1),
              '触发阈值': normalizeSkillUiText(params['triggerThreshold'], ''),
              '锁血下限': normalizeSkillUiText(params['lockBloodFloor'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '体力恢复':
          return [
            buildSkillDesignerPackedRecoverAttributeEffect(
              target,
              'vit',
              parseSkillDesignerPercentRatio(params['recoverRatio'], 0.35) * parseSkillDesignerIntegerInputValue(params['repeatCount'], 1, 1),
              0,
              false,
            ),
          ].filter(Boolean);
        case '魂力恢复':
          return [
            buildSkillDesignerPackedRecoverAttributeEffect(
              target,
              'sp',
              parseSkillDesignerPercentRatio(params['recoverRatio'], 0.35) * parseSkillDesignerIntegerInputValue(params['repeatCount'], 1, 1),
              0,
              false,
            ),
          ].filter(Boolean);
        case '精神恢复':
          return [
            buildSkillDesignerPackedRecoverAttributeEffect(
              target,
              'men',
              parseSkillDesignerPercentRatio(params['recoverRatio'], 0.35) * parseSkillDesignerIntegerInputValue(params['repeatCount'], 1, 1),
              0,
              false,
            ),
          ].filter(Boolean);
        case '持续恢复':
          return [
            buildSkillDesignerPackedRecoverAttributeEffect(
              target,
              inferSkillDesignerRecoverProperty(draft, 'vit'),
              parseSkillDesignerPercentRatio(params['recoverRatio'], 0.2),
              parseSkillDesignerIntegerInputValue(params['duration'], 3, 1),
              true,
            ),
          ].filter(Boolean);
        case '净化/解控':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '解控',
              '目标': target,
              '清除层级': parseSkillDesignerIntegerInputValue(params['cleanseCount'], 2, 1),
              '清除优先级': normalizeSkillUiText(params['cleansePriority'], ''),
              '附带收益': normalizeSkillUiText(params['extraGain'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '感知干扰': {
          const disturbRatio = parseSkillDesignerPercentRatio(params['disturbPower'], 0.12);
          return [
            buildSkillDesignerStateCarrierEffect(
              '感知干扰',
              target,
              parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              {
                calc: {
                  'hit_penalty': Number(disturbRatio.toFixed(4)),
                  'reaction_penalty': Number(Math.max(0, disturbRatio * 0.7).toFixed(4)),
                },
                marker: '感知干扰',
              },
            ),
          ].filter(effect => safeEntries(effect).length);
        }
        case '标记锁定':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '标记锁定',
              '目标': target,
              '持续回合': parseSkillDesignerIntegerInputValue(params['markDuration'], 2, 1),
              '判定属性': 'men_max',
              '判定阈值': 1.0,
              '成功参数': {
                'hit_bonus': 0.1,
                'dodge_penalty': 0.1,
                'lock_level': parseSkillDesignerIntegerInputValue(params['targetCap'], 1, 1),
              },
              '失败参数': { 'hit_bonus': 0.03, 'lock_level': 0 },
              '追踪规则': normalizeSkillUiText(params['trackingRule'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '共享视野':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '共享视野',
              '目标': target,
              '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 3, 1),
              'reaction_bonus': 0.1,
              'hit_bonus': 0.1,
              'lock_level': 1,
              '共享深度': normalizeSkillUiText(params['infoDepth'], ''),
              '共享范围': normalizeSkillUiText(params['shareRange'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '幻境': {
          const illusionPower = parseSkillDesignerFactorInputValue(params['illusionPower'], 1.1);
          const penalty = Number(Math.max(0.05, Math.min(0.45, illusionPower - 1)).toFixed(4));
          const agiRatio = Number(Math.max(0.55, 1 - penalty).toFixed(4));
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '幻境',
              '目标': target,
              '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              '判定属性': 'men_max',
              '判定阈值': 1.05,
              '成功参数': {
                'stat_mods': { 'agi': agiRatio },
                'reaction_penalty': penalty,
                'skip_turn': illusionPower >= 1.35,
              },
              '失败参数': {
                'reaction_penalty': Number((penalty * 0.35).toFixed(4)),
              },
              '幻境范围': normalizeSkillUiText(params['illusionRange'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        }
        case '催眠':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '催眠',
              '目标': target,
              '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              '判定属性': 'men_max',
              '判定阈值': 1.1,
              '成功参数': { 'skip_turn': true, 'cannot_react': true },
              '失败参数': {},
              '唤醒条件': normalizeSkillUiText(params['wakeRule'], ''),
              '命中条件': normalizeSkillUiText(params['hitRule'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '认知扭曲': {
          const twistPower = parseSkillDesignerPercentRatio(params['twistPower'], 0.18);
          return [
            buildSkillDesignerStateCarrierEffect(
              '认知扭曲',
              target,
              parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              {
                calc: {
                  'hit_penalty': Number(twistPower.toFixed(4)),
                  'reaction_penalty': Number(Math.max(0, twistPower * 0.8).toFixed(4)),
                  'dodge_penalty': Number(Math.max(0, twistPower * 0.5).toFixed(4)),
                },
                marker: '认知扭曲',
              },
            ),
          ].filter(effect => safeEntries(effect).length);
        }
        case '自身位移':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '自身位移',
              '目标': '自身',
              '持续回合': 1,
              'dodge_bonus': 0.12,
              'attacker_speed_bonus': 0.08,
              'reaction_bonus': 0.08,
              '位移距离': normalizeSkillUiText(params['moveDistance'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '强制位移':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '强制位移',
              '目标': target,
              '持续回合': 1,
              'dodge_penalty': 0.12,
              'reaction_penalty': 0.08,
              'lock_level': 1,
              '位移距离': normalizeSkillUiText(params['moveDistance'], ''),
              '触发次数': parseSkillDesignerIntegerInputValue(params['repeatCount'], 1, 1),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '位移交换':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '位移交换',
              '目标': target,
              '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              'dodge_penalty': 0.15,
              'reaction_penalty': 0.12,
              'lock_level': 1,
              '交换距离': normalizeSkillUiText(params['exchangeRange'], ''),
              '交换条件': normalizeSkillUiText(params['triggerRule'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '追击位移':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '追击位移',
              '目标': '自身',
              '持续回合': 1,
              'attacker_speed_bonus': 0.12,
              'hit_bonus': 0.1,
              'final_damage_mult': parseSkillDesignerFactorInputValue(params['extraRatio'], 1.3, { plusBase: true }),
              '追击距离': normalizeSkillUiText(params['moveDistance'], ''),
              '追击窗口': normalizeSkillUiText(params['followWindow'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '脱离位移':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '脱离位移',
              '目标': '自身',
              '持续回合': 1,
              'dodge_bonus': 0.15,
              'cast_speed_bonus': 0.12,
              'reaction_bonus': 0.12,
              '脱离距离': normalizeSkillUiText(params['moveDistance'], ''),
              '脱离条件': normalizeSkillUiText(params['escapeRule'], ''),
              '脱离收益': normalizeSkillUiText(params['extraGain'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '复制':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '复制',
              '目标': target,
              '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              '复制类型': /减益|debuff/i.test(toText(params['copyTarget'], '')) ? 'debuff' : 'buff',
              '复制数量': 1,
              '保真度': parseSkillDesignerFactorInputValue(params['fidelity'], 0.8),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '反制':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '反制',
              '目标': '自身',
              '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              '反击倍率': parseSkillDesignerFactorInputValue(params['counterRatio'], 1.0),
              'damage_reduction': 0.15,
              '反制对象': normalizeSkillUiText(params['counterTarget'], ''),
              '触发条件': normalizeSkillUiText(params['triggerRule'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '转化': {
          const convertPath = normalizeSkillUiText(params['convertPath'], '');
          const mechanism = /回复.*伤害|healing?.*damage/i.test(convertPath) ? '回复转伤害' : '伤害转回复';
          return [
            buildSkillDesignerRuntimeObject({
              '机制': mechanism,
              '目标': mechanism === '伤害转回复' ? '自身' : target,
              '转换比例': parseSkillDesignerPercentRatio(params['convertRatio'], 0.6),
              '转化方向': convertPath,
            }),
          ].filter(effect => safeEntries(effect).length);
        }
        case '状态交换':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '状态交换',
              '目标': target,
              '交换数量': parseSkillDesignerIntegerInputValue(params['exchangeCount'], 1, 1),
              '优先策略': normalizeSkillUiText(params['exchangeTarget'], '自身负面换目标正面'),
              '交换条件': normalizeSkillUiText(params['triggerRule'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '强制绑定/锁定':
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '强制绑定/锁定',
              '目标': target,
              '持续回合': parseSkillDesignerIntegerInputValue(params['bindDuration'], 2, 1),
              'dodge_penalty': 0.1,
              'reaction_penalty': 0.1,
              'lock_level': parseSkillDesignerIntegerInputValue(params['targetCap'], 1, 1),
              '解除条件': normalizeSkillUiText(params['releaseRule'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        case '条件触发': {
          const triggerRule = normalizeSkillUiText(params['triggerRule'], '');
          const judgeKey = /低血|生命|血量/.test(triggerRule) ? 'vit_ratio' : 'men_max';
          const judgeThreshold = judgeKey === 'vit_ratio' ? 0.5 : 1.0;
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '条件触发',
              '目标': target,
              '判定属性': judgeKey,
              '判定阈值': judgeThreshold,
              '成功参数': {
                'final_damage_mult': 1.2,
                'hit_bonus': 0.1,
              },
              '失败参数': {},
              '触发条件': triggerRule,
              '触发次数': parseSkillDesignerIntegerInputValue(params['triggerCount'], 1, 1),
              '触发结果': normalizeSkillUiText(params['triggerResult'], ''),
            }),
          ].filter(effect => safeEntries(effect).length);
        }
        case '规则改写': {
          const rewriteDepth = normalizeSkillUiText(params['rewriteDepth'], '');
          const effects = [
            buildSkillDesignerRuntimeObject({
              '机制': '高波动随机值',
              '目标': '自身',
              '波动下限': 0.6,
              '波动上限': rewriteDepth.includes('完整') ? 1.8 : 1.5,
            }),
          ];
          if (/完整|覆盖/.test(rewriteDepth)) {
            effects.push(buildSkillDesignerRuntimeObject({ '机制': '随机目标', '目标': '随机目标', '偏移概率': 0.35 }));
          }
          if (/完整/.test(rewriteDepth)) {
            effects.push(buildSkillDesignerRuntimeObject({ '机制': '自身也受影响', '目标': '自身', '双向生效': true }));
          }
          return effects.filter(effect => safeEntries(effect).length);
        }
        default:
          return [];
      }
    }

    function buildSkillDesignerSecondaryEffects(draft = {}, runtimeState = {}, label = '') {
      const effects = [];
      const params = getSkillDesignerMechanicParamsForRuntime(draft, label);
      const offensiveTarget = runtimeState && runtimeState.target ? runtimeState.target : normalizeSkillDesignerTargetForRuntime(draft && draft.target, 'effect');
      const supportTarget = runtimeState && runtimeState.supportTarget ? runtimeState.supportTarget : resolveSkillDesignerSupportTargetForRuntime(draft && draft.target);
      const sharedVisionTarget = runtimeState && runtimeState.sharedVisionTarget ? runtimeState.sharedVisionTarget : resolveSkillDesignerSharedVisionTargetForRuntime(draft && draft.target);
      const primaryDamageEffect =
        runtimeState && runtimeState.primaryDamageEffect && typeof runtimeState.primaryDamageEffect === 'object'
          ? runtimeState.primaryDamageEffect
          : null;
      switch (label) {
        case '穿透':
          if (primaryDamageEffect) {
            primaryDamageEffect['穿透修饰'] = parseSkillDesignerPercentPoints(params['penetrationRatio'], primaryDamageEffect['穿透修饰'] || 25);
            primaryDamageEffect['穿透对象'] = normalizeSkillUiText(params['penetrationTarget'], '');
          }
          break;
        case '吸血':
          if (primaryDamageEffect) {
            primaryDamageEffect['吸血比例'] = parseSkillDesignerPercentRatio(params['lifestealRatio'], 0.2);
            primaryDamageEffect['吸取资源'] = normalizeSkillUiText(params['resourceType'], '');
          }
          break;
        case '斩杀补伤':
          effects.push(buildSkillDesignerRuntimeObject({
            '机制': '斩杀补伤',
            '目标': offensiveTarget,
            '判定属性': 'vit_ratio',
            '判定阈值': parseSkillDesignerPercentRatio(params['executeLine'], 0.25),
            '成功参数': { 'final_damage_mult': parseSkillDesignerFactorInputValue(params['bonusRatio'], 1.5, { plusBase: true }) },
            '失败参数': {},
          }));
          break;
        case '流血DOT':
          effects.push(buildSkillDesignerRuntimeObject({
            '机制': '流血DOT',
            '目标': offensiveTarget,
            '状态名称': '流血',
            '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 3, 1),
            'dot_damage': estimateSkillDesignerDotDamage(primaryDamageEffect, params['dotRatio']),
          }));
          break;
        case '打断':
          effects.push(buildSkillDesignerRuntimeObject({
            '机制': '打断',
            '目标': offensiveTarget,
            '中断概率': 1.0,
            '打断时机': normalizeSkillUiText(params['interruptWindow'], ''),
            '追加僵直': parseSkillDesignerNumericInputValue(params['extraDelay'], 0.5, 4),
          }));
          break;
        case '反击':
          effects.push(buildSkillDesignerRuntimeObject({
            '机制': '受击反击',
            '目标': '自身',
            '持续回合': 2,
            '反击倍率': parseSkillDesignerFactorInputValue(params['counterRatio'], 0.8),
            '反击条件': normalizeSkillUiText(params['counterRule'], ''),
          }));
          break;
        case '沉默':
          effects.push(buildSkillDesignerRuntimeObject({
            '机制': '沉默',
            '目标': offensiveTarget,
            '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
            '限制范围': normalizeSkillUiText(params['muteScope'], ''),
          }));
          break;
        case '减速':
        case '迟缓':
          effects.push(buildSkillDesignerRuntimeObject({
            '机制': '减速',
            '目标': offensiveTarget,
            '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
            'agi_ratio': parseSkillDesignerReductionFactor(params['slowRatio'], 0.8),
          }));
          break;
        case '致盲':
          effects.push(buildSkillDesignerRuntimeObject({
            '机制': '致盲',
            '目标': offensiveTarget,
            '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
            '影响内容': normalizeSkillUiText(params['blindEffect'], ''),
          }));
          break;
        case '禁疗':
          if (!runtimeState || !runtimeState.effects.some(effect => toText(effect && effect['机制'], '') === '禁疗')) {
            effects.push(buildSkillDesignerRuntimeObject({
              '机制': '禁疗',
              '目标': offensiveTarget,
              '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
              'heal_block_ratio': parseSkillDesignerPercentRatio(params['banHealRatio'], 1.0),
            }));
          }
          break;
        case '小护盾':
          effects.push(buildSkillDesignerRuntimeObject({
            '机制': '护盾',
            '目标': supportTarget,
            '护盾值': estimateSkillDesignerShieldValue(params['shieldRatio'], params['shieldCap']),
            '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
            '护盾来源': normalizeSkillUiText(params['shieldCap'], ''),
          }));
          break;
        case '净化':
        case '解控':
          if (!runtimeState || !runtimeState.effects.some(effect => toText(effect && effect['机制'], '') === '解控')) {
            effects.push(buildSkillDesignerRuntimeObject({
              '机制': '解控',
              '目标': supportTarget,
              '清除层级': parseSkillDesignerIntegerInputValue(params['cleanseCount'], 2, 1),
              '清除优先级': normalizeSkillUiText(params['cleansePriority'], ''),
              '附带收益': normalizeSkillUiText(params['extraGain'], ''),
            }));
          }
          break;
        case '共享视野':
          if (!runtimeState || !runtimeState.effects.some(effect => toText(effect && effect['机制'], '') === '共享视野')) {
            effects.push(buildSkillDesignerRuntimeObject({
              '机制': '共享视野',
              '目标': sharedVisionTarget,
              '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 3, 1),
              'reaction_bonus': 0.1,
              'hit_bonus': 0.1,
              'lock_level': 1,
              '共享深度': normalizeSkillUiText(params['infoDepth'], ''),
              '共享范围': normalizeSkillUiText(params['shareRange'], ''),
            }));
          }
          break;
        case '魂力恢复':
          effects.push(buildSkillDesignerPackedRecoverAttributeEffect(
            supportTarget,
            'sp',
            parseSkillDesignerPercentRatio(params['recoverRatio'], 0.18) * parseSkillDesignerIntegerInputValue(params['repeatCount'], 1, 1),
            0,
            false,
          ));
          break;
        case '精神恢复':
          effects.push(buildSkillDesignerPackedRecoverAttributeEffect(
            supportTarget,
            'men',
            parseSkillDesignerPercentRatio(params['recoverRatio'], 0.18) * parseSkillDesignerIntegerInputValue(params['repeatCount'], 1, 1),
            0,
            false,
          ));
          break;
        case '标记弱点':
          effects.push(buildSkillDesignerRuntimeObject({
            '机制': '标记弱点',
            '目标': offensiveTarget,
            '持续回合': parseSkillDesignerIntegerInputValue(params['duration'], 2, 1),
            'final_damage_mult': 1.15,
            'dodge_penalty': 0.08,
            'lock_level': 1,
            '弱点类型': normalizeSkillUiText(params['weakPointType'], ''),
          }));
          break;
        default:
          break;
      }
      return effects.filter(Boolean).filter(effect => safeEntries(effect).length);
    }

    function normalizeSkillDesignerPassiveEffects(effectArray = [], draft = {}, previewMeta = {}) {
      const isPassive = /被动/.test(normalizeSkillUiText(draft && draft.type, '')) || toText(previewMeta && previewMeta.scope, '') === 'blood_passive';
      if (!isPassive) return Array.isArray(effectArray) ? effectArray : [];
      return (Array.isArray(effectArray) ? effectArray : []).map(effect => {
        if (!effect || typeof effect !== 'object') return effect;
        const cloned = cloneJsonValue(effect);
        const mechanism = toText(cloned && cloned['机制'], '').trim();
        if (['属性变化', '持续恢复', '消耗修正', '前摇修正', '掌控修正', '速度修正'].includes(mechanism)) {
          cloned['对象'] = cloned['对象'] || '自身';
          if (cloned['持续'] === undefined || Number(cloned['持续'] || 0) <= 0) cloned['持续'] = 999;
          if (mechanism === '持续恢复') cloned['触发'] = '每回合';
          else if (!toText(cloned['触发'], '').trim() || cloned['触发'] === '立即生效') cloned['触发'] = '常驻';
        }
        if (['护盾', '减伤', '格挡', '霸体', '免死', '共享视野', '受击反击', '反制'].includes(mechanism)) {
          cloned['目标'] = cloned['目标'] || '自身';
          if (cloned['持续回合'] === undefined || Number(cloned['持续回合'] || 0) <= 0) cloned['持续回合'] = 999;
        }
        return cloned;
      });
    }

    function buildSkillDesignerConstructEffect(draft = {}, runtimeEffects = []) {
      const usageEffects = cloneJsonValue(Array.isArray(runtimeEffects) ? runtimeEffects : []).map(effect => {
        if (!effect || typeof effect !== 'object') return effect;
        const cloned = cloneJsonValue(effect);
        if (normalizeSkillUiText(draft && draft.type, '') === '食物系') {
          if ('目标' in cloned) cloned['目标'] = '食用者';
          if ('对象' in cloned) cloned['对象'] = '食用者';
        }
        return cloned;
      });
      const isFood = normalizeSkillUiText(draft && draft.type, '') === '食物系';
      const triggerMode = isFood ? '食用' : '使用';
      const itemType = isFood ? '食物' : '魂技造物';
      return buildSkillDesignerRuntimeObject({
        '机制': '造物生成',
        '目标': '自身',
        '魂技名': normalizeSkillUiText(draft && draft.name, '未命名技能'),
        '产物类型': itemType,
        '数量': 1,
        '触发方式': triggerMode,
        '使用效果': usageEffects,
        '背包模板': {
          '数量': 1,
          '类型': itemType,
          '描述': buildSkillDesignerCompactSummary(draft) || '使用后触发对应魂技效果',
          '来源技能': normalizeSkillUiText(draft && draft.name, '未命名技能'),
          '使用效果': usageEffects,
          '触发方式': triggerMode,
        },
      });
    }

    function buildSkillDesignerRuntimeEffects(draft = {}, skillSource = {}, previewMeta = {}) {
      const runtimeState = {
        target: normalizeSkillDesignerTargetForRuntime(draft && draft.target, 'effect'),
        supportTarget: resolveSkillDesignerSupportTargetForRuntime(draft && draft.target),
        sharedVisionTarget: resolveSkillDesignerSharedVisionTargetForRuntime(draft && draft.target),
        effects: [],
        primaryDamageEffect: null,
      };
      const primaryEffects = buildSkillDesignerPrimaryEffects(draft, runtimeState);
      runtimeState.effects.push(...primaryEffects);
      runtimeState.primaryDamageEffect = runtimeState.effects.find(effect =>
        ['直接伤害', '多段伤害', '持续伤害', '延迟爆发'].includes(toText(effect && effect['机制'], '').trim())
      ) || null;
      normalizeSkillDesignerArray(draft && draft.secondaryMechanics).forEach(label => {
        const secondaryEffects = buildSkillDesignerSecondaryEffects(draft, runtimeState, label);
        runtimeState.effects.push(...secondaryEffects);
      });
      const normalizedEffects = normalizeSkillDesignerPassiveEffects(runtimeState.effects, draft, previewMeta);
      return draft && draft.deliveryForm === '造物承载'
        ? [buildSkillDesignerConstructEffect(draft, normalizedEffects)]
        : normalizedEffects;
    }

    function buildSkillDesignerUpdatedSkill(skillSource = {}, formState = {}, previewMeta = {}) {
      const safeSkill = skillSource && typeof skillSource === 'object' ? cloneJsonValue(skillSource) : {};
      const normalized = buildSkillDesignerFormStateFromDraft(formState, previewMeta);
      const designSummary = buildSkillDesignerCompactSummary(normalized);
      safeSkill['魂技名'] = normalized.name;
      safeSkill['name'] = normalized.name;
      safeSkill['技能类型'] = normalized.type;
      safeSkill['对象'] = normalized.target;
      safeSkill['消耗'] = normalized.cost;
      safeSkill['加成属性'] = normalized.bonus;
      safeSkill['主定位'] = normalized.mainRole;
      safeSkill['标签'] = [...normalized.tags];
      safeSkill['画面描述'] = normalized.visualDesc;
      safeSkill['效果描述'] = normalized.effectDesc;
      if ('描述' in safeSkill || (previewMeta && ['art', 'fusion_skill'].includes(previewMeta.scope))) safeSkill['描述'] = normalized.effectDesc;
      safeSkill['附带属性'] = [...normalized.attachedAttributes];
      safeSkill['特效量化参数'] = designSummary;
      safeSkill['设计稿'] = {
        '主机制': normalized.primaryMain,
        '细分机制': normalized.primarySub,
        '释放形式': normalized.deliveryForm,
        '附加机制': [...normalized.secondaryMechanics],
        '机制参数': cloneJsonValue(normalizeSkillDesignerMechanicParamMap(normalized.mechanicParams, normalized)),
        '附带属性': [...normalized.attachedAttributes],
        '属性来源': normalized.attributeSource,
        '魂技作用': normalized.attributeRole,
        '属性系数': normalizeSkillDesignerCoeffMap(normalized.coeff),
        '标签': [...normalized.tags],
        '技能类型': normalized.type,
        '对象': normalized.target,
        '消耗': normalized.cost,
        '消耗资源': normalized.costType,
        '消耗数值': normalized.costValue,
        '加成属性': normalized.bonus,
        '主定位': normalized.mainRole,
        '设计摘要': designSummary,
      };
      const systemBase = buildSkillDesignerSystemBaseEffect(skillSource, normalized, previewMeta);
      const runtimeEffects = buildSkillDesignerRuntimeEffects(normalized, skillSource, previewMeta);
      safeSkill['_效果数组'] = [
        systemBase,
        ...replaceSkillDesignerSummaryEffects(runtimeEffects, buildSkillDesignerRuntimeSummaryEffects(normalized)),
      ];
      return safeSkill;
    }

    function summarizeSkillEffectArray(effectArray, skill = null, cachedDraft = null) {
      const effectNames = (Array.isArray(effectArray) ? effectArray : [])
        .map(effect => {
          const name = toText(effect && effect['机制'], '').trim();
          if (!name || name === '系统基础' || isSkillSummaryEffect(effect)) return '';
          if (name === '生成造物' || name === '造物生成') return summarizeConstructEffectUi(effect);
          if (name === '状态挂载') return normalizeSkillUiText(effect && (effect['状态名称'] || effect['特殊机制标识']), '状态挂载');
          return name;
        })
        .filter(Boolean);
      if (effectNames.length) return effectNames.join(' / ');
      const draft = cachedDraft || (skill ? readSkillDesignerDraft(skill) : null);
      const designSummary = buildSkillDesignerMechanicSummary(draft || {});
      return designSummary || '未知';
    }

    function resolveExpiryUiText(item, fallback = '') {
      const expiryTick = toNumber(item && item['有效期至tick'], 0);
      if (expiryTick > 0) return formatTickToCalendarDateText(expiryTick);
      const explicitText = normalizeSkillUiText(item && item['有效期至'], '');
      if (explicitText) return explicitText;
      return fallback;
    }

    function buildSkillList(skillObj, options = {}) {
      const basePath = Array.isArray(options && options.basePath) ? options.basePath : [];
      const category = normalizeSkillUiText(options && options.category, '技能');
      const scope = normalizeSkillUiText(options && options.scope, 'skill');
      const skills = safeEntries(skillObj).map(([rawName, skill]) => {
        const effectArray = Array.isArray(skill && skill['_效果数组']) ? skill['_效果数组'] : [];
        const tacticalTags = Array.isArray(deepGet(skill, '战斗语义.战术标签', [])) ? deepGet(skill, '战斗语义.战术标签', []) : [];
        const systemBase = effectArray.find(effect => toText(effect && effect['机制'], '').trim() === '系统基础') || {};
        const draft = readSkillDesignerDraft(skill, rawName);
        const effectCount = effectArray.filter(effect => {
          const name = toText(effect && effect['机制'], '').trim();
          return name && name !== '系统基础' && !isSkillSummaryEffect(effect);
        }).length;
        const visualDesc = normalizeSkillUiText(skill && skill['画面描述'], '未知');
        const effectDesc = normalizeSkillUiText(skill && (skill['效果描述'] || skill['描述']), '未知');
        const effectSummaryCore = summarizeSkillEffectArray(effectArray, skill, draft);
        const constructMeta = extractConstructEffectMeta(effectArray);
        const mechanicSummary = buildSkillDesignerMechanicSummary(draft);
        const attributeSummary = buildSkillDesignerAttributeSummary(draft);
        const effectSummary = effectSummaryCore === '未知'
          ? '未知'
          : (effectCount > 0 ? `${effectSummaryCore} (${effectCount}项)` : effectSummaryCore);
        const type = normalizeSkillUiText(systemBase['技能类型'] || (skill && skill['技能类型']), '未知');
        const target = normalizeSkillUiText(systemBase['对象'] || (skill && skill['对象']), '未知');
        const bonus = normalizeSkillUiText(skill && skill['加成属性'], '未知');
        const cost = normalizeSkillUiText(systemBase['消耗'] || (skill && skill['消耗']), '未知');
        const mainRole = normalizeSkillUiText(skill && skill['主定位'], '未知');
        const compatParamDesc = normalizeSkillUiText(skill && skill['特效量化参数'], '');
        const descSegments = [];
        const pushDesc = text => {
          const safeText = toText(text, '').trim();
          if (!safeText || descSegments.includes(safeText)) return;
          descSegments.push(safeText);
        };
        pushDesc(constructMeta ? `造物：${constructMeta.summary}` : '');
        pushDesc(mechanicSummary ? `机制：${mechanicSummary}` : '');
        pushDesc(attributeSummary ? `属性：${attributeSummary}` : '');
        pushDesc(visualDesc !== '未知' ? `画面：${visualDesc}` : '');
        pushDesc(effectDesc !== '未知' ? `效果：${effectDesc}` : '');
        if (effectSummary !== '未知' && effectSummary !== mechanicSummary) pushDesc(`效果数组：${effectSummary}`);
        pushDesc(compatParamDesc);
        let desc = descSegments.join('<br/>');
        const clash = deepGet(skill, '仲裁逻辑.瞬间交锋模块');
        const state = deepGet(skill, '仲裁逻辑.状态挂载模块');
        if (clash && clash['基础威力倍率'] > 0) desc += `${desc ? '<br/>' : ''}<span style="color:var(--cyan);">[威力倍率: ${clash['基础威力倍率']}% | 伤害类型: ${clash['伤害类型'] || '无'} | 护盾: ${clash['护盾绝对值'] || 0}]</span>`;
        if (state && state['状态名称'] !== '无') desc += `${desc ? '<br/>' : ''}<span style="color:var(--gold);">[附加状态: ${state['状态名称']} | 机制: ${state['特殊机制标识'] || '无'} | 持续: ${state['持续回合']}回]</span>`;
        const tags = Array.from(new Set(
          (Array.isArray(skill && skill['标签']) ? skill['标签'] : [])
            .map(tag => normalizeSkillUiText(tag, ''))
            .concat(tacticalTags.map(tag => normalizeSkillUiText(tag, '')))
            .concat(
              effectArray
                .map(effect => normalizeSkillUiText(effect && effect['机制'], ''))
                .filter(name => name && name !== '系统基础' && !SKILL_SUMMARY_EFFECT_MECHANISM_SET.has(name))
            )
            .concat(type && type !== '未知' ? [type] : [])
            .concat(mainRole && mainRole !== '未知' ? [mainRole] : [])
            .concat(draft.primaryMain ? [draft.primaryMain] : [])
            .concat(draft.primarySub ? [draft.primarySub] : [])
            .concat(Array.isArray(draft.secondaryMechanics) ? draft.secondaryMechanics : [])
            .concat(Array.isArray(draft.attachedAttributes) ? draft.attachedAttributes : [])
        )).filter(Boolean).slice(0, 8);

        const cleanSkillName = draft.name;
        const skillPath = basePath.length ? [...basePath, rawName] : [];
        const preview = buildSkillDesignerPreviewKey({
          path: skillPath,
          label: cleanSkillName,
          category,
          scope,
        });

        return {
          name: cleanSkillName,
          type,
          target,
          bonus,
          cost,
          desc: desc || '未知',
          visualDesc,
          effectDesc,
          effectSummary,
          status: normalizeSkillUiText(skill && skill['状态'], '已觉醒'),
          mainRole,
          tags,
          preview,
          path: skillPath,
          category,
          scope,
          designDraft: draft
        };
      });

      if (skills.length) return skills;

      return [{
        name: '魂技未显现',
        type: '未觉醒',
        target: '未知',
        bonus: '未知',
        cost: '未知',
        desc: '魂技信息尚未明晰。',
        visualDesc: '未知',
        effectDesc: '未知',
        effectSummary: '未知',
        status: '未觉醒',
        mainRole: '未知',
        tags: [],
        preview: '',
        path: [],
        category,
        scope,
        designDraft: null
      }];
    }

    function formatPermanentBonusSummary(bonusMap) {
      const labels = { str: '力量', def: '防御', agi: '敏捷', vit_max: '体力上限', men_max: '精神力上限', sp_max: '魂力上限' };
      const segments = [];
      safeEntries(bonusMap).forEach(([key, value]) => {
        const amount = Math.floor(toNumber(value, 0));
        if (amount > 0 && labels[key]) segments.push(`${labels[key]}+${amount}`);
      });
      return segments.join('，') || '无';
    }

    function buildPermanentBonusList(bonusObj) {
      return safeEntries(bonusObj).map(([rawName, bonus]) => {
        const safeBonus = bonus && typeof bonus === 'object' ? bonus : {};
        const name = normalizeSkillUiText(safeBonus['名称'] || rawName, '永久成长');
        const bonusSummary = formatPermanentBonusSummary(safeBonus['属性加成'] || {});
        const effectDesc = normalizeSkillUiText(safeBonus['效果描述'] || safeBonus['描述'], bonusSummary !== '无' ? `固定加成：${bonusSummary}` : '未知');
        return {
          name,
          type: '永久成长',
          target: '自身',
          bonus: bonusSummary === '无' ? '固定成长' : bonusSummary,
          cost: '无',
          desc: [
            effectDesc !== '未知' ? `效果：${effectDesc}` : '',
            bonusSummary !== '无' ? `固定加成：${bonusSummary}` : ''
          ].filter(Boolean).join('<br/>') || effectDesc || '永久成长',
          visualDesc: '气血封印解开后，成长已永久固化。',
          effectDesc,
          effectSummary: bonusSummary === '无' ? '未知' : `固定加成：${bonusSummary}`,
          status: normalizeSkillUiText(safeBonus['状态'], '已固化'),
          mainRole: '永久成长',
          tags: ['永久成长', '固定增益']
        };
      });
    }

    function buildSpiritConfig(slotName, spiritData, previewKey, badgeText, badgeClass, spiritBasePath = []) {
      const soulEntries = safeEntries(spiritData && spiritData.soul_spirits);
      const summaryRings = [];
      const souls = soulEntries.map(([soulName, soulData]) => {
        const ringEntries = safeEntries(soulData && soulData.rings)
          .sort((a, b) => toNumber(a[0], 0) - toNumber(b[0], 0))
          .map(([ringIndex, ring]) => {
            const skills = buildSkillList(ring && ring['魂技'], {
              basePath: [...spiritBasePath, 'soul_spirits', soulName, 'rings', ringIndex, '魂技'],
              category: '魂环魂技',
              scope: 'spirit_skill',
            });
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
          desc: normalizeSkillUiText(soulData && soulData['表象名称'], '未知'),
          state: normalizeSkillUiText(soulData && soulData['状态'], '未知'),
          age: formatAge(soulData && soulData['年限']),
          comp: `${toNumber(soulData && soulData['契合度'], 100)}%`,
          rings: ringEntries
        };
      });

      if (!souls.length) {
        souls.push({
          name: '魂灵槽位',
          desc: '尚未接入魂灵。',
          state: '未激活',
          age: '--',
          comp: '--',
          rings: []
        });
      }

      const soulCount = soulEntries.length;
      const displayName = normalizeSkillUiText(spiritData && spiritData['表象名称'], slotName);
      const spiritType = normalizeSkillUiText(spiritData && spiritData['type'], '未知系');
      const element = normalizeSkillUiText(spiritData && spiritData['element'], '未知');

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

    function shouldRenderBloodline(activeChar, activeName = '') {
      const displayName = String(activeName || deepGet(activeChar, 'stat.name', '') || '').trim();
      return displayName === '唐舞麟';
    }

    function buildBloodlineConfig(activeChar, activeName = '', bloodlineBasePath = []) {
      if (!shouldRenderBloodline(activeChar, activeName)) {
        return {
          kind: 'bloodline',
          valid: false,
          preview: '血脉封印详细页',
          badge: '血脉封印',
          badgeClass: 'gold',
          name: '',
          desc: '',
          rings: [],
          bloodSkills: [],
          bloodPassives: [],
          bloodPermanentBonuses: [],
          sealLv: 0,
          core: '未凝聚',
          lifeFire: false,
          bloodline: '无'
        };
      }
      const bloodline = normalizeSkillUiText(deepGet(activeChar, 'bloodline_power.bloodline', '无'), '无');
      const sealLv = toNumber(deepGet(activeChar, 'bloodline_power.seal_lv', 0), 0);
      const core = normalizeSkillUiText(deepGet(activeChar, 'bloodline_power.core', '未凝聚'), '未凝聚');
      const rawSkills = deepGet(activeChar, 'bloodline_power.skills', {});
      const rawRings = deepGet(activeChar, 'bloodline_power.blood_rings', {});
      const rawPassives = deepGet(activeChar, 'bloodline_power.passives', {});
      const rawPermanentBonuses = deepGet(activeChar, 'bloodline_power.permanent_bonuses', {});
      const hasBloodlineData = toText(bloodline, '无') !== '无'
        || sealLv > 0
        || safeEntries(rawRings).length > 0
        || safeEntries(rawSkills).length > 0
        || safeEntries(rawPassives).length > 0
        || safeEntries(rawPermanentBonuses).length > 0;
      const ringEntries = safeEntries(deepGet(activeChar, 'bloodline_power.blood_rings', {}))
        .sort((a, b) => toNumber(a[0], 0) - toNumber(b[0], 0))
        .map(([index, ring]) => ({
          glyph: ringGlyph(ring && ring['颜色'], index, ring && ring['年限'], { forceGold: true }),
          ringClass: mapRingClass(ring && ring['颜色'], ring && ring['年限'], { forceGold: true }),
          title: `血脉环位 · ${index}`,
          desc: `${toText(ring && ring['颜色'], '未形成')} / ${safeEntries(ring && ring['魂技']).length || 0}项能力`,
          skills: buildSkillList(ring && ring['魂技'], {
            basePath: [...bloodlineBasePath, 'blood_rings', index, '魂技'],
            category: '血脉魂环',
            scope: 'blood_ring_skill',
          })
        }));
      const normalizedRingEntries = ringEntries.slice(0, 10);

      return {
        kind: 'bloodline',
        valid: hasBloodlineData,
        preview: '血脉封印详细页',
        badge: '血脉封印',
        badgeClass: 'gold',
        name: `${bloodline === '无' ? '未觉醒血脉' : bloodline}`,
        desc: `解封层数：${sealLv} / 气血魂核：${core}`,
        rings: normalizedRingEntries,
        bloodSkills: buildSkillList(rawSkills, {
          basePath: [...bloodlineBasePath, 'skills'],
          category: '血脉散技',
          scope: 'blood_skill',
        }),
        bloodPassives: buildSkillList(rawPassives, {
          basePath: [...bloodlineBasePath, 'passives'],
          category: '血脉特性',
          scope: 'blood_passive',
        }),
        bloodPermanentBonuses: buildPermanentBonusList(rawPermanentBonuses),
        sealLv,
        core,
        lifeFire: !!deepGet(activeChar, 'bloodline_power.life_fire', false),
        bloodline: bloodline === '无' ? '未觉醒血脉' : bloodline
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
      const currentLoc = toText(deepGet(activeChar, 'status.loc', '未知'), '未知').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '');
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
      const youthRankingEntries = safeEntries(deepGet(sd, 'world.rankings.youth_talent._top30', deepGet(sd, 'world.rankings.youth_talent.top30', {}))).sort((a, b) => toNumber(a[0], 0) - toNumber(b[0], 0));
      const continentRankingEntries = safeEntries(deepGet(sd, 'world.rankings.continent_wind._top100', deepGet(sd, 'world.rankings.continent_wind.top100', {}))).sort((a, b) => toNumber(a[0], 0) - toNumber(b[0], 0));
      const flagEntries = safeEntries(deepGet(sd, 'world.flags', {})).filter(([, value]) => !!value);
      const orgEntries = safeEntries(sd && sd.org).sort((a, b) => {
        const aFav = factions.some(([name]) => name === a[0]) ? 1 : 0;
        const bFav = factions.some(([name]) => name === b[0]) ? 1 : 0;
        if (aFav !== bFav) return bFav - aFav;
        return toNumber(deepGet(b[1], 'inf', 0), 0) - toNumber(deepGet(a[1], 'inf', 0), 0);
      });

      const spiritEntries = safeEntries(activeChar && activeChar.spirit);
      const primarySpirit = spiritEntries[0]
        ? buildSpiritConfig(spiritEntries[0][0], spiritEntries[0][1], '第一武魂详细页', '第一武魂', 'cyan', ['char', activeName, 'spirit', spiritEntries[0][0]])
        : buildSpiritConfig('第一武魂', {}, '第一武魂详细页', '第一武魂', 'cyan');
      const secondarySpirit = spiritEntries[1]
        ? buildSpiritConfig(spiritEntries[1][0], spiritEntries[1][1], '第二武魂详细页', '第二武魂', 'gold', ['char', activeName, 'spirit', spiritEntries[1][0]])
        : null;
      const bloodline = buildBloodlineConfig(activeChar || {}, activeName, ['char', activeName, 'bloodline_power']);

      // --- 收集额外能力与功法，放到外层给生命图谱使用 ---
      const safeRecords = (obj) => {
        return Object.entries(obj || {}).filter(([k, v]) => k !== '无' && typeof v === 'object' && v !== null).map(([k, v]) => ({
          recordKey: k,
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
          desc: toText(art.描述, '暂无描述'),
          preview: buildSkillDesignerPreviewKey({
            path: ['char', activeName, 'arts', art.recordKey || art.name],
            label: toText(art.name, art.recordKey || '功法绝学'),
            category: '功法绝学',
            scope: 'art',
          })
        });
      });
      if (bloodline.valid) {
        safeRecords(deepGet(activeChar, 'bloodline_power.skills', {})).forEach(skill => {
          extraSkills.push({
            category: '血脉散技',
            name: skill.name,
            level: toText(skill.状态, '已掌握'),
            desc: toText(skill.描述 || skill.效果描述 || skill.effectDesc, '无说明'),
            preview: buildSkillDesignerPreviewKey({
              path: ['char', activeName, 'bloodline_power', 'skills', skill.recordKey || skill.name],
              label: toText(skill.name, skill.recordKey || '血脉散技'),
              category: '血脉散技',
              scope: 'blood_skill',
            })
          });
        });
        safeRecords(deepGet(activeChar, 'bloodline_power.passives', {})).forEach(skill => {
          extraSkills.push({
            category: '血脉特性',
            name: skill.name,
            level: toText(skill.状态, '已固化'),
            desc: toText(skill.描述 || skill.效果描述 || skill.effectDesc, '无说明'),
            preview: buildSkillDesignerPreviewKey({
              path: ['char', activeName, 'bloodline_power', 'passives', skill.recordKey || skill.name],
              label: toText(skill.name, skill.recordKey || '血脉特性'),
              category: '血脉特性',
              scope: 'blood_passive',
            })
          });
        });
        safeEntries(deepGet(activeChar, 'bloodline_power.permanent_bonuses', {})).forEach(([name, bonus]) => {
          extraSkills.push({
            category: '血脉永久成长',
            name: toText(bonus && bonus['名称'], name || '永久成长'),
            level: toText(bonus && bonus['状态'], '已固化'),
            desc: toText(bonus && bonus['效果描述'], toText(bonus && bonus['描述'], '无说明'))
          });
        });
      }
      safeRecords(deepGet(activeChar, 'martial_fusion_skills', {})).forEach(fusion => {
        extraSkills.push({
          category: '武魂融合技',
          name: fusion.name,
          level: `搭档: ${toText(fusion.partner, '未知')}`,
          desc: toText(deepGet(fusion, 'skill_data.描述', '无'), '爆发技'),
          preview: buildSkillDesignerPreviewKey({
            path: ['char', activeName, 'martial_fusion_skills', fusion.recordKey || fusion.name, 'skill_data'],
            label: toText(fusion.name, fusion.recordKey || '武魂融合技'),
            category: '武魂融合技',
            scope: 'fusion_skill',
          })
        });
      });
      safeRecords(deepGet(activeChar, 'special_abilities', {})).forEach(abi => {
        extraSkills.push({
          category: '特长能力',
          name: abi.name,
          level: toText(abi.技能类型 || abi.主定位, '被动'),
          desc: toText(abi.效果描述 || abi.战斗摘要?.一句话定位, '暂无描述'),
          preview: buildSkillDesignerPreviewKey({
            path: ['char', activeName, 'special_abilities', abi.recordKey || abi.name],
            label: toText(abi.name, abi.recordKey || '特长能力'),
            category: '特长能力',
            scope: 'special_ability',
          })
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
      const warningText = toNumber(deepGet(sd, 'world.deviation', 0), 0) >= 40
        ? `偏差 ${toNumber(deepGet(sd, 'world.deviation', 0), 0)} / 高危`
        : (deepGet(sd, 'world.flags.beast_tide', false)
          ? '兽潮警报 / 已触发'
          : (flagEntries.length ? `世界旗标 ${flagEntries.length} 项` : '无'));
      const auctionStatus = toText(deepGet(sd, 'world.auction.status', '休市'), '休市');
      const auctionLocation = toText(deepGet(sd, 'world.auction.location', '无'), '无');

      const chars = sd && sd.char ? sd.char : {};
      const charEntries = safeEntries(chars);
      return {
        rootData: sd,
        activeName,
        appearanceMeta: formatAppearanceMeta(deepGet(activeChar, 'appearance', {})),
        appearanceText: formatAppearanceText(deepGet(activeChar, 'appearance', {})),
        personalityText: toText(deepGet(activeChar, 'personality', '未设定'), '未设定'),
        activeChar: activeChar || {},
        currentLoc,
        normalizedLoc: locationInfo.name,
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
        charEntries,
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
        mapVisibleDynamicEntries,
        mapActivePatchEntries,
        mapAvailableChildMaps,
        mapTravelCandidates,
        publicIntel: !!deepGet(activeChar, 'social._public_intel', deepGet(activeChar, 'social.public_intel', false)),
        extraSkills
      };
    }

    function applyActiveCharacterSelection(nextName, options = {}) {
      cancelActiveInlineEdit();
      const targetName = toText(nextName, '').trim();
      const rootData = deepGet(liveSnapshot, 'rootData', null);
      const chars = deepGet(rootData, 'char', {});
      if (!targetName || !rootData || !chars || !chars[targetName]) return false;

      window.__MVU_MANUAL_CHAR_SET = true; // 标记这是用户手动切换的角色，不再自动被后续的玩家顶掉
      setPreferredActiveCharacterName(targetName);
      liveSnapshot = buildSnapshot(rootData);
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
      const worldTimeText = toText(deepGet(snapshot, 'rootData.world.time._calendar', deepGet(snapshot, 'rootData.world.time.calendar', '斗罗历未同步')), '斗罗历未同步');
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
      if (statusChips[2]) {
        statusChips[2].style.display = snapshot.bloodline && snapshot.bloodline.valid ? '' : 'none';
        if (snapshot.bloodline && snapshot.bloodline.valid) {
          statusChips[2].querySelector('span').textContent = `${snapshot.bloodline.bloodline} / ${snapshot.bloodline.sealLv}层`;
        }
      }
      if (statusChips[3]) statusChips[3].querySelector('span').textContent = `斗铠${toText(deepGet(snapshot, 'activeChar.equip.armor.equip_status', '未装备'), '未装备')} / 机甲${toText(deepGet(snapshot, 'activeChar.equip.mech.lv', '无'), '无')}`;
      if (statusChips[4]) statusChips[4].querySelector('span').textContent = snapshot.worldAlert;
    }

    function buildArchiveCoreCard(snapshot) {
      const stat = deepGet(snapshot, 'activeChar.stat', {});
      const social = deepGet(snapshot, 'activeChar.social', {});
      const status = deepGet(snapshot, 'activeChar.status', {});
      const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '当前角色');
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
            <div class="stat-value cyan">${htmlEscape(formatNumber(stat.sp))} / ${htmlEscape(formatNumber(stat.sp_max))}</div>
            <div class="line"><div class="fill" style="color: var(--cyan); width: ${ratioPercent(stat.sp, stat.sp_max)}%;"></div></div>
          </div>
          <div class="stat-item compact no-bar">
            <div class="stat-label">状态概览</div>
            <div class="stat-value">${htmlEscape(`${toText(status.action, '日常')} / ${toText(status.wound, '无伤')}`)}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">气血 (VIT)</div>
            <div class="stat-value red">${htmlEscape(formatNumber(stat.vit))} / ${htmlEscape(formatNumber(stat.vit_max))}</div>
            <div class="line"><div class="fill" style="color: var(--red); width: ${ratioPercent(stat.vit, stat.vit_max)}%;"></div></div>
          </div>
          <div class="stat-item">
            <div class="stat-label">精神力 (MEN) · ${htmlEscape(toText(stat._men_realm, toText(stat.men_realm, '灵元境')))}</div>
            <div class="stat-value">${htmlEscape(formatNumber(stat.men))} / ${htmlEscape(formatNumber(stat.men_max))}</div>
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
      const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '当前角色');
      return `
        <div class="module-name">储物仓库</div>
        <div class="module-grid">
          <div class="mini-box"><b>物品种类</b><span>${htmlEscape(String(snapshot.inventoryEntries.length || 0))}</span></div>
          <div class="mini-box"><b>流动资金</b><span>${htmlEscape(formatNumber(wealth.fed_coin))} / 星罗 ${htmlEscape(formatNumber(wealth.star_coin))}</span></div>
        </div>
        <div class="module-foot">
          <span class="foot-hint">记录物资总计 ${htmlEscape(String(snapshot.inventoryEntries.length || 0))} 件</span>
          <span class="enter-chip gold-chip">积分/战功：${htmlEscape(formatNumber(wealth.tang_pt))} / ${htmlEscape(formatNumber(wealth.shrek_pt))} / ${htmlEscape(formatNumber(wealth.blood_pt))}</span>
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
      // maps 被彻底移除，底层不再提供任何写死的 map_meta。直接返回空壳。
      return {};
    }

    function getMapDisplayName(snapshot, mapId = null) {
      const safeMapId = toText(mapId || (snapshot && snapshot.mapCurrentMapId), 'map_douluo_world');
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
        const x = mapCoordToPercent(item && item.x, bounds.minX, bounds.width, 50);
        const y = mapCoordToPercent(item && item.y, bounds.minY, bounds.height, 50);
        const edgeClasses = [
          x <= 16 ? 'edge-left' : '',
          x >= 84 ? 'edge-right' : '',
          y <= 18 ? 'edge-top' : '',
          y >= 82 ? 'edge-bottom' : ''
        ].filter(Boolean).join(' ');
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
          x,
          y,
          edgeClasses
        });
      };

      snapshot.mapVisibleNodeEntries.forEach(([name, item]) => {
        pushItem(name, item, { source: toText(item && item.source, 'static'), type: toText(item && item.type, '地图节点'), state: toText(item && item.level ? `Lv.${item.level}` : '可见', '可见'), canEnter: !!deepGet(item, 'can_enter', false), childMapId: item && item.child_map_id, major: !!deepGet(item, 'can_enter', false) || toNumber(item && item.level, 0) <= 2 });
      });
      snapshot.mapVisibleDynamicEntries.forEach(([name, item]) => {
        pushItem(name, item, { source: 'dynamic', type: '动态地点', state: '动态', canEnter: false, major: false, desc: toText(item && item.desc, '无') });
      });

      return items.slice(0, 12);
    }

    function resolveDisplayMapNode(snapshot, nodeName) {
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
      const nodesHtml = (items.length ? items.map(item => `<div class="map-node clickable ${item.current ? 'current' : ''} ${item.canEnter ? 'origin' : ''} ${htmlEscape(item.edgeClasses || '')}" data-preview="地图节点：${htmlEscape(item.name)}" style="left:${item.x}%; top:${item.y}%;"><div class="map-dot ${item.major ? 'major' : ''}"></div><div class="map-label">${htmlEscape(item.name)}</div></div>`) : fallbackNodeSlots.map((slot, index) => {
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
      const worldTime = toText(deepGet(snapshot, 'rootData.world.time._calendar', deepGet(snapshot, 'rootData.world.time.calendar', '斗罗历未同步')), '斗罗历未同步');
      const deviation = toNumber(deepGet(snapshot, 'rootData.world.deviation', 0), 0);
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
      const sys = deepGet(snapshot, 'rootData.sys', {});
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
      const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '当前角色');
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
            { label: '地点', value: snapshot.normalizedLoc !== snapshot.currentLoc ? `${snapshot.normalizedLoc} · ${snapshot.currentLoc}` : snapshot.currentLoc },
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
            <span class="map-event-chip warn">动态点 ${htmlEscape(String(snapshot.mapVisibleDynamicEntries.length))}</span>
            <span class="map-event-chip warn">补丁 ${htmlEscape(String(snapshot.mapActivePatchEntries.length))}</span>
          </div>
          <div class="simple-list">
            <div class="simple-row"><b>扩展节点</b><span>${htmlEscape(snapshot.mapVisibleDynamicEntries[0] ? snapshot.mapVisibleDynamicEntries[0][0] : '暂无')}</span></div>
            <div class="simple-row"><b>最近变化</b><span>${htmlEscape(snapshot.latestTimeline ? snapshot.latestTimeline[0] : '无')}</span></div>
          </div>
        `; });
      }

      document.querySelectorAll('.archive-social-card .social-chip[data-preview="社会档案详细页"] span').forEach(el => {
        el.innerHTML = `${htmlEscape(toText(social._fame_level, toText(social.fame_level, '籍籍无名')))} / ${htmlEscape(formatNumber(social.reputation))}`;
      });
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
        { label: '拍卖行', value: `${toText(deepGet(snapshot, 'rootData.world.auction.status', '休市'), '休市')} / ${toText(deepGet(snapshot, 'rootData.world.auction.location', '无'), '无')}` },
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
        const questRecords = (snapshot.recordEntries || []).filter(([, item]) => item && typeof item === 'object' && (Object.prototype.hasOwnProperty.call(item, '状态') || Object.prototype.hasOwnProperty.call(item, '目标进度') || Object.prototype.hasOwnProperty.call(item, '奖励币') || Object.prototype.hasOwnProperty.call(item, '奖励声望')));
        const activeQuestEntry = questRecords.find(([, item]) => !['已完成', '已放弃', '失败', '已失败'].includes(toText(item && item['状态'], '进行中'))) || questRecords[0] || null;
        const activeQuestName = activeQuestEntry ? activeQuestEntry[0] : '';
        const questBoardEntries = safeEntries(deepGet(snapshot, 'rootData.world.quest_board', {})).filter(([, item]) => item && typeof item === 'object');
        const openBoardCount = questBoardEntries.filter(([, item]) => toText(item && item['状态'], '待接取') === '待接取').length;
        el.innerHTML = `
          <div class="simple-head"><div class="simple-title">任务界面</div></div>
          <div class="simple-list">
            <div class="simple-row"><b>我的任务</b><span>${htmlEscape(questRecords.length ? `${questRecords.length} 条 / 当前 ${activeQuestName || '已归档'}` : '暂无任务')}</span></div>
            <div class="simple-row"><b>委托板</b><span>${htmlEscape(questBoardEntries.length ? `${questBoardEntries.length} 条 / 待接取 ${openBoardCount}` : '暂无委托')}</span></div>
            <div class="simple-row"><b>维护方式</b><span>${htmlEscape('AI 维护任务内容，脚本负责进度与奖励结算')}</span></div>
          </div>
        `;
      });
    }

    function buildLiveArchiveModal(previewKey) {
      if (!liveSnapshot) return null;
      const snapshot = liveSnapshot;
      const tradeLaunchOptions = buildMapTradeModalOptions(snapshot, mapDispatchContext);
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

      if (String(previewKey || '').startsWith(SKILL_DESIGNER_PREVIEW_PREFIX)) {
        const previewMeta = parseSkillDesignerPreviewKey(previewKey) || { path: [], label: '技能', category: '技能', scope: 'skill' };
        const skillSource = previewMeta.path.length ? (deepGet(snapshot.rootData, previewMeta.path, {}) || {}) : {};
        const cachedDesignerDraft = readCachedSkillDesignerDraft(previewKey);
        const designerDraft = buildSkillDesignerFormStateFromDraft(
          cachedDesignerDraft || readSkillDesignerDraft(skillSource, previewMeta.label),
          previewMeta
        );
        const pathTail = formatSkillDesignerWritebackLabel(previewMeta);
        const recommendedAttrs = new Set(normalizeSkillDesignerArray(SKILL_DESIGNER_ATTRIBUTE_HINTS_BY_TYPE[designerDraft.type] || []));
        return {
          title: `技能设计台 / ${designerDraft.name}`,
          summary: '',
          onMount: mountEl => {
            const form = mountEl.querySelector('[data-skill-designer-form]');
            const refreshBtn = mountEl.querySelector('[data-skill-designer-refresh]');
            const primaryMainInput = mountEl.querySelector('[data-skill-designer-field=\"primaryMain\"]');
            const primarySubInput = mountEl.querySelector('[data-skill-designer-field=\"primarySub\"]');
            const typeInput = mountEl.querySelector('[data-skill-designer-field=\"type\"]');
            const deliveryFormInput = mountEl.querySelector('[data-skill-designer-field=\"deliveryForm\"]');
            const secondaryGrid = mountEl.querySelector('[data-skill-designer-secondary-grid]');
            const attributeGrid = mountEl.querySelector('[data-skill-designer-attribute-grid]');
            const mechanicParamGrid = mountEl.querySelector('[data-skill-designer-mechanic-param-grid]');
            let destroyed = false;
            let busy = false;

            const setBusy = nextBusy => {
              busy = !!nextBusy;
              mountEl.querySelectorAll('[data-skill-designer-disableable]').forEach(node => {
                node.disabled = busy;
              });
            };

            const readCheckedValues = name => Array.from(mountEl.querySelectorAll(`input[name=\"${name}\"]:checked`)).map(node => toText(node.value, '').trim()).filter(Boolean);
            const syncDraftCache = () => {
              const nextDraft = buildSkillDesignerFormStateFromDraft(readSkillDesignerFormState(mountEl, previewMeta), previewMeta);
              writeCachedSkillDesignerDraft(previewKey, nextDraft);
              return nextDraft;
            };
            const syncChipState = () => {
              mountEl.querySelectorAll('.skill-designer-check-chip').forEach(label => {
                const input = label.querySelector('input');
                label.classList.toggle('active', !!(input && input.checked));
              });
            };

            const syncAttributeHints = () => {
              const hintSet = new Set(normalizeSkillDesignerArray(SKILL_DESIGNER_ATTRIBUTE_HINTS_BY_TYPE[typeInput ? typeInput.value : ''] || []));
              mountEl.querySelectorAll('[data-skill-designer-attribute-grid] .skill-designer-check-chip').forEach(label => {
                const input = label.querySelector('input');
                label.classList.toggle('recommended', !!(input && hintSet.has(input.value)));
              });
            };

            const refreshPreview = (draftOverride = null) => {
              const formState = draftOverride || syncDraftCache();
              const previewMap = {
                mechanic: buildSkillDesignerMechanicSummary(formState) || '未设置',
                mechanicParams: buildSkillDesignerMechanicParamSummary(formState) || '未设置',
                execution: buildSkillDesignerExecutionSummary(formState) || '未设置',
                attribute: buildSkillDesignerAttributeSummary(formState) || '未设置',
                summary: buildSkillDesignerCompactSummary(formState) || '未设置',
                tags: normalizeSkillDesignerArray(formState.tags).join(' / ') || '无',
              };
              mountEl.querySelectorAll('[data-skill-designer-preview]').forEach(node => {
                const key = node.getAttribute('data-skill-designer-preview') || '';
                node.textContent = previewMap[key] || '未设置';
              });
            };

            const rebuildMechanicParamEditor = () => {
              if (!mechanicParamGrid) return;
              const currentDraft = syncDraftCache();
              mechanicParamGrid.innerHTML = buildSkillDesignerMechanicParamEditor(currentDraft);
            };

            const rebuildPrimarySubOptions = () => {
              if (!primarySubInput || !primaryMainInput) return;
              const optionList = getSkillDesignerChildMechanicOptions(primaryMainInput.value);
              const currentValue = toText(primarySubInput.value, '').trim();
              const targetInput = mountEl.querySelector('[data-skill-designer-field=\"target\"]');
              const nextValue = optionList.includes(currentValue)
                ? currentValue
                : getSkillDesignerDefaultPrimarySub(
                  primaryMainInput.value,
                  targetInput ? targetInput.value : '',
                  typeInput ? typeInput.value : '',
                );
              primarySubInput.innerHTML = buildSkillDesignerSelectOptions(
                optionList,
                nextValue,
                '未设置'
              );
            };

            const rebuildDeliveryOptions = () => {
              if (!deliveryFormInput || !typeInput) return;
              const currentValue = toText(deliveryFormInput.value, '').trim();
              deliveryFormInput.innerHTML = buildSkillDesignerSelectOptions(
                getSkillDesignerDeliveryOptions(typeInput.value),
                currentValue,
                '未设置'
              );
            };

            const rebuildSecondaryOptions = () => {
              if (!secondaryGrid || !primaryMainInput) return;
              const selectedValues = readCheckedValues('skill-secondary');
              secondaryGrid.innerHTML = buildSkillDesignerCheckChipList(
                getSkillDesignerSecondaryOptionList(primaryMainInput.value, selectedValues),
                selectedValues,
                'skill-secondary'
              ) || '<span class=\"tag-chip\">暂无附加机制</span>';
              syncChipState();
            };

            const handleInteractiveRefresh = () => {
              rebuildPrimarySubOptions();
              rebuildDeliveryOptions();
              rebuildSecondaryOptions();
              rebuildMechanicParamEditor();
              syncChipState();
              syncAttributeHints();
              refreshPreview();
            };

            const runDesignerTask = async (task, successMessage = '') => {
              if (busy) return;
              setBusy(true);
              try {
                await task();
                if (successMessage) showUiToast(successMessage, 'info');
              } catch (error) {
                showUiToast(error && error.message ? error.message : '技能设计写回失败。', 'error', 4200);
              } finally {
                if (!destroyed) setBusy(false);
              }
            };

            const handleRefresh = async () => {
              await runDesignerTask(async () => {
                clearCachedSkillDesignerDraft(previewKey);
                await refreshLiveSnapshot({ force: true });
                if (!destroyed && currentModalPreviewKey) renderModalContent(currentModalPreviewKey, getModalRefs());
              }, '已经重新读取当前技能。');
            };

            const handleSubmit = async event => {
              event.preventDefault();
              await runDesignerTask(async () => {
                if (!Array.isArray(previewMeta.path) || !previewMeta.path.length) throw new Error('当前技能缺少可写回路径。');
                const formState = readSkillDesignerFormState(mountEl, previewMeta);
                const nextSkill = buildSkillDesignerUpdatedSkill(skillSource, formState, previewMeta);
                await replaceStatDataByEditor([{ path: previewMeta.path, value: nextSkill }]);
                clearCachedSkillDesignerDraft(previewKey);
                await refreshLiveSnapshot({ force: true });
                if (!destroyed && currentModalPreviewKey) renderModalContent(currentModalPreviewKey, getModalRefs());
              }, `已更新${previewMeta.label || '技能'}。`);
            };

            const handleChange = event => {
              if (event && event.target === primaryMainInput) {
                rebuildPrimarySubOptions();
                rebuildSecondaryOptions();
              }
              if (event && event.target === typeInput) {
                rebuildDeliveryOptions();
              }
              if (
                event
                && (
                  event.target === primaryMainInput
                  || event.target === primarySubInput
                  || event.target === deliveryFormInput
                  || (event.target instanceof HTMLElement && event.target.matches('input[name=\"skill-secondary\"]'))
                )
              ) {
                rebuildMechanicParamEditor();
              }
              syncChipState();
              syncAttributeHints();
              refreshPreview();
            };

            const handleInput = () => {
              syncChipState();
              refreshPreview();
            };

            handleInteractiveRefresh();
            if (form) form.addEventListener('submit', handleSubmit);
            if (refreshBtn) refreshBtn.addEventListener('click', handleRefresh);
            mountEl.addEventListener('change', handleChange);
            mountEl.addEventListener('input', handleInput);

            return {
              destroy() {
                destroyed = true;
                if (form) form.removeEventListener('submit', handleSubmit);
                if (refreshBtn) refreshBtn.removeEventListener('click', handleRefresh);
                mountEl.removeEventListener('change', handleChange);
                mountEl.removeEventListener('input', handleInput);
              }
            };
          },
          body: `
            <div class=\"archive-modal-grid skill-designer-layout\" style=\"grid-template-columns:1fr;\">
              <div class=\"archive-card full\">
                <div class=\"archive-card-head\">
                  <div class=\"archive-card-title\">技能锚点</div>
                  <span class=\"state-tag live\">${htmlEscape(previewMeta.category || '技能')}</span>
                </div>
                ${makeTileGrid([
                  { label: '技能名称', value: designerDraft.name },
                  { label: '技能归属', value: designerDraft.typeDisplay || designerDraft.type },
                  { label: '作用对象', value: designerDraft.target },
                  { label: '写回位置', value: pathTail }
                ], 'two')}
              </div>

              <form class=\"archive-card full mvu-editor-form skill-designer-form\" data-skill-designer-form>
                <div class=\"archive-card-head\">
                  <div class=\"archive-card-title\">设计参数</div>
                  <div class=\"mvu-editor-actions\">
                    <button type=\"button\" class=\"tag-chip\" data-skill-designer-refresh data-skill-designer-disableable>重新读取</button>
                    <button type=\"submit\" class=\"tag-chip live\" data-skill-designer-disableable>保存设计</button>
                  </div>
                </div>
                <div class=\"mvu-editor-grid\">
                  <section class=\"mvu-editor-section\">
                    <div class=\"mvu-editor-section-title\">基础信息</div>
                    <div class=\"mvu-editor-field-grid\">
                      <input type=\"hidden\" value=\"${escapeHtmlAttr(designerDraft.type || '未设置')}\" data-skill-designer-field=\"type\" data-skill-designer-disableable />
                      <label class=\"mvu-editor-field\">
                        <span class=\"mvu-editor-label\">技能名</span>
                        <input class=\"mvu-editor-input\" type=\"text\" value=\"${escapeHtmlAttr(designerDraft.name)}\" data-skill-designer-field=\"name\" data-skill-designer-disableable />
                      </label>
                      <label class=\"mvu-editor-field\">
                        <span class=\"mvu-editor-label\">作用对象</span>
                        <select class=\"mvu-editor-select\" data-skill-designer-field=\"target\" data-skill-designer-disableable>
                          ${buildSkillDesignerSelectOptions(SKILL_DESIGNER_TARGET_OPTIONS, designerDraft.target, '未设置')}
                        </select>
                      </label>
                      <label class=\"mvu-editor-field mvu-editor-field-wide\">
                        <span class=\"mvu-editor-label\">标签</span>
                        <input class=\"mvu-editor-input\" type=\"text\" value=\"${escapeHtmlAttr((designerDraft.tags || []).join('、'))}\" placeholder=\"用、或逗号分隔\" data-skill-designer-field=\"tags\" data-skill-designer-disableable />
                      </label>
                    </div>
                  </section>

                  <section class=\"mvu-editor-section\">
                    <div class=\"mvu-editor-section-title\">机制设计</div>
                    <div class=\"mvu-editor-field-grid\">
                      <label class=\"mvu-editor-field\">
                        <span class=\"mvu-editor-label\">主机制</span>
                        <select class=\"mvu-editor-select\" data-skill-designer-field=\"primaryMain\" data-skill-designer-disableable>
                          ${buildSkillDesignerSelectOptions(Object.keys(SKILL_DESIGNER_MAIN_MECHANIC_POOL), designerDraft.primaryMain, '未设置')}
                        </select>
                      </label>
                      <label class=\"mvu-editor-field\">
                        <span class=\"mvu-editor-label\">细分机制</span>
                        <select class=\"mvu-editor-select\" data-skill-designer-field=\"primarySub\" data-skill-designer-disableable>
                          ${buildSkillDesignerSelectOptions(getSkillDesignerChildMechanicOptions(designerDraft.primaryMain), designerDraft.primarySub, '未设置')}
                        </select>
                      </label>
                      <label class=\"mvu-editor-field\">
                        <span class=\"mvu-editor-label\">释放形式</span>
                        <select class=\"mvu-editor-select\" data-skill-designer-field=\"deliveryForm\" data-skill-designer-disableable>
                          ${buildSkillDesignerSelectOptions(getSkillDesignerDeliveryOptions(designerDraft.type), designerDraft.deliveryForm, '未设置')}
                        </select>
                      </label>
                      <label class=\"mvu-editor-field\">
                        <span class=\"mvu-editor-label\">战斗定位</span>
                        <select class=\"mvu-editor-select\" data-skill-designer-field=\"mainRole\" data-skill-designer-disableable>
                          ${buildSkillDesignerSelectOptions(SKILL_DESIGNER_MAIN_ROLE_OPTIONS, designerDraft.mainRole, '未设置')}
                        </select>
                      </label>
                    </div>
                    <div class=\"skill-designer-subsection\">
                      <div class=\"mvu-editor-label\">附加机制（可多选）</div>
                      <div class=\"skill-designer-chip-grid\" data-skill-designer-secondary-grid>
                        ${buildSkillDesignerCheckChipList(getSkillDesignerSecondaryOptionList(designerDraft.primaryMain, designerDraft.secondaryMechanics), designerDraft.secondaryMechanics, 'skill-secondary') || '<span class=\"tag-chip\">暂无附加机制</span>'}
                      </div>
                    </div>
                  </section>

                  <section class=\"mvu-editor-section\">
                    <div class=\"mvu-editor-section-title\">机制参数</div>
                    <div class=\"skill-designer-preview-stack\" data-skill-designer-mechanic-param-grid>
                      ${buildSkillDesignerMechanicParamEditor(designerDraft)}
                    </div>
                  </section>

                  <section class=\"mvu-editor-section\">
                    <div class=\"mvu-editor-section-title\">执行参数</div>
                    <div class=\"mvu-editor-field-grid\">
                      <label class=\"mvu-editor-field\">
                        <span class=\"mvu-editor-label\">消耗资源</span>
                        <select class=\"mvu-editor-select\" data-skill-designer-field=\"costType\" data-skill-designer-disableable>
                          ${buildSkillDesignerSelectOptions(SKILL_DESIGNER_RESOURCE_TYPE_OPTIONS, designerDraft.costType, '未设置')}
                        </select>
                      </label>
                      <label class=\"mvu-editor-field\">
                        <span class=\"mvu-editor-label\">消耗数值</span>
                        <input class=\"mvu-editor-input\" type=\"text\" value=\"${escapeHtmlAttr(designerDraft.costValue || '')}\" placeholder=\"20 / 15% / 魂力30+精神力10\" data-skill-designer-field=\"costValue\" data-skill-designer-disableable />
                      </label>
                      <label class=\"mvu-editor-field\">
                        <span class=\"mvu-editor-label\">加成属性</span>
                        <select class=\"mvu-editor-select\" data-skill-designer-field=\"bonus\" data-skill-designer-disableable>
                          ${buildSkillDesignerSelectOptions(SKILL_DESIGNER_BONUS_ATTRIBUTE_OPTIONS, designerDraft.bonus, '未设置')}
                        </select>
                      </label>
                    </div>
                  </section>

                  <section class=\"mvu-editor-section\">
                    <div class=\"mvu-editor-section-title\">属性设计</div>
                    <div class=\"mvu-editor-field-grid\">
                      <label class=\"mvu-editor-field\">
                        <span class=\"mvu-editor-label\">属性来源</span>
                        <select class=\"mvu-editor-select\" data-skill-designer-field=\"attributeSource\" data-skill-designer-disableable>
                          ${buildSkillDesignerSelectOptions(SKILL_ATTRIBUTE_SOURCE_VALUES, designerDraft.attributeSource, '未设置')}
                        </select>
                      </label>
                      <label class=\"mvu-editor-field\">
                        <span class=\"mvu-editor-label\">魂技作用</span>
                        <select class=\"mvu-editor-select\" data-skill-designer-field=\"attributeRole\" data-skill-designer-disableable>
                          ${buildSkillDesignerSelectOptions(SKILL_ATTRIBUTE_ROLE_VALUES, designerDraft.attributeRole, '未设置')}
                        </select>
                      </label>
                    </div>
                    <div class=\"skill-designer-subsection\">
                      <div class=\"mvu-editor-label\">附带属性</div>
                      <div class=\"skill-designer-chip-grid\" data-skill-designer-attribute-grid>
                        ${buildSkillDesignerCheckChipList(SKILL_DESIGNER_ATTRIBUTE_OPTIONS, designerDraft.attachedAttributes, 'skill-attribute', option => recommendedAttrs.has(option) ? 'recommended' : '')}
                      </div>
                    </div>
                    <div class=\"skill-designer-coeff-grid\">
                      ${SKILL_ATTRIBUTE_DIM_KEYS.map(key => `
                        <label class=\"mvu-editor-field\">
                          <span class=\"mvu-editor-label\">${htmlEscape(key)}</span>
                          <input class=\"mvu-editor-input\" type=\"number\" step=\"0.01\" value=\"${escapeHtmlAttr(String(designerDraft.coeff[key] ?? 1))}\" data-skill-designer-coeff=\"${escapeHtmlAttr(key)}\" data-skill-designer-disableable />
                        </label>
                      `).join('')}
                    </div>
                  </section>

                  <section class=\"mvu-editor-section\">
                    <div class=\"mvu-editor-section-title\">文本描述</div>
                    <div class=\"mvu-editor-field-grid\">
                      <label class=\"mvu-editor-field mvu-editor-field-wide\">
                        <span class=\"mvu-editor-label\">画面描述</span>
                        <textarea class=\"mvu-editor-textarea\" data-skill-designer-field=\"visualDesc\" data-skill-designer-disableable>${htmlEscape(designerDraft.visualDesc)}</textarea>
                      </label>
                      <label class=\"mvu-editor-field mvu-editor-field-wide\">
                        <span class=\"mvu-editor-label\">效果描述</span>
                        <textarea class=\"mvu-editor-textarea\" data-skill-designer-field=\"effectDesc\" data-skill-designer-disableable>${htmlEscape(designerDraft.effectDesc)}</textarea>
                      </label>
                    </div>
                  </section>
                </div>
              </form>

              <div class=\"archive-card full\">
                <div class=\"archive-card-head\"><div class=\"archive-card-title\">设计速览</div></div>
                <div class=\"skill-designer-preview-stack\">
                  <div class=\"ring-hover-copy\"><em>机制组合</em><span data-skill-designer-preview=\"mechanic\">${htmlEscape(buildSkillDesignerMechanicSummary(designerDraft) || '未设置')}</span></div>
                  <div class=\"ring-hover-copy\"><em>机制参数</em><span data-skill-designer-preview=\"mechanicParams\">${htmlEscape(buildSkillDesignerMechanicParamSummary(designerDraft) || '未设置')}</span></div>
                  <div class=\"ring-hover-copy\"><em>执行摘要</em><span data-skill-designer-preview=\"execution\">${htmlEscape(buildSkillDesignerExecutionSummary(designerDraft) || '未设置')}</span></div>
                  <div class=\"ring-hover-copy\"><em>属性组合</em><span data-skill-designer-preview=\"attribute\">${htmlEscape(buildSkillDesignerAttributeSummary(designerDraft) || '未设置')}</span></div>
                  <div class=\"ring-hover-copy\"><em>最终摘要</em><span data-skill-designer-preview=\"summary\">${htmlEscape(buildSkillDesignerCompactSummary(designerDraft) || '未设置')}</span></div>
                  <div class=\"ring-hover-copy\"><em>标签</em><span data-skill-designer-preview=\"tags\">${htmlEscape((designerDraft.tags || []).join(' / ') || '无')}</span></div>
                </div>
              </div>
            </div>
          `
        };
      }

      if (previewKey === '角色切换器') {
        const playerName = toText(deepGet(snapshot, 'rootData.sys.player_name', ''), '');
        const currentCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
        const charEntries = sortCharacterEntries(safeEntries(deepGet(snapshot, 'rootData.char', {})), { playerName, currentName: snapshot.activeName });
        const switchCards = charEntries.length
          ? charEntries.map(([name, char]) => {
              const displayName = toText(char && (char.name || deepGet(char, 'base.name', '')), name);
              const activeDisplayName = toText(snapshot.activeName, '');
              const isCurrent = (currentCharKey && name === currentCharKey) || (!currentCharKey && !!activeDisplayName && displayName === activeDisplayName);
              const isPlayer = isPlayerCharacterEntry(name, char, playerName);
              const lvText = `Lv.${toText(deepGet(char, 'stat.lv', 0), '0')}`;
              const identityText = toText(deepGet(char, 'social.main_identity', deepGet(char, 'base.identity', '无')), '无');
              const locText = toText(deepGet(char, 'status.loc', '未知地点'), '未知地点').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '');
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
        const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '');
        return {
          title: '生命图谱',
          summary: '基于当前角色的实时生命体征与状态摘要。',
          body: `
            <div class="archive-modal-grid life-graph-grid">
              <div class="archive-card life-growth-card">
                <div class="archive-card-head"><div class="archive-card-title">成长信息</div></div>
                <div class="identity-growth-grid">
                  <div class="meta-item"><b>等级</b><span>${htmlEscape(`Lv.${toText(stat.lv, '0')}`)}</span></div>
                  <div class="meta-item"><b>精神境界</b><span>${htmlEscape(toText(stat._men_realm, toText(stat.men_realm, '灵元境')))}</span></div>
                  <div class="meta-item"><b>天赋梯队</b><span>${htmlEscape(toText(stat.talent_tier, '未定'))}</span></div>
                  <div class="meta-item"><b>系别</b><span>${htmlEscape(toText(stat.type, '未知'))}</span></div>
                </div>
              </div>
              <div class="archive-card life-profile-card">
                <div class="archive-card-head"><div class="archive-card-title">角色名片</div></div>
                <div class="profile-snapshot life-profile-snapshot">
                  <div class="identity-card">
                    <h3>${htmlEscape(snapshot.activeName)}</h3>
                    <div class="identity-panel">
                      <div class="identity-panel-title">基础描述</div>
                      <div class="identity-basic-grid">
                        <div class="meta-item"><b>年龄 / 性别</b><span>${makeInlineEditableValue(`${toText(stat.age, '0')}岁`, { path: ['char', activeCharKey, 'stat', 'age'], kind: 'number', rawValue: stat.age })} / ${makeInlineEditableValue(toText(stat.gender, '未知'), { path: ['char', activeCharKey, 'stat', 'gender'], kind: 'string', rawValue: stat.gender })}</span></div>
                        <div class="meta-item"><b>性格</b><span>${makeInlineEditableValue(snapshot.personalityText, { path: ['char', activeCharKey, 'personality'], kind: 'string', rawValue: deepGet(snapshot, 'activeChar.personality', snapshot.personalityText) })}</span></div>
                        <div class="meta-item meta-item-wide"><b>名望</b><span>${htmlEscape(`${toText(social._fame_level, toText(social.fame_level, '籍籍无名'))} / ${formatNumber(social.reputation)}`)}</span></div>
                      </div>
                    </div>
                    <div class="identity-panel identity-appearance-panel">
                      <div class="identity-panel-title">外貌概览</div>
                      <div class="identity-appearance-grid">
                        <div class="meta-item"><b>发色</b><span>${makeInlineEditableValue(snapshot.appearanceMeta.hair, { path: ['char', activeCharKey, 'appearance', '发色'], kind: 'string', rawValue: deepGet(snapshot, 'activeChar.appearance.发色', snapshot.appearanceMeta.hair) })}</span></div>
                        <div class="meta-item"><b>瞳色</b><span>${makeInlineEditableValue(snapshot.appearanceMeta.eyes, { path: ['char', activeCharKey, 'appearance', '瞳色'], kind: 'string', rawValue: deepGet(snapshot, 'activeChar.appearance.瞳色', snapshot.appearanceMeta.eyes) })}</span></div>
                        <div class="meta-item"><b>身高</b><span>${makeInlineEditableValue(snapshot.appearanceMeta.height, { path: ['char', activeCharKey, 'appearance', '身高'], kind: 'string', rawValue: deepGet(snapshot, 'activeChar.appearance.身高', snapshot.appearanceMeta.height) })}</span></div>
                        <div class="meta-item"><b>体型</b><span>${makeInlineEditableValue(snapshot.appearanceMeta.build, { path: ['char', activeCharKey, 'appearance', '体型'], kind: 'string', rawValue: deepGet(snapshot, 'activeChar.appearance.体型', snapshot.appearanceMeta.build) })}</span></div>
                        <div class="meta-item meta-item-wide"><b>特征</b><span>${makeInlineEditableValue(snapshot.appearanceMeta.features, { path: ['char', activeCharKey, 'appearance', '特殊特征'], kind: 'string_list', rawValue: deepGet(snapshot, 'activeChar.appearance.特殊特征', []) })}</span></div>
                      </div>
                    </div>
                  </div>
                  <div class="status-card">
                    <h4 style="margin:0 0 6px;font-size:13px;font-family:var(--font-title);color:var(--white);">当前状态</h4>
                    <div class="status-list">
                      <div class="status-row"><b>行动状态</b><span>${htmlEscape(toText(status.action, '日常'))}</span></div>
                      <div class="status-row"><b>伤势</b><span>${htmlEscape(toText(status.wound, '无伤'))}</span></div>
                      <div class="status-row"><b>当前领域</b><span>${htmlEscape(toText(status.active_domain, '无'))}</span></div>
                      <div class="status-row"><b>魂核状态</b><span>${htmlEscape(`${toText(deepGet(snapshot, 'activeChar.energy.core.数量', 0), '0')} 枚 / 进度 ${toText(deepGet(snapshot, 'activeChar.energy.core.progress', 0), '0')}%`)}</span></div>
                      ${snapshot.bloodline && snapshot.bloodline.valid ? `<div class="status-row"><b>血脉状态</b><span>${htmlEscape(`${snapshot.bloodline.bloodline} / ${snapshot.bloodline.sealLv}层`)}</span></div>` : ''}
                      <div class="status-row"><b>灵物吸收</b><span>${htmlEscape(toNumber(status.consuming_herb_age, 0) > 0 ? `${formatNumber(toNumber(status.consuming_herb_age, 0))} 年` : '当前无吸收') }</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="archive-card life-radar-card">
                <div class="archive-card-head"><div class="archive-card-title">战斗轮廓</div></div>
                <div class="battle-radar-wrap">
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
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">功法与额外特长</div></div>
                ${makeTimelineStack(snapshot.extraSkills && snapshot.extraSkills.length ? snapshot.extraSkills.map(skill => ({
                  title: `${skill.category} - ${skill.name}`,
                  desc: `${skill.level} | ${skill.desc}`,
                  preview: skill.preview || ''
                })) : [{ title: '暂无额外能力', desc: '该角色当前未习得特殊功法或掌握额外特长。' }])}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '社会档案详细页') {
        const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '');
        const activeWardrobeKey = toText(clothing.outfit, '').trim();
        const activeWardrobePath = activeWardrobeKey && activeWardrobeKey !== '无'
          ? ['char', activeCharKey, 'clothing', 'wardrobe', activeWardrobeKey]
          : null;
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
                      <div class="meta-item"><b>当前身份</b><span>${makeInlineEditableValue(toText(social.main_identity, '无'), { path: ['char', activeCharKey, 'social', 'main_identity'], kind: 'string', rawValue: social.main_identity })}</span></div>
                      <div class="meta-item"><b>名望层级</b><span>${htmlEscape(toText(social._fame_level, toText(social.fame_level, '籍籍无名')))}</span></div>
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
                  { text: toText(social._fame_level, toText(social.fame_level, '籍籍无名')), className: 'warn' },
                  { text: toText(social.main_identity, '无') },
                  { text: (social._public_intel ?? social.public_intel) ? '公开情报' : '私密档案' },
                  { text: `称号 ${snapshot.recentTitles.length}` }
                ])}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">特工社会摘要</div><span class="state-tag ${snapshot.publicIntel ? 'live' : 'warn'}">${htmlEscape(snapshot.publicIntel ? '档案已公开' : '私密级')}</span></div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  <div style="padding-right: 16px; border-right: 1px dashed rgba(255,255,255,0.06);">
                    ${makeTileGrid([
                      { label: '主公开身份', value: makeInlineEditableValue(toText(social.main_identity, '无'), { path: ['char', activeCharKey, 'social', 'main_identity'], kind: 'string', rawValue: social.main_identity }) },
                      { label: '名望等级', value: toText(social._fame_level, toText(social.fame_level, '籍籍无名')) },
                      { label: '阵营关联', value: snapshot.factions.map(([name]) => name).join(' / ') || '无' },
                      { label: '当前主称号', value: snapshot.recentTitles[0] || '暂无' }
                    ], 'two')}
                  </div>
                  <div>
                    <div style="font-size: 11px; color: var(--color-text-secondary); margin-bottom: 6px; font-weight: 500;">个人声望量级 <span style="float: right; color: var(--cyan);">${makeInlineEditableValue(formatNumber(social.reputation), { path: ['char', activeCharKey, 'social', 'reputation'], kind: 'number', rawValue: social.reputation })} / 5,000 阈值</span></div>
                    <div style="height: 6px; background: rgba(0, 229, 255, 0.1); border-radius: 3px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5); margin-bottom: 12px;">
                      <div style="height: 100%; background: linear-gradient(90deg, rgba(0,229,255,0.6), rgba(0,229,255,1)); width: ${ratioPercent(social.reputation, 5000)}%; border-radius: 3px; box-shadow: 0 0 8px rgba(0,229,255,0.8); transition: width 0.3s ease;"></div>
                    </div>
                    ${makeTileGrid([
                      { label: '头衔总数', value: String(snapshot.titleEntries.length) },
                      { label: '主阵营身份', value: snapshot.primaryFaction ? `${snapshot.primaryFaction[0]} / ${toText(deepGet(snapshot.primaryFaction[1], '身份', '无'), '无')}` : '无' }
                    ], 'two')}
                  </div>
                </div>
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">当前着装</div></div>
                ${makeTileGrid([
                  { label: '当前套装', value: makeInlineEditableValue(toText(clothing.outfit, '无'), { path: ['char', activeCharKey, 'clothing', 'outfit'], kind: 'string', rawValue: clothing.outfit }) },
                  { label: '衣柜套数', value: String(wardrobeEntries.length) },
                  { label: '上装', value: activeWardrobePath ? makeInlineEditableValue(toText(deepGet(clothing, ['wardrobe', activeWardrobeKey, '上装'], '无'), '无'), { path: [...activeWardrobePath, '上装'], kind: 'string', rawValue: deepGet(clothing, ['wardrobe', activeWardrobeKey, '上装'], '') }) : '无' },
                  { label: '下装', value: activeWardrobePath ? makeInlineEditableValue(toText(deepGet(clothing, ['wardrobe', activeWardrobeKey, '下装'], '无'), '无'), { path: [...activeWardrobePath, '下装'], kind: 'string', rawValue: deepGet(clothing, ['wardrobe', activeWardrobeKey, '下装'], '') }) : '无' },
                  { label: '鞋子', value: activeWardrobePath ? makeInlineEditableValue(toText(deepGet(clothing, ['wardrobe', activeWardrobeKey, '鞋子'], '无'), '无'), { path: [...activeWardrobePath, '鞋子'], kind: 'string', rawValue: deepGet(clothing, ['wardrobe', activeWardrobeKey, '鞋子'], '') }) : '无' },
                  { label: '套装描述', value: activeWardrobePath ? makeInlineEditableValue(toText(deepGet(clothing, ['wardrobe', activeWardrobeKey, '描述'], '暂无描述'), '暂无描述'), { path: [...activeWardrobePath, '描述'], kind: 'string', rawValue: deepGet(clothing, ['wardrobe', activeWardrobeKey, '描述'], '') }) : '暂无描述' }
                ], 'two')}
                ${!wardrobeEntries.length ? '<div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1); color: var(--color-text-secondary); font-size: 13px; text-align: center;">当前角色尚未记录可切换套装。</div>' : ''}
              </div>
              ${wardrobeEntries.length ? `
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">衣柜收纳</div></div>
                  ${makeTimelineStack(wardrobeEntries.map(([name, item]) => ({ title: name, desc: `${toText(item && item['上装'], '无')} / ${toText(item && item['下装'], '无')} / ${toText(item && item['鞋子'], '无')} ｜ ${toText(item && item['描述'], '暂无描述')}` })))}
                </div>
              ` : ''}
            </div>
          `
        };
      }

      if (previewKey === '所属势力详细页') {
        const currentFactionName = snapshot.factions[0] ? snapshot.factions[0][0] : '';
        return {
          title: '阵营身份弹窗',
          summary: '当前角色已加入势力、阵营位置摘要与阵营事务操作台。',
          body: `
            <div class="archive-modal-grid">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; grid-column: 1 / -1;">
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">所属势力架构</div></div>
                  <div class="relation-side-list">
                    ${(snapshot.factions.length ? snapshot.factions : [['未加入势力', { 身份: '无', 权限级: 0 }]]).map(([name, info], idx) => `<div class="faction-row ${idx === 0 ? 'highlight' : ''}"><b>${htmlEscape(name)}</b><span>${htmlEscape(`身份：${toText(info && info['身份'], '无')} / 权限级：${toText(info && info['权限级'], '0')}`)}</span></div>`).join('')}
                  </div>
                </div>
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">当前阵营位置</div></div>
                  ${makeTileGrid([
                    { label: '当前所属', value: snapshot.factions[0] ? snapshot.factions[0][0] : '无' },
                    { label: '身份', value: snapshot.factions[0] ? toText(deepGet(snapshot.factions[0][1], '身份', '无'), '无') : '未加入' },
                    { label: '权限级', value: snapshot.factions[0] ? toText(deepGet(snapshot.factions[0][1], '权限级', 0), '0') : '0' },
                    { label: '主要绑定', value: snapshot.factions.map(([name]) => name).join(' / ') || '暂无'
                  }], 'two')}
                </div>
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
              ${buildFactionAffairConsoleHtml(snapshot, currentFactionName)}
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
        const currentLocFull = toText(deepGet(snapshot, 'activeChar.status.loc', snapshot.currentLoc || '未知地点'), snapshot.currentLoc || '未知地点');
        const relationNodes = snapshot.relations.slice(0, 5);
        const relationLinks = relationPositions.slice(0, relationNodes.length).map((pos, index) => {
          const lineClass = index === 1 ? 'gold' : index === 3 ? 'alert' : 'cyan';
          return `<line class="topology-link ${lineClass}" x1="50" y1="50" x2="${pos.left}" y2="${pos.top}"></line>`;
        }).join('');
        const relationHtml = relationNodes.map(([name, rel], index) => {
          const pos = relationPositions[index];
          const favor = toNumber(rel && rel['好感度'], 0);
          return `
            <div class="topology-node interactive-ring ${pos.className}" data-relation-focus="${escapeHtmlAttr(name)}" style="left:${pos.left}%;top:${pos.top}%">
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
                  <span>${htmlEscape(toText(rel && rel['_progress_note'], toText(rel && rel['progress_note'], '暂无推进提示')))}</span>
                  <span>${htmlEscape(`下一阶段：${toText(rel && rel['_next_stage'], toText(rel && rel['next_stage'], '无'))} / ${toNumber(rel && rel['_next_stage_threshold'], toNumber(rel && rel['next_stage_threshold'], 0))}`)}</span>
                  <span>${htmlEscape(`最近互动：${toText(rel && rel['last_interact_action'], '无')} / ${toNumber(rel && rel['recent_favor_delta'], 0)}`)}</span>
                  <span>${htmlEscape(`当前加成：${toText(rel && rel['_current_relation_bonus'], toText(rel && rel['current_relation_bonus'], toText(rel && rel['favor_buff'], '无')) )}`)}</span>
                  <span>${htmlEscape(`下一解锁：${toText(rel && rel['_next_unlock_bonus'], toText(rel && rel['next_unlock_bonus'], '无'))}`)}</span>
                  <span>${htmlEscape(`关系状态：${toText(rel && rel['_availability'], toText(rel && rel['availability'], '未知'))} / ${toText(rel && rel['_route_lock_reason'], toText(rel && rel['route_lock_reason'], '无'))}`)}</span>
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
        const relationDirectoryPage = paginateModalItems(snapshot.relations, previewKey, 'relation-directory', 6);
        const relationFocusStateKey = `${previewKey}::relation-focus`;
        let relationDetailName = toText(modalFocusState[relationFocusStateKey], toText(deepGet(snapshot, 'relationAnalysis.focus_target', deepGet(relationFocusTargets, '0.target', relationNodes[0] ? relationNodes[0][0] : '')), ''));
        if (!snapshot.relations.some(([entryName]) => entryName === relationDetailName)) relationDetailName = snapshot.relations[0] ? snapshot.relations[0][0] : '';
        if (relationDetailName) modalFocusState[relationFocusStateKey] = relationDetailName;
        else delete modalFocusState[relationFocusStateKey];

        const relationDetailEntry = relationDetailName ? snapshot.relations.find(([entryName]) => entryName === relationDetailName) : null;
        const relationDetail = relationDetailEntry && relationDetailEntry[1];
        const resolvedTarget = relationDetailName ? resolveSnapshotCharacter(snapshot, relationDetailName) : { key: '', displayName: '', char: null };
        const relationTargetChar = resolvedTarget.char || null;
        const relationTargetLoc = toText(deepGet(relationTargetChar, 'status.loc', ''), '');
        const relationTargetLocLabel = relationTargetLoc ? relationTargetLoc.replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '') : '未知地点';
        const relationFavor = toNumber(relationDetail && relationDetail['好感度'], 0);
        const relationRoute = toText(relationDetail && relationDetail['relation_route'], '朋友线');
        const routeSwitchable = !!deepGet(relationDetail, '_route_switchable', false);
        const isContactable = !!relationTargetChar && deepGet(relationTargetChar, 'status.alive', true) !== false;
        const isSameLocation = !!relationTargetChar && isLocationCompatible(currentLocFull, relationTargetLoc);
        const isPlayerControlled = isSnapshotPlayerControlled(snapshot);
        const canTalk = isSameLocation && isContactable;
        const canAsk = isSameLocation && isContactable && relationFavor >= 30;
        const canBattle = isSameLocation && isContactable;
        const canConfess = isSameLocation && isContactable && (relationRoute === '恋人线' || routeSwitchable || relationFavor >= 80);
        const canDual = isSameLocation && isContactable && relationRoute === '恋人线' && relationFavor >= 80;
        const giftableItems = (snapshot.inventoryEntries || []).filter(([, item]) => toNumber(item && item['数量'], 0) > 0).slice(0, 30);
        const canGift = isSameLocation && isContactable && giftableItems.length > 0;
        const giftOptionsHtml = giftableItems.length
          ? giftableItems.map(([itemName, item]) => `<option value="${escapeHtmlAttr(itemName)}">${htmlEscape(`${itemName} ×${toNumber(item && item['数量'], 0)}`)}</option>`).join('')
          : '<option value="">暂无可送物品</option>';

        const relationDirectoryHtml = relationDirectoryPage.items.length
          ? relationDirectoryPage.items.map(([name, rel]) => {
              const resolved = resolveSnapshotCharacter(snapshot, name);
              const targetChar = resolved.char || null;
              const targetLoc = toText(deepGet(targetChar, 'status.loc', ''), '');
              const alive = !!targetChar && deepGet(targetChar, 'status.alive', true) !== false;
              const sameLocation = !!targetChar && isLocationCompatible(currentLocFull, targetLoc);
              const favor = toNumber(rel && rel['好感度'], 0);
              const stage = toText(rel && rel['关系'], '陌生');
              const route = toText(rel && rel['relation_route'], '朋友线');
              const availability = sameLocation ? '在场可接触' : (alive ? '远端存活' : '不可接触');
              const availabilityClass = sameLocation ? 'live' : (alive ? 'warn' : '');
              return `
                <button type="button" class="role-switch-tile ${name === relationDetailName ? 'active' : ''}" data-relation-focus="${escapeHtmlAttr(name)}" style="text-align:left;">
                  <div class="role-switch-head" style="margin-bottom:6px;font-size:15px;"><b>${htmlEscape(name)}</b><span class="state-tag ${availabilityClass}">${htmlEscape(availability)}</span></div>
                  <div style="display:grid;gap:4px;">
                    <span>${htmlEscape(`${stage} / ${route} / 好感 ${favor}`)}</span>
                    <span>${htmlEscape(`身份：${toText(rel && rel['npc_job'], '未知身份')}`)}</span>
                    <span>${htmlEscape(toText(rel && rel['_progress_note'], toText(rel && rel['progress_note'], '暂无推进提示')))}</span>
                  </div>
                </button>
              `;
            }).join('')
          : '<div class="intel-card"><b>暂无关系对象</b><span>关系网络尚未展开。</span></div>';

        const relationFocusHtml = (relationFocusTargets.length
          ? relationFocusTargets.slice(0, 2).map(item => {
              const targetName = toText(item && item.target, '未知对象');
              const detailEntry = snapshot.relations.find(([entryName]) => entryName === targetName);
              const detail = detailEntry && detailEntry[1];
              return `
                <div class="intel-card">
                  <b>${htmlEscape(`${targetName} / ${toText(item && item.relation, '陌生')}`)}</b>
                  <span>${htmlEscape(`${toText(item && item.reason, '暂无推进建议')} ｜ 建议：${toText(item && item.recommended_action, '继续观察')}`)}</span>
                  <span>${htmlEscape(`下一阶段：${toText(detail && detail['_next_stage'], toText(detail && detail['next_stage'], '无'))} / ${toNumber(detail && detail['_next_stage_threshold'], toNumber(detail && detail['next_stage_threshold'], 0))}`)}</span>
                  <span>${htmlEscape(`最近互动：${toText(detail && detail['last_interact_action'], '无')} / ${toNumber(detail && detail['recent_favor_delta'], 0)}`)}</span>
                </div>
              `;
            }).join('')
          : snapshot.relations.slice(0, 2).map(([name, rel]) => `
              <div class="intel-card">
                <b>${htmlEscape(`${name} / ${toText(rel && rel['关系'], '陌生')}`)}</b>
                <span>${htmlEscape(`路线：${toText(rel && rel['relation_route'], '朋友线')} / 好感：${toText(rel && rel['好感度'], 0)}`)}</span>
                <span>${htmlEscape(`下一阶段：${toText(rel && rel['_next_stage'], toText(rel && rel['next_stage'], '无'))} / ${toNumber(rel && rel['_next_stage_threshold'], toNumber(rel && rel['next_stage_threshold'], 0))}`)}</span>
                <span>${htmlEscape(`最近互动：${toText(rel && rel['last_interact_action'], '无')} / ${toNumber(rel && rel['recent_favor_delta'], 0)}`)}</span>
              </div>
            `).join('')) || '<div class="intel-card"><b>暂无关系线</b><span>关系线索仍在铺陈。</span></div>';

        const relationDetailHtml = relationDetail
          ? [
              { title: '焦点对象', value: relationDetailName },
              { title: '推进提示', value: toText(relationDetail && relationDetail['_progress_note'], toText(relationDetail && relationDetail['progress_note'], '暂无')) },
              { title: '下一阶段', value: `${toText(relationDetail && relationDetail['_next_stage'], toText(relationDetail && relationDetail['next_stage'], '无'))} / ${toNumber(relationDetail && relationDetail['_next_stage_threshold'], toNumber(relationDetail && relationDetail['next_stage_threshold'], 0))}` },
              { title: '最近互动', value: `${toText(relationDetail && relationDetail['last_interact_action'], '无')} / ${toNumber(relationDetail && relationDetail['recent_favor_delta'], 0)}` },
              { title: '当前加成', value: toText(relationDetail && relationDetail['_current_relation_bonus'], toText(relationDetail && relationDetail['current_relation_bonus'], '无')) },
              { title: '下一解锁', value: toText(relationDetail && relationDetail['_next_unlock_bonus'], toText(relationDetail && relationDetail['next_unlock_bonus'], '无')) },
              { title: '位置状态', value: `${relationTargetLocLabel} / ${isSameLocation ? '同地可接触' : (isContactable ? '远端存活' : '当前不可接触')}` }
            ].map(item => `<div class="intel-card"><b>${htmlEscape(item.title)}</b><span>${htmlEscape(item.value)}</span></div>`).join('')
          : '<div class="intel-card"><b>关系细节</b><span>当前暂无可展开的关系焦点。</span></div>';

        const relationActionHints = [
          relationDetailName ? `当前目标：${relationDetailName}` : '请先从对象列表中选定互动目标。',
          relationDetailName ? `位置：${relationTargetLocLabel}` : '',
          !isContactable && relationDetailName ? '目标当前不可接触。' : '',
          relationDetailName && isContactable && !isSameLocation ? '目标当前不在你身边，当面互动暂不可发起。' : '',
          relationDetailName && isSameLocation && relationFavor < 30 ? '请教动作需要好感度达到 30。' : '',
          relationDetailName && isSameLocation && !canConfess ? '表白动作需达到高好感阶段或可切入恋人线。' : '',
          relationDetailName && isSameLocation && !canDual ? '双修仅在高好感恋人线开放。' : '',
          relationDetailName && giftableItems.length === 0 ? '背包中暂无可送物品。' : ''
        ].filter(Boolean);

        const relationActionPanelHtml = relationDetail
          ? (isPlayerControlled
            ? `
                <div class="intel-card relation-action-panel">
                  <b>${htmlEscape(`${relationDetailName} / ${toText(relationDetail && relationDetail['关系'], '陌生')}`)}</b>
                  <span>${htmlEscape(`路线：${relationRoute} / 好感：${relationFavor} / 位置：${relationTargetLocLabel}`)}</span>
                  <span>${htmlEscape(`推进建议：${toText(relationDetail && relationDetail['_progress_note'], toText(relationDetail && relationDetail['progress_note'], '暂无'))}`)}</span>
                  <div class="relation-action-status">
                    <span class="state-tag ${isSameLocation ? 'live' : 'warn'}">${htmlEscape(isSameLocation ? '同地' : '未在身边')}</span>
                    <span class="state-tag ${isContactable ? 'live' : 'warn'}">${htmlEscape(isContactable ? '可接触' : '不可接触')}</span>
                    <span class="state-tag">${htmlEscape(routeSwitchable ? '可切恋人线' : relationRoute)}</span>
                  </div>
                  <div class="relation-action-toolbar">
                    <button type="button" class="relation-action-btn" data-relation-action="talk" data-relation-target="${escapeHtmlAttr(relationDetailName)}" ${!canTalk ? 'disabled' : ''}>闲聊</button>
                    <button type="button" class="relation-action-btn" data-relation-action="ask" data-relation-target="${escapeHtmlAttr(relationDetailName)}" ${!canAsk ? 'disabled' : ''}>请教</button>
                    <button type="button" class="relation-action-btn" data-relation-action="battle" data-relation-target="${escapeHtmlAttr(relationDetailName)}" ${!canBattle ? 'disabled' : ''}>切磋</button>
                    <button type="button" class="relation-action-btn" data-relation-action="confess" data-relation-target="${escapeHtmlAttr(relationDetailName)}" ${!canConfess ? 'disabled' : ''}>表白</button>
                    <button type="button" class="relation-action-btn" data-relation-action="dual" data-relation-target="${escapeHtmlAttr(relationDetailName)}" ${!canDual ? 'disabled' : ''}>双修</button>
                  </div>
                  <div class="relation-gift-row">
                    <select class="relation-gift-select" ${!canGift ? 'disabled' : ''}>
                      ${giftOptionsHtml}
                    </select>
                    <button type="button" class="relation-action-btn" data-relation-action="gift" data-relation-target="${escapeHtmlAttr(relationDetailName)}" ${!canGift ? 'disabled' : ''}>送礼</button>
                  </div>
                  ${relationActionHints.map(text => `<span>${htmlEscape(text)}</span>`).join('')}
                </div>
              `
            : `
                <div class="intel-card relation-action-panel">
                  <b>${htmlEscape(`${relationDetailName} / ${toText(relationDetail && relationDetail['关系'], '陌生')}`)}</b>
                  <span>${htmlEscape(`路线：${relationRoute} / 好感：${relationFavor} / 位置：${relationTargetLocLabel}`)}</span>
                  <span>${htmlEscape(`推进建议：${toText(relationDetail && relationDetail['_progress_note'], toText(relationDetail && relationDetail['progress_note'], '暂无'))}`)}</span>
                  <span>${htmlEscape(`最近互动：${toText(relationDetail && relationDetail['last_interact_action'], '无')} / Tick ${toNumber(relationDetail && relationDetail['last_interact_tick'], 0)} / 变化 ${toNumber(relationDetail && relationDetail['recent_favor_delta'], 0)}`)}</span>
                  <span>${htmlEscape(`当前加成：${toText(relationDetail && relationDetail['_current_relation_bonus'], toText(relationDetail && relationDetail['current_relation_bonus'], '无'))} / 下一解锁：${toText(relationDetail && relationDetail['_next_unlock_bonus'], toText(relationDetail && relationDetail['next_unlock_bonus'], '无'))}`)}</span>
                  <span>${htmlEscape('当前为旁观视角，此处可查看关系近况；若想闲聊、请教或送礼，请切回自己的行动视角。')}</span>
                  ${relationActionHints.map(text => `<span>${htmlEscape(text)}</span>`).join('')}
                </div>
              `)
          : `<div class="intel-card relation-action-panel"><b>${htmlEscape(isPlayerControlled ? '关系互动台' : '关系近况')}</b><span>${htmlEscape(isPlayerControlled ? '请先从对象列表中选定互动目标。' : '当前为旁观视角，可先查看这段关系的近况。')}</span></div>`;

        const riskTargets = Array.isArray(deepGet(snapshot, 'relationAnalysis.risk_targets', [])) ? deepGet(snapshot, 'relationAnalysis.risk_targets', []) : [];
        const blockedTargets = Array.isArray(deepGet(snapshot, 'relationAnalysis.blocked_targets', [])) ? deepGet(snapshot, 'relationAnalysis.blocked_targets', []) : [];
        const sameLocationTargets = Array.isArray(deepGet(snapshot, 'relationAnalysis.same_location_targets', [])) ? deepGet(snapshot, 'relationAnalysis.same_location_targets', []) : [];
        const trustTargets = Array.isArray(deepGet(snapshot, 'relationAnalysis.trust_targets', [])) ? deepGet(snapshot, 'relationAnalysis.trust_targets', []) : [];
        const romanceCandidates = Array.isArray(deepGet(snapshot, 'relationAnalysis.romance_candidates', [])) ? deepGet(snapshot, 'relationAnalysis.romance_candidates', []) : [];
        const recommendedActions = Array.isArray(deepGet(snapshot, 'relationAnalysis.recommended_actions', [])) ? deepGet(snapshot, 'relationAnalysis.recommended_actions', []) : [];
        const relationSummaryText = relationFocusTargets.length
          ? `当前重点关系对象：${relationFocusTargets.slice(0, 2).map(item => `${toText(item && item.target, '无')}(${toText(item && item.relation, '陌生')}/${toNumber(item && item.favor, 0)})`).join('、')}`
          : sameLocationTargets.length
            ? `当前可立即接触：${sameLocationTargets.slice(0, 3).join('、')}`
            : recommendedActions.length
              ? `当前建议：${recommendedActions.slice(0, 2).join('；')}`
              : (trustTargets.length ? `高信任对象：${trustTargets.slice(0, 3).join('、')}` : (riskTargets.length ? `高风险对象：${riskTargets.slice(0, 3).join('、')}` : '当前雷达未扫描到足够的社会链接数据，暂无总体分析倾向。'));

        return {
          title: '人物关系弹窗',
          summary: '全局社会链路扫描、当前重点对象监控与智能关系行动推荐。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">社会节点扫描雷达</div><span class="state-tag live">实时拓扑</span></div>
                <div class="topology-board" style="min-height: 280px; background: radial-gradient(circle at center, rgba(0, 229, 255, 0.08) 0%, transparent 70%); border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <svg class="topology-svg" viewBox="0 0 100 100" preserveAspectRatio="none">${relationLinks}</svg>
                  <div class="topology-node center" style="left:50%;top:50%"><b>${htmlEscape(snapshot.activeName)}</b><span>自我</span></div>
                  ${relationHtml || '<div class="topology-node" style="left:50%;top:18%"><b>暂无关系对象</b><span>关系网络尚未展开</span></div>'}
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding-top: 16px;">
                  <div style="border-right: 1px dashed rgba(255,255,255,0.1); padding-right: 16px;">
                    <div style="font-size: 12px; color: var(--cyan); margin-bottom: 8px; font-weight: bold; letter-spacing: 1px;">关系态势摘要</div>
                    <div style="font-size: 13px; line-height: 1.5; color: var(--color-text-primary); margin-bottom: 12px;">${htmlEscape(toText(relationSummaryText, '当前雷达未扫描到足够的社会链接数据，暂无总体分析倾向。'))}</div>
                    ${makeTileGrid([
                      { label: '焦点对象', value: toText(deepGet(snapshot, 'relationAnalysis.focus_target', '无'), '无') },
                      { label: '系统建议', value: recommendedActions.slice(0, 3).join(' / ') || '无' }
                    ], 'two')}
                  </div>
                  <div>
                    <div style="font-size: 12px; color: var(--cyan); margin-bottom: 8px; font-weight: bold; letter-spacing: 1px;">分类目标追踪</div>
                    ${makeTileGrid([
                      { label: '在场交互目标', value: sameLocationTargets.slice(0, 4).join(' / ') || '无在场目标' },
                      { label: '高优先级 (恋爱/信任)', value: [...romanceCandidates.slice(0,2), ...trustTargets.slice(0,2)].join(' / ') || '暂无高优先级' },
                      { label: '阻碍风险 (受阻/敌对)', value: [...blockedTargets.slice(0,2).map(item => `${toText(item.target, '未知')}(受阻)`), ...riskTargets.slice(0,2)].join(' / ') || '无风险' }
                    ], 'two')}
                  </div>
                </div>
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">互动对象列表</div><span class="state-tag ${relationDirectoryPage.total ? 'live' : 'warn'}">${relationDirectoryPage.total ? `已收录 ${relationDirectoryPage.total} 名` : '暂无对象'}</span></div>
                <div class="relation-directory-grid">
                  ${relationDirectoryHtml}
                </div>
                ${makeModalPaginationControls('relation-directory', relationDirectoryPage.page, relationDirectoryPage.totalPages, relationDirectoryPage.total)}
              </div>
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">${htmlEscape(isPlayerControlled ? '关系互动台' : '关系观察台')}</div><span class="state-tag ${relationDetailName ? 'live' : 'warn'}">${htmlEscape(relationDetailName || '未选中')}</span></div>
                ${relationActionPanelHtml}
                ${relationDetailHtml !== '<div class="intel-card"><b>交互历史</b><span>暂无有效数据</span></div>' && relationDetailHtml !== '' ? `
                  <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1);">
                    <div style="font-size: 13px; color: var(--cyan); margin-bottom: 8px; font-weight: bold;">关系细节</div>
                    <div class="intel-layout">
                      ${relationDetailHtml}
                    </div>
                  </div>
                ` : ''}
                ${relationFocusHtml !== '<div class="intel-card"><b>核心焦点</b><span>无</span></div>' && relationFocusHtml !== '' ? `
                  <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1);">
                    <div style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 4px; font-weight: bold;">核心推进线索</div>
                    <div class="intel-layout">
                      ${relationFocusHtml}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          `
        };
      }


      if (previewKey === '情报库详细页') {
        const intelNodes = [toText(deepGet(snapshot, 'activeChar.knowledge_unlock_request.content', '无'), '无'), ...snapshot.unlockedKnowledges.slice(-4).reverse()].filter(item => item && item !== '无');
        const coreIntel = intelNodes[0] || '暂无核心情报';
        const sideIntels = intelNodes.slice(1, 5);
        const unlockedIntelPage = paginateModalItems((snapshot.unlockedKnowledges || []).slice().reverse(), previewKey, 'intel-records', 6);
        const pendingIntelDefault = snapshot.pendingIntelCount ? snapshot.pendingIntelContent : '';
        const pendingIntelImpactDefault = snapshot.pendingIntelCount ? snapshot.pendingIntelImpact : 1;
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
        const unlockedIntelHtml = unlockedIntelPage.items.length
          ? unlockedIntelPage.items.map(item => `
              <div class="intel-card">
                <b>${htmlEscape(item)}</b>
                <span>已记录进情报库，可作为后续判断依据。</span>
              </div>
            `).join('')
          : '<div class="intel-card"><b>暂无已解锁情报</b><span>当前还没有被正式记录的核心线索。</span></div>';
        return {
          title: '情报库弹窗',
          summary: '当前已解锁情报、待追线索与战斗记录摘要。',
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
                <div class="archive-card-head"><div class="archive-card-title">待追线索</div><span class="state-tag ${snapshot.pendingIntelCount ? 'warn' : 'live'}">${htmlEscape(snapshot.pendingIntelCount ? `待追 / +${snapshot.pendingIntelImpact}` : '暂无新线索')}</span></div>
                <div style="padding-top: 8px;">
                  <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 12px;">${htmlEscape(snapshot.pendingIntelCount ? `最近浮出的线索：${snapshot.pendingIntelContent}` : '最近没有新的线索浮出水面。')}</div>
                  <div class="intel-card"><b>线索提醒</b><span>新的情报会随着见闻、调查与遭遇逐渐浮现。这里会先记下尚未展开的线索，等剧情推进后再继续追查。</span></div>
                </div>
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">已解锁情报列表</div><span class="state-tag ${snapshot.unlockedKnowledges.length ? 'live' : 'warn'}">${snapshot.unlockedKnowledges.length ? `${snapshot.unlockedKnowledges.length} 条` : '空'}</span></div>
                <div class="intel-layout">
                  ${unlockedIntelHtml}
                </div>
                ${makeModalPaginationControls('intel-records', unlockedIntelPage.page, unlockedIntelPage.totalPages, unlockedIntelPage.total)}
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
        const armorBonusItems = buildStatsBonusItems(deepGet(armor, '_stats_bonus', deepGet(armor, 'stats_bonus', {})), { includeLvEquiv: true });
        const mechBonusItems = buildStatsBonusItems(deepGet(mech, '_stats_bonus', deepGet(mech, 'stats_bonus', {})));
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

        const getBoneBonus = (age, part) => {
          let rb = { str: Math.floor(age * 0.05), def: Math.floor(age * 0.05), agi: Math.floor(age * 0.05), vit_max: Math.floor(age * 0.05), men_max: Math.floor(age * 0.01), sp_max: Math.floor(age * 0.1) };
          let bonus = { ...rb };
          if (part === "躯干魂骨") { bonus.str*=2; bonus.def*=2; bonus.agi*=2; bonus.vit_max*=2; bonus.sp_max*=2; }
          else if (part === "头部魂骨") { bonus.men_max*=2; }
          else if (part === "左腿魂骨" || part === "右腿魂骨") { bonus.agi*=2; }
          else if (part === "左臂魂骨" || part === "右臂魂骨") { bonus.str*=2; }
          return bonus;
        };

        const soulBoneCards = (snapshot.soulBoneEntries && snapshot.soulBoneEntries.length ? snapshot.soulBoneEntries.slice(0, 6) : [['暂无魂骨装载', { empty: true }]]).map(([slot, bone]) => {
          if (bone && bone.empty) {
            return { title: slot, desc: '尚未装载魂骨。' };
          }
          const boneName = toText(bone && (bone.name || bone['名称'] || bone['表象名称']), slot);
          const age = toText(bone && (bone['年限'] || bone.age), '');
          const quality = toText(bone && (bone['品质'] || bone['品阶']), '');
          let descText = `${toText(bone && (bone['状态'] || bone.status), '已装载')}`;
          if (age || quality) descText += ` ｜ ${[age ? `${age}年` : '', quality].filter(Boolean).join(' ')}`;
          
          const realAge = toNumber(age, 0);
          if (realAge > 0) {
            const stats = getBoneBonus(realAge, slot);
            const statParts = [];
            if (stats.str) statParts.push(`力+${formatNumber(stats.str)}`);
            if (stats.def) statParts.push(`防+${formatNumber(stats.def)}`);
            if (stats.agi) statParts.push(`敏+${formatNumber(stats.agi)}`);
            if (stats.vit_max) statParts.push(`体+${formatNumber(stats.vit_max)}`);
            if (stats.men_max) statParts.push(`精+${formatNumber(stats.men_max)}`);
            if (statParts.length) descText += ` ｜ 属性加成: ${statParts.join(' ')}`;
          }

          const skillsObj = bone && bone['附带技能'];
          if (skillsObj && Object.keys(skillsObj).length) {
            const parsedSkills = buildSkillList(skillsObj, {
              basePath: ['char', snapshot.activeName, 'soul_bone', slot, '附带技能'],
              category: '魂骨附带技能',
              scope: 'soul_bone_skill',
            });
            const skillsHtml = parsedSkills.map(skill => `
              <div
                class="ring-hover-skill${skill && skill.preview ? ' clickable' : ''}"
                ${skill && skill.preview ? `data-preview="${escapeHtmlAttr(skill.preview)}"` : ''}
                style="background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.05); margin-top:8px; padding:8px; border-radius:8px;"
              >
                <b style="color:var(--gold);font-size:11px;display:block;margin-bottom:6px;">${htmlEscape(skill && skill.name ? skill.name : '未命名技能')}</b>
                <div class="ring-hover-copy"><em>画面描述</em><span>${htmlEscape(skill && skill.visualDesc ? skill.visualDesc : '未知')}</span></div>
                <div class="ring-hover-copy"><em>效果描述</em><span>${htmlEscape(skill && skill.effectDesc ? skill.effectDesc : '未知')}</span></div>
              </div>
            `).join('');
            descText += skillsHtml;
          }

          return { title: `${boneName} / ${slot}`, desc: descText };
        });

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
        const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '');
        const inventoryCells = snapshot.inventoryEntries
          .sort((a, b) => toNumber(deepGet(b[1], 'market_value.price', b[1] && b[1]['数量']), 0) - toNumber(deepGet(a[1], 'market_value.price', a[1] && a[1]['数量']), 0))
          .slice(0, 18)
          .map(([name, item]) => ({
            name,
            trigger: toText(item && item['触发方式'], /食物/.test(toText(item && item['类型'], '')) ? '食用' : '使用'),
            expiry: resolveExpiryUiText(item, Number(deepGet(item, '有效期至tick', 0)) > 0 ? '临时物品' : '无期限'),
            qty: toNumber(item && item['数量'], 1),
            meta: `${toText(item && item['类型'], '物品')} · ${toText(item && (item['品质'] || item['品阶']), '常规')}`,
            className: /十万|天锻|神|红/.test(name + toText(item && item['品质'], '')) ? 'gold' : (/万年|魂骨|魂灵|紫/.test(name + toText(item && item['品质'], '')) ? 'purple' : ''),
            type: `${toText(item && item['类型'], '物品')} / ${toText(item && item['品阶'], toText(item && item['品质'], '普通'))}`,
            rarity: toText(item && (item['品质'] || item['品阶']), '普通'),
            source: toText(item && item['来源技能'], toText(item && item['绑定者'], '背包持有')),
            usage: toText(item && item['描述'], '暂无说明'),
            canEquip: !!(window.EquipmentManager && window.EquipmentManager.parseEquipSlot(name, item)),
            tags: [
              toText(item && item['类型'], ''),
              toText(item && item['品质'], ''),
              toText(item && item['品阶'], ''),
              toText(item && item['触发方式'], ''),
              Number(deepGet(item, '有效期至tick', 0)) > 0 ? '临时道具' : ''
            ].filter(Boolean)
          }));
        return {
          title: '储物仓库',
          summary: '当前背包、货币与核心物资。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">钱包条</div></div>
                ${makeWalletStrip([
                  { label: '联邦币', value: makeInlineEditableValue(formatNumber(wealth.fed_coin), { path: ['char', activeCharKey, 'wealth', 'fed_coin'], kind: 'number', rawValue: wealth.fed_coin }), className: 'gold' },
                  { label: '星罗币', value: makeInlineEditableValue(formatNumber(wealth.star_coin), { path: ['char', activeCharKey, 'wealth', 'star_coin'], kind: 'number', rawValue: wealth.star_coin }), className: 'cyan' },
                  { label: '唐门积分', value: makeInlineEditableValue(formatNumber(wealth.tang_pt), { path: ['char', activeCharKey, 'wealth', 'tang_pt'], kind: 'number', rawValue: wealth.tang_pt }), className: 'cyan' },
                  { label: '学院积分', value: makeInlineEditableValue(formatNumber(wealth.shrek_pt), { path: ['char', activeCharKey, 'wealth', 'shrek_pt'], kind: 'number', rawValue: wealth.shrek_pt }), className: 'cyan' },
                  { label: '战功', value: makeInlineEditableValue(formatNumber(wealth.blood_pt), { path: ['char', activeCharKey, 'wealth', 'blood_pt'], kind: 'number', rawValue: wealth.blood_pt }), className: 'red' }
                ])}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">物资细项总览</div></div>
                ${makeTimelineStack(snapshot.inventoryEntries.slice(0, 8).map(([name, item]) => ({
                  title: `${name} / ${toText(item && item['类型'], '物品')}`,
                  desc: [
                    `品质 ${toText(item && (item['品质'] || item['品阶']), '普通')}`,
                    `触发 ${toText(item && item['触发方式'], /食物/.test(toText(item && item['类型'], '')) ? '食用' : '常规')}`,
                    `有效期 ${resolveExpiryUiText(item, Number(deepGet(item, '有效期至tick', 0)) > 0 ? '临时物品' : '无期限')}`,
                    `来源 ${toText(item && item['来源技能'], toText(item && item['绑定者'], '背包持有'))}`,
                    `标签 ${(Array.isArray(item && item['标签']) ? item['标签'].slice(0, 3).join(' / ') : '无') || '无'}`,
                    `耐久 ${toText(deepGet(item, ['耐久', '当前'], 0), 0)}/${toText(deepGet(item, ['耐久', '上限'], 0), 0)}`,
                    `交易 ${deepGet(item, '可交易', true) ? '可交易' : '绑定'}`,
                    `市价 ${formatNumber(deepGet(item, ['market_value', 'price'], 0))} ${({
                      fed_coin: '联邦币',
                      star_coin: '星罗币',
                      tang_pt: '唐门积分',
                      shrek_pt: '学院积分',
                      blood_pt: '血神功勋'
                    }[toText(deepGet(item, ['market_value', 'currency'], 'fed_coin'), 'fed_coin')] || '联邦币')}`
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
                      ${soul.rings.length ? `
                        <div class="soul-ring-section">
                          <div class="rings soul-ring-lane">
                            ${soul.rings.map(ring => `<div class="ring ${ring.ringClass} interactive-ring">${htmlEscape(ring.glyph)}${buildRingHoverMarkup(ring)}</div>`).join('')}
                          </div>
                        </div>
                      ` : ''}
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
                <div class="archive-card-head"><div class="archive-card-title">当前主动能力</div></div>
                <div class="ability-detail-card">
                  <div class="ability-detail-title">${htmlEscape(snapshot.bloodline.bloodSkills[0] ? snapshot.bloodline.bloodSkills[0].name : '暂无主动能力')}</div>
                  <div class="ring-hover-copy"><em>画面描述</em><span>${htmlEscape(snapshot.bloodline.bloodSkills[0] ? snapshot.bloodline.bloodSkills[0].visualDesc : '未知')}</span></div>
                  <div class="ring-hover-copy"><em>效果描述</em><span>${htmlEscape(snapshot.bloodline.bloodSkills[0] ? snapshot.bloodline.bloodSkills[0].effectDesc : '未知')}</span></div>
                </div>
              </div>
              ${snapshot.bloodline.bloodPermanentBonuses && snapshot.bloodline.bloodPermanentBonuses.length ? `
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">永久成长</div></div>
                  <div class="ability-detail-card">
                    ${snapshot.bloodline.bloodPermanentBonuses.slice(0, 4).map(item => `<div class="ring-hover-copy"><em>${htmlEscape(item.name || '永久成长')}</em><span>${htmlEscape(item.effectDesc || item.effectSummary || '永久成长')}</span></div>`).join('')}
                  </div>
                </div>
              ` : ''}
              ${snapshot.bloodline.bloodPassives && snapshot.bloodline.bloodPassives.length ? `
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">被动特性</div></div>
                  <div class="ability-detail-card">
                    ${snapshot.bloodline.bloodPassives.slice(0, 4).map(skill => `<div class="ring-hover-copy"><em>${htmlEscape(skill.name || '被动特性')}</em><span>${htmlEscape(skill.effectDesc || skill.visualDesc || '被动特性')}</span></div>`).join('')}
                  </div>
                </div>
              ` : ''}
              ${snapshot.bloodline.rings.length ? `
                <div class="archive-card full spirit-flow-card">
                  <div class="archive-card-head"><div class="archive-card-title">气血魂环轨道</div></div>
                  <div class="orbit-track">
                    ${snapshot.bloodline.rings.map(ring => `<div class="ring ${ring.ringClass || 'ring-gold'} interactive-ring">${htmlEscape(ring.glyph)}${buildRingHoverMarkup(ring)}</div>`).join('')}
                  </div>
                </div>
              ` : ''}
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
        const rootChars = deepGet(snapshot, 'rootData.char', {});
        let targetChar = deepGet(snapshot, ['sd', 'char', targetName], null) || (rootChars && typeof rootChars === 'object' ? (rootChars[targetName] || null) : null);
        if (!targetChar && rootChars && typeof rootChars === 'object') {
          for (const [charKey, charInfo] of Object.entries(rootChars)) {
            const displayName = toText(charInfo && (charInfo.name || deepGet(charInfo, 'base.name', '')), charKey);
            if (displayName === targetName) { targetChar = charInfo; break; }
          }
        }
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
                  { label: '名望', value: targetChar ? `${toText(targetSocial._fame_level, toText(targetSocial.fame_level, '籍籍无名'))} / ${formatNumber(targetSocial.reputation)}` : '未收录' },
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
        const lastBoardEntries = safeEntries(deepGet(snapshot, 'rootData.world.rankings.youth_talent._last榜单', deepGet(snapshot, 'rootData.world.rankings.youth_talent.last榜单', {}))).sort((a, b) => toNumber(b[1], 0) - toNumber(a[1], 0));
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
        const auctionItems = safeEntries(deepGet(snapshot, 'rootData.world.auction.items', {})).slice(0, 6);
        return {
          title: '拍卖行 / 世界警报弹窗',
          summary: '拍卖状态、拍品与当前世界警报。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">拍卖状态</div></div>
                ${makeTileGrid([
                  { label: '状态', value: toText(deepGet(snapshot, 'rootData.world.auction.status', '休市'), '休市') },
                  { label: '地点', value: toText(deepGet(snapshot, 'rootData.world.auction.location', '无'), '无') },
                  { label: '下次刷新', value: toText(deepGet(snapshot, 'rootData.world.auction.next_tick', 0), '0') },
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
        return {
          title: '势力矩阵弹窗',
          summary: '点击势力名称，查看该势力的详细结构与在场人物档案。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">势力梯阵</div></div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; margin-top: 10px;">
                  ${snapshot.orgEntries.map(([name, item]) => `
                    <button type="button" class="role-switch-tile clickable" data-preview="org_detail_${escapeHtmlAttr(name)}" style="text-align:left; border:1px solid rgba(255,255,255,0.08); background:rgba(0,0,0,0.2); padding:12px; border-radius:8px; cursor:pointer;">
                      <div class="role-switch-head" style="margin-bottom:6px;font-size:15px;"><b>${htmlEscape(name)}</b><span class="state-tag">点击详情</span></div>
                      <div class="role-switch-meta" style="font-size:12px;color:var(--text-muted);">
                        规模：${formatNumber(item && item.size || 0)} ｜ 状态：${toText(item && item.status, '正常')} <br>
                        顶尖战力：${toText(deepGet(item, 'power_stats.title_douluo', 0), '0')} 位封号斗罗
                      </div>
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          `
        };
      }

      if (String(previewKey || '').startsWith('org_detail_')) {
        const targetOrgName = String(previewKey).replace('org_detail_', '').trim();
        const targetOrgEntry = snapshot.orgEntries.find(([name]) => name === targetOrgName) || [targetOrgName, {}];
        const targetOrgData = targetOrgEntry[1] || {};
        
        const factionRelationCards = buildFactionRelationCards(targetOrgData, {
          max: 8,
          emptyTitle: '暂无对外关系',
          emptyDesc: '当前势力未记录对外关系。'
        });

        // Automatically gather characters belonging to this organization
        const orgMembers = [];
        for (const [charName, charInfo] of snapshot.charEntries) {
           const factions = safeEntries(deepGet(charInfo, 'social.factions', {}));
           const matchingFaction = factions.find(([fName]) => fName === targetOrgName);
           if (matchingFaction) {
               orgMembers.push({
                 name: charName,
                 desc: `身份：${toText(matchingFaction[1] && matchingFaction[1]['身份'], '成员')} ｜ 权限：Lv.${toText(matchingFaction[1] && matchingFaction[1]['权限级'], '1')}`
               });
           }
        }

        return {
          title: `${targetOrgName} / 势力档案`,
          summary: '展示该势力的规模战力、对外关系以及已知成员名册。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">势力概况</div></div>
                ${makeTileGrid([
                  { label: '影响力', value: formatNumber(targetOrgData.inf || 0) },
                  { label: '势力规模', value: formatNumber(targetOrgData.size || 0) },
                  { label: '当前状态', value: toText(targetOrgData.status, '正常') },
                  { label: '极限斗罗', value: deepGet(targetOrgData, 'power_stats.limit_douluo', 0) },
                  { label: '超级斗罗', value: deepGet(targetOrgData, 'power_stats.super_douluo', 0) },
                  { label: '封号斗罗', value: deepGet(targetOrgData, 'power_stats.title_douluo', 0) }
                ])}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">对外关系</div></div>
                ${makeTimelineStack(factionRelationCards)}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">角色名册</div></div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; margin-top: 10px;">
                  ${orgMembers.length > 0 ? orgMembers.map(m => `
                    <button type="button" class="role-switch-tile clickable" data-preview="榜单角色：${escapeHtmlAttr(m.name)}" style="text-align:left; border:1px solid rgba(255,255,255,0.08); background:rgba(0,0,0,0.2); padding:12px; border-radius:8px; cursor:pointer;">
                      <div class="role-switch-head" style="margin-bottom:6px;font-size:15px;"><b>${htmlEscape(m.name)}</b><span class="state-tag">角色</span></div>
                      <div class="role-switch-meta" style="font-size:12px;color:var(--text-muted);">
                        ${htmlEscape(m.desc)}
                      </div>
                    </button>
                  `).join('') : '<div style="padding:12px; color:var(--text-muted);">未搜索到属于该势力的已知角色。</div>'}
                </div>
              </div>
            </div>
          `
        };
      }

      if (previewKey === '我的阵营详情') {
        const currentFactionName = snapshot.factions[0] ? snapshot.factions[0][0] : '';
        const currentFactionRole = snapshot.factions[0] ? toText(deepGet(snapshot.factions[0][1], '身份', '无'), '无') : '未加入';
        const currentFactionPower = snapshot.factions[0] ? toText(deepGet(snapshot.factions[0][1], '权限级', 0), '0') : '0';
        const currentFactionEntry = currentFactionName
          ? (snapshot.orgEntries.find(([name]) => name === currentFactionName) || [currentFactionName, {}])
          : ['', {}];
        const currentFactionRelationCards = buildFactionRelationCards(currentFactionEntry[1] || {}, {
          max: 8,
          emptyTitle: '暂无阵营关系',
          emptyDesc: currentFactionName ? '当前所属势力未记录对外关系。' : '当前角色尚未加入可展示关系的势力。'
        });
        const promotionReq = toText(deepGet(snapshot, 'activeChar.promotion_request.target_faction', '无'), '无');
        const donateReq = toText(deepGet(snapshot, 'activeChar.donate_request.item_name', '无'), '无');
        const questReq = toText(deepGet(snapshot, 'activeChar.quest_request.action', '无'), '无');
        const hasFactionRelations = safeEntries(deepGet(currentFactionEntry[1], 'rel', {})).length > 0;
        const hasPendingRequests = promotionReq !== '无' || donateReq !== '无' || questReq !== '无';

        return {
          title: '我的阵营弹窗',
          summary: '当前角色在各势力中的身份、权限与操作台。',
          body: `
            <div class="archive-modal-grid">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; grid-column: 1 / -1;">
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">所属势力架构</div></div>
                  <div class="relation-side-list">
                    ${(snapshot.factions.length ? snapshot.factions : [['未加入势力', { 身份: '无', 权限级: 0 }]]).map(([name, info], idx) => `<div class="faction-row ${idx === 0 ? 'highlight' : ''}"><b>${htmlEscape(name)}</b><span>${htmlEscape(`身份：${toText(info && info['身份'], '无')} / 权限级：${toText(info && info['权限级'], '0')}`)}</span></div>`).join('')}
                  </div>
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
              </div>
              ${hasFactionRelations || hasPendingRequests ? `
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">阵营动态</div></div>
                  <div class="two-col-grid" style="margin-top: 12px;">
                    ${hasFactionRelations ? `<div class="relation-side-list"><div class="relation-card"><b>当前阵营关系</b><span>${htmlEscape(currentFactionRelationCards.map(item => `${item.title}：${item.desc}`).join(' / '))}</span></div>${makeTimelineStack(currentFactionRelationCards)}</div>` : ''}
                    ${hasPendingRequests ? `<div class="relation-side-list"><div class="relation-card"><b>挂起事务</b><span>${htmlEscape([promotionReq !== '无' ? '晋升申请' : '', donateReq !== '无' ? '捐献申请' : '', questReq !== '无' ? '任务请求' : ''].filter(Boolean).join(' / ') || '无')}</span></div>${makeTimelineStack([
                      {
                        title: '晋升申请',
                        desc: promotionReq !== '无'
                          ? `${promotionReq} / ${toText(deepGet(snapshot, 'activeChar.promotion_request.target_title', '无'), '无')}`
                          : '无'
                      },
                      {
                        title: '捐献申请',
                        desc: donateReq !== '无'
                          ? `${donateReq} × ${toNumber(deepGet(snapshot, 'activeChar.donate_request.quantity', 1), 1)} / ${toText(deepGet(snapshot, 'activeChar.donate_request.target_faction', '无'), '无')}`
                          : '无'
                      },
                      {
                        title: '任务请求',
                        desc: questReq !== '无'
                          ? `${questReq} / ${toText(deepGet(snapshot, 'activeChar.quest_request.quest_name', '无'), '无')}`
                          : '无'
                      }
                    ].filter(i => i.desc !== '无'))}</div>` : ''}
                  </div>
                </div>
              ` : ''}
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">所属势力名册</div></div>
                ${makePaginatedTimelineSection(safeEntries(currentFactionEntry[1] && currentFactionEntry[1].mem).map(([memberName, memberInfo]) => ({ title: memberName, desc: `职位：${toText(memberInfo && memberInfo['职位'], '外围')}` })), '我的阵营详情', 'faction-members', [{ title: '暂无成员记录', desc: currentFactionName ? '当前所属势力尚未记录成员档案。' : '当前未加入可展示成员名册的势力。' }], 50)}
              </div>
              ${buildFactionAffairConsoleHtml(snapshot, currentFactionName)}
            </div>
          `
        };
      }

      if (previewKey === '本地据点详情' || previewKey === '当前节点详情' || previewKey.startsWith('地图节点：')) {
        const nodeName = previewKey.startsWith('地图节点：') ? previewKey.replace('地图节点：', '') : snapshot.currentLoc;
        const mapNode = resolveDisplayMapNode(snapshot, nodeName);
        const nodeInfo = resolveLocationData(snapshot.rootData, nodeName);
        const nodeStores = safeEntries(nodeInfo.data && nodeInfo.data.stores);
        const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
        const activeDisplayName = toText(deepGet(snapshot, 'activeChar.name', deepGet(snapshot, 'activeChar.base.name', snapshot.activeName)), snapshot.activeName);
        const localNpcEntries = safeEntries(deepGet(snapshot, 'rootData.char', {}))
          .filter(([name, char]) => {
            const displayName = toText(deepGet(char, 'name', deepGet(char, 'base.name', name)), name);
            if ((activeCharKey && name === activeCharKey) || (activeDisplayName && displayName === activeDisplayName)) return false;
            const npcLoc = toText(deepGet(char, 'status.loc', ''), '');
            return npcLoc ? isLocationCompatible(nodeName, npcLoc) : false;
          })
          .slice(0, 4);
        const primaryNpc = localNpcEntries[0]
          ? toText(deepGet(localNpcEntries[0][1], 'name', deepGet(localNpcEntries[0][1], 'base.name', localNpcEntries[0][0])), localNpcEntries[0][0])
          : '';
        const officialCommissionLocationName = ['锻造师协会', '制造师协会', '设计师协会', '修理师协会']
          .find(locationName => isLocationCompatible(nodeName, locationName) || isLocationCompatible(locationName, nodeName)) || '';
        const currentNodeLocFull = toText(deepGet(snapshot, 'activeChar.status.loc', snapshot.currentLoc), snapshot.currentLoc);
        const canDispatchHere = !!toText(currentNodeLocFull, '') && isLocationCompatible(nodeName, currentNodeLocFull);

        const localNpcCards = localNpcEntries.map(([name, char]) => ({
          title: toText(deepGet(char, 'name', deepGet(char, 'base.name', name)), name),
          desc: `${toText(deepGet(char, 'social.main_identity', '未知身份'), '未知身份')} / ${toText(deepGet(char, 'status.loc', '未知地点'), '未知地点')}`
        }));
        const actionButtons = canDispatchHere ? [
          ...(nodeStores.length ? [{ text: '前往商店', action: 'shop', target: nodeStores[0][0], className: 'live' }] : []),
          ...(officialCommissionLocationName ? [{ text: `进入${officialCommissionLocationName}官方工坊`, action: 'craft', executorType: 'official', className: 'live' }] : []),
          ...(primaryNpc ? [{ text: `与${primaryNpc}交易`, action: 'trade', npcTarget: primaryNpc, className: 'warn' }, { text: `委托${primaryNpc}工坊`, action: 'craft', npcTarget: primaryNpc, executorType: 'private', className: 'warn' }, { text: `与${primaryNpc}对话`, action: 'talk', npcTarget: primaryNpc, className: 'live' }, { text: `向${primaryNpc}请教`, action: 'intel', npcTarget: primaryNpc, className: '' }, { text: `向${primaryNpc}切磋`, action: 'battle', npcTarget: primaryNpc, className: 'warn' }] : []),
          ...(!primaryNpc ? [{ text: '打开工坊', action: 'craft', executorType: 'self', className: 'live' }] : [])
        ] : [];
        const isPlayerControlled = isSnapshotPlayerControlled(snapshot);
        const actionSummaryText = actionButtons.map(btn => btn.text).join(' / ');
        const actionCardTitle = isPlayerControlled ? '可执行操作' : '驻地操作概览';
        const actionButtonsHtml = isPlayerControlled
          ? (actionButtons.length
            ? `<div style="display:flex;flex-wrap:wrap;gap:8px;">${actionButtons.map(btn => `<button type="button" class="map-dispatch-action-btn ${htmlEscape(btn.className || '')}" data-action="${htmlEscape(btn.action || '')}" data-target="${htmlEscape(btn.target || nodeName)}" data-current-loc="${htmlEscape(nodeName)}" data-npc-target="${htmlEscape(btn.npcTarget || '')}" data-executor-type="${htmlEscape(btn.executorType || '')}" data-services="${htmlEscape(Array.isArray(btn.services) ? btn.services.join('|') : '')}" style="border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#fff;padding:8px 12px;border-radius:10px;cursor:pointer;">${htmlEscape(btn.text || '执行操作')}</button>`).join('')}</div>`
            : `<div class="relation-card"><b>${canDispatchHere ? '暂无可执行操作' : '尚未到达'}</b><span>${canDispatchHere ? '这里暂时没有能立刻发起的交易或互动。' : '你现在不在这里，先移动到该地点后，才能进行交易、工坊或社交互动。'}</span></div>`)
          : `<div class="relation-card"><b>旁观视角</b><span>${htmlEscape(actionSummaryText ? `当前为旁观视角，可见入口：${actionSummaryText}。这里能先查看驻地情形；若想交易、开工坊或社交，需要切回自己的行动视角。` : '当前为旁观视角，这里可以先查看驻地情形；若想交易、开工坊或社交，需要切回自己的行动视角。')}</span></div>`;
        const travelTags = (snapshot.mapTravelCandidates.length ? snapshot.mapTravelCandidates : snapshot.dynamicLocationNames).filter(name => name !== nodeName).slice(0, 6);
        return {
          title: `本地据点 / ${nodeName}`,
          summary: '当前节点的地图属性、势力资料与可去方向。',
          body: `
            <div class="archive-modal-grid">
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">据点概览</div></div>
                  ${makeTileGrid([
                    { label: '所在地点', value: nodeName },
                    { label: '掌控势力', value: toText(nodeInfo.data && nodeInfo.data['掌控势力'], '未知') },
                    { label: '常住人口', value: formatNumber(nodeInfo.data && nodeInfo.data['人口']) },
                    { label: '经济状况', value: toText(nodeInfo.data && nodeInfo.data['经济状况'], '未知') },
                    { label: '守护军团', value: toText(nodeInfo.data && nodeInfo.data['守护军团'], '无') },
                    { label: '商店数量', value: `${nodeStores.length} 处` },
                  ], 'two')}
                </div>
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">驻地状态</div></div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: center;">
                    ${(() => {
                      const getScore = (text) => {
                        if (!text || text === '未知') return 50;
                        if (/繁华|核心|极佳|充裕/.test(text)) return 95;
                        if (/良好|稳定|发展/.test(text)) return 75;
                        if (/一般|普通|常态/.test(text)) return 60;
                        if (/萧条|混乱|匮乏|危险/.test(text)) return 30;
                        if (/废弃|毁灭|荒芜|极危/.test(text)) return 10;
                        return 50;
                      };
                      const ecoText = toText(nodeInfo.data && nodeInfo.data['经济状况'], '未知');
                      const ecoScore = getScore(ecoText);
                      const popScore = Math.min(100, Math.max(10, Math.round(Math.log10(Math.max(1, toNumber(nodeInfo.data && nodeInfo.data['人口'], 1000))) * 15)));
                      const guardText = toText(nodeInfo.data && nodeInfo.data['守护军团'], '无');
                      const guardScore = guardText !== '无' ? (guardText.includes('精锐') || guardText.includes('主力') ? 95 : 70) : 20;
                      const tradeScore = nodeStores.length ? Math.min(100, 30 + nodeStores.length * 20) : 10;
                      return `
                        <div style="text-align: center; position: relative;">
                          ${makeRadarSvg(['经济状况', '常住人口', '守备力量', '贸易补给', '战略价值'], [ecoScore, popScore, guardScore, tradeScore, Math.round((ecoScore+popScore+guardScore+tradeScore)/4)])}
                        </div>
                      `;
                    })()}
                    <div class="relation-side-list">
                      <div class="relation-card" style="background:none;padding:0;border:none;"><b>综合评级</b><span style="color:var(--cyan); font-size: 16px; font-weight: bold;">${htmlEscape(toText(nodeInfo.data && nodeInfo.data['经济状况'], '未知'))}</span></div>
                      <div class="relation-card" style="background:none;padding:0;border:none;"><b>守备评估</b><span style="color:var(--color-text-primary);">${htmlEscape(toText(nodeInfo.data && nodeInfo.data['守护军团'], '无军团驻扎'))}</span></div>
                      <div class="relation-card" style="background:none;padding:0;border:none;"><b>补给节点</b><span style="color:var(--color-text-secondary);">${htmlEscape(nodeStores.length ? `${nodeStores.length} 处贸易站或设施` : '无可见商店')}</span></div>
                      <div class="relation-card" style="background:none;padding:0;border:none;"><b>地图简报</b><span style="color:var(--color-text-secondary); font-size: 12px; line-height: 1.4;">${htmlEscape(mapNode ? mapNode.desc : '无扫描数据')}</span></div>
                    </div>
                  </div>
                </div>
              ${localNpcCards.length > 0 ? `
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">${htmlEscape(actionCardTitle)}</div></div>
                  ${actionButtonsHtml}
                </div>
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">本地可接触人物</div></div>
                  ${makeTimelineStack(localNpcCards)}
                </div>
              ` : `
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">${htmlEscape(actionCardTitle)}</div></div>
                  ${actionButtonsHtml}
                  <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1); color: var(--color-text-secondary); font-size: 13px; text-align: center;">当前节点未扫描到可直接互动的本地角色。</div>
                </div>
              `}
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

      if (previewKey === '当前节点详情' || previewKey === '交易模块弹窗' || previewKey === '交易网络') {
        return {
          title: '交易与驻地信息',
          summary: '当前节点商店与可见库存。',
          body: '',
          onMount: (container) => {
            if (!isSnapshotPlayerControlled(snapshot)) {
              container.innerHTML = '<div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">旁观视角</div></div><div class="intel-layout"><div class="intel-card"><b>先看看这里的店铺动静</b><span>你现在不是自己的行动视角，可以先看看这里卖些什么；若想交易，切回自己的行动视角后再来。</span></div></div></div>';
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
                  { title: '最近播报', desc: toText(deepGet(snapshot, 'rootData.sys.rsn', '暂无'), '暂无') },
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
        const huntRequest = deepGet(snapshot, 'activeChar.hunt_request', {});
        const abyssKillRequest = deepGet(snapshot, 'activeChar.abyss_kill_request', {});
        const huntPendingAge = toNumber(huntRequest && huntRequest.killed_age, 0);
        const huntPendingText = huntPendingAge > 0 ? `${huntPendingAge}年${deepGet(snapshot, 'activeChar.hunt_request.is_ferocious', false) ? ' / 凶兽级' : ' / 常规目标'}` : '无待处理';
        const abyssKillTier = toText(abyssKillRequest && abyssKillRequest.kill_tier, '无');
        const abyssKillQty = Math.max(1, toNumber(abyssKillRequest && abyssKillRequest.quantity, 1));
        const abyssPendingText = abyssKillTier !== '无' ? `${abyssKillTier} × ${abyssKillQty}` : '无待处理';
        const trialTickets = (snapshot.inventoryEntries || []).filter(([name]) => /升灵台|魂灵塔/.test(name)).slice(0, 8);
        const ticketCards = trialTickets.length
          ? trialTickets.map(([name, item]) => ({ title: `${name} ×${toNumber(item && item['数量'], 0)}`, desc: toText(item && item['描述'], '可用于对应试炼场景。') }))
          : [{ title: '暂无试炼门票', desc: '当前背包中没有升灵台/魂灵塔门票。' }];
        return {
          title: '试炼与情报',
          summary: '当前试炼资源、待处理事项与近期风险情报。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">可前往试炼</div></div>
                ${makeTileGrid([
                  { label: '升灵台门票', value: String(snapshot.inventoryEntries.filter(([name]) => /升灵台/.test(name)).length) },
                  { label: '魂灵塔记录', value: `最高 ${toText(deepGet(snapshot, 'activeChar.tower_records.max_floor', 0), '0')} 层` },
                  { label: '塔层折扣', value: towerDiscountEntries.length ? `${towerDiscountEntries.length} 层可用` : '暂无' },
                  { label: '现实狩猎待处理', value: huntPendingText },
                  { label: '深渊战果待处理', value: abyssPendingText },
                  { label: '当前战功', value: formatNumber(deepGet(snapshot, 'activeChar.wealth.blood_pt', 0)) },
                  { label: '风险评估', value: snapshot.pendingIntelCount ? `${snapshot.worldAlert} / 线索 +${snapshot.pendingIntelImpact}` : snapshot.worldAlert }
                ])}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">试炼待处理事项</div><span class="state-tag ${huntPendingAge > 0 || abyssKillTier !== '无' ? 'warn' : 'live'}">${htmlEscape(huntPendingAge > 0 || abyssKillTier !== '无' ? '待处理' : '已整理')}</span></div>
                ${makeTileGrid([
                  { label: '现实狩猎', value: huntPendingText },
                  { label: '深渊战果', value: abyssPendingText },
                  { label: '处理方式', value: '系统自动整理' },
                  { label: '玩家操作', value: '无需额外提交' }
                ])}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">魂灵塔 / 升灵台概览</div><span class="state-tag live">概览</span></div>
                <div class="intel-layout">
                  <div class="intel-card">
                    <b>试炼概况</b>
                    <span>${htmlEscape('这里整理了你当前持有的门票、可用折扣层与已记录的试炼进度。')}</span>
                  </div>
                </div>
                ${makeTimelineStack(ticketCards)}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">已掌握情报</div></div>
                <div class="intel-cabinet">
                  ${(snapshot.unlockedKnowledges.length ? snapshot.unlockedKnowledges.slice(-4).reverse() : ['情报仍待收集']).map(item => `<div class="intel-card"><b>${htmlEscape(item)}</b><span>${htmlEscape(item)}</span></div>`).join('')}
                </div>
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">魂灵塔折扣资格</div></div>
                ${makeTimelineStack(towerDiscountEntries.length ? towerDiscountEntries.slice(0, 10).map(([floor]) => ({ title: `${floor} 层`, desc: '五折资格未使用' })) : [{ title: '暂无折扣资格', desc: '当前未记录可用五折层。' }])}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '任务界面') {
        const questRecords = (snapshot.recordEntries || []).filter(([, item]) => item && typeof item === 'object' && (
          Object.prototype.hasOwnProperty.call(item, '状态')
          || Object.prototype.hasOwnProperty.call(item, '目标进度')
          || Object.prototype.hasOwnProperty.call(item, '奖励币')
          || Object.prototype.hasOwnProperty.call(item, '奖励声望')
        ));
        const questBoardEntries = safeEntries(deepGet(snapshot, 'rootData.world.quest_board', {})).filter(([, item]) => item && typeof item === 'object');
        const questPage = paginateModalItems(questRecords, previewKey, 'quest-records', 6);
        const boardPage = paginateModalItems(questBoardEntries, previewKey, 'quest-board', 6);
        const questFocusStateKey = `${previewKey}::quest-focus`;
        const boardFocusStateKey = `${previewKey}::quest-board-focus`;
        let focusQuestName = toText(modalFocusState[questFocusStateKey], toText((questRecords[0] && questRecords[0][0]) || '', ''));
        if (focusQuestName && !questRecords.some(([name]) => name === focusQuestName)) focusQuestName = questRecords[0] ? questRecords[0][0] : '';
        if (focusQuestName) modalFocusState[questFocusStateKey] = focusQuestName;
        else delete modalFocusState[questFocusStateKey];
        let focusBoardId = toText(modalFocusState[boardFocusStateKey], toText((questBoardEntries[0] && questBoardEntries[0][0]) || '', ''));
        if (focusBoardId && !questBoardEntries.some(([name]) => name === focusBoardId)) focusBoardId = questBoardEntries[0] ? questBoardEntries[0][0] : '';
        if (focusBoardId) modalFocusState[boardFocusStateKey] = focusBoardId;
        else delete modalFocusState[boardFocusStateKey];
        const focusQuestEntry = focusQuestName ? questRecords.find(([name]) => name === focusQuestName) : null;
        const focusBoardEntry = focusBoardId ? questBoardEntries.find(([name]) => name === focusBoardId) : null;
        const isPlayerControlled = isSnapshotPlayerControlled(snapshot);
        const focusQuest = focusQuestEntry && focusQuestEntry[1];
        const focusBoard = focusBoardEntry && focusBoardEntry[1];
        const focusQuestStatus = toText(focusQuest && focusQuest['状态'], '进行中');
        const focusBoardStatus = toText(focusBoard && focusBoard['状态'], '待接取');
        const focusBoardDesc = focusBoard
          ? (focusBoardStatus === '待接取' ? toText(focusBoard['框架描述'], '该委托当前只公开任务框架，接取后才会披露详细目标。') : toText(focusBoard['描述'], toText(focusBoard['框架描述'], '无附加说明')))
          : '当前没有选中的委托说明。';
        const questListHtml = questPage.items.length
          ? questPage.items.map(([name, item]) => {
              const status = toText(item && item['状态'], '进行中');
              const progress = `${toNumber(item && item['当前进度'], 0)}/${toNumber(item && item['目标进度'], 1)}`;
              const badgeClass = status === '已完成' ? 'live' : (status === '已放弃' ? 'warn' : '');
              return `
                <button type="button" class="role-switch-tile ${name === focusQuestName ? 'active' : ''}" data-quest-focus="${escapeHtmlAttr(name)}" style="text-align:left;">
                  <div class="role-switch-head" style="margin-bottom:6px;font-size:15px;"><b>${htmlEscape(name)}</b><span class="state-tag ${badgeClass}">${htmlEscape(status)}</span></div>
                  <div style="display:grid;gap:4px;">
                    <span>${htmlEscape(`进度：${progress}`)}</span>
                    <span>${htmlEscape(`奖励：${formatNumber(toNumber(item && item['奖励币'], 0))} 币 / ${formatNumber(toNumber(item && item['奖励声望'], 0))} 声望`)}</span>
                    <span>${htmlEscape(toText(item && item['描述'], '无说明'))}</span>
                  </div>
                </button>
              `;
            }).join('')
          : '<div style="padding: 12px 16px; color: var(--color-text-secondary); text-align: center; font-size: 13px;">暂无任务记录，当前没有可追踪的任务档案。</div>';
        const boardListHtml = boardPage.items.length
          ? boardPage.items.map(([id, item]) => {
              const title = toText(item && item['标题'], id);
              const status = toText(item && item['状态'], '待接取');
              const publisher = toText(item && item['发布者'], '系统');
              const badgeClass = status === '待接取' ? 'live' : (status === '进行中' || status === '可提交' ? 'warn' : '');
              return `
                <button type="button" class="role-switch-tile ${id === focusBoardId ? 'active' : ''}" data-quest-board-focus="${escapeHtmlAttr(id)}" style="text-align:left;">
                  <div class="role-switch-head" style="margin-bottom:6px;font-size:15px;"><b>${htmlEscape(title)}</b><span class="state-tag ${badgeClass}">${htmlEscape(status)}</span></div>
                  <div style="display:grid;gap:4px;">
                    <span>${htmlEscape(`发布者：${publisher}`)}</span>
                    <span>${htmlEscape(`难度：${toText(item && item['难度'], '中')} / 资源：${toText(item && item['资源级别'], '无')}`)}</span>
                    <span>${htmlEscape(`奖励：${formatNumber(toNumber(item && item['奖励币'], 0))} 币 / ${formatNumber(toNumber(item && item['奖励声望'], 0))} 声望`)}</span>
                  </div>
                </button>
              `;
            }).join('')
          : '<div style="padding: 12px 16px; color: var(--color-text-secondary); text-align: center; font-size: 13px;">暂无委托，当前世界中没有可浏览的公开委托。</div>';
        const questDetailHtml = focusQuest
          ? `
              ${makeTileGrid([
                { label: '任务名称', value: focusQuestName },
                { label: '状态', value: focusQuestStatus },
                { label: '任务类型', value: toText(focusQuest['类型'], '任务') },
                { label: '奖励金币', value: formatNumber(toNumber(focusQuest['奖励币'], 0)) },
                { label: '奖励声望', value: formatNumber(toNumber(focusQuest['奖励声望'], 0)) }
              ], 'two')}
              <div style="margin-top: 16px;">
                <div style="font-size: 11px; color: var(--color-text-secondary); margin-bottom: 6px; font-weight: 500;">当前进度 <span style="float: right; color: var(--cyan);">${toNumber(focusQuest['当前进度'], 0)} / ${toNumber(focusQuest['目标进度'], 1)}</span></div>
                <div style="height: 6px; background: rgba(0, 229, 255, 0.1); border-radius: 3px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);">
                  <div style="height: 100%; background: linear-gradient(90deg, rgba(0,229,255,0.6), rgba(0,229,255,1)); width: ${ratioPercent(toNumber(focusQuest['当前进度'], 0), toNumber(focusQuest['目标进度'], 1))}%; border-radius: 3px; box-shadow: 0 0 8px rgba(0,229,255,0.8); transition: width 0.3s ease;"></div>
                </div>
              </div>
            `
          : makeTileGrid([{ label: '状态', value: '当前未选中任何任务' }], 'two');
        const questActionHtml = focusQuest && isPlayerControlled && !['已完成', '已放弃', '失败', '已失败'].includes(focusQuestStatus)
          ? `
              <div class="request-console-row" style="display:flex; gap:8px; flex-wrap:wrap; margin-top:16px;">
                ${focusQuestStatus === '可提交' ? `<button type="button" class="relation-action-btn quest-action-btn" data-quest-action="submit" data-quest-target="${escapeHtmlAttr(focusQuestName)}">提交任务</button>` : ''}
                <button type="button" class="relation-action-btn quest-action-btn" data-quest-action="abandon" data-quest-target="${escapeHtmlAttr(focusQuestName)}">放弃任务</button>
              </div>
            `
          : (focusQuest ? `<div style="margin-top:16px; font-size:12px; color: var(--color-text-secondary);">${htmlEscape(isPlayerControlled ? '当前任务已归档，暂无可执行操作。' : '当前为旁观视角，仅可查看任务状态。')}</div>` : '');
        const boardDetailHtml = focusBoard
          ? makeTileGrid([
              { label: '委托标题', value: toText(focusBoard['标题'], focusBoardId) },
              { label: '状态', value: focusBoardStatus },
              { label: '发布者', value: toText(focusBoard['发布者'], '系统') },
              { label: '面向', value: toText(focusBoard['面向'], '公开') },
              { label: '承接者', value: toText(focusBoard['承接者'], '无') },
              { label: '预计阶段', value: formatNumber(toNumber(focusBoard['目标进度'], 1)) },
              { label: '难度 / 资源', value: `${toText(focusBoard['难度'], '中')} / ${toText(focusBoard['资源级别'], '无')}` },
              { label: '奖励金币', value: formatNumber(toNumber(focusBoard['奖励币'], 0)) },
              { label: '奖励声望', value: formatNumber(toNumber(focusBoard['奖励声望'], 0)) }
            ], 'two')
          : makeTileGrid([{ label: '状态', value: '当前未选中任何委托' }], 'two');
        const boardActionHtml = focusBoard && isPlayerControlled && focusBoardStatus === '待接取'
          ? `
              <div style="margin-top:16px; padding:12px 14px; border:1px dashed rgba(255,255,255,0.12); border-radius:12px; background:rgba(255,255,255,0.02);">
                <div style="font-size:12px; color:var(--color-text-secondary); margin-bottom:10px;">接取前仅公开任务框架，接取后才会由 AI 展开具体目标与执行细节。</div>
                <button type="button" class="relation-action-btn quest-action-btn" data-quest-action="accept" data-quest-target="${escapeHtmlAttr(focusBoardId)}">接取委托</button>
              </div>
            `
          : (focusBoard ? `<div style="margin-top:16px; font-size:12px; color: var(--color-text-secondary);">${htmlEscape(isPlayerControlled ? '该委托当前不可接取，详情以任务记录为准。' : '当前为旁观视角，仅可查看委托框架。')}</div>` : '');
        return {
          title: '任务界面',
          summary: '我的任务记录与世界委托板。',
          body: `
            <div class="archive-modal-grid">
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">我的任务</div><span class="state-tag ${questRecords.length ? 'live' : 'warn'}">${questRecords.length ? `共 ${questRecords.length} 条` : '空'}</span></div>
                  <div class="relation-directory-grid">${questListHtml}</div>
                  ${makeModalPaginationControls('quest-records', questPage.page, questPage.totalPages, questPage.total)}
                </div>
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">焦点任务详情</div><span class="state-tag ${focusQuestName ? 'live' : 'warn'}">${htmlEscape(focusQuestName || '未选中')}</span></div>
                  ${questDetailHtml}
                  ${questActionHtml}
                  <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1);">
                    <div style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 4px;">任务说明</div>
                    <div style="font-size: 14px; line-height: 1.5; color: var(--color-text-primary);">${htmlEscape(focusQuest ? toText(focusQuest['描述'], '无附加说明') : '当前没有选中的任务说明。')}</div>
                  </div>
                </div>
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">委托板</div><span class="state-tag ${questBoardEntries.length ? 'live' : 'warn'}">${questBoardEntries.length ? `共 ${questBoardEntries.length} 条` : '空'}</span></div>
                  <div class="relation-directory-grid">${boardListHtml}</div>
                  ${makeModalPaginationControls('quest-board', boardPage.page, boardPage.totalPages, boardPage.total)}
                </div>
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">焦点委托详情</div><span class="state-tag ${focusBoardId ? 'live' : 'warn'}">${htmlEscape(focusBoardId || '未选中')}</span></div>
                  ${boardDetailHtml}
                  ${boardActionHtml}
                  <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1);">
                    <div style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 4px;">${htmlEscape(focusBoardStatus === '待接取' ? '委托框架' : '委托说明')}</div>
                    <div style="font-size: 14px; line-height: 1.5; color: var(--color-text-primary);">${htmlEscape(focusBoardDesc)}</div>
                  </div>
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

    async function refreshLiveSnapshot(options = {}) {
      try {
        if (shouldPauseLiveRefresh(options)) {
          pendingLiveRefresh = true;
          return;
        }
        const vars = await getAllVariablesSafe();
        const root = resolveRootData(vars);
        if (!root) return;
        const effective = buildEffectiveSd(root);
        if (!effective.rootData) return;
        syncMvuEditorStoreFromRoot(effective.rootData);
        liveSnapshot = buildSnapshot(effective.rootData);
        renderHeader(liveSnapshot);
        renderLiveCards(liveSnapshot);
        
        const isCombatActive = !!deepGet(liveSnapshot, 'rootData.world.combat.is_active');
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
      bindInlineEditing();
      await waitForMvuReady();
      await refreshLiveSnapshot();
      bindMvuUpdates(refreshLiveSnapshot);
    }

    function buildRingHoverMarkup(ring) {
      const skills = (ring.skills || []).map(skill => `
        <div class="ring-hover-skill">
          <b>${htmlEscape(skill.name || '未命名技能')}</b>
          <div class="ring-hover-copy"><em>画面描述</em><span>${skill.visualDesc || '未知'}</span></div>
          <div class="ring-hover-copy"><em>效果描述</em><span>${skill.effectDesc || '未知'}</span></div>
        </div>
      `).join('');

      return `<div class="ring-hover-card"><div class="ring-hover-title">${ring.title}</div><div class="ring-hover-desc">${ring.desc}</div>${skills}</div>`;
    }

    function buildSpiritRingGrid(rings, fallbackClass = 'ring-white') {
      const normalized = [...(rings || [])].filter(ring => ring && !ring.empty && ring.glyph && ring.glyph !== '空');
      if (!normalized.length) return '';
      return normalized.slice(0, 10).map(ring => {
        return `<div class="ring ${ring.ringClass || fallbackClass} interactive-ring">${ring.glyph}${buildRingHoverMarkup(ring)}</div>`;
      }).join('');
    }

    function buildRingHoverMarkup(ring) {
      const skills = (ring && Array.isArray(ring.skills) ? ring.skills : []).map(skill => `
        <div class=\"ring-hover-skill ${skill && skill.preview ? 'clickable' : ''}\"${skill && skill.preview ? ` data-preview=\"${escapeHtmlAttr(skill.preview)}\"` : ''}>
          <b>${htmlEscape(skill && skill.name ? skill.name : '未命名技能')}</b>
          <div class=\"ring-hover-copy\"><em>画面描述</em><span>${htmlEscape(skill && skill.visualDesc ? skill.visualDesc : '未知')}</span></div>
          <div class=\"ring-hover-copy\"><em>效果描述</em><span>${htmlEscape(skill && skill.effectDesc ? skill.effectDesc : '未知')}</span></div>
        </div>
      `).join('');

      return `<div class=\"ring-hover-card\"><div class=\"ring-hover-title\">${htmlEscape(toText(ring && ring.title, '魂环技能'))}</div><div class=\"ring-hover-desc\">${htmlEscape(toText(ring && ring.desc, ''))}</div>${skills}</div>`;
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

      tabs.forEach(t => t.classList.toggle('active', t.dataset.target === targetId));
      pages.forEach(p => {
        const pageTarget = p.dataset && p.dataset.target ? p.dataset.target : p.id;
        p.classList.toggle('active', pageTarget === targetId);
      });

      if (viewport) viewport.classList.add('split-hidden');
      if (splitOverlay) {
        splitOverlay.classList.add('active');
        splitOverlay.classList.toggle('archive-mode', targetId === 'page-archive');
        splitOverlay.classList.toggle('map-mode', targetId === 'page-map');
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
            <div class="meta-item"><b>触发方式</b><span>${cell.dataset.hoverTrigger || '--'}</span></div>
            <div class="meta-item"><b>有效期至</b><span>${cell.dataset.hoverExpiry || '--'}</span></div>
            <div class="meta-item"><b>来源</b><span>${cell.dataset.hoverSource || '--'}</span></div>
            <div class="meta-item"><b>说明</b><span>${cell.dataset.hoverUsage || '--'}</span></div>
          </div>
          <div class="inventory-hover-tags">${tags.filter(Boolean).map(tag => `<span class="tag-chip">${tag}</span>`).join('')}</div>
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
      const chars = deepGet(snapshot, 'rootData.char', {});
      if (!wanted || !chars || typeof chars !== 'object') return '';
      if (chars[wanted]) return wanted;
      for (const [charKey, charInfo] of Object.entries(chars)) {
        const displayName = toText(charInfo && (charInfo.name || deepGet(charInfo, 'base.name', '')), charKey);
        if (displayName === wanted) return charKey;
      }
      return '';
    }

    function resolveSnapshotCharacter(snapshot, rawName) {
      const key = resolveSnapshotCharKey(snapshot, rawName);
      const chars = deepGet(snapshot, 'rootData.char', {});
      const charInfo = key && chars && typeof chars === 'object' ? (chars[key] || null) : null;
      const displayName = charInfo
        ? toText(charInfo && (charInfo.name || deepGet(charInfo, 'base.name', '')), key)
        : toText(rawName, '');
      return { key, displayName, char: charInfo };
    }

    function normalizeLocForMatch(location) {
      const raw = toText(location, '').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '').trim();
      const segments = raw.split('-').filter(Boolean);
      return {
        raw,
        leaf: segments[segments.length - 1] || raw,
        segments
      };
    }

    function isLocationCompatible(currentLoc, targetLoc) {
      const current = normalizeLocForMatch(currentLoc);
      const target = normalizeLocForMatch(targetLoc);
      if (!current.raw || !target.raw) return current.raw === target.raw;
      if (current.raw === target.raw || current.leaf === target.leaf) return true;
      return current.segments.some(seg => target.segments.includes(seg));
    }

    function buildRelationInteractRequest(snapshot, actionType, rawTargetName, options = {}) {
      const currentLoc = toText(snapshot && snapshot.currentLoc, '未知地点');
      return buildMapInteractDispatchRequest(snapshot, {
        action: actionType,
        npcTarget: rawTargetName,
        target: currentLoc,
        currentLoc,
        itemUsed: toText(options.itemUsed, '无'),
        sourceLabel: '人物关系页社交互动',
        sourceAnalysis: 'Relation interaction initialized from relation panel.'
      });
    }

    function buildRelationBattleInitRequest(snapshot, rawTargetName) {
      const currentLoc = toText(snapshot && snapshot.currentLoc, '未知地点');
      return buildMapBattleInitRequest(snapshot, { npcTarget: rawTargetName, target: currentLoc, currentLoc });
    }


    function buildKnowledgeUnlockDispatchRequest(snapshot, options = {}) {
      if (!snapshot || !snapshot.rootData) return null;
      if (!isSnapshotPlayerControlled(snapshot)) return null;
      const activeKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
      if (!activeKey) return null;
      const chars = deepGet(snapshot, 'rootData.char', {});
      const activeChar = chars && typeof chars === 'object' ? (chars[activeKey] || {}) : {};
      const activeName = toText(activeChar && (activeChar.name || deepGet(activeChar, 'base.name', '')), toText(snapshot.activeName, activeKey));
      const currentLoc = toText(deepGet(activeChar, 'status.loc', snapshot.currentLoc || '当前位置'), snapshot.currentLoc || '当前位置').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '');
      const content = toText(options.content, '').trim();
      const impact = Math.max(0, Math.min(10, Math.floor(toNumber(options.impact, 0))));
      if (!content || content === '无') return null;

      const patchOps = [
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/knowledge_unlock_request`, value: { content, impact } },
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/status/action`, value: '情报整理' },
        { op: 'replace', path: '/sys/rsn', value: `[情报整理] ${activeName} 在【${currentLoc}】整理了线索：${content}。` }
      ];

      const systemPrompt = `以下内容属于前端已经完成的情报整理请求初始化，不要在正文直接复述“JSONPatch / 系统分析 / 仲裁日志”等术语。

[情报整理] ${activeName} 在【${currentLoc}】准备整理一条新线索：${content}。

[整理要求]
你必须保留 knowledge_unlock_request.content = ${content} 与 impact = ${impact} 这两个字段；impact 需保持在 0 到 10 之间。请将这次整理过程转写为自然剧情，并在合适时完成情报解锁与世界线偏差结算。

[MVU变量更新数据]
<UpdateVariable>
<Analysis>Knowledge unlock request initialized from intel panel.</Analysis>
<JSONPatch>
${JSON.stringify(patchOps, null, 2)}
</JSONPatch>
</UpdateVariable>`;

      return {
        playerInput: `我想在【${currentLoc}】整理关于【${content}】的情报线索。`,
        systemPrompt,
        requestKind: 'knowledge_unlock_request'
      };
    }




    function buildHuntDispatchRequest(snapshot, options = {}) {
      if (!snapshot || !snapshot.rootData) return null;
      if (!isSnapshotPlayerControlled(snapshot)) return null;
      const activeKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
      if (!activeKey) return null;
      const chars = deepGet(snapshot, 'rootData.char', {});
      const activeChar = chars && typeof chars === 'object' ? (chars[activeKey] || {}) : {};
      const activeName = toText(activeChar && (activeChar.name || deepGet(activeChar, 'base.name', '')), toText(snapshot.activeName, activeKey));
      const currentLoc = toText(deepGet(activeChar, 'status.loc', snapshot.currentLoc || '当前位置'), snapshot.currentLoc || '当前位置').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '');
      const killedAge = Math.max(1, Math.floor(toNumber(options.killedAge, 0)));
      const isFerocious = !!options.isFerocious;
      if (killedAge <= 0) return null;

      const patchOps = [
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/hunt_request`, value: { killed_age: killedAge, is_ferocious: isFerocious } },
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/status/action`, value: '狩猎中' },
        { op: 'replace', path: '/sys/rsn', value: `[现实狩猎] ${activeName} 在【${currentLoc}】完成了一次${killedAge}年魂兽狩猎${isFerocious ? '（凶兽级）' : ''}。` }
      ];

      const systemPrompt = `以下内容属于前端已经完成的现实狩猎请求初始化，不要在正文直接复述“JSONPatch / 系统分析 / 仲裁日志”等术语。

[现实狩猎] ${activeName} 在【${currentLoc}】击杀了一只约 ${killedAge} 年魂兽${isFerocious ? '，并判定为十万年/凶兽级目标' : ''}。

[结算要求]
你必须保留 hunt_request.killed_age = ${killedAge} 与 is_ferocious = ${isFerocious ? 'true' : 'false'} 这两个字段，使 MVU 后续能够正确生成魂环、魂骨、世界偏差与相关掉落。

[MVU变量更新数据]
<UpdateVariable>
<Analysis>Hunt request initialized from trial panel.</Analysis>
<JSONPatch>
${JSON.stringify(patchOps, null, 2)}
</JSONPatch>
</UpdateVariable>`;

      return {
        playerInput: `我想结算一场在【${currentLoc}】进行的现实狩猎，目标年限约为【${killedAge}年】${isFerocious ? '，属于十万年/凶兽级目标。' : '。'}`,
        systemPrompt,
        requestKind: 'hunt_request'
      };
    }

    function buildAbyssKillDispatchRequest(snapshot, options = {}) {
      if (!snapshot || !snapshot.rootData) return null;
      if (!isSnapshotPlayerControlled(snapshot)) return null;
      const activeKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
      if (!activeKey) return null;
      const killTier = toText(options.killTier, '');
      const quantity = Math.max(1, Math.floor(toNumber(options.quantity, 1)));
      if (!['低阶生物', '中阶生物', '高阶生物', '深渊王者'].includes(killTier)) return null;
      const chars = deepGet(snapshot, 'rootData.char', {});
      const activeChar = chars && typeof chars === 'object' ? (chars[activeKey] || {}) : {};
      const activeName = toText(activeChar && (activeChar.name || deepGet(activeChar, 'base.name', '')), toText(snapshot.activeName, activeKey));
      const currentLoc = toText(deepGet(activeChar, 'status.loc', snapshot.currentLoc || '当前位置'), snapshot.currentLoc || '当前位置').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '');

      const patchOps = [
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/abyss_kill_request`, value: { kill_tier: killTier, quantity } },
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/status/action`, value: '深渊作战' },
        { op: 'replace', path: '/sys/rsn', value: `[深渊战功上报] ${activeName} 在【${currentLoc}】上报击杀：${killTier} × ${quantity}。` }
      ];

      const systemPrompt = `以下内容属于前端已经完成的深渊战功上报请求初始化，不要在正文直接复述“JSONPatch / 系统分析 / 仲裁日志”等术语。

[深渊战功上报] ${activeName} 在【${currentLoc}】上报击杀：${killTier} × ${quantity}。

[结算要求]
你必须保留 abyss_kill_request.kill_tier = ${killTier} 与 quantity = ${quantity}，使 MVU 后续能够正确发放战功。

[MVU变量更新数据]
<UpdateVariable>
<Analysis>Abyss kill request initialized from trial panel.</Analysis>
<JSONPatch>
${JSON.stringify(patchOps, null, 2)}
</JSONPatch>
</UpdateVariable>`;

      return {
        playerInput: `我想上报在【${currentLoc}】击杀的深渊生物战果：${killTier} × ${quantity}。`,
        systemPrompt,
        requestKind: 'abyss_kill_request'
      };
    }

    function getFactionContributionValue(snapshot, factionName) {
      const fac = toText(factionName, '');
      if (fac === '史莱克学院') return toNumber(deepGet(snapshot, 'activeChar.wealth.shrek_pt', 0), 0);
      if (fac === '战神殿' || fac === '血神军团' || fac === '联邦军方') return toNumber(deepGet(snapshot, 'activeChar.wealth.blood_pt', 0), 0);
      return toNumber(deepGet(snapshot, 'activeChar.wealth.tang_pt', 0), 0);
    }

    function buildPromotionDispatchRequest(snapshot, options = {}) {
      if (!snapshot || !snapshot.rootData) return null;
      if (!isSnapshotPlayerControlled(snapshot)) return null;
      const activeKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
      if (!activeKey) return null;
      const targetFaction = toText(options.targetFaction, '').trim();
      const targetTitle = toText(options.targetTitle, '').trim();
      if (!targetFaction || !targetTitle || targetFaction === '无' || targetTitle === '无') return null;
      const chars = deepGet(snapshot, 'rootData.char', {});
      const activeChar = chars && typeof chars === 'object' ? (chars[activeKey] || {}) : {};
      const activeName = toText(activeChar && (activeChar.name || deepGet(activeChar, 'base.name', '')), toText(snapshot.activeName, activeKey));
      const currentLoc = toText(deepGet(activeChar, 'status.loc', snapshot.currentLoc || '当前位置'), snapshot.currentLoc || '当前位置').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '');
      const patchOps = [
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/promotion_request`, value: { target_faction: targetFaction, target_title: targetTitle } },
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/status/action`, value: '阵营事务' },
        { op: 'replace', path: '/sys/rsn', value: `[晋升申请] ${activeName} 在【${currentLoc}】申请【${targetFaction} - ${targetTitle}】。` }
      ];
      const contribution = getFactionContributionValue(snapshot, targetFaction);
      const systemPrompt = `以下内容属于前端已经完成的势力晋升申请初始化，不要在正文直接复述“JSONPatch / 系统分析 / 仲裁日志”等术语。

[晋升申请] ${activeName} 在【${currentLoc}】申请晋升为【${targetFaction} - ${targetTitle}】。

[申请参考]
当前等级：${toNumber(deepGet(activeChar, 'stat.lv', 0), 0)} / 斗铠：${toNumber(deepGet(activeChar, 'equip.armor.lv', 0), 0)} / 机甲：${toText(deepGet(activeChar, 'equip.mech.lv', '无'), '无')} / 当前贡献池：${contribution}
你必须保留 promotion_request.target_faction = ${targetFaction} 与 target_title = ${targetTitle}，使 MVU 后续能够按既定门槛完成晋升审核。

[MVU变量更新数据]
<UpdateVariable>
<Analysis>Promotion request initialized from faction panel.</Analysis>
<JSONPatch>
${JSON.stringify(patchOps, null, 2)}
</JSONPatch>
</UpdateVariable>`;
      return {
        playerInput: `我想向【${targetFaction}】申请晋升为【${targetTitle}】。`,
        systemPrompt,
        requestKind: 'promotion_request'
      };
    }

    function buildDonateDispatchRequest(snapshot, options = {}) {
      if (!snapshot || !snapshot.rootData) return null;
      if (!isSnapshotPlayerControlled(snapshot)) return null;
      const activeKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
      if (!activeKey) return null;
      const itemName = toText(options.itemName, '').trim();
      const targetFaction = toText(options.targetFaction, '').trim();
      const quantity = Math.max(1, Math.floor(toNumber(options.quantity, 1)));
      if (!itemName || !targetFaction || itemName === '无' || targetFaction === '无') return null;
      const ownedCount = toNumber(deepGet(snapshot, ['activeChar', 'inventory', itemName, '数量'], 0), 0);
      if (ownedCount < quantity) return null;
      const chars = deepGet(snapshot, 'rootData.char', {});
      const activeChar = chars && typeof chars === 'object' ? (chars[activeKey] || {}) : {};
      const activeName = toText(activeChar && (activeChar.name || deepGet(activeChar, 'base.name', '')), toText(snapshot.activeName, activeKey));
      const currentLoc = toText(deepGet(activeChar, 'status.loc', snapshot.currentLoc || '当前位置'), snapshot.currentLoc || '当前位置').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '');
      const patchOps = [
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/donate_request`, value: { item_name: itemName, target_faction: targetFaction, quantity } },
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/status/action`, value: '捐献物资' },
        { op: 'replace', path: '/sys/rsn', value: `[物资捐献申请] ${activeName} 在【${currentLoc}】准备向【${targetFaction}】提交【${itemName}】×${quantity}。` }
      ];
      const systemPrompt = `以下内容属于前端已经完成的物资捐献请求初始化，不要在正文直接复述“JSONPatch / 系统分析 / 仲裁日志”等术语。

[物资捐献申请] ${activeName} 在【${currentLoc}】准备向【${targetFaction}】提交【${itemName}】×${quantity}。

[申请参考]
背包库存：${ownedCount} 件。
你必须保留 donate_request.item_name = ${itemName}、target_faction = ${targetFaction}、quantity = ${quantity}，使 MVU 后续能够正确扣除物品并发放贡献点。

[MVU变量更新数据]
<UpdateVariable>
<Analysis>Donate request initialized from faction panel.</Analysis>
<JSONPatch>
${JSON.stringify(patchOps, null, 2)}
</JSONPatch>
</UpdateVariable>`;
      return {
        playerInput: `我想向【${targetFaction}】捐献【${itemName}】×${quantity}。`,
        systemPrompt,
        requestKind: 'donate_request'
      };
    }

    function buildQuestDispatchRequest(snapshot, actionType, options = {}) {
      if (!snapshot || !snapshot.rootData) return null;
      if (!isSnapshotPlayerControlled(snapshot)) return null;
      const activeKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
      if (!activeKey) return null;
      const questName = toText(options.questName, '').trim();
      if (!questName || questName === '无') return null;

      const chars = deepGet(snapshot, 'rootData.char', {});
      const activeChar = chars && typeof chars === 'object' ? (chars[activeKey] || {}) : {};
      const activeName = toText(activeChar && (activeChar.name || deepGet(activeChar, 'base.name', '')), toText(snapshot.activeName, activeKey));
      const currentLoc = toText(deepGet(activeChar, 'status.loc', snapshot.currentLoc || '当前位置'), snapshot.currentLoc || '当前位置').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '');
      const boardEntry = deepGet(snapshot, ['rootData', 'world', 'quest_board', questName], null);
      const recordEntry = deepGet(snapshot, ['activeChar', 'records', questName], null);
      const boardTitle = toText(boardEntry && boardEntry['标题'], questName);
      const boardFrameDesc = toText(boardEntry && boardEntry['框架描述'], '无');
      const boardHiddenDesc = toText(boardEntry && boardEntry['描述'], boardFrameDesc);
      const boardStatus = toText(boardEntry && boardEntry['状态'], '待接取');
      const recordStatus = toText(recordEntry && recordEntry['状态'], '进行中');

      let questAction = '';
      let questDesc = '';
      let requiredCount = 1;
      let rewardCoin = 0;
      let rewardRep = 0;
      let progressAdd = Math.max(1, Math.floor(toNumber(options.progressAdd, 1)));
      let statusAction = '任务处理中';
      let requestLabel = '';
      let analysisLabel = '';
      let playerInput = '';
      let extraRequirement = '';

      if (actionType === 'accept') {
        if (!boardEntry || boardStatus !== '待接取') return null;
        questAction = '接取';
        questDesc = boardHiddenDesc !== '无' ? boardHiddenDesc : boardFrameDesc;
        requiredCount = Math.max(1, Math.floor(toNumber(boardEntry && boardEntry['目标进度'], 1)));
        rewardCoin = Math.max(0, Math.floor(toNumber(boardEntry && boardEntry['奖励币'], 0)));
        rewardRep = Math.max(0, Math.floor(toNumber(boardEntry && boardEntry['奖励声望'], 0)));
        statusAction = '接取委托';
        requestLabel = `[任务接取申请] ${activeName} 在【${currentLoc}】准备接取委托【${boardTitle}】。`;
        analysisLabel = 'Quest accept request initialized from task panel.';
        playerInput = `我想接取委托板上的【${boardTitle}】。`;
        extraRequirement = `这是一个接取前只公开框架的委托。你现在可以在剧情里正常披露详细目标，但必须保留 quest_request.quest_desc = ${questDesc}、required_count = ${requiredCount}、reward_coin = ${rewardCoin}、reward_rep = ${rewardRep}。`;
      } else if (actionType === 'submit') {
        if (!recordEntry || ['已完成', '已放弃', '失败', '已失败'].includes(recordStatus)) return null;
        questAction = '提交';
        questDesc = toText(recordEntry && recordEntry['描述'], '无');
        requiredCount = Math.max(1, Math.floor(toNumber(recordEntry && recordEntry['目标进度'], 1)));
        rewardCoin = Math.max(0, Math.floor(toNumber(recordEntry && recordEntry['奖励币'], 0)));
        rewardRep = Math.max(0, Math.floor(toNumber(recordEntry && recordEntry['奖励声望'], 0)));
        progressAdd = 0;
        statusAction = '提交任务';
        requestLabel = `[任务提交申请] ${activeName} 在【${currentLoc}】准备提交任务【${questName}】。`;
        analysisLabel = 'Quest submit request initialized from task panel.';
        playerInput = `我想提交当前任务【${questName}】。`;
        extraRequirement = '你必须保留 quest_request.action = 提交，并保留 quest_name、quest_desc、required_count、reward_coin、reward_rep 这些字段，使 MVU 后续可以按进度进行结算。';
      } else if (actionType === 'abandon') {
        if (!recordEntry || ['已完成', '已放弃', '失败', '已失败'].includes(recordStatus)) return null;
        questAction = '放弃';
        questDesc = toText(recordEntry && recordEntry['描述'], '无');
        requiredCount = Math.max(1, Math.floor(toNumber(recordEntry && recordEntry['目标进度'], 1)));
        rewardCoin = Math.max(0, Math.floor(toNumber(recordEntry && recordEntry['奖励币'], 0)));
        rewardRep = Math.max(0, Math.floor(toNumber(recordEntry && recordEntry['奖励声望'], 0)));
        progressAdd = 0;
        statusAction = '放弃任务';
        requestLabel = `[任务放弃申请] ${activeName} 在【${currentLoc}】准备放弃任务【${questName}】。`;
        analysisLabel = 'Quest abandon request initialized from task panel.';
        playerInput = `我想放弃当前任务【${questName}】。`;
        extraRequirement = '你必须保留 quest_request.action = 放弃，并保留 quest_name、quest_desc、required_count、reward_coin、reward_rep 这些字段，使 MVU 后续可以正确回滚委托板状态。';
      } else if (actionType === 'progress') {
        if (!recordEntry || ['已完成', '已放弃', '失败', '已失败'].includes(recordStatus)) return null;
        questAction = '更新进度';
        questDesc = toText(recordEntry && recordEntry['描述'], '无');
        requiredCount = Math.max(1, Math.floor(toNumber(recordEntry && recordEntry['目标进度'], 1)));
        rewardCoin = Math.max(0, Math.floor(toNumber(recordEntry && recordEntry['奖励币'], 0)));
        rewardRep = Math.max(0, Math.floor(toNumber(recordEntry && recordEntry['奖励声望'], 0)));
        statusAction = '任务推进';
        requestLabel = `[任务进度申请] ${activeName} 在【${currentLoc}】推进任务【${questName}】，计划增加 ${progressAdd} 点进度。`;
        analysisLabel = 'Quest progress request initialized from task panel.';
        playerInput = `我想推进任务【${questName}】的进度。`;
        extraRequirement = `你必须保留 quest_request.action = 更新进度 与 progress_add = ${progressAdd}，并保留 quest_name、quest_desc、required_count、reward_coin、reward_rep 这些字段。`;
      } else {
        return null;
      }

      const patchOps = [
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/quest_request`, value: { action: questAction, quest_name: questName, quest_desc: questDesc, progress_add: progressAdd, required_count: requiredCount, reward_coin: rewardCoin, reward_rep: rewardRep } },
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/status/action`, value: statusAction },
        { op: 'replace', path: '/sys/rsn', value: requestLabel }
      ];

      const systemPrompt = `以下内容属于前端已经完成的任务请求初始化，不要在正文直接复述“JSONPatch / 系统分析 / 仲裁日志”等术语。

${requestLabel}

[任务要求]
${extraRequirement}

[MVU变量更新数据]
<UpdateVariable>
<Analysis>${analysisLabel}</Analysis>
<JSONPatch>
${JSON.stringify(patchOps, null, 2)}
</JSONPatch>
</UpdateVariable>`;

      return {
        playerInput,
        systemPrompt,
        requestKind: 'quest_request'
      };
    }


    function buildFactionAffairConsoleHtml(snapshot, preferredFactionName = '') {
      const pendingPromotionFaction = toText(deepGet(snapshot, 'activeChar.promotion_request.target_faction', '无'), '无');
      const pendingPromotionTitle = toText(deepGet(snapshot, 'activeChar.promotion_request.target_title', '无'), '无');
      const pendingDonateItem = toText(deepGet(snapshot, 'activeChar.donate_request.item_name', '无'), '无');
      const pendingDonateFaction = toText(deepGet(snapshot, 'activeChar.donate_request.target_faction', '无'), '无');
      const pendingDonateQty = Math.max(1, toNumber(deepGet(snapshot, 'activeChar.donate_request.quantity', 1), 1));
      const factionNames = [];
      [preferredFactionName, pendingPromotionFaction, pendingDonateFaction, ...(snapshot.factions || []).map(([name]) => name), '唐门', '史莱克学院', '战神殿', '传灵塔', '联邦军方', '血神军团', '圣灵教'].forEach(name => {
        const text = toText(name, '').trim();
        if (text && text !== '无' && !factionNames.includes(text)) factionNames.push(text);
      });
      const factionOptionsHtml = factionNames.map(name => `<option value="${escapeHtmlAttr(name)}">${htmlEscape(name)}</option>`).join('');
      const donationEntries = (snapshot.inventoryEntries || []).filter(([, item]) => toNumber(item && item['数量'], 0) > 0).slice(0, 50);
      const donationOptionsHtml = donationEntries.length
        ? donationEntries.map(([name, item]) => `<option value="${escapeHtmlAttr(name)}" ${name === pendingDonateItem ? 'selected' : ''}>${htmlEscape(`${name} ×${toNumber(item && item['数量'], 0)}`)}</option>`).join('')
        : '<option value="">暂无可捐献物品</option>';
      const defaultPromotionFaction = pendingPromotionFaction !== '无' ? pendingPromotionFaction : (preferredFactionName || factionNames[0] || '');
      const defaultDonateFaction = pendingDonateFaction !== '无' ? pendingDonateFaction : (preferredFactionName || factionNames[0] || '');
      const isPlayerControlled = isSnapshotPlayerControlled(snapshot);
      if (!isPlayerControlled) {
        return `
          <div class="archive-card full">
            <div class="archive-card-head"><div class="archive-card-title">阵营事务状态</div><span class="state-tag warn">旁观</span></div>
            <div class="relation-side-list">
              <div class="relation-card"><b>挂起事务</b><span>${htmlEscape(`晋升 ${pendingPromotionFaction !== '无' ? `${pendingPromotionFaction} / ${pendingPromotionTitle}` : '无'} ｜ 捐献 ${pendingDonateItem !== '无' ? `${pendingDonateItem} × ${pendingDonateQty} / ${pendingDonateFaction}` : '无'}`)}</span></div>
              <div class="relation-card"><b>视角说明</b><span>${htmlEscape('当前为旁观视角，这里可以先查看阵营近况与贡献积累；若想递交申请或捐献，请切回自己的行动视角。')}</span></div>
            </div>
            <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06);">
              <div style="font-size: 11px; color: var(--color-text-secondary); margin-bottom: 8px; font-weight: 500;">当前主要贡献池</div>
              <div style="font-size: 12px; color: #888;">${htmlEscape(`唐门 ${formatNumber(deepGet(snapshot, 'activeChar.wealth.tang_pt', 0))} / 学院 ${formatNumber(deepGet(snapshot, 'activeChar.wealth.shrek_pt', 0))} / 军方 ${formatNumber(deepGet(snapshot, 'activeChar.wealth.blood_pt', 0))}`)}</div>
            </div>
          </div>
        `;
      }
      return `
        <div class="archive-card full request-console-card">
          <div class="archive-card-head"><div class="archive-card-title">阵营事务操作台</div><span class="state-tag ${preferredFactionName ? 'live' : 'warn'}">${htmlEscape(preferredFactionName || '未加入')}</span></div>
          <span>${htmlEscape(`挂起事务：晋升 ${pendingPromotionFaction !== '无' ? `${pendingPromotionFaction} / ${pendingPromotionTitle}` : '无'} ｜ 捐献 ${pendingDonateItem !== '无' ? `${pendingDonateItem} × ${pendingDonateQty} / ${pendingDonateFaction}` : '无'}`)}</span>
          <div class="request-console-grid" style="gap: 16px;">
            <div class="request-console-row" style="display: grid; grid-template-columns: 1fr 2fr auto; gap: 8px; align-items: center;">
              <select class="request-console-input" style="margin: 0;" data-faction-input="promoteFaction">${factionNames.map(name => `<option value="${escapeHtmlAttr(name)}" ${name === defaultPromotionFaction ? 'selected' : ''}>${htmlEscape(name)}</option>`).join('')}</select>
              <input class="request-console-input" style="margin: 0;" data-faction-input="targetTitle" value="${escapeHtmlAttr(pendingPromotionTitle !== '无' ? pendingPromotionTitle : '')}" placeholder="申请职位，如黄级 / 预备战神 / 少将" />
              <button type="button" class="relation-action-btn faction-action-btn" style="margin: 0; height: 32px;" data-faction-action="promote">提交晋升</button>
            </div>
            <div class="request-console-row" style="display: grid; grid-template-columns: 1.5fr 2fr 1fr auto; gap: 8px; align-items: center;">
              <select class="request-console-input" style="margin: 0;" data-faction-input="donateFaction">${factionNames.map(name => `<option value="${escapeHtmlAttr(name)}" ${name === defaultDonateFaction ? 'selected' : ''}>${htmlEscape(name)}</option>`).join('')}</select>
              <select class="request-console-input" style="margin: 0;" data-faction-input="donateItem" ${donationEntries.length ? '' : 'disabled'}>${donationOptionsHtml}</select>
              <input type="number" min="1" class="request-console-input" style="margin: 0;" data-faction-input="donateQty" value="${escapeHtmlAttr(String(pendingDonateQty))}" placeholder="数量" />
              <button type="button" class="relation-action-btn faction-action-btn" style="margin: 0; height: 32px;" data-faction-action="donate" ${donationEntries.length ? '' : 'disabled'}>提交捐献</button>
            </div>
          </div>
          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06);">
            <div style="font-size: 11px; color: var(--color-text-secondary); margin-bottom: 8px; font-weight: 500;">当前主要贡献池</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;"><span style="color: #888;">唐门</span><span style="color: var(--cyan);">${formatNumber(deepGet(snapshot, 'activeChar.wealth.tang_pt', 0))}</span></div>
                <div style="height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden;">
                  <div style="height: 100%; background: var(--cyan); width: ${ratioPercent(deepGet(snapshot, 'activeChar.wealth.tang_pt', 0), 1000)}%;"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;"><span style="color: #888;">史莱克学院</span><span style="color: #60c571;">${formatNumber(deepGet(snapshot, 'activeChar.wealth.shrek_pt', 0))}</span></div>
                <div style="height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden;">
                  <div style="height: 100%; background: #60c571; width: ${ratioPercent(deepGet(snapshot, 'activeChar.wealth.shrek_pt', 0), 1000)}%;"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;"><span style="color: #888;">战神殿/军方</span><span style="color: var(--red);">${formatNumber(deepGet(snapshot, 'activeChar.wealth.blood_pt', 0))}</span></div>
                <div style="height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden;">
                  <div style="height: 100%; background: var(--red); width: ${ratioPercent(deepGet(snapshot, 'activeChar.wealth.blood_pt', 0), 1000)}%;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function buildMapTradeModalOptions(snapshot, dispatchDetail) {
      const detail = dispatchDetail || {};
      const services = normalizeMapDispatchServices(detail);
      const action = toText(detail.action, '');
      const npcTarget = toText(detail.npcTarget, '');
      const currentLoc = toText(snapshot && snapshot.currentLoc, '');
      const normalizedLoc = toText(snapshot && snapshot.normalizedLoc, currentLoc);
      const locations = deepGet(snapshot, 'rootData.world.locations', {});
      const currentLocation = snapshot && snapshot.locationData && typeof snapshot.locationData === 'object'
        ? snapshot.locationData
        : (locations && typeof locations === 'object'
          ? (locations[normalizedLoc] || locations[currentLoc] || {})
          : {});
      const storeMap = currentLocation && typeof currentLocation === 'object' ? (currentLocation.stores || {}) : {};

      let initialTab = 'tab-shop';
      if (action === 'bid' || services.includes('auction')) {
        initialTab = 'tab-auction';
      } else if (action === 'trade' && npcTarget) {
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
      if (!npcTarget && npcTargets.length) npcTarget = npcTargets[0];
      if (!snapshot || !snapshot.rootData || !npcTarget) return null;

      const activeKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
      const targetKey = resolveSnapshotCharKey(snapshot, npcTarget);
      if (!activeKey || !targetKey) return null;

      const chars = deepGet(snapshot, 'rootData.char', {});
      const activeChar = chars && typeof chars === 'object' ? (chars[activeKey] || {}) : {};
      const targetChar = chars && typeof chars === 'object' ? (chars[targetKey] || {}) : {};
      const activeName = toText(activeChar && (activeChar.name || deepGet(activeChar, 'base.name', '')), activeKey);
      const targetName = toText(targetChar && (targetChar.name || deepGet(targetChar, 'base.name', '')), npcTarget || targetKey);
      const arenaName = toText(detail.target, toText(detail.currentLoc, toText(snapshot.currentLoc, '未知地点')));

      const patchOps = [
        { op: 'replace', path: '/world/combat/is_active', value: true },
        { op: 'replace', path: '/world/combat/combat_type', value: '切磋' },
        { op: 'replace', path: '/world/combat/initiative', value: '无' },
        { op: 'replace', path: '/world/combat/allow_flee', value: true },
        { op: 'replace', path: '/world/combat/round', value: 1 },
        { op: 'replace', path: '/world/combat/phase', value: '宣告阶段' },
        { op: 'replace', path: '/world/combat/environment', value: `${arenaName} / 切磋` },
        { op: 'replace', path: '/world/combat/participants', value: {
          [activeKey]: { faction: '己方', status: deepGet(activeChar, 'status.alive', true) === false ? '重伤' : '存活', is_summon: false },
          [targetKey]: { faction: '敌对', status: deepGet(targetChar, 'status.alive', true) === false ? '重伤' : '存活', is_summon: false }
        } },
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/status/action`, value: '战斗中' }
      ];

      const mvuUpdate = `[MVU变量更新数据]
以下为本次战斗初始化的完整 MVU 更新，请将上面的隐藏结算转写为自然剧情，正文不要直接复述 JSONPatch 或系统术语。
<UpdateVariable>
<Analysis>Battle initialized from map action.</Analysis>
<JSONPatch>
${JSON.stringify(patchOps, null, 2)}
</JSONPatch>
</UpdateVariable>`;

      return {
        playerInput: `我想在【${arenaName}】与【${targetName}】切磋。\n\n${mvuUpdate}`,
        systemPrompt,
        requestKind: 'combat_action'
      };
    }

    function buildMapInteractDispatchRequest(snapshot, dispatchDetail) {
      const detail = dispatchDetail || {};
      const action = toText(detail.action, '');
      let npcTarget = toText(detail.npcTarget, '');
      const npcTargets = Array.isArray(detail.npcTargets) ? detail.npcTargets.map(item => toText(item, '')).filter(Boolean) : [];
      if (!npcTarget && npcTargets.length) npcTarget = npcTargets[0];

      const interactActionMap = {
        talk: '闲聊',
        brief: '请教',
        intel: '请教',
        ask: '请教',
        gift: '送礼',
        confess: '表白',
        dual: '双修'
      };
      const interactAction = toText(interactActionMap[action], '');
      if (!snapshot || !snapshot.rootData || !npcTarget || !interactAction) return null;

      const activeKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
      if (!activeKey) return null;

      const chars = deepGet(snapshot, 'rootData.char', {});
      const activeChar = chars && typeof chars === 'object' ? (chars[activeKey] || {}) : {};
      const activeName = toText(activeChar && (activeChar.name || deepGet(activeChar, 'base.name', '')), toText(snapshot.activeName, activeKey));
      const resolvedTarget = resolveSnapshotCharacter(snapshot, npcTarget);
      const targetName = toText(resolvedTarget.displayName, npcTarget);
      const relationMap = deepGet(snapshot, 'activeChar.social.relations', {});
      const relationData = relationMap && typeof relationMap === 'object'
        ? (relationMap[targetName] || relationMap[resolvedTarget.key] || {})
        : {};
      const arenaName = toText(detail.target, toText(detail.currentLoc, toText(snapshot.currentLoc, '未知地点')));
      const currentTick = toNumber(deepGet(snapshot, 'rootData.world.time.tick', 0), 0);
      const itemUsed = interactAction === '送礼'
        ? (toText(detail.itemUsed, toText(detail.item_used, '无')) || '无')
        : '无';
      const targetChar = resolvedTarget && resolvedTarget.char && typeof resolvedTarget.char === 'object' ? resolvedTarget.char : {};
      const activeIdentity = toText(deepGet(activeChar, 'social.main_identity', '无'), '无');
      const targetIdentity = toText(deepGet(targetChar, 'social.main_identity', '无'), '无');
      const activePersonality = toText(deepGet(activeChar, 'personality', '未设定'), '未设定');
      const targetPersonality = toText(deepGet(targetChar, 'personality', '未设定'), '未设定');
      const activeLoc = toText(deepGet(activeChar, 'status.loc', arenaName), arenaName || '未知地点');
      const targetLoc = toText(deepGet(targetChar, 'status.loc', '未知地点'), '未知地点');
      const activeFactions = Object.keys(deepGet(activeChar, 'social.factions', {})).filter(Boolean);
      const targetFactions = Object.keys(deepGet(targetChar, 'social.factions', {})).filter(Boolean);
      const recentInteractText = relationData && typeof relationData === 'object'
        ? `${toText(relationData['last_interact_action'], '无')} / ${toNumber(relationData['recent_favor_delta'], 0)}`
        : '无';
      const progressNote = relationData && typeof relationData === 'object' ? toText(deepGet(relationData, '_progress_note', deepGet(relationData, 'progress_note', '暂无')),'暂无') : '暂无';
      const routeSwitchable = !!deepGet(relationData, '_route_switchable', false);
      const sourceLabel = toText(detail.sourceLabel, '地图 NPC 互动');
      const sourceAnalysis = toText(detail.sourceAnalysis, 'Map NPC interaction initialized from map action.');
      const actionPromptMap = {
        talk: `我想在【${arenaName}】和【${targetName}】闲聊。`,
        brief: `我想在【${arenaName}】向【${targetName}】汇报情况并请示安排。`,
        intel: `我想在【${arenaName}】向【${targetName}】请教情报。`,
        ask: `我想在【${arenaName}】向【${targetName}】请教修炼心得。`,
        gift: itemUsed !== '无'
          ? `我想在【${arenaName}】向【${targetName}】赠送【${itemUsed}】。`
          : `我想在【${arenaName}】向【${targetName}】送礼。`,
        confess: `我想在【${arenaName}】向【${targetName}】表白，明确彼此心意。`,
        dual: `我想在【${arenaName}】与【${targetName}】进行双修。`
      };

      const patchOps = [
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/interact_request`, value: {
          target_npc: targetName,
          action: interactAction,
          item_used: itemUsed,
          ai_score: 0
        } },
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/status/action`, value: '日常' },
        { op: 'replace', path: '/world/time/tick', value: currentTick + 2 },
        { op: 'replace', path: '/sys/rsn', value: `[社交互动] ${activeName} 在【${arenaName}】对【${targetName}】发起【${interactAction}】。` }
      ];

      const relationSummary = relationData && typeof relationData === 'object'
        ? `${toText(relationData['关系'], '陌生')} / 路线 ${toText(relationData['relation_route'], '朋友线')} / 好感 ${toNumber(relationData['好感度'], 0)}`
        : '暂无已知关系记录';

      const systemPrompt = `以下内容属于前端已经完成的${sourceLabel}请求初始化，不要在正文直接复述“JSONPatch / 系统分析 / 仲裁日志”等术语。

[社交互动] ${activeName} 在【${arenaName}】对【${targetName}】发起【${interactAction}】。

[关系参考]
当前关系：${relationSummary}

[角色补充]
发起者：${activeName} / 身份 ${activeIdentity} / 性格 ${activePersonality} / 所属势力 ${activeFactions.join(' / ') || '无'} / 所在地 ${activeLoc}
目标：${targetName} / 身份 ${targetIdentity} / 性格 ${targetPersonality} / 所属势力 ${targetFactions.join(' / ') || '无'} / 所在地 ${targetLoc}
最近互动：${recentInteractText}
推进提示：${progressNote}
当前是否可切恋人线：${routeSwitchable ? '是' : '否'}

[互动裁定原则]
你必须根据剧情氛围为本次 interact_request.ai_score 回填一个 -50 到 50 的整数；若互动无法成立则保持 0，并在正文给出合理原因。请不要只按一句台词机械判分，必须综合考虑：基础好感、当前关系阶段与路线、双方性格、身份与现实压力、所属势力可能带来的立场影响、当前地点是否适合展开该互动、以及最近互动的延续性。${interactAction === '送礼' ? ` 送礼时必须保留 item_used = ${itemUsed}，并判断礼物是否对目标性格、身份、处境与当下气氛对口。` : ''}${interactAction === '表白' ? ' 表白时要区分“试着交往/进入暧昧推进”与“正式确认关系”两种结果；若剧情上已经正式确认关系，可以直接在返回的 JSONPatch 中把双方 social.relations 下对应目标的 relation_route 改为“恋人线”。' : ''}${interactAction === '双修' ? ' 双修属于高亲密度互动，若人物状态、性格、场景或关系阶段不匹配，应明显压低 ai_score 或判定无法成立。' : ''}${interactAction === '请教' ? ' 请教不仅看好感，也要看目标是否愿意传授、双方当前关系是否适合、以及当下场景是否便于认真交流。' : ''}

[MVU变量更新数据]
以下为本次人物互动的前端预填请求，请将上面的隐藏结算转写为自然剧情，正文不要直接复述 JSONPatch 或系统术语。
<UpdateVariable>
<Analysis>${sourceAnalysis}</Analysis>
<JSONPatch>
${JSON.stringify(patchOps, null, 2)}
</JSONPatch>
</UpdateVariable>`;

      return {
        playerInput: actionPromptMap[action] || `我想在【${arenaName}】与【${targetName}】互动。`,
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
        console.warn('[DragonUI] 当前是旁观视角，可先查看情况；如需发起交易、锻造或战斗，请切回自己的行动视角。', detail);
        return;
      }

      if (action === 'craft' || services.includes('craft')) {
        mapDispatchContext = { ...detail, action, services };
        openModal('武装工坊详细页', { preserveMapDispatchContext: true });
        return;
      }

      if (['talk', 'brief', 'intel'].includes(action)) {
        const interactInit = buildMapInteractDispatchRequest(liveSnapshot, detail);
        mapDispatchContext = { ...detail, action, services };
        if (interactInit && typeof window.sendToAI === 'function') {
          window.sendToAI(interactInit.playerInput, interactInit.systemPrompt, { requestKind: interactInit.requestKind });
          return;
        }
        if (typeof window.sendToAI === 'function') {
          const arenaName = toText(detail.target, toText(detail.currentLoc, toText(liveSnapshot && liveSnapshot.currentLoc, '未知地点')));
          const npcTargets = Array.isArray(detail.npcTargets) ? detail.npcTargets.map(item => toText(item, '')).filter(Boolean) : [];
          const targetLabel = npcTargets.length ? `在场人物（${npcTargets.join('、')}）` : '在场人员';
          const playerInputMap = {
            talk: `我想在【${arenaName}】与${targetLabel}交谈。`,
            brief: `我想在【${arenaName}】向${targetLabel}汇报情况并请示安排。`,
            intel: `我想在【${arenaName}】向${targetLabel}请教情报。`
          };
          const actionLabel = action === 'brief' ? '汇报' : (action === 'intel' ? '请教' : '对话');
          const systemPrompt = `以下内容属于前端已经发起的地图${actionLabel}请求。当前没有锁定唯一 NPC 目标，不要报错，也不要要求玩家重新点击；请结合【${arenaName}】的场景功能与在场人物，自然选择最合适的回应对象承接本次互动。${npcTargets.length ? ` 当前可候选人物：${npcTargets.join('、')}。` : ' 当前未识别到明确人物名单，请按地点与事件功能自然承接。'}`;
          window.sendToAI(playerInputMap[action] || `我想在【${arenaName}】与在场人物互动。`, systemPrompt, { requestKind: 'interact_request' });
          return;
        }
        console.warn('[DragonUI] 地图 NPC 互动分发未找到可用发送通道', detail);
        return;
      }

      if (action === 'battle' || services.includes('battle')) {
        const battleInit = buildMapBattleInitRequest(liveSnapshot, detail);
        mapDispatchContext = { ...detail, action, services };
        if (battleInit && typeof window.sendToAI === 'function') {
          window.sendToAI(battleInit.playerInput, battleInit.systemPrompt, { requestKind: battleInit.requestKind });
          return;
        }
        if (typeof window.sendToAI === 'function') {
          const arenaName = toText(detail.target, toText(detail.currentLoc, toText(liveSnapshot && liveSnapshot.currentLoc, '未知地点')));
          const npcTargets = Array.isArray(detail.npcTargets) ? detail.npcTargets.map(item => toText(item, '')).filter(Boolean) : [];
          const targetLabel = npcTargets.length ? `在场人物（${npcTargets.join('、')}）中的一人` : '合适的对手';
          const systemPrompt = `以下内容属于前端已经发起的地图切磋请求。当前没有锁定唯一对手，不要报错，也不要要求玩家重新点击；请结合【${arenaName}】现场情况与在场人物，自然判断是否有人应战。${npcTargets.length ? ` 候选对手：${npcTargets.join('、')}。若有人应战，请自然承接为切磋剧情并继续后续战斗推进。` : ' 若当前没有明确对手，也请以前端请求已发出的事实为基础，自然描述无人应战、稍后再战或由他人出面回应。'}`;
          window.sendToAI(`我想在【${arenaName}】与${targetLabel}切磋。`, systemPrompt, { requestKind: 'combat_action' });
          return;
        }
        console.warn('[DragonUI] 地图切磋分发未找到可用发送通道', detail);
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

      const targetKey = previewKey || '';
      if (targetKey) {
        if (!modalStack.length || modalStack[modalStack.length - 1] !== targetKey) {
          modalStack.push(targetKey);
        }
      }
      currentModalPreviewKey = modalStack[modalStack.length - 1] || '';
      
      if (currentModalPreviewKey) {
        renderModalContent(currentModalPreviewKey, refs);
      }

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
      if (String(previewKey || '').startsWith(SKILL_DESIGNER_PREVIEW_PREFIX)) {
        closeModal();
        if (typeof showUiToast === 'function') {
          showUiToast('技能设计台暂未就绪，请重试。', 'error', 4200);
        }
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

    function popModalOrClose() {
      if (modalStack.length > 1) {
        const poppedPreviewKey = modalStack.pop();
        if (isSkillDesignerPreviewKey(poppedPreviewKey)) clearCachedSkillDesignerDraft(poppedPreviewKey);
        currentModalPreviewKey = modalStack[modalStack.length - 1] || '';
        if (currentModalPreviewKey) {
          renderModalContent(currentModalPreviewKey, getModalRefs());
          return;
        }
      }
      closeModal();
    }

    function closeModal() {
      if (activeSubUI && typeof activeSubUI.destroy === 'function') {
        activeSubUI.destroy();
        activeSubUI = null;
      }
      clearCachedSkillDesignerDrafts(modalStack);
      mapDispatchContext = null;

      hideInventoryHoverPanel();
      currentModalPreviewKey = '';
      modalStack = [];
      if (detailModal) detailModal.classList.remove('show', 'drawer-left');
      if (modalPanel) modalPanel.classList.remove('drawer-left', 'vault-mode');
      if (modalBody) modalBody.classList.remove('vault-body');
      if (detailModal) detailModal.setAttribute('aria-hidden', 'true');
      flushPendingLiveRefresh();
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
      const inClassicShell = (canvas && canvas.contains(clickable)) || (splitOverlay && splitOverlay.contains(clickable));
      const inVueShell = (leftMount && leftMount.contains(clickable))
        || (rightMount && rightMount.contains(clickable))
        || !!(clickable && clickable.closest('.mvu-vue-wrapper'));

      if (!clickable || !(inClassicShell || inVueShell)) return;
      const previewKey = clickable.dataset.preview;
      if (!previewKey) return;
      openModal(previewKey);
    });

    if (modalClose) modalClose.addEventListener('click', popModalOrClose);
    if (detailModal) detailModal.addEventListener('click', (event) => {
      const eventTarget = event.target instanceof Element ? event.target : (event.target && event.target.parentElement ? event.target.parentElement : null);
      const actionBtn = eventTarget ? eventTarget.closest('.armory-action-btn') : null;
      if (actionBtn && modalBody.contains(actionBtn)) {
        event.preventDefault();
        event.stopPropagation();
        if (!isSnapshotPlayerControlled(liveSnapshot)) {
          if (typeof window.alert === 'function') window.alert('现在是旁观视角，暂时不能进行装备或锻造操作。切回自己的行动视角后再试。');
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
        const switched = applyActiveCharacterSelection(targetName, { closeModal: false });
        if (!switched) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show(`切换角色失败：找不到【${targetName}】。`, 'error');
          else if (typeof window.alert === 'function') window.alert(`切换角色失败：找不到【${targetName}】。`);
        }
        return;
      }

      const relationFocusBtn = eventTarget ? eventTarget.closest('[data-relation-focus]') : null;
      if (relationFocusBtn && modalBody.contains(relationFocusBtn)) {
        event.preventDefault();
        event.stopPropagation();
        const targetName = relationFocusBtn.getAttribute('data-relation-focus') || '';
        if (targetName && currentModalPreviewKey) {
          modalFocusState[`${currentModalPreviewKey}::relation-focus`] = targetName;
          renderModalContent(currentModalPreviewKey);
        }
        return;
      }

      const relationActionBtn = eventTarget ? eventTarget.closest('.relation-action-btn[data-relation-action][data-relation-target]') : null;
      if (relationActionBtn && modalBody.contains(relationActionBtn)) {
        event.preventDefault();
        event.stopPropagation();
        if (!isSnapshotPlayerControlled(liveSnapshot)) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('现在是旁观视角，先看看关系近况吧。若想发起互动，请切回自己的行动视角。', 'error');
          else if (typeof window.alert === 'function') window.alert('现在是旁观视角，先看看关系近况吧。若想发起互动，请切回自己的行动视角。');
          return;
        }

        const actionType = relationActionBtn.getAttribute('data-relation-action') || '';
        const targetName = relationActionBtn.getAttribute('data-relation-target') || '';
        const resolvedTarget = resolveSnapshotCharacter(liveSnapshot, targetName);
        if (!resolvedTarget.char) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show(`找不到关系对象【${targetName}】。`, 'error');
          else if (typeof window.alert === 'function') window.alert(`找不到关系对象【${targetName}】。`);
          return;
        }

        const currentLocFull = toText(deepGet(liveSnapshot, 'activeChar.status.loc', liveSnapshot.currentLoc || ''), liveSnapshot.currentLoc || '');
        const targetLoc = toText(deepGet(resolvedTarget.char, 'status.loc', ''), '');
        const isSameLocation = isLocationCompatible(currentLocFull, targetLoc);
        const isContactable = deepGet(resolvedTarget.char, 'status.alive', true) !== false;
        const relationMap = deepGet(liveSnapshot, 'activeChar.social.relations', {});
        const relationData = relationMap && typeof relationMap === 'object' ? (relationMap[targetName] || relationMap[resolvedTarget.key] || {}) : {};
        const favor = toNumber(relationData && relationData['好感度'], 0);
        const route = toText(relationData && relationData['relation_route'], '朋友线');
        const routeSwitchable = !!deepGet(relationData, '_route_switchable', false);

        if (!isContactable || !isSameLocation) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show(`【${targetName}】当前不在你身边，无法进行当面关系互动。`, 'error');
          else if (typeof window.alert === 'function') window.alert(`【${targetName}】当前不在你身边，无法进行当面关系互动。`);
          return;

      const questActionBtn = eventTarget ? eventTarget.closest('.quest-action-btn[data-quest-action]') : null;
      if (questActionBtn && modalBody.contains(questActionBtn)) {
        event.preventDefault();
        event.stopPropagation();
        if (!isSnapshotPlayerControlled(liveSnapshot)) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('现在是旁观视角，暂时不能发起任务请求。切回自己的行动视角后再试。', 'error');
          else if (typeof window.alert === 'function') window.alert('现在是旁观视角，暂时不能发起任务请求。切回自己的行动视角后再试。');
          return;
        }
        const actionType = questActionBtn.getAttribute('data-quest-action') || '';
        const requestPanel = questActionBtn.closest('.request-console-card') || modalBody;
        const nameInput = requestPanel ? requestPanel.querySelector('[data-quest-input="name"]') : null;
        const descInput = requestPanel ? requestPanel.querySelector('[data-quest-input="desc"]') : null;
        const requiredInput = requestPanel ? requestPanel.querySelector('[data-quest-input="required"]') : null;
        const rewardCoinInput = requestPanel ? requestPanel.querySelector('[data-quest-input="rewardCoin"]') : null;
        const rewardRepInput = requestPanel ? requestPanel.querySelector('[data-quest-input="rewardRep"]') : null;
        const progressInput = requestPanel ? requestPanel.querySelector('[data-quest-input="progress"]') : null;
        const targetQuestName = toText(questActionBtn.getAttribute('data-quest-target'), '') || toText(nameInput && nameInput.value, '').trim();
        const actionData = buildQuestDispatchRequest(liveSnapshot, actionType, {
          questName: targetQuestName,
          questDesc: toText(descInput && descInput.value, '').trim(),
          requiredCount: toNumber(requiredInput && requiredInput.value, 1),
          rewardCoin: toNumber(rewardCoinInput && rewardCoinInput.value, 0),
          rewardRep: toNumber(rewardRepInput && rewardRepInput.value, 0),
          progressAdd: toNumber(progressInput && progressInput.value, 1)
        });
        if (!actionData) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('任务请求参数不完整，请检查任务名称与说明。', 'error');
          else if (typeof window.alert === 'function') window.alert('任务请求参数不完整，请检查任务名称与说明。');
          return;
        }
        if (typeof window.sendToAI === 'function') window.sendToAI(actionData.playerInput, actionData.systemPrompt, { requestKind: actionData.requestKind });
        return;
      }

        }
        if (actionType === 'ask' && favor < 30) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show(`向【${targetName}】请教需要好感度达到 30。`, 'error');
          else if (typeof window.alert === 'function') window.alert(`向【${targetName}】请教需要好感度达到 30。`);
          return;
        }
        if (actionType === 'confess' && !(route === '恋人线' || routeSwitchable || favor >= 80)) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show(`【${targetName}】当前尚未达到适合表白的关系阶段。`, 'error');
          else if (typeof window.alert === 'function') window.alert(`【${targetName}】当前尚未达到适合表白的关系阶段。`);
          return;
        }
        if (actionType === 'dual' && !(route === '恋人线' && favor >= 80)) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('双修仅在高好感恋人线关系下开放。', 'error');
          else if (typeof window.alert === 'function') window.alert('双修仅在高好感恋人线关系下开放。');
          return;
        }

        let actionData = null;
        if (actionType === 'battle') {
          actionData = buildRelationBattleInitRequest(liveSnapshot, targetName);
        } else {
          let itemUsed = '无';
          if (actionType === 'gift') {
            const actionPanel = relationActionBtn.closest('.relation-action-panel') || modalBody;
            const giftSelect = actionPanel ? actionPanel.querySelector('.relation-gift-select') : null;
            itemUsed = toText(giftSelect && giftSelect.value, '');
            if (!itemUsed) {
              if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('请先选择要赠送的物品。', 'error');
              else if (typeof window.alert === 'function') window.alert('请先选择要赠送的物品。');
              return;
            }
          }
          actionData = buildRelationInteractRequest(liveSnapshot, actionType, targetName, { itemUsed });
        }

        if (actionData && typeof window.sendToAI === 'function') {
          window.sendToAI(actionData.playerInput, actionData.systemPrompt, { requestKind: actionData.requestKind });
        }
        return;
      }

      const questBoardFocusBtn = eventTarget ? eventTarget.closest('[data-quest-board-focus]') : null;
      if (questBoardFocusBtn && modalBody.contains(questBoardFocusBtn)) {
        event.preventDefault();
        event.stopPropagation();
        const boardId = questBoardFocusBtn.getAttribute('data-quest-board-focus') || '';
        if (boardId && currentModalPreviewKey) {
          modalFocusState[`${currentModalPreviewKey}::quest-board-focus`] = boardId;
          renderModalContent(currentModalPreviewKey);
        }
        return;
      }

      const questFocusBtn = eventTarget ? eventTarget.closest('[data-quest-focus]') : null;
      if (questFocusBtn && modalBody.contains(questFocusBtn)) {
        event.preventDefault();
        event.stopPropagation();
        const questName = questFocusBtn.getAttribute('data-quest-focus') || '';
        if (questName && currentModalPreviewKey) {
          modalFocusState[`${currentModalPreviewKey}::quest-focus`] = questName;
          renderModalContent(currentModalPreviewKey);
        }
        return;
      }

      const intelActionBtn = eventTarget ? eventTarget.closest('.intel-action-btn[data-intel-action]') : null;
      if (intelActionBtn && modalBody.contains(intelActionBtn)) {
        event.preventDefault();
        event.stopPropagation();
        if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('这里先记线索，不直接写结论。去经历事件、调查或接触人物后，新的情报自然会浮现。', 'error');
        else if (typeof window.alert === 'function') window.alert('这里先记线索，不直接写结论。去经历事件、调查或接触人物后，新的情报自然会浮现。');
        return;
      }

      const trialActionBtn = eventTarget ? eventTarget.closest('.trial-action-btn[data-trial-action]') : null;
      if (trialActionBtn && modalBody.contains(trialActionBtn)) {
        event.preventDefault();
        event.stopPropagation();
        if (!isSnapshotPlayerControlled(liveSnapshot)) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('现在是旁观视角，暂时不能提交试炼结果。切回自己的行动视角后再试。', 'error');
          else if (typeof window.alert === 'function') window.alert('现在是旁观视角，暂时不能提交试炼结果。切回自己的行动视角后再试。');
          return;
        }
        const trialAction = trialActionBtn.getAttribute('data-trial-action') || '';
        const requestPanel = trialActionBtn.closest('.request-console-card') || modalBody;
        let actionData = null;
        if (trialAction === 'hunt') {
          const ageInput = requestPanel ? requestPanel.querySelector('[data-trial-input="hunt-age"]') : null;
          const ferociousInput = requestPanel ? requestPanel.querySelector('[data-trial-input="hunt-ferocious"]') : null;
          actionData = buildHuntDispatchRequest(liveSnapshot, {
            killedAge: toNumber(ageInput && ageInput.value, 0),
            isFerocious: toText(ferociousInput && ferociousInput.value, 'false') === 'true'
          });
          if (!actionData) {
            if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('请输入有效的狩猎年限。', 'error');
            else if (typeof window.alert === 'function') window.alert('请输入有效的狩猎年限。');
            return;
          }
        } else if (trialAction === 'abyss') {
          const tierInput = requestPanel ? requestPanel.querySelector('[data-trial-input="abyss-tier"]') : null;
          const qtyInput = requestPanel ? requestPanel.querySelector('[data-trial-input="abyss-qty"]') : null;
          actionData = buildAbyssKillDispatchRequest(liveSnapshot, {
            killTier: toText(tierInput && tierInput.value, ''),
            quantity: toNumber(qtyInput && qtyInput.value, 1)
          });
          if (!actionData) {
            if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('请输入有效的深渊击杀级别与数量。', 'error');
            else if (typeof window.alert === 'function') window.alert('请输入有效的深渊击杀级别与数量。');
            return;
          }
        }
        if (actionData && typeof window.sendToAI === 'function') window.sendToAI(actionData.playerInput, actionData.systemPrompt, { requestKind: actionData.requestKind });
        return;
      }

      const factionActionBtn = eventTarget ? eventTarget.closest('.faction-action-btn[data-faction-action]') : null;
      if (factionActionBtn && modalBody.contains(factionActionBtn)) {
        event.preventDefault();
        event.stopPropagation();
        if (!isSnapshotPlayerControlled(liveSnapshot)) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('现在是旁观视角，暂时不能处理阵营事务。切回自己的行动视角后再试。', 'error');
          else if (typeof window.alert === 'function') window.alert('现在是旁观视角，暂时不能处理阵营事务。切回自己的行动视角后再试。');
          return;
        }
        const factionAction = factionActionBtn.getAttribute('data-faction-action') || '';
        const requestPanel = factionActionBtn.closest('.request-console-card') || modalBody;
        let actionData = null;
        if (factionAction === 'promote') {
          const factionInput = requestPanel ? requestPanel.querySelector('[data-faction-input="promoteFaction"]') : null;
          const titleInput = requestPanel ? requestPanel.querySelector('[data-faction-input="targetTitle"]') : null;
          actionData = buildPromotionDispatchRequest(liveSnapshot, {
            targetFaction: toText(factionInput && factionInput.value, ''),
            targetTitle: toText(titleInput && titleInput.value, '').trim()
          });
          if (!actionData) {
            if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('请输入有效的目标势力与申请职位。', 'error');
            else if (typeof window.alert === 'function') window.alert('请输入有效的目标势力与申请职位。');
            return;
          }
        } else if (factionAction === 'donate') {
          const factionInput = requestPanel ? requestPanel.querySelector('[data-faction-input="donateFaction"]') : null;
          const itemInput = requestPanel ? requestPanel.querySelector('[data-faction-input="donateItem"]') : null;
          const qtyInput = requestPanel ? requestPanel.querySelector('[data-faction-input="donateQty"]') : null;
          actionData = buildDonateDispatchRequest(liveSnapshot, {
            targetFaction: toText(factionInput && factionInput.value, ''),
            itemName: toText(itemInput && itemInput.value, ''),
            quantity: toNumber(qtyInput && qtyInput.value, 1)
          });
          if (!actionData) {
            if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('请确认捐献物品、目标势力与数量，并确保背包库存充足。', 'error');
            else if (typeof window.alert === 'function') window.alert('请确认捐献物品、目标势力与数量，并确保背包库存充足。');
            return;
          }
        }
        if (actionData && typeof window.sendToAI === 'function') window.sendToAI(actionData.playerInput, actionData.systemPrompt, { requestKind: actionData.requestKind });
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

      if (event.target === detailModal) popModalOrClose();
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
    if (!vars || !vars.char) {
      window.MVU_Toast.show('获取角色数据失败，无法换装', 'error');
      return;
    }
    const charNames = Object.keys(vars.char);
    const activeName = charNames[charIndex];
    if (!activeName) {
      window.MVU_Toast.show('未找到目标角色信息', 'error');
      return;
    }
    const activeChar = vars.char[activeName];
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
    const charPath = `/char/${this.escapePtr(activeName)}`;
    
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
    if (/左手|手骨/.test(tName)) return { mainSlot: 'armor', subSlot: '左臂' }; // 容错映射
    if (/右手/.test(tName)) return { mainSlot: 'armor', subSlot: '右臂' }; // 容错映射
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
