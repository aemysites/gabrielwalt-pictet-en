/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block guidelines
  const headerRow = ['Hero (hero4)'];

  // --- Row 2: Background image (optional, none in this HTML) ---
  // No background image is present in the provided HTML, so use an empty cell
  const imageRow = [''];

  // --- Row 3: Content (title, subheading, CTA) ---
  // Find the main content column (the one with the text)
  const mainCol = element.querySelector(
    '.acacias-GridColumn.acacias-GridColumn--default--8'
  );
  let contentCell = '';
  if (mainCol) {
    // The inner wrapper contains the heading and CTA
    const innerWrapper = mainCol.querySelector('.acacias--home-stage-inner-wrapper');
    if (innerWrapper) {
      // We'll collect the heading and CTA
      const contentParts = [];
      // Heading (h2)
      const heading = innerWrapper.querySelector('h2');
      if (heading) contentParts.push(heading);
      // CTA (link inside .acacias--home-stage-lead)
      const ctaContainer = innerWrapper.querySelector('.acacias--home-stage-lead');
      if (ctaContainer) contentParts.push(ctaContainer);
      // If we have any content, use it as the cell
      if (contentParts.length) {
        contentCell = contentParts;
      }
    }
  }
  // Defensive: if nothing found, leave cell empty
  if (!contentCell) contentCell = '';

  // Compose the table rows
  const rows = [
    headerRow,
    imageRow,
    [contentCell],
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
