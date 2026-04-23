const { createApp, ref, reactive, computed } = Vue;

const TAB_ITEMS = [
  { id: 'page-archive', label: '档案' },
  { id: 'page-map', label: '星图' },
  { id: 'page-world', label: '世界' },
  { id: 'page-org', label: '势力' },
  { id: 'page-terminal', label: '终端' }
];

const UNIFIED_ACTION_ITEMS = {
  'page-archive': [
    { label: '角色', preview: '角色切换器' },
    { label: '生命', preview: '生命图谱详细页' },
    { label: '武装', preview: '武装工坊详细页' },
    { label: '仓库', preview: '储物仓库详细页' }
  ],
  'page-map': [
    { label: '星图', preview: '全息星图主画布' },
    { label: '节点', preview: '当前节点详情' },
    { label: '跑图', preview: '图层控制与跑图' }
  ],
  'page-world': [
    { label: '编年', preview: '编年史档案' },
    { label: '警报', preview: '拍卖与警报' }
  ],
  'page-org': [
    { label: '矩阵', preview: '势力矩阵总览' },
    { label: '阵营', preview: '我的阵营详情' }
  ],
  'page-terminal': [
    { label: '播报', preview: '系统播报与日志' },
    { label: '情报', preview: '试炼与情报' },
    { label: '任务', preview: '任务界面' }
  ]
};

const LAYOUT_STORAGE_KEY = 'mvu_layout_mode';
const MOBILE_VIEWPORT_MEDIA = '(max-width: 860px)';
const VALID_LAYOUT_MODES = new Set(['split', 'unified']);

function detectMobileViewport() {
  try {
    if (typeof window.matchMedia === 'function') {
      return window.matchMedia(MOBILE_VIEWPORT_MEDIA).matches;
    }
  } catch (err) {}
  return window.innerWidth <= 860;
}

function normalizeLayoutMode(mode) {
  const value = String(mode || '').trim();
  return VALID_LAYOUT_MODES.has(value) ? value : '';
}

function readLayoutModeStorage() {
  try {
    return normalizeLayoutMode(window.localStorage.getItem(LAYOUT_STORAGE_KEY));
  } catch (err) {
    return '';
  }
}

function writeLayoutModeStorage(mode) {
  const normalized = normalizeLayoutMode(mode);
  if (!normalized) return;
  try {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, normalized);
  } catch (err) {}
}

function resolveUnifiedActions(tabId) {
  return UNIFIED_ACTION_ITEMS[tabId] || UNIFIED_ACTION_ITEMS['page-archive'] || [];
}

const persistedLayoutMode = readLayoutModeStorage();
const mvuLayoutState = window.__MVU_LAYOUT_STATE__ || (window.__MVU_LAYOUT_STATE__ = reactive({
  preferredMode: persistedLayoutMode || 'split',
  effectiveMode: 'split',
  unifiedAnchorReady: false,
  isMobileViewport: detectMobileViewport(),
  hasManualOverride: !!persistedLayoutMode
}));

if (!('hasManualOverride' in mvuLayoutState)) {
  mvuLayoutState.hasManualOverride = !!persistedLayoutMode;
}
if (!('unifiedAnchorReady' in mvuLayoutState)) {
  mvuLayoutState.unifiedAnchorReady = false;
}
if (!normalizeLayoutMode(mvuLayoutState.preferredMode)) {
  mvuLayoutState.preferredMode = persistedLayoutMode || (mvuLayoutState.isMobileViewport ? 'unified' : 'split');
}
if (!mvuLayoutState.hasManualOverride) {
  mvuLayoutState.preferredMode = mvuLayoutState.isMobileViewport ? 'unified' : 'split';
}

const mvuTabState = window.__MVU_TAB_STATE__ || (window.__MVU_TAB_STATE__ = reactive({ current: 'page-archive' }));
const mvuFoldState = window.__MVU_SIDE_FOLD_STATE__ || (window.__MVU_SIDE_FOLD_STATE__ = ref(true));
const mvuPinState = window.__MVU_PIN_STATE__ || (window.__MVU_PIN_STATE__ = ref(false));

function applyLayoutBodyClasses() {
  const body = document.body;
  if (!body) return;
  body.classList.toggle('mvu-layout-split', mvuLayoutState.effectiveMode === 'split');
  body.classList.toggle('mvu-layout-unified', mvuLayoutState.effectiveMode === 'unified');
  body.classList.toggle('mvu-mobile-viewport', !!mvuLayoutState.isMobileViewport);
}

function resolveEffectiveLayoutMode() {
  if (mvuLayoutState.preferredMode === 'unified' && mvuLayoutState.unifiedAnchorReady) {
    return 'unified';
  }
  return 'split';
}

function syncLayoutMode() {
  mvuLayoutState.effectiveMode = resolveEffectiveLayoutMode();
  applyLayoutBodyClasses();
  return mvuLayoutState.effectiveMode;
}

function setLayoutMode(mode, options = {}) {
  const normalized = normalizeLayoutMode(mode);
  if (!normalized) return mvuLayoutState.effectiveMode;

  mvuLayoutState.preferredMode = normalized;
  if (options.manual !== false) {
    mvuLayoutState.hasManualOverride = true;
    writeLayoutModeStorage(normalized);
  }
  if (normalized === 'unified' && window.__MVU_UNIFIED_ANCHOR_MANAGER__ && typeof window.__MVU_UNIFIED_ANCHOR_MANAGER__.scheduleRelocate === 'function') {
    window.__MVU_UNIFIED_ANCHOR_MANAGER__.scheduleRelocate();
  }
  return syncLayoutMode();
}

function getLayoutMode() {
  return mvuLayoutState.effectiveMode;
}

function refreshViewportState() {
  const nextMobileState = detectMobileViewport();
  if (mvuLayoutState.isMobileViewport !== nextMobileState) {
    mvuLayoutState.isMobileViewport = nextMobileState;
  }
  if (!mvuLayoutState.hasManualOverride) {
    mvuLayoutState.preferredMode = nextMobileState ? 'unified' : 'split';
  }
  syncLayoutMode();
}

if (typeof window.__MVU_LAYOUT_VIEWPORT_CLEANUP__ === 'function') {
  try { window.__MVU_LAYOUT_VIEWPORT_CLEANUP__(); } catch (err) {}
}

const viewportDisposers = [];
if (typeof window.matchMedia === 'function') {
  const mediaQuery = window.matchMedia(MOBILE_VIEWPORT_MEDIA);
  const onMediaChange = () => refreshViewportState();
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', onMediaChange);
    viewportDisposers.push(() => mediaQuery.removeEventListener('change', onMediaChange));
  } else if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(onMediaChange);
    viewportDisposers.push(() => mediaQuery.removeListener(onMediaChange));
  }
}

const onResize = () => refreshViewportState();
window.addEventListener('resize', onResize);
viewportDisposers.push(() => window.removeEventListener('resize', onResize));
window.__MVU_LAYOUT_VIEWPORT_CLEANUP__ = () => {
  for (const disposer of viewportDisposers) {
    try { disposer(); } catch (err) {}
  }
};

window.mvuSetLayoutMode = mode => setLayoutMode(mode, { manual: true });
window.mvuGetLayoutMode = () => getLayoutMode();

function handleGlobalFold() {
  if (mvuPinState.value) return;
  if (window.__mvuFoldTimer) clearTimeout(window.__mvuFoldTimer);
  window.__mvuFoldTimer = setTimeout(() => {
    const hasOpenModal = !!document.querySelector('.modal-mask.show, .mvu-modal-mask.show, #detailModal.show');
    if (!hasOpenModal) {
      mvuFoldState.value = true;
    }
  }, 3000);
}

function handleGlobalUnfold() {
  if (window.__mvuFoldTimer) clearTimeout(window.__mvuFoldTimer);
  window.__mvuFoldTimer = null;
  mvuFoldState.value = false;
}

function setSharedTab(target) {
  mvuTabState.current = target || 'page-archive';
}

window.__MVU_SET_TAB_STATE__ = setSharedTab;

function requestTabChange(target) {
  const next = target || 'page-archive';
  setSharedTab(next);
  if (typeof window.mvuSetMainTabExternal === 'function') {
    window.mvuSetMainTabExternal(next);
  } else if (typeof window.mvuSetMainTab === 'function') {
    window.mvuSetMainTab(next);
  }
}

function createUnifiedAnchorManager(options = {}) {
  const mountId = options.mountId || 'mvu-unified-mount';
  const onReadyChange = typeof options.onReadyChange === 'function' ? options.onReadyChange : () => {};

  let bodyObserver = null;
  let chatObserver = null;
  let observedChat = null;
  let rafToken = 0;
  let lastReadyState = null;

  function setReadyState(nextReady) {
    if (lastReadyState === nextReady) return;
    lastReadyState = nextReady;
    onReadyChange(nextReady);
  }

  function findLastMessage(chatEl) {
    if (!chatEl) return null;
    const explicitLast = chatEl.querySelector('.mes.last_mes');
    if (explicitLast) return explicitLast;
    const messages = chatEl.querySelectorAll('.mes');
    return messages.length ? messages[messages.length - 1] : null;
  }

  function findFallbackConflictNode(chatEl) {
    if (!chatEl || !chatEl.children) return null;
    const children = Array.from(chatEl.children);
    for (const node of children) {
      if (!(node instanceof Element)) continue;
      if (node.id === 'acu-nav-bar') return node;
      if (node.classList.contains('acu-wrapper')) return node;
    }
    return null;
  }

  function relocateMount() {
    const mountEl = ensureUnifiedDockMounted();
    const chatEl = document.getElementById('chat');
    if (!mountEl || !chatEl || !chatEl.isConnected) {
      setReadyState(false);
      return;
    }

    const anchor = findLastMessage(chatEl);
    const parent = (anchor && anchor.parentElement) ? anchor.parentElement : chatEl;
    let expectedNext = anchor ? anchor.nextElementSibling : findFallbackConflictNode(chatEl);
    if (expectedNext === mountEl) {
      expectedNext = mountEl.nextElementSibling;
    }

    if (mountEl.parentElement !== parent || mountEl.nextElementSibling !== expectedNext) {
      parent.insertBefore(mountEl, expectedNext || null);
    }

    setReadyState(true);
  }

  function scheduleRelocate() {
    if (rafToken) return;
    rafToken = requestAnimationFrame(() => {
      rafToken = 0;
      relocateMount();
    });
  }

  function observeChat(chatEl) {
    if (chatObserver) {
      chatObserver.disconnect();
      chatObserver = null;
    }
    observedChat = chatEl || null;
    if (!chatEl) return;

    chatObserver = new MutationObserver(() => scheduleRelocate());
    chatObserver.observe(chatEl, { childList: true, subtree: true });
  }

  function refreshChatObserver() {
    const chatEl = document.getElementById('chat');
    if (chatEl !== observedChat) {
      observeChat(chatEl);
    }
  }

  function start() {
    const root = document.body || document.documentElement;
    if (!root) return;

    if (bodyObserver) bodyObserver.disconnect();
    bodyObserver = new MutationObserver(() => {
      refreshChatObserver();
      scheduleRelocate();
    });
    bodyObserver.observe(root, { childList: true, subtree: true });

    refreshChatObserver();
    scheduleRelocate();
  }

  function stop() {
    if (bodyObserver) {
      bodyObserver.disconnect();
      bodyObserver = null;
    }
    if (chatObserver) {
      chatObserver.disconnect();
      chatObserver = null;
    }
    observedChat = null;
    if (rafToken) {
      cancelAnimationFrame(rafToken);
      rafToken = 0;
    }
    setReadyState(false);
  }

  return {
    start,
    stop,
    scheduleRelocate
  };
}

const LeftPanel = {
  template: `
    <div class="mvu-vue-wrapper mvu-root left-panel" :class="{ 'is-folded': isFolded }" style="position:fixed;top:0;left:0;bottom:0;z-index:100;">
      <div class="split-shell-bg-sibling split-shell-bg-left"></div>
      <div class="split-shell split-shell-left" @mouseenter="unfold" @mouseleave="fold">
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

        <div class="split-shell-stage" id="splitLeftStage">
          <div class="split-page split-left-page" :class="{ active: tabState.current === 'page-archive' }" data-target="page-archive">
            <div class="split-archive-stack split-archive-left">
              <div class="archive-split-topline">
                <div class="archive-split-loc">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>
                  <span></span>
                </div>
                <div class="archive-split-name clickable" data-preview="角色切换器" title="切换当前查看角色">
                  <span class="char-emblem">◈</span>
                  <span class="archive-split-name-text"></span>
                </div>
              </div>

              <div class="mvu-panel core-card clickable" data-preview="生命图谱详细页"></div>

              <div class="strip dual-spirit-strip single-track">
                <div class="dual-spirit-body">
                  <div class="spirit-side primary-side clickable" id="archivePrimarySpiritEntry" data-preview="第一武魂详细页"></div>
                  <div class="spirit-side secondary-side clickable"></div>
                </div>
              </div>

              <div class="strip dual-spirit-strip secondary-track split-secondary-left">
                <div class="dual-spirit-body">
                  <div class="spirit-side primary-side clickable"></div>
                  <div class="spirit-side secondary-side clickable" id="archiveSecondarySpiritEntry" data-preview="血脉封印详细页"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="split-page split-left-page" :class="{ active: tabState.current === 'page-map' }" data-target="page-map">
            <div class="mvu-module-card hero-card core-card map-hero-card clickable" data-preview="全息星图主画布"></div>
          </div>

          <div class="split-page split-left-page" :class="{ active: tabState.current === 'page-world' }" data-target="page-world">
            <div class="mvu-module-card hero-card core-card" data-preview="世界状态总览"></div>
          </div>

          <div class="split-page split-left-page" :class="{ active: tabState.current === 'page-org' }" data-target="page-org">
            <div class="mvu-module-card hero-card core-card clickable" data-preview="势力矩阵总览"></div>
          </div>

          <div class="split-page split-left-page" :class="{ active: tabState.current === 'page-terminal' }" data-target="page-terminal">
            <div class="mvu-module-card hero-card core-card terminal-hero-card clickable" data-preview="系统播报与日志"></div>
          </div>
        </div>

        <div class="footer-tabs split-footer-tabs split-side-tabs-left" id="splitFooterTabsLeft">
          <button
            v-for="tab in tabs"
            :key="'left-tab-' + tab.id"
            class="mvu-tab-btn"
            :class="{ active: tabState.current === tab.id }"
            :data-target="tab.id"
            @click="setTab(tab.id)"
          >{{ tab.label }}</button>
        </div>
      </div>
      <button
        type="button"
        class="mvu-fold-btn left-btn"
        :title="isFolded ? '展开左侧栏' : '折叠左侧栏'"
        @mouseenter="unfold"
        @click.stop="toggleFold"
      >{{ isFolded ? '›' : '‹' }}</button>
    </div>
  `,
  setup() {
    const isFolded = mvuFoldState;
    const fold = handleGlobalFold;
    const unfold = handleGlobalUnfold;
    const toggleFold = () => { isFolded.value = !isFolded.value; };
    return {
      isFolded,
      fold,
      unfold,
      toggleFold,
      tabState: mvuTabState,
      tabs: TAB_ITEMS,
      setTab: requestTabChange
    };
  }
};

const RightPanel = {
  template: `
    <div class="mvu-vue-wrapper mvu-root right-panel" :class="{ 'is-folded': isFolded }" style="position:fixed;top:0;right:0;bottom:0;z-index:100;">
      <div class="split-shell-bg-sibling split-shell-bg-right"></div>
      <div class="split-shell split-shell-right" @mouseenter="unfold" @mouseleave="fold">
        <button type="button" class="mvu-pin-btn" :class="{ active: isPinned }" @click.stop="togglePin" title="固定侧边栏(不会自动收起)" @mouseenter="unfold">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M16 4v4l2 3v2h-5v8l-1 2-1-2v-8H6v-2l2-3V4z"></path></svg>
        </button>
        <button
          type="button"
          class="mvu-window-settings-btn"
          :class="{ active: settingsOpen }"
          title="窗口设置"
          @mouseenter="unfold"
          @click.stop="toggleSettings"
        >
          <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2v3"></path><path d="M12 19v3"></path><path d="M4.93 4.93l2.12 2.12"></path><path d="M16.95 16.95l2.12 2.12"></path><path d="M2 12h3"></path><path d="M19 12h3"></path><path d="M4.93 19.07l2.12-2.12"></path><path d="M16.95 7.05l2.12-2.12"></path><circle cx="12" cy="12" r="3.2"></circle></svg>
        </button>
        <div v-if="settingsOpen" class="mvu-window-settings-panel" @click.stop>
          <div class="mvu-window-settings-title">窗口设置</div>
          <button
            type="button"
            class="mvu-window-settings-option"
            :class="{ active: layoutState.preferredMode === 'split' }"
            @click="setLayoutByPanel('split')"
          >分栏模式</button>
          <button
            type="button"
            class="mvu-window-settings-option"
            :class="{ active: layoutState.preferredMode === 'unified' }"
            @click="setLayoutByPanel('unified')"
          >一体模式</button>
        </div>
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

        <div class="split-shell-stage" id="splitRightStage">
          <div class="split-page split-right-page" :class="{ active: tabState.current === 'page-archive' }" data-target="page-archive">
            <div class="split-archive-stack split-archive-right">
              <div class="right-stack">
                <div class="mvu-module-card entry-card clickable" data-preview="武装工坊详细页"></div>
                <div class="mvu-module-card entry-card clickable" data-preview="储物仓库详细页"></div>
              </div>

              <div class="mvu-simple-card archive-social-card">
                <div class="simple-head"><div class="simple-title">社交摘要</div></div>
                <div class="social-summary">
                  <div class="social-chip clickable" data-preview="社会档案详细页"><b>名望等级</b><span></span></div>
                  <div class="social-chip clickable" data-preview="所属势力详细页"><b>所属势力</b><span></span></div>
                  <div class="social-chip clickable" data-preview="人物关系详细页"><b>关系摘要</b><span></span></div>
                  <div class="social-chip clickable" data-preview="情报库详细页"><b>已解锁情报</b><span></span></div>
                </div>
              </div>
            </div>
          </div>

          <div class="split-page split-right-page" :class="{ active: tabState.current === 'page-map' }" data-target="page-map">
            <div class="stack-3 map-side-stack">
              <div class="mvu-simple-card live-card map-side-card clickable" data-preview="当前节点详情"></div>
              <div class="mvu-simple-card entry-card map-side-card clickable" data-preview="图层控制与跑图"></div>
              <div class="mvu-simple-card live-card map-side-card clickable" data-preview="动态地点与扩展节点"></div>
            </div>
          </div>

          <div class="split-page split-right-page" :class="{ active: tabState.current === 'page-world' }" data-target="page-world">
            <div class="stack-3">
              <div class="mvu-simple-card live-card clickable" data-preview="编年史档案"></div>
              <div class="mvu-simple-card entry-card" data-rank-card="天道金榜"></div>
              <div class="mvu-simple-card live-card clickable" data-preview="拍卖与警报"></div>
            </div>
          </div>

          <div class="split-page split-right-page" :class="{ active: tabState.current === 'page-org' }" data-target="page-org">
            <div class="stack-3">
              <div class="mvu-simple-card live-card clickable" data-preview="我的阵营详情"></div>
              <div class="mvu-simple-card live-card clickable" data-preview="本地据点详情"></div>
            </div>
          </div>

          <div class="split-page split-right-page" :class="{ active: tabState.current === 'page-terminal' }" data-target="page-terminal">
            <div class="stack-3 terminal-side-stack">
              <div class="mvu-simple-card entry-card terminal-side-card clickable" data-preview="试炼与情报"></div>
              <div class="mvu-simple-card live-card terminal-side-card clickable" data-preview="怪物图鉴"></div>
              <div class="mvu-simple-card live-card terminal-side-card clickable" data-preview="任务界面"></div>
            </div>
          </div>
        </div>

        <div class="footer-tabs split-footer-tabs split-side-tabs-right" id="splitFooterTabsRight">
          <button
            v-for="tab in tabs"
            :key="'right-tab-' + tab.id"
            class="mvu-tab-btn"
            :class="{ active: tabState.current === tab.id }"
            :data-target="tab.id"
            @click="setTab(tab.id)"
          >{{ tab.label }}</button>
        </div>
      </div>
      <button
        type="button"
        class="mvu-fold-btn right-btn"
        :title="isFolded ? '展开右侧栏' : '折叠右侧栏'"
        @mouseenter="unfold"
        @click.stop="toggleFold"
      >{{ isFolded ? '‹' : '›' }}</button>
    </div>
  `,
  setup() {
    const isFolded = mvuFoldState;
    const isPinned = mvuPinState;
    const settingsOpen = ref(false);
    const fold = handleGlobalFold;
    const unfold = handleGlobalUnfold;
    const toggleFold = () => { isFolded.value = !isFolded.value; };
    const togglePin = () => { isPinned.value = !isPinned.value; };
    const toggleSettings = () => {
      settingsOpen.value = !settingsOpen.value;
    };
    const setLayoutByPanel = mode => {
      setLayoutMode(mode);
      settingsOpen.value = false;
    };
    return {
      isFolded,
      isPinned,
      settingsOpen,
      fold,
      unfold,
      toggleFold,
      togglePin,
      toggleSettings,
      setLayoutByPanel,
      tabState: mvuTabState,
      tabs: TAB_ITEMS,
      layoutState: mvuLayoutState,
      setTab: requestTabChange
    };
  }
};

const UnifiedDock = {
  template: `
    <div class="mvu-unified-wrapper mvu-root">
      <div class="mvu-unified-dock">
        <div class="mvu-unified-layout-toggle">
          <button
            type="button"
            class="mvu-unified-layout-btn"
            :class="{ active: layoutState.preferredMode === 'split' }"
            @click="setLayout('split')"
          >分栏</button>
          <button
            type="button"
            class="mvu-unified-layout-btn"
            :class="{ active: layoutState.preferredMode === 'unified' }"
            @click="setLayout('unified')"
          >一体</button>
        </div>

        <div class="mvu-unified-tab-row">
          <button
            v-for="tab in tabs"
            :key="'unified-tab-' + tab.id"
            class="mvu-tab-btn mvu-unified-tab-btn"
            :class="{ active: tabState.current === tab.id }"
            :data-target="tab.id"
            @click="setTab(tab.id)"
          >{{ tab.label }}</button>
        </div>

        <div class="mvu-unified-action-row">
          <button
            v-for="item in quickActions"
            :key="'unified-action-' + item.preview"
            type="button"
            class="mvu-unified-action-btn clickable"
            :data-preview="item.preview"
          >{{ item.label }}</button>
        </div>
      </div>
    </div>
  `,
  setup() {
    const quickActions = computed(() => resolveUnifiedActions(mvuTabState.current));
    return {
      tabs: TAB_ITEMS,
      quickActions,
      tabState: mvuTabState,
      layoutState: mvuLayoutState,
      setTab: requestTabChange,
      setLayout: setLayoutMode
    };
  }
};

function ensureUnifiedMountNode() {
  let unifiedMount = document.getElementById('mvu-unified-mount');
  if (!unifiedMount && document.body) {
    unifiedMount = document.createElement('div');
    unifiedMount.id = 'mvu-unified-mount';
    document.body.appendChild(unifiedMount);
  }
  if (unifiedMount) {
    unifiedMount.style.position = 'relative';
    unifiedMount.style.width = '100%';
    unifiedMount.style.pointerEvents = 'auto';
    unifiedMount.style.zIndex = '1000';
  }
  return unifiedMount;
}

function ensureUnifiedDockMounted() {
  const unifiedMount = ensureUnifiedMountNode();
  if (!unifiedMount) return null;
  if (!unifiedMount.__mvuVueMounted) {
    createApp(UnifiedDock).mount(unifiedMount);
    unifiedMount.__mvuVueMounted = true;
  }
  return unifiedMount;
}

function mountMvuVue() {
  const leftMount = document.getElementById('mvu-left-mount');
  const rightMount = document.getElementById('mvu-right-mount');
  const unifiedMount = ensureUnifiedDockMounted();

  if (leftMount && !leftMount.__mvuVueMounted) {
    createApp(LeftPanel).mount(leftMount);
    leftMount.__mvuVueMounted = true;
  }

  if (rightMount && !rightMount.__mvuVueMounted) {
    createApp(RightPanel).mount(rightMount);
    rightMount.__mvuVueMounted = true;
  }

  if (window.__MVU_UNIFIED_ANCHOR_MANAGER__ && typeof window.__MVU_UNIFIED_ANCHOR_MANAGER__.stop === 'function') {
    try { window.__MVU_UNIFIED_ANCHOR_MANAGER__.stop(); } catch (err) {}
  }
  const anchorManager = createUnifiedAnchorManager({
    mountId: 'mvu-unified-mount',
    onReadyChange: isReady => {
      mvuLayoutState.unifiedAnchorReady = !!isReady;
      syncLayoutMode();
    }
  });
  window.__MVU_UNIFIED_ANCHOR_MANAGER__ = anchorManager;
  anchorManager.start();

  refreshViewportState();
  syncLayoutMode();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountMvuVue);
} else {
  mountMvuVue();
}
