// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.make('routes', {
	// Get currently bound path or set path with a specified value
	// Accepts optional options to pass through to get/set
	// Returns string
	path: function(val, opt) {
		return val ?
			this.$set('path', val, opt) :
			this.$get('path', window.location.pathname, true, opt);
	},
	// Retrieve or add route endpoints to route storage
	// Optionally run the rules by setting init to true
	// Returns 
	map: function(routes, init) {
		var curr = this.$get('routes', {});

		if (routes) {
			this.$set('routes', Wee.$extend(curr, routes));

			if (init) {
				this.run({routes: routes});
			}
		}

		return curr;
	},
	// Get segments from an optionally specified path
	// Defaults to currently bound path
	// Returns array of segment strings or string if index specified
	segments: function(i) {
		var segs = Wee.$toArray(this.path().replace(/^\/|\/$/g, '').split('/'));
		return i !== undefined ? (segs[i] || '') : segs;
	},
	// Process stored route options with optional config
	// Defaults to current path
	run: function(opt) {
		var conf = Wee.$extend({
				routes: this.$get('routes')
			}, opt);

		if (conf.path) {
			this.path(conf.path);
		}

		if (conf.routes) {
			this.$private('process', conf.routes, 0, this.$set('segs', 'routes:segments', {}).length);

			// Execute queued init functions on last iteration
			var any = this.$get('any');

			if (any) {
				for (var i = 0; i < any.length; i++) {
					Wee.$exec(any[i]);
				}

				this.$set('any', []);
			}
		}
	}
}, {
	// Recursive method to process routes
	process: function(route, i, total) {
		var seg = this.$get('segs')[i],
			keys = Wee.$getKeys(route),
			x = 0;
			i++;

		// Match against patterns
		for (; x < keys.length; x++) {
			var key = keys[x],
				opts = key.split('||'),
				match = 0,
				len = opts.length,
				k = 0;

			for (; k < len; k++) {
				var opt = opts[k],
					child = route[key];

				if (opt == seg) {
					match = 1;
				} else if (opt.substring(0, 1) == '$') {
					// If the second character is / then test regex
					if (opt.substring(1, 2) == '/') {
						if (new RegExp(opt.substring(2).slice(0,-1)).test(seg)) {
							match = 1;
						}
					} else {
						switch (opt) {
							case '$any':
								Wee.$isObject(child) ?
									match = true :
									this.$push('any', child);
								break;
							case '$any:fire':
								match = true;
								break;
							case '$root':
								if (! seg) {
									Wee.$exec(child, {
										args: Wee.routes.segments(i - 2)
									});
								}
								break;
							case '$num':
								if (! isNaN(seg) && seg.trim() != '') {
									match = true;
								}
								break;
							default:
								if (seg && seg.trim() != '') {
									match = true;
								}
						}
					}
				}

				// If matched execute or process recursively
				if (match) {
					if (Wee.$isObject(child)) {
						this.process(child, i, total);
					} else if (i === total) {
						Wee.$exec(child, {
							args: seg
						});
					}
				}
			}
		}
	}
});