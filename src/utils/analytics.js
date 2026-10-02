/**
 * Google Analytics 4 tracking utilities for uxheer.me
 */

/**
 * Safely tracks a project opening event in Google Analytics 4.
 *
 * @param {Object} project - Project metadata object
 * @param {string} project.id - Unique machine-readable project identifier
 * @param {string} project.title - Display name / title of the project
 * @param {string} [project.number] - Project index / number (e.g. 'PROJECT 01')
 * @param {string} [project.category] - Project category tag
 */
export function trackProjectOpen(project) {
  if (!project) return;

  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'project_open', {
        project_id: project.id || '',
        project_name: project.title || '',
        project_number: project.number || '',
        project_category: project.category || '',
      });
    }
  } catch {
    // Fail silently: analytics must never prevent or delay user interactions
  }
}
