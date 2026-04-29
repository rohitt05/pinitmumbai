'use client';

import { motion, LayoutGroup } from 'framer-motion';
import { CATEGORIES } from '@/lib/categories';

interface FilterBarProps {
  active: string;
  onChange: (id: string) => void;
}

const ALL = { id: 'all', label: 'All', emoji: '🗺️', color: '#374151' };
const ITEMS = [ALL, ...CATEGORIES];

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      padding: '10px 16px',
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      scrollbarWidth: 'none',
    }}>
      <LayoutGroup>
        {ITEMS.map((cat) => {
          const isActive = active === cat.id;
          return (
            <motion.button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              whileTap={{ scale: 0.93 }}
              style={{
                position: 'relative',
                flexShrink: 0,
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px',
                borderRadius: 999,
                border: 'none',
                background: 'transparent',
                color: isActive ? 'white' : '#6b7280',
                fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
                zIndex: 1,
                transition: 'color 150ms ease',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="filter-pill"
                  style={{
                    position: 'absolute', inset: 0,
                    borderRadius: 999,
                    background: cat.color,
                    zIndex: -1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span style={{ fontSize: 14 }}>{cat.emoji}</span>
              <span>{cat.label}</span>
            </motion.button>
          );
        })}
      </LayoutGroup>
    </div>
  );
}
