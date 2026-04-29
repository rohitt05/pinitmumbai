'use client';

import { useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

const MUMBAI: [number, number] = [19.15, 72.94];
const INITIAL_ZOOM = 10;

export const MUMBAI_AREAS = [
  { name: 'Colaba',       lat: 18.9067, lng: 72.8147, ward: 'A',   direction: 'South',   zone: 'City' },
  { name: 'Churchgate',   lat: 18.9322, lng: 72.8264, ward: 'C',   direction: 'South',   zone: 'City' },
  { name: 'Dadar',        lat: 19.0178, lng: 72.8478, ward: 'G/N', direction: 'Central', zone: 'City' },
  { name: 'Bandra',       lat: 19.0596, lng: 72.8295, ward: 'H/W', direction: 'West',    zone: 'Suburbs' },
  { name: 'Andheri',      lat: 19.1136, lng: 72.8697, ward: 'K/W', direction: 'West',    zone: 'Suburbs' },
  { name: 'Borivali',     lat: 19.2307, lng: 72.8567, ward: 'R/N', direction: 'North',   zone: 'Suburbs' },
  { name: 'Kurla',        lat: 19.0726, lng: 72.8801, ward: 'L',   direction: 'East',    zone: 'Suburbs' },
  { name: 'Chembur',      lat: 19.0522, lng: 72.8994, ward: 'M/E', direction: 'East',    zone: 'Suburbs' },
  { name: 'Malad',        lat: 19.1872, lng: 72.8486, ward: 'P/N', direction: 'North',   zone: 'Suburbs' },
  { name: 'Ghatkopar',    lat: 19.0868, lng: 72.9084, ward: 'N',   direction: 'East',    zone: 'Suburbs' },
  { name: 'Thane',        lat: 19.2183, lng: 72.9781, ward: 'T-1', direction: 'East',    zone: 'Thane' },
  { name: 'Mulund',       lat: 19.1752, lng: 72.9567, ward: 'T',   direction: 'East',    zone: 'Suburbs' },
  { name: 'Powai',        lat: 19.1197, lng: 72.9051, ward: 'L',   direction: 'East',    zone: 'Suburbs' },
  { name: 'Juhu',         lat: 19.0990, lng: 72.8267, ward: 'K/W', direction: 'West',    zone: 'Suburbs' },
  { name: 'Santacruz',    lat: 19.0828, lng: 72.8392, ward: 'H/E', direction: 'West',    zone: 'Suburbs' },
  { name: 'Vikhroli',     lat: 19.1075, lng: 72.9283, ward: 'S',   direction: 'East',    zone: 'Suburbs' },
  { name: 'Kandivali',    lat: 19.2052, lng: 72.8562, ward: 'R/N', direction: 'North',   zone: 'Suburbs' },
  { name: 'Worli',        lat: 19.0117, lng: 72.8174, ward: 'G/S', direction: 'South',   zone: 'City' },
  { name: 'Lower Parel',  lat: 18.9936, lng: 72.8258, ward: 'G/S', direction: 'South',   zone: 'City' },
  { name: 'Navi Mumbai',  lat: 19.0330, lng: 73.0297, ward: 'NM',  direction: 'East',    zone: 'Navi Mumbai' },
];

export type AreaInfo = typeof MUMBAI_AREAS[0] & { count: number };

function createCategoryIcon(color: string, emoji: string) {
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:34px;height:34px;">
      <div style="width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);"></div>
      <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-56%);font-size:15px;line-height:1;">${emoji}</span>
    </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -38],
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
  <div style="width:272px;font-family:Inter,-apple-system,sans-serif;">
    <div style="position:relative;">
      <img src="${report.photo_url}" alt="" style="width:100%;height:155px;object-fit:cover;display:block;" />
      <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 50%);pointer-events:none;"></div>
      <div style="position:absolute;bottom:10px;left:12px;">
        <span style="background:${cat?.color ?? '#374151'};color:white;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.03em;display:inline-flex;align-items:center;gap:4px;">
          ${cat?.emoji ?? '📍'} ${cat?.label ?? report.category}
        </span>
      </div>
    </div>
    <div style="padding:12px 14px 14px;">
      ${report.description ? `<p style="margin:0 0 5px;font-size:13px;color:#1f2937;line-height:1.45;font-weight:500;">${report.description}</p>` : ''}
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
  onAreaHover: (area: AreaInfo | null) => void;
}

function MapInner({ reports, activeCategory, showHeatmap, onNewReport, onAreaHover }: MapInnerProps) {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const areaLayersRef = useRef<L.Layer[]>([]);

  useEffect(() => {
    const group = (L as unknown as { markerClusterGroup: (opts: unknown) => L.MarkerClusterGroup }).markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster: L.MarkerCluster) => {
        const n = cluster.getChildCount();
        const size = n < 10 ? 38 : n < 30 ? 46 : n < 80 ? 54 : 62;
        const bg = n < 5 ? '#ef4444' : n < 15 ? '#b91c1c' : '#7f1d1d';
        const fontSize = n > 99 ? 11 : n > 9 ? 13 : 14;
        return L.divIcon({
          className: '',
          html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};border:3px solid rgba(255,255,255,0.95);box-shadow:0 3px 14px rgba(0,0,0,0.28);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:${fontSize}px;font-family:Inter,-apple-system,sans-serif;cursor:pointer;">${n}</div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
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
    areaLayersRef.current.forEach((l) => map.removeLayer(l));
    areaLayersRef.current = [];

    MUMBAI_AREAS.forEach((area) => {
      const count = reports.filter((r) => {
        const dLat = r.lat - area.lat;
        const dLng = r.lng - area.lng;
        return Math.sqrt(dLat * dLat + dLng * dLng) < 0.018;
      }).length;

      const labelMarker = L.marker([area.lat, area.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="font-family:Inter,-apple-system,sans-serif;font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.07em;text-shadow:0 1px 3px rgba(255,255,255,0.95),0 1px 8px rgba(255,255,255,0.8);white-space:nowrap;pointer-events:none;user-select:none;">${area.name.toUpperCase()}</div>`,
          iconSize: [120, 20],
          iconAnchor: [60, 10],
        }),
        interactive: false,
        pane: 'tooltipPane',
      } as L.MarkerOptions);

      const hoverMarker = L.marker([area.lat, area.lng], {
        icon: L.divIcon({
          className: '',
          html: '<div style="width:70px;height:70px;border-radius:50%;"></div>',
          iconSize: [70, 70],
          iconAnchor: [35, 35],
        }),
        opacity: 0,
      });

      hoverMarker.on('mouseover', () => onAreaHover({ ...area, count }));
      hoverMarker.on('mouseout',  () => onAreaHover(null));

      map.addLayer(labelMarker);
      map.addLayer(hoverMarker);
      areaLayersRef.current.push(labelMarker, hoverMarker);
    });
  }, [map, reports, onAreaHover]);

  useEffect(() => {
    const channel = supabase
      .channel('reports-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports' }, (payload) => {
        onNewReport(payload.new as Report);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [onNewReport]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => map.setView([pos.coords.latitude, pos.coords.longitude], 13),
      () => {}
    );
  }, [map]);

  return <HotspotLayer reports={reports} visible={showHeatmap} />;
}

interface MapProps extends Omit<MapInnerProps, 'onAreaHover'> {
  totalReports: number;
  navbarHeight: number;
  onAreaHover: (area: AreaInfo | null) => void;
}

export default function Map({ totalReports, navbarHeight, onAreaHover, ...props }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const handleAreaHover = useCallback((a: AreaInfo | null) => onAreaHover(a), [onAreaHover]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer
        center={MUMBAI}
        zoom={INITIAL_ZOOM}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />
        <MapInner {...props} onAreaHover={handleAreaHover} />
      </MapContainer>

      {/* Zoom controls — fixed right edge, below navbar */}
      <div style={{
        position: 'fixed',
        top: navbarHeight + 16,
        right: 16,
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
      }}>
        <button
          onClick={() => mapRef.current?.zoomIn()}
          style={{
            width: 38, height: 38, background: 'white', border: 'none',
            borderBottom: '1px solid #f1f5f9',
            fontSize: 20, cursor: 'pointer', color: '#374151',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 300, lineHeight: 1,
          }}>+</button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          style={{
            width: 38, height: 38, background: 'white', border: 'none',
            fontSize: 20, cursor: 'pointer', color: '#374151',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 300, lineHeight: 1,
          }}>−</button>
      </div>
    </div>
  );
}
