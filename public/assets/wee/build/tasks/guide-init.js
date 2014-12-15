/* global config, project */

module.exports = function(grunt) {
	grunt.registerTask('initGuide', function() {
		var Wee = require('../core.js'),
			guide = project.style.guide;

		if (guide.watch === true) {
			// Set paths
			var configPath = Wee.buildPath(guide.config, config.assetPath),
				settings = JSON.parse(grunt.file.read(configPath)),
				rootPath = configPath.split('/'),
				compile = settings.compile,
				defaultTemplate = settings.defaults.template,
				watchFiles = [];

			rootPath.pop();

			rootPath = rootPath.join('/');

			Object.keys(compile).forEach(function(key) {
				var block = compile[key],
					patterns = block.patterns,
					root = block.root || '',
					template = Wee.buildPath(block.template || defaultTemplate, rootPath);

				watchFiles.push(template);

				patterns.forEach(function(name) {
					var path = Wee.buildPath(root + name, rootPath);

					watchFiles.push(path);
				});
			});

			watchFiles = Wee.$unique(watchFiles);

			if (watchFiles.length > 0) {
				// Watch for guide updates
				grunt.config.merge({
					watch: {
						guideBuild: {
							files: watchFiles,
							tasks: [
								'buildGuide'
							]
						}
					}
				});
			}
		}

		grunt.task.run('buildGuide');
	});
};