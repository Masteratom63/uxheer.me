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

/**
 * Safely tracks a section view event in Google Analytics 4.
 *
 * @param {Object} section - Section metadata object
 * @param {string} [section.section_id] - Machine-readable section identifier
 * @param {string} [section.section_name] - Human-readable display name of the section
 * @param {number} [section.section_index] - Discrete section index
 * @param {string} [section.id] - Fallback identifier
 * @param {string} [section.name] - Fallback display name
 * @param {number} [section.index] - Fallback discrete index
 */
export function trackSectionView(section) {
  if (!section) return;

  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'section_view', {
        section_id: section.section_id || section.id || '',
        section_name: section.section_name || section.name || '',
        section_index: typeof section.section_index === 'number'
          ? section.section_index
          : typeof section.index === 'number'
          ? section.index
          : -1,
      });
    }
  } catch {
    // Fail silently: analytics must never prevent or delay user interactions
  }
}
