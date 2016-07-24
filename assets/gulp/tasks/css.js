var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('css', function(callback) {
	gulp.src('./scss/**/*.scss')
		.pipe(sass({
			'outputStyle': 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'android 2.3'], // サポートブラウザ(https://github.com/postcss/autoprefixer#options)
			cascade: false
		}))
		.pipe(gulp.dest('../public/css/'))
		.on('end', function() {
			callback();
		});
});