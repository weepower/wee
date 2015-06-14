(function(W, V) {
	'use strict';

	W.$chain({
		/**
		 * Parse data into DOM selection
		 *
		 * @param {object} data
		 * @returns {$} selection
		 */
		render: function(data) {
			W.$each(this, function(el) {
				W.$html(el, V.render(W.$html(el), data));
			});

			return this;
		}
	});
})(Wee, Wee.view);