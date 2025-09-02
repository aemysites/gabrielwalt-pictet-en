/* global WebImporter */
export default function parse(element, { document }) {
  // Get the grid wrapper and grid
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;
  const columns = Array.from(grid.querySelectorAll(':scope > .acacias-GridColumn'));

  // Left column: Title
  let leftColContent = null;
  const leftCol = columns[0];
  if (leftCol) {
    const titleBlock = leftCol.querySelector('.acacias--hub-module-title');
    if (titleBlock) {
      leftColContent = titleBlock;
    }
  }

  // Right column: Main content (skip empty containers and empty list items)
  let rightColContent = document.createElement('div');
  const rightCol = columns[2]; // The third column is the main content area
  if (rightCol) {
    const mainContainer = rightCol.querySelector('.cmp-container');
    if (mainContainer) {
      // Only append non-empty children
      Array.from(mainContainer.children).forEach((item) => {
        // Remove empty link-list items (li)
        if (item.classList.contains('acacias--content-item') && item.querySelector('.acacias--comp-link-list')) {
          // Clean up empty li
          const ul = item.querySelector('ul');
          if (ul) {
            Array.from(ul.querySelectorAll('li')).forEach(li => {
              if (!li.textContent.trim() && !li.querySelector('img,a,ul,ol,table')) {
                li.remove();
              }
            });
          }
        }
        // Check if item has meaningful content
        if (item.textContent.trim() || item.querySelector('img,a,ul,ol,table')) {
          rightColContent.appendChild(item);
        }
      });
    }
  }

  // Only add columns that have meaningful content
  const columnsRow = [];
  if (leftColContent && (leftColContent.textContent.trim() || leftColContent.querySelector('img,a,ul,ol,table'))) {
    columnsRow.push(leftColContent);
  }
  if (rightColContent.childNodes.length > 0) {
    columnsRow.push(rightColContent);
  }

  // Table header
  const headerRow = ['Columns (columns49)'];

  // Build the table
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
