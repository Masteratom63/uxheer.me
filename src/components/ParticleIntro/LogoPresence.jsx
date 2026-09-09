import React, { useRef, useEffect } from 'react';
import { INTRO_CONFIG } from './config';

/**
 * LogoPresence Component
 * 
 * Renders the user's exact vector logo in the center of the 3D space.
 * Seamlessly integrated into the particle field without cards or containers.
 */
export default function LogoPresence({ getTime, currentTime }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let rafId;
    const { logo } = INTRO_CONFIG.timeline;

    const tick = () => {
      const el = containerRef.current;
      if (!el) return;

      const time = getTime ? getTime() : (currentTime || 0);
      let opacity = 0;
      let scale = 0.95;
      let translateY = 0;

      if (time >= logo.start && time <= logo.end) {
        const elapsed = time - logo.start;
        if (elapsed < logo.fadeInDuration) {
          const p = elapsed / logo.fadeInDuration;
          opacity = p * 0.92;
          scale = 0.95 + 0.05 * (1 - Math.pow(1 - p, 3));
        } else if (time < logo.end - logo.fadeOutDuration) {
          opacity = 0.92;
          const holdProgress = (elapsed - logo.fadeInDuration) / logo.visibleDuration;
          scale = 1.0 + Math.sin(holdProgress * Math.PI) * 0.025;
          translateY = Math.sin(time * 1.5) * 3;
        } else {
          const fadeOutElapsed = time - (logo.end - logo.fadeOutDuration);
          const p = fadeOutElapsed / logo.fadeOutDuration;
          opacity = Math.max(0.92 * (1 - p), 0);
          scale = 1.02 + 0.04 * p;
        }
      }

      el.style.opacity = opacity;
      el.style.transform = `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})`;

      if (time < logo.end + 0.6) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [getTime, currentTime]);

  return (
    <div
      ref={containerRef}
      className="intro-logo-presence"
      style={{
        opacity: 0,
        transform: 'translate(-50%, -50%) scale(0.95)',
        transition: 'none',
      }}
      aria-hidden="true"
    >
      <svg
        className="intro-logo-svg"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M78 98.8462C78 91.1991 84.1991 85 91.8462 85C99.4932 85 105.692 91.1991 105.692 98.8462V218.154C105.692 225.801 99.4932 232 91.8462 232C84.1991 232 78 225.801 78 218.154V98.8462Z"
          fill="url(#logo_grad_0)"
        />
        <path
          d="M194 81.8462C194 74.1991 200.199 68 207.846 68C215.493 68 221.692 74.1991 221.692 81.8462V218.154C221.692 225.801 215.493 232 207.846 232C200.199 232 194 225.801 194 218.154V81.8462Z"
          fill="url(#logo_grad_1)"
        />
        <path
          d="M136 177.846C136 170.199 142.199 164 149.846 164C157.493 164 163.692 170.199 163.692 177.846V218.154C163.692 225.801 157.493 232 149.846 232C142.199 232 136 225.801 136 218.154V177.846Z"
          fill="url(#logo_grad_2)"
        />
        <path
          d="M136 89.8462C136 82.1991 142.199 76 149.846 76C157.493 76 163.692 82.1991 163.692 89.8462V130.154C163.692 137.801 157.493 144 149.846 144C142.199 144 136 137.801 136 130.154V89.8462Z"
          fill="url(#logo_grad_3)"
        />
        <defs>
          <linearGradient id="logo_grad_0" x1="78" y1="232" x2="184.15" y2="46.515" gradientUnits="userSpaceOnUse">
            <stop offset="0.324948" stopColor="#00D1FF" />
            <stop offset="1" stopColor="#14FF00" />
          </linearGradient>
          <linearGradient id="logo_grad_1" x1="78" y1="232" x2="184.15" y2="46.515" gradientUnits="userSpaceOnUse">
            <stop offset="0.324948" stopColor="#00D1FF" />
            <stop offset="1" stopColor="#14FF00" />
          </linearGradient>
          <linearGradient id="logo_grad_2" x1="78" y1="232" x2="184.15" y2="46.515" gradientUnits="userSpaceOnUse">
            <stop offset="0.324948" stopColor="#00D1FF" />
            <stop offset="1" stopColor="#14FF00" />
          </linearGradient>
          <linearGradient id="logo_grad_3" x1="78" y1="232" x2="184.15" y2="46.515" gradientUnits="userSpaceOnUse">
            <stop offset="0.324948" stopColor="#00D1FF" />
            <stop offset="1" stopColor="#14FF00" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
