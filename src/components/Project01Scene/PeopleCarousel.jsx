import React, { useEffect, useRef, useState } from 'react';

/**
 * PeopleCarousel Component
 * 
 * Ambient continuous horizontal auto-scrolling carousel for People assets.
 * 
 * Key Architecture:
 *  1. Non-blocking Ambient Motion:
 *     Slow, continuous cinematic horizontal travel. NEVER locks, intercepts, or hijacks
 *     the user's vertical page scrolling.
 *  2. Seamless Infinite Loop:
 *     Duplicated internal track items wrap seamlessly when offset exceeds single-set width.
 *     Zero visible jump, snap, or stutter.
 *  3. Touch & Vertical Scroll Safety:
 *     Gesture-direction detection: vertical gestures pass straight through to native scroll.
 *     Horizontal drags follow touch and pause autoplay.
 *  4. Inactivity Auto-Resume:
 *     Resumes ambient auto-scroll 2.5s after manual interaction concludes.
 *  5. Proportional Preservation:
 *     Equal visual height across both assets with natural width preservation.
 */
export default function PeopleCarousel({
  personaImg,
  personaAlt,
  personaCaption,
  journeyImg,
  journeyAlt,
  journeyCaption,
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const singleSetRef = useRef(null);

  const animFrameRef = useRef(null);
  const offsetRef = useRef(0);
  const singleSetWidthRef = useRef(0);

  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const dragDirectionLockedRef = useRef(false);
  const isHorizontalGestureRef = useRef(false);

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startOffsetRef = useRef(0);
  const resumeTimerRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);

  // Measure single set width
  const measureSetWidth = () => {
    if (singleSetRef.current) {
      singleSetWidthRef.current = singleSetRef.current.offsetWidth;
    }
  };

  useEffect(() => {
    measureSetWidth();
    window.addEventListener('resize', measureSetWidth);
    return () => window.removeEventListener('resize', measureSetWidth);
  }, []);

  // IntersectionObserver to only auto-scroll when section is in viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Ambient continuous horizontal scroll rAF loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (timestamp) => {
      const delta = Math.min((timestamp - lastTime) / 1000, 0.1);
      lastTime = timestamp;

      if (isVisible && !isPausedRef.current && trackRef.current && singleSetWidthRef.current > 0) {
        // Slow cinematic travel: ~32px per second
        offsetRef.current += 32 * delta;

        // Seamless infinite wrap without any visible jump
        if (offsetRef.current >= singleSetWidthRef.current) {
          offsetRef.current -= singleSetWidthRef.current;
        }

        trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isVisible]);

  // Pointer & Gesture Handlers with Strict Vertical Non-Interference
  const handlePointerDown = (e) => {
    isPointerDownRef.current = true;
    dragDirectionLockedRef.current = false;
    isHorizontalGestureRef.current = false;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startOffsetRef.current = offsetRef.current;
    measureSetWidth();

    clearTimeout(resumeTimerRef.current);
  };

  const handlePointerMove = (e) => {
    if (!isPointerDownRef.current) return;

    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;

    // Lock gesture direction early
    if (!dragDirectionLockedRef.current) {
      if (Math.abs(dy) > 7 && Math.abs(dy) > Math.abs(dx)) {
        // User is scrolling vertically! Let it pass through freely.
        dragDirectionLockedRef.current = true;
        isHorizontalGestureRef.current = false;
        return;
      }
      if (Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy)) {
        // Intentional horizontal drag on carousel
        dragDirectionLockedRef.current = true;
        isHorizontalGestureRef.current = true;
        isPausedRef.current = true;
        isDraggingRef.current = true;
      }
    }

    if (isHorizontalGestureRef.current && trackRef.current && singleSetWidthRef.current > 0) {
      offsetRef.current = startOffsetRef.current - dx;

      // Wrap offset within bounds during drag
      while (offsetRef.current < 0) {
        offsetRef.current += singleSetWidthRef.current;
      }
      while (offsetRef.current >= singleSetWidthRef.current) {
        offsetRef.current -= singleSetWidthRef.current;
      }

      trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
    isDraggingRef.current = false;
    dragDirectionLockedRef.current = false;

    // Resume autoplay after 2.5s of inactivity
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 2500);
  };

  const renderItemPair = (isFirst = false) => (
    <div
      ref={isFirst ? singleSetRef : null}
      className="carousel-set-block"
      aria-hidden={!isFirst}
    >
      <div className="carousel-artifact-card card-persona">
        <img
          src={personaImg}
          alt={personaAlt}
          className="carousel-artifact-img"
          loading="lazy"
        />
        <span className="artifact-caption">{personaCaption}</span>
      </div>

      <div className="carousel-artifact-card card-journey">
        <img
          src={journeyImg}
          alt={journeyAlt}
          className="carousel-artifact-img"
          loading="lazy"
        />
        <span className="artifact-caption">{journeyCaption}</span>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="people-carousel-viewport"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div ref={trackRef} className="people-carousel-track">
        {/* Render 3 identical sets to ensure infinite, seamless looping */}
        {renderItemPair(true)}
        {renderItemPair(false)}
        {renderItemPair(false)}
      </div>
    </div>
  );
}
