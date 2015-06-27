(function(W) {
	'use strict';

	W.fn.make('screen', {
		/**
		 * Get current breakpoint value
		 *
		 * @returns {int} breakpoint value
		 */
		size: function() {
			var style = W._html.currentStyle,
				size = W._legacy ?
				(style ?
					style.fontFamily :
					null
				) :
				W._win.getComputedStyle(W._html, null)
					.getPropertyValue('font-family');

			return parseFloat(
				size.replace(/[^0-9\.]+/g, ''),
				10
			);
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
		 * @param {function} rules.callback
		 */
		map: function(rules) {
			var priv = this.$private,
				sets = W.$toArray(rules),
				i = 0;

			// Delay check 1ms to prevent incorrect breakpoint value in IE
			setTimeout(function() {
				for (; i < sets.length; i++) {
					priv.addRule(sets[i]);
				}
			}, 1);
		}
	}, {
		/**
		 * Setup initial variables
		 *
		 * @private
		 */
		_construct: function() {
			this.events = [];
		},

		/**
		 * Add individual ruleset to mapped events
		 *
		 * @private
		 * @param {object} conf - breakpoint rules
		 * @param {int} [conf.size] - specific breakpoint value
		 * @param {int} [conf.min] - minimum breakpoint value
		 * @param {int} [conf.max] - maximum breakpoint value
		 * @param {boolean} [conf.watch=true] - check event on screen resize
		 * @param {boolean} [conf.init=true] - check event on load
		 * @param {object} [conf.scope] - callback scope
		 * @param {Array} [conf.args] - callback arguments
		 * @param {function} conf.callback
		 */
		addRule: function(conf) {
			if (conf.callback) {
				var scope = this,
					check = scope.check.bind(scope);

				// Only setup watching when enabled
				if (conf.watch !== false) {
					scope.events.push(conf);

					// Only attach event once
					if (! this.bound) {
						scope.bound = 1;
						scope.events = [conf];

						// Attach resize event
						W._legacy ?
							W._win.attachEvent('onresize', check) :
							W._win.addEventListener('resize', check);
					}
				}

				// Check current screen if not disabled
				if (conf.init !== false) {
					check(true, [conf]);
				}
			}
		},

		/**
		 * Check mapped events for matching conditions
		 *
		 * @private
		 * @param {boolean} [init=false] - initial page load
		 * @param {Array} [rules] - breakpoint rules
		 */
		check: function(init, rules) {
			var scope = W.screen,
				priv = scope.$private,
				size = scope.size(),
				prev = priv.current;

			// If breakpoint has been hit or resize logic initialized
			if (size && (size !== prev || init === true)) {
				var evts = rules || priv.events,
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
						priv.execute(evt, {
							dir: init ? 0 : (size > prev ? 1 : -1),
							size: size,
							prev: prev,
							init: init
						});
					}
				}

				// Update current breakpoint value
				priv.current = size;
			}
		},

		/**
		 * Execute a matching breakpoint callback
		 *
		 * @private
		 * @param {object} evt
		 * @param {object} data
		 */
		execute: function(evt, data) {
			W.$exec(evt.callback, {
				args: [data].concat(evt.args),
				scope: evt.scope
			});

			// Disable future execution if set for once
			if (evt.once) {
				this.events = this.events.filter(function(el) {
					return el !== evt;
				});
			}
		}
	});
})(Wee);