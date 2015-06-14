/* global config, module, path, project */

module.exports = function(grunt) {
	grunt.registerTask('buildStyle', function() {
		var less = grunt.file.read(config.paths.wee + 'style/wee.less'),
			imports = [],
			inject = '',
			buildFiles = grunt.file.expand({
				cwd: config.paths.css + '/build'
			}, [
				'**/*.css',
				'**/*.less'
			]);

		buildFiles.forEach(function(name) {
			name = '@{sourcePath}/build/' + name.replace(path.normalize(config.paths.assets), '');

			if (name.indexOf('/vendor/') !== -1) {
				imports.unshift(name);
			} else {
				imports.push(name);
			}
		});

		// Build configured
		var buildArray = [
			'<%= config.paths.css %>/build/**/*.{css,less}'
		];

		project.style.build.forEach(function(name) {
			name = Wee.buildPath(config.paths.css, name);

			buildArray.push(name);

			name = '@{sourcePath}/' + name.replace(path.normalize(config.paths.assets), '');

			imports.push(name);
		});

		grunt.config.set('watch.styleBuildUpdate.files', buildArray);

		// Merge imports into global imports
		config.style.imports = config.style.imports.concat(imports);

		// Process template
		config.style.imports.forEach(function(val) {
			if (path.extname(val) == '.css') {
				inject += '@import (inline) "' + val + '";\n';
			} else {
				inject += '@import "' + val + '";\n';
			}
		});

		less = less.replace('{{imports}}', inject)
			.replace('{{print}}', config.style.print)
			.replace('{{responsive}}', config.style.responsive);

		// Write temporary file
		grunt.file.write(config.paths.weeTemp, less);

		// Add to concat array
		config.style.concat.push(config.paths.temp + 'wee.css');

		// Run Grunt tasks
		var tasks = [
			'less:lib',
			'less:core'
		];

		tasks = tasks.concat(config.style.tasks);
		tasks.push('concat:style');

		grunt.task.run(tasks);
	});
};