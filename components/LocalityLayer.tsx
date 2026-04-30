'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MUMBAI_PRABHAGS,
  MUMBAI_SUBURBAN_MLAS,
  getMicroAreasByWardNo,
  getPartyStyle,
} from '@/lib/mumbai-wards';
import { getPrabhagCentroid } from '@/lib/prabhag-centroids';
import { Report } from '@/types/report';

interface Props {
  visible: boolean;
  reports: Report[];
}

// Approximate centroids for each Mumbai Assembly Constituency
// Keys = clean name after stripping the "NNN-" number prefix
const CONSTITUENCY_CENTROIDS: Record<string, [number, number]> = {
  'Borivali':               [19.233, 72.858],
  'Dahisar':                [19.272, 72.853],
  'Magathane':              [19.213, 72.862],
  'Mulund':                 [19.176, 72.958],
  'Vikhroli':               [19.105, 72.930],
  'Bhandup West':           [19.152, 72.942],
  'Jogeshwari East':        [19.147, 72.854],
  'Dindoshi':               [19.190, 72.863],
  'Kandivali East':         [19.198, 72.872],
  'Charkop':                [19.153, 72.830],
  'Malad West':             [19.188, 72.843],
  'Goregaon':               [19.158, 72.846],
  'Varsova':                [19.122, 72.820],
  'Andheri West':           [19.120, 72.832],
  'Andheri East':           [19.116, 72.866],
  'Vile Parle':             [19.099, 72.848],
  'Chandivali':             [19.080, 72.902],
  'Ghatkopar West':         [19.088, 72.908],
  'Ghatkopar East':         [19.085, 72.928],
  'Mankhurd Shivaji Nagar': [19.038, 72.920],
  'Anushakti Nagar':        [19.048, 72.930],
  'Chembur':                [19.055, 72.896],
  'Kurla (SC)':             [19.065, 72.880],
  'Kalina':                 [19.074, 72.860],
  'Vandre East':            [19.062, 72.852],
  'Vandre West':            [19.058, 72.828],
};

// Zoom level thresholds
const CONSTITUENCY_ZOOM_MIN = 10;
const WARD_ZOOM_MIN = 13;

export default function LocalityLayer({ visible, reports }: Props) {
  const map = useMap();
  const groupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    const group = L.layerGroup().addTo(map);
    groupRef.current = group;

    const build = () => {
      group.clearLayers();
      if (!visible) return;
      const z = map.getZoom();
      if (z >= WARD_ZOOM_MIN) {
        buildWardTiles(group, reports);
      } else if (z >= CONSTITUENCY_ZOOM_MIN) {
        buildConstituencyTiles(group, reports);
      }
    };

    build();
    map.on('zoomend', build);

    return () => {
      map.off('zoomend', build);
      if (groupRef.current) {
        map.removeLayer(groupRef.current);
        groupRef.current = null;
      }
    };
  }, [map, visible, reports]);

  return null;
}

// ── Constituency-level tiles (zoom 10–12) ──────────────────────────────────────
function buildConstituencyTiles(group: L.LayerGroup, reports: Report[]) {
  MUMBAI_SUBURBAN_MLAS.forEach((mla) => {
    const cleanName = mla.constituency.replace(/^\d+-/, '');
    const acNo      = mla.constituency.split('-')[0];
    const coords    = CONSTITUENCY_CENTROIDS[cleanName];
    if (!coords) return;

    const ps = getPartyStyle(mla.party);

    // Count reports within ~4 km radius of centroid
    const count = reports.filter((r) => {
      const dLat = (r.lat - coords[0]) * 111;
      const dLng = (r.lng - coords[1]) * 111 * Math.cos((coords[0] * Math.PI) / 180);
      return Math.sqrt(dLat * dLat + dLng * dLng) < 4;
    }).length;

    const cColor =
      count === 0 ? '#22c55e' :
      count < 5   ? '#f97316' : '#ef4444';

    const icon = L.divIcon({
      className: '',
      html: `
        <div class="pinit-constituency-tile">
          <div class="pct-topbar" style="background:${ps.text}"></div>
          <div class="pct-acno">AC ${acNo}</div>
          <div class="pct-name">${cleanName}</div>
          <div class="pct-row">
            <span class="pct-party" style="background:${ps.bg};color:${ps.text};border-color:${ps.border}">${mla.party}</span>
            ${count > 0 ? `<span class="pct-count" style="color:${cColor};background:${cColor}18;border-color:${cColor}44">⚠ ${count}</span>` : ''}
          </div>
          <div class="pct-mla">${mla.mla_name}</div>
        </div>
      `,
      iconSize:   [176, 92],
      iconAnchor: [88, 46],
    });

    const marker = L.marker(coords, { icon, interactive: true });
    group.addLayer(marker);
  });
}

// ── Ward-level tiles (zoom 13+) ────────────────────────────────────────────────
function buildWardTiles(group: L.LayerGroup, reports: Report[]) {
  MUMBAI_PRABHAGS.forEach((prabhag) => {
    const centroid = getPrabhagCentroid(prabhag.ward_no);
    const [lat, lng] = centroid;

    const localities      = getMicroAreasByWardNo(prabhag.ward_no);
    const primaryLocality = (localities[0] ?? `Prabhag ${prabhag.ward_no}`)
      .split(',')[0]
      .split(' ')
      .slice(0, 3)
      .join(' ');

    const ps = getPartyStyle(prabhag.party);

    const count = reports.filter((r) => {
      const dLat = (r.lat - lat) * 111;
      const dLng = (r.lng - lng) * 111 * Math.cos((lat * Math.PI) / 180);
      return Math.sqrt(dLat * dLat + dLng * dLng) < 1.5;
    }).length;

    const cColor =
      count === 0 ? '#94a3b8' :
      count < 5   ? '#f97316' : '#ef4444';

    const tileH = count > 0 ? 64 : 52;

    const icon = L.divIcon({
      className: '',
      html: `
        <div class="pinit-ward-tile">
          <div class="pwt-stripe" style="background:${ps.text}"></div>
          <div class="pwt-body">
            <div class="pwt-ward">Ward ${prabhag.ward_no}</div>
            <div class="pwt-locality">${primaryLocality}</div>
            ${count > 0 ? `<div class="pwt-count" style="color:${cColor}">⚠ ${count} report${count !== 1 ? 's' : ''}</div>` : ''}
          </div>
        </div>
      `,
      iconSize:   [128, tileH],
      iconAnchor: [64, tileH / 2],
    });

    const marker = L.marker([lat, lng], { icon, interactive: true });
    group.addLayer(marker);
  });
}
