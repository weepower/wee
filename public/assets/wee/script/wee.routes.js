(function(W, U, L) {
	'use strict';

	W.fn.make('routes', {
		/**
		 * Get currently bound URI values or set with string or value object
		 *
		 * @param {(object|string)} [value]
		 * @param {string} [value.hash]
		 * @param {string} [value.path] - relative path
		 * @param {object} [value.query]
		 * @returns {object} data
		 */
		uri: function(value) {
			if (value) {
				if (W.$isObject(value)) {
					return this.$set('uri', W.$extend(this.uri(), value));
				} else {
					var a = W._doc.createElement('a'),
						query = {};
					a.href = value;

					var path = this.$get('path', a.pathname, true);

					if (a.search !== '') {
						var arr = decodeURIComponent(a.search)
								.replace(/^\?/, '')
								.split('&'),
							i = 0;

						for (; i < arr.length; i++) {
							var split = arr[i].split('=');
							query[split[0]] = split[1] == U ? '' : split[1];
						}
					}

					return this.$set('uri', {
						path: (path.charAt(0) == '/' ? '' : '/') + path,
						query: query,
						hash: a.hash.substring(1)
					});
				}
			} else {
				return this.$get('uri', function() {
					return W.routes.uri(L.href);
				}, true);
			}
		},

		/**
		 * Get currently bound path or set path with a specified string
		 *
		 * @param {string} [value]
		 * @param {object} [options]
		 * @param {Array} [options.args]
		 * @param {object} [options.scope]
		 * @returns {string} path
		 */
		path: function(value, options) {
			return value ?
				this.uri({
					path: this.$set('path', value, options)
				}).path :
				this.$get('path', this.uri().path, true, options);
		},

		/**
		 * Get all segments or single segment at index integer
		 *
		 * @param {int} [index]
		 * @returns {(Array|string)} segments
		 */
		segments: function(index) {
			var segs = W.$toArray(
				this.path()
					.replace(/^\/|\/$/g, '')
					.split('/')
			);

			return index !== U ? (segs[index] || '') : segs;
		},

		/**
		 * Retrieve or add route endpoints to route storage
		 *
		 * @param {object} routes
		 * @param {bool} [init=false] - evaluate the map immediately
		 * @returns {object} routes
		 */
		map: function(routes, init) {
			var curr = this.$get('routes', {});

			if (routes) {
				this.$set('routes', W.$extend(curr, routes));

				if (init) {
					this.run({
						routes: routes
					});
				}
			}

			return curr;
		},

		/**
		 * Process stored routes
		 *
		 * @param {object} [conf]
		 */
		run: function(conf) {
			conf = W.$extend({
				routes: this.$get('routes')
			}, conf);

			if (conf.path) {
				this.path(conf.path);
			}

			if (conf.routes) {
				this.$private.process(conf.routes, 0, this.$set('segs', this.segments()).length);

				// Execute queued init functions on last iteration
				var any = this.$get('any');

				if (any) {
					for (var i = 0; i < any.length; i++) {
						W.$exec(any[i]);
					}

					// Clear array for next iteration
					this.$set('any', []);
				}
			}
		}
	}, {
		/**
		 * Recursively process routes
		 *
		 * @private
		 * @param {string} route - route to evaluate
		 * @param {int} i - current index in iteration
		 * @param {int} total - total number of routes
		 */
		process: function(route, i, total) {
			var seg = this.$get('segs')[i],
				keys = Object.keys(route),
				x = 0;
			i++;

			// Match against patterns
			for (; x < keys.length; x++) {
				var key = keys[x],
					child = route[key],
					opts = key.split('||'),
					match = false,
					k = 0;

				for (; k < opts.length; k++) {
					var opt = opts[k];

					if (opt == seg) {
						match = true;
					} else if (opt.substring(0, 1) == '$') {
						// If the second character is / then test regex
						if (opt.substring(1, 2) == '/') {
							if (new RegExp(opt.substring(2).slice(0, -1)).test(seg)) {
								match = 1;
							}
						} else {
							switch (opt) {
								case '$any':
									W.$isObject(child) ?
										match = true :
										this.$push('any', child);
									break;
								case '$any:fire':
									match = true;
									break;
								case '$root':
									if (! seg) {
										W.$exec(child, {
											args: this.$public.segments(i - 2)
										});
									}
									break;
								case '$num':
									if (! isNaN(seg) && seg.trim() !== '') {
										match = true;
									}
									break;
								default:
									if (seg && seg.trim() !== '') {
										match = true;
									}
							}
						}
					}
				}

				// If matched process recursively or execute if complete
				if (match) {
					if (W.$isObject(child)) {
						this.process(child, i, total);
					} else if (i === total) {
						W.$exec(child, {
							args: seg
						});
					}
				}
			}
		}
	});
})(Wee, undefined, Wee._win.location);