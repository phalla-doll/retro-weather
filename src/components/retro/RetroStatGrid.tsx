import React from 'react';

export interface StatItem {
  label: string;
  value: string | number;
  highlightColor?: 'lime' | 'amber' | 'red' | 'default';
  unit?: string;
}

interface RetroStatGridProps {
  items: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const RetroStatGrid: React.FC<RetroStatGridProps> = ({
  items,
  columns = 3,
  className = '',
}) => {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns];

  const colorMap = {
    default: 'text-white',
    lime: 'text-[#bef264]',
    amber: 'text-[#f59e0b]',
    red: 'text-[#ef4444]',
  };

  return (
    <div
      className={`relative border border-[#233526] bg-[#070b08] font-mono select-none overflow-hidden ${className}`}
    >
      <div className={`grid ${colClass} divide-x divide-y divide-[#1e2d21]`}>
        {items.map((item, idx) => (
          <div key={idx} className="p-2 flex flex-col justify-center items-center text-center">
            {/* Label */}
            <span className="text-[10px] text-[#788e76] uppercase tracking-wider font-semibold mb-0.5">
              {item.label}
            </span>
            {/* Value */}
            <div className="flex items-baseline gap-1">
              <span
                className={`text-[13px] font-bold tracking-tight ${
                  item.highlightColor ? colorMap[item.highlightColor] : 'text-white'
                }`}
              >
                {item.value}
              </span>
              {item.unit && (
                <span className="text-[9px] text-[#6d826a] font-normal">
                  {item.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
