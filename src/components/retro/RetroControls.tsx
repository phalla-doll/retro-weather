import React from 'react';

// ==========================================
// Retro Stepper Component: [ - ]  [ 3 ]  [ + ]
// ==========================================
interface RetroStepperProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  className?: string;
}

export const RetroStepper: React.FC<RetroStepperProps> = ({
  value,
  min = 0,
  max = 10,
  step = 1,
  unit = '',
  onChange,
  className = '',
}) => {
  const handleDecrement = () => {
    if (value - step >= min) onChange(value - step);
  };

  const handleIncrement = () => {
    if (value + step <= max) onChange(value + step);
  };

  return (
    <div className={`inline-flex items-center gap-1 font-mono select-none ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="w-7 h-6 flex items-center justify-center border border-[#2d4231] bg-[#0c120e] text-[#a7bba5] hover:border-[#bef264] hover:text-[#bef264] disabled:opacity-30 disabled:pointer-events-none active:bg-[#bef264] active:text-black transition-colors"
      >
        -
      </button>
      <div className="min-w-9 h-6 px-1 flex items-center justify-center border border-[#2d4231] bg-[#070b08] text-white text-xs font-bold tabular-nums">
        {value}
        {unit}
      </div>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="w-7 h-6 flex items-center justify-center border border-[#2d4231] bg-[#0c120e] text-[#a7bba5] hover:border-[#bef264] hover:text-[#bef264] disabled:opacity-30 disabled:pointer-events-none active:bg-[#bef264] active:text-black transition-colors"
      >
        +
      </button>
    </div>
  );
};

// ==========================================
// Retro Toggle: [ ON ] / [ OFF ]
// ==========================================
interface RetroToggleProps {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  className?: string;
}

export const RetroToggle: React.FC<RetroToggleProps> = ({
  label,
  checked,
  onChange,
  className = '',
}) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between py-1 px-1 cursor-pointer font-mono select-none group hover:bg-[#121c14] transition-colors ${className}`}
    >
      <span className="text-xs text-[#a0b59e] uppercase tracking-wider group-hover:text-white transition-colors">
        {label}
      </span>
      <span
        className={`text-xs font-bold px-2 py-0.5 tracking-wider transition-colors ${
          checked
            ? 'text-[#bef264] glow-lime'
            : 'text-[#506352]'
        }`}
      >
        [ {checked ? 'ON' : 'OFF'} ]
      </span>
    </div>
  );
};

// ==========================================
// Retro Button: [ LOGS ], [ REDEPLOY ]
// ==========================================
interface RetroButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'danger' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const RetroButton: React.FC<RetroButtonProps> = ({
  children,
  variant = 'outline',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'py-1 px-3 text-[10px]',
    md: 'py-2 px-4 text-xs',
    lg: 'py-2.5 px-5 text-sm',
  }[size];

  const variantClasses = {
    // Solid neon chartreuse button matching [ REDEPLOY ] in reference
    primary:
      'bg-[#bef264] text-black font-extrabold border border-[#bef264] hover:bg-[#d4fc6a] active:translate-y-[1px] shadow-[0_0_12px_rgba(190,242,100,0.3)]',
    // Dark outline button matching [ LOGS ] in reference
    outline:
      'bg-[#080d09] text-white font-bold border border-[#2d4231] hover:border-white hover:text-white active:bg-[#152017]',
    // Amber hazard button
    amber:
      'bg-[#f59e0b] text-black font-extrabold border border-[#f59e0b] hover:bg-[#fbbf24] active:translate-y-[1px]',
    // Danger red button
    danger:
      'bg-[#ef4444] text-white font-extrabold border border-[#ef4444] hover:bg-[#f87171] active:translate-y-[1px] shadow-[0_0_12px_rgba(239,68,68,0.3)]',
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`font-mono uppercase tracking-wider transition-all duration-150 rounded-none cursor-pointer disabled:opacity-40 disabled:pointer-events-none select-none ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};

// ==========================================
// Retro Crosshair Row Divider
// ==========================================
interface RetroDividerProps {
  className?: string;
}

export const RetroDivider: React.FC<RetroDividerProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-between text-[#263b2a] text-[9px] font-mono select-none my-1 ${className}`}>
      <span className="font-bold">+</span>
      <div className="flex-1 border-t border-[#1c2c1f] mx-1" />
      <span className="font-bold">+</span>
    </div>
  );
};

// ==========================================
// Retro Property Row with Crosshairs
// ==========================================
interface RetroPropRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export const RetroPropRow: React.FC<RetroPropRowProps> = ({
  label,
  value,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between py-1 text-xs font-mono select-none ${className}`}>
      <span className="text-[#788e76] uppercase tracking-wider">{label}</span>
      <div className="text-right text-white font-semibold">{value}</div>
    </div>
  );
};
