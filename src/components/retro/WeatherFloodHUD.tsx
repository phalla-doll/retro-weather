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
import { RetroWaterLevelTrendWidget } from './RetroWaterLevelTrendWidget';
import { RetroBasinNetworkPanel } from './RetroBasinNetworkPanel';
import { RetroEmergencyControlPanel } from './RetroEmergencyControlPanel';
import { RetroTelemetryTopTicker } from './RetroTelemetryTopTicker';
import { RetroRefreshButton } from './RetroRefreshButton';
import { RetroSparkline, SparklinePoint } from './RetroSparkline';
import { FloodStationData } from '../../types/weatherFlood';

// Generate 1-hour rolling 5-minute telemetry intervals (12 points)
const GENERATE_1H_SPARKLINE_DATA = (currentWater: number): SparklinePoint[] => {
  const points: number[] = [
    currentWater - 0.28,
    currentWater - 0.25,
    currentWater - 0.22,
    currentWater - 0.20,
    currentWater - 0.17,
    currentWater - 0.14,
    currentWater - 0.12,
    currentWater - 0.09,
    currentWater - 0.06,
    currentWater - 0.04,
    currentWater - 0.02,
    currentWater,
  ];

  return points.map((val, idx) => {
    const minAgo = (11 - idx) * 5;
    const label = minAgo === 0 ? 'NOW' : `T-${minAgo}m`;
    return {
      time: label,
      value: Math.max(0.5, Number(val.toFixed(2))),
    };
  });
};

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showToast = (msg: string) => {
    setBannerMessage(msg);
    setTimeout(() => setBannerMessage(null), 3500);
  };

  const handleForceRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    showToast('COMMENCING HIGH-FREQ TELEMETRY POLLING OVER 5 BASIN NODES...');

    // Simulate realistic asynchronous terminal roundtrip latency
    setTimeout(() => {
      // Apply slight authentic jitter to live telemetry values
      setStation((prev) => {
        const delta = (Math.random() - 0.45) * 0.12;
        const newWater = Math.max(1.8, Math.min(5.4, prev.waterLevel + delta));
        const newRain = Math.max(0, Math.round(prev.rainRateMmH + (Math.random() - 0.5) * 8));
        const newDischarge = Math.round(newWater * 365 + 10);
        return {
          ...prev,
          waterLevel: Number(newWater.toFixed(2)),
          rainRateMmH: newRain,
          dischargeM3S: newDischarge,
          soilSaturationPct: Math.min(100, Math.round(prev.soilSaturationPct + (Math.random() - 0.3) * 1.5)),
        };
      });
      setIsRefreshing(false);
      showToast('TELEMETRY INGEST COMPLETED // 12 SENSORS RE-CALIBRATED (LATENCY: 8ms)');
    }, 1200);
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
    showToast('TELEMETRY RESTORED TO NOMINAL HISTORICAL BASELINE');
  };

  return (
    <div className="relative w-full space-y-3 font-mono">
      {/* Toast Alert Banner if triggered */}
      {bannerMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#bef264] text-black font-mono text-xs font-bold px-4 py-2 border border-black shadow-[0_0_20px_rgba(190,242,100,0.6)] flex items-center gap-2 animate-bounce">
          <span>[SYSTEM NOTICE]</span>
          <span>{bannerMessage}</span>
        </div>
      )}

      {/* Full-width Top Telemetry Metrics Ticker Strip */}
      <RetroTelemetryTopTicker
        waterStage={station.waterLevel}
        rainRate={station.rainRateMmH}
        discharge={station.dischargeM3S}
        pumps={station.activePumps}
        saturation={station.soilSaturationPct}
      />

      {/* Top Tactical Status Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#090d0a]/95 border border-[#202f23] p-2 px-3">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-none bg-[#bef264] animate-pulse" />
          <span className="text-[#a4bca2] font-semibold">
            TELEMETRY NODE: <span className="text-white font-bold">{station.code}</span>
          </span>
          <span className="hidden sm:inline text-[#3a523e]">|</span>
          <span className="hidden sm:inline text-[#8aa188]">
            BASIN: <span className="text-[#d8e6d5]">{station.basin}</span>
          </span>
          <span className="hidden md:inline text-[#3a523e]">|</span>
          <span className="hidden md:inline text-[#8aa188]">
            UPTIME: <span className="text-[#bef264]">{station.uptime}</span>
          </span>
        </div>

        {/* Quick Simulation Trigger Buttons & Force Refresh */}
        <div className="flex items-center gap-2">
          {/* Manual Force Refresh button with animated spinner */}
          <RetroRefreshButton
            onRefresh={handleForceRefresh}
            isRefreshing={isRefreshing}
          />

          <button
            onClick={handleSimulateSurge}
            className="px-2.5 py-1 text-[11px] font-bold border border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-black transition-colors uppercase cursor-pointer"
          >
            [ + FLASH SURGE ]
          </button>
          <button
            onClick={handleResetBaseline}
            className="px-2.5 py-1 text-[11px] font-bold border border-[#2d4231] text-[#8ea68c] hover:border-[#bef264] hover:text-[#bef264] transition-colors uppercase cursor-pointer"
          >
            [ RESET ]
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FULL-WIDTH RESPONSIVE 4-COLUMN TACTICAL HUD GRID */}
      {/* Left: Basin Network | Center 1: Rollout/Radar | Center 2: API Controls | Right: Actuators */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-stretch w-full">
        {/* ======================================================== */}
        {/* COLUMN 1: BASIN TELEMETRY NETWORK GAUGES */}
        {/* ======================================================== */}
        <div className="flex flex-col">
          <RetroBasinNetworkPanel
            activeStationCode={station.code === 'STATION-SE-04' ? 'STA-C04' : station.code}
            onSelectStation={(selected) => {
              setStation((prev) => ({
                ...prev,
                code: selected.code,
                name: selected.name,
                waterLevel: selected.stageMeters,
                dangerLevel: selected.dangerMeters,
                status: selected.status,
              }));
              showToast(`SWITCHED TELEMETRY FOCUS: ${selected.code} [${selected.name}]`);
            }}
          />
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2 (CENTER-LEFT): ROLLOUT & RADAR SCOPE & STEPPED HYDROGRAPH */}
        {/* ======================================================== */}
        <div className="flex flex-col">
          <RetroContainer
            title="ROLLOUT"
            hashCount={20}
            statusText={`${station.overflowBufferPct}%`}
            statusColor={station.overflowBufferPct > 50 ? 'red' : 'amber'}
            className="h-full flex flex-col justify-between"
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
                  value: `${(station.overflowBufferPct / 50).toFixed(1)}%`,
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
        </div>

        {/* ======================================================== */}
        {/* COLUMN 3 (CENTER-RIGHT): TODO-API / STATION-API TELEMETRY & CONTROLS */}
        {/* ======================================================== */}
        <div className="flex flex-col">
          <RetroContainer
            title="TODO-API"
            hashCount={10}
            className="h-full flex flex-col justify-between"
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
            <div className="space-y-1.5 pt-1">
              <RetroSegmentedBar
                value={station.waterLevel}
                max={5.0}
                totalSegments={22}
                color="lime"
              />
              <RetroSegmentedBar
                value={station.sluiceAperturePct}
                max={100}
                totalSegments={22}
                color="lime"
              />
              <RetroSegmentedBar
                value={station.soilSaturationPct}
                max={100}
                totalSegments={22}
                color="amber"
              />
            </div>

            {/* Live 1-Hour River Depth Historical Sparkline (Recharts) */}
            <RetroSparkline
              label="RIVER STAGE 1-HR TREND"
              data={GENERATE_1H_SPARKLINE_DATA(station.waterLevel)}
              unit="m"
              height={38}
              color={station.waterLevel > 4.2 ? 'red' : station.waterLevel > 3.5 ? 'amber' : 'lime'}
            />

            {/* Toggles with Crosshair Dividers */}
            <div className="space-y-0.5 pt-1">
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
            <div className="grid grid-cols-2 gap-2 pt-1">
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

        {/* ======================================================== */}
        {/* COLUMN 4: EMERGENCY ACTUATOR INTERLOCKS & EVAC DISPATCH */}
        {/* ======================================================== */}
        <div className="flex flex-col">
          <RetroEmergencyControlPanel
            onTriggerSiren={() => {
              showToast('ACOUSTIC SIREN NET ENGAGED ACROSS SECTOR 1-6');
            }}
            onDeployFloodWalls={() => {
              showToast('PNEUMATIC FLOOD WALLS ELEVATED +2.4M');
            }}
            onEvacuationBroadcast={() => {
              showToast('EMERGENCY CELL-BROADCAST DISPATCHED TO 184K SUBSCRIBERS');
            }}
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 24-HOUR RETRO LINE GRAPH (FULL-WIDTH EVILCHARTS CRT STYLE) */}
      {/* ======================================================== */}
      <div className="w-full">
        <RetroWaterLevelTrendWidget
          currentStage={station.waterLevel}
          dangerLevel={station.dangerLevel}
          evacLevel={station.evacLevel}
          onRefresh={handleForceRefresh}
          isRefreshing={isRefreshing}
          onInspectPoint={(point) => {
            showToast(`POINT ${point.time}: WATER ${point.waterLevel.toFixed(2)}m · RAIN ${point.rainRate}mm/h · FLOW ${point.discharge}m³/s`);
          }}
        />
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
