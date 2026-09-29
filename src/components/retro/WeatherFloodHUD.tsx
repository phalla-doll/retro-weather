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
import { RetroLogDrawer } from './RetroLogDrawer';
import { FloodStationData } from '../../types/weatherFlood';

const SAMPLE_STATION: FloodStationData = {
  id: 'st-01',
  code: 'STATION-SE-04',
  name: 'Lower Mekong Hydrological Basin',
  basin: 'Lower Mekong Delta',
  region: 'SE-ASIA',
  uptime: '4h 12m',
  status: 'ALERT',
  waterLevel: 3.85,
  dangerLevel: 4.2,
  evacLevel: 5.0,
  rateOfRiseCmH: 14,
  rainAccumMm: 112,
  rainRateMmH: 58,
  dischargeM3S: 1420,
  soilSaturationPct: 94,
  sluiceAperturePct: 75,
  activePumps: 3,
  maxPumps: 6,
  autoSluice: true,
  sirenArmed: false,
  overflowBufferPct: 25,
  recentAlert: {
    title: 'SPILLWAY 3 · BREACH DETECTED',
    description: 'Embankment overflow at mark 24 (+0.48m above crest)',
    subtext: '3 threshold triggers in 10 min',
    actionLabel: 'ACTIVATE EMERGENCY DRAIN',
    level: 'critical',
  },
};

export const WeatherFloodHUD: React.FC = () => {
  const [station, setStation] = useState<FloodStationData>(SAMPLE_STATION);
  const [isSweeping, setIsSweeping] = useState(true);
  const [sleepWhenIdle, setSleepWhenIdle] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('SE-ASIA');
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setBannerMessage(msg);
    setTimeout(() => setBannerMessage(null), 3500);
  };

  const handleDrainTrigger = () => {
    setStation((prev) => ({
      ...prev,
      activePumps: Math.min(prev.maxPumps, prev.activePumps + 2),
      sluiceAperturePct: 95,
      waterLevel: Math.max(2.8, prev.waterLevel - 0.4),
      overflowBufferPct: 15,
    }));
    showToast('EMERGENCY SPILLWAY ENGAGED: PUMPS SCALED TO 5 // GATE 95%');
  };

  const handleSimulateSurge = () => {
    setStation((prev) => ({
      ...prev,
      waterLevel: 4.65,
      rateOfRiseCmH: 28,
      overflowBufferPct: 78,
      rainRateMmH: 84,
      status: 'CRITICAL',
    }));
    setIsAlertDismissed(false);
    showToast('SIMULATION ACTIVATED: FLASH SURGE +84mm/h PRECIPITATION');
  };

  const handleResetBaseline = () => {
    setStation(SAMPLE_STATION);
    setIsAlertDismissed(false);
    showToast('TELEMETRY RESET TO BASELINE PROTOTYPE DATA');
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto space-y-6">
      {/* Toast Alert Banner if triggered */}
      {bannerMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#bef264] text-black font-mono text-xs font-bold px-4 py-2 border border-black shadow-[0_0_20px_rgba(190,242,100,0.6)] flex items-center gap-2 animate-bounce">
          <span>[SYSTEM NOTICE]</span>
          <span>{bannerMessage}</span>
        </div>
      )}

      {/* Top Tactical Status Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-[#090d0a]/90 border border-[#202f23] p-2.5 px-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-none bg-[#bef264] animate-pulse" />
          <span className="text-[#a4bca2] font-semibold">
            TELEMETRY NODE: <span className="text-white font-bold">{station.code}</span>
          </span>
          <span className="hidden sm:inline text-[#3a523e]">|</span>
          <span className="hidden sm:inline text-[#8aa188]">
            BASIN: <span className="text-[#d8e6d5]">{station.basin}</span>
          </span>
        </div>

        {/* Quick Simulation Trigger Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateSurge}
            className="px-2 py-1 text-[11px] font-bold border border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-black transition-colors uppercase"
          >
            [ + FLASH SURGE ]
          </button>
          <button
            onClick={handleResetBaseline}
            className="px-2 py-1 text-[11px] font-bold border border-[#2d4231] text-[#8ea68c] hover:border-[#bef264] hover:text-[#bef264] transition-colors uppercase"
          >
            [ RESET ]
          </button>
        </div>
      </div>

      {/* Main HUD Dual Card Grid (Replicating the exact side-by-side design in the reference image) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* ======================================================== */}
        {/* CARD 1 (LEFT): ROLLOUT & RADAR SCOPE & STEPPED HYDROGRAPH */}
        {/* ======================================================== */}
        <RetroContainer
          title="ROLLOUT"
          hashCount={26}
          statusText={`${station.overflowBufferPct}%`}
          statusColor={station.overflowBufferPct > 50 ? 'red' : 'amber'}
        >
          {/* Top 2x3 Metric Grid (LB, HEALTH, IMAGE, REPL, BUDGET, TIMEOUT) */}
          <RetroStatGrid
            columns={3}
            items={[
              { label: 'LB', value: '443' },
              { label: 'HEALTH', value: '/healthz' },
              { label: 'IMAGE', value: 'bun:1.3.0' },
              { label: 'REPL', value: station.activePumps },
              {
                label: 'BUDGET',
                value: `${station.overflowBufferPct / 50}%`,
                highlightColor: 'amber',
              },
              { label: 'TIMEOUT', value: '30 s' },
            ]}
          />

          {/* Radar Vector Scope with Flood Inundation & Trajectory */}
          <RetroRadarScope
            isSweeping={isSweeping}
            onSelectTarget={(target) => {
              showToast(`CONTACT ${target.code}: ${target.name} [${target.reading}]`);
            }}
          />

          {/* Stepped Hydrograph Water Stage Curve */}
          <RetroHydrograph
            currentStageMeters={station.waterLevel}
            dangerStageMeters={station.dangerLevel}
            evacStageMeters={station.evacLevel}
            rateOfRise={`+${station.rateOfRiseCmH} cm/h`}
          />
        </RetroContainer>

        {/* ======================================================== */}
        {/* CARD 2 (RIGHT): TODO-API / STATION-API TELEMETRY & CONTROLS */}
        {/* ======================================================== */}
        <RetroContainer
          title="TODO-API"
          hashCount={10}
          rightBadge={
            <span className="text-[#bef264] text-xs font-bold tracking-tight hover:underline cursor-pointer">
              api.relay.app
            </span>
          }
        >
          {/* Large Retro Barcode LIVE Badge */}
          <RetroBarcodeBadge
            statusText={station.waterLevel > 4.2 ? 'ALERT' : 'LIVE'}
            variant={station.waterLevel > 4.2 ? 'red' : 'lime'}
            sublabel="dpl_8f3a · 4h"
          />

          {/* Configuration and Stepper Rows with Crosshairs */}
          <div className="space-y-0.5 pt-1">
            <RetroPropRow
              label="REGION"
              value={
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-[#0b100d] border border-[#2b3e2f] text-white text-xs px-2 py-0.5 uppercase focus:outline-none cursor-pointer"
                >
                  <option value="SE-ASIA">SE-ASIA ▾</option>
                  <option value="MEKONG-DELTA">MEKONG-DELTA ▾</option>
                  <option value="CHAO-PHRAYA">CHAO-PHRAYA ▾</option>
                  <option value="RED-RIVER">RED-RIVER ▾</option>
                </select>
              }
            />
            <RetroDivider />

            <RetroPropRow label="IMAGE" value="bun:1.3.0" />
            <RetroDivider />

            <RetroPropRow label="PORT" value="8080" />
            <RetroDivider />

            <RetroPropRow
              label="REPLICAS"
              value={
                <RetroStepper
                  value={station.activePumps}
                  min={1}
                  max={6}
                  onChange={(val) => {
                    setStation((prev) => ({ ...prev, activePumps: val }));
                    showToast(`PUMP UNITS CALIBRATED TO: ${val} REPLICAS`);
                  }}
                />
              }
            />
          </div>

          {/* Segmented LED Multi-Row Meters (Matching the 3 rows in screenshot) */}
          <div className="space-y-2 pt-2">
            <RetroSegmentedBar
              value={station.waterLevel}
              max={5.0}
              totalSegments={24}
              color="lime"
            />
            <RetroSegmentedBar
              value={station.sluiceAperturePct}
              max={100}
              totalSegments={24}
              color="lime"
            />
            <RetroSegmentedBar
              value={station.soilSaturationPct}
              max={100}
              totalSegments={24}
              color="amber"
            />
          </div>

          {/* Toggles with Crosshair Dividers */}
          <div className="space-y-1 pt-1">
            <RetroDivider />
            <RetroToggle
              label="AUTOSCALE 2-6"
              checked={station.autoSluice}
              onChange={(checked) => {
                setStation((prev) => ({ ...prev, autoSluice: checked }));
                showToast(`AUTOSCALE SET TO: ${checked ? 'ON' : 'OFF'}`);
              }}
            />
            <RetroToggle
              label="SLEEP WHEN IDLE"
              checked={sleepWhenIdle}
              onChange={(checked) => setSleepWhenIdle(checked)}
            />
            <RetroDivider />
          </div>

          {/* Dashed Red Alert Box (REDIS · CRASHED in the screenshot) */}
          {!isAlertDismissed && station.recentAlert && (
            <RetroAlertBox
              title="REDIS · CRASHED"
              statusBadge="CRITICAL"
              lines={[
                'OOM at 256 MB',
                '3 restarts in 10 min',
              ]}
              actionLabel="RAISE TO 512 MB"
              onAction={() => {
                handleDrainTrigger();
                setIsAlertDismissed(true);
              }}
              severity="critical"
            />
          )}

          {/* Bottom Action Buttons: [ LOGS ], [ REDEPLOY ] */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <RetroButton
              variant="outline"
              onClick={() => setShowLogs(true)}
            >
              LOGS
            </RetroButton>
            <RetroButton
              variant="primary"
              onClick={() => {
                handleDrainTrigger();
                showToast('REDEPLOY DISPATCHED TO CLUSTER SE-ASIA');
              }}
            >
              REDEPLOY
            </RetroButton>
          </div>
        </RetroContainer>
      </div>

      {/* Telemetry Console Modal Drawer */}
      <RetroLogDrawer
        isOpen={showLogs}
        onClose={() => setShowLogs(false)}
        stationCode={station.code}
      />
    </div>
  );
};
