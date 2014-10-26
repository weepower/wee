Wee.$chain({
	on: function(a, b, c) {
		Wee.events.on(this, a, b, c);
		return this;
	},
	off: function(evts, opt) {
		Wee.events.off(this, evts, opt);
		return this;
	},
	one: function(a, b, c) {
		Wee.events.one(this, a, b, c);
		return this;
	},
	trigger: function(evt) {
		Wee.events.trigger(this, evt);
		return this;
	}
});