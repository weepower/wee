/* global config, project */

module.exports = function(grunt) {
	grunt.registerTask('configGuide', function() {
		var guide = project.style.guide;

		if (guide.enable === true) {
			if (guide.watch === true) {
				var Wee = require('../core.js'),
					configPath = Wee.buildPath(guide.config, config.assetPath);

				// Watch for guide config updates
				grunt.config.merge({
					watch: {
						guideInit: {
							files: [
								configPath
							],
							tasks: [
								'initGuide'
							]
						}
					}
				});
			}

			grunt.task.run('initGuide');
		}
	});
};