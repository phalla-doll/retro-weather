import React, { useState } from 'react';
import { RetroContainer } from './RetroContainer';
import { RetroSegmentedBar } from './RetroSegmentedBar';
import { RetroDivider } from './RetroControls';

interface BasinStation {
  id: string;
  code: string;
  name: string;
  stageMeters: number;
  dangerMeters: number;
  status: 'NOMINAL' | 'ALERT' | 'CRITICAL';
  trend: string;
  discharge: number;
  sensorsOnline: number;
}

const BASIN_STATIONS: BasinStation[] = [
  { id: '1', code: 'STA-N01', name: 'Chiang Saen Gorge', stageMeters: 4.12, dangerMeters: 4.80, status: 'NOMINAL', trend: '+4 cm/h', discharge: 1120, sensorsOnline: 8 },
  { id: '2', code: 'STA-C04', name: 'Vientiane Flood Basin', stageMeters: 4.68, dangerMeters: 4.50, status: 'ALERT', trend: '+14 cm/h', discharge: 1420, sensorsOnline: 12 },
  { id: '3', code: 'STA-M09', name: 'Mukdahan Sluice #2', stageMeters: 3.20, dangerMeters: 4.00, status: 'NOMINAL', trend: '-2 cm/h', discharge: 980, sensorsOnline: 6 },
  { id: '4', code: 'STA-P12', name: 'Pakse Embankment Gate', stageMeters: 5.15, dangerMeters: 4.90, status: 'CRITICAL', trend: '+22 cm/h', discharge: 1890, sensorsOnline: 10 },
  { id: '5', code: 'STA-D18', name: 'Delta Estuary Surge Barrier', stageMeters: 2.10, dangerMeters: 3.50, status: 'NOMINAL', trend: '+1 cm/h', discharge: 750, sensorsOnline: 7 },
];

export const RetroBasinNetworkPanel: React.FC<{
  onSelectStation?: (station: BasinStation) => void;
  activeStationCode?: string;
}> = ({ onSelectStation, activeStationCode = 'STA-C04' }) => {
  const [filter, setFilter] = useState<'ALL' | 'ALERT_ONLY'>('ALL');

  const filtered = filter === 'ALL'
    ? BASIN_STATIONS
    : BASIN_STATIONS.filter((s) => s.status !== 'NOMINAL');

  return (
    <RetroContainer
      title="BASIN-NETWORK"
      hashCount={14}
      statusText="5 GAUGES ACTIVE"
      statusColor="lime"
      className="h-full flex flex-col justify-between"
    >
      {/* Top Filter Buttons */}
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-[#788e76] uppercase tracking-wider font-semibold">
          RIVER CORRIDOR NODES
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-1.5 py-0.5 text-[10px] font-bold border ${
              filter === 'ALL'
                ? 'bg-[#bef264] text-black border-[#bef264]'
                : 'border-[#243727] text-[#869984] hover:text-white'
            }`}
          >
            [ ALL ]
          </button>
          <button
            onClick={() => setFilter('ALERT_ONLY')}
            className={`px-1.5 py-0.5 text-[10px] font-bold border ${
              filter === 'ALERT_ONLY'
                ? 'bg-[#ef4444] text-white border-[#ef4444]'
                : 'border-[#243727] text-[#869984] hover:text-white'
            }`}
          >
            [ ALERTS ]
          </button>
        </div>
      </div>

      {/* Stations List */}
      <div className="space-y-2.5">
        {filtered.map((st) => {
          const isSelected = st.code === activeStationCode;
          const isCritical = st.status === 'CRITICAL';
          const isAlert = st.status === 'ALERT';

          return (
            <div
              key={st.id}
              onClick={() => onSelectStation?.(st)}
              className={`p-2.5 border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#bef264] bg-[#111912]'
                  : 'border-[#1b2b1e] bg-[#070b08] hover:border-[#3d5940] hover:bg-[#0c120e]'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-none ${
                      isCritical
                        ? 'bg-[#ef4444] animate-ping'
                        : isAlert
                        ? 'bg-[#f59e0b]'
                        : 'bg-[#bef264]'
                    }`}
                  />
                  <span className="font-bold text-white tracking-wider">{st.code}</span>
                  <span className="text-[10px] text-[#839b81] truncate max-w-[130px]">
                    {st.name}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-1 py-0.5 ${
                    isCritical
                      ? 'bg-[#ef4444] text-white'
                      : isAlert
                      ? 'bg-[#f59e0b] text-black'
                      : 'bg-[#1a281c] text-[#bef264]'
                  }`}
                >
                  {st.status}
                </span>
              </div>

              {/* Water Stage Gauge */}
              <div className="space-y-1 mt-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-[#6d846b]">STAGE / CREST:</span>
                  <span className="font-bold text-white">
                    {st.stageMeters.toFixed(2)}m / {st.dangerMeters.toFixed(2)}m
                  </span>
                </div>
                <RetroSegmentedBar
                  value={st.stageMeters}
                  max={st.dangerMeters * 1.15}
                  totalSegments={18}
                  color={isCritical ? 'red' : isAlert ? 'amber' : 'lime'}
                />
              </div>

              {/* Bottom Sub-stats */}
              <div className="flex items-center justify-between text-[9px] text-[#6d846b] mt-1 pt-1 border-t border-[#162218]">
                <span>FLOW: {st.discharge} m³/s</span>
                <span className={isCritical || isAlert ? 'text-[#f59e0b] font-bold' : ''}>
                  TREND: {st.trend}
                </span>
                <span>SIG: 100%</span>
              </div>
            </div>
          );
        })}
      </div>

      <RetroDivider className="my-2" />

      {/* Aggregate Basin Status Bar */}
      <div className="p-2 bg-[#060a07] border border-[#1b2b1e] text-[10px] space-y-1">
        <div className="flex justify-between text-[#8ba288]">
          <span>AGGREGATE CATCHMENT DISCHARGE:</span>
          <span className="text-[#bef264] font-bold">6,160 m³/s</span>
        </div>
        <div className="flex justify-between text-[#8ba288]">
          <span>CORRIDOR FLOOD PROBABILITY:</span>
          <span className="text-[#f59e0b] font-bold">74% HIGH</span>
        </div>
      </div>
    </RetroContainer>
  );
};
