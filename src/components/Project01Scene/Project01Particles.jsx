import React, { useEffect, useRef } from 'react';

/**
 * Project01Particles Component
 * 
 * Dedicated 3D spatial particle corridor for Project 01: Scotiabank Scene+.
 * 
 * Key Architecture:
 *  1. Non-Wrapping Linear Depth Corridor:
 *     Particles are distributed along a continuous depth track (0 to 18,000px).
 *     Camera depth (camZ) strictly advances forward as the user scrolls down.
 *     Particles pass the camera and stay behind the camera. ZERO modulo wrapping.
 *     Eliminates any backward particle snapping across sections.
 *  2. Symmetrical Spherical Waves:
 *     - Entry Wave: Radial disturbance sweeps outward across the field (0.0s to 1.35s).
 *     - Exit Wave: Identical radial disturbance sweeps outward across the field (0.0s to 1.35s)
 *       while the homepage cosmos seamlessly materializes beneath the wave.
 */
export default function Project01Particles({
  scrollProgress = 0,
  lifecycleState = 'OPENING', // 'OPENING' | 'OPEN' | 'CLOSING'
  onOpenComplete,
  onExitComplete,
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  const scrollProgressRef = useRef(scrollProgress);
  scrollProgressRef.current = scrollProgress;

  const lifecycleRef = useRef(lifecycleState);
  lifecycleRef.current = lifecycleState;

  const onOpenCompleteRef = useRef(onOpenComplete);
  onOpenCompleteRef.current = onOpenComplete;

  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;

  const stateRef = useRef({
    camZ: 0,
    targetCamZ: 0,
    width: 0,
    height: 0,
    dpr: 1,
    openStartTime: null,
    openNotified: false,
    exitStartTime: null,
    exitNotified: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    stateRef.current.width = width;
    stateRef.current.height = height;
    stateRef.current.dpr = dpr;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (ctx) ctx.scale(dpr, dpr);

    const isMobile = width <= 640;
    const particleCount = isMobile ? 180 : 360;
    // Continuous non-wrapping corridor track across entire case study
    const totalTrackDepth = 18000;

    const particles = [];
    const spreadX = width * 1.5;
    const spreadY = height * 1.5;

    // Palette: 76% neutral white/ice, 12% brand cyan (#00D1FF), 12% brand green (#14FF00)
    for (let i = 0; i < particleCount; i++) {
      const randColor = Math.random();
      let colorStyle;
      let isAccent = false;

      if (randColor < 0.12) {
        colorStyle = '#00D1FF'; // Brand Cyan
        isAccent = true;
      } else if (randColor < 0.24) {
        colorStyle = '#14FF00'; // Brand Green
        isAccent = true;
      } else if (randColor < 0.65) {
        colorStyle = 'rgba(255, 255, 255, 0.9)'; // Crisp White
      } else {
        colorStyle = 'rgba(215, 230, 252, 0.65)'; // Soft Ice White
      }

      const worldX = (Math.random() - 0.5) * spreadX;
      const worldY = (Math.random() - 0.5) * spreadY;
      // Uniformly distributed along the full corridor
      const worldZ = Math.random() * totalTrackDepth;

      const baseRadius = isMobile ? (1.0 + Math.random() * 1.4) : (1.1 + Math.random() * 1.8);
      const baseAlpha = 0.35 + Math.random() * 0.45;

      particles.push({
        worldX,
        worldY,
        worldZ,
        baseRadius,
        baseAlpha,
        colorStyle,
        isAccent,
        // Harmonic micro-drift
        freqX: 0.3 + Math.random() * 0.4,
        freqY: 0.25 + Math.random() * 0.35,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        driftAmp: 2.0 + Math.random() * 3.5,
        // Entry depth arrival offset
        entryDepthOffset: 450 + Math.random() * 600,
      });
    }

    particlesRef.current = particles;
    const state = stateRef.current;
    state.openStartTime = performance.now();
    state.openNotified = false;
    state.exitStartTime = null;
    state.exitNotified = false;

    let startTime = performance.now();

    // Main 3D animation and wave renderer
    const loop = (timestamp) => {
      const elapsed = (timestamp - startTime) / 1000;
      const w = state.width;
      const h = state.height;
      const centerX = w / 2;
      const centerY = h / 2;
      const maxRadius = Math.hypot(centerX, centerY) * 1.35;
      const currentLifecycle = lifecycleRef.current;

      // Detect start of CLOSING phase
      if (currentLifecycle === 'CLOSING' && !state.exitStartTime) {
        state.exitStartTime = timestamp;
      }

      // Linear Corridor Travel Distance (0 to 15,500px)
      const travelDistance = 15500;
      const targetZ = scrollProgressRef.current * travelDistance;
      // Stable forward camera travel (freezes in place when scrolling stops)
      state.camZ += (targetZ - state.camZ) * 0.09;

      ctx.clearRect(0, 0, w, h);

      // -------------------------------------------------------------
      // Phase 1: Spherical Wave Entry (0.0s to 1.35s)
      // -------------------------------------------------------------
      let openProgress = 1.0;
      if (currentLifecycle === 'OPENING') {
        const openElapsed = (timestamp - state.openStartTime) / 1000;
        openProgress = Math.min(1.0, openElapsed / 1.35);

        if (openProgress >= 1.0 && !state.openNotified) {
          state.openNotified = true;
          if (onOpenCompleteRef.current) {
            onOpenCompleteRef.current();
          }
        }
      }

      // -------------------------------------------------------------
      // Phase 2: Spherical Wave Exit (0.0s to 1.35s - Identical Timing)
      // -------------------------------------------------------------
      let exitProgress = 0.0;
      if (currentLifecycle === 'CLOSING' && state.exitStartTime) {
        const exitElapsed = (timestamp - state.exitStartTime) / 1000;
        exitProgress = Math.min(1.0, exitElapsed / 1.35);

        if (exitProgress >= 1.0 && !state.exitNotified) {
          state.exitNotified = true;
          if (onExitCompleteRef.current) {
            onExitCompleteRef.current();
            return;
          }
        }
      }

      // Dynamic wavefront radii (Identical smooth fast-out wavefront expansion)
      const enterWaveRadius = Math.pow(openProgress, 0.75) * maxRadius;
      const exitWaveRadius = Math.pow(exitProgress, 0.75) * maxRadius;

      const fov = 580;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Living micro-drift
        const driftX = Math.sin(elapsed * p.freqX + p.phaseX) * p.driftAmp;
        const driftY = Math.cos(elapsed * p.freqY + p.phaseY) * p.driftAmp;

        const curX = p.worldX + driftX;
        const curY = p.worldY + driftY;

        // Arrival depth settlement during open wave
        const entryZOffset = (1 - openProgress) * p.entryDepthOffset;
        const curZ = p.worldZ + entryZOffset;

        // PURE LINEAR CORRIDOR DEPTH:
        // No modulo wrapping! As particles pass the camera (relZ <= 10), they stay behind!
        const relZ = curZ - state.camZ;

        // Only process particles ahead of camera and within visible depth fog
        if (relZ > 10 && relZ < 3200) {
          const totalZ = relZ + fov;
          let scale = fov / totalZ;

          let screenX = curX * scale + centerX;
          let screenY = curY * scale + centerY;

          const distFromCenter = Math.hypot(screenX - centerX, screenY - centerY);
          const angle = Math.atan2(screenY - centerY, screenX - centerX);

          // Authentic depth attenuation & fog clipping
          const nearFade = relZ < 140 ? (relZ / 140) : 1.0;
          const farFade = relZ > 2400 ? Math.max(0, 1 - (relZ - 2400) / 800) : 1.0;
          let alpha = p.baseAlpha * nearFade * farFade * Math.min(scale * 1.3, 1.0);
          let radius = p.baseRadius * scale;

          // -----------------------------------------------------------
          // Spherical Wave Arrival Physics (Home -> Project 1)
          // -----------------------------------------------------------
          if (currentLifecycle === 'OPENING' && openProgress < 1.0) {
            const waveDistDiff = Math.abs(distFromCenter - enterWaveRadius);
            const bandWidth = 140;

            if (waveDistDiff < bandWidth) {
              const waveIntensity = 1 - waveDistDiff / bandWidth;
              const wavePush = Math.pow(waveIntensity, 1.5) * 160;
              screenX += Math.cos(angle) * wavePush;
              screenY += Math.sin(angle) * wavePush;
              scale *= (1 + waveIntensity * 1.25);
              radius *= (1 + waveIntensity * 1.25);
              alpha = Math.min(1.0, alpha * (1 + waveIntensity * 1.1) + 0.2);
            }

            if (distFromCenter > enterWaveRadius) {
              const outsideDist = distFromCenter - enterWaveRadius;
              const fadeRatio = Math.max(0, 1 - outsideDist / 160);
              alpha *= (0.2 + 0.8 * fadeRatio);
            }
          }

          // -----------------------------------------------------------
          // Identical Spherical Wave Departure Physics (Project 1 -> Home)
          // -----------------------------------------------------------
          if (currentLifecycle === 'CLOSING' && exitProgress < 1.0) {
            const waveDistDiff = Math.abs(distFromCenter - exitWaveRadius);
            const bandWidth = 140;

            if (waveDistDiff < bandWidth) {
              const waveIntensity = 1 - waveDistDiff / bandWidth;
              const wavePush = Math.pow(waveIntensity, 1.5) * 160;
              screenX += Math.cos(angle) * wavePush;
              screenY += Math.sin(angle) * wavePush;
              scale *= (1 + waveIntensity * 1.25);
              radius *= (1 + waveIntensity * 1.25);
              alpha = Math.min(1.0, alpha * (1 + waveIntensity * 1.1) + 0.2);
            }

            // Smooth outward dispersal behind the wave crest
            if (distFromCenter < exitWaveRadius) {
              const flushedDist = exitWaveRadius - distFromCenter;
              const flushPush = Math.min(flushedDist * 1.1, 220);
              screenX += Math.cos(angle) * flushPush;
              screenY += Math.sin(angle) * flushPush;
              alpha = Math.max(0, alpha * (1 - flushedDist / 180));
            }
          }

          // Render particle to canvas
          if (alpha > 0.02 && screenX > -30 && screenX < w + 30 && screenY > -30 && screenY < h + 30) {
            ctx.globalAlpha = Math.min(1.0, alpha);
            ctx.fillStyle = p.colorStyle;
            ctx.beginPath();
            ctx.arc(screenX, screenY, Math.max(radius, 0.85), 0, Math.PI * 2);
            ctx.fill();

            // Luminous halo for cyan / mint accent particles
            if (p.isAccent && radius >= 1.5) {
              ctx.globalAlpha = alpha * 0.28;
              ctx.beginPath();
              ctx.arc(screenX, screenY, radius * 2.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    // Responsive window resize
    const handleResize = () => {
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      stateRef.current.width = newW;
      stateRef.current.height = newH;
      if (canvasRef.current) {
        canvasRef.current.width = Math.round(newW * dpr);
        canvasRef.current.height = Math.round(newH * dpr);
        canvasRef.current.style.width = `${newW}px`;
        canvasRef.current.style.height = `${newH}px`;
        const c = canvasRef.current.getContext('2d', { alpha: true });
        if (c) c.scale(dpr, dpr);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="project-local-canvas" aria-hidden="true" />;
}
