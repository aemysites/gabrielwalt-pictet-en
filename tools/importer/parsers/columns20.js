/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the grid columns (should be two: left=image, right=quote)
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;
  const columns = Array.from(grid.children).filter((col) => col.classList.contains('acacias-GridColumn'));
  if (columns.length < 2) return;

  // Left column: image (find the image element)
  const leftCol = columns[0];
  const imgEl = leftCol.querySelector('img');
  // Defensive: only include if found
  let leftCell = '';
  if (imgEl) {
    leftCell = imgEl;
  }

  // Right column: quote (figure with blockquote and figcaption)
  const rightCol = columns[1];
  const figure = rightCol.querySelector('figure');
  let rightCell = '';
  if (figure) {
    rightCell = figure;
  }

  // Build the table rows
  const headerRow = ['Columns (columns20)'];
  const contentRow = [leftCell, rightCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
