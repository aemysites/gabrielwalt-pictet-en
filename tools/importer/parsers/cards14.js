/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from a wrapper
  function getImage(wrapper) {
    if (!wrapper) return null;
    const img = wrapper.querySelector('img');
    return img || null;
  }

  // Helper to extract text from a .cmp-text container
  function getText(container) {
    if (!container) return null;
    const cmpText = container.querySelector('.cmp-text');
    return cmpText ? cmpText : container;
  }

  // Helper to build card text cell
  function buildTextCell(textBlocks) {
    // Defensive: filter out nulls
    return textBlocks.filter(Boolean);
  }

  // Find the main grid containing cards
  const mainGrid = element.querySelector('.acacias-Grid.acacias--news-stage-content');
  if (!mainGrid) return;

  // Header row
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // --- Featured Card (left column, large) ---
  const featuredLink = mainGrid.querySelector('.acacias--news-stage-left-col.acacias--comp-news-item');
  if (featuredLink) {
    // Image
    const imageWrapper = featuredLink.querySelector('.acacias--image-wrapper-news');
    const img = getImage(imageWrapper);

    // Text blocks
    const navTextCol = featuredLink.querySelector('.acacias--news-item-featured-large .acacias-GridColumn .acacias--navigation');
    const navText = getText(navTextCol);
    const titleCol = featuredLink.querySelector('.acacias--news-item-featured-large .acacias-GridColumn .large-body');
    const titleText = getText(titleCol);
    const descCol = featuredLink.querySelector('.acacias--news-item-featured-large .acacias-GridColumn .small-body');
    const descText = getText(descCol);

    // Compose text cell
    const textCell = buildTextCell([navText, titleText, descText]);
    rows.push([img, textCell]);
  }

  // --- Right Column Cards (smaller cards) ---
  const rightCol = mainGrid.querySelector('.acacias--news-stage-right-col');
  if (rightCol) {
    // Each card is an <a> with .acacias--comp-news-item
    const cardLinks = rightCol.querySelectorAll('.acacias--comp-news-item');
    cardLinks.forEach((cardLink) => {
      // Image
      const imageWrapper = cardLink.querySelector('.acacias--image-wrapper-news');
      const img = getImage(imageWrapper);

      // If there's an icon, include it after the image
      const iconWrapper = cardLink.querySelector('.acacias--news-item-icon');
      let iconImg = null;
      if (iconWrapper) {
        iconImg = iconWrapper.querySelector('img');
      }
      let imageCell;
      if (img && iconImg) {
        imageCell = [img, iconImg];
      } else if (img) {
        imageCell = img;
      } else if (iconImg) {
        imageCell = iconImg;
      } else {
        imageCell = '';
      }

      // Text blocks
      const navText = getText(cardLink.querySelector('.acacias--navigation'));
      const titleText = getText(cardLink.querySelector('.news'));
      // Compose text cell
      const textCell = buildTextCell([navText, titleText]);
      rows.push([imageCell, textCell]);
    });
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
