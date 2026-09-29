import React from 'react';

interface RetroSegmentedBarProps {
  label?: string;
  value: number; // 0 to max
  max?: number;
  totalSegments?: number;
  color?: 'lime' | 'amber' | 'red' | 'cyan';
  unit?: string;
  showNumeric?: boolean;
  className?: string;
}

export const RetroSegmentedBar: React.FC<RetroSegmentedBarProps> = ({
  label,
  value,
  max = 100,
  totalSegments = 24,
  color = 'lime',
  unit = '%',
  showNumeric = false,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const activeSegments = Math.round((percentage / 100) * totalSegments);

  const litColorClasses = {
    lime: 'bg-[#bef264] shadow-[0_0_4px_#bef264]',
    amber: 'bg-[#f59e0b] shadow-[0_0_4px_#f59e0b]',
    red: 'bg-[#ef4444] shadow-[0_0_4px_#ef4444]',
    cyan: 'bg-[#06b6d4] shadow-[0_0_4px_#06b6d4]',
  };

  const unlitBg = 'bg-[#131d15] border border-[#1b2a1e]';

  return (
    <div className={`space-y-1 font-mono select-none ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-[11px] text-[#869984]">
          <span className="tracking-wider uppercase">{label}</span>
          {showNumeric && (
            <span
              className={`font-bold tabular-nums ${
                color === 'amber'
                  ? 'text-[#f59e0b]'
                  : color === 'red'
                  ? 'text-[#ef4444]'
                  : 'text-[#bef264]'
              }`}
            >
              {value}
              {unit}
            </span>
          )}
        </div>
      )}

      {/* Segment Blocks Row */}
      <div className="flex items-center gap-[3px] w-full h-[11px] bg-[#070a08] p-[2px] border border-[#1a261c] rounded-none">
        {Array.from({ length: totalSegments }).map((_, index) => {
          const isLit = index < activeSegments;
          return (
            <div
              key={index}
              className={`flex-1 h-full rounded-[1px] transition-colors duration-150 ${
                isLit ? litColorClasses[color] : unlitBg
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
