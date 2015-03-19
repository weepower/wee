/* global legacyConvert, moduleResponsive, project, script */

module.exports = function(grunt) {
	grunt.registerTask('configModules', function() {
		// Set global config
		modules = {
			rootPath: config.assetPath + '/modules'
		};

		// Loop through module directories
		var children = fs.readdirSync(modules.rootPath);

		for (var directory in children) {
			var name = children[directory],
				modulePath = modules.rootPath + '/' + children[directory];

			// Ensure the child is a directory
			if (fs.statSync(modulePath).isDirectory()) {
				var configFile = modulePath + '/module.json';

				// Ensure the module.json file exists
				if (grunt.file.exists(configFile)) {
					// Get module config
					var module = grunt.file.readJSON(configFile),
						moduleScript = [
							modulePath + '/module/script/*.js'
						],
						vars = JSON.parse(JSON.stringify(style.vars)),
						less = grunt.file.read(config.assetPath + '/wee/style/wee.module.less');

					// Set module variables
					vars.moduleName = name;
					vars.responsive = false;

					// Template variables
					var inject = '@import "../../modules/' + name + '/module/style/screen.less";\n',
						responsive = '';

					if (module.style) {
						// Build additional style
						if (module.style.build) {
							module.style.build.forEach(function(filepath) {
								inject += '@import "../../modules/' + name + '/' + filepath + '";\n';
							});
						}

						// Compile additional style
						if (module.style.compile) {
							for (var target in module.style.compile) {
								var taskName = target.replace(/\./g, '-') + '-' + name + '-style',
									sources = Wee.$toArray(module.style.compile[target]),
									files = [];

								for (var sourcePath in sources) {
									files.push(Wee.buildPath(modulePath, sources[sourcePath]));
								}

								// Merge watch config
								grunt.config.set('watch.' + taskName, {
									files: files,
									tasks: [
										'less:' + taskName
									]
								});

								// Create Less task
								grunt.config.set('less.' + taskName, {
									files: [{
										dest: Wee.buildPath(modulePath, target),
										src: files
									}],
									options: {
										globalVars: {
											weePath: '"' + config.tempPath + '/wee.less"'
										}
									}
								});

								// Push style task
								style.tasks.push('less:' + taskName);
							}
						}
					}

					if (module.script) {
						// Build additional script
						if (module.script.build) {
							module.script.build.forEach(function(filepath) {
								moduleScript.push(path.join(modulePath, filepath));
							});
						}

						// Compile additional script
						if (module.script.compile) {
							for (var target in module.script.compile) {
								var taskName = target.replace(/\./g, '-') + '-' + name + '-script',
									sources = module.script.compile[target],
									src = [];

								if (sources instanceof Array) {
									for (var source in sources) {
										src.push(Wee.buildPath(modulePath, sources[source]));
									}
								} else {
									src = Wee.buildPath(modulePath, sources);
								}

								// Merge watch config
								grunt.config.set('watch.' + taskName, {
									files: src,
									tasks: [
										'uglify:' + taskName
									]
								});

								// Create uglify task
								grunt.config.set('uglify.' + taskName, {
									files: [{
										dest: Wee.buildPath(modulePath, target),
										src: src
									}]
								});

								// Run task
								grunt.task.run('uglify:' + taskName);
							}
						}
					}

					// Determine if module is responsive
					if (project.style.core.responsive.enable) {
						if (fs.existsSync(modulePath + '/module/style/breakpoints')) {
							vars.responsive = true;

							responsive += ' \
								.wee-mobile-landscape () when not (@mobileLandscapeWidth = false) { \
									@import (optional) "../../modules/' + name + '/module/style/breakpoints/mobile-landscape.less"; \
								} \
								.wee-tablet-portrait () when not (@tabletPortraitWidth = false) { \
									@import (optional) "../../modules/' + name + '/module/style/breakpoints/tablet-portrait.less"; \
								} \
								.wee-desktop-small () when not (@desktopSmallWidth = false) { \
									@import (optional) "../../modules/' + name + '/module/style/breakpoints/desktop-small.less"; \
								} \
								.wee-desktop-medium () when not (@desktopMediumWidth = false) { \
									@import (optional) "../../modules/' + name + '/module/style/breakpoints/desktop-medium.less"; \
								} \
								.wee-desktop-large () when not (@desktopLargeWidth = false) { \
									@import (optional) "../../modules/' + name + '/module/style/breakpoints/desktop-large.less"; \
								} \
							';
						}

						if (fs.existsSync(modulePath + '/css/breakpoints')) {
							vars.responsive = true;

							responsive += ' \
								.wee-mobile-landscape () when not (@mobileLandscapeWidth = false) { \
									@import (optional) "../../modules/' + name + '/css/breakpoints/mobile-landscape.less"; \
								} \
								.wee-tablet-portrait () when not (@tabletPortraitWidth = false) { \
									@import (optional) "../../modules/' + name + '/css/breakpoints/tablet-portrait.less"; \
								} \
								.wee-desktop-small () when not (@desktopSmallWidth = false) { \
									@import (optional) "../../modules/' + name + '/css/breakpoints/desktop-small.less"; \
								} \
								.wee-desktop-medium () when not (@desktopMediumWidth = false) { \
									@import (optional) "../../modules/' + name + '/css/breakpoints/desktop-medium.less"; \
								} \
								.wee-desktop-large () when not (@desktopLargeWidth = false) { \
									@import (optional) "../../modules/' + name + '/css/breakpoints/desktop-large.less"; \
								} \
							';
						}
					}

					// Process import injection
					less = less.replace('{{imports}}', inject)
						.replace('{{responsive}}', responsive);

					// Write temporary file
					grunt.file.write(config.tempPath + '/' + name + '.less', less);

					// Create module style compile task
					var dest = (module.autoload === true) ?
							config.assetPath + '/wee/temp/' + name + '.css' :
							modulePath + '/screen.min.css',
						obj = {};

					obj[name] = {
						files: [{
							dest: dest,
							src: config.tempPath + '/' + name + '.less'
						}],
						options: {
							globalVars: {
								weePath: '"' + config.tempPath + '/wee.less"'
							},
							modifyVars: vars
						}
					};

					grunt.config.merge({
						less: obj
					});

					// Push style task
					style.tasks.push('less:' + name);

					// Configure style watch task
					grunt.config.set('watch.' + name + '-style', {
						files: modulePath + '/**/*.less',
						tasks: [
							'less:' + name,
							'concat:style'
						]
					});

					if (module.autoload === true) {
						// Push temporary style to concat list
						style.concat.push(dest);

						// Add script paths to uglify
						script.files = script.files.concat(moduleScript);

						// Legacy processing
						if (project.style.legacy.enable) {
							moduleResponsive.push(responsive);
						}
					} else {
						// Create module style compile task
						obj[name] = {
							files: [{
								dest: modulePath + '/script.min.js',
								src: moduleScript
							}]
						};

						grunt.config.merge({
							uglify: obj
						});

						// Configure script watch task
						grunt.config.set('watch.' + name + '-script', {
							files: moduleScript,
							tasks: [
								'uglify:' + name
							]
						});

						// Execute script task
						grunt.task.run('uglify:' + name);

						// Legacy processing
						if (project.style.legacy.enable) {
							var taskName = name + '-legacy',
								less = grunt.file.read(config.assetPath + '/wee/style/wee.module-legacy.less'),
								legacySource = config.tempPath + '/' + name + '-legacy.less';

							// Process media query injection
							less = less.replace('{{mediaQueries}}', responsive);

							// Write temporary file
							grunt.file.write(legacySource, less);

							// Create legacy task
							grunt.config.set('less.' + taskName, {
								files: [{
									dest: Wee.buildPath(modulePath, 'legacy.min.css'),
									src: legacySource
								}]
							});

							if (project.style.legacy.watch === true) {
								// Configure legacy watch task
								grunt.config.set('watch.' + taskName, {
									files: modulePath + '/**/*.less',
									tasks: [
										'less:' + taskName,
										'convertLegacy:' + taskName
									]
								});

								// Push style task
								style.tasks.push('less:' + taskName);
							}

							// Push to conversion array
							legacyConvert[taskName] = dest;

							grunt.task.run('less:' + taskName);
							grunt.task.run('convertLegacy:' + taskName);
						}
					}
				} else {
					Wee.notify({
						title: 'Module Error',
						message: 'Missing module.json for "' + name + '" module.'
					}, 'error');

					grunt.fail.fatal('Missing module.json for "' + name + '" module.');
				}
			}
		}
	});
};