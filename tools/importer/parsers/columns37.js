/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getImmediateChildren(parent, selector) {
    return Array.from(parent.children).filter(child => child.matches(selector));
  }

  // 1. Header row
  const headerRow = ['Columns (columns37)'];

  // 2. Get the grid wrapper (contains all columns)
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;

  // 3. Get the top-level columns (left blank, spacer, right content)
  const gridColumns = getImmediateChildren(grid, '.acacias-GridColumn');

  // Defensive: Expect at least 3 columns (left, spacer, right)
  if (gridColumns.length < 3) return;

  // 4. Left column: the title
  const leftCol = gridColumns[0];
  // Find the title block (should be a sticky header)
  const titleBlock = leftCol.querySelector('.acacias--hub-module-title');

  // 5. Right column: the content area (contains the office regions)
  const rightCol = gridColumns[2];
  const contentArea = rightCol.querySelector('.acacias--offices-module-grid');
  if (!contentArea) return;

  // 6. The contentArea contains two columns (each with two subcolumns)
  // Get the two main office columns
  const officeColumns = getImmediateChildren(contentArea, '.acacias--offices-module-column');

  // Each officeColumn contains a grid with two subcolumns (regions)
  // We'll flatten all four regions into four columns
  let regionCells = [];
  officeColumns.forEach(officeCol => {
    const regionGrid = officeCol.querySelector('.acacias--offices-module-grid');
    if (regionGrid) {
      // Get the two region columns inside
      const regionCols = getImmediateChildren(regionGrid, '.acacias--offices-module-column-l2');
      regionCols.forEach(regionCol => {
        // Each regionCol contains a region block
        const regionBlock = regionCol.querySelector('.acacias--offices-module-region');
        if (regionBlock) {
          regionCells.push(regionBlock);
        }
      });
    }
  });

  // Defensive: If not exactly 4 regions, fallback to whatever is found
  if (regionCells.length === 0) return;

  // 7. Build the table rows
  // First row: header
  // Second row: left column (title), then each region as a column
  const cells = [
    headerRow,
    [titleBlock, ...regionCells]
  ];

  // 8. Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
