import React, { useState } from 'react';
import {
  Star, Flame, Calendar, Database, MessageSquare, Lightbulb, Filter,
  Newspaper, Bot, Briefcase, HelpCircle,
} from 'lucide-react';

const items = [
  { key: 'watchlist', icon: Star, label: 'Watchlist' },
  { key: 'hotlist', icon: Flame, label: 'Hotlist' },
  { key: 'calendar', icon: Calendar, label: 'Calendar' },
  { key: 'data', icon: Database, label: 'Data Window' },
  { key: 'chat', icon: MessageSquare, label: 'Chat' },
  { key: 'ideas', icon: Lightbulb, label: 'Ideas' },
  { key: 'screener', icon: Filter, label: 'Screener' },
  { key: 'news', icon: Newspaper, label: 'News' },
  { key: 'ai', icon: Bot, label: 'AI Assistant' },
  { key: 'broker', icon: Briefcase, label: 'Broker' },
];

const LeftRail = () => {
  const [active, setActive] = useState('watchlist');

  return (
    <div className="w-11 shrink-0 flex flex-col items-center py-1 bg-[var(--color-surface)] border-r border-[var(--color-border)]">
      {items.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          title={label}
          onClick={() => setActive(key)}
          className={`group relative w-9 h-9 my-0.5 grid place-items-center rounded transition-colors ${
            active === key
              ? 'text-[var(--color-accent)] bg-[var(--color-surface-3)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]'
          }`}
        >
          <Icon size={17} />
          {/* Tooltip */}
          <span className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[var(--color-surface-2)] text-[var(--color-text-primary)] text-[11px] px-2 py-1 rounded border border-[var(--color-border)] opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
            {label}
          </span>
        </button>
      ))}

      <div className="mt-auto">
        <button
          title="Help"
          className="w-9 h-9 grid place-items-center rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]"
        >
          <HelpCircle size={17} />
        </button>
      </div>
    </div>
  );
};

export default LeftRail;
