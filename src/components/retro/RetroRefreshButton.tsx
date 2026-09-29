import React, { useState, useEffect } from 'react';

interface RetroRefreshButtonProps {
  onRefresh: () => Promise<void> | void;
  isRefreshing?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

const SPINNER_FRAMES = ['/', '—', '\\', '|'];

export const RetroRefreshButton: React.FC<RetroRefreshButtonProps> = ({
  onRefresh,
  isRefreshing = false,
  className = '',
  size = 'md',
}) => {
  const [frameIndex, setFrameIndex] = useState(0);

  // Cycling ASCII propeller spinner / — \ | for authentic terminal feel
  useEffect(() => {
    if (!isRefreshing) {
      setFrameIndex(0);
      return;
    }
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % SPINNER_FRAMES.length);
    }, 100);
    return () => clearInterval(timer);
  }, [isRefreshing]);

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]';

  return (
    <button
      type="button"
      onClick={onRefresh}
      disabled={isRefreshing}
      className={`font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 select-none ${
        isRefreshing
          ? 'bg-[#152217] text-[#bef264] border-[#bef264] shadow-[0_0_8px_rgba(190,242,100,0.3)]'
          : 'bg-[#080d09] text-[#a5bea3] border-[#2d4231] hover:border-[#bef264] hover:text-[#bef264] hover:bg-[#0f1711] active:translate-y-[1px]'
      } disabled:cursor-wait ${sizeClasses} ${className}`}
    >
      {/* ASCII spinner glyph or SVG radar spinner */}
      <span className="inline-flex items-center justify-center w-3 text-xs font-black text-[#bef264]">
        {isRefreshing ? SPINNER_FRAMES[frameIndex] : '↻'}
      </span>

      <span>
        {isRefreshing ? 'FETCHING...' : 'FORCE REFRESH'}
      </span>
    </button>
  );
};
