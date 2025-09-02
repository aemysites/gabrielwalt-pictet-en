/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.querySelectorAll(':scope > ' + selector));
  }

  // Find all main rows (each ratings block)
  const rows = Array.from(element.querySelectorAll('.acacias--row.acacias--hub-module'));

  // Build the header row
  const headerRow = ['Columns (columns30)'];
  const tableRows = [headerRow];

  rows.forEach(row => {
    // Get the grid columns inside this row
    const gridWrapper = row.querySelector('.acacias--grid-wrapper');
    if (!gridWrapper) return;
    const grid = gridWrapper.querySelector('.acacias-Grid');
    if (!grid) return;
    const columns = getDirectChildren(grid, 'div');

    // There are usually 3 columns: left (title), spacer, right (content)
    // We'll use left and right only
    let leftCol = columns[0];
    let rightCol = columns[2] || columns[1];

    // Special handling for the first block (intro)
    if (row.id && row.id.startsWith('About-our-ratings')) {
      // The rightCol contains the intro paragraphs and link
      // We'll split the rightCol into two columns for the block
      // Left: title, Right: content
      // Get all paragraphs and links from rightCol
      const introContent = [];
      // Instead of only paragraphs and links, get all direct children of .cmp-container
      const cmpContainer = rightCol.querySelector('.cmp-container');
      if (cmpContainer) {
        Array.from(cmpContainer.children).forEach(child => {
          introContent.push(child.cloneNode(true));
        });
      } else {
        // fallback: get all paragraphs and links
        rightCol.querySelectorAll('p, a').forEach(el => introContent.push(el.cloneNode(true)));
      }
      // Get the leftCol title
      let titleCell = '';
      if (leftCol) {
        const titleEl = leftCol.querySelector('.cmp-title, h2, .acacias--hub-module-title');
        titleCell = titleEl ? titleEl.cloneNode(true) : '';
      }
      tableRows.push([
        titleCell,
        introContent
      ]);
      return;
    }

    // For ratings blocks, we need to build two columns:
    // Left: agency name, table, review, links
    // Right: extracts/quotes
    // We'll parse rightCol for its content items
    const contentRoot = rightCol.querySelector('.cmp-container') || rightCol;
    const blockColumns = [[], []];

    // Find all content items (agency title, table, review, links, extracts)
    const items = getDirectChildren(contentRoot, 'div.acacias--content-item');
    let agencyTitleFound = false;
    items.forEach(item => {
      // Agency title (h3)
      if (item.classList.contains('acacias--comp-title-h3') && !agencyTitleFound) {
        const h3 = item.querySelector('h3');
        if (h3) blockColumns[0].push(h3.cloneNode(true));
        agencyTitleFound = true;
        return;
      }
      // Ratings table
      if (item.classList.contains('acacias--comp-table')) {
        const table = item.querySelector('table');
        if (table) blockColumns[0].push(table.cloneNode(true));
        // Table footnote is sibling column in grid, find it
        const parentGrid = item.closest('.acacias-Grid');
        if (parentGrid) {
          const footnoteCol = parentGrid.querySelector('.acacias-table-footnote');
          if (footnoteCol) {
            const footnoteP = footnoteCol.querySelector('p');
            if (footnoteP) blockColumns[0].push(footnoteP.cloneNode(true));
          }
        }
        return;
      }
      // Review (h4 + paragraph)
      if (item.classList.contains('acacias--comp-two-cols-static')) {
        // This is a grid with two columns: left (review+links), right (extracts+links)
        const innerGrid = item.querySelector('.acacias-Grid');
        if (innerGrid) {
          const innerCols = getDirectChildren(innerGrid, 'div');
          // Left col: review + links
          if (innerCols[0]) {
            // Get all direct children of cmp-container in left col
            const leftCmpContainer = innerCols[0].querySelector('.cmp-container');
            if (leftCmpContainer) {
              Array.from(leftCmpContainer.children).forEach(child => blockColumns[0].push(child.cloneNode(true)));
            }
            // Get all link-list items in left col
            innerCols[0].querySelectorAll('.acacias--comp-link-list ul').forEach(ul => blockColumns[0].push(ul.cloneNode(true)));
          }
          // Right col: extracts + links
          if (innerCols[1]) {
            // Get all direct children of cmp-container in right col
            const rightCmpContainer = innerCols[1].querySelector('.cmp-container');
            if (rightCmpContainer) {
              Array.from(rightCmpContainer.children).forEach(child => blockColumns[1].push(child.cloneNode(true)));
            }
            // Get all link-list items in right col
            innerCols[1].querySelectorAll('.acacias--comp-link-list ul').forEach(ul => blockColumns[1].push(ul.cloneNode(true)));
          }
        }
        return;
      }
    });

    // Defensive: if no extracts, try to find blockquotes and italic paragraphs in rightCol
    if (blockColumns[1].length === 0) {
      rightCol.querySelectorAll('blockquote, .cmp-text blockquote, p i').forEach(bq => blockColumns[1].push(bq.cloneNode(true)));
    }

    // Defensive: if both columns are empty, fallback to rightCol
    if (blockColumns[0].length === 0 && blockColumns[1].length === 0) {
      blockColumns[0].push(rightCol.cloneNode(true));
    }

    // Flatten columns: if only one element, use the element; if multiple, use array
    const col0 = blockColumns[0].length === 1 ? blockColumns[0][0] : blockColumns[0];
    const col1 = blockColumns[1].length === 1 ? blockColumns[1][0] : blockColumns[1];
    // Title cell: always use leftCol title
    let titleCell = '';
    if (leftCol) {
      const titleEl = leftCol.querySelector('.cmp-title, h2, .acacias--hub-module-title');
      titleCell = titleEl ? titleEl.cloneNode(true) : '';
    }
    tableRows.push([titleCell, col0, col1]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element
  element.replaceWith(block);
}
