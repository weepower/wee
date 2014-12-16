/* global config, fs, project */

module.exports = function(grunt) {
	grunt.registerTask('cleanup', function() {
		// Remove temp files
		fs.readdirSync(config.tempPath).forEach(function(file) {
			if (file.charAt(0) !== '.') {
				fs.unlinkSync(config.tempPath + '/' + file);
			}
		});

		// Remove source maps
		if (project.script.sourceMaps === true) {
			fs.readdirSync(config.paths.sourceMaps).forEach(function(file) {
				fs.unlinkSync(config.paths.sourceMaps + file);
			});
		}
	});
};