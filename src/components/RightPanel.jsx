import React, { useMemo, useState } from 'react';
import { Search, Plus, Settings2, MoreHorizontal, Star, ChevronDown } from 'lucide-react';
import { useMarketStore } from '../stores/useMarketStore';

const TABS = ['Watchlist', 'Details', 'News', 'Ideas'];

const seedRows = [
  { sym: 'BTCUSDT', name: 'Bitcoin',    last: 77034.12, chg: 1.42,  vol: '48.3B' },
  { sym: 'ETHUSDT', name: 'Ethereum',   last: 4123.55,  chg: 2.18,  vol: '22.1B' },
  { sym: 'SOLUSDT', name: 'Solana',     last: 189.74,   chg: 4.91,  vol: '8.4B'  },
  { sym: 'BNBUSDT', name: 'BNB',        last: 712.03,   chg: 0.22,  vol: '1.9B'  },
  { sym: 'XRPUSDT', name: 'XRP',        last: 2.43,     chg: -1.05, vol: '5.1B'  },
  { sym: 'ADAUSDT', name: 'Cardano',    last: 0.89,     chg: -0.48, vol: '1.2B'  },
  { sym: 'DOGEUSDT',name: 'Dogecoin',   last: 0.331,    chg: 3.12,  vol: '3.8B'  },
  { sym: 'AVAXUSDT',name: 'Avalanche',  last: 41.22,    chg: -2.14, vol: '780M'  },
  { sym: 'LINKUSDT',name: 'Chainlink',  last: 22.60,    chg: 1.88,  vol: '520M'  },
  { sym: 'TONUSDT', name: 'Toncoin',    last: 5.77,     chg: 0.34,  vol: '210M'  },
  { sym: 'APTUSDT', name: 'Aptos',      last: 10.34,    chg: -1.22, vol: '160M'  },
  { sym: 'ARBUSDT', name: 'Arbitrum',   last: 1.14,     chg: 0.91,  vol: '95M'   },
];

const fmt = (n) => {
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (n >= 1)    return n.toFixed(2);
  return n.toFixed(4);
};

const Watchlist = () => {
  const { activeSymbol, setActiveSymbol } = useMarketStore();
  const [query, setQuery] = useState('');

  const rows = useMemo(
    () => seedRows.filter((r) =>
      r.sym.toLowerCase().includes(query.toLowerCase()) ||
      r.name.toLowerCase().includes(query.toLowerCase())
    ),
    [query]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Watchlist header */}
      <div className="px-3 py-2 flex items-center gap-2 border-b border-[var(--color-border)]">
        <button className="flex items-center gap-1 text-[12px] font-semibold text-[var(--color-text-primary)] hover:text-white">
          Crypto Coins <ChevronDown size={13} />
        </button>
        <div className="ml-auto flex items-center gap-0.5 text-[var(--color-text-secondary)]">
          <button className="h-6 w-6 grid place-items-center rounded hover:bg-[var(--color-surface-3)]" title="Add"><Plus size={14} /></button>
          <button className="h-6 w-6 grid place-items-center rounded hover:bg-[var(--color-surface-3)]" title="Settings"><Settings2 size={14} /></button>
          <button className="h-6 w-6 grid place-items-center rounded hover:bg-[var(--color-surface-3)]" title="More"><MoreHorizontal size={14} /></button>
        </div>
      </div>

      {/* Search */}
      <div className="px-2 pt-2">
        <div className="flex items-center gap-2 h-7 px-2 rounded bg-[var(--color-surface-2)] border border-[var(--color-border)]">
          <Search size={12} className="text-[var(--color-text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter symbols"
            className="flex-1 bg-transparent outline-none text-[12px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
          />
        </div>
      </div>

      {/* Column headers */}
      <div className="mt-2 px-3 py-1 grid grid-cols-[1fr_auto_auto] gap-3 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
        <span>Symbol</span>
        <span className="text-right">Last</span>
        <span className="text-right">Chg%</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto tv-scroll">
        {rows.map((r) => {
          const active = r.sym === activeSymbol;
          const up = r.chg >= 0;
          return (
            <button
              key={r.sym}
              onClick={() => setActiveSymbol(r.sym)}
              className={`w-full px-3 py-1.5 grid grid-cols-[1fr_auto_auto] gap-3 items-center text-[12px] border-l-2 ${
                active
                  ? 'border-[var(--color-accent)] bg-[var(--color-surface-2)]'
                  : 'border-transparent hover:bg-[var(--color-surface-2)]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Star
                  size={11}
                  className={active ? 'text-[var(--color-warning)] fill-[var(--color-warning)]' : 'text-[var(--color-text-muted)]'}
                />
                <div className="flex flex-col items-start min-w-0">
                  <span className="font-semibold text-[var(--color-text-primary)] truncate">{r.sym}</span>
                  <span className="text-[10px] text-[var(--color-text-muted)] truncate">{r.name}</span>
                </div>
              </div>
              <span className="font-mono text-right text-[var(--color-text-primary)]">{fmt(r.last)}</span>
              <span className={`font-mono text-right ${up ? 'text-[var(--color-bull)]' : 'text-[var(--color-bear)]'}`}>
                {up ? '+' : ''}{r.chg.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Stat = ({ label, value, tone }) => (
  <div className="flex items-center justify-between px-3 py-1.5 text-[12px] border-b border-[var(--color-border)]/60">
    <span className="text-[var(--color-text-secondary)]">{label}</span>
    <span className={`font-mono ${tone || 'text-[var(--color-text-primary)]'}`}>{value}</span>
  </div>
);

const Details = () => {
  const { activeSymbol, alphaScore, vpin, ofi, hurst, entropy, action, tickerData } = useMarketStore();
  const t = tickerData[activeSymbol] || {};
  const price = t.price ?? 77034.12;
  const chg = t.change ?? 1.42;
  const up = chg >= 0;

  return (
    <div className="h-full overflow-y-auto tv-scroll">
      {/* Big price */}
      <div className="px-3 py-3 border-b border-[var(--color-border)]">
        <div className="text-[11px] text-[var(--color-text-secondary)]">{activeSymbol} · Binance</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[26px] font-semibold font-mono tracking-tight text-[var(--color-text-primary)]">
            {price.toFixed(2)}
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)]">USDT</span>
        </div>
        <div className={`mt-0.5 text-[12px] font-mono ${up ? 'text-[var(--color-bull)]' : 'text-[var(--color-bear)]'}`}>
          {up ? '+' : ''}{chg.toFixed(2)}% today
        </div>
      </div>

      {/* Key stats */}
      <div className="py-1">
        <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Key stats</div>
        <Stat label="Open" value={fmt(price * 0.994)} />
        <Stat label="High" value={fmt(price * 1.012)} tone="text-[var(--color-bull)]" />
        <Stat label="Low"  value={fmt(price * 0.988)} tone="text-[var(--color-bear)]" />
        <Stat label="Volume 24h" value="48.3B" />
        <Stat label="Market cap"  value="1.52T" />
      </div>

      {/* Quant signals */}
      <div className="py-1">
        <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Signals</div>
        <Stat label="Alpha score" value={`${alphaScore ?? 72}`} tone="text-[var(--color-accent)]" />
        <Stat label="Action" value={action || 'HOLD'} tone={action === 'BUY' ? 'text-[var(--color-bull)]' : action === 'SELL' ? 'text-[var(--color-bear)]' : ''} />
        <Stat label="VPIN" value={vpin ?? '0.48'} />
        <Stat label="OFI"  value={ofi ?? '+1.2'} />
        <Stat label="Hurst" value={hurst ?? '0.62'} />
        <Stat label="Entropy" value={entropy ?? '0.31'} />
      </div>

      {/* Simple bars */}
      <div className="px-3 py-2 border-t border-[var(--color-border)]">
        <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Buy / Sell pressure</div>
        <div className="h-2 rounded-full overflow-hidden flex bg-[var(--color-surface-3)]">
          <div className="h-full bg-[var(--color-bull)]" style={{ width: up ? '62%' : '38%' }} />
          <div className="h-full bg-[var(--color-bear)]" style={{ width: up ? '38%' : '62%' }} />
        </div>
        <div className="mt-1 flex justify-between text-[10px] font-mono">
          <span className="text-[var(--color-bull)]">{up ? '62%' : '38%'} buy</span>
          <span className="text-[var(--color-bear)]">{up ? '38%' : '62%'} sell</span>
        </div>
      </div>
    </div>
  );
};

const NewsList = () => {
  const news = [
    { t: 'BTC ETF flows top $2.1B in a week as institutions pile in', s: 'Reuters', ago: '5m' },
    { t: 'Ethereum fees hit YTD low, L2 activity surges',              s: 'Bloomberg', ago: '18m' },
    { t: 'Solana outages remain a concern despite price rally',         s: 'Coindesk', ago: '42m' },
    { t: 'Fed minutes hint at cautious path, crypto mildly positive',   s: 'WSJ', ago: '1h' },
    { t: 'Binance lists new perpetual futures pairs',                   s: 'The Block', ago: '2h' },
  ];
  return (
    <div className="h-full overflow-y-auto tv-scroll">
      {news.map((n, i) => (
        <div key={i} className="px-3 py-2 border-b border-[var(--color-border)] hover:bg-[var(--color-surface-2)] cursor-pointer">
          <div className="text-[12px] text-[var(--color-text-primary)] leading-snug">{n.t}</div>
          <div className="mt-1 flex items-center gap-2 text-[10px] text-[var(--color-text-muted)] font-mono">
            <span>{n.s}</span><span>·</span><span>{n.ago} ago</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const Ideas = () => (
  <div className="h-full overflow-y-auto tv-scroll p-3 space-y-2">
    {[
      { u: '@quantline', t: 'BTC forming an inverse H&S on 4H, target 82k', v: 'LONG', up: true },
      { u: '@orderflow',  t: 'ETH heavy sell imbalance near 4200 — cautious',  v: 'SHORT', up: false },
      { u: '@alphaseeker',t: 'SOL breakout retest — risk/reward excellent',    v: 'LONG', up: true },
    ].map((x, i) => (
      <div key={i} className="p-2.5 rounded border border-[var(--color-border)] bg-[var(--color-surface-2)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[var(--color-text-secondary)] font-mono">{x.u}</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${x.up ? 'bg-[var(--color-bull)]/15 text-[var(--color-bull)]' : 'bg-[var(--color-bear)]/15 text-[var(--color-bear)]'}`}>
            {x.v}
          </span>
        </div>
        <div className="mt-1 text-[12px] text-[var(--color-text-primary)] leading-snug">{x.t}</div>
      </div>
    ))}
  </div>
);

const RightPanel = () => {
  const [tab, setTab] = useState('Watchlist');

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex items-center border-b border-[var(--color-border)] px-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 h-9 text-[12px] font-medium border-b-2 transition-colors ${
              tab === t
                ? 'border-[var(--color-accent)] text-[var(--color-text-primary)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0">
        {tab === 'Watchlist' && <Watchlist />}
        {tab === 'Details'   && <Details />}
        {tab === 'News'      && <NewsList />}
        {tab === 'Ideas'     && <Ideas />}
      </div>
    </div>
  );
};

export default RightPanel;
