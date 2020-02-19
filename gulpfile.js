const gulp = require("gulp");
const del = require("del");
const less = require("gulp-less");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const fileInclude = require("gulp-file-include");
const browserSync = require("browser-sync");
const cssmin = require('gulp-cssmin');
const connect = require('gulp-connect');
const proxy = require('http-proxy-middleware');
gulp.task("del", () => {
  return del(["./dist"]);
});
gulp.task("css", () => {
  return (gulp.src("./src/css/_*.less").pipe(sourcemaps.init()).pipe(less()).pipe(autoprefixer({
    browsers: ["last 2 versions"]
  })).pipe(sourcemaps.write(".")).pipe(gulp.dest("./dist/css/"))).pipe(connect.reload());
});
// pipe(cssmin())
gulp.task("js", () => {
  return gulp.src("./src/js/*.js").pipe(sourcemaps.init()).pipe(babel({
    presets: ["@babel/env"]
  })).pipe(sourcemaps.write(".")).pipe(gulp.dest("./dist/js/")).pipe(connect.reload());
});
gulp.task("html", () => {
  return gulp.src("src/*.html").pipe(fileInclude({
    prefix: "@@",
    basepath: "src/components/",
  })).pipe(gulp.dest("dist/")).pipe(connect.reload());
});
gulp.task("lib", () => {
  return gulp.src("./src/lib/**").pipe(gulp.dest("./dist/lib/"));
});
gulp.task("images", () => {
  return gulp.src("./src/images/**").pipe(gulp.dest("./dist/images/")).pipe(connect.reload());
});
gulp.task("fonts", () => {
  return gulp.src("./src/fonts/**").pipe(gulp.dest("./dist/fonts/")).pipe(connect.reload());
});
gulp.task("ui", () => {
  return gulp.src("./src/ui/**").pipe(gulp.dest("./dist/ui/")).pipe(connect.reload());
});
gulp.task("autopage", () => {
  // browserSync({
  //   server: {
  //     baseDir: "./dist/",
  //     index: 'entranceMatters.html'
  //   },
  //   port: 9999,
  //   notify: false,
  // });
  connect.server({
    root: "./dist/",
    livereload: true,
    port: 9990,
    fallback: './dist/billDetail.html',
    middleware: function(connect, opt) {
      return [
        proxy('/ui/plugins', {
          target: 'http://localhost:9990/ui/WebRoot/plugins',
          changeOrigin: true,
          pathRewrite: {
            '^/ui/plugins': ''
          },
        }),
      ]
    }
  });
  // gulp.watch(["src/*.html", "src/components/*.html"], gulp.series(["html", "reload"]));
  // gulp.watch(["src/css/*.less"], gulp.series(["css", "reload"]));
  // gulp.watch(["src/js/*.js"], gulp.series(["js", "reload"]));
  gulp.watch(["src/*.html", "src/components/*.html"], gulp.series(["html"]));
  gulp.watch(["src/css/*.less"], gulp.series(["css"]));
  gulp.watch(["src/js/*.js"], gulp.series(["js"]));
});
// gulp.task("reload", (done) => {
//   browserSync.reload();
//   done();
// });
gulp.task("default", gulp.series(["del", "css", "js", "html", "lib", "fonts", "ui","images", "autopage"]));