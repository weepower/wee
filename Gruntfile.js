// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)

'use strict';

// Setup global project variables
var fs = require('fs'),
	path = require('path'),
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

	// Project configuration
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
			my_target: {
				files: '<%= config.scripts %>'
			}
		},
		concat: {
			core: {
				files: {}
			}
		},
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: '<%= config.assetPath %>',
					dest: '<%= config.assetPath %>',
					src: [
						'**/*.{gif,png,jpg}'
					]
				}]
			}
		},
		svgmin: {
			options: {
				plugins: [
					{removeViewBox: false},
					{convertPathData: false}
				]
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.assetPath %>',
					dest: '<%= config.assetPath %>',
					src: [
						'**/*.svg'
					]
				}]
			}
		},
		connect: {
			server: {
				options: {
					port: '<%= config.testing.server.port %>',
					base: '<%= config.paths.root %>'
				}
			}
		},
		open: {
			dev: {
				path: '<%= config.testing.host %>'
			}
		},
		notify: {
			server: {
				options: {
					message: 'Testing server ready'
				}
			},
			style: {
				options: {
					message: 'Style compilation complete'
				}
			},
			script: {
				options: {
					message: 'JavaScript uglification complete'
				}
			},
			img: {
				options: {
					message: 'Image minification complete'
				}
			},
			config: {
				options: {
					message: 'Config modification complete'
				}
			}
		},
		watch: {
			options: {
				spawn: false
			},
			less: {
				files: [
					'<%= config.assetPath %>/**/*.less'
				],
				tasks: [
					'buildStyle'
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
			img: {
				files: [
					'<%= config.assetPath %>/**/*.{gif,jpg,png}'
				],
				tasks: [
					'newer:imagemin',
					'notify:img'
				]
			},
			svg: {
				files: [
					'<%= config.assetPath %>/**/*.svg'
				],
				tasks: [
					'newer:svgmin',
					'notify:img'
				]
			},
			configFiles: {
				options: {
					reload: true
				},
				files: [
					'project.json'
				],
				tasks: [
					'dev',
					'notify:config'
				]
			}
		}
	});

	// Initialization task: build compile object and load modules
	grunt.registerTask('init', function() {

		// Begin async operations
		var done = this.async();

		var styleVars = {},
			styleTasks = [],
			styleConcat = [];

		// Load project config
		var configFile = './' + (grunt.option('config') || 'project.json');

		// Set watch config update
		grunt.config.set('watch.configFiles.files', [
			configFile
		]);

		config = require(configFile);

		config.assetPath = config.paths.root != '' ? './' + config.paths.root + '/' + config.paths.assets : './' + config.assets;

		config.paths.root = './' + config.paths.root;

		// Setup global file arrays
		var styleRoot = config.assetPath + '/css',
			scriptRoot = config.assetPath + '/js',
			weeStyleRoot = config.assetPath + '/wee/style/',
			weeScriptRoot = config.assetPath + '/wee/script/';

		config.stylePath = styleRoot;
		config.scriptPath = scriptRoot;

		// Minify all lib scripts
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

		var projectStyles = {},
			projectScripts = {};

		// Minify all lib less
		styles.push({
			expand: true,
			cwd: styleRoot + '/lib',
			dest: styleRoot + '/lib',
			src: [
				'**/*.less'
			],
			ext: '.css'
		});

		// Compile build directory stylesheets
		var buildStyles = [];

		buildStyles.push(styleRoot + '/build/**/*.{css,less}');

		// Compile configured build stylesheets
		var total = config.style.build.length;

		for (var i = 0; i < total; i++) {
			buildStyles.push(Wee.buildPath(config.style.build[i], styleRoot));
		}

		buildStyles.push(weeStyleRoot + 'wee.less');

		// Compile configured core files
		var buildScripts = [];

		if (config.script.core.enable) {
			var features = config.script.core.features;

			// Core modules
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

			// Testing modules
			var testing = config.script.core.testing;

			if (testing.placeholders) {
				if (! features.events) {
					grunt.fail.warn('Event module required for screen functions');
				}

				if (! features.data) {
					grunt.fail.warn('Data module required for screen functions');
				}

				buildScripts.push(weeScriptRoot + 'testing/wee.placeholders.js');
			} else {
				grunt.config.merge({
					less: {
						options: {
							modifyVars: {
								'placeholdersEnabled': false
							}
						}
					}
				});
			}

			if (testing.responsive) {
				if (! features.events) {
					grunt.fail.warn('Event module required for responsive functions');
				}

				if (! features.data) {
					grunt.fail.warn('Data module required for responsive functions');
				}

				buildScripts.push(weeScriptRoot + 'testing/wee.responsive.js');
			} else {
				styleVars['responsiveTestMode'] = false;
			}
		}

		// Compile build directory scripts
		buildScripts.push(scriptRoot + '/build/**/*.js');

		// Compile configured scripts
		var total = config.script.build.length;

		for (var i = 0; i < total; i++) {
			buildScripts.push(Wee.buildPath(config.script.build[i], scriptRoot));
		}

		buildScripts.push(scriptRoot + '/custom/script.js');

		// Get style compile files: compile custom files added to the project's compile object
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

			projectStyles[Wee.buildPath(target, styleRoot)] = from;
		}

		// Get script compile files: compile custom files added to the project's compile object
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

			projectScripts[Wee.buildPath(target, scriptRoot)] = from;
		}

		// Source map support
		var maps = config.testing.sourceMaps;

		if (maps.css == true || maps.js == true) {
			var relativePath = config.assetPath + '/wee/maps/';

			// Clear existing source map files
			fs.readdirSync(relativePath).forEach(function(file) {
				fs.unlinkSync(relativePath + file);
			});
		}

		if (maps.css == true) {
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

		if (maps.js == true) {
			grunt.config.set('uglify.options.sourceMap', true);
			grunt.config.set('uglify.options.sourceMapName', function(dest) {
				var filename = dest.replace(config.assetPath + '/', '')
								   .replace('js/', '')
								   .replace(/\//g, '-')
								   .replace('.min.js', '');

				return relativePath + filename + '.js.map';
			});
		}

		var modules = {},
			modulePaths = [],
			moduleRoot = config.assetPath + '/modules/',
			moduleTempRoot = config.assetPath + '/wee/temp/'

		// Remove temporary module files
		fs.readdir(moduleTempRoot, function(err, files) {
			files.forEach(function(file) {
				if (file.charAt(0) !== '.') {
					fs.unlinkSync(moduleTempRoot + file);
				}
			});
		});

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
								path + '/module/style/*.less',
								path + '/css/build/*.less'
							],
							moduleScript = [
								path + '/module/script/*.js',
								path + '/js/build/*.js'
							],
							banner = "@import '" + weeStyleRoot + "wee.module.less';",
							moduleVars = {
								moduleName: name
							},
							obj = {};

						// Build additional style
						if (module.style && module.style.build) {
							moduleStyle.push(Wee.concatPaths(path, module.style.build));
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
							projectScripts[path + '/script.min.js'] = moduleScript;
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
					}

					// Make config available to tasks
					projectStyles[styleRoot + '/style.css'] = buildStyles;
					projectScripts[scriptRoot + '/script.min.js'] = buildScripts;

					styles.push(projectStyles);
					scripts.push(projectScripts);

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
	grunt.registerTask('buildStyle', function() {
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
		if (config.testing.reload.enable == true) {
			grunt.config.set('watch.options.livereload', config.testing.reload.port);
			grunt.config.set('open.dev.path', 'http://localhost:' + config.testing.server.port);
			grunt.config.set('connect.server.options.livereload', true);

			var reloadExtensions = config.testing.reload.watch.extensions.join(),
				reloadCount = config.testing.reload.watch.paths.length,
				reloadPaths = [];

			if (config.testing.reload.watch.extensions.length > 1) {
				reloadExtensions = '{' + reloadExtensions + '}';
			}

			// Add user-defined watch paths
			for (var i = 0; i < reloadCount; i++) {
				reloadPaths.push(config.testing.reload.watch.paths[i] + '/**/*.' + reloadExtensions);
			}

			// Add root to reload watchlist
			if (config.testing.reload.watch.root == true) {
				reloadPaths.push(config.paths.root + '/**/*.' + reloadExtensions);
			}

			// Bind configuration
			grunt.config.set('watch.html.files', reloadPaths);
		}
	});

	// Build living style guide
	grunt.registerTask('styleGuide', function() {
		var guide = config.guide;

		if (guide.enable == true) {
			var patternPath = Wee.buildPath(guide.paths.patterns, config.assetPath);

			fs.readdirSync(patternPath, function(err, files) {
				if (err) {
					throw err;
				}

				var templatePath = Wee.buildPath(guide.paths.template, config.assetPath),
					targetPath = Wee.buildPath(guide.paths.target, config.assetPath),
					output = '';

				files.map(function(file) {
					console.log(path.join(p, file));
				}).filter(function(file) {
					console.log(fs.statSync(file).isFile());
				}).forEach(function(file) {
					console.log("%s (%s)", file, path.extname(file));
				});
			});
		}
	});

	// Load package.json
	pkg: grunt.file.readJSON('package.json'),

	// Load plugins
	require('load-grunt-tasks')(grunt);

	// Build
	grunt.registerTask('default', [
		'init',
		'buildStyle',
		'uglify',
		'imagemin',
		'svgmin'
	]);

	// Guide
	grunt.registerTask('guide', [
		'init',
		'styleGuide'
	]);

	// Build + Watch
	grunt.registerTask('dev', [
		'init',
		'reload',
		'buildStyle',
		'uglify',
		'imagemin',
		'svgmin',
		'watch'
	]);

	// Build + Watch + Open
	grunt.registerTask('launch', [
		'init',
		'buildStyle',
		'uglify',
		'imagemin',
		'svgmin',
		'open',
		'watch'
	]);

	// Build + Server + Open + Watch
	grunt.registerTask('test', [
		'init',
		'reload',
		'buildStyle',
		'uglify',
		'imagemin',
		'svgmin',
		'connect',
		'notify:server',
		'open',
		'watch'
	]);
};