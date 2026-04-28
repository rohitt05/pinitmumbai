'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [category, setCategory] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [areaName, setAreaName] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'detecting' | 'found' | 'error'>('detecting');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setGpsStatus('detecting');
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

  const canSubmit = category && photo && gpsStatus === 'found';

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
      onSuccess(json.report);
      handleClose();
    } catch {
      onError();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCategory('');
    setPhoto(null);
    setPhotoPreview(null);
    setDescription('');
    setAreaName('');
    setLat(null);
    setLng(null);
    setGpsStatus('detecting');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 2000,
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          zIndex: 2001,
          background: 'white',
          borderRadius: '16px 16px 0 0',
          maxHeight: '90dvh',
          overflowY: 'auto',
          padding: '0 16px 32px',
          transform: 'translateY(0)',
          transition: 'transform 300ms ease',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 36, height: 4, background: '#e5e7eb', borderRadius: 999 }} />
        </div>

        <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: '#111827' }}>
          📍 Report an Issue
        </h2>

        {/* GPS Status */}
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            marginBottom: 16,
            background: gpsStatus === 'found' ? '#f0fdf4' : gpsStatus === 'error' ? '#fef2f2' : '#fafafa',
            border: `1px solid ${gpsStatus === 'found' ? '#86efac' : gpsStatus === 'error' ? '#fca5a5' : '#e5e7eb'}`,
            fontSize: 13,
            color: gpsStatus === 'found' ? '#16a34a' : gpsStatus === 'error' ? '#dc2626' : '#6b7280',
            fontWeight: 500,
          }}
        >
          {gpsStatus === 'found' && '📍 Location detected'}
          {gpsStatus === 'error' && '⚠️ Location required — please allow location access'}
          {gpsStatus === 'detecting' && '⏳ Detecting your location...'}
        </div>

        {/* Category */}
        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Category *</p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
            marginBottom: 16,
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '10px 4px',
                borderRadius: 10,
                border: `2px solid ${category === cat.id ? cat.color : '#e5e7eb'}`,
                background: category === cat.id ? cat.color + '15' : 'white',
                cursor: 'pointer',
                fontSize: 10,
                fontWeight: 600,
                color: category === cat.id ? cat.color : '#6b7280',
                transition: 'all 150ms ease',
              }}
            >
              <span style={{ fontSize: 22 }}>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photo */}
        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Photo *</p>
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: '2px dashed #d1d5db',
            borderRadius: 12,
            minHeight: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            overflow: 'hidden',
            marginBottom: 16,
            background: '#fafafa',
          }}
        >
          {photoPreview ? (
            <img src={photoPreview} alt="preview" style={{ width: '100%', maxHeight: 180, objectFit: 'cover' }} />
          ) : (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: 16 }}>
              <div style={{ fontSize: 32 }}>📷</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Tap to take/upload photo</div>
              <div style={{ fontSize: 11, marginTop: 2 }}>Max 5MB</div>
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
        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 200))}
          placeholder="Describe the issue in one line..."
          rows={2}
          style={{
            width: '100%',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: 14,
            fontFamily: 'Inter, sans-serif',
            resize: 'none',
            marginBottom: 4,
            outline: 'none',
          }}
        />
        <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'right', marginBottom: 12 }}>
          {description.length}/200
        </div>

        {/* Area Name */}
        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Area Name</p>
        <input
          type="text"
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
          placeholder="e.g. Kopri, Thane East"
          style={{
            width: '100%',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '10px 12px',
            fontSize: 14,
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            marginBottom: 20,
          }}
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          style={{
            width: '100%',
            padding: '14px',
            background: canSubmit && !loading ? '#EF4444' : '#e5e7eb',
            color: canSubmit && !loading ? 'white' : '#9ca3af',
            border: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
            transition: 'background 150ms ease',
          }}
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </>
  );
}
