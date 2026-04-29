'use client';

import { motion, LayoutGroup } from 'framer-motion';
import { CATEGORIES } from '@/lib/categories';

interface FilterBarProps {
  active: string;
  onChange: (id: string) => void;
  totalReports: number;
  todayCount: number;
  onOpenModal: () => void;
}

const ALL = { id: 'all', label: 'All', emoji: '', color: '#0f172a' };
const ITEMS = [ALL, ...CATEGORIES];

export default function FilterBar({ active, onChange, totalReports, todayCount, onOpenModal }: FilterBarProps) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: 'white' }}>

      {/* ━━ Row 1: Wordmark + social icon ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px', height: 56,
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{
            fontSize: 22, fontWeight: 800, color: '#0f172a',
            letterSpacing: '-0.05em', lineHeight: 1,
          }}>PinIt</span>

          <motion.span
            whileHover="hover" initial="rest"
            style={{
              fontSize: 22, fontWeight: 300,
              letterSpacing: '-0.035em', lineHeight: 1,
              marginLeft: 7, position: 'relative',
              cursor: 'default', display: 'inline-block',
            }}
          >
            <motion.span
              variants={{ rest: { color: '#004BA0' }, hover: { color: '#0066CC' } }}
              transition={{ duration: 0.18 }}
              style={{ position: 'relative', zIndex: 1 }}
            >Mumbai</motion.span>
            <motion.span
              variants={{ rest: { scaleX: 0, opacity: 0 }, hover: { scaleX: 1, opacity: 1 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              style={{
                position: 'absolute', bottom: -2, left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, #004BA0, #0099FF, #004BA0)',
                borderRadius: 999, transformOrigin: 'left', display: 'block',
              }}
            />
            <motion.span
              variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
              transition={{ duration: 0.22 }}
              style={{
                position: 'absolute', inset: '-4px -6px',
                background: 'rgba(0,75,160,0.07)',
                borderRadius: 6, zIndex: 0, display: 'block',
              }}
            />
          </motion.span>

          <span style={{
            fontSize: 11, fontWeight: 500, color: '#94a3b8',
            letterSpacing: '0.01em', marginLeft: 8, alignSelf: 'center',
          }}>v1.0</span>
        </div>

        {/* Right icon */}
        <button style={{
          width: 34, height: 34, borderRadius: '50%',
          border: '1.5px solid #e5e7eb', background: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 15, color: '#374151',
        }}>📸</button>
      </div>

      {/* ━━ Row 2: Announcement banner ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{
        background: '#fef3c7',
        borderBottom: '1px solid #fde68a',
        padding: '8px 20px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>📣</span>
          <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>
            Help fix Mumbai —{' '}
            <span style={{ color: '#b45309', fontWeight: 700 }}>drop a pin, change the city</span>
          </span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(239,68,68,0.08)', border: '1px solid #fca5a5',
          borderRadius: 999, padding: '3px 9px', flexShrink: 0,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#ef4444', display: 'inline-block',
          }} className="animate-pulse-dot" />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#ef4444' }}>
            {totalReports} live
          </span>
        </div>
      </div>

      {/* ━━ Row 3: Category filter chips ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '7px 16px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        gap: 8,
      }}>
        {/* Chips — scrollable left side */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          overflowX: 'auto', scrollbarWidth: 'none', flex: 1,
        }}>
          <LayoutGroup>
            {ITEMS.map((cat) => {
              const isActive = active === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => onChange(cat.id)}
                  whileTap={{ scale: 0.88 }}
                  style={{
                    position: 'relative', flexShrink: 0,
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '5px 13px', borderRadius: 999,
                    border: isActive ? 'none' : '1px solid #e5e7eb',
                    background: 'transparent',
                    color: isActive ? 'white' : '#64748b',
                    fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'nowrap', zIndex: 1,
                    letterSpacing: '-0.005em',
                    transition: 'color 150ms ease, border-color 150ms ease',
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="filter-pill"
                      style={{
                        position: 'absolute', inset: 0, borderRadius: 999,
                        background: cat.id === 'all' ? '#0f172a' : cat.color,
                        zIndex: -1,
                      }}
                      transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                    />
                  )}
                  {cat.emoji && <span style={{ fontSize: 12, lineHeight: 1 }}>{cat.emoji}</span>}
                  <span>{cat.label}</span>
                </motion.button>
              );
            })}
          </LayoutGroup>
        </div>

        {/* Map / List toggle — right side (Map only for now) */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 1,
          border: '1px solid #e5e7eb', borderRadius: 8,
          overflow: 'hidden', flexShrink: 0,
        }}>
          <button style={{
            padding: '5px 14px', fontSize: 12, fontWeight: 700,
            background: '#0f172a', color: 'white', border: 'none',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>Map</button>
          <button style={{
            padding: '5px 14px', fontSize: 12, fontWeight: 600,
            background: 'white', color: '#6b7280', border: 'none',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            borderLeft: '1px solid #e5e7eb',
          }}>List</button>
        </div>
      </div>
    </div>
  );
}
