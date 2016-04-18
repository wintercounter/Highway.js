var gulp = require('gulp');
var fs = require('fs');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var _ = require('lodash');

var config = {
	entryFile: './src/Highway.es6',
	outputDir: './dist/',
	outputFile: 'Highway.js'
};

function bundle(c) {
	return browserify(c.entryFile, { debug: true, node: true, standalone: 'Highway' })
		.transform(babelify, {
			presets: ["es2015"],
			plugins: [
				"transform-class-properties",
				"syntax-decorators",
				"transform-decorators-legacy",
				"syntax-async-functions",
				"transform-regenerator",
				"transform-function-bind"
			]
		})
		.bundle()
		.on('error', function(err) { console.log('Error: ' + err.message); })
		.pipe(source(c.outputFile))
		.pipe(gulp.dest(c.outputDir));
}

gulp.task('build-persistent', function() {
	return bundle(config);
});

gulp.task('build', ['build-persistent'], function() {
	process.exit(0);
});
