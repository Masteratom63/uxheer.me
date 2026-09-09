import React, { useState, useEffect, useRef, useCallback } from 'react';
import ParticleIntro from './components/ParticleIntro/ParticleIntro';
import Statement from './components/Statement/Statement';
import SpatialGallery from './components/SpatialGallery/SpatialGallery';
import About from './components/About/About';
import Capabilities from './components/Capabilities/Capabilities';
import Contact from './components/Contact/Contact';
import { updateSpatial } from './utils/spatialController';

/**
 * App Component
 * 
 * Complete UXHeer Spatial Homepage Journey:
 *  1. INTRO: Particle Arrival -> Logo -> HEER PATEL -> Dispersal
 *  2. STATEMENT: Immediate 100vh viewport state at scroll=0, fluid editorial typography
 *  3. SELECTED WORK: Sequential 3D camera travel (Project 01 -> 02 -> 03)
 *  4. ABOUT / APPROACH: "I work across design, technology and visual communication."
 *  5. CAPABILITIES: Multi-depth spatial typography composition
 *  6. CONTACT: "Have something worth building? Let's talk." & calm final end state
 */
export default function App() {
  const [stage, setStage] = useState('intro'); // 'intro' | 'experience'
  const currentRatioRef = useRef(0);
  const rafIdRef = useRef(null);

  // Callback when particle intro completes dispersal
  const handleIntroComplete = useCallback(() => {
    setStage('experience');
  }, []);

  // Lock scroll during intro; unlock once statement is reached
  useEffect(() => {
    if (stage === 'intro') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflowY = 'auto';
      document.documentElement.style.overflowY = 'auto';
    }
  }, [stage]);

  // High-performance continuous scroll & camera lerp engine
  // Zero React state updates during scrolling - directly broadcasts via spatialController
  useEffect(() => {
    if (stage === 'intro') return;

    let isRunning = true;

    const lerpLoop = () => {
      if (!isRunning) return;

      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const target = Math.max(0, Math.min(scrollY / maxScroll, 1));

      // Weighty, responsive spatial camera smoothing with velocity damping
      const rawDiff = target - currentRatioRef.current;
      const clampedDiff = Math.max(-0.05, Math.min(0.05, rawDiff));
      currentRatioRef.current += clampedDiff * 0.095;
      const cur = currentRatioRef.current;

      // Broadcast to all spatial sections directly (Zero React reconciliations on scroll!)
      updateSpatial(cur);

      rafIdRef.current = requestAnimationFrame(lerpLoop);
    };

    rafIdRef.current = requestAnimationFrame(lerpLoop);

    return () => {
      isRunning = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [stage]);

  const isIntroFinished = stage === 'experience';

  return (
    <main className="spatial-experience">
      {/* ONE Persistent 3D Spatial Particle Field throughout the Homepage */}
      <ParticleIntro
        onComplete={handleIntroComplete}
        isIntroFinished={isIntroFinished}
      />

      {/* 1. STATEMENT: Immediate 100vh Spatial Statement */}
      <Statement isVisible={isIntroFinished} />

      {/* 2. SELECTED WORK: Sequential 3D Spatial Gallery (Project 01 -> 02 -> 03) */}
      <SpatialGallery isIntroFinished={isIntroFinished} />

      {/* 3. ABOUT / APPROACH */}
      <About isIntroFinished={isIntroFinished} />

      {/* 4. CAPABILITIES: Multi-Depth Spatial Typography */}
      <Capabilities isIntroFinished={isIntroFinished} />

      {/* 5. CONTACT & CALM END STATE */}
      <Contact isIntroFinished={isIntroFinished} />

      {/* Real Scrollable Document Track (Enables native mobile touch swiping across full journey) */}
      {isIntroFinished && (
        <div
          className="spatial-scroll-track"
          style={{
            height: '680vh',
            width: '100%',
            pointerEvents: 'none',
            visibility: 'hidden',
          }}
          aria-hidden="true"
        />
      )}
    </main>
  );
}
