(function(W, U) {
	'use strict';

	W.fn.make('view', {
		/**
		 * Parse data into template string
		 *
		 * @param template
		 * @param data
		 * @returns {string}
		 */
		render: function(template, data) {
			return this.$private.render(template, W.$extend({}, data));
		},

		/**
		 * Add conditional template handler or data modifier
		 *
		 * @param name
		 * @param fn
		 */
		addFilter: function(name, fn) {
			this.$private.extend('filters', name, fn);
		},

		/**
		 * Add helper to run additional processing on tag data
		 *
		 * @param name
		 * @param fn
		 */
		addHelper: function(name, fn) {
			this.$private.extend('helpers', name, fn);
		},

		/**
		 * Make partial available for injection into other templates
		 *
		 * @param name
		 * @param value
		 */
		addPartial: function(name, value) {
			this.$private.extend('partials', name, value);
		}
	}, {
		/**
		 * Set default regex and filters
		 *
		 * @construct
		 * @private
		 */
		_construct: function() {
			// Set tag regex
			this.tags = /{{([#\/])([^#{\|\n]+)(\|[^{\n]+)?}}/g;
			this.partial = /{{> (.+?)}}/g;
			this.pair = /{{#(.+?)(?:|\|([^}]*))}}([\s\S]*?){{\/\1}}/g;
			this.single = /{{(.+?)}}/g;
			this.ext = /(.[^\(]+)(?:\((.*)\))?/;

			// Create extension objects
			this.helpers = {};
			this.partials = {};

			// Add default filters
			this.filters = {
				is: function(val) {
					return this.val == val;
				},
				not: function(val) {
					return this.val != val;
				},
				isEmpty: function() {
					return this.empty;
				},
				notEmpty: function() {
					return ! this.empty;
				}
			};
		},

		/**
		 * Extend view engine
		 *
		 * @param type
		 * @param a
		 * @param b
		 */
		extend: function(type, a, b) {
			var obj = a;

			if (typeof a == 'string') {
				obj = [];
				obj[a] = b;
			}

			W.$extend(this[type], obj);
		},

		/**
		 * Render template string
		 *
		 * @param temp
		 * @param data
		 * @returns {*}
		 */
		render: function(temp, data) {
			var scope = this,
				tags = [];
			this.esc = false;

			// Make partial replacements
			while (temp.indexOf('{{> ') > -1) {
				temp = temp.replace(this.partial, function(match, tag) {
					var partial = scope.partials[tag];
					return partial ? (W.$isFunction(partial) ? partial() : partial) : '';
				});
			}

			// Pre-process tags to allow for reliable tag matching
			temp = temp.replace(this.tags, function(m, pre, tag, filter) {
				var resp = '{{' + pre;

				if (pre == '#') {
					if (tags[tag]) {
						tags[tag].i++;
						tags[tag].o.push(tags[tag].i);
					} else {
						tags[tag] = {
							i: 1,
							o: [1]
						};
					}

					resp += tag + '%' + tags[tag].i + (filter || '');
				} else if (tags[tag]) {
					resp += tag + '%' + tags[tag].o.pop();
				}

				return resp + '}}';
			});

			// Parse template tags
			temp = this.parse(temp, data, {}, data, 0);

			// Reconstitute replacements
			return this.esc ?
				temp.replace(/{~/g, '{{').replace(/~}/g, '}}').replace(/%\d+/g, '') :
				temp;
		},

		/**
		 * Parse template string
		 *
		 * @param temp
		 * @param data
		 * @param prev
		 * @param init
		 * @param index
		 * @returns {string}
		 */
		parse: function(temp, data, prev, init, index) {
			var scope = this;

			return temp.replace(this.pair, function(m, tag, filter, inner) {
				tag = tag.replace(/%\d+/, '');

				// Escape child template tags
				if (tag == '!') {
					scope.esc = true;
					return inner.replace(/{{/g, '{~').replace(/}}/g, '~}');
				}

				var val = scope.get(data, prev, tag, U, init, index),
					empty = val === false || val == null || val.length === 0,
					resp = '';

				if (filter) {
					// Loop through tag filters
					var cont = filter.split('|').every(function(el) {
						var arr = el.match(scope.ext),
							args = arr[2] !== U ? arr[2].split(',') : [];
						el = arr[1];
						filter = scope.filters[el];

						if (filter) {
							var rv = filter.apply({
								val: val,
								data: data,
								root: init,
								tag: tag,
								inner: inner,
								empty: empty
							}, args);

							// If the filter response is true skip into interior
							// If false abort the current process
							if (rv === false) {
								return false;
							} else if (rv === true) {
								resp = scope.parse(inner, data, prev, init, index);
							}
						}

						return true;
					});

					if (cont === false) {
						return '';
					}

					val = scope.get(data, prev, tag, U, init, index);
					empty = val === false || val == null || val.length === 0;
				}

				if (empty === false && resp === '') {
					// Loop through objects and arrays
					if (typeof val == 'object') {
						var isObj = W.$isObject(val),
							i = 0;

						for (var key in val) {
							if (val.hasOwnProperty(key)) {
								var el = val[key],
									item = W.$extend({
										$key: key,
										'.': el,
										'#': i,
										'##': i + 1
									}, W.$isObject(el) ? el : (isObj ? val : {}));

								resp += scope.parse(inner, item, data, init, i);

								i++;
							}
						}
					} else if (val !== false) {
						resp = scope.parse(inner, W.$extend(data, {
							'.': val,
							'#': 0,
							'##': 1
						}), data, init, 0);
					} else {
						resp = inner;
					}
				}

				return resp;
			}).replace(this.single, function(m, set) {
				var split = set.split('||'),
					fb = split[1],
					segs = split[0].split('|'),
					tag = segs[0].trim(),
					val = scope.get(data, prev, tag, fb, init, index),
					helpers = segs.length > 1 ? segs.slice(1) : segs;

				if (val === U || typeof val == 'object') {
					val = '';
				}

				// Process helpers
				helpers.forEach(function(el) {
					var arr = el.match(scope.ext);

					if (arr) {
						var args = arr[2] !== U ? arr[2].split(',') : [];
						el = arr[1].trim();
						var helper = scope.helpers[el];

						if (helper) {
							val = helper.apply({
								val: val,
								data: data,
								root: init,
								tag: tag,
								index: index,
								fallback: fb
							}, args);
						}
					}
				});

				// Encode output by default
				if (typeof val == 'string') {
					if (helpers.indexOf('raw') < 0) {
						val = val.replace(/&amp;/g, '&')
							.replace(/&/g, '&amp;')
							.replace(/</g, '&lt;')
							.replace(/>/g, '&gt;')
							.replace(/"/g, '&quot;');
					}

					if (val.indexOf('{{') > 0) {
						val = scope.parse(val, data, prev, init, index);
					}
				}

				return val;
			});
		},

		/**
		 * Get specific object value
		 *
		 * @param data
		 * @param prev
		 * @param key
		 * @param fb
		 * @param init
		 * @param x
		 * @returns {*}
		 */
		get: function(data, prev, key, fb, init, x) {
			var trim = key.trim(),
				resp = trim == '.' ? key : key.split('.'),
				orig = data,
				i = 0;

			// Alter context
			if (resp[0] == '$root') {
				data = init;
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
							data = data(orig, init, x);
						}

						if (data) {
							return data;
						}

						break;
					}
				} else {
					break;
				}
			}

			// Return fallback
			return fb ? fb.trim() : fb;
		}
	});
})(Wee, undefined);