/* BattleUI_Module.js - 战斗终端系统 (JS 模块版) */

const BattleStyles =
  ".battle-module-scope {\n  position: fixed;\n  inset: 0;\n  z-index: 10000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(0,0,0,0.85);\n  backdrop-filter: blur(5px);\n  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;\n}\n    \n    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Noto+Serif+SC:wght@700&display=swap');\n\n    :root {\n      --shell-top: rgba(132, 160, 171, 0.84);\n      --shell-bottom: rgba(58, 96, 112, 0.90);\n      --shell-core: rgba(24, 58, 70, 0.28);\n      --panel: rgba(18, 56, 69, 0.20);\n      --panel-strong: rgba(23, 68, 84, 0.26);\n      --line: rgba(150, 217, 228, 0.22);\n      --line-soft: rgba(150, 217, 228, 0.10);\n      --cyan: #8de1ef;\n      --cyan-soft: rgba(141, 225, 239, 0.14);\n      --gold: #d7c070;\n      --gold-soft: rgba(228, 201, 111, 0.14);\n      --red: #ff8aa2;\n      --white: #f5fcff;\n      --text: #e4f5f9;\n      --text-sub: #bfdde4;\n      --text-dim: #87aeb7;\n      --pill-dark: #202c3b;\n      --pill-dark-border: rgba(255,255,255,0.08);\n      --hp: linear-gradient(90deg, #f38d9f, #f5adba);\n      --sp: linear-gradient(90deg, #73bfd1, #8ec8d5);\n      --men: linear-gradient(90deg, #9ea1dc, #b1bbe8);\n      --font-tech: 'Orbitron', 'Microsoft YaHei', sans-serif;\n      --font-title: 'Noto Serif SC', serif;\n      --font-ui: 'Microsoft YaHei', 'PingFang SC', sans-serif;\n      --grad-top: linear-gradient(90deg, transparent, #8ef7ff 16%, #f1ffff 50%, #98edff 84%, transparent);\n      --shadow-main: 0 24px 60px rgba(0,0,0,0.42);\n      --shadow-soft: inset 0 0 18px rgba(255,255,255,0.02), inset 0 0 16px rgba(0,229,255,0.03);\n      --shadow-cyan: 0 4px 15px rgba(77,240,255,0.14);\n    }\n\n    * { box-sizing: border-box; }\n\n    \n\n    \n\n    .battle-module-scope .battle-shell {\n      width: 640px;\n      height: 480px;\n      position: relative;\n      display: flex;\n      flex-direction: column;\n      overflow: hidden;\n      border-radius: 18px;\n      border: 1px solid rgba(255,255,255,0.10);\n      background:\n        linear-gradient(180deg, var(--shell-top), var(--shell-bottom)),\n        var(--shell-core);\n      backdrop-filter: blur(20px);\n      -webkit-backdrop-filter: blur(20px);\n      clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px);\n      box-shadow: var(--shadow-main);\n    }\n\n    .battle-module-scope .battle-shell::before {\n      content: '';\n      position: absolute;\n      left: 0;\n      right: 0;\n      top: 0;\n      height: 3px;\n      background: var(--grad-top);\n      z-index: 2;\n      pointer-events: none;\n    }\n\n    .battle-module-scope .battle-shell::after {\n      content: '';\n      position: absolute;\n      inset: 0;\n      z-index: 0;\n      pointer-events: none;\n      background:\n        radial-gradient(circle at left top, rgba(255,255,255,0.08), transparent 22%),\n        radial-gradient(circle at right bottom, rgba(255,215,0,0.06), transparent 24%),\n        repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 56px),\n        repeating-linear-gradient(180deg, rgba(255,255,255,0.014) 0 1px, transparent 1px 44px);\n      opacity: 0.9;\n    }\n\n    .battle-module-scope .battle-header {\n      position: relative;\n      z-index: 1;\n      flex: 0 0 auto;\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      gap: 12px;\n      padding: 12px 12px 8px;\n      border-bottom: 1px solid var(--line-soft);\n      background: linear-gradient(90deg, rgba(118,239,255,0.05), transparent 54%, rgba(228,201,111,0.03));\n    }\n\n    .battle-module-scope .combatant-card {\n      min-width: 0;\n      padding: 10px 10px 9px;\n      border-radius: 14px;\n      border: 1px solid var(--line);\n      background:\n        linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)),\n        rgba(7, 25, 33, 0.08);\n      box-shadow: var(--shadow-soft);\n      display: flex;\n      flex-direction: column;\n      gap: 6px;\n    }\n\n    .battle-module-scope .combatant-card.enemy {\n      text-align: right;\n    }\n\n    .battle-module-scope .name-row {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      gap: 8px;\n      min-width: 0;\n    }\n\n    .battle-module-scope .combatant-card.enemy .name-row {\n      flex-direction: row-reverse;\n    }\n\n    .battle-module-scope .name-block {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      min-width: 0;\n    }\n\n    .battle-module-scope .combatant-card.enemy .name-block {\n      flex-direction: row-reverse;\n    }\n\n    .battle-module-scope .lv-badge {\n      flex: 0 0 auto;\n      padding: 2px 8px;\n      border-radius: 8px;\n      font-size: 11px;\n      line-height: 1.2;\n      color: var(--gold);\n      background: rgba(56, 67, 36, 0.26);\n      border: 1px solid rgba(228,201,111,0.28);\n      box-shadow: inset 0 0 8px rgba(255,215,0,0.05);\n      font-family: var(--font-tech);\n    }\n\n    .battle-module-scope .combatant-name {\n      min-width: 0;\n      font-family: var(--font-title);\n      font-size: 14px;\n      font-weight: 700;\n      color: var(--cyan);\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      text-shadow: 0 0 8px rgba(118,239,255,0.20);\n    }\n\n    .battle-module-scope .bar-stack {\n      display: flex;\n      flex-direction: column;\n      gap: 5px;\n    }\n\n    .battle-module-scope .resource-bar {\n      position: relative;\n      height: 10px;\n      border-radius: 999px;\n      overflow: hidden;\n      border: 1px solid rgba(255,255,255,0.08);\n      background: rgba(5, 18, 24, 0.22);\n    }\n\n    .battle-module-scope .resource-fill {\n      width: 100%;\n      height: 100%;\n      transition: width .25s ease;\n    }\n\n    .resource-fill.hp { background: var(--hp); }\n    .resource-fill.sp { background: var(--sp); }\n    .resource-fill.men { background: var(--men); }\n\n    .battle-module-scope .resource-text {\n      position: absolute;\n      inset: 0;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-size: 7px;\n      color: #fff;\n      font-weight: 700;\n      text-shadow: 1px 1px 2px #000;\n      pointer-events: none;\n      font-family: var(--font-tech);\n    }\n\n    .battle-module-scope .stats-grid {\n      display: grid;\n      grid-template-columns: 1.35fr 1fr 1fr 1fr;\n      gap: 6px;\n      min-width: 0;\n    }\n\n    .battle-module-scope .stat-item {\n      min-width: 0;\n      padding: 4px 6px;\n      border-radius: 10px;\n      background: rgba(255,255,255,0.03);\n      border: 1px solid rgba(255,255,255,0.06);\n      box-shadow: inset 0 0 8px rgba(255,255,255,0.01);\n    }\n\n    .battle-module-scope .stat-label {\n      margin-bottom: 2px;\n      font-size: 8px;\n      color: var(--text-dim);\n      line-height: 1.1;\n      white-space: nowrap;\n    }\n\n    .battle-module-scope .stat-value {\n      font-size: 10px;\n      color: var(--white);\n      line-height: 1.15;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      font-family: var(--font-tech);\n    }\n\n    .combatant-card.enemy .stat-label,\n    .battle-module-scope .combatant-card.enemy .stat-value {\n      text-align: right;\n    }\n\n    .battle-module-scope .buff-row {\n      min-height: 16px;\n      display: flex;\n      gap: 4px;\n      flex-wrap: nowrap;\n      overflow-x: auto;\n      overflow-y: hidden;\n      padding-bottom: 1px;\n    }\n\n    .battle-module-scope .combatant-card.enemy .buff-row {\n      justify-content: flex-end;\n    }\n\n    .battle-module-scope .tag-chip {\n      flex: 0 0 auto;\n      display: inline-flex;\n      align-items: center;\n      gap: 4px;\n      padding: 2px 7px;\n      border-radius: 999px;\n      font-size: 8px;\n      line-height: 1;\n      white-space: nowrap;\n      color: var(--text-sub);\n      background: rgba(255,255,255,0.04);\n      border: 1px solid rgba(255,255,255,0.08);\n    }\n\n    .tag-chip.buff { color: var(--cyan); border-color: rgba(118,239,255,0.16); }\n    .tag-chip.debuff { color: var(--red); border-color: rgba(255,122,151,0.18); }\n    .tag-chip.field { color: var(--cyan); border-color: rgba(118,239,255,0.18); }\n    .tag-chip.sustain { color: #d7c7ff; border-color: rgba(215,199,255,0.18); }\n    .tag-chip.charge { color: var(--gold); border-color: rgba(228,201,111,0.18); }\n\n    .battle-module-scope .battle-main {\n      position: relative;\n      z-index: 1;\n      flex: 1 1 auto;\n      min-height: 0;\n      display: grid;\n      grid-template-columns: 86px 1fr 86px;\n      gap: 10px;\n      padding: 8px 12px 12px;\n    }\n\n    .battle-module-scope .side-rail {\n      min-height: 0;\n      display: flex;\n    }\n\n    .battle-module-scope .side-panel {\n      flex: 1;\n      min-height: 0;\n      border-radius: 16px;\n      border: 1px solid var(--line-soft);\n      background:\n        linear-gradient(180deg, rgba(24,76,92,0.18), rgba(16,48,58,0.12)),\n        rgba(255,255,255,0.015);\n      box-shadow: var(--shadow-soft);\n      padding: 8px 6px;\n      display: flex;\n      flex-direction: column;\n      gap: 6px;\n      overflow-y: auto;\n      overflow-x: hidden;\n    }\n\n    .battle-module-scope .side-card {\n      width: 100%;\n      border-radius: 12px;\n      border: 1px solid rgba(255,255,255,0.07);\n      background: rgba(16, 40, 50, 0.18);\n      padding: 6px 6px 5px;\n      display: flex;\n      flex-direction: column;\n      gap: 5px;\n      cursor: pointer;\n      transition: .16s ease;\n      text-align: left;\n      font-family: var(--font-ui);\n      color: var(--text-sub);\n    }\n\n    .battle-module-scope .side-card:hover {\n      border-color: rgba(118,239,255,0.18);\n      box-shadow: var(--shadow-cyan);\n      color: var(--white);\n    }\n\n    .battle-module-scope .side-card.active {\n      color: var(--white);\n      border-color: rgba(118,239,255,0.28);\n      background: rgba(118,239,255,0.08);\n      box-shadow: inset 0 0 8px rgba(118,239,255,0.04);\n    }\n\n    .battle-module-scope .side-card.enemy.active {\n      color: var(--cyan);\n    }\n\n    .battle-module-scope .side-name {\n      font-size: 10px;\n      line-height: 1.2;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      text-align: center;\n    }\n\n    .battle-module-scope .side-mini-bar {\n      height: 4px;\n      border-radius: 999px;\n      overflow: hidden;\n      border: 1px solid rgba(255,255,255,0.08);\n      background: rgba(5, 18, 24, 0.22);\n    }\n\n    .battle-module-scope .side-mini-fill {\n      height: 100%;\n      width: 100%;\n      background: var(--hp);\n    }\n\n    .battle-module-scope .center-column {\n      min-height: 0;\n      display: flex;\n      flex-direction: column;\n      gap: 8px;\n    }\n\n    .battle-module-scope .intent-bar {\n      flex: 0 0 auto;\n      border-radius: 16px;\n      border: 1px solid var(--line-soft);\n      background:\n        linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)),\n        rgba(16,48,58,0.10);\n      box-shadow: var(--shadow-soft);\n      padding: 8px 10px;\n    }\n\n    .battle-module-scope .intent-inner {\n      min-width: 0;\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      flex-wrap: wrap;\n    }\n\n    .battle-module-scope .intent-chip-row {\n      display: flex;\n      flex-wrap: wrap;\n      gap: 4px;\n      min-width: 0;\n      flex: 0 1 auto;\n    }\n\n    .battle-module-scope .intent-pill {\n      flex: 0 0 auto;\n      padding: 3px 8px;\n      border-radius: 999px;\n      font-size: 9px;\n      line-height: 1;\n      color: var(--white);\n      background: rgba(255,255,255,0.035);\n      border: 1px solid rgba(255,255,255,0.07);\n      white-space: nowrap;\n    }\n\n    .battle-module-scope .ghost-btn {\n      margin-left: auto;\n      border: 1px solid rgba(118,239,255,0.20);\n      background: rgba(118,239,255,0.06);\n      color: var(--cyan);\n      border-radius: 999px;\n      padding: 3px 10px;\n      font-size: 9px;\n      font-family: var(--font-ui);\n      cursor: pointer;\n      white-space: nowrap;\n    }\n\n    .battle-module-scope .ghost-btn:hover {\n      background: rgba(118,239,255,0.10);\n    }\n\n    .battle-module-scope .action-wrap {\n      flex: 1 1 auto;\n      min-height: 0;\n      border-radius: 16px;\n      border: 1px solid var(--line);\n      background:\n        linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)),\n        rgba(16,48,58,0.10);\n      box-shadow: var(--shadow-soft);\n      overflow: hidden;\n      display: flex;\n      flex-direction: column;\n    }\n\n    .battle-module-scope .battle-toolbar {\n      display: flex;\n      align-items: center;\n      justify-content: flex-start;\n      gap: 8px;\n      padding: 6px 12px;\n      border-bottom: 1px solid var(--line-soft);\n      background: linear-gradient(90deg, rgba(118,239,255,0.04), rgba(255,255,255,0.01));\n      flex: 0 0 auto;\n    }\n\n    .battle-module-scope .mode-group {\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      flex-wrap: wrap;\n    }\n\n    .battle-module-scope .mode-btn {\n      border: 1px solid rgba(255,255,255,0.08);\n      background: transparent;\n      color: var(--text-dim);\n      border-radius: 999px;\n      padding: 3px 9px;\n      font-size: 9px;\n      font-family: var(--font-ui);\n      cursor: pointer;\n    }\n\n    .battle-module-scope .mode-btn.active {\n      color: var(--cyan);\n      border-color: rgba(118,239,255,0.24);\n      background: rgba(118,239,255,0.08);\n    }\n\n    .battle-module-scope .action-filters {\n      flex: 0 0 auto;\n      display: flex;\n      gap: 6px;\n      padding: 6px 12px;\n      border-bottom: 1px solid var(--line-soft);\n      background: rgba(118,239,255,0.035);\n      overflow-x: auto;\n      overflow-y: hidden;\n    }\n\n    .battle-module-scope .filter-btn {\n      flex: 0 0 auto;\n      border: 1px solid transparent;\n      background: transparent;\n      color: var(--text-dim);\n      border-radius: 8px;\n      padding: 4px 9px;\n      font-size: 10px;\n      font-family: var(--font-ui);\n      cursor: pointer;\n      white-space: nowrap;\n    }\n\n    .battle-module-scope .filter-btn.active {\n      color: var(--cyan);\n      border-color: rgba(118,239,255,0.22);\n      background: rgba(118,239,255,0.08);\n    }\n\n    .battle-module-scope .action-grid {\n      flex: 1 1 auto;\n      min-height: 0;\n      display: grid;\n      grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));\n      gap: 8px;\n      padding: 8px 12px 12px;\n      overflow-y: auto;\n    }\n\n    .battle-module-scope .action-btn {\n      min-height: 62px;\n      border-radius: 12px;\n      border: 1px solid rgba(118,239,255,0.14);\n      background: linear-gradient(180deg, rgba(0,229,255,0.08), rgba(0,229,255,0.02));\n      color: var(--text);\n      padding: 8px 8px 7px;\n      box-shadow: inset 0 0 10px rgba(0,0,0,0.12);\n      display: flex;\n      flex-direction: column;\n      gap: 5px;\n      align-items: stretch;\n      text-align: left;\n      cursor: pointer;\n      transition: border-color .16s ease, background .16s ease, transform .16s ease;\n      font-family: var(--font-ui);\n    }\n\n    .battle-module-scope .action-btn:hover:not(:disabled) {\n      border-color: rgba(118,239,255,0.24);\n      background: linear-gradient(180deg, rgba(0,229,255,0.14), rgba(0,229,255,0.03));\n      box-shadow: var(--shadow-cyan);\n      transform: translateY(-1px);\n    }\n\n    .battle-module-scope .action-btn.is-selected {\n      border-color: rgba(118,239,255,0.28);\n      background: linear-gradient(180deg, rgba(0,229,255,0.16), rgba(0,229,255,0.04));\n      box-shadow: inset 0 0 10px rgba(0,229,255,0.04);\n    }\n\n    .battle-module-scope .action-btn:disabled {\n      opacity: 0.55;\n      cursor: not-allowed;\n    }\n\n    .battle-module-scope .action-name {\n      font-size: 12px;\n      font-weight: 700;\n      color: var(--white);\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n\n    .battle-module-scope .action-meta {\n      margin-top: auto;\n      display: flex;\n      justify-content: space-between;\n      gap: 6px;\n      font-size: 9px;\n      color: var(--text-dim);\n    }\n\n    .action-cost { color: var(--gold); }\n\n    .battle-module-scope .skill-tooltip {\n      position: absolute;\n      left: 108px;\n      bottom: 16px;\n      width: 280px;\n      padding: 10px;\n      border-radius: 12px;\n      border: 1px solid rgba(118,239,255,0.22);\n      background: rgba(10, 30, 38, 0.92);\n      backdrop-filter: blur(14px);\n      -webkit-backdrop-filter: blur(14px);\n      box-shadow: 0 12px 30px rgba(0,0,0,0.55), inset 0 0 15px rgba(0,229,255,0.08);\n      display: none;\n      z-index: 3;\n      pointer-events: none;\n    }\n\n    .skill-tooltip.show { display: block; }\n\n    .battle-module-scope .tt-header {\n      display: flex;\n      justify-content: space-between;\n      gap: 8px;\n      align-items: center;\n      margin-bottom: 8px;\n      padding-bottom: 6px;\n      border-bottom: 1px solid rgba(255,255,255,0.06);\n    }\n\n    .battle-module-scope .tt-name {\n      font-size: 13px;\n      color: var(--cyan);\n      font-weight: 700;\n    }\n\n    .battle-module-scope .tt-cast {\n      flex: 0 0 auto;\n      font-size: 8px;\n      color: var(--gold);\n      padding: 2px 6px;\n      border-radius: 999px;\n      border: 1px solid rgba(228,201,111,0.22);\n      background: rgba(228,201,111,0.08);\n    }\n\n    .battle-module-scope .tt-tags {\n      display: flex;\n      flex-wrap: wrap;\n      gap: 5px;\n      margin-bottom: 8px;\n    }\n\n    .battle-module-scope .tt-tag {\n      padding: 2px 6px;\n      border-radius: 999px;\n      font-size: 8px;\n      color: var(--white);\n      background: rgba(118,239,255,0.08);\n      border: 1px solid rgba(118,239,255,0.14);\n    }\n\n    .battle-module-scope .tt-effects {\n      font-size: 10px;\n      line-height: 1.5;\n      color: var(--text);\n    }\n\n    .battle-module-scope .tt-effect-type {\n      color: var(--cyan);\n      font-weight: 700;\n      margin-right: 4px;\n    }\n\n    ::-webkit-scrollbar { width: 4px; height: 4px; }\n    ::-webkit-scrollbar-thumb { background: rgba(118,239,255,0.22); border-radius: 999px; }\n  ";

const BattleTemplate =
  '<div class="battle-module-scope">\n<div class="battle-shell">\n    <div class="battle-header">\n      <div class="combatant-card player" id="ui-player-panel">\n        <div class="name-row">\n          <div class="name-block">\n            <span class="lv-badge" id="ui-player-lv">Lv.0</span>\n            <span class="combatant-name" id="ui-player-name">Player</span>\n          </div>\n        </div>\n        <div class="bar-stack">\n          <div class="resource-bar">\n            <div class="resource-fill hp" id="ui-player-hp-bar"></div>\n            <div class="resource-text" id="ui-player-hp-text">0 / 0</div>\n          </div>\n          <div class="resource-bar">\n            <div class="resource-fill sp" id="ui-player-sp-bar"></div>\n            <div class="resource-text" id="ui-player-sp-text">0 / 0</div>\n          </div>\n          <div class="resource-bar">\n            <div class="resource-fill men" id="ui-player-men-bar"></div>\n            <div class="resource-text" id="ui-player-men-text">0 / 0</div>\n</div>';

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
    const lodashGet =
      root._ && typeof root._.get === 'function'
        ? root._.get.bind(root._)
        : (obj, path, fallback) => {
            const normalized = String(path || '')
              .split('.')
              .filter(Boolean);
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
        const getter =
          typeof root.getAllVariables === 'function'
            ? root.getAllVariables.bind(root)
            : typeof host?.getAllVariables === 'function'
              ? host.getAllVariables.bind(host)
              : null;
        return getter ? getter() || {} : {};
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
        const waiter =
          typeof root.waitGlobalInitialized === 'function'
            ? root.waitGlobalInitialized.bind(root)
            : typeof host?.waitGlobalInitialized === 'function'
              ? host.waitGlobalInitialized.bind(host)
              : null;
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
      const eventOnFn =
        typeof root.eventOn === 'function'
          ? root.eventOn.bind(root)
          : typeof host?.eventOn === 'function'
            ? host.eventOn.bind(host)
            : null;
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
      const basePaths = Array.from(names).map(name => `/char/${escapeJsonPointerSegment(name)}`);
      if (!basePaths.length) return;

      const addToTargets = (suffix, value) => {
        if (value === undefined) return;
        basePaths.forEach(base => pushReplaceOp(ops, `${base}${suffix}`, value));
      };

      if (participant.stat !== undefined) {
        addToTargets('/stat', participant.stat);
      } else {
        [
          'age',
          'lv',
          'type',
          'talent_tier',
          'is_evil',
          'sp',
          'sp_max',
          'men',
          'men_max',
          'str',
          'def',
          'agi',
          'vit',
          'vit_max',
          'conditions',
        ].forEach(key => {
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

    function sanitizeCombatPersistenceData(value) {
      if (Array.isArray(value)) return value.map(item => sanitizeCombatPersistenceData(item));
      if (!value || typeof value !== 'object') return value;
      const cleaned = {};
      Object.entries(value).forEach(([key, item]) => {
        if (key === 'is_controlled' || key === 'action_declared' || key === '_current_cast_time' || /^temp_/.test(key))
          return;
        cleaned[key] = sanitizeCombatPersistenceData(item);
      });
      return cleaned;
    }

    function buildCombatJsonPatch(combatData) {
      const safeCombatData = sanitizeCombatPersistenceData(deepClonePlain(combatData));
      const ops = [{ op: 'replace', path: '/world/combat', value: safeCombatData }];

      const participants = safeCombatData?.participants;
      if (!participants) return ops;

      pushParticipantSyncPatch(ops, participants.player, ['主角']);
      pushParticipantSyncPatch(ops, participants.enemy);
      (participants.team_player || []).forEach(unit => pushParticipantSyncPatch(ops, unit));
      (participants.team_enemy || []).forEach(unit => pushParticipantSyncPatch(ops, unit));

      return ops;
    }

    function buildUpdateVariableText(patchOps, options = {}) {
      const analysis = String(
        options.analysis ||
          'Frontend battle arbitration already produced the exact combat result. Apply the following JSONPatch exactly as given.',
      ).trim();
      return `<UpdateVariable>\n<Analysis>${analysis}</Analysis>\n<JSONPatch>\n${JSON.stringify(patchOps || [], null, 2)}\n</JSONPatch>\n</UpdateVariable>`;
    }

    function persistCombatData(combatData, options = {}) {
      const safeCombatData = sanitizeCombatPersistenceData(deepClonePlain(combatData));
      const patchOps = buildCombatJsonPatch(safeCombatData);
      if (Array.isArray(options.extraPatchOps)) {
        patchOps.push(...options.extraPatchOps);
      }
      const updateVariableText = buildUpdateVariableText(patchOps, options);
      const detail = {
        combatData: safeCombatData,
        patchOps,
        updateVariableText,
        rootPath: '/world/combat',
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
      return findFirstElement(
        [
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
          'textarea',
        ],
        doc,
      );
    }

    function findSendButton(doc = getHostDocument()) {
      return findFirstElement(
        [
          '#send_but',
          '#send-button',
          'button[data-testid="send-button"]',
          'button[title*="Send"]',
          'button[aria-label*="Send"]',
          'button[aria-label*="发送"]',
          'button[title*="发送"]',
          'form button[type="submit"]',
        ],
        doc,
      );
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
        sendButtonFound: !!sendResult.button,
      };
    }

    function looksLikeGenerationUrl(url) {
      return /(generate|completion|chat-completions|text-completions|api\/backends|v1\/chat\/completions|v1\/completions)/i.test(
        String(url || ''),
      );
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
        at: Date.now(),
      };
      try {
        root.dispatchEvent(
          new CustomEvent('battle-ui-system-prompt-consumed', {
            detail: root.__battleLastInjectedSystemPrompt,
          }),
        );
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
          channel: result.channel,
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

      host.fetch = async function (input, init) {
        let nextInput = input;
        let nextInit = init;
        const url = typeof input === 'string' ? input : input?.url || init?.url || '';

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

      XHR.prototype.open = function (method, url, ...rest) {
        this.__battleUIRequestUrl = url;
        return nativeOpen.call(this, method, url, ...rest);
      };

      XHR.prototype.send = function (body) {
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
      root.sendToAI = function (playerInput, systemPrompt, meta = {}) {
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
            requestKind,
          },
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
        console.warn(
          'BattleUIBridge.setMVU 未启用：当前按明月秋青规范仅从 getAllVariables()/stat_data 读取 MVU 变量。',
          path,
          value,
        );
        return false;
      },
      initCombatContext() {
        console.warn('BattleUIBridge.initCombatContext 已停用：战斗上下文应由 MVU 系统维护在 stat_data.* 下。');
        return getMvuValue('world.combat');
      },
      getBattleContext() {
        return getMvuValue('world.combat');
      },
      subscribeMvuUpdates(handler) {
        return subscribeMvuUpdates(handler);
      },
      persistCombatData(combatData, options = {}) {
        return persistCombatData(combatData, options);
      },
      executeBattleFlow(combatData, options = {}) {
        return ui_executeBattleFlow(combatData, options);
      },
      getBattleSnapshot(combatData) {
        return ui_getBattleSnapshot(combatData);
      },
      getAvailableActions(charData, combatData) {
        return ui_getAvailableActions(charData, combatData);
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
        console.warn('BattleUIBridge.setCombatContext 已停用：请通过 MVU 系统更新 stat_data.*。');
        return getMvuValue('world.combat');
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
          sendButtonFound: !!sendResult.button,
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
      },
    });

    root.getBattleUiMvuValue = getMvuValue;
    root.getBattleUiAllVariables = getAllVariablesSafe;
    root.waitBattleUiMvuReady = waitForMvuReady;

    installHostHooks();
    /* __BATTLE_ENGINE_INLINE__ */
    const COMBAT_STAT_KEYS = [
      'age',
      'lv',
      'type',
      'talent_tier',
      'is_evil',
      'sp',
      'sp_max',
      'men',
      'men_max',
      'str',
      'def',
      'agi',
      'vit',
      'vit_max',
      'conditions',
    ];
    const COMBAT_STATUS_KEYS = ['alive', 'wound', 'action', 'active_domain', 'loc', 'current_x', 'current_y'];

    function createEmptySkillSemantics() {
      return {
        主定位: '无',
        作用目标: '敌方单体',
        战术标签: [],
        优先条件: [],
        风险等级: '中',
        保留倾向: 0,
        目标偏好: [],
        友方偏好: [],
        是否持续: false,
        是否可打断: false,
        是否可被霸体免疫: true,
      };
    }

    function createEmptyBattleSummary() {
      return {
        目标规模: '单体',
        生效方式: '直接',
        爆发级别: '中',
        持续性: '无',
        风险等级: '中',
        属性建模: '无',
        极性层级: '无',
        控制强度: '无',
        回复性质: '无',
        防御性质: '无',
        协同性: '低',
        保留倾向: 0,
      };
    }

    function mapSemanticTargetToCombatTarget(target) {
      const mapping = {
        敌方单体: '敌方/单体',
        敌方群体: '敌方/群体',
        自身: '自身',
        友方单体: '己方/单体',
        友方群体: '己方/群体',
        全场: '全场',
      };
      return mapping[target] || target || '敌方/单体';
    }

    function getMechanismJudgeValue(entity, finalEntity, judgeKey) {
      const stats = finalEntity || entity || {};
      switch (judgeKey) {
        case 'men_max':
        case 'sp_max':
        case 'agi':
        case 'str':
        case 'def':
        case 'vit':
          return Number(stats[judgeKey] || 0);
        case 'vit_ratio':
        case 'hp_ratio':
          return (
            Math.max(0, Number(entity?.vit || stats?.vit || 0)) /
            Math.max(1, Number(entity?.vit_max || stats?.vit_max || 1))
          );
        case 'sp_ratio':
          return (
            Math.max(0, Number(entity?.sp || stats?.sp || 0)) /
            Math.max(1, Number(entity?.sp_max || stats?.sp_max || 1))
          );
        case 'men_ratio':
          return (
            Math.max(0, Number(entity?.men || stats?.men || 0)) /
            Math.max(1, Number(entity?.men_max || stats?.men_max || 1))
          );
        default:
          return 0;
      }
    }

    function mergeRuntimePayloadToState(payload, pState) {
      if (!payload || typeof payload !== 'object') return;
      const calc = pState.计算层效果 || (pState.计算层效果 = createEmptyCombatEffectMap());
      const stateMods = pState.面板修改比例 || (pState.面板修改比例 = {});
      const statMods = payload.stat_mods || payload.面板修改 || {};
      ['str', 'def', 'agi', 'vit_max', 'men_max', 'sp_max'].forEach(k => {
        if (statMods[k] !== undefined) stateMods[k] = statMods[k];
      });
      [
        'skip_turn',
        'cannot_react',
        'dot_damage',
        'silence',
        'disarm',
        'blind',
        'counter_attack_ratio',
        'damage_reduction',
        'block_count',
        'super_armor',
        'death_save_count',
        'armor_pen',
        'reaction_bonus',
        'reaction_penalty',
        'attacker_speed_bonus',
        'cast_speed_bonus',
        'cast_speed_penalty',
        'hit_bonus',
        'hit_penalty',
        'dodge_bonus',
        'dodge_penalty',
        'lock_level',
        'control_success_bonus',
        'control_success_penalty',
        'control_resist_mult',
        'control_resist_bonus',
        'interrupt_bonus',
        'final_damage_mult',
        'final_damage_bonus',
        'final_heal_mult',
        'final_heal_bonus',
        'shield_gain_mult',
        'shield_gain_bonus',
        'sp_gain_ratio',
        'men_gain_ratio',
        'heal_block_ratio',
        'resource_block_ratio',
        'min_hp_floor',
        'hot_heal_ratio',
        'bonus_true_damage_ratio',
        'life_steal_ratio',
      ].forEach(k => {
        if (payload[k] !== undefined) calc[k] = payload[k];
      });
    }

    function applyRuntimeMechanismEffects(skill, attacker, attackerFinalStat, defender, defenderFinalStat, pState) {
      const effects = getSkillEffects(skill);
      effects.forEach(effect => {
        const mechanism = effect?.机制 || effect?.名称 || effect?.类型 || '';
        const duration = Math.max(0, Number((effect?.持续 ?? effect?.持续回合) || 0));
        const ensureStateShell = (fallbackName, extraFlags = []) => {
          const nextName = String(effect?.状态名称 || fallbackName || mechanism || '无');
          if (!nextName || nextName === '无') return;
          if (!pState.状态名称 || pState.状态名称 === '无') {
            pState.状态名称 = nextName;
            const nextTarget = String(effect?.目标 || effect?.对象 || '').trim();
            if (nextTarget) pState.目标 = nextTarget;
            if (nextTarget) pState.对象 = nextTarget;
          }
          if (duration > 0) pState.持续回合 = Math.max(Number(pState.持续回合 || 0), duration);
          pState.特殊机制标识 = mergeSpecialFlags(pState.特殊机制标识 || '无', extraFlags);
        };
        if (['标记锁定', '幻境', '催眠', '斩杀补伤', '条件触发'].includes(mechanism)) {
          const judgeKey = effect.判定属性;
          const threshold = Number(effect.判定阈值 ?? 1.0);
          let success = true;
          if (judgeKey) {
            const attackerValue = getMechanismJudgeValue(attacker, attackerFinalStat, judgeKey);
            const defenderValue = getMechanismJudgeValue(defender, defenderFinalStat, judgeKey);
            if (['vit_ratio', 'hp_ratio', 'sp_ratio', 'men_ratio'].includes(judgeKey)) {
              success = defenderValue <= threshold;
            } else {
              success = attackerValue / Math.max(1, defenderValue) >= threshold;
            }
          }
          const payload = success ? effect.成功参数 || {} : effect.失败参数 || {};
          mergeRuntimePayloadToState(payload, pState);
          if (['标记锁定', '幻境', '催眠'].includes(mechanism)) ensureStateShell(mechanism, [mechanism]);
        } else {
          const directPayload = {};
          if (mechanism === '属性变化') {
            const property = String(effect?.属性 || '').trim();
            const action = String(effect?.动作 || '').trim();
            const value = Number(effect?.数值 || 0);
            if (['str', 'def', 'agi', 'vit_max', 'sp_max', 'men_max'].includes(property) && Number.isFinite(value)) {
              directPayload.stat_mods = { [property]: value };
              ensureStateShell(effect?.状态名称 || '属性变化', [action || '属性变化']);
            }
            if (property === '威力' && Number.isFinite(value)) {
              directPayload.final_damage_mult = value;
              ensureStateShell(effect?.状态名称 || '威力变化', [action || '威力变化']);
            }
            if (property === '控制' && Number.isFinite(value)) {
              directPayload.control_resist_mult = value;
              ensureStateShell(effect?.状态名称 || '控制修正', [action || '控制修正']);
            }
          }
          if (mechanism === '持续恢复') {
            const property = String(effect?.属性 || '').trim();
            const value = Number(effect?.数值 || 0);
            if (property === 'vit') directPayload.hot_heal_ratio = value;
            if (property === 'sp') directPayload.sp_gain_ratio = value;
            if (property === 'men') directPayload.men_gain_ratio = value;
            ensureStateShell(effect?.状态名称 || '持续恢复', ['持续恢复']);
          }
          if (mechanism === '消耗修正') {
            const value = Number(effect?.数值 || 1);
            const action = String(effect?.动作 || '').trim();
            if (action === '消耗提高') directPayload.resource_block_ratio = Math.max(0, value - 1);
            ensureStateShell(effect?.状态名称 || '消耗修正', [action || '消耗修正']);
          }
          if (mechanism === '前摇修正') {
            const value = Number(effect?.数值 || 1);
            const action = String(effect?.动作 || '').trim();
            if (action === '前摇拉长') directPayload.cast_speed_penalty = Math.max(0, value - 1);
            else directPayload.cast_speed_bonus = Math.max(0, 1 - value);
            ensureStateShell(effect?.状态名称 || '前摇修正', [action || '前摇修正']);
          }
          if (mechanism === '掌控修正') {
            const value = Number(effect?.数值 || 1);
            const action = String(effect?.动作 || '').trim();
            if (action === '倍率压制') directPayload.control_success_penalty = Math.max(0, 1 - value);
            else directPayload.control_success_bonus = Math.max(0, value - 1);
            ensureStateShell(effect?.状态名称 || '掌控修正', ['掌控修正']);
          }
          if (mechanism === '速度修正') {
            const value = Number(effect?.数值 || 1);
            const action = String(effect?.动作 || '').trim();
            if (action === '倍率压制') {
              directPayload.reaction_penalty = Math.max(0, 1 - value);
              directPayload.dodge_penalty = Math.max(0, 1 - value);
            } else {
              directPayload.reaction_bonus = Math.max(0, value - 1);
              directPayload.attacker_speed_bonus = Math.max(0, value - 1);
              directPayload.dodge_bonus = Math.max(0, Math.max(0, value - 1) * 0.75);
            }
            ensureStateShell(effect?.状态名称 || '速度修正', ['速度修正']);
          }
          if (mechanism === '打断') directPayload.interrupt_bonus = effect.中断概率 || 1.0;
          if (mechanism === '沉默') directPayload.silence = true;
          if (mechanism === '减速') directPayload.stat_mods = { agi: effect.agi_ratio || 0.8 };
          if (['流血DOT', '持续伤害DOT'].includes(mechanism))
            directPayload.dot_damage = Math.max(0, Number(effect.dot_damage || effect.每回合伤害 || 0));
          if (mechanism === '致盲') directPayload.blind = true;
          if (mechanism === '软控') {
            directPayload.reaction_penalty = Number(effect.reaction_penalty || 0);
            directPayload.cast_speed_penalty = Number(effect.cast_speed_penalty || 0);
            directPayload.dodge_penalty = Number(effect.dodge_penalty || 0);
          }
          if (mechanism === '位移限制') {
            directPayload.reaction_penalty = Number(effect.reaction_penalty || 0);
            directPayload.dodge_penalty = Number(effect.dodge_penalty || 0);
            directPayload.lock_level = Number(effect.lock_level || 0);
          }
          if (mechanism === '自身位移') {
            directPayload.dodge_bonus = Number(effect.dodge_bonus || 0);
            directPayload.attacker_speed_bonus = Number(effect.attacker_speed_bonus || 0);
            directPayload.reaction_bonus = Number(effect.reaction_bonus || 0);
          }
          if (['强制位移', '位移交换'].includes(mechanism)) {
            directPayload.dodge_penalty = Number(effect.dodge_penalty || 0);
            directPayload.reaction_penalty = Number(effect.reaction_penalty || 0);
            directPayload.lock_level = Number(effect.lock_level || 0);
          }
          if (mechanism === '强制绑定/锁定') {
            directPayload.dodge_penalty = Number(effect.dodge_penalty || 0);
            directPayload.reaction_penalty = Number(effect.reaction_penalty || 0);
            directPayload.lock_level = Number(effect.lock_level || 0);
          }
          if (mechanism === '标记弱点') {
            directPayload.final_damage_mult = Number(effect.final_damage_mult || 1.1);
            directPayload.dodge_penalty = Number(effect.dodge_penalty || 0);
            directPayload.lock_level = Number(effect.lock_level || 0);
          }
          if (mechanism === '追击位移') {
            directPayload.attacker_speed_bonus = Number(effect.attacker_speed_bonus || 0);
            directPayload.hit_bonus = Number(effect.hit_bonus || 0);
            directPayload.final_damage_mult = Number(effect.final_damage_mult || 1.0);
          }
          if (mechanism === '脱离位移') {
            directPayload.dodge_bonus = Number(effect.dodge_bonus || 0);
            directPayload.cast_speed_bonus = Number(effect.cast_speed_bonus || 0);
            directPayload.reaction_bonus = Number(effect.reaction_bonus || 0);
          }
          if (mechanism === '反制') {
            directPayload.counter_attack_ratio = Number(effect.反击倍率 || effect.counter_attack_ratio || 0);
            directPayload.damage_reduction = Number(effect.damage_reduction || 0);
          }
          if (mechanism === '受击反击') directPayload.counter_attack_ratio = effect.反击倍率 || 0.5;
          if (mechanism === '减伤') directPayload.damage_reduction = effect.减伤比例 || 0.15;
          if (mechanism === '格挡') directPayload.block_count = effect.抵消次数 || 1;
          if (mechanism === '霸体') {
            directPayload.super_armor = true;
            directPayload.damage_reduction = Number(effect.减伤比例 || effect.damage_reduction || 0);
          }
          if (mechanism === '禁疗') directPayload.heal_block_ratio = Number(effect.heal_block_ratio || 0);
          if (mechanism === '共享视野') {
            directPayload.reaction_bonus = Number(effect.reaction_bonus || 0);
            directPayload.hit_bonus = Number(effect.hit_bonus || 0);
            directPayload.lock_level = Number(effect.lock_level || 0);
          }
          if (mechanism === '分身') {
            const cloneType = String(effect.分身类型 || '').trim();
            const cloneCount = Math.max(1, Number(effect.分身数量 || 1));
            const stealth = Math.max(0, Math.min(1, Number(effect.隐蔽度 || 0)));
            const inheritRatio = Math.max(0, Math.min(1, Number(effect.实力继承比例 || 0)));
            if (cloneType === '精神力分身') {
              directPayload.reaction_bonus = Number(
                effect.reaction_bonus || Math.min(0.28, 0.04 + stealth * 0.16 + inheritRatio * 0.08),
              );
              directPayload.hit_bonus = Number(
                effect.hit_bonus || Math.min(0.3, 0.04 + inheritRatio * 0.15 + cloneCount * 0.03),
              );
              directPayload.lock_level = Number(
                effect.lock_level || Math.min(3, Math.max(1, Math.round(1 + inheritRatio * 1.2 + stealth * 0.8))),
              );
              directPayload.damage_reduction = Number(
                effect.damage_reduction || Math.min(0.18, 0.02 + stealth * 0.05 + cloneCount * 0.01),
              );
            } else {
              directPayload.dodge_bonus = Number(
                effect.dodge_bonus || Math.min(0.35, 0.05 + stealth * 0.18 + inheritRatio * 0.08 + cloneCount * 0.03),
              );
              directPayload.attacker_speed_bonus = Number(
                effect.attacker_speed_bonus || Math.min(0.24, 0.03 + inheritRatio * 0.12 + cloneCount * 0.02),
              );
              directPayload.damage_reduction = Number(
                effect.damage_reduction || Math.min(0.22, 0.02 + stealth * 0.08 + cloneCount * 0.015),
              );
              directPayload.final_damage_mult = Number(
                effect.final_damage_mult ||
                  Math.min(1.28, 1 + inheritRatio * 0.12 + Math.max(0, cloneCount - 1) * 0.04),
              );
            }
          }
          if (mechanism === '免死') {
            directPayload.super_armor = true;
            directPayload.min_hp_floor = 1;
            directPayload.death_save_count = effect.触发次数 || 1;
          }
          if (mechanism === '硬控') {
            directPayload.skip_turn = true;
            directPayload.cannot_react = true;
          }
          if (mechanism === '沉默') ensureStateShell('沉默', ['沉默']);
          if (mechanism === '减速') ensureStateShell('减速', ['减速']);
          if (['流血DOT', '持续伤害DOT'].includes(mechanism))
            ensureStateShell(effect?.状态名称 || (mechanism === '流血DOT' ? '流血' : '持续创伤'), [
              effect?.状态名称 || (mechanism === '流血DOT' ? '流血' : '持续伤害'),
            ]);
          if (mechanism === '致盲') ensureStateShell('致盲', ['致盲']);
          if (mechanism === '软控') ensureStateShell(effect?.状态名称 || '软控', ['软控']);
          if (mechanism === '位移限制') ensureStateShell(effect?.状态名称 || '位移限制', ['位移限制']);
          if (mechanism === '自身位移') ensureStateShell(effect?.状态名称 || '自身位移', ['自身位移']);
          if (mechanism === '强制位移') ensureStateShell(effect?.状态名称 || '强制位移', ['强制位移']);
          if (mechanism === '位移交换') ensureStateShell(effect?.状态名称 || '位移交换', ['位移交换']);
          if (mechanism === '强制绑定/锁定') ensureStateShell(effect?.状态名称 || '强制绑定/锁定', ['强制绑定/锁定']);
          if (mechanism === '追击位移') ensureStateShell(effect?.状态名称 || '追击位移', ['追击位移']);
          if (mechanism === '脱离位移') ensureStateShell(effect?.状态名称 || '脱离位移', ['脱离位移']);
          if (mechanism === '反制') ensureStateShell(effect?.状态名称 || '反制', ['反制']);
          if (mechanism === '标记弱点') ensureStateShell('标记弱点', ['标记弱点']);
          if (mechanism === '减伤') ensureStateShell('减伤', ['减伤']);
          if (mechanism === '格挡') ensureStateShell('格挡', ['格挡']);
          if (mechanism === '霸体') ensureStateShell('霸体', ['霸体']);
          if (mechanism === '分身') ensureStateShell(effect?.状态名称 || effect?.分身类型 || '分身', ['分身']);
          if (mechanism === '禁疗') ensureStateShell('禁疗', ['禁疗']);
          if (mechanism === '共享视野') ensureStateShell('共享视野', ['共享视野']);
          if (mechanism === '硬控') ensureStateShell(effect?.状态名称 || '硬控', ['硬控']);
          if (mechanism === '免死') ensureStateShell('免死', ['免死']);
          if (mechanism === '受击反击') ensureStateShell('受击反击', ['反击']);
          if (Object.keys(directPayload).length > 0) {
            mergeRuntimePayloadToState(directPayload, pState);
          }
        }
      });
    }

    function mapPrimaryRoleToSkillType(role) {
      const mapping = {
        输出: '输出',
        控制: '控制',
        防御: '防御',
        辅助: '辅助',
        特殊: '辅助',
      };
      return mapping[role] || '输出';
    }

    function mergeSpecialFlags(existing, additions = []) {
      const set = new Set(
        String(existing || '无')
          .split(/[\/、,，\s]+/)
          .filter(Boolean)
          .filter(flag => flag !== '无'),
      );
      (additions || []).forEach(flag => {
        if (flag && flag !== '无') set.add(flag);
      });
      return set.size > 0 ? Array.from(set).join('/') : '无';
    }

    function formatCostObjectToString(costObj) {
      if (!costObj || typeof costObj !== 'object') return '无';
      const buildPart = obj =>
        [
          obj?.魂力 ? `魂力:${obj.魂力}` : '',
          obj?.体力 ? `体力:${obj.体力}` : '',
          obj?.精神力 ? `精神力:${obj.精神力}` : '',
        ]
          .filter(Boolean)
          .join(' ') || '无';
      const upfront = buildPart(costObj.启动 || costObj.upfront || {});
      const sustain = buildPart(costObj.维持 || costObj.sustain || {});
      return sustain !== '无' ? `${upfront} 维持:${sustain}` : upfront;
    }

    function deepClone(data) {
      return data == null ? data : JSON.parse(JSON.stringify(data));
    }

    function formatBattleCultivationLevelText(value, fallback = '0') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        if (Math.abs(parsed - 99.5) < 0.001) return '准神';
        return String(parsed);
      }
      const text = String(value ?? '').trim();
      return text || fallback;
    }

    function getSpiritNameList(char) {
      return Object.values(char?.spirit || {})
        .map(sp => sp?.表象名称 || '')
        .filter(Boolean);
    }

    function isSpecialSupportMartialSoul(char) {
      return getSpiritNameList(char).some(name => /^[七九]/.test(String(name || '')));
    }

    function getSupportEffectScale(caster, target) {
      if (isSpecialSupportMartialSoul(caster)) return 1;
      const casterSp = Math.max(1, caster?.sp_max || 1);
      const targetSp = Math.max(1, target?.sp_max || 1);
      return Math.min(casterSp / targetSp, 2.0);
    }

    function getSupportCostScale(caster, target) {
      if (!isSpecialSupportMartialSoul(caster)) return 1;
      const casterSp = Math.max(1, caster?.sp_max || 1);
      const targetSp = Math.max(1, target?.sp_max || 1);
      return Math.min(targetSp / casterSp, 2.0);
    }

    function getSoulDriveScale(attacker, defender) {
      return Math.max(1, attacker?.sp_max || 1) / Math.max(1, defender?.sp_max || 1);
    }

    function isSupportLikeSkill(skill) {
      const mainType = inferMainTypeFromEffects(skill) || '';
      const skillType = normalizeSkillTypeLabel(skill?.技能类型 || inferSkillTypeFromEffects(skill));
      return ['增益类', '回复类', '防御类'].includes(mainType) || ['辅助', '防御'].includes(skillType);
    }

    function createEmptyCombatEffectMap() {
      return {
        skip_turn: false,
        cannot_react: false,
        dot_damage: 0,
        armor_pen: 0,
        reaction_bonus: 0,
        reaction_penalty: 0,
        attacker_speed_bonus: 0,
        cast_speed_bonus: 0,
        cast_speed_penalty: 0,
        hit_bonus: 0,
        hit_penalty: 0,
        dodge_bonus: 0,
        dodge_penalty: 0,
        lock_level: 0,
        control_success_bonus: 0,
        control_success_penalty: 0,
        control_resist_mult: 1.0,
        control_resist_bonus: 0,
        interrupt_bonus: 0,
        final_damage_mult: 1.0,
        final_damage_bonus: 0,
        final_heal_mult: 1.0,
        final_heal_bonus: 0,
        shield_gain_mult: 1.0,
        shield_gain_bonus: 0,
        sp_gain_ratio: 0,
        men_gain_ratio: 0,
        heal_block_ratio: 0,
        hot_heal_ratio: 0,
        resource_block_ratio: 0,
        min_hp_floor: 0,
        death_save_count: 0,
        bonus_true_damage_ratio: 0,
        life_steal_ratio: 0,
        silence: false,
        disarm: false,
        blind: false,
        counter_attack_ratio: 0,
        damage_reduction: 0,
        block_count: 0,
        super_armor: false,
      };
    }

    function mergeCombatEffectMaps(base = createEmptyCombatEffectMap(), incoming = {}) {
      const seed = createEmptyCombatEffectMap();
      const result = { ...seed, ...(base || {}) };
      Object.entries(incoming || {}).forEach(([key, value]) => {
        if (!(key in seed) || value === undefined) return;
        if (['skip_turn', 'cannot_react', 'silence', 'disarm', 'blind', 'super_armor'].includes(key)) {
          result[key] = !!result[key] || !!value;
          return;
        }
        if (['control_resist_mult', 'final_damage_mult', 'final_heal_mult', 'shield_gain_mult'].includes(key)) {
          result[key] = Number(result[key] ?? 1) * Number(value ?? 1);
          return;
        }
        if (['lock_level', 'death_save_count', 'block_count', 'min_hp_floor'].includes(key)) {
          result[key] = Math.max(Number(result[key] ?? 0), Number(value ?? 0));
          return;
        }
        result[key] = Number(result[key] ?? 0) + Number(value ?? 0);
      });
      return result;
    }

    function hasMeaningfulCombatEffect(effectMap = {}) {
      const seed = createEmptyCombatEffectMap();
      return Object.keys(seed).some(key => {
        if (['skip_turn', 'cannot_react', 'silence', 'disarm', 'blind', 'super_armor'].includes(key)) {
          return !!effectMap[key];
        }
        const baseValue = Number(seed[key] ?? 0);
        const nextValue = Number(effectMap[key] ?? seed[key] ?? 0);
        return nextValue !== baseValue;
      });
    }

    const BATTLE_SKILL_SUMMARY_EFFECT_MECHANISMS = new Set([
      '属性摘要',
      '构型摘要',
      '术式摘要',
      '极性摘要',
      '属性系数摘要',
    ]);

    function isBattleSkillSummaryEffect(effect = {}) {
      const mechanism = String(effect?.机制 || '').trim();
      return !!mechanism && (BATTLE_SKILL_SUMMARY_EFFECT_MECHANISMS.has(mechanism) || effect?.summaryOnly === true);
    }

    function getBattleSkillSummaryEffects(skill = {}) {
      const rawEffects = Array.isArray(skill?._效果数组) ? skill._效果数组 : [];
      return rawEffects.filter(effect => effect && typeof effect === 'object' && isBattleSkillSummaryEffect(effect));
    }

    function getBattleSkillSummaryEffectByMechanism(skill = {}, mechanism = '') {
      const target = String(mechanism || '').trim();
      if (!target) return null;
      return getBattleSkillSummaryEffects(skill).find(effect => String(effect?.机制 || '').trim() === target) || null;
    }

    function getSkillEffects(skill) {
      const rawEffects = (Array.isArray(skill?._效果数组) ? skill._效果数组 : []).filter(
        effect => !isBattleSkillSummaryEffect(effect),
      );
      const creationEffects = rawEffects.filter(effect =>
        ['生成造物', '造物生成'].includes(String(effect?.机制 || '')),
      );
      if (!creationEffects.length) return rawEffects;
      const systemEffects = rawEffects.filter(effect => effect?.机制 === '系统基础');
      const usageEffects = creationEffects.flatMap(effect => (Array.isArray(effect?.使用效果) ? effect.使用效果 : []));
      return [...systemEffects, ...usageEffects];
    }

    const BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF = Object.freeze({
      掌控: 1,
      威力: 1,
      消耗: 1,
      前摇: 1,
      控制: 1,
      速度: 1,
    });
    const BATTLE_SKILL_ATTRIBUTE_COEFF_MAP = Object.freeze({
      金: Object.freeze({ 掌控: 1.02, 威力: 1.08, 消耗: 1.0, 前摇: 0.98, 控制: 0.98, 速度: 1.02 }),
      木: Object.freeze({ 掌控: 1.08, 威力: 0.96, 消耗: 0.96, 前摇: 1.0, 控制: 1.05, 速度: 1.0 }),
      水: Object.freeze({ 掌控: 1.06, 威力: 0.98, 消耗: 0.95, 前摇: 1.0, 控制: 1.04, 速度: 1.0 }),
      火: Object.freeze({ 掌控: 0.96, 威力: 1.15, 消耗: 1.06, 前摇: 1.0, 控制: 0.95, 速度: 1.02 }),
      土: Object.freeze({ 掌控: 1.0, 威力: 1.05, 消耗: 1.0, 前摇: 1.04, 控制: 1.02, 速度: 0.95 }),
      雷: Object.freeze({ 掌控: 1.0, 威力: 1.1, 消耗: 1.03, 前摇: 0.92, 控制: 0.98, 速度: 1.12 }),
      冰: Object.freeze({ 掌控: 1.04, 威力: 1.02, 消耗: 1.0, 前摇: 1.02, 控制: 1.12, 速度: 0.95 }),
      风: Object.freeze({ 掌控: 1.0, 威力: 1.02, 消耗: 0.96, 前摇: 0.94, 控制: 0.98, 速度: 1.12 }),
      光: Object.freeze({ 掌控: 1.05, 威力: 1.03, 消耗: 0.98, 前摇: 0.98, 控制: 1.02, 速度: 1.0 }),
      暗: Object.freeze({ 掌控: 1.03, 威力: 1.08, 消耗: 1.02, 前摇: 0.98, 控制: 1.04, 速度: 1.0 }),
      空间: Object.freeze({ 掌控: 1.12, 威力: 1.0, 消耗: 1.08, 前摇: 0.96, 控制: 1.08, 速度: 1.02 }),
      创造: Object.freeze({ 掌控: 1.18, 威力: 1.12, 消耗: 1.1, 前摇: 1.0, 控制: 1.12, 速度: 1.0 }),
      毁灭: Object.freeze({ 掌控: 1.08, 威力: 1.22, 消耗: 1.14, 前摇: 1.04, 控制: 1.08, 速度: 0.98 }),
    });

    function normalizeBattleSkillAttributeToken(value = '') {
      const raw = String(value || '').trim();
      if (!raw || raw === '无') return '';
      const aliasMap = {
        金系: '金',
        木系: '木',
        水系: '水',
        火系: '火',
        土系: '土',
        雷系: '雷',
        冰系: '冰',
        风系: '风',
        光系: '光',
        暗系: '暗',
        空间系: '空间',
        创造系: '创造',
        毁灭系: '毁灭',
        光明: '光',
        黑暗: '暗',
        创世: '创造',
        灭世: '毁灭',
      };
      const normalized = aliasMap[raw] || raw;
      return BATTLE_SKILL_ATTRIBUTE_COEFF_MAP[normalized] ? normalized : '';
    }

    function normalizeBattleSkillAttributeTokens(list = []) {
      const source = Array.isArray(list) ? list : [];
      return Array.from(new Set(source.map(normalizeBattleSkillAttributeToken).filter(Boolean)));
    }

    const BATTLE_FUSION_BASE_ELEMENTS = Object.freeze(['水', '火', '风', '土']);
    const BATTLE_FUSION_ADVANCED_ELEMENTS = Object.freeze(['光', '暗', '空间']);
    const BATTLE_FUSION_LAW_ELEMENTS = Object.freeze(['创造', '毁灭']);
    const BATTLE_FUSION_ALLOWED_ELEMENTS = Object.freeze([
      ...BATTLE_FUSION_BASE_ELEMENTS,
      ...BATTLE_FUSION_ADVANCED_ELEMENTS,
      ...BATTLE_FUSION_LAW_ELEMENTS,
    ]);
    const BATTLE_FUSION_ELEMENT_ORDER = Object.freeze([...BATTLE_FUSION_ALLOWED_ELEMENTS]);
    const BATTLE_FUSION_SEMANTICS_MAP = Object.freeze({
      '水/火': Object.freeze({
        pattern: '水火蒸爆',
        multiplier: 1.18,
        failAdjust: 8,
        summary: '水火相激形成高压蒸爆，爆发显著提升。',
      }),
      '水/风': Object.freeze({
        pattern: '水风涡流',
        multiplier: 1.1,
        failAdjust: -4,
        summary: '水借风势形成涡流，融合稳定性更高。',
      }),
      '水/土': Object.freeze({
        pattern: '水土泽域',
        multiplier: 1.08,
        failAdjust: -2,
        summary: '水土交汇形成泥泽领域，控场更稳。',
      }),
      '火/风': Object.freeze({
        pattern: '火风炎岚',
        multiplier: 1.16,
        failAdjust: 6,
        summary: '烈焰借风成势，形成高速扩张的炎岚。',
      }),
      '冰/风': Object.freeze({
        pattern: '冰风霜灾',
        multiplier: 1.14,
        failAdjust: 2,
        summary: '寒流被风卷起，形成持续冻结的霜灾。',
      }),
      '光/暗': Object.freeze({
        pattern: '光暗蚀变',
        multiplier: 1.22,
        failAdjust: 12,
        summary: '光暗对冲本身就足够危险，容易形成湮灭蚀变。',
      }),
      '水/火/风': Object.freeze({
        pattern: '水火风暴',
        multiplier: 1.28,
        failAdjust: 10,
        summary: '蒸爆被风势卷起，形成持续爆裂风暴。',
      }),
      '水/土/风': Object.freeze({
        pattern: '水土风岚·泽域封场',
        multiplier: 1.18,
        failAdjust: 3,
        summary: '泥泽、气流与水势叠加，形成范围封场。',
      }),
      '水/火/土': Object.freeze({
        pattern: '水火土·蒸压熔壳',
        multiplier: 1.22,
        failAdjust: 8,
        summary: '蒸压与土壳并存，兼具压制与爆裂。',
      }),
      '水/火/风/土': Object.freeze({
        pattern: '四象归元·雷霆显化',
        multiplier: 1.24,
        failAdjust: 16,
        summary: '四基础元素归元后显化法则性雷霆，这不是普通雷属性，而是四象归一后的法则征兆。并且已可触发元素剥离。',
        derivedEffects: ['元素剥离'],
      }),
      '光/暗/空间': Object.freeze({
        pattern: '光暗空间·界域扭变',
        multiplier: 1.35,
        failAdjust: 14,
        summary: '光暗对冲叠加空间扭曲，形成界域级压制。',
      }),
      '水/火/风/土/光/暗/空间': Object.freeze({
        pattern: '七元素爆裂',
        multiplier: 1.38,
        failAdjust: 28,
        summary: '四基础元素与三进阶元素同时贯通，踏入真正的七元素爆裂台阶。',
      }),
      '创造/毁灭': Object.freeze({
        pattern: '创造毁灭·法则对冲',
        multiplier: 1.45,
        failAdjust: 18,
        summary: '法则互冲带来极高上限，也伴随极高失控风险。',
      }),
      '光/暗/创造/毁灭': Object.freeze({
        pattern: '光暗双法则·湮生对撞',
        multiplier: 1.6,
        failAdjust: 24,
        summary: '光暗对冲叠加双法则冲撞，接近失控边缘的极限融合。',
      }),
    });

    function sortBattleFusionElements(elements = []) {
      const normalized = normalizeBattleSkillAttributeTokens(elements).filter(token =>
        BATTLE_FUSION_ALLOWED_ELEMENTS.includes(token),
      );
      consnst orderIndex = token => {
        const index = BATTLE_FUSION_ELEMENT_ORDER.indexOf(token);
        return index >= 0 ? index : BATTLE_FUSION_ELEMENT_ORDER.length + token.charCodeAt(0);
      };
      return [...normalized].sort((a, b) => orderIndex(a) - orderIndex(b));
    }

    function buildBattleFusionKey(elements = []) {
      return sortBattleFusionElements(elements).join('/');
    }

    function resolveBattleFusionSemantics(elements = []) {
      const normalized = sortBattleFusionElements(elements);
      const key = normalized.join('/');
      const preset = BATTLE_FUSION_SEMANTICS_MAP[key];
      let multiplier = Number(preset?.multiplier || 1);
      let failAdjust = Number(preset?.failAdjust || 0);
      let pattern = String(preset?.pattern || (normalized.length ? normalized.join('/') : '未指定'));
      let summary = String(
        preset?.summary || (normalized.length ? `${normalized.join('/')} 并行融合。` : '未指定元素融合。'),
      );
      const derivedEffects = normalizeBattleSkillStringArray(preset?.derivedEffects || []);
      const hasLaw = normalized.some(token => token === '创造' || token === '毁灭');
      const hasSpace = normalized.includes('空间');
      const hasLightDark = normalized.includes('光') && normalized.includes('暗');
      if (!preset && hasSpace) {
        multiplier *= 1.08;
        failAdjust += 4;
        summary += ' 空间参与抬高融合上限。';
      }
      if (!preset && hasLightDark) {
        multiplier *= 1.1;
        failAdjust += 6;
        summary += ' 光暗对冲令结构更危险。';
      }
      if (!preset && hasLaw) {
        const lawCount = normalized.filter(token => token === '创造' || token === '毁灭').length;
        multiplier *= 1 + lawCount * 0.12;
        failAdjust += lawCount * 10;
        summary += ' 法则元素参与显著抬高上限与风险。';
      }
      return { key, elements: normalized, pattern, multiplier, failAdjust, summary, derivedEffects };
    }

    function extractBattleFusionElementsFromText(raw = '') {
      const text = String(raw || '').trim();
      if (!text) return [];
      if (/七元素/.test(text)) return [...BATTLE_FUSION_BASE_ELEMENTS, ...BATTLE_FUSION_ADVANCED_ELEMENTS];
      if (/四元素/.test(text)) return [...BATTLE_FUSION_BASE_ELEMENTS];
      const directMatches = [];
      ['创造', '毁灭', '空间', '光明', '黑暗', '创世', '灭世', '水', '火', '土', '风', '光', '暗'].forEach(token => {
        if (text.includes(token)) directMatches.push(normalizeBattleSkillAttributeToken(token));
      });
      const cleaned = text
        .replace(/多元素融合|元素融合|融合技|融合|蓄力|极致|调用|使用|释放|施展/g, ' ')
        .replace(/[、,，|｜/＋+]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const splitMatches = cleaned
        ? cleaned
            .split(' ')
            .map(normalizeBattleSkillAttributeToken)
            .filter(token => token && BATTLE_FUSION_ALLOWED_ELEMENTS.includes(token))
        : [];
      return Array.from(new Set([...directMatches, ...splitMatches].filter(Boolean)));
    }

    function buildBattleFusionPattern(elements = []) {
      return resolveBattleFusionSemantics(elements).pattern;
    }

    function collectBattleUnlockedAttributeTokens(char = {}) {
      const collected = [];
      Object.values(char?.spirit || {}).forEach(spiritData => {
        const unlocked = Array.isArray(spiritData?.已解锁调用权) ? spiritData.已解锁调用权 : [];
        collected.push(...normalizeBattleSkillAttributeTokens(unlocked));
      });
      const bloodlineUnlocked = Array.isArray(char?.bloodline_power?.已解锁调用权)
        ? char.bloodline_power.已解锁调用权
        : [];
      collected.push(...normalizeBattleSkillAttributeTokens(bloodlineUnlocked));
      return Array.from(new Set(collected));
    }

    function hasBattleUnlockedAttributeSet(char = {}, required = []) {
      const unlocked = new Set(collectBattleUnlockedAttributeTokens(char));
      return normalizeBattleSkillAttributeTokens(required).every(token => unlocked.has(token));
    }

    function normalizeBattleSkillAttributeCoefficients(value = {}) {
      const normalized = { ...BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF };
      Object.keys(BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF).forEach(key => {
        const raw = Number(value?.[key] ?? BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF[key]);
        normalized[key] = Number.isFinite(raw) && raw > 0 ? raw : BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF[key];
      });
      return normalized;
    }

    function normalizeBattleSkillStringArray(value = []) {
      const source = Array.isArray(value) ? value : [];
      return Array.from(new Set(source.map(item => String(item || '').trim()).filter(Boolean)));
    }

    function normalizeBattleSkillAttributeSource(value = '') {
      const text = String(value || '').trim();
      return ['自身操控', '魂技调用'].includes(text) ? text : '无';
    }

    function normalizeBattleSkillRole(value = '') {
      const text = String(value || '').trim();
      return ['增幅器', '结构术式'].includes(text) ? text : '无';
    }

    function normalizeBattleSkillElementStructure(value = {}) {
      const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
      return {
        模式: String(source?.模式 || '无').trim() || '无',
        核心元素: normalizeBattleSkillAttributeTokens(source?.核心元素),
        驱动元素: normalizeBattleSkillAttributeTokens(source?.驱动元素),
        约束元素: normalizeBattleSkillAttributeTokens(source?.约束元素),
        触发元素: normalizeBattleSkillAttributeTokens(source?.触发元素),
        关系: Array.isArray(source?.关系) ? deepClone(source.关系) : [],
      };
    }

    function normalizeBattleSkillWuxingInvocation(value = {}) {
      const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
      return {
        模式: String(source?.模式 || '无').trim() || '无',
        调用链: normalizeBattleSkillStringArray(source?.调用链),
        回路闭合: !!source?.回路闭合,
        层级回溯: normalizeBattleSkillStringArray(source?.层级回溯),
        终态: String(source?.终态 || '无').trim() || '无',
        结果: String(source?.结果 || '无').trim() || '无',
      };
    }

    function normalizeBattleSkillPolarityInfo(value = {}) {
      const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
      return {
        polarityUnlocked: !!source?.polarityUnlocked,
        polarityMode: String(source?.polarityMode || source?.polarity || '无').trim() || '无',
      };
    }

    function getBattleSkillAttributeSummary(skill = {}) {
      return getBattleSkillSummaryEffectByMechanism(skill, '属性摘要') || {};
    }

    function getBattleSkillAttributeSource(skill = {}) {
      return normalizeBattleSkillAttributeSource(getBattleSkillAttributeSummary(skill)?.属性来源 || '');
    }

    function getBattleSkillRole(skill = {}) {
      return normalizeBattleSkillRole(getBattleSkillAttributeSummary(skill)?.魂技作用 || '');
    }

    function getBattleSkillElementStructure(skill = {}) {
      return normalizeBattleSkillElementStructure(getBattleSkillSummaryEffectByMechanism(skill, '构型摘要') || {});
    }

    function getBattleSkillWuxingInvocation(skill = {}) {
      return normalizeBattleSkillWuxingInvocation(getBattleSkillSummaryEffectByMechanism(skill, '术式摘要') || {});
    }

    function getBattleSkillPolaritySummary(skill = {}) {
      return normalizeBattleSkillPolarityInfo(getBattleSkillSummaryEffectByMechanism(skill, '极性摘要') || {});
    }

    function getBattleSkillRuntimeAttributeCoefficients(skill = {}) {
      const summary = getBattleSkillSummaryEffectByMechanism(skill, '属性系数摘要');
      return normalizeBattleSkillAttributeCoefficients(summary?.系数 || summary?.属性系数 || {});
    }

    function getBattleSkillDisplayElement(skill = {}) {
      const explicit = String(getBattleSkillAttributeSummary(skill)?.显示元素 || '').trim();
      if (explicit) return explicit;
      const attached = normalizeBattleSkillAttributeTokens(skill?.附带属性);
      return attached.length ? attached.join('/') : '无';
    }

    function hasBattleSkillAttributeStructure(skill = {}) {
      const elementStructure = getBattleSkillElementStructure(skill);
      const wuxingInvocation = getBattleSkillWuxingInvocation(skill);
      const polarityInfo = getBattleSkillPolaritySummary(skill);
      return (
        getBattleSkillAttributeSource(skill) !== '无' ||
        getBattleSkillRole(skill) !== '无' ||
        elementStructure.模式 !== '无' ||
        elementStructure.核心元素.length > 0 ||
        elementStructure.驱动元素.length > 0 ||
        elementStructure.约束元素.length > 0 ||
        elementStructure.触发元素.length > 0 ||
        elementStructure.关系.length > 0 ||
        wuxingInvocation.模式 !== '无' ||
        wuxingInvocation.调用链.length > 0 ||
        wuxingInvocation.回路闭合 ||
        wuxingInvocation.层级回溯.length > 0 ||
        wuxingInvocation.终态 !== '无' ||
        wuxingInvocation.结果 !== '无' ||
        polarityInfo.polarityUnlocked ||
        polarityInfo.polarityMode !== '无'
      );
    }

    function mergeBattleSkillAttributeCoefficientProfiles(list = []) {
      const profiles = (Array.isArray(list) ? list : []).map(profile =>
        normalizeBattleSkillAttributeCoefficients(profile || {}),
      );
      if (!profiles.length) return normalizeBattleSkillAttributeCoefficients();
      const merged = {};
      Object.keys(BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF).forEach(key => {
        merged[key] = profiles.reduce((sum, profile) => sum + Number(profile?.[key] ?? 1), 0) / profiles.length;
      });
      return normalizeBattleSkillAttributeCoefficients(merged);
    }

    function buildBattleSkillAttributeCoefficientsFromAttachedAttributes(attachedAttributes = []) {
      const attached = normalizeBattleSkillAttributeTokens(attachedAttributes);
      if (!attached.length) return normalizeBattleSkillAttributeCoefficients();
      return mergeBattleSkillAttributeCoefficientProfiles(
        attached.map(attr => BATTLE_SKILL_ATTRIBUTE_COEFF_MAP[attr] || BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF),
      );
    }

    function resolveBattleSkillAttributeCoefficients(skill = {}) {
      const attached = normalizeBattleSkillAttributeTokens(skill?.附带属性);
      const hasV2Structure = hasBattleSkillAttributeStructure(skill);
      if (!attached.length)
        return hasV2Structure
          ? getBattleSkillRuntimeAttributeCoefficients(skill)
          : normalizeBattleSkillAttributeCoefficients();
      if (hasV2Structure) return getBattleSkillRuntimeAttributeCoefficients(skill);
      return buildBattleSkillAttributeCoefficientsFromAttachedAttributes(attached);
    }

    function isNeutralBattleSkillAttributeCoefficients(coeff = {}) {
      const normalized = normalizeBattleSkillAttributeCoefficients(coeff);
      return Object.keys(BATTLE_SKILL_DEFAULT_ATTRIBUTE_COEFF).every(
        key => Math.abs(Number(normalized[key] || 1) - 1) < 0.0001,
      );
    }

    function roundBattleScaledNumber(value, digits = 2) {
      const num = Number(value);
      if (!Number.isFinite(num)) return 0;
      const scaled = Number(num.toFixed(digits));
      return Number.isInteger(scaled) ? Math.trunc(scaled) : scaled;
    }

    function scaleBattleValue(value, ratio = 1, options = {}) {
      const num = Number(value);
      if (!Number.isFinite(num)) return value;
      let next = num * Number(ratio || 1);
      if (options.min !== undefined) next = Math.max(Number(options.min), next);
      if (options.max !== undefined) next = Math.min(Number(options.max), next);
      return roundBattleScaledNumber(next, options.digits ?? 2);
    }

    function scaleBattleFactor(value, ratio = 1, neutral = 1) {
      const num = Number(value);
      if (!Number.isFinite(num)) return value;
      return roundBattleScaledNumber(Number(neutral) + (num - Number(neutral)) * Number(ratio || 1), 4);
    }

    function scaleBattleLockLevel(value, ratio = 1) {
      const num = Number(value || 0);
      if (!(num > 0)) return 0;
      return Math.max(1, Math.round(num * Number(ratio || 1)));
    }

    function scaleBattleDebuffRatio(value, ratio = 1, neutral = 1) {
      const num = Number(value);
      if (!Number.isFinite(num)) return value;
      return roundBattleScaledNumber(Number(neutral) - (Number(neutral) - num) * Number(ratio || 1), 4);
    }

    function scaleSkillCostText(costText, ratio = 1) {
      const text = String(costText || '').trim();
      if (!text || text === '无' || Math.abs(Number(ratio || 1) - 1) < 0.0001) return text || '无';
      return text.replace(
        /(\d+(?:\.\d+)?)(%?)/g,
        (_, numText, suffix) =>
          `${roundBattleScaledNumber(Number(numText) * Number(ratio || 1), suffix ? 2 : 0)}${suffix}`,
      );
    }

    function ensureBattleSkillAttributeBase(skill = {}) {
      if (skill?.__attributeCoeffBase && Array.isArray(skill.__attributeCoeffBase.effects))
        return skill.__attributeCoeffBase;
      const systemBase = getSystemBaseEffect(skill);
      const rawCostText =
        typeof skill?.消耗 === 'object' ? formatCostObjectToString(skill.消耗) : String(skill?.消耗 || '').trim();
      const systemCostText =
        typeof systemBase?.消耗 === 'object'
          ? formatCostObjectToString(systemBase.消耗)
          : String(systemBase?.消耗 || '').trim();
      const base = {
        effects: deepClone(skill?._效果数组 || []),
        cast_time: Number(skill?.cast_time ?? systemBase?.cast_time ?? 0) || 0,
        cost_text: (rawCostText && rawCostText !== '无' ? rawCostText : systemCostText || rawCostText || '无') || '无',
      };
      skill.__attributeCoeffBase = deepClone(base);
      return skill.__attributeCoeffBase;
    }

    function ensureBattleTransientStateEffect(skill = {}) {
      if (!Array.isArray(skill._效果数组)) skill._效果数组 = [];
      let stateEffect = skill._效果数组.find(effect => effect?.机制 === '状态挂载');
      if (!stateEffect) {
        const targetText = String(skill?.对象 || getSystemBaseEffect(skill)?.对象 || '敌方/单体') || '敌方/单体';
        stateEffect = {
          机制: '状态挂载',
          状态名称: '无',
          目标: targetText,
          对象: targetText,
          持续回合: 0,
          面板修改比例: {},
          计算层效果: createEmptyCombatEffectMap(),
        };
        skill._效果数组.push(stateEffect);
      }
      if (!stateEffect.状态名称 || !String(stateEffect.状态名称).trim()) stateEffect.状态名称 = '无';
      if (!stateEffect.目标)
        stateEffect.目标 = String(skill?.对象 || getSystemBaseEffect(skill)?.对象 || '敌方/单体') || '敌方/单体';
      if (!stateEffect.对象) stateEffect.对象 = stateEffect.目标;
      if (
        !stateEffect.面板修改比例 ||
        typeof stateEffect.面板修改比例 !== 'object' ||
        Array.isArray(stateEffect.面板修改比例)
      )
        stateEffect.面板修改比例 = {};
      stateEffect.计算层效果 = mergeCombatEffectMaps(createEmptyCombatEffectMap(), stateEffect.计算层效果 || {});
      return stateEffect;
    }

    function applyAttributeCoeffToCombatSkill(skill = {}) {
      if (!skill || typeof skill !== 'object') return skill;
      const base = ensureBattleSkillAttributeBase(skill);
      skill._效果数组 = deepClone(base.effects || []);
      skill.cast_time = Number(base.cast_time ?? 0) || 0;
      skill.消耗 = String(base.cost_text || '无') || '无';

      const attached = normalizeBattleSkillAttributeTokens(skill?.附带属性);
      const hasV2Structure = hasBattleSkillAttributeStructure(skill);
      skill.附带属性 = attached;
      ['属性系数', '属性来源', '魂技作用', '元素构型', '五行调用结构', '极性信息', '元素'].forEach(key => {
        if (key in skill) delete skill[key];
      });
      const coeff = resolveBattleSkillAttributeCoefficients(skill);

      if ((!attached.length && !hasV2Structure) || isNeutralBattleSkillAttributeCoefficients(coeff)) return skill;

      const normalizedCoeff = normalizeBattleSkillAttributeCoefficients(coeff);
      const effects = Array.isArray(skill._效果数组) ? skill._效果数组 : [];
      const systemBase = effects.find(effect => effect?.机制 === '系统基础');
      const directDamageMechanisms = new Set(['直接伤害', '多段伤害', '持续伤害', '延迟爆发']);

      if (systemBase) {
        const baseCostText = String(systemBase.消耗 || skill.消耗 || '无') || '无';
        const scaledCostText = scaleSkillCostText(baseCostText, normalizedCoeff.消耗);
        systemBase.消耗 = scaledCostText;
        skill.消耗 = scaledCostText;
        const baseCastTime = Number(systemBase.cast_time ?? skill.cast_time ?? 0) || 0;
        const scaledCastTime = Math.max(baseCastTime > 0 ? 1 : 0, Math.round(baseCastTime * normalizedCoeff.前摇));
        systemBase.cast_time = scaledCastTime;
        skill.cast_time = scaledCastTime;
      } else {
        skill.消耗 = scaleSkillCostText(skill.消耗, normalizedCoeff.消耗);
        skill.cast_time = Math.max(
          skill.cast_time > 0 ? 1 : 0,
          Math.round(Number(skill.cast_time || 0) * normalizedCoeff.前摇),
        );
      }

      effects.forEach(effect => {
        const mechanism = String(effect?.机制 || effect?.名称 || effect?.类型 || '');
        if (!mechanism) return;

        if (directDamageMechanisms.has(mechanism) && effect.威力倍率 !== undefined) {
          effect.威力倍率 = scaleBattleValue(effect.威力倍率, coeff.威力, { min: 0, digits: 2 });
        }
        if (['流血DOT', '持续伤害DOT'].includes(mechanism)) {
          if (effect.dot_damage !== undefined)
            effect.dot_damage = scaleBattleValue(effect.dot_damage, coeff.威力, { min: 0, digits: 2 });
          if (effect.每回合伤害 !== undefined)
            effect.每回合伤害 = scaleBattleValue(effect.每回合伤害, coeff.威力, { min: 0, digits: 2 });
        }
        if (mechanism === '护盾' && effect.护盾值 !== undefined) {
          effect.护盾值 = scaleBattleValue(effect.护盾值, coeff.威力, { min: 0, digits: 0 });
        }
        if (mechanism === '属性变化' && effect.数值 !== undefined) {
          const property = String(effect.属性 || '').trim();
          const action = String(effect.动作 || '').trim();
          if (action === '加值' && ['vit', 'sp', 'men'].includes(property)) {
            effect.数值 = scaleBattleValue(effect.数值, coeff.威力, { min: 0, digits: 4 });
          } else if (['倍率提升', '倍率压制'].includes(action)) {
            const factor =
              property === '掌控'
                ? coeff.掌控
                : property === '控制'
                  ? coeff.控制
                  : property === '速度'
                    ? coeff.速度
                    : property === '前摇'
                      ? coeff.前摇
                      : property === '消耗'
                        ? coeff.消耗
                        : coeff.威力;
            effect.数值 =
              action === '倍率压制'
                ? scaleBattleDebuffRatio(effect.数值, factor, 1)
                : scaleBattleFactor(effect.数值, factor, 1);
          }
        }
        if (mechanism === '持续恢复' && effect.数值 !== undefined) {
          effect.数值 = scaleBattleValue(effect.数值, coeff.威力, { min: 0, digits: 4 });
        }
        if (mechanism === '消耗修正' && effect.数值 !== undefined) {
          effect.数值 =
            String(effect.动作 || '').trim() === '消耗提高'
              ? scaleBattleFactor(effect.数值, coeff.消耗, 1)
              : scaleBattleDebuffRatio(effect.数值, coeff.消耗, 1);
        }
        if (mechanism === '前摇修正' && effect.数值 !== undefined) {
          effect.数值 =
            String(effect.动作 || '').trim() === '前摇拉长'
              ? scaleBattleFactor(effect.数值, coeff.前摇, 1)
              : scaleBattleDebuffRatio(effect.数值, coeff.前摇, 1);
        }
        if (mechanism === '掌控修正' && effect.数值 !== undefined) {
          effect.数值 =
            String(effect.动作 || '').trim() === '倍率压制'
              ? scaleBattleDebuffRatio(effect.数值, coeff.掌控, 1)
              : scaleBattleFactor(effect.数值, coeff.掌控, 1);
        }
        if (mechanism === '速度修正' && effect.数值 !== undefined) {
          effect.数值 =
            String(effect.动作 || '').trim() === '倍率压制'
              ? scaleBattleDebuffRatio(effect.数值, coeff.速度, 1)
              : scaleBattleFactor(effect.数值, coeff.速度, 1);
        }
        if (mechanism === '打断' && effect.中断概率 !== undefined) {
          effect.中断概率 = scaleBattleValue(effect.中断概率, coeff.控制, { min: 0, max: 1, digits: 4 });
        }
        if (mechanism === '减速' && effect.agi_ratio !== undefined) {
          effect.agi_ratio = scaleBattleDebuffRatio(effect.agi_ratio, coeff.控制, 1);
        }
        if (mechanism === '软控') {
          if (effect.reaction_penalty !== undefined)
            effect.reaction_penalty = scaleBattleValue(effect.reaction_penalty, coeff.控制, { digits: 4 });
          if (effect.cast_speed_penalty !== undefined)
            effect.cast_speed_penalty = scaleBattleValue(effect.cast_speed_penalty, coeff.控制, { digits: 4 });
          if (effect.dodge_penalty !== undefined)
            effect.dodge_penalty = scaleBattleValue(effect.dodge_penalty, coeff.控制, { digits: 4 });
        }
        if (mechanism === '位移限制') {
          if (effect.reaction_penalty !== undefined)
            effect.reaction_penalty = scaleBattleValue(effect.reaction_penalty, coeff.控制, { digits: 4 });
          if (effect.dodge_penalty !== undefined)
            effect.dodge_penalty = scaleBattleValue(effect.dodge_penalty, coeff.控制, { digits: 4 });
          if (effect.lock_level !== undefined) effect.lock_level = scaleBattleLockLevel(effect.lock_level, coeff.控制);
        }
        if (['强制位移', '位移交换', '强制绑定/锁定'].includes(mechanism)) {
          if (effect.dodge_penalty !== undefined)
            effect.dodge_penalty = scaleBattleValue(effect.dodge_penalty, coeff.控制, { digits: 4 });
          if (effect.reaction_penalty !== undefined)
            effect.reaction_penalty = scaleBattleValue(effect.reaction_penalty, coeff.控制, { digits: 4 });
          if (effect.lock_level !== undefined) effect.lock_level = scaleBattleLockLevel(effect.lock_level, coeff.控制);
        }
        if (mechanism === '标记弱点') {
          if (effect.final_damage_mult !== undefined)
            effect.final_damage_mult = scaleBattleFactor(effect.final_damage_mult, coeff.威力, 1);
          if (effect.dodge_penalty !== undefined)
            effect.dodge_penalty = scaleBattleValue(effect.dodge_penalty, coeff.控制, { digits: 4 });
          if (effect.lock_level !== undefined) effect.lock_level = scaleBattleLockLevel(effect.lock_level, coeff.控制);
        }
        if (mechanism === '禁疗' && effect.heal_block_ratio !== undefined) {
          effect.heal_block_ratio = scaleBattleValue(effect.heal_block_ratio, coeff.控制, {
            min: 0,
            max: 1,
            digits: 4,
          });
        }
        if (mechanism === '共享视野') {
          if (effect.reaction_bonus !== undefined)
            effect.reaction_bonus = scaleBattleValue(effect.reaction_bonus, coeff.速度, { digits: 4 });
          if (effect.hit_bonus !== undefined)
            effect.hit_bonus = scaleBattleValue(effect.hit_bonus, coeff.掌控, { digits: 4 });
          if (effect.lock_level !== undefined) effect.lock_level = scaleBattleLockLevel(effect.lock_level, coeff.掌控);
        }
        if (mechanism === '分身') {
          if (effect.dodge_bonus !== undefined)
            effect.dodge_bonus = scaleBattleValue(effect.dodge_bonus, coeff.速度, { digits: 4 });
          if (effect.attacker_speed_bonus !== undefined)
            effect.attacker_speed_bonus = scaleBattleValue(effect.attacker_speed_bonus, coeff.速度, { digits: 4 });
          if (effect.reaction_bonus !== undefined)
            effect.reaction_bonus = scaleBattleValue(effect.reaction_bonus, coeff.速度, { digits: 4 });
          if (effect.hit_bonus !== undefined)
            effect.hit_bonus = scaleBattleValue(effect.hit_bonus, coeff.掌控, { digits: 4 });
          if (effect.lock_level !== undefined) effect.lock_level = scaleBattleLockLevel(effect.lock_level, coeff.掌控);
          if (effect.final_damage_mult !== undefined)
            effect.final_damage_mult = scaleBattleFactor(effect.final_damage_mult, coeff.威力, 1);
        }
        if (mechanism === '自身位移') {
          if (effect.dodge_bonus !== undefined)
            effect.dodge_bonus = scaleBattleValue(effect.dodge_bonus, coeff.速度, { digits: 4 });
          if (effect.attacker_speed_bonus !== undefined)
            effect.attacker_speed_bonus = scaleBattleValue(effect.attacker_speed_bonus, coeff.速度, { digits: 4 });
          if (effect.reaction_bonus !== undefined)
            effect.reaction_bonus = scaleBattleValue(effect.reaction_bonus, coeff.速度, { digits: 4 });
        }
        if (mechanism === '追击位移') {
          if (effect.attacker_speed_bonus !== undefined)
            effect.attacker_speed_bonus = scaleBattleValue(effect.attacker_speed_bonus, coeff.速度, { digits: 4 });
          if (effect.hit_bonus !== undefined)
            effect.hit_bonus = scaleBattleValue(effect.hit_bonus, coeff.掌控, { digits: 4 });
          if (effect.final_damage_mult !== undefined)
            effect.final_damage_mult = scaleBattleFactor(effect.final_damage_mult, coeff.威力, 1);
        }
        if (mechanism === '脱离位移') {
          if (effect.dodge_bonus !== undefined)
            effect.dodge_bonus = scaleBattleValue(effect.dodge_bonus, coeff.速度, { digits: 4 });
          if (effect.cast_speed_bonus !== undefined)
            effect.cast_speed_bonus = scaleBattleValue(effect.cast_speed_bonus, coeff.速度, { digits: 4 });
          if (effect.reaction_bonus !== undefined)
            effect.reaction_bonus = scaleBattleValue(effect.reaction_bonus, coeff.速度, { digits: 4 });
        }
        if (mechanism === '状态挂载') {
          effect.计算层效果 = mergeCombatEffectMaps(createEmptyCombatEffectMap(), effect.计算层效果 || {});
          const calc = effect.计算层效果;
          if (calc.hit_bonus !== undefined)
            calc.hit_bonus = scaleBattleValue(calc.hit_bonus, coeff.掌控, { digits: 4 });
          if (calc.lock_level !== undefined) calc.lock_level = scaleBattleLockLevel(calc.lock_level, coeff.掌控);
          if (calc.final_damage_mult !== undefined)
            calc.final_damage_mult = scaleBattleFactor(calc.final_damage_mult, coeff.威力, 1);
          if (calc.final_damage_bonus !== undefined)
            calc.final_damage_bonus = scaleBattleValue(calc.final_damage_bonus, coeff.威力, { digits: 2 });
          if (calc.final_heal_mult !== undefined)
            calc.final_heal_mult = scaleBattleFactor(calc.final_heal_mult, coeff.威力, 1);
          if (calc.final_heal_bonus !== undefined)
            calc.final_heal_bonus = scaleBattleValue(calc.final_heal_bonus, coeff.威力, { digits: 2 });
          if (calc.shield_gain_mult !== undefined)
            calc.shield_gain_mult = scaleBattleFactor(calc.shield_gain_mult, coeff.威力, 1);
          if (calc.shield_gain_bonus !== undefined)
            calc.shield_gain_bonus = scaleBattleValue(calc.shield_gain_bonus, coeff.威力, { digits: 2 });
          if (calc.sp_gain_ratio !== undefined)
            calc.sp_gain_ratio = scaleBattleValue(calc.sp_gain_ratio, coeff.威力, { digits: 4 });
          if (calc.men_gain_ratio !== undefined)
            calc.men_gain_ratio = scaleBattleValue(calc.men_gain_ratio, coeff.威力, { digits: 4 });
          if (calc.dot_damage !== undefined)
            calc.dot_damage = scaleBattleValue(calc.dot_damage, coeff.威力, { min: 0, digits: 2 });
          if (calc.reaction_penalty !== undefined)
            calc.reaction_penalty = scaleBattleValue(calc.reaction_penalty, coeff.控制, { digits: 4 });
          if (calc.cast_speed_penalty !== undefined)
            calc.cast_speed_penalty = scaleBattleValue(calc.cast_speed_penalty, coeff.控制, { digits: 4 });
          if (calc.dodge_penalty !== undefined)
            calc.dodge_penalty = scaleBattleValue(calc.dodge_penalty, coeff.控制, { digits: 4 });
          if (calc.resource_block_ratio !== undefined)
            calc.resource_block_ratio = scaleBattleValue(calc.resource_block_ratio, coeff.控制, {
              min: 0,
              max: 1,
              digits: 4,
            });
          if (calc.control_success_bonus !== undefined)
            calc.control_success_bonus = scaleBattleValue(calc.control_success_bonus, coeff.控制, { digits: 4 });
          if (calc.reaction_bonus !== undefined)
            calc.reaction_bonus = scaleBattleValue(calc.reaction_bonus, coeff.速度, { digits: 4 });
          if (calc.attacker_speed_bonus !== undefined)
            calc.attacker_speed_bonus = scaleBattleValue(calc.attacker_speed_bonus, coeff.速度, { digits: 4 });
          if (calc.cast_speed_bonus !== undefined)
            calc.cast_speed_bonus = scaleBattleValue(calc.cast_speed_bonus, coeff.速度, { digits: 4 });
          if (calc.dodge_bonus !== undefined)
            calc.dodge_bonus = scaleBattleValue(calc.dodge_bonus, coeff.速度, { digits: 4 });
        }
      });

      const precisionDelta = roundBattleScaledNumber(coeff.掌控 - 1, 4);
      if (Math.abs(precisionDelta) > 0.0001) {
        const precisionState = ensureBattleTransientStateEffect(skill);
        const calc = precisionState.计算层效果 || (precisionState.计算层效果 = createEmptyCombatEffectMap());
        calc.hit_bonus = roundBattleScaledNumber(Number(calc.hit_bonus || 0) + precisionDelta, 4);
      }

      return skill;
    }

    function getSystemBaseEffect(skill) {
      return getSkillEffects(skill).find(effect => effect?.机制 === '系统基础') || {};
    }

    function getSkillType(skill) {
      return normalizeSkillTypeLabel(skill?.技能类型 || inferSkillTypeFromEffects(skill));
    }

    function getSkillCastTime(skill) {
      return Number(skill?.cast_time || getSystemBaseEffect(skill).cast_time || 0);
    }

    function getSkillCostText(skill) {
      return skill?.消耗 || getSystemBaseEffect(skill).消耗 || '无';
    }

    function getSkillTarget(skill) {
      return skill?.对象 || getSystemBaseEffect(skill).对象 || '敌方/单体';
    }

    function getPrimaryDamageEffect(skill) {
      return (
        getSkillEffects(skill).find(effect =>
          ['直接伤害', '多段伤害', '持续伤害', '延迟爆发'].includes(effect?.机制),
        ) || {}
      );
    }

    function getPrimaryStateEffect(skill) {
      return getSkillEffects(skill).find(effect => effect?.机制 === '状态挂载') || {};
    }

    function getPrimaryStateCalc(skill) {
      return getPrimaryStateEffect(skill)?.计算层效果 || createEmptyCombatEffectMap();
    }

    function getPrimaryStateName(skill) {
      const state = getPrimaryStateEffect(skill);
      if (state?.状态名称 && state.状态名称 !== '无') return state.状态名称;
      const fallback = getSkillEffects(skill).find(effect =>
        [
          '标记锁定',
          '幻境',
          '催眠',
          '禁疗',
          '减速',
          '软控',
          '位移限制',
          '强制绑定/锁定',
          '自身位移',
          '强制位移',
          '位移交换',
          '追击位移',
          '脱离位移',
          '反制',
          '条件触发',
          '转化',
          '复制',
          '状态交换',
          '硬控',
          '霸体',
          '护盾',
        ].includes(effect?.机制),
      );
      return fallback?.机制 || '';
    }

    function getPrimaryStateFlags(skill) {
      return String(getPrimaryStateEffect(skill)?.特殊机制标识 || '无');
    }

    function hasSkillMechanism(skill, mechanismList = []) {
      return getSkillEffects(skill).some(effect => mechanismList.includes(effect?.机制));
    }

    function findBattleSkillEffect(skill, matcher) {
      if (typeof matcher !== 'function') return null;
      return getSkillEffects(skill).find(effect => matcher(effect)) || null;
    }

    function isBattleRecoverEffect(effect, properties = []) {
      const property = String(effect?.属性 || '').trim();
      const allowAll = !Array.isArray(properties) || properties.length === 0;
      const propertyMatched = allowAll || properties.includes(property);
      if (!propertyMatched) return false;
      if (String(effect?.机制 || '').trim() === '持续恢复') return ['vit', 'sp', 'men'].includes(property);
      return (
        String(effect?.机制 || '').trim() === '属性变化' &&
        String(effect?.动作 || '').trim() === '加值' &&
        ['vit', 'sp', 'men'].includes(property)
      );
    }

    function isBattleAttributeSupportEffect(effect) {
      const mechanism = String(effect?.机制 || '').trim();
      return ['属性变化', '持续恢复', '消耗修正', '前摇修正', '掌控修正', '速度修正'].includes(mechanism);
    }

    function isBattleDebuffAttributeEffect(effect) {
      const mechanism = String(effect?.机制 || '').trim();
      const action = String(effect?.动作 || '').trim();
      if (mechanism === '消耗修正') return action === '消耗提高';
      if (mechanism === '前摇修正') return action === '前摇拉长';
      if (mechanism === '掌控修正' || mechanism === '速度修正') return action === '倍率压制';
      if (mechanism === '属性变化') return ['减值', '倍率压制'].includes(action);
      return false;
    }

    function normalizeSkillTypeLabel(raw) {
      const text = String(raw || '无');
      if (!text || text === '无') return '无';
      if (/输出|伤害|爆发|破甲|斩杀/.test(text)) return '输出';
      if (/控制|削弱|打断|沉默|禁疗|减速|软控|位移限制|锁定|束缚/.test(text)) return '控制';
      if (/防御|护盾|格挡|霸体|免死|反制/.test(text)) return '防御';
      if (/位移|机动|追击|脱离/.test(text)) return '辅助';
      if (/辅助|增益|回复|治疗/.test(text)) return '辅助';
      return text.split(/[\/|｜]/)[0] || text;
    }

    function inferSkillTypeFromEffects(skill) {
      const systemBase = getSystemBaseEffect(skill);
      const fromSystem = normalizeSkillTypeLabel(systemBase?.技能类型);
      if (fromSystem !== '无') return fromSystem;
      if (
        hasSkillMechanism(skill, [
          '硬控',
          '催眠',
          '幻境',
          '标记锁定',
          '禁疗',
          '打断',
          '沉默',
          '减速',
          '软控',
          '位移限制',
          '强制位移',
          '位移交换',
          '强制绑定/锁定',
        ])
      )
        return '控制';
      if (hasSkillMechanism(skill, ['护盾', '减伤', '格挡', '霸体', '免死', '反制'])) return '防御';
      if (
        hasSkillMechanism(skill, [
          '共享视野',
          '自身位移',
          '追击位移',
          '脱离位移',
          '分身',
          '复制',
          '状态交换',
          '条件触发',
          '转化',
        ]) ||
        getSkillEffects(skill).some(effect => isBattleAttributeSupportEffect(effect))
      )
        return '辅助';
      if (hasSkillMechanism(skill, ['直接伤害', '多段伤害', '持续伤害', '延迟爆发', '斩杀补伤'])) return '输出';
      return '无';
    }

    function inferMainTypeFromEffects(skill) {
      if (hasSkillMechanism(skill, ['自身位移', '强制位移', '位移交换', '追击位移', '脱离位移'])) return '位移类';
      if (hasSkillMechanism(skill, ['分身', '复制', '状态交换'])) return '特殊规则类';
      if (
        hasSkillMechanism(skill, [
          '硬控',
          '催眠',
          '幻境',
          '标记锁定',
          '禁疗',
          '打断',
          '沉默',
          '减速',
          '软控',
          '位移限制',
          '强制绑定/锁定',
        ]) ||
        getSkillEffects(skill).some(effect => isBattleDebuffAttributeEffect(effect))
      )
        return '控制类';
      if (hasSkillMechanism(skill, ['护盾', '减伤', '格挡', '霸体', '免死', '反制'])) return '防御类';
      if (getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect))) return '回复类';
      if (
        hasSkillMechanism(skill, ['共享视野']) ||
        getSkillEffects(skill).some(effect => isBattleAttributeSupportEffect(effect))
      )
        return '增益类';
      if (hasSkillMechanism(skill, ['直接伤害', '多段伤害', '持续伤害', '延迟爆发', '斩杀补伤'])) return '伤害类';
      return '无';
    }

    function deriveBattleSummaryFromEffects(skill, baseSummary = {}) {
      const defaultSummary = createEmptyBattleSummary();
      const summary = { ...defaultSummary, ...(baseSummary || {}) };
      const systemBase = getSystemBaseEffect(skill);
      const damage = getPrimaryDamageEffect(skill);
      const state = getPrimaryStateEffect(skill);
      const stateCalc = state?.计算层效果 || {};
      const targetText = String(systemBase?.对象 || '');
      const power = Number(damage?.威力倍率 || 0);
      const duration = Number(state?.持续回合 || 0);
      const skillName = String(skill?.name || skill?.技能名称 || '');
      const costText = String(getSkillCostText(skill) || '无');
      const attributeSource = getBattleSkillAttributeSource(skill);
      const skillRole = getBattleSkillRole(skill);
      const elementMode = String(getBattleSkillElementStructure(skill)?.模式 || '').trim() || '无';
      const wuxingMode = String(getBattleSkillWuxingInvocation(skill)?.模式 || '').trim() || '无';
      const polarityMode = String(getBattleSkillPolaritySummary(skill)?.polarityMode || '无').trim() || '无';
      const structureMode = elementMode !== '无' ? elementMode : wuxingMode;

      if (!baseSummary?.属性建模 || baseSummary.属性建模 === defaultSummary.属性建模 || baseSummary.属性建模 === '无') {
        const modelSegments = [attributeSource, skillRole, structureMode].filter(value => value && value !== '无');
        summary.属性建模 = modelSegments.length ? modelSegments.join('/') : '无';
      }
      if (!baseSummary?.极性层级 || baseSummary.极性层级 === defaultSummary.极性层级 || baseSummary.极性层级 === '无') {
        summary.极性层级 = polarityMode && polarityMode !== '无' ? polarityMode : '无';
      }
      if (
        (!baseSummary?.风险等级 || baseSummary.风险等级 === defaultSummary.风险等级 || baseSummary.风险等级 === '中') &&
        (structureMode === '逆演归一' ||
          structureMode === '阴阳合璧' ||
          (structureMode === '元素硬控' && normalizeBattleSkillAttributeTokens(skill?.附带属性).length >= 3))
      )
        summary.风险等级 = '高';

      if (!baseSummary?.目标规模 || baseSummary.目标规模 === defaultSummary.目标规模) {
        if (targetText === '全场') summary.目标规模 = '全场';
        else if (targetText.includes('群体')) summary.目标规模 = '群体';
        else summary.目标规模 = '单体';
      }

      if (!summary.防御性质 || summary.防御性质 === '无') {
        if (hasSkillMechanism(skill, ['反制'])) summary.防御性质 = '反制';
        else if (hasSkillMechanism(skill, ['免死'])) summary.防御性质 = '免死';
        else if (hasSkillMechanism(skill, ['霸体'])) summary.防御性质 = '霸体';
        else if (hasSkillMechanism(skill, ['分身'])) summary.防御性质 = '分身';
        else if (hasSkillMechanism(skill, ['格挡'])) summary.防御性质 = '格挡';
        else if (hasSkillMechanism(skill, ['减伤'])) summary.防御性质 = '减伤';
        else if (hasSkillMechanism(skill, ['护盾'])) summary.防御性质 = '护盾';
      }
      if (!summary.回复性质 || summary.回复性质 === '无') {
        if (getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect, ['vit'])))
          summary.回复性质 = '体力恢复';
        else if (getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect, ['sp', 'men'])))
          summary.回复性质 = '资源回复';
      }
      if (!summary.控制强度 || summary.控制强度 === '无') {
        if (hasSkillMechanism(skill, ['硬控', '催眠']) || stateCalc.skip_turn === true) summary.控制强度 = '硬控';
        else if (
          hasSkillMechanism(skill, [
            '幻境',
            '标记锁定',
            '沉默',
            '禁疗',
            '减速',
            '打断',
            '软控',
            '位移限制',
            '强制位移',
            '位移交换',
            '强制绑定/锁定',
          ]) ||
          getSkillEffects(skill).some(effect => isBattleDebuffAttributeEffect(effect)) ||
          Number(stateCalc.lock_level || 0) > 0 ||
          Number(stateCalc.reaction_penalty || 0) > 0 ||
          Number(stateCalc.cast_speed_penalty || 0) > 0 ||
          Number(stateCalc.dodge_penalty || 0) > 0 ||
          Number(stateCalc.resource_block_ratio || 0) > 0
        )
          summary.控制强度 = '软控';
      }
      if (!baseSummary?.协同性 || baseSummary.协同性 === defaultSummary.协同性 || baseSummary.协同性 === '无') {
        if (
          targetText === '全场' ||
          targetText.includes('群体') ||
          hasSkillMechanism(skill, ['共享视野', '召唤与场地'])
        )
          summary.协同性 = '高';
        else if (
          targetText.includes('己方') ||
          getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect)) ||
          hasSkillMechanism(skill, ['分身'])
        )
          summary.协同性 = '中';
        else summary.协同性 = '低';
      }
      if (!baseSummary?.生效方式 || baseSummary.生效方式 === defaultSummary.生效方式 || baseSummary.生效方式 === '无') {
        if (hasSkillMechanism(skill, ['受击反击', '格挡', '反制', '条件触发'])) summary.生效方式 = '触发';
        else if (hasSkillMechanism(skill, ['延迟爆发'])) summary.生效方式 = '延迟';
        else if (
          duration > 1 ||
          hasSkillMechanism(skill, ['持续伤害', '护盾', '减伤', '霸体', '免死', '共享视野', '召唤与场地', '分身'])
        )
          summary.生效方式 = '持续';
        else summary.生效方式 = '瞬发';
      }
      if (!baseSummary?.爆发级别 || baseSummary.爆发级别 === defaultSummary.爆发级别 || baseSummary.爆发级别 === '无') {
        if (power >= 300) summary.爆发级别 = '高';
        else if (power >= 160) summary.爆发级别 = '中';
        else if (power > 0) summary.爆发级别 = '低';
        else summary.爆发级别 = '无';
      }
      if (!baseSummary?.持续性 || baseSummary.持续性 === defaultSummary.持续性 || baseSummary.持续性 === '无') {
        if (duration >= 3) summary.持续性 = '长';
        else if (duration >= 2) summary.持续性 = '中';
        else if (duration > 0) summary.持续性 = '短';
        else if (hasSkillMechanism(skill, ['召唤与场地', '共享视野', '护盾', '减伤', '格挡', '霸体', '免死', '分身']))
          summary.持续性 = '中';
        else summary.持续性 = '无';
      }
      if (!baseSummary?.保留倾向 || Number(baseSummary.保留倾向 || 0) === Number(defaultSummary.保留倾向 || 0)) {
        let reserve = 0;
        if (/真身|武魂融合技|生命之火|第八魂技|第九魂技/.test(skillName)) reserve += 35;
        if (power >= 280) reserve += 20;
        if (Number(systemBase?.cast_time || 0) >= 25) reserve += 15;
        if (hasSkillMechanism(skill, ['免死', '格挡', '受击反击', '反制', '条件触发', '效果反转', '高波动随机值']))
          reserve += 10;
        if (/维持|启动\)/.test(costText)) reserve += 10;
        summary.保留倾向 = Math.min(90, reserve);
      }
      return summary;
    }

    function buildConditionTacticalSnapshot(entity) {
      const entries = Object.entries(entity?.conditions || {});
      const buffEntries = entries.filter(([, cond]) => cond?.类型 === 'buff');
      const debuffEntries = entries.filter(([, cond]) => cond?.类型 === 'debuff');
      const hasShielded = entries.some(
        ([name, cond]) => /护盾|屏障|结界/.test(name) || Number(cond?.combat_effects?.shield_gain_mult || 1) > 1.05,
      );
      const hasDefenseBuffed = entries.some(
        ([name, cond]) => Number(cond?.stat_mods?.def || 1) > 1.12 || /护体|罡气|霸体|真身|格挡|减伤/.test(name),
      );
      const isLockedOrControlled = entries.some(([name, cond]) => {
        const ce = cond?.combat_effects || {};
        return (
          ce.skip_turn === true ||
          ce.cannot_react === true ||
          Number(ce.lock_level || 0) > 0 ||
          Number(ce.reaction_penalty || 0) > 0 ||
          Number(ce.cast_speed_penalty || 0) > 0 ||
          Number(ce.dodge_penalty || 0) > 0 ||
          Number(ce.resource_block_ratio || 0) > 0 ||
          /锁定|禁锢|眩晕|催眠|幻境|束缚|减速|迟缓|软控|位移限制|强制位移|位移交换/.test(name)
        );
      });
      const hasHealingTrend = entries.some(
        ([name, cond]) =>
          Number(cond?.combat_effects?.final_heal_mult || 1) > 1.0 ||
          Number(cond?.combat_effects?.final_heal_bonus || 0) > 0 ||
          Number(cond?.combat_effects?.sp_gain_ratio || 0) > 0 ||
          Number(cond?.combat_effects?.men_gain_ratio || 0) > 0 ||
          /回血|治疗|再生|回复|回魂|回精神/.test(name),
      );
      const hasDotPressure = entries.some(
        ([name, cond]) =>
          Number(cond?.combat_effects?.dot_damage || 0) > 0 || /流血|灼烧|腐蚀|中毒|撕裂|持续伤害/.test(name),
      );
      const hasBadCondition = entries.some(
        ([name, cond]) => cond?.类型 === 'debuff' && !/霸体|真身|增益|护盾/.test(name),
      );
      const hasSharedVision = entries.some(([name]) => /共享视野/.test(name));
      const hasReactiveDefense = entries.some(
        ([name, cond]) =>
          cond?.combat_effects?.super_armor === true ||
          Number(cond?.combat_effects?.block_count || 0) > 0 ||
          Number(cond?.combat_effects?.death_save_count || 0) > 0 ||
          Number(cond?.combat_effects?.counter_attack_ratio || 0) > 0 ||
          Number(cond?.combat_effects?.damage_reduction || 0) > 0 ||
          /护盾|格挡|霸体|免死|反击|反制/.test(name),
      );
      const hasAntiHeal = entries.some(
        ([name, cond]) => Number(cond?.combat_effects?.heal_block_ratio || 0) > 0 || /禁疗/.test(name),
      );
      return {
        entries,
        buffCount: buffEntries.length,
        debuffCount: debuffEntries.length,
        hasShielded,
        hasDefenseBuffed,
        isLockedOrControlled,
        hasHealingTrend,
        hasDotPressure,
        hasBadCondition,
        hasSharedVision,
        hasReactiveDefense,
        hasAntiHeal,
      };
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
          },
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
      const playerRoster = [combatData.participants.player, ...(combatData.participants.team_player || [])].filter(
        Boolean,
      );
      const enemyRoster = [combatData.participants.enemy, ...(combatData.participants.team_enemy || [])].filter(
        Boolean,
      );

      const processRoster = (roster, opposingRoster) => {
        const seen = new Set();
        roster.forEach(member => {
          if (!member || seen.has(member)) return;
          seen.add(member);
          refreshParticipantProjectedState(
            member,
            roster.filter(unit => unit && unit !== member),
            opposingRoster.filter(Boolean),
          );
        });
      };

      processRoster(playerRoster, enemyRoster);
      processRoster(enemyRoster, playerRoster);

      if (combatData.participants.player)
        combatData.participants.player.final = buildCombatFinalStats(combatData.participants.player);
      if (combatData.participants.enemy)
        combatData.participants.enemy.final = buildCombatFinalStats(combatData.participants.enemy);
      (combatData.participants.team_player || []).forEach(member => {
        if (member) member.final = buildCombatFinalStats(member);
      });
      (combatData.participants.team_enemy || []).forEach(member => {
        if (member) member.final = buildCombatFinalStats(member);
      });
      return combatData;
    }

    function normalizeSkillData(skill, fallbackName = '未知技能') {
      const normalized = deepClone(skill || {});
      normalized.name = normalized.name || normalized.技能名称 || fallbackName;
      normalized.魂技名 = normalized.魂技名 || normalized.name || normalized.技能名称 || fallbackName;
      normalized.战斗摘要 = { ...createEmptyBattleSummary(), ...(normalized.战斗摘要 || {}) };
      normalized.主定位 = normalized.主定位 || normalized.战斗语义?.主定位 || normalized.技能类型 || '无';
      normalized.标签 = Array.isArray(normalized.标签) ? normalized.标签 : [];
      normalized.战斗语义 = { ...createEmptySkillSemantics(), ...(normalized.战斗语义 || {}) };
      const explicitSemanticTarget = skill?.战斗语义?.作用目标;
      const explicitPrimaryRole = skill?.主定位 || skill?.战斗语义?.主定位;
      const explicitSkillType = skill?.技能类型;
      normalized.对象 =
        normalized.对象 && normalized.对象 !== '无'
          ? normalized.对象
          : explicitSemanticTarget
            ? mapSemanticTargetToCombatTarget(explicitSemanticTarget)
            : '无';
      normalized.技能类型 =
        normalized.技能类型 && normalized.技能类型 !== '无'
          ? normalized.技能类型
          : explicitSkillType && explicitSkillType !== '无'
            ? explicitSkillType
            : explicitPrimaryRole && explicitPrimaryRole !== '无'
              ? mapPrimaryRoleToSkillType(normalized.主定位)
              : '无';
      normalized.cast_time = Number(normalized.cast_time ?? 0) || 0;
      normalized.消耗 =
        typeof normalized.消耗 === 'object' ? formatCostObjectToString(normalized.消耗) : normalized.消耗 || '无';
      normalized.附带属性 = normalizeBattleSkillAttributeTokens(normalized.附带属性);
      normalized._效果数组 = Array.isArray(normalized._效果数组) ? normalized._效果数组 : [];
      normalized.element = getBattleSkillDisplayElement(normalized);

      const systemBase = getSystemBaseEffect(normalized);
      if (systemBase && Object.keys(systemBase).length > 0) {
        if (!normalized.消耗 || normalized.消耗 === '无') {
          normalized.消耗 = systemBase.消耗 || '无';
        }
        if (!normalized.对象 || normalized.对象 === '无') {
          normalized.对象 = systemBase.对象 || normalized.对象 || '敌方/单体';
        }
        if (!normalized.技能类型 || normalized.技能类型 === '无') {
          normalized.技能类型 = getSkillType(normalized);
        }
        if (!(normalized.cast_time > 0)) {
          normalized.cast_time = Number(systemBase.cast_time ?? 0) || 0;
        }
      }

      // 新版本中所有的机制均扁平化存放在 _效果数组 中
      if (normalized._效果数组.length === 0) {
        // 如果连 _效果数组 都没有，说明是极老的空白技能，默认塞入一个系统基础保证不报错
        normalized._效果数组.push({
          机制: '系统基础',
          消耗: '无',
          对象: normalized.对象,
          技能类型: normalized.技能类型,
          cast_time: normalized.cast_time,
        });
      }

      applyAttributeCoeffToCombatSkill(normalized);

      return normalized;
    }

    const FUSION_SELF_SPIRIT_SLOTS = ['第一武魂', '第二武魂'];

    function getFusionSkillMode(fusionSkill = {}) {
      return fusionSkill?.fusion_mode === 'self' ? 'self' : 'partner';
    }

    function getFusionSkillSourceSpirits(fusionSkill = {}) {
      const rawSlots = Array.isArray(fusionSkill?.source_spirits) ? fusionSkill.source_spirits : [];
      const slots = rawSlots
        .map(slot => String(slot || '').trim())
        .filter(slot => FUSION_SELF_SPIRIT_SLOTS.includes(slot));
      if (slots.length) return Array.from(new Set(slots));
      return getFusionSkillMode(fusionSkill) === 'self' ? [...FUSION_SELF_SPIRIT_SLOTS] : ['第一武魂'];
    }

    function hasUsableSpiritSlot(charData, slot) {
      return !!(charData?.spirit && charData.spirit[slot]);
    }

    function isFusionSkillAvailable(charData, fusionSkill, alliedTeam = []) {
      if (!fusionSkill?.skill_data || fusionSkill?.skill_data?.状态 === '未生成') return false;
      if (getFusionSkillMode(fusionSkill) === 'self') {
        const slots = getFusionSkillSourceSpirits(fusionSkill);
        return slots.length >= 2 && slots.every(slot => hasUsableSpiritSlot(charData, slot));
      }
      const partnerName = String(fusionSkill?.partner || '').trim();
      if (!partnerName || partnerName === '无') return false;
      return (alliedTeam || []).some(unit => unit.name === partnerName && unit.vit > 0);
    }

    function buildFusionCastNarration(fusionSkill, actorName = '施术者') {
      if (getFusionSkillMode(fusionSkill) === 'self') {
        const slots = getFusionSkillSourceSpirits(fusionSkill);
        return `${actorName}将${slots.join('与')}同频共振，自体交融，悍然施展了武魂融合技！`;
      }
      return `${actorName}与${fusionSkill?.partner || '同伴'}气息交融，果断施展了武魂融合技！`;
    }

    function parseResourceCostValue(costStr, label, currentValue, maxValue) {
      const text = String(costStr || '');
      const currentMatch = text.match(new RegExp(`${label}:(?:当前(?:剩余)?|剩余)(\\d+)%`));
      if (currentMatch)
        return Math.floor((Math.max(0, Number(currentValue || 0)) * parseInt(currentMatch[1], 10)) / 100);
      const baseMatch = text.match(new RegExp(`${label}:(\\d+)(%?)`));
      if (!baseMatch) return 0;
      return baseMatch[2]
        ? Math.floor((Math.max(0, Number(maxValue || 0)) * parseInt(baseMatch[1], 10)) / 100)
        : parseInt(baseMatch[1], 10);
    }

    function parseSkillCostForChar(skill, char) {
      const stats = char?.stat || char || {};
      const costStr = normalizeSkillData(skill).消耗 || getSkillCostText(skill);
      const costScale =
        skill && char && skill.__targetForSupportCost && isSupportLikeSkill(skill)
          ? getSupportCostScale(char, skill.__targetForSupportCost)
          : 1;
      const rawReqSp = parseResourceCostValue(costStr, '魂力', stats.sp, stats.sp_max);
      const rawReqVit = parseResourceCostValue(costStr, '体力', stats.vit, stats.vit_max);
      const rawReqMen = parseResourceCostValue(costStr, '精神力', stats.men, stats.men_max);
      const reqSp = Math.floor(rawReqSp * costScale);
      const reqVit = Math.floor(rawReqVit * costScale);
      const reqMen = Math.floor(rawReqMen * costScale);

      return {
        reqSp,
        reqVit,
        reqMen,
        canCast: (stats.sp || 0) >= reqSp && (stats.vit || 0) >= reqVit && (stats.men || 0) >= reqMen,
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
      for (const branch of branches || []) {
        if (!branch) continue;
        const weight = Math.max(0, Math.min(95, Math.floor(branch.weight || 0)));
        if (weight <= 0) continue;

        const roll = rollD100();
        const hit = roll <= weight;
        traces.push(
          `[${phaseLabel}] ${branch.name || '未命名分支'} 权重:${weight} Roll:${roll} 判定:${hit ? '命中' : '未命中'}`,
        );

        if (hit) {
          return { option: branch, trace: traces.join(' | '), roll, weight };
        }
      }

      return { option: null, trace: traces.join(' | ') };
    }

    function isPassiveSkillData(skill) {
      if (!skill || typeof skill !== 'object') return false;
      const systemBase = getSystemBaseEffect(skill) || {};
      const rawType = systemBase?.技能类型 || skill?.技能类型 || '无';
      return /被动/.test(String(rawType || ''));
    }

    function pushUnifiedSkillMapEntries(skills, skillMap, sourceTag, options = {}) {
      const { includePassive = false, includeActive = true } = options;
      Object.entries(skillMap || {}).forEach(([skillName, skillData]) => {
        if (!skillData || skillData?.状态 === '未生成') return;
        const nSkill = normalizeSkillData(skillData, skillName);
        const isPassive = isPassiveSkillData(nSkill);
        if (isPassive && !includePassive) return;
        if (!isPassive && !includeActive) return;
        nSkill.source_tag = sourceTag;
        skills.push(nSkill);
      });
    }

    function collectUnifiedSkillEntries(charData, alliedTeam = [], options = {}) {
      const skills = [];
      const collectOptions = {
        includePassive: !!options.includePassive,
        includeActive: options.includeActive !== false,
      };

      if (charData?.spirit) {
        Object.entries(charData.spirit).forEach(([spKey, sp]) => {
          const spName = sp?.表象名称 || spKey || '武魂';
          Object.values(sp?.soul_spirits || {}).forEach(ss => {
            Object.values(ss?.rings || {}).forEach(ring => {
              pushUnifiedSkillMapEntries(skills, ring?.魂技 || {}, spName, collectOptions);
            });
          });
          pushUnifiedSkillMapEntries(skills, sp?.custom_skills || {}, `${spName}·自创`, collectOptions);
        });
      }

      if (charData?.bloodline_power) {
        pushUnifiedSkillMapEntries(skills, charData.bloodline_power.skills || {}, '血脉之力', collectOptions);
        pushUnifiedSkillMapEntries(skills, charData.bloodline_power.passives || {}, '血脉被动', collectOptions);
        Object.values(charData.bloodline_power.blood_rings || {}).forEach(ring => {
          pushUnifiedSkillMapEntries(skills, ring?.魂技 || {}, '气血魂技', collectOptions);
        });
      }

      Object.values(charData?.soul_bone || {}).forEach(bone => {
        pushUnifiedSkillMapEntries(skills, bone?.附带技能 || {}, '魂骨技能', collectOptions);
      });

      pushUnifiedSkillMapEntries(skills, charData?.secret_skills || {}, '秘技', collectOptions);
      pushUnifiedSkillMapEntries(skills, charData?.special_abilities || {}, '特殊能力', collectOptions);

      Object.entries(charData?.martial_fusion_skills || {}).forEach(([fusionName, fusionSkill]) => {
        if (!isFusionSkillAvailable(charData, fusionSkill, alliedTeam)) return;
        const nSkill = normalizeSkillData(fusionSkill.skill_data, `武魂融合技·${fusionName}`);
        const isPassive = isPassiveSkillData(nSkill);
        if (isPassive && !collectOptions.includePassive) return;
        if (!isPassive && !collectOptions.includeActive) return;
        nSkill.source_tag = '武魂融合技';
        nSkill.__fusion_mode = getFusionSkillMode(fusionSkill);
        skills.push(nSkill);
      });

      return skills;
    }

    function collectPassiveCombatSkills(charData, alliedTeam = []) {
      return collectUnifiedSkillEntries(charData, alliedTeam, { includePassive: true, includeActive: false });
    }

    const AUTO_PROJECTED_CONDITION_PREFIX = '__auto__:';

    function clearAutoProjectedConditions(char) {
      if (!char?.conditions) return;
      Object.keys(char.conditions).forEach(key => {
        if (String(key).startsWith(AUTO_PROJECTED_CONDITION_PREFIX)) delete char.conditions[key];
      });
    }

    function createProjectedCondition(description, type = 'buff', statMods = {}, combatEffects = {}, duration = 999) {
      return {
        类型: type,
        层数: 1,
        描述: description || '自动投影效果',
        duration,
        stat_mods: {
          str: Number(statMods.str ?? 1),
          def: Number(statMods.def ?? 1),
          agi: Number(statMods.agi ?? 1),
          sp_max: Number(statMods.sp_max ?? 1),
          vit_max: Number(statMods.vit_max ?? 1),
          men_max: Number(statMods.men_max ?? 1),
        },
        combat_effects: mergeCombatEffectMaps(createEmptyCombatEffectMap(), combatEffects || {}),
      };
    }

    function projectPassiveSkillToConditions(char, skill) {
      if (!char?.conditions || !skill) return;
      const sourceName = skill.name || skill.技能名称 || '被动技能';
      getSkillEffects(skill).forEach((effect, index) => {
        const mechanism = effect?.机制 || effect?.名称 || effect?.类型 || '';
        if (mechanism === '状态挂载' && effect?.状态名称 && effect.状态名称 !== '无') {
          const specialFlag = effect.特殊机制标识 || '无';
          const calc = effect.计算层效果 || {};
          const isBuff =
            /增益|真身|被动/.test(specialFlag) ||
            Number(calc.hit_bonus || 0) > 0 ||
            Number(calc.reaction_bonus || 0) > 0 ||
            Number(calc.dodge_bonus || 0) > 0 ||
            Number(calc.final_heal_mult || 1) > 1 ||
            Number(calc.final_damage_mult || 1) > 1 ||
            calc.super_armor === true ||
            Number(calc.min_hp_floor || 0) > 0;
          char.conditions[`${AUTO_PROJECTED_CONDITION_PREFIX}${sourceName}:${effect.状态名称}`] =
            createProjectedCondition(
              `自动投影[${sourceName}]`,
              isBuff ? 'buff' : 'debuff',
              effect.面板修改比例 || {},
              calc,
              999,
            );
          return;
        }
        if (mechanism === '属性永久强化') {
          const mult = 1 + Math.max(0, Number(effect.强化值 || 0));
          char.conditions[`${AUTO_PROJECTED_CONDITION_PREFIX}${sourceName}:属性永久强化:${index}`] =
            createProjectedCondition(
              `自动投影[${sourceName}]·属性永久强化`,
              'buff',
              { str: mult, def: mult, agi: mult, sp_max: mult, vit_max: mult, men_max: mult },
              {},
              999,
            );
        }
      });
      const runtimeEffect = createEmptyCombatEffectMap();
      applyRuntimeMechanismEffects(skill, char, char, char, char, runtimeEffect);
      if (hasMeaningfulCombatEffect(runtimeEffect)) {
        char.conditions[`${AUTO_PROJECTED_CONDITION_PREFIX}${sourceName}:机制投影`] = createProjectedCondition(
          `自动投影[${sourceName}]·机制效果`,
          'buff',
          {},
          runtimeEffect,
          999,
        );
      }
    }

    function getActiveStructuredDomain(char) {
      if (!char || typeof char !== 'object') return null;
      const domain = char.spiritual_domain || {};
      const modifiers = domain.combat_modifiers || {};
      const enabled = Object.values(modifiers).some(mod => mod?.enabled);
      const isActive =
        !!domain.is_active || String(char.active_domain || char.status?.active_domain || '').includes('精神领域');
      if (!enabled || !isActive) return null;
      return { name: domain.name || '精神领域', modifiers };
    }

    function buildDomainSuppressionStatMods(targetStat = 'all', reduceRatio = 0.3) {
      const mult = Math.max(0.05, 1 - Math.max(0, Number(reduceRatio || 0)));
      const mods = { str: 1, def: 1, agi: 1, sp_max: 1, vit_max: 1, men_max: 1 };
      if (targetStat === 'all') return { str: mult, def: mult, agi: mult, sp_max: mult, vit_max: mult, men_max: mult };
      const keyMap = {
        str: 'str',
        def: 'def',
        agi: 'agi',
        sp: 'sp_max',
        sp_max: 'sp_max',
        vit: 'vit_max',
        vit_max: 'vit_max',
        men: 'men_max',
        men_max: 'men_max',
      };
      const mapped = keyMap[targetStat] || null;
      if (mapped) mods[mapped] = mult;
      return mods;
    }

    function resolveArmorDomainDescriptor(char) {
      const activeDomainText = String(char?.active_domain || char?.status?.active_domain || '');
      if (!activeDomainText.includes('斗铠领域')) return null;

      const isFourWord = activeDomainText.includes('四字');
      const ratio = isFourWord ? 1.2 : 1.1;
      const requiredCount = isFourWord ? 2 : 1;
      const attrPool = ['sp_max', 'men_max', 'str', 'def', 'agi', 'vit_max'];
      const bracketMatch = activeDomainText.match(/\[([^\]]+)\]/);
      let selectedAttrs = bracketMatch
        ? bracketMatch[1]
            .split(/[，,]/)
            .map(attr => String(attr || '').trim())
            .filter(attr => attrPool.includes(attr))
        : [];

      if (selectedAttrs.length > requiredCount) selectedAttrs = selectedAttrs.slice(0, requiredCount);

      if (activeDomainText.includes('未定') || selectedAttrs.length < requiredCount) {
        const remaining = [...attrPool];
        selectedAttrs = [];
        while (selectedAttrs.length < requiredCount && remaining.length > 0) {
          const index = Math.floor(Math.random() * remaining.length);
          selectedAttrs.push(remaining.splice(index, 1)[0]);
        }
        char.active_domain = isFourWord
          ? `【四字斗铠领域】全开[${selectedAttrs.join(',')}]`
          : `【三字斗铠领域】全开[${selectedAttrs.join(',')}]`;
      }

      return {
        name: String(char.active_domain || char?.status?.active_domain || activeDomainText),
        ratio,
        selectedAttrs,
      };
    }

    function projectDomainConditionsForParticipant(char, opposingTeam = []) {
      if (!char?.conditions) return;
      const armorDomain = resolveArmorDomainDescriptor(char);
      if (armorDomain) {
        const statMods = { str: 1, def: 1, agi: 1, sp_max: 1, vit_max: 1, men_max: 1 };
        armorDomain.selectedAttrs.forEach(attr => {
          statMods[attr] = armorDomain.ratio;
        });
        char.conditions[`${AUTO_PROJECTED_CONDITION_PREFIX}斗铠领域:${armorDomain.name}`] = createProjectedCondition(
          `自动投影[${armorDomain.name}]·斗铠增幅`,
          'buff',
          statMods,
          {},
          999,
        );
      }

      const ownDomain = getActiveStructuredDomain(char);
      if (ownDomain) {
        const selfEffects = createEmptyCombatEffectMap();
        const ownMods = ownDomain.modifiers;
        if (ownMods.conditional_evasion?.enabled) {
          const compareStat = ownMods.conditional_evasion.compare_stat || 'men';
          const selfValue = getMechanismJudgeValue(char, char.final || char, compareStat);
          const maxEnemy = Math.max(
            0,
            ...(opposingTeam || []).map(unit => getMechanismJudgeValue(unit, unit.final || unit, compareStat)),
          );
          const maxRatio = Math.max(1, Number(ownMods.conditional_evasion.max_ratio || 1.5));
          if (maxEnemy <= selfValue * maxRatio) {
            selfEffects.dodge_bonus += 0.25;
            selfEffects.reaction_bonus += 0.1;
          }
        }
        if (ownMods.absolute_hit_true_dmg?.enabled) {
          const ratio = Math.max(0, Number(ownMods.absolute_hit_true_dmg.true_dmg_ratio || 0.1));
          selfEffects.hit_bonus += 0.12;
          selfEffects.lock_level = Math.max(Number(selfEffects.lock_level || 0), 1);
          selfEffects.final_damage_mult *= 1 + Math.min(0.35, ratio);
          selfEffects.bonus_true_damage_ratio += ratio;
        }
        if (ownMods.soul_leech?.enabled) {
          selfEffects.life_steal_ratio += Math.max(0, Math.min(1, Number(ownMods.soul_leech.leech_ratio || 0.5)));
        }
        if (hasMeaningfulCombatEffect(selfEffects)) {
          char.conditions[`${AUTO_PROJECTED_CONDITION_PREFIX}领域:${ownDomain.name}:自我法则`] =
            createProjectedCondition(`自动投影[${ownDomain.name}]·自我法则`, 'buff', {}, selfEffects, 999);
        }
      }

      (opposingTeam || []).forEach(enemy => {
        const enemyDomain = getActiveStructuredDomain(enemy);
        if (!enemyDomain) return;
        const mods = enemyDomain.modifiers;
        const effectMap = createEmptyCombatEffectMap();
        let statMods = { str: 1, def: 1, agi: 1, sp_max: 1, vit_max: 1, men_max: 1 };
        if (mods.stat_suppression?.enabled)
          statMods = buildDomainSuppressionStatMods(
            mods.stat_suppression.target_stat || 'all',
            mods.stat_suppression.reduce_ratio || 0.3,
          );
        if (mods.time_dilation?.enabled) {
          const mult = Math.max(1, Number(mods.time_dilation.cast_time_multiplier || 2));
          effectMap.reaction_penalty += Math.min(0.45, (mult - 1) * 0.2);
          effectMap.cast_speed_penalty += Math.min(2, mult - 1);
          effectMap.dodge_penalty += Math.min(0.2, (mult - 1) * 0.08);
        }
        if (mods.illusion_misdirection?.enabled) {
          const chance = Math.max(0, Math.min(0.9, Number(mods.illusion_misdirection.misdirection_chance || 0.4)));
          effectMap.hit_penalty += Number((chance * 0.5).toFixed(2));
          effectMap.control_success_penalty += Number((chance * 0.2).toFixed(2));
          effectMap.reaction_penalty += Number((chance * 0.15).toFixed(2));
        }
        if (hasMeaningfulCombatEffect(effectMap) || Object.values(statMods).some(v => Number(v || 1) !== 1)) {
          char.conditions[
            `${AUTO_PROJECTED_CONDITION_PREFIX}领域压制:${enemy.name || enemyDomain.name}:${char.name || '目标'}`
          ] = createProjectedCondition(`自动投影[${enemyDomain.name}]·领域压制`, 'debuff', statMods, effectMap, 999);
        }
      });
    }

    function buildCombatFinalStats(char) {
      const final = deepClone(char || {});
      final.conditions = deepClone(char?.conditions || {});
      final.combat_effects = createEmptyCombatEffectMap();
      Object.values(final.conditions || {}).forEach(cond => {
        const mods = cond?.stat_mods || {};
        final.str = Number(final.str || 0) * Number(mods.str ?? 1);
        final.def = Number(final.def || 0) * Number(mods.def ?? 1);
        final.agi = Number(final.agi || 0) * Number(mods.agi ?? 1);
        if (final.sp_max !== undefined) final.sp_max = Number(final.sp_max || 0) * Number(mods.sp_max ?? 1);
        if (final.vit_max !== undefined) final.vit_max = Number(final.vit_max || 0) * Number(mods.vit_max ?? 1);
        if (final.men_max !== undefined) final.men_max = Number(final.men_max || 0) * Number(mods.men_max ?? 1);
        final.combat_effects = mergeCombatEffectMaps(final.combat_effects, cond?.combat_effects || {});
      });
      if (final.sp_max !== undefined && final.sp !== undefined) final.sp = Math.min(final.sp, final.sp_max);
      if (final.vit_max !== undefined && final.vit !== undefined) final.vit = Math.min(final.vit, final.vit_max);
      if (final.men_max !== undefined && final.men !== undefined) final.men = Math.min(final.men, final.men_max);
      final.str = Math.round(Number(final.str || 0));
      final.def = Math.round(Number(final.def || 0));
      final.agi = Math.round(Number(final.agi || 0));
      if (final.sp_max !== undefined) final.sp_max = Math.round(Number(final.sp_max || 0));
      if (final.vit_max !== undefined) final.vit_max = Math.round(Number(final.vit_max || 0));
      if (final.men_max !== undefined) final.men_max = Math.round(Number(final.men_max || 0));
      return final;
    }

    function refreshParticipantProjectedState(char, alliedTeam = [], opposingTeam = []) {
      if (!char) return char;
      bindCombatParticipant(char);
      clearAutoProjectedConditions(char);
      collectPassiveCombatSkills(char, alliedTeam).forEach(skill => projectPassiveSkillToConditions(char, skill));
      projectDomainConditionsForParticipant(char, opposingTeam);
      char.final = buildCombatFinalStats(char);
      return char;
    }

    function applyStateToCharacter(targetChar, stateModule, sourceName, forceBuff) {
      if (!targetChar || !stateModule || !stateModule.状态名称 || stateModule.状态名称 === '无') return false;
      if (!targetChar.conditions) targetChar.conditions = {};

      const specialFlag = stateModule.特殊机制标识 || '无';
      const calc = stateModule.计算层效果 || {};
      const hasPositiveCalc =
        Number(calc.hit_bonus || 0) > 0 ||
        Number(calc.reaction_bonus || 0) > 0 ||
        Number(calc.dodge_bonus || 0) > 0 ||
        Number(calc.sp_gain_ratio || 0) > 0 ||
        Number(calc.men_gain_ratio || 0) > 0 ||
        Number(calc.final_heal_mult || 1.0) > 1.0 ||
        Number(calc.shield_gain_mult || 1.0) > 1.0 ||
        Number(calc.hot_heal_ratio || 0) > 0 ||
        calc.super_armor === true ||
        Number(calc.min_hp_floor || 0) > 0;
      const isBuff =
        forceBuff === true || hasPositiveCalc || specialFlag.includes('增益') || specialFlag.includes('真身');

      targetChar.conditions[stateModule.状态名称] = {
        类型: isBuff ? 'buff' : 'debuff',
        层数: 1,
        描述: `由[${sourceName || stateModule.状态名称}]附加`,
        duration: stateModule.持续回合 || 0,
        stat_mods: stateModule.面板修改比例 || { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 },
        combat_effects: {
          ...createEmptyCombatEffectMap(),
          skip_turn: stateModule.计算层效果?.skip_turn ?? false,
          cannot_react: stateModule.计算层效果?.cannot_react ?? false,
          dot_damage: (stateModule.计算层效果?.dot_damage ?? stateModule.持续真伤dot) || 0,
          armor_pen: stateModule.计算层效果?.armor_pen ?? 0,
          reaction_bonus: stateModule.计算层效果?.reaction_bonus ?? 0,
          reaction_penalty: stateModule.计算层效果?.reaction_penalty ?? 0,
          attacker_speed_bonus: stateModule.计算层效果?.attacker_speed_bonus ?? 0,
          cast_speed_bonus: stateModule.计算层效果?.cast_speed_bonus ?? 0,
          cast_speed_penalty: stateModule.计算层效果?.cast_speed_penalty ?? 0,
          hit_bonus: stateModule.计算层效果?.hit_bonus ?? 0,
          hit_penalty: stateModule.计算层效果?.hit_penalty ?? 0,
          dodge_bonus: stateModule.计算层效果?.dodge_bonus ?? 0,
          dodge_penalty: stateModule.计算层效果?.dodge_penalty ?? 0,
          lock_level: stateModule.计算层效果?.lock_level ?? 0,
          control_success_bonus: stateModule.计算层效果?.control_success_bonus ?? 0,
          control_success_penalty: stateModule.计算层效果?.control_success_penalty ?? 0,
          control_resist_mult: stateModule.计算层效果?.control_resist_mult ?? 1.0,
          control_resist_bonus: stateModule.计算层效果?.control_resist_bonus ?? 0,
          interrupt_bonus: stateModule.计算层效果?.interrupt_bonus ?? 0,
          final_damage_mult: stateModule.计算层效果?.final_damage_mult ?? 1.0,
          final_damage_bonus: stateModule.计算层效果?.final_damage_bonus ?? 0,
          final_heal_mult: stateModule.计算层效果?.final_heal_mult ?? 1.0,
          final_heal_bonus: stateModule.计算层效果?.final_heal_bonus ?? 0,
          shield_gain_mult: stateModule.计算层效果?.shield_gain_mult ?? 1.0,
          shield_gain_bonus: stateModule.计算层效果?.shield_gain_bonus ?? 0,
          sp_gain_ratio: stateModule.计算层效果?.sp_gain_ratio ?? 0,
          men_gain_ratio: stateModule.计算层效果?.men_gain_ratio ?? 0,
          heal_block_ratio: stateModule.计算层效果?.heal_block_ratio ?? 0,
          hot_heal_ratio: stateModule.计算层效果?.hot_heal_ratio ?? 0,
          resource_block_ratio: stateModule.计算层效果?.resource_block_ratio ?? 0,
          min_hp_floor: stateModule.计算层效果?.min_hp_floor ?? 0,
          death_save_count: stateModule.计算层效果?.death_save_count ?? 0,
          bonus_true_damage_ratio: stateModule.计算层效果?.bonus_true_damage_ratio ?? 0,
      return defender || attacker;
    }

    function removeNegativeConditionsByCleanse(targetChar, maxCount = 1) {
      if (!targetChar?.conditions) return [];
      const scoreCondition = (cond = {}) => {
      consconst ce = cond?.combat_effects || {};
      consreturn (
          (ce.skip_turn ? 1000 : 0) +
          (ce.cannot_react ? 800 : 0) +
        consNumber(ce.lock_level || 0) * 100 +
          Number(ce.dot_damage || 0) / 10 +
          Number(cond?.duration || 0)
        cons
        consnst removable = Object.entries(targetChar.conditions)
        cons.filter(
            ([key, cond]) => cond?.类型 === 'debuff' && !String(key || '').startsWith(AUTO_PROJECTED_CONDITION_PREFIX),
          )
          .sort((a, b) => scoreCondition(b[1]) - scoreCondition(a[1]));
        removable.slice(0, Math.max(1, Number(maxCount || 1))).forEach(([key]) => {
          delete targetChar.conditions[key];
          removed.push(key);
          if (targetChar.active_sustains) {
            Object.keys(targetChar.active_sustains).forEach(sustainKey => {
              if (targetChar.active_sustains[sustainKey]?.related_condition === key)
                delete targetChar.active_sustains[sustainKey];
            });
          }
        });
        return removed;
      };

      function settleConditionsAtRoundEnd(char, label) {
        if (!char || !char.conditions) return { log: '', totalDot: 0, expired: [] };

        let totalDot = 0;
        let expired = [];
        let parts = [];

        Object.keys(char.conditions).forEach(key => {
          let cond = char.conditions[key];
          if (!cond) return;

          let combatEffects = cond.combat_effects || {};
          let dot = Math.max(0, combatEffects.dot_damage || 0);
          let hotHealRatio = Math.max(0, Number(combatEffects.hot_heal_ratio || 0));
          if (dot > 0) {
            char.vit = Math.max(0, char.vit - dot);
            totalDot += dot;
            parts.push(`[状态结算] ${label}受[${key}]影响，额外损失 ${dot} 点体力`);
          }
          if (hotHealRatio > 0) {
            const maxVit = Math.max(1, Number(char.vit_max || char.vit || 1));
            const hotHeal = Math.floor(maxVit * hotHealRatio);
            char.vit = Math.min(maxVit, char.vit + hotHeal);
            if (hotHeal > 0) parts.push(`[状态结算] ${label}受[${key}]影响，额外恢复 ${hotHeal} 点体力`);
          }

          if (typeof cond.duration === 'number') {
            cond.duration -= 1;
            if (cond.duration <= 0) expired.push(key);
          }
        });

        expired.forEach(key => {
          delete char.conditions[key];
          if (String(char.active_domain || '') === String(key)) {
            char.active_domain = '无';
          }
          if (char.active_sustains) {
            Object.keys(char.active_sustains).forEach(sustainKey => {
              if (char.active_sustains[sustainKey]?.related_condition === key) delete char.active_sustains[sustainKey];
            });
          }
          parts.push(`[状态消散] ${label}的[${key}]已结束`);
        });

        return { log: parts.join(' '), totalDot, expired };
      }

      function splitSkillCostModes(costStr) {
        const raw = String(costStr || '无').trim();
        if (!raw || raw === '无') return { upfront: '无', sustain: '', hasSustain: false };

        const parts = raw.split(/维持[:：]?/);
        return {
          upfront: (parts[0] || '无').trim() || '无',
          sustain: (parts[1] || '').trim(),
          hasSustain: parts.length > 1,
        };
      }

      function parseCostStringForChar(costStr, char) {
        return parseSkillCostForChar({ 消耗: costStr || '无' }, char);
      }

      function formatParsedCost(parsed) {
        if (!parsed) return '无消耗';
        const parts = [];
        if (parsed.reqSp) parts.push(`魂力:${parsed.reqSp}`);
        if (parsed.reqVit) parts.push(`体力:${parsed.reqVit}`);
        if (parsed.reqMen) parts.push(`精神力:${parsed.reqMen}`);
        return parts.length > 0 ? parts.join(' ') : '无消耗';
      }

      function registerSustainEffect(char, key, config) {
        if (!char || !config || !config.sustain_cost || config.sustain_cost === '无') return;
        if (!char.active_sustains) char.active_sustains = {};
        char.active_sustains[key] = { ...config };
      }

      function resolveActionSustainConfig(char, actionType, skill, stateName) {
        const skillName = skill?.name || actionType || stateName || '持续效果';
        const costParts = splitSkillCostModes(getSkillCostText(skill));
        const trueStateName = stateName || getPrimaryStateName(skill) || '';
        const isWuxingEscape = actionType === '五行遁法';

        if (costParts.hasSustain && costParts.sustain && costParts.sustain !== '无') {
          return {
            name: skillName,
            sustain_cost: costParts.sustain,
            effect_type: actionType?.includes('领域')
              ? 'domain'
              : actionType === '点燃生命之火'
                ? 'life_fire'
                : trueStateName || isWuxingEscape
                  ? 'condition'
                  : 'generic',
            related_condition: trueStateName || (isWuxingEscape ? '五行遁法' : ''),
          };
        }

        if (actionType === '点燃生命之火') {
          return {
            name: skillName,
            sustain_cost: `体力:${Math.max(1, Math.floor((char?.vit_max || 1) * 0.05))}`,
            effect_type: 'life_fire',
            related_condition: '',
          };
        }

        if (['展开斗铠领域', '展开精神领域', '展开武魂领域'].includes(actionType)) {
          return {
            name: skillName,
            sustain_cost: `精神力:${Math.max(30, Math.floor((char?.men_max || 1) * 0.05))}`,
            effect_type: 'domain',
            related_condition: '',
          };
        }

        if ((trueStateName || skillName).includes('真身')) {
          return {
            name: skillName,
            sustain_cost: `魂力:${Math.max(50, Math.floor((char?.sp_max || 1) * 0.05))}`,
            effect_type: 'condition',
            related_condition: trueStateName || skillName,
          };
        }

        return null;

        function settleSustainEffectsAtRoundEnd(char, label) {
          if (!char?.active_sustains) return { log: '', broken: [] };

          const logs = [];
          const broken = [];

          Object.entries(char.active_sustains).forEach(([key, effect]) => {
            if (!effect) return;

            if (effect.effect_type === 'domain' && (!char.active_domain || char.active_domain === '无')) {
              delete char.active_sustains[key];
              return;
            }
            if (effect.effect_type === 'life_fire' && !char.bloodline_power?.life_fire) {
              delete char.active_sustains[key];
              return;
            }
            if (
              effect.effect_type === 'condition' &&
              effect.related_condition &&
              !char.conditions?.[effect.related_condition]
            ) {
              delete char.active_sustains[key];
              return;
            }

            const parsed = parseCostStringForChar(effect.sustain_cost, char);
            if (!parsed.canCast) {
              if (effect.effect_type === 'domain') char.active_domain = '无';
              else if (effect.effect_type === 'life_fire' && char.bloodline_power)
                char.bloodline_power.life_fire = false;
              else if (effect.effect_type === 'condition' && effect.related_condition && char.conditions)
                delete char.conditions[effect.related_condition];

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

          return { log: logs.join(' '), broken };
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
            finisher: 0,
          };

          switch (actor?.type) {
            case '强攻系':
              profile.aggression += 25;
              profile.burst += 20;
              profile.caution -= 5;
              break;
            case '敏攻系':
              profile.mobility += 30;
              profile.aggression += 15;
              profile.caution += 5;
              break;
            case '防御系':
              profile.caution += 30;
              profile.control += 10;
              profile.aggression -= 10;
              break;
            case '控制系':
              profile.control += 30;
              profile.caution += 10;
              break;
            case '辅助系':
            case '治疗系':
            case '食物系':
              profile.caution += 25;
              profile.control += 15;
              profile.aggression -= 15;
              break;
          }

          if (hpRatio < 0.35) {
            profile.caution += 25;
            profile.burst += 10;
          }
          if (hpRatio < 0.2) {
            profile.caution += 35;
            profile.aggression -= 5;
          }
          if (targetHpRatio < 0.3) {
            profile.finisher += 25;
            profile.aggression += 10;
          }
          if (battleState.combatType === '死战' || battleState.isDeadlyFight) {
            profile.aggression += 15;
            profile.burst += 10;
          }
          if (battleState.combatType === '擂台切磋') {
            profile.caution += 10;
            profile.aggression -= 5;
            profile.burst -= 5;
          }
          if (battleState.isChargingHighThreat) {
            profile.control += 20;
            profile.mobility += 10;
          }
          if ((actor?.men_max || 0) > (target?.men_max || 0) * 1.2) profile.control += 10;

          return profile;
        }

        function adjustBehaviorWeight(branchName, baseWeight, actor, target, battleState = {}) {
          if (!baseWeight || baseWeight <= 0) return 0;
          const profile = getBehaviorProfile(actor, target, battleState);
          let weight = baseWeight;

          if (['武魂融合技', '点燃生命之火', '开启真身'].includes(branchName))
            weight += profile.burst * 0.8 + profile.aggression * 0.4;
          else if (branchName === '展开领域') weight += profile.control * 0.8 + profile.caution * 0.3;
          else if (branchName === '召唤魂灵') weight += profile.control * 0.5 + profile.caution * 0.3;
          else if (branchName === '穿戴装备') weight += profile.caution * 0.9;
          else if (branchName === '亡命奔逃') weight += profile.caution * 1.1 - profile.aggression * 0.4;
          else if (branchName === '危机自保') weight += profile.caution * 0.7 + profile.control * 0.5;
          else if (branchName === '强势对轰')
            weight += profile.aggression * 0.9 + profile.burst * 0.5 + profile.finisher * 0.5 - profile.caution * 0.3;
          else if (branchName === '伺机闪避') weight += profile.mobility * 0.9 + profile.caution * 0.4;
          else if (branchName === '肉体兜底') weight += profile.caution * 0.2;

          weight += Math.floor(Math.random() * 11) - 5;
          return Math.max(0, Math.floor(weight));
        }

        function ensureActorDecisionMemory(actor) {
          if (!actor)
            return {
              last_action: '',
              recent_actions: {},
              focus_target: '',
              focus_reason: '',
              focus_ttl: 0,
              countered_skills: {},
            };
          if (!actor.decision_memory) {
            actor.decision_memory = {
              last_action: '',
              recent_actions: {},
              focus_target: '',
              focus_reason: '',
              focus_ttl: 0,
              countered_skills: {},
            };
          }
          if (!actor.decision_memory.recent_actions) actor.decision_memory.recent_actions = {};
          if (!actor.decision_memory.countered_skills) actor.decision_memory.countered_skills = {};
          if (actor.decision_memory.focus_target === undefined) actor.decision_memory.focus_target = '';
          if (actor.decision_memory.focus_reason === undefined) actor.decision_memory.focus_reason = '';
          if (actor.decision_memory.focus_ttl === undefined) actor.decision_memory.focus_ttl = 0;
          return actor.decision_memory;
        }

        function getActorFocusedTarget(actor, candidates = []) {
          const memory = ensureActorDecisionMemory(actor);
          if (!memory.focus_target || Number(memory.focus_ttl || 0) <= 0) return null;
          const target = (candidates || []).find(
            unit => unit && unit.name === memory.focus_target && Number(unit.vit || 0) > 0,
          );
          if (target) return target;
          memory.focus_target = '';
          memory.focus_reason = '';
          memory.focus_ttl = 0;
          return null;
        }

        function setActorFocusTarget(actor, target, reason = '', ttl = 2) {
          const memory = ensureActorDecisionMemory(actor);
          if (!target || Number(target.vit || 0) <= 0) {
            memory.focus_target = '';
            memory.focus_reason = '';
            memory.focus_ttl = 0;
            return;
          }
          memory.focus_target = target.name || '';
          memory.focus_reason = String(reason || '');
          memory.focus_ttl = Math.max(0, Number(ttl || 0));
        }

        function scoreCandidateAction(actor, target, battleState, candidate) {
          if (!candidate) return 0;
          const memory = ensureActorDecisionMemory(actor);
          const branchName = candidate.name || '未命名动作';
          let weight = Math.max(0, Math.floor(candidate.weight || 0));

          const repeatCount = memory.recent_actions[branchName] || 0;
          if (repeatCount > 0) weight -= repeatCount * 12;
          if (memory.last_action === branchName) weight -= 8;

          const targetHpRatio = (target?.vit || 0) / Math.max(1, target?.vit_max || 1);
          if (Number(memory.focus_ttl || 0) > 0) {
            if (
              branchName === '乘胜追击' &&
              ['control_window', 'dot_pressure', 'shared_vision_focus', 'finisher'].includes(memory.focus_reason)
            )
              weight += 10;
            if (branchName === '破防强攻' && memory.focus_reason === 'armor_break_window') weight += 8;
            if (branchName === '断疗压制' && memory.focus_reason === 'anti_heal_window') weight += 8;
          }
          if (branchName === '强势对轰' && targetHpRatio < 0.35) weight += 10;
          if (branchName === '亡命奔逃' && (actor?.vit || 0) / Math.max(1, actor?.vit_max || 1) > 0.35) weight -= 15;
          if (branchName === '危机自保' && battleState?.isChargingHighThreat) weight += 8;

          return Math.max(0, weight);
        }

        function chooseActorActionByCandidates(actor, target, battleState, candidates, phaseLabel) {
          const scoredCandidates = (candidates || []).map(candidate => ({
            ...candidate,
            weight: scoreCandidateAction(actor, target, battleState, candidate),
          }));
          return rollBranchByPriority(scoredCandidates, phaseLabel);
        }

        function getActorSkillCounterPenalty(actor, skillName) {
          if (!actor || !skillName) return 0;
          const memory = ensureActorDecisionMemory(actor);
          return Math.min(45, Number(memory.countered_skills?.[skillName] || 0) * 18);
        }

        function recordActorActionMemory(actor, actionName) {
          if (!actor || !actionName) return;
          const memory = ensureActorDecisionMemory(actor);
          Object.keys(memory.recent_actions).forEach(key => {
            memory.recent_actions[key] = Math.max(0, (memory.recent_actions[key] || 0) - 1);
            if (memory.recent_actions[key] <= 0) delete memory.recent_actions[key];
          });
          if (Number(memory.focus_ttl || 0) > 0) {
            memory.focus_ttl = Math.max(0, Number(memory.focus_ttl || 0) - 1);
            if (memory.focus_ttl <= 0) {
              memory.focus_target = '';
              memory.focus_reason = '';
            }
          }
          Object.keys(memory.countered_skills || {}).forEach(key => {
            memory.countered_skills[key] = Math.max(0, Number(memory.countered_skills[key] || 0) - 1);
            if (memory.countered_skills[key] <= 0) delete memory.countered_skills[key];
          });
          memory.recent_actions[actionName] = (memory.recent_actions[actionName] || 0) + 2;
          memory.last_action = actionName;
        }

        function recordActorSkillCountered(actor, skillName, reason = '') {
          if (!actor || !skillName) return;
          const memory = ensureActorDecisionMemory(actor);
          memory.countered_skills[skillName] = Math.min(3, Number(memory.countered_skills[skillName] || 0) + 1);
          if (reason) memory.last_counter_reason = String(reason);
        }

        function broadcastActorFocusToTeam(actorEntry, battleState, target, reason = '', ttl = 2) {
          if (!actorEntry?.char || !battleState?.combatData || !target) return;
          const team =
            actorEntry.side === 'player'
              ? battleState.combatData.participants.team_player || []
              : battleState.combatData.participants.team_enemy || [];
          team.forEach(member => {
            if (!member || member.name === actorEntry.char.name) return;
            setActorFocusTarget(member, target, reason, Math.max(1, Number(ttl || 0) - 1));
          });
        }

        function evaluateActionCountered(action, finalTarget, reactionAction, settleResult, skillTargetObj = '') {
          if (!action?.skill || !finalTarget) return false;
          if (
            String(skillTargetObj || '').includes('己方') ||
            String(skillTargetObj || '').includes('友方') ||
            String(skillTargetObj || '').includes('自身')
          )
            return false;
          const skillType = getSkillType(action.skill);
          const snapshot = buildConditionTacticalSnapshot(finalTarget);
          const resultText = String(settleResult?.desc || '');
          if (skillType === '输出') {
            return (
              Number(settleResult?.dmg || 0) <= 1 &&
              (reactionAction?.type !== '无法反应' || /躲过|规避|挡下|碾碎|打断|未破防/.test(resultText))
            );
          }
          if (skillType === '控制') {
            const landed = snapshot.isLockedOrControlled || snapshot.hasBadCondition || snapshot.hasAntiHeal;
            return !landed && (reactionAction?.type !== '无法反应' || /免疫|躲过|规避|挡下/.test(resultText));
          }
          return false;
        }

        function updateActorFocusFromAction(
          actor,
          action,
          finalTarget,
          fallbackEnemyTarget = null,
          settleResult = null,
        ) {
          if (!actor || !action) return null;
          const skill = action.skill || {};
          const targetMode = getSkillTarget(skill);
          let focusTarget = null;
          let focusReason = '';
          let ttl = 0;

          if (targetMode.includes('己方') || targetMode.includes('友方')) {
            if (
              hasSkillMechanism(skill, ['共享视野']) &&
              fallbackEnemyTarget &&
              Number(fallbackEnemyTarget.vit || 0) > 0
            ) {
              focusTarget = fallbackEnemyTarget;
              focusReason = 'shared_vision_focus';
              ttl = 3;
            }
          } else if (
            !targetMode.includes('自身') &&
            finalTarget &&
            finalTarget !== actor &&
            Number(finalTarget.vit || 0) > 0
          ) {
            const snapshot = buildConditionTacticalSnapshot(finalTarget);
            const hpRatio = Math.max(0, Number(finalTarget.vit || 0)) / Math.max(1, Number(finalTarget.vit_max || 1));
            focusTarget = finalTarget;
            if (
              snapshot.isLockedOrControlled &&
              (hasSkillMechanism(skill, [
                '硬控',
                '催眠',
                '幻境',
                '标记锁定',
                '打断',
                '软控',
                '位移限制',
                '强制位移',
                '位移交换',
                '强制绑定/锁定',
              ]) ||
                Number(getPrimaryStateCalc(skill)?.lock_level || 0) > 0 ||
                Number(getPrimaryStateCalc(skill)?.reaction_penalty || 0) > 0 ||
                Number(getPrimaryStateCalc(skill)?.cast_speed_penalty || 0) > 0 ||
                Number(getPrimaryStateCalc(skill)?.dodge_penalty || 0) > 0 ||
                Number(getPrimaryStateCalc(skill)?.resource_block_ratio || 0) > 0)
            ) {
              focusReason = 'control_window';
              ttl = 3;
            } else if (
              hasSkillMechanism(skill, ['禁疗']) &&
              (snapshot.hasAntiHeal || Number(getPrimaryStateCalc(skill)?.heal_block_ratio || 0) > 0)
            ) {
              focusReason = 'anti_heal_window';
              ttl = 3;
            } else if (
              Number(getPrimaryDamageEffect(skill)?.穿透修饰 || 0) >= 15 ||
              /破甲|穿透|粉碎/.test(String(skill?.name || ''))
            ) {
              focusReason = 'armor_break_window';
              ttl = 2;
            } else if (
              snapshot.hasDotPressure ||
              hasSkillMechanism(skill, ['持续伤害']) ||
              Number(settleResult?.dmg || 0) >= Math.max(1, Number(finalTarget.vit_max || 1)) * 0.22
            )
              focusReason = 'dot_pressure';
            ttl = 2;
          } else if (hasSkillMechanism(skill, ['斩杀补伤']) || hpRatio < 0.45) {
            focusReason = 'finisher';
            ttl = hpRatio < 0.35 ? 3 : 2;
          }
        }

        setActorFocusTarget(actor, focusTarget, focusReason, ttl);
      consreturn { target: focusTarget, reason: focusReason, ttl };
      }
cons
      consnction buildBattleStateContext(actor, target, combatData, extra = {}) {
        const canFlee = combatData?.allow_flee !== false;
        const isDesperateNoEscape = (actor?.vit || 0) < (actor?.vit_max || 1) * 0.3 && !canFlee;
        return {
          combatType: combatData?.combat_type || '突发遭遇',
          isDeadlyFight:
            extra.isDeadlyFight ??
      cons    ((combatData?.combat_type || '突发遭遇') === '死战' ||
              (combatData?.combat_type || '突发遭遇') === '突发遭遇'),
        consratio: extra.ratio ?? 1,
          playerPower: extra.playerPower ?? 0,
          isChargingHighThreat: !!extra.isChargingHighThreat,
          actorHpRatio: (actor?.vit || 0) / Math.max(1, actor?.vit_max || 1),
          targetHpRatio: (target?.vit || 0) / Math.max(1, target?.vit_max || 1),
          canFlee: canFlee,
          isDesperateNoEscape: isDesperateNoEscape,
          actor,
          target,
          combatData,
          ...extra,
        };
      }

      function chooseAndBuildActorAction(actor, target, battleState, candidates, phaseLabel, logPrefix = '') {
        const choice = chooseActorActionByCandidates(actor, target, battleState, candidates, phaseLabel);
        if (!choice.option) return null;
cons
        coconst action = choice.option.build();
        recordActorActionMemory(actor, choice.option.name || action.type);
        action.log = `${logPrefix}${choice.trace} ${action.log}`.trim();
        return action;
      }

      function collectCombatSkills(charData, alliedTeam = []) {
        return collectUnifiedSkillEntries(charData, alliedTeam, { includePassive: false, includeActive: true });
      }

      function onPlayerAttack(playerInput, options = {}) {
        let combatData = window.BattleUIBridge?.getMVU('world.combat');
        hydrateCombatData(combatData);
        let defender = combatData.participants.enemy;
        let attacker = combatData.participants.player;
        const mode = options.mode === 'multi_round' ? 'multi_round' : 'single_round';
        const modeLabel = mode === 'multi_round' ? '自动续推' : '单回合';
        const maxRounds = mode === 'multi_round' ? 4 : 1;

        // --- 第一步：环境定调与状态快照 ---
      cons// 1. 旁路预判（仅限我方碾压敌方时可直接跳过，且不更新 MVU）
      conslet lvDiff = attacker.lv - defender.lv;
        if (lvDiff >= 30) {
          let systemPrompt = `[战力碾压旁路] 玩家等级碾压对手，无需进行繁琐博弈。请 AI 直接描写玩家以摧枯拉朽之势秒杀敌人的画面！`;
          sendToAI(playerInput, systemPrompt, { requestKind: 'battle_shortcut' });
          return;
        }

        cons 2. 状态快照与控制拦截 (完全基于 Schema 属性驱动)
        defender.is_controlled = false;
        defender.temp_agi_mult = 1.0;
        defender.temp_reaction_bonus = 0;
        defender.temp_reaction_penalty = 0;
        defender.temp_dodge_bonus = 0;
        defendeconstemp_dodge_penalty = 0;
        defender.temp_lock_level = 0;
        defender.temp_control_resist_mult = 1.0;
        defender.temp_cannot_react = false;

        if (defender.conditions) {
          for (let key in defender.conditions) {
            let cond = defender.conditions[key];
            const ce = cond.combat_effects || {};
            if (ce.skip_turn === true || ce.cannot_react === true) {
              defender.is_controlled = true;
            }
            if (cond.stat_mods && cond.stat_mods.agi !== undefined) {
              defender.temp_agi_mult *= cond.stat_mods.agi;
            }
            defender.temp_reaction_bonus += Number(ce.reaction_bonus || 0);
            defender.temp_reaction_penalty += Number(ce.reaction_penalty || 0);
            defender.temp_dodge_bonus += Number(ce.dodge_bonus || 0);
            defender.temp_dodge_penalty += Number(ce.dodge_penalty || 0);
            defender.temp_lock_level += Number(ce.lock_level || 0);
            defender.temp_control_resist_mult *= Number(ce.control_resist_mult || 1.0);
            if (ce.cannot_react === true) defender.temp_cannot_react = true;
          }
        }
        defender.temp_agi_mult = Math.max(0.1, defender.temp_agi_mult);

        let roundCount = 0;
        const battleLog = [];
        let clashExtraPatchOps = [];
        let continueSimulation = true;

        while (roundCount < maxRounds && continueSimulation && defender.vit > 0) {
          roundCount++;
          let consundLog = `[第${roundCount}回合] `;

          let isCharging = attacker.charging_skill != null;
          let playerAction = null;

          // 1. 玩家硬控拦截扫描
          let isPlayerControlled = false;
          if (attacker.conditions) {
            for (let key in attacker.conditions) {
              if (
                attacker.conditions[key].combat_effects &&
                attacker.conditions[key].combat_effects.skip_turn === true
              ) {
                isPlayerControlled = true;
                break;
              }
            }
          }

          if (isPlayerControlled) {
            roundLog += `[状态受控] 玩家处于硬控状态，本回合无法动作！ `;
            playerAction = { action_type: '被控挨打', cast_time: 100, skill: null };
            attacker.charging_skill = null;
          } else if (isCharging) {
            playerAction = attacker.charging_skill;
            if (playerAction.cast_time <= 40) {
              roundLog += `[蓄力完成] 玩家完成了蓄力，释放了[${playerAction.skill.name}]！ `;
              attacker.charging_skill = null;
            conselse {
              playerAction.cast_time -= 30;
              roundLog += `[蓄力中] 玩家正在为[${playerAction.skill.name}]蓄力，当前剩余前摇：${playerAction.cast_time}。本回合无法动作！ `;
              playerAction = { action_type: '蓄力挨打', cast_time: 100, skill: null };
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
                l    if (totalTimeCost + pa.cast_time <= 40) {
              cons  totalTimeCost += pa.cast_time;
                  validPreActions.push(pa);
                } else {
                // 只要超了40，后面所有的动作（包括没放出来的副动作和主动作）全部转为蓄力拖延到下一回合
         carryOverAction = pa;
        cons        carryOverAction.cast_time -= Math.max(0, 40 - totalTimeCost);
                  break;
                }
              }
            }

          cons// 2. 如果副动作还没爆表，轮到尝试塞入主动作
          consif (!carryOverAction) {
              if (totalTimeCost + playerAction.cast_time <= 40) {
                totalTimeCost += playerAction.cast_time;
                // 全套连招完成！顺利打出！
              } econse {
                // 主动作超时了，转为蓄力
                carryOverAction = playerAction;
                carryOverAction.cast_time -= Math.max(0, 40 - totalTimeCost);
              }
            }

            // 执行成功挤入本回合时间片的副动作
            validPreActions.forEach(preAct => {
              let preCostLog = applyActionCost(attacker, preAct);
              if (preCostLog) roundLog += preCostLog + ' ';
              if (preAct.action_type === '穿戴装备') {
            cons  attacker.equip[preAct.equip_target].equip_status = '已装备';
            cons  roundLog += `[连招生效] 玩家在电光火石间成功穿戴了${preAct.equip_target === 'armor' ? '斗铠' : '机甲'}！ `;
              }
            });
            // 为了让后续流程还能认得出主动作，必须将原本的 pre_actions 覆写为实际生效的这几个
            playerAction.pre_actions = validPreActions;
cons
            // 3. 判定本回合到底是出手，还是蓄力挨打
            if (carryOverAction) {
              attacker.charging_skill = carryOverAction;
              roundLog += `[连招中断/转蓄力] 动作太过繁琐或前摇过长！玩家开始为[${carryOverAction.skill?.name || carryOverAction.action_type}]进行蓄力准备，当前剩余前摇：${carryOverAction.cast_time}。本回合失去主攻击机会！ `;
              // 主动作被没收，变成了“蓄力挨打”态，用来触发后续的防御与闪避博弈
              playerAction = { action_type: '蓄力挨打', cast_time: 100, skill: null };
            } else {
              if (playerAction.action_type !== '施法失败') {
                let costLog = applyActionCost(attacker, playerAction);
                if (costLog) roundLog += costLog + ' ';
              }
            }
          }cons
cons
          let settleResult = executeClash(playerAction, npcAction, combatData);
          roundLog += npcAction.log + ' ' + settleResult.desc;
          if (Arconsy.isArray(settleResult.extraPatchOps) && settleResult.extraPatchOps.length)
            clasconsxtraPatchOps.push(...settleResult.extraPatchOps);

          if (attacker.charging_skill != null) {
            let damageRatio = settleResult.dmg / attacker.vit_max;
            let isControlled = attacker.conditions && attacker.conditions['眩晕'];

            let hasSuperArmor = false;
            if (attacker.conditions) {
              for (let key in attacker.conditions) {
                if (
                  attacker.conditions[key].combat_effects?.super_armor === true ||
                  key.includes('霸体') ||
                  key.includes('真身')
                )
                  hasSuperArmor = true;
              }
            }

            const npcSkillType = getSkillType(npcAction.skill);
            if (npcAction.type === '危机自保' && npcSkillType === '控制' && getSkillCastTime(npcAction.skill) < 10) {
              let pMult = getWoundMult(attacker);
              let dMult = getWoundMult(defender);
              if (defender.men_max > attacker.men_max || defender.agi * dMult > attacker.agi * pMult) {
                if (hasSuperArmor) {
        cons        roundLog += ` NPC释放[${npcAction.skill.name}]试图打断，但玩家处于霸体状态，强行免疫了控制！`;
                } else {
                  let backlashDmg = Math.floor(attacker.vit_max * 0.05);
                  attacker.vit -= backlashDmg;
                  if (!attacker.conditions) attacker.conditions = {};
                  attacker.conditions['僵直'] = {
                    类型: 'debuff',
                    层数: 1,
                    描述: '施法被打断的反噬',
                    duration: 1,
                    stat_mods: { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 },
                    combat_effects: { skip_turn: true, dot_damage: 0, armor_pen: 0 },
                  };
                  roundLog += ` NPC释放[${npcAction.skill.name}]成功打断玩家施法！玩家遭到反噬，承受 ${backlashDmg} 点真伤并陷入[僵直]！`;
                  attacker.charging_skill = null;
                  let attackerUpkeep = settleSustainEffectsAtRoundEnd(attacker, '玩家');
                  let defenderUpkeep = settleSustainEffectsAtRoundEnd(defender, 'NPC');
                  if (attackerUpkeep.log) roundLog += ` ${attackerUpkeep.log}`;
                  if (defenderUpkeep.log) roundLog += ` ${defenderUpkeep.log}`;
                  let attackerRoundEnd = settleConditionsAtRoundEnd(attacker, '玩家');
                  let defenderRoundEnd = settleConditionsAtRoundEnd(defender, 'NPC');
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
              delete attacker.conditions['眩晕'];
            }
          }

          // 简单判断 NPC 是否被打断 (如果玩家伤害极高或带有硬控，视为打断)
          const playerStateCalc = getPrimaryStateCalc(playerAction.skill);
          const playerInterruptChance = Number(
            getSkillEffects(playerAction.skill).find(e => e?.机制 === '打断')?.中断概率 || 0,
          );
          let isNpcInterrupted =
            settleResult.dmg / defender.vit_max >= 0.15 ||
            playerStateCalc.skip_turn === true ||
            getPrimaryStateFlags(playerAction.skill).includes('硬控') ||
            (playerInterruptChance > 0 && Math.random() <= Math.min(1, playerInterruptChance)) ||
            (Number(settleResult.interrupt_bonus || 0) > 0 &&
              Math.random() <= Math.min(1, Number(settleResult.interrupt_bonus || 0)));

          if (npcAction.type === '穿戴装备') {
            if (!isNpcInterrupted) {
              defender.equip[npcAction.skill.equip_target].equip_status = '已装备';
              roundLog += ` [装备生效] NPC成功穿戴了${npcAction.skill.equip_target === 'armor' ? '斗铠' : '机甲'}，防御力大增！`;
            } else {
        cons    roundLog += ` [穿戴失败] 玩家的猛烈攻击强行打断了NPC的装备穿戴过程！`;
            }
          }
cons
          cons --- 第四步：打击烈度与破防标尺 ---
          let finalDmg = settleResult.dmg;
          const reactiveDefense = resolveReactiveDefenseOnDamage(attacker, defender, finalDmg);
          let appliedDamage = 0;
          finalDmg = reactiveDefense.damage;
          if (reactiveDefense.counterDamage > 0)
            attacker.vit = Math.max(0, Number(attacker.vit || 0) - reactiveDefense.counterDamage);
          if (reactiveDefense.log) roundLog += ` ${reactiveDefense.log}`;
          ifconsfinalDmg > 0) {
            if (finalDmg < defender.def * 0.1) {
              defender.vit -= 1;
              appliedDamage = 1;
            consroundLog += ` [未破防] 攻击如同刮痧，NPC仅强制扣除 1 点体力。`;
            } else {
              defender.vit -= finalDmg;
              appliedDamage = finalDmg;
              if (finalDmg > defender.sp_max * 0.5) {
                if (!defender.conditions) defender.conditions = {};
                defender.conditions['重度流血'] = {
                  类型: 'debuff',
            cons    层数: 1,
                  描述: '重创导致的流血',
                  duration: 3,
                  stat_mods: { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 },
                  combat_effects: { skip_turn: false, dot_damage: Math.floor(defender.vit_max * 0.05), armor_pen: 0 },
                };
                roundLog += ` [重创打击] 伤害极高！NPC遭到重创，被附加[重度流血]状态！`;
              }
        cons  }
        cons}
          const defenderInterruptLog = resolveCastInterruptOnDamage(
            defender,
            playerAction,
        cons  appliedDamage,
        cons  settleResult,
            'NPC',
          );
          if (defenderInterruptLog) roundLog += ` ${defenderInterruptLog}`;

          // --- 第五步：装备护主与战损结算 ---
          let combatType = combatData.combat_type || '突发遭遇';

          if (defender.vit < defender.vit_max * 0.1) {
            let hasMech = defender.equip?.mech?.lv !== '无' && defender.equip?.mech?.status !== '重创';
            let hasArmor = defender.equip?.armor?.equip_status === '已装备';

            if (combatType === '擂台切磋' && defender.vit <= defender.vit_max * 0.05) {
              defender.vit = Math.floor(defender.vit_max * 0.05); // 强制锁血 5%
              roundLog += ` [擂台保护] 胜负已分！裁判强行介入，终止了致命一击！`;
              continueSimulation = false; // 强制结束战斗
            } else if (hasMech || hasArmor) {
              defender.vit = Math.floor(defender.vit_max * 0.1);
              let armorLog = applyArmorDamage(defender);
              roundLog += ` [装备护主] 致命打击触发替死锁血！NPC体力强制锁定在10%！${armorLog}`;
            } else if (combatType === '升灵台虚拟战斗' || combatType === '魂灵塔冲塔') {
              // 虚拟战斗中，敌方体力归零照常死亡，如果是己方或判定特殊保护，需要锁定体力并标记退出
              let saveLog = triggerDeathSave(defender);
              if (saveLog) {
                defender.vit = Math.floor(defender.vit_max * 0.1);
                roundLog += ` ${saveLog}`;
              } else {
      cons        // 虚拟环境，如果是玩家/模拟死亡也是正常走到 vit <= 0，靠 settleBattle 拦截
              }
            } else {
              let saveLog = triggerDeathSave(defender);
              if (saveLog) {
                defender.vit = Math.floor(defender.vit_max * 0.1);
                roundLog += ` ${saveLog}`;
      cons      }
      cons    }
          }

          let attackerUpkeep = settleSustainEffectsAtRoundEnd(attacker, '玩家');
          let defenderUpkeep = settleSustainEffectsAtRoundEnd(defender, 'NPC');
          if (attackerUpkeep.log) roundLog += ` ${attackerUpkeep.log}`;
          if (defenderUpkeep.log) roundLog += ` ${defenderUpkeep.log}`;

          let attackerRoundEnd = settleConditionsAtRoundEnd(attacker, '玩家');
          let defenderRoundEnd = settleConditionsAtRoundEnd(defender, 'NPC');
          if (attackerRoundEnd.log) roundLog += ` ${attackerRoundEnd.log}`;
          if (defenderRoundEnd.log) roundLog += ` ${defenderRoundEnd.log}`;

          if (attacker.vit <= 0 || defender.vit <= 0) {
            continueSimulation = false;
          } else if (attacker.charging_skill == null) {
            if (mode === 'single_round') {
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
      cons      }
      cons    }
          }

          battleLog.push(roundLog);
        }

        let isWin = defender.vit <= 0;
        const unresolvedReason =
          !isWin && attacker.vit > 0 && defender.vit > 0
            ? mode === 'single_round'
              ? 'single_round_limit'
              : 'simulation_stopped'
            : '';
        let extraPatchOps = [];
        let settleResult = settleBattle(attacker, defender, isWin, {
          mode,
          roundCount,
          maxRounds,
          unresolvedReason,
          combatData,
        });
        if (clashExtraPatchOps.length) extraPatchOps.push(...clashExtraPatchOps);
        if (settleResult.log) battleLog.push(settleResult.log);
        if (settleResult.extraPatchOps) extraPatchOps.push(...settleResult.extraPatchOps);

        const mvuUpdate =
          window.BattleUIBridge?.persistCombatData?.(combatData, {
            analysis:
              'Frontend battle arbitration already produced the exact combat result. Apply the following JSONPatch exactly as given.',
            extraPatchOps,
          }) || null;

        let systemPrompt = `[前端暗箱演算完毕][${modeLabel}] 共进行 ${roundCount} 回合。\n战报：\n${battleLog.join('\n')}\n请严格根据战报描写画面！`;
        if (mvuUpdate?.updateVariableText) {
          systemPrompt += `\n\n[Front-end state JSON]\nThe following block is a front-end generated reference payload, not an MVU command. Do not output another variable-update wrapper. If variable maintenance is needed later, copy only the patch field exactly as-is.\n${mvuUpdate.updateVariableText}`;
        }
        sendToAI(playerInput, systemPrompt, { mvuUpdate, requestKind: 'battle_arbitration' });
      }

      // ==========================================
      // 📍 2. 战前消耗与战后结算区 (彻底净化版)
      // ==========================================
      fuconstion applyActionCost(attackerChar, playerAction) {
        const stats = attackerChar.stat || attackerChar;
        const status = attackerChar.status || {};
        let log = '';

        // 💥 1. 通用真实面板扣费逻辑 (支持固定值与百分比，绝不硬编码！)
        if (playerAction.skill && playerAction.skill.消耗 !== '无') {
          const costParts = splitSkillCostModes(playerAction.skill.消耗);
          const parsedCost = parseCostStringForChar(costParts.upfront, attackerChar);

          if (parsedCost.canCast) {
            stats.sp -= parsedCost.reqSp;
            stats.vit -= parsedCost.reqVit;
            stats.men -= parsedCost.reqMen;

            const sustainConfig = resolveActionSustainConfig(
              attackerChar,
              playerAction.action_type,
              playerAction.skill,
              getPrimaryStateName(playerAction.skill) || '无',
            );
            const shouldRegisterSustain =
              costParts.hasSustain ||
              ['展开斗铠领域', '展开精神领域', '展开武魂领域', '点燃生命之火'].includes(playerAction.action_type) ||
              (sustainConfig?.related_condition || sustainConfig?.name || '').includes('真身');
            if (shouldRegisterSustain && sustainConfig) {
              if (costParts.hasSustain && costParts.sustain) sustainConfig.sustain_cost = costParts.sustain;
              registerSustainEffect(
                attackerChar,
                `${playerAction.action_type || 'skill'}:${playerAction.skill.name}`,
                sustainConfig,
              );
            }

            log = `[战前消耗] 释放[${playerAction.skill.name}]，扣除 ${parsedCost.reqSp ? '魂力:' + parsedCost.reqSp : ''} ${parsedCost.reqVit ? '体力:' + parsedCost.reqVit : ''} ${parsedCost.reqMen ? '精神力:' + parsedCost.reqMen : ''}。${shouldRegisterSustain ? '(已登记持续维持)' : ''}`;
          } else {
            playerAction.action_type = '施法失败';
            log = `[状态枯竭] 自身状态不足以支撑[${playerAction.skill.name}]的启动消耗，施法失败！`;
            return log;
          }
        }

        // 💥 2. 纯机制类状态切换 (不涉及具体数值伤害，仅改变底层状态)
        if (playerAction.action_type === '吸血反哺') {
          let ratio = playerAction.heal_ratio > 0 ? playerAction.heal_ratio : 0.3;
          let spGain = Math.floor(stats.sp_max * ratio);
          let vitGain = Math.floor(stats.vit_max * ratio);
          stats.sp = Math.min(stats.sp_max, stats.sp + spGain);
          stats.vit = Math.min(stats.vit_max, stats.vit + vitGain);
          log = `[机制反哺] 触发吸血/减耗机制，强制恢复状态！`;
        } else if (playerAction.action_type === '元素剥离') {
          if (!hasBattleUnlockedAttributeSet(attackerChar, ['水', '火', '风', '土'])) {
            playerAction.action_type = '法则失败';
            log = `[权限不足] 尚未集齐水火风土四基础调用权，无法发动元素剥离！`;
          } else {
            applyStateToCharacter(
              defenderChar,
              {
                状态名称: '元素剥离',
                特殊机制标识: '削弱/高阶衍生',
                持续回合: 2,
                面板修改比例: { str: 1.0, def: 0.82, agi: 0.96, sp_max: 1.0, vit_max: 1.0, men_max: 0.97 },
                计算层效果: { ...createEmptyCombatEffectMap(), reaction_penalty: 0.08, control_resist_mult: 0.9 },
              },
              '元素剥离',
              false,
            );
            log = `[元素剥离] 凑齐水火风土后的另类调用发动，直接剥离目标外层元素结构与属性护持！`;
          }
        } else if (playerAction.action_type === '五行剥离') {
          if (!hasBattleUnlockedAttributeSet(attackerChar, ['金', '木', '水', '火', '土'])) {
            playerAction.action_type = '法则失败';
            log = `[权限不足] 尚未集齐金木水火土五行调用权，无法发动五行剥离！`;
          } else {
            applyStateToCharacter(
              defenderChar,
              {
                状态名称: '五行剥离',
                特殊机制标识: '削弱/高阶衍生',
                持续回合: 2,
                面板修改比例: { str: 1.0, def: 0.75, agi: 0.92, sp_max: 1.0, vit_max: 1.0, men_max: 0.95 },
                计算层效果: {
                  ...createEmptyCombatEffectMap(),
                  reaction_penalty: 0.12,
                  control_resist_mult: 0.82,
                  lock_level: 1,
                },
              },
              '五行剥离',
              false,
            );
            log = `[五行剥离] 集齐五行后的另类调用发动，目标五行护持被强行剥离，结构与反应同步受压！`;
          }
        } else if (playerAction.action_type === '五行遁法') {
          const attackerBaseSp = Math.max(1, Number(attackerChar?.sp_max || attackerChar?.stat?.sp_max || 1));
          const defenderBaseSp = Math.max(1, Number(defenderChar?.sp_max || defenderChar?.stat?.sp_max || 1));
          const armorReady = defenderChar?.equip?.armor?.equip_status === '已装备';
          const mechReady =
            defenderChar?.equip?.mech?.equip_status === '已装备' && defenderChar?.equip?.mech?.status !== '重创';
          const canDisableMetalEquip = defenderBaseSp <= attackerBaseSp * 1.1;
          if (!hasBattleUnlockedAttributeSet(attackerChar, ['金', '木', '水', '火', '土'])) {
            playerAction.action_type = '法则失败';
            log = `[权限不足] 尚未集齐金木水火土五行调用权，无法发动五行遁法！`;
          } else {
            applyStateToCharacter(
              attackerChar,
              {
                状态名称: '五行遁法',
                特殊机制标识: '增益/高阶衍生',
                持续回合: 2,
                面板修改比例: { str: 1.0, def: 1.0, agi: 1.12, sp_max: 1.0, vit_max: 1.0, men_max: 1.05 },
                计算层效果: {
                  ...createEmptyCombatEffectMap(),
                  dodge_bonus: 0.18,
                  reaction_bonus: 0.1,
                  attacker_speed_bonus: 0.08,
                  cast_speed_bonus: 0.08,
                },
              },
              '五行遁法',
              true,
            );
            const disabledEquipments = [];
            if (canDisableMetalEquip && armorReady) {
              defenderChar.equip.armor.equip_status = '失效';
              disabledEquipments.push('斗铠');
            }
            if (canDisableMetalEquip && mechReady) {
              defenderChar.equip.mech.equip_status = '失效';
              disabledEquipments.push('机甲');
            }
            log = `[五行遁法] 集齐五行后的另类调用发动，自身遁入五行流转，身法、规避与反应显著提升！`;
            if (disabledEquipments.length)
              log += ` [金属失效] 对方基础魂力未超过自身 10%，${disabledEquipments.join('、')}被五行遁法压制而暂时失效！`;
            else if ((armorReady || mechReady) && !canDisableMetalEquip)
              log += ` [装备稳固] 对方基础魂力超出压制阈值，金属装备未被撼动。`;
          }
        } else if (playerAction.action_type === '点燃生命之火') {
          if (attackerChar.bloodline_power) {
            attackerChar.bloodline_power.life_fire = true;
            const sustainConfig = resolveActionSustainConfig(
              attackerChar,
              playerAction.action_type,
              playerAction.skill,
              '',
            );
            if (sustainConfig)
              registerSustainEffect(
                attackerChar,
                `life_fire:${playerAction.skill?.name || '点燃生命之火'}`,
                sustainConfig,
              );
            log += ` [底蕴透支] 强行点燃生命之火！气血如烘炉般燃烧，全属性临时翻倍！(警告：战后熄灭将面临毁灭性反噬)`;
      cons  } else {
      cons    playerAction.action_type = '法则失败';
      cons    log = `[状态枯竭] 未觉醒相关血脉，无法点燃生命之火！`;
      cons  }
        }
        // 领域状态挂载 (扣费已在上面通用逻辑完成，这里只挂载标识)
      conselse if (playerAction.action_type === '展开斗铠领域') {
      cons  status.active_domain =
            attackerChar.equip?.armor?.lv >= 4 ? '【四字斗铠领域】全开(未定)' : '【三字斗铠领域】全开(未定)';
          const sustainConfig = resolveActionSustainConfig(
            attackerChar,
            playerAction.action_type,
            playerAction.skill,
      cons    '',
          );
          if (sustainConfig) registerSustainEffect(attackerChar, `domain:${playerAction.action_type}`, sustainConfig);
          log += ` [领域降临] 斗铠法则主场展开！`;
        } else if (playerAction.action_type === '展开精神领域') {
          status.active_domain = '【精神领域】全开';
          const sustainConfig = resolveActionSustainConfig(
      cons    attackerChar,
            playerAction.action_type,
        cons  playerAction.skill,
            '',
          );
          if (sustainConfig) registerSustainEffect(attackerChar, `domain:${playerAction.action_type}`, sustainConfig);
          log += ` [领域降临] 精神法则主场展开！`;
        } else if (playerAction.action_type === '展开武魂领域') {
          status.active_domain = '【武魂领域】全开';
          const sustainConfig = resolveActionSustainConfig(
            attackerChar,
            playerAction.action_type,
            playerAction.skill,
            '',
          );
          if (sustainConfig) registerSustainEffect(attackerChar, `domain:${playerAction.action_type}`, sustainConfig);
          log += ` [领域降临] 武魂本源领域展开！`;
        }

        return log;
      }
cons
      funcconson settleBattle(attackerChar, defenderChar, isWin, options = {}) {
        leconslog = '';
        let extraPatchOps = [];
        let attackerStats = attackerChar.stat || attackerChar;
        leconsdefenderStats = defenderChar.stat || defenderChar;
        leconsdefenderName = defenderChar.name || '敌人';

        // 读cons斗类型
        let combatData = options.combatData || window.BattleUIBridge?.getMVU('world.combat');
        let combatType = combatData.combat_type || '突发遭遇';
        const preferredPlayerName = String(window.BattleUIBridge?.getMVU('sys.player_name') || '').trim();
        const attackerName = String(
          attackerChar?.name || combatData?.participants?.player?.name || preferredPlayerName || '主角',
        );
        const attackerPath = `/char/${escapeJsonPointerSegment(attackerName)}`;
        let inventory =
          window.BattleUIBridge?.getMVU(`char.${attackerName}.inventory`) ||
          (preferredPlayerName ? window.BattleUIBridge?.getMVU(`char.${preferredPlayerName}.inventory`) : null) ||
          window.BattleUIBridge?.getMVU('char.主角.inventory') ||
          {};

        // --- 触发世界战斗图鉴录入 ---
        let bestiary = window.BattleUIBridge?.getMVU('world.bestiary') || {};
        if (defenderName && defenderName !== '敌人' && defenderName !== '未知') {
        conslet monsterEntry = bestiary[defenderName];
          if (!monsterEntry) {
            extraPatchOps.push({
              op: 'add',
              path: `/world/bestiary/${defenderName}`,
              value: { 交手次数: 1, 首次记录: `由 ${attackerName} 在${combatType}中遭遇` },
            });
          } else {
            extraPatchOps.push({
              op: 'replace',
              path: `/world/bestiary/${defenderName}/交手次数`,
              value: (monsterEntry.交手次数 || 1) + 1,
            });
          }
        }
cons
        if (combatType === '升灵台虚拟战斗') {
          cons (isWin) {
            let killedAge = combatData.killed_age || defenderStats.age || 100;
            let partySize = combatData.party_size || 1;
            let ticket = combatData.ascension_ticket || '初级升灵台门票';
            let maxAge = ticket === '高级升灵台门票' ? 100000 : ticket === '中级升灵台门票' ? 20000 : 3000;
            killedAge = Math.min(killedAge, maxAge);

            let rings = Object.keys(attackerChar.rings || {});
            let totalRings = rings.length;
            if (totalRings > 0) {
              let gain = Math.floor(killedAge / partySize / totalRings);
              log = `[升灵台结算] 击溃虚拟魂兽！化为纯净修为能量涌入体内(${partySize}人平分)，拥有 ${totalRings} 个魂环均获得大约 ${gain} 年修为提升！(请 AI 描写吸收能量的画面)`;
              rings.forEach(rIndex => {
                const oldAge = attackerChar.rings[rIndex].年限 || 10;
                extraPatchOps.push({
                  op: 'replace',
                  path: `${attackerPath}/rings/${rIndex}/年限`,
                  value: oldAge + gain,
                });
              });
            } else {
              log = `[升灵台结算] 虚拟魂兽死亡！但玩家尚未拥有魂环，无法吸收升灵能量，能量缓缓消散...`;
        cons  }
          } else {
            log = `[升灵台保护] 玩家受到致命创伤，升灵台保护机制触发！一道接引光芒落下，强制将其弹出升灵台。(虚拟战败，无实质损伤，但终止了本次历练)`;
            attackerChar.vit = 1;
          }
          return { log, extraPatchOps };
        cons

        if (combatType === '魂灵塔冲塔') {
          let floor = combatData.floor || 1;
          if (isWin) {
          conslet ageDesc = '十年';
            if (floor >= 40) ageDesc = '十万年';
            else if (floor >= 30) ageDesc = '万年';
            else if (floor >= 20) ageDesc = '千年';
            else if (floor >= 10) ageDesc = '百年';

            log = `🏆[冲塔成功] 镇守第 ${floor} 层的 ${defenderName} 被彻底击溃！玩家成功通关本层，获得了该层魂灵的【五折购买特权】，并获赠【${ageDesc}魂灵(冲塔自选)】！(请 AI 描写通关奖励降落的场景)`;
            extraPatchOps.push({
              op: 'replace',
              path: `${attackerPath}/tower_records/discount_available/${floor}`,
              value: true,
            });

          conslet itemName = `${ageDesc}魂灵(冲塔自选)`;
            const escapedItemName = escapeJsonPointerSegment(itemName);
            let currentItem = inventory[itemName];
            if (currentItem) {
              extraPatchOps.push({
                op: 'replace',
                path: `${attackerPath}/inventory/${escapedItemName}/数量`,
                value: (currentItem.数量 || 0) + 1,
            cons});
            } else {
              extraPatchOps.push({
                op: 'replace',
                path: `${attackerPath}/inventory/${escapedItemName}`,
                value: { 数量: 1, 类型: '魂灵', 品质: '普通', 描述: `魂灵塔第${floor}层战利品` },
              });
            }
          conselse {
            log = `💀[冲塔失败] 玩家遭到 ${defenderName} 重创，魂灵塔阵法排斥之力发动，将其强行传送出塔外！(请 AI 描写重伤弹出塔外的虚弱状态)`;
            attackerChar.vit = 1;
          }
          return { log, extraPatchOps };
        }cons
cons
        if (isWin) {
          let lvDiff = defenderStats.lv - attackerStats.lv;

          const fList = Object.keys(defenderChar.social?.factions || {});
          const isBeast =
            fList.includes('魂兽一族') || fList.some(name => name.includes('魂兽')) || defenderStats.age >= 100;
          const isAbyss = fList.includes('深渊生物') || fList.some(name => name.includes('深渊'));
          let isBeastOrAbyss = isBeast || isAbyss;

          if (lvDiff <= -5) {
            log = `[实战结算] 击败了对手，但因等级碾压(等级差≤-5)，毫无实战感悟，收益为 0。`;
          } else {
            let myTalentScore =
              { 绝世妖孽: 5, 顶级天才: 4, 天才: 3, 优秀: 2, 正常: 1, 劣等: 0 }[attackerStats.talent_tier] || 1;
            let targetTalentScore = 1;

            if (isBeastOrAbyss) {
              if (defenderStats.age >= 100000) targetTalentScore = 5;
              else if (defenderStats.age >= 10000) targetTalentScore = 3;
              else if (defenderStats.age >= 1000) targetTalentScore = 2;
              else targetTalentScore = 0;
            } else {
              targetTalentScore =
                { 绝世妖孽: 5, 顶级天才: 4, 天才: 3, 优秀: 2, 正常: 1, 劣等: 0 }[defenderStats.talent_tier] || 1;
            }
            let talentMult = Math.max(0.1, 1 + (targetTalentScore - myTalentScore) * 0.2);

            let lvMult = 1.0;
            if (lvDiff >= 3) lvMult = 1.5 + (lvDiff - 3) * 0.2;

            let historyMult = 1.0;
            if (!isBeastOrAbyss) {
              if (!attackerChar.combat_history) attackerChar.combat_history = {};
              let history = attackerChar.combat_history[defenderName];
                     if (history.count === 1) historyMult = 0.5;
                else if (history.count === 2) historyMult = 0.1;
                else if (history.count >= 3) historyMult = 0;
              }
            }

            let finalMult = talentMult * lvMult * historyMult;

              log = `[实战结算] 击败了对手，但因多次交手已无新感悟，收益递减为 0。`;
            } else {
              let baseGain = 10;
              let finalGain = Math.floor(baseGain * finalMult);

              if (finalGain > 0) {
                if (!attackerStats.trained_bonus)
                  attackerStats.trained_bonus = { str: 0, def: 0, agi: 0, vit_max: 0, men_max: 0, sp_max: 0 };
                attackerStats.trained_bonus.str += finalGain;
                attackerStats.trained_bonus.def += finalGain;
                attackerStats.trained_bonus.agi += finalGain;
                attackerStats.trained_bonus.vit_max += finalGain;
                attackerStats.trained_bonus.men_max += Math.floor(finalGain * 0.5);
                log = `[实战结算] 战斗胜利！(获得 ${finalGain} 点实战六维成长！`;
              } else {
                log = `[实战结算] 战斗胜利，但综合评估后收益微乎其微。`;
              }
            }
        cons}
cons
          if (!isBeastOrAbyss) {
          consif (!attackerChar.combat_history) attackerChar.combat_history = {};
            if (!attackerChar.combat_history[defenderName])
              attackerChar.combat_history[defenderName] = { count: 0, last_tick: 0 };
            attackerChar.combat_history[defenderName].count += 1;
          }
          if (combatType === '擂台切磋') {
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
          if (options.unresolvedReason === 'single_round_limit') {
            log = `[实战结算] 单回合仲裁结束，当前尚未分出胜负，双方仍在激烈对峙。`;
          } else if (options.unresolvedReason === 'simulation_stopped') {
            log = `[实战结算] 暗箱续推暂告一段落，当前仍未决出胜负，战局进入新的对峙阶段。`;
          } else {
            log = `[实战结算] 战斗失败或逃跑，未能获得实战成长。`;
          }
        }

        return { log, extraPatchOps };
      }

      function applyArmorDamage(defender) {
        let log = '';
        if (defender.equip.mech.lv !== '无' && defender.equip.mech.status !== '重创') {
          if (defender.equip.mech.status === '完好') {
            defender.equip.mech.status = '受损';
            defender.equip.mech.品质系数 = 0.5;
            log = `[战损] 敌方最外层的机甲装甲大面积凹陷，状态降级为【受损】！`;
          } else if (defender.equip.mech.status === '受损') {
            defender.equip.mech.status = '重创';
            defender.equip.mech.品质系数 = 0;
            log = `[战损] 敌方机甲核心法阵爆裂，状态降级为【重创】，彻底瘫痪！`;
          }
          return log;
        }
        if (defender.equip.armor.equip_status === '已装备') {
          let parts = Object.keys(defender.equip.armor.parts);
          let intactParts = parts.filter(p => defender.equip.armor.parts[p].状态 === '完好');
          if (intactParts.length > 0) {
            let targetPart = intactParts[Math.floor(Math.random() * intactParts.length)];
            defender.equip.armor.parts[targetPart].状态 = '碎裂';
            defender.equip.armor.parts[targetPart].品质系数 = 0;
            log = `[战损] 敌方贴身的斗铠【${targetPart}】承受不住透体的重击，轰然碎裂！`;
          }
        }
        return log;
      }

      function triggerDeathSave(defender) {
        if (!defender?.conditions) return null;
        const candidate = Object.entries(defender.conditions)
          .map(([key, cond]) => ({ key, cond, ce: cond?.combat_effects || {} }))
          .filter(entry => Number(entry.ce.death_save_count || 0) > 0)
          .sort((a, b) => Number(b.ce.death_save_count || 0) - Number(a.ce.death_save_count || 0))[0];
        if (!candidate) return null;
        if (!candidate.cond.combat_effects) candidate.cond.combat_effects = {};
        const nextCount = Math.max(0, Number(candidate.cond.combat_effects.death_save_count || 0) - 1);
        candidate.cond.combat_effects.death_save_count = nextCount;
        return `[濒死守护] ${defender.name || '目标'}触发[${candidate.key}]，强行保住最后一口气！剩余保护次数:${nextCount}`;
      }

      function applyShieldToCharacter(targetChar, shieldAmount, duration = 1, sourceName = '护盾') {
        const amount = Math.max(0, Math.floor(Number(shieldAmount || 0)));
        if (!targetChar || amount <= 0) return 0;
        if (!targetChar.conditions) targetChar.conditions = {};
        const stateName = /护盾|屏障|结界/.test(String(sourceName || ''))
          ? String(sourceName || '护盾')
          : `${sourceName || '护盾'}护盾`;
        const existing = targetChar.conditions[stateName];
        if (existing) {
          existing.duration = Math.max(Number(existing.duration || 0), Number(duration || 0));
          existing.shield_value = Math.max(0, Number(existing.shield_value || 0)) + amount;
          return amount;
        }
        targetChar.conditions[stateName] = {
          类型: 'buff',
          层数: 1,
          描述: `由[${sourceName || stateName}]附加`,
          duration: Number(duration || 0),
          stat_mods: { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 },
          combat_effects: { ...createEmptyCombatEffectMap() },
          shield_value: amount,
        };
        return amount;
      }

      function resolveReactiveDefenseOnDamage(attacker, defender, incomingDamage) {
        let damage = Math.max(0, Math.floor(Number(incomingDamage || 0)));
        if (!defender?.conditions || damage <= 0) return { damage, counterDamage: 0, log: '' };
        const parts = [];
        let counterDamage = 0;
        for (const [key, cond] of Object.entries(defender.conditions)) {
          const ce = cond?.combat_effects || {};
          if (Number(ce.block_count || 0) > 0) {
            if (cond.combat_effects) cond.combat_effects.block_count = Math.max(0, Number(ce.block_count || 0) - 1);
            damage = 0;
            parts.push(`[格挡触发] ${defender.name || '目标'}以[${key}]抵消了本次攻击！`);
            break;
          }
        }
        if (damage > 0) {
          for (const [key, cond] of Object.entries(defender.conditions)) {
            const shieldValue = Math.max(0, Number(cond?.shield_value || 0));
            if (shieldValue <= 0) continue;
            const absorbed = Math.min(damage, shieldValue);
            cond.shield_value = Math.max(0, shieldValue - absorbed);
            damage -= absorbed;
            parts.push(`[护盾吸收] ${defender.name || '目标'}的[${key}]吸收了 ${absorbed} 点伤害。`);
            if (cond.shield_value <= 0) {
              delete defender.conditions[key];
              parts.push(`[护盾破碎] ${defender.name || '目标'}的[${key}]被彻底击碎。`);
            }
            if (damage <= 0) break;
          }
        }
        if (damage > 0) {
          for (const [key, cond] of Object.entries(defender.conditions)) {
            const ce = cond?.combat_effects || {};
            const ratio = Number(ce.counter_attack_ratio || 0);
            if (ratio > 0) {
              counterDamage = Math.max(counterDamage, Math.max(1, Math.floor(damage * ratio)));
              parts.push(`[反击触发] ${defender.name || '目标'}借[${key}]展开反击，回震 ${counterDamage} 点伤害！`);
      cons    }
      cons  }
      cons}
        return { damage, counterDamage, log: parts.join(' ') };
      }

      function resolveCastInterruptOnDamage(
        targetChar,
        attackAction,
        inflictedDamage,
        settleResult = {},
        label = '目标',
      ) {
      consif (!targetChar?.charging_skill) return '';
      consconst targetEffects = targetChar.conditions
          ? Object.values(targetChar.conditions).map(c => c?.combat_effects || {})
          : [];
        const hasSuperArmor =
          targetEffects.some(ce => ce?.super_armor === true) ||
          Object.keys(targetChar.conditions || {}).some(key => /霸体|真身/.test(String(key || '')));
        const damageRatio = Math.max(0, Number(inflictedDamage || 0)) / Math.max(1, Number(targetChar.vit_max || 1));
        const stateCalc = getPrimaryStateCalc(attackAction?.skill);
        const specialFlags = String(getPrimaryStateEffect(attackAction?.skill)?.特殊机制标识 || '无');
      consconst interruptEffect = getSkillEffects(attackAction?.skill).find(effect => effect?.机制 === '打断') || {};
        const interruptChance = Math.max(
          0,
          Number(interruptEffect?.中断概率 || 0),
      cons  Number(settleResult?.interrupt_bonus || 0),
        );
      consconst hardControl =
          stateCalc.skip_turn === true || stateCalc.cannot_react === true || specialFlags.includes('硬控');
        const controlled = targetEffects.some(ce => ce?.skip_turn === true || ce?.cannot_react === true);
        const interruptTriggered = interruptChance > 0 && Math.random() <= Math.min(1, interruptChance);
        if (hasSuperArmor && (hardControl || interruptTriggered))
          return `[霸体强抗] ${label}凭借霸体稳住阵脚，蓄力未被打断！`;
        if (!hasSuperArmor && (damageRatio >= 0.3 || hardControl || controlled || interruptTriggered)) {
          targetChar.charging_skill = null;
          return interruptTriggered
            ? `[打断生效] ${label}的蓄力被强行打断！`
            : `[蓄力打断] ${label}受到重创或控制，蓄力被强制打断！`;
        }
        return '';
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

        const atkCombat = attacker?.conditions
          ? Object.values(attacker.conditions).map(c => c?.combat_effects || {})
          : [];
        const totalAtkSpeedBonus = atkCombat.reduce((sum, ce) => sum + Number(ce.attacker_speed_bonus || 0), 0);
        const totalCastSpeedBonus = atkCombat.reduce((sum, ce) => sum + Number(ce.cast_speed_bonus || 0), 0);
        const totalCastSpeedPenalty = atkCombat.reduce((sum, ce) => sum + Number(ce.cast_speed_penalty || 0), 0);

        let castPenalty = Math.min(
          0.9,
          Math.max(0, playerAction.cast_time / 100 - totalCastSpeedBonus + totalCastSpeedPenalty),
        );
        let attackerSpeed = attacker.agi * pMult * (1 - castPenalty) + totalAtkSpeedBonus;

        let defenderReaction =
          defender.agi * dMult * (defender.temp_agi_mult || 1.0) +
          defender.men_max +
          (defender.temp_reaction_bonus || 0) -
          (defender.temp_reaction_penalty || 0);
        let ratio = defenderReaction / Math.max(1, attackerSpeed);

        if (defender.temp_cannot_react) ratio = 0;

        if (combatData && combatData.initiative !== '无' && combatData.initiative !== defender.name) {
          ratio *= 0.5;
        }

        return ratio;
      }

      function formatBattleTickToCalendarDateText(tickValue) {
        const safeTick = Math.max(0, Number(tickValue || 0));
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

      function buildSkillCreationPatchBundle(skill, inventory = {}, ownerName = '') {
        const effects = Array.isArray(skill?._效果数组) ? skill._效果数组 : [];
        const creationEffects = effects.filter(effect => ['生成造物', '造物生成'].includes(String(effect?.机制 || '')));
        if (!creationEffects.length) return { patchOps: [], log: '' };

        const patchOps = [];
        const logs = [];
        const preferredOwnerName = String(window.BattleUIBridge?.getMVU('sys.player_name') || '').trim();
        const currentTick = Number(window.BattleUIBridge?.getMVU('world.time.tick') || 0);
        const resolvedOwnerName = String(ownerName || preferredOwnerName || '主角');
        const ownerPath = `/char/${escapeJsonPointerSegment(resolvedOwnerName)}/inventory`;

        creationEffects.forEach(effect => {
          const itemName = String(skill?.魂技名 || effect?.魂技名 || skill?.name || '临时造物').trim() || '临时造物';
          const escapedItemName = escapeJsonPointerSegment(itemName);
          const addCount = Math.max(1, Number(effect?.数量 || 1));
          const template = deepClone(effect?.背包模板 || {});
          const itemType = String(effect?.产物类型 || template?.类型 || '魂技造物');
          const triggerMode = String(effect?.触发方式 || template?.触发方式 || (itemType === '食物' ? '食用' : '使用'));
      cons  const relativeExpiryTick = Math.max(0, Number(effect?.有效期tick || 0));
      cons  const nextItem = {
      cons    ...template,
      cons    数量: addCount,
            类型: itemType,
            触发方式: triggerMode,
            使用效果: deepClone(template?.使用效果 || effect?.使用效果 || []),
            来源技能: String(template?.来源技能 || skill?.魂技名 || effect?.魂技名 || itemName),
          };
          if (relativeExpiryTick > 0) {
            nextItem.有效期至tick = currentTick + relativeExpiryTick;
            nextItem.有效期至 = formatBattleTickToCalendarDateText(nextItem.有效期至tick);
          } else {
            nextItem.有效期至tick = 0;
            nextItem.有效期至 = '无';
          }
          if (!nextItem.描述 && template?.描述) nextItem.描述 = template.描述;

          const currentItem = inventory[itemName];
          const itemPath = `${ownerPath}/${escapedItemName}`;
          if (currentItem && typeof currentItem === 'object') {
            patchOps.push({ op: 'replace', path: `${itemPath}/数量`, value: Number(currentItem.数量 || 0) + addCount });
            if (nextItem.触发方式 !== undefined)
              patchOps.push({ op: 'replace', path: `${itemPath}/触发方式`, value: nextItem.触发方式 });
            if (nextItem.使用效果 !== undefined)
              patchOps.push({ op: 'replace', path: `${itemPath}/使用效果`, value: nextItem.使用效果 });
      cons    if (nextItem.描述 !== undefined)
              patchOps.push({ op: 'replace', path: `${itemPath}/描述`, value: nextItem.描述 });
            if (nextItem.有效期至 !== undefined)
              patchOps.push({ op: 'replace', path: `${itemPath}/有效期至`, value: nextItem.有效期至 });
            if (nextItem.有效期至tick !== undefined)
              patchOps.push({ op: 'replace', path: `${itemPath}/有效期至tick`, value: nextItem.有效期至tick });
          } else {
            patchOps.push({ op: 'replace', path: itemPath, value: nextItem });
          }
cons
          if (itemType === '食物') logs.push(`生成了可食用造物【${itemName}】×${addCount}`);
          else logs.push(`生成了临时造物【${itemName}】×${addCount}`);
        });

        return {
          patchOps,
          log: logs.length ? ` [造物生成] ${logs.join('，')}。` : '',
        };
      }

      consnction executeClash(playerAction, npcAction, combatData) {
      conshydrateCombatData(combatData);
      conslet attacker = combatData.participants.player;
      conslet attackerFinalStat = attacker.final || attacker;
      conslet defender = combatData.participants.enemy;
      conslet defenderFinalStat = defender.final || defender;
      conslet result = { dmg: 0, desc: '', extraPatchOps: [] };

        playerAction.skill = normalizeSkillData(
          playerAction.skill || {
            nconse: '普通攻击',
            技能类型: '输出',
            _效果数组: [
              { 机制: '系统基础', 消耗: '无', 对象: '敌方/单体', 技能类型: '输出', cast_time: 10 },
              { 机制: '直接伤害', 目标: '敌方单体', 威力倍率: 100, 伤害类型: '物理近战', 穿透修饰: 0 },
            ],
          },
          playerAction.skill?.name || '普通攻击',
        );
        if (npcAction.skill) {
          npcAction.skill = normalizeSkillData(
            npcAction.skill,
            npcAction.skill.name || npcAction.skill.技能名称 || '未知技能',
          );
        }

        const getEffect = (sk, types) => getSkillEffects(sk).find(e => types.includes(e.机制)) || {};

        let pClash = getEffect(playerAction.skill, ['直接伤害', '多段伤害', '持续伤害', '延迟爆发']);
        let pState = getEffect(playerAction.skill, ['状态挂载']);
        if (!pState || typeof pState !== 'object' || Array.isArray(pState)) pState = {};
        if (!pState.状态名称) pState.状态名称 = '无';
        if (!pState.特殊机制标识) pState.特殊机制标识 = '无';
        if (!pState.目标) pState.目标 = getSkillTarget(playerAction.skill);
        if (!pState.面板修改比例 || typeof pState.面板修改比例 !== 'object') pState.面板修改比例 = {};
        if (!pState.计算层效果 || typeof pState.计算层效果 !== 'object')
          pState.计算层效果 = createEmptyCombatEffectMap();
        if (typeof pState.持续回合 !== 'number') pState.持续回合 = Number(pState.持续回合 || 0);
        let nClash = getEffect(npcAction.skill, [
          '直接伤害',
          '多段伤害',
          '持续伤害',
          '延迟爆发',
          '护盾',
          '减伤',
          '格挡',
        ]);

        applyRuntimeMechanismEffects(
          playerAction.skill,
          attacker,
      cons  attackerFinalStat,
          defender,
          defenderFinalStat,
          pState,
        );

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
            if (
              attacker.conditions[key].combat_effects?.super_armor === true ||
              key.includes('霸体') ||
              key.includes('真身')
            )
              hasSuperArmor = true;
          }
        }

        const npcSkillType = getSkillType(npcAction.skill);
        if (npcAction.type === '危机自保' && npcSkillType === '控制' && getSkillCastTime(npcAction.skill) < 10) {
          if (defenderFinalStat.men_max > attackerFinalStat.men_max || dAgi > aAgi) {
            if (hasSuperArmor) {
              result.desc = `NPC释放[${npcAction.skill.name}]试图打断，但玩家处于霸体状态，强行免疫了控制！`;
            } else {
              result.desc = `NPC释放[${npcAction.skill.name}]成功打断玩家施法！玩家遭到反噬。`;
              return result;
            }
          }
        }

        const actorCharData = attacker?.name ? window.BattleUIBridge?.getMVU(`char.${attacker.name}`) : null;
        const preferredPlayerName = String(window.BattleUIBridge?.getMVU('sys.player_name') || '').trim();
        const attackerName = String(attacker?.name || '').trim();
        const canPersistCreation =
          !!actorCharData || (!!preferredPlayerName && attackerName === preferredPlayerName) || attackerName === '主角';
        const creationPatchBundle = buildSkillCreationPatchBundle(
          playerAction.skill,
          actorCharData?.inventory || attacker?.inventory || {},
          actorCharData?.name || attackerName || preferredPlayerName || '主角',
        );
        if (canPersistCreation && creationPatchBundle.patchOps.length > 0) {
          result.extraPatchOps = creationPatchBundle.patchOps;
          result.desc += creationPatchBundle.log;
          const hasDirectClash = Number(pClash.威力倍率 || 0) > 0;
          const hasStateApply = String(pState?.状态名称 || '无') !== '无';
          if (!hasDirectClash && !hasStateApply) return result;
        }

        const playerTargetMode = String(getSkillTarget(playerAction.skill));
        let isAOE = /群体|全场/.test(playerTargetMode) || pClash.伤害类型 === '纯精神冲击';
        let grazeMultiplier = 1.0;

        const pCalc = pState.计算层效果 || {};
        const currentSkillHitBonus = Number(pCalc.hit_bonus || 0);
        const currentSkillHitPenalty = Number(pCalc.hit_penalty || 0);
        const currentSkillDodgePenalty = Number(pCalc.dodge_penalty || 0);
        const currentSkillLockLevel = Number(pCalc.lock_level || 0);
        const attackerConditionEffects = attacker.conditions
          ? Object.values(attacker.conditions).map(c => c?.combat_effects || {})
          : [];
        const defenderConditionEffects = defender.conditions
          ? Object.values(defender.conditions).map(c => c?.combat_effects || {})
          : [];
        const attackerIsSilenced = attackerConditionEffects.some(ce => ce?.silence === true);
        const attackerIsDisarmed = attackerConditionEffects.some(ce => ce?.disarm === true);
        const attackerIsBlinded = attackerConditionEffects.some(ce => ce?.blind === true);
        const attackerInterruptBonus = attackerConditionEffects.reduce(
          (sum, ce) => sum + Number(ce?.interrupt_bonus || 0),
          0,
        );
        const actionEffects = getSkillEffects(playerAction.skill);
        const directHealEffect = actionEffects.find(effect => isBattleRecoverEffect(effect, ['vit'])) || null;
        const directSpEffect = actionEffects.find(effect => isBattleRecoverEffect(effect, ['sp'])) || null;
        const directMenEffect = actionEffects.find(effect => isBattleRecoverEffect(effect, ['men'])) || null;
        consnst directCleanseEffect = actionEffects.find(effect => ['解控', '净化'].includes(effect?.机制)) || null;
        const directVolatileEffect = actionEffects.find(effect => effect?.机制 === '高波动随机值') || null;
        const directExecuteEffect = actionEffects.find(effect => effect?.机制 === '斩杀补伤') || null;
        const directDamageToHealEffect = actionEffects.find(effect => effect?.机制 === '伤害转回复') || null;
        const directShieldEffect = actionEffects.find(effect => effect?.机制 === '护盾') || null;
        const directFieldEffect = actionEffects.find(effect => effect?.机制 === '召唤与场地') || null;
        const directCopyEffect = actionEffects.find(effect => effect?.机制 === '复制') || null;
        const directStateExchangeEffect = actionEffects.find(effect => effect?.机制 === '状态交换') || null;
        const selfMirrorEffect = actionEffects.find(effect => effect?.机制 === '自身也受影响') || null;
        const directRandomTargetEffect = actionEffects.find(effect => effect?.机制 === '随机目标') || null;
        const directSelfSacrificeEffect = actionEffects.find(effect => effect?.机制 === '自残换收益') || null;
        const skillName = String(
          playerAction?.skill?.name || playerAction?.skill?.技能名称 || playerAction?.action_type || '',
        cons
        const isBasicAttack =
          !playerAction?.skill || skillName === '普通攻击' || playerAction?.action_type === '常规攻击';
        const isPhysicalMeleeAction = String(pClash.伤害类型 || '') === '物理近战';
        const mirrorEffectToSelf = effect => (effect ? { ...effect, 目标: '自身', 对象: '自身' } : null);
        if (playerAction?.skill) delete playerAction.skill._runtime_random_target;
        ifconsdirectRandomTargetEffect) {
          const originalTargetText = String(getSkillTarget(playerAction.skill) || '敌方/单体');
          if (!/自身|己方|友方/.test(originalTargetText)) {
            const redirectChance = Math.max(0, Math.min(1, Number(directRandomTargetEffect.偏移概率 || 0.5)));
            const redirectedToSelf = Math.random() < redirectChance;
            playerAction.skill._runtime_random_target = redirectedToSelf ? '自身' : originalTargetText;
            result.desc += redirectedToSelf
              ? ` [随机目标] 技能轨迹紊乱，本次目标偏转为自身。`
      cons      : ` [随机目标] 技能轨迹紊乱，但仍锁定原目标。`;
          }
        }
        const effectTargetsSelf = effect =>
          !!effect && resolveSkillEffectTargetCharacter(playerAction.skill, effect, attacker, defender) === attacker;
        const primaryResolvedTarget = resolveSkillEffectTargetCharacter(
          playerAction.skill,
          { 目标: getSkillTarget(playerAction.skill), 对象: getSkillTarget(playerAction.skill) },
          attacker,
          defender,
        );
        const hostileTargetRedirectedToSelf =
          String(playerAction?.skill?._runtime_random_target || '') === '自身' &&
          /敌/.test(String(getSkillTarget(playerAction.skill) || ''));
        if (attackerIsSilenced && !isBasicAttack) {
          result.desc = `[沉默压制] ${attacker.name || '攻击方'}被沉默，无法顺利释放[${skillName || '技能'}]！`;
          result.interrupt_bonus = attackerInterruptBonus;
          return result;
        }
      consif (attackerIsDisarmed && (isBasicAttack || isPhysicalMeleeAction)) {
          result.desc = `[缴械压制] ${attacker.name || '攻击方'}被缴械，无法完成${isBasicAttack ? '普通攻击' : '近战技'}！`;
          result.interrupt_bonus = attackerInterruptBonus;
          return result;
        }
        const attackerHitBonus = attackerConditionEffects.reduce((sum, ce) => sum + Number(ce.hit_bonus || 0), 0);
        const attackerHitPenalty =
          attackerConditionEffects.reduce((sum, ce) => sum + Number(ce.hit_penalty || 0), 0) +
          (attackerIsBlinded ? 0.35 : 0);

        if (!isAOE && npcAction.type === '伺机闪避') {
          let absoluteDodgeThreshold = (aAgi + attackerFinalStat.men_max) * 1.5;
          const effectiveDAgi = dAgi * (defender.temp_agi_mult || 1.0);
          if (effectiveDAgi + (defender.temp_dodge_bonus || 0) > absoluteDodgeThreshold) {
            result.desc = 'NPC触发绝对闪避，残影规避了所有伤害！';
            return result;
          }

          let dodgeRate = (effectiveDAgi / (aAgi + attackerFinalStat.men_max)) * 50;
          dodgeRate +=
            (defender.temp_dodge_bonus || 0) * 100 -
            ((defender.temp_dodge_penalty || 0) + currentSkillDodgePenalty) * 100;
          dodgeRate -= (currentSkillHitBonus + attackerHitBonus - (currentSkillHitPenalty + attackerHitPenalty)) * 100;
          dodgeRate -= ((defender.temp_lock_level || 0) + currentSkillLockLevel) * 8;
          let roll = Math.random() * 100;

          if (roll < dodgeRate) {
            result.desc = `NPC凭借敏捷优势惊险躲过了攻击！`;
            return result;
          } else if (roll < dodgeRate + 30) {
            let grazePercent = (roll - dodgeRate) / 30;
            grazeMultiplier = 0.3 + 0.5 * grazePercent;
            result.desc = `NPC未能完全闪避，被攻击擦伤！(承受 ${(grazeMultiplier * 100).toFixed(0)}% 伤害)`;
            if (attackerIsBlinded) result.desc += ` [目盲干扰] 攻击轨迹受视觉偏差影响。`;
          }
        }

        let remainPower = pClash.威力倍率 || 0;
        let npcShield = nClash.护盾值 || 0;

        if (npcAction.type === '强势对轰') {
          remainPower -= nClash.威力倍率 || 0;
          if (remainPower <= 0) {
            result.desc = `NPC的[${npcAction.skill.name}]威力更胜一筹，碾碎了玩家的攻击！`;
            return result;
          }
          result.desc = `双方对轰！玩家威力占优，余威继续命中。`;
        } else if (npcAction.type === '危机自保' && npcSkillType === '防御') {
          remainPower -= nClash.威力倍率 || 0;
          if (remainPower <= 0) {
            result.desc = `NPC的防御技能完美挡下了这一击。`;
            return result;
          }
          result.desc = `攻击突破了NPC的防御技能阻碍。`;
        }

        let finalDmg = 0;
        let dmgType = pClash.伤害类型 || '物理近战';

        const conditionArmorPen = attackerConditionEffects.reduce((sum, ce) => {
          const raw = Number(ce.armor_pen || 0);
          return sum + (Math.abs(raw) <= 1 ? raw * 100 : raw);
        }, 0);
        let actualDef = dDef * (1 - ((pClash.穿透修饰 || 0) + conditionArmorPen) / 100);
        actualDef = Math.max(1, actualDef);
        const soulDriveScale = getSoulDriveScale(attacker, defender);

        if (dmgType === '物理近战') finalDmg = remainPower * (aStr / actualDef) * soulDriveScale;
        else if (dmgType === '能量AOE')
          finalDmg = remainPower * (attackerFinalStat.men_max / actualDef) * soulDriveScale;
        else if (dmgType === '纯精神冲击')
          finalDmg = remainPower * (attackerFinalStat.men_max / defenderFinalStat.men_max);

        if (npcAction.type === '肉体兜底') {
          finalDmg = finalDmg / 1.2;
          result.desc = 'NPC收缩防御，用纯肉体硬抗了这一击。';
        }

        if (npcShield > 0) {
          finalDmg = Math.max(0, finalDmg - npcShield);
          if (finalDmg === 0) {
            result.desc += ` 但被NPC的 ${npcShield} 点绝对护盾完全吸收！`;
          } else {
            result.desc += ` 击碎了NPC的 ${npcShield} 点护盾后，剩余威力命中本体。`;
          }
        }

        let fluctuation = 0.9 + Math.random() * 0.2;
        if (directVolatileEffect) {
          const low = Number(directVolatileEffect.波动下限 ?? 0.5);
          const high = Number(directVolatileEffect.波动上限 ?? 1.8);
          if (Number.isFinite(low) && Number.isFinite(high) && high > low) {
            fluctuation = low + Math.random() * (high - low);
            result.desc += ` [高波动] 技能威力剧烈波动，本次倍率:${fluctuation.toFixed(2)}。`;
          }
        }
        finalDmg = finalDmg * fluctuation * grazeMultiplier;

        const totalDamageReduction = Math.min(
          0.9,
          defenderConditionEffects.reduce((maxVal, ce) => Math.max(maxVal, Number(ce.damage_reduction || 0)), 0),
        );
        const totalFinalDamageMult = attackerConditionEffects.reduce(
          (mult, ce) => mult * Number(ce.final_damage_mult || 1.0),
          1.0,
        );
        const totalFinalDamageBonus = attackerConditionEffects.reduce(
          (sum, ce) => sum + Number(ce.final_damage_bonus || 0),
          0,
        );
        const totalTrueDamageRatio = attackerConditionEffects.reduce(
          (sum, ce) => sum + Number(ce.bonus_true_damage_ratio || 0),
          0,
        );
        const directDamageToHealRatio = Number(directDamageToHealEffect?.转换比例 || 0);
        const totalLifeStealRatio =
          attackerConditionEffects.reduce((sum, ce) => sum + Number(ce.life_steal_ratio || 0), 0) +
          Number(pClash.吸血比例 || 0) +
          directDamageToHealRatio;
        finalDmg = finalDmg * (1 - totalDamageReduction) * totalFinalDamageMult + totalFinalDamageBonus;
        if (totalTrueDamageRatio > 0) {
          const extraTrueDamage = Math.floor(
            (attackerFinalStat.men_max || attacker.men_max || 0) * totalTrueDamageRatio,
          );
          if (extraTrueDamage > 0) {
            finalDmg += extraTrueDamage;
            result.desc += ` [法则追伤] 额外附加 ${extraTrueDamage} 点真实伤害。`;
          }
        }
        if (directExecuteEffect) {
          const judgeKey = String(directExecuteEffect.判定属性 || 'vit_ratio');
          const threshold = Number(directExecuteEffect.判定阈值 ?? 0.2);
          let executeSuccess = true;
          if (judgeKey) {
            const attackerValue = getMechanismJudgeValue(attacker, attackerFinalStat, judgeKey);
            const defenderValue = getMechanismJudgeValue(defender, defenderFinalStat, judgeKey);
            if (['vit_ratio', 'hp_ratio', 'sp_ratio', 'men_ratio'].includes(judgeKey))
              executeSuccess = defenderValue <= threshold;
            else executeSuccess = attackerValue / Math.max(1, defenderValue) >= threshold;
          }
          const execPayload = executeSuccess ? directExecuteEffect.成功参数 || {} : directExecuteEffect.失败参数 || {};
          const execMult = Number(execPayload.final_damage_mult || 1);
          const execBonus = Number(execPayload.final_damage_bonus || 0);
          if (execMult !== 1 || execBonus !== 0) {
            finalDmg = finalDmg * execMult + execBonus;
            if (executeSuccess) result.desc += ` [斩杀补伤] 目标跌入收割阈值，斩杀补伤生效！`;
          }
        }

        result.dmg = Math.floor(finalDmg);
        result = applyHighTierMechanics(attacker, defender, playerAction, result);

        if (directSelfSacrificeEffect && Number(directSelfSacrificeEffect.体力代价 || 0) > 0) {
          result.desc += ` [自残换收益] 额外献祭 ${Number(directSelfSacrificeEffect.体力代价 || 0)} 点体力，换取 x${Number(directSelfSacrificeEffect.增伤倍率 || 1.25).toFixed(2)} 威力。`;
        }
        if (hostileTargetRedirectedToSelf && Number(result.dmg || 0) > 0) {
          result.backlash_dmg = Number(result.backlash_dmg || 0) + Number(result.dmg || 0);
          result.desc += ` [目标偏转] 本次伤害改为命中自身。`;
          result.dmg = 0;
        }

        if (result.dmg > 0 && totalLifeStealRatio > 0 && !Number(result.backlash_dmg || 0)) {
          const lifeStealAmount = Math.floor(result.dmg * totalLifeStealRatio);
          if (lifeStealAmount > 0) {
            attacker.vit = Math.min(
              attackerFinalStat.vit_max || attacker.vit_max || attacker.vit,
              attacker.vit + lifeStealAmount,
            );
            result.desc +=
              directDamageToHealRatio > 0
                ? ` [伤转回生] 玩家将部分伤害转化为回复，额外恢复了 ${lifeStealAmount} 点体力。`
                : ` [吸取反哺] 玩家额外恢复了 ${lifeStealAmount} 点体力。`;
          }
        }

        if (Number(result.backlash_dmg || 0) > 0) {
          const backlashDamage = Math.max(0, Math.floor(Number(result.backlash_dmg || 0)));
          attacker.vit = Math.max(0, Number(attacker.vit || 0) - backlashDamage);
          result.desc += ` [反噬结算] 玩家额外承受了 ${backlashDamage} 点反噬伤害。`;
        }
        if (result.dmg > 0) {
          result.desc += ` 造成了 ${result.dmg} 点最终伤害。`;
          if (selfMirrorEffect && primaryResolvedTarget !== attacker) {
            const selfEchoDamage = Math.max(1, Math.floor(result.dmg));
            attacker.vit = Math.max(0, Number(attacker.vit || 0) - selfEchoDamage);
            result.desc += ` [自身反馈] 技能余波同步反噬自身，额外承受 ${selfEchoDamage} 点伤害。`;
          }
        }

        const applyImmediateRecoveryEffect = (effect, resourceKey, labelText) => {
          if (!effect || Number(result.backlash_dmg || 0) > 0) return 0;
          const targetObj = resolveSkillEffectTargetCharacter(playerAction.skill, effect, attacker, defender);
          const targetFinalStat = targetObj === attacker ? attackerFinalStat : defenderFinalStat;
          const targetText = String(effect?.目标 || effect?.对象 || getSkillTarget(playerAction.skill) || '敌方/单体');
          const ratio = Number(effect.数值 || 0);
          if (!(ratio > 0)) return 0;
          const isFriendly = /自身|己方|友方/.test(targetText);
          const supportScale = isFriendly ? getSupportEffectScale(attacker, targetObj) : 1;
          const targetConditionEffects = targetObj.conditions
            ? Object.values(targetObj.conditions).map(c => c?.combat_effects || {})
            : [];
          let maxResource = 0;
          if (resourceKey === 'vit') maxResource = Number(targetFinalStat.vit_max || targetObj.vit_max || 0);
          else if (resourceKey === 'sp') maxResource = Number(targetFinalStat.sp_max || targetObj.sp_max || 0);
          else maxResource = Number(targetFinalStat.men_max || targetObj.men_max || 0);
          if (!(maxResource > 0)) return 0;
          const totalHealBlockRatio =
            resourceKey === 'vit'
              ? Math.min(
                  1,
                  targetConditionEffects.reduce((maxVal, ce) => Math.max(maxVal, Number(ce.heal_block_ratio || 0)), 0),
                )
              : 0;
          const totalFinalHealMult =
            resourceKey === 'vit'
              ? attackerConditionEffects.reduce((mult, ce) => mult * Number(ce.final_heal_mult || 1.0), 1.0)
              : 1.0;
          const totalFinalHealBonus =
            resourceKey === 'vit'
              ? attackerConditionEffects.reduce((sum, ce) => sum + Number(ce.final_heal_bonus || 0), 0)
              : 0;
          const totalResourceBlockRatio =
            resourceKey === 'vit'
              ? 0
              : Math.min(
                  1,
                  targetConditionEffects.reduce(
                    (maxVal, ce) => Math.max(maxVal, Number(ce.resource_block_ratio || 0)),
                    0,
                  ),
                );
          let amount = Math.floor(
            maxResource *
              ratio *
              supportScale *
              (resourceKey === 'vit' ? totalFinalHealMult * (1 - totalHealBlockRatio) : 1 - totalResourceBlockRatio),
          );
          if (resourceKey === 'vit') amount += totalFinalHealBonus;
          amount = Math.max(0, amount);
          if (!amount) return 0;
          targetObj[resourceKey] = Math.min(maxResource, Number(targetObj[resourceKey] || 0) + amount);
          result.desc += ` [机制触发] ${targetObj === attacker ? '自身' : targetObj.name}恢复了 ${amount} 点${labelText}。`;
          return amount;
        };

        const applyShieldEffect = effect => {
          if (!effect || Number(result.backlash_dmg || 0) > 0) return 0;
          const targetObj = resolveSkillEffectTargetCharacter(playerAction.skill, effect, attacker, defender);
          const targetText = String(effect?.目标 || effect?.对象 || getSkillTarget(playerAction.skill) || '敌方/单体');
          const isFriendly = targetObj === attacker || /自身|己方|友方/.test(targetText);
          const supportScale = isFriendly ? getSupportEffectScale(attacker, targetObj) : 1;
          const totalShieldGainMult = attackerConditionEffects.reduce(
            (mult, ce) => mult * Number(ce.shield_gain_mult || 1.0),
            1.0,
          );
        consconst totalShieldGainBonus = attackerConditionEffects.reduce(
            (sum, ce) => sum + Number(ce.shield_gain_bonus || 0),
            0,
          );
          const baseShield = Number(effect.护盾值 || 0);
          let shieldAmount = Math.floor(baseShield * supportScale * totalShieldGainMult) + totalShieldGainBonus;
          shieldAmount = Math.max(0, shieldAmount);
          if (!shieldAmount) return 0;
          applyShieldToCharacter(
            targetObj,
            shieldAmount,
            Number(effect.持续回合 || 1),
            String(effect.状态名称 || skillName || '护盾'),
          );
          result.desc += ` [护盾生成] ${targetObj === attacker ? '自身' : targetObj.name}获得 ${shieldAmount} 点护盾。`;
          return shieldAmount;
        };

        const applyFieldEffect = effect => {
          if (!effect) return false;
          const targetText = String(effect?.目标 || effect?.对象 || getSkillTarget(playerAction.skill) || '');
          const fieldHolder = /敌/.test(targetText) && !/全场/.test(targetText) ? defender : attacker;
          const fieldName = String(effect?.实体名称 || effect?.状态名称 || `${skillName || '场地效果'}`);
          if (!fieldHolder || !fieldName || fieldName === '无') return false;
          if (!fieldHolder.conditions) fieldHolder.conditions = {};
          const existing = fieldHolder.conditions[fieldName];
          if (existing) {
            existing.duration = Math.max(Number(existing.duration || 0), Number(effect?.持续回合 || 0));
            existing.描述 = effect?.核心机制描述 || existing.描述 || `由[${skillName || fieldName}]展开`;
          } else {
            fieldHolder.conditions[fieldName] = {
              类型: /敌/.test(targetText) && !/全场/.test(targetText) ? 'debuff' : 'buff',
              层数: 1,
              描述: effect?.核心机制描述 || `由[${skillName || fieldName}]展开`,
              duration: Number(effect?.持续回合 || 0),
              stat_mods: { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 },
              combat_effects: { ...createEmptyCombatEffectMap() },
              field_desc: effect?.核心机制描述 || '',
            };
          }
          if (/领域|场地|结界/.test(fieldName)) fieldHolder.active_domain = fieldName;
          result.desc += ` [场地展开] ${fieldHolder === attacker ? '自身' : fieldHolder.name}展开了[${fieldName}]。`;
          return true;
        };

        const removeConditionWithSustain = (char, key) => {
          if (!char?.conditions || !char.conditions[key]) return null;
          const snapshot = deepClone(char.conditions[key]);
          delete char.conditions[key];
          if (char.active_sustains) {
            Object.keys(char.active_sustains).forEach(sustainKey => {
              if (char.active_sustains[sustainKey]?.related_condition === key) delete char.active_sustains[sustainKey];
            });
          }
          return snapshot;
        };

        const putConditionWithUniqueKey = (char, baseKey, cond) => {
          if (!char) return '';
          if (!char.conditions) char.conditions = {};
          let key = String(baseKey || '状态').trim() || '状态';
          if (!char.conditions[key]) {
            char.conditions[key] = cond;
            return key;
          }
          let index = 1;
          while (char.conditions[`${key}·${index}`]) index += 1;
          const nextKey = `${key}·${index}`;
          char.conditions[nextKey] = cond;
          return nextKey;
        };

        const isTransferableConditionEntry = ([key, cond], expectedType = 'any') => {
          if (!key || !cond) return false;
          if (String(key).startsWith(AUTO_PROJECTED_CONDITION_PREFIX)) return false;
          if (expectedType !== 'any' && String(cond?.类型 || '') !== expectedType) return false;
          if (Number(cond?.shield_value || 0) > 0) return false;
          if (cond?.field_desc) return false;
          if (/护盾|屏障|结界|领域|场地/.test(String(key))) return false;
          return true;
        };

        const scoreTransferableCondition = (cond = {}) => {
          const ce = cond?.combat_effects || {};
          let score = Number(cond?.duration || 0);
          score += ce.skip_turn ? 1000 : 0;
          score += ce.cannot_react ? 800 : 0;
          score += Number(ce.lock_level || 0) * 100;
          score += Number(ce.counter_attack_ratio || 0) * 120;
          score += Number(ce.damage_reduction || 0) * 100;
          score += Math.max(0, Number(ce.final_damage_mult || 1) - 1) * 120;
          score += Math.max(0, Number(ce.final_heal_mult || 1) - 1) * 100;
          score += Number(ce.dot_damage || 0) / 5;
          score += Number(ce.heal_block_ratio || 0) * 100;
          score += Number(ce.resource_block_ratio || 0) * 100;
          score += Number(ce.reaction_bonus || 0) * 60;
          score += Number(ce.reaction_penalty || 0) * 60;
          score += Number(ce.dodge_bonus || 0) * 60;
          score += Number(ce.dodge_penalty || 0) * 60;
          score += Number(ce.hit_bonus || 0) * 60;
          score += Number(ce.cast_speed_bonus || 0) * 60;
          score += Number(ce.cast_speed_penalty || 0) * 60;
          Object.values(cond?.stat_mods || {}).forEach(value => {
            score += Math.abs(Number(value || 1) - 1) * 100;
          });
          return score;
        };

        const pickTransferableCondition = (char, preferredTypes = ['any']) => {
          if (!char?.conditions) return null;
          for (const expectedType of preferredTypes) {
            const candidates = Object.entries(char.conditions)
              .filter(entry => isTransferableConditionEntry(entry, expectedType))
              .sort((a, b) => scoreTransferableCondition(b[1]) - scoreTransferableCondition(a[1]));
            if (candidates.length > 0) return { key: candidates[0][0], cond: candidates[0][1] };
          }
          return null;
        };

        const applyCopyEffect = effect => {
          if (!effect) return false;
          const sourceObj = resolveSkillEffectTargetCharacter(playerAction.skill, effect, attacker, defender);
          const candidate = pickTransferableCondition(sourceObj, [
            String(effect?.复制类型 || 'buff') === 'debuff' ? 'debuff' : 'buff',
          ]);
          if (!candidate) {
            result.desc += ` [规则复制] 未找到可复制的状态。`;
            return false;
          }
          const copied = deepClone(candidate.cond);
          copied.duration = Math.max(1, Number(effect?.持续回合 || copied.duration || 1));
          copied.描述 = `由[${skillName || '技能'}]复制自${sourceObj === attacker ? '自身' : sourceObj.name || '目标'}的[${candidate.key}]`;
          const copiedKey = putConditionWithUniqueKey(attacker, `${candidate.key}·复制`, copied);
          result.desc += ` [规则复制] 自身复制了${sourceObj === attacker ? '自身' : sourceObj.name || '目标'}的[${candidate.key}]，获得[${copiedKey}]。`;
          return true;
        };

        const applyStateExchangeEffect = effect => {
          if (!effect) return false;
          const targetObj = resolveSkillEffectTargetCharacter(playerAction.skill, effect, attacker, defender);
          if (!targetObj || targetObj === attacker) {
            result.desc += ` [状态交换] 缺少有效交换目标。`;
            return false;
          }
          const ownCandidate = pickTransferableCondition(attacker, ['debuff', 'buff']);
          const targetCandidate = pickTransferableCondition(targetObj, ['buff', 'debuff']);
          if (!ownCandidate || !targetCandidate) {
            result.desc += ` [状态交换] 双方没有形成可交换的状态组合。`;
            return false;
          }
          const ownSnapshot = removeConditionWithSustain(attacker, ownCandidate.key);
          const targetSnapshot = removeConditionWithSustain(targetObj, targetCandidate.key);
          if (!ownSnapshot || !targetSnapshot) {
            result.desc += ` [状态交换] 交换过程中状态已失效。`;
            return false;
          }
          ownSnapshot.描述 = `由[${skillName || '技能'}]自${attacker.name || '自身'}交换至${targetObj.name || '目标'}`;
          targetSnapshot.描述 = `由[${skillName || '技能'}]自${targetObj.name || '目标'}交换至${attacker.name || '自身'}`;
          const ownNewKey = putConditionWithUniqueKey(targetObj, ownCandidate.key, ownSnapshot);
          const targetNewKey = putConditionWithUniqueKey(attacker, targetCandidate.key, targetSnapshot);
          result.desc += ` [状态交换] 自身的[${ownCandidate.key}]与${targetObj.name || '目标'}的[${targetCandidate.key}]完成交换，现分别变为[${targetNewKey}]与[${ownNewKey}]。`;
          return true;
        };

        if (directHealEffect) {
          applyImmediateRecoveryEffect(directHealEffect, 'vit', '体力');
          if (selfMirrorEffect && !effectTargetsSelf(directHealEffect))
            applyImmediateRecoveryEffect(mirrorEffectToSelf(directHealEffect), 'vit', '体力');
        }

        if (directSpEffect) {
          applyImmediateRecoveryEffect(directSpEffect, 'sp', '魂力');
          if (selfMirrorEffect && !effectTargetsSelf(directSpEffect))
            applyImmediateRecoveryEffect(mirrorEffectToSelf(directSpEffect), 'sp', '魂力');
        } else if ((pState.计算层效果?.sp_gain_ratio || 0) > 0) {
          const selfResourceBlockRatio = Math.min(
            1,
            attackerConditionEffects.reduce((maxVal, ce) => Math.max(maxVal, Number(ce.resource_block_ratio || 0)), 0),
          );
          attacker.sp = Math.min(
            attackerFinalStat.sp_max || attacker.sp_max || 0,
            attacker.sp +
              Math.floor(
                (attackerFinalStat.sp_max || attacker.sp_max || 0) *
                  pState.计算层效果.sp_gain_ratio *
                  (1 - selfResourceBlockRatio),
              ),
          );
        cons
        if (directMenEffect) {
          applyImmediateRecoveryEffect(directMenEffect, 'men', '精神力');
        consif (selfMirrorEffect && !effectTargetsSelf(directMenEffect))
            applyImmediateRecoveryEffect(mirrorEffectToSelf(directMenEffect), 'men', '精神力');
        } else if ((pState.计算层效果?.men_gain_ratio || 0) > 0) {
          const selfResourceBlockRatio = Math.min(
            1,
            attackerConditionEffects.reduce((maxVal, ce) => Math.max(maxVal, Number(ce.resource_block_ratio || 0)), 0),
          );
          attacker.men = Math.min(
            attackerFinalStat.men_max || attacker.men_max || 0,
            attacker.men +
              Math.floor(
                (attackerFinalStat.men_max || attacker.men_max || 0) *
                  pState.计算层效果.men_gain_ratio *
                  (1 - selfResourceBlockRatio),
              ),
          );

          if (directCleanseEffect) {
            const cleanseTarget = resolveSkillEffectTargetCharacter(
              playerAction.skill,
              directCleanseEffect,
              attacker,
              defender,
            );
          consconst removed = removeNegativeConditionsByCleanse(cleanseTarget, Number(directCleanseEffect.清除层级 || 1));
          consif (removed.length > 0)
              result.desc += ` [净化生效] ${cleanseTarget === attacker ? '自身' : cleanseTarget.name}清除了[${removed.join('/')}]。`;
            else
              result.desc += ` [净化生效] ${cleanseTarget === attacker ? '自身' : cleanseTarget.name}当前没有可清除的负面状态。`;
            if (selfMirrorEffect && !effectTargetsSelf(directCleanseEffect)) {
              const removedSelf = removeNegativeConditionsByCleanse(
                attacker,
                Number(directCleanseEffect.清除层级 || 1),
              );
              if (removedSelf.length > 0) result.desc += ` [自身反馈] 自身同步清除了[${removedSelf.join('/')}]。`;
            }
          }
          if (directShieldEffect) {
            applyShieldEffect(directShieldEffect);
            if (selfMirrorEffect && !effectTargetsSelf(directShieldEffect))
              applyShieldEffect(mirrorEffectToSelf(directShieldEffect));
          }
          if (directFieldEffect) {
            applyFieldEffect(directFieldEffect);
            if (selfMirrorEffect) applyFieldEffect(mirrorEffectToSelf(directFieldEffect));
          }
          if (directCopyEffect) {
            applyCopyEffect(directCopyEffect);
          }
          if (directStateExchangeEffect) {
            applyStateExchangeEffect(directStateExchangeEffect);
          }

          const hasDirectDamageEffect = Number(pClash.威力倍率 || 0) > 0;
          if (
            pState.状态名称 &&
            pState.状态名称 !== '无' &&
            (result.dmg > 0 || hostileTargetRedirectedToSelf || !hasDirectDamageEffect)
          ) {
            const stateTargetText = String(pState.目标 || pState.对象 || playerAction.skill.对象 || '');
            let targetObj = resolveSkillEffectTargetCharacter(playerAction.skill, pState, attacker, defender);
            const selfRedirectedDebuff =
              hostileTargetRedirectedToSelf && targetObj === attacker && !/自身|己方|友方/.test(stateTargetText);
            let isBuff =
              (!selfRedirectedDebuff && targetObj === attacker) ||
              /自身|己方|友方/.test(stateTargetText) ||
              String(pState.特殊机制标识 || '无').includes('增益') ||
              pState.计算层效果?.super_armor === true ||
              Number(pState.计算层效果?.min_hp_floor || 0) > 0 ||
              Number(pState.计算层效果?.hot_heal_ratio || 0) > 0;
            const supportScale = isBuff ? getSupportEffectScale(attacker, targetObj) : 1;
            const scaledMods = { ...(pState.面板修改比例 || {}) };
            ['str', 'def', 'agi', 'men_max', 'sp_max'].forEach(k => {
              if (scaledMods[k] !== undefined && scaledMods[k] !== 1.0) {
                scaledMods[k] = 1 + (scaledMods[k] - 1) * supportScale;
              }
            });
            const scaledShield =
              isBuff && pClash.护盾绝对值 > 0 ? Math.floor(pClash.护盾绝对值 * supportScale) : pClash.护盾绝对值;

            let isImmune = false;
            const isControlLike =
              !isBuff &&
              (pState.计算层效果?.skip_turn === true ||
          cons    pState.计算层效果?.cannot_react === true ||
                Number(pState.计算层效果?.control_success_bonus || 0) > 0);
            if (isControlLike) {
              let atkStat = pClash.伤害类型 === '物理近战' ? aStr : attackerFinalStat.men_max;
              let defStat = pClash.伤害类型 === '物理近战' ? dStr : defenderFinalStat.men_max;
              const controlResistMult = Number(defender.temp_control_resist_mult || 1.0);
              if (defStat > atkStat * (1.5 / Math.max(0.01, controlResistMult))) isImmune = true;
            }

            if (isImmune) {
              result.desc += ` 但目标凭借绝对的属性碾压，强行豁免了[${pState.状态名称}]控制！`;
            } else {
              if (!targetObj.conditions) targetObj.conditions = {};
              targetObj.conditions[pState.状态名称] = {
                类型: isBuff ? 'buff' : 'debuff',
                层数: 1,
                描述: `由[${playerAction.skill.name}]附加`,
                duration: pState.持续回合,
                stat_mods: pState.面板修改比例,
                combat_effects: {
                  ...createEmptyCombatEffectMap(),
                  silence: pState.计算层效果?.silence ?? false,
                  disarm: pState.计算层效果?.disarm ?? false,
                  blind: pState.计算层效果?.blind ?? false,
                  counter_attack_ratio: pState.计算层效果?.counter_attack_ratio ?? 0,
                  damage_reduction: pState.计算层效果?.damage_reduction ?? 0,
                  block_count: pState.计算层效果?.block_count ?? 0,
                  super_armor: pState.计算层效果?.super_armor ?? false,
                  death_save_count: pState.计算层效果?.death_save_count ?? 0,
                  hit_bonus: isBuff ? (pState.计算层效果?.hit_bonus ?? 0) : 0,
                  dodge_penalty: isBuff ? 0 : (pState.计算层效果?.dodge_penalty ?? 0),
                  dodge_bonus: isBuff ? (pState.计算层效果?.dodge_bonus ?? 0) : 0,
                  lock_level: isBuff ? 0 : (pState.计算层效果?.lock_level ?? 0),
                  control_resist_mult: pState.计算层效果?.control_resist_mult ?? 1.0,
                  skip_turn: pState.计算层效果?.skip_turn ?? false,
                  cannot_react: pState.计算层效果?.cannot_react ?? false,
                  dot_damage: pState.计算层效果?.dot_damage ?? pState.持续真伤dot,
                  armor_pen: pState.计算层效果?.armor_pen ?? 0,
                  reaction_bonus: pState.计算层效果?.reaction_bonus ?? 0,
                  reaction_penalty: pState.计算层效果?.reaction_penalty ?? 0,
                  attacker_speed_bonus: pState.计算层效果?.attacker_speed_bonus ?? 0,
                  cast_speed_bonus: pState.计算层效果?.cast_speed_bonus ?? 0,
                  cast_speed_penalty: pState.计算层效果?.cast_speed_penalty ?? 0,
                  hit_penalty: pState.计算层效果?.hit_penalty ?? 0,
                  control_success_bonus: pState.计算层效果?.control_success_bonus ?? 0,
                  control_success_penalty: pState.计算层效果?.control_success_penalty ?? 0,
                  control_resist_bonus: pState.计算层效果?.control_resist_bonus ?? 0,
                  interrupt_bonus: pState.计算层效果?.interrupt_bonus ?? 0,
                  final_damage_mult: pState.计算层效果?.final_damage_mult ?? 1.0,
                  final_damage_bonus: pState.计算层效果?.final_damage_bonus ?? 0,
                  final_heal_mult: pState.计算层效果?.final_heal_mult ?? 1.0,
                  final_heal_bonus: pState.计算层效果?.final_heal_bonus ?? 0,
                  shield_gain_mult: pState.计算层效果?.shield_gain_mult ?? 1.0,
                  shield_gain_bonus: pState.计算层效果?.shield_gain_bonus ?? 0,
                  sp_gain_ratio: pState.计算层效果?.sp_gain_ratio ?? 0,
                  men_gain_ratio: pState.计算层效果?.men_gain_ratio ?? 0,
                  heal_block_ratio: pState.计算层效果?.heal_block_ratio ?? 0,
                  hot_heal_ratio: pState.计算层效果?.hot_heal_ratio ?? 0,
                  resource_block_ratio: pState.计算层效果?.resource_block_ratio ?? 0,
                  min_hp_floor: pState.计算层效果?.min_hp_floor ?? 0,
                  death_save_count: pState.计算层效果?.death_save_count ?? 0,
                },
              };
              let targetNameStr = targetObj === attacker ? '自身' : 'NPC';
              result.desc += ` 并对${targetNameStr}施加了[${pState.状态名称}]状态！`;
              if (selfMirrorEffect && targetObj !== attacker) {
                if (!attacker.conditions) attacker.conditions = {};
                const mirrorKey = `${pState.状态名称}·自返`;
                attacker.conditions[mirrorKey] = deepClone(targetObj.conditions[pState.状态名称]);
                attacker.conditions[mirrorKey].描述 = `由[${playerAction.skill.name}]同步反馈`;
                result.desc += ` [自身反馈] 施术者同步获得了[${mirrorKey}]效果。`;
              }
            }
          }

          result.interrupt_bonus = attackerInterruptBonus;
          return result;
        }

        function buildStrategicCandidates(
          defender,
          attacker,
          combatData,
          playerAction,
          ratio,
          availableSkills,
          allyTeam,
          makeNpcAction,
        ) {
          const combatType = combatData.combat_type || '突发遭遇';
          const isDeadlyFight = combatType === '死战' || combatType === '突发遭遇';
          const lvDiff = (attacker.lv || 1) - (defender.lv || 1);
          const playerPower = Number(getPrimaryDamageEffect(playerAction.skill)?.威力倍率 || 0) || 0;
          const isChargingHighThreat =
            !!attacker.charging_skill ||
            playerAction.action_type === '蓄力挨打' ||
            ((playerAction.cast_time || 0) >= 20 && playerPower >= 120);
          const activeBuffs = Object.keys(defender.conditions || {});
          const behaviorState = buildBattleStateContext(defender, attacker, combatData, {
            combatType,
            isDeadlyFight,
            ratio,
            isChargingHighThreat,
            playerPower,
          });

          const strategicBranches = [];

          if (defender.martial_fusion_skills) {
            Object.entries(defender.martial_fusion_skills).forEach(([fusionName, fusionSkill]) => {
              if (!isFusionSkillAvailable(defender, fusionSkill, allyTeam)) return;

              let weight = 0;
              if (isDeadlyFight) {
                if (lvDiff >= 5) weight += 80;
                if (isChargingHighThreat) weight += 60;
                if (defender.vit < defender.vit_max * 0.5) weight += 30;
              } else if (defender.vit < defender.vit_max * 0.4 || isChargingHighThreat) {
                weight += 50;
              }

              strategicBranches.push({
                name: '武魂融合技',
                weight: adjustBehaviorWeight('武魂融合技', weight, defender, attacker, behaviorState),
                build() {
                  const skill = normalizeSkillData(fusionSkill.skill_data, `武魂融合技·${fusionName}`);
                  skill.name = `武魂融合技·${skill.name}`;
                  return makeNpcAction(
                    '武魂融合技',
                    `[绝地反击] 面对${lvDiff >= 5 ? '不可战胜的强敌' : '巨大的压力'}，${buildFusionCastNarration(fusionSkill, defender.name || 'NPC')}`,
                    skill,
                  );
                },
              });
            });
          }

          const trueBodySkill = availableSkills.find(skill => {
            const stateName = getPrimaryStateName(skill) || '';
            return /真身/.test(skill.name || '') || /真身/.test(stateName);
          });
          if (trueBodySkill) {
            const trueBodyState = getPrimaryStateName(trueBodySkill) || '无';
            if (!activeBuffs.includes(trueBodyState)) {
              let weight = 0;
              if (isDeadlyFight) {
                if (lvDiff >= 0) weight += 70;
                if (isChargingHighThreat) weight += 60;
              } else if (defender.vit < defender.vit_max * 0.6 || isChargingHighThreat) {
                weight += 50;
              }

              strategicBranches.push({
                name: '开启真身',
                weight: adjustBehaviorWeight('开启真身', weight, defender, attacker, behaviorState),
                build() {
                  const sustainConfig = resolveActionSustainConfig(defender, '开启真身', trueBodySkill, trueBodyState);
                  applyStateToCharacter(defender, getPrimaryStateEffect(trueBodySkill), trueBodySkill.name, true);
                  if (sustainConfig) registerSustainEffect(defender, `truebody:${trueBodySkill.name}`, sustainConfig);
                  return makeNpcAction(
                    '开启真身',
                    `[质变底牌] NPC仰天长啸，第七魂环闪耀，直接释放了[${trueBodySkill.name}]！`,
                    trueBodySkill,
                  );
                },
              });
            }
          }

          const lifeFireSkill = defender.bloodline_power?.skills?.['点燃生命之火'];
          if (
            isDeadlyFight &&
            lifeFireSkill &&
            !defender.bloodline_power?.life_fire &&
            behaviorState.isDesperateNoEscape
          ) {
            let weight = 0;
            if (lvDiff >= 10 && defender.vit < defender.vit_max * 0.8) weight += 60;
            else if (defender.vit < defender.vit_max * 0.3) weight += 80;
            if (isChargingHighThreat) weight += 25;

            let fireLog = `[绝命搏杀] 面对${lvDiff >= 10 ? '令人绝望的实力差距' : '生死绝境'}，NPC做出了极其疯狂的举动！强行点燃了生命之火做殊死一搏！`;
            if (!behaviorState.canFlee) {
              fireLog = `[困兽犹斗] 被迫背水一战，已经退无可退！NPC被逼入绝境，发出一声绝望的狂吼，强行点燃了生命之火，誓要同归于尽！`;
            }
            strategicBranches.push({
              name: '点燃生命之火',
              weight: adjustBehaviorWeight('点燃生命之火', weight, defender, attacker, behaviorState),
              build() {
                const sustainConfig = resolveActionSustainConfig(defender, '点燃生命之火', lifeFireSkill, '');
                defender.bloodline_power.life_fire = true;
        cons      if (sustainConfig)
        cons        registerSustainEffect(defender, `life_fire:${lifeFireSkill.name || '点燃生命之火'}`, sustainConfig);
                return makeNpcAction('点燃生命之火', fireLog, lifeFireSkill);
              },
            });
          }

          const hasDomain =
            (defender.active_domain || '无') === '无' && (defender.equip?.armor?.lv >= 3 || defender.men_max >= 30000);
          if (hasDomain) {
            let weight = 0;
            if (defender.vit >= defender.vit_max * 0.9) weight += 40;
            if (defender.vit < defender.vit_max * 0.5) weight += 80;
            if (isChargingHighThreat) weight += 30;

            strategicBranches.push({
              name: '展开领域',
              weight: adjustBehaviorWeight('展开领域', weight, defender, attacker, behaviorState),
              build() {
                const actionType = defender.equip?.armor?.lv >= 3 ? '展开斗铠领域' : '展开精神领域';
                const sustainConfig = resolveActionSustainConfig(defender, actionType, null, '');
                defender.active_domain =
                  actionType === '展开斗铠领域'
                    ? defender.equip?.armor?.lv >= 4
                      ? '【四字斗铠领域】全开(未定)'
                      : '【三字斗铠领域】全开(未定)'
                    : '【精神领域】全开';
                if (sustainConfig) registerSustainEffect(defender, `domain:${actionType}`, sustainConfig);
                return makeNpcAction(actionType, `[主场展开] NPC不愿陷入被动，果断张开领域法则抢占先机！`);
              },
            });
          }

          let bestSpirit = null;
          let maxSpiritLv = 0;
          Object.values(defender.spirit || {}).forEach(sp => {
            Object.values(sp.soul_spirits || {}).forEach(ss => {
              if (ss.状态 === '活跃' && ss.战力面板?.对标等级 > maxSpiritLv) {
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
            }
            strategicBranches.push({
              name: '召唤魂灵',
              weight: adjustBehaviorWeight('召唤魂灵', weight, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '召唤魂灵',
                  `[战术召唤] NPC消耗精神力，将【${bestSpirit.表象名称}】实体化召唤至战场！(对标等级: ${formatBattleCultivationLevelText(maxSpiritLv, '0')})`,
                );
              },
            });
          }

          const hasArmor = defender.equip?.armor?.lv > 0 && defender.equip?.armor?.equip_status !== '已装备';
          const hasMech =
            defender.equip?.mech?.lv !== '无' &&
            defender.equip?.mech?.status !== '重创' &&
            defender.equip?.mech?.equip_status !== '已装备';
          if (hasArmor || hasMech) {
            let armorLv = defender.equip?.armor?.lv || 0;
            let isRejected = defender.equip?.armor?.is_rejected || false;
            let minQ = Infinity;
            let pCount = 0;

            if (hasArmor && defender.equip?.armor?.parts) {
              Object.values(defender.equip.armor.parts).forEach(part => {
                if (part.状态 !== '未打造' && part.状态 !== '重创') {
                  if (part.品质系数 < minQ) minQ = part.品质系数;
                  pCount++;
                }
              });
            }

            let armorCast = Math.max(0, 20 - armorLv * 5);
            if (armorLv === 1 && !isRejected && minQ > 1.2 && pCount > 0) armorCast = Math.max(0, armorCast - 5);
            const mechLv = defender.equip?.mech?.lv || '无';
            const mechCast = mechLv === '红级' ? 0 : 50;
            const equipCastTime = hasArmor ? armorCast : mechCast;

            let weight = 0;
            let decisionLog = '';
            if (equipCastTime === 0) weight += 500;
            if (combatType === '死战' && defender.vit >= defender.vit_max * 0.95) {
              weight += 200;
              decisionLog = '面临生死决战，NPC不敢托大，开局便试图引动装备护体！';
            }
            if (playerPower >= 150) {
              weight += 80;
              decisionLog = '感受到对方攻击中蕴含的毁灭性波动，NPC深知肉体无法硬抗，强行尝试穿戴装备！';
            }
            if ((playerAction.cast_time || 0) > equipCastTime || ratio >= 1.2) {
              weight += 60;
              if (!decisionLog) decisionLog = 'NPC察觉到对方前摇破绽，从容地开始释放装备。';
            }
            if (defender.vit < defender.vit_max * 0.4) {
              weight += 50;
              if (!decisionLog) decisionLog = '身受重创的NPC陷入绝境，拼着被打断的风险也要强行穿戴装备！';
            }

            weight -= equipCastTime;
            strategicBranches.push({
              name: '穿戴装备',
              weight: adjustBehaviorWeight('穿戴装备', weight, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '穿戴装备',
                  `[战术决断] ${decisionLog || 'NPC准备强化自身防御层级。'} (前摇: ${equipCastTime})`,
                  {
                    name: hasArmor ? '斗铠附体' : '召唤机甲',
                    技能类型: '辅助',
                    cast_time: equipCastTime,
                    equip_target: hasArmor ? 'armor' : 'mech',
                  },
                );
              },
            });
          }

          const hasMechOrArmor =
            (defender.equip?.mech?.lv !== '无' && defender.equip?.mech?.status !== '重创') ||
            defender.equip?.armor?.equip_status === '已装备';
          if (
            behaviorState.canFlee &&
            combatType !== '擂台切磋' &&
            defender.vit < defender.vit_max * 0.15 &&
            !hasMechOrArmor
          ) {
            strategicBranches.push({
              name: '亡命奔逃',
              weight: adjustBehaviorWeight('亡命奔逃', 50, defender, attacker, behaviorState),
              build() {
                return makeNpcAction('亡命奔逃', `[濒死溃逃] NPC身受重创，丧失了战意，放弃防守转身亡命奔逃！`);
              },
            });
          } else if (!behaviorState.canFlee && defender.vit < defender.vit_max * 0.15) {
            // 如果濒死但无法逃跑，给肉体兜底和死斗加一点补救权重
            behaviorState.isDesperateNoEscape = true;
          }

          return { strategicBranches, behaviorState, combatType, activeBuffs };
        }

        function buildNpcSkillCandidateContext(
          defender,
          attacker,
          playerAction,
          availableSkills,
          behaviorState,
          activeBuffs,
          isLowHealth,
        ) {
          const pMult = getWoundMult(attacker);
          const dMult = getWoundMult(defender);
          const attackerSpeed = attacker.agi * pMult - (playerAction.cast_time || 0) * 10;
          const validSkills = availableSkills.filter(skill => {
            const castTime = getSkillCastTime(skill);
            const npcSpeed = defender.agi * dMult - castTime * 10;
            const cost = parseSkillCostForChar(skill, defender);
            return cost.canCast && npcSpeed > Math.max(1, attackerSpeed) * 0.8;
          });

          function pickSkillWithWeight(skills) {
            const weighted = (skills || []).map(skill => {
              const stateName = getPrimaryStateName(skill) || '无';
              const skillType = getSkillType(skill);
              if (stateName !== '无' && ['辅助', '防御'].includes(skillType) && activeBuffs.includes(stateName)) {
                return {
                  skill,
                  weight: 0,
                  name: skill.name || '未命名技能',
                  build() {
                    return skill;
                  },
                };
              }

              let weight = 10;
              const skillType2 = getSkillType(skill);
              const skillCastTime = getSkillCastTime(skill);
              const skillPower = Number(getPrimaryDamageEffect(skill)?.威力倍率 || 0) || 0;
              if (isSupportLikeSkill(skill)) {
                const targetForCost = String(getSkillTarget(skill)).includes('敌方') ? attacker : defender;
                skill.__targetForSupportCost = targetForCost;
              }
              const cost = parseSkillCostForChar(skill, defender);
              delete skill.__targetForSupportCost;
              const spRatio = cost.reqSp > 0 ? cost.reqSp / Math.max(1, defender.sp) : 0;
              const vitRatio = cost.reqVit > 0 ? cost.reqVit / Math.max(1, defender.vit) : 0;

              if (defender.type === '强攻系') {
                if (skillType2 === '输出') weight += 40 + Math.floor(skillPower / 10);
                if (skillType2 === '防御') weight += 20;
              } else if (defender.type === '敏攻系') {
                if (skillType2 === '输出' && skillCastTime <= 15) weight += 60;
                if (skillType2 === '输出' && skillCastTime > 20) weight -= 30;
              } else if (defender.type === '防御系') {
                if (skillType2 === '防御') weight += 80;
                if (skillType2 === '输出') weight += 10;
              } else if (defender.type === '控制系') {
                if (skillType2 === '控制') weight += 80;
              } else if (['辅助系', '治疗系', '食物系'].includes(defender.type)) {
                if (skillType2 === '辅助') weight += 80;
                if (skillType2 === '防御') weight += 50;
                if (skillType2 === '输出') weight -= 30;
              }

              const isUltimate =
                skillPower >= 200 || /真身|第八魂技|第九魂技|武魂融合技|生命之火/.test(skill.name || '');
              if (isUltimate) {
                const enemyHpRatio = attacker.vit / Math.max(1, attacker.vit_max);
                const myHpRatio = defender.vit / Math.max(1, defender.vit_max);
                if (behaviorState.combatType === '擂台切磋') weight -= 30;
                else {
                  if (enemyHpRatio < 0.4) weight += 60;
                  if (myHpRatio < 0.3) weight += 50;
                  if (enemyHpRatio > 0.8 && myHpRatio > 0.8) weight -= 20;
                }
              }

              weight -= Math.floor(skillCastTime / 5);
              if (!isLowHealth) {
                if (spRatio > 0.5 || vitRatio > 0.5) weight = Math.floor(weight * 0.3);
                else if (spRatio > 0.3 || vitRatio > 0.3) weight = Math.floor(weight * 0.7);
              } else if (vitRatio > 0.5) {
                weight = Math.floor(weight * 0.5);
              }

              const summary = deriveBattleSummaryFromEffects(skill);
              const mainType = inferMainTypeFromEffects(skill) || '无';
              const enemyHpRatio = attacker.vit / Math.max(1, attacker.vit_max);
              const selfHpRatio = defender.vit / Math.max(1, defender.vit_max);
              const fieldActive = Object.keys(defender.conditions || {}).some(k => /领域|场地|结界|召唤/.test(k));
              const enemySnapshot = buildConditionTacticalSnapshot(attacker);
              const selfSnapshot = buildConditionTacticalSnapshot(defender);
              const allyCount = behaviorState.alliesCount || 1;
              const selfSpRatio = Math.max(0, Number(defender.sp || 0)) / Math.max(1, Number(defender.sp_max || 1));
              const selfMenRatio = Math.max(0, Number(defender.men || 0)) / Math.max(1, Number(defender.men_max || 1));
              const hasAntiHeal = hasSkillMechanism(skill, ['禁疗']);
              const hasSharedVision = hasSkillMechanism(skill, ['共享视野']);
              const hasCounter = hasSkillMechanism(skill, ['受击反击', '反制']);
              const hasBlock = hasSkillMechanism(skill, ['格挡']);
              const hasShield = hasSkillMechanism(skill, ['护盾']);
              const hasDeathSave = hasSkillMechanism(skill, ['免死']);
              const hasClone = hasSkillMechanism(skill, ['分身']);
              const hasExecute = hasSkillMechanism(skill, ['斩杀补伤']);
              const hasResourceRecover = getSkillEffects(skill).some(effect =>
                isBattleRecoverEffect(effect, ['sp', 'men']),
              );
              const hasHeal = getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect, ['vit']));
              const hasDotPressure = hasSkillMechanism(skill, ['持续伤害']);
              const hasDelayBurst = hasSkillMechanism(skill, ['延迟爆发']);
              const hasVolatile = hasSkillMechanism(skill, ['高波动随机值']);
              const hasReflectiveConvert = hasSkillMechanism(skill, ['伤害转回复', '回复转伤害', '效果反转']);
              const penetrationValue = Number(getPrimaryDamageEffect(skill)?.穿透修饰 || 0);
              const actorMemory = ensureActorDecisionMemory(defender);
              const counterPenalty = getActorSkillCounterPenalty(defender, skill.name || skill.技能名称 || '');

              if (['控制类', '削弱类'].includes(mainType)) weight += 15;
              if (mainType === '增益类' && behaviorState.round <= 2) weight += 20;
              if (mainType === '特殊规则类') weight -= 5;

              if (summary.控制强度 === '硬控' && isChargingHighThreat) weight += 60;
              else if (summary.控制强度 === '软控' && isChargingHighThreat) weight += 35;

              if (
                mainType === '伤害类' &&
                summary.目标规模 === '单体' &&
                summary.爆发级别 === '高' &&
                enemyHpRatio < 0.35
              )
                weight += 50;
              if (mainType === '伤害类' && summary.目标规模 === '群体' && behaviorState.round <= 1) weight += 25;

              if (summary.防御性质 !== '无' && selfHpRatio < 0.5) weight += 30;
              if (summary.防御性质 === '免死' && selfHpRatio < 0.35) weight += 40;
              if (hasClone && (behaviorState.round <= 2 || selfHpRatio < 0.65)) weight += 25;

              if (summary.回复性质 !== '无' && (selfHpRatio < 0.6 || selfSnapshot.hasBadCondition)) weight += 35;
              if (summary.回复性质 === '净化' && selfSnapshot.hasBadCondition) weight += 60;

              if (summary.协同性 === '高' && (behaviorState.alliesCount || 1) > 1) weight += 20;
              else if (summary.协同性 === '中' && (behaviorState.alliesCount || 1) > 1) weight += 10;

              if (summary.生效方式 === '持续') weight += fieldActive ? -30 : 20;
              if (summary.生效方式 === '延迟') {
                if (behaviorState.round <= 1) weight += 15;
                else if (enemyHpRatio < 0.3) weight -= 10;
              }
              if (summary.生效方式 === '触发') weight += 5;

              if (summary.爆发级别 === '高' && enemyHpRatio < 0.4) weight += 20;
              if (summary.持续性 === '长' && behaviorState.round <= 2) weight += 15;
              if (summary.持续性 === '中' && behaviorState.combatType !== '擂台切磋') weight += 10;

              if (hasAntiHeal) {
                if (enemySnapshot.hasAntiHeal) weight -= 35;
                else if (['辅助系', '治疗系', '食物系'].includes(attacker.type) || enemySnapshot.hasHealingTrend)
                  weight += 45;
                else if (enemyHpRatio > 0.55) weight += 20;
              }
              if (hasSharedVision && allyCount > 1) {
                if (selfSnapshot.hasSharedVision) weight -= 30;
                else weight += 30;
              }
              if (hasCounter && (isChargingHighThreat || selfHpRatio < 0.55))
                weight += selfSnapshot.hasReactiveDefense ? 8 : 22;
              if (hasBlock && (isChargingHighThreat || selfHpRatio < 0.5))
                weight += selfSnapshot.hasReactiveDefense ? 10 : 28;
              if (hasShield && selfHpRatio < 0.55) weight += selfSnapshot.hasShielded ? 6 : 24;
              if (hasDeathSave && selfHpRatio < 0.35) weight += 55;
              if (hasExecute && enemyHpRatio < 0.35) weight += 40;
              if (hasResourceRecover && (selfSpRatio < 0.4 || selfMenRatio < 0.4))
                weight += selfSnapshot.hasHealingTrend ? 10 : 30;
              if (hasHeal && selfHpRatio < 0.45) weight += selfSnapshot.hasHealingTrend ? 8 : 28;
              if (enemySnapshot.hasShielded && (penetrationValue >= 20 || skillPower >= 180)) weight += 24;
              if (enemySnapshot.hasDefenseBuffed && penetrationValue >= 15) weight += 18;
              if (enemySnapshot.isLockedOrControlled) {
                if (summary.爆发级别 === '高') weight += 18;
                if (hasDelayBurst || skillCastTime >= 18) weight += 12;
                if (hasExecute && enemyHpRatio < 0.45) weight += 15;
                if (summary.控制强度 === '软控') weight -= 20;
                else if (summary.控制强度 === '硬控' && !isChargingHighThreat) weight -= 8;
              }
              if (enemySnapshot.debuffCount > 0 && hasDotPressure) weight += 10;
              if (selfSnapshot.hasReactiveDefense && (hasCounter || hasBlock || hasShield || hasDeathSave))
                weight -= 12;
              if (hasVolatile) {
                if (behaviorState.isDesperateNoEscape || selfHpRatio < 0.35 || enemyHpRatio < 0.35) weight += 12;
                else weight -= 10;
              }
              if (hasReflectiveConvert) {
                if (enemySnapshot.buffCount > 0 || selfHpRatio < 0.5 || enemyHpRatio < 0.5) weight += 15;
              }
              if (Number(actorMemory.focus_ttl || 0) > 0) {
                if (actorMemory.focus_reason === 'control_window') {
                  if (summary.爆发级别 === '高' || hasExecute) weight += 16;
                  if (summary.控制强度 !== '无') weight -= 10;
                } else if (
                  actorMemory.focus_reason === 'shared_vision_focus' &&
                  summary.目标规模 === '单体' &&
                  summary.爆发级别 !== '无'
                )
                  weight += 18;
                else if (
                  actorMemory.focus_reason === 'dot_pressure' &&
                  (hasDotPressure || hasExecute || summary.爆发级别 === '高')
                )
                  weight += 14;
                else if (
                  actorMemory.focus_reason === 'anti_heal_window' &&
                  (hasDotPressure || hasExecute || summary.爆发级别 !== '无')
                )
                  weight += 10;
                else if (
                  actorMemory.focus_reason === 'armor_break_window' &&
                  (penetrationValue >= 15 || summary.爆发级别 === '高')
                )
                  weight += 10;
                else if (actorMemory.focus_reason === 'finisher' && (hasExecute || summary.爆发级别 !== '无'))
                  weight += 18;
              }
              if (counterPenalty > 0) weight -= counterPenalty;

              if (summary.保留倾向 >= 70 && !(isChargingHighThreat || enemyHpRatio < 0.35 || selfHpRatio < 0.35))
                weight -= 30;
              else if (summary.保留倾向 >= 40 && !(isChargingHighThreat || enemyHpRatio < 0.45 || selfHpRatio < 0.45))
                weight -= 15;

              return {
                skill,
                weight: Math.max(0, weight),
                name: skill.name || '未命名技能',
                build() {
                  return skill;
                },
              };
            });

            const picked = rollBranchByPriority(weighted, '行为预演/技能选择');
            if (!picked.option) return { skill: null, trace: picked.trace };
            return { skill: picked.option.build(), trace: picked.trace };
          }

          const defSkills = validSkills.filter(skill => {
            const skillType = getSkillType(skill);
            const mainType = inferMainTypeFromEffects(skill);
            return (
              skillType === '防御' ||
              mainType === '防御类' ||
              hasSkillMechanism(skill, ['护盾', '减伤', '格挡', '霸体', '免死', '分身']) ||
              skillType === '控制'
            );
          });
          const atkSkills = validSkills.filter(skill => {
            const skillType = getSkillType(skill);
            const mainType = inferMainTypeFromEffects(skill);
            return (
              skillType === '输出' ||
              mainType === '伤害类' ||
              hasSkillMechanism(skill, ['直接伤害', '多段伤害', '持续伤害', '延迟爆发', '斩杀补伤'])
            );
          });
          const controlSkills = validSkills.filter(skill => {
            const mainType = inferMainTypeFromEffects(skill);
            const calc = getPrimaryStateCalc(skill);
            const flags = getPrimaryStateFlags(skill);
            const summary = deriveBattleSummaryFromEffects(skill);
            return (
              mainType === '控制类' ||
              mainType === '削弱类' ||
              summary.控制强度 === '硬控' ||
              summary.控制强度 === '软控' ||
              hasSkillMechanism(skill, [
                '硬控',
                '催眠',
                '幻境',
                '标记锁定',
                '打断',
                '沉默',
                '禁疗',
                '减速',
                '软控',
                '位移限制',
                '强制位移',
                '位移交换',
                '强制绑定/锁定',
              ]) ||
              Number(calc.lock_level || 0) > 0 ||
              Number(calc.reaction_penalty || 0) > 0 ||
              Number(calc.cast_speed_penalty || 0) > 0 ||
              Number(calc.dodge_penalty || 0) > 0 ||
              Number(calc.resource_block_ratio || 0) > 0 ||
              flags.includes('硬控')
            );
          });

          const defSkillPick = pickSkillWithWeight(defSkills);
          const atkSkillPick = pickSkillWithWeight(atkSkills);
          const controlSkillPick = pickSkillWithWeight(controlSkills);
          const antiHealSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => hasSkillMechanism(skill, ['禁疗'])),
          );
          const pierceSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => {
              const dmg = getPrimaryDamageEffect(skill);
              return Number(dmg?.穿透修饰 || 0) >= 15 || /破甲|穿透|粉碎/.test(String(skill?.name || ''));
            }),
          );
          const executeSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => {
              const dmg = getPrimaryDamageEffect(skill);
              return (
                hasSkillMechanism(skill, ['斩杀补伤']) ||
                (inferMainTypeFromEffects(skill) === '伤害类' && Number(dmg?.威力倍率 || 0) >= 220)
              );
            }),
          );
          const recoverSkillPick = pickSkillWithWeight(
            validSkills.filter(skill => getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect))),
          );
          const teamSupportSkillPick = pickSkillWithWeight(
            validSkills.filter(
              skill =>
                hasSkillMechanism(skill, ['共享视野']) ||
                (getSkillType(skill) === '辅助' && deriveBattleSummaryFromEffects(skill).协同性 === '高'),
            ),
          );
          const reactiveDefenseSkillPick = pickSkillWithWeight(
            validSkills.filter(skill =>
              hasSkillMechanism(skill, ['受击反击', '反制', '格挡', '护盾', '免死', '霸体', '分身']),
            ),
          );

          const defSkill = defSkillPick.skill;
          const atkSkill = atkSkillPick.skill;
          const hardControlSkill = controlSkillPick.skill || controlSkills[0] || null;
          const antiHealSkill = antiHealSkillPick.skill || null;
          const pierceSkill = pierceSkillPick.skill || null;
          const executeSkill = executeSkillPick.skill || null;
          const recoverSkill = recoverSkillPick.skill || null;
          const teamSupportSkill = teamSupportSkillPick.skill || null;
          const reactiveDefenseSkill = reactiveDefenseSkillPick.skill || defSkill || null;
          const npcAtkPower = Number(getPrimaryDamageEffect(atkSkill)?.威力倍率 || 0);
          const skillTraceLog = [
            defSkillPick.trace,
            atkSkillPick.trace,
            controlSkillPick.trace,
            antiHealSkillPick.trace,
            pierceSkillPick.trace,
            executeSkillPick.trace,
            recoverSkillPick.trace,
            teamSupportSkillPick.trace,
            reactiveDefenseSkillPick.trace,
          ]
            .filter(Boolean)
            .join(' | ');

          return {
            defSkill,
            atkSkill,
            hardControlSkill,
            antiHealSkill,
            pierceSkill,
            executeSkill,
            recoverSkill,
            teamSupportSkill,
            reactiveDefenseSkill,
            npcAtkPower,
            skillTraceLog,
          };
        }

        function buildTacticalCandidates(
          defender,
          attacker,
          playerAction,
          behaviorState,
          skillContext,
          makeNpcAction,
          isSupport,
          isLowHealth,
        ) {
          const {
            defSkill,
            atkSkill,
            hardControlSkill,
            antiHealSkill,
            pierceSkill,
            executeSkill,
            recoverSkill,
            teamSupportSkill,
            reactiveDefenseSkill,
            npcAtkPower,
          } = skillContext;
          const playerPower = behaviorState.playerPower || 0;
          const isChargingHighThreat = !!behaviorState.isChargingHighThreat;
          const enemySnapshot = buildConditionTacticalSnapshot(attacker);
          const selfSnapshot = buildConditionTacticalSnapshot(defender);
          const enemyHpRatio = attacker.vit / Math.max(1, attacker.vit_max);
          const selfHpRatio = defender.vit / Math.max(1, defender.vit_max);
          const selfSpRatio = Math.max(0, Number(defender.sp || 0)) / Math.max(1, Number(defender.sp_max || 1));
          const selfMenRatio = Math.max(0, Number(defender.men || 0)) / Math.max(1, Number(defender.men_max || 1));
          const allyCount = behaviorState.alliesCount || 1;

          let isLockedBySpirit = false;
          if ((playerAction.cast_time || 0) > 0) {
            const pState = getPrimaryStateEffect(playerAction.skill) || {};
            const pCalc = getPrimaryStateCalc(playerAction.skill);
            const hasStructuredLock = Number(pCalc.lock_level || 0) > 0;
            const hasCompatFlagLock =
              getPrimaryStateFlags(playerAction.skill).includes('锁定') ||
              getPrimaryStateFlags(playerAction.skill).includes('威压');
            if (hasStructuredLock || hasCompatFlagLock) {
              if (attacker.men_max > defender.men_max) isLockedBySpirit = true;
            }
          }

          const tacticalBranches = [];

          const atkSummary = atkSkill ? deriveBattleSummaryFromEffects(atkSkill) : createEmptyBattleSummary();
          const executeSummary = executeSkill
            ? deriveBattleSummaryFromEffects(executeSkill)
            : createEmptyBattleSummary();
          const atkCastTime = getSkillCastTime(atkSkill);
          const executeCastTime = getSkillCastTime(executeSkill);

          if (enemySnapshot.hasHealingTrend && antiHealSkill && !enemySnapshot.hasAntiHeal) {
            tacticalBranches.push({
              name: '断疗压制',
              weight: adjustBehaviorWeight('断疗压制', 95, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '断疗压制',
                  `[战术封锁] NPC敏锐察觉到对手恢复节奏已成，立刻以[${antiHealSkill.name}]强行断疗压制！`,
                  antiHealSkill,
                );
              },
            });
          }
          if ((enemySnapshot.hasShielded || enemySnapshot.hasDefenseBuffed) && pierceSkill) {
            tacticalBranches.push({
              name: '破防强攻',
              weight: adjustBehaviorWeight(
                '破防强攻',
                enemySnapshot.hasShielded ? 90 : 75,
                defender,
                attacker,
                behaviorState,
              ),
              build() {
                return makeNpcAction(
                  '破防强攻',
                  `[破防识别] NPC判断常规打击难以奏效，改以[${pierceSkill.name}]强行撕开防御层！`,
                  pierceSkill,
                );
              },
            });
          }
          if ((enemySnapshot.isLockedOrControlled || enemyHpRatio < 0.4) && executeSkill) {
            tacticalBranches.push({
              name: '乘胜追击',
              weight: adjustBehaviorWeight(
                '乘胜追击',
                enemyHpRatio < 0.35 ? 105 : 80,
                defender,
                attacker,
                behaviorState,
              ),
              build() {
                return makeNpcAction(
                  '乘胜追击',
                  `[收割窗口] NPC看准对手露出的破绽，立刻释放[${executeSkill.name}]试图完成收割！`,
                  executeSkill,
                );
              },
            });
          }
          if (
            (selfSpRatio < 0.35 || selfMenRatio < 0.35 || selfHpRatio < 0.45) &&
            recoverSkill &&
            !(selfSnapshot.hasHealingTrend && selfHpRatio > 0.55 && selfSpRatio > 0.45 && selfMenRatio > 0.45)
          ) {
            tacticalBranches.push({
              name: '稳态回气',
              weight: adjustBehaviorWeight('稳态回气', 72, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '稳态回气',
                  `[调整节奏] NPC判断硬拼将迅速透支，转而以[${recoverSkill.name}]修补状态链。`,
                  recoverSkill,
                );
              },
            });
          }
          if (allyCount > 1 && teamSupportSkill && !selfSnapshot.hasSharedVision) {
            tacticalBranches.push({
              name: '战术协同',
              weight: adjustBehaviorWeight('战术协同', 68, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '战术协同',
                  `[协同铺垫] NPC选择用[${teamSupportSkill.name}]为己方建立更高效的集火与联动节奏。`,
                  teamSupportSkill,
                );
              },
            });
          }
          if (
            (isChargingHighThreat || playerPower >= 220 || selfHpRatio < 0.45) &&
            reactiveDefenseSkill &&
            !selfSnapshot.hasReactiveDefense
          ) {
            tacticalBranches.push({
              name: '借力守势',
              weight: adjustBehaviorWeight('借力守势', 88, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '借力守势',
                  `[借势防御] NPC放弃盲目硬拼，转而用[${reactiveDefenseSkill.name}]等待对手失衡反噬。`,
                  reactiveDefenseSkill,
                );
              },
            });
          }

          if (
            selfSnapshot.hasSharedVision &&
            atkSkill &&
            atkSummary.目标规模 === '单体' &&
            atkSummary.爆发级别 !== '无'
          ) {
            tacticalBranches.push({
              name: '协同点杀',
              weight: adjustBehaviorWeight('协同点杀', enemyHpRatio < 0.5 ? 86 : 70, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '协同点杀',
                  `[视野锁头] NPC借助共享视野完成目标校准，立刻以[${atkSkill.name}]集中打穿要害！`,
                  atkSkill,
                );
              },
            });
          }

          if (enemySnapshot.isLockedOrControlled && atkSkill && (atkSummary.爆发级别 === '高' || atkCastTime >= 18)) {
            tacticalBranches.push({
              name: '连段爆发',
              weight: adjustBehaviorWeight('连段爆发', 82, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '连段爆发',
                  `[顺势爆发] NPC看准对手已被压制，果断接上[${atkSkill.name}]扩大伤害窗口！`,
                  atkSkill,
                );
              },
            });
          }

          if (enemySnapshot.hasDotPressure && executeSkill) {
            tacticalBranches.push({
              name: '压血收束',
              weight: adjustBehaviorWeight(
                '压血收束',
                enemyHpRatio < 0.45 ? 88 : 68,
                defender,
                attacker,
                behaviorState,
              ),
              build() {
                return makeNpcAction(
                  '压血收束',
                  `[持续压杀] NPC判断对手已被持续伤害拖入危险区，立刻以[${executeSkill.name}]完成收束。`,
                  executeSkill,
                );
              },
            });
          }

          if (defender.type === '强攻系' && atkSkill && selfHpRatio > 0.4 && playerPower <= npcAtkPower * 1.7) {
            tacticalBranches.push({
              name: '强攻压制',
              weight: adjustBehaviorWeight('强攻压制', enemyHpRatio < 0.5 ? 84 : 72, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '强攻压制',
                  `[正面压制] 身为强攻系，NPC更倾向以[${atkSkill.name}]持续压迫对手，不给其调整空间。`,
                  atkSkill,
                );
              },
            });
          }

          if (defender.type === '敏攻系' && (executeSkill || atkSkill)) {
            const agileStrike = executeSkill && executeCastTime <= 18 ? executeSkill : atkSkill;
            if (agileStrike) {
              tacticalBranches.push({
                name: '游击收割',
                weight: adjustBehaviorWeight(
                  '游击收割',
                  enemyHpRatio < 0.5 ? 90 : 70,
                  defender,
                  attacker,
                  behaviorState,
                ),
                build() {
                  return makeNpcAction(
                    '游击收割',
                    `[游击切入] 敏攻系NPC抓住节奏缝隙，以[${agileStrike.name}]高速切入撕开战局。`,
                    agileStrike,
                  );
                },
              });
            }
          }

          if (defender.type === '防御系' && reactiveDefenseSkill && !selfSnapshot.hasReactiveDefense) {
            tacticalBranches.push({
              name: '坚壁反制',
              weight: adjustBehaviorWeight(
                '坚壁反制',
                isChargingHighThreat || playerPower >= 220 ? 92 : 74,
                defender,
          cons    attacker,
                behaviorState,
              ),
              build() {
                return makeNpcAction(
                  '坚壁反制',
                  `[以守待攻] 防御系NPC更擅长把战局拖入自己的节奏，先用[${reactiveDefenseSkill.name}]筑起反制层。`,
                  reactiveDefenseSkill,
                );
              },
            });
          }

          if (defender.type === '控制系' && hardControlSkill && !enemySnapshot.isLockedOrControlled) {
            tacticalBranches.push({
              name: '连锁控制',
              weight: adjustBehaviorWeight('连锁控制', 88, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '连锁控制',
                  `[节奏封锁] 控制系NPC优先争夺节奏，试图用[${hardControlSkill.name}]建立状态链优势。`,
                  hardControlSkill,
                );
              },
            });
          }

          if (
            ['辅助系', '治疗系', '食物系'].includes(defender.type) &&
            allyCount > 1 &&
            teamSupportSkill &&
            !selfSnapshot.hasSharedVision
          ) {
            tacticalBranches.push({
              name: '统筹增援',
              weight: adjustBehaviorWeight('统筹增援', 82, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '统筹增援',
                  `[团队统筹] 辅助型NPC更重视整体节奏，优先用[${teamSupportSkill.name}]为己方建立协同优势。`,
                  teamSupportSkill,
                );
              },
            });
          }

          if (isLockedBySpirit && defSkill) {
            tacticalBranches.push({
              name: '危机自保',
              weight: adjustBehaviorWeight('危机自保', 120, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '危机自保',
                  `[气机锁定] NPC被玩家恐怖的精神力死死锁定，不敢轻举妄动，只能全力转为防御！`,
                  defSkill,
                );
              },
            });
          } else if (isChargingHighThreat) {
            if (hardControlSkill) {
              tacticalBranches.push({
                name: '危机自保',
                weight: adjustBehaviorWeight('危机自保', 120, defender, attacker, behaviorState),
                build() {
                  return makeNpcAction(
                    '危机自保',
                    `[破绽捕捉] NPC察觉到玩家正在蓄力，果断释放[${hardControlSkill.name}]试图打断！`,
                    hardControlSkill,
                  );
                },
              });
            }
      cons    if (atkSkill) {
      cons      tacticalBranches.push({
                name: '强势对轰',
                weight: adjustBehaviorWeight('强势对轰', 90, defender, attacker, behaviorState),
                build() {
                  return makeNpcAction(
                    '强势对轰',
                    `[破绽捕捉] NPC见玩家露出极大的前摇破绽，立刻释放[${atkSkill.name}]企图趁机重创玩家！`,
                    atkSkill,
                  );
                },
              });
            }
            tacticalBranches.push({
              name: '伺机闪避',
              weight: adjustBehaviorWeight('伺机闪避', 60, defender, attacker, behaviorState),
              build() {
                return makeNpcAction(
                  '伺机闪避',
                  `[致命预警] NPC察觉到毁灭性的蓄力波动，但无力打断，只能全力游走试图拉开距离。`,
                );
              },
            });
          } else if (isSupport || isLowHealth || playerPower >= 250) {
            if (defSkill) {
              tacticalBranches.push({
                name: '危机自保',
                weight: adjustBehaviorWeight('危机自保', 60, defender, attacker, behaviorState),
                build() {
                  return makeNpcAction(
                    '危机自保',
                    `[谨慎应对] NPC判断局势不利，选择以[${defSkill.name}]稳住阵脚。`,
                    defSkill,
                  );
                },
              });
            }
            if (atkSkill) {
              let clashWeight = playerPower > npcAtkPower * 1.5 ? 20 : 55;
              tacticalBranches.push({
                name: '强势对轰',
                weight: adjustBehaviorWeight('强势对轰', clashWeight, defender, attacker, behaviorState),
                build() {
                  return makeNpcAction(
                    '强势对轰',
                    playerPower > npcAtkPower * 1.5
                      ? `[孤注一掷] 尽管身处劣势，NPC仍狠下心正面搏杀！`
                      : `[强势对轰] NPC不甘示弱，释放[${atkSkill.name}]正面迎击！`,
                    atkSkill,
                  );
                },
              });
            }
            tacticalBranches.push({
              name: '伺机闪避',
              weight: adjustBehaviorWeight('伺机闪避', 85, defender, attacker, behaviorState),
              build() {
                return makeNpcAction('伺机闪避', `[劣势规避] NPC判断继续硬拼代价过高，选择战术性闪避。`);
              },
            });
          } else {
            if (atkSkill) {
              tacticalBranches.push({
                name: '强势对轰',
                weight: adjustBehaviorWeight('强势对轰', 75, defender, attacker, behaviorState),
                build() {
                  return makeNpcAction(
                    '强势对轰',
                    `[主动进攻] NPC抓住节奏，释放[${atkSkill.name}]尝试夺回主动权！`,
                    atkSkill,
                  );
                },
              });
            }
            if (defSkill) {
              tacticalBranches.push({
                name: '危机自保',
                weight: adjustBehaviorWeight('危机自保', 45, defender, attacker, behaviorState),
                build() {
                  return makeNpcAction('危机自保', `[稳扎稳打] NPC选择先用[${defSkill.name}]保护自身。`, defSkill);
                },
              });
            }
            tacticalBranches.push({
              name: '伺机闪避',
              weight: adjustBehaviorWeight('伺机闪避', 30, defender, attacker, behaviorState),
              build() {
                return makeNpcAction('伺机闪避', `[战术拉扯] NPC利用身法周旋，试图重排节奏。`);
              },
            });
          }

          tacticalBranches.push({
            name: '肉体兜底',
            weight: adjustBehaviorWeight('肉体兜底', 20, defender, attacker, behaviorState),
            build() {
              return makeNpcAction('肉体兜底', `[从容应对] NPC无合适魂技，收缩防御，准备肉体硬抗。`, null, {
                def_mult: 1.2,
              });
            },
          });

          return tacticalBranches;
        }
cons
      cons// ==========================================
      cons// 📍 NPC 决策逻辑 (真实读取版)
        // ==========================================
        function determineNpcAction(combatData, playerAction, ratio) {
          hydrateCombatData(combatData);
          let defender = combatData.participants.enemy;
          let attacker = combatData.participants.player;

          function makeNpcAction(type, log, skill = null, extra = {}) {
            return Object.assign(
              {
                type,
                log,
                skill: skill ? normalizeSkillData(skill, skill.name || skill.技能名称 || type) : null,
                def_mult: 1.0,
              },
              extra,
            );
          }

          if (ratio < 0.5) {
            return makeNpcAction(
              '无法反应',
              '[速度碾压] NPC根本无法看清攻击轨迹，来不及做出任何反应！本回合防御力减半。',
              null,
              { def_mult: 0.5 },
            );
          }

          const combatType = combatData.combat_type || '突发遭遇';
          const isDeadlyFight = combatType === '死战' || combatType === '突发遭遇';
          const lvDiff = (attacker.lv || 1) - (defender.lv || 1);
          const playerPower = Number(getPrimaryDamageEffect(playerAction.skill)?.威力倍率 || 0) || 0;
          const isChargingHighThreat =
            !!attacker.charging_skill ||
            playerAction.action_type === '蓄力挨打' ||
            ((playerAction.cast_time || 0) >= 20 && playerPower >= 120);
          const isSupport = ['辅助系', '治疗系', '食物系'].includes(defender.type);
          const isLowHealth = defender.vit < defender.vit_max * 0.3;
          const activeBuffs = Object.keys(defender.conditions || {});
          const allyTeam = combatData.participants.team_enemy || [];
          const availableSkills = collectCombatSkills(defender, allyTeam);
      cons  const strategicContext = buildStrategicCandidates(
            defender,
            attacker,
            combatData,
            playerAction,
            ratio,
            availableSkills,
            allyTeam,
            makeNpcAction,
          );
          const behaviorState = strategicContext.behaviorState;
          const strategicAction = chooseAndBuildActorAction(
            defender,
            attacker,
            behaviorState,
            strategicContext.strategicBranches,
            '行为预演/战略阶段',
          );
          if (strategicAction) return strategicAction;
          const skillContext = buildNpcSkillCandidateContext(
            defender,
            attacker,
            playerAction,
            availableSkills,
            behaviorState,
        cons  activeBuffs,
        cons  isLowHealth,
          );
          const tacticalBranches = buildTacticalCandidates(
            defender,
            attacker,
            playerAction,
          consbehaviorState,
          consskillContext,
            makeNpcAction,
            isSupport,
            isLowHealth,
        cons);

          const tacticalAction = chooseAndBuildActorAction(
            defender,
            attacker,
            behaviorState,
            tacticalBranches,
            '行为预演/战术阶段',
            `${skillContext.skillTraceLog ? skillContext.skillTraceLog + ' | ' : ''}`,
          );
          if (tacticalAction) return tacticalAction;
          const tacticalChoice = chooseActorActionByCandidates(
            defender,
            attacker,
            behaviorState,
            tacticalBranches,
            '行为预演/战术阶段',
          );
          return makeNpcAction(
            '肉体兜底',
            `${skillContext.skillTraceLog ? skillContext.skillTraceLog + ' | ' : ''}${tacticalChoice.trace ? tacticalChoice.trace + ' ' : ''}[从容应对] NPC无合适魂技，收缩防御，准备肉体硬抗。`,
            null,
            { def_mult: 1.2 },
          );
        }

        // ==========================================
        // 📍 5. 高阶机制伤害修饰与炸膛判定
        // ==========================================
        function applyHighTierMechanics(attackerChar, defenderChar, playerAction, baseResult) {
          let result = { ...baseResult };
      cons  let attackerStats = attackerChar.stat || attackerChar;
          let defenderStats = defenderChar.stat || defenderChar;
      cons  const unlockedAttributeSet = new Set(collectBattleUnlockedAttributeTokens(attackerChar));
          const battleMindMax = Number(
            attackerChar?.final?.men_max || attackerStats?.men_max || attackerChar?.men_max || 0,
          );
      cons  const applyDerivedState = (
            targetObj,
            stateName,
            sourceName,
            duration,
            statMods = {},
      cons    combatEffects = {},
            forceBuff = false,
          ) => {
            if (!targetObj || !stateName) return false;
            return applyStateToCharacter(
              targetObj,
              {
                状态名称: stateName,
                特殊机制标识: forceBuff ? '增益/高阶衍生' : '削弱/高阶衍生',
                持续回合: duration,
                面板修改比例: {
                  str: 1.0,
                  def: 1.0,
                  agi: 1.0,
                  sp_max: 1.0,
                  vit_max: 1.0,
                  men_max: 1.0,
                  ...(statMods || {}),
                },
                计算层效果: {
                  ...createEmptyCombatEffectMap(),
      cons          ...(combatEffects || {}),
                },
        cons    },
              sourceName || stateName,
              forceBuff,
            );
          };

          const skillElementLabel = getBattleSkillDisplayElement(playerAction.skill || {});
          let isHoly = skillElementLabel === '神圣' || skillElementLabel === '光明' || skillElementLabel === '生命';
          if (isHoly && defenderStats.is_evil) {
            result.dmg = Math.floor(result.dmg * 2.0);
            result.desc += ' [神圣克制] 纯粹的光明之力如同沸水泼雪，无视等级压制，对邪魂师造成双倍真实伤害！';
          }

          if (playerAction.action_type === '多元素融合') {
            const fusionElements = sortBattleFusionElements(
              playerAction.fusionElements || playerAction.skill?.附带属性 || [],
            );
            const fusionSemantics = resolveBattleFusionSemantics(fusionElements);
            const missingFusionPermissions = fusionElements.filter(token => !unlockedAttributeSet.has(token));
            const gatedFusionSemantics = missingFusionPermissions.length
        cons    ? {
                  ...fusionSemantics,
                  multiplier: 1,
                  failAdjust: 0,
                  derivedEffects: [],
                  summary: `${fusionSemantics.summary} 但当前缺少调用权：${missingFusionPermissions.join('/')}，只能按普通并行融合处理。`,
                }
              : fusionSemantics;
            const fusionPattern = String(
              gatedFusionSemantics.pattern || playerAction.fusionPattern || buildBattleFusionPattern(fusionElements),
            );
            const fusionLabel = fusionElements.length ? fusionPattern : `${fusionElements.length || 2}种元素`;
            let elementCount = fusionElements.length || 2;
            let isSilverDragon =
              attackerChar.bloodline_power?.bloodline?.includes('银龙王') ||
        cons    Object.values(attackerChar.spirit || {}).some(sp => sp.表象名称?.includes('元素使'));
cons
            let failRate = 0;
            if (!isSilverDragon) {
              let baseFailRate = (elementCount - 1) * 35 + Number(gatedFusionSemantics.failAdjust || 0);
              let menAdvantage = (attackerStats.men / defenderStats.men_max) * 15;
              failRate = Math.max(5, baseFailRate - menAdvantage);
            }

            let roll = Math.floor(Math.random() * 100) + 1;
            if (fusionElements.length) {
              result.desc += ` [组合语义] ${gatedFusionSemantics.pattern}：${gatedFusionSemantics.summary}`;
              if (Array.isArray(gatedFusionSemantics.derivedEffects) && gatedFusionSemantics.derivedEffects.length) {
                result.desc += ` [衍生能力] ${gatedFusionSemantics.derivedEffects.join(' / ')}`;
              }
            }

            if (roll <= failRate) {
              result.dmg = 0;
              result.backlash_dmg = Math.floor(attackerStats.vit_max * 0.3);
              result.desc += ` [元素炸膛] 精神力失控！${fusionLabel}在手中轰然引爆，遭到极致反噬！(Roll: ${roll} <= 炸膛率: ${Math.floor(failRate)}%)`;
            } else {
              let multiplier = Math.pow(1.5, elementCount - 1) * Number(gatedFusionSemantics.multiplier || 1);
              if (isSilverDragon) result.desc += ` [血脉特权] 银龙王血脉无视元素排斥，炸膛率强制归零！`;
              if (playerAction.is_charged) {
                multiplier *= 1.5;
                result.desc += ` [极致蓄力] 元素被压缩到极致！`;
              }
              result.dmg = Math.floor(result.dmg * multiplier);
              result.desc += ` [元素共鸣] ${fusionLabel}完美融合！威力呈指数级暴涨！(威力倍率: x${multiplier.toFixed(2)})`;
            }
          }

          return result;
        }

        // ==========================================
        // 📍 6. 辅助区：意图解析与NPC决策 (真实读取版)
        // ==========================================
        function parsePlayerIntent(playerInput) {
          let combatData = window.BattleUIBridge?.getMVU('world.combat');
          hydrateCombatData(combatData);
          let attacker = combatData.participants.player;
          const preferredPlayerName = String(
            window.BattleUIBridge?.getMVU('sys.player_name') || attacker?.name || '主角',
          ).trim();
          let charData =
            window.BattleUIBridge?.getMVU('char.' + attacker.name) ||
            window.BattleUIBridge?.getMVU('char.' + preferredPlayerName) ||
            window.BattleUIBridge?.getMVU('char.主角');
          bindCombatParticipant(charData);

          let action = {
            action_type: '常规攻击',
            cast_time: 10,
            is_charged: false,
            skill: normalizeSkillData(
              {
                name: '普通攻击',
                _效果数组: [
                  { 机制: '系统基础', 消耗: '无', 对象: '敌方/单体', 技能类型: '输出', cast_time: 10 },
                  { 机制: '直接伤害', 目标: '敌方单体', 威力倍率: 100, 伤害类型: '物理近战', 穿透修饰: 0 },
                ],
              },
              '普通攻击',
            ),
          };
          if (!charData) return action;

          let matchedSkill = null;
          let matchedSkillName = '';
          // 为了支持多重施法，我们需要找出所有被提及的技能。但为了保持单技能模式兜底，我们先选出最主要的那个。
          // TODO: 后续可以升级为返回技能数组，这里先保留主技能逻辑，把时间累计放进 pre_actions 处理中
          let directSkills = collectCombatSkills(charData, combatData.participants.team_player || []);
          directSkills.forEach(skill => {
          conslet plainName = (skill.name || '').replace(/^武魂融合技·/, '');
            if (playerInput.includes(skill.name) || (plainName && playerInput.includes(plainName))) {
              // 如果提及多个，这里会被覆盖为最后一个，目前作为主动作
              matchedSkill = skill;
              matchedSkillName = skill.name;
            }
          });

          if (matchedSkill) {
            action.action_type = matchedSkillName.includes('武魂融合技') ? '武魂融合技' : '释放魂技';
            action.cast_time = getSkillCastTime(matchedSkill) || 10;
            action.skill = normalizeSkillData(matchedSkill, matchedSkillName);
          }

          // 💥 [核心改造] 副动作(Pre-Actions)多维复合解析引擎
          // 把玩家提及的额外操作统一压入 pre_actions 数组。之后会在外层判断总 cast_time。
          action.pre_actions = [];

          // 1. 生命之火 (通常认为是极速瞬间爆发)
          if (playerInput.includes('生命之火')) {
            let lifeFireSkillData = charData.bloodline_power?.skills?.['点燃生命之火'];
            if (lifeFireSkillData) {
              action.pre_actions.push({
                action_type: '点燃生命之火',
                skill: normalizeSkillData(lifeFireSkillData, '点燃生命之火'),
                cast_time: 5, // 给一点微小的基础耗时，防止无限套娃
              });
            }
          }

          // 2. 穿戴斗铠 (极其吃前摇)
          if (
            playerInput.includes('斗铠') &&
            (playerInput.includes('穿') || playerInput.includes('释放') || playerInput.includes('附体'))
          ) {
            let armorLv = charData.equip?.armor?.lv || 1;
            let isRejected = charData.equip?.armor?.is_rejected || false;
            let minQ = Infinity;
            let pCount = 0;
            if (charData.equip?.armor?.parts) {
              Object.values(charData.equip.armor.parts).forEach(p => {
                if (p.状态 !== '未打造' && p.状态 !== '重创') {
                  if (p.品质系数 < minQ) minQ = p.品质系数;
          cons      pCount++;
                }
              });
            }

            let armorCast = Math.max(0, 20 - armorLv * 5);
            if (armorLv === 1 && !isRejected && minQ > 1.2 && pCount > 0) {
              armorCast = Math.max(0, armorCast - 5);
            }

            // 不再硬性判断是否瞬间，统统塞进去，外层的 40上限 机制会教他做人
            action.pre_actions.push({
              action_type: '穿戴装备',
              equip_target: 'armor',
              cast_time: armorCast,
              skill: normalizeSkillData({
      cons        name: armorCast <= 0 ? '斗铠瞬间附体' : '斗铠附体读条',
                技能类型: '辅助',
                消耗: '无',
              }),
            });
            playerInput = playerInput.replace(/斗铠/g, '已解析的斗铠');
          }

          // 3. 展开各类领域 (通常较快)
          if (playerInput.includes('斗铠领域')) {
            action.pre_actions.push({
      cons      action_type: '展开斗铠领域',
              cast_time: 0,
              skill: normalizeSkillData({ name: '展开斗铠领域', 技能类型: '辅助', 消耗: '无' }),
            });
          } else if (playerInput.includes('精神领域')) {
            action.pre_actions.push({
              action_type: '展开精神领域',
              cast_time: 0,
              skill: normalizeSkillData({ name: '展开精神领域', 技能类型: '辅助', 消耗: '无' }),
            });
          } else if (playerInput.includes('武魂领域')) {
            action.pre_actions.push({
              action_type: '展开武魂领域',
        cons    cast_time: 0,
        cons    skill: normalizeSkillData({ name: '展开武魂领域', 技能类型: '辅助', 消耗: '无' }),
            });
          }
cons
        cons// 4. 武魂融合技判定 (这是一个巨大的主动作，会覆盖掉普通的释放魂技)
          if (playerInput.includes('武魂融合技')) {
            let hasFusion = false;
            Object.entries(charData.martial_fusion_skills || {}).forEach(([fusionName, fusionSkill]) => {
              if (!isFusionSkillAvailable(charData, fusionSkill, combatData.participants.team_player || [])) return;
              hasFusion = true;
              action.action_type = '武魂融合技';
              action.skill = normalizeSkillData(fusionSkill.skill_data, `武魂融合技·${fusionName}`);
              action.skill.name = `武魂融合技·${action.skill.name}`;
              action.cast_time = getSkillCastTime(action.skill) || 30;
            });
      cons    if (!hasFusion) {
              action.action_type = '施法失败';
              action.cast_time = 0;
            }
          } else if (!matchedSkill) {
      cons    // 如果没有任何武魂融合技、也没有匹配到具体魂技，但是匹配到了一些其它的特殊主动作
            if (playerInput.includes('多元素融合')) {
        cons    action.action_type = '多元素融合';
        cons    action.fusionElements = extractBattleFusionElementsFromText(playerInput);
        cons    action.fusionPattern = buildBattleFusionPattern(action.fusionElements);
              if (playerInput.includes('蓄力')) action.is_charged = true;
              let isSilverDragon =
                charData.bloodline_power?.bloodline?.includes('银龙王') ||
                Object.values(charData.spirit || {}).some(sp => sp.表象名称?.includes('元素使'));
              if (isSilverDragon) action.cast_time = 5;
              action.skill = normalizeSkillData({
                name: '多元素融合',
                技能类型: '输出',
                消耗: '无',
                附带属性: action.fusionElements || [],
                 } else if (playerInput.include     action.action_type = '元素剥离';
              action.cast_time = 15;
              action.skill = normalizeSkillData({
                name: '元素剥离',
                技能类型: '控制',
                消耗: '魂力:15% 精神力:20%',
                cast_time: 15,
           cons });
            } else if (playerInput.includes('五行剥离')) {
              action.action_type = '五行剥离';
              action.cast_time = 18;
              action.skill = normalizeSkillData({
                name: '五行剥离',
                技能类型: '控制',
                消耗: '魂力:18% 精神力:25%',
                cast_time: 18,
      cons      });
            } else if (playerInput.includes('五行遁法')) {
              action.action_type = '五行遁法';
              action.cast_time = 12;
              action.skill = normalizeSkillData({
                name: '五行遁法',
           cons   技能类型: '辅助',
                消耗: '魂力:12% 精神力:18% 维持:精神力:8%',
        cons      cast_time: 12,
              });
            } else if (playerInput.includes('吸血反哺')) {
              action.action_type = '吸血反哺';
              action.heal_ratio = 0.3;
            } else if (playerInput.includes('机甲') && (playerInput.includes('召唤') || playerInput.includes('进入'))) {
              // 普通机甲同理，必须作为主动作读条
              action.action_type = '穿戴装备';
              let mechLv = charData.equip?.mech?.lv || '黄级';
              action.cast_time = mechLv === '红级' ? 0 : 50;
              action.equip_target = 'mech';
              action.skill = normalizeSkillData({ name: '召唤机甲', 技能类型: '辅助', 消耗: '无' });
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

          (combatData.participants.team_player || []).forEach(p => {
            bindCombatParticipant(p);
            if (p.vit > 0) allFighters.push({ char: p, side: 'player' });
          });
          (combatData.participants.team_enemy || []).forEach(e => {
                 if (e.vit > 0) allFighters.p   });

          let typePriority = {
            辅助系: 1,
            控制系: 2,
            敏攻系: 2,
            强攻系: 2,
            精神系: 2,
            元素系: 2,
            防御系: 3,
            治疗系: 3,
            食物系: 3,
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
            let isSupport = ['辅助系', '治疗系', '食物系', '控制系'].includes(target.type);
            let isTank = ['防御系', '强攻系'].includes(target.type);
            let hpRatio = target.vit / target.vit_max;

            if (attackerChar.type === '敏攻系') {
              if (isSupport) weight += 60;
              if (hpRatio < 0.3) weight += 30;
            } else if (attackerChar.type === '强攻系') {
              if (isTank) weight += 50;
              if (hpRatio < 0.5) weight += 40;
            } else if (attackerChar.type === '控制系') {
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

        function scoreEnemyTargetForSkill(attackerChar, target, skill) {
          bindCombatParticipant(attackerChar);
          bindCombatParticipant(target);
          const snapshot = buildConditionTacticalSnapshot(target);
          const summary = deriveBattleSummaryFromEffects(skill);
          const dmg = getPrimaryDamageEffect(skill);
          const hpRatio = Math.max(0, Number(target.vit || 0)) / Math.max(1, Number(target.vit_max || 1));
          const power = Number(dmg?.威力倍率 || 0);
          const penetration = Number(dmg?.穿透修饰 || 0);
          const isSupport = ['辅助系', '治疗系', '食物系', '控制系'].includes(target.type);
          const isTank = ['防御系', '强攻系'].includes(target.type);
          let weight = 10;

          if (attackerChar.type === '敏攻系') {
            if (isSupport) weight += 45;
            if (hpRatio < 0.4) weight += 30;
          } else if (attackerChar.type === '强攻系') {
            if (isTank) weight += 20;
            if (hpRatio < 0.5) weight += 25;
          } else if (attackerChar.type === '控制系') {
            if (isSupport) weight += 35;
            if (!snapshot.isLockedOrControlled) weight += 15;
          } else {
            if (hpRatio < 0.5) weight += 25;
          }

          if (hasSkillMechanism(skill, ['禁疗'])) {
            if (snapshot.hasAntiHeal) weight -= 40;
            if (snapshot.hasHealingTrend || isSupport) weight += 70;
          }
          if (hasSkillMechanism(skill, ['斩杀补伤']) || (summary.爆发级别 === '高' && power >= 180)) {
            if (hpRatio < 0.35) weight += 80;
            else if (hpRatio < 0.55) weight += 25;
            if (snapshot.isLockedOrControlled) weight += 20;
            if (snapshot.hasDotPressure) weight += 15;
          }
          if (penetration >= 15 || /破甲|穿透|粉碎/.test(String(skill?.name || ''))) {
            if (snapshot.hasShielded) weight += 60;
            if (snapshot.hasDefenseBuffed || isTank) weight += 35;
          }
          if (summary.控制强度 !== '无') {
            if (!snapshot.isLockedOrControlled) weight += 30;
            else weight -= 25;
            if (target.charging_skill) weight += 35;
          }
          if (hasSkillMechanism(skill, ['持续伤害'])) {
            if (hpRatio > 0.55) weight += 20;
            if (snapshot.debuffCount > 0) weight += 15;
            if (hpRatio < 0.25) weight -= 15;
          }
          return Math.max(1, weight);
        }

        function chooseEnemyTargetForSkill(attackerChar, enemyTeam, skill, fallbackTarget = null) {
          const validTargets = (enemyTeam || []).filter(target => target && Number(target.vit || 0) > 0);
          if (validTargets.length === 0) return fallbackTarget || null;
          const focusTarget = getActorFocusedTarget(attackerChar, validTargets);
          if (!skill) return focusTarget || fallbackTarget || validTargets[0];
          if (validTargets.length === 1) return validTargets[0];
          const memory = ensureActorDecisionMemory(attackerChar);
          const summary = deriveBattleSummaryFromEffects(skill);
          const picked = chooseWeightedOption(
            validTargets.map(target => {
              let weight = scoreEnemyTargetForSkill(attackerChar, target, skill);
              if (focusTarget && target.name === focusTarget.name) {
                weight += 18 + Number(memory.focus_ttl || 0) * 6;
                if (memory.focus_reason === 'control_window') {
                  if (summary.爆发级别 === '高' || hasSkillMechanism(skill, ['斩杀补伤'])) weight += 18;
                  if (summary.控制强度 !== '无') weight -= 12;
                } else if (memory.focus_reason === 'anti_heal_window') {
                  if (hasSkillMechanism(skill, ['持续伤害', '斩杀补伤']) || summary.爆发级别 !== '无') weight += 12;
                } else if (memory.focus_reason === 'armor_break_window') {
                  if (Number(getPrimaryDamageEffect(skill)?.穿透修饰 || 0) >= 15 || summary.爆发级别 === '高')
                    weight += 14;
                } else if (memory.focus_reason === 'shared_vision_focus') {
                  if (summary.目标规模 === '单体') weight += 18;
                } else if (memory.focus_reason === 'dot_pressure') {
                  if (hasSkillMechanism(skill, ['斩杀补伤', '持续伤害']) || summary.爆发级别 === '高') weight += 16;
                } else if (memory.focus_reason === 'finisher') {
                  if (hasSkillMechanism(skill, ['斩杀补伤']) || summary.爆发级别 !== '无') weight += 22;
                }
              }
              return { target, weight: Math.max(1, weight) };
            }),
          );
          return picked?.target || focusTarget || fallbackTarget || validTargets[0];
        }

        function scoreAllyTargetForSkill(actorChar, ally, skill) {
          bindCombatParticipant(actorChar);
          bindCombatParticipant(ally);
          const snapshot = buildConditionTacticalSnapshot(ally);
          const hpRatio = Math.max(0, Number(ally.vit || 0)) / Math.max(1, Number(ally.vit_max || 1));
          const spRatio = Math.max(0, Number(ally.sp || 0)) / Math.max(1, Number(ally.sp_max || 1));
          const menRatio = Math.max(0, Number(ally.men || 0)) / Math.max(1, Number(ally.men_max || 1));
          const attackScore = Math.max(Number(ally.str || 0), Number(ally.men_max || 0));
          let weight = ally.name === actorChar.name ? 12 : 10;
          if (
            getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect, ['vit'])) ||
            hasSkillMechanism(skill, ['护盾', '免死'])
          )
            weight += Math.floor((1 - hpRatio) * 120) + (snapshot.hasBadCondition ? 15 : 0);
          if (getSkillEffects(skill).some(effect => isBattleRecoverEffect(effect, ['sp', 'men'])))
            weight += Math.floor((1 - spRatio) * 40) + Math.floor((1 - menRatio) * 40);
          if (hasSkillMechanism(skill, ['共享视野'])) weight += Math.min(40, Math.floor(attackScore / 500));
          if (['辅助系', '治疗系', '食物系', '控制系'].includes(ally.type)) weight += 10;
          return Math.max(1, weight);
        }

        function chooseAllyTargetForSkill(actorChar, allyTeam, skill, fallbackTarget = null) {
          const validAllies = (allyTeam || []).filter(target => target && Number(target.vit || 0) > 0);
          if (validAllies.length === 0) return actorChar;
          if (!skill) return fallbackTarget || validAllies[0] || actorChar;
          const picked = chooseWeightedOption(
            validAllies.map(target => ({ target, weight: scoreAllyTargetForSkill(actorChar, target, skill) })),
          );
          return picked?.target || fallbackTarget || validAllies[0] || actorChar;
        }

        function chooseTargetForActor(actorEntry, battleState) {
          if (!actorEntry || !battleState?.combatData) return null;
          const enemyTeam =
            actorEntry.side === 'player'
              ? battleState.combatData.participants.team_enemy || []
              : battleState.combatData.participants.team_player || [];
          const allyTeam =
            actorEntry.side === 'player'
              ? battleState.combatData.participants.team_player || []
              : battleState.combatData.participants.team_enemy || [];
          const focusEnemy = getActorFocusedTarget(actorEntry.char, enemyTeam);
          return {
            enemyTarget: focusEnemy || findTarget(actorEntry.char, enemyTeam),
            allyTarget: findAllyTarget(actorEntry.char, allyTeam),
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

          const allyTeam =
            actorEntry.side === 'player'
              ? (battleState.combatData.participants.team_player || []).filter(unit => unit.name !== actor.name)
              : (battleState.combatData.participants.team_enemy || []).filter(unit => unit.name !== actor.name);

          const makeActorAction = (type, log, skill = null, extra = {}) =>
            Object.assign(
              {
                type,
                log,
                skill: skill ? normalizeSkillData(skill, skill.name || skill.技能名称 || type) : null,
                def_mult: 1.0,
              },
              extra,
            );

          const observedTargetAction = enemyTarget?.charging_skill || {
            action_type: '常规攻击',
            cast_time: 10,
            skill: normalizeSkillData(
              {
                name: '普通攻击',
                _效果数组: [
                  { 机制: '系统基础', 消耗: '无', 对象: '敌方/单体', 技能类型: '输出', cast_time: 10 },
                  { 机制: '直接伤害', 目标: '敌方单体', 威力倍率: 100, 伤害类型: '物理近战', 穿透修饰: 0 },
                ],
              },
              '普通攻击',
            ),
          };

          const ratio = enemyTarget?.charging_skill
            ? calculateReactionRatio(enemyTarget, actor, observedTargetAction, {
                combat_type: battleState.combatData.combat_type || '突发遭遇',
                initiative: actor.name,
                participants: { player: enemyTarget, enemy: actor },
              })
            : 1;

          const availableSkills = collectCombatSkills(actor, allyTeam);
          const strategicContext = buildStrategicCandidates(
            actor,
            enemyTarget,
            battleState.combatData,
            observedTargetAction,
            ratio,
            availableSkills,
            allyTeam,
            makeActorAction,
          );
          const isSupport = ['辅助系', '治疗系', '食物系'].includes(actor.type);
          const isLowHealth = actor.vit < actor.vit_max * 0.3;

          const strategicAction = chooseAndBuildActorAction(
            actor,
            enemyTarget,
            strategicContext.behaviorState,
            strategicContext.strategicBranches,
            '行为预演/主动战略阶段',
          );
          const convertDecisionToTurnAction = decisionAction => {
            if (!decisionAction) return null;
            const neutralSkill = normalizeSkillData(
              {
                name: decisionAction.type || '战术动作',
                _效果数组: [{ 机制: '系统基础', 消耗: '无', 对象: '自身', 技能类型: '辅助', cast_time: 10 }],
              },
              decisionAction.type || '战术动作',
            );

            return {
              action_type: decisionAction.type || '释放技能',
              cast_time: decisionAction.skill?.cast_time || 10,
              skill: decisionAction.skill || neutralSkill,
              source: 'auto_actor',
              decision_log: decisionAction.log,
              def_mult: decisionAction.def_mult || 1.0,
            };
          };
          if (strategicAction) return convertDecisionToTurnAction(strategicAction);

          const skillContext = buildNpcSkillCandidateContext(
            actor,
            enemyTarget,
            observedTargetAction,
            availableSkills,
            strategicContext.behaviorState,
            strategicContext.activeBuffs,
            isLowHealth,
        cons);
          const tacticalBranches = buildTacticalCandidates(
            actor,
            enemyTarget,
            observedTargetAction,
            consrategicContext.behaviorState,
            skillContext,
            makeActorAction,
            isSupport,
            isLowHealth,
          );
          const tacticalAction = chooseAndBuildActorAction(
            actor,
            enemyTarget,
            strategicContext.behaviorState,
            tacticalBranches,
            '行为预演/主动战术阶段',
            `${skillContext.skillTraceLog ? skillContext.skillTraceLog + ' | ' : ''}`,
          );
          if (tacticalAction) return convertDecisionToTurnAction(tacticalAction);

          return {
            action_type: '常规攻击',
            cast_time: 10,
            skill: normalizeSkillData(
              {
                name: '普通攻击',
                _效果数组: [
                  { 机制: '系统基础', 消耗: '无', 对象: '敌方/单体', 技能类型: '输出', cast_time: 10 },
                  { 机制: '直接伤害', 目标: '敌方单体', 威力倍率: 100, 伤害类型: '物理近战', 穿透修饰: 0 },
                ],
              },
              '普通攻击',
            ),
            source: 'auto_actor',
            decision_log: '[行为预演/主动战术阶段] 无更优动作，回落为普通攻击。',
          };
        }

        function createActorTurnCombatData(actorEntry, target, battleState) {
          const actor = actorEntry.char;
          const actorAllies =
            actorEntry.side === 'player'
              ? (battleState.combatData.participants.team_player || []).filter(unit => unit.name !== actor.name)
              : (battleState.combatData.participants.team_enemy || []).filter(unit => unit.name !== actor.name);
          const targetAllies =
            actorEntry.side === 'player'
              ? (battleState.combatData.participants.team_enemy || []).filter(unit => unit.name !== target.name)
              : (battleState.combatData.participants.team_player || []).filter(unit => unit.name !== target.name);

          return {
            combat_type: battleState.combatData.combat_type || '突发遭遇',
            initiative: actor.name,
            participants: {
              player: actor,
              enemy: target,
              team_player: actorAllies,
              team_enemy: targetAllies,
            },
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
            return { actor: actor.name, side: actorEntry.side, skipped: true, reason: '已失去战斗力' };
          }

          if (isActorHardControlled(actor)) {
            return {
              actor: actor.name,
              side: actorEntry.side,
              skipped: true,
              reason: '处于硬控状态',
              log: `[团战执行] ${actor.name}处于硬控状态，本回合无法行动。`,
            };
          }

          const targets = chooseTargetForActor(actorEntry, battleState);
          if (!targets || !targets.enemyTarget) {
            return { actor: actor.name, side: actorEntry.side, skipped: true, reason: '无可用目标' };
          }
          bindCombatParticipant(targets.enemyTarget);
          bindCombatParticipant(targets.allyTarget);

          let action = null;
          let actionLog = '';
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
                log: `[团战执行] ${actor.name}继续为[${action.skill?.name || action.action_type}]蓄力，剩余前摇:${action.cast_time}。`,
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
                totalTimeCost += action.cast_time || 0;
              } else {
                carryOverAction = action;
                carryOverAction.cast_time -= Math.max(0, 40 - totalTimeCost);
              }
            }

            validPreActions.forEach(preAct => {
              const preCostLog = applyActionCost(actor, preAct);
              if (preCostLog) actionLog += preCostLog + ' ';
              if (preAct.action_type === '穿戴装备') {
                actor.equip[preAct.equip_target].equip_status = '已装备';
                actionLog += `[连招生效] ${actor.name}趁隙穿戴了${preAct.equip_target === 'armor' ? '斗铠' : '机甲'}！`;
              }
            });
            action.pre_actions = validPreActions;

            if (carryOverAction) {
              actor.charging_skill = carryOverAction;
        cons    return {
        cons      actor: actor.name,
                side: actorEntry.side,
                target: targets.enemyTarget.name,
                charging: true,
                action: actor.charging_skill,
                log: `[团战执行/转蓄力] 连招耗时过长，${actor.name}进入蓄力状态准备[${carryOverAction.skill?.name || carryOverAction.action_type}]，剩余前摇:${carryOverAction.cast_time}。`,
              };
            }

            if (action.action_type !== '施法失败') {
              const costLog = applyActionCost(actor, action);
              if (action.decision_log) actionLog += action.decision_log + ' ';
              if (costLog) actionLog += costLog + ' ';
            }
          }

          let finalTarget = targets.enemyTarget;
          const skillTargetObj = getSkillTarget(action?.skill);
          const enemyTeam =
            actorEntry.side === 'player'
              ? battleState.combatData.participants.team_enemy || []
              : battleState.combatData.participants.team_player || [];
          const allyTeam =
            actorEntry.side === 'player'
              ? [
                  actor,
                  ...(battleState.combatData.participants.team_player || []).filter(unit => unit.name !== actor.name),
                ]
              : [
                  actor,
                  ...(battleState.combatData.participants.team_enemy || []).filter(unit => unit.name !== actor.name),
                ];
          if (skillTargetObj.includes('己方') || skillTargetObj.includes('友方')) {
            finalTarget = chooseAllyTargetForSkill(actor, allyTeam, action?.skill, targets.allyTarget || actor);
          } else if (skillTargetObj.includes('自身')) {
            finalTarget = actor;
          } else {
            finalTarget = chooseEnemyTargetForSkill(actor, enemyTeam, action?.skill, targets.enemyTarget);
          }
          if (!finalTarget) finalTarget = targets.enemyTarget || actor;
          action.target_name = finalTarget?.name || action.target_name || null;

          const actorTurnCombatData = createActorTurnCombatData(actorEntry, finalTarget, battleState);
          const ratio = calculateReactionRatio(actor, finalTarget, action, actorTurnCombatData);
          let reactionAction = { type: '无法反应', log: '无', skill: null, def_mult: 1.0 };
          if (finalTarget === actor || skillTargetObj.includes('己方') || skillTargetObj.includes('友方')) {
            reactionAction.log = `[配合] ${finalTarget.name}毫无防备地接受了${actor.name}的辅助。`;
          } else {
            reactionAction = finalTarget.is_controlled
              ? { type: '无法反应', log: `${finalTarget.name}处于被控状态，无法动作。`, skill: null, def_mult: 1.0 }
              : determineNpcAction(actorTurnCombatData, action, ratio);
          }

          const settleResult = executeClash(action, reactionAction, actorTurnCombatData);
          let turnLog =
            `${actionLog}[团战执行] ${actor.name}以[${action?.skill?.name || action?.action_type || '未知动作'}]指向[${finalTarget.name}]。 ${reactionAction.log} ${settleResult.desc}`.trim();

          let finalDmg = settleResult.dmg;
          const reactiveDefense = resolveReactiveDefenseOnDamage(actor, finalTarget, finalDmg);
          let appliedDamage = 0;
          finalDmg = reactiveDefense.damage;
          if (reactiveDefense.counterDamage > 0)
            actor.vit = Math.max(0, Number(actor.vit || 0) - reactiveDefense.counterDamage);
          if (reactiveDefense.log) turnLog += ` ${reactiveDefense.log}`;
          if (finalDmg > 0) {
            if (finalDmg < finalTarget.def * 0.1) {
      cons      finalTarget.vit -= 1;
      cons      appliedDamage = 1;
              turnLog += ` [未破防] 对${finalTarget.name}仅造成 1 点强制伤害。`;
            } else {
              finalTarget.vit -= finalDmg;
              appliedDamage = finalDmg;
              if (finalDmg > finalTarget.sp_max * 0.5) {
                if (!finalTarget.conditions) finalTarget.conditions = {};
                finalTarget.conditions['重度流血'] = {
                  类型: 'debuff',
                  层数: 1,
                  描述: '重创导致的流血',
                  duration: 3,
                  stat_mods: { str: 1.0, def: 1.0, agi: 1.0, sp_max: 1.0 },
                  combat_effects: {
                    skip_turn: false,
                    dot_damage: Math.floor(finalTarget.vit_max * 0.05),
                    armor_pen: 0,
                  },
                };
                turnLog += ` [重创打击] ${finalTarget.name}被附加[重度流血]状态！`;
              }
            }
          }
          const targetInterruptLog = resolveCastInterruptOnDamage(
            finalTarget,
            action,
            appliedDamage,
            settleResult,
            finalTarget.name || '目标',
          );
          if (targetInterruptLog) turnLog += ` ${targetInterruptLog}`;

          if (reactionAction.type === '穿戴装备') {
            const actorStateCalc = getPrimaryStateCalc(action.skill);
            const actorInterruptChance = Number(
              getSkillEffects(action.skill).find(e => e?.机制 === '打断')?.中断概率 || 0,
            );
            const isTargetInterrupted =
              settleResult.dmg / Math.max(1, finalTarget.vit_max) >= 0.15 ||
              actorStateCalc.skip_turn === true ||
              getPrimaryStateFlags(action.skill).includes('硬控') ||
              (actorInterruptChance > 0 && Math.random() <= Math.min(1, actorInterruptChance)) ||
              (Number(settleResult.interrupt_bonus || 0) > 0 &&
                Math.random() <= Math.min(1, Number(settleResult.interrupt_bonus || 0)));
            if (!isTargetInterrupted) {
              finalTarget.equip[reactionAction.skill.equip_target].equip_status = '已装备';
              turnLog += ` [装备生效] ${finalTarget.name}成功完成装备穿戴。`;
            } else {
              turnLog += ` [穿戴失败] ${finalTarget.name}的装备穿戴被强行打断。`;
            }
          }

          if (
            finalTarget.vit < finalTarget.vit_max * 0.1 &&
            finalTarget !== actor &&
            !skillTargetObj.includes('己方') &&
            !skillTargetObj.includes('友方')
          ) {
            let hasMech = finalTarget.equip?.mech?.lv !== '无' && finalTarget.equip?.mech?.status !== '重创';
            let hasArmor = finalTarget.equip?.armor?.equip_status === '已装备';
            if (hasMech || hasArmor) {
              finalTarget.vit = Math.floor(finalTarget.vit_max * 0.1);
              turnLog += ` [装备护主] ${finalTarget.name}触发装备护主，强制锁血至 10%。${applyArmorDamage(finalTarget)}`;
            }
          }

          const focusUpdate = updateActorFocusFromAction(actor, action, finalTarget, targets.enemyTarget, settleResult);
      cons  if (focusUpdate?.target) {
      cons    broadcastActorFocusToTeam(actorEntry, battleState, focusUpdate.target, focusUpdate.reason, focusUpdate.ttl);
            const focusLabelMap = {
              control_window: '控制追击',
              anti_heal_window: '断疗压杀',
              armor_break_window: '破防追击',
              dot_pressure: '持续压血',
              finisher: '收割',
              shared_vision_focus: '集火',
            };
            turnLog += ` [战术焦点] ${actor.name}将${focusUpdate.target.name}锁为后续${focusLabelMap[focusUpdate.reason] || '追击'}目标。`;
          }
          if (evaluateActionCountered(action, finalTarget, reactionAction, settleResult, skillTargetObj)) {
            recordActorSkillCountered(
              actor,
              action?.skill?.name || action?.action_type || '',
              reactionAction?.type || settleResult?.desc || '',
            );
            turnLog += ` [战术复盘] ${actor.name}意识到[${action?.skill?.name || action?.action_type || '该招式'}]再次被有效克制，短期内会降低其使用倾向。`;
          }

          return {
            actor: actor.name,
            side: actorEntry.side,
            target: finalTarget.name,
            action,
            reactionAction,
            settleResult,
            log: turnLog,
            extraPatchOps: Array.isArray(settleResult?.extraPatchOps) ? settleResult.extraPatchOps : [],
            actorVit: actor.vit,
            targetVit: finalTarget.vit,
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
            ...(combatData.participants.team_enemy || []),
          ];

          allUnits.forEach(unit => {
            bindCombatParticipant(unit);
            if (unit.vit <= 0) return;

            const sustainResult = settleSustainEffectsAtRoundEnd(unit, unit.name || '未知单位');
            const conditionResult = settleConditionsAtRoundEnd(unit, unit.name || '未知单位');
            if (sustainResult.log) logs.push(`[团战回合尾] ${sustainResult.log}`);
            if (conditionResult.log) logs.push(`[团战回合尾] ${conditionResult.log}`);
          });
        }

        function runTeamBattleSimulation(combatData, maxRounds = 3) {
          hydrateCombatData(combatData);
          let logs = [];
          let extraPatchOps = [];
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
              if (Array.isArray(turnResult?.extraPatchOps) && turnResult.extraPatchOps.length)
                extraPatchOps.push(...turnResult.extraPatchOps);
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
          const winner = finalEnemyAlive <= 0 ? 'player' : finalPlayerAlive <= 0 ? 'enemy' : 'unfinished';

          // 如果是团战模拟结束且是虚拟环境死亡，修正战利品结算与强制锁血弹出
          const combatType = combatData.combat_type || '突发遭遇';
          if (combatType === '升灵台虚拟战斗' || combatType === '魂灵塔冲塔') {
            if (winner === 'enemy') {
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
            logs,
            extraPatchOps,
          };
        }

        function runTeamBattleRound(combatData) {
          hydrateCombatData(combatData);
          const currentRound = Number(combatData.round || 0) + 1;
          combatData.round = currentRound;
          let logs = [`[团战第${currentRound}回合开始]`];
          let extraPatchOps = [];

          const queue = generateActionQueue(combatData);
          for (const actorEntry of queue) {
            const teamPlayerAlive = getTeamLivingCount(combatData.participants.team_player || []);
            const teamEnemyAlive = getTeamLivingCount(combatData.participants.team_enemy || []);
            if (teamPlayerAlive <= 0 || teamEnemyAlive <= 0) break;

            const turnResult = runActorTurn(actorEntry, { combatData, round: currentRound, logs });
            if (turnResult?.log) logs.push(turnResult.log);
            if (Array.isArray(turnResult?.extraPatchOps) && turnResult.extraPatchOps.length)
              extraPatchOps.push(...turnResult.extraPatchOps);
          }

          settleTeamRoundEnd(combatData, logs);

          const teamPlayerAlive = getTeamLivingCount(combatData.participants.team_player || []);
          const teamEnemyAlive = getTeamLivingCount(combatData.participants.team_enemy || []);
          const winner = teamEnemyAlive <= 0 ? 'player' : teamPlayerAlive <= 0 ? 'enemy' : 'unfinished';
          logs.push(`[团战回合总结] 我方存活:${teamPlayerAlive} 敌方存活:${teamEnemyAlive}`);

          return {
            rounds: 1,
            roundStart: currentRound,
            roundEnd: currentRound,
            winner,
            playerAlive: teamPlayerAlive,
            enemyAlive: teamEnemyAlive,
            logs,
            extraPatchOps,
          };
        }

        function ui_executeBattleFlow(combatData, options = {}) {
          if (!combatData) {
            return {
              mode: options.mode || 'single_round',
              roundsExecuted: 0,
              winner: 'unfinished',
              logs: ['[UI执行] 未提供 combatData。'],
              snapshot: null,
            };
          }

          const mode = options.mode === 'multi_round' ? 'multi_round' : 'single_round';
          const rounds = Math.max(1, Number(options.rounds || 1));
          const result =
            mode === 'multi_round' ? runTeamBattleSimulation(combatData, rounds) : runTeamBattleRound(combatData);
          const extraPatchOps = Array.isArray(result.extraPatchOps) ? result.extraPatchOps : [];
          const mvuUpdate =
            window.BattleUIBridge?.persistCombatData?.(combatData, {
              analysis:
                'Frontend team battle arbitration already produced the exact combat result. Apply the following JSONPatch exactly as given.',
              extraPatchOps,
            }) || null;

          return {
            mode,
            roundsRequested: mode === 'multi_round' ? rounds : 1,
            roundsExecuted: result.rounds || 0,
            roundStart: result.roundStart,
            roundEnd: result.roundEnd,
            winner: result.winner || 'unfinished',
            playerAlive: result.playerAlive,
            enemyAlive: result.enemyAlive,
            extraPatchOps,
            logs: result.logs || [],
            snapshot: ui_getBattleSnapshot(combatData),
            mvuUpdate,
          };
        }

        // ==========================================
        // 📍 UI 适配器层 (对外暴露接口)
        // ==========================================

        function ui_getBattleSnapshot(combatData) {
          if (!combatData) return null;
          hydrateCombatData(combatData);

          const buildUnitSnapshot = char => {
            if (!char) return null;
            return {
              name: char.name || '未知',
              lv: char.lv || 1,
              lv_label: formatBattleCultivationLevelText(char.lv || 1, '1'),
              type: char.type || '未知系',
              vit: char.vit || 0,
              vit_max: char.vit_max || 1,
              sp: char.sp || 0,
              sp_max: char.sp_max || 1,
              men: char.men || 0,
              men_max: char.men_max || 1,
              active_domain: char.active_domain || '无',
              conditions: Object.entries(char.conditions || {}).map(([name, cond]) => ({
                name,
                type: cond.类型 || 'buff',
                duration: cond.duration || 0,
                desc: cond.描述 || '',
                skip_turn: cond.combat_effects?.skip_turn || false,
                dot: cond.combat_effects?.dot_damage || 0,
              })),
              sustains: Object.keys(char.active_sustains || {}),
              isCharging: !!char.charging_skill,
              chargingCastTime: char.charging_skill?.cast_time || 0,
            };
          };

          return {
            round: Number(combatData.round || 0),
            combat_type: combatData.combat_type || '突发遭遇',
            initiative: combatData.initiative || '无',
            player: buildUnitSnapshot(combatData.participants.player),
            enemy: buildUnitSnapshot(combatData.participants.enemy),
            team_player: (combatData.participants.team_player || []).map(buildUnitSnapshot).filter(Boolean),
            team_enemy: (combatData.participants.team_enemy || []).map(buildUnitSnapshot).filter(Boolean),
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
              type: 'skill',
              name: skill.name,
              category: skill.source_tag || '魂技', // 核心修改：按来源分类
              semantic_role: getSkillType(skill) || '输出',
              tags: skill.标签 || [],
              cast_time: getSkillCastTime(skill),
              cost_text: getSkillCostText(skill),
              enabled: costParsed.canCast,
              reason: costParsed.canCast ? '' : '状态不足',
              raw_skill: skill,
            });
          });

          if (charData.equip?.armor?.lv > 0 && charData.equip?.armor?.equip_status !== '已装备') {
            actions.push({
              id: 'equip_armor',
              type: 'equip',
              name: '斗铠附体',
              category: '特殊动作',
              enabled: true,
              reason: '',
            });
          }

          if (
            charData.equip?.mech?.lv &&
            charData.equip.mech.lv !== '无' &&
            charData.equip?.mech?.equip_status !== '已装备' &&
            charData.equip?.mech?.status !== '重创'
          ) {
            actions.push({
              id: 'equip_mech',
              type: 'equip',
              name: '召唤机甲',
              category: '特殊动作',
              enabled: true,
              reason: '',
            });
          }

          if (charData.bloodline_power?.skills?.['点燃生命之火'] && !charData.bloodline_power?.life_fire) {
            actions.push({
              id: 'special_lifefire',
              type: 'special',
              name: '点燃生命之火',
              category: '特殊动作',
              enabled: true,
              reason: '',
            });
          }

          if (hasBattleUnlockedAttributeSet(charData, ['水', '火', '风', '土'])) {
            const pureControlSkill = normalizeSkillData({
              name: '元素剥离',
              技能类型: '控制',
              消耗: '魂力:15% 精神力:20%',
              cast_time: 15,
            });
            const costParsed = parseSkillCostForChar(pureControlSkill, charData);
            actions.push({
              id: 'special_element_strip',
              type: 'special',
              name: '元素剥离',
              category: '纯操控',
              semantic_role: '控制',
              cast_time: getSkillCastTime(pureControlSkill),
              cost_text: getSkillCostText(pureControlSkill),
              enabled: costParsed.canCast,
              reason: costParsed.canCast ? '' : '状态不足',
              raw_skill: pureControlSkill,
            });
          }

          if (hasBattleUnlockedAttributeSet(charData, ['金', '木', '水', '火', '土'])) {
            const wuxingStripSkill = normalizeSkillData({
              name: '五行剥离',
              技能类型: '控制',
              消耗: '魂力:18% 精神力:25%',
              cast_time: 18,
            });
            const wuxingEscapeSkill = normalizeSkillData({
              name: '五行遁法',
              技能类型: '辅助',
              消耗: '魂力:12% 精神力:18% 维持:精神力:8%',
              cast_time: 12,
            });
            const stripCostParsed = parseSkillCostForChar(wuxingStripSkill, charData);
            const escapeCostParsed = parseSkillCostForChar(wuxingEscapeSkill, charData);
            actions.push({
              id: 'special_wuxing_strip',
              type: 'special',
              name: '五行剥离',
              category: '纯操控',
              semantic_role: '控制',
              cast_time: getSkillCastTime(wuxingStripSkill),
              cost_text: getSkillCostText(wuxingStripSkill),
              enabled: stripCostParsed.canCast,
              reason: stripCostParsed.canCast ? '' : '状态不足',
              raw_skill: wuxingStripSkill,
            });
            actions.push({
              id: 'special_wuxing_escape',
              type: 'special',
              name: '五行遁法',
              category: '纯操控',
              semantic_role: '辅助',
              cast_time: getSkillCastTime(wuxingEscapeSkill),
              cost_text: getSkillCostText(wuxingEscapeSkill),
              enabled: escapeCostParsed.canCast,
              reason: escapeCostParsed.canCast ? '' : '状态不足',
              raw_skill: wuxingEscapeSkill,
            });
          }

          actions.push({
            id: 'action_flee',
            type: 'tactical',
            name: '亡命奔逃',
            category: '特殊动作',
            enabled: true,
            reason: '',
          });

          return actions;
        }

        function buildSerializedEntryFromAction(action) {
          if (!action) return null;
          const skill = action.raw_skill || action.skill || {};
          const type = action.action_type || action.type || skill.技能类型 || '输出';
          const name = action.name || skill.name || '';
          const actionObj = {
            type,
            skill,
            cast_time: Number(action.cast_time ?? skill.cast_time ?? 0) || 0,
            target_name: window.BattleUIBridge?.getMVU('world.combat.participants.enemy.name') || null,
          };
          if (type === '穿戴装备') actionObj.equip_target = /机甲/.test(name) ? 'mech' : 'armor';
          if (type === '吸血反哺') actionObj.heal_ratio = action.heal_ratio || 0.3;
          if (type === '多元素融合') {
            actionObj.fusionElements = normalizeBattleSkillAttributeTokens(action.fusionElements || []);
            actionObj.fusionPattern = String(
              action.fusionPattern || buildBattleFusionPattern(actionObj.fusionElements),
            );
          }
          if (action.is_charged) actionObj.is_charged = true;
          return actionObj;
        }

        function buildIntentText(actions) {
          const queue = (actions || []).map(buildSerializedEntryFromAction).filter(Boolean);
          const parts = [];
          if (queue.length) parts.push(`[动作串]${JSON.stringify(queue)}[/动作串]`);
          const target = window.BattleUIBridge?.getMVU('world.combat.participants.enemy.name');
          if (target) parts.push(`[目标]${target}[/目标]`);
          return parts.join('\n');
        }

        function submitBattleIntent() {
          const state = window.BattleUI?.state || {};
          const battleMode = state.currentMode === 'multi_round' ? 'multi_round' : 'single_round';
          const queue = [
            ...(state.selectedPreActions || []),
            state.selectedSkillActions?.[state.selectedSkillActions.length - 1],
          ].filter(Boolean);
          const intentText = buildIntentText(queue);
          const output = document.getElementById('ui-intent-output');
          if (output) output.value = intentText;
          window.__battleLastIntentText = intentText;

          let result = { intentText, mode: 'intent_only', battleMode };
          try {
            window.dispatchEvent(new CustomEvent('battle-ui-intent-submit', { detail: { intentText, battleMode } }));
          } catch (error) {
            console.warn('battle-ui-intent-submit dispatch failed', error);
          }

          if (typeof onPlayerAttack === 'function') {
            try {
              onPlayerAttack(intentText, { mode: battleMode });
              if (typeof syncFromBattleEngine === 'function') syncFromBattleEngine();
              result = {
                intentText,
                mode: 'engine_arbitrated',
                battleMode,
                aiRequest: window.__lastBattleAIRequest || null,
              };
            } catch (error) {
              console.error('battle arbitration failed', error);
              result = { intentText, mode: 'engine_error', battleMode, error };
            }
          } else if (window.BattleUIBridge?.pushUserInput) {
            const pushResult = window.BattleUIBridge.pushUserInput(intentText, { autoSend: false });
            result = { intentText, mode: 'intent_buffered', battleMode, delivery: pushResult };
          }

          try {
            window.dispatchEvent(new CustomEvent('battle-ui-submit-finished', { detail: result }));
          } catch (error) {
            console.warn('battle-ui-submit-finished dispatch failed', error);
          }
          return result;
        }

        function bindUIEvents() {
          document.querySelectorAll('#ui-mode-group .mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              document.querySelectorAll('#ui-mode-group .mode-btn').forEach(item => item.classList.remove('active'));
              btn.classList.add('active');
              if (window.BattleUI && window.BattleUI.state) {
                window.BattleUI.state.currentMode = btn.dataset.mode;
              }
            });
          });

          const arbitrateBtn = document.getElementById('ui-arbitrate');
          if (arbitrateBtn) arbitrateBtn.addEventListener('click', submitBattleIntent);
        }

        const originalInit = typeof initBattleUiFromMvu === 'function' ? initBattleUiFromMvu : null;
        if (originalInit) {
          initBattleUiFromMvu = async function () {
            await originalInit();
            bindUIEvents();
            window.BattleUI = Object.assign(window.BattleUI || {}, {
              buildIntentText,
              submitBattleIntent,
            });
          };
        }

        initBattleUiFromMvu();
      }
    }
  }
}

window.BattleUIComponent = BattleUIComponent;
