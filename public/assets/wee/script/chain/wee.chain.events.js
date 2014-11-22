(function(W, E) {
	'use strict';

	W.$chain({
		on: function(a, b, c) {
			E.on(this, a, b, c);
			return this;
		},
		off: function(evts, opt) {
			E.off(this, evts, opt);
			return this;
		},
		one: function(a, b, c) {
			E.one(this, a, b, c);
			return this;
		},
		trigger: function(evt) {
			E.trigger(this, evt);
			return this;
		}
	});
})(Wee, Wee.events);