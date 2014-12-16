/* global project, server */

module.exports = function(grunt) {
	grunt.registerTask('server', function() {
		var serverConfig = project.server,
			staticConfig = serverConfig.tasks.static;

		// Server root
		server.server = project.paths.root;

		// HTTPS mode
		if (staticConfig.https === true) {
			server.https = true;
		}

		// Override auto-detected IP address
		if (serverConfig.host !== 'auto') {
			server.host = serverConfig.host;
		}
	});
};