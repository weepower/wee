// Wee (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY

/* global __dirname, global, project */

(function() {
	'use strict';

	module.exports = function(grunt) {
		global.rootPath = __dirname;
		global.configPath = './' + (grunt.option('config') || 'project.json');

		global.project = grunt.file.readJSON(global.configPath);

		var assetPath = (project.paths.root !== '') ?
				project.paths.root + '/' + project.paths.assets :
				project.assets,
			buildPath = assetPath + '/wee/build/';

		require('./' + buildPath + 'config.js')(grunt);
		grunt.loadTasks(buildPath + 'tasks');
	};
})();