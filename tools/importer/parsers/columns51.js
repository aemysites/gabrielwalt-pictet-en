/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildrenByClass(parent, className) {
    return Array.from(parent.children).filter(child => child.classList.contains(className));
  }

  // 1. Find the grid wrapper (main content area)
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // 2. Find the main grid (contains columns)
  const mainGrid = gridWrapper.querySelector('.acacias-Grid');
  if (!mainGrid) return;

  // 3. Get all direct grid columns
  const gridColumns = Array.from(mainGrid.children).filter(child => child.classList.contains('acacias-GridColumn'));

  // 4. Find left column (title), skip empty columns
  let leftCol = null;
  for (const col of gridColumns) {
    if (col.querySelector('.acacias--hub-module-title')) {
      leftCol = col;
      break;
    }
  }

  // 5. Find main content column (the one with .acacias--hub-module-content-area)
  const contentCol = mainGrid.querySelector('.acacias--hub-module-content-area');
  if (!contentCol) return;

  // 6. Inside contentCol, find the container
  const container = contentCol.querySelector('.cmp-container');
  if (!container) return;

  // 7. Find all direct content items inside the container
  const contentItems = Array.from(container.children).filter(child => child.classList.contains('acacias--content-item'));

  // 8. First content item: news grid (3 columns)
  const newsGridItem = contentItems.find(item => item.querySelector('.acacias--comp-news-featured'));
  let newsGrid = null;
  if (newsGridItem) {
    newsGrid = newsGridItem.querySelector('.acacias--comp-news-featured');
  }

  // 9. Second content item: h3 title
  const h3TitleItem = contentItems.find(item => item.classList.contains('acacias--comp-title-h3'));
  // 10. Third content item: 2-cols-fluid (text)
  const twoColsFluidItem = contentItems.find(item => item.classList.contains('acacias--comp-2-cols-fluid'));
  // 11. Fourth content item: video
  const videoItem = contentItems.find(item => item.classList.contains('acacias--comp-video'));

  // --- Compose table rows ---
  const headerRow = ['Columns (columns51)'];

  // --- First content row: 3 columns for news ---
  let newsCols = [];
  if (newsGrid) {
    // Only get direct children that are links (news items)
    const newsLinks = Array.from(newsGrid.children).filter(child => child.tagName === 'A');
    newsCols = newsLinks;
  }

  // Defensive: if less than 3, fill with empty
  while (newsCols.length < 3) newsCols.push('');
  const newsRow = newsCols;

  // --- Second content row: 2 columns, left is text (title + text), right is video ---
  let leftTextCol = [];
  let rightVideoCol = [];

  // Left: h3 title + 2-cols-fluid text
  if (h3TitleItem) leftTextCol.push(h3TitleItem);
  if (twoColsFluidItem) leftTextCol.push(twoColsFluidItem);

  // Right: video
  if (videoItem) rightVideoCol.push(videoItem);

  // Defensive: if both left and right are empty, skip row
  const secondRow = [leftTextCol.length ? leftTextCol : '', rightVideoCol.length ? rightVideoCol : ''];

  // --- Compose table ---
  const cells = [
    headerRow,
    newsRow,
    secondRow
  ];

  // --- Create and replace ---
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
