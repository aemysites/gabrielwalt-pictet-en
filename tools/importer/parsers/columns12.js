/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children by selector
  function getImmediateChild(parent, selector) {
    return Array.from(parent.children).find((el) => el.matches(selector));
  }

  // 1. Find the main grid wrapper
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // 2. Find the main grid (contains left col, spacer, and content area)
  const mainGrid = gridWrapper.querySelector('.acacias-Grid');
  if (!mainGrid) return;

  // 3. Get the left column (title)
  const leftCol = Array.from(mainGrid.children).find((col) => col.classList.contains('acacias--hub-module-left-col'));
  let titleContent = '';
  if (leftCol) {
    // Find the h2 title
    const h2 = leftCol.querySelector('h2');
    if (h2) {
      titleContent = h2;
    }
  }

  // 4. Get the content area (columns)
  const contentCol = Array.from(mainGrid.children).find((col) => col.classList.contains('acacias--hub-module-content-area'));
  if (!contentCol) return;

  // 5. Find the first-level office columns (there are two, each with two subcolumns)
  const officeModuleGrid = contentCol.querySelector('.acacias--offices-module-grid.acacias-Grid');
  if (!officeModuleGrid) return;

  // Each direct child of officeModuleGrid is a column (should be two)
  const officeColumns = Array.from(officeModuleGrid.children).filter((col) => col.classList.contains('acacias--offices-module-column'));

  // For each office column, get its subcolumns (each is a region group)
  const contentCells = [];
  officeColumns.forEach((officeCol) => {
    // Each officeCol has a .acacias--offices-module-grid inside, with two subcolumns
    const subGrid = officeCol.querySelector('.acacias--offices-module-grid.acacias-Grid');
    if (!subGrid) return;
    const subCols = Array.from(subGrid.children).filter((col) => col.classList.contains('acacias--offices-module-column-l2'));
    // For each subCol, get all .acacias--offices-module-region blocks inside (sometimes there are two regions in one subCol)
    subCols.forEach((subCol) => {
      const regions = Array.from(subCol.querySelectorAll('.acacias--offices-module-region'));
      regions.forEach((region) => {
        contentCells.push(region);
      });
    });
  });

  // Now, build the columns row: first cell is the title, then each region cell
  const columnsRow = [titleContent, ...contentCells];

  // Compose the table
  const headerRow = ['Columns (columns12)'];
  const tableRows = [headerRow, columnsRow];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(table);
}
