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

const BMC_WARD_INFO: Record<string, {
  name: string;
  neighbourhoods: string;
  direction: string;
  zone: string;
}> = {
  'A':   { name: 'Colaba / Churchgate',      neighbourhoods: 'Colaba, Navy Nagar, Churchgate, Fort, Nariman Point',        direction: 'South',   zone: 'City' },
  'B':   { name: 'Dongri / Mazagaon',        neighbourhoods: 'Masjid Bunder, Mohd. Ali Road, Dongri, Nagpada, Mazagaon',   direction: 'South',   zone: 'City' },
  'C':   { name: 'Pydhonie / Bhuleshwar',    neighbourhoods: 'Pydhonie, Bhuleshwar, Kalbadevi, Crawford Market, Mandvi',   direction: 'South',   zone: 'City' },
  'D':   { name: 'Girgaon / Malabar Hill',   neighbourhoods: 'Girgaon, Malabar Hill, Chowpatty, Grant Road, Breach Candy', direction: 'South',   zone: 'City' },
  'E':   { name: 'Byculla / Sewri',          neighbourhoods: 'Byculla, Reay Road, Sewri, NM Joshi Marg',                   direction: 'South',   zone: 'City' },
  'F/N': { name: 'Matunga / Sion',           neighbourhoods: 'Matunga, Sion, Dharavi (north), Antop Hill, Wadala',         direction: 'Central', zone: 'City' },
  'F/S': { name: 'Parel / Lower Parel',      neighbourhoods: 'Parel, Curry Road, Naigaon, Lower Parel, Lalbaug',           direction: 'Central', zone: 'City' },
  'G/N': { name: 'Dadar / Shivaji Park',     neighbourhoods: 'Dadar TT, Shivaji Park, Mahim, Hindu Colony, Dharavi',       direction: 'Central', zone: 'City' },
  'G/S': { name: 'Worli / Prabhadevi',       neighbourhoods: 'Worli, Prabhadevi, Elphinstone Road, Century Mills',         direction: 'South',   zone: 'City' },
  'H/E': { name: 'Bandra East / Dharavi',    neighbourhoods: 'Bandra East, Khar East, Santacruz East, Kurla West',         direction: 'West',    zone: 'Western Suburbs' },
  'H/W': { name: 'Bandra West',              neighbourhoods: 'Bandra West, Khar West, Santacruz West, Carter Road',        direction: 'West',    zone: 'Western Suburbs' },
  'K/E': { name: 'Andheri East / Sakinaka',  neighbourhoods: 'Andheri East, Sakinaka, Marol, JB Nagar, Chakala',           direction: 'East',    zone: 'Western Suburbs' },
  'K/W': { name: 'Andheri West / Versova',   neighbourhoods: 'Andheri West, Versova, Oshiwara, Juhu, DN Nagar',            direction: 'West',    zone: 'Western Suburbs' },
  'P/N': { name: 'Malad / Kandivali East',   neighbourhoods: 'Malad East, Kandivali East, Poisar, Charkop, Eksar',         direction: 'North',   zone: 'Western Suburbs' },
  'P/S': { name: 'Goregaon / Malad West',    neighbourhoods: 'Goregaon East & West, Malad West, Aarey Colony, Film City',  direction: 'North',   zone: 'Western Suburbs' },
  'R/C': { name: 'Kandivali West',           neighbourhoods: 'Kandivali West, Dahisar (part), Borivali West (part)',        direction: 'North',   zone: 'Western Suburbs' },
  'R/N': { name: 'Borivali North / Dahisar', neighbourhoods: 'Borivali, Dahisar East & West, Poisar Gymkhana',             direction: 'North',   zone: 'Western Suburbs' },
  'R/S': { name: 'Borivali South',           neighbourhoods: 'Borivali South, Samata Nagar, IC Colony, Shimpoli',          direction: 'North',   zone: 'Western Suburbs' },
  'L':   { name: 'Kurla / Saki Naka',        neighbourhoods: 'Kurla East & West, Chandivali, Saki Naka, Powai (part)',     direction: 'East',    zone: 'Eastern Suburbs' },
  'M/E': { name: 'Govandi / Mankhurd',       neighbourhoods: 'Govandi, Mankhurd, Deonar, Trombay, Anushakti Nagar',        direction: 'East',    zone: 'Eastern Suburbs' },
  'M/W': { name: 'Chembur West',             neighbourhoods: 'Chembur, Mahul, Tilak Nagar, Chunabhatti, Sion Koliwada',    direction: 'East',    zone: 'Eastern Suburbs' },
  'N':   { name: 'Ghatkopar',               neighbourhoods: 'Ghatkopar East & West, Vikhroli West, Rajawadi',              direction: 'East',    zone: 'Eastern Suburbs' },
  'S':   { name: 'Vikhroli / Bhandup',       neighbourhoods: 'Vikhroli East, Bhandup East & West, Kanjurmarg, Powai',      direction: 'East',    zone: 'Eastern Suburbs' },
  'T':   { name: 'Mulund',                   neighbourhoods: 'Mulund East & West, Nahur, Bhandup North, Airoli (part)',    direction: 'East',    zone: 'Eastern Suburbs' },
};

export type AreaInfo = {
  ward: string;
  name: string;
  neighbourhoods: string;
  direction: string;
  zone: string;
  count: number;
  constituency?: string;
  ac_no?: number;
  pc_name?: string;
};

export const MUMBAI_AREAS = Object.entries(BMC_WARD_INFO).map(([ward, info]) => ({
  ward, ...info, lat: 0, lng: 0,
}));

function createDotIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:10px;height:10px;border-radius:50%;
      background:#991b1b;
      border:2px solid rgba(255,255,255,0.9);
      box-shadow:0 1px 4px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

const WARD_DEFAULT_STYLE = {
  fillColor: 'transparent', fillOpacity: 0,
  color: 'rgba(153,27,27,0.35)', weight: 1.2, opacity: 1,
};
const WARD_HOVER_STYLE = {
  fillColor: 'rgba(239,68,68,0.14)', fillOpacity: 1,
  color: '#ef4444', weight: 2.5, opacity: 1,
};
const AC_DEFAULT_STYLE = {
  fillColor: 'transparent', fillOpacity: 0,
  color: 'rgba(109,40,217,0.5)', weight: 2, opacity: 1, dashArray: '6,5',
};
const AC_HOVER_STYLE = {
  fillColor: 'rgba(139,92,246,0.12)', fillOpacity: 1,
  color: '#7c3aed', weight: 3, opacity: 1, dashArray: '',
};

interface MapInnerProps {
  reports: Report[];
  activeCategory: string;
  showHeatmap: boolean;
  showConstituencies: boolean;
  onNewReport: (r: Report) => void;
  onAreaHover: (area: AreaInfo | null) => void;
  onPinClick: (report: Report) => void;
}

function MapInner({ reports, activeCategory, showHeatmap, showConstituencies, onNewReport, onAreaHover, onPinClick }: MapInnerProps) {
  const map = useMap();
  const clusterGroupRef      = useRef<L.MarkerClusterGroup | null>(null);
  const wardLayerRef         = useRef<L.GeoJSON | null>(null);
  const constituencyLayerRef = useRef<L.GeoJSON | null>(null);

  // Cluster group
  useEffect(() => {
    const group = (L as unknown as { markerClusterGroup: (o: unknown) => L.MarkerClusterGroup }).markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 55,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster: L.MarkerCluster) => {
        const n = cluster.getChildCount();
        const size = n < 10 ? 36 : n < 30 ? 44 : n < 80 ? 52 : n < 200 ? 60 : n < 500 ? 68 : 76;
        const fs = n > 999 ? 10 : n > 99 ? 12 : n > 9 ? 14 : 15;
        return L.divIcon({
          className: '',
          html: `<div style="
            width:${size}px;height:${size}px;border-radius:50%;
            background:#7f1d1d;
            border:3px solid rgba(255,255,255,0.85);
            box-shadow:0 3px 16px rgba(127,29,29,0.45);
            display:flex;align-items:center;justify-content:center;
            color:white;font-weight:800;font-size:${fs}px;
            font-family:Inter,-apple-system,sans-serif;
            cursor:pointer;letter-spacing:-0.01em;
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

  // Markers — click fires onPinClick, no Leaflet popup
  useEffect(() => {
    const group = clusterGroupRef.current;
    if (!group) return;
    group.clearLayers();
    const filtered = activeCategory === 'all' ? reports : reports.filter((r) => r.category === activeCategory);
    filtered.forEach((report) => {
      const marker = L.marker([report.lat, report.lng], { icon: createDotIcon() });
      marker.on('click', () => onPinClick(report));
      group.addLayer(marker);
    });
  }, [reports, activeCategory, onPinClick]);

  // BMC ward borders
  useEffect(() => {
    if (wardLayerRef.current) { map.removeLayer(wardLayerRef.current); wardLayerRef.current = null; }

    fetch('https://raw.githubusercontent.com/sanjanakrishnan/mumbai_spatial_data/fda8a45d4c6742cd5405f461a41ccbacc20ff29e/BMC_admin_wards.geojson')
      .then((r) => r.json())
      .then((geojson) => {
        const wardLayer = L.geoJSON(geojson, {
          style: () => ({ ...WARD_DEFAULT_STYLE }),
          onEachFeature: (feature, layer) => {
            const raw: string = (
              feature?.properties?.ward ?? feature?.properties?.WARD ??
              feature?.properties?.WardName ?? feature?.properties?.ward_no ??
              feature?.properties?.name ?? ''
            ).toString().trim().toUpperCase();
            const wardKey = raw.replace(/^([A-Z]+)([NS]|E|W|C)$/, '$1/$2');
            const info = BMC_WARD_INFO[wardKey];
            if (!info) return;

            const bounds = (layer as L.Path).getBounds?.();
            const count = bounds ? reports.filter((r) => bounds.contains(L.latLng(r.lat, r.lng))).length : 0;
            const poly = layer as L.Polygon;

            poly.on('mouseover', () => { poly.setStyle(WARD_HOVER_STYLE); onAreaHover({ ward: wardKey, ...info, count }); });
            poly.on('mouseout',  () => { poly.setStyle({ ...WARD_DEFAULT_STYLE }); onAreaHover(null); });
            poly.on('click',     () => { poly.setStyle(WARD_HOVER_STYLE); onAreaHover({ ward: wardKey, ...info, count }); });
          },
        });
        wardLayer.addTo(map);
        wardLayerRef.current = wardLayer;
      })
      .catch(console.error);

    return () => { if (wardLayerRef.current) { map.removeLayer(wardLayerRef.current); wardLayerRef.current = null; } };
  }, [map, reports, onAreaHover]);

  // Assembly constituency borders
  useEffect(() => {
    if (constituencyLayerRef.current) { map.removeLayer(constituencyLayerRef.current); constituencyLayerRef.current = null; }
    if (!showConstituencies) return;

    fetch('https://raw.githubusercontent.com/sanjanakrishnan/mumbai_spatial_data/fda8a45d4c6742cd5405f461a41ccbacc20ff29e/elections_2019/mumbai_assembly_2019.geojson')
      .then((r) => r.json())
      .then((geojson) => {
        const acLayer = L.geoJSON(geojson, {
          style: () => ({ ...AC_DEFAULT_STYLE }),
          onEachFeature: (feature, layer) => {
            const props  = feature.properties as Record<string, unknown>;
            const acName = (props?.AC_NAME as string) ?? 'Unknown';
            const acNo   = props?.AC_NO as number;
            const pcName = (props?.PC_NAME as string) ?? '';
            if (!acName) return;
            const poly = layer as L.Polygon;
            const getCount = () => reports.filter((r) => poly.getBounds().contains(L.latLng(r.lat, r.lng))).length;
            poly.on('mouseover', () => { poly.setStyle(AC_HOVER_STYLE); onAreaHover({ ward: '', name: acName, neighbourhoods: `AC No. ${acNo} · ${pcName}`, direction: '', zone: 'Assembly Constituency', count: getCount(), constituency: acName, ac_no: acNo, pc_name: pcName }); });
            poly.on('mouseout',  () => { poly.setStyle({ ...AC_DEFAULT_STYLE }); onAreaHover(null); });
            poly.on('click',     () => { poly.setStyle(AC_HOVER_STYLE); onAreaHover({ ward: '', name: acName, neighbourhoods: `AC No. ${acNo} · ${pcName}`, direction: '', zone: 'Assembly Constituency', count: getCount(), constituency: acName, ac_no: acNo, pc_name: pcName }); });
          },
        });
        acLayer.addTo(map);
        constituencyLayerRef.current = acLayer;
      })
      .catch(console.error);

    return () => { if (constituencyLayerRef.current) { map.removeLayer(constituencyLayerRef.current); constituencyLayerRef.current = null; } };
  }, [map, showConstituencies, reports, onAreaHover]);

  // Realtime
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

interface MapProps extends Omit<MapInnerProps, 'showConstituencies'> {
  totalReports: number;
  navbarHeight: number;
  showConstituencies?: boolean;
}

export default function Map({ totalReports, navbarHeight, onPinClick, ...props }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const handleAreaHover = useCallback((a: AreaInfo | null) => props.onAreaHover(a), [props.onAreaHover]);
  const handlePinClick = useCallback((r: Report) => onPinClick(r), [onPinClick]);
  const [showConstituencies, setShowConstituencies] = useState(
    props.showConstituencies ?? false
  );

  useEffect(() => {
    if (props.showConstituencies !== undefined) setShowConstituencies(props.showConstituencies);
  }, [props.showConstituencies]);

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
          onPinClick={handlePinClick}
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

      {/* Constituency toggle */}
      <button
        onClick={() => setShowConstituencies(prev => !prev)}
        style={{
          position: 'fixed', bottom: navbarHeight + 24, right: 16, zIndex: 900,
          background: showConstituencies ? '#7c3aed' : 'white',
          color: showConstituencies ? 'white' : '#374151',
          border: `1.5px solid ${showConstituencies ? '#7c3aed' : '#e5e7eb'}`,
          borderRadius: 999, padding: '7px 14px',
          fontSize: 12, fontWeight: 700, fontFamily: 'Inter,-apple-system,sans-serif',
          cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
          display: 'flex', alignItems: 'center', gap: 6,
          letterSpacing: '0.03em', transition: 'all 0.18s',
        }}
      >
        🏛️ Constituencies
      </button>
    </div>
  );
}
