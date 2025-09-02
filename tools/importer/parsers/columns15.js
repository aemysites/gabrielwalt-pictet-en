/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main grid wrapper for the columns block
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // Find the main grid (holds the columns)
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;

  // Get all immediate column divs (should be 3: left, middle, right)
  const columns = Array.from(grid.children).filter(child => child.classList.contains('acacias-GridColumn'));
  if (columns.length < 3) return;

  // 1st column: Title ("About the Foundation")
  let titleContent = '';
  const titleWrapper = columns[0].querySelector('.acacias--hub-module-title');
  if (titleWrapper) {
    // Use the whole title block for resilience
    titleContent = titleWrapper;
  } else {
    // fallback: just use the column
    titleContent = columns[0];
  }

  // 2nd column: Address ("Pictet Group Foundation" etc)
  let addressContent = '';
  // Defensive: find the cmp-container inside this column
  const addressContainer = columns[1].querySelector('.cmp-container');
  if (addressContainer) {
    addressContent = addressContainer;
  } else {
    addressContent = columns[1];
  }

  // 3rd column: Description (two paragraphs)
  let descContent = '';
  const descContainer = columns[2].querySelector('.cmp-container');
  if (descContainer) {
    descContent = descContainer;
  } else {
    descContent = columns[2];
  }

  // Build the table rows
  const headerRow = ['Columns (columns15)'];
  const contentRow = [titleContent, addressContent, descContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
