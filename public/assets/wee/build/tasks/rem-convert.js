module.exports = function(grunt) {
	grunt.registerTask('convertRem', function() {
		var css = grunt.file.read(legacy.dest),
			rootSize = legacy.rootSize,
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

		grunt.file.write(legacy.dest, output);
	});
};