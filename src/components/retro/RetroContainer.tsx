import React from 'react';

interface RetroContainerProps {
  title: string;
  hashCount?: number;
  rightBadge?: React.ReactNode;
  statusText?: string;
  statusColor?: 'lime' | 'amber' | 'red' | 'cyan';
  children: React.ReactNode;
  footerContent?: React.ReactNode;
  className?: string;
  borderTicks?: boolean;
}

export const RetroContainer: React.FC<RetroContainerProps> = ({
  title,
  hashCount = 20,
  rightBadge,
  statusText,
  statusColor = 'amber',
  children,
  footerContent,
  className = '',
  borderTicks = true,
}) => {
  const statusColorMap = {
    lime: 'bg-[#bef264] text-[#080b09]',
    amber: 'bg-[#f59e0b] text-[#080b09]',
    red: 'bg-[#ef4444] text-white',
    cyan: 'bg-[#06b6d4] text-[#080b09]',
  };

  const statusDotMap = {
    lime: 'bg-[#bef264] shadow-[0_0_8px_#bef264]',
    amber: 'bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]',
    red: 'bg-[#ef4444] shadow-[0_0_8px_#ef4444]',
    cyan: 'bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]',
  };

  return (
    <div
      className={`relative bg-[#0a0e0b]/95 border border-[#233526] text-[#d6e2d3] font-mono select-none shadow-[0_12px_32px_rgba(0,0,0,0.6)] ${className}`}
    >
      {/* 4 Corner Crosshairs */}
      <div className="absolute -top-[7px] -left-[7px] text-[#4b6d4f] text-[11px] font-bold leading-none pointer-events-none z-10">
        +
      </div>
      <div className="absolute -top-[7px] -right-[7px] text-[#4b6d4f] text-[11px] font-bold leading-none pointer-events-none z-10">
        +
      </div>
      <div className="absolute -bottom-[7px] -left-[7px] text-[#4b6d4f] text-[11px] font-bold leading-none pointer-events-none z-10">
        +
      </div>
      <div className="absolute -bottom-[7px] -right-[7px] text-[#4b6d4f] text-[11px] font-bold leading-none pointer-events-none z-10">
        +
      </div>

      {/* Decorative Outer Edge L-ticks */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#bef264]/40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#bef264]/40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#bef264]/40 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#bef264]/40 pointer-events-none" />

      {/* Lateral tick marks along height if borderTicks enabled */}
      {borderTicks && (
        <>
          <div className="absolute -left-[5px] top-1/4 text-[#354f38] text-[9px] pointer-events-none font-bold">
            +
          </div>
          <div className="absolute -left-[5px] top-2/4 text-[#354f38] text-[9px] pointer-events-none font-bold">
            -
          </div>
          <div className="absolute -left-[5px] top-3/4 text-[#354f38] text-[9px] pointer-events-none font-bold">
            +
          </div>
          <div className="absolute -right-[5px] top-1/4 text-[#354f38] text-[9px] pointer-events-none font-bold">
            +
          </div>
          <div className="absolute -right-[5px] top-2/4 text-[#354f38] text-[9px] pointer-events-none font-bold">
            -
          </div>
          <div className="absolute -right-[5px] top-3/4 text-[#354f38] text-[9px] pointer-events-none font-bold">
            +
          </div>
        </>
      )}

      {/* Header Bar */}
      <div className="px-3.5 py-2.5 border-b border-[#1c2a1e] flex items-center justify-between gap-2 bg-[#0d130e]">
        {/* Title */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[13px] font-bold tracking-wider text-white">
            {title}
          </span>
        </div>

        {/* ASCII Hash Segment Bar */}
        <div className="hidden sm:flex items-center gap-[1px] overflow-hidden text-[#273d2a] text-[10px] tracking-tighter select-none font-mono">
          {Array.from({ length: hashCount }).map((_, i) => (
            <span
              key={i}
              className={i < hashCount * 0.4 ? 'text-[#3b5e3f]' : 'text-[#1c2d1e]'}
            >
              |
            </span>
          ))}
        </div>

        {/* Right Badge or Status Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          {rightBadge ? (
            rightBadge
          ) : statusText ? (
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span
                className={`w-2 h-2 rounded-full inline-block ${statusDotMap[statusColor]}`}
              />
              <span
                className={
                  statusColor === 'amber'
                    ? 'text-[#f59e0b] font-bold'
                    : statusColor === 'lime'
                    ? 'text-[#bef264] font-bold'
                    : 'text-[#ef4444] font-bold'
                }
              >
                {statusText}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 space-y-3.5">{children}</div>

      {/* Optional Footer */}
      {footerContent && (
        <div className="px-3.5 py-2 border-t border-[#1c2a1e] bg-[#0c110d] text-[11px] text-[#869984] flex items-center justify-between">
          {footerContent}
        </div>
      )}

      {/* Bottom Center Mini Tick Decoration */}
      <div className="flex justify-center pb-1 pointer-events-none">
        <div className="flex gap-[2px] opacity-40">
          <span className="w-1.5 h-[2px] bg-[#bef264]" />
          <span className="w-1.5 h-[2px] bg-[#bef264]" />
          <span className="w-1.5 h-[2px] bg-[#bef264]" />
          <span className="w-1.5 h-[2px] bg-[#1e2d21]" />
          <span className="w-1.5 h-[2px] bg-[#1e2d21]" />
        </div>
      </div>
    </div>
  );
};
