/* global config, path, project, script */

module.exports = function(grunt) {
	grunt.registerTask('configScript', function() {
		// Set global config
		script = {
			rootPath: path.join(config.assetPath, '/js'),
			files: [],
			project: {}
		};

		// Core Wee scripts
		if (project.script.core.enable === true) {
			var features = project.script.core.features,
				weeScriptRoot = path.join(config.assetPath, '/wee/script/');

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

			if (features.view === true) {
				script.files.push(weeScriptRoot + 'wee.view.js');

				if (features.chain === true) {
					script.files.push(weeScriptRoot + 'chain/wee.chain.view.js');
				}
			}
		}

		// Build/vendor directory scripts
		script.files.push(script.rootPath + '/build/vendor/**/*.js');

		// Remaining build directory scripts
		script.files.push(script.rootPath + '/build/**/*.js');

		// Project.config file build files
		project.script.build.forEach(function(name) {
			script.files.push(Wee.buildPath(script.rootPath, name));
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
					src.push(Wee.buildPath(script.rootPath, sources[source]));
				}
			} else {
				src = Wee.buildPath(script.rootPath, sources);
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
					dest: Wee.buildPath(script.rootPath, target),
					src: src
				}]
			});

			// Run task
			grunt.task.run('uglify:' + taskName);
		}

		// Configure source maps
		if (project.script.sourceMaps === true) {
			grunt.config.set('uglify.options.sourceMap', true);
			grunt.config.set('uglify.options.sourceMapName', function(dest) {
				var root = path.normalize(script.rootPath)
				dest = path.normalize(dest)
					.replace(root, '')
					.replace(/^\\|\//, '')
					.replace(/\\|\//g, '-')
					.replace('.min.js', '');

				return path.join(config.paths.sourceMaps, dest + '.js.map');
			});
		}
	});
};