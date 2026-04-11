/* BattleUI_Module.js - 战斗终端系统 (JS 模块版) */

const BattleStyles = ".battle-module-scope {\n  position: fixed;\n  inset: 0;\n  z-index: 10000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(0,0,0,0.85);\n  backdrop-filter: blur(5px);\n  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;\n}\n    \n    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Noto+Serif+SC:wght@700&display=swap');\n\n    :root {\n      --shell-top: rgba(132, 160, 171, 0.84);\n      --shell-bottom: rgba(58, 96, 112, 0.90);\n      --shell-core: rgba(24, 58, 70, 0.28);\n      --panel: rgba(18, 56, 69, 0.20);\n      --panel-strong: rgba(23, 68, 84, 0.26);\n      --line: rgba(150, 217, 228, 0.22);\n      --line-soft: rgba(150, 217, 228, 0.10);\n      --cyan: #8de1ef;\n      --cyan-soft: rgba(141, 225, 239, 0.14);\n      --gold: #d7c070;\n      --gold-soft: rgba(228, 201, 111, 0.14);\n      --red: #ff8aa2;\n      --white: #f5fcff;\n      --text: #e4f5f9;\n      --text-sub: #bfdde4;\n      --text-dim: #87aeb7;\n      --pill-dark: #202c3b;\n      --pill-dark-border: rgba(255,255,255,0.08);\n      --hp: linear-gradient(90deg, #f38d9f, #f5adba);\n      --sp: linear-gradient(90deg, #73bfd1, #8ec8d5);\n      --men: linear-gradient(90deg, #9ea1dc, #b1bbe8);\n      --font-tech: 'Orbitron', 'Microsoft YaHei', sans-serif;\n      --font-title: 'Noto Serif SC', serif;\n      --font-ui: 'Microsoft YaHei', 'PingFang SC', sans-serif;\n      --grad-top: linear-gradient(90deg, transparent, #8ef7ff 16%, #f1ffff 50%, #98edff 84%, transparent);\n      --shadow-main: 0 24px 60px rgba(0,0,0,0.42);\n      --shadow-soft: inset 0 0 18px rgba(255,255,255,0.02), inset 0 0 16px rgba(0,229,255,0.03);\n      --shadow-cyan: 0 4px 15px rgba(77,240,255,0.14);\n    }\n\n    * { box-sizing: border-box; }\n\n    \n\n    \n\n    .battle-module-scope .battle-shell {\n      width: 640px;\n      height: 480px;\n      position: relative;\n      display: flex;\n      flex-direction: column;\n      overflow: hidden;\n      border-radius: 18px;\n      border: 1px solid rgba(255,255,255,0.10);\n      background:\n        linear-gradient(180deg, var(--shell-top), var(--shell-bottom)),\n        var(--shell-core);\n      backdrop-filter: blur(20px);\n      -webkit-backdrop-filter: blur(20px);\n      clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px);\n      box-shadow: var(--shadow-main);\n    }\n\n    .battle-module-scope .battle-shell::before {\n      content: '';\n      position: absolute;\n      left: 0;\n      right: 0;\n      top: 0;\n      height: 3px;\n      background: var(--grad-top);\n      z-index: 2;\n      pointer-events: none;\n    }\n\n    .battle-module-scope .battle-shell::after {\n      content: '';\n      position: absolute;\n      inset: 0;\n      z-index: 0;\n      pointer-events: none;\n      background:\n        radial-gradient(circle at left top, rgba(255,255,255,0.08), transparent 22%),\n        radial-gradient(circle at right bottom, rgba(255,215,0,0.06), transparent 24%),\n        repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 56px),\n        repeating-linear-gradient(180deg, rgba(255,255,255,0.014) 0 1px, transparent 1px 44px);\n      opacity: 0.9;\n    }\n\n    .battle-module-scope .battle-header {\n      position: relative;\n      z-index: 1;\n      flex: 0 0 auto;\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      gap: 12px;\n      padding: 12px 12px 8px;\n      border-bottom: 1px solid var(--line-soft);\n      background: linear-gradient(90deg, rgba(118,239,255,0.05), transparent 54%, rgba(228,201,111,0.03));\n    }\n\n    .battle-module-scope .combatant-card {\n      min-width: 0;\n      padding: 10px 10px 9px;\n      border-radius: 14px;\n      border: 1px solid var(--line);\n      background:\n        linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)),\n        rgba(7, 25, 33, 0.08);\n      box-shadow: var(--shadow-soft);\n      display: flex;\n      flex-direction: column;\n      gap: 6px;\n    }\n\n    .battle-module-scope .combatant-card.enemy {\n      text-align: right;\n    }\n\n    .battle-module-scope .name-row {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      gap: 8px;\n      min-width: 0;\n    }\n\n    .battle-module-scope .combatant-card.enemy .name-row {\n      flex-direction: row-reverse;\n    }\n\n    .battle-module-scope .name-block {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      min-width: 0;\n    }\n\n    .battle-module-scope .combatant-card.enemy .name-block {\n      flex-direction: row-reverse;\n    }\n\n    .battle-module-scope .lv-badge {\n      flex: 0 0 auto;\n      padding: 2px 8px;\n      border-radius: 8px;\n      font-size: 11px;\n      line-height: 1.2;\n      color: var(--gold);\n      background: rgba(56, 67, 36, 0.26);\n      border: 1px solid rgba(228,201,111,0.28);\n      box-shadow: inset 0 0 8px rgba(255,215,0,0.05);\n      font-family: var(--font-tech);\n    }\n\n    .battle-module-scope .combatant-name {\n      min-width: 0;\n      font-family: var(--font-title);\n      font-size: 14px;\n      font-weight: 700;\n      color: var(--cyan);\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      text-shadow: 0 0 8px rgba(118,239,255,0.20);\n    }\n\n    .battle-module-scope .bar-stack {\n      display: flex;\n      flex-direction: column;\n      gap: 5px;\n    }\n\n    .battle-module-scope .resource-bar {\n      position: relative;\n      height: 10px;\n      border-radius: 999px;\n      overflow: hidden;\n      border: 1px solid rgba(255,255,255,0.08);\n      background: rgba(5, 18, 24, 0.22);\n    }\n\n    .battle-module-scope .resource-fill {\n      width: 100%;\n      height: 100%;\n      transition: width .25s ease;\n    }\n\n    .resource-fill.hp { background: var(--hp); }\n    .resource-fill.sp { background: var(--sp); }\n    .resource-fill.men { background: var(--men); }\n\n    .battle-module-scope .resource-text {\n      position: absolute;\n      inset: 0;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-size: 7px;\n      color: #fff;\n      font-weight: 700;\n      text-shadow: 1px 1px 2px #000;\n      pointer-events: none;\n      font-family: var(--font-tech);\n    }\n\n    .battle-module-scope .stats-grid {\n      display: grid;\n      grid-template-columns: 1.35fr 1fr 1fr 1fr;\n      gap: 6px;\n      min-width: 0;\n    }\n\n    .battle-module-scope .stat-item {\n      min-width: 0;\n      padding: 4px 6px;\n      border-radius: 10px;\n      background: rgba(255,255,255,0.03);\n      border: 1px solid rgba(255,255,255,0.06);\n      box-shadow: inset 0 0 8px rgba(255,255,255,0.01);\n    }\n\n    .battle-module-scope .stat-label {\n      margin-bottom: 2px;\n      font-size: 8px;\n      color: var(--text-dim);\n      line-height: 1.1;\n      white-space: nowrap;\n    }\n\n    .battle-module-scope .stat-value {\n      font-size: 10px;\n      color: var(--white);\n      line-height: 1.15;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      font-family: var(--font-tech);\n    }\n\n    .combatant-card.enemy .stat-label,\n    .battle-module-scope .combatant-card.enemy .stat-value {\n      text-align: right;\n    }\n\n    .battle-module-scope .buff-row {\n      min-height: 16px;\n      display: flex;\n      gap: 4px;\n      flex-wrap: nowrap;\n      overflow-x: auto;\n      overflow-y: hidden;\n      padding-bottom: 1px;\n    }\n\n    .battle-module-scope .combatant-card.enemy .buff-row {\n      justify-content: flex-end;\n    }\n\n    .battle-module-scope .tag-chip {\n      flex: 0 0 auto;\n      display: inline-flex;\n      align-items: center;\n      gap: 4px;\n      padding: 2px 7px;\n      border-radius: 999px;\n      font-size: 8px;\n      line-height: 1;\n      white-space: nowrap;\n      color: var(--text-sub);\n      background: rgba(255,255,255,0.04);\n      border: 1px solid rgba(255,255,255,0.08);\n    }\n\n    .tag-chip.buff { color: var(--cyan); border-color: rgba(118,239,255,0.16); }\n    .tag-chip.debuff { color: var(--red); border-color: rgba(255,122,151,0.18); }\n    .tag-chip.field { color: var(--cyan); border-color: rgba(118,239,255,0.18); }\n    .tag-chip.sustain { color: #d7c7ff; border-color: rgba(215,199,255,0.18); }\n    .tag-chip.charge { color: var(--gold); border-color: rgba(228,201,111,0.18); }\n\n    .battle-module-scope .battle-main {\n      position: relative;\n      z-index: 1;\n      flex: 1 1 auto;\n      min-height: 0;\n      display: grid;\n      grid-template-columns: 86px 1fr 86px;\n      gap: 10px;\n      padding: 8px 12px 12px;\n    }\n\n    .battle-module-scope .side-rail {\n      min-height: 0;\n      display: flex;\n    }\n\n    .battle-module-scope .side-panel {\n      flex: 1;\n      min-height: 0;\n      border-radius: 16px;\n      border: 1px solid var(--line-soft);\n      background:\n        linear-gradient(180deg, rgba(24,76,92,0.18), rgba(16,48,58,0.12)),\n        rgba(255,255,255,0.015);\n      box-shadow: var(--shadow-soft);\n      padding: 8px 6px;\n      display: flex;\n      flex-direction: column;\n      gap: 6px;\n      overflow-y: auto;\n      overflow-x: hidden;\n    }\n\n    .battle-module-scope .side-card {\n      width: 100%;\n      border-radius: 12px;\n      border: 1px solid rgba(255,255,255,0.07);\n      background: rgba(16, 40, 50, 0.18);\n      padding: 6px 6px 5px;\n      display: flex;\n      flex-direction: column;\n      gap: 5px;\n      cursor: pointer;\n      transition: .16s ease;\n      text-align: left;\n      font-family: var(--font-ui);\n      color: var(--text-sub);\n    }\n\n    .battle-module-scope .side-card:hover {\n      border-color: rgba(118,239,255,0.18);\n      box-shadow: var(--shadow-cyan);\n      color: var(--white);\n    }\n\n    .battle-module-scope .side-card.active {\n      color: var(--white);\n      border-color: rgba(118,239,255,0.28);\n      background: rgba(118,239,255,0.08);\n      box-shadow: inset 0 0 8px rgba(118,239,255,0.04);\n    }\n\n    .battle-module-scope .side-card.enemy.active {\n      color: var(--cyan);\n    }\n\n    .battle-module-scope .side-name {\n      font-size: 10px;\n      line-height: 1.2;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      text-align: center;\n    }\n\n    .battle-module-scope .side-mini-bar {\n      height: 4px;\n      border-radius: 999px;\n      overflow: hidden;\n      border: 1px solid rgba(255,255,255,0.08);\n      background: rgba(5, 18, 24, 0.22);\n    }\n\n    .battle-module-scope .side-mini-fill {\n      height: 100%;\n      width: 100%;\n      background: var(--hp);\n    }\n\n    .battle-module-scope .center-column {\n      min-height: 0;\n      display: flex;\n      flex-direction: column;\n      gap: 8px;\n    }\n\n    .battle-module-scope .intent-bar {\n      flex: 0 0 auto;\n      border-radius: 16px;\n      border: 1px solid var(--line-soft);\n      background:\n        linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)),\n        rgba(16,48,58,0.10);\n      box-shadow: var(--shadow-soft);\n      padding: 8px 10px;\n    }\n\n    .battle-module-scope .intent-inner {\n      min-width: 0;\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      flex-wrap: wrap;\n    }\n\n    .battle-module-scope .intent-chip-row {\n      display: flex;\n      flex-wrap: wrap;\n      gap: 4px;\n      min-width: 0;\n      flex: 0 1 auto;\n    }\n\n    .battle-module-scope .intent-pill {\n      flex: 0 0 auto;\n      padding: 3px 8px;\n      border-radius: 999px;\n      font-size: 9px;\n      line-height: 1;\n      color: var(--white);\n      background: rgba(255,255,255,0.035);\n      border: 1px solid rgba(255,255,255,0.07);\n      white-space: nowrap;\n    }\n\n    .battle-module-scope .ghost-btn {\n      margin-left: auto;\n      border: 1px solid rgba(118,239,255,0.20);\n      background: rgba(118,239,255,0.06);\n      color: var(--cyan);\n      border-radius: 999px;\n      padding: 3px 10px;\n      font-size: 9px;\n      font-family: var(--font-ui);\n      cursor: pointer;\n      white-space: nowrap;\n    }\n\n    .battle-module-scope .ghost-btn:hover {\n      background: rgba(118,239,255,0.10);\n    }\n\n    .battle-module-scope .action-wrap {\n      flex: 1 1 auto;\n      min-height: 0;\n      border-radius: 16px;\n      border: 1px solid var(--line);\n      background:\n        linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)),\n        rgba(16,48,58,0.10);\n      box-shadow: var(--shadow-soft);\n      overflow: hidden;\n      display: flex;\n      flex-direction: column;\n    }\n\n    .battle-module-scope .battle-toolbar {\n      display: flex;\n      align-items: center;\n      justify-content: flex-start;\n      gap: 8px;\n      padding: 6px 12px;\n      border-bottom: 1px solid var(--line-soft);\n      background: linear-gradient(90deg, rgba(118,239,255,0.04), rgba(255,255,255,0.01));\n      flex: 0 0 auto;\n    }\n\n    .battle-module-scope .mode-group {\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      flex-wrap: wrap;\n    }\n\n    .battle-module-scope .mode-btn {\n      border: 1px solid rgba(255,255,255,0.08);\n      background: transparent;\n      color: var(--text-dim);\n      border-radius: 999px;\n      padding: 3px 9px;\n      font-size: 9px;\n      font-family: var(--font-ui);\n      cursor: pointer;\n    }\n\n    .battle-module-scope .mode-btn.active {\n      color: var(--cyan);\n      border-color: rgba(118,239,255,0.24);\n      background: rgba(118,239,255,0.08);\n    }\n\n    .battle-module-scope .action-filters {\n      flex: 0 0 auto;\n      display: flex;\n      gap: 6px;\n      padding: 6px 12px;\n      border-bottom: 1px solid var(--line-soft);\n      background: rgba(118,239,255,0.035);\n      overflow-x: auto;\n      overflow-y: hidden;\n    }\n\n    .battle-module-scope .filter-btn {\n      flex: 0 0 auto;\n      border: 1px solid transparent;\n      background: transparent;\n      color: var(--text-dim);\n      border-radius: 8px;\n      padding: 4px 9px;\n      font-size: 10px;\n      font-family: var(--font-ui);\n      cursor: pointer;\n      white-space: nowrap;\n    }\n\n    .battle-module-scope .filter-btn.active {\n      color: var(--cyan);\n      border-color: rgba(118,239,255,0.22);\n      background: rgba(118,239,255,0.08);\n    }\n\n    .battle-module-scope .action-grid {\n      flex: 1 1 auto;\n      min-height: 0;\n      display: grid;\n      grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));\n      gap: 8px;\n      padding: 8px 12px 12px;\n      overflow-y: auto;\n    }\n\n    .battle-module-scope .action-btn {\n      min-height: 62px;\n      border-radius: 12px;\n      border: 1px solid rgba(118,239,255,0.14);\n      background: linear-gradient(180deg, rgba(0,229,255,0.08), rgba(0,229,255,0.02));\n      color: var(--text);\n      padding: 8px 8px 7px;\n      box-shadow: inset 0 0 10px rgba(0,0,0,0.12);\n      display: flex;\n      flex-direction: column;\n      gap: 5px;\n      align-items: stretch;\n      text-align: left;\n      cursor: pointer;\n      transition: border-color .16s ease, background .16s ease, transform .16s ease;\n      font-family: var(--font-ui);\n    }\n\n    .battle-module-scope .action-btn:hover:not(:disabled) {\n      border-color: rgba(118,239,255,0.24);\n      background: linear-gradient(180deg, rgba(0,229,255,0.14), rgba(0,229,255,0.03));\n      box-shadow: var(--shadow-cyan);\n      transform: translateY(-1px);\n    }\n\n    .battle-module-scope .action-btn.is-selected {\n      border-color: rgba(118,239,255,0.28);\n      background: linear-gradient(180deg, rgba(0,229,255,0.16), rgba(0,229,255,0.04));\n      box-shadow: inset 0 0 10px rgba(0,229,255,0.04);\n    }\n\n    .battle-module-scope .action-btn:disabled {\n      opacity: 0.55;\n      cursor: not-allowed;\n    }\n\n    .battle-module-scope .action-name {\n      font-size: 12px;\n      font-weight: 700;\n      color: var(--white);\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n\n    .battle-module-scope .action-meta {\n      margin-top: auto;\n      display: flex;\n      justify-content: space-between;\n      gap: 6px;\n      font-size: 9px;\n      color: var(--text-dim);\n    }\n\n    .action-cost { color: var(--gold); }\n\n    .battle-module-scope .skill-tooltip {\n      position: absolute;\n      left: 108px;\n      bottom: 16px;\n      width: 280px;\n      padding: 10px;\n      border-radius: 12px;\n      border: 1px solid rgba(118,239,255,0.22);\n      background: rgba(10, 30, 38, 0.92);\n      backdrop-filter: blur(14px);\n      -webkit-backdrop-filter: blur(14px);\n      box-shadow: 0 12px 30px rgba(0,0,0,0.55), inset 0 0 15px rgba(0,229,255,0.08);\n      display: none;\n      z-index: 3;\n      pointer-events: none;\n    }\n\n    .skill-tooltip.show { display: block; }\n\n    .battle-module-scope .tt-header {\n      display: flex;\n      justify-content: space-between;\n      gap: 8px;\n      align-items: center;\n      margin-bottom: 8px;\n      padding-bottom: 6px;\n      border-bottom: 1px solid rgba(255,255,255,0.06);\n    }\n\n    .battle-module-scope .tt-name {\n      font-size: 13px;\n      color: var(--cyan);\n      font-weight: 700;\n    }\n\n    .battle-module-scope .tt-cast {\n      flex: 0 0 auto;\n      font-size: 8px;\n      color: var(--gold);\n      padding: 2px 6px;\n      border-radius: 999px;\n      border: 1px solid rgba(228,201,111,0.22);\n      background: rgba(228,201,111,0.08);\n    }\n\n    .battle-module-scope .tt-tags {\n      display: flex;\n      flex-wrap: wrap;\n      gap: 5px;\n      margin-bottom: 8px;\n    }\n\n    .battle-module-scope .tt-tag {\n      padding: 2px 6px;\n      border-radius: 999px;\n      font-size: 8px;\n      color: var(--white);\n      background: rgba(118,239,255,0.08);\n      border: 1px solid rgba(118,239,255,0.14);\n    }\n\n    .battle-module-scope .tt-effects {\n      font-size: 10px;\n      line-height: 1.5;\n      color: var(--text);\n    }\n\n    .battle-module-scope .tt-effect-type {\n      color: var(--cyan);\n      font-weight: 700;\n      margin-right: 4px;\n    }\n\n    ::-webkit-scrollbar { width: 4px; height: 4px; }\n    ::-webkit-scrollbar-thumb { background: rgba(118,239,255,0.22); border-radius: 999px; }\n  ";

const BattleTemplate = "<div class=\"battle-module-scope\">\n<div class=\"battle-shell\">\n    <div class=\"battle-header\">\n      <div class=\"combatant-card player\" id=\"ui-player-panel\">\n        <div class=\"name-row\">\n          <div class=\"name-block\">\n            <span class=\"lv-badge\" id=\"ui-player-lv\">Lv.0</span>\n            <span class=\"combatant-name\" id=\"ui-player-name\">Player</span>\n          </div>\n        </div>\n        <div class=\"bar-stack\">\n          <div class=\"resource-bar\">\n            <div class=\"resource-fill hp\" id=\"ui-player-hp-bar\"></div>\n            <div class=\"resource-text\" id=\"ui-player-hp-text\">0 / 0</div>\n          </div>\n          <div class=\"resource-bar\">\n            <div class=\"resource-fill sp\" id=\"ui-player-sp-bar\"></div>\n            <div class=\"resource-text\" id=\"ui-player-sp-text\">0 / 0</div>\n          </div>\n          <div class=\"resource-bar\">\n            <div class=\"resource-fill men\" id=\"ui-player-men-bar\"></div>\n            <div class=\"resource-text\" id=\"ui-player-men-text\">0 / 0</div>\n</div>";

class BattleUIComponent {
  constructor(container, snapshot, options = {}) {
    this.container = container;
    this.snapshot = snapshot;
    this.options = options;
    this.initDOM();
    this.initEngine();
  }

  initDOM() {
    if (!document.getElementById('battle-ui-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'battle-ui-styles';
      styleEl.textContent = BattleStyles;
      document.head.appendChild(styleEl);
    }
    this.container.innerHTML = BattleTemplate;
  }

  updateData(newSnapshot) {
    this.snapshot = newSnapshot;
    if (this.syncFromBattleEngine) this.syncFromBattleEngine();
  }

  destroy() {
    this.container.innerHTML = '';
  }

  initEngine() {
    const component = this;
    const snapshot = this.snapshot;
    const _options = this.options;
    const wrapperElement = this.container.querySelector('.battle-module-scope');
    const document = wrapperElement;

      const root = typeof globalThis !== 'undefined' ? globalThis : window;
      const lodashGet = root._ && typeof root._.get === 'function'
        ? root._.get.bind(root._)
        : (obj, path, fallback) => {
            const normalized = String(path || '').split('.').filter(Boolean);
            let cursor = obj;
            for (const seg of normalized) {
              if (cursor == null || typeof cursor !== 'object' || !(seg in cursor)) return fallback;
              cursor = cursor[seg];
            }
            return cursor === undefined ? fallback : cursor;
          };

      function normalizeStatPath(path) {
        return String(path || '')
          .replace(/^stat_data\./, '')
          .replace(/^\.+/, '');
      }

      function hasMvuRuntime() {
        const host = getHostWindow();
        return typeof root.getAllVariables === 'function' || typeof host?.getAllVariables === 'function';
      }

      function getAllVariablesSafe() {
        if (!hasMvuRuntime()) return {};
        try {
          const host = getHostWindow();
          const getter = typeof root.getAllVariables === 'function'
            ? root.getAllVariables.bind(root)
            : (typeof host?.getAllVariables === 'function' ? host.getAllVariables.bind(host) : null);
          return getter ? (getter() || {}) : {};
        } catch (error) {
          console.warn('BattleUIBridge: getAllVariables failed', error);
          return {};
        }
      }

      function getMvuValue(path, fallback) {
        const normalized = normalizeStatPath(path);
        if (!normalized) return lodashGet(getAllVariablesSafe(), 'stat_data', fallback);
        return lodashGet(getAllVariablesSafe(), `stat_data.${normalized}`, fallback);
      }

      async function waitForMvuReady() {
        try {
          const host = getHostWindow();
          const waiter = typeof root.waitGlobalInitialized === 'function'
            ? root.waitGlobalInitialized.bind(root)
            : (typeof host?.waitGlobalInitialized === 'function' ? host.waitGlobalInitialized.bind(host) : null);
          if (waiter) {
            await waiter('Mvu');
          }
        } catch (error) {
          console.warn('BattleUIBridge: waitForMvuReady failed', error);
        }
        return hasMvuRuntime();
      }

      function subscribeMvuUpdates(handler) {
        if (typeof handler !== 'function') return false;
        const host = getHostWindow();
        const eventName = root.Mvu?.events?.VARIABLE_UPDATE_ENDED || host?.Mvu?.events?.VARIABLE_UPDATE_ENDED;
        const eventOnFn = typeof root.eventOn === 'function' ? root.eventOn.bind(root) : (typeof host?.eventOn === 'function' ? host.eventOn.bind(host) : null);
        if (!eventName || !eventOnFn) return false;
        eventOnFn(eventName, handler);
        return true;
      }

      function deepClonePlain(value) {
        return value == null ? value : JSON.parse(JSON.stringify(value));
      }

      function escapeJsonPointerSegment(segment) {
        return String(segment).replace(/~/g, '~0').replace(/\//g, '~1');
      }

      function pushReplaceOp(ops, path, value) {
        if (value === undefined) return;
        ops.push({ op: 'replace', path, value: deepClonePlain(value) });
      }

      function pushParticipantSyncPatch(ops, participant, extraNames = []) {
        if (!participant || typeof participant !== 'object') return;

        const names = new Set((Array.isArray(extraNames) ? extraNames : [extraNames]).filter(Boolean));
        if (participant.name) names.add(participant.name);
        const basePaths = Array.from(names).map(name => `/sd/char/${escapeJsonPointerSegment(name)}`);
        if (!basePaths.length) return;

        const addToTargets = (suffix, value) => {
          if (value === undefined) return;
          basePaths.forEach(base => pushReplaceOp(ops, `${base}${suffix}`, value));
        };

        if (participant.stat !== undefined) {
          addToTargets('/stat', participant.stat);
        } else {
          ['age', 'lv', 'type', 'talent_tier', 'is_evil', 'sp', 'sp_max', 'men', 'men_max', 'str', 'def', 'agi', 'vit', 'vit_max', 'conditions'].forEach(key => {
            addToTargets(`/${escapeJsonPointerSegment(key)}`, participant[key]);
          });
        }

        if (participant.status !== undefined) {
          addToTargets('/status', participant.status);
        } else {
          ['alive', 'wound', 'action', 'active_domain', 'loc', 'current_x', 'current_y'].forEach(key => {
            addToTargets(`/${escapeJsonPointerSegment(key)}`, participant[key]);
          });
        }

        addToTargets('/conditions', participant.conditions);
        addToTargets('/active_sustains', participant.active_sustains);
        addToTargets('/charging_skill', participant.charging_skill);
        addToTargets('/equip', participant.equip);
        addToTargets('/bloodline_power', participant.bloodline_power);
      }

      function buildCombatJsonPatch(combatData) {
        const safeCombatData = deepClonePlain(combatData);
        const ops = [{ op: 'replace', path: '/sd/world/combat', value: safeCombatData }];

        const participants = safeCombatData?.participants;
        if (!participants) return ops;

        pushParticipantSyncPatch(ops, participants.player, ['主角']);
        pushParticipantSyncPatch(ops, participants.enemy);
        (participants.team_player || []).forEach(unit => pushParticipantSyncPatch(ops, unit));
        (participants.team_enemy || []).forEach(unit => pushParticipantSyncPatch(ops, unit));

        return ops;
      }

      function buildUpdateVariableText(patchOps, options = {}) {
        const analysis = String(options.analysis || 'Frontend battle arbitration already produced the exact combat result. Apply the following JSONPatch exactly as given.').trim();
        return `<UpdateVariable>\n<Analysis>${analysis}</Analysis>\n<JSONPatch>\n${JSON.stringify(patchOps || [], null, 2)}\n</JSONPatch>\n</UpdateVariable>`;
      }

      function persistCombatData(combatData, options = {}) {
        const safeCombatData = deepClonePlain(combatData);
        const patchOps = buildCombatJsonPatch(safeCombatData);
        if (Array.isArray(options.extraPatchOps)) {
          patchOps.push(...options.extraPatchOps);
        }
        const updateVariableText = buildUpdateVariableText(patchOps, options);
        const detail = {
          combatData: safeCombatData,
          patchOps,
          updateVariableText,
          rootPath: '/sd/world/combat'
        };

        root.__lastBattleMvuUpdateRequest = detail;

        const bridge = root.BattleUIBridge || {};
        const adapter = bridge.hostAdapter || root.__battleUIHostAdapter;
        if (typeof bridge.onCombatDataChanged === 'function') {
          try {
            detail.delivery = bridge.onCombatDataChanged(detail);
          } catch (error) {
            console.warn('BattleUIBridge.onCombatDataChanged failed', error);
          }
        } else if (adapter && typeof adapter.onCombatDataChanged === 'function') {
          try {
            detail.delivery = adapter.onCombatDataChanged(detail);
          } catch (error) {
            console.warn('BattleUI hostAdapter.onCombatDataChanged failed', error);
          }
        }

        try {
          root.dispatchEvent(new CustomEvent('battle-ui-mvu-update-request', { detail }));
        } catch (error) {
          console.warn('battle-ui-mvu-update-request dispatch failed', error);
        }

        try {
          root.dispatchEvent(new CustomEvent('battle-ui-combat-data-changed', { detail }));
        } catch (error) {
          console.warn('battle-ui-combat-data-changed dispatch failed', error);
        }

        return detail;
      }

      function getHostWindow() {
        try {
          if (root.parent && root.parent !== root && root.parent.document) return root.parent;
        } catch (error) {
          console.warn('BattleUIBridge: parent window unavailable, fallback current window', error);
        }
        return root;
      }

      function getHostDocument() {
        return getHostWindow().document || document;
      }

      function findFirstElement(selectors, doc = getHostDocument()) {
        for (const selector of selectors) {
          const node = doc.querySelector(selector);
          if (node) return node;
        }
        return null;
      }

      function createInputEvent(type) {
        try {
          return new InputEvent(type, { bubbles: true, cancelable: true, composed: true });
        } catch (error) {
          return new Event(type, { bubbles: true, cancelable: true, composed: true });
        }
      }

      function setElementValue(element, value) {
        if (!element) return false;
        const nextValue = String(value ?? '');
        if (element.isContentEditable) {
          if ('textContent' in element) element.textContent = nextValue;
          if ('innerText' in element && element.innerText !== nextValue) element.innerText = nextValue;
          element.dispatchEvent(createInputEvent('input'));
          element.dispatchEvent(createInputEvent('change'));
          return true;
        }
        const prototype = element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
        if (descriptor?.set) descriptor.set.call(element, nextValue);
        else element.value = nextValue;
        element.dispatchEvent(createInputEvent('input'));
        element.dispatchEvent(createInputEvent('change'));
        return true;
      }

      function findChatInput(doc = getHostDocument()) {
        return findFirstElement([
          '#send_textarea',
          '#chat_input',
          '#user-input',
          '#user_input',
          'textarea[data-testid="chat-input"]',
          'textarea[placeholder*="发送"]',
          'textarea[placeholder*="Send"]',
          'textarea[name="chat_input"]',
          'textarea[name="user_input"]',
          '[contenteditable="true"][data-testid="chat-input"]',
          'form [contenteditable="true"][role="textbox"]',
          '[contenteditable="true"][aria-label*="Send"]',
          '[contenteditable="true"][aria-label*="发送"]',
          'form textarea',
          'textarea'
        ], doc);
      }

      function findSendButton(doc = getHostDocument()) {
        return findFirstElement([
          '#send_but',
          '#send-button',
          'button[data-testid="send-button"]',
          'button[title*="Send"]',
          'button[aria-label*="Send"]',
          'button[aria-label*="发送"]',
          'button[title*="发送"]',
          'form button[type="submit"]'
        ], doc);
      }

      function fillChatInput(text, options = {}) {
        const doc = options.document || getHostDocument();
        const input = findChatInput(doc);
        const ok = setElementValue(input, text);
        if (ok && typeof input?.focus === 'function') input.focus();
        return { ok, input };
      }

      function clickSendButton(options = {}) {
        const doc = options.document || getHostDocument();
        const button = findSendButton(doc);
        if (!button) return { ok: false, button: null };
        button.click();
        return { ok: true, button };
      }

      function queueSystemPrompt(text) {
        const prompt = String(text || '');
        root.__battlePendingSystemPrompt = prompt;
        try {
          root.dispatchEvent(new CustomEvent('battle-ui-system-prompt-ready', { detail: { systemPrompt: prompt } }));
        } catch (error) {
          console.warn('battle-ui-system-prompt-ready dispatch failed', error);
        }
        return prompt;
      }

      function deliverBattleRequest(detail, options = {}) {
        const bridge = root.BattleUIBridge || {};
        if (typeof bridge.hostSend === 'function') {
          return bridge.hostSend({ ...detail, options });
        }
        const adapter = bridge.hostAdapter || root.__battleUIHostAdapter;
        if (adapter && typeof adapter.sendUIRequest === 'function') {
          return adapter.sendUIRequest({ ...detail, options });
        }
        if (adapter && typeof adapter.sendBattleRequest === 'function') {
          return adapter.sendBattleRequest({ ...detail, options });
        }

        queueSystemPrompt(detail.systemPrompt);
        const fillResult = fillChatInput(detail.playerInput, options);
        const sendResult = options.autoSend === false ? { ok: false, button: null } : clickSendButton(options);
        return {
          mode: 'dom-fallback',
          filled: !!fillResult.ok,
          sent: !!sendResult.ok,
          pendingSystemPrompt: detail.systemPrompt,
          inputFound: !!fillResult.input,
          sendButtonFound: !!sendResult.button
        };
      }

      function looksLikeGenerationUrl(url) {
        return /(generate|completion|chat-completions|text-completions|api\/backends|v1\/chat\/completions|v1\/completions)/i.test(String(url || ''));
      }

      function appendPromptText(base, extra) {
        const baseText = String(base || '').trim();
        const extraText = String(extra || '').trim();
        if (!extraText) return base;
        if (!baseText) return extraText;
        return `${baseText}\n\n${extraText}`;
      }

      function consumeQueuedSystemPromptForInjection(meta = {}) {
        const prompt = String(root.__battlePendingSystemPrompt || '').trim();
        if (!prompt) return '';
        root.__battlePendingSystemPrompt = '';
        root.__battleLastInjectedSystemPrompt = {
          prompt,
          ...meta,
          at: Date.now()
        };
        try {
          root.dispatchEvent(new CustomEvent('battle-ui-system-prompt-consumed', {
            detail: root.__battleLastInjectedSystemPrompt
          }));
        } catch (error) {
          console.warn('battle-ui-system-prompt-consumed dispatch failed', error);
        }
        return prompt;
      }

      function injectSystemPromptIntoPayload(payload, prompt) {
        if (!payload || typeof payload !== 'object' || !prompt) {
          return { payload, injected: false, channel: null };
        }

        let injected = false;
        let channel = null;

        if (Array.isArray(payload.messages)) {
          const messages = payload.messages.map(msg => ({ ...msg }));
          const firstSystemIndex = messages.findIndex(msg => msg?.role === 'system');
          if (firstSystemIndex >= 0) {
            const target = { ...messages[firstSystemIndex] };
            if (typeof target.content === 'string' || target.content == null) {
              target.content = appendPromptText(target.content || '', prompt);
              messages[firstSystemIndex] = target;
            } else {
              messages.splice(firstSystemIndex, 0, { role: 'system', content: prompt });
            }
          } else {
            messages.unshift({ role: 'system', content: prompt });
          }
          payload = { ...payload, messages };
          injected = true;
          channel = 'messages.system';
        } else if (typeof payload.system === 'string' || payload.system == null) {
          payload = { ...payload, system: appendPromptText(payload.system || '', prompt) };
          injected = true;
          channel = 'system';
        } else if (typeof payload.systemPrompt === 'string' || payload.systemPrompt == null) {
          payload = { ...payload, systemPrompt: appendPromptText(payload.systemPrompt || '', prompt) };
          injected = true;
          channel = 'systemPrompt';
        } else if (typeof payload.instruction === 'string' || payload.instruction == null) {
          payload = { ...payload, instruction: appendPromptText(payload.instruction || '', prompt) };
          injected = true;
          channel = 'instruction';
        } else if (typeof payload.instructions === 'string' || payload.instructions == null) {
          payload = { ...payload, instructions: appendPromptText(payload.instructions || '', prompt) };
          injected = true;
          channel = 'instructions';
        } else if (typeof payload.prompt === 'string') {
          payload = { ...payload, prompt: `${prompt}\n\n${payload.prompt}` };
          injected = true;
          channel = 'prompt';
        }

        return { payload, injected, channel };
      }

      function patchRequestBodyIfNeeded(bodyText, url, transport) {
        const pendingPrompt = String(root.__battlePendingSystemPrompt || '').trim();
        if (!pendingPrompt || !looksLikeGenerationUrl(url) || typeof bodyText !== 'string' || !bodyText.trim()) {
          return { bodyText, injected: false, channel: null };
        }

        try {
          const payload = JSON.parse(bodyText);
          const promptToInject = consumeQueuedSystemPromptForInjection({ url: String(url || ''), transport });
          if (!promptToInject) return { bodyText, injected: false, channel: null };
          const result = injectSystemPromptIntoPayload(payload, promptToInject);
          if (!result.injected) {
            root.__battlePendingSystemPrompt = promptToInject;
            return { bodyText, injected: false, channel: null };
          }
          return {
            bodyText: JSON.stringify(result.payload),
            injected: true,
            channel: result.channel
          };
        } catch (error) {
          return { bodyText, injected: false, channel: null };
        }
      }

      function installFetchHook() {
        const host = getHostWindow();
        if (!host || host.__battleUIFetchHookInstalled || typeof host.fetch !== 'function') return;
        const nativeFetch = host.fetch.bind(host);
        const HostRequest = host.Request || Request;

        host.fetch = async function(input, init) {
          let nextInput = input;
          let nextInit = init;
          const url = typeof input === 'string' ? input : (input?.url || init?.url || '');

          if (init?.body && typeof init.body === 'string') {
            const patched = patchRequestBodyIfNeeded(init.body, url, 'fetch:init');
            if (patched.injected) {
              nextInit = { ...init, body: patched.bodyText };
            }
          } else if (typeof HostRequest !== 'undefined' && input instanceof HostRequest && !init?.body) {
            try {
              const cloned = input.clone();
              const bodyText = await cloned.text();
              const patched = patchRequestBodyIfNeeded(bodyText, url, 'fetch:request');
              if (patched.injected) {
                nextInput = new HostRequest(input, { body: patched.bodyText });
              }
            } catch (error) {
              // ignore request body patch failure
            }
          }

          return nativeFetch(nextInput, nextInit);
        };

        host.__battleUIFetchHookInstalled = true;
      }

      function installXHRHook() {
        const host = getHostWindow();
        const XHR = host?.XMLHttpRequest;
        if (!XHR || XHR.prototype.__battleUIXHRHookInstalled) return;
        const nativeOpen = XHR.prototype.open;
        const nativeSend = XHR.prototype.send;

        XHR.prototype.open = function(method, url, ...rest) {
          this.__battleUIRequestUrl = url;
          return nativeOpen.call(this, method, url, ...rest);
        };

        XHR.prototype.send = function(body) {
          if (typeof body === 'string') {
            const patched = patchRequestBodyIfNeeded(body, this.__battleUIRequestUrl, 'xhr');
            if (patched.injected) {
              body = patched.bodyText;
            }
          }
          return nativeSend.call(this, body);
        };

        XHR.prototype.__battleUIXHRHookInstalled = true;
      }

      function installHostHooks() {
        installFetchHook();
        installXHRHook();
      }

      if (typeof root.sendToAI !== 'function') {
        root.sendToAI = function(playerInput, systemPrompt, meta = {}) {
          const requestKind = String(meta?.requestKind || 'battle_arbitration');
          const detail = {
            requestSource: 'Battle_UI',
            requestKind,
            playerInput: String(playerInput || ''),
            systemPrompt: String(systemPrompt || ''),
            mvuUpdate: meta?.mvuUpdate || null,
            channels: {
              userInput: String(playerInput || ''),
              hiddenSystemPrompt: String(systemPrompt || ''),
              updateVariableText: String(meta?.mvuUpdate?.updateVariableText || ''),
              requestKind
            }
          };
          detail.delivery = deliverBattleRequest(detail, { autoSend: meta?.autoSend !== false });
          root.__lastBattleAIRequest = detail;
          try {
            root.dispatchEvent(new CustomEvent('battle-ui-ai-request', { detail }));
          } catch (error) {
            console.warn('battle-ui-ai-request dispatch failed', error);
          }
          return detail;
        };
      }

      root.BattleUIBridge = Object.assign(root.BattleUIBridge || {}, {
        hasMvu() {
          return hasMvuRuntime();
        },
        async waitForMvuReady() {
          return waitForMvuReady();
        },
        getAllVariables() {
          return getAllVariablesSafe();
        },
        getStatData() {
          return getMvuValue('', {});
        },
        getMVU(path) {
          return getMvuValue(path);
        },
        setMVU(path, value) {
          console.warn('BattleUIBridge.setMVU 未启用：当前按明月秋青规范仅从 getAllVariables()/stat_data 读取 MVU 变量。', path, value);
          return false;
        },
        initCombatContext() {
          console.warn('BattleUIBridge.initCombatContext 已停用：战斗上下文应由 MVU 系统维护在 stat_data.sd.* 下。');
          return getMvuValue('sd.world.combat');
        },
        getBattleContext() {
          return getMvuValue('sd.world.combat');
        },
        subscribeMvuUpdates(handler) {
          return subscribeMvuUpdates(handler);
        },
        persistCombatData(combatData) {
          return persistCombatData(combatData);
        },
        buildCombatJsonPatch(combatData) {
          return buildCombatJsonPatch(combatData);
        },
        buildUpdateVariableTextFromCombat(combatData, options = {}) {
          return buildUpdateVariableText(buildCombatJsonPatch(combatData), options);
        },
        getLastMvuUpdateRequest() {
          return root.__lastBattleMvuUpdateRequest || null;
        },
        setCombatContext() {
          console.warn('BattleUIBridge.setCombatContext 已停用：请通过 MVU 系统更新 stat_data.sd.*。');
          return getMvuValue('sd.world.combat');
        },
        findChatInput() {
          return findChatInput();
        },
        findSendButton() {
          return findSendButton();
        },
        pushUserInput(text, options = {}) {
          const payload = String(text || '');
          const fillResult = fillChatInput(payload, options);
          const sendResult = options.autoSend === false ? { ok: false, button: null } : clickSendButton(options);
          return {
            text: payload,
            filled: !!fillResult.ok,
            sent: !!sendResult.ok,
            inputFound: !!fillResult.input,
            sendButtonFound: !!sendResult.button
          };
        },
        setPendingSystemPrompt(text) {
          return queueSystemPrompt(text);
        },
        getPendingSystemPrompt() {
          return root.__battlePendingSystemPrompt || '';
        },
        consumePendingSystemPrompt() {
          const prompt = root.__battlePendingSystemPrompt || '';
          root.__battlePendingSystemPrompt = '';
          return prompt;
        },
        clearPendingSystemPrompt() {
          root.__battlePendingSystemPrompt = '';
        },
        setHostAdapter(adapter) {
          root.__battleUIHostAdapter = adapter || null;
          return root.__battleUIHostAdapter;
        },
        getHostAdapter() {
          return root.__battleUIHostAdapter || null;
        },
        installHostHooks() {
          installHostHooks();
        },
        getLastInjectedSystemPrompt() {
          return root.__battleLastInjectedSystemPrompt || null;
        },
        deliverBattleRequest(detail, options = {}) {
          return deliverBattleRequest(detail, options);
        },
        getLastAIRequest() {
          return root.__lastBattleAIRequest || null;
        }
      });

      root.getBattleUiMvuValue = getMvuValue;
      root.getBattleUiAllVariables = getAllVariablesSafe;
      root.waitBattleUiMvuReady = waitForMvuReady;

      installHostHooks();
    /* __BATTLE_ENGINE_INLINE__ */
const COMBAT_STAT_KEYS = ["age", "lv", "type", "talent_tier", "is_evil", "sp", "sp_max", "men", "men_max", "str", "def", "agi", "vit", "vit_max", "conditions"];
const COMBAT_STATUS_KEYS = ["alive", "wound", "action", "active_domain", "loc", "current_x", "current_y"];

function createEmptyCombatLogic() {
  return {
    瞬间交锋模块: { 基础威力倍率: 0, 伤害类型: "无", 穿透修饰: 0, 护盾绝对值: 0, 瞬间恢复比例: 0 },
    状态挂载模块: { 状态名称: "无", 持续回合: 0, 面板修改比例: { str: 1.0, def: 1.0, agi: 1.0, men_max: 1.0 }, 特殊机制标识: "无", 持续真伤dot: 0 },
    召唤与场地模块: { 实体名称: "无", 持续回合: 0, 继承属性比例: 0, 核心机制描述: "无" }
  };
}

function createEmptySkillSemantics() {
  return {
    主定位: "无",
    作用目标: "敌方单体",
    战术标签: [],
    优先条件: [],
    风险等级: "中",
    保留倾向: 0,
    目标偏好: [],
    友方偏好: [],
    是否持续: false,
    是否可打断: false,
    是否可被霸体免疫: true
  };
}

function mapSemanticTargetToCombatTarget(target) {
  const mapping = {
    "敌方单体": "敌方/单体",
    "敌方群体": "敌方/群体",
    "自身": "自身",
    "友方单体": "己方/单体",
    "友方群体": "己方/群体",
    "全场": "全场"
  };
  return mapping[target] || target || "敌方/单体";
}

function mapPrimaryRoleToSkillType(role) {
  const mapping = {
    "输出": "输出",
    "控制": "控制",
    "防御": "防御",
    "辅助": "辅助",
    "特殊": "辅助"
  };
  return mapping[role] || "输出";
}

function mergeSpecialFlags(existing, additions = []) {
  const set = new Set(String(existing || "无").split(/[\/、,，\s]+/).filter(Boolean).filter(flag => flag !== "无"));
  (additions || []).forEach(flag => {
    if (flag && flag !== "无") set.add(flag);
  });
  return set.size > 0 ? Array.from(set).join("/") : "无";
}

function formatCostObjectToString(costObj) {
  if (!costObj || typeof costObj !== "object") return "无";
  const buildPart = (obj) => [obj?.魂力 ? `魂力:${obj.魂力}` : "", obj?.体力 ? `体力:${obj.体力}` : "", obj?.精神力 ? `精神力:${obj.精神力}` : ""].filter(Boolean).join(" ") || "无";
  const upfront = buildPart(costObj.启动 || costObj.upfront || {});
  const sustain = buildPart(costObj.维持 || costObj.sustain || {});
  return sustain !== "无" ? `${upfront} 维持:${sustain}` : upfront;
}

function deepClone(data) {
  return data == null ? data : JSON.parse(JSON.stringify(data));
}

function bindCombatMirrorField(target, source, key) {
  if (!target || !source) return;
  if (target[key] !== undefined) source[key] = target[key];
  else if (source[key] !== undefined) target[key] = source[key];

  try {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      get() {
        return source[key];
      },
      set(value) {
        source[key] = value;
      }
    });
  } catch (e) {
    target[key] = source[key];
  }
}

function bindCombatParticipant(char) {
  if (!char || char.__combatMirrorBound) return char;

  if (char.stat) {
    COMBAT_STAT_KEYS.forEach(key => bindCombatMirrorField(char, char.stat, key));
  }

  if (char.status) {
    COMBAT_STATUS_KEYS.forEach(key => bindCombatMirrorField(char, char.status, key));
  }

  if (!char.conditions) {
    if (char.stat?.conditions) char.conditions = char.stat.conditions;
    else char.conditions = {};
  }

  if (!char.type && char.stat?.type) char.type = char.stat.type;
  if (!char.active_domain && char.status?.active_domain) char.active_domain = char.status.active_domain;
  if (char.alive === undefined && char.status?.alive !== undefined) char.alive = char.status.alive;

  char.__combatMirrorBound = true;
  return char;
}

function hydrateCombatData(combatData) {
  if (!combatData || !combatData.participants) return combatData;
  bindCombatParticipant(combatData.participants.player);
  bindCombatParticipant(combatData.participants.enemy);
  (combatData.participants.team_player || []).forEach(bindCombatParticipant);
  (combatData.participants.team_enemy || []).forEach(bindCombatParticipant);
  return combatData;
}

function normalizeSkillData(skill, fallbackName = "未知技能") {
  const normalized = deepClone(skill || {});
  normalized.name = normalized.name || normalized.技能名称 || fallbackName;
  normalized.主定位 = normalized.主定位 || normalized.战斗语义?.主定位 || normalized.技能类型 || "无";
  normalized.标签 = Array.isArray(normalized.标签) ? normalized.标签 : [];
  normalized.战斗语义 = { ...createEmptySkillSemantics(), ...(normalized.战斗语义 || {}) };
  normalized.效果列表 = Array.isArray(normalized.效果列表) ? normalized.效果列表 : [];
  normalized.对象 = (normalized.对象 && normalized.对象 !== "无") ? normalized.对象 : mapSemanticTargetToCombatTarget(normalized.战斗语义.作用目标);
  normalized.技能类型 = (normalized.技能类型 && normalized.技能类型 !== "无") ? normalized.技能类型 : mapPrimaryRoleToSkillType(normalized.主定位);
  normalized.element = normalized.element || normalized.元素 || "无";
  normalized.cast_time = Number(normalized.cast_time ?? 0) || 0;
  normalized.消耗 = typeof normalized.消耗 === "object" ? formatCostObjectToString(normalized.消耗) : (normalized.消耗 || "无");

  if (!normalized.仲裁逻辑) normalized.仲裁逻辑 = createEmptyCombatLogic();
  if (!normalized.仲裁逻辑.瞬间交锋模块) normalized.仲裁逻辑.瞬间交锋模块 = createEmptyCombatLogic().瞬间交锋模块;
  if (!normalized.仲裁逻辑.状态挂载模块) normalized.仲裁逻辑.状态挂载模块 = createEmptyCombatLogic().状态挂载模块;
  if (!normalized.仲裁逻辑.召唤与场地模块) normalized.仲裁逻辑.召唤与场地模块 = createEmptyCombatLogic().召唤与场地模块;

  const clash = normalized.仲裁逻辑.瞬间交锋模块;
  const state = normalized.仲裁逻辑.状态挂载模块;
  const field = normalized.仲裁逻辑.召唤与场地模块;

  const damageEffect = normalized.效果列表.find(effect => effect?.类型 === "伤害");
  if (damageEffect) {
    const num = damageEffect.数值 || {};
    clash.基础威力倍率 = clash.基础威力倍率 || Number(num.威力 || 0);
    clash.伤害类型 = clash.伤害类型 && clash.伤害类型 !== "无" ? clash.伤害类型 : (num.伤害类型 || "无");
    clash.穿透修饰 = clash.穿透修饰 || Number(num.穿透 || 0);
    clash.瞬间恢复比例 = clash.瞬间恢复比例 || Number(num.吸血比例 || 0);
  }

  const defenseEffect = normalized.效果列表.find(effect => effect?.类型 === "防御");
  if (defenseEffect) {
    const num = defenseEffect.数值 || {};
    clash.护盾绝对值 = clash.护盾绝对值 || Number(num.护盾值 || 0);
  }

  const stateEffect = normalized.效果列表.find(effect => ["控制", "增益", "减益"].includes(effect?.类型));
  if (stateEffect) {
    const control = stateEffect.控制 || {};
    const num = stateEffect.数值 || {};
    const panelMods = stateEffect.面板修改 || {};
    state.状态名称 = state.状态名称 && state.状态名称 !== "无" ? state.状态名称 : (stateEffect.状态名称 || "无");
    state.持续回合 = state.持续回合 || Number(stateEffect.持续回合 || 0);
    state.面板修改比例 = {
      str: panelMods.str ?? state.面板修改比例?.str ?? 1.0,
      def: panelMods.def ?? state.面板修改比例?.def ?? 1.0,
      agi: panelMods.agi ?? state.面板修改比例?.agi ?? 1.0,
      men_max: panelMods.men_max ?? state.面板修改比例?.men_max ?? 1.0,
      sp_max: panelMods.sp_max ?? state.面板修改比例?.sp_max ?? 1.0
    };
    state.持续真伤dot = state.持续真伤dot || Number(num.dot || 0);
    state.特殊机制标识 = mergeSpecialFlags(state.特殊机制标识, [
      ...(stateEffect.标记 || []),
      control.控制类型,
      ...(control.效果 || []),
      control.可打断 ? "打断" : "",
      control.可被霸体免疫 === false ? "不可被霸体免疫" : ""
    ]);
  }

  const fieldEffect = normalized.效果列表.find(effect => ["场地", "特殊"].includes(effect?.类型));
  if (fieldEffect) {
    const special = fieldEffect.特殊 || {};
    field.实体名称 = field.实体名称 && field.实体名称 !== "无" ? field.实体名称 : (special.实体名称 || special.场地名称 || normalized.name || "无");
    field.持续回合 = field.持续回合 || Number(fieldEffect.持续回合 || 0);
    field.继承属性比例 = field.继承属性比例 || Number(special.继承属性比例 || 0);
    field.核心机制描述 = field.核心机制描述 && field.核心机制描述 !== "无" ? field.核心机制描述 : (special.核心机制描述 || "无");
    state.特殊机制标识 = mergeSpecialFlags(state.特殊机制标识, [special.特殊类型, ...(fieldEffect.标记 || [])]);
  }

  return normalized;
}

function parseSkillCostForChar(skill, char) {
  const stats = char?.stat || char || {};
  const costStr = normalizeSkillData(skill).消耗 || "无";
  const spMatch = costStr.match(/魂力:(\d+)(%?)/);
  const vitMatch = costStr.match(/体力:(\d+)(%?)/);
  const menMatch = costStr.match(/精神力:(\d+)(%?)/);

  const reqSp = spMatch ? (spMatch[2] ? Math.floor((stats.sp_max || 0) * parseInt(spMatch[1]) / 100) : parseInt(spMatch[1])) : 0;
  const reqVit = vitMatch ? (vitMatch[2] ? Math.floor((stats.vit_max || 0) * parseInt(vitMatch[1]) / 100) : parseInt(vitMatch[1])) : 0;
  const reqMen = menMatch ? (menMatch[2] ? Math.floor((stats.men_max || 0) * parseInt(menMatch[1]) / 100) : parseInt(menMatch[1])) : 0;

  return {
    reqSp,
    reqVit,
    reqMen,
    canCast: (stats.sp || 0) >= reqSp && (stats.vit || 0) >= reqVit && (stats.men || 0) >= reqMen
  };
}

function chooseWeightedOption(options) {
  const valid = (options || []).filter(option => option && option.weight > 0);
  if (valid.length === 0) return null;
  const totalWeight = valid.reduce((sum, option) => sum + option.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const option of valid) {
    roll -= option.weight;
    if (roll <= 0) return option;
  }
  return valid[0];
}

function rollD100() {
  return Math.floor(Math.random() * 100) + 1;
}

function rollBranchByPriority(branches, phaseLabel) {
  const traces = [];
  for (const branch of (branches || [])) {
    if (!branch) continue;
    const weight = Math.max(0, Math.min(95, Math.floor(branch.weight || 0)));
    if (weight <= 0) continue;

    const roll = rollD100();
    const hit = roll <= weight;
    traces.push(`[${phaseLabel}] ${branch.name || '未命名分支'} 权重:${weight} Roll:${roll} 判定:${hit ? '命中' : '未命中'}`);

    if (hit) {
      return { option: branch, trace: traces.join(' | '), roll, weight };
    }
  }

  return { option: null, trace: traces.join(' | ') };
}

function getSpecialAbilitySkillData(charData, abilityName) {
  const ability = charData?.special_abilities?.[abilityName];
  if (!ability) return null;
  if (ability.skill_data) return ability.skill_data;
  if (ability.仲裁逻辑 || ability.cast_time !== undefined || ability.技能类型) return ability;
  return null;
}

function applyStateToCharacter(targetChar, stateModule, sourceName, forceBuff) {
  if (!targetChar || !stateModule || !stateModule.状态名称 || stateModule.状态名称 === "无") return false;
  if (!targetChar.conditions) targetChar.conditions = {};

  const specialFlag = stateModule.特殊机制标识 || "无";
  const isBuff = forceBuff === true || specialFlag.includes("增益") || specialFlag.includes("霸体") || specialFlag.includes("免死") || specialFlag.includes("真身");

  targetChar.conditions[stateModule.状态名称] = {
    类型: isBuff ? "buff" : "debuff",
    层数: 1,
    描述: `由[${sourceName || stateModule.状态名称}]附加`,
    duration: stateModule.持续回合 || 0,
    stat_mods: stateModule.面板修改比例 || { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 },
    combat_effects: {
      skip_turn: specialFlag.includes("硬控"),
      dot_damage: stateModule.持续真伤dot || 0,
      armor_pen: 0
    }
  };
  return true;
}

function settleConditionsAtRoundEnd(char, label) {
  if (!char || !char.conditions) return { log: "", totalDot: 0, expired: [] };

  let totalDot = 0;
  let expired = [];
  let parts = [];

  Object.keys(char.conditions).forEach(key => {
    let cond = char.conditions[key];
    if (!cond) return;

    let combatEffects = cond.combat_effects || {};
    let dot = Math.max(0, combatEffects.dot_damage || 0);
    if (dot > 0) {
      char.vit = Math.max(0, char.vit - dot);
      totalDot += dot;
      parts.push(`[状态结算] ${label}受[${key}]影响，额外损失 ${dot} 点体力`);
    }

    if (typeof cond.duration === "number") {
      cond.duration -= 1;
      if (cond.duration <= 0) expired.push(key);
    }
  });

  expired.forEach(key => {
    delete char.conditions[key];
    if (char.active_sustains) {
      Object.keys(char.active_sustains).forEach(sustainKey => {
        if (char.active_sustains[sustainKey]?.related_condition === key) delete char.active_sustains[sustainKey];
      });
    }
    parts.push(`[状态消散] ${label}的[${key}]已结束`);
  });

  return { log: parts.join(" "), totalDot, expired };
}

function splitSkillCostModes(costStr) {
  const raw = String(costStr || "无").trim();
  if (!raw || raw === "无") return { upfront: "无", sustain: "", hasSustain: false };

  const parts = raw.split(/维持[:：]?/);
  return {
    upfront: (parts[0] || "无").trim() || "无",
    sustain: (parts[1] || "").trim(),
    hasSustain: parts.length > 1
  };
}

function parseCostStringForChar(costStr, char) {
  return parseSkillCostForChar({ 消耗: costStr || "无" }, char);
}

function formatParsedCost(parsed) {
  if (!parsed) return "无消耗";
  const parts = [];
  if (parsed.reqSp) parts.push(`魂力:${parsed.reqSp}`);
  if (parsed.reqVit) parts.push(`体力:${parsed.reqVit}`);
  if (parsed.reqMen) parts.push(`精神力:${parsed.reqMen}`);
  return parts.length > 0 ? parts.join(" ") : "无消耗";
}

function registerSustainEffect(char, key, config) {
  if (!char || !config || !config.sustain_cost || config.sustain_cost === "无") return;
  if (!char.active_sustains) char.active_sustains = {};
  char.active_sustains[key] = { ...config };
}

function resolveActionSustainConfig(char, actionType, skill, stateName) {
  const skillName = skill?.name || actionType || stateName || "持续效果";
  const costParts = splitSkillCostModes(skill?.消耗 || "无");
  const trueStateName = stateName || skill?.仲裁逻辑?.状态挂载模块?.状态名称 || "";

  if (costParts.hasSustain && costParts.sustain && costParts.sustain !== "无") {
    return {
      name: skillName,
      sustain_cost: costParts.sustain,
      effect_type: actionType?.includes("领域") ? "domain" : (actionType === "点燃生命之火" ? "life_fire" : (trueStateName ? "condition" : "generic")),
      related_condition: trueStateName || ""
    };
  }

  if (actionType === "点燃生命之火") {
    return {
      name: skillName,
      sustain_cost: `体力:${Math.max(1, Math.floor((char?.vit_max || 1) * 0.05))}`,
      effect_type: "life_fire",
      related_condition: ""
    };
  }

  if (["展开斗铠领域", "展开精神领域", "展开武魂领域"].includes(actionType)) {
    return {
      name: skillName,
      sustain_cost: `精神力:${Math.max(30, Math.floor((char?.men_max || 1) * 0.05))}`,
      effect_type: "domain",
      related_condition: ""
    };
  }

  if ((trueStateName || skillName).includes("真身")) {
    return {
      name: skillName,
      sustain_cost: `魂力:${Math.max(50, Math.floor((char?.sp_max || 1) * 0.05))}`,
      effect_type: "condition",
      related_condition: trueStateName || skillName
    };
  }

  return null;
}

function settleSustainEffectsAtRoundEnd(char, label) {
  if (!char?.active_sustains) return { log: "", broken: [] };

  const logs = [];
  const broken = [];

  Object.entries(char.active_sustains).forEach(([key, effect]) => {
    if (!effect) return;

    if (effect.effect_type === "domain" && (!char.active_domain || char.active_domain === "无")) {
      delete char.active_sustains[key];
      return;
    }
    if (effect.effect_type === "life_fire" && !char.bloodline_power?.life_fire) {
      delete char.active_sustains[key];
      return;
    }
    if (effect.effect_type === "condition" && effect.related_condition && !char.conditions?.[effect.related_condition]) {
      delete char.active_sustains[key];
      return;
    }

    const parsed = parseCostStringForChar(effect.sustain_cost, char);
    if (!parsed.canCast) {
      if (effect.effect_type === "domain") char.active_domain = "无";
      else if (effect.effect_type === "life_fire" && char.bloodline_power) char.bloodline_power.life_fire = false;
      else if (effect.effect_type === "condition" && effect.related_condition && char.conditions) delete char.conditions[effect.related_condition];

      delete char.active_sustains[key];
      broken.push(effect.name || key);
      logs.push(`[维持中断] ${label}已无力维持[${effect.name || key}]，效果自动解除`);
      return;
    }

    char.sp -= parsed.reqSp;
    char.vit -= parsed.reqVit;
    char.men -= parsed.reqMen;
    logs.push(`[维持结算] ${label}维持[${effect.name || key}]，消耗 ${formatParsedCost(parsed)}`);
  });

  return { log: logs.join(" "), broken };
}

function getBehaviorProfile(actor, target, battleState = {}) {
  const hpRatio = (actor?.vit || 0) / Math.max(1, actor?.vit_max || 1);
  const targetHpRatio = (target?.vit || 0) / Math.max(1, target?.vit_max || 1);
  const profile = {
    aggression: 10,
    caution: 10,
    control: 10,
    mobility: 10,
    burst: 10,
    finisher: 0
  };

  switch (actor?.type) {
    case "强攻系":
      profile.aggression += 25; profile.burst += 20; profile.caution -= 5; break;
    case "敏攻系":
      profile.mobility += 30; profile.aggression += 15; profile.caution += 5; break;
    case "防御系":
      profile.caution += 30; profile.control += 10; profile.aggression -= 10; break;
    case "控制系":
      profile.control += 30; profile.caution += 10; break;
    case "辅助系":
    case "治疗系":
    case "食物系":
      profile.caution += 25; profile.control += 15; profile.aggression -= 15; break;
  }

  if (hpRatio < 0.35) { profile.caution += 25; profile.burst += 10; }
  if (hpRatio < 0.2) { profile.caution += 35; profile.aggression -= 5; }
  if (targetHpRatio < 0.3) { profile.finisher += 25; profile.aggression += 10; }
  if (battleState.combatType === "死战" || battleState.isDeadlyFight) { profile.aggression += 15; profile.burst += 10; }
  if (battleState.combatType === "擂台切磋") { profile.caution += 10; profile.aggression -= 5; profile.burst -= 5; }
  if (battleState.isChargingHighThreat) { profile.control += 20; profile.mobility += 10; }
  if ((actor?.men_max || 0) > (target?.men_max || 0) * 1.2) profile.control += 10;

  return profile;
}

function adjustBehaviorWeight(branchName, baseWeight, actor, target, battleState = {}) {
  if (!baseWeight || baseWeight <= 0) return 0;
  const profile = getBehaviorProfile(actor, target, battleState);
  let weight = baseWeight;

  if (["武魂融合技", "点燃生命之火", "开启真身"].includes(branchName)) weight += profile.burst * 0.8 + profile.aggression * 0.4;
  else if (branchName === "展开领域") weight += profile.control * 0.8 + profile.caution * 0.3;
  else if (branchName === "召唤魂灵") weight += profile.control * 0.5 + profile.caution * 0.3;
  else if (branchName === "穿戴装备") weight += profile.caution * 0.9;
  else if (branchName === "亡命奔逃") weight += profile.caution * 1.1 - profile.aggression * 0.4;
  else if (branchName === "危机自保") weight += profile.caution * 0.7 + profile.control * 0.5;
  else if (branchName === "强势对轰") weight += profile.aggression * 0.9 + profile.burst * 0.5 + profile.finisher * 0.5 - profile.caution * 0.3;
  else if (branchName === "伺机闪避") weight += profile.mobility * 0.9 + profile.caution * 0.4;
  else if (branchName === "肉体兜底") weight += profile.caution * 0.2;

  weight += Math.floor(Math.random() * 11) - 5;
  return Math.max(0, Math.floor(weight));
}

function ensureActorDecisionMemory(actor) {
  if (!actor) return { last_action: "", recent_actions: {} };
  if (!actor.decision_memory) {
    actor.decision_memory = { last_action: "", recent_actions: {} };
  }
  if (!actor.decision_memory.recent_actions) actor.decision_memory.recent_actions = {};
  return actor.decision_memory;
}

function scoreCandidateAction(actor, target, battleState, candidate) {
  if (!candidate) return 0;
  const memory = ensureActorDecisionMemory(actor);
  const branchName = candidate.name || "未命名动作";
  let weight = Math.max(0, Math.floor(candidate.weight || 0));

  const repeatCount = memory.recent_actions[branchName] || 0;
  if (repeatCount > 0) weight -= repeatCount * 12;
  if (memory.last_action === branchName) weight -= 8;

  const targetHpRatio = (target?.vit || 0) / Math.max(1, target?.vit_max || 1);
  if (branchName === "强势对轰" && targetHpRatio < 0.35) weight += 10;
  if (branchName === "亡命奔逃" && (actor?.vit || 0) / Math.max(1, actor?.vit_max || 1) > 0.35) weight -= 15;
  if (branchName === "危机自保" && battleState?.isChargingHighThreat) weight += 8;

  return Math.max(0, weight);
}

function chooseActorActionByCandidates(actor, target, battleState, candidates, phaseLabel) {
  const scoredCandidates = (candidates || []).map(candidate => ({
    ...candidate,
    weight: scoreCandidateAction(actor, target, battleState, candidate)
  }));
  return rollBranchByPriority(scoredCandidates, phaseLabel);
}

function recordActorActionMemory(actor, actionName) {
  if (!actor || !actionName) return;
  const memory = ensureActorDecisionMemory(actor);
  Object.keys(memory.recent_actions).forEach(key => {
    memory.recent_actions[key] = Math.max(0, (memory.recent_actions[key] || 0) - 1);
    if (memory.recent_actions[key] <= 0) delete memory.recent_actions[key];
  });
  memory.recent_actions[actionName] = (memory.recent_actions[actionName] || 0) + 2;
  memory.last_action = actionName;
}

function buildBattleStateContext(actor, target, combatData, extra = {}) {
  const canFlee = combatData?.allow_flee !== false;
  const isDesperateNoEscape = (actor?.vit || 0) < (actor?.vit_max || 1) * 0.3 && !canFlee;
  return {
    combatType: combatData?.combat_type || "突发遭遇",
    isDeadlyFight: extra.isDeadlyFight ?? ((combatData?.combat_type || "突发遭遇") === "死战" || (combatData?.combat_type || "突发遭遇") === "突发遭遇"),
    ratio: extra.ratio ?? 1,
    playerPower: extra.playerPower ?? 0,
    isChargingHighThreat: !!extra.isChargingHighThreat,
    actorHpRatio: (actor?.vit || 0) / Math.max(1, actor?.vit_max || 1),
    targetHpRatio: (target?.vit || 0) / Math.max(1, target?.vit_max || 1),
    canFlee: canFlee,
    isDesperateNoEscape: isDesperateNoEscape,
    actor,
    target,
    combatData,
    ...extra
  };
}

function chooseAndBuildActorAction(actor, target, battleState, candidates, phaseLabel, logPrefix = "") {
  const choice = chooseActorActionByCandidates(actor, target, battleState, candidates, phaseLabel);
  if (!choice.option) return null;

  const action = choice.option.build();
  recordActorActionMemory(actor, choice.option.name || action.type);
  action.log = `${logPrefix}${choice.trace} ${action.log}`.trim();
  return action;
}

function collectCombatSkills(charData, alliedTeam = []) {
  const skills = [];

  if (charData?.spirit) {
    Object.entries(charData.spirit).forEach(([spKey, sp]) => {
      const spName = sp.表象名称 || spKey || "武魂";
      Object.values(sp.soul_spirits || {}).forEach(ss => {
        Object.values(ss.rings || {}).forEach(ring => {
          Object.entries(ring.魂技 || {}).forEach(([skillName, skillData]) => {
            if (skillData?.状态 !== "未生成") {
              const nSkill = normalizeSkillData(skillData, skillName);
              nSkill.source_tag = spName;
              skills.push(nSkill);
            }
          });
        });
      });
    });
  }

  if (charData?.bloodline_power) {
    Object.entries(charData.bloodline_power.skills || {}).forEach(([skillName, skillData]) => {
      if (skillData?.状态 !== "未生成") {
        const nSkill = normalizeSkillData(skillData, skillName);
        nSkill.source_tag = "血脉之力";
        skills.push(nSkill);
      }
    });
    Object.values(charData.bloodline_power.blood_rings || {}).forEach(ring => {
      Object.entries(ring.魂技 || {}).forEach(([skillName, skillData]) => {
        if (skillData?.状态 !== "未生成") {
          const nSkill = normalizeSkillData(skillData, skillName);
          nSkill.source_tag = "气血魂技";
          skills.push(nSkill);
        }
      });
    });
  }

  if (charData?.soul_bone) {
    Object.values(charData.soul_bone).forEach(bone => {
      Object.entries(bone.附带技能 || {}).forEach(([skillName, skillData]) => {
        if (skillData?.状态 !== "未生成" && skillData?.技能类型 !== "被动/基础属性提升") {
          const nSkill = normalizeSkillData(skillData, skillName);
          nSkill.source_tag = "魂骨技能";
          skills.push(nSkill);
        }
      });
    });
  }

  if (charData?.martial_fusion_skills) {
    Object.entries(charData.martial_fusion_skills).forEach(([fusionName, fusionSkill]) => {
      const partnerAlive = alliedTeam.some(unit => unit.name === fusionSkill.partner && unit.vit > 0);
      if (partnerAlive && fusionSkill.skill_data) {
        const nSkill = normalizeSkillData(fusionSkill.skill_data, `武魂融合技·${fusionName}`);
        nSkill.source_tag = "武魂融合技";
        skills.push(nSkill);
      }
    });
  }

  if (charData?.special_abilities) {
    Object.keys(charData.special_abilities).forEach(abilityName => {
      const skillData = getSpecialAbilitySkillData(charData, abilityName);
      if (skillData) {
        const nSkill = normalizeSkillData(skillData, abilityName);
        nSkill.source_tag = "特殊能力";
        skills.push(nSkill);
      }
    });
  }

  return skills;
}

function onPlayerAttack(playerInput, options = {}) {
  let combatData = window.BattleUIBridge?.getMVU("sd.world.combat");
  hydrateCombatData(combatData);
  let defender = combatData.participants.enemy;
  let attacker = combatData.participants.player;
  const mode = options.mode === "multi_round" ? "multi_round" : "single_round";
  const modeLabel = mode === "multi_round" ? "自动续推" : "单回合";
  const maxRounds = mode === "multi_round" ? 4 : 1;

  // --- 第一步：环境定调与状态快照 ---
  // 1. 旁路预判（仅限我方碾压敌方时可直接跳过，且不更新 MVU）
  let lvDiff = attacker.lv - defender.lv;
  if (lvDiff >= 30) {
    let systemPrompt = `[战力碾压旁路] 玩家等级碾压对手，无需进行繁琐博弈。请 AI 直接描写玩家以摧枯拉朽之势秒杀敌人的画面！`;
    sendToAI(playerInput, systemPrompt, { requestKind: 'battle_shortcut' });
    return;
  }

  // 2. 状态快照与控制拦截 (完全基于 Schema 属性驱动)
  defender.is_controlled = false;
  defender.temp_agi_mult = 1.0; 

  if (defender.conditions) {
    for (let key in defender.conditions) {
      let cond = defender.conditions[key];
      if (cond.combat_effects && cond.combat_effects.skip_turn === true) {
        defender.is_controlled = true;
      }
      if (cond.stat_mods && cond.stat_mods.agi !== undefined) {
        defender.temp_agi_mult *= cond.stat_mods.agi; 
      }
    }
  }
  defender.temp_agi_mult = Math.max(0.1, defender.temp_agi_mult);

  let roundCount = 0;
  let battleLog = [];
  let continueSimulation = true;
  let latestPlayerActionSummary = {
    action_type: '无',
    element_count: 1,
    is_charged: false
  };

  while (roundCount < maxRounds && continueSimulation && defender.vit > 0) {
    roundCount++;
    let roundLog = `[第${roundCount}回合] `;

    let isCharging = attacker.charging_skill != null;
    let playerAction = null;

    // 1. 玩家硬控拦截扫描
    let isPlayerControlled = false;
    if (attacker.conditions) {
      for (let key in attacker.conditions) {
        if (attacker.conditions[key].combat_effects && attacker.conditions[key].combat_effects.skip_turn === true) {
          isPlayerControlled = true;
          break;
        }
      }
    }

    if (isPlayerControlled) {
      roundLog += `[状态受控] 玩家处于硬控状态，本回合无法动作！ `;
      playerAction = { action_type: "被控挨打", cast_time: 100, skill: null };
      attacker.charging_skill = null; 
    } else if (isCharging) {
      playerAction = attacker.charging_skill;
      if (playerAction.cast_time <= 40) {
        roundLog += `[蓄力完成] 玩家完成了蓄力，释放了[${playerAction.skill.name}]！ `;
        attacker.charging_skill = null;
      } else {
        playerAction.cast_time -= 30;
        roundLog += `[蓄力中] 玩家正在为[${playerAction.skill.name}]蓄力，当前剩余前摇：${playerAction.cast_time}。本回合无法动作！ `;
        playerAction = { action_type: "蓄力挨打", cast_time: 100, skill: null }; 
      }
    } else {
      playerAction = parsePlayerIntent(playerInput);

      // 💥【终极动作序列时间片机制】一回合能做出的总行动上限为 cast_time = 40！
      let totalTimeCost = 0;
      let validPreActions = [];
      let carryOverAction = null;

      // 1. 先把预先声明的副动作逐个填入时间槽
      if (playerAction.pre_actions && playerAction.pre_actions.length > 0) {
        for (let i = 0; i < playerAction.pre_actions.length; i++) {
          let pa = playerAction.pre_actions[i];
          if (totalTimeCost + pa.cast_time <= 40) {
            totalTimeCost += pa.cast_time;
            validPreActions.push(pa);
          } else {
            // 只要超了40，后面所有的动作（包括没放出来的副动作和主动作）全部转为蓄力拖延到下一回合
            carryOverAction = pa;
            // 把没用掉的剩余时间拿来减前摇
            carryOverAction.cast_time -= Math.max(0, 40 - totalTimeCost);
            break;
          }
        }
      }

      // 2. 如果副动作还没爆表，轮到尝试塞入主动作
      if (!carryOverAction) {
        if (totalTimeCost + playerAction.cast_time <= 40) {
          totalTimeCost += playerAction.cast_time;
          // 全套连招完成！顺利打出！
        } else {
          // 主动作超时了，转为蓄力
          carryOverAction = playerAction;
          carryOverAction.cast_time -= Math.max(0, 40 - totalTimeCost);
        }
      }

      // 执行成功挤入本回合时间片的副动作
      validPreActions.forEach(preAct => {
        let preCostLog = applyActionCost(attacker, preAct);
        if (preCostLog) roundLog += preCostLog + " ";
        if (preAct.action_type === "穿戴装备") {
          attacker.equip[preAct.equip_target].equip_status = "已装备";
          roundLog += `[连招生效] 玩家在电光火石间成功穿戴了${preAct.equip_target === 'armor' ? '斗铠' : '机甲'}！ `;
        }
      });
      // 为了让后续流程还能认得出主动作，必须将原本的 pre_actions 覆写为实际生效的这几个
      playerAction.pre_actions = validPreActions;

      // 3. 判定本回合到底是出手，还是蓄力挨打
      if (carryOverAction) {
        attacker.charging_skill = carryOverAction;
        roundLog += `[连招中断/转蓄力] 动作太过繁琐或前摇过长！玩家开始为[${carryOverAction.skill?.name || carryOverAction.action_type}]进行蓄力准备，当前剩余前摇：${carryOverAction.cast_time}。本回合失去主攻击机会！ `;
        // 主动作被没收，变成了“蓄力挨打”态，用来触发后续的防御与闪避博弈
        playerAction = { action_type: "蓄力挨打", cast_time: 100, skill: null };
      } else {
        if (playerAction.action_type !== "施法失败") {
          let costLog = applyActionCost(attacker, playerAction);
          if (costLog) roundLog += costLog + " ";
        }
      }
    }

    latestPlayerActionSummary = {
      action_type: String(playerAction?.skill?.name || attacker?.charging_skill?.skill?.name || playerAction?.action_type || attacker?.action_declared || '无'),
      element_count: Math.max(1, Number(playerAction?.element_count || playerAction?.skill?.element_count || 1)),
      is_charged: Boolean(playerAction?.is_charged || playerAction?.skill?.is_charged || attacker?.charging_skill)
    };

    let ratio = calculateReactionRatio(attacker, defender, playerAction, combatData);
    let npcAction = defender.is_controlled ? 
                    { type: "无法反应", log: "NPC处于被控状态，无法动作。" } : 
                    determineNpcAction(combatData, playerAction, ratio);
    
    let settleResult = executeClash(playerAction, npcAction, combatData);
    roundLog += npcAction.log + " " + settleResult.desc;

    if (attacker.charging_skill != null) {
      let damageRatio = settleResult.dmg / attacker.vit_max;
      let isControlled = attacker.conditions && attacker.conditions["眩晕"];
      
      let hasSuperArmor = false;
      if (attacker.conditions) {
        for (let key in attacker.conditions) {
          if (key.includes("霸体") ) hasSuperArmor = true;
        }
      }
      
      if (npcAction.type === "危机自保" && npcAction.skill.技能类型 === "控制" && npcAction.skill.cast_time < 10) {
        let pMult = getWoundMult(attacker);
        let dMult = getWoundMult(defender);
        if (defender.men_max > attacker.men_max || (defender.agi * dMult) > (attacker.agi * pMult)) {
          if (hasSuperArmor) {
            roundLog += ` NPC释放[${npcAction.skill.name}]试图打断，但玩家处于霸体状态，强行免疫了控制！`;
          } else {
            let backlashDmg = Math.floor(attacker.vit_max * 0.05); 
            attacker.vit -= backlashDmg;
            if (!attacker.conditions) attacker.conditions = {};
            attacker.conditions["僵直"] = { 
              类型: "debuff", 层数: 1, 描述: "施法被打断的反噬", duration: 1, 
              stat_mods: { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 }, 
              combat_effects: { skip_turn: true, dot_damage: 0, armor_pen: 0 } 
            };
            roundLog += ` NPC释放[${npcAction.skill.name}]成功打断玩家施法！玩家遭到反噬，承受 ${backlashDmg} 点真伤并陷入[僵直]！`;
            attacker.charging_skill = null;
            let attackerUpkeep = settleSustainEffectsAtRoundEnd(attacker, "玩家");
            let defenderUpkeep = settleSustainEffectsAtRoundEnd(defender, "NPC");
            if (attackerUpkeep.log) roundLog += ` ${attackerUpkeep.log}`;
            if (defenderUpkeep.log) roundLog += ` ${defenderUpkeep.log}`;
            let attackerRoundEnd = settleConditionsAtRoundEnd(attacker, "玩家");
            let defenderRoundEnd = settleConditionsAtRoundEnd(defender, "NPC");
            if (attackerRoundEnd.log) roundLog += ` ${attackerRoundEnd.log}`;
            if (defenderRoundEnd.log) roundLog += ` ${defenderRoundEnd.log}`;
            if (attacker.vit <= 0 || defender.vit <= 0) continueSimulation = false;
            battleLog.push(roundLog);
            continue;
          }
        }
      }

      if (!hasSuperArmor && (damageRatio >= 0.3 || isControlled)) {
        roundLog += ` [蓄力打断] 玩家受到重创或硬控，蓄力被强制打断！`;
        attacker.charging_skill = null;
      } else if (hasSuperArmor && isControlled) {
        roundLog += ` [霸体强抗] 玩家遭遇硬控，但凭借霸体强行稳住阵脚，蓄力继续！`;
        delete attacker.conditions["眩晕"]; 
      }
    }
    
    
    // 简单判断 NPC 是否被打断 (如果玩家伤害极高或带有硬控，视为打断)
    let isNpcInterrupted = (settleResult.dmg / defender.vit_max >= 0.15) || (playerAction.skill?.仲裁逻辑?.状态挂载模块?.特殊机制标识?.includes("硬控"));
    
    if (npcAction.type === "穿戴装备") {
      if (!isNpcInterrupted) {
        defender.equip[npcAction.skill.equip_target].equip_status = "已装备";
        roundLog += ` [装备生效] NPC成功穿戴了${npcAction.skill.equip_target === 'armor' ? '斗铠' : '机甲'}，防御力大增！`;
      } else {
        roundLog += ` [穿戴失败] 玩家的猛烈攻击强行打断了NPC的装备穿戴过程！`;
      }
    }
    
    // --- 第四步：打击烈度与破防标尺 ---
    let finalDmg = settleResult.dmg;
    if (finalDmg > 0) {
      if (finalDmg < defender.def * 0.1) {
        defender.vit -= 1;
        roundLog += ` [未破防] 攻击如同刮痧，NPC仅强制扣除 1 点体力。`;
      } else {
        defender.vit -= finalDmg;
        if (finalDmg > defender.sp_max * 0.5) {
          if (!defender.conditions) defender.conditions = {};
          defender.conditions["重度流血"] = { 
            类型: "debuff", 层数: 1, 描述: "重创导致的流血", duration: 3, 
            stat_mods: { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 }, 
            combat_effects: { skip_turn: false, dot_damage: Math.floor(defender.vit_max * 0.05), armor_pen: 0 } 
          };
          roundLog += ` [重创打击] 伤害极高！NPC遭到重创，被附加[重度流血]状态！`;
        }
      }
    }

    // --- 第五步：装备护主与战损结算 ---
    let combatType = combatData.combat_type || "突发遭遇";
    
    if (defender.vit < defender.vit_max * 0.1) {
      let hasMech = defender.equip?.mech?.lv !== "无" && defender.equip?.mech?.status !== "重创";
      let hasArmor = defender.equip?.armor?.equip_status === "已装备";
      
      if (combatType === "擂台切磋" && defender.vit <= defender.vit_max * 0.05) {
        defender.vit = Math.floor(defender.vit_max * 0.05); // 强制锁血 5%
        roundLog += ` [擂台保护] 胜负已分！裁判强行介入，终止了致命一击！`;
        continueSimulation = false; // 强制结束战斗
      } else if (hasMech || hasArmor) {
        defender.vit = Math.floor(defender.vit_max * 0.1);
        let armorLog = applyArmorDamage(defender); 
        roundLog += ` [装备护主] 致命打击触发替死锁血！NPC体力强制锁定在10%！${armorLog}`;
      } else if (combatType === "升灵台虚拟战斗" || combatType === "魂灵塔冲塔") {
        // 虚拟战斗中，敌方体力归零照常死亡，如果是己方或判定特殊保护，需要锁定体力并标记退出
        let saveLog = triggerDeathSave(defender);
        if (saveLog) {
          defender.vit = Math.floor(defender.vit_max * 0.1);
          roundLog += ` ${saveLog}`;
        } else {
          // 虚拟环境，如果是玩家/模拟死亡也是正常走到 vit <= 0，靠 settleBattle 拦截
        }
      } else {
        let saveLog = triggerDeathSave(defender);
        if (saveLog) {
          defender.vit = Math.floor(defender.vit_max * 0.1);
          roundLog += ` ${saveLog}`;
        }
      }
    }

    let attackerUpkeep = settleSustainEffectsAtRoundEnd(attacker, "玩家");
    let defenderUpkeep = settleSustainEffectsAtRoundEnd(defender, "NPC");
    if (attackerUpkeep.log) roundLog += ` ${attackerUpkeep.log}`;
    if (defenderUpkeep.log) roundLog += ` ${defenderUpkeep.log}`;


    let attackerRoundEnd = settleConditionsAtRoundEnd(attacker, "玩家");
    let defenderRoundEnd = settleConditionsAtRoundEnd(defender, "NPC");
    if (attackerRoundEnd.log) roundLog += ` ${attackerRoundEnd.log}`;
    if (defenderRoundEnd.log) roundLog += ` ${defenderRoundEnd.log}`;

    if (attacker.vit <= 0 || defender.vit <= 0) {
      continueSimulation = false;
    } else if (attacker.charging_skill == null) {
      if (mode === "single_round") {
        continueSimulation = false;
        roundLog += ` [单回合仲裁] 当前模式为单回合，本次暗箱演算到此结束。`;
      } else {
        const continueThresholdReached = settleResult.dmg / Math.max(1, attacker.vit_max) >= 0.05;
        if (continueThresholdReached) {
          continueSimulation = false;
          roundLog += ` [续推终止] 本回合攻防烈度已达阈值，暗箱续推停止。`;
        } else {
          const continueRoll = Math.random();
          const continueHit = continueRoll < 0.7;
          continueSimulation = continueHit;
          roundLog += ` [续推判定] 本回合伤害未达阈值，触发70%概率续推。Roll:${continueRoll.toFixed(2)} 判定:${continueHit ? '继续' : '停止'}。`;
        }
      }
    }
    
    battleLog.push(roundLog);
  }

  let isWin = defender.vit <= 0;
  const unresolvedReason = (!isWin && attacker.vit > 0 && defender.vit > 0)
    ? (mode === "single_round" ? "single_round_limit" : "simulation_stopped")
    : "";
  let extraPatchOps = [];
  let settleResult = settleBattle(attacker, defender, isWin, {
    mode,
    roundCount,
    maxRounds,
    unresolvedReason,
    combatData
  });
  if (settleResult.log) battleLog.push(settleResult.log);
  if (settleResult.extraPatchOps) extraPatchOps = settleResult.extraPatchOps;

  const settleSummaryResult = isWin ? '胜利' : (attacker.vit <= 0 ? '失败' : (unresolvedReason ? '未决' : '平局'));
  combatData.summary = Object.assign({}, combatData.summary || {}, {
    player_action: {
      action_type: latestPlayerActionSummary.action_type,
      element_count: latestPlayerActionSummary.element_count,
      is_charged: latestPlayerActionSummary.is_charged
    },
    settle_result: {
      target_npc: String(defender?.name || defender?.char_name || defender?.名称 || '未知目标'),
      result: settleSummaryResult,
      is_killed: Boolean(isWin && defender.vit <= 0)
    },
    round_count: roundCount,
    mode,
    generated_by: 'Battle_UI'
  });

  const mvuUpdate = window.BattleUIBridge?.persistCombatData?.(combatData, {
    analysis: 'Frontend battle arbitration already produced the exact combat result. Apply the following JSONPatch exactly as given.',
    extraPatchOps
  }) || null;

  let systemPrompt = `[前端暗箱演算完毕][${modeLabel}] 共进行 ${roundCount} 回合。\n战报：\n${battleLog.join("\n")}\n请严格根据战报描写画面！`;
  if (mvuUpdate?.updateVariableText) {
    systemPrompt += `\n\n[MVU变量更新要求]\n你必须在本次回复结尾附加一个 <UpdateVariable> 块。请严格原样输出下面这段 JSONPatch，不要修改 op、path、value：\n${mvuUpdate.updateVariableText}`;
  }
  sendToAI(playerInput, systemPrompt, { mvuUpdate, requestKind: 'battle_arbitration' });
}

// ==========================================
// 📍 2. 战前消耗与战后结算区 (彻底净化版)
// ==========================================
function applyActionCost(attackerChar, playerAction) {
  let stats = attackerChar.stat || attackerChar;
  let status = attackerChar.status || {};
  let log = "";
  
  // 💥 1. 通用真实面板扣费逻辑 (支持固定值与百分比，绝不硬编码！)
  if (playerAction.skill && playerAction.skill.消耗 !== "无") {
    const costParts = splitSkillCostModes(playerAction.skill.消耗);
    const parsedCost = parseCostStringForChar(costParts.upfront, attackerChar);

    if (parsedCost.canCast) {
      stats.sp -= parsedCost.reqSp;
      stats.vit -= parsedCost.reqVit;
      stats.men -= parsedCost.reqMen;

      const sustainConfig = resolveActionSustainConfig(attackerChar, playerAction.action_type, playerAction.skill, playerAction.skill?.仲裁逻辑?.状态挂载模块?.状态名称);
      const shouldRegisterSustain = costParts.hasSustain || ["展开斗铠领域", "展开精神领域", "展开武魂领域", "点燃生命之火"].includes(playerAction.action_type) || ((sustainConfig?.related_condition || sustainConfig?.name || "").includes("真身"));
      if (shouldRegisterSustain && sustainConfig) {
        if (costParts.hasSustain && costParts.sustain) sustainConfig.sustain_cost = costParts.sustain;
        registerSustainEffect(attackerChar, `${playerAction.action_type || 'skill'}:${playerAction.skill.name}`, sustainConfig);
      }

      log = `[战前消耗] 释放[${playerAction.skill.name}]，扣除 ${parsedCost.reqSp ? '魂力:'+parsedCost.reqSp : ''} ${parsedCost.reqVit ? '体力:'+parsedCost.reqVit : ''} ${parsedCost.reqMen ? '精神力:'+parsedCost.reqMen : ''}。${shouldRegisterSustain ? '(已登记持续维持)' : ''}`;
    } else {
      playerAction.action_type = "施法失败";
      log = `[状态枯竭] 自身状态不足以支撑[${playerAction.skill.name}]的启动消耗，施法失败！`;
      return log;
    }
  }
  
  // 💥 2. 纯机制类状态切换 (不涉及具体数值伤害，仅改变底层状态)
  if (playerAction.action_type === "吸血反哺") {
    let ratio = playerAction.heal_ratio > 0 ? playerAction.heal_ratio : 0.3;
    let spGain = Math.floor(stats.sp_max * ratio);
    let vitGain = Math.floor(stats.vit_max * ratio);
    stats.sp = Math.min(stats.sp_max, stats.sp + spGain);
    stats.vit = Math.min(stats.vit_max, stats.vit + vitGain);
    log = `[机制反哺] 触发吸血/减耗机制，强制恢复状态！`;
  }
  else if (playerAction.action_type === "点燃生命之火") {
    if (attackerChar.bloodline_power) {
      attackerChar.bloodline_power.life_fire = true;
      const sustainConfig = resolveActionSustainConfig(attackerChar, playerAction.action_type, playerAction.skill, "");
      if (sustainConfig) registerSustainEffect(attackerChar, `life_fire:${playerAction.skill?.name || '点燃生命之火'}`, sustainConfig);
      log += ` [底蕴透支] 强行点燃生命之火！气血如烘炉般燃烧，全属性临时翻倍！(警告：战后熄灭将面临毁灭性反噬)`;
    } else {
      playerAction.action_type = "法则失败";
      log = `[状态枯竭] 未觉醒相关血脉，无法点燃生命之火！`;
    }
  }
  // 领域状态挂载 (扣费已在上面通用逻辑完成，这里只挂载标识)
  else if (playerAction.action_type === "展开斗铠领域") {
    status.active_domain = attackerChar.equip?.armor?.lv >= 4 ? "【四字斗铠领域】全开(未定)" : "【三字斗铠领域】全开(未定)";
    const sustainConfig = resolveActionSustainConfig(attackerChar, playerAction.action_type, playerAction.skill, "");
    if (sustainConfig) registerSustainEffect(attackerChar, `domain:${playerAction.action_type}`, sustainConfig);
    log += ` [领域降临] 斗铠法则主场展开！`;
  }
  else if (playerAction.action_type === "展开精神领域") {
    status.active_domain = "【精神领域】全开";
    const sustainConfig = resolveActionSustainConfig(attackerChar, playerAction.action_type, playerAction.skill, "");
    if (sustainConfig) registerSustainEffect(attackerChar, `domain:${playerAction.action_type}`, sustainConfig);
    log += ` [领域降临] 精神法则主场展开！`;
  }
  else if (playerAction.action_type === "展开武魂领域") {
    status.active_domain = "【武魂领域】全开";
    const sustainConfig = resolveActionSustainConfig(attackerChar, playerAction.action_type, playerAction.skill, "");
    if (sustainConfig) registerSustainEffect(attackerChar, `domain:${playerAction.action_type}`, sustainConfig);
    log += ` [领域降临] 武魂本源领域展开！`;
  }

  return log;
}

function settleBattle(attackerChar, defenderChar, isWin, options = {}) {
  let log = "";
  let extraPatchOps = [];
  let attackerStats = attackerChar.stat || attackerChar;
  let defenderStats = defenderChar.stat || defenderChar;
  let defenderName = defenderChar.name || "敌人";
  
  // 读取战斗类型
  let combatData = options.combatData || window.BattleUIBridge?.getMVU("sd.world.combat");
  let combatType = combatData.combat_type || "突发遭遇";
  let inventory = window.BattleUIBridge?.getMVU("sd.char.主角.inventory") || {};
  
  // --- 触发世界战斗图鉴录入 ---
  let bestiary = window.BattleUIBridge?.getMVU("sd.world.bestiary") || {};
  if (defenderName && defenderName !== "敌人" && defenderName !== "未知") {
    let monsterEntry = bestiary[defenderName];
    if (!monsterEntry) {
      extraPatchOps.push({
        op: "add",
        path: `/sd/world/bestiary/${defenderName}`,
        value: { 交手次数: 1, 首次记录: `由 ${attackerChar.name || "主角"} 在${combatType}中遭遇` }
      });
    } else {
      extraPatchOps.push({
        op: "replace",
        path: `/sd/world/bestiary/${defenderName}/交手次数`,
        value: (monsterEntry.交手次数 || 1) + 1
      });
    }
  }
  
  if (combatType === "升灵台虚拟战斗") {
    if (isWin) {
      let killedAge = combatData.killed_age || defenderStats.age || 100;
      let partySize = combatData.party_size || 1;
      let ticket = combatData.ascension_ticket || "初级升灵台门票";
      let maxAge = ticket === "高级升灵台门票" ? 100000 : (ticket === "中级升灵台门票" ? 20000 : 3000);
      killedAge = Math.min(killedAge, maxAge);

      let rings = Object.keys(attackerChar.rings || {});
      let totalRings = rings.length;
      if (totalRings > 0) {
        let gain = Math.floor(killedAge / partySize / totalRings);
        log = `[升灵台结算] 击溃虚拟魂兽！化为纯净修为能量涌入体内(${partySize}人平分)，拥有 ${totalRings} 个魂环均获得大约 ${gain} 年修为提升！(请 AI 描写吸收能量的画面)`;
        rings.forEach(rIndex => {
          const oldAge = attackerChar.rings[rIndex].年限 || 10;
          extraPatchOps.push({ op: "replace", path: `/sd/char/主角/rings/${rIndex}/年限`, value: oldAge + gain });
        });
      } else {
        log = `[升灵台结算] 虚拟魂兽死亡！但玩家尚未拥有魂环，无法吸收升灵能量，能量缓缓消散...`;
      }
    } else {
      log = `[升灵台保护] 玩家受到致命创伤，升灵台保护机制触发！一道接引光芒落下，强制将其弹出升灵台。(虚拟战败，无实质损伤，但终止了本次历练)`;
      attackerChar.vit = 1;
    }
    return { log, extraPatchOps };
  }

  if (combatType === "魂灵塔冲塔") {
    let floor = combatData.floor || 1;
    if (isWin) {
      let ageDesc = "十年";
      if (floor >= 40) ageDesc = "十万年";
      else if (floor >= 30) ageDesc = "万年";
      else if (floor >= 20) ageDesc = "千年";
      else if (floor >= 10) ageDesc = "百年";

      log = `🏆[冲塔成功] 镇守第 ${floor} 层的 ${defenderName} 被彻底击溃！玩家成功通关本层，获得了该层魂灵的【五折购买特权】，并获赠【${ageDesc}魂灵(冲塔自选)】！(请 AI 描写通关奖励降落的场景)`;
      extraPatchOps.push({ op: "replace", path: `/sd/char/主角/tower_records/discount_available/${floor}`, value: true });

      let itemName = `${ageDesc}魂灵(冲塔自选)`;
      let currentItem = inventory[itemName];
      if (currentItem) {
        extraPatchOps.push({ op: "replace", path: `/sd/char/主角/inventory/${itemName}/数量`, value: (currentItem.数量 || 0) + 1 });
      } else {
        extraPatchOps.push({ op: "replace", path: `/sd/char/主角/inventory/${itemName}`, value: { 数量: 1, 类型: "魂灵", 品质: "普通", 描述: `魂灵塔第${floor}层战利品` } });
      }
    } else {
      log = `💀[冲塔失败] 玩家遭到 ${defenderName} 重创，魂灵塔阵法排斥之力发动，将其强行传送出塔外！(请 AI 描写重伤弹出塔外的虚弱状态)`;
      attackerChar.vit = 1;
    }
    return { log, extraPatchOps };
  }

  if (isWin) {
    let lvDiff = defenderStats.lv - attackerStats.lv;
    
    const fList = Object.keys(defenderChar.social?.factions || {});
    const isBeast = fList.includes("魂兽一族") || fList.some(name => name.includes("魂兽")) || defenderStats.age >= 100;
    const isAbyss = fList.includes("深渊生物") || fList.some(name => name.includes("深渊"));
    let isBeastOrAbyss = isBeast || isAbyss;
    
    if (lvDiff <= -5) {
      log = `[实战结算] 击败了对手，但因等级碾压(等级差≤-5)，毫无实战感悟，收益为 0。`;
    } else {
      let myTalentScore = { "绝世妖孽": 5, "顶级天才": 4, "天才": 3, "优秀": 2, "正常": 1, "劣等": 0 }[attackerStats.talent_tier] || 1;
      let targetTalentScore = 1;
      
      if (isBeastOrAbyss) {
        if (defenderStats.age >= 100000) targetTalentScore = 5;
        else if (defenderStats.age >= 10000) targetTalentScore = 3;
        else if (defenderStats.age >= 1000) targetTalentScore = 2;
        else targetTalentScore = 0;
      } else {
        targetTalentScore = { "绝世妖孽": 5, "顶级天才": 4, "天才": 3, "优秀": 2, "正常": 1, "劣等": 0 }[defenderStats.talent_tier] || 1;
      }
      let talentMult = Math.max(0.1, 1 + (targetTalentScore - myTalentScore) * 0.2);
      
      let lvMult = 1.0;
      if (lvDiff >= 3) lvMult = 1.5 + (lvDiff - 3) * 0.2;
      
      let historyMult = 1.0;
      if (!isBeastOrAbyss) {
        if (!attackerChar.combat_history) attackerChar.combat_history = {};
        let history = attackerChar.combat_history[defenderName];
        if (history) {
          if (history.count === 1) historyMult = 0.5;
          else if (history.count === 2) historyMult = 0.1;
          else if (history.count >= 3) historyMult = 0;
        }
      }
      
      let finalMult = talentMult * lvMult * historyMult;
      
      if (finalMult <= 0) {
         log = `[实战结算] 击败了对手，但因多次交手已无新感悟，收益递减为 0。`;
      } else {
         let baseGain = 10;
         let finalGain = Math.floor(baseGain * finalMult);
         
         if (finalGain > 0) {
           if (!attackerStats.trained_bonus) attackerStats.trained_bonus = { str:0, def:0, agi:0, vit_max:0, men_max:0 };
           attackerStats.trained_bonus.str += finalGain;
           attackerStats.trained_bonus.def += finalGain;
           attackerStats.trained_bonus.agi += finalGain;
           attackerStats.trained_bonus.vit_max += finalGain;
           attackerStats.trained_bonus.men_max += Math.floor(finalGain * 0.5);
           log = `[实战结算] 战斗胜利！(等级差:${lvDiff}, 天赋乘区:${talentMult.toFixed(1)}, 递减:${historyMult}) 获得 ${finalGain} 点实战六维成长！`;
         } else {
           log = `[实战结算] 战斗胜利，但综合评估后收益微乎其微。`;
         }
      }
    }

    if (!isBeastOrAbyss) {
      if (!attackerChar.combat_history) attackerChar.combat_history = {};
      if (!attackerChar.combat_history[defenderName]) attackerChar.combat_history[defenderName] = { count: 0, last_tick: 0 };
      attackerChar.combat_history[defenderName].count += 1;
    }
    if (combatType === "擂台切磋") {
      log += ` 🏆[擂台结算] 堂堂正正地赢得了比赛！(请 AI 描写观众的欢呼与对手的反应)`;
    } else if (isBeastOrAbyss) {
      if (isAbyss) {
        attackerChar.abyss_kill_request = { kill_tier: defenderStats.talent_tier || '炮灰', quantity: 1 };
        log += ` 💀[深渊击杀确认] 斩杀深渊生物，正在向战神殿系统发送战功兑换申请！(请 AI 描写深渊能量消散的画面)`;
      } else {
        log += ` 💀[魂兽击杀确认] 魂兽死亡！(请 AI 描写魂环浮现与战利品掉落的画面)`;
      }
    } else {
      log += ` 💀[生死决断] 敌人已被彻底击溃！(请 AI 描写搜刮战利品或审问的画面)`;
    }
  } else {
    if (options.unresolvedReason === "single_round_limit") {
      log = `[实战结算] 单回合仲裁结束，当前尚未分出胜负，双方仍在激烈对峙。`;
    } else if (options.unresolvedReason === "simulation_stopped") {
      log = `[实战结算] 暗箱续推暂告一段落，当前仍未决出胜负，战局进入新的对峙阶段。`;
    } else {
      log = `[实战结算] 战斗失败或逃跑，未能获得实战成长。`;
    }
  }

  return { log, extraPatchOps };
}

function applyArmorDamage(defender) {
  let log = "";
  if (defender.equip.mech.lv !== "无" && defender.equip.mech.status !== "重创") {
    if (defender.equip.mech.status === "完好") {
      defender.equip.mech.status = "受损";
      defender.equip.mech.品质系数 = 0.5;
      log = `[战损] 敌方最外层的机甲装甲大面积凹陷，状态降级为【受损】！`;
    } else if (defender.equip.mech.status === "受损") {
      defender.equip.mech.status = "重创";
      defender.equip.mech.品质系数 = 0;
      log = `[战损] 敌方机甲核心法阵爆裂，状态降级为【重创】，彻底瘫痪！`;
    }
    return log; 
  }
  if (defender.equip.armor.equip_status === "已装备") {
    let parts = Object.keys(defender.equip.armor.parts);
    let intactParts = parts.filter(p => defender.equip.armor.parts[p].状态 === "完好");
    if (intactParts.length > 0) {
      let targetPart = intactParts[Math.floor(Math.random() * intactParts.length)];
      defender.equip.armor.parts[targetPart].状态 = "碎裂";
      defender.equip.armor.parts[targetPart].品质系数 = 0;
      log = `[战损] 敌方贴身的斗铠【${targetPart}】承受不住透体的重击，轰然碎裂！`;
    }
  }
  return log;
}

function triggerDeathSave(defender) {
  return null; // 预留接口
}

// ==========================================
// 📍 伤势折损计算
// ==========================================
function getWoundMult(char) {
  let currentVit = Math.max(0, char?.vit || 0);
  let maxVit = Math.max(1, char?.vit_max || 1);
  let ratio = currentVit / maxVit;
  if (ratio > 0.5) return 1.0;
  if (ratio > 0.3) return 0.9;
  if (ratio > 0.1) return 0.7;
  return 0.5;
}

// ==========================================
// 📍 核心结算区：动作博弈与交锋
// ==========================================
function calculateReactionRatio(attacker, defender, playerAction, combatData) {
  let pMult = getWoundMult(attacker);
  let dMult = getWoundMult(defender);
  
  let castPenalty = Math.min(0.9, playerAction.cast_time / 100); 
  let attackerSpeed = (attacker.agi * pMult) * (1 - castPenalty);
  
  let defenderReaction = (defender.agi * dMult) + defender.men_max;
  let ratio = defenderReaction / Math.max(1, attackerSpeed);

  if (combatData && combatData.initiative !== "无" && combatData.initiative !== defender.name) {
    ratio *= 0.5; 
  }
  
  return ratio;
}

function executeClash(playerAction, npcAction, combatData) {
  hydrateCombatData(combatData);
  let attacker = combatData.participants.player; 
  let attackerFinalStat = attacker.final || attacker;
  let defender = combatData.participants.enemy;
  let defenderFinalStat = defender.final || defender;
  let result = { dmg: 0, desc: "" };

  playerAction.skill = normalizeSkillData(playerAction.skill || {
    name: "普通攻击",
    技能类型: "输出",
    对象: "敌方/单体",
    仲裁逻辑: createEmptyCombatLogic()
  }, playerAction.skill?.name || "普通攻击");
  if (npcAction.skill) {
    npcAction.skill = normalizeSkillData(npcAction.skill, npcAction.skill.name || npcAction.skill.技能名称 || "未知技能");
  }

  let pLogic = playerAction.skill.仲裁逻辑 || {};
  let pClash = pLogic.瞬间交锋模块 || { 基础威力倍率: 0, 穿透修饰: 0, 护盾绝对值: 0, 瞬间恢复比例: 0 };
  let pState = pLogic.状态挂载模块 || { 状态名称: "无", 持续回合: 0, 面板修改比例: {}, 特殊机制标识: "无", 持续真伤dot: 0 };
  
  let nLogic = npcAction.skill ? (npcAction.skill.仲裁逻辑 || {}) : {};
  let nClash = nLogic.瞬间交锋模块 || { 基础威力倍率: 0, 穿透修饰: 0, 护盾绝对值: 0, 瞬间恢复比例: 0 };

  let pMult = getWoundMult(attacker);
  let dMult = getWoundMult(defender);
  let aStr = attackerFinalStat.str * pMult;
  let aAgi = attackerFinalStat.agi * pMult;
  let dStr = defenderFinalStat.str * dMult; 
  let dDef = defenderFinalStat.def * dMult;
  let dAgi = defenderFinalStat.agi * dMult;

  let hasSuperArmor = false;
  if (attacker.conditions) {
    for (let key in attacker.conditions) {
      if (key.includes("霸体") || key.includes("真身")) hasSuperArmor = true;
    }
  }

  if (npcAction.type === "危机自保" && npcAction.skill.技能类型 === "控制" && npcAction.skill.cast_time < 10) { 
    if (defenderFinalStat.men_max > attackerFinalStat.men_max || dAgi > aAgi) {
      if (hasSuperArmor) {
        result.desc = `NPC释放[${npcAction.skill.name}]试图打断，但玩家处于霸体状态，强行免疫了控制！`;
      } else {
        result.desc = `NPC释放[${npcAction.skill.name}]成功打断玩家施法！玩家遭到反噬。`;
        return result; 
      }
    }
  }

  let isAOE = playerAction.skill.技能类型 === "群攻" || pClash.伤害类型 === "纯精神冲击";
  let grazeMultiplier = 1.0; 

  if (!isAOE && npcAction.type === "伺机闪避") {
    let absoluteDodgeThreshold = (aAgi + attackerFinalStat.men_max) * 1.5;
    if (dAgi > absoluteDodgeThreshold) {
      result.desc = "NPC触发绝对闪避，残影规避了所有伤害！";
      return result;
    }
    
    let dodgeRate = (dAgi / (aAgi + attackerFinalStat.men_max)) * 50;
    let roll = Math.random() * 100;

    if (roll < dodgeRate) {
      result.desc = `NPC凭借敏捷优势惊险躲过了攻击！`;
      return result;
    } else if (roll < dodgeRate + 30) { 
      let grazePercent = (roll - dodgeRate) / 30; 
      grazeMultiplier = 0.3 + (0.5 * grazePercent); 
      result.desc = `NPC未能完全闪避，被攻击擦伤！(承受 ${(grazeMultiplier * 100).toFixed(0)}% 伤害)`;
    }
  }

  let remainPower = pClash.基础威力倍率;
  let npcShield = nClash.护盾绝对值 || 0;

  if (npcAction.type === "强势对轰") {
    remainPower -= nClash.基础威力倍率;
    if (remainPower <= 0) {
      result.desc = `NPC的[${npcAction.skill.name}]威力更胜一筹，碾碎了玩家的攻击！`;
      return result; 
    }
    result.desc = `双方对轰！玩家威力占优，余威继续命中。`;
  } else if (npcAction.type === "危机自保" && npcAction.skill.技能类型 === "防御") {
    remainPower -= nClash.基础威力倍率; 
    if (remainPower <= 0) {
      result.desc = `NPC的防御技能完美挡下了这一击。`;
      return result;
    }
    result.desc = `攻击突破了NPC的防御技能阻碍。`;
  }

  let finalDmg = 0;
  let dmgType = pClash.伤害类型;
  
  let actualDef = dDef * (1 - (pClash.穿透修饰 / 100));
  actualDef = Math.max(1, actualDef); 

  if (dmgType === "物理近战") finalDmg = remainPower * (aStr / actualDef);
  else if (dmgType === "能量AOE") finalDmg = remainPower * (attackerFinalStat.men_max / actualDef);
  else if (dmgType === "纯精神冲击") finalDmg = remainPower * (attackerFinalStat.men_max / defenderFinalStat.men_max);

  if (npcAction.type === "肉体兜底") {
    finalDmg = finalDmg / 1.2; 
    result.desc = "NPC收缩防御，用纯肉体硬抗了这一击。";
  }

  if (npcShield > 0) {
    finalDmg = Math.max(0, finalDmg - npcShield);
    if (finalDmg === 0) {
      result.desc += ` 但被NPC的 ${npcShield} 点绝对护盾完全吸收！`;
    } else {
      result.desc += ` 击碎了NPC的 ${npcShield} 点护盾后，剩余威力命中本体。`;
    }
  }

  let fluctuation = 0.9 + (Math.random() * 0.2); 
  finalDmg = finalDmg * fluctuation * grazeMultiplier;
  
  result.dmg = Math.floor(finalDmg);
  if (result.dmg > 0) {
    result.desc += ` 造成了 ${result.dmg} 点最终伤害。`;
  }

  if (pClash.瞬间恢复比例 > 0) {
    let healAmount = Math.floor(attackerFinalStat.vit_max * (pClash.瞬间恢复比例 / 100));
    attacker.vit = Math.min(attackerFinalStat.vit_max, attacker.vit + healAmount);
    result.desc += ` [机制触发] 玩家瞬间恢复了 ${healAmount} 点体力！`;
  }

  if (pState.状态名称 !== "无" && (result.dmg > 0 || pClash.基础威力倍率 === 0)) {
    let targetObj = playerAction.skill.对象.includes("自身") || playerAction.skill.对象.includes("己方") ? attacker : defender;
    let isBuff = pState.特殊机制标识.includes("增益") || pState.特殊机制标识.includes("霸体") || pState.特殊机制标识.includes("免死");
    
    let isImmune = false;
    if (!isBuff && pState.特殊机制标识.includes("硬控")) {
      let atkStat = pClash.伤害类型 === "物理近战" ? aStr : attackerFinalStat.men_max;
      let defStat = pClash.伤害类型 === "物理近战" ? dStr : defenderFinalStat.men_max; 
      if (defStat > atkStat * 1.5) isImmune = true;
    }

    if (isImmune) {
      result.desc += ` 但目标凭借绝对的属性碾压，强行豁免了[${pState.状态名称}]控制！`;
    } else {
      if (!targetObj.conditions) targetObj.conditions = {};
      targetObj.conditions[pState.状态名称] = {
        类型: isBuff ? "buff" : "debuff",
        层数: 1,
        描述: `由[${playerAction.skill.name}]附加`,
        duration: pState.持续回合,
        stat_mods: pState.面板修改比例,
        combat_effects: {
          skip_turn: pState.特殊机制标识.includes("硬控"),
          dot_damage: pState.持续真伤dot,
          armor_pen: 0
        }
      };
      let targetNameStr = targetObj === attacker ? "自身" : "NPC";
      result.desc += ` 并对${targetNameStr}施加了[${pState.状态名称}]状态！`;
    }
  }

  return result;
}

function buildStrategicCandidates(defender, attacker, combatData, playerAction, ratio, availableSkills, allyTeam, makeNpcAction) {
  const combatType = combatData.combat_type || "突发遭遇";
  const isDeadlyFight = combatType === "死战" || combatType === "突发遭遇";
  const lvDiff = (attacker.lv || 1) - (defender.lv || 1);
  const playerPower = playerAction.skill?.仲裁逻辑?.瞬间交锋模块?.基础威力倍率 || 0;
  const isChargingHighThreat = !!attacker.charging_skill || playerAction.action_type === "蓄力挨打" || ((playerAction.cast_time || 0) >= 20 && playerPower >= 120);
  const activeBuffs = Object.keys(defender.conditions || {});
  const behaviorState = buildBattleStateContext(defender, attacker, combatData, { combatType, isDeadlyFight, ratio, isChargingHighThreat, playerPower });

  const strategicBranches = [];

  if (defender.martial_fusion_skills) {
    Object.entries(defender.martial_fusion_skills).forEach(([fusionName, fusionSkill]) => {
      const partnerAlive = allyTeam.some(unit => unit.name === fusionSkill.partner && unit.vit > 0);
      if (!partnerAlive || !fusionSkill.skill_data) return;

      let weight = 0;
      if (isDeadlyFight) {
        if (lvDiff >= 5) weight += 80;
        if (isChargingHighThreat) weight += 60;
        if (defender.vit < defender.vit_max * 0.5) weight += 30;
      } else if (defender.vit < defender.vit_max * 0.4 || isChargingHighThreat) {
        weight += 50;
      }

      strategicBranches.push({
        name: "武魂融合技",
        weight: adjustBehaviorWeight("武魂融合技", weight, defender, attacker, behaviorState),
        build() {
          const skill = normalizeSkillData(fusionSkill.skill_data, `武魂融合技·${fusionName}`);
          skill.name = `武魂融合技·${skill.name}`;
          return makeNpcAction("武魂融合技", `[绝地反击] 面对${lvDiff >= 5 ? '不可战胜的强敌' : '巨大的压力'}，NPC与${fusionSkill.partner}气息交融，果断施展了武魂融合技！`, skill);
        }
      });
    });
  }

  const trueBodySkill = availableSkills.find(skill => {
    const stateName = skill.仲裁逻辑?.状态挂载模块?.状态名称 || "";
    return /真身/.test(skill.name || "") || /真身/.test(stateName);
  });
  if (trueBodySkill) {
    const trueBodyState = trueBodySkill.仲裁逻辑?.状态挂载模块?.状态名称 || "无";
    if (!activeBuffs.includes(trueBodyState)) {
      let weight = 0;
      if (isDeadlyFight) {
        if (lvDiff >= 0) weight += 70;
        if (isChargingHighThreat) weight += 60;
      } else if (defender.vit < defender.vit_max * 0.6 || isChargingHighThreat) {
        weight += 50;
      }

      strategicBranches.push({
        name: "开启真身",
        weight: adjustBehaviorWeight("开启真身", weight, defender, attacker, behaviorState),
        build() {
          const sustainConfig = resolveActionSustainConfig(defender, "开启真身", trueBodySkill, trueBodyState);
          applyStateToCharacter(defender, trueBodySkill.仲裁逻辑?.状态挂载模块, trueBodySkill.name, true);
          if (sustainConfig) registerSustainEffect(defender, `truebody:${trueBodySkill.name}`, sustainConfig);
          return makeNpcAction("开启真身", `[质变底牌] NPC仰天长啸，第七魂环闪耀，直接释放了[${trueBodySkill.name}]！`, trueBodySkill);
        }
      });
    }
  }

  const lifeFireSkill = defender.bloodline_power?.skills?.["点燃生命之火"];
  if (isDeadlyFight && lifeFireSkill && !defender.bloodline_power?.life_fire && behaviorState.isDesperateNoEscape) {
    let weight = 0;
    if (lvDiff >= 10 && defender.vit < defender.vit_max * 0.8) weight += 60;
    else if (defender.vit < defender.vit_max * 0.3) weight += 80;
    if (isChargingHighThreat) weight += 25;

    let fireLog = `[绝命搏杀] 面对${lvDiff >= 10 ? '令人绝望的实力差距' : '生死绝境'}，NPC做出了极其疯狂的举动！强行点燃了生命之火做殊死一搏！`;
    if (!behaviorState.canFlee) {
      fireLog = `[困兽犹斗] 被迫背水一战，已经退无可退！NPC被逼入绝境，发出一声绝望的狂吼，强行点燃了生命之火，誓要同归于尽！`;
    }

    strategicBranches.push({
      name: "点燃生命之火",
      weight: adjustBehaviorWeight("点燃生命之火", weight, defender, attacker, behaviorState),
      build() {
        const sustainConfig = resolveActionSustainConfig(defender, "点燃生命之火", lifeFireSkill, "");
        defender.bloodline_power.life_fire = true;
        if (sustainConfig) registerSustainEffect(defender, `life_fire:${lifeFireSkill.name || '点燃生命之火'}`, sustainConfig);
        return makeNpcAction("点燃生命之火", fireLog, lifeFireSkill);
      }
    });
  }

  const hasDomain = (defender.active_domain || "无") === "无" && (defender.equip?.armor?.lv >= 3 || defender.men_max >= 30000);
  if (hasDomain) {
    let weight = 0;
    if (defender.vit >= defender.vit_max * 0.9) weight += 40;
    if (defender.vit < defender.vit_max * 0.5) weight += 80;
    if (isChargingHighThreat) weight += 30;

    strategicBranches.push({
      name: "展开领域",
      weight: adjustBehaviorWeight("展开领域", weight, defender, attacker, behaviorState),
      build() {
        const actionType = defender.equip?.armor?.lv >= 3 ? "展开斗铠领域" : "展开精神领域";
        const sustainConfig = resolveActionSustainConfig(defender, actionType, null, "");
        defender.active_domain = actionType === "展开斗铠领域" ? (defender.equip?.armor?.lv >= 4 ? "【四字斗铠领域】全开(未定)" : "【三字斗铠领域】全开(未定)") : "【精神领域】全开";
        if (sustainConfig) registerSustainEffect(defender, `domain:${actionType}`, sustainConfig);
        return makeNpcAction(actionType, `[主场展开] NPC不愿陷入被动，果断张开领域法则抢占先机！`);
      }
    });
  }

  let bestSpirit = null;
  let maxSpiritLv = 0;
  Object.values(defender.spirit || {}).forEach(sp => {
    Object.values(sp.soul_spirits || {}).forEach(ss => {
      if (ss.状态 === "活跃" && ss.战力面板?.对标等级 > maxSpiritLv) {
        maxSpiritLv = ss.战力面板.对标等级;
        bestSpirit = ss;
      }
    });
  });
  if (bestSpirit && defender.men >= 500) {
    let weight = 0;
    const playerLv = attacker.lv || 1;
    if (maxSpiritLv >= playerLv - 15) {
      weight += 20;
      if (maxSpiritLv >= playerLv) weight += 40;
      if (defender.vit >= defender.vit_max * 0.9) weight += 30;
      if (defender.vit < defender.vit_max * 0.4) weight += 60;
    }

    strategicBranches.push({
      name: "召唤魂灵",
      weight: adjustBehaviorWeight("召唤魂灵", weight, defender, attacker, behaviorState),
      build() {
        return makeNpcAction("召唤魂灵", `[战术召唤] NPC消耗精神力，将【${bestSpirit.表象名称}】实体化召唤至战场！(对标等级: ${maxSpiritLv})`);
      }
    });
  }

  const hasArmor = defender.equip?.armor?.lv > 0 && defender.equip?.armor?.equip_status !== "已装备";
  const hasMech = defender.equip?.mech?.lv !== "无" && defender.equip?.mech?.status !== "重创" && defender.equip?.mech?.equip_status !== "已装备";
  if (hasArmor || hasMech) {
    let armorLv = defender.equip?.armor?.lv || 0;
    let isRejected = defender.equip?.armor?.is_rejected || false;
    let minQ = Infinity;
    let pCount = 0;

    if (hasArmor && defender.equip?.armor?.parts) {
      Object.values(defender.equip.armor.parts).forEach(part => {
        if (part.状态 !== "未打造" && part.状态 !== "重创") {
          if (part.品质系数 < minQ) minQ = part.品质系数;
          pCount++;
        }
      });
    }

    let armorCast = Math.max(0, 20 - armorLv * 5);
    if (armorLv === 1 && !isRejected && minQ > 1.2 && pCount > 0) armorCast = Math.max(0, armorCast - 5);
    const mechLv = defender.equip?.mech?.lv || "无";
    const mechCast = mechLv === "红级" ? 0 : 50;
    const equipCastTime = hasArmor ? armorCast : mechCast;

    let weight = 0;
    let decisionLog = "";
    if (equipCastTime === 0) weight += 500;
    if (combatType === "死战" && defender.vit >= defender.vit_max * 0.95) {
      weight += 200;
      decisionLog = "面临生死决战，NPC不敢托大，开局便试图引动装备护体！";
    }
    if (playerPower >= 150) {
      weight += 80;
      decisionLog = "感受到对方攻击中蕴含的毁灭性波动，NPC深知肉体无法硬抗，强行尝试穿戴装备！";
    }
    if ((playerAction.cast_time || 0) > equipCastTime || ratio >= 1.2) {
      weight += 60;
      if (!decisionLog) decisionLog = "NPC察觉到对方前摇破绽，从容地开始释放装备。";
    }
    if (defender.vit < defender.vit_max * 0.4) {
      weight += 50;
      if (!decisionLog) decisionLog = "身受重创的NPC陷入绝境，拼着被打断的风险也要强行穿戴装备！";
    }

    weight -= equipCastTime;
    strategicBranches.push({
      name: "穿戴装备",
      weight: adjustBehaviorWeight("穿戴装备", weight, defender, attacker, behaviorState),
      build() {
        return makeNpcAction("穿戴装备", `[战术决断] ${decisionLog || 'NPC准备强化自身防御层级。'} (前摇: ${equipCastTime})`, {
          name: hasArmor ? "斗铠附体" : "召唤机甲",
          技能类型: "辅助",
          cast_time: equipCastTime,
          equip_target: hasArmor ? "armor" : "mech"
        });
      }
    });
  }

  const hasMechOrArmor = (defender.equip?.mech?.lv !== "无" && defender.equip?.mech?.status !== "重创") || (defender.equip?.armor?.equip_status === "已装备");
  if (behaviorState.canFlee && combatType !== "擂台切磋" && defender.vit < defender.vit_max * 0.15 && !hasMechOrArmor) {
    strategicBranches.push({
      name: "亡命奔逃",
      weight: adjustBehaviorWeight("亡命奔逃", 50, defender, attacker, behaviorState),
      build() {
        return makeNpcAction("亡命奔逃", `[濒死溃逃] NPC身受重创，丧失了战意，放弃防守转身亡命奔逃！`);
      }
    });
  } else if (!behaviorState.canFlee && defender.vit < defender.vit_max * 0.15) {
    // 如果濒死但无法逃跑，给肉体兜底和死斗加一点补救权重
    behaviorState.isDesperateNoEscape = true;
  }

  return { strategicBranches, behaviorState, combatType, activeBuffs };
}

function buildNpcSkillCandidateContext(defender, attacker, playerAction, availableSkills, behaviorState, activeBuffs, isLowHealth) {
  const pMult = getWoundMult(attacker);
  const dMult = getWoundMult(defender);
  const attackerSpeed = (attacker.agi * pMult) - ((playerAction.cast_time || 0) * 10);
  const validSkills = availableSkills.filter(skill => {
    const castTime = skill.cast_time || 0;
    const npcSpeed = (defender.agi * dMult) - (castTime * 10);
    const cost = parseSkillCostForChar(skill, defender);
    return cost.canCast && npcSpeed > Math.max(1, attackerSpeed) * 0.8;
  });

  function pickSkillWithWeight(skills) {
    const weighted = (skills || []).map(skill => {
      const stateName = skill.仲裁逻辑?.状态挂载模块?.状态名称 || "无";
      if (stateName !== "无" && ["辅助", "防御"].includes(skill.技能类型) && activeBuffs.includes(stateName)) {
        return { skill, weight: 0, name: skill.name || "未命名技能", build() { return skill; } };
      }

      let weight = 10;
      const skillPower = skill.仲裁逻辑?.瞬间交锋模块?.基础威力倍率 || 0;
      const cost = parseSkillCostForChar(skill, defender);
      const spRatio = cost.reqSp > 0 ? cost.reqSp / Math.max(1, defender.sp) : 0;
      const vitRatio = cost.reqVit > 0 ? cost.reqVit / Math.max(1, defender.vit) : 0;

      if (defender.type === "强攻系") {
        if (skill.技能类型 === "输出") weight += 40 + Math.floor(skillPower / 10);
        if (skill.技能类型 === "防御") weight += 20;
      } else if (defender.type === "敏攻系") {
        if (skill.技能类型 === "输出" && skill.cast_time <= 15) weight += 60;
        if (skill.技能类型 === "输出" && skill.cast_time > 20) weight -= 30;
      } else if (defender.type === "防御系") {
        if (skill.技能类型 === "防御") weight += 80;
        if (skill.技能类型 === "输出") weight += 10;
      } else if (defender.type === "控制系") {
        if (skill.技能类型 === "控制") weight += 80;
      } else if (["辅助系", "治疗系", "食物系"].includes(defender.type)) {
        if (skill.技能类型 === "辅助") weight += 80;
        if (skill.技能类型 === "防御") weight += 50;
        if (skill.技能类型 === "输出") weight -= 30;
      }

      const isUltimate = skillPower >= 200 || /真身|第八魂技|第九魂技|武魂融合技|生命之火/.test(skill.name || "");
      if (isUltimate) {
        const enemyHpRatio = attacker.vit / Math.max(1, attacker.vit_max);
        const myHpRatio = defender.vit / Math.max(1, defender.vit_max);
        if (behaviorState.combatType === "擂台切磋") weight -= 30;
        else {
          if (enemyHpRatio < 0.4) weight += 60;
          if (myHpRatio < 0.3) weight += 50;
          if (enemyHpRatio > 0.8 && myHpRatio > 0.8) weight -= 20;
        }
      }

      weight -= Math.floor((skill.cast_time || 0) / 5);
      if (!isLowHealth) {
        if (spRatio > 0.5 || vitRatio > 0.5) weight = Math.floor(weight * 0.3);
        else if (spRatio > 0.3 || vitRatio > 0.3) weight = Math.floor(weight * 0.7);
      } else if (vitRatio > 0.5) {
        weight = Math.floor(weight * 0.5);
      }

      return {
        skill,
        weight: Math.max(0, weight),
        name: skill.name || "未命名技能",
        build() {
          return skill;
        }
      };
    });

    const picked = rollBranchByPriority(weighted, "行为预演/技能选择");
    if (!picked.option) return { skill: null, trace: picked.trace };
    return { skill: picked.option.build(), trace: picked.trace };
  }

  const defSkills = validSkills.filter(skill => skill.技能类型 === "防御" || skill.技能类型 === "控制");
  const atkSkills = validSkills.filter(skill => skill.技能类型 === "输出");
  const controlSkills = validSkills.filter(skill => skill.技能类型 === "控制" || (skill.仲裁逻辑?.状态挂载模块?.特殊机制标识 || "").includes("硬控"));

  const defSkillPick = pickSkillWithWeight(defSkills);
  const atkSkillPick = pickSkillWithWeight(atkSkills);
  const controlSkillPick = pickSkillWithWeight(controlSkills);
  const defSkill = defSkillPick.skill;
  const atkSkill = atkSkillPick.skill;
  const hardControlSkill = controlSkillPick.skill || controlSkills[0] || null;
  const npcAtkPower = atkSkill?.仲裁逻辑?.瞬间交锋模块?.基础威力倍率 || 0;
  const skillTraceLog = [defSkillPick.trace, atkSkillPick.trace, controlSkillPick.trace].filter(Boolean).join(" | ");

  return { defSkill, atkSkill, hardControlSkill, npcAtkPower, skillTraceLog };
}

function buildTacticalCandidates(defender, attacker, playerAction, behaviorState, skillContext, makeNpcAction, isSupport, isLowHealth) {
  const { defSkill, atkSkill, hardControlSkill, npcAtkPower } = skillContext;
  const playerPower = behaviorState.playerPower || 0;
  const isChargingHighThreat = !!behaviorState.isChargingHighThreat;

  let isLockedBySpirit = false;
  if ((playerAction.cast_time || 0) > 0) {
    const pState = playerAction.skill?.仲裁逻辑?.状态挂载模块 || {};
    if (pState.特殊机制标识 && (pState.特殊机制标识.includes("锁定") || pState.特殊机制标识.includes("威压"))) {
      if (attacker.men_max > defender.men_max) isLockedBySpirit = true;
    }
  }

  const tacticalBranches = [];
  if (isLockedBySpirit && defSkill) {
    tacticalBranches.push({
      name: "危机自保",
      weight: adjustBehaviorWeight("危机自保", 120, defender, attacker, behaviorState),
      build() {
        return makeNpcAction("危机自保", `[气机锁定] NPC被玩家恐怖的精神力死死锁定，不敢轻举妄动，只能全力转为防御！`, defSkill);
      }
    });
  } else if (isChargingHighThreat) {
    if (hardControlSkill) {
      tacticalBranches.push({
        name: "危机自保",
        weight: adjustBehaviorWeight("危机自保", 120, defender, attacker, behaviorState),
        build() {
          return makeNpcAction("危机自保", `[破绽捕捉] NPC察觉到玩家正在蓄力，果断释放[${hardControlSkill.name}]试图打断！`, hardControlSkill);
        }
      });
    }
    if (atkSkill) {
      tacticalBranches.push({
        name: "强势对轰",
        weight: adjustBehaviorWeight("强势对轰", 90, defender, attacker, behaviorState),
        build() {
          return makeNpcAction("强势对轰", `[破绽捕捉] NPC见玩家露出极大的前摇破绽，立刻释放[${atkSkill.name}]企图趁机重创玩家！`, atkSkill);
        }
      });
    }
    tacticalBranches.push({
      name: "伺机闪避",
      weight: adjustBehaviorWeight("伺机闪避", 60, defender, attacker, behaviorState),
      build() {
        return makeNpcAction("伺机闪避", `[致命预警] NPC察觉到毁灭性的蓄力波动，但无力打断，只能全力游走试图拉开距离。`);
      }
    });
  } else if (isSupport || isLowHealth || playerPower >= 250) {
    if (defSkill) {
      tacticalBranches.push({
        name: "危机自保",
        weight: adjustBehaviorWeight("危机自保", 60, defender, attacker, behaviorState),
        build() {
          return makeNpcAction("危机自保", `[谨慎应对] NPC判断局势不利，选择以[${defSkill.name}]稳住阵脚。`, defSkill);
        }
      });
    }
    if (atkSkill) {
      let clashWeight = playerPower > npcAtkPower * 1.5 ? 20 : 55;
      tacticalBranches.push({
        name: "强势对轰",
        weight: adjustBehaviorWeight("强势对轰", clashWeight, defender, attacker, behaviorState),
        build() {
          return makeNpcAction("强势对轰", playerPower > npcAtkPower * 1.5 ? `[孤注一掷] 尽管身处劣势，NPC仍狠下心正面搏杀！` : `[强势对轰] NPC不甘示弱，释放[${atkSkill.name}]正面迎击！`, atkSkill);
        }
      });
    }
    tacticalBranches.push({
      name: "伺机闪避",
      weight: adjustBehaviorWeight("伺机闪避", 85, defender, attacker, behaviorState),
      build() {
        return makeNpcAction("伺机闪避", `[劣势规避] NPC判断继续硬拼代价过高，选择战术性闪避。`);
      }
    });
  } else {
    if (atkSkill) {
      tacticalBranches.push({
        name: "强势对轰",
        weight: adjustBehaviorWeight("强势对轰", 75, defender, attacker, behaviorState),
        build() {
          return makeNpcAction("强势对轰", `[主动进攻] NPC抓住节奏，释放[${atkSkill.name}]尝试夺回主动权！`, atkSkill);
        }
      });
    }
    if (defSkill) {
      tacticalBranches.push({
        name: "危机自保",
        weight: adjustBehaviorWeight("危机自保", 45, defender, attacker, behaviorState),
        build() {
          return makeNpcAction("危机自保", `[稳扎稳打] NPC选择先用[${defSkill.name}]保护自身。`, defSkill);
        }
      });
    }
    tacticalBranches.push({
      name: "伺机闪避",
      weight: adjustBehaviorWeight("伺机闪避", 30, defender, attacker, behaviorState),
      build() {
        return makeNpcAction("伺机闪避", `[战术拉扯] NPC利用身法周旋，试图重排节奏。`);
      }
    });
  }

  tacticalBranches.push({
    name: "肉体兜底",
    weight: adjustBehaviorWeight("肉体兜底", 20, defender, attacker, behaviorState),
    build() {
      return makeNpcAction("肉体兜底", `[从容应对] NPC无合适魂技，收缩防御，准备肉体硬抗。`, null, { def_mult: 1.2 });
    }
  });

  return tacticalBranches;
}

// ==========================================
// 📍 NPC 决策逻辑 (真实读取版)
// ==========================================
function determineNpcAction(combatData, playerAction, ratio) {
  hydrateCombatData(combatData);
  let defender = combatData.participants.enemy;
  let attacker = combatData.participants.player;

  function makeNpcAction(type, log, skill = null, extra = {}) {
    return Object.assign({
      type,
      log,
      skill: skill ? normalizeSkillData(skill, skill.name || skill.技能名称 || type) : null,
      def_mult: 1.0
    }, extra);
  }

  if (ratio < 0.5) {
    return makeNpcAction("无法反应", "[速度碾压] NPC根本无法看清攻击轨迹，来不及做出任何反应！本回合防御力减半。", null, { def_mult: 0.5 });
  }

  const combatType = combatData.combat_type || "突发遭遇";
  const isDeadlyFight = combatType === "死战" || combatType === "突发遭遇";
  const lvDiff = (attacker.lv || 1) - (defender.lv || 1);
  const playerPower = playerAction.skill?.仲裁逻辑?.瞬间交锋模块?.基础威力倍率 || 0;
  const isChargingHighThreat = !!attacker.charging_skill || playerAction.action_type === "蓄力挨打" || ((playerAction.cast_time || 0) >= 20 && playerPower >= 120);
  const isSupport = ["辅助系", "治疗系", "食物系"].includes(defender.type);
  const isLowHealth = defender.vit < defender.vit_max * 0.3;
  const activeBuffs = Object.keys(defender.conditions || {});
  const allyTeam = combatData.participants.team_enemy || [];
  const availableSkills = collectCombatSkills(defender, allyTeam);
  const strategicContext = buildStrategicCandidates(defender, attacker, combatData, playerAction, ratio, availableSkills, allyTeam, makeNpcAction);
  const behaviorState = strategicContext.behaviorState;
  const strategicAction = chooseAndBuildActorAction(defender, attacker, behaviorState, strategicContext.strategicBranches, "行为预演/战略阶段");
  if (strategicAction) return strategicAction;
  const skillContext = buildNpcSkillCandidateContext(defender, attacker, playerAction, availableSkills, behaviorState, activeBuffs, isLowHealth);
  const tacticalBranches = buildTacticalCandidates(defender, attacker, playerAction, behaviorState, skillContext, makeNpcAction, isSupport, isLowHealth);

  const tacticalAction = chooseAndBuildActorAction(defender, attacker, behaviorState, tacticalBranches, "行为预演/战术阶段", `${skillContext.skillTraceLog ? skillContext.skillTraceLog + ' | ' : ''}`);
  if (tacticalAction) return tacticalAction;
  const tacticalChoice = chooseActorActionByCandidates(defender, attacker, behaviorState, tacticalBranches, "行为预演/战术阶段");
  return makeNpcAction("肉体兜底", `${skillContext.skillTraceLog ? skillContext.skillTraceLog + ' | ' : ''}${tacticalChoice.trace ? tacticalChoice.trace + ' ' : ''}[从容应对] NPC无合适魂技，收缩防御，准备肉体硬抗。`, null, { def_mult: 1.2 });
}

// ==========================================
// 📍 5. 高阶机制伤害修饰与炸膛判定
// ==========================================
function applyHighTierMechanics(attackerChar, defenderChar, playerAction, baseResult) {
  let result = { ...baseResult };
  let attackerStats = attackerChar.stat || attackerChar;
  let defenderStats = defenderChar.stat || defenderChar;

  let isHoly = playerAction.skill.element === "神圣" || playerAction.skill.element === "光明" || playerAction.skill.element === "生命";
  if (isHoly && defenderStats.is_evil) {
    result.dmg = Math.floor(result.dmg * 2.0); 
    result.desc += " [神圣克制] 纯粹的光明之力如同沸水泼雪，无视等级压制，对邪魂师造成双倍真实伤害！";
  }

  if (playerAction.action_type === "多元素融合") {
    let elementCount = playerAction.element_count || 2;
    let isSilverDragon = attackerChar.bloodline_power?.bloodline?.includes("银龙王") || 
                         Object.values(attackerChar.spirit || {}).some(sp => sp.表象名称?.includes("元素使"));

    let failRate = 0;
    if (!isSilverDragon) {
      let baseFailRate = (elementCount - 1) * 35; 
      let menAdvantage = (attackerStats.men / defenderStats.men_max) * 15; 
      failRate = Math.max(5, baseFailRate - menAdvantage); 
    }

    let roll = Math.floor(Math.random() * 100) + 1; 
    
    if (roll <= failRate) {
      result.dmg = 0;
      result.backlash_dmg = Math.floor(attackerStats.vit_max * 0.3); 
      result.desc += ` [元素炸膛] 精神力失控！${elementCount}种元素在手中轰然引爆，遭到极致反噬！(Roll: ${roll} <= 炸膛率: ${Math.floor(failRate)}%)`;
    } else {
      let multiplier = Math.pow(1.5, elementCount - 1); 
      if (isSilverDragon) result.desc += ` [血脉特权] 银龙王血脉无视元素排斥，炸膛率强制归零！`;
      if (playerAction.is_charged) {
        multiplier *= 1.5; 
        result.desc += ` [极致蓄力] 元素被压缩到极致！`;
      }
      result.dmg = Math.floor(result.dmg * multiplier);
      result.desc += ` [元素共鸣] ${elementCount}种元素完美融合！威力呈指数级暴涨！(威力倍率: x${multiplier.toFixed(2)})`;
    }
  }

  return result;
}

// ==========================================
// 📍 6. 辅助区：意图解析与NPC决策 (真实读取版)
// ==========================================
function parsePlayerIntent(playerInput) {
  let combatData = window.BattleUIBridge?.getMVU("sd.world.combat");
  hydrateCombatData(combatData);
  let attacker = combatData.participants.player;
  let charData = window.BattleUIBridge?.getMVU("sd.char." + attacker.name) || window.BattleUIBridge?.getMVU("sd.char.主角"); 
  bindCombatParticipant(charData);
  
  let action = {
    action_type: "常规攻击",
    cast_time: 10,
    is_charged: false,
    skill: normalizeSkillData({
      name: "普通攻击",
      技能类型: "输出",
      对象: "敌方/单体",
      仲裁逻辑: {
        瞬间交锋模块: { 基础威力倍率: 100, 伤害类型: "物理近战", 穿透修饰: 0, 护盾绝对值: 0, 瞬间恢复比例: 0 },
        状态挂载模块: { 状态名称: "无", 持续回合: 0, 面板修改比例: { str: 1.0, def: 1.0, agi: 1.0, men_max: 1.0 }, 特殊机制标识: "无", 持续真伤dot: 0 },
        召唤与场地模块: { 实体名称: "无", 持续回合: 0, 继承属性比例: 0, 核心机制描述: "无" }
      }
    }, "普通攻击")
  };
  if (!charData) return action;

  let matchedSkill = null;
  let matchedSkillName = "";
  // 为了支持多重施法，我们需要找出所有被提及的技能。但为了保守兼容单技能模式，我们先选出最主要的那个。
  // TODO: 后续可以升级为返回技能数组，这里先保留主技能逻辑，把时间累计放进 pre_actions 处理中
  let directSkills = collectCombatSkills(charData, combatData.participants.team_player || []);
  directSkills.forEach(skill => {
    let plainName = (skill.name || "").replace(/^武魂融合技·/, "");
    if (playerInput.includes(skill.name) || (plainName && playerInput.includes(plainName))) {
      // 如果提及多个，这里会被覆盖为最后一个，目前作为主动作
      matchedSkill = skill;
      matchedSkillName = skill.name;
    }
  });

  if (matchedSkill) {
    action.action_type = matchedSkillName.includes("武魂融合技") ? "武魂融合技" : "释放魂技";
    action.cast_time = matchedSkill.cast_time || 10;
    action.skill = normalizeSkillData(matchedSkill, matchedSkillName);
  }

  // 💥 [核心改造] 副动作(Pre-Actions)多维复合解析引擎
  // 把玩家提及的额外操作统一压入 pre_actions 数组。之后会在外层判断总 cast_time。
  action.pre_actions = [];
  
  // 1. 生命之火 (通常认为是极速瞬间爆发)
  if (playerInput.includes("生命之火")) {
    let lifeFireSkillData = charData.bloodline_power?.skills?.["点燃生命之火"];
    if (lifeFireSkillData) {
      action.pre_actions.push({
        action_type: "点燃生命之火",
        skill: normalizeSkillData(lifeFireSkillData, "点燃生命之火"),
        cast_time: 5 // 给一点微小的基础耗时，防止无限套娃
      });
    }
  }
  
  // 2. 穿戴斗铠 (极其吃前摇)
  if (playerInput.includes("斗铠") && (playerInput.includes("穿") || playerInput.includes("释放") || playerInput.includes("附体"))) {
    let armorLv = charData.equip?.armor?.lv || 1;
    let isRejected = charData.equip?.armor?.is_rejected || false;
    let minQ = Infinity;
    let pCount = 0;
    if (charData.equip?.armor?.parts) {
      Object.values(charData.equip.armor.parts).forEach(p => {
        if (p.状态 !== "未打造" && p.状态 !== "重创") {
          if (p.品质系数 < minQ) minQ = p.品质系数;
          pCount++;
        }
      });
    }

    let armorCast = Math.max(0, 20 - armorLv * 5);
    if (armorLv === 1 && !isRejected && minQ > 1.2 && pCount > 0) {
      armorCast = Math.max(0, armorCast - 5);
    }

    // 不再硬性判断是否瞬间，统统塞进去，外层的 40上限 机制会教他做人
    action.pre_actions.push({
      action_type: "穿戴装备",
      equip_target: "armor",
      cast_time: armorCast,
      skill: normalizeSkillData({ name: armorCast <= 0 ? "斗铠瞬间附体" : "斗铠附体读条", 技能类型: "辅助", 消耗: "无" })
    });
    playerInput = playerInput.replace(/斗铠/g, "已解析的斗铠");
  }

  // 3. 展开各类领域 (通常较快)
  if (playerInput.includes("斗铠领域")) {
    action.pre_actions.push({ action_type: "展开斗铠领域", cast_time: 0, skill: normalizeSkillData({ name: "展开斗铠领域", 技能类型: "辅助", 消耗: "无" }) });
  } else if (playerInput.includes("精神领域")) {
    action.pre_actions.push({ action_type: "展开精神领域", cast_time: 0, skill: normalizeSkillData({ name: "展开精神领域", 技能类型: "辅助", 消耗: "无" }) });
  } else if (playerInput.includes("武魂领域")) {
    action.pre_actions.push({ action_type: "展开武魂领域", cast_time: 0, skill: normalizeSkillData({ name: "展开武魂领域", 技能类型: "辅助", 消耗: "无" }) });
  }

  // 4. 武魂融合技判定 (这是一个巨大的主动作，会覆盖掉普通的释放魂技)
  if (playerInput.includes("武魂融合技")) {
    let hasFusion = false;
    Object.entries(charData.martial_fusion_skills || {}).forEach(([fusionName, fusionSkill]) => {
      let partnerName = fusionSkill.partner;
      let partnerInBattle = (combatData.participants.team_player || []).find(p => p.name === partnerName && p.vit > 0);
      if (partnerInBattle && fusionSkill.skill_data) {
        hasFusion = true;
        action.action_type = "武魂融合技";
        action.skill = normalizeSkillData(fusionSkill.skill_data, `武魂融合技·${fusionName}`);
        action.skill.name = `武魂融合技·${action.skill.name}`;
        action.cast_time = action.skill.cast_time || 30;
      }
    });
    if (!hasFusion) {
      action.action_type = "施法失败";
      action.cast_time = 0;
    }
  } else if (!matchedSkill) {
    // 如果没有任何武魂融合技、也没有匹配到具体魂技，但是匹配到了一些其它的特殊主动作
    if (playerInput.includes("多元素融合")) {
      action.action_type = "多元素融合";
      action.element_count = 2;
      if (playerInput.includes("蓄力")) action.is_charged = true;
      let isSilverDragon = charData.bloodline_power?.bloodline?.includes("银龙王") || Object.values(charData.spirit || {}).some(sp => sp.表象名称?.includes("元素使"));
      if (isSilverDragon) action.cast_time = 5;
      action.skill = normalizeSkillData({ name: "多元素融合", 技能类型: "输出", 消耗: "无" });
    } else if (playerInput.includes("吸血反哺")) {
      action.action_type = "吸血反哺";
      action.heal_ratio = 0.3;
    } else if (playerInput.includes("机甲") && (playerInput.includes("召唤") || playerInput.includes("进入"))) {
      // 普通机甲同理，必须作为主动作读条
      action.action_type = "穿戴装备";
      let mechLv = charData.equip?.mech?.lv || "黄级";
      action.cast_time = mechLv === "红级" ? 0 : 50; 
      action.equip_target = "mech";
      action.skill = normalizeSkillData({ name: "召唤机甲", 技能类型: "辅助", 消耗: "无" });
    }
  }

  return action;
}

// ==========================================
// 📍 团战前置：行动轴与索敌逻辑
// ==========================================

// 1. 生成全局行动轴
function generateActionQueue(combatData) {
  let allFighters = [];
  
  (combatData.participants.team_player || []).forEach(p => { bindCombatParticipant(p); if (p.vit > 0) allFighters.push({ char: p, side: "player" }); });
  (combatData.participants.team_enemy || []).forEach(e => { bindCombatParticipant(e); if (e.vit > 0) allFighters.push({ char: e, side: "enemy" }); });

  let typePriority = {
    "辅助系": 1, 
    "控制系": 2, 
    "敏攻系": 2,
    "强攻系": 2,
    "精神系": 2,
    "元素系": 2,
    "防御系": 3, 	
    "治疗系": 3, 
    "食物系": 3  
  };

  allFighters.sort((a, b) => {
    let pA = typePriority[a.char.type] || 4;
    let pB = typePriority[b.char.type] || 4;
    if (pA !== pB) return pA - pB;
    
    let agiA = a.char.agi * getWoundMult(a.char);
    let agiB = b.char.agi * getWoundMult(b.char);
    return agiB - agiA; 
  });

  return allFighters;
}

// 2. D100 索敌逻辑
function findTarget(attackerChar, enemyTeam) {
  bindCombatParticipant(attackerChar);
  (enemyTeam || []).forEach(bindCombatParticipant);
  let validTargets = enemyTeam.filter(t => t.vit > 0);
  if (validTargets.length === 0) return null;
  if (validTargets.length === 1) return validTargets[0];

  let totalWeight = 0;
  let weightedTargets = validTargets.map(target => {
    let weight = 10; 
    let isSupport = ["辅助系", "治疗系", "食物系", "控制系"].includes(target.type);
    let isTank = ["防御系", "强攻系"].includes(target.type);
    let hpRatio = target.vit / target.vit_max;

    if (attackerChar.type === "敏攻系") {
      if (isSupport) weight += 60; 
      if (hpRatio < 0.3) weight += 30; 
    } else if (attackerChar.type === "强攻系") {
      if (isTank) weight += 50; 
      if (hpRatio < 0.5) weight += 40; 
    } else if (attackerChar.type === "控制系") {
      if (isTank) weight += 40; 
      if (isSupport) weight += 40; 
    } else {
      if (hpRatio < 0.5) weight += 50;
    }

    totalWeight += weight;
    return { target: target, weight: weight };
  });

  let roll = Math.random() * totalWeight;
  for (let wt of weightedTargets) {
    roll -= wt.weight;
    if (roll <= 0) return wt.target;
  }
  return weightedTargets[0].target;
}

function findAllyTarget(actorChar, allyTeam) {
  if (!allyTeam || allyTeam.length === 0) return actorChar;
  let validAllies = allyTeam.filter(t => t.vit > 0);
  if (validAllies.length === 0) return actorChar;

  let lowestHpRatio = 1.0;
  let targetAlly = actorChar;

  for (let ally of validAllies) {
    bindCombatParticipant(ally);
    let hpRatio = ally.vit / Math.max(1, ally.vit_max);
    if (hpRatio < lowestHpRatio) {
      lowestHpRatio = hpRatio;
      targetAlly = ally;
    }
  }
  return targetAlly;
}

function chooseTargetForActor(actorEntry, battleState) {
  if (!actorEntry || !battleState?.combatData) return null;
  const enemyTeam = actorEntry.side === "player"
    ? (battleState.combatData.participants.team_enemy || [])
    : (battleState.combatData.participants.team_player || []);
  const allyTeam = actorEntry.side === "player"
    ? (battleState.combatData.participants.team_player || [])
    : (battleState.combatData.participants.team_enemy || []);
  return {
    enemyTarget: findTarget(actorEntry.char, enemyTeam),
    allyTarget: findAllyTarget(actorEntry.char, allyTeam)
  };
}

function buildAutoActionForActor(actorEntry, targets, battleState) {
  const actor = actorEntry?.char;
  if (!actor) return null;
  bindCombatParticipant(actor);
  const enemyTarget = targets?.enemyTarget;
  const allyTarget = targets?.allyTarget;
  if (enemyTarget) bindCombatParticipant(enemyTarget);
  if (allyTarget) bindCombatParticipant(allyTarget);

  const allyTeam = actorEntry.side === "player"
    ? (battleState.combatData.participants.team_player || []).filter(unit => unit.name !== actor.name)
    : (battleState.combatData.participants.team_enemy || []).filter(unit => unit.name !== actor.name);

  const makeActorAction = (type, log, skill = null, extra = {}) => Object.assign({
    type,
    log,
    skill: skill ? normalizeSkillData(skill, skill.name || skill.技能名称 || type) : null,
    def_mult: 1.0
  }, extra);

  const observedTargetAction = enemyTarget?.charging_skill || {
    action_type: "常规攻击",
    cast_time: 10,
    skill: normalizeSkillData({
      name: "普通攻击",
      技能类型: "输出",
      对象: "敌方/单体",
      仲裁逻辑: createEmptyCombatLogic(),
      消耗: "无"
    }, "普通攻击")
  };

  const ratio = enemyTarget?.charging_skill
    ? calculateReactionRatio(enemyTarget, actor, observedTargetAction, {
        combat_type: battleState.combatData.combat_type || "突发遭遇",
        initiative: actor.name,
        participants: { player: enemyTarget, enemy: actor }
      })
    : 1;

  const availableSkills = collectCombatSkills(actor, allyTeam);
  const strategicContext = buildStrategicCandidates(actor, enemyTarget, battleState.combatData, observedTargetAction, ratio, availableSkills, allyTeam, makeActorAction);
  const isSupport = ["辅助系", "治疗系", "食物系"].includes(actor.type);
  const isLowHealth = actor.vit < actor.vit_max * 0.3;

  const strategicAction = chooseAndBuildActorAction(actor, enemyTarget, strategicContext.behaviorState, strategicContext.strategicBranches, "行为预演/主动战略阶段");
  const convertDecisionToTurnAction = (decisionAction) => {
    if (!decisionAction) return null;
    const neutralSkill = normalizeSkillData({
      name: decisionAction.type || "战术动作",
      技能类型: "辅助",
      对象: "自身",
      仲裁逻辑: createEmptyCombatLogic(),
      消耗: "无"
    }, decisionAction.type || "战术动作");

    return {
      action_type: decisionAction.type || "释放技能",
      cast_time: decisionAction.skill?.cast_time || 10,
      skill: decisionAction.skill || neutralSkill,
      source: "auto_actor",
      decision_log: decisionAction.log,
      def_mult: decisionAction.def_mult || 1.0
    };
  };
  if (strategicAction) return convertDecisionToTurnAction(strategicAction);

  const skillContext = buildNpcSkillCandidateContext(actor, enemyTarget, observedTargetAction, availableSkills, strategicContext.behaviorState, strategicContext.activeBuffs, isLowHealth);
  const tacticalBranches = buildTacticalCandidates(actor, enemyTarget, observedTargetAction, strategicContext.behaviorState, skillContext, makeActorAction, isSupport, isLowHealth);
  const tacticalAction = chooseAndBuildActorAction(actor, enemyTarget, strategicContext.behaviorState, tacticalBranches, "行为预演/主动战术阶段", `${skillContext.skillTraceLog ? skillContext.skillTraceLog + ' | ' : ''}`);
  if (tacticalAction) return convertDecisionToTurnAction(tacticalAction);

  return {
    action_type: "常规攻击",
    cast_time: 10,
    skill: normalizeSkillData({
      name: "普通攻击",
      技能类型: "输出",
      对象: "敌方/单体",
      仲裁逻辑: {
        瞬间交锋模块: { 基础威力倍率: 100, 伤害类型: "物理近战", 穿透修饰: 0, 护盾绝对值: 0, 瞬间恢复比例: 0 },
        状态挂载模块: { 状态名称: "无", 特殊机制标识: "无", 持续回合: 0, 面板修改比例: { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 }, 持续真伤dot: 0 }
      },
      消耗: "无"
    }, "普通攻击"),
    source: "auto_actor",
    decision_log: "[行为预演/主动战术阶段] 无更优动作，回落为普通攻击。"
  };
}

function createActorTurnCombatData(actorEntry, target, battleState) {
  const actor = actorEntry.char;
  const actorAllies = actorEntry.side === "player"
    ? (battleState.combatData.participants.team_player || []).filter(unit => unit.name !== actor.name)
    : (battleState.combatData.participants.team_enemy || []).filter(unit => unit.name !== actor.name);
  const targetAllies = actorEntry.side === "player"
    ? (battleState.combatData.participants.team_enemy || []).filter(unit => unit.name !== target.name)
    : (battleState.combatData.participants.team_player || []).filter(unit => unit.name !== target.name);

  return {
    combat_type: battleState.combatData.combat_type || "突发遭遇",
    initiative: actor.name,
    participants: {
      player: actor,
      enemy: target,
      team_player: actorAllies,
      team_enemy: targetAllies
    }
  };
}

function isActorHardControlled(char) {
  if (!char?.conditions) return false;
  return Object.values(char.conditions).some(cond => cond?.combat_effects?.skip_turn === true);
}

function runActorTurn(actorEntry, battleState) {
  if (!actorEntry || !battleState?.combatData) return null;
  const actor = actorEntry.char;
  bindCombatParticipant(actor);
  if (actor.vit <= 0) {
    return { actor: actor.name, side: actorEntry.side, skipped: true, reason: "已失去战斗力" };
  }

  if (isActorHardControlled(actor)) {
    return { actor: actor.name, side: actorEntry.side, skipped: true, reason: "处于硬控状态", log: `[团战执行] ${actor.name}处于硬控状态，本回合无法行动。` };
  }

  const targets = chooseTargetForActor(actorEntry, battleState);
  if (!targets || !targets.enemyTarget) {
    return { actor: actor.name, side: actorEntry.side, skipped: true, reason: "无可用目标" };
  }
  bindCombatParticipant(targets.enemyTarget);
  bindCombatParticipant(targets.allyTarget);

  let action = null;
  let actionLog = "";
  if (actor.charging_skill) {
    action = actor.charging_skill;
    if ((action.cast_time || 0) <= 40) {
      actionLog += `[团战执行] ${actor.name}完成蓄力，释放[${action.skill?.name || action.action_type}]！ `;
      actor.charging_skill = null;
    } else {
      action.cast_time -= 30;
      return {
        actor: actor.name,
        side: actorEntry.side,
        target: targets.enemyTarget.name,
        charging: true,
        action,
        log: `[团战执行] ${actor.name}继续为[${action.skill?.name || action.action_type}]蓄力，剩余前摇:${action.cast_time}。`
      };
    }
  } else {
    action = buildAutoActionForActor(actorEntry, targets, battleState);

    let totalTimeCost = 0;
    let validPreActions = [];
    let carryOverAction = null;

    if (action.pre_actions && action.pre_actions.length > 0) {
      for (let i = 0; i < action.pre_actions.length; i++) {
        let pa = action.pre_actions[i];
        if (totalTimeCost + pa.cast_time <= 40) {
          totalTimeCost += pa.cast_time;
          validPreActions.push(pa);
        } else {
          carryOverAction = pa;
          carryOverAction.cast_time -= Math.max(0, 40 - totalTimeCost);
          break;
        }
      }
    }

    if (!carryOverAction) {
      if (totalTimeCost + (action.cast_time || 0) <= 40) {
        totalTimeCost += (action.cast_time || 0);
      } else {
        carryOverAction = action;
        carryOverAction.cast_time -= Math.max(0, 40 - totalTimeCost);
      }
    }

    validPreActions.forEach(preAct => {
      const preCostLog = applyActionCost(actor, preAct);
      if (preCostLog) actionLog += preCostLog + " ";
      if (preAct.action_type === "穿戴装备") {
        actor.equip[preAct.equip_target].equip_status = "已装备";
        actionLog += `[连招生效] ${actor.name}趁隙穿戴了${preAct.equip_target === 'armor' ? '斗铠' : '机甲'}！`;
      }
    });
    action.pre_actions = validPreActions;

    if (carryOverAction) {
      actor.charging_skill = carryOverAction;
      return {
        actor: actor.name,
        side: actorEntry.side,
        target: targets.enemyTarget.name,
        charging: true,
        action: actor.charging_skill,
        log: `[团战执行/转蓄力] 连招耗时过长，${actor.name}进入蓄力状态准备[${carryOverAction.skill?.name || carryOverAction.action_type}]，剩余前摇:${carryOverAction.cast_time}。`
      };
    }

    if (action.action_type !== "施法失败") {
      const costLog = applyActionCost(actor, action);
      if (action.decision_log) actionLog += action.decision_log + " ";
      if (costLog) actionLog += costLog + " ";
    }
  }

  let finalTarget = targets.enemyTarget;
  const skillTargetObj = action?.skill?.对象 || "敌方/单体";
  if (skillTargetObj.includes("己方") || skillTargetObj.includes("友方")) {
    finalTarget = targets.allyTarget;
  } else if (skillTargetObj.includes("自身")) {
    finalTarget = actor;
  }

  const actorTurnCombatData = createActorTurnCombatData(actorEntry, finalTarget, battleState);
  const ratio = calculateReactionRatio(actor, finalTarget, action, actorTurnCombatData);
  let reactionAction = { type: "无法反应", log: "无", skill: null, def_mult: 1.0 };
  if (finalTarget === actor || skillTargetObj.includes("己方") || skillTargetObj.includes("友方")) {
    reactionAction.log = `[配合] ${finalTarget.name}毫无防备地接受了${actor.name}的辅助。`;
  } else {
    reactionAction = finalTarget.is_controlled
      ? { type: "无法反应", log: `${finalTarget.name}处于被控状态，无法动作。`, skill: null, def_mult: 1.0 }
      : determineNpcAction(actorTurnCombatData, action, ratio);
  }

  const settleResult = executeClash(action, reactionAction, actorTurnCombatData);
  let turnLog = `${actionLog}[团战执行] ${actor.name}以[${action?.skill?.name || action?.action_type || '未知动作'}]指向[${finalTarget.name}]。 ${reactionAction.log} ${settleResult.desc}`.trim();

  let finalDmg = settleResult.dmg;
  if (finalDmg > 0) {
    if (finalDmg < finalTarget.def * 0.1) {
      finalTarget.vit -= 1;
      turnLog += ` [未破防] 对${finalTarget.name}仅造成 1 点强制伤害。`;
    } else {
      finalTarget.vit -= finalDmg;
      if (finalDmg > finalTarget.sp_max * 0.5) {
        if (!finalTarget.conditions) finalTarget.conditions = {};
        finalTarget.conditions["重度流血"] = {
          类型: "debuff", 层数: 1, 描述: "重创导致的流血", duration: 3,
          stat_mods: { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 },
          combat_effects: { skip_turn: false, dot_damage: Math.floor(finalTarget.vit_max * 0.05), armor_pen: 0 }
        };
        turnLog += ` [重创打击] ${finalTarget.name}被附加[重度流血]状态！`;
      }
    }
  }

  if (reactionAction.type === "穿戴装备") {
    const isTargetInterrupted = (settleResult.dmg / Math.max(1, finalTarget.vit_max) >= 0.15) || (action.skill?.仲裁逻辑?.状态挂载模块?.特殊机制标识?.includes("硬控"));
    if (!isTargetInterrupted) {
      finalTarget.equip[reactionAction.skill.equip_target].equip_status = "已装备";
      turnLog += ` [装备生效] ${finalTarget.name}成功完成装备穿戴。`;
    } else {
      turnLog += ` [穿戴失败] ${finalTarget.name}的装备穿戴被强行打断。`;
    }
  }

  if (finalTarget.vit < finalTarget.vit_max * 0.1 && finalTarget !== actor && !skillTargetObj.includes("己方") && !skillTargetObj.includes("友方")) {
    let hasMech = finalTarget.equip?.mech?.lv !== "无" && finalTarget.equip?.mech?.status !== "重创";
    let hasArmor = finalTarget.equip?.armor?.equip_status === "已装备";
    if (hasMech || hasArmor) {
      finalTarget.vit = Math.floor(finalTarget.vit_max * 0.1);
      turnLog += ` [装备护主] ${finalTarget.name}触发装备护主，强制锁血至 10%。${applyArmorDamage(finalTarget)}`;
    }
  }

  return {
    actor: actor.name,
    side: actorEntry.side,
    target: finalTarget.name,
    action,
    reactionAction,
    settleResult,
    log: turnLog,
    actorVit: actor.vit,
    targetVit: finalTarget.vit
  };
}

function getTeamLivingCount(team) {
  return (team || []).filter(unit => {
    bindCombatParticipant(unit);
    return unit.vit > 0;
  }).length;
}

function settleTeamRoundEnd(combatData, logs) {
  const allUnits = [
    ...(combatData.participants.team_player || []),
    ...(combatData.participants.team_enemy || [])
  ];

  allUnits.forEach(unit => {
    bindCombatParticipant(unit);
    if (unit.vit <= 0) return;

    const sustainResult = settleSustainEffectsAtRoundEnd(unit, unit.name || "未知单位");
    const conditionResult = settleConditionsAtRoundEnd(unit, unit.name || "未知单位");
    if (sustainResult.log) logs.push(`[团战回合尾] ${sustainResult.log}`);
    if (conditionResult.log) logs.push(`[团战回合尾] ${conditionResult.log}`);
  });
}

function runTeamBattleSimulation(combatData, maxRounds = 3) {
  hydrateCombatData(combatData);
  let logs = [];
  let rounds = 0;
  const startingRound = Number(combatData.round || 0);

  while (rounds < maxRounds) {
    rounds++;
    const currentRound = startingRound + rounds;
    combatData.round = currentRound;
    logs.push(`[团战第${currentRound}回合开始]`);

    const queue = generateActionQueue(combatData);
    for (const actorEntry of queue) {
      const teamPlayerAlive = getTeamLivingCount(combatData.participants.team_player || []);
      const teamEnemyAlive = getTeamLivingCount(combatData.participants.team_enemy || []);
      if (teamPlayerAlive <= 0 || teamEnemyAlive <= 0) break;

      const turnResult = runActorTurn(actorEntry, { combatData, round: currentRound, logs });
      if (turnResult?.log) logs.push(turnResult.log);
    }

    settleTeamRoundEnd(combatData, logs);

    const teamPlayerAlive = getTeamLivingCount(combatData.participants.team_player || []);
    const teamEnemyAlive = getTeamLivingCount(combatData.participants.team_enemy || []);
    logs.push(`[团战回合总结] 我方存活:${teamPlayerAlive} 敌方存活:${teamEnemyAlive}`);

    if (teamPlayerAlive <= 0 || teamEnemyAlive <= 0) {
      break;
    }
  }

  const finalPlayerAlive = getTeamLivingCount(combatData.participants.team_player || []);
  const finalEnemyAlive = getTeamLivingCount(combatData.participants.team_enemy || []);
  const winner = finalEnemyAlive <= 0 ? "player" : (finalPlayerAlive <= 0 ? "enemy" : "unfinished");
  
  // 如果是团战模拟结束且是虚拟环境死亡，修正战利品结算与强制锁血弹出
  const combatType = combatData.combat_type || "突发遭遇";
  if (combatType === "升灵台虚拟战斗" || combatType === "魂灵塔冲塔") {
    if (winner === "enemy") {
       (combatData.participants.team_player || []).forEach(p => {
         if (p.vit <= 0) p.vit = 1; 
       });
       if (combatData.participants.player && combatData.participants.player.vit <= 0) {
         combatData.participants.player.vit = 1;
       }
       logs.push(`[虚拟战败保护] 玩家方全员战败，触发安全协议，强制弹出并锁定体力为 1！`);
    }
  }

  return {
    rounds,
    roundStart: startingRound + 1,
    roundEnd: Number(combatData.round || startingRound),
    winner,
    playerAlive: finalPlayerAlive,
    enemyAlive: finalEnemyAlive,
    logs
  };
}

function runTeamBattleRound(combatData) {
  hydrateCombatData(combatData);
  const currentRound = Number(combatData.round || 0) + 1;
  combatData.round = currentRound;
  let logs = [`[团战第${currentRound}回合开始]`];

  const queue = generateActionQueue(combatData);
  for (const actorEntry of queue) {
    const teamPlayerAlive = getTeamLivingCount(combatData.participants.team_player || []);
    const teamEnemyAlive = getTeamLivingCount(combatData.participants.team_enemy || []);
    if (teamPlayerAlive <= 0 || teamEnemyAlive <= 0) break;

    const turnResult = runActorTurn(actorEntry, { combatData, round: currentRound, logs });
    if (turnResult?.log) logs.push(turnResult.log);
  }

  settleTeamRoundEnd(combatData, logs);

  const teamPlayerAlive = getTeamLivingCount(combatData.participants.team_player || []);
  const teamEnemyAlive = getTeamLivingCount(combatData.participants.team_enemy || []);
  const winner = teamEnemyAlive <= 0 ? "player" : (teamPlayerAlive <= 0 ? "enemy" : "unfinished");
  logs.push(`[团战回合总结] 我方存活:${teamPlayerAlive} 敌方存活:${teamEnemyAlive}`);

  return {
    rounds: 1,
    roundStart: currentRound,
    roundEnd: currentRound,
    winner,
    playerAlive: teamPlayerAlive,
    enemyAlive: teamEnemyAlive,
    logs
  };
}

function ui_executeBattleFlow(combatData, options = {}) {
  if (!combatData) {
    return { mode: options.mode || "single_round", roundsExecuted: 0, winner: "unfinished", logs: ["[UI执行] 未提供 combatData。"], snapshot: null };
  }

  const mode = options.mode === "multi_round" ? "multi_round" : "single_round";
  const rounds = Math.max(1, Number(options.rounds || 1));
  const result = mode === "multi_round"
    ? runTeamBattleSimulation(combatData, rounds)
    : runTeamBattleRound(combatData);

  return {
    mode,
    roundsRequested: mode === "multi_round" ? rounds : 1,
    roundsExecuted: result.rounds || 0,
    roundStart: result.roundStart,
    roundEnd: result.roundEnd,
    winner: result.winner || "unfinished",
    playerAlive: result.playerAlive,
    enemyAlive: result.enemyAlive,
    logs: result.logs || [],
    snapshot: ui_getBattleSnapshot(combatData)
  };
}

// ==========================================
// 📍 UI 适配器层 (对外暴露接口)
// ==========================================

function ui_getBattleSnapshot(combatData) {
  if (!combatData) return null;
  hydrateCombatData(combatData);

  const buildUnitSnapshot = (char) => {
    if (!char) return null;
    return {
      name: char.name || "未知",
      lv: char.lv || 1,
      type: char.type || "未知系",
      vit: char.vit || 0,
      vit_max: char.vit_max || 1,
      sp: char.sp || 0,
      sp_max: char.sp_max || 1,
      men: char.men || 0,
      men_max: char.men_max || 1,
      active_domain: char.active_domain || "无",
      conditions: Object.entries(char.conditions || {}).map(([name, cond]) => ({
        name,
        type: cond.类型 || "buff",
        duration: cond.duration || 0,
        desc: cond.描述 || "",
        skip_turn: cond.combat_effects?.skip_turn || false,
        dot: cond.combat_effects?.dot_damage || 0
      })),
      sustains: Object.keys(char.active_sustains || {}),
      isCharging: !!char.charging_skill,
      chargingCastTime: char.charging_skill?.cast_time || 0
    };
  };

  return {
    round: Number(combatData.round || 0),
    combat_type: combatData.combat_type || "突发遭遇",
    initiative: combatData.initiative || "无",
    player: buildUnitSnapshot(combatData.participants.player),
    enemy: buildUnitSnapshot(combatData.participants.enemy),
    team_player: (combatData.participants.team_player || []).map(buildUnitSnapshot).filter(Boolean),
    team_enemy: (combatData.participants.team_enemy || []).map(buildUnitSnapshot).filter(Boolean)
  };
}

function ui_getAvailableActions(charData, combatData) {
  if (!charData) return [];
  bindCombatParticipant(charData);
  const allyTeam = (combatData?.participants?.team_player || []).filter(unit => unit.name !== charData.name);
  const availableSkills = collectCombatSkills(charData, allyTeam);
  
  const actions = [];
  
  availableSkills.forEach(skill => {
    const costParsed = parseSkillCostForChar(skill, charData);
    actions.push({
      id: `skill_${skill.name}`,
      type: "skill",
      name: skill.name,
      category: skill.source_tag || "魂技", // 核心修改：按来源分类
      semantic_role: skill.主定位 || skill.技能类型 || "输出",
      tags: skill.标签 || [],
      cast_time: skill.cast_time || 0,
      cost_text: skill.消耗 || "无",
      enabled: costParsed.canCast,
      reason: costParsed.canCast ? "" : "状态不足",
      raw_skill: skill
    });
  });

  if (charData.equip?.armor?.lv > 0 && charData.equip?.armor?.equip_status !== "已装备") {
    actions.push({
      id: "equip_armor",
      type: "equip",
      name: "斗铠附体",
      category: "特殊动作",
      enabled: true,
      reason: ""
    });
  }

  if (charData.equip?.mech?.lv && charData.equip.mech.lv !== "无" && charData.equip?.mech?.equip_status !== "已装备" && charData.equip?.mech?.status !== "重创") {
    actions.push({
      id: "equip_mech",
      type: "equip",
      name: "召唤机甲",
      category: "特殊动作",
      enabled: true,
      reason: ""
    });
  }

  if (charData.bloodline_power?.skills?.["点燃生命之火"] && !charData.bloodline_power?.life_fire) {
    actions.push({
      id: "special_lifefire",
      type: "special",
      name: "点燃生命之火",
      category: "特殊动作",
      enabled: true,
      reason: ""
    });
  }

  actions.push({
    id: "action_flee",
    type: "tactical",
    name: "亡命奔逃",
    category: "特殊动作",
    enabled: true,
    reason: ""
  });

  return actions;
}

        initBattleUiFromMvu();
    }
}

window.BattleUIComponent = BattleUIComponent;