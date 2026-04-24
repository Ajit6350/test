import React from 'react';
import { X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useMarketStore } from '../stores/useMarketStore';

const ExecutionModal = () => {
  const { activeSymbol, action, isExecuteOpen, setExecuteOpen, tickerData } = useMarketStore();
  if (!isExecuteOpen) return null;
  const t = tickerData[activeSymbol] || {};
  const price = t.price ?? 77034.12;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm">
      <div className="w-[380px] rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 h-11 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">Execute order</span>
            <span className="text-[11px] text-[var(--color-text-muted)] font-mono">· {activeSymbol}</span>
          </div>
          <button
            onClick={() => setExecuteOpen(false)}
            className="h-7 w-7 grid place-items-center rounded hover:bg-[var(--color-surface-3)] text-[var(--color-text-secondary)]"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="p-3 rounded bg-[var(--color-surface-2)] border border-[var(--color-border)]">
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Mark price</div>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-[22px] font-mono font-semibold text-[var(--color-text-primary)]">{price.toFixed(2)}</span>
              <span className="text-[11px] text-[var(--color-text-muted)]">USDT</span>
            </div>
            <div className={`mt-1 inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded ${
              action === 'SELL' ? 'bg-[var(--color-bear)]/15 text-[var(--color-bear)]' : 'bg-[var(--color-bull)]/15 text-[var(--color-bull)]'
            }`}>
              {action === 'SELL' ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
              {action || 'BUY'} signal · Kelly 0.025 BTC
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="h-10 rounded bg-[var(--color-bull)] hover:opacity-90 text-white text-[13px] font-semibold">
              Buy / Long
            </button>
            <button className="h-10 rounded bg-[var(--color-bear)] hover:opacity-90 text-white text-[13px] font-semibold">
              Sell / Short
            </button>
          </div>

          <button
            onClick={() => setExecuteOpen(false)}
            className="w-full h-8 text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionModal;
