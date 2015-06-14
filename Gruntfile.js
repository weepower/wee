// Wee (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY

/* global __dirname, global, module, require */

(function() {
	'use strict';

	module.exports = function(grunt) {
		global.rootPath = __dirname;
		global.configPath = './' + (grunt.option('config') || 'wee.json');

		require('./wee/build/config.js')(grunt);
		grunt.loadTasks('wee/build/tasks');
	};
})();