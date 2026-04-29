'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AreaInfo } from './Map';

interface StatsCardProps {
  totalReports: number;
  activeReports: number;
  navbarHeight: number;
  hoveredArea: AreaInfo | null;
}

function WardCard({ area }: { area: AreaInfo }) {
  const intensity =
    area.count === 0 ? 'No issues' :
    area.count < 3  ? 'Low' :
    area.count < 8  ? 'Moderate' : 'High';
  const ic =
    area.count === 0 ? '#94a3b8' :
    area.count < 3  ? '#22c55e' :
    area.count < 8  ? '#f97316' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{
        background: 'white',
        borderRadius: 14,
        boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
        border: '1px solid rgba(0,0,0,0.06)',
        padding: '14px 16px',
        fontFamily: 'Inter, sans-serif',
        width: '100%',
      }}
    >
      <div style={{
        fontSize: 14, fontWeight: 800, color: '#0f172a',
        letterSpacing: '-0.03em', marginBottom: 2,
      }}>{area.name}</div>
      <div style={{
        fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 12,
      }}>Ward #{area.ward} &nbsp;·&nbsp; {area.direction}</div>

      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10, borderTop: '1px solid #f1f5f9',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{
            fontSize: 22, fontWeight: 800, color: '#ef4444',
            letterSpacing: '-0.04em', lineHeight: 1,
          }}>{area.count}</span>
          <span style={{
            fontSize: 10, fontWeight: 600, color: '#94a3b8',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>reports</span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: ic, background: `${ic}1a`,
          padding: '4px 10px', borderRadius: 999,
        }}>{intensity}</span>
      </div>
      <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 6 }}>
        {area.zone} Zone
      </div>
    </motion.div>
  );
}

export default function StatsCard({ totalReports, activeReports, navbarHeight, hoveredArea }: StatsCardProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: navbarHeight + 16,
        left: 16,
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width: 210,
        fontFamily: 'Inter, sans-serif',
        pointerEvents: 'none',
      }}
    >
      {/* Stats card */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35, ease: 'easeOut' }}
        style={{
          background: 'white',
          borderRadius: 14,
          padding: '13px 18px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.11)',
          border: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{
            fontSize: 22, fontWeight: 800, color: '#ef4444',
            letterSpacing: '-0.04em', lineHeight: 1,
          }}>{activeReports.toLocaleString()}</span>
          <span style={{
            fontSize: 10, fontWeight: 600, color: '#9ca3af',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>Active</span>
        </div>
        <div style={{ width: 1, height: 32, background: '#f3f4f6' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{
            fontSize: 22, fontWeight: 800, color: '#f97316',
            letterSpacing: '-0.04em', lineHeight: 1,
          }}>{totalReports.toLocaleString()}</span>
          <span style={{
            fontSize: 10, fontWeight: 600, color: '#9ca3af',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>Reports</span>
        </div>
      </motion.div>

      {/* Ward hover card — slides in below stats */}
      <AnimatePresence>
        {hoveredArea && <WardCard key={hoveredArea.name} area={hoveredArea} />}
      </AnimatePresence>
    </div>
  );
}
