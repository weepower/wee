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

					if (grunt.option('install')) {
						// Download latest tag
						var fs = require('fs'),
							dest = data.version + '.zip',
							url = 'https://github.com/weepower/wee/archive/' + dest,
							file = fs.createWriteStream(dest);

						https.get(url, function(response) {
							response.pipe(file);

							file.on('finish', function() {
								file.close(function() {
									console.log('Success');
								});
							});
						}).on('error', function() {
							fs.unlink(dest);
							grunt.log.error('Unable to download latest version.');
						});

						// Extract to temp directory


						// Replace Wee directory
						// Replace Gruntfile.js
						// Replace package.json
						// Remove temp directory

						// Run npm_update
						var exec = require('child_process').exec;

						exec('npm update', function() {
							grunt.log.ok('NPM modules have been updated.');
						});

						grunt.log.ok('Wee has been successfully updated.');
						grunt.log.ok('Run one of the Grunt build tasks to update your compiled code.');
					} else {
						grunt.log.ok('A new ' + type + ' is available.');
						grunt.log.ok('Run "grunt update --install" to update to version ' + data.version + ' from ' + version + '.');
						grunt.log.ok('Be sure to READ THE CHANGELOG (https://github.com/weepower/wee/blob/master/CHANGELOG.md) before updating.');

						// Check modules
					}
				} else {
					grunt.log.ok('You are running the latest version of Wee, ' + version + '.');
				}

				done();
			});
		}).on('error', function(e) {
			grunt.log.error(e);

			done();
		});
	});
};