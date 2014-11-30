/* global config, project, style */

module.exports = function(grunt) {
	grunt.registerTask('configStyle', function() {
		var Wee = require('../core.js');

		// Set global config
		style = {
			rootPath: config.assetPath + '/css',
			files: [],
			project: {},
			imports: [],
			tasks: [],
			concat: [],
			print: '',
			responsive: ''
		};

		var styleFeatures = project.style.core;

		// Core style features
		style.vars = {
			buttonEnabled: (styleFeatures.buttons === true) ? true : false,
			codeEnabled: (styleFeatures.code === true) ? true : false,
			formEnabled: (styleFeatures.forms === true) ? true : false,
			tableEnabled: (styleFeatures.tables === true) ? true : false,
			printEnabled: (styleFeatures.print === true) ? true : false
		}

		if (style.vars.buttonEnabled) {
			style.imports.push('../style/components/wee.buttons.less');
		}

		if (style.vars.codeEnabled) {
			style.imports.push('../style/components/wee.code.less');
		}

		if (style.vars.formEnabled) {
			style.imports.push('../style/components/wee.forms.less');
		}

		if (style.vars.tableEnabled) {
			style.imports.push('../style/components/wee.tables.less');
		}

		if (style.vars.printEnabled) {
			style.print = '@media print {\n';
			style.print += '@import (inline) "../style/wee.print.less";\n';
			style.print += '@import "../../css/custom/print.less"; // Customizations\n';
			style.print += '}';
		}

		// Responsive
		if (styleFeatures.responsive) {
			if (styleFeatures.responsive.enable) {
				style.vars.responsiveEnabled = true;
				style.vars.responsiveOffset = styleFeatures.responsive.offset + 'px';
				style.vars.ieBreakpoint = project.style.legacy.breakpoint;

				// Breakpoints
				var breakpoints = styleFeatures.responsive.breakpoints;

				style.vars.mobileLandscapeWidth = (breakpoints.mobileLandscape !== false) ?
					breakpoints.mobileLandscape + 'px' :
					false;
				style.vars.tabletPortraitWidth = (breakpoints.tabletPortrait !== false) ?
					breakpoints.tabletPortrait + 'px' :
					false;
				style.vars.desktopSmallWidth = (breakpoints.desktopSmall !== false) ?
					breakpoints.desktopSmall + 'px' :
					false;
				style.vars.desktopMediumWidth = (breakpoints.desktopMedium !== false) ?
					breakpoints.desktopMedium + 'px' :
					false;
				style.vars.desktopLargeWidth = (breakpoints.desktopLarge !== false) ?
					breakpoints.desktopLarge + 'px' :
					false;

				style.responsive = '@import "../style/wee.responsive.less";';
			} else {
				style.vars.responsiveEnabled = false;
				style.vars.ieBreakpoint = 1;
			}
		}

		// Compile custom
		for (var target in project.style.compile) {
			var taskName = target.replace(/\./g, '-') + '-style',
				sources = project.style.compile[target],
				src = [];

			if (sources instanceof Array) {
				for (var source in sources) {
					src.push(Wee.buildPath(sources[source], style.rootPath));
				}
			} else {
				src = Wee.buildPath(sources, style.rootPath);
			}

			// Merge watch config
			grunt.config.set('watch.' + taskName, {
				files: src,
				tasks: [
					'less:' + taskName
				]
			});

			// Create Less task
			grunt.config.set('less.' + taskName, {
				files: [{
					dest: Wee.buildPath(target, style.rootPath),
					src: src
				}]
			});

			// Push task
			style.tasks.push('less:' + taskName);
		}
	});
};