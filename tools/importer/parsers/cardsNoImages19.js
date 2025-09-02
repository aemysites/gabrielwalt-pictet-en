/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists
  if (!element) return;

  // Table header row as required
  const headerRow = ['Cards (cardsNoImages19)'];
  const rows = [headerRow];

  // Find the timeline items wrapper
  const timelineItemsWrapper = element.querySelector('.acacias--timeline--items-wrapper');
  if (!timelineItemsWrapper) return;

  // Find all timeline items (cards)
  const timelineItems = timelineItemsWrapper.querySelectorAll('.acacias--timeline--item');

  timelineItems.forEach((item) => {
    // Defensive: Only proceed if item exists
    if (!item) return;

    // Get the caption (title)
    const caption = item.querySelector('.acacias--timeline--item-caption');
    // Get the content (description and CTA)
    const content = item.querySelector('.acacias--timeline--item-content');

    // Compose cell content
    const cellContent = [];
    if (caption) {
      // Make a heading element for the card title
      const heading = document.createElement('strong');
      heading.textContent = caption.textContent.trim();
      cellContent.push(heading);
    }
    if (content) {
      // Add all child nodes of content (paragraphs, links)
      Array.from(content.childNodes).forEach((node) => {
        // Only add non-empty nodes
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          cellContent.push(node);
        }
      });
    }
    // Add the row for this card
    rows.push([cellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
