// Wee (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY

/* global __dirname, global */

(function() {
	'use strict';

	module.exports = function(grunt) {
		var buildPath = './node_modules/wee-core/build/';

		global.rootPath = __dirname;
		global.configPath = './' + (grunt.option('config') || 'wee.json');

		require(buildPath + 'config.js')(grunt);
		grunt.loadTasks(buildPath + 'tasks');
	};
})();