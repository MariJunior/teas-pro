'use strict';


const $ = require('jquery');
window.jQuery = $;

$(document).ready(function () {
  const image = document.querySelector('[data-fancybox]');

  if (image) {
    require("@fancyapps/fancybox");
  }
});
