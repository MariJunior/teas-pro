/* global exports */
'use strict';

const ready = require('../utils/document-ready.js');

ready(function () {
  const ESC_KEYCODE = 27;
  const ENTER_KEYCODE = 13;

  let utils = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        evt.preventDefault();

        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    }
  };

  exports.default = utils;
});
