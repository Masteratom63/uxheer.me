import React, { useEffect, useRef } from 'react';
import { subscribeSpatial } from '../../utils/spatialController';
import './SpatialGallery.css';

/**
 * ProjectCard Component
 * 
 * Spatial object representing a project in 3D space.
 * Enters from depth as camera approaches, becomes dominant at focal center,
 * and glides smoothly past the camera as scrolling continues.
 * Directly driven by spatial frame bus (Zero React reconciliations on scroll).
 */
export default function ProjectCard({
  id,
  number,
  title,
  category,
  focusPoint,
  initialTilt = { rx: 0, ry: 0 },
  artworkType = 'rings',
  exploreText = 'VIEW PROJECT ARCHIVE',
  onEnter,
}) {
  const cardRef = useRef(null);

  useEffect(() => {
    const approachWindow = 0.12;
    const departWindow = 0.10;

    return subscribeSpatial((progress) => {
      const el = cardRef.current;
      if (!el) return;

      const delta = progress - focusPoint;

      if (delta < -approachWindow || delta > departWindow) {
        el.style.opacity = 0;
        el.style.pointerEvents = 'none';
        return;
      }

      let opacity = 1;
      let z = 0;
      let scale = 1;
      let ry = initialTilt.ry;
      let rx = initialTilt.rx;

      if (delta < 0) {
        // Approaching from depth
        const u = -delta / approachWindow;
        opacity = Math.max(0, 1 - Math.pow(u, 1.6));
        z = delta * 1100;
        scale = 1 - u * 0.22;
        ry = initialTilt.ry + u * 4;
        rx = initialTilt.rx + u * 2;
      } else {
        // Departing forward past camera
        const v = delta / departWindow;
        opacity = Math.max(0, 1 - Math.pow(v, 1.8));
        z = delta * 650;
        scale = 1 + v * 0.18;
        ry = initialTilt.ry - v * 5;
        rx = initialTilt.rx - v * 3;
      }

      el.style.transform = `translate3d(-50%, -50%, 0) translate3d(0, 0, ${z}px) scale(${scale}) rotateX(${rx}deg) rotateY(${ry}deg)`;
      el.style.opacity = opacity;
      el.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    });
  }, [focusPoint, initialTilt.rx, initialTilt.ry]);

  const handleCardClick = (e) => {
    if (onEnter) {
      e.stopPropagation();
      onEnter();
    }
  };

  return (
    <div
      ref={cardRef}
      className={`spatial-project-wrapper project-${number.replace(/\s+/g, '-').toLowerCase()}${onEnter ? ' clickable' : ''}`}
      style={{ opacity: 0, pointerEvents: 'none' }}
      aria-label={`${number}: ${title}`}
      onClick={handleCardClick}
      role={onEnter ? 'button' : undefined}
      tabIndex={onEnter ? 0 : undefined}
      onKeyDown={(e) => {
        if (onEnter && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onEnter();
        }
      }}
    >
      <div className="project-spatial-surface">
        {/* Subtle luminous accent glow along top edge */}
        <div className="surface-glow-edge" />

        {/* Header: Project Index and Category */}
        <div className="project-meta-bar">
          <span className="project-index-tag">{number}</span>
          <span className="project-category-tag">{category}</span>
        </div>

        {/* Visual: Spatial Architectural Composition / Project Preview */}
        <div className="project-spatial-artwork">
          {artworkType === 'scene' && (
            <div className="artwork-spatial-scene">
              <div className="scene-logo-dots" aria-hidden="true">
                <span className="dot dot-purple" />
                <span className="dot dot-red" />
                <span className="dot dot-green" />
                <span className="dot dot-blue" />
                <span className="dot dot-pink" />
              </div>
              <div className="scene-card-silhouette">
                <span className="scene-chip" />
                <span className="scene-brand">Scene+</span>
              </div>
            </div>
          )}

          {artworkType === 'rings' && (
            <div className="artwork-spatial-rings">
              <div className="spatial-ring ring-3" />
              <div className="spatial-ring ring-2" />
              <div className="spatial-ring ring-1" />
              <div className="spatial-core-glow" />
            </div>
          )}

          {artworkType === 'matrix' && (
            <div className="artwork-spatial-matrix">
              <div className="matrix-capsule cap-1" />
              <div className="matrix-capsule cap-2" />
              <div className="matrix-capsule cap-3" />
            </div>
          )}

          {artworkType === 'prism' && (
            <div className="artwork-spatial-prism">
              <div className="prism-facet facet-1" />
              <div className="prism-facet facet-2" />
              <div className="prism-line" />
            </div>
          )}
        </div>

        {/* Footer: Title and View Cue */}
        <div className="project-info-footer">
          <h2 className="project-title">{title}</h2>
          <div className="project-explore-row">
            <span className="explore-dot" />
            <span className="explore-text">{exploreText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
