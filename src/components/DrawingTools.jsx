import React, { useState } from 'react';
import {
  MousePointer2, TrendingUp, Ruler, Type, Square, Circle,
  Minus, PenTool, Magnet, Lock, Eye, Trash2, ArrowUpDown, ChevronDown,
} from 'lucide-react';

const groups = [
  [
    { key: 'cursor', icon: MousePointer2, label: 'Cursor' },
    { key: 'trend', icon: TrendingUp, label: 'Trend line' },
    { key: 'hline', icon: Minus, label: 'Horizontal line' },
    { key: 'fib', icon: ArrowUpDown, label: 'Fibonacci' },
  ],
  [
    { key: 'rect', icon: Square, label: 'Rectangle' },
    { key: 'circle', icon: Circle, label: 'Ellipse' },
    { key: 'pen', icon: PenTool, label: 'Brush' },
    { key: 'text', icon: Type, label: 'Text' },
  ],
  [
    { key: 'ruler', icon: Ruler, label: 'Measure' },
  ],
];

const Tool = ({ icon: Icon, label, active, onClick }) => (
  <button
    title={label}
    onClick={onClick}
    className={`group relative w-9 h-9 grid place-items-center rounded my-0.5 transition-colors ${
      active
        ? 'text-[var(--color-accent)] bg-[var(--color-surface-3)]'
        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]'
    }`}
  >
    <Icon size={15} />
    <span className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[var(--color-surface-2)] text-[var(--color-text-primary)] text-[11px] px-2 py-1 rounded border border-[var(--color-border)] opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
      {label}
    </span>
  </button>
);

const DrawingTools = () => {
  const [active, setActive] = useState('cursor');

  return (
    <div className="w-11 shrink-0 flex flex-col items-center py-1 bg-[var(--color-surface)]">
      {groups.map((g, idx) => (
        <React.Fragment key={idx}>
          {g.map((t) => (
            <Tool
              key={t.key}
              icon={t.icon}
              label={t.label}
              active={active === t.key}
              onClick={() => setActive(t.key)}
            />
          ))}
          {idx < groups.length - 1 && (
            <div className="w-5 h-px bg-[var(--color-border)] my-1.5" />
          )}
        </React.Fragment>
      ))}

      <div className="mt-auto flex flex-col items-center">
        <Tool icon={Magnet} label="Magnet" />
        <Tool icon={Lock} label="Lock drawings" />
        <Tool icon={Eye} label="Hide drawings" />
        <Tool icon={Trash2} label="Remove all" />
        <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] py-1">
          <ChevronDown size={13} />
        </button>
      </div>
    </div>
  );
};

export default DrawingTools;
