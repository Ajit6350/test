import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, CandlestickSeries, LineSeries } from 'lightweight-charts';
import { useMarketStore } from '../stores/useMarketStore';

const MainChart = () => {
  const chartContainerRef = useRef(null);
  const livePriceSeriesRef = useRef(null);
  const chartRef = useRef(null);
  const mockTimerRef = useRef(null);
  const lastRealUpdateRef = useRef(0);

  const { activeSymbol, tickerData, marketState, setExecuteOpen, updateTicker } = useMarketStore();
  const [livePrice, setLivePrice] = useState(null);

  // 🧠 मॉक टिक जनरेटर – बैकएंड के बिना लाइव मूवमेंट
  const startMockTicks = useCallback(() => {
    if (mockTimerRef.current) clearInterval(mockTimerRef.current);
    
    // Get latest state without subscribing
    const basePrice = useMarketStore.getState().tickerData[activeSymbol]?.price || 77000;
    let lastPrice = basePrice;

    mockTimerRef.current = setInterval(() => {
      const now = Date.now();
      // अगर पिछले 2 सेकंड में रीयल डेटा आया है, तो मॉक बंद करो
      if (now - lastRealUpdateRef.current < 2000) return;

      // रैंडम वॉक
      const change = (Math.random() - 0.5) * 50;
      lastPrice = Math.max(100, lastPrice + change);

      // चार्ट पर लाइव लाइन अपडेट
      if (livePriceSeriesRef.current) {
        livePriceSeriesRef.current.update({
          time: Math.floor(now / 1000),
          value: lastPrice,
        });
      }
      setLivePrice(lastPrice);

      // ज़ुस्टैंड स्टोर भी अपडेट करो ताकि HUD, अल्फा स्कोर, वगैरह सब एक्टिव हों
      updateTicker(activeSymbol, {
        price: lastPrice,
        change: ((lastPrice - basePrice) / basePrice) * 100,
        volume: Math.floor(Math.random() * 1000),
        alpha_score: 50 + Math.random() * 40,
        hurst: 0.45 + Math.random() * 0.3,
        entropy: 0.2 + Math.random() * 0.5,
        action: lastPrice > basePrice ? 'BUY' : 'SELL',
        conviction: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM',
        vpin: Math.random(),
        ofi: (Math.random() - 0.5) * 4,
        wave_active: Math.random() > 0.5,
        regime: Math.random() > 0.5 ? 'BULL_TRENDING' : 'MEAN_REVERTING',
        probability: 50 + Math.random() * 30,
        edge_score: (Math.random() - 0.5) * 0.3,
        kelly_fraction: Math.random() * 0.2,
        market_state: Math.random() > 0.5 ? 'BREAKOUT' : 'SETUP',
        candle_color: Math.random() > 0.8 ? 'neon_cyan' : 'normal',
        sentiment: lastPrice > basePrice ? 'BULLISH' : 'BEARISH',
        fractal_dim: 1.4 + Math.random() * 0.3,
        dfa: 0.4 + Math.random() * 0.4,
        sweep: Math.random() > 0.9,
        narrative: '',
      });
    }, 500);
  }, [activeSymbol, updateTicker]);

  // 1️⃣ स्टैटिक चार्ट बनाना
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: '#0A0A0C' },
        textColor: '#94A3B8',
        fontFamily: "'JetBrains Mono', 'Inter', sans-serif",
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      crosshair: { mode: 0 },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    });

    chartRef.current = chart;

    // बैकग्राउंड कैंडलस्टिक्स (डमी)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });
    const dummyData = [];
    let time = Math.floor(Date.now() / 1000) - 100 * 60;
    let price = 77000;
    for (let i = 0; i < 100; i++) {
      const open = price;
      const close = price + (Math.random() - 0.5) * 100;
      dummyData.push({
        time,
        open,
        high: Math.max(open, close) + Math.random() * 50,
        low: Math.min(open, close) - Math.random() * 50,
        close,
      });
      time += 60;
      price = close;
    }
    candleSeries.setData(dummyData);

    // कालमन स्मूथ लाइन (बैकग्राउंड)
    const kalmanSeries = chart.addSeries(LineSeries, {
      color: 'rgba(0, 242, 255, 0.5)',
      lineWidth: 2,
      crosshairMarkerVisible: false,
    });
    const kalmanData = dummyData.map(d => ({ time: d.time, value: (d.open + d.close) / 2 }));
    kalmanSeries.setData(kalmanData);

    // लाइव प्राइस लाइन
    const lineSeries = chart.addSeries(LineSeries, {
      color: '#00F2FF',
      lineWidth: 2,
      crosshairMarkerVisible: false,
      lastValueVisible: true,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });
    livePriceSeriesRef.current = lineSeries;

    const resizeHandler = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };
    const observer = new ResizeObserver(resizeHandler);
    observer.observe(chartContainerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, []);

  // 2️⃣ बैकएंड से रीयल-टाइम अपडेट सुनना (स्टोर सब्सक्रिप्शन)
  useEffect(() => {
    const unsub = useMarketStore.subscribe(
      (state) => state.tickerData[activeSymbol]?.price,
      (newPrice) => {
        if (newPrice && livePriceSeriesRef.current) {
          lastRealUpdateRef.current = Date.now();
          const now = Math.floor(Date.now() / 1000);
          livePriceSeriesRef.current.update({
            time: now,
            value: newPrice,
          });
          setLivePrice(newPrice);
        }
      },
      { fireImmediately: false }
    );
    return () => unsub?.();
  }, [activeSymbol]);

  // 3️⃣ सिंबल बदलने पर लाइन साफ़ करें और मॉक रीस्टार्ट करें
  useEffect(() => {
    if (livePriceSeriesRef.current) {
      livePriceSeriesRef.current.setData([]);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLivePrice(null);
    startMockTicks();
    return () => {
      if (mockTimerRef.current) clearInterval(mockTimerRef.current);
    };
  }, [activeSymbol, startMockTicks]);

  // पहली बार माउंट पर मॉक शुरू करो
  useEffect(() => {
    startMockTicks();
    return () => {
      if (mockTimerRef.current) clearInterval(mockTimerRef.current);
    };
  }, [startMockTicks]);

  return (
    <div className="w-full h-full relative">
      <div ref={chartContainerRef} className="w-full h-full absolute inset-0" />

      {/* लाइव प्राइस ओवरले */}
      {livePrice && (
        <div className="absolute bottom-12 left-4 z-10 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded border border-[#00F2FF]/30">
          <span className="text-xs text-[#94A3B8] mr-2">{activeSymbol}</span>
          <span className="text-xl font-mono font-bold text-[#00F2FF]">
            {livePrice.toFixed(2)}
          </span>
        </div>
      )}

      {/* ⚡ एक्ज़ीक्यूट बटन */}
      <button
        className="absolute bottom-6 right-6 z-20 w-12 h-12 rounded-full bg-[#00F2FF] hover:bg-white text-black flex items-center justify-center shadow-[0_0_20px_#00F2FF] transition-all transform hover:scale-110"
        onClick={() => setExecuteOpen(true)}
      >
        <span className="text-xl">⚡</span>
      </button>

      {marketState === 'SETUP' && (
        <div className="absolute inset-0 bg-[#00F2FF]/5 pointer-events-none animate-pulse" />
      )}
    </div>
  );
};

export default MainChart;
