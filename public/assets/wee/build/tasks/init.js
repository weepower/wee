/* global config, global, project */

module.exports = function(grunt) {
	grunt.registerTask('init', function() {
		global.project = grunt.file.readJSON(global.configPath);

		// Reset config object
		config = {
			paths: {}
		};

		// Set project file paths
		config.configPath = configPath;

		config.assetPath = (project.paths.root !== '') ?
			project.paths.root + '/' + project.paths.assets :
			project.assets;

		config.paths.root = './' + project.paths.root;
		config.paths.sourceMaps = config.assetPath + '/wee/maps/';
		config.tempPath = config.assetPath + '/wee/temp';
	});
};