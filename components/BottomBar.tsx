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
        // No background — transparent, no bar
        background: 'transparent',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0 0 20px',
        height: 80,
        pointerEvents: 'none',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <motion.button
        whileHover={{ scale: 1.03, boxShadow: '0 6px 28px rgba(239,68,68,0.55)' }}
        whileTap={{ scale: 0.96 }}
        onClick={onReport}
        style={{
          pointerEvents: 'auto',
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          color: 'white',
          border: 'none',
          borderRadius: 14,
          padding: '14px 40px',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          letterSpacing: '-0.01em',
          fontFamily: 'Inter, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 4px 20px rgba(239,68,68,0.42)',
        }}
      >
        <span style={{ fontSize: 16 }}>📍</span>
        Report an Issue
      </motion.button>
    </div>
  );
}
