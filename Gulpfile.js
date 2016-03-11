var gulp = require('gulp');
var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');

var config = {
	entryFile: './src/Highway.es6',
	outputDir: './dist/',
	outputFile: 'Highway.js'
};

// clean the output directory
gulp.task('clean', function(cb){
	rimraf(config.outputDir, cb);
});

var bundler;
function getBundler(c) {
	bundler = watchify(browserify(c.entryFile, _.extend({ debug: true }, watchify.args)));
	return bundler;
};

function bundle(c) {
	return getBundler(c)
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
