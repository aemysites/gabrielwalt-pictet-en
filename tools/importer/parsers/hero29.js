/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the first video src in the block
  function getVideoSrc(el) {
    const video = el.querySelector('video');
    if (video) {
      const source = video.querySelector('source');
      if (source && source.src) {
        return source.src;
      }
    }
    return null;
  }

  // Get the header row
  const headerRow = ['Hero (hero29)'];

  // Find the image/video section (background visual)
  let visualCell = null;
  const imageSection = element.querySelector('.acacias--landing-stage-image');
  if (imageSection) {
    // Try to find an <img> inside
    const img = imageSection.querySelector('img');
    if (img) {
      visualCell = img;
    } else {
      // Try to find a video
      const videoSrc = getVideoSrc(imageSection);
      if (videoSrc) {
        // Represent video as a link (not as an embedded video)
        const videoLink = document.createElement('a');
        videoLink.href = videoSrc;
        videoLink.textContent = 'Video';
        visualCell = videoLink;
      }
    }
  }
  // Defensive fallback: if nothing found, leave cell empty
  if (!visualCell) visualCell = '';

  // Find the title and lead text
  let contentCell = [];
  // Title
  const titleSection = element.querySelector('.acacias--landing-stage-title');
  if (titleSection) {
    const h1 = titleSection.querySelector('h1');
    if (h1) contentCell.push(h1);
  }
  // Lead paragraph
  const leadSection = element.querySelector('.acacias--landing-stage-lead');
  if (leadSection) {
    // Find all <p> inside
    const paragraphs = leadSection.querySelectorAll('p');
    paragraphs.forEach(p => contentCell.push(p));
  }
  // Defensive fallback: if nothing found, leave cell empty
  if (contentCell.length === 0) contentCell = [''];

  // Compose the table rows
  const cells = [
    headerRow,
    [visualCell],
    [contentCell]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
