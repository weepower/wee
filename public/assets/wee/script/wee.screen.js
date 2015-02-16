(function(W) {
	'use strict';

	W.fn.make('screen', {
		// Get current screen value
		// Returns number
		size: function() {
			var size = W._legacy ?
					(W._html.currentStyle ? W._html.currentStyle.fontFamily : null) :
					W._win.getComputedStyle(W._html, null).getPropertyValue('font-family');

			return parseFloat(size.replace(/[^0-9\.]+/g, ''), 10);
		},
		// Bind single or set of screen events with specified options
		map: function(val) {
			var sets = W.$toArray(val),
				scope = this,
				cb = function() {
					scope.$private('check', false);
				},
				i = 0;

			// Delay check 1ms to avoid incorrect size in IE
			setTimeout(function() {
				for (; i < sets.length; i++) {
					var conf = sets[i];

					if (conf.callback) {
						// Only bind resize event if not disabled
						if (conf.watch !== false) {
							scope.$push('evts', conf);

							// Only create event if not already running
							if (! scope.$get('on')) {
								scope.$set('on', 1);
								scope.$set('evts', [conf]);

								// Watch widow resize event for breakpoint changes
								W._legacy ?
									W._win.attachEvent('onresize', cb) :
									W._win.addEventListener('resize', cb);
							}
						}

						// Evaluate current screen if not disabled
						if (conf.init !== false) {
							scope.$private('check', true, [conf]);
						}
					}
				}
			}, 1);
		}
	}, {
		check: function(init, conf) {
			var size = this.$public.size(),
				prev = this.$get('size');

			// If breakpoint has been hit or resize logic initialized
			if (size && (size !== prev || init)) {
				var evts = conf || this.$get('evts'),
					i = 0;

				for (; i < evts.length; i++) {
					var evt = evts[i],
						sz = evt.size,
						mn = evt.min,
						mx = evt.max;

					// Check match against settings
					if ((! sz && ! mn && ! mx) ||
						(sz && sz === size) ||
						(mn && size >= mn && (init || prev < mn) && (! mx || size <= mx)) ||
						(mx && size <= mx && (init || prev > mx) && (! mn || size >= mn))) {
						W.$exec(evt.callback, {
							args: [{
								dir: init ? 0 : (size > prev ? 1 : -1),
								size: size,
								prev: prev,
								init: init
							}].concat(evt.args),
							scope: evt.scope
						});

						// Disable future execution if set for once
						if (evt.once === true) {
							this.$set('evts', this.$get('evts').filter(function(el) {
								return el !== evt;
							}));
						}
					}
				}

				// Set current screen value
				this.$set('size', size);
			}
		}
	});
})(Wee);