/* global module, path, project */

module.exports = function(grunt) {
	grunt.registerTask('cachePartials', function(task) {
		var build = Wee.$toArray(project.generator.build),
			configPath = build[task],
			json = grunt.file.readJSON(configPath),
			staticRoot = path.dirname(configPath),
			partialRoot = path.join(staticRoot, json.config.paths.partials),
			partials = grunt.file.expand({
				cwd: partialRoot
			}, '**/*.html');

		partials.forEach(function(name) {
			var partial = path.join(partialRoot, name),
				content = grunt.file.read(partial);

			Wee.view.addPartial(path.basename(name, '.html'), content);
		});
	});
};