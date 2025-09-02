/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid wrapper
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // Get all top-level grid columns
  const gridColumns = gridWrapper.querySelectorAll(':scope > .acacias-Grid > .acacias-GridColumn');
  if (gridColumns.length < 3) return;

  // 1. Left column: Title ("Responsibility")
  const leftCol = gridColumns[0];
  const titleEl = leftCol.querySelector('.cmp-title__text');
  // Defensive: fallback to leftCol if not found
  const leftCell = titleEl ? titleEl : leftCol;

  // 2. Right column: Main content area
  const rightCol = gridColumns[2];
  const contentArea = rightCol.querySelector('.cmp-container');
  if (!contentArea) return;

  // Get all content items in the right column
  const contentItems = contentArea.querySelectorAll(':scope > .acacias--content-item');

  // 2a. Lead text (first content item)
  let leadText = null;
  if (contentItems.length > 0) {
    leadText = contentItems[0].querySelector('.cmp-text') || contentItems[0];
  }

  // 2b. Image (second content item)
  let imageEl = null;
  if (contentItems.length > 1) {
    imageEl = contentItems[1].querySelector('img');
  }

  // 2c. List of columns (third content item)
  let listCells = [];
  if (contentItems.length > 2) {
    const listBlock = contentItems[2];
    const listItems = listBlock.querySelectorAll('ul > li');
    listCells = Array.from(listItems).map(li => li);
  }

  // Compose the columns for the second row
  // Left column: title
  // Right column: all main content (lead text, image, then each list cell)
  const secondRow = [leftCell];
  if (leadText) secondRow.push(leadText);
  if (imageEl) secondRow.push(imageEl);
  secondRow.push(...listCells);

  // The header row
  const headerRow = ['Columns (columns16)'];

  // Build the table
  const cells = [headerRow, secondRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
