'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [submitDone, setSubmitDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setCategory(''); setPhoto(null); setPhotoPreview(null);
    setDescription(''); setAreaName('');
    setLat(null); setLng(null);
    setGpsStatus('detecting'); setLoading(false); setSubmitDone(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    reset();
    if (!navigator.geolocation) { setGpsStatus('error'); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLat(pos.coords.latitude); setLng(pos.coords.longitude);
        setGpsStatus('found');
        const area = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        if (area) setAreaName(area);
      },
      () => setGpsStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [isOpen, reset]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return; }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // Progress: 0–3 steps complete
  const progress = [!!category, !!photo, gpsStatus === 'found'].filter(Boolean).length;
  const canSubmit = progress === 3 && !loading;

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
      setSubmitDone(true);
      setTimeout(() => { onSuccess(json.report as Report); reset(); onClose(); }, 900);
    } catch {
      onError(); setLoading(false);
    }
  };

  const catObj = CATEGORIES.find((c) => c.id === category);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { reset(); onClose(); }}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2001,
              background: 'white',
              borderRadius: '20px 20px 0 0',
              maxHeight: '92dvh', overflowY: 'auto',
              padding: '0 20px 48px',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
            }}
          >
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
              <div style={{ width: 36, height: 4, background: '#e5e7eb', borderRadius: 999 }} />
            </div>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 4px' }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1.2 }}>Report an Issue</h2>
                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Help fix {areaName || 'your area'}</p>
              </div>
              <button
                onClick={() => { reset(); onClose(); }}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: 'none', background: '#f3f4f6',
                  fontSize: 14, cursor: 'pointer', color: '#6b7280',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
            </div>

            {/* Progress bar */}
            <div style={{ height: 3, background: '#f3f4f6', borderRadius: 999, margin: '12px 0 20px', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${(progress / 3) * 100}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                style={{ height: '100%', background: progress === 3 ? '#22c55e' : '#EF4444', borderRadius: 999 }}
              />
            </div>

            {/* GPS status */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', borderRadius: 10, marginBottom: 20,
              background: gpsStatus === 'found' ? '#f0fdf4' : gpsStatus === 'error' ? '#fef2f2' : '#fafafa',
              border: `1px solid ${gpsStatus === 'found' ? '#bbf7d0' : gpsStatus === 'error' ? '#fecaca' : '#e5e7eb'}`,
            }}>
              <span style={{ fontSize: 16 }}>
                {gpsStatus === 'found' ? '📍' : gpsStatus === 'error' ? '⚠️' : '⏳'}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: gpsStatus === 'found' ? '#15803d' : gpsStatus === 'error' ? '#dc2626' : '#6b7280' }}>
                {gpsStatus === 'found' && 'Location detected'}
                {gpsStatus === 'error' && 'Allow location access to continue'}
                {gpsStatus === 'detecting' && 'Detecting your location...'}
              </span>
            </div>

            {/* Category */}
            <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Category *</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
              {CATEGORIES.map((cat) => {
                const active = category === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCategory(cat.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                      padding: '12px 6px', borderRadius: 12, cursor: 'pointer',
                      border: `2px solid ${active ? cat.color : '#f3f4f6'}`,
                      background: active ? cat.color + '12' : '#fafafa',
                      color: active ? cat.color : '#9ca3af',
                      fontSize: 10, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <span style={{ fontSize: 26 }}>{cat.emoji}</span>
                    {cat.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Photo */}
            <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Photo *</p>
            <motion.div
              whileTap={{ scale: 0.99 }}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${photo ? (catObj?.color ?? '#10b981') : '#e5e7eb'}`,
                borderRadius: 14, minHeight: 130,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden', marginBottom: 24,
                background: photo ? '#fafafa' : '#fdfdfd',
                transition: 'border-color 200ms ease',
              }}
            >
              <AnimatePresence mode="wait">
                {photoPreview ? (
                  <motion.img
                    key="preview"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={photoPreview}
                    alt="preview"
                    style={{ width: '100%', maxHeight: 220, objectFit: 'cover' }}
                  />
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: 20 }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 6 }}>📷</div>
                    <div style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>Tap to add photo</div>
                    <div style={{ fontSize: 11, color: '#d1d5db', marginTop: 2 }}>Max 5MB</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handlePhotoChange} />

            {/* Description */}
            <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Description <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              placeholder="Describe the issue in one line..."
              rows={2}
              style={{
                width: '100%', border: '1.5px solid #f3f4f6', borderRadius: 10,
                padding: '11px 14px', fontSize: 14, fontFamily: 'Inter, sans-serif',
                resize: 'none', outline: 'none', background: '#fafafa',
                marginBottom: 6, color: '#111827',
                transition: 'border-color 150ms ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#EF4444')}
              onBlur={(e) => (e.target.style.borderColor = '#f3f4f6')}
            />
            <div style={{ fontSize: 11, color: '#d1d5db', textAlign: 'right', marginBottom: 20 }}>{description.length}/200</div>

            {/* Area */}
            <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Area Name <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></p>
            <input
              type="text"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              placeholder="e.g. Kopri, Thane East"
              style={{
                width: '100%', border: '1.5px solid #f3f4f6', borderRadius: 10,
                padding: '11px 14px', fontSize: 14, fontFamily: 'Inter, sans-serif',
                outline: 'none', background: '#fafafa', marginBottom: 28, color: '#111827',
                transition: 'border-color 150ms ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#EF4444')}
              onBlur={(e) => (e.target.style.borderColor = '#f3f4f6')}
            />

            {/* Submit */}
            <motion.button
              whileTap={canSubmit ? { scale: 0.97 } : {}}
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                width: '100%', padding: '15px', borderRadius: 14, border: 'none',
                background: submitDone
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : canSubmit
                  ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                  : '#f3f4f6',
                color: canSubmit ? 'white' : '#9ca3af',
                fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                boxShadow: canSubmit ? '0 4px 16px rgba(239,68,68,0.35)' : 'none',
                transition: 'all 200ms ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {submitDone ? (
                <><span>✅</span> Submitted!</>
              ) : loading ? (
                <><span className="animate-spin" style={{ display: 'inline-block', width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%' }} /> Submitting...</>
              ) : (
                <><span>📍</span> Submit Report</>
              )}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
