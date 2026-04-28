'use client';

// HotspotLayer renders a canvas-based heatmap over the Leaflet map.
// It is imported inside Map.tsx and rendered conditionally.

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Report } from '@/types/report';

interface HotspotLayerProps {
  reports: Report[];
  visible: boolean;
}

export default function HotspotLayer({ reports, visible }: HotspotLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!visible) return;

    // Draw circles on canvas overlay for each report cluster
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '500';

    const container = map.getContainer();
    const updateCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, width, height);

      reports.forEach((r) => {
        const point = map.latLngToContainerPoint([r.lat, r.lng]);
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, 40
        );
        gradient.addColorStop(0, 'rgba(239,68,68,0.35)');
        gradient.addColorStop(1, 'rgba(239,68,68,0)');
        ctx.beginPath();
        ctx.arc(point.x, point.y, 40, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    };

    container.appendChild(canvas);
    updateCanvas();
    map.on('moveend zoomend', updateCanvas);

    return () => {
      map.off('moveend zoomend', updateCanvas);
      container.removeChild(canvas);
    };
  }, [map, reports, visible]);

  return null;
}
