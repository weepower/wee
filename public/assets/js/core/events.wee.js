// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.make('events', {
	// Add bindings to the bound object
	map: function(evts, init) {
		this.$set('bound', Wee.$extend(this.$get('bound', {}), evts));

		if (init) {
			this.bind(evts);
		}
	},
	// Traverse the DOM for all available bindings
	bind: function(evts) {
		evts = evts || this.$get('bound');

		if (evts) {
			Wee.$each('[data-bind]', function(el) {
				var id = Wee.$data(el, 'bind');

				if (evts.hasOwnProperty(id)) {
					var inst = evts[id];

					for (var key in inst) {
						var fn = inst[key];

						if (key == 'init') {
							Wee.$exec(fn, {
								arguments: [el]
							});
						} else {
							var evt = {};
							evt[key] = fn;

							Wee.events.on(el, evt);
						}
					}
				}
			});
		}
	},
	// Remove binding by optional name and trigger
	// Removes all events if no parameters are set
	unbind: function(name, evt) {
		var sel = '[data-bind' + (name ? '="' +  + '"]' : ']');

		Wee.$each(sel, function(el) {
			Wee.events.off(el, evt);
			// TODO: fix
		});
	},
	// Execute a specific event by name and optional trigger
	fire: function(name, evt) {
		var events = this.$get('bound');

		if (events.hasOwnProperty(name)) {
			if (events[name].hasOwnProperty(evt)) {
				Wee.$exec(events[name][evt]);
			}
		}
	},
	// Bind a specified function to a specified selector and event
	on: function(sel, evts, opt) {
		// TODO: Loop each around for
		for (var evt in evts) {
			// For each element attach the event
			Wee.$each(sel, function(el) {
				var conf = Wee.$extend({
						scope: null,
						arguments: []
					}, opt),
					fn = evts[evt];

				if (evt == 'mouseenter' || evt == 'mouseleave') {
					conf.arguments.unshift(fn);

					fn = 'events:mouseEvent';
					evt = (evt == 'mouseenter') ? 'mouseover' : 'mouseout';
				}

				conf.arguments.unshift(0, el);

				el.attachEvent ?
					el.attachEvent('on' + evt, function(e) {
						conf.arguments[0] = e;
						Wee.$exec(fn, conf);
					}) :
					el.addEventListener(evt, function(e) {
						conf.arguments[0] = e;
						Wee.$exec(fn, conf);
					}, false);
			});
		}
	},
	// Remove a bound event function from a specified selector
	off: function(sel, evt, fn) {
		Wee.$each(sel, function(el) {
			el.attachEvent ?
				el.detachEvent('on' + evt, function() {
					Wee.$exec(fn);
				}) :
				el.removeEventListener(evt, function() {
					Wee.$exec(fn);
				}, false);
		});
	},
	// Ensure the mouse has actually entered or left the root element before firing the event
	mouseEvent: function(e, parent, fn) {
		var child = e.relatedTarget;

		if (child === parent || this.checkParent(parent, child)) {
			return;
		}

		Wee.$exec(fn);
	},
	// Compare a parent element to a child element
	checkParent: function(parent, child) {
		if (parent === child) {
			return false;
		}

		while (child && child !== parent) {
			child = child.parentNode;
		}

		return child === parent;
	}
});