/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid wrapper
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;

  // Find left column (title)
  let leftCell = '';
  const leftCol = grid.querySelector('.acacias--hub-module-title');
  if (leftCol) {
    // Use the actual element for semantic meaning
    leftCell = leftCol;
  }

  // Find right column (content area)
  let rightCell = '';
  const rightCol = grid.querySelector('.acacias--hub-module-content-area');
  if (rightCol) {
    const contentArea = rightCol.querySelector('.cmp-container');
    if (contentArea) {
      // Gather all direct children (content items)
      const items = Array.from(contentArea.children);
      if (items.length > 0) {
        rightCell = items;
      } else {
        rightCell = contentArea;
      }
    }
  }

  // Table header must match block name exactly
  const headerRow = ['Columns (columns38)'];
  const contentRow = [leftCell, rightCell];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
