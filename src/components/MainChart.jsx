import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
} from 'lightweight-charts';
import { useMarketStore } from '../stores/useMarketStore';
import { Zap } from 'lucide-react';

/* ───────────────────────────────────────────────
   Synthetic seed: candles + volume + buy/sell delta
   ─────────────────────────────────────────────── */
const generateSeedData = (count = 260, startPrice = 77000) => {
  const candles = [];
  const volumes = [];
  const imbalance = [];

  let time = Math.floor(Date.now() / 1000) - count * 60;
  let price = startPrice;

  for (let i = 0; i < count; i++) {
    const open = price;
    const drift = (Math.random() - 0.48) * 120;
    const close = open + drift;
    const high = Math.max(open, close) + Math.random() * 70;
    const low  = Math.min(open, close) - Math.random() * 70;
    candles.push({ time, open, high, low, close });

    const vol = 200 + Math.random() * 1800 + Math.abs(close - open) * 4;
    volumes.push({
      time,
      value: vol,
      color: close >= open ? 'rgba(8, 153, 129, 0.55)' : 'rgba(242, 54, 69, 0.55)',
    });

    // Buy-sell imbalance (delta)
    const buyRatio = close >= open ? 0.52 + Math.random() * 0.35 : 0.12 + Math.random() * 0.35;
    const delta = vol * (buyRatio - (1 - buyRatio));
    imbalance.push({
      time,
      value: delta,
      color: delta >= 0 ? 'rgba(38, 166, 154, 0.9)' : 'rgba(239, 83, 80, 0.9)',
    });

    price = close;
    time += 60;
  }
  return { candles, volumes, imbalance };
};

const MainChart = () => {
  const containerRef  = useRef(null);
  const chartRef      = useRef(null);
  const candleRef     = useRef(null);
  const volumeRef     = useRef(null);
  const imbalanceRef  = useRef(null);
  const emaRef        = useRef(null);
  const lastRef       = useRef({ time: 0, price: 0, candle: null });

  const { activeSymbol, marketState, setExecuteOpen, updateTicker } = useMarketStore();
  const [hover, setHover]       = useState(null);
  const [hoverVol, setHoverVol] = useState(null);
  const [hoverImb, setHoverImb] = useState(null);

  /* ─── Build chart once ─── */
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { type: 'solid', color: '#131722' },
        textColor: '#B2B5BE',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 11,
        panes: { separatorColor: '#2A2E39', separatorHoverColor: '#363A45' },
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.45)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.45)' },
      },
      rightPriceScale: {
        borderColor: '#2A2E39',
        scaleMargins: { top: 0.08, bottom: 0.08 },
      },
      timeScale: {
        borderColor: '#2A2E39',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 6,
        barSpacing: 7,
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#4C525E', width: 1, style: 3, labelBackgroundColor: '#2A2E39' },
        horzLine: { color: '#4C525E', width: 1, style: 3, labelBackgroundColor: '#2A2E39' },
      },
    });
    chartRef.current = chart;

    // Pane 0 — candles
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#089981',
      downColor: '#F23645',
      borderVisible: false,
      wickUpColor: '#089981',
      wickDownColor: '#F23645',
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    });
    candleRef.current = candleSeries;

    // EMA 20 overlay on pane 0
    const emaSeries = chart.addSeries(LineSeries, {
      color: '#F5A623',
      lineWidth: 1,
      lastValueVisible: false,
      priceLineVisible: false,
      crosshairMarkerVisible: false,
    });
    emaRef.current = emaSeries;

    // Pane 1 — Volume
    const volumeSeries = chart.addSeries(
      HistogramSeries,
      { priceFormat: { type: 'volume' }, priceScaleId: '' },
      1
    );
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.15, bottom: 0 },
      borderColor: '#2A2E39',
    });
    volumeRef.current = volumeSeries;

    // Pane 2 — Buy/Sell Imbalance (Delta histogram)
    const imbalanceSeries = chart.addSeries(
      HistogramSeries,
      { priceFormat: { type: 'volume' }, priceScaleId: '', base: 0 },
      2
    );
    imbalanceSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.2, bottom: 0.2 },
      borderColor: '#2A2E39',
    });
    imbalanceRef.current = imbalanceSeries;

    // Seed data
    const { candles, volumes, imbalance } = generateSeedData();
    candleSeries.setData(candles);
    volumeSeries.setData(volumes);
    imbalanceSeries.setData(imbalance);

    // EMA(20)
    const emaArr = [];
    const k = 2 / (20 + 1);
    let ema = candles[0].close;
    for (const c of candles) {
      ema = c.close * k + ema * (1 - k);
      emaArr.push({ time: c.time, value: ema });
    }
    emaSeries.setData(emaArr);

    // Pane heights
    try {
      const panes = chart.panes?.();
      if (panes?.[0]?.setHeight) panes[0].setHeight(420);
      if (panes?.[1]?.setHeight) panes[1].setHeight(110);
      if (panes?.[2]?.setHeight) panes[2].setHeight(110);
    } catch { /* version-dependent */ }

    lastRef.current = {
      time: candles.at(-1).time,
      price: candles.at(-1).close,
      candle: candles.at(-1),
    };

    const crosshairHandler = (param) => {
      if (!param.time) { setHover(null); setHoverVol(null); setHoverImb(null); return; }
      const c = param.seriesData.get(candleSeries);
      const v = param.seriesData.get(volumeSeries);
      const d = param.seriesData.get(imbalanceSeries);
      if (c) setHover(c);
      if (v) setHoverVol(v.value);
      if (d) setHoverImb(d.value);
    };
    chart.subscribeCrosshairMove(crosshairHandler);

    return () => {
      chart.unsubscribeCrosshairMove(crosshairHandler);
      chart.remove();
    };
  }, []);

  /* ─── Live tick simulator ─── */
  const simulate = useCallback(() => {
    const id = setInterval(() => {
      const cur = lastRef.current.candle;
      if (!cur || !candleRef.current) return;

      const now = Math.floor(Date.now() / 1000);
      const step = (Math.random() - 0.5) * 40;
      let newCandle = { ...cur };

      if (now - cur.time >= 60) {
        const open = cur.close;
        const close = open + step;
        newCandle = {
          time: now, open, close,
          high: Math.max(open, close),
          low:  Math.min(open, close),
        };
        const vol = 200 + Math.random() * 1500;
        const up = close >= open;
        volumeRef.current?.update({
          time: now, value: vol,
          color: up ? 'rgba(8, 153, 129, 0.55)' : 'rgba(242, 54, 69, 0.55)',
        });
        const delta = vol * (Math.random() * 0.8 - 0.4);
        imbalanceRef.current?.update({
          time: now, value: delta,
          color: delta >= 0 ? 'rgba(38, 166, 154, 0.9)' : 'rgba(239, 83, 80, 0.9)',
        });
      } else {
        newCandle.close = cur.close + step;
        newCandle.high  = Math.max(cur.high, newCandle.close);
        newCandle.low   = Math.min(cur.low,  newCandle.close);
      }

      candleRef.current.update(newCandle);
      lastRef.current.candle = newCandle;
      lastRef.current.price  = newCandle.close;

      updateTicker(activeSymbol, {
        price: newCandle.close,
        change: ((newCandle.close - 77000) / 77000) * 100,
        alpha_score: 40 + Math.random() * 50,
        vpin: Math.random(),
        ofi: (Math.random() - 0.5) * 3,
        hurst: 0.4 + Math.random() * 0.4,
        entropy: 0.2 + Math.random() * 0.4,
        action: newCandle.close >= newCandle.open ? 'BUY' : 'SELL',
      });
    }, 900);
    return () => clearInterval(id);
  }, [activeSymbol, updateTicker]);

  useEffect(() => {
    const stop = simulate();
    return stop;
  }, [simulate]);

  const ohlc   = hover || lastRef.current.candle;
  const upBar  = ohlc && ohlc.close >= ohlc.open;
  const barCol = upBar ? 'text-[color:var(--color-up)]' : 'text-[color:var(--color-down)]';
  const fmt    = (n) => (n == null ? '—' : Number(n).toFixed(2));

  return (
    <div className="w-full h-full relative bg-[color:var(--color-surface)]">
      {/* OHLC HUD — TradingView style */}
      {ohlc && (
        <div className="absolute top-2 left-3 z-10 flex items-center gap-3 text-[11px] font-mono tv-fade-in">
          <span className="text-[color:var(--color-text-primary)] font-semibold">
            {activeSymbol || 'BTCUSDT'}
          </span>
          <span className="text-[color:var(--color-text-muted)]">· 1m · Binance</span>
          <span className="text-[color:var(--color-text-secondary)]">O<span className={`ml-1 ${barCol}`}>{fmt(ohlc.open)}</span></span>
          <span className="text-[color:var(--color-text-secondary)]">H<span className={`ml-1 ${barCol}`}>{fmt(ohlc.high)}</span></span>
          <span className="text-[color:var(--color-text-secondary)]">L<span className={`ml-1 ${barCol}`}>{fmt(ohlc.low)}</span></span>
          <span className="text-[color:var(--color-text-secondary)]">C<span className={`ml-1 ${barCol}`}>{fmt(ohlc.close)}</span></span>
          {ohlc.open != null && (
            <span className={barCol}>
              {(ohlc.close - ohlc.open >= 0 ? '+' : '') + (ohlc.close - ohlc.open).toFixed(2)}
              {' '}({(((ohlc.close - ohlc.open) / ohlc.open) * 100).toFixed(2)}%)
            </span>
          )}
        </div>
      )}

      {/* Pane labels */}
      <div className="pointer-events-none absolute left-3 z-10 text-[10px] font-mono uppercase tracking-wider text-[color:var(--color-text-muted)]" style={{ top: 26 }}>
        EMA 20 <span className="text-[#F5A623]">●</span>
      </div>
      <div className="pointer-events-none absolute left-3 z-10 text-[10px] font-mono uppercase tracking-wider text-[color:var(--color-text-muted)]" style={{ top: '62%' }}>
        Volume {hoverVol != null && <span className="text-[color:var(--color-text-secondary)]">· {hoverVol.toFixed(0)}</span>}
      </div>
      <div className="pointer-events-none absolute left-3 z-10 text-[10px] font-mono uppercase tracking-wider text-[color:var(--color-text-muted)]" style={{ top: '82%' }}>
        Imbalance {hoverImb != null && (
          <span className={hoverImb >= 0 ? 'text-[color:var(--color-up)]' : 'text-[color:var(--color-down)]'}>
            · {hoverImb >= 0 ? '+' : ''}{hoverImb.toFixed(0)}
          </span>
        )}
      </div>

      <div ref={containerRef} className="absolute inset-0" />

      {/* Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-[120px] font-bold text-white/[0.018] tracking-tighter select-none">
          {activeSymbol?.replace('USDT', '') || 'BTC'}
        </div>
      </div>

      {/* Execute FAB */}
      <button
        onClick={() => setExecuteOpen(true)}
        title="Execute trade"
        className="absolute bottom-4 right-16 z-20 h-9 px-3.5 flex items-center gap-2 rounded-md bg-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-hover)] text-white font-medium text-[12px] shadow-lg shadow-black/40 transition-colors"
      >
        <Zap size={14} /> Trade
      </button>

      {marketState === 'SETUP' && (
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[color:var(--color-accent)]/25" />
      )}
    </div>
  );
};

export default MainChart;
