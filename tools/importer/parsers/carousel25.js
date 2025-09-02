/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main gallery wrapper
  const galleryWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!galleryWrapper) return;

  // Get all gallery items (images)
  const galleryItems = galleryWrapper.querySelectorAll('.acacias--gallery-items .acacias--gallery-item');
  // Get all caption items (text)
  const captionItems = galleryWrapper.querySelectorAll('.acacias--gallery--captions .acacias--gallery--caption-item');

  // Defensive: ensure we have matching slides
  const slideCount = Math.min(galleryItems.length, captionItems.length);

  // Table header: must match block name exactly
  const headerRow = ['Carousel (carousel25)'];
  const rows = [headerRow];

  for (let i = 0; i < slideCount; i++) {
    // Image cell: reference the <img> element directly
    const img = galleryItems[i].querySelector('img');
    if (!img) continue; // Defensive: skip if no image

    // Text cell: reference the caption block directly
    const captionBlock = captionItems[i];
    // Defensive: if no caption, use empty string
    const textCell = captionBlock ? captionBlock : '';

    rows.push([img, textCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
