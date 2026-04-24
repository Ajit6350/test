import React, { useState, useMemo } from 'react';
import { Star, Plus, Filter, ChevronDown, Search } from 'lucide-react';
import { useMarketStore } from '../stores/useMarketStore';

const SEED_TICKERS = [
  { sym: 'BTCUSDT', last: 77123.4, chg:  1.24 },
  { sym: 'ETHUSDT', last:  3842.1, chg:  0.82 },
  { sym: 'SOLUSDT', last:   182.6, chg:  3.51 },
  { sym: 'BNBUSDT', last:   612.8, chg: -0.64 },
  { sym: 'XRPUSDT', last:    0.58, chg: -1.92 },
  { sym: 'ADAUSDT', last:    0.42, chg:  0.12 },
  { sym: 'DOGEUSDT',last:    0.17, chg:  4.08 },
  { sym: 'LINKUSDT',last:   14.85, chg: -0.45 },
  { sym: 'AVAXUSDT',last:    35.2, chg:  2.31 },
  { sym: 'MATICUSDT',last:   0.71, chg: -0.24 },
];

const fmtPrice = (n) => n < 1 ? n.toFixed(4) : n.toLocaleString(undefined, { maximumFractionDigits: 2 });

const WatchList = () => {
  const { activeSymbol, setActiveSymbol } = useMarketStore();
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    const s = q.trim().toUpperCase();
    if (!s) return SEED_TICKERS;
    return SEED_TICKERS.filter(r => r.sym.includes(s));
  }, [q]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-8 shrink-0 px-2 flex items-center justify-between border-b border-[color:var(--color-border-soft)]">
        <div className="flex items-center gap-1.5">
          <Star size={13} className="text-[color:var(--color-warn)]" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-text-primary)]">Watchlist</span>
          <ChevronDown size={12} className="text-[color:var(--color-text-muted)]" />
        </div>
        <div className="flex items-center gap-0.5">
          <button title="Filter" className="w-6 h-6 grid place-items-center rounded text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-3)]">
            <Filter size={13} />
          </button>
          <button title="Add symbol" className="w-6 h-6 grid place-items-center rounded text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-3)]">
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-2 py-1.5 border-b border-[color:var(--color-border-soft)]">
        <div className="h-6 flex items-center gap-1.5 bg-[color:var(--color-surface-2)] rounded border border-[color:var(--color-border)] px-1.5">
          <Search size={11} className="text-[color:var(--color-text-muted)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent outline-none text-[11px] text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-muted)]"
          />
        </div>
      </div>

      {/* Column headers */}
      <div className="h-6 px-2 flex items-center text-[10px] font-mono uppercase tracking-wider text-[color:var(--color-text-muted)] border-b border-[color:var(--color-border-soft)]">
        <span className="flex-1">Symbol</span>
        <span className="w-20 text-right">Last</span>
        <span className="w-16 text-right">Chg%</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto tv-scroll">
        {rows.map((r) => {
          const up = r.chg >= 0;
          const isActive = r.sym === activeSymbol;
          return (
            <button
              key={r.sym}
              onClick={() => setActiveSymbol(r.sym)}
              className={`w-full h-7 px-2 flex items-center text-[12px] transition-colors ${
                isActive
                  ? 'bg-[color:var(--color-accent-soft)] text-[color:var(--color-text-primary)]'
                  : 'text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-2)]'
              }`}
            >
              <span className="flex-1 text-left font-medium tracking-wide">{r.sym}</span>
              <span className="w-20 text-right font-mono tabular-nums">{fmtPrice(r.last)}</span>
              <span className={`w-16 text-right font-mono tabular-nums ${up ? 'text-[color:var(--color-up)]' : 'text-[color:var(--color-down)]'}`}>
                {up ? '+' : ''}{r.chg.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const MetricBar = ({ label, value, max = 1, tone = 'accent', signed = false }) => {
  const pct = Math.min(100, Math.abs(value / max) * 100);
  const posTone = {
    accent: 'bg-[color:var(--color-accent)]',
    up: 'bg-[color:var(--color-up)]',
    down: 'bg-[color:var(--color-down)]',
    warn: 'bg-[color:var(--color-warn)]',
  }[tone];
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-[color:var(--color-text-secondary)]">{label}</span>
        <span className={`font-mono ${signed && value < 0 ? 'text-[color:var(--color-down)]' : 'text-[color:var(--color-text-primary)]'}`}>
          {signed && value >= 0 ? '+' : ''}{typeof value === 'number' ? value.toFixed(2) : value}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[color:var(--color-surface-3)] overflow-hidden">
        <div className={`h-full ${posTone} transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const AlphaHUD = () => {
  const { alphaScore, action, vpin, ofi, hurst, entropy } = useMarketStore();
  const score = alphaScore ?? 72;
  const act = action || 'HOLD';

  const actCls =
    act === 'BUY'  ? 'bg-[color:var(--color-up)] text-white'   :
    act === 'SELL' ? 'bg-[color:var(--color-down)] text-white' :
                     'bg-[color:var(--color-surface-3)] text-[color:var(--color-text-primary)]';

  return (
    <div className="flex flex-col h-full">
      <div className="h-8 shrink-0 px-3 flex items-center justify-between border-b border-[color:var(--color-border-soft)]">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-text-primary)]">
          Alpha Engine
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-accent)] tv-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto tv-scroll p-3 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">Alpha Score</div>
            <div className="text-4xl font-mono font-bold tabular-nums text-[color:var(--color-text-primary)] leading-none mt-1">
              {Math.round(score)}<span className="text-lg text-[color:var(--color-text-muted)]">%</span>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded text-[11px] font-bold tracking-[0.15em] ${actCls}`}>
            {act}
          </div>
        </div>

        <MetricBar label="VPIN · Toxicity" value={Number(vpin) || 0.62} max={1} tone={Number(vpin) > 0.7 ? 'down' : 'accent'} />
        <MetricBar label="OFI · Flow"      value={Number(ofi) || 1.8}   max={3} tone="up" signed />

        <div className="pt-2 border-t border-[color:var(--color-border-soft)]">
          <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)] mb-2">Regime Barcode</div>
          <div className="h-2.5 flex rounded overflow-hidden">
            {[0,0,1,1,0,2,0,0,1,0,2,1,0,0,1].map((s,i) => (
              <div key={i} className={`flex-1 ${
                s === 0 ? 'bg-[color:var(--color-up)]' :
                s === 1 ? 'bg-[color:var(--color-down)]' :
                          'bg-[color:var(--color-surface-4)]'
              }`} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-[color:var(--color-surface-2)] rounded border border-[color:var(--color-border-soft)]">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">Hurst</div>
            <div className="text-sm font-mono text-[color:var(--color-text-primary)] mt-0.5">
              {hurst || '0.65'} <span className="text-[color:var(--color-up)] text-[10px]">TREND</span>
            </div>
          </div>
          <div className="p-2 bg-[color:var(--color-surface-2)] rounded border border-[color:var(--color-border-soft)]">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">Entropy</div>
            <div className="text-sm font-mono text-[color:var(--color-text-primary)] mt-0.5">
              {entropy || '0.31'} <span className="text-[color:var(--color-accent)] text-[10px]">LOW</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-[color:var(--color-border-soft)]">
          <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)] mb-2">Sentinel Radar</div>
          <div className="space-y-1">
            {[
              { sym: 'SOLUSDT', score: 92, tag: 'BREAKOUT' },
              { sym: 'ETHUSDT', score: 85, tag: 'TREND' },
              { sym: 'XRPUSDT', score: 40, tag: 'WEAK' },
            ].map((r) => (
              <div key={r.sym} className="flex items-center justify-between px-2 py-1 rounded hover:bg-[color:var(--color-surface-2)] cursor-pointer">
                <span className="font-mono text-[12px] text-[color:var(--color-text-primary)]">{r.sym}</span>
                <span className="text-[10px] font-mono text-[color:var(--color-text-muted)]">{r.tag}</span>
                <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                  r.score > 80 ? 'bg-[color:var(--color-up)]/20 text-[color:var(--color-up)]' :
                  r.score > 60 ? 'bg-[color:var(--color-warn)]/20 text-[color:var(--color-warn)]' :
                                 'bg-[color:var(--color-down)]/20 text-[color:var(--color-down)]'
                }`}>
                  {r.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RightPanel = () => {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-[color:var(--color-surface)]">
      <div className="flex-1 min-h-0 border-b border-[color:var(--color-border)]">
        <WatchList />
      </div>
      <div className="h-[48%] min-h-0">
        <AlphaHUD />
      </div>
    </div>
  );
};

export default RightPanel;
