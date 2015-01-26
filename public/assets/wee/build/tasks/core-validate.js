/* global config */

module.exports = function(grunt) {
	grunt.registerTask('runValidation', function() {
		var scriptPath = config.assetPath + '/js',
			scripts = grunt.file.expand({
				cwd: scriptPath,
				filter: function(src) {
					return src.indexOf('/polyfill') == -1 &&
						src.indexOf('.min.js') == -1 &&
						src.indexOf('/vendor') == -1;
				}
			}, '**/*.js');

		// Validate scripts
		scripts.forEach(function(path) {
			var script = path.join(scriptPath, path);

			Wee.validate(config, grunt, script);
		});
	});
};