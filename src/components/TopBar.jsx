import React from 'react';
import { useMarketStore } from '../stores/useMarketStore';

const TopBar = ({ isPaper, setIsPaper }) => {
  const { activeSymbol, activeTimeframe, setActiveTimeframe } = useMarketStore();
  const timeframes = ['1s', '5s', '1m', '5m', '1h', '1D'];

  return (
    <div className="w-full h-full flex items-center justify-between px-4">
      {/* Left: Logo + Symbol */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00F2FF] animate-pulse"></div>
          <span className="font-bold tracking-wider text-sm text-white/90">QUANT<span className="text-[#00F2FF]">BRIDGE</span></span>
        </div>
        <div className="px-3 py-1 bg-white/5 rounded text-sm font-mono text-[#E2E8F0] border border-white/10">
          {activeSymbol || 'BTCUSDT'}
        </div>
      </div>

      {/* Center: Timeframes */}
      <div className="flex items-center gap-1 bg-[#0A0A0C] p-1 rounded-md border border-white/5">
        {timeframes.map(tf => (
          <button
            key={tf}
            onClick={() => setActiveTimeframe(tf)}
            className={`px-3 py-0.5 text-xs font-mono rounded transition-colors ${
              activeTimeframe === tf 
                ? 'bg-[#00F2FF]/20 text-[#00F2FF]' 
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button className="text-[#94A3B8] hover:text-[#00F2FF] transition-colors">🔔</button>
        <button className="text-[#94A3B8] hover:text-[#FF00F2] transition-colors">▶</button>
        
        {/* Toggle Paper/Real */}
        <div className="flex items-center gap-2 bg-[#0A0A0C] border border-white/10 rounded-full p-0.5 cursor-pointer" onClick={() => setIsPaper(!isPaper)}>
          <div className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${isPaper ? 'bg-[#00F2FF] text-black font-bold shadow-[0_0_10px_#00F2FF]' : 'text-[#94A3B8]'}`}>
            PAPER
          </div>
          <div className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${!isPaper ? 'bg-[#FF00F2] text-white font-bold shadow-[0_0_10px_#FF00F2]' : 'text-[#94A3B8]'}`}>
            REAL
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
