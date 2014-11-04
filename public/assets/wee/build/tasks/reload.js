module.exports = function(grunt) {
	grunt.registerTask('reload', function() {
		var reloadConfig = project.server.reload;

		if (reloadConfig.enable == true) {
			var reloadWatch = reloadConfig.watch,
				reloadExtensions = reloadWatch.extensions.join();

			if (reloadWatch.extensions.length > 1) {
				reloadExtensions = '{' + reloadExtensions + '}';
			}

			// Add user-defined paths
			for (var i = 0; i < reloadWatch.paths.length; i++) {
				reloadPaths.push(reloadWatch.paths[i] + '/**/*.' + reloadExtensions);
			}

			// Add root to watchlist
			if (reloadWatch.root == true) {
				reloadPaths.push(project.paths.root + '/**/*.' + reloadExtensions);
			}

			// Bind BrowserSync watchlist
			reloadPaths.push(config.assetPath + '/**/*.{min.css,min.js,gif,jpg,png,svg}');

			grunt.config.set('browserSync.bsFiles.src', reloadPaths);
		}
	});
};