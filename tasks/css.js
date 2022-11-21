var gulp = require('gulp');
const path = require('./options').path;
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
const touch = require('./touch');

module.exports = function(done) {
	var bulkSass = require('gulp-sass-bulk-import');
	var sass = require('gulp-sass')(require('sass'));
	var postcss = require('gulp-postcss');
	var autoprefixer = require('autoprefixer');
	var cleanCSS = require('gulp-clean-css');

	var stream = gulp
		.src(path.sass, { base: 'source' })
		.pipe(bulkSass())
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				includePaths: ['source/assets/css/', 'source/components/']
			}).on('error', sass.logError)
		)
		.pipe(postcss([autoprefixer()]))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build'))
		.pipe(
			cleanCSS({
				format: 'keep-breaks'
			})
		)
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('build'))
		.pipe(touch());

	return stream;
};
