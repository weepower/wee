module.exports = function(grunt) {
	grunt.registerTask('buildGuide', function() {
		var Wee = require('../core.js'),
			guide = project.style.guide;

		if (guide.enable == true) {
			var yaml = require('js-yaml'),
				reg = /^(-{3}(?:\n|\r)([\w\W]+?)-{3})?([\w\W]*)*/;

			// Set paths
			var templatePath = Wee.buildPath(guide.paths.template, config.assetPath),
				targetPath = Wee.buildPath(guide.paths.target, config.assetPath),
				patternPath = Wee.buildPath(guide.paths.patterns, config.assetPath);

			// Get files
			var template = grunt.file.read(templatePath),
				patterns = Wee.getFiles(patternPath, 'html');

			// Set base data
			var data = {
				name: project.name,
				description: project.description,
				guide: {

				}
			};

			patterns.forEach(function(name, i) {
				var pattern = grunt.file.read(name),
					results = reg.exec(pattern),
					root = data.guide,
					obj = {
						name: name.replace(/^.*[\\\/]/, '').split('.')[0]
					};

				// Determine path
				var relative = name.replace(patternPath + '/', '').split('/'),
					len = relative.length;

				if (len > 1) {
					for (var x = 0; x < (len - 1); x++) {
						var level = relative[x];

						// Create nested array if it doesn't exist
						if (root[level] === undefined) {
							root[level] = [];
						}

						// Set current root to nested level
						root = root[level];
					}
				} else {
					// Create root array if it doesn't exist
					if (root['root'] === undefined) {
						root['root'] = [];
					}

					root = root['root'];
				}

				// If the YAML exists then extend it into the default
				if (results[2] !== undefined) {
					var front = yaml.load(results[2]);
					obj = Wee.$extend(obj, front);
				}

				obj.markup = results[3];
				obj.$i = i;

				root.unshift(obj);
			});

			var parsed = Wee.parse(template, data);

			grunt.file.write(targetPath, parsed);
		}
	});
};