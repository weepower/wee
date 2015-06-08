(function(W) {
	'use strict';

	W.fn.make('screen', {
		/**
		 * Get current breakpoint value
		 *
		 * @returns {int} breakpoint value
		 */
		size: function() {
			var size = W._legacy ?
					(W._html.currentStyle ? W._html.currentStyle.fontFamily : null) :
					W._win.getComputedStyle(W._html, null).getPropertyValue('font-family');

			return parseFloat(size.replace(/[^0-9\.]+/g, ''), 10);
		},

		/**
		 * Map conditional events to breakpoint values
		 *
		 * @param {(Array|object)} rules - breakpoint rules
		 * @param {int} [rules.size] - specific breakpoint value
		 * @param {int} [rules.min] - minimum breakpoint value
		 * @param {int} [rules.max] - maximum breakpoint value
		 * @param {boolean} [rules.watch=true] - check event on screen resize
		 * @param {boolean} [rules.init=true] - check event on load
		 * @param {object} [rules.scope] - callback scope
		 * @param {Array} [rules.args] - callback arguments
		 * @param {function} [rules.callback]
		 */
		map: function(rules) {
			var scope = this,
				sets = W.$toArray(rules),
				cb = scope.$private.check,
				i = 0;

			// Delay check 1ms to prevent incorrect breakpoint value in IE
			setTimeout(function() {
				for (; i < sets.length; i++) {
					var conf = sets[i];

					if (conf.callback) {
						// Only setup watching when enabled
						if (conf.watch !== false) {
							scope.$push('evts', conf);

							// Only attach event once
							if (! scope.$get('on')) {
								scope.$set('on', 1);
								scope.$set('evts', [conf]);

								// Attach resize event
								W._legacy ?
									W._win.attachEvent('onresize', cb) :
									W._win.addEventListener('resize', cb);
							}
						}

						// Check current screen if not disabled
						if (conf.init !== false) {
							scope.$private.check(true, [conf]);
						}
					}
				}
			}, 1);
		}
	}, {
		/**
		 * Check mapped events for matching conditions
		 *
		 * @private
		 * @param {bool} [init=false] - initial page load
		 * @param {Array} [rules] - breakpoint rules
		 */
		check: function(init, rules) {
			var size = this.$public.size(),
				prev = this.$get('size');

			// If breakpoint has been hit or resize logic initialized
			if (size && (size !== prev || init)) {
				var evts = rules || this.$get('evts'),
					i = 0;

				for (; i < evts.length; i++) {
					var evt = evts[i],
						sz = evt.size,
						mn = evt.min,
						mx = evt.max;

					// Check match against rules
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
						if (evt.once) {
							this.$set('evts', this.$get('evts').filter(function(el) {
								return el !== evt;
							}));
						}
					}
				}

				// Update current breakpoint value
				this.$set('size', size);
			}
		}
	});
})(Wee);