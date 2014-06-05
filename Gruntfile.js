// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)

'use strict';

// Setup global project variables

var config,
	styles = [],
	scripts = [];

module.exports = function(grunt) {

	// Project configuration

	grunt.initConfig({
		config: config,
		less: {
			options: {
				compress: true,
				strictMath: true,
				paths: [
					'<%= config.stylePath %>'
				]
			},
			all: {
				files: '<%= config.styles %>'
			}
		},
		uglify: {
			my_target: {
				files: '<%= config.scripts %>'
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
				plugins: [{
					removeViewBox: false
				}]
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
			css: {
				options: {
					message: 'LESS compilation complete'
				}
			},
			js: {
				options: {
					message: 'Javascript uglification complete'
				}
			},
			img: {
				options: {
					message: 'Image minification complete'
				}
			},
			config: {
				options: {
					message: 'Reloading config file'
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
					'less',
					'notify:css'
				]
			},
			js: {
				files: [
					'<%= config.assetPath %>/**/*.js'
				],
				tasks: [
					'newer:uglify',
					'notify:js'
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
					'Gruntfile.js',
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

		var fs = require('fs');

		// Load project config

		var configFile = './' + (grunt.option('config') || 'project.json');

		// Set watch config update

		grunt.config.set('watch.configFiles.files', [
			'Gruntfile.js',
			configFile
		]);

		config = require(configFile);

		config.assetPath = config.paths.root != '' ? './' + config.paths.root + '/' + config.paths.assets.root : './' + config.assets;

		config.paths.root = './' + config.paths.root;

		// Setup global file arrays

		var styleRoot = config.assetPath + '/' + config.paths.assets.css,
			scriptRoot = config.assetPath + '/' + config.paths.assets.js;

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

		var done = this.async();

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
			buildStyles.push(styleRoot + '/' + config.style.build[i]);
		}

		buildStyles.push(styleRoot + '/style.less');

		// Compile configured core files

		var buildScripts = [];

		if (config.script.base.enable) {
			var features = config.script.base.features,
				polyfill = config.script.base.polyfill,
				testing = config.script.base.testing;

			// Core modules

			buildScripts.push(scriptRoot + '/core/base.wee.js');

			if (features.assets) {
				buildScripts.push(scriptRoot + '/core/assets.wee.js');
			}

			if (features.data) {
				buildScripts.push(scriptRoot + '/core/data.wee.js');
			}

			if (features.dom) {
				buildScripts.push(scriptRoot + '/core/dom.wee.js');
			}

			if (features.events) {
				buildScripts.push(scriptRoot + '/core/events.wee.js');
			}

			if (features.routes) {
				buildScripts.push(scriptRoot + '/core/routes.wee.js');
			}

			if (features.screen) {
				if (! features.events) {
					grunt.fail.warn('Event module required for screen functions');
				}

				buildScripts.push(scriptRoot + '/core/screen.wee.js');
			}

			// Polyfills

			if (polyfill.placeholder) {
				buildScripts.push(scriptRoot + '/core/polyfill/placeholder.wee.js');
			}

			if (polyfill.srcset) {
				buildScripts.push(scriptRoot + '/core/polyfill/srcset.wee.js');
			}

			// Testing scripts

			if (testing.placeholders) {
				if (! features.events) {
					grunt.fail.warn('Event module required for screen functions');
				}

				if (! features.data) {
					grunt.fail.warn('Data module required for screen functions');
				}

				buildScripts.push(scriptRoot + '/core/testing/placeholders.wee.js');
			}

			if (testing.responsive) {
				if (! features.events) {
					grunt.fail.warn('Event module required for responsive functions');
				}

				if (! features.data) {
					grunt.fail.warn('Data module required for responsive functions');
				}

				buildScripts.push(scriptRoot + '/core/testing/responsive.wee.js');
			}
		}

		// Compile build directory scripts

		buildScripts.push(scriptRoot + '/build/**/*.js');

		// Compile configured scripts

		var total = config.script.build.length;

		for (var i = 0; i < total; i++) {
			buildScripts.push(scriptRoot + '/' + config.script.build[i]);
		}

		buildScripts.push(scriptRoot + '/script.js');

		// Get style compile files: compile custom files added to the project's compile object

		for (var target in config.style.compile) {
			var sources = config.style.compile[target],
				from = [];

			if (sources instanceof Array) {
				for (var source in sources) {
					from.push('./' + sources[source]);
				}
			} else {
				from = './' + sources;
			}

			projectStyles[target] = from;
		}

		// Get script compile files: compile custom files added to the project's compile object

		for (var target in config.script.compile) {
			var sources = config.script.compile[target],
				from = [];

			if (sources instanceof Array) {
				for (var source in sources) {
					from.push('./' + sources[source]);
				}
			} else {
				from = './' + sources;
			}

			projectScripts[target] = from;
		}

		// Get legacy files: if enabled compile all relevant files into legacy.css and legacy.js

		if (config.script.base.legacy.enable == true) {
			var legacyStyles = [],
				legacyScripts = [],
				legacyCount = config.script.base.legacy.build.length;

			for (var i = 0; i < legacyCount; i++) {
				var file = config.script.base.legacy.build[i],
					ext = file.split('.').pop();

				if (ext == 'js') {
					legacyScripts.push(scriptRoot + '/' + file);
				} else {
					legacyStyles.push(styleRoot + '/' + file);
				}
			}
		}

		legacyStyles.push(styleRoot + '/legacy.less');
		legacyScripts.push(scriptRoot + '/legacy.js');

		// Source map support

		if (config.testing.sourceMaps.css == true) {
			var relativePath = config.stylePath + '/maps/';

			// Clear existing source map files
			fs.readdirSync(relativePath).forEach(function(file) {
				fs.unlinkSync(relativePath + file);
			});

			grunt.config.set('less.options.sourceMap', true);
			grunt.config.set('less.options.sourceMapFilename', config.stylePath + '/maps/source.css.map');
			grunt.config.set('less.options.sourceMapURL', relativePath + 'source.css.map');
			grunt.config.set('less.options.sourceMapBasepath', function(dest) {
				return relativePath + path.basename(dest);
			});
		}

		if (config.testing.sourceMaps.js == true) {
			var path = require('path'),
				relativePath = config.scriptPath + '/maps/';

			// Clear existing source map files
			fs.readdirSync(relativePath).forEach(function(file) {
				fs.unlinkSync(relativePath + file);
			});

			grunt.config.set('uglify.options.sourceMap', true);
			grunt.config.set('uglify.options.sourceMapName', function(dest) {
				var filename = path.basename(dest);

				return relativePath + filename.replace(/.js$/, '.js.map');
			});
		}

		// Load modules

		var modules = [],
			moduleRoot = config.assetPath + '/' + config.paths.assets.modules + '/';

		fs.readdir(moduleRoot, function(err, files) {

			function loadModule(i) {
				if (i < files.length) {
					var file = files[i],
						path = moduleRoot + file;

					fs.stat(path, function(err, stat) {
						if (stat && stat.isDirectory()) {
							var modulePath = path + '/module.json';

							fs.open(modulePath, 'rs', function(err, handle) {

								if (err) {
									grunt.fail.fatal('Missing module.json for ' + file + ' module.');
								} else {
									var module = require(modulePath);

									if (module.autoload == true) {
										grunt.log.ok(module.name + ' module loaded');

										// Add module css

										if (typeof(module.assets.css) != 'undefined') {
											buildStyles.push(path + '/' + module.assets.css + '/style.less');

											// Compile additional module style

											var total = module.style.compile.length;

											for (var x = 0; x < total; x++) {
												buildStyles.push(path + '/' + module.assets.css + '/' + module.style.build[x]);
											}

											// Compile legacy into core

											if (config.script.base.legacy.enable == true) {
												legacyStyles.push(path + '/' + module.assets.css + '/legacy.less');
											}
										}

										// Add module js

										if (typeof(module.assets.js) != 'undefined') {
											buildScripts.push(path + '/' + module.assets.js + '/script.js');

											// Compile additional module scripts

											var total = module.script.compile.length;

											for (var x = 0; x < total; x++) {
												buildScripts.push(path + '/' + module.assets.js + '/' + module.script.build[x]);
											}
										}
									} else {
										grunt.log.ok(module.name + ' module available');

										var moduleBuildStyles = [],
											mobuleBuildScripts = [];

										// Add core module files separately

										if (typeof(module.assets.css) != 'undefined') {
											moduleBuildStyles.push(path + '/' + module.assets.css + '/style.less');

											// Build additional module style

											var total = module.style.build.length;

											for (var x = 0; x < total; x++) {
												moduleBuildStyles.push(styleRoot + '/' + module.style.build[x]);
											}

											// Compile legacy separately

											if (config.script.base.legacy.enable == true) {
												projectStyles[path + '/' + module.assets.css + '/legacy.css'] = path + '/' + module.assets.css + '/legacy.less';
											}

											if (moduleBuildStyles.length > 0)
											{
												projectStyles[path + '/' + module.assets.css + '/style.css'] = moduleBuildStyles;
											}
										}

										if (typeof(module.assets.js) != 'undefined') {
											mobuleBuildScripts.push(path + '/' + module.assets.js + '/script.js');

											// Build additional module script

											var total = module.script.build.length;

											for (var x = 0; x < total; x++) {
												mobuleBuildScripts.push(styleRoot + '/' + module.style.build[x]);
											}

											if (mobuleBuildScripts.length > 0)
											{
												projectScripts[path + '/' + module.assets.js + '/script.min.js'] = mobuleBuildScripts;
											}
										}
									}

									modules.push(module);

									loadModule(i + 1);
								}
							});
						} else {
							loadModule(i + 1);
						}
					});
				} else {
					done();
				}
			}

			if (err) {
				grunt.log.error('Module directory not found');

				done();
			} else {
				loadModule(0);
			}
		});

		projectStyles[styleRoot + '/style.css'] = buildStyles;
		projectScripts[scriptRoot + '/script.min.js'] = buildScripts;

		if (config.script.base.legacy.enable == true) {
			if (legacyStyles.length > 0) {
				projectStyles[styleRoot + '/legacy.css'] = legacyStyles;
			}

			if (legacyScripts.length > 0) {
				projectScripts[scriptRoot + '/legacy.min.js'] = legacyScripts;
			}
		}

		styles.push(projectStyles);
		scripts.push(projectScripts);

		grunt.task.run('settings');

		// Set config

		grunt.config.set('config', config);
	});

	// Bind settings

	grunt.registerTask('settings', function() {
		config.styles = styles;
		config.scripts = scripts;
	});

	// Configure reloading

	grunt.registerTask('reload', function() {
		if (config.testing.reload.enable == true) {
			grunt.config.set('watch.options.livereload', config.testing.reload.port);
			grunt.config.set('open.dev.path', 'http://localhost:' + config.testing.server.port);
			grunt.config.set('connect.server.options.livereload', true);

			var reloadExtensions = config.testing.reload.extensions.join(),
				reloadCount = config.testing.reload.watch.paths.length,
				reloadPaths = [];

			if (config.testing.reload.extensions.length > 1) {
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

	// Load package.json

	pkg: grunt.file.readJSON('package.json'),

	// Load plugins

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Build

	grunt.registerTask('default', [
		'init',
		'settings',
		'less',
		'imagemin',
		'uglify',
		'svgmin'
	]);

	// Build + Watch

	grunt.registerTask('dev', [
		'init',
		'reload',
		'settings',
		'less',
		'imagemin',
		'uglify',
		'svgmin',
		'watch'
	]);

	// Build + Watch + Open

	grunt.registerTask('launch', [
		'init',
		'settings',
		'less',
		'imagemin',
		'uglify',
		'svgmin',
		'open',
		'watch'
	]);

	// Build + Server + Open + Watch

	grunt.registerTask('test', [
		'init',
		'reload',
		'settings',
		'less',
		'imagemin',
		'uglify',
		'svgmin',
		'connect',
		'notify:server',
		'open',
		'watch'
	]);
};
