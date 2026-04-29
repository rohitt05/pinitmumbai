'use client';

import { motion } from 'framer-motion';

interface StatsCardProps {
  totalReports: number;
  activeReports: number;
}

export default function StatsCard({ totalReports, activeReports }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 500,
        background: 'white',
        borderRadius: 12,
        padding: '12px 18px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
        border: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: 'Inter, sans-serif',
        minWidth: 210,
      }}
    >
      {/* Active */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{
          fontSize: 22, fontWeight: 800,
          color: '#ef4444', letterSpacing: '-0.04em', lineHeight: 1,
        }}>
          {activeReports.toLocaleString()}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 600, color: '#9ca3af',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>Active</span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 32, background: '#f3f4f6' }} />

      {/* Total */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{
          fontSize: 22, fontWeight: 800,
          color: '#f97316', letterSpacing: '-0.04em', lineHeight: 1,
        }}>
          {totalReports.toLocaleString()}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 600, color: '#9ca3af',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>Reports</span>
      </div>
    </motion.div>
  );
}
