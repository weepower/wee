/* global config, modules, script, style */

module.exports = function(grunt) {
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
};