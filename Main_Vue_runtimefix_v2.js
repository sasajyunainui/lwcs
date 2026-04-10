const { createApp, ref, reactive } = Vue;

const mvuTabState = window.__MVU_TAB_STATE__ || (window.__MVU_TAB_STATE__ = reactive({ current: 'page-archive' }));
const mvuFoldState = window.__MVU_SIDE_FOLD_STATE__ || (window.__MVU_SIDE_FOLD_STATE__ = ref(true));
const mvuPinState = window.__MVU_PIN_STATE__ || (window.__MVU_PIN_STATE__ = ref(false));

function handleGlobalFold() {
  if (mvuPinState.value) return;
  if (window.__mvuFoldTimer) clearTimeout(window.__mvuFoldTimer);
  window.__mvuFoldTimer = setTimeout(() => {
    mvuFoldState.value = true;
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
            <div class="mvu-module-card hero-card core-card clickable" data-preview="世界状态总览"></div>
          </div>

          <div class="split-page split-left-page" :class="{ active: tabState.current === 'page-org' }" data-target="page-org">
            <div class="mvu-module-card hero-card core-card clickable" data-preview="势力矩阵总览"></div>
          </div>

          <div class="split-page split-left-page" :class="{ active: tabState.current === 'page-terminal' }" data-target="page-terminal">
            <div class="mvu-module-card hero-card core-card terminal-hero-card clickable" data-preview="系统播报与日志"></div>
          </div>
        </div>

        <div class="footer-tabs split-footer-tabs split-side-tabs-left" id="splitFooterTabsLeft">
          <button class="mvu-tab-btn" :class="{ active: tabState.current === 'page-archive' }" data-target="page-archive" @click="setTab('page-archive')">档案</button>
          <button class="mvu-tab-btn" :class="{ active: tabState.current === 'page-map' }" data-target="page-map" @click="setTab('page-map')">星图</button>
          <button class="mvu-tab-btn" :class="{ active: tabState.current === 'page-world' }" data-target="page-world" @click="setTab('page-world')">世界</button>
          <button class="mvu-tab-btn" :class="{ active: tabState.current === 'page-org' }" data-target="page-org" @click="setTab('page-org')">势力</button>
          <button class="mvu-tab-btn" :class="{ active: tabState.current === 'page-terminal' }" data-target="page-terminal" @click="setTab('page-terminal')">终端</button>
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
    return { isFolded, fold, unfold, toggleFold, tabState: mvuTabState, setTab: requestTabChange };
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
              <div class="mvu-simple-card entry-card clickable" data-preview="交易网络"></div>
            </div>
          </div>

          <div class="split-page split-right-page" :class="{ active: tabState.current === 'page-terminal' }" data-target="page-terminal">
            <div class="stack-3 terminal-side-stack">
              <div class="mvu-simple-card live-card terminal-side-card clickable" data-preview="操作总线"></div>
              <div class="mvu-simple-card entry-card terminal-side-card clickable" data-preview="试炼与情报"></div>
              <div class="mvu-simple-card live-card terminal-side-card clickable" data-preview="近期见闻"></div>
            </div>
          </div>
        </div>

        <div class="footer-tabs split-footer-tabs split-side-tabs-right" id="splitFooterTabsRight">
          <button class="mvu-tab-btn" :class="{ active: tabState.current === 'page-archive' }" data-target="page-archive" @click="setTab('page-archive')">档案</button>
          <button class="mvu-tab-btn" :class="{ active: tabState.current === 'page-map' }" data-target="page-map" @click="setTab('page-map')">星图</button>
          <button class="mvu-tab-btn" :class="{ active: tabState.current === 'page-world' }" data-target="page-world" @click="setTab('page-world')">世界</button>
          <button class="mvu-tab-btn" :class="{ active: tabState.current === 'page-org' }" data-target="page-org" @click="setTab('page-org')">势力</button>
          <button class="mvu-tab-btn" :class="{ active: tabState.current === 'page-terminal' }" data-target="page-terminal" @click="setTab('page-terminal')">终端</button>
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
    const fold = handleGlobalFold;
    const unfold = handleGlobalUnfold;
    const toggleFold = () => { isFolded.value = !isFolded.value; };
    const togglePin = () => { isPinned.value = !isPinned.value; };
    return { isFolded, isPinned, fold, unfold, toggleFold, togglePin, tabState: mvuTabState, setTab: requestTabChange };
  }
};

function mountMvuVue() {
  const leftMount = document.getElementById('mvu-left-mount');
  const rightMount = document.getElementById('mvu-right-mount');

  if (leftMount && !leftMount.__mvuVueMounted) {
    createApp(LeftPanel).mount(leftMount);
    leftMount.__mvuVueMounted = true;
  }

  if (rightMount && !rightMount.__mvuVueMounted) {
    createApp(RightPanel).mount(rightMount);
    rightMount.__mvuVueMounted = true;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountMvuVue);
} else {
  mountMvuVue();
}
