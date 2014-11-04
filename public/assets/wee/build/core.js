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

		if (typeof files === 'undefined') {
			files = [];
		}

		var children = fs.readdirSync(dir);

		for (var file in children) {
			if (files.hasOwnProperty(path)) {
				continue;
			}

			var match = children[file],
				path = dir + '/' + children[file];

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
				} catch(e) {
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
				empty = val == undefined || val.length == 0,
				resp = '';

			if (pre == '#' && ! empty && typeof val == 'object') {
				// Loop through objects and arrays
				if (typeof val == 'object') {
					var isObj = Wee.$isObject(val),
						i = 0;

					for (var key in val) {
						// Merge in iterative data
						var item = Wee.$extend({
							'$key': key,
							'$val': val[key],
							'$i': i
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

			return resp == undefined || typeof resp == 'object' ? '' : resp;
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
	validate: function(action, filepath, target) {
		var ext = Wee.getExtension(filepath);

		if (ext == 'js') {
			var jscs = require('./node_modules/jscs/lib/checker'),
				jshint = require('jshint').JSHINT,
				js = grunt.file.read(filepath);

			// Get config
			var jscsJson = grunt.file.read('public/assets/wee/script/.jscsrc'),
				jscsConfig = JSON.parse(jscsJson),
				jshintJson = grunt.file.read('public/assets/wee/script/.jshintrc'),
				jshintConfig = JSON.parse(jshintJson);

			// JSHint
			if (! jshint(js, jshintConfig)) {
				grunt.log.error('JSHint error(s) in ' + filepath + '.');

				var out = jshint.data(),
					errors = out.errors;

				for (var j = 0; j < errors.length; j++) {
					grunt.log.ok(errors[j].line + ':' + errors[j].character + ' -> ' + errors[j].reason + ' -> ' + errors[j].evidence);
				}

				// List globals
				grunt.log.ok('Globals: ' + out.globals.join(', '));
			}

			// JSCS
			// var checker = new jscs();

			// checker.registerDefaultRules();
			// checker.configure(jscsConfig);

			// var errors = checker.checkString(js),
			// 	errorList = errors.getErrorList();

			// if (errorList.length > 0) {
			// 	grunt.log.error('JSCS error(s) in ' + filepath + '.');

			// 	errorList.forEach(function(error) {
			// 		grunt.log.ok(errors.explainError(error));
			// 	});
			// }
		} else if (ext == 'less' || ext == 'css') {
			// CSSLint


			// CSScomb

		}
	}
};