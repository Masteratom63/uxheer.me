import React, { useEffect, useRef, useState, useCallback } from 'react';
import { INTRO_CONFIG, getAdaptiveQuality } from './config';
import { createParticleSystem, updateParticles, renderParticles } from './particleEngine';
import { subscribeSpatial } from '../../utils/spatialController';
import LogoPresence from './LogoPresence';
import './ParticleIntro.css';

/**
 * ParticleIntro Component
 * 
 * Standalone mobile-first opening animation prototype for uxheer.me.
 * Features 5 choreographed phases:
 *  1. Arrival (Dark space with ambient suspended particles)
 *  2. Logo Presence (Integrated 3D logo mark)
 *  3. Name Formation (Particles converge into "HEER PATEL")
 *  4. Hold (Legible name with subtle living breathing drift)
 *  5. Transition Out (Gentle dispersal into depth, fading to dark background)
 */
export default function ParticleIntro({ onComplete, scrollRatio = 0, isIntroFinished = false }) {
  const canvasRef = useRef(null);
  const fgCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const loopRef = useRef(null);
  const startTimeRef = useRef(null);
  const particlesRef = useRef([]);
  const dimsRef = useRef({ width: 0, height: 0, dpr: 1 });
  const completedNotifiedRef = useRef(false);
  const isPausedRef = useRef(false);

  const scrollRatioRef = useRef(scrollRatio);
  const isIntroFinishedRef = useRef(isIntroFinished);
  isIntroFinishedRef.current = isIntroFinished;

  const currentTimeRef = useRef(0);
  const currentPhaseRef = useRef('arrival');
  const [currentPhase, setCurrentPhase] = useState('arrival');
  const [showLogo, setShowLogo] = useState(false);
  const showLogoRef = useRef(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Subscribe to high-frequency spatial camera updates without triggering React renders
  useEffect(() => {
    return subscribeSpatial((ratio) => {
      scrollRatioRef.current = ratio;
    });
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Ensure typography fonts are fully loaded before sampling
  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      }).catch(() => {
        setFontsLoaded(true);
      });
    } else {
      setFontsLoaded(true);
    }
  }, []);

  // Initialize or re-initialize canvas and particle system
  const initSystem = useCallback(() => {
    const canvas = canvasRef.current;
    const fgCanvas = fgCanvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const quality = getAdaptiveQuality(width, window.devicePixelRatio || 1);
    const dpr = quality.effectiveDpr;

    dimsRef.current = { width, height, dpr };

    // Background Canvas sizing
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Foreground Canvas sizing (exact match)
    if (fgCanvas) {
      fgCanvas.width = Math.round(width * dpr);
      fgCanvas.height = Math.round(height * dpr);
      fgCanvas.style.width = `${width}px`;
      fgCanvas.style.height = `${height}px`;
      const fgCtx = fgCanvas.getContext('2d', { alpha: true });
      if (fgCtx) {
        fgCtx.scale(dpr, dpr);
      }
    }

    // Build particle system with adaptive tier count (determined once on init)
    particlesRef.current = createParticleSystem(width, height, quality.particleCount);
    startTimeRef.current = performance.now();
    completedNotifiedRef.current = false;
    setIsCompleted(false);
  }, []);

  // Start / Restart animation
  const restartAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    initSystem();
  }, [initSystem]);

  // Main high-precision animation loop
  useEffect(() => {
    if (!fontsLoaded) return;
    if (prefersReducedMotion) return;

    initSystem();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const { timeline } = INTRO_CONFIG;

    const loop = (timestamp) => {
      if (isPausedRef.current) return;

      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsedSec = (timestamp - startTimeRef.current) / 1000;
      currentTimeRef.current = elapsedSec;

      // Determine current sequence phase
      let phase = 'arrival';
      if (elapsedSec < timeline.arrival.duration) {
        phase = 'arrival';
      } else if (elapsedSec < timeline.formation.start) {
        phase = 'logo';
      } else if (elapsedSec < timeline.hold.start) {
        phase = 'formation';
      } else if (elapsedSec < timeline.dispersal.start) {
        phase = 'hold';
      } else if (elapsedSec < timeline.totalDuration) {
        phase = 'dispersal';
      } else {
        phase = 'complete';
      }

      // Only trigger React state update when phase transitions (at most 5 times total)
      if (phase !== currentPhaseRef.current) {
        currentPhaseRef.current = phase;
        setCurrentPhase(phase);
      }

      // LogoPresence mount management (mounts at 1.8s, unmounts at 4.6s, zero 60fps churn)
      if (!showLogoRef.current && elapsedSec >= timeline.logo.start && elapsedSec < (timeline.logo.end + 0.6)) {
        showLogoRef.current = true;
        setShowLogo(true);
      } else if (showLogoRef.current && elapsedSec >= (timeline.logo.end + 0.6)) {
        showLogoRef.current = false;
        setShowLogo(false);
      }

      const { width, height } = dimsRef.current;
      const fgCanvas = fgCanvasRef.current;
      const fgCtx = fgCanvas ? fgCanvas.getContext('2d', { alpha: true }) : null;

      // Update 3D particle physics & trajectories (persistent 3D universe)
      updateParticles(
        particlesRef.current,
        elapsedSec,
        width,
        height,
        scrollRatioRef.current,
        isIntroFinishedRef.current
      );

      // Render crisp points to background and foreground canvases
      renderParticles(ctx, fgCtx, particlesRef.current, width, height, isIntroFinishedRef.current);

      // Notify completion once dispersal finishes, but keep loop running for persistent cosmos
      if (elapsedSec >= timeline.totalDuration && !completedNotifiedRef.current) {
        completedNotifiedRef.current = true;
        setIsCompleted(true);
        if (onComplete) onComplete();
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loopRef.current = loop;
    animationFrameRef.current = requestAnimationFrame(loop);

    // Tab visibility handling: pause rAF when hidden, resume when visible
    const handleVisibility = () => {
      if (document.hidden) {
        isPausedRef.current = true;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      } else {
        if (isPausedRef.current) {
          isPausedRef.current = false;
          if (loopRef.current) {
            animationFrameRef.current = requestAnimationFrame(loopRef.current);
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Responsive window resize handling
    let lastWidth = window.innerWidth;
    let resizeTimer;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        // Mobile touch scrolling causes address bar to collapse/expand, changing height ONLY.
        // Ignore height-only changes so particles never reset or flicker while scrolling!
        if (Math.abs(newWidth - lastWidth) < 14) {
          const quality = getAdaptiveQuality(newWidth, window.devicePixelRatio || 1);
          const dpr = quality.effectiveDpr;
          dimsRef.current = { width: newWidth, height: newHeight, dpr };
          if (canvasRef.current) {
            canvasRef.current.height = Math.round(newHeight * dpr);
            canvasRef.current.style.height = `${newHeight}px`;
            const ctx = canvasRef.current.getContext('2d', { alpha: true });
            if (ctx) ctx.scale(dpr, dpr);
          }
          if (fgCanvasRef.current) {
            fgCanvasRef.current.height = Math.round(newHeight * dpr);
            fgCanvasRef.current.style.height = `${newHeight}px`;
            const fgCtx = fgCanvasRef.current.getContext('2d', { alpha: true });
            if (fgCtx) fgCtx.scale(dpr, dpr);
          }
          return;
        }

        lastWidth = newWidth;

        // If intro is already complete, update canvas dimensions WITHOUT wiping or resetting particles!
        if (isIntroFinishedRef.current) {
          const quality = getAdaptiveQuality(newWidth, window.devicePixelRatio || 1);
          const dpr = quality.effectiveDpr;
          dimsRef.current = { width: newWidth, height: newHeight, dpr };
          if (canvasRef.current) {
            canvasRef.current.width = Math.round(newWidth * dpr);
            canvasRef.current.height = Math.round(newHeight * dpr);
            canvasRef.current.style.width = `${newWidth}px`;
            canvasRef.current.style.height = `${newHeight}px`;
            const ctx = canvasRef.current.getContext('2d', { alpha: true });
            if (ctx) ctx.scale(dpr, dpr);
          }
          if (fgCanvasRef.current) {
            fgCanvasRef.current.width = Math.round(newWidth * dpr);
            fgCanvasRef.current.height = Math.round(newHeight * dpr);
            fgCanvasRef.current.style.width = `${newWidth}px`;
            fgCanvasRef.current.style.height = `${newHeight}px`;
            const fgCtx = fgCanvasRef.current.getContext('2d', { alpha: true });
            if (fgCtx) fgCtx.scale(dpr, dpr);
          }
        } else {
          // If still in intro before dispersal, re-initialize targets for new width
          initSystem();
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearTimeout(resizeTimer);
    };
  }, [fontsLoaded, prefersReducedMotion, initSystem, onComplete]);

  // -------------------------------------------------------------------
  // Accessible Fallback for prefers-reduced-motion
  // -------------------------------------------------------------------
  if (prefersReducedMotion) {
    return (
      <div className="intro-container reduced-motion">
        <div className="reduced-motion-content">
          <div className="reduced-motion-logo">
            <LogoPresence currentTime={2.5} />
          </div>
          <h1 className="reduced-motion-title">{INTRO_CONFIG.typography.text}</h1>
          <p className="reduced-motion-sub">uxheer.me</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`intro-container phase-${currentPhase}`}>
        {/* 3D Particle Background Canvas (Behind project cards & editorial UI) */}
        <canvas ref={canvasRef} className="intro-canvas intro-canvas-bg" />

        {/* Phase 2: Logo Presence: strictly mounted only during logo phase */}
        {!isIntroFinished && showLogo && (
          <LogoPresence getTime={() => currentTimeRef.current} />
        )}
      </div>

      {/* 3D Particle Foreground Canvas (In front of project cards for close/crossing particles) */}
      <canvas ref={fgCanvasRef} className="intro-canvas-fg" />
    </>
  );
}
