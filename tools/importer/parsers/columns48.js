/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getImmediateChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Find the grid wrapper (contains the columns)
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // Find the main grid (contains the three columns)
  const grid = getImmediateChildByClass(gridWrapper, 'acacias-Grid');
  if (!grid) return;

  // Get all immediate column divs
  const columns = Array.from(grid.children).filter(col => col.classList.contains('acacias-GridColumn'));

  // Defensive: Only proceed if we have at least 2 columns (left/content)
  if (columns.length < 2) return;

  // --- LEFT COLUMN ---
  const leftCol = columns[0];
  // Find author tag (contains author info)
  const authorTag = leftCol.querySelector('.authortag');
  // We'll use the whole authorTag block for left cell

  // --- CENTER COLUMN ---
  const centerCol = columns[1];
  // The center column contains the main content, link list, and ad banner
  // We'll collect all direct children of the cmp-container
  const contentContainer = centerCol.querySelector('.cmp-container');
  let centerCellContent = [];
  if (contentContainer) {
    // Get all direct children (content items and aside)
    centerCellContent = Array.from(contentContainer.children);
  }

  // --- RIGHT COLUMN ---
  // The right column is usually empty or for spacing, but let's check
  let rightCellContent = null;
  if (columns.length > 2) {
    const rightCol = columns[2];
    // If rightCol has meaningful content, include it
    // We'll check for cmp-container or any non-empty content
    const rightCmp = rightCol.querySelector('.cmp-container');
    if (rightCmp && rightCmp.children.length > 0) {
      rightCellContent = rightCmp;
    } else if (rightCol.textContent.trim()) {
      rightCellContent = rightCol;
    }
  }

  // --- BUILD TABLE ---
  const headerRow = ['Columns (columns48)'];
  const contentRow = [
    authorTag || '',
    centerCellContent.length ? centerCellContent : '',
    rightCellContent || ''
  ];

  // Remove empty trailing columns
  while (contentRow.length > 1 && !contentRow[contentRow.length - 1]) {
    contentRow.pop();
  }

  // Create the table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
