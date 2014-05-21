// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.controller.make('routes', {
	// Get the currently bound path or set the path with a specified value
	// Returns string
	path: function(val) {
		return val ?
			this.$set('path', val) :
			this.$get('path', window.location.pathname);
	},
	// Add route endpoints to the route storage
	map: function(routes, init) {
		this.$set('routes', Wee.$extend(this.$get('routes', {}), routes));

		if (init) {
			this.run();
		}
	},
	// Get the segments from an optionally specified path
	// Defaults to currently bound path
	// Returns array of segment strings or string if index specified
	segments: function(i) {
		var segs = Wee.$toArray(this.path().replace(/^\/|\/$/g, '').split('/'));
		return (i !== undefined) ? (segs[i] || '') : segs;
	},
	// Process the stored route options against an optionally specified path
	// Defaults to current path
	run: function(path, reverse) {
		var routes = this.$get('routes');

		if (path) {
			this.path(path);
		}

		if (routes) {
			this.$private('process', routes, 0, (this.$set('segs', 'routes:segments', {})).length);

			// Execute queued init functions on last iteration
			var any = this.$get('any');

			if (any) {
				if (reverse) {
					any.reverse();
				}

				for (var i = 0; i < any.length; i++) {
					Wee.$exec(any[i]);
				}
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
				match = false,
				len = opts.length,
				k = 0;

			for (; k < len; k++) {
				var opt = opts[k],
					child = route[key];

				if (opt == seg) {
					match = true;
				} else if (opt.substring(0, 1) == '$') {
					// If the second character is a / then test regex
					if (opt.substring(1, 2) == '/') {
						var reg = new RegExp(opt.substring(2).slice(0,-1));

						if (reg.test(seg)) {
							match = true;
						}
					} else {
						switch (opt) {
							case '$any':
								this.$push('any', child);
								break;
							case '$root':
								if (! seg) {
									Wee.$exec(child, {
										arguments: [Wee.routes.segments(i - 2)]
									});
								}
								break;
							case '$num':
								if (! isNaN(seg) && seg.trim() != '') {
									match = true;
								}
								break;
							default:
								if (seg) {
									match = true;
								}
						}
					}
				}

				// If matched execute or process recursively
				if (match) {
					Wee.$isObject(child) ?
						this.process(child, i, total) :
						Wee.$exec(child, {
							arguments: [seg]
						});
				}
			}
		}
	}
});