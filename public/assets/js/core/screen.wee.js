// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.make('screen', {
	// Get current screen value
	size: function() {
		var w = window,
			d = document,
			size = w.getComputedStyle ?
				w.getComputedStyle(d.documentElement, null).getPropertyValue('font-family') :
				(d.documentElement.currentStyle ? d.documentElement.currentStyle['fontFamily'] : null);

		return parseFloat(size.replace(/[^0-9\.]+/g, ''), 10);
	},
	// Bind single or set of screen events with specified options
	map: function(sets) {
		sets = Wee.$toArray(sets);

		for (var i = 0; i < sets.length; i++) {
			var conf = sets[i];

			if (conf.callback) {
				// Only bind resize event if not disabled
				if (conf.watch !== false) {
					this.$push('evts', conf);

					// Only create event if not already running
					if (! this.$get('on')) {
						this.$set('on', 1);
						this.$set('evts', [conf]);

						// Watch widow resize event for breakpoint changes
						Wee.events.on(window, {
							resize: function() {
								this.$private('check');
							}
						}, {
							scope: this
						});
					}
				}

				// Check current screen match if init = true
				if (conf.init !== false) {
					this.$private('check', true, [conf]);
				}
			}
		}
	}
}, {
	check: function(init, conf) {
		var size = this.$public.size(),
			prev = this.$get('size');
			init = init || false;

		// If breakpoint has been hit or resize logic initialized
		if (size !== prev || init) {
			var evts = conf || this.$get('evts'),
				len = evts.length,
				i = 0;

			for (; i < len; i++) {
				var evt = evts[i],
					sz = evt.size,
					mn = evt.min,
					mx = evt.max;

				// Check match against settings
				if ((! sz && ! mn && ! mx) ||
					(sz && sz === size) ||
					(mn && size >= mn && (init || prev < mn) && (! mx || size <= mx)) ||
					(mx && size <= mx && (init || prev > mx) && (! mn || size >= mn))) {
					Wee.$exec(evt.callback, {
						args: [{
							dir: init ? 0 : ((size > prev) ? 1 : -1),
							size: size,
							prev: prev,
							init: init
						}].concat(evt.args),
						scope: evt.scope
					});
				}
			}

			// Cache updated screen value
			this.$set('size', size);
		}
	}
});