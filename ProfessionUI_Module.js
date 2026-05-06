/* ProfessionUI_Module.js - 姝﹁宸ュ潑缁勪欢 (JS 妯″潡鐗? */

const ProfessionStyles = `
  .prof-module-scope {
    --panel: rgba(18, 56, 69, 0.22);
    --panel-strong: rgba(23, 68, 84, 0.30);
    --line: rgba(150, 217, 228, 0.24);
    --line-soft: rgba(150, 217, 228, 0.10);
    --cyan: #8de1ef;
    --cyan-soft: rgba(141, 225, 239, 0.16);
    --gold: #d7c070;
    --gold-soft: rgba(228, 201, 111, 0.16);
    --red: #ff8aa2;
    --green: #7dffb2;
    --text: #e4f5f9;
    --text-sub: #bfdde4;
    --text-dim: #87aeb7;
    --font-tech: 'Orbitron', sans-serif;
    --font-cjk: 'Noto Serif SC', serif;

    width: 100%;
    color: var(--text);
    font-family: var(--font-cjk);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .prof-module-scope .top-status {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .prof-module-scope .status-chip {
    background: rgba(0,0,0,0.18);
    border: 1px solid var(--line-soft);
    border-radius: 6px;
    padding: 8px;
  }

  .prof-module-scope .chip-label {
    font-size: 10px;
    color: var(--text-dim);
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  .prof-module-scope .chip-value {
    font-family: var(--font-tech);
    font-size: 12px;
    color: var(--gold);
    word-break: break-all;
  }

  .prof-module-scope .tabs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }

  .prof-module-scope .tab-btn {
    border: 1px solid var(--line-soft);
    background: rgba(0,0,0,0.16);
    color: var(--text-dim);
    border-radius: 6px;
    padding: 8px 6px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    transition: 0.2s ease;
  }

  .prof-module-scope .tab-btn.active {
    color: var(--cyan);
    border-color: var(--cyan);
    background: rgba(141, 225, 239, 0.12);
    box-shadow: inset 0 0 8px rgba(141, 225, 239, 0.08);
  }

  .prof-module-scope .section-card {
    background: rgba(0,0,0,0.18);
    border: 1px solid var(--line-soft);
    border-radius: 8px;
    padding: 12px;
  }

  .prof-module-scope .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    font-family: var(--font-title);
    font-size: 14px;
    line-height: 1.2;
    color: var(--white);
    font-weight: 700;
    margin-bottom: 10px;
    letter-spacing: 0.55px;
    text-transform: none;
    text-shadow: 0 1px 0 rgba(255,255,255,0.05), 0 0 6px rgba(77,240,255,0.08);
  }

  .prof-module-scope .section-title::before {
    content: '鈼?;
    font-size: 10px;
    color: var(--cyan);
    flex: 0 0 auto;
  }

  .prof-module-scope .section-title::after {
    content: '';
    flex: 1;
    min-width: 28px;
    height: 1px;
    background: linear-gradient(90deg, rgba(103,247,239,0.38), rgba(255,226,89,0.16), transparent);
    opacity: 0.78;
  }

  .prof-module-scope .form-group {
    margin-bottom: 12px;
  }
  .prof-module-scope .form-group:last-child { margin-bottom: 0; }

  .prof-module-scope .form-group label {
    display: block;
    font-size: 11px;
    color: var(--cyan);
    margin-bottom: 6px;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .prof-module-scope .tech-select, .prof-module-scope .tech-input {
    width: 100%;
    background: var(--panel-strong);
    border: 1px solid var(--line-soft);
    color: var(--cyan);
    padding: 8px 9px;
    border-radius: 6px;
    font-family: var(--font-cjk);
    font-size: 12px;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }
  .prof-module-scope .tech-select:focus, .prof-module-scope .tech-input:focus { border-color: var(--cyan); }
  .prof-module-scope .tech-select option { background: #1a2a32; color: var(--text); }

  .prof-module-scope .inline-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .prof-module-scope .metal-list-container {
    max-height: 140px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    background: var(--panel-strong);
    border: 1px solid var(--line-soft);
    border-radius: 6px;
  }

  .prof-module-scope .material-item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: var(--text);
    font-size: 12px;
    line-height: 1.4;
  }
  .prof-module-scope .material-item input {
    margin: 0;
    accent-color: var(--cyan);
  }

  .prof-module-scope .hint {
    margin-top: 4px;
    font-size: 10px;
    color: var(--text-dim);
    line-height: 1.4;
  }

  .prof-module-scope .info-panel {
    background: rgba(0,0,0,0.3);
    border: 1px dashed var(--line-soft);
    border-radius: 6px;
    padding: 10px;
    font-size: 11px;
    color: var(--text-sub);
    line-height: 1.6;
  }

  .prof-module-scope .info-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding: 4px 0;
  }
  .prof-module-scope .info-row:last-child { border-bottom: none; }

  .prof-module-scope .info-key {
    color: var(--text-dim);
    flex: 0 0 108px;
  }
  .prof-module-scope .info-val {
    color: var(--text);
    text-align: right;
    flex: 1;
    word-break: break-word;
  }

  .prof-module-scope .val-highlight { color: var(--gold); font-family: var(--font-tech); }
  .prof-module-scope .val-cyan { color: var(--cyan); font-family: var(--font-tech); }
  .prof-module-scope .val-red { color: var(--red); }
  .prof-module-scope .val-green { color: var(--green); }

  .prof-module-scope .action-btn {
    width: 100%;
    margin-top: 2px;
    background: linear-gradient(90deg, rgba(141,225,239,0.1), rgba(141,225,239,0.3));
    border: 1px solid var(--cyan);
    color: var(--cyan);
    padding: 11px;
    border-radius: 6px;
    font-family: var(--font-tech);
    font-weight: 700;
    letter-spacing: 1.5px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
  }
  .prof-module-scope .action-btn:hover:not(:disabled) {
    background: var(--cyan);
    color: #000;
    box-shadow: 0 0 10px var(--cyan);
  }
  .prof-module-scope .action-btn:disabled {
    background: rgba(255,255,255,0.05);
    border-color: var(--line-soft);
    color: var(--text-dim);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const ProfessionTemplate = `
<div class="prof-module-scope">
  <div class="top-status">
    <div class="status-chip">
      <div class="chip-label">浣撳姏 / 榄傚姏</div>
      <div class="chip-value" id="chip-vs">0 / 0</div>
    </div>
    <div class="status-chip">
      <div class="chip-label">绮剧鍔?/div>
      <div class="chip-value" id="chip-men">0</div>
    </div>
    <div class="status-chip">
      <div class="chip-label">绮剧澧冪晫</div>
      <div class="chip-value" id="chip-men-realm">鏈煡</div>
    </div>
  </div>

  <div class="tabs">
    <button class="tab-btn active" data-mode="forge">閿婚€?/button>
    <button class="tab-btn" data-mode="manufacture">鍒堕€?/button>
    <button class="tab-btn" data-mode="design">璁捐</button>
    <button class="tab-btn" data-mode="repair">淇悊</button>
  </div>

  <div class="section-card">
    <div class="section-title" id="prof-ui-title">鍓亴涓氬伐鍧?/div>
    <div class="hint" id="prof-ui-subtitle" style="margin-top:-6px;margin-bottom:12px;">-</div>

    <div class="inline-grid">
      <div class="form-group">
        <label id="tier-label">鎿嶄綔闃朵綅</label>
        <select id="prof-tier" class="tech-select">
          <option value="1">1闃?/option>
          <option value="2">2闃?/option>
          <option value="3">3闃?/option>
          <option value="4">4闃?/option>
          <option value="5">5闃?/option>
        </select>
      </div>
      <div class="form-group">
        <label id="qty-label">姣忕鏉愭枡娑堣€?/label>
        <input id="prof-cost" class="tech-input" type="number" min="1" value="1" />
        <div class="hint" id="qty-hint">閿婚€犻粯璁や細鎸夆€滄瘡绉嶆潗鏂欐秷鑰楅噺鈥濇墸闄ゆ潗鏂欙紝骞跺悓姝ユ墸闄よ亴涓氳祫婧愩€?/div>
      </div>
    </div>

    <div class="form-group">
      <label id="target-label">鐩爣浜х墿 / 鐩爣瀵硅薄</label>
      <input id="prof-target" class="tech-input" type="text" placeholder="鑷姩鐢熸垚鎴栨墜鍔ㄨ緭鍏?.." />
      <div class="hint" id="target-hint">閿婚€犱細灏濊瘯鏍规嵁鎵€閫夋潗鏂欒嚜鍔ㄧ敓鎴愪骇鐗╁悕锛涗慨鐞嗘ā寮忎笅杩欓噷濉緟淇璞″悕銆?/div>
    </div>


    <div class="form-group">
      <label id="materials-label">鏉愭枡閫夋嫨</label>
      <div id="prof-materials-list" class="metal-list-container">
        <div style="color: var(--text-dim);">[璇诲彇搴撳瓨涓?..]</div>
      </div>
      <div class="hint" id="materials-hint">閿婚€犳敮鎸佸閫夎瀺閿伙紱鍏朵綑鑱屼笟鎸夋潗鏂欏崗鍚屽鐞嗐€?/div>
    </div>
  </div>

  <div class="section-card">
    <div class="section-title">鑱屼笟棰勬紨</div>
    <div class="info-panel">
      <div class="info-row"><span class="info-key">褰撳墠鑱屼笟</span><span class="info-val" id="prev-job">-</span></div>
      <div class="info-row"><span class="info-key">绱缁忛獙</span><span class="info-val" id="prev-exp">-</span></div>
      <div class="info-row"><span class="info-key">褰撳墠璧勬簮</span><span class="info-val" id="prev-res">-</span></div>
      <div class="info-row"><span class="info-key">鏈娑堣€?/span><span class="info-val" id="prev-costs">-</span></div>
      <div class="info-row"><span class="info-key">鎵ц鏉ユ簮</span><span class="info-val" id="prev-executor">-</span></div>
      <div class="info-row"><span class="info-key">浠ｅ伐璐圭敤</span><span class="info-val" id="prev-fee">-</span></div>
      <div class="info-row"><span class="info-key">鎴愬姛鐜?/span><span class="info-val" id="prev-rate">-%</span></div>
      <div class="info-row"><span class="info-key">妯″紡 / 铻嶅悎鐜?/span><span class="info-val" id="prev-fusion">-</span></div>
      <div class="info-row"><span class="info-key">鏈€澶у鍚堟暟</span><span class="info-val" id="prev-maxfusion">-</span></div>
      <div class="info-row"><span class="info-key">鍝佽川鏋侀檺</span><span class="info-val" id="prev-maxq">-</span></div>
      <div class="info-row"><span class="info-key">瑙勫垯鎻愮ず</span><span class="info-val" id="prev-note">-</span></div>
    </div>
  </div>

  <button class="action-btn" id="prof-submit">鎵ц鎿嶄綔</button>
</div>
`;

const JOB_EXP_THRESHOLDS = [0, 1000, 5000, 12000, 60000, 80000, 400000, 500000, 3000000, 99999999];
const TIER_LABELS = ['', '1闃?, '2闃?, '3闃?, '4闃?, '5闃?];

const PROFESSION_CONFIG = {
  forge: {
    mode: 'forge', jobName: '閿婚€犲笀', title: '閿婚€犲伐搴?, displayName: '閿婚€?, actionLabel: '寮€濮嬮敾閫?,
    requiresMaterials: true, supportsFusion: true,
    costs: { 1: [100, 100, 0], 2: [200, 1500, 20], 3: [500, 5000, 50], 4: [15000, 15000, 5000], 5: [80000, 80000, 18000] },
    expGain: { 1: 50, 2: 400, 3: 2000, 4: 10000, 5: 50000 },
    targetHint: '閿婚€犳敮鎸佽嚜鍔ㄥ懡鍚嶏紱澶氶€夊悓闃舵潗鏂欎細瑙﹀彂铻嶉敾銆?,
    materialHint: '澶氶€夋潗鏂?= 铻嶉敾銆傚崈閿昏瀺閿昏姹傛墍鏈夋潗鏂欒揪鍒?1.15 浠ヤ笂锛堜竴鍝侊級銆?
  },
  manufacture: {
    mode: 'manufacture', jobName: '鍒堕€犲笀', title: '鍒堕€犲伐搴?, displayName: '鍒堕€?, actionLabel: '寮€濮嬪埗閫?,
    requiresMaterials: true, supportsFusion: false,
    costs: { 1: [20, 35, 20], 2: [160, 280, 160], 3: [700, 1225, 600], 4: [3000, 5250, 2000], 5: [16000, 28000, 7200] },
    expGain: { 1: 50, 2: 400, 3: 2000, 4: 10000, 5: 50000 },
    targetHint: '濉啓浣犳兂鍒堕€犵殑鎴愬搧鍚嶇О銆?,
    materialHint: '鍙€夋嫨閲戝睘銆佸浘绾搞€佹ā鍧椼€佸洖璺瓑浣滀负鍒堕€犳潗鏂欍€?
  },
  design: {
    mode: 'design', jobName: '璁捐甯?, title: '璁捐宸ュ簭', displayName: '璁捐', actionLabel: '寮€濮嬭璁?,
    requiresMaterials: false, supportsFusion: false,
    costs: { 1: [5, 10, 25], 2: [20, 40, 200], 3: [80, 150, 750], 4: [300, 600, 2500], 5: [1000, 2000, 9000] },
    expGain: { 1: 50, 2: 400, 3: 2000, 4: 10000, 5: 50000 },
    targetHint: '杩欓噷濉啓璁捐鍥惧悕绉帮紝渚嬪锛氫簩瀛楁枟閾犺璁″浘銆?,
    materialHint: '璁捐鑱屼笟鍏佽鏃犳潗鏂欒捣鑽夛紝浣嗛€夊叆妯℃澘/鏃у浘绾镐細琚浣滃崗鍚岃璁℃潗鏂欍€?
  },
  repair: {
    mode: 'repair', jobName: '淇悊甯?, title: '淇悊宸ュ簭', displayName: '淇悊', actionLabel: '寮€濮嬩慨鐞?,
    requiresMaterials: false, supportsFusion: false,
    costs: { 1: [5, 10, 5], 2: [40, 80, 40], 3: [175, 350, 150], 4: [750, 1500, 500], 5: [4000, 8000, 2700] },
    expGain: { 1: 50, 2: 400, 3: 2000, 4: 10000, 5: 50000 },
    targetHint: '杩欓噷濉啓寰呬慨瀵硅薄鍚嶇О锛屽缓璁～鍐欒儗鍖呬腑鐨勭幇鏈夎澶?闆朵欢銆?,
    materialHint: '鍙€夌淮鎶ゅ浠躲€佷慨澶嶅寘銆侀噾灞炴垨闆朵欢浣滀负淇悊鑰楁潗锛涗笉閫変篃鍏佽绾祫婧愭姠淇€?
  }
};

const OFFICIAL_COMMISSION_FEES = { 1: 150000, 2: 1500000, 3: 15000000, 4: 100000000, 5: 500000000 };
const PRIVATE_COMMISSION_FEES = { 1: 100000, 2: 1000000, 3: 10000000, 4: 80000000, 5: 300000000 };

const PROF_HIDDEN_ARBITRATION_NARRATION_RULES = `
[鍓嶇浠茶鍣ㄨ鏄嶿
浠ヤ笅鍐呭灞炰簬闅愯棌浠茶缁撴灉锛屼笉瑕佸湪姝ｆ枃涓洿鎺ュ杩扳€滄垚鍔熺巼 / Roll / 浠茶缁撴潫 / JSONPatch / 绯荤粺鍒嗘瀽鈥濈瓑瀛楁牱銆?
璇峰皢浠茶缁撹杞啓鎴愯嚜鐒跺墽鎯咃紝鍙弿鍐欎汉鐗╂搷浣溿€佸伐鑹鸿繃绋嬨€佸埗閫犺繃绋嬨€佽璁¤繃绋嬫垨淇悊杩囩▼锛屼互鍙婃垚鍔熸垨澶辫触甯︽潵鐨勮嚜鐒剁粨鏋溿€?
鐜╁搴斿綋鐪嬪埌鐨勬槸缁忚繃淇グ鍚庣殑鍓ф儏鏂囨湰锛岃€屼笉鏄郴缁熻瀹氭棩蹇椼€?
`.trim();

class ProfessionUIComponent {
  constructor(container, snapshot, options = {}) {
    this.container = container;
    this.snapshot = snapshot;
    this.options = options;
    this.activeMode = 'forge';

    this.initDOM();
    this.bindEvents();
    this.syncData();
    this.applyInitialContext();
  }

  initDOM() {
    if (!document.getElementById('profession-ui-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'profession-ui-styles';
      styleEl.textContent = ProfessionStyles;
      document.head.appendChild(styleEl);
    }
    this.container.innerHTML = ProfessionTemplate;
  }

  $(selector) { return this.container.querySelector(selector); }
  $$(selector) { return this.container.querySelectorAll(selector); }

  bindEvents() {
    this.$$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setActiveMode(btn.dataset.mode));
    });
    this.$('#prof-tier').addEventListener('change', () => {
      this.autoGenerateTargetName();
      this.updatePreview();
    });
    this.$('#prof-cost').addEventListener('input', () => this.updatePreview());
    this.$('#prof-target').addEventListener('input', () => this.updatePreview());
    this.$('#prof-submit').addEventListener('click', () => this.executeProfessionAction());
  }

  getCurrentUiState() {
    const tierVal = this.$('#prof-tier')?.value || '1';
    let parsedTier = Number(tierVal);
    let subtype = '';
    if (tierVal.startsWith('mech-')) { parsedTier = Number(tierVal.split('-')[1]); subtype = 'mech'; }
    else if (tierVal.startsWith('armor-')) { parsedTier = Number(tierVal.split('-')[1]); subtype = 'armor'; }
    return {
      activeMode: this.activeMode,
      tier: parsedTier || 1,
      subtype: subtype,
      cost: this.$('#prof-cost')?.value || '1',
      target: this.$('#prof-target')?.value || '',
      selectedMaterials: this.getSelectedMaterialNames()
    };
  }

  syncCostInputState() {
    const costInput = this.$('#prof-cost');
    if (!costInput) return;
    const state = this.getCurrentUiState();
    if (state.subtype === 'mech' || state.subtype === 'armor') {
      costInput.disabled = true;
      costInput.value = '鑷姩閿佸畾';
    } else {
      costInput.disabled = false;
      if (costInput.value === '鑷姩閿佸畾') costInput.value = '1';
    }
  }

  restoreUiState(state = {}) {
    if (state.activeMode && PROFESSION_CONFIG[state.activeMode]) {
      this.activeMode = state.activeMode;
    }
    this.$$('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === this.activeMode);
    });
    this.updateModeChrome();

    if (this.$('#prof-tier')) {
      if (this.activeMode !== 'forge') {
        if (state.subtype && state.tier) {
          this.$('#prof-tier').value = `${state.subtype}-${state.tier}`;
        }
      } else {
        this.$('#prof-tier').value = state.tier || '1';
      }
    }
    if (this.$('#prof-cost')) this.$('#prof-cost').value = state.cost || '1';
    if (this.$('#prof-target')) this.$('#prof-target').value = state.target || '';

    this.toggleCommissionFields();
    this.populateMaterialList();

    const selected = new Set(state.selectedMaterials || []);
    this.$$('.material-cb').forEach(cb => {
      cb.checked = selected.has(cb.value);
    });

    this.updatePreview();
    this.syncCostInputState();
    this.autoGenerateTargetName();
  }

  updateData(newSnapshot) {
    const currentState = this.getCurrentUiState();
    this.snapshot = newSnapshot;
    this.updateHeaderStatus();
    this.restoreUiState(currentState);
  }

  getInitialRequest() {
    const direct = this.options?.professionRequest;
    if (direct && typeof direct === 'object') return direct;
    const fromDispatch = this.options?.dispatchContext?.professionRequest;
    return fromDispatch && typeof fromDispatch === 'object' ? fromDispatch : {};
  }

  normalizeInitialMode(rawMode) {
    const value = String(rawMode || '').trim().toLowerCase();
    if (/manufacture|鍒堕€爘缁勮|鎬昏|灏佽/.test(value)) return 'manufacture';
    if (/design|璁捐|鍥剧焊|钃濆浘/.test(value)) return 'design';
    if (/repair|淇悊|缁翠慨|缁存姢|淇|鏁村/.test(value)) return 'repair';
    if (/forge|閿婚€爘閿绘墦|铻嶉敾|鐧鹃敾|鍗冮敾|鐏甸敾|榄傞敾|澶╅敾/.test(value)) return 'forge';
    return '';
  }

  parseInitialMaterials(value) {
    if (Array.isArray(value)) return value.map(item => String(item || '').trim()).filter(Boolean);
    if (value && typeof value === 'object') return Object.keys(value).filter(Boolean);
    return String(value || '')
      .split(/[銆?锛寍/]+/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  setInitialTier(req) {
    const tierSel = this.$('#prof-tier');
    if (!tierSel) return;
    const subtype = String(req.瀛愮被鍨?|| req.鐩爣绫诲瀷 || '').trim().toLowerCase();
    const tier = Number(req.闃剁骇 || req.绛夌骇 || 0);
    let value = '';
    if (this.activeMode !== 'forge') {
      if (/armor|鏂楅摖/.test(subtype) && tier) value = `armor-${tier}`;
      else if (/mech|鏈虹敳/.test(subtype) && tier) value = `mech-${tier}`;
    } else if (tier) {
      value = String(tier);
    }
    if (value && Array.from(tierSel.options || []).some(opt => opt.value === value)) {
      tierSel.value = value;
    }
    this.syncCostInputState();
  }

  applyInitialContext() {
    const req = this.getInitialRequest();
    const mode = this.normalizeInitialMode(this.options.prefillMode || req.妯″紡 || req.鍔ㄤ綔 || req.鍓亴涓?|| req.鑱屼笟);
    if (mode) this.setActiveMode(mode);

    this.setInitialTier(req);

    const qty = Math.max(1, Number(this.options.prefillQty || req.鏁伴噺 || 0));
    const costInput = this.$('#prof-cost');
    if (qty > 0 && costInput && !costInput.disabled) costInput.value = String(qty);

    const target = String(this.options.prefillTarget || req.鐩爣 || req.鐗╁搧 || req.浜х墿 || '').trim();
    if (target && this.$('#prof-target')) this.$('#prof-target').value = target;

    const materials = this.parseInitialMaterials(
      this.options.prefillMaterials || req.鏉愭枡 || ''
    );
    if (materials.length) {
      const materialSet = new Set(materials);
      this.$$('.material-cb').forEach(cb => {
        cb.checked = materialSet.has(cb.value);
      });
    }
    if (!target && materials.length) this.autoGenerateTargetName();

    this.updatePreview();

    const autoExecute = this.options.autoExecute === true
      || req.鑷姩鎵ц === true
      || /auto|ready|鎵ц|纭|寮€濮媩鐩存帴/.test(String(req.鐘舵€?|| ''));
    if (autoExecute) {
      window.setTimeout(() => this.runInitialAutoExecute(), 100);
    }
  }

  runInitialAutoExecute() {
    const submitBtn = this.$('#prof-submit');
    if (submitBtn && !submitBtn.disabled) this.executeProfessionAction();
  }

  get charData() { return this.snapshot?.activeChar || {}; }
  get allChars() { return this.snapshot?.sd?.char || {}; }
  get activeName() {
    const chars = this.allChars || {};
    const snapshotActive = String(this.snapshot?.activeName || '').trim();
    if (snapshotActive && chars[snapshotActive]) return snapshotActive;

    const playerName = String(this.snapshot?.sd?.sys?.鐜╁鍚?|| '').trim();
    if (playerName && chars[playerName]) return playerName;
    if (chars['涓昏']) return '涓昏';

    const firstName = Object.keys(chars)[0];
    return firstName || '涓昏';
  }
  get activeCharBasePath() { return `/char/${this.escapeJsonPointer(this.activeName)}`; }
  get currentInventory() { return this.charData.鑳屽寘 || {}; }

  syncData() {
    this.updateHeaderStatus();
    this.updateModeChrome();
    this.toggleCommissionFields();
    this.populateMaterialList();
    this.updatePreview();
  }

  updateHeaderStatus() {
    const stat = this.charData.灞炴€?|| {};
    this.$('#chip-vs').textContent = `${Number(stat.浣撳姏 || 0).toLocaleString()} / ${Number(stat.榄傚姏 || 0).toLocaleString()}`;
    this.$('#chip-men').textContent = Number(stat.绮剧鍔?|| 0).toLocaleString();
    this.$('#chip-men-realm').textContent = stat.绮剧澧冪晫 || '鏈煡';
  }

  updateModeChrome() {
    const cfg = PROFESSION_CONFIG[this.activeMode];
    this.$('#prof-ui-title').textContent = cfg.title;
    this.$('#prof-ui-subtitle').textContent = `${cfg.displayName} / ${cfg.jobName}`;
    this.$('#materials-hint').textContent = cfg.materialHint;
    this.$('#target-hint').textContent = cfg.targetHint;
    this.$('#prof-submit').textContent = cfg.actionLabel;
    this.updateTierOptions();
    this.$('#qty-hint').textContent = this.activeMode === 'forge'
      ? '閿婚€犱細鎸夆€滄瘡绉嶆潗鏂欐秷鑰楅噺鈥濇墸闄ゆ潗鏂欙紝骞跺悓姝ユ墸闄よ亴涓氳祫婧愩€?
      : '鍓亴涓氫細鎸夎緭鍏ユ暟閲忓悓姝ユ墿澶у熀纭€璧勬簮娑堣€楋紱鏉愭枡鎸夊嬀閫夐」鎵ｉ櫎銆?;
  }

  getForgeTierLabel(tier) {
    return ({ 1: '鐧鹃敾', 2: '鍗冮敾', 3: '鐏甸敾', 4: '榄傞敾', 5: '澶╅敾' })[Number(tier) || 1] || `${Number(tier) || 0}闃禶;
  }

  getGearTierFamilyLabel(tier) {
    return ({
      1: '榛勭骇鏈虹敳',
      2: '绱骇鏈虹敳 / 涓€瀛楁枟閾?,
      3: '榛戠骇鏈虹敳 / 浜屽瓧鏂楅摖',
      4: '绾㈢骇鏈虹敳 / 涓夊瓧鏂楅摖',
      5: '鍥涘瓧鏂楅摖'
    })[Number(tier) || 1] || `${Number(tier) || 0}闃惰澶嘸;
  }

  getTierDisplayName(mode, tier) {
    if (mode === 'forge') return this.getForgeTierLabel(tier);
    const suffix = ({ manufacture: '鍒堕€?, design: '璁捐', repair: '淇悊' })[mode] || '澶勭悊';
    return `${this.getGearTierFamilyLabel(tier)}${suffix}`;
  }

  getTierQualityLabel(mode, tier) {
    return mode === 'forge' ? this.getForgeTierLabel(tier) : this.getGearTierFamilyLabel(tier);
  }

  updateTierOptions() {
    const tierSel = this.$('#prof-tier');
    if (!tierSel) return;
    const currentVal = tierSel.value;
    tierSel.innerHTML = '';
    if (this.activeMode !== 'forge') {
      const suffix = ({ manufacture: '鍒堕€?, design: '璁捐', repair: '淇悊' })[this.activeMode] || '澶勭悊';
      tierSel.innerHTML = `
        <option value="mech-1">榛勭骇鏈虹敳${suffix}</option>
        <option value="armor-2">涓€瀛楁枟閾?{suffix}</option>
        <option value="mech-2">绱骇鏈虹敳${suffix}</option>
        <option value="armor-3">浜屽瓧鏂楅摖${suffix}</option>
        <option value="mech-3">榛戠骇鏈虹敳${suffix}</option>
        <option value="armor-4">涓夊瓧鏂楅摖${suffix}</option>
        <option value="mech-4">绾㈢骇鏈虹敳${suffix}</option>
        <option value="armor-5">鍥涘瓧鏂楅摖${suffix}</option>
      `;
    } else {
      for (let i = 1; i <= 5; i++) {
        const opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = this.getTierDisplayName(this.activeMode, i);
        tierSel.appendChild(opt);
      }
    }
    if (Array.from(tierSel.options).some(o => o.value === currentVal)) {
      tierSel.value = currentVal;
    } else {
      tierSel.selectedIndex = 0;
    }
    this.syncCostInputState();
  }

  setActiveMode(mode) {
    this.activeMode = mode;
    this.$$('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
    this.updateModeChrome();
    this.populateMaterialList();
    this.autoGenerateTargetName();
    this.updatePreview();
  }

  autoGenerateTargetName() {
    const state = this.getCurrentUiState();
    const mode = this.activeMode;
    const targetInput = this.$('#prof-target');
    if (!targetInput) return;

    if (mode === 'forge') {
      const mat = Array.from(this.el.querySelectorAll('.material-checkbox:checked')).map(cb => cb.value)[0] || '鏈煡閲戝睘';
      targetInput.value = `${mat}(${this.getForgeTierLabel(state.tier)})`;
    } else {
      const opt = this.$('#prof-tier').selectedOptions?.[0];
      const text = opt ? opt.textContent.replace(/鍒堕€爘璁捐|淇悊|澶勭悊/, '') : '';
      if (state.subtype === 'armor') targetInput.value = `${text}鑳搁摖`;
      else if (state.subtype === 'mech') targetInput.value = text;
      else targetInput.value = `${this.getGearTierFamilyLabel(state.tier)}閮ㄤ欢`;
    }
    this.syncCostInputState();
  }

  // --- 鑱屼笟绠楁硶鏍稿績 (绉绘鍘熶唬鐮? ---
  clamp(num, min, max) { return Math.max(min, Math.min(max, num)); }
  formatFedCoin(amount) { return `${Number(amount || 0).toLocaleString()} 鑱旈偊甯乣; }
  escapeJsonPointer(str) { return String(str).replace(/~/g, '~0').replace(/\//g, '~1'); }

  getLevelFromTotalExp(exp) {
    let lv = 0;
    while (lv < 9 && exp >= JOB_EXP_THRESHOLDS[lv]) lv++;
    return lv;
  }

  deriveLimitSuccessRate(lv, exp) {
    if (lv === 9) {
      const overflowExp = Math.max(0, exp - 3000000);
      return Math.min(50, 10 + Math.floor(overflowExp / 500000));
    }
    if (lv > 0) {
      const cExp = JOB_EXP_THRESHOLDS[lv - 1], nExp = JOB_EXP_THRESHOLDS[lv];
      let progress = this.clamp((exp - cExp) / Math.max(1, (nExp - cExp)), 0, 1);
      return lv % 2 === 0 ? Math.floor(80 + 15 * progress) : Math.floor(30 + 40 * progress);
    }
    return 0;
  }

  getJobRuntime(jobName, charObj = this.charData) {
    const job = charObj?.鑱屼笟?.[jobName] || {};
    const totalExp = Number(job.缁忛獙 || 0);
    let lv = Math.max(Number(job.绛夌骇 || 0), this.getLevelFromTotalExp(totalExp));
    lv = this.clamp(lv, 0, 9);
    const cExp = JOB_EXP_THRESHOLDS[Math.max(0, lv - 1)] || 0;
    const nExp = JOB_EXP_THRESHOLDS[Math.min(lv, 9)] || JOB_EXP_THRESHOLDS[9];
    const expRatio = lv >= 9 ? 0 : this.clamp((totalExp - cExp) / Math.max(1, (nExp - cExp)), 0, 0.999);
    const limitSuccessRate = Number(job?.闄愬埗?.鎴愬姛鐜??? this.deriveLimitSuccessRate(lv, totalExp));
    const maxFusion = Number(job?.闄愬埗?.鏈€澶ц瀺鍚堟暟 ?? Math.max(1, Math.floor(lv / 2)));

    return { jobName, job, lv, exp: totalExp, expRatio, limitSuccessRate, maxFusion, currentBaseExp: cExp, nextLevelExp: nExp };
  }

  buildOfficialCommissionRuntime(jobName) {
    return { jobName, job: {}, lv: 9, exp: 99999999, expRatio: 1, limitSuccessRate: 85, maxFusion: 3, currentBaseExp: 0, nextLevelExp: 0 };
  }

  deriveJobLimitsFromExp(exp) {
    const lv = this.getLevelFromTotalExp(exp);
    return { lv, 鏈€澶ц瀺鍚堟暟: Math.max(1, Math.floor(lv / 2)), 鎴愬姛鐜? this.deriveLimitSuccessRate(lv, exp) };
  }

  getItemTier(itemName) {
    if (/澶╅敾|鍥涘瓧|鍗佷竾骞?.test(itemName)) return 5;
    if (/榄傞敾|涓夊瓧|绾㈢骇/.test(itemName)) return 4;
    if (/鐏甸敾|浜屽瓧|榛戠骇/.test(itemName)) return 3;
    if (/鍗冮敾|涓€瀛梶绱骇/.test(itemName)) return 2;
    return 1;
  }

  getForgeUnlockLevel(tier) { return [1, 3, 5, 7, 9][tier - 1] || 99; }
  getForgeFusionUnlockLevel(tier) { return [0, 5, 6, 8, 9][tier - 1] || 99; }

  getSingleTierSuccessRate(tier, runtime) {
    const { lv, expRatio } = runtime;
    if (tier === 5) return lv >= 9 ? 20 : 0;
    const uLv = this.getForgeUnlockLevel(tier);
    if (lv < uLv) return 0;
    if (lv === uLv) return 30 + Math.floor(expRatio * 30);
    if (lv === uLv + 1) return 80 + Math.floor(expRatio * 20);
    return 100;
  }

  getForgeFusionSuccessRate(runtime, materialCount, hasExtraTech) {
    let rate = runtime.limitSuccessRate - Math.max(0, materialCount - 1) * 15;
    if (hasExtraTech) rate = Math.floor(rate * 1.1);
    return this.clamp(rate, 0, 100);
  }

  getGenericCompositeRate(runtime, materialCount) { return this.clamp(runtime.limitSuccessRate - Math.max(0, materialCount - 1) * 10, 0, 100); }
  getGenericSingleRate(runtime) { return this.clamp(runtime.limitSuccessRate, 0, 100); }

  hasBlueprintMaterial(materialNames) {
    return materialNames.some(name => /璁捐鍥緗钃濆浘|妯℃澘/.test(name) || this.currentInventory[name]?.绫诲瀷 === '鍥剧焊');
  }

  getArmorBlueprintNameByTier(tier) { return { 2: '涓€瀛楁枟閾犺璁″浘', 3: '浜屽瓧鏂楅摖璁捐鍥?, 4: '涓夊瓧鏂楅摖璁捐鍥?, 5: '鍥涘瓧鏂楅摖璁捐鍥? }[tier] || `${this.getGearTierFamilyLabel(tier)}璁捐鍥綻; }
  getArmorTierFromName(name) { return /涓€瀛?.test(name) ? 2 : (/浜屽瓧/.test(name) ? 3 : (/涓夊瓧/.test(name) ? 4 : (/鍥涘瓧/.test(name) ? 5 : 0))); }
  getTierMetalLabel(tier) { return { 1: '鐧鹃敾閲戝睘', 2: '鍗冮敾閲戝睘', 3: '鐏甸敾閲戝睘', 4: '榄傞敾閲戝睘', 5: '澶╅敾閲戝睘' }[tier] || `${this.getForgeTierLabel(tier)}閲戝睘`; }

  getSelectedTierStock(materialNames) {
    const totals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const name of materialNames) {
      totals[this.getItemTier(name)] += Number(this.currentInventory[name]?.鏁伴噺 || 0);
    }
    return totals;
  }

  getManufactureRecipe(targetName, materialNames, tier, qty = 1) {
    const state = this.currentFormState;
    const isMech = state.subtype === 'mech' || /鏈虹敳/.test(targetName);
    const isArmor = state.subtype === 'armor' || /鏂楅摖|涓€瀛梶浜屽瓧|涓夊瓧|鍥涘瓧/.test(targetName) || materialNames.some(name => /鏂楅摖璁捐鍥?.test(name));

    if (isMech) {
      if (tier === 1 || /榛勭骇/.test(targetName)) return { mode: 'mech', fixedTierNeeds: { 2: 1, 1: 50 }, expectedTier: 1, note: '鍥哄畾閰嶆柟锛?浠藉崈閿婚噾灞?+ 50浠界櫨閿婚噾灞? };
      if (tier === 2 || /绱骇/.test(targetName)) return { mode: 'mech', fixedTierNeeds: { 3: 1, 1: 40 }, expectedTier: 2, note: '鍥哄畾閰嶆柟锛?浠界伒閿婚噾灞?+ 40浠界櫨閿婚噾灞? };
      if (tier === 3 || /榛戠骇/.test(targetName)) return { mode: 'mech', fixedTierNeeds: { 4: 1, 2: 30 }, expectedTier: 3, note: '鍥哄畾閰嶆柟锛?浠介瓊閿婚噾灞?+ 30浠藉崈閿婚噾灞? };
      if (tier === 4 || /绾㈢骇/.test(targetName)) return { mode: 'mech', fixedTierNeeds: { 5: 1, 4: 10, 3: 10 }, expectedTier: 4, note: '鍥哄畾閰嶆柟锛?浠藉ぉ閿婚噾灞?+ 10浠介瓊閿?+ 10浠界伒閿? };
    }
    
    if (isArmor) {
      const blueprint = this.getArmorBlueprintNameByTier(tier);
      const isChest = /鑳?.test(targetName);
      const metalCount = isChest ? 3 : 2;
      return { mode: 'armor', blueprint, blueprintCost: 1, variableQty: metalCount, note: `鏂楅摖鍒堕€狅細鍥哄畾娑堣€椼€?{blueprint}銆?寮?+ ${metalCount}鍧楀悓闃堕噾灞?(鑳搁摖3鍧楋紝鍏朵綑2鍧?` };
    }
    return null;
  }

  buildTierNeedConsumePlan(materialNames, tierNeeds) {
    const plan = {};
    for (const tierKey of Object.keys(tierNeeds)) {
      const tier = Number(tierKey);
      let remaining = Number(tierNeeds[tierKey] || 0);
      for (const name of materialNames) {
        if (remaining <= 0) break;
        if (this.getItemTier(name) !== tier) continue;
        const available = Number(this.currentInventory[name]?.鏁伴噺 || 0) - Number(plan[name] || 0);
        const take = Math.min(available, remaining);
        if (take > 0) { plan[name] = Number(plan[name] || 0) + take; remaining -= take; }
      }
      if (remaining > 0) return null;
    }
    return plan;
  }

  getManufactureOutputMeta(targetName, materialNames, tier) {
    const armorBlueprint = materialNames.find(name => /(涓€瀛梶浜屽瓧|涓夊瓧|鍥涘瓧)鏂楅摖璁捐鍥?.test(name));
    if (armorBlueprint) return { name: armorBlueprint.replace('璁捐鍥?, ''), type: '鏂楅摖閮ㄤ欢' };
    if (/鏈虹敳/.test(targetName)) return { name: /榛勭骇|绱骇|榛戠骇|绾㈢骇/.test(targetName) ? targetName : ({ 1: '榛勭骇鏈虹敳缁勪欢', 2: '绱骇鏈虹敳缁勪欢', 3: '榛戠骇鏈虹敳缁勪欢', 4: '绾㈢骇鏈虹敳缁勪欢' }[tier] || targetName), type: '鏈虹敳閮ㄤ欢' };
    if (/榄傚/.test(targetName)) return { name: targetName, type: '榄傚鍣? };
    return { name: targetName, type: '鍒堕€犱骇鐗? };
  }

  getDesignOutputName(targetName, tier, materialNames = []) {
    if (/(涓€瀛梶浜屽瓧|涓夊瓧|鍥涘瓧)鏂楅摖璁捐鍥?.test(targetName)) return targetName;
    if (/鏂楅摖|鎶ら摖/.test(targetName) || materialNames.some(name => /鏂楅摖/.test(name))) return this.getArmorBlueprintNameByTier(tier);
    return /璁捐鍥緗钃濆浘/.test(targetName) ? targetName : `${targetName}璁捐鍥綻;
  }

  getRepairDescriptor(materialNames) {
    if (materialNames.some(name => /绁炵骇閲嶅鏍稿績/.test(name))) return { status: '绁炵骇閲嶅瀹屾垚', desc: '鍊熷姪绁炵骇閲嶅鏍稿績瀹屾垚浜嗘暣浣撻噸濉? };
    if (materialNames.some(name => /鏂楅摖鏈簮钑村吇娑?.test(name))) return { status: '鏈簮淇', desc: '鏂楅摖鏈簮宸插緱鍒板厖鍒嗚暣鍏讳笌淇' };
    if (materialNames.some(name => /绮惧瘑淇妯″潡/.test(name))) return { status: '绮惧瘑淇瀹屾垚', desc: '鍏抽敭缁撴瀯宸插畬鎴愮簿瀵嗙骇淇涓庢牎鍑? };
    if (materialNames.some(name => /鍩虹缁存姢濂椾欢/.test(name))) return { status: '鍩虹缁存姢瀹屾垚', desc: '宸插畬鎴愭棩甯哥淮鎶ゃ€侀櫎閿欎笌甯歌鏍″噯' };
    return { status: '宸叉淇?, desc: '宸插畬鎴愭爣鍑嗘淇? };
  }

  getRepairRequirement(targetName) {
    const item = this.currentInventory[targetName] || {};
    const durability = Number(item?.鑰愪箙 ?? item?.瀹屾暣搴??? 100);
    const statusText = `${targetName} ${item?.鐘舵€?|| ''} ${item?.鎻忚堪 || ''}`;
    if (/褰诲簳鎹熸瘉|瀹屽叏鎹熸瘉|鎶ュ簾|绮夌|宕╂瘉|閲嶅/.test(statusText) || durability <= 0) return { label: '褰诲簳鎹熸瘉', required: '绁炵骇閲嶅鏍稿績', allows: [/绁炵骇閲嶅鏍稿績/] };
    if (/鏂楅摖/.test(targetName) && (/鏈簮|鏍瑰熀|鏍稿績鍙楁崯|鐏垫€ф祦澶?.test(statusText) || (durability > 0 && durability < 30))) return { label: '鏂楅摖鏈簮浼?, required: '鏂楅摖鏈簮钑村吇娑?, allows: [/鏂楅摖鏈簮钑村吇娑?, /绁炵骇閲嶅鏍稿績/] };
    if (/涓ラ噸|涓害|閲嶄激|瑁傜汗|鏂|鐮存崯|鎹熷潖|澶辫　/.test(statusText) || durability < 60) return { label: '涓噸搴︽崯浼?, required: '绮惧瘑淇妯″潡', allows: [/绮惧瘑淇妯″潡/, /鏂楅摖鏈簮钑村吇娑?, /绁炵骇閲嶅鏍稿績/] };
    return { label: '杞诲害纾ㄦ崯', required: '鍩虹缁存姢濂椾欢', allows: [/鍩虹缁存姢濂椾欢/, /绮惧瘑淇妯″潡/, /鏂楅摖鏈簮钑村吇娑?, /绁炵骇閲嶅鏍稿績/] };
  }

  getRepairRequirementSatisfied(materialNames, requirement) {
    if (!requirement) return true;
    return requirement.allows.some(pattern => materialNames.some(name => pattern.test(name)));
  }

  getProfessionCost(jobName, tier, qty = 1) {
    const config = Object.values(PROFESSION_CONFIG).find(c => c.jobName === jobName);
    const base = (config?.costs?.[tier] || [0, 0, 0]).slice();
    const m = Math.max(1, Number(qty || 1));
    return { vit: base[0] * m, sp: base[1] * m, men: base[2] * m };
  }

  formatResourceCost(costs) { return `浣?${costs.vit.toLocaleString()} / 榄?${costs.sp.toLocaleString()} / 绮?${costs.men.toLocaleString()}`; }
  formatCurrentResources() { const s = this.charData.灞炴€?|| {}; return `浣?${Number(s.vit || 0).toLocaleString()} / 榄?${Number(s.sp || 0).toLocaleString()} / 绮?${Number(s.men || 0).toLocaleString()}`; }
  hasEnoughResources(costs) { const s = this.charData.灞炴€?|| {}; return Number(s.vit || 0) >= costs.vit && Number(s.sp || 0) >= costs.sp && Number(s.men || 0) >= costs.men; }

  resolveDispatchNpcTarget() {
    const detail = this.options?.dispatchContext || {};
    const direct = String(detail.npcTarget || '').trim();
    if (direct) return direct;
    const npcTargets = Array.isArray(detail.npcTargets) ? detail.npcTargets.map(item => String(item || '').trim()).filter(Boolean) : [];
    return npcTargets.length === 1 ? npcTargets[0] : '';
  }

  getCommissionType() {
    const detail = this.options?.dispatchContext || {};
    const executorType = String(detail.executorType || detail.craftSource || '').trim();
    if (executorType === 'official') return 'official';
    return this.resolveDispatchNpcTarget() ? 'private' : 'self';
  }

  resolveCharacterByName(name) {
    const target = String(name || '').trim();
    const chars = this.allChars && typeof this.allChars === 'object' ? this.allChars : {};
    if (!target) return { key: '', displayName: '', char: null };
    if (chars[target]) {
      const charInfo = chars[target];
      const displayName = String(charInfo?.name || charInfo?.base?.name || target).trim() || target;
      return { key: target, displayName, char: charInfo };
    }
    for (const [charKey, charInfo] of Object.entries(chars)) {
      const displayName = String(charInfo?.name || charInfo?.base?.name || charKey).trim() || charKey;
      if (displayName === target) {
        return { key: charKey, displayName, char: charInfo };
      }
    }
    return { key: '', displayName: target, char: null };
  }

  getTargetNpcName() { return this.resolveDispatchNpcTarget(); }
  getRelationScore(name) {
    const resolved = this.resolveCharacterByName(name);
    const relationName = resolved.displayName || String(name || '').trim();
    return Number(this.charData?.绀句氦?.鍏崇郴?.[name]?.濂芥劅搴?|| this.charData?.绀句氦?.鍏崇郴?.[relationName]?.濂芥劅搴?|| 0);
  }

  getFusionContext(runtime, materialNames) {
    if (materialNames.length === 1) {
      const fMeta = this.currentInventory[materialNames[0]]?.铻嶅悎鍙傛暟 || {};
      return { fusionCount: Math.max(1, Number(fMeta.鏁伴噺 || 1)), fusionSync: Number(fMeta.铻嶅悎鐜??? fMeta.濂戝悎搴??? 100) };
    }
    if (materialNames.length > 1) return { fusionCount: materialNames.length, fusionSync: this.activeMode === 'forge' ? this.getForgeFusionRate(runtime, materialNames) : 0 };
    return { fusionCount: 1, fusionSync: 0 };
  }

  getModeSuccessRateForRuntime(mode, runtime, tier, materialNames, fusionCount) {
    const ef = Math.max(1, Number(fusionCount || materialNames?.length || 1));
    if (mode === 'forge') return ef > 1 ? this.getForgeFusionSuccessRate(runtime, ef, false) : this.getSingleTierSuccessRate(tier, runtime);
    return ef > 1 ? this.getGenericCompositeRate(runtime, ef) : this.getGenericSingleRate(runtime);
  }

  buildCommissionFeePatches(fee) {
    const amount = Math.max(0, Number(fee || 0));
    return amount <= 0 ? [] : [{ op: 'replace', path: `${this.activeCharBasePath}/璐㈠瘜/鑱旈偊甯乣, value: Math.max(0, Number(this.charData.璐㈠瘜?.鑱旈偊甯?|| 0) - amount) }];
  }

  toggleCommissionFields() {
    const type = this.getCommissionType();
    const targetNpcName = this.getTargetNpcName();
    const sourcePanel = this.$('#commission-source-panel');
    if (sourcePanel) sourcePanel.textContent = type === 'official' ? '鍦板浘宸ュ潑濮旀墭 / 鍗忎細浠ｅ伐' : (type === 'private' ? `鍦板浘宸ュ潑濮旀墭 / ${targetNpcName || '鏈寚瀹氬璞?} 浠ｅ伐` : `褰撳墠瑙掕壊鑷鎿嶄綔 / ${this.activeName}`);
    const hint = this.$('#commission-hint');
    if (hint) {
      hint.textContent = type === 'official' ? '姝ら潰鏉夸綔涓哄崗浼氬伐鍧婃帴鍙ｆ墦寮€锛屽鎵樻祦绋嬪彈鏍囧噯瑙勭珷淇濇姢銆?
        : (type === 'private' ? `姝ら潰鏉跨敱 ${targetNpcName || '鏈寚瀹氬璞?} 鐨勬帴鍗曡鍔ㄨЕ鍙戙€俙
        : '浣跨敤瑙掕壊鏈韩鑳藉姏杩涜宸ヨ壓鎿嶄綔銆?);
    }
  }

  getOfficialCommissionLocation(jobName) {
    const name = String(jobName || '').trim();
    if (name === '閿婚€犲笀') return '閿婚€犲笀鍗忎細';
    if (name === '璁捐甯?) return '璁捐甯堝崗浼?;
    if (name === '淇悊甯?) return '淇悊甯堝崗浼?;
    return '鍒堕€犲笀鍗忎細';
  }

  normalizeLocForMatch(location) {
    const raw = String(location || '').replace(/^鏂楃綏澶ч檰-/, '').replace(/^鏂楃伒澶ч檰-/, '').trim();
    const segments = raw.split('-').filter(Boolean);
    return {
      raw,
      leaf: segments[segments.length - 1] || raw,
      segments
    };
  }

  isLocationCompatible(currentLoc, targetLoc) {
    const current = this.normalizeLocForMatch(currentLoc);
    const target = this.normalizeLocForMatch(targetLoc);
    if (!current.raw || !target.raw) return current.raw === target.raw;
    if (current.raw === target.raw || current.leaf === target.leaf) return true;
    return current.segments.some(seg => target.segments.includes(seg));
  }

  getCommissionContext(cfg, runtime, tier, materialNames, targetName) {
    const type = this.getCommissionType();
    const targetNpcName = this.getTargetNpcName();
    const currentLoc = String(this.charData?.鐘舵€?.浣嶇疆 || '');
    const wealth = Number(this.charData?.璐㈠瘜?.鑱旈偊甯?|| 0);
    const fusion = this.getFusionContext(runtime, materialNames);
    const ctx = {
      type, isCommission: type !== 'self', isOfficial: type === 'official', isPrivate: type === 'private',
      targetNpcName, targetName, fusionCount: fusion.fusionCount, fusionSync: fusion.fusionSync,
      relScore: 0, commissionFee: 0, successRate: null, executorName: this.activeName, executorRuntime: runtime, validationRuntime: runtime,
      note: `鐢?{this.activeName}浜茶嚜鎵ц锛屾寜褰撳墠瑙掕壊鑱屼笟鐔熺粌搴︿徊瑁併€俙, error: null, targetChar: null, hasEnoughFunds: true
    };

    if (!this.charData?.鑱屼笟?.[cfg.jobName]) { ctx.error = `${this.activeName}鏈帉鎻°€?{cfg.jobName}銆戝壇鑱屼笟锛屾棤娉曞彂璧疯绫绘搷浣溿€俙; return ctx; }

    if (ctx.isOfficial) {
      ctx.executorName = `${cfg.jobName}鍗忎細`; ctx.executorRuntime = this.buildOfficialCommissionRuntime(cfg.jobName); ctx.validationRuntime = ctx.executorRuntime;
      ctx.successRate = 85; ctx.commissionFee = Number(OFFICIAL_COMMISSION_FEES[tier] || 0);
      const officialLocationName = this.getOfficialCommissionLocation(cfg.jobName);
      ctx.note = `瀹樻柟浠ｅ伐鍥哄畾鎴愬姛鐜?85%锛屾渶澶氭壙鎺?3 绾у鍚堝伐搴忋€傚綋鍓嶄唬宸ヨ垂 ${this.formatFedCoin(ctx.commissionFee)}銆俙;
      if (!currentLoc.includes(officialLocationName)) ctx.error = `蹇呴』鍓嶅線銆?{officialLocationName}銆戝ぇ鍘呮墠鑳藉姙鐞嗗畼鏂逛唬宸ュ鎵樸€俙;
      else if (ctx.fusionCount > 3) ctx.error = `瀹樻柟娴佹按绾挎嫆鏀?${ctx.fusionCount} 绾у鍚堝伐搴忥紝褰撳墠瓒呭嚭鍗忎細宸ヨ壓涓婇檺銆俙;
    } else if (ctx.isPrivate) {
      if (!targetNpcName) ctx.error = '璇烽€夋嫨鎴栧～鍐欑浜轰唬宸ョ洰鏍?NPC銆?;
      else {
        const resolvedTarget = this.resolveCharacterByName(targetNpcName);
        const targetChar = resolvedTarget.char;
        const relationName = resolvedTarget.displayName || targetNpcName;
        ctx.targetChar = targetChar || null;
        if (!targetChar) ctx.error = `鎵句笉鍒颁唬宸ョ洰鏍囥€?{targetNpcName}銆戙€俙;
        else if (!this.isLocationCompatible(currentLoc, String(targetChar?.鐘舵€?.浣嶇疆 || ''))) ctx.error = `銆?{targetNpcName}銆戝綋鍓嶄笉鍦ㄤ綘韬竟锛屾棤娉曡繘琛屽綋闈唬宸ヤ氦鎺ャ€俙;
        else if (!targetChar?.鑱屼笟?.[cfg.jobName]) ctx.error = `銆?{targetNpcName}銆戝苟鏈帉鎻°€?{cfg.jobName}銆戝壇鑱屼笟銆俙;
        else {
          const npcRuntime = this.getJobRuntime(cfg.jobName, targetChar);
          ctx.executorName = relationName; ctx.executorRuntime = npcRuntime; ctx.validationRuntime = npcRuntime;
          ctx.relScore = this.getRelationScore(relationName);
          if (ctx.fusionCount > npcRuntime.maxFusion) ctx.error = `鐩爣 NPC銆?{targetNpcName}銆戠殑${cfg.jobName}绛夌骇涓嶈冻锛屾棤娉曟壙鎺?${ctx.fusionCount} 绾у鍚堝伐搴忋€俙;
          else {
            const baseFee = Number(PRIVATE_COMMISSION_FEES[tier] || 100000);
            ctx.commissionFee = baseFee * Math.max(1, ctx.fusionCount);
            if (ctx.relScore >= 80) ctx.commissionFee = 0;
            else if (ctx.relScore >= 50) ctx.commissionFee = Math.floor(ctx.commissionFee * 0.5);
            const baseRate = this.getModeSuccessRateForRuntime(cfg.mode, npcRuntime, tier, materialNames, ctx.fusionCount);
            ctx.successRate = this.clamp(baseRate + Math.floor(ctx.relScore / 10), 0, 100);
            ctx.note = `绉佷汉浠ｅ伐鐢便€?{targetNpcName}銆戞墽琛岋紝濂芥劅搴?${ctx.relScore}锛屼唬宸ヨ垂 ${this.formatFedCoin(ctx.commissionFee)}锛屾垚鍔熺巼宸叉寜鐩爣 NPC 鑳藉姏涓庡叧绯讳慨姝ｉ噸绠椼€俙;
          }
        }
      }
    }
    ctx.hasEnoughFunds = wealth >= ctx.commissionFee;
    if (ctx.isCommission && !ctx.error && !ctx.hasEnoughFunds) ctx.error = `璧勯噾涓嶈冻锛屽綋鍓嶅鎵橀渶瑕?${this.formatFedCoin(ctx.commissionFee)}銆俙;
    return ctx;
  }

  getMaterialFilter(mode) {
    if (mode === 'forge') return (name, item) => /閲戝睘|閾亅閾秥閲憒閾渱鐭縷閿粅鍚堥噾|鐜夐摱/.test(name) || item?.绫诲瀷 === '鏉愭枡' || /鐧鹃敾|鍗冮敾|鐏甸敾|榄傞敾|澶╅敾/.test(item?.鍝佽川);
    if (mode === 'manufacture') return (name, item) => /閲戝睘|閿粅鍚堥噾|鐜夐摱|璁捐鍥緗钃濆浘|鏍稿績|鍥炶矾|妯″潡|闆朵欢|楠ㄦ灦|澶栧３|瑁呯敳|寮曟搸|鐐?.test(name) || ['鏉愭枡', '鍥剧焊'].includes(item?.绫诲瀷);
    if (mode === 'design') return (name, item) => /鍥剧焊|钃濆浘|妯℃澘|鍥炶矾|妯″潡|鏍稿績|璁捐/.test(name) || ['鍥剧焊', '鏉愭枡'].includes(item?.绫诲瀷);
    if (mode === 'repair') return (name, item) => /缁存姢|淇|濂椾欢|閲戝睘|閿粅闆朵欢|鍥炶矾|妯″潡|澶栧３|瑁呯敳|寮曟搸|鐐?.test(name) || ['娑堣€楀搧', '鏉愭枡'].includes(item?.绫诲瀷);
    return () => false;
  }

  getSelectedMaterialNames() { return Array.from(this.container.querySelectorAll('.material-cb:checked')).map(node => node.value); }

  setPreviewField(id, value, cls = '') {
    const el = this.$('#' + id);
    if (!el) return;
    el.className = `info-val ${cls}`.trim();
    el.innerHTML = value;
  }

  populateMaterialList() {
    const cfg = PROFESSION_CONFIG[this.activeMode];
    const container = this.$('#prof-materials-list');
    container.innerHTML = '';
    const filter = this.getMaterialFilter(this.activeMode);
    let count = 0;
    Object.keys(this.currentInventory).forEach(itemName => {
      const item = this.currentInventory[itemName];
      if ((item?.鏁伴噺 || 0) > 0 && filter(itemName, item)) {
        const label = document.createElement('label');
        label.className = 'material-item';
        const cb = document.createElement('input');
        cb.type = 'checkbox'; cb.className = 'material-cb'; cb.value = itemName;
        cb.addEventListener('change', () => { this.autoGenerateTargetName(); this.updatePreview(); });
        const detail = [`鍓?{item.鏁伴噺}`];
        if (item.鍝佽川绯绘暟) detail.push(`Q${Number(item.鍝佽川绯绘暟).toFixed(2)}`);
        const fusionRate = item?.铻嶅悎鍙傛暟?.铻嶅悎鐜??? item?.铻嶅悎鍙傛暟?.濂戝悎搴?
        if (fusionRate !== undefined) detail.push(`铻嶅悎鐜?{fusionRate}%`);
        label.appendChild(cb); label.appendChild(document.createTextNode(`${itemName} (${detail.join(' / ')})`));
        container.appendChild(label);
        count++;
      }
    });
    if (count === 0) container.innerHTML = `<div style="color: var(--text-dim);">${cfg.requiresMaterials ? '[褰撳墠鑳屽寘鏃犲彲鐢ㄦ潗鏂橾' : '[褰撳墠妯″紡鏉愭枡鍙€変负绌篯'}</div>`;
  }

  autoGenerateTargetName() {
    const cfg = PROFESSION_CONFIG[this.activeMode];
    const materials = this.getSelectedMaterialNames();
    const tier = Number(this.$('#prof-tier').value || 1);
    const tierLabel = this.activeMode === 'forge' ? this.getForgeTierLabel(tier) : this.getTierDisplayName(this.activeMode, tier);
    if (materials.length === 0) return;

    const rawNames = materials.map(name => name.replace(/鐧鹃敾|鍗冮敾|鐏甸敾|榄傞敾|澶╅敾|鏋佸搧路/g, '').trim());
    let baseName = '';

    if (this.activeMode === 'forge') {
      if (rawNames.length === 1) baseName = rawNames[0];
      else if (rawNames.length === 2 && rawNames.some(m => m.includes('娌夐摱')) && rawNames.some(m => m.includes('榄旈摱'))) baseName = '鐜夐摱';
      else if (rawNames.length === 2) baseName = `${rawNames.join('')}鍚堥噾`;
      else baseName = `${rawNames.length}绯昏瀺閿诲悎閲慲;
      this.$('#prof-target').value = `${tierLabel}${baseName}`;
      return;
    }
    if (this.activeMode === 'manufacture') {
      this.$('#prof-target').value = this.getManufactureOutputMeta(this.$('#prof-target').value.trim() || rawNames[0] || '鏍囧噯鍒朵欢', materials, tier).name;
      return;
    }
    if (this.activeMode === 'design') {
      this.$('#prof-target').value = this.getDesignOutputName(this.$('#prof-target').value.trim() || rawNames[0] || `${tierLabel}`, tier, materials);
      return;
    }
    if (this.activeMode === 'repair' && !this.$('#prof-target').value.trim()) {
      this.$('#prof-target').value = materials[0];
    }
  }

  getForgeFusionRate(runtime, materialNames) {
    if (materialNames.length <= 1) {
      const single = this.currentInventory[materialNames[0]];
      return Number(single?.铻嶅悎鍙傛暟?.铻嶅悎鐜??? single?.铻嶅悎鍙傛暟?.濂戝悎搴??? 100);
    }
    const rand = Math.floor(Math.random() * 13);
    const base = 20 + Math.floor(runtime.limitSuccessRate * 0.8) + Math.floor(runtime.expRatio * 10);
    const penalty = Math.max(0, materialNames.length - 2) * 6;
    return this.clamp(base + rand - penalty, 20, 100);
  }

  getForgeMaxQ(tier, materialCount) {
    let maxQ = 1.2;
    if (materialCount >= tier) maxQ = 1.5;
    if (materialCount > tier) maxQ = 1.8;
    if (tier === 5 && materialCount >= 7) maxQ = 2.0;
    return maxQ;
  }

  validateForgeRules(runtime, tier, materialNames, targetName, options = {}) {
    if (!targetName.trim()) return '璇峰厛濉啓鐩爣浜х墿鍚嶇О銆?;
    if (materialNames.length === 0) return '閿婚€犺嚦灏戦渶瑕侀€夋嫨涓€绉嶆潗鏂欍€?;
    if (tier === 5 && !options.isCommission && !['鐏靛煙澧?, '绁炲厓澧?].includes(this.charData.灞炴€?.绮剧澧冪晫 || '')) return '澶╅敾闇€瑕佺簿绁炲姏杈惧埌銆愮伒鍩熷銆戙€?;
    if (materialNames.length === 1) {
      if (runtime.lv < this.getForgeUnlockLevel(tier)) return `${this.getForgeTierLabel(tier)}鍗曢噾灞為敾閫犲皻鏈В閿侊紝闇€瑕?Lv.${this.getForgeUnlockLevel(tier)} 閿婚€犲笀銆俙;
      const mTier = this.getItemTier(materialNames[0]);
      const mItem = this.currentInventory[materialNames[0]];
      if (Boolean((mItem?.铻嶅悎鍙傛暟?.鏁伴噺 || 0) > 1 || /鍚堥噾|鐜夐摱/.test(materialNames[0])) && tier > mTier && !(mTier === 4 && tier === 5)) return '铻嶉敾鍚堥噾瀹氬瀷鍚庢棤娉曞父瑙勫崌闃讹紱浠呭厑璁搞€愰瓊閿诲悎閲?鈫?澶╅敾銆戠壒渚嬨€?;
      return null;
    }
    const fusionUnlockLv = this.getForgeFusionUnlockLevel(tier);
    if (runtime.lv < fusionUnlockLv) return `${this.getForgeTierLabel(tier)}铻嶉敾灏氭湭瑙ｉ攣锛岄渶瑕?Lv.${fusionUnlockLv} 閿婚€犲笀銆俙;
    if (materialNames.length > runtime.maxFusion) return `褰撳墠閿婚€犲笀鏈€澶氬彧鑳藉鐞?${runtime.maxFusion} 绉嶉噾灞炪€俙;
    for (const mName of materialNames) {
      if (this.getItemTier(mName) !== tier) return `铻嶉敾瑕佹眰鏉愭枡闃朵綅涓庣洰鏍囧畬鍏ㄤ竴鑷达細褰撳墠鐩爣 ${this.getForgeTierLabel(tier)}锛屾潗鏂欍€?{mName}銆戞槸 ${this.getForgeTierLabel(this.getItemTier(mName))}銆俙;
      if (tier === 2 && Number(this.currentInventory[mName]?.鍝佽川绯绘暟 || 1) < 1.15) return `鍗冮敾铻嶉敾瑕佹眰鎵€鏈夋潗鏂欒揪鍒扳€滀竴鍝佲€?鍝佽川绯绘暟鈮?.15)銆俙;
    }
    return null;
  }

  validateGenericRules(cfg, runtime, tier, materialNames, targetName) {
    if (!targetName.trim()) return '璇峰厛濉啓鐩爣浜х墿/瀵硅薄鍚嶇О銆?;
    const uLv = this.getForgeUnlockLevel(tier);
    if (runtime.lv < uLv) return `${this.getTierDisplayName(cfg.mode, tier)}灏氭湭瑙ｉ攣锛岄渶瑕?Lv.${uLv} ${cfg.jobName}銆俙;
    if (cfg.requiresMaterials && materialNames.length === 0) return `${cfg.displayName}鑷冲皯闇€瑕侀€夋嫨涓€绉嶆潗鏂欍€俙;
    if (materialNames.length > runtime.maxFusion) return `鏈€澶氬崗鍚?${runtime.maxFusion} 绉嶆潗鏂欍€俙;
    if (cfg.mode === 'manufacture') {
      if (/鏂楅摖|鏈虹敳/.test(targetName) && !this.hasBlueprintMaterial(materialNames)) return '鍒堕€犳枟閾?鏈虹敳鑷冲皯闇€瑕佸搴旇璁″浘鎴栬摑鍥俱€?;
      const armorTier = this.getArmorTierFromName(targetName);
      if (armorTier && armorTier !== tier) return `鐩爣銆?{targetName}銆戝睘 ${this.getTierDisplayName(cfg.mode, armorTier)}锛岄樁浣嶄笉鍖归厤銆俙;
      const recipe = this.getManufactureRecipe(targetName, materialNames, tier, 1);
      if (/鏂楅摖/.test(targetName) && !materialNames.includes(this.getArmorBlueprintNameByTier(tier))) return `闇€瑕佸搴旂殑銆?{this.getArmorBlueprintNameByTier(tier)}銆戙€俙;
      if (recipe?.mode === 'armor') {
        const armorMaterials = materialNames.filter(name => name !== recipe.blueprint);
        if (armorMaterials.length === 0) return `鍒堕€犮€?{targetName}銆戣嚦灏戦渶瑕佸嬀閫夊搴斾綅闃剁殑閲戝睘鏉愭枡銆俙;
        const wrongArmorMaterial = armorMaterials.find(name => this.getItemTier(name) !== tier);
        if (wrongArmorMaterial) return `褰撳墠鏂楅摖鍒堕€犺姹備娇鐢?{this.getTierMetalLabel(tier)}锛屾潗鏂欍€?{wrongArmorMaterial}銆戦樁浣嶄笉鍖归厤銆俙;
      }
      if (recipe?.mode === 'mech') {
        if (tier !== recipe.expectedTier) return `鍥哄畾闃朵綅搴斾负 ${this.getTierDisplayName(cfg.mode, recipe.expectedTier)}銆俙;
        const stocks = this.getSelectedTierStock(materialNames);
        for (const tierKey in recipe.fixedTierNeeds) {
          if (Number(stocks[tierKey] || 0) < Number(recipe.fixedTierNeeds[tierKey])) return `鍒堕€犳潗鏂欎笉瓒筹細缂哄皯${this.getTierMetalLabel(Number(tierKey))}銆俙;
        }
      }
    }
    if (cfg.mode === 'design') {
      if (!/璁捐鍥緗钃濆浘/.test(targetName)) return '鐩爣鍚嶇О搴斿寘鍚€滆璁″浘鈥濇垨鈥滆摑鍥锯€濄€?;
      if (/鏂楅摖/.test(targetName) && tier < 2) return '鏂楅摖璁捐鍥捐嚦灏?2 闃躲€?;
      const armorTier = this.getArmorTierFromName(targetName);
      if (armorTier && armorTier !== tier) return `鐩爣闃朵綅涓嶅尮閰嶃€俙;
    }
    if (cfg.mode === 'repair') {
      if (targetName.trim() && !this.currentInventory[targetName.trim()]) return '淇幇瀛樼墿鍝佸繀椤诲湪鑳屽寘涓€?;
      const req = this.getRepairRequirement(targetName.trim());
      if (materialNames.length === 0) return `鑷冲皯闇€瑕併€?{req.required}銆戙€俙;
      if (!this.getRepairRequirementSatisfied(materialNames, req)) return `褰撳墠鎹熶激涓恒€?{req.label}銆戯紝鑷冲皯闇€瑕併€?{req.required}銆戙€俙;
    }
    return null;
  }

  updatePreview() {
    const cfg = PROFESSION_CONFIG[this.activeMode];
    const runtime = this.getJobRuntime(cfg.jobName);
    const tier = Number(this.$('#prof-tier').value || 1);
    const qty = Math.max(1, Number(this.$('#prof-cost').value || 1));
    const targetName = String(this.$('#prof-target').value || '').trim();
    const materialNames = this.getSelectedMaterialNames();
    const costs = this.getProfessionCost(cfg.jobName, tier, qty);
    const commissionCtx = this.getCommissionContext(cfg, runtime, tier, materialNames, targetName);
    const effectiveRuntime = commissionCtx.validationRuntime || runtime;
    const enoughResources = commissionCtx.isCommission ? commissionCtx.hasEnoughFunds : this.hasEnoughResources(costs);

    let ruleError = commissionCtx.error || null;
    let rateText = '-', fusionText = '-', maxQText = '-', noteText = '-';
    let costText = commissionCtx.isCommission ? `<span class="val-cyan">濮旀墭妯″紡涓嶆墸鑱屼笟璧勬簮</span>` : this.formatResourceCost(costs);
    let feeText = commissionCtx.isCommission ? (commissionCtx.commissionFee > 0 ? `<span class="val-highlight">${this.formatFedCoin(commissionCtx.commissionFee)}</span>` : `<span class="val-green">鍏嶅崟</span>`) : `<span class="val-cyan">鏃?/span>`;

    if (this.activeMode === 'forge') {
      if (!ruleError) ruleError = this.validateForgeRules(effectiveRuntime, tier, materialNames, targetName, { isCommission: commissionCtx.isCommission });
      if (!ruleError) {
        const efc = Math.max(commissionCtx.fusionCount || 1, materialNames.length || 1);
        const isFusion = efc > 1;
        const rate = commissionCtx.isCommission ? Number(commissionCtx.successRate || 0) : (isFusion ? this.getForgeFusionSuccessRate(runtime, efc, !!this.charData.鍔熸硶?.['鏆楀櫒鐧捐В']) : this.getSingleTierSuccessRate(tier, runtime));
        const dfr = isFusion ? Number(commissionCtx.fusionSync || (materialNames.length > 1 ? this.getForgeFusionRate(effectiveRuntime, materialNames) : 100)) : Number(this.currentInventory[materialNames[0]]?.铻嶅悎鍙傛暟?.铻嶅悎鐜??? this.currentInventory[materialNames[0]]?.铻嶅悎鍙傛暟?.濂戝悎搴??? 100);
        rateText = `<span class="val-highlight">${rate}%</span>`;
        fusionText = isFusion ? `<span class="val-cyan">${efc}绾у鍚?/ 铻嶅悎鐜?{dfr}%</span>` : `<span class="val-cyan">鍗曢噾灞?/ 铻嶅悎鐜?{dfr}%</span>`;
        maxQText = `<span class="val-highlight">${this.getForgeMaxQ(tier, efc).toFixed(1)}</span>`;
        noteText = commissionCtx.isCommission ? commissionCtx.note : (isFusion ? `铻嶉敾璧板叕寮忔垚鍔熺巼锛涘綋鍓嶆渶澶у彲澶勭悊 ${effectiveRuntime.maxFusion} 绉嶉噾灞炪€俙 : `鍗曢噾灞炴垚鍔熺巼鎸夌瓑绾ц〃 + 缁忛獙鍖洪棿璁＄畻銆俙);
      }
    } else {
      if (!ruleError) ruleError = this.validateGenericRules(cfg, effectiveRuntime, tier, materialNames, targetName);
      if (!ruleError) {
        const efc = Math.max(materialNames.length || 0, commissionCtx.fusionCount || 1);
        const isComp = efc > 1;
        const rate = commissionCtx.isCommission ? Number(commissionCtx.successRate || 0) : (isComp ? this.getGenericCompositeRate(runtime, efc) : this.getGenericSingleRate(runtime));
        rateText = `<span class="val-highlight">${rate}%</span>`;
        fusionText = isComp ? `<span class="val-cyan">澶嶅悎宸ュ簭 ${efc} 鏉?/span>` : `<span class="val-cyan">鍗曞伐搴?/span>`;
        maxQText = `<span class="val-highlight">${(isComp ? 1.25 : 1.15).toFixed(2)}</span>`;
        noteText = commissionCtx.isCommission ? commissionCtx.note : (isComp ? `${cfg.displayName}鐨勫鏉愭枡鍗忓悓鎴愬姛鐜囨寜鑱屼笟鍏紡鎺ㄥ銆俙 : `${cfg.displayName}鍗曞伐搴忔垚鍔熺巼鐩存帴璇诲彇褰撳墠鑱屼笟鐔熺粌搴︺€俙);
        if (cfg.mode === 'manufacture') {
          const recipe = this.getManufactureRecipe(targetName, materialNames, tier, qty);
          if (recipe?.mode === 'mech' || recipe?.mode === 'armor') noteText = recipe.note;
        }
        if (cfg.mode === 'repair') {
          const req = this.getRepairRequirement(targetName);
          noteText = isComp ? `鐩爣鍒ゅ畾锛?{req.label} / 宸查€?{materialNames.length}绉嶄慨鐞嗚€楁潗 / 瑕佹眰锛?{req.required}` : `鐩爣鍒ゅ畾锛?{req.label} / 瑕佹眰锛?{req.required}`;
        }
      }
    }

    if (!commissionCtx.isCommission && !enoughResources) ruleError = ruleError || '鑱屼笟璧勬簮涓嶈冻銆?;

    this.$('#prof-submit').disabled = Boolean(ruleError);
    this.setPreviewField('prev-job', `<span class="val-cyan">${cfg.jobName} Lv.${effectiveRuntime.lv}</span>${commissionCtx.isCommission ? ` / 鎵ц鑰?${commissionCtx.executorName}` : ''}`);
    this.setPreviewField('prev-exp', commissionCtx.isCommission ? `<span class="val-highlight">${Number(effectiveRuntime.exp || 0).toLocaleString()}</span> / 鎵ц鑰呯啛缁冨害` : `<span class="val-highlight">${runtime.exp.toLocaleString()}</span> / 鏈骇杩涘害 <span class="val-cyan">${Math.floor(runtime.expRatio * 100)}%</span>`);
    this.setPreviewField('prev-res', this.formatCurrentResources());
    this.setPreviewField('prev-costs', enoughResources ? costText : `<span class="val-red">${costText}</span>`);
    this.setPreviewField('prev-executor', `<span class="val-cyan">${commissionCtx.executorName}</span>${commissionCtx.isPrivate ? ` / 濂芥劅 ${commissionCtx.relScore}` : (commissionCtx.isOfficial ? ' / 瀹樻柟浠ｅ伐' : ' / 鑷鎿嶄綔')}`);
    this.setPreviewField('prev-fee', feeText);
    this.setPreviewField('prev-rate', ruleError ? `<span class="val-red">-</span>` : rateText);
    this.setPreviewField('prev-fusion', ruleError ? `<span class="val-red">-</span>` : fusionText);
    this.setPreviewField('prev-maxfusion', `<span class="val-highlight">${effectiveRuntime.maxFusion}</span>`);
    this.setPreviewField('prev-maxq', ruleError ? `<span class="val-red">-</span>` : maxQText);
    this.setPreviewField('prev-note', ruleError ? `<span class="val-red">${ruleError}</span>` : noteText);
  }

  // --- 鎻愪氦鎿嶄綔鐩稿叧琛ヤ竵鐢熸垚 --- 
  buildResourcePatches(costs) {
    return [
      { op: 'replace', path: `${this.activeCharBasePath}/灞炴€?vit`, value: Math.max(0, Number(this.charData.灞炴€?.vit || 0) - costs.vit) },
      { op: 'replace', path: `${this.activeCharBasePath}/灞炴€?sp`, value: Math.max(0, Number(this.charData.灞炴€?.sp || 0) - costs.sp) },
      { op: 'replace', path: `${this.activeCharBasePath}/灞炴€?men`, value: Math.max(0, Number(this.charData.灞炴€?.men || 0) - costs.men) }
    ];
  }
  buildMaterialConsumePatches(materialNames, qty) {
    return materialNames.map(mName => {
      const nextQty = Number(this.currentInventory[mName]?.鏁伴噺 || 0) - qty;
      return nextQty <= 0 
        ? { op: 'remove', path: `${this.activeCharBasePath}/鑳屽寘/${this.escapeJsonPointer(mName)}` } 
        : { op: 'replace', path: `${this.activeCharBasePath}/鑳屽寘/${this.escapeJsonPointer(mName)}/鏁伴噺`, value: nextQty };
    });
  }
  buildConsumePlanPatches(plan) {
    return Object.entries(plan || {}).filter(([_, q]) => Number(q) > 0).map(([name, consumeQty]) => {
      const nextQty = Number(this.currentInventory[name]?.鏁伴噺 || 0) - Number(consumeQty);
      return nextQty <= 0 
        ? { op: 'remove', path: `${this.activeCharBasePath}/鑳屽寘/${this.escapeJsonPointer(name)}` } 
        : { op: 'replace', path: `${this.activeCharBasePath}/鑳屽寘/${this.escapeJsonPointer(name)}/鏁伴噺`, value: nextQty };
    });
  }
  buildInventoryAddPatches(itemName, itemData, amount = 1) {
    if (this.currentInventory[itemName]) {
      return [{ op: 'replace', path: `${this.activeCharBasePath}/鑳屽寘/${this.escapeJsonPointer(itemName)}/鏁伴噺`, value: Number(this.currentInventory[itemName].鏁伴噺 || 0) + amount }];
    }
    return [{ op: 'replace', path: `${this.activeCharBasePath}/鑳屽寘/${this.escapeJsonPointer(itemName)}`, value: Object.assign({}, itemData, { 鏁伴噺: amount }) }];
  }
  buildJobProgressPatches(jobName, expGain) {
    const runtime = this.getJobRuntime(jobName);
    const nextExp = runtime.exp + expGain;
    const derived = this.deriveJobLimitsFromExp(nextExp);
    return {
      patches: [
        { op: 'replace', path: `${this.activeCharBasePath}/鑱屼笟/${this.escapeJsonPointer(jobName)}/缁忛獙`, value: nextExp },
        { op: 'replace', path: `${this.activeCharBasePath}/鑱屼笟/${this.escapeJsonPointer(jobName)}/绛夌骇`, value: derived.lv },
        { op: 'replace', path: `${this.activeCharBasePath}/鑱屼笟/${this.escapeJsonPointer(jobName)}/闄愬埗/鏈€澶ц瀺鍚堟暟`, value: derived.鏈€澶ц瀺鍚堟暟 },
        { op: 'replace', path: `${this.activeCharBasePath}/鑱屼笟/${this.escapeJsonPointer(jobName)}/闄愬埗/鎴愬姛鐜嘸, value: derived.鎴愬姛鐜?}
      ],
      oldLv: runtime.lv, newLv: derived.lv
    };
  }
  buildSystemResultPatches(resultLog, roll, successRate) {
    return [
      { op: 'replace', path: '/sys/系统播报', value: String(resultLog || '') },
      { op: 'replace', path: '/sys/鏈€杩戞瀹?, value: Number.isFinite(Number(roll)) ? Number(roll) : 0 },
      { op: 'replace', path: '/sys/鏈€缁堟垚鍔熺巼', value: Number.isFinite(Number(successRate)) ? Number(successRate) : 0 }
    ];
  }
  buildProfessionNarrationPrompt(resultLog, sections = []) {
    const safeSections = Array.isArray(sections)
      ? sections.map(section => String(section || '').trim()).filter(Boolean)
      : [];
    return [
      PROF_HIDDEN_ARBITRATION_NARRATION_RULES,
      '[鍓嶇缁撶畻宸插畬鎴怾',
      '鏈鍓亴涓氭秹鍙婄殑璧勬簮鎵ｉ櫎銆佹潗鏂欐秷鑰椼€佷骇鐗╁鍑忋€佽亴涓氳繘搴︿笌绯荤粺鎾姤宸茬粡鍐欏叆 MVU锛屼笉瑕侀噸澶嶆墸璧勬簮锛屼篃涓嶈鍐嶆浠茶鍚屼竴娆″埗浣溿€?,
      String(resultLog || '').trim(),
      ...safeSections,
    ].filter(Boolean).join('\n\n');
  }
  getForgeSingleQuality(tier, runtime) {
    const unlockLv = this.getForgeUnlockLevel(tier);
    let q = 1.0;
    if (tier === 5) q = 1.02 + Math.random() * 0.05;
    else if (runtime.lv === unlockLv) q = 1.0 + runtime.expRatio * 0.10 + Math.random() * 0.03;
    else if (runtime.lv === unlockLv + 1) q = 1.10 + runtime.expRatio * 0.10 + Math.random() * 0.02;
    else q = 1.15 + runtime.expRatio * 0.05 + Math.random() * 0.03;
    return this.clamp(Number(q.toFixed(2)), 0.8, 1.2);
  }
  getForgeFusionQuality(tier, maxQ, fusionRate, roll, isGreatSuccess) {
    const syncBonus = Math.pow(fusionRate / 100, 2);
    if (isGreatSuccess) {
      if (maxQ >= 2.0 && Math.random() * 100 <= 10) return this.clamp(Number((1.8 + 0.2 * syncBonus + Math.random() * 0.05).toFixed(2)), 0.8, maxQ);
      if (maxQ >= 1.8) return this.clamp(Number((1.5 + 0.3 * syncBonus + Math.random() * 0.05).toFixed(2)), 0.8, maxQ);
      if (maxQ >= 1.5) return this.clamp(Number((1.2 + 0.3 * syncBonus + Math.random() * 0.05).toFixed(2)), 0.8, maxQ);
      return 1.2;
    }
    let q = (maxQ >= 1.5 ? 0.95 : 0.90) + (maxQ >= 1.5 ? 0.45 : 0.25) * syncBonus + Math.random() * 0.05;
    return this.clamp(Number(q.toFixed(2)), 0.8, Math.min(maxQ, maxQ > 1.2 ? 1.5 : 1.2));
  }
  getGenericQuality(runtime, tier, isGreatSuccess) {
    const base = runtime.lv >= this.getForgeUnlockLevel(tier) + 1 ? 1.08 : 0.98;
    return this.clamp(Number((base + runtime.expRatio * 0.12 + (isGreatSuccess ? 0.15 : 0) + Math.random() * 0.05).toFixed(2)), 0.8, 1.25);
  }

  submitAction(playerInput, sysPrompt, requestKind, patchOps = []) {
    if (this.options.onAction) {
      this.options.onAction({
        playerInput,
        systemPrompt: sysPrompt,
        requestKind,
        patchOps: Array.isArray(patchOps) ? patchOps : []
      });
    }
  }

  executeProfessionAction() {
    if (this.activeMode === 'forge') this.executeForge();
    else this.executeGenericProfession();
  }

  executeForge() {
    const cfg = PROFESSION_CONFIG.forge;
    const runtime = this.getJobRuntime(cfg.jobName);
    const tier = Number(this.$('#prof-tier').value || 1);
    const qty = Math.max(1, Number(this.$('#prof-cost').value || 1));
    const targetName = String(this.$('#prof-target').value || '').trim();
    const materialNames = this.getSelectedMaterialNames();
    const costs = this.getProfessionCost(cfg.jobName, tier, qty);
    const commissionCtx = this.getCommissionContext(cfg, runtime, tier, materialNames, targetName);
    
    const efc = Math.max(Number(commissionCtx.fusionCount || 1), materialNames.length || 1);
    const isFusion = efc > 1;
    const successRate = commissionCtx.isCommission ? Number(commissionCtx.successRate || 0) : (isFusion ? this.getForgeFusionSuccessRate(runtime, efc, !!this.charData.鍔熸硶?.['鏆楀櫒鐧捐В']) : this.getSingleTierSuccessRate(tier, runtime));
    const fusionRate = isFusion ? Number(commissionCtx.fusionSync || this.getForgeFusionRate(commissionCtx.executorRuntime || runtime, materialNames)) : Number(this.currentInventory[materialNames[0]]?.铻嶅悎鍙傛暟?.铻嶅悎鐜??? 100);
    const maxQ = this.getForgeMaxQ(tier, efc);
    
    const roll = Math.floor(Math.random() * 100) + 1;
    const isGreatSuccess = roll <= 5 && !commissionCtx.isOfficial;
    const isSuccess = isGreatSuccess || roll <= successRate;

    let finalQ = 0, resultLog = '', productName = targetName, expGain = cfg.expGain[tier] || 50;
    if (isSuccess) {
      if (commissionCtx.isOfficial) finalQ = 1.0;
      else if (isFusion) finalQ = this.getForgeFusionQuality(tier, maxQ, fusionRate, roll, isGreatSuccess);
      else finalQ = this.clamp(isGreatSuccess ? 1.2 : this.getForgeSingleQuality(tier, commissionCtx.executorRuntime || runtime), 0.8, 1.2);
      
      if (isGreatSuccess) {
        productName = `鏋佸搧路${targetName}`;
        if (!commissionCtx.isCommission) expGain *= 2;
        resultLog = `[澶ф垚鍔焆 ${commissionCtx.executorName}瑙﹀彂鏋侀檺閿诲帇锛屾垚鍔熸墦閫犲嚭銆?{targetName}銆戙€傚搧璐ㄧ郴鏁?${finalQ.toFixed(2)}銆俙;
      } else {
        const feeMsg = commissionCtx.isCommission ? (commissionCtx.commissionFee > 0 ? ` 宸叉敮浠樹唬宸ヨ垂 ${this.formatFedCoin(commissionCtx.commissionFee)}銆俙 : ' 鏈浠ｅ伐鍥犲ソ鎰熷害浼樻儬鍏嶅崟銆?) : '';
        resultLog = `${commissionCtx.isCommission ? '[濮旀墭鎴愬姛]' : '[鎵撻€犳垚鍔焆'} ${commissionCtx.executorName}鎴愬姛瀹屾垚銆?{targetName}銆戠殑閿婚€狅紝鍝佽川绯绘暟 ${finalQ.toFixed(2)}銆?{feeMsg}`;
      }
    } else {
      resultLog = `${commissionCtx.isCommission ? '[濮旀墭澶辫触]' : '[鎵撻€犲け璐'} ${commissionCtx.executorName}灏濊瘯鎵撻€犮€?{targetName}銆戝け璐ャ€俁oll ${roll} > 鎴愬姛鐜?${successRate}銆俙;
    }

    let patchOps = [];
    if (commissionCtx.isCommission) patchOps.push(...this.buildCommissionFeePatches(commissionCtx.commissionFee));
    else patchOps.push(...this.buildResourcePatches(costs));
    patchOps.push(...this.buildMaterialConsumePatches(materialNames, qty));

    if (isSuccess) {
      const newItem = { 鏁伴噺: 1, 绫诲瀷: '鍓亴涓氫骇鐗?, 鍝佽川: isGreatSuccess ? '鏋佸搧' : '鏍囧噯', 鍝佽川绯绘暟: Number(finalQ.toFixed(2)), 鎻忚堪: `鐢?{commissionCtx.executorName}瀹屾垚鐨?{cfg.jobName}浜х墿` };
      if (isFusion) { newItem.铻嶅悎鍙傛暟 = { 鏁伴噺: efc, 铻嶅悎鐜? Math.floor(fusionRate) }; newItem.鎻忚堪 += ` (${efc}绉嶉噾灞炶瀺閿?`; }
      patchOps.push(...this.buildInventoryAddPatches(productName, newItem, 1));
      if (!commissionCtx.isCommission) {
        const progress = this.buildJobProgressPatches(cfg.jobName, expGain);
        patchOps.push(...progress.patches);
        if (progress.newLv > progress.oldLv) resultLog += `\n\n[鑱屼笟绐佺牬] ${cfg.jobName}绛夌骇鎻愬崌鑷?Lv.${progress.newLv}銆俙;
      }
    }
    patchOps.push(...this.buildSystemResultPatches(resultLog, roll, successRate));

    const materialText = materialNames.map(name => `${qty}浠?{name}`).join('銆?);
    const officialLocationName = this.getOfficialCommissionLocation(cfg.jobName);
    const actionLead = commissionCtx.isOfficial ? `鎴戣鍦?{officialLocationName}鍔炵悊瀹樻柟浠ｅ伐锛屽鎵樺畬鎴愩€?{targetName}銆戠殑${cfg.displayName}` : (commissionCtx.isPrivate ? `鎴戣濮旀墭銆?{commissionCtx.executorName}銆戜唬宸?{cfg.displayName}锛岀洰鏍囨槸銆?{targetName}銆慲 : `鎴戣杩涜${cfg.displayName}锛岀洰鏍囨槸銆?{targetName}銆慲);
    const consumptionText = commissionCtx.isCommission ? `鏈浠ｅ伐璐癸細${this.formatFedCoin(commissionCtx.commissionFee)}銆傛潗鏂欎粛鐢卞鎵樹汉鎻愪緵銆俙 : `鏈娑堣€楋細${this.formatResourceCost(costs)}銆俙;
    const sysPrompt = this.buildProfessionNarrationPrompt(resultLog, [
      `[鎵ц鏉ユ簮]\n鏈鎵ц鑰咃細${commissionCtx.executorName}銆?{commissionCtx.note}`,
      `[鍓亴涓氱被鍨媇\n${cfg.displayName}`,
      `[鍓亴涓氳祫婧愭秷鑰梋\n${consumptionText}`,
      `[缁撶畻鎽樿]\n鐩爣涓恒€?{targetName}銆戯紱鏉愭枡涓猴細${materialText}銆俙
    ]);
    this.submitAction(`${actionLead}锛屾潗鏂欎负锛?{materialText}銆俙, sysPrompt, 'prof_forge', patchOps);
  }

  executeGenericProfession() {
    const cfg = PROFESSION_CONFIG[this.activeMode];
    const runtime = this.getJobRuntime(cfg.jobName);
    const tier = Number(this.$('#prof-tier').value || 1);
    const qty = Math.max(1, Number(this.$('#prof-cost').value || 1));
    const targetName = String(this.$('#prof-target').value || '').trim();
    const materialNames = this.getSelectedMaterialNames();
    const costs = this.getProfessionCost(cfg.jobName, tier, qty);
    const commissionCtx = this.getCommissionContext(cfg, runtime, tier, materialNames, targetName);
    
    const efc = Math.max(materialNames.length || 0, commissionCtx.fusionCount || 1);
    const isComp = efc > 1;
    const successRate = commissionCtx.isCommission ? Number(commissionCtx.successRate || 0) : (isComp ? this.getGenericCompositeRate(runtime, efc) : this.getGenericSingleRate(runtime));
    const roll = Math.floor(Math.random() * 100) + 1;
    const isGreatSuccess = roll <= 5 && !commissionCtx.isOfficial;
    const isSuccess = isGreatSuccess || roll <= successRate;
    const finalQ = isSuccess ? (commissionCtx.isOfficial ? 1.0 : this.getGenericQuality(commissionCtx.executorRuntime || runtime, tier, isGreatSuccess)) : 0;
    let expGain = cfg.expGain[tier] || 50;
    if (isGreatSuccess && !commissionCtx.isCommission) expGain *= 2;

    let patchOps = [];
    if (commissionCtx.isCommission) patchOps.push(...this.buildCommissionFeePatches(commissionCtx.commissionFee));
    else patchOps.push(...this.buildResourcePatches(costs));

    if (this.activeMode === 'manufacture') {
      const recipe = this.getManufactureRecipe(targetName, materialNames, tier, qty);
      if (recipe?.mode === 'mech') {
        patchOps.push(...this.buildConsumePlanPatches(this.buildTierNeedConsumePlan(materialNames, recipe.fixedTierNeeds)));
      } else if (recipe?.mode === 'armor') {
        const armorPlan = {};
        materialNames.filter(n => n !== recipe.blueprint).forEach(n => armorPlan[n] = Number(armorPlan[n] || 0) + qty);
        if (materialNames.includes(recipe.blueprint)) armorPlan[recipe.blueprint] = Number(armorPlan[recipe.blueprint] || 0) + Number(recipe.blueprintCost || 1);
        patchOps.push(...this.buildConsumePlanPatches(armorPlan));
      } else if (materialNames.length > 0) patchOps.push(...this.buildMaterialConsumePatches(materialNames, qty));
    } else if (materialNames.length > 0) patchOps.push(...this.buildMaterialConsumePatches(materialNames, qty));

    let resultLog = '';
    if (isSuccess) {
      if (this.activeMode === 'design') {
        const outputName = this.getDesignOutputName(targetName, tier, materialNames);
        patchOps.push(...this.buildInventoryAddPatches(outputName, { 绫诲瀷: '鍥剧焊', 鍝佽川: this.getTierQualityLabel(cfg.mode, tier), 鍝佽川绯绘暟: finalQ, 鎻忚堪: `鐢?{commissionCtx.executorName}瀹屾垚鐨?{cfg.jobName}缁樺埗` }, 1));
        resultLog = `[${commissionCtx.isCommission ? '濮旀墭鎴愬姛' : cfg.displayName + '鎴愬姛'}] ${commissionCtx.executorName}瀹屾垚浜嗐€?{outputName}銆戠殑璁捐缁樺埗锛屽畬鎴愬害绯绘暟 ${finalQ.toFixed(2)}銆俙;
      } else if (this.activeMode === 'manufacture') {
        const mMeta = this.getManufactureOutputMeta(targetName, materialNames, tier);
        patchOps.push(...this.buildInventoryAddPatches(mMeta.name, { 绫诲瀷: mMeta.type, 鍝佽川: this.getTierQualityLabel(cfg.mode, tier), 鍝佽川绯绘暟: finalQ, 鎻忚堪: `鐢?{commissionCtx.executorName}瀹屾垚鐨?{cfg.jobName}鍒堕€燻 }, 1));
        resultLog = `[${commissionCtx.isCommission ? '濮旀墭鎴愬姛' : cfg.displayName + '鎴愬姛'}] ${commissionCtx.executorName}瀹屾垚浜嗐€?{mMeta.name}銆戠殑鍒堕€狅紝瀹屾垚搴︾郴鏁?${finalQ.toFixed(2)}銆俙;
      } else if (this.activeMode === 'repair') {
        const existing = this.currentInventory[targetName];
        const repairDesc = this.getRepairDescriptor(materialNames);
        const nextItem = Object.assign({}, existing, { 鎻忚堪: `${existing?.鎻忚堪 ? existing.鎻忚堪 + ' | ' : ''}${repairDesc.desc}`, 鐘舵€? repairDesc.status });
        if ('鑰愪箙' in (existing || {})) nextItem.鑰愪箙 = 100;
        if ('瀹屾暣搴? in (existing || {})) nextItem.瀹屾暣搴?= 100;
        if (!('鑰愪箙' in (existing || {})) && !('瀹屾暣搴? in (existing || {}))) nextItem.瀹屾暣搴?= 100;
        patchOps.push({ op: 'replace', path: `${this.activeCharBasePath}/鑳屽寘/${this.escapeJsonPointer(targetName)}`, value: nextItem });
        resultLog = `[${commissionCtx.isCommission ? '濮旀墭鎴愬姛' : cfg.displayName + '鎴愬姛'}] ${commissionCtx.executorName}瀹屾垚浜嗗銆?{targetName}銆戠殑鏁村淇悊銆傚綋鍓嶇姸鎬侊細${repairDesc.status}銆俙;
      }
      if (!commissionCtx.isCommission) {
        const progress = this.buildJobProgressPatches(cfg.jobName, expGain);
        patchOps.push(...progress.patches);
        if (progress.newLv > progress.oldLv) resultLog += `\n\n[鑱屼笟绐佺牬] ${cfg.jobName}绛夌骇鎻愬崌鑷?Lv.${progress.newLv}銆俙;
      }
      if (isGreatSuccess) resultLog = `[澶ф垚鍔焆 ${commissionCtx.executorName}浠ユ瀬楂樺畬鎴愬害瀹屾垚浜嗐€?{targetName}銆戠殑${cfg.displayName}鎿嶄綔锛屽搧璐ㄧ郴鏁?${finalQ.toFixed(2)}銆俙;
      else if (commissionCtx.isCommission) resultLog += (commissionCtx.commissionFee > 0 ? ` 宸叉敮浠樹唬宸ヨ垂 ${this.formatFedCoin(commissionCtx.commissionFee)}銆俙 : ' 鏈浠ｅ伐鍥犲ソ鎰熷害浼樻儬鍏嶅崟銆?);
    } else {
      resultLog = `[${commissionCtx.isCommission ? '濮旀墭澶辫触' : cfg.displayName + '澶辫触'}] ${commissionCtx.executorName}灏濊瘯澶勭悊銆?{targetName}銆戝け璐ャ€俁oll ${roll} > 鎴愬姛鐜?${successRate}銆俙;
    }

    patchOps.push(...this.buildSystemResultPatches(resultLog, roll, successRate));

    const materialText = materialNames.length > 0 ? materialNames.map(name => `${qty}浠?{name}`).join('銆?) : '鏃犳樉寮忔潗鏂?;
    const officialLocationName = this.getOfficialCommissionLocation(cfg.jobName);
    const actionLead = commissionCtx.isOfficial ? `鎴戣鍦?{officialLocationName}鍔炵悊瀹樻柟浠ｅ伐锛屽鎵樻墽琛?{cfg.displayName}锛岀洰鏍囨槸銆?{targetName}銆慲 : (commissionCtx.isPrivate ? `鎴戣濮旀墭銆?{commissionCtx.executorName}銆戜唬宸?{cfg.displayName}锛岀洰鏍囨槸銆?{targetName}銆慲 : `鎴戣杩涜${cfg.displayName}锛岀洰鏍囨槸銆?{targetName}銆慲);
    const consumptionText = commissionCtx.isCommission ? `鏈浠ｅ伐璐癸細${this.formatFedCoin(commissionCtx.commissionFee)}銆傛潗鏂欎笌鐩爣鐗╀粛鐢卞鎵樹汉鎻愪緵銆俙 : `鏈娑堣€楋細${this.formatResourceCost(costs)}銆俙;
    const sysPrompt = this.buildProfessionNarrationPrompt(resultLog, [
      `[鎵ц鏉ユ簮]\n鏈鎵ц鑰咃細${commissionCtx.executorName}銆?{commissionCtx.note}`,
      `[鍓亴涓氱被鍨媇\n${cfg.displayName}`,
      `[鍓亴涓氳祫婧愭秷鑰梋\n${consumptionText}`,
      `[缁撶畻鎽樿]\n鐩爣涓恒€?{targetName}銆戯紱鏉愭枡锛?{materialText}銆俙
    ]);
    this.submitAction(`${actionLead}锛屾潗鏂欙細${materialText}銆俙, sysPrompt, `prof_${cfg.mode}`, patchOps);
  }
}

window.mountProfessionUI = function(containerElement, snapshot, options = {}) {
  return new ProfessionUIComponent(containerElement, snapshot, options);
};

