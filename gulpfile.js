var gulp = require('gulp');
const Path = require('path');
const server = require('./tasks/server');
const path = require('./tasks/options').path;

function setProductionEnv(done) {
	process.env.NODE_ENV = 'production';
	done();
}

function clean(done) {
	var rimraf = require('rimraf');
	rimraf.sync('build');
	done();
}

gulp.task('html', require('./tasks/html'));

gulp.task('css', require('./tasks/css'));

gulp.task('js', require('./tasks/javascript'));

gulp.task('lang', require('./tasks/importGoogle'));

gulp.task(
	'static',
	gulp.parallel(
		() => gulp.src(path.static, { base: 'source' }).pipe(gulp.dest('build')),
		() => gulp.src('source/static/**').pipe(gulp.dest('build'))
	)
);

gulp.task('watch', function() {
	gulp.watch(path.css, gulp.series('css'));
	gulp.watch(['source/assets/js/**/*.js', '!source/assets/js/libs/*'], gulp.series('js'));
	gulp.watch(path.static, gulp.series('static'));
	gulp.watch(['source/**/*.pug'], gulp.series('html'));
	gulp.watch(
		'data/*',
		gulp.series(done => {
			Object.keys(require.cache).forEach(key => {
				if (Path.relative('data', key).charAt(0) !== '.') {
					delete require.cache[key];
				}
			});
			done();
		}, 'html')
	);
});

gulp.task('compile', gulp.series(clean, gulp.parallel('lang', 'js', 'css', 'static'), 'html'));
gulp.task('build', gulp.series(setProductionEnv, 'compile', 'html'));
gulp.task('live', gulp.series('compile', server, 'watch'));
