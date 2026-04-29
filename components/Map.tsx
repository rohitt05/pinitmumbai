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

const MUMBAI: [number, number] = [19.076, 72.877];
const INITIAL_ZOOM = 11;

// All 24 real BMC Administrative Wards with accurate centroids
export const MUMBAI_AREAS = [
  // ── City Zone (Island City) ──────────────────────────────────────────
  {
    ward: 'A',   name: 'Colaba / Churchgate',  neighbourhoods: 'Colaba, Navy Nagar, Churchgate, Gateway of India',
    lat: 18.9120, lng: 72.8230, direction: 'South', zone: 'City',
  },
  {
    ward: 'B',   name: 'Dongri / Bhendi Bazar', neighbourhoods: 'Masjid Bunder, Mohd. Ali Road, Dongri, Nagpada',
    lat: 18.9500, lng: 72.8380, direction: 'South', zone: 'City',
  },
  {
    ward: 'C',   name: 'Pydhonie / Bhuleshwar', neighbourhoods: 'Pydhonie, Bhuleshwar, Kalbadevi, Crawford Market',
    lat: 18.9520, lng: 72.8290, direction: 'South', zone: 'City',
  },
  {
    ward: 'D',   name: 'Girgaon / Malabar Hill', neighbourhoods: 'Girgaon, Malabar Hill, Chowpatty, Grant Road',
    lat: 18.9650, lng: 72.8150, direction: 'South', zone: 'City',
  },
  {
    ward: 'E',   name: 'Byculla / Mazagaon',    neighbourhoods: 'Byculla, Mazagaon, Reay Road, Sewri',
    lat: 18.9770, lng: 72.8390, direction: 'South', zone: 'City',
  },
  {
    ward: 'F/N', name: 'Matunga / Sion',         neighbourhoods: 'Matunga, Sion, Dharavi (north), Antop Hill',
    lat: 19.0420, lng: 72.8590, direction: 'Central', zone: 'City',
  },
  {
    ward: 'F/S', name: 'Parel / Lower Parel',    neighbourhoods: 'Parel, Curry Road, Naigaon, Lower Parel',
    lat: 19.0010, lng: 72.8380, direction: 'Central', zone: 'City',
  },
  {
    ward: 'G/N', name: 'Dadar / Shivaji Park',   neighbourhoods: 'Dadar, Shivaji Park, Mahim, Hindu Colony',
    lat: 19.0210, lng: 72.8430, direction: 'Central', zone: 'City',
  },
  {
    ward: 'G/S', name: 'Worli / Prabhadevi',     neighbourhoods: 'Worli, Prabhadevi, Elphinstone Road, Lalbaug',
    lat: 19.0050, lng: 72.8190, direction: 'South', zone: 'City',
  },
  // ── Western Suburbs ──────────────────────────────────────────────────
  {
    ward: 'H/E', name: 'Bandra East / Dharavi',  neighbourhoods: 'Bandra East, Khar East, Santacruz East, Dharavi',
    lat: 19.0600, lng: 72.8650, direction: 'East', zone: 'Western Suburbs',
  },
  {
    ward: 'H/W', name: 'Bandra West',             neighbourhoods: 'Bandra West, Khar West, Santacruz West, Carter Road',
    lat: 19.0550, lng: 72.8250, direction: 'West', zone: 'Western Suburbs',
  },
  {
    ward: 'K/E', name: 'Andheri East / Sakinaka', neighbourhoods: 'Andheri East, Sakinaka, Marol, J.B. Nagar',
    lat: 19.1130, lng: 72.8820, direction: 'East', zone: 'Western Suburbs',
  },
  {
    ward: 'K/W', name: 'Andheri West / Versova',  neighbourhoods: 'Andheri West, Versova, Oshiwara, Juhu',
    lat: 19.1180, lng: 72.8350, direction: 'West', zone: 'Western Suburbs',
  },
  {
    ward: 'P/N', name: 'Malad / Kandivali',        neighbourhoods: 'Malad, Kandivali East, Poisar, Charkop',
    lat: 19.1900, lng: 72.8540, direction: 'North', zone: 'Western Suburbs',
  },
  {
    ward: 'P/S', name: 'Goregaon / Malad West',   neighbourhoods: 'Goregaon, Malad West, Aarey Colony, Film City',
    lat: 19.1600, lng: 72.8440, direction: 'North', zone: 'Western Suburbs',
  },
  {
    ward: 'R/C', name: 'Kandivali West',           neighbourhoods: 'Kandivali West, Dahisar, Borivali East (part)',
    lat: 19.2010, lng: 72.8300, direction: 'North', zone: 'Western Suburbs',
  },
  {
    ward: 'R/N', name: 'Borivali North',           neighbourhoods: 'Borivali, Dahisar, Poisar, Eksar',
    lat: 19.2350, lng: 72.8570, direction: 'North', zone: 'Western Suburbs',
  },
  {
    ward: 'R/S', name: 'Borivali South',           neighbourhoods: 'Borivali South, Kandivali East, Samata Nagar',
    lat: 19.2100, lng: 72.8690, direction: 'North', zone: 'Western Suburbs',
  },
  // ── Eastern Suburbs ──────────────────────────────────────────────────
  {
    ward: 'L',   name: 'Kurla / Saki Naka',        neighbourhoods: 'Kurla, Chandivali, Saki Naka, Powai, Tungwa',
    lat: 19.0740, lng: 72.8920, direction: 'East', zone: 'Eastern Suburbs',
  },
  {
    ward: 'M/E', name: 'Govandi / Chembur East',   neighbourhoods: 'Govandi, Mankhurd, Deonar, Trombay, Anushakti Nagar',
    lat: 19.0480, lng: 72.9200, direction: 'East', zone: 'Eastern Suburbs',
  },
  {
    ward: 'M/W', name: 'Chembur West',             neighbourhoods: 'Chembur, Mahul, Tilak Nagar, Chunabhatti',
    lat: 19.0620, lng: 72.8980, direction: 'East', zone: 'Eastern Suburbs',
  },
  {
    ward: 'N',   name: 'Ghatkopar',                neighbourhoods: 'Ghatkopar East & West, Vikhroli, Rajawadi',
    lat: 19.0860, lng: 72.9090, direction: 'East', zone: 'Eastern Suburbs',
  },
  {
    ward: 'S',   name: 'Vikhroli / Bhandup',        neighbourhoods: 'Vikhroli, Bhandup, Kanjurmarg, Powai (east)',
    lat: 19.1170, lng: 72.9280, direction: 'East', zone: 'Eastern Suburbs',
  },
  {
    ward: 'T',   name: 'Mulund',                   neighbourhoods: 'Mulund East & West, Nahur, Bhandup North',
    lat: 19.1760, lng: 72.9560, direction: 'East', zone: 'Eastern Suburbs',
  },
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
          ${cat?.emoji ?? '\uD83D\uDCCD'} ${cat?.label ?? report.category}
        </span>
      </div>
    </div>
    <div style="padding:12px 14px 14px;">
      ${report.description ? `<p style="margin:0 0 5px;font-size:13px;color:#1f2937;line-height:1.45;font-weight:500;">${report.description}</p>` : ''}
      ${report.area_name ? `<p style="margin:0 0 8px;font-size:11px;color:#9ca3af;">\uD83D\uDCCD ${report.area_name}</p>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid #f3f4f6;">
        <span style="font-size:11px;color:#d1d5db;font-weight:500;">${getTimeAgo(report.created_at)}</span>
        <button
          data-report-id="${report.id}"
          data-upvotes="${report.upvotes}"
          style="background:#fef2f2;border:1.5px solid #fecaca;border-radius:999px;padding:5px 14px;font-size:12px;font-weight:700;cursor:pointer;color:#ef4444;font-family:Inter,sans-serif;"
        >\uD83D\uDC4D ${report.upvotes}</button>
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
  const areaLayersRef   = useRef<L.Layer[]>([]);

  // ── Cluster group ────────────────────────────────────────────────────
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
        const bg   = n < 5  ? '#ef4444' : n < 15 ? '#b91c1c' : '#7f1d1d';
        const fs   = n > 99 ? 11 : n > 9 ? 13 : 14;
        return L.divIcon({
          className: '',
          html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};border:3px solid rgba(255,255,255,0.95);box-shadow:0 3px 14px rgba(0,0,0,0.28);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:${fs}px;font-family:Inter,-apple-system,sans-serif;cursor:pointer;">${n}</div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
      },
    });
    clusterGroupRef.current = group;
    map.addLayer(group);
    return () => { map.removeLayer(group); };
  }, [map]);

  // ── Report markers ───────────────────────────────────────────────────
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
      const marker = L.marker([report.lat, report.lng], { icon: createCategoryIcon(cat.color, cat.emoji) });
      marker.bindPopup(L.popup({ maxWidth: 300, className: 'pinit-popup' }).setContent(buildPopupHTML(report)));
      marker.on('popupopen', () => {
        const el  = marker.getPopup()?.getElement();
        if (!el) return;
        const btn = el.querySelector<HTMLButtonElement>('button[data-report-id]');
        if (!btn) return;
        btn.addEventListener('click', async () => {
          if (btn.dataset.voted) return;
          btn.dataset.voted = '1';
          const n = parseInt(btn.dataset.upvotes ?? '0');
          btn.innerHTML = `\uD83D\uDC4D ${n + 1}`;
          btn.style.color = '#9ca3af';
          btn.style.borderColor = '#e5e7eb';
          btn.style.background  = '#f9fafb';
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

  // ── BMC Ward labels + hover zones ────────────────────────────────────
  useEffect(() => {
    areaLayersRef.current.forEach((l) => map.removeLayer(l));
    areaLayersRef.current = [];

    MUMBAI_AREAS.forEach((area) => {
      const count = reports.filter((r) => {
        const dLat = r.lat - area.lat;
        const dLng = r.lng - area.lng;
        return Math.sqrt(dLat * dLat + dLng * dLng) < 0.025;
      }).length;

      // Two-line label: ward code (small) + area name (larger)
      const labelMarker = L.marker([area.lat, area.lng], {
        icon: L.divIcon({
          className: '',
          html: `
            <div style="
              display:flex;flex-direction:column;align-items:center;
              pointer-events:none;user-select:none;
              text-shadow:0 1px 3px rgba(255,255,255,1),0 0 8px rgba(255,255,255,0.9);
              font-family:Inter,-apple-system,sans-serif;
            ">
              <span style="
                font-size:9px;font-weight:800;color:#ef4444;
                letter-spacing:0.1em;text-transform:uppercase;line-height:1;
              ">WARD ${area.ward}</span>
              <span style="
                font-size:11px;font-weight:700;color:#1e293b;
                letter-spacing:0.04em;text-transform:uppercase;line-height:1.2;
                margin-top:1px;white-space:nowrap;
              ">${area.name.toUpperCase()}</span>
            </div>`,
          iconSize: [160, 30],
          iconAnchor: [80, 15],
        }),
        interactive: false,
        pane: 'tooltipPane',
      } as L.MarkerOptions);

      // Invisible hover zone
      const hoverMarker = L.marker([area.lat, area.lng], {
        icon: L.divIcon({
          className: '',
          html: '<div style="width:80px;height:40px;"></div>',
          iconSize: [80, 40],
          iconAnchor: [40, 20],
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

  // ── Realtime subscription ────────────────────────────────────────────
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
      () => {},
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

      {/* Zoom controls */}
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
