/* global config, configPath, global, module, path */

module.exports = function(grunt) {
	grunt.registerTask('init', function() {
		// Reset config object and set core paths
		var project = grunt.file.readJSON(configPath),
			rootPath = project.paths.root,
			sourcePath = project.paths.source,
			assetPath = path.normalize(
				rootPath !== '' ?
					rootPath + '/' + project.paths.assets :
					project.assets
			),
			tempPath = 'wee/temp/';

		global.project = project;

		global.config = {
			path: configPath,
			paths: {
				source: sourcePath,
				assets: assetPath,
				cssSource: sourcePath + '/css',
				css: assetPath + '/css',
				jsSource: sourcePath + '/js',
				js: assetPath + '/js',
				modulesSource: sourcePath + '/modules',
				modules: assetPath + '/modules',
				root: './' + rootPath,
				maps: assetPath + '/js/maps/',
				temp: tempPath,
				wee: 'wee/',
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