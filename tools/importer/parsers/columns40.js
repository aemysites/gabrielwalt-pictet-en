/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child columns
  function getImmediateColumns(parent, selector = '.acacias-GridColumn') {
    return Array.from(parent.querySelectorAll(':scope > ' + selector));
  }

  // 1. Find the main grid wrapper (contains all columns)
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // 2. Find the main grid (contains left and right columns)
  const mainGrid = gridWrapper.querySelector('.acacias-Grid');
  if (!mainGrid) return;

  // 3. Get the left columns (title, empty spacer)
  const leftColumns = getImmediateColumns(mainGrid);
  // Defensive: leftColumns[0] is the title, leftColumns[2] is the main content
  const contentCol = leftColumns[2];

  // 4. Extract left column content (text + link list)
  let leftColContent = null;
  let linkListItems = [];
  if (contentCol) {
    // Find the two sub-columns inside contentCol
    const twoColGrid = contentCol.querySelector('.acacias--content-item-inner-wrapper.acacias-Grid');
    if (twoColGrid) {
      const twoColColumns = getImmediateColumns(twoColGrid);
      // First column: text
      if (twoColColumns[0]) {
        const textContainer = twoColColumns[0];
        leftColContent = document.createElement('div');
        Array.from(textContainer.querySelectorAll('p')).forEach(p => {
          leftColContent.appendChild(p.cloneNode(true));
        });
      }
      // Second column: link list
      if (twoColColumns[1]) {
        const linkListContainer = twoColColumns[1];
        const ul = linkListContainer.querySelector('ul');
        if (ul) {
          linkListItems = Array.from(ul.children).map(li => li.cloneNode(true));
        }
      }
    }
  }

  // Build the columns: first column is left text, then each link-list item as its own column
  const headerRow = ['Columns (columns40)'];
  const contentRow = [];
  if (leftColContent && leftColContent.childNodes.length) contentRow.push(leftColContent);
  if (linkListItems.length) {
    linkListItems.forEach(item => contentRow.push(item));
  }

  // Only proceed if at least one column has content
  if (contentRow.length) {
    const cells = [headerRow, contentRow];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
