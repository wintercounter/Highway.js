'use strict'

const gulp    = require('gulp')
const babel   = require('gulp-babel')
const webpack = require('webpack-stream')
const named   = require('vinyl-named')

function BabelTask(src, dist){
	return gulp.src(src)
		.pipe(babel({
			presets: ['es2015'],
			plugins: [
				'transform-class-properties',
				'transform-object-assign',
				'syntax-decorators',
				'transform-decorators-legacy',
				'syntax-async-functions',
				'transform-regenerator',
				'transform-function-bind'
			]
		}))
		.pipe(gulp.dest(dist))
}

gulp.task('build', () => {
	return BabelTask('./src/**/*.js', './dist')
})

gulp.task('build-test-babel', ['build'], () => {
	return BabelTask('./test/*.js', './test/dist/')
})

gulp.task('build-test', ['build-test-babel'], () => {
	return gulp.src('./test/dist/*.js')
		.pipe(named())
		.pipe(webpack())
		.pipe(gulp.dest('./test/dist/'))
})