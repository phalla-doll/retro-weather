import React from 'react';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, Tooltip, YAxis } from 'recharts';

export interface SparklinePoint {
  time: string; // e.g. "T-60m", "T-45m", "NOW"
  value: number;
}

interface RetroSparklineProps {
  data: SparklinePoint[];
  color?: 'lime' | 'amber' | 'red' | 'cyan';
  height?: number;
  label?: string;
  unit?: string;
  showMinMax?: boolean;
  type?: 'line' | 'area';
  className?: string;
}

export const RetroSparkline: React.FC<RetroSparklineProps> = ({
  data,
  color = 'lime',
  height = 36,
  label,
  unit = 'm',
  showMinMax = true,
  type = 'area',
  className = '',
}) => {
  const colorMap = {
    lime: {
      stroke: '#bef264',
      fill: '#bef264',
      gradientId: 'sparkline-lime-gradient',
      text: 'text-[#bef264]',
    },
    amber: {
      stroke: '#f59e0b',
      fill: '#f59e0b',
      gradientId: 'sparkline-amber-gradient',
      text: 'text-[#f59e0b]',
    },
    red: {
      stroke: '#ef4444',
      fill: '#ef4444',
      gradientId: 'sparkline-red-gradient',
      text: 'text-[#ef4444]',
    },
    cyan: {
      stroke: '#06b6d4',
      fill: '#06b6d4',
      gradientId: 'sparkline-cyan-gradient',
      text: 'text-[#06b6d4]',
    },
  }[color];

  const values = data.map((d) => d.value);
  const minVal = values.length ? Math.min(...values) : 0;
  const maxVal = values.length ? Math.max(...values) : 0;
  const currentVal = values.length ? values[values.length - 1] : 0;
  const delta = values.length > 1 ? currentVal - values[0] : 0;

  return (
    <div className={`p-2 bg-[#060a07] border border-[#1b2b1e] font-mono select-none ${className}`}>
      {/* Sparkline Top Header */}
      <div className="flex items-center justify-between text-[9px] mb-1">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-none ${colorMap.stroke === '#ef4444' ? 'bg-[#ef4444] animate-ping' : 'bg-[#bef264]'}`} />
          <span className="font-bold text-[#8ba288] uppercase tracking-wider">
            {label || '1-HOUR HISTORICAL SPARKLINE'}
          </span>
        </div>
        <div className="flex items-center gap-2 tabular-nums">
          <span className="text-[#657d63]">
            Δ60m: <span className={delta >= 0 ? 'text-[#bef264]' : 'text-[#f59e0b]'}>{delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)}{unit}</span>
          </span>
          <span className={`font-black text-[10px] ${colorMap.text}`}>
            {currentVal.toFixed(2)} {unit}
          </span>
        </div>
      </div>

      {/* Sparkline Recharts Container */}
      <div style={{ width: '100%', height: `${height}px` }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
              <defs>
                <linearGradient id={colorMap.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colorMap.fill} stopOpacity={0.4} />
                  <stop offset="85%" stopColor={colorMap.fill} stopOpacity={0.03} />
                  <stop offset="100%" stopColor={colorMap.fill} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as SparklinePoint;
                    return (
                      <div className="bg-[#090d0a] border border-[#2d4231] px-1.5 py-0.5 text-[8.5px] text-white shadow-lg font-mono">
                        <span className="text-[#8ba288]">{item.time}: </span>
                        <span className="font-bold text-[#bef264]">{item.value.toFixed(2)} {unit}</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={colorMap.stroke}
                strokeWidth={1.5}
                fill={`url(#${colorMap.gradientId})`}
                isAnimationActive={false}
                dot={false}
                activeDot={{
                  r: 3,
                  fill: colorMap.stroke,
                  stroke: '#080b09',
                  strokeWidth: 1.5,
                }}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as SparklinePoint;
                    return (
                      <div className="bg-[#090d0a] border border-[#2d4231] px-1.5 py-0.5 text-[8.5px] text-white shadow-lg font-mono">
                        <span className="text-[#8ba288]">{item.time}: </span>
                        <span className="font-bold text-[#bef264]">{item.value.toFixed(2)} {unit}</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={colorMap.stroke}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
                activeDot={{
                  r: 3,
                  fill: colorMap.stroke,
                  stroke: '#080b09',
                  strokeWidth: 1.5,
                }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Bottom Range Indicators */}
      {showMinMax && (
        <div className="flex items-center justify-between text-[8px] text-[#5c735a] mt-0.5 pt-0.5 border-t border-[#131e15] tabular-nums">
          <span>MIN: {minVal.toFixed(2)}{unit}</span>
          <span>1-HR ROLLING SAMPLES (12 PTS)</span>
          <span>MAX: {maxVal.toFixed(2)}{unit}</span>
        </div>
      )}
    </div>
  );
};
