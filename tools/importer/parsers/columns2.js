/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child columns of the grid
  function getColumns(grid) {
    return Array.from(grid.querySelectorAll(':scope > .acacias-GridColumn'));
  }

  // Find the main grid wrapper
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;

  // Get all main columns
  const columns = getColumns(grid);
  if (columns.length < 1) return;

  // Only include columns with actual content (no empty columns, no zero-width columns)
  const cells = columns
    .filter(col => {
      // Exclude columns that are visually empty or zero-width
      const colClass = col.className;
      if (/GridColumn--default--0/.test(colClass)) return false;
      // Exclude columns with no meaningful content
      if (!col.textContent.trim()) return false;
      return true;
    })
    .map(col => {
      // Find meaningful content in each column
      let contentEl = null;
      if (col.querySelector('.authortag')) {
        contentEl = col.querySelector('.authortag');
      } else if (col.querySelector('.cmp-container')) {
        contentEl = col.querySelector('.cmp-container');
      } else if (col.querySelector('aside.adbanner')) {
        contentEl = col.querySelector('aside.adbanner');
      }
      // Fallback: use the column itself if it has text
      if (!contentEl && col.textContent.trim()) {
        contentEl = col;
      }
      const cell = document.createElement('div');
      cell.innerHTML = contentEl.innerHTML;
      return cell;
    });

  if (cells.length === 0) return;

  const headerRow = ['Columns (columns2)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cells
  ], document);

  element.replaceWith(table);
}
