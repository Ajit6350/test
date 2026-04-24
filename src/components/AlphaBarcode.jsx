import React, { useMemo } from 'react';

const AlphaBarcode = () => {
  // Generate a random barcode representing the last 150 periods statically
  const segments = useMemo(() => Array.from({ length: 150 }).map(() => {
    // eslint-disable-next-line react-hooks/purity
    const val = Math.random();
    if (val > 0.8) return 'bg-[#10B981]'; // Strong trend
    if (val < 0.2) return 'bg-[#EF4444]'; // Mean reversion / bearish
    if (val > 0.4 && val < 0.6) return 'bg-[#00F2FF]'; // Whale activity
    return 'bg-white/10'; // Dead zone
  }), []);

  return (
    <div className="w-full h-full flex items-center px-2 gap-[1px] opacity-80 hover:opacity-100 transition-opacity cursor-crosshair">
      <div className="text-[9px] font-mono text-[#94A3B8] uppercase tracking-widest mr-4 shrink-0">Alpha Barcode</div>
      {segments.map((color, i) => (
        <div key={`segment-${i}`} className={`flex-1 h-3/5 rounded-sm ${color} transition-all hover:h-full`} />
      ))}
    </div>
  );
};

export default AlphaBarcode;
