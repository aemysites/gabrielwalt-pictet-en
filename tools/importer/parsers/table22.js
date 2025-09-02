/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row
  const headerRow = ['Table (table22)'];

  // Find the timeline block that visually represents the table
  const timeline = element.querySelector('.acacias--historic-timeline.acacias--timeline');
  if (!timeline) return;

  // Find all the visible timeline event columns (each is a column in the visual table)
  // These are the direct children with class acacias-GridColumn and contain a year and a label
  // Instead, parse the timeline axis at the bottom for the visible text events
  const axis = Array.from(document.querySelectorAll('.acacias--historic-timeline .acacias-GridColumn'));
  let rows = [headerRow];
  if (axis.length > 0) {
    axis.forEach(col => {
      // Try to get the year (h4, h3, h2, or strong)
      let year = '';
      const yearEl = col.querySelector('h4, h3, h2, strong');
      if (yearEl) year = yearEl.textContent.trim();
      // Try to get the main label/content (text, p, or .text)
      let label = '';
      const labelEl = col.querySelector('.text, p');
      if (labelEl) label = labelEl.textContent.trim();
      // If not, try to get all text content
      if (!label) label = col.textContent.trim();
      // Only add if year or label present and not both empty
      if (year || label) {
        // Add both year and label as a single cell (to match screenshot)
        rows.push([`${year}${year && label ? ': ' : ''}${label}`]);
      }
    });
  }

  // If no rows found, fallback to SVG timeline dragger (contains all text)
  if (rows.length === 1) {
    const svg = timeline.querySelector('svg.acacias--historic-timeline-dragger');
    if (!svg) return;
    rows.push([svg]);
  }

  // Build the table structure
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the table block
  element.replaceWith(table);
}
