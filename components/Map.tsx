'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.markercluster';
import { Report } from '@/types/report';
import { getCategoryById } from '@/lib/categories';
import { supabase } from '@/lib/supabase';
import HotspotLayer from './HotspotLayer';
import StatsCard from './StatsCard';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MUMBAI: [number, number] = [19.15, 72.94];
const INITIAL_ZOOM = 10;

// Mumbai area data with ward info
const MUMBAI_AREAS: Array<{
  name: string;
  lat: number;
  lng: number;
  ward: string;
  direction: string;
  zone: string;
}> = [
  { name: 'Colaba',           lat: 18.9067, lng: 72.8147, ward: 'A',  direction: 'South', zone: 'City' },
  { name: 'Churchgate',       lat: 18.9322, lng: 72.8264, ward: 'C',  direction: 'South', zone: 'City' },
  { name: 'Dadar',            lat: 19.0178, lng: 72.8478, ward: 'G/N', direction: 'Central', zone: 'City' },
  { name: 'Bandra',           lat: 19.0596, lng: 72.8295, ward: 'H/W', direction: 'West',  zone: 'Suburbs' },
  { name: 'Andheri',          lat: 19.1136, lng: 72.8697, ward: 'K/W', direction: 'West',  zone: 'Suburbs' },
  { name: 'Borivali',         lat: 19.2307, lng: 72.8567, ward: 'R/N', direction: 'North', zone: 'Suburbs' },
  { name: 'Kurla',            lat: 19.0726, lng: 72.8801, ward: 'L',   direction: 'East',  zone: 'Suburbs' },
  { name: 'Chembur',          lat: 19.0522, lng: 72.8994, ward: 'M/E', direction: 'East',  zone: 'Suburbs' },
  { name: 'Malad',            lat: 19.1872, lng: 72.8486, ward: 'P/N', direction: 'North', zone: 'Suburbs' },
  { name: 'Ghatkopar',        lat: 19.0868, lng: 72.9084, ward: 'N',   direction: 'East',  zone: 'Suburbs' },
  { name: 'Thane',            lat: 19.2183, lng: 72.9781, ward: 'T-1', direction: 'East',  zone: 'Thane' },
  { name: 'Mulund',           lat: 19.1752, lng: 72.9567, ward: 'T',   direction: 'East',  zone: 'Suburbs' },
  { name: 'Powai',            lat: 19.1197, lng: 72.9051, ward: 'L',   direction: 'East',  zone: 'Suburbs' },
  { name: 'Juhu',             lat: 19.0990, lng: 72.8267, ward: 'K/W', direction: 'West',  zone: 'Suburbs' },
  { name: 'Santacruz',        lat: 19.0828, lng: 72.8392, ward: 'H/E', direction: 'West',  zone: 'Suburbs' },
  { name: 'Vikhroli',         lat: 19.1075, lng: 72.9283, ward: 'S',   direction: 'East',  zone: 'Suburbs' },
  { name: 'Kandivali',        lat: 19.2052, lng: 72.8562, ward: 'R/N', direction: 'North', zone: 'Suburbs' },
  { name: 'Worli',            lat: 19.0117, lng: 72.8174, ward: 'G/S', direction: 'South', zone: 'City' },
  { name: 'Lower Parel',      lat: 18.9936, lng: 72.8258, ward: 'G/S', direction: 'South', zone: 'City' },
  { name: 'Navi Mumbai',      lat: 19.0330, lng: 73.0297, ward: 'NM',  direction: 'East',  zone: 'Navi Mumbai' },
];

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

function buildWardTooltipHTML(
  area: typeof MUMBAI_AREAS[0],
  reportCount: number
): string {
  const intensity = reportCount === 0 ? 'No issues' : reportCount < 3 ? 'Low' : reportCount < 8 ? 'Moderate' : 'High';
  const intensityColor = reportCount === 0 ? '#94a3b8' : reportCount < 3 ? '#22c55e' : reportCount < 8 ? '#f97316' : '#ef4444';
  return `
  <div style="font-family:Inter,-apple-system,sans-serif;padding:13px 16px;min-width:190px;">
    <div style="font-size:14px;font-weight:800;color:#0f172a;letter-spacing:-0.03em;margin-bottom:3px;">${area.name}</div>
    <div style="font-size:11px;color:#94a3b8;font-weight:500;margin-bottom:10px;">Ward #${area.ward} &nbsp;·&nbsp; ${area.direction}</div>
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-top:1px solid #f1f5f9;">
      <div style="display:flex;flex-direction:column;gap:2px;">
        <span style="font-size:20px;font-weight:800;color:#ef4444;letter-spacing:-0.04em;line-height:1;">${reportCount}</span>
        <span style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">reports</span>
      </div>
      <span style="font-size:11px;font-weight:700;color:${intensityColor};background:${intensityColor}18;padding:4px 10px;border-radius:999px;">${intensity}</span>
    </div>
    <div style="font-size:10px;color:#cbd5e1;margin-top:4px;">${area.zone} Zone</div>
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
  const areaLayersRef = useRef<L.Layer[]>([]);

  // ── Cluster group setup ─────────────────────────────────────
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
          html: `<div style="
            width:${size}px;height:${size}px;
            border-radius:50%;
            background:${bg};
            border:3px solid rgba(255,255,255,0.95);
            box-shadow:0 3px 14px rgba(0,0,0,0.28);
            display:flex;align-items:center;justify-content:center;
            color:white;font-weight:800;font-size:${fontSize}px;
            font-family:Inter,-apple-system,sans-serif;
            cursor:pointer;
          ">${n}</div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
      },
    });
    clusterGroupRef.current = group;
    map.addLayer(group);
    return () => { map.removeLayer(group); };
  }, [map]);

  // ── Markers update ──────────────────────────────────────────
  useEffect(() => {
    const group = clusterGroupRef.current;
    if (!group) return;
    group.clearLayers();
    const filtered = activeCategory === 'all'
      ? reports
      : reports.filter((r) => r.category === activeCategory);
    filtered.forEach((report) => {
      const cat = getCategoryById(report.category);
      if (!cat) return;
      const marker = L.marker([report.lat, report.lng], {
        icon: createCategoryIcon(cat.color, cat.emoji),
      });
      marker.bindPopup(
        L.popup({ maxWidth: 300, className: 'pinit-popup' }).setContent(buildPopupHTML(report))
      );
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

  // ── Area labels + hover ward cards ─────────────────────────
  useEffect(() => {
    // Remove previous
    areaLayersRef.current.forEach((l) => map.removeLayer(l));
    areaLayersRef.current = [];

    MUMBAI_AREAS.forEach((area) => {
      // Count reports near this area (within ~1.5km radius)
      const areaReports = reports.filter((r) => {
        const dLat = r.lat - area.lat;
        const dLng = r.lng - area.lng;
        return Math.sqrt(dLat * dLat + dLng * dLng) < 0.018;
      });
      const count = areaReports.length;

      // Permanent area name label
      const labelMarker = L.marker([area.lat, area.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="
            font-family:Inter,-apple-system,sans-serif;
            font-size:11px;font-weight:700;
            color:#374151;
            text-transform:uppercase;
            letter-spacing:0.07em;
            text-shadow:0 1px 3px rgba(255,255,255,0.95),0 1px 6px rgba(255,255,255,0.7);
            white-space:nowrap;
            pointer-events:none;
            user-select:none;
          ">${area.name.toUpperCase()}</div>`,
          iconSize: [120, 20],
          iconAnchor: [60, 10],
        }),
        interactive: false,
        pane: 'tooltipPane',
      } as L.MarkerOptions);

      // Invisible hover zone marker
      const hoverMarker = L.marker([area.lat, area.lng], {
        icon: L.divIcon({
          className: '',
          html: '<div style="width:60px;height:60px;border-radius:50%;cursor:default;"></div>',
          iconSize: [60, 60],
          iconAnchor: [30, 30],
        }),
        opacity: 0,
      });

      hoverMarker.bindTooltip(
        buildWardTooltipHTML(area, count),
        {
          className: 'ward-tooltip',
          sticky: false,
          direction: 'right',
          offset: [16, 0],
        }
      );

      map.addLayer(labelMarker);
      map.addLayer(hoverMarker);
      areaLayersRef.current.push(labelMarker, hoverMarker);
    });
  }, [map, reports]);

  // ── Realtime subscription ───────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('reports-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports' }, (payload) => {
        onNewReport(payload.new as Report);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [onNewReport]);

  // ── GPS locate ──────────────────────────────────────────────
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => map.setView([pos.coords.latitude, pos.coords.longitude], 13),
      () => {}
    );
  }, [map]);

  return <HotspotLayer reports={reports} visible={showHeatmap} />;
}

interface MapProps extends MapInnerProps {
  totalReports: number;
}

export default function Map({ totalReports, ...props }: MapProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer
        center={MUMBAI}
        zoom={INITIAL_ZOOM}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />
        <MapInner {...props} />
      </MapContainer>

      {/* Custom zoom controls */}
      <div style={{
        position: 'absolute', bottom: 80, right: 16, zIndex: 500,
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        borderRadius: 10, overflow: 'hidden',
        border: '1px solid #e5e7eb',
      }}>
        <button
          onClick={() => {
            const btn = document.querySelector('.leaflet-control-zoom-in');
            if (btn instanceof HTMLElement) btn.click();
          }}
          style={{
            width: 38, height: 38, background: 'white', border: 'none',
            borderBottom: '1px solid #f1f5f9',
            fontSize: 20, cursor: 'pointer', color: '#374151',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 300, lineHeight: 1,
          }}>+</button>
        <button
          onClick={() => {
            const btn = document.querySelector('.leaflet-control-zoom-out');
            if (btn instanceof HTMLElement) btn.click();
          }}
          style={{
            width: 38, height: 38, background: 'white', border: 'none',
            fontSize: 20, cursor: 'pointer', color: '#374151',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 300, lineHeight: 1,
          }}>−</button>
      </div>

      {/* Stats card — top left */}
      <StatsCard totalReports={totalReports} activeReports={totalReports} />
    </div>
  );
}
