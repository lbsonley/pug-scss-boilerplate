var gulp = require('gulp');
const requireDirectory = require('require-all');

module.exports = function pug() {
	var pugI18n = require('gulp-i18n-pug');
	var options = {
		i18n: {
			dest: 'build',
			locales: 'locales/*.*',
			namespace: '$t',
			verbose: true
		},
		client: false,
		pretty: true,
		basedir: './source',
		data: {
			data: requireDirectory({
				dirname: __dirname + '/../data',
				recursive: true
			})
		}
	};
	return gulp
		.src('source/pages/**/*.pug')
		.pipe(pugI18n(options))
		.pipe(gulp.dest(options.i18n.dest));
};
