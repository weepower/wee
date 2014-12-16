/* global config */

module.exports = function(grunt) {
	grunt.registerTask('runValidation', function() {
		var scriptPath = config.assetPath + '/js',
			scripts = Wee.getFiles(scriptPath, 'js');

		// Validate scripts
		scripts.forEach(function(filepath) {
			if (filepath.indexOf('.min.js') == -1) {
				Wee.validate(config, grunt, filepath);
			}
		});
	});
};