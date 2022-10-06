// /* global exports process */
/* global exports */
/* eslint-disable no-console */
'use strict';

const {series, parallel, src, dest, watch} = require('gulp');
// const path = require('path');
const del = require('del');
const htmlprettify = require('gulp-html-prettify');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const minify = require('gulp-csso');
const rename = require('gulp-rename');
const server = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
// const cheerio = require('gulp-cheerio');
// const replace = require('gulp-replace');
// const svgSprite = require('gulp-svg-sprite');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify');

function clean() {
  return del('build');
}

function copy() {
  return src([
    'source/fonts/**/*.{woff,woff2,eot,ttf}',
    // 'source/img/favicons/*.{ico}',
    // 'source/img/favicons/site.webmanifest'
  ], {
    base: 'source'
  })

    .pipe(dest('build'));
}

function html() {
  return src('source/pages/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(htmlprettify({
      indent_char: ' ',
      indent_size: 2
    }))
    .pipe(dest('build'))
    .pipe(server.stream());
}

function style() {
  return src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(dest('build/css'))
    .pipe(minify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('build/css'))
    .pipe(server.stream());
}

function images() {
  return src(['source/img/**/*.{png,jpg,jpeg,svg}', '!source/img/sprite.svg'])
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo({
        plugins: [
            {removeViewBox: false},
            {removeStyleElement: true},
            {convertColors: {shorthex: false}}
        ]
      })
    ]))
    .pipe(dest('build/img'));
}

// function sprite() {
//   return src('source/img/sprite/*.svg')
//     .pipe(cheerio({
//         run: function ($) {
//           $('[fill]').removeAttr('fill');
//           $('[style]').removeAttr('style');
//         },
//         parserOptions: {
//           xmlMode: true
//         }
//     }))
//     .pipe(replace('&gt;', '>'))
//     .pipe(svgSprite({
//         mode: {
//           symbol: {
//             sprite: '../sprite.svg'
//           }
//         }
//       }
//     ))
//     .pipe(dest('build/img'))
// }

function buildJs() {
  return src('source/js/script.js')
    .pipe(plumber())
    .pipe(webpackStream({
      mode: 'production',
      output: {
        filename: 'script.js',
      },
      performance: {
        maxEntrypointSize: 5120000,
        maxAssetSize: 5120000
      },
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
              presets: [
                [
                  '@babel/preset-env'
                ]
              ]
            }
          }
        ]
      },
      optimization: {
        minimize: false
      },
      // externals: {
      //   jquery: 'jQuery'
      // }
    }))
    .pipe(dest('build/js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('build/js'));
}

function reload(done) {
  server.reload();
  done();
}

exports.clean = clean;
exports.copy = copy;
exports.html = html;
exports.style = style;
exports.images = images;
// exports.sprite = sprite;
exports.buildJs = buildJs;

function serve() {
  server.init({
    // browser: 'google chrome',
    server: 'build/',
    startPath: 'index.html',
    notify: false,
    // open: false,
    cors: true,
    ui: false
  });

  watch(['source/pages/**/*.pug', 'source/pug/**/*.pug'], { events: ['add', 'change', 'unlink'], delay: 50 }, series(
    html,
    reload
  ));
  watch(['source/sass/**/*.scss'], { events: ['add', 'change', 'unlink'], delay: 50 }, series(
    style,
    reload
  ));
  watch(['source/js/**/*.js'], { events: ['add', 'change', 'unlink'], delay: 50 }, series(
    buildJs,
    reload
  ));
  watch(['source/img/*'], { events: ['all'], delay: 50 }, series(
    images,
    reload
  ));
  // watch(['source/img/sprite/*.svg'], { events: ['all'], delay: 50}, series(
  //   sprite,
  //   reload
  // ));
}

exports.build = series(
  clean,
  parallel(copy, images),
  // sprite,
  parallel(html, style, buildJs)
);

exports.default = series(
  clean,
  parallel(copy, images),
  // sprite,
  parallel(html, style, buildJs),
  serve
);
