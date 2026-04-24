import React, { useState } from 'react';
import { useMarketStore } from '../stores/useMarketStore';

const RightPanel = () => {
  const { alphaScore, action, vpin, ofi, hurst, entropy } = useMarketStore();
  const [tab, setTab] = useState('SENTINEL');

  // Dummy data for radar
  const radarItems = [
    { sym: 'SOLUSDT', score: 92, spark: 'bg-[#00F2FF]' },
    { sym: 'ETHUSDT', score: 85, spark: 'bg-[#00F2FF]' },
    { sym: 'XRPUSDT', score: 40, spark: 'bg-[#EF4444]' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
        {/* A. RADAR (20% height) */}
        <div className="flex flex-col border-b border-white/5 h-[20%]">
          <div className="flex text-xs font-mono border-b border-white/5 shrink-0">
            <button 
              className={`flex-1 py-2 text-center ${tab === 'FAVS' ? 'text-white border-b-2 border-[#00F2FF]' : 'text-[#94A3B8] hover:text-white'}`}
              onClick={() => setTab('FAVS')}
            >
              FAVS
            </button>
            <button 
              className={`flex-1 py-2 text-center flex items-center justify-center gap-2 ${tab === 'SENTINEL' ? 'text-[#00F2FF] border-b-2 border-[#00F2FF]' : 'text-[#94A3B8] hover:text-white'}`}
              onClick={() => setTab('SENTINEL')}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FF] animate-pulse" />
              SENTINEL
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {radarItems.map(item => (
              <div key={item.sym} className="flex items-center justify-between p-2 hover:bg-white/5 rounded cursor-pointer group transition-colors">
                <span className="font-mono text-sm text-[#E2E8F0] group-hover:text-[#00F2FF]">{item.sym}</span>
                <div className={`w-8 h-[2px] ${item.spark}`}></div>
                <div className={`text-xs font-mono px-1.5 py-0.5 rounded ${item.score > 80 ? 'bg-[#00F2FF]/20 text-[#00F2FF]' : 'bg-red-500/20 text-red-500'}`}>
                  {item.score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* B. QUANT HUD (80% height) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6 pb-20">
          
          {/* Top Priority */}
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] text-[#94A3B8] font-mono mb-1 uppercase">Alpha Score</div>
                <div className="text-5xl font-mono font-bold tracking-tighter" style={{ textShadow: `0 0 20px ${alphaScore > 70 ? '#00F2FF' : '#FF00F2'}` }}>
                  {alphaScore || 88}<span className="text-xl text-white/50">%</span>
                </div>
              </div>
              <div className={`px-4 py-2 font-mono font-bold tracking-widest rounded shadow-lg ${
                action === 'BUY' ? 'bg-[#00F2FF] text-black shadow-[#00F2FF]/50' : 
                action === 'SELL' ? 'bg-[#FF00F2] text-white shadow-[#FF00F2]/50' : 
                'bg-white/10 text-white'
              }`}>
                {action || 'HOLD'}
              </div>
            </div>

            {/* VPIN Gauge */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#94A3B8]">VPIN (Toxicity)</span>
                <span className={vpin > 0.7 ? 'text-[#FF00F2]' : 'text-[#00F2FF]'}>{vpin || '0.65'}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${vpin > 0.7 ? 'bg-[#FF00F2]' : 'bg-[#00F2FF]'}`} style={{ width: `${(vpin || 0.65) * 100}%` }} />
              </div>
            </div>

            {/* OFI Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#94A3B8]">OFI (Flow Imbalance)</span>
                <span className="text-emerald-400">+{ofi || '2.4'}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-400 transition-all" style={{ width: '60%' }} />
              </div>
            </div>
          </div>

          {/* Second Priority */}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <div>
              <div className="text-[10px] text-[#94A3B8] font-mono mb-2 uppercase">Regime Barcode</div>
              <div className="h-3 flex rounded overflow-hidden opacity-80">
                <div className="flex-1 bg-[#10B981]"></div>
                <div className="flex-1 bg-[#10B981]"></div>
                <div className="flex-1 bg-[#EF4444]"></div>
                <div className="flex-1 bg-gray-500"></div>
                <div className="flex-1 bg-[#10B981]"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-2 bg-white/[0.02] rounded border border-white/5">
                <div className="text-[10px] text-[#94A3B8] font-mono">HURST</div>
                <div className="text-sm font-mono text-white">{hurst || '0.65'} <span className="text-[#10B981] text-[10px]">TREND</span></div>
              </div>
              <div className="p-2 bg-white/[0.02] rounded border border-white/5">
                <div className="text-[10px] text-[#94A3B8] font-mono">ENTROPY</div>
                <div className="text-sm font-mono text-white">{entropy || '0.31'} <span className="text-[#00F2FF] text-[10px]">LOW</span></div>
              </div>
            </div>
          </div>

        </div>
    </div>
  );
};

export default RightPanel;
