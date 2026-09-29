import React from 'react';

interface RetroAlertBoxProps {
  title: string;
  statusBadge?: string;
  lines: string[];
  actionLabel?: string;
  onAction?: () => void;
  severity?: 'critical' | 'warning';
  className?: string;
}

export const RetroAlertBox: React.FC<RetroAlertBoxProps> = ({
  title,
  statusBadge = 'CRITICAL',
  lines,
  actionLabel,
  onAction,
  severity = 'critical',
  className = '',
}) => {
  const isCritical = severity === 'critical';

  return (
    <div
      className={`relative p-3 font-mono select-none transition-all ${
        isCritical
          ? 'border-2 border-dashed border-[#ef4444] bg-[#220b0b]/40 text-[#fca5a5]'
          : 'border-2 border-dashed border-[#f59e0b] bg-[#261806]/40 text-[#fcd34d]'
      } ${className}`}
    >
      {/* Title Header with dot */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`font-black text-xs tracking-wider uppercase ${
              isCritical ? 'text-[#ef4444] glow-red' : 'text-[#f59e0b] glow-amber'
            }`}
          >
            {title}
          </span>
          <span className="text-xs opacity-60">·</span>
          <span
            className={`text-[10px] font-bold px-1 py-0.5 rounded-none ${
              isCritical ? 'bg-[#ef4444] text-white' : 'bg-[#f59e0b] text-black'
            }`}
          >
            {statusBadge}
          </span>
        </div>
      </div>

      {/* Detail Lines */}
      <div className="space-y-1 mb-3 text-[11px] text-[#cbd5e1] font-mono leading-relaxed">
        {lines.map((line, idx) => (
          <div key={idx} className="flex items-baseline gap-1.5">
            <span className="opacity-40 text-[9px]">›</span>
            <span>{line}</span>
          </div>
        ))}
      </div>

      {/* Action Button inside box */}
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className={`w-full py-1.5 px-3 text-[11px] font-bold tracking-wider transition-all duration-150 uppercase cursor-pointer ${
            isCritical
              ? 'border border-[#ef4444] text-white bg-[#ef4444]/20 hover:bg-[#ef4444] hover:text-black active:translate-y-[1px]'
              : 'border border-[#f59e0b] text-white bg-[#f59e0b]/20 hover:bg-[#f59e0b] hover:text-black active:translate-y-[1px]'
          }`}
        >
          [ {actionLabel} ]
        </button>
      )}
    </div>
  );
};
