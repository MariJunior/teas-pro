'use strict';


const ready = require('../utils/document-ready');

ready(function () {
  let menu = document.querySelector('.page-header__wrap');
  let ancors = document.querySelectorAll('a[href^="#"');
  const headerHeight = menu.scrollHeight;

  window.onscroll = () => {
    if (window.pageYOffset >= headerHeight) {
      menu.classList.add('page-header__wrap--scroll')
    } else if (window.pageYOffset <= headerHeight && menu.classList.contains('page-header__wrap--scroll')) {
      menu.classList.remove('page-header__wrap--scroll');
    }
  };

  ancors.forEach(ancor => {
    ancor.addEventListener('click', (evt) => {
      if (ancor.classList.contains('navigation-list__link--user')) {
        return
      }

      evt.preventDefault();

      let href = ancor.getAttribute('href').substring(1);
      const scrollTarget = document.getElementById(href);
      const elementPosition = scrollTarget.getBoundingClientRect().top;
      const offsetPosition = elementPosition - headerHeight - 25;

      window.scrollBy({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });
});
