'use client';

import { CATEGORIES } from '@/lib/categories';

interface FilterBarProps {
  active: string;
  onChange: (id: string) => void;
}

export default function FilterBar({ active, onChange }: FilterBarProps) {
  const all = { id: 'all', label: 'All', emoji: '🗺️', color: '#374151' };
  const items = [all, ...CATEGORIES];

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        scrollbarWidth: 'none',
      }}
    >
      {items.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 999,
              border: `1.5px solid ${isActive ? cat.color : '#e5e7eb'}`,
              background: isActive ? cat.color : 'white',
              color: isActive ? 'white' : '#374151',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 150ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
