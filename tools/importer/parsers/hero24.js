/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the hero image (none present in this HTML)
  function findHeroImage(el) {
    const img = el.querySelector('img');
    if (img) return img;
    return null;
  }

  // Helper to find the main hero text content (should include all relevant text)
  function findHeroText(el) {
    let heading = null;
    heading = el.querySelector('h1.cmp-breadcrumb__item--active');
    if (!heading) {
      const h2 = el.querySelector('.cmp-title__text');
      if (h2) heading = h2;
    }
    const content = document.createElement('div');
    if (heading) content.appendChild(heading.cloneNode(true));
    const desc = el.querySelector('.cmp-title__description, .cmp-title p');
    if (desc) content.appendChild(desc.cloneNode(true));
    if (!content.hasChildNodes()) return '';
    return content;
  }

  const headerRow = ['Hero (hero24)'];
  const heroImage = findHeroImage(element);
  // Always produce 3 rows: header, image (empty if none), content
  const imageRow = [heroImage ? heroImage.cloneNode(true) : ''];
  const heroText = findHeroText(element);
  const contentRow = [heroText];

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
