"use strict"

var 
  del         = require("del"),
  sequence    = require("run-sequence"),
  gulp        = require("gulp"),
  browserify  = require("browserify"),
  babelify    = require("babelify"),
  source      = require("vinyl-source-stream"),
  connect     = require("gulp-connect")

let buildDir = "build"

gulp.task("clean:dist", function() {
  return del(["#{buildDir}/*", "!#{buildDir}", "!#{buildDir}/.git,{/**}"])
})

gulp.task("build:css", function() {
  return gulp.src([
    "./node_modules/angular-material/angular-material.min.css",
    "./node_modules/angular-material/angular-material.layouts.min.css"
  ]).pipe(gulp.dest(`${buildDir}/css`))
})

gulp.task("build:html", function() {
  return gulp.src(["./src/**/*.html"])
    .pipe(gulp.dest(buildDir))
})

gulp.task("build:script", function() {
  return browserify("./src/app.js")
    .transform("babelify", { presets: ["es2015"]})
    .bundle()
    .pipe(source("dist.js"))
    .pipe(gulp.dest(buildDir))
})

gulp.task("serve", function() {
  connect.server({
    root: buildDir,
    port: process.env.PORT || 3000,
    livereload: false
  })
})

gulp.task("servedev", function() {
  connect.server({
    root: buildDir,
    port: process.env.PORT || 3000,
    livereload: true
  })
})

gulp.task("build:prod", function(fn) {
  sequence("clean:dist", "build:html", "build:css", "build:script", "serve", fn)
})

gulp.task("default", function(fn) {
  sequence("clean:dist", "build:html", "build:css", "build:script", "watch", fn)
})

gulp.task('watch', function() {
  var watcher = gulp.watch("src/**/*.html", ['build:html'])

  watcher.on('change', function() {
    connect.reload()
  })
})