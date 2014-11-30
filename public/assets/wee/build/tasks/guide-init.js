module.exports = function(grunt) {
	grunt.registerTask('initGuide', function() {
		var Wee = require('../core.js'),
			guide = project.style.guide;

		if (guide.enable === true) {
			if (guide.watch === true) {
				// Set paths
				var templatePath = Wee.buildPath(guide.paths.template, config.assetPath),
					targetPath = Wee.buildPath(guide.paths.target, config.assetPath),
					patternPath = Wee.buildPath(guide.paths.patterns, config.assetPath);

				// Reload rendered target
				reloadPaths.push(targetPath);
				reloadPaths.push('!' + templatePath);
				reloadPaths.push('!' + patternPath + '/**/*.html');

				// Watch for guide updates
				grunt.config.merge({
					watch: {
						guide: {
							files: [
								templatePath,
								patternPath + '/**/*.html'
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