module.exports = function(grunt) {
	grunt.registerTask('buildLegacy', function() {
		var Wee = require('../core.js');

		legacy = project.style.legacy;

		// Ensure legacy support is enabled
		if (legacy.enable == true) {
			var styleRoot = config.assetPath + '/css',
				weeStyleRoot = config.assetPath + '/wee/style',
				legacyTemp = config.tempPath + '/wee.legacy.less',
				less = grunt.file.read(weeStyleRoot + '/wee.legacy.less'),
				legacyImports = [],
				inject = '';

			legacy.dest = Wee.buildPath(legacy.dest, styleRoot);

			// Build configured
			for (var i = 0; i < legacy.build.length; i++) {
				legacyImports.push('../..' + Wee.buildPath(legacy.build[i], styleRoot).replace(config.assetPath, ''));
			}

			if (legacyImports.length > 0) {
				// Process template
				legacyImports.forEach(function(val) {
					if (Wee.getExtension(val) == 'css') {
						inject += '@import (inline) "' + val + '";\n';
					} else {
						inject += '@import "' + val + '";\n';
					}
				});
			}

			less = grunt.template.process(less, {
				data: {
					imports: inject
				}
			});

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

			// Exclude legacy files from primary watch task
			var watchedFiles = grunt.config.get('watch.styleCore.files');

			grunt.config.merge({
				watch: {
					styleCore: {
						files: [
							'!' + legacyTemp
						]
					}
				}
			});

			if (legacy.watch == true) {
				var watchedTasks = grunt.config.get('watch.styleCore.tasks');

				// Recompile legacy on update of core file
				grunt.config.merge({
					watch: {
						styleCore: {
							tasks: watchedTasks.concat([
								'less:legacy',
								'convertRem',
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
								'convertRem',
								'notify:legacy'
							]
						}
					}
				});
			}

			grunt.task.run('less:legacy');
			grunt.task.run('convertRem');
			grunt.task.run('notify:legacy');
		}
	});
};