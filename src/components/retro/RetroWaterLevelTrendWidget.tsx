import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';

export interface WaterLevelHistoryPoint {
  time: string; // e.g. "04:00"
  hourOffset: number; // e.g. -24 to 0
  waterLevel: number; // in meters, e.g. 2.1 to 4.8
  dangerThreshold: number; // 4.2
  evacThreshold: number; // 5.0
  rainRate: number; // mm/h
  discharge: number; // m³/s
}

// 24-hour historical telemetry data with realistic storm hydrograph curve
export const GENERATE_24H_DATA = (): WaterLevelHistoryPoint[] => {
  const points: WaterLevelHistoryPoint[] = [
    { time: '-24h', hourOffset: -24, waterLevel: 1.85, dangerThreshold: 4.2, evacThreshold: 5.0, rainRate: 0, discharge: 420 },
    { time: '-22h', hourOffset: -22, waterLevel: 1.90, dangerThreshold: 4.2, evacThreshold: 5.0, rainRate: 2, discharge: 440 },
    { time: '-20h', hourOffset: -20, waterLevel: 1.95, dangerThreshold: 4.2, evacThreshold: 5.0, rainRate: 5, discharge: 480 },
    { time: '-18h', hourOffset: -18, waterLevel: 2.10, dangerThreshold: 4.2, evacThreshold: 5.0, rainRate: 14, discharge: 560 },
    { time: '-16h', hourOffset: -16, waterLevel: 2.35, dangerThreshold: 4.2, evacThreshold: 5.0, rainRate: 28, discharge: 690 },
    { time: '-14h', hourOffset: -14, waterLevel: 2.65, dangerThreshold: 4.2, evacThreshold: 5.0, rainRate: 45, discharge: 840 },
    { time: '-12h', hourOffset: -12, waterLevel: 2.95, dangerThreshold: 4.2, evacThreshold: 5.0, rainRate: 62, discharge: 990 },
    { time: '-10h', hourOffset: -10, waterLevel: 3.25, dangerThreshold: 4.2, evacThreshold: 5.0, rainRate: 78, discharge: 1150 },
    { time: '-8h', hourOffset: -8, waterLevel: 3.50, dangerThreshold: 4.2, evacThreshold: 5.0, rainRate: 65, discharge: 1280 },
    { time: '-6h', hourOffset: -6, waterLevel: 3.70, dangerThreshold: 4.2, evacThreshold: 5.0, rainRate: 52, discharge: 1360 },
    { time: '-4h', hourOffset: -4, waterLevel: 3.82, dangerThreshold: 4.2, evacThreshold: 5.0, rainRate: 40, discharge: 1410 },
    { time: '-2h', hourOffset: -2, waterLevel: 3.88, dangerThreshold: 4.2, evacThreshold: 5.0, rainRate: 35, discharge: 1430 },
    { time: 'NOW', hourOffset: 0, waterLevel: 3.85, dangerThreshold: 4.2, evacThreshold: 5.0, rainRate: 28, discharge: 1420 },
  ];
  return points;
};

interface RetroWaterLevelTrendWidgetProps {
  currentStage?: number;
  dangerLevel?: number;
  evacLevel?: number;
  className?: string;
  onInspectPoint?: (point: WaterLevelHistoryPoint) => void;
}

export const RetroWaterLevelTrendWidget: React.FC<RetroWaterLevelTrendWidgetProps> = ({
  currentStage = 3.85,
  dangerLevel = 4.2,
  evacLevel = 5.0,
  className = '',
  onInspectPoint,
}) => {
  const [data, setData] = useState<WaterLevelHistoryPoint[]>(GENERATE_24H_DATA);
  const [activeMetric, setActiveMetric] = useState<'waterLevel' | 'rainRate' | 'discharge'>('waterLevel');
  const [showThresholds, setShowThresholds] = useState(true);

  // Synchronize latest point with parent currentStage
  React.useEffect(() => {
    setData((prev) => {
      const updated = [...prev];
      const lastIdx = updated.length - 1;
      updated[lastIdx] = {
        ...updated[lastIdx],
        waterLevel: currentStage,
      };
      return updated;
    });
  }, [currentStage]);

  // Calculate stats
  const minVal = Math.min(...data.map((d) => d[activeMetric]));
  const maxVal = Math.max(...data.map((d) => d[activeMetric]));
  const peakPoint = data.reduce((prev, curr) =>
    curr[activeMetric] > prev[activeMetric] ? curr : prev
  );

  return (
    <div
      className={`relative bg-[#070b08] border border-[#233526] p-3.5 font-mono select-none overflow-hidden ${className}`}
    >
      {/* 4 Corner Crosshairs */}
      <div className="absolute top-0 left-0 text-[#3d5940] text-[9px] font-bold p-1 leading-none pointer-events-none">
        +
      </div>
      <div className="absolute top-0 right-0 text-[#3d5940] text-[9px] font-bold p-1 leading-none pointer-events-none">
        +
      </div>
      <div className="absolute bottom-0 left-0 text-[#3d5940] text-[9px] font-bold p-1 leading-none pointer-events-none">
        +
      </div>
      <div className="absolute bottom-0 right-0 text-[#3d5940] text-[9px] font-bold p-1 leading-none pointer-events-none">
        +
      </div>

      {/* Widget Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1b2b1e] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#bef264] rounded-none shadow-[0_0_6px_#bef264] animate-pulse" />
          <span className="text-xs font-black tracking-wider text-white uppercase">
            24H HYDROGRAPH // TELEMETRY TRENDS
          </span>
        </div>

        {/* Metric Switcher & Toggle buttons */}
        <div className="flex items-center gap-1.5 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveMetric('waterLevel')}
            className={`px-2 py-0.5 border cursor-pointer uppercase font-bold transition-colors ${
              activeMetric === 'waterLevel'
                ? 'bg-[#bef264] text-black border-[#bef264]'
                : 'border-[#2d4231] text-[#8ea68c] hover:text-white hover:bg-[#121c14]'
            }`}
          >
            STAGE (M)
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('rainRate')}
            className={`px-2 py-0.5 border cursor-pointer uppercase font-bold transition-colors ${
              activeMetric === 'rainRate'
                ? 'bg-[#06b6d4] text-black border-[#06b6d4]'
                : 'border-[#2d4231] text-[#8ea68c] hover:text-white hover:bg-[#121c14]'
            }`}
          >
            RAIN (MM/H)
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('discharge')}
            className={`px-2 py-0.5 border cursor-pointer uppercase font-bold transition-colors ${
              activeMetric === 'discharge'
                ? 'bg-[#f59e0b] text-black border-[#f59e0b]'
                : 'border-[#2d4231] text-[#8ea68c] hover:text-white hover:bg-[#121c14]'
            }`}
          >
            FLOW (M³/S)
          </button>
          <button
            type="button"
            onClick={() => setShowThresholds(!showThresholds)}
            className={`px-2 py-0.5 border border-[#2d4231] cursor-pointer text-[#8ea68c] hover:text-white ${
              showThresholds ? 'text-[#bef264] border-[#bef264]/60' : 'opacity-40'
            }`}
          >
            [ LIMITS: {showThresholds ? 'ON' : 'OFF'} ]
          </button>
        </div>
      </div>

      {/* Retro Stat Indicators Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 bg-[#0a0f0b] border border-[#1b2b1e] p-2 text-xs">
        <div>
          <span className="text-[10px] text-[#638066] uppercase block">CURRENT VALUE</span>
          <span className="text-[#bef264] font-black text-sm tracking-tight">
            {activeMetric === 'waterLevel' && `${currentStage.toFixed(2)} m`}
            {activeMetric === 'rainRate' && `${data[data.length - 1].rainRate} mm/h`}
            {activeMetric === 'discharge' && `${data[data.length - 1].discharge} m³/s`}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#638066] uppercase block">24H PEAK</span>
          <span className="text-[#f59e0b] font-black text-sm tracking-tight">
            {activeMetric === 'waterLevel' && `${maxVal.toFixed(2)} m`}
            {activeMetric === 'rainRate' && `${maxVal} mm/h`}
            {activeMetric === 'discharge' && `${maxVal} m³/s`}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#638066] uppercase block">PEAK TIME</span>
          <span className="text-white font-bold text-sm tracking-tight">
            {peakPoint.time}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#638066] uppercase block">24H DELTA</span>
          <span className="text-[#bef264] font-black text-sm tracking-tight">
            +{activeMetric === 'waterLevel' ? (currentStage - data[0].waterLevel).toFixed(2) : maxVal - minVal}{' '}
            {activeMetric === 'waterLevel' ? 'm' : ''}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-56 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload.length > 0) {
                const payload = state.activePayload[0].payload as WaterLevelHistoryPoint;
                onInspectPoint?.(payload);
              }
            }}
          >
            <defs>
              {/* Phosphor Green Gradient matching CRT terminal */}
              <linearGradient id="retroGreenArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#bef264" stopOpacity={0.45} />
                <stop offset="60%" stopColor="#bef264" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#070b08" stopOpacity={0} />
              </linearGradient>

              {/* Cyan Gradient for Rain */}
              <linearGradient id="retroCyanArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                <stop offset="60%" stopColor="#06b6d4" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#070b08" stopOpacity={0} />
              </linearGradient>

              {/* Amber Gradient for Discharge */}
              <linearGradient id="retroAmberArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.45} />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#070b08" stopOpacity={0} />
              </linearGradient>

              {/* Grid Dotted Pattern */}
              <pattern id="chartDottedGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.75" fill="#1b2a1e" />
              </pattern>
            </defs>

            {/* Dotted Grid Pattern Background */}
            <rect x="0" y="0" width="100%" height="100%" fill="url(#chartDottedGrid)" />

            <CartesianGrid
              stroke="#1a281c"
              strokeDasharray="3 3"
              vertical={true}
              horizontal={true}
            />

            <XAxis
              dataKey="time"
              stroke="#4d6950"
              fontSize={10}
              tickLine={{ stroke: '#2e4532' }}
              axisLine={{ stroke: '#2e4532' }}
              tick={{ fill: '#738f75', fontFamily: 'monospace' }}
            />

            <YAxis
              stroke="#4d6950"
              fontSize={10}
              domain={
                activeMetric === 'waterLevel'
                  ? [1.0, 5.5]
                  : activeMetric === 'rainRate'
                  ? [0, 100]
                  : [0, 1800]
              }
              tickLine={{ stroke: '#2e4532' }}
              axisLine={{ stroke: '#2e4532' }}
              tick={{ fill: '#738f75', fontFamily: 'monospace' }}
            />

            {/* Retro Terminal Custom Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as WaterLevelHistoryPoint;
                  return (
                    <div className="bg-[#090d0a] border border-[#bef264] p-2 text-xs font-mono shadow-[0_0_15px_rgba(0,0,0,0.9)]">
                      <div className="text-[10px] text-[#869984] border-b border-[#233526] pb-1 mb-1.5 flex items-center justify-between gap-4">
                        <span>TIMESTEP: {pt.time}</span>
                        <span className="text-[#bef264]">T{pt.hourOffset}h</span>
                      </div>
                      <div className="space-y-0.5 text-[11px]">
                        <div className="text-white flex justify-between gap-4">
                          <span className="text-[#869984]">WATER STAGE:</span>
                          <span className="text-[#bef264] font-bold">{pt.waterLevel.toFixed(2)} m</span>
                        </div>
                        <div className="text-white flex justify-between gap-4">
                          <span className="text-[#869984]">RAIN RATE:</span>
                          <span className="text-[#06b6d4] font-bold">{pt.rainRate} mm/h</span>
                        </div>
                        <div className="text-white flex justify-between gap-4">
                          <span className="text-[#869984]">DISCHARGE:</span>
                          <span className="text-[#f59e0b] font-bold">{pt.discharge} m³/s</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Threshold Danger and Evacuation Reference Lines */}
            {showThresholds && activeMetric === 'waterLevel' && (
              <>
                <ReferenceLine
                  y={evacLevel}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `EVAC CREST [${evacLevel}m]`,
                    fill: '#ef4444',
                    fontSize: 9,
                    fontFamily: 'monospace',
                    position: 'insideTopRight',
                  }}
                />
                <ReferenceLine
                  y={dangerLevel}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={1.2}
                  label={{
                    value: `ALERT DANGER [${dangerLevel}m]`,
                    fill: '#f59e0b',
                    fontSize: 9,
                    fontFamily: 'monospace',
                    position: 'insideBottomRight',
                  }}
                />
              </>
            )}

            {/* Primary Green Phosphor Area / Line Chart */}
            {activeMetric === 'waterLevel' && (
              <Area
                type="monotone"
                dataKey="waterLevel"
                stroke="#bef264"
                strokeWidth={2.4}
                fill="url(#retroGreenArea)"
                dot={{
                  r: 3,
                  fill: '#070b08',
                  stroke: '#bef264',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 5,
                  fill: '#bef264',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
              />
            )}

            {/* Rain Area */}
            {activeMetric === 'rainRate' && (
              <Area
                type="monotone"
                dataKey="rainRate"
                stroke="#06b6d4"
                strokeWidth={2.4}
                fill="url(#retroCyanArea)"
                dot={{
                  r: 3,
                  fill: '#070b08',
                  stroke: '#06b6d4',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 5,
                  fill: '#06b6d4',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
              />
            )}

            {/* Discharge Area */}
            {activeMetric === 'discharge' && (
              <Area
                type="monotone"
                dataKey="discharge"
                stroke="#f59e0b"
                strokeWidth={2.4}
                fill="url(#retroAmberArea)"
                dot={{
                  r: 3,
                  fill: '#070b08',
                  stroke: '#f59e0b',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 5,
                  fill: '#f59e0b',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Widget Footer Telemetry Annotation */}
      <div className="mt-2.5 pt-2 border-t border-[#1b2b1e] flex flex-wrap items-center justify-between text-[10px] text-[#718a73]">
        <div className="flex items-center gap-3">
          <span className="text-[#a4bda2]">STATION: MEKONG-04</span>
          <span>·</span>
          <span>SAMPLE INTERVAL: 120 MIN</span>
          <span>·</span>
          <span className="text-[#bef264] font-semibold">SENSOR FIDELITY: 99.8%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#f59e0b] font-bold">STATUS: MONITORED</span>
          <span>[CLICK ANY POINT TO INSPECT]</span>
        </div>
      </div>
    </div>
  );
};
