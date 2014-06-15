// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.make('screen', {
	// Get current screen value
	size: function() {
		var w = window,
			d = document,
			size = this.$get('size', (w.getComputedStyle ?
				w.getComputedStyle(d.documentElement, null).getPropertyValue('font-family') :
				(d.documentElement.currentStyle ? d.documentElement.currentStyle['fontFamily'] : null)));

		return parseInt(size.replace(/\D/g, ''), 10);
	},
	// Bind single or set of screen events with specified options
	map: function(sets) {
		sets = Wee.$toArray(sets);

		for (var i = 0; i < sets.length; i++) {
			var conf = Wee.$extend({
					max: false,
					min: false,
					size: false,
					watch: true
				}, sets[i]);

			if (conf.callback) {
				// Only bind resize event if not disabled
				if (conf.watch) {
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
				if (conf.init) {
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
				var evt = evts[i];

				// Check match against settings
				if ((! evt.size && ! evt.min && ! evt.max) ||
					(evt.size && evt.size === size) ||
					(evt.min !== false && size >= evt.min && (init || prev < evt.min) && (evt.max === false || size <= evt.max)) ||
					(evt.max !== false && size <= evt.max && (init || prev > evt.max) && (evt.min === false || size >= evt.min))) {
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