/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards container
  const cardsContainer = element.querySelector('.acacias--hub-module-content-area');
  if (!cardsContainer) return;

  // Find all card elements (news items)
  const cardEls = Array.from(cardsContainer.querySelectorAll('.acacias--comp-news-item'));

  // Build the table rows
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  cardEls.forEach((cardEl) => {
    // First cell: image/icon if present, otherwise leave empty
    let leftCell = '';
    // Try to find an image or icon in the card
    const img = cardEl.querySelector('img');
    if (img) {
      leftCell = img.cloneNode(true);
    }

    // Second cell: Collect all text content (date/title and headline)
    const rightCellParts = [];
    // Date/title
    const dateTitle = cardEl.querySelector('.text.acacias--navigation .cmp-text');
    if (dateTitle) {
      rightCellParts.push(dateTitle.textContent.trim());
    }
    // Headline/description
    const headline = cardEl.querySelector('.text.acacias--comp-news-text-title .cmp-text');
    if (headline) {
      rightCellParts.push(headline.textContent.trim());
    }
    // Compose right cell as a single string, separated by newlines
    const rightCell = rightCellParts.join('\n');

    rows.push([leftCell, rightCell]);
  });

  // Check for 'More' link at the bottom
  const moreLink = cardsContainer.querySelector('.acacias--comp-news-showmore .cmp-text a');
  if (moreLink) {
    rows.push(['', moreLink]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
