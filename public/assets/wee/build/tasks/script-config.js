/* global config, project, script */

module.exports = function(grunt) {
	grunt.registerTask('configScript', function() {
		var Wee = require('../core.js');

		// Set global config
		script = {
			rootPath: config.assetPath + '/js',
			files: [],
			project: {}
		};

		// Core Wee scripts
		if (project.script.core.enable === true) {
			var features = project.script.core.features,
				weeScriptRoot = config.assetPath + '/wee/script/'

			// Primary base script
			script.files.push(weeScriptRoot + 'wee.js');

			if (features.chain === true) {
				script.files.push(weeScriptRoot + 'wee.chain.js');
			}

			if (features.assets === true) {
				script.files.push(weeScriptRoot + 'wee.assets.js');
			}

			if (features.data === true) {
				script.files.push(weeScriptRoot + 'wee.data.js');

				if (features.chain === true) {
					script.files.push(weeScriptRoot + 'chain/wee.chain.data.js');
				}
			}

			if (features.dom === true) {
				script.files.push(weeScriptRoot + 'wee.dom.js');

				if (features.chain === true) {
					script.files.push(weeScriptRoot + 'chain/wee.chain.dom.js');
				}
			}

			if (features.events === true) {
				script.files.push(weeScriptRoot + 'wee.events.js');

				if (features.chain === true) {
					script.files.push(weeScriptRoot + 'chain/wee.chain.events.js');
				}
			}

			if (features.routes === true) {
				script.files.push(weeScriptRoot + 'wee.routes.js');
			}

			if (features.screen === true) {
				script.files.push(weeScriptRoot + 'wee.screen.js');
			}
		}

		// Build/vendor directory scripts
		script.files.push(script.rootPath + '/build/vendor/**/*.js');

		// Remaining build directory scripts
		script.files.push(script.rootPath + '/build/**/*.js');

		// Project.config file build files
		project.script.build.forEach(function(name) {
			script.files.push(Wee.buildPath(name, script.rootPath));
		});

		// Custom/script.js file
		script.files.push(script.rootPath + '/custom/script.js');

		// Compile custom
		for (var target in project.script.compile) {
			var taskName = target.replace(/\./g, '-') + '-script',
				sources = project.script.compile[target],
				src = [];

			if (sources instanceof Array) {
				for (var source in sources) {
					src.push(Wee.buildPath(sources[source], script.rootPath));
				}
			} else {
				src = Wee.buildPath(sources, script.rootPath);
			}

			// Merge watch config
			grunt.config.set('watch.' + taskName, {
				files: src,
				tasks: [
					'uglify:' + taskName
				]
			});

			// Create uglify task
			grunt.config.set('uglify.' + taskName, {
				files: [{
					dest: Wee.buildPath(target, script.rootPath),
					src: src
				}]
			});

			// Run task
			grunt.task.run('uglify:' + taskName);
		}

		// Source maps
		if (project.script.sourceMaps === true) {
			grunt.config.set('uglify.options.sourceMap', true);
			grunt.config.set('uglify.options.sourceMapName', function(dest) {
				dest = dest.replace(script.rootPath + '/', '')
					.replace(/\//g, '-')
					.replace('.min.js', '');

				return config.paths.sourceMaps + dest + '.js.map';
			});
		}
	});
};