'use strict';


const ready = require('../utils/document-ready');
const utils = require('../utils/utils');


ready(function () {
  let authorizationOpenButton = document.querySelector('.navigation-list__link--user');
  let popup = document.querySelector('#authorization-popup');
  let form = popup.querySelector('#authorization-from');
  let login = form.querySelector('#authorization-name');
  let formFields = form.querySelectorAll('input');

  function onPopupEscPress (evt) {
    utils.default.isEscEvent(evt, closePopup);
  }

  function onPopupOverlayClick (evt) {
    if (evt.target.classList.contains('pop-up')) {
      closePopup();
    }
  }

  function onFormSubmit (evt) {
    for (let i = 0; i < formFields.length; ++i) {

      if (!formFields[i].value) {
        evt.preventDefault();

        formFields[i].focus();
        return
      }
    }
  }

  function openPopup () {
    popup.classList.remove('pop-up--hide');

    login.focus();

    document.addEventListener('keydown', onPopupEscPress);
    popup.addEventListener('click', onPopupOverlayClick);
    form.addEventListener('submit', onFormSubmit);
  }

  function closePopup () {
    popup.classList.add('pop-up--hide');

    document.removeEventListener('keydown', onPopupEscPress);
    popup.removeEventListener('click', onPopupOverlayClick);
    form.addEventListener('submit', onFormSubmit);
  }

  popup.classList.remove('pop-up--no-js');
  popup.classList.add('pop-up--hide');

  authorizationOpenButton.addEventListener('click', evt => {
    evt.preventDefault();

    openPopup();
  });

  authorizationOpenButton.addEventListener('keydown', evt => {
    utils.default.isEnterEvent(evt, openPopup);
  });
});
