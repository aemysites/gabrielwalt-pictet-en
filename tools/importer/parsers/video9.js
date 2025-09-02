/* global WebImporter */
export default function parse(element, { document }) {
  // Find the video element inside the current element
  const video = element.querySelector('video');
  if (!video) return;

  // Required header row
  const headerRow = ['Video (video9)'];
  // Content row: clone the video element so it can be moved
  const contentRow = [video.cloneNode(true)];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
