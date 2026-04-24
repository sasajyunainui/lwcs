const { createApp, ref, reactive, computed, watch, onMounted, onUnmounted } = Vue;

const TAB_ITEMS = [
  {
    id: 'page-archive',
    label: '档案',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5.5h10l2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-11l2-2Z"></path><path d="M9 5.5V4h6v1.5"></path><path d="M9 11h6"></path><path d="M9 15h6"></path></svg>'
  },
  {
    id: 'page-map',
    label: '星图',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7.5 12 4l7 3.5v9L12 20l-7-3.5z"></path><path d="M12 4v16"></path><path d="m5 7.5 7 3.5 7-3.5"></path></svg>'
  },
  {
    id: 'page-world',
    label: '世界',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M4 12h16"></path><path d="M12 4a12 12 0 0 1 0 16"></path><path d="M12 4a12 12 0 0 0 0 16"></path></svg>'
  },
  {
    id: 'page-org',
    label: '势力',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16"></path><path d="M8 5h8l-1.5 3L16 11H8z"></path><path d="M7 20h10"></path></svg>'
  },
  {
    id: 'page-terminal',
    label: '终端',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="m8 10 2 2-2 2"></path><path d="M12.5 15h3.5"></path></svg>'
  }
];

const UNIFIED_ACTION_ITEMS = {
  'page-archive': [
    { label: '角色', preview: '角色切换器' },
    { label: '武装', preview: '武装工坊详细页' },
    { label: '仓库', preview: '储物仓库详细页' }
  ],
  'page-map': [
    { label: '节点', preview: '当前节点详情' },
    { label: '跑图', preview: '图层控制与跑图' },
    { label: '星图', preview: '全息星图主画布' }
  ],
  'page-world': [
    { label: '时间线', preview: '编年史档案' },
    { label: '警报', preview: '拍卖与警报' }
  ],
  'page-org': [
    { label: '阵营', preview: '我的阵营详情' },
    { label: '据点', preview: '本地据点详情' }
  ],
  'page-terminal': [
    { label: '情报', preview: '试炼与情报' },
    { label: '任务', preview: '任务界面' },
    { label: '图鉴', preview: '怪物图鉴' }
  ]
};

const UNIFIED_TAB_META = {
  'page-archive': {
    eyebrow: '角色主栏',
    title: '档案总览',
    desc: '把生命、武魂、武装与社交入口收进一条纵向操作线。'
  },
  'page-map': {
    eyebrow: '地图主栏',
    title: '星图调度',
    desc: '优先保留当前位置、节点详情与跑图动作，移动端也能顺手点。'
  },
  'page-world': {
    eyebrow: '世界主栏',
    title: '世界追踪',
    desc: '把编年、警报和榜单入口压进一屏，少翻找、少横跳。'
  },
  'page-org': {
    eyebrow: '势力主栏',
    title: '阵营工作台',
    desc: '矩阵总览与自身阵营信息集中放在同一组入口里。'
  },
  'page-terminal': {
    eyebrow: '终端主栏',
    title: '终端摘要',
    desc: '系统播报、情报与任务维持单栏顺序，适合桌面和手机快速切换。'
  }
};

const SHELL_APP_ITEMS = [
  {
    id: 'page-archive',
    title: '档案库',
    hint: '角色 · 武魂 · 武装',
    homeSlot: 'home-archive'
  },
  {
    id: 'page-map',
    title: '星图台',
    hint: '节点 · 跑图 · 动态',
    homeSlot: 'home-map'
  },
  {
    id: 'page-world',
    title: '世界簿',
    hint: '编年 · 警报 · 追踪',
    homeSlot: 'home-world'
  },
  {
    id: 'page-org',
    title: '势力站',
    hint: '阵营 · 据点 · 关系',
    homeSlot: 'home-org'
  },
  {
    id: 'page-terminal',
    title: '终端台',
    hint: '情报 · 任务 · 图鉴',
    homeSlot: 'home-terminal'
  }
];

const LAYOUT_STORAGE_KEY = 'mvu_layout_mode';
const SURFACE_MODE_STORAGE_KEY = 'mvu_surface_mode_v1';
const SURFACE_LAUNCHER_STORAGE_KEY = 'mvu_surface_launcher_pos_v2';
const MOBILE_LAST_TAB_STORAGE_KEY = 'mvu_mobile_shell_last_tab_v1';
const MOBILE_VIEWPORT_MEDIA = '(max-width: 860px)';
const VALID_LAYOUT_MODES = new Set(['split', 'unified']);
const VALID_SURFACE_MODES = new Set(['panel', 'shell']);
const SURFACE_LAUNCHER_GAP = 12;
const SURFACE_LAUNCHER_DRAG_THRESHOLD = 8;
const SURFACE_LAUNCHER_MOBILE_SIZE = { width: 56, height: 56 };
const SURFACE_LAUNCHER_DESKTOP_SIZE = { width: 118, height: 56 };

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

function normalizeSurfaceMode(mode) {
  const value = String(mode || '').trim();
  return VALID_SURFACE_MODES.has(value) ? value : '';
}

function normalizeTabId(tabId) {
  const value = String(tabId || '').trim();
  return TAB_ITEMS.some(tab => tab.id === value) ? value : 'page-archive';
}

function readJsonStorage(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function writeJsonStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {}
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

function readSurfaceModeStorage() {
  try {
    return normalizeSurfaceMode(window.localStorage.getItem(SURFACE_MODE_STORAGE_KEY));
  } catch (err) {
    return '';
  }
}

function writeSurfaceModeStorage(mode) {
  const normalized = normalizeSurfaceMode(mode);
  if (!normalized) return;
  try {
    window.localStorage.setItem(SURFACE_MODE_STORAGE_KEY, normalized);
  } catch (err) {}
}

function readMobileLastTabStorage() {
  try {
    return normalizeTabId(window.localStorage.getItem(MOBILE_LAST_TAB_STORAGE_KEY));
  } catch (err) {
    return 'page-archive';
  }
}

function writeMobileLastTabStorage(tabId) {
  const normalized = normalizeTabId(tabId);
  try {
    window.localStorage.setItem(MOBILE_LAST_TAB_STORAGE_KEY, normalized);
  } catch (err) {}
}

function normalizeSurfaceLauncherPosition(rawPosition) {
  if (!rawPosition || typeof rawPosition !== 'object') return null;
  const x = Number(rawPosition.x);
  const y = Number(rawPosition.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

function normalizeSurfaceLauncherStorage(rawStorage) {
  if (!rawStorage || typeof rawStorage !== 'object') {
    return { desktop: null, mobile: null };
  }
  return {
    desktop: normalizeSurfaceLauncherPosition(rawStorage.desktop),
    mobile: normalizeSurfaceLauncherPosition(rawStorage.mobile)
  };
}

function getSurfaceLauncherViewportKey(viewportType = null) {
  const value = String(viewportType || '').trim();
  if (value === 'desktop' || value === 'mobile') return value;
  return mvuLayoutState && mvuLayoutState.isMobileViewport ? 'mobile' : 'desktop';
}

function readSurfaceLauncherStorage() {
  return normalizeSurfaceLauncherStorage(readJsonStorage(SURFACE_LAUNCHER_STORAGE_KEY));
}

function readSurfaceLauncherPosition(viewportType = null) {
  const key = getSurfaceLauncherViewportKey(viewportType);
  return readSurfaceLauncherStorage()[key];
}

function writeSurfaceLauncherPosition(position, viewportType = null) {
  const normalized = normalizeSurfaceLauncherPosition(position);
  if (!normalized) return;
  const key = getSurfaceLauncherViewportKey(viewportType);
  const current = readSurfaceLauncherStorage();
  current[key] = {
    x: Math.round(normalized.x),
    y: Math.round(normalized.y)
  };
  writeJsonStorage(SURFACE_LAUNCHER_STORAGE_KEY, current);
}

function resolveUnifiedActions(tabId) {
  return UNIFIED_ACTION_ITEMS[tabId] || UNIFIED_ACTION_ITEMS['page-archive'] || [];
}

function resolveUnifiedTabMeta(tabId) {
  return UNIFIED_TAB_META[tabId] || UNIFIED_TAB_META['page-archive'];
}

function resolveShellAppMeta(tabId) {
  return SHELL_APP_ITEMS.find(item => item.id === tabId) || SHELL_APP_ITEMS[0];
}

const persistedLayoutMode = readLayoutModeStorage();
const persistedSurfaceMode = readSurfaceModeStorage();
const initialIsMobileViewport = detectMobileViewport();
const mvuLayoutState = window.__MVU_LAYOUT_STATE__ || (window.__MVU_LAYOUT_STATE__ = reactive({
  preferredMode: persistedLayoutMode || 'split',
  effectiveMode: 'split',
  unifiedAnchorReady: false,
  isMobileViewport: initialIsMobileViewport,
  hasManualOverride: !!persistedLayoutMode,
  surfaceMode: initialIsMobileViewport ? 'shell' : (persistedSurfaceMode || 'panel'),
  mobileShellOpen: false,
  surfaceLauncherMenuOpen: false,
  surfaceLauncherPosition: readSurfaceLauncherPosition(initialIsMobileViewport ? 'mobile' : 'desktop'),
  surfaceLauncherDragging: false
}));

if (!('hasManualOverride' in mvuLayoutState)) {
  mvuLayoutState.hasManualOverride = !!persistedLayoutMode;
}
if (!('unifiedAnchorReady' in mvuLayoutState)) {
  mvuLayoutState.unifiedAnchorReady = false;
}
if (!('mobileShellOpen' in mvuLayoutState)) {
  mvuLayoutState.mobileShellOpen = false;
}
if (!('surfaceMode' in mvuLayoutState)) {
  mvuLayoutState.surfaceMode = initialIsMobileViewport ? 'shell' : (persistedSurfaceMode || 'panel');
}
if (!('surfaceLauncherMenuOpen' in mvuLayoutState)) {
  mvuLayoutState.surfaceLauncherMenuOpen = false;
}
if (!('surfaceLauncherPosition' in mvuLayoutState)) {
  mvuLayoutState.surfaceLauncherPosition = readSurfaceLauncherPosition(initialIsMobileViewport ? 'mobile' : 'desktop');
}
if (!('surfaceLauncherDragging' in mvuLayoutState)) {
  mvuLayoutState.surfaceLauncherDragging = false;
}
if (!normalizeLayoutMode(mvuLayoutState.preferredMode)) {
  mvuLayoutState.preferredMode = persistedLayoutMode || (mvuLayoutState.isMobileViewport ? 'unified' : 'split');
}
if (!mvuLayoutState.hasManualOverride) {
  mvuLayoutState.preferredMode = mvuLayoutState.isMobileViewport ? 'unified' : 'split';
}
if (!normalizeSurfaceMode(mvuLayoutState.surfaceMode)) {
  mvuLayoutState.surfaceMode = mvuLayoutState.isMobileViewport ? 'shell' : (persistedSurfaceMode || 'panel');
}
if (mvuLayoutState.isMobileViewport) {
  mvuLayoutState.surfaceMode = 'shell';
}
if (!mvuLayoutState.isMobileViewport) {
  mvuLayoutState.mobileShellOpen = false;
}

const mvuTabState = window.__MVU_TAB_STATE__ || (window.__MVU_TAB_STATE__ = reactive({ current: readMobileLastTabStorage() }));
const mvuFoldState = window.__MVU_SIDE_FOLD_STATE__ || (window.__MVU_SIDE_FOLD_STATE__ = ref(true));
const mvuPinState = window.__MVU_PIN_STATE__ || (window.__MVU_PIN_STATE__ = ref(false));

if (!mvuLayoutState.surfaceLauncherPosition || !Number.isFinite(Number(mvuLayoutState.surfaceLauncherPosition.x)) || !Number.isFinite(Number(mvuLayoutState.surfaceLauncherPosition.y))) {
  mvuLayoutState.surfaceLauncherPosition = readSurfaceLauncherPosition(initialIsMobileViewport ? 'mobile' : 'desktop');
}
mvuTabState.current = normalizeTabId(mvuTabState.current);

function getViewportSize() {
  const width = Math.max(0, Number(window.innerWidth) || Number(document.documentElement?.clientWidth) || 0);
  const height = Math.max(0, Number(window.innerHeight) || Number(document.documentElement?.clientHeight) || 0);
  return { width, height };
}

function getSurfaceLauncherSize(viewportType = null) {
  return getSurfaceLauncherViewportKey(viewportType) === 'mobile'
    ? { ...SURFACE_LAUNCHER_MOBILE_SIZE }
    : { ...SURFACE_LAUNCHER_DESKTOP_SIZE };
}

function getSurfaceLauncherBounds(options = {}) {
  const viewportType = getSurfaceLauncherViewportKey(options.viewportType);
  const size = options.size || getSurfaceLauncherSize(viewportType);
  const viewport = getViewportSize();
  const safeGap = SURFACE_LAUNCHER_GAP;
  let minY = safeGap;
  let maxY = Math.max(minY, viewport.height - size.height - safeGap);
  let minX = safeGap;
  let maxX = Math.max(minX, viewport.width - size.width - safeGap);

  const topToolbar = Array.from(document.querySelectorAll('body > *')).find(node => {
    if (!(node instanceof Element) || node.id === 'mvu-unified-mount' || node.id === 'detailModal') return false;
    const style = window.getComputedStyle(node);
    if (!style || style.display === 'none' || style.visibility === 'hidden') return false;
    if (style.position !== 'fixed' && style.position !== 'sticky') return false;
    const rect = node.getBoundingClientRect();
    return rect.top <= 4 && rect.height >= 36 && rect.width >= viewport.width * 0.5;
  });
  if (topToolbar) {
    minY = Math.max(minY, topToolbar.getBoundingClientRect().bottom + safeGap);
  }

  const sendForm = document.getElementById('send_form');
  if (sendForm) {
    const rect = sendForm.getBoundingClientRect();
    if (rect.height > 0) {
      maxY = Math.min(maxY, rect.top - size.height - safeGap);
    }
  }

  return {
    minX,
    maxX: Math.max(minX, maxX),
    minY,
    maxY: Math.max(minY, maxY)
  };
}

function clampSurfaceLauncherPosition(position, options = {}) {
  const bounds = getSurfaceLauncherBounds(options);
  const nextX = Number(position && position.x);
  const nextY = Number(position && position.y);
  const fallbackX = bounds.minX;
  const fallbackY = bounds.maxY;
  return {
    x: _.clamp(Number.isFinite(nextX) ? nextX : fallbackX, bounds.minX, bounds.maxX),
    y: _.clamp(Number.isFinite(nextY) ? nextY : fallbackY, bounds.minY, bounds.maxY)
  };
}

function getDefaultSurfaceLauncherPosition(viewportType = null) {
  const resolvedViewportType = getSurfaceLauncherViewportKey(viewportType);
  const bounds = getSurfaceLauncherBounds({ viewportType: resolvedViewportType });
  if (resolvedViewportType === 'mobile') {
    const optionsButton = document.getElementById('options_button');
    const preferredX = optionsButton ? optionsButton.getBoundingClientRect().left : bounds.minX;
    return clampSurfaceLauncherPosition({
      x: preferredX,
      y: bounds.maxY
    }, { viewportType: resolvedViewportType });
  }
  return clampSurfaceLauncherPosition({
    x: bounds.maxX,
    y: bounds.maxY
  }, { viewportType: resolvedViewportType });
}

function syncSurfaceLauncherPosition(options = {}) {
  const forceDefault = !!options.forceDefault;
  const viewportType = getSurfaceLauncherViewportKey(options.viewportType);
  const current = !forceDefault && mvuLayoutState.surfaceLauncherPosition
    ? mvuLayoutState.surfaceLauncherPosition
    : null;
  const stored = !forceDefault && readSurfaceLauncherPosition(viewportType);
  const nextPosition = clampSurfaceLauncherPosition(current || stored || getDefaultSurfaceLauncherPosition(viewportType), { viewportType });
  mvuLayoutState.surfaceLauncherPosition = nextPosition;
  if (options.persist !== false) {
    writeSurfaceLauncherPosition(nextPosition, viewportType);
  }
  return nextPosition;
}

function resolveSurfaceLauncherDisplayPosition(position = null) {
  const viewportType = getSurfaceLauncherViewportKey();
  const basePosition = clampSurfaceLauncherPosition(
    position || mvuLayoutState.surfaceLauncherPosition || getDefaultSurfaceLauncherPosition(viewportType),
    { viewportType }
  );
  if (viewportType === 'mobile' || mvuLayoutState.surfaceMode !== 'shell' || !mvuLayoutState.mobileShellOpen) {
    return basePosition;
  }
  const bounds = getSurfaceLauncherBounds({ viewportType });
  const midpointX = (bounds.minX + bounds.maxX) / 2;
  return {
    x: basePosition.x >= midpointX ? bounds.maxX : bounds.minX,
    y: _.clamp(basePosition.y, bounds.minY, bounds.maxY)
  };
}

function closeDetailModalIfPossible() {
  if (typeof window.__MVU_CLOSE_DETAIL_MODAL__ === 'function') {
    try { window.__MVU_CLOSE_DETAIL_MODAL__(); } catch (err) {}
  }
}

function isShellSurfaceMode() {
  return !!mvuLayoutState.isMobileViewport || mvuLayoutState.surfaceMode === 'shell';
}

function isDesktopShellMode() {
  return !mvuLayoutState.isMobileViewport && mvuLayoutState.surfaceMode === 'shell';
}

function getDesktopModeSelection() {
  if (mvuLayoutState.isMobileViewport) return 'shell';
  return mvuLayoutState.surfaceMode === 'shell' ? 'shell' : mvuLayoutState.preferredMode;
}

function setMobileShellOpen(nextOpen) {
  const nextValue = !!nextOpen;
  if (!nextValue && mvuLayoutState.mobileShellOpen) {
    closeDetailModalIfPossible();
  }
  mvuLayoutState.mobileShellOpen = nextValue;
  mvuLayoutState.surfaceLauncherDragging = false;
  mvuLayoutState.surfaceLauncherMenuOpen = false;
  applyLayoutBodyClasses();
  if (typeof window.__MVU_SYNC_DETAIL_MODAL_HOST__ === 'function') {
    try { window.__MVU_SYNC_DETAIL_MODAL_HOST__(); } catch (err) {}
  }
  return mvuLayoutState.mobileShellOpen;
}

window.__MVU_SET_MOBILE_SHELL_OPEN__ = value => setMobileShellOpen(value);

function syncUnifiedMountPlacement() {
  if (window.__MVU_UNIFIED_ANCHOR_MANAGER__ && typeof window.__MVU_UNIFIED_ANCHOR_MANAGER__.scheduleRelocate === 'function') {
    window.__MVU_UNIFIED_ANCHOR_MANAGER__.scheduleRelocate();
  }
}

function setSurfaceMode(mode, options = {}) {
  const normalized = normalizeSurfaceMode(mode);
  const nextValue = mvuLayoutState.isMobileViewport ? 'shell' : (normalized || 'panel');
  const previousValue = normalizeSurfaceMode(mvuLayoutState.surfaceMode) || (mvuLayoutState.isMobileViewport ? 'shell' : 'panel');
  const hasOpenOption = Object.prototype.hasOwnProperty.call(options, 'open');
  if (previousValue === nextValue) {
    if (nextValue === 'panel') {
      if (mvuLayoutState.mobileShellOpen) {
        closeDetailModalIfPossible();
      }
      mvuLayoutState.mobileShellOpen = false;
    } else if (hasOpenOption) {
      setMobileShellOpen(!!options.open);
      return nextValue;
    }
    applyLayoutBodyClasses();
    return nextValue;
  }

  if ((nextValue === 'panel' || (nextValue === 'shell' && hasOpenOption && !options.open)) && mvuLayoutState.mobileShellOpen) {
    closeDetailModalIfPossible();
  }

  mvuLayoutState.surfaceMode = nextValue;
  mvuLayoutState.surfaceLauncherDragging = false;
  mvuLayoutState.surfaceLauncherMenuOpen = false;
  if (nextValue === 'panel') {
    mvuLayoutState.mobileShellOpen = false;
  } else if (hasOpenOption) {
    mvuLayoutState.mobileShellOpen = !!options.open;
  } else if (!mvuLayoutState.isMobileViewport) {
    mvuLayoutState.mobileShellOpen = false;
  }

  if (!mvuLayoutState.isMobileViewport && options.manual !== false) {
    writeSurfaceModeStorage(nextValue);
  }

  syncUnifiedMountPlacement();
  applyLayoutBodyClasses();
  if (typeof window.__MVU_SYNC_DETAIL_MODAL_HOST__ === 'function') {
    try { window.__MVU_SYNC_DETAIL_MODAL_HOST__(); } catch (err) {}
  }
  return nextValue;
}

function openShellSurface() {
  if (!mvuLayoutState.isMobileViewport) {
    if (mvuLayoutState.surfaceMode !== 'shell') {
      setSurfaceMode('shell', { open: false });
    }
    return setMobileShellOpen(true);
  }
  return setMobileShellOpen(true);
}

function closeShellSurface() {
  return setMobileShellOpen(false);
}

function exitShellSurface() {
  if (mvuLayoutState.mobileShellOpen) {
    closeDetailModalIfPossible();
  }
  return setSurfaceMode('panel');
}

function toggleShellSurface() {
  return mvuLayoutState.mobileShellOpen ? closeShellSurface() : openShellSurface();
}

function setDesktopMode(mode, options = {}) {
  const value = String(mode || '').trim();
  if (value === 'shell') {
    return setSurfaceMode('shell', { ...options, open: false });
  }
  setSurfaceMode('panel', options);
  return setLayoutMode(value, options);
}

function applyLayoutBodyClasses() {
  const body = document.body;
  if (!body) return;
  const shellSurfaceMode = isShellSurfaceMode();
  body.classList.toggle('mvu-layout-split', mvuLayoutState.effectiveMode === 'split');
  body.classList.toggle('mvu-layout-unified', mvuLayoutState.effectiveMode === 'unified');
  body.classList.toggle('mvu-mobile-viewport', !!mvuLayoutState.isMobileViewport);
  body.classList.toggle('mvu-shell-overlay-enabled', true);
  body.classList.toggle('mvu-surface-panel', !shellSurfaceMode);
  body.classList.toggle('mvu-surface-shell', shellSurfaceMode);
  body.classList.toggle('mvu-desktop-shell-surface', !mvuLayoutState.isMobileViewport && mvuLayoutState.surfaceMode === 'shell');
  body.classList.toggle('mvu-layout-unified-locked', !!mvuLayoutState.isMobileViewport);
  body.classList.toggle('mvu-mobile-shell-open', !!mvuLayoutState.mobileShellOpen);
  body.classList.toggle('mvu-surface-launcher-menu-open', !!mvuLayoutState.surfaceLauncherMenuOpen);
  body.classList.toggle('mvu-mobile-shell-dragging', !!mvuLayoutState.surfaceLauncherDragging);
}

function isSplitLayoutAllowed() {
  return !mvuLayoutState.isMobileViewport;
}

function resolveEffectiveLayoutMode() {
  if (mvuLayoutState.isMobileViewport) {
    return mvuLayoutState.unifiedAnchorReady ? 'unified' : 'split';
  }
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
  const nextPreferred = normalized === 'split' && !isSplitLayoutAllowed() ? 'unified' : normalized;

  if (!mvuLayoutState.isMobileViewport && mvuLayoutState.surfaceMode === 'shell') {
    if (mvuLayoutState.mobileShellOpen) {
      closeDetailModalIfPossible();
    }
    mvuLayoutState.surfaceMode = 'panel';
    mvuLayoutState.mobileShellOpen = false;
    if (options.manual !== false) {
      writeSurfaceModeStorage('panel');
    }
  }

  mvuLayoutState.preferredMode = nextPreferred;
  mvuLayoutState.surfaceLauncherMenuOpen = false;
  mvuLayoutState.surfaceLauncherDragging = false;
  if (options.manual !== false) {
    mvuLayoutState.hasManualOverride = true;
    writeLayoutModeStorage(nextPreferred);
  }
  if (nextPreferred === 'unified' && window.__MVU_UNIFIED_ANCHOR_MANAGER__ && typeof window.__MVU_UNIFIED_ANCHOR_MANAGER__.scheduleRelocate === 'function') {
    window.__MVU_UNIFIED_ANCHOR_MANAGER__.scheduleRelocate();
  }
  return syncLayoutMode();
}

function getLayoutMode() {
  return mvuLayoutState.effectiveMode;
}

function refreshViewportState() {
  const nextMobileState = detectMobileViewport();
  const previousMobileState = !!mvuLayoutState.isMobileViewport;
  if (mvuLayoutState.isMobileViewport !== nextMobileState) {
    mvuLayoutState.isMobileViewport = nextMobileState;
  }
  if (!mvuLayoutState.hasManualOverride) {
    mvuLayoutState.preferredMode = nextMobileState ? 'unified' : 'split';
  }
  if (nextMobileState) {
    mvuLayoutState.surfaceMode = 'shell';
    mvuLayoutState.surfaceLauncherMenuOpen = false;
    mvuLayoutState.surfaceLauncherPosition = readSurfaceLauncherPosition('mobile');
    syncSurfaceLauncherPosition({ persist: true, viewportType: 'mobile' });
  } else if (previousMobileState) {
    const nextDesktopSurface = readSurfaceModeStorage() || 'panel';
    mvuLayoutState.surfaceMode = nextDesktopSurface;
    mvuLayoutState.surfaceLauncherMenuOpen = false;
    if (mvuLayoutState.mobileShellOpen) {
      closeDetailModalIfPossible();
    }
    mvuLayoutState.mobileShellOpen = false;
    mvuLayoutState.surfaceLauncherPosition = readSurfaceLauncherPosition('desktop');
    syncSurfaceLauncherPosition({ persist: true, viewportType: 'desktop' });
  }
  syncUnifiedMountPlacement();
  syncLayoutMode();
  if (typeof window.__MVU_SYNC_DETAIL_MODAL_HOST__ === 'function') {
    try { window.__MVU_SYNC_DETAIL_MODAL_HOST__(); } catch (err) {}
  }
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
window.mvuSetSurfaceMode = mode => setSurfaceMode(mode, { manual: true });
window.mvuGetDesktopMode = () => getDesktopModeSelection();
window.mvuSetDesktopMode = mode => setDesktopMode(mode, { manual: true });

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
  mvuTabState.current = normalizeTabId(target);
}

window.__MVU_SET_TAB_STATE__ = setSharedTab;

function requestTabChange(target) {
  const next = normalizeTabId(target);
  setSharedTab(next);
  writeMobileLastTabStorage(next);
  if (typeof window.mvuSetMainTabExternal === 'function') {
    window.mvuSetMainTabExternal(next);
  } else if (typeof window.mvuSetMainTab === 'function') {
    window.mvuSetMainTab(next);
  }
}

function applyUnifiedMountHostStyle(mountEl) {
  if (!mountEl) return;
  const shouldUseOverlayHost = isShellSurfaceMode() || mvuLayoutState.effectiveMode !== 'unified';
  if (shouldUseOverlayHost) {
    mountEl.style.position = 'fixed';
    mountEl.style.inset = '0';
    mountEl.style.width = '100vw';
    mountEl.style.height = '100dvh';
    mountEl.style.pointerEvents = 'none';
    mountEl.style.zIndex = '10040';
  } else {
    mountEl.style.position = 'relative';
    mountEl.style.inset = '';
    mountEl.style.width = '100%';
    mountEl.style.height = '';
    mountEl.style.pointerEvents = 'auto';
    mountEl.style.zIndex = '1000';
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
    if (!mountEl) {
      setReadyState(false);
      return;
    }
    applyUnifiedMountHostStyle(mountEl);
    const shouldUseOverlayHost = isShellSurfaceMode() || mvuLayoutState.effectiveMode !== 'unified';
    if (shouldUseOverlayHost) {
      if (document.body && mountEl.parentElement !== document.body) {
        document.body.appendChild(mountEl);
      }
      setReadyState(!!mountEl.isConnected);
      return;
    }
    if (!chatEl || !chatEl.isConnected) {
      if (document.body && mountEl.parentElement !== document.body) {
        document.body.appendChild(mountEl);
      }
      setReadyState(!!mountEl.isConnected);
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
          <div v-if="layoutState.isMobileViewport" class="mvu-window-settings-note">移动端固定使用小手机壳，桌面端可切换分栏、一体或手机模式。</div>
          <button
            v-if="!layoutState.isMobileViewport"
            type="button"
            class="mvu-window-settings-option"
            :class="{ active: desktopMode === 'split' }"
            @click="setLayoutByPanel('split')"
          >分栏模式</button>
          <button
            v-if="!layoutState.isMobileViewport"
            type="button"
            class="mvu-window-settings-option"
            :class="{ active: desktopMode === 'unified' }"
            @click="setLayoutByPanel('unified')"
          >一体模式</button>
          <button
            v-if="!layoutState.isMobileViewport"
            type="button"
            class="mvu-window-settings-option"
            :class="{ active: desktopMode === 'shell' }"
            @click="setLayoutByPanel('shell')"
          >手机模式</button>
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
      setDesktopMode(mode);
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
      desktopMode,
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
        <div class="mvu-unified-hero">
          <div class="mvu-unified-hero-top">
            <div class="mvu-unified-status">
              <span class="mvu-unified-eyebrow">{{ activeMeta.eyebrow }}</span>
              <span class="mvu-unified-mode-badge">{{ modeBadge }}</span>
            </div>
            <div class="mvu-unified-layout-toggle" :class="{ locked: splitLocked }">
              <template v-if="!splitLocked">
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
              </template>
              <span v-else class="mvu-unified-lock-note">移动端已锁定一体栏</span>
            </div>
          </div>
          <div class="mvu-unified-headline">
            <strong>{{ activeMeta.title }}</strong>
            <span>{{ activeMeta.desc }}</span>
          </div>
        </div>

        <div class="mvu-unified-section-head">
          <b>主分栏</b>
          <span>先切页，再下钻详细弹窗</span>
        </div>

        <div class="mvu-unified-tab-grid">
          <button
            v-for="tab in tabs"
            :key="'unified-tab-' + tab.id"
            class="mvu-tab-btn mvu-unified-tab-btn mvu-unified-grid-btn"
            :class="{ active: tabState.current === tab.id }"
            :data-target="tab.id"
            @click="setTab(tab.id)"
          >{{ tab.label }}</button>
        </div>

        <div class="mvu-unified-section-head">
          <b>当前页快捷入口</b>
          <span>{{ quickActionHint }}</span>
        </div>

        <div class="mvu-unified-action-grid">
          <button
            v-for="item in quickActions"
            :key="'unified-action-' + item.preview"
            type="button"
            class="mvu-unified-action-btn mvu-unified-grid-btn clickable"
            :data-preview="item.preview"
          >{{ item.label }}</button>
        </div>
      </div>
    </div>
  `,
  setup() {
    const quickActions = computed(() => resolveUnifiedActions(mvuTabState.current));
    const activeMeta = computed(() => resolveUnifiedTabMeta(mvuTabState.current));
    const modeBadge = computed(() => (mvuLayoutState.isMobileViewport ? '移动端一体栏' : '桌面一体栏'));
    const quickActionHint = computed(() => `${quickActions.value.length || 0} 个入口`);
    return {
      tabs: TAB_ITEMS,
      quickActions,
      activeMeta,
      splitLocked,
      modeBadge,
      quickActionHint,
      tabState: mvuTabState,
      layoutState: mvuLayoutState,
      setTab: requestTabChange,
      setLayout: setLayoutMode
    };
  }
};

const MobileUnifiedLayout = {
  template: `
    <div class="mvu-mobile-shell-host mvu-root" :class="{ 'is-open': layoutState.mobileShellOpen, 'is-dragging': layoutState.mobileLauncherDragging }">
      <button
        v-if="showMobileLauncher"
        type="button"
        class="mvu-mobile-launcher"
        :class="{ active: shellVisible }"
        :style="launcherStyle"
        aria-label="打开酒馆助手"
        @pointerdown="onLauncherPointerDown"
      >
        <span class="mvu-mobile-launcher-glyph" aria-hidden="true">LW</span>
        <span class="mvu-mobile-launcher-label">{{ launcherLabel }}</span>
      </button>

      <div v-else-if="showDesktopDock" class="mvu-desktop-shell-dock" role="group" aria-label="LWCS shell dock">
        <button
          type="button"
          class="mvu-desktop-shell-dock-main"
          aria-label="Open shell"
          @click="openShell"
        >
          <span class="mvu-desktop-shell-dock-glyph" aria-hidden="true">LW</span>
          <span class="mvu-desktop-shell-dock-copy">
            <strong class="mvu-desktop-shell-dock-title">{{ launcherLabel }}</strong>
            <span class="mvu-desktop-shell-dock-meta">LWCS</span>
          </span>
        </button>
        <button
          type="button"
          class="mvu-desktop-shell-dock-exit"
          aria-label="Back to panel"
          title="Back to panel"
          @click="exitShellMode"
        >
          <span class="mvu-desktop-shell-dock-exit-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="4.5" width="17" height="11" rx="2.5" stroke="currentColor" stroke-width="1.7"></rect>
              <path d="M8 19.5h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path>
              <path d="M12 15.5v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path>
            </svg>
          </span>
        </button>
      </div>

      <div class="mvu-mobile-shell-backdrop" :class="{ active: shellVisible }" @click="handleBackdropClick"></div>

      <section class="mvu-mobile-shell" :class="{ active: shellVisible }" aria-label="酒馆助手手机框架">
        <div ref="shellFrameRef" class="mvu-mobile-shell-frame" :data-screen="shellScreen">
          <header class="mvu-mobile-shell-head">
            <div class="mvu-mobile-shell-head-main">
              <button
                v-if="showHomeBack"
                type="button"
                class="mvu-mobile-shell-back"
                aria-label="返回首页"
                @click="goHome"
              >
                <span aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18 9 12l6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </span>
              </button>
              <div class="mvu-mobile-shell-head-copy">
                <strong class="mvu-mobile-shell-title">{{ activeTitle }}</strong>
              </div>
            </div>
            <div class="mvu-mobile-shell-head-actions">
              <button
                v-if="desktopShellMode"
                type="button"
                class="mvu-mobile-shell-mode-exit"
                aria-label="Back to panel"
                title="Back to panel"
                @click="exitShellMode"
              >
                <span aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3.5" y="4.5" width="17" height="11" rx="2.5" stroke="currentColor" stroke-width="1.7"></rect>
                    <path d="M8 19.5h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path>
                    <path d="M12 15.5v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path>
                  </svg>
                </span>
              </button>
              <button type="button" class="mvu-mobile-shell-close" aria-label="关闭" @click="closeShell">&times;</button>
            </div>
          </header>

          <div class="mvu-mobile-shell-body">
            <div class="mvu-mobile-shell-scroll" :class="{ 'is-home': shellScreen === 'home' }">
              <section v-if="shellScreen === 'home'" class="mvu-mobile-home" data-target="home">
                <div class="mvu-mobile-card mvu-mobile-card--spotlight clickable" data-preview="生命图谱详细页" data-unified-card="archive-core" data-unified-surface="shell"></div>
                <div class="mvu-mobile-app-grid" role="navigation" aria-label="壳内应用入口">
                  <button
                    v-for="app in shellApps"
                    :key="'shell-app-' + app.id"
                    type="button"
                    class="mvu-mobile-app-tile"
                    :data-app="app.id"
                    @click="enterSection(app.id)"
                  >
                    <span class="mvu-mobile-app-icon" aria-hidden="true" v-html="app.icon"></span>
                    <span class="mvu-mobile-app-copy">
                      <strong>{{ app.title }}</strong>
                      <span>{{ app.hint }}</span>
                    </span>
                    <div class="mvu-mobile-app-live" :data-unified-card="app.homeSlot" data-unified-surface="shell"></div>
                  </button>
                </div>
              </section>

              <section v-else class="mvu-mobile-library" :data-target="tabState.current">
                <div class="mvu-mobile-action-rail" role="toolbar" :aria-label="activeTitle + '快捷操作'">
                  <button
                    v-for="item in currentActions"
                    :key="'shell-action-' + item.preview"
                    type="button"
                    class="mvu-mobile-action-pill clickable"
                    :data-preview="item.preview"
                  >{{ item.label }}</button>
                </div>

                <section v-if="tabState.current === 'page-archive'" class="mvu-mobile-library-page" data-target="page-archive">
                  <div class="mvu-mobile-card mvu-mobile-card--hero clickable" data-preview="生命图谱详细页" data-unified-card="archive-core" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card-grid mvu-mobile-card-grid--two">
                    <div class="mvu-mobile-card clickable" data-unified-card="primary-spirit" data-unified-surface="shell"></div>
                    <div class="mvu-mobile-card clickable" data-unified-card="secondary-spirit" data-unified-surface="shell"></div>
                  </div>
                  <div class="mvu-mobile-card clickable" data-preview="武装工坊详细页" data-unified-card="armory" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="储物仓库详细页" data-unified-card="vault" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="社会档案详细页" data-unified-card="social" data-unified-surface="shell"></div>
                </section>

                <section v-if="tabState.current === 'page-map'" class="mvu-mobile-library-page" data-target="page-map">
                  <div class="mvu-mobile-card mvu-mobile-card--hero clickable" data-preview="全息星图主画布" data-unified-card="map-hero" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="当前节点详情" data-unified-card="map-current" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="图层控制与跑图" data-unified-card="map-route" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="动态地点与扩展节点" data-unified-card="map-dynamic" data-unified-surface="shell"></div>
                </section>

                <section v-if="tabState.current === 'page-world'" class="mvu-mobile-library-page" data-target="page-world">
                  <div class="mvu-mobile-card mvu-mobile-card--hero clickable" data-preview="世界状态总览" data-unified-card="world-hero" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="编年史档案" data-unified-card="world-timeline" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="拍卖与警报" data-unified-card="world-alerts" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card" data-unified-card="world-ranks" data-unified-surface="shell"></div>
                </section>

                <section v-if="tabState.current === 'page-org'" class="mvu-mobile-library-page" data-target="page-org">
                  <div class="mvu-mobile-card mvu-mobile-card--hero clickable" data-preview="势力矩阵总览" data-unified-card="org-hero" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="我的阵营详情" data-unified-card="org-faction" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="本地据点详情" data-unified-card="org-node" data-unified-surface="shell"></div>
                </section>

                <section v-if="tabState.current === 'page-terminal'" class="mvu-mobile-library-page" data-target="page-terminal">
                  <div class="mvu-mobile-card mvu-mobile-card--hero clickable" data-preview="系统播报与日志" data-unified-card="terminal-hero" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="试炼与情报" data-unified-card="terminal-intel" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="近期见闻" data-unified-card="terminal-news" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="怪物图鉴" data-unified-card="terminal-bestiary" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="任务界面" data-unified-card="terminal-quest" data-unified-surface="shell"></div>
                </section>
              </section>
            </div>
          </div>

          <nav class="mvu-mobile-shell-nav" aria-label="页面切换">
            <button
              v-for="tab in tabs"
              :key="'mobile-tab-' + tab.id"
              type="button"
              class="mvu-mobile-shell-tab"
              :class="{ active: shellScreen !== 'home' && tabState.current === tab.id }"
              :data-target="tab.id"
              @click="enterSection(tab.id)"
            >
              <span class="mvu-mobile-shell-tab-icon" aria-hidden="true" v-html="tab.icon"></span>
              <span class="mvu-mobile-shell-tab-label">{{ tab.label }}</span>
            </button>
          </nav>

          <div ref="modalHostRef" class="mvu-mobile-shell-modal-host"></div>
        </div>
      </section>
    </div>
  `,
  setup() {
    const shellFrameRef = ref(null);
    const modalHostRef = ref(null);
    const shellScreen = ref('home');
    const dragState = {
      pointerId: null,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      moved: false
    };

    const launcherStyle = computed(() => {
      const position = mvuLayoutState.mobileLauncherPosition || getDefaultMobileLauncherPosition();
      return {
        transform: `translate3d(${Math.round(position.x)}px, ${Math.round(position.y)}px, 0)`
      };
    });
    const shellVisible = computed(() => !!mvuLayoutState.mobileShellOpen);
    const desktopShellMode = computed(() => isDesktopShellMode());
    const showMobileLauncher = computed(() => !!mvuLayoutState.isMobileViewport);
    const showDesktopDock = computed(() => desktopShellMode.value && !shellVisible.value);
    const shellApps = computed(() => SHELL_APP_ITEMS.map(item => ({
      ...item,
      icon: (TAB_ITEMS.find(tab => tab.id === item.id) || {}).icon || ''
    })));
    const activeApp = computed(() => resolveShellAppMeta(mvuTabState.current));
    const currentActions = computed(() => resolveUnifiedActions(mvuTabState.current));
    const launcherLabel = computed(() => {
      return activeApp.value ? activeApp.value.title : '助手';
    });
    const activeTitle = computed(() => (shellScreen.value === 'home' ? '首页' : activeApp.value.title));
    const showHomeBack = computed(() => shellScreen.value !== 'home');

    const detachPointerListeners = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
    };

    const finishDrag = togglesShell => {
      detachPointerListeners();
      dragState.pointerId = null;
      const moved = dragState.moved;
      dragState.moved = false;
      mvuLayoutState.mobileLauncherDragging = false;
      if (moved) {
        syncMobileLauncherPosition({ persist: true });
        return;
      }
      if (togglesShell) {
        toggleShellSurface();
      }
    };

    function handlePointerMove(event) {
      if (event.pointerId !== dragState.pointerId) return;
      const deltaX = event.clientX - dragState.startX;
      const deltaY = event.clientY - dragState.startY;
      if (!dragState.moved && Math.hypot(deltaX, deltaY) >= MOBILE_LAUNCHER_DRAG_THRESHOLD) {
        dragState.moved = true;
        mvuLayoutState.mobileLauncherDragging = true;
      }
      if (!dragState.moved) return;
      mvuLayoutState.mobileLauncherPosition = clampMobileLauncherPosition({
        x: dragState.originX + deltaX,
        y: dragState.originY + deltaY
      });
    }

    function handlePointerEnd(event) {
      if (event.pointerId !== dragState.pointerId) return;
      finishDrag(true);
    }

    const onLauncherPointerDown = event => {
      event.preventDefault();
      const position = syncMobileLauncherPosition({ persist: false });
      dragState.pointerId = event.pointerId;
      dragState.startX = event.clientX;
      dragState.startY = event.clientY;
      dragState.originX = position.x;
      dragState.originY = position.y;
      dragState.moved = false;
      mvuLayoutState.mobileLauncherDragging = false;
      if (event.currentTarget && typeof event.currentTarget.setPointerCapture === 'function') {
        try { event.currentTarget.setPointerCapture(event.pointerId); } catch (err) {}
      }
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerEnd);
      window.addEventListener('pointercancel', handlePointerEnd);
    };

    const closeShell = () => closeShellSurface();
    const openShell = () => openShellSurface();
    const exitShellMode = () => exitShellSurface();
    const handleBackdropClick = () => {
      if (!mvuLayoutState.isMobileViewport) return;
      closeShellSurface();
    };
    const enterSection = tabId => {
      requestTabChange(tabId);
      shellScreen.value = 'section';
    };
    const goHome = () => {
      shellScreen.value = 'home';
    };

    watch(() => mvuLayoutState.mobileShellOpen, nextOpen => {
      if (nextOpen) {
        shellScreen.value = 'home';
      }
    });

    const bridge = {
      isAvailable: () => true,
      isOpen: () => !!mvuLayoutState.mobileShellOpen,
      getModalHost: () => modalHostRef.value,
      getShellFrame: () => shellFrameRef.value,
      open: () => openShellSurface(),
      close: () => closeShellSurface(),
      toggle: () => toggleShellSurface(),
      syncLauncherPosition: options => syncMobileLauncherPosition(options)
    };

    onMounted(() => {
      window.__MVU_MOBILE_SHELL__ = bridge;
      if (mvuLayoutState.isMobileViewport) {
        syncMobileLauncherPosition({ persist: true });
      }
      if (typeof window.__MVU_SYNC_DETAIL_MODAL_HOST__ === 'function') {
        try { window.__MVU_SYNC_DETAIL_MODAL_HOST__(); } catch (err) {}
      }
    });

    onUnmounted(() => {
      detachPointerListeners();
      if (window.__MVU_MOBILE_SHELL__ === bridge) {
        delete window.__MVU_MOBILE_SHELL__;
      }
    });

    return {
      actionItems: UNIFIED_ACTION_ITEMS,
      tabs: TAB_ITEMS,
      activeTitle,
      currentActions,
      desktopShellMode,
      enterSection,
      exitShellMode,
      goHome,
      launcherLabel,
      launcherStyle,
      openShell,
      shellVisible,
      shellApps,
      shellScreen,
      showDesktopDock,
      showHomeBack,
      showMobileLauncher,
      tabState: mvuTabState,
      layoutState: mvuLayoutState,
      shellFrameRef,
      modalHostRef,
      closeShell,
      handleBackdropClick,
      onLauncherPointerDown
    };
  }
};

const SurfaceLauncherShellLayout = {
  template: `
    <div class="mvu-mobile-shell-host mvu-root" :class="{ 'is-open': layoutState.mobileShellOpen, 'is-dragging': layoutState.surfaceLauncherDragging }">
      <div
        v-if="showLauncher"
        ref="launcherRef"
        class="mvu-surface-launcher"
        :class="{
          'is-mobile': layoutState.isMobileViewport,
          'is-open': shellVisible,
          'has-menu': showLauncherMenuTrigger,
          'menu-open': layoutState.surfaceLauncherMenuOpen
        }"
        :style="launcherStyle"
        role="group"
        aria-label="LWCS 挂件"
      >
        <button
          type="button"
          class="mvu-surface-launcher-main"
          :aria-label="launcherMainAriaLabel"
          @pointerdown="onMainPointerDown"
          @keydown.enter.prevent="onMainKeyboardAction"
          @keydown.space.prevent="onMainKeyboardAction"
        >
          <span class="mvu-surface-launcher-mark" aria-hidden="true">LW</span>
          <span class="mvu-surface-launcher-copy">
            <strong>LWCS</strong>
            <span>{{ launcherMeta }}</span>
          </span>
        </button>

        <button
          v-if="showLauncherMenuTrigger"
          type="button"
          class="mvu-surface-launcher-menu-trigger"
          :class="{ active: layoutState.surfaceLauncherMenuOpen }"
          aria-label="切换界面模式"
          @pointerdown="onMenuPointerDown"
          @keydown.enter.prevent="onMenuKeyboardAction"
          @keydown.space.prevent="onMenuKeyboardAction"
        >
          <span aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 7.5h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M6 12h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M6 16.5h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            </svg>
          </span>
        </button>

        <div
          v-if="showLauncherMenuTrigger"
          class="mvu-surface-launcher-menu"
          :class="{
            active: layoutState.surfaceLauncherMenuOpen,
            'align-end': launcherMenuAlign === 'end',
            'open-up': launcherMenuVertical === 'up'
          }"
          role="menu"
          aria-label="界面模式"
        >
          <button
            v-for="item in launcherModeItems"
            :key="'launcher-mode-' + item.id"
            type="button"
            class="mvu-surface-launcher-menu-item"
            :class="{ active: launcherMode === item.id }"
            role="menuitemradio"
            :aria-checked="launcherMode === item.id ? 'true' : 'false'"
            @click="selectLauncherMode(item.id)"
          >{{ item.label }}</button>
        </div>
      </div>

      <div class="mvu-mobile-shell-backdrop" :class="{ active: shellVisible }" @click="handleBackdropClick"></div>

      <section class="mvu-mobile-shell" :class="{ active: shellVisible }" aria-label="酒馆助手小手机框架">
        <div ref="shellFrameRef" class="mvu-mobile-shell-frame" :data-screen="shellScreen">
          <header class="mvu-mobile-shell-head">
            <div class="mvu-mobile-shell-head-main">
              <button
                v-if="showHomeBack"
                type="button"
                class="mvu-mobile-shell-back"
                aria-label="返回首页"
                @click="goHome"
              >
                <span aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18 9 12l6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </span>
              </button>
              <div class="mvu-mobile-shell-head-copy">
                <strong class="mvu-mobile-shell-title">{{ activeTitle }}</strong>
              </div>
            </div>
            <div class="mvu-mobile-shell-head-actions">
              <button type="button" class="mvu-mobile-shell-close" aria-label="关闭" @click="closeShell">&times;</button>
            </div>
          </header>

          <div class="mvu-mobile-shell-body">
            <div class="mvu-mobile-shell-scroll" :class="{ 'is-home': shellScreen === 'home' }">
              <section v-if="shellScreen === 'home'" class="mvu-mobile-home" data-target="home">
                <div class="mvu-mobile-card mvu-mobile-card--spotlight clickable" data-preview="生命图谱详情页" data-unified-card="archive-core" data-unified-surface="shell"></div>
                <div class="mvu-mobile-app-grid" role="navigation" aria-label="壳内应用入口">
                  <button
                    v-for="app in shellApps"
                    :key="'shell-app-' + app.id"
                    type="button"
                    class="mvu-mobile-app-tile"
                    :data-app="app.id"
                    @click="enterSection(app.id)"
                  >
                    <span class="mvu-mobile-app-icon" aria-hidden="true" v-html="app.icon"></span>
                    <span class="mvu-mobile-app-copy">
                      <strong>{{ app.title }}</strong>
                      <span>{{ app.hint }}</span>
                    </span>
                    <div class="mvu-mobile-app-live" :data-unified-card="app.homeSlot" data-unified-surface="shell"></div>
                  </button>
                </div>
              </section>

              <section v-else class="mvu-mobile-library" :data-target="tabState.current">
                <div class="mvu-mobile-action-rail" role="toolbar" :aria-label="activeTitle + '快捷操作'">
                  <button
                    v-for="item in currentActions"
                    :key="'shell-action-' + item.preview"
                    type="button"
                    class="mvu-mobile-action-pill clickable"
                    :data-preview="item.preview"
                  >{{ item.label }}</button>
                </div>

                <section v-if="tabState.current === 'page-archive'" class="mvu-mobile-library-page" data-target="page-archive">
                  <div class="mvu-mobile-card mvu-mobile-card--hero clickable" data-preview="生命图谱详情页" data-unified-card="archive-core" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card-grid mvu-mobile-card-grid--two">
                    <div class="mvu-mobile-card clickable" data-unified-card="primary-spirit" data-unified-surface="shell"></div>
                    <div class="mvu-mobile-card clickable" data-unified-card="secondary-spirit" data-unified-surface="shell"></div>
                  </div>
                  <div class="mvu-mobile-card clickable" data-preview="武装工坊详情页" data-unified-card="armory" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="储物仓库详情页" data-unified-card="vault" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="社会档案详情页" data-unified-card="social" data-unified-surface="shell"></div>
                </section>

                <section v-if="tabState.current === 'page-map'" class="mvu-mobile-library-page" data-target="page-map">
                  <div class="mvu-mobile-card mvu-mobile-card--hero clickable" data-preview="全息星图主画布" data-unified-card="map-hero" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="当前节点详情" data-unified-card="map-current" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="图层控制与跑图" data-unified-card="map-route" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="动态地点与扩展节点" data-unified-card="map-dynamic" data-unified-surface="shell"></div>
                </section>

                <section v-if="tabState.current === 'page-world'" class="mvu-mobile-library-page" data-target="page-world">
                  <div class="mvu-mobile-card mvu-mobile-card--hero clickable" data-preview="世界状态总览" data-unified-card="world-hero" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="编年史档案" data-unified-card="world-timeline" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="拍卖与警报" data-unified-card="world-alerts" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card" data-unified-card="world-ranks" data-unified-surface="shell"></div>
                </section>

                <section v-if="tabState.current === 'page-org'" class="mvu-mobile-library-page" data-target="page-org">
                  <div class="mvu-mobile-card mvu-mobile-card--hero clickable" data-preview="势力矩阵总览" data-unified-card="org-hero" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="我的阵营详情" data-unified-card="org-faction" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="本地据点详情" data-unified-card="org-node" data-unified-surface="shell"></div>
                </section>

                <section v-if="tabState.current === 'page-terminal'" class="mvu-mobile-library-page" data-target="page-terminal">
                  <div class="mvu-mobile-card mvu-mobile-card--hero clickable" data-preview="系统播报与日志" data-unified-card="terminal-hero" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="试炼与情报" data-unified-card="terminal-intel" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="近期见闻" data-unified-card="terminal-news" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="怪物图鉴" data-unified-card="terminal-bestiary" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="任务界面" data-unified-card="terminal-quest" data-unified-surface="shell"></div>
                </section>
              </section>
            </div>
          </div>

          <nav class="mvu-mobile-shell-nav" aria-label="页面切换">
            <button
              v-for="tab in tabs"
              :key="'mobile-tab-' + tab.id"
              type="button"
              class="mvu-mobile-shell-tab"
              :class="{ active: shellScreen !== 'home' && tabState.current === tab.id }"
              :data-target="tab.id"
              @click="enterSection(tab.id)"
            >
              <span class="mvu-mobile-shell-tab-icon" aria-hidden="true" v-html="tab.icon"></span>
              <span class="mvu-mobile-shell-tab-label">{{ tab.label }}</span>
            </button>
          </nav>

          <div ref="modalHostRef" class="mvu-mobile-shell-modal-host"></div>
        </div>
      </section>
    </div>
  `,
  setup() {
    const launcherRef = ref(null);
    const shellFrameRef = ref(null);
    const modalHostRef = ref(null);
    const shellScreen = ref('home');
    const launcherModeItems = [
      { id: 'split', label: '分栏' },
      { id: 'unified', label: '一体' },
      { id: 'shell', label: '手机' }
    ];
    const dragState = {
      pointerId: null,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      moved: false,
      action: 'main'
    };

    const launcherPosition = computed(() => resolveSurfaceLauncherDisplayPosition());
    const launcherStyle = computed(() => {
      const position = launcherPosition.value;
      return {
        transform: `translate3d(${Math.round(position.x)}px, ${Math.round(position.y)}px, 0)`
      };
    });
    const shellVisible = computed(() => !!mvuLayoutState.mobileShellOpen);
    const showLauncher = computed(() => !(mvuLayoutState.isMobileViewport && shellVisible.value));
    const showLauncherMenuTrigger = computed(() => !mvuLayoutState.isMobileViewport);
    const launcherMode = computed(() => getDesktopModeSelection());
    const shellApps = computed(() => SHELL_APP_ITEMS.map(item => ({
      ...item,
      icon: (TAB_ITEMS.find(tab => tab.id === item.id) || {}).icon || ''
    })));
    const activeApp = computed(() => resolveShellAppMeta(mvuTabState.current));
    const currentActions = computed(() => resolveUnifiedActions(mvuTabState.current));
    const launcherMeta = computed(() => {
      if (mvuLayoutState.isMobileViewport) return '打开';
      if (mvuLayoutState.surfaceMode === 'shell') {
        return shellVisible.value ? '收起' : '手机';
      }
      return launcherMode.value === 'unified' ? '一体' : '分栏';
    });
    const activeTitle = computed(() => (shellScreen.value === 'home' ? '首页' : activeApp.value.title));
    const showHomeBack = computed(() => shellScreen.value !== 'home');
    const launcherMainAriaLabel = computed(() => {
      if (mvuLayoutState.surfaceMode === 'shell' && shellVisible.value) return '收起小手机';
      return '打开小手机';
    });
    const launcherMenuAlign = computed(() => {
      const viewport = getViewportSize();
      return launcherPosition.value.x > viewport.width * 0.52 ? 'end' : 'start';
    });
    const launcherMenuVertical = computed(() => {
      const viewport = getViewportSize();
      return launcherPosition.value.y > viewport.height * 0.58 ? 'up' : 'down';
    });

    const setLauncherMenuOpen = nextOpen => {
      const nextValue = !!nextOpen && !mvuLayoutState.isMobileViewport;
      if (mvuLayoutState.surfaceLauncherMenuOpen === nextValue) return nextValue;
      mvuLayoutState.surfaceLauncherMenuOpen = nextValue;
      applyLayoutBodyClasses();
      return nextValue;
    };

    const closeLauncherMenu = () => setLauncherMenuOpen(false);

    const detachPointerListeners = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
    };

    const runLauncherAction = action => {
      if (action === 'menu') {
        setLauncherMenuOpen(!mvuLayoutState.surfaceLauncherMenuOpen);
        return;
      }
      closeLauncherMenu();
      toggleShellSurface();
    };

    const finishDrag = () => {
      detachPointerListeners();
      const action = dragState.action;
      dragState.pointerId = null;
      dragState.action = 'main';
      const moved = dragState.moved;
      dragState.moved = false;
      mvuLayoutState.surfaceLauncherDragging = false;
      if (moved) {
        syncSurfaceLauncherPosition({ persist: true });
        return;
      }
      runLauncherAction(action);
    };

    function handlePointerMove(event) {
      if (event.pointerId !== dragState.pointerId) return;
      const deltaX = event.clientX - dragState.startX;
      const deltaY = event.clientY - dragState.startY;
      if (!dragState.moved && Math.hypot(deltaX, deltaY) >= SURFACE_LAUNCHER_DRAG_THRESHOLD) {
        dragState.moved = true;
        mvuLayoutState.surfaceLauncherDragging = true;
        closeLauncherMenu();
      }
      if (!dragState.moved) return;
      mvuLayoutState.surfaceLauncherPosition = clampSurfaceLauncherPosition({
        x: dragState.originX + deltaX,
        y: dragState.originY + deltaY
      });
    }

    function handlePointerEnd(event) {
      if (event.pointerId !== dragState.pointerId) return;
      finishDrag();
    }

    const beginLauncherPointer = (event, action) => {
      if (typeof event.button === 'number' && event.button !== 0) return;
      event.preventDefault();
      const position = resolveSurfaceLauncherDisplayPosition();
      dragState.pointerId = event.pointerId;
      dragState.startX = event.clientX;
      dragState.startY = event.clientY;
      dragState.originX = position.x;
      dragState.originY = position.y;
      dragState.moved = false;
      dragState.action = action;
      mvuLayoutState.surfaceLauncherDragging = false;
      if (event.currentTarget && typeof event.currentTarget.setPointerCapture === 'function') {
        try { event.currentTarget.setPointerCapture(event.pointerId); } catch (err) {}
      }
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerEnd);
      window.addEventListener('pointercancel', handlePointerEnd);
    };

    const onMainPointerDown = event => beginLauncherPointer(event, 'main');
    const onMenuPointerDown = event => beginLauncherPointer(event, 'menu');
    const onMainKeyboardAction = () => runLauncherAction('main');
    const onMenuKeyboardAction = () => runLauncherAction('menu');

    const closeShell = () => closeShellSurface();
    const handleBackdropClick = () => {
      if (shellVisible.value) closeShellSurface();
    };
    const enterSection = tabId => {
      requestTabChange(tabId);
      shellScreen.value = 'section';
    };
    const goHome = () => {
      shellScreen.value = 'home';
    };
    const selectLauncherMode = mode => {
      closeLauncherMenu();
      setDesktopMode(mode);
    };

    const handleWindowPointerDown = event => {
      if (!mvuLayoutState.surfaceLauncherMenuOpen) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target && launcherRef.value && launcherRef.value.contains(target)) return;
      closeLauncherMenu();
    };

    const handleWindowKeydown = event => {
      if (event.key === 'Escape' && mvuLayoutState.surfaceLauncherMenuOpen) {
        closeLauncherMenu();
      }
    };

    watch(() => mvuLayoutState.mobileShellOpen, nextOpen => {
      if (nextOpen) {
        shellScreen.value = 'home';
        closeLauncherMenu();
      }
    });

    const bridge = {
      isAvailable: () => true,
      isOpen: () => !!mvuLayoutState.mobileShellOpen,
      getModalHost: () => modalHostRef.value,
      getShellFrame: () => shellFrameRef.value,
      open: () => openShellSurface(),
      close: () => closeShellSurface(),
      toggle: () => toggleShellSurface(),
      syncLauncherPosition: options => syncSurfaceLauncherPosition(options)
    };

    onMounted(() => {
      window.__MVU_MOBILE_SHELL__ = bridge;
      syncSurfaceLauncherPosition({ persist: true });
      window.addEventListener('pointerdown', handleWindowPointerDown, true);
      window.addEventListener('keydown', handleWindowKeydown);
      if (typeof window.__MVU_SYNC_DETAIL_MODAL_HOST__ === 'function') {
        try { window.__MVU_SYNC_DETAIL_MODAL_HOST__(); } catch (err) {}
      }
    });

    onUnmounted(() => {
      detachPointerListeners();
      window.removeEventListener('pointerdown', handleWindowPointerDown, true);
      window.removeEventListener('keydown', handleWindowKeydown);
      if (window.__MVU_MOBILE_SHELL__ === bridge) {
        delete window.__MVU_MOBILE_SHELL__;
      }
    });

    return {
      tabs: TAB_ITEMS,
      activeTitle,
      currentActions,
      enterSection,
      goHome,
      launcherMainAriaLabel,
      launcherMenuAlign,
      launcherModeItems,
      launcherMenuVertical,
      launcherMeta,
      launcherMode,
      launcherStyle,
      launcherRef,
      onMainKeyboardAction,
      onMainPointerDown,
      onMenuKeyboardAction,
      onMenuPointerDown,
      selectLauncherMode,
      shellVisible,
      shellApps,
      shellScreen,
      showHomeBack,
      showLauncher,
      showLauncherMenuTrigger,
      tabState: mvuTabState,
      layoutState: mvuLayoutState,
      shellFrameRef,
      modalHostRef,
      closeShell,
      handleBackdropClick
    };
  }
};

const DesktopUnifiedLayout = {
  template: `
    <div class="mvu-unified-shell mvu-unified-panel-host mvu-root">
      <div class="mvu-unified-frame">
        <div class="mvu-unified-toolbar">
          <div class="mvu-unified-toolbar-main">
            <div class="mvu-unified-toolbar-copy">
              <span class="mvu-unified-eyebrow">{{ activeMeta.eyebrow }}</span>
              <strong class="mvu-unified-headline">{{ activeMeta.title }}</strong>
              <span class="mvu-unified-subline">{{ activeMeta.desc }}</span>
            </div>
            <div class="mvu-unified-toolbar-side">
              <span class="mvu-unified-mode-badge">{{ modeBadge }}</span>
              <div class="mvu-unified-layout-toggle" :class="{ locked: splitLocked }">
                <template v-if="!splitLocked">
                  <button
                    type="button"
                    class="mvu-unified-layout-btn"
                    :class="{ active: desktopMode === 'split' }"
                    @click="setDesktopMode('split')"
                  >分栏</button>
                  <button
                    type="button"
                    class="mvu-unified-layout-btn"
                    :class="{ active: desktopMode === 'unified' }"
                    @click="setDesktopMode('unified')"
                  >一体</button>
                  <button
                    type="button"
                    class="mvu-unified-layout-btn"
                    :class="{ active: desktopMode === 'shell' }"
                    @click="setDesktopMode('shell')"
                  >手机</button>
                </template>
                <span v-else class="mvu-unified-lock-note">移动端锁定一体栏</span>
              </div>
            </div>
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
        </div>

        <div class="mvu-unified-page-stack">
          <section class="mvu-unified-page" :class="{ active: tabState.current === 'page-archive' }" data-target="page-archive">
            <div class="mvu-unified-section-stack">
              <section class="mvu-unified-section">
                <div class="mvu-unified-section-headline">
                  <div class="mvu-unified-section-copy">
                    <b class="mvu-unified-section-title nsfw-trigger-title" data-longpress="私密档案详细页" data-longpress-delay="600">核心生命体征</b>
                    <span class="mvu-unified-section-note">角色体征与成长摘要</span>
                  </div>
                  <div class="mvu-unified-chip-row">
                    <button type="button" class="mvu-unified-chip clickable" data-preview="角色切换器">角色</button>
                    <button type="button" class="mvu-unified-chip clickable" data-preview="生命图谱详细页">生命</button>
                  </div>
                </div>
                <div class="mvu-unified-card mvu-unified-card--featured clickable" data-preview="生命图谱详细页" data-unified-card="archive-core" data-unified-surface="panel"></div>
              </section>

              <section class="mvu-unified-section">
                <div class="mvu-unified-section-headline">
                  <div class="mvu-unified-section-copy">
                    <b class="mvu-unified-section-title">武魂与能力</b>
                    <span class="mvu-unified-section-note">主武魂、副轨与特殊能力入口</span>
                  </div>
                  <div class="mvu-unified-chip-row">
                    <button type="button" class="mvu-unified-chip clickable" data-preview="武魂融合技详细页">融合技</button>
                  </div>
                </div>
                <div class="mvu-unified-grid mvu-unified-grid--two">
                  <div class="mvu-unified-card clickable" data-unified-card="primary-spirit" data-unified-surface="panel"></div>
                  <div class="mvu-unified-card" data-unified-card="secondary-spirit" data-unified-surface="panel"></div>
                </div>
              </section>

              <section class="mvu-unified-section">
                <div class="mvu-unified-section-headline">
                  <div class="mvu-unified-section-copy">
                    <b class="mvu-unified-section-title">装备与仓储</b>
                    <span class="mvu-unified-section-note">武装状态、库存与资源</span>
                  </div>
                </div>
                <div class="mvu-unified-grid mvu-unified-grid--two">
                  <div class="mvu-unified-card clickable" data-preview="武装工坊详细页" data-unified-card="armory" data-unified-surface="panel"></div>
                  <div class="mvu-unified-card clickable" data-preview="储物仓库详细页" data-unified-card="vault" data-unified-surface="panel"></div>
                </div>
              </section>

              <section class="mvu-unified-section">
                <div class="mvu-unified-section-headline">
                  <div class="mvu-unified-section-copy">
                    <b class="mvu-unified-section-title">社交与势力</b>
                    <span class="mvu-unified-section-note">名望、关系与阵营入口</span>
                  </div>
                  <div class="mvu-unified-chip-row">
                    <button type="button" class="mvu-unified-chip clickable" data-preview="社会档案详细页">社会</button>
                    <button type="button" class="mvu-unified-chip clickable" data-preview="人物关系详细页">关系</button>
                    <button type="button" class="mvu-unified-chip clickable" data-preview="所属势力详细页">势力</button>
                  </div>
                </div>
                <div class="mvu-unified-card clickable" data-preview="社会档案详细页" data-unified-card="social" data-unified-surface="panel"></div>
              </section>
            </div>
          </section>

          <section class="mvu-unified-page" :class="{ active: tabState.current === 'page-map' }" data-target="page-map">
            <div class="mvu-unified-section-stack">
              <section class="mvu-unified-section">
                <div class="mvu-unified-section-headline">
                  <div class="mvu-unified-section-copy">
                    <b class="mvu-unified-section-title">地图总览</b>
                    <span class="mvu-unified-section-note">当前所在、地图层级与焦点节点</span>
                  </div>
                  <div class="mvu-unified-chip-row">
                    <button type="button" class="mvu-unified-chip clickable" data-preview="全息星图主画布">星图</button>
                    <button type="button" class="mvu-unified-chip" data-map-focus-action="current">定位当前</button>
                  </div>
                </div>
                <div class="mvu-unified-card mvu-unified-card--featured clickable" data-preview="全息星图主画布" data-unified-card="map-hero" data-unified-surface="panel"></div>
              </section>

              <section class="mvu-unified-section">
                <div class="mvu-unified-grid mvu-unified-grid--three">
                  <div class="mvu-unified-card clickable" data-preview="当前节点详情" data-unified-card="map-current" data-unified-surface="panel"></div>
                  <div class="mvu-unified-card clickable" data-preview="图层控制与跑图" data-unified-card="map-route" data-unified-surface="panel"></div>
                  <div class="mvu-unified-card clickable" data-preview="动态地点与扩展节点" data-unified-card="map-dynamic" data-unified-surface="panel"></div>
                </div>
              </section>
            </div>
          </section>

          <section class="mvu-unified-page" :class="{ active: tabState.current === 'page-world' }" data-target="page-world">
            <div class="mvu-unified-section-stack">
              <section class="mvu-unified-section">
                <div class="mvu-unified-section-headline">
                  <div class="mvu-unified-section-copy">
                    <b class="mvu-unified-section-title">世界状态</b>
                    <span class="mvu-unified-section-note">时间线、榜单与全局警报</span>
                  </div>
                  <div class="mvu-unified-chip-row">
                    <button type="button" class="mvu-unified-chip clickable" data-preview="世界状态总览">总览</button>
                    <button type="button" class="mvu-unified-chip clickable" data-preview="编年史档案">编年</button>
                  </div>
                </div>
                <div class="mvu-unified-card mvu-unified-card--featured" data-unified-card="world-hero" data-unified-surface="panel"></div>
              </section>

              <section class="mvu-unified-section">
                <div class="mvu-unified-grid mvu-unified-grid--three">
                  <div class="mvu-unified-card clickable" data-preview="编年史档案" data-unified-card="world-timeline" data-unified-surface="panel"></div>
                  <div class="mvu-unified-card" data-unified-card="world-ranks" data-unified-surface="panel"></div>
                  <div class="mvu-unified-card clickable" data-preview="拍卖与警报" data-unified-card="world-alerts" data-unified-surface="panel"></div>
                </div>
              </section>
            </div>
          </section>

          <section class="mvu-unified-page" :class="{ active: tabState.current === 'page-org' }" data-target="page-org">
            <div class="mvu-unified-section-stack">
              <section class="mvu-unified-section">
                <div class="mvu-unified-section-headline">
                  <div class="mvu-unified-section-copy">
                    <b class="mvu-unified-section-title">阵营总览</b>
                    <span class="mvu-unified-section-note">势力矩阵、当前阵营与据点信息</span>
                  </div>
                  <div class="mvu-unified-chip-row">
                    <button type="button" class="mvu-unified-chip clickable" data-preview="势力矩阵总览">矩阵</button>
                    <button type="button" class="mvu-unified-chip clickable" data-preview="我的阵营详情">阵营</button>
                  </div>
                </div>
                <div class="mvu-unified-card mvu-unified-card--featured clickable" data-preview="势力矩阵总览" data-unified-card="org-hero" data-unified-surface="panel"></div>
              </section>

              <section class="mvu-unified-section">
                <div class="mvu-unified-grid mvu-unified-grid--two">
                  <div class="mvu-unified-card clickable" data-preview="我的阵营详情" data-unified-card="org-faction" data-unified-surface="panel"></div>
                  <div class="mvu-unified-card clickable" data-preview="本地据点详情" data-unified-card="org-node" data-unified-surface="panel"></div>
                </div>
              </section>
            </div>
          </section>

          <section class="mvu-unified-page" :class="{ active: tabState.current === 'page-terminal' }" data-target="page-terminal">
            <div class="mvu-unified-section-stack">
              <section class="mvu-unified-section">
                <div class="mvu-unified-section-headline">
                  <div class="mvu-unified-section-copy">
                    <b class="mvu-unified-section-title">终端总线</b>
                    <span class="mvu-unified-section-note">系统播报、任务与情报流</span>
                  </div>
                  <div class="mvu-unified-chip-row">
                    <button type="button" class="mvu-unified-chip clickable" data-preview="系统播报与日志">播报</button>
                    <button type="button" class="mvu-unified-chip clickable" data-preview="任务界面">任务</button>
                  </div>
                </div>
                <div class="mvu-unified-card mvu-unified-card--featured clickable" data-preview="系统播报与日志" data-unified-card="terminal-hero" data-unified-surface="panel"></div>
              </section>

              <section class="mvu-unified-section">
                <div class="mvu-unified-grid mvu-unified-grid--two">
                  <div class="mvu-unified-card clickable" data-preview="试炼与情报" data-unified-card="terminal-intel" data-unified-surface="panel"></div>
                  <div class="mvu-unified-card clickable" data-preview="近期见闻" data-unified-card="terminal-news" data-unified-surface="panel"></div>
                  <div class="mvu-unified-card clickable" data-preview="怪物图鉴" data-unified-card="terminal-bestiary" data-unified-surface="panel"></div>
                  <div class="mvu-unified-card clickable" data-preview="任务界面" data-unified-card="terminal-quest" data-unified-surface="panel"></div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  setup() {
    const activeMeta = computed(() => resolveUnifiedTabMeta(mvuTabState.current));
    const splitLocked = computed(() => !isSplitLayoutAllowed());
    const desktopMode = computed(() => getDesktopModeSelection());
    const modeBadge = computed(() => (mvuLayoutState.isMobileViewport ? '移动端一体栏' : '桌面一体栏'));
    return {
      tabs: TAB_ITEMS,
      activeMeta,
      desktopMode,
      splitLocked,
      modeBadge,
      tabState: mvuTabState,
      layoutState: mvuLayoutState,
      setTab: requestTabChange,
      setDesktopMode
    };
  }
};

const UnifiedLayoutRoot = {
  components: {
    SurfaceLauncherShellLayout,
    DesktopUnifiedLayout
  },
  template: `
    <div class="mvu-unified-layout-host">
      <surface-launcher-shell-layout></surface-launcher-shell-layout>
      <desktop-unified-layout v-if="!layoutState.isMobileViewport"></desktop-unified-layout>
    </div>
  `,
  setup() {
    return {
      layoutState: mvuLayoutState
    };
  }
};

const LayoutRescueDock = {
  template: `
    <div class="mvu-layout-rescue" :class="{ active: shouldShow }">
      <button type="button" class="mvu-layout-rescue-btn" @click="rescue">
        <span class="mvu-layout-rescue-title">切回一体栏</span>
        <span class="mvu-layout-rescue-desc">移动端分栏不可用，点这里直接恢复。</span>
      </button>
    </div>
  `,
  setup() {
    const shouldShow = computed(() => mvuLayoutState.isMobileViewport && mvuLayoutState.effectiveMode !== 'unified');
    const rescue = () => setLayoutMode('unified');
    return {
      shouldShow,
      rescue
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
  applyUnifiedMountHostStyle(unifiedMount);
  return unifiedMount;
}

function ensureLayoutRescueMountNode() {
  let rescueMount = document.getElementById('mvu-layout-rescue-mount');
  if (!rescueMount && document.body) {
    rescueMount = document.createElement('div');
    rescueMount.id = 'mvu-layout-rescue-mount';
    document.body.appendChild(rescueMount);
  }
  return rescueMount;
}

function ensureUnifiedDockMounted() {
  const unifiedMount = ensureUnifiedMountNode();
  if (!unifiedMount) return null;
  if (!unifiedMount.__mvuVueMounted) {
    createApp(UnifiedLayoutRoot).mount(unifiedMount);
    unifiedMount.__mvuVueMounted = true;
  }
  return unifiedMount;
}

function ensureLayoutRescueMounted() {
  const rescueMount = ensureLayoutRescueMountNode();
  if (!rescueMount) return null;
  if (!rescueMount.__mvuVueMounted) {
    createApp(LayoutRescueDock).mount(rescueMount);
    rescueMount.__mvuVueMounted = true;
  }
  return rescueMount;
}

function removeLayoutRescueMountNode() {
  const rescueMount = document.getElementById('mvu-layout-rescue-mount');
  if (rescueMount && rescueMount.parentElement) {
    rescueMount.parentElement.removeChild(rescueMount);
  }
}

function mountMvuVue() {
  const leftMount = document.getElementById('mvu-left-mount');
  const rightMount = document.getElementById('mvu-right-mount');
  const unifiedMount = ensureUnifiedDockMounted();
  removeLayoutRescueMountNode();

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

  syncSurfaceLauncherPosition({ persist: true });
  refreshViewportState();
  syncLayoutMode();
  if (typeof window.__MVU_SYNC_DETAIL_MODAL_HOST__ === 'function') {
    try { window.__MVU_SYNC_DETAIL_MODAL_HOST__(); } catch (err) {}
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountMvuVue);
} else {
  mountMvuVue();
}
