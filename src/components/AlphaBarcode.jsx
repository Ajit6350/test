import React, { useState } from 'react';
import { useMarketStore } from '../stores/useMarketStore';

/**
 * Bottom status strip — combines a regime "barcode" visual with a
 * TradingView-style status bar (connection, mode, active symbol).
 */
const buildSegments = () =>
  Array.from({ length: 140 }).map(() => {
    const v = Math.random();
    if (v > 0.8)  return 'bg-[color:var(--color-up)]';
    if (v < 0.2)  return 'bg-[color:var(--color-down)]';
    if (v > 0.45 && v < 0.55) return 'bg-[color:var(--color-accent)]';
    return 'bg-[color:var(--color-surface-4)]';
  });

const AlphaBarcode = () => {
  const { activeSymbol, activeTimeframe } = useMarketStore();
  // Lazy initializer — runs once per mount, render stays pure.
  const [segments] = useState(buildSegments);

  return (
    <div className="w-full h-full flex items-center px-3 gap-3 text-[10px] font-mono uppercase tracking-wider">
      {/* Left: symbol & tf */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-up)] tv-pulse" />
        <span className="text-[color:var(--color-text-secondary)]">Connected</span>
        <span className="text-[color:var(--color-text-muted)]">·</span>
        <span className="text-[color:var(--color-text-secondary)]">{activeSymbol || 'BTCUSDT'}</span>
        <span className="text-[color:var(--color-text-muted)]">·</span>
        <span className="text-[color:var(--color-text-secondary)]">{activeTimeframe || '1m'}</span>
      </div>

      {/* Middle: regime barcode */}
      <div className="flex-1 h-full flex items-center gap-[1px]">
        <span className="text-[color:var(--color-text-muted)] mr-2 shrink-0">Regime</span>
        {segments.map((c, i) => (
          <div key={i} className={`flex-1 h-3/5 rounded-[1px] ${c}`} />
        ))}
      </div>

      {/* Right: version tag */}
      <div className="shrink-0 text-[color:var(--color-text-muted)]">
        v1.0 · Quant Bridge
      </div>
    </div>
  );
};

export default AlphaBarcode;
