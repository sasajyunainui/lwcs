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

const SHELL_TAB_ITEMS = TAB_ITEMS;

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
    eyebrow: '',
    title: '档案',
    desc: ''
  },
  'page-map': {
    eyebrow: '',
    title: '星图',
    desc: ''
  },
  'page-world': {
    eyebrow: '',
    title: '世界',
    desc: ''
  },
  'page-org': {
    eyebrow: '',
    title: '势力',
    desc: ''
  },
  'page-terminal': {
    eyebrow: '',
    title: '终端',
    desc: ''
  }
};

const SHELL_APP_ITEMS = [
  {
    id: 'page-archive',
    title: '档案',
    hint: '',
    homeSlot: 'home-archive'
  },
  {
    id: 'page-map',
    title: '星图',
    hint: '',
    homeSlot: 'home-map'
  },
  {
    id: 'page-world',
    title: '世界',
    hint: '',
    homeSlot: 'home-world'
  },
  {
    id: 'page-org',
    title: '势力',
    hint: '',
    homeSlot: 'home-org'
  },
  {
    id: 'page-terminal',
    title: '终端',
    hint: '',
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
const SURFACE_LAUNCHER_LONG_PRESS_MS = 360;
const SURFACE_LAUNCHER_MOBILE_SIZE = { width: 56, height: 56 };
const SURFACE_LAUNCHER_DESKTOP_SIZE = { width: 56, height: 56 };

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

function normalizeShellTabId(tabId) {
  const value = String(tabId || '').trim();
  return SHELL_TAB_ITEMS.some(tab => tab.id === value) ? value : 'page-archive';
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
    return normalizeShellTabId(window.localStorage.getItem(MOBILE_LAST_TAB_STORAGE_KEY));
  } catch (err) {
    return 'page-archive';
  }
}

function writeMobileLastTabStorage(tabId) {
  const normalized = normalizeShellTabId(tabId);
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
  const normalized = normalizeShellTabId(tabId);
  const activeTab = SHELL_TAB_ITEMS.find(tab => tab.id === normalized) || SHELL_TAB_ITEMS[0];
  return {
    id: activeTab.id,
    title: activeTab.label,
    icon: activeTab.icon
  };
}

function resolveShellPreviewTitle(previewKey, fallback = '') {
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
    '\u4efb\u52a1\u754c\u9762': '\u4efb\u52a1'
  };
  return previewTitleMap[key] || key || fallback || '\u8be6\u60c5';
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
const mvuUnifiedDetailState = window.__MVU_UNIFIED_DETAIL_STATE__ || (window.__MVU_UNIFIED_DETAIL_STATE__ = reactive({
  isOpen: false,
  previewKey: '',
  returnTab: mvuTabState.current,
  stack: [],
  returnScrollTop: 0
}));
const mvuFoldState = window.__MVU_SIDE_FOLD_STATE__ || (window.__MVU_SIDE_FOLD_STATE__ = ref(true));
const mvuPinState = window.__MVU_PIN_STATE__ || (window.__MVU_PIN_STATE__ = ref(false));

if (!mvuLayoutState.surfaceLauncherPosition || !Number.isFinite(Number(mvuLayoutState.surfaceLauncherPosition.x)) || !Number.isFinite(Number(mvuLayoutState.surfaceLauncherPosition.y))) {
  mvuLayoutState.surfaceLauncherPosition = readSurfaceLauncherPosition(initialIsMobileViewport ? 'mobile' : 'desktop');
}
mvuTabState.current = normalizeTabId(mvuTabState.current);
if (!Array.isArray(mvuUnifiedDetailState.stack)) mvuUnifiedDetailState.stack = [];
mvuUnifiedDetailState.returnTab = normalizeTabId(mvuUnifiedDetailState.returnTab || mvuTabState.current);

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
  if (typeof window.__MVU_CLOSE_UNIFIED_PREVIEW__ === 'function') {
    try { window.__MVU_CLOSE_UNIFIED_PREVIEW__({ force: true }); } catch (err) {}
  }
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

function requestUnifiedShellCardRefresh(options = {}) {
  const force = options.force !== false;
  const runRender = () => {
    if (typeof window.__MVU_RERENDER_UNIFIED_CARDS__ === 'function') {
      try { window.__MVU_RERENDER_UNIFIED_CARDS__({ force }); } catch (err) {}
    }
  };
  const run = () => {
    if (typeof window.__MVU_REFRESH_LIVE_SNAPSHOT__ === 'function') {
      try {
        const refreshResult = window.__MVU_REFRESH_LIVE_SNAPSHOT__({ force });
        if (refreshResult && typeof refreshResult.then === 'function') {
          refreshResult.finally(runRender);
          return;
        }
      } catch (err) {}
    }
    runRender();
  };
  if (typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(() => window.requestAnimationFrame(run));
  } else {
    window.setTimeout(run, 0);
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
  if (next === 'page-map' && typeof window.__sheepMapResync === 'function') {
    window.setTimeout(() => {
      try { window.__sheepMapResync({ center: false, syncVisual: false }); } catch (err) {}
      if (typeof window.__MVU_CLAMP_UNIFIED_MAP_CANVAS__ === 'function') {
        try { window.__MVU_CLAMP_UNIFIED_MAP_CANVAS__(); } catch (err) {}
      }
    }, 40);
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
            :class="{ active: layoutState.surfaceMode !== 'shell' && layoutState.preferredMode === 'split' }"
            @click="setLayoutByPanel('split')"
          >分栏模式</button>
          <button
            v-if="!layoutState.isMobileViewport"
            type="button"
            class="mvu-window-settings-option"
            :class="{ active: layoutState.surfaceMode !== 'shell' && layoutState.preferredMode === 'unified' }"
            @click="setLayoutByPanel('unified')"
          >一体模式</button>
          <button
            v-if="!layoutState.isMobileViewport"
            type="button"
            class="mvu-window-settings-option"
            :class="{ active: layoutState.surfaceMode === 'shell' }"
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
          'menu-open': layoutState.surfaceLauncherMenuOpen
        }"
        :data-mode="launcherMode"
        :style="launcherStyle"
        role="group"
        aria-label="LWCS 挂件"
      >
        <button
          type="button"
          class="mvu-surface-launcher-main"
          :aria-label="launcherMainAriaLabel"
          @pointerdown="onLauncherPointerDown"
          @contextmenu.prevent="onLauncherContextMenu"
          @keydown.enter.prevent="onLauncherKeyboardAction"
          @keydown.space.prevent="onLauncherKeyboardAction"
        >
          <span class="mvu-surface-launcher-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="4.5" y="4.5" width="6.25" height="6.25" rx="1.8" fill="currentColor"></rect>
              <rect x="13.25" y="4.5" width="6.25" height="6.25" rx="1.8" fill="currentColor"></rect>
              <rect x="4.5" y="13.25" width="6.25" height="6.25" rx="1.8" fill="currentColor"></rect>
              <rect x="13.25" y="13.25" width="6.25" height="6.25" rx="1.8" fill="currentColor"></rect>
            </svg>
          </span>
          <span class="mvu-surface-launcher-dot" aria-hidden="true"></span>
        </button>

        <div
          v-if="showLauncherMenu"
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

      <div class="mvu-mobile-shell-backdrop" :class="{ active: shellVisible }"></div>

      <section class="mvu-mobile-shell" :class="{ active: shellVisible }" aria-label="酒馆助手小手机框架">
        <div ref="shellFrameRef" class="mvu-mobile-shell-frame" :style="shellFrameStyle" :data-screen="shellScreen">
          <header class="mvu-mobile-shell-head" @pointerdown="onShellHeaderPointerDown">
            <div class="mvu-mobile-shell-head-main">
              <button
                v-if="showHomeBack"
                type="button"
                class="mvu-mobile-shell-back"
                aria-label="返回首页"
                @click="handleBack"
              >
                <span aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18 9 12l6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </span>
              </button>
              <div class="mvu-mobile-shell-head-copy">
                <strong class="mvu-mobile-shell-title">{{ resolvedActiveTitle }}</strong>
              </div>
            </div>
            <div class="mvu-mobile-shell-head-actions">
              <button type="button" class="mvu-mobile-shell-close" aria-label="关闭" @click="closeShell">&times;</button>
            </div>
          </header>

          <div class="mvu-mobile-shell-body">
            <div class="mvu-mobile-shell-scroll" :class="{ 'is-detail': shellScreen === 'detail' }">
              <section v-if="shellScreen === 'detail'" class="mvu-mobile-library mvu-mobile-library--detail" :data-target="shellDetailPreviewKey || tabState.current">
                <div ref="modalHostRef" class="mvu-mobile-shell-modal-host"></div>
              </section>

              <section v-else class="mvu-mobile-library" :data-target="tabState.current">
                <section v-if="tabState.current === 'page-archive'" class="mvu-mobile-library-page" data-target="page-archive">
                  <div class="mvu-mobile-card mvu-mobile-card--hero clickable" data-preview="生命图谱详细页" data-unified-card="archive-core" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card-grid mvu-mobile-card-grid--two">
                    <div class="mvu-mobile-card clickable" data-unified-card="primary-spirit" data-unified-surface="shell"></div>
                    <div class="mvu-mobile-card clickable" data-unified-card="secondary-spirit" data-unified-surface="shell"></div>
                  </div>
                  <div class="mvu-mobile-card-grid mvu-mobile-card-grid--two">
                    <div class="mvu-mobile-card clickable" data-preview="武装工坊详细页" data-unified-card="armory" data-unified-surface="shell"></div>
                    <div class="mvu-mobile-card clickable" data-preview="储物仓库详细页" data-unified-card="vault" data-unified-surface="shell"></div>
                  </div>
                  <div class="mvu-mobile-card clickable" data-preview="社会档案详细页" data-unified-card="social" data-unified-surface="shell"></div>
                </section>

                <section v-if="tabState.current === 'page-map'" class="mvu-mobile-library-page" data-target="page-map">
                  <div class="mvu-mobile-card mvu-mobile-card--hero clickable" data-preview="当前节点详情" data-unified-card="map-locals" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card clickable" data-preview="当前节点详情" data-unified-card="map-current" data-unified-surface="shell"></div>
                </section>

                <section v-if="tabState.current === 'page-world'" class="mvu-mobile-library-page" data-target="page-world">
                  <div class="mvu-mobile-card mvu-mobile-card--hero clickable" data-preview="世界状态总览" data-unified-card="world-hero" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card-grid mvu-mobile-card-grid--two">
                    <div class="mvu-mobile-card clickable" data-preview="编年史档案" data-unified-card="world-timeline" data-unified-surface="shell"></div>
                    <div class="mvu-mobile-card clickable" data-preview="拍卖与警报" data-unified-card="world-alerts" data-unified-surface="shell"></div>
                  </div>
                </section>

                <section v-if="tabState.current === 'page-org'" class="mvu-mobile-library-page" data-target="page-org">
                  <div class="mvu-mobile-card mvu-mobile-card--hero clickable" data-preview="势力矩阵总览" data-unified-card="org-hero" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card-grid mvu-mobile-card-grid--two">
                    <div class="mvu-mobile-card clickable" data-preview="我的阵营详情" data-unified-card="org-faction" data-unified-surface="shell"></div>
                    <div class="mvu-mobile-card clickable" data-preview="本地据点详情" data-unified-card="org-node" data-unified-surface="shell"></div>
                  </div>
                </section>

                <section v-if="tabState.current === 'page-terminal'" class="mvu-mobile-library-page" data-target="page-terminal">
                  <div class="mvu-mobile-card mvu-mobile-card--hero clickable" data-preview="系统播报与日志" data-unified-card="terminal-hero" data-unified-surface="shell"></div>
                  <div class="mvu-mobile-card-grid mvu-mobile-card-grid--two">
                    <div class="mvu-mobile-card clickable" data-preview="试炼与情报" data-unified-card="terminal-intel" data-unified-surface="shell"></div>
                    <div class="mvu-mobile-card clickable" data-preview="近期见闻" data-unified-card="terminal-news" data-unified-surface="shell"></div>
                    <div class="mvu-mobile-card clickable" data-preview="怪物图鉴" data-unified-card="terminal-bestiary" data-unified-surface="shell"></div>
                    <div class="mvu-mobile-card clickable" data-preview="任务界面" data-unified-card="terminal-quest" data-unified-surface="shell"></div>
                  </div>
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
              :class="{ active: tabState.current === tab.id }"
              :data-target="tab.id"
              @click="enterSection(tab.id)"
            >
              <span class="mvu-mobile-shell-tab-icon" aria-hidden="true" v-html="tab.icon"></span>
              <span class="mvu-mobile-shell-tab-label">{{ tab.label }}</span>
            </button>
          </nav>
        </div>
      </section>
    </div>
  `,
  setup() {
    const launcherRef = ref(null);
    const shellFrameRef = ref(null);
    const modalHostRef = ref(null);
    const shellScreen = ref('section');
    const shellDetailPreviewKey = ref('');
    const shellDetailReturnScreen = ref('section');
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
      longPressTriggered: false,
      longPressTimer: null
    };

    const launcherPosition = computed(() => resolveSurfaceLauncherDisplayPosition());
    const launcherStyle = computed(() => {
      const position = launcherPosition.value;
      return {
        transform: `translate3d(${Math.round(position.x)}px, ${Math.round(position.y)}px, 0)`
      };
    });
    const shellOffset = reactive({ x: 0, y: 0 });
    const shellDragState = {
      pointerId: null,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      dragging: false
    };
    const clampShellOffset = nextValue => {
      const shellLayer = shellFrameRef.value && typeof shellFrameRef.value.closest === 'function'
        ? shellFrameRef.value.closest('.mvu-mobile-shell')
        : null;
      const shellRect = shellLayer && typeof shellLayer.getBoundingClientRect === 'function'
        ? shellLayer.getBoundingClientRect()
        : { width: window.innerWidth || 0, height: window.innerHeight || 0 };
      const frameRect = shellFrameRef.value && typeof shellFrameRef.value.getBoundingClientRect === 'function'
        ? shellFrameRef.value.getBoundingClientRect()
        : { width: 0, height: 0 };
      const margin = 10;
      const limitX = Math.max(0, ((shellRect.width || 0) - (frameRect.width || 0)) / 2 - margin);
      const limitY = Math.max(0, ((shellRect.height || 0) - (frameRect.height || 0)) / 2 - margin);
      return {
        x: _.clamp(Number(nextValue && nextValue.x) || 0, -limitX, limitX),
        y: _.clamp(Number(nextValue && nextValue.y) || 0, -limitY, limitY)
      };
    };
    const syncShellOffset = nextValue => {
      const nextOffset = clampShellOffset(nextValue || shellOffset);
      shellOffset.x = nextOffset.x;
      shellOffset.y = nextOffset.y;
      return nextOffset;
    };
    const shellFrameStyle = computed(() => ({
      '--mvu-shell-offset-x': `${Math.round(shellOffset.x)}px`,
      '--mvu-shell-offset-y': `${Math.round(shellOffset.y)}px`
    }));
    const shellVisible = computed(() => !!mvuLayoutState.mobileShellOpen);
    const showLauncher = computed(() => !(mvuLayoutState.isMobileViewport && shellVisible.value));
    const showLauncherMenu = computed(() => true);
    const launcherMode = computed(() => getDesktopModeSelection());
    const activeApp = computed(() => resolveShellAppMeta(mvuTabState.current));
    const showHomeBack = computed(() => shellScreen.value === 'detail');
    const resolvedActiveTitle = computed(() => {
      if (shellScreen.value === 'detail') return resolveShellPreviewTitle(shellDetailPreviewKey.value, activeApp.value.title);
      return activeApp.value.title;
    });
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
      const nextValue = !!nextOpen;
      if (mvuLayoutState.surfaceLauncherMenuOpen === nextValue) return nextValue;
      mvuLayoutState.surfaceLauncherMenuOpen = nextValue;
      applyLayoutBodyClasses();
      return nextValue;
    };

    const closeLauncherMenu = () => setLauncherMenuOpen(false);
    const ensureShellTab = () => {
      const normalized = normalizeShellTabId(mvuTabState.current);
      if (mvuTabState.current !== normalized) {
        setSharedTab(normalized);
        writeMobileLastTabStorage(normalized);
      }
      return normalized;
    };
    const clearLongPressTimer = () => {
      if (dragState.longPressTimer) {
        window.clearTimeout(dragState.longPressTimer);
        dragState.longPressTimer = null;
      }
    };

    const detachPointerListeners = () => {
      clearLongPressTimer();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
    };
    const detachShellPointerListeners = () => {
      window.removeEventListener('pointermove', handleShellPointerMove);
      window.removeEventListener('pointerup', handleShellPointerEnd);
      window.removeEventListener('pointercancel', handleShellPointerEnd);
    };

    function handleShellPointerMove(event) {
      if (event.pointerId !== shellDragState.pointerId) return;
      const deltaX = event.clientX - shellDragState.startX;
      const deltaY = event.clientY - shellDragState.startY;
      if (!shellDragState.dragging && Math.hypot(deltaX, deltaY) < 6) return;
      shellDragState.dragging = true;
      syncShellOffset({
        x: shellDragState.originX + deltaX,
        y: shellDragState.originY + deltaY
      });
    }

    function handleShellPointerEnd(event) {
      if (event.pointerId !== shellDragState.pointerId) return;
      detachShellPointerListeners();
      shellDragState.pointerId = null;
      shellDragState.dragging = false;
      syncShellOffset();
    }

    const onShellHeaderPointerDown = event => {
      if (!shellVisible.value) return;
      if (typeof event.button === 'number' && event.button !== 0) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target && target.closest('button, a, input, textarea, select, label')) return;
      event.preventDefault();
      shellDragState.pointerId = event.pointerId;
      shellDragState.startX = event.clientX;
      shellDragState.startY = event.clientY;
      shellDragState.originX = shellOffset.x;
      shellDragState.originY = shellOffset.y;
      shellDragState.dragging = false;
      if (event.currentTarget && typeof event.currentTarget.setPointerCapture === 'function') {
        try { event.currentTarget.setPointerCapture(event.pointerId); } catch (err) {}
      }
      window.addEventListener('pointermove', handleShellPointerMove);
      window.addEventListener('pointerup', handleShellPointerEnd);
      window.addEventListener('pointercancel', handleShellPointerEnd);
    };

    const runLauncherAction = () => {
      closeLauncherMenu();
      toggleShellSurface();
    };

    const finishDrag = () => {
      detachPointerListeners();
      dragState.pointerId = null;
      const moved = dragState.moved;
      const longPressTriggered = dragState.longPressTriggered;
      dragState.moved = false;
      dragState.longPressTriggered = false;
      mvuLayoutState.surfaceLauncherDragging = false;
      if (moved) {
        syncSurfaceLauncherPosition({ persist: true });
        return;
      }
      if (longPressTriggered) return;
      runLauncherAction();
    };

    function handlePointerMove(event) {
      if (event.pointerId !== dragState.pointerId) return;
      const deltaX = event.clientX - dragState.startX;
      const deltaY = event.clientY - dragState.startY;
      if (dragState.longPressTriggered) return;
      if (!dragState.moved && Math.hypot(deltaX, deltaY) >= SURFACE_LAUNCHER_DRAG_THRESHOLD) {
        dragState.moved = true;
        mvuLayoutState.surfaceLauncherDragging = true;
        clearLongPressTimer();
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

    const beginLauncherPointer = (event) => {
      if (typeof event.button === 'number' && event.button !== 0) return;
      event.preventDefault();
      const position = resolveSurfaceLauncherDisplayPosition();
      dragState.pointerId = event.pointerId;
      dragState.startX = event.clientX;
      dragState.startY = event.clientY;
      dragState.originX = position.x;
      dragState.originY = position.y;
      dragState.moved = false;
      dragState.longPressTriggered = false;
      mvuLayoutState.surfaceLauncherDragging = false;
      if (event.currentTarget && typeof event.currentTarget.setPointerCapture === 'function') {
        try { event.currentTarget.setPointerCapture(event.pointerId); } catch (err) {}
      }
      clearLongPressTimer();
      dragState.longPressTimer = window.setTimeout(() => {
        if (dragState.pointerId !== event.pointerId || dragState.moved) return;
        dragState.longPressTriggered = true;
        setLauncherMenuOpen(true);
      }, SURFACE_LAUNCHER_LONG_PRESS_MS);
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerEnd);
      window.addEventListener('pointercancel', handlePointerEnd);
    };

    const onLauncherPointerDown = event => beginLauncherPointer(event);
    const onLauncherKeyboardAction = () => runLauncherAction();
    const onLauncherContextMenu = () => {
      setLauncherMenuOpen(true);
    };

    const resetShellDetailState = nextScreen => {
      shellDetailPreviewKey.value = '';
      shellDetailReturnScreen.value = 'section';
      shellScreen.value = nextScreen === 'detail' ? 'detail' : 'section';
    };
    const openShellPreview = previewKey => {
      const nextPreviewKey = String(previewKey || '').trim();
      if (!nextPreviewKey) return;
      shellDetailReturnScreen.value = 'section';
      shellDetailPreviewKey.value = nextPreviewKey;
      shellScreen.value = 'detail';
      const run = () => {
        if (typeof window.__MVU_OPEN_SHELL_PREVIEW__ === 'function') {
          try { window.__MVU_OPEN_SHELL_PREVIEW__(nextPreviewKey, { preserveMapDispatchContext: true }); } catch (err) {}
        }
      };
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(() => window.requestAnimationFrame(run));
      } else {
        window.setTimeout(run, 0);
      }
    };
    const closeShellDetail = nextScreen => {
      if (typeof window.__MVU_CLOSE_DETAIL_MODAL__ === 'function') {
        try { window.__MVU_CLOSE_DETAIL_MODAL__(); } catch (err) {}
      }
      resetShellDetailState(nextScreen || shellDetailReturnScreen.value || 'section');
    };
    const closeShell = () => closeShellSurface();
    const handleBackdropClick = event => {
      if (!event) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const handleShellPreviewClick = event => {
      if (shellScreen.value === 'detail') return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target || !shellFrameRef.value || !shellFrameRef.value.contains(target)) return;
      if (typeof window.__MVU_CONSUME_LONG_PRESS_CLICK__ === 'function' && window.__MVU_CONSUME_LONG_PRESS_CLICK__(target)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      const previewClickable = target.closest('.clickable[data-preview]');
      if (!previewClickable || !shellFrameRef.value.contains(previewClickable)) return;
      if (previewClickable.closest('.mvu-mobile-shell-nav')) return;
      const previewKey = String(previewClickable.getAttribute('data-preview') || '').trim();
      if (!previewKey) return;
      event.preventDefault();
      event.stopPropagation();
      openShellPreview(previewKey);
    };
    const enterSection = tabId => {
      if (shellScreen.value === 'detail') {
        closeShellDetail('section');
      }
      requestTabChange(normalizeShellTabId(tabId));
      shellScreen.value = 'section';
    };
    const handleBack = () => {
      if (shellScreen.value !== 'detail') return;
      closeShellDetail(shellDetailReturnScreen.value || 'section');
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
        ensureShellTab();
        resetShellDetailState('section');
        closeLauncherMenu();
        if (typeof window.requestAnimationFrame === 'function') {
          window.requestAnimationFrame(() => syncShellOffset());
        } else {
          window.setTimeout(() => syncShellOffset(), 0);
        }
      } else {
        detachShellPointerListeners();
        shellDragState.pointerId = null;
        shellDragState.dragging = false;
        shellDetailPreviewKey.value = '';
      }
      requestUnifiedShellCardRefresh({ force: true });
    });

    watch(() => mvuTabState.current, nextTab => {
      if (shellVisible.value && normalizeShellTabId(nextTab) !== nextTab) {
        ensureShellTab();
        return;
      }
      requestUnifiedShellCardRefresh({ force: true });
    });

    watch(shellScreen, nextScreen => {
      if (nextScreen === 'section') {
        ensureShellTab();
      }
      requestUnifiedShellCardRefresh({ force: true });
    });

    const bridge = {
      isAvailable: () => true,
      isOpen: () => !!mvuLayoutState.mobileShellOpen,
      isDetailActive: () => shellScreen.value === 'detail',
      getModalHost: () => modalHostRef.value,
      getShellFrame: () => shellFrameRef.value,
      open: () => openShellSurface(),
      close: () => closeShellSurface(),
      toggle: () => toggleShellSurface(),
      openPreview: previewKey => openShellPreview(previewKey),
      onPreviewChange: payload => {
        const previewKey = typeof payload === 'string'
          ? payload
          : String(payload && payload.previewKey || '').trim();
        if (!previewKey) return;
        if (shellScreen.value !== 'detail') shellDetailReturnScreen.value = 'section';
        shellDetailPreviewKey.value = previewKey;
        shellScreen.value = 'detail';
      },
      onPreviewClosed: () => {
        if (shellScreen.value !== 'detail') return;
        resetShellDetailState(shellDetailReturnScreen.value || 'section');
      },
      syncLauncherPosition: options => syncSurfaceLauncherPosition(options)
    };

    onMounted(() => {
      window.__MVU_MOBILE_SHELL__ = bridge;
      syncSurfaceLauncherPosition({ persist: true });
      syncShellOffset();
      window.addEventListener('click', handleShellPreviewClick, true);
      window.addEventListener('pointerdown', handleWindowPointerDown, true);
      window.addEventListener('keydown', handleWindowKeydown);
      window.addEventListener('resize', syncShellOffset);
      if (mvuLayoutState.mobileShellOpen) ensureShellTab();
      requestUnifiedShellCardRefresh({ force: true });
      if (typeof window.__MVU_SYNC_DETAIL_MODAL_HOST__ === 'function') {
        try { window.__MVU_SYNC_DETAIL_MODAL_HOST__(); } catch (err) {}
      }
    });

    onUnmounted(() => {
      detachPointerListeners();
      detachShellPointerListeners();
      window.removeEventListener('click', handleShellPreviewClick, true);
      window.removeEventListener('pointerdown', handleWindowPointerDown, true);
      window.removeEventListener('keydown', handleWindowKeydown);
      window.removeEventListener('resize', syncShellOffset);
      if (window.__MVU_MOBILE_SHELL__ === bridge) {
        delete window.__MVU_MOBILE_SHELL__;
      }
    });

    return {
      tabs: SHELL_TAB_ITEMS,
      resolvedActiveTitle,
      enterSection,
      handleBack,
      launcherMainAriaLabel,
      launcherMenuAlign,
      launcherModeItems,
      launcherMenuVertical,
      launcherMode,
      launcherStyle,
      launcherRef,
      onLauncherContextMenu,
      onLauncherKeyboardAction,
      onLauncherPointerDown,
      selectLauncherMode,
      shellVisible,
      shellDetailPreviewKey,
      shellScreen,
      showHomeBack,
      showLauncher,
      showLauncherMenu,
      tabState: mvuTabState,
      layoutState: mvuLayoutState,
      shellFrameRef,
      shellFrameStyle,
      modalHostRef,
      closeShell,
      handleBackdropClick,
      onShellHeaderPointerDown
    };
  }
};

const DesktopUnifiedLayout = {
  template: `
    <div class="mvu-unified-shell mvu-unified-panel-host mvu-root">
      <div class="mvu-unified-frame" :class="{ 'is-detail': detailState.isOpen }">
        <div class="mvu-unified-toolbar" :class="{ 'is-detail': detailState.isOpen }">
          <div class="mvu-unified-toolbar-main">
            <template v-if="detailState.isOpen">
              <button type="button" class="mvu-unified-detail-back" aria-label="返回" @click="closeUnifiedDetail">‹</button>
              <strong class="mvu-unified-detail-title">{{ detailTitle }}</strong>
            </template>
            <template v-else>
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
                      :class="{ active: layoutState.surfaceMode !== 'shell' && layoutState.preferredMode === 'split' }"
                      @click="setDesktopMode('split')"
                    >分栏</button>
                    <button
                      type="button"
                      class="mvu-unified-layout-btn"
                      :class="{ active: layoutState.surfaceMode !== 'shell' && layoutState.preferredMode === 'unified' }"
                      @click="setDesktopMode('unified')"
                    >一体</button>
                    <button
                      type="button"
                      class="mvu-unified-layout-btn"
                      :class="{ active: layoutState.surfaceMode === 'shell' }"
                      @click="setDesktopMode('shell')"
                    >手机</button>
                  </template>
                  <span v-else class="mvu-unified-lock-note">移动端锁定一体栏</span>
                </div>
              </div>
            </template>
          </div>

          <div v-if="!detailState.isOpen" class="mvu-unified-tab-row">
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

        <div v-show="!detailState.isOpen" class="mvu-unified-page-stack">
          <section class="mvu-unified-page" :class="{ active: tabState.current === 'page-archive' }" data-target="page-archive">
            <div class="mvu-unified-section-stack">
              <section class="mvu-unified-section">
                <div class="mvu-unified-section-headline">
                  <div class="mvu-unified-section-copy">
                    <b class="mvu-unified-section-title">详细档案</b>
                    <span class="mvu-unified-section-note">状态 / 修为 / 外观</span>
                  </div>
                  <div class="mvu-unified-chip-row">
                    <button type="button" class="mvu-unified-chip clickable" data-preview="角色切换器">角色</button>
                    <button type="button" class="mvu-unified-chip clickable" data-preview="生命图谱详细页">详细档案</button>
                  </div>
                </div>
                <div class="mvu-unified-card mvu-unified-card--featured clickable" data-preview="生命图谱详细页" data-unified-card="archive-core" data-unified-surface="panel"></div>
              </section>

              <section class="mvu-unified-section">
                <div class="mvu-unified-section-headline">
                  <div class="mvu-unified-section-copy">
                    <b class="mvu-unified-section-title">武魂与能力</b>
                    <span class="mvu-unified-section-note">主武魂 / 第二武魂</span>
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
                <div class="mvu-unified-map-stage" data-mvu-map-stage="panel"></div>
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
                    <span class="mvu-unified-section-note">时间线、拍卖与全局警报</span>
                  </div>
                  <div class="mvu-unified-chip-row">
                    <button type="button" class="mvu-unified-chip clickable" data-preview="世界状态总览">总览</button>
                    <button type="button" class="mvu-unified-chip clickable" data-preview="编年史档案">编年</button>
                  </div>
                </div>
                <div class="mvu-unified-card mvu-unified-card--featured" data-unified-card="world-hero" data-unified-surface="panel"></div>
              </section>

              <section class="mvu-unified-section">
                <div class="mvu-unified-grid mvu-unified-grid--two">
                  <div class="mvu-unified-card clickable" data-preview="编年史档案" data-unified-card="world-timeline" data-unified-surface="panel"></div>
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

        <section v-show="detailState.isOpen" class="mvu-unified-detail-page" :data-unified-detail-preview="detailState.previewKey">
          <div ref="detailHostRef" class="mvu-unified-detail-host" data-unified-detail-host></div>
        </section>
      </div>
    </div>
  `,
  setup() {
    const activeMeta = computed(() => resolveUnifiedTabMeta(mvuTabState.current));
    const splitLocked = computed(() => !isSplitLayoutAllowed());
    const modeBadge = computed(() => (mvuLayoutState.isMobileViewport ? '移动端一体栏' : '桌面一体栏'));
    const detailHostRef = ref(null);
    const detailState = mvuUnifiedDetailState;
    const detailTitle = computed(() => resolveShellPreviewTitle(detailState.previewKey, activeMeta.value.title));
    const getDetailScrollTarget = () => {
      let current = detailHostRef.value ? detailHostRef.value.closest('.mvu-unified-frame') : document.getElementById('mvu-unified-mount');
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
    };
    const scheduleFrameTask = task => {
      const run = () => {
        if (typeof task === 'function') task();
      };
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(() => window.requestAnimationFrame(run));
      } else {
        window.setTimeout(run, 0);
      }
    };
    const syncUnifiedFrameViewport = () => {
      const frame = (detailHostRef.value && detailHostRef.value.closest('.mvu-unified-frame'))
        || document.querySelector('#mvu-unified-mount .mvu-unified-frame');
      if (!frame || !frame.isConnected) return;
      const viewportHeight = Number(window.innerHeight) || Number(document.documentElement.clientHeight) || 720;
      const sendForm = document.getElementById('send_form');
      const sendRect = sendForm ? sendForm.getBoundingClientRect() : null;
      const bottomLimit = sendRect && sendRect.top > 80 && sendRect.top < viewportHeight
        ? sendRect.top - 10
        : viewportHeight - 10;
      const topLimit = 42;
      const frameMaxHeight = Math.max(360, Math.min(760, bottomLimit - topLimit));
      frame.style.setProperty('--mvu-unified-frame-max-height', `${Math.floor(frameMaxHeight)}px`);

      const detailHost = detailHostRef.value;
      if (detailHost && detailHost.isConnected) {
        const toolbar = frame.querySelector('.mvu-unified-toolbar');
        const toolbarHeight = toolbar ? toolbar.getBoundingClientRect().height : 64;
        const detailMaxHeight = Math.max(260, frameMaxHeight - toolbarHeight - 28);
        detailHost.style.setProperty('--mvu-unified-detail-max-height', `${Math.floor(detailMaxHeight)}px`);
      }

      const scrollTarget = getDetailScrollTarget();
      const scrollByAmount = amount => {
        if (!Number.isFinite(amount) || Math.abs(amount) < 1) return;
        if (scrollTarget === document.scrollingElement || scrollTarget === document.documentElement || scrollTarget === document.body) {
          window.scrollBy({ top: amount, behavior: 'auto' });
        } else if (scrollTarget) {
          scrollTarget.scrollTop += amount;
        }
      };

      let frameRect = frame.getBoundingClientRect();
      const bottomOverflow = frameRect.bottom - bottomLimit;
      if (bottomOverflow > 1) {
        scrollByAmount(bottomOverflow);
        frameRect = frame.getBoundingClientRect();
      }
      const topOverflow = topLimit - frameRect.top;
      if (topOverflow > 1) {
        scrollByAmount(-topOverflow);
      }
    };
    const scheduleUnifiedFrameViewportSync = () => {
      scheduleFrameTask(syncUnifiedFrameViewport);
      [120, 360, 760].forEach(delay => {
        window.setTimeout(syncUnifiedFrameViewport, delay);
      });
    };
    const rememberReturnScroll = () => {
      const target = getDetailScrollTarget();
      detailState.returnScrollTop = target === document.scrollingElement || target === document.documentElement || target === document.body
        ? Number(window.scrollY) || Number(target.scrollTop) || 0
        : Number(target.scrollTop) || 0;
    };
    const restoreReturnScroll = () => {
      const target = getDetailScrollTarget();
      const nextTop = Math.max(0, Number(detailState.returnScrollTop) || 0);
      if (target === document.scrollingElement || target === document.documentElement || target === document.body) {
        window.scrollTo({ top: nextTop, behavior: 'auto' });
      } else {
        target.scrollTop = nextTop;
      }
    };
    const requestUnifiedDetailRender = (options = {}) => {
      const nextPreviewKey = String(detailState.previewKey || '').trim();
      scheduleFrameTask(() => {
        const host = detailHostRef.value;
        if (!host || !host.isConnected || !nextPreviewKey || !detailState.isOpen) return;
        if (typeof window.__MVU_RENDER_UNIFIED_PREVIEW__ !== 'function') return;
        try {
          const rendered = window.__MVU_RENDER_UNIFIED_PREVIEW__(nextPreviewKey, { ...options, host });
          if (rendered === false && detailState.previewKey === nextPreviewKey) {
            closeUnifiedDetail({ force: true });
            return;
          }
          syncUnifiedFrameViewport();
        } catch (err) {}
      });
    };
    const openUnifiedPreview = (previewKey, options = {}) => {
      const nextPreviewKey = String(previewKey || '').trim();
      if (!nextPreviewKey) return false;
      if (!detailState.isOpen) {
        detailState.returnTab = normalizeTabId(mvuTabState.current);
        detailState.stack.splice(0);
        rememberReturnScroll();
      } else if (!options.replace && detailState.previewKey && detailState.previewKey !== nextPreviewKey) {
        detailState.stack.push(detailState.previewKey);
      }
      detailState.previewKey = nextPreviewKey;
      detailState.isOpen = true;
      requestUnifiedDetailRender(options);
      scheduleUnifiedFrameViewportSync();
      return true;
    };
    const closeUnifiedDetail = (options = {}) => {
      if (!options.force && detailState.stack.length) {
        detailState.previewKey = detailState.stack.pop() || '';
        requestUnifiedDetailRender({ replace: true });
        return;
      }
      detailState.isOpen = false;
      detailState.previewKey = '';
      detailState.stack.splice(0);
      if (typeof window.__MVU_CLEAR_UNIFIED_PREVIEW__ === 'function') {
        try { window.__MVU_CLEAR_UNIFIED_PREVIEW__(); } catch (err) {}
      }
      requestTabChange(normalizeTabId(detailState.returnTab));
      scheduleFrameTask(restoreReturnScroll);
    };
    const requestMapSurfaceSync = () => {
      if (typeof window.__sheepMapResync !== 'function') return;
      window.setTimeout(() => {
        try { window.__sheepMapResync({ center: false, syncVisual: false }); } catch (err) {}
        if (typeof window.__MVU_CLAMP_UNIFIED_MAP_CANVAS__ === 'function') {
          try { window.__MVU_CLAMP_UNIFIED_MAP_CANVAS__(); } catch (err) {}
          window.setTimeout(() => {
            try { window.__MVU_CLAMP_UNIFIED_MAP_CANVAS__(); } catch (err) {}
          }, 80);
        }
      }, 40);
    };
    const setUnifiedTab = tabId => {
      requestTabChange(tabId);
      scheduleUnifiedFrameViewportSync();
    };
    onMounted(() => {
      window.__MVU_OPEN_UNIFIED_PREVIEW__ = openUnifiedPreview;
      window.__MVU_CLOSE_UNIFIED_PREVIEW__ = closeUnifiedDetail;
      window.__MVU_GET_UNIFIED_DETAIL_HOST__ = () => detailHostRef.value;
      window.addEventListener('resize', scheduleUnifiedFrameViewportSync);
      scheduleUnifiedFrameViewportSync();
      if (mvuTabState.current === 'page-map') {
        requestMapSurfaceSync();
      }
      if (detailState.isOpen && detailState.previewKey) {
        requestUnifiedDetailRender({ force: true, replace: true });
      }
    });
    onUnmounted(() => {
      window.removeEventListener('resize', scheduleUnifiedFrameViewportSync);
      if (window.__MVU_OPEN_UNIFIED_PREVIEW__ === openUnifiedPreview) delete window.__MVU_OPEN_UNIFIED_PREVIEW__;
      if (window.__MVU_CLOSE_UNIFIED_PREVIEW__ === closeUnifiedDetail) delete window.__MVU_CLOSE_UNIFIED_PREVIEW__;
      if (typeof window.__MVU_GET_UNIFIED_DETAIL_HOST__ === 'function' && window.__MVU_GET_UNIFIED_DETAIL_HOST__() === detailHostRef.value) {
        delete window.__MVU_GET_UNIFIED_DETAIL_HOST__;
      }
    });
    watch(() => mvuLayoutState.effectiveMode, nextMode => {
      if (nextMode !== 'unified' && detailState.isOpen) {
        closeUnifiedDetail({ force: true });
      }
    });
    watch(() => mvuLayoutState.surfaceMode, nextMode => {
      if (nextMode === 'shell' && detailState.isOpen) {
        closeUnifiedDetail({ force: true });
      }
    });
    watch(() => mvuTabState.current, () => {
      scheduleUnifiedFrameViewportSync();
    });
    return {
      tabs: TAB_ITEMS,
      activeMeta,
      closeUnifiedDetail,
      detailHostRef,
      detailState,
      detailTitle,
      splitLocked,
      modeBadge,
      tabState: mvuTabState,
      layoutState: mvuLayoutState,
      setTab: setUnifiedTab,
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
