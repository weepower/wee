// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.controller.create('routes', {
	// Get the currently bound path or set the path with a specified value
	// Returns string
	path: function(val) {
		return val ?
			this.$set('path', val) :
			this.$get('path', window.location.pathname.replace(/^\/|\/$/g, ''));
	},
	// Add route endpoints to the route object
	map: function(routes) {
		this.$set('routes', Wee.extend(this.$get('routes', {}), routes));
	},
	// Get the segments from an optionally specified path
	// Returns array of segment strings
	segments: function(path) {
		return Wee.toArray((path || this.path()).split('/'));
	},
	// Process the available route options against an optionally specified path
	// Defaults to current path
	run: function(path) {
		var routes = this.$get('routes');

		if (path) {
			this.path(path);
		}

		if (routes) {
			this.$call('process', routes, 0, (this.$set('segs', 'routes:segments', {})).length, [], []);
		}
	}
}, {
	// Recursive method to process routes
	process: function(route, i, total, fn, params) {
		var seg = this.$get('segs')[i],
			last = true,
			match = false,
			patterns = this.getPatterns(route),
			x = 0;
			i++;

		// Add to init queue if function exists
		if (route.hasOwnProperty('init')) {
			fn.push(route['init']);
		}

		if (seg) {
			// Match against preset patterns :num and :any
			for (; x < patterns.length; x++) {
				var pattern = patterns[x];

				switch (pattern) {
					case ':num':
						if (! isNaN(seg)) {
							match = true;
							params.push(seg);
							seg = pattern;
						}
						break;
					case ':any':
						match = true;
						params.push(seg);
						seg = pattern;
						break;
				}
			}
		}

		// If the segment matches a predefined pattern or exists in the route object
		if (match || route.hasOwnProperty(seg)) {
			var obj = route[seg];

			// Execute the endpoint else continue the process recursion
			if (Wee.isFunction(obj)) {
				params.length ? obj.apply(null, params) : obj();
			} else {
				if (typeof obj === 'string' || Wee.isArray(obj)) {
					Wee.exec(obj, {
						arguments: params
					});
				} else {
					this.process(obj, i, total, fn, params);

					last = false;
				}
			}
		}

		// Execute index function if available
		if (route.hasOwnProperty('index') && last && ! seg) {
			Wee.exec(route['index'], {
				arguments: params
			});
		}

		// Execute queued init functions
		if (i === total || last) {
			for (x = 0; x < fn.length; x++) {
				Wee.exec(fn[x], {
					arguments: params
				});
			}
		}
	},
	// Check for route pattern matches against a specified route object
	// Returns array of pattern strings
	getPatterns: function(route) {
		var arr = [],
			keys = Wee.getKeys(route),
			i = 0;

		for (; i < keys.length; i++) {
			var key = keys[i];

			if (key.substring(0, 1) == ':') {
				arr.push(key);
			}
		}

		return arr;
	}
});