import React, { useState } from 'react';
import TopBar from './components/TopBar';
import LeftRail from './components/LeftRail';
import DrawingTools from './components/DrawingTools';
import MainChart from './components/MainChart';
import RightPanel from './components/RightPanel';
import AlphaBarcode from './components/AlphaBarcode';
import ExecutionModal from './components/ExecutionModal';
import { useMarketData } from './hooks/useMarketData';

function App() {
  const [isPaper, setIsPaper] = useState(true);
  useMarketData();

  return (
    <div className="h-screen w-full flex flex-col bg-[color:var(--color-bg)] text-[color:var(--color-text-primary)] font-sans overflow-hidden">
      {/* Top toolbar */}
      <div className="h-[38px] shrink-0 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <TopBar isPaper={isPaper} setIsPaper={setIsPaper} />
      </div>

      {/* Main area: left rail + drawing tools + chart + right panel */}
      <div className="flex-1 min-h-0 w-full flex overflow-hidden">
        <LeftRail />

        {/* Chart + drawing tools */}
        <div className="flex-1 min-w-0 flex">
          <DrawingTools />
          <div className="flex-1 min-w-0 relative border-l border-[color:var(--color-border)]">
            <MainChart />
          </div>
        </div>

        {/* Right panel: watchlist + Alpha engine */}
        <div className="w-[300px] shrink-0 border-l border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          <RightPanel />
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="h-[26px] shrink-0 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <AlphaBarcode />
      </div>

      <ExecutionModal />
    </div>
  );
}

export default App;
