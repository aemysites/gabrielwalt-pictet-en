/* global WebImporter */
export default function parse(element, { document }) {
  // Get the grid
  const grid = element.querySelector('.acacias-Grid');
  if (!grid) return;
  const columns = Array.from(grid.querySelectorAll(':scope > .acacias-GridColumn'));
  if (!columns.length) return;

  // Find the desktop column (main content)
  const desktopCol = columns.find(col => col.classList.contains('acacias--footer-desktop-footnotes'));
  const mainCol = desktopCol || columns[0];

  // Left cell: copyright and legal link (preserve links)
  let leftCell = document.createElement('div');
  const ul = mainCol.querySelector('ul');
  if (ul) {
    Array.from(ul.querySelectorAll('li')).forEach(li => {
      // If li contains an <a>, clone the <a>
      const a = li.querySelector('a');
      if (a) {
        leftCell.appendChild(a.cloneNode(true));
      } else {
        // If li contains .cmp-text, clone it
        const cmpText = li.querySelector('.cmp-text');
        if (cmpText && cmpText.textContent.trim()) {
          leftCell.appendChild(cmpText.cloneNode(true));
        }
      }
    });
  }

  // Right cell: share icons (preserve links)
  let rightCell = document.createElement('div');
  const shareItems = mainCol.querySelector('.acacias--share-items');
  if (shareItems) {
    Array.from(shareItems.querySelectorAll('a')).forEach(a => {
      rightCell.appendChild(a.cloneNode(true));
    });
  }

  // Build the table rows
  const headerRow = ['Columns (columns10)'];
  const contentRow = [leftCell, rightCell];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
