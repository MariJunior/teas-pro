/* eslint-disable */
'use strict';


const ready = require('../utils/document-ready');

ready(function () {
  mapboxgl.accessToken = "pk.eyJ1IjoibWFyaWJhbmFuYSIsImEiOiJja2lxNGp6OXQwYThvMzFsMzgxZHVxOGt6In0.KRH33xb9VSoIretAN1_M9w";

  let map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/maribanana/ckir6c54k1tbc17oiuy504vsi",
    center: [30.222830, 59.944583],
    zoom: 14,
    scrollZoom: false,
    attributionControl: false
  });

  let language = new MapboxLanguage();
  map.addControl(language);

  map.addControl(new mapboxgl.NavigationControl({
    defaultLanguage: 'ru'
  }));

  let popup = new mapboxgl.Popup({
      offset: 25
    })
    .setHTML('<h3> Санкт-Петербург, ул. Кораблестроителей, 20 </h3><p> <a href="#", class="map__pop-up-link"> Перейти к карте </a> </p>');

  let marker = new mapboxgl.Marker({
      color: "#fcb51e",
      draggable: true
    })
    .setLngLat([30.212795, 59.943359])
    .setPopup(popup)
    .addTo(map);
});
