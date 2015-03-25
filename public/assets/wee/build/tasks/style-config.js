/* global config, module, project */

module.exports = function(grunt) {
	grunt.registerTask('configStyle', function() {
		var features = project.style.core;

		// Core style features
		config.style.vars = {
			buttonEnabled: features.buttons === true,
			codeEnabled: features.code === true,
			formEnabled: features.forms === true,
			tableEnabled: features.tables === true,
			printEnabled: features.print === true
		};

		if (config.style.vars.codeEnabled) {
			config.style.imports.push('../style/components/wee.code.less');
		}

		if (config.style.vars.formEnabled) {
			config.style.imports.push('../style/components/wee.forms.less');
		}

		if (config.style.vars.buttonEnabled) {
			config.style.imports.push('../style/components/wee.buttons.less');
		}

		if (config.style.vars.tableEnabled) {
			config.style.imports.push('../style/components/wee.tables.less');
		}

		if (config.style.vars.printEnabled) {
			config.style.print = '@media print {\n';
			config.style.print += '@import (inline) "../style/wee.print.less";\n';
			config.style.print += '@import (optional) "../../css/custom/print.less";\n';
			config.style.print += '}';
		}

		// Responsive
		if (features.responsive && features.responsive.enable === true) {
			config.style.vars.responsiveEnabled = true;
			config.style.vars.responsiveOffset = (features.responsive.offset || 0) + 'px';
			config.style.vars.ieBreakpoint = project.style.legacy.breakpoint || 4;

			// Breakpoints
			var breakpoints = features.responsive.breakpoints;

			config.style.vars.mobileLandscapeWidth = breakpoints.mobileLandscape !== false ?
				breakpoints.mobileLandscape + 'px' :
				false;
			config.style.vars.tabletPortraitWidth = breakpoints.tabletPortrait !== false ?
				breakpoints.tabletPortrait + 'px' :
				false;
			config.style.vars.desktopSmallWidth = breakpoints.desktopSmall !== false ?
				breakpoints.desktopSmall + 'px' :
				false;
			config.style.vars.desktopMediumWidth = breakpoints.desktopMedium !== false ?
				breakpoints.desktopMedium + 'px' :
				false;
			config.style.vars.desktopLargeWidth = breakpoints.desktopLarge !== false ?
				breakpoints.desktopLarge + 'px' :
				false;

			config.style.responsive = '@import "../style/wee.responsive.less";';
		} else {
			config.style.vars.responsiveEnabled = false;
			config.style.vars.ieBreakpoint = 1;
		}

		// Compile custom
		for (var target in project.style.compile) {
			var taskName = target.replace(/\./g, '-') + '-style',
				sources = Wee.$toArray(project.style.compile[target]),
				files = [];

			for (var sourcePath in sources) {
				files.push(Wee.buildPath(config.paths.css, sources[sourcePath]));
			}

			// Set watch config
			grunt.config.set('watch.' + taskName, {
				files: files,
				tasks: [
					'less:' + taskName
				]
			});

			// Create Less task
			grunt.config.set('less.' + taskName, {
				files: [{
					dest: Wee.buildPath(config.paths.css, target),
					src: files
				}],
				options: {
					globalVars: {
						weePath: '"' + config.paths.weeTemp + '"'
					}
				}
			});

			// Push style task
			config.style.tasks.push('less:' + taskName);
		}
	});
};