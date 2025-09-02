/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists
  if (!element) return;

  // Helper to get immediate child columns
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;

  // Get all top-level columns (left, center/content, right)
  const columns = Array.from(grid.querySelectorAll(':scope > .acacias-GridColumn'));

  // We'll build two columns: left (author/share), right (main content)
  // Find left column (author/share)
  const leftCol = columns.find(col => col.classList.contains('acacias--article-left-col'));
  // Find center/content column
  const contentCol = columns.find(col => col.classList.contains('acacias--content-area'));

  // LEFT COLUMN: Author/share
  let leftContent = [];
  if (leftCol) {
    // Author tag
    const authorTag = leftCol.querySelector('.acacias--author-tag');
    if (authorTag) leftContent.push(authorTag);
    // Share block
    const shareBlock = leftCol.querySelector('.acacias--article-share');
    if (shareBlock) leftContent.push(shareBlock);
  }

  // CENTER COLUMN: Main content
  let mainContent = [];
  if (contentCol) {
    // Get all content items and quote blocks
    const contentContainer = contentCol.querySelector('.cmp-container');
    if (contentContainer) {
      // All direct children (content blocks)
      const contentBlocks = Array.from(contentContainer.children).filter(el => {
        // Only keep blocks with actual content
        if (el.classList.contains('acacias--content-item')) {
          // Defensive: skip empty blocks
          const text = el.querySelector('.text');
          if (text && text.textContent.trim()) return true;
          // Some blocks may be empty wrappers
          return false;
        }
        // Quotes
        if (el.classList.contains('acacias--quote')) return true;
        return false;
      });
      mainContent = mainContent.concat(contentBlocks);
    }
  }

  // Build table rows
  const headerRow = ['Columns (columns39)'];
  const contentRow = [leftContent, mainContent];

  // Create block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
