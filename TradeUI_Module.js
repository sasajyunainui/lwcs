/* TradeUI_Module.js - 浜ゆ槗缃戠粶缁勪欢 (JS 妯″潡鐗? */

const TradeStyles = `
  /* 灞€閮ㄩ殧绂伙細纭繚鎵€鏈夋牱寮忓彧鍦?.trade-module-scope 涓嬬敓鏁?*/
  .trade-module-scope {
    --panel: rgba(18, 56, 69, 0.20);
    --panel-strong: rgba(23, 68, 84, 0.26);
    --line: rgba(150, 217, 228, 0.22);
    --line-soft: rgba(150, 217, 228, 0.10);
    --cyan: #8de1ef;
    --cyan-soft: rgba(141, 225, 239, 0.14);
    --gold: #d7c070;
    --gold-soft: rgba(228, 201, 111, 0.14);
    --red: #ff8aa2;
    --white: #f5fcff;
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
  }

  .trade-module-scope .trade-tabs {
    display: flex;
    background: var(--panel-strong);
    border-bottom: 1px solid var(--line-soft);
    margin-bottom: 15px;
    border-radius: 4px;
    overflow: hidden;
  }

  .trade-module-scope .trade-tab {
    flex: 1;
    text-align: center;
    padding: 10px 0;
    font-size: 12px;
    color: var(--text-dim);
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
    font-family: var(--font-cjk);
    font-weight: bold;
  }

  .trade-module-scope .trade-tab.active {
    color: var(--gold);
    background: rgba(228, 201, 111, 0.1);
    border-bottom: 2px solid var(--gold);
  }

  .trade-module-scope .trade-body {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .trade-module-scope .trade-body::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }

  .trade-module-scope .tab-content {
    display: none;
  }
  .trade-module-scope .tab-content.active {
    display: block;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .trade-module-scope .form-group {
    margin-bottom: 15px;
  }

  .trade-module-scope .form-group.is-context-locked {
    display: none;
  }

  .trade-module-scope .form-group label {
    display: block;
    font-size: 11px;
    color: var(--gold);
    margin-bottom: 6px;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .trade-module-scope .tech-select, .trade-module-scope .tech-input {
    width: 100%;
    background: var(--panel-strong);
    border: 1px solid var(--line-soft);
    color: var(--cyan);
    padding: 8px 10px;
    border-radius: 4px;
    font-family: var(--font-cjk);
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }
  .trade-module-scope .tech-select option { background: #1a2a32; color: var(--text); }
  .trade-module-scope .tech-select:focus, .trade-module-scope .tech-input:focus { border-color: var(--gold); }

  .trade-module-scope .info-panel {
    background: rgba(0,0,0,0.3);
    border: 1px dashed var(--line-soft);
    border-radius: 4px;
    padding: 12px;
    margin-top: 15px;
    font-size: 12px;
    color: var(--text-sub);
    line-height: 1.6;
  }

  .trade-module-scope .info-row {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding: 4px 0;
  }
  .trade-module-scope .info-row:last-child { border-bottom: none; }
  .trade-module-scope .val-highlight { color: var(--cyan); font-family: var(--font-tech); font-weight: bold; }
  .trade-module-scope .val-warn { color: var(--red); font-family: var(--font-tech); font-weight: bold; }

  .trade-module-scope .action-btn {
    width: 100%;
    margin-top: 20px;
    background: linear-gradient(90deg, rgba(228,201,111,0.1), rgba(228,201,111,0.3));
    border: 1px solid var(--gold);
    color: var(--gold);
    padding: 12px;
    border-radius: 4px;
    font-family: var(--font-tech);
    font-weight: 700;
    letter-spacing: 2px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
  }
  .trade-module-scope .action-btn:hover:not(:disabled) {
    background: var(--gold);
    color: #000;
    box-shadow: 0 0 10px var(--gold);
  }
  .trade-module-scope .action-btn:disabled {
    background: rgba(255,255,255,0.05);
    border-color: var(--line-soft);
    color: var(--text-dim);
    cursor: not-allowed;
    box-shadow: none;
  }

  .trade-module-scope .wealth-display {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--text-dim);
    margin-bottom: 15px;
    padding: 12px;
    background: rgba(0,0,0,0.2);
    border-radius: 4px;
    border: 1px solid var(--line-soft);
  }
  .trade-module-scope .wealth-amt { color: var(--gold); font-family: var(--font-tech); }
`;

const TradeTemplate = `
<div class="trade-module-scope">
  <div class="wealth-display">
    <span>鍦扮偣锛?span class="val-highlight" id="ui-loc">鏈煡</span></span>
    <span>鑱旈偊甯侊細<span class="wealth-amt" id="ui-fedcoin">0</span></span>
    <span>澹版湜锛?span class="wealth-amt" id="ui-fame">0</span></span>
  </div>

  <div class="trade-tabs">
    <div class="trade-tab active" data-target="tab-shop">鍟嗗簵閲囪喘</div>
    <div class="trade-tab" data-target="tab-sell">璧勪骇鍑哄敭</div>
    <div class="trade-tab" data-target="tab-private">绉佷笅浜ゆ槗</div>
    <div class="trade-tab" data-target="tab-auction">鎷嶅崠琛?/div>
  </div>

  <div class="trade-body">
    <!-- 鍟嗗簵閲囪喘 -->
    <div id="tab-shop" class="tab-content active">
      <div class="form-group">
        <label>閫夋嫨鍟嗗簵</label>
        <select id="shop-store-sel" class="tech-select"></select>
      </div>
      <div class="form-group">
        <label>鍟嗗搧鍒楄〃</label>
        <select id="shop-item-sel" class="tech-select"></select>
      </div>
      <div class="form-group">
        <label>璐拱鏁伴噺</label>
        <input type="number" id="shop-qty" class="tech-input" value="1" min="1">
      </div>
      <div class="info-panel">
        <div class="info-row"><span>鍗曚环:</span><span class="val-highlight" id="shop-price">-</span></div>
        <div class="info-row"><span>鎬昏:</span><span class="val-highlight" id="shop-total">-</span></div>
        <div class="info-row"><span>闇€姹傚０鏈?</span><span class="val-highlight" id="shop-fame">-</span></div>
        <div class="info-row"><span>褰撳墠搴撳瓨:</span><span class="val-highlight" id="shop-stock">-</span></div>
        <div class="info-row"><span>瑙﹀彂鏂瑰紡:</span><span class="val-highlight" id="shop-trigger">-</span></div>
        <div class="info-row"><span>鏈夋晥鏈熻嚦:</span><span class="val-highlight" id="shop-expiry">-</span></div>
        <div class="info-row"><span>鏉ユ簮:</span><span class="val-highlight" id="shop-source">-</span></div>
        <div class="info-row"><span>鐗╁搧璇存槑:</span><span class="val-highlight" style="white-space: normal; text-align: right;" id="shop-desc">-</span></div>
      </div>
      <button class="action-btn" id="btn-buy">纭璐拱</button>
    </div>

    <!-- 璧勪骇鍑哄敭 -->
    <div id="tab-sell" class="tab-content">
      <div class="form-group">
        <label>鑳屽寘鐗╁搧</label>
        <select id="sell-item-sel" class="tech-select"></select>
      </div>
      <div class="form-group">
        <label>鍑哄敭鏁伴噺</label>
        <input type="number" id="sell-qty" class="tech-input" value="1" min="1">
      </div>
      <div class="info-panel">
        <div class="info-row"><span>绯荤粺浼板€?鍗曚环):</span><span class="val-highlight" id="sell-base-price">-</span></div>
        <div class="info-row"><span>鍑哄敭鎬绘敹鐩?</span><span class="val-highlight" id="sell-total">-</span></div>
        <div class="info-row"><span>瑙﹀彂鏂瑰紡:</span><span class="val-highlight" id="sell-trigger">-</span></div>
        <div class="info-row"><span>鏈夋晥鏈熻嚦:</span><span class="val-highlight" id="sell-expiry">-</span></div>
        <div class="info-row"><span>鏉ユ簮:</span><span class="val-highlight" id="sell-source">-</span></div>
        <div class="info-row"><span>鐗╁搧璇存槑:</span><span class="val-highlight" style="white-space: normal; text-align: right;" id="sell-desc">-</span></div>
      </div>
      <button class="action-btn" id="btn-sell">纭鍑哄敭</button>
    </div>

    <!-- 绉佷笅浜ゆ槗 -->
    <div id="tab-private" class="tab-content">
      <div class="form-group">
        <label>浜ゆ槗绫诲瀷</label>
        <select id="priv-action" class="tech-select">
          <option value="绉佷笅涔板叆">绉佷笅涔板叆 (鍚慛PC姹傝喘)</option>
          <option value="绉佷笅鍗栧嚭">绉佷笅鍗栧嚭 (鍚慛PC鎺ㄩ攢)</option>
        </select>
      </div>
      <div class="form-group">
        <label>浜ゆ槗瀵硅薄</label>
        <input type="text" id="priv-npc" class="tech-input" placeholder="杈撳叆NPC鍚嶅瓧">
      </div>
      <div class="form-group">
        <label>鐗╁搧鍚嶇О</label>
        <input type="text" id="priv-item" class="tech-input" placeholder="杈撳叆鐗╁搧鍏ㄥ悕">
      </div>
      <div class="form-group">
        <label>鏁伴噺</label>
        <input type="number" id="priv-qty" class="tech-input" value="1" min="1">
      </div>
      <div class="form-group">
        <label>浣犵殑鍑轰环 / 鍗曚环</label>
        <input type="number" id="priv-price" class="tech-input" value="1000" min="1">
      </div>
      <div class="info-panel">
        <div class="info-row"><span>绯荤粺浼板€?鍙傝€?:</span><span class="val-highlight" id="priv-base-price">-</span></div>
        <div class="info-row"><span>鎬婚噾棰?</span><span class="val-highlight" id="priv-total">-</span></div>
        <div class="info-row"><span>NPC鎬佸害棰勬祴:</span><span id="priv-attitude">-</span></div>
        <div class="info-row"><span>瑙﹀彂鏂瑰紡:</span><span class="val-highlight" id="priv-trigger">-</span></div>
        <div class="info-row"><span>鏈夋晥鏈熻嚦:</span><span class="val-highlight" id="priv-expiry">-</span></div>
        <div class="info-row"><span>鏉ユ簮:</span><span class="val-highlight" id="priv-source">-</span></div>
        <div class="info-row"><span>鐗╁搧璇存槑:</span><span class="val-highlight" style="white-space: normal; text-align: right;" id="priv-desc">-</span></div>
      </div>
      <button class="action-btn" id="btn-private">鎵ц浜ゆ槗</button>
    </div>

    <!-- 鎷嶅崠琛?-->
    <div id="tab-auction" class="tab-content">
      <div class="form-group">
        <label>褰撳墠鎷嶅搧</label>
        <select id="auc-item-sel" class="tech-select"></select>
      </div>
      <div class="form-group">
        <label>绔炴媿鍑轰环</label>
        <input type="number" id="auc-bid" class="tech-input" value="0" min="1">
      </div>
      <div class="info-panel">
        <div class="info-row"><span>褰撳墠璧锋媿/鏈€楂樹环:</span><span class="val-highlight" id="auc-current-price">-</span></div>
        <div class="info-row"><span>鎷嶅搧鎻忚堪:</span><span class="val-highlight" style="white-space: normal; text-align: right;" id="auc-desc">-</span></div>
      </div>
      <button class="action-btn" id="btn-auc">鍙備笌绔炴媿</button>
    </div>
  </div>
</div>
`;

const HIDDEN_ARBITRATION_NARRATION_RULES = `
[鍓嶇浠茶鍣ㄨ鏄嶿
浠ヤ笅鍐呭灞炰簬闅愯棌浠茶缁撴灉锛屼笉瑕佸湪姝ｆ枃涓洿鎺ュ杩扳€滄垚鍔熺巼 / Roll / 浠茶缁撴潫 / JSONPatch / 绯荤粺鍒嗘瀽鈥濈瓑瀛楁牱銆?
璇峰皢浠茶缁撹杞啓鎴愯嚜鐒跺墽鎯咃紝鍙弿鍐欎氦鏄撳姩浣溿€佽浠疯繕浠枫€佺珵鎷嶈繃绋嬨€佺墿璧勬祦杞笌瑙掕壊鍙嶅簲銆?
鐜╁搴斿綋鐪嬪埌鐨勬槸缁忚繃淇グ鍚庣殑鍓ф儏鏂囨湰锛岃€屼笉鏄郴缁熻瀹氭棩蹇椼€?
`.trim();

class TradeUIComponent {
  constructor(container, snapshot, options = {}) {
    this.container = container;
    this.snapshot = snapshot;
    this.options = options;

    this.initDOM();
    this.bindEvents();
    this.syncData();
    this.applyInitialContext();
  }

  initDOM() {
    if (!document.getElementById('trade-ui-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'trade-ui-styles';
      styleEl.textContent = TradeStyles;
      document.head.appendChild(styleEl);
    }
    this.container.innerHTML = TradeTemplate;
  }

  $(selector) {
    return this.container.querySelector(selector);
  }

  $$ (selector) {
    return this.container.querySelectorAll(selector);
  }

  setActiveTab(targetId, shouldSync = true) {
    const safeTarget = String(targetId || '').trim();
    if (!safeTarget || !this.$(`#${safeTarget}`)) return false;
    this.$$('.trade-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.target === safeTarget);
    });
    this.$$('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === safeTarget);
    });
    if (shouldSync) this.syncData();
    return true;
  }

  getCurrentUiState() {
    return {
      activeTab: this.container.querySelector('.trade-tab.active')?.dataset.target || 'tab-shop',
      shopStore: this.$('#shop-store-sel')?.value || '',
      shopItem: this.$('#shop-item-sel')?.value || '',
      shopQty: this.$('#shop-qty')?.value || '1',
      sellItem: this.$('#sell-item-sel')?.value || '',
      sellQty: this.$('#sell-qty')?.value || '1',
      privAction: this.$('#priv-action')?.value || '绉佷笅涔板叆',
      privNpc: this.$('#priv-npc')?.value || '',
      privItem: this.$('#priv-item')?.value || '',
      privQty: this.$('#priv-qty')?.value || '1',
      privPrice: this.$('#priv-price')?.value || '1000',
      aucItem: this.$('#auc-item-sel')?.value || '',
      aucBid: this.$('#auc-bid')?.value || '0'
    };
  }

  setSelectIfExists(selector, value) {
    const el = this.$(selector);
    if (!el) return;
    const hasValue = Array.from(el.options || []).some(opt => opt.value === value);
    if (hasValue) el.value = value;
  }

  restoreUiState(state = {}) {
    this.setSelectIfExists('#shop-store-sel', state.shopStore);
    this.updateShopItems();
    this.setSelectIfExists('#shop-item-sel', state.shopItem);
    if (this.$('#shop-qty')) this.$('#shop-qty').value = state.shopQty || '1';

    this.setSelectIfExists('#sell-item-sel', state.sellItem);
    if (this.$('#sell-qty')) this.$('#sell-qty').value = state.sellQty || '1';

    if (this.$('#priv-action')) this.$('#priv-action').value = state.privAction || '绉佷笅涔板叆';
    if (this.$('#priv-npc')) this.$('#priv-npc').value = state.privNpc || '';
    if (this.$('#priv-item')) this.$('#priv-item').value = state.privItem || '';
    if (this.$('#priv-qty')) this.$('#priv-qty').value = state.privQty || '1';
    if (this.$('#priv-price')) this.$('#priv-price').value = state.privPrice || '1000';

    this.setSelectIfExists('#auc-item-sel', state.aucItem);
    if (this.$('#auc-bid')) this.$('#auc-bid').value = state.aucBid || '0';

    this.setActiveTab(state.activeTab || 'tab-shop', false);
    this.updateShopPreview();
    this.updateSellPreview();
    this.updatePrivPreview();
    this.updateAucPreview();
  }

  applyInitialContext() {
    const initialTab = String(this.options.initialTab || '').trim();
    if (initialTab) this.setActiveTab(initialTab, false);

    const prefillNpc = String(this.options.prefillNpc || '').trim();
    if (prefillNpc && this.$('#priv-npc')) {
      this.$('#priv-npc').value = prefillNpc;
      if (this.options.lockNpc === true) {
        this.$('#priv-npc').readOnly = true;
        const group = this.$('#priv-npc').closest('.form-group');
        if (group) group.classList.add('is-context-locked');
      }
    }

    const preferredStore = String(this.options.preferredStore || '').trim();
    const storeSel = this.$('#shop-store-sel');
    if (preferredStore && storeSel) {
      const hasStore = Array.from(storeSel.options || []).some(opt => opt.value === preferredStore);
      if (hasStore) storeSel.value = preferredStore;
    }

    this.updateShopItems();

    const prefillAction = String(this.options.prefillAction || '').trim();
    if (prefillAction && this.$('#priv-action')) {
      const actionText = /鍗東鍑哄敭|sell/i.test(prefillAction) ? '绉佷笅鍗栧嚭' : '绉佷笅涔板叆';
      this.$('#priv-action').value = actionText;
    }

    const prefillItem = String(this.options.prefillItem || '').trim();
    if (prefillItem) {
      if (initialTab === 'tab-private' && this.$('#priv-item')) this.$('#priv-item').value = prefillItem;
      if (initialTab === 'tab-shop') this.setSelectIfExists('#shop-item-sel', prefillItem);
      if (initialTab === 'tab-sell') this.setSelectIfExists('#sell-item-sel', prefillItem);
      if (initialTab === 'tab-auction') this.setSelectIfExists('#auc-item-sel', prefillItem);
    }

    const prefillQty = Math.max(1, Number(this.options.prefillQty || this.options.鏁伴噺 || 0));
    if (prefillQty > 0) {
      if (this.$('#shop-qty')) this.$('#shop-qty').value = String(prefillQty);
      if (this.$('#sell-qty')) this.$('#sell-qty').value = String(prefillQty);
      if (this.$('#priv-qty')) this.$('#priv-qty').value = String(prefillQty);
    }

    const prefillPrice = Math.max(0, Number(this.options.prefillPrice || this.options.浠锋牸 || 0));
    if (prefillPrice > 0) {
      if (this.$('#priv-price')) this.$('#priv-price').value = String(prefillPrice);
      if (this.$('#auc-bid')) this.$('#auc-bid').value = String(prefillPrice);
    }

    this.updateSellPreview();
    this.updatePrivPreview();
    this.updateAucPreview();

    if (this.options.autoExecute) {
      window.setTimeout(() => this.runInitialAutoExecute(), 80);
    }
  }

  runInitialAutoExecute() {
    const activeTab = this.container.querySelector('.trade-tab.active')?.dataset.target || 'tab-shop';
    if (activeTab === 'tab-shop' && !this.$('#btn-buy')?.disabled) this.executeShopBuy();
    else if (activeTab === 'tab-sell' && !this.$('#btn-sell')?.disabled) this.executeSell();
    else if (activeTab === 'tab-private' && !this.$('#btn-private')?.disabled) this.executePrivateTrade();
    else if (activeTab === 'tab-auction' && !this.$('#btn-auc')?.disabled) this.executeAuction();
  }

  bindEvents() {
    this.$$('.trade-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.setActiveTab(tab.dataset.target);
      });
    });

    // Shop Events
    this.$('#shop-store-sel').addEventListener('change', () => this.updateShopItems());
    this.$('#shop-item-sel').addEventListener('change', () => this.updateShopPreview());
    this.$('#shop-qty').addEventListener('input', () => this.updateShopPreview());
    this.$('#btn-buy').addEventListener('click', () => this.executeShopBuy());

    // Sell Events
    this.$('#sell-item-sel').addEventListener('change', () => this.updateSellPreview());
    this.$('#sell-qty').addEventListener('input', () => this.updateSellPreview());
    this.$('#btn-sell').addEventListener('click', () => this.executeSell());

    // Private Events
    this.$('#priv-action').addEventListener('change', () => this.updatePrivPreview());
    this.$('#priv-npc').addEventListener('input', () => this.updatePrivPreview());
    this.$('#priv-item').addEventListener('input', () => this.updatePrivPreview());
    this.$('#priv-qty').addEventListener('input', () => this.updatePrivPreview());
    this.$('#priv-price').addEventListener('input', () => this.updatePrivPreview());
    this.$('#btn-private').addEventListener('click', () => this.executePrivateTrade());

    // Auction Events
    this.$('#auc-item-sel').addEventListener('change', () => this.updateAucPreview());
    this.$('#auc-bid').addEventListener('input', () => this.updateAucPreview());
    this.$('#btn-auc').addEventListener('click', () => this.executeAuction());
  }

  updateData(newSnapshot) {
    const currentState = this.getCurrentUiState();
    this.snapshot = newSnapshot;
    this.syncData();
    this.restoreUiState(currentState);
  }

  destroy() {
    this.container.innerHTML = '';
  }

  get charData() {
    return this.snapshot?.activeChar || {};
  }

  get worldData() {
    return this.snapshot?.sd?.world || this.snapshot?.rootData?.world || {};
  }

  get allChars() {
    return this.snapshot?.sd?.char || this.snapshot?.rootData?.char || {};
  }

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

  get activeCharBasePath() {
    return `/char/${this.escapeJsonPointer(this.activeName)}`;
  }

  getCurrencyLabel(currency) {
    return {
      鑱旈偊甯? '鑱旈偊甯?,
      鏄熺綏甯? '鏄熺綏甯?,
      鍞愰棬绉垎: '鍞愰棬绉垎',
      瀛﹂櫌绉垎: '瀛﹂櫌绉垎',
      鎴樺姛: '鎴樺姛'
    }[currency] || '鑱旈偊甯?;
  }

  getDefaultCurrencyByContext(storeName = '', loc = '', storeData = null) {
    const storeText = String(storeName || '');
    const locText = String(loc || this.charData?.鐘舵€?.浣嶇疆 || '');
    const storeFaction = String(storeData?.鎵€灞炲娍鍔?|| '');
    const merged = `${storeText}|${locText}|${storeFaction}`;
    if (/琛€绁瀨鍐涘洟鎴樺|鎴樺姛鍟嗗簵|鍐涢渶澶?.test(merged)) return '鎴樺姛';
    if (/鍞愰棬/.test(merged)) return '鍞愰棬绉垎';
    if (/鍙茶幈鍏媩娴风闃亅鍐呴櫌|澶栭櫌/.test(merged)) return '瀛﹂櫌绉垎';
    if (/鏄熺綏/.test(merged)) return '鏄熺綏甯?;
    return '鑱旈偊甯?;
  }

  resolveTradeCurrency(item = {}, storeName = '', loc = '', storeData = null) {
    const explicit = String(item?.璐у竵 || '').trim();
    return explicit || this.getDefaultCurrencyByContext(storeName, loc, storeData);
  }

  isCurrencySpendable(currency) {
    return currency !== '鎴樺姛';
  }

  getCurrencyBlockedMessage(currency) {
    if (currency === '鎴樺姛') return '鎴樺姛涓嶈兘鐩存帴鐢ㄤ簬璐墿锛屽彧鑳界敤浜庡啗鏂规檵鍗囥€佸鎵规垨璧勬牸鐢抽銆?;
    return '褰撳墠璐у竵涓嶅彲鐩存帴鐢ㄤ簬浜ゆ槗銆?;
  }

  syncData() {
    const loc = this.charData?.鐘舵€?.浣嶇疆 || "鏈煡鍖哄煙";
    const fedCoin = this.charData?.璐㈠瘜?.鑱旈偊甯?|| 0;
    const fame = this.charData?.绀句氦?.澹版湜 || 0;

    this.$('#ui-loc').textContent = loc;
    this.$('#ui-fedcoin').textContent = fedCoin.toLocaleString();
    this.$('#ui-fame').textContent = fame.toLocaleString();

    const currentCity = this.resolveTradeLocationNode(loc);
    this.currentStores = currentCity?.data?.鍟嗗簵 || {};
    this.currentAuction = this.worldData?.鎷嶅崠 || { 鐘舵€? "浼戝競", 鎷嶅搧: {} };

    this.populateShopData();
    this.populateSellData();
    this.populateAuctionData();
    this.updatePrivPreview();
  }

  // --- 浼板€间笌涓婁笅鏂?(澶嶅埢鍘熺増) ---
  estimateBasePrice(itemName, itemType = "鐗╁搧") {
    if (/鏂楅摖/.test(itemName)) return 0;
    if (/鏈虹敳/.test(itemName)) {
      if (/绾㈢骇/.test(itemName)) return 5000000000;
      if (/榛戠骇/.test(itemName)) return 1000000000;
      if (/绱骇/.test(itemName)) return 80000000;
      if (/榛勭骇/.test(itemName)) return 6000000;
      return 6000000;
    }
    let tier = 1;
    if (/澶╅敾|鍗佷竾骞?.test(itemName)) tier = 5;
    else if (/榄傞敾|涓囧勾/.test(itemName)) tier = 4;
    else if (/鐏甸敾|鍗冨勾/.test(itemName)) tier = 3;
    else if (/鍗冮敾|鐧惧勾/.test(itemName)) tier = 2;
    else if (/鐧鹃敾/.test(itemName)) tier = 1;

    let metalBasePrice = 10000;
    if (tier === 5) metalBasePrice = 500000000;
    else if (tier === 4) metalBasePrice = 80000000;
    else if (tier === 3) metalBasePrice = 10000000;
    else if (tier === 2) metalBasePrice = 500000;
    else if (tier === 1) metalBasePrice = 50000;

    let metalCount = 1;
    let match = itemName.match(/(\d+)绉嶉噾灞?);
    if (match) metalCount = parseInt(match[1]);
    else if (/铻嶉敾/.test(itemName)) metalCount = 2;

    let totalMetalPrice = metalBasePrice * (1 + (metalCount - 1) * 0.3);

    if (itemType === "鍥剧焊") return Math.floor(totalMetalPrice * 0.2);
    else if (itemType === "娑堣€楀搧" || itemType === "淇鍖?) return Math.floor(totalMetalPrice * 0.1);
    else return Math.floor(totalMetalPrice * 1.0);
  }

  clampTrade(value, min, max) {
    return Math.max(min, Math.min(max, Number(value || 0)));
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

  isLocationCompatible(currentLoc, targetLoc) {
    const current = this.normalizeLocForMatch(currentLoc);
    const target = this.normalizeLocForMatch(targetLoc);
    if (!current.raw || !target.raw) return current.raw === target.raw;
    if (current.raw === target.raw || current.leaf === target.leaf) return true;
    return current.segments.some(seg => target.segments.includes(seg));
  }

  resolveTradeLocationNode(location) {
    const worldLocations = this.worldData?.閸︽壆鍋?|| {};
    const raw = String(location || '').trim();
    const normalized = this.normalizeLocForMatch(raw);
    const candidates = [raw, normalized.raw, normalized.segments[0] || '', normalized.leaf || ''].filter(Boolean);
    for (const key of candidates) {
      if (worldLocations[key]) return { key, data: worldLocations[key] };
    }
    return { key: '', data: null };
  }

  getPrivateTradeContext(action, targetNpcName, itemName, qty, price) {
    const ctx = {
      action, targetNpcName, targetChar: null, relationScore: 0, successRate: 0,
      basePrice: Math.max(0, this.estimateBasePrice(itemName, "鐗╁搧")),
      total: Math.max(0, Number(price || 0) * Math.max(1, Number(qty || 1))),
      error: null, note: '', npcItem: null, playerItem: null
    };
    if (!itemName) { ctx.error = '璇疯緭鍏ヤ氦鏄撶墿鍝佸悕绉般€?; return ctx; }
    if (!targetNpcName) { ctx.error = '璇疯緭鍏ヤ氦鏄撳璞?NPC銆?; return ctx; }

    const resolvedTarget = this.resolveCharacterByName(targetNpcName);
    const targetChar = resolvedTarget.char;
    const relationName = resolvedTarget.displayName || targetNpcName;
    ctx.targetChar = targetChar || null;
    if (!targetChar) { ctx.error = `鎵句笉鍒颁氦鏄撳璞°€?{targetNpcName}銆戙€俙; return ctx; }

    const currentLoc = String(this.charData?.鐘舵€?.浣嶇疆 || '');
    const targetLoc = String(targetChar?.鐘舵€?.浣嶇疆 || '');
    if (currentLoc && targetLoc && !this.isLocationCompatible(currentLoc, targetLoc)) {
      ctx.error = `銆?{targetNpcName}銆戝綋鍓嶄笉鍦ㄤ綘韬竟锛屾棤娉曡繘琛岀涓嬩氦鏄撱€俙; return ctx;
    }
    if (ctx.basePrice <= 0) {
      ctx.error = `銆?{itemName}銆戝綋鍓嶆棤娉曡繘琛屽彲闈犱及鍊硷紝绉佷笅浜ゆ槗鏃犳硶鍙戣捣銆俙; return ctx;
    }
    
    ctx.relationScore = Number(this.charData?.绀句氦?.鍏崇郴?.[targetNpcName]?.濂芥劅搴?|| this.charData?.绀句氦?.鍏崇郴?.[relationName]?.濂芥劅搴?|| 0);
    const priceDeltaRatio = (Number(price || 0) - ctx.basePrice) / Math.max(1, ctx.basePrice);

    if (action === "绉佷笅涔板叆") {
      ctx.npcItem = targetChar?.鑳屽寘?.[itemName] || null;
      if ((this.charData?.璐㈠瘜?.鑱旈偊甯?|| 0) < ctx.total) {
        ctx.error = `鑱旈偊甯佷笉瓒筹紝瀹屾垚璇ヤ氦鏄撻渶瑕?${ctx.total.toLocaleString()}銆俙; return ctx;
      }
      if (!ctx.npcItem || Number(ctx.npcItem.鏁伴噺 || 0) < qty) {
        ctx.error = `銆?{targetNpcName}銆戝綋鍓嶅苟娌℃湁瓒冲鐨勩€?{itemName}銆戝彲渚涘嚭鍞€俙; return ctx;
      }
      ctx.successRate = this.clampTrade(60 + Math.floor(ctx.relationScore * 0.25) + Math.floor(priceDeltaRatio * 50), 5, 95);
      ctx.note = `濂芥劅 ${ctx.relationScore} / 瀵规柟鎸佹湁 ${Number(ctx.npcItem?.鏁伴噺 || 0)} / 棰勮鎴愪氦鐜?${ctx.successRate}%`;
    } else {
      ctx.playerItem = this.charData?.鑳屽寘?.[itemName] || null;
      if (!ctx.playerItem || Number(ctx.playerItem.鏁伴噺 || 0) < qty) {
        ctx.error = '鑳屽寘鏁伴噺涓嶈冻锛?; return ctx;
      }
      if ((targetChar?.璐㈠瘜?.鑱旈偊甯?|| 0) < ctx.total) {
        ctx.error = `銆?{targetNpcName}銆戠殑鑱旈偊甯佷笉瓒筹紝鏃犳硶瀹屾垚杩欑瑪鏀惰喘銆俙; return ctx;
      }
      ctx.successRate = this.clampTrade(60 + Math.floor(ctx.relationScore * 0.25) - Math.floor(priceDeltaRatio * 55), 5, 95);
      ctx.note = `濂芥劅 ${ctx.relationScore} / 瀵规柟鐜伴噾 ${(Number(targetChar?.璐㈠瘜?.鑱旈偊甯?|| 0)).toLocaleString()} / 棰勮鎴愪氦鐜?${ctx.successRate}%`;
    }
    return ctx;
  }

  formatTickToCalendarDateText(tickValue) {
    const safeTick = Math.max(0, Number(tickValue || 0));
    const totalMinutes = safeTick * 10;
    const days = Math.floor(totalMinutes / (24 * 60));
    const years = Math.floor(days / 360);
    const months = Math.floor((days % 360) / 30) + 1;
    const currentDay = (days % 30) + 1;
    const remainderMinutes = totalMinutes % (24 * 60);
    const hours = Math.floor(remainderMinutes / 60);
    const mins = remainderMinutes % 60;
    return `鏂楃綏鍘?{20000 + years}骞?{months}鏈?{currentDay}鏃?${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  resolveTradeItemInfo(itemName, item = {}, fallback = {}) {
    const safeItem = item && typeof item === 'object' ? item : {};
    const type = String(safeItem.绫诲瀷 || fallback.type || '鐗╁搧');
    const rarity = String(safeItem.鍝佽川 || safeItem.鍝侀樁 || fallback.rarity || '鏍囧噯');
    const expiryTick = Number(safeItem.鏈夋晥鏈熻嚦tick ?? fallback.expiryTick ?? 0);
    const expiry = expiryTick > 0 ? this.formatTickToCalendarDateText(expiryTick) : (String(safeItem.鏈夋晥鏈熻嚦 || fallback.expiry || '').trim() || '鏃犳湡闄?);
    const trigger = String(safeItem.瑙﹀彂鏂瑰紡 || fallback.trigger || (/椋熺墿/.test(type) ? '椋熺敤' : '甯歌'));
    const source = String(safeItem.鏉ユ簮鎶€鑳?|| safeItem.缁戝畾鑰?|| fallback.source || '甯歌娴侀€?);
    const desc = String(safeItem.鎻忚堪 || fallback.desc || '鏆傛棤璇存槑');
    return {
      name: itemName,
      type,
      rarity,
      trigger,
      expiry,
      source,
      desc,
      expiryTick,
      temporary: expiryTick > 0 || expiry !== '鏃犳湡闄?
    };
  }

  updateTradeMetaPanel(prefix, info = null) {
    const triggerEl = this.$(`#${prefix}-trigger`);
    const expiryEl = this.$(`#${prefix}-expiry`);
    const sourceEl = this.$(`#${prefix}-source`);
    const descEl = this.$(`#${prefix}-desc`);
    if (!triggerEl || !expiryEl || !sourceEl || !descEl) return;
    if (!info) {
      triggerEl.textContent = '-';
      expiryEl.textContent = '-';
      sourceEl.textContent = '-';
      descEl.textContent = '-';
      return;
    }
    triggerEl.textContent = info.trigger || '-';
    expiryEl.textContent = info.expiry || '-';
    sourceEl.textContent = info.source || '-';
    descEl.textContent = info.desc || '-';
  }

  buildInventoryItemFromTradeSource(itemName, sourceItem = {}, qty = 1, fallback = {}) {
    const safeItem = sourceItem && typeof sourceItem === 'object' ? JSON.parse(JSON.stringify(sourceItem)) : {};
    const nextItem = {
      鏁伴噺: qty,
      绫诲瀷: safeItem.绫诲瀷 || fallback.type || '鐗╁搧',
      鍝佽川: safeItem.鍝佽川 || safeItem.鍝侀樁 || fallback.rarity || '鏍囧噯',
      鎻忚堪: safeItem.鎻忚堪 || fallback.desc || `鑾峰緱浜嗐€?{itemName}銆慲
    };
    const resolvedExpiryTick = Number(safeItem.鏈夋晥鏈熻嚦tick ?? fallback.expiryTick ?? 0);
    const resolvedExpiry = resolvedExpiryTick > 0 ? this.formatTickToCalendarDateText(resolvedExpiryTick) : String(safeItem.鏈夋晥鏈熻嚦 || fallback.expiry || '').trim();
    if (safeItem.鍝侀樁 !== undefined) nextItem.鍝侀樁 = safeItem.鍝侀樁;
    if (safeItem.瑙﹀彂鏂瑰紡 !== undefined || fallback.trigger !== undefined) nextItem.瑙﹀彂鏂瑰紡 = safeItem.瑙﹀彂鏂瑰紡 || fallback.trigger || (/椋熺墿/.test(String(nextItem.绫诲瀷 || '')) ? '椋熺敤' : '甯歌');
    if (resolvedExpiry) nextItem.鏈夋晥鏈熻嚦 = resolvedExpiry;
    if (resolvedExpiryTick > 0) nextItem.鏈夋晥鏈熻嚦tick = resolvedExpiryTick;
    if (safeItem.鏉ユ簮鎶€鑳?!== undefined || safeItem.缁戝畾鑰?!== undefined || fallback.source !== undefined) nextItem.鏉ユ簮鎶€鑳?= safeItem.鏉ユ簮鎶€鑳?|| safeItem.缁戝畾鑰?|| fallback.source;
    if (Array.isArray(safeItem.浣跨敤鏁堟灉)) nextItem.浣跨敤鏁堟灉 = safeItem.浣跨敤鏁堟灉;
    else if (Array.isArray(safeItem.鏁堟灉)) nextItem.浣跨敤鏁堟灉 = safeItem.鏁堟灉;
    if (Array.isArray(safeItem.鏍囩)) nextItem.鏍囩 = safeItem.鏍囩;
    if (safeItem.甯傚満浼板€?&& typeof safeItem.甯傚満浼板€?=== 'object') nextItem.甯傚満浼板€?= safeItem.甯傚満浼板€?
    if (safeItem.鍙氦鏄?!== undefined) nextItem.鍙氦鏄?= safeItem.鍙氦鏄?
    return nextItem;
  }

  buildTradeItemMetadataPatches(itemPath, currentItem = {}, nextItem = {}) {
    const patches = [];
    ['绫诲瀷', '鍝佽川', '鍝侀樁', '鎻忚堪', '瑙﹀彂鏂瑰紡', '鏈夋晥鏈熻嚦', '鏈夋晥鏈熻嚦tick', '鏉ユ簮鎶€鑳?].forEach(field => {
      const nextVal = nextItem[field];
      const curVal = currentItem ? currentItem[field] : undefined;
      if (nextVal === undefined || nextVal === null || nextVal === '') return;
      if (curVal === undefined || curVal === null || curVal === '' || curVal === '鏃?) {
        patches.push({ op: 'replace', path: `${itemPath}/${this.escapeJsonPointer(field)}`, value: nextVal });
      }
    });
    if (Array.isArray(nextItem.浣跨敤鏁堟灉) && (!Array.isArray(currentItem?.浣跨敤鏁堟灉) || currentItem.浣跨敤鏁堟灉.length === 0)) {
      patches.push({ op: 'replace', path: `${itemPath}/${this.escapeJsonPointer('浣跨敤鏁堟灉')}`, value: nextItem.浣跨敤鏁堟灉 });
    }
    return patches;
  }

  escapeJsonPointer(str) {
    return String(str).replace(/~/g, '~0').replace(/\//g, '~1');
  }

  buildTradeSystemPatches(logText, options = {}) {
    const patches = [
      { op: "replace", path: `/sys/系统播报`, value: String(logText || '') }
    ];
    if (Number.isFinite(Number(options.roll))) {
      patches.push({ op: "replace", path: `/sys/鏈€杩戞瀹歚, value: Number(options.roll) });
    }
    if (Number.isFinite(Number(options.successRate))) {
      patches.push({ op: "replace", path: `/sys/鏈€缁堟垚鍔熺巼`, value: Number(options.successRate) });
    }
    return patches;
  }

  buildTradeNarrationPrompt(logText, sections = []) {
    const safeSections = Array.isArray(sections)
      ? sections.map(section => String(section || '').trim()).filter(Boolean)
      : [];
    return [
      HIDDEN_ARBITRATION_NARRATION_RULES,
      '[鍓嶇缁撶畻宸插畬鎴怾',
      '鏈浜ゆ槗娑夊強鐨勮揣甯併€佸簱瀛樸€佽儗鍖呬笌绯荤粺鎾姤宸茬粡鍐欏叆 MVU锛屼笉瑕侀噸澶嶆敼璐︺€佹敼搴撳瓨锛屼篃涓嶈鍐嶆浠茶鍚屼竴绗斾氦鏄撱€?,
      String(logText || '').trim(),
      ...safeSections,
    ].filter(Boolean).join('\n\n');
  }

  submitAction(playerInput, sysPrompt, requestKind, patchOps = []) {
    if (this.options.onTradeAction) {
      this.options.onTradeAction({
        playerInput,
        systemPrompt: sysPrompt,
        requestKind,
        patchOps: Array.isArray(patchOps) ? patchOps : []
      });
    }
  }

  // --- 鍟嗗簵閲囪喘妯″潡 ---
  populateShopData() {
    const storeSel = this.$('#shop-store-sel');
    storeSel.innerHTML = '';
    if (Object.keys(this.currentStores).length === 0) {
      storeSel.innerHTML = '<option value="">[褰撳墠鍖哄煙鏃犲晢搴梋</option>';
      this.updateShopItems();
      return;
    }
    for (const sName in this.currentStores) {
      const opt = document.createElement('option');
      opt.value = sName;
      opt.textContent = sName;
      storeSel.appendChild(opt);
    }
    this.updateShopItems();
  }

  updateShopItems() {
    const storeName = this.$('#shop-store-sel').value;
    const itemSel = this.$('#shop-item-sel');
    itemSel.innerHTML = '';
    
    if (!storeName || !this.currentStores[storeName] || !this.currentStores[storeName].搴撳瓨) {
      itemSel.innerHTML = '<option value="">[璇ュ晢搴楁棤璐</option>';
      this.updateShopPreview();
      return;
    }

    const inv = this.currentStores[storeName].搴撳瓨;
    let hasItem = false;
    for (const iName in inv) {
      if (inv[iName].搴撳瓨 > 0) {
        const opt = document.createElement('option');
        opt.value = iName;
        opt.textContent = `${iName} (搴撳瓨: ${inv[iName].搴撳瓨})`;
        itemSel.appendChild(opt);
        hasItem = true;
      }
    }
    if (!hasItem) itemSel.innerHTML = '<option value="">[鍟嗗搧宸插敭缃刔</option>';
    this.updateShopPreview();
  }

  updateShopPreview() {
    const storeName = this.$('#shop-store-sel').value;
    const itemName = this.$('#shop-item-sel').value;
    const qty = parseInt(this.$('#shop-qty').value) || 1;
    const btn = this.$('#btn-buy');

    if (!storeName || !itemName || !this.currentStores[storeName]?.搴撳瓨?.[itemName]) {
      this.$('#shop-price').textContent = '-';
      this.$('#shop-total').textContent = '-';
      this.$('#shop-fame').textContent = '-';
      this.$('#shop-stock').textContent = '-';
      btn.disabled = true;
      this.updateTradeMetaPanel('shop', null);
      return;
    }

    const item = this.currentStores[storeName].搴撳瓨[itemName];
    const total = item.浠锋牸 * qty;
    const userFame = this.charData?.绀句氦?.澹版湜 || 0;
    const storeData = this.currentStores[storeName] || {};
    const currency = this.resolveTradeCurrency(item, storeName, this.charData?.鐘舵€?.浣嶇疆 || '', storeData);
    const userCoin = this.charData?.璐㈠瘜?.[currency] || 0;

    this.$('#shop-price').textContent = `${item.浠锋牸.toLocaleString()} ${this.getCurrencyLabel(currency)}`;
    
    const totalEl = this.$('#shop-total');
    totalEl.textContent = `${total.toLocaleString()} ${this.getCurrencyLabel(currency)}`;
    totalEl.className = (userCoin >= total) ? "val-highlight" : "val-warn";

    const fameEl = this.$('#shop-fame');
    fameEl.textContent = item.闇€姹傚０鏈?|| 0;
    fameEl.className = (userFame >= (item.闇€姹傚０鏈?|| 0)) ? "val-highlight" : "val-warn";

    const stockEl = this.$('#shop-stock');
    stockEl.textContent = item.搴撳瓨;
    stockEl.className = (item.搴撳瓨 >= qty) ? "val-highlight" : "val-warn";

    this.updateTradeMetaPanel('shop', this.resolveTradeItemInfo(itemName, item, { source: storeName, desc: item.鎻忚堪 || `鍙湪 ${storeName} 璐緱` }));

    if (!this.isCurrencySpendable(currency)) {
      totalEl.className = "val-warn";
      totalEl.textContent = this.getCurrencyBlockedMessage(currency);
      btn.disabled = true;
      return;
    }

    btn.disabled = (userCoin < total || userFame < (item.闇€姹傚０鏈?|| 0) || item.搴撳瓨 < qty);
  }

  executeShopBuy() {
    const storeName = this.$('#shop-store-sel').value;
    const itemName = this.$('#shop-item-sel').value;
    const qty = parseInt(this.$('#shop-qty').value) || 1;
    const item = this.currentStores[storeName].搴撳瓨[itemName];
    const total = item.浠锋牸 * qty;
    const storeData = this.currentStores[storeName] || {};
    const currency = this.resolveTradeCurrency(item, storeName, this.charData?.鐘舵€?.浣嶇疆 || '', storeData);

    if (!this.isCurrencySpendable(currency)) return alert(this.getCurrencyBlockedMessage(currency));

    let loc = this.charData?.鐘舵€?.浣嶇疆 || "";
    let isTier4_5 = /澶╅敾|鍥涘瓧|绾㈢骇|鍗佷竾骞磡榄傞敾|涓夊瓧|榛戠骇|涓囧勾/.test(itemName);
    let isTier2_3 = /鐏甸敾|浜屽瓧|绱骇|鍗冨勾|鍗冮敾|涓€瀛梶榛勭骇|鐧惧勾/.test(itemName);
    const locMeta = this.worldData?.鍦扮偣?.[loc] || {};
    const economy = String(locMeta['缁忔祹鐘跺喌'] || '鏈煡');
    let isTier1City = economy === '绻佽崳';
    let isTier2_3City = economy === '绻佽崳' || economy === '鏅€?;

    if (isTier4_5 && !isTier1City) return alert("褰撳墠鍩庡競绾у埆涓嶈冻锛?~5闃舵垬鐣ヨ祫婧愯鍓嶅線涓€绾夸富鍩庤喘涔般€?);
    if (isTier2_3 && !isTier2_3City) return alert("鍋忚繙鍦板尯鐗╄祫鍖箯锛屾棤娉曟彁渚?~3闃惰祫婧愩€?);

    let patchOps = [];
    let newWealth = (this.charData.璐㈠瘜?.[currency] || 0) - total;
    patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/璐㈠瘜/${this.escapeJsonPointer(currency)}`, value: newWealth });
    patchOps.push({ op: "replace", path: `/world/鍦扮偣/${this.escapeJsonPointer(loc)}/鍟嗗簵/${this.escapeJsonPointer(storeName)}/搴撳瓨/${this.escapeJsonPointer(itemName)}/搴撳瓨`, value: item.搴撳瓨 - qty });
    
    let invItem = this.charData.鑳屽寘?.[itemName];
    const nextItem = this.buildInventoryItemFromTradeSource(itemName, item, qty, { source: storeName, desc: item.鎻忚堪 || `璐嚜${storeName}` });
    const itemPath = `${this.activeCharBasePath}/鑳屽寘/${this.escapeJsonPointer(itemName)}`;
    if (invItem) {
      patchOps.push({ op: "replace", path: `${itemPath}/鏁伴噺`, value: (invItem.鏁伴噺 || 0) + qty });
      patchOps.push(...this.buildTradeItemMetadataPatches(itemPath, invItem, nextItem));
    } else {
      patchOps.push({ op: "replace", path: itemPath, value: nextItem });
    }

    const log = `[浜ゆ槗鎴愬姛] ${this.activeName}鍦?${storeName} 鑺辫垂 ${total} ${this.getCurrencyLabel(currency)} 璐拱浜?${qty} 浠姐€?{itemName}銆戙€俙;
    patchOps.push(...this.buildTradeSystemPatches(log));

    const sysPrompt = this.buildTradeNarrationPrompt(log, [
      `[浜ゆ槗鍦扮偣]\n${storeName}`,
      `[浜ゆ槗绫诲瀷]\n鍟嗗簵璐拱`,
      `[缁撶畻鎽樿]\n宸叉敮浠?${total} ${this.getCurrencyLabel(currency)}锛涘凡鑾峰緱 ${qty} 浠姐€?{itemName}銆戙€俙
    ]);

    this.submitAction(`鎴戣鍦ㄣ€?{storeName}銆戣喘涔?${qty} 浠姐€?{itemName}銆戙€俙, sysPrompt, 'trade_shop_buy', patchOps);
  }

  // --- 璧勪骇鍑哄敭妯″潡 ---
  populateSellData() {
    const invSel = this.$('#sell-item-sel');
    invSel.innerHTML = '';
    let hasItem = false;
    for (const iName in (this.charData?.鑳屽寘 || {})) {
      const item = this.charData.鑳屽寘[iName];
      if (item.鏁伴噺 > 0) {
        const opt = document.createElement('option');
        opt.value = iName;
        opt.textContent = `${iName} (鎷ユ湁: ${item.鏁伴噺})`;
        invSel.appendChild(opt);
        hasItem = true;
      }
    }
    if (!hasItem) invSel.innerHTML = '<option value="">[鑳屽寘绌虹┖濡備篃]</option>';
    this.updateSellPreview();
  }

  updateSellPreview() {
    const itemName = this.$('#sell-item-sel').value;
    const qty = parseInt(this.$('#sell-qty').value) || 1;
    const btn = this.$('#btn-sell');

    if (!itemName || !this.charData.鑳屽寘?.[itemName]) {
      this.$('#sell-base-price').textContent = '-';
      this.$('#sell-total').textContent = '-';
      btn.disabled = true;
      this.updateTradeMetaPanel('sell', null);
      return;
    }

    const item = this.charData.鑳屽寘[itemName];
    const basePrice = this.estimateBasePrice(itemName, item.绫诲瀷);
    const sellPrice = Math.floor(basePrice * 0.5);
    const total = sellPrice * qty;

    this.updateTradeMetaPanel('sell', this.resolveTradeItemInfo(itemName, item, { source: item?.鏉ユ簮鎶€鑳?|| item?.缁戝畾鑰?|| '鑳屽寘鎸佹湁' }));

    if (basePrice === 0) {
      this.$('#sell-base-price').textContent = "绂佸敭鐗╁搧";
      this.$('#sell-total').textContent = "鏃犳硶浜ゆ槗";
      btn.disabled = true;
    } else {
      this.$('#sell-base-price').textContent = `${sellPrice.toLocaleString()} ${this.getCurrencyLabel('鑱旈偊甯?)}`;
      this.$('#sell-total').textContent = `${total.toLocaleString()} ${this.getCurrencyLabel('鑱旈偊甯?)}`;
      btn.disabled = (item.鏁伴噺 < qty);
    }
  }

  executeSell() {
    const itemName = this.$('#sell-item-sel').value;
    const qty = parseInt(this.$('#sell-qty').value) || 1;
    const itemType = this.charData.鑳屽寘[itemName].绫诲瀷;
    const basePrice = this.estimateBasePrice(itemName, itemType);
    const totalEarn = Math.floor(basePrice * 0.5) * qty;

    let patchOps = [];
    let newQty = this.charData.鑳屽寘[itemName].鏁伴噺 - qty;
    if (newQty <= 0) {
      patchOps.push({ op: "remove", path: `${this.activeCharBasePath}/鑳屽寘/${this.escapeJsonPointer(itemName)}` });
    } else {
      patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/鑳屽寘/${this.escapeJsonPointer(itemName)}/鏁伴噺`, value: newQty });
    }
    patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/璐㈠瘜/鑱旈偊甯乣, value: (this.charData.璐㈠瘜?.鑱旈偊甯?|| 0) + totalEarn });

    const log = `[浜ゆ槗鎴愬姛] ${this.activeName}鍚戠郴缁熷晢搴楀嚭鍞簡 ${qty} 浠姐€?{itemName}銆戯紝鑾峰緱 ${totalEarn} 鑱旈偊甯併€俙;
    patchOps.push(...this.buildTradeSystemPatches(log));

    const sysPrompt = this.buildTradeNarrationPrompt(log, [
      `[浜ゆ槗绫诲瀷]\n绯荤粺鍑哄敭`,
      `[缁撶畻鎽樿]\n宸插崠鍑?${qty} 浠姐€?{itemName}銆戯紱宸茶幏寰?${totalEarn} 鑱旈偊甯併€俙
    ]);

    this.submitAction(`鎴戣鍗栧嚭 ${qty} 浠姐€?{itemName}銆戞崲閽便€俙, sysPrompt, 'trade_system_sell', patchOps);
  }

  // --- 绉佷笅浜ゆ槗妯″潡 ---
  updatePrivPreview() {
    const action = this.$('#priv-action').value;
    const itemName = this.$('#priv-item').value;
    const qty = parseInt(this.$('#priv-qty').value) || 1;
    const price = parseInt(this.$('#priv-price').value) || 1;
    const btn = this.$('#btn-private');
    const targetNpc = String(this.$('#priv-npc').value || '').trim();
    const total = price * qty;
    const attEl = this.$('#priv-attitude');
    
    const ctx = this.getPrivateTradeContext(action, targetNpc, itemName, qty, price);

    this.$('#priv-base-price').textContent = ctx.basePrice > 0 ? `${ctx.basePrice.toLocaleString()} ${this.getCurrencyLabel('鑱旈偊甯?)}` : '鏈煡/绂佸敭';
    this.$('#priv-total').textContent = `${total.toLocaleString()} ${this.getCurrencyLabel('鑱旈偊甯?)}`;

    const previewItem = action === '绉佷笅涔板叆' ? ctx.npcItem : ctx.playerItem;
    this.updateTradeMetaPanel('priv', previewItem ? this.resolveTradeItemInfo(itemName, previewItem, { source: action === '绉佷笅涔板叆' ? targetNpc : this.activeName }) : null);

    btn.disabled = false;
    attEl.className = "";

    if (ctx.error) {
      attEl.textContent = ctx.error;
      attEl.className = "val-warn";
      btn.disabled = true;
      return;
    }

    attEl.textContent = `${action === "绉佷笅涔板叆" ? '鍙皾璇曟垚浜? : '鍙皾璇曞嚭鎵?}锝?{ctx.note}`;
    attEl.className = ctx.successRate >= 60 ? "val-highlight" : "val-warn";
  }

  executePrivateTrade() {
    const action = this.$('#priv-action').value;
    const targetNpc = this.$('#priv-npc').value || "绁炵鍟嗕汉";
    const itemName = this.$('#priv-item').value;
    const qty = parseInt(this.$('#priv-qty').value) || 1;
    const price = parseInt(this.$('#priv-price').value) || 1;
    const ctx = this.getPrivateTradeContext(action, targetNpc, itemName, qty, price);
    if (ctx.error) return alert(ctx.error);

    let patchOps = [];
    let log = "";
    const roll = Math.floor(Math.random() * 100) + 1;
    const isSuccess = roll <= ctx.successRate;

    if (action === "绉佷笅涔板叆") {
      if (!isSuccess) {
        log = `[绉佷笅浜ゆ槗澶辫触] ${this.activeName}鍚?${targetNpc} 寮€浠?${price}锛堜及鍊肩害 ${ctx.basePrice}锛夛紝瀵规柟娌℃湁鎺ュ彈銆傚ソ鎰?${ctx.relationScore}锛孯oll ${roll} > 鎴愬姛鐜?${ctx.successRate}銆俙;
      } else {
        patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/璐㈠瘜/鑱旈偊甯乣, value: (this.charData.璐㈠瘜?.鑱旈偊甯?|| 0) - ctx.total });
        let invItem = this.charData.鑳屽寘?.[itemName];
        const nextItem = this.buildInventoryItemFromTradeSource(itemName, ctx.npcItem, qty, { source: targetNpc, desc: `浠?${targetNpc} 澶勭涓嬭喘寰梎 });
        const itemPath = `${this.activeCharBasePath}/鑳屽寘/${this.escapeJsonPointer(itemName)}`;
        if (invItem) {
          patchOps.push({ op: "replace", path: `${itemPath}/鏁伴噺`, value: (invItem.鏁伴噺 || 0) + qty });
          patchOps.push(...this.buildTradeItemMetadataPatches(itemPath, invItem, nextItem));
        } else patchOps.push({ op: "replace", path: itemPath, value: nextItem });
        const npcNextQty = Number(ctx.npcItem?.鏁伴噺 || 0) - qty;
        if (npcNextQty <= 0) patchOps.push({ op: "remove", path: `/char/${this.escapeJsonPointer(targetNpc)}/鑳屽寘/${this.escapeJsonPointer(itemName)}` });
        else patchOps.push({ op: "replace", path: `/char/${this.escapeJsonPointer(targetNpc)}/鑳屽寘/${this.escapeJsonPointer(itemName)}/鏁伴噺`, value: npcNextQty });
        patchOps.push({ op: "replace", path: `/char/${this.escapeJsonPointer(targetNpc)}/璐㈠瘜/鑱旈偊甯乣, value: (ctx.targetChar?.璐㈠瘜?.鑱旈偊甯?|| 0) + ctx.total });
        log = `[绉佷笅浜ゆ槗鎴愬姛] ${this.activeName}浠ユ€讳环 ${ctx.total} 鑱旈偊甯佷粠 ${targetNpc} 澶勪拱鍏?${qty} 浠姐€?{itemName}銆戙€傚ソ鎰?${ctx.relationScore}锛孯oll ${roll} 鈮?鎴愬姛鐜?${ctx.successRate}銆俙;
      }
    } else {
      if (!isSuccess) {
        log = `[绉佷笅浜ゆ槗澶辫触] ${this.activeName}鍚?${targetNpc} 鎶ヤ环 ${price}锛堜及鍊肩害 ${ctx.basePrice}锛夛紝瀵规柟鏈効鎺ユ墜銆傚ソ鎰?${ctx.relationScore}锛孯oll ${roll} > 鎴愬姛鐜?${ctx.successRate}銆俙;
      } else {
        let newQty = this.charData.鑳屽寘[itemName].鏁伴噺 - qty;
        if (newQty <= 0) patchOps.push({ op: "remove", path: `${this.activeCharBasePath}/鑳屽寘/${this.escapeJsonPointer(itemName)}` });
        else patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/鑳屽寘/${this.escapeJsonPointer(itemName)}/鏁伴噺`, value: newQty });
        patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/璐㈠瘜/鑱旈偊甯乣, value: (this.charData.璐㈠瘜?.鑱旈偊甯?|| 0) + ctx.total });
        const npcInv = ctx.targetChar?.鑳屽寘?.[itemName];
        const npcItem = this.buildInventoryItemFromTradeSource(itemName, this.charData.鑳屽寘[itemName], qty, { source: this.activeName, desc: `浠?{this.activeName}澶勭涓嬫敹璐璥 });
        const npcItemPath = `/char/${this.escapeJsonPointer(targetNpc)}/鑳屽寘/${this.escapeJsonPointer(itemName)}`;
        if (npcInv) {
          patchOps.push({ op: "replace", path: `${npcItemPath}/鏁伴噺`, value: (npcInv.鏁伴噺 || 0) + qty });
          patchOps.push(...this.buildTradeItemMetadataPatches(npcItemPath, npcInv, npcItem));
        } else patchOps.push({ op: "replace", path: npcItemPath, value: npcItem });
        patchOps.push({ op: "replace", path: `/char/${this.escapeJsonPointer(targetNpc)}/璐㈠瘜/鑱旈偊甯乣, value: (ctx.targetChar?.璐㈠瘜?.鑱旈偊甯?|| 0) - ctx.total });
        log = `[绉佷笅浜ゆ槗鎴愬姛] ${this.activeName}浠ュ崟浠?${price} 鍚?${targetNpc} 鍗栧嚭 ${qty} 浠姐€?{itemName}銆戯紝鑾峰緱 ${ctx.total} 鑱旈偊甯併€傚ソ鎰?${ctx.relationScore}锛孯oll ${roll} 鈮?鎴愬姛鐜?${ctx.successRate}銆俙;
      }
    }

    patchOps.push(...this.buildTradeSystemPatches(log, { roll, successRate: ctx.successRate }));

    const sysPrompt = this.buildTradeNarrationPrompt(log, [
      `[浜ゆ槗瀵硅薄]\n${targetNpc}`,
      `[浜ゆ槗绫诲瀷]\n${action}`,
      `[缁撶畻鎽樿]\n${isSuccess ? `鏈鎴愪氦 ${qty} 浠姐€?{itemName}銆戯紝鎬讳环 ${ctx.total} 鑱旈偊甯併€俙 : `鏈鏈垚浜わ紝鎶ヤ环涓哄崟浠?${price} 鑱旈偊甯併€俙}`
    ]);

    this.submitAction(`鎴戣鍜屻€?{targetNpc}銆?{action} ${qty} 浠姐€?{itemName}銆戯紝鍗曚环鍑?${price} 鑱旈偊甯併€俙, sysPrompt, 'trade_private', patchOps);
  }

  // --- 鎷嶅崠琛屾ā鍧?---
  populateAuctionData() {
    const sel = this.$('#auc-item-sel');
    sel.innerHTML = '';
    if (this.currentAuction.鐘舵€?=== "浼戝競" || !this.currentAuction.鎷嶅搧 || Object.keys(this.currentAuction.鎷嶅搧).length === 0) {
      sel.innerHTML = '<option value="">[鎷嶅崠琛屼紤甯傛垨鏃犳媿鍝乚</option>';
      this.updateAucPreview();
      return;
    }
    for (const iName in this.currentAuction.鎷嶅搧) {
      const opt = document.createElement('option');
      opt.value = iName;
      opt.textContent = iName;
      sel.appendChild(opt);
    }
    this.updateAucPreview();
  }

  updateAucPreview() {
    const itemName = this.$('#auc-item-sel').value;
    const bid = parseInt(this.$('#auc-bid').value) || 0;
    const btn = this.$('#btn-auc');

    if (!itemName || !this.currentAuction.鎷嶅搧?.[itemName]) {
      this.$('#auc-current-price').textContent = '-';
      this.$('#auc-desc').textContent = '-';
      btn.disabled = true;
      return;
    }

    const item = this.currentAuction.鎷嶅搧[itemName];
    const currency = this.resolveTradeCurrency(item, '鎷嶅崠琛?, this.charData?.鐘舵€?.浣嶇疆 || '', this.currentAuction || {});
    this.$('#auc-current-price').textContent = `${item.浠锋牸.toLocaleString()} ${this.getCurrencyLabel(currency)}`;
    this.$('#auc-desc').textContent = `[${item.鍝佺骇}] ${item.鑳屾櫙}`;

    const userCoin = this.charData?.璐㈠瘜?.[currency] || 0;
    if (!this.isCurrencySpendable(currency)) {
      btn.disabled = true;
      return;
    }
    btn.disabled = (bid <= item.浠锋牸 || userCoin < bid);
  }

  executeAuction() {
    const itemName = this.$('#auc-item-sel').value;
    const bid = parseInt(this.$('#auc-bid').value) || 0;
    const item = this.currentAuction.鎷嶅搧[itemName];
    const currency = this.resolveTradeCurrency(item, '鎷嶅崠琛?, this.charData?.鐘舵€?.浣嶇疆 || '', this.currentAuction || {});

    if (!this.isCurrencySpendable(currency)) return alert(this.getCurrencyBlockedMessage(currency));

    let patchOps = [];
    patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/璐㈠瘜/${this.escapeJsonPointer(currency)}`, value: (this.charData.璐㈠瘜?.[currency] || 0) - bid });
    
    let invItem = this.charData.鑳屽寘?.[itemName];
    if (invItem) {
      patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/鑳屽寘/${this.escapeJsonPointer(itemName)}/鏁伴噺`, value: (invItem.鏁伴噺 || 0) + 1 });
    } else {
      patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/鑳屽寘/${this.escapeJsonPointer(itemName)}`, value: { 鏁伴噺: 1, 绫诲瀷: "鏋佸搧", 鍝佽川: item.鍝佺骇, 鎻忚堪: item.鑳屾櫙 } });
    }
    patchOps.push({ op: "remove", path: `/world/鎷嶅崠/鎷嶅搧/${this.escapeJsonPointer(itemName)}` });

    const log = `[绔炴媿鎴愬姛] ${this.activeName}璞幏 ${bid} ${this.getCurrencyLabel(currency)} 鎷嶄笅浜嗘瀬鍝併€?{itemName}銆戯紒`;
    patchOps.push(...this.buildTradeSystemPatches(log));

    const sysPrompt = this.buildTradeNarrationPrompt(log, [
      `[浜ゆ槗鍦扮偣]\n鎷嶅崠琛宍,
      `[浜ゆ槗绫诲瀷]\n绔炴媿鎴愪氦`,
      `[缁撶畻鎽樿]\n宸叉敮浠?${bid} ${this.getCurrencyLabel(currency)}锛涘凡鎷嶅緱銆?{itemName}銆戙€俙
    ]);

    this.submitAction(`銆愪妇鐗岀珵鎷嶃€戞垜鍑轰环 ${bid} 绔炴媿銆?{itemName}銆戯紒`, sysPrompt, 'trade_auction', patchOps);
  }
}

// 鍚戝叏灞€鎸傝浇
window.mountTradeUI = function(containerElement, snapshot, options = {}) {
  return new TradeUIComponent(containerElement, snapshot, options);
};

