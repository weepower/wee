// Wee (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY

/* global global, project */

(function() {
	'use strict';

	module.exports = function(grunt) {
		var configFile = './' + (grunt.option('config') || 'project.json');

		global.project = JSON.parse(grunt.file.read(configFile));

		var assetPath = (project.paths.root !== '') ?
				project.paths.root + '/' + project.paths.assets :
				project.assets;


		// ------------------------------------
			// Load Modules
		// ------------------------------------

		if (project.script.validate.jscs) {
			global.jscs = require('jscs');
		}


		// ------------------------------------
			// Load Tasks
		// ------------------------------------

		require('./' + assetPath + '/wee/build/config.js')(grunt);
		grunt.loadTasks(assetPath + '/wee/build/tasks');


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
			'bindConfig',
			'buildStyle',
			'buildLegacy',
			'initGuide',
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

		// Update
		grunt.registerTask('update', [
			'checkUpdates'
		]);

		// Validate
		grunt.registerTask('validate', [
			'init',
			'runValidation'
		]);
	};
})();