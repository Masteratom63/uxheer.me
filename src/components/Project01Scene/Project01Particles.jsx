import React, { useEffect, useRef } from 'react';

/**
 * Project01Particles Component
 * 
 * Dedicated local 3D spatial particle environment for Project 01: Scotiabank Scene+.
 * 
 * Key Architecture:
 *  1. Spherical Wave Arrival:
 *     A radial wave expands outward from the center, flushing through the space as
 *     Project 01's local particle field crystallizes into depth.
 *  2. Exclusive Local Scroll Space:
 *     Camera depth (camZ) is directly and exclusively driven by Project 01's scroll progress.
 *     When scrolling stops, particles remain completely settled at that position.
 *     Zero fighting with homepage scroll loops or transient wheel state.
 *  3. Spherical Wave Departure:
 *     On exit, an outward spherical wave flushes Project 01 particles into depth,
 *     gracefully clearing the volume before returning to the homepage cosmos.
 */
export default function Project01Particles({ scrollProgress = 0, isExiting = false, onExitComplete }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const stateRef = useRef({
    phase: 'entering', // 'entering' | 'active' | 'exiting'
    phaseTime: 0,
    camZ: 0,
    targetCamZ: 0,
    width: 0,
    height: 0,
    dpr: 1,
  });

  const scrollProgressRef = useRef(scrollProgress);
  scrollProgressRef.current = scrollProgress;

  const isExitingRef = useRef(isExiting);
  isExitingRef.current = isExiting;

  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;

  // Initialize particles once on mount
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
    const particleCount = isMobile ? 85 : 150;
    const totalDepth = 3200;

    const particles = [];
    const spreadX = width * 1.45;
    const spreadY = height * 1.45;

    // Palette: 75% neutral/white, 15% cyan, 10% green (Strict UXHeer brand rules)
    for (let i = 0; i < particleCount; i++) {
      const randColor = Math.random();
      let colorStyle;
      let isAccent = false;

      if (randColor < 0.15) {
        colorStyle = '#00D1FF'; // Brand Cyan
        isAccent = true;
      } else if (randColor < 0.25) {
        colorStyle = '#14FF00'; // Brand Green
        isAccent = true;
      } else if (randColor < 0.65) {
        colorStyle = 'rgba(255, 255, 255, 0.9)'; // Bright White
      } else {
        colorStyle = 'rgba(215, 228, 248, 0.65)'; // Soft White/Ice
      }

      const worldX = (Math.random() - 0.5) * spreadX;
      const worldY = (Math.random() - 0.5) * spreadY;
      const worldZ = Math.random() * totalDepth;

      const baseRadius = isMobile ? (1.0 + Math.random() * 1.4) : (1.1 + Math.random() * 1.6);
      const baseAlpha = 0.35 + Math.random() * 0.45;

      particles.push({
        worldX,
        worldY,
        worldZ,
        baseRadius,
        baseAlpha,
        colorStyle,
        isAccent,
        // Harmonic drift frequencies
        freqX: 0.3 + Math.random() * 0.5,
        freqY: 0.25 + Math.random() * 0.4,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        driftAmp: 3 + Math.random() * 6,
        // Arrival offset
        arrivalDepthOffset: 400 + Math.random() * 600,
      });
    }

    particlesRef.current = particles;
    stateRef.current.phase = 'entering';
    stateRef.current.phaseTime = performance.now();

    let startTime = performance.now();
    let exitTriggered = false;

    // Main local rAF loop
    const loop = (timestamp) => {
      const elapsed = (timestamp - startTime) / 1000;
      const state = stateRef.current;

      // Handle exit transition trigger
      if (isExitingRef.current && !exitTriggered) {
        exitTriggered = true;
        state.phase = 'exiting';
        state.phaseTime = timestamp;
      }

      const w = state.width;
      const h = state.height;
      const centerX = w / 2;
      const centerY = h / 2;
      const maxRadius = Math.hypot(centerX, centerY) * 1.25;

      // Calculate camera Z strictly based on Project 01 scroll
      const targetZ = scrollProgressRef.current * (totalDepth - 700);
      state.camZ += (targetZ - state.camZ) * 0.085;

      ctx.clearRect(0, 0, w, h);

      // Spherical wave parameters
      let enterWaveProgress = 1.0;
      let exitWaveProgress = 0.0;

      if (state.phase === 'entering') {
        const enterElapsed = (timestamp - state.phaseTime) / 1000;
        enterWaveProgress = Math.min(1.0, enterElapsed / 1.1);
        if (enterWaveProgress >= 1.0) {
          state.phase = 'active';
        }
      } else if (state.phase === 'exiting') {
        const exitElapsed = (timestamp - state.phaseTime) / 1000;
        exitWaveProgress = Math.min(1.0, exitElapsed / 0.85);
        if (exitWaveProgress >= 1.0 && onExitCompleteRef.current) {
          onExitCompleteRef.current();
          return;
        }
      }

      const enterWaveRadius = enterWaveProgress * maxRadius;
      const exitWaveRadius = exitWaveProgress * maxRadius;
      const fov = 650;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic micro-drift
        const driftX = Math.sin(elapsed * p.freqX + p.phaseX) * p.driftAmp;
        const driftY = Math.cos(elapsed * p.freqY + p.phaseY) * p.driftAmp;

        const curX = p.worldX + driftX;
        const curY = p.worldY + driftY;

        // Arrival depth interpolation
        const depthArrivalMod = (1 - enterWaveProgress) * p.arrivalDepthOffset;
        const curZ = p.worldZ + depthArrivalMod;

        // Relative Z to camera
        const relZ = ((curZ - state.camZ) % totalDepth + totalDepth) % totalDepth;

        if (relZ > 20 && relZ < totalDepth - 200) {
          const totalZ = relZ + fov;
          const scale = fov / totalZ;

          let screenX = curX * scale + centerX;
          let screenY = curY * scale + centerY;

          const distFromCenter = Math.hypot(screenX - centerX, screenY - centerY);
          const angle = Math.atan2(screenY - centerY, screenX - centerX);

          let alpha = p.baseAlpha * Math.min(scale * 1.2, 1.0);
          let radius = p.baseRadius * scale;

          // Spherical wave on enter: radial wave displacement
          if (state.phase === 'entering' && enterWaveProgress < 1.0) {
            const waveDistDiff = Math.abs(distFromCenter - enterWaveRadius);
            if (waveDistDiff < 90) {
              const wavePush = Math.exp(-Math.pow(waveDistDiff / 45, 2)) * 38;
              screenX += Math.cos(angle) * wavePush;
              screenY += Math.sin(angle) * wavePush;
              alpha *= 1.35;
            }
            // Particles outside wave front scale in gently
            if (distFromCenter > enterWaveRadius) {
              const outsideRatio = Math.max(0, 1 - (distFromCenter - enterWaveRadius) / 120);
              alpha *= outsideRatio;
            }
          }

          // Spherical wave on exit: flush outward and disperse
          if (state.phase === 'exiting') {
            if (distFromCenter < exitWaveRadius) {
              const flushedDist = exitWaveRadius - distFromCenter;
              const flushPush = Math.min(flushedDist * 0.45, 120);
              screenX += Math.cos(angle) * flushPush;
              screenY += Math.sin(angle) * flushPush;
              alpha = Math.max(0, alpha * (1 - flushedDist / 140));
            }
          }

          if (alpha > 0.02 && screenX > -20 && screenX < w + 20 && screenY > -20 && screenY < h + 20) {
            ctx.globalAlpha = Math.min(1.0, alpha);
            ctx.fillStyle = p.colorStyle;
            ctx.beginPath();
            ctx.arc(screenX, screenY, Math.max(radius, 0.8), 0, Math.PI * 2);
            ctx.fill();

            // Luminous halo for accents
            if (p.isAccent && radius >= 1.6) {
              ctx.globalAlpha = alpha * 0.25;
              ctx.beginPath();
              ctx.arc(screenX, screenY, radius * 2.1, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="project-local-canvas" aria-hidden="true" />;
}
