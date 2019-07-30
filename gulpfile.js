const gulp= require("gulp");

gulp.task("html", (done) => {
    gulp.src("./src/index.html")
        .pipe(gulp.dest("./dist"))
        .pipe(browserSync.stream());
done();
});

const concat = require("gulp-concat");
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const  del = require('del');
sass.compiler = require('node-sass');
gulp.task('scss', (done) =>{
    gulp.src("./src/scss/**/*.scss")
        .pipe(sass().on('error',sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 4 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
    done();
})
gulp.task("clear" ,() =>{
return del("dist");
})
gulp.task("js",  (done) =>{
    gulp.src("./src/js/**/*js")
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat("index.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./dist/js"))
        .pipe(browserSync.stream());
        done();
})
gulp.task('img', (done) =>{
    gulp.src('./src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'));
    done();
}
);

gulp.task("browser-init", (done) => {
    browserSync.init({
        server: "./dist"
    });
    done();
});
gulp.task("build", gulp.series(
    "clear",
    gulp.parallel("html","scss","js","img")
)
);
gulp.task('watch', (done) =>{
    gulp.watch('./src/*.html',gulp.series("html"));
    gulp.watch("./src/scss/**/*.scss", gulp.series("scss"));
    gulp.watch("./src/js/**/*.js", gulp.series("js"));
    done();
});

gulp.task("default", gulp.series(
    "html","scss","js","browser-init","watch")
);