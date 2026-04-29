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
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(0,0,0,0.055)',
        boxShadow: '0 1px 16px rgba(0,0,0,0.06)',
      }}
    >
      {/* Top row: wordmark + live badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '13px 18px 0',
        }}
      >
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 21,
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.05em',
              lineHeight: 1,
            }}
          >
            PinIt
          </span>

          {/* "Mumbai" — Mumbai Indians blue with hover shimmer */}
          <motion.span
            whileHover="hover"
            initial="rest"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 21,
              fontWeight: 300,
              letterSpacing: '-0.035em',
              lineHeight: 1,
              marginLeft: 7,
              position: 'relative',
              cursor: 'default',
              display: 'inline-block',
            }}
          >
            {/* Base text */}
            <motion.span
              variants={{
                rest: { color: '#004BA0' },
                hover: { color: '#0066CC' },
              }}
              transition={{ duration: 0.2 }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              Mumbai
            </motion.span>

            {/* Shimmer underline slides in on hover */}
            <motion.span
              variants={{
                rest: { scaleX: 0, opacity: 0 },
                hover: { scaleX: 1, opacity: 1 },
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              style={{
                position: 'absolute',
                bottom: -2,
                left: 0,
                right: 0,
                height: 2,
                background: 'linear-gradient(90deg, #004BA0, #0099FF, #004BA0)',
                borderRadius: 999,
                transformOrigin: 'left',
                display: 'block',
              }}
            />

            {/* Soft glow behind on hover */}
            <motion.span
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1 },
              }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'absolute',
                inset: '-4px -6px',
                background: 'rgba(0, 75, 160, 0.08)',
                borderRadius: 6,
                zIndex: 0,
                display: 'block',
              }}
            />
          </motion.span>
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
            padding: '4px 11px',
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

      {/* Bottom row: filter chips */}
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
