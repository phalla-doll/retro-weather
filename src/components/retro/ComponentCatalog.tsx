import React, { useState } from 'react';
import { RetroContainer } from './RetroContainer';
import { RetroRadarScope } from './RetroRadarScope';
import { RetroHydrograph } from './RetroHydrograph';
import { RetroSegmentedBar } from './RetroSegmentedBar';
import { RetroBarcodeBadge } from './RetroBarcodeBadge';
import { RetroStatGrid } from './RetroStatGrid';
import { RetroAlertBox } from './RetroAlertBox';
import {
  RetroStepper,
  RetroToggle,
  RetroButton,
  RetroDivider,
  RetroPropRow,
} from './RetroControls';
import { RetroWaterLevelTrendWidget } from './RetroWaterLevelTrendWidget';

export const ComponentCatalog: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<string>('all');
  const [demoValue, setDemoValue] = useState(72);
  const [demoSegments, setDemoSegments] = useState(24);
  const [demoStepper, setDemoStepper] = useState(3);
  const [demoToggle, setDemoToggle] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const navItems = [
    { id: 'all', label: 'ALL COMPONENTS' },
    { id: 'trend', label: '24H EVILCHART' },
    { id: 'container', label: 'RETRO CONTAINER' },
    { id: 'radar', label: 'RADAR SCOPE' },
    { id: 'hydrograph', label: 'HYDROGRAPH' },
    { id: 'segmented', label: 'SEGMENTED LED' },
    { id: 'badge', label: 'BARCODE BADGE' },
    { id: 'stats', label: 'STAT GRID' },
    { id: 'alert', label: 'ALERT BOX' },
    { id: 'controls', label: 'CONTROLS' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 font-mono select-none">
      {/* Sub-navigation bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#090d0a] border border-[#223525] overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedComp(item.id)}
            className={`px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedComp === item.id
                ? 'bg-[#bef264] text-black shadow-[0_0_8px_#bef264]'
                : 'text-[#8ea68c] hover:text-white hover:bg-[#121c14]'
            }`}
          >
            [ {item.label} ]
          </button>
        ))}
      </div>

      {/* COMPONENT 0: 24H RETRO EVILCHART TREND */}
      {(selectedComp === 'all' || selectedComp === 'trend') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#253928] pb-1">
            <h2 className="text-sm font-bold text-[#bef264] tracking-wider uppercase">
              00. RetroWaterLevelTrendWidget (24H EvilCharts / Recharts CRT Hydrograph)
            </h2>
            <button
              onClick={() =>
                copyCode(
                  'trend',
                  `<RetroWaterLevelTrendWidget currentStage={3.85} dangerLevel={4.2} evacLevel={5.0} />`
                )
              }
              className="text-[10px] text-[#869984] hover:text-white border border-[#2d4231] px-2 py-0.5"
            >
              {copiedKey === 'trend' ? '✓ COPIED' : 'COPY TSX'}
            </button>
          </div>
          <p className="text-xs text-[#9eb59b]">
            High-contrast green-on-black phosphorescent line graph with subtle gradient glow, dotted pattern background, alert/evacuation threshold reference lines, interactive tooltip, and multi-metric switching (Stage / Rain / Flow).
          </p>
          <RetroWaterLevelTrendWidget currentStage={3.85} dangerLevel={4.2} evacLevel={5.0} />
        </section>
      )}

      {/* COMPONENT 1: RETRO CONTAINER */}
      {(selectedComp === 'all' || selectedComp === 'container') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#253928] pb-1">
            <h2 className="text-sm font-bold text-[#bef264] tracking-wider uppercase">
              01. RetroContainer (HUD Panel Frame)
            </h2>
            <button
              onClick={() =>
                copyCode(
                  'container',
                  `<RetroContainer title="ROLLOUT" hashCount={26} statusText="25%" statusColor="amber">
  {/* Content */}
</RetroContainer>`
                )
              }
              className="text-[10px] text-[#869984] hover:text-white border border-[#2d4231] px-2 py-0.5"
            >
              {copiedKey === 'container' ? '✓ COPIED' : 'COPY TSX'}
            </button>
          </div>
          <p className="text-xs text-[#9eb59b]">
            Features tactical corner brackets (+), edge calibration ticks, ASCII hash meter, and top title bar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RetroContainer title="BASIN-TELEMETRY" hashCount={16} statusText="ONLINE" statusColor="lime">
              <div className="p-4 text-center text-xs text-[#a0b59e] border border-dashed border-[#233526]">
                Interior component slot with standard 16px spatial padding.
              </div>
            </RetroContainer>
            <RetroContainer
              title="WARNING-BUFFER"
              hashCount={12}
              statusText="CRITICAL 92%"
              statusColor="red"
            >
              <div className="p-4 text-center text-xs text-[#fca5a5] border border-dashed border-[#ef4444]/40">
                Red hazard variant for crest threshold breach.
              </div>
            </RetroContainer>
          </div>
        </section>
      )}

      {/* COMPONENT 2: RADAR SCOPE */}
      {(selectedComp === 'all' || selectedComp === 'radar') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#253928] pb-1">
            <h2 className="text-sm font-bold text-[#bef264] tracking-wider uppercase">
              02. RetroRadarScope (Tactical Doppler & Flood Inundation)
            </h2>
            <button
              onClick={() =>
                copyCode(
                  'radar',
                  `<RetroRadarScope isSweeping={true} onSelectTarget={(target) => console.log(target)} />`
                )
              }
              className="text-[10px] text-[#869984] hover:text-white border border-[#2d4231] px-2 py-0.5"
            >
              {copiedKey === 'radar' ? '✓ COPIED' : 'COPY TSX'}
            </button>
          </div>
          <p className="text-xs text-[#9eb59b]">
            Concentric polar range rings, hatched diagonal flood hazard zone polygon, sweeping radar needle, and coordinate callouts.
          </p>
          <div className="max-w-md mx-auto">
            <RetroRadarScope isSweeping={true} />
          </div>
        </section>
      )}

      {/* COMPONENT 3: HYDROGRAPH */}
      {(selectedComp === 'all' || selectedComp === 'hydrograph') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#253928] pb-1">
            <h2 className="text-sm font-bold text-[#bef264] tracking-wider uppercase">
              03. RetroHydrograph (Stepped Telemetry Water Stage)
            </h2>
            <button
              onClick={() =>
                copyCode(
                  'hydrograph',
                  `<RetroHydrograph currentStageMeters={3.85} dangerStageMeters={4.2} evacStageMeters={5.0} rateOfRise="+12 cm/h" />`
                )
              }
              className="text-[10px] text-[#869984] hover:text-white border border-[#2d4231] px-2 py-0.5"
            >
              {copiedKey === 'hydrograph' ? '✓ COPIED' : 'COPY TSX'}
            </button>
          </div>
          <p className="text-xs text-[#9eb59b]">
            Geometric stepped curve with phosphor area fill, downward callout cone marker at active crest stage, and bottom timeline ticks.
          </p>
          <RetroHydrograph currentStageMeters={3.85} dangerStageMeters={4.2} />
        </section>
      )}

      {/* COMPONENT 4: SEGMENTED LED BARS */}
      {(selectedComp === 'all' || selectedComp === 'segmented') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#253928] pb-1">
            <h2 className="text-sm font-bold text-[#bef264] tracking-wider uppercase">
              04. RetroSegmentedBar (24-Segment LED Gauges)
            </h2>
            <button
              onClick={() =>
                copyCode(
                  'segmented',
                  `<RetroSegmentedBar label="RIVER STAGE LEVEL" value={75} max={100} totalSegments={24} color="lime" showNumeric />`
                )
              }
              className="text-[10px] text-[#869984] hover:text-white border border-[#2d4231] px-2 py-0.5"
            >
              {copiedKey === 'segmented' ? '✓ COPIED' : 'COPY TSX'}
            </button>
          </div>
          <p className="text-xs text-[#9eb59b]">
            Discrete LED blocks matching the exact 3-row cluster in the reference UI.
          </p>
          <div className="p-4 bg-[#0a0f0b] border border-[#1e2e21] space-y-4">
            <RetroSegmentedBar
              label="RIVER WATER STAGE (METERS)"
              value={demoValue}
              max={100}
              totalSegments={demoSegments}
              color="lime"
              showNumeric
            />
            <RetroSegmentedBar
              label="SLUICE GATE APERTURE"
              value={58}
              max={100}
              totalSegments={demoSegments}
              color="lime"
              showNumeric
            />
            <RetroSegmentedBar
              label="BASIN SOIL SATURATION INDEX"
              value={84}
              max={100}
              totalSegments={demoSegments}
              color="amber"
              showNumeric
            />
            <RetroSegmentedBar
              label="EMBANKMENT RUNOFF RISK"
              value={92}
              max={100}
              totalSegments={demoSegments}
              color="red"
              showNumeric
            />

            {/* Interactive knobs */}
            <div className="pt-3 border-t border-[#1a291d] flex flex-wrap items-center gap-4 text-xs text-[#869984]">
              <span className="font-bold text-white">TEST SLIDER:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={demoValue}
                onChange={(e) => setDemoValue(Number(e.target.value))}
                className="accent-[#bef264] cursor-pointer"
              />
              <span className="text-[#bef264] font-bold">{demoValue}%</span>
            </div>
          </div>
        </section>
      )}

      {/* COMPONENT 5: BARCODE BADGE */}
      {(selectedComp === 'all' || selectedComp === 'badge') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#253928] pb-1">
            <h2 className="text-sm font-bold text-[#bef264] tracking-wider uppercase">
              05. RetroBarcodeBadge (Status + Telemetry Barcode)
            </h2>
            <button
              onClick={() =>
                copyCode(
                  'badge',
                  `<RetroBarcodeBadge statusText="LIVE" sublabel="dpl_8f3a · 4h" variant="lime" />`
                )
              }
              className="text-[10px] text-[#869984] hover:text-white border border-[#2d4231] px-2 py-0.5"
            >
              {copiedKey === 'badge' ? '✓ COPIED' : 'COPY TSX'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RetroBarcodeBadge statusText="LIVE" sublabel="dpl_8f3a · 4h" variant="lime" />
            <RetroBarcodeBadge statusText="ALERT" sublabel="flod_warn · 12m" variant="amber" />
            <RetroBarcodeBadge statusText="EVAC" sublabel="crit_gate · 2m" variant="red" />
          </div>
        </section>
      )}

      {/* COMPONENT 6: STAT GRID */}
      {(selectedComp === 'all' || selectedComp === 'stats') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#253928] pb-1">
            <h2 className="text-sm font-bold text-[#bef264] tracking-wider uppercase">
              06. RetroStatGrid (Crisp 2x3 & 3x2 Hairline Grid)
            </h2>
            <button
              onClick={() =>
                copyCode(
                  'stats',
                  `<RetroStatGrid columns={3} items={[{ label: 'LB', value: '443' }, { label: 'BUDGET', value: '0.5%', highlightColor: 'amber' }]} />`
                )
              }
              className="text-[10px] text-[#869984] hover:text-white border border-[#2d4231] px-2 py-0.5"
            >
              {copiedKey === 'stats' ? '✓ COPIED' : 'COPY TSX'}
            </button>
          </div>
          <RetroStatGrid
            columns={3}
            items={[
              { label: 'LB', value: '443' },
              { label: 'HEALTH', value: '/healthz' },
              { label: 'IMAGE', value: 'bun:1.3.0' },
              { label: 'REPL', value: '3' },
              { label: 'BUDGET', value: '0.5%', highlightColor: 'amber' },
              { label: 'TIMEOUT', value: '30 s' },
            ]}
          />
        </section>
      )}

      {/* COMPONENT 7: ALERT BOX */}
      {(selectedComp === 'all' || selectedComp === 'alert') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#253928] pb-1">
            <h2 className="text-sm font-bold text-[#bef264] tracking-wider uppercase">
              07. RetroAlertBox (Dashed Border Hazard Module)
            </h2>
            <button
              onClick={() =>
                copyCode(
                  'alert',
                  `<RetroAlertBox title="REDIS · CRASHED" statusBadge="CRITICAL" lines={['OOM at 256 MB', '3 restarts in 10 min']} actionLabel="RAISE TO 512 MB" severity="critical" />`
                )
              }
              className="text-[10px] text-[#869984] hover:text-white border border-[#2d4231] px-2 py-0.5"
            >
              {copiedKey === 'alert' ? '✓ COPIED' : 'COPY TSX'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RetroAlertBox
              title="REDIS · CRASHED"
              statusBadge="CRITICAL"
              lines={['OOM at 256 MB', '3 restarts in 10 min']}
              actionLabel="RAISE TO 512 MB"
              severity="critical"
            />
            <RetroAlertBox
              title="RESERVOIR · APPROACHING LIMIT"
              statusBadge="WARNING"
              lines={['Current level 94.2% of capacity', 'Crest expected at 18:30 UTC']}
              actionLabel="PRE-EMPTIVE DISCHARGE"
              severity="warning"
            />
          </div>
        </section>
      )}

      {/* COMPONENT 8: CONTROLS */}
      {(selectedComp === 'all' || selectedComp === 'controls') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#253928] pb-1">
            <h2 className="text-sm font-bold text-[#bef264] tracking-wider uppercase">
              08. Retro Controls (Steppers, Toggles & Buttons)
            </h2>
          </div>
          <div className="p-4 bg-[#0a0f0b] border border-[#1e2e21] space-y-4">
            {/* Stepper & Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs text-[#8ea68c] uppercase">Stepper Input:</span>
                <div className="flex items-center gap-3">
                  <RetroStepper
                    value={demoStepper}
                    min={1}
                    max={12}
                    onChange={(val) => setDemoStepper(val)}
                  />
                  <span className="text-xs text-[#cbd5e1]">Active Units: {demoStepper}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-[#8ea68c] uppercase">Interactive Toggles:</span>
                <RetroToggle
                  label="AUTOSCALE 2-6"
                  checked={demoToggle}
                  onChange={(c) => setDemoToggle(c)}
                />
              </div>
            </div>

            <RetroDivider />

            {/* Buttons Row */}
            <div className="space-y-2">
              <span className="text-xs text-[#8ea68c] uppercase">Action Buttons:</span>
              <div className="flex flex-wrap gap-3">
                <RetroButton variant="outline">LOGS</RetroButton>
                <RetroButton variant="primary">REDEPLOY</RetroButton>
                <RetroButton variant="amber">DRAIN WATER</RetroButton>
                <RetroButton variant="danger">EMERGENCY CUTOFF</RetroButton>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
