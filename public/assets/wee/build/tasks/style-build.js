/* global config, path, project, style */

module.exports = function(grunt) {
	grunt.registerTask('buildStyle', function() {
		var weeStyleRoot = config.assetPath + '/wee/style',
			less = grunt.file.read(weeStyleRoot + '/wee.less'),
			imports = [],
			inject = '',
			buildFiles = grunt.file.expand({
				cwd: style.rootPath + '/build'
			}, [
				'**/*.css',
				'**/*.less'
			]);

		buildFiles.forEach(function(name) {
			name = '../../css/build/' + name.replace(path.normalize(config.assetPath), '');

			if (name.indexOf('/vendor/') !== -1) {
				imports.unshift(name);
			} else {
				imports.push(name);
			}
		});

		// Build configured
		var buildArray = [
			'<%= config.style.rootPath %>/build/**/*.{css,less}'
		];

		project.style.build.forEach(function(name) {
			name = Wee.buildPath(style.rootPath, name);

			buildArray.push(name);

			name = '../../' + name.replace(path.normalize(config.assetPath), '');

			imports.push(name);
		});

		grunt.config.set('watch.styleBuildUpdate.files', buildArray);

		// Merge imports into global imports
		style.imports = style.imports.concat(imports);

		// Process template
		style.imports.forEach(function(val) {
			if (path.extname(val) == '.css') {
				inject += '@import (inline) "' + val + '";\n';
			} else {
				inject += '@import "' + val + '";\n';
			}
		});

		less = less.replace('{{imports}}', inject)
			.replace('{{print}}', style.print)
			.replace('{{responsive}}', style.responsive);

		// Write temporary file
		grunt.file.write(config.tempPath + '/wee.less', less);

		// Add to concat array
		style.concat.push(config.tempPath + '/wee.css');

		// Run Grunt tasks
		var tasks = [
			'less:lib',
			'less:core'
		];

		tasks = tasks.concat(style.tasks);

		tasks.push('concat:style');

		grunt.task.run(tasks);
	});
};