//var babel = require("gulp-babel");
var gulp = require('gulp');
var concat = require("gulp-concat");
var clean = require('gulp-clean');
var debug = require('gulp-debug');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');



gulp.task("emojibar.min.js", () => {
  return gulp.src([
      "sources/emojibar.js"
    ])
    .pipe(concat("emojibar.min.js"))
    .pipe(uglify())
    // .pipe(babel({
    //   presets: ["es2015"],
    //   compact: true
    // }))
    .pipe(gulp.dest("distrib"))
});

gulp.task('watch:emojibar.min.js', function() {
  watch("./sources/emojibar.js", function() {
    gulp.run('emojibar.min.js');
  });
});

gulp.task('default', ['emojibar.min.js']);


gulp.task('all', ['default']);

gulp.task("watch", ["watch:emojibar.min.js"]);