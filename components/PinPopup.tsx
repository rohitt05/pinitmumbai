'use client';

import { Report } from '@/types/report';
import { getCategoryById } from '@/lib/categories';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface PinPopupProps {
  report: Report;
}

export default function PinPopup({ report }: PinPopupProps) {
  const cat = getCategoryById(report.category);
  const [upvotes, setUpvotes] = useState(report.upvotes);
  const [voted, setVoted] = useState(false);

  const handleUpvote = async () => {
    if (voted) return;
    setVoted(true);
    setUpvotes((v) => v + 1);
    await fetch('/api/upvote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: report.id }),
    });
  };

  return (
    <div style={{ width: 260, fontFamily: 'Inter, sans-serif' }}>
      <img
        src={report.photo_url}
        alt="Report"
        style={{ width: '100%', maxHeight: 160, objectFit: 'cover', display: 'block' }}
      />
      <div style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 18 }}>{cat?.emoji}</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: cat?.color }}>{cat?.label}</span>
        </div>
        {report.description && (
          <p style={{ margin: '4px 0', fontSize: 13, color: '#374151', lineHeight: 1.4 }}>
            {report.description}
          </p>
        )}
        {report.area_name && (
          <p style={{ margin: '2px 0', fontSize: 12, color: '#6b7280' }}>📍 {report.area_name}</p>
        )}
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 11, color: '#9ca3af' }}>
            {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
          </span>
          <button
            onClick={handleUpvote}
            disabled={voted}
            style={{
              background: voted ? '#f3f4f6' : '#fef2f2',
              border: `1px solid ${voted ? '#e5e7eb' : '#fca5a5'}`,
              borderRadius: 999,
              padding: '4px 12px',
              fontSize: 13,
              fontWeight: 600,
              cursor: voted ? 'default' : 'pointer',
              color: voted ? '#9ca3af' : '#ef4444',
            }}
          >
            👍 {upvotes}
          </button>
        </div>
      </div>
    </div>
  );
}
