(function(W, E) {
	'use strict';

	W.$chain({
		on: function(a, b, c) {
			E.on(this, a, b, c);
			return this;
		},
		off: function(events, options) {
			E.off(this, events, options);
			return this;
		},
		// DEPRECATED
		one: function(a, b, c) {
			E.one(this, a, b, c);
			return this;
		},
		trigger: function(event) {
			E.trigger(this, event);
			return this;
		}
	});
})(Wee, Wee.events);