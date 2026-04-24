import { create } from 'zustand';

export const useMarketStore = create((set) => ({
    // ═══ Watchlists ═══
    watchlists: {
      'Favorites': ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'],
      'Nifty 50': ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'],
      'Crypto': ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT'],
      'Forex': ['USDINR', 'EURUSD', 'GBPUSD'],
    },
    activeWatchlist: 'Favorites',
    activeSymbol: 'BTCUSDT',

    // ═══ Trading Mode (Global Toggle) ═══
    tradingMode: 'mock', // 'mock' or 'real'

    // ═══ Sniper Crosshairs (Fast Lane — 1-3 Hot Assets) ═══
    sniperAssets: [],
    // Format: { symbol, price, ofi_score, action, conviction, alpha_score, is_locked }

    // ═══ Sentinel Radar (AI Scanner) ═══
    scannerAlerts: [],
    // Format: { ticker, reason, probability, action, market_state, timestamp }

    // ═══ Position Lock & Portfolio ═══
    lockedSymbols: [],
    openPositions: [],
    // Format: { symbol, side, qty, avg_price, current_price, unrealized_pnl, is_locked }
    portfolioStats: {
      balance: 100000,
      total_pnl: 0,
      unrealized_pnl: 0,
      total_trades: 0,
      win_rate: 0,
      open_positions: 0,
    },

    // ═══ Provider Status ═══
    providerStatus: {
      binance: 'disconnected',
      upstox: 'disconnected',
      forex: 'disconnected',
      coingecko: 'disconnected',
    },

    // ═══ Market Data Cache ═══
    tickerData: {},

    // ═══ Active Symbol's Market State ═══
    marketState: 'DEAD_ZONE',
    narrative: 'Connecting to engine...',
    candleColor: 'normal',

    // ═══ UI State ═══
    activeTimeframe: '5m',
    chartType: 'candlestick',
    isSearchOpen: false,
    isExecuteOpen: false,
    activeBottomTab: 'engine',

    // ═══ Analytics (HUD Data) ═══
    alphaScore: null,
    action: null,
    vpin: null,
    ofi: null,
    hurst: null,
    entropy: null,

    // ═══ Actions ═══
    setActiveSymbol: (symbol) => set({ activeSymbol: symbol }),
    setActiveTimeframe: (tf) => set({ activeTimeframe: tf }),
    setActiveWatchlist: (listId) => set({ activeWatchlist: listId }),
    setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
    setExecuteOpen: (isOpen) => set({ isExecuteOpen: isOpen }),
    setActiveBottomTab: (tab) => set({ activeBottomTab: tab }),

    setTradingMode: (mode) => set({ tradingMode: mode }),

    updateTicker: (symbol, data) => set((state) => {
      const newTickerData = {
        ...state.tickerData,
        [symbol]: { ...state.tickerData[symbol], ...data }
      };

      const updates = { tickerData: newTickerData };
      if (symbol === state.activeSymbol) {
        if (data.market_state !== undefined) updates.marketState = data.market_state;
        if (data.narrative !== undefined) updates.narrative = data.narrative;
        if (data.candle_color !== undefined) updates.candleColor = data.candle_color;
        if (data.alpha_score !== undefined) updates.alphaScore = Math.round(data.alpha_score);
        if (data.vpin !== undefined) updates.vpin = data.vpin.toFixed(2);
        if (data.ofi !== undefined) updates.ofi = data.ofi.toFixed(1);
        if (data.hurst !== undefined) updates.hurst = data.hurst.toFixed(2);
        if (data.entropy !== undefined) updates.entropy = data.entropy.toFixed(2);
        if (data.action !== undefined) updates.action = data.action;
      }

      return updates;
    }),

    // ═══ Sniper Crosshairs ═══
    updateSniperAssets: (assets) => set({ sniperAssets: assets }),

    promoteToCrosshairs: (symbol) => set((state) => {
      if (state.sniperAssets.find(a => a.symbol === symbol)) return state;
      const newSniper = [{ symbol, promoted_at: Date.now() }, ...state.sniperAssets].slice(0, 3);
      return { sniperAssets: newSniper };
    }),

    demoteFromCrosshairs: (symbol) => set((state) => ({
      sniperAssets: state.sniperAssets.filter(a => a.symbol !== symbol),
    })),

    // ═══ Scanner / Sentinel Radar ═══
    addScannerAlert: (alert) => set((state) => {
      const exists = state.scannerAlerts.find(
        a => a.ticker === alert.ticker && (alert.timestamp - a.timestamp) < 30
      );
      if (exists) return state;
      const newAlerts = [alert, ...state.scannerAlerts].slice(0, 10);
      return { scannerAlerts: newAlerts };
    }),

    // ═══ Portfolio & Positions ═══
    updatePortfolio: (stats) => set({
      portfolioStats: stats,
      openPositions: stats.positions || [],
      lockedSymbols: stats.locked_symbols || [],
    }),

    updatePositions: (positions) => set({ openPositions: positions }),

    updateLockedSymbols: (symbols) => set({ lockedSymbols: symbols }),

    // ═══ Provider Status ═══
    updateProviderStatus: (status) => set({ providerStatus: status }),

    // ═══ Watchlist Management ═══
    addToWatchlist: (listId, symbol) => set((state) => {
      const currentList = state.watchlists[listId] || [];
      if (currentList.includes(symbol)) return state;
      return {
        watchlists: {
          ...state.watchlists,
          [listId]: [...currentList, symbol]
        }
      };
    }),

    removeFromWatchlist: (listId, symbol) => set((state) => {
      // Position Lock: cannot remove locked symbols
      if (state.lockedSymbols.includes(symbol)) return state;
      return {
        watchlists: {
          ...state.watchlists,
          [listId]: state.watchlists[listId].filter(s => s !== symbol)
        }
      };
    }),
  }));
