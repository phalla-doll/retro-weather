import React, { useState } from 'react';

interface RetroHydrographProps {
  currentStageMeters?: number;
  dangerStageMeters?: number;
  evacStageMeters?: number;
  rateOfRise?: string;
  className?: string;
}

export const RetroHydrograph: React.FC<RetroHydrographProps> = ({
  currentStageMeters = 3.85,
  dangerStageMeters = 4.2,
  evacStageMeters = 5.0,
  rateOfRise = '+12 cm/h',
  className = '',
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Time series steps matching the geometric aesthetic of the reference
  const stepPoints = [
    { x: 30, y: 110, time: '30m ago', stage: '2.40m', label: 'NORMAL' },
    { x: 65, y: 110, time: '25m ago', stage: '2.50m', label: 'NORMAL' },
    { x: 100, y: 92, time: '20m ago', stage: '3.10m', label: 'D5%' },
    { x: 140, y: 92, time: '15m ago', stage: '3.15m', label: 'RISING' },
    { x: 175, y: 55, time: '10m ago', stage: '3.85m', label: 'D25% PEAK' },
    { x: 215, y: 55, time: '5m ago', stage: '3.90m', label: 'CRESTING' },
    { x: 250, y: 30, time: 'NOW (ETA)', stage: '4.85m', label: '100% MAX' },
    { x: 285, y: 30, time: '+15m', stage: '4.85m', label: 'SPILLWAY' },
  ];

  // Active callout point is at x=175, y=55 (matching D25% cone in reference)
  const activePoint = stepPoints[4];

  return (
    <div
      className={`relative w-full bg-[#080c09] border border-[#1d2a1f] p-3 font-mono select-none overflow-hidden ${className}`}
    >
      {/* Top Header Labels (D5%, D25%, 100%) */}
      <div className="flex items-center justify-between text-[10px] text-[#718770] mb-1 px-4">
        <span className="text-[#8ba28a]">D5% STAGE</span>
        <div className="flex items-center gap-6">
          <span className="text-[#f59e0b] font-bold">D25% ALERT</span>
          <span className="text-[#bef264] font-bold">100% CREST</span>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full h-[135px]">
        <svg
          viewBox="0 0 300 130"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Soft phosphor fill gradient under curve */}
            <linearGradient id="hydro-fill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#bef264" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#080c09" stopOpacity="0" />
            </linearGradient>

            {/* Inverted Callout Cone Gradient for D5% */}
            <linearGradient id="cone-gray-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#556b57" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#556b57" stopOpacity="0.1" />
            </linearGradient>

            {/* Inverted Callout Cone Gradient for D25% Active Point */}
            <linearGradient id="cone-amber-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
            </linearGradient>

            {/* Dotted Grid Pattern */}
            <pattern id="dot-grid" width="15" height="15" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.8" fill="#1b2a1e" />
            </pattern>
          </defs>

          {/* Dot Grid Background */}
          <rect x="20" y="10" width="270" height="105" fill="url(#dot-grid)" />

          {/* Horizontal Reference Lines */}
          {/* Baseline */}
          <line x1="20" y1="115" x2="290" y2="115" stroke="#253a29" strokeWidth="1" />
          {/* Evac line (at top y=30) */}
          <line
            x1="20"
            y1="30"
            x2="290"
            y2="30"
            stroke="#ef4444"
            strokeWidth="0.8"
            strokeDasharray="2 3"
            strokeOpacity="0.4"
          />
          {/* Mid threshold line (y=75) */}
          <line
            x1="20"
            y1="75"
            x2="290"
            y2="75"
            stroke="#263b2a"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />

          {/* Stepped Area Fill */}
          <polygon
            points="
              30,115
              30,110
              65,110
              100,92
              140,92
              175,55
              215,55
              250,30
              285,30
              285,115
            "
            fill="url(#hydro-fill)"
          />

          {/* Downward Shaded Cone 1: At D5% (x=100, y=92) */}
          <polygon
            points="92,45 108,45 100,92"
            fill="url(#cone-gray-grad)"
          />
          <line x1="92" y1="45" x2="108" y2="45" stroke="#718770" strokeWidth="1" />

          {/* Downward Shaded Cone 2: At D25% Peak Point (x=175, y=55) */}
          <polygon
            points="167,15 183,15 175,55"
            fill="url(#cone-amber-grad)"
          />
          <line x1="167" y1="15" x2="183" y2="15" stroke="#f59e0b" strokeWidth="1.5" />

          {/* Glowing Stepped Line (River Water Stage) */}
          <polyline
            points="
              30,110
              65,110
              100,92
              140,92
              175,55
              215,55
              250,30
              285,30
            "
            fill="none"
            stroke="#bef264"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Concentric Amber Target Bullseye Node at (175, 55) */}
          <circle cx="175" cy="55" r="5" fill="#080c09" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="175" cy="55" r="2" fill="#f59e0b" />

          {/* Other Step Vertex Markers */}
          <circle cx="100" cy="92" r="2.5" fill="#bef264" />
          <circle cx="250" cy="30" r="2.5" fill="#bef264" />

          {/* Y-Axis Label: 5% / 2.4m */}
          <text
            x="14"
            y="95"
            fill="#a4b8a2"
            fontSize="8"
            fontWeight="bold"
            textAnchor="end"
          >
            5%
          </text>
          <text
            x="14"
            y="34"
            fill="#ef4444"
            fontSize="8"
            fontWeight="bold"
            textAnchor="end"
          >
            CRIT
          </text>

          {/* Timeline Bottom Axis Ticks: 30, 20, 10, 0 (matching reference) */}
          <line x1="50" y1="115" x2="50" y2="120" stroke="#4a664e" strokeWidth="1" />
          <line x1="115" y1="115" x2="115" y2="120" stroke="#4a664e" strokeWidth="1" />
          <line x1="185" y1="115" x2="185" y2="120" stroke="#4a664e" strokeWidth="1" />
          <line x1="265" y1="115" x2="265" y2="120" stroke="#4a664e" strokeWidth="1" />

          <text x="50" y="128" fill="#69856c" fontSize="8" textAnchor="middle">
            30
          </text>
          <text x="115" y="128" fill="#69856c" fontSize="8" textAnchor="middle">
            20
          </text>
          <text x="185" y="128" fill="#69856c" fontSize="8" textAnchor="middle">
            10
          </text>
          <text x="265" y="128" fill="#69856c" fontSize="8" textAnchor="middle">
            0
          </text>
        </svg>

        {/* Floating Callout Text for Amber Cone: "25%" or "3.85m" */}
        <div className="absolute top-[28px] left-[138px] text-[10px] font-bold text-[#f59e0b] tracking-wider pointer-events-none">
          25%
        </div>
      </div>

      {/* Footer Text Action Row (Matching reference: "HOLD 25% · p95 < 200ms", "THEN -> 100%", "ROLLBACK AUTO") */}
      <div className="mt-2 pt-2 border-t border-[#1c2b1e] flex flex-wrap items-center justify-between gap-1 text-[10px] text-[#8ea68c] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-[#f59e0b] font-bold">HOLD 25%</span>
          <span>·</span>
          <span>FLOW &lt; 1400m³/s</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#8ea68c]">
            THEN <span className="text-[#bef264]">→</span> 100%
          </span>
          <span className="text-[#ef4444] font-bold tracking-wider hover:underline cursor-pointer">
            DRAIN AUTO
          </span>
        </div>
      </div>
    </div>
  );
};
