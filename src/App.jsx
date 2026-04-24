import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import TopBar       from './components/TopBar';
import LeftRail     from './components/LeftRail';
import DrawingTools from './components/DrawingTools';
import MainChart    from './components/MainChart';
import AlphaBarcode from './components/AlphaBarcode';
import ExecutionModal from './components/ExecutionModal';
import { WatchList, SentinelRadar, AlphaHUD } from './components/RightPanel';
import { useMarketData } from './hooks/useMarketData';

/* -------------------------------------------------------------- */
/*  Resize handle — TradingView-style thin divider with hover    */
/* -------------------------------------------------------------- */
const VHandle = () => (
  <PanelResizeHandle className="tv-handle tv-handle-v" />
);
const HHandle = () => (
  <PanelResizeHandle className="tv-handle tv-handle-h" />
);

function App() {
  const [isPaper, setIsPaper] = useState(true);
  useMarketData();

  return (
    <div className="h-screen w-full flex flex-col bg-[color:var(--color-bg)] text-[color:var(--color-text-primary)] font-sans overflow-hidden">
      {/* Top toolbar */}
      <div className="h-[38px] shrink-0 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <TopBar isPaper={isPaper} setIsPaper={setIsPaper} />
      </div>

      {/* ---------- Workspace ---------- */}
      <div className="flex-1 min-h-0 w-full flex overflow-hidden">
        {/* Fixed icon rail */}
        <LeftRail />

        {/* Everything to the right of the rail is resizable */}
        <PanelGroup direction="horizontal" className="flex-1 min-w-0" autoSaveId="tv-workspace-h">
          {/* Chart + drawing tools */}
          <Panel defaultSize={68} minSize={40} className="flex min-w-0">
            <DrawingTools />
            <div className="flex-1 min-w-0 relative border-l border-[color:var(--color-border)]">
              <MainChart />
            </div>
          </Panel>

          <VHandle />

          {/* Right column: top row (Watchlist + Sentinel) + bottom (Alpha HUD) */}
          <Panel defaultSize={32} minSize={18} maxSize={55} className="min-w-0">
            <PanelGroup direction="vertical" autoSaveId="tv-workspace-right-v">
              {/* Top: Watchlist ↔ Sentinel side-by-side */}
              <Panel defaultSize={55} minSize={20}>
                <PanelGroup direction="horizontal" autoSaveId="tv-workspace-right-top-h">
                  <Panel defaultSize={50} minSize={25}>
                    <WatchList />
                  </Panel>
                  <VHandle />
                  <Panel defaultSize={50} minSize={25}>
                    <SentinelRadar />
                  </Panel>
                </PanelGroup>
              </Panel>

              <HHandle />

              {/* Bottom: Alpha Engine */}
              <Panel defaultSize={45} minSize={15}>
                <AlphaHUD />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
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
