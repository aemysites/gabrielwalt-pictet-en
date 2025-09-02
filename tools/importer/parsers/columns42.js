/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the grid wrapper (main content area)
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // Find the grid columns
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;
  const columns = Array.from(grid.children);

  // Left column: Title
  let leftCol = columns.find(col => col.classList.contains('acacias--hub-module-left-col'));
  let titleBlock = leftCol ? leftCol.querySelector('.acacias--hub-module-title') : null;
  // Defensive: fallback if not found
  if (!titleBlock) {
    titleBlock = leftCol || document.createElement('div');
  }

  // Right column: Main content area
  let rightCol = columns.find(col => col.classList.contains('acacias--hub-module-content-area'));
  if (!rightCol) return;
  const contentContainer = rightCol.querySelector('.cmp-container') || rightCol;
  // Get all content items in order
  const contentItems = Array.from(contentContainer.querySelectorAll(':scope > .acacias--content-item'));

  // Compose the right column content
  const rightColContent = document.createElement('div');
  contentItems.forEach(item => {
    rightColContent.appendChild(item);
  });

  // Table header
  const headerRow = ['Columns (columns42)'];
  // Table content row: left and right columns
  const contentRow = [titleBlock, rightColContent];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
