/* global project, server */

module.exports = function(grunt) {
	grunt.registerTask('proxy', function() {
		var serverConfig = project.server,
			localConfig = serverConfig.tasks.local;

		if (serverConfig.tasks.local.proxy !== false) {
			server.proxy = serverConfig.tasks.local.proxy;

			// Override auto-detected IP address
			if (serverConfig.host !== 'auto') {
				server.host = serverConfig.host;
			}
		}

		// HTTPS mode
		if (localConfig.https === true) {
			server.https = true;
		}
	});
};