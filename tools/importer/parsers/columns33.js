/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row
  const cells = [['Columns (columns33)']];

  // Find all .acacias--row blocks (each is a horizontal section)
  const rows = Array.from(element.querySelectorAll(':scope > div.acacias--row'));

  rows.forEach(row => {
    // Try to find left column (title or image)
    let leftCell = '';
    const leftCol = row.querySelector('.acacias--hub-module-left-col, .acacias--quote-module-left-col');
    if (leftCol) {
      // Prefer title
      const title = leftCol.querySelector('.cmp-title__text');
      if (title) {
        leftCell = title.outerHTML;
      } else {
        // If no title, maybe an image (for quote block)
        const img = leftCol.querySelector('img');
        if (img) {
          // Include the image and its caption if present
          let html = img.outerHTML;
          const caption = leftCol.querySelector('.acacias--image-caption, figcaption, .cmp-text p');
          if (caption) html += caption.outerHTML;
          leftCell = html;
        }
      }
    }

    // Try to find right/main content columns
    let rightCells = [];
    // Special case: quote block
    const quote = row.querySelector('figure.acacias--quote');
    if (quote) {
      rightCells = [quote.outerHTML];
    } else {
      // For 'In the media', each .acacias--comp-news-item is a column
      const newsItems = row.querySelectorAll('.acacias--comp-news-item');
      if (newsItems.length) {
        rightCells = Array.from(newsItems).map(item => item.outerHTML);
      } else {
        // For two-cols-static (case study), each .acacias-GridColumn is a column
        const twoColsStatic = row.querySelector('.acacias--comp-two-cols-static');
        if (twoColsStatic) {
          const gridCols = twoColsStatic.querySelectorAll('.acacias-GridColumn');
          rightCells = Array.from(gridCols).map(col => col.outerHTML);
        } else {
          // For standard content area, gather all .acacias--content-item-inner-wrapper
          const contentArea = row.querySelector('.acacias--content-area');
          if (contentArea) {
            const wrappers = contentArea.querySelectorAll('.acacias--content-item-inner-wrapper');
            if (wrappers.length === 2) {
              rightCells = Array.from(wrappers).map(w => w.outerHTML);
            } else {
              // Otherwise, treat all content as a single column
              rightCells = [contentArea.outerHTML];
            }
          }
        }
      }
    }

    // Compose the row: if leftCell is present, put it as first column, then rightCells
    let rowCells = [];
    if (leftCell && rightCells.length) {
      rowCells = [leftCell, ...rightCells];
    } else if (leftCell) {
      rowCells = [leftCell];
    } else if (rightCells.length) {
      rowCells = rightCells;
    }
    // Only add if there is at least one non-empty cell
    if (rowCells.length && rowCells.some(cell => cell && (typeof cell === 'string' ? cell.trim() : true))) {
      cells.push(rowCells);
    }
  });

  // Only output if there is at least one content row
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
