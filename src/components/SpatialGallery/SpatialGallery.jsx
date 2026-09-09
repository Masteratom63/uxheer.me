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
export default function SpatialGallery({ isIntroFinished }) {
  if (!isIntroFinished) {
    return null;
  }

  const projects = [
    {
      number: 'PROJECT 01',
      title: 'Adaptive Spatial System',
      category: 'Spatial Computing',
      focusPoint: 0.16,
      initialTilt: { rx: -1.0, ry: 2.0 },
      artworkType: 'rings',
    },
    {
      number: 'PROJECT 02',
      title: 'Cognitive Workflow Protocol',
      category: 'AI Architecture',
      focusPoint: 0.31,
      initialTilt: { rx: 1.0, ry: -2.0 },
      artworkType: 'matrix',
    },
    {
      number: 'PROJECT 03',
      title: 'Global Capital Exchange',
      category: 'Financial Infrastructure',
      focusPoint: 0.46,
      initialTilt: { rx: -1.0, ry: 1.5 },
      artworkType: 'prism',
    },
  ];

  return (
    <div className="spatial-gallery-fixed-viewport" aria-label="Work Gallery">
      <div className="spatial-gallery-stage">
        {projects.map((item) => (
          <ProjectCard
            key={item.number}
            number={item.number}
            title={item.title}
            category={item.category}
            focusPoint={item.focusPoint}
            initialTilt={item.initialTilt}
            artworkType={item.artworkType}
          />
        ))}
      </div>
    </div>
  );
}
