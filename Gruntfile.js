module.exports = function(grunt) {
'use strict';

  var others, //定义其他样式
      dir     = 'project', //定义根目录
      fs      = require('fs'), //加载文件系统模块
      exclude = /^(.svn|plugins|public|node_modules|static|.git|documents|gxws-icbc|LezCashier|LezMessage|manage-let-join|manage-meteorology|php|p-lezpay|p-papa-go|p-users|test1|uidemo|web-cellphone-charge|web-gd-myaccount|web-meteorology|web-papa-go|web-qiaqia|web-qimeng|web-tvbh|web-users|web-vod-gear|www|web-greenery)$/i, //排除目录
      pros    = [],
      watch   = { //监控Gruntfile.js,项目目录下config.js文件,如有改动则重载Gruntfile.js配置文件
        configFiles: {
          files: [
            'Gruntfile.js',
            //dir + '/*/config.js'
          ],
          options: {
            reload: true
          }
        }
      },
      sass = {},
      clean   = {}, //删除文件列表
      cssmin  = {},
      uglify  = {},
      concat  = {},
      version = {},
      jade    = {};
  fs.readdirSync(dir).forEach(function(name) { //遍历,将返回根目录下的项目目录名创建成数组
    !exclude.test(name) && fs.statSync(dir + '/' + name).isDirectory() && pros.push(name);
  });
  pros.forEach(function(name) {
    var pro     = dir + '/' + name,
        jsConfig  = pro + '/static/js.js',
        cssConfig  = pro + '/static/css.js';
    watch[name + 'Sass'] = {//监控项目中sass文件
      files: [
        pro + '/src/sass/*.sass',
        pro + '/src/sass/*.scss'
      ],
      tasks: [ //触发任务
        'sass:' + name,
        'completed'
      ]
    };
    watch[name + 'Css'] = {//监控项目中css文件
      files: [
          pro + '/static/css/*.css',
          '!' + pro + '/*/*/*.min.css',
          '!' + pro + '/*/*/*.mod.css'
        ],
        tasks: [ //触发任务
          //'sass:' + name,
          'clean:' + name + 'css',
          'cssmin:' + name,
          'concat:' + name + 'css',
          // 'version:' + name,
          'completed'
        ]
    };
    watch[name + 'Js'] = {//监控项目中js文件
      files: [
          pro + '/static/js/*.js',
          '!' + pro + '/*/*/*.min.js',
          '!' + pro + '/*/*/*.mod.js'
        ],
        tasks: [ //触发任务
          'clean:' + name + 'js',
          'uglify:' + name,
          'concat:' + name + 'js',
          // 'version:' + name,
          'completed'
        ]
    };
    watch[name + 'Jade'] = {//监控项目中jade文件
      files: [
          pro + '/src/jade/*/*.jade'
        ],
        tasks: [ //触发任务
          'jade:' + name,
          'completed'
        ]
    };
    watch['livereload'] = {//监控html,css,js,img自动刷新页面
      options: {
        livereload: '<%=connect.options.livereload%>'
      },
      files: [
        dir + '/*.html',
        dir + '/*/*.html',
        dir + '/*/*/*.html',
        dir + '/*/*/css/*.css',
        dir + '/*/*/js/*.js',
        dir + '/*/*/images/*.{png,jpg}',
        '!' + dir + '/*/*/css/*.min.css',
        '!' + dir + '/*/*/css/*.min.js'
      ]
    };
    sass[name] = {
      options: {
        style: 'expanded'
      },
      files: [{
        expand: true,
        cwd: pro + '/src/sass/',
        src: ['*.scss','!_*.scss'],
        dest: pro + '/static/css',
        ext: '.css'
      }]
    };
    clean[name + 'css'] = [ //清除文件
      pro + '/static/css/*.min.css',
      pro + '/static/css/*.mod.css'
    ];
    clean[name + 'js'] = [ //清除文件
      pro + '/static/js/*.min.js',
      pro + '/static/js/*.mod.js'
    ];
    cssmin[name] = { //压缩CSS
      expand: true,
      src: [
        pro + '/static/css/*.css',
        '!' + pro + '/*/*/*.min.css'
      ],
      ext: '.min.css'
    };
    uglify[name] = { //压缩JS
      expand: true,
      src: [
        pro + '/static/js/*.js',
        '!' + pro + '/*/*/*.min.js',
        '!' + pro + '/*/*/*.mod.js'
      ],
      ext: '.min.js'
    }
    concat[name + 'css'] = (new Function(fs.readFileSync(cssConfig, {encoding: 'utf8'}).replace(/\{static\}/ig, dir)))();//定义合并CSS文件
    concat[name + 'js'] = (new Function(fs.readFileSync(jsConfig, {encoding: 'utf8'}).replace(/\{static\}/ig, dir)))(); //定义合并JS文件
    // version[name] = pro + '/version.txt'; //生成的任务版本文件路径
    jade[name] = {
      options:{
        pretty: true
      },
      files: [{
        expand: true,
        cwd: pro,
        src: [ 'src/jade/*/*.jade','!src/jade/*/_*.jade'],
        dest: pro + '/html',
        ext: '.html',
        flatten: true
      }]
    };
  });
  others = { //公共样式
    name: 'others',
    css: [
      dir + '/public/css/_public.css',
      dir + '/public/css/public.css',
      '!' + dir + '/public/css/_public.min.css',
      '!' + dir + '/public/css/public.min.css'
      // dir + '/plugins/ace/assets/css/datepicker.css',
      // dir + '/plugins/ace/assets/css/daterangepicker.css',
      // dir + '/plugins/ace/assets/css/bootstrap-timepicker.css'
    ],
    js: [
      dir + '/public/js/browserTools.js',
      '!' + dir + '/public/js/browserTools.min.js'
    ]
  };
  watch[others.name] = {
    files: [].concat(others.css, others.js),
    tasks: [
      'cssmin:others',
      'uglify:others',
      'completed'
    ]
  };
  cssmin[others.name] = {
    expand: true,
    src: others.css,
    ext: '.min.css'
  };

  uglify[others.name] = {
    expand: true,
    src: others.js,
    ext: '.min.js',
  };

  grunt.initConfig({ //初始化数据
    watch: watch,
    clean: clean,
    cssmin: cssmin,
    uglify: uglify,
    concat: concat,
    // version: version,
    sass: sass,
    jade: jade,
    // 'http-server': {//web静态服务器
    //   'dev': {
    //     root: dir,
    //     port: 8282,
    //     host: "127.0.0.1",
    //     // cache: <sec>,
    //     showDir : true,
    //     autoIndex: true,
    //     ext: "html",
    //     // runInBackground: true|false,
    //     // logFn: function(req, res, error) { }
    //   }
    // },
    connect: {//监听文件自动刷新浏览器,web静态服务器
        options: {
          hostname: 'localhost',
          port: 8000,
          livereload: 35729,
          open: true
        },
        server: {
          options: {
            base:dir
          }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch'); //加载监控插件
  grunt.loadNpmTasks('grunt-contrib-cssmin'); //加载压缩CSS插件
  grunt.loadNpmTasks('grunt-contrib-uglify'); //加载压缩JS插件
  //grunt.loadNpmTasks('grunt-contrib-imagemin');//加载压缩图片插件
  grunt.loadNpmTasks('grunt-contrib-clean'); //加载删除文件插件
  grunt.loadNpmTasks('grunt-contrib-concat'); //加载合并文件插件
  grunt.loadNpmTasks('grunt-contrib-sass');//加载sass编译插件
  grunt.loadNpmTasks('grunt-contrib-jade');//加载jade编译插件
  //grunt.loadNpmTasks('grunt-http-server');//加载http静态服务
  grunt.loadNpmTasks('grunt-contrib-connect');//加载多任务连接
  grunt.registerTask('others', function() { //执行公共文件任务
    grunt.task.run([
      'cssmin:others',
      'uglify:others',
      'completed'
    ]);
  });

  // grunt.registerMultiTask('version', function() { //生成版本号version
  //   var ver,
  //     version = this.data;
  //   grunt.file.write(version, (ver = (grunt.file.exists(version) ? +grunt.file.read(version) : 1) + 1)) && grunt.log.ok(this.target + ' version: ' + ver);
  // });
  //
  grunt.registerTask('completed', function() { //完成信息
    grunt.log.ok('OK!');
  });
  grunt.registerTask('server',['connect:server','watch']);//web静态服务,watch任务
  grunt.registerTask('default', ['completed']);

};