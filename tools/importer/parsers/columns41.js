/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all top-level grid columns (these are the visual columns)
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;
  const columns = Array.from(grid.children).filter((col) => col.classList.contains('acacias-GridColumn'));

  // Defensive: ensure we have at least two columns (left and main)
  if (columns.length < 2) return;

  // Left column: author info
  const leftCol = columns[0];
  // Find the author tag block
  let authorBlock = leftCol.querySelector('.authortag');
  if (!authorBlock) {
    // fallback: just use the leftCol itself
    authorBlock = leftCol;
  }

  // Main column: content
  const mainCol = columns[1];
  // Find the main content container
  let contentBlock = mainCol.querySelector('.cmp-container');
  if (!contentBlock) {
    // fallback: just use the mainCol itself
    contentBlock = mainCol;
  }

  // Compose the table rows
  const headerRow = ['Columns (columns41)'];
  const contentRow = [authorBlock, contentBlock];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
