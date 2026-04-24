import React, { useEffect, useState } from 'react';
import { Wifi, Clock, Globe, Percent, Activity } from 'lucide-react';
import { useMarketStore } from '../stores/useMarketStore';

const fmtTime = (d) =>
  d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const StatusBar = ({ isPaper }) => {
  const { activeSymbol, tickerData, activeTimeframe } = useMarketStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = tickerData[activeSymbol] || {};

  return (
    <div className="h-6 shrink-0 flex items-center gap-4 px-3 bg-[var(--color-surface)] border-t border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)] font-mono">
      <span className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${isPaper ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-bear)]'} tv-pulse`} />
        {isPaper ? 'Paper trading' : 'Live trading'}
      </span>

      <span className="flex items-center gap-1.5"><Wifi size={11} className="text-[var(--color-bull)]" /> Connected</span>
      <span className="flex items-center gap-1.5"><Globe size={11} /> Binance · Spot</span>
      <span className="flex items-center gap-1.5"><Activity size={11} /> {activeSymbol} · {activeTimeframe}</span>
      {t.price && (
        <span className="flex items-center gap-1.5"><Percent size={11} /> Last {t.price.toFixed(2)}</span>
      )}

      <span className="ml-auto flex items-center gap-1.5"><Clock size={11} /> {fmtTime(now)} UTC</span>
    </div>
  );
};

export default StatusBar;
