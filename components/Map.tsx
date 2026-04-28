'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Report } from '@/types/report';
import { getCategoryById } from '@/lib/categories';
import { supabase } from '@/lib/supabase';
import HotspotLayer from './HotspotLayer';
import { renderToString } from 'react-dom/server';
import PinPopup from './PinPopup';

// Fix default icon paths
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MUMBAI = { lat: 19.2183, lng: 72.9781 };

function createCategoryIcon(color: string, emoji: string) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      background:${color};border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;
    "><span style="transform:rotate(45deg);font-size:14px;line-height:32px;display:block;text-align:center;">${emoji}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36],
  });
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
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Init cluster group
  useEffect(() => {
    const L2 = require('leaflet');
    require('leaflet.markercluster');
    // @ts-expect-error - markerClusterGroup added by plugin
    const group: L.MarkerClusterGroup = L2.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 60,
    });
    clusterGroupRef.current = group;
    map.addLayer(group);
    return () => { map.removeLayer(group); };
  }, [map]);

  // Sync markers when reports or filter changes
  useEffect(() => {
    const group = clusterGroupRef.current;
    if (!group) return;
    group.clearLayers();
    markersRef.current.clear();

    const filtered = activeCategory === 'all'
      ? reports
      : reports.filter((r) => r.category === activeCategory);

    filtered.forEach((report) => {
      const cat = getCategoryById(report.category);
      if (!cat) return;
      const icon = createCategoryIcon(cat.color, cat.emoji);
      const marker = L.marker([report.lat, report.lng], { icon });
      marker.bindPopup(
        renderToString(<PinPopup report={report} />),
        { maxWidth: 280, className: 'pinitpopup' }
      );
      // Re-bind events after popup opens to handle upvote button
      marker.on('popupopen', () => {
        const container = marker.getPopup()?.getElement();
        if (!container) return;
        const btn = container.querySelector('button');
        if (btn) {
          btn.addEventListener('click', async () => {
            btn.disabled = true;
            const countEl = btn;
            const currentText = countEl.textContent || '';
            const currentCount = parseInt(currentText.replace(/[^0-9]/g, '')) || 0;
            countEl.textContent = `👍 ${currentCount + 1}`;
            await fetch('/api/upvote', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: report.id }),
            });
          });
        }
      });
      group.addLayer(marker);
      markersRef.current.set(report.id, marker);
    });
  }, [reports, activeCategory]);

  // Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel('reports-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports' }, (payload) => {
        const newReport = payload.new as Report;
        onNewReport(newReport);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [onNewReport]);

  // GPS re-center
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
      center={[MUMBAI.lat, MUMBAI.lng]}
      zoom={13}
      style={{ width: '100vw', height: '100dvh' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapInner {...props} />
    </MapContainer>
  );
}
