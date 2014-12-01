/* global config, project, style */

module.exports = function(grunt) {
	grunt.registerTask('buildStyle', function() {
		var Wee = require('../core.js');

		// Inject imports into core
		var weeStyleRoot = config.assetPath + '/wee/style',
			less = grunt.file.read(weeStyleRoot + '/wee.less'),
			imports = [],
			inject = '';

		// Build directory style
		var buildFiles = Wee.getFiles(style.rootPath + '/build', ['less', 'css']);

		buildFiles.forEach(function(name) {
			name = '../..' + name.replace(config.assetPath, '');

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
			name = Wee.buildPath(name, style.rootPath);

			buildArray.push(name);

			name = '../..' + name.replace(config.assetPath, '');

			imports.push(name);
		});

		grunt.config.set('watch.styleBuildUpdate.files', buildArray);

		// Merge imports into global imports
		style.imports = style.imports.concat(imports);

		// Process template
		style.imports.forEach(function(val) {
			if (Wee.getExtension(val) == 'css') {
				inject += '@import (inline) "' + val + '";\n';
			} else {
				inject += '@import "' + val + '";\n';
			}
		});

		less = grunt.template.process(less, {
			data: {
				imports: inject,
				print: style.print,
				responsive: style.responsive
			}
		});

		// Write temporary file
		grunt.file.write(config.tempPath + '/wee.less', less);

		// Add to concat array
		style.concat.push(config.tempPath + '/wee.css');

		// Compile lib style
		grunt.task.run('less:lib');

		// Compile primary style
		grunt.task.run('less:core');

		// Compile additional style groups independently
		style.tasks.forEach(function(task) {
			grunt.task.run(task);
		});

		// Concatenate group output as necessary
		grunt.task.run('concat:style');
	});
};