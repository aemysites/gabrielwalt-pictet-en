/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content column containing the image and caption
  const contentCol = Array.from(element.querySelectorAll(':scope > div > div > div'))
    .find(col => col.classList.contains('acacias--content-area') || col.classList.contains('acacias--hub-module-content-area'));

  // Defensive fallback if not found
  let imageBlock, captionBlock;
  if (contentCol) {
    imageBlock = contentCol.querySelector('.acacias--comp-image');
    if (imageBlock) {
      captionBlock = imageBlock.querySelector('.acacias--image-caption');
    }
  }

  // Get the image element
  let imgEl = null;
  if (imageBlock) {
    imgEl = imageBlock.querySelector('img');
  }

  // Get the caption element
  let captionEl = null;
  if (captionBlock) {
    // Use the deepest .cmp-text or paragraph
    captionEl = captionBlock.querySelector('.cmp-text') || captionBlock.querySelector('p') || captionBlock;
  }

  // Table rows
  const headerRow = ['Hero (hero46)'];
  const imageRow = [imgEl ? imgEl : ''];
  const contentRow = [captionEl ? captionEl : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block
  element.replaceWith(block);
}
