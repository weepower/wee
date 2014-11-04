module.exports = function(grunt) {
	grunt.registerTask('init', function() {
		var configFile = './' + (grunt.option('config') || 'project.json');

		project = JSON.parse(grunt.file.read(configFile));

		// Reset config object
		config = {
			paths: {}
		};

		// Set project file paths
		config.filePath = configFile;

		config.assetPath = (project.paths.root !== '') ?
			project.paths.root + '/' + project.paths.assets :
			project.assets;

		config.paths.root = './' + project.paths.root;
		config.paths.sourceMaps = config.assetPath + '/wee/maps/';
		config.tempPath = config.assetPath + '/wee/temp';
	});
};