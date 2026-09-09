import React, { useEffect, useRef } from 'react';
import { subscribeSpatial } from '../../utils/spatialController';
import './About.css';

/**
 * About Component (About / Approach)
 * 
 * Full-screen spatial section living directly in the 3D environment (zero cards).
 * Enters from depth as Project 03 recedes, occupies its own spatial layer,
 * and glides smoothly past the camera as the user scrolls into Capabilities.
 * Directly driven by spatial frame bus (Zero React reconciliations on scroll).
 */
export default function About({ isIntroFinished }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isIntroFinished) return;

    const focusPoint = 0.61;
    const approachWindow = 0.10;
    const departWindow = 0.09;

    return subscribeSpatial((scrollRatio) => {
      const el = rootRef.current;
      if (!el) return;

      const delta = scrollRatio - focusPoint;
      if (delta < -approachWindow || delta > departWindow) {
        el.style.opacity = 0;
        el.style.pointerEvents = 'none';
        return;
      }

      let opacity = 1;
      let z = 0;
      let scale = 1;

      if (delta < 0) {
        // Approaching from depth
        const u = -delta / approachWindow;
        opacity = Math.max(0, 1 - Math.pow(u, 1.6));
        z = delta * 1000;
        scale = 1 - u * 0.20;
      } else {
        // Departing forward past camera
        const v = delta / departWindow;
        opacity = Math.max(0, 1 - Math.pow(v, 1.8));
        z = delta * 600;
        scale = 1 + v * 0.15;
      }

      el.style.transform = `translate3d(0, 0, ${z}px) scale(${scale})`;
      el.style.opacity = opacity;
      el.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    });
  }, [isIntroFinished]);

  if (!isIntroFinished) return null;

  return (
    <section
      ref={rootRef}
      className="spatial-about-screen"
      style={{ opacity: 0, pointerEvents: 'none' }}
      aria-label="About and Approach"
    >
      <div className="about-editorial-wrapper">
        <span className="about-eyebrow">ABOUT / APPROACH</span>
        
        <h2 className="about-headline">
          I work across design, technology and visual communication.
        </h2>

        <p className="about-paragraph">
          From digital products and interfaces to visual systems and physical experiences, I like working where ideas, technology and craft overlap.
        </p>
      </div>
    </section>
  );
}
