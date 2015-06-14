/* global config, module, path */

module.exports = function(grunt) {
	grunt.registerTask('runValidation', function() {
		var rootPath = config.paths.assets + '/js',
			scripts = grunt.file.expand({
				cwd: rootPath,
				filter: function(src) {
					return src.indexOf('/polyfill') == -1 &&
						src.indexOf('.min.js') == -1 &&
						src.indexOf('/vendor') == -1;
				}
			}, '**/*.js');

		// Validate scripts
		scripts.forEach(function(scriptPath) {
			var script = path.join(rootPath, scriptPath);
			Wee.validate(config, grunt, script);
		});
	});
};