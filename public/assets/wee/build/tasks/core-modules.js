/* global legacyConvert, module, moduleResponsive, project, script */

module.exports = function(grunt) {
	grunt.registerTask('configModules', function() {
		// Loop through module directories
		var children = fs.readdirSync(config.paths.modules);

		for (var directory in children) {
			var name = children[directory],
				modulePath = config.paths.modules + '/' + children[directory];

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
						vars = JSON.parse(JSON.stringify(config.style.vars)),
						less = grunt.file.read(config.paths.assets + '/wee/style/wee.module.less');

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
											weePath: '"' + config.paths.weeTemp + '"'
										}
									}
								});

								// Push style task
								config.style.tasks.push('less:' + taskName);

								// Run task
								grunt.task.run('less:' + taskName);
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
								.wee-mobile-landscape () when not (@mobileLandscapeWidth = false) {\n\
									@import (optional) "../../modules/' + name + '/module/style/breakpoints/mobile-landscape.less";\n\
								}\n\
								.wee-tablet-portrait () when not (@tabletPortraitWidth = false) {\n\
									@import (optional) "../../modules/' + name + '/module/style/breakpoints/tablet-portrait.less";\n\
								}\n\
								.wee-desktop-small () when not (@desktopSmallWidth = false) {\n\
									@import (optional) "../../modules/' + name + '/module/style/breakpoints/desktop-small.less";\n\
								}\n\
								.wee-desktop-medium () when not (@desktopMediumWidth = false) {\n\
									@import (optional) "../../modules/' + name + '/module/style/breakpoints/desktop-medium.less";\n\
								}\n\
								.wee-desktop-large () when not (@desktopLargeWidth = false) {\n\
									@import (optional) "../../modules/' + name + '/module/style/breakpoints/desktop-large.less";\n\
								}\n\
							';
						}

						if (fs.existsSync(modulePath + '/css/breakpoints')) {
							vars.responsive = true;

							responsive += ' \
								.wee-mobile-landscape () when not (@mobileLandscapeWidth = false) {\n\
									@import (optional) "../../modules/' + name + '/css/breakpoints/mobile-landscape.less";\n\
								}\n\
								.wee-tablet-portrait () when not (@tabletPortraitWidth = false) {\n\
									@import (optional) "../../modules/' + name + '/css/breakpoints/tablet-portrait.less";\n\
								}\n\
								.wee-desktop-small () when not (@desktopSmallWidth = false) {\n\
									@import (optional) "../../modules/' + name + '/css/breakpoints/desktop-small.less";\n\
								}\n\
								.wee-desktop-medium () when not (@desktopMediumWidth = false) {\n\
									@import (optional) "../../modules/' + name + '/css/breakpoints/desktop-medium.less";\n\
								}\n\
								.wee-desktop-large () when not (@desktopLargeWidth = false) {\n\
									@import (optional) "../../modules/' + name + '/css/breakpoints/desktop-large.less";\n\
								}\n\
							';
						}
					}

					// Inject empty mixins if no breakpoints exist
					if (! vars.responsive) {
						responsive += ' \
							.wee-mobile-landscape () {}\n\
							.wee-tablet-portrait () {}\n\
							.wee-desktop-small () {}\n\
							.wee-desktop-medium () {}\n\
							.wee-desktop-large () {}\n\
						';
					}

					// Process import injection
					less = less.replace('{{imports}}', inject)
						.replace('{{responsive}}', responsive);

					// Write temporary file
					grunt.file.write(config.paths.temp + name + '.less', less);

					// Create module style compile task
					var dest = (module.autoload === true) ?
							config.paths.assets + '/wee/temp/' + name + '.css' :
							modulePath + '/screen.min.css',
						obj = {};

					obj[name] = {
						files: [{
							dest: dest,
							src: config.paths.temp + name + '.less'
						}],
						options: {
							globalVars: {
								weePath: '"' + config.paths.weeTemp + '"'
							},
							modifyVars: vars
						}
					};

					grunt.config.merge({
						less: obj
					});

					// Push style task
					config.style.tasks.push('less:' + name);

					// Configure style watch task
					grunt.config.set('watch.' + name + '-style', {
						files: modulePath + '/**/*.less',
						tasks: [
							'less:' + name,
							'concat:style'
						]
					});

					// Run initial tasks
					grunt.task.run('less:' + name);
					grunt.task.run('concat:style');

					if (module.autoload === true) {
						// Push temporary style to concat list
						config.style.concat.push(dest);

						// Add script paths to uglify
						config.script.files = config.script.files.concat(moduleScript);

						// Legacy processing
						if (project.style.legacy.enable) {
							moduleResponsive.push('@import (inline) "../temp/' + name + '.css";');
							moduleResponsive.push(responsive);
						}

						if (project.style.legacy.watch === true) {
							// Configure legacy watch task
							grunt.config.set('watch.' + name + '-legacy', {
								files: modulePath + '/**/*.less',
								tasks: [
									'less:legacy',
									'convertLegacy:core',
									'notify:legacy'
								]
							});
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
							var taskName = name + '-legacy';
							dest = Wee.buildPath(modulePath, 'legacy.min.css');

							// Create legacy task
							grunt.config.set('less.' + taskName, {
								files: [{
									dest: dest,
									src: config.paths.wee + 'style/wee.module-legacy.less'
								}],
								options: {
									modifyVars: vars,
									globalVars: {
										weePath: '"' + config.paths.weeTemp + '"'
									}
								}
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