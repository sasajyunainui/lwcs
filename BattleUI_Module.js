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

    function getLiveSnapshot() {
      return component.snapshot || snapshot || {};
    }

    function escapeJsonPointer(text) {
      return String(text == null ? '' : text).replace(/~/g, '~0').replace(/\//g, '~1');
    }

    function ensureActorAggregate(aggregate, charName) {
      if (!aggregate.actors[charName]) {
        aggregate.actors[charName] = {
          statDelta: { vit: 0, sp: 0, men: 0 },
          nextAction: undefined,
          nextCastTime: undefined,
          alive: undefined,
          conditionUpserts: {},
          conditionRemoves: []
        };
      }
      return aggregate.actors[charName];
    }

    function applyEffectToAggregate(aggregate, effect) {
      if (!effect) return;
      if (effect.kind === 'combat_summary') {
        if (effect.value) aggregate.resultLines.push(String(effect.value));
        return;
      }
      if (effect.kind === 'combat_active') {
        aggregate.combat.isActive = !!effect.value;
        return;
      }
      if (effect.kind === 'combat_winner') {
        aggregate.combat.winner = String(effect.value || '');
        return;
      }
      const actor = ensureActorAggregate(aggregate, String(effect.target || ''));
      if (effect.kind === 'stat_delta') {
        actor.statDelta[effect.key] = Number(actor.statDelta[effect.key] || 0) + Number(effect.delta || 0);
        return;
      }
      if (effect.kind === 'condition_upsert') {
        actor.conditionUpserts[effect.key] = effect.value;
        actor.conditionRemoves = actor.conditionRemoves.filter(k => k !== effect.key);
        return;
      }
      if (effect.kind === 'condition_remove') {
        delete actor.conditionUpserts[effect.key];
        if (!actor.conditionRemoves.includes(effect.key)) actor.conditionRemoves.push(effect.key);
        return;
      }
      if (effect.kind === 'action_set') {
        actor.nextAction = effect.value;
        return;
      }
      if (effect.kind === 'cast_time_set') {
        actor.nextCastTime = Math.max(0, Number(effect.value || 0));
        return;
      }
      if (effect.kind === 'alive_set') {
        actor.alive = !!effect.value;
      }
    }

    function aggregateBattleSettlement(roundEvents) {
      const aggregate = {
        roundStart: roundEvents.length ? Number(roundEvents[0].round || 0) : 0,
        roundEnd: roundEvents.length ? Number(roundEvents[roundEvents.length - 1].round || 0) : 0,
        sceneText: '',
        narrationLines: [],
        resultLines: [],
        actors: {},
        combat: {
          isActive: true,
          winner: '',
          summary: '',
          sysReason: ''
        }
      };
      roundEvents.forEach(evt => {
        if (evt && evt.sceneText && !aggregate.sceneText) aggregate.sceneText = evt.sceneText;
        if (evt && Array.isArray(evt.narrationLines)) aggregate.narrationLines.push(...evt.narrationLines);
        (evt && Array.isArray(evt.effects) ? evt.effects : []).forEach(effect => applyEffectToAggregate(aggregate, effect));
        if (evt && evt.combat && evt.combat.summaryFragment) aggregate.resultLines.push(String(evt.combat.summaryFragment));
        if (evt && evt.combat && typeof evt.combat.continueBattle === 'boolean') aggregate.combat.isActive = evt.combat.continueBattle;
      });
      aggregate.combat.summary = aggregate.resultLines.join(' ');
      if (!aggregate.combat.summary) aggregate.combat.summary = `第${aggregate.roundStart}至${aggregate.roundEnd}回合战斗完成结算。`;
      return aggregate;
    }

    function getPostSettleActorState(charName, actorAgg) {
      const liveSnapshot = getLiveSnapshot();
      const charData = liveSnapshot && liveSnapshot.sd && liveSnapshot.sd.char ? (liveSnapshot.sd.char[charName] || {}) : {};
      const curVit = Number(charData && charData.stat ? charData.stat.vit || 0 : 0);
      const curSp = Number(charData && charData.stat ? charData.stat.sp || 0 : 0);
      const curMen = Number(charData && charData.stat ? charData.stat.men || 0 : 0);
      const nextVit = Math.max(0, curVit + Number(actorAgg && actorAgg.statDelta ? actorAgg.statDelta.vit || 0 : 0));
      const nextSp = Math.max(0, curSp + Number(actorAgg && actorAgg.statDelta ? actorAgg.statDelta.sp || 0 : 0));
      const nextMen = Math.max(0, curMen + Number(actorAgg && actorAgg.statDelta ? actorAgg.statDelta.men || 0 : 0));
      const alive = typeof (actorAgg && actorAgg.alive) === 'boolean'
        ? !!actorAgg.alive
        : (nextVit > 0 ? !!(charData && charData.status ? charData.status.alive !== false : true) : false);
      return { vit: nextVit, sp: nextSp, men: nextMen, alive };
    }

    function inferBattleSummaryResult(aggregate, battleMeta) {
      const activeName = String(battleMeta && battleMeta.activeName ? battleMeta.activeName : '').trim();
      const targetName = String(battleMeta && battleMeta.targetName ? battleMeta.targetName : '').trim();
      const activeAgg = activeName && aggregate.actors ? aggregate.actors[activeName] : null;
      const targetAgg = targetName && aggregate.actors ? aggregate.actors[targetName] : null;
      const activeState = activeAgg ? getPostSettleActorState(activeName, activeAgg) : null;
      const targetState = targetAgg ? getPostSettleActorState(targetName, targetAgg) : null;
      const activeDefeated = !!(activeState && (!activeState.alive || activeState.vit <= 0));
      const targetDefeated = !!(targetState && (!targetState.alive || targetState.vit <= 0));

      if (activeDefeated && targetDefeated) {
        return { result: '平局', isKilled: true };
      }
      if (activeName && aggregate.actors && aggregate.actors[activeName]) {
        if (!activeState.alive || activeState.vit <= 0) return { result: '失败', isKilled: false };
      }
      if (targetName && aggregate.actors && aggregate.actors[targetName]) {
        const vitDelta = Number(targetAgg && targetAgg.statDelta ? targetAgg.statDelta.vit || 0 : 0);
        const spDelta = Number(targetAgg && targetAgg.statDelta ? targetAgg.statDelta.sp || 0 : 0);
        const menDelta = Number(targetAgg && targetAgg.statDelta ? targetAgg.statDelta.men || 0 : 0);
        const hasDebuff = !!(targetAgg && targetAgg.conditionUpserts && Object.keys(targetAgg.conditionUpserts).length);
        if (!targetState.alive || targetState.vit <= 0) {
          return { result: '击败', isKilled: true };
        }
        if (vitDelta < 0 || spDelta < 0 || menDelta < 0 || hasDebuff) {
          return { result: '压制', isKilled: false };
        }
        return { result: '未决', isKilled: false };
      }
      if (aggregate.combat && aggregate.combat.winner) {
        if (aggregate.combat.winner === activeName) {
          return { result: '胜利', isKilled: false };
        }
        if (targetName && aggregate.combat.winner === targetName) {
          return { result: '失败', isKilled: false };
        }
        return {
          result: aggregate.combat.winner === battleMeta.activeName ? '胜利' : '未决',
          isKilled: false
        };
      }
      return { result: aggregate.combat && aggregate.combat.isActive === false ? '已结束' : '未决', isKilled: false };
    }

    function buildBattleSummaryPatchValue(aggregate, battleMeta) {
      const liveSnapshot = getLiveSnapshot();
      const currentSummary = liveSnapshot && liveSnapshot.sd && liveSnapshot.sd.world && liveSnapshot.sd.world.combat && liveSnapshot.sd.world.combat.summary && typeof liveSnapshot.sd.world.combat.summary === 'object'
        ? liveSnapshot.sd.world.combat.summary
        : {};
      const currentSettle = currentSummary && currentSummary.settle_result && typeof currentSummary.settle_result === 'object' ? currentSummary.settle_result : {};
      const settle = inferBattleSummaryResult(aggregate, battleMeta || {});
      return {
        player_action: {
          action_type: String(battleMeta && battleMeta.actionType ? battleMeta.actionType : '无') || '无',
          element_count: 1,
          is_charged: !!(battleMeta && battleMeta.isCharged)
        },
        settle_result: {
          target_npc: String(battleMeta && battleMeta.targetName ? battleMeta.targetName : (currentSettle.target_npc || '无')) || '无',
          result: String(settle.result || currentSettle.result || '未决') || '未决',
          is_killed: !!settle.isKilled
        },
        round_count: Math.max(1, Number(aggregate.roundEnd || 0) - Number(aggregate.roundStart || 0) + 1),
        mode: String(battleMeta && battleMeta.mode ? battleMeta.mode : (currentSummary.mode || 'single_round')) || 'single_round',
        generated_by: 'BattleUI_Module.js'
      };
    }

    function buildBattlePatchOps(aggregate, battleMeta = {}) {
      const liveSnapshot = getLiveSnapshot();
      const sd = liveSnapshot && liveSnapshot.sd ? liveSnapshot.sd : {};
      const allChars = sd && sd.char ? sd.char : {};
      const patchOps = [];
      Object.entries(aggregate.actors || {}).forEach(([charName, actorAgg]) => {
        const charData = allChars[charName] || {};
        const basePath = `/sd/char/${escapeJsonPointer(charName)}`;
        const curVit = Number(charData && charData.stat ? charData.stat.vit || 0 : 0);
        const curSp = Number(charData && charData.stat ? charData.stat.sp || 0 : 0);
        const curMen = Number(charData && charData.stat ? charData.stat.men || 0 : 0);
        const nextVit = Math.max(0, curVit + Number(actorAgg.statDelta.vit || 0));
        const nextSp = Math.max(0, curSp + Number(actorAgg.statDelta.sp || 0));
        const nextMen = Math.max(0, curMen + Number(actorAgg.statDelta.men || 0));
        if (nextVit !== curVit) patchOps.push({ op: 'replace', path: `${basePath}/stat/vit`, value: nextVit });
        if (nextSp !== curSp) patchOps.push({ op: 'replace', path: `${basePath}/stat/sp`, value: nextSp });
        if (nextMen !== curMen) patchOps.push({ op: 'replace', path: `${basePath}/stat/men`, value: nextMen });
        if (typeof actorAgg.nextAction === 'string' && actorAgg.nextAction) patchOps.push({ op: 'replace', path: `${basePath}/status/action`, value: actorAgg.nextAction });
        if (typeof actorAgg.alive === 'boolean') patchOps.push({ op: 'replace', path: `${basePath}/status/alive`, value: actorAgg.alive });
        else if (nextVit <= 0 && (!charData.status || charData.status.alive !== false)) patchOps.push({ op: 'replace', path: `${basePath}/status/alive`, value: false });
        Object.entries(actorAgg.conditionUpserts || {}).forEach(([condKey, condValue]) => {
          patchOps.push({ op: 'replace', path: `${basePath}/stat/conditions/${escapeJsonPointer(condKey)}`, value: condValue });
        });
        (actorAgg.conditionRemoves || []).forEach(condKey => {
          patchOps.push({ op: 'remove', path: `${basePath}/stat/conditions/${escapeJsonPointer(condKey)}` });
        });
      });
      patchOps.push({ op: 'replace', path: `/sd/world/combat/summary`, value: buildBattleSummaryPatchValue(aggregate, battleMeta) });
      patchOps.push({ op: 'replace', path: `/sd/world/combat/participants`, value: buildBattleParticipantsPatchValue(aggregate, battleMeta) });
      patchOps.push({ op: 'replace', path: `/sd/world/combat/is_active`, value: !!aggregate.combat.isActive });
      if (aggregate.roundEnd) patchOps.push({ op: 'replace', path: `/sd/world/combat/round`, value: aggregate.roundEnd });
      if (aggregate.combat.sysReason) patchOps.push({ op: 'replace', path: `/sd/sys/rsn`, value: aggregate.combat.sysReason });
      return patchOps;
    }

    function normalizeSkillAction(action) {
      const rawCastTime = action && (action.castTime ?? action.cast_time ?? action['cast_time'] ?? action['前摇'] ?? action['施法时间'] ?? action['施法前摇'] ?? action['current_cast_time']);
      const parsedCastTime = Number(rawCastTime);
      return {
        name: String(action && (action.name || action['技能名称']) || '').trim(),
        type: String(action && (action.type || action['技能类型']) || '').trim(),
        target: String(action && (action.target || action['对象']) || '').trim(),
        bonus: String(action && (action.bonus || action['加成属性']) || '').trim(),
        cost: String(action && (action.cost || action['消耗']) || '').trim(),
        desc: String(action && (action.desc || action['画面描述']) || '').trim(),
        castTime: Number.isFinite(parsedCastTime) && parsedCastTime >= 0 ? parsedCastTime : undefined
      };
    }

    function parseBattleCostText(costText) {
      const text = String(costText || '');
      const delta = { vit: 0, sp: 0, men: 0 };
      [
        { key: 'vit', regex: /(体力|气血|生命|血量|vit)\s*[:：]\s*(-?\d+(?:\.\d+)?)/ig },
        { key: 'sp', regex: /(魂力|灵力|sp)\s*[:：]\s*(-?\d+(?:\.\d+)?)/ig },
        { key: 'men', regex: /(精神(?:力)?|魂识|men)\s*[:：]\s*(-?\d+(?:\.\d+)?)/ig }
      ].forEach(rule => {
        let match;
        while ((match = rule.regex.exec(text))) {
          const raw = Number(match[2] || 0);
          if (Number.isFinite(raw) && raw !== 0) delta[rule.key] -= Math.abs(raw);
        }
      });
      return delta;
    }

    function inferSkillCastTime(skill, fallbackValue = 0, charName = null) {
        const explicit = Number(skill && skill.castTime);
        let baseCast = Math.max(0, Number(fallbackValue || 0));
        if (Number.isFinite(explicit) && explicit >= 0) baseCast = explicit;
        else {
            const liveCast = Number(skill && (skill.current_cast_time ?? skill['current_cast_time']));
            if (Number.isFinite(liveCast) && liveCast >= 0) baseCast = liveCast;
        }
        if (baseCast > 0 && charName) {
            const enemyLaw = getActiveEnemyLaw(charName, 'time_dilation');
            if (enemyLaw) {
                const multi = Number(enemyLaw.cast_time_multiplier || 2.0);
                baseCast = Math.ceil(baseCast * multi);
            }
        }
        return baseCast;
    }

    function isMeaningfulBattleActionName(text) {
      const value = String(text || '').trim();
      return !!value && !/^(无|应战|战斗中|失去战斗能力)$/.test(value);
    }

    function inferEnemyRoundAction(attackerName) {
      if (!attackerName) return null;
      const participantData = getBattleParticipantData(attackerName);
      const attackerData = getBattleCharData(attackerName);
      const participantAction = String(participantData && participantData.action_declared ? participantData.action_declared : '').trim();
      const statusAction = String(attackerData && attackerData.status ? attackerData.status.action || '' : '').trim();
      const chosenName = isMeaningfulBattleActionName(participantAction) ? participantAction : (isMeaningfulBattleActionName(statusAction) ? statusAction : '');
      if (!chosenName) return null;
      const declaredCastTime = Math.max(0, Number(participantData && participantData.current_cast_time ? participantData.current_cast_time : 0));
      return {
        name: chosenName,
        type: '',
        target: '',
        bonus: '',
        cost: '',
        desc: '',
        castTime: declaredCastTime > 0 ? declaredCastTime : 0
      };
    }

    function shouldEnemyActFirst(activeName, activeSkill, enemyName, enemySkill) {
      if (!activeName || !enemyName || !enemySkill) return false;
      const activeData = getBattleCharData(activeName);
      const enemyData = getBattleCharData(enemyName);
      const activeAgi = getBattleStatValue(activeData, 'agi');
      const enemyAgi = getBattleStatValue(enemyData, 'agi');
      const activeCast = inferSkillCastTime(activeSkill || {}, 0, activeName);
      const enemyCast = inferSkillCastTime(enemySkill || {}, 0, enemyName);
      const activeTypeBlob = `${activeSkill && activeSkill.type ? activeSkill.type : ''}/${activeSkill && activeSkill.desc ? activeSkill.desc : ''}/${activeSkill && activeSkill.name ? activeSkill.name : ''}`;
      const enemyTypeBlob = `${enemySkill && enemySkill.type ? enemySkill.type : ''}/${enemySkill && enemySkill.desc ? enemySkill.desc : ''}/${enemySkill && enemySkill.name ? enemySkill.name : ''}`;
      const activeTempo = /(控制|爆发|突袭|终结)/.test(activeTypeBlob) ? 4 : 0;
      const enemyTempo = /(控制|爆发|突袭|终结)/.test(enemyTypeBlob) ? 4 : 0;
      const activeScore = activeAgi * 0.08 - activeCast + activeTempo;
      const enemyScore = enemyAgi * 0.08 - enemyCast + enemyTempo;
      return enemyScore > activeScore + 2;
    }

    function inferConditionKind(skill) {
      const text = `${skill && skill.target ? skill.target : ''}/${skill && skill.type ? skill.type : ''}/${skill && skill.desc ? skill.desc : ''}`;
      if (/敌方/.test(text) || /(控制|削弱|异常)/.test(text)) return 'debuff';
      if (/领域/.test(text)) return 'field';
      if (/(蓄力|充能)/.test(text)) return 'charge';
      if (/(恢复|续航)/.test(text)) return 'sustain';
      return 'buff';
    }

    function buildConditionValue(skill) {
      return {
        类型: inferConditionKind(skill),
        层数: 1,
        描述: String(skill && skill.desc ? skill.desc : '') || `${String(skill && skill.name ? skill.name : '技能')}已生效`
      };
    }

    function getBattleCharData(charName) {
      const liveSnapshot = getLiveSnapshot();
      const sd = liveSnapshot && liveSnapshot.sd ? liveSnapshot.sd : {};
      const allChars = sd && sd.char ? sd.char : {};
      return allChars[charName] || {};
    }

    function getBattleParticipantData(charName) {
      const liveSnapshot = getLiveSnapshot();
      const sd = liveSnapshot && liveSnapshot.sd ? liveSnapshot.sd : {};
      const combat = sd && sd.world && sd.world.combat ? sd.world.combat : {};
      const participants = combat && combat.participants ? combat.participants : {};
      return participants[charName] || {};
    }

    function getDomainLaw(charData, lawKey) {
      if (!charData || !charData.spiritual_domain || !charData.spiritual_domain.is_active) return null;
      const rules = charData.spiritual_domain.combat_modifiers || {};
      const law = rules[lawKey];
      if (law && law.enabled) return law;
      return null;
    }
    
    function getActiveEnemyLaw(activeName, lawKey) {
      // 因为只查是否被压制，我们可以用现成的 findPrimaryBattleTarget 拿到敌方
      const targetName = findPrimaryBattleTarget(activeName);
      if (!targetName) return null;
      const targetData = getBattleCharData(targetName);
      return getDomainLaw(targetData, lawKey);
    }

    function getBattleStatValue(charData, key) {
      let val = Number(charData && charData.stat ? charData.stat[key] || 0 : 0);
      const activeDomain = String(charData && charData.status ? charData.status.active_domain || '' : '');
      if (activeDomain.includes('斗铠领域')) {
        const isFour = activeDomain.includes('四字');
        const ratio = isFour ? 1.2 : 1.1;
        const isAll = activeDomain.includes('全开');
        // 如果全开或显式包含当前属性名，则给予战斗内倍率
        if (isAll || activeDomain.includes(key)) {
          // 仅对基础战斗面板做乘算
          if (['str','def','agi','sp_max','men_max','vit_max'].includes(key)) {
            val = Math.floor(val * ratio);
          }
        }
      }
      
      // 如果己方开着精神领域并有削减敌方的能力，反之若我是敌方，我也得吃到压制
      // 换个思路：当前 charData.name 未知，但我们直接从 charData 自己身上查 self_buff 就行
      const selfDomain = charData && charData.spiritual_domain ? charData.spiritual_domain : null;
      if (selfDomain && selfDomain.is_active && selfDomain.combat_modifiers && selfDomain.combat_modifiers.self_buff) {
          const sBuff = selfDomain.combat_modifiers.self_buff;
          if (sBuff[key] && sBuff[key] > 0) val = Math.floor(val * sBuff[key]);
      }
      
      // 遍历一下全局，有没有哪个人开着精神领域且针对了当前角色所在的阵营？
      // 为避免循环嵌套太深，这里用 getActiveEnemyLaw 会导致传参不够。直接在调用端外层再打补丁更安全！
      // 先留白：我们在 estimateEnemySkillEffects 那边直接扣除伤害更容易，或者改用动态比率。

      return val;
    }

    function estimateEnemySkillEffects(activeName, targetName, skill) {
      if (!targetName || !skill || !/敌方/.test(String(skill.target || ''))) return [];
      const attackerData = getBattleCharData(activeName);
      const targetData = getBattleCharData(targetName);
      const targetVit = getBattleStatValue(targetData, 'vit');
      const targetSp = getBattleStatValue(targetData, 'sp');
      const targetMen = getBattleStatValue(targetData, 'men');
      const attackerStr = getBattleStatValue(attackerData, 'str');
      const attackerMen = getBattleStatValue(attackerData, 'men');
      const targetDef = getBattleStatValue(targetData, 'def');
      const targetAgi = getBattleStatValue(targetData, 'agi');
      const costDelta = parseBattleCostText(skill.cost);
      const spentVit = Math.abs(Number(costDelta.vit || 0));
      const spentSp = Math.abs(Number(costDelta.sp || 0));
      const spentMen = Math.abs(Number(costDelta.men || 0));
      const typeBlob = `${skill && skill.type ? skill.type : ''}/${skill && skill.bonus ? skill.bonus : ''}/${skill && skill.desc ? skill.desc : ''}/${skill && skill.name ? skill.name : ''}`;
      const isOutput = /(输出|爆发|破甲|物理|单体|群体|AOE|大范围)/.test(typeBlob) || (!/被动|辅助|增益|防御/.test(typeBlob) && /敌方/.test(String(skill.target || '')));
      const isMental = /(精神|控制|削弱|异常|眩晕|压制|打断|威压|强控)/.test(typeBlob);
      let vitDamage = 0;
      let spDamage = 0;
      let menDamage = 0;
      if (isOutput) {
        const attackPower = attackerStr * 0.25 + spentVit * 0.25 + spentSp * 0.4 + spentMen * 0.15;
        const defense = targetDef * (/(破甲|穿透|无视防御)/.test(typeBlob) ? 0.08 : 0.18) + targetAgi * 0.05;
        const rawDamage = Math.max(1, Math.floor(Math.max(0, attackPower - defense)));
        const vitCap = Math.max(1, Math.floor(Math.max(targetVit, 1) * (/(爆发|强控)/.test(typeBlob) ? 0.35 : 0.18)));
        vitDamage = Math.min(rawDamage, vitCap);
        if (/群体|AOE|大范围/.test(String(skill.target || ''))) vitDamage = Math.max(1, Math.floor(vitDamage * 0.75));
      }
      if (isMental) {
        const mentalPower = attackerMen * 0.22 + spentMen * 0.85 + spentSp * 0.18;
        const resolve = targetMen * 0.12 + targetAgi * 0.18;
        const rawMenDamage = Math.max(vitDamage > 0 ? 4 : 1, Math.floor(Math.max(0, mentalPower - resolve)));
        const menCap = Math.max(1, Math.floor(Math.max(targetMen, 1) * (/(强控|控制)/.test(typeBlob) ? 0.4 : 0.22)));
        menDamage = Math.min(rawMenDamage, menCap);
        if (/(削弱|打断|压制)/.test(typeBlob)) spDamage = Math.min(Math.max(1, Math.floor(menDamage * 0.5)), Math.max(1, Math.floor(Math.max(targetSp, 1) * 0.2)));
      }
      if (!vitDamage && !spDamage && !menDamage && !/被动|辅助|增益|防御/.test(typeBlob)) {
        vitDamage = Math.max(1, Math.min(Math.floor(attackerStr * 0.08 + spentSp * 0.12 + spentVit * 0.08 + spentMen * 0.08), Math.max(1, Math.floor(Math.max(targetVit, 1) * 0.12))));
      }
      
      // 【法则：属性剥夺】 (在计算最终伤害时，如果防守方被情绪剥夺，受到伤害增加)
      // 此处逻辑已在 getBattleStatValue 的敌方削弱里完成了大半，这里仅补充精神领域的最终修正

      // 【法则：时光回溯】(绝对闪避)
      const targetDomain = targetData && targetData.spiritual_domain ? targetData.spiritual_domain : {};
      if (targetDomain.is_active && targetDomain.combat_modifiers && targetDomain.combat_modifiers.conditional_evasion) {
          const rule = targetDomain.combat_modifiers.conditional_evasion;
          if (rule.enabled) {
              const atkStat = getBattleStatValue(attackerData, rule.compare_stat || 'men');
              const defStat = getBattleStatValue(targetData, rule.compare_stat || 'men');
              if (atkStat / Math.max(1, defStat) <= (rule.max_ratio || 1.5)) {
                  vitDamage = 0; spDamage = 0; menDamage = 0;
                  effects.push({ target: targetName, kind: 'combat_summary', value: `【法则护佑】${rule.success_msg || targetDomain.name + '生效，成功规避伤害！'}` });
              } else {
                  effects.push({ target: targetName, kind: 'combat_summary', value: `【法则破碎】${activeName} 凭借碾压般的精神力，强行撕裂了 [${targetDomain.name}] 的时空法则！` });
              }
          }
      }

      // 【法则：真实伤害/因果打击】(只针对攻击方)
      const atkDomain = attackerData && attackerData.spiritual_domain ? attackerData.spiritual_domain : {};
      if (atkDomain.is_active && atkDomain.combat_modifiers && atkDomain.combat_modifiers.absolute_hit_true_dmg) {
          const rule = atkDomain.combat_modifiers.absolute_hit_true_dmg;
          if (rule.enabled) {
              const extraDmg = Math.floor(getBattleStatValue(attackerData, 'men_max') * (rule.true_dmg_ratio || 0.1));
              if (extraDmg > 0) {
                  menDamage += extraDmg;
                  effects.push({ target: targetName, kind: 'combat_summary', value: `【因果降临】${rule.success_msg || atkDomain.name + '造成了绝对精神重创！'}` });
              }
          }
      }

      // 【法则：灵魂汲取】(攻击方吸血)
      if (atkDomain.is_active && atkDomain.combat_modifiers && atkDomain.combat_modifiers.soul_leech) {
          const rule = atkDomain.combat_modifiers.soul_leech;
          if (rule.enabled && (vitDamage > 0 || menDamage > 0)) {
              const heal = Math.floor((vitDamage + menDamage) * (rule.leech_ratio || 0.5));
              effects.push({ target: activeName, kind: 'stat_delta', key: 'vit', delta: heal, reason: '法则反哺' });
              effects.push({ target: targetName, kind: 'combat_summary', value: `【血气反哺】${rule.success_msg || atkDomain.name + '贪婪地吞噬了生机！'}` });
          }
      }

      const effects = [];
      if (vitDamage) effects.push({ target: targetName, kind: 'stat_delta', key: 'vit', delta: -vitDamage, reason: `受到${skill.name}` });
      if (spDamage) effects.push({ target: targetName, kind: 'stat_delta', key: 'sp', delta: -spDamage, reason: `受到${skill.name}` });
      if (menDamage) effects.push({ target: targetName, kind: 'stat_delta', key: 'men', delta: -menDamage, reason: `受到${skill.name}` });
      return effects;
    }

    function applyEnemyRoundActionToIncomingEffects(effects, defenderName, enemyAction, attackerName) {
      const nextEffects = Array.isArray(effects) ? effects.map(effect => ({ ...effect })) : [];
      if (!defenderName || !enemyAction) return nextEffects;
      const typeBlob = `${enemyAction && enemyAction.type ? enemyAction.type : ''}/${enemyAction && enemyAction.bonus ? enemyAction.bonus : ''}/${enemyAction && enemyAction.desc ? enemyAction.desc : ''}/${enemyAction && enemyAction.name ? enemyAction.name : ''}`;
      const isDefense = /(防御|守护|护盾|格挡|壁垒|守势|反冲)/.test(typeBlob);
      const isControl = /(控制|削弱|异常|束缚|眩晕|禁锢|压制|打断|精神)/.test(typeBlob);
      if (!isDefense && !isControl) return nextEffects;
      nextEffects.forEach(effect => {
        if (!effect || effect.target !== defenderName || effect.kind !== 'stat_delta') return;
        if (isDefense) {
          if (effect.key === 'vit') effect.delta = Math.min(-1, Math.ceil(Number(effect.delta || 0) * 0.58));
          else if (effect.key === 'sp' || effect.key === 'men') effect.delta = Math.min(-1, Math.ceil(Number(effect.delta || 0) * 0.78));
        } else if (isControl) {
          if (effect.key === 'vit') effect.delta = Math.min(-1, Math.ceil(Number(effect.delta || 0) * 0.82));
          else if (effect.key === 'sp' || effect.key === 'men') effect.delta = Math.min(-1, Math.ceil(Number(effect.delta || 0) * 0.72));
        }
      });
      if (isDefense) {
        nextEffects.push({
          target: defenderName,
          kind: 'condition_upsert',
          key: String(enemyAction && enemyAction.name ? enemyAction.name : '防御架势'),
          value: buildConditionValue({
            ...(enemyAction || {}),
            name: String(enemyAction && enemyAction.name ? enemyAction.name : '防御架势'),
            target: '自身/己方',
            type: '防御/增益',
            desc: `${defenderName}以防御动作削减了迎面而来的冲击。`
          })
        });
      }
      if (isControl && attackerName) {
        const controlTax = Math.max(1, Math.floor(Math.max(0, inferSkillCastTime(enemyAction, 0)) / 8) || 1);
        nextEffects.push({ target: attackerName, kind: 'stat_delta', key: 'men', delta: -controlTax, reason: `受到${String(enemyAction && enemyAction.name ? enemyAction.name : '控制压制')}干扰` });
        if (/(精神|压制|打断|眩晕|禁锢)/.test(typeBlob)) {
          nextEffects.push({ target: attackerName, kind: 'stat_delta', key: 'sp', delta: -Math.max(1, Math.floor(controlTax / 2)), reason: `受到${String(enemyAction && enemyAction.name ? enemyAction.name : '控制压制')}干扰` });
        }
        nextEffects.push({
          target: attackerName,
          kind: 'condition_upsert',
          key: String(enemyAction && enemyAction.name ? enemyAction.name : '控制压制'),
          value: buildConditionValue({
            ...(enemyAction || {}),
            name: String(enemyAction && enemyAction.name ? enemyAction.name : '控制压制'),
            target: '敌方/单体',
            type: '控制/削弱',
            desc: `${attackerName}在本回合受到压制，动作精度与出手节奏被干扰。`
          })
        });
      }
      return nextEffects;
    }

    function estimateCounterAttackEffects(attackerName, defenderName) {
      if (!attackerName || !defenderName || attackerName === defenderName) return { effects: [], summaryText: '' };
      const attackerData = getBattleCharData(attackerName);
      const defenderData = getBattleCharData(defenderName);
      const declaredAction = arguments.length > 2 && arguments[2] && arguments[2].name ? arguments[2] : inferEnemyRoundAction(attackerName);
      const actionName = String(declaredAction && declaredAction.name ? declaredAction.name : '反击').trim() || '反击';
      const castTime = Number(declaredAction && declaredAction.castTime ? declaredAction.castTime : 0);
      const inferredCastTime = castTime > 0 ? castTime : inferSkillCastTime(declaredAction || { castTime: 0 }, 0);
      const castMultiplier = inferredCastTime > 0 ? Math.min(1.5, 1 + inferredCastTime / 100) : 1;
      const attackerStr = getBattleStatValue(attackerData, 'str');
      const attackerAgi = getBattleStatValue(attackerData, 'agi');
      const attackerMen = getBattleStatValue(attackerData, 'men');
      const defenderDef = getBattleStatValue(defenderData, 'def');
      const defenderAgi = getBattleStatValue(defenderData, 'agi');
      const defenderVit = getBattleStatValue(defenderData, 'vit');
      const defenderMen = getBattleStatValue(defenderData, 'men');
      const typeBlob = `${declaredAction && declaredAction.type ? declaredAction.type : ''}/${declaredAction && declaredAction.bonus ? declaredAction.bonus : ''}/${declaredAction && declaredAction.desc ? declaredAction.desc : ''}/${actionName}`;
      const isControl = /(控制|削弱|异常|束缚|眩晕|禁锢|压制|打断|精神)/.test(typeBlob);
      const isDefense = /(防御|守护|护盾|格挡|壁垒|守势|反冲)/.test(typeBlob);
      const isBurst = /(爆发|终结|重击|突袭|扑击|碎岳|裂影|斩|杀)/.test(typeBlob);
      const baseVitDamage = Math.max(1, Math.floor(Math.max(0, (attackerStr * 0.12 + attackerAgi * 0.05 - defenderDef * 0.08 - defenderAgi * 0.03) * castMultiplier)));
      const baseMenRaw = Math.floor(Math.max(0, (attackerMen * 0.08 - defenderMen * 0.04) * castMultiplier));
      let vitDamage = 0;
      let menDamage = 0;
      let spDamage = 0;
      const effects = [];

      if (isDefense) {
        vitDamage = Math.min(Math.max(1, Math.floor(baseVitDamage * 0.55)), Math.max(1, Math.floor(Math.max(defenderVit, 1) * 0.08)));
        effects.push({ target: attackerName, kind: 'condition_upsert', key: actionName, value: buildConditionValue({ ...declaredAction, name: actionName, target: '自身/己方', type: '防御/增益', desc: `${attackerName}以「${actionName}」稳住阵脚，强化了自身防势。` }) });
      } else if (isControl) {
        vitDamage = Math.min(Math.max(1, Math.floor(baseVitDamage * 0.6)), Math.max(1, Math.floor(Math.max(defenderVit, 1) * 0.1)));
        menDamage = baseMenRaw > 0 ? Math.min(Math.max(2, Math.floor(baseMenRaw * 1.5)), Math.max(1, Math.floor(Math.max(defenderMen, 1) * 0.18))) : Math.max(1, Math.floor(Math.max(defenderMen, 1) * 0.06));
        spDamage = Math.min(Math.max(1, Math.floor(menDamage * 0.5)), Math.max(1, Math.floor(Math.max(getBattleStatValue(defenderData, 'sp'), 1) * 0.12)));
        effects.push({ target: defenderName, kind: 'condition_upsert', key: actionName, value: buildConditionValue({ ...declaredAction, name: actionName, target: '敌方/单体', type: '控制/削弱', desc: `${attackerName}以「${actionName}」压制了${defenderName}的行动与精神。` }) });
      } else {
        const burstMult = isBurst ? 1.28 : 1;
        vitDamage = Math.min(Math.max(1, Math.floor(baseVitDamage * burstMult)), Math.max(1, Math.floor(Math.max(defenderVit, 1) * (isBurst ? 0.16 : 0.12))));
        if (baseMenRaw > 0) menDamage = Math.min(Math.max(1, Math.floor(baseMenRaw * (isBurst ? 0.85 : 0.55))), Math.max(1, Math.floor(Math.max(defenderMen, 1) * 0.1)));
      }

      if (vitDamage) effects.push({ target: defenderName, kind: 'stat_delta', key: 'vit', delta: -vitDamage, reason: `受到${attackerName}反击` });
      if (spDamage) effects.push({ target: defenderName, kind: 'stat_delta', key: 'sp', delta: -spDamage, reason: `受到${attackerName}反击` });
      if (menDamage) effects.push({ target: defenderName, kind: 'stat_delta', key: 'men', delta: -menDamage, reason: `受到${attackerName}反击` });

      const summaryText = isDefense
        ? `${attackerName}以「${actionName}」稳住阵脚，在强化自身防势的同时逼退了${defenderName}。`
        : isControl
          ? `${attackerName}以「${actionName}」完成压制，扰乱了${defenderName}的精神与行动节奏。`
          : (menDamage
              ? `${attackerName}以「${actionName}」完成反击，压低了${defenderName}的体力与精神。`
              : `${attackerName}以「${actionName}」完成反击，压低了${defenderName}的体力。`);

      return {
        effects,
        actionName,
        castTime: inferredCastTime,
        summaryText
      };
    }

    function findPrimaryBattleTarget(activeName) {
      const liveSnapshot = getLiveSnapshot();
      const sd = liveSnapshot && liveSnapshot.sd ? liveSnapshot.sd : {};
      const combat = sd && sd.world && sd.world.combat ? sd.world.combat : {};
      const currentSummary = combat && combat.summary && typeof combat.summary === 'object' ? combat.summary : {};
      const currentSettle = currentSummary && currentSummary.settle_result && typeof currentSummary.settle_result === 'object' ? currentSummary.settle_result : {};
      const currentTarget = String(currentSettle.target_npc || '').trim();
      if (currentTarget && currentTarget !== '无' && currentTarget !== activeName) return currentTarget;
      const participants = combat && combat.participants ? combat.participants : {};
      const participantTarget = Object.entries(participants).find(([name, info]) => name !== activeName && info && info.faction === '敌对' && info.status !== '死亡');
      if (participantTarget) return participantTarget[0];
      const allChars = sd && sd.char ? sd.char : {};
      const charTarget = Object.entries(allChars).find(([name, charData]) => name !== activeName && (!charData || !charData.status || charData.status.alive !== false));
      return charTarget ? charTarget[0] : '';
    }

    function buildBattleMeta(activeName, intentText, selectedSkillActions, battleMode) {
      const normalizedSkills = (Array.isArray(selectedSkillActions) ? selectedSkillActions : []).map(normalizeSkillAction).filter(skill => skill.name);
      const actionType = normalizedSkills.map(skill => skill.name).filter(Boolean).join('、') || String(intentText || '').trim() || '普通攻击';
      const skillBlob = normalizedSkills.map(skill => `${skill.name}/${skill.type}/${skill.target}/${skill.desc}`).join('\n');
      const hasExplicitSelfOnly = normalizedSkills.length > 0 && normalizedSkills.every(skill => !/敌方/.test(String(skill.target || '')));
      return {
        activeName,
        targetName: hasExplicitSelfOnly ? '' : findPrimaryBattleTarget(activeName),
        actionType,
        selectedSkillActions: normalizedSkills,
        mode: battleMode === 'multi_round' ? 'multi_round' : 'single_round',
        isCharged: /蓄力/.test(`${actionType}\n${skillBlob}`)
      };
    }

    function buildParticipantStatus(charName, actorAgg) {
      const charData = getBattleCharData(charName);
      const nextState = getPostSettleActorState(charName, actorAgg || { statDelta: { vit: 0, sp: 0, men: 0 } });
      const vitMax = Number(charData && charData.stat ? charData.stat.vit_max || 0 : 0);
      if (!nextState.alive || nextState.vit <= 0) return '死亡';
      if (vitMax > 0) {
        const ratio = nextState.vit / vitMax;
        if (ratio <= 0.1) return '濒死';
        if (ratio <= 0.35) return '重伤';
      }
      return '存活';
    }

    function buildBattleParticipantsPatchValue(aggregate, battleMeta) {
      const liveSnapshot = getLiveSnapshot();
      const sd = liveSnapshot && liveSnapshot.sd ? liveSnapshot.sd : {};
      const combat = sd && sd.world && sd.world.combat ? sd.world.combat : {};
      const currentParticipants = combat && combat.participants && typeof combat.participants === 'object' ? combat.participants : {};
      const nextParticipants = JSON.parse(JSON.stringify(currentParticipants || {}));
      const activeName = String(battleMeta && battleMeta.activeName ? battleMeta.activeName : '').trim();
      const targetName = String(battleMeta && battleMeta.targetName ? battleMeta.targetName : '').trim();
      const exchangeTargetName = targetName || (activeName ? findPrimaryBattleTarget(activeName) : '');
      const activeCurrent = nextParticipants[activeName] || {};
      if (activeName) {
        const activeAgg = aggregate && aggregate.actors ? aggregate.actors[activeName] : null;
        const activeStatus = buildParticipantStatus(activeName, activeAgg);
        nextParticipants[activeName] = {
          faction: activeCurrent.faction || '己方',
          status: activeStatus,
          action_declared: activeStatus === '死亡'
            ? '无'
            : String(activeAgg && typeof activeAgg.nextAction === 'string' && activeAgg.nextAction ? activeAgg.nextAction : (battleMeta && battleMeta.actionType ? battleMeta.actionType : activeCurrent.action_declared || '无')) || '无',
          is_summon: !!activeCurrent.is_summon,
          current_cast_time: activeStatus === '死亡'
            ? 0
            : Math.max(0, Number(activeAgg && Number.isFinite(activeAgg.nextCastTime) ? activeAgg.nextCastTime : (activeCurrent.current_cast_time || 0)))
        };
      }
      if (exchangeTargetName) {
        const targetCurrent = nextParticipants[exchangeTargetName] || {};
        const targetAgg = aggregate && aggregate.actors ? aggregate.actors[exchangeTargetName] : null;
        const targetStatus = buildParticipantStatus(exchangeTargetName, aggregate && aggregate.actors ? aggregate.actors[exchangeTargetName] : null);
        nextParticipants[exchangeTargetName] = {
          faction: targetCurrent.faction || '敌对',
          status: targetStatus,
          action_declared: targetStatus === '死亡'
            ? '无'
            : String(targetAgg && typeof targetAgg.nextAction === 'string' && targetAgg.nextAction ? targetAgg.nextAction : (targetCurrent.action_declared || '应战')) || '应战',
          is_summon: !!targetCurrent.is_summon,
          current_cast_time: targetStatus === '死亡'
            ? 0
            : Math.max(0, Number(targetAgg && Number.isFinite(targetAgg.nextCastTime) ? targetAgg.nextCastTime : (targetCurrent.current_cast_time || 0)))
        };
      }
      return nextParticipants;
    }

    function resolveActiveBattleName() {
      const liveSnapshot = getLiveSnapshot();
      const sd = liveSnapshot && liveSnapshot.sd ? liveSnapshot.sd : {};
      const chars = sd && sd.char ? sd.char : {};
      const snapshotActive = String(liveSnapshot && liveSnapshot.activeName ? liveSnapshot.activeName : '').trim();
      if (snapshotActive && chars[snapshotActive]) return snapshotActive;
      const playerName = String(sd && sd.sys && sd.sys.player_name ? sd.sys.player_name : '').trim();
      if (playerName && chars[playerName]) return playerName;
      if (chars['主角']) return '主角';
      const firstName = Object.keys(chars)[0];
      return firstName || snapshotActive || '主角';
    }

    function buildBattleResultLines(aggregate) {
      const lines = [];
      Object.entries(aggregate.actors || {}).forEach(([charName, actorAgg]) => {
        const fragments = [];
        const resourceLabels = [];
        if (Number(actorAgg && actorAgg.statDelta ? actorAgg.statDelta.vit || 0 : 0) !== 0) resourceLabels.push('体力');
        if (Number(actorAgg && actorAgg.statDelta ? actorAgg.statDelta.sp || 0 : 0) !== 0) resourceLabels.push('魂力');
        if (Number(actorAgg && actorAgg.statDelta ? actorAgg.statDelta.men || 0 : 0) !== 0) resourceLabels.push('精神');
        if (resourceLabels.length) fragments.push(`${resourceLabels.join('、')}已完成本批次结算`);

        const conditionAdds = Object.keys(actorAgg && actorAgg.conditionUpserts ? actorAgg.conditionUpserts : {});
        if (conditionAdds.length) fragments.push(`已附加【${conditionAdds.join('】、【')}】`);

        const conditionRemoves = Array.isArray(actorAgg && actorAgg.conditionRemoves) ? actorAgg.conditionRemoves : [];
        if (conditionRemoves.length) fragments.push(`已解除【${conditionRemoves.join('】、【')}】`);

        if (typeof actorAgg.nextAction === 'string' && actorAgg.nextAction) {
          fragments.push(actorAgg.nextAction === '战斗中'
            ? '已进入战斗中状态'
            : `当前状态已更新为「${actorAgg.nextAction}」`);
        }

        if (actorAgg && actorAgg.alive === false) fragments.push('已失去战斗能力');

        if (fragments.length) lines.push(`${charName}：${fragments.join('，')}。`);
      });
      if (aggregate.combat && aggregate.combat.winner) lines.push(`本批次战斗胜势方：${aggregate.combat.winner}。`);
      if (aggregate.combat && aggregate.combat.summary) lines.push(aggregate.combat.summary);
      return lines;
    }

    function buildBattleSystemInput(aggregate, patchOps) {
      const analysisText = `战斗批次结算完成：第${aggregate.roundStart}至${aggregate.roundEnd}回合。已合并资源变化、状态变化、存活状态与战斗摘要。`;
      const resultLines = buildBattleResultLines(aggregate);
      return [
        `[场景说明]\n${aggregate.sceneText || '战斗仍在持续，双方保持高速交锋。'}`,
        aggregate.narrationLines.length ? `[仲裁过程]\n${aggregate.narrationLines.join('\n')}` : '',
        resultLines.length ? `[仲裁结果]\n${resultLines.join('\n')}` : '',
        `[描写要求]\n请将以上隐藏结算写成连续、激烈、有冲击感的战斗描写，正文不要出现系统术语。`,
        `<UpdateVariable>`,
        `<Analysis>${analysisText}</Analysis>`,
        `<JSONPatch>`,
        JSON.stringify(patchOps, null, 2),
        `</JSONPatch>`,
        `</UpdateVariable>`
      ].filter(Boolean).join('\n\n');
    }

    function collectRoundEvents(intentText, selectedSkillActions, battleMode) {
      const liveSnapshot = getLiveSnapshot();
      const sd = liveSnapshot && liveSnapshot.sd ? liveSnapshot.sd : {};
      const currentRound = Number(sd && sd.world && sd.world.combat ? sd.world.combat.round || 0 : 0);
      const currentActive = sd && sd.world && sd.world.combat && typeof sd.world.combat.is_active === 'boolean' ? sd.world.combat.is_active : true;
      const activeName = resolveActiveBattleName();
      const normalizedIntent = String(intentText || '').trim() || '普通攻击';
      const battleMeta = buildBattleMeta(activeName, normalizedIntent, selectedSkillActions, battleMode);
      const maxRounds = battleMeta.mode === 'multi_round' ? 3 : 1;
      const exchangeTargetName = battleMeta.targetName || findPrimaryBattleTarget(activeName);
      const skillQueue = (battleMeta.selectedSkillActions.length ? battleMeta.selectedSkillActions : [{
        name: normalizedIntent,
        type: battleMeta.targetName ? '输出/动作' : '动作',
        target: battleMeta.targetName ? '敌方/单体' : '自身/动作',
        bonus: '无',
        cost: '无',
        desc: normalizedIntent
      }]).slice(0, maxRounds);
      const roundEvents = [];
      let continueBattle = currentActive;

      for (let index = 0; index < skillQueue.length && continueBattle; index += 1) {
        const skill = skillQueue[index];
        
        // 1. 回合开始前的精神领域维持消耗判定
        const activeData = getBattleCharData(activeName);
        if (activeData && activeData.spiritual_domain && activeData.spiritual_domain.is_active) {
            const costMen = activeData.spiritual_domain.maintenance_cost?.men || 8000;
            const currentMen = Number(activeData.stat?.men || 0);
            if (currentMen >= costMen) {
                effects.push({ target: activeName, kind: 'stat_delta', key: 'men', delta: -costMen, reason: `维持${activeData.spiritual_domain.name}` });
            } else {
                effects.push({ target: activeName, kind: 'combat_summary', value: `【法则反噬】${activeName} 精神透支，无法维持庞大的消耗，[${activeData.spiritual_domain.name}]轰然崩碎！` });
            }
        }

        const roundNumber = currentRound + index + 1;
        const enemyRoundAction = exchangeTargetName ? inferEnemyRoundAction(exchangeTargetName) : null;
        const declaredTargetName = /敌方/.test(String(skill.target || '')) ? (battleMeta.targetName || exchangeTargetName) : '';
        const narrationLines = [];
        const skillCastTime = inferSkillCastTime(skill, 0, activeName);
        const effects = [{ target: activeName, kind: 'action_set', value: skill.name || normalizedIntent }];
        effects.push({ target: activeName, kind: 'cast_time_set', value: skillCastTime });
        const enemyActionTypeBlob = `${enemyRoundAction && enemyRoundAction.type ? enemyRoundAction.type : ''}/${enemyRoundAction && enemyRoundAction.bonus ? enemyRoundAction.bonus : ''}/${enemyRoundAction && enemyRoundAction.desc ? enemyRoundAction.desc : ''}/${enemyRoundAction && enemyRoundAction.name ? enemyRoundAction.name : ''}`;
        const enemyIsDefense = /(防御|守护|护盾|格挡|壁垒|守势|反冲)/.test(enemyActionTypeBlob);
        const enemyIsControl = /(控制|削弱|异常|束缚|眩晕|禁锢|压制|打断|精神)/.test(enemyActionTypeBlob);
        const enemyActsFirst = exchangeTargetName && enemyRoundAction ? shouldEnemyActFirst(activeName, skill, exchangeTargetName, enemyRoundAction) : false;
        let playerActionResolved = true;
        let openingSummaryText = '';

        // 【法则：幻境迷失】 (在对方出手宣告时判定是否直接空掉)
        const illusionRule = getActiveEnemyLaw(activeName, 'illusion_misdirection');
        if (illusionRule && Math.random() < Number(illusionRule.misdirection_chance || 0.4)) {
            playerActionResolved = false;
            effects.push({ 
                target: activeName, 
                kind: 'combat_summary', 
                value: `【幻境迷失】${activeName} 的攻击彻底失去了目标！ ${illusionRule.success_msg || ''}` 
            });
            narrationLines.push(`第${roundNumber}回合：${activeName} 深陷幻境，动作完全偏离了预判轨迹。`);
        }

        if (exchangeTargetName && enemyRoundAction) {
          effects.push({ target: exchangeTargetName, kind: 'action_set', value: enemyRoundAction.name || '应战' });
          effects.push({ target: exchangeTargetName, kind: 'cast_time_set', value: Number(enemyRoundAction.castTime || 0) });
        }

        if (enemyActsFirst && exchangeTargetName && enemyRoundAction) {
          const opening = estimateCounterAttackEffects(exchangeTargetName, activeName, enemyRoundAction);
          if (opening.effects.length) {
            opening.effects.forEach(effect => effects.push(effect));
            narrationLines.push(`第${roundNumber}回合：${exchangeTargetName}抢得先手，以「${opening.actionName || enemyRoundAction.name || '先手压制'}」率先压上。`);
            openingSummaryText = `${exchangeTargetName}抢得先手，以「${opening.actionName || enemyRoundAction.name || '先手压制'}」率先压上。`;
            const openingPreview = aggregateBattleSettlement([...roundEvents, {
              round: roundNumber,
              sceneText: '',
              narrationLines: [],
              effects,
              combat: { summaryFragment: '', continueBattle: true }
            }]);
            const openingState = getPostSettleActorState(activeName, openingPreview.actors[activeName]);
            if (!openingState.alive || openingState.vit <= 0) {
              effects.push({ target: activeName, kind: 'alive_set', value: false });
              effects.push({ target: activeName, kind: 'action_set', value: '失去战斗能力' });
              effects.push({ target: activeName, kind: 'cast_time_set', value: 0 });
              narrationLines.push(`第${roundNumber}回合：${activeName}尚未来得及完成「${skill.name}」，就被${exchangeTargetName}当场压制。`);
              playerActionResolved = false;
            }
          }
        }

        const costDelta = parseBattleCostText(skill.cost);
        if (playerActionResolved) {
          Object.entries(costDelta).forEach(([key, delta]) => {
            if (delta) effects.push({ target: activeName, kind: 'stat_delta', key, delta, reason: `施放${skill.name}` });
          });
          const playerToEnemyEffects = applyEnemyRoundActionToIncomingEffects(
            estimateEnemySkillEffects(activeName, declaredTargetName, skill),
            declaredTargetName,
            enemyRoundAction,
            activeName
          );
          playerToEnemyEffects.forEach(effect => effects.push(effect));
        }
        const enemyPrepText = exchangeTargetName && enemyRoundAction && !enemyActsFirst ? (enemyIsDefense ? `${exchangeTargetName}以「${enemyRoundAction.name}」预先收紧防势。` : (enemyIsControl ? `${exchangeTargetName}以「${enemyRoundAction.name}」先行压制了${activeName}的出手节奏。` : '')) : '';
        if (playerActionResolved && /自身|己方/.test(skill.target) && !/被动/.test(skill.type)) {
          effects.push({ target: activeName, kind: 'condition_upsert', key: skill.name, value: buildConditionValue(skill) });
        } else if (playerActionResolved && declaredTargetName && /敌方/.test(skill.target) && /(控制|削弱|异常|输出|爆发|强控)/.test(skill.type)) {
          if (/(控制|削弱|异常)/.test(skill.type)) {
            effects.push({ target: declaredTargetName, kind: 'condition_upsert', key: skill.name, value: buildConditionValue(skill) });
          }
        }
        if (playerActionResolved) narrationLines.push(`第${roundNumber}回合：${activeName}施放「${skill.name}」${skill.cost && skill.cost !== '无' ? `，消耗${skill.cost}` : ''}${declaredTargetName ? `，目标锁定【${declaredTargetName}】` : ''}。`);
        if (!enemyActsFirst && exchangeTargetName && enemyRoundAction && enemyIsDefense) narrationLines.push(`第${roundNumber}回合：${exchangeTargetName}提前以「${enemyRoundAction.name}」收紧防势。`);
        else if (!enemyActsFirst && exchangeTargetName && enemyRoundAction && enemyIsControl) narrationLines.push(`第${roundNumber}回合：${exchangeTargetName}正在以「${enemyRoundAction.name}」凝聚压制。`, `第${roundNumber}回合：${activeName}的出手节奏受到干扰，攻击效率被压低。`);

        let summaryFragment = playerActionResolved
          ? (declaredTargetName ? `${openingSummaryText ? `${openingSummaryText} ` : ''}${activeName}在第${roundNumber}回合对${declaredTargetName}执行了战斗动作：${skill.name}。${enemyPrepText ? ` ${enemyPrepText}` : ''}` : `${openingSummaryText ? `${openingSummaryText} ` : ''}${activeName}在第${roundNumber}回合执行了战斗动作：${skill.name}。${enemyPrepText ? ` ${enemyPrepText}` : ''}`)
          : `${openingSummaryText}${openingSummaryText ? ' ' : ''}${activeName}未能完成「${skill.name}」。`;

        const event = {
          round: roundNumber,
          sceneText: '战斗仍在持续，双方保持高速交锋。',
          narrationLines,
          effects,
          combat: {
            summaryFragment,
            continueBattle
          }
        };

        let previewAggregate = aggregateBattleSettlement([...roundEvents, event]);
        let activePreview = getPostSettleActorState(activeName, previewAggregate.actors[activeName]);
        let targetPreview = exchangeTargetName && previewAggregate.actors[exchangeTargetName]
          ? getPostSettleActorState(exchangeTargetName, previewAggregate.actors[exchangeTargetName])
          : null;

        if (!enemyActsFirst && exchangeTargetName && targetPreview && activePreview.alive && targetPreview.alive && event.combat.continueBattle) {
          const counter = estimateCounterAttackEffects(exchangeTargetName, activeName, enemyRoundAction);
          if (counter.effects.length) {
            effects.push({ target: exchangeTargetName, kind: 'action_set', value: counter.actionName || (enemyRoundAction && enemyRoundAction.name) || '反击' });
            effects.push({ target: exchangeTargetName, kind: 'cast_time_set', value: Number(counter.castTime || (enemyRoundAction && enemyRoundAction.castTime) || 0) });
            counter.effects.forEach(effect => effects.push(effect));
            narrationLines.push(`第${roundNumber}回合：${exchangeTargetName}抓住空隙，以「${counter.actionName || (enemyRoundAction && enemyRoundAction.name) || '反击'}」发起反击。`);
            summaryFragment = exchangeTargetName
              ? `${activeName}与${exchangeTargetName}在第${roundNumber}回合完成了一轮攻防交换：${skill.name}。${enemyPrepText ? ` ${enemyPrepText}` : ''} ${counter.summaryText}`
              : `${activeName}在第${roundNumber}回合完成动作后遭遇反击。 ${counter.summaryText}`;
            event.combat.summaryFragment = summaryFragment;
            previewAggregate = aggregateBattleSettlement([...roundEvents, event]);
            activePreview = getPostSettleActorState(activeName, previewAggregate.actors[activeName]);
            targetPreview = exchangeTargetName && previewAggregate.actors[exchangeTargetName]
              ? getPostSettleActorState(exchangeTargetName, previewAggregate.actors[exchangeTargetName]) : null;
          }
        }

        if (!activePreview.alive || activePreview.vit <= 0) {
          effects.push({ target: activeName, kind: 'alive_set', value: false });
          effects.push({ target: activeName, kind: 'action_set', value: '失去战斗能力' });
          effects.push({ target: activeName, kind: 'cast_time_set', value: 0 });
          event.combat.continueBattle = false;
        }
        if (exchangeTargetName && targetPreview && (!targetPreview.alive || targetPreview.vit <= 0)) {
          effects.push({ target: exchangeTargetName, kind: 'alive_set', value: false });
          effects.push({ target: exchangeTargetName, kind: 'action_set', value: '失去战斗能力' });
          effects.push({ target: exchangeTargetName, kind: 'cast_time_set', value: 0 });
          event.combat.continueBattle = false;
        }

        roundEvents.push(event);
        continueBattle = !!event.combat.continueBattle;
      }

      return roundEvents;
    }

    function buildBattleV1SystemInput(intentText, selectedSkillActions, battleMode) {
      const liveSnapshot = getLiveSnapshot();
      const sd = liveSnapshot && liveSnapshot.sd ? liveSnapshot.sd : {};
      const currentActive = sd && sd.world && sd.world.combat && typeof sd.world.combat.is_active === 'boolean' ? sd.world.combat.is_active : true;
      const activeName = resolveActiveBattleName();
      const normalizedIntent = String(intentText || '').trim() || '普通攻击';
      const battleMeta = buildBattleMeta(activeName, normalizedIntent, selectedSkillActions, battleMode);
      const roundEvents = collectRoundEvents(normalizedIntent, selectedSkillActions, battleMeta.mode);
      const aggregate = aggregateBattleSettlement(roundEvents);
      const settle = inferBattleSummaryResult(aggregate, battleMeta);
      const battleEnded = settle.isKilled || settle.result === '失败' || settle.result === '平局';
      aggregate.combat.isActive = battleEnded ? false : currentActive;
      if (settle.result === '平局') aggregate.combat.winner = '';
      else if (settle.isKilled) aggregate.combat.winner = activeName;
      else if (settle.result === '失败' && battleMeta.targetName) aggregate.combat.winner = battleMeta.targetName;
      const settleText = String(settle && settle.result ? settle.result : '未决') || '未决';
      aggregate.combat.summary = battleMeta.targetName
        ? `本批次战斗结算：${activeName}对${battleMeta.targetName}执行了「${battleMeta.actionType}」，战果：${settleText}。`
        : `本批次战斗结算：${activeName}执行了「${battleMeta.actionType}」，战果：${settleText}。`;
      aggregate.combat.sysReason = battleMeta.targetName
        ? `[战斗结算] ${activeName}对${battleMeta.targetName}执行了「${battleMeta.actionType}」，战果：${settleText}。`
        : `[战斗结算] ${activeName}执行了「${battleMeta.actionType}」，战果：${settleText}。`;
      const patchOps = buildBattlePatchOps(aggregate, battleMeta);
      return buildBattleSystemInput(aggregate, patchOps);
    }



    submitBattleIntent = function() {
      const selectedSkillActions = (typeof state !== 'undefined' && Array.isArray(state.selectedSkillActions)) ? state.selectedSkillActions : [];
      const selectedNames = selectedSkillActions.map(a => a && a.name).filter(Boolean);
      const battleMode = (typeof state !== 'undefined' && state && state.currentMode === 'multi_round') ? 'multi_round' : 'single_round';
      const intentText = (typeof buildIntentText === 'function' ? buildIntentText() : '') || selectedNames.join('、') || '普通攻击';
      const output = wrapperElement.querySelector('#ui-intent-output');
      if (output) output.value = intentText;
      const playerInput = selectedNames.length ? `我使用了${selectedNames.join('、')}。` : '我发动普通攻击。';
      const sysPrompt = buildBattleV1SystemInput(intentText, selectedSkillActions, battleMode);
      if (typeof _options.onAction === 'function') {
        _options.onAction({
          playerInput,
          systemPrompt: sysPrompt,
          requestKind: 'combat_action'
        });
      }
    };

    this.syncFromBattleEngine = (typeof syncFromBattleEngine === 'function') ? syncFromBattleEngine : function() {};
    this.syncFromBattleEngine();
  }
}

window.mountBattleUI = function(containerElement, snapshot, options = {}) {
  return new BattleUIComponent(containerElement, snapshot, options);
};
