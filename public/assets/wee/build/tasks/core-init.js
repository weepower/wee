/* global config, configPath, module, path, project */

module.exports = function(grunt) {
	grunt.registerTask('init', function() {
		project = grunt.file.readJSON(configPath);

		// Reset config object and set core paths
		var rootPath = project.paths.root,
			assetPath = path.normalize(
				rootPath !== '' ?
					rootPath + '/' + project.paths.assets :
					project.assets
			),
			weePath = assetPath + '/wee/',
			tempPath = weePath + 'temp/';

		config = {
			path: configPath,
			paths: {
				assets: assetPath,
				css: assetPath +  '/css',
				js: assetPath + '/js',
				modules: assetPath + '/modules',
				root: './' + rootPath,
				maps: weePath + 'maps/',
				temp: tempPath,
				wee: weePath,
				weeTemp: tempPath + 'wee.less'
			},
			script: {
				files: []
			},
			style: {
				concat: [],
				imports: [],
				tasks: [],
				print: '',
				responsive: ''
			}
		};

		grunt.config.set('config', config);
	});
};