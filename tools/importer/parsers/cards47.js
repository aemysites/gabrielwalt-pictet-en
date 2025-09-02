/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main content area for contacts
  const contentArea = element.querySelector('.acacias--hub-module-content-area, .acacias--content-area');
  if (!contentArea) return;

  // Find the contacts list
  const contactsList = contentArea.querySelector('ul.acacias--comp-contacts');
  if (!contactsList) return;

  // Table header row
  const headerRow = ['Cards (cards47)'];
  const rows = [headerRow];

  // Each contact card is a <li>
  contactsList.querySelectorAll(':scope > li').forEach((li) => {
    // Defensive: Find image
    const img = li.querySelector('img');
    // Defensive: Find title
    const title = li.querySelector('.cmp-title__text');
    // Defensive: Find description
    const desc = li.querySelector('.cmp-text');
    // Defensive: Find CTA (Send a message)
    const cta = li.querySelector('.acacias--contact-cta');
    // Defensive: Find link
    const link = li.querySelector('a.acacias--block-link');

    // First cell: image
    let imageCell = null;
    if (img) {
      imageCell = img;
    }

    // Second cell: text content (title, description, CTA)
    const textCellContent = [];
    if (title) {
      // Wrap in <strong> for heading semantics
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      textCellContent.push(strong);
    }
    if (desc) {
      // Add description below title
      textCellContent.push(document.createElement('br'));
      textCellContent.push(desc);
    }
    if (cta && link) {
      // Add CTA as a link (preserve icon and text)
      textCellContent.push(document.createElement('br'));
      const ctaLink = document.createElement('a');
      ctaLink.href = link.href;
      ctaLink.innerHTML = cta.innerHTML;
      textCellContent.push(ctaLink);
    }

    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
