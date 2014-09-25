// Wee 2.0.2 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

'use strict';

var fs = require('fs');

// Configuration objects
var project = {},
	config = {},
	style = {},
	script = {},
	modules = {},
	legacy = {},
	version = '2.0.2';

// Helper functions
var Wee = {
	// Build root or relative path
	buildPath: function(file, path) {
		return file.slice(2) == './' ? file : this.concatPaths(path, file);
	},
	// Join two file system paths
	concatPaths: function(a, b) {
		return (a.slice(-1) !== '/' && b.slice(1) !== '/') ? (a + '/' + b) : (a + b);
	},
	// Get file extension
	getExtension: function(name) {
		var i = name.lastIndexOf('.');
		return (i < 0) ? '' : name.substr(i + 1);
	},
	// Recursively get files in directory
	getFiles: function(dir, ext, files) {
		files = files || [];

		if (typeof files === 'undefined') {
			files = [];
		}

		var children = fs.readdirSync(dir);

		for (var file in children) {
			if (files.hasOwnProperty(file)) {
				continue;
			}

			var match = children[file],
				path = dir + '/' + children[file];

			if (fs.statSync(path).isDirectory()) {
				this.getFiles(path, ext, files);
			} else {
				if (match.charAt(0) !== '.' && ext.indexOf(this.getExtension(match)) !== -1) {
					files.push(path);
				}
			}
		}

		return files;
	},
	// Append minified extension
	getMinifiedExtension: function(dest, src, ext) {
		var dir = src.substring(0, src.lastIndexOf('/')),
			filename = src.substring(src.lastIndexOf('/'), src.length);
			filename = filename.substring(0, filename.lastIndexOf('.'));

		return dest + '/' + dir + filename + ext;
	}
};

module.exports = function(grunt) {
	grunt.initConfig({
		less: {
			options: {
				cleancss: true,
				modifyVars: '<%= config.style.vars %>',
				strictMath: true,
				paths: [
					'<%= config.style.rootPath %>'
				]
			},
			core: {
				files: [{
					dest: '<%= config.tempPath %>/wee.css',
					src: '<%= config.tempPath %>/wee.less'
				}]
			},
			lib: {
				files: [{
					expand: true,
					cwd: '<%= config.style.rootPath %>/lib',
					dest: '<%= config.style.rootPath %>/lib',
					src: [
						'**/*.{css,less}',
						'!**/*.min.css'
					],
					rename: function(dest, src) {
						return Wee.getMinifiedExtension(dest, src, '.min.css');
					}
				}]
			}
		},
		uglify: {
			core: {
				files: [{
					dest: '<%= config.script.rootPath %>/script.min.js',
					src: '<%= config.script.files %>'
				}]
			},
			lib: {
				files: [{
					expand: true,
					cwd: '<%= config.script.rootPath %>/lib',
					dest: '<%= config.script.rootPath %>/lib',
					src: [
						'**/*.js',
						'!**/*.min.js'
					],
					rename: function(dest, src) {
						return Wee.getMinifiedExtension(dest, src, '.min.js');
					}
				}]
			}
		},
		concat: {
			style: {
				dest: '<%= config.style.rootPath %>/style.min.css',
				src: '<%= config.style.concat %>'
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
						'**/*.{gif,jpg,png,svg}'
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
			images: {
				options: {
					message: 'Images minified'
				}
			},
			script: {
				options: {
					message: 'Script compiled'
				}
			},
			style: {
				options: {
					message: 'Style compiled'
				}
			},
			legacy: {
				options: {
					message: 'Legacy style compiled'
				}
			},
			project: {
				options: {
					message: 'Project config updated'
				}
			}
		},
		watch: {
			options: {
				spawn: false
			},
			images: {
				files: [
					'<%= config.assetPath %>/**/*.{gif,jpg,png,svg}'
				],
				tasks: [
					'imagemin',
					'notify:images'
				]
			},
			scriptCore: {
				files: '<%= config.script.files %>',
				tasks: [
					'uglify:core',
					'notify:script'
				]
			},
			scriptLib: {
				files: [
					'<%= config.script.rootPath %>/lib/**/*.js',
					'!<%= config.script.rootPath %>/lib/**/*.min.js'
				],
				tasks: [
					'uglify:lib',
					'notify:script'
				]
			},
			styleCore: {
				files: [
					'<%= config.assetPath %>/wee/style/*.less',
					'<%= config.style.rootPath %>/custom/**/*.less'
				],
				tasks: [
					'less:core',
					'concat:style',
					'notify:style'
				]
			},
			styleBuild: {
				files: [
					'<%= config.style.rootPath %>/build/**/*.{css,less}'
				],
				tasks: [
					'buildStyle',
					'notify:style'
				],
				options: {
					event: ['added', 'deleted'],
				},
			},
			styleBuildUpdate: {
				files: [
					'<%= config.style.rootPath %>/build/**/*.{css,less}'
				],
				tasks: [
					'less:core',
					'concat:style',
					'notify:style'
				],
				options: {
					event: ['changed'],
				},
			},
			styleLib: {
				files: [
					'<%= config.style.rootPath %>/lib/**/*.{css,less}',
					'!<%= config.style.rootPath %>/lib/**/*.min.css'
				],
				tasks: [
					'less:lib',
					'notify:style'
				]
			},
			styleConcat: {
				files: [
					'<%= config.tempPath %>/**/*.css'
				],
				tasks: [
					'concat:style',
					'notify:style'
				]
			},
			project: {
				files: [
					'<%= config.filePath %>',
					'<%= config.modules.rootPath %>/*/module.json'
				],
				tasks: [
					'default',
					'notify:project'
				]
			}
		}
	});

	// Initialize config
	grunt.registerTask('init', function() {
		// Detect project file
		var configFile = './' + (grunt.option('config') || 'project.json');

		// Load project file
		var json = grunt.file.read(configFile);
			project = JSON.parse(json);

		// Reset config object
		config = {
			paths: {}
		};

		// Set project file paths
		config.filePath = configFile;

		config.assetPath = (project.paths.root !== '') ?
			project.paths.root + '/' + project.paths.assets :
			project.assets;

		config.paths.root = './' + project.paths.root;
		config.paths.sourceMaps = config.assetPath + '/wee/maps/';
		config.tempPath = config.assetPath + '/wee/temp';
	});

	// Clean up files
	grunt.registerTask('cleanup', function() {
		// Remove temp files
		fs.readdirSync(config.tempPath).forEach(function(file) {
			if (file.charAt(0) !== '.') {
				fs.unlinkSync(config.tempPath + '/' + file);
			}
		});

		// Remove source maps
		if (project.script.sourceMaps == true) {
			fs.readdirSync(config.paths.sourceMaps).forEach(function(file) {
				fs.unlinkSync(config.paths.sourceMaps + file);
			});
		}
	});

	// Parse style config
	grunt.registerTask('configStyle', function() {
		// Set global config
		style = {
			rootPath: config.assetPath + '/css',
			files: [],
			project: {},
			imports: [],
			tasks: [],
			concat: [],
			print: '',
			responsive: ''
		};

		var weeStyleRoot = config.assetPath + '/wee/style',
			styleFeatures = project.style.core,
			styleSettings = {};

		// Core style features
		style.vars = {
			buttonEnabled: (styleFeatures.buttons === true) ? true : false,
			codeEnabled: (styleFeatures.code === true) ? true : false,
			formEnabled: (styleFeatures.forms === true) ? true : false,
			tableEnabled: (styleFeatures.tables === true) ? true : false,
			printEnabled: (styleFeatures.print === true) ? true : false
		}

		if (style.vars.buttonEnabled) {
			style.imports.push('../style/components/wee.buttons.less');
		}

		if (style.vars.codeEnabled) {
			style.imports.push('../style/components/wee.code.less');
		}

		if (style.vars.formEnabled) {
			style.imports.push('../style/components/wee.forms.less');
		}

		if (style.vars.tableEnabled) {
			style.imports.push('../style/components/wee.tables.less');
		}

		if (style.vars.printEnabled) {
			style.print = '@media print {\n';
			style.print += '@import (inline) "../style/wee.print.less";\n';
			style.print += '@import "../../css/custom/print.less"; // Customizations\n';
			style.print += '}';
		}

		// Responsive
		if (styleFeatures.responsive) {
			if (styleFeatures.responsive.enable) {
				style.vars.responsiveEnabled = true;
				style.vars.responsiveOffset = styleFeatures.responsive.offset + 'px';
				style.vars.ieBreakpoint = project.style.legacy.breakpoint;

				// Breakpoints
				var breakpoints = styleFeatures.responsive.breakpoints;

				style.vars.mobileLandscapeWidth = (breakpoints.mobileLandscape !== false) ?
					breakpoints.mobileLandscape + 'px' :
					false;
				style.vars.tabletPortraitWidth = (breakpoints.tabletPortrait !== false) ?
					breakpoints.tabletPortrait + 'px' :
					false;
				style.vars.desktopSmallWidth = (breakpoints.desktopSmall !== false) ?
					breakpoints.desktopSmall + 'px' :
					false;
				style.vars.desktopMediumWidth = (breakpoints.desktopMedium !== false) ?
					breakpoints.desktopMedium + 'px' :
					false;
				style.vars.desktopLargeWidth = (breakpoints.desktopLarge !== false) ?
					breakpoints.desktopLarge + 'px' :
					false;

				style.responsive = '@import "../style/wee.responsive.less";';
			} else {
				style.vars.responsiveEnabled = false;
				style.vars.ieBreakpoint = 1;
			}
		}

		// Compile custom
		for (var target in project.style.compile) {
			var taskName = target.replace(/\./g, '-') + '-style',
				sources = project.style.compile[target],
				src = [];

			if (sources instanceof Array) {
				for (var source in sources) {
					src.push(Wee.buildPath(sources[source], style.rootPath));
				}
			} else {
				src = Wee.buildPath(sources, style.rootPath);
			}

			// Merge watch config
			grunt.config.set('watch.' + taskName, {
				files: src,
				tasks: [
					'less:' + taskName
				]
			});

			// Create Less task
			grunt.config.set('less.' + taskName, {
				files: [{
					dest: Wee.buildPath(target, style.rootPath),
					src: src
				}]
			});

			// Run task
			grunt.task.run('less:' + taskName);
		}
	});

	// Parse script config
	grunt.registerTask('configScript', function() {
		// Set global config
		script = {
			rootPath: config.assetPath + '/js',
			files: [],
			project: {}
		};

		// Core Wee scripts
		if (project.script.core.enable) {
			var features = project.script.core.features,
				weeScriptRoot = config.assetPath + '/wee/script/'

			script.files.push(weeScriptRoot + 'wee.js');

			if (features.assets) {
				script.files.push(weeScriptRoot + 'wee.assets.js');
			}

			if (features.data) {
				script.files.push(weeScriptRoot + 'wee.data.js');
			}

			if (features.dom) {
				script.files.push(weeScriptRoot + 'wee.dom.js');
			}

			if (features.events) {
				script.files.push(weeScriptRoot + 'wee.events.js');
			}

			if (features.routes) {
				script.files.push(weeScriptRoot + 'wee.routes.js');
			}

			if (features.screen) {
				if (! features.events) {
					grunt.fail.warn('Event module required for screen functions');
				}

				script.files.push(weeScriptRoot + 'wee.screen.js');
			}

			if (features.chain) {
				script.files.push(weeScriptRoot + 'wee.chain.js');
			}
		}

		// Build/vendor directory scripts
		script.files.push(script.rootPath + '/build/vendor/**/*.js');

		// Remaining build directory scripts
		script.files.push(script.rootPath + '/build/**/*.js');

		// Project.config file build files
		project.script.build.forEach(function(name) {
			script.files.push(Wee.buildPath(name, script.rootPath));
		});

		// Custom/script.js file
		script.files.push(script.rootPath + '/custom/script.js');

		// Compile custom
		for (var target in project.script.compile) {
			var taskName = target.replace(/\./g, '-') + '-script',
				sources = project.script.compile[target],
				src = [];

			if (sources instanceof Array) {
				for (var source in sources) {
					src.push(Wee.buildPath(sources[source], script.rootPath));
				}
			} else {
				src = Wee.buildPath(sources, script.rootPath);
			}

			// Merge watch config
			grunt.config.set('watch.' + taskName, {
				files: src,
				tasks: [
					'uglify:' + taskName
				]
			});

			// Create uglify task
			grunt.config.set('uglify.' + taskName, {
				files: [{
					dest: Wee.buildPath(target, script.rootPath),
					src: src
				}]
			});

			// Run task
			grunt.task.run('uglify:' + taskName);
		}

		// Source maps
		if (project.script.sourceMaps == true) {
			grunt.config.set('uglify.options.sourceMap', true);
			grunt.config.set('uglify.options.sourceMapName', function(dest) {
				dest = dest.replace(script.rootPath + '/', '')
					.replace(/\//g, '-')
					.replace('.min.js', '');

				return config.paths.sourceMaps + dest + '.js.map';
			});
		}
	});

	// Initialize modules
	grunt.registerTask('configModules', function() {
		// Set global config
		modules = {
			rootPath: config.assetPath + '/modules'
		};

		// Loop through module directories
		var children = fs.readdirSync(modules.rootPath);

		for (var directory in children) {
			var name = children[directory],
				path = modules.rootPath + '/' + children[directory];

			// Ensure the child is a directory
			if (fs.statSync(path).isDirectory()) {
				var configFile = path + '/module.json';

				// Ensure the module.json file exists
				if (grunt.file.exists(configFile)) {
					// Get module config
					var module = JSON.parse(grunt.file.read(configFile));

					// Setup module config
					var moduleScript = [
							path + '/module/script/*.js'
						],
						vars = JSON.parse(JSON.stringify(style.vars)),
						less = grunt.file.read(config.assetPath + '/wee/style/wee.module.less');

					// Set module name
					vars.moduleName = name;

					// Template variables
					var inject = '@import "../../modules/' + name + '/module/style/screen.less";\n',
						responsive = '';

					// Build additional style
					if (module.style && module.style.build) {
						module.style.build.forEach(function(path) {
							inject += '@import "../../modules/' + name + '/' + path + '";\n';
						});
					}

					// Build additional script
					if (module.script && module.script.build) {
						module.script.build.forEach(function(scriptPath) {
							moduleScript.push(Wee.concatPaths(path, scriptPath));
						});
					}

					// Determine if module is responsive
					if (project.style.core.responsive.enable) {
						if (fs.existsSync(path + '/module/style/breakpoints')) {
							vars.responsive = true;

							responsive += ' \
								.mobile-landscape () when not (@mobileLandscapeWidth = false) { \
									@import "../../modules/' + name + '/module/style/breakpoints/mobile-landscape.less"; \
								} \
								.tablet-portrait () when not (@tabletPortraitWidth = false) { \
									@import "../../modules/' + name + '/module/style/breakpoints/tablet-portrait.less"; \
								} \
								.desktop-small () when not (@desktopSmallWidth = false) { \
									@import "../../modules/' + name + '/module/style/breakpoints/desktop-small.less"; \
								} \
								.desktop-medium () when not (@desktopMediumWidth = false) { \
									@import "../../modules/' + name + '/module/style/breakpoints/desktop-medium.less"; \
								} \
								.desktop-large () when not (@desktopLargeWidth = false) { \
									@import "../../modules/' + name + '/module/style/breakpoints/desktop-large.less"; \
								} \
							';
						}

						if (fs.existsSync(path + '/css/breakpoints')) {
							vars.responsive = true;

							responsive += ' \
								.mobile-landscape () when not (@mobileLandscapeWidth = false) { \
									@import "../../modules/' + name + '/css/breakpoints/mobile-landscape.less"; \
								} \
								.tablet-portrait () when not (@tabletPortraitWidth = false) { \
									@import "../../modules/' + name + '/css/breakpoints/tablet-portrait.less"; \
								} \
								.desktop-small () when not (@desktopSmallWidth = false) { \
									@import "../../modules/' + name + '/css/breakpoints/desktop-small.less"; \
								} \
								.desktop-medium () when not (@desktopMediumWidth = false) { \
									@import "../../modules/' + name + '/css/breakpoints/desktop-medium.less"; \
								} \
								.desktop-large () when not (@desktopLargeWidth = false) { \
									@import "../../modules/' + name + '/css/breakpoints/desktop-large.less"; \
								} \
							';
						}
					}

					less = grunt.template.process(less, {
						data: {
							imports: inject,
							responsive: responsive
						}
					});

					// Write temporary file
					grunt.file.write(config.tempPath + '/' + name + '.less', less);

					// Create module style compile task
					var dest = (module.autoload === true) ?
							config.assetPath + '/wee/temp/' + name + '.css' :
							path + '/screen.min.css',
						obj = {};

					obj[name] = {
						files: [{
							dest: dest,
							src: config.tempPath + '/' + name + '.less'
						}],
						options: {
							modifyVars: vars
						}
					};

					grunt.config.merge({
						less: obj
					});

					style.tasks.push('less:' + name);

					// Configure style watch task
					grunt.config.set('watch.' + name + '-style', {
						files: path + '/**/*.less',
						tasks: [
							'less:' + name,
							'concat:style'
						]
					});

					if (module.autoload === true) {
						// Push temporary style to concat list
						style.concat.push(dest);

						// Add script paths to uglify
						script.files = script.files.concat(moduleScript);
					} else {
						// Create module style compile task
						obj[name] = {
							files: [{
								dest: path + '/script.min.js',
								src: moduleScript
							}]
						};

						grunt.config.merge({
							uglify: obj
						});

						// Configure script watch task
						grunt.config.set('watch.' + name + '-script', {
							files: moduleScript,
							tasks: [
								'uglify:' + name
							]
						});

						// Execute script task
						grunt.task.run('uglify:' + name);
					}
				} else {
					grunt.fail.fatal('Missing module.json for ' + name + ' module.');
				}
			}
		}
	});

	// Bind project config to Grunt tasks
	grunt.registerTask('bindConfig', function() {
		config.style = {
			rootPath: style.rootPath,
			vars: style.vars,
			concat: style.concat
		};

		config.script = {
			rootPath: script.rootPath,
			files: script.files
		}

		config.modules = {
			rootPath: modules.rootPath
		}

		// Set global config
		grunt.config.set('config', config);
	});

	// Build project style
	grunt.registerTask('buildStyle', function() {
		// Inject imports into core
		var weeStyleRoot = config.assetPath + '/wee/style',
			less = grunt.file.read(weeStyleRoot + '/wee.less'),
			imports = [],
			inject = '';

		// Build directory style
		var buildFiles = Wee.getFiles(style.rootPath + '/build', ['less', 'css']);

		buildFiles.forEach(function(name) {
			name = '../..' + name.replace(config.assetPath, '');

			if (name.indexOf('/vendor/' !== -1)) {
				imports.unshift(name);
			} else {
				imports.push(name);
			}
		});

		// Build configured
		var buildArray = [
			'<%= config.style.rootPath %>/build/**/*.{css,less}'
		];

		project.style.build.forEach(function(name) {
			name = Wee.buildPath(name, style.rootPath);

			buildArray.push(name);

			name = '../..' + name.replace(config.assetPath, '');

			imports.push(name);
		});

		grunt.config.set('watch.styleBuildUpdate.files', buildArray);

		// Merge imports into global imports
		style.imports = style.imports.concat(imports);

		// Process template
		style.imports.forEach(function(val) {
			if (Wee.getExtension(val) == 'css') {
				inject += '@import (inline) "' + val + '";\n';
			} else {
				inject += '@import "' + val + '";\n';
			}
		});

		less = grunt.template.process(less, {
			data: {
				imports: inject,
				print: style.print,
				responsive: style.responsive
			}
		});

		// Write temporary file
		grunt.file.write(config.tempPath + '/wee.less', less);

		// Add to concat array
		style.concat.push(config.tempPath + '/wee.css');

		// Compile lib style
		grunt.task.run('less:lib');

		// Compile primary style
		grunt.task.run('less:core');

		// Compile additional style groups independently
		style.tasks.forEach(function(task) {
			grunt.task.run(task);
		});

		// Concatenate group output as necessary
		grunt.task.run('concat:style');
	});

	// Build legacy project style
	grunt.registerTask('buildLegacy', function() {
		legacy = project.style.legacy;

		// Ensure legacy support is enabled
		if (legacy.enable == true) {
			var styleRoot = config.assetPath + '/css',
				weeStyleRoot = config.assetPath + '/wee/style',
				legacyBuild = [weeStyleRoot + '/wee.legacy.less'];

			legacy.dest = Wee.buildPath(legacy.dest, styleRoot);

			// Build configured
			for (var i = 0; i < legacy.build.length; i++) {
				legacyBuild.push(Wee.buildPath(legacy.build[i], styleRoot));
			}

			// Less config update
			grunt.config.merge({
				less: {
					legacy: {
						files: [{
							dest: legacy.dest,
							src: legacyBuild
						}],
						options: {
							modifyVars: style.vars
						}
					}
				}
			});

			// Exclude legacy files from primary watch task
			var watchedFiles = grunt.config.get('watch.styleCore.files');

			grunt.config.merge({
				watch: {
					styleCore: {
						files: watchedFiles.concat(legacyBuild.map(function(val) {
							return '!' + val;
						}))
					}
				}
			});

			if (legacy.watch == true) {
				var watchedTasks = grunt.config.get('watch.styleCore.tasks');

				// Recompile legacy on update of core file
				grunt.config.merge({
					watch: {
						styleCore: {
							tasks: watchedTasks.concat([
								'less:legacy',
								'convertRem',
								'notify:legacy'
							])
						}
					}
				});

				// Watch for legacy updates
				grunt.config.merge({
					watch: {
						legacy: {
							files: [
								legacyBuild
							],
							tasks: [
								'less:legacy',
								'convertRem',
								'notify:legacy'
							]
						}
					}
				});
			}

			grunt.task.run('less:legacy');
			grunt.task.run('convertRem');
			grunt.task.run('notify:legacy');
		}
	});

	// Convert REMs to pixels for legacy support
	grunt.registerTask('convertRem', function() {
		var css = grunt.file.read(legacy.dest),
			rootSize = legacy.rootSize,
			rootValue = 10;

		// Determine root value for unit conversion
		if (rootSize.indexOf('%') !== -1) {
			rootValue = (rootSize.replace('%', '') / 100) * 16;
		} else if (rootSize.indexOf('px') !== -1) {
			rootValue = rootSize.replace('px', '');
		} else if (rootSize.indexOf('em') !== -1) {
			rootValue = rootSize.replace('em', '');
		} else if (rootSize.indexOf('pt') !== -1) {
			rootValue = rootSize.replace('pt', '');
		}

		var output = css.replace(/(-?[.\d]+)rem/gi, function(str, match) {
			return (match * rootValue) + 'px';
		});

		grunt.file.write(legacy.dest, output);
	});

	// Configure live reloading
	grunt.registerTask('reload', function() {
		var reloadConfig = project.server.reload;

		if (reloadConfig.enable == true) {
			var reloadWatch = reloadConfig.watch,
				reloadExtensions = reloadWatch.extensions.join(),
				reloadPaths = [];

			if (reloadWatch.extensions.length > 1) {
				reloadExtensions = '{' + reloadExtensions + '}';
			}

			// Add user-defined paths
			for (var i = 0; i < reloadWatch.paths.length; i++) {
				reloadPaths.push(reloadWatch.paths[i] + '/**/*.' + reloadExtensions);
			}

			// Add root to watchlist
			if (reloadWatch.root == true) {
				reloadPaths.push(project.paths.root + '/**/*.' + reloadExtensions);
			}

			// Bind BrowserSync watchlist
			reloadPaths.push(config.assetPath + '/**/*.{min.css,min.js,gif,jpg,png,svg}');

			grunt.config.set('browserSync.bsFiles.src', reloadPaths);
		}
	});

	// Proxy local server
	grunt.registerTask('proxy', function() {
		var serverConfig = project.server;

		if (serverConfig.tasks.local.proxy !== false) {
			grunt.config.set('browserSync.options.proxy', serverConfig.tasks.local.proxy);
			grunt.config.set('browserSync.options.port', serverConfig.port);

			// Override auto-detected IP address
			if (serverConfig.host !== 'auto') {
				grunt.config.set('browserSync.options.host', serverConfig.host);
			}
		}

		if (serverConfig.ghostMode === false) {
			grunt.config.set('browserSync.options.ghostMode', serverConfig.ghostMode);
		}

		grunt.task.run('browserSync');
	});

	// Configure testing server
	grunt.registerTask('server', function() {
		var serverConfig = project.server,
			staticConfig = serverConfig.tasks.static;

		grunt.config.set('browserSync.options.server', {
			baseDir: project.paths.root,
		});

		grunt.config.set('browserSync.options.port', serverConfig.port);

		if (serverConfig.ghostMode === false) {
			grunt.config.set('browserSync.options.ghostMode', serverConfig.ghostMode);
		}

		// HTTPS mode
		if (staticConfig.https === true) {
			grunt.config.set('browserSync.options.https', staticConfig.https);
		}

		// Override auto-detected IP address
		if (serverConfig.host !== 'auto') {
			grunt.config.set('browserSync.options.host', serverConfig.host);
		}

		grunt.task.run('browserSync');
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-notify');

	// Build
	grunt.registerTask('default', [
		'init',
		'cleanup',
		'configStyle',
		'configScript',
		'configModules',
		'bindConfig',
		'buildStyle',
		'buildLegacy',
		'uglify:core',
		'uglify:lib',
		'imagemin'
	]);

	// Build + Watch
	grunt.registerTask('local', [
		'default',
		'reload',
		'proxy',
		'watch'
	]);

	// Build + Server + Open + Watch
	grunt.registerTask('static', [
		'default',
		'reload',
		'server',
		'watch'
	]);
};