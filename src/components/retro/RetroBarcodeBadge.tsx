import React from 'react';

interface RetroBarcodeBadgeProps {
  statusText?: string;
  sublabel?: string;
  variant?: 'lime' | 'amber' | 'red' | 'cyan';
  className?: string;
}

export const RetroBarcodeBadge: React.FC<RetroBarcodeBadgeProps> = ({
  statusText = 'LIVE',
  sublabel = 'snsr_8f3a · 4h',
  variant = 'lime',
  className = '',
}) => {
  const theme = {
    lime: {
      border: 'border-[#bef264]',
      badgeBg: 'bg-[#bef264]',
      badgeText: 'text-black',
      barcodeColor: '#bef264',
    },
    amber: {
      border: 'border-[#f59e0b]',
      badgeBg: 'bg-[#f59e0b]',
      badgeText: 'text-black',
      barcodeColor: '#f59e0b',
    },
    red: {
      border: 'border-[#ef4444]',
      badgeBg: 'bg-[#ef4444]',
      badgeText: 'text-white',
      barcodeColor: '#ef4444',
    },
    cyan: {
      border: 'border-[#06b6d4]',
      badgeBg: 'bg-[#06b6d4]',
      badgeText: 'text-black',
      barcodeColor: '#06b6d4',
    },
  }[variant];

  // Barcode pattern bar widths (1 to 4)
  const barcodeBars = [2, 1, 3, 1, 1, 4, 1, 2, 1, 3, 2, 1, 4, 2, 1, 1, 3, 1, 2, 4, 1, 2, 1, 3];

  return (
    <div
      className={`border-2 ${theme.border} bg-[#080d09] p-2 flex items-center justify-between gap-3 font-mono select-none ${className}`}
    >
      {/* Left Highlight Block */}
      <div
        className={`${theme.badgeBg} ${theme.badgeText} font-black text-xl tracking-wider px-3.5 py-1.5 flex items-center justify-center leading-none rounded-none`}
      >
        {statusText}
      </div>

      {/* Right Barcode Graphic & Telemetry Subtitle */}
      <div className="flex-1 flex flex-col items-end justify-center">
        {/* Barcode lines */}
        <div className="flex items-end gap-[1.5px] h-6 w-full max-w-[170px] justify-end opacity-90">
          {barcodeBars.map((width, idx) => (
            <div
              key={idx}
              style={{
                width: `${width * 1.5}px`,
                backgroundColor: theme.barcodeColor,
              }}
              className="h-full"
            />
          ))}
        </div>
        {/* Sublabel */}
        <span className="text-[10px] text-[#8ea68c] tracking-wider mt-1">
          {sublabel}
        </span>
      </div>
    </div>
  );
};
