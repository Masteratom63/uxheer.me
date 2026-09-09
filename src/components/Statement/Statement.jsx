import React, { useEffect, useRef } from 'react';
import { subscribeSpatial } from '../../utils/spatialController';
import './Statement.css';

/**
 * Statement Component
 * 
 * Occupies the full 100vh mobile viewport immediately when the particle intro concludes.
 * Directly driven by high-performance spatial frame bus (Zero React reconciliations on scroll).
 */
export default function Statement({ isVisible }) {
  const rootRef = useRef(null);
  const promptRef = useRef(null);

  useEffect(() => {
    if (!isVisible) return;

    return subscribeSpatial((scrollRatio) => {
      const el = rootRef.current;
      if (!el) return;

      const p = Math.max(0, Math.min(scrollRatio / 0.14, 1));
      const opacity = Math.max(0, 1 - Math.pow(p, 1.8));

      const z = p * 600;
      const scale = 1 + p * 0.16;
      el.style.transform = `translate3d(0, 0, ${z}px) scale(${scale})`;
      el.style.opacity = opacity;
      el.style.pointerEvents = opacity > 0.01 ? 'none' : 'none';

      if (promptRef.current) {
        promptRef.current.style.opacity = Math.max(0, 1 - Math.pow(p, 1.4) * 2.5);
      }
    });
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className="spatial-statement-screen"
      style={{
        transform: 'translate3d(0, 0, 0px) scale(1)',
        opacity: 1,
      }}
      aria-label="Design Statement"
    >
      <div className="statement-editorial-wrapper">
        <h1 className="statement-typography">
          I design digital experiences that make complex things feel{' '}
          <span className="statement-accent">simple.</span>
        </h1>

        {/* Minimal Understated Scroll Prompt */}
        <div
          ref={promptRef}
          className="statement-minimal-scroll"
          style={{ opacity: 1 }}
        >
          <span className="minimal-scroll-text">scroll</span>
          <span className="minimal-scroll-line" />
        </div>
      </div>
    </div>
  );
}
