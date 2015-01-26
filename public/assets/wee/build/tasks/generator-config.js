/* global project */

module.exports = function(grunt) {
	grunt.registerTask('configGenerator', function() {
		if (project.generator.enable === true) {
			// Import view library
			require('../../script/wee.view.js');

			// Loop through static site config files
			grunt.file.expand(project.generator.build).forEach(function(src, i) {
				var json = grunt.file.readJSON(src),
					config = json.config;

				// Watch for config updates
				if (config.watch === true) {
					grunt.config.set('watch.initGenerator-' + i, {
						files: src,
						tasks: 'initGenerator:' + i
					});
				}

				// Initialize static site
				grunt.task.run('initGenerator:' + i);
			});
		}
	});
};