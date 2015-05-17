/* global module, project, server, Wee */

module.exports = function(grunt) {
	grunt.registerTask('server', function() {
		var staticConfig = project.server.tasks.static;

		// Server root
		server.server = project.paths.root;

		// Secure mode
		if (staticConfig.https === true) {
			server.https = true;
		}

		// Server asset injection
		if (project.server.inject && project.server.inject.length) {
			var inject = [];

			project.server.inject.forEach(function(file) {
				if (file.slice(-3) == '.js') {
					inject.push('<script src="' + file + '"></script>');
					Wee.serverWatch(file);
				} else if (file.slice(-4) == '.css') {
					inject.push('<link rel="stylesheet" href="' + file + '">');
					Wee.serverWatch(file);
				}
			});

			server.middleware = function(req, res, next) {
				if (req.headers.accept.match(/^text\/html/)) {
					var _write = res.write;

					res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

					res.write = function(data) {
						_write.call(res, data.toString().replace('</head>', inject.join('') + '</head>'));
					};
				}

				next();
			};
		}

		// Override auto-detected IP address
		if (project.server.host !== 'auto') {
			server.host = project.server.host;
		}
	});
};