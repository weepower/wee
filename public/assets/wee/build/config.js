/* global config, global, project */

if (project.script.validate.jshint) {
	global.jshint = require('jshint').JSHINT;
}

if (project.script.validate.jscs) {
	global.jscs = require('jscs');
}

module.exports = function(grunt) {
	global.config = {};
	global.style = {};
	global.script = {};
	global.modules = {};
	global.legacy = {};
	global.reloadPaths = [];
	global.legacyBuild = [];
	global.version = '2.1.0';

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
					'concat:style',
					'notify:style'
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

	if (global.project.script.validate.watch || global.project.style.validate.watch) {
		grunt.event.on('watch', function(action, filepath) {
			if (action !== 'deleted') {
				Wee.validate(config, grunt, filepath);
			}
		});
	}

	// -------------------------------------
	// Load Plugins
	// -------------------------------------

	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-notify');

	// -----------------------------------
	// Grunt Tasks
	// -----------------------------------

	grunt.registerTask('default', [
		'init',
		'cleanup',
		'configStyle',
		'configScript',
		'configModules',
		'configGuide',
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

	// Validate
	grunt.registerTask('validate', [
		'init',
		'runValidation'
	]);

	// Update
	grunt.registerTask('update', [
		'checkUpdates'
	]);
};