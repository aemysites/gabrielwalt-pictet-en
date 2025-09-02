/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getImmediateChild(parent, selector) {
    return Array.from(parent.children).find(el => el.matches(selector));
  }

  // 1. Get left column: Title (as text)
  let leftCol = '';
  const gridWrapper = getImmediateChild(element, '.acacias--grid-wrapper');
  if (gridWrapper) {
    const grid = getImmediateChild(gridWrapper, '.acacias-Grid');
    if (grid) {
      // Find left column with title
      const leftColDiv = Array.from(grid.children).find(child => child.classList.contains('acacias--hub-module-left-col'));
      if (leftColDiv) {
        const titleText = leftColDiv.querySelector('.cmp-title__text');
        if (titleText) {
          leftCol = titleText.textContent.trim();
        }
      }
    }
  }

  // 2. Get right column: All main content (as elements)
  let rightColContent = [];
  if (gridWrapper) {
    const grid = getImmediateChild(gridWrapper, '.acacias-Grid');
    if (grid) {
      // Find right column with main content
      const rightColDiv = Array.from(grid.children).find(child => child.classList.contains('acacias--hub-module-content-area'));
      if (rightColDiv) {
        // Get the main container
        const cmpContainer = rightColDiv.querySelector('.cmp-container');
        if (cmpContainer) {
          // Lead text (top paragraphs)
          const leadItem = cmpContainer.querySelector('.acacias--comp-lead .cmp-text');
          if (leadItem) {
            // Collect all paragraphs
            leadItem.querySelectorAll('p').forEach(p => {
              rightColContent.push(p.cloneNode(true));
            });
          }

          // Two column static block
          const twoCols = cmpContainer.querySelector('.acacias--comp-two-cols-static');
          if (twoCols) {
            const innerWrapper = twoCols.querySelector('.acacias--content-item-inner-wrapper');
            if (innerWrapper) {
              // Get both columns
              const colDivs = innerWrapper.querySelectorAll('.acacias-GridColumn');
              if (colDivs.length === 2) {
                // First column: image
                const imgContainer = colDivs[0].querySelector('.cmp-image');
                let imgEl = null;
                if (imgContainer) {
                  imgEl = imgContainer.querySelector('img');
                }
                // Second column: quote and attribution
                const quoteText = colDivs[1].querySelector('.cmp-text');

                // Compose a flex container for image + quote
                const flexDiv = document.createElement('div');
                flexDiv.style.display = 'flex';
                flexDiv.style.alignItems = 'flex-start';
                flexDiv.style.gap = '32px';
                // Only add image if present
                if (imgEl) {
                  flexDiv.appendChild(imgEl.cloneNode(true));
                }
                if (quoteText) {
                  // Add all children (h3, blockquote, etc)
                  Array.from(quoteText.children).forEach(child => {
                    flexDiv.appendChild(child.cloneNode(true));
                  });
                }
                rightColContent.push(flexDiv);
              }
            }
          }
        }
      }
    }
  }

  // Compose table rows
  const headerRow = ['Columns (columns13)'];
  const contentRow = [
    leftCol,
    rightColContent
  ];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
