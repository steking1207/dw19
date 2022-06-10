const { src, dest, watch, parallel, series } = require("gulp");
const gulp = require("gulp");
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const autoprefixer = require('gulp-autoprefixer');
const cache = require('gulp-cache');
const fileinclude = require('gulp-file-include');
const removeHtmlComments = require('gulp-remove-html-comments');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const uglify = require('gulp-uglify');
const ghPages = require('gulp-gh-pages');

const merge = require('merge-stream');
const CONFIGS = [
  require('./gulp.config.web')
];

const paths = {
  html: {
    src: 'src/html/**/*.html',
    dest: 'dist/'
  },
  partial_html: {
    src: 'src/partial/**/*.html',
    dest: 'dist/'
  },
  css: {
    src: 'src/scss/**/*.scss',
    // dest: 'dist/web/assets/css'
  },
  scripts: {
    src: 'src/js/**/*.js',
    // dest: 'dist/web/assets/js'
  },
  media: {
    src: 'src/img/**/*.{jpg,png,svg,json}',
    // dest: 'dist/web/assets/img'
  },
  assets: {
    src: 'src/assets/**/*.{jpg,png,svg}',
    dest: 'dist/assets'
  }
};


function clean(cb) {
  cb();
}


function html(cb) {
  return gulp
        .src(paths.html.src)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true//保留退位
        }))
        .pipe(removeHtmlComments())
        .pipe(dest(paths.html.dest))
}

function css(cb) {
  const tasks = CONFIGS.map(config => {
      return gulp.src(config.css.sourcePaths)
          .pipe(sass().on('error', sass.logError))
          .pipe(autoprefixer())
          .pipe(gulp.dest(config.css.exportPath))
  });
  return merge(tasks);
}

function cssMin(cb) {
  const tasks = CONFIGS.map(config => {
      return gulp.src(config.css.sourcePaths)
          .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
          .pipe(autoprefixer())
          .pipe(gulp.dest(config.css.exportPath))
  });
  return merge(tasks);
}

function js(cb) {
  const tasks = CONFIGS.map(config => {
      return gulp.src(config.scripts.sourcePaths)
          .pipe(gulp.dest(config.scripts.exportPath))
  });
  return merge(tasks);
}

function jsMin(cb) {
  const tasks = CONFIGS.map(config => {
      return gulp.src(config.scripts.sourcePaths)
          .pipe(uglify())
          .pipe(gulp.dest(config.scripts.exportPath))
  });
  return merge(tasks);
}

function media(cb) {
  const tasks = CONFIGS.map(config => {
      return gulp.src(config.media.sourcePaths)
          .pipe(gulp.dest(config.media.exportPath))
  });
  return merge(tasks);
}

// function css(cb) {
//   return src(paths.css.src)
//         .pipe(sass().on('error', sass.logError))
//         .pipe(autoprefixer())
//         .pipe(dest(paths.css.dest))
// }

function cssMin(cb) {
  return src(paths.css.src)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(dest(paths.css.dest))
}

// function js(cb) {
//   return src(paths.scripts.src) // src() can also be placed in the middle of a pipeline to add files to the stream based on the given globs.
//     .pipe(dest(paths.scripts.dest)); // dest() is given an output directory string

// }

// function jsMin(){
//   return src(paths.scripts.src) // src() can also be placed in the middle of a pipeline to add files to the stream based on the given globs.
//     // .pipe(minify({
//     //     ext:{
//     //         src:'-debug.js',
//     //         min:'.js'
//     //     },
//     //     exclude: ['tasks'],
//     //     ignoreFiles: ['.min.js','.combo.js', '-min.js']
//     // }))
//     .pipe(uglify())
//     .pipe(dest(paths.scripts.dest)); // dest() is given an output directory string
// }

// function media(cb) {
//   return src(paths.media.src) // src() can also be placed in the middle of a pipeline to add files to the stream based on the given globs.
//     .pipe(dest(paths.media.dest)); // dest() is given an output directory string
// }

function assets(cb) {
  return src(paths.assets.src) // src() can also be placed in the middle of a pipeline to add files to the stream based on the given globs.
    // .pipe(concat('bundle.js'))    
    // .pipe(babel())
    // .pipe(minify())
    .pipe(dest(paths.assets.dest)); // dest() is given an output directory string
}

// 圖片一般格式壓縮

function compressImage() {
  return src(['dist/media/img/**/*.{jpg,png,svg}'])
      .pipe(imagemin())
      .pipe(dest('dist/img-opt/'));
}

function generateWebp() {
  return src(['dist/media/img/**/*.{jpg,png,svg}'])
    .pipe(webp())
    .pipe(dest('dist/img-opt/'));
}

function watchFiles() {  
  browserSync.init({
    server: {
      baseDir: "./dist",
      index: "/index.html"
    }
  }); 
  watch(paths.html.src, html).on('change', browserSync.reload);
  watch(paths.partial_html.src, html).on('change', browserSync.reload);
  watch(paths.css.src, css).on('change', browserSync.reload);
  watch(paths.scripts.src, js).on('change', browserSync.reload);
  watch(paths.media.src, media).on('change', browserSync.reload);
  watch(paths.assets.src, assets).on('change', browserSync.reload);
}


/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
const default_build = series(clean,parallel(html, css, js, media, assets), watchFiles);
const build = series(clean,parallel(html, css, js, media, assets));
// parallel(html, css, scripts, images), watchFiles

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.css = css;
exports.js = js;
exports.jsMin = jsMin;
exports.media = media;
exports.watch = watchFiles;
exports.output = series(parallel(media,cssMin,jsMin));
exports.build = build;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = default_build;

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({
      message: 'Update ' + new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'})
    }));
});