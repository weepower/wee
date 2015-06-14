(function(W, E) {
	'use strict';

	W.$chain({
		/**
		 * Bind event(s) to selection
		 *
		 * @param {(object|string)} a - event name or object of events
		 * @param {(function|object)} [b] - event callback or options object
		 * @param {(object|string)} [c] - event options
		 * @param {Array} [c.args] - callback arguments
		 * @param {(HTMLElement|string)} [c.context=document]
		 * @param {(HTMLElement|string)} [c.delegate]
		 * @param {boolean} [c.once=false] - remove event after first execution
		 * @param {object} [c.scope]
		 * @returns {$} selection
		 */
		on: function(a, b, c) {
			E.on(this, a, b, c);

			return this;
		},

		/**
		 * Remove event(s) from selection
		 *
		 * @param {(object|string)} a - event name or object of events
		 * @param {function} [b] - specific function to remove
		 * @returns {$} selection
		 */
		off: function(a, b) {
			E.off(this, a, b);

			return this;
		},

		/**
		 * Execute event on selection
		 *
		 * @param {string} event name
		 * @returns {$} selection
		 */
		trigger: function(event) {
			E.trigger(this, event);

			return this;
		}
	});
})(Wee, Wee.events);