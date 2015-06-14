/* global legacyConvert, module, project */

module.exports = function(grunt) {
	grunt.registerTask('convertLegacy', function(task) {
		var dest = legacyConvert[task],
			content = grunt.file.read(dest),
			rootSize = project.style.legacy.rootSize,
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

		content = content.replace(/(-?[.\d]+)rem/gi, function(str, match) {
			return (match * rootValue) + 'px';
		}).replace(/opacity:([.\d]+)/gi, function(str, match) {
			return 'filter:alpha(opacity=' + Math.round((match * 100) * 100 / 100) + ')';
		}).replace(/::/g, ':');

		grunt.file.write(dest, content);
	});
};