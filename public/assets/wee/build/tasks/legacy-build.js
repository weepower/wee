/* global config, legacy, legacyBuild, legacyConvert, moduleResponsive, path, project, style */

module.exports = function(grunt) {
	grunt.registerTask('buildLegacy', function() {
		legacy = project.style.legacy;

		// Ensure legacy support is enabled
		if (legacy.enable === true) {
			var styleRoot = config.assetPath + '/css',
				weeStyleRoot = config.assetPath + '/wee/style',
				legacyTemp = config.tempPath + '/wee.legacy.less',
				less = grunt.file.read(weeStyleRoot + '/wee.legacy.less'),
				legacyImports = [],
				inject = '',
				i = 0;

			legacy.dest = Wee.buildPath(styleRoot, legacy.dest);

			// Build configured
			legacy.build.forEach(function(name) {
				legacyImports.push('../../' + Wee.buildPath(styleRoot, name).replace(config.assetPath, ''));
			});

			if (legacyImports.length > 0) {
				// Process template
				legacyImports.forEach(function(val) {
					if (path.extname(val) == '.css') {
						inject += '@import (inline) "' + val + '";\n';
					} else {
						inject += '@import "' + val + '";\n';
					}
				});
			}

			less = less.replace('{{imports}}', inject)
				.replace('{{moduleResponsive}}', moduleResponsive.join('\n'));

			// Write temporary file
			grunt.file.write(legacyTemp, less);

			// Less config update
			grunt.config.merge({
				less: {
					legacy: {
						files: [{
							dest: legacy.dest,
							src: legacyTemp
						}],
						options: {
							modifyVars: style.vars
						}
					}
				}
			});

			// Push to conversion array
			legacyConvert.core = legacy.dest;

			// Exclude legacy files from primary watch task
			grunt.config.merge({
				watch: {
					styleCore: {
						files: [
							'!' + legacyTemp
						]
					}
				}
			});

			if (legacy.watch === true) {
				var watchedTasks = grunt.config.get('watch.styleCore.tasks');

				// Recompile legacy on update of core file
				grunt.config.merge({
					watch: {
						styleCore: {
							tasks: watchedTasks.concat([
								'less:legacy',
								'convertLegacy:core',
								'notify:legacy'
							])
						}
					}
				});

				// Watch for legacy updates
				grunt.config.merge({
					watch: {
						legacy: {
							files: [
								legacyBuild
							],
							tasks: [
								'less:legacy',
								'convertLegacy:core',
								'notify:legacy'
							]
						}
					}
				});
			}

			// Compile custom
			if (legacy.compile) {
				for (var target in legacy.compile) {
					var taskName = target.replace(/\./g, '-') + '-legacy-style',
						dest = Wee.buildPath(style.rootPath, target),
						sources = Wee.$toArray(legacy.compile[target]),
						files = [];

					for (var legacyPath in sources) {
						files.push(Wee.buildPath(style.rootPath, sources[legacyPath]));
					}

					// Create Less task
					grunt.config.set('less.' + taskName, {
						files: [{
							dest: dest,
							src: files
						}],
						options: {
							globalVars: {
								weePath: '"' + config.tempPath + '/wee.less"'
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
						style.tasks.push('less:' + taskName);
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