import React from 'react';
import { useMarketStore } from '../stores/useMarketStore';

const ExecutionModal = () => {
  const { activeSymbol, action, isExecuteOpen, setExecuteOpen } = useMarketStore();

  if (!isExecuteOpen) return null;

  return (
    <div id="execution-modal" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-80">
      <div className="bg-[#0A0A0C]/80 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-mono text-[#94A3B8]">EXECUTE</div>
          <button 
            className="text-white/50 hover:text-white"
            onClick={() => setExecuteOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="text-2xl font-mono font-bold text-white mb-1">{activeSymbol || 'BTCUSDT'}</div>
          <div className={`text-sm font-mono px-2 py-1 rounded inline-block ${action === 'BUY' ? 'bg-[#00F2FF]/20 text-[#00F2FF]' : 'bg-[#FF00F2]/20 text-[#FF00F2]'}`}>
            {action || 'BUY'} SIGNAL
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 rounded p-3 mb-6 font-mono text-xs text-center">
          <div className="text-[#94A3B8] mb-1">KELLY OPTIMAL SIZE</div>
          <div className="text-xl text-white">2.5 LOTS</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="py-3 bg-white/5 hover:bg-[#10B981] hover:text-black text-[#10B981] rounded font-bold transition-all border border-[#10B981]/50">
            BUY
          </button>
          <button className="py-3 bg-white/5 hover:bg-[#EF4444] hover:text-white text-[#EF4444] rounded font-bold transition-all border border-[#EF4444]/50">
            SELL
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionModal;
