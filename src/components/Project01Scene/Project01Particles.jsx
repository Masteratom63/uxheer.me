import React, { useEffect, useRef } from 'react';

/**
 * Project01Particles Component
 * 
 * Dedicated, isolated 3D spatial particle cosmos for Project 01: Scotiabank Scene+.
 * 
 * Features:
 *  1. Visible Spherical Wave Arrival:
 *     A substantial radial wave propagates outward across the particle field (0.0s to 1.35s),
 *     flushing the initial space and allowing Project 01's local particles to settle from depth.
 *  2. Genuine 3D Camera Travel Driven by Scroll:
 *     Camera depth (camZ) and gentle lateral curve (camX, camY) are tied directly to Project 01's
 *     internal scroll progress.
 *  3. Persistent Spatial Coordinates:
 *     When scrolling stops, particles freeze at their exact 3D coordinates. Zero snap-back.
 *  4. Visible Spherical Wave Departure:
 *     On exit, an outward spherical wave flushes Project 01 particles outward into deep space
 *     over 900ms before returning to the homepage cosmos.
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
    camX: 0,
    camY: 0,
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
    const particleCount = isMobile ? 120 : 240;
    const totalDepth = 3600;

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
      const worldZ = Math.random() * totalDepth;

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
        // Micro-harmonic living breathing drift
        freqX: 0.3 + Math.random() * 0.4,
        freqY: 0.25 + Math.random() * 0.35,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        driftAmp: 2.5 + Math.random() * 5,
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

      // 3D Camera Travel Depth tied directly to Project 01 scroll
      const travelDistance = totalDepth - 800;
      const targetZ = scrollProgressRef.current * travelDistance;
      // Fast, stable spatial settling (particles freeze when scrolling stops)
      state.camZ += (targetZ - state.camZ) * 0.09;
      // Subtle organic lateral camera curvature
      state.camX = Math.sin(scrollProgressRef.current * Math.PI * 2) * 85;
      state.camY = Math.cos(scrollProgressRef.current * Math.PI * 1.5) * 55;

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
      // Phase 2: Spherical Wave Exit (0.0s to 0.90s)
      // -------------------------------------------------------------
      let exitProgress = 0.0;
      if (currentLifecycle === 'CLOSING' && state.exitStartTime) {
        const exitElapsed = (timestamp - state.exitStartTime) / 1000;
        exitProgress = Math.min(1.0, exitElapsed / 0.90);

        if (exitProgress >= 1.0 && !state.exitNotified) {
          state.exitNotified = true;
          if (onExitCompleteRef.current) {
            onExitCompleteRef.current();
            return;
          }
        }
      }

      // Dynamic wavefront radii
      // Entry: smooth fast-out wavefront expansion
      const enterWaveRadius = Math.pow(openProgress, 0.75) * maxRadius;
      // Exit: accelerating outward flush
      const exitWaveRadius = Math.pow(exitProgress, 1.25) * maxRadius;

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

        // Relative Z to Camera (wrapping through depth volume)
        const relZ = ((curZ - state.camZ) % totalDepth + totalDepth) % totalDepth;

        if (relZ > 20 && relZ < totalDepth - 160) {
          const totalZ = relZ + fov;
          let scale = fov / totalZ;

          let screenX = (curX - state.camX) * scale + centerX;
          let screenY = (curY - state.camY) * scale + centerY;

          const distFromCenter = Math.hypot(screenX - centerX, screenY - centerY);
          const angle = Math.atan2(screenY - centerY, screenX - centerX);

          // Authentic depth attenuation & fog clipping
          const nearFade = relZ < 140 ? (relZ / 140) : 1.0;
          const farFade = relZ > 2600 ? Math.max(0, 1 - (relZ - 2600) / 1000) : 1.0;
          let alpha = p.baseAlpha * nearFade * farFade * Math.min(scale * 1.3, 1.0);
          let radius = p.baseRadius * scale;

          // -----------------------------------------------------------
          // Visible Spherical Wave Arrival Physics
          // -----------------------------------------------------------
          if (currentLifecycle === 'OPENING' && openProgress < 1.0) {
            const waveDistDiff = Math.abs(distFromCenter - enterWaveRadius);
            const bandWidth = 140;

            if (waveDistDiff < bandWidth) {
              const waveIntensity = 1 - waveDistDiff / bandWidth;
              // Substantial outward displacement along radial vector
              const wavePush = Math.pow(waveIntensity, 1.5) * 160;
              screenX += Math.cos(angle) * wavePush;
              screenY += Math.sin(angle) * wavePush;
              // Scale boost and luminosity boost along wave crest
              scale *= (1 + waveIntensity * 1.25);
              radius *= (1 + waveIntensity * 1.25);
              alpha = Math.min(1.0, alpha * (1 + waveIntensity * 1.1) + 0.2);
            }

            // Particles ahead of the wave remain waiting; settle in after wave crest passes
            if (distFromCenter > enterWaveRadius) {
              const outsideDist = distFromCenter - enterWaveRadius;
              const fadeRatio = Math.max(0, 1 - outsideDist / 160);
              alpha *= (0.2 + 0.8 * fadeRatio);
            }
          }

          // -----------------------------------------------------------
          // Visible Spherical Wave Departure Physics
          // -----------------------------------------------------------
          if (currentLifecycle === 'CLOSING') {
            if (distFromCenter < exitWaveRadius) {
              const flushedDist = exitWaveRadius - distFromCenter;
              // Accelerating radial flush toward edge of viewport
              const flushPush = Math.min(flushedDist * 1.4 + 40, 320);
              screenX += Math.cos(angle) * flushPush;
              screenY += Math.sin(angle) * flushPush;
              // Fade out into depth
              alpha = Math.max(0, alpha * (1 - flushedDist / 200) * (1 - exitProgress * 1.1));
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
