'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaInfo } from './Map';

interface StatsCardProps {
  totalReports: number;
  activeReports: number;
  navbarHeight: number;
  hoveredArea: AreaInfo | null;
}

function WardCard({ top, area }: { top: number; area: AreaInfo }) {
  const isAC = area.zone === 'Assembly Constituency';

  const count = area.count;
  const ic =
    count === 0 ? '#94a3b8' :
    count < 3   ? '#22c55e' :
    count < 8   ? '#f97316' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top,
        left: 16,
        width: 220,
        zIndex: 900,
        background: 'white',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        border: '1px solid rgba(0,0,0,0.06)',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{
        background: isAC
          ? 'linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)'
          : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '12px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{
            fontSize: 9, fontWeight: 800,
            color: isAC ? '#c4b5fd' : '#ef4444',
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            {isAC ? `AC ${area.ac_no ?? ''}` : `Ward ${area.ward}`}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 800,
            color: ic, background: `${ic}22`,
            padding: '2px 8px', borderRadius: 999,
            border: `1px solid ${ic}44`,
          }}>
            {count} {count === 1 ? 'report' : 'reports'}
          </span>
        </div>
        <div style={{
          fontSize: 15, fontWeight: 800, color: 'white',
          letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 3,
        }}>{area.name}</div>
        <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>
          {isAC
            ? area.pc_name ? `Part of ${area.pc_name} PC` : 'Assembly Constituency'
            : `${area.zone} · ${area.direction} Mumbai`
          }
        </div>
        {!isAC && (
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 4, fontWeight: 500, lineHeight: 1.4 }}>
            {area.neighbourhoods}
          </div>
        )}
      </div>

      {/* Intensity bar */}
      <div style={{ height: 3, background: `linear-gradient(to right, ${ic}, ${ic}44)`, opacity: 0.7 }} />
    </motion.div>
  );
}

export default function StatsCard({ totalReports, activeReports, navbarHeight, hoveredArea }: StatsCardProps) {
  const statsRef = useRef<HTMLDivElement>(null);
  const [wardTop, setWardTop] = useState(0);

  useEffect(() => {
    if (!statsRef.current) return;
    const update = () => {
      const rect = statsRef.current!.getBoundingClientRect();
      setWardTop(rect.bottom + 10);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(statsRef.current);
    return () => ro.disconnect();
  }, [navbarHeight]);

  return (
    <>
      {/* Stats pill */}
      <motion.div
        ref={statsRef}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: navbarHeight + 16,
          left: 16,
          zIndex: 900,
          background: 'white',
          borderRadius: 14,
          padding: '11px 16px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.11)',
          border: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#ef4444', letterSpacing: '-0.04em', lineHeight: 1 }}>
            {activeReports.toLocaleString()}
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active</span>
        </div>
        <div style={{ width: 1, height: 28, background: '#f3f4f6' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#f97316', letterSpacing: '-0.04em', lineHeight: 1 }}>
            {totalReports.toLocaleString()}
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reports</span>
        </div>
      </motion.div>

      {/* Ward hover card */}
      <AnimatePresence>
        {hoveredArea && wardTop > 0 && (
          <WardCard key={hoveredArea.ward + hoveredArea.name} top={wardTop} area={hoveredArea} />
        )}
      </AnimatePresence>
    </>
  );
}
