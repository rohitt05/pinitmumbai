'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaInfo } from './Map';
import { getPrabhagsByAdminWard, getPartyStyle } from '@/lib/mumbai-wards';

interface StatsCardProps {
  totalReports: number;
  activeReports: number;
  navbarHeight: number;
  hoveredArea: AreaInfo | null;
}

function WardCard({ top, area }: { top: number; area: AreaInfo }) {
  const isConstituency = area.zone === 'Assembly Constituency';
  const prabhags = isConstituency ? [] : getPrabhagsByAdminWard(area.ward);

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
        position: 'fixed',
        top,
        left: 16,
        width: 248,
        zIndex: 900,
        background: 'white',
        borderRadius: 14,
        boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
        border: '1px solid rgba(0,0,0,0.06)',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
        maxHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Header strip ── */}
      <div style={{
        background: isConstituency
          ? 'linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)'
          : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '10px 14px 9px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: 10, fontWeight: 800,
            color: isConstituency ? '#c4b5fd' : '#ef4444',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            {isConstituency ? `AC ${area.ac_no ?? ''}` : `BMC Ward ${area.ward}`}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, color: '#64748b', letterSpacing: '0.04em',
          }}>{area.zone}</span>
        </div>
        <div style={{
          fontSize: 14, fontWeight: 800, color: 'white',
          letterSpacing: '-0.02em', marginTop: 3, lineHeight: 1.2,
        }}>{area.name}</div>
        {!isConstituency && (
          <div style={{
            fontSize: 10, color: '#94a3b8', marginTop: 2,
            fontWeight: 500, lineHeight: 1.4,
          }}>{area.direction} Mumbai</div>
        )}
        {isConstituency && area.pc_name && (
          <div style={{
            fontSize: 10, color: '#c4b5fd', marginTop: 2,
            fontWeight: 500, lineHeight: 1.4,
          }}>Part of {area.pc_name} PC</div>
        )}
      </div>

      {/* ── Neighbourhoods ── */}
      {!isConstituency && (
        <div style={{ padding: '8px 14px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
          <div style={{
            fontSize: 9, fontWeight: 700, color: '#94a3b8',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3,
          }}>Covers</div>
          <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.5, fontWeight: 500 }}>
            {area.neighbourhoods}
          </div>
        </div>
      )}

      {/* ── Stats row ── */}
      <div style={{
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: prabhags.length > 0 ? '1px solid #f1f5f9' : 'none',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{
            fontSize: 24, fontWeight: 800, color: '#ef4444',
            letterSpacing: '-0.04em', lineHeight: 1,
          }}>{area.count}</span>
          <span style={{
            fontSize: 9, fontWeight: 700, color: '#94a3b8',
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>Reports</span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: ic, background: `${ic}18`,
          padding: '5px 12px', borderRadius: 999,
          border: `1px solid ${ic}30`,
        }}>{intensity}</span>
      </div>

      {/* ── Nagar Sevak / Prabhag list ── */}
      {prabhags.length > 0 && (
        <div style={{ overflowY: 'auto', flexGrow: 1 }}>
          <div style={{
            padding: '7px 14px 4px',
            fontSize: 9, fontWeight: 800, color: '#94a3b8',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            position: 'sticky', top: 0, background: 'white',
            borderBottom: '1px solid #f8fafc',
          }}>
            Nagar Sevaks · {prabhags.length} Prabhags
          </div>

          {prabhags.map((p) => {
            const ps = getPartyStyle(p.party);
            return (
              <div
                key={p.ward_no}
                style={{
                  padding: '7px 14px',
                  borderBottom: '1px solid #f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {/* Ward number badge */}
                <div style={{
                  minWidth: 28, height: 28,
                  borderRadius: '50%',
                  background: '#7f1d1d',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  letterSpacing: '-0.02em',
                }}>
                  {p.ward_no}
                </div>

                {/* Nagar Sevak info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: '#1e293b',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    lineHeight: 1.3,
                  }}>
                    {p.candidate}
                  </div>
                  <div style={{
                    fontSize: 10, color: '#94a3b8', marginTop: 1, fontWeight: 500,
                  }}>
                    Ward {p.ward_no}
                  </div>
                </div>

                {/* Party badge */}
                <span style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: ps.text,
                  background: ps.bg,
                  border: `1px solid ${ps.border}`,
                  borderRadius: 4,
                  padding: '2px 5px',
                  flexShrink: 0,
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                }}>
                  {p.party}
                </span>
              </div>
            );
          })}
        </div>
      )}
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
      {/* Stats card */}
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
          width: 248,
          background: 'white',
          borderRadius: 14,
          padding: '13px 18px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.11)',
          border: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontFamily: 'Inter, sans-serif',
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

      {/* Ward hover card */}
      <AnimatePresence>
        {hoveredArea && wardTop > 0 && (
          <WardCard key={hoveredArea.ward + hoveredArea.name} top={wardTop} area={hoveredArea} />
        )}
      </AnimatePresence>
    </>
  );
}
