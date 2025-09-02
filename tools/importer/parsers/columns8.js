/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid wrapper containing columns
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // Find all immediate column divs inside the grid
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;
  const columnDivs = Array.from(grid.querySelectorAll(':scope > .acacias-GridColumn'));
  if (!columnDivs.length) return;

  // Only include columns that have meaningful content
  const contentCells = columnDivs.map((col) => {
    // Try to find the cmp-container inside each column
    const cmpContainer = col.querySelector('.cmp-container');
    if (cmpContainer && cmpContainer.children.length) {
      // If the container has content, use all its children as cell content
      return Array.from(cmpContainer.children);
    }
    // Defensive: fallback to any .acacias--content-item in the column
    const contentItem = col.querySelector('.acacias--content-item');
    if (contentItem) {
      return [contentItem];
    }
    // If column is empty, return null
    return null;
  }).filter(cell => {
    // Filter out empty/null cells and cells that are just empty wrappers
    if (!cell) return false;
    if (Array.isArray(cell)) {
      // Remove arrays that are empty or only contain empty divs
      return cell.some(node => {
        if (!node) return false;
        if (node.textContent && node.textContent.trim().length > 0) return true;
        // If it's an element, check if it contains any non-empty text
        return Array.from(node.querySelectorAll('*')).some(child => child.textContent && child.textContent.trim().length > 0);
      });
    }
    return true;
  });

  // Table header row as specified
  const headerRow = ['Columns (columns8)'];
  // Table body row: one cell per column
  const bodyRow = contentCells;

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bodyRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
