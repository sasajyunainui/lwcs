/* TradeUI_Module.js - 交易网络组件 (JS 模块版) */

const TradeStyles = `
  /* 局部隔离：确保所有样式只在 .trade-module-scope 下生效 */
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
    <span>地点：<span class="val-highlight" id="ui-loc">未知</span></span>
    <span>联邦币：<span class="wealth-amt" id="ui-fedcoin">0</span></span>
    <span>声望：<span class="wealth-amt" id="ui-fame">0</span></span>
  </div>

  <div class="trade-tabs">
    <div class="trade-tab active" data-target="tab-shop">商店采购</div>
    <div class="trade-tab" data-target="tab-sell">资产出售</div>
    <div class="trade-tab" data-target="tab-private">私下交易</div>
    <div class="trade-tab" data-target="tab-auction">拍卖行</div>
  </div>

  <div class="trade-body">
    <!-- 商店采购 -->
    <div id="tab-shop" class="tab-content active">
      <div class="form-group">
        <label>选择商店</label>
        <select id="shop-store-sel" class="tech-select"></select>
      </div>
      <div class="form-group">
        <label>商品列表</label>
        <select id="shop-item-sel" class="tech-select"></select>
      </div>
      <div class="form-group">
        <label>购买数量</label>
        <input type="number" id="shop-qty" class="tech-input" value="1" min="1">
      </div>
      <div class="info-panel">
        <div class="info-row"><span>单价:</span><span class="val-highlight" id="shop-price">-</span></div>
        <div class="info-row"><span>总计:</span><span class="val-highlight" id="shop-total">-</span></div>
        <div class="info-row"><span>需求声望:</span><span class="val-highlight" id="shop-fame">-</span></div>
        <div class="info-row"><span>当前库存:</span><span class="val-highlight" id="shop-stock">-</span></div>
        <div class="info-row"><span>触发方式:</span><span class="val-highlight" id="shop-trigger">-</span></div>
        <div class="info-row"><span>有效期至:</span><span class="val-highlight" id="shop-expiry">-</span></div>
        <div class="info-row"><span>来源:</span><span class="val-highlight" id="shop-source">-</span></div>
        <div class="info-row"><span>物品说明:</span><span class="val-highlight" style="white-space: normal; text-align: right;" id="shop-desc">-</span></div>
      </div>
      <button class="action-btn" id="btn-buy">确认购买</button>
    </div>

    <!-- 资产出售 -->
    <div id="tab-sell" class="tab-content">
      <div class="form-group">
        <label>背包物品</label>
        <select id="sell-item-sel" class="tech-select"></select>
      </div>
      <div class="form-group">
        <label>出售数量</label>
        <input type="number" id="sell-qty" class="tech-input" value="1" min="1">
      </div>
      <div class="info-panel">
        <div class="info-row"><span>系统估值(单价):</span><span class="val-highlight" id="sell-base-price">-</span></div>
        <div class="info-row"><span>出售总收益:</span><span class="val-highlight" id="sell-total">-</span></div>
        <div class="info-row"><span>触发方式:</span><span class="val-highlight" id="sell-trigger">-</span></div>
        <div class="info-row"><span>有效期至:</span><span class="val-highlight" id="sell-expiry">-</span></div>
        <div class="info-row"><span>来源:</span><span class="val-highlight" id="sell-source">-</span></div>
        <div class="info-row"><span>物品说明:</span><span class="val-highlight" style="white-space: normal; text-align: right;" id="sell-desc">-</span></div>
      </div>
      <button class="action-btn" id="btn-sell">确认出售</button>
    </div>

    <!-- 私下交易 -->
    <div id="tab-private" class="tab-content">
      <div class="form-group">
        <label>交易类型</label>
        <select id="priv-action" class="tech-select">
          <option value="私下买入">私下买入 (向NPC求购)</option>
          <option value="私下卖出">私下卖出 (向NPC推销)</option>
        </select>
      </div>
      <div class="form-group">
        <label>交易对象</label>
        <input type="text" id="priv-npc" class="tech-input" placeholder="输入NPC名字">
      </div>
      <div class="form-group">
        <label>物品名称</label>
        <input type="text" id="priv-item" class="tech-input" placeholder="输入物品全名">
      </div>
      <div class="form-group">
        <label>数量</label>
        <input type="number" id="priv-qty" class="tech-input" value="1" min="1">
      </div>
      <div class="form-group">
        <label>你的出价 / 单价</label>
        <input type="number" id="priv-price" class="tech-input" value="1000" min="1">
      </div>
      <div class="info-panel">
        <div class="info-row"><span>系统估值(参考):</span><span class="val-highlight" id="priv-base-price">-</span></div>
        <div class="info-row"><span>总金额:</span><span class="val-highlight" id="priv-total">-</span></div>
        <div class="info-row"><span>NPC态度预测:</span><span id="priv-attitude">-</span></div>
        <div class="info-row"><span>触发方式:</span><span class="val-highlight" id="priv-trigger">-</span></div>
        <div class="info-row"><span>有效期至:</span><span class="val-highlight" id="priv-expiry">-</span></div>
        <div class="info-row"><span>来源:</span><span class="val-highlight" id="priv-source">-</span></div>
        <div class="info-row"><span>物品说明:</span><span class="val-highlight" style="white-space: normal; text-align: right;" id="priv-desc">-</span></div>
      </div>
      <button class="action-btn" id="btn-private">执行交易</button>
    </div>

    <!-- 拍卖行 -->
    <div id="tab-auction" class="tab-content">
      <div class="form-group">
        <label>当前拍品</label>
        <select id="auc-item-sel" class="tech-select"></select>
      </div>
      <div class="form-group">
        <label>竞拍出价</label>
        <input type="number" id="auc-bid" class="tech-input" value="0" min="1">
      </div>
      <div class="info-panel">
        <div class="info-row"><span>当前起拍/最高价:</span><span class="val-highlight" id="auc-current-price">-</span></div>
        <div class="info-row"><span>拍品描述:</span><span class="val-highlight" style="white-space: normal; text-align: right;" id="auc-desc">-</span></div>
      </div>
      <button class="action-btn" id="btn-auc">参与竞拍</button>
    </div>
  </div>
</div>
`;

const HIDDEN_ARBITRATION_NARRATION_RULES = `
[前端仲裁器说明]
以下内容属于隐藏仲裁结果，不要在正文中直接复述“成功率 / Roll / 仲裁结束 / JSONPatch / 系统分析”等字样。
请将仲裁结论转写成自然剧情，只描写交易动作、讨价还价、竞拍过程、物资流转与角色反应。
玩家应当看到的是经过修饰后的剧情文本，而不是系统裁定日志。
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
      privAction: this.$('#priv-action')?.value || '私下买入',
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

    if (this.$('#priv-action')) this.$('#priv-action').value = state.privAction || '私下买入';
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
      const actionText = /卖|出售|sell/i.test(prefillAction) ? '私下卖出' : '私下买入';
      this.$('#priv-action').value = actionText;
    }

    const prefillItem = String(this.options.prefillItem || '').trim();
    if (prefillItem) {
      if (initialTab === 'tab-private' && this.$('#priv-item')) this.$('#priv-item').value = prefillItem;
      if (initialTab === 'tab-shop') this.setSelectIfExists('#shop-item-sel', prefillItem);
      if (initialTab === 'tab-sell') this.setSelectIfExists('#sell-item-sel', prefillItem);
      if (initialTab === 'tab-auction') this.setSelectIfExists('#auc-item-sel', prefillItem);
    }

    const prefillQty = Math.max(1, Number(this.options.prefillQty || this.options.quantity || 0));
    if (prefillQty > 0) {
      if (this.$('#shop-qty')) this.$('#shop-qty').value = String(prefillQty);
      if (this.$('#sell-qty')) this.$('#sell-qty').value = String(prefillQty);
      if (this.$('#priv-qty')) this.$('#priv-qty').value = String(prefillQty);
    }

    const prefillPrice = Math.max(0, Number(this.options.prefillPrice || this.options.price || 0));
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

    const playerName = String(this.snapshot?.sd?.sys?.player_name || '').trim();
    if (playerName && chars[playerName]) return playerName;
    if (chars['主角']) return '主角';

    const firstName = Object.keys(chars)[0];
    return firstName || '主角';
  }

  get activeCharBasePath() {
    return `/char/${this.escapeJsonPointer(this.activeName)}`;
  }

  getCurrencyLabel(currency) {
    return {
      fed_coin: '联邦币',
      star_coin: '星罗币',
      tang_pt: '唐门积分',
      shrek_pt: '学院积分',
      blood_pt: '战功'
    }[currency] || '联邦币';
  }

  getDefaultCurrencyByContext(storeName = '', loc = '', storeData = null) {
    const storeText = String(storeName || '');
    const locText = String(loc || this.charData?.status?.loc || '');
    const storeFaction = String(storeData?.faction || storeData?.所属势力 || storeData?.owner_faction || '');
    const merged = `${storeText}|${locText}|${storeFaction}`;
    if (/血神|军团战备|战功商店|军需处/.test(merged)) return 'blood_pt';
    if (/唐门/.test(merged)) return 'tang_pt';
    if (/史莱克|海神阁|内院|外院/.test(merged)) return 'shrek_pt';
    if (/星罗/.test(merged)) return 'star_coin';
    return 'fed_coin';
  }

  resolveTradeCurrency(item = {}, storeName = '', loc = '', storeData = null) {
    const explicit = String(item?.currency || '').trim();
    return explicit || this.getDefaultCurrencyByContext(storeName, loc, storeData);
  }

  isCurrencySpendable(currency) {
    return currency !== 'blood_pt';
  }

  getCurrencyBlockedMessage(currency) {
    if (currency === 'blood_pt') return '战功不能直接用于购物，只能用于军方晋升、审批或资格申领。';
    return '当前货币不可直接用于交易。';
  }

  syncData() {
    const loc = this.charData?.status?.loc || "未知区域";
    const fedCoin = this.charData?.wealth?.fed_coin || 0;
    const fame = this.charData?.social?.reputation || 0;

    this.$('#ui-loc').textContent = loc;
    this.$('#ui-fedcoin').textContent = fedCoin.toLocaleString();
    this.$('#ui-fame').textContent = fame.toLocaleString();

    const currentCity = this.worldData?.locations?.[loc];
    this.currentStores = currentCity?.stores || {};
    this.currentAuction = this.worldData?.auction || { status: "休市", items: {} };

    this.populateShopData();
    this.populateSellData();
    this.populateAuctionData();
    this.updatePrivPreview();
  }

  // --- 估值与上下文 (复刻原版) ---
  estimateBasePrice(itemName, itemType = "物品") {
    if (/斗铠/.test(itemName)) return 0;
    if (/机甲/.test(itemName)) {
      if (/红级/.test(itemName)) return 5000000000;
      if (/黑级/.test(itemName)) return 1000000000;
      if (/紫级/.test(itemName)) return 80000000;
      if (/黄级/.test(itemName)) return 6000000;
      return 6000000;
    }
    let tier = 1;
    if (/天锻|十万年/.test(itemName)) tier = 5;
    else if (/魂锻|万年/.test(itemName)) tier = 4;
    else if (/灵锻|千年/.test(itemName)) tier = 3;
    else if (/千锻|百年/.test(itemName)) tier = 2;
    else if (/百锻/.test(itemName)) tier = 1;

    let metalBasePrice = 10000;
    if (tier === 5) metalBasePrice = 500000000;
    else if (tier === 4) metalBasePrice = 80000000;
    else if (tier === 3) metalBasePrice = 10000000;
    else if (tier === 2) metalBasePrice = 500000;
    else if (tier === 1) metalBasePrice = 50000;

    let metalCount = 1;
    let match = itemName.match(/(\d+)种金属/);
    if (match) metalCount = parseInt(match[1]);
    else if (/融锻/.test(itemName)) metalCount = 2;

    let totalMetalPrice = metalBasePrice * (1 + (metalCount - 1) * 0.3);

    if (itemType === "图纸") return Math.floor(totalMetalPrice * 0.2);
    else if (itemType === "消耗品" || itemType === "修复包") return Math.floor(totalMetalPrice * 0.1);
    else return Math.floor(totalMetalPrice * 1.0);
  }

  clampTrade(value, min, max) {
    return Math.max(min, Math.min(max, Number(value || 0)));
  }

  normalizeLocForMatch(location) {
    const raw = String(location || '').replace(/^斗罗大陆-/, '').replace(/^斗灵大陆-/, '').trim();
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

  getPrivateTradeContext(action, targetNpcName, itemName, qty, price) {
    const ctx = {
      action, targetNpcName, targetChar: null, relationScore: 0, successRate: 0,
      basePrice: Math.max(0, this.estimateBasePrice(itemName, "物品")),
      total: Math.max(0, Number(price || 0) * Math.max(1, Number(qty || 1))),
      error: null, note: '', npcItem: null, playerItem: null
    };
    if (!itemName) { ctx.error = '请输入交易物品名称。'; return ctx; }
    if (!targetNpcName) { ctx.error = '请输入交易对象 NPC。'; return ctx; }

    const resolvedTarget = this.resolveCharacterByName(targetNpcName);
    const targetChar = resolvedTarget.char;
    const relationName = resolvedTarget.displayName || targetNpcName;
    ctx.targetChar = targetChar || null;
    if (!targetChar) { ctx.error = `找不到交易对象【${targetNpcName}】。`; return ctx; }

    const currentLoc = String(this.charData?.status?.loc || '');
    const targetLoc = String(targetChar?.status?.loc || '');
    if (currentLoc && targetLoc && !this.isLocationCompatible(currentLoc, targetLoc)) {
      ctx.error = `【${targetNpcName}】当前不在你身边，无法进行私下交易。`; return ctx;
    }
    if (ctx.basePrice <= 0) {
      ctx.error = `【${itemName}】当前无法进行可靠估值，私下交易无法发起。`; return ctx;
    }
    
    ctx.relationScore = Number(this.charData?.social?.relations?.[targetNpcName]?.好感度 || this.charData?.social?.relations?.[relationName]?.好感度 || 0);
    const priceDeltaRatio = (Number(price || 0) - ctx.basePrice) / Math.max(1, ctx.basePrice);

    if (action === "私下买入") {
      ctx.npcItem = targetChar?.inventory?.[itemName] || null;
      if ((this.charData?.wealth?.fed_coin || 0) < ctx.total) {
        ctx.error = `联邦币不足，完成该交易需要 ${ctx.total.toLocaleString()}。`; return ctx;
      }
      if (!ctx.npcItem || Number(ctx.npcItem.数量 || 0) < qty) {
        ctx.error = `【${targetNpcName}】当前并没有足够的【${itemName}】可供出售。`; return ctx;
      }
      ctx.successRate = this.clampTrade(60 + Math.floor(ctx.relationScore * 0.25) + Math.floor(priceDeltaRatio * 50), 5, 95);
      ctx.note = `好感 ${ctx.relationScore} / 对方持有 ${Number(ctx.npcItem?.数量 || 0)} / 预计成交率 ${ctx.successRate}%`;
    } else {
      ctx.playerItem = this.charData?.inventory?.[itemName] || null;
      if (!ctx.playerItem || Number(ctx.playerItem.数量 || 0) < qty) {
        ctx.error = '背包数量不足！'; return ctx;
      }
      if ((targetChar?.wealth?.fed_coin || 0) < ctx.total) {
        ctx.error = `【${targetNpcName}】的联邦币不足，无法完成这笔收购。`; return ctx;
      }
      ctx.successRate = this.clampTrade(60 + Math.floor(ctx.relationScore * 0.25) - Math.floor(priceDeltaRatio * 55), 5, 95);
      ctx.note = `好感 ${ctx.relationScore} / 对方现金 ${(Number(targetChar?.wealth?.fed_coin || 0)).toLocaleString()} / 预计成交率 ${ctx.successRate}%`;
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
    return `斗罗历${20000 + years}年${months}月${currentDay}日 ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  resolveTradeItemInfo(itemName, item = {}, fallback = {}) {
    const safeItem = item && typeof item === 'object' ? item : {};
    const type = String(safeItem.类型 || safeItem.type || fallback.type || '物品');
    const rarity = String(safeItem.品质 || safeItem.品阶 || safeItem.tier || fallback.rarity || '标准');
    const expiryTick = Number(safeItem.有效期至tick ?? fallback.expiryTick ?? 0);
    const expiry = expiryTick > 0 ? this.formatTickToCalendarDateText(expiryTick) : (String(safeItem.有效期至 || fallback.expiry || '').trim() || '无期限');
    const trigger = String(safeItem.触发方式 || fallback.trigger || (/食物/.test(type) ? '食用' : '常规'));
    const source = String(safeItem.来源技能 || safeItem.绑定者 || fallback.source || '常规流通');
    const desc = String(safeItem.描述 || safeItem.description || fallback.desc || '暂无说明');
    return {
      name: itemName,
      type,
      rarity,
      trigger,
      expiry,
      source,
      desc,
      expiryTick,
      temporary: expiryTick > 0 || expiry !== '无期限'
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
      数量: qty,
      类型: safeItem.类型 || safeItem.type || fallback.type || '物品',
      品质: safeItem.品质 || safeItem.tier || fallback.rarity || '标准',
      描述: safeItem.描述 || safeItem.description || fallback.desc || `获得了【${itemName}】`
    };
    const resolvedExpiryTick = Number(safeItem.有效期至tick ?? fallback.expiryTick ?? 0);
    const resolvedExpiry = resolvedExpiryTick > 0 ? this.formatTickToCalendarDateText(resolvedExpiryTick) : String(safeItem.有效期至 || fallback.expiry || '').trim();
    if (safeItem.品阶 !== undefined) nextItem.品阶 = safeItem.品阶;
    if (safeItem.触发方式 !== undefined || fallback.trigger !== undefined) nextItem.触发方式 = safeItem.触发方式 || fallback.trigger || (/食物/.test(String(nextItem.类型 || '')) ? '食用' : '常规');
    if (resolvedExpiry) nextItem.有效期至 = resolvedExpiry;
    if (resolvedExpiryTick > 0) nextItem.有效期至tick = resolvedExpiryTick;
    if (safeItem.来源技能 !== undefined || safeItem.绑定者 !== undefined || fallback.source !== undefined) nextItem.来源技能 = safeItem.来源技能 || safeItem.绑定者 || fallback.source;
    if (Array.isArray(safeItem.使用效果)) nextItem.使用效果 = safeItem.使用效果;
    else if (Array.isArray(safeItem.effects)) nextItem.使用效果 = safeItem.effects;
    if (Array.isArray(safeItem.标签)) nextItem.标签 = safeItem.标签;
    if (safeItem.market_value && typeof safeItem.market_value === 'object') nextItem.market_value = safeItem.market_value;
    if (safeItem.可交易 !== undefined) nextItem.可交易 = safeItem.可交易;
    return nextItem;
  }

  buildTradeItemMetadataPatches(itemPath, currentItem = {}, nextItem = {}) {
    const patches = [];
    ['类型', '品质', '品阶', '描述', '触发方式', '有效期至', '有效期至tick', '来源技能'].forEach(field => {
      const nextVal = nextItem[field];
      const curVal = currentItem ? currentItem[field] : undefined;
      if (nextVal === undefined || nextVal === null || nextVal === '') return;
      if (curVal === undefined || curVal === null || curVal === '' || curVal === '无') {
        patches.push({ op: 'replace', path: `${itemPath}/${this.escapeJsonPointer(field)}`, value: nextVal });
      }
    });
    if (Array.isArray(nextItem.使用效果) && (!Array.isArray(currentItem?.使用效果) || currentItem.使用效果.length === 0)) {
      patches.push({ op: 'replace', path: `${itemPath}/${this.escapeJsonPointer('使用效果')}`, value: nextItem.使用效果 });
    }
    return patches;
  }

  escapeJsonPointer(str) {
    return String(str).replace(/~/g, '~0').replace(/\//g, '~1');
  }

  buildTradeSystemPatches(logText, options = {}) {
    const patches = [
      { op: "replace", path: `/sys/rsn`, value: String(logText || '') }
    ];
    if (Number.isFinite(Number(options.roll))) {
      patches.push({ op: "replace", path: `/sys/last_roll`, value: Number(options.roll) });
    }
    if (Number.isFinite(Number(options.successRate))) {
      patches.push({ op: "replace", path: `/sys/fsr`, value: Number(options.successRate) });
    }
    return patches;
  }

  buildFrontEndStateBlock(analysis, patchOps) {
    const safeAnalysis = String(analysis || 'Trade action prepared.').trim();
    return `<UpdateVariable>\n<Analysis>${safeAnalysis}</Analysis>\n<JSONPatch>\n${JSON.stringify(patchOps || [], null, 2)}\n</JSONPatch>\n</UpdateVariable>`;
  }

  submitAction(playerInput, sysPrompt, requestKind) {
    if (this.options.onTradeAction) {
      this.options.onTradeAction({
        playerInput,
        systemPrompt: sysPrompt,
        requestKind
      });
    }
  }

  // --- 商店采购模块 ---
  populateShopData() {
    const storeSel = this.$('#shop-store-sel');
    storeSel.innerHTML = '';
    if (Object.keys(this.currentStores).length === 0) {
      storeSel.innerHTML = '<option value="">[当前区域无商店]</option>';
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
    
    if (!storeName || !this.currentStores[storeName] || !this.currentStores[storeName].inventory) {
      itemSel.innerHTML = '<option value="">[该商店无货]</option>';
      this.updateShopPreview();
      return;
    }

    const inv = this.currentStores[storeName].inventory;
    let hasItem = false;
    for (const iName in inv) {
      if (inv[iName].stock > 0) {
        const opt = document.createElement('option');
        opt.value = iName;
        opt.textContent = `${iName} (库存: ${inv[iName].stock})`;
        itemSel.appendChild(opt);
        hasItem = true;
      }
    }
    if (!hasItem) itemSel.innerHTML = '<option value="">[商品已售罄]</option>';
    this.updateShopPreview();
  }

  updateShopPreview() {
    const storeName = this.$('#shop-store-sel').value;
    const itemName = this.$('#shop-item-sel').value;
    const qty = parseInt(this.$('#shop-qty').value) || 1;
    const btn = this.$('#btn-buy');

    if (!storeName || !itemName || !this.currentStores[storeName]?.inventory?.[itemName]) {
      this.$('#shop-price').textContent = '-';
      this.$('#shop-total').textContent = '-';
      this.$('#shop-fame').textContent = '-';
      this.$('#shop-stock').textContent = '-';
      btn.disabled = true;
      this.updateTradeMetaPanel('shop', null);
      return;
    }

    const item = this.currentStores[storeName].inventory[itemName];
    const total = item.price * qty;
    const userFame = this.charData?.social?.reputation || 0;
    const storeData = this.currentStores[storeName] || {};
    const currency = this.resolveTradeCurrency(item, storeName, this.charData?.status?.loc || '', storeData);
    const userCoin = this.charData?.wealth?.[currency] || 0;

    this.$('#shop-price').textContent = `${item.price.toLocaleString()} ${this.getCurrencyLabel(currency)}`;
    
    const totalEl = this.$('#shop-total');
    totalEl.textContent = `${total.toLocaleString()} ${this.getCurrencyLabel(currency)}`;
    totalEl.className = (userCoin >= total) ? "val-highlight" : "val-warn";

    const fameEl = this.$('#shop-fame');
    fameEl.textContent = item.req_fame || 0;
    fameEl.className = (userFame >= (item.req_fame || 0)) ? "val-highlight" : "val-warn";

    const stockEl = this.$('#shop-stock');
    stockEl.textContent = item.stock;
    stockEl.className = (item.stock >= qty) ? "val-highlight" : "val-warn";

    this.updateTradeMetaPanel('shop', this.resolveTradeItemInfo(itemName, item, { source: storeName, desc: item.description || `可在 ${storeName} 购得` }));

    if (!this.isCurrencySpendable(currency)) {
      totalEl.className = "val-warn";
      totalEl.textContent = this.getCurrencyBlockedMessage(currency);
      btn.disabled = true;
      return;
    }

    btn.disabled = (userCoin < total || userFame < (item.req_fame || 0) || item.stock < qty);
  }

  executeShopBuy() {
    const storeName = this.$('#shop-store-sel').value;
    const itemName = this.$('#shop-item-sel').value;
    const qty = parseInt(this.$('#shop-qty').value) || 1;
    const item = this.currentStores[storeName].inventory[itemName];
    const total = item.price * qty;
    const storeData = this.currentStores[storeName] || {};
    const currency = this.resolveTradeCurrency(item, storeName, this.charData?.status?.loc || '', storeData);

    if (!this.isCurrencySpendable(currency)) return alert(this.getCurrencyBlockedMessage(currency));

    let loc = this.charData?.status?.loc || "";
    let isTier4_5 = /天锻|四字|红级|十万年|魂锻|三字|黑级|万年/.test(itemName);
    let isTier2_3 = /灵锻|二字|紫级|千年|千锻|一字|黄级|百年/.test(itemName);
    const locMeta = this.worldData?.locations?.[loc] || {};
    const economy = String(locMeta['经济状况'] || '未知');
    let isTier1City = economy === '繁荣';
    let isTier2_3City = economy === '繁荣' || economy === '普通';

    if (isTier4_5 && !isTier1City) return alert("当前城市级别不足！4~5阶战略资源请前往一线主城购买。");
    if (isTier2_3 && !isTier2_3City) return alert("偏远地区物资匮乏，无法提供2~3阶资源。");

    let patchOps = [];
    let newWealth = (this.charData.wealth[currency] || 0) - total;
    patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/wealth/${currency}`, value: newWealth });
    patchOps.push({ op: "replace", path: `/world/locations/${this.escapeJsonPointer(loc)}/stores/${this.escapeJsonPointer(storeName)}/inventory/${this.escapeJsonPointer(itemName)}/stock`, value: item.stock - qty });
    
    let invItem = this.charData.inventory?.[itemName];
    const nextItem = this.buildInventoryItemFromTradeSource(itemName, item, qty, { source: storeName, desc: item.description || `购自${storeName}` });
    const itemPath = `${this.activeCharBasePath}/inventory/${this.escapeJsonPointer(itemName)}`;
    if (invItem) {
      patchOps.push({ op: "replace", path: `${itemPath}/数量`, value: (invItem.数量 || 0) + qty });
      patchOps.push(...this.buildTradeItemMetadataPatches(itemPath, invItem, nextItem));
    } else {
      patchOps.push({ op: "replace", path: itemPath, value: nextItem });
    }

    const log = `[交易成功] ${this.activeName}在 ${storeName} 花费 ${total} ${this.getCurrencyLabel(currency)} 购买了 ${qty} 份【${itemName}】。`;
    patchOps.push(...this.buildTradeSystemPatches(log));

    let sysPrompt = `${HIDDEN_ARBITRATION_NARRATION_RULES}\n\n${log}\n\n${this.buildFrontEndStateBlock('Shop trade successful.', patchOps)}`;

    this.submitAction(`我要在【${storeName}】购买 ${qty} 份【${itemName}】。`, sysPrompt, 'trade_shop_buy');
  }

  // --- 资产出售模块 ---
  populateSellData() {
    const invSel = this.$('#sell-item-sel');
    invSel.innerHTML = '';
    let hasItem = false;
    for (const iName in (this.charData?.inventory || {})) {
      const item = this.charData.inventory[iName];
      if (item.数量 > 0) {
        const opt = document.createElement('option');
        opt.value = iName;
        opt.textContent = `${iName} (拥有: ${item.数量})`;
        invSel.appendChild(opt);
        hasItem = true;
      }
    }
    if (!hasItem) invSel.innerHTML = '<option value="">[背包空空如也]</option>';
    this.updateSellPreview();
  }

  updateSellPreview() {
    const itemName = this.$('#sell-item-sel').value;
    const qty = parseInt(this.$('#sell-qty').value) || 1;
    const btn = this.$('#btn-sell');

    if (!itemName || !this.charData.inventory?.[itemName]) {
      this.$('#sell-base-price').textContent = '-';
      this.$('#sell-total').textContent = '-';
      btn.disabled = true;
      this.updateTradeMetaPanel('sell', null);
      return;
    }

    const item = this.charData.inventory[itemName];
    const basePrice = this.estimateBasePrice(itemName, item.类型);
    const sellPrice = Math.floor(basePrice * 0.5);
    const total = sellPrice * qty;

    this.updateTradeMetaPanel('sell', this.resolveTradeItemInfo(itemName, item, { source: item?.来源技能 || item?.绑定者 || '背包持有' }));

    if (basePrice === 0) {
      this.$('#sell-base-price').textContent = "禁售物品";
      this.$('#sell-total').textContent = "无法交易";
      btn.disabled = true;
    } else {
      this.$('#sell-base-price').textContent = `${sellPrice.toLocaleString()} ${this.getCurrencyLabel('fed_coin')}`;
      this.$('#sell-total').textContent = `${total.toLocaleString()} ${this.getCurrencyLabel('fed_coin')}`;
      btn.disabled = (item.数量 < qty);
    }
  }

  executeSell() {
    const itemName = this.$('#sell-item-sel').value;
    const qty = parseInt(this.$('#sell-qty').value) || 1;
    const itemType = this.charData.inventory[itemName].类型;
    const basePrice = this.estimateBasePrice(itemName, itemType);
    const totalEarn = Math.floor(basePrice * 0.5) * qty;

    let patchOps = [];
    let newQty = this.charData.inventory[itemName].数量 - qty;
    if (newQty <= 0) {
      patchOps.push({ op: "remove", path: `${this.activeCharBasePath}/inventory/${this.escapeJsonPointer(itemName)}` });
    } else {
      patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/inventory/${this.escapeJsonPointer(itemName)}/数量`, value: newQty });
    }
    patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/wealth/fed_coin`, value: (this.charData.wealth.fed_coin || 0) + totalEarn });

    const log = `[交易成功] ${this.activeName}向系统商店出售了 ${qty} 份【${itemName}】，获得 ${totalEarn} 联邦币。`;
    patchOps.push(...this.buildTradeSystemPatches(log));

    let sysPrompt = `${HIDDEN_ARBITRATION_NARRATION_RULES}\n\n${log}\n\n${this.buildFrontEndStateBlock('Sell successful.', patchOps)}`;

    this.submitAction(`我要卖出 ${qty} 份【${itemName}】换钱。`, sysPrompt, 'trade_system_sell');
  }

  // --- 私下交易模块 ---
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

    this.$('#priv-base-price').textContent = ctx.basePrice > 0 ? `${ctx.basePrice.toLocaleString()} ${this.getCurrencyLabel('fed_coin')}` : '未知/禁售';
    this.$('#priv-total').textContent = `${total.toLocaleString()} ${this.getCurrencyLabel('fed_coin')}`;

    const previewItem = action === '私下买入' ? ctx.npcItem : ctx.playerItem;
    this.updateTradeMetaPanel('priv', previewItem ? this.resolveTradeItemInfo(itemName, previewItem, { source: action === '私下买入' ? targetNpc : this.activeName }) : null);

    btn.disabled = false;
    attEl.className = "";

    if (ctx.error) {
      attEl.textContent = ctx.error;
      attEl.className = "val-warn";
      btn.disabled = true;
      return;
    }

    attEl.textContent = `${action === "私下买入" ? '可尝试成交' : '可尝试出手'}｜${ctx.note}`;
    attEl.className = ctx.successRate >= 60 ? "val-highlight" : "val-warn";
  }

  executePrivateTrade() {
    const action = this.$('#priv-action').value;
    const targetNpc = this.$('#priv-npc').value || "神秘商人";
    const itemName = this.$('#priv-item').value;
    const qty = parseInt(this.$('#priv-qty').value) || 1;
    const price = parseInt(this.$('#priv-price').value) || 1;
    const ctx = this.getPrivateTradeContext(action, targetNpc, itemName, qty, price);
    if (ctx.error) return alert(ctx.error);

    let patchOps = [];
    let log = "";
    const roll = Math.floor(Math.random() * 100) + 1;
    const isSuccess = roll <= ctx.successRate;

    if (action === "私下买入") {
      if (!isSuccess) {
        log = `[私下交易失败] ${this.activeName}向 ${targetNpc} 开价 ${price}（估值约 ${ctx.basePrice}），对方没有接受。好感 ${ctx.relationScore}，Roll ${roll} > 成功率 ${ctx.successRate}。`;
      } else {
        patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/wealth/fed_coin`, value: (this.charData.wealth.fed_coin || 0) - ctx.total });
        let invItem = this.charData.inventory?.[itemName];
        const nextItem = this.buildInventoryItemFromTradeSource(itemName, ctx.npcItem, qty, { source: targetNpc, desc: `从 ${targetNpc} 处私下购得` });
        const itemPath = `${this.activeCharBasePath}/inventory/${this.escapeJsonPointer(itemName)}`;
        if (invItem) {
          patchOps.push({ op: "replace", path: `${itemPath}/数量`, value: (invItem.数量 || 0) + qty });
          patchOps.push(...this.buildTradeItemMetadataPatches(itemPath, invItem, nextItem));
        } else patchOps.push({ op: "replace", path: itemPath, value: nextItem });
        const npcNextQty = Number(ctx.npcItem?.数量 || 0) - qty;
        if (npcNextQty <= 0) patchOps.push({ op: "remove", path: `/char/${this.escapeJsonPointer(targetNpc)}/inventory/${this.escapeJsonPointer(itemName)}` });
        else patchOps.push({ op: "replace", path: `/char/${this.escapeJsonPointer(targetNpc)}/inventory/${this.escapeJsonPointer(itemName)}/数量`, value: npcNextQty });
        patchOps.push({ op: "replace", path: `/char/${this.escapeJsonPointer(targetNpc)}/wealth/fed_coin`, value: (ctx.targetChar?.wealth?.fed_coin || 0) + ctx.total });
        log = `[私下交易成功] ${this.activeName}以总价 ${ctx.total} 联邦币从 ${targetNpc} 处买入 ${qty} 份【${itemName}】。好感 ${ctx.relationScore}，Roll ${roll} ≤ 成功率 ${ctx.successRate}。`;
      }
    } else {
      if (!isSuccess) {
        log = `[私下交易失败] ${this.activeName}向 ${targetNpc} 报价 ${price}（估值约 ${ctx.basePrice}），对方未愿接手。好感 ${ctx.relationScore}，Roll ${roll} > 成功率 ${ctx.successRate}。`;
      } else {
        let newQty = this.charData.inventory[itemName].数量 - qty;
        if (newQty <= 0) patchOps.push({ op: "remove", path: `${this.activeCharBasePath}/inventory/${this.escapeJsonPointer(itemName)}` });
        else patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/inventory/${this.escapeJsonPointer(itemName)}/数量`, value: newQty });
        patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/wealth/fed_coin`, value: (this.charData.wealth.fed_coin || 0) + ctx.total });
        const npcInv = ctx.targetChar?.inventory?.[itemName];
        const npcItem = this.buildInventoryItemFromTradeSource(itemName, this.charData.inventory[itemName], qty, { source: this.activeName, desc: `从${this.activeName}处私下收购` });
        const npcItemPath = `/char/${this.escapeJsonPointer(targetNpc)}/inventory/${this.escapeJsonPointer(itemName)}`;
        if (npcInv) {
          patchOps.push({ op: "replace", path: `${npcItemPath}/数量`, value: (npcInv.数量 || 0) + qty });
          patchOps.push(...this.buildTradeItemMetadataPatches(npcItemPath, npcInv, npcItem));
        } else patchOps.push({ op: "replace", path: npcItemPath, value: npcItem });
        patchOps.push({ op: "replace", path: `/char/${this.escapeJsonPointer(targetNpc)}/wealth/fed_coin`, value: (ctx.targetChar?.wealth?.fed_coin || 0) - ctx.total });
        log = `[私下交易成功] ${this.activeName}以单价 ${price} 向 ${targetNpc} 卖出 ${qty} 份【${itemName}】，获得 ${ctx.total} 联邦币。好感 ${ctx.relationScore}，Roll ${roll} ≤ 成功率 ${ctx.successRate}。`;
      }
    }

    patchOps.push(...this.buildTradeSystemPatches(log, { roll, successRate: ctx.successRate }));

    let sysPrompt = `${HIDDEN_ARBITRATION_NARRATION_RULES}\n\n${log}\n\n${this.buildFrontEndStateBlock('Private trade executed.', patchOps)}`;

    this.submitAction(`我要和【${targetNpc}】${action} ${qty} 份【${itemName}】，单价出 ${price} 联邦币。`, sysPrompt, 'trade_private');
  }

  // --- 拍卖行模块 ---
  populateAuctionData() {
    const sel = this.$('#auc-item-sel');
    sel.innerHTML = '';
    if (this.currentAuction.status === "休市" || !this.currentAuction.items || Object.keys(this.currentAuction.items).length === 0) {
      sel.innerHTML = '<option value="">[拍卖行休市或无拍品]</option>';
      this.updateAucPreview();
      return;
    }
    for (const iName in this.currentAuction.items) {
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

    if (!itemName || !this.currentAuction.items?.[itemName]) {
      this.$('#auc-current-price').textContent = '-';
      this.$('#auc-desc').textContent = '-';
      btn.disabled = true;
      return;
    }

    const item = this.currentAuction.items[itemName];
    const currency = this.resolveTradeCurrency(item, '拍卖行', this.charData?.status?.loc || '', this.currentAuction || {});
    this.$('#auc-current-price').textContent = `${item.price.toLocaleString()} ${this.getCurrencyLabel(currency)}`;
    this.$('#auc-desc').textContent = `[${item.tier}] ${item.lore}`;

    const userCoin = this.charData?.wealth?.[currency] || 0;
    if (!this.isCurrencySpendable(currency)) {
      btn.disabled = true;
      return;
    }
    btn.disabled = (bid <= item.price || userCoin < bid);
  }

  executeAuction() {
    const itemName = this.$('#auc-item-sel').value;
    const bid = parseInt(this.$('#auc-bid').value) || 0;
    const item = this.currentAuction.items[itemName];
    const currency = this.resolveTradeCurrency(item, '拍卖行', this.charData?.status?.loc || '', this.currentAuction || {});

    if (!this.isCurrencySpendable(currency)) return alert(this.getCurrencyBlockedMessage(currency));

    let patchOps = [];
    patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/wealth/${currency}`, value: (this.charData.wealth[currency] || 0) - bid });
    
    let invItem = this.charData.inventory?.[itemName];
    if (invItem) {
      patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/inventory/${this.escapeJsonPointer(itemName)}/数量`, value: (invItem.数量 || 0) + 1 });
    } else {
      patchOps.push({ op: "replace", path: `${this.activeCharBasePath}/inventory/${this.escapeJsonPointer(itemName)}`, value: { 数量: 1, 类型: "极品", 品质: item.tier, 描述: item.lore } });
    }
    patchOps.push({ op: "remove", path: `/world/auction/items/${this.escapeJsonPointer(itemName)}` });

    const log = `[竞拍成功] ${this.activeName}豪掷 ${bid} ${this.getCurrencyLabel(currency)} 拍下了极品【${itemName}】！`;
    patchOps.push(...this.buildTradeSystemPatches(log));

    let sysPrompt = `${HIDDEN_ARBITRATION_NARRATION_RULES}\n\n${log}\n\n${this.buildFrontEndStateBlock('Auction won.', patchOps)}`;

    this.submitAction(`【举牌竞拍】我出价 ${bid} 竞拍【${itemName}】！`, sysPrompt, 'trade_auction');
  }
}

// 向全局挂载
window.mountTradeUI = function(containerElement, snapshot, options = {}) {
  return new TradeUIComponent(containerElement, snapshot, options);
};
