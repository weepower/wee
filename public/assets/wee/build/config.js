/* global config, global, path, project */

// -------------------------------------
// Load Dependencies
// -------------------------------------

var LessCssClean = require('less-plugin-clean-css');

global.fs = require('fs');
global.browserSync = require('browser-sync');
global.Wee = require('../script/wee.js').Wee;
global.path = require('path');
global.jshint = require('jshint').JSHINT;
global.JSCS = require('jscs');

Wee.fn.extend({
	// Build root or relative path
	buildPath: function(path, file) {
		return file.substring(0, 2) == './' ? file : global.path.join(path, file);
	},
	// Append minified extension
	getMinifiedExtension: function(dest, src, ext) {
		var dir = src.substring(0, src.lastIndexOf('/')),
			filename = src.substring(src.lastIndexOf('/'), src.length);
		filename = filename.substring(0, filename.lastIndexOf('.'));

		return dest + '/' + dir + filename + ext;
	},
	validate: function(config, grunt, filepath) {
		var ext = path.extname(filepath);

		if (filepath.indexOf('temp') == -1 &&
			filepath.indexOf('/vendor') == -1) {
			if (ext == '.js') {
				var js = grunt.file.read(filepath),
					errors = [],
					total = 0;

				if (project.script.validate.jshint) {
					// JSHint
					var jshintConfig = grunt.file.readJSON(
						project.script.validate.jshint === true ?
							config.assetPath + '/wee/script/.jshintrc' :
							project.script.validate.jshint
					);

					if (! jshint(js, jshintConfig)) {
						var out = jshint.data();
						errors = out.errors,
						total = errors.length;

						grunt.log.header('Script validation errors found');

						grunt.log.error('JSHint error' +
							((total > 1) ? 's' : '') + ' in ' + filepath + '.');

						errors.forEach(function(message) {
							Wee.logError(grunt, message.line  + ':' + message.character, message.reason, message.evidence);
						});

						grunt.log.writeln();
						grunt.log.writeln();

						this.notify({
							title: 'JSHint Validation Error',
							message: 'Check console for error details'
						}, 'error');
					}
				}

				if (project.script.validate.jscs) {
					// JSCS
					var jscsConfig = grunt.file.readJSON(
							project.script.validate.jscs === true ?
							config.assetPath + '/wee/script/.jscs.json' :
							project.script.validate.jscs
						),
						checker = new JSCS();

					checker.registerDefaultRules();
					checker.configure(jscsConfig);

					errors = checker.checkString(js);

					var errorList = errors.getErrorList();
					total = errorList.length;

					if (total > 0) {
						grunt.log.error('JSCS error' +
							((total > 1) ? 's' : '') + ' in ' + filepath + '.');

						errorList.forEach(function(message) {
							Wee.logError(grunt, message.line  + ':' + message.column, message.rule, message.message);
						});

						this.notify({
							title: 'JSCS Validation Error',
							message: 'Check console for error details'
						}, 'error');
					}
				}
			}
		}
	},
	logError: function(grunt, pos, msg, details) {
		grunt.log.writeln('['.cyan + pos + '] '.cyan + msg + ' ' + (details || '').magenta);
	},
	notify: function(data, type) {
		var notifier = require('node-notifier'),
			iconPath = config.assetPath + '/wee/build/img/';
		type = type || 'notice';

		if (type == 'error') {
			console.error(data.message);
			data.icon = iconPath + 'error.png';
		} else {
			console.log(data.message);
			data.icon = iconPath + 'notice.png';
		}

		notifier.notify(data);
	}
});

// -------------------------------------
// Configure Grunt
// -------------------------------------

module.exports = function(grunt) {
	global.config = {};
	global.style = {};
	global.script = {};
	global.server = {};
	global.modules = {};
	global.legacy = {};
	global.reloadPaths = [];
	global.legacyBuild = [];
	global.version = '2.1.0';

	grunt.initConfig({
		less: {
			options: {
				modifyVars: '<%= config.style.vars %>',
				strictMath: true,
				paths: [
					'<%= config.style.rootPath %>'
				],
				plugins: [
					new LessCssClean()
				]
			},
			core: {
				files: [
					{
						dest: '<%= config.tempPath %>/wee.css',
						src: '<%= config.tempPath %>/wee.less'
					}
				]
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
					{
						removeViewBox: false
					},
					{
						convertPathData: false
					}
				],
				svgoPlugins: [
					{
						removeViewBox: false
					}
				]
			},
			core: {
				files: [
					{
						expand: true,
						cwd: '<%= config.assetPath %>',
						dest: '<%= config.assetPath %>',
						src: [
							'**/*.{gif,jpg,png,svg}'
						]
					}
				]
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
					'newer:imagemin',
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
					'<%= config.assetPath %>/wee/style/**/*.less',
					'<%= config.style.rootPath %>/custom/**/*.less'
				],
				tasks: [
					'less:core',
					'concat:style'
				]
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
			styleBuild: {
				files: [
					'<%= config.style.rootPath %>/build/**/*.{css,less}'
				],
				tasks: [
					'buildStyle',
					'notify:style'
				],
				options: {
					event: [
						'added',
						'deleted'
					]
				}
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
					event: [
						'changed'
					]
				}
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
					'<%= config.configPath %>',
					'<%= config.modules.rootPath %>/*/module.json'
				],
				tasks: [
					'default',
					'notify:project'
				]
			}
		}
	});

	// Watch for changes to validate
	if (project.script.validate.watch) {
		grunt.event.on('watch', function(action, filepath) {
			if (action !== 'deleted') {
				Wee.validate(config, grunt, filepath);
			}
		});
	}

	// -------------------------------------
	// Load Plugins
	// -------------------------------------

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-newer');

	// -----------------------------------
	// Grunt Tasks
	// -----------------------------------

	grunt.registerTask('default', [
		'init',
		'cleanup',
		'configStyle',
		'configScript',
		'configModules',
		'configGenerator',
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
		'proxy',
		'sync',
		'watch'
	]);

	// Build + Server + Open + Watch
	grunt.registerTask('static', [
		'default',
		'server',
		'sync',
		'watch'
	]);

	// Validate
	grunt.registerTask('validate', [
		'init',
		'runValidation'
	]);

	// Generate Site
	grunt.registerTask('generate', [
		'init',
		'configGenerator'
	]);

	// Update
	grunt.registerTask('update', [
		'checkUpdates'
	]);
};