
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
    function getMobileShellBridge() {
      try {
        const bridge = window.__MVU_MOBILE_SHELL__;
        return bridge && typeof bridge.getModalHost === 'function' ? bridge : null;
      } catch (err) {
        return null;
      }
    }
    function resolveShellPreviewTitle(previewKey) {
      const key = String(previewKey || '').trim();
      if (key.startsWith('技能设计台：')) {
        try {
          const payload = JSON.parse(decodeURIComponent(key.slice('技能设计台：'.length)));
          const scope = String(payload && payload.scope || '').trim();
          const label = String(payload && payload.label || '').trim();
          const scopeTitleMap = {
            fusion_skill: '融合技设计',
            art: '功法设计',
            special_ability: '特殊技能设计',
            spirit_skill: '魂技设计',
            soul_bone_skill: '魂骨技能设计',
            blood_skill: '血脉技能设计',
            blood_passive: '血脉被动设计'
          };
          return [scopeTitleMap[scope] || '技能设计', label].filter(Boolean).join(' / ') || '技能设计';
        } catch (err) {
          return '技能设计';
        }
      }
      const previewTitleMap = {
        '\u89d2\u8272\u5207\u6362\u5668': '\u89d2\u8272',
        '\u751f\u547d\u56fe\u8c31\u8be6\u60c5\u9875': '\u8be6\u7ec6\u6863\u6848',
        '\u751f\u547d\u56fe\u8c31\u8be6\u7ec6\u9875': '\u8be6\u7ec6\u6863\u6848',
        '\u79c1\u5bc6\u6863\u6848\u8be6\u7ec6\u9875': '\u79c1\u5bc6\u6863\u6848',
        '\u6b66\u88c5\u5de5\u574a\u8be6\u60c5\u9875': '\u6b66\u88c5',
        '\u6b66\u88c5\u5de5\u574a\u8be6\u7ec6\u9875': '\u6b66\u88c5',
        '\u50a8\u7269\u4ed3\u5e93\u8be6\u60c5\u9875': '\u4ed3\u5e93',
        '\u50a8\u7269\u4ed3\u5e93\u8be6\u7ec6\u9875': '\u4ed3\u5e93',
        '\u793e\u4f1a\u6863\u6848\u8be6\u60c5\u9875': '\u793e\u4f1a',
        '\u793e\u4f1a\u6863\u6848\u8be6\u7ec6\u9875': '\u793e\u4f1a',
        '\u6240\u5c5e\u52bf\u529b\u8be6\u60c5\u9875': '\u52bf\u529b',
        '\u4eba\u7269\u5173\u7cfb\u8be6\u60c5\u9875': '\u5173\u7cfb',
        '\u60c5\u62a5\u5e93\u8be6\u60c5\u9875': '\u60c5\u62a5\u5e93',
        '\u7b2c\u4e00\u6b66\u9b42\u8be6\u60c5\u9875': '\u7b2c\u4e00\u6b66\u9b42',
        '\u7b2c\u4e00\u6b66\u9b42\u8be6\u7ec6\u9875': '\u7b2c\u4e00\u6b66\u9b42',
        '\u7b2c\u4e8c\u6b66\u9b42\u8be6\u60c5\u9875': '\u7b2c\u4e8c\u6b66\u9b42',
        '\u7b2c\u4e8c\u6b66\u9b42\u8be6\u7ec6\u9875': '\u7b2c\u4e8c\u6b66\u9b42',
        '\u8840\u8109\u5c01\u5370\u8be6\u60c5\u9875': '\u8840\u8109',
        '\u5168\u606f\u661f\u56fe\u4e3b\u753b\u5e03': '\u661f\u56fe',
        '\u5f53\u524d\u8282\u70b9\u8be6\u60c5': '\u5f53\u524d\u8282\u70b9',
        '\u56fe\u5c42\u63a7\u5236\u4e0e\u8dd1\u56fe': '\u8dd1\u56fe',
        '\u52a8\u6001\u5730\u70b9\u4e0e\u6269\u5c55\u8282\u70b9': '\u52a8\u6001\u5730\u70b9',
        '\u4e16\u754c\u72b6\u6001\u603b\u89c8': '\u4e16\u754c',
        '\u7f16\u5e74\u53f2\u6863\u6848': '\u7f16\u5e74',
        '\u62cd\u5356\u4e0e\u8b66\u62a5': '\u8b66\u62a5',
        '\u52bf\u529b\u77e9\u9635\u603b\u89c8': '\u52bf\u529b',
        '\u6211\u7684\u9635\u8425\u8be6\u60c5': '\u6211\u7684\u9635\u8425',
        '\u672c\u5730\u636e\u70b9\u8be6\u60c5': '\u672c\u5730\u636e\u70b9',
        '\u7cfb\u7edf\u64ad\u62a5\u4e0e\u65e5\u5fd7': '\u64ad\u62a5',
        '\u8bd5\u70bc\u4e0e\u60c5\u62a5': '\u60c5\u62a5',
        '\u8fd1\u671f\u89c1\u95fb': '\u89c1\u95fb',
        '\u602a\u7269\u56fe\u9274': '\u56fe\u9274',
        '\u4efb\u52a1\u754c\u9762': '\u4efb\u52a1',
        '\u6218\u6597\u7ec8\u7aef': '\u6218\u6597'
      };
      return previewTitleMap[key] || key || '\u8be6\u60c5';
    }
    function notifyShellPreviewChange(previewKey) {
      const bridge = getMobileShellBridge();
      if (!bridge || typeof bridge.onPreviewChange !== 'function') return;
      const key = String(previewKey || '').trim();
      if (!key) return;
      try {
        bridge.onPreviewChange({ previewKey: key, title: resolveShellPreviewTitle(key) });
      } catch (err) {}
    }
    function notifyShellPreviewClosed() {
      const bridge = getMobileShellBridge();
      if (!bridge || typeof bridge.onPreviewClosed !== 'function') return;
      try { bridge.onPreviewClosed(); } catch (err) {}
    }
    function resolveDetailModalDefaultParent() {
      return document.body || document.documentElement || null;
    }
    function isMobileShellModalActive(options = {}) {
      const bridge = getMobileShellBridge();
      if (!bridge || typeof bridge.isOpen !== 'function' || !bridge.isOpen()) return false;
      if (options && options.unifiedMode === false) return false;
      if (typeof bridge.isDetailActive === 'function' && !bridge.isDetailActive()) return false;
      const modalHost = bridge.getModalHost();
      return !!(modalHost && modalHost.isConnected);
    }
    function syncDetailModalHost(refs = getModalRefs(), options = {}) {
      const currentDetailModal = refs && refs.detailModal ? refs.detailModal : null;
      const currentModalPanel = refs && refs.modalPanel ? refs.modalPanel : null;
      if (!currentDetailModal) return false;
      const bridge = getMobileShellBridge();
      const useShellHost = isMobileShellModalActive(options);
      const shellHost = bridge && typeof bridge.getModalHost === 'function' ? bridge.getModalHost() : null;
      const targetParent = useShellHost && shellHost ? shellHost : resolveDetailModalDefaultParent();
      if (targetParent && currentDetailModal.parentElement !== targetParent) {
        targetParent.appendChild(currentDetailModal);
      }
      currentDetailModal.classList.toggle('mvu-modal-display-shell', !!useShellHost);
      if (currentModalPanel) currentModalPanel.classList.toggle('mvu-modal-display-shell', !!useShellHost);
      if (currentModalPanel) {
        if (useShellHost) {
          currentModalPanel.removeAttribute('role');
          currentModalPanel.removeAttribute('aria-modal');
          currentModalPanel.removeAttribute('aria-labelledby');
          currentModalPanel.removeAttribute('aria-describedby');
        } else {
          currentModalPanel.setAttribute('role', 'dialog');
          currentModalPanel.setAttribute('aria-modal', 'true');
          currentModalPanel.setAttribute('aria-labelledby', 'modalTitle');
        }
      }
      currentDetailModal.dataset.modalHost = useShellHost ? 'shell' : 'body';
      return !!useShellHost;
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
        fields: ['sd.char', 'char[*].is_player', 'char[*].属性.等级', 'char[*].状态.位置', 'char[*].社交.主身份'],
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
        title: '详细档案',
        summary: '角色状态、修为、外观与成长记录。',
        fields: ['activeChar.属性.*', 'activeChar.状态.*', 'activeChar.属性.状态效果', 'activeChar.魂核.核心', 'activeChar.血脉之力(基础态)'],
        duties: ['展示完整生命体征', '集中显示状态/伤势/领域', '收纳成长修正与魂核进度'],
        actions: ['分区显示基础属性', '异常状态列表', '恢复与判定说明']
      },
      '社会档案详细页': {
        title: '社会档案弹窗',
        summary: '由“名望等级”芯片进入，聚焦声望、身份与称号。',
        fields: ['activeChar.社交.声望', 'activeChar.社交.名望等级', 'activeChar.社交.主身份', 'activeChar.社交.称号'],
        duties: ['展示公开身份', '显示称号来源', '整理名望等级与公开情报状态'],
        actions: ['切换到关系/阵营/情报子页', '保留声望来源说明']
      },
      '所属势力详细页': {
        title: '阵营身份弹窗',
        summary: '由“所属势力”芯片进入，直接展示该角色在各势力中的身份。',
        fields: ['activeChar.社交.势力'],
        duties: ['展示所属势力列表', '显示身份与权限级', '在势力矩阵中高亮当前归属'],
        actions: ['跳转势力矩阵', '查看晋升入口']
      },
      '人物关系详细页': {
        title: '人物关系弹窗',
        summary: '由“关系摘要”芯片进入，承接重型 社交.关系 结构。',
        fields: ['activeChar.社交.关系'],
        duties: ['显示好感度与阶段', '显示关系路线与推进提示', '展示对方身份、好感加成 与分析结果'],
        actions: ['查看关系路线', '查看关系推进重点', '闲聊 / 送礼 / 请教 / 切磋 / 表白']
      },
      '情报库详细页': {
        title: '情报库弹窗',
        summary: '由“已解锁情报”芯片进入，统一展开已知信息、待解锁线索与战斗记录。',
        fields: ['activeChar.已掌握情报', 'activeChar.待解锁情报', 'activeChar.记录', 'activeChar.战斗历史'],
        duties: ['展示已解锁情报', '显示待解锁线索', '聚合近期记录与战斗摘要'],
        actions: ['按情报筛选', '跳转关联节点']
      },
      '武装工坊详细页': {
        title: '武装工坊弹窗',
        summary: '查看当前武装、斗铠部件与副职业工坊。',
        fields: ['activeChar.装备.武器', 'activeChar.装备.斗铠', 'activeChar.装备.机甲', 'activeChar.装备.饰品', 'activeChar.职业'],
        duties: ['展示武器/斗铠/机甲', '展示装备槽位状态', '显示副职业等级与融合信息'],
        actions: ['打开斗铠总览', '查看槽位覆盖', '浏览装备摘要']
      },
      '武魂融合技详细页': {
        title: '武魂融合技档案',
        summary: '集中查看当前角色已录入的武魂融合技、自体融合与多人融合信息。',
        fields: ['activeChar.武魂融合技.*.融合模式', 'activeChar.武魂融合技.*.融合对象', 'activeChar.武魂融合技.*.来源武魂', 'activeChar.武魂融合技.*.融合参与者', 'activeChar.武魂融合技.*.技能数据'],
        duties: ['展示融合技总览', '区分自体融合与多人融合', '直接下钻到融合技设计与效果详情'],
        actions: ['查看融合模式', '查看来源武魂', '打开融合技详情']
      },
      '储物仓库详细页': {
        title: '储物仓库',
        summary: '聚合当前背包与货币数据，并以仓库式视图展示核心物资。',
        fields: ['activeChar.背包', 'activeChar.财富'],
        duties: ['展示物品数量', '展示品质/品阶/描述', '整合多种货币与资产摘要'],
        actions: ['按分类筛选', '查看物品详情', '整理 / 使用道具']
      },
      '血脉封印详细页': {
        title: '血脉封印弹窗',
        summary: '承接血脉体系的状态模块，在 1 个页面内汇总封印层级与当前能力。',
        fields: ['activeChar.武魂', 'activeChar.魂骨', 'activeChar.血脉之力.技能', 'activeChar.血脉之力.气血魂环', 'activeChar.功法 / 特殊能力'],
        duties: ['展示血脉本体', '展示封印/魂环/魂技', '展示当前已固化能力'],
        actions: ['按页签查看魂环 / 能力 / 魂骨 / 血脉', '悬浮魂环查看技能说明', '查看封印层级']
      },
      '全息星图主画布': {
        title: '全息星图主画布',
        summary: '星图页本身就是 1级地图页；点击主画布或节点后，直接下钻到节点详情弹窗。',
        fields: ['WORLD_MAP_TREE', 'sd.world.地点', 'sd.world.动态地点', 'activeChar.状态.位置'],
        duties: ['显示地图主视图', '高亮当前节点', '驱动节点级下钻'],
        actions: ['点击节点开详情', '切换图层控制', '查看跑图与交易可用性']
      },
      '当前节点详情': {
        title: '当前节点详情弹窗',
        summary: '用于查看当前位置归一化后的完整节点信息。',
        fields: ['activeChar.状态.位置', 'sd.world.地点[normalizedLoc]', 'WORLD_MAP_TREE 当前节点', '商店'],
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
        summary: '承接 world.动态地点，避免把动态节点硬塞进地图首页。',
        fields: ['sd.world.动态地点'],
        duties: ['列出剧情新增地点', '显示归属父节点', '用于补地图树的动态扩展'],
        actions: ['按父节点筛选', '跳到地图节点详情']
      },
      '拍卖与警报': {
        title: '拍卖行 / 世界警报弹窗',
        summary: '拍卖状态、拍品与当前世界警报。',
        fields: ['sd.world.拍卖', 'sd.world.累计击杀年限'],
        duties: ['显示拍卖状态与拍品', '显示生态风险与兽潮相关阈值', '显示下次刷新时间'],
        actions: ['查看拍卖清单', '评估当前世界风险']
      },
      '势力矩阵总览': {
        title: '势力矩阵弹窗',
        summary: '满足“查看所有势力”的核心入口，不再只显示当前角色视角。',
        fields: ['sd.org', 'activeChar.社交.势力'],
        duties: ['浏览所有势力', '显示影响力与底蕴', '高亮当前角色所属势力'],
        actions: ['按阵营筛选', '查看势力档案', '查看本地据点与交易关联']
      },
      '我的阵营详情': {
        title: '我的阵营弹窗',
        summary: '聚焦当前查看角色在各势力中的身份与权限。',
        fields: ['activeChar.社交.势力', 'activeChar.社交.主身份', 'activeChar.社交.称号'],
        duties: ['展示所属势力', '展示身份与权限级', '补充主身份与头衔'],
        actions: ['跳转势力矩阵', '查看晋升入口']
      },
      '本地据点详情': {
        title: '本地据点弹窗',
        summary: '围绕当前节点展示据点级信息，是星图与势力页的交叉入口。',
        fields: ['activeChar.状态.位置', 'sd.world.地点[normalizedLoc]'],
        duties: ['显示掌控势力/人口/守护军团', '显示经济状况', '整理本地设施与商店'],
        actions: ['查看本地商店信息', '跳回地图节点详情']
      },
      '系统播报与日志': {
        title: '系统播报 / 日志弹窗',
        summary: '终端页左侧主模块，集中展示系统广播与最近日志。',
        fields: ['sd.sys.rsn', 'sd.sys.seq', 'sd.sys.最近检定', 'sd.sys.最终成功率'],
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
        title: '情报',
        summary: '把试炼入口、近期线索和下一步调查重点放在同一页里直接看。',
        highlights: ['当前可去的试炼', '已经掌握的情报', '下一步最值得跟进的线索'],
        duties: ['查看试炼开放情况', '查看近期重点情报', '查看下一步行动建议'],
        actions: ['选择先做试炼还是先查线索', '根据消息调整远行顺序']
      },
      '近期见闻': {
        title: '见闻',
        summary: '将近期广播、地点动态与可跟进线索集中收纳于此。',
        highlights: ['最近广播与动态', '地点与行程相关消息', '值得跟进的线索'],
        duties: ['查看当前最重要的近期消息', '查看地点与人物的最新变化', '判断哪些动静值得优先跟进'],
        actions: ['前往相关地点继续确认', '根据消息调整今日路线']
      },
      '怪物图鉴': {
        title: '怪物图鉴',
        summary: '已遭遇的深渊生物与魂兽标准数据记录。',
        fields: ['sd.world.图鉴'],
        duties: ['查看已记录怪物', '复用物种基础数据', '回顾遭遇对象'],
        actions: ['按名称查阅', '查看已记录条目']
      },
      '森林仇恨值': {
        title: '森林仇恨值',
        summary: '星斗大森林累计击杀魂兽年限与兽潮阈值监控。',
        fields: ['sd.world.累计击杀年限', 'sd.world.标记.beast_tide'],
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
        .replace(/player_action/gi, '玩家行动')
        .replace(/settle_result/gi, '结算结果')

        .replace(/捐献请求/gi, '捐赠安排')
        .replace(/猎魂请求/gi, '狩猎安排')
        .replace(/升灵台请求/gi, '升灵台安排')
        .replace(/魂灵塔请求/gi, '魂灵塔安排')
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
      const tileItems = Array.isArray(items) ? items : [];
      const compactIntelGrid =
        tileItems.length === 2
        && tileItems.every(item => ['线索', '影响'].includes(toText(item && item.label, '')));
      const gridStyle = compactIntelGrid ? ' style="grid-template-columns:minmax(0, 2.2fr) minmax(120px, 0.8fr); gap:12px;"' : '';
      const tileStyle = compactIntelGrid ? ' style="min-height:0; padding:12px 14px;"' : '';
      const valueStyle = compactIntelGrid ? ' style="line-height:1.7;"' : '';
      return `
        <div class="archive-tile-grid ${className}"${gridStyle}>
          ${tileItems.map(item => `
            <div class="archive-tile"${tileStyle}>
              <b>${item.label}</b>
              <span${valueStyle}>${item.value}</span>
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
      const normalizeBonusValue = value => {
        const numeric = toNumber(value, 0);
        if (numeric > 0) return Math.floor(numeric);
        if (numeric < 0) return Math.ceil(numeric);
        return 0;
      };
      const items = [];
      if (options.includeLvEquiv && toNumber(bonus.等效等级, 0) > 0) items.push({ label: '等效等级', value: String(toNumber(bonus.等效等级, 0)) });
      items.push(
        { label: '体力加成', value: formatNumber(normalizeBonusValue(bonus.体力上限)) },
        { label: '魂力加成', value: formatNumber(normalizeBonusValue(bonus.魂力上限)) },
        { label: '精神加成', value: formatNumber(normalizeBonusValue(bonus.精神力上限)) },
        { label: '力量加成', value: formatNumber(normalizeBonusValue(bonus.力量)) },
        { label: '防御加成', value: formatNumber(normalizeBonusValue(bonus.防御)) },
        { label: '敏捷加成', value: formatNumber(normalizeBonusValue(bonus.敏捷)) }
      );
      return items;
    }

    function buildEditableStatBonusItems(basePath = [], statsBonus = {}, options = {}) {
      const path = Array.isArray(basePath) ? basePath : [];
      const bonus = statsBonus && typeof statsBonus === 'object' ? statsBonus : {};
      const includeSoulPower = options.includeSoulPower !== false;
      const makeBonusValue = field => {
        const numeric = toNumber(bonus[field], 0);
        const rawValue = numeric > 0 ? Math.floor(numeric) : numeric < 0 ? Math.ceil(numeric) : 0;
        return path.length
          ? makeInlineEditableValue(formatNumber(rawValue), {
              path: [...path, field],
              kind: 'number',
              rawValue,
              editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' }
            })
          : htmlEscape(formatNumber(rawValue));
      };
      return [
        { label: '体力加成', value: makeBonusValue('体力上限') },
        ...(includeSoulPower ? [{ label: '魂力加成', value: makeBonusValue('魂力上限') }] : []),
        { label: '精神加成', value: makeBonusValue('精神力上限') },
        { label: '力量加成', value: makeBonusValue('力量') },
        { label: '防御加成', value: makeBonusValue('防御') },
        { label: '敏捷加成', value: makeBonusValue('敏捷') }
      ];
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

    const SPIRIT_ATTRIBUTE_SYSTEM_OPTIONS = Object.freeze(['无', '元素', '五行']);
    const SPIRIT_ATTRIBUTE_TOKEN_OPTIONS = Object.freeze([
      '金', '木', '水', '火', '土',
      '风', '雷', '冰',
      '光', '暗', '精神',
      '空间', '时间',
      '创造', '毁灭',
    ]);
    const WUXING_ATTRIBUTE_TOKEN_OPTIONS = Object.freeze(['金', '木', '水', '火', '土']);

    function normalizeSpiritAttributeTokenList(value = []) {
      return normalizeEditorStringList(value).filter(token => SPIRIT_ATTRIBUTE_TOKEN_OPTIONS.includes(token));
    }

    function resolveSpiritAttributeUiState(spiritData = {}) {
      const rawSystem = normalizeSkillUiText(spiritData && spiritData['属性体系'], '无');
      const attributeSystem = SPIRIT_ATTRIBUTE_SYSTEM_OPTIONS.includes(rawSystem) ? rawSystem : '无';
      const unlockedAttrs = normalizeSpiritAttributeTokenList(spiritData && spiritData['已解锁属性']);
      let capacityAttrs = normalizeSpiritAttributeTokenList(spiritData && spiritData['可容纳属性']);
      if (!capacityAttrs.length) {
        if (attributeSystem === '五行') capacityAttrs = [...WUXING_ATTRIBUTE_TOKEN_OPTIONS];
        else if (attributeSystem === '元素' && unlockedAttrs.length) capacityAttrs = [...unlockedAttrs];
      }
      return {
        attributeSystem,
        unlockedAttrs,
        capacityAttrs,
      };
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
        const found = deepGet(source, ['部件', key], null)
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
      const currentLoc = toText(deepGet(activeChar, '状态.位置', snapshot.currentLoc || '当前位置'), '当前位置').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '');
      const armor = deepGet(activeChar, '装备.斗铠', {});
      const mech = deepGet(activeChar, '装备.机甲', {});
      const weapon = deepGet(activeChar, '装备.武器', {});
      const accessoryEntries = listAccessoryEntries(deepGet(activeChar, '装备.饰品', {}));
      const armorName = toText(armor.名称 || armor['名称'], '当前斗铠');
      const mechName = toText(mech.型号 || mech['型号'], '当前机甲');
      const actionMap = {
        equip_mech: { title: '装备机甲', playerInput: `我要在【${currentLoc}】装备机甲【${mechName}】。`, note: `请按 MVU 装备规则将 char.装备.机甲.装备状态 处理为“已装备”。若当前斗铠已装备且机甲不是红级，请同步处理斗铠卸下并清空对应 _属性加成。` },
        unequip_mech: { title: '卸下机甲', playerInput: `我要在【${currentLoc}】解除机甲【${mechName}】的装载。`, note: `请将 char.装备.机甲.装备状态 处理为“未装备”，并将 机甲._属性加成 清零。` },
        equip_armor: { title: '穿戴斗铠', playerInput: `我要在【${currentLoc}】穿戴斗铠【${armorName}】。`, note: `请按 MVU 装备规则尝试将 char.装备.斗铠.装备状态 处理为“已装备”。需要校验斗铠等级门槛（1字50级/2字70级/3字80级/4字90级）；若不满足则保持未装备并写入装备反噬。若当前已装备非红级机甲，斗铠不能保持已装备。` },
        unequip_armor: { title: '卸下斗铠', playerInput: `我要在【${currentLoc}】解除斗铠【${armorName}】的装备状态。`, note: `请将 char.装备.斗铠.装备状态 处理为“未装备”，并将 斗铠._属性加成 清零。` }
      };
      const actionMeta = actionMap[actionType];
      if (!actionMeta) return null;
      const systemPrompt = `以下内容属于前端发起的装备管理请求，不要在正文直接复述“系统提示 / 请求类型 / JSONPatch”等术语。\n\n[装备管理]\n角色：${activeName}\n地点：${currentLoc}\n动作：${actionMeta.title}\n当前斗铠：${summarizeArmoryValue(armor.名称 || armor['名称'] || armor.装备状态 || '无')}\n当前机甲：${summarizeArmoryValue(mech.型号 || mech['型号'] || mech.装备状态 || '无')}\n当前主武器：${summarizeArmoryValue(weapon.名称 || weapon['名称'] || '无')}\n当前附件：${summarizeAccessoryEntries(accessoryEntries)}\n\n${actionMeta.note}\n\n请将这次操作写成自然剧情，并在需要时同步更新角色的装备状态、相关装备字段与系统播报。`;
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
              data-hover-char="${attr(item.charKey || '')}"
              data-hover-type="${attr(item.type || item.meta || '--')}"
              data-hover-rarity="${attr(item.rarity || '--')}"
              data-hover-qty="${attr(`×${item.qty}`)}"
              data-hover-count="${attr(item.qty)}"
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

    function makeDossierRows(items, className = '') {
      const rowItems = Array.isArray(items) ? items.filter(Boolean) : [];
      const columnCount = /\bdossier-row-grid--three\b/.test(className)
        ? 3
        : (/\bdossier-row-grid--two\b/.test(className) ? 2 : 1);
      const paddedItems = [];
      let usedSlots = 0;

      rowItems.forEach(item => {
        const itemClassName = item && item.className ? item.className : '';
        const isWide = columnCount > 1 && /\bdossier-row--wide\b/.test(itemClassName);

        if (isWide && usedSlots > 0) {
          while (usedSlots < columnCount) {
            paddedItems.push({ label: '\u00A0', value: '\u00A0', className: 'dossier-row--ghost' });
            usedSlots += 1;
          }
          usedSlots = 0;
        }

        paddedItems.push(item);

        if (columnCount === 1) return;
        if (isWide) {
          usedSlots = 0;
          return;
        }

        usedSlots += 1;
        if (usedSlots >= columnCount) usedSlots = 0;
      });

      if (columnCount > 1 && usedSlots > 0) {
        while (usedSlots < columnCount) {
          paddedItems.push({ label: '\u00A0', value: '\u00A0', className: 'dossier-row--ghost' });
          usedSlots += 1;
        }
      }

      return `
        <div class="dossier-row-grid ${className}">
          ${paddedItems.map(item => `
            <div class="dossier-row ${item && item.className ? item.className : ''}">
              <b>${htmlEscape(toText(item && item.label, ''))}</b>
              <span>${item && item.value !== undefined && item.value !== null ? item.value : ''}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    function makeDossierTags(items, className = '') {
      return `
        <div class="dossier-tag-row ${className}">
          ${(Array.isArray(items) ? items : []).map(item => `<span class="dossier-pill ${item && item.className ? item.className : ''}">${htmlEscape(toText(item && item.text, ''))}</span>`).join('')}
        </div>
      `;
    }

    function makeDossierList(items, className = '') {
      const listItems = Array.isArray(items) ? items : [];
      return `
        <div class="dossier-list ${className}">
          ${listItems.map(item => `
            <div class="dossier-list-row ${item && item.className ? item.className : ''} ${item && item.preview ? 'clickable' : ''}"${item && item.preview ? ` data-preview="${escapeHtmlAttr(item.preview)}"` : ''}>
              <b>${htmlEscape(toText(item && item.title, ''))}</b>
              <span>${item && item.desc !== undefined && item.desc !== null ? item.desc : ''}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    function makeDossierMeter(label, value, percent, className = '') {
      return `
        <div class="dossier-meter ${className}">
          <div class="dossier-meter-head">
            <b>${htmlEscape(toText(label, ''))}</b>
            <span>${value !== undefined && value !== null ? value : ''}</span>
          </div>
          <div class="dossier-meter-track"><div class="dossier-meter-fill" style="width:${Math.max(0, Math.min(100, toNumber(percent, 0)))}%;"></div></div>
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
          title: '详细档案',
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
                    <div class="identity-panel identity-look-panel">
                      <div class="identity-panel-title">外貌概览</div>
                      <div class="identity-look-grid">
                        <div class="meta-item"><b>发色</b><span></span></div>
                        <div class="meta-item"><b>发型</b><span></span></div>
                        <div class="meta-item"><b>瞳色</b><span></span></div>
                        <div class="meta-item"><b>身高</b><span></span></div>
                        <div class="meta-item"><b>体型</b><span></span></div>
                        <div class="meta-item meta-item-wide"><b>长相描述</b><span></span></div>
                        <div class="meta-item meta-item-wide"><b>特征</b><span></span></div>
                      </div>
                    </div>
                  </div>
                  <div class="status-card">
                    <h4 style="margin:0 0 6px;font-size:13px;font-family:var(--font-title);color:var(--white);">当前状态</h4>
                    <div class="status-list">
                      <div class="status-row"><b>行动状态</b><span></span></div>
                      <div class="status-row"><b>伤势</b><span></span></div>
                      <div class="status-row"><b>灵物吸收</b><span></span></div>
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
                <div class="archive-card-head"><div class="archive-card-title">情报概览</div></div>
                <div class="intel-progress-slots" style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:12px;">
                  <div class="intel-slot" style="min-height:0; padding:12px 14px;"><div class="intel-slot-name">已解锁情报</div><div class="intel-slot-bar-wrap" style="height:6px; margin:8px 0 10px;"><div class="intel-slot-bar" style="width:0%;"></div></div><div class="intel-slot-value">0</div></div>
                  <div class="intel-slot" style="min-height:0; padding:12px 14px;"><div class="intel-slot-name">待解锁线索</div><div class="intel-slot-bar-wrap" style="height:6px; margin:8px 0 10px;"><div class="intel-slot-bar gold" style="width:0%;"></div></div><div class="intel-slot-value" style="color:var(--gold);">0</div></div>
                  <div class="intel-slot" style="min-height:0; padding:12px 14px;"><div class="intel-slot-name">任务记录</div><div class="intel-slot-bar-wrap" style="height:6px; margin:8px 0 10px;"><div class="intel-slot-bar" style="width:0%; background:var(--red); box-shadow:0 0 8px var(--red);"></div></div><div class="intel-slot-value" style="color:var(--red);">0</div></div>
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

      if (key === '武魂融合技详细页') {
        return {
          title: '武魂融合技档案',
          body: `
            <div class="archive-modal-grid dossier-shell">
              <div class="archive-card dossier-card">
                <div class="archive-card-head"><div class="archive-card-title">融合技概览</div></div>
                <section class="dossier-section">
                  <div class="dossier-section-title">基础统计</div>
                  ${makeDossierRows([
                    { label: '总收录', value: '' },
                    { label: '双人融合', value: '' },
                    { label: '自体融合', value: '' },
                    { label: '当前角色', value: '' }
                  ], 'dossier-row-grid--two')}
                </section>
              </div>
              <div class="archive-card dossier-card">
                <div class="archive-card-head"><div class="archive-card-title">融合技清单</div></div>
                <section class="dossier-section">
                  <div class="dossier-section-title">技能条目</div>
                  <div class="dossier-empty-note">融合技内容正在整理中。</div>
                </section>
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
    const BATTLE_INLINE_PREVIEW_KEY = '战斗终端';
    let battleInlineDismissed = false;
    let battleInlineMountToken = 0;
    let battleReturnEntrySyncToken = 0;
    let pendingBattleInlineMount = null;
    let liveSnapshot = null;
    let lastRenderableSnapshot = null;
    let preferredActiveCharacterName = '';
    let currentModalPreviewKey = '';
    let currentUnifiedPreviewKey = '';
    let lastRenderedUnifiedPreviewKey = '';
    let mapDispatchContext = null;
    let activeSubUI = null;
    let lastAutoTradeRequestSignature = '';
    let hasHydratedAutoTradeRequestSignature = false;
    let lastInjectedModuleArbitrationPrompt = false;
    let lastRenderedShellPreviewKey = '';
    let activeInlineEditState = null;
    let inlineEditSessionToken = 0;
    let inlineEditGuardUntil = 0;
    let pendingLiveRefresh = false;
    let skillDesignerDraftStateByPreviewKey = Object.create(null);
    let lastHeaderRenderSignature = '';
    let lastDashboardRenderSignature = '';
    let lastDashboardSectionRenderSignatures = null;
    let liveUiRefCache = new Map();

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
      return !!text && (/待补全|待补充|待生成|待展露|TODO/i.test(text));
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

    function formatCultivationLevelValue(value, fallback = '0') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        if (Math.abs(parsed - 99.5) < 0.001) return '准神';
        return String(parsed);
      }
      const text = toText(value, fallback);
      return text || fallback;
    }

    function formatCultivationLevelBadge(value, fallback = '0') {
      return `Lv.${formatCultivationLevelValue(value, fallback)}`;
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
      const currentLv = toNumber(stat && stat.等级, 0);
      if (currentLv >= 100) {
        return { needed: 0, nextLevel: currentLv, isMax: true };
      }
      const currentSpMax = toNumber(stat && stat.魂力上限, 0);
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

    function getDisplayHpPair(stat = {}) {
      const hpMax = Math.max(1, toNumber(stat && (stat.HP上限 ?? stat.体力上限), 1));
      const hp = Math.max(0, Math.min(hpMax, toNumber(stat && (stat.HP ?? stat.体力), hpMax)));
      return { hp, hpMax };
    }

    function getDisplayWoundLabel(stat = {}) {
      const { hp, hpMax } = getDisplayHpPair(stat);
      const ratio = hp / Math.max(1, hpMax);
      if (ratio <= 0.05 && hp > 0) return '濒死';
      if (ratio <= 0.2) return '重伤';
      if (ratio <= 0.5) return '轻伤';
      return '无';
    }

    function normalizeInjurySeverity(value) {
      const text = toText(value, '轻').trim();
      if (['轻', '中', '重'].includes(text)) return text;
      if (/重/.test(text)) return '重';
      if (/中/.test(text)) return '中';
      return '轻';
    }

    function getDisplayInjuryEntries(status = {}) {
      const injuryMap =
        status && status.受伤部位 && typeof status.受伤部位 === 'object' && !Array.isArray(status.受伤部位)
          ? status.受伤部位
          : {};
      return Object.entries(injuryMap)
        .map(([part, injury]) => {
          const name = toText(part, '').trim();
          if (!name) return null;
          const info = injury && typeof injury === 'object' ? injury : {};
          return [
            name,
            {
              程度: normalizeInjurySeverity(info.程度),
              描述: toText(info.描述, '').trim(),
            },
          ];
        })
        .filter(Boolean);
    }

    function buildInjurySummaryText(status = {}, options = {}) {
      const entries = getDisplayInjuryEntries(status);
      const emptyText = toText(options.empty, '无').trim() || '无';
      if (!entries.length) return emptyText;
      const limit = Math.max(1, toNumber(options.limit, 2));
      const parts = entries
        .slice(0, limit)
        .map(([name, injury]) => `${shortenText(name, 6)}·${normalizeInjurySeverity(injury.程度)}`);
      if (entries.length > limit) parts.push(`等${entries.length}处`);
      return parts.join('、');
    }

    function buildInjuryCrudHtml(activeCharKey = '', status = {}) {
      const safeCharKey = toText(activeCharKey, '').trim();
      const entries = getDisplayInjuryEntries(status);
      const entryHtml = entries.length
        ? entries
          .map(([name, injury]) => {
            const basePath = ['char', safeCharKey, '状态', '受伤部位', name];
            const renameMeta = { renameObjectKey: true, parentPath: ['char', safeCharKey, '状态', '受伤部位'], oldKey: name };
            return `
              <div class="injury-entry">
                <div class="injury-entry-head">
                  <span class="injury-entry-name">${safeCharKey
                    ? makeInlineEditableValue(name, {
                      path: [...basePath],
                      kind: 'string',
                      rawValue: name,
                      editorMeta: renameMeta,
                    })
                    : htmlEscape(name)}</span>
                  <span class="injury-entry-degree">${safeCharKey
                    ? makeInlineEditableValue(normalizeInjurySeverity(injury.程度), {
                      path: [...basePath, '程度'],
                      kind: 'enum_select',
                      rawValue: normalizeInjurySeverity(injury.程度),
                      editorMeta: { options: ['轻', '中', '重'] },
                    })
                    : htmlEscape(normalizeInjurySeverity(injury.程度))}</span>
                  ${safeCharKey
                    ? `<button type="button" class="tag-chip injury-action-btn" data-injury-action="delete" data-injury-char="${escapeHtmlAttr(safeCharKey)}" data-injury-key="${escapeHtmlAttr(name)}">删除</button>`
                    : ''}
                </div>
                <div class="injury-entry-desc">${safeCharKey
                  ? makeInlineEditableValue(injury.描述 || '未填写描述', {
                    path: [...basePath, '描述'],
                    kind: 'string',
                    rawValue: injury.描述 || '',
                    multiline: true,
                  })
                  : htmlEscape(injury.描述 || '未填写描述')}</div>
              </div>`;
          })
          .join('')
        : `<div class="injury-empty">暂无受伤部位记录</div>`;
      if (!safeCharKey) return `<div class="injury-crud-panel">${entryHtml}</div>`;
      return `
        <div class="injury-crud-panel">
          <div class="request-console-row injury-create-row" data-injury-panel="create">
            <input type="text" class="request-console-input injury-create-input" data-injury-input="name" placeholder="部位名" />
            <select class="request-console-input injury-create-select" data-injury-input="degree">
              <option value="轻" selected>轻</option>
              <option value="中">中</option>
              <option value="重">重</option>
            </select>
            <input type="text" class="request-console-input injury-create-input injury-create-desc" data-injury-input="desc" placeholder="描述" />
            <button type="button" class="tag-chip live injury-action-btn" data-injury-action="add" data-injury-char="${escapeHtmlAttr(safeCharKey)}">新增</button>
          </div>
          ${entryHtml}
        </div>`;
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

    const TRAINED_BONUS_PREVIEW_FIELDS = Object.freeze(['力量', '防御', '敏捷', '体力上限', '精神力上限']);
    const trainedBonusPreviewOverrides = new Map();

    function createTrackedStatPreviewMap(source = {}) {
      return {
        力量: Math.floor(toNumber(source && source.力量, 0)),
        防御: Math.floor(toNumber(source && source.防御, 0)),
        敏捷: Math.floor(toNumber(source && source.敏捷, 0)),
        体力上限: Math.floor(toNumber(source && source.体力上限, 0)),
        精神力上限: Math.floor(toNumber(source && source.精神力上限, 0)),
      };
    }

    function createTrackedStatDeltaMap(source = {}) {
      return {
        力量: Math.floor(toNumber(source && source.力量, 0)),
        防御: Math.floor(toNumber(source && source.防御, 0)),
        敏捷: Math.floor(toNumber(source && source.敏捷, 0)),
        体力上限: Math.floor(toNumber(source && source.体力上限, 0)),
        精神力上限: Math.floor(toNumber(source && source.精神力上限, 0)),
      };
    }

    function isTrainedBonusPreviewPath(path = []) {
      return Array.isArray(path)
        && path.length >= 5
        && path[0] === 'char'
        && path[2] === '属性'
        && path[3] === '训练加成'
        && TRAINED_BONUS_PREVIEW_FIELDS.includes(String(path[4] || '').trim());
    }

    function queueTrainedBonusPreviewOverride(path = [], previousValue = 0, nextValue = 0) {
      if (!isTrainedBonusPreviewPath(path)) return null;
      const charKey = String(path[1] || '').trim();
      const field = String(path[4] || '').trim();
      if (!charKey || !field) return null;

      const previousNumeric = Math.floor(toNumber(previousValue, 0));
      const nextNumeric = Math.floor(toNumber(nextValue, 0));
      const delta = nextNumeric - previousNumeric;
      if (!delta) return null;

      const hadPreviousEntry = trainedBonusPreviewOverrides.has(charKey);
      const previousEntry = hadPreviousEntry ? cloneJsonValue(trainedBonusPreviewOverrides.get(charKey), null) : null;
      const liveStat = liveSnapshot ? deepGet(liveSnapshot, ['rootData', 'char', charKey, '属性'], {}) : {};
      const nextEntry = previousEntry && typeof previousEntry === 'object'
        ? previousEntry
        : { baseStats: createTrackedStatPreviewMap(liveStat), deltas: createTrackedStatDeltaMap() };

      if (!nextEntry.baseStats || typeof nextEntry.baseStats !== 'object') nextEntry.baseStats = createTrackedStatPreviewMap(liveStat);
      if (!nextEntry.deltas || typeof nextEntry.deltas !== 'object') nextEntry.deltas = createTrackedStatDeltaMap();
      nextEntry.deltas[field] = Math.floor(toNumber(nextEntry.deltas[field], 0) + delta);
      trainedBonusPreviewOverrides.set(charKey, nextEntry);

      return {
        charKey,
        existed: hadPreviousEntry,
        previousEntry,
      };
    }

    function restoreTrainedBonusPreviewOverride(rollbackToken) {
      if (!rollbackToken || !rollbackToken.charKey) return;
      if (rollbackToken.existed && rollbackToken.previousEntry && typeof rollbackToken.previousEntry === 'object') {
        trainedBonusPreviewOverrides.set(rollbackToken.charKey, rollbackToken.previousEntry);
        return;
      }
      trainedBonusPreviewOverrides.delete(rollbackToken.charKey);
    }

    function resolveTrackedStatPreview(charKey = '', stat = {}) {
      const safeCharKey = String(charKey || '').trim();
      const rawStats = createTrackedStatPreviewMap(stat);
      if (!safeCharKey || !trainedBonusPreviewOverrides.has(safeCharKey)) return rawStats;

      const entry = trainedBonusPreviewOverrides.get(safeCharKey) || {};
      const baseStats = createTrackedStatPreviewMap(entry.baseStats || rawStats);
      const deltas = createTrackedStatDeltaMap(entry.deltas || {});
      const previewStats = {
        力量: baseStats.力量 + deltas.力量,
        防御: baseStats.防御 + deltas.防御,
        敏捷: baseStats.敏捷 + deltas.敏捷,
        体力上限: baseStats.体力上限 + deltas.体力上限,
        精神力上限: baseStats.精神力上限 + deltas.精神力上限,
      };

      const allSettled = TRAINED_BONUS_PREVIEW_FIELDS.every(field => rawStats[field] === previewStats[field]);
      const hasExternalDrift = TRAINED_BONUS_PREVIEW_FIELDS.some(field => rawStats[field] !== baseStats[field] && rawStats[field] !== previewStats[field]);
      if (allSettled || hasExternalDrift) {
        trainedBonusPreviewOverrides.delete(safeCharKey);
        return rawStats;
      }
      return previewStats;
    }

    function normalizeEditorPath(pathValue) {
      if (Array.isArray(pathValue)) {
        const normalized = pathValue
          .map(token => (typeof token === 'number' ? token : String(token ?? '').trim()))
          .filter(token => token !== '' && token !== null && token !== undefined);
        return stripWrapperPathPrefix(normalized);
      }
      const raw = String(pathValue ?? '')
        .trim()
        .replace(/^stat_data\./, '')
        .replace(/\[(\d+)\]/g, '.$1')
        .replace(/\["([^"]+)"\]/g, '.$1')
        .replace(/\['([^']+)'\]/g, '.$1');
      if (!raw) return [];
      const normalized = raw
        .split('.')
        .map(token => token.trim())
        .filter(Boolean)
        .map(token => (/^\d+$/.test(token) ? Number(token) : token))
        .filter(token => token !== '' && token !== null && token !== undefined);
      return stripWrapperPathPrefix(normalized);
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
        if (Array.isArray(current) && token === '-') {
          if (isLast) {
            current.push(nextValue);
            return target;
          }
          const nextToken = path[index + 1];
          const created = typeof nextToken === 'number' || nextToken === '-' ? [] : {};
          current.push(created);
          current = created;
          continue;
        }
        if (isLast) {
          current[token] = nextValue;
          return target;
        }
        const nextToken = path[index + 1];
        if (!current[token] || typeof current[token] !== 'object') {
          current[token] = typeof nextToken === 'number' || nextToken === '-' ? [] : {};
        }
        current = current[token];
      }
      return target;
    }

    function deepDeleteMutable(target, pathValue) {
      const path = normalizeEditorPath(pathValue);
      if (!target || typeof target !== 'object' || !path.length) {
        throw new Error('变量路径不能为空。');
      }
      let current = target;
      for (let index = 0; index < path.length - 1; index += 1) {
        const token = path[index];
        if (!current || typeof current !== 'object' || !(token in current)) return target;
        current = current[token];
      }
      const lastToken = path[path.length - 1];
      if (Array.isArray(current) && typeof lastToken === 'number') {
        if (lastToken >= 0 && lastToken < current.length) current.splice(lastToken, 1);
        return target;
      }
      if (current && typeof current === 'object') {
        delete current[lastToken];
      }
      return target;
    }

    function decodeJsonPointerPath(pointer) {
      const raw = String(pointer ?? '').trim();
      if (!raw || raw === '/') return [];
      const normalized = raw
        .split('/')
        .slice(1)
        .map(token => token.replace(/~1/g, '/').replace(/~0/g, '~'))
        .map(token => (/^\d+$/.test(token) ? Number(token) : token));
      return stripWrapperPathPrefix(normalized);
    }

    async function applyJsonPatchOpsByEditor(patches, options = {}) {
      const safePatches = Array.isArray(patches) ? patches.filter(item => item && item.op && item.path) : [];
      if (!safePatches.length) throw new Error('没有可应用的变量改动。');
      return mutateStatDataByEditor(statData => {
        safePatches.forEach(patch => {
          const path = decodeJsonPointerPath(patch.path);
          if (!path.length) return;
          if (patch.op === 'remove') {
            deepDeleteMutable(statData, path);
            return;
          }
          if (patch.op === 'replace' || patch.op === 'add') {
            deepSetMutable(statData, path, cloneJsonValue(patch.value, patch.value));
          }
        });
      }, options);
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

    function parseEditorInputValue(rawValue, kind = 'string', meta = {}) {
      const safeKind = String(kind || 'string').trim().toLowerCase();
      const text = String(rawValue ?? '');
      if (safeKind === 'number') {
        const normalized = text.trim().replace(/,/g, '');
        if (!normalized) throw new Error('数字字段不能为空。');
        const parsed = Number(normalized);
        if (!Number.isFinite(parsed)) throw new Error(`无法识别数字：${text}`);
        const numericMeta = normalizeInlineNumericMeta(meta, parsed);
        if (numericMeta.integer && !Number.isInteger(parsed)) throw new Error('该字段只接受整数。');
        if (numericMeta.min !== null && parsed < numericMeta.min) throw new Error(`数值不能小于 ${formatNumber(numericMeta.min)}。`);
        if (numericMeta.max !== null && parsed > numericMeta.max) throw new Error(`数值不能大于 ${formatNumber(numericMeta.max)}。`);
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
      if (safeKind === 'string_list' || safeKind === 'token_multi') {
        return normalizeEditorStringList(text);
      }
      if (safeKind === 'enum_select') return text.trim();
      if (safeKind === 'null') return null;
      return text;
    }

    function formatEditorValue(value, kind = 'string') {
      if (value === undefined || value === null) return '';
      if (['string_list', 'token_multi'].includes(String(kind || 'string').trim().toLowerCase())) {
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
      const multiline = options.multiline ? '1' : '0';
      const editorMeta =
        options.editorMeta && typeof options.editorMeta === 'object'
          ? ` data-inline-editor-meta="${escapeHtmlAttr(JSON.stringify(options.editorMeta))}"`
          : '';
      return `<span class="mvu-inline-editable${classAttr}" tabindex="0" data-inline-editable="1" data-inline-multiline="${multiline}" data-value-kind="${escapeHtmlAttr(kind)}" data-mvu-path="${escapeHtmlAttr(JSON.stringify(path))}" data-mvu-raw-value="${escapeHtmlAttr(formatEditorValue(rawValue, kind))}"${editorMeta}>${htmlEscape(displayText)}</span>`;
    }

    function readInlineEditorMeta(target) {
      if (!target || !(target instanceof HTMLElement)) return {};
      try {
        const raw = target.getAttribute('data-inline-editor-meta') || '{}';
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
      } catch (error) {
        return {};
      }
    }

    function normalizeInlineEditorOptions(meta = {}) {
      return Array.from(
        new Set(
          (Array.isArray(meta && meta.options) ? meta.options : [])
            .map(item => toText(item, '').trim())
            .filter(Boolean),
        ),
      );
    }

    function normalizeInlineNumericMeta(meta = {}, rawValue = undefined) {
      const normalized = meta && typeof meta === 'object' ? meta : {};
      const min = Number(normalized.min);
      const max = Number(normalized.max);
      const step = Number(normalized.step);
      return {
        min: Number.isFinite(min) ? min : null,
        max: Number.isFinite(max) ? max : null,
        step: Number.isFinite(step) && step > 0 ? step : null,
        integer: normalized.integer === true || (Number.isFinite(step) && step === 1),
        hint: toText(normalized.hint, '').trim(),
      };
    }

    function formatInlineNumericHint(meta = {}, rawValue = undefined) {
      const normalized = normalizeInlineNumericMeta(meta, rawValue);
      if (normalized.hint) return normalized.hint;
      const parts = [];
      if (normalized.min !== null && normalized.max !== null) parts.push(`范围 ${formatNumber(normalized.min)} - ${formatNumber(normalized.max)}`);
      else if (normalized.min !== null) parts.push(`最小 ${formatNumber(normalized.min)}`);
      else if (normalized.max !== null) parts.push(`最大 ${formatNumber(normalized.max)}`);
      else parts.push('未设上下限');
      parts.push(normalized.integer ? '整数' : '可输入小数');
      if (normalized.step !== null) parts.push(`步长 ${formatNumber(normalized.step)}`);
      return parts.join(' · ');
    }

    function buildInlineNumberEditor(target, rect, rawValue, meta = {}, state) {
      const wrapper = document.createElement('div');
      wrapper.className = 'mvu-inline-editor-shell';
      wrapper.style.minWidth = `${Math.max(132, Math.ceil(rect.width) + 40)}px`;
      wrapper.style.display = 'grid';
      wrapper.style.gap = '5px';

      const numericMeta = normalizeInlineNumericMeta(meta, rawValue);
      const input = document.createElement('input');
      input.className = 'mvu-inline-editor-input';
      input.type = 'text';
      input.inputMode = numericMeta.integer ? 'numeric' : 'decimal';
      input.value = formatEditorValue(rawValue, 'number');
      input.style.width = '100%';
      input.style.minHeight = `${Math.max(36, Math.ceil(rect.height) + 10)}px`;
      input.style.padding = '0 14px';
      input.style.borderRadius = '999px';
      input.style.border = '1px solid rgba(0, 229, 255, 0.28)';
      input.style.background = 'rgba(4, 14, 24, 0.96)';
      input.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.25)';
      input.style.color = 'var(--white)';
      input.style.outline = 'none';
      input.style.font = 'inherit';
      input.style.boxSizing = 'border-box';

      const hint = document.createElement('div');
      hint.textContent = formatInlineNumericHint(meta, rawValue);
      hint.style.fontSize = '11px';
      hint.style.lineHeight = '1.35';
      hint.style.color = 'rgba(191, 233, 242, 0.82)';
      hint.style.padding = '0 4px';

      wrapper.appendChild(input);
      wrapper.appendChild(hint);
      wrapper.addEventListener('click', event => {
        event.stopPropagation();
      });
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
      input.addEventListener('blur', () => {
        commitInlineEditState(state);
      });
      state.readValue = () => input.value;
      return { root: wrapper, inputEl: wrapper, focusEl: input };
    }

    function buildInlineEnumSelectEditor(target, rect, rawValue, meta = {}, state) {
      const select = document.createElement('select');
      select.className = 'mvu-inline-editor-input';
      select.style.width = `${Math.max(120, Math.ceil(rect.width) + 24)}px`;
      const options = normalizeInlineEditorOptions(meta);
      const normalizedValue = toText(rawValue, '').trim();
      select.innerHTML = options
        .map(option => `<option value="${escapeHtmlAttr(option)}"${option === normalizedValue ? ' selected' : ''}>${htmlEscape(option)}</option>`)
        .join('');
      select.addEventListener('change', () => {
        commitInlineEditState(state);
      });
      select.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          restoreInlineEditState(state);
          flushPendingLiveRefresh();
        }
      });
      select.addEventListener('click', event => {
        event.stopPropagation();
      });
      select.addEventListener('blur', () => {
        commitInlineEditState(state);
      });
      return { root: select, inputEl: select };
    }

    function buildInlineTokenMultiEditor(target, rect, rawValue, meta = {}, state) {
      const wrapper = document.createElement('div');
      wrapper.className = 'mvu-inline-token-editor';
      wrapper.style.minWidth = `${Math.max(240, Math.ceil(rect.width) + 36)}px`;
      wrapper.style.padding = '10px 12px';
      wrapper.style.borderRadius = '12px';
      wrapper.style.border = '1px solid rgba(0, 229, 255, 0.28)';
      wrapper.style.background = 'rgba(4, 14, 24, 0.96)';
      wrapper.style.boxShadow = '0 14px 32px rgba(0, 0, 0, 0.35)';
      wrapper.style.display = 'grid';
      wrapper.style.gap = '10px';

      const optionGrid = document.createElement('div');
      optionGrid.style.display = 'flex';
      optionGrid.style.flexWrap = 'wrap';
      optionGrid.style.gap = '8px';

      const selected = new Set(normalizeEditorStringList(rawValue));
      normalizeInlineEditorOptions(meta).forEach(option => {
        const label = document.createElement('label');
        label.className = `skill-designer-check-chip${selected.has(option) ? ' active' : ''}`;
        label.style.cursor = 'pointer';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = option;
        input.checked = selected.has(option);
        input.style.display = 'none';
        input.addEventListener('change', () => {
          label.classList.toggle('active', input.checked);
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        optionGrid.appendChild(label);
      });

      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.justifyContent = 'flex-end';
      actions.style.gap = '8px';

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'tag-chip';
      cancelBtn.textContent = '取消';
      cancelBtn.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        restoreInlineEditState(state);
        flushPendingLiveRefresh();
      });

      const saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.className = 'tag-chip live';
      saveBtn.textContent = '确定';
      saveBtn.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        commitInlineEditState(state);
      });

      actions.appendChild(cancelBtn);
      actions.appendChild(saveBtn);
      wrapper.appendChild(optionGrid);
      wrapper.appendChild(actions);

      wrapper.addEventListener('click', event => {
        event.stopPropagation();
      });
      wrapper.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          restoreInlineEditState(state);
          flushPendingLiveRefresh();
        }
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();
          commitInlineEditState(state);
        }
      });

      state.readValue = () =>
        Array.from(wrapper.querySelectorAll('input[type="checkbox"]:checked'))
          .map(input => toText(input.value, '').trim())
          .filter(Boolean);
      state.manualCommit = true;

      return { root: wrapper, inputEl: wrapper, focusEl: saveBtn };
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

    function buildUiRequestInjectionId(requestKind = 'ui_request') {
      const normalizedKind = toText(requestKind, 'ui_request')
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'ui_request';
      return `dragon-ui-${normalizedKind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    async function dispatchUiAiRequest(playerInput, systemPrompt, meta = {}) {
      const helper = window.TavernHelper && typeof window.TavernHelper === 'object' ? window.TavernHelper : null;
      const requestKind = toText(meta && meta.requestKind, 'ui_request') || 'ui_request';
      const userText = toText(playerInput, '').trim();
      const hiddenPrompt = toText(systemPrompt, '').trim();
      const patchOps = Array.isArray(meta && meta.patchOps) ? meta.patchOps : [];

      if (!userText) {
        showUiToast('请求内容为空，无法提交。', 'error', 4200);
        return { ok: false, requestKind, reason: 'empty_input' };
      }
      if (!helper
        || typeof helper.injectPrompts !== 'function'
        || typeof helper.createChatMessages !== 'function'
        || typeof helper.triggerSlash !== 'function') {
        showUiToast('酒馆助手发送接口未就绪，当前无法提交请求。', 'error', 4200);
        return { ok: false, requestKind, reason: 'helper_unavailable' };
      }

      try {
        // Always persist MVU patches first, so generation reads newest state.
        if (patchOps.length) {
          await applyJsonPatchOpsByEditor(patchOps, { force: true });
          await refreshLiveSnapshot({ force: true });
        }
        if (hiddenPrompt) {
          helper.injectPrompts([{
            id: buildUiRequestInjectionId(requestKind),
            position: 'in_chat',
            depth: 0,
            role: 'system',
            content: hiddenPrompt,
            should_scan: true
          }], { once: true });
        }
        await helper.createChatMessages([{ role: 'user', message: userText }], { refresh: 'affected' });
        await helper.triggerSlash('/trigger await=true');
        return { ok: true, requestKind };
      } catch (error) {
        console.error('[DragonUI] UI request dispatch failed', error);
        showUiToast(error && error.message ? error.message : '请求提交失败。', 'error', 4200);
        return { ok: false, requestKind, reason: 'dispatch_failed', error };
      }
    }

    function installBattleUiHostSendBridge() {
      const sendFromBattleUi = async (detail = {}) => {
        const requestKind = toText(
          detail.requestKind || detail.channels?.requestKind || detail.options?.requestKind,
          'battle_arbitration'
        );
        const patchOps = Array.isArray(detail.mvuUpdate?.patchOps) ? detail.mvuUpdate.patchOps : [];
        return dispatchUiAiRequest(detail.playerInput, detail.systemPrompt, { requestKind, patchOps });
      };
      window.BattleUIBridge = Object.assign(window.BattleUIBridge || {}, {
        hostSend: sendFromBattleUi
      });
      window.__battleUIHostAdapter = Object.assign(window.__battleUIHostAdapter || {}, {
        sendUIRequest: sendFromBattleUi,
        sendBattleRequest: sendFromBattleUi
      });
    }
    installBattleUiHostSendBridge();

    function installModuleArbitrationPrompt() {
      if (lastInjectedModuleArbitrationPrompt) return;
      const helper = window.TavernHelper && typeof window.TavernHelper === 'object' ? window.TavernHelper : null;
      if (!helper || typeof helper.injectPrompts !== 'function') return;
      try {
        helper.injectPrompts([{
          id: 'dragon-ui-module-arbitration-rules',
          position: 'in_chat',
          depth: 0,
          role: 'system',
          content: `【模块接管规则】
当剧情即将进入实际战斗、切磋、伏击、追击或技能对轰时，不要直接写出最终胜负、掉血、战利品或死亡结算。必须先开启 MVU 变量 /world/战斗/进行中，并写入 /world/战斗/战斗类型、/world/战斗/阶段、/world/战斗/环境、/world/战斗/参战者。参战者 至少包含 player 与 enemy 两个槽位；如果只知道参战者姓名，也要把姓名写入对应槽位，前端会用角色档案补全战斗数据。
当剧情即将进入购买、出售、私下交易、竞拍、讨价还价或物资交换时，不要直接改写金钱/库存并宣布成交。必须写入 /world/交易请求/动作、目标、对象、物品、数量、价格、货币、状态、自动执行；如果剧情已经明确成交意图，可设置 自动执行=true 让交易模块自动提交仲裁。
当剧情即将进入锻造、制造、设计、修理、官方代工或私人代工时，不要直接改写材料、成品、装备状态或副职业经验。必须先让前端副职业工坊接管；若推演脚本已经得到结构化计划，应调用 window.__MVU_ROUTE_MODULE_INTENT__ 并传入 profession/craft 请求。
如果只是闲聊中提到战斗、交易或副职业，不需要触发模块；只有玩家或剧情角色真正发起可结算行为时才触发。`,
          should_scan: true
        }], { once: false });
        lastInjectedModuleArbitrationPrompt = true;
      } catch (error) {
        console.warn('[DragonUI] 模块接管提示注入失败', error);
      }
    }

    const MVU_EDITOR_STORE_COMMIT_DELAY = 140;
    const MVU_EDITOR_ROOT_OBJECT_KEYS = ['sys', 'world', 'org', 'char', 'map'];
    const MVU_WRAPPER_ROOT_KEYS = ['display_data', 'delta_data', 'initialized_lorebooks', 'schema', 'stat_data'];
    const MVU_WRAPPER_PREFIX_KEYS = new Set(['stat_data', 'display_data', 'data', 'variables', 'payload', 'root', 'mvu', 'state']);
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

    function isPlainObjectValue(value) {
      return !!value && typeof value === 'object' && !Array.isArray(value);
    }

    function countRootObjectFields(value) {
      if (!isPlainObjectValue(value)) return 0;
      return MVU_EDITOR_ROOT_OBJECT_KEYS.filter(key => isPlainObjectValue(value[key])).length;
    }

    function buildCanonicalSpiritSkillSlotKey(ringIndex = 1) {
      const safeIndex = Math.max(1, Math.floor(Number(ringIndex) || 0));
      return `第${safeIndex}魂技`;
    }

    function normalizeSingleSpiritSkillSlotMapForEditor(skillMap = {}, ringIndex = 1) {
      if (!isPlainObjectValue(skillMap)) return skillMap;
      const entries = Object.entries(skillMap).filter(([, skill]) => isPlainObjectValue(skill));
      if (!entries.length) return skillMap;
      const canonicalKey = buildCanonicalSpiritSkillSlotKey(ringIndex);
      const hasMultipleEntries = entries.length > 1;
      const hasOrdinalKey = entries.some(([rawKey]) => /^第(?:\d+|[一二三四五六七八九十百]+)魂技/u.test(String(rawKey || '').trim()));
      if (hasMultipleEntries || (hasOrdinalKey && skillMap[canonicalKey])) return skillMap;
      const [rawKey, rawSkill] = entries[0];
      const normalizedSkill = isPlainObjectValue(rawSkill) ? rawSkill : {};
      if (!normalizedSkill.魂技名 || !String(normalizedSkill.魂技名).trim()) {
        normalizedSkill.魂技名 = String(rawKey || canonicalKey);
      }
      if (rawKey !== canonicalKey) delete skillMap[rawKey];
      skillMap[canonicalKey] = normalizedSkill;
      return skillMap;
    }

    function normalizeSpiritSkillSlotsInStatDataForEditor(statData = {}) {
      const chars = isPlainObjectValue(statData && statData.char) ? statData.char : {};
      Object.values(chars).forEach(charData => {
        const spirits = isPlainObjectValue(charData && charData.武魂) ? charData.武魂 : {};
        Object.values(spirits).forEach(spiritData => {
          const soulSpirits = isPlainObjectValue(spiritData && spiritData.魂灵) ? spiritData.魂灵 : {};
          Object.values(soulSpirits).forEach(soulSpirit => {
            const rings = isPlainObjectValue(soulSpirit && soulSpirit.魂环) ? soulSpirit.魂环 : {};
            Object.entries(rings).forEach(([ringIndex, ringData]) => {
              normalizeSingleSpiritSkillSlotMapForEditor(ringData && ringData['魂技'], ringIndex);
            });
          });
        });
      });
      return statData;
    }

    function stripWrapperPathPrefix(pathTokens) {
      const normalized = Array.isArray(pathTokens) ? pathTokens.slice() : [];
      while (normalized.length > 0) {
        const head = normalized[0];
        if (typeof head === 'number') break;
        const headText = String(head ?? '').trim();
        if (!headText || !MVU_WRAPPER_PREFIX_KEYS.has(headText)) break;
        normalized.shift();
      }
      return normalized;
    }

    function pickBestRootCandidate(candidates = []) {
      let bestCandidate = null;
      let bestScore = -1;
      let bestSize = -1;
      candidates.forEach(candidate => {
        if (!isPlainObjectValue(candidate)) return;
        const score = countRootObjectFields(candidate);
        if (score <= 0) return;
        const size = Object.keys(candidate).length;
        if (score > bestScore || (score === bestScore && size > bestSize)) {
          bestCandidate = candidate;
          bestScore = score;
          bestSize = size;
        }
      });
      return bestCandidate;
    }

    function normalizeMvuDataEnvelopeForEditor(rawData) {
      const safeData = isPlainObjectValue(rawData) ? cloneJsonValue(rawData, {}) : {};
      const hasWrapperFields = MVU_WRAPPER_ROOT_KEYS.some(key => Object.prototype.hasOwnProperty.call(safeData, key));
      const envelope = hasWrapperFields ? cloneJsonValue(safeData, {}) : {};

      const bestRoot = pickBestRootCandidate([
        safeData.stat_data,
        safeData.display_data,
        safeData?.data?.stat_data,
        safeData?.variables?.stat_data,
        safeData?.payload?.stat_data,
        safeData?.root?.stat_data,
        safeData,
      ]);

      if (bestRoot) {
        envelope.stat_data = cloneJsonValue(bestRoot, {});
      } else if (isPlainObjectValue(envelope.stat_data)) {
        envelope.stat_data = cloneJsonValue(envelope.stat_data, {});
      } else {
        envelope.stat_data = {};
      }
      if (!isPlainObjectValue(envelope.initialized_lorebooks)) envelope.initialized_lorebooks = {};
      return envelope;
    }

    function buildSafeStatDataForEditorWrite(nextStatData, baseStatData) {
      const draft = isPlainObjectValue(nextStatData) ? cloneJsonValue(nextStatData, {}) : {};
      const base = isPlainObjectValue(baseStatData) ? baseStatData : {};

      MVU_EDITOR_ROOT_OBJECT_KEYS.forEach(key => {
        if (isPlainObjectValue(draft[key])) return;
        if (isPlainObjectValue(base[key])) {
          draft[key] = cloneJsonValue(base[key], {});
          return;
        }
        draft[key] = {};
      });

      normalizeSpiritSkillSlotsInStatDataForEditor(draft);
      return draft;
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
      const safeMvuData = normalizeMvuDataEnvelopeForEditor(currentMvuData);
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
        const safeFlushStatData = buildSafeStatDataForEditorWrite(flushStatData, mvuData.stat_data);
        nextMvuData.stat_data = safeFlushStatData;
        await Promise.resolve(host.replaceMvuData(nextMvuData, { type: 'message', message_id: 'latest' }));
        if (mvuEditorStore.version === flushVersion) {
          mvuEditorStore.dirty = false;
          mvuEditorStore.signature = serializeMvuEditorStoreStatData(safeFlushStatData);
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

    async function deleteStatDataPathByEditor(pathValue, options = {}) {
      const path = normalizeEditorPath(pathValue);
      if (!path.length) throw new Error('变量路径不能为空。');
      return mutateStatDataByEditor(statData => {
        deepDeleteMutable(statData, path);
      }, options);
    }

    async function renameStatObjectKeyByEditor(parentPathValue, previousKey, nextKey, options = {}) {
      const parentPath = normalizeEditorPath(parentPathValue);
      const oldKey = toText(previousKey, '').trim();
      const newKey = toText(nextKey, '').trim();
      if (!parentPath.length) throw new Error('缺少对象路径，无法重命名。');
      if (!oldKey) throw new Error('缺少原始字段名。');
      if (!newKey) throw new Error('字段名不能为空。');
      if (newKey === oldKey) return;
      return mutateStatDataByEditor(statData => {
        const target = deepGet(statData, parentPath, null);
        if (!target || typeof target !== 'object' || Array.isArray(target)) {
          throw new Error('目标对象不存在，无法重命名。');
        }
        if (!Object.prototype.hasOwnProperty.call(target, oldKey)) {
          throw new Error('原字段不存在，无法重命名。');
        }
        if (Object.prototype.hasOwnProperty.call(target, newKey)) {
          throw new Error('同名字段已存在，请换一个名称。');
        }
        const payload = cloneJsonValue(target[oldKey], {});
        delete target[oldKey];
        target[newKey] = payload;
      }, options);
    }

    function normalizeInlineComparableValue(value, kind = 'string') {
      const safeKind = String(kind || 'string').trim().toLowerCase();
      if (safeKind === 'number') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? String(parsed) : '';
      }
      if (safeKind === 'string_list' || safeKind === 'token_multi') {
        return normalizeEditorStringList(value).join('、');
      }
      if (safeKind === 'enum_select') return String(value ?? '').trim();
      if (safeKind === 'boolean') {
        return String(['true', '1', 'yes', 'y', '是', '开'].includes(String(value ?? '').trim().toLowerCase()));
      }
      return String(value ?? '');
    }

    function bumpInlineEditSession(duration = 320) {
      inlineEditSessionToken += 1;
      const holdMs = Math.max(0, toNumber(duration, 320));
      if (holdMs > 0) inlineEditGuardUntil = Math.max(inlineEditGuardUntil, Date.now() + holdMs);
      return inlineEditSessionToken;
    }

    function isInlineEditGuardActive() {
      return Date.now() < inlineEditGuardUntil;
    }

    function shouldBlockInlineEditRerender(options = {}) {
      if (options && (options.force || options.allowWhileInlineEdit)) return false;
      return hasActiveInlineEdit() || isInlineEditGuardActive();
    }

    function isInlineEditInteractionTarget(target) {
      if (!target || !(target instanceof Element)) return false;
      return !!target.closest('.mvu-inline-editor-input, .mvu-inline-token-editor, .mvu-inline-editor-shell');
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
      if (activeEl.closest('.mvu-inline-token-editor')) return true;
      if (!activeEl.closest('.mvu-editor-form, .skill-designer-form')) return false;
      return activeEl.matches('input, textarea, select');
    }

    function hasOpenSkillDesignerModal() {
      return !!(
        (detailModal && detailModal.classList.contains('show') && isSkillDesignerPreviewKey(currentModalPreviewKey))
        || (isUnifiedInlinePreviewActive() && isSkillDesignerPreviewKey(currentUnifiedPreviewKey))
      );
    }

    function shouldPauseLiveRefresh(options = {}) {
      if (options && options.force) return false;
      return shouldBlockInlineEditRerender(options) || hasFocusedEditorControl() || hasOpenSkillDesignerModal();
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
      bumpInlineEditSession(1200);
      let nextValue;
      try {
        nextValue = typeof state.readValue === 'function'
          ? state.readValue(state)
          : parseEditorInputValue(state.inputEl ? state.inputEl.value : '', state.kind, state.editorMeta || {});
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
      let previewRollback = null;
      try {
        if (state.editorMeta && state.editorMeta.renameObjectKey === true) {
          await renameStatObjectKeyByEditor(
            state.editorMeta.parentPath || state.path.slice(0, -1),
            state.editorMeta.oldKey || state.path[state.path.length - 1],
            nextValue,
          );
        } else {
          previewRollback = queueTrainedBonusPreviewOverride(state.path, state.rawValue, nextValue);
          await replaceStatDataByEditor([{ path: state.path, value: nextValue }]);
        }
      } catch (error) {
        restoreTrainedBonusPreviewOverride(previewRollback);
        showUiToast(error && error.message ? error.message : '变量写回失败。', 'error', 4200);
      } finally {
        flushPendingLiveRefresh({ force: true });
      }
    }

    function beginInlineEdit(target) {
      if (!target || !(target instanceof HTMLElement)) return;
      if (activeInlineEditState && activeInlineEditState.displayEl === target) return;
      cancelActiveInlineEdit();
      bumpInlineEditSession(800);

      let path = [];
      try {
        path = JSON.parse(target.getAttribute('data-mvu-path') || '[]');
      } catch (error) {}
      if (!Array.isArray(path) || !path.length) return;

      const kind = target.getAttribute('data-value-kind') || 'string';
      const rawValue = target.getAttribute('data-mvu-raw-value') ?? target.textContent ?? '';
      const editorMeta = readInlineEditorMeta(target);
      const rect = target.getBoundingClientRect();
      const isMultiline = target.getAttribute('data-inline-multiline') === '1';
      const state = {
        displayEl: target,
        inputEl: null,
        path,
        kind,
        rawValue,
        editorMeta,
        multiline: isMultiline,
        committing: false,
      };
      activeInlineEditState = state;
      let editorRoot = null;
      let focusTarget = null;

      if (String(kind).trim().toLowerCase() === 'enum_select') {
        const editor = buildInlineEnumSelectEditor(target, rect, rawValue, editorMeta, state);
        editorRoot = editor.root;
        state.inputEl = editor.inputEl;
        focusTarget = editor.focusEl || editor.inputEl;
      } else if (String(kind).trim().toLowerCase() === 'token_multi') {
        const editor = buildInlineTokenMultiEditor(target, rect, rawValue, editorMeta, state);
        editorRoot = editor.root;
        state.inputEl = editor.inputEl;
        focusTarget = editor.focusEl || editor.inputEl;
      } else if (String(kind).trim().toLowerCase() === 'number') {
        const editor = buildInlineNumberEditor(target, rect, rawValue, editorMeta, state);
        editorRoot = editor.root;
        state.inputEl = editor.inputEl;
        focusTarget = editor.focusEl || editor.inputEl;
      } else {
        const input = document.createElement(isMultiline ? 'textarea' : 'input');
        input.className = 'mvu-inline-editor-input';
        if (!isMultiline) {
          input.type = 'text';
        } else {
          input.rows = Math.max(3, Math.min(8, String(formatEditorValue(rawValue, kind)).split(/\r?\n/).length + 1));
          input.style.minHeight = `${Math.max(72, Math.ceil(rect.height) + 28)}px`;
          input.style.resize = 'vertical';
          input.style.whiteSpace = 'pre-wrap';
        }
        input.value = formatEditorValue(rawValue, kind);
        input.style.width = `${Math.max(isMultiline ? 240 : 84, Math.ceil(rect.width) + 28)}px`;
        input.style.minHeight = isMultiline ? input.style.minHeight : `${Math.max(36, Math.ceil(rect.height) + 10)}px`;
        input.style.padding = isMultiline ? '10px 12px' : '0 14px';
        input.style.borderRadius = isMultiline ? '14px' : '999px';
        input.style.border = '1px solid rgba(0, 229, 255, 0.28)';
        input.style.background = 'rgba(4, 14, 24, 0.96)';
        input.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.25)';
        input.style.color = 'var(--white)';
        input.style.outline = 'none';
        input.style.font = 'inherit';
        input.style.boxSizing = 'border-box';
        input.addEventListener('keydown', event => {
          if (event.key === 'Enter' && (!state.multiline || event.ctrlKey || event.metaKey)) {
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
        editorRoot = input;
        state.inputEl = input;
        focusTarget = input;
      }

      target.replaceWith(editorRoot);
      if (focusTarget && typeof focusTarget.focus === 'function') focusTarget.focus();
      if (focusTarget && typeof focusTarget.select === 'function') focusTarget.select();
    }

    function bindInlineEditing() {
      if (window.__mvuInlineEditingBound) return;
      window.__mvuInlineEditingBound = true;

      document.addEventListener('click', event => {
        const eventTarget = event.target instanceof Element ? event.target : (event.target && event.target.parentElement ? event.target.parentElement : null);
        if (!eventTarget) return;
        if (isInlineEditInteractionTarget(eventTarget)) {
          event.stopPropagation();
          return;
        }
        if (activeInlineEditState && activeInlineEditState.manualCommit) {
          restoreInlineEditState(activeInlineEditState);
          flushPendingLiveRefresh();
        }
        const inlineTarget = eventTarget.closest('[data-inline-editable="1"]');
        if (!inlineTarget) return;
        event.preventDefault();
        event.stopPropagation();
        beginInlineEdit(inlineTarget);
      }, true);

      document.addEventListener('keydown', event => {
        const eventTarget = event.target instanceof Element ? event.target : (event.target && event.target.parentElement ? event.target.parentElement : null);
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

    function getLatestMessageVariablesFallback() {
      try {
        if (window.TavernHelper && typeof window.TavernHelper.getVariables === 'function') {
          return window.TavernHelper.getVariables({ type: 'message', message_id: 'latest' }) || null;
        }
      } catch (err) {}
      return null;
    }

    async function getAllVariablesSafe() {
      const host = getMvuHost();
      const readers = [];
      if (host && typeof host.getAllVariables === 'function') {
        readers.push(() => Promise.resolve(host.getAllVariables()));
      }
      if (window.getAllVariables && typeof window.getAllVariables === 'function') {
        readers.push(() => Promise.resolve(window.getAllVariables()));
      }
      readers.push(() => Promise.resolve(getLatestMessageVariablesFallback()));

      let fallbackVars = null;
      let bestVars = null;
      let bestScore = -Infinity;
      for (const read of readers) {
        try {
          const vars = await read();
          if (!vars || typeof vars !== 'object') continue;
          if (!fallbackVars) fallbackVars = vars;
          const rootData = resolveRootData(vars);
          const nextScore = scoreRootDataCandidate(rootData);
          if (nextScore > bestScore) {
            bestScore = nextScore;
            bestVars = vars;
          }
        } catch (err) {}
      }

      return bestVars || fallbackVars;
    }

    function getSharedMvuRefreshHub() {
      const hubKey = '__dragonUiSharedMvuRefreshHub';
      const existingHub = window[hubKey];
      if (existingHub && typeof existingHub.subscribe === 'function' && typeof existingHub.trigger === 'function') {
        return existingHub;
      }

      const subscribers = new Map();
      const POLL_KEY = '__dragonUiSharedRefreshPollTimer';
      const POLL_VIS_KEY = '__dragonUiSharedRefreshPollVisibilityBound';
      const POLL_FOCUS_KEY = '__dragonUiSharedRefreshPollFocusBound';
      let bindingsReady = false;
      let running = false;
      let pending = false;
      let lastTriggerArgs = [];

      const getAllVariablesDirect = async () => {
        return await getAllVariablesSafe();
      };

      const schedulePendingDispatch = () => {
        const runner = () => hub.dispatch(...lastTriggerArgs);
        if (typeof queueMicrotask === 'function') {
          queueMicrotask(runner);
          return;
        }
        Promise.resolve().then(runner);
      };

      const hub = {
        async getAllVariables() {
          return await getAllVariablesDirect();
        },

        async dispatch(...args) {
          lastTriggerArgs = args;
          if (running) {
            pending = true;
            return;
          }
          running = true;
          try {
            const vars = await getAllVariablesDirect();
            const entries = Array.from(subscribers.entries());
            for (const [subscriberId, subscriber] of entries) {
              try {
                await Promise.resolve(subscriber.handler(vars, ...args));
              } catch (error) {
                console.warn(`[DragonUI] MVU shared refresh subscriber failed: ${subscriberId}`, error);
              }
            }
          } finally {
            running = false;
            if (pending) {
              pending = false;
              schedulePendingDispatch();
            }
          }
        },

        trigger(...args) {
          return hub.dispatch(...args);
        },

        ensureBindings() {
          if (bindingsReady) return;
          bindingsReady = true;

          const host = getMvuHost();
          const eventName = host && host.events ? host.events.VARIABLE_UPDATE_ENDED : '';
          let bound = false;
          const triggerFromEvent = (...args) => hub.trigger({ source: 'event', eventName }, ...args);

          if (host && eventName && typeof host.on === 'function') {
            try {
              host.on(eventName, triggerFromEvent);
              bound = true;
            } catch (err) {}
          }

          if (host && eventName && typeof host.addEventListener === 'function') {
            try {
              host.addEventListener(eventName, triggerFromEvent);
              bound = true;
            } catch (err) {}
          }

          if (eventName) {
            try {
              window.addEventListener(eventName, triggerFromEvent);
              bound = true;
            } catch (err) {}
            try {
              if (window.top && window.top !== window && typeof window.top.addEventListener === 'function') {
                window.top.addEventListener(eventName, triggerFromEvent);
                bound = true;
              }
            } catch (err) {}
          }

          if (!window[POLL_KEY]) {
            window[POLL_KEY] = window.setInterval(() => {
              hub.trigger({ source: 'poll' });
            }, 1500);
          }

          if (!window[POLL_VIS_KEY]) {
            document.addEventListener('visibilitychange', () => {
              if (document.visibilityState === 'visible') hub.trigger({ source: 'visibility' });
            });
            window[POLL_VIS_KEY] = true;
          }

          if (!window[POLL_FOCUS_KEY]) {
            window.addEventListener('focus', () => {
              hub.trigger({ source: 'focus' });
            });
            window[POLL_FOCUS_KEY] = true;
          }

          if (!bound && window.__MVU_DEBUG__) {
            console.info('[DragonUI] MVU update event not bound, shared polling fallback enabled.');
          }
        },

        subscribe(subscriberId, handler, options = {}) {
          if (!subscriberId || typeof handler !== 'function') return () => {};
          subscribers.set(subscriberId, { handler });
          hub.ensureBindings();
          if (options.immediate !== false) {
            hub.trigger({ source: 'subscribe', subscriberId });
          }
          return () => {
            subscribers.delete(subscriberId);
          };
        }
      };

      window[hubKey] = hub;
      return hub;
    }

    function bindMvuUpdates(handler) {
      const hub = getSharedMvuRefreshHub();
      return hub.subscribe('dragon-ui-main', async (vars, ...args) => {
        try {
          await Promise.resolve(handler(vars, ...args));
        } catch (error) {
          console.warn('[DragonUI] MVU 实时刷新执行失败', error);
        }
      });
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

    function getCurrentChatContextMeta() {
      try {
        const ctx = window.SillyTavern && typeof window.SillyTavern.getContext === 'function'
          ? window.SillyTavern.getContext()
          : null;
        if (!ctx || typeof ctx !== 'object') {
          return { name1: '', name2: '', chatId: '', characterId: '', groupId: '' };
        }
        return {
          name1: toText(ctx.name1, '').trim(),
          name2: toText(ctx.name2, '').trim(),
          chatId: toText(ctx.chatId, '').trim(),
          characterId: toText(ctx.characterId, '').trim(),
          groupId: toText(ctx.groupId, '').trim(),
        };
      } catch (err) {
        return { name1: '', name2: '', chatId: '', characterId: '', groupId: '' };
      }
    }

    function hasRootRuntimeSignals(rootData) {
      if (!rootData || typeof rootData !== 'object') return false;
      if (toText(deepGet(rootData, 'sys.玩家名', ''), '').trim()) return true;
      if (safeEntries(deepGet(rootData, 'sys.seq', {})).length) return true;
      if (safeEntries(deepGet(rootData, 'world.时间线', {})).length) return true;
      if (deepGet(rootData, 'world.偏差值', undefined) !== undefined) return true;
      if (toText(deepGet(rootData, 'world.时间._calendar', deepGet(rootData, 'world.时间.calendar', '')), '').trim()) return true;
      if (safeEntries(deepGet(rootData, 'map.visible_nodes', {})).length) return true;
      if (safeEntries(deepGet(rootData, 'map.visible_dynamic_locations', {})).length) return true;
      return false;
    }

    function isRootDataRelevantToCurrentChat(rootData) {
      if (!rootData || typeof rootData !== 'object') return false;
      const chars = rootData.char && typeof rootData.char === 'object' ? rootData.char : {};
      const preferredName = getPreferredActiveCharacterName();
      const sysPlayerName = toText(deepGet(rootData, 'sys.玩家名', ''), '').trim();
      const contextMeta = getCurrentChatContextMeta();
      if (preferredName && chars[preferredName]) return true;
      if (sysPlayerName && chars[sysPlayerName]) return true;
      if (contextMeta.name1 && chars[contextMeta.name1]) return true;
      if (contextMeta.name2 && chars[contextMeta.name2]) return true;
      if (contextMeta.name1 || contextMeta.name2) return false;
      return hasRootRuntimeSignals(rootData);
    }

    function scoreRootDataCandidate(rootData) {
      if (!rootData || typeof rootData !== 'object') return -1;
      const chars = rootData.char && typeof rootData.char === 'object' ? rootData.char : {};
      const contextMeta = getCurrentChatContextMeta();
      let score = 0;
      if (rootData.sys && typeof rootData.sys === 'object') score += 6;
      if (toText(deepGet(rootData, 'sys.玩家名', ''), '').trim()) score += 12;
      if (safeEntries(deepGet(rootData, 'sys.seq', {})).length) score += 6;
      if (safeEntries(deepGet(rootData, 'world.时间线', {})).length) score += 5;
      if (deepGet(rootData, 'world.偏差值', undefined) !== undefined) score += 3;
      if (rootData.map && typeof rootData.map === 'object' && Object.keys(rootData.map).length) score += 3;
      if (safeEntries(chars).length) score += 1;
      if (contextMeta.name1 && chars[contextMeta.name1]) score += 10;
      if (contextMeta.name2 && chars[contextMeta.name2]) score += 4;
      if (isRootDataRelevantToCurrentChat(rootData)) score += 8;
      return score;
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
        const lvDiff = toNumber(deepGet(b[1], '属性.等级', 0), 0) - toNumber(deepGet(a[1], '属性.等级', 0), 0);
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
      const sysPlayerName = toText(deepGet(sd, 'sys.玩家名', ''), '').trim();
      const contextMeta = getCurrentChatContextMeta();
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
        deepGet(sd, 'sys.玩家名', ''),
        contextMeta.name1,
        contextMeta.name2
      ].filter(Boolean);

      for (const name of namedCandidates) {
        if (chars[name]) return [name, chars[name]];
      }

      if (realPlayerEntry) {
        return realPlayerEntry;
      }

      if (!sortedEntries.length) {
        return ['Unknown', {}];
      }

      const pinnedCandidate = sortedEntries.find(([name]) => getPinnedCharacterOrder(name) >= 0);
      if (pinnedCandidate) {
        return pinnedCandidate;
      }

      return sortedEntries[0];
    }

    function isSnapshotPlayerControlled(snapshot) {
      const playerName = toText(deepGet(snapshot, 'rootData.sys.玩家名', ''), '').trim();
      const activeName = toText(snapshot && snapshot.activeName, '').trim();
      return isPlayerCharacterEntry(activeName, deepGet(snapshot, 'activeChar', {}), playerName);
    }

    function formatAppearanceMeta(外貌数据) {
      const data = 外貌数据 && typeof 外貌数据 === 'object' ? 外貌数据 : {};
      const features = Array.isArray(data['特殊特征'])
        ? data['特殊特征']
          .map(item => toText(item, '').trim())
          .filter(Boolean)
          .filter(item => !/^待补全\(/.test(item))
        : [];
      return {
        hairColor: toText(data['发色'], '未设定') || '未设定',
        hairStyle: toText(data['发型'], '未设定') || '未设定',
        eyes: toText(data['瞳色'], '未设定') || '未设定',
        height: toText(data['身高'], '未设定') || '未设定',
        build: toText(data['体型'], '未设定') || '未设定',
        looks: toText(data['长相描述'], '未设定') || '未设定',
        features: features.length ? features.join('、') : '未设定'
      };
    }

    function formatAppearanceText(外貌数据) {
      const meta = formatAppearanceMeta(外貌数据);
      const parts = [
        meta.hairColor,
        meta.hairStyle,
        meta.eyes,
        meta.height,
        meta.build
      ].filter(Boolean).filter(item => item !== '未设定');
      const looksText = meta.looks && meta.looks !== '未设定' ? `；长相：${meta.looks}` : '';
      const featureText = meta.features && meta.features !== '未设定' ? `；特征：${meta.features}` : '';
      if (parts.length) return `${parts.join(' / ')}${looksText}${featureText}`;
      if (looksText || featureText) return `${looksText}${featureText}`.replace(/^；/, '');
      return '未设定';
    }

    function normalizeLocationName(sd, rawLoc) {
      const loc = toText(rawLoc, '未知');
      const worldLocations = deepGet(sd, 'world.地点', {});
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
      const worldLocations = deepGet(sd, 'world.地点', {});
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

    function summarizeCloneEffectUi(effect) {
      const cloneType = normalizeSkillUiText(effect && effect['分身类型'], '分身');
      const cloneName = normalizeSkillUiText(effect && effect['分身名称'], '');
      const cloneCount = Math.max(1, toNumber(effect && effect['分身数量'], 1));
      const duration = Math.max(0, toNumber(effect && effect['持续回合'], effect && effect['持续']));
      const stealth = Number(effect && effect['隐蔽度']);
      const inheritRatio = Number(effect && effect['实力继承比例']);
      return [
        `${cloneName ? `分出【${cloneName}】` : '分出'}${cloneCount}体${cloneType}`,
        Number.isFinite(stealth) ? `隐蔽:${Math.round(stealth * 100)}%` : '',
        Number.isFinite(inheritRatio) ? `继承:${Math.round(inheritRatio * 100)}%` : '',
        duration > 0 ? `持续:${duration}回合` : '',
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
    const SKILL_DESIGNER_SELF_FUSION_PARTNER = '自身双武魂';
    const SKILL_DESIGNER_SKILL_TYPES = Object.freeze(['强攻系', '控制系', '食物系', '精神系', '防御系', '敏攻系', '元素系', '辅助系', '治疗系', '被动', '融合技', '功法', '特殊能力']);
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
      '特殊规则类': Object.freeze(['分身', '复制', '反制', '转化', '状态交换', '强制绑定/锁定', '条件触发', '规则改写']),
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
      '被动': Object.freeze(['自身附体', '直接生效']),
      '功法': Object.freeze(['自身附体', '直接生效', '范围展开', '延迟触发']),
      '特殊能力': Object.freeze(['直接生效', '自身附体', '范围展开', '延迟触发', '标记触发']),
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
      '创造', '毁灭'
    ]);
    const SKILL_DESIGNER_RESOURCE_TYPE_OPTIONS = Object.freeze(['无', '魂力', '精神力', '体力', '混合']);
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
      '分身': Object.freeze({ main: '特殊规则类', sub: '分身' }),
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
    const SKILL_DESIGNER_PARAM_ATTRIBUTE_OPTIONS = Object.freeze([
      '力量', '防御', '敏捷',
      '体力上限', '魂力上限', '精神力上限',
      '体力', '魂力', '精神力',
      '掌控', '威力', '消耗', '前摇', '控制', '速度',
    ]);
    const SKILL_DESIGNER_PARAM_ATTRIBUTE_GROUP_OPTIONS = Object.freeze([
      '力量/防御',
      '力量/敏捷',
      '防御/敏捷',
      '力量/防御/敏捷',
      '体力上限/魂力上限',
      '体力上限/精神力上限',
      '魂力上限/精神力上限',
      '体力上限/魂力上限/精神力上限',
      '魂力/精神力',
      '掌控/威力',
      '掌控/控制',
      '消耗/前摇',
      '速度/敏捷',
    ]);
    const SKILL_DESIGNER_PARAM_PANEL_OPTIONS = Object.freeze(['攻击', '防御', '回复', '速度', '控制']);
    const SKILL_DESIGNER_PARAM_SUPPORT_TARGET_OPTIONS = Object.freeze(['自身', '友方单体', '友方群体']);
    const SKILL_DESIGNER_PARAM_SHIELD_CAP_OPTIONS = Object.freeze(['基于体力', '基于魂力', '基于精神力']);
    const SKILL_DESIGNER_PARAM_IMMUNE_LEVEL_OPTIONS = Object.freeze(['硬控', '软控', '全部控制']);
    const SKILL_DESIGNER_PARAM_CLEANSE_PRIORITY_OPTIONS = Object.freeze([
      '控制 > 削弱 > 异常',
      '削弱 > 控制 > 异常',
      '异常 > 控制 > 削弱',
    ]);
    const SKILL_DESIGNER_PARAM_CLEANSE_GAIN_OPTIONS = Object.freeze(['回复', '护盾', '免疫']);
    const SKILL_DESIGNER_PARAM_TRACKING_RULE_OPTIONS = Object.freeze(['不可脱锁', '共享坐标', '命中显形']);
    const SKILL_DESIGNER_PARAM_INFO_DEPTH_OPTIONS = Object.freeze(['位置', '视野', '状态', '位置+视野', '完整共享']);
    const SKILL_DESIGNER_PARAM_WAKE_RULE_OPTIONS = Object.freeze(['受伤', '净化', '时间结束']);
    const SKILL_DESIGNER_PARAM_ESCAPE_GAIN_OPTIONS = Object.freeze(['隐匿', '护盾', '加速']);
    const SKILL_DESIGNER_PARAM_COPY_TARGET_OPTIONS = Object.freeze(['招式', '状态', '属性']);
    const SKILL_DESIGNER_PARAM_COUNTER_TARGET_OPTIONS = Object.freeze(['远程', '控制', '召唤', '近战']);
    const SKILL_DESIGNER_PARAM_EXCHANGE_TARGET_OPTIONS = Object.freeze(['增益', '减益', '标记']);
    const SKILL_DESIGNER_PARAM_TRIGGER_RESULT_OPTIONS = Object.freeze(['爆发', '刷新', '召唤']);
    const SKILL_DESIGNER_PARAM_REWRITE_DEPTH_OPTIONS = Object.freeze(['部分改写', '完整覆盖']);
    const SKILL_DESIGNER_PARAM_CLONE_TYPE_OPTIONS = Object.freeze(['物理分身', '精神力分身']);
    const SKILL_DESIGNER_PARAM_PENETRATION_TARGET_OPTIONS = Object.freeze(['防御', '护盾', '抗性']);
    const SKILL_DESIGNER_PARAM_LIFESTEAL_RESOURCE_OPTIONS = Object.freeze(['生命', '魂力', '精神力']);
    const SKILL_DESIGNER_PARAM_INTERRUPT_WINDOW_OPTIONS = Object.freeze(['前摇', '吟唱中', '引导中']);
    const SKILL_DESIGNER_PARAM_COUNTER_RULE_OPTIONS = Object.freeze(['受击后', '格挡后', '受控后']);
    const SKILL_DESIGNER_PARAM_MUTE_SCOPE_OPTIONS = Object.freeze(['主动技', '咏唱技', '造物技', '全部技能']);
    const SKILL_DESIGNER_PARAM_BLIND_EFFECT_OPTIONS = Object.freeze(['命中', '视野', '锁定']);
    const SKILL_DESIGNER_PARAM_WEAK_POINT_TYPE_OPTIONS = Object.freeze(['破甲', '暴击', '属性克制']);
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

    function resolveSkillDesignerNestedEffectMechanism(entry = {}) {
      const explicitMechanism = normalizeSkillUiText(entry && entry['机制'], '');
      if (explicitMechanism) return explicitMechanism;
      const description = normalizeSkillUiText(
        entry && (entry['效果描述'] || entry['描述'] || entry.description || entry['文本']),
        '',
      );
      if (!description) return '';
      if (/分身/.test(description)) return '分身';
      if (/霸体/.test(description)) return '霸体';
      if (/护盾/.test(description)) return '护盾';
      if (/减伤/.test(description)) return '减伤';
      if (/免死|锁血/.test(description)) return '免死';
      if (/解控/.test(description)) return '解控';
      if (/净化/.test(description)) return '净化';
      if (/(回复|恢复)/.test(description) && /魂力/.test(description)) return '魂力恢复';
      if (/(回复|恢复)/.test(description) && /精神/.test(description)) return '精神恢复';
      if (/(回复|恢复)/.test(description) && /(体力|生命)/.test(description)) return '体力恢复';
      if (/共享视野/.test(description)) return '共享视野';
      if (/标记/.test(description) && /锁定/.test(description)) return '标记锁定';
      return '';
    }

    function buildSkillDesignerNestedEffectEntry(entry = {}, fallback = {}) {
      const entryValue = entry && typeof entry === 'object' ? entry : {};
      const valueConfig = entryValue && entryValue.value && typeof entryValue.value === 'object' ? entryValue.value : {};
      const hasStructuredPayload =
        Object.prototype.hasOwnProperty.call(entryValue, 'type')
        || Object.prototype.hasOwnProperty.call(entryValue, 'target')
        || Object.prototype.hasOwnProperty.call(entryValue, '目标')
        || Object.prototype.hasOwnProperty.call(entryValue, '持续回合')
        || Object.prototype.hasOwnProperty.call(entryValue, '持续')
        || Object.prototype.hasOwnProperty.call(valueConfig, 'durationRounds')
        || Object.prototype.hasOwnProperty.call(valueConfig, 'duration');
      if (!hasStructuredPayload) return null;

      const mechanism = resolveSkillDesignerNestedEffectMechanism(entryValue);
      if (!mechanism) return null;
      const target = normalizeSkillUiText(
        entryValue['目标'] || entryValue.target || entryValue['对象'] || (fallback && fallback.target),
        '',
      );
      const duration = Math.max(
        0,
        toNumber(
          entryValue['持续回合']
          ?? entryValue['持续']
          ?? valueConfig.durationRounds
          ?? valueConfig.duration
          ?? valueConfig.rounds,
          0,
        ),
      );
      const normalizedEffect = { '机制': mechanism };
      if (target) normalizedEffect['目标'] = target;
      if (duration > 0) normalizedEffect['持续回合'] = duration;

      const immuneLevel = normalizeSkillUiText(entryValue['免控级别'] || valueConfig.immuneLevel, '');
      const reduceRatio = formatSkillDesignerNumericInput(entryValue['减伤比例'] ?? valueConfig.reduceRatio);
      const shieldSource = normalizeSkillUiText(entryValue['护盾来源'] || valueConfig.shieldSource, '');
      if (immuneLevel) normalizedEffect['免控级别'] = immuneLevel;
      if (reduceRatio) normalizedEffect['减伤比例'] = reduceRatio;
      if (shieldSource) normalizedEffect['护盾来源'] = shieldSource;
      return normalizedEffect;
    }

    function getSkillDesignerEffectSignature(effect = {}) {
      const mechanism = normalizeSkillUiText(effect && effect['机制'], '');
      const target = normalizeSkillUiText(effect && (effect['目标'] || effect['对象']), '');
      const property = normalizeSkillUiText(effect && effect['属性'], '');
      const action = normalizeSkillUiText(effect && effect['动作'], '');
      const duration = getSkillDesignerEffectDuration(effect);
      const description = normalizeSkillUiText(
        effect && (effect['效果描述'] || effect['描述'] || effect.description || effect['文本']),
        '',
      );
      return [mechanism, target, property, action, String(duration), description].join('|');
    }

    function appendSkillDesignerEffectEntry(bucket = [], seen = new Set(), effect = null) {
      if (!effect || typeof effect !== 'object') return;
      const mechanism = normalizeSkillUiText(effect['机制'], '');
      if (!mechanism || mechanism === '系统基础' || isSkillSummaryEffect(effect)) return;
      const signature = getSkillDesignerEffectSignature(effect);
      if (!signature || seen.has(signature)) return;
      seen.add(signature);
      bucket.push(effect);
    }

    function appendSkillDesignerEffectEntries(source, bucket = [], seen = new Set(), context = {}) {
      if (Array.isArray(source)) {
        source.forEach(entry => appendSkillDesignerEffectEntries(entry, bucket, seen, context));
        return bucket;
      }
      if (!source || typeof source !== 'object') return bucket;

      const fallbackTarget = normalizeSkillUiText(context && context.target, '');
      const resolvedTarget = normalizeSkillUiText(
        source['目标'] || source['对象'] || source.target || fallbackTarget,
        fallbackTarget,
      );
      const explicitMechanism = normalizeSkillUiText(source['机制'], '');
      if (explicitMechanism) {
        const clonedEffect = cloneJsonValue(source);
        if (!normalizeSkillUiText(clonedEffect['目标'] || clonedEffect['对象'], '') && resolvedTarget) {
          clonedEffect['目标'] = resolvedTarget;
        }
        appendSkillDesignerEffectEntry(bucket, seen, clonedEffect);
      } else {
        appendSkillDesignerEffectEntry(
          bucket,
          seen,
          buildSkillDesignerNestedEffectEntry(source, { target: resolvedTarget }),
        );
      }

      if (Array.isArray(source['使用效果'])) {
        appendSkillDesignerEffectEntries(source['使用效果'], bucket, seen, { target: resolvedTarget || fallbackTarget });
      }
      if (Array.isArray(source.effects)) {
        appendSkillDesignerEffectEntries(source.effects, bucket, seen, { target: resolvedTarget || fallbackTarget });
      }
      if (source['背包模板'] && typeof source['背包模板'] === 'object') {
        appendSkillDesignerEffectEntries(source['背包模板'], bucket, seen, { target: resolvedTarget || fallbackTarget });
      }
      return bucket;
    }

    function getSkillDesignerSystemBaseEffect(effectArray = []) {
      return (Array.isArray(effectArray) ? effectArray : []).find(effect => {
        return normalizeSkillUiText(effect && effect['机制'], '') === '系统基础';
      }) || {};
    }

    function getSkillDesignerSystemBaseTags(effectArray = []) {
      return normalizeSkillDesignerArray(getSkillDesignerSystemBaseEffect(effectArray)['标签']);
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

        if (mechanism === '护盾') {
          pushParamHint('护盾', {
            duration: durationText,
            shieldCap: normalizeSkillUiText(effect && effect['护盾来源'], ''),
          });
          return;
        }

        if (mechanism === '减伤') {
          pushParamHint('减伤', {
            duration: durationText,
            reduceRatio: formatSkillDesignerNumericInput(effect && effect['减伤比例']),
            damageType: normalizeSkillUiText(effect && effect['覆盖类型'], ''),
          });
          return;
        }

        if (mechanism === '霸体') {
          pushParamHint('霸体', {
            duration: durationText,
            immuneLevel: normalizeSkillUiText(effect && effect['免控级别'], ''),
            reduceRatio: formatSkillDesignerNumericInput(effect && effect['减伤比例']),
          });
          return;
        }

        if (mechanism === '分身') {
          pushParamHint('分身', {
            duration: durationText,
            cloneType: normalizeSkillUiText(effect && effect['分身类型'], ''),
            cloneCount: formatSkillDesignerNumericInput(effect && effect['分身数量'], 0),
            stealthRatio: formatSkillDesignerNumericInput(effect && effect['隐蔽度']),
            inheritRatio: formatSkillDesignerNumericInput(effect && effect['实力继承比例']),
            cloneName: normalizeSkillUiText(effect && effect['分身名称'], ''),
          });
          return;
        }

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
      return appendSkillDesignerEffectEntries(Array.isArray(effectArray) ? effectArray : [], [], new Set());
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
      const systemTagHints = getSkillDesignerSystemBaseTags(effectArray)
        .map(tag => SKILL_DESIGNER_PRIMARY_MECHANISM_HINTS[normalizeSkillUiText(tag, '')])
        .filter(Boolean);
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

      systemTagHints.forEach(primaryHint => {
        if (!primaryHint || typeof primaryHint !== 'object') return;
        if (!primaryMain && primaryHint.main) primaryMain = normalizeSkillUiText(primaryHint.main, '');
        if (!primarySub && primaryHint.sub && (!primaryMain || normalizeSkillUiText(primaryHint.main, '') === primaryMain)) {
          primarySub = normalizeSkillUiText(primaryHint.sub, '');
        }
        if (primaryHint.secondary) secondaryCandidates.push(primaryHint.secondary);
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
      if (mechanisms.includes('分身')) return '召唤承载';
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
      const systemTags = getSkillDesignerSystemBaseTags(effectArray);
      if (systemTags.length) return systemTags.slice(0, 8);
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
        const ringMarkerIndex = path.findIndex(part => toText(part, '') === '魂环');
        const ringIndex = ringMarkerIndex >= 0 ? path[ringMarkerIndex + 1] : '';
        const ringLabel = formatSkillDesignerChineseOrdinal(ringIndex, '魂环');
        const skillLabel = formatSkillDesignerSpiritSkillLabel(label || path[path.length - 1], ringIndex);
        return [ringLabel, skillLabel].filter(Boolean).join(' / ') || '魂环魂技';
      }
      if (scope === 'fusion_skill') return `融合技 / ${label || '未命名技能'}`;
      if (scope === 'art') return `功法 / ${label || '未命名技能'}`;
      if (scope === 'special_ability') return `特殊能力 / ${label || '未命名技能'}`;
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
      if (scope === 'special_ability') return { value: '特殊能力', display: '特殊能力' };
      if (scope === 'blood_passive') return { value: '被动', display: '被动' };
      return {
        value: normalizedFallback || '未设置',
        display: normalizedFallback || category || '未设置'
      };
    }

    function getSkillDesignerScopeLabels(previewMeta = {}) {
      const scope = toText(previewMeta && previewMeta.scope, 'skill');
      if (scope === 'art') {
        return {
          studioTitle: '功法设计台',
          anchorTitle: '功法锚点',
          parameterTitle: '功法参数',
          summaryTitle: '功法速览',
          nameCardLabel: '功法名称',
          typeCardLabel: '功法类别',
          nameFieldLabel: '功法名',
          targetLabel: '运转对象',
          deliveryLabel: '运转方式',
          roleLabel: '功法定位',
          visualLabel: '运转表现',
          effectLabel: '功法描述',
        };
      }
      if (scope === 'special_ability') {
        return {
          studioTitle: '特殊能力设计台',
          anchorTitle: '能力锚点',
          parameterTitle: '能力参数',
          summaryTitle: '能力速览',
          nameCardLabel: '能力名称',
          typeCardLabel: '能力类别',
          nameFieldLabel: '能力名',
          targetLabel: '作用对象',
          deliveryLabel: '施展方式',
          roleLabel: '能力定位',
          visualLabel: '表现描述',
          effectLabel: '能力描述',
        };
      }
      if (scope === 'fusion_skill') {
        return {
          studioTitle: '融合技设计台',
          anchorTitle: '融合锚点',
          parameterTitle: '融合结构',
          summaryTitle: '融合速览',
          nameCardLabel: '融合技名称',
          typeCardLabel: '技能归属',
          nameFieldLabel: '融合技名',
          targetLabel: '作用对象',
          deliveryLabel: '施放形式',
          roleLabel: '战斗定位',
          visualLabel: '融合表现',
          effectLabel: '融合效果',
        };
      }
      return {
        studioTitle: '技能设计台',
        anchorTitle: '技能锚点',
        parameterTitle: '设计参数',
        summaryTitle: '设计速览',
        nameCardLabel: '技能名称',
        typeCardLabel: '技能归属',
        nameFieldLabel: '技能名',
        targetLabel: '作用对象',
        deliveryLabel: '释放形式',
        roleLabel: '战斗定位',
        visualLabel: '画面描述',
        effectLabel: '效果描述',
      };
    }

    function getSkillDesignerDefaultTarget(previewMeta = {}, type = '') {
      const scope = toText(previewMeta && previewMeta.scope, 'skill');
      const normalizedType = normalizeSkillUiText(type, '');
      if (scope === 'art' || scope === 'blood_passive' || /被动/.test(normalizedType)) return '自身';
      return '敌方单体';
    }

    function normalizeSkillDesignerTargetForForm(target = '', fallback = '') {
      const text = normalizeSkillUiText(target, fallback);
      const aliasMap = {
        '己方/单体': '友方单体',
        '己方/群体': '友方群体',
        '敌方/单体': '敌方单体',
        '敌方/群体': '敌方群体',
      };
      return aliasMap[text] || text;
    }

    function resolveSkillDesignerImplicitAttributeConfig(state = {}, previewMeta = {}) {
      const attachedAttributes = normalizeSkillDesignerArray(state && state.attachedAttributes);
      const scope = toText(previewMeta && previewMeta.scope, 'skill');
      const type = normalizeSkillUiText(state && state.type, '');
      const allWuxing = attachedAttributes.length >= 2 && attachedAttributes.every(attr => WUXING_ATTRIBUTE_TOKEN_OPTIONS.includes(attr));
      let source = '无';
      if (attachedAttributes.length) {
        if (allWuxing) source = '魂技调用';
        else if (scope === 'art' || scope === 'special_ability' || /元素|精神|功法|特殊/.test(type)) source = '自身操控';
      }
      return {
        source,
        role: source === '魂技调用' ? '结构术式' : (source === '自身操控' ? '增幅器' : '无'),
        coeff: normalizeSkillDesignerCoeffMap({}),
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
        bonus: '无',
        mainRole: normalizeSkillUiText(inferredMainRole, '未知'),
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
        artStage: normalizeSkillUiText(safeSkill['境界'] || designDraft['境界'], '未入门'),
        artLevel: Math.max(0, toNumber(safeSkill['lv'] ?? designDraft['lv'], 0)),
        artExp: Math.max(0, toNumber(safeSkill['exp'] ?? designDraft['exp'], 0)),
        fusionMode: (designDraft['融合模式'] || safeSkill['融合模式']) ? normalizeSkillDesignerFusionMode(designDraft['融合模式'] || safeSkill['融合模式']) : '',
        fusionPartner: normalizeSkillUiText(designDraft['融合对象'] || safeSkill['融合对象'], ''),
        fusionSourceSpirits: normalizeSkillDesignerArray(designDraft['来源武魂'] || safeSkill['来源武魂']),
        fusionParticipants: getSkillDesignerRawFusionParticipants(designDraft, safeSkill),
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
      if (target) parts.push(`对象：${target}`);
      if (cost && cost !== '无') parts.push(`消耗：${cost}`);
      return parts.join('；');
    }

    function buildSkillDesignerArtProgressSummary(draft = {}) {
      const type = normalizeSkillUiText(draft.type, '');
      if (type !== '功法') return '';
      const stage = normalizeSkillUiText(draft.artStage, '未入门');
      const level = Math.max(0, toNumber(draft.artLevel, 0));
      const exp = Math.max(0, toNumber(draft.artExp, 0));
      return `境界：${stage}；等级：${level}；熟练度：${exp}`;
    }

    function buildSkillDesignerAttributeSummary(draft = {}) {
      const attachedAttributes = normalizeSkillDesignerArray(draft.attachedAttributes);
      return attachedAttributes.length ? `附带属性：${attachedAttributes.join('/')}` : '';
    }

    function buildSkillDesignerCompactSummary(draft = {}) {
      return [
        buildSkillDesignerFusionSummary(draft),
        buildSkillDesignerMechanicSummary(draft),
        buildSkillDesignerMechanicParamSummary(draft),
        buildSkillDesignerExecutionSummary(draft),
        buildSkillDesignerArtProgressSummary(draft),
        buildSkillDesignerAttributeSummary(draft),
      ]
        .filter(Boolean)
        .join(' ｜ ');
    }

    function buildSkillDesignerRuntimeSummaryEffects(draft = {}) {
      const attachedAttributes = normalizeSkillDesignerArray(draft.attachedAttributes);
      const summaryEffects = [];
      if (attachedAttributes.length) {
        summaryEffects.push({
          '机制': '属性摘要',
          summaryOnly: true,
          '文本': `附带属性：${attachedAttributes.join('/')}`,
          '属性列表': [...attachedAttributes],
          '显示元素': attachedAttributes.join('/') || '无',
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
      const rawOptions = Array.isArray(options) ? options : [];
      const normalizedOptions = rawOptions.map(option => {
        if (option && typeof option === 'object') {
          const value = toText(option.value ?? option.label, '').trim();
          const label = toText(option.label ?? option.value, value).trim();
          return value ? { value, label: label || value } : null;
        }
        const value = toText(option, '').trim();
        return value ? { value, label: value } : null;
      }).filter(Boolean);
      const optionList = [];
      const seen = new Set();
      if (blankLabel) optionList.push({ value: '', label: blankLabel });
      normalizedOptions.forEach(option => {
        if (seen.has(option.value)) return;
        seen.add(option.value);
        optionList.push(option);
      });
      const selectedText = toText(selected, '');
      return optionList.map(option => {
        const safeValue = toText(option.value, '');
        const label = toText(option.label, safeValue);
        return `<option value=\"${escapeHtmlAttr(safeValue)}\"${safeValue === selectedText ? ' selected' : ''}>${htmlEscape(label)}</option>`;
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

    function normalizeSkillDesignerFusionMode(value = '') {
      const raw = normalizeSkillUiText(value, '').trim();
      if (!raw) return 'partner';
      if (raw === 'self' || /自体|自身|自己|双生|双武魂/.test(raw)) return 'self';
      return 'partner';
    }

    function formatSkillDesignerFusionModeLabel(mode = '', participants = []) {
      if (normalizeSkillDesignerFusionMode(mode) === 'self') return '自体融合';
      return normalizeSkillDesignerFusionParticipantList(participants).length > 2 ? '多人融合' : '双人融合';
    }

    function resolveSkillDesignerSpiritDisplayName(slotName = '', spiritData = {}) {
      const safeSpirit = spiritData && typeof spiritData === 'object' ? spiritData : {};
      return normalizeSkillUiText(
        safeSpirit['表象名称'] || safeSpirit.name || safeSpirit.type || slotName,
        slotName || '武魂',
      );
    }

    function getSkillDesignerSpiritNameOptions(charData = {}) {
      const names = safeEntries(deepGet(charData, '武魂', {}))
        .map(([slotName, spiritData]) => resolveSkillDesignerSpiritDisplayName(slotName, spiritData))
        .map(name => normalizeSkillUiText(name, '').trim())
        .filter(name => name && !/^(未设置|未知|无)$/.test(name));
      return Array.from(new Set(names));
    }

    function getSkillDesignerCharDisplayName(charKey = '', charData = {}) {
      return normalizeSkillUiText(
        charData && (charData.name || deepGet(charData, 'base.name', '')),
        charKey || '未命名角色',
      );
    }

    function getSkillDesignerCharByPreviewPath(rootData = {}, previewMeta = {}) {
      const path = Array.isArray(previewMeta && previewMeta.path) ? previewMeta.path : [];
      const charKey = path[0] === 'char' ? toText(path[1], '').trim() : '';
      return {
        charKey,
        charData: charKey ? deepGet(rootData, ['char', charKey], {}) : {},
      };
    }

    function getSkillDesignerFusionRecord(rootData = {}, previewMeta = {}) {
      const path = Array.isArray(previewMeta && previewMeta.path) ? previewMeta.path : [];
      if (toText(previewMeta && previewMeta.scope, '') !== 'fusion_skill') return {};
      if (toText(path[path.length - 1], '') !== '技能数据') return {};
      const record = deepGet(rootData, path.slice(0, -1), {});
      return record && typeof record === 'object' ? record : {};
    }

    function findSkillDesignerCharKeyByName(rootData = {}, rawName = '') {
      const target = normalizeSkillUiText(rawName, '').trim();
      if (!target) return '';
      const charRoot = deepGet(rootData, 'char', {});
      if (charRoot && Object.prototype.hasOwnProperty.call(charRoot, target)) return target;
      const match = safeEntries(charRoot).find(([key, charData]) =>
        getSkillDesignerCharDisplayName(key, charData) === target
      );
      return match ? match[0] : '';
    }

    function getSkillDesignerFusionSelfEntry(rootData = {}, previewMeta = {}, snapshot = {}) {
      const { charKey, charData } = getSkillDesignerCharByPreviewPath(rootData, previewMeta);
      const fallbackName = normalizeSkillUiText(snapshot && snapshot.activeName, charKey || '当前角色');
      return {
        charKey,
        charName: getSkillDesignerCharDisplayName(charKey, charData) || fallbackName,
        charData,
        spirits: getSkillDesignerSpiritNameOptions(charData),
      };
    }

    function getSkillDesignerFusionCharOptions(rootData = {}, previewMeta = {}, extraParticipants = []) {
      const selfEntry = getSkillDesignerFusionSelfEntry(rootData, previewMeta);
      const charOptions = safeEntries(deepGet(rootData, 'char', {}))
        .map(([key, charData]) => ({
          value: key,
          label: getSkillDesignerCharDisplayName(key, charData),
        }))
        .filter(option => option.value && option.label && option.value !== selfEntry.charKey);
      normalizeSkillDesignerFusionParticipantList(extraParticipants).forEach(participant => {
        if (
          participant.charKey
          && participant.charName
          && participant.charKey !== selfEntry.charKey
          && !charOptions.some(option => option.value === participant.charKey)
        ) {
          charOptions.unshift({ value: participant.charKey, label: participant.charName });
        }
      });
      return charOptions;
    }

    function getSkillDesignerFusionCharData(rootData = {}, charKey = '') {
      return charKey ? deepGet(rootData, ['char', charKey], {}) : {};
    }

    function getSkillDesignerFusionSpiritOptions(rootData = {}, charKey = '', fallbackSpirit = '') {
      const options = getSkillDesignerSpiritNameOptions(getSkillDesignerFusionCharData(rootData, charKey));
      const fallback = normalizeSkillUiText(fallbackSpirit, '');
      if (fallback && !options.includes(fallback)) options.unshift(fallback);
      return options;
    }

    function resolveSkillDesignerFusionSpirit(rootData = {}, charKey = '', currentSpirit = '') {
      const spiritOptions = getSkillDesignerSpiritNameOptions(getSkillDesignerFusionCharData(rootData, charKey));
      const current = normalizeSkillUiText(currentSpirit, '');
      if (current && spiritOptions.includes(current)) return current;
      return spiritOptions[0] || current;
    }

    function normalizeSkillDesignerFusionParticipant(participant = {}, rootData = {}) {
      const raw = participant && typeof participant === 'object' ? participant : {};
      const roleText = normalizeSkillUiText(raw.role || raw['类型'] || raw['身份'], '');
      const role = roleText === 'self' || /自身|自体|自己|本体/.test(roleText) ? 'self' : 'partner';
      const rawCharName = normalizeSkillUiText(raw.charName || raw.char_name || raw.name || raw['角色'] || raw['角色名'], '');
      let charKey = normalizeSkillUiText(raw.charKey || raw.char_key || raw.key || raw['角色键'] || raw['角色key'], '');
      if (!charKey && rawCharName) charKey = findSkillDesignerCharKeyByName(rootData, rawCharName);
      const charData = getSkillDesignerFusionCharData(rootData, charKey);
      const charName = getSkillDesignerCharDisplayName(charKey, charData) || rawCharName || charKey;
      const spirit = normalizeSkillUiText(raw.spirit || raw.spiritName || raw.spirit_name || raw.sourceSpirit || raw.source_spirit || raw['武魂'] || raw['来源武魂'], '');
      return {
        role,
        charKey,
        charName,
        spirit,
      };
    }

    function normalizeSkillDesignerFusionParticipantList(participants = [], rootData = {}) {
      if (!Array.isArray(participants)) return [];
      return participants
        .map(participant => normalizeSkillDesignerFusionParticipant(participant, rootData))
        .filter(participant => participant.charKey || participant.charName || participant.spirit);
    }

    function getSkillDesignerRawFusionParticipants(draft = {}, fusionRecord = {}) {
      const safeDraft = draft && typeof draft === 'object' ? draft : {};
      const safeRecord = fusionRecord && typeof fusionRecord === 'object' ? fusionRecord : {};
      const raw = [
        safeDraft.fusionParticipants,
        safeDraft['融合参与者'],
        safeRecord['融合参与者'],
      ].find(candidate => Array.isArray(candidate) && candidate.length);
      return Array.isArray(raw) ? raw : [];
    }

    function parseSkillDesignerFusionPartnerNames(value = '') {
      const raw = normalizeSkillUiText(value, '');
      if (!raw || raw === SKILL_DESIGNER_SELF_FUSION_PARTNER) return [];
      return raw
        .split(/[、,，+\/|｜；;]/)
        .map(item => normalizeSkillUiText(item, '').trim())
        .filter(Boolean);
    }

    function createSkillDesignerFusionParticipant(role = 'partner', charKey = '', charName = '', spirit = '') {
      return {
        role: role === 'self' ? 'self' : 'partner',
        charKey: normalizeSkillUiText(charKey, ''),
        charName: normalizeSkillUiText(charName, ''),
        spirit: normalizeSkillUiText(spirit, ''),
      };
    }

    function createSkillDesignerDefaultPartnerParticipant(rootData = {}, previewMeta = {}, usedCharKeys = []) {
      const used = new Set(normalizeSkillDesignerArray(usedCharKeys));
      const options = getSkillDesignerFusionCharOptions(rootData, previewMeta);
      const option = options.find(item => !used.has(item.value)) || options[0] || { value: '', label: '' };
      const spiritOptions = getSkillDesignerFusionSpiritOptions(rootData, option.value);
      return createSkillDesignerFusionParticipant('partner', option.value, option.label, spiritOptions[0] || '');
    }

    function buildSkillDesignerFusionParticipants(snapshot = {}, previewMeta = {}, baseDraft = {}, fusionRecord = {}) {
      if (toText(previewMeta && previewMeta.scope, '') !== 'fusion_skill') return [];
      const rootData = snapshot && snapshot.rootData ? snapshot.rootData : {};
      const selfEntry = getSkillDesignerFusionSelfEntry(rootData, previewMeta, snapshot);
      const selfSpiritOptions = selfEntry.spirits;
      let fusionMode = normalizeSkillDesignerFusionMode(
        baseDraft.fusionMode
        || baseDraft['融合模式']
        || fusionRecord.融合模式
        || '',
      );
      if (fusionMode === 'self' && selfSpiritOptions.length < 2) fusionMode = 'partner';
      const rawParticipants = getSkillDesignerRawFusionParticipants(baseDraft, fusionRecord);
      let participants = normalizeSkillDesignerFusionParticipantList(rawParticipants, rootData);
      if (!participants.length) {
        const sourceSpirits = normalizeSkillDesignerArray(
          baseDraft.fusionSourceSpirits
          || baseDraft['来源武魂']
          || fusionRecord.来源武魂
        );
        if (fusionMode === 'self') {
          participants = [
            createSkillDesignerFusionParticipant('self', selfEntry.charKey, selfEntry.charName, sourceSpirits[0] || selfSpiritOptions[0] || ''),
            createSkillDesignerFusionParticipant('self', selfEntry.charKey, selfEntry.charName, sourceSpirits[1] || selfSpiritOptions[1] || selfSpiritOptions[0] || ''),
          ];
        } else {
          const partnerNames = parseSkillDesignerFusionPartnerNames(
            baseDraft.fusionPartner
            || baseDraft['融合对象']
            || fusionRecord['融合对象']
            || '',
          );
          participants = [
            createSkillDesignerFusionParticipant('self', selfEntry.charKey, selfEntry.charName, sourceSpirits[0] || selfSpiritOptions[0] || ''),
          ];
          partnerNames.forEach((name, index) => {
            const charKey = findSkillDesignerCharKeyByName(rootData, name);
            const charName = charKey ? getSkillDesignerCharDisplayName(charKey, getSkillDesignerFusionCharData(rootData, charKey)) : name;
            const spiritOptions = getSkillDesignerFusionSpiritOptions(rootData, charKey);
            participants.push(createSkillDesignerFusionParticipant('partner', charKey, charName, sourceSpirits[index + 1] || spiritOptions[0] || ''));
          });
          if (participants.length < 2) {
            participants.push(createSkillDesignerDefaultPartnerParticipant(rootData, previewMeta, participants.map(item => item.charKey)));
          }
        }
      }
      if (fusionMode === 'self') {
        const selfRows = participants.filter(participant => participant.role === 'self');
        const firstSpirit = resolveSkillDesignerFusionSpirit(rootData, selfEntry.charKey, selfRows[0] && selfRows[0].spirit ? selfRows[0].spirit : (selfSpiritOptions[0] || ''));
        let secondSpirit = resolveSkillDesignerFusionSpirit(rootData, selfEntry.charKey, selfRows[1] && selfRows[1].spirit ? selfRows[1].spirit : (selfSpiritOptions.find(name => name !== firstSpirit) || selfSpiritOptions[1] || firstSpirit));
        if (selfSpiritOptions.length > 1 && secondSpirit === firstSpirit) {
          secondSpirit = selfSpiritOptions.find(name => name !== firstSpirit) || secondSpirit;
        }
        return [
          createSkillDesignerFusionParticipant('self', selfEntry.charKey, selfEntry.charName, firstSpirit),
          createSkillDesignerFusionParticipant('self', selfEntry.charKey, selfEntry.charName, secondSpirit),
        ];
      }
      const normalized = participants.map((participant, index) => {
        if (index === 0 || participant.role === 'self') {
          const spirit = resolveSkillDesignerFusionSpirit(rootData, selfEntry.charKey, participant.spirit);
          return createSkillDesignerFusionParticipant('self', selfEntry.charKey, selfEntry.charName, spirit);
        }
        const charKey = participant.charKey || findSkillDesignerCharKeyByName(rootData, participant.charName);
        const charName = getSkillDesignerCharDisplayName(charKey, getSkillDesignerFusionCharData(rootData, charKey)) || participant.charName;
        const spirit = resolveSkillDesignerFusionSpirit(rootData, charKey, participant.spirit);
        return createSkillDesignerFusionParticipant('partner', charKey, charName, spirit);
      });
      if (!normalized.some(participant => participant.role === 'partner')) {
        normalized.push(createSkillDesignerDefaultPartnerParticipant(rootData, previewMeta, normalized.map(item => item.charKey)));
      }
      return normalized;
    }

    function deriveSkillDesignerFusionFields(mode = '', participants = [], fallbackPartner = '') {
      const participantList = normalizeSkillDesignerFusionParticipantList(participants);
      const fusionMode = normalizeSkillDesignerFusionMode(mode);
      const partnerNames = participantList
        .filter(participant => participant.role !== 'self')
        .map(participant => participant.charName || participant.charKey)
        .filter(Boolean);
      return {
        fusionMode,
        fusionPartner: fusionMode === 'self'
          ? SKILL_DESIGNER_SELF_FUSION_PARTNER
          : (partnerNames.length ? Array.from(new Set(partnerNames)).join('、') : normalizeSkillUiText(fallbackPartner, '')),
        fusionSourceSpirits: participantList.map(participant => participant.spirit).filter(Boolean),
        fusionParticipants: participantList,
      };
    }

    function isSkillDesignerFusionBlankText(value = '') {
      const text = normalizeSkillUiText(value, '').trim();
      return !text || /^(未设置|未知|无|未接入武魂)$/.test(text);
    }

    function assertSkillDesignerFusionState(draft = {}) {
      const fields = deriveSkillDesignerFusionFields(draft.fusionMode, draft.fusionParticipants, draft.fusionPartner);
      const participants = fields.fusionParticipants;
      if (participants.length < 2) throw new Error('融合技至少需要两个参与武魂。');
      const incomplete = participants.some(participant =>
        (isSkillDesignerFusionBlankText(participant.charKey) && isSkillDesignerFusionBlankText(participant.charName))
        || isSkillDesignerFusionBlankText(participant.spirit)
      );
      if (incomplete) throw new Error('融合对象需要指定角色与武魂。');
      if (fields.fusionMode === 'self') {
        const spirits = participants.map(participant => participant.spirit).filter(spirit => !isSkillDesignerFusionBlankText(spirit));
        if (new Set(spirits).size < 2) throw new Error('自体融合需要选择两个不同武魂。');
      }
      return fields;
    }

    function buildSkillDesignerFusionParticipantRows(participants = [], rootData = {}, previewMeta = {}) {
      const participantList = normalizeSkillDesignerFusionParticipantList(participants, rootData);
      const mode = participantList.filter(participant => participant.role === 'partner').length ? 'partner' : 'self';
      const partnerCount = participantList.filter(participant => participant.role === 'partner').length;
      return participantList.map((participant, index) => {
        const isSelf = participant.role === 'self';
        const charOptions = isSelf
          ? [{ value: participant.charKey, label: participant.charName || participant.charKey || '当前角色' }]
          : getSkillDesignerFusionCharOptions(rootData, previewMeta, participantList);
        const spiritOptions = getSkillDesignerFusionSpiritOptions(rootData, participant.charKey, participant.spirit);
        const charLabel = participant.charName || participant.charKey || '未设置';
        return `
          <div class=\"skill-designer-fusion-participant-row\" data-fusion-participant-row>
            <input type=\"hidden\" value=\"${escapeHtmlAttr(participant.role)}\" data-skill-designer-fusion-role />
            <label class=\"mvu-editor-field skill-designer-fusion-char-field\">
              <span class=\"mvu-editor-label\">角色</span>
              ${isSelf
                ? `
                  <div class=\"mvu-editor-static skill-designer-fusion-self-char\">${htmlEscape(charLabel)}</div>
                  <input type=\"hidden\" value=\"${escapeHtmlAttr(participant.charKey)}\" data-skill-designer-fusion-char data-skill-designer-fusion-char-name=\"${escapeHtmlAttr(charLabel)}\" />
                `
                : `
                  <select class=\"mvu-editor-select\" data-skill-designer-fusion-char data-skill-designer-disableable>
                    ${buildSkillDesignerSelectOptions(charOptions, participant.charKey, '未设置')}
                  </select>
                `}
            </label>
            <label class=\"mvu-editor-field skill-designer-fusion-spirit-field\">
              <span class=\"mvu-editor-label\">武魂</span>
              <select class=\"mvu-editor-select\" data-skill-designer-fusion-spirit data-skill-designer-disableable>
                ${buildSkillDesignerSelectOptions(spiritOptions, participant.spirit, spiritOptions.length ? '未设置' : '未接入武魂')}
              </select>
            </label>
            <div class=\"skill-designer-fusion-row-actions\">
              ${!isSelf && mode === 'partner' && partnerCount > 1
                ? `<button type=\"button\" class=\"tag-chip\" data-skill-designer-remove-fusion-participant data-skill-designer-disableable>移除</button>`
                : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    function getSkillDesignerFusionDraftSeed(snapshot = {}, previewMeta = {}, baseDraft = {}) {
      if (toText(previewMeta && previewMeta.scope, '') !== 'fusion_skill') return {};
      const rootData = snapshot && snapshot.rootData ? snapshot.rootData : {};
      const fusionRecord = getSkillDesignerFusionRecord(rootData, previewMeta);
      const selfEntry = getSkillDesignerFusionSelfEntry(rootData, previewMeta, snapshot);
      const spiritNames = selfEntry.spirits;
      const rawMode = baseDraft.fusionMode
        || baseDraft['融合模式']
        || fusionRecord.融合模式
        || '';
      let fusionMode = normalizeSkillDesignerFusionMode(rawMode);
      if (fusionMode === 'self' && spiritNames.length < 2) fusionMode = 'partner';
      const rawPartner = baseDraft.fusionPartner
        || baseDraft['融合对象']
        || fusionRecord['融合对象']
        || '';
      const fusionPartner = fusionMode === 'self'
        ? SKILL_DESIGNER_SELF_FUSION_PARTNER
        : normalizeSkillUiText(rawPartner, '');
      let fusionSourceSpirits = normalizeSkillDesignerArray(
        baseDraft.fusionSourceSpirits
        || baseDraft['来源武魂']
        || fusionRecord.来源武魂
      );
      if (fusionMode === 'self' && !fusionSourceSpirits.length) fusionSourceSpirits = spiritNames.slice(0, 2);
      const fusionParticipants = buildSkillDesignerFusionParticipants(snapshot, previewMeta, baseDraft, fusionRecord);
      const derivedFields = deriveSkillDesignerFusionFields(fusionMode, fusionParticipants, fusionPartner);
      return {
        fusionMode: derivedFields.fusionMode,
        fusionPartner: derivedFields.fusionPartner,
        fusionSourceSpirits: derivedFields.fusionSourceSpirits.length ? derivedFields.fusionSourceSpirits : fusionSourceSpirits,
        fusionParticipants: derivedFields.fusionParticipants,
      };
    }

    function buildSkillDesignerFusionSummary(draft = {}) {
      if (!draft || !draft.fusionMode) return '';
      const derivedFields = deriveSkillDesignerFusionFields(draft.fusionMode, draft.fusionParticipants, draft.fusionPartner);
      const participantText = derivedFields.fusionParticipants
        .map(participant => {
          const charName = participant.charName || participant.charKey || '未设置';
          const spirit = participant.spirit || '未设置';
          return `${charName}:${spirit}`;
        })
        .join(' + ');
      const fallbackSourceText = normalizeSkillDesignerArray(draft.fusionSourceSpirits).join('/');
      return [formatSkillDesignerFusionModeLabel(derivedFields.fusionMode, derivedFields.fusionParticipants), participantText || derivedFields.fusionPartner || fallbackSourceText].filter(Boolean).join(' / ');
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
            createSkillDesignerSelectParam('affectedPanel', '影响对象', SKILL_DESIGNER_PARAM_PANEL_OPTIONS),
          ];
        case '增益类':
          return [
            createSkillDesignerNumberParam('duration', '持续回合', '3', '1'),
            createSkillDesignerNumberParam('gainRatio', '增益幅度', '0.25'),
            createSkillDesignerSelectParam('gainTarget', '覆盖对象', SKILL_DESIGNER_PARAM_SUPPORT_TARGET_OPTIONS),
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
            createSkillDesignerSelectParam('debuffAttr', '压制对象', SKILL_DESIGNER_PARAM_ATTRIBUTE_OPTIONS),
            createSkillDesignerNumberParam('reduceRatio', '压制倍率', '0.8'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        case '多属性削弱':
          return [
            createSkillDesignerSelectParam('debuffAttrGroup', '属性组', SKILL_DESIGNER_PARAM_ATTRIBUTE_GROUP_OPTIONS),
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
            createSkillDesignerSelectParam('buffAttr', '增幅对象', SKILL_DESIGNER_PARAM_ATTRIBUTE_OPTIONS),
            createSkillDesignerNumberParam('gainRatio', '增幅倍率', '0.3'),
            createSkillDesignerNumberParam('duration', '持续回合', '3', '1'),
          ];
        case '多属性增益':
          return [
            createSkillDesignerSelectParam('buffAttrGroup', '属性组', SKILL_DESIGNER_PARAM_ATTRIBUTE_GROUP_OPTIONS),
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
            createSkillDesignerSelectParam('shieldCap', '护盾上限', SKILL_DESIGNER_PARAM_SHIELD_CAP_OPTIONS),
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
            createSkillDesignerSelectParam('immuneLevel', '免控级别', SKILL_DESIGNER_PARAM_IMMUNE_LEVEL_OPTIONS),
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
            createSkillDesignerSelectParam('cleansePriority', '净化优先级', SKILL_DESIGNER_PARAM_CLEANSE_PRIORITY_OPTIONS),
            createSkillDesignerSelectParam('extraGain', '附带收益', SKILL_DESIGNER_PARAM_CLEANSE_GAIN_OPTIONS),
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
            createSkillDesignerSelectParam('trackingRule', '追踪规则', SKILL_DESIGNER_PARAM_TRACKING_RULE_OPTIONS),
          ];
        case '共享视野':
          return [
            createSkillDesignerTextParam('shareRange', '共享范围', '队伍 / 半径30米'),
            createSkillDesignerNumberParam('duration', '持续回合', '3', '1'),
            createSkillDesignerSelectParam('infoDepth', '共享深度', SKILL_DESIGNER_PARAM_INFO_DEPTH_OPTIONS),
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
            createSkillDesignerSelectParam('wakeRule', '唤醒条件', SKILL_DESIGNER_PARAM_WAKE_RULE_OPTIONS),
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
            createSkillDesignerSelectParam('extraGain', '脱离收益', SKILL_DESIGNER_PARAM_ESCAPE_GAIN_OPTIONS),
          ];
        case '分身':
          return [
            createSkillDesignerSelectParam('cloneType', '分身类型', SKILL_DESIGNER_PARAM_CLONE_TYPE_OPTIONS),
            createSkillDesignerNumberParam('cloneCount', '分身数量', '2', '1'),
            createSkillDesignerNumberParam('stealthRatio', '隐蔽度', '0.45'),
            createSkillDesignerNumberParam('inheritRatio', '实力继承', '0.55'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
            createSkillDesignerTextParam('cloneName', '分身称谓', '影分身 / 心像'),
          ];
        case '复制':
          return [
            createSkillDesignerSelectParam('copyTarget', '复制对象', SKILL_DESIGNER_PARAM_COPY_TARGET_OPTIONS),
            createSkillDesignerNumberParam('fidelity', '保真度', '0.8'),
            createSkillDesignerTextParam('duration', '维持时长', '2回合'),
          ];
        case '反制':
          return [
            createSkillDesignerSelectParam('counterTarget', '反制对象', SKILL_DESIGNER_PARAM_COUNTER_TARGET_OPTIONS),
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
            createSkillDesignerSelectParam('exchangeTarget', '交换对象', SKILL_DESIGNER_PARAM_EXCHANGE_TARGET_OPTIONS),
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
            createSkillDesignerSelectParam('triggerResult', '触发结果', SKILL_DESIGNER_PARAM_TRIGGER_RESULT_OPTIONS),
          ];
        case '规则改写':
          return [
            createSkillDesignerSelectParam('rewriteDepth', '改写幅度', SKILL_DESIGNER_PARAM_REWRITE_DEPTH_OPTIONS),
          ];
        case '穿透':
          return [
            createSkillDesignerNumberParam('penetrationRatio', '穿透比例', '0.25'),
            createSkillDesignerSelectParam('penetrationTarget', '穿透对象', SKILL_DESIGNER_PARAM_PENETRATION_TARGET_OPTIONS),
          ];
        case '吸血':
          return [
            createSkillDesignerNumberParam('lifestealRatio', '吸取比例', '0.2'),
            createSkillDesignerSelectParam('resourceType', '吸取资源', SKILL_DESIGNER_PARAM_LIFESTEAL_RESOURCE_OPTIONS),
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
            createSkillDesignerSelectParam('interruptWindow', '打断时机', SKILL_DESIGNER_PARAM_INTERRUPT_WINDOW_OPTIONS),
            createSkillDesignerNumberParam('extraDelay', '追加僵直', '0.5'),
          ];
        case '反击':
          return [
            createSkillDesignerSelectParam('counterRule', '反击条件', SKILL_DESIGNER_PARAM_COUNTER_RULE_OPTIONS),
            createSkillDesignerNumberParam('counterRatio', '反击倍率', '0.8'),
          ];
        case '沉默':
          return [
            createSkillDesignerNumberParam('duration', '沉默回合', '2', '1'),
            createSkillDesignerSelectParam('muteScope', '限制范围', SKILL_DESIGNER_PARAM_MUTE_SCOPE_OPTIONS),
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
            createSkillDesignerSelectParam('blindEffect', '影响内容', SKILL_DESIGNER_PARAM_BLIND_EFFECT_OPTIONS),
          ];
        case '禁疗':
          return [
            createSkillDesignerNumberParam('banHealRatio', '禁疗幅度', '1.0'),
            createSkillDesignerNumberParam('duration', '持续回合', '2', '1'),
          ];
        case '标记弱点':
          return [
            createSkillDesignerSelectParam('weakPointType', '弱点类型', SKILL_DESIGNER_PARAM_WEAK_POINT_TYPE_OPTIONS),
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
      let resolvedTarget = normalizeSkillDesignerTargetForForm(baseDraft.target, getSkillDesignerDefaultTarget(previewMeta, typeMeta.value));
      if (/^(未知|未设置|无)$/.test(resolvedTarget)) resolvedTarget = getSkillDesignerDefaultTarget(previewMeta, typeMeta.value);
      const isFusionScope = toText(previewMeta && previewMeta.scope, '') === 'fusion_skill';
      const rawFusionMode = isFusionScope ? normalizeSkillDesignerFusionMode(baseDraft.fusionMode || baseDraft['融合模式']) : '';
      const rawFusionPartner = isFusionScope ? normalizeSkillUiText(baseDraft.fusionPartner || baseDraft['融合对象'], '') : '';
      const rawFusionParticipants = isFusionScope ? normalizeSkillDesignerFusionParticipantList(getSkillDesignerRawFusionParticipants(baseDraft)) : [];
      const derivedFusionFields = isFusionScope
        ? deriveSkillDesignerFusionFields(rawFusionMode, rawFusionParticipants, rawFusionPartner)
        : { fusionMode: '', fusionPartner: '', fusionSourceSpirits: [], fusionParticipants: [] };
      const resolvedPrimarySub = normalizeSkillUiText(
        baseDraft.primarySub,
        getSkillDesignerDefaultPrimarySub(resolvedPrimaryMain, resolvedTarget, typeMeta.value),
      );
      const derivedMainRole = inferSkillDesignerMainRole(
        typeMeta.value,
        resolvedTarget,
        resolvedPrimaryMain,
        resolvedPrimarySub,
      );
      const coreState = {
        name: normalizeSkillUiText(baseDraft.name, toText(previewMeta && previewMeta.label, '未命名技能')),
        type: typeMeta.value,
        typeDisplay: typeMeta.display,
        target: resolvedTarget,
        cost: formatSkillDesignerCostText(costConfig.resourceType, costConfig.resourceValue),
        costType: costConfig.resourceType,
        costValue: costConfig.resourceValue,
        bonus: '无',
        mainRole: normalizeSkillUiText(derivedMainRole, '未知'),
        primaryMain: resolvedPrimaryMain,
        primarySub: resolvedPrimarySub,
        deliveryForm: normalizeSkillUiText(baseDraft.deliveryForm, ''),
        secondaryMechanics: normalizeSkillDesignerSecondarySelection(resolvedPrimaryMain, baseDraft.secondaryMechanics),
        attachedAttributes: normalizeSkillDesignerArray(baseDraft.attachedAttributes),
        attributeSource: '无',
        attributeRole: '无',
        coeff: normalizeSkillDesignerCoeffMap({}),
        tags: normalizeSkillDesignerArray(baseDraft.tags),
        visualDesc: normalizeSkillUiText(baseDraft.visualDesc, ''),
        effectDesc: normalizeSkillUiText(baseDraft.effectDesc, ''),
        artStage: normalizeSkillUiText(baseDraft.artStage, '未入门'),
        artLevel: Math.max(0, toNumber(baseDraft.artLevel, 0)),
        artExp: Math.max(0, toNumber(baseDraft.artExp, 0)),
        fusionMode: derivedFusionFields.fusionMode,
        fusionPartner: derivedFusionFields.fusionPartner,
        fusionSourceSpirits: derivedFusionFields.fusionSourceSpirits.length
          ? derivedFusionFields.fusionSourceSpirits
          : (isFusionScope ? normalizeSkillDesignerArray(baseDraft.fusionSourceSpirits || baseDraft['来源武魂']) : []),
        fusionParticipants: derivedFusionFields.fusionParticipants,
      };
      const implicitAttributeConfig = resolveSkillDesignerImplicitAttributeConfig(coreState, previewMeta);
      return {
        ...coreState,
        attributeSource: implicitAttributeConfig.source,
        attributeRole: implicitAttributeConfig.role,
        coeff: implicitAttributeConfig.coeff,
        mechanicParams: normalizeSkillDesignerMechanicParamMap(baseDraft.mechanicParams, coreState),
      };
    }

    function readSkillDesignerFormState(mountEl, previewMeta = {}) {
      const readField = key => {
        const input = mountEl ? mountEl.querySelector(`[data-skill-designer-field=\"${key}\"]`) : null;
        return input ? toText(input.value, '').trim() : '';
      };
      const readCheckedValues = name => Array.from(mountEl ? mountEl.querySelectorAll(`input[name=\"${name}\"]:checked`) : []).map(node => toText(node.value, '').trim()).filter(Boolean);
      const readFusionParticipants = () => Array.from(mountEl ? mountEl.querySelectorAll('[data-fusion-participant-row]') : [])
        .map(row => {
          const roleInput = row.querySelector('[data-skill-designer-fusion-role]');
          const charInput = row.querySelector('[data-skill-designer-fusion-char]');
          const spiritInput = row.querySelector('[data-skill-designer-fusion-spirit]');
          const role = normalizeSkillUiText(roleInput && roleInput.value, '') === 'self' ? 'self' : 'partner';
          const charKey = normalizeSkillUiText(charInput && charInput.value, '');
          const selectedCharOption = charInput && charInput.tagName === 'SELECT'
            ? charInput.options[charInput.selectedIndex]
            : null;
          const charName = normalizeSkillUiText(
            charInput && charInput.getAttribute('data-skill-designer-fusion-char-name'),
            normalizeSkillUiText(selectedCharOption && selectedCharOption.textContent, charKey),
          );
          const spirit = normalizeSkillUiText(spiritInput && spiritInput.value, '');
          return createSkillDesignerFusionParticipant(role, charKey, charName, spirit);
        })
        .filter(participant => participant.charKey || participant.charName || participant.spirit);
      const typeMeta = resolveSkillDesignerTypeMeta(previewMeta, readField('type'));
      const resolvedPrimaryMain = readField('primaryMain');
      const resolvedPrimarySub = readField('primarySub');
      const resolvedTarget = normalizeSkillDesignerTargetForForm(readField('target'), getSkillDesignerDefaultTarget(previewMeta, typeMeta.value));
      const isFusionScope = toText(previewMeta && previewMeta.scope, '') === 'fusion_skill';
      const fusionMode = isFusionScope ? normalizeSkillDesignerFusionMode(readField('fusionMode')) : '';
      const fusionParticipants = isFusionScope ? readFusionParticipants() : [];
      const derivedFusionFields = isFusionScope
        ? deriveSkillDesignerFusionFields(fusionMode, fusionParticipants, '')
        : { fusionPartner: '', fusionSourceSpirits: [], fusionParticipants: [] };
      const derivedMainRole = inferSkillDesignerMainRole(
        typeMeta.value,
        resolvedTarget,
        resolvedPrimaryMain,
        resolvedPrimarySub,
      );
      const baseState = {
        name: readField('name') || toText(previewMeta && previewMeta.label, '未命名技能'),
        type: typeMeta.value,
        typeDisplay: typeMeta.display,
        target: resolvedTarget,
        costType: readField('costType') || '无',
        costValue: readField('costValue'),
        bonus: '无',
        mainRole: normalizeSkillUiText(derivedMainRole, '未知'),
        primaryMain: resolvedPrimaryMain,
        primarySub: resolvedPrimarySub,
        deliveryForm: readField('deliveryForm'),
        secondaryMechanics: readCheckedValues('skill-secondary'),
        attachedAttributes: readCheckedValues('skill-attribute'),
        attributeSource: '无',
        attributeRole: '无',
        coeff: normalizeSkillDesignerCoeffMap({}),
        tags: normalizeSkillDesignerArray(readField('tags')),
        visualDesc: readField('visualDesc'),
        effectDesc: readField('effectDesc'),
        artStage: readField('artStage') || '未入门',
        artLevel: Math.max(0, toNumber(readField('artLevel'), 0)),
        artExp: Math.max(0, toNumber(readField('artExp'), 0)),
        fusionMode,
        fusionPartner: derivedFusionFields.fusionPartner,
        fusionSourceSpirits: derivedFusionFields.fusionSourceSpirits,
        fusionParticipants: derivedFusionFields.fusionParticipants,
      };
      const implicitAttributeConfig = resolveSkillDesignerImplicitAttributeConfig(baseState, previewMeta);
      return {
        ...baseState,
        attributeSource: implicitAttributeConfig.source,
        attributeRole: implicitAttributeConfig.role,
        coeff: implicitAttributeConfig.coeff,
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
      const primaryLabel = getSkillDesignerEffectivePrimaryLabel(draft);
      if (primaryLabel === '精神恢复') return 'men';
      if (primaryLabel === '魂力恢复') return 'sp';
      if (primaryLabel === '体力恢复') return 'vit';
      const attached = normalizeSkillDesignerArray(draft && draft.attachedAttributes);
      if (attached.includes('精神')) return 'men';
      if (attached.includes('生命')) return 'vit';
      if (attached.includes('光')) return 'vit';
      if (attached.includes('水')) return 'vit';
      if (attached.includes('木')) return 'vit';
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
                '面板修改比例': { 'agi': agiRatio },
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
        case '分身': {
          const cloneType = normalizeSkillUiText(params['cloneType'], '物理分身') || '物理分身';
          const cloneCount = parseSkillDesignerIntegerInputValue(params['cloneCount'], 2, 1);
          const stealthRatio = parseSkillDesignerPercentRatio(params['stealthRatio'], 0.45);
          const inheritRatio = parseSkillDesignerPercentRatio(params['inheritRatio'], 0.55);
          const duration = parseSkillDesignerIntegerInputValue(params['duration'], 2, 1);
          const cloneName = normalizeSkillUiText(params['cloneName'], '');
          const safeTarget = /敌/.test(target) ? '自身' : target;
          const statusName = cloneName ? `${cloneType}·${cloneName}` : cloneType;
          if (cloneType === '精神力分身') {
            return [
              buildSkillDesignerRuntimeObject({
                '机制': '分身',
                '目标': safeTarget,
                '状态名称': statusName,
                '持续回合': duration,
                '分身类型': cloneType,
                '分身数量': cloneCount,
                '隐蔽度': stealthRatio,
                '实力继承比例': inheritRatio,
                '分身名称': cloneName,
                'reaction_bonus': Number(Math.min(0.28, 0.04 + stealthRatio * 0.16 + inheritRatio * 0.08).toFixed(2)),
                'hit_bonus': Number(Math.min(0.3, 0.04 + inheritRatio * 0.15 + cloneCount * 0.03).toFixed(2)),
                'lock_level': Math.min(3, Math.max(1, Math.round(1 + inheritRatio * 1.2 + stealthRatio * 0.8))),
                'damage_reduction': Number(Math.min(0.18, 0.02 + stealthRatio * 0.05 + cloneCount * 0.01).toFixed(2)),
              }),
            ].filter(effect => safeEntries(effect).length);
          }
          return [
            buildSkillDesignerRuntimeObject({
              '机制': '分身',
              '目标': safeTarget,
              '状态名称': statusName,
              '持续回合': duration,
              '分身类型': cloneType,
              '分身数量': cloneCount,
              '隐蔽度': stealthRatio,
              '实力继承比例': inheritRatio,
              '分身名称': cloneName,
              'dodge_bonus': Number(Math.min(0.35, 0.05 + stealthRatio * 0.18 + inheritRatio * 0.08 + cloneCount * 0.03).toFixed(2)),
              'attacker_speed_bonus': Number(Math.min(0.24, 0.03 + inheritRatio * 0.12 + cloneCount * 0.02).toFixed(2)),
              'damage_reduction': Number(Math.min(0.22, 0.02 + stealthRatio * 0.08 + cloneCount * 0.015).toFixed(2)),
              'final_damage_mult': Number(Math.min(1.28, 1 + inheritRatio * 0.12 + Math.max(0, cloneCount - 1) * 0.04).toFixed(2)),
            }),
          ].filter(effect => safeEntries(effect).length);
        }
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
          const judgeKey = /低血|生命|血量/.test(triggerRule) ? 'hp_ratio' : 'men_max';
          const judgeThreshold = judgeKey === 'hp_ratio' ? 0.5 : 1.0;
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
            '判定属性': 'hp_ratio',
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
        if (['护盾', '减伤', '格挡', '霸体', '免死', '共享视野', '受击反击', '反制', '分身'].includes(mechanism)) {
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
      const normalizedFusionFields = previewMeta && previewMeta.scope === 'fusion_skill'
        ? assertSkillDesignerFusionState(normalized)
        : null;
      const designSummary = buildSkillDesignerCompactSummary(normalized);
      safeSkill['魂技名'] = normalized.name;
      safeSkill['name'] = normalized.name;
      safeSkill['技能类型'] = normalized.type;
      safeSkill['对象'] = normalized.target;
      safeSkill['消耗'] = normalized.cost;
      delete safeSkill['加成属性'];
      safeSkill['主定位'] = normalized.mainRole;
      safeSkill['标签'] = [...normalized.tags];
      safeSkill['画面描述'] = normalized.visualDesc;
      safeSkill['效果描述'] = normalized.effectDesc;
      if ('描述' in safeSkill || (previewMeta && ['art', 'fusion_skill'].includes(previewMeta.scope))) safeSkill['描述'] = normalized.effectDesc;
      if (previewMeta && previewMeta.scope === 'art') {
        safeSkill['境界'] = normalizeSkillUiText(normalized.artStage, '未入门');
        safeSkill['lv'] = Math.max(0, toNumber(normalized.artLevel, 0));
        safeSkill['exp'] = Math.max(0, toNumber(normalized.artExp, 0));
      }
      if (previewMeta && previewMeta.scope === 'fusion_skill') {
        safeSkill['融合模式'] = normalizedFusionFields.fusionMode;
        safeSkill['融合对象'] = normalizedFusionFields.fusionPartner;
        safeSkill['来源武魂'] = [...normalizedFusionFields.fusionSourceSpirits];
        safeSkill['融合参与者'] = cloneJsonValue(normalizedFusionFields.fusionParticipants);
      }
      safeSkill['附带属性'] = [...normalized.attachedAttributes];
      safeSkill['特效量化参数'] = designSummary;
      safeSkill['设计稿'] = {
        '主机制': normalized.primaryMain,
        '细分机制': normalized.primarySub,
        '释放形式': normalized.deliveryForm,
        '附加机制': [...normalized.secondaryMechanics],
        '机制参数': cloneJsonValue(normalizeSkillDesignerMechanicParamMap(normalized.mechanicParams, normalized)),
        '附带属性': [...normalized.attachedAttributes],
        '标签': [...normalized.tags],
        '技能类型': normalized.type,
        '对象': normalized.target,
        '消耗': normalized.cost,
        '消耗资源': normalized.costType,
        '消耗数值': normalized.costValue,
        '主定位': normalized.mainRole,
        '境界': normalizeSkillUiText(normalized.artStage, '未入门'),
        'lv': Math.max(0, toNumber(normalized.artLevel, 0)),
        'exp': Math.max(0, toNumber(normalized.artExp, 0)),
        ...(previewMeta && previewMeta.scope === 'fusion_skill' ? {
          '融合模式': normalizedFusionFields.fusionMode,
          '融合对象': normalizedFusionFields.fusionPartner,
          '来源武魂': [...normalizedFusionFields.fusionSourceSpirits],
          '融合参与者': cloneJsonValue(normalizedFusionFields.fusionParticipants),
        } : {}),
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

    function buildSkillDesignerWriteUpdates(previewMeta = {}, nextSkill = {}, rootData = {}) {
      const path = Array.isArray(previewMeta && previewMeta.path) ? previewMeta.path : [];
      if (!path.length) return [];
      const updates = [{ path, value: nextSkill }];
      if (toText(previewMeta && previewMeta.scope, '') === 'fusion_skill' && toText(path[path.length - 1], '') === '技能数据') {
        const fusionRecordPath = path.slice(0, -1);
        const existingFusion = deepGet(rootData, fusionRecordPath, {});
        const fusionName = normalizeSkillUiText(nextSkill && (nextSkill['魂技名'] || nextSkill.name), toText(previewMeta && previewMeta.label, '未命名融合技'));
        const designDraft = nextSkill && nextSkill['设计稿'] && typeof nextSkill['设计稿'] === 'object' ? nextSkill['设计稿'] : {};
        const charKey = path[0] === 'char' ? toText(path[1], '') : '';
        const spiritOptions = getSkillDesignerSpiritNameOptions(charKey ? deepGet(rootData, ['char', charKey], {}) : {});
        const canUseSelfFusion = spiritOptions.length >= 2;
        let fusionMode = normalizeSkillDesignerFusionMode(designDraft['融合模式'] || nextSkill['融合模式'] || existingFusion.融合模式 || 'partner');
        if (fusionMode === 'self' && !canUseSelfFusion) fusionMode = 'partner';
        const rawParticipants = getSkillDesignerRawFusionParticipants(designDraft, nextSkill).length
          ? getSkillDesignerRawFusionParticipants(designDraft, nextSkill)
          : getSkillDesignerRawFusionParticipants({}, existingFusion);
        const fusionParticipants = normalizeSkillDesignerFusionParticipantList(rawParticipants, rootData);
        const fusionFields = deriveSkillDesignerFusionFields(
          fusionMode,
          fusionParticipants,
          normalizeSkillUiText(designDraft['融合对象'] || nextSkill['融合对象'] || existingFusion['融合对象'], '未知搭档'),
        );
        const partnerValue = fusionFields.fusionPartner;
        let sourceSpirits = fusionFields.fusionSourceSpirits.length
          ? fusionFields.fusionSourceSpirits
          : normalizeSkillDesignerArray(designDraft['来源武魂'] || nextSkill['来源武魂'] || existingFusion.来源武魂);
        if (fusionMode === 'self' && !sourceSpirits.length) sourceSpirits = spiritOptions.slice(0, 2);
        updates.push({ path: [...fusionRecordPath, '名称'], value: fusionName });
        updates.push({ path: [...fusionRecordPath, '融合模式'], value: fusionMode });
        updates.push({ path: [...fusionRecordPath, '融合对象'], value: partnerValue });
        updates.push({ path: [...fusionRecordPath, '来源武魂'], value: sourceSpirits });
        updates.push({ path: [...fusionRecordPath, '融合参与者'], value: cloneJsonValue(fusionFields.fusionParticipants) });
      }
      return updates;
    }

    function summarizeSkillEffectArray(effectArray, skill = null, cachedDraft = null) {
      const effectNames = (Array.isArray(effectArray) ? effectArray : [])
        .map(effect => {
          const name = toText(effect && effect['机制'], '').trim();
          if (!name || name === '系统基础' || isSkillSummaryEffect(effect)) return '';
          if (name === '生成造物' || name === '造物生成') return summarizeConstructEffectUi(effect);
          if (name === '分身') return summarizeCloneEffectUi(effect);
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
        const cost = normalizeSkillUiText(systemBase['消耗'] || (skill && skill['消耗']), '未知');
        const mainRole = normalizeSkillUiText((draft && draft.mainRole) || (skill && skill['主定位']), '未知');
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
          visualDesc: '体力封印解开后，成长已永久固化。',
          effectDesc,
          effectSummary: bonusSummary === '无' ? '未知' : `固定加成：${bonusSummary}`,
          status: normalizeSkillUiText(safeBonus['状态'], '已固化'),
          mainRole: '永久成长',
          tags: ['永久成长', '固定增益']
        };
      });
    }

    function buildSpiritConfig(slotName, spiritData, previewKey, badgeText, badgeClass, spiritBasePath = []) {
      const spiritPath = Array.isArray(spiritBasePath) ? spiritBasePath : [];
      const soulEntries = safeEntries(spiritData && spiritData.魂灵);
      const summaryRings = [];
      const souls = soulEntries.map(([soulName, soulData]) => {
        const soulPath = [...spiritPath, '魂灵', soulName];
        const ringEntries = safeEntries(soulData && soulData.魂环)
          .sort((a, b) => toNumber(a[0], 0) - toNumber(b[0], 0))
          .map(([ringIndex, ring]) => {
            const skills = buildSkillList(ring && ring['魂技'], {
              basePath: [...soulPath, '魂环', ringIndex, '魂技'],
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

        const spiritName = normalizeSkillUiText(soulData && soulData['表象名称'], '未设置');
        const description = normalizeSkillUiText(soulData && soulData['描述'], '未设置');
        const quality = normalizeSkillUiText(soulData && soulData['品质'], '未设置');
        const state = normalizeSkillUiText(soulData && soulData['状态'], '未知');
        const ageValue = toNumber(soulData && soulData['年限'], 0);
        const compValue = toNumber(soulData && soulData['契合度'], 100);
        return {
          name: soulName,
          desc: spiritName,
          spiritName,
          description,
          quality,
          state,
          age: formatAge(ageValue),
          ageValue,
          comp: `${compValue}%`,
          compValue,
          path: soulPath,
          魂环: ringEntries
        };
      });

      if (!souls.length) {
        souls.push({
          name: '魂灵槽位',
          desc: '尚未接入魂灵。',
          spiritName: '未设置',
          description: '尚未接入魂灵。',
          quality: '未设置',
          state: '未激活',
          age: '--',
          ageValue: 0,
          comp: '--',
          compValue: 0,
          path: [],
          魂环: []
        });
      }

      const soulCount = soulEntries.length;
      const displayName = normalizeSkillUiText(spiritData && spiritData['表象名称'], slotName);
      const spiritType = normalizeSkillUiText(spiritData && spiritData['type'], '未知系');
      const spiritDesc = normalizeSkillUiText(spiritData && spiritData['描述'], '未设置');
      const attributeState = resolveSpiritAttributeUiState(spiritData);

      return {
        preview: previewKey,
        badge: badgeText,
        badgeClass,
        name: `${displayName}（${spiritType}）`,
        desc: `属性体系：${attributeState.attributeSystem} / 魂灵：${soulCount}`,
        魂环: (summaryRings.length ? summaryRings : souls[0].魂环).slice(0, 10),
        souls,
        soulCount,
        slotName,
        spiritPath,
        spiritName: displayName,
        spiritDesc,
        spiritType,
        spiritElement: attributeState.attributeSystem,
        spiritUnlockedAttrs: attributeState.unlockedAttrs,
        spiritCapacityAttrs: attributeState.capacityAttrs
      };
    }

    function shouldRenderBloodline(activeChar, activeName = '') {
      const displayName = String(activeName || deepGet(activeChar, '属性.name', '') || '').trim();
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
          魂环: [],
          bloodSkills: [],
          bloodPassives: [],
          bloodPermanentBonuses: [],
          sealLv: 0,
          core: '未凝聚',
          lifeFire: false,
          bloodline: '无'
        };
      }
      const bloodline = normalizeSkillUiText(deepGet(activeChar, '血脉之力.血脉', '无'), '无');
      const sealLv = toNumber(deepGet(activeChar, '血脉之力.解封层数', 0), 0);
      const core = normalizeSkillUiText(deepGet(activeChar, '血脉之力.核心', '未凝聚'), '未凝聚');
      const rawSkills = deepGet(activeChar, '血脉之力.技能', {});
      const rawRings = deepGet(activeChar, '血脉之力.气血魂环', {});
      const rawPassives = deepGet(activeChar, '血脉之力.被动', {});
      const rawPermanentBonuses = deepGet(activeChar, '血脉之力.永久加成', {});
      const hasBloodlineData = toText(bloodline, '无') !== '无'
        || sealLv > 0
        || safeEntries(rawRings).length > 0
        || safeEntries(rawSkills).length > 0
        || safeEntries(rawPassives).length > 0
        || safeEntries(rawPermanentBonuses).length > 0;
      const ringEntries = safeEntries(deepGet(activeChar, '血脉之力.气血魂环', {}))
        .sort((a, b) => toNumber(a[0], 0) - toNumber(b[0], 0))
        .map(([index, ring]) => ({
          glyph: ringGlyph(ring && ring['颜色'], index, ring && ring['年限'], { forceGold: true }),
          ringClass: mapRingClass(ring && ring['颜色'], ring && ring['年限'], { forceGold: true }),
          title: `血脉环位 · ${index}`,
          desc: `${toText(ring && ring['颜色'], '未形成')} / ${safeEntries(ring && ring['魂技']).length || 0}项能力`,
          skills: buildSkillList(ring && ring['魂技'], {
            basePath: [...bloodlineBasePath, '气血魂环', index, '魂技'],
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
        desc: `解封层数：${sealLv} / 体力魂核：${core}`,
        魂环: normalizedRingEntries,
        bloodSkills: buildSkillList(rawSkills, {
          basePath: [...bloodlineBasePath, 'skills'],
          category: '血脉散技',
          scope: 'blood_skill',
        }),
        bloodPassives: buildSkillList(rawPassives, {
          basePath: [...bloodlineBasePath, '被动'],
          category: '血脉特性',
          scope: 'blood_passive',
        }),
        bloodPermanentBonuses: buildPermanentBonusList(rawPermanentBonuses),
        sealLv,
        core,
        lifeFire: !!deepGet(activeChar, '血脉之力.生命之火', false),
        bloodline: bloodline === '无' ? '未觉醒血脉' : bloodline
      };
    }

    function getPrimaryFactionEntry(snapshot) {
      const preferredName = toText(
        deepGet(snapshot, 'locationData.掌控势力', snapshot && snapshot.势力 && snapshot.势力[0] ? snapshot.势力[0][0] : ''),
        snapshot && snapshot.势力 && snapshot.势力[0] ? snapshot.势力[0][0] : ''
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

    function buildFactionRelationEditorGrid(orgName, orgData, options = {}) {
      const {
        max = 6,
        emptyTitle = '暂无势力关系',
        emptyDesc = '当前未记录对外关系。'
      } = options || {};
      const safeOrgName = toText(orgName, '').trim();
      const relationEntries = safeEntries(deepGet(orgData, '关系', {})).slice(0, Math.max(1, max));
      if (!relationEntries.length) {
        return `<div class="relation-card"><b>${htmlEscape(emptyTitle)}</b><span>${htmlEscape(emptyDesc)}</span></div>`;
      }
      return `
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:12px;">
          ${relationEntries.map(([relationName, relationData]) => {
            const safeRelData = relationData && typeof relationData === 'object' ? relationData : {};
            const relationMeta = buildFactionRelationMeta(relationName, safeRelData);
            const relationField = Object.prototype.hasOwnProperty.call(safeRelData, '态度')
              ? '态度'
              : (Object.prototype.hasOwnProperty.call(safeRelData, '关系') ? '关系' : '态度');
            const relationValue = toText(deepGet(safeRelData, relationField, relationMeta.attitude), relationMeta.attitude);
            const detailText = safeEntries(safeRelData)
              .filter(([key]) => !['态度', '关系'].includes(toText(key, '')))
              .map(([key, value]) => {
                if (value && typeof value === 'object') return `${toText(key, '关系项')} ${safeEntries(value).length}项`;
                const textValue = toText(value, '');
                return textValue ? `${toText(key, '关系项')} ${textValue}` : '';
              })
              .filter(Boolean)
              .join(' / ');
            const editableValue = safeOrgName
              ? makeInlineEditableValue(relationValue, {
                  path: ['org', safeOrgName, '关系', relationName, relationField],
                  kind: 'string',
                  rawValue: relationValue,
                })
              : htmlEscape(relationValue);
            return `
              <div class="archive-tile" style="min-height:96px;justify-content:flex-start;">
                <b>${htmlEscape(relationMeta.name)}</b>
                <span style="color:var(--cyan);font-size:16px;font-weight:700;line-height:1.35;">${editableValue}</span>
                ${detailText ? `<div style="margin-top:8px;font-size:12px;line-height:1.45;color:var(--color-text-secondary);">${htmlEscape(detailText)}</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    function buildFactionRelationSummary(orgData, max = 3) {
      return safeEntries(deepGet(orgData, '关系', {}))
        .slice(0, Math.max(1, max))
        .map(([name, relData]) => {
          const meta = buildFactionRelationMeta(name, relData);
          return `${meta.name}:${meta.attitude}`;
        })
        .join(' / ');
    }

    function getPrimaryFactionPowerStats(snapshot) {
      const preferredName = toText(
        deepGet(snapshot, 'locationData.掌控势力', snapshot && snapshot.势力 && snapshot.势力[0] ? snapshot.势力[0][0] : ''),
        snapshot && snapshot.势力 && snapshot.势力[0] ? snapshot.势力[0][0] : ''
      );
      const fallbackEntry = snapshot && Array.isArray(snapshot.orgEntries) && snapshot.orgEntries.length ? snapshot.orgEntries[0] : ['', {}];
      const matchedEntry = snapshot && Array.isArray(snapshot.orgEntries)
        ? (snapshot.orgEntries.find(([name]) => name === preferredName) || fallbackEntry)
        : fallbackEntry;
      const matchedName = toText(matchedEntry && matchedEntry[0], preferredName || '未知');
      const matchedData = matchedEntry && matchedEntry[1] ? matchedEntry[1] : {};
      return {
        name: matchedName,
        limit: toNumber(deepGet(matchedData, '战力统计.极限斗罗', 0), 0),
        super: toNumber(deepGet(matchedData, '战力统计.超级斗罗', 0), 0),
        title: toNumber(deepGet(matchedData, '战力统计.封号斗罗', 0), 0)
      };
    }

    function collectPendingRequests(activeChar, sd) {
      const result = [];
      const push = (text) => {
        if (text) result.push(text);
      };

      const quest = activeChar && activeChar.任务请求;
      if (quest && toText(quest.action, '无') !== '无') {
        push(`任务：${toText(quest.任务名称, '未命名任务')}`);
      }

      const tower = activeChar && activeChar.魂灵塔请求;
      if (tower && toText(tower.动作, '无') !== '无') {
        const clearedFloor = toNumber(tower.通关层数, 0);
        push(`魂灵塔：${toText(tower.动作, '冲塔')}${clearedFloor > 0 ? ` / 第${clearedFloor}层` : ''}`);
      }

      const ascension = activeChar && activeChar.升灵台请求;
      if (ascension && toText(ascension.门票名, '无') !== '无') {
        const gainAge = toNumber(ascension.提升年限, 0);
        const spiritKey = toText(ascension.武魂槽位, '未指定');
        const soulSpiritKey = toText(ascension.魂灵槽位, '未指定');
        push(`升灵台：${toText(ascension.门票名)} / ${spiritKey}-${soulSpiritKey}${gainAge > 0 ? ` / +${gainAge}年` : ''}`);
      }


      const hunt = activeChar && activeChar.猎魂请求;
      if (hunt && toNumber(hunt.击杀年限, 0) > 0) {
        push(`狩猎：${formatAge(hunt.击杀年限)}${deepGet(hunt, '是否凶兽', false) ? ' / 凶兽' : ''}`);
      }

      const promotion = activeChar && activeChar.晋升请求;
      if (promotion && toText(promotion.目标势力, '无') !== '无') {
        push(`晋升：${toText(promotion.目标势力)} / ${toText(promotion.目标职位, '')}`.trim());
      }

      const donate = activeChar && activeChar.捐献请求;
      if (donate && toText(donate.物品名称, '无') !== '无') {
        push(`捐献：${toText(donate.物品名称)} × ${toNumber(donate.数量, 1)}`);
      }

      const abyssKill = activeChar && activeChar.深渊击杀请求;
      if (abyssKill && toText(abyssKill.击杀级别, '无') !== '无') {
        push(`深渊：${toText(abyssKill.击杀级别)} × ${toNumber(abyssKill.数量, 1)}`);
      }

      const interact = activeChar && activeChar.互动请求;
      if (interact && toText(interact.动作, '无') !== '无') {
        push(`互动：${toText(interact.目标人物, '未知对象')} / ${toText(interact.动作, '互动')}`);
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
      const worldPlans = (snapshot.timelineEntries || []).filter(([, item]) => toText(deepGet(item, '状态', 'pending'), 'pending') !== 'done').slice(0, Math.max(1, worldLimit)).map(([name, item]) => ({
        title: `世界 / ${name}`,
        desc: `${toText(deepGet(item, '事件', '无'), '无')} ｜ Tick ${toText(deepGet(item, '触发tick', 0), '0')} ｜ ${toText(deepGet(item, '状态', 'pending'), 'pending')}`
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
      const rawRootData = sd && typeof sd === 'object' ? sd : {};
      const contextMeta = getCurrentChatContextMeta();
      const runtimeReady = true;
      sd = rawRootData;
      const [activeName, activeChar] = resolveActiveCharacter(sd || {});
      const currentLoc = toText(deepGet(activeChar, '状态.位置', '未知'), '未知').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '');
      const locationInfo = resolveLocationData(sd, currentLoc);
      const locationData = locationInfo.data || {};
      const storeNames = safeEntries(locationData && locationData.商店).map(([name]) => name);
      const dynamicLocationNames = safeEntries(deepGet(sd, 'world.动态地点', {})).map(([name]) => name);
      const timelineEntries = safeEntries(deepGet(sd, 'world.时间线', {})).sort((a, b) => toNumber(deepGet(b[1], '触发tick', 0), 0) - toNumber(deepGet(a[1], '触发tick', 0), 0));
      const seqEntries = safeEntries(deepGet(sd, 'sys.seq', {})).sort((a, b) => toNumber(b[0], 0) - toNumber(a[0], 0));
      const factions = safeEntries(deepGet(activeChar, '社交.势力', {}));
      const relations = safeEntries(deepGet(activeChar, '社交.关系', {})).sort((a, b) => toNumber(deepGet(b[1], '好感度', 0), 0) - toNumber(deepGet(a[1], '好感度', 0), 0));
      const unlockedKnowledges = Array.isArray(activeChar && activeChar.已掌握情报) ? activeChar.已掌握情报 : [];
      const inventoryEntries = safeEntries(activeChar && activeChar.背包);
      const flagEntries = safeEntries(deepGet(sd, 'world.标记', {})).filter(([, value]) => !!value);
      const orgEntries = safeEntries(sd && sd.org).sort((a, b) => {
        const aFav = factions.some(([name]) => name === a[0]) ? 1 : 0;
        const bFav = factions.some(([name]) => name === b[0]) ? 1 : 0;
        if (aFav !== bFav) return bFav - aFav;
        return toNumber(deepGet(b[1], '影响力', 0), 0) - toNumber(deepGet(a[1], '影响力', 0), 0);
      });

      const spiritEntries = safeEntries(activeChar && activeChar.武魂);
      const primarySpirit = spiritEntries[0]
        ? buildSpiritConfig(spiritEntries[0][0], spiritEntries[0][1], '第一武魂详细页', '第一武魂', 'cyan', ['char', activeName, '武魂', spiritEntries[0][0]])
        : buildSpiritConfig('第一武魂', {}, '第一武魂详细页', '第一武魂', 'cyan');
      const secondarySpirit = spiritEntries[1]
        ? buildSpiritConfig(spiritEntries[1][0], spiritEntries[1][1], '第二武魂详细页', '第二武魂', 'gold', ['char', activeName, '武魂', spiritEntries[1][0]])
        : null;
      const bloodline = buildBloodlineConfig(activeChar || {}, activeName, ['char', activeName, '血脉之力']);

      // --- 收集额外能力与功法，放到外层给生命图谱使用 ---
      const safeRecords = (obj) => {
        return Object.entries(obj || {}).filter(([k, v]) => k !== '无' && typeof v === 'object' && v !== null).map(([k, v]) => ({
          recordKey: k,
          name: k,
          ...v
        }));
      };
      const extraSkills = [];
      const artSkillNameSet = new Set(safeEntries(deepGet(activeChar, '功法', {})).map(([name]) => toText(name, '').trim()).filter(Boolean));
      safeRecords(deepGet(activeChar, '功法', {})).forEach(art => {
        extraSkills.push({
          category: '功法绝学',
          name: art.name,
          level: `Lv.${art.lv || 1} / ${toText(art.境界, '未入门')}`,
          desc: toText(art.描述, '暂无描述'),
          preview: ''
        });
      });
      if (bloodline.valid) {
        safeRecords(deepGet(activeChar, '血脉之力.技能', {})).forEach(skill => {
          extraSkills.push({
            category: '血脉散技',
            name: skill.name,
            level: toText(skill.状态, '已掌握'),
            desc: toText(skill.描述 || skill.效果描述 || skill.effectDesc, '无说明'),
            preview: buildSkillDesignerPreviewKey({
              path: ['char', activeName, '血脉之力', '技能', skill.recordKey || skill.name],
              label: toText(skill.name, skill.recordKey || '血脉散技'),
              category: '血脉散技',
              scope: 'blood_skill',
            })
          });
        });
        safeRecords(deepGet(activeChar, '血脉之力.被动', {})).forEach(skill => {
          extraSkills.push({
            category: '血脉特性',
            name: skill.name,
            level: toText(skill.状态, '已固化'),
            desc: toText(skill.描述 || skill.效果描述 || skill.effectDesc, '无说明'),
            preview: buildSkillDesignerPreviewKey({
              path: ['char', activeName, '血脉之力', '被动', skill.recordKey || skill.name],
              label: toText(skill.name, skill.recordKey || '血脉特性'),
              category: '血脉特性',
              scope: 'blood_passive',
            })
          });
        });
        safeEntries(deepGet(activeChar, '血脉之力.永久加成', {})).forEach(([name, bonus]) => {
          extraSkills.push({
            category: '血脉永久成长',
            name: toText(bonus && bonus['名称'], name || '永久成长'),
            level: toText(bonus && bonus['状态'], '已固化'),
            desc: toText(bonus && bonus['效果描述'], toText(bonus && bonus['描述'], '无说明'))
          });
        });
      }
      safeRecords(deepGet(activeChar, '武魂融合技', {})).forEach(fusion => {
        const fusionName = toText(fusion['名称'], fusion.name || fusion.recordKey || '武魂融合技');
        extraSkills.push({
          category: '武魂融合技',
          name: fusionName,
          level: `搭档: ${toText(fusion['融合对象'], '未知')}`,
          desc: toText(deepGet(fusion, '技能数据.描述', '无'), '爆发技'),
          preview: buildSkillDesignerPreviewKey({
            path: ['char', activeName, '武魂融合技', fusion.recordKey || fusionName, '技能数据'],
            label: toText(fusionName, fusion.recordKey || '武魂融合技'),
            category: '武魂融合技',
            scope: 'fusion_skill',
          })
        });
      });
      safeRecords(deepGet(activeChar, '特殊能力', {})).forEach(abi => {
        if (artSkillNameSet.has(toText(abi.recordKey || abi.name, '').trim())) return;
        extraSkills.push({
          category: '特殊能力',
          name: abi.name,
          level: toText(abi.技能类型 || abi.主定位, '被动'),
          desc: toText(abi.效果描述 || abi.战斗摘要?.一句话定位, '暂无描述'),
          preview: buildSkillDesignerPreviewKey({
            path: ['char', activeName, '特殊能力', abi.recordKey || abi.name],
            label: toText(abi.name, abi.recordKey || '特殊能力'),
            category: '特殊能力',
            scope: 'special_ability',
          })
        });
      });

      const nextNodeCandidates = [
        locationInfo.name,
        currentLoc,
        toText(deepGet(sd, 'world.拍卖.地点', ''), ''),
        ...storeNames,
        ...safeEntries(deepGet(sd, 'world.地点', {})).map(([name]) => name),
        ...dynamicLocationNames
      ].filter(Boolean);

      const mapNodeLabels = [];
      nextNodeCandidates.forEach(name => {
        if (!mapNodeLabels.includes(name)) mapNodeLabels.push(name);
      });

      const recentTitles = safeEntries(deepGet(activeChar, '社交.称号', {})).map(([name]) => name);
      const titleEntries = safeEntries(deepGet(activeChar, '社交.称号', {}));
      const recordEntries = safeEntries(deepGet(activeChar, '记录', {}));
      const conditionEntries = safeEntries(deepGet(activeChar, '属性.状态效果', {}));
      const soulBoneEntries = safeEntries(deepGet(activeChar, '魂骨', {}));
      const artEntries = safeEntries(deepGet(activeChar, '功法', {})).sort((a, b) => toNumber(deepGet(b[1], 'lv', 0), 0) - toNumber(deepGet(a[1], 'lv', 0), 0));
      const specialAbilityEntries = safeEntries(deepGet(activeChar, '特殊能力', {})).filter(([name]) => !artSkillNameSet.has(toText(name, '').trim()));
      const combatHistoryEntries = safeEntries(deepGet(activeChar, '战斗历史', {})).sort((a, b) => toNumber(deepGet(b[1], '最近tick', 0), 0) - toNumber(deepGet(a[1], '最近tick', 0), 0));
      const pendingRequests = collectPendingRequests(activeChar || {}, sd || {});
      const bestiaryEntries = safeEntries(deepGet(sd, 'world.图鉴', {}));
      const forestKilledAge = toNumber(deepGet(sd, 'world.累计击杀年限', 0), 0);
      const mapData = sd && sd.map && typeof sd.map === 'object' ? sd.map : {};
      const sheepSnapshot = window.__sheepMapSnapshot && typeof window.__sheepMapSnapshot === 'object'
        ? window.__sheepMapSnapshot
        : null;
      const normalizeMapEntries = source => {
        if (Array.isArray(source)) {
          return source
            .map(item => {
              if (Array.isArray(item) && item.length >= 2) {
                const key = toText(item[0], '').trim();
                const value = item[1] && typeof item[1] === 'object' ? item[1] : {};
                return key ? [key, value] : null;
              }
              if (item && typeof item === 'object') {
                const key = toText(item.name || item.loc || item.id, '').trim();
                return key ? [key, item] : null;
              }
              return null;
            })
            .filter(entry => entry && entry[0]);
        }
        if (source && typeof source === 'object') {
          return safeEntries(source);
        }
        return [];
      };
      const normalizeTravelCandidates = source => {
        if (!Array.isArray(source)) return [];
        return source
          .map(item => {
            if (typeof item === 'string') return item.trim();
            if (Array.isArray(item)) return toText(item[0], '').trim();
            if (item && typeof item === 'object') return toText(item.loc || item.name || item.target, '').trim();
            return '';
          })
          .filter(Boolean);
      };
      const mapVisibleNodeEntriesCore = normalizeMapEntries(deepGet(mapData, 'visible_nodes', {}));
      const mapVisibleNodeEntriesSheep = normalizeMapEntries(sheepSnapshot && sheepSnapshot.visibleNodes);
      const mapVisibleNodeEntries = mapVisibleNodeEntriesCore.length ? mapVisibleNodeEntriesCore : mapVisibleNodeEntriesSheep;
      const mapVisibleDynamicEntriesCore = normalizeMapEntries(deepGet(mapData, 'visible_dynamic_locations', {}));
      const mapVisibleDynamicEntriesSheep = normalizeMapEntries(
        sheepSnapshot && (sheepSnapshot.visibleDynamics || sheepSnapshot.visibleDynamicLocations)
      );
      const mapVisibleDynamicEntries = mapVisibleDynamicEntriesCore.length ? mapVisibleDynamicEntriesCore : mapVisibleDynamicEntriesSheep;
      const mapAvailableChildMapsCore = deepGet(mapData, 'available_child_maps', {}) || {};
      const mapAvailableChildMapsSheep = sheepSnapshot && sheepSnapshot.availableChildMaps && typeof sheepSnapshot.availableChildMaps === 'object'
        ? sheepSnapshot.availableChildMaps
        : {};
      const mapAvailableChildMaps = safeEntries(mapAvailableChildMapsCore).length ? mapAvailableChildMapsCore : mapAvailableChildMapsSheep;
      const mapTravelCandidatesCore = normalizeTravelCandidates(deepGet(mapData, 'travel_candidates', []));
      const mapTravelCandidatesSheep = normalizeTravelCandidates(sheepSnapshot && sheepSnapshot.travelCandidates);
      const mapTravelCandidates = mapTravelCandidatesCore.length ? mapTravelCandidatesCore : mapTravelCandidatesSheep;
      const mapCurrentFocusCore = deepGet(mapData, 'current_focus', {});
      const mapCurrentFocus = mapCurrentFocusCore && typeof mapCurrentFocusCore === 'object'
        ? mapCurrentFocusCore
        : ((sheepSnapshot && sheepSnapshot.currentFocus && typeof sheepSnapshot.currentFocus === 'object') ? sheepSnapshot.currentFocus : {});
      const mapCurrentMapId = toText(
        deepGet(mapData, 'current_map_id', sheepSnapshot && sheepSnapshot.currentMapId ? sheepSnapshot.currentMapId : 'map_douluo_world'),
        'map_douluo_world'
      );
      const mapZoomHint = toNumber(
        deepGet(mapData, 'current_zoom_hint', sheepSnapshot && Number.isFinite(Number(sheepSnapshot.currentZoomHint)) ? Number(sheepSnapshot.currentZoomHint) : 0),
        0
      );
      const pendingIntelContent = toText(deepGet(activeChar, '待解锁情报.内容', '无'), '无');
      const pendingIntelImpact = toNumber(deepGet(activeChar, '待解锁情报.影响', 0), 0);
      const pendingIntel = pendingIntelContent !== '无';
      const primaryFaction = factions[0] || null;
      const topRelation = relations[0] || null;
      const questRecordCount = recordEntries.filter(([, item]) => toText(item && item['状态'], '进行中') !== '已放弃').length;
      const warningText = toNumber(deepGet(sd, 'world.偏差值', 0), 0) >= 40
        ? `偏差 ${toNumber(deepGet(sd, 'world.偏差值', 0), 0)} / 高危`
        : (deepGet(sd, 'world.标记.beast_tide', false)
          ? '兽潮警报 / 已触发'
          : (flagEntries.length ? `世界旗标 ${flagEntries.length} 项` : '无'));
      const auctionStatus = toText(deepGet(sd, 'world.拍卖.状态', '休市'), '休市');
      const auctionLocation = toText(deepGet(sd, 'world.拍卖.地点', '无'), '无');

      const chars = sd && sd.char ? sd.char : {};
      const charEntries = safeEntries(chars);
      return {
        runtimeReady,
        rawRootData,
        rootData: sd,
        activeName: toText(activeName, contextMeta.name1 || contextMeta.name2 || '当前角色'),
        appearanceMeta: formatAppearanceMeta(deepGet(activeChar, '外貌', {})),
        appearanceText: formatAppearanceText(deepGet(activeChar, '外貌', {})),
        personalityText: toText(deepGet(activeChar, '性格', '未设定'), '未设定'),
        activeChar: activeChar || {},
        currentLoc,
        normalizedLoc: locationInfo.name,
        locationData,
        storeNames,
        dynamicLocationNames,
        timelineEntries,
        latestTimeline: timelineEntries[0] || null,
        seqEntries,
        势力: factions,
        relations,
        unlockedKnowledges,
        inventoryEntries,
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
        关系分析: deepGet(activeChar, '社交.关系分析', {}),

        questRecordCount,
        recentTitles,
        worldAlert: warningText,
        bestiaryEntries,
        forestKilledAge,
        auctionStatus,
        auctionLocation,
        mapData,
        mapCurrentMapId,
        mapZoomHint,
        mapCurrentFocus,
        mapVisibleNodeEntries,
        mapVisibleDynamicEntries,
        mapAvailableChildMaps,
        mapTravelCandidates,
        publicIntel: !!deepGet(activeChar, 'social.公开情报', deepGet(activeChar, 'social.public_intel', false)),
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
      lastHeaderRenderSignature = buildHeaderRenderSignature(liveSnapshot);
      const nextDashboardSectionRenderSignatures = buildDashboardSectionRenderSignatures(liveSnapshot);
      lastDashboardRenderSignature = buildDashboardRenderSignature(liveSnapshot, nextDashboardSectionRenderSignatures);
      lastDashboardSectionRenderSignatures = null;
      renderHeader(liveSnapshot);
      renderLiveCards(liveSnapshot, nextDashboardSectionRenderSignatures);
      syncPrivateArchiveLongPressTargets(liveSnapshot);

      if (activeBattleUI && typeof activeBattleUI.updateData === 'function') {
        activeBattleUI.updateData(liveSnapshot);
      }

      const activeDetailPreviewKey = currentUnifiedPreviewKey || currentModalPreviewKey;
      if ((detailModal.classList.contains('show') || isShellInlinePreviewActive() || isUnifiedInlinePreviewActive()) && activeDetailPreviewKey) {
        if (options.closeModal !== false) {
          if (isUnifiedInlinePreviewActive() && currentUnifiedPreviewKey) closeDetailSurface({ surface: 'unified' });
          else closeModal();
        } else {
          rerenderDetailSurface(activeDetailPreviewKey, { surface: currentUnifiedPreviewKey ? 'unified' : 'modal' });
        }
      }

      return true;
    }

    function buildRenderSignature(value) {
      try {
        return JSON.stringify(value);
      } catch (error) {
        return `${Date.now()}|${Math.random()}`;
      }
    }

    function buildHeaderRenderSignature(snapshot) {
      const status = deepGet(snapshot, 'activeChar.状态', {});
      const bloodline = snapshot && snapshot.bloodline && snapshot.bloodline.valid
        ? { bloodline: snapshot.bloodline.bloodline, sealLv: snapshot.bloodline.sealLv }
        : null;
      return buildRenderSignature({
        activeName: toText(snapshot && snapshot.activeName, ''),
        currentLoc: toText(snapshot && snapshot.currentLoc, ''),
        worldTimeText: toText(deepGet(snapshot, 'rootData.world.时间._calendar', deepGet(snapshot, 'rootData.world.时间.calendar', '')), ''),
        action: toText(status && status.行动, ''),
        activeDomain: toText(status && status.当前领域, ''),
        wound: getDisplayWoundLabel(deepGet(snapshot, 'activeChar.属性', {})),
        alive: deepGet(status, '存活', true) !== false,
        bloodline,
        armorStatus: toText(deepGet(snapshot, 'activeChar.装备.斗铠.装备状态', ''), ''),
        mechLv: toText(deepGet(snapshot, 'activeChar.装备.机甲.等级', ''), ''),
        worldAlert: toText(snapshot && snapshot.worldAlert, '')
      });
    }

    function buildDashboardSectionRenderSignatures(snapshot) {
      return {
        archive: buildRenderSignature({
          activeName: toText(snapshot && snapshot.activeName, ''),
          activeChar: deepGet(snapshot, 'activeChar', {}),
          bloodline: snapshot && snapshot.bloodline ? snapshot.bloodline : null,
          primarySpirit: snapshot && snapshot.primarySpirit ? snapshot.primarySpirit : null,
          secondaryTrack: snapshot && snapshot.secondaryTrack ? snapshot.secondaryTrack : null,
          soulBoneEntries: Array.isArray(snapshot && snapshot.soulBoneEntries) ? snapshot.soulBoneEntries : [],
          inventoryEntries: Array.isArray(snapshot && snapshot.inventoryEntries) ? snapshot.inventoryEntries : []
        }),
        map: buildRenderSignature({
          currentLoc: toText(snapshot && snapshot.currentLoc, ''),
          normalizedLoc: toText(snapshot && snapshot.normalizedLoc, ''),
          locationData: snapshot && snapshot.locationData ? snapshot.locationData : null,
          mapZoomHint: toNumber(snapshot && snapshot.mapZoomHint, 0),
          mapNodeLabels: Array.isArray(snapshot && snapshot.mapNodeLabels) ? snapshot.mapNodeLabels : [],
          mapVisibleNodeEntries: Array.isArray(snapshot && snapshot.mapVisibleNodeEntries) ? snapshot.mapVisibleNodeEntries : [],
          mapVisibleDynamicEntries: Array.isArray(snapshot && snapshot.mapVisibleDynamicEntries) ? snapshot.mapVisibleDynamicEntries : [],
          mapAvailableChildMaps: Array.isArray(snapshot && snapshot.mapAvailableChildMaps) ? snapshot.mapAvailableChildMaps : [],
          latestTimeline: snapshot && snapshot.latestTimeline ? snapshot.latestTimeline : null,
          timelineEntries: Array.isArray(snapshot && snapshot.timelineEntries) ? snapshot.timelineEntries : []
        }),
        social: buildRenderSignature({
          social: deepGet(snapshot, 'activeChar.社交', {}),
          primaryFaction: snapshot && snapshot.primaryFaction ? snapshot.primaryFaction : null,
          topRelation: snapshot && snapshot.topRelation ? snapshot.topRelation : null,
          relations: Array.isArray(snapshot && snapshot.relations) ? snapshot.relations : [],
          unlockedKnowledges: Array.isArray(snapshot && snapshot.unlockedKnowledges) ? snapshot.unlockedKnowledges : [],
          pendingIntelCount: toNumber(snapshot && snapshot.pendingIntelCount, 0),
          pendingIntelContent: toText(snapshot && snapshot.pendingIntelContent, ''),
          pendingIntelImpact: toText(snapshot && snapshot.pendingIntelImpact, '')
        }),
        world: buildRenderSignature({
          rootWorld: deepGet(snapshot, 'rootData.world', {}),
          worldAlert: toText(snapshot && snapshot.worldAlert, ''),
          factions: Array.isArray(snapshot && snapshot.势力) ? snapshot.势力 : [],
          locationData: snapshot && snapshot.locationData ? snapshot.locationData : null,
          latestTimeline: snapshot && snapshot.latestTimeline ? snapshot.latestTimeline : null
        }),
        terminal: buildRenderSignature({
          rootSys: deepGet(snapshot, 'rootData.sys', {}),
          rootWorld: deepGet(snapshot, 'rootData.world', {}),
          activeChar: deepGet(snapshot, 'activeChar', {}),
          worldAlert: toText(snapshot && snapshot.worldAlert, ''),
          pendingIntelCount: toNumber(snapshot && snapshot.pendingIntelCount, 0),
          pendingIntelContent: toText(snapshot && snapshot.pendingIntelContent, ''),
          pendingIntelImpact: toText(snapshot && snapshot.pendingIntelImpact, ''),
          inventoryEntries: Array.isArray(snapshot && snapshot.inventoryEntries) ? snapshot.inventoryEntries : [],
          bestiaryEntries: Array.isArray(snapshot && snapshot.bestiaryEntries) ? snapshot.bestiaryEntries : [],
          recordEntries: Array.isArray(snapshot && snapshot.recordEntries) ? snapshot.recordEntries : [],
          timelineEntries: Array.isArray(snapshot && snapshot.timelineEntries) ? snapshot.timelineEntries : [],
          unlockedKnowledges: Array.isArray(snapshot && snapshot.unlockedKnowledges) ? snapshot.unlockedKnowledges : []
        })
      };
    }

    function buildDashboardRenderSignature(snapshot, sectionSignatures = null) {
      const sections = sectionSignatures || buildDashboardSectionRenderSignatures(snapshot);
      return [
        sections.archive || '',
        sections.map || '',
        sections.social || '',
        sections.world || '',
        sections.terminal || ''
      ].join('|');
    }

    function getLiveUiElements(selector) {
      if (!(liveUiRefCache instanceof Map)) liveUiRefCache = new Map();
      const cached = liveUiRefCache.get(selector);
      if (Array.isArray(cached) && cached.length && cached.every(el => el && el.isConnected)) {
        return cached;
      }
      const elements = Array.from(document.querySelectorAll(selector));
      if (elements.length) liveUiRefCache.set(selector, elements);
      else liveUiRefCache.delete(selector);
      return elements;
    }

    function setLiveNodeText(node, value) {
      if (!node) return;
      const nextValue = value == null ? '' : String(value);
      if (node.textContent === nextValue) return;
      node.textContent = nextValue;
    }

    function setLiveNodeHtml(node, value) {
      if (!node) return;
      const nextValue = value == null ? '' : String(value);
      if (node.innerHTML === nextValue) return;
      node.innerHTML = nextValue;
    }

    function setLiveText(selector, value) {
      getLiveUiElements(selector).forEach(node => setLiveNodeText(node, value));
    }

    function setLiveHtml(selector, value) {
      getLiveUiElements(selector).forEach(node => setLiveNodeHtml(node, value));
    }

    function renderHeader(snapshot) {
      const worldTimeText = toText(deepGet(snapshot, 'rootData.world.时间._calendar', deepGet(snapshot, 'rootData.world.时间.calendar', '斗罗历未同步')), '斗罗历未同步');
      const headerComboHtml = `<span style="opacity:1;font-size:12px;color:#fff;">${worldTimeText}</span><span style="opacity:0.65;font-size:11px;">${snapshot.currentLoc}</span>`;
      setLiveHtml('.header-loc span', headerComboHtml);
      setLiveText('.char-name', snapshot.activeName);
      setLiveHtml('.archive-split-loc span', headerComboHtml);
      setLiveText('.archive-split-name-text', snapshot.activeName);
      syncPrivateArchiveLongPressTargets(snapshot);
      if (splitBottomTime) splitBottomTime.textContent = '';
      if (splitBottomLoc) splitBottomLoc.textContent = '';

      const statusChips = getLiveUiElements('.header-status-row .header-status-chip');
      if (statusChips[0]) setLiveNodeText(statusChips[0].querySelector('span'), `${toText(deepGet(snapshot, 'activeChar.状态.行动', '日常'), '日常')} / ${toText(deepGet(snapshot, 'activeChar.状态.当前领域', '无'), '无')}`);
      if (statusChips[1]) {
        const activeStatus = deepGet(snapshot, 'activeChar.状态', {});
        const injurySummary = buildInjurySummaryText(activeStatus, { limit: 1, empty: '' });
        setLiveNodeText(
          statusChips[1].querySelector('span'),
          `${getDisplayWoundLabel(deepGet(snapshot, 'activeChar.属性', {}))} / ${injurySummary || (deepGet(snapshot, 'activeChar.状态.存活', true) ? '状态稳定' : '已陨落')}`,
        );
      }
      if (statusChips[2]) {
        const shouldShowBloodline = !!(snapshot.bloodline && snapshot.bloodline.valid);
        if (statusChips[2].style.display !== (shouldShowBloodline ? '' : 'none')) {
          statusChips[2].style.display = shouldShowBloodline ? '' : 'none';
        }
        if (snapshot.bloodline && snapshot.bloodline.valid) {
          setLiveNodeText(statusChips[2].querySelector('span'), `${snapshot.bloodline.bloodline} / ${snapshot.bloodline.sealLv}层`);
        }
      }
      if (statusChips[3]) setLiveNodeText(statusChips[3].querySelector('span'), `斗铠${toText(deepGet(snapshot, 'activeChar.装备.斗铠.装备状态', '未装备'), '未装备')} / 机甲${toText(deepGet(snapshot, 'activeChar.装备.机甲.等级', '无'), '无')}`);
      if (statusChips[4]) setLiveNodeText(statusChips[4].querySelector('span'), snapshot.worldAlert);
    }

    const PRIVATE_ARCHIVE_PREVIEW_KEY = '私密档案详细页';

    function isFemaleGenderText(value) {
      const normalized = String(value == null ? '' : value).trim().toLowerCase();
      if (!normalized) return false;
      if (normalized.includes('女')) return true;
      return normalized === 'female'
        || normalized === 'woman'
        || normalized === 'girl'
        || normalized === 'f';
    }

    function getActiveSnapshotCharacter(snapshot) {
      const activeChar = deepGet(snapshot, 'activeChar', null);
      if (activeChar && typeof activeChar === 'object') return activeChar;
      const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot && snapshot.activeName, ''));
      return activeCharKey ? deepGet(snapshot, ['rootData', 'char', activeCharKey], {}) : {};
    }

    function getPrivateArchiveAgeValue(value) {
      if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
      const rawText = String(value == null ? '' : value).trim();
      if (!rawText) return NaN;
      const directNumber = Number(rawText);
      if (Number.isFinite(directNumber)) return directNumber;
      const numericText = rawText.match(/-?\d+(?:\.\d+)?/);
      return numericText ? Number(numericText[0]) : NaN;
    }

    function canOpenPrivateArchive(snapshot) {
      const activeChar = getActiveSnapshotCharacter(snapshot);
      const genderText = toText(deepGet(activeChar, '属性.性别', ''), '');
      if (!isFemaleGenderText(genderText)) return false;
      const ageValue = getPrivateArchiveAgeValue(deepGet(activeChar, '属性.年龄', null));
      return Number.isFinite(ageValue) && ageValue >= 6;
    }

    function getActiveNsfwPath(snapshot) {
      const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot && snapshot.activeName, ''));
      return activeCharKey ? ['char', activeCharKey, '私密档案'] : [];
    }

    function getActiveNsfwData(snapshot) {
      const activeNsfw = deepGet(snapshot, 'activeChar.私密档案', null);
      if (activeNsfw && typeof activeNsfw === 'object' && safeEntries(activeNsfw).length) return activeNsfw;
      const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot && snapshot.activeName, ''));
      const rootNsfw = activeCharKey ? deepGet(snapshot, ['rootData', 'char', activeCharKey, '私密档案'], null) : null;
      if (rootNsfw && typeof rootNsfw === 'object') return rootNsfw;
      return activeNsfw && typeof activeNsfw === 'object' ? activeNsfw : {};
    }

    function setPrivateArchiveLongPressTarget(node, enabled, options = {}) {
      if (!node) return;
      const useVisualClass = options.visualClass !== false;
      node.classList.toggle('nsfw-trigger-title', !!(enabled && useVisualClass));
      node.classList.remove('active-press');
      if (enabled) {
        node.setAttribute('data-longpress', PRIVATE_ARCHIVE_PREVIEW_KEY);
        node.setAttribute('data-longpress-delay', '600');
      } else {
        node.removeAttribute('data-longpress');
        node.removeAttribute('data-longpress-delay');
      }
    }

    function syncPrivateArchiveLongPressTargets(snapshot) {
      const enabled = canOpenPrivateArchive(snapshot);
      getLiveUiElements('.char-name, .archive-split-name-text').forEach(node => {
        setPrivateArchiveLongPressTarget(node, enabled);
      });
      getLiveUiElements('#mvu-unified-mount .mvu-unified-section-title').forEach(node => {
        if (toText(node.textContent, '').trim() === '详细档案') {
          setPrivateArchiveLongPressTarget(node, enabled);
        }
      });
      getLiveUiElements('#mvu-unified-mount [data-unified-card="archive-core"][data-unified-surface="shell"]').forEach(node => {
        setPrivateArchiveLongPressTarget(node, enabled, { visualClass: false });
      });
    }

    function buildArchiveCoreCard(snapshot) {
      const stat = deepGet(snapshot, 'activeChar.属性', {});
      const social = deepGet(snapshot, 'activeChar.社交', {});
      const status = deepGet(snapshot, 'activeChar.状态', {});
      const hpPair = getDisplayHpPair(stat);
      const woundLabel = getDisplayWoundLabel(stat);
      const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '当前角色');
      const nextLevelSoul = getNextLevelSoulRequirement(stat);
      const allowNsfwLongPress = canOpenPrivateArchive(snapshot);
      const mentalRealmText = toText(stat._men_realm, toText(stat.精神力_realm, '灵元境'));
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
          <div class="panel-title${allowNsfwLongPress ? ' nsfw-trigger-title' : ''}"${allowNsfwLongPress ? ` data-longpress="${PRIVATE_ARCHIVE_PREVIEW_KEY}" data-longpress-delay="600"` : ''}>详细档案</div>
          <span class="meta-pill">${htmlEscape(nextLevelSoul.isMax ? '下级魂力 已满级' : `下级魂力 ${formatNumber(nextLevelSoul.needed)}`)}</span>
        </div>
        <div class="stats-grid stats-grid-top">
          <div class="stat-item compact no-bar">
            <div class="stat-label">年龄 / 性别</div>
            <div class="stat-value">${htmlEscape(`${toText(stat.年龄, '0')}岁 / ${toText(stat.性别, '未知')}`)}</div>
          </div>
          <div class="stat-item compact no-bar">
            <div class="stat-label">修为等级</div>
            <div class="stat-value cyan">${htmlEscape(formatCultivationLevelBadge(stat.等级, '0'))}</div>
          </div>
          <div class="stat-item compact no-bar">
            <div class="stat-label">状态概览</div>
            <div class="stat-value">${htmlEscape(`${toText(status.行动, '日常')} / ${woundLabel}`)}</div>
          </div>
        </div>
        <div class="stats-grid stats-grid-pairs">
          <div class="stat-item resource-stat">
            <div class="stat-label">魂力</div>
            <div class="stat-value cyan">${htmlEscape(formatNumber(stat.魂力))}/${htmlEscape(formatNumber(stat.魂力上限))}</div>
            <div class="line"><div class="fill" style="color: var(--cyan); width: ${ratioPercent(stat.魂力, stat.魂力上限)}%;"></div></div>
          </div>
          <div class="stat-item resource-stat">
            <div class="stat-label">精神力 · ${htmlEscape(mentalRealmText)}</div>
            <div class="stat-value">${htmlEscape(formatNumber(stat.精神力))}/${htmlEscape(formatNumber(stat.精神力上限))}</div>
            <div class="line"><div class="fill" style="color: var(--white); width: ${ratioPercent(stat.精神力, stat.精神力上限)}%;"></div></div>
          </div>
          <div class="stat-item resource-stat">
            <div class="stat-label">生命</div>
            <div class="stat-value red">${htmlEscape(formatNumber(hpPair.hp))}/${htmlEscape(formatNumber(hpPair.hpMax))}</div>
            <div class="line"><div class="fill" style="color: var(--red); width: ${ratioPercent(hpPair.hp, hpPair.hpMax)}%;"></div></div>
          </div>
          <div class="stat-item resource-stat">
            <div class="stat-label">体力</div>
            <div class="stat-value red">${htmlEscape(formatNumber(stat.体力))}/${htmlEscape(formatNumber(stat.体力上限))}</div>
            <div class="line"><div class="fill" style="color: var(--red); width: ${ratioPercent(stat.体力, stat.体力上限)}%;"></div></div>
          </div>
        </div>
        `;
    }

    function buildArmoryCard(snapshot) {
      const armor = deepGet(snapshot, 'activeChar.装备.斗铠', {});
      const mech = deepGet(snapshot, 'activeChar.装备.机甲', {});
      const weapon = deepGet(snapshot, 'activeChar.装备.武器', {});
      const accessoryEntries = listAccessoryEntries(deepGet(snapshot, 'activeChar.装备.饰品', {}));
      const jobs = safeEntries(deepGet(snapshot, 'activeChar.职业', {}));
      const jobSummary = jobs.length ? `${jobs[0][0]} Lv.${toText(deepGet(jobs[0][1], 'lv', 0), '0')}` : '未展开';
      const jobCoreTechSummary = jobs.length ? (Object.keys(deepGet(jobs[0][1], '核心技艺', {})).slice(0, 2).join(' / ') || '暂无核心技术') : '暂无核心技术';
      const jobLimitSummary = jobs.length ? `融锻上限 ${toText(deepGet(jobs[0][1], '限制.最大融合数', 1), '1')} / 成功率 ${toText(deepGet(jobs[0][1], '限制.成功率', 0), '0')}%` : '暂无工坊上限';
      const armorSummary = toNumber(armor.等级, 0) > 0 ? `${toText(armor.名称, `${armor.等级}字斗铠`)} / ${toText(armor.装备状态, '未装备')}` : '未装备';
      const mechSummary = toText(mech.等级, '无') !== '无' ? `${toText(mech.等级, '无')}·${toText(mech.型号, '未定型')} / ${toText(mech.装备状态, '未装备')}` : '无';
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
      const wealth = deepGet(snapshot, 'activeChar.财富', {});
      const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '当前角色');
      return `
        <div class="module-name">储物仓库</div>
        <div class="module-grid">
          <div class="mini-box"><b>物品种类</b><span>${htmlEscape(String(snapshot.inventoryEntries.length || 0))}</span></div>
          <div class="mini-box"><b>流动资金</b><span>${htmlEscape(formatNumber(wealth.联邦币))} / 星罗 ${htmlEscape(formatNumber(wealth.星罗币))}</span></div>
        </div>
        <div class="module-foot">
          <span class="foot-hint">记录物资总计 ${htmlEscape(String(snapshot.inventoryEntries.length || 0))} 件</span>
          <span class="enter-chip gold-chip">积分/战功：${htmlEscape(formatNumber(wealth.唐门积分))} / ${htmlEscape(formatNumber(wealth.学院积分))} / ${htmlEscape(formatNumber(wealth.战功))}</span>
        </div>
      `;
    }

    function buildUnifiedSocialCard(snapshot) {
      const social = deepGet(snapshot, 'activeChar.社交', {});
      const primaryFactionName = snapshot.primaryFaction ? snapshot.primaryFaction[0] : '无';
      const primaryFactionRole = snapshot.primaryFaction ? toText(deepGet(snapshot.primaryFaction[1], '身份', '无'), '无') : '未加入';
      const topRelationText = snapshot.topRelation
        ? `${shortenText(snapshot.topRelation[0], 8)} / ${toText(deepGet(snapshot.topRelation[1], '关系', '陌生'), '陌生')} / ${toNumber(deepGet(snapshot.topRelation[1], '好感度', 0), 0)}`
        : `${snapshot.relations.length} 条`;
      const latestIntelText = snapshot.pendingIntelCount
        ? `${shortenText(snapshot.pendingIntelContent, 10)} / +${snapshot.pendingIntelImpact}`
        : (snapshot.unlockedKnowledges.length ? shortenText(snapshot.unlockedKnowledges[snapshot.unlockedKnowledges.length - 1], 12) : '暂无');
      return `
        <div class="mvu-unified-card-head">
          <div class="mvu-unified-card-title">社交摘要</div>
          <span class="mvu-unified-card-pill">${htmlEscape(toText(social.名望等级, toText(social.名望等级, '籍籍无名')))}</span>
        </div>
        <div class="mvu-unified-row-list">
          <div class="mvu-unified-row"><b>名望</b><span>${htmlEscape(`${toText(social.名望等级, toText(social.名望等级, '籍籍无名'))} / ${formatNumber(social.声望)}`)}</span></div>
          <div class="mvu-unified-row"><b>所属势力</b><span>${htmlEscape(`${shortenText(primaryFactionName, 8)} / ${shortenText(primaryFactionRole, 8)}`)}</span></div>
          <div class="mvu-unified-row"><b>关系摘要</b><span>${htmlEscape(topRelationText)}</span></div>
          <div class="mvu-unified-row"><b>已解锁情报</b><span>${htmlEscape(`${snapshot.unlockedKnowledges.length} / ${latestIntelText}`)}</span></div>
        </div>
      `;
    }

    function buildUnifiedSpiritCard(config, options = {}) {
      const primary = !!(options && options.primary);
      if (!config) {
        return `
          <div class="mvu-unified-card-head">
            <div class="mvu-unified-card-title">${primary ? '主武魂' : '第二武魂'}</div>
          </div>
          <div class="mvu-unified-empty-note">${primary ? '当前未加载武魂信息。' : '当前未启用第二武魂或血脉。'}</div>
        `;
      }
      const content = config.kind === 'bloodline'
        ? renderArchiveBloodlineEntry(config)
        : renderArchiveSpiritEntry(config, primary);
      return `<div class="mvu-unified-spirit-card">${content}</div>`;
    }

    function normalizeUnifiedSurfaceKey(surface) {
      const value = toText(surface, '').trim().toLowerCase();
      if (value === 'shell') return 'shell';
      if (value === 'panel') return 'panel';
      return '';
    }

    function collectShellBadgeItems(items = [], max = 4) {
      const result = [];
      (Array.isArray(items) ? items : []).forEach(item => {
        if (result.length >= max) return;
        const entry = item && typeof item === 'object'
          ? { text: toText(item.text, '').trim(), tone: toText(item.tone, '').trim() }
          : { text: toText(item, '').trim(), tone: '' };
        if (!entry.text) return;
        if (result.some(candidate => candidate.text === entry.text)) return;
        result.push(entry);
      });
      return result;
    }

    function collectShellMetricItems(items = [], max = 4) {
      return (Array.isArray(items) ? items : [])
        .map(item => ({
          label: toText(item && item.label, '').trim(),
          value: toText(item && item.value, '').trim(),
          tone: toText(item && item.tone, '').trim(),
        }))
        .filter(item => item.label && item.value)
        .slice(0, max);
    }

    function collectShellLineItems(items = [], max = 3) {
      return (Array.isArray(items) ? items : [])
        .map(item => ({
          label: toText(item && item.label, '').trim(),
          value: toText(item && item.value, '').trim(),
        }))
        .filter(item => item.label && item.value)
        .slice(0, max);
    }

    function formatShellPair(current, max) {
      return `${formatNumber(current)} / ${formatNumber(max)}`;
    }

    function buildShellSummaryCard(options = {}) {
      const kicker = toText(options.kicker, '').trim();
      const title = toText(options.title, '空').trim() || '空';
      const value = toText(options.value, '').trim();
      const meta = toText(options.meta, '').trim();
      const rawNote = toText(options.note, '').trim();
      const tone = toText(options.tone, '').trim();
      const requestedSize = toText(options.size, '').trim();
      const size = requestedSize || 'compact';
      const longPressPreview = toText(options.longPressPreview, '').trim();
      const longPressDelay = Math.max(250, toNumber(options.longPressDelay, 600));
      const badgeLimit = options.badgeLimit != null
        ? Math.max(0, toNumber(options.badgeLimit, size === 'hero' ? 2 : 1))
        : (size === 'hero' ? 2 : 1);
      const metricLimit = options.metricLimit != null
        ? Math.max(0, toNumber(options.metricLimit, size === 'hero' ? 3 : 1))
        : (size === 'hero' ? 3 : 1);
      const rowLimit = options.rowLimit != null
        ? Math.max(0, toNumber(options.rowLimit, size === 'hero' ? 2 : 1))
        : (size === 'hero' ? 2 : 1);
      const badges = collectShellBadgeItems(options.badges || [], badgeLimit);
      const metrics = collectShellMetricItems(options.metrics || [], metricLimit);
      const rows = collectShellLineItems(options.rows || [], rowLimit);
      const note = size === 'hero' || !rows.length ? rawNote : '';
      const className = [
        'mvu-shell-summary',
        tone ? `mvu-shell-summary--${tone}` : '',
        size ? `mvu-shell-summary--${size}` : '',
        value ? 'has-value' : '',
        longPressPreview ? 'nsfw-trigger-title' : '',
      ].filter(Boolean).join(' ');
      const longPressAttrs = longPressPreview
        ? ` data-longpress="${escapeHtmlAttr(longPressPreview)}" data-longpress-delay="${escapeHtmlAttr(String(longPressDelay))}"`
        : '';

      return `
        <div class="${className}"${longPressAttrs}>
          <div class="mvu-shell-card-top">
            <div class="mvu-shell-card-copy">
              <div class="mvu-shell-title">${htmlEscape(title)}</div>
              ${meta ? `<div class="mvu-shell-meta">${htmlEscape(meta)}</div>` : ''}
            </div>
            ${value ? `<div class="mvu-shell-value">${htmlEscape(value)}</div>` : ''}
          </div>
          ${badges.length ? `
            <div class="mvu-shell-chip-row">
              ${badges.map(item => `<span class="mvu-shell-chip${item.tone ? ` is-${htmlEscape(item.tone)}` : ''}">${htmlEscape(item.text)}</span>`).join('')}
            </div>
          ` : ''}
          ${metrics.length ? `
            <div class="mvu-shell-metric-grid">
              ${metrics.map(item => `
                <div class="mvu-shell-metric${item.tone ? ` is-${htmlEscape(item.tone)}` : ''}">
                  <span class="mvu-shell-metric-label">${htmlEscape(item.label)}</span>
                  <strong class="mvu-shell-metric-value">${htmlEscape(item.value)}</strong>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${rows.length ? `
            <div class="mvu-shell-line-list">
              ${rows.map(item => `
                <div class="mvu-shell-line">
                  <span class="mvu-shell-line-label">${htmlEscape(item.label)}</span>
                  <span class="mvu-shell-line-value">${htmlEscape(item.value)}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${note ? `<div class="mvu-shell-card-note">${htmlEscape(note)}</div>` : ''}
        </div>
      `;
    }

    function buildShellEmptyCard(title, note, options = {}) {
      return buildShellSummaryCard({
        kicker: options.kicker || '',
        title,
        value: note || '空',
        tone: options.tone || 'muted',
      });
    }

    function buildShellAppPeek(options = {}) {
      const value = toText(options.value, '暂无信息').trim() || '暂无信息';
      const meta = toText(options.meta, '').trim();
      const note = toText(options.note, '').trim();
      const tone = toText(options.tone, '').trim();
      return `
        <div class="mvu-shell-app-peek${tone ? ` is-${htmlEscape(tone)}` : ''}">
          <div class="mvu-shell-app-peek-value">${htmlEscape(value)}</div>
          ${meta ? `<div class="mvu-shell-app-peek-meta">${htmlEscape(meta)}</div>` : ''}
          ${note ? `<div class="mvu-shell-app-peek-note">${htmlEscape(note)}</div>` : ''}
        </div>
      `;
    }

    function isShellPlaceholderText(value) {
      const text = toText(value, '').trim();
      if (!text) return true;
      const normalized = text.replace(/\s+/g, '');
      return /^(无|暂无|暂无记录|暂无收录|暂无待办|暂无委托|暂无待读|暂无时间线|暂无事件|暂无播报|暂无新线索|暂无警报|暂无变化|暂无见闻|待命中|未同步|时间未同步|未设置|未记录|未收录|--)$/.test(normalized);
    }

    function resolveShellText(value, fallback = '') {
      const text = toText(value, '').trim();
      if (!isShellPlaceholderText(text)) return text;
      const fallbackText = toText(fallback, '').trim();
      return isShellPlaceholderText(fallbackText) ? '' : fallbackText;
    }

    function normalizeUserFacingTrackLabel(value, fallback = '') {
      const text = toText(value, fallback).trim() || toText(fallback, '').trim();
      if (!text) return '';
      return text
        .replace(/血脉副轨/g, '血脉')
        .replace(/武魂副轨/g, '第二武魂')
        .replace(/副轨/g, '第二武魂');
    }

    function summarizeShellIdentityText(value, options = {}) {
      const limit = Math.max(4, toNumber(options.limit, 12));
      const preferFirst = options.preferFirst !== false;
      const rawText = resolveShellText(value, '').trim();
      if (!rawText) return '';
      const cleaned = rawText
        .replace(/（[^）]*）/g, '')
        .replace(/\([^)]*\)/g, '')
        .replace(/[；;，,。].*$/, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (!cleaned) return '';
      const pieces = cleaned
        .split(/[｜|/／、]/)
        .map(item => toText(item, '').trim())
        .filter(Boolean);
      const resolved = preferFirst && pieces.length ? pieces[0] : cleaned;
      return shortenText(resolved || cleaned, limit);
    }

    function isRenderableShellRing(ring) {
      if (!ring || typeof ring !== 'object') return false;
      const title = resolveShellText(ring.title, '');
      const desc = resolveShellText(ring.desc, '');
      const skills = Array.isArray(ring.skills) ? ring.skills.filter(skill => resolveShellText(skill && skill.name, '')).length : 0;
      return !!title || !!desc || skills > 0;
    }

    function isRenderableShellSoul(soul) {
      if (!soul || typeof soul !== 'object') return false;
      const spiritName = resolveShellText(soul.spiritName || soul.desc || soul.name, '');
      const description = resolveShellText(soul.description, '');
      const state = toText(soul.state, '').trim();
      const ringCount = Array.isArray(soul.魂环) ? soul.魂环.filter(isRenderableShellRing).length : 0;
      if (ringCount > 0) return true;
      if (spiritName && !/^(未设置|魂灵槽位)$/.test(spiritName)) return true;
      if (description && !/^(尚未接入魂灵。|未设置)$/.test(description)) return true;
      return !!state && !/^(未知|未激活|未设置)$/.test(state);
    }

    function buildShellSpiritSummaryCard(config, options = {}) {
      const primary = !!(options && options.primary);
      if (!config) {
        return buildShellEmptyCard(primary ? '主武魂' : normalizeUserFacingTrackLabel('', '第二武魂'), primary ? '未接入' : '未启用');
      }

      if (config.kind === 'bloodline') {
        return buildShellSummaryCard({
          kicker: '血脉',
          title: shortenText(toText(config.bloodline, '未觉醒'), 20),
          value: `封印 ${toText(config.sealLv, '0')} 层`,
          meta: `核心 ${shortenText(toText(config.core, '未凝核'), 16)}`,
          badges: [
            config.lifeFire ? { text: '命火已燃', tone: 'gold' } : { text: '命火未燃' },
            ...((config.魂环 || []).slice(0, 2).map(item => shortenText(toText(item && item.title, ''), 16))),
          ],
          metrics: [
            { label: '血环', value: String((config.魂环 || []).length || 0), tone: 'gold' },
            { label: '技能', value: String((config.bloodSkills || []).length || 0) },
            { label: '特性', value: String((config.bloodPassives || []).length || 0) },
            { label: '成长', value: String((config.bloodPermanentBonuses || []).length || 0) },
          ],
          rows: [
            { label: '状态', value: config.lifeFire ? '已点燃' : '等待命火' },
            { label: '概览', value: shortenText(toText(config.desc, '未记录'), 28) },
          ],
          tone: 'gold',
        });
      }

      const renderableSouls = Array.isArray(config.souls) ? config.souls.filter(isRenderableShellSoul) : [];
      const primarySoul = renderableSouls[0] || null;
      const unlockedAttrs = Array.isArray(config.spiritUnlockedAttrs) ? config.spiritUnlockedAttrs : [];
      const soulCount = renderableSouls.length || Math.max(0, toNumber(config.soulCount, 0));
      const ringCount = Array.isArray(config.魂环) ? config.魂环.filter(isRenderableShellRing).length : 0;
      const hasSpiritProgress = !!primarySoul || soulCount > 0 || ringCount > 0;
      if (!hasSpiritProgress) {
        return buildShellSummaryCard({
          kicker: primary ? '主武魂' : normalizeUserFacingTrackLabel(config.badge, '第二武魂'),
          title: shortenText(toText(config.spiritName || config.name, primary ? '主武魂' : '第二武魂'), 20),
          value: '待接魂环',
          meta: shortenText(toText(config.spiritType, '未定'), 18),
          rows: [
            { label: '状态', value: '未接魂环' },
          ],
          tone: primary ? 'live' : 'cyan',
        });
      }
      const renderableRings = (config.魂环 || []).filter(isRenderableShellRing);
      return buildShellSummaryCard({
        kicker: primary ? '主武魂' : normalizeUserFacingTrackLabel(config.badge, '第二武魂'),
        title: shortenText(toText(config.spiritName || config.name, primary ? '主武魂' : normalizeUserFacingTrackLabel(config.badge, '第二武魂')), 20),
        value: `${soulCount} 枚魂灵`,
        meta: `${shortenText(toText(config.spiritType, '未定'), 12)} · ${shortenText(toText(config.spiritElement, '未定'), 12)}`,
        badges: [
          primarySoul ? shortenText(toText(primarySoul.spiritName || primarySoul.desc, ''), 16) : '',
          ...renderableRings.slice(0, 2).map(item => shortenText(toText(item && item.title, ''), 16)),
          ...unlockedAttrs.slice(0, 1).map(item => shortenText(toText(item, ''), 14)),
        ],
        metrics: [
          { label: '契合', value: primarySoul ? toText(primarySoul.comp, '--') : '--', tone: 'live' },
          { label: '年限', value: primarySoul ? shortenText(toText(primarySoul.age, '--'), 12) : '--' },
          { label: '魂环', value: String(ringCount || 0) },
          { label: '上限', value: String((Array.isArray(config.spiritCapacityAttrs) ? config.spiritCapacityAttrs.length : 0) || 0) },
        ],
        rows: [
          { label: '主魂灵', value: primarySoul ? shortenText(toText(primarySoul.spiritName || primarySoul.desc, '未接入'), 24) : '未接入' },
          { label: '状态', value: primarySoul ? toText(primarySoul.state, '未知') : '等待唤醒' },
        ],
        tone: primary ? 'live' : 'cyan',
      });
    }

    function buildShellHomeArchiveCard(snapshot) {
      if (!snapshot) {
        return buildShellAppPeek({
          value: toText(snapshot && snapshot.activeName, '当前聊天'),
          meta: '待同步',
          note: '当前聊天',
          tone: 'gold',
        });
      }
      const stat = deepGet(snapshot, 'activeChar.属性', {});
      const status = deepGet(snapshot, 'activeChar.状态', {});
      const placeText = buildShellLocationLabel(snapshot, { fullLimit: 18, trailLimit: 8 });
      return buildShellAppPeek({
        value: toText(snapshot.activeName, '当前角色'),
        meta: `${formatCultivationLevelBadge(stat.等级, '0')} · ${placeText}`,
        note: toText(status.行动, '日常'),
        tone: 'live',
      });
    }

    function buildShellLocationLabel(snapshot, options = {}) {
      const normalizedLoc = toText(snapshot && snapshot.normalizedLoc, '').trim();
      const currentLoc = toText(snapshot && snapshot.currentLoc, '').trim();
      const fullLimit = Math.max(8, toNumber(options.fullLimit, 18));
      const trailLimit = Math.max(6, toNumber(options.trailLimit, 8));
      if (!normalizedLoc && !currentLoc) return '未知地点';
      if (
        !normalizedLoc
        || normalizedLoc === currentLoc
        || currentLoc.startsWith(`${normalizedLoc}-`)
        || currentLoc.startsWith(`${normalizedLoc}·`)
      ) {
        return shortenText(currentLoc || normalizedLoc, fullLimit);
      }
      return `${shortenText(normalizedLoc, trailLimit)} · ${shortenText(currentLoc || normalizedLoc, trailLimit)}`;
    }

    function buildShellHomeMapCard(snapshot) {
      if (!snapshot) {
        return buildShellAppPeek({
          value: '地图待同步',
          meta: '待同步',
          note: '当前聊天',
        });
      }
      const routeCount = snapshot.mapTravelCandidates.length || snapshot.mapNodeLabels.length || 0;
      return buildShellAppPeek({
        value: shortenText(toText(snapshot.normalizedLoc || snapshot.currentLoc, '未命名节点'), 14),
        meta: `${routeCount} 个入口 · ${snapshot.mapVisibleDynamicEntries.length || 0} 处动态`,
        note: shortenText(getMapDisplayName(snapshot), 18),
        tone: 'live',
      });
    }

    function buildShellHomeWorldCard(snapshot) {
      if (!snapshot) {
        return buildShellAppPeek({
          value: '世界待同步',
          meta: '待同步',
          note: '当前聊天',
        });
      }
      const rawWorldTime = toText(deepGet(snapshot, 'rootData.world.时间._calendar', deepGet(snapshot, 'rootData.world.时间.calendar', '时间未同步')), '时间未同步');
      const worldTime = resolveShellText(rawWorldTime, '等待同步');
      const deviation = toNumber(deepGet(snapshot, 'rootData.world.偏差值', 0), 0);
      const deviationState = deviation >= 40 ? '高危' : (deviation >= 10 ? '波动' : '平稳');
      const worldAlertText = resolveShellText(snapshot.worldAlert, '');
      const timelineHeadline = snapshot.latestTimeline ? snapshot.latestTimeline[0] : '';
      const timelineNote = snapshot.latestTimeline
        ? toText(deepGet(snapshot.latestTimeline[1], '事件', snapshot.latestTimeline[0]), snapshot.latestTimeline[0])
        : '';
      const headline = worldAlertText
        || timelineHeadline
        || (rawWorldTime !== '时间未同步' ? '世界时钟' : '世界平稳');
      return buildShellAppPeek({
        value: shortenText(toText(headline, '世界平稳'), 14),
        meta: shortenText(worldTime || '等待同步', 18),
        note: shortenText(worldAlertText || timelineNote || `偏差 ${deviationState}`, 18),
        tone: worldAlertText ? (deviation >= 40 ? 'warn' : 'gold') : (deviation >= 10 ? 'gold' : 'live'),
      });
    }

    function buildShellHomeOrgCard(snapshot) {
      if (!snapshot) {
        return buildShellAppPeek({
          value: '势力待同步',
          meta: '待同步',
          note: '当前聊天',
          tone: 'gold',
        });
      }
      const primaryFactionEntry = getPrimaryFactionEntry(snapshot);
      const primaryFaction = snapshot.势力[0] || null;
      const factionName = primaryFaction ? primaryFaction[0] : primaryFactionEntry.name || toText(deepGet(snapshot, 'locationData.掌控势力', '未加入'), '未加入');
      const roleText = primaryFaction
        ? toText(deepGet(primaryFaction[1], '身份', '未加入'), '未加入')
        : toText(deepGet(primaryFactionEntry.data, '身份', '未加入'), '未加入');
      return buildShellAppPeek({
        value: shortenText(toText(factionName, '未加入'), 14),
        meta: `身份 ${shortenText(roleText, 10)}`,
        note: `${(snapshot.orgEntries || []).length || 0} 个势力焦点`,
        tone: 'gold',
      });
    }

    function buildShellHomeTerminalCard(snapshot) {
      if (!snapshot) {
        return buildShellAppPeek({
          value: '终端待同步',
          meta: '待同步',
          note: '当前聊天',
        });
      }
      const latestRequest = resolveShellText((snapshot.pendingRequests || [])[0], resolveShellText(deepGet(snapshot, 'rootData.sys.rsn', ''), '待命中'));
      return buildShellAppPeek({
        value: snapshot.pendingIntelCount ? `${snapshot.pendingIntelCount} 条情报` : (snapshot.questRecordCount ? `${snapshot.questRecordCount} 项任务` : '系统在线'),
        meta: `${snapshot.questRecordCount || 0} 项任务 · ${(snapshot.bestiaryEntries || []).length || 0} 条图鉴`,
        note: shortenText(latestRequest || '待命中', 18),
        tone: snapshot.pendingIntelCount ? 'warn' : (snapshot.questRecordCount ? 'gold' : 'live'),
      });
    }

    function buildShellArchiveCoreCard(snapshot) {
      if (!snapshot) {
        return buildShellSummaryCard({
          kicker: '角色首页',
          title: toText(snapshot && snapshot.activeName, '当前聊天'),
          value: '待同步',
          meta: '当前聊天',
          metrics: [
            { label: '状态', value: '待同步' },
            { label: '地点', value: '--' },
            { label: '阵营', value: '--' },
            { label: '关系', value: '--' },
          ],
          rows: [
            { label: '页面', value: '档案' },
            { label: '数据', value: '未接入' },
          ],
          tone: 'hero',
          size: 'hero',
        });
      }
      const stat = deepGet(snapshot, 'activeChar.属性', {});
      const social = deepGet(snapshot, 'activeChar.社交', {});
      const status = deepGet(snapshot, 'activeChar.状态', {});
      const primaryFactionName = snapshot.primaryFaction ? snapshot.primaryFaction[0] : '未加入';
      const primaryFactionRole = snapshot.primaryFaction ? toText(deepGet(snapshot.primaryFaction[1], '身份', '未加入'), '未加入') : '未加入';
      const titleText = Array.isArray(snapshot.recentTitles) && snapshot.recentTitles.length ? snapshot.recentTitles[0] : '';
      const nextLevelSoul = getNextLevelSoulRequirement(stat);
      const placeText = buildShellLocationLabel(snapshot, { fullLimit: 18, trailLimit: 8 });
      const hasSoulPowerMeter = toNumber(stat.魂力上限, 0) > 0;
      const hasVitalityMeter = toNumber(stat.体力上限, 0) > 0;
      const hasMentalMeter = toNumber(stat.精神力上限, 0) > 0;
      const ageMetric = toNumber(stat.年龄, 0);
      const talentMetric = shortenText(toText(stat.talent_tier, '未定'), 8);
      const typeMetric = shortenText(toText(stat.系别, '未定'), 8);
      const factionJoined = primaryFactionName !== '未加入';
      const nextLevelNeeded = Math.max(0, toNumber(nextLevelSoul && nextLevelSoul.needed, 0));
      const hpPair = getDisplayHpPair(stat);
      const woundText = getDisplayWoundLabel(stat);
      const injurySummary = buildInjurySummaryText(status, { limit: 2, empty: '无' });
      const statusSummary = !woundText || /^(无)$/i.test(woundText)
        ? toText(status.行动, '日常')
        : `${toText(status.行动, '日常')} / ${woundText}`;
      const identitySummary = summarizeShellIdentityText(social.主身份, { limit: 12 }) || shortenText(toText(social.主身份, ''), 14);
      const factionSummary = factionJoined
        ? `${shortenText(primaryFactionName, 8)} / ${shortenText(primaryFactionRole, 8)}`
        : (identitySummary || '独行');
      const fameLevelText = shortenText(toText(social.名望等级, toText(social.名望等级, '籍籍无名')), 8);
      const allowPrivateArchiveLongPress = canOpenPrivateArchive(snapshot);
      return buildShellSummaryCard({
        kicker: '角色首页',
        title: toText(snapshot.activeName, '当前角色'),
        value: formatCultivationLevelBadge(stat.等级, '0'),
        meta: placeText,
        badges: [
          titleText ? { text: shortenText(titleText, 10), tone: 'gold' } : '',
          factionJoined ? { text: shortenText(primaryFactionName, 10), tone: 'live' } : '',
          fameLevelText && fameLevelText !== '籍籍无名' ? { text: fameLevelText, tone: 'gold' } : '',
        ],
        metrics: [
          hpPair.hpMax > 0 ? { label: 'HP', value: formatShellPair(hpPair.hp, hpPair.hpMax), tone: 'warn' } : { label: '年龄', value: ageMetric > 0 ? String(ageMetric) : '--' },
          hasVitalityMeter ? { label: '体力', value: formatShellPair(stat.体力, stat.体力上限), tone: 'gold' } : { label: '天赋', value: talentMetric || '--', tone: 'gold' },
          hasSoulPowerMeter ? { label: '魂力', value: formatShellPair(stat.魂力, stat.魂力上限), tone: 'live' } : { label: '系别', value: typeMetric || '--', tone: 'live' },
          hasMentalMeter ? { label: '精神', value: formatShellPair(stat.精神力, stat.精神力上限) } : { label: '年龄', value: ageMetric > 0 ? String(ageMetric) : '--' },
        ],
        rows: [
          { label: '状态', value: statusSummary || '--' },
          { label: factionJoined ? '阵营' : '身份', value: factionSummary },
          { label: '名望', value: social.声望 ? `${fameLevelText} · ${formatNumber(social.声望)}` : fameLevelText },
          { label: '伤处', value: injurySummary },
        ],
        tone: 'hero',
        size: 'hero',
        metricLimit: 4,
        rowLimit: 3,
        longPressPreview: allowPrivateArchiveLongPress ? PRIVATE_ARCHIVE_PREVIEW_KEY : '',
        longPressDelay: 600,
      });
    }

    function buildShellArmoryCard(snapshot) {
      if (!snapshot) {
        return buildShellSummaryCard({
          kicker: '武装',
          title: '装配摘要',
          value: '待同步',
          meta: '当前聊天',
          rows: [
            { label: '斗铠', value: '--' },
            { label: '机甲', value: '--' },
            { label: '主武器', value: '--' },
          ],
        });
      }
      const armor = deepGet(snapshot, 'activeChar.装备.斗铠', {});
      const mech = deepGet(snapshot, 'activeChar.装备.机甲', {});
      const weapon = deepGet(snapshot, 'activeChar.装备.武器', {});
      const accessoryEntries = listAccessoryEntries(deepGet(snapshot, 'activeChar.装备.饰品', {}));
      const jobs = safeEntries(deepGet(snapshot, 'activeChar.职业', {}));
      const jobSummary = jobs.length ? `${jobs[0][0]} Lv.${toText(deepGet(jobs[0][1], 'lv', 0), '0')}` : '未开启';
      const weaponName = toText(weapon.名称, '').trim();
      const hasArmor = toNumber(armor.等级, 0) > 0;
      const hasWeapon = !!weaponName && !/^(无|未记录)$/.test(weaponName);
      const hasMech = !!toText(mech.等级, '').trim();
      const hasLoadout = hasArmor || hasWeapon || hasMech || accessoryEntries.length || (snapshot.soulBoneEntries || []).length;
      const armorSummary = toNumber(armor.等级, 0) > 0
        ? `${toText(armor.名称, `${armor.等级}字斗铠`)} / ${toText(armor.装备状态, '已装配')}`
        : '未装配';
      const mechSummary = toText(mech.等级, '') ? `${toText(mech.等级, '')} · ${toText(mech.型号, '未定型')}` : '未挂载';
      if (!hasLoadout) {
        return buildShellSummaryCard({
          title: jobs.length ? '工坊' : '武装',
          value: jobs.length ? shortenText(jobSummary, 16) : '0',
          meta: jobs.length ? '副职已记录' : '无装备',
          rows: [
            { label: jobs.length ? '副职' : '斗铠', value: jobs.length ? shortenText(jobSummary, 16) : '无' },
          ],
        });
      }
      return buildShellSummaryCard({
        kicker: '武装',
        title: '武装',
        value: toNumber(armor.等级, 0) > 0 ? shortenText(toText(armor.名称, `${armor.等级}字斗铠`), 12) : '未装配',
        meta: shortenText(armorSummary, 24),
        metrics: [
          { label: '机甲', value: toText(mech.等级, '--') || '--' },
          { label: '魂骨', value: String((snapshot.soulBoneEntries || []).length || 0), tone: 'gold' },
          { label: '挂载', value: String(accessoryEntries.length || 0) },
        ],
        rows: [
          { label: '主武器', value: shortenText(toText(weapon.名称, '未记录'), 14) },
          { label: '工坊', value: shortenText(jobSummary, 14) },
          { label: '机甲', value: shortenText(mechSummary, 14) },
        ],
      });
    }

    function buildShellVaultCard(snapshot) {
      if (!snapshot) {
        return buildShellSummaryCard({
          kicker: '仓库',
          title: '资源概览',
          value: '待同步',
          meta: '当前聊天',
          rows: [
            { label: '联邦', value: '--' },
            { label: '星罗', value: '--' },
          ],
        });
      }
      const wealth = deepGet(snapshot, 'activeChar.财富', {});
      const inventoryCount = (snapshot.inventoryEntries || []).length || 0;
      const fedCoin = toNumber(wealth.联邦币, 0);
      const starCoin = toNumber(wealth.星罗币, 0);
      const tangPt = toNumber(wealth.唐门积分, 0);
      const bloodPt = toNumber(wealth.战功, 0);
      const hasStoredResources = inventoryCount > 0 || fedCoin > 0 || starCoin > 0 || tangPt > 0 || bloodPt > 0;
      if (!hasStoredResources) {
        return buildShellSummaryCard({
          title: '仓库',
          value: '0',
          meta: '无物资',
          rows: [
            { label: '货币', value: '0' },
          ],
        });
      }
      return buildShellSummaryCard({
        kicker: '仓库',
        title: '仓库',
        value: `${formatNumber(inventoryCount)} 物资`,
        meta: `流动资金 ${formatNumber(fedCoin)} / 星罗 ${formatNumber(starCoin)}`,
        metrics: [
          { label: '联邦', value: formatNumber(fedCoin), tone: 'live' },
          { label: '星罗', value: formatNumber(starCoin) },
          { label: '积分', value: formatNumber(tangPt), tone: 'gold' },
        ],
        rows: [
          { label: '血神', value: formatNumber(bloodPt) },
          { label: '物资', value: `${formatNumber(inventoryCount)} 种` },
        ],
      });
    }

    function buildShellSocialCard(snapshot) {
      if (!snapshot) {
        return buildShellSummaryCard({
          kicker: '社交',
          title: '社交',
          value: '待同步',
          meta: '当前聊天',
          rows: [
            { label: '关系', value: '--' },
            { label: '名望', value: '--' },
            { label: '阵营', value: '--' },
          ],
        });
      }
      const social = deepGet(snapshot, 'activeChar.社交', {});
      const primaryFactionName = snapshot.primaryFaction ? snapshot.primaryFaction[0] : '未加入';
      const primaryFactionRole = snapshot.primaryFaction ? toText(deepGet(snapshot.primaryFaction[1], '身份', '未加入'), '未加入') : '未加入';
      const topRelationText = snapshot.topRelation
        ? `${shortenText(snapshot.topRelation[0], 8)} / ${toText(deepGet(snapshot.topRelation[1], '关系', '陌生'), '陌生')}`
        : '暂无高亮关系';
      const latestIntelText = snapshot.pendingIntelCount
        ? `${shortenText(snapshot.pendingIntelContent, 10)} / +${snapshot.pendingIntelImpact}`
        : ((snapshot.unlockedKnowledges || []).length ? shortenText(snapshot.unlockedKnowledges[(snapshot.unlockedKnowledges || []).length - 1], 12) : '暂无');
      const currentTitle = Array.isArray(snapshot.recentTitles) && snapshot.recentTitles.length ? snapshot.recentTitles[0] : '';
      const fameLevel = shortenText(toText(social.名望等级, toText(social.名望等级, '籍籍无名')), 12);
      const reputationText = formatNumber(social.声望);
      const mainIdentity = summarizeShellIdentityText(social.主身份, { limit: 12 }) || shortenText(toText(social.主身份, ''), 14);
      const factionSummary = primaryFactionName === '未加入'
        ? (mainIdentity || '未结盟')
        : `${shortenText(primaryFactionName, 8)} / ${shortenText(primaryFactionRole, 8)}`;
      return buildShellSummaryCard({
        kicker: '社交',
        title: '社交',
        value: fameLevel,
        meta: mainIdentity || `名望 ${reputationText}`,
        badges: [
          currentTitle ? { text: shortenText(currentTitle, 10), tone: 'gold' } : '',
          snapshot.publicIntel ? { text: '公开情报', tone: 'live' } : '',
          snapshot.pendingIntelCount ? `新线索 ${snapshot.pendingIntelCount}` : '',
        ],
        metrics: [
          { label: '关系', value: String((snapshot.relations || []).length || 0), tone: 'live' },
          { label: '势力', value: String((snapshot.势力 || []).length || 0) },
        ],
        rows: [
          { label: primaryFactionName === '未加入' ? '身份' : '所属', value: factionSummary },
          { label: snapshot.topRelation ? '关系' : '动态', value: snapshot.topRelation ? topRelationText : latestIntelText },
        ],
      });
    }

    function buildShellMapHeroCard(snapshot) {
      if (!snapshot) {
        return buildShellSummaryCard({
          kicker: '星图',
          title: '地图待同步',
          value: '待同步',
          meta: '当前聊天',
          rows: [
            { label: '节点', value: '--' },
            { label: '动态', value: '--' },
          ],
        });
      }
      const childMapCount = safeEntries(snapshot.mapAvailableChildMaps).length;
      const currentMapDisplayName = getMapDisplayName(snapshot);
      const focusText = toText(deepGet(snapshot, 'mapCurrentFocus.loc', snapshot.currentLoc), snapshot.currentLoc);
      return buildShellSummaryCard({
        kicker: '星图',
        title: shortenText(toText(snapshot.currentLoc, '未命名节点'), 24),
        value: shortenText(currentMapDisplayName, 16),
        meta: `焦点 ${shortenText(focusText, 24)}`,
        badges: [
          `${snapshot.mapTravelCandidates.length || snapshot.mapNodeLabels.length || 0} 个入口`,
          childMapCount ? { text: `${childMapCount} 个子图`, tone: 'gold' } : '',
          snapshot.mapVisibleDynamicEntries.length ? { text: `${snapshot.mapVisibleDynamicEntries.length} 处动态`, tone: 'live' } : '',
        ],
        metrics: [
          { label: '可见', value: String(snapshot.mapVisibleNodeEntries.length || snapshot.mapNodeLabels.length || 0), tone: 'live' },
          { label: '动态', value: String(snapshot.mapVisibleDynamicEntries.length || 0) },
          { label: '子图', value: String(childMapCount || 0), tone: 'gold' },
        ],
        note: snapshot.latestTimeline
          ? shortenText(toText(deepGet(snapshot.latestTimeline[1], '事件', snapshot.latestTimeline[0]), snapshot.latestTimeline[0]), 36)
          : '',
        tone: 'hero',
        size: 'hero',
      });
    }

    function buildShellMapStageCard() {
      return '';
    }

    function getShellLocalCharacterEntries(snapshot, limit = 6) {
      if (!snapshot) return [];
      const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
      const activeDisplayName = toText(deepGet(snapshot, 'activeChar.name', deepGet(snapshot, 'activeChar.base.name', snapshot.activeName)), snapshot.activeName);
      const currentLoc = toText(deepGet(snapshot, 'activeChar.状态.位置', snapshot.currentLoc), snapshot.currentLoc);
      const normalizedLoc = toText(snapshot.normalizedLoc, currentLoc);
      return safeEntries(deepGet(snapshot, 'rootData.char', {}))
        .filter(([name, char]) => {
          const displayName = toText(deepGet(char, 'name', deepGet(char, 'base.name', name)), name);
          if ((activeCharKey && name === activeCharKey) || (activeDisplayName && displayName === activeDisplayName)) return false;
          const npcLoc = toText(deepGet(char, '状态.位置', ''), '');
          if (!npcLoc) return false;
          return isLocationCompatible(currentLoc, npcLoc) || isLocationCompatible(normalizedLoc, npcLoc);
        })
        .slice(0, Math.max(1, toNumber(limit, 6)));
    }

    function buildShellMapCurrentCard(snapshot) {
      const currentMapDisplayName = getMapDisplayName(snapshot);
      const localFaction = toText(deepGet(snapshot, 'locationData.掌控势力', '未知'), '未知');
      const nodeStores = safeEntries(deepGet(snapshot, 'locationData.商店', {}));
      return buildShellSummaryCard({
        kicker: '地点',
        title: shortenText(toText(snapshot.normalizedLoc, snapshot.currentLoc), 22),
        value: shortenText(currentMapDisplayName, 16),
        meta: snapshot.normalizedLoc !== snapshot.currentLoc ? shortenText(snapshot.currentLoc, 22) : '',
        rows: [
          { label: '掌控', value: shortenText(localFaction, 22) },
          { label: '店铺', value: nodeStores.length ? `${nodeStores.length} 处` : '0' },
        ],
      });
    }

    function buildShellLocalRosterRows(localEntries, limit = 4) {
      const entries = (Array.isArray(localEntries) ? localEntries : []).slice(0, Math.max(1, toNumber(limit, 4)));
      if (!entries.length) {
        return '<div class="mvu-shell-roster-empty">暂无本地角色</div>';
      }
      return entries.map(([name, char]) => {
        const displayName = toText(deepGet(char, 'name', deepGet(char, 'base.name', name)), name);
        const identity = summarizeShellIdentityText(deepGet(char, '社交.主身份', ''), { limit: 14 })
          || shortenText(toText(deepGet(char, '社交.主身份', '未知身份'), '未知身份'), 14);
        const action = resolveShellText(deepGet(char, '状态.行动', ''), '日常') || '日常';
        return `
          <div class="mvu-shell-roster-row">
            <div class="mvu-shell-roster-name">${htmlEscape(shortenText(displayName, 12))}</div>
            <div class="mvu-shell-roster-meta">${htmlEscape(shortenText(identity, 18))}</div>
            <div class="mvu-shell-roster-state">${htmlEscape(shortenText(action, 16))}</div>
          </div>
        `;
      }).join('');
    }

    function buildShellMapLocalCharactersCard(snapshot) {
      const localEntries = getShellLocalCharacterEntries(snapshot, 4);
      const currentLoc = toText(deepGet(snapshot, 'activeChar.状态.位置', snapshot.currentLoc), snapshot.currentLoc);
      return `
        <div class="mvu-shell-roster-card">
          <div class="mvu-shell-roster-head">
            <div>
              <span>本地角色</span>
              <strong>${htmlEscape(shortenText(currentLoc, 22))}</strong>
            </div>
            <b>${htmlEscape(localEntries.length ? `${localEntries.length} 名` : '0')}</b>
          </div>
          <div class="mvu-shell-roster-list">
            ${buildShellLocalRosterRows(localEntries, 4)}
          </div>
        </div>
      `;
    }

    function buildShellMapRouteCard(snapshot) {
      const routeCount = snapshot.mapTravelCandidates.length || snapshot.mapNodeLabels.length || 0;
      return buildShellSummaryCard({
        kicker: '跑图',
        title: '路线',
        value: `${routeCount} 条`,
        meta: `${shortenText(getMapDisplayName(snapshot), 18)} · ${safeEntries(snapshot.mapAvailableChildMaps).length} 个子图`,
        rows: [
          { label: '当前地图', value: shortenText(getMapDisplayName(snapshot), 22) },
          { label: '子图', value: safeEntries(snapshot.mapAvailableChildMaps).length ? `${safeEntries(snapshot.mapAvailableChildMaps).length} 个入口` : '暂无子图' },
          { label: '入口', value: routeCount ? `${routeCount} 条可用路线` : '暂无路线' },
        ],
      });
    }

    function buildShellMapDynamicCard(snapshot) {
      if (!snapshot || (!snapshot.mapVisibleDynamicEntries.length && !snapshot.latestTimeline)) {
        return buildShellSummaryCard({
          title: '动态',
          value: '0',
          meta: '无地图动态',
          rows: [],
        });
      }
      return buildShellSummaryCard({
        kicker: '动态',
        title: '动态',
        value: `${snapshot.mapVisibleDynamicEntries.length || 0} 处`,
        meta: snapshot.latestTimeline ? shortenText(snapshot.latestTimeline[0], 20) : '等待新变化',
        rows: [
          { label: '地图信息', value: snapshot.latestTimeline ? shortenText(toText(deepGet(snapshot.latestTimeline[1], '事件', snapshot.latestTimeline[0]), snapshot.latestTimeline[0]), 28) : '暂无新变化' },
        ],
      });
    }

    function buildShellWorldHeroCard(snapshot) {
      if (!snapshot) {
        return buildShellSummaryCard({
          kicker: '世界',
          title: '时空中枢',
          value: '待同步',
          meta: '当前聊天',
          metrics: [
            { label: '偏差', value: '--' },
            { label: '安排', value: '--' },
            { label: '见闻', value: '--' },
            { label: '森怨', value: '--' },
          ],
          note: '等待同步',
          tone: 'hero',
          size: 'hero',
        });
      }
      const rawWorldTime = toText(deepGet(snapshot, 'rootData.world.时间._calendar', deepGet(snapshot, 'rootData.world.时间.calendar', '时间未同步')), '时间未同步');
      const worldTime = resolveShellText(rawWorldTime, '等待同步');
      const deviation = toNumber(deepGet(snapshot, 'rootData.world.偏差值', 0), 0);
      const deviationState = deviation >= 40 ? '高危' : (deviation >= 10 ? '波动' : '平稳');
      const forestRatio = Math.max(0, Math.min(100, Number(((toNumber(snapshot.forestKilledAge, 0) / 1000000) * 100).toFixed(1))));
      const recentPlans = buildRecentPlanSummary(snapshot, { worldLimit: 2, recordLimit: 2 });
      const recentNews = buildRecentNewsSummary(snapshot, { seqLimit: 2, intelLimit: 2 });
      const worldAlertText = resolveShellText(snapshot.worldAlert, '');
      const timelineEventText = snapshot.latestTimeline
        ? toText(deepGet(snapshot.latestTimeline[1], '事件', snapshot.latestTimeline[0]), snapshot.latestTimeline[0])
        : '';
      return buildShellSummaryCard({
        kicker: '世界',
        title: '世界',
        value: deviationState,
        meta: shortenText(worldTime || '等待同步', 24),
        badges: [
          snapshot.latestTimeline ? shortenText(snapshot.latestTimeline[0], 10) : '',
          worldAlertText ? { text: shortenText(worldAlertText, 10), tone: deviation >= 40 ? 'warn' : 'live' } : '',
        ],
        metrics: [
          { label: '偏差', value: String(deviation), tone: deviation >= 40 ? 'warn' : (deviation >= 10 ? 'gold' : 'live') },
          { label: '安排', value: String((recentPlans.cards || []).length || 0) },
          { label: '见闻', value: String((recentNews.cards || []).length || 0) },
          { label: '森怨', value: `${forestRatio}%`, tone: forestRatio >= 70 ? 'warn' : (forestRatio >= 30 ? 'gold' : 'live') },
        ],
        note: shortenText(worldAlertText || timelineEventText || '等待新世界事件', 34),
        tone: 'hero',
        size: 'hero',
      });
    }

    function buildShellWorldTimelineCard(snapshot) {
      const latestTimeline = snapshot.latestTimeline;
      if (!latestTimeline) {
        return buildShellSummaryCard({
          title: '时间线',
          value: '0',
          meta: '无编年记录',
        });
      }
      const timelineStatus = latestTimeline
        ? `${toText(deepGet(latestTimeline[1], '状态', 'pending'), 'pending')} / Tick ${toText(deepGet(latestTimeline[1], '触发tick', 0), '0')}`
        : '等待下一条时间线';
      const latestTimelineText = latestTimeline
        ? toText(deepGet(latestTimeline[1], '事件', latestTimeline[0]), latestTimeline[0])
        : '';
      return buildShellSummaryCard({
        kicker: '编年',
        title: '时间线',
        value: latestTimeline ? shortenText(latestTimeline[0], 12) : '待更新',
        meta: shortenText(latestTimelineText || '等待下一条时间线', 22),
        rows: [
          { label: '状态', value: shortenText(timelineStatus, 18) },
        ],
      });
    }

    function buildShellWorldAlertCard(snapshot) {
      const worldAlertText = resolveShellText(snapshot.worldAlert, '');
      const auctionStatus = resolveShellText(snapshot.auctionStatus, '休市');
      const auctionLocation = resolveShellText(snapshot.auctionLocation, '');
      const hasAuctionActivity = auctionStatus !== '休市' || !!auctionLocation;
      if (!worldAlertText && !hasAuctionActivity) {
        return buildShellSummaryCard({
          title: '警报',
          value: '0',
          meta: '无警报',
        });
      }
      return buildShellSummaryCard({
        kicker: '警报',
        title: '警报',
        value: worldAlertText ? shortenText(worldAlertText, 12) : (hasAuctionActivity ? shortenText(auctionStatus, 12) : '待观察'),
        meta: auctionLocation ? shortenText(auctionLocation, 18) : '拍卖 / 生态',
        rows: [
          hasAuctionActivity ? { label: '拍卖', value: auctionLocation ? `${auctionStatus} / ${shortenText(auctionLocation, 10)}` : auctionStatus } : null,
          worldAlertText ? { label: '生态', value: shortenText(worldAlertText, 16) } : null,
        ],
        tone: worldAlertText && /高危|警报/i.test(worldAlertText) ? 'warn' : '',
      });
    }

    function buildShellOrgHeroCard(snapshot) {
      if (!snapshot) {
        return buildShellSummaryCard({
          kicker: '势力',
          title: '阵营待同步',
          value: '待同步',
          meta: '当前聊天',
          rows: [
            { label: '阵营', value: '--' },
            { label: '身份', value: '--' },
          ],
        });
      }
      const primaryFactionEntry = getPrimaryFactionEntry(snapshot);
      const factionStats = getPrimaryFactionPowerStats(snapshot);
      const localFaction = toText(deepGet(snapshot, 'locationData.掌控势力', primaryFactionEntry.name || '未知'), primaryFactionEntry.name || '未知');
      return buildShellSummaryCard({
        kicker: '势力',
        title: shortenText(primaryFactionEntry.name || '势力矩阵', 14),
        value: `${(snapshot.orgEntries || []).length || 0} 个焦点`,
        meta: `本地 ${shortenText(localFaction, 12)}`,
        badges: [
          snapshot.势力[0] ? { text: shortenText(snapshot.势力[0][0], 10), tone: 'gold' } : '',
          buildFactionRelationSummary(primaryFactionEntry.data || {}, 2),
        ],
        metrics: [
          { label: '极限', value: String(factionStats.limit || 0), tone: 'gold' },
          { label: '超级', value: String(factionStats.super || 0) },
          { label: '封号', value: String(factionStats.title || 0), tone: 'live' },
          { label: '焦点', value: String((snapshot.orgEntries || []).length || 0) },
        ],
        note: shortenText(buildFactionRelationSummary(primaryFactionEntry.data || {}, 3) || '暂无势力关系', 34),
        tone: 'hero',
        size: 'hero',
      });
    }

    function buildShellOrgFactionCard(snapshot) {
      const primaryFaction = snapshot.势力[0] || null;
      const primaryFactionEntry = getPrimaryFactionEntry(snapshot);
      const factionName = primaryFaction ? primaryFaction[0] : primaryFactionEntry.name;
      const factionData = primaryFaction ? primaryFaction[1] : primaryFactionEntry.data;
      return buildShellSummaryCard({
        kicker: '我的阵营',
        title: shortenText(toText(factionName, '未加入'), 14),
        value: shortenText(toText(deepGet(factionData, '身份', '未加入'), '未加入'), 10),
        meta: shortenText(toText(deepGet(factionData, '状态', '正常'), '正常'), 18),
        rows: [
          { label: '影响力', value: formatNumber(deepGet(factionData, '影响力', 0)) },
          { label: '关系', value: shortenText(buildFactionRelationSummary(primaryFactionEntry.data || {}, 2) || '暂无', 16) },
        ],
      });
    }

    function buildShellOrgNodeCard(snapshot) {
      return buildShellSummaryCard({
        kicker: '本地据点',
        title: buildShellLocationLabel(snapshot, { fullLimit: 14, trailLimit: 7 }),
        value: shortenText(toText(deepGet(snapshot, 'locationData.掌控势力', '未知'), '未知'), 12),
        meta: `${shortenText(toText(deepGet(snapshot, 'locationData.经济状况', '未知'), '未知'), 8)} · ${shortenText(toText(deepGet(snapshot, 'locationData.守护军团', '未知'), '未知'), 8)}`,
        rows: [
          { label: '店铺', value: String((snapshot.storeNames || []).length || 0) },
          { label: '动态点', value: String((snapshot.dynamicLocationNames || []).length || 0) },
        ],
      });
    }

    function buildShellTerminalHeroCard(snapshot) {
      if (!snapshot) {
        return buildShellSummaryCard({
          kicker: '终端',
          title: '系统待同步',
          value: '待同步',
          meta: '当前聊天',
          rows: [
            { label: '情报', value: '--' },
            { label: '任务', value: '--' },
            { label: '收录', value: '--' },
          ],
        });
      }
      const sys = deepGet(snapshot, 'rootData.sys', {});
      const recentNews = buildRecentNewsSummary(snapshot, { seqLimit: 2, intelLimit: 2 });
      const pendingRequestText = resolveShellText((snapshot.pendingRequests || [])[0], resolveShellText(recentNews.summary, '待命中'));
      const worldAlertText = resolveShellText(snapshot.worldAlert, '');
      return buildShellSummaryCard({
        kicker: '终端',
        title: '终端',
        value: snapshot.pendingIntelCount ? `${snapshot.pendingIntelCount} 情报` : (snapshot.questRecordCount ? `${snapshot.questRecordCount} 任务` : '在线'),
        meta: shortenText(resolveShellText(sys.rsn, '待命中') || '待命中', 26),
        badges: [
          worldAlertText ? { text: shortenText(worldAlertText, 10), tone: 'warn' } : '',
          snapshot.pendingIntelCount ? { text: `新线索 ${snapshot.pendingIntelCount}`, tone: 'gold' } : (snapshot.questRecordCount ? '任务待跟进' : '待命中'),
        ],
        metrics: [
          { label: '情报', value: String(snapshot.pendingIntelCount || 0), tone: 'gold' },
          { label: '任务', value: String(snapshot.questRecordCount || 0), tone: 'live' },
          { label: '收录', value: String((snapshot.bestiaryEntries || []).length || 0) },
        ],
        note: shortenText(pendingRequestText || '待命中', 34),
        tone: 'hero',
        size: 'hero',
      });
    }

    function buildShellTerminalIntelCard(snapshot) {
      if (!snapshot.pendingIntelCount && !(snapshot.unlockedKnowledges || []).length && !(snapshot.pendingRequests || []).length) {
        return buildShellSummaryCard({
          title: '情报',
          value: '0',
          meta: '无线索',
        });
      }
      const latestIntelText = snapshot.pendingIntelCount
        ? `${shortenText(snapshot.pendingIntelContent, 12)} / +${snapshot.pendingIntelImpact}`
        : resolveShellText((snapshot.unlockedKnowledges || []).slice(-1)[0], '等待新线索');
      const pendingRequestText = resolveShellText((snapshot.pendingRequests || [])[0], '');
      return buildShellSummaryCard({
        kicker: '情报',
        title: '情报',
        value: snapshot.pendingIntelCount ? `${snapshot.pendingIntelCount} 待读` : ((snapshot.unlockedKnowledges || []).length ? `${(snapshot.unlockedKnowledges || []).length} 已录` : '待命中'),
        meta: shortenText(latestIntelText || '等待新线索', 20),
        note: shortenText(pendingRequestText || '', 24),
      });
    }

    function buildShellTerminalNewsCard(snapshot) {
      const newsSummary = buildRecentNewsSummary(snapshot, { seqLimit: 1, intelLimit: 1 });
      if (!(newsSummary.cards || []).length) {
        return buildShellSummaryCard({
          title: '见闻',
          value: '0',
          meta: '无见闻',
        });
      }
      const globalNews = resolveShellText((newsSummary.globalNews[0] || {}).desc, '');
      const personalNews = resolveShellText((newsSummary.personalNews[0] || {}).desc, '');
      const summaryText = resolveShellText(newsSummary.summary, '等待新见闻');
      return buildShellSummaryCard({
        kicker: '播报',
        title: '播报',
        value: `${(newsSummary.cards || []).length || 0} 条`,
        meta: shortenText(globalNews || personalNews || summaryText || '等待新见闻', 20),
        note: globalNews && personalNews ? shortenText(personalNews, 24) : '',
      });
    }

    function buildShellTerminalBestiaryCard(snapshot) {
      const bestiaryNames = (snapshot.bestiaryEntries || []).map(([name]) => name).filter(Boolean);
      if (!bestiaryNames.length) {
        return buildShellSummaryCard({
          title: '图鉴',
          value: '0',
          meta: '无收录',
        });
      }
      return buildShellSummaryCard({
        kicker: '收录',
        title: '收录',
        value: bestiaryNames.length ? `${bestiaryNames.length} 种` : '待收录',
        meta: shortenText(bestiaryNames.slice(0, 2).join(' / ') || '等待首条图鉴', 20),
        note: bestiaryNames[0] ? shortenText(bestiaryNames[0], 24) : '',
      });
    }

    function buildShellTerminalQuestCard(snapshot) {
      const questBoardEntries = safeEntries(deepGet(snapshot, 'rootData.world.委托板', {})).filter(([, item]) => item && typeof item === 'object');
      const pendingRequestText = resolveShellText((snapshot.pendingRequests || [])[0], '');
      if (!snapshot.questRecordCount && !questBoardEntries.length && !pendingRequestText) {
        return buildShellSummaryCard({
          title: '任务',
          value: '0',
          meta: '无任务',
        });
      }
      return buildShellSummaryCard({
        kicker: '任务',
        title: '任务',
        value: snapshot.questRecordCount ? `${snapshot.questRecordCount} 项` : '待命中',
        meta: `${questBoardEntries.length || 0} 条委托 / ${(snapshot.pendingRequests || []).length || 0} 待办`,
        note: shortenText(pendingRequestText, 24),
      });
    }

    function buildShellCurrentAreaView(snapshot) {
      const currentMapDisplayName = getMapDisplayName(snapshot);
      const currentLoc = toText(deepGet(snapshot, 'activeChar.状态.位置', snapshot.currentLoc), snapshot.currentLoc);
      const localFaction = toText(deepGet(snapshot, 'locationData.掌控势力', '未知'), '未知');
      const nodeStores = safeEntries(deepGet(snapshot, 'locationData.商店', {}));
      const localEntries = getShellLocalCharacterEntries(snapshot, 8);
      const localCards = buildShellLocalRosterRows(localEntries, 8);
      return {
        title: '当前地区',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="area">
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">本地角色</div>
              <div class="mvu-shell-roster-list">${localCards}</div>
            </section>
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>${htmlEscape(shortenText(currentMapDisplayName, 18))}</span>
                <strong>${htmlEscape(shortenText(currentLoc, 28))}</strong>
              </div>
              <div class="mvu-shell-lite-grid">
                <div class="mvu-shell-lite-stat"><span>掌控</span><b>${htmlEscape(shortenText(localFaction, 14))}</b></div>
                <div class="mvu-shell-lite-stat"><span>角色</span><b>${htmlEscape(String(localEntries.length))}</b></div>
                <div class="mvu-shell-lite-stat"><span>商店</span><b>${htmlEscape(String(nodeStores.length))}</b></div>
              </div>
            </section>
          </div>
        `
      };
    }

    function buildShellQuestOverviewView(snapshot) {
      const questRecords = (snapshot.recordEntries || []).filter(([, item]) => item && typeof item === 'object' && (
        Object.prototype.hasOwnProperty.call(item, '状态')
        || Object.prototype.hasOwnProperty.call(item, '目标进度')
        || Object.prototype.hasOwnProperty.call(item, '奖励币')
        || Object.prototype.hasOwnProperty.call(item, '奖励声望')
      ));
      const questBoardEntries = safeEntries(deepGet(snapshot, 'rootData.world.委托板', {})).filter(([, item]) => item && typeof item === 'object');
      const renderQuest = ([name, item]) => {
        const status = toText(item && item['状态'], '进行中');
        const current = toNumber(item && item['当前进度'], 0);
        const target = Math.max(1, toNumber(item && item['目标进度'], 1));
        const desc = toText(item && item['描述'], '暂无说明');
        return `
          <div class="mvu-shell-lite-item">
            <b>${htmlEscape(shortenText(name, 18))}</b>
            <span>${htmlEscape(status)} · ${htmlEscape(`${current}/${target}`)}</span>
            <div class="mvu-shell-lite-track"><i style="width:${ratioPercent(current, target)}%;"></i></div>
            <em>${htmlEscape(shortenText(desc, 28))}</em>
          </div>
        `;
      };
      const renderBoard = ([id, item]) => {
        const title = toText(item && item['标题'], id);
        const status = toText(item && item['状态'], '待接取');
        const publisher = toText(item && item['发布者'], '系统');
        return `
          <div class="mvu-shell-lite-item">
            <b>${htmlEscape(shortenText(title, 18))}</b>
            <span>${htmlEscape(status)} · ${htmlEscape(shortenText(publisher, 12))}</span>
          </div>
        `;
      };
      const questList = questRecords.length
        ? questRecords.slice(0, 5).map(renderQuest).join('')
        : '<div class="mvu-shell-lite-empty">暂无任务</div>';
      const boardList = questBoardEntries.length
        ? questBoardEntries.slice(0, 4).map(renderBoard).join('')
        : '<div class="mvu-shell-lite-empty">暂无委托</div>';
      return {
        title: '任务',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="quest">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>任务</span>
                <strong>${htmlEscape(questRecords[0] ? questRecords[0][0] : '暂无进行中任务')}</strong>
              </div>
              <div class="mvu-shell-lite-grid">
                <div class="mvu-shell-lite-stat"><span>任务</span><b>${htmlEscape(String(questRecords.length))}</b></div>
                <div class="mvu-shell-lite-stat"><span>委托</span><b>${htmlEscape(String(questBoardEntries.length))}</b></div>
                <div class="mvu-shell-lite-stat"><span>待办</span><b>${htmlEscape(String((snapshot.pendingRequests || []).length || 0))}</b></div>
              </div>
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">我的任务</div>
              <div class="mvu-shell-lite-list">${questList}</div>
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">委托板</div>
              <div class="mvu-shell-lite-list">${boardList}</div>
            </section>
          </div>
        `
      };
    }

    function buildShellLiteStats(items = [], options = {}) {
      const className = toText(options.className, '').trim();
      const list = (Array.isArray(items) ? items : [])
        .map(item => ({
          label: toText(item && item.label, '').trim(),
          value: toText(item && item.value, '').trim(),
        }))
        .filter(item => item.label || item.value);
      if (!list.length) return '';
      return `
        <div class="mvu-shell-lite-grid ${htmlEscape(className)}">
          ${list.map(item => `
            <div class="mvu-shell-lite-stat">
              <span>${htmlEscape(item.label)}</span>
              <b>${htmlEscape(item.value)}</b>
            </div>
          `).join('')}
        </div>
      `;
    }

    function buildShellLiteTags(items = []) {
      const list = (Array.isArray(items) ? items : [])
        .map(item => toText(item, '').trim())
        .filter(Boolean)
        .slice(0, 5);
      if (!list.length) return '';
      return `<div class="mvu-shell-lite-tags">${list.map(item => `<span>${htmlEscape(shortenText(item, 16))}</span>`).join('')}</div>`;
    }

    function buildShellLiteItemList(items = [], fallback = '暂无记录') {
      const list = (Array.isArray(items) ? items : []).filter(item => item && (item.title || item.meta || item.note));
      if (!list.length) return `<div class="mvu-shell-lite-empty">${htmlEscape(fallback)}</div>`;
      return list.map(item => `
        <div class="mvu-shell-lite-item">
          <b>${htmlEscape(shortenText(item.title || '未命名', 22))}</b>
          ${item.meta ? `<span>${htmlEscape(shortenText(item.meta, 30))}</span>` : ''}
          ${item.note ? `<em>${htmlEscape(shortenText(item.note, 34))}</em>` : ''}
        </div>
      `).join('');
    }

    function buildShellLifeView(snapshot) {
      const stat = deepGet(snapshot, 'activeChar.属性', {});
      const status = deepGet(snapshot, 'activeChar.状态', {});
      const social = deepGet(snapshot, 'activeChar.社交', {});
      const hpPair = getDisplayHpPair(stat);
      const woundLabel = getDisplayWoundLabel(stat);
      const placeText = buildShellLocationLabel(snapshot, { fullLimit: 24, trailLimit: 10 });
      return {
        title: '详细档案',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="life">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>${htmlEscape(placeText || '当前位置')}</span>
                <strong>${htmlEscape(toText(snapshot && snapshot.activeName, '当前角色'))}</strong>
              </div>
              ${buildShellLiteStats([
                { label: '年龄 / 性别', value: `${toText(stat.年龄, '--')} / ${toText(stat.性别, '未知')}` },
                { label: '修为等级', value: formatCultivationLevelBadge(stat.等级, '0') },
                { label: 'HP', value: formatShellPair(hpPair.hp, hpPair.hpMax) },
                { label: '体力', value: formatShellPair(stat.体力, stat.体力上限) },
                { label: '魂力', value: formatShellPair(stat.魂力, stat.魂力上限) },
                { label: '精神', value: formatShellPair(stat.精神力, stat.精神力上限) },
                { label: '状态', value: shortenText(toText(status.行动, '日常'), 16) },
                { label: '伤势', value: woundLabel },
              ], { className: 'mvu-shell-lite-grid--two' })}
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">属性</div>
              ${buildShellLiteStats([
                { label: '力量', value: formatNumber(stat.力量) },
                { label: '防御', value: formatNumber(stat.防御) },
                { label: '敏捷', value: formatNumber(stat.敏捷) },
                { label: '精神境界', value: toText(stat.精神境界, '灵元境') },
              ], { className: 'mvu-shell-lite-grid--two' })}
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">摘要</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList([
                { title: '身份', meta: summarizeShellIdentityText(social.主身份, { limit: 22 }) || toText(social.主身份, '未记录') },
                { title: '阵营', meta: snapshot.primaryFaction ? `${snapshot.primaryFaction[0]} / ${toText(deepGet(snapshot.primaryFaction[1], '身份', '成员'), '成员')}` : '未加入' },
                { title: '名望', meta: `${toText(social.名望等级, toText(social.名望等级, '籍籍无名'))} · ${formatNumber(social.声望)}` },
              ], '暂无摘要')}</div>
            </section>
          </div>
        `,
      };
    }

    function buildShellArmoryView(snapshot) {
      const armor = deepGet(snapshot, 'activeChar.装备.斗铠', {});
      const mech = deepGet(snapshot, 'activeChar.装备.机甲', {});
      const weapon = deepGet(snapshot, 'activeChar.装备.武器', {});
      const jobs = safeEntries(deepGet(snapshot, 'activeChar.职业', {}));
      const accessoryEntries = listAccessoryEntries(deepGet(snapshot, 'activeChar.装备.饰品', {}));
      const soulBoneEntries = Array.isArray(snapshot && snapshot.soulBoneEntries) ? snapshot.soulBoneEntries : [];
      const armorText = toNumber(armor.等级, 0) > 0
        ? `${toText(armor.名称, `${armor.等级}字斗铠`)} / ${toText(armor.装备状态, '未装备')}`
        : '未装配';
      const mechText = toText(mech.等级, '') && toText(mech.等级, '无') !== '无'
        ? `${toText(mech.等级, '无')} · ${toText(mech.型号, '未定型')}`
        : '未挂载';
      const weaponText = toText(weapon.名称 || weapon['名称'], '无');
      const jobItems = jobs.slice(0, 4).map(([name, info]) => ({
        title: name,
        meta: `Lv.${toText(info && info.等级, 0)} · ${toText(info && info.称号, '未定级')}`,
        note: '',
      }));
      return {
        title: '武装',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="armory">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>${htmlEscape(shortenText(weaponText, 18))}</span>
                <strong>${htmlEscape(shortenText(armorText, 24))}</strong>
              </div>
              ${buildShellLiteStats([
                { label: '机甲', value: shortenText(mechText, 10) },
                { label: '魂骨', value: String(soulBoneEntries.length || 0) },
                { label: '挂载', value: String(accessoryEntries.length || 0) },
              ])}
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">副职</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList(jobItems, '暂无副职')}</div>
            </section>
          </div>
        `,
      };
    }

    function buildShellSpiritView(snapshot, previewKey) {
      const config = previewKey === '第二武魂详细页'
        ? (snapshot && snapshot.secondaryTrack)
        : (snapshot && snapshot.primarySpirit);
      if (!config) {
        return {
          title: previewKey === '第二武魂详细页' ? '第二武魂' : '主武魂',
          body: `<div class="mvu-shell-lite-root"><section class="mvu-shell-lite-card"><div class="mvu-shell-lite-empty">暂无武魂</div></section></div>`,
        };
      }
      const souls = Array.isArray(config.souls) ? config.souls : [];
      const rings = Array.isArray(config.魂环) ? config.魂环 : [];
      const skillItems = rings.flatMap(ring => (Array.isArray(ring.skills) ? ring.skills : []).map(skill => ({
        title: toText(skill && skill.name, '魂技'),
        meta: shortenText(toText(ring && ring.title, '魂环'), 24),
        note: shortenText(toText(skill && skill.effectSummary, toText(skill && skill.effectDesc, '')), 30),
      }))).slice(0, 5);
      return {
        title: previewKey === '第二武魂详细页' ? '第二武魂' : '主武魂',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="spirit">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>${htmlEscape(shortenText(toText(config.spiritType, config.badge), 16))}</span>
                <strong>${htmlEscape(shortenText(toText(config.spiritName || config.name, '武魂'), 22))}</strong>
              </div>
              ${buildShellLiteStats([
                { label: '魂灵', value: String(souls.length || 0) },
                { label: '魂环', value: String(rings.length || 0) },
                { label: '属性', value: shortenText(toText(config.spiritElement, '无'), 8) },
              ])}
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">魂技</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList(skillItems, '暂无魂技')}</div>
            </section>
          </div>
        `,
      };
    }

    function buildShellFusionView(snapshot) {
      const fusionMeta = getFusionArchiveMeta(snapshot || {});
      const entries = (fusionMeta.fusionEntries || []).slice(0, 5).map(([name, item]) => ({
        title: toText(deepGet(item, '技能数据.魂技名', deepGet(item, '技能数据.name', name)), name),
        meta: `${toText(deepGet(item, '融合模式', 'partner'), 'partner') === 'self' ? '自体' : '双人'} · ${toText(deepGet(item, '融合对象', '无'), '无')}`,
        note: toText(deepGet(item, '技能数据.效果描述', deepGet(item, '技能数据.effectDesc', '')), ''),
      }));
      return {
        title: '融合技',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="fusion">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>融合技</span>
                <strong>${htmlEscape(`${fusionMeta.fusionEntries.length || 0} 项`)}</strong>
              </div>
              ${buildShellLiteStats([
                { label: '双人', value: String(fusionMeta.partnerCount || 0) },
                { label: '自体', value: String(fusionMeta.selfCount || 0) },
              ])}
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">条目</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList(entries, '暂无融合技')}</div>
            </section>
          </div>
        `,
      };
    }

    function buildShellBloodlineView(snapshot) {
      const config = snapshot && snapshot.bloodline ? snapshot.bloodline : buildBloodlineConfig(deepGet(snapshot, 'activeChar', {}), toText(snapshot && snapshot.activeName, ''));
      const rings = Array.isArray(config.魂环) ? config.魂环 : [];
      const skills = [
        ...(Array.isArray(config.bloodSkills) ? config.bloodSkills : []),
        ...(Array.isArray(config.bloodPassives) ? config.bloodPassives : []),
      ].slice(0, 5).map(skill => ({
        title: toText(skill && skill.name, '血脉能力'),
        meta: toText(skill && skill.category, '能力'),
        note: toText(skill && skill.effectSummary, toText(skill && skill.effectDesc, '')),
      }));
      return {
        title: '血脉',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="bloodline">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>${htmlEscape(toText(config.core, '未凝聚'))}</span>
                <strong>${htmlEscape(toText(config.bloodline || config.name, '未觉醒血脉'))}</strong>
              </div>
              ${buildShellLiteStats([
                { label: '封印', value: String(config.sealLv || 0) },
                { label: '血环', value: String(rings.length || 0) },
              ])}
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">能力</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList(skills, '暂无能力')}</div>
            </section>
          </div>
        `,
      };
    }

    function buildShellWorldStateView(snapshot) {
      const tick = toText(deepGet(snapshot, 'rootData.world.时间.tick', '0'), '0');
      const latest = snapshot && snapshot.latestTimeline ? snapshot.latestTimeline : null;
      const auction = deepGet(snapshot, 'rootData.world.拍卖', {});
      return {
        title: '世界',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="world">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>Tick ${htmlEscape(tick)}</span>
                <strong>${htmlEscape(toText(deepGet(snapshot, 'rootData.world.name', '斗罗大陆'), '斗罗大陆'))}</strong>
              </div>
              ${buildShellLiteStats([
                { label: '角色', value: String(safeEntries(deepGet(snapshot, 'rootData.char', {})).length || 0) },
                { label: '势力', value: String((snapshot.orgEntries || []).length || 0) },
                { label: '警报', value: shortenText(toText(snapshot.worldAlert, '无'), 8) },
              ])}
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">动态</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList([
                latest ? { title: latest[0], meta: `Tick ${toText(deepGet(latest[1], '触发tick', 0), 0)}`, note: toText(deepGet(latest[1], '事件', ''), '') } : null,
                { title: '拍卖', meta: `${toText(auction.状态, '休市')} · ${toText(auction.地点, '无')}` },
              ], '暂无动态')}</div>
            </section>
          </div>
        `,
      };
    }

    function buildShellAlertView(snapshot) {
      const auction = deepGet(snapshot, 'rootData.world.拍卖', {});
      return {
        title: '警报',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="alert">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>${htmlEscape(toText(auction.地点, '无'))}</span>
                <strong>${htmlEscape(toText(auction.状态, '休市'))}</strong>
              </div>
              ${buildShellLiteTags([snapshot.worldAlert])}
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">记录</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList([
                { title: '生态', meta: toText(snapshot.worldAlert, '无') },
                { title: '拍卖', meta: `${toText(auction.状态, '休市')} · ${toText(auction.地点, '无')}` },
              ], '暂无警报')}</div>
            </section>
          </div>
        `,
      };
    }

    function buildShellFactionView(snapshot) {
      const primaryFaction = snapshot && snapshot.primaryFaction ? snapshot.primaryFaction : null;
      const factionName = primaryFaction ? primaryFaction[0] : '未加入';
      const factionData = primaryFaction ? primaryFaction[1] : {};
      const orgEntry = getPrimaryFactionEntry(snapshot || {});
      const relations = safeEntries(deepGet(orgEntry.data, '关系', {})).slice(0, 5).map(([name, item]) => ({
        title: name,
        meta: toText(deepGet(item, '态度', deepGet(item, '关系', '未知')), '未知'),
        note: '',
      }));
      return {
        title: '阵营',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="faction">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>${htmlEscape(toText(deepGet(factionData, '身份', '无'), '无'))}</span>
                <strong>${htmlEscape(factionName)}</strong>
              </div>
              ${buildShellLiteStats([
                { label: '权限', value: toText(deepGet(factionData, '权限级', '--'), '--') },
                { label: '关系', value: String(relations.length || 0) },
              ])}
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">关系</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList(relations, '暂无关系')}</div>
            </section>
          </div>
        `,
      };
    }

    function buildShellNodeView(snapshot) {
      const currentLoc = toText(deepGet(snapshot, 'activeChar.状态.位置', snapshot.currentLoc), snapshot.currentLoc);
      const localFaction = toText(deepGet(snapshot, 'locationData.掌控势力', '未知'), '未知');
      const 商店列表 = safeEntries(deepGet(snapshot, 'locationData.商店', {})).slice(0, 5).map(([name, item]) => ({
        title: name,
        meta: toText(deepGet(item, '类型', deepGet(item, 'type', '商店')), '商店'),
        note: '',
      }));
      return {
        title: '据点',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="node">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>${htmlEscape(shortenText(localFaction, 18))}</span>
                <strong>${htmlEscape(shortenText(currentLoc, 28))}</strong>
              </div>
              ${buildShellLiteStats([
                { label: '经济', value: shortenText(toText(deepGet(snapshot, 'locationData.经济状况', '未知'), '未知'), 8) },
                { label: '守备', value: shortenText(toText(deepGet(snapshot, 'locationData.守护军团', '未知'), '未知'), 8) },
                { label: '商店', value: String(商店列表.length || 0) },
              ])}
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">商店</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList(商店列表, '暂无商店')}</div>
            </section>
          </div>
        `,
      };
    }

    function buildShellTerminalView(snapshot) {
      const requestText = resolveShellText((snapshot.pendingRequests || [])[0], resolveShellText(deepGet(snapshot, 'rootData.sys.rsn', ''), '待命中'));
      return {
        title: '终端',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="terminal">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>系统</span>
                <strong>${htmlEscape(shortenText(requestText, 28))}</strong>
              </div>
              ${buildShellLiteStats([
                { label: '任务', value: String(snapshot.questRecordCount || 0) },
                { label: '情报', value: String(snapshot.pendingIntelCount || 0) },
                { label: '图鉴', value: String((snapshot.bestiaryEntries || []).length || 0) },
              ])}
            </section>
          </div>
        `,
      };
    }

    function buildShellIntelView(snapshot) {
      const pending = snapshot.pendingIntelCount
        ? [{ title: '待办', meta: `${snapshot.pendingIntelCount} 条`, note: snapshot.pendingIntelContent }]
        : [];
      const unlocked = (snapshot.unlockedKnowledges || []).slice(-5).reverse().map(item => ({
        title: item,
        meta: '已掌握',
        note: '',
      }));
      return {
        title: '情报',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="intel">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>情报</span>
                <strong>${htmlEscape(`${(snapshot.unlockedKnowledges || []).length || 0} 条`)}</strong>
              </div>
              ${buildShellLiteStats([
                { label: '待办', value: String(snapshot.pendingIntelCount || 0) },
                { label: '试炼', value: String((snapshot.trialEntries || []).length || 0) },
              ])}
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">条目</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList([...pending, ...unlocked], '暂无情报')}</div>
            </section>
          </div>
        `,
      };
    }

    function buildShellNewsView(snapshot) {
      const newsSummary = buildRecentNewsSummary(snapshot || {}, { seqLimit: 3, intelLimit: 3 });
      const items = [
        ...(newsSummary.globalNews || []).map(item => ({ title: '全局', meta: item.desc, note: '' })),
        ...(newsSummary.personalNews || []).map(item => ({ title: '个人', meta: item.desc, note: '' })),
      ].slice(0, 6);
      return {
        title: '见闻',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="news">
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">近期</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList(items, '暂无见闻')}</div>
            </section>
          </div>
        `,
      };
    }

    function buildShellBestiaryView(snapshot) {
      const entries = (snapshot.bestiaryEntries || []).slice(0, 6).map(([name, item]) => ({
        title: name,
        meta: toText(deepGet(item, '类型', deepGet(item, 'type', '未知')), '未知'),
        note: toText(deepGet(item, '描述', deepGet(item, 'desc', '')), ''),
      }));
      return {
        title: '图鉴',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="bestiary">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>图鉴</span>
                <strong>${htmlEscape(`${(snapshot.bestiaryEntries || []).length || 0} 种`)}</strong>
              </div>
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">记录</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList(entries, '暂无记录')}</div>
            </section>
          </div>
        `,
      };
    }

    function buildShellVaultView(snapshot) {
      const wealth = deepGet(snapshot, 'activeChar.财富', {});
      const currencies = [
        { key: 'fed_coin', label: '联邦币', value: toNumber(wealth.fed_coin, 0) },
        { key: 'star_coin', label: '星罗币', value: toNumber(wealth.star_coin, 0) },
        { key: 'tang_pt', label: '唐门积分', value: toNumber(wealth.tang_pt, 0) },
        { key: 'shrek_pt', label: '学院积分', value: toNumber(wealth.shrek_pt, 0) },
        { key: 'blood_pt', label: '战功', value: toNumber(wealth.blood_pt, 0) },
      ];
      const primaryCurrency = currencies.find(item => item.value > 0) || currencies[0];
      const secondaryCurrencies = currencies.filter(item => item !== primaryCurrency && item.value > 0);
      const inventoryEntries = Array.isArray(snapshot && snapshot.inventoryEntries) ? snapshot.inventoryEntries : [];
      const inventoryItems = inventoryEntries.slice(0, 6).map(([name, item]) => {
        const qty = toNumber(item && item['数量'], 1);
        const type = toText(item && item['类型'], '物品');
        const desc = resolveShellText(item && item['描述'], type) || type;
        return {
          title: `${name}${qty > 1 ? ` ×${formatNumber(qty)}` : ''}`,
          meta: type,
          note: desc,
        };
      });
      const otherCurrencyText = secondaryCurrencies.map(item => `${item.label} ${formatNumber(item.value)}`);
      return {
        title: '仓库',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="vault">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero mvu-shell-lite-card--wallet">
              <div class="mvu-shell-lite-head">
                <span>${htmlEscape(primaryCurrency.label)}</span>
                <strong>${htmlEscape(formatNumber(primaryCurrency.value))}</strong>
              </div>
              ${buildShellLiteTags(otherCurrencyText)}
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">物资</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList(inventoryItems, '暂无物品')}</div>
            </section>
          </div>
        `,
      };
    }

    function buildShellSocialView(snapshot) {
      const social = deepGet(snapshot, 'activeChar.社交', {});
      const primaryFactionName = snapshot.primaryFaction ? snapshot.primaryFaction[0] : '';
      const primaryFactionRole = snapshot.primaryFaction ? toText(deepGet(snapshot.primaryFaction[1], '身份', ''), '') : '';
      const mainIdentity = summarizeShellIdentityText(social.主身份, { limit: 18 }) || toText(social.主身份, '无');
      const fame = toText(social.名望等级, toText(social.名望等级, '籍籍无名'));
      const titleText = Array.isArray(snapshot.recentTitles) && snapshot.recentTitles.length ? snapshot.recentTitles[0] : '';
      const longPressAttrs = canOpenPrivateArchive(snapshot)
        ? ` data-longpress="${escapeHtmlAttr(PRIVATE_ARCHIVE_PREVIEW_KEY)}" data-longpress-delay="600"`
        : '';
      return {
        title: '社会',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="social">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero nsfw-trigger-title"${longPressAttrs}>
              <div class="mvu-shell-lite-head">
                <span>${htmlEscape(fame)}</span>
                <strong>${htmlEscape(toText(snapshot.activeName, '当前角色'))}</strong>
              </div>
              ${buildShellLiteStats([
                { label: '身份', value: shortenText(mainIdentity, 18) },
                { label: '名望', value: formatNumber(social.声望) },
              ])}
              ${buildShellLiteTags([titleText, primaryFactionName ? `${primaryFactionName} / ${primaryFactionRole || '成员'}` : '', snapshot.publicIntel ? '公开情报' : '未公开'])}
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">关系</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList((snapshot.relations || []).slice(0, 5).map(([name, rel]) => ({
                title: name,
                meta: `${toText(deepGet(rel, '关系', '陌生'), '陌生')} · ${toNumber(deepGet(rel, '好感度', 0), 0)}`,
                note: toText(deepGet(rel, '_推进提示', ''), ''),
              })), '暂无关系')}</div>
            </section>
          </div>
        `,
      };
    }

    function buildShellTimelineView(snapshot) {
      const entries = Array.isArray(snapshot && snapshot.timelineEntries) ? snapshot.timelineEntries : [];
      const latest = snapshot && snapshot.latestTimeline ? snapshot.latestTimeline : entries[0];
      const latestName = latest ? latest[0] : '';
      const latestData = latest ? latest[1] : {};
      const eventText = toText(deepGet(latestData, '事件', latestName), latestName || '暂无编年');
      const nodes = entries.slice(0, 6).map(([name, item]) => ({
        title: name,
        meta: `Tick ${toText(item && item.触发tick, 0)} · ${toText(item && item.状态, 'pending')}`,
        note: toText(item && item.事件, ''),
      }));
      return {
        title: '编年',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="timeline">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>${htmlEscape(latest ? `Tick ${toText(deepGet(latestData, '触发tick', 0), 0)}` : 'Tick 0')}</span>
                <strong>${htmlEscape(shortenText(latestName || '暂无编年', 24))}</strong>
              </div>
              <div class="mvu-shell-lite-copy">${htmlEscape(shortenText(eventText, 60))}</div>
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">近期</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList(nodes, '暂无编年')}</div>
            </section>
          </div>
        `,
      };
    }

    function buildShellOrgMatrixView(snapshot) {
      const entries = Array.isArray(snapshot && snapshot.orgEntries) ? snapshot.orgEntries : [];
      const primaryFactionEntry = getPrimaryFactionEntry(snapshot || {});
      const factionStats = getPrimaryFactionPowerStats(snapshot || {});
      const rows = entries.slice(0, 5).map(([name, item]) => ({
        title: name,
        meta: `${toText(item && item.状态, '正常')} · ${formatNumber(item && item.规模 || 0)}`,
        note: '',
      }));
      return {
        title: '势力',
        body: `
          <div class="mvu-shell-lite-root" data-shell-light-view="org">
            <section class="mvu-shell-lite-card mvu-shell-lite-card--hero">
              <div class="mvu-shell-lite-head">
                <span>${htmlEscape(toText(primaryFactionEntry.name, '本地势力'))}</span>
                <strong>${htmlEscape(`${entries.length || 0} 个势力`)}</strong>
              </div>
              ${buildShellLiteStats([
                { label: '极限', value: String(factionStats.limit || 0) },
                { label: '超级', value: String(factionStats.super || 0) },
                { label: '封号', value: String(factionStats.title || 0) },
              ])}
            </section>
            <section class="mvu-shell-lite-card">
              <div class="mvu-shell-lite-section-title">梯阵</div>
              <div class="mvu-shell-lite-list">${buildShellLiteItemList(rows, '暂无势力')}</div>
            </section>
          </div>
        `,
      };
    }

    function renderUnifiedSpiritCardsBySurface(snapshot, surface) {
      const normalizedSurface = normalizeUnifiedSurfaceKey(surface) || 'panel';
      const primary = snapshot.primarySpirit || null;
      const secondary = snapshot.secondaryTrack || null;
      const spiritBuilder = normalizedSurface === 'shell' ? buildShellSpiritSummaryCard : buildUnifiedSpiritCard;
      setUnifiedCardMarkup('primary-spirit', spiritBuilder(primary, { primary: true }), {
        preview: primary ? toText(primary.preview, '') : '',
        enabled: !!primary,
        surface: normalizedSurface,
      });
      if (secondary) {
        setUnifiedCardMarkup('secondary-spirit', spiritBuilder(secondary, { primary: false }), {
          preview: toText(secondary.preview, ''),
          enabled: true,
          surface: normalizedSurface,
        });
      } else {
        setUnifiedCardMarkup('secondary-spirit', '', {
          enabled: false,
          surface: normalizedSurface,
        });
      }
    }

    function renderUnifiedCardsBySurface(snapshot, sectionSignatures, previousSectionSignatures, surface) {
      const normalizedSurface = normalizeUnifiedSurfaceKey(surface) || 'panel';
      const isShellSurface = normalizedSurface === 'shell';

      if (sectionSignatures.archive !== previousSectionSignatures.archive) {
        setUnifiedCardMarkup('archive-core', isShellSurface ? buildShellArchiveCoreCard(snapshot) : buildArchiveCoreCard(snapshot), {
          preview: '生命图谱详细页',
          surface: normalizedSurface,
        });
        setUnifiedCardMarkup('armory', isShellSurface ? buildShellArmoryCard(snapshot) : buildArmoryCard(snapshot), {
          preview: '武装工坊详细页',
          surface: normalizedSurface,
        });
        setUnifiedCardMarkup('vault', isShellSurface ? buildShellVaultCard(snapshot) : buildVaultCard(snapshot), {
          preview: '储物仓库详细页',
          surface: normalizedSurface,
        });
        setUnifiedCardMarkup('social', isShellSurface ? buildShellSocialCard(snapshot) : buildUnifiedSocialCard(snapshot), {
          preview: '社会档案详细页',
          surface: normalizedSurface,
        });
        if (isShellSurface) {
          setUnifiedCardMarkup('home-archive', buildShellHomeArchiveCard(snapshot), { surface: normalizedSurface });
        }
        renderUnifiedSpiritCardsBySurface(snapshot, normalizedSurface);
      }

      if (sectionSignatures.map !== previousSectionSignatures.map) {
        if (isShellSurface) {
          setUnifiedMapStageMarkup('shell', '');
          setUnifiedCardMarkup('home-map', buildShellHomeMapCard(snapshot), { surface: normalizedSurface });
          setUnifiedCardMarkup('map-hero', '', { enabled: false, surface: normalizedSurface });
          setUnifiedCardMarkup('map-current', buildShellMapCurrentCard(snapshot), { preview: '当前节点详情', surface: normalizedSurface });
          setUnifiedCardMarkup('map-locals', buildShellMapLocalCharactersCard(snapshot), { preview: '当前节点详情', surface: normalizedSurface });
          setUnifiedCardMarkup('map-route', '', { enabled: false, surface: normalizedSurface });
          setUnifiedCardMarkup('map-dynamic', '', { enabled: false, surface: normalizedSurface });
        } else {
          ensureUnifiedSheepMapStage('panel');
          setUnifiedCardMarkup('map-hero', '', { enabled: false, surface: normalizedSurface });
          setUnifiedCardMarkup('map-current', buildSimpleCard('当前位置', { text: '当前' }, [
            { label: '地点', value: snapshot.normalizedLoc !== snapshot.currentLoc ? `${snapshot.normalizedLoc} / ${snapshot.currentLoc}` : snapshot.currentLoc },
            { label: '地图', value: getMapDisplayName(snapshot) },
            { label: '入口', value: '展开节点详情' },
          ]), { preview: '当前节点详情', surface: normalizedSurface });
          setUnifiedCardMarkup('map-route', `
            <div class="simple-head"><div class="simple-title">移动与导航</div></div>
            <div class="simple-list">
              <div class="simple-row"><b>当前地图</b><span>${htmlEscape(getMapDisplayName(snapshot))}</span></div>
              <div class="simple-row"><b>子图入口</b><span>${htmlEscape(`${safeEntries(snapshot.mapAvailableChildMaps).length} 个`)}</span></div>
              <div class="simple-row"><b>移动方式</b><span>打开跑图面板</span></div>
            </div>
          `, { preview: '图层控制与跑图', surface: normalizedSurface });
          setUnifiedCardMarkup('map-dynamic', `
            <div class="simple-head"><div class="simple-title">动态节点</div></div>
            <div class="simple-list">
              <div class="simple-row"><b>可见动态点</b><span>${htmlEscape(String(snapshot.mapVisibleDynamicEntries.length || 0))}</span></div>
              <div class="simple-row"><b>最近变化</b><span>${htmlEscape(snapshot.latestTimeline ? snapshot.latestTimeline[0] : '暂无')}</span></div>
            </div>
          `, { preview: '动态地点与扩展节点', surface: normalizedSurface });
        }
      }

      if (sectionSignatures.world !== previousSectionSignatures.world) {
        if (isShellSurface) {
          setUnifiedCardMarkup('home-world', buildShellHomeWorldCard(snapshot), { surface: normalizedSurface });
          setUnifiedCardMarkup('home-org', buildShellHomeOrgCard(snapshot), { surface: normalizedSurface });
          setUnifiedCardMarkup('world-hero', buildShellWorldHeroCard(snapshot), { preview: '世界状态总览', surface: normalizedSurface });
          setUnifiedCardMarkup('world-timeline', buildShellWorldTimelineCard(snapshot), { preview: '编年史档案', surface: normalizedSurface });
          setUnifiedCardMarkup('world-alerts', buildShellWorldAlertCard(snapshot), { preview: '拍卖与警报', surface: normalizedSurface });
          setUnifiedCardMarkup('org-hero', buildShellOrgHeroCard(snapshot), { preview: '势力矩阵总览', surface: normalizedSurface });
          setUnifiedCardMarkup('org-faction', buildShellOrgFactionCard(snapshot), { preview: '我的阵营详情', surface: normalizedSurface });
          setUnifiedCardMarkup('org-node', buildShellOrgNodeCard(snapshot), { preview: '本地据点详情', surface: normalizedSurface });
        } else {
          setUnifiedCardMarkup('world-hero', buildWorldHeroCard(snapshot), { preview: '世界状态总览', surface: normalizedSurface });
          setUnifiedCardMarkup('world-timeline', buildSimpleCard('编年史档案', null, [
            { label: '最近事件', value: snapshot.latestTimeline ? toText(deepGet(snapshot.latestTimeline[1], '事件', snapshot.latestTimeline[0]), snapshot.latestTimeline[0]) : '暂无' },
            { label: '状态', value: snapshot.latestTimeline ? `${toText(deepGet(snapshot.latestTimeline[1], '状态', 'pending'), 'pending')} / Tick ${toText(deepGet(snapshot.latestTimeline[1], '触发tick', 0), '0')}` : '暂无时间线' },
          ]), { preview: '编年史档案', surface: normalizedSurface });
          setUnifiedCardMarkup('world-alerts', buildSimpleCard('拍卖与警报', null, [
            { label: '拍卖行', value: `${toText(deepGet(snapshot, 'rootData.world.拍卖.状态', '休市'), '休市')} / ${toText(deepGet(snapshot, 'rootData.world.拍卖.地点', '无'), '无')}` },
            { label: '生态警报', value: snapshot.worldAlert },
          ]), { preview: '拍卖与警报', surface: normalizedSurface });
          setUnifiedCardMarkup('org-hero', buildOrgHeroCard(snapshot), { preview: '势力矩阵总览', surface: normalizedSurface });
          setUnifiedCardMarkup('org-faction', buildSimpleCard('我的阵营', null, [
            { label: '当前所属', value: snapshot.势力[0] ? snapshot.势力[0][0] : '无' },
            { label: '身份', value: snapshot.势力[0] ? toText(deepGet(snapshot.势力[0][1], '身份', '无'), '无') : '未加入' },
          ]), { preview: '我的阵营详情', surface: normalizedSurface });
          setUnifiedCardMarkup('org-node', buildSimpleCard('本地据点', null, [
            { label: '掌控势力', value: toText(deepGet(snapshot, 'locationData.掌控势力', '未知'), '未知') },
            { label: '据点状态', value: `${toText(deepGet(snapshot, 'locationData.经济状况', '未知'), '未知')} / ${toText(deepGet(snapshot, 'locationData.守护军团', '未知'), '未知')}` },
          ]), { preview: '本地据点详情', surface: normalizedSurface });
        }
      }

      if (sectionSignatures.terminal !== previousSectionSignatures.terminal) {
        if (isShellSurface) {
          setUnifiedCardMarkup('home-terminal', buildShellHomeTerminalCard(snapshot), { surface: normalizedSurface });
          setUnifiedCardMarkup('terminal-hero', buildShellTerminalHeroCard(snapshot), { preview: '系统播报与日志', surface: normalizedSurface });
          setUnifiedCardMarkup('terminal-intel', buildShellTerminalIntelCard(snapshot), { preview: '试炼与情报', surface: normalizedSurface });
          setUnifiedCardMarkup('terminal-news', buildShellTerminalNewsCard(snapshot), { preview: '近期见闻', surface: normalizedSurface });
          setUnifiedCardMarkup('terminal-bestiary', buildShellTerminalBestiaryCard(snapshot), { preview: '怪物图鉴', surface: normalizedSurface });
          setUnifiedCardMarkup('terminal-quest', buildShellTerminalQuestCard(snapshot), { preview: '任务界面', surface: normalizedSurface });
        } else {
          setUnifiedCardMarkup('terminal-hero', buildTerminalHeroCard(snapshot), { preview: '系统播报与日志', surface: normalizedSurface });
          setUnifiedCardMarkup('terminal-intel', `
            <div class="simple-head"><div class="simple-title">试炼与情报</div></div>
            <div class="simple-list">
              <div class="simple-row"><b>线索</b><span>${htmlEscape(`${snapshot.pendingIntelCount} 条`)}</span></div>
              <div class="simple-row"><b>已掌握</b><span>${htmlEscape(`${snapshot.unlockedKnowledges.length} 条`)}</span></div>
              <div class="simple-row"><b>入口</b><span>打开情报与试炼</span></div>
            </div>
          `, { preview: '试炼与情报', surface: normalizedSurface });
          const newsSummary = buildRecentNewsSummary(snapshot, { seqLimit: 1, intelLimit: 1 });
          setUnifiedCardMarkup('terminal-news', `
            <div class="simple-head"><div class="simple-title">近期见闻</div></div>
            <div class="simple-list">
              <div class="simple-row"><b>全局</b><span>${htmlEscape((newsSummary.globalNews[0] || {}).desc || '暂无')}</span></div>
              <div class="simple-row"><b>个人</b><span>${htmlEscape((newsSummary.personalNews[0] || {}).desc || '暂无')}</span></div>
            </div>
          `, { preview: '近期见闻', surface: normalizedSurface });
          setUnifiedCardMarkup('terminal-bestiary', `
            <div class="simple-head"><div class="simple-title">怪物图鉴</div></div>
            <div class="simple-list">
              <div class="simple-row"><b>已记录</b><span>${htmlEscape(`${snapshot.bestiaryEntries.length} 种`)}</span></div>
              <div class="simple-row"><b>最近条目</b><span>${htmlEscape(snapshot.bestiaryEntries.slice(0, 2).map(([name]) => name).join(' / ') || '暂无')}</span></div>
            </div>
          `, { preview: '怪物图鉴', surface: normalizedSurface });
          setUnifiedCardMarkup('terminal-quest', `
            <div class="simple-head"><div class="simple-title">任务界面</div></div>
            <div class="simple-list">
              <div class="simple-row"><b>我的任务</b><span>${htmlEscape(`${(snapshot.recordEntries || []).length} 条记录`)}</span></div>
              <div class="simple-row"><b>委托板</b><span>${htmlEscape(`${safeEntries(deepGet(snapshot, 'rootData.world.委托板', {})).length} 条委托`)}</span></div>
            </div>
          `, { preview: '任务界面', surface: normalizedSurface });
        }
      }
    }

    function ensureUnifiedSheepMapStage(stage = 'panel') {
      const stageKey = toText(stage, '').trim();
      if (!stageKey) return;
      const selector = `#mvu-unified-mount [data-mvu-map-stage="${stageKey}"]`;
      getLiveUiElements(selector).forEach(node => {
        if (!(node instanceof Element)) return;
        const hasSheepMap = !!node.querySelector('.map-layout .map-canvas.interactive-map [data-map-node-layer]');
        if (!hasSheepMap) setLiveNodeHtml(node, '');
      });
      if (typeof window.__sheepMapResync === 'function') {
        window.setTimeout(() => {
          try {
            window.__sheepMapResync({ center: false, syncVisual: false });
          } catch (err) {}
          if (typeof scheduleUnifiedMapCanvasClamp === 'function') scheduleUnifiedMapCanvasClamp();
        }, 0);
      }
    }

    function setUnifiedCardMarkup(slot, html, options = {}) {
      const surface = normalizeUnifiedSurfaceKey(options.surface);
      const selector = surface
        ? `#mvu-unified-mount [data-unified-card="${slot}"][data-unified-surface="${surface}"]`
        : `#mvu-unified-mount [data-unified-card="${slot}"]`;
      const preview = toText(options.preview, '');
      const hasMarkup = !!toText(html, '').trim();
      const enabled = options.enabled !== false && hasMarkup;
      getLiveUiElements(selector).forEach(node => {
        setLiveNodeHtml(node, html);
        if (preview && enabled) node.setAttribute('data-preview', preview);
        else node.removeAttribute('data-preview');
        node.classList.toggle('clickable', !!(preview && enabled));
        node.classList.toggle('is-empty', !enabled);
      });
    }

    function setUnifiedMapStageMarkup(stage, html) {
      const stageKey = toText(stage, '').trim();
      if (!stageKey) return;
      const selector = `#mvu-unified-mount [data-mvu-map-stage="${stageKey}"]`;
      getLiveUiElements(selector).forEach(node => setLiveNodeHtml(node, html));
    }

    function renderUnifiedSpiritCards(snapshot) {
      renderUnifiedSpiritCardsBySurface(snapshot, 'panel');
      renderUnifiedSpiritCardsBySurface(snapshot, 'shell');
      return;
      const primary = snapshot.primarySpirit || null;
      const secondary = snapshot.secondaryTrack || null;
      setUnifiedCardMarkup('primary-spirit', buildUnifiedSpiritCard(primary, { primary: true }), {
        preview: primary ? toText(primary.preview, '') : '',
        enabled: !!primary
      });
      setUnifiedCardMarkup('secondary-spirit', buildUnifiedSpiritCard(secondary, { primary: false }), {
        preview: secondary ? toText(secondary.preview, '') : '',
        enabled: !!secondary
      });
    }

    function renderUnifiedCards(snapshot, precomputedSectionSignatures = null, previousSectionSignaturesOverride = null) {
      const sectionSignatures = precomputedSectionSignatures || buildDashboardSectionRenderSignatures(snapshot);
      const previousSectionSignatures = previousSectionSignaturesOverride || lastDashboardSectionRenderSignatures || Object.create(null);
      renderUnifiedCardsBySurface(snapshot, sectionSignatures, previousSectionSignatures, 'panel');
      renderUnifiedCardsBySurface(snapshot, sectionSignatures, previousSectionSignatures, 'shell');
      return;

      if (sectionSignatures.archive !== previousSectionSignatures.archive) {
        setUnifiedCardMarkup('archive-core', buildArchiveCoreCard(snapshot), { preview: '生命图谱详细页' });
        setUnifiedCardMarkup('armory', buildArmoryCard(snapshot), { preview: '武装工坊详细页' });
        setUnifiedCardMarkup('vault', buildVaultCard(snapshot), { preview: '储物仓库详细页' });
        setUnifiedCardMarkup('social', buildUnifiedSocialCard(snapshot), { preview: '社会档案详细页' });
        renderUnifiedSpiritCards(snapshot);
      }

      if (sectionSignatures.map !== previousSectionSignatures.map) {
        ensureUnifiedSheepMapStage('panel');
        setUnifiedCardMarkup('map-hero', '', { enabled: false });
        setUnifiedCardMarkup('map-current', buildSimpleCard('当前位置', { text: '当前' }, [
          { label: '地点', value: snapshot.normalizedLoc !== snapshot.currentLoc ? `${snapshot.normalizedLoc} / ${snapshot.currentLoc}` : snapshot.currentLoc },
          { label: '地图', value: getMapDisplayName(snapshot) },
          { label: '入口', value: '展开节点详情' }
        ]), { preview: '当前节点详情' });
        setUnifiedCardMarkup('map-route', `
          <div class="simple-head"><div class="simple-title">移动与导航</div></div>
          <div class="simple-list">
            <div class="simple-row"><b>当前地图</b><span>${htmlEscape(getMapDisplayName(snapshot))}</span></div>
            <div class="simple-row"><b>子图入口</b><span>${htmlEscape(`${safeEntries(snapshot.mapAvailableChildMaps).length} 个`)}</span></div>
            <div class="simple-row"><b>移动方式</b><span>打开跑图面板</span></div>
          </div>
        `, { preview: '图层控制与跑图' });
        setUnifiedCardMarkup('map-dynamic', `
          <div class="simple-head"><div class="simple-title">动态节点</div></div>
          <div class="simple-list">
            <div class="simple-row"><b>可见动态点</b><span>${htmlEscape(String(snapshot.mapVisibleDynamicEntries.length || 0))}</span></div>
            <div class="simple-row"><b>最近变化</b><span>${htmlEscape(snapshot.latestTimeline ? snapshot.latestTimeline[0] : '暂无')}</span></div>
          </div>
        `, { preview: '动态地点与扩展节点' });
      }

      if (sectionSignatures.world !== previousSectionSignatures.world) {
        setUnifiedCardMarkup('world-hero', buildWorldHeroCard(snapshot), { preview: '世界状态总览' });
        setUnifiedCardMarkup('world-timeline', buildSimpleCard('编年史档案', null, [
          { label: '最近事件', value: snapshot.latestTimeline ? toText(deepGet(snapshot.latestTimeline[1], '事件', snapshot.latestTimeline[0]), snapshot.latestTimeline[0]) : '暂无' },
          { label: '状态', value: snapshot.latestTimeline ? `${toText(deepGet(snapshot.latestTimeline[1], '状态', 'pending'), 'pending')} / Tick ${toText(deepGet(snapshot.latestTimeline[1], '触发tick', 0), '0')}` : '暂无时间线' }
        ]), { preview: '编年史档案' });
        setUnifiedCardMarkup('world-alerts', buildSimpleCard('拍卖与警报', null, [
          { label: '拍卖行', value: `${toText(deepGet(snapshot, 'rootData.world.拍卖.状态', '休市'), '休市')} / ${toText(deepGet(snapshot, 'rootData.world.拍卖.地点', '无'), '无')}` },
          { label: '生态警报', value: snapshot.worldAlert }
        ]), { preview: '拍卖与警报' });
        setUnifiedCardMarkup('org-hero', buildOrgHeroCard(snapshot), { preview: '势力矩阵总览' });
        setUnifiedCardMarkup('org-faction', buildSimpleCard('我的阵营', null, [
          { label: '当前所属', value: snapshot.势力[0] ? snapshot.势力[0][0] : '无' },
          { label: '身份', value: snapshot.势力[0] ? toText(deepGet(snapshot.势力[0][1], '身份', '无'), '无') : '未加入' }
        ]), { preview: '我的阵营详情' });
        setUnifiedCardMarkup('org-node', buildSimpleCard('本地据点', null, [
          { label: '掌控势力', value: toText(deepGet(snapshot, 'locationData.掌控势力', '未知'), '未知') },
          { label: '据点状态', value: `${toText(deepGet(snapshot, 'locationData.经济状况', '未知'), '未知')} / ${toText(deepGet(snapshot, 'locationData.守护军团', '未知'), '未知')}` }
        ]), { preview: '本地据点详情' });
      }

      if (sectionSignatures.terminal !== previousSectionSignatures.terminal) {
        setUnifiedCardMarkup('terminal-hero', buildTerminalHeroCard(snapshot), { preview: '系统播报与日志' });
        setUnifiedCardMarkup('terminal-intel', `
          <div class="simple-head"><div class="simple-title">试炼与情报</div></div>
          <div class="simple-list">
            <div class="simple-row"><b>线索</b><span>${htmlEscape(`${snapshot.pendingIntelCount} 条`)}</span></div>
            <div class="simple-row"><b>已掌握</b><span>${htmlEscape(`${snapshot.unlockedKnowledges.length} 条`)}</span></div>
            <div class="simple-row"><b>入口</b><span>打开情报与试炼</span></div>
          </div>
        `, { preview: '试炼与情报' });
        const newsSummary = buildRecentNewsSummary(snapshot, { seqLimit: 1, intelLimit: 1 });
        setUnifiedCardMarkup('terminal-news', `
          <div class="simple-head"><div class="simple-title">近期见闻</div></div>
          <div class="simple-list">
            <div class="simple-row"><b>全局</b><span>${htmlEscape((newsSummary.globalNews[0] || {}).desc || '暂无')}</span></div>
            <div class="simple-row"><b>个人</b><span>${htmlEscape((newsSummary.personalNews[0] || {}).desc || '暂无')}</span></div>
          </div>
        `, { preview: '近期见闻' });
        setUnifiedCardMarkup('terminal-bestiary', `
          <div class="simple-head"><div class="simple-title">怪物图鉴</div></div>
          <div class="simple-list">
            <div class="simple-row"><b>已记录</b><span>${htmlEscape(`${snapshot.bestiaryEntries.length} 种`)}</span></div>
            <div class="simple-row"><b>最近条目</b><span>${htmlEscape(snapshot.bestiaryEntries.slice(0, 2).map(([name]) => name).join(' / ') || '暂无')}</span></div>
          </div>
        `, { preview: '怪物图鉴' });
        setUnifiedCardMarkup('terminal-quest', `
          <div class="simple-head"><div class="simple-title">任务界面</div></div>
          <div class="simple-list">
            <div class="simple-row"><b>我的任务</b><span>${htmlEscape(`${(snapshot.recordEntries || []).length} 条记录`)}</span></div>
            <div class="simple-row"><b>委托板</b><span>${htmlEscape(`${safeEntries(deepGet(snapshot, 'rootData.world.委托板', {})).length} 条委托`)}</span></div>
          </div>
        `, { preview: '任务界面' });
      }
    }

    function getFusionArchiveMeta(snapshot) {
      const fusionEntries = safeEntries(deepGet(snapshot, 'activeChar.武魂融合技', {}));
      const partnerCount = fusionEntries.filter(([, fusion]) => toText(deepGet(fusion, '融合模式', 'partner'), 'partner') !== 'self').length;
      const selfCount = fusionEntries.length - partnerCount;
      const leadFusion = fusionEntries[0] && fusionEntries[0][1] && typeof fusionEntries[0][1] === 'object' ? fusionEntries[0][1] : {};
      const leadParticipants = normalizeSkillDesignerFusionParticipantList(getSkillDesignerRawFusionParticipants({}, leadFusion), snapshot && snapshot.rootData ? snapshot.rootData : {});
      const leadPartnerNames = leadParticipants
        .filter(participant => participant.role !== 'self')
        .map(participant => participant.charName || participant.charKey)
        .filter(Boolean);
      const headlineFusion = fusionEntries[0]
        ? toText(deepGet(fusionEntries[0][1], '技能数据.魂技名', deepGet(fusionEntries[0][1], '技能数据.name', fusionEntries[0][0])), fusionEntries[0][0])
        : '未录入';
      const partnerLabel = fusionEntries[0]
        ? (toText(deepGet(leadFusion, '融合模式', 'partner'), 'partner') === 'self'
          ? '自体融合'
          : `${leadParticipants.length > 2 ? '多人' : '搭档'} ${leadPartnerNames.length ? Array.from(new Set(leadPartnerNames)).join('、') : toText(deepGet(leadFusion, '融合对象', '未知'), '未知')}`)
        : '等待收录';
      return {
        fusionEntries,
        partnerCount,
        selfCount,
        headlineFusion,
        partnerLabel,
      };
    }

    function buildFusionArchiveListItem(fusionMeta) {
      const meta = fusionMeta && typeof fusionMeta === 'object' ? fusionMeta : getFusionArchiveMeta({});
      if (!meta.fusionEntries.length) {
        return {
          title: '武魂融合技',
          desc: '<small>未收录</small>',
          preview: '武魂融合技详细页'
        };
      }
      return {
        title: '武魂融合技',
        desc: `<strong>${htmlEscape(meta.headlineFusion)}</strong><small>已收录 ${htmlEscape(String(meta.fusionEntries.length))} 项 ｜ 外部 ${htmlEscape(String(meta.partnerCount))} / 自体 ${htmlEscape(String(meta.selfCount))}</small><small>${htmlEscape(meta.partnerLabel)}</small>`,
        preview: '武魂融合技详细页'
      };
    }

    function renderSpiritStrips(snapshot) {
      const primary = snapshot.primarySpirit;
      const secondary = snapshot.secondaryTrack;
      getLiveUiElements('.dual-spirit-strip').forEach(strip => {
        const isSecondaryOnly = strip.classList.contains('secondary-track') || strip.classList.contains('split-secondary-left');
        const isSinglePrimary = strip.classList.contains('single-track') && !strip.classList.contains('split-secondary-left');

        if (isSecondaryOnly) {
          if (!secondary) {
            if (strip.style.display !== 'none') strip.style.display = 'none';
            return;
          }
          if (strip.style.display !== '') strip.style.display = '';
          setLiveNodeHtml(strip, `<div class="dual-spirit-body"><div class="spirit-side primary-side"></div><div class="spirit-side secondary-side clickable" data-preview="${htmlEscape(secondary.preview)}">${secondary.kind === 'bloodline' ? renderArchiveBloodlineEntry(secondary) : renderArchiveSpiritEntry(secondary, false)}</div></div>`);
          return;
        }

        if (isSinglePrimary) {
          if (strip.style.display !== '') strip.style.display = '';
          setLiveNodeHtml(strip, `<div class="dual-spirit-body"><div class="spirit-side primary-side clickable" data-preview="${htmlEscape(primary.preview)}">${renderArchiveSpiritEntry(primary, true)}</div><div class="spirit-side secondary-side clickable"></div></div>`);
          return;
        }

        if (!secondary) {
          if (strip.style.display !== 'none') strip.style.display = 'none';
          return;
        }

        if (strip.style.display !== '') strip.style.display = '';
        setLiveNodeHtml(strip, `
          <div class="dual-spirit-body">
            <div class="spirit-side primary-side clickable" data-preview="${htmlEscape(primary.preview)}">${renderArchiveSpiritEntry(primary, true)}</div>
            <div class="spirit-side secondary-side clickable" data-preview="${htmlEscape(secondary.preview)}">${secondary.kind === 'bloodline' ? renderArchiveBloodlineEntry(secondary) : renderArchiveSpiritEntry(secondary, false)}</div>
          </div>
        `);
      });
    }


    function getSheepMapSnapshot(snapshot, mapId = null) {
      const sheepSnapshot = window.__sheepMapSnapshot;
      if (!sheepSnapshot || typeof sheepSnapshot !== 'object') return null;
      const expectedMapId = toText(mapId || (snapshot && snapshot.mapCurrentMapId), '');
      const sheepMapId = toText(sheepSnapshot.currentMapId, '');
      if (expectedMapId && sheepMapId && expectedMapId !== sheepMapId) return null;
      return sheepSnapshot;
    }

    function getMapMeta(snapshot, mapId = null) {
      // Map metadata is sourced from sheep_map_restore.js snapshots.
      const sheepSnapshot = getSheepMapSnapshot(snapshot, mapId);
      const mapMeta = sheepSnapshot && sheepSnapshot.mapMeta && typeof sheepSnapshot.mapMeta === 'object'
        ? sheepSnapshot.mapMeta
        : null;
      return mapMeta || {};
    }

    function getMapDisplayName(snapshot, mapId = null) {
      const safeMapId = toText(mapId || (snapshot && snapshot.mapCurrentMapId), 'map_douluo_world');
      const mapMeta = getMapMeta(snapshot, safeMapId);
      const sheepMapName = toText(mapMeta.name, '').trim();
      if (sheepMapName) return sheepMapName;
      if (safeMapId === 'map_douluo_world') return '斗罗大陆总图';
      if (/^map_debug_/i.test(safeMapId)) return '区域子图';
      if (/^map_/i.test(safeMapId)) return '未命名子图';
      return '未命名地图';
    }

    function resolveDisplayMapNode(snapshot, nodeName) {
      const node = snapshot.mapVisibleNodeEntries.find(([name]) => name === nodeName);
      if (node) return { name: nodeName, source: toText(node[1] && node[1].source, 'static'), type: toText(node[1] && node[1].type, '地图节点'), state: node[1] && node[1].level ? `Lv.${node[1].level}` : '可见', childMapId: toText(node[1] && node[1].child_map_id, '无'), x: node[1] && node[1].x, y: node[1] && node[1].y, desc: toText(node[1] && node[1].desc, '无') };
      const dynamicNode = snapshot.mapVisibleDynamicEntries.find(([name]) => name === nodeName);
      if (dynamicNode) return { name: nodeName, source: 'dynamic', type: '动态地点', state: '动态', childMapId: '无', x: dynamicNode[1] && dynamicNode[1].x, y: dynamicNode[1] && dynamicNode[1].y, desc: toText(dynamicNode[1] && dynamicNode[1].desc, '无') };
      return null;
    }

    function isMapOverviewPreviewKey(previewKey) {
      const key = toText(previewKey, '');
      if (!key) return false;
      if (key === '\u5168\u606f\u661f\u56fe\u4e3b\u753b\u5e03') return true;
      return key.includes('\u661f\u56fe') && key.includes('\u4e3b\u753b\u5e03');
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
      const worldTime = toText(deepGet(snapshot, 'rootData.world.时间._calendar', deepGet(snapshot, 'rootData.world.时间.calendar', '斗罗历未同步')), '斗罗历未同步');
      const deviation = toNumber(deepGet(snapshot, 'rootData.world.偏差值', 0), 0);
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
          ${topOrgs.map(([name, data], index) => `<div class="matrix-node ${snapshot.势力.some(([fac]) => fac === name) || index === 0 ? 'gold' : ''}"><b>${htmlEscape(name)}</b><span>${htmlEscape(`影响力 ${formatNumber(data && data.影响力)} / ${toText(data && data.状态, '正常')}`)}</span></div>`).join('')}
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
          <span class="foot-hint">本地高亮：${htmlEscape(toText(deepGet(snapshot, 'locationData.掌控势力', snapshot.势力[0] ? snapshot.势力[0][0] : '未知'), '未知'))}</span>
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

    function renderEmptyUnifiedShellCards() {
      const emptyShellCards = {
        'archive-core': ['角色', '无数据'],
        'primary-spirit': ['主武魂', '无数据'],
        'armory': ['武装', '0'],
        'vault': ['仓库', '0'],
        'social': ['社交', '0'],
        'map-current': ['当前位置', '无数据'],
        'map-locals': ['本地角色', '0'],
        'map-route': ['路线', '0'],
        'map-dynamic': ['动态', '0'],
        'world-hero': ['世界', '无数据'],
        'world-timeline': ['时间线', '0'],
        'world-alerts': ['警报', '0'],
        'org-hero': ['势力', '0'],
        'org-faction': ['阵营', '无'],
        'org-node': ['据点', '无数据'],
        'terminal-hero': ['终端', '无数据'],
        'terminal-intel': ['情报', '0'],
        'terminal-news': ['见闻', '0'],
        'terminal-bestiary': ['图鉴', '0'],
        'terminal-quest': ['任务', '0'],
      };
      Object.entries(emptyShellCards).forEach(([slot, [title, value]]) => {
        setUnifiedCardMarkup(slot, buildShellEmptyCard(title, value), { surface: 'shell', enabled: true });
      });
      setUnifiedCardMarkup('secondary-spirit', '', { surface: 'shell', enabled: false });
      setUnifiedMapStageMarkup('shell', '');
    }

    function rerenderUnifiedCardsFromLive(options = {}) {
      const snapshot = liveSnapshot || lastRenderableSnapshot;
      if (!snapshot) {
        renderEmptyUnifiedShellCards();
        return false;
      }
      const force = !!(options && options.force);
      const sectionSignatures = buildDashboardSectionRenderSignatures(snapshot);
      renderUnifiedCards(
        snapshot,
        sectionSignatures,
        force ? Object.create(null) : (lastDashboardSectionRenderSignatures || Object.create(null)),
      );
      return true;
    }

    window.__MVU_RERENDER_UNIFIED_CARDS__ = rerenderUnifiedCardsFromLive;

    function clampUnifiedMapCanvas(root = document) {
      if (!document.body || !document.body.classList.contains('mvu-layout-unified')) return;
      const scope = root && typeof root.querySelectorAll === 'function' ? root : document;
      const canvases = scope.querySelectorAll('#mvu-unified-mount .mvu-unified-map-stage .map-canvas.map-canvas-large, #mvu-unified-mount .mvu-unified-detail-host .map-canvas.map-canvas-large');
      const viewportHeight = Math.max(520, Number(window.innerHeight) || Number(document.documentElement.clientHeight) || 720);
      canvases.forEach(canvas => {
        if (!(canvas instanceof HTMLElement)) return;
        if (canvas.closest('.mvu-mobile-shell, .mvu-mobile-map-stage, .mvu-shell-map-stage')) return;
        const isDetail = !!canvas.closest('.mvu-unified-detail-host');
        const targetHeight = isDetail
          ? Math.max(240, Math.min(320, Math.round(viewportHeight * 0.38)))
          : Math.max(210, Math.min(270, Math.round(viewportHeight * 0.34)));
        canvas.style.setProperty('height', `${targetHeight}px`, 'important');
        canvas.style.setProperty('width', '100%', 'important');
        canvas.style.setProperty('min-height', '0px', 'important');
        canvas.style.setProperty('max-height', `${targetHeight}px`, 'important');
        canvas.style.setProperty('aspect-ratio', 'auto', 'important');
        canvas.style.setProperty('flex-basis', 'auto', 'important');
      });
    }

    function scheduleUnifiedMapCanvasClamp(root = document) {
      const run = () => clampUnifiedMapCanvas(root);
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(() => window.requestAnimationFrame(run));
      } else {
        window.setTimeout(run, 0);
      }
      window.setTimeout(run, 80);
      window.setTimeout(run, 220);
    }

    window.__MVU_CLAMP_UNIFIED_MAP_CANVAS__ = scheduleUnifiedMapCanvasClamp;
    window.addEventListener('resize', () => scheduleUnifiedMapCanvasClamp());

    function renderLiveCards(snapshot, precomputedSectionSignatures = null) {
      const social = deepGet(snapshot, 'activeChar.社交', {});
      const primaryFactionName = snapshot.primaryFaction ? snapshot.primaryFaction[0] : '无';
      const primaryFactionRole = snapshot.primaryFaction ? toText(deepGet(snapshot.primaryFaction[1], '身份', '无'), '无') : '未加入';
      const topRelationText = snapshot.topRelation
        ? `${shortenText(snapshot.topRelation[0], 8)} / ${toText(deepGet(snapshot.topRelation[1], '关系', '陌生'), '陌生')} · ${toNumber(deepGet(snapshot.topRelation[1], '好感度', 0), 0)}`
        : `${snapshot.relations.length} 条`;
      const latestIntelText = snapshot.pendingIntelCount
        ? `${shortenText(snapshot.pendingIntelContent, 10)} / +${snapshot.pendingIntelImpact}`
        : (snapshot.unlockedKnowledges.length ? shortenText(snapshot.unlockedKnowledges[snapshot.unlockedKnowledges.length - 1], 12) : '暂无');
      const sectionSignatures = precomputedSectionSignatures || buildDashboardSectionRenderSignatures(snapshot);
      const previousSectionSignatures = lastDashboardSectionRenderSignatures || Object.create(null);
      lastDashboardSectionRenderSignatures = sectionSignatures;

      if (sectionSignatures.archive !== previousSectionSignatures.archive) {
        setLiveHtml('[data-preview="生命图谱详细页"].mvu-panel.core-card', buildArchiveCoreCard(snapshot));
        setLiveHtml('[data-preview="武装工坊详细页"].mvu-module-card', buildArmoryCard(snapshot));
        setLiveHtml('[data-preview="储物仓库详细页"].mvu-module-card', buildVaultCard(snapshot));
        renderSpiritStrips(snapshot);
      }

      if (sectionSignatures.map !== previousSectionSignatures.map) {
        if (typeof window.__sheepMapResync === 'function') {
          try {
            window.__sheepMapResync({ center: false, syncVisual: false });
          } catch (err) {}
          scheduleUnifiedMapCanvasClamp();
        }
      }

      if (sectionSignatures.social !== previousSectionSignatures.social) {
        setLiveText('.archive-social-card .social-chip[data-preview="社会档案详细页"] span', `${toText(social.名望等级, toText(social.名望等级, '籍籍无名'))} / ${formatNumber(social.声望)}`);
        setLiveText('.archive-social-card .social-chip[data-preview="所属势力详细页"] span', `${shortenText(primaryFactionName, 8)} / ${shortenText(primaryFactionRole, 8)}`);
        setLiveText('.archive-social-card .social-chip[data-preview="人物关系详细页"] span', topRelationText);
        setLiveText('.archive-social-card .social-chip[data-preview="情报库详细页"] span', `${snapshot.unlockedKnowledges.length} / ${latestIntelText}`);
      }

      if (sectionSignatures.world !== previousSectionSignatures.world) {
        getLiveUiElements('[data-preview="世界状态总览"].hero-card').forEach(el => {
          el.classList.remove('clickable');
          el.removeAttribute('data-preview');
          setLiveNodeHtml(el, buildWorldHeroCard(snapshot));
        });
        getLiveUiElements('[data-preview="编年史档案"].mvu-simple-card').forEach(el => {
          el.style.overflow = 'hidden';
          el.style.flex = '1.2 1 0';
          setLiveNodeHtml(el, buildSimpleCard('编年史', null, [
            { label: '最近事件', value: snapshot.latestTimeline ? toText(deepGet(snapshot.latestTimeline[1], '事件', snapshot.latestTimeline[0]), snapshot.latestTimeline[0]) : '暂无' },
            { label: '推进状态', value: snapshot.latestTimeline ? `${toText(deepGet(snapshot.latestTimeline[1], '状态', 'pending'), 'pending')} / Tick ${toText(deepGet(snapshot.latestTimeline[1], '触发tick', 0), '0')}` : '暂无时间线' }
          ]));
          const simpleList = el.querySelector('.simple-list');
          if (simpleList) {
            simpleList.style.overflow = 'hidden';
            simpleList.style.maxHeight = 'none';
          }
        });
        setLiveHtml('[data-preview="拍卖与警报"].mvu-simple-card', buildSimpleCard('拍卖行与警报', null, [
          { label: '拍卖行', value: `${toText(deepGet(snapshot, 'rootData.world.拍卖.状态', '休市'), '休市')} / ${toText(deepGet(snapshot, 'rootData.world.拍卖.地点', '无'), '无')}` },
          { label: '生态警报', value: snapshot.worldAlert }
        ]));
        setLiveHtml('[data-preview="势力矩阵总览"].hero-card', buildOrgHeroCard(snapshot));
        setLiveHtml('[data-preview="我的阵营详情"].mvu-simple-card', buildSimpleCard('我的阵营', null, [
          { label: '当前所属', value: snapshot.势力[0] ? snapshot.势力[0][0] : '无' },
          { label: '身份', value: snapshot.势力[0] ? toText(deepGet(snapshot.势力[0][1], '身份', '无'), '无') : '未加入' }
        ]));
        setLiveHtml('[data-preview="本地据点详情"].mvu-simple-card', buildSimpleCard('本地据点', null, [
          { label: '掌控势力', value: toText(deepGet(snapshot, 'locationData.掌控势力', '未知'), '未知') },
          { label: '经济状况', value: `${toText(deepGet(snapshot, 'locationData.经济状况', '未知'), '未知')} / ${toText(deepGet(snapshot, 'locationData.守护军团', '守护军团未知'), '守护军团未知')}` }
        ]));
      }

      if (sectionSignatures.terminal !== previousSectionSignatures.terminal) {
        setLiveHtml('[data-preview="系统播报与日志"].terminal-hero-card', buildTerminalHeroCard(snapshot));
        setLiveHtml('[data-preview="操作总线"].terminal-side-card, [data-preview="操作总线"].mvu-simple-card, [data-preview="操作总线"].simple-card', `
        <div class="simple-head"><div class="simple-title">近期安排</div></div>
        <div class="simple-list">
          ${(() => { const planSummary = buildRecentPlanSummary(snapshot, { worldLimit: 1, recordLimit: 1 }); return `
          <div class="simple-row"><b>世界安排</b><span>${htmlEscape(planSummary.worldPlans[0] ? planSummary.worldPlans[0].desc : '暂无')}</span></div>
          <div class="simple-row"><b>个人待办</b><span>${htmlEscape(planSummary.personalPlans[0] ? planSummary.personalPlans[0].desc : '暂无')}</span></div>
          `; })()}
        </div>
      `);
        setLiveHtml('[data-preview="试炼与情报"].terminal-side-card, [data-preview="试炼与情报"].mvu-simple-card, [data-preview="试炼与情报"].simple-card', `
        <div class="simple-head"><div class="simple-title">试炼与情报</div></div>
        <div class="simple-list">
          <div class="simple-row"><b>试炼入口</b><span>${htmlEscape(snapshot.inventoryEntries.some(([name]) => /门票|魂灵塔/.test(name)) ? '升灵台 / 魂灵塔 / 狩猎' : '当前无门票，仅常规狩猎')}</span></div>
          <div class="simple-row"><b>情报状态</b><span>${htmlEscape(`已掌握 ${snapshot.unlockedKnowledges.length} 条 / 新线索 ${snapshot.pendingIntelCount} 条`)}</span></div>
          <div class="simple-row"><b>深渊击杀</b><span>${htmlEscape(toText(deepGet(snapshot, 'activeChar.深渊击杀请求.击杀级别', '无'), '无') !== '无' ? `${toText(deepGet(snapshot, 'activeChar.深渊击杀请求.击杀级别', '无'), '无')} × ${toNumber(deepGet(snapshot, 'activeChar.深渊击杀请求.数量', 1), 1)}` : '暂无待结算')}</span></div>
        </div>
      `);
        setLiveHtml('[data-preview="近期见闻"].terminal-side-card, [data-preview="近期见闻"].mvu-simple-card, [data-preview="近期见闻"].simple-card', `
        <div class="simple-head"><div class="simple-title">近期见闻</div></div>
        <div class="simple-list">
          ${(() => { const newsSummary = buildRecentNewsSummary(snapshot, { seqLimit: 1, intelLimit: 1 }); return `
          <div class="simple-row"><b>全局见闻</b><span>${htmlEscape(newsSummary.globalNews[0] ? newsSummary.globalNews[0].desc : '暂无')}</span></div>
          <div class="simple-row"><b>个人见闻</b><span>${htmlEscape(newsSummary.personalNews[0] ? newsSummary.personalNews[0].desc : '暂无')}</span></div>
          `; })()}
        </div>
      `);
        setLiveHtml('[data-preview="怪物图鉴"].terminal-side-card, [data-preview="怪物图鉴"].mvu-simple-card, [data-preview="怪物图鉴"].simple-card', `
        <div class="simple-head"><div class="simple-title">怪物图鉴</div></div>
        <div class="simple-list">
          <div class="simple-row"><b>已记录</b><span>${htmlEscape(`${snapshot.bestiaryEntries.length} 种`)}</span></div>
          <div class="simple-row"><b>最近条目</b><span>${htmlEscape(snapshot.bestiaryEntries.slice(0, 2).map(([name]) => name).join(' / ') || '暂无')}</span></div>
          <div class="simple-row"><b>图鉴状态</b><span>${htmlEscape(snapshot.bestiaryEntries.length ? '探索推进中' : '等待首次遭遇')}</span></div>
        </div>
      `);
        const questRecords = (snapshot.recordEntries || []).filter(([, item]) => item && typeof item === 'object' && (Object.prototype.hasOwnProperty.call(item, '状态') || Object.prototype.hasOwnProperty.call(item, '目标进度') || Object.prototype.hasOwnProperty.call(item, '奖励币') || Object.prototype.hasOwnProperty.call(item, '奖励声望')));
        const activeQuestEntry = questRecords.find(([, item]) => !['已完成', '已放弃', '失败', '已失败'].includes(toText(item && item['状态'], '进行中'))) || questRecords[0] || null;
        const activeQuestName = activeQuestEntry ? activeQuestEntry[0] : '';
        const activeQuestState = activeQuestEntry ? toText(activeQuestEntry[1] && activeQuestEntry[1]['状态'], '进行中') : '暂无';
        const questBoardEntries = safeEntries(deepGet(snapshot, 'rootData.world.委托板', {})).filter(([, item]) => item && typeof item === 'object');
        const openBoardCount = questBoardEntries.filter(([, item]) => toText(item && item['状态'], '待接取') === '待接取').length;
        setLiveHtml('[data-preview="任务界面"].terminal-side-card, [data-preview="任务界面"].mvu-simple-card, [data-preview="任务界面"].simple-card', `
          <div class="simple-head"><div class="simple-title">任务界面</div></div>
          <div class="simple-list">
            <div class="simple-row"><b>我的任务</b><span>${htmlEscape(questRecords.length ? `${questRecords.length} 条 / 当前 ${activeQuestName || '已归档'}` : '暂无任务')}</span></div>
            <div class="simple-row"><b>委托板</b><span>${htmlEscape(questBoardEntries.length ? `${questBoardEntries.length} 条 / 待接取 ${openBoardCount}` : '暂无委托')}</span></div>
            <div class="simple-row"><b>当前状态</b><span>${htmlEscape(activeQuestState)}</span></div>
          </div>
        `);
      }
      renderUnifiedCards(snapshot, sectionSignatures, previousSectionSignatures);
    }

    function buildLiveArchiveModal(previewKey) {
      if (!liveSnapshot) return null;
      const snapshot = liveSnapshot;
      const tradeLaunchOptions = buildMapTradeModalOptions(snapshot, mapDispatchContext);
      const stat = deepGet(snapshot, 'activeChar.属性', {});
      const social = deepGet(snapshot, 'activeChar.社交', {});
      const status = deepGet(snapshot, 'activeChar.状态', {});
      const wealth = deepGet(snapshot, 'activeChar.财富', {});
      const 穿搭数据 = deepGet(snapshot, 'activeChar.穿搭', {});
      const wardrobeEntries = safeEntries(deepGet(snapshot, 'activeChar.穿搭.衣柜', {}));
      const armor = deepGet(snapshot, 'activeChar.装备.斗铠', {});
      const mech = deepGet(snapshot, 'activeChar.装备.机甲', {});
      const jobs = safeEntries(deepGet(snapshot, 'activeChar.职业', {}));
      if (isMapOverviewPreviewKey(previewKey)) {
        return {
          title: `${'\u5168\u606f\u661f\u56fe'} / ${getMapDisplayName(snapshot)}`,
          summary: '',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full mvu-map-detail-card">
                <div class="mvu-unified-map-stage mvu-archive-map-stage" data-mvu-map-stage="detail"></div>
              </div>
            </div>
          `,
          onMount: mountEl => {
            const stage = mountEl && mountEl.querySelector ? mountEl.querySelector('[data-mvu-map-stage="detail"]') : null;
            if (stage) setLiveNodeHtml(stage, '');
            if (typeof window.__sheepMapResync === 'function') {
              window.setTimeout(() => {
                try { window.__sheepMapResync({ center: false, syncVisual: false }); } catch (err) {}
                scheduleUnifiedMapCanvasClamp();
              }, 0);
            }
            return null;
          }
        };
      }
      if (String(previewKey || '').startsWith(SKILL_DESIGNER_PREVIEW_PREFIX)) {
        const previewMeta = parseSkillDesignerPreviewKey(previewKey) || { path: [], label: '技能', category: '技能', scope: 'skill' };
        const skillSource = previewMeta.path.length ? (deepGet(snapshot.rootData, previewMeta.path, {}) || {}) : {};
        const cachedDesignerDraft = readCachedSkillDesignerDraft(previewKey);
        const rawDesignerDraft = cachedDesignerDraft || readSkillDesignerDraft(skillSource, previewMeta.label);
        const fusionDraftSeed = getSkillDesignerFusionDraftSeed(snapshot, previewMeta, rawDesignerDraft);
        const designerDraft = buildSkillDesignerFormStateFromDraft(
          { ...rawDesignerDraft, ...fusionDraftSeed },
          previewMeta
        );
        const pathTail = formatSkillDesignerWritebackLabel(previewMeta);
        const scopeLabels = getSkillDesignerScopeLabels(previewMeta);
        const recommendedAttrs = new Set(normalizeSkillDesignerArray(SKILL_DESIGNER_ATTRIBUTE_HINTS_BY_TYPE[designerDraft.type] || []));
        const isFusionDesigner = previewMeta.scope === 'fusion_skill';
        const { charData: fusionCharData } = getSkillDesignerCharByPreviewPath(snapshot.rootData, previewMeta);
        const fusionSpiritOptions = isFusionDesigner ? getSkillDesignerSpiritNameOptions(fusionCharData) : [];
        const fusionModeOptions = isFusionDesigner
          ? [
              { value: 'partner', label: '双人/多人融合' },
              ...(fusionSpiritOptions.length >= 2 || designerDraft.fusionMode === 'self'
                ? [{ value: 'self', label: '自体融合' }]
                : []),
            ]
          : [];
        const fusionStructureSection = isFusionDesigner ? `
                    <section class=\"mvu-editor-section skill-designer-fusion-section\">
                      <div class=\"mvu-editor-section-title\">融合对象</div>
                      <div class=\"mvu-editor-field-grid skill-designer-fusion-mode-grid\">
                        <label class=\"mvu-editor-field\">
                          <span class=\"mvu-editor-label\">模式</span>
                          <select class=\"mvu-editor-select\" data-skill-designer-field=\"fusionMode\" data-skill-designer-disableable>
                            ${buildSkillDesignerSelectOptions(fusionModeOptions, designerDraft.fusionMode, '')}
                          </select>
                        </label>
                      </div>
                      <div class=\"skill-designer-fusion-participant-list\" data-skill-designer-fusion-participants>
                        ${buildSkillDesignerFusionParticipantRows(designerDraft.fusionParticipants, snapshot.rootData, previewMeta)}
                      </div>
                      <div class=\"mvu-editor-actions skill-designer-fusion-actions\"${designerDraft.fusionMode === 'self' ? ' hidden' : ''}>
                        <button type=\"button\" class=\"tag-chip\" data-skill-designer-add-fusion-participant data-skill-designer-disableable>新增对象</button>
                      </div>
                    </section>
                  ` : '';
        return {
          title: `${scopeLabels.studioTitle} / ${designerDraft.name}`,
          summary: '',
          onMount: mountEl => {
            const form = mountEl.querySelector('[data-skill-designer-form]');
            const refreshBtn = mountEl.querySelector('[data-skill-designer-refresh]');
            const primaryMainInput = mountEl.querySelector('[data-skill-designer-field=\"primaryMain\"]');
            const primarySubInput = mountEl.querySelector('[data-skill-designer-field=\"primarySub\"]');
            const typeInput = mountEl.querySelector('[data-skill-designer-field=\"type\"]');
            const deliveryFormInput = mountEl.querySelector('[data-skill-designer-field=\"deliveryForm\"]');
            const fusionModeInput = mountEl.querySelector('[data-skill-designer-field=\"fusionMode\"]');
            const fusionParticipantList = mountEl.querySelector('[data-skill-designer-fusion-participants]');
            const addFusionParticipantBtn = mountEl.querySelector('[data-skill-designer-add-fusion-participant]');
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
              const formState = readSkillDesignerFormState(mountEl, previewMeta);
              const fusionSeed = isFusionDesigner ? getSkillDesignerFusionDraftSeed(snapshot, previewMeta, formState) : {};
              const nextDraft = buildSkillDesignerFormStateFromDraft({ ...formState, ...fusionSeed }, previewMeta);
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

            const syncFusionFields = () => {
              if (!fusionModeInput) return;
              const formState = readSkillDesignerFormState(mountEl, previewMeta);
              const fusionSeed = getSkillDesignerFusionDraftSeed(snapshot, previewMeta, formState);
              if (fusionParticipantList) {
                fusionParticipantList.innerHTML = buildSkillDesignerFusionParticipantRows(fusionSeed.fusionParticipants, snapshot.rootData, previewMeta);
              }
              if (addFusionParticipantBtn) {
                const actions = addFusionParticipantBtn.closest('.skill-designer-fusion-actions');
                if (actions) actions.hidden = fusionSeed.fusionMode === 'self';
              }
              return buildSkillDesignerFormStateFromDraft({ ...formState, ...fusionSeed }, previewMeta);
            };

            const applyFusionParticipants = participants => {
              if (!fusionModeInput || !fusionParticipantList) return null;
              const formState = readSkillDesignerFormState(mountEl, previewMeta);
              const fusionSeed = getSkillDesignerFusionDraftSeed(snapshot, previewMeta, {
                ...formState,
                fusionMode: fusionModeInput.value,
                fusionParticipants: participants,
              });
              fusionParticipantList.innerHTML = buildSkillDesignerFusionParticipantRows(fusionSeed.fusionParticipants, snapshot.rootData, previewMeta);
              if (addFusionParticipantBtn) {
                const actions = addFusionParticipantBtn.closest('.skill-designer-fusion-actions');
                if (actions) actions.hidden = fusionSeed.fusionMode === 'self';
              }
              const nextDraft = buildSkillDesignerFormStateFromDraft({ ...formState, ...fusionSeed }, previewMeta);
              writeCachedSkillDesignerDraft(previewKey, nextDraft);
              refreshPreview(nextDraft);
              return nextDraft;
            };

            const handleFusionAdd = () => {
              if (!fusionModeInput) return;
              fusionModeInput.value = 'partner';
              const currentDraft = syncDraftCache();
              const nextParticipant = createSkillDesignerDefaultPartnerParticipant(
                snapshot.rootData,
                previewMeta,
                currentDraft.fusionParticipants.map(participant => participant.charKey),
              );
              applyFusionParticipants([...currentDraft.fusionParticipants, nextParticipant]);
            };

            const handleFusionRemove = button => {
              const row = button ? button.closest('[data-fusion-participant-row]') : null;
              if (!row) return;
              const rows = Array.from(mountEl.querySelectorAll('[data-fusion-participant-row]'));
              const removeIndex = rows.indexOf(row);
              const currentDraft = syncDraftCache();
              const nextParticipants = currentDraft.fusionParticipants.filter((participant, index) => index !== removeIndex);
              applyFusionParticipants(nextParticipants);
            };

            const refreshPreview = (draftOverride = null) => {
              const formState = draftOverride || syncDraftCache();
              const previewMap = {
                fusion: buildSkillDesignerFusionSummary(formState) || '未设置',
                mechanic: buildSkillDesignerMechanicSummary(formState) || '未设置',
                mechanicParams: buildSkillDesignerMechanicParamSummary(formState) || '未设置',
                execution: buildSkillDesignerExecutionSummary(formState) || '未设置',
                progress: buildSkillDesignerArtProgressSummary(formState) || '未设置',
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
              syncFusionFields();
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
                if (!destroyed) rerenderDetailSurface(currentUnifiedPreviewKey || currentModalPreviewKey, { surface: currentUnifiedPreviewKey ? 'unified' : 'modal', force: true });
              }, '已经重新读取当前技能。');
            };

            const handleSubmit = async event => {
              event.preventDefault();
              await runDesignerTask(async () => {
                if (!Array.isArray(previewMeta.path) || !previewMeta.path.length) throw new Error('当前技能缺少可写回路径。');
                const formState = readSkillDesignerFormState(mountEl, previewMeta);
                const nextSkill = buildSkillDesignerUpdatedSkill(skillSource, formState, previewMeta);
                await replaceStatDataByEditor(buildSkillDesignerWriteUpdates(previewMeta, nextSkill, snapshot.rootData));
                clearCachedSkillDesignerDraft(previewKey);
                await refreshLiveSnapshot({ force: true });
                if (!destroyed) rerenderDetailSurface(currentUnifiedPreviewKey || currentModalPreviewKey, { surface: currentUnifiedPreviewKey ? 'unified' : 'modal', force: true });
              }, `已更新${previewMeta.label || '技能'}。`);
            };

            const handleChange = event => {
              const target = event && event.target instanceof HTMLElement ? event.target : null;
              if (event && event.target === primaryMainInput) {
                rebuildPrimarySubOptions();
                rebuildSecondaryOptions();
              }
              if (event && event.target === typeInput) {
                rebuildDeliveryOptions();
              }
              const shouldRebuildFusion = !!(target && (
                target === fusionModeInput
                || target.matches('[data-skill-designer-fusion-char]')
              ));
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
              const fusionDraft = shouldRebuildFusion ? syncFusionFields() : null;
              refreshPreview(fusionDraft);
            };

            const handleInput = () => {
              syncChipState();
              refreshPreview();
            };

            const handleClick = event => {
              const target = event && event.target instanceof HTMLElement ? event.target : null;
              const addButton = target ? target.closest('[data-skill-designer-add-fusion-participant]') : null;
              if (addButton) {
                event.preventDefault();
                handleFusionAdd();
                return;
              }
              const removeButton = target ? target.closest('[data-skill-designer-remove-fusion-participant]') : null;
              if (removeButton) {
                event.preventDefault();
                handleFusionRemove(removeButton);
              }
            };

            handleInteractiveRefresh();
            if (form) form.addEventListener('submit', handleSubmit);
            if (refreshBtn) refreshBtn.addEventListener('click', handleRefresh);
            mountEl.addEventListener('change', handleChange);
            mountEl.addEventListener('input', handleInput);
            mountEl.addEventListener('click', handleClick);

            return {
              destroy() {
                destroyed = true;
                if (form) form.removeEventListener('submit', handleSubmit);
                if (refreshBtn) refreshBtn.removeEventListener('click', handleRefresh);
                mountEl.removeEventListener('change', handleChange);
                mountEl.removeEventListener('input', handleInput);
                mountEl.removeEventListener('click', handleClick);
              }
            };
          },
          body: `
            <div class=\"archive-modal-grid skill-designer-layout skill-designer-shell\">
              <div class=\"archive-card full skill-designer-anchor-card\">
                <div class=\"archive-card-head\">
                  <div class=\"archive-card-title\">${htmlEscape(scopeLabels.anchorTitle)}</div>
                  <span class=\"state-tag live\">${htmlEscape(designerDraft.typeDisplay || designerDraft.type || previewMeta.category || '技能')}</span>
                </div>
                ${makeTileGrid([
                  { label: scopeLabels.nameCardLabel, value: designerDraft.name },
                  { label: scopeLabels.typeCardLabel, value: designerDraft.typeDisplay || designerDraft.type },
                  { label: scopeLabels.targetLabel, value: designerDraft.target },
                  { label: '写回位置', value: pathTail }
                ], 'two')}
              </div>

              <form class=\"archive-card full mvu-editor-form skill-designer-form skill-designer-form-card\" data-skill-designer-form>
                <div class=\"archive-card-head\">
                  <div class=\"archive-card-title\">${htmlEscape(scopeLabels.parameterTitle)}</div>
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
                        <span class=\"mvu-editor-label\">${htmlEscape(scopeLabels.nameFieldLabel)}</span>
                        <input class=\"mvu-editor-input\" type=\"text\" value=\"${escapeHtmlAttr(designerDraft.name)}\" data-skill-designer-field=\"name\" data-skill-designer-disableable />
                      </label>
                      <label class=\"mvu-editor-field\">
                        <span class=\"mvu-editor-label\">${htmlEscape(scopeLabels.targetLabel)}</span>
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

                  ${fusionStructureSection}

                  ${previewMeta.scope === 'art' ? `
                    <section class=\"mvu-editor-section\">
                      <div class=\"mvu-editor-section-title\">功法进度</div>
                      <div class=\"mvu-editor-field-grid\">
                        <label class=\"mvu-editor-field\">
                          <span class=\"mvu-editor-label\">境界</span>
                          <input class=\"mvu-editor-input\" type=\"text\" value=\"${escapeHtmlAttr(designerDraft.artStage || '未入门')}\" data-skill-designer-field=\"artStage\" data-skill-designer-disableable />
                        </label>
                        <label class=\"mvu-editor-field\">
                          <span class=\"mvu-editor-label\">等级</span>
                          <input class=\"mvu-editor-input\" type=\"number\" min=\"0\" step=\"1\" value=\"${escapeHtmlAttr(String(Math.max(0, toNumber(designerDraft.artLevel, 0))))}\" data-skill-designer-field=\"artLevel\" data-skill-designer-disableable />
                        </label>
                        <label class=\"mvu-editor-field\">
                          <span class=\"mvu-editor-label\">熟练度</span>
                          <input class=\"mvu-editor-input\" type=\"number\" min=\"0\" step=\"1\" value=\"${escapeHtmlAttr(String(Math.max(0, toNumber(designerDraft.artExp, 0))))}\" data-skill-designer-field=\"artExp\" data-skill-designer-disableable />
                        </label>
                      </div>
                    </section>
                  ` : ''}

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
                        <span class=\"mvu-editor-label\">${htmlEscape(scopeLabels.deliveryLabel)}</span>
                        <select class=\"mvu-editor-select\" data-skill-designer-field=\"deliveryForm\" data-skill-designer-disableable>
                          ${buildSkillDesignerSelectOptions(getSkillDesignerDeliveryOptions(designerDraft.type), designerDraft.deliveryForm, '未设置')}
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
                    </div>
                  </section>

                  <section class=\"mvu-editor-section\">
                    <div class=\"mvu-editor-section-title\">属性设计</div>
                    <div class=\"skill-designer-subsection\">
                      <div class=\"mvu-editor-label\">附带属性</div>
                      <div class=\"skill-designer-chip-grid\" data-skill-designer-attribute-grid>
                        ${buildSkillDesignerCheckChipList(SKILL_DESIGNER_ATTRIBUTE_OPTIONS, designerDraft.attachedAttributes, 'skill-attribute', option => recommendedAttrs.has(option) ? 'recommended' : '')}
                      </div>
                    </div>
                  </section>

                  <section class=\"mvu-editor-section\">
                    <div class=\"mvu-editor-section-title\">文本描述</div>
                    <div class=\"mvu-editor-field-grid\">
                      <label class=\"mvu-editor-field mvu-editor-field-wide\">
                        <span class=\"mvu-editor-label\">${htmlEscape(scopeLabels.visualLabel)}</span>
                        <textarea class=\"mvu-editor-textarea\" data-skill-designer-field=\"visualDesc\" data-skill-designer-disableable>${htmlEscape(designerDraft.visualDesc)}</textarea>
                      </label>
                      <label class=\"mvu-editor-field mvu-editor-field-wide\">
                        <span class=\"mvu-editor-label\">${htmlEscape(scopeLabels.effectLabel)}</span>
                        <textarea class=\"mvu-editor-textarea\" data-skill-designer-field=\"effectDesc\" data-skill-designer-disableable>${htmlEscape(designerDraft.effectDesc)}</textarea>
                      </label>
                    </div>
                  </section>
                </div>
              </form>

              <div class=\"archive-card full skill-designer-summary-card\">
                <div class=\"archive-card-head\"><div class=\"archive-card-title\">${htmlEscape(scopeLabels.summaryTitle)}</div></div>
                <div class=\"skill-designer-preview-stack skill-designer-summary-list\">
                  ${isFusionDesigner
                    ? `<div class=\"skill-designer-summary-row\"><em>融合对象</em><span data-skill-designer-preview=\"fusion\">${htmlEscape(buildSkillDesignerFusionSummary(designerDraft) || '未设置')}</span></div>`
                    : ''}
                  <div class=\"skill-designer-summary-row\"><em>机制组合</em><span data-skill-designer-preview=\"mechanic\">${htmlEscape(buildSkillDesignerMechanicSummary(designerDraft) || '未设置')}</span></div>
                  <div class=\"skill-designer-summary-row\"><em>机制参数</em><span data-skill-designer-preview=\"mechanicParams\">${htmlEscape(buildSkillDesignerMechanicParamSummary(designerDraft) || '未设置')}</span></div>
                  <div class=\"skill-designer-summary-row\"><em>执行摘要</em><span data-skill-designer-preview=\"execution\">${htmlEscape(buildSkillDesignerExecutionSummary(designerDraft) || '未设置')}</span></div>
                  ${previewMeta.scope === 'art'
                    ? `<div class=\"skill-designer-summary-row\"><em>功法进度</em><span data-skill-designer-preview=\"progress\">${htmlEscape(buildSkillDesignerArtProgressSummary(designerDraft) || '未设置')}</span></div>`
                    : ''}
                  <div class=\"skill-designer-summary-row\"><em>附带属性</em><span data-skill-designer-preview=\"attribute\">${htmlEscape(buildSkillDesignerAttributeSummary(designerDraft) || '未设置')}</span></div>
                  <div class=\"skill-designer-summary-row\"><em>最终摘要</em><span data-skill-designer-preview=\"summary\">${htmlEscape(buildSkillDesignerCompactSummary(designerDraft) || '未设置')}</span></div>
                  <div class=\"skill-designer-summary-row\"><em>标签</em><span data-skill-designer-preview=\"tags\">${htmlEscape((designerDraft.tags || []).join(' / ') || '无')}</span></div>
                </div>
              </div>
            </div>
          `
        };
      }

      if (previewKey === '角色切换器') {
        const playerName = toText(deepGet(snapshot, 'rootData.sys.玩家名', ''), '');
        const currentCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
        const charEntries = sortCharacterEntries(safeEntries(deepGet(snapshot, 'rootData.char', {})), { playerName, currentName: snapshot.activeName });
        const switchCards = charEntries.length
          ? charEntries.map(([name, char]) => {
              const displayName = toText(char && (char.name || deepGet(char, 'base.name', '')), name);
              const activeDisplayName = toText(snapshot.activeName, '');
              const isCurrent = (currentCharKey && name === currentCharKey) || (!currentCharKey && !!activeDisplayName && displayName === activeDisplayName);
              const isPlayer = isPlayerCharacterEntry(name, char, playerName);
              const lvText = formatCultivationLevelBadge(deepGet(char, '属性.等级', 0), '0');
              const identityText = toText(deepGet(char, '社交.主身份', deepGet(char, 'base.identity', '无')), '无');
              const locText = toText(deepGet(char, '状态.位置', '未知地点'), '未知地点').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '');
              const actionText = toText(deepGet(char, '状态.行动', '日常'), '日常');
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

      if (previewKey === PRIVATE_ARCHIVE_PREVIEW_KEY) {
        if (!canOpenPrivateArchive(snapshot)) return null;
        const nsfwPath = getActiveNsfwPath(snapshot);
        const nsfw = getActiveNsfwData(snapshot);
        const bodyPartEntries = safeEntries(deepGet(nsfw, '身体部位', {}));

        return {
          title: '私密档案',
          onMount: (modalBody) => {
            const panel = modalBody.closest('.mvu-modal-panel');
            if (panel) {
              panel.classList.add('nsfw-theme-active');
              const observer = new MutationObserver(() => {
                if (!modalBody.querySelector('.nsfw-modal-grid')) {
                  panel.classList.remove('nsfw-theme-active');
                  observer.disconnect();
                }
              });
              observer.observe(modalBody, { childList: true });
            }
          },
          body: `
            <div class="nsfw-modal-grid">
              
              <!-- 1. 核心欲念 -->
              <div class="nsfw-theme-card">
                <div class="nsfw-theme-head">
                  <div class="nsfw-theme-title">💕 核心欲念</div>
                </div>
                <div class="nsfw-theme-body">
                  <div class="nsfw-progress-container">
                    <div class="nsfw-progress-label">
                      <span>发情度</span>
                      <span>${makeInlineEditableValue(toText(nsfw.发情度, '0'), { path: [...nsfwPath, '发情度'], kind: 'number' })} / 100</span>
                    </div>
                    <div class="nsfw-progress-track arousal">
                      <div class="nsfw-fill-arousal" style="width: ${Math.min(100, Math.max(0, toNumber(nsfw.发情度, 0)))}%;"></div>
                    </div>
                  </div>
                  <div class="nsfw-progress-container">
                    <div class="nsfw-progress-label">
                      <span>开发度</span>
                      <span>${makeInlineEditableValue(toText(nsfw.开发度, '0'), { path: [...nsfwPath, '开发度'], kind: 'number' })} / 100</span>
                    </div>
                    <div class="nsfw-progress-track dev">
                      <div class="nsfw-fill-dev" style="width: ${Math.min(100, Math.max(0, toNumber(nsfw.开发度, 0)))}%;"></div>
                    </div>
                  </div>
                  <div class="identity-growth-grid" style="grid-template-columns: 1fr;">
                    <div class="nsfw-meta-item">
                      <b>敏感度基础值</b>
                      <span>${makeInlineEditableValue(toText(nsfw.敏感度, '10'), { path: [...nsfwPath, '敏感度'], kind: 'number' })}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 2. 肉体密码 & 着装 -->
              <div class="nsfw-theme-card">
                <div class="nsfw-theme-head">
                  <div class="nsfw-theme-title">👙 肉体密码与私密着装</div>
                </div>
                <div class="nsfw-theme-body">
                  <div class="identity-growth-grid" style="grid-template-columns: 1fr 1fr;">
                    <div class="nsfw-meta-item">
                      <b>罩杯</b>
                      <span>${makeInlineEditableValue(toText(deepGet(nsfw, '身材数据.罩杯'), '未知'), { path: [...nsfwPath, '身材数据', '罩杯'], kind: 'string' })}</span>
                    </div>
                    <div class="nsfw-meta-item">
                      <b>三围 (胸/腰/臀)</b>
                      <span>
                        ${makeInlineEditableValue(toText(deepGet(nsfw, '身材数据.胸围'), '0'), { path: [...nsfwPath, '身材数据', '胸围'], kind: 'number' })} /
                        ${makeInlineEditableValue(toText(deepGet(nsfw, '身材数据.腰围'), '0'), { path: [...nsfwPath, '身材数据', '腰围'], kind: 'number' })} /
                        ${makeInlineEditableValue(toText(deepGet(nsfw, '身材数据.臀围'), '0'), { path: [...nsfwPath, '身材数据', '臀围'], kind: 'number' })}
                      </span>
                    </div>
                    <div class="nsfw-meta-item">
                      <b>内衣</b>
                      <span>${makeInlineEditableValue(toText(deepGet(nsfw, '贴身衣物.内衣'), '未知'), { path: [...nsfwPath, '贴身衣物', '内衣'], kind: 'string' })}</span>
                    </div>
                    <div class="nsfw-meta-item">
                      <b>内裤</b>
                      <span>${makeInlineEditableValue(toText(deepGet(nsfw, '贴身衣物.内裤'), '未知'), { path: [...nsfwPath, '贴身衣物', '内裤'], kind: 'string' })}</span>
                    </div>
                  </div>
                  <div class="nsfw-meta-item" style="margin-top:8px;">
                    <b>身材描述</b>
                    <span class="nsfw-text-wrap">${makeInlineEditableValue(toText(deepGet(nsfw, '身材数据.身材描述'), '无'), { path: [...nsfwPath, '身材数据', '身材描述'], kind: 'string' })}</span>
                  </div>
                </div>
              </div>

              <!-- 3. 生理节律 -->
              <div class="nsfw-theme-card">
                <div class="nsfw-theme-head">
                  <div class="nsfw-theme-title">🩸 生理节律</div>
                </div>
                <div class="nsfw-theme-body">
                  <div class="identity-growth-grid" style="grid-template-columns: 1fr 1fr;">
                    <div class="nsfw-meta-item">
                      <b>当前生理阶段</b>
                      <span class="nsfw-highlight-red">${makeInlineEditableValue(toText(nsfw._生理阶段, '安全期'), { path: [...nsfwPath, '_生理阶段'], kind: 'string' })}</span>
                    </div>
                    <div class="nsfw-meta-item">
                      <b>是否初潮</b>
                      <span>${makeInlineEditableValue(nsfw._已来初潮 ? '已初潮' : '未初潮', { path: [...nsfwPath, '_已来初潮'], kind: 'boolean' })}</span>
                    </div>
                    <div class="nsfw-meta-item">
                      <b>受孕节点</b>
                      <span>${makeInlineEditableValue(String(toNumber(nsfw.受孕tick, -1)), { path: [...nsfwPath, '受孕tick'], kind: 'number' })}</span>
                    </div>
                    <div class="nsfw-meta-item">
                      <b>当前怀孕天数</b>
                      <span>${makeInlineEditableValue(String(toNumber(nsfw._怀孕天数, 0)), { path: [...nsfwPath, '_怀孕天数'], kind: 'number' })}</span>
                    </div>
                    <div class="nsfw-meta-item" style="grid-column: span 2;">
                      <b>孕父</b>
                      <span>${makeInlineEditableValue(toText(nsfw.受孕对象, '无'), { path: [...nsfwPath, '受孕对象'], kind: 'string' })}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 4. 堕落履历 -->
              <div class="nsfw-theme-card">
                <div class="nsfw-theme-head">
                  <div class="nsfw-theme-title">📈 开发履历</div>
                </div>
                <div class="nsfw-theme-body">
                  <div class="identity-growth-grid" style="grid-template-columns: repeat(3, 1fr);">
                    ${['高潮', '颜射', '内射', '吞精', '宠物扮演', '自慰', '性交', '手交', '足交', '口交', '素股', '发交', 'SM', 'COSPLAY'].map(exp => `
                      <div class="nsfw-meta-item">
                        <b>${exp}</b>
                        <span>${makeInlineEditableValue(String(toNumber(deepGet(nsfw, ['经历次数', exp]), 0)), { path: [...nsfwPath, '经历次数', exp], kind: 'number' })}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- 5. 深层性癖 -->
              <div class="nsfw-theme-card">
                <div class="nsfw-theme-head">
                  <div class="nsfw-theme-title">😈 深层性癖</div>
                </div>
                <div class="nsfw-theme-body">
                  <div style="margin-bottom: 8px;">
                    <b style="font-size: 11px; color: #ffb3c1; display: block; margin-bottom: 6px;">癖好</b>
                    <div style="display:flex; flex-wrap:wrap; gap:6px;">
                      ${(Array.isArray(nsfw.癖好) ? nsfw.癖好 : []).map((f, i) => `
                        <span class="nsfw-tag">${makeInlineEditableValue(toText(f), { path: [...nsfwPath, '癖好', i], kind: 'string' })}</span>
                      `).join('')}
                    </div>
                  </div>
                  <div>
                    <b style="font-size: 11px; color: #ffb3c1; display: block; margin-bottom: 6px;">幻想</b>
                    <div style="display:flex; flex-wrap:wrap; gap:6px;">
                      ${(Array.isArray(nsfw.幻想) ? nsfw.幻想 : []).map((f, i) => `
                        <span class="nsfw-tag">${makeInlineEditableValue(toText(f), { path: [...nsfwPath, '幻想', i], kind: 'string' })}</span>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 6. 身体部位 -->
              <div class="nsfw-theme-card">
                <div class="nsfw-theme-head">
                  <div class="nsfw-theme-title">💠 敏感部位档案</div>
                </div>
                <div class="nsfw-theme-body">
                  ${bodyPartEntries.length ? `
                    <div class="nsfw-bodypart-grid">
                      ${bodyPartEntries.map(([partName, partData]) => `
                        <div class="nsfw-bodypart-card">
                          <div class="nsfw-bodypart-head">
                            <div class="nsfw-bodypart-name">${htmlEscape(partName)}</div>
                            <span class="nsfw-bodypart-badge">开发 ${makeInlineEditableValue(String(toNumber(deepGet(partData, '开发度', 0), 0)), { path: [...nsfwPath, '身体部位', partName, '开发度'], kind: 'number' })}</span>
                          </div>
                          <div class="nsfw-bodypart-meta">
                            <div class="nsfw-meta-item">
                              <b>外观特征</b>
                              <span class="nsfw-text-wrap">${makeInlineEditableValue(toText(deepGet(partData, '外观特征', '无'), '无'), { path: [...nsfwPath, '身体部位', partName, '外观特征'], kind: 'string' })}</span>
                            </div>
                            <div class="identity-growth-grid" style="grid-template-columns: 1fr 1fr;">
                              <div class="nsfw-meta-item">
                                <b>敏感度加成</b>
                                <span>${makeInlineEditableValue(String(toNumber(deepGet(partData, '敏感度加成', 0), 0)), { path: [...nsfwPath, '身体部位', partName, '敏感度加成'], kind: 'number' })}</span>
                              </div>
                              <div class="nsfw-meta-item">
                                <b>状态描述</b>
                                <span>${makeInlineEditableValue(toText(deepGet(partData, '状态描述', '正常'), '正常'), { path: [...nsfwPath, '身体部位', partName, '状态描述'], kind: 'string' })}</span>
                              </div>
                            </div>
                            <div class="nsfw-meta-item">
                              <b>体液残留</b>
                              <span>${makeInlineEditableValue(toText(deepGet(partData, '体液残留', '无'), '无'), { path: [...nsfwPath, '身体部位', partName, '体液残留'], kind: 'string' })}</span>
                            </div>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  ` : '<div class="dossier-empty-note">当前角色尚未录入身体部位结构。</div>'}
                </div>
              </div>

            </div>
          `
        };
      }



      if (previewKey === '生命图谱详细页') {
        const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '');
        const trainedBonusPath = activeCharKey ? ['char', activeCharKey, '属性', '训练加成'] : [];
        const trainedBonusItems = buildEditableStatBonusItems(trainedBonusPath, deepGet(snapshot, 'activeChar.属性.训练加成', {}), { includeSoulPower: false });
        const lifePreviewStats = activeCharKey ? resolveTrackedStatPreview(activeCharKey, stat) : createTrackedStatPreviewMap(stat);
      const activeWardrobeKey = toText(穿搭数据.着装, '').trim();
        const activeWardrobePath = activeWardrobeKey && activeWardrobeKey !== '无'
          ? ['char', activeCharKey, '穿搭', '衣柜', activeWardrobeKey]
          : null;
        const createAbilityPreview = activeCharKey
          ? buildSkillDesignerPreviewKey({
            path: ['char', activeCharKey, '特殊能力', `自建特殊能力_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`],
            label: '新建特殊能力',
            category: '特殊能力',
            scope: 'special_ability',
          })
          : '';
        const fusionArchiveMeta = getFusionArchiveMeta(snapshot);
        const fusionArchiveEntry = buildFusionArchiveListItem(fusionArchiveMeta);
        const archiveSkillEntries = (Array.isArray(snapshot.extraSkills) ? snapshot.extraSkills : [])
          .filter(skill => toText(skill && skill.category, '') !== '武魂融合技')
          .map(skill => ({
            title: `${skill.category} - ${skill.name}`,
            desc: `${skill.level} ｜ ${skill.desc}`,
            preview: /功法/.test(toText(skill.category, '')) ? '' : (skill.preview || '')
          }));
        return {
          title: '详细档案',
          summary: '角色状态、修为、外观与成长记录。',
          body: `
            <div class="archive-modal-grid dossier-shell dossier-shell--life">
              <div class="archive-card dossier-card dossier-card--life-core">
                <div class="archive-card-head">
                  <div class="archive-card-title">核心成长</div>
                  <span class="dossier-pill live">实时体征</span>
                </div>
                <div class="dossier-columns dossier-columns--life-core">
                  <section class="dossier-section">
                    <div class="dossier-section-title">成长信息</div>
                    ${makeDossierRows([
                      { label: '等级', value: htmlEscape(formatCultivationLevelBadge(stat.等级, '0')) },
                      { label: '精神境界', value: htmlEscape(toText(stat._men_realm, toText(stat.精神力_realm, '灵元境'))) },
                      { label: '天赋梯队', value: htmlEscape(toText(stat.talent_tier, '未定')) },
                      { label: '系别', value: activeCharKey
                        ? makeInlineEditableValue(toText(stat.系别, '未知'), {
                            path: ['char', activeCharKey, '属性', '系别'],
                            kind: 'string',
                            rawValue: toText(stat.系别, '未知'),
                          })
                        : htmlEscape(toText(stat.系别, '未知')) },
                      { label: '名望', value: htmlEscape(`${toText(social.名望等级, toText(social.名望等级, '籍籍无名'))} / ${formatNumber(social.声望)}`) },
                    ], 'dossier-row-grid--two')}
                  </section>
                  <section class="dossier-section dossier-section--radar">
                    <div class="dossier-section-title">战斗轮廓</div>
                    <div class="battle-radar-wrap dossier-radar-wrap">
                      ${(() => {
                        const fStr = Math.max(0, toNumber(lifePreviewStats.力量, stat.力量));
                        const fDef = Math.max(0, toNumber(lifePreviewStats.防御, stat.防御));
                        const fAgi = Math.max(0, toNumber(lifePreviewStats.敏捷, stat.敏捷));
                        const fMen = Math.max(0, toNumber(lifePreviewStats.精神力上限, stat.精神力上限));
                        const fVit = Math.max(0, toNumber(lifePreviewStats.体力上限, stat.体力上限));
                        const maxAxis = Math.max(1, fStr, fDef, fAgi, fMen, fVit);
                        return makeRadarSvg(['力量', '防御', '敏捷', '精神', '体力'], [
                          Math.max(12, Math.min(100, Math.round(fStr / maxAxis * 100))),
                          Math.max(12, Math.min(100, Math.round(fDef / maxAxis * 100))),
                          Math.max(12, Math.min(100, Math.round(fAgi / maxAxis * 100))),
                          Math.max(12, Math.min(100, Math.round(fMen / maxAxis * 100))),
                          Math.max(12, Math.min(100, Math.round(fVit / maxAxis * 100)))
                        ], [formatNumber(fStr), formatNumber(fDef), formatNumber(fAgi), formatNumber(fMen), formatNumber(fVit)]);
                      })()}
                    </div>
                  </section>
                </div>
                <section class="dossier-section">
                  <div class="dossier-section-title">当前状态</div>
                  ${makeDossierRows([
                    { label: '行动状态', value: activeCharKey
                      ? makeInlineEditableValue(toText(status.行动, '日常'), {
                          path: ['char', activeCharKey, '状态', '行动'],
                          kind: 'string',
                          rawValue: toText(status.行动, '日常'),
                        })
                      : htmlEscape(toText(status.行动, '日常')) },
                    { label: '伤势', value: htmlEscape(getDisplayWoundLabel(stat)) },
                    { label: '魂核状态', value: activeCharKey
                      ? `${makeInlineEditableValue(String(toNumber(deepGet(snapshot, 'activeChar.魂核.核心.数量', 0), 0)), {
                          path: ['char', activeCharKey, '魂核', '核心', '数量'],
                          kind: 'number',
                          rawValue: toNumber(deepGet(snapshot, 'activeChar.魂核.核心.数量', 0), 0),
                          editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                        })} 枚 / 进度 ${makeInlineEditableValue(String(toNumber(deepGet(snapshot, 'activeChar.魂核.核心.进度', 0), 0)), {
                          path: ['char', activeCharKey, '魂核', '核心', '进度'],
                          kind: 'number',
                          rawValue: toNumber(deepGet(snapshot, 'activeChar.魂核.核心.进度', 0), 0),
                          editorMeta: { min: 0, max: 100, integer: true, hint: '范围 0 - 100 · 整数' },
                        })}%`
                      : htmlEscape(`${toText(deepGet(snapshot, 'activeChar.魂核.核心.数量', 0), '0')} 枚 / 进度 ${toText(deepGet(snapshot, 'activeChar.魂核.核心.进度', 0), '0')}%`) },
                    ...(snapshot.bloodline && snapshot.bloodline.valid ? [{ label: '血脉状态', value: htmlEscape(`${snapshot.bloodline.bloodline} / ${snapshot.bloodline.sealLv}层`) }] : []),
                    { label: '灵物吸收', value: activeCharKey
                      ? `${makeInlineEditableValue(String(toNumber(status.吸收灵物年限, 0), 0), {
                          path: ['char', activeCharKey, '状态', '吸收灵物年限'],
                          kind: 'number',
                          rawValue: toNumber(status.吸收灵物年限, 0),
                          editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                        })} 年`
                      : htmlEscape(toNumber(status.吸收灵物年限, 0) > 0 ? `${formatNumber(toNumber(status.吸收灵物年限, 0))} 年` : '当前无吸收') },
                    { label: '受伤部位', value: buildInjuryCrudHtml(activeCharKey, status), className: 'dossier-row--wide' },
                  ], 'dossier-row-grid--two')}
                </section>
              </div>
              <div class="archive-card dossier-card dossier-card--life-profile">
                <div class="archive-card-head">
                  <div class="archive-card-title">角色档案</div>
                  <div class="dossier-head-name">${htmlEscape(snapshot.activeName)}</div>
                </div>
                <section class="dossier-section">
                  <div class="dossier-section-title">基础描述</div>
                  ${makeDossierRows([
                    { label: '年龄 / 性别', value: `${makeInlineEditableValue(`${toText(stat.年龄, '0')}岁`, { path: ['char', activeCharKey, '属性', '年龄'], kind: 'number', rawValue: stat.年龄, editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' } })} / ${makeInlineEditableValue(toText(stat.性别, '未知'), { path: ['char', activeCharKey, '属性', '性别'], kind: 'string', rawValue: stat.性别 })}` },
                    { label: '性格', value: makeInlineEditableValue(snapshot.personalityText, { path: ['char', activeCharKey, '性格'], kind: 'string', rawValue: deepGet(snapshot, 'activeChar.性格', snapshot.personalityText) }) },
                  ], 'dossier-row-grid--two')}
                </section>
                <section class="dossier-section">
                  <div class="dossier-section-title">外貌与着装</div>
                  ${makeDossierRows([
                    { label: '发色', value: makeInlineEditableValue(snapshot.appearanceMeta.hairColor, { path: ['char', activeCharKey, '外貌', '发色'], kind: 'string', rawValue: deepGet(snapshot, 'activeChar.外貌.发色', snapshot.appearanceMeta.hairColor) }) },
                    { label: '发型', value: makeInlineEditableValue(snapshot.appearanceMeta.hairStyle, { path: ['char', activeCharKey, '外貌', '发型'], kind: 'string', rawValue: deepGet(snapshot, 'activeChar.外貌.发型', snapshot.appearanceMeta.hairStyle) }) },
                    { label: '瞳色', value: makeInlineEditableValue(snapshot.appearanceMeta.eyes, { path: ['char', activeCharKey, '外貌', '瞳色'], kind: 'string', rawValue: deepGet(snapshot, 'activeChar.外貌.瞳色', snapshot.appearanceMeta.eyes) }) },
                    { label: '身高', value: makeInlineEditableValue(snapshot.appearanceMeta.height, { path: ['char', activeCharKey, '外貌', '身高'], kind: 'string', rawValue: deepGet(snapshot, 'activeChar.外貌.身高', snapshot.appearanceMeta.height) }) },
                    { label: '体型', value: makeInlineEditableValue(snapshot.appearanceMeta.build, { path: ['char', activeCharKey, '外貌', '体型'], kind: 'string', rawValue: deepGet(snapshot, 'activeChar.外貌.体型', snapshot.appearanceMeta.build) }) },
                    { label: '长相描述', value: makeInlineEditableValue(snapshot.appearanceMeta.looks, { path: ['char', activeCharKey, '外貌', '长相描述'], kind: 'string', rawValue: deepGet(snapshot, 'activeChar.外貌.长相描述', snapshot.appearanceMeta.looks) }), className: 'dossier-row--wide' },
                    { label: '特征', value: makeInlineEditableValue(snapshot.appearanceMeta.features, { path: ['char', activeCharKey, '外貌', '特殊特征'], kind: 'string_list', rawValue: deepGet(snapshot, 'activeChar.外貌.特殊特征', []) }), className: 'dossier-row--wide' },
                    { label: '当前套装', value: makeInlineEditableValue(toText(穿搭数据.着装, '无'), { path: ['char', activeCharKey, '穿搭', '着装'], kind: 'string', rawValue: 穿搭数据.着装 }), className: 'dossier-row--wide' },
                    { label: '衣柜套数', value: String(wardrobeEntries.length) },
                    { label: '上装', value: activeWardrobePath ? makeInlineEditableValue(toText(deepGet(穿搭数据, ['衣柜', activeWardrobeKey, '上装'], '无'), '无'), { path: [...activeWardrobePath, '上装'], kind: 'string', rawValue: deepGet(穿搭数据, ['衣柜', activeWardrobeKey, '上装'], '') }) : '无' },
                    { label: '下装', value: activeWardrobePath ? makeInlineEditableValue(toText(deepGet(穿搭数据, ['衣柜', activeWardrobeKey, '下装'], '无'), '无'), { path: [...activeWardrobePath, '下装'], kind: 'string', rawValue: deepGet(穿搭数据, ['衣柜', activeWardrobeKey, '下装'], '') }) : '无' },
                    { label: '鞋子', value: activeWardrobePath ? makeInlineEditableValue(toText(deepGet(穿搭数据, ['衣柜', activeWardrobeKey, '鞋子'], '无'), '无'), { path: [...activeWardrobePath, '鞋子'], kind: 'string', rawValue: deepGet(穿搭数据, ['衣柜', activeWardrobeKey, '鞋子'], '') }) : '无' },
                    { label: '套装描述', value: activeWardrobePath ? makeInlineEditableValue(toText(deepGet(穿搭数据, ['衣柜', activeWardrobeKey, '描述'], '暂无描述'), '暂无描述'), { path: [...activeWardrobePath, '描述'], kind: 'string', rawValue: deepGet(穿搭数据, ['衣柜', activeWardrobeKey, '描述'], '') }) : '暂无描述', className: 'dossier-row--wide' },
                  ], 'dossier-row-grid--two')}
                </section>
                <section class="dossier-section">
                  <div class="dossier-section-title">衣柜记录</div>
                  ${wardrobeEntries.length
                    ? makeDossierList(wardrobeEntries.map(([name, item]) => ({
                        title: name,
                        desc: `${toText(item && item['上装'], '无')} / ${toText(item && item['下装'], '无')} / ${toText(item && item['鞋子'], '无')} ｜ ${toText(item && item['描述'], '暂无描述')}`
                      })), 'dossier-list--compact')
                    : '<div class="dossier-empty-note">当前角色尚未记录可切换套装。</div>'}
                </section>
              </div>
              <div class="archive-card dossier-card dossier-card--life-record full">
                <div class="archive-card-head">
                  <div class="archive-card-title">能力与成长记录</div>
                  <div class="dossier-tag-row dossier-head-actions">
                    <button type="button" class="dossier-pill ${fusionArchiveMeta.fusionEntries.length ? 'live' : 'warn'} clickable" data-preview="武魂融合技详细页">武魂融合技</button>
                    ${createAbilityPreview ? `<button type="button" class="dossier-pill live clickable" data-preview="${escapeHtmlAttr(createAbilityPreview)}">自建特殊能力</button>` : ''}
                  </div>
                </div>
                <div class="dossier-columns dossier-columns--life-record">
                  <section class="dossier-section">
                    <div class="dossier-section-title">额外成长加成</div>
                    ${makeDossierRows(trainedBonusItems, 'dossier-row-grid--three')}
                  </section>
                  <section class="dossier-section">
                    <div class="dossier-section-title">功法与特殊能力</div>
                    ${makeDossierList([fusionArchiveEntry, ...archiveSkillEntries], 'dossier-list--compact')}
                  </section>
                </div>
              </div>
            </div>
          `
        };
      }

      if (previewKey === '社会档案详细页') {
        const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '');
        return {
          title: '社会档案弹窗',
          summary: '当前角色的公开身份、名望、头衔与社会可见度摘要。',
          body: `
            <div class="archive-modal-grid dossier-shell dossier-shell--social">
              <div class="archive-card dossier-card dossier-card--social-main">
                <div class="archive-card-head">
                  <div>
                    <div class="archive-card-title">身份卷宗</div>
                    <div class="dossier-head-name">${htmlEscape(snapshot.activeName)}</div>
                  </div>
                  ${makeDossierTags([
                    { text: toText(social.名望等级, toText(social.名望等级, '籍籍无名')), className: 'warn' },
                    { text: (social.公开情报 ?? social.public_intel) ? '公开情报' : '未公开' },
                    { text: `称号 ${snapshot.recentTitles.length}` },
                  ])}
                </div>
                <section class="dossier-section">
                  <div class="dossier-section-title">公开身份</div>
                  ${makeDossierRows([
                    { label: '当前身份', value: makeInlineEditableValue(toText(social.主身份, '无'), { path: ['char', activeCharKey, '社交', '主身份'], kind: 'string', rawValue: social.主身份 }) },
                    { label: '名望层级', value: htmlEscape(toText(social.名望等级, toText(social.名望等级, '籍籍无名'))) },
                    { label: '公开情报', value: htmlEscape(snapshot.publicIntel ? '已公开' : '未公开') },
                    { label: '主要圈层', value: htmlEscape(snapshot.势力.map(([name]) => name).join(' / ') || '暂无') },
                    { label: '当前主称号', value: htmlEscape(snapshot.recentTitles[0] || '暂无') },
                    { label: '主阵营身份', value: htmlEscape(snapshot.primaryFaction ? `${snapshot.primaryFaction[0]} / ${toText(deepGet(snapshot.primaryFaction[1], '身份', '无'), '无')}` : '无') },
                  ], 'dossier-row-grid--two')}
                </section>
                <section class="dossier-section">
                  <div class="dossier-section-title">社会标签</div>
                  ${makeDossierTags([
                    { text: snapshot.activeName, className: 'live' },
                    { text: toText(social.主身份, '无') },
                    { text: snapshot.势力.map(([name]) => name).join(' / ') || '无圈层' },
                    { text: snapshot.recentTitles[0] || '暂无主称号' },
                  ], 'dossier-tag-row--wrap')}
                </section>
              </div>
              <div class="archive-card dossier-card dossier-card--social-side">
                <div class="archive-card-head">
                  <div class="archive-card-title">名望摘要</div>
                  <span class="dossier-pill ${snapshot.publicIntel ? 'live' : 'warn'}">${htmlEscape(snapshot.publicIntel ? '档案已公开' : '未公开')}</span>
                </div>
                <section class="dossier-section">
                  <div class="dossier-section-title">个人声望量级</div>
                  ${makeDossierMeter(
                    '当前声望',
                    makeInlineEditableValue(`${formatNumber(social.声望)} / 5,000 阈值`, {
                      path: ['char', activeCharKey, '社交', '声望'],
                      kind: 'number',
                      rawValue: social.声望,
                      editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数 · 5,000 为当前量级阈值参考，不是硬上限' }
                    }),
                    ratioPercent(social.声望, 5000),
                    'dossier-meter--accent'
                  )}
                </section>
                <section class="dossier-section">
                  <div class="dossier-section-title">社会位置</div>
                  ${makeDossierRows([
                    { label: '头衔总数', value: String(snapshot.titleEntries.length) },
                    { label: '主阵营身份', value: htmlEscape(snapshot.primaryFaction ? `${snapshot.primaryFaction[0]} / ${toText(deepGet(snapshot.primaryFaction[1], '身份', '无'), '无')}` : '无') },
                    { label: '档案状态', value: htmlEscape(snapshot.publicIntel ? '公开可见' : '仅内部可见') },
                    { label: '当前摘要', value: htmlEscape(toText(social.主身份, '无')) },
                  ], 'dossier-row-grid--single')}
                </section>
              </div>
            </div>
          `
        };
      }

      if (previewKey === '所属势力详细页') {
        return buildFactionDossierModal(snapshot, previewKey);
      }


      if (previewKey === '人物关系详细页') {
        const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '');
        const relationPositions = [
          { left: 20, top: 25, className: 'hover-right' },
          { left: 50, top: 18, className: 'gold' },
          { left: 82, top: 25, className: 'hover-left' },
          { left: 25, top: 75, className: 'warn hover-up hover-right' },
          { left: 75, top: 75, className: 'hover-up hover-left' }
        ];
        const currentLocFull = toText(deepGet(snapshot, 'activeChar.状态.位置', snapshot.currentLoc || '未知地点'), snapshot.currentLoc || '未知地点');
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
                <span class="relation-hover-desc">${htmlEscape(`${toText(rel && rel['关系'], '陌生')} / ${toText(rel && rel['关系路线'], '朋友线')}`)}</span>
                <div class="relation-hover-tags">
                  <span class="relation-hover-chip">${htmlEscape(`好感 ${favor}`)}</span>
                  <span class="relation-hover-chip">${htmlEscape(toText(rel && rel['对方身份'], '未知身份'))}</span>
                </div>
                <div class="relation-hover-skill">
                  <span>${htmlEscape(toText(rel && rel['好感加成'], '暂无额外关系加成说明'))}</span>
                  <span>${htmlEscape(toText(rel && rel['_推进提示'], '暂无推进提示'))}</span>
                  <span>${htmlEscape(`下一阶段：${toText(rel && rel['_下一阶段'], '无')} / ${toNumber(rel && rel['_下一阶段_threshold'], 0)}`)}</span>
                  <span>${htmlEscape(`最近互动：${toText(rel && rel['上次互动动作'], '无')} / ${toNumber(rel && rel['最近好感变化'], 0)}`)}</span>
                  <span>${htmlEscape(`当前加成：${toText(rel && rel['_当前关系加成'], toText(rel && rel['好感加成'], '无'))}`)}</span>
                  <span>${htmlEscape(`下一解锁：${toText(rel && rel['_下档解锁加成'], '无')}`)}</span>
                  <span>${htmlEscape(`关系状态：${toText(rel && rel['_维护优先级'], '未知')} / ${toText(rel && rel['_切线限制原因'], '无')}`)}</span>
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

        const relationFocusTargets = Array.isArray(deepGet(snapshot, '关系分析.重点对象', []))
          ? deepGet(snapshot, '关系分析.重点对象', [])
          : [];
        const relationDirectoryPage = paginateModalItems(snapshot.relations, previewKey, 'relation-directory', 6);
        const relationFocusStateKey = `${previewKey}::relation-focus`;
        let relationDetailName = toText(modalFocusState[relationFocusStateKey], toText(deepGet(snapshot, '关系分析.关注对象', deepGet(relationFocusTargets, '0.target', relationNodes[0] ? relationNodes[0][0] : '')), ''));
        if (!snapshot.relations.some(([entryName]) => entryName === relationDetailName)) relationDetailName = snapshot.relations[0] ? snapshot.relations[0][0] : '';
        if (relationDetailName) modalFocusState[relationFocusStateKey] = relationDetailName;
        else delete modalFocusState[relationFocusStateKey];

        const relationDetailEntry = relationDetailName ? snapshot.relations.find(([entryName]) => entryName === relationDetailName) : null;
        const relationDetail = relationDetailEntry && relationDetailEntry[1];
        const relationDetailPath = relationDetailName && activeCharKey ? ['char', activeCharKey, '社交', '关系', relationDetailName] : [];
        const resolvedTarget = relationDetailName ? resolveSnapshotCharacter(snapshot, relationDetailName) : { key: '', displayName: '', char: null };
        const relationTargetChar = resolvedTarget.char || null;
        const relationTargetLoc = toText(deepGet(relationTargetChar, '状态.位置', ''), '');
        const relationTargetLocLabel = relationTargetLoc ? relationTargetLoc.replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '') : '未知地点';
        const relationFavor = toNumber(relationDetail && relationDetail['好感度'], 0);
        const relationRoute = toText(relationDetail && relationDetail['关系路线'], '朋友线');
        const routeSwitchable = !!deepGet(relationDetail, '_可切线', false);
        const isContactable = !!relationTargetChar && deepGet(relationTargetChar, '状态.存活', true) !== false;
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
              const targetLoc = toText(deepGet(targetChar, '状态.位置', ''), '');
              const alive = !!targetChar && deepGet(targetChar, '状态.存活', true) !== false;
              const sameLocation = !!targetChar && isLocationCompatible(currentLocFull, targetLoc);
              const favor = toNumber(rel && rel['好感度'], 0);
              const stage = toText(rel && rel['关系'], '陌生');
              const route = toText(rel && rel['关系路线'], '朋友线');
              const availability = sameLocation ? '在场可接触' : (alive ? '远端存活' : '不可接触');
              const availabilityClass = sameLocation ? 'live' : (alive ? 'warn' : '');
              const progressNote = toText(rel && rel['_推进提示'], '暂无推进提示');
              return `
                <button type="button" class="dossier-list-row dossier-list-row--button relation-directory-item ${name === relationDetailName ? 'active' : ''}" data-relation-focus="${escapeHtmlAttr(name)}">
                  <b>${htmlEscape(name)}</b>
                  <span>
                    <strong>${htmlEscape(toText(rel && rel['对方身份'], '未知身份'))}</strong>
                    <em>${htmlEscape(`${stage} / ${route} / 好感 ${favor}`)}</em>
                    <small class="${availabilityClass}">${htmlEscape(`${availability} ｜ ${progressNote}`)}</small>
                  </span>
                </button>
              `;
            }).join('')
          : '<div class="dossier-empty-note">关系网络尚未展开。</div>';

        const relationFocusHtml = (relationFocusTargets.length
          ? makeDossierList(relationFocusTargets.slice(0, 2).map(item => {
              const targetName = toText(item && item.target, '未知对象');
              const detailEntry = snapshot.relations.find(([entryName]) => entryName === targetName);
              const detail = detailEntry && detailEntry[1];
              return {
                title: `${targetName} / ${toText(item && item.relation, '陌生')}`,
                desc: `${toText(item && item.reason, '暂无推进建议')} ｜ 建议：${toText(item && item.recommended_action, '继续观察')} ｜ 下一阶段：${toText(detail && detail['_下一阶段'], '无')} / ${toNumber(detail && detail['_下一阶段_threshold'], 0)}`,
              };
            }), 'dossier-list--compact')
          : makeDossierList(snapshot.relations.slice(0, 2).map(([name, rel]) => ({
              title: `${name} / ${toText(rel && rel['关系'], '陌生')}`,
              desc: `路线：${toText(rel && rel['关系路线'], '朋友线')} / 好感：${toText(rel && rel['好感度'], 0)} ｜ 下一阶段：${toText(rel && rel['_下一阶段'], '无')} / ${toNumber(rel && rel['_下一阶段_threshold'], 0)}`,
            })), 'dossier-list--compact')) || '<div class="dossier-empty-note">关系线索仍在铺陈。</div>';

        const sameLocationTargets = Array.isArray(deepGet(snapshot, '关系分析.同地对象', [])) ? deepGet(snapshot, '关系分析.同地对象', []) : [];
        const trustTargets = Array.isArray(deepGet(snapshot, '关系分析.信任对象', [])) ? deepGet(snapshot, '关系分析.信任对象', []) : [];
        const recommendedActions = Array.isArray(deepGet(snapshot, '关系分析.建议行动', [])) ? deepGet(snapshot, '关系分析.建议行动', []) : [];
        const relationSummaryText = relationFocusTargets.length
          ? `当前重点关系对象：${relationFocusTargets.slice(0, 2).map(item => `${toText(item && item.target, '无')}(${toText(item && item.relation, '陌生')}/${toNumber(item && item.favor, 0)})`).join('、')}`
          : sameLocationTargets.length
            ? `当前可立即接触：${sameLocationTargets.slice(0, 3).join('、')}`
            : recommendedActions.length
              ? `当前建议：${recommendedActions.slice(0, 2).join('；')}`
              : (trustTargets.length ? `高信任对象：${trustTargets.slice(0, 3).join('、')}` : '当前雷达未扫描到足够的社会链接数据，暂无总体分析倾向。');
        const relationOverviewRowsHtml = makeDossierRows([
          { label: '焦点对象', value: htmlEscape(toText(deepGet(snapshot, '关系分析.关注对象', relationDetailName || '无'), relationDetailName || '无')) },
          { label: '系统建议', value: htmlEscape(recommendedActions.slice(0, 3).join(' / ') || '无') },
          { label: '在场目标', value: htmlEscape(sameLocationTargets.slice(0, 4).join(' / ') || '无') },
        ], 'dossier-row-grid--two');
        const relationTargetSummaryHtml = relationDetail
          ? makeDossierRows([
              { label: '目标对象', value: htmlEscape(relationDetailName) },
              { label: '关系', value: relationDetailPath.length
                ? makeInlineEditableValue(toText(relationDetail && relationDetail['关系'], '陌生'), {
                    path: [...relationDetailPath, '关系'],
                    kind: 'string',
                    rawValue: toText(relationDetail && relationDetail['关系'], '陌生'),
                  })
                : htmlEscape(toText(relationDetail && relationDetail['关系'], '陌生')) },
              { label: '路线', value: relationDetailPath.length
                ? makeInlineEditableValue(relationRoute, {
                    path: [...relationDetailPath, '关系路线'],
                    kind: 'enum_select',
                    rawValue: relationRoute,
                    editorMeta: { options: ['朋友线', '恋人线'] },
                  })
                : htmlEscape(relationRoute) },
              { label: '好感度', value: relationDetailPath.length
                ? makeInlineEditableValue(String(relationFavor), {
                    path: [...relationDetailPath, '好感度'],
                    kind: 'number',
                    rawValue: relationFavor,
                    editorMeta: { integer: true, hint: '整数 · 可正可负 · 不设硬上下限' },
                  })
                : htmlEscape(String(relationFavor)) },
              { label: '对方身份', value: relationDetailPath.length
                ? makeInlineEditableValue(toText(relationDetail && relationDetail['对方身份'], '无'), {
                    path: [...relationDetailPath, '对方身份'],
                    kind: 'string',
                    rawValue: toText(relationDetail && relationDetail['对方身份'], '无'),
                  })
                : htmlEscape(toText(relationDetail && relationDetail['对方身份'], '无')) },
              { label: '位置状态', value: htmlEscape(`${relationTargetLocLabel} / ${isSameLocation ? '同地可接触' : (isContactable ? '远端可联系' : '当前不可接触')}`) },
              { label: '推进提示', value: htmlEscape(toText(relationDetail && relationDetail['_推进提示'], '暂无')) },
              { label: '关系状态', value: htmlEscape(`${toText(relationDetail && relationDetail['_维护优先级'], '未知')} / ${toText(relationDetail && relationDetail['_切线限制原因'], '无')}`) },
            ], 'dossier-row-grid--two')
          : '<div class="dossier-empty-note">先从对象列表里选择一个目标。</div>';
        const relationRecordRowsHtml = relationDetail
          ? makeDossierRows([
              { label: '关系加成', value: relationDetailPath.length
                ? makeInlineEditableValue(toText(relationDetail && relationDetail['好感加成'], '无'), {
                    path: [...relationDetailPath, '好感加成'],
                    kind: 'string',
                    rawValue: toText(relationDetail && relationDetail['好感加成'], '无'),
                  })
                : htmlEscape(toText(relationDetail && relationDetail['好感加成'], '无')) },
              { label: '当前加成', value: htmlEscape(toText(relationDetail && relationDetail['_当前关系加成'], '无')) },
              { label: '下一解锁', value: htmlEscape(toText(relationDetail && relationDetail['_下档解锁加成'], '无')) },
              { label: '下一阶段', value: htmlEscape(`${toText(relationDetail && relationDetail['_下一阶段'], '无')} / ${toNumber(relationDetail && relationDetail['_下一阶段_threshold'], 0)}`) },
              { label: '最近互动', value: relationDetailPath.length
                ? makeInlineEditableValue(toText(relationDetail && relationDetail['上次互动动作'], '无'), {
                    path: [...relationDetailPath, '上次互动动作'],
                    kind: 'string',
                    rawValue: toText(relationDetail && relationDetail['上次互动动作'], '无'),
                  })
                : htmlEscape(toText(relationDetail && relationDetail['上次互动动作'], '无')) },
              { label: '最近变动', value: relationDetailPath.length
                ? makeInlineEditableValue(String(toNumber(relationDetail && relationDetail['最近好感变化'], 0)), {
                    path: [...relationDetailPath, '最近好感变化'],
                    kind: 'number',
                    rawValue: toNumber(relationDetail && relationDetail['最近好感变化'], 0),
                    editorMeta: { integer: true, hint: '整数 · 可正可负 · 不设硬上下限' },
                  })
                : htmlEscape(String(toNumber(relationDetail && relationDetail['最近好感变化'], 0))) },
              { label: '上次互动Tick', value: relationDetailPath.length
                ? makeInlineEditableValue(String(toNumber(relationDetail && relationDetail['上次互动tick'], 0)), {
                    path: [...relationDetailPath, '上次互动tick'],
                    kind: 'number',
                    rawValue: toNumber(relationDetail && relationDetail['上次互动tick'], 0),
                    editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                  })
                : htmlEscape(String(toNumber(relationDetail && relationDetail['上次互动tick'], 0))) },
              { label: '推进路线', value: htmlEscape(routeSwitchable ? '可切恋人线' : relationRoute) },
            ], 'dossier-row-grid--two')
          : '';
        const relationActionSummaryHtml = relationDetail
          ? (isPlayerControlled
            ? `
                ${makeDossierTags([
                  { text: isSameLocation ? '同地' : '未在身边', className: isSameLocation ? 'live' : 'warn' },
                  { text: isContactable ? '可接触' : '不可接触', className: isContactable ? 'live' : 'warn' },
                  { text: routeSwitchable ? '可切恋人线' : relationRoute },
                ], 'dossier-tag-row--wrap')}
                <div class="dossier-action-toolbar">
                  <button type="button" class="relation-action-btn action-primary" data-relation-action="talk" data-relation-target="${escapeHtmlAttr(relationDetailName)}" ${!canTalk ? 'disabled' : ''}>闲聊</button>
                  <button type="button" class="relation-action-btn action-primary" data-relation-action="ask" data-relation-target="${escapeHtmlAttr(relationDetailName)}" ${!canAsk ? 'disabled' : ''}>请教</button>
                  <button type="button" class="relation-action-btn action-warn" data-relation-action="battle" data-relation-target="${escapeHtmlAttr(relationDetailName)}" ${!canBattle ? 'disabled' : ''}>切磋</button>
                  <button type="button" class="relation-action-btn action-accent" data-relation-action="confess" data-relation-target="${escapeHtmlAttr(relationDetailName)}" ${!canConfess ? 'disabled' : ''}>表白</button>
                  <button type="button" class="relation-action-btn action-accent" data-relation-action="dual" data-relation-target="${escapeHtmlAttr(relationDetailName)}" ${!canDual ? 'disabled' : ''}>双修</button>
                </div>
                <div class="relation-gift-row dossier-form-row">
                  <select class="relation-gift-select" ${!canGift ? 'disabled' : ''}>
                    ${giftOptionsHtml}
                  </select>
                  <button type="button" class="relation-action-btn action-primary" data-relation-action="gift" data-relation-target="${escapeHtmlAttr(relationDetailName)}" ${!canGift ? 'disabled' : ''}>送礼</button>
                </div>
              `
            : `
                ${makeDossierTags([
                  { text: relationRoute },
                  { text: isSameLocation ? '同地可见' : '远端观察', className: isSameLocation ? 'live' : 'warn' },
                ], 'dossier-tag-row--wrap')}
              `)
          : '<div class="dossier-empty-note">当前没有可操作的关系目标。</div>';

        return {
          title: '人物关系弹窗',
          summary: '全局社会链路扫描、当前重点对象监控与智能关系行动推荐。',
          body: `
            <div class="archive-modal-grid dossier-shell dossier-shell--relation">
              <div class="archive-card dossier-card dossier-card--relation-overview full">
                <div class="archive-card-head"><div class="archive-card-title">关系概览</div><span class="dossier-pill live">实时拓扑</span></div>
                <div class="dossier-columns dossier-columns--relation-overview">
                  <div class="topology-board relation-topology-board dossier-topology-board">
                    <svg class="topology-svg" viewBox="0 0 100 100" preserveAspectRatio="none">${relationLinks}</svg>
                    <div class="topology-node center" style="left:50%;top:50%"><b>${htmlEscape(snapshot.activeName)}</b><span>自我</span></div>
                    ${relationHtml || '<div class="topology-node" style="left:50%;top:18%"><b>暂无关系对象</b><span>关系网络尚未展开</span></div>'}
                  </div>
                  <div class="dossier-section-stack">
                    <section class="dossier-section">
                      <div class="dossier-section-title">关系态势</div>
                      <div class="dossier-note dossier-note--dense">${htmlEscape(toText(relationSummaryText, '关系数据不足'))}</div>
                      ${relationOverviewRowsHtml}
                    </section>
                    <section class="dossier-section">
                      <div class="dossier-section-title">推进线索</div>
                      ${relationFocusHtml}
                    </section>
                  </div>
                </div>
              </div>
              <div class="archive-card dossier-card dossier-card--relation-directory">
                <div class="archive-card-head"><div class="archive-card-title">对象列表</div><span class="dossier-pill ${relationDirectoryPage.total ? 'live' : 'warn'}">${relationDirectoryPage.total ? `已收录 ${relationDirectoryPage.total} 名` : '暂无对象'}</span></div>
                <div class="dossier-section">
                  ${relationDirectoryHtml}
                </div>
                ${makeModalPaginationControls('relation-directory', relationDirectoryPage.page, relationDirectoryPage.totalPages, relationDirectoryPage.total)}
              </div>
              <div class="archive-card dossier-card dossier-card--relation-focus">
                <div class="archive-card-head"><div class="archive-card-title">目标卷宗</div><span class="dossier-pill ${relationDetailName ? 'live' : 'warn'}">${htmlEscape(relationDetailName || '未选中')}</span></div>
                <section class="dossier-section">
                  <div class="dossier-section-title">关系摘要</div>
                  ${relationTargetSummaryHtml}
                </section>
                <section class="dossier-section">
                  <div class="dossier-section-title">${htmlEscape(isPlayerControlled ? '互动操作' : '观察备注')}</div>
                  ${relationActionSummaryHtml}
                </section>
                <section class="dossier-section">
                  <div class="dossier-section-title">关系记录</div>
                  ${relationRecordRowsHtml || '<div class="dossier-empty-note">当前没有可展示的推进记录。</div>'}
                </section>
              </div>
            </div>
          `
        };
      }


      if (previewKey === '情报库详细页') {
        const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '');
        const knowledgeRequestPath = activeCharKey ? ['char', activeCharKey, '待解锁情报'] : [];
        const intelNodes = [toText(deepGet(snapshot, 'activeChar.待解锁情报.内容', '无'), '无'), ...snapshot.unlockedKnowledges.slice(-4).reverse()].filter(item => item && item !== '无');
        const coreIntel = intelNodes[0] || '暂无核心情报';
        const sideIntels = intelNodes.slice(1, 5);
        const unlockedIntelEntries = (snapshot.unlockedKnowledges || []).map((text, index) => ({ text, index })).slice().reverse();
        const unlockedIntelPageSize = 6;
        const unlockedIntelPage = paginateModalItems(unlockedIntelEntries, previewKey, 'intel-records', unlockedIntelPageSize);
        const pendingIntelDefault = snapshot.pendingIntelCount ? snapshot.pendingIntelContent : '';
        const pendingIntelImpactDefault = snapshot.pendingIntelCount ? snapshot.pendingIntelImpact : 0;
        const pendingIntelContentValue = toText(deepGet(snapshot, 'activeChar.待解锁情报.内容', pendingIntelDefault || '未知'), pendingIntelDefault || '未知');
        const pendingIntelImpactValue = toNumber(deepGet(snapshot, 'activeChar.待解锁情报.影响', pendingIntelImpactDefault), pendingIntelImpactDefault);
        const hasPendingIntel = snapshot.pendingIntelCount > 0;
        const latestUnlockedIntel = snapshot.unlockedKnowledges.length
          ? toText(snapshot.unlockedKnowledges[snapshot.unlockedKnowledges.length - 1], '鏆傛棤')
          : '鏆傛棤';
        const intelOverviewText = snapshot.pendingIntelCount ? pendingIntelContentValue : latestUnlockedIntel;
        const combatHistoryTotalCount = snapshot.combatHistoryEntries.reduce((total, [, info]) => total + Math.max(0, toNumber(info && info.次数, 0)), 0);
        const latestCombatEntry = snapshot.combatHistoryEntries.length ? snapshot.combatHistoryEntries[0] : null;
        const latestCombatTarget = latestCombatEntry ? toText(latestCombatEntry[0], '暂无') : '暂无';
        const latestCombatResult = latestCombatEntry ? toText(latestCombatEntry[1] && latestCombatEntry[1].last_result, '未记录') : '未记录';
        const combatHistoryCards = (snapshot.combatHistoryEntries.length ? snapshot.combatHistoryEntries.slice(0, 8) : [['暂无交战档案', { empty: true }]]).map(([name, info]) => {
          if (info && info.empty) {
            return {
              title: name,
              desc: '当前角色还没有任何交战档案。'
            };
          }
          const countValue = Math.max(0, toNumber(info && info.次数, 0));
          const tickValue = toText(info && info.最近tick, '未记录');
          const lastResult = toText(info && info.last_result, '');
          return {
            title: `${name}`,
            desc: [
              `累计交战 ${countValue} 次`,
              `最近记录轮次 ${tickValue}`,
              lastResult ? `最近结果：${lastResult}` : ''
            ].filter(Boolean).join(' · ')
          };
        });
        const unlockedIntelHtml = unlockedIntelPage.items.length
          ? unlockedIntelPage.items.map(item => `
              <div class="intel-card" style="min-height:132px; display:flex; flex-direction:column; justify-content:space-between;">
                <div style="display:flex; gap:8px; align-items:flex-start; justify-content:space-between;">
                  <b style="flex:1 1 auto;">${activeCharKey
                    ? makeInlineEditableValue(toText(item && item.text, '未知'), {
                        path: ['char', activeCharKey, '已掌握情报', toNumber(item && item.index, 0)],
                        kind: 'string',
                        rawValue: toText(item && item.text, '未知'),
                        multiline: true,
                      })
                    : htmlEscape(toText(item && item.text, '未知'))}</b>
                  ${activeCharKey
                    ? `<button type="button" class="tag-chip" data-collection-action="delete-intel" data-collection-char="${escapeHtmlAttr(activeCharKey)}" data-collection-index="${escapeHtmlAttr(String(toNumber(item && item.index, 0)))}">删除</button>`
                    : ''}
                </div>
                <span style="margin-top:10px; color:var(--color-text-secondary); font-size:12px; line-height:1.55;">情报序号 #${toNumber(item && item.index, 0) + 1}</span>
              </div>
            `).join('')
          : '<div class="intel-card" style="min-height:132px;"><b>暂无情报</b></div>';
        return {
          title: '情报库弹窗',
          summary: '当前已解锁情报、待处理线索与交战档案概览。',
          body: `
            <div class="intel-layout-dashboard ${hasPendingIntel ? 'has-pending' : 'is-empty'}">
              <div class="archive-card intel-pending-card ${hasPendingIntel ? 'intel-pending-card--active' : 'intel-pending-card--empty'}">
                <div class="archive-card-head">
                  <div class="archive-card-title">待解锁线索</div>
                  ${hasPendingIntel
                    ? `<span class="state-tag warn">待解析 / +${snapshot.pendingIntelImpact}</span>`
                    : `<span class="state-tag" style="opacity: 0.5;">暂无</span>`}
                  ${knowledgeRequestPath.length && hasPendingIntel
                    ? `<button type="button" class="tag-chip" data-collection-action="clear-intel-pending" data-collection-char="${escapeHtmlAttr(activeCharKey)}">清空</button>`
                    : ''}
                </div>

                <div class="intel-pending-shell ${hasPendingIntel ? 'has-pending' : 'is-empty'}">
                  ${hasPendingIntel ? `
                    <div class="intel-pending-editor">
                      ${makeInlineEditableValue(pendingIntelContentValue, {
                          path: [...knowledgeRequestPath, 'content'],
                          kind: 'string',
                          rawValue: pendingIntelContentValue,
                          multiline: true,
                      })}
                    </div>
                    <div class="intel-pending-impact">
                      <b>影响权重</b>
                      <span>
                        ${knowledgeRequestPath.length
                          ? makeInlineEditableValue(String(pendingIntelImpactValue), {
                              path: [...knowledgeRequestPath, 'impact'],
                              kind: 'number',
                              rawValue: pendingIntelImpactValue,
                              editorMeta: { min: 0, max: 10, integer: true, hint: '范围 0 - 10 · 整数' },
                            })
                          : htmlEscape(String(snapshot.pendingIntelImpact))}
                      </span>
                    </div>
                  ` : `
                    <div class="intel-empty-state">
                      <div class="intel-empty-state-mark">◈</div>
                      <div class="intel-empty-state-copy">当前没有等待解锁的线索</div>
                    </div>
                  `}
                </div>
              </div>

              <div class="archive-card intel-overview-card">
                <div class="archive-card-head"><div class="archive-card-title">情报概览</div></div>
                ${makeTileGrid([
                  { label: '已解锁', value: String(snapshot.unlockedKnowledges.length) },
                  { label: '待解锁', value: hasPendingIntel ? `1 / +${snapshot.pendingIntelImpact}` : '0' },
                  { label: '任务记录', value: String(snapshot.questRecordCount) },
                  { label: '交战目标', value: String(snapshot.combatHistoryEntries.length) }
                ], 'two')}
              </div>

              <div class="archive-card intel-combat-card">
                <div class="archive-card-head"><div class="archive-card-title">交战档案</div></div>
                ${makeTileGrid([
                  { label: '记录目标', value: String(snapshot.combatHistoryEntries.length) },
                  { label: '累计交战', value: String(combatHistoryTotalCount) },
                  { label: '最近目标', value: latestCombatTarget },
                  { label: '最近结果', value: latestCombatResult }
                ], 'two')}
                <div class="intel-combat-summary">
                  <div class="simple-sub" style="margin: 0 0 6px;">按目标聚合</div>
                  <div class="intel-combat-list">
                    ${combatHistoryCards.map(c => `
                      <div class="intel-combat-row">
                        <b>${htmlEscape(c.title)}</b>
                        <span>${htmlEscape(c.desc)}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>

            <div class="archive-card intel-unlocked-card" style="margin-top: 12px;">
              <div class="archive-card-head">
                <div class="archive-card-title">已解锁情报列表</div>
                <span class="state-tag live">${unlockedIntelPage.items.length} 条</span>
              </div>
              <div class="intel-list-grid" style="padding: 10px; display: grid; gap: 10px;">
                ${activeCharKey ? `
                  <div class="intel-card intel-card-add">
                    <div class="request-console-row intel-add-row" data-collection-panel="intel-create">
                      <input type="text" class="request-console-input intel-add-input" data-collection-input="intel-text" placeholder="新增情报内容（支持长文本）" />
                      <button type="button" class="tag-chip live intel-add-btn" data-collection-action="add-intel" data-collection-char="${escapeHtmlAttr(activeCharKey)}">新增</button>
                    </div>
                  </div>
                ` : ''}
                ${unlockedIntelHtml}
                
                ${unlockedIntelPage.totalPages > 1 ? `
                  <div class="tag-cloud" style="margin-top: 8px; justify-content: flex-end;">
                    <button type="button" class="tag-chip" data-pagination="intel-records" data-page="${unlockedIntelPage.currentPage - 1}" ${unlockedIntelPage.currentPage <= 1 ? 'disabled style="opacity:0.3;"' : ''}>上一页</button>
                    <span class="tag-chip">第 ${unlockedIntelPage.currentPage} / ${unlockedIntelPage.totalPages} 页</span>
                    <button type="button" class="tag-chip" data-pagination="intel-records" data-page="${unlockedIntelPage.currentPage + 1}" ${unlockedIntelPage.currentPage >= unlockedIntelPage.totalPages ? 'disabled style="opacity:0.3;"' : ''}>下一页</button>
                  </div>
                ` : ''}
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
        const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '');
        const armor = deepGet(snapshot, 'activeChar.装备.斗铠', {});
        const mech = deepGet(snapshot, 'activeChar.装备.机甲', {});
        const weapon = deepGet(snapshot, 'activeChar.装备.武器', {});
        const accessories = deepGet(snapshot, 'activeChar.装备.饰品', {});
        const accessoryEntries = listAccessoryEntries(accessories);
        const armorPath = activeCharKey ? ['char', activeCharKey, '装备', '斗铠'] : [];
        const mechPath = activeCharKey ? ['char', activeCharKey, '装备', '机甲'] : [];
        const weaponPath = activeCharKey ? ['char', activeCharKey, '装备', '武器'] : [];
        const accessoriesPath = activeCharKey ? ['char', activeCharKey, '装备', '饰品'] : [];
        const jobs = safeEntries(deepGet(snapshot, 'activeChar.职业', {}));
        const isPlayerControlled = isSnapshotPlayerControlled(snapshot);
        const armorSummary = toNumber(armor.等级, 0) > 0 ? `${toText(armor.名称, `${armor.等级}字斗铠`)} / ${toText(armor.装备状态, '未装备')}` : '未装备';
        const mechSummary = toText(mech.等级, '无') !== '无' ? `${toText(mech.等级, '无')}·${toText(mech.型号, '未定型')} / ${toText(mech.装备状态, '未装备')}` : '未部署';
        const weaponSummary = weapon && (weapon.名称 || weapon['名称']) ? `${toText(weapon.名称 || weapon['名称'], '无')} / ${toText(weapon.品阶 || weapon['品阶'], '无品阶')}` : '无';
        const accessorySummary = summarizeAccessoryEntries(accessoryEntries);
        const jobSummary = jobs.length ? jobs.slice(0, 2).map(([name, info]) => `${name} Lv.${toText(info && info.等级, 0)}`).join(' / ') : '未掌握';
        const jobCoreTechSummary = jobs.length ? (Object.keys(deepGet(jobs[0][1], '核心技艺', {})).slice(0, 2).join(' / ') || '暂无核心技术') : '暂无核心技术';
        const jobLimitSummary = jobs.length ? `融锻上限 ${toText(deepGet(jobs[0][1], '限制.最大融合数', 1), '1')} / 成功率 ${toText(deepGet(jobs[0][1], '限制.成功率', 0), '0')}%` : '暂无工坊上限';
        const battleForm = `${toText(deepGet(snapshot, 'activeChar.状态.行动', '日常'), '日常')} / ${toText(deepGet(snapshot, 'activeChar.状态.当前领域', '常态'), '常态')}`;
        const armorExists = toNumber(armor.等级, 0) > 0 || !!toText(armor.名称 || armor['名称'], '');
        const mechExists = toText(mech.等级, '无') !== '无' || !!toText(mech.型号, '');
        const armorEquipped = toText(armor.装备状态, '未装备') === '已装备';
        const mechEquipped = toText(mech.装备状态, '未装备') === '已装备';
        const armorBonusItems = buildStatsBonusItems(deepGet(armor, '_属性加成', deepGet(armor, '属性加成', {})), { includeLvEquiv: true });
        const mechBonusItems = buildStatsBonusItems(deepGet(mech, '_属性加成', deepGet(mech, '属性加成', {})));
        const weaponBonusItems = buildStatsBonusItems(deepGet(weapon, '属性加成', {}));
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
            title: toText(armor.名称, '斗铠详情'),
            summary: '',
            body: `
              <div class="equipment-layout">
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">斗铠详情</div></div>
                  ${makeTileGrid([
                    { label: '名称', value: armorPath.length
                      ? makeInlineEditableValue(toText(armor.名称, '无'), {
                          path: [...armorPath, '名称'],
                          kind: 'string',
                          rawValue: toText(armor.名称, '无'),
                        })
                      : htmlEscape(toText(armor.名称, '无')) },
                    { label: '字级', value: armorPath.length
                      ? makeInlineEditableValue(toNumber(armor.等级, 0) > 0 ? `${toNumber(armor.等级, 0)}字斗铠` : '无', {
                          path: [...armorPath, '等级'],
                          kind: 'number',
                          rawValue: toNumber(armor.等级, 0),
                          editorMeta: { min: 0, max: 4, integer: true, hint: '范围 0 - 4 · 整数' },
                        })
                      : htmlEscape(toNumber(armor.等级, 0) > 0 ? `${toNumber(armor.等级, 0)}字斗铠` : '无') },
                    { label: '领域', value: armorPath.length
                      ? makeInlineEditableValue(toText(armor.领域, '无'), {
                          path: [...armorPath, '领域'],
                          kind: 'string',
                          rawValue: toText(armor.领域, '无'),
                        })
                      : htmlEscape(toText(armor.领域, '无')) },
                    { label: '装备状态', value: armorPath.length
                      ? makeInlineEditableValue(toText(armor.装备状态, '未装备'), {
                          path: [...armorPath, '装备状态'],
                          kind: 'enum_select',
                          rawValue: toText(armor.装备状态, '未装备'),
                          editorMeta: { options: ['未装备', '已装备'] },
                        })
                      : htmlEscape(toText(armor.装备状态, '未装备')) }
                  ])}
                </div>
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">斗铠加成</div></div>
                  ${makeTileGrid(armorBonusItems)}
                </div>
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">斗铠部件</div></div>
                  ${makeInteractiveFigureBoard(toText(armor.名称, '斗铠'), armorSlots, { preview: '武装详情：斗铠' })}
                </div>
                ${isPlayerControlled && armorExists ? `
                  <div class="archive-card full">
                    <div class="tag-cloud armory-quick-actions" style="justify-content:flex-end;">
                      <button type="button" class="relation-action-btn equipment-action-btn" data-equipment-action="unequip" data-equipment-char="${escapeHtmlAttr(activeCharKey)}" data-equipment-kind="armor">卸下斗铠</button>
                    </div>
                  </div>
                ` : ''}
              </div>
            `
          };
        }

        if (previewKey === '武装详情：机甲') {
          return {
            title: mechExists ? toText(mech.型号, '机甲详情') : '机甲详情',
            summary: '',
            body: `
              <div class="archive-modal-grid">
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">机甲详情</div></div>
                  ${makeTileGrid([
                    { label: '级别', value: mechPath.length
                      ? makeInlineEditableValue(toText(mech.等级, '无'), {
                          path: [...mechPath, '等级'],
                          kind: 'string',
                          rawValue: toText(mech.等级, '无'),
                        })
                      : htmlEscape(toText(mech.等级, '无')) },
                    { label: '类型', value: mechPath.length
                      ? makeInlineEditableValue(toText(mech.型号, '无'), {
                          path: [...mechPath, '型号'],
                          kind: 'string',
                          rawValue: toText(mech.型号, '无'),
                        })
                      : htmlEscape(toText(mech.型号, '无')) },
                    { label: '机体状态', value: mechPath.length
                      ? makeInlineEditableValue(toText(mech.状态, '完好'), {
                          path: [...mechPath, '状态'],
                          kind: 'string',
                          rawValue: toText(mech.状态, '完好'),
                        })
                      : htmlEscape(toText(mech.状态, '完好')) },
                    { label: '装备状态', value: mechPath.length
                      ? makeInlineEditableValue(toText(mech.装备状态, '未装备'), {
                          path: [...mechPath, '装备状态'],
                          kind: 'enum_select',
                          rawValue: toText(mech.装备状态, '未装备'),
                          editorMeta: { options: ['未装备', '已装备'] },
                        })
                      : htmlEscape(toText(mech.装备状态, '未装备')) },
                    { label: '机载武器', value: mechPath.length
                      ? makeInlineEditableValue(toText(mech.武装, '无'), {
                          path: [...mechPath, '武装'],
                          kind: 'string',
                          rawValue: toText(mech.武装, '无'),
                        })
                      : htmlEscape(toText(mech.武装, '无')) },
                    { label: '品质系数', value: mechPath.length
                      ? makeInlineEditableValue(String(toNumber(deepGet(mech, '品质系数', 1), 1)), {
                          path: [...mechPath, '品质系数'],
                          kind: 'number',
                          rawValue: toNumber(deepGet(mech, '品质系数', 1), 1),
                          editorMeta: { min: 0.8, max: 2, step: 0.1, hint: '范围 0.8 - 2.0 · 可输入小数 · 步长 0.1' },
                        })
                      : htmlEscape(String(toNumber(deepGet(mech, '品质系数', 1), 1))) }
                  ])}
                </div>
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">机甲加成</div></div>
                  ${makeTileGrid(mechBonusItems)}
                </div>
                ${isPlayerControlled && mechExists ? `
                  <div class="archive-card full">
                    <div class="tag-cloud armory-quick-actions" style="justify-content:flex-end;">
                      <button type="button" class="relation-action-btn equipment-action-btn" data-equipment-action="unequip" data-equipment-char="${escapeHtmlAttr(activeCharKey)}" data-equipment-kind="mech">卸下机甲</button>
                    </div>
                  </div>
                ` : ''}
              </div>
            `
          };
        }

        if (previewKey === '武装详情：主武器') {
          return {
            title: toText(weapon.名称 || weapon['名称'], '主武器详情'),
            summary: '',
            body: `
              <div class="archive-modal-grid">
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">主武器详情</div></div>
                  ${makeTileGrid([
                    { label: '名称', value: weaponPath.length
                      ? makeInlineEditableValue(toText(weapon.名称, '无'), {
                          path: [...weaponPath, '名称'],
                          kind: 'string',
                          rawValue: toText(weapon.名称, '无'),
                        })
                      : htmlEscape(toText(weapon.名称, '无')) },
                    { label: '品阶', value: weaponPath.length
                      ? makeInlineEditableValue(toText(weapon.品阶, '无'), {
                          path: [...weaponPath, '品阶'],
                          kind: 'string',
                          rawValue: toText(weapon.品阶, '无'),
                        })
                      : htmlEscape(toText(weapon.品阶, '无')) },
                    { label: '特性数', value: String(Object.keys(deepGet(weapon, '特性', {})).length) },
                    { label: '主要特性', value: Object.keys(deepGet(weapon, '特性', {})).slice(0, 2).join(' / ') || '无' }
                  ])}
                </div>
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">武器加成</div></div>
                  ${makeTileGrid(weaponPath.length ? buildEditableStatBonusItems([...weaponPath, '属性加成'], deepGet(weapon, '属性加成', {})) : weaponBonusItems)}
                </div>
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">武器特性</div></div>
                  ${makeTimelineStack(safeEntries(deepGet(weapon, '特性', {})).length ? safeEntries(deepGet(weapon, '特性', {})).map(([name, item]) => ({
                    title: htmlEscape(name),
                    desc: weaponPath.length
                      ? makeInlineEditableValue(toText(deepGet(item, '描述', '无'), '无'), {
                          path: [...weaponPath, '特性', name, '描述'],
                          kind: 'string',
                          rawValue: toText(deepGet(item, '描述', '无'), '无'),
                          multiline: true,
                        })
                      : htmlEscape(toText(deepGet(item, '描述', '无'), '无'))
                  })) : [{ title: '暂无武器特性', desc: '当前主武器未记录额外特性。' }])}
                </div>
                ${isPlayerControlled && (weapon && (weapon.名称 || weapon['名称'])) ? `
                  <div class="archive-card full">
                    <div class="tag-cloud armory-quick-actions" style="justify-content:flex-end;">
                      <button type="button" class="relation-action-btn equipment-action-btn" data-equipment-action="unequip" data-equipment-char="${escapeHtmlAttr(activeCharKey)}" data-equipment-kind="wpn">卸下主武器</button>
                    </div>
                  </div>
                ` : ''}
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
                      ? safeEntries(accessories).map(([name, item]) => ({
                          title: htmlEscape(name),
                          desc: accessoriesPath.length
                            ? makeInlineEditableValue(toText(deepGet(item, '描述', '无'), '无'), {
                                path: [...accessoriesPath, name, '描述'],
                                kind: 'string',
                                rawValue: toText(deepGet(item, '描述', '无'), '无'),
                                multiline: true,
                              })
                            : htmlEscape(toText(deepGet(item, '描述', '无'), '无'))
                        }))
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
                ${isPlayerControlled && accessoryEntries.length ? `
                  <div class="archive-card full">
                    <div class="tag-cloud armory-quick-actions" style="justify-content:flex-end;">
                      ${accessoryEntries.map(item => `<button type="button" class="relation-action-btn equipment-action-btn" data-equipment-action="unequip" data-equipment-char="${escapeHtmlAttr(activeCharKey)}" data-equipment-kind="accessory" data-equipment-name="${escapeHtmlAttr(item.name)}">拆卸 ${htmlEscape(item.name)}</button>`).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            `
          };
        }

        if (String(previewKey || '').startsWith('斗铠部件：')) {
          const slotName = String(previewKey).replace('斗铠部件：', '');
          const partData = resolveArmorPartData(armor, slotName);
          const partPath = armorPath.length ? [...armorPath, '部件', slotName] : [];
          const fallbackPartItems = [
            { label: '部位', value: slotName },
            { label: '记录', value: '当前未记录独立部件属性' },
            { label: '所属斗铠', value: armorSummary },
            { label: '附件状态', value: slotName === '戒指' ? accessorySummary : toText(armor.装备状态, '未装备') }
          ];
          return {
            title: `${slotName}详情`,
            summary: '',
            body: `
              <div class="archive-modal-grid" style="grid-template-columns:1fr;">
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">${slotName}</div></div>
                  ${makeTileGrid(partData ? [
                    { label: '状态', value: partPath.length
                      ? makeInlineEditableValue(toText(partData['状态'], '未打造'), {
                          path: [...partPath, '状态'],
                          kind: 'string',
                          rawValue: toText(partData['状态'], '未打造'),
                        })
                      : htmlEscape(toText(partData['状态'], '未打造')) },
                    { label: '品质系数', value: partPath.length
                      ? makeInlineEditableValue(String(toNumber(partData['品质系数'], 1)), {
                          path: [...partPath, '品质系数'],
                          kind: 'number',
                          rawValue: toNumber(partData['品质系数'], 1),
                          editorMeta: { min: 0.8, max: 2, step: 0.1, hint: '范围 0.8 - 2.0 · 可输入小数 · 步长 0.1' },
                        })
                      : htmlEscape(String(toNumber(partData['品质系数'], 1))) },
                    { label: '所属斗铠', value: toText(armor.名称, '无') },
                    { label: '装配状态', value: armorPath.length
                      ? makeInlineEditableValue(toText(armor.装备状态, '未装备'), {
                          path: [...armorPath, '装备状态'],
                          kind: 'enum_select',
                          rawValue: toText(armor.装备状态, '未装备'),
                          editorMeta: { options: ['未装备', '已装备'] },
                        })
                      : htmlEscape(toText(armor.装备状态, '未装备')) }
                  ] : fallbackPartItems)}
                </div>
              </div>
            `
          };
        }

        const getBoneBonus = (age, part) => {
          let rb = {
            力量: Math.floor(age * 0.05),
            防御: Math.floor(age * 0.05),
            敏捷: Math.floor(age * 0.05),
            体力上限: Math.floor(age * 0.05),
            精神力上限: Math.floor(age * 0.01),
            魂力上限: Math.floor(age * 0.1),
          };
          let bonus = { ...rb };
          if (part === "躯干魂骨") { bonus.力量 *= 2; bonus.防御 *= 2; bonus.敏捷 *= 2; bonus.体力上限 *= 2; bonus.魂力上限 *= 2; }
          else if (part === "头部魂骨") { bonus.精神力上限 *= 2; }
          else if (part === "左腿魂骨" || part === "右腿魂骨") { bonus.敏捷 *= 2; }
          else if (part === "左臂魂骨" || part === "右臂魂骨") { bonus.力量 *= 2; }
          return bonus;
        };

        const soulBoneCards = (snapshot.soulBoneEntries && snapshot.soulBoneEntries.length ? snapshot.soulBoneEntries.slice(0, 6) : [['暂无魂骨装载', { empty: true }]]).map(([slot, bone]) => {
          if (bone && bone.empty) {
            return { title: slot, desc: '尚未装载魂骨。' };
          }
          const boneName = toText(bone && (bone.name || bone['名称'] || bone['表象名称']), slot);
          const age = toText(bone && (bone['年限'] || bone.age), '');
          const quality = toText(bone && (bone['品质'] || bone['品阶']), '');
          let descText = `${toText(bone && (bone['状态']), '已装载')}`;
          if (age || quality) descText += ` ｜ ${[age ? `${age}年` : '', quality].filter(Boolean).join(' ')}`;
          
          const realAge = toNumber(age, 0);
          if (realAge > 0) {
            const stats = getBoneBonus(realAge, slot);
            const statParts = [];
            if (stats.力量) statParts.push(`力+${formatNumber(stats.力量)}`);
            if (stats.防御) statParts.push(`防+${formatNumber(stats.防御)}`);
            if (stats.敏捷) statParts.push(`敏+${formatNumber(stats.敏捷)}`);
            if (stats.体力上限) statParts.push(`体+${formatNumber(stats.体力上限)}`);
            if (stats.精神力上限) statParts.push(`精+${formatNumber(stats.精神力上限)}`);
            if (statParts.length) descText += ` ｜ 属性加成: ${statParts.join(' ')}`;
          }

          const skillsObj = bone && bone['附带技能'];
          if (skillsObj && Object.keys(skillsObj).length) {
            const parsedSkills = buildSkillList(skillsObj, {
              basePath: ['char', snapshot.activeName, '魂骨', slot, '附带技能'],
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
                  dispatchUiAiRequest(actionData.playerInput, actionData.systemPrompt, { requestKind: actionData.requestKind });
                }
              });
            }
          }
        };
      }


      if (previewKey === '储物仓库详细页') {
        const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '');
        const inventoryCells = snapshot.inventoryEntries
          .sort((a, b) => toNumber(deepGet(b[1], '市场估值.价格', b[1] && b[1]['数量']), 0) - toNumber(deepGet(a[1], '市场估值.价格', a[1] && a[1]['数量']), 0))
          .slice(0, 18)
          .map(([name, item]) => ({
            charKey: activeCharKey,
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
        const inventoryOverviewPage = paginateModalItems(snapshot.inventoryEntries, previewKey, 'inventory-overview', 8);
        const inventoryOverviewCards = (inventoryOverviewPage.items.length ? inventoryOverviewPage.items : [['暂无物品', null]]).map(([name, item]) => {
          if (!item || typeof item !== 'object') {
            return {
              title: '暂无物品',
              desc: '未知'
            };
          }
          const itemPath = activeCharKey ? ['char', activeCharKey, '背包', name] : [];
          const typeValue = toText(item && item['类型'], '物品');
          const qtyValue = toNumber(item && item['数量'], 1);
          const qualityValue = toText(item && item['品质'], '无');
          const tierValue = toText(item && item['品阶'], '无');
          const triggerValue = toText(item && item['触发方式'], /食物/.test(typeValue) ? '食用' : '常规');
          const slotValue = toText(item && item['装备槽位'], '无');
          const sourceValue = toText(item && item['来源技能'], '无');
          const binderValue = toText(item && item['绑定者'], '无');
          const tagsValue = Array.isArray(item && item['标签']) ? item['标签'] : [];
          const descValue = toText(item && item['描述'], '暂无说明');
          const priceValue = toNumber(deepGet(item, ['市场估值', '价格'], 0), 0);
          const currencyValue = toText(deepGet(item, ['市场估值', '货币'], '联邦币'), '联邦币');
          const durabilityCurrent = toNumber(deepGet(item, ['耐久', '当前'], 0), 0);
          const durabilityMax = toNumber(deepGet(item, ['耐久', '上限'], 0), 0);
          const canEquipItem = !!(window.EquipmentManager && window.EquipmentManager.parseEquipSlot(name, item));
          const lineOne = [
            `数量 ${itemPath.length ? makeInlineEditableValue(String(qtyValue), { path: [...itemPath, '数量'], kind: 'number', rawValue: qtyValue, editorMeta: { min: 1, integer: true, hint: '最小 1 · 整数' } }) : htmlEscape(String(qtyValue))}`,
            `类型 ${itemPath.length ? makeInlineEditableValue(typeValue, { path: [...itemPath, '类型'], kind: 'string', rawValue: typeValue }) : htmlEscape(typeValue)}`,
            `槽位 ${itemPath.length ? makeInlineEditableValue(slotValue, { path: [...itemPath, '装备槽位'], kind: 'string', rawValue: slotValue }) : htmlEscape(slotValue)}`,
            `触发 ${itemPath.length ? makeInlineEditableValue(triggerValue, { path: [...itemPath, '触发方式'], kind: 'string', rawValue: triggerValue }) : htmlEscape(triggerValue)}`
          ].join(' ｜ ');
          const lineTwo = [
            `品质 ${itemPath.length ? makeInlineEditableValue(qualityValue, { path: [...itemPath, '品质'], kind: 'string', rawValue: qualityValue }) : htmlEscape(qualityValue)}`,
            `品阶 ${itemPath.length ? makeInlineEditableValue(tierValue, { path: [...itemPath, '品阶'], kind: 'string', rawValue: tierValue }) : htmlEscape(tierValue)}`,
            `来源技能 ${itemPath.length ? makeInlineEditableValue(sourceValue, { path: [...itemPath, '来源技能'], kind: 'string', rawValue: sourceValue }) : htmlEscape(sourceValue)}`,
            `绑定者 ${itemPath.length ? makeInlineEditableValue(binderValue, { path: [...itemPath, '绑定者'], kind: 'string', rawValue: binderValue }) : htmlEscape(binderValue)}`
          ].join(' ｜ ');
          const lineThree = [
            `标签 ${itemPath.length ? makeInlineEditableValue(tagsValue.join('、') || '无', { path: [...itemPath, '标签'], kind: 'string_list', rawValue: tagsValue }) : htmlEscape(tagsValue.join('、') || '无')}`,
            `市价 ${itemPath.length ? makeInlineEditableValue(String(priceValue), { path: [...itemPath, '市场估值', '价格'], kind: 'number', rawValue: priceValue, editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' } }) : htmlEscape(String(priceValue))}`,
            `货币 ${htmlEscape(({
              fed_coin: '联邦币',
              star_coin: '星罗币',
              tang_pt: '唐门积分',
              shrek_pt: '学院积分',
              blood_pt: '血神功勋'
            }[currencyValue] || currencyValue))}`
          ].join(' ｜ ');
          const lineFour = (durabilityCurrent > 0 || durabilityMax > 0)
            ? [
                `耐久当前 ${itemPath.length ? makeInlineEditableValue(String(durabilityCurrent), { path: [...itemPath, '耐久', '当前'], kind: 'number', rawValue: durabilityCurrent, editorMeta: { min: 0, max: durabilityMax > 0 ? durabilityMax : null, integer: true, hint: durabilityMax > 0 ? `范围 0 - ${formatNumber(durabilityMax)} · 整数` : '最小 0 · 整数' } }) : htmlEscape(String(durabilityCurrent))}`,
                `耐久上限 ${itemPath.length ? makeInlineEditableValue(String(durabilityMax), { path: [...itemPath, '耐久', '上限'], kind: 'number', rawValue: durabilityMax, editorMeta: { min: Math.max(0, durabilityCurrent), integer: true, hint: `最小 ${formatNumber(Math.max(0, durabilityCurrent))} · 整数` } }) : htmlEscape(String(durabilityMax))}`
              ].join(' ｜ ')
            : '';
          const descLine = `描述 ${itemPath.length
            ? makeInlineEditableValue(descValue, {
                path: [...itemPath, '描述'],
                kind: 'string',
                rawValue: descValue,
                multiline: true,
              })
            : htmlEscape(descValue)}`;
          const actionLine = itemPath.length
            ? `
              <div class="request-console-row" style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;">
                ${canEquipItem
                  ? `<button type="button" class="tag-chip live inventory-hover-action-btn" data-inventory-action="equip" data-inventory-char="${escapeHtmlAttr(activeCharKey)}" data-inventory-item="${escapeHtmlAttr(name)}">装备</button>`
                  : ''}
                <button type="button" class="tag-chip inventory-hover-action-btn" data-inventory-action="discard" data-inventory-mode="one" data-inventory-char="${escapeHtmlAttr(activeCharKey)}" data-inventory-item="${escapeHtmlAttr(name)}">丢弃1件</button>
                <button type="button" class="tag-chip inventory-hover-action-btn" data-inventory-action="discard" data-inventory-mode="all" data-inventory-char="${escapeHtmlAttr(activeCharKey)}" data-inventory-item="${escapeHtmlAttr(name)}">${qtyValue > 1 ? '全部丢弃' : '丢弃'}</button>
              </div>
            `
            : '';
          return {
            title: `${htmlEscape(name)} / ${htmlEscape(typeValue)}`,
            desc: [lineOne, lineTwo, lineThree, lineFour, descLine, actionLine].filter(Boolean).join('<br>')
          };
        });
        return {
          title: '储物仓库',
          summary: '当前背包、货币与核心物资。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">钱包条</div></div>
                ${makeWalletStrip([
                  { label: '联邦币', value: makeInlineEditableValue(formatNumber(wealth.联邦币), { path: ['char', activeCharKey, '财富', '联邦币'], kind: 'number', rawValue: wealth.联邦币, editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' } }), className: 'gold' },
                  { label: '星罗币', value: makeInlineEditableValue(formatNumber(wealth.星罗币), { path: ['char', activeCharKey, '财富', '星罗币'], kind: 'number', rawValue: wealth.星罗币, editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' } }), className: 'cyan' },
                  { label: '唐门积分', value: makeInlineEditableValue(formatNumber(wealth.唐门积分), { path: ['char', activeCharKey, '财富', '唐门积分'], kind: 'number', rawValue: wealth.唐门积分, editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' } }), className: 'cyan' },
                  { label: '学院积分', value: makeInlineEditableValue(formatNumber(wealth.学院积分), { path: ['char', activeCharKey, '财富', '学院积分'], kind: 'number', rawValue: wealth.学院积分, editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' } }), className: 'cyan' },
                  { label: '战功', value: makeInlineEditableValue(formatNumber(wealth.战功), { path: ['char', activeCharKey, '财富', '战功'], kind: 'number', rawValue: wealth.战功, editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' } }), className: 'red' }
                ])}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">物资细项总览</div><span class="state-tag ${snapshot.inventoryEntries.length ? 'live' : 'warn'}">${snapshot.inventoryEntries.length ? `${snapshot.inventoryEntries.length} 件` : '空'}</span></div>
                ${activeCharKey ? `
                  <div class="request-console-row" data-collection-panel="inventory-create" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px;">
                    <input class="request-console-input" style="margin:0; flex:1 1 180px;" data-collection-input="item-name" value="" placeholder="物品名" />
                    <input type="number" min="1" class="request-console-input" style="margin:0; width:90px; flex:0 0 90px;" data-collection-input="item-qty" value="1" placeholder="数量" />
                    <input class="request-console-input" style="margin:0; flex:0 1 140px;" data-collection-input="item-type" value="物品" placeholder="类型" />
                    <input class="request-console-input" style="margin:0; flex:1 1 220px;" data-collection-input="item-desc" value="" placeholder="描述" />
                    <button type="button" class="tag-chip live" data-collection-action="add-item" data-collection-char="${escapeHtmlAttr(activeCharKey)}">新增</button>
                  </div>
                ` : ''}
                ${makeTimelineStack(inventoryOverviewCards)}
                ${makeModalPaginationControls('inventory-overview', inventoryOverviewPage.page, inventoryOverviewPage.totalPages, inventoryOverviewPage.total)}
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
                  <h4>${config.spiritPath && config.spiritPath.length
                    ? makeInlineEditableValue(config.spiritName, { path: [...config.spiritPath, '表象名称'], kind: 'string', rawValue: config.spiritName })
                    : htmlEscape(config.spiritName)}</h4>
                  <div class="spirit-head-tags">
                    <span class="tag-chip ${config.badgeClass === 'gold' ? 'warn' : 'live'}">${htmlEscape(config.badge)}</span>
                    <span class="tag-chip">${config.spiritPath && config.spiritPath.length
                      ? makeInlineEditableValue(config.spiritType, { path: [...config.spiritPath, 'type'], kind: 'string', rawValue: config.spiritType })
                      : htmlEscape(config.spiritType)}</span>
                    <span class="tag-chip">${config.spiritPath && config.spiritPath.length
                      ? makeInlineEditableValue(`属性：${config.spiritElement}`, {
                        path: [...config.spiritPath, '属性体系'],
                        kind: 'enum_select',
                        rawValue: config.spiritElement,
                        editorMeta: { options: SPIRIT_ATTRIBUTE_SYSTEM_OPTIONS }
                      })
                      : htmlEscape(`属性：${config.spiritElement}`)}</span>
                    <span class="tag-chip">${htmlEscape(`魂灵：${toNumber(config.soulCount, 0)}`)}</span>
                  </div>
                  <div style="margin-top:12px;font-size:12px;line-height:1.8;color:var(--color-text-secondary);">
                    <b style="display:block;margin-bottom:6px;color:var(--white);font-size:12px;">武魂描述</b>
                    ${config.spiritPath && config.spiritPath.length
                      ? makeInlineEditableValue(config.spiritDesc, { path: [...config.spiritPath, '描述'], kind: 'string', rawValue: config.spiritDesc, multiline: true })
                      : htmlEscape(config.spiritDesc)}
                  </div>
                  <div class="soul-meta" style="margin-top:12px;">
                    <div class="meta-item"><b>已解锁属性</b><span>${config.spiritPath && config.spiritPath.length
                      ? makeInlineEditableValue(config.spiritUnlockedAttrs.join('、') || '未设置', {
                        path: [...config.spiritPath, '已解锁属性'],
                        kind: 'token_multi',
                        rawValue: config.spiritUnlockedAttrs,
                        editorMeta: { options: config.spiritElement === '五行' ? WUXING_ATTRIBUTE_TOKEN_OPTIONS : SPIRIT_ATTRIBUTE_TOKEN_OPTIONS }
                      })
                      : htmlEscape(config.spiritUnlockedAttrs.join('、') || '未设置')}</span></div>
                    <div class="meta-item"><b>可容纳属性</b><span>${config.spiritPath && config.spiritPath.length
                      ? makeInlineEditableValue(config.spiritCapacityAttrs.join('、') || '未设置', {
                        path: [...config.spiritPath, '可容纳属性'],
                        kind: 'token_multi',
                        rawValue: config.spiritCapacityAttrs,
                        editorMeta: { options: config.spiritElement === '五行' ? WUXING_ATTRIBUTE_TOKEN_OPTIONS : SPIRIT_ATTRIBUTE_TOKEN_OPTIONS }
                      })
                      : htmlEscape(config.spiritCapacityAttrs.join('、') || '未设置')}</span></div>
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
                        <div class="meta-item"><b>魂灵名</b><span>${soul.path && soul.path.length
                          ? makeInlineEditableValue(soul.spiritName, { path: [...soul.path, '表象名称'], kind: 'string', rawValue: soul.spiritName })
                          : htmlEscape(soul.spiritName)}</span></div>
                        <div class="meta-item"><b>品质</b><span>${soul.path && soul.path.length
                          ? makeInlineEditableValue(soul.quality, { path: [...soul.path, '品质'], kind: 'string', rawValue: soul.quality })
                          : htmlEscape(soul.quality)}</span></div>
                        <div class="meta-item"><b>状态</b><span>${soul.path && soul.path.length
                          ? makeInlineEditableValue(soul.state, { path: [...soul.path, '状态'], kind: 'string', rawValue: soul.state })
                          : htmlEscape(soul.state)}</span></div>
                        <div class="meta-item"><b>年限</b><span>${soul.path && soul.path.length
                          ? makeInlineEditableValue(soul.age, { path: [...soul.path, '年限'], kind: 'number', rawValue: soul.ageValue, editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' } })
                          : htmlEscape(soul.age)}</span></div>
                        <div class="meta-item"><b>契合度</b><span>${soul.path && soul.path.length
                          ? makeInlineEditableValue(soul.comp, { path: [...soul.path, '契合度'], kind: 'number', rawValue: soul.compValue, editorMeta: { min: 0, max: 100, integer: true, hint: '范围 0 - 100 · 整数' } })
                          : htmlEscape(soul.comp)}</span></div>
                      </div>
                      <div style="margin-top:12px;font-size:12px;line-height:1.8;color:var(--color-text-secondary);">
                        <b style="display:block;margin-bottom:6px;color:var(--white);font-size:12px;">魂灵描述</b>
                        ${soul.path && soul.path.length
                          ? makeInlineEditableValue(soul.description, { path: [...soul.path, '描述'], kind: 'string', rawValue: soul.description, multiline: true })
                          : htmlEscape(soul.description)}
                      </div>
                      ${soul.魂环.length ? `
                        <div class="soul-ring-section">
                          <div class="rings soul-ring-lane">
                            ${soul.魂环.map(ring => `<div class="ring ${ring.ringClass} interactive-ring">${htmlEscape(ring.glyph)}${buildRingHoverMarkup(ring)}</div>`).join('')}
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

      if (previewKey === '武魂融合技详细页') {
        const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '');
        const fusionArchiveMeta = getFusionArchiveMeta(snapshot);
        const { fusionEntries, partnerCount, selfCount } = fusionArchiveMeta;
        const getFusionRecordParticipants = fusion => normalizeSkillDesignerFusionParticipantList(
          getSkillDesignerRawFusionParticipants({}, fusion && typeof fusion === 'object' ? fusion : {}),
          snapshot.rootData,
        );
        const getFusionRecordModeText = fusion => {
          const safeFusion = fusion && typeof fusion === 'object' ? fusion : {};
          const participants = getFusionRecordParticipants(safeFusion);
          if (toText(safeFusion.融合模式, 'partner') === 'self') return '自体融合';
          return participants.length > 2 ? '多人融合' : '双人融合';
        };
        const getFusionRecordPartnerText = fusion => {
          const safeFusion = fusion && typeof fusion === 'object' ? fusion : {};
          const participants = getFusionRecordParticipants(safeFusion);
          if (toText(safeFusion.融合模式, 'partner') === 'self') return SKILL_DESIGNER_SELF_FUSION_PARTNER;
          const names = participants
            .filter(participant => participant.role !== 'self')
            .map(participant => participant.charName || participant.charKey)
            .filter(Boolean);
          return names.length ? Array.from(new Set(names)).join('、') : toText(safeFusion['融合对象'], '未知搭档');
        };
        const getFusionRecordParticipantText = fusion => {
          const safeFusion = fusion && typeof fusion === 'object' ? fusion : {};
          const participants = getFusionRecordParticipants(safeFusion);
          if (participants.length) {
            return participants
              .map(participant => `${participant.charName || participant.charKey || '未设置'}:${participant.spirit || '未设置'}`)
              .join(' + ');
          }
          return (Array.isArray(safeFusion.来源武魂) ? safeFusion.来源武魂 : []).filter(Boolean).join(' / ') || '未记录';
        };
        const createFusionPreview = activeCharKey
          ? buildSkillDesignerPreviewKey({
              path: ['char', activeCharKey, '武魂融合技', `武魂融合技_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`, '技能数据'],
              label: '新建武魂融合技',
              category: '武魂融合技',
              scope: 'fusion_skill',
            })
          : '';
        const leadFusionEntry = fusionEntries[0] || null;
        const leadRecordKey = leadFusionEntry ? leadFusionEntry[0] : '';
        const leadFusion = leadFusionEntry && leadFusionEntry[1] && typeof leadFusionEntry[1] === 'object' ? leadFusionEntry[1] : {};
        const leadSkillData = leadFusion.技能数据 && typeof leadFusion.技能数据 === 'object' ? leadFusion.技能数据 : {};
        const leadFusionName = leadFusionEntry
          ? toText(leadSkillData['魂技名'] || leadSkillData.name || leadFusion['名称'] || leadFusion.name || leadRecordKey, leadRecordKey || '未命名融合技')
          : '';
        const leadModeValue = toText(leadFusion.融合模式, 'partner');
        const leadModeText = getFusionRecordModeText(leadFusion);
        const leadPartnerRaw = getFusionRecordPartnerText(leadFusion);
        const leadSourceSpiritText = getFusionRecordParticipantText(leadFusion);
        const leadEffectDesc = toText(leadSkillData['效果描述'] || leadSkillData['描述'] || '', '');
        const leadVisualDesc = toText(leadSkillData['画面描述'] || '', '');
        const leadPreview = activeCharKey && leadRecordKey
          ? buildSkillDesignerPreviewKey({
              path: ['char', activeCharKey, '武魂融合技', leadRecordKey, '技能数据'],
              label: leadFusionName,
              category: '武魂融合技',
              scope: 'fusion_skill',
            })
          : '';
        const fusionList = fusionEntries.map(([recordKey, fusion]) => {
          const safeFusion = fusion && typeof fusion === 'object' ? fusion : {};
          const skillData = safeFusion.技能数据 && typeof safeFusion.技能数据 === 'object' ? safeFusion.技能数据 : {};
          const fusionName = toText(skillData['魂技名'] || skillData.name || safeFusion['名称'] || safeFusion.name || recordKey, recordKey || '未命名融合技');
          const modeText = getFusionRecordModeText(safeFusion);
          const partnerText = getFusionRecordPartnerText(safeFusion);
          const sourceSpiritText = getFusionRecordParticipantText(safeFusion);
          const effectDesc = toText(skillData['效果描述'] || skillData['描述'] || '未知', '未知');
          const visualDesc = toText(skillData['画面描述'] || '', '');
          const tags = (Array.isArray(skillData['标签']) ? skillData['标签'] : []).filter(Boolean);
          const preview = activeCharKey
            ? buildSkillDesignerPreviewKey({
                path: ['char', activeCharKey, '武魂融合技', recordKey, '技能数据'],
                label: fusionName,
                category: '武魂融合技',
                scope: 'fusion_skill',
              })
            : '';
          const descParts = [
            `<strong>${htmlEscape(modeText)} · ${htmlEscape(partnerText)}</strong>`,
            `<small>参与武魂：${htmlEscape(sourceSpiritText)}</small>`,
            effectDesc !== '未知' ? `<small>${htmlEscape(effectDesc)}</small>` : '',
            visualDesc ? `<small>${htmlEscape(visualDesc)}</small>` : '',
            tags.length ? `<small>${htmlEscape(tags.slice(0, 4).join(' / '))}</small>` : ''
          ].filter(Boolean);
          return {
            title: fusionName,
            desc: descParts.join(''),
            preview,
          };
        });
        return {
          title: '武魂融合技档案',
          summary: '集中查看当前角色的自体融合与多人融合技。',
          body: `
            <div class="archive-modal-grid dossier-shell">
              <div class="archive-card dossier-card">
                <div class="archive-card-head">
                  <div class="archive-card-title">融合技概览</div>
                  <span class="dossier-pill ${fusionEntries.length ? 'live' : 'warn'}">${fusionEntries.length ? `${fusionEntries.length} 项` : '未收录'}</span>
                </div>
                <section class="dossier-section">
                  <div class="dossier-section-title">基础统计</div>
                  ${makeDossierRows([
                    { label: '当前角色', value: htmlEscape(snapshot.activeName) },
                    { label: '融合技总数', value: htmlEscape(String(fusionEntries.length)) },
                    { label: '外部融合', value: htmlEscape(String(partnerCount)) },
                    { label: '自体融合', value: htmlEscape(String(selfCount)) }
                  ], 'dossier-row-grid--two')}
                </section>
                <section class="dossier-section">
                  <div class="dossier-section-title">当前主档</div>
                  ${fusionEntries.length
                    ? `
                      ${makeDossierRows([
                        { label: '当前招牌', value: leadPreview ? `<button type="button" class="dossier-pill live clickable" data-preview="${escapeHtmlAttr(leadPreview)}">${htmlEscape(leadFusionName)}</button>` : htmlEscape(leadFusionName) },
                        { label: '融合模式', value: activeCharKey && leadRecordKey
                          ? makeInlineEditableValue(leadModeText, {
                              path: ['char', activeCharKey, '武魂融合技', leadRecordKey, '融合模式'],
                              kind: 'string',
                              rawValue: leadModeValue,
                              editorMeta: { hint: '可填 self 或 partner' },
                            })
                          : htmlEscape(leadModeText) },
                        { label: '搭档', value: activeCharKey && leadRecordKey
                          ? makeInlineEditableValue(leadPartnerRaw, {
                              path: ['char', activeCharKey, '武魂融合技', leadRecordKey, '融合对象'],
                              kind: 'string',
                              rawValue: toText(leadFusion['融合对象'], ''),
                            })
                          : htmlEscape(leadPartnerRaw) },
                        { label: '参与武魂', value: htmlEscape(leadSourceSpiritText), className: 'dossier-row--wide' },
                        { label: '效果摘要', value: htmlEscape(leadEffectDesc || leadVisualDesc || '未记录'), className: 'dossier-row--wide' }
                      ])}
                    `
                    : `
                      ${makeDossierRows([
                        { label: '主档记录', value: '未收录' },
                        { label: '编辑入口', value: createFusionPreview ? `<button type="button" class="dossier-pill live clickable" data-preview="${escapeHtmlAttr(createFusionPreview)}">新建融合技</button>` : '暂无可编辑对象' }
                      ])}
                    `}
                </section>
              </div>
              <div class="archive-card dossier-card">
                <div class="archive-card-head">
                  <div class="archive-card-title">融合技清单</div>
                  <div class="dossier-tag-row dossier-head-actions">
                    ${createFusionPreview ? `<button type="button" class="dossier-pill live clickable" data-preview="${escapeHtmlAttr(createFusionPreview)}">新建融合技</button>` : ''}
                  </div>
                </div>
                <section class="dossier-section">
                  <div class="dossier-section-title">已收录条目</div>
                  ${fusionList.length
                    ? makeDossierList(fusionList, 'dossier-list--fusion')
                    : '<div class="dossier-empty-note">未收录融合技。</div>'}
                </section>
              </div>
            </div>
          `
        };
      }




      if (previewKey === '血脉封印详细页') {
        const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '');
        const bloodlinePath = activeCharKey ? ['char', activeCharKey, '血脉之力'] : [];
        const bloodMainSkill = snapshot.bloodline.bloodSkills[0] || null;
        const bloodlineRawName = toText(deepGet(snapshot, 'activeChar.血脉之力.血脉', '无'), '无');
        return {
          title: '血脉封印弹窗',
          summary: '血脉层级、体力魂环与当前已固化能力。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">血脉本体</div></div>
                <div class="spirit-main-card">
                  <h4>${bloodlinePath.length
                    ? makeInlineEditableValue(snapshot.bloodline.bloodline, {
                        path: [...bloodlinePath, 'bloodline'],
                        kind: 'string',
                        rawValue: bloodlineRawName,
                      })
                    : htmlEscape(snapshot.bloodline.bloodline)}</h4>
                  <div class="spirit-head-tags">
                    <span class="tag-chip warn">血脉封印</span>
                    <span class="tag-chip">${bloodlinePath.length
                      ? makeInlineEditableValue(`第${snapshot.bloodline.sealLv}层`, {
                          path: [...bloodlinePath, 'seal_lv'],
                          kind: 'number',
                          rawValue: snapshot.bloodline.sealLv,
                          editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                        })
                      : htmlEscape(`第${snapshot.bloodline.sealLv}层`)}</span>
                    <span class="tag-chip">${bloodlinePath.length
                      ? makeInlineEditableValue(snapshot.bloodline.core, {
                          path: [...bloodlinePath, 'core'],
                          kind: 'string',
                          rawValue: snapshot.bloodline.core,
                        })
                      : htmlEscape(snapshot.bloodline.core)}</span>
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
                <div class="ability-detail-card${bloodMainSkill && bloodMainSkill.preview ? ' clickable' : ''}"${bloodMainSkill && bloodMainSkill.preview ? ` data-preview="${escapeHtmlAttr(bloodMainSkill.preview)}"` : ''}>
                  <div class="ability-detail-title">${htmlEscape(bloodMainSkill ? bloodMainSkill.name : '暂无主动能力')}</div>
                  <div class="ring-hover-copy"><em>画面描述</em><span>${htmlEscape(bloodMainSkill ? bloodMainSkill.visualDesc : '未知')}</span></div>
                  <div class="ring-hover-copy"><em>效果描述</em><span>${htmlEscape(bloodMainSkill ? bloodMainSkill.effectDesc : '未知')}</span></div>
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
              ${snapshot.bloodline.魂环.length ? `
                <div class="archive-card full spirit-flow-card">
                  <div class="archive-card-head"><div class="archive-card-title">体力魂环轨道</div></div>
                  <div class="orbit-track">
                    ${snapshot.bloodline.魂环.map(ring => `<div class="ring ${ring.ringClass || 'ring-gold'} interactive-ring">${htmlEscape(ring.glyph)}${buildRingHoverMarkup(ring)}</div>`).join('')}
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
                      <div class="history-node-date">Tick ${htmlEscape(toText(item && item.触发tick, 0))}</div>
                      <div class="history-node-dot"></div>
                      <div class="history-node-label">${htmlEscape(name)}</div>
                    </div>
                  `).join('') || '<div class="history-node major"><div class="history-node-date">Tick 0</div><div class="history-node-dot"></div><div class="history-node-label">编年史未展开</div></div>'}
                </div></div>
                <div class="history-floating-card">
                  <div class="history-floating-title">${htmlEscape(focus ? `【当前锚点】${focus[0]}` : '【当前锚点】待开启')}</div>
                  <div class="history-floating-desc">${htmlEscape(focus ? toText(deepGet(focus[1], '事件', '暂无描述'), '暂无描述') : '世界时间线尚未展开。')}</div>
                </div>
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">近期详细日志</div></div>
                ${makeTimelineStack(snapshot.timelineEntries.slice(0, 5).map(([name, item]) => ({ title: `${name} / Tick ${toText(item && item.触发tick, 0)}`, desc: `${toText(item && item.状态, 'pending')} ｜ ${toText(item && item.事件, '暂无描述')}` }))) }
              </div>
            </div>
          `
        };
      }

      if (String(previewKey || '').startsWith('角色档案：')) {
        const targetName = String(previewKey).replace('角色档案：', '').trim();
        const rootChars = deepGet(snapshot, 'rootData.char', {});
        let targetCharKey = targetName;
        let targetChar = deepGet(snapshot, ['sd', 'char', targetName], null) || (rootChars && typeof rootChars === 'object' ? (rootChars[targetName] || null) : null);
        if (!targetChar && rootChars && typeof rootChars === 'object') {
          for (const [charKey, charInfo] of Object.entries(rootChars)) {
            const displayName = toText(charInfo && (charInfo.name || deepGet(charInfo, 'base.name', '')), charKey);
            if (displayName === targetName) { targetCharKey = charKey; targetChar = charInfo; break; }
          }
        }
        const targetCharPath = targetChar ? ['char', targetCharKey] : [];
        const targetStat = deepGet(targetChar, '属性', {});
        const targetSocial = deepGet(targetChar, '社交', {});
        const targetArmor = deepGet(targetChar, '装备.斗铠', {});
        const targetMech = deepGet(targetChar, '装备.机甲', {});
        const targetWeapon = deepGet(targetChar, '装备.武器', {});
        const targetAccessories = listAccessoryEntries(deepGet(targetChar, '装备.饰品', {}));
        const targetSpiritEntries = safeEntries(deepGet(targetChar, '武魂', {}));
        return {
          title: `${targetName} / 角色基本信息`,
          summary: '角色轻量信息面板：属性、武魂与装备概览。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">基础信息</div></div>
                ${makeTileGrid([
                  { label: '角色名', value: targetName || '未知' },
                  { label: '等级', value: targetChar ? formatCultivationLevelBadge(targetStat.等级, '0') : '未收录' },
                  { label: '系别', value: targetCharPath.length
                    ? makeInlineEditableValue(toText(targetStat.系别, '未知'), {
                        path: [...targetCharPath, '属性', '系别'],
                        kind: 'string',
                        rawValue: toText(targetStat.系别, '未知'),
                      })
                    : (targetChar ? toText(targetStat.系别, '未知') : '未收录') },
                  { label: '公开身份', value: targetCharPath.length
                    ? makeInlineEditableValue(toText(targetSocial.主身份, '无'), {
                        path: [...targetCharPath, '社交', '主身份'],
                        kind: 'string',
                        rawValue: toText(targetSocial.主身份, '无'),
                      })
                    : (targetChar ? toText(targetSocial.主身份, '无') : '未收录') },
                  { label: '名望', value: targetCharPath.length
                    ? makeInlineEditableValue(formatNumber(targetSocial.声望), {
                        path: [...targetCharPath, '社交', '声望'],
                        kind: 'number',
                        rawValue: toNumber(targetSocial.声望, 0),
                        editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                      })
                    : (targetChar ? formatNumber(targetSocial.声望) : '未收录') },
                  { label: '魂力', value: targetChar ? `${formatNumber(targetStat.魂力)} / ${formatNumber(targetStat.魂力上限)}` : '未收录' },
                  { label: '体力', value: targetChar ? `${formatNumber(targetStat.体力)} / ${formatNumber(targetStat.体力上限)}` : '未收录' },
                  { label: '精神力', value: targetChar ? `${formatNumber(targetStat.精神力)} / ${formatNumber(targetStat.精神力上限)}` : '未收录' },
                  { label: '力量', value: targetChar ? formatNumber(targetStat.力量) : '未收录' },
                  { label: '防御', value: targetChar ? formatNumber(targetStat.防御) : '未收录' },
                  { label: '敏捷', value: targetChar ? formatNumber(targetStat.敏捷) : '未收录' }
                ], 'three')}
              </div>
              <div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">武魂概览</div></div>${makeTimelineStack(targetSpiritEntries.length ? targetSpiritEntries.map(([spiritName, spirit]) => {
                const spiritPath = targetCharPath.length ? [...targetCharPath, '武魂', spiritName] : [];
                return {
                  title: spiritName,
                  desc: [
                    `类型 ${spiritPath.length
                      ? makeInlineEditableValue(toText(spirit && spirit.type, '未知'), {
                          path: [...spiritPath, 'type'],
                          kind: 'string',
                          rawValue: toText(spirit && spirit.type, '未知'),
                        })
                      : htmlEscape(toText(spirit && spirit.type, '未知'))}`,
                    `元素 ${spiritPath.length
                      ? makeInlineEditableValue(toText(spirit && spirit['属性体系'], '无'), {
                          path: [...spiritPath, '属性体系'],
                          kind: 'string',
                          rawValue: toText(spirit && spirit['属性体系'], '无'),
                        })
                      : htmlEscape(toText(spirit && spirit['属性体系'], '无'))}`,
                    `魂灵 ${safeEntries(deepGet(spirit, '魂灵', {})).length}`,
                  ].join(' / ')
                };
              }) : [{ title: '暂无武魂记录', desc: targetChar ? '当前角色未记录武魂数据。' : '该角色暂无角色档案。' }])}</div>
              <div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">装备概览</div></div>${makeTileGrid([
                { label: '斗铠', value: targetCharPath.length
                  ? `${makeInlineEditableValue(toText(targetArmor.名称, '无'), {
                      path: [...targetCharPath, '装备', '斗铠', '名称'],
                      kind: 'string',
                      rawValue: toText(targetArmor.名称, '无'),
                    })} / ${makeInlineEditableValue(toText(targetArmor.装备状态, '未装备'), {
                      path: [...targetCharPath, '装备', '斗铠', '装备状态'],
                      kind: 'string',
                      rawValue: toText(targetArmor.装备状态, '未装备'),
                    })}`
                  : (targetChar ? (toText(targetArmor.名称, '无') !== '无' ? `${toText(targetArmor.名称, '无')} / ${toText(targetArmor.装备状态, '未装备')}` : '无') : '未收录') },
                { label: '机甲', value: targetCharPath.length
                  ? `${makeInlineEditableValue(toText(targetMech.等级, '无'), {
                      path: [...targetCharPath, '装备', '机甲', '等级'],
                      kind: 'string',
                      rawValue: toText(targetMech.等级, '无'),
                    })}·${makeInlineEditableValue(toText(targetMech.型号, '未定型'), {
                      path: [...targetCharPath, '装备', '机甲', '型号'],
                      kind: 'string',
                      rawValue: toText(targetMech.型号, '未定型'),
                    })} / ${makeInlineEditableValue(toText(targetMech.装备状态, '未装备'), {
                      path: [...targetCharPath, '装备', '机甲', '装备状态'],
                      kind: 'string',
                      rawValue: toText(targetMech.装备状态, '未装备'),
                    })}`
                  : (targetChar ? (toText(targetMech.等级, '无') !== '无' ? `${toText(targetMech.等级, '无')}·${toText(targetMech.型号, '未定型')} / ${toText(targetMech.装备状态, '未装备')}` : '无') : '未收录') },
                { label: '主武器', value: targetCharPath.length
                  ? `${makeInlineEditableValue(toText(targetWeapon['名称'], '无'), {
                      path: [...targetCharPath, '装备', '武器', '名称'],
                      kind: 'string',
                      rawValue: toText(targetWeapon['名称'], '无'),
                    })} / ${makeInlineEditableValue(toText(targetWeapon.品阶 || targetWeapon['品阶'], '无品阶'), {
                      path: [...targetCharPath, '装备', '武器', '品阶'],
                      kind: 'string',
                      rawValue: toText(targetWeapon.品阶 || targetWeapon['品阶'], '无品阶'),
                    })}`
                  : (targetChar ? (targetWeapon && targetWeapon['名称'] ? `${toText(targetWeapon['名称'], '无')} / ${toText(targetWeapon.品阶 || targetWeapon['品阶'], '无品阶')}` : '无') : '未收录') },
                { label: '附件', value: targetChar ? summarizeAccessoryEntries(targetAccessories) : '未收录' }
              ], 'two')}</div>
            </div>
          `
        };
      }

      if (previewKey === '拍卖与警报') {
        const auctionItems = safeEntries(deepGet(snapshot, 'rootData.world.拍卖.拍品', {})).slice(0, 6);
        const auctionPath = ['world', '拍卖'];
        return {
          title: '拍卖行 / 世界警报弹窗',
          summary: '拍卖状态、拍品与当前世界警报。',
          body: `
            <div class="archive-modal-grid">
              <div class="archive-card">
                <div class="archive-card-head"><div class="archive-card-title">拍卖状态</div></div>
                ${makeTileGrid([
                  { label: '状态', value: makeInlineEditableValue(toText(deepGet(snapshot, 'rootData.world.拍卖.状态', '休市'), '休市'), {
                      path: [...auctionPath, '状态'],
                      kind: 'string',
                      rawValue: toText(deepGet(snapshot, 'rootData.world.拍卖.状态', '休市'), '休市'),
                    }) },
                  { label: '地点', value: makeInlineEditableValue(toText(deepGet(snapshot, 'rootData.world.拍卖.地点', '无'), '无'), {
                      path: [...auctionPath, '地点'],
                      kind: 'string',
                      rawValue: toText(deepGet(snapshot, 'rootData.world.拍卖.地点', '无'), '无'),
                    }) },
                  { label: '下次刷新', value: makeInlineEditableValue(String(toNumber(deepGet(snapshot, 'rootData.world.拍卖.下次刷新tick', 0), 0)), {
                      path: [...auctionPath, '下次刷新tick'],
                      kind: 'number',
                      rawValue: toNumber(deepGet(snapshot, 'rootData.world.拍卖.下次刷新tick', 0), 0),
                      editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                    }) },
                  { label: '当前拍品', value: `${auctionItems.length} 件` }
                ], 'two')}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">拍品列表</div></div>
                ${makeTimelineStack(auctionItems.map(([name, item]) => {
                  const itemPath = [...auctionPath, '拍品', name];
                  return {
                    title: name,
                    desc: [
                      `品阶 ${makeInlineEditableValue(toText(item && item.tier, '低阶'), {
                        path: [...itemPath, 'tier'],
                        kind: 'string',
                        rawValue: toText(item && item.tier, '低阶'),
                      })}`,
                      `价格 ${makeInlineEditableValue(String(toNumber(item && item.价格, 0)), {
                        path: [...itemPath, '价格'],
                        kind: 'number',
                        rawValue: toNumber(item && item.价格, 0),
                        editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                      })}`,
                      `说明 ${makeInlineEditableValue(toText(item && item.lore, '暂无说明'), {
                        path: [...itemPath, 'lore'],
                        kind: 'string',
                        rawValue: toText(item && item.lore, '暂无说明'),
                        multiline: true,
                      })}`,
                    ].join(' / ')
                  };
                }))}
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
                        规模：${formatNumber(item && item.规模 || 0)} ｜ 状态：${toText(item && item.状态, '正常')} <br>
                        顶尖战力：${toText(deepGet(item, '战力统计.封号斗罗', 0), '0')} 位封号斗罗
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
        const targetOrgPath = targetOrgName ? ['org', targetOrgName] : [];

        const factionRelationCards = buildFactionRelationEditorGrid(targetOrgName, targetOrgData, {
          max: 8,
          emptyTitle: '暂无对外关系',
          emptyDesc: '当前势力未记录对外关系。'
        });

        // Automatically gather characters belonging to this organization
        const orgMembers = [];
        for (const [charName, charInfo] of snapshot.charEntries) {
           const factions = safeEntries(deepGet(charInfo, '社交.势力', {}));
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
                  { label: '影响力', value: targetOrgPath.length
                    ? makeInlineEditableValue(formatNumber(targetOrgData.影响力 || 0), {
                        path: [...targetOrgPath, '影响力'],
                        kind: 'number',
                        rawValue: toNumber(targetOrgData.影响力, 0),
                        editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                      })
                    : formatNumber(targetOrgData.影响力 || 0) },
                  { label: '势力规模', value: targetOrgPath.length
                    ? makeInlineEditableValue(formatNumber(targetOrgData.规模 || 0), {
                        path: [...targetOrgPath, '规模'],
                        kind: 'number',
                        rawValue: toNumber(targetOrgData.规模, 0),
                        editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                      })
                    : formatNumber(targetOrgData.规模 || 0) },
                  { label: '当前状态', value: targetOrgPath.length
                    ? makeInlineEditableValue(toText(targetOrgData.状态, '正常'), {
                        path: [...targetOrgPath, '状态'],
                        kind: 'string',
                        rawValue: toText(targetOrgData.状态, '正常'),
                      })
                    : toText(targetOrgData.状态, '正常') },
                  { label: '上级势力', value: targetOrgPath.length
                    ? makeInlineEditableValue(toText(targetOrgData.上级势力, '无'), {
                        path: [...targetOrgPath, '上级势力'],
                        kind: 'string',
                        rawValue: toText(targetOrgData.上级势力, '无'),
                      })
                    : toText(targetOrgData.上级势力, '无') },
                  { label: '下次刷新', value: targetOrgPath.length
                    ? makeInlineEditableValue(String(toNumber(targetOrgData.下次刷新tick, 0)), {
                        path: [...targetOrgPath, '下次刷新tick'],
                        kind: 'number',
                        rawValue: toNumber(targetOrgData.下次刷新tick, 0),
                        editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                      })
                    : String(toNumber(targetOrgData.下次刷新tick, 0)) },
                  { label: '极限斗罗', value: targetOrgPath.length
                    ? makeInlineEditableValue(String(toNumber(deepGet(targetOrgData, '战力统计.极限斗罗', 0), 0)), {
                        path: [...targetOrgPath, '战力统计', '极限斗罗'],
                        kind: 'number',
                        rawValue: toNumber(deepGet(targetOrgData, '战力统计.极限斗罗', 0), 0),
                        editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                      })
                    : deepGet(targetOrgData, '战力统计.极限斗罗', 0) },
                  { label: '超级斗罗', value: targetOrgPath.length
                    ? makeInlineEditableValue(String(toNumber(deepGet(targetOrgData, '战力统计.超级斗罗', 0), 0)), {
                        path: [...targetOrgPath, '战力统计', '超级斗罗'],
                        kind: 'number',
                        rawValue: toNumber(deepGet(targetOrgData, '战力统计.超级斗罗', 0), 0),
                        editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                      })
                    : deepGet(targetOrgData, '战力统计.超级斗罗', 0) },
                  { label: '封号斗罗', value: targetOrgPath.length
                    ? makeInlineEditableValue(String(toNumber(deepGet(targetOrgData, '战力统计.封号斗罗', 0), 0)), {
                        path: [...targetOrgPath, '战力统计', '封号斗罗'],
                        kind: 'number',
                        rawValue: toNumber(deepGet(targetOrgData, '战力统计.封号斗罗', 0), 0),
                        editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                      })
                    : deepGet(targetOrgData, '战力统计.封号斗罗', 0) }
                ], 'two')}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">对外关系</div></div>
                ${factionRelationCards}
              </div>
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">角色名册</div></div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; margin-top: 10px;">
                  ${orgMembers.length > 0 ? orgMembers.map(m => `
                    <button type="button" class="role-switch-tile clickable" data-preview="角色档案：${escapeHtmlAttr(m.name)}" style="text-align:left; border:1px solid rgba(255,255,255,0.08); background:rgba(0,0,0,0.2); padding:12px; border-radius:8px; cursor:pointer;">
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
        return buildFactionDossierModal(snapshot, previewKey);
      }

      if (previewKey === '本地据点详情' || previewKey === '当前节点详情' || previewKey.startsWith('地图节点：')) {
        const nodeName = previewKey.startsWith('地图节点：') ? previewKey.replace('地图节点：', '') : snapshot.currentLoc;
        const mapNode = resolveDisplayMapNode(snapshot, nodeName);
        const nodeInfo = resolveLocationData(snapshot.rootData, nodeName);
        const locationBasePath = nodeInfo && nodeInfo.data ? ['world', '地点', nodeInfo.name] : [];
        const nodeStores = safeEntries(nodeInfo.data && nodeInfo.data.商店);
        const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, ''));
        const activeDisplayName = toText(deepGet(snapshot, 'activeChar.name', deepGet(snapshot, 'activeChar.base.name', snapshot.activeName)), snapshot.activeName);
        const localNpcEntries = safeEntries(deepGet(snapshot, 'rootData.char', {}))
          .filter(([name, char]) => {
            const displayName = toText(deepGet(char, 'name', deepGet(char, 'base.name', name)), name);
            if ((activeCharKey && name === activeCharKey) || (activeDisplayName && displayName === activeDisplayName)) return false;
            const npcLoc = toText(deepGet(char, '状态.位置', ''), '');
            return npcLoc ? isLocationCompatible(nodeName, npcLoc) : false;
          })
          .slice(0, 4);
        const primaryNpc = localNpcEntries[0]
          ? toText(deepGet(localNpcEntries[0][1], 'name', deepGet(localNpcEntries[0][1], 'base.name', localNpcEntries[0][0])), localNpcEntries[0][0])
          : '';
        const officialCommissionLocationName = ['锻造师协会', '制造师协会', '设计师协会', '修理师协会']
          .find(locationName => isLocationCompatible(nodeName, locationName) || isLocationCompatible(locationName, nodeName)) || '';
        const currentNodeLocFull = toText(deepGet(snapshot, 'activeChar.状态.位置', snapshot.currentLoc), snapshot.currentLoc);
        const canDispatchHere = !!toText(currentNodeLocFull, '') && isLocationCompatible(nodeName, currentNodeLocFull);
        const isTransmissionTowerNode =
          /传灵塔|升灵台|魂灵塔/.test(nodeName)
          || nodeStores.some(([name]) => /传灵塔|升灵台|魂灵塔/.test(toText(name, '')));

        const localNpcCards = localNpcEntries.map(([name, char]) => ({
          title: toText(deepGet(char, 'name', deepGet(char, 'base.name', name)), name),
          desc: `${toText(deepGet(char, '社交.主身份', '未知身份'), '未知身份')} / ${toText(deepGet(char, '状态.位置', '未知地点'), '未知地点')}`
        }));
        const availableActionButtons = [
          ...(nodeStores.length ? [{ text: '前往商店', action: 'shop', target: nodeStores[0][0], className: 'live' }] : []),
          ...(officialCommissionLocationName ? [{ text: `进入${officialCommissionLocationName}官方工坊`, action: 'craft', executorType: 'official', className: 'live' }] : []),
          ...(primaryNpc ? [{ text: `与${primaryNpc}交易`, action: 'trade', npcTarget: primaryNpc, className: 'warn' }, { text: `委托${primaryNpc}工坊`, action: 'craft', npcTarget: primaryNpc, executorType: 'private', className: 'warn' }, { text: `与${primaryNpc}对话`, action: 'talk', npcTarget: primaryNpc, className: 'live' }, { text: `向${primaryNpc}请教`, action: 'intel', npcTarget: primaryNpc, className: '' }, { text: `向${primaryNpc}切磋`, action: 'battle', npcTarget: primaryNpc, className: 'warn' }] : []),
          ...(!primaryNpc ? [{ text: '打开工坊', action: 'craft', executorType: 'self', className: 'live' }] : [])
        ];
        const actionButtons = canDispatchHere ? availableActionButtons : [];
        const isPlayerControlled = isSnapshotPlayerControlled(snapshot);
        const actionSummaryText = availableActionButtons.map(btn => btn.text).join(' / ');
        const actionCardTitle = isPlayerControlled ? '可执行操作' : '驻地操作概览';
        const travelPlan = !canDispatchHere && isPlayerControlled && window.__sheepMapBridge && typeof window.__sheepMapBridge.describeTravelToNode === 'function'
          ? window.__sheepMapBridge.describeTravelToNode(nodeName)
          : null;
        const arrivalActionItems = availableActionButtons.map(btn => {
          const metaParts = [];
          if (btn.npcTarget) metaParts.push(`对象 ${btn.npcTarget}`);
          if (btn.target && btn.target !== nodeName && !btn.npcTarget) metaParts.push(`目标 ${btn.target}`);
          if (btn.executorType === 'official') metaParts.push('官方工坊');
          if (btn.executorType === 'private') metaParts.push('私人委托');
          if (btn.executorType === 'self') metaParts.push('自营工坊');
          return {
            title: btn.text,
            desc: metaParts.length ? metaParts.join(' / ') : '抵达后可直接发起'
          };
        });
        const actionButtonsHtml = isPlayerControlled
          ? (canDispatchHere
            ? (actionButtons.length
              ? `<div class="map-action-grid">${actionButtons.map(btn => `<button type="button" class="map-dispatch-action-btn ${htmlEscape(btn.className || '')}" data-action="${htmlEscape(btn.action || '')}" data-target="${htmlEscape(btn.target || nodeName)}" data-current-loc="${htmlEscape(nodeName)}" data-npc-target="${htmlEscape(btn.npcTarget || '')}" data-executor-type="${htmlEscape(btn.executorType || '')}" data-services="${htmlEscape(Array.isArray(btn.services) ? btn.services.join('|') : '')}">${htmlEscape(btn.text || '执行操作')}</button>`).join('')}</div>`
              : `<div class="relation-card"><b>暂无可执行操作</b><span>这里暂时没有能立刻发起的交易或互动。</span></div>`)
            : `
              <section class="dossier-section">
                <div class="dossier-section-title">移动到此处</div>
                ${travelPlan && travelPlan.ok
                  ? `${makeDossierRows([
                      { label: '移动方式', value: htmlEscape(toText(travelPlan.method, '未定')) },
                      { label: '预计耗时', value: htmlEscape(toText(travelPlan.duration, '未定')) },
                      { label: '资源消耗', value: htmlEscape(toText(travelPlan.costText, '无')) },
                      { label: '坐标', value: htmlEscape(toText(travelPlan.coordText, '未定')) },
                      ...(travelPlan.routePlan ? [{ label: '路径说明', value: htmlEscape(toText(travelPlan.routePlan, '')), className: 'dossier-row--wide' }] : []),
                      ...(!travelPlan.canAfford && travelPlan.reason ? [{ label: '当前限制', value: htmlEscape(toText(travelPlan.reason, '资源不足')), className: 'dossier-row--wide' }] : [])
                    ], 'dossier-row-grid--two')}
                    <div class="tag-cloud armory-quick-actions" style="margin-top:12px;justify-content:flex-start;">
                      <button type="button" class="relation-action-btn action-primary" data-map-travel-node="${escapeHtmlAttr(nodeName)}" ${travelPlan.canAfford ? '' : 'disabled'}>${htmlEscape(travelPlan.canAfford ? `移动到 ${nodeName}` : '资源不足，暂不能移动')}</button>
                    </div>`
                  : `<div class="dossier-empty-note">${htmlEscape(toText(travelPlan && travelPlan.reason, '当前无法规划前往该节点的移动。'))}</div>`}
              </section>
              <section class="dossier-section">
                <div class="dossier-section-title">到达后可执行</div>
                ${arrivalActionItems.length
                  ? makeDossierList(arrivalActionItems, 'dossier-list--compact')
                  : '<div class="dossier-empty-note">抵达后暂未识别到立即可执行的交易、工坊或社交入口。</div>'}
              </section>
            `)
          : `<div class="relation-card"><b>旁观视角</b><span>${htmlEscape(actionSummaryText ? `可见入口：${actionSummaryText}` : '无本地操作')}</span></div>`;
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
                    { label: '掌控势力', value: locationBasePath.length
                      ? makeInlineEditableValue(toText(nodeInfo.data && nodeInfo.data['掌控势力'], '未知'), {
                          path: [...locationBasePath, '掌控势力'],
                          kind: 'string',
                          rawValue: toText(nodeInfo.data && nodeInfo.data['掌控势力'], '未知'),
                        })
                      : htmlEscape(toText(nodeInfo.data && nodeInfo.data['掌控势力'], '未知')) },
                    { label: '常住人口', value: locationBasePath.length
                      ? makeInlineEditableValue(formatNumber(nodeInfo.data && nodeInfo.data['人口']), {
                          path: [...locationBasePath, '人口'],
                          kind: 'number',
                          rawValue: toNumber(nodeInfo.data && nodeInfo.data['人口'], 0),
                          editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                        })
                      : htmlEscape(formatNumber(nodeInfo.data && nodeInfo.data['人口'])) },
                    { label: '经济状况', value: locationBasePath.length
                      ? makeInlineEditableValue(toText(nodeInfo.data && nodeInfo.data['经济状况'], '未知'), {
                          path: [...locationBasePath, '经济状况'],
                          kind: 'enum_select',
                          rawValue: toText(nodeInfo.data && nodeInfo.data['经济状况'], '未知'),
                          editorMeta: { options: ['繁荣', '普通', '萧条', '未知'] },
                        })
                      : htmlEscape(toText(nodeInfo.data && nodeInfo.data['经济状况'], '未知')) },
                    { label: '守护军团', value: locationBasePath.length
                      ? makeInlineEditableValue(toText(nodeInfo.data && nodeInfo.data['守护军团'], '无'), {
                          path: [...locationBasePath, '守护军团'],
                          kind: 'string',
                          rawValue: toText(nodeInfo.data && nodeInfo.data['守护军团'], '无'),
                        })
                      : htmlEscape(toText(nodeInfo.data && nodeInfo.data['守护军团'], '无')) },
                    { label: '商店数量', value: `${nodeStores.length} 处` },
                  ], 'two')}
                </div>
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">驻地状态</div></div>
                  <div class="location-status-layout">
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
                        <div class="location-radar-panel">
                          ${makeRadarSvg(['经济状况', '常住人口', '守备力量', '贸易补给', '战略价值'], [ecoScore, popScore, guardScore, tradeScore, Math.round((ecoScore+popScore+guardScore+tradeScore)/4)])}
                        </div>
                      `;
                    })()}
                    <div class="location-status-summary">
                      <div class="location-summary-card location-summary-card--highlight"><b>综合评级</b><span>${htmlEscape(toText(nodeInfo.data && nodeInfo.data['经济状况'], '未知'))}</span></div>
                      <div class="location-summary-card"><b>守备评估</b><span>${htmlEscape(toText(nodeInfo.data && nodeInfo.data['守护军团'], '无军团驻扎'))}</span></div>
                      <div class="location-summary-card"><b>补给节点</b><span>${htmlEscape(nodeStores.length ? `${nodeStores.length} 处贸易站或设施` : '无可见商店')}</span></div>
                      <div class="location-summary-card location-summary-card--note"><b>地图简报</b><span>${locationBasePath.length
                        ? makeInlineEditableValue(toText(deepGet(nodeInfo.data, 'desc', mapNode ? mapNode.desc : '无扫描数据'), mapNode ? mapNode.desc : '无扫描数据'), {
                            path: [...locationBasePath, 'desc'],
                            kind: 'string',
                            rawValue: toText(deepGet(nodeInfo.data, 'desc', mapNode ? mapNode.desc : '无扫描数据'), mapNode ? mapNode.desc : '无扫描数据'),
                            multiline: true,
                          })
                        : htmlEscape(mapNode ? mapNode.desc : '无扫描数据')}</span></div>
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
                  <div class="location-empty-note">当前节点未扫描到可直接互动的本地角色。</div>
                </div>
              `}
            </div>
          `,
          onMount: () => null
        };
      }

      if (previewKey === '图层控制与跑图') {
        const statusLoc = toText(deepGet(snapshot, 'activeChar.状态.位置', snapshot.currentLoc), snapshot.currentLoc);
        const statusCoordSystem = toText(deepGet(snapshot, 'activeChar.状态.坐标系', 'image'), 'image');
        return {
          title: '图层控制 / 跑图弹窗',
          summary: '当前位置、可见层级与跑图仲裁状态。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">当前位置与视图</div></div>
                ${makeTileGrid([
                  { label: '当前锚点', value: snapshot.currentLoc },
                  { label: '主视图', value: snapshot.normalizedLoc },
                  { label: '角色定位', value: statusLoc },
                  { label: '坐标系', value: statusCoordSystem },
                  { label: '移动结算', value: '地图仲裁器直结' },
                  { label: '动态节点', value: `${snapshot.dynamicLocationNames.length} 个` }
                ], 'two')}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '动态地点与扩展节点') {
        const dynamicLocationEntries = snapshot.dynamicLocationNames.map(name => [name, deepGet(snapshot, ['rootData', 'world', '动态地点', name], {})]);
        return {
          title: '动态地点弹窗',
          summary: '剧情推进生成的扩展节点。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">动态节点列表</div></div>
                ${makeTimelineStack(dynamicLocationEntries.length ? dynamicLocationEntries.map(([name, item]) => {
                  const basePath = ['world', '动态地点', name];
                  return {
                    title: name,
                    desc: [
                      `归属 ${makeInlineEditableValue(toText(item && item['归属父节点'], '未知'), {
                        path: [...basePath, '归属父节点'],
                        kind: 'string',
                        rawValue: toText(item && item['归属父节点'], '未知'),
                      })}`,
                      `势力 ${makeInlineEditableValue(toText(item && item.势力, '未知'), {
                        path: [...basePath, '势力'],
                        kind: 'string',
                        rawValue: toText(item && item.势力, '未知'),
                      })}`,
                      `类型 ${makeInlineEditableValue(toText(item && item.节点类型, '未知'), {
                        path: [...basePath, '节点类型'],
                        kind: 'string',
                        rawValue: toText(item && item.节点类型, '未知'),
                      })}`,
                      `重要度 ${makeInlineEditableValue(String(toNumber(item && item.importance, 0)), {
                        path: [...basePath, 'importance'],
                        kind: 'number',
                        rawValue: toNumber(item && item.importance, 0),
                        editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                      })}`,
                      `状态 ${makeInlineEditableValue(toText(item && item.state, 'intact'), {
                        path: [...basePath, 'state'],
                        kind: 'string',
                        rawValue: toText(item && item.state, 'intact'),
                      })}`,
                      `描述 ${makeInlineEditableValue(toText(item && item['描述'], '无'), {
                        path: [...basePath, '描述'],
                        kind: 'string',
                        rawValue: toText(item && item['描述'], '无'),
                        multiline: true,
                      })}`,
                    ].join(' / ')
                  };
                }) : [{ title: '暂无动态节点', desc: '当前剧情尚未扩展出新的动态地点。' }])}
              </div>
            </div>
          `
        };
      }

      if (previewKey === '世界状态总览') {
        const worldTime = resolveShellText(deepGet(snapshot, 'rootData.world.时间._calendar', deepGet(snapshot, 'rootData.world.时间.calendar', '')), '');
        const deviation = toNumber(deepGet(snapshot, 'rootData.world.偏差值', 0), 0);
        const forestRatio = Math.max(0, Math.min(100, Number(((toNumber(snapshot.forestKilledAge, 0) / 1000000) * 100).toFixed(1))));
        const worldAlertText = resolveShellText(snapshot.worldAlert, '');
        const recentNews = buildRecentNewsSummary(snapshot, { seqLimit: 4, intelLimit: 4 });
        const recentPlans = buildRecentPlanSummary(snapshot, { worldLimit: 4, recordLimit: 4 });
        const timelineCards = (snapshot.timelineEntries || [])
          .slice(0, 5)
          .map(([name, item]) => ({
            title: name,
            desc: toText(item && (item.事件 || item['事件'] || item.desc || item['描述']), '')
          }))
          .filter(item => item.title && resolveShellText(item.desc, ''));
        const newsCards = (recentNews.cards || [])
          .slice(0, 5)
          .map(item => ({
            title: toText(item && item.title, ''),
            desc: toText(item && item.desc, '')
          }))
          .filter(item => item.title && resolveShellText(item.desc, ''));
        const planCards = (recentPlans.cards || [])
          .slice(0, 5)
          .map(item => ({
            title: toText(item && item.title, ''),
            desc: toText(item && item.desc, '')
          }))
          .filter(item => item.title && resolveShellText(item.desc, ''));
        const auctionStatus = resolveShellText(deepGet(snapshot, 'rootData.world.拍卖.状态', ''), '');
        const auctionLocation = resolveShellText(deepGet(snapshot, 'rootData.world.拍卖.地点', ''), '');
        const hasAuction = auctionStatus && auctionStatus !== '休市';
        return {
          title: '世界',
          summary: '',
          body: `
            <div class="archive-modal-grid mvu-shell-compact-detail">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">世界状态</div></div>
                ${makeTileGrid([
                  ...(worldTime ? [{ label: '时间', value: htmlEscape(worldTime) }] : []),
                  { label: '偏差', value: htmlEscape(String(deviation)) },
                  { label: '森怨', value: htmlEscape(`${forestRatio}%`) },
                  ...(worldAlertText ? [{ label: '警报', value: htmlEscape(worldAlertText) }] : []),
                  ...(hasAuction ? [{ label: '拍卖', value: htmlEscape(auctionLocation ? `${auctionStatus} / ${auctionLocation}` : auctionStatus) }] : []),
                ], 'two')}
              </div>
              ${timelineCards.length ? `
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">编年</div></div>
                  ${makeTimelineStack(timelineCards)}
                </div>
              ` : ''}
              ${newsCards.length ? `
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">见闻</div></div>
                  ${makeTimelineStack(newsCards)}
                </div>
              ` : ''}
              ${planCards.length ? `
                <div class="archive-card full">
                  <div class="archive-card-head"><div class="archive-card-title">安排</div></div>
                  ${makeTimelineStack(planCards)}
                </div>
              ` : ''}
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
              container.innerHTML = '<div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">旁观视角</div></div><div class="intel-layout"><div class="intel-card"><b>店铺概览</b><span>交易不可用</span></div></div></div>';
              return null;
            }
            if (typeof window.mountTradeUI === 'function') {
              return window.mountTradeUI(container, snapshot, {
                initialTab: tradeLaunchOptions.initialTab,
                prefillNpc: tradeLaunchOptions.prefillNpc,
                lockNpc: tradeLaunchOptions.lockNpc,
                preferredStore: tradeLaunchOptions.preferredStore,
                prefillAction: tradeLaunchOptions.prefillAction,
                prefillItem: tradeLaunchOptions.prefillItem,
                prefillQty: tradeLaunchOptions.prefillQty,
                prefillPrice: tradeLaunchOptions.prefillPrice,
                autoExecute: tradeLaunchOptions.autoExecute,
                onTradeAction: (actionData) => {
                  dispatchUiAiRequest(actionData.playerInput, actionData.systemPrompt, { requestKind: actionData.requestKind });
                }
              });
            }
          }
        };
      }

      if (previewKey === '系统播报与日志') {
        const terminalItems = [
          { title: '最近播报', desc: resolveShellText(deepGet(snapshot, 'rootData.sys.rsn', ''), '') },
          { title: '最近事件', desc: snapshot.latestTimeline ? snapshot.latestTimeline[0] : '' },
          { title: '安排摘要', desc: resolveShellText(snapshot.pendingRequests[0], '') },
          { title: '情报摘要', desc: snapshot.pendingIntelCount ? `${snapshot.pendingIntelContent} / 新线索 ${snapshot.pendingIntelCount} 条` : '' },
          ...snapshot.timelineEntries.slice(0, 4).map(([name, item]) => ({
            title: name,
            desc: toText(item && (item['event'] || item['事件']), '')
          }))
        ].filter(item => item.title && resolveShellText(item.desc, ''));
        return {
          title: '终端',
          summary: '',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: 1fr;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">系统广播</div></div>
                ${makeTimelineStack(terminalItems)}
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
                  { label: '当前行动', value: toText(status.行动, '日常') },
                  { label: '所在位置', value: snapshot.currentLoc },
                  { label: '伤势', value: getDisplayWoundLabel(stat) },
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
        const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '');
        const towerPath = activeCharKey ? ['char', activeCharKey, '魂灵塔记录'] : [];
        const towerDiscountEntries = safeEntries(deepGet(snapshot, 'activeChar.魂灵塔记录.折扣资格', {})).filter(([, value]) => !!value);
        const ascensionRequest = deepGet(snapshot, 'activeChar.升灵台请求', {});
        const towerRequest = deepGet(snapshot, 'activeChar.魂灵塔请求', {});
        const huntRequest = deepGet(snapshot, 'activeChar.猎魂请求', {});
        const abyssKillRequest = deepGet(snapshot, 'activeChar.深渊击杀请求', {});
        const huntPendingAge = toNumber(huntRequest && huntRequest.击杀年限, 0);
        const huntPendingText = huntPendingAge > 0 ? `${huntPendingAge}年${deepGet(snapshot, 'activeChar.猎魂请求.是否凶兽', false) ? ' / 凶兽级' : ' / 常规目标'}` : '无待处理';
        const abyssKillTier = toText(abyssKillRequest && abyssKillRequest.击杀级别, '无');
        const abyssKillQty = Math.max(1, toNumber(abyssKillRequest && abyssKillRequest.数量, 1));
        const abyssPendingText = abyssKillTier !== '无' ? `${abyssKillTier} × ${abyssKillQty}` : '无待处理';
        const ascensionTicketCount = (snapshot.inventoryEntries || [])
          .filter(([name]) => /升灵台/.test(toText(name, '')))
          .reduce((sum, [, item]) => sum + Math.max(0, toNumber(item && item['数量'], 0)), 0);
        const ascensionTickets = listAscensionTicketNames(snapshot);
        const soulSpiritTargets = listSoulSpiritTargets(snapshot);
        const trialTickets = (snapshot.inventoryEntries || []).filter(([name]) => /升灵台|魂灵塔/.test(name)).slice(0, 8);
        const ticketCards = trialTickets.length
          ? trialTickets.map(([name, item]) => ({ title: `${name} ×${toNumber(item && item['数量'], 0)}`, desc: toText(item && item['描述'], '可用于对应试炼场景。') }))
          : [{ title: '暂无试炼门票', desc: '当前背包中没有升灵台或魂灵塔相关门票。' }];
        const towerPending = toText(towerRequest && towerRequest.动作, '无') !== '无';
        const ascensionPending = toText(ascensionRequest && ascensionRequest.门票名, '无') !== '无';
        const towerPendingText = towerPending ? `${toText(towerRequest && towerRequest.动作, '冲塔')} / 第${Math.max(0, toNumber(towerRequest && towerRequest.通关层数, 0))}层` : '无待处理';
        const ascensionPendingText = ascensionPending
          ? `${toText(ascensionRequest && ascensionRequest.门票名, '未知门票')} / ${toText(ascensionRequest && ascensionRequest.武魂槽位, '未指定')}-${toText(ascensionRequest && ascensionRequest.魂灵槽位, '未指定')} / +${Math.max(0, toNumber(ascensionRequest && ascensionRequest.提升年限, 0))}年`
          : '无待处理';
        const ascensionTicketOptionsHtml = ascensionTickets.length
          ? ascensionTickets.map(name => `<option value="${escapeHtmlAttr(name)}"${name === toText(ascensionRequest && ascensionRequest.门票名, '') ? ' selected' : ''}>${htmlEscape(name)}</option>`).join('')
          : '<option value="">暂无门票</option>';
        const soulSpiritTargetOptionsHtml = soulSpiritTargets.length
          ? soulSpiritTargets.map(item => {
              const rawValue = `${item.spiritKey}::${item.soulSpiritKey}`;
              const selected = rawValue === `${toText(ascensionRequest && ascensionRequest.武魂槽位, '')}::${toText(ascensionRequest && ascensionRequest.魂灵槽位, '')}`;
              return `<option value="${escapeHtmlAttr(rawValue)}"${selected ? ' selected' : ''}>${htmlEscape(item.label)}</option>`;
            }).join('')
          : '<option value="">暂无魂灵</option>';
        delete modalFocusState[`${previewKey}::trial-focus`];
        return {
          title: '试炼与情报',
          summary: '当前试炼资源、票据储备与近期风险情报。',
          body: `
            <div class="archive-modal-grid" style="grid-template-columns: repeat(2, minmax(0, 1fr)); align-items:stretch;">
              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">试炼总览</div></div>
                ${makeTileGrid([
                  { label: '升灵台门票', value: String(ascensionTicketCount) },
                  { label: '魂灵塔最高', value: towerPath.length
                    ? makeInlineEditableValue(String(toNumber(deepGet(snapshot, 'activeChar.魂灵塔记录.最高层', 0), 0)), {
                        path: [...towerPath, '最高层'],
                        kind: 'number',
                        rawValue: toNumber(deepGet(snapshot, 'activeChar.魂灵塔记录.最高层', 0), 0),
                        editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                      })
                    : htmlEscape(String(toNumber(deepGet(snapshot, 'activeChar.魂灵塔记录.最高层', 0), 0))) },
                  { label: '可用折扣层', value: towerDiscountEntries.length ? `${towerDiscountEntries.length}` : '0' },
                  { label: '升灵台待处理', value: ascensionPendingText },
                  { label: '魂灵塔待处理', value: towerPendingText },
                  { label: '现实狩猎待处理', value: huntPendingText },
                  { label: '深渊战果待处理', value: abyssPendingText },
                  { label: '当前战功', value: formatNumber(deepGet(snapshot, 'activeChar.财富.战功', 0)) }
                ], 'two')}
              </div>

              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">试炼票据与折扣</div></div>
                <div class="intel-layout" style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:12px;">
                  ${ticketCards.map(item => `<div class="intel-card" style="min-height:116px;"><b>${htmlEscape(item.title)}</b><span>${htmlEscape(item.desc)}</span></div>`).join('')}
                </div>
                <div style="margin-top:12px;">
                  ${makeTimelineStack(towerDiscountEntries.length ? towerDiscountEntries.slice(0, 10).map(([floor]) => ({ title: `${floor} 层`, desc: '五折资格未使用' })) : [{ title: '暂无折扣资格', desc: '当前未记录可用五折层。' }])}
                </div>
              </div>

              <div class="archive-card full">
                <div class="archive-card-head"><div class="archive-card-title">近期情报</div></div>
                <div class="intel-layout" style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:12px;">
                  ${(snapshot.unlockedKnowledges.length ? snapshot.unlockedKnowledges.slice(-4).reverse() : ['情报仍待收集']).map(item => `<div class="intel-card" style="min-height:116px;"><b>${htmlEscape(item)}</b><span>${htmlEscape(item)}</span></div>`).join('')}
                </div>
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
        const questBoardEntries = safeEntries(deepGet(snapshot, 'rootData.world.委托板', {})).filter(([, item]) => item && typeof item === 'object');
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
        const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '');
        const focusQuest = focusQuestEntry && focusQuestEntry[1];
        const focusBoard = focusBoardEntry && focusBoardEntry[1];
        const focusQuestStatus = toText(focusQuest && focusQuest['状态'], '进行中');
        const focusBoardStatus = toText(focusBoard && focusBoard['状态'], '待接取');
        const focusQuestPath = focusQuestName && activeCharKey ? ['char', activeCharKey, '记录', focusQuestName] : [];
        const focusBoardPath = focusBoardId ? ['world', '委托板', focusBoardId] : [];
        const focusBoardDescPath = focusBoardPath.length ? [...focusBoardPath, focusBoardStatus === '待接取' ? '框架描述' : '描述'] : [];
        const focusBoardDesc = focusBoard
          ? (focusBoardStatus === '待接取' ? toText(focusBoard['框架描述'], toText(focusBoard['描述'], '未知')) : toText(focusBoard['描述'], toText(focusBoard['框架描述'], '未知')))
          : '未知';
        const questCreateFormHtml = activeCharKey ? `
          <div class="request-console-row" data-collection-panel="quest-record-create" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px;">
            <input class="request-console-input" style="margin:0; flex:1 1 160px;" data-collection-input="record-name" value="" placeholder="任务名" />
            <input class="request-console-input" style="margin:0; flex:0 1 140px;" data-collection-input="record-type" value="任务" placeholder="类型" />
            <input type="number" min="1" class="request-console-input" style="margin:0; width:90px; flex:0 0 90px;" data-collection-input="record-target" value="1" placeholder="目标" />
            <input class="request-console-input" style="margin:0; flex:1 1 220px;" data-collection-input="record-desc" value="" placeholder="说明" />
            <button type="button" class="tag-chip live" data-collection-action="add-record" data-collection-char="${escapeHtmlAttr(activeCharKey)}">新增</button>
          </div>
        ` : '';
        const boardCreateFormHtml = `
          <div class="request-console-row" data-collection-panel="quest-board-create" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px;">
            <input class="request-console-input" style="margin:0; flex:1 1 180px;" data-collection-input="board-name" value="" placeholder="委托名" />
            <input class="request-console-input" style="margin:0; flex:0 1 140px;" data-collection-input="board-type" value="委托" placeholder="类型" />
            <input class="request-console-input" style="margin:0; flex:0 1 140px;" data-collection-input="board-publisher" value="系统" placeholder="发布者" />
            <input class="request-console-input" style="margin:0; flex:1 1 220px;" data-collection-input="board-desc" value="" placeholder="说明" />
            <button type="button" class="tag-chip live" data-collection-action="add-board">新增</button>
          </div>
        `;
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
          : '<div style="padding: 12px 16px; color: var(--color-text-secondary); text-align: center; font-size: 13px;">暂无任务</div>';
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
          : '<div style="padding: 12px 16px; color: var(--color-text-secondary); text-align: center; font-size: 13px;">暂无委托</div>';
        const questDetailHtml = focusQuest
          ? `
              ${makeTileGrid([
                { label: '任务名称', value: focusQuestName },
                { label: '状态', value: focusQuestPath.length
                  ? makeInlineEditableValue(focusQuestStatus, {
                      path: [...focusQuestPath, '状态'],
                      kind: 'string',
                      rawValue: focusQuestStatus,
                    })
                  : htmlEscape(focusQuestStatus) },
                { label: '任务类型', value: focusQuestPath.length
                  ? makeInlineEditableValue(toText(focusQuest['类型'], '任务'), {
                      path: [...focusQuestPath, '类型'],
                      kind: 'string',
                      rawValue: toText(focusQuest['类型'], '任务'),
                    })
                  : htmlEscape(toText(focusQuest['类型'], '任务')) },
                { label: '当前进度', value: focusQuestPath.length
                  ? makeInlineEditableValue(String(toNumber(focusQuest['当前进度'], 0)), {
                      path: [...focusQuestPath, '当前进度'],
                      kind: 'number',
                      rawValue: toNumber(focusQuest['当前进度'], 0),
                      editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                    })
                  : htmlEscape(String(toNumber(focusQuest['当前进度'], 0))) },
                { label: '目标进度', value: focusQuestPath.length
                  ? makeInlineEditableValue(String(toNumber(focusQuest['目标进度'], 1)), {
                      path: [...focusQuestPath, '目标进度'],
                      kind: 'number',
                      rawValue: toNumber(focusQuest['目标进度'], 1),
                      editorMeta: { min: 1, integer: true, hint: '最小 1 · 整数' },
                    })
                  : htmlEscape(String(toNumber(focusQuest['目标进度'], 1))) },
                { label: '奖励金币', value: focusQuestPath.length
                  ? makeInlineEditableValue(formatNumber(toNumber(focusQuest['奖励币'], 0)), {
                      path: [...focusQuestPath, '奖励币'],
                      kind: 'number',
                      rawValue: toNumber(focusQuest['奖励币'], 0),
                      editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                    })
                  : htmlEscape(formatNumber(toNumber(focusQuest['奖励币'], 0))) },
                { label: '奖励声望', value: focusQuestPath.length
                  ? makeInlineEditableValue(formatNumber(toNumber(focusQuest['奖励声望'], 0)), {
                      path: [...focusQuestPath, '奖励声望'],
                      kind: 'number',
                      rawValue: toNumber(focusQuest['奖励声望'], 0),
                      editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                    })
                  : htmlEscape(formatNumber(toNumber(focusQuest['奖励声望'], 0))) }
              ], 'two')}
              <div style="margin-top: 16px;">
                <div style="font-size: 11px; color: var(--color-text-secondary); margin-bottom: 6px; font-weight: 500;">当前进度 <span style="float: right; color: var(--cyan);">${toNumber(focusQuest['当前进度'], 0)} / ${toNumber(focusQuest['目标进度'], 1)}</span></div>
                <div style="height: 6px; background: rgba(0, 229, 255, 0.1); border-radius: 3px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);">
                  <div style="height: 100%; background: linear-gradient(90deg, rgba(0,229,255,0.6), rgba(0,229,255,1)); width: ${ratioPercent(toNumber(focusQuest['当前进度'], 0), toNumber(focusQuest['目标进度'], 1))}%; border-radius: 3px; box-shadow: 0 0 8px rgba(0,229,255,0.8); transition: width 0.3s ease;"></div>
                </div>
              </div>
            `
          : makeTileGrid([{ label: '状态', value: '未选择' }], 'two');
        const questActionHtml = focusQuestPath.length
          ? `
              <div class="request-console-row" style="display:flex; gap:8px; flex-wrap:wrap; margin-top:16px;">
                <button type="button" class="tag-chip" data-collection-action="delete-record" data-collection-char="${escapeHtmlAttr(activeCharKey)}" data-collection-key="${escapeHtmlAttr(focusQuestName)}">删除任务</button>
                ${focusQuest && isPlayerControlled && !['已完成', '已放弃', '失败', '已失败'].includes(focusQuestStatus)
                  ? `${focusQuestStatus === '可提交' ? `<button type="button" class="relation-action-btn quest-action-btn" data-quest-action="submit" data-quest-target="${escapeHtmlAttr(focusQuestName)}">提交任务</button>` : ''}<button type="button" class="relation-action-btn quest-action-btn" data-quest-action="abandon" data-quest-target="${escapeHtmlAttr(focusQuestName)}">放弃任务</button>`
                  : ''}
              </div>
            `
          : '';
        const boardDetailHtml = focusBoard
          ? makeTileGrid([
              { label: '委托标题', value: focusBoardPath.length
                ? makeInlineEditableValue(toText(focusBoard['标题'], focusBoardId), {
                    path: [...focusBoardPath, '标题'],
                    kind: 'string',
                    rawValue: toText(focusBoard['标题'], focusBoardId),
                  })
                : htmlEscape(toText(focusBoard['标题'], focusBoardId)) },
              { label: '状态', value: focusBoardPath.length
                ? makeInlineEditableValue(focusBoardStatus, {
                    path: [...focusBoardPath, '状态'],
                    kind: 'string',
                    rawValue: focusBoardStatus,
                  })
                : htmlEscape(focusBoardStatus) },
              { label: '类型', value: focusBoardPath.length
                ? makeInlineEditableValue(toText(focusBoard['类型'], '委托'), {
                    path: [...focusBoardPath, '类型'],
                    kind: 'string',
                    rawValue: toText(focusBoard['类型'], '委托'),
                  })
                : htmlEscape(toText(focusBoard['类型'], '委托')) },
              { label: '发布者', value: focusBoardPath.length
                ? makeInlineEditableValue(toText(focusBoard['发布者'], '系统'), {
                    path: [...focusBoardPath, '发布者'],
                    kind: 'string',
                    rawValue: toText(focusBoard['发布者'], '系统'),
                  })
                : htmlEscape(toText(focusBoard['发布者'], '系统')) },
              { label: '面向', value: focusBoardPath.length
                ? makeInlineEditableValue(toText(focusBoard['面向'], '公开'), {
                    path: [...focusBoardPath, '面向'],
                    kind: 'string',
                    rawValue: toText(focusBoard['面向'], '公开'),
                  })
                : htmlEscape(toText(focusBoard['面向'], '公开')) },
              { label: '承接者', value: focusBoardPath.length
                ? makeInlineEditableValue(toText(focusBoard['承接者'], '无'), {
                    path: [...focusBoardPath, '承接者'],
                    kind: 'string',
                    rawValue: toText(focusBoard['承接者'], '无'),
                  })
                : htmlEscape(toText(focusBoard['承接者'], '无')) },
              { label: '预计阶段', value: focusBoardPath.length
                ? makeInlineEditableValue(formatNumber(toNumber(focusBoard['目标进度'], 1)), {
                    path: [...focusBoardPath, '目标进度'],
                    kind: 'number',
                    rawValue: toNumber(focusBoard['目标进度'], 1),
                    editorMeta: { min: 1, integer: true, hint: '最小 1 · 整数' },
                  })
                : htmlEscape(formatNumber(toNumber(focusBoard['目标进度'], 1))) },
              { label: '难度', value: focusBoardPath.length
                ? makeInlineEditableValue(toText(focusBoard['难度'], '中'), {
                    path: [...focusBoardPath, '难度'],
                    kind: 'string',
                    rawValue: toText(focusBoard['难度'], '中'),
                  })
                : htmlEscape(toText(focusBoard['难度'], '中')) },
              { label: '资源级别', value: focusBoardPath.length
                ? makeInlineEditableValue(toText(focusBoard['资源级别'], '无'), {
                    path: [...focusBoardPath, '资源级别'],
                    kind: 'string',
                    rawValue: toText(focusBoard['资源级别'], '无'),
                  })
                : htmlEscape(toText(focusBoard['资源级别'], '无')) },
              { label: '奖励金币', value: focusBoardPath.length
                ? makeInlineEditableValue(formatNumber(toNumber(focusBoard['奖励币'], 0)), {
                    path: [...focusBoardPath, '奖励币'],
                    kind: 'number',
                    rawValue: toNumber(focusBoard['奖励币'], 0),
                    editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                  })
                : htmlEscape(formatNumber(toNumber(focusBoard['奖励币'], 0))) },
              { label: '奖励声望', value: focusBoardPath.length
                ? makeInlineEditableValue(formatNumber(toNumber(focusBoard['奖励声望'], 0)), {
                    path: [...focusBoardPath, '奖励声望'],
                    kind: 'number',
                    rawValue: toNumber(focusBoard['奖励声望'], 0),
                    editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                  })
                : htmlEscape(formatNumber(toNumber(focusBoard['奖励声望'], 0))) }
            ], 'two')
          : makeTileGrid([{ label: '状态', value: '未选择' }], 'two');
        const boardActionHtml = focusBoardPath.length
          ? `
              <div class="request-console-row" style="display:flex; gap:8px; flex-wrap:wrap; margin-top:16px;">
                <button type="button" class="tag-chip" data-collection-action="delete-board" data-collection-key="${escapeHtmlAttr(focusBoardId)}">删除委托</button>
                ${focusBoard && isPlayerControlled && focusBoardStatus === '待接取'
                  ? `<button type="button" class="relation-action-btn quest-action-btn" data-quest-action="accept" data-quest-target="${escapeHtmlAttr(focusBoardId)}">接取委托</button>`
                  : ''}
              </div>
            `
          : '';
        return {
          title: '任务界面',
          summary: '我的任务记录与世界委托板。',
          body: `
            <div class="archive-modal-grid">
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">我的任务</div><span class="state-tag ${questRecords.length ? 'live' : 'warn'}">${questRecords.length ? `共 ${questRecords.length} 条` : '空'}</span></div>
                  ${questCreateFormHtml}
                  <div class="relation-directory-grid">${questListHtml}</div>
                  ${makeModalPaginationControls('quest-records', questPage.page, questPage.totalPages, questPage.total)}
                </div>
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">焦点任务详情</div><span class="state-tag ${focusQuestName ? 'live' : 'warn'}">${htmlEscape(focusQuestName || '未选中')}</span></div>
                  ${questDetailHtml}
                  ${questActionHtml}
                  <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1);">
                    <div style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 4px;">任务说明</div>
                    <div style="font-size: 14px; line-height: 1.5; color: var(--color-text-primary);">${focusQuest && focusQuestPath.length
                      ? makeInlineEditableValue(toText(focusQuest['描述'], '未知'), {
                          path: [...focusQuestPath, '描述'],
                          kind: 'string',
                          rawValue: toText(focusQuest['描述'], '未知'),
                          multiline: true,
                        })
                      : htmlEscape(focusQuest ? toText(focusQuest['描述'], '未知') : '未知')}</div>
                  </div>
                </div>
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">委托板</div><span class="state-tag ${questBoardEntries.length ? 'live' : 'warn'}">${questBoardEntries.length ? `共 ${questBoardEntries.length} 条` : '空'}</span></div>
                  ${boardCreateFormHtml}
                  <div class="relation-directory-grid">${boardListHtml}</div>
                  ${makeModalPaginationControls('quest-board', boardPage.page, boardPage.totalPages, boardPage.total)}
                </div>
                <div class="archive-card">
                  <div class="archive-card-head"><div class="archive-card-title">焦点委托详情</div><span class="state-tag ${focusBoardId ? 'live' : 'warn'}">${htmlEscape(focusBoardId || '未选中')}</span></div>
                  ${boardDetailHtml}
                  ${boardActionHtml}
                  <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1);">
                    <div style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 4px;">${htmlEscape(focusBoardStatus === '待接取' ? '委托框架' : '委托说明')}</div>
                    <div style="font-size: 14px; line-height: 1.5; color: var(--color-text-primary);">${focusBoard && focusBoardDescPath.length
                      ? makeInlineEditableValue(focusBoardDesc, {
                          path: focusBoardDescPath,
                          kind: 'string',
                          rawValue: focusBoardDesc,
                          multiline: true,
                        })
                      : htmlEscape(focusBoard ? focusBoardDesc : '未知')}</div>
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
        const bestiaryRecordToCard = ([name, item]) => {
          if (item && item.empty) {
            return { title: name, desc: '暂未记录任何深渊生物或魂兽。' };
          }
          const scalarParts = safeEntries(item)
            .filter(([, value]) => value === null || typeof value !== 'object')
            .slice(0, 6)
            .map(([key, value]) => {
              const displayValue = value === undefined || value === null || value === '' ? '无' : String(value);
              const kind = typeof value === 'number' ? 'number' : (typeof value === 'boolean' ? 'boolean' : 'string');
              return `${htmlEscape(toText(key, '字段'))}：${makeInlineEditableValue(displayValue, {
                path: ['world', '图鉴', name, key],
                kind,
                rawValue: value === undefined ? displayValue : value,
              })}`;
            });
          const objectParts = safeEntries(item)
            .filter(([, value]) => value && typeof value === 'object')
            .slice(0, 3)
            .map(([key, value]) => `${htmlEscape(toText(key, '字段'))}：${htmlEscape(`${safeEntries(value).length}项`)}`);
          return {
            title: htmlEscape(name),
            desc: scalarParts.concat(objectParts).join(' / ') || '当前仅建立了空白图鉴壳。'
          };
        };
        const bestiaryCards = (snapshot.bestiaryEntries.length ? snapshot.bestiaryEntries.slice(0, 24) : [['暂无图鉴记录', { empty: true }]]).map(bestiaryRecordToCard);
        const latestBestiaryCard = snapshot.bestiaryEntries[0] ? bestiaryRecordToCard(snapshot.bestiaryEntries[0]) : null;
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
                ${makeTimelineStack(latestBestiaryCard ? [latestBestiaryCard] : [{ title: '暂无最近收录', desc: '当前图鉴仍为空。' }])}
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
              <div class="archive-card full"><div class="archive-card-head"><div class="archive-card-title">仇恨累计</div></div>${makeTileGrid([{ label: '累计击杀年限', value: makeInlineEditableValue(formatNumber(snapshot.forestKilledAge), { path: ['world', '累计击杀年限'], kind: 'number', rawValue: snapshot.forestKilledAge, editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数 · 1000000 为兽潮阈值参考，不是硬上限' } }) }, { label: '兽潮阈值', value: '1000000' }, { label: '剩余安全空间', value: remaining > 0 ? formatNumber(remaining) : '0' }, { label: '当前阶段', value: stage }], 'two')}<div style="margin-top:12px;"><div style="display:flex;justify-content:space-between;font-size:12px;color:#bfdde4;margin-bottom:6px;"><span>阈值进度</span><span>${progress}%</span></div><div style="height:10px;border-radius:999px;background:rgba(255,255,255,0.08);overflow:hidden;border:1px solid rgba(150,217,228,0.12);"><div style="height:100%;width:${progress}%;background:${progress >= 100 ? 'linear-gradient(90deg,#ff6b6b,#ffb36b)' : (progress >= 70 ? 'linear-gradient(90deg,#ffd36b,#ff8a5b)' : 'linear-gradient(90deg,#72e6ff,#7dffb2)')};box-shadow:0 0 12px rgba(255,180,107,0.35);"></div></div></div></div>
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
        const refreshInlineEditToken = inlineEditSessionToken;
        if (shouldPauseLiveRefresh(options)) {
          pendingLiveRefresh = true;
          return;
        }
        const vars = options.sharedVars === undefined ? await getAllVariablesSafe() : options.sharedVars;
        if (!options.force && (refreshInlineEditToken !== inlineEditSessionToken || shouldPauseLiveRefresh(options))) {
          pendingLiveRefresh = true;
          return;
        }
        const root = resolveRootData(vars);
        if (!root) return;
        const effective = buildEffectiveSd(root);
        if (!effective.rootData) return;
        if (!options.force && (refreshInlineEditToken !== inlineEditSessionToken || shouldPauseLiveRefresh(options))) {
          pendingLiveRefresh = true;
          return;
        }
        if (isRootDataRelevantToCurrentChat(effective.rootData)) {
          syncMvuEditorStoreFromRoot(effective.rootData);
        }
        liveSnapshot = buildSnapshot(effective.rootData);
        lastRenderableSnapshot = liveSnapshot;
        const nextHeaderRenderSignature = buildHeaderRenderSignature(liveSnapshot);
        const nextDashboardSectionRenderSignatures = buildDashboardSectionRenderSignatures(liveSnapshot);
        const nextDashboardRenderSignature = buildDashboardRenderSignature(liveSnapshot, nextDashboardSectionRenderSignatures);
        const shouldRenderHeader = !!options.force || nextHeaderRenderSignature !== lastHeaderRenderSignature;
        const shouldRenderDashboard = !!options.force || nextDashboardRenderSignature !== lastDashboardRenderSignature;

        if (shouldRenderHeader) {
          renderHeader(liveSnapshot);
          lastHeaderRenderSignature = nextHeaderRenderSignature;
        }
        if (shouldRenderDashboard) {
          renderLiveCards(liveSnapshot, nextDashboardSectionRenderSignatures);
          lastDashboardRenderSignature = nextDashboardRenderSignature;
        }
        syncPrivateArchiveLongPressTargets(liveSnapshot);
        maybeOpenTradeRequestFromAI(liveSnapshot);
        
        syncBattleUiForSnapshot(liveSnapshot, options);

        const activeDetailPreviewKey = currentUnifiedPreviewKey || currentModalPreviewKey;
        if ((shouldRenderDashboard || !!options.force) && (detailModal.classList.contains('show') || isShellInlinePreviewActive() || isUnifiedInlinePreviewActive()) && activeDetailPreviewKey) {
          if (activeDetailPreviewKey === '角色切换器') {
            return;
          }
          if (activeDetailPreviewKey === BATTLE_INLINE_PREVIEW_KEY) {
            return;
          }
          const liveSubUiKeys = new Set(['武装工坊详细页', '储物仓库详细页', '当前节点详情', '交易模块弹窗', '交易网络']);
          if (
            liveSubUiKeys.has(activeDetailPreviewKey)
            && activeSubUI
            && typeof activeSubUI.updateData === 'function'
          ) {
            activeSubUI.updateData(liveSnapshot);
          } else {
            rerenderDetailSurface(activeDetailPreviewKey, { surface: currentUnifiedPreviewKey ? 'unified' : 'modal', force: !!options.force });
          }
        }
      } catch (error) {
        console.warn('[DragonUI] MVU 实时渲染失败', error);
      }
    }

    async function initLiveBindings() {
      bindInlineEditing();
      await waitForMvuReady();
      installModuleArbitrationPrompt();
      installDirectModuleIntentGuard();
      await refreshLiveSnapshot();
      bindMvuUpdates(vars => refreshLiveSnapshot({ sharedVars: vars }));
    }

    window.__MVU_REFRESH_LIVE_SNAPSHOT__ = options => refreshLiveSnapshot(options);
    window.__MVU_GET_LIVE_SNAPSHOT__ = () => liveSnapshot || lastRenderableSnapshot || null;
    window.__MVU_OPEN_BATTLE_UI__ = async () => {
      battleInlineDismissed = false;
      removeBattleReturnEntries();
      await openBattleInlineSurface();
      await refreshLiveSnapshot({ force: true, reopenBattle: true });
      return !!activeBattleUI;
    };
    window.__MVU_APPLY_PATCHES__ = (patches, options = {}) => applyJsonPatchOpsByEditor(patches, options);

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

      return `${head}<div class="strip-name">${config.name}</div><div class="rings dual-grid ${isPrimary ? 'primary-rings' : 'secondary-rings'}">${buildSpiritRingGrid(config.魂环, isPrimary ? 'ring-white' : 'ring-gold')}</div>`;
    }

    function renderArchiveBloodlineEntry(config) {
      return `
        <div class="dual-side-top dual-side-top-right">
          <span class="badge ${config.badgeClass || 'gold'}">${config.badge}</span>
        </div>
        <div class="strip-name">${config.name}</div>
        <div class="rings dual-grid secondary-rings">${buildSpiritRingGrid(config.魂环, 'ring-gold')}</div>
      `;
    }

    const pageMetaMap = {
      'page-archive': { title: '档案 / 个人主控', subtitle: '详细档案、武魂轨道、社会摘要与储物入口', tag: '档案核心' },
      'page-map': { title: '星图 / 节点导航', subtitle: '当前位置、下钻路径、本地设施与动态地点', tag: '星图导航' },
      'page-world': { title: '世界 / 时空中枢', subtitle: '时间轴、偏差与拍卖警报的汇总面板', tag: '世界中枢' },
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

    
    const initialMainTab = (() => {
      try {
        const currentTab = window.__MVU_TAB_STATE__ && typeof window.__MVU_TAB_STATE__.current === 'string'
          ? window.__MVU_TAB_STATE__.current
          : '';
        return pageMetaMap[currentTab] ? currentTab : 'page-archive';
      } catch (err) {
        return 'page-archive';
      }
    })();
    setMainTab(initialMainTab);

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
          <button type="button" class="inventory-hover-action-btn" data-inventory-action="equip" data-inventory-char="${escapeHtmlAttr(cell.dataset.hoverChar || '')}" data-inventory-item="${escapeHtmlAttr(cell.dataset.hoverTitle || '')}">
            穿戴装备 / 装载
          </button>
          ` : ''}
          ${cell.dataset.hoverTitle ? `
          <div class="tag-cloud armory-quick-actions" style="margin-top:10px;justify-content:flex-end;">
            <button type="button" class="inventory-hover-action-btn" data-inventory-action="discard" data-inventory-mode="one" data-inventory-char="${escapeHtmlAttr(cell.dataset.hoverChar || '')}" data-inventory-item="${escapeHtmlAttr(cell.dataset.hoverTitle || '')}">丢弃1件</button>
            ${toNumber(cell.dataset.hoverCount, 1) > 1 ? `<button type="button" class="inventory-hover-action-btn" data-inventory-action="discard" data-inventory-mode="all" data-inventory-char="${escapeHtmlAttr(cell.dataset.hoverChar || '')}" data-inventory-item="${escapeHtmlAttr(cell.dataset.hoverTitle || '')}">全部丢弃</button>` : ''}
          </div>
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
      const shellInlineHost = getShellInlineHost();
      const isShellInlineCell = !!(cell && isShellInlinePreviewActive() && shellInlineHost && shellInlineHost.contains(cell));
      if (!cell || (!(detailModal.classList.contains('show') && detailModal.contains(cell)) && !isShellInlineCell)) {
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
        requestKind: 'relation_interaction'
      });
    }

    function buildRelationBattleInitRequest(snapshot, rawTargetName) {
      const currentLoc = toText(snapshot && snapshot.currentLoc, '未知地点');
      return buildMapBattleInitRequest(snapshot, { npcTarget: rawTargetName, target: currentLoc, currentLoc, requestKind: 'relation_sparring' });
    }

    function listAscensionTicketNames(snapshot) {
      return (snapshot && Array.isArray(snapshot.inventoryEntries) ? snapshot.inventoryEntries : [])
        .filter(([name, item]) => /升灵台/.test(toText(name, '')) && toNumber(item && item['数量'], 0) > 0)
        .map(([name]) => toText(name, ''))
        .filter(Boolean);
    }

    function listSoulSpiritTargets(snapshot) {
      const activeChar = deepGet(snapshot, 'activeChar', {});
      const result = [];
      safeEntries(deepGet(activeChar, '武魂', {})).forEach(([spiritKey, spiritData]) => {
        safeEntries(deepGet(spiritData, '魂灵', {})).forEach(([soulSpiritKey, soulSpirit]) => {
          const spiritName = toText(deepGet(spiritData, '表象名称', spiritKey), spiritKey);
          const soulSpiritName = toText(deepGet(soulSpirit, '表象名称', soulSpiritKey), soulSpiritKey);
          const age = toNumber(deepGet(soulSpirit, '年限', 0), 0);
          result.push({
            spiritKey,
            soulSpiritKey,
            spiritName,
            soulSpiritName,
            age,
            value: `${spiritKey}::${soulSpiritKey}`,
            label: `${spiritName} / ${soulSpiritName}${age > 0 ? ` / ${formatNumber(age)}年` : ''}`,
          });
        });
      });
      return result;
    }

    function splitSoulSpiritTargetValue(value) {
      const raw = toText(value, '').trim();
      if (!raw || !raw.includes('::')) return { spiritKey: '', soulSpiritKey: '' };
      const [spiritKey, soulSpiritKey] = raw.split('::');
      return {
        spiritKey: toText(spiritKey, '').trim(),
        soulSpiritKey: toText(soulSpiritKey, '').trim(),
      };
    }

    function buildMvuUpdateBlock(analysis, patchOps, leadText = '') {
      const safeAnalysis = toText(analysis, 'Front-end request initialized.');
      return `<UpdateVariable>\n<Analysis>${safeAnalysis}</Analysis>\n<JSONPatch>\n${JSON.stringify(Array.isArray(patchOps) ? patchOps : [], null, 2)}\n</JSONPatch>\n</UpdateVariable>`;
    }

    function getDonateBasePrice(itemName) {
      const safeName = toText(itemName, '');
      if (/天锻|四字|红级|十万年/.test(safeName)) return 100000000;
      if (/魂锻|三字|黑级|万年/.test(safeName)) return 10000000;
      if (/灵锻|二字|紫级|千年/.test(safeName)) return 1000000;
      if (/千锻|一字|黄级|百年/.test(safeName)) return 100000;
      return 10000;
    }

    function getDonateTalentMultiplier(talentTier) {
      return {
        '绝世妖孽': 2.0,
        '顶级天才': 1.8,
        '天才': 1.5,
        '优秀': 1.2,
        '正常': 1.0,
        '劣等': 0.5,
      }[toText(talentTier, '')] || 1.0;
    }

    function getDonateRewardLabel(targetFaction) {
      if (targetFaction === '史莱克学院') return '学院积分';
      if (targetFaction === '战神殿' || targetFaction === '血神军团') return '战功';
      return '唐门积分';
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
      const ownedCount = toNumber(deepGet(snapshot, ['activeChar', '背包', itemName, '数量'], 0), 0);
      if (ownedCount < quantity) return null;
      const chars = deepGet(snapshot, 'rootData.char', {});
      const activeChar = chars && typeof chars === 'object' ? (chars[activeKey] || {}) : {};
      const activeName = toText(activeChar && (activeChar.name || deepGet(activeChar, 'base.name', '')), toText(snapshot.activeName, activeKey));
      const currentLoc = toText(deepGet(activeChar, '状态.位置', snapshot.currentLoc || '当前位置'), snapshot.currentLoc || '当前位置').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '');
      const talentTier = toText(deepGet(activeChar, '属性.talent_tier', '正常'), '正常');
      const basePrice = getDonateBasePrice(itemName);
      const talentMultiplier = getDonateTalentMultiplier(talentTier);
      const totalValue = basePrice * quantity;
      const pointsEarned = Math.floor((totalValue / 1000) * talentMultiplier);
      const rewardLabel = getDonateRewardLabel(targetFaction);
      const systemPrompt = `以下内容属于前端代发的阵营捐献请求，请直接承接剧情与后续处理，不要输出 JSON 块或变量维护指令。

[捐献摘要]
角色：${activeName}
地点：${currentLoc}
目标势力：${targetFaction}
物品：${itemName}
数量：${quantity}
当前库存：${ownedCount}
基准估值：${formatNumber(basePrice)} / 件
总估值：${formatNumber(totalValue)}
天赋档位：${talentTier}
天赋系数：${talentMultiplier}
预计获得：${formatNumber(pointsEarned)} ${rewardLabel}

请结合当前地点、角色所属势力关系、物资价值与阵营流程，自然写出捐献受理、核验和反馈；若当场无法受理，也请明确给出阻碍原因。
若捐献成立，请按以上估值结果发放 ${formatNumber(pointsEarned)} ${rewardLabel}。`;
      return {
        playerInput: `我想向【${targetFaction}】捐献【${itemName}】×${quantity}。`,
        systemPrompt,
        requestKind: 'faction_donate'
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
      const currentLoc = toText(deepGet(activeChar, '状态.位置', snapshot.currentLoc || '当前位置'), snapshot.currentLoc || '当前位置').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '');
      const boardEntry = deepGet(snapshot, ['rootData', 'world', '委托板', questName], null);
      const recordEntry = deepGet(snapshot, ['activeChar', '记录', questName], null);
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
        extraRequirement = `这是一个接取前只公开框架的委托。你现在可以在剧情里正常披露详细目标，但必须保留 任务请求.任务描述 = ${questDesc}、目标进度 = ${requiredCount}、奖励币 = ${rewardCoin}、奖励声望 = ${rewardRep}。`;
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
        extraRequirement = '你必须保留 任务请求.动作 = 提交，并保留 任务名称、任务描述、目标进度、奖励币、奖励声望 这些字段，使 MVU 后续可以按进度进行结算。';
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
        extraRequirement = '你必须保留 任务请求.动作 = 放弃，并保留 任务名称、任务描述、目标进度、奖励币、奖励声望 这些字段，使 MVU 后续可以正确回滚委托板状态。';
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
        extraRequirement = `你必须保留 任务请求.动作 = 更新进度 与 进度增量 = ${progressAdd}，并保留 任务名称、任务描述、目标进度、奖励币、奖励声望 这些字段。`;
      } else {
        return null;
      }

      const patchOps = [
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/任务请求`, value: { 动作: questAction, 任务名称: questName, 任务描述: questDesc, 进度增量: progressAdd, 目标进度: requiredCount, 奖励币: rewardCoin, 奖励声望: rewardRep } },
        { op: 'replace', path: `/char/${escapeJsonPointerValue(activeKey)}/状态/行动`, value: statusAction },
        { op: 'replace', path: '/sys/rsn', value: requestLabel }
      ];
      const mvuUpdate = buildMvuUpdateBlock(
        analysisLabel,
        patchOps,
        '以下为本次任务请求的完整 MVU 更新，请将上面的隐藏结算转写为自然剧情，正文不要直接复述 JSONPatch 或系统术语。'
      );

      const systemPrompt = `以下内容属于前端已经完成的任务请求初始化，不要在正文直接复述“JSONPatch / 系统分析 / 仲裁日志”等术语。

${requestLabel}

[任务要求]
${extraRequirement}

${mvuUpdate}`;

      return {
        playerInput,
        systemPrompt,
        requestKind: '任务请求'
      };
    }


    function buildFactionAffairConsoleHtml(snapshot, preferredFactionName = '') {
      const pendingDonateItem = toText(deepGet(snapshot, 'activeChar.捐献请求.物品名称', '无'), '无');
      const pendingDonateFaction = toText(deepGet(snapshot, 'activeChar.捐献请求.目标势力', '无'), '无');
      const pendingDonateQty = Math.max(1, toNumber(deepGet(snapshot, 'activeChar.捐献请求.数量', 1), 1));
      const factionNames = [];
      [preferredFactionName, pendingDonateFaction, ...(snapshot.势力 || []).map(([name]) => name), '唐门', '史莱克学院', '战神殿', '传灵塔', '联邦军方', '血神军团', '圣灵教'].forEach(name => {
        const text = toText(name, '').trim();
        if (text && text !== '无' && !factionNames.includes(text)) factionNames.push(text);
      });
      const donationEntries = (snapshot.inventoryEntries || []).filter(([, item]) => toNumber(item && item['数量'], 0) > 0).slice(0, 50);
      const donationOptionsHtml = donationEntries.length
        ? donationEntries.map(([name, item]) => `<option value="${escapeHtmlAttr(name)}" ${name === pendingDonateItem ? 'selected' : ''}>${htmlEscape(`${name} ×${toNumber(item && item['数量'], 0)}`)}</option>`).join('')
        : '<option value="">暂无可捐献物品</option>';
      const defaultDonateFaction = pendingDonateFaction !== '无' ? pendingDonateFaction : (preferredFactionName || factionNames[0] || '');
      const pendingSummary = pendingDonateItem !== '无' ? `${pendingDonateItem} × ${pendingDonateQty} / ${pendingDonateFaction}` : '无';
      const isPlayerControlled = isSnapshotPlayerControlled(snapshot);
      if (!isPlayerControlled) {
        return `
          <div class="archive-card dossier-card dossier-console-card request-console-card">
            <div class="archive-card-head"><div class="archive-card-title">阵营事务台</div><span class="dossier-pill warn">旁观</span></div>
            <section class="dossier-section">
              <div class="dossier-section-title">当前状态</div>
              ${makeDossierRows([
                { label: '挂起事务', value: htmlEscape(pendingSummary) },
                { label: '当前视角', value: '旁观' },
              ], 'dossier-row-grid--single')}
            </section>
            <section class="dossier-section">
              <div class="dossier-section-title">主要贡献池</div>
              <div class="dossier-contrib-grid">
                ${makeDossierMeter('唐门', htmlEscape(formatNumber(deepGet(snapshot, 'activeChar.财富.唐门积分', 0))), ratioPercent(deepGet(snapshot, 'activeChar.财富.唐门积分', 0), 1000), 'dossier-meter--cyan')}
                ${makeDossierMeter('史莱克学院', htmlEscape(formatNumber(deepGet(snapshot, 'activeChar.财富.学院积分', 0))), ratioPercent(deepGet(snapshot, 'activeChar.财富.学院积分', 0), 1000), 'dossier-meter--green')}
                ${makeDossierMeter('战神殿/军方', htmlEscape(formatNumber(deepGet(snapshot, 'activeChar.财富.战功', 0))), ratioPercent(deepGet(snapshot, 'activeChar.财富.战功', 0), 1000), 'dossier-meter--red')}
              </div>
            </section>
          </div>
        `;
      }
      return `
        <div class="archive-card dossier-card dossier-console-card request-console-card">
          <div class="archive-card-head"><div class="archive-card-title">阵营事务台</div><span class="dossier-pill ${preferredFactionName ? 'live' : 'warn'}">${htmlEscape(preferredFactionName || '未加入')}</span></div>
          <section class="dossier-section">
            <div class="dossier-section-title">挂起事务</div>
            ${makeDossierRows([{ label: '当前排队', value: htmlEscape(pendingSummary) }], 'dossier-row-grid--single')}
          </section>
          <section class="dossier-section">
            <div class="dossier-section-title">物资捐献</div>
            <div class="dossier-form-grid">
              <div class="dossier-form-row request-console-row request-console-row--donate dossier-form-row--donate">
                <select class="request-console-input" data-faction-input="donateFaction">${factionNames.map(name => `<option value="${escapeHtmlAttr(name)}" ${name === defaultDonateFaction ? 'selected' : ''}>${htmlEscape(name)}</option>`).join('')}</select>
                <select class="request-console-input" data-faction-input="donateItem" ${donationEntries.length ? '' : 'disabled'}>${donationOptionsHtml}</select>
                <input type="number" min="1" class="request-console-input" data-faction-input="donateQty" value="${escapeHtmlAttr(String(pendingDonateQty))}" placeholder="数量" />
                <button type="button" class="relation-action-btn faction-action-btn" data-faction-action="donate" ${donationEntries.length ? '' : 'disabled'}>提交捐献</button>
              </div>
            </div>
          </section>
          <section class="dossier-section">
            <div class="dossier-section-title">主要贡献池</div>
            <div class="dossier-contrib-grid">
              ${makeDossierMeter('唐门', htmlEscape(formatNumber(deepGet(snapshot, 'activeChar.财富.唐门积分', 0))), ratioPercent(deepGet(snapshot, 'activeChar.财富.唐门积分', 0), 1000), 'dossier-meter--cyan')}
              ${makeDossierMeter('史莱克学院', htmlEscape(formatNumber(deepGet(snapshot, 'activeChar.财富.学院积分', 0))), ratioPercent(deepGet(snapshot, 'activeChar.财富.学院积分', 0), 1000), 'dossier-meter--green')}
              ${makeDossierMeter('战神殿/军方', htmlEscape(formatNumber(deepGet(snapshot, 'activeChar.财富.战功', 0))), ratioPercent(deepGet(snapshot, 'activeChar.财富.战功', 0), 1000), 'dossier-meter--red')}
            </div>
          </section>
        </div>
      `;
    }

    function buildFactionRelationDossierList(orgName, orgData, options = {}) {
      const { max = 6, emptyTitle = '暂无阵营关系', emptyDesc = '当前未记录对外关系。' } = options || {};
      const safeOrgName = toText(orgName, '').trim();
      const relationEntries = safeEntries(deepGet(orgData, '关系', {})).slice(0, Math.max(1, max));
      if (!relationEntries.length) {
        return `<div class="dossier-empty-note">${htmlEscape(emptyTitle)}：${htmlEscape(emptyDesc)}</div>`;
      }
      return makeDossierList(relationEntries.map(([relationName, relationData]) => {
        const safeRelData = relationData && typeof relationData === 'object' ? relationData : {};
        const relationMeta = buildFactionRelationMeta(relationName, safeRelData);
        const relationField = Object.prototype.hasOwnProperty.call(safeRelData, '态度')
          ? '态度'
          : (Object.prototype.hasOwnProperty.call(safeRelData, '关系') ? '关系' : '态度');
        const relationValue = toText(deepGet(safeRelData, relationField, relationMeta.attitude), relationMeta.attitude);
        const detailText = safeEntries(safeRelData)
          .filter(([key]) => !['态度', '关系'].includes(toText(key, '')))
          .map(([key, value]) => {
            if (value && typeof value === 'object') return `${toText(key, '关系项')} ${safeEntries(value).length}项`;
            const textValue = toText(value, '');
            return textValue ? `${toText(key, '关系项')} ${textValue}` : '';
          })
          .filter(Boolean)
          .join(' / ');
        const editableValue = safeOrgName
          ? makeInlineEditableValue(relationValue, {
              path: ['org', safeOrgName, '关系', relationName, relationField],
              kind: 'string',
              rawValue: relationValue,
            })
          : htmlEscape(relationValue);
        return {
          title: relationMeta.name,
          desc: `<strong>${editableValue}</strong>${detailText ? `<small>${htmlEscape(detailText)}</small>` : ''}`,
          className: relationMeta.className || '',
        };
      }), 'dossier-list--compact dossier-list--relations');
    }

    function buildFactionDossierModal(snapshot, previewKey = '所属势力详细页') {
      const currentFactionName = snapshot.势力[0] ? snapshot.势力[0][0] : '';
      const currentFactionRole = snapshot.势力[0] ? toText(deepGet(snapshot.势力[0][1], '身份', '无'), '无') : '未加入';
      const currentFactionPower = snapshot.势力[0] ? toText(deepGet(snapshot.势力[0][1], '权限级', 0), '0') : '0';
      const activeCharKey = resolveSnapshotCharKey(snapshot, toText(snapshot.activeName, '')) || toText(snapshot.activeName, '');
      const currentFactionPath = currentFactionName && activeCharKey ? ['char', activeCharKey, '社交', '势力', currentFactionName] : [];
      const currentFactionEntry = currentFactionName
        ? (snapshot.orgEntries.find(([name]) => name === currentFactionName) || [currentFactionName, {}])
        : ['', {}];
      const factionRows = snapshot.势力.length ? snapshot.势力 : [['未加入势力', { 身份: '无', 权限级: 0 }]];
      const title = previewKey === '我的阵营详情' ? '我的阵营弹窗' : '阵营身份弹窗';

      return {
        title,
        summary: '当前角色在各势力中的身份、权限与阵营事务。',
        body: `
          <div class="archive-modal-grid dossier-shell dossier-shell--faction">
            <div class="archive-card dossier-card dossier-card--faction-list">
              <div class="archive-card-head">
                <div class="archive-card-title">所属势力列表</div>
                <span class="dossier-pill ${snapshot.势力.length ? 'live' : 'warn'}">${snapshot.势力.length ? `已加入 ${snapshot.势力.length}` : '未加入'}</span>
              </div>
              <div class="dossier-list dossier-list--factions">
                ${factionRows.map(([name, info], idx) => {
                  const factionPath = activeCharKey && name !== '未加入势力' ? ['char', activeCharKey, '社交', '势力', name] : [];
                  const identityValue = toText(info && info['身份'], '无');
                  const powerValue = toNumber(info && info['权限级'], 0);
                  return `
                    <div class="dossier-list-row faction-row ${idx === 0 ? 'highlight' : ''}">
                      <b>${htmlEscape(name)}</b>
                      <span>
                        身份：${factionPath.length
                          ? makeInlineEditableValue(identityValue, {
                              path: [...factionPath, '身份'],
                              kind: 'string',
                              rawValue: identityValue,
                            })
                          : htmlEscape(identityValue)}
                        / 权限级：${factionPath.length
                          ? makeInlineEditableValue(String(powerValue), {
                              path: [...factionPath, '权限级'],
                              kind: 'number',
                              rawValue: powerValue,
                              editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                            })
                          : htmlEscape(String(powerValue))}
                      </span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            <div class="archive-card dossier-card dossier-card--faction-profile">
              <div class="archive-card-head">
                <div>
                  <div class="archive-card-title">当前阵营档案</div>
                  <div class="dossier-head-name">${htmlEscape(currentFactionName || '未加入势力')}</div>
                </div>
                <span class="dossier-pill ${currentFactionName ? 'live' : 'warn'}">${htmlEscape(currentFactionRole)}</span>
              </div>
              <section class="dossier-section">
                <div class="dossier-section-title">身份定位</div>
                ${makeDossierRows([
                  { label: '当前所属', value: htmlEscape(currentFactionName || '无') },
                  { label: '身份', value: currentFactionPath.length
                    ? makeInlineEditableValue(currentFactionRole, {
                        path: [...currentFactionPath, '身份'],
                        kind: 'string',
                        rawValue: currentFactionRole,
                      })
                    : htmlEscape(currentFactionRole) },
                  { label: '权限级', value: currentFactionPath.length
                    ? makeInlineEditableValue(currentFactionPower, {
                        path: [...currentFactionPath, '权限级'],
                        kind: 'number',
                        rawValue: toNumber(currentFactionPower, 0),
                        editorMeta: { min: 0, integer: true, hint: '最小 0 · 整数' },
                      })
                    : htmlEscape(currentFactionPower) },
                  { label: '主公开身份', value: activeCharKey
                    ? makeInlineEditableValue(toText(deepGet(snapshot, 'activeChar.社交.主身份', '无'), '无'), {
                        path: ['char', activeCharKey, '社交', '主身份'],
                        kind: 'string',
                        rawValue: toText(deepGet(snapshot, 'activeChar.社交.主身份', '无'), '无'),
                      })
                    : htmlEscape(toText(deepGet(snapshot, 'activeChar.社交.主身份', '无'), '无')) },
                  { label: '当前称号', value: htmlEscape(snapshot.recentTitles[0] || '暂无') },
                  { label: '当前位置', value: htmlEscape(snapshot.currentLoc || '未知') },
                ], 'dossier-row-grid--two')}
              </section>
              <section class="dossier-section">
                <div class="dossier-section-title">阵营关系</div>
                ${buildFactionRelationDossierList(currentFactionName, currentFactionEntry[1] || {}, {
                  max: 6,
                  emptyTitle: '暂无阵营关系',
                  emptyDesc: currentFactionName ? '当前所属势力未记录对外关系。' : '当前角色尚未加入可展示关系的势力。'
                })}
              </section>
            </div>
            ${buildFactionAffairConsoleHtml(snapshot, currentFactionName)}
          </div>
        `
      };
    }

    function buildMapTradeModalOptions(snapshot, dispatchDetail) {
      const detail = dispatchDetail || {};
      const services = normalizeMapDispatchServices(detail);
      const action = toText(detail.action, '');
      const tradeRequest = detail.tradeRequest && typeof detail.tradeRequest === 'object' ? detail.tradeRequest : {};
      const requestAction = toText(tradeRequest.动作, '');
      const npcTarget = toText(detail.npcTarget, '');
      const currentLoc = toText(snapshot && snapshot.currentLoc, '');
      const normalizedLoc = toText(snapshot && snapshot.normalizedLoc, currentLoc);
      const 地点映射 = deepGet(snapshot, 'rootData.world.地点', {});
      const currentLocation = snapshot && snapshot.locationData && typeof snapshot.locationData === 'object'
        ? snapshot.locationData
        : (地点映射 && typeof 地点映射 === 'object'
          ? (地点映射[normalizedLoc] || 地点映射[currentLoc] || {})
          : {});
      const storeMap = currentLocation && typeof currentLocation === 'object' ? (currentLocation.商店 || {}) : {};

      let initialTab = 'tab-shop';
      if (/竞拍|拍卖|auction|bid/i.test(requestAction) || action === 'bid' || services.includes('auction')) {
        initialTab = 'tab-auction';
      } else if ((/出售|卖出|sell/i.test(requestAction) && !toText(tradeRequest.对象, npcTarget)) || action === 'sell') {
        initialTab = 'tab-sell';
      } else if ((requestAction && toText(tradeRequest.对象, npcTarget)) || (action === 'trade' && npcTarget)) {
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
        prefillNpc: initialTab === 'tab-private' ? toText(tradeRequest.对象, npcTarget) : '',
        lockNpc: initialTab === 'tab-private' && !!toText(tradeRequest.对象, npcTarget),
        preferredStore: toText(tradeRequest.目标, preferredStore) || preferredStore,
        prefillAction: requestAction,
        prefillItem: toText(tradeRequest.物品, ''),
        prefillQty: Math.max(1, toNumber(tradeRequest.数量, 1)),
        prefillPrice: Math.max(0, toNumber(tradeRequest.价格, 0)),
        autoExecute: tradeRequest.自动执行 === true || /auto|ready|执行|成交|确认/.test(toText(tradeRequest.状态, ''))
      };
    }

    function buildBattleInlineHostMarkup() {
      return `
        <div id="mvu-battle-inline-host" class="mvu-battle-inline-host">
          <div class="battle-module-scope">
            <section class="battle-shell" aria-label="战斗">
              <div class="battle-header">
                <div class="combatant-card player" id="ui-player-panel">
                  <div class="name-row">
                    <div class="name-block">
                      <span class="lv-badge" id="ui-player-lv">Lv.0</span>
                      <span class="combatant-name" id="ui-player-name">己方</span>
                    </div>
                  </div>
                  <div class="bar-stack">
                    <div class="resource-bar"><div class="resource-fill hp" id="ui-player-hp-bar"></div><div class="resource-text" id="ui-player-hp-text">0 / 0</div></div>
                    <div class="resource-bar"><div class="resource-fill vit" id="ui-player-sta-bar"></div><div class="resource-text" id="ui-player-sta-text">0 / 0</div></div>
                    <div class="resource-bar"><div class="resource-fill sp" id="ui-player-sp-bar"></div><div class="resource-text" id="ui-player-sp-text">0 / 0</div></div>
                    <div class="resource-bar"><div class="resource-fill men" id="ui-player-men-bar"></div><div class="resource-text" id="ui-player-men-text">0 / 0</div></div>
                  </div>
                  <div class="stats-grid" id="ui-player-stats"></div>
                  <div class="buff-row" id="ui-player-buffs"></div>
                </div>
                <div class="combatant-card enemy" id="ui-enemy-panel">
                  <div class="name-row">
                    <div class="name-block">
                      <span class="lv-badge" id="ui-enemy-lv">Lv.0</span>
                      <span class="combatant-name" id="ui-enemy-name">对手</span>
                    </div>
                  </div>
                  <div class="bar-stack">
                    <div class="resource-bar"><div class="resource-fill hp" id="ui-enemy-hp-bar"></div><div class="resource-text" id="ui-enemy-hp-text">0 / 0</div></div>
                    <div class="resource-bar"><div class="resource-fill vit" id="ui-enemy-sta-bar"></div><div class="resource-text" id="ui-enemy-sta-text">0 / 0</div></div>
                    <div class="resource-bar"><div class="resource-fill sp" id="ui-enemy-sp-bar"></div><div class="resource-text" id="ui-enemy-sp-text">0 / 0</div></div>
                    <div class="resource-bar"><div class="resource-fill men" id="ui-enemy-men-bar"></div><div class="resource-text" id="ui-enemy-men-text">0 / 0</div></div>
                  </div>
                  <div class="stats-grid" id="ui-enemy-stats"></div>
                  <div class="buff-row" id="ui-enemy-buffs"></div>
                </div>
              </div>
              <div class="battle-main">
                <div class="side-rail"><div class="side-panel" id="ui-team-player"></div></div>
                <div class="center-column">
                  <div class="intent-bar">
                    <div class="intent-inner">
                      <div class="intent-chip-row" id="ui-combat-chips"></div>
                    </div>
                  </div>
                  <div class="action-wrap">
                    <div class="battle-toolbar">
                      <div class="mode-group" id="ui-mode-group">
                        <button class="mode-btn active" type="button" data-mode="single_round">单回合</button>
                        <button class="mode-btn" type="button" data-mode="multi_round">连续推演</button>
                      </div>
                      <select class="request-console-input" id="ui-intent-mode" style="flex:0 0 124px;">
                        <option value="点到为止" selected>点到为止</option>
                        <option value="尽量生擒">尽量生擒</option>
                        <option value="重伤压制">重伤压制</option>
                        <option value="必杀">必杀</option>
                      </select>
                      <div class="battle-toolbar-actions">
                        <button class="ghost-btn" id="ui-arbitrate" type="button">结算</button>
                        <button class="ghost-btn battle-close-btn" id="ui-battle-close" type="button" aria-label="退出战斗">退出</button>
                      </div>
                    </div>
                    <div class="action-filters" id="ui-action-filters"></div>
                    <div class="action-grid" id="ui-action-grid"></div>
                    <textarea id="ui-intent-output" hidden></textarea>
                  </div>
                </div>
                <div class="side-rail"><div class="side-panel" id="ui-team-enemy"></div></div>
              </div>
              <div class="skill-tooltip" id="ui-skill-tooltip"></div>
            </section>
          </div>
        </div>`;
    }

    function getBattleInlineHost() {
      const host = document.getElementById('mvu-battle-inline-host');
      return host instanceof Element && host.isConnected ? host : null;
    }

    function waitForBattleInlineHost(attempts = 12) {
      return new Promise(resolve => {
        const check = remaining => {
          const host = getBattleInlineHost();
          if (host || remaining <= 0) {
            resolve(host || null);
            return;
          }
          if (typeof window.requestAnimationFrame === 'function') {
            window.requestAnimationFrame(() => check(remaining - 1));
          } else {
            window.setTimeout(() => check(remaining - 1), 16);
          }
        };
        check(attempts);
      });
    }

    function isCombatActiveForBattleInline(snapshot) {
      const combatData = deepGet(snapshot, 'rootData.world.战斗', {});
      return !!(combatData && typeof combatData === 'object' && combatData.进行中 && isSnapshotPlayerControlled(snapshot));
    }

    function getBattleInlineSummary(snapshot) {
      const combatData = deepGet(snapshot, 'rootData.world.战斗', {});
      const player = toText(combatData && combatData.参战者 && combatData.参战者.player && combatData.参战者.player.name, '己方');
      const enemy = toText(combatData && combatData.参战者 && combatData.参战者.enemy && combatData.参战者.enemy.name, '对手');
      const round = toNumber(combatData && combatData.回合, 0);
      return {
        title: '战斗',
        meta: `${player} / ${enemy}`,
        roundText: `回合 ${round}`
      };
    }

    function openBattleInlineFromReturnEntry() {
      battleInlineDismissed = false;
      removeBattleReturnEntries();
      openBattleInlineSurface().then(() => refreshLiveSnapshot({ force: true, reopenBattle: true }));
    }

    function removeBattleReturnEntries() {
      document.querySelectorAll('[data-mvu-battle-return="1"]').forEach(node => node.remove());
    }

    function ensureBattleReturnEntry(container, className, html) {
      if (!(container instanceof Element)) return;
      let entry = container.querySelector('[data-mvu-battle-return="1"]');
      if (!entry) {
        entry = document.createElement('button');
        entry.type = 'button';
        entry.setAttribute('data-mvu-battle-return', '1');
        container.appendChild(entry);
      }
      entry.className = className;
      entry.innerHTML = html;
      entry.onclick = event => {
        event.preventDefault();
        event.stopPropagation();
        openBattleInlineFromReturnEntry();
      };
    }

    function syncBattleReturnEntries(snapshot, isActive) {
      if (!isActive) {
        removeBattleReturnEntries();
        return;
      }
      const summary = getBattleInlineSummary(snapshot);
      const unifiedActionGrid = document.querySelector('#mvu-unified-mount .mvu-unified-action-grid');
      ensureBattleReturnEntry(
        unifiedActionGrid,
        'mvu-unified-action-btn mvu-unified-grid-btn mvu-battle-return-entry',
        `<span>${htmlEscape(summary.title)}</span><small>${htmlEscape(summary.meta)}</small>`
      );
      const unifiedTabRow = document.querySelector('#mvu-unified-mount .mvu-unified-tab-row');
      ensureBattleReturnEntry(
        unifiedTabRow,
        'mvu-tab-btn mvu-battle-return-tab',
        htmlEscape(summary.title)
      );
      const splitHosts = [
        document.getElementById('splitFooterTabsLeft'),
        document.getElementById('splitFooterTabsRight')
      ].filter(Boolean);
      splitHosts.forEach(host => ensureBattleReturnEntry(
        host,
        'mvu-tab-btn mvu-battle-return-tab',
        htmlEscape(summary.title)
      ));
    }

    function scheduleBattleReturnEntrySync(snapshot, isActive) {
      const token = ++battleReturnEntrySyncToken;
      const run = () => {
        if (token !== battleReturnEntrySyncToken) return;
        const latestSnapshot = liveSnapshot || lastRenderableSnapshot || snapshot;
        syncBattleReturnEntries(latestSnapshot, isActive && isCombatActiveForBattleInline(latestSnapshot));
      };
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(run);
      }
      [80, 240, 520].forEach(delay => window.setTimeout(run, delay));
    }

    function openBattleInlineSurface() {
      const layoutState = window.__MVU_LAYOUT_STATE__ || {};
      const useShellSurface = !!layoutState.isMobileViewport || layoutState.surfaceMode === 'shell';
      if (useShellSurface) {
        const bridge = getMobileShellBridge();
        if (bridge && typeof bridge.open === 'function') bridge.open();
        if (bridge && typeof bridge.openPreview === 'function') {
          bridge.openPreview(BATTLE_INLINE_PREVIEW_KEY);
        } else if (typeof window.__MVU_OPEN_SHELL_PREVIEW__ === 'function') {
          window.__MVU_OPEN_SHELL_PREVIEW__(BATTLE_INLINE_PREVIEW_KEY, { preserveMapDispatchContext: true });
        }
        return waitForBattleInlineHost();
      }

      if (typeof window.mvuSetDesktopMode === 'function') {
        window.mvuSetDesktopMode('unified');
      }
      if (typeof window.__MVU_OPEN_UNIFIED_PREVIEW__ !== 'function') {
        return Promise.resolve(null);
      }
      window.__MVU_OPEN_UNIFIED_PREVIEW__(BATTLE_INLINE_PREVIEW_KEY, {
        preserveMapDispatchContext: true,
        replace: true
      });
      return waitForBattleInlineHost();
    }

    const COMBAT_PARTICIPANT_STAT_KEYS = ['年龄', '等级', '系别', '天赋梯队', '邪魂师', 'HP', 'HP上限', '魂力', '魂力上限', '精神力', '精神力上限', '力量', '防御', '敏捷', '体力', '体力上限'];

    function buildCombatParticipantFromSnapshotChar(snapshot, charKey, faction = '敌对') {
      const chars = deepGet(snapshot, 'rootData.char', {});
      const sourceChar = chars && typeof chars === 'object' ? chars[charKey] : null;
      if (!sourceChar || typeof sourceChar !== 'object') return null;
      const participant = cloneJsonValue(sourceChar, {});
      const stat = participant.属性 && typeof participant.属性 === 'object' ? participant.属性 : {};
      const status = participant.状态 && typeof participant.状态 === 'object' ? participant.状态 : {};
      participant.name = toText(participant.name || deepGet(participant, 'base.name', ''), charKey);
      participant.势力 = faction;
      participant.状态 = status;
      COMBAT_PARTICIPANT_STAT_KEYS.forEach(key => {
        if (stat[key] !== undefined) participant[key] = stat[key];
      });
      participant.等级 = toNumber(participant.等级, toNumber(stat.等级, 1));
      participant.系别 = toText(participant.系别, toText(stat.系别, '未知系'));
      participant.HP上限 = Math.max(1, toNumber(participant.HP上限, toNumber(stat.HP上限, toNumber(stat.体力上限, 1))));
      participant.HP = Math.max(0, toNumber(participant.HP, toNumber(stat.HP, toNumber(stat.体力, participant.HP上限))));
      participant.体力上限 = Math.max(1, toNumber(participant.体力上限, toNumber(stat.体力上限, 1)));
      participant.体力 = Math.max(0, toNumber(participant.体力, toNumber(stat.体力, participant.体力上限)));
      participant.魂力上限 = Math.max(1, toNumber(participant.魂力上限, toNumber(stat.魂力上限, 1)));
      participant.魂力 = Math.max(0, toNumber(participant.魂力, toNumber(stat.魂力, participant.魂力上限)));
      participant.精神力上限 = Math.max(1, toNumber(participant.精神力上限, toNumber(stat.精神力上限, 1)));
      participant.精神力 = Math.max(0, toNumber(participant.精神力, toNumber(stat.精神力, participant.精神力上限)));
      participant.力量 = Math.max(0, toNumber(participant.力量, toNumber(stat.力量, 1)));
      participant.防御 = Math.max(0, toNumber(participant.防御, toNumber(stat.防御, 1)));
      participant.敏捷 = Math.max(0, toNumber(participant.敏捷, toNumber(stat.敏捷, 1)));
      participant.状态效果 = cloneJsonValue(participant.状态效果 || stat.状态效果 || {}, {});
      participant.持续效果 = cloneJsonValue(participant.持续效果 || {}, {});
      participant.蓄力技能 = participant.蓄力技能 || null;
      participant.存活 = status.存活 !== false;
      return participant;
    }

    function mergeCombatParticipant(baseParticipant, overrideParticipant) {
      const base = baseParticipant && typeof baseParticipant === 'object' ? baseParticipant : {};
      const override = overrideParticipant && typeof overrideParticipant === 'object' ? overrideParticipant : {};
      const merged = { ...base, ...override };
      if (base.属性 || override.属性) merged.属性 = { ...(base.属性 || {}), ...(override.属性 || {}) };
      if (base.状态 || override.状态) {
        merged.状态 = {
          ...(base.状态 && typeof base.状态 === 'object' ? base.状态 : {}),
          ...(override.状态 && typeof override.状态 === 'object' ? override.状态 : {})
        };
      }
      if (!merged.name) merged.name = base.name || override.name || '';
      return merged;
    }

    function findCombatOpponentKey(snapshot, combatData = {}) {
      const participants = combatData && combatData.参战者 && typeof combatData.参战者 === 'object'
        ? combatData.参战者
        : {};
      const explicitEnemy = participants.enemy && typeof participants.enemy === 'object'
        ? toText(participants.enemy.name, '')
        : '';
      if (explicitEnemy) return resolveSnapshotCharKey(snapshot, explicitEnemy);

      const playerKey = resolveSnapshotCharKey(snapshot, deepGet(snapshot, 'rootData.sys.玩家名', '') || toText(snapshot && snapshot.activeName, ''));
      for (const [key, value] of Object.entries(participants)) {
        if (['player', 'enemy', 'team_player', 'team_enemy'].includes(key)) continue;
        const candidateName = toText(value && typeof value === 'object' ? value.name : key, key);
        const candidateKey = resolveSnapshotCharKey(snapshot, candidateName);
        if (candidateKey && candidateKey !== playerKey) return candidateKey;
      }
      return '';
    }

    function normalizeCombatForBattleUI(snapshot) {
      const combatData = deepGet(snapshot, 'rootData.world.战斗', {});
      if (!combatData || typeof combatData !== 'object' || !combatData.进行中) return combatData;
      if (combatData.参战者?.player?.属性 && combatData.参战者?.enemy?.属性) return combatData;

      const playerKey = resolveSnapshotCharKey(snapshot, combatData.参战者?.player?.name || deepGet(snapshot, 'rootData.sys.玩家名', '') || toText(snapshot && snapshot.activeName, ''));
      const enemyKey = findCombatOpponentKey(snapshot, combatData);
      if (!playerKey || !enemyKey) return combatData;

      const nextCombat = cloneJsonValue(combatData, {});
      const participants = nextCombat.参战者 && typeof nextCombat.参战者 === 'object' ? nextCombat.参战者 : {};
      participants.player = mergeCombatParticipant(
        buildCombatParticipantFromSnapshotChar(snapshot, playerKey, '己方'),
        participants.player
      );
      participants.enemy = mergeCombatParticipant(
        buildCombatParticipantFromSnapshotChar(snapshot, enemyKey, '敌对'),
        participants.enemy
      );
      participants.team_player = Array.isArray(participants.team_player) ? participants.team_player : [];
      participants.team_enemy = Array.isArray(participants.team_enemy) ? participants.team_enemy : [];
      nextCombat.参战者 = participants;
      nextCombat.战斗类型 = toText(nextCombat.战斗类型, '突发遭遇');
      nextCombat.回合 = Math.max(0, toNumber(nextCombat.回合, 0));
      const stageValue = toText(nextCombat.阶段, '宣告阶段');
      nextCombat.阶段 = ['无', '宣告阶段', '对轰判定阶段', '回合结算阶段'].includes(stageValue)
        ? stageValue
        : '宣告阶段';
      nextCombat.环境 = toText(nextCombat.环境, '正常');
      snapshot.rootData.world.战斗 = nextCombat;
      return nextCombat;
    }

    function syncBattleUiForSnapshot(snapshot, options = {}) {
      const liveCombatData = normalizeCombatForBattleUI(snapshot);
      const isCombatActive = !!(liveCombatData && liveCombatData.进行中);
      const canUseBattle = isCombatActive && isSnapshotPlayerControlled(snapshot);
      syncBattleReturnEntries(snapshot, canUseBattle && battleInlineDismissed);
      if (canUseBattle && battleInlineDismissed && !options.reopenBattle) {
        if (activeBattleUI && typeof activeBattleUI.destroy === 'function') activeBattleUI.destroy();
        activeBattleUI = null;
        scheduleBattleReturnEntrySync(snapshot, true);
        return;
      }
      if (canUseBattle) {
        const currentHost = getBattleInlineHost();
        if (activeBattleUI && currentHost && activeBattleUI.container === currentHost && typeof activeBattleUI.updateData === 'function') {
          activeBattleUI.updateData(snapshot);
          return;
        }
        if (activeBattleUI && typeof activeBattleUI.destroy === 'function') activeBattleUI.destroy();
        activeBattleUI = null;
        if (pendingBattleInlineMount) return;
        const mountToken = ++battleInlineMountToken;
        pendingBattleInlineMount = openBattleInlineSurface()
          .then(host => {
            if (mountToken !== battleInlineMountToken) return;
            const latestSnapshot = liveSnapshot || lastRenderableSnapshot || snapshot;
            const latestCombatData = normalizeCombatForBattleUI(latestSnapshot);
            if (!latestCombatData || !latestCombatData.进行中 || !isSnapshotPlayerControlled(latestSnapshot)) return;
            if (!host || typeof window.mountBattleUI !== 'function') {
              showUiToast('战斗终端嵌入宿主未就绪，战斗模块未打开。', 'error', 4200);
              return;
            }
            activeBattleUI = window.mountBattleUI(host, latestSnapshot, {
              onAction: (actionData) => {
                dispatchUiAiRequest(actionData.playerInput, actionData.systemPrompt, { requestKind: actionData.requestKind });
              }
            });
          })
          .catch(error => {
            console.error('[DragonUI] Battle inline mount failed', error);
            showUiToast('战斗终端打开失败。', 'error', 4200);
          })
          .finally(() => {
            if (mountToken === battleInlineMountToken) pendingBattleInlineMount = null;
          });
      } else {
        battleInlineMountToken++;
        pendingBattleInlineMount = null;
        battleInlineDismissed = false;
        removeBattleReturnEntries();
        if (activeBattleUI && typeof activeBattleUI.destroy === 'function') activeBattleUI.destroy();
        activeBattleUI = null;
      }
    }

    function buildMapBattleCombatData(snapshot, dispatchDetail) {
      const detail = dispatchDetail || {};
      const npcTarget = toText(detail.npcTarget, '');
      const activeKey = resolveSnapshotCharKey(snapshot, toText(snapshot && snapshot.activeName, '') || deepGet(snapshot, 'rootData.sys.玩家名', ''));
      const targetKey = resolveSnapshotCharKey(snapshot, npcTarget);
      if (!snapshot || !snapshot.rootData || !activeKey || !targetKey) return null;
      const player = buildCombatParticipantFromSnapshotChar(snapshot, activeKey, '己方');
      const enemy = buildCombatParticipantFromSnapshotChar(snapshot, targetKey, '敌对');
      if (!player || !enemy) return null;
      const arenaName = toText(detail.currentLoc, toText(detail.target, toText(snapshot.currentLoc, '未知地点')));
      return {
        进行中: true,
        战斗类型: toText(detail.战斗类型, '擂台切磋'),
        战斗意图: '点到为止',
        先攻: '无',
        允许撤离: true,
        回合: 0,
        阶段: '宣告阶段',
        环境: arenaName,
        裁断约束: {},
        前端建议结果: '',
        裁断结果: '',
        建议终点HP区间: '',
        前端推荐终点HP: 0,
        预计HP伤害: 0,
        本次操作: {},
        参战者: {
          player,
          enemy,
          team_player: [],
          team_enemy: []
        },
        source: 'map_action',
        request: {
          action: '战斗',
          target: arenaName,
          npcTarget
        }
      };
    }

    async function openMapBattleModule(snapshot, dispatchDetail) {
      const combatData = buildMapBattleCombatData(snapshot, dispatchDetail);
      if (!combatData) return { ok: false, reason: 'combat_context_unresolved' };
      const playerName = toText(combatData.参战者.player.name, '玩家');
      const enemyName = toText(combatData.参战者.enemy.name, '对手');
      battleInlineDismissed = false;
      await applyJsonPatchOpsByEditor([
        { op: 'replace', path: '/world/战斗', value: combatData },
        { op: 'replace', path: '/sys/rsn', value: `[战斗模块] ${playerName} 向 ${enemyName} 发起切磋，战斗模块已接管。` }
      ]);
      showUiToast('战斗模块已开启。', 'info', 2400);
      return { ok: true, combatData };
    }

    function buildTradeDispatchFromRequest(snapshot, tradeRequest) {
      const req = tradeRequest && typeof tradeRequest === 'object' ? tradeRequest : {};
      const actionText = toText(req.动作, '');
      let action = 'trade';
      const services = [];
      if (/竞拍|拍卖|auction|bid/i.test(actionText)) {
        action = 'bid';
        services.push('auction');
      } else if (/店铺|采购|购买|shop/i.test(actionText) && !toText(req.对象, '')) {
        action = 'shop';
        services.push('shop');
      } else if (/出售|卖出|sell/i.test(actionText) && !toText(req.对象, '')) {
        action = 'sell';
      }
      return {
        action,
        target: toText(req.目标, toText(snapshot && snapshot.currentLoc, '')),
        currentLoc: toText(snapshot && snapshot.currentLoc, ''),
        npcTarget: toText(req.对象, ''),
        services,
        tradeRequest: cloneJsonValue(req, {})
      };
    }

    function maybeOpenTradeRequestFromAI(snapshot) {
      const tradeRequest = deepGet(snapshot, 'rootData.world.交易请求', {});
      const action = toText(tradeRequest && tradeRequest.动作, '');
      const status = toText(tradeRequest && tradeRequest.状态, 'pending');
      if (!tradeRequest || typeof tradeRequest !== 'object' || !action || action === '无' || /handled|done|完成|已处理|取消|cancel/i.test(status)) {
        lastAutoTradeRequestSignature = '';
        hasHydratedAutoTradeRequestSignature = true;
        return;
      }
      if (!isSnapshotPlayerControlled(snapshot)) return;
      const signature = (() => {
        try { return JSON.stringify(tradeRequest); } catch (error) { return `${action}:${Date.now()}`; }
      })();
      if (!hasHydratedAutoTradeRequestSignature) {
        lastAutoTradeRequestSignature = signature;
        hasHydratedAutoTradeRequestSignature = true;
        return;
      }
      if (signature === lastAutoTradeRequestSignature) return;
      lastAutoTradeRequestSignature = signature;
      mapDispatchContext = buildTradeDispatchFromRequest(snapshot, tradeRequest);
      openModal('交易网络', { preserveMapDispatchContext: true });
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
      const arenaName = toText(detail.currentLoc, toText(detail.target, toText(snapshot.currentLoc, '未知地点')));
      const relationMap = deepGet(activeChar, '社交.关系', {});
      const relationData = relationMap && typeof relationMap === 'object'
        ? (relationMap[targetName] || relationMap[targetKey] || {})
        : {};
      const relationSummary = relationData && typeof relationData === 'object'
        ? `${toText(relationData['关系'], '陌生')} / ${toText(relationData['关系路线'], '朋友线')} / 好感 ${toNumber(relationData['好感度'], 0)}`
        : '暂无明确关系记录';
      const activeLoc = toText(deepGet(activeChar, '状态.位置', arenaName), arenaName || '未知地点');
      const targetLoc = toText(deepGet(targetChar, '状态.位置', arenaName), arenaName || '未知地点');
      const systemPrompt = `以下内容属于前端代发的地图切磋请求，请直接承接剧情推进，不要输出 JSON 块或变量维护指令。
[切磋请求] ${activeName} 在【${arenaName}】向【${targetName}】发起切磋。
[切磋原则]
这是一场默认以切磋、试探、较量为目的的交手，不以击杀为目标；请自然承接为点到为止、可被围观或被制止的战斗场景，而不是无端升级成死战。
[角色参考]
发起者：${activeName} / 当前地点 ${activeLoc}
目标：${targetName} / 当前地点 ${targetLoc}
双方关系：${relationSummary}
[裁定要求]
你需要承接这次切磋请求，自然写出双方是否应战、开场姿态与后续战斗推进；若剧情上不适合立刻开打，也要以“切磋请求已经提出”为前提给出自然回应，而不是忽略这次请求。`;

      return {
        playerInput: `我想在【${arenaName}】与【${targetName}】切磋。`,
        systemPrompt,
        requestKind: toText(detail.requestKind, 'map_sparring')
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
      const relationMap = deepGet(snapshot, 'activeChar.社交.关系', {});
      const relationData = relationMap && typeof relationMap === 'object'
        ? (relationMap[targetName] || relationMap[resolvedTarget.key] || {})
        : {};
      const arenaName = toText(detail.currentLoc, toText(detail.target, toText(snapshot.currentLoc, '未知地点')));
      const currentTick = toNumber(deepGet(snapshot, 'rootData.world.时间.tick', 0), 0);
      const itemUsed = interactAction === '送礼'
        ? (toText(detail.itemUsed, toText(detail.item_used, '无')) || '无')
        : '无';
      const targetChar = resolvedTarget && resolvedTarget.char && typeof resolvedTarget.char === 'object' ? resolvedTarget.char : {};
      const activeIdentity = toText(deepGet(activeChar, '社交.主身份', '无'), '无');
      const targetIdentity = toText(deepGet(targetChar, '社交.主身份', '无'), '无');
      const activePersonality = toText(deepGet(activeChar, '性格', '未设定'), '未设定');
      const targetPersonality = toText(deepGet(targetChar, '性格', '未设定'), '未设定');
      const activeLoc = toText(deepGet(activeChar, '状态.位置', arenaName), arenaName || '未知地点');
      const targetLoc = toText(deepGet(targetChar, '状态.位置', '未知地点'), '未知地点');
      const activeFactions = Object.keys(deepGet(activeChar, '社交.势力', {})).filter(Boolean);
      const targetFactions = Object.keys(deepGet(targetChar, '社交.势力', {})).filter(Boolean);
      const recentInteractText = relationData && typeof relationData === 'object'
        ? `${toText(relationData['上次互动动作'], '无')} / ${toNumber(relationData['最近好感变化'], 0)}`
        : '无';
      const progressNote = relationData && typeof relationData === 'object' ? toText(deepGet(relationData, '_推进提示', '暂无'),'暂无') : '暂无';
      const routeSwitchable = !!deepGet(relationData, '_可切线', false);
      const sourceLabel = toText(detail.sourceLabel, '地图 NPC 互动');
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

      const relationSummary = relationData && typeof relationData === 'object'
        ? `${toText(relationData['关系'], '陌生')} / 路线 ${toText(relationData['关系路线'], '朋友线')} / 好感 ${toNumber(relationData['好感度'], 0)}`
        : '暂无已知关系记录';

      const systemPrompt = `以下内容属于前端代发的${sourceLabel}请求，请直接承接剧情推进，不要输出 JSON 块或变量维护指令。

[社交互动] ${activeName} 在【${arenaName}】对【${targetName}】发起【${interactAction}】。

[关系参考]
当前关系：${relationSummary}

[角色补充]
发起者：${activeName} / 身份 ${activeIdentity} / 性格 ${activePersonality} / 所属势力 ${activeFactions.join(' / ') || '无'} / 所在地 ${activeLoc}
目标：${targetName} / 身份 ${targetIdentity} / 性格 ${targetPersonality} / 所属势力 ${targetFactions.join(' / ') || '无'} / 所在地 ${targetLoc}
最近互动：${recentInteractText}
推进提示：${progressNote}
当前是否可切恋人线：${routeSwitchable ? '是' : '否'}
预计耗时：${currentTick >= 0 ? '约 2 tick' : '短时互动'}

[互动裁定原则]
请综合考虑基础好感、当前关系阶段与路线、双方性格、身份与现实压力、所属势力带来的立场影响、当前地点是否适合展开该互动，以及最近互动的延续性。若互动无法成立，请在剧情里自然给出原因。${interactAction === '送礼' ? ` 送礼物品为【${itemUsed}】；请判断这份礼物是否对目标性格、身份、处境与当下气氛对口。` : ''}${interactAction === '表白' ? ' 表白时请区分“试着交往/进入暧昧推进”与“正式确认关系”两种结果。' : ''}${interactAction === '双修' ? ' 双修属于高亲密度互动，若人物状态、性格、场景或关系阶段不匹配，应明确写出无法成立的理由。' : ''}${interactAction === '请教' ? ' 请教不仅看好感，也要看目标是否愿意传授、双方当前关系是否适合，以及当下场景是否便于认真交流。' : ''}`;

      return {
        playerInput: actionPromptMap[action] || `我想在【${arenaName}】与【${targetName}】互动。`,
        systemPrompt,
        requestKind: toText(detail.requestKind, 'map_interaction')
      };
    }

    function getChatSendTextarea() {
      return document.getElementById('send_textarea') || document.querySelector('#send_form textarea');
    }

    function extractBracketTokens(text) {
      const tokens = [];
      String(text || '').replace(/【([^】]{1,80})】/g, (_, token) => {
        const value = toText(token, '').trim();
        if (value) tokens.push(value);
        return _;
      });
      return tokens;
    }

    function getSnapshotActiveCharName(snapshot) {
      return toText(
        deepGet(snapshot, 'rootData.sys.玩家名', '') || toText(snapshot && snapshot.activeName, ''),
        ''
      ).trim();
    }

    function resolveDirectIntentCharName(snapshot, rawName) {
      const key = resolveSnapshotCharKey(snapshot, rawName);
      if (!key) return '';
      const charData = deepGet(snapshot, `rootData.char.${key}`, {});
      return toText(charData?.name || deepGet(charData, 'base.name', '') || key, key);
    }

    function findMentionedCharacterName(snapshot, text, options = {}) {
      const activeName = toText(options.activeName, getSnapshotActiveCharName(snapshot));
      const excludedNames = new Set([activeName, ...(options.exclude || [])].map(item => toText(item, '').trim()).filter(Boolean));
      const tokens = extractBracketTokens(text);
      for (let index = tokens.length - 1; index >= 0; index -= 1) {
        const resolvedName = resolveDirectIntentCharName(snapshot, tokens[index]);
        if (resolvedName && !excludedNames.has(resolvedName)) return resolvedName;
      }

      const chars = deepGet(snapshot, 'rootData.char', {});
      const candidates = Object.entries(chars && typeof chars === 'object' ? chars : {})
        .flatMap(([key, charData]) => [
          toText(charData?.name, ''),
          toText(deepGet(charData, 'base.name', ''), ''),
          toText(key, '')
        ].filter(Boolean))
        .filter((name, index, list) => list.indexOf(name) === index && !excludedNames.has(name))
        .sort((a, b) => b.length - a.length);
      return candidates.find(name => name && String(text || '').includes(name)) || '';
    }

    function findBracketLocationToken(snapshot, text) {
      const tokens = extractBracketTokens(text);
      const currentLoc = toText(snapshot && snapshot.currentLoc, '');
      const normalizedLoc = toText(snapshot && snapshot.normalizedLoc, '');
      for (const token of tokens) {
        if (resolveDirectIntentCharName(snapshot, token)) continue;
        if (token.includes('-') || token === currentLoc || token === normalizedLoc) return token;
      }
      return currentLoc || normalizedLoc || '未知地点';
    }

    function hasActionableBattleIntent(text) {
      const raw = toText(text, '').trim();
      if (!raw || raw.startsWith('/') || /<UpdateVariable|<JSONPatch|\/world\/战斗|\/world\/交易请求/i.test(raw)) return false;
      if (!/(切磋|单挑|挑战|对决|交手|打一场|打一架|开打|开战|战斗|攻击|袭击|伏击|追击|技能对轰|动手)/.test(raw)) return false;
      if (/(是什么|为什么|怎么|如何|会不会|能不能|如果|假如|规则|机制|说明|解释|讨论|听说|回忆)/.test(raw)
        && !/(我想|我要|我准备|我打算|现在|直接|开始|发起|向|与|和|对|找)/.test(raw)) {
        return false;
      }
      return /(我想|我要|我准备|我打算|现在|直接|开始|发起|向|与|和|对|找|挑战|攻击|袭击|伏击|追击|切磋|单挑)/.test(raw);
    }

    function buildDirectBattleIntent(snapshot, text) {
      if (!snapshot || !snapshot.rootData || deepGet(snapshot, 'rootData.world.战斗.进行中', false)) return null;
      if (!hasActionableBattleIntent(text)) return null;
      const activeName = getSnapshotActiveCharName(snapshot);
      const targetName = findMentionedCharacterName(snapshot, text, { activeName });
      if (!targetName) return null;
      const targetKey = resolveSnapshotCharKey(snapshot, targetName);
      const activeKey = resolveSnapshotCharKey(snapshot, activeName);
      if (!targetKey || !activeKey || targetKey === activeKey) return null;
      const isDeadly = /(死战|生死|击杀|杀死|杀了|下杀手|袭击|伏击|偷袭|追杀)/.test(toText(text, ''));
      const arenaName = findBracketLocationToken(snapshot, text);
      return {
        action: 'battle',
        target: arenaName,
        currentLoc: arenaName,
        npcTarget: targetName,
        战斗类型: isDeadly ? '突发遭遇' : '擂台切磋',
        source: 'direct_input_guard'
      };
    }

    function parseDirectIntentCount(text, fallback = 1) {
      const digitMatch = String(text || '').match(/(?:数量|买|购买|买入|采购|卖|出售|卖出|竞拍|出价)?\s*(\d{1,4})\s*(?:份|个|件|枚|瓶|株|块|包|张|套)?/);
      if (digitMatch) return Math.max(1, toNumber(digitMatch[1], fallback));
      const map = { 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
      const chineseMatch = String(text || '').match(/([一二两三四五六七八九十]{1,3})\s*(?:份|个|件|枚|瓶|株|块|包|张|套)/);
      if (!chineseMatch) return fallback;
      const raw = chineseMatch[1];
      if (raw === '十') return 10;
      if (raw.includes('十')) {
        const [tensRaw, onesRaw] = raw.split('十');
        return Math.max(1, (map[tensRaw] || 1) * 10 + (map[onesRaw] || 0));
      }
      return Math.max(1, map[raw] || fallback);
    }

    function findDirectTradeItemName(snapshot, text, npcName) {
      const currentLoc = toText(snapshot && snapshot.currentLoc, '');
      const normalizedLoc = toText(snapshot && snapshot.normalizedLoc, '');
      const tokens = extractBracketTokens(text);
      for (const token of tokens) {
        if (!token || token === npcName || token === currentLoc || token === normalizedLoc || token.includes('-')) continue;
        if (resolveDirectIntentCharName(snapshot, token)) continue;
        return token;
      }
      const match = String(text || '').match(/(?:购买|买入|采购|出售|卖出|竞拍|拍下|出价|交易)\s*([^，。！？\s]{2,24})/);
      return toText(match && match[1], '').replace(/^[一二两三四五六七八九十\d]+(份|个|件|枚|瓶|株|块|包|张|套)?/, '').trim();
    }

    function buildDirectTradeRequest(snapshot, text) {
      const raw = toText(text, '').trim();
      if (!snapshot || !snapshot.rootData || !raw || raw.startsWith('/') || /<UpdateVariable|<JSONPatch/i.test(raw)) return null;
      if (!/(购买|买入|采购|出售|卖出|交易|竞拍|拍卖|拍下|出价|讨价还价)/.test(raw)) return null;
      if (/(是什么|为什么|怎么|如何|会不会|能不能|如果|假如|规则|机制|说明|解释|讨论|听说|回忆)/.test(raw)
        && !/(我想|我要|我准备|我打算|现在|直接|开始|发起|向|与|和|对|找|买|卖|出价)/.test(raw)) {
        return null;
      }
      const npcName = findMentionedCharacterName(snapshot, raw, { activeName: getSnapshotActiveCharName(snapshot) });
      const itemName = findDirectTradeItemName(snapshot, raw, npcName);
      if (!itemName) return null;
      const action = /竞拍|拍卖|拍下|出价/.test(raw)
        ? '竞拍'
        : (/出售|卖出/.test(raw) ? '出售' : (/购买|买入|采购/.test(raw) ? '购买' : '交易'));
      const priceMatch = raw.match(/(?:单价|价格|报价|出价|价钱|花费|支付|用)\s*(\d{1,9})/) || raw.match(/(\d{1,9})\s*(?:联邦币|金魂币|金币)/);
      return {
        动作: action,
        目标: findBracketLocationToken(snapshot, raw),
        对象: npcName,
        物品: itemName,
        数量: parseDirectIntentCount(raw, 1),
        价格: priceMatch ? Math.max(0, toNumber(priceMatch[1], 0)) : 0,
        货币: /金魂币|金币/.test(raw) ? 'gold_coin' : 'fed_coin',
        状态: /直接|立即|确认|成交|买下|拍下|自动/.test(raw) ? 'ready' : 'pending',
        自动执行: /直接|立即|确认|成交|买下|拍下|自动/.test(raw),
        来源: 'direct_input_guard'
      };
    }

    function normalizeProfessionMode(rawMode) {
      const value = toText(rawMode, '').trim().toLowerCase();
      if (/manufacture|制造|组装|总装|封装/.test(value)) return 'manufacture';
      if (/design|设计|图纸|蓝图/.test(value)) return 'design';
      if (/repair|修理|维修|维护|修复|整备/.test(value)) return 'repair';
      if (/forge|锻造|锻打|融锻|百锻|千锻|灵锻|魂锻|天锻/.test(value)) return 'forge';
      return '';
    }

    function normalizeProfessionActionLabel(mode) {
      return ({ forge: '锻造', manufacture: '制造', design: '设计', repair: '修理' })[mode] || '副职业操作';
    }

    function parseDirectProfessionTier(text) {
      const raw = toText(text, '');
      if (/天锻|四字|红级/.test(raw)) return 5;
      if (/魂锻|三字|黑级/.test(raw)) return 4;
      if (/灵锻|二字/.test(raw)) return 3;
      if (/千锻|一字|紫级/.test(raw)) return 2;
      const match = raw.match(/([1-5一二两三四五])\s*(?:阶|级)/);
      const map = { 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5 };
      return match ? Math.max(1, Math.min(5, Number(match[1]) || map[match[1]] || 1)) : 1;
    }

    function parseDirectProfessionSubtype(text) {
      const raw = toText(text, '');
      if (/斗铠|一字|二字|三字|四字/.test(raw)) return 'armor';
      if (/机甲|黄级|紫级|黑级|红级/.test(raw)) return 'mech';
      return '';
    }

    function findDirectProfessionTarget(snapshot, text, npcName = '') {
      const currentLoc = toText(snapshot && snapshot.currentLoc, '');
      const normalizedLoc = toText(snapshot && snapshot.normalizedLoc, '');
      const tokens = extractBracketTokens(text);
      for (let index = tokens.length - 1; index >= 0; index -= 1) {
        const token = tokens[index];
        if (!token || token === npcName || token === currentLoc || token === normalizedLoc || token.includes('-')) continue;
        if (resolveDirectIntentCharName(snapshot, token)) continue;
        return token;
      }
      const match = String(text || '').match(/(?:锻造|锻打|制造|组装|设计|绘制|修理|维修|维护|修复|整备)\s*([^，。！？\s]{2,32})/);
      return toText(match && match[1], '').trim();
    }

    function findDirectProfessionMaterials(snapshot, text, targetName = '', npcName = '') {
      const currentLoc = toText(snapshot && snapshot.currentLoc, '');
      const normalizedLoc = toText(snapshot && snapshot.normalizedLoc, '');
      return extractBracketTokens(text).filter(token => {
        if (!token || token === targetName || token === npcName || token === currentLoc || token === normalizedLoc || token.includes('-')) return false;
        return !resolveDirectIntentCharName(snapshot, token);
      });
    }

    function buildProfessionRequestFromObject(snapshot, source) {
      const req = source && typeof source === 'object' ? source : {};
      const mode = normalizeProfessionMode(req.模式 || req.动作 || req.副职业 || req.职业 || req.类型);
      if (!mode) return null;
      const npc = toText(req.对象 || req.执行者 || req.执行者名称, '');
      return {
        模式: mode,
        动作: normalizeProfessionActionLabel(mode),
        目标: toText(req.目标 || req.产物 || req.物品, ''),
        材料: Array.isArray(req.材料)
          ? req.材料.map(item => toText(item, '')).filter(Boolean)
          : (req.材料 && typeof req.材料 === 'object'
            ? Object.keys(req.材料).filter(Boolean)
            : toText(req.材料, '')
              .split(/[、,，|/]+/)
              .map(item => item.trim())
              .filter(Boolean)),
        数量: Math.max(1, toNumber(req.数量 || req.耗材数量, 1)),
        阶级: Math.max(1, Math.min(5, toNumber(req.阶级 || req.等级, 1))),
        子类型: toText(req.子类型 || req.目标类型, ''),
        对象: npc,
        执行者类型: toText(req.执行者类型 || (npc ? 'private' : ''), ''),
        目标地点: toText(req.目标地点 || req.地点, toText(snapshot && snapshot.currentLoc, '')),
        状态: toText(req.状态, req.自动执行 ? 'ready' : 'pending'),
        自动执行: req.自动执行 === true,
        来源: toText(req.来源, 'module_intent_router')
      };
    }

    function buildDirectProfessionRequest(snapshot, textOrPlan) {
      if (!snapshot || !snapshot.rootData) return null;
      if (textOrPlan && typeof textOrPlan === 'object') return buildProfessionRequestFromObject(snapshot, textOrPlan);
      const raw = toText(textOrPlan, '').trim();
      if (!raw || raw.startsWith('/') || /<UpdateVariable|<JSONPatch/i.test(raw)) return null;
      const mode = normalizeProfessionMode(raw);
      if (!mode) return null;
      if (/(是什么|为什么|怎么|如何|会不会|能不能|如果|假如|规则|机制|说明|解释|讨论|听说|回忆)/.test(raw)
        && !/(我想|我要|我准备|我打算|现在|直接|开始|发起|委托|办理|用|把|给|帮|自动)/.test(raw)) {
        return null;
      }
      const npc = findMentionedCharacterName(snapshot, raw, { activeName: getSnapshotActiveCharName(snapshot) });
      const target = findDirectProfessionTarget(snapshot, raw, npc);
      if (!target && !/打开|进入|办理|工坊|协会|委托/.test(raw)) return null;
      const materials = findDirectProfessionMaterials(snapshot, raw, target, npc);
      return {
        模式: mode,
        动作: normalizeProfessionActionLabel(mode),
        目标: target,
        材料: materials,
        数量: parseDirectIntentCount(raw, 1),
        阶级: parseDirectProfessionTier(raw),
        子类型: parseDirectProfessionSubtype(raw),
        对象: npc,
        执行者类型: /协会|官方/.test(raw) ? 'official' : (npc || /委托|代工|帮/.test(raw) ? 'private' : 'self'),
        目标地点: findBracketLocationToken(snapshot, raw),
        状态: /直接|立即|确认|开始|自动|执行/.test(raw) ? 'ready' : 'pending',
        自动执行: /直接|立即|确认|开始|自动|执行/.test(raw),
        来源: 'direct_input_guard'
      };
    }

    function buildCraftDispatchFromRequest(snapshot, professionRequest) {
      const req = professionRequest && typeof professionRequest === 'object' ? professionRequest : {};
      return {
        action: 'craft',
        target: toText(req.目标地点 || req.目标, toText(snapshot && snapshot.currentLoc, '')),
        currentLoc: toText(snapshot && snapshot.currentLoc, ''),
        npcTarget: toText(req.对象, ''),
        executorType: toText(req.执行者类型, toText(req.对象, '') ? 'private' : 'self'),
        services: ['craft'],
        professionRequest: cloneJsonValue(req, {})
      };
    }

    function openProfessionModuleFromRequest(snapshot, professionRequest) {
      mapDispatchContext = buildCraftDispatchFromRequest(snapshot, professionRequest);
      openModal('武装工坊详细页', { preserveMapDispatchContext: true });
      return { ok: true, professionRequest: cloneJsonValue(professionRequest, {}) };
    }

    function normalizeInlineModuleAction(actionData, moduleKind, request) {
      const data = actionData && typeof actionData === 'object' ? actionData : {};
      const playerInput = toText(data.playerInput, '').trim();
      const systemPrompt = toText(data.systemPrompt, '').trim();
      const requestKind = toText(data.requestKind, moduleKind ? `module_${moduleKind}` : 'module_inline');
      if (!playerInput || !systemPrompt) return null;
      return {
        playerInput,
        systemPrompt,
        requestKind,
        moduleKind: toText(moduleKind, ''),
        request: cloneJsonValue(request, {})
      };
    }

    async function captureInlineModuleAction(mountRunner, options = {}) {
      const timeoutMs = Math.max(200, Math.min(3000, toNumber(options.timeoutMs, 1200)));
      const container = document.createElement('div');
      container.className = 'mvu-inline-module-capture';
      container.style.cssText = 'position:fixed;left:-10000px;top:-10000px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;';
      let component = null;
      let alertMessage = '';
      const originalAlert = window.alert;

      try {
        document.body.appendChild(container);
        window.alert = (message) => {
          alertMessage = toText(message, '模块校验未通过。');
        };
        const result = await new Promise(resolve => {
          let settled = false;
          const finish = value => {
            if (settled) return;
            settled = true;
            resolve(value);
          };
          const timer = window.setTimeout(() => {
            finish({ ok: false, reason: alertMessage || 'inline_action_timeout' });
          }, timeoutMs);
          try {
            component = mountRunner(container, actionData => {
              window.clearTimeout(timer);
              finish({ ok: true, actionData });
            });
          } catch (error) {
            window.clearTimeout(timer);
            finish({ ok: false, reason: error && error.message ? error.message : 'inline_mount_failed', error });
          }
        });
        if (result && result.ok && result.actionData) return result;
        return { ok: false, reason: alertMessage || (result && result.reason) || 'inline_action_unavailable', error: result && result.error };
      } finally {
        window.alert = originalAlert;
        try {
          if (component && typeof component.destroy === 'function') component.destroy();
        } catch (error) {}
        try {
          if (container.parentNode) container.parentNode.removeChild(container);
        } catch (error) {}
      }
    }

    async function buildInlineTradeAction(snapshot, tradeRequest) {
      if (typeof window.mountTradeUI !== 'function') {
        return { ok: false, reason: 'trade_ui_unavailable' };
      }
      const dispatchDetail = buildTradeDispatchFromRequest(snapshot, tradeRequest);
      const launchOptions = buildMapTradeModalOptions(snapshot, dispatchDetail);
      const capture = await captureInlineModuleAction((container, done) => window.mountTradeUI(container, snapshot, {
        initialTab: launchOptions.initialTab,
        prefillNpc: launchOptions.prefillNpc,
        lockNpc: launchOptions.lockNpc,
        preferredStore: launchOptions.preferredStore,
        prefillAction: launchOptions.prefillAction,
        prefillItem: launchOptions.prefillItem,
        prefillQty: launchOptions.prefillQty,
        prefillPrice: launchOptions.prefillPrice,
        autoExecute: true,
        onTradeAction: done
      }), { timeoutMs: 1400 });
      if (!capture.ok) return capture;
      const inlineAction = normalizeInlineModuleAction(capture.actionData, 'trade', tradeRequest);
      return inlineAction ? { ok: true, inlineAction } : { ok: false, reason: 'trade_action_invalid' };
    }

    async function buildInlineProfessionAction(snapshot, professionRequest) {
      if (typeof window.mountProfessionUI !== 'function') {
        return { ok: false, reason: 'profession_ui_unavailable' };
      }
      const dispatchContext = buildCraftDispatchFromRequest(snapshot, professionRequest);
      const capture = await captureInlineModuleAction((container, done) => window.mountProfessionUI(container, snapshot, {
        dispatchContext,
        professionRequest: cloneJsonValue(professionRequest, {}),
        autoExecute: true,
        onAction: done
      }), { timeoutMs: 1600 });
      if (!capture.ok) return capture;
      const inlineAction = normalizeInlineModuleAction(capture.actionData, 'profession', professionRequest);
      return inlineAction ? { ok: true, inlineAction } : { ok: false, reason: 'profession_action_invalid' };
    }

    function buildTradeRequestFromObject(snapshot, source) {
      const req = source && typeof source === 'object' ? source : {};
      const action = toText(req.动作 || req.模式 || req.类型, '交易');
      const npc = toText(req.对象 || req.目标对象, '');
      const item = toText(req.物品 || req.目标物品 || req.目标, '');
      if (!item) return null;
      return {
        动作: action,
        目标: toText(req.目标地点 || req.地点 || req.目标, toText(snapshot && snapshot.currentLoc, '')),
        对象: npc,
        物品: item,
        数量: Math.max(1, toNumber(req.数量, 1)),
        价格: Math.max(0, toNumber(req.价格 || 0, 0)),
        货币: toText(req.货币, /金魂币|金币/.test(toText(req.货币文本 || req.text, '')) ? 'gold_coin' : 'fed_coin'),
        状态: toText(req.状态, req.自动执行 ? 'ready' : 'pending'),
        自动执行: req.自动执行 === true,
        来源: toText(req.来源, 'module_intent_router')
      };
    }

    function resolveModuleIntentPayload(input) {
      const outerPayload = input && typeof input === 'object' ? input : {};
      const nestedRequest = outerPayload.request && typeof outerPayload.request === 'object' ? outerPayload.request : null;
      const payload = nestedRequest
        ? {
          ...nestedRequest,
          module: outerPayload.module || nestedRequest.module,
          kind: outerPayload.kind || outerPayload.module || nestedRequest.kind || nestedRequest.module,
          type: outerPayload.type || nestedRequest.type,
          action_type: outerPayload.action_type || nestedRequest.action_type,
          自动执行: outerPayload.自动执行 === true || nestedRequest.自动执行 === true,
          autoExecute: outerPayload.autoExecute === true || nestedRequest.autoExecute === true,
          source: outerPayload.source || nestedRequest.source
        }
        : outerPayload;
      const text = typeof input === 'string'
        ? input
        : toText(outerPayload.text || outerPayload.plan || outerPayload.message || outerPayload.narrative || outerPayload.intent || outerPayload.raw
          || payload.text || payload.plan || payload.message || payload.narrative || payload.intent || payload.raw, '');
      const kind = toText(outerPayload.kind || outerPayload.type || outerPayload.module || outerPayload.action_type
        || payload.kind || payload.type || payload.module || payload.action_type || payload.动作, '').toLowerCase();
      return { payload, text, kind };
    }

    async function routeModuleIntentPayload(input, options = {}) {
      const snapshot = liveSnapshot || lastRenderableSnapshot;
      const { payload, text, kind } = resolveModuleIntentPayload(input);
      if (!snapshot || !snapshot.rootData) return { handled: false, reason: 'snapshot_unavailable' };

      const forceAutoExecute = options.autoExecute === true || payload.自动执行 === true || payload.autoExecute === true;
      const dryRun = options.dryRun === true || payload.dryRun === true;
      const dispatchMode = toText(options.dispatchMode || payload.dispatchMode, '').toLowerCase();
      const wantsInline = dispatchMode === 'inline';
      let moduleKind = '';
      let request = null;

      if (/battle|combat|战斗|切磋|单挑/.test(kind)) {
        const npcTarget = toText(payload.npcTarget || payload.enemy || payload.targetNpc || payload.npc, '')
          || findMentionedCharacterName(snapshot, text, { activeName: getSnapshotActiveCharName(snapshot) });
        request = {
          action: 'battle',
          target: toText(payload.location || payload.targetLocation || payload.arena || payload.target, findBracketLocationToken(snapshot, text)),
          currentLoc: toText(payload.currentLoc || payload.location, toText(snapshot && snapshot.currentLoc, '')),
          npcTarget,
          战斗类型: toText(payload.战斗类型, /死战|生死|击杀|袭击|伏击/.test(text) ? '突发遭遇' : '擂台切磋'),
          source: toText(payload.source, 'module_intent_router')
        };
        if (!npcTarget) request = null;
        moduleKind = 'battle';
      } else if (/trade|交易|购买|出售|竞拍|拍卖/.test(kind)) {
        request = buildTradeRequestFromObject(snapshot, payload) || buildDirectTradeRequest(snapshot, text);
        moduleKind = 'trade';
      } else if (/craft|profession|job|副职业|工坊|锻造|制造|设计|修理|维修/.test(kind)) {
        request = buildDirectProfessionRequest(snapshot, payload) || buildDirectProfessionRequest(snapshot, text);
        moduleKind = 'profession';
      } else {
        request = buildDirectBattleIntent(snapshot, text);
        moduleKind = request ? 'battle' : '';
        if (!request) {
          request = buildDirectTradeRequest(snapshot, text);
          moduleKind = request ? 'trade' : '';
        }
        if (!request) {
          request = buildDirectProfessionRequest(snapshot, text);
          moduleKind = request ? 'profession' : '';
        }
      }

      if (!request || !moduleKind) return { handled: false, reason: 'no_module_intent' };
      if (forceAutoExecute && (moduleKind === 'trade' || moduleKind === 'profession')) {
        request.自动执行 = true;
        request.状态 = 'ready';
      }
      if (dryRun) return { handled: true, dryRun: true, kind: moduleKind, request };

      if (moduleKind === 'battle') {
        let result = await openMapBattleModule(snapshot, request);
        if (!result?.ok && result?.reason === 'combat_context_unresolved') {
          await refreshLiveSnapshot({ force: true });
          result = await openMapBattleModule(liveSnapshot || lastRenderableSnapshot || snapshot, request);
        }
        await refreshLiveSnapshot({ force: true });
        return { handled: !!result?.ok, kind: moduleKind, request, result };
      }

      if (moduleKind === 'trade') {
        let inlineResult = null;
        const privateTradeNpc = toText(request && request.对象, '');
        if (privateTradeNpc && !resolveSnapshotCharKey(snapshot, privateTradeNpc)) {
          return {
            handled: false,
            kind: moduleKind,
            request,
            reason: 'trade_target_unresolved'
          };
        }
        if (wantsInline && request.自动执行 === true) {
          inlineResult = await buildInlineTradeAction(snapshot, request);
          if (inlineResult && inlineResult.ok && inlineResult.inlineAction) {
            return {
              handled: true,
              kind: moduleKind,
              request,
              dispatchMode: 'inline',
              playerInput: inlineResult.inlineAction.playerInput,
              systemPrompt: inlineResult.inlineAction.systemPrompt,
              requestKind: inlineResult.inlineAction.requestKind,
              inlineAction: inlineResult.inlineAction,
              result: inlineResult
            };
          }
          return {
            handled: false,
            kind: moduleKind,
            request,
            dispatchMode: 'inline',
            reason: inlineResult && inlineResult.reason ? inlineResult.reason : 'trade_inline_action_unavailable',
            result: inlineResult || null
          };
        }
        await applyJsonPatchOpsByEditor([
          { op: 'replace', path: '/world/交易请求', value: request },
          { op: 'replace', path: '/sys/rsn', value: `[交易模块] ${request.动作} ${request.物品} 的请求已由前端接管。` }
        ]);
        await refreshLiveSnapshot({ force: true });
        mapDispatchContext = buildTradeDispatchFromRequest(snapshot, request);
        openModal('交易网络', { preserveMapDispatchContext: true });
        return {
          handled: true,
          kind: moduleKind,
          request,
          dispatchMode: wantsInline ? 'inline_fallback_ui' : 'ui',
          result: inlineResult || { ok: true, uiOpened: true }
        };
      }

      if (wantsInline && request.自动执行 === true) {
        const inlineResult = await buildInlineProfessionAction(snapshot, request);
        if (inlineResult && inlineResult.ok && inlineResult.inlineAction) {
          return {
            handled: true,
            kind: moduleKind,
            request,
            dispatchMode: 'inline',
            playerInput: inlineResult.inlineAction.playerInput,
            systemPrompt: inlineResult.inlineAction.systemPrompt,
            requestKind: inlineResult.inlineAction.requestKind,
            inlineAction: inlineResult.inlineAction,
            result: inlineResult
          };
        }
        return {
          handled: false,
          kind: moduleKind,
          request,
          dispatchMode: 'inline',
          reason: inlineResult && inlineResult.reason ? inlineResult.reason : 'profession_inline_action_unavailable',
          result: inlineResult || null
        };
      }
      const result = openProfessionModuleFromRequest(snapshot, request);
      return { handled: true, kind: moduleKind, request, dispatchMode: 'ui', result };
    }

    function installDirectModuleIntentGuard() {
      window.__MVU_ROUTE_MODULE_INTENT__ = (input, options = {}) => routeModuleIntentPayload(input, options);
      window.__MVU_TEST_DIRECT_MODULE_INTENT__ = text => ({
        battle: buildDirectBattleIntent(liveSnapshot || lastRenderableSnapshot, text),
        trade: buildDirectTradeRequest(liveSnapshot || lastRenderableSnapshot, text),
        profession: buildDirectProfessionRequest(liveSnapshot || lastRenderableSnapshot, text)
      });
      if (!window.__MVU_MODULE_INTENT_ROUTER_EVENT_BOUND__) {
        window.addEventListener('mvu-module-intent', event => {
          const detail = event && event.detail && typeof event.detail === 'object' ? event.detail : {};
          detail.result = routeModuleIntentPayload(detail.payload || detail.text || detail.plan || detail, detail.options || {});
        });
        window.addEventListener('mvu-module-plan-ready', event => {
          const detail = event && event.detail && typeof event.detail === 'object' ? event.detail : {};
          detail.result = routeModuleIntentPayload(detail.payload || detail.text || detail.plan || detail, detail.options || {});
        });
        window.__MVU_MODULE_INTENT_ROUTER_EVENT_BOUND__ = true;
      }
    }

    async function handleMapActionDispatch(event) {
      const detail = event && event.detail ? event.detail : {};
      const action = toText(detail.action, '');
      const services = normalizeMapDispatchServices(detail);
      if (!action && !services.length) return;
      if (!isSnapshotPlayerControlled(liveSnapshot)) {
        console.warn('[DragonUI] 旁观视角不可操作。', detail);
        return;
      }

      if (action === 'craft' || services.includes('craft')) {
        mapDispatchContext = { ...detail, action, services };
        openModal('武装工坊详细页', { preserveMapDispatchContext: true });
        return;
      }

      if (action === 'ascension' || action === 'tower') {
        console.warn('[DragonUI] 当前版本已移除前端试炼发起入口。', detail);
        return;
      }

      if (['talk', 'brief', 'intel'].includes(action)) {
        const interactInit = buildMapInteractDispatchRequest(liveSnapshot, detail);
        mapDispatchContext = { ...detail, action, services };
        if (interactInit) {
          dispatchUiAiRequest(interactInit.playerInput, interactInit.systemPrompt, { requestKind: interactInit.requestKind });
          return;
        }
        const arenaName = toText(detail.currentLoc, toText(detail.target, toText(liveSnapshot && liveSnapshot.currentLoc, '未知地点')));
        const npcTargets = Array.isArray(detail.npcTargets) ? detail.npcTargets.map(item => toText(item, '')).filter(Boolean) : [];
        const targetLabel = npcTargets.length ? `在场人物（${npcTargets.join('、')}）` : '在场人员';
        const playerInputMap = {
          talk: `我想在【${arenaName}】与${targetLabel}交谈。`,
          brief: `我想在【${arenaName}】向${targetLabel}汇报情况并请示安排。`,
          intel: `我想在【${arenaName}】向${targetLabel}请教情报。`
        };
        const actionLabel = action === 'brief' ? '汇报' : (action === 'intel' ? '请教' : '对话');
        const systemPrompt = `以下内容属于前端已经发起的地图${actionLabel}请求。当前没有锁定唯一 NPC 目标，不要报错，也不要要求玩家重新点击；请结合【${arenaName}】的场景功能与在场人物，自然选择最合适的回应对象承接本次互动。${npcTargets.length ? ` 当前可候选人物：${npcTargets.join('、')}。` : ' 当前未识别到明确人物名单，请按地点与事件功能自然承接。'}`;
        dispatchUiAiRequest(playerInputMap[action] || `我想在【${arenaName}】与在场人物互动。`, systemPrompt, { requestKind: 'map_interaction' });
        return;
      }

      if (action === 'battle' || services.includes('battle')) {
        mapDispatchContext = { ...detail, action, services };
        let battleOpenResult = null;
        try {
          battleOpenResult = await openMapBattleModule(liveSnapshot, detail);
        } catch (error) {
          console.warn('[DragonUI] 战斗模块开启失败。', error);
        }
        if (battleOpenResult && battleOpenResult.ok) {
          return;
        }
        showUiToast(`战斗模块开启失败：${battleOpenResult && battleOpenResult.reason ? battleOpenResult.reason : 'combat_context_unresolved'}`, 'error', 4200);
        return;
      }

      if (['trade', 'bid', 'shop', 'auction', 'black_market'].includes(action) || services.some(service => ['shop', 'auction', 'black_market'].includes(service))) {
        mapDispatchContext = { ...detail, action, services };
        openModal('交易网络', { preserveMapDispatchContext: true });
      }
    }

    window.addEventListener('map-action-dispatch', handleMapActionDispatch);

    async function handleMapAiRequest(event) {
      const detail = event && event.detail && typeof event.detail === 'object' ? event.detail : {};
      const playerInput = toText(detail.playerInput || detail.input || '', '').trim();
      const systemPrompt = toText(detail.systemPrompt || detail.prompt || '', '').trim();
      const meta = detail.meta && typeof detail.meta === 'object' ? detail.meta : {};
      if (!playerInput) return;
      detail.handled = true;
      detail.result = await dispatchUiAiRequest(playerInput, systemPrompt, {
        requestKind: toText(meta.requestKind, 'map_ai_request')
      });
    }

    window.addEventListener('map-ai-request', handleMapAiRequest);

    async function handleBattleMvuUpdateRequest(event) {
      const detail = event && event.detail && typeof event.detail === 'object' ? event.detail : {};
      const patchOps = Array.isArray(detail.patchOps) ? detail.patchOps : [];
      if (!patchOps.length) return;
      try {
        await applyJsonPatchOpsByEditor(patchOps);
        detail.delivery = { ok: true, channel: 'mvu_editor_patch', patchCount: patchOps.length };
        await refreshLiveSnapshot({ force: true });
      } catch (error) {
        detail.delivery = { ok: false, channel: 'mvu_editor_patch', error: String(error && error.message || error) };
        console.warn('[DragonUI] 战斗模块变量写入失败', error);
      }
    }

    function handleBattleUiCloseRequest(event) {
      const detail = event && event.detail && typeof event.detail === 'object' ? event.detail : {};
      detail.handled = true;
      if (isCombatActiveForBattleInline(liveSnapshot || lastRenderableSnapshot)) {
        battleInlineDismissed = true;
        scheduleBattleReturnEntrySync(liveSnapshot || lastRenderableSnapshot, true);
      }
      if (activeBattleUI && typeof activeBattleUI.destroy === 'function') activeBattleUI.destroy();
      activeBattleUI = null;
      battleInlineMountToken++;
      pendingBattleInlineMount = null;
      const shellBridge = getMobileShellBridge();
      if (shellBridge && typeof shellBridge.onPreviewClosed === 'function') {
        shellBridge.onPreviewClosed();
      } else if (currentUnifiedPreviewKey === BATTLE_INLINE_PREVIEW_KEY && typeof window.__MVU_CLOSE_UNIFIED_PREVIEW__ === 'function') {
        window.__MVU_CLOSE_UNIFIED_PREVIEW__({ force: true });
      }
    }

    window.addEventListener('battle-ui-mvu-update-request', handleBattleMvuUpdateRequest);
    window.addEventListener('battle-ui-close-request', handleBattleUiCloseRequest);

    var currentModalDisplayMode = 'auto';
    var lastRenderedModalPreviewKey = '';
    function computeUnifiedFloatBottomReserve() {
      const viewportHeight = Math.max(0, Number(window.innerHeight) || 0);
      const viewportWidth = Math.max(0, Number(window.innerWidth) || 0);
      if (!viewportHeight || !viewportWidth) return 128;
      let reserve = 128;
      const seen = new Set();
      const minGenericWidth = Math.min(Math.max(140, viewportWidth * 0.18), Math.max(160, viewportWidth - 32));

      const measureCandidate = (el, options = {}) => {
        if (!(el instanceof Element)) return;
        if (seen.has(el)) return;
        seen.add(el);
        if (!el.isConnected) return;
        if (el.id === 'detailModal' || el.closest('#detailModal')) return;
        const style = window.getComputedStyle(el);
        if (!style || style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;
        if (style.pointerEvents === 'none') return;
        const rect = el.getBoundingClientRect();
        if (!rect || rect.height <= 0 || rect.width <= 0) return;
        const visible = Math.max(0, Math.min(viewportHeight, rect.bottom) - Math.max(0, rect.top));
        if (visible <= 0) return;
        if (rect.bottom < viewportHeight - 260) return;
        if ((options.minHeight || 0) > 0 && rect.height < options.minHeight) return;
        if (!options.allowAnyWidth && rect.width < minGenericWidth) return;
        const nextReserve = Math.max(0, viewportHeight - Math.max(0, rect.top)) + 16;
        reserve = Math.max(reserve, nextReserve);
      };

      const primaryCandidates = [
        document.getElementById('mvu-unified-mount'),
        document.getElementById('acu-nav-bar'),
        document.querySelector('.acu-wrapper')
      ];
      for (const el of primaryCandidates) {
        measureCandidate(el, { allowAnyWidth: true, minHeight: 20 });
      }

      const scanRoot = document.body || document.documentElement;
      if (scanRoot) {
        const nodes = scanRoot.querySelectorAll('*');
        for (const el of nodes) {
          const style = window.getComputedStyle(el);
          if (!style) continue;
          const position = style.position;
          if (position !== 'fixed' && position !== 'sticky') continue;
          measureCandidate(el, { allowAnyWidth: false, minHeight: 24 });
        }
      }

      return Math.max(96, Math.min(reserve, Math.max(220, viewportHeight - 84)));
    }
    function applyUnifiedFloatMetrics(detailModalEl, unifiedMode) {
      if (!detailModalEl) return;
      if (!unifiedMode) {
        detailModalEl.style.removeProperty('--mvu-float-bottom-reserve');
        detailModalEl.style.removeProperty('--mvu-float-max-height');
        detailModalEl.style.removeProperty('--mvu-float-min-height');
        return;
      }
      const viewportHeight = Math.max(0, Number(window.innerHeight) || 0);
      const reserve = computeUnifiedFloatBottomReserve();
      const maxHeight = Math.max(260, viewportHeight - reserve - 54);
      const minHeight = Math.max(220, Math.min(360, viewportHeight - reserve - 122));
      detailModalEl.style.setProperty('--mvu-float-bottom-reserve', `${reserve}px`);
      detailModalEl.style.setProperty('--mvu-float-max-height', `${maxHeight}px`);
      detailModalEl.style.setProperty('--mvu-float-min-height', `${minHeight}px`);
    }

    function isUnifiedLayoutActive() {
      const body = document.body;
      if (!body) return false;
      if (body.classList.contains('mvu-layout-unified')) return true;
      try {
        return !!(window.__MVU_LAYOUT_STATE__ && window.__MVU_LAYOUT_STATE__.effectiveMode === 'unified');
      } catch (err) {
        return false;
      }
    }

    function shouldUseUnifiedFloatMode(options = {}) {
      const explicitMode = String(options.displayMode || '').trim();
      if (explicitMode === 'floating' || explicitMode === 'unified') return true;
      if (explicitMode === 'split') return false;
      if (isUnifiedLayoutActive()) return true;
      // Only follow the currently effective layout, not persisted preference.
      // Otherwise split fallback can accidentally render unified float modal.
      try {
        const layoutState = window.__MVU_LAYOUT_STATE__;
        if (layoutState && layoutState.effectiveMode === 'unified') return true;
      } catch (err) {}
      const triggerEl = options.triggerEl instanceof Element ? options.triggerEl : null;
      if (triggerEl && triggerEl.closest('#mvu-unified-mount')) {
        return true;
      }
      return false;
    }

    function applyModalDisplayMode(refs = getModalRefs(), options = {}) {
      const currentDetailModal = refs && refs.detailModal ? refs.detailModal : null;
      const currentModalPanel = refs && refs.modalPanel ? refs.modalPanel : null;
      if (!currentDetailModal || !currentModalPanel) return;
      const unifiedMode = shouldUseUnifiedFloatMode(options);
      const shellMode = syncDetailModalHost(refs, { ...options, unifiedMode });
      currentDetailModal.classList.remove('drawer-left');
      currentModalPanel.classList.remove('drawer-left');
      currentDetailModal.classList.toggle('mvu-modal-display-unified', unifiedMode && !shellMode);
      currentDetailModal.classList.toggle('mvu-modal-display-split', !unifiedMode);
      currentModalPanel.classList.toggle('mvu-modal-display-unified', unifiedMode && !shellMode);
      currentModalPanel.classList.toggle('mvu-modal-display-split', !unifiedMode);
      currentDetailModal.classList.toggle('mvu-modal-display-shell', shellMode);
      currentModalPanel.classList.toggle('mvu-modal-display-shell', shellMode);
      currentDetailModal.dataset.modalDisplayMode = shellMode ? 'shell' : (unifiedMode ? 'unified' : 'split');
      currentModalPanel.dataset.modalDisplayMode = shellMode ? 'shell' : (unifiedMode ? 'unified' : 'split');
      applyUnifiedFloatMetrics(currentDetailModal, unifiedMode && !shellMode);
    }

    function openModal(previewKey, options = {}) {
      if (shouldBlockInlineEditRerender(options)) {
        pendingLiveRefresh = true;
        return;
      }
      const refs = getModalRefs();
      if (!options.preserveMapDispatchContext) {
        mapDispatchContext = null;
      }

      const targetKey = previewKey || '';
      if (targetKey === PRIVATE_ARCHIVE_PREVIEW_KEY && !canOpenPrivateArchive(liveSnapshot)) return;
      if (targetKey) {
        if (!modalStack.length || modalStack[modalStack.length - 1] !== targetKey) {
          modalStack.push(targetKey);
        }
      }
      currentModalPreviewKey = modalStack[modalStack.length - 1] || '';
      currentModalDisplayMode = shouldUseUnifiedFloatMode(options) ? 'floating' : 'split';
      const shellMode = currentModalPreviewKey && isMobileShellModalActive({ ...options, unifiedMode: currentModalDisplayMode !== 'split' });
      if (shellMode) {
        notifyShellPreviewChange(currentModalPreviewKey);
      }
      
      if (currentModalPreviewKey) {
        renderModalContent(currentModalPreviewKey, refs, { ...options, displayMode: currentModalDisplayMode });
      }

      if (shellMode) {
        hideDetailModalElement(refs);
        return;
      }
      if (!refs.detailModal) return;
      applyModalDisplayMode(refs, options);
      refs.detailModal.classList.add('show');
      refs.detailModal.setAttribute('aria-hidden', 'false');
    }
    window.__MVU_OPEN_SHELL_PREVIEW__ = (previewKey, options = {}) => {
      openModal(previewKey, { ...options, displayMode: 'floating' });
    };

    function toggleModal(previewKey, options = {}) {
      const targetKey = previewKey || '';
      if (!targetKey) return;
      const refs = getModalRefs();
      if (((refs.detailModal && refs.detailModal.classList.contains('show')) || isShellInlinePreviewActive()) && currentModalPreviewKey === targetKey) {
        closeModal();
        return;
      }
      openModal(targetKey, options);
    }

    function setArchiveRedesignState(refs = getModalRefs(), enabled = false) {
      const currentDetailModal = refs && refs.detailModal ? refs.detailModal : null;
      const currentModalPanel = refs && refs.modalPanel ? refs.modalPanel : null;
      const currentModalBody = refs && refs.modalBody ? refs.modalBody : null;
      if (currentDetailModal) currentDetailModal.classList.toggle('archive-redesign-mode', !!enabled);
      if (currentModalPanel) currentModalPanel.classList.toggle('archive-redesign-panel', !!enabled);
      if (currentModalBody) currentModalBody.classList.toggle('archive-redesign-body', !!enabled);
      syncArchiveRedesignPanelDecor(refs, enabled);
    }

    function syncArchiveRedesignPanelDecor(refs = getModalRefs(), enabled = false) {
      const currentModalPanel = refs && refs.modalPanel ? refs.modalPanel : null;
      if (!currentModalPanel) return;
      const existingDecor = currentModalPanel.querySelector('.archive-redesign-decor');
      if (!enabled) {
        if (existingDecor) existingDecor.remove();
        return;
      }
      if (existingDecor) return;
      currentModalPanel.insertAdjacentHTML('afterbegin', `
        <div class="archive-redesign-decor" aria-hidden="true">
          <div class="ring-group top-left-rings">
            <div class="astro-circle ring-cyan-1"></div>
            <div class="astro-circle ring-cyan-2"></div>
            <div class="astro-circle ring-cyan-3"></div>
          </div>
          <div class="ring-group bottom-right-rings">
            <div class="astro-circle ring-gold-1"></div>
            <div class="astro-circle ring-gold-2"></div>
            <div class="astro-circle ring-gold-3"></div>
          </div>
        </div>
      `);
    }

    function isUnifiedModalDisplayRequested(options = {}) {
      if (options && (options.displayMode === 'floating' || options.displayMode === 'unified')) return true;
      if (currentModalDisplayMode === 'floating') return true;
      try {
        const layoutState = window.__MVU_LAYOUT_STATE__;
        if (layoutState && layoutState.effectiveMode === 'unified') return true;
      } catch (err) {}
      return false;
    }

    /*
    function syncModalTitleLongPress(previewKey, unifiedMode) {
      if (!modalTitle) return;
      modalTitle.classList.remove('nsfw-trigger-title');
      modalTitle.removeAttribute('data-longpress');
      modalTitle.removeAttribute('data-longpress-delay');
      if (unifiedMode && previewKey === '生命图谱详细页' && canOpenPrivateArchive(liveSnapshot)) {
        modalTitle.classList.add('nsfw-trigger-title');
        modalTitle.setAttribute('data-longpress', PRIVATE_ARCHIVE_PREVIEW_KEY);
        modalTitle.setAttribute('data-longpress-delay', '600');
      }
    }

    */
    function syncModalTitleLongPress(previewKey, unifiedMode) {
      if (!modalTitle) return;
      modalTitle.classList.remove('nsfw-trigger-title');
      modalTitle.removeAttribute('data-longpress');
      modalTitle.removeAttribute('data-longpress-delay');
      if (unifiedMode && previewKey === '生命图谱详细页' && canOpenPrivateArchive(liveSnapshot)) {
        modalTitle.classList.add('nsfw-trigger-title');
        modalTitle.setAttribute('data-longpress', PRIVATE_ARCHIVE_PREVIEW_KEY);
        modalTitle.setAttribute('data-longpress-delay', '600');
      }
    }

    function wrapArchiveRedesignBody(html, options = {}) {
      if (options.shellMode) {
        return `<div class="mvu-shell-detail-root mvu-unified-modal-root" data-unified-preview="${escapeHtmlAttr(toText(options.previewKey, ''))}">
          <div class="mvu-shell-detail-scroll">
            ${html || ''}
          </div>
        </div>`;
      }
      if (options.unifiedMode) {
        return `<div class="archive-redesign-root mvu-unified-modal-root" data-unified-preview="${escapeHtmlAttr(toText(options.previewKey, ''))}">
          <div class="mvu-unified-sheet">
            <div class="mvu-unified-sheet-scroll">
              ${html || ''}
            </div>
          </div>
        </div>`;
      }
      return `<div class="archive-redesign-root">
        ${html || ''}
      </div>`;
    }

    function getShellInlineHost() {
      const bridge = getMobileShellBridge();
      if (!bridge || typeof bridge.getModalHost !== 'function') return null;
      const host = bridge.getModalHost();
      return host && host.isConnected ? host : null;
    }

    function isShellInlinePreviewActive() {
      const bridge = getMobileShellBridge();
      if (!bridge || typeof bridge.isOpen !== 'function' || !bridge.isOpen()) return false;
      if (typeof bridge.isDetailActive === 'function' && !bridge.isDetailActive()) return false;
      return !!getShellInlineHost();
    }

    function clearShellInlinePreview() {
      const host = getShellInlineHost();
      lastRenderedShellPreviewKey = '';
      if (!host) return;
      host.innerHTML = '';
      delete host.dataset.shellPreview;
    }

    function buildShellPrivateArchiveView(snapshot) {
      const nsfw = getActiveNsfwData(snapshot);
      const activeName = toText(snapshot && snapshot.activeName, '当前角色');
      const bodyPartEntries = safeEntries(deepGet(nsfw, '身体部位', {}));
      const measurements = deepGet(nsfw, '身材数据', {});
      const intimateWear = deepGet(nsfw, '贴身衣物', {});
      const experienceEntries = safeEntries(deepGet(nsfw, '经历次数', {}))
        .filter(([, value]) => toNumber(value, 0) > 0)
        .slice(0, 8);
      const fetishes = Array.isArray(nsfw.癖好) ? nsfw.癖好.map(item => toText(item, '')).filter(Boolean).slice(0, 8) : [];
      const fantasies = Array.isArray(nsfw.幻想) ? nsfw.幻想.map(item => toText(item, '')).filter(Boolean).slice(0, 8) : [];
      const clampMeter = value => Math.max(0, Math.min(100, toNumber(value, 0)));
      const renderMeter = (label, value, tone = '') => {
        const percent = clampMeter(value);
        return `
          <div class="mvu-shell-private-meter${tone ? ` is-${htmlEscape(tone)}` : ''}">
            <div class="mvu-shell-private-meter-top">
              <span>${htmlEscape(label)}</span>
              <b>${htmlEscape(String(percent))}</b>
            </div>
            <div class="mvu-shell-private-track"><i style="width:${percent}%;"></i></div>
          </div>
        `;
      };
      const renderRow = (label, value) => `
        <div class="mvu-shell-private-row">
          <span>${htmlEscape(label)}</span>
          <b>${htmlEscape(toText(value, '--'))}</b>
        </div>
      `;
      const renderTags = items => items.length
        ? items.map(item => `<span class="mvu-shell-private-tag">${htmlEscape(shortenText(item, 14))}</span>`).join('')
        : '<span class="mvu-shell-private-empty">暂无记录</span>';
      const bodyPartCards = bodyPartEntries.length
        ? bodyPartEntries.slice(0, 6).map(([partName, partData]) => `
          <div class="mvu-shell-private-part">
            <div class="mvu-shell-private-part-head">
              <b>${htmlEscape(partName)}</b>
              <span>开发 ${htmlEscape(String(toNumber(deepGet(partData, '开发度', 0), 0)))}</span>
            </div>
            <div class="mvu-shell-private-part-text">${htmlEscape(shortenText(toText(deepGet(partData, '状态描述', deepGet(partData, '外观特征', '正常')), '正常'), 34))}</div>
          </div>
        `).join('')
        : '<div class="mvu-shell-private-empty">暂无记录</div>';
      const experienceTags = experienceEntries.length
        ? experienceEntries.map(([label, value]) => `<span class="mvu-shell-private-tag">${htmlEscape(label)} ${htmlEscape(String(toNumber(value, 0)))}</span>`).join('')
        : '<span class="mvu-shell-private-empty">暂无记录</span>';

      return {
        title: '私密档案',
        body: `
          <div class="mvu-shell-private-root" data-private-archive-light="1">
            <section class="mvu-shell-private-card mvu-shell-private-card--hero">
              <div class="mvu-shell-private-hero">
                <span>${htmlEscape(activeName)}</span>
                <strong>${htmlEscape(toText(deepGet(measurements, '身材描述', ''), toText(deepGet(measurements, '罩杯', '私密概览'), '私密概览')))}</strong>
              </div>
              <div class="mvu-shell-private-meters">
                ${renderMeter('发情', nsfw.发情度, 'live')}
                ${renderMeter('开发', nsfw.开发度, 'warm')}
                ${renderMeter('敏感', nsfw.敏感度, '')}
              </div>
            </section>

            <section class="mvu-shell-private-card">
              <div class="mvu-shell-private-section-title">身体</div>
              <div class="mvu-shell-private-row-grid">
                ${renderRow('罩杯', deepGet(measurements, '罩杯', '未知'))}
                ${renderRow('三围', `${toText(deepGet(measurements, '胸围'), '0')} / ${toText(deepGet(measurements, '腰围'), '0')} / ${toText(deepGet(measurements, '臀围'), '0')}`)}
                ${renderRow('内衣', deepGet(intimateWear, '内衣', '未知'))}
                ${renderRow('内裤', deepGet(intimateWear, '内裤', '未知'))}
              </div>
            </section>

            <section class="mvu-shell-private-card">
              <div class="mvu-shell-private-section-title">节律</div>
              <div class="mvu-shell-private-row-grid">
                ${renderRow('阶段', nsfw._生理阶段 || '安全期')}
                ${renderRow('初潮', nsfw._已来初潮 ? '已初潮' : '未初潮')}
                ${renderRow('受孕节点', String(toNumber(nsfw.受孕tick, -1)))}
                ${renderRow('怀孕天数', String(toNumber(nsfw._怀孕天数, 0)))}
              </div>
            </section>

            <section class="mvu-shell-private-card">
              <div class="mvu-shell-private-section-title">身体部位</div>
              <div class="mvu-shell-private-part-grid">
                ${bodyPartCards}
              </div>
            </section>

            <section class="mvu-shell-private-card">
              <div class="mvu-shell-private-section-title">偏好</div>
              <div class="mvu-shell-private-tag-row">${renderTags(fetishes)}</div>
              <div class="mvu-shell-private-tag-row">${renderTags(fantasies)}</div>
            </section>

            <section class="mvu-shell-private-card">
              <div class="mvu-shell-private-section-title">履历</div>
              <div class="mvu-shell-private-tag-row">${experienceTags}</div>
            </section>
          </div>
        `
      };
    }

    function stripShellHeavyEntryNodes(host) {
      if (!host || typeof host.querySelectorAll !== 'function') return;
      host.querySelectorAll('[data-preview]').forEach(node => {
        const previewKey = toText(node.getAttribute('data-preview'), '');
        if (!previewKey.startsWith(SKILL_DESIGNER_PREVIEW_PREFIX)) return;
        const removable = node.closest('button, a, .role-switch-tile, .archive-tile, .dossier-list-row, .tag-chip, .relation-action-btn') || node;
        removable.remove();
      });
      host.querySelectorAll('.skill-designer-layout, [data-skill-designer-form]').forEach(node => {
        const removable = node.closest('.archive-card, .dossier-card') || node;
        removable.remove();
      });
    }

    function hideDetailModalElement(refs = getModalRefs()) {
      const currentDetailModal = refs && refs.detailModal ? refs.detailModal : null;
      const currentModalPanel = refs && refs.modalPanel ? refs.modalPanel : null;
      const currentModalBody = refs && refs.modalBody ? refs.modalBody : null;
      if (currentDetailModal) {
        currentDetailModal.classList.remove(
          'show',
          'drawer-left',
          'relation-preview-mode',
          'archive-redesign-mode',
          'mvu-modal-display-unified',
          'mvu-modal-display-split',
          'mvu-modal-display-shell'
        );
        currentDetailModal.setAttribute('aria-hidden', 'true');
        delete currentDetailModal.dataset.modalDisplayMode;
      }
      if (currentModalPanel) {
        currentModalPanel.classList.remove(
          'drawer-left',
          'vault-mode',
          'relation-preview-mode',
          'archive-redesign-panel',
          'mvu-modal-display-unified',
          'mvu-modal-display-split',
          'mvu-modal-display-shell'
        );
        delete currentModalPanel.dataset.modalDisplayMode;
      }
      if (currentModalBody) {
        currentModalBody.classList.remove('vault-body', 'archive-redesign-body', 'mvu-unified-sheet-body');
      }
      if (currentDetailModal) {
        syncDetailModalHost(refs, { unifiedMode: false });
      }
    }

    function getUnifiedInlineHost(options = {}) {
      const explicitHost = options && options.host instanceof Element ? options.host : null;
      if (explicitHost && explicitHost.isConnected) return explicitHost;
      try {
        if (typeof window.__MVU_GET_UNIFIED_DETAIL_HOST__ === 'function') {
          const bridgeHost = window.__MVU_GET_UNIFIED_DETAIL_HOST__();
          if (bridgeHost instanceof Element && bridgeHost.isConnected) return bridgeHost;
        }
      } catch (err) {}
      const host = document.querySelector('#mvu-unified-mount [data-unified-detail-host]');
      return host instanceof Element && host.isConnected ? host : null;
    }

    function isUnifiedInlinePreviewActive() {
      const host = getUnifiedInlineHost();
      return !!(host && toText(host.dataset.unifiedPreview, '') && document.body && document.body.classList.contains('mvu-layout-unified'));
    }

    function syncUnifiedTitleLongPress(previewKey) {
      const title = document.querySelector('#mvu-unified-mount .mvu-unified-detail-title');
      if (!title) return;
      title.classList.remove('nsfw-trigger-title');
      title.removeAttribute('data-longpress');
      title.removeAttribute('data-longpress-delay');
      if (String(previewKey || '').includes('生命图谱') && canOpenPrivateArchive(liveSnapshot)) {
        title.classList.add('nsfw-trigger-title');
        title.setAttribute('data-longpress', PRIVATE_ARCHIVE_PREVIEW_KEY);
        title.setAttribute('data-longpress-delay', '600');
      }
    }

    function clearUnifiedInlinePreview() {
      const host = getUnifiedInlineHost();
      if (currentUnifiedPreviewKey === BATTLE_INLINE_PREVIEW_KEY && activeBattleUI && typeof activeBattleUI.destroy === 'function') {
        if (isCombatActiveForBattleInline(liveSnapshot || lastRenderableSnapshot)) {
          battleInlineDismissed = true;
          scheduleBattleReturnEntrySync(liveSnapshot || lastRenderableSnapshot, true);
        }
        activeBattleUI.destroy();
        activeBattleUI = null;
      }
      if (currentUnifiedPreviewKey && activeSubUI && typeof activeSubUI.destroy === 'function') {
        activeSubUI.destroy();
        activeSubUI = null;
      }
      currentUnifiedPreviewKey = '';
      lastRenderedUnifiedPreviewKey = '';
      syncUnifiedTitleLongPress('');
      if (!host) return;
      host.innerHTML = '';
      delete host.dataset.unifiedPreview;
    }

    function wrapUnifiedInlineBody(html, options = {}) {
      return `<div class="mvu-unified-detail-root archive-redesign-root" data-unified-preview="${escapeHtmlAttr(toText(options.previewKey, ''))}">
        <div class="mvu-unified-detail-scroll">
          ${html || ''}
        </div>
      </div>`;
    }

    function isLiveRequiredPreviewKey(previewKey) {
      const key = toText(previewKey, '');
      const liveRequiredKeys = new Set([
        '生命图谱详细页',
        '私密档案详细页',
        '社会档案详细页',
        '所属势力详细页',
        '人物关系详细页',
        '情报库详细页',
        '武装工坊详细页',
        '武魂融合技详细页',
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
      return liveRequiredKeys.has(key) || String(key || '').startsWith('地图节点：');
    }

    function bindUnifiedDetailDelegation(host) {
      if (!host || host.__mvuUnifiedDetailDelegationBound) return;
      host.addEventListener('click', event => {
        handleDetailSurfaceClick(event, host, { surface: 'unified' });
      });
      host.__mvuUnifiedDetailDelegationBound = true;
    }

    function renderUnifiedInlinePreview(previewKey, options = {}) {
      const host = getUnifiedInlineHost(options);
      const targetKey = toText(previewKey, '').trim();
      if (!host || !targetKey) return false;
      if (targetKey === PRIVATE_ARCHIVE_PREVIEW_KEY && !canOpenPrivateArchive(liveSnapshot)) return false;
      if (shouldBlockInlineEditRerender(options)) {
        pendingLiveRefresh = true;
        return true;
      }
      if (activeSubUI && typeof activeSubUI.destroy === 'function') {
        activeSubUI.destroy();
        activeSubUI = null;
      }

      clearShellInlinePreview();
      hideDetailModalElement(getModalRefs());
      syncModalTitleLongPress('', false);

      const shouldResetScroll = lastRenderedUnifiedPreviewKey !== targetKey || toText(host.dataset.unifiedPreview, '') !== targetKey;
      currentUnifiedPreviewKey = targetKey;
      lastRenderedUnifiedPreviewKey = targetKey;
      host.dataset.unifiedPreview = targetKey;
      bindUnifiedDetailDelegation(host);

      const setHostMarkup = (html, onMount = null) => {
        host.innerHTML = wrapUnifiedInlineBody(html, { previewKey: targetKey });
        if (shouldResetScroll) host.scrollTop = 0;
        syncUnifiedTitleLongPress(targetKey);
        if (typeof onMount === 'function') {
          activeSubUI = onMount(host);
        }
        scheduleUnifiedMapCanvasClamp(host);
      };

      if (targetKey === BATTLE_INLINE_PREVIEW_KEY) {
        setHostMarkup(buildBattleInlineHostMarkup());
        return true;
      }

      const liveArchive = buildLiveArchiveModal(targetKey);
      const skeletonArchive = !liveArchive && !liveSnapshot ? buildArchiveSkeletonModal(targetKey) : null;
      if (liveArchive) {
        setHostMarkup(liveArchive.body, liveArchive.onMount);
        return true;
      }
      if (!liveSnapshot && isLiveRequiredPreviewKey(targetKey)) {
        setHostMarkup(skeletonArchive ? skeletonArchive.body : '');
        return true;
      }

      const archiveBuilder = archiveModalBuilders[targetKey];
      if (archiveBuilder) {
        const view = archiveBuilder();
        setHostMarkup(view.body);
        return true;
      }

      const config = previewMap[targetKey] || buildDynamicPreview(targetKey || '详细信息');
      setHostMarkup(renderGenericModalBody(config));
      return true;
    }
    window.__MVU_RENDER_UNIFIED_PREVIEW__ = renderUnifiedInlinePreview;
    window.__MVU_CLEAR_UNIFIED_PREVIEW__ = clearUnifiedInlinePreview;

    function renderShellInlinePreview(previewKey, options = {}) {
      const host = getShellInlineHost();
      if (!host) return false;
      const scrollTarget = host.closest('.mvu-mobile-shell-scroll') || host;
      const shouldResetScroll = lastRenderedShellPreviewKey !== previewKey || toText(host.dataset.shellPreview, '') !== toText(previewKey, '');
      lastRenderedShellPreviewKey = previewKey || '';
      host.dataset.shellPreview = previewKey || '';
      if (shouldBlockInlineEditRerender(options)) {
        pendingLiveRefresh = true;
        return true;
      }
      if (activeSubUI && typeof activeSubUI.destroy === 'function') {
        activeSubUI.destroy();
        activeSubUI = null;
      }

      const setHostMarkup = html => {
        host.innerHTML = wrapArchiveRedesignBody(html, { shellMode: true, previewKey });
        stripShellHeavyEntryNodes(host);
        if (shouldResetScroll) scrollTarget.scrollTop = 0;
      };

      if (previewKey === BATTLE_INLINE_PREVIEW_KEY) {
        setHostMarkup(buildBattleInlineHostMarkup());
        return true;
      }

      if (previewKey === PRIVATE_ARCHIVE_PREVIEW_KEY) {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        if (!canOpenPrivateArchive(snapshot)) return false;
        const shellPrivateArchive = buildShellPrivateArchiveView(snapshot);
        setHostMarkup(shellPrivateArchive.body);
        return true;
      }

      if (previewKey === '生命图谱详细页' || previewKey === '生命图谱详情页') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellLifeView = buildShellLifeView(snapshot || {});
        setHostMarkup(shellLifeView.body);
        return true;
      }

      if (
        previewKey === '武装工坊详细页'
        || previewKey === '武装详情：斗铠'
        || previewKey === '武装详情：机甲'
        || previewKey === '武装详情：主武器'
        || previewKey === '武装详情：附件'
        || String(previewKey || '').startsWith('斗铠部件：')
      ) {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellArmoryView = buildShellArmoryView(snapshot || {});
        setHostMarkup(shellArmoryView.body);
        return true;
      }

      if (previewKey === '第一武魂详细页' || previewKey === '第二武魂详细页') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellSpiritView = buildShellSpiritView(snapshot || {}, previewKey);
        setHostMarkup(shellSpiritView.body);
        return true;
      }

      if (previewKey === '武魂融合技详细页') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellFusionView = buildShellFusionView(snapshot || {});
        setHostMarkup(shellFusionView.body);
        return true;
      }

      if (previewKey === '血脉封印详细页') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellBloodlineView = buildShellBloodlineView(snapshot || {});
        setHostMarkup(shellBloodlineView.body);
        return true;
      }

      if (previewKey === '储物仓库详细页') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellVaultView = buildShellVaultView(snapshot || {});
        setHostMarkup(shellVaultView.body);
        return true;
      }

      if (previewKey === '社会档案详细页') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellSocialView = buildShellSocialView(snapshot || {});
        setHostMarkup(shellSocialView.body);
        return true;
      }

      if (previewKey === '当前节点详情') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellAreaView = buildShellCurrentAreaView(snapshot || {});
        setHostMarkup(shellAreaView.body);
        return true;
      }

      if (previewKey === '编年史档案') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellTimelineView = buildShellTimelineView(snapshot || {});
        setHostMarkup(shellTimelineView.body);
        return true;
      }

      if (previewKey === '势力矩阵总览') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellOrgView = buildShellOrgMatrixView(snapshot || {});
        setHostMarkup(shellOrgView.body);
        return true;
      }

      if (previewKey === '世界状态总览') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellWorldView = buildShellWorldStateView(snapshot || {});
        setHostMarkup(shellWorldView.body);
        return true;
      }

      if (previewKey === '拍卖与警报') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellAlertView = buildShellAlertView(snapshot || {});
        setHostMarkup(shellAlertView.body);
        return true;
      }

      if (previewKey === '我的阵营详情') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellFactionView = buildShellFactionView(snapshot || {});
        setHostMarkup(shellFactionView.body);
        return true;
      }

      if (previewKey === '本地据点详情') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellNodeView = buildShellNodeView(snapshot || {});
        setHostMarkup(shellNodeView.body);
        return true;
      }

      if (previewKey === '系统播报与日志') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellTerminalView = buildShellTerminalView(snapshot || {});
        setHostMarkup(shellTerminalView.body);
        return true;
      }

      if (previewKey === '试炼与情报') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellIntelView = buildShellIntelView(snapshot || {});
        setHostMarkup(shellIntelView.body);
        return true;
      }

      if (previewKey === '近期见闻') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellNewsView = buildShellNewsView(snapshot || {});
        setHostMarkup(shellNewsView.body);
        return true;
      }

      if (previewKey === '怪物图鉴') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellBestiaryView = buildShellBestiaryView(snapshot || {});
        setHostMarkup(shellBestiaryView.body);
        return true;
      }

      if (previewKey === '任务界面') {
        const snapshot = liveSnapshot || lastRenderableSnapshot;
        const shellQuestView = buildShellQuestOverviewView(snapshot || {});
        setHostMarkup(shellQuestView.body);
        return true;
      }

      const liveArchive = buildLiveArchiveModal(previewKey);
      const skeletonArchive = !liveArchive && !liveSnapshot ? buildArchiveSkeletonModal(previewKey) : null;
      if (liveArchive) {
        setHostMarkup(liveArchive.body);
        if (typeof liveArchive.onMount === 'function') {
          activeSubUI = liveArchive.onMount(host);
        }
        return true;
      }
      if (skeletonArchive) {
        setHostMarkup(skeletonArchive.body);
        return true;
      }

      const archiveBuilder = archiveModalBuilders[previewKey];
      if (archiveBuilder) {
        const view = archiveBuilder();
        setHostMarkup(view.body);
        return true;
      }

      if (String(previewKey || '').startsWith(SKILL_DESIGNER_PREVIEW_PREFIX)) {
        setHostMarkup('');
        return true;
      }

      const config = previewMap[previewKey] || buildDynamicPreview(previewKey || '璇︾粏寮圭獥');
      setHostMarkup(renderGenericModalBody(config));
      return true;
    }

    function renderModalContent(previewKey, refs = getModalRefs(), options = {}) {
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
      const shouldResetModalScroll = lastRenderedModalPreviewKey !== previewKey || !detailModal.classList.contains('show');
      const isRelationPreview = previewKey === '人物关系详细页';
      const unifiedMode = isUnifiedModalDisplayRequested(options);
      const shellMode = isMobileShellModalActive({ ...options, unifiedMode });
      if (shellMode) {
        hideDetailModalElement(refs);
        lastRenderedModalPreviewKey = '';
        renderShellInlinePreview(previewKey, options);
        return;
      }
      clearShellInlinePreview();
      lastRenderedModalPreviewKey = previewKey || '';
      detailModal.classList.toggle('relation-preview-mode', isRelationPreview);
      modalPanel.classList.toggle('relation-preview-mode', isRelationPreview);
      applyModalDisplayMode(refs, { ...options, displayMode: unifiedMode ? 'floating' : 'split' });
      syncModalTitleLongPress(previewKey, unifiedMode);
      if (shouldBlockInlineEditRerender(options)) {
        pendingLiveRefresh = true;
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
        if (unifiedMode) modalBody.classList.add('mvu-unified-sheet-body');
        if (modalLevel) modalLevel.textContent = '';
        if (modalPath) modalPath.textContent = '';
        modalTitle.textContent = liveArchive.title;
        if (unifiedMode && typeof previewKey === 'string' && previewKey.includes('生命图谱') && canOpenPrivateArchive(liveSnapshot)) {
          modalTitle.classList.add('nsfw-trigger-title');
          modalTitle.setAttribute('data-longpress', PRIVATE_ARCHIVE_PREVIEW_KEY);
          modalTitle.setAttribute('data-longpress-delay', '600');
        }
        if (modalSubtitle) modalSubtitle.textContent = '';
        if (modalSummary) modalSummary.textContent = '';
        setArchiveRedesignState(refs, !shellMode);
        modalBody.innerHTML = wrapArchiveRedesignBody(liveArchive.body, { unifiedMode, previewKey, shellMode });
        if (shouldResetModalScroll) modalBody.scrollTop = 0;
        if (typeof liveArchive.onMount === 'function') {
          activeSubUI = liveArchive.onMount(modalBody);
        }
        return;
      }
      const liveRequiredKeys = new Set([
        '生命图谱详细页',
		'私密档案详细页',
        '社会档案详细页',
        '所属势力详细页',
        '人物关系详细页',
        '情报库详细页',
        '武装工坊详细页',
        '武魂融合技详细页',
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
          if (unifiedMode) modalBody.classList.add('mvu-unified-sheet-body');
          if (modalLevel) modalLevel.textContent = '';
          if (modalPath) modalPath.textContent = '';
          modalTitle.textContent = skeletonArchive.title;
          if (modalSubtitle) modalSubtitle.textContent = '';
          if (modalSummary) modalSummary.textContent = '';
          setArchiveRedesignState(refs, !shellMode);
          modalBody.innerHTML = wrapArchiveRedesignBody(skeletonArchive.body, { unifiedMode, previewKey, shellMode });
          if (shouldResetModalScroll) modalBody.scrollTop = 0;
          return;
        }
        modalPanel.classList.add('archive-mode');
        modalPanel.classList.remove('vault-mode');
        modalBody.className = 'modal-body archive-body';
        if (unifiedMode) modalBody.classList.add('mvu-unified-sheet-body');
        if (modalLevel) modalLevel.textContent = '';
        if (modalPath) modalPath.textContent = '';
        modalTitle.textContent = previewKey || '详细信息';
        if (modalSubtitle) modalSubtitle.textContent = '';
        if (modalSummary) modalSummary.textContent = '';
        setArchiveRedesignState(refs, !shellMode);
        modalBody.innerHTML = wrapArchiveRedesignBody('', { unifiedMode, previewKey, shellMode });
        if (shouldResetModalScroll) modalBody.scrollTop = 0;
        return;
      }
      const archiveBuilder = archiveModalBuilders[previewKey];
      const isVaultModal = previewKey === '储物仓库详细页';
      if (archiveBuilder) {
        const view = archiveBuilder();
        modalPanel.classList.add('archive-mode');
        modalPanel.classList.toggle('vault-mode', isVaultModal);
        modalBody.className = isVaultModal ? 'modal-body archive-body vault-body' : 'modal-body archive-body';
        if (unifiedMode) modalBody.classList.add('mvu-unified-sheet-body');
        if (modalLevel) modalLevel.textContent = '';
        if (modalPath) modalPath.textContent = '';
        modalTitle.textContent = view.title;
        if (modalSubtitle) modalSubtitle.textContent = '';
        if (modalSummary) modalSummary.textContent = '';
        setArchiveRedesignState(refs, !shellMode);
        modalBody.innerHTML = wrapArchiveRedesignBody(view.body, { unifiedMode, previewKey, shellMode });
        if (shouldResetModalScroll) modalBody.scrollTop = 0;
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
      if (unifiedMode) modalBody.classList.add('mvu-unified-sheet-body');
      setArchiveRedesignState(refs, false);
      if (modalLevel) modalLevel.textContent = '';
      if (modalPath) modalPath.textContent = '';
      modalTitle.textContent = config.title;
      if (modalSubtitle) modalSubtitle.textContent = '';
      if (modalSummary) modalSummary.textContent = '';
      modalBody.innerHTML = renderGenericModalBody(config);
      if (shouldResetModalScroll) modalBody.scrollTop = 0;
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
      lastRenderedModalPreviewKey = '';
      lastRenderedShellPreviewKey = '';
      modalStack = [];
      currentModalDisplayMode = 'auto';
      clearShellInlinePreview();
      hideDetailModalElement(getModalRefs());
      syncModalTitleLongPress('', false);
      notifyShellPreviewClosed();
      flushPendingLiveRefresh();
    }
    window.__MVU_CLOSE_DETAIL_MODAL__ = closeModal;
    window.__MVU_SYNC_DETAIL_MODAL_HOST__ = () => {
      const refs = getModalRefs();
      applyModalDisplayMode(refs, { displayMode: currentModalDisplayMode });
    };

    function bindVueModalDelegation(mountEl) {
      if (!mountEl || mountEl.__mvuModalDelegationBound) return;
      mountEl.addEventListener('click', (event) => {
        const eventTarget = event.target instanceof Element ? event.target : (event.target && event.target.parentElement ? event.target.parentElement : null);
        if (isInlineEditInteractionTarget(eventTarget)) return;
        const isUnifiedMount = mountEl.id === 'mvu-unified-mount';
        const mapFocusBtn = eventTarget ? eventTarget.closest('[data-map-focus-action]') : null;
        if (mapFocusBtn && mountEl.contains(mapFocusBtn)) {
          const action = mapFocusBtn.getAttribute('data-map-focus-action') || '';
          if (action === 'current') {
            event.preventDefault();
            event.stopPropagation();
            if (typeof window.__sheepMapResync === 'function') {
              try { window.__sheepMapResync({ center: true, syncVisual: true }); } catch (err) {}
              scheduleUnifiedMapCanvasClamp();
            }
          }
          return;
        }
        const clickable = eventTarget ? eventTarget.closest('.clickable') : null;
        if (!clickable || !mountEl.contains(clickable)) return;

        const previewKey = clickable.dataset.preview;
        if (!previewKey) return;
        event.preventDefault();
        event.stopPropagation();
        if (isUnifiedMount && !clickable.closest('.mvu-mobile-shell') && typeof window.__MVU_OPEN_UNIFIED_PREVIEW__ === 'function') {
          window.__MVU_OPEN_UNIFIED_PREVIEW__(previewKey, { triggerEl: clickable, preserveMapDispatchContext: true });
          return;
        }
        const displayMode = mountEl.id === 'mvu-unified-mount' ? 'floating' : 'auto';
        toggleModal(previewKey, { triggerEl: clickable, displayMode });
      });
      mountEl.__mvuModalDelegationBound = true;
    }

    function bindAllVueModalDelegations() {
      bindVueModalDelegation(document.getElementById('mvu-left-mount'));
      bindVueModalDelegation(document.getElementById('mvu-right-mount'));
      bindVueModalDelegation(document.getElementById('mvu-unified-mount'));
    }

    function installVueModalDelegationObserver() {
      if (window.__MVU_MODAL_DELEGATION_OBSERVER__ && typeof window.__MVU_MODAL_DELEGATION_OBSERVER__.disconnect === 'function') {
        try { window.__MVU_MODAL_DELEGATION_OBSERVER__.disconnect(); } catch (err) {}
      }
      const root = document.body || document.documentElement;
      if (!root) return;
      const observer = new MutationObserver(() => {
        bindAllVueModalDelegations();
      });
      observer.observe(root, { childList: true, subtree: true });
      window.__MVU_MODAL_DELEGATION_OBSERVER__ = observer;
    }

    document.addEventListener('click', (event) => {
      const eventTarget = event.target instanceof Element ? event.target : (event.target && event.target.parentElement ? event.target.parentElement : null);
      if (isInlineEditInteractionTarget(eventTarget)) return;
      const clickable = eventTarget ? eventTarget.closest('.clickable') : null;
      const leftMount = document.getElementById('mvu-left-mount');
      const rightMount = document.getElementById('mvu-right-mount');
      const unifiedMount = document.getElementById('mvu-unified-mount');
      const inClassicShell = (canvas && canvas.contains(clickable)) || (splitOverlay && splitOverlay.contains(clickable));
      const inVueShell = (leftMount && leftMount.contains(clickable))
        || (rightMount && rightMount.contains(clickable))
        || (unifiedMount && unifiedMount.contains(clickable))
        || !!(clickable && clickable.closest('.mvu-vue-wrapper'));

      if (!clickable || !(inClassicShell || inVueShell)) return;
      const previewKey = clickable.dataset.preview;
      if (!previewKey) return;
      if (unifiedMount && unifiedMount.contains(clickable) && !clickable.closest('.mvu-mobile-shell') && typeof window.__MVU_OPEN_UNIFIED_PREVIEW__ === 'function') {
        event.preventDefault();
        event.stopPropagation();
        window.__MVU_OPEN_UNIFIED_PREVIEW__(previewKey, { triggerEl: clickable, preserveMapDispatchContext: true });
        return;
      }
      const displayMode = unifiedMount && unifiedMount.contains(clickable) ? 'floating' : 'auto';
      toggleModal(previewKey, { triggerEl: clickable, displayMode });
    });

    function getDetailSurfacePreviewKey(options = {}) {
      const explicitKey = toText(options.previewKey, '').trim();
      if (explicitKey) return explicitKey;
      return options.surface === 'unified'
        ? (currentUnifiedPreviewKey || currentModalPreviewKey || '')
        : (currentModalPreviewKey || currentUnifiedPreviewKey || '');
    }

    function rerenderDetailSurface(previewKey = '', options = {}) {
      const targetKey = toText(previewKey, '').trim();
      if (!targetKey) return;
      if (options.surface === 'unified' || (currentUnifiedPreviewKey === targetKey && isUnifiedInlinePreviewActive())) {
        renderUnifiedInlinePreview(targetKey, { ...options, force: !!options.force });
        return;
      }
      renderModalContent(targetKey, getModalRefs(), { force: !!options.force });
    }

    function openNestedDetailPreview(previewKey, options = {}) {
      const targetKey = toText(previewKey, '').trim();
      if (!targetKey) return;
      if (options.surface === 'unified' && typeof window.__MVU_OPEN_UNIFIED_PREVIEW__ === 'function') {
        window.__MVU_OPEN_UNIFIED_PREVIEW__(targetKey, { preserveMapDispatchContext: true });
        return;
      }
      openModal(targetKey, { preserveMapDispatchContext: true });
    }

    function closeDetailSurface(options = {}) {
      if (options.surface === 'unified' && typeof window.__MVU_CLOSE_UNIFIED_PREVIEW__ === 'function') {
        window.__MVU_CLOSE_UNIFIED_PREVIEW__({ force: true });
        return;
      }
      closeModal();
    }

    if (modalClose) modalClose.addEventListener('click', popModalOrClose);
    async function handleDetailSurfaceClick(event, surfaceHost = modalBody, options = {}) {
      const detailSurfaceHost = surfaceHost instanceof Element ? surfaceHost : modalBody;
      const detailSurfacePanel = options.panel instanceof Element ? options.panel : detailSurfaceHost;
      const detailPreviewKey = getDetailSurfacePreviewKey(options);
      if (!detailSurfaceHost) return;
      const eventTarget = event.target instanceof Element ? event.target : (event.target && event.target.parentElement ? event.target.parentElement : null);
      if (isInlineEditInteractionTarget(eventTarget)) {
        event.stopPropagation();
        return;
      }
      const actionBtn = eventTarget ? eventTarget.closest('.armory-action-btn') : null;
      if (actionBtn && detailSurfaceHost.contains(actionBtn)) {
        event.preventDefault();
        event.stopPropagation();
        if (!isSnapshotPlayerControlled(liveSnapshot)) {
          if (typeof window.alert === 'function') window.alert('旁观视角不可操作。');
          return;
        }
        const actionData = buildArmoryActionRequest(liveSnapshot, actionBtn.dataset.armoryAction || '');
        if (actionData) dispatchUiAiRequest(actionData.playerInput, actionData.systemPrompt, { requestKind: actionData.requestKind });
        return;
      }

      const switchCharBtn = eventTarget ? eventTarget.closest('[data-mvu-switch-char]') : null;
      if (switchCharBtn && detailSurfaceHost.contains(switchCharBtn)) {
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

      const mapTravelBtn = eventTarget ? eventTarget.closest('[data-map-travel-node]') : null;
      if (mapTravelBtn && detailSurfaceHost.contains(mapTravelBtn)) {
        event.preventDefault();
        event.stopPropagation();
        const nodeName = mapTravelBtn.getAttribute('data-map-travel-node') || '';
        const sheepMapBridge = window.__sheepMapBridge;
        if (!sheepMapBridge || typeof sheepMapBridge.travelToNode !== 'function') {
          showUiToast('地图移动桥未就绪，暂时无法直接前往该节点。', 'error', 4200);
          return;
        }
        const travelResult = sheepMapBridge.travelToNode(nodeName);
        if (!travelResult || travelResult.ok === false) {
          showUiToast(toText(travelResult && travelResult.reason, `当前无法前往【${nodeName}】。`), 'error', 4200);
          return;
        }
        showUiToast(travelResult.committed ? `已提交前往【${nodeName}】的移动。` : `已规划前往【${nodeName}】。`, 'info', 3200);
        closeDetailSurface(options);
        return;
      }

      const relationFocusBtn = eventTarget ? eventTarget.closest('[data-relation-focus]') : null;
      if (relationFocusBtn && detailSurfaceHost.contains(relationFocusBtn)) {
        event.preventDefault();
        event.stopPropagation();
        const targetName = relationFocusBtn.getAttribute('data-relation-focus') || '';
        if (targetName && detailPreviewKey) {
          modalFocusState[`${detailPreviewKey}::relation-focus`] = targetName;
          rerenderDetailSurface(detailPreviewKey, options);
        }
        return;
      }

      const inventoryActionBtn = eventTarget ? eventTarget.closest('.inventory-hover-action-btn[data-inventory-action]') : null;
      if (inventoryActionBtn) {
        event.preventDefault();
        event.stopPropagation();
        const action = inventoryActionBtn.getAttribute('data-inventory-action') || '';
        const charKey = inventoryActionBtn.getAttribute('data-inventory-char') || '';
        const itemName = inventoryActionBtn.getAttribute('data-inventory-item') || '';
        const mode = inventoryActionBtn.getAttribute('data-inventory-mode') || 'one';
        if (!window.EquipmentManager || !charKey || !itemName) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('当前物品动作缺少必要信息，无法执行。', 'error');
          else if (typeof window.alert === 'function') window.alert('当前物品动作缺少必要信息，无法执行。');
          return;
        }
        hideInventoryHoverPanel();
        if (action === 'equip') {
          window.EquipmentManager.performEquip(charKey, itemName);
          return;
        }
        if (action === 'discard') {
          window.EquipmentManager.performDiscard(charKey, itemName, mode);
          return;
        }
      }

      const equipmentActionBtn = eventTarget ? eventTarget.closest('.equipment-action-btn[data-equipment-action]') : null;
      if (equipmentActionBtn && detailSurfaceHost.contains(equipmentActionBtn)) {
        event.preventDefault();
        event.stopPropagation();
        const action = equipmentActionBtn.getAttribute('data-equipment-action') || '';
        const charKey = equipmentActionBtn.getAttribute('data-equipment-char') || '';
        const kind = equipmentActionBtn.getAttribute('data-equipment-kind') || '';
        const targetName = equipmentActionBtn.getAttribute('data-equipment-name') || '';
        if (!window.EquipmentManager || !charKey || !kind) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('当前装备动作缺少必要信息，无法执行。', 'error');
          else if (typeof window.alert === 'function') window.alert('当前装备动作缺少必要信息，无法执行。');
          return;
        }
        if (action === 'unequip') {
          window.EquipmentManager.performUnequip(charKey, kind, targetName);
          return;
        }
      }

      const injuryActionBtn = eventTarget ? eventTarget.closest('[data-injury-action]') : null;
      if (injuryActionBtn && detailSurfaceHost.contains(injuryActionBtn)) {
        event.preventDefault();
        event.stopPropagation();
        const actionType = injuryActionBtn.getAttribute('data-injury-action') || '';
        const charKey = injuryActionBtn.getAttribute('data-injury-char') || '';
        const panel = injuryActionBtn.closest('[data-injury-panel]') || detailSurfaceHost;
        const readInjuryInput = key => {
          const input = panel ? panel.querySelector(`[data-injury-input="${key}"]`) : null;
          return toText(input && 'value' in input ? input.value : '', '').trim();
        };
        try {
          if (actionType === 'add') {
            const injuryName = readInjuryInput('name');
            const injuryDegree = normalizeInjurySeverity(readInjuryInput('degree') || '轻');
            const injuryDesc = readInjuryInput('desc');
            if (!charKey) throw new Error('缺少角色信息。');
            if (!injuryName) throw new Error('请输入受伤部位名称。');
            await mutateStatDataByEditor(statData => {
              const injuryPath = ['char', charKey, '状态', '受伤部位'];
              let injuryMap = deepGet(statData, injuryPath, null);
              if (!injuryMap || typeof injuryMap !== 'object' || Array.isArray(injuryMap)) {
                deepSetMutable(statData, injuryPath, {});
                injuryMap = deepGet(statData, injuryPath, null);
              }
              if (injuryMap[injuryName] !== undefined) throw new Error('同名受伤部位已存在。');
              injuryMap[injuryName] = { 程度: injuryDegree, 描述: injuryDesc };
            });
            const resetNameInput = panel ? panel.querySelector('[data-injury-input="name"]') : null;
            const resetDegreeInput = panel ? panel.querySelector('[data-injury-input="degree"]') : null;
            const resetDescInput = panel ? panel.querySelector('[data-injury-input="desc"]') : null;
            if (resetNameInput && 'value' in resetNameInput) resetNameInput.value = '';
            if (resetDegreeInput && 'value' in resetDegreeInput) resetDegreeInput.value = '轻';
            if (resetDescInput && 'value' in resetDescInput) resetDescInput.value = '';
            showUiToast('已新增受伤部位。');
            if (detailPreviewKey) rerenderDetailSurface(detailPreviewKey, options);
            return;
          }
          if (actionType === 'delete') {
            const injuryKey = injuryActionBtn.getAttribute('data-injury-key') || '';
            if (!charKey || !injuryKey) throw new Error('当前伤处缺少定位信息。');
            await deleteStatDataPathByEditor(['char', charKey, '状态', '受伤部位', injuryKey]);
            showUiToast('已删除受伤部位。');
            if (detailPreviewKey) rerenderDetailSurface(detailPreviewKey, options);
            return;
          }
        } catch (error) {
          showUiToast(error && error.message ? error.message : '伤处操作失败。', 'error');
          return;
        }
      }

      const collectionActionBtn = eventTarget ? eventTarget.closest('[data-collection-action]') : null;
      if (collectionActionBtn && detailSurfaceHost.contains(collectionActionBtn)) {
        event.preventDefault();
        event.stopPropagation();
        const actionType = collectionActionBtn.getAttribute('data-collection-action') || '';
        const panel = collectionActionBtn.closest('[data-collection-panel]') || detailSurfaceHost;
        const readCollectionInput = (key) => {
          const input = panel ? panel.querySelector(`[data-collection-input="${key}"]`) : null;
          return toText(input && 'value' in input ? input.value : '', '').trim();
        };
        const readCollectionNumber = (key, fallback = 0) => {
          const raw = readCollectionInput(key);
          return raw === '' ? fallback : toNumber(raw, fallback);
        };
        try {
          if (actionType === 'add-intel') {
            const charKey = collectionActionBtn.getAttribute('data-collection-char') || '';
            const intelText = readCollectionInput('intel-text');
            if (!charKey) throw new Error('缺少角色信息。');
            if (!intelText) throw new Error('请输入情报内容。');
            await mutateStatDataByEditor(statData => {
              const intelPath = ['char', charKey, '已掌握情报'];
              let knowledges = deepGet(statData, intelPath, null);
              if (!Array.isArray(knowledges)) {
                deepSetMutable(statData, intelPath, []);
                knowledges = deepGet(statData, intelPath, null);
              }
              if (knowledges.some(item => toText(item, '').trim() === intelText)) {
                throw new Error('这条情报已经存在。');
              }
              knowledges.push(intelText);
            });
            showUiToast('已新增情报。');
            if (detailPreviewKey) rerenderDetailSurface(detailPreviewKey, options);
            return;
          }
          if (actionType === 'delete-intel') {
            const charKey = collectionActionBtn.getAttribute('data-collection-char') || '';
            const index = toNumber(collectionActionBtn.getAttribute('data-collection-index'), -1);
            if (!charKey || index < 0) throw new Error('当前情报缺少定位信息。');
            await deleteStatDataPathByEditor(['char', charKey, '已掌握情报', index]);
            showUiToast('已删除情报。');
            if (detailPreviewKey) rerenderDetailSurface(detailPreviewKey, options);
            return;
          }
          if (actionType === 'clear-intel-pending') {
            const charKey = collectionActionBtn.getAttribute('data-collection-char') || '';
            if (!charKey) throw new Error('缺少角色信息。');
            await deleteStatDataPathByEditor(['char', charKey, '待解锁情报']);
            showUiToast('已清空待解锁线索。');
            if (detailPreviewKey) rerenderDetailSurface(detailPreviewKey, options);
            return;
          }
          if (actionType === 'add-item') {
            const charKey = collectionActionBtn.getAttribute('data-collection-char') || '';
            const itemName = readCollectionInput('item-name');
            const quantity = Math.max(1, readCollectionNumber('item-qty', 1));
            const itemType = readCollectionInput('item-type') || '物品';
            const itemDesc = readCollectionInput('item-desc') || '未知';
            if (!charKey) throw new Error('缺少角色信息。');
            if (!itemName) throw new Error('请输入物品名。');
            await mutateStatDataByEditor(statData => {
              const inventoryPath = ['char', charKey, '背包'];
              let inventory = deepGet(statData, inventoryPath, null);
              if (!inventory || typeof inventory !== 'object' || Array.isArray(inventory)) {
                deepSetMutable(statData, inventoryPath, {});
                inventory = deepGet(statData, inventoryPath, null);
              }
              const currentItem = inventory[itemName] && typeof inventory[itemName] === 'object'
                ? cloneJsonValue(inventory[itemName], {})
                : {};
              inventory[itemName] = {
                ...currentItem,
                数量: Math.max(1, toNumber(currentItem['数量'], 0) + quantity),
                类型: itemType || toText(currentItem['类型'], '物品'),
                描述: itemDesc || toText(currentItem['描述'], '未知'),
                品质: toText(currentItem['品质'], '普通') || '普通',
                品阶: toText(currentItem['品阶'], '无') || '无',
                触发方式: toText(currentItem['触发方式'], /食物/.test(itemType) ? '食用' : '使用') || (/食物/.test(itemType) ? '食用' : '使用')
              };
            });
            showUiToast('已新增物品。');
            if (detailPreviewKey) rerenderDetailSurface(detailPreviewKey, options);
            return;
          }
          if (actionType === 'add-record') {
            const charKey = collectionActionBtn.getAttribute('data-collection-char') || '';
            const recordName = readCollectionInput('record-name');
            const recordType = readCollectionInput('record-type') || '任务';
            const targetProgress = Math.max(1, readCollectionNumber('record-target', 1));
            const recordDesc = readCollectionInput('record-desc') || '未知';
            if (!charKey) throw new Error('缺少角色信息。');
            if (!recordName) throw new Error('请输入任务名。');
            await mutateStatDataByEditor(statData => {
              const recordPath = ['char', charKey, '记录'];
              let records = deepGet(statData, recordPath, null);
              if (!records || typeof records !== 'object' || Array.isArray(records)) {
                deepSetMutable(statData, recordPath, {});
                records = deepGet(statData, recordPath, null);
              }
              if (records[recordName] !== undefined) throw new Error('同名任务已存在。');
              records[recordName] = {
                状态: '进行中',
                类型: recordType,
                当前进度: 0,
                目标进度: targetProgress,
                奖励币: 0,
                奖励声望: 0,
                描述: recordDesc
              };
            });
            modalFocusState['任务界面::quest-focus'] = recordName;
            showUiToast('已新增任务。');
            if (detailPreviewKey) rerenderDetailSurface(detailPreviewKey, options);
            return;
          }
          if (actionType === 'delete-record') {
            const charKey = collectionActionBtn.getAttribute('data-collection-char') || '';
            const recordName = collectionActionBtn.getAttribute('data-collection-key') || '';
            if (!charKey || !recordName) throw new Error('当前任务缺少定位信息。');
            await deleteStatDataPathByEditor(['char', charKey, '记录', recordName]);
            if (modalFocusState['任务界面::quest-focus'] === recordName) delete modalFocusState['任务界面::quest-focus'];
            showUiToast('已删除任务。');
            if (detailPreviewKey) rerenderDetailSurface(detailPreviewKey, options);
            return;
          }
          if (actionType === 'add-board') {
            const boardName = readCollectionInput('board-name');
            const boardType = readCollectionInput('board-type') || '委托';
            const boardPublisher = readCollectionInput('board-publisher') || '系统';
            const boardDesc = readCollectionInput('board-desc') || '未知';
            if (!boardName) throw new Error('请输入委托名。');
            await mutateStatDataByEditor(statData => {
              const boardPath = ['world', '委托板'];
              let boardMap = deepGet(statData, boardPath, null);
              if (!boardMap || typeof boardMap !== 'object' || Array.isArray(boardMap)) {
                deepSetMutable(statData, boardPath, {});
                boardMap = deepGet(statData, boardPath, null);
              }
              if (boardMap[boardName] !== undefined) throw new Error('同名委托已存在。');
              boardMap[boardName] = {
                标题: boardName,
                状态: '待接取',
                类型: boardType,
                发布者: boardPublisher,
                面向: '公开',
                承接者: '无',
                目标进度: 1,
                难度: '中',
                资源级别: '无',
                奖励币: 0,
                奖励声望: 0,
                框架描述: boardDesc,
                描述: boardDesc
              };
            });
            modalFocusState['任务界面::quest-board-focus'] = boardName;
            showUiToast('已新增委托。');
            if (detailPreviewKey) rerenderDetailSurface(detailPreviewKey, options);
            return;
          }
          if (actionType === 'delete-board') {
            const boardName = collectionActionBtn.getAttribute('data-collection-key') || '';
            if (!boardName) throw new Error('当前委托缺少定位信息。');
            await deleteStatDataPathByEditor(['world', '委托板', boardName]);
            if (modalFocusState['任务界面::quest-board-focus'] === boardName) delete modalFocusState['任务界面::quest-board-focus'];
            showUiToast('已删除委托。');
            if (detailPreviewKey) rerenderDetailSurface(detailPreviewKey, options);
            return;
          }
        } catch (error) {
          showUiToast(error && error.message ? error.message : '操作失败。', 'error');
          return;
        }
      }

      const questActionBtn = eventTarget ? eventTarget.closest('.quest-action-btn[data-quest-action]') : null;
      if (questActionBtn && detailSurfaceHost.contains(questActionBtn)) {
        event.preventDefault();
        event.stopPropagation();
        if (!isSnapshotPlayerControlled(liveSnapshot)) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('旁观视角不可操作。', 'error');
          else if (typeof window.alert === 'function') window.alert('旁观视角不可操作。');
          return;
        }
        const actionType = questActionBtn.getAttribute('data-quest-action') || '';
        const requestPanel = questActionBtn.closest('.request-console-card') || detailSurfaceHost;
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
        dispatchUiAiRequest(actionData.playerInput, actionData.systemPrompt, { requestKind: actionData.requestKind });
        return;
      }

      const relationActionBtn = eventTarget ? eventTarget.closest('.relation-action-btn[data-relation-action][data-relation-target]') : null;
      if (relationActionBtn && detailSurfaceHost.contains(relationActionBtn)) {
        event.preventDefault();
        event.stopPropagation();
        if (!isSnapshotPlayerControlled(liveSnapshot)) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('旁观视角不可操作。', 'error');
          else if (typeof window.alert === 'function') window.alert('旁观视角不可操作。');
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

        const currentLocFull = toText(deepGet(liveSnapshot, 'activeChar.状态.位置', liveSnapshot.currentLoc || ''), liveSnapshot.currentLoc || '');
        const targetLoc = toText(deepGet(resolvedTarget.char, '状态.位置', ''), '');
        const isSameLocation = isLocationCompatible(currentLocFull, targetLoc);
        const isContactable = deepGet(resolvedTarget.char, '状态.存活', true) !== false;
        const relationMap = deepGet(liveSnapshot, 'activeChar.社交.关系', {});
        const relationData = relationMap && typeof relationMap === 'object' ? (relationMap[targetName] || relationMap[resolvedTarget.key] || {}) : {};
        const favor = toNumber(relationData && relationData['好感度'], 0);
        const route = toText(relationData && relationData['关系路线'], '朋友线');
        const routeSwitchable = !!deepGet(relationData, '_可切线', false);

        if (!isContactable || !isSameLocation) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show(`【${targetName}】当前不在你身边，无法进行当面关系互动。`, 'error');
          else if (typeof window.alert === 'function') window.alert(`【${targetName}】当前不在你身边，无法进行当面关系互动。`);
          return;
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
            const actionPanel = relationActionBtn.closest('.relation-action-panel') || detailSurfaceHost;
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

        if (actionData) dispatchUiAiRequest(actionData.playerInput, actionData.systemPrompt, { requestKind: actionData.requestKind });
        return;
      }

      const questBoardFocusBtn = eventTarget ? eventTarget.closest('[data-quest-board-focus]') : null;
      if (questBoardFocusBtn && detailSurfaceHost.contains(questBoardFocusBtn)) {
        event.preventDefault();
        event.stopPropagation();
        const boardId = questBoardFocusBtn.getAttribute('data-quest-board-focus') || '';
        if (boardId && detailPreviewKey) {
          modalFocusState[`${detailPreviewKey}::quest-board-focus`] = boardId;
          rerenderDetailSurface(detailPreviewKey, options);
        }
        return;
      }

      const questFocusBtn = eventTarget ? eventTarget.closest('[data-quest-focus]') : null;
      if (questFocusBtn && detailSurfaceHost.contains(questFocusBtn)) {
        event.preventDefault();
        event.stopPropagation();
        const questName = questFocusBtn.getAttribute('data-quest-focus') || '';
        if (questName && detailPreviewKey) {
          modalFocusState[`${detailPreviewKey}::quest-focus`] = questName;
          rerenderDetailSurface(detailPreviewKey, options);
        }
        return;
      }

      const factionActionBtn = eventTarget ? eventTarget.closest('.faction-action-btn[data-faction-action]') : null;
      if (factionActionBtn && detailSurfaceHost.contains(factionActionBtn)) {
        event.preventDefault();
        event.stopPropagation();
        if (!isSnapshotPlayerControlled(liveSnapshot)) {
          if (window.MVU_Toast && typeof window.MVU_Toast.show === 'function') window.MVU_Toast.show('旁观视角不可操作。', 'error');
          else if (typeof window.alert === 'function') window.alert('旁观视角不可操作。');
          return;
        }
        const factionAction = factionActionBtn.getAttribute('data-faction-action') || '';
        const requestPanel = factionActionBtn.closest('.request-console-card') || detailSurfaceHost;
        let actionData = null;
        if (factionAction === 'donate') {
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
        if (actionData) dispatchUiAiRequest(actionData.playerInput, actionData.systemPrompt, { requestKind: actionData.requestKind });
        return;
      }

      const previewClickable = eventTarget ? eventTarget.closest('.clickable[data-preview]') : null;
      if (previewClickable && detailSurfaceHost.contains(previewClickable)) {
        event.preventDefault();
        event.stopPropagation();
        const previewKey = previewClickable.dataset.preview;
        if (previewKey) openNestedDetailPreview(previewKey, options);
        return;
      }

      const clickedInsideDetailSurface = !!(eventTarget && detailSurfacePanel && detailSurfacePanel.contains(eventTarget));
      if (!clickedInsideDetailSurface && options.surface !== 'unified') popModalOrClose();
    }
    if (detailModal) detailModal.addEventListener('click', event => {
      handleDetailSurfaceClick(event, modalBody, { surface: 'modal', previewKey: currentModalPreviewKey, panel: modalPanel });
    });

    function getFloatingHoverTrigger(eventTarget) {
      if (!eventTarget || typeof eventTarget.closest !== 'function') return null;
      const trigger = eventTarget.closest('.interactive-ring');
      if (!trigger) return null;
      if (!trigger.querySelector('.ring-hover-card, .relation-hover-card')) return null;
      return trigger;
    }

    function clearFloatingHoverCard(trigger) {
      if (!trigger || !trigger.classList) return;
      trigger.classList.remove('mvu-hover-floating-active');
      const card = trigger.querySelector('.ring-hover-card, .relation-hover-card');
      if (!card) return;
      card.classList.remove('mvu-hover-card-floating');
      [
        'position',
        'left',
        'right',
        'top',
        'bottom',
        'width',
        'maxWidth',
        'maxHeight',
        'transform',
        'zIndex'
      ].forEach(prop => { card.style[prop] = ''; });
    }

    function clearAllFloatingHoverCards() {
      document.querySelectorAll('.interactive-ring.mvu-hover-floating-active').forEach(clearFloatingHoverCard);
    }

    function clampHoverValue(value, min, max) {
      if (!Number.isFinite(value)) return min;
      if (!Number.isFinite(max) || max < min) return min;
      return Math.min(Math.max(value, min), max);
    }

    function positionFloatingHoverCard(trigger) {
      if (!(trigger instanceof Element)) return;
      const card = trigger.querySelector('.ring-hover-card, .relation-hover-card');
      if (!(card instanceof HTMLElement)) return;
      const triggerRect = trigger.getBoundingClientRect();
      const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      if (!viewportWidth || !viewportHeight) return;

      const margin = 12;
      const gap = 8;
      const maxWidth = Math.max(180, viewportWidth - margin * 2);
      const maxHeight = Math.max(150, viewportHeight - margin * 2);

      trigger.classList.add('mvu-hover-floating-active');
      card.classList.add('mvu-hover-card-floating');
      card.style.position = 'fixed';
      card.style.right = 'auto';
      card.style.bottom = 'auto';
      card.style.transform = 'none';
      card.style.zIndex = '2147483000';
      card.style.maxWidth = `${maxWidth}px`;
      card.style.maxHeight = `${maxHeight}px`;
      card.style.left = '0px';
      card.style.top = '0px';

      const cardRect = card.getBoundingClientRect();
      const width = Math.min(Math.ceil(cardRect.width || 220), maxWidth);
      const height = Math.min(Math.ceil(cardRect.height || 220), maxHeight);
      const left = clampHoverValue(
        triggerRect.left + triggerRect.width / 2 - width / 2,
        margin,
        viewportWidth - width - margin
      );
      const belowTop = triggerRect.bottom + gap;
      const aboveTop = triggerRect.top - height - gap;
      const top = belowTop + height <= viewportHeight - margin
        ? belowTop
        : (aboveTop >= margin ? aboveTop : clampHoverValue(belowTop, margin, viewportHeight - height - margin));

      card.style.width = `${width}px`;
      card.style.left = `${Math.round(left)}px`;
      card.style.top = `${Math.round(top)}px`;
    }

    document.addEventListener('pointerover', event => {
      const trigger = getFloatingHoverTrigger(event.target);
      if (!trigger) return;
      positionFloatingHoverCard(trigger);
    }, true);

    document.addEventListener('pointerout', event => {
      const trigger = getFloatingHoverTrigger(event.target);
      if (!trigger) return;
      const related = event.relatedTarget instanceof Node ? event.relatedTarget : null;
      if (related && trigger.contains(related)) return;
      clearFloatingHoverCard(trigger);
    }, true);

    document.addEventListener('focusin', event => {
      const trigger = getFloatingHoverTrigger(event.target);
      if (trigger) positionFloatingHoverCard(trigger);
    }, true);

    document.addEventListener('focusout', event => {
      const trigger = getFloatingHoverTrigger(event.target);
      if (!trigger) return;
      const related = event.relatedTarget instanceof Node ? event.relatedTarget : null;
      if (related && trigger.contains(related)) return;
      clearFloatingHoverCard(trigger);
    }, true);

    window.addEventListener('resize', clearAllFloatingHoverCards);
    document.addEventListener('scroll', clearAllFloatingHoverCards, true);

let activeLongPressState = null;
    let suppressedLongPressClickState = null;

    function clearActiveLongPressState() {
      if (!activeLongPressState) return;
      if (activeLongPressState.timer) clearTimeout(activeLongPressState.timer);
      if (activeLongPressState.target && activeLongPressState.target.classList) {
        activeLongPressState.target.classList.remove('active-press');
      }
      activeLongPressState = null;
    }

    function getLongPressTarget(eventTarget) {
      return eventTarget && eventTarget.closest ? eventTarget.closest('[data-longpress]') : null;
    }

    function getLongPressDelay(target) {
      const rawDelay = target ? Number(target.getAttribute('data-longpress-delay')) : NaN;
      return Number.isFinite(rawDelay) && rawDelay >= 250 ? rawDelay : 800;
    }

    function openLongPressPreview(previewKey, target) {
      const shellBridge = getMobileShellBridge();
      const targetInShell = !!(target && typeof target.closest === 'function' && target.closest('.mvu-mobile-shell'));
      if (targetInShell && shellBridge && typeof shellBridge.openPreview === 'function') {
        shellBridge.openPreview(previewKey);
        return;
      }
      const targetInUnified = !!(target && typeof target.closest === 'function' && target.closest('#mvu-unified-mount'));
      if (targetInUnified && typeof window.__MVU_OPEN_UNIFIED_PREVIEW__ === 'function') {
        window.__MVU_OPEN_UNIFIED_PREVIEW__(previewKey, { preserveMapDispatchContext: true });
        return;
      }
      openModal(previewKey);
    }

    function canTriggerLongPressPreview(previewKey) {
      if (!previewKey) return false;
      return previewKey === PRIVATE_ARCHIVE_PREVIEW_KEY && canOpenPrivateArchive(liveSnapshot);
    }

    function markSuppressedLongPressClick(target) {
      suppressedLongPressClickState = {
        target,
        until: Date.now() + 450
      };
    }

    function shouldSuppressLongPressClick(eventTarget) {
      if (!suppressedLongPressClickState) return false;
      if (Date.now() > suppressedLongPressClickState.until) {
        suppressedLongPressClickState = null;
        return false;
      }
      return !!(eventTarget && suppressedLongPressClickState.target && (
        eventTarget === suppressedLongPressClickState.target
        || suppressedLongPressClickState.target.contains(eventTarget)
        || eventTarget.contains(suppressedLongPressClickState.target)
      ));
    }

    window.__MVU_CONSUME_LONG_PRESS_CLICK__ = eventTarget => {
      if (!shouldSuppressLongPressClick(eventTarget)) return false;
      suppressedLongPressClickState = null;
      return true;
    };

    function getLongPressScrollContainer(target) {
      let current = target instanceof Element ? target : null;
      while (current && current !== document.body) {
        try {
          const style = window.getComputedStyle(current);
          const overflowY = style ? style.overflowY : '';
          if ((overflowY === 'auto' || overflowY === 'scroll') && current.scrollHeight > current.clientHeight + 2) {
            return current;
          }
        } catch (err) {}
        current = current.parentElement;
      }
      return document.scrollingElement || document.documentElement || document.body;
    }

    const handleLongPressStart = (event) => {
      const target = getLongPressTarget(event.target);
      if (!target) return;
      if (typeof event.button === 'number' && event.button !== 0) return;
      const previewKey = target.getAttribute('data-longpress');
      if (!canTriggerLongPressPreview(previewKey)) return;
      clearActiveLongPressState();
      target.classList.add('active-press');
      const delay = getLongPressDelay(target);
      const scrollContainer = getLongPressScrollContainer(target);
      activeLongPressState = {
        pointerId: event.pointerId,
        target,
        startX: Number.isFinite(event.clientX) ? event.clientX : 0,
        startY: Number.isFinite(event.clientY) ? event.clientY : 0,
        scrollContainer,
        scrollTop: scrollContainer && typeof scrollContainer.scrollTop === 'number' ? scrollContainer.scrollTop : 0,
        scrollLeft: scrollContainer && typeof scrollContainer.scrollLeft === 'number' ? scrollContainer.scrollLeft : 0,
        timer: setTimeout(() => {
          target.classList.remove('active-press');
          activeLongPressState = null;
          if (!previewKey) return;
          if (!canTriggerLongPressPreview(previewKey)) return;
          markSuppressedLongPressClick(target);
          if (navigator.vibrate) navigator.vibrate(50);
          openLongPressPreview(previewKey, target);
        }, delay)
      };
    };

    const handleLongPressEnd = (event) => {
      if (!activeLongPressState) return;
      if (typeof event.pointerId === 'number' && typeof activeLongPressState.pointerId === 'number' && event.pointerId !== activeLongPressState.pointerId) {
        return;
      }
      clearActiveLongPressState();
    };

    const handleLongPressMove = (event) => {
      if (!activeLongPressState) return;
      if (typeof event.pointerId === 'number' && typeof activeLongPressState.pointerId === 'number' && event.pointerId !== activeLongPressState.pointerId) {
        return;
      }
      const moveX = Math.abs((Number.isFinite(event.clientX) ? event.clientX : 0) - activeLongPressState.startX);
      const moveY = Math.abs((Number.isFinite(event.clientY) ? event.clientY : 0) - activeLongPressState.startY);
      if (moveX > 10 || moveY > 10) {
        clearActiveLongPressState();
        return;
      }
      if (activeLongPressState.scrollContainer) {
        const currentTop = typeof activeLongPressState.scrollContainer.scrollTop === 'number' ? activeLongPressState.scrollContainer.scrollTop : 0;
        const currentLeft = typeof activeLongPressState.scrollContainer.scrollLeft === 'number' ? activeLongPressState.scrollContainer.scrollLeft : 0;
        if (Math.abs(currentTop - activeLongPressState.scrollTop) > 2 || Math.abs(currentLeft - activeLongPressState.scrollLeft) > 2) {
          clearActiveLongPressState();
          return;
        }
      }
      const hoverEl = document.elementFromPoint(event.clientX, event.clientY);
      if (!hoverEl || !activeLongPressState.target.contains(hoverEl)) {
        clearActiveLongPressState();
      }
    };

    document.addEventListener('pointerdown', handleLongPressStart);
    document.addEventListener('pointerup', handleLongPressEnd);
    document.addEventListener('pointercancel', handleLongPressEnd);
    document.addEventListener('pointermove', handleLongPressMove, { passive: true });
    document.addEventListener('scroll', clearActiveLongPressState, true);
    document.addEventListener('mouseleave', clearActiveLongPressState);
    document.addEventListener('contextmenu', (event) => {
      const target = getLongPressTarget(event.target);
      if (target) event.preventDefault();
    });
    document.addEventListener('click', (event) => {
      const eventTarget = event.target instanceof Element ? event.target : (event.target && event.target.parentElement ? event.target.parentElement : null);
      if (!window.__MVU_CONSUME_LONG_PRESS_CLICK__(eventTarget)) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }, true);

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
  async resolveCharContext(charRef) {
    const vars = cloneJsonValue(await ensureMvuEditorStoreReady(), {});
    if (!vars || !vars.char || typeof vars.char !== 'object') {
      throw new Error('获取角色数据失败。');
    }
    const charEntries = Object.entries(vars.char);
    let charKey = '';
    if (typeof charRef === 'string' && vars.char[charRef]) {
      charKey = charRef;
    } else if (typeof charRef === 'number' && charEntries[charRef]) {
      charKey = charEntries[charRef][0];
    } else if (typeof charRef === 'string') {
      const matched = charEntries.find(([key, value]) => {
        const displayName = toText(value && (value.name || deepGet(value, 'base.name', '')), key);
        return displayName === charRef;
      });
      charKey = matched ? matched[0] : '';
    }
    if (!charKey) {
      charKey = charEntries[0] ? charEntries[0][0] : '';
    }
    if (!charKey || !vars.char[charKey]) {
      throw new Error('未找到目标角色信息。');
    }
    return { vars, charKey, activeChar: vars.char[charKey] || {} };
  },

  buildInventoryItemValue(itemName, itemData = {}, options = {}) {
    const safeItem = cloneJsonValue(itemData, {});
    delete safeItem.装备状态;
    if (safeItem.name === itemName) delete safeItem.name;
    if (safeItem['名称'] === itemName) delete safeItem['名称'];
    safeItem.数量 = Math.max(1, toNumber(options.quantity, 1));
    if (!safeItem['类型'] && options.type) safeItem['类型'] = options.type;
    if (!safeItem['品质'] && options.quality) safeItem['品质'] = options.quality;
    return safeItem;
  },

  queueInventoryAdd(patches, charPath, inventoryBuffer, itemName, itemValue) {
    if (!itemName) return;
    const nextValue = this.buildInventoryItemValue(itemName, itemValue, { quantity: 1 });
    const existing = inventoryBuffer[itemName];
    if (existing) {
      const nextQty = Math.max(1, toNumber(existing.数量, 1) + toNumber(nextValue.数量, 1));
      inventoryBuffer[itemName] = { ...existing, ...nextValue, 数量: nextQty };
      patches.push({ op: 'replace', path: `${charPath}/背包/${this.escapePtr(itemName)}`, value: cloneJsonValue(inventoryBuffer[itemName], {}) });
      return;
    }
    inventoryBuffer[itemName] = cloneJsonValue(nextValue, {});
    patches.push({ op: 'add', path: `${charPath}/背包/${this.escapePtr(itemName)}`, value: cloneJsonValue(inventoryBuffer[itemName], {}) });
  },

  queueInventoryConsume(patches, charPath, inventoryBuffer, itemName, quantity = 1) {
    const existing = inventoryBuffer[itemName];
    if (!existing) return false;
    const nextQty = Math.max(0, toNumber(existing.数量, 1) - Math.max(1, toNumber(quantity, 1)));
    if (nextQty <= 0) {
      delete inventoryBuffer[itemName];
      patches.push({ op: 'remove', path: `${charPath}/背包/${this.escapePtr(itemName)}` });
      return true;
    }
    inventoryBuffer[itemName] = { ...existing, 数量: nextQty };
    patches.push({ op: 'replace', path: `${charPath}/背包/${this.escapePtr(itemName)}`, value: cloneJsonValue(inventoryBuffer[itemName], {}) });
    return true;
  },

  async performEquip(charRef, itemName) {
    try {
      const { charKey, activeChar } = await this.resolveCharContext(charRef);
      const inventory = activeChar.背包 || {};
      const 装备数据 = activeChar.装备 || {};
      const soulBone = activeChar.魂骨 || {};
      const itemData = inventory[itemName];
      if (!itemData || (itemData.数量 || 0) <= 0) {
        throw new Error(`背包中未找到物品: ${itemName}`);
      }

      const slotInfo = this.parseEquipSlot(itemName, itemData);
      if (!slotInfo) {
        throw new Error(`【${itemName}】不可装备！`);
      }

      if (slotInfo.mainSlot === 'armor') {
        const newTier = this.getArmorTier(itemName);
        if (newTier) {
          const armorParts = (装备数据.斗铠 && 装备数据.斗铠.部件) ? 装备数据.斗铠.部件 : {};
          for (const [key, piece] of Object.entries(armorParts)) {
            if (piece && typeof piece === 'object' && piece['名称'] && piece['名称'] !== '无' && key !== slotInfo.subSlot) {
              const pieceTier = this.getArmorTier(piece['名称']);
              if (pieceTier && pieceTier !== newTier) {
                throw new Error(`【换装失败】\n背包中的【${newTier}】不可与身上的【${pieceTier}】混穿！\n必须成套更换相同级别的斗铠。`);
              }
            }
          }
        }
      }

      if (slotInfo.mainSlot === 'soul_bone') {
        const existingBone = soulBone[slotInfo.subSlot];
        if (existingBone && typeof existingBone === 'object' && existingBone['名称'] && !existingBone['名称'].includes('未鉴定之')) {
          throw new Error(`【装载失败】\n${slotInfo.subSlot} 已融合了【${existingBone['名称']}】！\n魂骨一经融合无法直接替换，除非强行剥离！`);
        }
      }

      const patches = [];
      const charPath = `/char/${this.escapePtr(charKey)}`;
      const inventoryBuffer = cloneJsonValue(inventory, {});
      this.queueInventoryConsume(patches, charPath, inventoryBuffer, itemName, 1);

      if (slotInfo.mainSlot === 'soul_bone') {
        const newBoneData = {
          名称: itemName,
          年限: itemData['年限'] || (itemData['品质'] && itemData['品质'].includes('万') ? 10000 : 1000),
          品质: itemData['品质'] || '常规',
          状态: '已装载'
        };
        patches.push({ op: 'add', path: `${charPath}/魂骨/${slotInfo.subSlot}`, value: newBoneData });
      } else {
        let oldItem = null;
        const equipKeyMap = { armor: '斗铠', mech: '机甲', wpn: '武器', accessory: '饰品' };
        const equipKey = equipKeyMap[slotInfo.mainSlot] || slotInfo.mainSlot;
        let equipPath = `${charPath}/装备/${equipKey}`;
        if (slotInfo.subSlot) {
          equipPath += `/部件/${slotInfo.subSlot}`;
          oldItem = equip[equipKey]?.部件?.[slotInfo.subSlot];
        } else {
          oldItem = equip[equipKey];
        }

        if (oldItem && typeof oldItem === 'object' && oldItem['名称'] && toText(oldItem['名称'], '无') !== '无') {
          const oldName = toText(oldItem['名称'], '');
          this.queueInventoryAdd(patches, charPath, inventoryBuffer, oldName, oldItem);
        }

        const newEquipData = Object.assign({}, itemData, { 名称: itemName });
        delete newEquipData.name;
        delete newEquipData.数量;
        if (slotInfo.subSlot && (!equip[equipKey] || !equip[equipKey].部件)) {
          patches.push({ op: 'add', path: `${charPath}/装备/${equipKey}/部件`, value: {} });
        }
        patches.push({ op: oldItem !== undefined ? 'replace' : 'add', path: equipPath, value: newEquipData });
      }

      await this.submitPatch(patches, `已穿戴 ${itemName}`);
    } catch (error) {
      window.MVU_Toast.show(error && error.message ? error.message : '换装失败。', 'error');
    }
  },

  async performUnequip(charRef, targetType, targetName = '') {
    try {
      const { charKey, activeChar } = await this.resolveCharContext(charRef);
      const 装备数据 = activeChar.装备 || {};
      const charPath = `/char/${this.escapePtr(charKey)}`;
      const inventoryBuffer = cloneJsonValue(activeChar.背包 || {}, {});
      const patches = [];

      if (targetType === 'armor') {
        const armor = 装备数据.斗铠 || {};
        const armorParts = armor.部件 && typeof armor.部件 === 'object' ? armor.部件 : {};
        const returnParts = Object.values(armorParts).filter(part => part && typeof part === 'object' && toText(part['名称'], '') && toText(part['名称'], '无') !== '无');
        if (!returnParts.length && toText(armor.装备状态, '未装备') === '未装备') {
          throw new Error('当前没有可卸下的斗铠部件。');
        }
        returnParts.forEach(part => {
          const itemName = toText(part['名称'], '');
          this.queueInventoryAdd(patches, charPath, inventoryBuffer, itemName, part);
        });
        patches.push({ op: 'replace', path: `${charPath}/装备/斗铠/部件`, value: {} });
        patches.push({ op: 'replace', path: `${charPath}/装备/斗铠/装备状态`, value: '未装备' });
        patches.push({ op: 'replace', path: `${charPath}/装备/斗铠/_属性加成`, value: {} });
        await this.submitPatch(patches, '已卸下斗铠');
        return;
      }

      if (targetType === 'mech') {
        const mech = 装备数据.机甲 || {};
        const mechName = toText(mech.型号, '');
        if (!mechName) throw new Error('当前没有已装载的机甲。');
        this.queueInventoryAdd(patches, charPath, inventoryBuffer, mechName, mech);
        patches.push({ op: 'replace', path: `${charPath}/装备/机甲`, value: {} });
        await this.submitPatch(patches, `已卸下机甲 ${mechName}`);
        return;
      }

      if (targetType === 'wpn') {
        const weapon = 装备数据.武器 || {};
        const weaponName = toText(weapon.名称 || weapon['名称'], '');
        if (!weaponName) throw new Error('当前没有已装备的主武器。');
        this.queueInventoryAdd(patches, charPath, inventoryBuffer, weaponName, weapon);
        patches.push({ op: 'replace', path: `${charPath}/装备/武器`, value: {} });
        await this.submitPatch(patches, `已卸下主武器 ${weaponName}`);
        return;
      }

      if (targetType === 'accessory') {
        const accessories = 装备数据.饰品 && typeof 装备数据.饰品 === 'object' ? 装备数据.饰品 : {};
        const targetAccessoryName = toText(targetName, '');
        const accessoryData = targetAccessoryName ? accessories[targetAccessoryName] : null;
        if (!targetAccessoryName || !accessoryData) throw new Error('未找到要拆卸的附件。');
        this.queueInventoryAdd(patches, charPath, inventoryBuffer, targetAccessoryName, accessoryData);
        patches.push({ op: 'remove', path: `${charPath}/装备/饰品/${this.escapePtr(targetAccessoryName)}` });
        await this.submitPatch(patches, `已拆卸附件 ${targetAccessoryName}`);
        return;
      }

      throw new Error('暂不支持该装备类型的拆卸。');
    } catch (error) {
      window.MVU_Toast.show(error && error.message ? error.message : '拆卸失败。', 'error');
    }
  },

  async performDiscard(charRef, itemName, mode = 'one') {
    try {
      const { charKey, activeChar } = await this.resolveCharContext(charRef);
      const inventory = activeChar.背包 || {};
      const itemData = inventory[itemName];
      if (!itemData) throw new Error(`背包中未找到物品: ${itemName}`);
      const currentQty = Math.max(1, toNumber(itemData.数量, 1));
      const discardQty = mode === 'all' ? currentQty : 1;
      const charPath = `/char/${this.escapePtr(charKey)}`;
      const inventoryBuffer = cloneJsonValue(inventory, {});
      const patches = [];
      this.queueInventoryConsume(patches, charPath, inventoryBuffer, itemName, discardQty);
      await this.submitPatch(patches, mode === 'all' ? `已丢弃 ${itemName} 全部库存` : `已丢弃 ${itemName} ×1`);
    } catch (error) {
      window.MVU_Toast.show(error && error.message ? error.message : '丢弃失败。', 'error');
    }
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

  async submitPatch(patches, successMessage = '装备操作已完成') {
    await applyJsonPatchOpsByEditor(patches);
    window.MVU_Toast.show(successMessage, 'info');
  }
};

    document.addEventListener('click', (event) => {
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
      if (event.key !== 'Escape') return;
      if (isUnifiedInlinePreviewActive() && typeof window.__MVU_CLOSE_UNIFIED_PREVIEW__ === 'function') {
        window.__MVU_CLOSE_UNIFIED_PREVIEW__();
        return;
      }
      closeModal();
    });

    window.addEventListener('resize', () => {
      const refs = getModalRefs();
      if (!refs.detailModal || !refs.detailModal.classList.contains('show')) return;
      applyModalDisplayMode(refs, { displayMode: currentModalDisplayMode });
    });

    if (document.body) {
      const layoutClassObserver = new MutationObserver(() => {
        const refs = getModalRefs();
        if (!refs.detailModal || !refs.detailModal.classList.contains('show')) return;
        applyModalDisplayMode(refs);
      });
      layoutClassObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    const initialModalRefs = getModalRefs();
    if (initialModalRefs.detailModal && initialModalRefs.detailModal.classList.contains('show')) {
      applyModalDisplayMode(initialModalRefs);
    }

    bindAllVueModalDelegations();
    installVueModalDelegationObserver();

    initLiveBindings();
  
window.mvuSetMainTabExternal = setMainTab;
window.mvuSetMainTab = setMainTab;

