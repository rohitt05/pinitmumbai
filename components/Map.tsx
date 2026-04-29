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

// Fix Leaflet default marker icon broken in webpack/next
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MUMBAI: [number, number] = [19.2183, 72.9781];

function createCategoryIcon(color: string, emoji: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:15px;display:block;text-align:center;line-height:30px;">${emoji}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -38],
  });
}

function buildPopupHTML(report: Report): string {
  const cat = getCategoryById(report.category);
  const timeAgo = getTimeAgo(report.created_at);
  return `
    <div style="width:260px;font-family:Inter,sans-serif;">
      <img src="${report.photo_url}" alt="report" style="width:100%;height:160px;object-fit:cover;display:block;" />
      <div style="padding:10px 12px;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
          <span style="font-size:18px;">${cat?.emoji ?? '📍'}</span>
          <span style="font-weight:700;font-size:14px;color:${cat?.color ?? '#374151'};">${cat?.label ?? report.category}</span>
        </div>
        ${report.description ? `<p style="margin:4px 0;font-size:13px;color:#374151;line-height:1.4;">${report.description}</p>` : ''}
        ${report.area_name ? `<p style="margin:2px 0;font-size:12px;color:#6b7280;">📍 ${report.area_name}</p>` : ''}
        <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:11px;color:#9ca3af;">${timeAgo}</span>
          <button
            data-report-id="${report.id}"
            data-upvotes="${report.upvotes}"
            style="background:#fef2f2;border:1px solid #fca5a5;border-radius:999px;padding:4px 12px;font-size:13px;font-weight:600;cursor:pointer;color:#ef4444;"
          >👍 ${report.upvotes}</button>
        </div>
      </div>
    </div>
  `;
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
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

  // Init cluster group once
  useEffect(() => {
    const group = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 60,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const size = count < 10 ? 36 : count < 50 ? 44 : 52;
        const bg = count < 10 ? '#F97316' : count < 50 ? '#EF4444' : '#991B1B';
        return L.divIcon({
          html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:13px;font-family:Inter,sans-serif;">${count}</div>`,
          className: '',
          iconSize: [size, size],
        });
      },
    });
    clusterGroupRef.current = group;
    map.addLayer(group);
    return () => {
      map.removeLayer(group);
    };
  }, [map]);

  // Sync markers when reports or filter changes
  useEffect(() => {
    const group = clusterGroupRef.current;
    if (!group) return;
    group.clearLayers();

    const filtered =
      activeCategory === 'all'
        ? reports
        : reports.filter((r) => r.category === activeCategory);

    filtered.forEach((report) => {
      const cat = getCategoryById(report.category);
      if (!cat) return;
      const icon = createCategoryIcon(cat.color, cat.emoji);
      const marker = L.marker([report.lat, report.lng], { icon });
      const popup = L.popup({ maxWidth: 280, className: 'pinit-popup' }).setContent(
        buildPopupHTML(report)
      );
      marker.bindPopup(popup);

      // Wire upvote button after popup DOM is inserted
      marker.on('popupopen', () => {
        const el = marker.getPopup()?.getElement();
        if (!el) return;
        const btn = el.querySelector<HTMLButtonElement>('button[data-report-id]');
        if (!btn) return;
        btn.addEventListener('click', async () => {
          if (btn.dataset.voted) return;
          btn.dataset.voted = '1';
          const current = parseInt(btn.dataset.upvotes ?? '0');
          btn.textContent = `👍 ${current + 1}`;
          btn.style.color = '#9ca3af';
          btn.style.borderColor = '#e5e7eb';
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

  // Supabase Realtime — new pin appears instantly
  useEffect(() => {
    const channel = supabase
      .channel('reports-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reports' },
        (payload) => {
          onNewReport(payload.new as Report);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewReport]);

  // GPS re-center on load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => map.setView([pos.coords.latitude, pos.coords.longitude], 14),
      () => {}
    );
  }, [map]);

  return <HotspotLayer reports={reports} visible={showHeatmap} />;
}

interface MapProps {
  reports: Report[];
  activeCategory: string;
  showHeatmap: boolean;
  onNewReport: (r: Report) => void;
}

export default function Map(props: MapProps) {
  return (
    <MapContainer
      center={MUMBAI}
      zoom={13}
      style={{ width: '100vw', height: '100dvh' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapInner {...props} />
    </MapContainer>
  );
}
