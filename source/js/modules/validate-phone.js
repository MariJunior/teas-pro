'use strict';


const ready = require('../utils/document-ready');
const utils = require('../utils/utils');
const iMask = require('imask');

ready(function () {
  let feedbackFrom = document.querySelector('#feedback-from');
  let phoneInput = feedbackFrom.querySelector('#feedback-tel');
  let phoneSubmit = feedbackFrom.querySelector('#feedback-submit');
  let popup = document.querySelector('#success-popup');
  let closePopupBtn = popup.querySelector('.pop-up__btn');

  let maskOptions = {
    mask: '+{7} (000) 000-00-00'
  };

  let phoneMask = iMask.default(phoneInput, maskOptions);

  function onPopupEscPress (evt) {
    utils.default.isEscEvent(evt, closePopup);
  }

  function onPopupOverlayClick (evt) {
    if (evt.target.classList.contains('pop-up')) {
      closePopup();
    }
  }

  function onClosePopupBtnClick () {
    closePopup();
  }

  function onClosePopupBtnPress (evt) {
    utils.default.isEnterEvent(evt, closePopup);
  }

  function openPopup () {
    popup.classList.remove('pop-up--hide');

    document.addEventListener('keydown', onPopupEscPress);
    popup.addEventListener('click', onPopupOverlayClick);
    closePopupBtn.addEventListener('click', onClosePopupBtnClick);
    closePopupBtn.addEventListener('keydown', onClosePopupBtnPress);
  }

  function closePopup () {
    popup.classList.add('pop-up--hide');

    document.removeEventListener('keydown', onPopupEscPress);
    popup.removeEventListener('click', onPopupOverlayClick);
    closePopupBtn.removeEventListener('click', onClosePopupBtnClick);
    closePopupBtn.removeEventListener('keydown', onClosePopupBtnPress);
  }

  feedbackFrom.addEventListener('submit', evt => {
    evt.preventDefault();

    let phoneRegExp = /\+7\s\(9\d{2}\)\s\d{3}-\d{2}-\d{2}/;
    let err = 0;
    let xhr = new XMLHttpRequest();
    let formData = new FormData(feedbackFrom);
    let url = 'http://httpbin.org/response-headers?freeform='; // ТЕСТОВЫЙ АДРЕС, ВСТАВИТЬ СВОЙ

    phoneRegExp.lastIndex = 0;

    if(phoneInput && (!phoneInput.value.trim() || !phoneRegExp.test(phoneInput.value))) {
      phoneInput.classList.add('input--error');
      err = 1;
    }

    if (err) {
      return false;
    }

    phoneSubmit.setAttribute('disabled', 'true');

    xhr.open('POST', url, true);
    xhr.send(formData);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          feedbackFrom.reset();
          phoneMask.updateValue();
          openPopup();
        } else {
          alert(xhr.status + ': ' + xhr.statusText + ' Error');
        }

        phoneSubmit.removeAttribute('disabled');
      }
    };
  });

  phoneInput.addEventListener('focus', () => {
    if (phoneInput.classList.contains('input--error')) {
      phoneInput.classList.remove('input--error');
    }
  });
});
