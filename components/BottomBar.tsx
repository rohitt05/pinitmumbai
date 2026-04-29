'use client';

import { motion } from 'framer-motion';

interface BottomBarProps {
  totalReports: number;
  onReport: () => void;
}

export default function BottomBar({ totalReports, onReport }: BottomBarProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 1000,
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: 60,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.22)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Left: report count */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{
          fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)',
          letterSpacing: '-0.01em',
        }}>📍</span>
        <span style={{
          fontSize: 13, fontWeight: 700,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '-0.01em',
        }}>{totalReports.toLocaleString()}</span>
      </div>

      {/* Center: Report button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={onReport}
        style={{
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          color: 'white',
          border: 'none',
          borderRadius: 999,
          padding: '11px 32px',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          letterSpacing: '-0.01em',
          fontFamily: 'Inter, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 2px 16px rgba(239,68,68,0.45)',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <span style={{ fontSize: 15 }}>📍</span>
        Report an Issue
      </motion.button>

      {/* Right: heatmap toggle icon */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        style={{
          width: 34, height: 34,
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.07)',
          color: 'rgba(255,255,255,0.6)',
          fontSize: 16,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title="Toggle heatmap"
      >
        🔥
      </motion.button>
    </div>
  );
}
