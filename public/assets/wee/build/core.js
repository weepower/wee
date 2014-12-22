/* global config, notifier, project */

module.exports = Wee = {
	// Build root or relative path
	buildPath: function(file, path) {
		return file.substring(0, 2) == './' ? file : this.concatPaths(path, file);
	},
	// Join two file system paths
	concatPaths: function(a, b) {
		return (a.slice(-1) !== '/' && b.slice(1) !== '/') ? (a + '/' + b) : (a + b);
	},
	// Get file extension
	getExtension: function(name) {
		var i = name.lastIndexOf('.');
		return (i < 0) ? '' : name.substr(i + 1);
	},
	// Recursively get files in directory
	getFiles: function(dir, ext, files) {
		files = files || [];

		if (files === undefined) {
			files = [];
		}

		var children = fs.readdirSync(dir);

		for (var file in children) {
			var match = children[file],
				path = dir + '/' + children[file];

			if (files.hasOwnProperty(path)) {
				continue;
			}

			if (fs.statSync(path).isDirectory()) {
				this.getFiles(path, ext, files);
			} else {
				if (match.charAt(0) !== '.' && ext.indexOf(this.getExtension(match)) !== -1) {
					files.push(path);
				}
			}
		}

		return files;
	},
	// Append minified extension
	getMinifiedExtension: function(dest, src, ext) {
		var dir = src.substring(0, src.lastIndexOf('/')),
			filename = src.substring(src.lastIndexOf('/'), src.length);
		filename = filename.substring(0, filename.lastIndexOf('.'));

		return dest + '/' + dir + filename + ext;
	},
	// Determine if specified argument is an object
	$isObject: function(obj) {
		return obj && obj.constructor === Object;
	},
	// Extend specified object with specified source object
	// Optionally nest deep with third argument set to true
	$extend: function(obj, src, deep) {
		obj = obj || {};

		for (var key in src) {
			// Attempt to deep nest else set property of object
			if (deep) {
				try {
					obj[key] = (this.$isObject(obj[key])) ?
						this.$extend(obj[key], src[key]) :
						src[key];
				} catch (e) {
					obj[key] = src[key];
				}
			} else {
				obj[key] = src[key];
			}
		}

		return obj;
	},
	$unique: function(arr) {
		return arr.reverse().filter(function(e, i, arr) {
			return arr.indexOf(e, i + 1) === -1;
		}).reverse();
	},
	// Parse specified data into specified template string
	// Return string
	parse: function(temp, data) {
		return this.render(temp, data, {}, {
			data: data,
			escape: true
		}, 0);
	},
	pair: /{{#(.+?)}}([\s\S]+?){{\/\1}}(?!.*{{\/\1}})/g,
	single: /{{(.+?)}}/g,
	render: function(temp, data, prev, conf, index) {
		var scope = this;

		return temp.replace(this.pair, function(m, tag, inner) {
			var segs = tag.match(/(?:[^|]|\|\|)+/g),
				len = segs.length,
				filter = len > 1 ? segs[len - 1] : '';
			tag = segs[0];

			var val = scope.getValue(data, prev, tag, conf, index),
				empty = val === false || val === undefined || val.length === 0,
				resp = '';

			if (filter === '' && ! empty && typeof val == 'object') {
				// Loop through objects and arrays
				var isObj = Wee.$isObject(val),
					i = 0;

				for (var key in val) {
					var el = val[key],
						item = Wee.$extend({
							$key: key,
							$val: el,
							$i: i
						}, isObj ? val : Wee.$isObject(el) ? el : {});

					resp += scope.render(inner, item, data, conf, i);

					i++;
				}
			} else if ((filter == 'notEmpty' && ! empty) || (filter == 'empty' && empty)) {
				return scope.render(inner, data, {}, conf);
			}

			return resp;
		}).replace(this.single, function(m, tag) {
			var opt = conf,
				segs = tag.match(/(?:[^|]|\|\|)+/g),
				len = segs.length,
				filter = len > 1 ? segs[len - 1] : '';
			tag = segs[0];

			if (filter == 'raw') {
				opt = Wee.$extend({
					escape: false
				});
			}

			var resp = scope.getValue(data, prev, tag, opt, index);

			return resp === undefined || typeof resp == 'object' ? '' : resp;
		});
	},
	getValue: function(data, prev, key, conf, x) {
		var segs = key.split('||'),
			trim = segs[0].trim(),
			resp = trim.split('.'),
			orig = data,
			i = 0;

		// Alter context
		if (resp[0] == '$root') {
			data = conf.data;
			resp.shift();
		} else if (trim.substring(0, 3) == '../') {
			data = prev;
			resp.splice(0, 3, trim.substring(3));
		}

		var len = resp.length - 1;

		// Loop through object segments
		for (; i <= len; i++) {
			key = resp[i];

			if (data.hasOwnProperty(key)) {
				data = data[key];

				// Return value on last segment
				if (i === len) {
					if (typeof data == 'function') {
						data = data(orig, conf.data, x);
					}

					if (typeof data == 'string') {
						// Encode tags by default
						return conf.escape ?
							data.replace(/&amp;/g, '&')
								.replace(/&/g, '&amp;')
								.replace(/</g, '&lt;')
								.replace(/>/g, '&gt;')
								.replace(/"/g, '&quot;') :
							data;
					} else if (data !== undefined) {
						return data;
					}
				}
			}
		}

		// Return fallback or empty string
		return segs.length > 1 ? segs[1].trim() : '';
	},
	validate: function(config, grunt, filepath) {
		var ext = Wee.getExtension(filepath);

		if (filepath.indexOf('temp') == -1) {
			if (ext == 'js') {
				var js = grunt.file.read(filepath);

				if (project.script.validate.jshint) {
					// JSHint
					var jshintConfig = grunt.file.readJSON(
							project.script.validate.jshint === true ?
								config.assetPath + '/wee/script/.jshintrc' :
								project.script.validate.jshint
						);

					if (! jshint(js, jshintConfig)) {
						var out = jshint.data(),
							errors = out.errors,
							total = errors.length;

						grunt.log.header('Script validation errors found');

						grunt.log.error('JSHint error' +
							((total > 1) ? 's' : '') + ' in ' + filepath + '.');

						errors.forEach(function(message) {
							Wee.logError(grunt, message.line  + ':' + message.character, message.reason, message.evidence);
						});

						grunt.log.writeln();
						grunt.log.writeln();
					}
				}

				if (project.script.validate.jscs) {
					// JSCS
					var jscsConfig = grunt.file.readJSON(
							project.script.validate.jscs === true ?
								config.assetPath + '/wee/script/.jscs.json' :
								project.script.validate.jscs
						),
						checker = new jscs();

					checker.registerDefaultRules();
					checker.configure(jscsConfig);

					var errors = checker.checkString(js),
						errorList = errors.getErrorList(),
						total = errorList.length;

					if (total > 0) {
						grunt.log.error('JSCS error' +
							((total > 1) ? 's' : '') + ' in ' + filepath + '.');

						errorList.forEach(function(message) {
							Wee.logError(grunt, message.line  + ':' + message.column, message.rule, message.message);
						});
					}
				}
			}
		}
	},
	logError: function(grunt, pos, msg, details) {
		this.notify({
			title: 'Validation Error',
			message: 'Check console for error details'
		});

		grunt.log.writeln('['.cyan + pos + '] '.cyan + msg + ' ' + details.magenta);
	},
	notify: function(data) {
		notifier.notify({
			title: data.title,
			message: data.message,
			icon: config.assetPath + '/wee/build/icon.png'
		});
	}
};