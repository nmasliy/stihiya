const { src, dest, watch, parallel, series } = require('gulp');
const del = require('del');
const scss  = require('gulp-sass')(require('sass'));
const gcmq = require('gulp-group-css-media-queries');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const webpack = require('webpack-stream');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const webp = require('gulp-webp');
const gulpif = require('gulp-if');

const isMinify = process.argv.includes('--minify');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "dist/"
        },
        notify: false,
    });
}

function reloadPage() {
    browserSync.reload({stream: true});
}

function html() {
    return src('app/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('dist/'))
        .pipe(browserSync.stream())
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({outputStyle: isMinify ? 'compressed' : 'expanded'}).on('error', scss.logError))
        .pipe(gcmq())
        .pipe(autoprefixer({
			cascade: false
		}))
        .pipe(concat('style.css'))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream())
}

function stylesLibs() {
    return src('app/scss/libs.scss')
        .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
        .pipe(concat('libs.min.css'))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream())
}

function scriptsLibs() {
    return src('app/js/libs/*.js')
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: 'libs.min.js'
            }
        }))
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src('app/js/main.js')
        .pipe(webpack({
			mode: isMinify ? 'production' : 'development',
			output: {
				filename: 'main.js'
			}
		}))
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream())
}

function images() {
    return src('app/img/**/*')
        .pipe(newer('dist/img'))
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 85, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest('dist/img'))
        .pipe(src('app/img/**/*'))
        .pipe(webp())
        .pipe(dest('dist/img'))
        .pipe(browserSync.stream())
}

function fonts() {
    return src('app/fonts/*.ttf')
        .pipe(dest('dist/fonts'))
        .pipe(ttf2woff())
        .pipe(dest('dist/fonts'))
        .pipe(src('app/fonts/*.ttf'))
        .pipe(ttf2woff2())
        .pipe(dest('dist/fonts'))
        .pipe(browserSync.stream())
}

function watcher() {
    watch(['app/scss/**/*.scss', '!app/scss/libs.scss'], styles);
    watch(['app/scss/libs.scss'], stylesLibs);
    watch(['app/js/components/*.js','app/js/main.js'], scripts);
    watch(['app/js/libs/*.js'], scriptsLibs);
    // watch(['app/img/**/*'], images);
    watch(['app/*.html', 'app/html/*.html'], html);
}

function clean(cb) {
    del.sync('dist');
    cb();
}

exports.styles = styles;
exports.scripts = scripts;
exports.scriptsLibs = scriptsLibs;
exports.stylesLibs = stylesLibs;
exports.html = html;
exports.images = images;
exports.fonts = fonts;
exports.watcher = watcher;
exports.browsersync = browsersync;
exports.clean = clean;

const helpers = parallel(watcher, browsersync);
const mainTasks = [html, styles, stylesLibs, scriptsLibs, scripts, images];
const build = series(mainTasks, images);

exports.default = series(parallel(parallel(mainTasks), helpers), reloadPage);
exports.build = build;