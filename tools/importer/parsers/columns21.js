/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to convert iframes (except images) to links
  function replaceIframesWithLinks(root) {
    const iframes = root.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      const src = iframe.getAttribute('src');
      if (src) {
        const link = document.createElement('a');
        link.href = src;
        link.textContent = src;
        iframe.replaceWith(link);
      }
    });
  }

  // 1. Find the main grid wrapper for the newsletter block
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // 2. Find the columns inside the grid
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;

  // There are three main columns: left (title), middle (empty), right (content)
  const columns = Array.from(grid.children).filter((col) => col.classList.contains('acacias-GridColumn'));
  if (columns.length < 3) return;

  // Left column: Newsletter title
  const leftCol = columns[0];
  let leftContent = '';
  const titleBlock = leftCol.querySelector('.acacias--hub-module-title');
  if (titleBlock) {
    leftContent = titleBlock.cloneNode(true);
  }

  // Right column: lead text and form
  const rightCol = columns[2];
  let rightContent = document.createElement('div');

  // Lead text
  const leadItem = rightCol.querySelector('.acacias--comp-lead');
  if (leadItem) {
    rightContent.appendChild(leadItem.cloneNode(true));
  }

  // Form (with success message)
  const form = rightCol.querySelector('form');
  if (form) {
    const formBlock = form.cloneNode(true);
    replaceIframesWithLinks(formBlock);
    rightContent.appendChild(formBlock);
  }
  // Form success message
  const formSuccess = rightCol.querySelector('.acacias--form-success');
  if (formSuccess) {
    rightContent.appendChild(formSuccess.cloneNode(true));
  }

  // Remove empty div if nothing was appended
  if (!rightContent.hasChildNodes()) {
    rightContent = '';
  }

  // Compose the columns for the block table
  const headerRow = ['Columns (columns21)'];
  const contentRow = [leftContent, rightContent];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
