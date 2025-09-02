/* global WebImporter */
export default function parse(element, { document }) {
  // Find the card list (ul) inside the block
  const cardList = element.querySelector('ul.acacias--comp-contacts');
  if (!cardList) return;

  // Prepare header row
  const headerRow = ['Cards (cards17)'];
  const rows = [headerRow];

  // For each card (li), extract image and text content
  cardList.querySelectorAll(':scope > li').forEach((li) => {
    // --- Image cell ---
    let imageEl = null;
    const image = li.querySelector('img');
    if (image) {
      imageEl = image.cloneNode(true);
    }

    // --- Text cell ---
    // Compose text content: title, description, CTA
    const textCell = document.createElement('div');

    // Title (name)
    const titleEl = li.querySelector('.cmp-title__text');
    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      textCell.appendChild(h3);
    }

    // Description (role)
    const descEl = li.querySelector('.text.acacias--navigation .cmp-text');
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      textCell.appendChild(p);
    }

    // CTA (Send a message)
    const ctaEl = li.querySelector('.acacias--contact-cta');
    const parentLink = li.querySelector('a.acacias--block-link');
    if (ctaEl && parentLink && parentLink.href) {
      // Find the text node inside ctaEl
      let ctaText = '';
      ctaEl.childNodes.forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0) {
          ctaText = n.textContent.trim();
        }
      });
      if (!ctaText) {
        ctaText = parentLink.textContent.trim();
      }
      const link = document.createElement('a');
      link.href = parentLink.href;
      link.textContent = ctaText;
      link.target = parentLink.target || '_self';
      textCell.appendChild(link);
    }

    // Add the card row: [image, text]
    rows.push([
      imageEl || '',
      textCell
    ]);
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
