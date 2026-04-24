import React, { useState } from 'react';
import TopBar from './components/TopBar';
import MainChart from './components/MainChart';
import RightPanel from './components/RightPanel';
import AlphaBarcode from './components/AlphaBarcode';
import ExecutionModal from './components/ExecutionModal';
import { useMarketData } from './hooks/useMarketData';   // 👈 लाइव डेटा

function App() {
  const [isPaper, setIsPaper] = useState(true);
  
  // ⚡ क्वांट ब्रिज डेटा पाइपलाइन ऐक्टिवेट करो
  useMarketData();

  return (
    <div className="h-screen w-full flex flex-col bg-[#0A0A0C] text-[#E2E8F0] font-sans overflow-hidden">
      {/* टॉप बार */}
      <div className="h-[40px] shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <TopBar isPaper={isPaper} setIsPaper={setIsPaper} />
      </div>

      {/* मेन एरिया */}
      <div className="flex-1 w-full flex overflow-hidden">
        <div className="w-[70%] relative bg-[#0A0A0C]">
          <MainChart />
        </div>
        <div className="w-[30%] bg-[#0D0D12] border-l border-white/5">
          <RightPanel />
        </div>
      </div>

      {/* बॉटम अल्फा बारकोड */}
      <div className="h-[30px] shrink-0 border-t border-white/10 bg-[#0A0A0C] flex items-center">
        <AlphaBarcode />
      </div>

      <ExecutionModal />
    </div>
  );
}

export default App;