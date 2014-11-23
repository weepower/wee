module.exports = function(grunt) {
	grunt.registerTask('server', function() {
		var serverConfig = project.server,
			staticConfig = serverConfig.tasks.static;

		grunt.config.set('browserSync.options.server', {
			baseDir: project.paths.root
		});

		grunt.config.set('browserSync.options.port', serverConfig.port);

		if (serverConfig.ghostMode === false) {
			grunt.config.set('browserSync.options.ghostMode', serverConfig.ghostMode);
		}

		// HTTPS mode
		if (staticConfig.https === true) {
			grunt.config.set('browserSync.options.https', staticConfig.https);
		}

		// Override auto-detected IP address
		if (serverConfig.host !== 'auto') {
			grunt.config.set('browserSync.options.host', serverConfig.host);
		}

		grunt.task.run('browserSync');
	});
};