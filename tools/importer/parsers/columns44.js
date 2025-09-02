/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children with a selector
  function getChildrenByClass(parent, className) {
    return Array.from(parent.children).filter((el) => el.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Columns (columns44)'];

  // 2. First main row: Title (left), Main text (center), Portrait/quote (right)
  // Find the grid wrapper
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;
  const gridColumns = grid.querySelectorAll(':scope > .acacias-GridColumn');

  // Left column: Title
  let leftTitle = null;
  if (gridColumns[0]) {
    leftTitle = gridColumns[0].querySelector('.acacias--hub-module-title');
  }

  // Center column: Main text
  let mainText = null;
  if (gridColumns[2]) {
    // Find the first .acacias--content-item.acacias--comp-2-cols-fluid
    const firstFluid = gridColumns[2].querySelector('.acacias--content-item.acacias--comp-2-cols-fluid');
    if (firstFluid) {
      mainText = firstFluid;
    }
  }

  // Right column: Portrait image and quote
  let portraitImage = null;
  let portraitQuote = null;
  if (gridColumns[2]) {
    // Find the first .acacias--content-item.acacias--comp-two-cols-static
    const firstStatic = gridColumns[2].querySelector('.acacias--content-item.acacias--comp-two-cols-static');
    if (firstStatic) {
      // This static block has two columns: image and quote
      const staticInnerGrid = firstStatic.querySelector('.acacias-Grid');
      if (staticInnerGrid) {
        const staticCols = staticInnerGrid.querySelectorAll(':scope > .acacias-GridColumn');
        if (staticCols[0]) {
          // Image
          const imgContainer = staticCols[0].querySelector('.acacias--image');
          if (imgContainer) {
            portraitImage = imgContainer;
          }
        }
        if (staticCols[1]) {
          // Quote
          const quoteText = staticCols[1].querySelector('.cmp-text');
          if (quoteText) {
            portraitQuote = quoteText;
          }
        }
      }
    }
  }

  // Compose first row (3 columns)
  const firstRow = [
    leftTitle,
    mainText,
    [portraitImage, portraitQuote].filter(Boolean),
  ];

  // 3. Second main row: Lead text, carousel, artist links
  // Find next blocks
  let leadText = null;
  let carouselLink = null;
  let artistLinks = null;
  if (gridColumns[2]) {
    // Find .acacias--content-item.acacias--comp-lead (first)
    const leadBlock = Array.from(gridColumns[2].querySelectorAll('.acacias--content-item.acacias--comp-lead'))[0];
    if (leadBlock) {
      leadText = leadBlock;
    }
    // Find .embed.acacias--content-item (carousel)
    const embedBlock = gridColumns[2].querySelector('.embed.acacias--content-item');
    if (embedBlock) {
      // Find iframe and convert to link
      const iframe = embedBlock.querySelector('iframe');
      if (iframe && iframe.src) {
        const a = document.createElement('a');
        a.href = iframe.src;
        a.textContent = 'View carousel';
        a.target = '_blank';
        carouselLink = a;
      }
    }
    // Find .acacias--content-item.acacias--comp-lead (second, artist links)
    const leadBlocks = Array.from(gridColumns[2].querySelectorAll('.acacias--content-item.acacias--comp-lead'));
    if (leadBlocks.length > 1) {
      artistLinks = leadBlocks[1];
    }
  }
  const secondRow = [leadText, carouselLink, artistLinks];

  // 4. Third main row: Visit site/footnotes (left), link list (right)
  // Find next .acacias--content-item.acacias--comp-two-cols-static
  let visitSite = null;
  let footnotes = null;
  let linkList = null;
  if (gridColumns[2]) {
    const staticBlocks = Array.from(gridColumns[2].querySelectorAll('.acacias--content-item.acacias--comp-two-cols-static'));
    if (staticBlocks.length > 1) {
      const staticInnerGrid = staticBlocks[1].querySelector('.acacias-Grid');
      if (staticInnerGrid) {
        const staticCols = staticInnerGrid.querySelectorAll(':scope > .acacias-GridColumn');
        if (staticCols[0]) {
          // Visit site and footnotes
          const visitContainer = staticCols[0].querySelector('.cmp-container');
          if (visitContainer) {
            visitSite = visitContainer;
          }
          const footnotesDiv = staticCols[0].querySelector('.acacias--footnotes');
          if (footnotesDiv) {
            footnotes = footnotesDiv;
          }
        }
        if (staticCols[1]) {
          // Link list
          const linkListBlock = staticCols[1].querySelector('.acacias--comp-link-list');
          if (linkListBlock) {
            linkList = linkListBlock;
          }
        }
      }
    }
  }
  // Compose third row (2 columns)
  const thirdRow = [
    [visitSite, footnotes].filter(Boolean),
    linkList,
  ];

  // 5. Fourth main row: Section title (left), section text (right)
  let sectionTitle = null;
  let sectionText = null;
  if (gridColumns[2]) {
    // Find .acacias--content-item.acacias--comp-title-h3
    const h3Block = gridColumns[2].querySelector('.acacias--content-item.acacias--comp-title-h3');
    if (h3Block) {
      sectionTitle = h3Block;
    }
    // Find .acacias--content-item.acacias--comp-2-cols-fluid (second)
    const fluidBlocks = Array.from(gridColumns[2].querySelectorAll('.acacias--content-item.acacias--comp-2-cols-fluid'));
    if (fluidBlocks.length > 1) {
      sectionText = fluidBlocks[1];
    }
  }
  const fourthRow = [sectionTitle, sectionText];

  // Compose the table
  const cells = [
    headerRow,
    firstRow,
    secondRow,
    thirdRow,
    fourthRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
