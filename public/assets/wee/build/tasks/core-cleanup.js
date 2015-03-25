/* global config, fs, module, project */

module.exports = function(grunt) {
	grunt.registerTask('cleanup', function() {
		// Remove temp files
		fs.readdirSync(config.paths.temp).forEach(function(file) {
			if (file.charAt(0) !== '.') {
				fs.unlinkSync(config.paths.temp + file);
			}
		});

		// Remove JavaScript source maps
		if (project.script.sourceMaps === true) {
			fs.readdirSync(config.paths.maps).forEach(function(file) {
				fs.unlinkSync(config.paths.maps + file);
			});
		}
	});
};