// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)

'use strict';

// Setup global project variables
var fs = require('fs'),
	styles = [],
	scripts = [],
	config = {};

// Helper functions
var Wee = {
	// Build root or relative path
	buildPath: function(file, path) {
		return file.slice(2) == './' ? file : this.concatPaths(path, file);
	},
	// Join to file system paths
	concatPaths: function(a, b) {
		return (a.slice(-1) !== '/' && b.slice(1) !== '/') ? (a + '/' + b) : (a + b);
	}
};

module.exports = function(grunt) {
	grunt.initConfig({
		config: config,
		less: {
			options: {
				cleancss: true,
				strictMath: true,
				paths: [
					'<%= config.stylePath %>'
				]
			},
			core: {
				files: '<%= config.styles %>'
			}
		},
		uglify: {
			core: {
				files: '<%= config.scripts %>'
			}
		},
		imagemin: {
			options: {
				plugins: [
					{removeViewBox: false},
					{convertPathData: false}
				]
			},
			core: {
				files: [{
					expand: true,
					cwd: '<%= config.assetPath %>',
					dest: '<%= config.assetPath %>',
					src: [
						'**/*.{gif,png,jpg,svg}'
					]
				}]
			}
		},
		browserSync: {
			options: {
				notify: false,
				open: 'external',
				watchTask: true
			}
		},
		notify: {
			style: {
				options: {
					message: 'Style build complete'
				}
			},
			script: {
				options: {
					message: 'Script build complete'
				}
			},
			img: {
				options: {
					message: 'Image minification complete'
				}
			}
		},
		watch: {
			options: {
				spawn: false
			},
			img: {
				files: [
					'<%= config.assetPath %>/**/*.{gif,jpg,png,svg}'
				],
				tasks: [
					'newer:imagemin',
					'notify:img'
				]
			},
			js: {
				files: [
					'<%= config.assetPath %>/**/*.js'
				],
				tasks: [
					'newer:uglify',
					'notify:script'
				]
			},
			less: {
				files: [
					'<%= config.assetPath %>/**/*.less'
				],
				tasks: [
					'less',
					'notify:style'
				]
			},
			project: {
				options: {
					reload: true
				},
				files: [
					'<%= config.modulePath %>/*module.json',
					'<%= config.modulePath %>/*',
					'project.json'
				],
				tasks: [
					'default'
				]
			}
		}
	});

	// Build compile object and load modules
	grunt.registerTask('init', function() {

		// Load config
		var configFile = './' + (grunt.option('config') || 'project.json');

		// Watch config update
		grunt.config.merge({
			watch: {
				project: {
					files: [
						configFile
					]
				}
			}
		});

		config = require(configFile);

		config.assetPath = './' + (
			config.paths.root !== '' ?
				config.paths.root + '/' + config.paths.assets :
				config.assets
			);

		config.paths.root = './' + config.paths.root;

		///////////
		// Style //
		///////////

		var styleRoot = config.assetPath + '/css',
			weeStyleRoot = config.assetPath + '/wee/style/',
			projectStyle = {},
			styleVars = {},
			styleTasks = [],
			styleConcat = [];

		config.stylePath = styleRoot;
		config.scriptPath = scriptRoot;

		// Minify lib
		styles.push({
			expand: true,
			cwd: styleRoot + '/lib',
			dest: styleRoot + '/lib',
			src: [
				'**/*.less'
			],
			ext: '.css'
		});

		// Build
		var buildStyles = [];

		// Core
		buildStyles.push(weeStyleRoot + 'wee.less');

		buildStyles.push(styleRoot + '/build/**/*.{css,less}');

		// Build configured
		var total = config.style.build.length;

		for (var i = 0; i < total; i++) {
			buildStyles.push(Wee.buildPath(config.style.build[i], styleRoot));
		}

		// Compile custom
		for (var target in config.style.compile) {
			var sources = config.style.compile[target],
				from = [];

			if (sources instanceof Array) {
				for (var source in sources) {
					from.push(Wee.buildPath(sources[source], styleRoot));
				}
			} else {
				from = Wee.buildPath(sources, styleRoot);
			}

			projectStyle[Wee.buildPath(target, styleRoot)] = from;
		}

		// Source maps
		if (config.style.sourceMaps == true) {
			var relativePath = config.assetPath + '/wee/maps/';

			grunt.config.set('less.options.sourceMap', true);
			grunt.config.set('less.options.sourceMapFilename', relativePath + 'source.css.map');
			grunt.config.set('less.options.sourceMapURL', relativePath + 'source.css.map');
			grunt.config.set('less.options.sourceMapBasepath', function(dest) {
				var filename = dest.replace(config.assetPath + '/', '')
					.replace('css/', '')
					.replace(/\//g, '-')
					.replace('.css', '');

				return relativePath + filename + '.css.map';
			});
		}

		////////////
		// Script //
		////////////

		var scriptRoot = config.assetPath + '/js',
			weeScriptRoot = config.assetPath + '/wee/script/',
			projectScript = {};

		// Minify lib
		scripts.push({
			expand: true,
			cwd: scriptRoot + '/lib',
			dest: scriptRoot + '/lib',
			src: [
				'**/*.js',
				'!**/*.min.js'
			],
			rename: function(dest, src) {
				var dir = src.substring(0, src.lastIndexOf('/')),
					filename = src.substring(src.lastIndexOf('/'), src.length);
					filename = filename.substring(0, filename.lastIndexOf('.'));

				return dest + '/' + dir + filename + '.min.js';
			}
		});

		// Core files
		var buildScripts = [];

		if (config.script.core.enable) {
			var features = config.script.core.features;

			buildScripts.push(weeScriptRoot + 'wee.js');

			if (features.assets) {
				buildScripts.push(weeScriptRoot + 'wee.assets.js');
			}

			if (features.data) {
				buildScripts.push(weeScriptRoot + 'wee.data.js');
			}

			if (features.dom) {
				buildScripts.push(weeScriptRoot + 'wee.dom.js');
			}

			if (features.events) {
				buildScripts.push(weeScriptRoot + 'wee.events.js');
			}

			if (features.routes) {
				buildScripts.push(weeScriptRoot + 'wee.routes.js');
			}

			if (features.screen) {
				if (! features.events) {
					grunt.fail.warn('Event module required for screen functions');
				}

				buildScripts.push(weeScriptRoot + 'wee.screen.js');
			}

			if (features.chain) {
				buildScripts.push(weeScriptRoot + 'wee.chain.js');
			}
		}

		// Build
		buildScripts.push(scriptRoot + '/build/**/*.js');

		// Build configured
		var total = config.script.build.length;

		for (var i = 0; i < total; i++) {
			buildScripts.push(Wee.buildPath(config.script.build[i], scriptRoot));
		}

		buildScripts.push(scriptRoot + '/custom/script.js');

		// Compile custom
		for (var target in config.script.compile) {
			var sources = config.script.compile[target],
				from = [];

			if (sources instanceof Array) {
				for (var source in sources) {
					from.push(Wee.buildPath(sources[source], scriptRoot));
				}
			} else {
				from = Wee.buildPath(sources, scriptRoot);
			}

			projectScript[Wee.buildPath(target, scriptRoot)] = from;
		}

		// Source maps
		if (config.script.sourceMaps == true) {
			grunt.config.set('uglify.options.sourceMap', true);
			grunt.config.set('uglify.options.sourceMapName', function(dest) {
				var filename = dest.replace(config.assetPath + '/', '')
					.replace('js/', '')
					.replace(/\//g, '-')
					.replace('.min.js', '');

				return relativePath + filename + '.js.map';
			});
		}

		/////////////
		// Cleanup //
		/////////////

		// Source maps
		if (config.style.sourceMaps == true || config.script.sourceMaps == true) {
			var relativePath = config.assetPath + '/wee/maps/';

			fs.readdirSync(relativePath).forEach(function(file) {
				fs.unlinkSync(relativePath + file);
			});
		}

		/////////////
		// Modules //
		/////////////

		var modules = {},
			modulePaths = [],
			moduleRoot = config.assetPath + '/modules/',
			moduleTempRoot = config.assetPath + '/wee/temp/'

		config.modulePath = moduleRoot;

		// Remove temporary module files
		fs.readdir(moduleTempRoot, function(err, files) {
			files.forEach(function(file) {
				if (file.charAt(0) !== '.') {
					fs.unlinkSync(moduleTempRoot + file);
				}
			});
		});

		// Begin async operations
		var done = this.async();

		// Load modules
		fs.readdir(moduleRoot, function(err, files) {

			function loadModule(i) {
				if (i < files.length) {
					var file = files[i],
						path = moduleRoot + file;

					// Loop through each module root
					fs.stat(path, function(err, stat) {
						if (stat && stat.isDirectory()) {
							var modulePath = path + '/module.json';

							fs.open(modulePath, 'rs', function(err, handle) {

								if (err) {
									grunt.fail.fatal('Missing module.json for ' + file + ' module.');
								} else {
									var module = require(modulePath);

									modules[file] = module;

									loadModule(i + 1);
								}
							});
						} else {
							loadModule(i + 1);
						}
					});
				} else {
					var moduleNames = Object.keys(modules),
						moduleCount = moduleNames.length;

					// Build modules
					moduleNames.forEach(function(name) {
						var module = modules[name],
							path = moduleRoot + name,
							cssDest = (module.autoload == true) ?
								config.assetPath + '/wee/temp/' + name + '.css' :
								path + '/screen.css',
							moduleStyle = [
								path + '/module/style/screen.less',
								path + '/css/build/*'
							],
							moduleScript = [
								path + '/module/script/*.js',
								path + '/js/build/*.js'
							],
							banner = "@import '../../../../wee/style/wee.module.less';",
							moduleVars = {
								moduleName: name,
								responsive: false
							},
							obj = {};

						// Build additional style
						if (module.style && module.style.build) {
							module.style.build.forEach(function(path) {
								banner += "@import '../../" + path + "';";
							});
						}

						// Build additional script
						if (module.script && module.script.build) {
							moduleScript.push(Wee.concatPaths(path, module.script.build));
						}

						// Determine if module is responsive
						if (fs.existsSync(path + '/module/style/breakpoints')) {
							moduleVars.responsive = true;

							banner += ' \
								.mobile-landscape () when not (@mobileLandscapeWidth = false) { \
									@import "breakpoints/mobile-landscape.less"; \
								} \
								.tablet-portrait () when not (@tabletPortraitWidth = false) { \
									@import "breakpoints/tablet-portrait.less"; \
								} \
								.desktop-small () when not (@desktopSmallWidth = false) { \
									@import "breakpoints/desktop-small.less"; \
								} \
								.desktop-medium () when not (@desktopMediumWidth = false) { \
									@import "breakpoints/desktop-medium.less"; \
								} \
								.desktop-large () when not (@desktopLargeWidth = false) { \
									@import "breakpoints/desktop-large.less"; \
								} \
							';
						}

						if (fs.existsSync(path + '/css/breakpoints')) {
							moduleVars.responsive = true;

							banner += ' \
								.mobile-landscape () when not (@mobileLandscapeWidth = false) { \
									@import "../../css/breakpoints/mobile-landscape.less"; \
								} \
								.tablet-portrait () when not (@tabletPortraitWidth = false) { \
									@import "../../css/breakpoints/tablet-portrait.less"; \
								} \
								.desktop-small () when not (@desktopSmallWidth = false) { \
									@import "../../css/breakpoints/desktop-small.less"; \
								} \
								.desktop-medium () when not (@desktopMediumWidth = false) { \
									@import "../../css/breakpoints/desktop-medium.less"; \
								} \
								.desktop-large () when not (@desktopLargeWidth = false) { \
									@import "../../css/breakpoints/desktop-large.less"; \
								} \
							';
						}

						// Create module style compile task
						obj[name] = {
							files: [{
								dest: cssDest,
								src: moduleStyle
							}],
							options: {
								banner: banner.replace(/\r?\n|\r/g, ''),
								modifyVars: moduleVars
							}
						};

						grunt.config.merge({
							less: obj
						});

						styleTasks.push('less:' + name);

						if (module.autoload == true) {
							// Push temporary style to concat list
							styleConcat.push(cssDest);

							// Add script paths to uglify
							buildScripts.push(moduleScript);
						} else {
							// Compile script into module root
							projectScript[path + '/script.min.js'] = moduleScript;
						}
					});

					if (styleConcat.length > 0) {
						styleConcat.push(styleRoot + '/style.css');

						// Configure style concatenation
						grunt.config.merge({
							concat: {
								style: {
									files: [{
										dest: styleRoot + '/style.css',
										src: styleConcat
									}]
								}
							}
						});

						grunt.config.merge({
							watch: {
								concat: {
									files: styleConcat,
									tasks: [
										'concat:style'
									]
								}
							}
						});
					}

					// Make config available to tasks
					projectStyle[styleRoot + '/style.css'] = buildStyles;
					projectScript[scriptRoot + '/script.min.js'] = buildScripts;

					styles.push(projectStyle);
					scripts.push(projectScript);

					grunt.config.merge({
						less: {
							core: {
								options: {
									modifyVars: styleVars
								}
							}
						}
					});

					config.styles = styles;
					config.styleTasks = styleTasks;
					config.styleConcat = styleConcat;

					config.scripts = scripts;

					grunt.config.set('config', config);

					done();
				}
			}

			if (err) {
				grunt.log.warn('Module directory not found');

				done();
			} else {
				loadModule(0);
			}
		});
	});

	// Build project style
	grunt.registerTask('style', function() {
		grunt.task.run('less:core');

		config.styleTasks.forEach(function(task) {
			grunt.task.run(task);
		});

		if (config.styleConcat.length > 0) {
			grunt.task.run('concat:style');
		}

		grunt.task.run('notify:style');
	});

	// Configure reloading
	grunt.registerTask('reload', function() {
		if (config.reload.enable == true) {
			var reloadExtensions = config.reload.watch.extensions.join(),
				reloadCount = config.reload.watch.paths.length,
				reloadPaths = [];

			if (config.reload.watch.extensions.length > 1) {
				reloadExtensions = '{' + reloadExtensions + '}';
			}

			// Add user-defined watch paths
			for (var i = 0; i < reloadCount; i++) {
				reloadPaths.push(config.reload.watch.paths[i] + '/**/*.' + reloadExtensions);
			}

			// Add root to reload watchlist
			if (config.reload.watch.root == true) {
				reloadPaths.push(config.paths.root + '/**/*.' + reloadExtensions);
			}

			// Bind BrowserSync watchlist
			reloadPaths.push(config.assetPath + '/**/*.{gif,jpg,png,css,min.js,svg}');

			grunt.config.set('browserSync.bsFiles.src', reloadPaths);
		}
	});

	// Configure and launch testing server
	grunt.registerTask('server', function() {
		grunt.config.set('browserSync.options.server', {
			baseDir: config.paths.root,
		});

		grunt.config.set('browserSync.options.port', config.testing.server.port);

		grunt.task.run('browserSync');
	});

	// Proxy and launch from local server
	grunt.registerTask('proxy', function() {
		if (config.server.proxy !== false) {
			grunt.config.set('browserSync.options.proxy', config.dev.server.proxy);

			grunt.task.run('browserSync');
		}
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-notify');

	// Build
	grunt.registerTask('default', [
		'init',
		'imagemin',
		'style',
		'uglify'
	]);

	// Build & Watch
	grunt.registerTask('dev', [
		'default',
		'reload',
		'proxy',
		'watch'
	]);

	// Build, Server, Open & Watch
	grunt.registerTask('testing', [
		'default',
		'reload',
		'server',
		'watch'
	]);
};