/**
 * Quant Bridge — Real-time Market Data Hook.
 *
 * Opens a WebSocket to the Harvester Gateway when a real backend is
 * available. In the preview / local build (no backend), the hook is a
 * deliberate no-op and the synthetic data generator inside <MainChart/>
 * drives the UI. Flip ENABLE_LIVE_WS to true to connect to a real server.
 */
import { useEffect, useRef, useState } from 'react';
import { useMarketStore } from '../stores/useMarketStore';
import { getWsUrl } from '../services/api';

const ENABLE_LIVE_WS = false;

export const useMarketData = () => {
  const {
    updateTicker, addScannerAlert, updatePortfolio,
    updateProviderStatus, updateSniperAssets,
    watchlists, activeSymbol,
  } = useMarketStore();

  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const subscribedRef = useRef(new Set());

  useEffect(() => {
    if (!ENABLE_LIVE_WS) return;

    let cancelled = false;
    let attempt = 0;
    let retryTimer = null;

    const open = () => {
      if (cancelled) return;

      let ws;
      try {
        ws = new WebSocket(getWsUrl());
      } catch {
        scheduleRetry();
        return;
      }
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        attempt = 0;
        subscribedRef.current.clear();

        const syms = new Set();
        Object.values(watchlists).forEach((list) => list.forEach((s) => syms.add(s)));
        syms.forEach((s) => {
          ws.send(JSON.stringify({ type: 'SUBSCRIBE', symbol: s }));
          subscribedRef.current.add(s);
        });
        if (activeSymbol && !subscribedRef.current.has(activeSymbol)) {
          ws.send(JSON.stringify({ type: 'SUBSCRIBE', symbol: activeSymbol }));
          subscribedRef.current.add(activeSymbol);
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
        } catch { /* ignore */ }
      };

      ws.onclose = () => {
        setIsConnected(false);
        scheduleRetry();
      };
      ws.onerror = () => { /* handled via close */ };
    };

    const scheduleRetry = () => {
      if (cancelled) return;
      const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
      attempt += 1;
      retryTimer = setTimeout(open, delay);
    };

    open();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        try { wsRef.current.close(); } catch { /* no-op */ }
      }
    };
  }, [watchlists, updateTicker, addScannerAlert, updatePortfolio,
      updateProviderStatus, updateSniperAssets, activeSymbol]);

  return { isConnected };
};
