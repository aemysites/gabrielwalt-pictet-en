/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all immediate column children
  const columns = Array.from(element.querySelectorAll(':scope > .acacias-GridColumn'));
  // There should be 3 columns for this block
  if (columns.length < 3) return;

  // First column: Newsletter title
  const col1 = columns[0];
  // Find the title element (h2)
  let title = col1.querySelector('h2');
  if (!title) title = col1; // fallback to whole column if missing

  // Second column: Description text
  const col2 = columns[1];
  // Find the description text
  let desc = col2.querySelector('.cmp-text');
  if (!desc) desc = col2;

  // Third column: Form
  const col3 = columns[2];
  // Find the newsletter form container
  let formComp = col3.querySelector('.acacias--newsletter-sub--form-comp');
  if (!formComp) formComp = col3;

  // Build the table rows
  const headerRow = ['Columns (columns34)'];
  const contentRow = [title, desc, formComp];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
