import React from 'react';

interface MetricBannerItem {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'warning' | 'neutral';
  status?: string;
}

interface RetroTelemetryTopTickerProps {
  waterStage?: number;
  rainRate?: number;
  discharge?: number;
  pumps?: number;
  saturation?: number;
}

export const RetroTelemetryTopTicker: React.FC<RetroTelemetryTopTickerProps> = ({
  waterStage = 3.85,
  rainRate = 58,
  discharge = 1420,
  pumps = 3,
  saturation = 94.2,
}) => {
  const metrics: MetricBannerItem[] = [
    {
      label: 'BASIN WATER STAGE',
      value: `${waterStage.toFixed(2)}m`,
      change: '+0.14m/h',
      changeType: waterStage > 4.2 ? 'warning' : 'neutral',
      status: waterStage > 4.2 ? 'ALERT' : 'RISING',
    },
    {
      label: 'PRECIP INTENSITY',
      value: `${rainRate} mm/h`,
      change: 'CELL A1106',
      changeType: rainRate > 50 ? 'warning' : 'neutral',
      status: rainRate > 50 ? 'TORRENTIAL' : 'MODERATE',
    },
    {
      label: 'SATURATION INDEX',
      value: `${saturation.toFixed(1)}%`,
      change: '+1.8%/h',
      changeType: saturation > 90 ? 'warning' : 'neutral',
      status: saturation > 90 ? 'NEAR-LIMIT' : 'SATURATED',
    },
    {
      label: 'RIVER DISCHARGE',
      value: `${discharge.toLocaleString()} m³/s`,
      change: '82% OF CREST',
      changeType: discharge > 1400 ? 'warning' : 'neutral',
      status: discharge > 1400 ? 'CRITICAL' : 'FLOWING',
    },
    {
      label: 'SPILLWAY GATES',
      value: '3 / 4 OPEN',
      change: 'APERTURE 75%',
      changeType: 'neutral',
      status: 'ACTIVE',
    },
    {
      label: 'DRAINAGE PUMPS',
      value: `${pumps} ONLINE`,
      change: `DISCHARGE ${pumps * 125}m³/s`,
      changeType: 'neutral',
      status: `REPL:${pumps}`,
    },
    {
      label: 'NETWORK LATENCY',
      value: '12ms',
      change: 'PACKETS 100%',
      changeType: 'positive',
      status: 'SYNCED',
    },
  ];

  return (
    <div className="w-full bg-[#070b08] border border-[#1e2f21] overflow-hidden select-none font-mono">
      {/* Hairline Grid Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 divide-x divide-y lg:divide-y-0 divide-[#1b2b1e]">
        {metrics.map((m, i) => (
          <div key={i} className="p-2 px-3 flex flex-col justify-between hover:bg-[#0c140e] transition-colors">
            <div className="flex items-center justify-between text-[9px] text-[#6b826a] uppercase">
              <span>{m.label}</span>
              <span
                className={`font-bold ${
                  m.changeType === 'warning'
                    ? 'text-[#f59e0b]'
                    : m.changeType === 'positive'
                    ? 'text-[#bef264]'
                    : 'text-[#8ea68c]'
                }`}
              >
                {m.status}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-sm font-black text-white tracking-tight">{m.value}</span>
              {m.change && (
                <span className="text-[9px] text-[#789177] font-semibold tabular-nums">
                  {m.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
