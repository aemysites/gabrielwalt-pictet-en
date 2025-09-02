/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards grid wrapper
  const cardsWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!cardsWrapper) return;

  // Find all card anchor elements
  const cardEls = Array.from(cardsWrapper.querySelectorAll('.acacias--comp-news-item'));
  if (!cardEls.length) return;

  // Table header must match block name exactly
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  cardEls.forEach((card) => {
    // --- Image/Icon cell ---
    const imageWrapper = card.querySelector('.acacias--image-wrapper-news');
    const imageCellContent = [];
    if (imageWrapper) {
      // Main image
      const imgEl = imageWrapper.querySelector('img');
      if (imgEl) imageCellContent.push(imgEl);
      // Play icon overlay (if present)
      const iconEl = imageWrapper.querySelector('.acacias--news-item-icon');
      if (iconEl) imageCellContent.push(iconEl);
    }

    // --- Text cell ---
    const textCellContent = [];
    // Date/source
    const navText = card.querySelector('.text.acacias--navigation .cmp-text');
    if (navText) textCellContent.push(navText);
    // Title/description
    const descText = card.querySelector('.text.news .cmp-text');
    if (descText) textCellContent.push(descText);

    rows.push([
      imageCellContent.length ? imageCellContent : '',
      textCellContent.length ? textCellContent : ''
    ]);
  });

  // Add CTA row if present ("Read more")
  const showMoreWrapper = cardsWrapper.querySelector('.acacias--comp-news-showmore');
  if (showMoreWrapper) {
    const ctaLink = showMoreWrapper.querySelector('a.acacias--cta-underlined');
    if (ctaLink) {
      rows.push([
        '',
        ctaLink
      ]);
    }
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
