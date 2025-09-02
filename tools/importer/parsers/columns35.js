/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getImmediateChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // 1. Find the left column: the sticky header with the title
  let leftCol = null;
  // Find the grid wrapper
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (gridWrapper) {
    // The first .acacias-GridColumn with .acacias--hub-module-left-col is the left column
    leftCol = gridWrapper.querySelector('.acacias-GridColumn.acacias--hub-module-left-col');
    // Defensive: sometimes there may be empty columns, so pick the one with content
    if (leftCol && !leftCol.textContent.trim()) {
      // Try the next sibling
      const allLefts = gridWrapper.querySelectorAll('.acacias-GridColumn.acacias--hub-module-left-col');
      leftCol = Array.from(allLefts).find(col => col.textContent.trim());
    }
  }
  // The actual title is inside .acacias--hub-module-title
  let leftContent = null;
  if (leftCol) {
    leftContent = leftCol.querySelector('.acacias--hub-module-title');
    // Defensive: if not found, use the whole leftCol
    if (!leftContent) leftContent = leftCol;
  }

  // 2. Find the right columns: the content area
  let rightCols = [];
  // The main content area is .acacias--hub-module-content-area
  const contentArea = element.querySelector('.acacias--hub-module-content-area');
  if (contentArea) {
    // The two column layout is inside .acacias--comp-two-cols-static
    const twoCols = contentArea.querySelector('.acacias--comp-two-cols-static');
    if (twoCols) {
      // The columns are .acacias-GridColumn.acacias--container--content-area (2 of them)
      const colNodes = twoCols.querySelectorAll('.acacias-GridColumn.acacias--container--content-area');
      rightCols = Array.from(colNodes).map(col => {
        // Each col contains a .cmp-container, which contains one or more .acacias--content-item
        // We'll collect all .acacias--content-item-inner-wrapper in order
        const container = col.querySelector('.cmp-container');
        if (!container) return col;
        const wrappers = container.querySelectorAll('.acacias--content-item-inner-wrapper');
        // If only one, return it directly, else wrap in a div
        if (wrappers.length === 1) {
          return wrappers[0];
        } else if (wrappers.length > 1) {
          const div = document.createElement('div');
          wrappers.forEach(w => div.appendChild(w));
          return div;
        } else {
          // fallback: return the container
          return container;
        }
      });
    }
  }

  // Compose the columns: leftContent, then all rightCols
  const columns = [leftContent, ...rightCols];

  // Defensive: filter out null/undefined
  const filteredColumns = columns.filter(Boolean);

  // Table rows
  const headerRow = ['Columns (columns35)'];
  const contentRow = filteredColumns;

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
