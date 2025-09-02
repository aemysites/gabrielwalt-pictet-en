/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Helper: extract all content blocks from a column, including text
  function extractColumnContent(col) {
    // Try to get all cmp-container children (text, images, lists, etc.)
    const cmpContainers = Array.from(col.querySelectorAll(':scope > .cmp-container'));
    if (cmpContainers.length > 0) {
      const allContent = [];
      cmpContainers.forEach(container => {
        Array.from(container.children).forEach(child => {
          if (child.classList.contains('acacias--content-item')) {
            const inner = child.querySelector('.acacias--content-item-inner-wrapper');
            if (inner) allContent.push(inner.cloneNode(true));
            else allContent.push(child.cloneNode(true));
          } else if (child.classList.contains('acacias--content-item-inner-wrapper')) {
            allContent.push(child.cloneNode(true));
          } else if (child.classList.contains('acacias--content-ul')) {
            allContent.push(child.cloneNode(true));
          } else {
            allContent.push(child.cloneNode(true));
          }
        });
      });
      if (allContent.length === 1) return allContent[0];
      if (allContent.length > 1) {
        const wrapper = document.createElement('div');
        allContent.forEach(el => wrapper.appendChild(el));
        return wrapper;
      }
    }
    // Title
    const titleWrap = col.querySelector(':scope > .acacias--hub-module-title');
    if (titleWrap) {
      const titlePrimary = titleWrap.querySelector('.title.primary');
      if (titlePrimary) return titlePrimary.cloneNode(true);
    }
    // Image
    const imgWrap = col.querySelector(':scope > .acacias--image.ratio--3-2 .acacias--image-wrapper-ratio, :scope > .acacias--image.ratio--4-5 .acacias--image-wrapper-ratio, :scope > .acacias--image.ratio--16-9 .acacias--image-wrapper-ratio');
    if (imgWrap) return imgWrap.cloneNode(true);
    // Quote
    const figure = col.querySelector(':scope > figure');
    if (figure) return figure.cloneNode(true);
    // Fallback: all direct children with text or images
    const fallback = Array.from(col.children).filter(child => child.textContent.trim() || child.querySelector('img'));
    if (fallback.length === 1) return fallback[0].cloneNode(true);
    if (fallback.length > 1) {
      const wrapper = document.createElement('div');
      fallback.forEach(el => wrapper.appendChild(el.cloneNode(true)));
      return wrapper;
    }
    // If still empty, get all text content from descendants
    const textContent = col.textContent.trim();
    if (textContent) return textContent;
    return '';
  }

  // Main logic
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  const blockRows = [];
  const headerRow = ['Columns (columns27)'];
  blockRows.push(headerRow);

  rows.forEach(row => {
    if (row.classList.contains('acacias--row')) {
      const gridWrapper = getDirectChildByClass(row, 'acacias--grid-wrapper');
      if (!gridWrapper) return;
      const grid = getDirectChildByClass(gridWrapper, 'acacias-Grid');
      if (!grid) return;
      // Only consider direct grid columns (not nested)
      const gridColumns = Array.from(grid.children).filter(col => col.classList && col.classList.contains('acacias-GridColumn'));
      // For each column, extract all content blocks (not just one per col)
      const contentCells = gridColumns.map(col => {
        const content = extractColumnContent(col);
        return content;
      });
      // Only push row if at least one cell has content
      if (contentCells.some(cell => cell && (typeof cell === 'string' ? cell.trim() : true))) {
        blockRows.push(contentCells);
      }
    }
  });

  // Remove empty trailing rows (if any)
  while (blockRows.length > 1 && blockRows[blockRows.length - 1].every(cell => !cell || (typeof cell === 'string' && !cell.trim()))) {
    blockRows.pop();
  }

  // If only header row, try fallback: extract all text content as a single cell row
  if (blockRows.length === 1) {
    const allText = element.textContent.trim();
    if (allText) {
      blockRows.push([allText]);
    }
  }

  // Replace element
  const table = WebImporter.DOMUtils.createTable(blockRows, document);
  element.replaceWith(table);
}
