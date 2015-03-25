/* global __dirname, module, path, project, require */

module.exports = function(grunt) {
	grunt.registerTask('loadExtensions', function(task) {
		var build = Wee.$toArray(project.generator.build),
			configPath = build[task],
			json = grunt.file.readJSON(configPath),
			staticRoot = path.dirname(configPath),
			extensionRoot = path.join(staticRoot, json.config.paths.extensions),
			extensions = grunt.file.expand({
				cwd: extensionRoot
			}, '**/*.js');

		extensions.forEach(function(name) {
			var extension = path.relative(__dirname, path.join(extensionRoot, name));
			delete require.cache[require.resolve(extension)];
			require(extension);
		});
	});
};