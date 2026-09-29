import React from 'react';

interface MetricBannerItem {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'warning' | 'neutral';
  status?: string;
}

const METRICS: MetricBannerItem[] = [
  { label: 'BASIN WATER STAGE', value: '3.85m', change: '+0.14m/h', changeType: 'warning', status: 'RISING' },
  { label: 'PRECIP INTENSITY', value: '58 mm/h', change: 'CELL A1106', changeType: 'warning', status: 'TORRENTIAL' },
  { label: 'SATURATION INDEX', value: '94.2%', change: '+1.8%/h', changeType: 'warning', status: 'NEAR-LIMIT' },
  { label: 'RIVER DISCHARGE', value: '1,420 m³/s', change: '82% OF CREST', changeType: 'neutral', status: 'CRITICAL' },
  { label: 'SPILLWAY GATES', value: '3 / 4 OPEN', change: 'APERTURE 75%', changeType: 'neutral', status: 'ACTIVE' },
  { label: 'DRAINAGE PUMPS', value: '3 ONLINE', change: 'DISCHARGE 380m³/s', changeType: 'neutral', status: 'REPL:3' },
  { label: 'NETWORK LATENCY', value: '12ms', change: 'PACKETS 100%', changeType: 'positive', status: 'SYNCED' },
];

export const RetroTelemetryTopTicker: React.FC = () => {
  return (
    <div className="w-full bg-[#070b08] border border-[#1e2f21] overflow-hidden select-none font-mono">
      {/* Hairline Grid Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 divide-x divide-y lg:divide-y-0 divide-[#1b2b1e]">
        {METRICS.map((m, i) => (
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
