module.exports = function(grunt) {
	grunt.registerTask('initGuide', function() {
		var Wee = require('../core.js'),
			guide = project.style.guide;

		if (guide.enable == true) {
			if (guide.watch == true) {
				// Set paths
				var templatePath = Wee.buildPath(guide.paths.template, config.assetPath),
					patternPath = Wee.buildPath(guide.paths.patterns, config.assetPath);

				// Reload patterns
				reloadPaths.push(patternPath + '/**/*.html');

				// Watch for guide updates
				grunt.config.merge({
					watch: {
						guide: {
							files: [
								templatePath
							],
							tasks: [
								'buildGuide'
							]
						}
					}
				});
			}

			grunt.task.run('buildGuide');
		}
	});
};