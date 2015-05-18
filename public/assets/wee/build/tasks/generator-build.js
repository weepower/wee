/* global browserSync, config, module, path, project */

module.exports = function(grunt) {
	var fs = require('fs'),
		yaml = require('js-yaml'),
		Remarkable = require('remarkable');

	grunt.registerTask('buildGenerator', function(task) {
		var scope = this,
			build = Wee.$toArray(project.generator.build),
			configPath = build[task],
			json = grunt.file.readJSON(configPath),
			siteConfig = json.config,
			staticRoot = path.dirname(configPath),
			site = Wee.$extend(json.data, {
				config: config,
				name: json.name,
				description: json.description,
				time: new Date(),
				sections: json.sections
			}),
			errors = 0;

		// Setup CommonMark parser
		var md = new Remarkable({
			html: true,
			typographer: siteConfig.enhanceTypography || false
		});

		// Merge in environment data
		var env = grunt.option('env') || 'default';

		if (json.env[env]) {
			site = Wee.$extend(site, json.env[env]);
			site.env = env;
		}

		// Recursive function for processing site sections
		var processSection = function(context, parent) {
			var keys = Object.keys(context);

			// Loop though sections in current context
			keys.forEach(function(key, keyIndex) {
				var block = context[key],
					root = block.contentRoot || '',
					template = grunt.file.read(Wee.buildPath(staticRoot, siteConfig.paths.templates + '/' + block.template + '.html')),
					content = block.content ? grunt.file.expand({
						cwd: path.join(staticRoot, root)
					}, block.content) : [],
					data = {
						content: [],
						site: site
					},
					single = false;

				Wee.$toArray(block.target).forEach(function(target) {
					target = path.join(staticRoot, target);

					// Target writing function
					var writeTarget = function(target, data) {
						// Add parent reference
						if (parent) {
							data.parent = parent;
						}

						// Create target directory
						var dir = target.substring(0, target.lastIndexOf('/'));

						try {
							grunt.file.mkdir(dir);
						} catch (e) {
							Wee.notify({
								title: 'Generator Error',
								message: 'Error creating "' + dir + '" directory'
							}, 'error');
						}

						// Render template
						var output = Wee.view.render(template, data);

						// Minify rendered output
						if (siteConfig.minify === true) {
							try {
								var minify = require('html-minifier').minify;

								output = minify(output, {
									collapseWhitespace: true,
									removeComments: true
								});
							} catch (e) {
								Wee.notify({
									title: 'Generator Error',
									message: 'Error minifying "' + target + '"'
								}, 'error');
							}
						}

						var done;

						if (grunt.cli.tasks[0] == 'generate') {
							done = scope.async();
						}

						// Write output to target file
						fs.writeFile(target, output, function(err) {
							if (err) {
								Wee.notify({
									title: 'Generator Error',
									message: 'Error writing to "' + target + '"'
								}, 'error');

								errors++;
							}

							if (grunt.cli.tasks[0] == 'generate') {
								done();
							}
						});

						// Check for nested sections
						if (block.sections) {
							block.isCurrent = false;
							data.sections = block.sections;

							processSection(block.sections, block);
						}

						block.isActive = false;
						block.isCurrent = false;
					};

					// Merge in global config values
					if (block.data) {
						Wee.$extend(data, block.data);
					}

					// Determine target processing mode
					if (target.indexOf('{{') !== -1) {
						single = true;
					}

					// Set current section to active
					block.isActive = true;
					block.isCurrent = true;

					data.content = [];

					content.forEach(function(name, i) {
						var src = path.isAbsolute(name) ?
								name :
								Wee.buildPath(staticRoot, root + '/' + name),
							template = grunt.file.read(src),
							fileSegments = name.replace(/^.*[\\\/]/, '').split('.');

						fileSegments.splice(-1, 1);

						// Inject current context
						data.section = block;

						var obj = {
							sourcePath: name,
							sourceFile: name.replace(/^.*[\\\/]/, ''),
							sourceName: fileSegments.join('.'),
							name: fileSegments.join('.'),
							created: fs.statSync(src).ctime.getTime(),
							modified: fs.statSync(src).mtime.getTime(),
							original: template,
							input: '',
							blocks: []
						};

						// Check for front matter
						if (template.substring(0, 3) == '---') {
							var results = /^(---(?:\n|\r)([\w\W]+?)---)?([\w\W]*)*/.exec(template);

							// Merge YAML into the data
							if (results[2] !== undefined) {
								try {
									var front = yaml.load(results[2]);

									// Check for global data
									if (front.global) {
										data = Wee.$extend(front.global, data);
										delete front.global;
									}

									// Check for site data
									if (front.site) {
										data.site = Wee.$extend(front.site. data.site);
										delete front.site;
									}

									// Check for section data
									if (front.section) {
										data.section = Wee.$extend(front.section, data.section);
										delete front.section;
									}

									// Merge in YAML data
									obj = Wee.$extend(obj, front);
								} catch (e) {
									Wee.notify({
										title: 'Generator Error',
										message: 'There was a problem parsing the YAML'
									}, 'error');
								}
							}

							obj.original = results[3] ? results[3].trim() : '';
						}

						// Process content blocks
						var last = obj.original.length,
							regex = /(?:---(.+)---)\n/g,
							values = [],
							matches;

						// Loop through segment matches
						while ((matches = regex.exec(obj.original)) !== null) {
							var match = matches[1].trim(),
								segs = match.split('|');

							values.push({
								name: segs[0],
								helpers: segs.splice(1),
								start: matches.index,
								end: regex.lastIndex
							});
						}

						// Loop through segment values
						values.forEach(function(value, i) {
							// Calculate ending index
							var name = value.name,
								end = (i + 1) < values.length ?
									values[i + 1].start :
									last,
								helpers = value.helpers,
								content = obj.original.substr(value.end, end - value.end).trim();

							// Process primary content block
							if (i === 0 && value.start > 0) {
								obj.input = obj.original.substr(0, value.start);

								obj.blocks.push({
									name: 'content',
									input: obj.input,
									output: md.render(obj.input),
									render: true
								});
							}

							// Concatenate additional content blocks
							if (name === 'content') {
								obj.input += content;
							} else {
								var append = helpers.indexOf('append') !== -1,
									render = helpers.indexOf('render') !== -1,
									val = {
										name: name,
										input: content,
										output: md.render(content),
										render: render
									};

								// Check for block values
								helpers.forEach(function(helper) {
									if (helper.indexOf(':') !== -1) {
										var split = helper.split(':');

										val[split[0]] = split[1];
									}
								});

								// Handle array blocks
								if (append === true) {
									if (! obj.hasOwnProperty(name)) {
										obj[name] = [];
									}

									obj[name].push(val);
								} else {
									obj[name] = val;
								}

								obj.blocks.push(val);

								// Handle rendered block
								if (render === true) {
									obj.input += content;
								}
							}
						});

						// Inject current index
						obj['#'] = i;
						obj['##'] = i + 1;

						// Handle basic content
						if (values.length === 0) {
							var rendered = md.render(obj.original);

							obj.input = obj.original;

							obj.blocks.push({
								name: 'content',
								input: obj.original,
								output: rendered,
								render: true
							});

							obj.output = rendered;
						} else {
							obj.output = md.render(obj.input);
						}

						// Push current content object in to content array
						data.content.push(obj);

						// Set current target, path, and URL
						var uri = target.replace(project.paths.root, '');

						if (siteConfig.removeIndex) {
							uri = uri.replace('index.html', '');
						}

						if (siteConfig.removeTrailingSlashes === true) {
							uri = uri.replace(/\/$/, '');
						}

						data.target = block.target;
						data.path = uri;
						data.url = path.join(site.domain || '', uri);

						// Handle block ordering and sorting
						if (block.order) {
							data.content.sort(function(a, b) {
								if (a[block.order] < b[block.order]) {
									return -1;
								}

								if (a[block.order] > b[block.order]) {
									return 1;
								}

								return 0;
							});
						}

						if (block.sort == 'desc') {
							data.content.reverse();
						}

						if (single === true) {
							var dest = Wee.view.render(target, obj);

							writeTarget(dest, Wee.$extend(data, {
								content: [obj]
							}));
						}
					});

					if (single === false) {
						writeTarget(target, data);
					}
				});
			});
		};

		var tempPath = config.paths.temp,
			remoteUrls = [],
			remotesDownloaded = 0,
			remoteIndex = 1,
			done;

		// Extract remote URLs
		var getRemotePaths = function(context) {
			var keys = Object.keys(context);

			keys.forEach(function(key) {
				var block = context[key];

				if (block.content) {
					Wee.$toArray(block.content).forEach(function(value, i) {
						if (value.substring(0, 4) == 'http') {
							var filename = '/remote-' + remoteIndex + '.html',
								absolutePath = tempPath + filename,
								relativePath = './' + path.relative(
									configPath,
									tempPath
								) + filename;

							remoteUrls.push([
								value,
								absolutePath
							]);
							remoteIndex++;

							// Inject temp path into content value
							if (typeof block.content == 'string') {
								block.content = relativePath;
							} else {
								block.content[i] = path.resolve(configPath, relativePath);
							}
						}
					});
				}

				if (block.sections) {
					getRemotePaths(block.sections);
				}
			});
		};

		getRemotePaths(json.sections);

		// Download all available remote content
		if (remoteUrls.length) {
			done = this.async();

			// Create remote cache directory
			grunt.file.mkdir(path.normalize(tempPath));

			var cacheRemote = function(i) {
				var arr = remoteUrls[i],
					url = arr[0],
					http = url.substring(4, 5) == 's' ?
						require('https') :
						require('http'),
					tempFile = fs.createWriteStream(arr[1]);

				http.get(url, function(res) {
					res.on('data', function(chunk) {
						tempFile.write(chunk);
					}).on('end', function() {
						tempFile.end();

						remotesDownloaded++;

						// Continue processing if all remotes have been downloaded
						if (remotesDownloaded === remoteUrls.length) {
							processSection(json.sections);
							done();
						} else {
							cacheRemote(i + 1);
						}
					});
				}).on('error', function() {
					Wee.notify({
						title: 'Generation Error',
						message: 'There was a problem downloading ' + url
					}, 'error');

					fs.unlink(dest);
				});
			};

			cacheRemote(0);
		} else {
			processSection(json.sections);
		}

		// Reload browsers
		browserSync.reload();

		if (errors < 1) {
			Wee.notify({
				title: 'Generation Complete',
				message: 'Static site successfully built'
			});
		}
	});
};