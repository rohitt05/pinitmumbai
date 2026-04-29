'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { Report } from '@/types/report';

interface HotspotLayerProps {
  reports: Report[];
  visible: boolean;
}

export default function HotspotLayer({ reports, visible }: HotspotLayerProps) {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = map.getContainer();

    // Remove any existing canvas
    if (canvasRef.current) {
      try { container.removeChild(canvasRef.current); } catch {}
      canvasRef.current = null;
    }

    if (!visible || reports.length === 0) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:400;';
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const draw = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, width, height);
      reports.forEach((r) => {
        const pt = map.latLngToContainerPoint([r.lat, r.lng]);
        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 50);
        grad.addColorStop(0, 'rgba(239,68,68,0.4)');
        grad.addColorStop(1, 'rgba(239,68,68,0)');
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 50, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
    };

    draw();
    map.on('moveend zoomend resize', draw);

    return () => {
      map.off('moveend zoomend resize', draw);
      if (canvasRef.current) {
        try { container.removeChild(canvasRef.current); } catch {}
        canvasRef.current = null;
      }
    };
  }, [map, reports, visible]);

  return null;
}
