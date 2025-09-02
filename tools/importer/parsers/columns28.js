/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row
  const headerRow = ['Columns (columns28)'];
  const rows = [headerRow];

  // Find all top-level .acacias--row sections
  const sections = Array.from(element.querySelectorAll(':scope > div.acacias--row'));

  // Only proceed if we find at least one section
  if (!sections.length) return;

  sections.forEach(section => {
    // Find all columns in this section
    const gridWrapper = section.querySelector('.acacias--grid-wrapper');
    if (!gridWrapper) return;
    const grid = gridWrapper.querySelector('.acacias-Grid');
    if (!grid) return;
    const gridColumns = Array.from(grid.querySelectorAll(':scope > .acacias-GridColumn'));

    // Find the left column (title)
    let leftCol = gridColumns.find(col => col.classList.contains('acacias--hub-module-left-col'));
    let title = '';
    if (leftCol) {
      const cmpTitle = leftCol.querySelector('.cmp-title');
      if (cmpTitle) {
        title = cmpTitle.innerHTML;
      } else {
        // fallback: use h2/h3 if present
        const h = leftCol.querySelector('h2, h3');
        if (h) title = h.outerHTML;
        else if (leftCol.textContent.trim()) title = leftCol.textContent.trim();
      }
    }

    // Find the content area columns (main content)
    let contentArea = gridColumns.find(col => col.classList.contains('acacias--content-area'));
    let contentCells = [];
    if (contentArea) {
      // For News block, the content is not inside a cmp-container
      if (contentArea.querySelector('.acacias--comp-news-featured')) {
        // News block: Each news item is an <a>
        const newsItems = Array.from(contentArea.querySelectorAll('.acacias--comp-news-item'));
        newsItems.forEach(newsItem => {
          contentCells.push(newsItem.outerHTML);
        });
        // Add the show more button and link as a last cell
        const showMore = contentArea.querySelector('.acacias--comp-news-showmore');
        if (showMore) {
          contentCells.push(showMore.outerHTML);
        }
      } else {
        // Other blocks: find cmp-container(s) inside content area
        const containers = Array.from(contentArea.querySelectorAll(':scope > .cmp-container'));
        if (containers.length) {
          containers.forEach(container => {
            contentCells.push(container.outerHTML);
          });
        } else {
          // Fallback: add all direct children
          Array.from(contentArea.children).forEach(child => {
            contentCells.push(child.outerHTML);
          });
        }
      }
    }

    // Defensive: Remove empty columns
    contentCells = contentCells.filter(cell => {
      if (typeof cell === 'string' && cell.replace(/<[^>]+>/g, '').trim() === '') {
        return false;
      }
      return true;
    });

    // Compose the row: first cell is the title, rest are content columns
    if (contentCells.length) {
      rows.push([title, ...contentCells]);
    }
  });

  // Only replace if there are at least two rows (header + content)
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
