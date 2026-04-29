'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaInfo } from './Map';
import { getPrabhagsByAdminWard, getPartyStyle, getMlaByConstituency } from '@/lib/mumbai-wards';

interface StatsCardProps {
  totalReports: number;
  activeReports: number;
  navbarHeight: number;
  hoveredArea: AreaInfo | null;
}

// ── Compact representative micro-tile ─────────────────────────────────
function RepTile({
  role,
  name,
  party,
  vacant,
}: {
  role: string;
  name?: string;
  party?: string;
  vacant?: boolean;
}) {
  const ps = party ? getPartyStyle(party) : null;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '7px 14px',
      borderBottom: '1px solid #f8fafc',
    }}>
      {/* Role dot */}
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: vacant ? '#f8fafc' : role === 'MLA' ? '#ede9fe' : role === 'MP' ? '#dbeafe' : '#fef2f2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        border: vacant ? '1px solid #e2e8f0' : '1px solid transparent',
      }}>
        <span style={{
          fontSize: 9, fontWeight: 800,
          color: vacant ? '#94a3b8' : role === 'MLA' ? '#7c3aed' : role === 'MP' ? '#2563eb' : '#991b1b',
          letterSpacing: '0.04em',
        }}>{role === 'Nagar Sevak' ? 'NS' : role}</span>
      </div>

      {/* Name + role */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 10, fontWeight: 600,
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          lineHeight: 1,
          marginBottom: 2,
        }}>{role}</div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: vacant ? '#94a3b8' : '#1e293b',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          lineHeight: 1.2, fontStyle: vacant ? 'italic' : 'normal',
        }}>
          {vacant ? 'Vacant' : name}
        </div>
      </div>

      {/* Party badge */}
      {ps && !vacant && (
        <span style={{
          fontSize: 9, fontWeight: 800,
          color: ps.text, background: ps.bg,
          border: `1px solid ${ps.border}`,
          borderRadius: 4, padding: '2px 6px',
          flexShrink: 0, letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}>{party}</span>
      )}
    </div>
  );
}

function WardCard({ top, area }: { top: number; area: AreaInfo }) {
  const isConstituency = area.zone === 'Assembly Constituency';

  // For AC: get MLA from data
  const mla = isConstituency ? getMlaByConstituency(area.name) : null;

  // For ward: get up to 3 nagar sevaks
  const prabhags = isConstituency ? [] : getPrabhagsByAdminWard(area.ward).slice(0, 3);

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
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top,
        left: 16,
        width: 240,
        zIndex: 900,
        background: 'white',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        border: '1px solid rgba(0,0,0,0.06)',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* ── Header ── */}
      <div style={{
        background: isConstituency
          ? 'linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)'
          : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '10px 14px 10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{
            fontSize: 9, fontWeight: 800,
            color: isConstituency ? '#c4b5fd' : '#ef4444',
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            {isConstituency ? `AC ${area.ac_no ?? ''}` : `Ward ${area.ward}`}
          </span>
          {/* Report count chip */}
          <span style={{
            fontSize: 10, fontWeight: 800,
            color: ic, background: `${ic}22`,
            padding: '2px 8px', borderRadius: 999,
            border: `1px solid ${ic}44`,
          }}>
            {area.count} {area.count === 1 ? 'report' : 'reports'}
          </span>
        </div>
        <div style={{
          fontSize: 15, fontWeight: 800, color: 'white',
          letterSpacing: '-0.02em', lineHeight: 1.2,
        }}>{area.name}</div>
        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3, fontWeight: 500 }}>
          {isConstituency
            ? area.pc_name ? `Part of ${area.pc_name} PC` : 'Assembly Constituency'
            : `${area.zone} · ${area.direction} Mumbai`
          }
        </div>
      </div>

      {/* ── Intensity bar ── */}
      <div style={{
        height: 3,
        background: `linear-gradient(to right, ${ic}, ${ic}44)`,
        opacity: 0.7,
      }} />

      {/* ── Representatives section ── */}
      <div style={{
        padding: '7px 14px 4px',
        fontSize: 9, fontWeight: 800, color: '#94a3b8',
        textTransform: 'uppercase', letterSpacing: '0.1em',
      }}>
        {isConstituency ? 'Elected Representative' : 'Nagar Sevaks'}
      </div>

      {isConstituency && (
        mla
          ? <RepTile role="MLA" name={mla.name} party={mla.party} />
          : <RepTile role="MLA" vacant />
      )}

      {!isConstituency && (
        prabhags.length > 0
          ? prabhags.map((p) => (
              <RepTile key={p.ward_no} role="Nagar Sevak" name={p.candidate} party={p.party} />
            ))
          : <RepTile role="Nagar Sevak" vacant />
      )}

      {/* Show more hint if more than 3 */}
      {!isConstituency && getPrabhagsByAdminWard(area.ward).length > 3 && (
        <div style={{
          padding: '5px 14px 8px',
          fontSize: 10, color: '#94a3b8', fontWeight: 500,
        }}>
          +{getPrabhagsByAdminWard(area.ward).length - 3} more nagar sevaks
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
      {/* ── Stats pill ── */}
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
          <span style={{
            fontSize: 20, fontWeight: 800, color: '#ef4444',
            letterSpacing: '-0.04em', lineHeight: 1,
          }}>{activeReports.toLocaleString()}</span>
          <span style={{
            fontSize: 9, fontWeight: 700, color: '#9ca3af',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>Active</span>
        </div>
        <div style={{ width: 1, height: 28, background: '#f3f4f6' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{
            fontSize: 20, fontWeight: 800, color: '#f97316',
            letterSpacing: '-0.04em', lineHeight: 1,
          }}>{totalReports.toLocaleString()}</span>
          <span style={{
            fontSize: 9, fontWeight: 700, color: '#9ca3af',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>Reports</span>
        </div>
      </motion.div>

      {/* ── Ward hover card ── */}
      <AnimatePresence>
        {hoveredArea && wardTop > 0 && (
          <WardCard key={hoveredArea.ward + hoveredArea.name} top={wardTop} area={hoveredArea} />
        )}
      </AnimatePresence>
    </>
  );
}
