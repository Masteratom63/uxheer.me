import React, { useState, useEffect, useRef, useCallback } from 'react';
import ParticleIntro from './components/ParticleIntro/ParticleIntro';
import Statement from './components/Statement/Statement';
import SpatialGallery from './components/SpatialGallery/SpatialGallery';
import Project01Scene from './components/Project01Scene/Project01Scene';
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
 *     - PROJECT 01: SCOTIABANK SCENE+ (Immersive full project experience)
 *  4. ABOUT / APPROACH: "I work across design, technology and visual communication."
 *  5. CAPABILITIES: Multi-depth spatial typography composition
 *  6. CONTACT: "Have something worth building? Let's talk." & calm final end state
 */
export default function App() {
  const [stage, setStage] = useState('intro'); // 'intro' | 'experience'
  // Explicit Project 01 Lifecycle: 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING'
  const [projectState, setProjectState] = useState('CLOSED');
  const currentRatioRef = useRef(0);
  const rafIdRef = useRef(null);

  const isProjectActive = projectState !== 'CLOSED';

  // Callback when particle intro completes dispersal
  const handleIntroComplete = useCallback(() => {
    setStage('experience');
  }, []);

  // Lock scroll during intro or while inside full project presentation
  useEffect(() => {
    if (stage === 'intro' || isProjectActive) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (stage === 'intro') {
        window.scrollTo(0, 0);
      }
    } else {
      document.body.style.overflowY = 'auto';
      document.documentElement.style.overflowY = 'auto';
    }
  }, [stage, isProjectActive]);

  // High-performance continuous scroll & camera lerp engine
  // Pauses while Project 01 is active so homepage scroll never conflicts with Project 01
  useEffect(() => {
    if (stage === 'intro' || isProjectActive) return;

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
  }, [stage, isProjectActive]);

  // Explicit State Machine: Enter Project 01 (CLOSED -> OPENING)
  const handleEnterProject01 = useCallback(() => {
    setProjectState((prev) => {
      if (prev !== 'CLOSED') return prev; // Prevent duplicate triggers
      return 'OPENING';
    });
  }, []);

  // Explicit State Machine: Open Wave Complete (OPENING -> OPEN)
  const handleOpenComplete = useCallback(() => {
    setProjectState((prev) => {
      if (prev !== 'OPENING') return prev;
      return 'OPEN';
    });
  }, []);

  // Explicit State Machine: Trigger Exit Wave (OPEN -> CLOSING)
  const handleTriggerExit = useCallback(() => {
    setProjectState((prev) => {
      if (prev !== 'OPEN') return prev; // Ignore if already closing
      return 'CLOSING';
    });
  }, []);

  // Explicit State Machine: Exit Wave Complete (CLOSING -> CLOSED)
  // Decisively returns to Project 01 focal point (0.16) where Project 02 is completely invisible in deep space
  const handleExitComplete = useCallback(() => {
    setProjectState((prev) => {
      if (prev !== 'CLOSING') return prev;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScroll = maxScroll * 0.16;
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
      currentRatioRef.current = 0.16;
      updateSpatial(0.16);
      return 'CLOSED';
    });
  }, []);

  const isIntroFinished = stage === 'experience';

  return (
    <main className={`spatial-experience ${isProjectActive ? 'project-active' : ''} project-${projectState.toLowerCase()}`}>
      {/* ONE Persistent 3D Spatial Particle Field throughout the Homepage */}
      <ParticleIntro
        onComplete={handleIntroComplete}
        isIntroFinished={isIntroFinished}
      />

      {/* 1. STATEMENT: Immediate 100vh Spatial Statement */}
      <Statement isVisible={isIntroFinished} />

      {/* 2. SELECTED WORK: Sequential 3D Spatial Gallery (Project 01 -> 02 -> 03) */}
      <SpatialGallery
        isIntroFinished={isIntroFinished}
        onEnterProject01={handleEnterProject01}
        projectState={projectState}
      />

      {/* PROJECT 01 IMMERSIVE PRESENTATION: Scotiabank Scene+ with Isolated Lifecycle */}
      <Project01Scene
        lifecycleState={projectState}
        onOpenComplete={handleOpenComplete}
        onExitTrigger={handleTriggerExit}
        onExitComplete={handleExitComplete}
      />

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
