'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { MUMBAI_PRABHAGS, getMicroAreasByWardNo, getPartyStyle } from '@/lib/mumbai-wards';
import { getPrabhagCentroid } from '@/lib/prabhag-centroids';
import { Report } from '@/types/report';

interface Props {
  visible: boolean;
  reports: Report[];
}

// Only show locality bubbles when zoomed in enough to be useful
const MIN_ZOOM = 13;

export default function LocalityLayer({ visible, reports }: Props) {
  const map = useMap();
  const groupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    const group = L.layerGroup();
    groupRef.current = group;

    const build = () => {
      group.clearLayers();
      if (!visible || map.getZoom() < MIN_ZOOM) return;

      MUMBAI_PRABHAGS.forEach((prabhag) => {
        const [lat, lng] = getPrabhagCentroid(prabhag.ward_no);
        const localities  = getMicroAreasByWardNo(prabhag.ward_no);
        const ps          = getPartyStyle(prabhag.party);

        // Count how many reports fall roughly near this prabhag centroid (2 km radius proxy)
        const count = reports.filter((r) => {
          const dlat = (r.lat - lat) * 111;
          const dlng = (r.lng - lng) * 111 * Math.cos((lat * Math.PI) / 180);
          return Math.sqrt(dlat * dlat + dlng * dlng) < 1.5; // ~1.5 km
        }).length;

        // Colour tiers — matches Namma Kasaa palette
        const bg =
          count === 0  ? '#64748b' :
          count < 5    ? '#f97316' :
          count < 20   ? '#b91c1c' :
                         '#7f1d1d';

        const base = 30;
        const size =
          count === 0  ? base :
          count < 5    ? base + 6 :
          count < 20   ? base + 14 :
          count < 50   ? base + 22 :
                         base + 30;

        const fs    = count > 99 ? 8 : count > 9 ? 10 : 12;
        const label = count > 0 ? String(count) : '·';

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:${size}px;height:${size}px;border-radius:50%;
            background:${bg};
            border:2.5px solid rgba(255,255,255,0.88);
            box-shadow:0 2px 10px rgba(0,0,0,0.30);
            display:flex;align-items:center;justify-content:center;
            color:white;font-weight:900;font-size:${fs}px;
            font-family:Inter,-apple-system,sans-serif;
            cursor:pointer;letter-spacing:-0.01em;
            transition:transform 0.12s;
          ">${label}</div>`,
          iconSize:   [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const primary = localities[0] ?? `Prabhag ${prabhag.ward_no}`;
        const others  = localities.slice(1);

        const marker = L.marker([lat, lng], { icon });

        marker.bindPopup(
          `<div style="font-family:Inter,-apple-system,sans-serif;min-width:180px;padding:2px 0;">
            <div style="font-size:8px;color:#94a3b8;font-weight:800;text-transform:uppercase;
              letter-spacing:0.12em;margin-bottom:4px;">
              Prabhag ${prabhag.ward_no} · Ward ${prabhag.admin_ward}
            </div>

            <div style="font-size:15px;font-weight:800;color:#0f172a;
              line-height:1.2;margin-bottom:3px;letter-spacing:-0.02em;">
              ${primary}
            </div>

            ${others.map((l) => `
              <div style="font-size:11px;color:#64748b;line-height:1.5;">${l}</div>
            `).join('')}

            <div style="margin-top:10px;padding-top:8px;border-top:1px solid #f1f5f9;
              display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <span style="
                display:inline-flex;align-items:center;gap:4px;
                font-size:10px;font-weight:800;
                color:${count === 0 ? '#16a34a' : count < 5 ? '#ea580c' : '#dc2626'};
              ">
                ${count === 0
                  ? '<span style="font-size:10px;">✓</span> No reports yet'
                  : `<span style="width:7px;height:7px;border-radius:50%;background:${bg};
                      display:inline-block;"></span> ${count} active report${count !== 1 ? 's' : ''}`
                }
              </span>
            </div>

            <div style="margin-top:6px;display:flex;align-items:center;gap:6px;">
              <span style="
                font-size:8px;font-weight:800;
                background:${ps.bg};color:${ps.text};
                border:1px solid ${ps.border};
                border-radius:5px;padding:2px 6px;
                white-space:nowrap;
              ">${prabhag.party}</span>
              <span style="font-size:10px;color:#64748b;font-weight:500;">
                ${prabhag.candidate}
              </span>
            </div>
          </div>`,
          { closeButton: false, maxWidth: 260, className: 'locality-popup' }
        );

        group.addLayer(marker);
      });
    };

    build();
    map.addLayer(group);
    map.on('zoomend', build);

    return () => {
      map.off('zoomend', build);
      map.removeLayer(group);
      groupRef.current = null;
    };
  }, [map, visible, reports]);

  return null;
}
