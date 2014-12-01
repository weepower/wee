var fs = require('fs');

module.exports = Wee = {
	// Build root or relative path
	buildPath: function(file, path) {
		return file.slice(2) == './' ? file : this.concatPaths(path, file);
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
	// Parse specified data into specified template string
	// Return string
	parse: function(temp, data) {
		return this.render(temp, data, {
			data: data,
			escape: true
		}, 0);
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
	pair: /{{([#^@]?)+(.+?)}}([\s\S]+?){{\/\1\2}}/g,
	single: /{{(.+?)}}/g,
	render: function(temp, data, conf, index) {
		var scope = this;

		return temp.replace(this.pair, function(m, pre, tag, inner) {
			var val = scope.getValue(data, tag, conf, index),
				empty = val === undefined || val.length === 0,
				resp = '';

			if (pre == '#' && ! empty && typeof val == 'object') {
				// Loop through objects and arrays
				if (typeof val == 'object') {
					var isObj = Wee.$isObject(val),
						i = 0;

					for (var key in val) {
						// Merge in iterative data
						var item = Wee.$extend({
							$key: key,
							$val: val[key],
							$i: i
						}, isObj ? val : val[key]);

						resp += scope.render(inner, item, conf, i);

						i++;
					}
				}
			} else if ((pre == '^' && empty) || (pre == '@' && ! empty)) {
				return scope.render(inner, data, conf);
			}

			return resp;
		}).replace(this.single, function(m, tag) {
			var opt = conf;

			// With % prefix output raw
			if (tag.charAt(0) == '%') {
				tag = tag.substring(1);
				opt = Wee.$extend({
					escape: false
				});
			}

			var resp = scope.getValue(data, tag, opt, index);

			return resp === undefined || typeof resp == 'object' ? '' : resp;
		});
	},
	getValue: function(data, key, conf, x) {
		var segs = key.split('||'),
			resp = segs[0].trim().split('.'),
			len = resp.length - 1,
			orig = data,
			i = 0;

		// Loop through object segments
		for (; i <= len; i++) {
			key = resp[i];
			var obj = data[key];

			// Return value on last segment
			if (i === len) {
				if (key.charAt(0) == '&') {
					obj = conf.data[key.substring(1)];
				}

				if (typeof data == 'function') {
					obj = data(orig, conf.data, x);
				}

				if (typeof obj == 'string') {
					// Encode tags by default
					return conf.escape ? obj
						.replace(/&amp;/g, '&')
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/"/g, '&quot;') :
						obj;
				} else if (obj !== undefined) {
					return obj;
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
				if (project.script.validate.jshint) {
					// JSHint
					var js = grunt.file.read(filepath),
						jshint = require('jshint').JSHINT,
						jshintConfig = grunt.file.readJSON(
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
								project.script.validate.jshint
						),
						checker = new global.jscs();

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
		grunt.log.writeln('['.cyan + pos + '] '.cyan + msg + ' ' + details.magenta);
	}
};