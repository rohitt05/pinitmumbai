'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Report } from '@/types/report';
import { getCategoryById } from '@/lib/categories';
import {
  getPrabhagsByAdminWard,
  getMlaByConstituency,
  getPartyStyle,
  MUMBAI_SUBURBAN_MLAS,
} from '@/lib/mumbai-wards';

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getDaysOld(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

// Maps BMC_WARD_INFO keys → assembly constituency name for MLA lookup
// We use a lightweight keyword per ward to fuzzy-match MUMBAI_SUBURBAN_MLAS
const WARD_TO_CONSTITUENCY_HINT: Record<string, string> = {
  'A':   'Colaba',        'B':   'Byculla',       'C':   'Mumbadevi',
  'D':   'Malabar Hill',  'E':   'Byculla',       'F/N': 'Sion Koliwada',
  'F/S': 'Worli',         'G/N': 'Mahim',         'G/S': 'Worli',
  'H/E': 'Vandre East',   'H/W': 'Vandre West',   'K/E': 'Andheri East',
  'K/W': 'Andheri West',  'P/N': 'Kandivali East','P/S': 'Malad West',
  'R/C': 'Charkop',       'R/N': 'Borivali',      'R/S': 'Dahisar',
  'L':   'Kurla',         'M/E': 'Mankhurd Shivaji Nagar', 'M/W': 'Chembur',
  'N':   'Ghatkopar East','S':   'Vikhroli',      'T':   'Mulund',
};

interface Props {
  report: Report | null;
  onClose: () => void;
}

export default function ReportBottomSheet({ report, onClose }: Props) {
  const [voted, setVoted] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (report) {
      setVoted(false);
      setUpvotes(report.upvotes);
      scrollRef.current?.scrollTo({ top: 0 });
    }
  }, [report]);

  const cat = report ? getCategoryById(report.category) : null;
  const severity = !report ? 'LOW' : report.upvotes > 10 ? 'HIGH' : report.upvotes > 4 ? 'MODERATE' : 'LOW';
  const severityColor = severity === 'HIGH' ? '#ef4444' : severity === 'MODERATE' ? '#f97316' : '#22c55e';
  const severityBg    = severity === 'HIGH' ? '#fef2f2' : severity === 'MODERATE' ? '#fff7ed' : '#f0fdf4';
  const severityBorder= severity === 'HIGH' ? '#fecaca' : severity === 'MODERATE' ? '#fed7aa' : '#bbf7d0';

  // ── Real reps lookup ──────────────────────────────────────────────────────
  // admin_ward key: report.ward_key if present, else derive from area_name
  const adminWard: string = (report as Report & { ward_key?: string })?.ward_key ?? '';
  const prabhags = adminWard ? getPrabhagsByAdminWard(adminWard) : [];
  const constituencyHint = WARD_TO_CONSTITUENCY_HINT[adminWard] ?? '';
  const mlaInfo = constituencyHint
    ? getMlaByConstituency(constituencyHint)
    : MUMBAI_SUBURBAN_MLAS.find(() => false); // undefined if no hint

  const handleUpvote = async () => {
    if (voted || !report) return;
    setVoted(true);
    setUpvotes((v) => v + 1);
    await fetch('/api/upvote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: report.id }),
    });
  };

  return (
    <AnimatePresence>
      {report && (
        <>
          {/* Scrim */}
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 1100,
              background: 'rgba(0,0,0,0.35)',
            }}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 380 }}
            style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              zIndex: 1200,
              background: 'white',
              borderRadius: '20px 20px 0 0',
              maxHeight: '88dvh',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Inter, -apple-system, sans-serif',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
            }}
          >
            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 4, flexShrink: 0 }}>
              <div style={{ width: 36, height: 4, borderRadius: 99, background: '#e2e8f0' }} />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: 14, right: 14,
                background: '#f1f5f9', border: 'none',
                borderRadius: '50%', width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 14, color: '#64748b', zIndex: 10,
              }}
            >✕</button>

            {/* Scrollable content */}
            <div ref={scrollRef} style={{ overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>

              {/* ── LAYER 1: Above the fold ─────────────────────────── */}
              <div style={{ padding: '6px 16px 0' }}>
                {/* Chips */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                  <span style={{
                    background: severityBg, color: severityColor, border: `1px solid ${severityBorder}`,
                    padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: severityColor, display: 'inline-block' }} />
                    {severity}
                  </span>
                  <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>Unresolved</span>
                </div>

                {/* Title */}
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 4 }}>
                  {report.area_name ?? cat?.label ?? 'Report'}
                </div>
                {report.area_name && (
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>📍</span> {report.area_name}
                  </div>
                )}

                {/* Photo */}
                <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', marginBottom: 12 }}>
                  <img src={report.photo_url} alt="" style={{ width: '100%', height: 210, objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
                    <span style={{ background: cat?.color ?? '#374151', color: 'white', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {cat?.emoji} {cat?.label ?? report.category}
                    </span>
                  </div>
                  <button
                    onClick={handleUpvote}
                    style={{
                      position: 'absolute', bottom: 10, right: 10,
                      background: voted ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.92)',
                      border: 'none', borderRadius: 999, padding: '6px 12px',
                      fontSize: 12, fontWeight: 700, cursor: voted ? 'default' : 'pointer',
                      color: voted ? '#ef4444' : '#1f2937', fontFamily: 'Inter, sans-serif',
                      display: 'flex', alignItems: 'center', gap: 5,
                      boxShadow: '0 1px 6px rgba(0,0,0,0.18)', transition: 'all 0.15s',
                    }}
                  >
                    👍 {voted ? `I've seen this (${upvotes})` : "I've seen this"}
                  </button>
                </div>

                {/* 3 stat tiles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
                  {[
                    { value: '1', label: 'Reports', color: '#ef4444' },
                    { value: String(getDaysOld(report.created_at)), label: 'Days Old', color: '#f97316' },
                    { value: cat?.label ?? report.category, label: 'Type', color: '#7c3aed' },
                  ].map((tile) => (
                    <div key={tile.label} style={{ background: '#f8fafc', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: tile.label === 'Type' ? 11 : 18, fontWeight: 800, color: tile.color, lineHeight: 1.1, marginBottom: 3 }}>{tile.value}</div>
                      <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{tile.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── LAYER 2: Nagar Sevaks ───────────────────────────────── */}
              <div style={{ borderTop: '1px solid #f1f5f9', padding: '18px 16px 0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>
                  Nagar Sevaks — Ward {adminWard || 'Unknown'}
                </div>

                {prabhags.length === 0 ? (
                  <div style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', padding: '12px 0 20px', fontStyle: 'italic' }}>
                    Prabhag data unavailable for this pin location
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                    {prabhags.map((p) => {
                      const ps = getPartyStyle(p.party);
                      return (
                        <div key={p.ward_no} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          background: '#f8fafc', borderRadius: 12, padding: '10px 14px',
                          border: '1px solid #f1f5f9',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {/* Avatar */}
                            <div style={{
                              width: 36, height: 36, borderRadius: '50%',
                              background: ps.bg, border: `1px solid ${ps.border}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 16, flexShrink: 0,
                            }}>👤</div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{p.candidate}</div>
                              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>Prabhag {p.ward_no} · Nagar Sevak</div>
                            </div>
                          </div>
                          <span style={{
                            fontSize: 9, fontWeight: 800,
                            background: ps.bg, color: ps.text, border: `1px solid ${ps.border}`,
                            borderRadius: 6, padding: '3px 7px', whiteSpace: 'nowrap', flexShrink: 0,
                          }}>{p.party}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── LAYER 3: MLA ──────────────────────────────────────────── */}
              <div style={{ borderTop: '1px solid #f1f5f9', padding: '18px 16px 0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>
                  MLA — Assembly Representative
                </div>

                {mlaInfo ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#f8fafc', borderRadius: 12, padding: '12px 14px',
                    border: '1px solid #f1f5f9', marginBottom: 20,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {(() => {
                        const ps = getPartyStyle(mlaInfo.party);
                        return (
                          <>
                            <div style={{
                              width: 40, height: 40, borderRadius: '50%',
                              background: ps.bg, border: `1px solid ${ps.border}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 18, flexShrink: 0,
                            }}>👤</div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{mlaInfo.mla_name}</div>
                              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, marginTop: 1 }}>{mlaInfo.constituency}</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    {(() => {
                      const ps = getPartyStyle(mlaInfo.party);
                      return (
                        <span style={{
                          fontSize: 9, fontWeight: 800,
                          background: ps.bg, color: ps.text, border: `1px solid ${ps.border}`,
                          borderRadius: 6, padding: '3px 7px', whiteSpace: 'nowrap', flexShrink: 0,
                        }}>{mlaInfo.party}</span>
                      );
                    })()}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', padding: '12px 0 20px', fontStyle: 'italic' }}>
                    MLA data unavailable for this area
                  </div>
                )}
              </div>

              {/* ── LAYER 4: BMC Accountability chain ────────────────────── */}
              <div style={{ borderTop: '1px solid #f1f5f9', padding: '18px 16px 0' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>
                  BMC Accountability Chain
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, marginBottom: 24 }}>
                  <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 12, padding: '8px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: '#ef4444', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Ward {adminWard || '—'}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#991b1b' }}>{report.area_name ?? 'Mumbai'}</div>
                  </div>
                  <div style={{ width: 1.5, height: 16, background: '#e2e8f0' }} />
                  <OrgNode abbr="BMC" label="BMC Commissioner" sub="Brihanmumbai Municipal Corporation" color="#dbeafe" textColor="#1d4ed8" />
                  <div style={{ width: 1.5, height: 16, background: '#e2e8f0' }} />
                  <OrgNode abbr="AC" label="Additional Commissioner" sub="Solid Waste Management Head" color="#dbeafe" textColor="#1d4ed8" />
                  <div style={{ width: 1.5, height: 16, background: '#e2e8f0' }} />
                  <OrgNode abbr="AE" label="Assistant Engineer" sub={`Ward ${adminWard} · Monitors complaints`} color="#dbeafe" textColor="#1d4ed8" />
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '0 16px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 20 }}>
                  Reported <strong style={{ color: '#475569' }}>{getTimeAgo(report.created_at)}</strong>
                  {' '}· 1 citizen(s) reported
                  {' '}· {getDaysOld(report.created_at)}d unresolved
                </div>
              </div>

              {/* ── CTAs ──────────────────────────────────────────────────────── */}
              <div style={{ borderTop: '1px solid #f1f5f9', padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button style={{
                  background: '#16a34a', color: 'white', border: 'none',
                  borderRadius: 14, padding: '15px 20px', fontSize: 15, fontWeight: 800,
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  letterSpacing: '-0.01em',
                }}>
                  💬 File BMC Complaint
                </button>
                <button style={{
                  background: 'white', color: '#374151', border: '1.5px solid #e2e8f0',
                  borderRadius: 14, padding: '13px 20px', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  ✅ It is Cleaned Up — Verify
                </button>
                <div style={{ textAlign: 'center', fontSize: 11, color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  🛡️ All reports are anonymous
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function OrgNode({ abbr, label, sub, color, textColor }: {
  abbr: string; label: string; sub: string; color: string; textColor: string;
}) {
  return (
    <div style={{ background: color, borderRadius: 12, padding: '8px 14px', textAlign: 'center', minWidth: 160 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 5px', fontSize: abbr.length > 2 ? 14 : 11, fontWeight: 800, color: textColor, letterSpacing: '0.04em' }}>{abbr}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>{label}</div>
      <div style={{ fontSize: 9, color: '#64748b', marginTop: 1 }}>{sub}</div>
    </div>
  );
}
