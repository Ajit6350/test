/**
 * Quant Bridge — Real-time Market Data Hook.
 *
 * Tries to open a WebSocket to the Harvester Gateway. If the backend is not
 * reachable (e.g. preview / local without server) the hook fails silently
 * and lets the synthetic data generator inside <MainChart/> drive the UI.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { useMarketStore } from '../stores/useMarketStore';
import { getWsUrl } from '../services/api';

// Flip to `true` only when a real backend is running.
const ENABLE_LIVE_WS = false;

export const useMarketData = () => {
  const {
    updateTicker, addScannerAlert, updatePortfolio,
    updateProviderStatus, updateSniperAssets,
    watchlists, activeSymbol,
  } = useMarketStore();

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptRef = useRef(0);
  const subscribedSymbolsRef = useRef(new Set());
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (!ENABLE_LIVE_WS) return; // preview-safe: no connection attempts
    if (wsRef.current) {
      wsRef.current.onclose = null;
      try { wsRef.current.close(); } catch { /* no-op */ }
    }

    let ws;
    try {
      ws = new WebSocket(getWsUrl());
    } catch {
      return;
    }
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      reconnectAttemptRef.current = 0;
      subscribedSymbolsRef.current.clear();

      const allSymbols = new Set();
      Object.values(watchlists).forEach((list) => list.forEach((s) => allSymbols.add(s)));
      allSymbols.forEach((symbol) => {
        ws.send(JSON.stringify({ type: 'SUBSCRIBE', symbol }));
        subscribedSymbolsRef.current.add(symbol);
      });

      if (activeSymbol && !subscribedSymbolsRef.current.has(activeSymbol)) {
        ws.send(JSON.stringify({ type: 'SUBSCRIBE', symbol: activeSymbol }));
        subscribedSymbolsRef.current.add(activeSymbol);
      }
      ws.send(JSON.stringify({ type: 'GET_PORTFOLIO' }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'TITAN_SIGNAL' && data.ticker) {
          updateTicker(data.ticker, data);
        } else if (data.type === 'SCANNER_ALERT' && data.ticker) {
          addScannerAlert({
            ticker: data.ticker,
            reason: data.reason || '',
            probability: data.probability || 50,
            action: data.action || 'HOLD',
            market_state: data.market_state || '',
            timestamp: data.timestamp || Date.now() / 1000,
          });
        } else if (data.type === 'PORTFOLIO_UPDATE') {
          updatePortfolio(data);
          if (data.fast_lane) updateSniperAssets(data.fast_lane);
        } else if (data.type === 'PROVIDER_STATUS' && data.providers) {
          updateProviderStatus(data.providers);
        }
      } catch { /* ignore parse errors */ }
    };

    ws.onclose = () => {
      setIsConnected(false);
      const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 30000);
      reconnectAttemptRef.current += 1;
      reconnectTimeoutRef.current = setTimeout(() => connect(), delay);
    };

    ws.onerror = () => { /* silenced — handled by onclose */ };
  }, [watchlists, updateTicker, addScannerAlert, updatePortfolio,
      updateProviderStatus, updateSniperAssets, activeSymbol]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        try { wsRef.current.close(); } catch { /* no-op */ }
      }
    };
  }, [connect]);

  useEffect(() => {
    if (!ENABLE_LIVE_WS) return;
    const ws = wsRef.current;
    if (!activeSymbol || !ws || ws.readyState !== WebSocket.OPEN) return;
    if (!subscribedSymbolsRef.current.has(activeSymbol)) {
      ws.send(JSON.stringify({ type: 'SUBSCRIBE', symbol: activeSymbol }));
      subscribedSymbolsRef.current.add(activeSymbol);
    }
  }, [activeSymbol]);

  return { isConnected };
};
