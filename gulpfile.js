var gulp = require('gulp'), nodemon = require('gulp-nodemon');

gulp.task('default', function () {
  nodemon({
    script: 'main.js',
    ext: 'js mustache css html',
    env: { 'NODE_ENV': 'development' }
  })
});