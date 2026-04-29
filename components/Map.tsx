'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import 'leaflet.markercluster';
import { Report } from '@/types/report';
import { getCategoryById } from '@/lib/categories';
import { supabase } from '@/lib/supabase';
import HotspotLayer from './HotspotLayer';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Zoomed out to show all of Mumbai + surroundings
const MUMBAI: [number, number] = [19.076, 72.877];
const INITIAL_ZOOM = 11;

function createCategoryIcon(color: string, emoji: string) {
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:36px;height:36px;">
      <div style="width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2.5px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.3);"></div>
      <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-56%);font-size:16px;line-height:1;">${emoji}</span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -40],
  });
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function buildPopupHTML(report: Report): string {
  const cat = getCategoryById(report.category);
  return `
  <div style="width:270px;font-family:Inter,-apple-system,sans-serif;">
    <div style="position:relative;">
      <img src="${report.photo_url}" alt="" style="width:100%;height:160px;object-fit:cover;display:block;" />
      <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 55%);pointer-events:none;"></div>
      <div style="position:absolute;bottom:10px;left:12px;">
        <span style="background:${cat?.color ?? '#374151'};color:white;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.03em;display:inline-flex;align-items:center;gap:4px;">
          ${cat?.emoji ?? '📍'} ${cat?.label ?? report.category}
        </span>
      </div>
    </div>
    <div style="padding:12px 14px 14px;">
      ${report.description ? `<p style="margin:0 0 6px;font-size:13px;color:#1f2937;line-height:1.45;font-weight:500;">${report.description}</p>` : ''}
      ${report.area_name ? `<p style="margin:0 0 8px;font-size:11px;color:#9ca3af;">📍 ${report.area_name}</p>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid #f3f4f6;">
        <span style="font-size:11px;color:#d1d5db;font-weight:500;">${getTimeAgo(report.created_at)}</span>
        <button
          data-report-id="${report.id}"
          data-upvotes="${report.upvotes}"
          style="background:#fef2f2;border:1.5px solid #fecaca;border-radius:999px;padding:5px 14px;font-size:12px;font-weight:700;cursor:pointer;color:#ef4444;font-family:Inter,sans-serif;"
        >👍 ${report.upvotes}</button>
      </div>
    </div>
  </div>`;
}

interface MapInnerProps {
  reports: Report[];
  activeCategory: string;
  showHeatmap: boolean;
  onNewReport: (r: Report) => void;
}

function MapInner({ reports, activeCategory, showHeatmap, onNewReport }: MapInnerProps) {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    const group = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 60,
      iconCreateFunction: (cluster) => {
        const n = cluster.getChildCount();
        const size = n < 10 ? 38 : n < 50 ? 46 : 54;
        const bg = n < 10 ? '#F97316' : n < 50 ? '#EF4444' : '#991B1B';
        return L.divIcon({
          className: 'pinit-cluster',
          html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};border:3px solid rgba(255,255,255,0.9);box-shadow:0 3px 14px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:13px;font-family:Inter,sans-serif;">${n}</div>`,
          iconSize: [size, size],
        });
      },
    });
    clusterGroupRef.current = group;
    map.addLayer(group);
    return () => { map.removeLayer(group); };
  }, [map]);

  useEffect(() => {
    const group = clusterGroupRef.current;
    if (!group) return;
    group.clearLayers();
    const filtered = activeCategory === 'all' ? reports : reports.filter((r) => r.category === activeCategory);
    filtered.forEach((report) => {
      const cat = getCategoryById(report.category);
      if (!cat) return;
      const marker = L.marker([report.lat, report.lng], { icon: createCategoryIcon(cat.color, cat.emoji) });
      marker.bindPopup(L.popup({ maxWidth: 300, className: 'pinit-popup' }).setContent(buildPopupHTML(report)));
      marker.on('popupopen', () => {
        const el = marker.getPopup()?.getElement();
        if (!el) return;
        const btn = el.querySelector<HTMLButtonElement>('button[data-report-id]');
        if (!btn) return;
        btn.addEventListener('click', async () => {
          if (btn.dataset.voted) return;
          btn.dataset.voted = '1';
          const n = parseInt(btn.dataset.upvotes ?? '0');
          btn.innerHTML = `👍 ${n + 1}`;
          btn.style.color = '#9ca3af';
          btn.style.borderColor = '#e5e7eb';
          btn.style.background = '#f9fafb';
          await fetch('/api/upvote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: report.id }),
          });
        });
      });
      group.addLayer(marker);
    });
  }, [reports, activeCategory]);

  useEffect(() => {
    const channel = supabase
      .channel('reports-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports' }, (payload) => {
        onNewReport(payload.new as Report);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [onNewReport]);

  // On load, try GPS — if denied just stay at the zoomed-out city view
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => map.setView([pos.coords.latitude, pos.coords.longitude], 14),
      () => {} // stay at MUMBAI z11
    );
  }, [map]);

  return <HotspotLayer reports={reports} visible={showHeatmap} />;
}

export default function Map(props: MapInnerProps) {
  return (
    <MapContainer
      center={MUMBAI}
      zoom={INITIAL_ZOOM}
      style={{ width: '100vw', height: '100dvh' }}
      zoomControl
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      <MapInner {...props} />
    </MapContainer>
  );
}
