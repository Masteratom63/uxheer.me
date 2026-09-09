import React, { useEffect, useRef } from 'react';
import { subscribeSpatial } from '../../utils/spatialController';
import './Contact.css';

/**
 * Contact Component & Final End State
 * 
 * Minimal, quiet conclusion to the spatial portfolio experience.
 * Directly driven by spatial frame bus (Zero React reconciliations on scroll).
 */
export default function Contact({ isIntroFinished }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isIntroFinished) return;

    return subscribeSpatial((scrollRatio) => {
      const el = rootRef.current;
      if (!el) return;

      if (scrollRatio < 0.82) {
        el.style.opacity = 0;
        el.style.pointerEvents = 'none';
        return;
      }

      const entryProgress = Math.min(1, (scrollRatio - 0.82) / 0.11);
      const opacity = Math.max(0, entryProgress);
      const z = (1 - entryProgress) * -400;
      const scale = 0.92 + entryProgress * 0.08;

      el.style.transform = `translate3d(0, 0, ${z}px) scale(${scale})`;
      el.style.opacity = opacity;
      el.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    });
  }, [isIntroFinished]);

  if (!isIntroFinished) {
    return null;
  }

  return (
    <section
      ref={rootRef}
      className="spatial-contact-screen"
      style={{ opacity: 0, pointerEvents: 'none' }}
      aria-label="Contact"
    >
      <div className="contact-editorial-wrapper">
        <span className="contact-eyebrow">CONTACT</span>

        <h2 className="contact-subhead">Have something worth building?</h2>

        <a
          href="mailto:heer@uxheer.me"
          className="contact-main-cta"
          aria-label="Let's talk - Email Heer Patel"
        >
          <span>Let's talk.</span>
          <svg
            className="contact-arrow"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </a>

        {/* Secondary Contact Details */}
        <div className="contact-details-row">
          <a
            href="mailto:heer@uxheer.me"
            className="contact-detail-item"
            aria-label="Email: heer@uxheer.me"
          >
            heer@uxheer.me
          </a>

          <span className="contact-detail-divider" aria-hidden="true">·</span>

          <a
            href="tel:+919274304615"
            className="contact-detail-item"
            aria-label="Phone: +91 92743 04615"
          >
            +91 92743 04615
          </a>

          <span className="contact-detail-divider" aria-hidden="true">·</span>

          <a
            href="https://www.instagram.com/ux.heer/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-detail-item"
            aria-label="Instagram: @ux.heer"
          >
            @ux.heer
          </a>
        </div>
      </div>
    </section>
  );
}
