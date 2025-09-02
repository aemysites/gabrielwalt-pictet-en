/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find all immediate grid columns (the actual content columns)
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;
  // Get all direct children columns
  const columns = Array.from(grid.children).filter(col => col.classList.contains('acacias-GridColumn'));

  // Defensive: Only keep columns with actual content
  // Left column: title
  let leftCol = columns[0];
  let leftContent = null;
  if (leftCol) {
    // Find the title block
    leftContent = leftCol.querySelector('.acacias--hub-module-title');
    if (!leftContent) leftContent = leftCol;
  }

  // Right column: main content
  let rightCol = columns[2]; // columns[1] is empty spacer
  let rightContent = null;
  if (rightCol) {
    // Find the content area
    rightContent = rightCol.querySelector('.acacias--hub-module-content-area');
    if (!rightContent) rightContent = rightCol;
  }

  // Build the table rows
  const headerRow = ['Columns (columns1)'];
  const contentRow = [leftContent, rightContent];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(block);
}
