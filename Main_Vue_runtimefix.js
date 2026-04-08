
const { createApp, ref, onMounted } = Vue;

const LeftPanel = {
  template: `
    <div class="mvu-vue-wrapper left-panel" :class="{ 'is-folded': isFolded }" style="position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;">
      <div class="split-shell-bg-sibling split-shell-bg-left"></div>
      <div class="split-shell split-shell-left">
        <button class="mvu-fold-btn left-btn" @click="toggleFold">{{ isFolded ? '>' : '<' }}</button>
        <div class="ring-group top-left-rings"><div class="astro-circle ring-cyan-1"></div><div class="astro-circle ring-cyan-2"></div><div class="astro-circle ring-cyan-3"></div></div>
        <div class="ring-group bottom-right-rings"><div class="astro-circle ring-gold-1"></div><div class="astro-circle ring-gold-2"></div><div class="astro-circle ring-gold-3"></div></div>
        
        <div class="split-shell-stage" id="splitLeftStage" v-once>
          <div class="split-page split-left-page active" data-target="page-archive">
            <div class="split-archive-stack split-archive-left">
              <div class="archive-split-topline">
                <div class="archive-split-loc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg><span></span></div>
                <div class="archive-split-name"><span class="char-emblem">◈</span><span class="archive-split-name-text"></span></div>
              </div>
              <div class="panel core-card clickable" data-preview="生命图谱详细页"></div>
              <div class="strip dual-spirit-strip single-track"><div class="dual-spirit-body"><div class="spirit-side primary-side clickable" id="archivePrimarySpiritEntry" data-preview="第一武魂详细页"></div><div class="spirit-side secondary-side clickable"></div></div></div>
              <div class="strip dual-spirit-strip secondary-track split-secondary-left"><div class="dual-spirit-body"><div class="spirit-side primary-side clickable"></div><div class="spirit-side secondary-side clickable" id="archiveSecondarySpiritEntry" data-preview="血脉封印详细页"></div></div></div>
            </div>
          </div>
          <div class="split-page split-left-page" data-target="page-map"><div class="module-card hero-card core-card map-hero-card clickable" data-preview="全息星图主画布"></div></div>
          <div class="split-page split-left-page" data-target="page-world"><div class="module-card hero-card core-card clickable" data-preview="世界状态总览"></div></div>
          <div class="split-page split-left-page" data-target="page-org"><div class="module-card hero-card core-card clickable" data-preview="势力矩阵总览"></div></div>
          <div class="split-page split-left-page" data-target="page-terminal"><div class="module-card hero-card core-card terminal-hero-card clickable" data-preview="系统播报与日志"></div></div>
        </div>

        <div class="footer-tabs split-footer-tabs split-side-tabs-left" id="splitFooterTabsLeft">
          <button class="tab-btn active" data-target="page-archive" onclick="window.mvuSetMainTab('page-archive')">档案</button>
          <button class="tab-btn" data-target="page-map" onclick="window.mvuSetMainTab('page-map')">星图</button>
          <button class="tab-btn" data-target="page-world" onclick="window.mvuSetMainTab('page-world')">世界</button>
          <button class="tab-btn" data-target="page-org" onclick="window.mvuSetMainTab('page-org')">势力</button>
          <button class="tab-btn" data-target="page-terminal" onclick="window.mvuSetMainTab('page-terminal')">终端</button>
        </div>
      </div>
    </div>
  `,
  setup() {
    const isFolded = ref(false);
    return { isFolded, toggleFold: () => { isFolded.value = !isFolded.value; } };
  }
};

const RightPanel = {
  template: `
    <div class="mvu-vue-wrapper right-panel" :class="{ 'is-folded': isFolded }" style="position: fixed; top: 0; right: 0; bottom: 0; z-index: 100;">
      <div class="split-shell-bg-sibling split-shell-bg-right"></div>
      <div class="split-shell split-shell-right">
        <button class="mvu-fold-btn right-btn" @click="toggleFold">{{ isFolded ? '<' : '>' }}</button>
        <div class="ring-group top-left-rings"><div class="astro-circle ring-cyan-1"></div><div class="astro-circle ring-cyan-2"></div><div class="astro-circle ring-cyan-3"></div></div>
        <div class="ring-group bottom-right-rings"><div class="astro-circle ring-gold-1"></div><div class="astro-circle ring-gold-2"></div><div class="astro-circle ring-gold-3"></div></div>
        
        <div class="split-shell-stage" id="splitRightStage" v-once>
          <div class="split-page split-right-page active" data-target="page-archive">
            <div class="split-archive-stack split-archive-right">
              <div class="right-stack"><div class="module-card entry-card clickable" data-preview="武装工坊详细页"></div><div class="module-card entry-card clickable" data-preview="储物仓库详细页"></div></div>
              <div class="simple-card archive-social-card">
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
          <div class="split-page split-right-page" data-target="page-map"><div class="stack-3 map-side-stack"><div class="simple-card live-card map-side-card clickable" data-preview="当前节点详情"></div><div class="simple-card entry-card map-side-card clickable" data-preview="图层控制与跑图"></div><div class="simple-card live-card map-side-card clickable" data-preview="动态地点与扩展节点"></div></div></div>
          <div class="split-page split-right-page" data-target="page-world"><div class="stack-3"><div class="simple-card live-card clickable" data-preview="编年史档案"></div><div class="simple-card entry-card clickable" data-preview="天道金榜"></div><div class="simple-card live-card clickable" data-preview="拍卖与警报"></div></div></div>
          <div class="split-page split-right-page" data-target="page-org"><div class="stack-3"><div class="simple-card live-card clickable" data-preview="我的阵营详情"></div><div class="simple-card live-card clickable" data-preview="本地据点详情"></div><div class="simple-card entry-card clickable" data-preview="交易网络"></div></div></div>
          <div class="split-page split-right-page" data-target="page-terminal"><div class="stack-3 terminal-side-stack"><div class="simple-card live-card terminal-side-card clickable" data-preview="操作总线"></div><div class="simple-card entry-card terminal-side-card clickable" data-preview="试炼与情报"></div><div class="simple-card live-card terminal-side-card clickable" data-preview="近期见闻"></div></div></div>
        </div>

        <div class="footer-tabs split-footer-tabs split-side-tabs-right" id="splitFooterTabsRight">
          <button class="tab-btn active" data-target="page-archive" onclick="window.mvuSetMainTab('page-archive')">档案</button>
          <button class="tab-btn" data-target="page-map" onclick="window.mvuSetMainTab('page-map')">星图</button>
          <button class="tab-btn" data-target="page-world" onclick="window.mvuSetMainTab('page-world')">世界</button>
          <button class="tab-btn" data-target="page-org" onclick="window.mvuSetMainTab('page-org')">势力</button>
          <button class="tab-btn" data-target="page-terminal" onclick="window.mvuSetMainTab('page-terminal')">终端</button>
        </div>
      </div>
    </div>
  `,
  setup() {
    const isFolded = ref(false);
    return { isFolded, toggleFold: () => { isFolded.value = !isFolded.value; } };
  }
};

const mountMvuVue = () => {
  const leftMount = document.getElementById('mvu-left-mount');
  const rightMount = document.getElementById('mvu-right-mount');
  if (leftMount) createApp(LeftPanel).mount(leftMount);
  if (rightMount) createApp(RightPanel).mount(rightMount);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountMvuVue);
} else {
  mountMvuVue();
}
