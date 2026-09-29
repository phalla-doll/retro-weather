export interface RadarTarget {
  id: string;
  code: string;
  name: string;
  x: number; // percentage -100 to 100 from center
  y: number;
  type: 'station' | 'storm_cell' | 'crest_point' | 'gate';
  status: 'normal' | 'warning' | 'critical';
  reading?: string;
  velocity?: string;
  direction?: string;
}

export interface InundationZone {
  id: string;
  label: string;
  sublabel: string;
  severity: 'moderate' | 'high' | 'severe';
  polygon: [number, number][]; // coordinates on radar 0-100 scale
  labelPos: { x: number; y: number };
}

export interface HydrographPoint {
  timeOffsetMin: number; // e.g. -30, -20, -10, 0, 10
  timeLabel: string;
  waterLevelMeters: number;
  rainRateMmH: number;
  dischargeCubicM: number;
  isProjected?: boolean;
}

export interface FloodStationData {
  id: string;
  code: string;
  name: string;
  basin: string;
  region: string;
  uptime: string;
  status: 'NOMINAL' | 'ALERT' | 'CRITICAL';
  waterLevel: number; // in meters
  dangerLevel: number;
  evacLevel: number;
  rateOfRiseCmH: number;
  rainAccumMm: number;
  rainRateMmH: number;
  dischargeM3S: number;
  soilSaturationPct: number;
  sluiceAperturePct: number;
  activePumps: number;
  maxPumps: number;
  autoSluice: boolean;
  sirenArmed: boolean;
  overflowBufferPct: number;
  recentAlert?: {
    title: string;
    description: string;
    subtext: string;
    actionLabel: string;
    level: 'warning' | 'critical';
  };
}
