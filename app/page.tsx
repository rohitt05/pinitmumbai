'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';
import FilterBar from '@/components/FilterBar';
import ReportModal from '@/components/ReportModal';
import { Report } from '@/types/report';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100vw', height: '100dvh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f3f4f6', flexDirection: 'column', gap: 12,
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ fontSize: 36 }}>📍</div>
      <div style={{ fontSize: 16, color: '#6b7280', fontWeight: 500 }}>Loading map...</div>
    </div>
  ),
});

interface Toast {
  message: string;
  type: 'success' | 'error';
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

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
    setTimeout(() => setToast(null), 3500);
  };

  const handleNewReport = useCallback((report: Report) => {
    setReports((prev) => [report, ...prev]);
    const today = new Date().toDateString();
    if (new Date(report.created_at).toDateString() === today) {
      setTodayCount((c) => c + 1);
    }
  }, []);

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}>
      {/* Full-screen map */}
      <Map
        reports={reports}
        activeCategory={activeCategory}
        showHeatmap={showHeatmap}
        onNewReport={handleNewReport}
      />

      {/* FilterBar — top */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <FilterBar active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Heatmap toggle — top right */}
      <button
        onClick={() => setShowHeatmap((v) => !v)}
        style={{
          position: 'fixed', top: 68, right: 12, zIndex: 1000,
          background: showHeatmap ? '#EF4444' : 'white',
          color: showHeatmap ? 'white' : '#374151',
          border: '1px solid #e5e7eb', borderRadius: 8,
          padding: '7px 12px', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        🔥 {showHeatmap ? 'Hide' : 'Hotspots'}
      </button>

      {/* Live counter — bottom left */}
      <div style={{
        position: 'fixed', bottom: 108, left: 16, zIndex: 1000,
        background: 'white', borderRadius: 999,
        padding: '6px 14px', fontSize: 13, fontWeight: 500,
        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: 'Inter, sans-serif',
      }}>
        <span style={{ color: '#EF4444', fontSize: 9 }}>●</span>
        Live · {todayCount} reports today
      </div>

      {/* Report button — bottom right */}
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'fixed', bottom: 32, right: 24, zIndex: 1000,
          background: '#EF4444', color: 'white',
          border: 'none', borderRadius: 999,
          padding: '16px 28px', fontSize: 17, fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(239,68,68,0.55)',
          fontFamily: 'Inter, sans-serif',
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        + Report
      </button>

      {/* Report Modal */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(report) => {
          handleNewReport(report);
          showToast('✅ Report submitted! It\'s live on the map.', 'success');
        }}
        onError={() => showToast('❌ Something went wrong. Try again.', 'error')}
      />

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 40, left: '50%',
          transform: 'translateX(-50%)', zIndex: 9999,
          background: toast.type === 'success' ? '#16a34a' : '#dc2626',
          color: 'white', padding: '12px 24px', borderRadius: 12,
          fontWeight: 600, fontSize: 14,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif',
        }}>
          {toast.message}
        </div>
      )}
    </main>
  );
}
