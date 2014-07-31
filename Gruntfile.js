// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)

'use strict';

// Setup global project variables
var fs = require('fs'),
	path = require('path'),
	async = require('async'),
	styles = [],
	scripts = [],
	config;

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
			css: {
				options: {
					message: 'LESS compilation complete'
				}
			},
			js: {
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
		newer: {
			options: {
				override: function(details, shouldIncludeCallback) {
					var checkFileForModifiedImports = async.memoize(function(filepath, fileCheckCallback) {
						fs.readFile(filepath, 'utf8', function(error, data) {
							var directoryPath = path.dirname(filepath),
								regex = /@import (?:\([^)]+\) )?'(.+?)(\.less)?'/g,
								match;

							function checkNextImport() {
								if ((match = regex.exec(data)) === null) {
									return fileCheckCallback(false); // All @import files have been checked
								}

								// Replace the responsivePath variable with path
								var filename = match[1].replace('@{responsivePath}', 'custom/breakpoints');

								// Compile all module paths by default for now
								if (/@{(.*)}(.*).less/.test(filename)) {
									fileCheckCallback(true);
								}

								var importFilePath = path.join(directoryPath, filename + '.less');

								fs.exists(importFilePath, function(exists) {
									// @import file does not exists
									if (! exists) {
										return checkNextImport(); // Skip to next
									}

									fs.stat(importFilePath, function(error, stats) {
										// @import file has been modified so include it
										if (stats.mtime > details.time) {
											fileCheckCallback(true);
										} else {
											// @import file hasn't been modified but check the @import's of this file
											checkFileForModifiedImports(importFilePath, function(hasModifiedImport) {
												if (hasModifiedImport) {
													fileCheckCallback(true);
												} else {
													checkNextImport();
												}
											});
										}
									});
								});
							};

							checkNextImport();
						});
					});

					// Only add override behavior to LESS tasks
					if (details.task == 'less') {
						checkFileForModifiedImports(details.path, function(found) {
							shouldIncludeCallback(found);
						});
					} else {
						shouldIncludeCallback(false);
					}
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
					'newer:less',
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

		var lessVars = {};

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
				lessVars['responsiveTestMode'] = false;
			}
		}

		// Compile build directory scripts
		buildScripts.push(scriptRoot + '/build/**/*.js');

		// Compile configured scripts
		var total = config.script.build.length;

		for (var i = 0; i < total; i++) {
			buildScripts.push(scriptRoot + '/' + config.script.build[i]);
		}

		buildScripts.push(scriptRoot + '/custom/script.js');

		// Get style compile files: compile custom files added to the project's compile object
		for (var target in config.style.compile) {
			var sources = config.style.compile[target],
				from = [];

			if (sources instanceof Array) {
				for (var source in sources) {
					from.push(styleRoot + '/' + sources[source]);
				}
			} else {
				from = styleRoot + '/' + sources;
			}

			projectStyles[styleRoot + '/' + target] = from;
		}

		// Get script compile files: compile custom files added to the project's compile object
		for (var target in config.script.compile) {
			var sources = config.script.compile[target],
				from = [];

			if (sources instanceof Array) {
				for (var source in sources) {
					from.push(scriptRoot + '/' + sources[source]);
				}
			} else {
				from = scriptRoot + '/' + sources;
			}

			projectScripts[scriptRoot + '/' + target] = from;
		}

		// Source map support
		var maps = config.testing.sourceMaps;

		if (maps.css == true || maps.js == true) {
			var relativePath = config.assetPath + '/maps/';

			// Clear existing source map files
			fs.readdirSync(relativePath).forEach(function(file) {
				fs.unlinkSync(relativePath + file);
			});
		}

		if (maps.css == true) {
			var relativePath = config.assetPath + '/maps/';

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

		// Load modules
		var modules = [],
			moduleRoot = config.assetPath + '/modules/';

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
										if (module.assets.style) {
											buildStyles.push(path + '/css/style.less');

											// Compile additional module style
											var total = module.style.compile.length;

											for (var x = 0; x < total; x++) {
												buildStyles.push(path + '/css/' + module.style.build[x]);
											}
										}

										// Add module js
										if (module.assets.script) {
											buildScripts.push(path + '/js/script.js');

											// Compile additional module scripts
											var total = module.script.compile.length;

											for (var x = 0; x < total; x++) {
												buildScripts.push(path + '/js/' + module.script.build[x]);
											}
										}
									} else {
										grunt.log.ok(module.name + ' module available');

										var moduleBuildStyles = [],
											mobuleBuildScripts = [];

										// Add core module files separately
										if (module.assets.style) {
											moduleBuildStyles.push(path + '/css/style.less');

											// Build additional module style
											var total = module.style.build.length;

											for (var x = 0; x < total; x++) {
												moduleBuildStyles.push(styleRoot + '/' + module.style.build[x]);
											}

											if (moduleBuildStyles.length > 0)
											{
												projectStyles[path + '/css/style.css'] = moduleBuildStyles;
											}
										}

										if (typeof(module.assets.script) != 'undefined') {
											mobuleBuildScripts.push(path + '/js/script.js');

											// Build additional module script
											var total = module.script.build.length;

											for (var x = 0; x < total; x++) {
												mobuleBuildScripts.push(styleRoot + '/' + module.style.build[x]);
											}

											if (mobuleBuildScripts.length > 0)
											{
												projectScripts[path + '/js/script.min.js'] = mobuleBuildScripts;
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

		styles.push(projectStyles);
		scripts.push(projectScripts);

		grunt.task.run('settings');

		// Set config
		grunt.config.merge({
			less: {
				options: {
					modifyVars: lessVars
				}
			}
		});

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
			var patternPath = config.assetPath + '/' + guide.paths.patterns + '/';

			fs.readdirSync(patternPath, function(err, files) {
				console.log('asd');
				if (err) {
					throw err;
				}

				var templatePath = './' + guide.paths.template,
					targetPath = './' + guide.paths.target,
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
		'less',
		'imagemin',
		'uglify',
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
		'less',
		'imagemin',
		'uglify',
		'svgmin',
		'watch'
	]);

	// Build + Watch + Open
	grunt.registerTask('launch', [
		'init',
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