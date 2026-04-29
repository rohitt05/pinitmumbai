'use client';

import { motion, LayoutGroup } from 'framer-motion';
import { CATEGORIES } from '@/lib/categories';

interface FilterBarProps {
  active: string;
  onChange: (id: string) => void;
  totalCount?: number;
}

const ALL = { id: 'all', label: 'All', emoji: '', color: '#111827' };
const ITEMS = [ALL, ...CATEGORIES];

export default function FilterBar({ active, onChange, totalCount }: FilterBarProps) {
  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(0,0,0,0.055)',
      }}
    >
      {/* ── Top row: wordmark + live badge ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px 0',
        }}
      >
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 20,
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.045em',
              lineHeight: 1,
            }}
          >
            PinIt
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 20,
              fontWeight: 300,
              color: '#94a3b8',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            Mumbai
          </span>
        </div>

        {/* Live pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: 999,
            padding: '4px 10px',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#ef4444',
              display: 'inline-block',
              flexShrink: 0,
            }}
            className="animate-pulse-dot"
          />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              fontWeight: 600,
              color: '#ef4444',
              letterSpacing: '0.02em',
            }}
          >
            {totalCount != null ? `${totalCount} live` : 'Live'}
          </span>
        </div>
      </div>

      {/* ── Bottom row: filter chips ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          padding: '8px 16px 12px',
        }}
      >
        <LayoutGroup>
          {ITEMS.map((cat) => {
            const isActive = active === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => onChange(cat.id)}
                whileTap={{ scale: 0.88 }}
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '5px 12px',
                  borderRadius: 999,
                  border: 'none',
                  background: 'transparent',
                  color: isActive ? 'white' : '#64748b',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  whiteSpace: 'nowrap',
                  zIndex: 1,
                  letterSpacing: '-0.005em',
                  transition: 'color 180ms ease',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="filter-pill"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 999,
                      background: cat.id === 'all' ? '#0f172a' : cat.color,
                      zIndex: -1,
                    }}
                    transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                  />
                )}
                {cat.emoji && (
                  <span style={{ fontSize: 12, lineHeight: 1 }}>{cat.emoji}</span>
                )}
                <span>{cat.label}</span>
              </motion.button>
            );
          })}
        </LayoutGroup>
      </div>
    </div>
  );
}
