'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
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
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MUMBAI: [number, number] = [19.076, 72.877];
const INITIAL_ZOOM = 11;

// Official BMC administrative ward data (enriches the GeoJSON features)
const BMC_WARD_INFO: Record<string, {
  name: string;
  neighbourhoods: string;
  direction: string;
  zone: string;
}> = {
  'A':   { name: 'Colaba / Churchgate',   neighbourhoods: 'Colaba, Navy Nagar, Churchgate, Fort, Nariman Point', direction: 'South',   zone: 'City' },
  'B':   { name: 'Dongri / Mazagaon',     neighbourhoods: 'Masjid Bunder, Mohd. Ali Road, Dongri, Nagpada, Mazagaon', direction: 'South',   zone: 'City' },
  'C':   { name: 'Pydhonie / Bhuleshwar', neighbourhoods: 'Pydhonie, Bhuleshwar, Kalbadevi, Crawford Market, Mandvi', direction: 'South',   zone: 'City' },
  'D':   { name: 'Girgaon / Malabar Hill', neighbourhoods: 'Girgaon, Malabar Hill, Chowpatty, Grant Road, Breach Candy', direction: 'South',   zone: 'City' },
  'E':   { name: 'Byculla / Sewri',       neighbourhoods: 'Byculla, Reay Road, Sewri, NM Joshi Marg', direction: 'South',   zone: 'City' },
  'F/N': { name: 'Matunga / Sion',        neighbourhoods: 'Matunga, Sion, Dharavi (north), Antop Hill, Wadala', direction: 'Central', zone: 'City' },
  'F/S': { name: 'Parel / Lower Parel',   neighbourhoods: 'Parel, Curry Road, Naigaon, Lower Parel, Lalbaug', direction: 'Central', zone: 'City' },
  'G/N': { name: 'Dadar / Shivaji Park',  neighbourhoods: 'Dadar TT, Shivaji Park, Mahim, Hindu Colony, Dharavi', direction: 'Central', zone: 'City' },
  'G/S': { name: 'Worli / Prabhadevi',    neighbourhoods: 'Worli, Prabhadevi, Elphinstone Road, Century Mills', direction: 'South',   zone: 'City' },
  'H/E': { name: 'Bandra East / Dharavi', neighbourhoods: 'Bandra East, Khar East, Santacruz East, Kurla West', direction: 'West',    zone: 'Western Suburbs' },
  'H/W': { name: 'Bandra West',           neighbourhoods: 'Bandra West, Khar West, Santacruz West, Carter Road, Turner Road', direction: 'West',    zone: 'Western Suburbs' },
  'K/E': { name: 'Andheri East / Sakinaka', neighbourhoods: 'Andheri East, Sakinaka, Marol, JB Nagar, Chakala', direction: 'East',    zone: 'Western Suburbs' },
  'K/W': { name: 'Andheri West / Versova', neighbourhoods: 'Andheri West, Versova, Oshiwara, Juhu, DN Nagar', direction: 'West',    zone: 'Western Suburbs' },
  'P/N': { name: 'Malad / Kandivali East', neighbourhoods: 'Malad East, Kandivali East, Poisar, Charkop, Eksar', direction: 'North',   zone: 'Western Suburbs' },
  'P/S': { name: 'Goregaon / Malad West', neighbourhoods: 'Goregaon East & West, Malad West, Aarey Colony, Film City', direction: 'North',   zone: 'Western Suburbs' },
  'R/C': { name: 'Kandivali West',         neighbourhoods: 'Kandivali West, Dahisar (part), Borivali West (part)', direction: 'North',   zone: 'Western Suburbs' },
  'R/N': { name: 'Borivali North / Dahisar', neighbourhoods: 'Borivali, Dahisar East & West, Poisar Gymkhana', direction: 'North',   zone: 'Western Suburbs' },
  'R/S': { name: 'Borivali South',         neighbourhoods: 'Borivali South, Samata Nagar, IC Colony, Shimpoli', direction: 'North',   zone: 'Western Suburbs' },
  'L':   { name: 'Kurla / Saki Naka',      neighbourhoods: 'Kurla East & West, Chandivali, Saki Naka, Powai (part)', direction: 'East',    zone: 'Eastern Suburbs' },
  'M/E': { name: 'Govandi / Mankhurd',     neighbourhoods: 'Govandi, Mankhurd, Deonar, Trombay, Anushakti Nagar', direction: 'East',    zone: 'Eastern Suburbs' },
  'M/W': { name: 'Chembur West',           neighbourhoods: 'Chembur, Mahul, Tilak Nagar, Chunabhatti, Sion Koliwada', direction: 'East',    zone: 'Eastern Suburbs' },
  'N':   { name: 'Ghatkopar',              neighbourhoods: 'Ghatkopar East & West, Vikhroli West, Rajawadi', direction: 'East',    zone: 'Eastern Suburbs' },
  'S':   { name: 'Vikhroli / Bhandup',     neighbourhoods: 'Vikhroli East, Bhandup East & West, Kanjurmarg, Powai', direction: 'East',    zone: 'Eastern Suburbs' },
  'T':   { name: 'Mulund',                 neighbourhoods: 'Mulund East & West, Nahur, Bhandup North, Airoli (part)', direction: 'East',    zone: 'Eastern Suburbs' },
};

// Exported type for hover card
export type AreaInfo = {
  ward: string;
  name: string;
  neighbourhoods: string;
  direction: string;
  zone: string;
  count: number;
  // constituency fields (optional – present when hovering a constituency)
  constituency?: string;
  ac_no?: number;
  pc_name?: string;
};

// Keep MUMBAI_AREAS for backward-compat with StatsCard key usage
export const MUMBAI_AREAS = Object.entries(BMC_WARD_INFO).map(([ward, info]) => ({
  ward, ...info, lat: 0, lng: 0,
}));

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
      ${report.area_name   ? `<p style="margin:0 0 8px;font-size:11px;color:#9ca3af;">\uD83D\uDCCD ${report.area_name}</p>` : ''}
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
  showConstituencies: boolean;
  onNewReport: (r: Report) => void;
  onAreaHover: (area: AreaInfo | null) => void;
}

function getWardFill(count: number) {
  if (count === 0) return { color: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.35)' };
  if (count < 3)  return { color: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.5)'   };
  if (count < 8)  return { color: 'rgba(249,115,22,0.14)',  border: 'rgba(249,115,22,0.55)'  };
  return              { color: 'rgba(239,68,68,0.18)',   border: 'rgba(239,68,68,0.65)'  };
}

// Distinct pastel colours cycling through 36 assembly constituencies
const AC_PALETTE = [
  'rgba(139,92,246,0.13)', 'rgba(59,130,246,0.13)', 'rgba(16,185,129,0.13)',
  'rgba(245,158,11,0.13)', 'rgba(239,68,68,0.13)',  'rgba(236,72,153,0.13)',
  'rgba(20,184,166,0.13)', 'rgba(249,115,22,0.13)', 'rgba(99,102,241,0.13)',
  'rgba(34,211,238,0.13)', 'rgba(132,204,22,0.13)', 'rgba(251,191,36,0.13)',
];
const AC_BORDER_PALETTE = [
  'rgba(139,92,246,0.55)', 'rgba(59,130,246,0.55)', 'rgba(16,185,129,0.55)',
  'rgba(245,158,11,0.55)', 'rgba(239,68,68,0.55)',  'rgba(236,72,153,0.55)',
  'rgba(20,184,166,0.55)', 'rgba(249,115,22,0.55)', 'rgba(99,102,241,0.55)',
  'rgba(34,211,238,0.55)', 'rgba(132,204,22,0.55)', 'rgba(251,191,36,0.55)',
];

function MapInner({ reports, activeCategory, showHeatmap, showConstituencies, onNewReport, onAreaHover }: MapInnerProps) {
  const map = useMap();
  const clusterGroupRef      = useRef<L.MarkerClusterGroup | null>(null);
  const wardLayerRef         = useRef<L.GeoJSON | null>(null);
  const labelLayersRef       = useRef<L.Layer[]>([]);
  const constituencyLayerRef = useRef<L.GeoJSON | null>(null);
  const acLabelLayersRef     = useRef<L.Layer[]>([]);

  // ── Cluster group setup ────────────────────────────────────────────────
  useEffect(() => {
    const group = (L as unknown as { markerClusterGroup: (o: unknown) => L.MarkerClusterGroup }).markerClusterGroup({
      chunkedLoading: true, maxClusterRadius: 60,
      spiderfyOnMaxZoom: true, showCoverageOnHover: false, zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster: L.MarkerCluster) => {
        const n = cluster.getChildCount();
        const size = n < 10 ? 38 : n < 30 ? 46 : n < 80 ? 54 : 62;
        const bg   = n < 5  ? '#ef4444' : n < 15 ? '#b91c1c' : '#7f1d1d';
        const fs   = n > 99 ? 11 : n > 9 ? 13 : 14;
        return L.divIcon({
          className: '',
          html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};border:3px solid rgba(255,255,255,0.95);box-shadow:0 3px 14px rgba(0,0,0,0.28);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:${fs}px;font-family:Inter,-apple-system,sans-serif;cursor:pointer;">${n}</div>`,
          iconSize: [size, size], iconAnchor: [size / 2, size / 2],
        });
      },
    });
    clusterGroupRef.current = group;
    map.addLayer(group);
    return () => { map.removeLayer(group); };
  }, [map]);

  // ── Report markers ─────────────────────────────────────────────────
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
          btn.innerHTML = `\uD83D\uDC4D ${n + 1}`;
          btn.style.color = '#9ca3af'; btn.style.borderColor = '#e5e7eb'; btn.style.background = '#f9fafb';
          await fetch('/api/upvote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: report.id }) });
        });
      });
      group.addLayer(marker);
    });
  }, [reports, activeCategory]);

  // ── Official BMC ward polygons (GeoJSON) + labels ────────────────────────
  useEffect(() => {
    if (wardLayerRef.current) { map.removeLayer(wardLayerRef.current); wardLayerRef.current = null; }
    labelLayersRef.current.forEach((l) => map.removeLayer(l));
    labelLayersRef.current = [];

    const GEOJSON_URL = 'https://raw.githubusercontent.com/sanjanakrishnan/mumbai_spatial_data/fda8a45d4c6742cd5405f461a41ccbacc20ff29e/BMC_admin_wards.geojson';

    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((geojson) => {
        const countByWard: Record<string, number> = {};
        Object.keys(BMC_WARD_INFO).forEach((w) => { countByWard[w] = 0; });

        const wardLayer = L.geoJSON(geojson, {
          style: (feature) => {
            const raw: string = (
              feature?.properties?.ward ??
              feature?.properties?.WARD ??
              feature?.properties?.WardName ??
              feature?.properties?.ward_no ??
              feature?.properties?.name ??
              ''
            ).toString().trim().toUpperCase();
            const wardKey = raw.replace(/^([A-Z]+)([NS]|E|W|C)$/, '$1/$2');
            const count = countByWard[wardKey] ?? 0;
            const fill  = getWardFill(count);
            return { fillColor: fill.color, fillOpacity: 1, color: fill.border, weight: 1.5, opacity: 1 };
          },
          onEachFeature: (feature, layer) => {
            const raw: string = (
              feature?.properties?.ward ??
              feature?.properties?.WARD ??
              feature?.properties?.WardName ??
              feature?.properties?.ward_no ??
              feature?.properties?.name ??
              ''
            ).toString().trim().toUpperCase();
            const wardKey = raw.replace(/^([A-Z]+)([NS]|E|W|C)$/, '$1/$2');
            const info = BMC_WARD_INFO[wardKey];

            const bounds = (layer as L.Path).getBounds?.();
            const count = bounds
              ? reports.filter((r) => { const ll = L.latLng(r.lat, r.lng); return bounds.contains(ll); }).length
              : 0;
            countByWard[wardKey] = count;

            if (!info) return;
            const poly = layer as L.Polygon;
            poly.on('mouseover', () => {
              poly.setStyle({ fillOpacity: 1, weight: 2.5, color: '#ef4444' });
              onAreaHover({ ward: wardKey, ...info, count });
            });
            poly.on('mouseout', () => {
              const fill = getWardFill(count);
              poly.setStyle({ fillColor: fill.color, fillOpacity: 1, color: fill.border, weight: 1.5 });
              onAreaHover(null);
            });
          },
        });

        wardLayer.addTo(map);
        wardLayerRef.current = wardLayer;

        wardLayer.eachLayer((layer) => {
          const feature = (layer as L.GeoJSON & { feature: GeoJSON.Feature }).feature;
          const raw: string = (
            feature?.properties?.ward ??
            feature?.properties?.WARD ??
            feature?.properties?.WardName ??
            feature?.properties?.ward_no ??
            feature?.properties?.name ??
            ''
          ).toString().trim().toUpperCase();
          const wardKey = raw.replace(/^([A-Z]+)([NS]|E|W|C)$/, '$1/$2');
          const info = BMC_WARD_INFO[wardKey];
          if (!info) return;

          const poly = layer as L.Polygon;
          const center = poly.getBounds().getCenter();

          const label = L.marker(center, {
            icon: L.divIcon({
              className: '',
              html: `
                <div style="
                  display:flex;flex-direction:column;align-items:center;
                  pointer-events:none;user-select:none;
                  text-shadow:0 1px 3px rgba(255,255,255,1),0 0 10px rgba(255,255,255,0.9);
                  font-family:Inter,-apple-system,sans-serif;
                ">
                  <span style="font-size:9px;font-weight:900;color:#ef4444;letter-spacing:0.12em;line-height:1;">WARD ${wardKey}</span>
                  <span style="font-size:10px;font-weight:700;color:#1e293b;letter-spacing:0.03em;line-height:1.3;white-space:nowrap;">${info.name.toUpperCase()}</span>
                </div>`,
              iconSize: [170, 28],
              iconAnchor: [85, 14],
            }),
            interactive: false,
            pane: 'tooltipPane',
          } as L.MarkerOptions);

          map.addLayer(label);
          labelLayersRef.current.push(label);
        });
      })
      .catch(console.error);

    return () => {
      if (wardLayerRef.current) { map.removeLayer(wardLayerRef.current); wardLayerRef.current = null; }
      labelLayersRef.current.forEach((l) => map.removeLayer(l));
      labelLayersRef.current = [];
    };
  }, [map, reports, onAreaHover]);

  // ── Assembly constituency overlay ────────────────────────────────────
  useEffect(() => {
    // Remove old constituency layer
    if (constituencyLayerRef.current) { map.removeLayer(constituencyLayerRef.current); constituencyLayerRef.current = null; }
    acLabelLayersRef.current.forEach((l) => map.removeLayer(l));
    acLabelLayersRef.current = [];

    if (!showConstituencies) return;

    const AC_GEOJSON_URL = 'https://raw.githubusercontent.com/sanjanakrishnan/mumbai_spatial_data/fda8a45d4c6742cd5405f461a41ccbacc20ff29e/elections_2019/mumbai_assembly_2019.geojson';

    fetch(AC_GEOJSON_URL)
      .then((r) => r.json())
      .then((geojson) => {
        // Build a stable colour index by AC_NO so colours are deterministic
        const acNos: number[] = [];
        (geojson.features as GeoJSON.Feature[]).forEach((f) => {
          const no = (f.properties as Record<string, unknown>)?.AC_NO as number;
          if (no && !acNos.includes(no)) acNos.push(no);
        });
        acNos.sort((a, b) => a - b);
        const acColorIndex: Record<number, number> = {};
        acNos.forEach((no, i) => { acColorIndex[no] = i % AC_PALETTE.length; });

        const acLayer = L.geoJSON(geojson, {
          style: (feature) => {
            const props = feature?.properties as Record<string, unknown>;
            const acNo  = props?.AC_NO as number;
            const ci    = acColorIndex[acNo] ?? 0;
            return {
              fillColor:   AC_PALETTE[ci],
              fillOpacity: 1,
              color:       AC_BORDER_PALETTE[ci],
              weight:      2,
              opacity:     1,
              dashArray:   '5,4',
            };
          },
          onEachFeature: (feature, layer) => {
            const props       = feature.properties as Record<string, unknown>;
            const acName: string  = (props?.AC_NAME as string) ?? 'Unknown';
            const acNo: number    = props?.AC_NO as number;
            const pcName: string  = (props?.PC_NAME as string) ?? '';
            const ci = acColorIndex[acNo] ?? 0;

            if (!acName) return;
            const poly = layer as L.Polygon;

            poly.on('mouseover', () => {
              poly.setStyle({ weight: 3, dashArray: '', color: AC_BORDER_PALETTE[ci] });
              // Fire onAreaHover with constituency info — fill dummy ward fields
              onAreaHover({
                ward: '',
                name: acName,
                neighbourhoods: `AC No. ${acNo} · ${pcName}`,
                direction: '',
                zone: 'Assembly Constituency',
                count: reports.filter((r) => {
                  const b = poly.getBounds();
                  return b.contains(L.latLng(r.lat, r.lng));
                }).length,
                constituency: acName,
                ac_no: acNo,
                pc_name: pcName,
              });
            });
            poly.on('mouseout', () => {
              poly.setStyle({ weight: 2, dashArray: '5,4', color: AC_BORDER_PALETTE[ci] });
              onAreaHover(null);
            });
          },
        });

        acLayer.addTo(map);
        constituencyLayerRef.current = acLayer;

        // Add constituency name labels
        acLayer.eachLayer((layer) => {
          const feature = (layer as L.GeoJSON & { feature: GeoJSON.Feature }).feature;
          const props   = feature.properties as Record<string, unknown>;
          const acName: string = (props?.AC_NAME as string) ?? '';
          const acNo: number   = props?.AC_NO as number;
          if (!acName) return;

          const poly   = layer as L.Polygon;
          const center = poly.getBounds().getCenter();
          const ci     = acColorIndex[acNo] ?? 0;
          // derive a readable hex from the border palette for the label colour
          const borderRgba = AC_BORDER_PALETTE[ci];
          // Extract hex-ish color for text: use a fixed set matching palette order
          const labelColors = [
            '#7c3aed','#1d4ed8','#065f46','#b45309','#b91c1c','#9d174d',
            '#0f766e','#c2410c','#4338ca','#0e7490','#4d7c0f','#b45309',
          ];
          const labelColor = labelColors[ci % labelColors.length];

          const label = L.marker(center, {
            icon: L.divIcon({
              className: '',
              html: `
                <div style="
                  display:flex;flex-direction:column;align-items:center;
                  pointer-events:none;user-select:none;
                  font-family:Inter,-apple-system,sans-serif;
                  text-shadow:0 1px 4px rgba(255,255,255,0.95),0 0 12px rgba(255,255,255,0.85);
                ">
                  <span style="font-size:8px;font-weight:800;color:${labelColor};letter-spacing:0.14em;line-height:1;opacity:0.75;">AC ${acNo}</span>
                  <span style="font-size:9.5px;font-weight:800;color:${labelColor};letter-spacing:0.04em;line-height:1.3;white-space:nowrap;">${acName.toUpperCase()}</span>
                </div>`,
              iconSize: [180, 28],
              iconAnchor: [90, 14],
            }),
            interactive: false,
            pane: 'tooltipPane',
          } as L.MarkerOptions);

          map.addLayer(label);
          acLabelLayersRef.current.push(label);
        });
      })
      .catch(console.error);

    return () => {
      if (constituencyLayerRef.current) { map.removeLayer(constituencyLayerRef.current); constituencyLayerRef.current = null; }
      acLabelLayersRef.current.forEach((l) => map.removeLayer(l));
      acLabelLayersRef.current = [];
    };
  }, [map, showConstituencies, reports, onAreaHover]);

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

  // showConstituencies toggle — wired in through props, but also expose a
  // default so it works if the parent hasn't wired it yet.
  const showConstituencies = (props as unknown as { showConstituencies?: boolean }).showConstituencies ?? false;

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
        <MapInner
          {...props}
          showConstituencies={showConstituencies}
          onAreaHover={handleAreaHover}
        />
      </MapContainer>

      {/* Zoom controls */}
      <div style={{
        position: 'fixed', top: navbarHeight + 16, right: 16, zIndex: 900,
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)', borderRadius: 10,
        overflow: 'hidden', border: '1px solid #e5e7eb',
      }}>
        <button onClick={() => mapRef.current?.zoomIn()} style={{
          width: 38, height: 38, background: 'white', border: 'none',
          borderBottom: '1px solid #f1f5f9', fontSize: 20, cursor: 'pointer', color: '#374151',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 300, lineHeight: 1,
        }}>+</button>
        <button onClick={() => mapRef.current?.zoomOut()} style={{
          width: 38, height: 38, background: 'white', border: 'none',
          fontSize: 20, cursor: 'pointer', color: '#374151',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 300, lineHeight: 1,
        }}>−</button>
      </div>

      {/* Constituency toggle pill */}
      <button
        onClick={() => {
          // Bubble up via a custom DOM event so parent page can toggle state
          mapRef.current?.getContainer().dispatchEvent(
            new CustomEvent('toggle-constituencies', { bubbles: true })
          );
        }}
        style={{
          position: 'fixed',
          bottom: navbarHeight + 24,
          right: 16,
          zIndex: 900,
          background: showConstituencies ? '#7c3aed' : 'white',
          color: showConstituencies ? 'white' : '#374151',
          border: `1.5px solid ${showConstituencies ? '#7c3aed' : '#e5e7eb'}`,
          borderRadius: 999,
          padding: '7px 14px',
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'Inter,-apple-system,sans-serif',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          letterSpacing: '0.03em',
          transition: 'all 0.18s',
        }}
      >
        🏛️ Constituencies
      </button>
    </div>
  );
}
