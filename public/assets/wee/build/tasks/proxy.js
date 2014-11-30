/* global project */

module.exports = function(grunt) {
	grunt.registerTask('proxy', function() {
		var serverConfig = project.server;

		if (serverConfig.tasks.local.proxy !== false) {
			grunt.config.set('browserSync.options.proxy', serverConfig.tasks.local.proxy);
			grunt.config.set('browserSync.options.port', serverConfig.port);

			// Override auto-detected IP address
			if (serverConfig.host !== 'auto') {
				grunt.config.set('browserSync.options.host', serverConfig.host);
			}
		}

		if (serverConfig.ghostMode === false) {
			grunt.config.set('browserSync.options.ghostMode', serverConfig.ghostMode);
		}

		grunt.task.run('browserSync');
	});
};