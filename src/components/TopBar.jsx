import React from 'react';
import {
  Search, Plus, Camera, Bell, MessageSquare, Settings,
  LayoutGrid, BarChart3, CandlestickChart, LineChart,
  ChevronDown, Undo2, Redo2, Save, Maximize2, Activity,
} from 'lucide-react';
import { useMarketStore } from '../stores/useMarketStore';
import Logo from './Logo';

const timeframes = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
];

const Divider = () => <div className="w-px h-5 bg-[color:var(--color-border)] mx-1" />;

const IconBtn = ({ icon: Icon, label, active, onClick, size = 15 }) => (
  <button
    onClick={onClick}
    title={label}
    className={`h-7 min-w-7 px-1.5 grid place-items-center rounded transition-colors ${
      active
        ? 'text-[color:var(--color-accent)] bg-[color:var(--color-surface-3)]'
        : 'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-3)]'
    }`}
  >
    <Icon size={size} />
  </button>
);

const TopBar = ({ isPaper, setIsPaper }) => {
  const { activeSymbol, activeTimeframe, setActiveTimeframe } = useMarketStore();

  return (
    <div className="w-full h-full flex items-center px-2 gap-1 text-[13px]">
      {/* Brand */}
      <a
        href="#"
        className="h-7 flex items-center px-1.5 rounded hover:bg-[color:var(--color-surface-3)] transition-colors"
        title="QuantBridge"
      >
        <Logo size={22} />
      </a>

      <Divider />

      {/* Symbol search */}
      <button
        className="h-7 flex items-center gap-2 pl-2 pr-3 rounded bg-[color:var(--color-surface-2)] hover:bg-[color:var(--color-surface-3)] border border-[color:var(--color-border)] transition-colors"
        title="Search symbol"
      >
        <Search size={14} className="text-[color:var(--color-text-secondary)]" />
        <span className="font-medium tracking-wide text-[color:var(--color-text-primary)]">
          {activeSymbol || 'BTCUSDT'}
        </span>
        <span className="text-[10px] px-1 py-px rounded bg-[color:var(--color-surface-3)] text-[color:var(--color-text-secondary)] font-mono">
          BINANCE
        </span>
      </button>

      <IconBtn icon={Plus} label="Compare / Add symbol" />

      <Divider />

      {/* Timeframes */}
      <div className="flex items-center gap-0.5">
        {timeframes.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setActiveTimeframe(tf.value)}
            className={`h-7 px-2 text-[12px] font-medium rounded transition-colors ${
              activeTimeframe === tf.value
                ? 'text-[color:var(--color-accent)] bg-[color:var(--color-surface-3)]'
                : 'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-3)]'
            }`}
          >
            {tf.label}
          </button>
        ))}
        <IconBtn icon={ChevronDown} label="More intervals" size={13} />
      </div>

      <Divider />

      {/* Chart type */}
      <IconBtn icon={CandlestickChart} label="Candles" active />
      <IconBtn icon={BarChart3} label="Bars" />
      <IconBtn icon={LineChart} label="Line" />

      <Divider />

      {/* Indicators */}
      <button className="h-7 px-2 flex items-center gap-1.5 rounded text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-3)] transition-colors">
        <Activity size={14} />
        <span className="text-[12px]">Indicators</span>
      </button>

      <button className="h-7 px-2 flex items-center gap-1.5 rounded text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-3)] transition-colors">
        <Bell size={14} />
        <span className="text-[12px]">Alert</span>
      </button>

      <div className="flex-1" />

      {/* Right side */}
      <IconBtn icon={Undo2} label="Undo" />
      <IconBtn icon={Redo2} label="Redo" />
      <Divider />
      <IconBtn icon={Camera} label="Snapshot" />
      <IconBtn icon={Save} label="Save layout" />
      <IconBtn icon={LayoutGrid} label="Select layout" />
      <IconBtn icon={Maximize2} label="Fullscreen" />
      <IconBtn icon={MessageSquare} label="Ideas" />
      <IconBtn icon={Settings} label="Settings" />

      <Divider />

      {/* Paper / Real toggle — compact */}
      <div
        onClick={() => setIsPaper(!isPaper)}
        className="flex items-center h-7 rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] overflow-hidden cursor-pointer text-[11px] font-semibold tracking-wide select-none"
      >
        <div className={`px-2.5 h-full grid place-items-center transition-colors ${
          isPaper ? 'bg-[color:var(--color-accent)] text-white' : 'text-[color:var(--color-text-secondary)]'
        }`}>PAPER</div>
        <div className={`px-2.5 h-full grid place-items-center transition-colors ${
          !isPaper ? 'bg-[color:var(--color-down)] text-white' : 'text-[color:var(--color-text-secondary)]'
        }`}>LIVE</div>
      </div>
    </div>
  );
};

export default TopBar;
