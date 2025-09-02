/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the nav containing the columns
  const nav = element.querySelector('nav');
  if (!nav) return;

  // Get all top-level column ULs
  const columnULs = Array.from(nav.querySelectorAll(':scope > ul'));
  if (!columnULs.length) return;

  // Build the header row
  const headerRow = ['Columns (columns36)'];

  // Build the columns row
  const columnsRow = columnULs.map((ul) => {
    // Each UL contains one LI (the column root)
    const li = ul.querySelector(':scope > li');
    if (!li) return '';

    // Get the header (title)
    const headerDiv = li.querySelector('.cmp-text');
    // Get the nested UL for links
    const linksUL = li.querySelector('ul.cmp-navigation__group');

    // Compose the column cell
    const cellContent = [];
    if (headerDiv) {
      // Use a strong for the header for semantics
      const strong = document.createElement('strong');
      strong.textContent = headerDiv.textContent.trim();
      cellContent.push(strong);
    }
    if (linksUL) {
      // Add each link as a paragraph for clarity
      Array.from(linksUL.querySelectorAll('a')).forEach((a) => {
        const p = document.createElement('p');
        p.appendChild(a);
        cellContent.push(p);
      });
    }
    return cellContent;
  });

  // Compose the table data
  const tableData = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(block);
}
