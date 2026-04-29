'use client';

import { motion } from 'framer-motion';

interface HeaderProps {
  totalReports: number;
  activeReports: number;
}

export default function Header({ totalReports, activeReports }: HeaderProps) {
  return (
    <div
      style={{
        background: 'white',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* ── Main header row ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          height: 56,
        }}
      >
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.05em',
              lineHeight: 1,
            }}
          >
            PinIt
          </span>
          <motion.span
            whileHover="hover"
            initial="rest"
            style={{
              fontSize: 22,
              fontWeight: 300,
              letterSpacing: '-0.035em',
              lineHeight: 1,
              marginLeft: 7,
              position: 'relative',
              cursor: 'default',
              display: 'inline-block',
            }}
          >
            <motion.span
              variants={{
                rest: { color: '#004BA0' },
                hover: { color: '#0066CC' },
              }}
              transition={{ duration: 0.18 }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              Mumbai
            </motion.span>
            {/* shimmer underline */}
            <motion.span
              variants={{
                rest: { scaleX: 0, opacity: 0 },
                hover: { scaleX: 1, opacity: 1 },
              }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              style={{
                position: 'absolute', bottom: -2, left: 0, right: 0,
                height: 2,
                background: 'linear-gradient(90deg, #004BA0, #0099FF, #004BA0)',
                borderRadius: 999, transformOrigin: 'left', display: 'block',
              }}
            />
            {/* glow */}
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
          {/* version */}
          <span
            style={{
              fontSize: 11, fontWeight: 500, color: '#94a3b8',
              letterSpacing: '0.01em', marginLeft: 8, alignSelf: 'center',
            }}
          >
            v1.0
          </span>
        </div>

        {/* Right — Instagram icon placeholder */}
        <button
          style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '1.5px solid #e5e7eb',
            background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 16,
          }}
          title="Follow us"
        >
          📸
        </button>
      </div>

      {/* ── Banner ── */}
      <div
        style={{
          background: '#fff7ed',
          borderTop: '1px solid #fed7aa',
          borderBottom: '1px solid #fed7aa',
          padding: '9px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13 }}>📣</span>
          <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>
            Help fix Mumbai —{' '}
            <span style={{ color: '#ea580c', fontWeight: 700 }}>report a civic issue near you</span>
          </span>
        </div>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#fff1f2', border: '1px solid #fecdd3',
            borderRadius: 999, padding: '3px 10px', flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#ef4444', display: 'inline-block',
            }}
            className="animate-pulse-dot"
          />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#ef4444' }}>
            {totalReports} live
          </span>
        </div>
      </div>

      {/* ── Filter row ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: '1px solid rgba(0,0,0,0.055)',
          gap: 8,
        }}
      >
        {/* Category chips — scrollable */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            overflowX: 'auto', scrollbarWidth: 'none', flex: 1,
          }}
        >
          {/* rendered by parent via children prop */}
        </div>
      </div>
    </div>
  );
}
