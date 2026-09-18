import React from 'react';
import ProjectCard from './ProjectCard';
import './SpatialGallery.css';

/**
 * SpatialGallery Component
 * 
 * Houses the sequential 3D spatial project stages:
 *  - Scroll 0.00 – 0.12: Statement is active (Project 01 is emerging from depth)
 *  - Scroll 0.14 – 0.38: PROJECT 01 focal stage (centered at 0.24)
 *  - Scroll 0.42 – 0.68: PROJECT 02 focal stage (centered at 0.54)
 *  - Scroll 0.72 – 1.00: PROJECT 03 focal stage (centered at 0.84)
 */
export default function SpatialGallery({ isIntroFinished, onEnterProject01, projectState = 'CLOSED' }) {
  if (!isIntroFinished) {
    return null;
  }

  const isOpening = projectState === 'OPENING';

  const projects = [
    {
      id: 'scotiabank-scene',
      number: 'PROJECT 01',
      title: 'SCOTIABANK SCENE+',
      category: 'UX / UI / PRODUCT DESIGN',
      focusPoint: 0.16,
      initialTilt: { rx: -1.0, ry: 2.0 },
      artworkType: 'scene',
      exploreText: 'ENTER PROJECT',
    },
    {
      number: 'PROJECT 02',
      title: 'Cognitive Workflow Protocol',
      category: 'AI Architecture',
      focusPoint: 0.34,
      initialTilt: { rx: 1.0, ry: -2.0 },
      artworkType: 'matrix',
      exploreText: 'VIEW PROJECT ARCHIVE',
    },
    {
      number: 'PROJECT 03',
      title: 'Global Capital Exchange',
      category: 'Financial Infrastructure',
      focusPoint: 0.48,
      initialTilt: { rx: -1.0, ry: 1.5 },
      artworkType: 'prism',
      exploreText: 'VIEW PROJECT ARCHIVE',
    },
  ];

  return (
    <div
      className={`spatial-gallery-fixed-viewport ${isOpening ? 'gallery-opening' : ''}`}
      aria-label="Work Gallery"
      style={isOpening ? { opacity: 0, pointerEvents: 'none', display: 'none' } : undefined}
    >
      <div className="spatial-gallery-stage">
        {projects.map((item) => (
          <ProjectCard
            key={item.number}
            id={item.id}
            number={item.number}
            title={item.title}
            category={item.category}
            focusPoint={item.focusPoint}
            initialTilt={item.initialTilt}
            artworkType={item.artworkType}
            exploreText={item.exploreText}
            onEnter={item.id === 'scotiabank-scene' ? onEnterProject01 : undefined}
          />
        ))}
      </div>
    </div>
  );
}
