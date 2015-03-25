/* global module, project, server */

module.exports = function(grunt) {
	grunt.registerTask('proxy', function() {
		if (project.server.tasks.local.proxy !== false) {
			server.proxy = project.server.tasks.local.proxy;

			// Override auto-detected IP address
			if (project.server.host !== 'auto') {
				server.host = project.server.host;
			}
		}

		// Secure mode
		if (project.server.tasks.local.https === true) {
			server.https = true;
		}
	});
};