import React, { useState, useEffect } from 'react';
import { RadarTarget, InundationZone } from '../../types/weatherFlood';

interface RetroRadarScopeProps {
  targets?: RadarTarget[];
  activeZoneLabel?: string;
  onSelectTarget?: (target: RadarTarget) => void;
  isSweeping?: boolean;
}

const DEFAULT_TARGETS: RadarTarget[] = [
  {
    id: 't-1',
    code: 'A992',
    name: 'North Upstream Sluice',
    x: 48,
    y: 28,
    type: 'station',
    status: 'normal',
    reading: '2.4m',
  },
  {
    id: 't-2',
    code: 'A1106',
    name: 'Flash Storm Cell #4',
    x: 65,
    y: 24,
    type: 'storm_cell',
    status: 'critical',
    reading: '74 mm/h',
    velocity: '42 km/h',
    direction: 'SSW',
  },
  {
    id: 't-3',
    code: 'A962',
    name: 'Estuary Barrier Gauge',
    x: 75,
    y: 78,
    type: 'station',
    status: 'normal',
    reading: '1.8m',
  },
  {
    id: 't-4',
    code: 'LB : 443',
    name: 'Basin Central Sensor #443',
    x: 28,
    y: 72,
    type: 'crest_point',
    status: 'warning',
    reading: '4.85m CREST',
  },
];

export const RetroRadarScope: React.FC<RetroRadarScopeProps> = ({
  targets = DEFAULT_TARGETS,
  onSelectTarget,
  isSweeping = true,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<RadarTarget | null>(null);
  const [hoveredTarget, setHoveredTarget] = useState<RadarTarget | null>(null);
  const [sweepAngle, setSweepAngle] = useState(45);
  const [showInundation, setShowInundation] = useState(true);

  // Radar sweep animation
  useEffect(() => {
    if (!isSweeping) return;
    const interval = setInterval(() => {
      setSweepAngle((prev) => (prev + 2.5) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isSweeping]);

  const handleTargetClick = (target: RadarTarget) => {
    setSelectedTarget(target);
    onSelectTarget?.(target);
  };

  return (
    <div className="relative w-full aspect-square max-h-[380px] bg-[#070b08] border border-[#1b2a1e] rounded overflow-hidden select-none font-mono">
      {/* Top Coordinate Header (T+00, T+10, T+20, N arrow) */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-[11px] text-[#638066] z-20 pointer-events-none font-mono">
        <div className="flex items-center gap-1.5 text-white">
          <span className="text-[#bef264]">▲</span>
          <span className="font-bold tracking-widest text-[10px]">N</span>
        </div>
        <div className="flex items-center gap-6 text-[10px] tracking-wider">
          <span>T+00</span>
          <span>T+10</span>
          <span>T+20</span>
        </div>
      </div>

      <svg
        viewBox="0 0 300 300"
        className="w-full h-full relative z-10"
      >
        <defs>
          {/* Hatched Pattern for Flood Inundation Zone (matching reference) */}
          <pattern
            id="flood-hatch-pattern"
            width="6"
            height="6"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke="#ea580c"
              strokeWidth="1.6"
              strokeOpacity="0.85"
            />
          </pattern>

          {/* Sweep Beam Phosphor Gradient */}
          <linearGradient id="sweep-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#bef264" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#bef264" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#bef264" stopOpacity="0" />
          </linearGradient>

          {/* Radial Glow */}
          <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#bef264" stopOpacity="0.12" />
            <stop offset="80%" stopColor="#bef264" stopOpacity="0.01" />
            <stop offset="100%" stopColor="#070b08" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Radar Ambient Radial Background */}
        <circle cx="150" cy="150" r="135" fill="url(#center-glow)" />

        {/* Range Rings */}
        <circle
          cx="150"
          cy="150"
          r="45"
          fill="none"
          stroke="#1d2e20"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <circle
          cx="150"
          cy="150"
          r="85"
          fill="none"
          stroke="#263b2a"
          strokeWidth="1"
        />
        <circle
          cx="150"
          cy="150"
          r="125"
          fill="none"
          stroke="#1f3223"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <circle
          cx="150"
          cy="150"
          r="138"
          fill="none"
          stroke="#142116"
          strokeWidth="1"
        />

        {/* Polar Radial Crosshairs */}
        <line x1="150" y1="12" x2="150" y2="288" stroke="#1c2c1f" strokeWidth="1" />
        <line x1="12" y1="150" x2="288" y2="150" stroke="#1c2c1f" strokeWidth="1" />
        <line
          x1="55"
          y1="55"
          x2="245"
          y2="245"
          stroke="#152217"
          strokeWidth="0.8"
          strokeDasharray="2 4"
        />
        <line
          x1="55"
          y1="245"
          x2="245"
          y2="55"
          stroke="#152217"
          strokeWidth="0.8"
          strokeDasharray="2 4"
        />

        {/* Hatched Flood Inundation Danger Zone (Left Basin Overflow) */}
        {showInundation && (
          <g className="cursor-pointer" onClick={() => setShowInundation(!showInundation)}>
            <path
              d="M 25 130 Q 50 120 70 140 T 115 155 Q 120 185 95 210 Q 55 225 35 195 Z"
              fill="url(#flood-hatch-pattern)"
              stroke="#ea580c"
              strokeWidth="1.2"
              className="transition-opacity hover:opacity-80"
            />
            {/* Outline highlight */}
            <path
              d="M 25 130 Q 50 120 70 140 T 115 155 Q 120 185 95 210 Q 55 225 35 195 Z"
              fill="rgba(234, 88, 12, 0.08)"
            />
          </g>
        )}

        {/* Dotted Storm Trajectory or Evac Zone (Top Right 'RETRY' zone in reference) */}
        <path
          d="M 175 100 C 175 88, 220 88, 220 100 C 220 115, 175 115, 175 100 Z"
          fill="rgba(245, 158, 11, 0.06)"
          stroke="#f59e0b"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />
        <text
          x="226"
          y="104"
          fill="#f59e0b"
          fontSize="9"
          fontWeight="bold"
          letterSpacing="0.05em"
        >
          SPILLWAY
        </text>

        {/* Dashed Red Trajectory Arc with Arrow (Storm cell A1106 SSW storm track) */}
        <g className="opacity-90">
          <path
            d="M 195 75 C 205 110, 200 150, 186 186"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <polygon
            points="185,189 192,182 183,180"
            fill="#ef4444"
          />
          {/* Velocity & Track annotation */}
          <text
            x="206"
            y="135"
            fill="#f87171"
            fontSize="7.5"
            letterSpacing="0.05em"
            fontWeight="bold"
          >
            42 KM/H SSW
          </text>
        </g>

        {/* Rotating Radar Sweep Vector Beam */}
        <g transform={`rotate(${sweepAngle} 150 150)`}>
          {/* Main needle */}
          <line
            x1="150"
            y1="150"
            x2="150"
            y2="15"
            stroke="#bef264"
            strokeWidth="1.4"
          />
          {/* Trailing wedge */}
          <path
            d="M 150 150 L 150 15 A 135 135 0 0 0 115 22 Z"
            fill="url(#sweep-gradient)"
          />
        </g>

        {/* Central Tactical Vector Line & Hub (Connecting Station 443 to radar hub) */}
        <line
          x1="84"
          y1="216"
          x2="150"
          y2="150"
          stroke="#bef264"
          strokeWidth="1.8"
        />
        <line
          x1="150"
          y1="150"
          x2="190"
          y2="110"
          stroke="#bef264"
          strokeWidth="1.8"
        />
        {/* Concentric pivot node */}
        <circle cx="150" cy="150" r="4.5" fill="#080b09" stroke="#bef264" strokeWidth="2" />
        <circle cx="150" cy="150" r="1.5" fill="#bef264" />

        {/* Target 4: LB : 443 Node (with ring and connector) */}
        <circle cx="84" cy="216" r="4" fill="#080b09" stroke="#bef264" strokeWidth="1.5" />
        <circle cx="84" cy="216" r="1.5" fill="#bef264" />

        {/* Target: Sluice Gate Node */}
        <circle cx="190" cy="110" r="4" fill="#080b09" stroke="#bef264" strokeWidth="1.5" />
        <circle cx="190" cy="110" r="1.5" fill="#f59e0b" />

        {/* Target Labels & Markers on SVG */}
        {/* A992 */}
        <g
          className="cursor-pointer"
          onClick={() => {
            const t = targets.find((item) => item.code === 'A992');
            if (t) handleTargetClick(t);
          }}
        >
          <text
            x="146"
            y="85"
            fill="#d1dcce"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            A992
          </text>
          <circle cx="140" cy="88" r="2.5" fill="#bef264" />
        </g>

        {/* Storm Cell A1106 (Doppler Precipitation Core with Precipitation Reflectivity) */}
        <g
          className="cursor-pointer group"
          onClick={() => {
            const t = targets.find((item) => item.code === 'A1106');
            if (t) handleTargetClick(t);
          }}
        >
          {/* Outer high-reflectivity storm contour (>65 dBZ) */}
          <ellipse
            cx="195"
            cy="75"
            rx="14"
            ry="10"
            fill="rgba(239, 68, 68, 0.12)"
            stroke="#ef4444"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          {/* Rain Core */}
          <ellipse
            cx="195"
            cy="75"
            rx="7"
            ry="5"
            fill="rgba(239, 68, 68, 0.35)"
          />
          {/* Center Target Dot with Pulse */}
          <circle cx="195" cy="75" r="4" fill="#ef4444" className="animate-ping opacity-60" />
          <circle cx="195" cy="75" r="2.5" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" />

          {/* Tactical Label & Reading */}
          <text
            x="213"
            y="73"
            fill="#ef4444"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            A1106
          </text>
          <text
            x="213"
            y="83"
            fill="#fca5a5"
            fontSize="7.5"
            fontWeight="normal"
            letterSpacing="0.02em"
          >
            74 mm/h
          </text>
        </g>

        {/* A962 at bottom right */}
        <g
          className="cursor-pointer"
          onClick={() => {
            const t = targets.find((item) => item.code === 'A962');
            if (t) handleTargetClick(t);
          }}
        >
          <text
            x="225"
            y="234"
            fill="#869984"
            fontSize="9"
            fontWeight="bold"
          >
            A962
          </text>
          <circle cx="220" cy="231" r="2.5" fill="#638066" />
        </g>

        {/* Radar Range Annotations */}
        <text
          x="150"
          y="232"
          fill="#5a735c"
          fontSize="8"
          textAnchor="middle"
          letterSpacing="0.05em"
        >
          10 KM
        </text>
      </svg>

      {/* Floating HUD Callout 1: GATE D5% SE-ASIA (Matching screenshot style) */}
      <div
        className="absolute top-[100px] left-[32px] z-20 cursor-pointer pointer-events-auto"
        onClick={() => setShowInundation(!showInundation)}
      >
        <div className="border border-[#bef264] bg-[#090d0a]/90 px-2 py-1 rounded text-center shadow-[0_0_10px_rgba(0,0,0,0.8)] backdrop-blur-[2px]">
          <div className="text-[10px] font-bold text-[#bef264] tracking-wider leading-none">
            GATE SE-04
          </div>
          <div className="text-[9px] text-white tracking-tight leading-tight mt-0.5">
            D5% INUNDATION
          </div>
        </div>
      </div>

      {/* Floating HUD Callout 2: LB : 443 Box (Matching screenshot style) */}
      <div
        className="absolute bottom-[44px] left-[70px] z-20 cursor-pointer"
        onClick={() => {
          const lb = targets.find((t) => t.code.includes('443'));
          if (lb) handleTargetClick(lb);
        }}
      >
        <div className="border border-[#d1dcce] bg-[#090d0a]/90 px-2 py-0.5 rounded text-[10px] font-bold text-white tracking-wider flex items-center gap-1 shadow-md">
          <span>LB : 443</span>
        </div>
      </div>

      {/* Selected Contact Telemetry Overlay if target selected */}
      {selectedTarget && (
        <div className="absolute top-9 right-3 z-30 pointer-events-auto bg-[#090d0a]/95 border border-[#ef4444] px-2.5 py-1.5 shadow-[0_0_12px_rgba(239,68,68,0.4)] max-w-[155px]">
          <div className="flex items-center justify-between text-[9px] text-[#ef4444] font-black border-b border-[#ef4444]/40 pb-0.5 mb-1">
            <span>[CONTACT {selectedTarget.code}]</span>
            <button
              onClick={() => setSelectedTarget(null)}
              className="text-[#888] hover:text-white cursor-pointer ml-1"
            >
              ✕
            </button>
          </div>
          <div className="text-[9px] text-white font-bold leading-tight">
            {selectedTarget.name}
          </div>
          <div className="text-[8.5px] text-[#fca5a5] mt-0.5">
            INTENSITY: {selectedTarget.reading}
          </div>
          {selectedTarget.velocity && (
            <div className="text-[8px] text-[#94a3b8] mt-0.5">
              VEL: {selectedTarget.velocity} {selectedTarget.direction}
            </div>
          )}
        </div>
      )}

      {/* Bottom Sub-bar HUD Status */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-[#638066] z-20 pointer-events-none font-mono">
        <span className="text-[#a4b8a2]">BASIN SWEEP: 360°</span>
        <span className="text-[#bef264] font-bold">RANGE: 30 KM</span>
      </div>
    </div>
  );
};
