import React, { useState } from 'react';
import { X, ChevronUp, Maximize2 } from 'lucide-react';

const TABS = ['Stock Screener', 'Pine Editor', 'Strategy Tester', 'Trading Panel', 'Notes'];

/* ─── Screener ─── */
const screenerRows = [
  { sym: 'BTCUSDT', last: 77034.12, chg: 1.42,  vol: '48.3B', mcap: '1.52T', rsi: 58.2, rat: 'Buy' },
  { sym: 'ETHUSDT', last: 4123.55,  chg: 2.18,  vol: '22.1B', mcap: '496B',  rsi: 62.8, rat: 'Strong Buy' },
  { sym: 'SOLUSDT', last: 189.74,   chg: 4.91,  vol: '8.4B',  mcap: '89B',   rsi: 71.4, rat: 'Strong Buy' },
  { sym: 'BNBUSDT', last: 712.03,   chg: 0.22,  vol: '1.9B',  mcap: '104B',  rsi: 52.1, rat: 'Neutral' },
  { sym: 'XRPUSDT', last: 2.43,     chg: -1.05, vol: '5.1B',  mcap: '138B',  rsi: 44.3, rat: 'Sell' },
  { sym: 'ADAUSDT', last: 0.89,     chg: -0.48, vol: '1.2B',  mcap: '31B',   rsi: 46.9, rat: 'Neutral' },
  { sym: 'DOGEUSDT',last: 0.331,    chg: 3.12,  vol: '3.8B',  mcap: '48B',   rsi: 64.5, rat: 'Buy' },
  { sym: 'AVAXUSDT',last: 41.22,    chg: -2.14, vol: '780M',  mcap: '16B',   rsi: 39.7, rat: 'Sell' },
  { sym: 'LINKUSDT',last: 22.60,    chg: 1.88,  vol: '520M',  mcap: '14B',   rsi: 55.6, rat: 'Buy' },
];

const ratingTone = (r) =>
  r === 'Strong Buy' ? 'bg-[var(--color-bull)]/20 text-[var(--color-bull)]' :
  r === 'Buy'        ? 'bg-[var(--color-bull)]/10 text-[var(--color-bull)]' :
  r === 'Sell'       ? 'bg-[var(--color-bear)]/10 text-[var(--color-bear)]' :
  r === 'Strong Sell'? 'bg-[var(--color-bear)]/20 text-[var(--color-bear)]' :
  'bg-[var(--color-surface-3)] text-[var(--color-text-secondary)]';

const Screener = () => (
  <div className="h-full flex flex-col">
    {/* filter chips */}
    <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 border-b border-[var(--color-border)] overflow-x-auto no-scrollbar">
      {['All', 'Top gainers', 'Top losers', 'Most active', 'Overbought', 'Oversold', 'High volume', 'New highs'].map((c, i) => (
        <button
          key={c}
          className={`px-2.5 h-6 text-[11px] rounded-full border ${
            i === 0
              ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border-[var(--color-accent)]/40'
              : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'
          }`}
        >
          {c}
        </button>
      ))}
    </div>

    {/* Table */}
    <div className="flex-1 overflow-auto tv-scroll">
      <table className="w-full text-[12px]">
        <thead className="sticky top-0 bg-[var(--color-surface)] z-10">
          <tr className="text-left text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
            <th className="px-3 py-2 font-medium">Symbol</th>
            <th className="px-3 py-2 font-medium text-right">Last</th>
            <th className="px-3 py-2 font-medium text-right">Chg%</th>
            <th className="px-3 py-2 font-medium text-right">Volume</th>
            <th className="px-3 py-2 font-medium text-right">Market cap</th>
            <th className="px-3 py-2 font-medium text-right">RSI (14)</th>
            <th className="px-3 py-2 font-medium">Technical</th>
          </tr>
        </thead>
        <tbody>
          {screenerRows.map((r, i) => {
            const up = r.chg >= 0;
            return (
              <tr key={i} className="border-b border-[var(--color-border)]/60 hover:bg-[var(--color-surface-2)] cursor-pointer">
                <td className="px-3 py-1.5 font-semibold text-[var(--color-text-primary)]">{r.sym}</td>
                <td className="px-3 py-1.5 text-right font-mono">{r.last.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                <td className={`px-3 py-1.5 text-right font-mono ${up ? 'text-[var(--color-bull)]' : 'text-[var(--color-bear)]'}`}>
                  {up ? '+' : ''}{r.chg.toFixed(2)}%
                </td>
                <td className="px-3 py-1.5 text-right font-mono text-[var(--color-text-secondary)]">{r.vol}</td>
                <td className="px-3 py-1.5 text-right font-mono text-[var(--color-text-secondary)]">{r.mcap}</td>
                <td className="px-3 py-1.5 text-right font-mono">{r.rsi.toFixed(1)}</td>
                <td className="px-3 py-1.5">
                  <span className={`text-[11px] px-2 py-0.5 rounded ${ratingTone(r.rat)}`}>{r.rat}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

/* ─── Trading Panel ─── */
const TradingPanel = () => {
  const [side, setSide] = useState('buy');
  const [type, setType] = useState('Limit');

  return (
    <div className="h-full grid grid-cols-2 md:grid-cols-[360px_1fr]">
      {/* Order ticket */}
      <div className="p-3 border-r border-[var(--color-border)] overflow-y-auto tv-scroll">
        <div className="flex rounded overflow-hidden border border-[var(--color-border)] text-[12px] font-medium">
          <button
            onClick={() => setSide('buy')}
            className={`flex-1 h-8 ${side === 'buy' ? 'bg-[var(--color-bull)] text-white' : 'text-[var(--color-text-secondary)] bg-[var(--color-surface-2)]'}`}
          >
            Buy
          </button>
          <button
            onClick={() => setSide('sell')}
            className={`flex-1 h-8 ${side === 'sell' ? 'bg-[var(--color-bear)] text-white' : 'text-[var(--color-text-secondary)] bg-[var(--color-surface-2)]'}`}
          >
            Sell
          </button>
        </div>

        <div className="mt-3 flex gap-1">
          {['Market', 'Limit', 'Stop', 'Stop-Limit'].map((o) => (
            <button
              key={o}
              onClick={() => setType(o)}
              className={`h-7 px-2 text-[11px] rounded ${
                type === o
                  ? 'bg-[var(--color-surface-3)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'
              }`}
            >
              {o}
            </button>
          ))}
        </div>

        <div className="mt-3 space-y-2">
          <Input label="Price" value="77,034.12" mono />
          <Input label="Quantity" value="0.0100" mono />
          <Input label="Total" value="770.34 USDT" mono />
        </div>

        <div className="mt-3 grid grid-cols-4 gap-1 text-[11px]">
          {['25%', '50%', '75%', '100%'].map((p) => (
            <button key={p} className="h-7 rounded bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] text-[var(--color-text-secondary)]">
              {p}
            </button>
          ))}
        </div>

        <button
          className={`mt-4 w-full h-9 rounded text-[13px] font-semibold text-white ${
            side === 'buy' ? 'bg-[var(--color-bull)] hover:opacity-90' : 'bg-[var(--color-bear)] hover:opacity-90'
          }`}
        >
          {side === 'buy' ? 'Buy BTCUSDT' : 'Sell BTCUSDT'}
        </button>
      </div>

      {/* Positions / Orders */}
      <div className="flex flex-col min-h-0">
        <div className="flex items-center gap-4 px-3 h-8 border-b border-[var(--color-border)] text-[11px]">
          {['Positions (1)', 'Open Orders', 'Order History', 'Trade History'].map((x, i) => (
            <button
              key={x}
              className={`${i === 0 ? 'text-[var(--color-text-primary)] font-medium' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
            >
              {x}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-auto tv-scroll">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                <th className="px-3 py-2 font-medium">Symbol</th>
                <th className="px-3 py-2 font-medium">Side</th>
                <th className="px-3 py-2 font-medium text-right">Size</th>
                <th className="px-3 py-2 font-medium text-right">Entry</th>
                <th className="px-3 py-2 font-medium text-right">Mark</th>
                <th className="px-3 py-2 font-medium text-right">P&L</th>
                <th className="px-3 py-2 font-medium text-right">ROE%</th>
                <th className="px-3 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--color-border)]/60 hover:bg-[var(--color-surface-2)]">
                <td className="px-3 py-1.5 font-semibold">BTCUSDT</td>
                <td className="px-3 py-1.5"><span className="text-[11px] px-1.5 py-0.5 rounded bg-[var(--color-bull)]/15 text-[var(--color-bull)]">LONG</span></td>
                <td className="px-3 py-1.5 text-right font-mono">0.025</td>
                <td className="px-3 py-1.5 text-right font-mono">76,412.00</td>
                <td className="px-3 py-1.5 text-right font-mono">77,034.12</td>
                <td className="px-3 py-1.5 text-right font-mono text-[var(--color-bull)]">+15.55</td>
                <td className="px-3 py-1.5 text-right font-mono text-[var(--color-bull)]">+0.82%</td>
                <td className="px-3 py-1.5 text-right">
                  <button className="text-[11px] px-2 py-0.5 rounded bg-[var(--color-surface-3)] hover:bg-[var(--color-bear)]/30 text-[var(--color-text-secondary)]">
                    Close
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, value, mono }) => (
  <label className="block">
    <span className="block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">{label}</span>
    <input
      defaultValue={value}
      className={`w-full h-8 px-2 rounded bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[12px] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)] ${mono ? 'font-mono' : ''}`}
    />
  </label>
);

/* ─── Pine editor stub ─── */
const PineEditor = () => (
  <div className="h-full p-3 font-mono text-[12px] text-[var(--color-text-secondary)] overflow-auto tv-scroll">
    <div className="mb-2 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Pine Script v5 · untitled-script</div>
    <pre className="whitespace-pre-wrap leading-relaxed">
{`//@version=5
indicator("Volume Imbalance Delta", overlay=false)

length = input.int(20, "EMA length")
up = close > open
delta = up ? volume : -volume
ema_d = ta.ema(delta, length)

plot(delta, style=plot.style_columns, color=up ? color.teal : color.red)
plot(ema_d, "Delta EMA", color=color.orange, linewidth=2)`}
    </pre>
  </div>
);

/* ─── Strategy tester stub ─── */
const StrategyTester = () => (
  <div className="h-full p-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px]">
    {[
      ['Net profit', '+$12,480', 'text-[var(--color-bull)]'],
      ['Total trades', '146', ''],
      ['Win rate', '58.9%', ''],
      ['Profit factor', '1.82', ''],
      ['Max drawdown', '-$3,210', 'text-[var(--color-bear)]'],
      ['Avg trade', '+$85', ''],
      ['Sharpe', '1.41', ''],
      ['Sortino', '2.05', ''],
    ].map(([k, v, c]) => (
      <div key={k} className="p-3 rounded border border-[var(--color-border)] bg-[var(--color-surface-2)]">
        <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">{k}</div>
        <div className={`mt-1 text-[16px] font-mono font-semibold ${c || 'text-[var(--color-text-primary)]'}`}>{v}</div>
      </div>
    ))}
  </div>
);

const Notes = () => (
  <div className="h-full p-3">
    <textarea
      defaultValue="Idea: watch BTC 4H inverse H&S — long above 77,800 with stop at 76,400."
      className="w-full h-full resize-none rounded bg-[var(--color-surface-2)] border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)] text-[13px] p-3 leading-relaxed text-[var(--color-text-primary)]"
    />
  </div>
);

const BottomPanel = ({ onClose }) => {
  const [tab, setTab] = useState('Stock Screener');

  return (
    <div className="h-full flex flex-col">
      {/* Tab bar */}
      <div className="h-9 shrink-0 flex items-center border-b border-[var(--color-border)] px-1">
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

        <div className="ml-auto flex items-center gap-0.5 pr-1 text-[var(--color-text-secondary)]">
          <button title="Maximize" className="h-6 w-6 grid place-items-center rounded hover:bg-[var(--color-surface-3)]"><Maximize2 size={13} /></button>
          <button title="Collapse" onClick={onClose} className="h-6 w-6 grid place-items-center rounded hover:bg-[var(--color-surface-3)]"><ChevronUp size={14} /></button>
          <button title="Close" onClick={onClose} className="h-6 w-6 grid place-items-center rounded hover:bg-[var(--color-surface-3)]"><X size={14} /></button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {tab === 'Stock Screener' && <Screener />}
        {tab === 'Pine Editor'    && <PineEditor />}
        {tab === 'Strategy Tester'&& <StrategyTester />}
        {tab === 'Trading Panel'  && <TradingPanel />}
        {tab === 'Notes'          && <Notes />}
      </div>
    </div>
  );
};

export default BottomPanel;
