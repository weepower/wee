/* global config, global, legacyConvert, module, moduleLegacy, path, project */

module.exports = function(grunt) {
	grunt.registerTask('buildLegacy', function() {
		var legacy = project.style.legacy;
		global.legacy = legacy;

		// Ensure legacy support is enabled
		if (legacy.enable === true) {
			var styleRoot = config.paths.css,
				legacyTemp = config.paths.temp + 'wee.legacy.less',
				less = grunt.file.read('wee/style/wee.legacy.less'),
				dest = Wee.buildPath(styleRoot, legacy.dest),
				imports = [];

			// Build configured
			legacy.build.forEach(function(name) {
				var filePath = '@{sourcePath}' + '/' + name.replace(config.paths.source, '');

				if (path.extname(filePath) == '.css') {
					imports.push('@import (inline) "' + filePath + '";');
				} else {
					imports.push('@import "' + filePath + '";');
				}
			});

			less = less.replace('{{imports}}', imports.join('\n'))
				.replace('{{moduleLegacy}}', moduleLegacy.join('\n'));

			// Write temporary file
			grunt.file.write(legacyTemp, less);

			// Less config update
			grunt.config.set('less.legacy', {
				files: [{
					dest: dest,
					src: legacyTemp
				}],
				options: {
					modifyVars: config.style.vars
				}
			});

			// Push to conversion array
			legacyConvert.core = dest;

			if (legacy.watch === true) {
				var watchedTasks = grunt.config.get('watch.styleCore.tasks');

				// Recompile legacy on update of core file
				grunt.config.set('watch.styleCore.tasks', watchedTasks.concat([
					'less:legacy',
					'convertLegacy:core',
					'notify:legacy'
				]));
			}

			// Compile custom
			if (legacy.compile) {
				for (var target in legacy.compile) {
					var taskName = target.replace(/\./g, '-') + '-legacy-style',
						sources = Wee.$toArray(legacy.compile[target]),
						files = [];
					dest = Wee.buildPath(config.paths.css, target);

					for (var legacyPath in sources) {
						files.push(Wee.buildPath(config.paths.css, sources[legacyPath]));
					}

					// Create Less task
					grunt.config.set('less.' + taskName, {
						files: [{
							dest: dest,
							src: files
						}],
						options: {
							globalVars: {
								weePath: '"' + config.paths.weeTemp + '"'
							}
						}
					});

					if (legacy.watch === true) {
						// Merge watch config
						grunt.config.set('watch.' + taskName, {
							files: files,
							tasks: [
								'less:' + taskName,
								'convertLegacy:' + taskName
							]
						});

						// Push style task
						config.style.tasks.push('less:' + taskName);
					}

					// Push to conversion array
					legacyConvert[taskName] = dest;

					grunt.task.run('less:' + taskName);
					grunt.task.run('convertLegacy:' + taskName);
				}
			}

			grunt.task.run('less:legacy');
			grunt.task.run('convertLegacy:core');
			grunt.task.run('notify:legacy');
		}
	});
};