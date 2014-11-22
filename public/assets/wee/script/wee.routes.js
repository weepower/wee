(function(W, U, L) {
	'use strict';

	W.fn.make('routes', {
		// Get currently bound path or set path with a specified value
		// Accepts optional options to pass through to get/set
		// Returns string
		path: function(val, opt) {
			return val ?
				this.$set('path', val, opt) :
				this.$get('path', L.pathname, true, opt);
		},
		// Get all segments or single segment at index
		// Returns array of segment strings or string if index specified
		segments: function(i) {
			var segs = W.$toArray(this.path().replace(/^\/|\/$/g, '').split('/'));
			return i !== U ? (segs[i] || '') : segs;
		},
		// Get the current document query values
		// Returns string
		query: function(key) {
			var obj = L.search.replace(/(^\?)/, '').split('&').map(function(n) {
				return n = n.split('='), this[n[0]] = n[1], this;
			}.bind({}))[0];
			return key !== U ? (obj[key] || '') : obj;
		},
		// Get the current document hash or set it to specified value
		// Returns string
		hash: function(val) {
			if (val) {
				L.hash = val;
				return val;
			}

			return L.hash.substring(1);
		},
		// Retrieve or add route endpoints to route storage
		// Optionally run the rules by setting init to true
		// Returns
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
		// Process stored route options with optional config
		// Defaults to current path
		run: function(opt) {
			var conf = W.$extend({
					routes: this.$get('routes')
				}, opt);

			if (conf.path) {
				this.path(conf.path);
			}

			if (conf.routes) {
				var segs = this.segments();

				this.$private('process', conf.routes, 0, this.$set('segs', segs, {}).length);

				// Execute queued init functions on last iteration
				var any = this.$get('any'),
					i = 0;

				if (any) {
					for (; i < any.length; i++) {
						W.$exec(any[i]);
					}

					// Clear array for next iteration
					this.$set('any', []);
				}
			}
		}
	}, {
		// Recursive method to process routes
		process: function(route, i, total) {
			var seg = this.$get('segs')[i],
				keys = Object.keys(route),
				x = 0;
			i++;

			// Match against patterns
			for (; x < keys.length; x++) {
				var key = keys[x],
					opts = key.split('||'),
					match = 0,
					k = 0;

				for (; k < opts.length; k++) {
					var opt = opts[k],
						child = route[key];

					if (opt == seg) {
						match = 1;
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
											args: this.routes.segments(i - 2)
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

					// If matched execute or process recursively
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
		}
	});
})(Wee, undefined, Wee._win.location);