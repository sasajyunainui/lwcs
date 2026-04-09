!(function () {
  'use strict';

  const LOADER_ID = 'mvu_external_ui_vue_loader';
  const hostWin = (() => {
    try {
      if (window.parent && window.parent !== window && window.parent.document) return window.parent;
    } catch (e) {}
    return window;
  })();
  const hostDoc = hostWin.document;

  if (hostWin[LOADER_ID]) return;
  hostWin[LOADER_ID] = true;

  const VERSION = '20250118k';
  const CDN_BASE = 'https://cdn.jsdelivr.net/gh/sasajyunainui/lwcs@main/';
  const VUE_URL = 'https://unpkg.com/vue@3.5.13/dist/vue.global.prod.js';

  const cssList = [
    CDN_BASE + 'mvu_styles.css?v=' + VERSION
  ];

  const jsList = [
    CDN_BASE + 'TradeUI_Module.js?v=' + VERSION,
    CDN_BASE + 'ProfessionUI_Module.js?v=' + VERSION,
    CDN_BASE + 'BattleUI_Module.js?v=' + VERSION,
    CDN_BASE + 'sheep_map_restore.js?v=' + VERSION,
    CDN_BASE + 'Main_Vue_runtimefix_v2.js?v=' + VERSION,
    CDN_BASE + 'mvu_logic_bridge.js?v=' + VERSION
  ];

  function ensureHostNodes() {
    if (!hostDoc.body) return;

    if (!hostDoc.getElementById('mvu-left-mount')) {
      const left = hostDoc.createElement('div');
      left.id = 'mvu-left-mount';
      hostDoc.body.appendChild(left);
    }

    if (!hostDoc.getElementById('mvu-right-mount')) {
      const right = hostDoc.createElement('div');
      right.id = 'mvu-right-mount';
      hostDoc.body.appendChild(right);
    }

    if (!hostDoc.getElementById('battle-overlay')) {
      const overlay = hostDoc.createElement('div');
      overlay.id = 'battle-overlay';
      hostDoc.body.appendChild(overlay);
    }

    if (!hostDoc.getElementById('page-map')) {
      const pageMap = hostDoc.createElement('div');
      pageMap.id = 'page-map';
      pageMap.style.display = 'none';
      hostDoc.body.appendChild(pageMap);
    }

    if (!hostDoc.getElementById('detailModal')) {
      const wrapper = hostDoc.createElement('div');
      wrapper.innerHTML = `
        <div class="mvu-modal-mask mvu-root" id="detailModal" aria-hidden="true">
          <div class="mvu-modal-panel" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <div class="modal-head">
              <div class="modal-head-main">
                <div class="modal-meta-row">
                  <span class="modal-level-chip" id="modalLevel"></span>
                  <span class="modal-path-chip" id="modalPath"></span>
                </div>
                <div class="modal-title-wrap">
                  <div class="modal-title" id="modalTitle"></div>
                  <div class="modal-subtitle" id="modalSubtitle"></div>
                </div>
              </div>
              <button class="modal-close" id="modalClose">关闭</button>
            </div>
            <div class="modal-summary" id="modalSummary"></div>
            <div class="modal-body" id="modalBody"></div>
          </div>
        </div>
      `;
      hostDoc.body.appendChild(wrapper.firstElementChild);
    }
  }

  function ensureGetAllVariablesShim() {
    if (hostWin.getAllVariables) return;

    hostWin.getAllVariables = async function () {
      try {
        const mvu = hostWin.Mvu || window.Mvu;
        if (!mvu || typeof mvu.getMvuData !== 'function') return null;
        const data = await Promise.resolve(mvu.getMvuData({ type: 'message', message_id: 'latest' }));
        if (data && data.stat_data) return data.stat_data;
        return data || null;
      } catch (err) {
        return null;
      }
    };

    try {
      window.getAllVariables = hostWin.getAllVariables;
    } catch (e) {}
  }

  async function loadCSS(url) {
    const styleId = 'mvu-style-' + btoa(url).replace(/[^a-zA-Z0-9]/g, '');
    if (hostDoc.getElementById(styleId)) return url;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('CSS load failed: ' + url + ' [' + res.status + ']');

    const cssText = await res.text();
    const style = hostDoc.createElement('style');
    style.id = styleId;
    style.textContent = cssText;
    hostDoc.head.appendChild(style);
    return url;
  }

  function loadRemoteScript(url) {
    return new Promise((resolve, reject) => {
      const marker = 'mvu-remote-' + btoa(url).replace(/[^a-zA-Z0-9]/g, '');
      if (hostDoc.getElementById(marker)) {
        resolve(url);
        return;
      }

      const script = hostDoc.createElement('script');
      script.id = marker;
      script.src = url;
      script.async = false;
      script.onload = () => resolve(url);
      script.onerror = () => reject(new Error('Remote script load failed: ' + url));
      hostDoc.head.appendChild(script);
    });
  }

  async function loadInlineScript(url) {
    const marker = 'mvu-inline-' + btoa(url).replace(/[^a-zA-Z0-9]/g, '');
    if (hostDoc.getElementById(marker)) return url;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('JS load failed: ' + url + ' [' + res.status + ']');

    const code = await res.text();
    const script = hostDoc.createElement('script');
    script.id = marker;
    script.text = code + '\n//# sourceURL=' + url;
    hostDoc.body.appendChild(script);
    return url;
  }

  async function waitForMountsReady(timeout) {
    const start = Date.now();
    const limit = timeout || 10000;

    while (Date.now() - start < limit) {
      ensureHostNodes();
      const left = hostDoc.getElementById('mvu-left-mount');
      const right = hostDoc.getElementById('mvu-right-mount');
      const modal = hostDoc.getElementById('detailModal');
      if (left && right && modal) return true;
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    throw new Error('Mount points not ready');
  }

  async function waitForVueMounted(timeout) {
    const start = Date.now();
    const limit = timeout || 10000;

    while (Date.now() - start < limit) {
      ensureHostNodes();
      const leftMount = hostDoc.getElementById('mvu-left-mount');
      const rightMount = hostDoc.getElementById('mvu-right-mount');
      const leftStage = hostDoc.getElementById('splitLeftStage');
      const rightStage = hostDoc.getElementById('splitRightStage');
      if ((leftMount && leftMount.innerHTML.trim()) || (rightMount && rightMount.innerHTML.trim()) || leftStage || rightStage) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    return false;
  }

  function triggerMvuRefresh() {
    try {
      const mvu = hostWin.Mvu || window.Mvu;
      const eventName = mvu && mvu.events ? mvu.events.VARIABLE_UPDATE_ENDED : '';
      if (!eventName) return;

      try { hostWin.dispatchEvent(new Event(eventName)); } catch (e) {}
      try {
        if (typeof mvu.dispatchEvent === 'function') {
          mvu.dispatchEvent(new Event(eventName));
        }
      } catch (e) {}
    } catch (err) {}
  }

  async function bootstrap() {
    try {
      await waitForMountsReady(10000);

      for (const url of cssList) {
        await loadCSS(url);
      }

      await loadRemoteScript(VUE_URL);

      if (!hostWin.Vue || typeof hostWin.Vue.compile !== 'function') {
        throw new Error('Vue full build load failed: compiler missing');
      }

      ensureGetAllVariablesShim();

      for (const url of jsList) {
        await loadInlineScript(url);
      }

      ensureHostNodes();
      const mounted = await waitForVueMounted(10000);

      if (mounted) {
        setTimeout(triggerMvuRefresh, 0);
        setTimeout(triggerMvuRefresh, 300);
        setTimeout(triggerMvuRefresh, 1000);
      }
    } catch (err) {
      console.error('[MVU] External UI Vue loader failed:', err);
    }
  }

  if (hostDoc.readyState === 'loading') {
    hostDoc.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
