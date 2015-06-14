/* global config, module, path, project */

module.exports = function(grunt) {
	grunt.registerTask('configScript', function() {
		// Core scripts
		if (project.script.core.enable === true) {
			var features = project.script.core.features,
				weeScriptRoot = 'wee/script/';

			config.script.files.push(weeScriptRoot + 'wee.js');

			// Set global data variables
			if (
				(project.data && Object.keys(project.data).length) ||
				(project.script.data && Object.keys(project.script.data).length)
			) {
				var weeScriptGlobal = config.paths.temp + '/data.js',
					configVars = Wee.$extend(project.data, project.script.data || {}),
					script = 'Wee.$set("global", ' + JSON.stringify(configVars) + ');';

				grunt.file.write(weeScriptGlobal, script);

				config.script.files.push(weeScriptGlobal);
			}

			if (features.chain === true) {
				config.script.files.push(weeScriptRoot + 'wee.chain.js');
			}

			if (features.assets === true) {
				config.script.files.push(weeScriptRoot + 'wee.assets.js');
			}

			if (features.data === true) {
				config.script.files.push(weeScriptRoot + 'wee.data.js');
			}

			if (features.dom === true) {
				config.script.files.push(weeScriptRoot + 'wee.dom.js');

				if (features.chain === true) {
					config.script.files.push(weeScriptRoot + 'chain/wee.chain.dom.js');
				}
			}

			if (features.events === true) {
				config.script.files.push(weeScriptRoot + 'wee.events.js');

				if (features.chain === true) {
					config.script.files.push(weeScriptRoot + 'chain/wee.chain.events.js');
				}
			}

			if (features.routes === true) {
				config.script.files.push(weeScriptRoot + 'wee.routes.js');
			}

			if (features.screen === true) {
				config.script.files.push(weeScriptRoot + 'wee.screen.js');
			}

			if (features.view === true) {
				config.script.files.push(weeScriptRoot + 'wee.view.js');

				if (features.chain === true) {
					config.script.files.push(weeScriptRoot + 'chain/wee.chain.view.js');
				}
			}
		}

		// Build/vendor directory scripts
		config.script.files.push(config.paths.jsSource + '/build/vendor/**/*.js');

		// Remaining build directory scripts
		config.script.files.push(config.paths.jsSource + '/build/**/*.js');

		// Project.config file build files
		project.script.build.forEach(function(name) {
			config.script.files.push(Wee.buildPath(config.paths.jsSource, name));
		});

		// Custom/script.js file
		config.script.files.push(config.paths.jsSource + '/custom/script.js');

		// Compile custom
		for (var target in project.script.compile) {
			var taskName = target.replace(/\./g, '-') + '-script',
				sources = project.script.compile[target],
				src = [];

			if (sources instanceof Array) {
				for (var source in sources) {
					src.push(Wee.buildPath(config.paths.jsSource, sources[source]));
				}
			} else {
				src = Wee.buildPath(config.paths.jsSource, sources);
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
					dest: Wee.buildPath(config.paths.js, target),
					src: src
				}]
			});

			// Run task
			grunt.task.run('uglify:' + taskName);
		}

		// Configure source maps
		if (project.script.sourceMaps === true) {
			grunt.config.set('uglify.options.sourceMap', true);
			grunt.config.set('uglify.options.sourceMapIncludeSources', true);
			grunt.config.set('uglify.options.sourceMapName', function(dest) {
				var scriptRoot = path.normalize(config.paths.js),
					moduleRoot = path.normalize(config.paths.modules);
				dest = path.normalize(dest)
					.replace(scriptRoot, '')
					.replace(moduleRoot, '')
					.replace(/^\\|\//, '')
					.replace(/\\|\//g, '-')
					.replace('.min.js', '');

				return path.join(config.paths.maps, dest + '.js.map');
			});
		}
	});
};