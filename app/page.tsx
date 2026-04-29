'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import FilterBar from '@/components/FilterBar';
import ReportModal from '@/components/ReportModal';
import Toast from '@/components/Toast';
import BottomBar from '@/components/BottomBar';
import { Report } from '@/types/report';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <MapLoader />,
});

function MapLoader() {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc',
      gap: 14, fontFamily: 'Inter, sans-serif',
    }}>
      <div className="animate-bounce-in" style={{ fontSize: 48 }}>📍</div>
      <div style={{ fontWeight: 800, fontSize: 20, color: '#0f172a', letterSpacing: '-0.04em' }}>PinIt Mumbai</div>
      <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>Loading map...</div>
      <div style={{
        marginTop: 6, width: 28, height: 28,
        border: '2.5px solid #e5e7eb', borderTopColor: '#EF4444',
        borderRadius: '50%',
      }} className="animate-spin" />
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
    }
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100vw', height: '100dvh',
      overflow: 'hidden', fontFamily: 'Inter, sans-serif',
    }}>
      {/* ── Fixed top header ── */}
      <div style={{ flexShrink: 0, zIndex: 1000, position: 'relative' }}>
        <FilterBar
          active={activeCategory}
          onChange={setActiveCategory}
          totalReports={reports.length}
          todayCount={todayCount}
          onOpenModal={() => setIsModalOpen(true)}
        />
      </div>

      {/* ── Map fills remaining space ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Map
          reports={reports}
          activeCategory={activeCategory}
          showHeatmap={showHeatmap}
          onNewReport={handleNewReport}
          totalReports={reports.length}
        />
      </div>

      {/* ── Bottom bar ── */}
      <BottomBar
        totalReports={reports.length}
        onReport={() => setIsModalOpen(true)}
      />

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
    </div>
  );
}
