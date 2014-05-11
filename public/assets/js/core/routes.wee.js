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
	// Add route endpoints to the route storage
	map: function(routes) {
		this.$set('routes', Wee.extend(this.$get('routes', {}), routes));
	},
	// Get the segments from an optionally specified path
	// Defaults to currently bound path
	// Returns array of segment strings
	segments: function(path) {
		return Wee.toArray((path || this.path()).split('/'));
	},
	// Process the stored route options against an optionally specified path
	// Defaults to current path
	run: function(path) {
		var routes = this.$get('routes');

		if (path) {
			this.path(path);
		}

		if (routes) {
			this.$call('process', routes, 0, (this.$set('segs', 'routes:segments', {})).length, []);

			// Execute queued init functions on last iteration
			var inits = this.$get('init');

			for (var i = 0; i < inits.length; i++) {
				Wee.exec(inits[i], {
					arguments: this.$get('params')
				});
			}
		}
	}
}, {
	// Recursive method to process routes
	process: function(route, i, total) {
		var seg = this.$get('segs')[i],
			patterns = this.patterns(route),
			x = 0;
			i++;

		var last = (i === total);

		// Execute deepest index function if function exists
		if (! seg && route.hasOwnProperty('index')) {
			Wee.exec(route['index'], {
				arguments: this.$get('params')
			});
		}

		// If the segment exists in the route object
		if (route.hasOwnProperty(seg)) {
			last = this.exec(route[seg], i, total);
		}

		// Match against preset patterns :num and :any
		for (; x < patterns.length; x++) {
			var pattern = patterns[x],
				match = false;

			if (pattern == ':num') {
				if (! isNaN(seg) && seg.trim() !== '') {
					match = true;
				}
			} else if (seg) {
				match = true;
			}

			if (match) {
				this.$push('params', seg);
				this.exec(route[pattern], i, total);
			}
		}

		// Add to init queue if function exists
		if (route.hasOwnProperty('init')) {
			this.$push('init', route['init']);
		}
	},
	// Execute the endpoint else continue the process recursion
	exec: function(obj, i, total) {
		var params = this.$get('params');

		if (Wee.isFunction(obj)) {
			params.length ? obj.apply(null, params) : obj();
		} else {
			if (typeof obj === 'string' || Wee.isArray(obj)) {
				Wee.exec(obj, {
					arguments: params
				});
			} else {
				this.process(obj, i, total);
			}
		}
	},
	// Check for route pattern matches against a specified route
	// Returns array of pattern strings
	patterns: function(route) {
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