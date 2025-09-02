/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // Get the two main columns
  const columns = element.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // LEFT COLUMN: text content
  const leftCol = columns[0];
  // Find the inner wrapper
  const leftInner = getChildByClass(leftCol, 'acacias--service-stage-left-col-inner-wrapper') || leftCol;
  // We'll collect all content from the inner wrapper
  const leftContent = document.createElement('div');
  // Get all children of the inner wrapper (title, lead, etc)
  Array.from(leftInner.children).forEach((child) => {
    leftContent.appendChild(child);
  });

  // RIGHT COLUMN: image content
  const rightCol = columns[1];
  // Find the picture element (image)
  const picture = rightCol.querySelector('picture');

  // Build the table rows
  const headerRow = ['Columns (columns50)'];
  const contentRow = [leftContent, picture];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
