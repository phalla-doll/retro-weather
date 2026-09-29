import React from 'react';

interface RetroLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stationCode: string;
}

const SAMPLE_LOGS = [
  { time: '04:15:22.104', type: 'SYS', msg: 'HEARTBEAT NOMINAL - TELEMETRY FREQ: 1Hz (SIG 99.4%)' },
  { time: '04:15:20.892', type: 'DOP', msg: 'RADAR DOPPLER SWEEP #842 COMPLETE - CELL A1106 DETECTED' },
  { time: '04:15:18.420', type: 'FLOD', msg: 'STAGE READING 3.85m -> EXCEEDED THRESHOLD D25% (+12 cm/h)' },
  { time: '04:15:12.118', type: 'PUMP', msg: 'AUX PUMP UNIT #3 ONLINE - RPM 1420 - DISCHARGE 380 m3/s' },
  { time: '04:15:05.651', type: 'WARN', msg: 'INUNDATION SECTOR 3: EMBANKMENT OVERFLOW AT MARK 24' },
  { time: '04:14:52.003', type: 'GATE', msg: 'SLUICE GATE #04 APERTURE SYNCHRONIZED TO 75.0%' },
  { time: '04:14:38.291', type: 'ENV', msg: 'BAROMETRIC DROP: 1002.4 hPa (DELTA -3.2 hPa / 30m)' },
  { time: '04:14:15.912', type: 'SOIL', msg: 'BASIN GROUND SATURATION SENSOR S4: 94.2% (MAX ABSORPTION REACHED)' },
];

export const RetroLogDrawer: React.FC<RetroLogDrawerProps> = ({
  isOpen,
  onClose,
  stationCode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#090d0a] border-2 border-[#bef264] text-[#d6e2d3] font-mono shadow-[0_0_40px_rgba(190,242,100,0.15)] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-4 py-2.5 bg-[#0e1610] border-b border-[#233526] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#bef264] animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wider">
              TELEMETRY STREAM // {stationCode}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[#8ea68c] hover:text-white border border-[#2d4231] px-2 py-0.5"
          >
            [ CLOSE (ESC) ]
          </button>
        </div>

        {/* Console Log Area */}
        <div className="p-4 overflow-y-auto space-y-2 text-xs font-mono flex-1 leading-relaxed bg-[#060907]">
          {SAMPLE_LOGS.map((log, i) => (
            <div key={i} className="flex items-start gap-2 hover:bg-[#0f1711] p-1">
              <span className="text-[#556e57] shrink-0">[{log.time}]</span>
              <span
                className={`font-bold shrink-0 px-1 text-[10px] ${
                  log.type === 'WARN'
                    ? 'bg-[#ef4444] text-black'
                    : log.type === 'FLOD'
                    ? 'bg-[#f59e0b] text-black'
                    : 'text-[#bef264]'
                }`}
              >
                {log.type}
              </span>
              <span
                className={
                  log.type === 'WARN'
                    ? 'text-[#fca5a5]'
                    : log.type === 'FLOD'
                    ? 'text-[#fcd34d]'
                    : 'text-[#c2d4c0]'
                }
              >
                {log.msg}
              </span>
            </div>
          ))}
        </div>

        {/* Terminal Input Bar */}
        <div className="px-4 py-2 bg-[#0d130e] border-t border-[#1c2b1e] flex items-center gap-2 text-xs text-[#bef264]">
          <span>&gt;</span>
          <span className="text-[#8ba28a]">FILTER: ALL PACKETS OK</span>
          <span className="w-2 h-4 bg-[#bef264] animate-ping ml-auto" />
        </div>
      </div>
    </div>
  );
};
