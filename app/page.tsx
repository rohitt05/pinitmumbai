'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import FilterBar from '@/components/FilterBar';
import ReportModal from '@/components/ReportModal';
import { Report } from '@/types/report';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetch('/api/reports')
      .then((r) => r.json())
      .then((data) => {
        setReports(data.reports || []);
        const today = new Date().toDateString();
        const count = (data.reports || []).filter(
          (r: Report) => new Date(r.created_at).toDateString() === today
        ).length;
        setTodayCount(count);
      });
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleNewReport = (report: Report) => {
    setReports((prev) => [report, ...prev]);
    setTodayCount((c) => c + 1);
  };

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}>
      {/* Map fills entire screen */}
      <Map
        reports={reports}
        activeCategory={activeCategory}
        showHeatmap={showHeatmap}
        onNewReport={handleNewReport}
      />

      {/* Top: FilterBar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <FilterBar active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Top right: Heatmap toggle */}
      <button
        onClick={() => setShowHeatmap((v) => !v)}
        style={{
          position: 'absolute',
          top: 72,
          right: 16,
          zIndex: 1000,
          background: showHeatmap ? '#EF4444' : 'white',
          color: showHeatmap ? 'white' : '#374151',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        }}
      >
        🔥 {showHeatmap ? 'Hide Hotspots' : 'Show Hotspots'}
      </button>

      {/* Bottom left: Live counter */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 16,
          zIndex: 1000,
          background: 'white',
          borderRadius: 999,
          padding: '6px 14px',
          fontSize: 13,
          fontWeight: 500,
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span style={{ color: '#EF4444', fontSize: 10 }}>●</span>
        Live · {todayCount} reports today
      </div>

      {/* Bottom right: Report button */}
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'absolute',
          bottom: 32,
          right: 24,
          zIndex: 1000,
          background: '#EF4444',
          color: 'white',
          border: 'none',
          borderRadius: 999,
          padding: '16px 24px',
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(239,68,68,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
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

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: toast.type === 'success' ? '#16a34a' : '#dc2626',
            color: 'white',
            padding: '12px 24px',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 14,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap',
          }}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}
