'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CATEGORIES } from '@/lib/categories';
import { reverseGeocode } from '@/lib/reverseGeocode';
import { Report } from '@/types/report';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (report: Report) => void;
  onError: () => void;
}

export default function ReportModal({ isOpen, onClose, onSuccess, onError }: ReportModalProps) {
  const [category, setCategory] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [areaName, setAreaName] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'detecting' | 'found' | 'error'>('detecting');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setCategory('');
    setPhoto(null);
    setPhotoPreview(null);
    setDescription('');
    setAreaName('');
    setLat(null);
    setLng(null);
    setGpsStatus('detecting');
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setGpsStatus('detecting');
    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setGpsStatus('found');
        const area = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        if (area) setAreaName(area);
      },
      () => setGpsStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [isOpen]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be under 5MB.');
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const canSubmit = !!(category && photo && gpsStatus === 'found' && !loading);

  const handleSubmit = async () => {
    if (!canSubmit || !photo || lat === null || lng === null) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('photo', photo);
      fd.append('category', category);
      fd.append('description', description);
      fd.append('area_name', areaName);
      fd.append('lat', String(lat));
      fd.append('lng', String(lng));
      const res = await fetch('/api/report', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      onSuccess(json.report as Report);
      reset();
      onClose();
    } catch {
      onError();
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 2000,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          zIndex: 2001,
          background: 'white',
          borderRadius: '16px 16px 0 0',
          maxHeight: '90dvh',
          overflowY: 'auto',
          padding: '0 16px 40px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 40, height: 4, background: '#e5e7eb', borderRadius: 999 }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>📍 Report an Issue</h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#6b7280', padding: 4 }}>✕</button>
        </div>

        {/* GPS */}
        <div style={{
          padding: '9px 12px', borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 500,
          background: gpsStatus === 'found' ? '#f0fdf4' : gpsStatus === 'error' ? '#fef2f2' : '#f9fafb',
          border: `1px solid ${gpsStatus === 'found' ? '#86efac' : gpsStatus === 'error' ? '#fca5a5' : '#e5e7eb'}`,
          color: gpsStatus === 'found' ? '#16a34a' : gpsStatus === 'error' ? '#dc2626' : '#6b7280',
        }}>
          {gpsStatus === 'found' && '📍 Location detected'}
          {gpsStatus === 'error' && '⚠️ Location required — please allow location access in your browser'}
          {gpsStatus === 'detecting' && '⏳ Detecting your location...'}
        </div>

        {/* Category */}
        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, marginTop: 0 }}>Category *</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '10px 4px', borderRadius: 10, cursor: 'pointer',
                border: `2px solid ${category === cat.id ? cat.color : '#e5e7eb'}`,
                background: category === cat.id ? cat.color + '18' : 'white',
                color: category === cat.id ? cat.color : '#6b7280',
                fontSize: 11, fontWeight: 600, transition: 'all 150ms ease',
              }}
            >
              <span style={{ fontSize: 24 }}>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photo */}
        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, marginTop: 0 }}>Photo *</p>
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: '2px dashed #d1d5db', borderRadius: 12,
            minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', overflow: 'hidden', marginBottom: 20, background: '#fafafa',
          }}
        >
          {photoPreview ? (
            <img src={photoPreview} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />
          ) : (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: 16 }}>
              <div style={{ fontSize: 36 }}>📷</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Tap to take or upload a photo</div>
              <div style={{ fontSize: 11, marginTop: 2, color: '#d1d5db' }}>Max 5MB · image/*</div>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />

        {/* Description */}
        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, marginTop: 0 }}>Description <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span></p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 200))}
          placeholder="Describe the issue in one line..."
          rows={2}
          style={{
            width: '100%', border: '1px solid #e5e7eb', borderRadius: 8,
            padding: '10px 12px', fontSize: 14, fontFamily: 'Inter, sans-serif',
            resize: 'none', marginBottom: 4, outline: 'none', boxSizing: 'border-box',
          }}
        />
        <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'right', marginBottom: 16 }}>{description.length}/200</div>

        {/* Area name */}
        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, marginTop: 0 }}>Area Name <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span></p>
        <input
          type="text"
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
          placeholder="e.g. Kopri, Thane East"
          style={{
            width: '100%', border: '1px solid #e5e7eb', borderRadius: 8,
            padding: '10px 12px', fontSize: 14, fontFamily: 'Inter, sans-serif',
            outline: 'none', marginBottom: 24, boxSizing: 'border-box',
          }}
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            width: '100%', padding: '15px', borderRadius: 12, border: 'none',
            background: canSubmit ? '#EF4444' : '#e5e7eb',
            color: canSubmit ? 'white' : '#9ca3af',
            fontSize: 16, fontWeight: 700,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'background 150ms ease',
          }}
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </>
  );
}
