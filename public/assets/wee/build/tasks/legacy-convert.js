/* global legacy, legacyConvert */

module.exports = function(grunt) {
	grunt.registerTask('convertLegacy', function(task) {
		var dest = legacyConvert[task],
			css = grunt.file.read(dest);

		// Convert rem units to px
		var rootSize = legacy.rootSize,
			rootValue = 10;

		// Determine root value for unit conversion
		if (rootSize.indexOf('%') !== -1) {
			rootValue = (rootSize.replace('%', '') / 100) * 16;
		} else if (rootSize.indexOf('px') !== -1) {
			rootValue = rootSize.replace('px', '');
		} else if (rootSize.indexOf('em') !== -1) {
			rootValue = rootSize.replace('em', '');
		} else if (rootSize.indexOf('pt') !== -1) {
			rootValue = rootSize.replace('pt', '');
		}

		var output = css.replace(/(-?[.\d]+)rem/gi, function(str, match) {
			return (match * rootValue) + 'px';
		});

		// Convert opacity to filter
		output = output.replace(/(-?[.\d]+)rem/gi, function(str, match) {
			return 'filter:alpha(opacity=' + Math.round((match * 100) * 100 / 100) + ');';
		});

		grunt.file.write(dest, output);
	});
};