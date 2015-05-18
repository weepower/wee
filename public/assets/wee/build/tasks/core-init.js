/* global config, configPath, global, module, path */

module.exports = function(grunt) {
	grunt.registerTask('init', function() {
		// Reset config object and set core paths
		var project = grunt.file.readJSON(configPath),
			rootPath = project.paths.root,
			assetPath = path.normalize(
				rootPath !== '' ?
					rootPath + '/' + project.paths.assets :
					project.assets
			),
			weePath = assetPath + '/wee/',
			tempPath = weePath + 'temp/';

		global.project = project;

		global.config = {
			path: configPath,
			paths: {
				assets: assetPath,
				css: assetPath + '/css',
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