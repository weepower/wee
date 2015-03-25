/* global module, require, version */

module.exports = function(grunt) {
	var https = require('https');

	grunt.registerTask('checkUpdates', function() {
		var done = this.async();

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

					Wee.notify({
						title: 'Update Available',
						message: 'Check the console for details'
					});

					grunt.log.ok('A new ' + type + ' is available to ' + data.version + ' from ' + version + '.');
					grunt.log.ok('Read the release notes at https://github.com/weepower/wee/releases before updating.');
				} else {
					grunt.log.ok('You are running the latest version ' + version + '.');
				}

				done();
			});
		}).on('error', function() {
			grunt.log.error('Error trying to access the repository at https://github.com/weepower/wee.');
			done();
		});
	});
};