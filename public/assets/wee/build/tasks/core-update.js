/* global version */

module.exports = function(grunt) {
	grunt.registerTask('checkUpdates', function() {
		var done = this.async(),
			https = require('https');

		https.get('https://raw.githubusercontent.com/weepower/wee/master/package.json', function(response) {
			var json = '';

			response.on('data', function(chunk) {
				json += chunk;
			});

			response.on('end', function() {
				var data = JSON.parse(json);

				if (version < data.version) {
					var current = version.split('.'),
						update = data.version.split('.'),
						type = 'patch';

					if (update[1] > current[1]) {
						type = 'minor update';
					}

					if (update[0] > current[0]) {
						type = 'major update';
					}

					grunt.log.ok('A new ' + type + ' is available to ' + data.version + ' from ' + version + '.');
					grunt.log.ok('Read the release notes at https://github.com/weepower/wee/releases before updating.');
				} else {
					grunt.log.ok('You are running the latest version ' + version + '.');
				}

				done();
			});
		}).on('error', function(e) {
			grunt.log.error('Error trying to access Wee repository at https://github.com/weepower/wee.');
			done();
		});
	});
};