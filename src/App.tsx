import React, { useState } from 'react';
import { WeatherFloodHUD } from './components/retro/WeatherFloodHUD';
import { ComponentCatalog } from './components/retro/ComponentCatalog';

export default function App() {
  const [activeTab, setActiveTab] = useState<'hud' | 'catalog'>('hud');
  const [enableScanlines, setEnableScanlines] = useState(true);

  return (
    <div
      className={`min-h-screen bg-retro-stripes text-[#d6e2d3] font-mono selection:bg-[#bef264] selection:text-black flex flex-col justify-between ${
        enableScanlines ? 'scanlines' : ''
      }`}
    >
      {/* ======================================================== */}
      {/* TOP NAVIGATION BAR (Zone 1: Brand, Zone 2: Nav, Zone 3: Actions) */}
      {/* ======================================================== */}
      <header className="border-b border-[#1c2a1e] bg-[#090d0a]/95 backdrop-blur-md px-4 sm:px-8 py-3 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Brand */}
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-[#bef264] inline-block shadow-[0_0_8px_#bef264]" />
            <span className="text-sm sm:text-base font-extrabold tracking-wider text-white">
              WEATHER/FLOOD HUD
            </span>
            <span className="text-[10px] text-[#6b856e] hidden md:inline tracking-tight">
              // TELEMETRY PROTOTYPE
            </span>
          </div>

          {/* Zone 2: Primary Nav / View Tabs */}
          <nav className="flex items-center gap-1.5 p-1 bg-[#0d140f] border border-[#203023]">
            <button
              onClick={() => setActiveTab('hud')}
              className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'hud'
                  ? 'bg-[#bef264] text-black shadow-[0_0_6px_#bef264]'
                  : 'text-[#8ea68c] hover:text-white'
              }`}
            >
              [ LIVE HUD ]
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-[#bef264] text-black shadow-[0_0_6px_#bef264]'
                  : 'text-[#8ea68c] hover:text-white'
              }`}
            >
              [ COMPONENTS ]
            </button>
          </nav>

          {/* Zone 3: Utility Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEnableScanlines(!enableScanlines)}
              className="text-[11px] text-[#8ea68c] hover:text-[#bef264] border border-[#233526] bg-[#0c120e] px-2.5 py-1 tracking-wider cursor-pointer"
            >
              CRT FX: [{enableScanlines ? 'ON' : 'OFF'}]
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MAIN VIEWPORT */}
      {/* ======================================================== */}
      <main className="flex-1 p-4 sm:p-8 flex items-center justify-center">
        {activeTab === 'hud' ? <WeatherFloodHUD /> : <ComponentCatalog />}
      </main>

      {/* ======================================================== */}
      {/* CLEAN FOOTER */}
      {/* ======================================================== */}
      <footer className="border-t border-[#19251b] bg-[#080b09] py-3 px-4 text-center text-[11px] text-[#5e7861]">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>STATION PROTOCOL: RETRO-TELEMETRY-v2.4</span>
          <span>CHANNELS NOMINAL · 1000 HZ REFRESH</span>
          <span className="text-[#8ea68c]">
            LATENCY: <span className="text-[#bef264] font-bold">12ms</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
