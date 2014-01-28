/**
 * browserify-integrated of ng-boilerplate
 * credits @joshdmiller of https://github.com/ngbp/ngbp
 */

// Modules
var _ = require('underscore');
var path = require('path');
var browserify = require('browserify');

// Cached browserify transforms
var cachedTransforms = require('./grunt/config/browserify/cached-transforms');
var reactify = cachedTransforms.reactify;
var es6ify = cachedTransforms.es6ify;
var deamdify = cachedTransforms.deamdify;
var deglobalify = cachedTransforms.deglobalify;

// Import grunt tasks/config
var scaffolder = require('./grunt/config/scaffolder/main');

// Grunt
module.exports = function (grunt) {

  // Utilities

  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterJS(files) {
    return files.filter(function (file) {
      return file.match(/\.js$/);
    });
  }

  /**
   * A utility function to get all app Coffeescript sources.
   */
  function filterCoffeescript(files) {
    return files.filter(function (file) {
      return file.match(/\.coffee$/);
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterCSS(files) {
    return files.filter(function (file) {
      return file.match(/\.css$/);
    });
  }

  /**
   * A utility function to get all app LESS sources.
   */
  function filterLESS(files) {
    return files.filter(function (file) {
      return file.match(/\.less$/);
    });
  }

  /**
   * A utility function to generate module shim for browserify
   */
  function generateBrowserifyShim() {
    var targetFiles = _.union(grunt.file.expand(['src/**/*.coffee']), grunt.file.expand(['src/**/*.js']));
    var shim = {};
    targetFiles.forEach(function(f) {
      var basename = (basename = path.basename(f, '.js')).length < path.basename(f).length ? basename : path.basename(f, '.coffee');
      var key      = (key = path.dirname(f).replace('src/app/', '').replace('src/common/', '').replace(/\//g, '.')) === basename ? basename : key;
      shim[f] = key;
    });
    return shim;
  }

  // grunt.registerTask('gs','gs', function() {
  //   console.log(generateBrowserifyShim())
  // })

  /**
   * Automatically load required Grunt tasks. These are installed
   * based on the versions listed in `package.json` when you do
   * `npm install` in this directory.
   */

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  /**
   * Load build configuration file
   */

  var build_config = require('./build.config.js');

  /**
   * Grunt config main
   */
  var grunt_config = {

    /**
     * Reads application's package.json to grab
     * app info i.e. app name, version etc.
     */

    pkg: grunt.file.readJSON('package.json'),

    /**
     * The banner is the comment that is placed
     * on top of the compiled source files
     */

    meta: {
      banner: {
        js: [
          '/**', ' * <%= pkg.name %> - v<%= pkg.version %>.js - <%= grunt.template.today("yyyy-mm-dd") %>', ' * <%= pkg.homepage %>', ' *', ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>', ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>', ' */'
        ].join('\n') + '\n'
      }
    },

    /** TODO
     * Create font file from images
     */

    grunticon: {

    },

    /**
     * `clean` deletes folders specified
     */

    clean: {
     compile: [ '<%= compile_dir %>' ],
     build  : [ '<%= build_dir %>' ],
     less   : [ '<%= app_files.less %>' + '.gen' ]
    },

    /**
     * `copy` just copies stuff from source to dest
     */

    copy: {
      compile_app_src: {
        files: [{
          src: ['app/**/*', 'common/**/*'],
          dest: '<%= compile_dir %>/',
          cwd: 'src',
          expand: true
        }]
      },
      compile_less: {
        files: [{
          src: ['less/**/*'],
          dest: '<%= compile_dir %>/',
          cwd: 'src',
          expand: true
        }]
      },
      compile_vendor_assets: {
        files: [{
          src: ['<%= vendor_files.assets %>'],
          dest: '<%= compile_dir %>/assets/',
          cwd: '.',
          expand: true,
          flatten: true
        }]
      },
      compile_app_assets: {
        files: [{
          src: ['**'],
          dest: '<%= compile_dir %>/assets/',
          cwd: 'src/assets',
          expand: true
        }]
      },
      build_assets: {
        files: [{
          src: ['**'],
          dest: '<%= build_dir %>/assets/',
          cwd: '<%= compile_dir %>/assets/',
          expand: true
        }]
      }

    },

    /**
     * `grunt concat` concatenates source files into a single file.
     */

    concat: {
      /**
       * The `compile_css` target concatenates compiled CSS and vendor CSS
       * together.
       */
      compile_css: {
        src: [
          '<%= vendor_files.css %>',
          '<%= compile_dir %>/<%= pkg.name %>-<%= pkg.version %>.css'
        ],
        dest: '<%= compile_dir %>/<%= pkg.name %>-<%= pkg.version %>.css'
      }

    },

    /**
     * Smart watch - custom tasks for different file types
     */

    watcher: {
      /**
       * Enable live reload
       */
      options: {
        livereload: true
      },

      /**
       * Only enable linting for Gruntfile
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
        options: {
          livereload: false
        }
      },

      /**
       * When any of the source files changes, do
       * linting and compilation
       */
      srcrc: {
        files: [
          '<%= app_files.js %>',
          '<%= app_files.coffee %>'
        ],
        tasks: ['jshint:src', 'coffeelint:src', 'browserify:compile']
      },

      /**
       * Copy assets
       */
      assets: {
        files: [
          'src/assets/**/*'
        ],
        tasks: ['copy:compile_vendor_assets', 'copy:compile_app_assets']
      },

      /**
       * When index.html changes, we need to compile it.
       */
      html: {
        files: ['<%= app_files.html %>'],
        tasks: ['index:compile']
      },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      less: {
        files: ['src/less/**/*.less', 'src/app/**/*.less'],
        tasks: ['lessimports', 'less:compile', 'concat:compile_css', 'clean:less']
      }

    },

    /** TODO
     * 'imagemin' Minify PNG, JPEG and GIF images
     */

    imagemin: { // Task
      static: { // Target
        options: { // Target options
          optimizationLevel: 3
        },
        files: { // Dictionary of files
          'dist/img.png': 'src/img.png', // 'destination': 'source'
          'dist/img.jpg': 'src/img.jpg',
          'dist/img.gif': 'src/img.gif'
        }
      },
      dynamic: { // Another target
        files: [{
          expand: true, // Enable dynamic expansion
          cwd: 'src/', // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
          dest: 'dist/' // Destination path prefix
        }]
      }
    },

    /**
     * `less` handles our LESS compilation automatically. main.less only
     */

    less: {
      compile: {
        options: {
          compress: false,
          strictImports: true,
          strictMath: true,
          strictUnits: true,
          dumpLineNumbers: 'all',
          sourceMap: false,
          report: 'min'
        },
        files: {
          '<%= compile_dir %>/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>' + '.gen'
        }
      },
      build: {
        options: {
          compress: true,
          strictImports: true,
          strictMath: true,
          strictUnits: true,
          cleancss: true
        },
        files: {
          '<%= build_dir %>/<%= pkg.name %>-<%= pkg.version %>.css': '<%= compile_dir %>/<%= pkg.name %>-<%= pkg.version %>.css'
        }
      }
    },

    /**
     * `cssmin` handles our css minification
     */

    cssmin: {
      build: {
        options: {
          banner: '<%= meta.banner.css %>'
        },
        files: {
          '<%= build_dir %>/<%= pkg.name %>-<%= pkg.version %>.css': '<%= build_dir %>/<%= pkg.name %>-<%= pkg.version %>.css'
        }
      }
    },

    /**
     * `jshint` - lints our javascripts
     */

    jshint: {
      src: [
        '<%= app_files.js %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        node: true,
        boss: true,
        laxcomma: true,
        eqnull: true,
        freeze: true,
        debug: true,
        latedef: true,
        esnext: true,
        trailing: true,
        undef: true,
        bitwise: true,
        eqeqeq: true,
        browser: true,
        devel: true
      },
      // globals: {} // TODO
    },

    /**
     * `coffeelint` linting for coffeescripts
     */
    coffeelint: {
      src: {
        files: {
          src: ['<%= app_files.coffee %>']
        }
      }
    },

    /**
     * The `index` task compiles the `index.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {

      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      compile: {
        dir: '<%= compile_dir %>',
        src: [
          '<%= compile_dir %>/<%= pkg.name %>-<%= pkg.version %>.js',
          '<%= compile_dir %>/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      build: {
        dir: '<%= build_dir %>',
        src: [
          '<%= build_dir %>/<%= pkg.name %>-<%= pkg.version %>.js',
          '<%= build_dir %>/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      }
    },

    /**
     * `browserify` compiles all javascript files to one bundle by
     *  walking the dependency tree of each file
     */

    browserify: {

      /**
       * Compiles js/coffee for development and testing
       */
       compile: {
         src: [
           // Application javascripts/coffeescripts
           'src/client.js'
         ],
         dest: '<%= compile_dir %>/<%= pkg.name %>-<%= pkg.version %>.js',
         cwd: '.',
         options: {
           'debug': true,
           'noParse': _.union(_.keys(build_config.vendor_files.js)),
           'alias': _.map(generateBrowserifyShim(), function (v, k) {
             return k + ':' + v;
           }),
           'external': _.union(_.map(generateBrowserifyShim(), function (v, k) {
             return v;
           })),
           'transform': [
             reactify,
             es6ify
           ],
           'shim': {
             // 'isotope': {
             //     path: 'vendor/isotope/index.js',
             //     exports: 'Isotope'
             // }
           },
           postBundleCB: function(err, src, next) {
             // To prevent resource lock on leveldb
             cachedTransforms.db.close();
             next(err, src);
           }
         }
       },

      /**
       * Builds js/coffee for production/deployment
       */

      build: {
        src: [
          // Application javascripts/coffeescripts
          'src/client.js'
        ],
        dest: '<%= build_dir %>/<%= pkg.name %>-<%= pkg.version %>.js',
        cwd: '.',
        options: {
          'debug': false,
          'noParse': _.union(_.keys(build_config.vendor_files.js)),
          'alias': _.map(generateBrowserifyShim(), function (v, k) {
            return k + ':' + v;
          }),
          'external': _.union(_.map(generateBrowserifyShim(), function (v, k) {
            return v;
          })),
          'transform': [
            reactify,
            es6ify
          ],
        }
      },

    },

    /**
     * `uglify` minifies our javascript files
     */

    uglify: {
      build: {
        options: {
          banner: '<%= meta.banner.js %>'
        },
        files: {
          '<%= build_dir %>/<%= pkg.name %>-<%= pkg.version %>.js': '<%= build_dir %>/<%= pkg.name %>-<%= pkg.version %>.js'
        }
      }
    },

    /**
     * `connect` starts a web server
     */

    connect: {
      dev: {
        options: {
          port: 9001,
          base: '<%= compile_dir %>'
        }
      },
      prod: {
        options: {
          port: 9001,
          base: '<%= build_dir %>'
        }
      }
    }

  };

  // Supply Grunt with config
  grunt.initConfig(_.extend(grunt_config, build_config));

  /**
   * The default task is to compile and build.
   */

  grunt.registerTask('default', ['compile', 'build']);

  /**
   * The `compile` task gets your app ready to run for development and testing.
   */
  grunt.registerTask('compile', [

    // Deletes `compile_dir`
    'clean:compile',

    // LESS/CSS
    'lessimports',
    'less:compile',
    'concat:compile_css',
    'clean:less',
    'copy:compile_less',

    // App src
    'copy:compile_app_src',

    // Assets
    'copy:compile_app_assets',
    'copy:compile_vendor_assets',

    // Lintings
    'jshint',
    'coffeelint',

    // Javascripts
    'browserify:compile',

    // Index file
    'index:compile'

  ]);

  /**
   * The `build` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask('build', [

    // Deletes `compile_dir` and `build_dir`
    'clean:compile',
    'clean:build',

    // LESS/CSS
    'lessimports',
    'less:compile',
    'concat:compile_css',
    'less:build',
    'cssmin:build',
    'clean:less',

    // Assets
    'copy:compile_app_assets',
    'copy:compile_vendor_assets',
    'copy:build_assets',

    // Lintings
    'jshint',
    'coffeelint',

    // Javascripts
    'browserify:build',
    'uglify',

    // Index file
    'index:build'

  ]);

  /**
   * The `watch` task helps during development/testing by re-compiling everything
   * and reloads the browser
   */
  grunt.renameTask('watch', 'watcher');
  grunt.registerTask('watch', ['compile', 'watcher']);

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask('index', 'Process index.html template', function () {
    var dirRE = new RegExp('^(' + grunt.config('compile_dir') + '|' + grunt.config('build_dir') + ')\/', 'g');
    var jsFiles = filterJS(this.filesSrc).map(function (file) {
      return file.replace(dirRE, '');
    });
    var cssFiles = filterCSS(this.filesSrc).map(function (file) {
      return file.replace(dirRE, '');
    });

    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function (contents, path) {
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config('pkg.version')
          }
        });
      }
    });
  });

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerTask('lessimports', 'Import less files from each module', function() {
    var lessFiles = grunt.file.expand(['src/app/**/*.less']).map(function(o) {
      return o.replace('src', '..');
    });
    var genPath = grunt.config('app_files').less + '.gen';
    grunt.file.copy('src/less/main.less',  genPath, {
      process: function(contents, path) {
        return grunt.template.process(contents, {
          data: {
            lessFiles: lessFiles
          }
        });
      }
    });
  });

  /**
   * Scaffolder
   */

  grunt.registerTask('scaffold', 'Scaffolds a component', scaffolder.component);

};
