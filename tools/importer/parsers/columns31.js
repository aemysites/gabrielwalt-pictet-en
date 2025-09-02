/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main content area for the block
  const contentArea = element.querySelector('.acacias--hub-module-content-area');
  if (!contentArea) return;

  // Find the title (Key figures)
  const titleItem = contentArea.querySelector('.acacias--comp-title-h3');
  let titleEl = null;
  if (titleItem) {
    titleEl = titleItem.querySelector('.cmp-title');
  }

  // Find the numbers grid (all <li> items)
  const numbersItem = contentArea.querySelector('.acacias--comp-numbers');
  let numbersGrid = [];
  if (numbersItem) {
    const numbersList = numbersItem.querySelector('ul');
    if (numbersList) {
      const numberLis = Array.from(numbersList.children);
      // There are 6 items, arrange as 4 on top row, 2 on bottom row
      numbersGrid = numberLis;
    }
  }

  // Find the small body text (footnote)
  const smallBodyItem = contentArea.querySelector('.acacias--comp-small-body');
  let smallBodyEl = null;
  if (smallBodyItem) {
    smallBodyEl = smallBodyItem.querySelector('.cmp-text');
  }

  // Build the table rows
  const headerRow = ['Columns (columns31)'];

  // First content row: Title and top 4 numbers
  const firstRowCells = [];
  // Compose a wrapper for the title and top 4 numbers
  const firstRowWrapper = document.createElement('div');
  if (titleEl) firstRowWrapper.appendChild(titleEl);
  // Top 4 numbers
  const topNumbersWrapper = document.createElement('div');
  topNumbersWrapper.style.display = 'flex';
  topNumbersWrapper.style.flexWrap = 'wrap';
  for (let i = 0; i < 4; i++) {
    if (numbersGrid[i]) topNumbersWrapper.appendChild(numbersGrid[i]);
  }
  firstRowWrapper.appendChild(topNumbersWrapper);
  firstRowCells.push(firstRowWrapper);

  // Second content row: bottom 2 numbers and footnote
  const secondRowCells = [];
  const secondRowWrapper = document.createElement('div');
  // Bottom 2 numbers
  const bottomNumbersWrapper = document.createElement('div');
  bottomNumbersWrapper.style.display = 'flex';
  bottomNumbersWrapper.style.flexWrap = 'wrap';
  for (let i = 4; i < 6; i++) {
    if (numbersGrid[i]) bottomNumbersWrapper.appendChild(numbersGrid[i]);
  }
  secondRowWrapper.appendChild(bottomNumbersWrapper);
  // Footnote
  if (smallBodyEl) secondRowWrapper.appendChild(smallBodyEl);
  secondRowCells.push(secondRowWrapper);

  // Compose table
  const cells = [
    headerRow,
    firstRowCells,
    secondRowCells
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
