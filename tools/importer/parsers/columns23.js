/* global WebImporter */
export default function parse(element, { document }) {
  // Find all .acacias--row blocks (top-level columns blocks)
  const rows = Array.from(element.querySelectorAll('.acacias--row.acacias--hub-module.aem-GridColumn.aem-GridColumn--default--12'));
  if (!rows.length) return;

  // Helper: convert iframes to links (except images)
  function convertIframesToLinks(node) {
    if (!node) return node;
    // Deep clone so we don't mutate original
    const clone = node.cloneNode(true);
    clone.querySelectorAll('iframe[src]').forEach(iframe => {
      const src = iframe.getAttribute('src');
      if (src) {
        const a = document.createElement('a');
        a.href = src;
        a.textContent = src;
        iframe.replaceWith(a);
      }
    });
    return clone;
  }

  rows.forEach(row => {
    // Find left and right columns
    const leftCol = row.querySelector('.acacias--hub-module-left-col .acacias--hub-module-title');
    const rightCol = row.querySelector('.acacias--content-area');

    // Newsletter special case (no leftCol, but multiple right columns)
    if (!leftCol && rightCol) {
      const newsletterHeader = rightCol.querySelector('.acacias--newsletter-header');
      const newsletterDesc = rightCol.querySelector('.acacias-subscribe-second-col');
      const newsletterForm = rightCol.querySelector('.acacias--newsletter-sub--form-comp');
      if (newsletterHeader && newsletterDesc && newsletterForm) {
        const headerRow = ['Columns (columns23)'];
        const contentRow = [convertIframesToLinks(newsletterHeader), convertIframesToLinks(newsletterDesc), convertIframesToLinks(newsletterForm)];
        const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
        row.replaceWith(table);
        return;
      }
    }

    // Standard two-column block
    if (leftCol && rightCol) {
      const headerRow = ['Columns (columns23)'];
      const contentRow = [convertIframesToLinks(leftCol), convertIframesToLinks(rightCol)];
      const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
      row.replaceWith(table);
      return;
    }

    // Fallback: treat the entire row as a single column block
    const headerRow = ['Columns (columns23)'];
    const contentRow = [convertIframesToLinks(row)];
    const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
    row.replaceWith(table);
  });
}
