'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FilterBar from '@/components/FilterBar';
import ReportModal from '@/components/ReportModal';
import Toast from '@/components/Toast';
import { Report } from '@/types/report';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <MapLoader />,
});

function MapLoader() {
  return (
    <div style={{
      width: '100vw', height: '100dvh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      gap: 16, fontFamily: 'Inter, sans-serif',
    }}>
      <div className="animate-bounce-in" style={{ fontSize: 52 }}>📍</div>
      <div style={{ fontWeight: 700, fontSize: 22, color: '#111827', letterSpacing: '-0.02em' }}>PinIt Mumbai</div>
      <div style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>Loading map...</div>
      <div style={{ marginTop: 8, width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#EF4444', borderRadius: '50%' }} className="animate-spin" />
    </div>
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [newPing, setNewPing] = useState(false);

  useEffect(() => {
    fetch('/api/reports')
      .then((r) => r.json())
      .then((data) => {
        const list: Report[] = data.reports ?? [];
        setReports(list);
        const today = new Date().toDateString();
        setTodayCount(list.filter((r) => new Date(r.created_at).toDateString() === today).length);
      })
      .catch(console.error);
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleNewReport = useCallback((report: Report) => {
    setReports((prev) => [report, ...prev]);
    const today = new Date().toDateString();
    if (new Date(report.created_at).toDateString() === today) {
      setTodayCount((c) => c + 1);
      setNewPing(true);
      setTimeout(() => setNewPing(false), 2000);
    }
  }, []);

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}>
      <Map
        reports={reports}
        activeCategory={activeCategory}
        showHeatmap={showHeatmap}
        onNewReport={handleNewReport}
      />

      {/* FilterBar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <FilterBar active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Top-right controls */}
      <div style={{
        position: 'fixed', top: 68, right: 12, zIndex: 1000,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => setShowHeatmap((v) => !v)}
          style={{
            width: 42, height: 42, borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.08)',
            background: showHeatmap ? '#EF4444' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            color: showHeatmap ? 'white' : '#374151',
            fontSize: 18, cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          title={showHeatmap ? 'Hide hotspots' : 'Show hotspots'}
        >
          🔥
        </motion.button>
      </div>

      {/* Live counter */}
      <AnimatePresence>
        <motion.div
          key={todayCount}
          initial={{ scale: newPing ? 1.2 : 1, y: 0 }}
          animate={{ scale: 1, y: 0 }}
          style={{
            position: 'fixed', bottom: 108, left: 16, zIndex: 1000,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            borderRadius: 999,
            padding: '7px 14px',
            fontSize: 12, fontWeight: 600,
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', gap: 7,
            border: '1px solid rgba(0,0,0,0.06)',
            fontFamily: 'Inter, sans-serif',
            color: '#374151',
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#EF4444', display: 'inline-block',
            flexShrink: 0,
          }} className="animate-pulse-dot" />
          <span>Live · <strong>{todayCount}</strong> today</span>
        </motion.div>
      </AnimatePresence>

      {/* Report FAB */}
      <div style={{ position: 'fixed', bottom: 32, right: 20, zIndex: 1000 }}>
        {/* Ping ring */}
        <span style={{
          position: 'absolute', inset: 0,
          borderRadius: 999,
          background: '#EF4444',
          opacity: 0.3,
        }} className="animate-ping" />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            color: 'white', border: 'none', borderRadius: 999,
            padding: '14px 26px',
            fontSize: 15, fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(239,68,68,0.5), 0 1px 4px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.01em',
          }}
        >
          <span style={{ fontSize: 16 }}>📍</span>
          Report
        </motion.button>
      </div>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(report) => {
          handleNewReport(report);
          showToast('✅ Report is live on the map!', 'success');
        }}
        onError={() => showToast('❌ Something went wrong. Try again.', 'error')}
      />

      <AnimatePresence>
        {toast && (
          <Toast
            key={toast.message}
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
