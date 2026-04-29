'use client';

import { motion, LayoutGroup } from 'framer-motion';
import { CATEGORIES } from '@/lib/categories';

interface FilterBarProps {
  active: string;
  onChange: (id: string) => void;
}

const ALL = { id: 'all', label: 'All', emoji: '', color: '#111827' };
const ITEMS = [ALL, ...CATEGORIES];

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.94)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,0,0,0.07)',
      boxShadow: '0 1px 12px rgba(0,0,0,0.07)',
      // Two-zone row: brand left | chips right (scrollable)
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      alignItems: 'center',
      height: 56,
      paddingLeft: 16,
    }}>

      {/* Brand — left, fixed, never scrolls */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        paddingRight: 14,
        borderRight: '1px solid rgba(0,0,0,0.08)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 18, lineHeight: 1 }}>📍</span>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 15,
          fontWeight: 800,
          color: '#111827',
          letterSpacing: '-0.03em',
          whiteSpace: 'nowrap',
        }}>PinIt</span>
      </div>

      {/* Filter chips — right zone, horizontally scrollable */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        padding: '0 14px',
        height: '100%',
      }}>
        <LayoutGroup>
          {ITEMS.map((cat) => {
            const isActive = active === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => onChange(cat.id)}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 13px',
                  borderRadius: 999,
                  border: 'none',
                  background: 'transparent',
                  color: isActive ? 'white' : '#6b7280',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  whiteSpace: 'nowrap',
                  zIndex: 1,
                  letterSpacing: '-0.01em',
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
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                {cat.emoji && <span style={{ fontSize: 13 }}>{cat.emoji}</span>}
                <span>{cat.label}</span>
              </motion.button>
            );
          })}
        </LayoutGroup>
      </div>
    </div>
  );
}
