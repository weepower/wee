/* global module, project, server */

module.exports = function(grunt) {
	grunt.registerTask('server', function() {
		var staticConfig = project.server.tasks.static;

		// Server root
		server.server = project.paths.root;

		// Secure mode
		if (staticConfig.https === true) {
			server.https = true;
		}

		// Override auto-detected IP address
		if (project.server.host !== 'auto') {
			server.host = project.server.host;
		}
	});
};