// Wee (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY

/* global __dirname, global, module, require */

(function() {
	'use strict';

	module.exports = function(grunt) {
		global.rootPath = __dirname;
		global.configPath = './' + (grunt.option('config') || 'source/project.json');

		require('./node_modules/wee-core/build/config.js')(grunt);
		grunt.loadTasks('./node_modules/wee-core/build/tasks');
	};
})();