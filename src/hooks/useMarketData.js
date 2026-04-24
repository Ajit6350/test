/**
 * Quant Bridge — Real-time Market Data Hook.
 * Single WebSocket pipe to Harvester (API Gateway).
 * Handles: TITAN_SIGNAL, SCANNER_ALERT, PORTFOLIO_UPDATE, PROVIDER_STATUS.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { useMarketStore } from '../stores/useMarketStore';
import { getWsUrl } from '../services/api';

export const useMarketData = () => {
  const {
    updateTicker, addScannerAlert, updatePortfolio,
    updateProviderStatus, updateSniperAssets,
    watchlists, activeSymbol
  } = useMarketStore();
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptRef = useRef(0);
  const subscribedSymbolsRef = useRef(new Set());
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
    }

    const wsUrl = getWsUrl();
    console.log(`[QB] Connecting to Harvester Gateway: ${wsUrl}`);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[QB] ⚡ Connected to Titan-Harvester Gateway');
        setIsConnected(true);
        reconnectAttemptRef.current = 0;
        subscribedSymbolsRef.current.clear();

        // Subscribe to all watchlist symbols
        const allSymbols = new Set();
        Object.values(watchlists).forEach(list => list.forEach(s => allSymbols.add(s)));
        allSymbols.forEach(symbol => {
          ws.send(JSON.stringify({ type: 'SUBSCRIBE', symbol }));
          subscribedSymbolsRef.current.add(symbol);
        });

        // Also subscribe to the currently active symbol (in case it's not in watchlist)
        if (activeSymbol && !subscribedSymbolsRef.current.has(activeSymbol)) {
          ws.send(JSON.stringify({ type: 'SUBSCRIBE', symbol: activeSymbol }));
          subscribedSymbolsRef.current.add(activeSymbol);
        }

        // Request initial portfolio state
        ws.send(JSON.stringify({ type: 'GET_PORTFOLIO' }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // ═══ TITAN_SIGNAL — per-tick quant data ═══
          if (data.type === 'TITAN_SIGNAL' && data.ticker) {
            updateTicker(data.ticker, {
              price: data.price,
              change: data.change || 0,
              volume: data.volume || 0,
              ofi: data.ofi || 0,
              sweep: data.sweep || false,
              hurst: data.hurst,
              entropy: data.entropy,
              dfa: data.dfa || 0.5,
              vpin: data.vpin || 0.5,
              fractal_dim: data.fractal_dim || 1.5,
              wave_active: data.wave_active || false,
              regime: data.regime || 'UNKNOWN',
              probability: data.probability,
              alpha_score: data.alpha_score || 0,
              edge_score: data.edge_score || 0,
              sentiment: data.sentiment,
              conviction: data.conviction,
              action: data.action,
              kelly_fraction: data.kelly_fraction || 0,
              market_state: data.market_state || 'DEAD_ZONE',
              narrative: data.narrative || '',
              candle_color: data.candle_color || 'normal',
              status: data.status,
            });
          }

          // ═══ SCANNER_ALERT — Sentinel Radar picks ═══
          if (data.type === 'SCANNER_ALERT' && data.ticker) {
            addScannerAlert({
              ticker: data.ticker,
              reason: data.reason || '',
              probability: data.probability || 50,
              action: data.action || 'HOLD',
              market_state: data.market_state || '',
              timestamp: data.timestamp || Date.now() / 1000,
            });
          }

          // ═══ PORTFOLIO_UPDATE — positions, P&L, locked symbols ═══
          if (data.type === 'PORTFOLIO_UPDATE') {
            updatePortfolio(data);

            // Update sniper assets from fast_lane
            if (data.fast_lane) {
              updateSniperAssets(data.fast_lane);
            }
          }

          // ═══ PROVIDER_STATUS — connection health per provider ═══
          if (data.type === 'PROVIDER_STATUS' && data.providers) {
            updateProviderStatus(data.providers);
          }

        } catch {
          // Silently ignore parse errors
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 30000);
        reconnectAttemptRef.current += 1;
        console.log(`[QB] Disconnected. Reconnecting in ${delay / 1000}s...`);
        // eslint-disable-next-line react-hooks/immutability
        reconnectTimeoutRef.current = setTimeout(() => connect(), delay);
      };

      ws.onerror = () => {};
    } catch {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 30000);
      reconnectAttemptRef.current += 1;
      reconnectTimeoutRef.current = setTimeout(() => connect(), delay);
    }
  }, [watchlists, updateTicker, addScannerAlert, updatePortfolio, updateProviderStatus, updateSniperAssets, activeSymbol]);

  // Connect on mount
  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [connect]);

  // ★ Subscribe to activeSymbol when it changes
  useEffect(() => {
    if (!activeSymbol || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    
    if (!subscribedSymbolsRef.current.has(activeSymbol)) {
      wsRef.current.send(JSON.stringify({ type: 'SUBSCRIBE', symbol: activeSymbol }));
      subscribedSymbolsRef.current.add(activeSymbol);
      console.log(`[QB] Subscribed to new symbol: ${activeSymbol}`);
    }
  }, [activeSymbol]);

  return { isConnected };
};

