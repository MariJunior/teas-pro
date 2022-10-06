'use strict';


const ready = require('../utils/document-ready');

ready(function () {
  let tableRows = document.querySelectorAll('.products__table-row:nth-child(n + 7)');
  let moreBtn = document.querySelector('.products__more-btn');

  tableRows.forEach(tableRow => {
    tableRow.classList.add('visually-hidden');
  });

  moreBtn.addEventListener('click', () => {
    let moreBtnText = moreBtn.querySelector('.products__more-btn-text');

    if (moreBtnText.textContent === 'Показать больше') {
      moreBtnText.textContent = 'Показать меньше';
      moreBtn.classList.add('products__more-btn--less');
      tableRows.forEach(tableRow => {
        tableRow.classList.remove('visually-hidden');
      });
    } else {
      moreBtnText.textContent = 'Показать больше';
      moreBtn.classList.remove('products__more-btn--less');
      tableRows.forEach(tableRow => {
        tableRow.classList.add('visually-hidden');
      });
    }
  });
});
