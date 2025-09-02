/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the cards container
  const cardsContainer = element.querySelector('.acacias--hub-module-content-area');
  if (!cardsContainer) return;

  // Find the list of cards (ul > li)
  const ul = cardsContainer.querySelector('ul.acacias--content-item-inner-wrapper');
  if (!ul) return;

  // Prepare header row
  const headerRow = ['Cards (cardsNoImages43)'];
  const rows = [headerRow];

  // For each card (li)
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Defensive: find the wrapper
    const wrapper = li.querySelector('.acacias--numbers-wrapper');
    if (!wrapper) return;

    // Extract number (heading)
    const numberEl = wrapper.querySelector('.text-numbers-big');
    // Extract unit (subtitle)
    const unitEl = wrapper.querySelector('.text-numbers-unit');
    // Extract caption (description)
    const captionEl = wrapper.querySelector('.text-numbers-caption');

    // Compose card content
    const cardContent = document.createElement('div');
    if (numberEl) {
      const h3 = document.createElement('h3');
      h3.textContent = numberEl.textContent.trim();
      cardContent.appendChild(h3);
    }
    if (unitEl) {
      const subtitle = document.createElement('div');
      subtitle.style.fontWeight = 'bold';
      subtitle.style.fontSize = '1em';
      subtitle.textContent = unitEl.textContent.trim();
      cardContent.appendChild(subtitle);
    }
    if (captionEl) {
      const desc = document.createElement('p');
      desc.textContent = captionEl.textContent.trim();
      cardContent.appendChild(desc);
    }
    rows.push([cardContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
