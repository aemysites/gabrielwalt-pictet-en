/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content area containing the cards
  const contentArea = element.querySelector('.acacias--hub-module-content-area');
  if (!contentArea) return;

  // Find the cards grid
  const cardsGrid = contentArea.querySelector('.acacias--comp-news-small');
  if (!cardsGrid) return;

  // Get all card links
  const cardLinks = Array.from(cardsGrid.querySelectorAll('a.acacias--comp-news-item'));

  // Build the table rows
  const rows = [];
  // Block header row
  rows.push(['Cards (cards45)']);

  cardLinks.forEach(card => {
    // --- Image/Icon cell ---
    const imageWrapper = card.querySelector('.acacias--image-wrapper-ratio');
    // Defensive: if not found, skip this card
    if (!imageWrapper) return;

    // --- Text cell ---
    // Get the navigation text (Collection Pictet)
    const navTextDiv = card.querySelector('.text.acacias--navigation .cmp-text');
    // Get the news text (title/desc)
    const newsTextDiv = card.querySelector('.text.news .cmp-text');

    // Compose the text cell as a fragment
    const textCellFragment = document.createDocumentFragment();
    if (navTextDiv) textCellFragment.appendChild(navTextDiv);
    if (newsTextDiv) textCellFragment.appendChild(newsTextDiv);

    rows.push([
      imageWrapper,
      textCellFragment
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
