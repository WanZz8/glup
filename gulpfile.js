/**
 * Created by wildeChen on 2016/11/23.
 */
'use strict';

let gulp = require('gulp'),
    gulpIf = require('gulp-if'),
    sprite = require('sprity'),
    through = require('through2'),
    fs = require("fs"),
    crypto = require('crypto'),
    rjs = require('requirejs'),
    sequence = require('run-sequence'),
    less = require('gulp-less'),
    lessAutoprefix = require('less-plugin-autoprefix'),
    autoprefix = new lessAutoprefix({browsers: ['last 2 versions']}),
    sass = require('gulp-sass'),
    browserSync = require("browser-sync").create(),
    png = require('upng'),
    reload = browserSync.reload,
    imagemin = require('gulp-imagemin'),
    imagesinfo = require('imageinfo'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    exe = require('child_process'),
    babili = require('gulp-babili'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify');

const devPath = './publish/';


gulp.task('help', function () {
    console.log('输出帮助文件')
});

gulp.task('sprites', function () {
    return sprite.src({
        src: './images/icon/*.{png,jpg}',
        style: '../sass/icon.scss',
        template: 'sass/scss.hbs',
        margin: 1
    }).pipe(gulpIf('*.png', gulp.dest('./images/'), gulp.dest('./sass/')))
});


gulp.task('release', ['sass'], function () {
    bale(true);
});

gulp.task('fast', ['sass'], function () {
    bale();
});

function bale(complete) {
    deleteFolderRecursive('./publish');
    let obj, container = [], exclude = [];

    for (let n = 11; n <= 73; n++) {
        exclude.push('article-' + n);
    }

    function define() {
        for (let i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "function") {
                obj = arguments[i]();
                break;
            }
        }
    }

    const content = fs.readFileSync('./js/config.js', 'UTF-8');

    eval(content);

    let page = {};

    let keys = Object.keys(obj);
    let len = keys.length, index = len;
    for (let i = 0; i < len; i++) {
        let address = obj[keys[i]]['address'];
        let ex = exclude.some(function (e) {
            return e === keys[i]
        });
        if (ex) {
            continue;
        }
        if (obj[keys[i]]['js'])
            container.push(obj[keys[i]]['js']);

        (function (x) {
            page[x] = fs.readFileSync(x, 'UTF-8');
            page[x] = page[x].replace(/src\=("|')([^"']+)("|')/g, function () {
                let name = arguments[2];
                if (fs.existsSync(name)) {
                    let image = fs.readFileSync(name);
                    return 'src="' + name + '?v=' + md5(image.toString()) + '"';
                }
                return arguments[0];
            });
        })(address);
    }

    // container.push('../js/lang/zh-cn');

    fs.unlinkSync('./js/app.js');
    console.log('app.js deleted succeed');
    let model = 'define(function () {return ' + JSON.stringify(page) + ';})';
    fs.writeFileSync('./js/app.js', model);

    rjs.optimize({
        baseUrl: './js',

        removeCombined: true,

        mainConfigFile: './js/main.js',

        findNestedDependencies: true,

        out: devPath + 'main.js',

        name: 'main',

        include: container,

        exclude: ['deploy','app']
    }, function () {
        rjs.optimize({
            cssIn: 'css/combo.css',
            optimizeCss: 'standard',
            out: `${devPath}css/combo.css`
        }, function () {
            publish(complete);
        });

        gulp.src('./publish/main.js')
            // .pipe(babel())
            .pipe(babili())
            .pipe(gulp.dest(devPath));
    });
    if (complete) {
        gulp.src(['college.json', 'config.js', 'server.js', 'js/lib/require.js'])
            .pipe(gulp.dest(devPath));
    } else {
        gulp.src(['college.json'])
            .pipe(gulp.dest(devPath));
    }

    gulp.src(['./js/app.js']).pipe(gulp.dest(devPath));
    gulp.src(['./js/lang/*.*'], {
            base: './'   //如果设置为 base: 'js' 将只会复制 js目录下文件, 其他文件会忽略
        }
    ).pipe(gulp.dest(devPath));
}

function publish(note) {
    if (note) {
        sequence('upng', 'image', function () {
            var css = fs.readFileSync(devPath + 'css/combo.css', 'UTF-8');
            css = css.replace(/url\(('|")\.\.\/([^\(\)]+)('|")\)/g, function () {
                var name = arguments[2];
                name = name.replace('../', '');
                if (fs.existsSync(name)) {
                    var image = fs.readFileSync(name);
                    return 'url("../' + name + '?v=' + md5(image.toString()) + '")';
                }
                return name;
            });
            fs.unlinkSync(devPath + 'css/combo.css');
            fs.writeFileSync(devPath + 'css/combo.css', css);

            var index = fs.readFileSync('index.html', 'UTF-8');

            index = index.replace(/data-main="(.*?)"/g, function () {
                var data = fs.readFileSync(devPath + 'main.js');
                return 'data-main="main.js?v=' + md5(data) + '"';
            });

            index = index.replace(/href="(.*?)"/g, function (a) {
                var url = arguments[1], data;
                if (url.indexOf('?v=') != -1) {
                    url = url.split('?v=');
                    data = fs.readFileSync(devPath + url[0]);
                    if (md5(data) === url[1])
                        return arguments[0];
                    else
                        return 'href="' + url[0] + '?v=' + md5(data) + '"';
                } else {
                    data = fs.readFileSync(devPath + url);
                    return 'href="' + url + '?v=' + md5(data) + '"';
                }
            });
            index = index.replace("js/lib/require.js", 'require.js');
            fs.writeFileSync(devPath + 'index.html', index);

            // exe.execSync('update.bat ' + process.argv[3] || 'update');
        });
    } else {
        var css = fs.readFileSync(devPath + 'css/combo.css', 'UTF-8');
        css = css.replace(/url\(('|")\.\.\/([^\(\)]+)('|")\)/g, function () {
            var name = arguments[2];
            name = name.replace('../', '');
            if (fs.existsSync(name)) {
                var image = fs.readFileSync(name);
                return 'url("../' + name + '?v=' + md5(image.toString()) + '")';
            }
            return name;
        });
        fs.unlinkSync(devPath + 'css/combo.css');
        fs.writeFileSync(devPath + 'css/combo.css', css);
        var index = fs.readFileSync('index.html', 'UTF-8');

        index = index.replace(/data-main="(.*?)"/g, function () {
            var data = fs.readFileSync(devPath + 'main.js');
            return 'data-main="main.js?v=' + md5(data) + '"';
        });

        index = index.replace(/href="(.*?)"/g, function (a) {
            var url = arguments[1], data;
            if (url.indexOf('css') !== -1) {
                if (url.indexOf('?v=') !== -1) {
                    url = url.split('?v=');
                    data = fs.readFileSync(devPath + url[0]);
                    if (md5(data) === url[1])
                        return arguments[0];
                    else
                        return 'href="' + url[0] + '?v=' + md5(data) + '"';
                } else {
                    data = fs.readFileSync(devPath + url);
                    return 'href="' + url + '?v=' + md5(data) + '"';
                }
            } else {
                return 'href="' + url + '"';
            }
        });
        index = index.replace("js/lib/require.js", 'require.js');
        fs.writeFileSync(devPath + 'index.html', index);
    }

}

gulp.task('promo', function () {
    var obj;

    function define() {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == "function") {
                obj = arguments[i]();
                break;
            }
        }
    }

    var content = fs.readFileSync('./config.js', 'UTF-8');

    eval(content);

    var page = {};

    Object.keys(obj.activity).forEach(function (key) {
        var url = obj.activity[key]['html'];
        if (url)
            page[key] = fs.readFileSync(url, 'UTF-8');
    });

    content = loopObjectMd5(obj.activity, content, 'img');
    content = loopObjectMd5(obj.activity, content, 'title');
    content = loopObjectMd5(obj.platform, content, 'url');
    content = loopMd5(obj.banner, content, 'img');
    content = imgMd5(obj.weChatImg, content);

    fs.writeFileSync('./config.js', content);

    //todo 生成活动的html文件
    fs.unlinkSync('./activity.js');
    console.log('activity.js deleted succeed');
    var model = 'define(function () {return ' + JSON.stringify(page) + ';})';
    fs.writeFileSync('./activity.js', model);
});

gulp.task('image', function () {
    return gulp.src(['images/**/*.*', '!images/**/*.png', '!images/icon/*.*'])
        .pipe(imagemin({
            optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(devPath + 'images/'));
});

gulp.task('upng', function () {
    return gulp.src(['images/**/*.png', '!images/icon/*.*'])
        .pipe(through.obj(function (chunk, enc, cb) {
            var info = imagesinfo(chunk.contents);
            if (info.format != 'PNG')
                return cb(null, chunk);
            var img = toArrayBuffer(chunk.contents);
            img = png.decode(img);
            var rgba = png.toRGBA8(img).buffer;
            var images = png.encode(rgba, img.width, img.height, 2048);
            chunk.contents = new Buffer(images);
            var name = chunk.relative;
            console.log('%s save succeed', name);
            cb(null, chunk);
        })).pipe(gulp.dest(devPath + 'images/'));
});

function loopObjectMd5(list, content, key) {
    Object.keys(list).forEach(function (value) {
        var url = list[value][key];
        if (!url)
            return;
        if (url.indexOf('?v=') != -1) {
            url = url.split('?v=');
            var data = fs.readFileSync(url[0]);
            if (md5(data.toString()) !== url[1])
                content = content.replace(new RegExp(url[1], 'gm'), md5(data.toString()));
        } else if (content.substr(content.indexOf(url) + url.length, 1) != '?') {
            data = fs.readFileSync(url);
            content = content.replace(new RegExp(url, 'gm'), url + '?v=' + md5(data.toString()));
        }
    });
    return content;
}

function loopMd5(list, content, key) {
    for (var i = 0, len = list.length; i < len; i++) {
        var url = list[i][key];
        if (url.indexOf('?v=') != -1) {
            url = url.split('?v=');
            var data = fs.readFileSync(url[0]);
            if (md5(data.toString()) !== url[1])
                content = content.replace(new RegExp(url[1], 'gm'), md5(data.toString()));
        } else if (content.substr(content.indexOf(url) + url.length, 1) != '?') {
            data = fs.readFileSync(url);
            content = content.replace(new RegExp(url, 'gm'), url + '?v=' + md5(data.toString()));
        }
    }
    return content;
}

function imgMd5(url, content) {
    if (url.indexOf('?v=') != -1) {
        url = url.split('?v=');
        var data = fs.readFileSync(url[0]);
        if (md5(data.toString()) !== url[1])
            content = content.replace(new RegExp(url[1], 'gm'), md5(data.toString()));
    } else if (content.substr(content.indexOf(url) + url.length, 1) != '?') {
        data = fs.readFileSync(url);
        content = content.replace(new RegExp(url, 'gm'), url + '?v=' + md5(data.toString()));
    }
    return content;
}

function md5(buf) {
    return crypto.createHash('md5').update(buf).digest('hex').slice(0, 10);
}

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

function deleteFolderRecursive(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

gulp.task('less', function () {
    return gulp.src('css/combo.less')
        .pipe(plumber({errorHandler: notify.onError('Error:<%=error.message%>')}))
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(gulp.dest('css/'));
});

gulp.task('sass', function () {
    return gulp.src('css/combo.scss')
    // .pipe(plumber({errorHandler: notify.onError('Error:<%=error.message%>')}))
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('css/'));
});

gulp.task('server', function () {
    return browserSync.init({
//         server: './',
//      	port: 81,
        proxy: "localhost:83"
    });
});

gulp.task('default', ['server','sass'], function () {
    gulp.watch(['js/**/*.js', 'activity.js', 'config.js', 'server.js'], function () {
        reload();
    });

    // gulp.watch(['./config.js', 'js/model/promotion/*.html'], function () {
    //     sequence('promo', function () {
    //         reload();
    //     })
    // });

    gulp.watch('js/model/**/*.html', function () {
        reload();
    });

    gulp.watch('images/**/*.*', function () {
        reload();
    });

    gulp.watch('images/icon/*.*', function () {
        sequence('sprites', 'sass', function () {
            reload();
        })
    });

    gulp.watch(['sass/**/*.*', 'css/**/*.scss'], function () {
        sequence('sass', function () {
            reload();
        });
    });
});
