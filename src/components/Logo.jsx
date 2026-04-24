import React from 'react';

/**
 * QuantBridge brand mark.
 *
 * Concept:  two "pylons" (candlestick pillars) connected by a bridge arc,
 * with an ascending chart spark riding across it. Nods to both the quant
 * (data / candles) and bridge (connective arc) halves of the name.
 *
 * The mark uses a gradient from accent-blue → up-green so it feels alive
 * next to the financial palette without introducing new colors.
 */
const Logo = ({ size = 22, withWordmark = true, className = '' }) => {
  const id = React.useId();
  const gradId  = `qb-grad-${id}`;
  const glowId  = `qb-glow-${id}`;

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="QuantBridge"
        role="img"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="var(--color-accent)" />
            <stop offset="55%"  stopColor="#4F8DFF" />
            <stop offset="100%" stopColor="var(--color-up)" />
          </linearGradient>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Rounded square plate — subtle base so the mark reads well on any bg */}
        <rect
          x="1" y="1" width="30" height="30" rx="7"
          fill="var(--color-surface-2)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />

        {/* Left pylon (bearish tone, grounded) */}
        <rect x="7"  y="11" width="3" height="13" rx="1" fill={`url(#${gradId})`} opacity="0.9" />
        {/* Right pylon (bullish tone, lifted) */}
        <rect x="22" y="8"  width="3" height="16" rx="1" fill={`url(#${gradId})`} />

        {/* Bridge arc connecting the pylons */}
        <path
          d="M 8.5 11 C 12 5, 20 5, 23.5 8"
          stroke={`url(#${gradId})`}
          strokeWidth="1.75"
          strokeLinecap="round"
          fill="none"
          filter={`url(#${glowId})`}
        />

        {/* Ascending spark riding across the bridge deck */}
        <path
          d="M 6 22 L 11 19 L 15 20.5 L 19 16 L 23 17.5 L 26 14"
          stroke="var(--color-up)"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.85"
        />

        {/* Accent dot at the apex — the "breakout" */}
        <circle cx="26" cy="14" r="1.4" fill="var(--color-up)" />
      </svg>

      {withWordmark && (
        <div className="flex items-baseline gap-[3px] font-semibold tracking-tight leading-none">
          <span className="text-[color:var(--color-text-primary)] text-[14px]">Quant</span>
          <span
            className="text-[14px]"
            style={{
              background: 'linear-gradient(90deg, var(--color-accent), var(--color-up))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Bridge
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
