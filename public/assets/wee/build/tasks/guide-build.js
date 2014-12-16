/* global browserSync, config, project */

module.exports = function(grunt) {
	grunt.registerTask('buildGuide', function() {
		var yaml = require('js-yaml'),
			marked = require('marked'),
			guide = project.style.guide,
			reg = /^(-{3}(?:\n|\r)([\w\W]+?)-{3})?([\w\W]*)*/,
			configPath = Wee.buildPath(guide.config, config.assetPath),
			settings = JSON.parse(grunt.file.read(configPath)),
			rootPath = configPath.split('/'),
			compile = settings.compile,
			defaultTemplate = settings.defaults.template,
			data = {
				name: project.name,
				description: project.description,
				compile: compile,
				patterns: []
			};

		rootPath.pop();
		rootPath = rootPath.join('/');

		Object.keys(compile).forEach(function(key) {
			var block = compile[key],
				patterns = block.patterns,
				root = block.root || '',
				template = grunt.file.read(Wee.buildPath(block.template || defaultTemplate, rootPath)),
				target = Wee.buildPath(block.target, rootPath);

			data.patterns = [];

			patterns.forEach(function(name, i) {
				var pattern = '';

				if (name.substring(0, 5) == 'https') {
				// 	var https = require('https');
				//
				// 	https.get(name, function(response) {
				// 		var body = '';
				//
				// 		response.on('data', function(d) {
				// 			body += d;
				// 		});
				//
				// 		response.on('end', function() {
				// 			pattern = body;
				// 			done();
				// 		});
				// 	});
				} else if (name.substring(0, 4) == 'http') {
				// 	var http = require('http');
				//
				// 	http.get(name, function(response) {
				// 		var body = '';
				//
				// 		response.on('data', function(d) {
				// 			body += d;
				// 		});
				//
				// 		response.on('end', function() {
				// 			pattern = body;
				// 			console.log(body);
				// 			done();
				// 		});
				// 	});
				} else if (name.substring(0, 2) == '//') {
				// 	pattern = '';
				} else {
					var path = Wee.buildPath(root + name, rootPath);

					pattern = grunt.file.read(path);
				}

				var obj = {
					name: name.replace(/^.*[\\\/]/, '').split('.')[0],
					blocks: []
				};

				if (pattern.substring(0, 3) == '---') {
					var results = reg.exec(pattern);

					// If the YAML exists then extend it into the default
					if (results[2] !== undefined) {
						var front = yaml.load(results[2]);
						obj = Wee.$extend(obj, front);
					}

					obj.markup = results[3].trim();
				} else {
					obj.markup = pattern;
				}

				var codeReg = /`{3}[a-z]+[\s\S]*?`{3}/g,
					codeBlocks = obj.markup.match(codeReg);

				if (codeBlocks && codeBlocks.length > 0) {
					codeBlocks.forEach(function(block) {
						var segs = block.match(/`{3}(.*)+/)[0].replace('```', '').split('|'),
							code = block.replace(/`{3}(.+)?/g, ''),
							lang = segs[0] || 'html';

						if (segs.indexOf('hideBlock') == -1) {
							obj.blocks.push({
								lang: lang,
								code: code.trim()
							});
						}

						if (segs.indexOf('hide') !== -1) {
							obj.markup = obj.markup.replace(block, '');
						} else {
							obj.markup = obj.markup.replace(block, code);
						}
					});
				}

				obj.markup = marked(obj.markup);

				obj.$i = i;

				data.patterns.push(obj);
			});

			grunt.file.write(target, Wee.parse(template, data));
		});

		browserSync.reload();
	});
};