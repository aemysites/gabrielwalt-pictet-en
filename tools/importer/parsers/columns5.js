/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid wrapper and main grid
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;
  const columns = Array.from(grid.children);

  // Find left column (title)
  const leftCol = columns.find(col => col.classList.contains('acacias--hub-module-left-col'));
  let titleContent = null;
  if (leftCol) {
    // Find the h2 title
    const titleEl = leftCol.querySelector('.cmp-title__text');
    if (titleEl) {
      titleContent = titleEl;
    }
  }

  // Find main content column
  const contentCol = columns.find(col => col.classList.contains('acacias--hub-module-content-area'));
  let contentCell = document.createElement('div');
  if (contentCol) {
    const cmpContainer = contentCol.querySelector('.cmp-container');
    if (cmpContainer) {
      // Find all content items
      const items = Array.from(cmpContainer.children);
      items.forEach(item => {
        // Text block
        const textEl = item.querySelector('.cmp-text');
        if (textEl) {
          // Append the actual <p> content
          Array.from(textEl.children).forEach(child => {
            contentCell.appendChild(child.cloneNode(true));
          });
        }
        // Video block
        const videoWrapper = item.querySelector('.acacias--comp-video-wrapper');
        if (videoWrapper) {
          // Get video cover image
          const img = videoWrapper.querySelector('.cmp-image__image');
          if (img) {
            contentCell.appendChild(img.cloneNode(true));
          }
        }
      });
    }
  }

  // Build the table
  const headerRow = ['Columns (columns5)'];
  const tableRows = [
    headerRow,
    [titleContent, contentCell]
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
