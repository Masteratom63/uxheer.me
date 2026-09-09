import React, { useEffect, useRef } from 'react';
import { subscribeSpatial } from '../../utils/spatialController';
import './Capabilities.css';

const CATEGORIES = [
  { label: 'UX / UI',       x: -24, y: -26, baseZ: 140,  speed: 1.5, isAccent: true },
  { label: 'PRODUCT',       x: 20,  y: -14, baseZ: 220,  speed: 1.9, isAccent: false },
  { label: 'WEB',           x: -26, y: -2,  baseZ: -160, speed: 0.8, isAccent: false },
  { label: 'MOTION',        x: 4,   y: 10,  baseZ: 180,  speed: 1.6, isAccent: true },
  { label: 'VISUAL',        x: 22,  y: 22,  baseZ: 40,   speed: 1.2, isAccent: false },
  { label: 'GRAPHIC',       x: -20, y: 26,  baseZ: -240, speed: 0.6, isAccent: false },
  { label: 'PRINT',         x: 18,  y: 36,  baseZ: -100, speed: 0.9, isAccent: false },
  { label: 'EXPERIMENTS',   x: -2,  y: 44,  baseZ: 60,   speed: 1.3, isAccent: true },
];

/**
 * Capabilities Component
 * 
 * Spatial typography-based composition at multiple virtual depths.
 * Directly driven by spatial frame bus (Zero React reconciliations on scroll).
 */
export default function Capabilities({ isIntroFinished }) {
  const rootRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (!isIntroFinished) return;

    const focusPoint = 0.77;
    const approachWindow = 0.09;
    const departWindow = 0.08;

    return subscribeSpatial((scrollRatio) => {
      const root = rootRef.current;
      if (!root) return;

      const delta = scrollRatio - focusPoint;

      if (delta < -approachWindow || delta > departWindow) {
        root.style.opacity = 0;
        root.style.pointerEvents = 'none';
        return;
      }

      const normDist = delta < 0 ? -delta / approachWindow : delta / departWindow;
      const sectionOpacity = Math.max(0, 1 - Math.pow(normDist, 1.7));
      root.style.opacity = sectionOpacity;
      root.style.pointerEvents = sectionOpacity > 0.1 ? 'auto' : 'none';

      for (let i = 0; i < CATEGORIES.length; i++) {
        const itemEl = itemsRef.current[i];
        if (!itemEl) continue;

        const cat = CATEGORIES[i];
        const currentZ = cat.baseZ + delta * cat.speed * 1600;
        const scale = Math.max(0.6, Math.min(1.3, 1 + currentZ / 800));
        const itemOpacity = Math.max(0, Math.min(1, 0.4 + (currentZ + 300) / 600));

        itemEl.style.transform = `translate3d(-50%, -50%, 0) translate3d(${cat.x}vw, ${cat.y}vh, ${currentZ}px) scale(${scale})`;
        itemEl.style.opacity = itemOpacity;
      }
    });
  }, [isIntroFinished]);

  if (!isIntroFinished) return null;

  return (
    <section
      ref={rootRef}
      className="spatial-capabilities-screen"
      style={{ opacity: 0, pointerEvents: 'none' }}
      aria-label="Capabilities"
    >
      {/* Section Eyebrow */}
      <div className="capabilities-header">
        <span className="capabilities-eyebrow">CAPABILITIES / PRACTICES</span>
      </div>

      {/* 3D Spatial Typography Layer */}
      <div className="capabilities-stage">
        {CATEGORIES.map((cat, idx) => (
          <div
            key={cat.label}
            ref={(el) => { itemsRef.current[idx] = el; }}
            className={`capability-item ${cat.isAccent ? 'accent-tint' : ''}`}
          >
            <span className="capability-text">{cat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
