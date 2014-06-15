// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.make('events', {
	// Add bindings to bound object with optional exec object and/or init boolean
	map: function(evts, a, b) {
		this.$set('bound', Wee.$extend(this.$get('bound', {}), evts));

		if (a === true || b === true) {
			this.bind(evts, a);
		}
	},
	// Traverse DOM for available bindings
	bind: function(evts, opt) {
		evts = evts || this.$get('bound');

		if (evts) {
			Wee.$each('[data-bind]', function(el) {
				var conf = Wee.$extend({
						scope: el
					}, opt),
					id = Wee.$data(el, 'bind');

				if (evts.hasOwnProperty(id)) {
					var inst = evts[id];

					for (var key in inst) {
						var fn = inst[key];

						if (key == 'init') {
							Wee.$exec(fn, conf);
						} else {
							var evt = {};
							evt[key] = fn;

							Wee.events.on(el, evt, conf);
						}
					}
				}
			});
		}
	},
	// Execute specific event by name and optional trigger
	fire: function(name, evt) {
		var events = this.$get('bound');

		if (events.hasOwnProperty(name)) {
			if (events[name].hasOwnProperty(evt)) {
				Wee.$exec(events[name][evt]);
			}
		}
	},
	// Bind specified function to specified selector and event
	on: function(sel, evts, opt) {
		// For each element attach events
		Wee.$each(sel, function(el) {
			// Loop through object events
			for (var evt in evts) {
				var conf = Wee.$extend({
						args: [],
						scope: el
					}, opt),
					fn = evts[evt];

				if (evt == 'mouseenter' || evt == 'mouseleave') {
					conf.args.unshift(fn);

					fn = 'events:mouseEvent';
					evt = (evt == 'mouseenter') ? 'mouseover' : 'mouseout';
				}

				conf.args.unshift(0, el);

				(function(el, evt, fn, conf) {
					var cb = function(e) {
						conf.args[0] = e;
						Wee.$exec(fn, conf);
					};

					el.attachEvent ?
						el.attachEvent('on' + evt, cb) :
						el.addEventListener(evt, cb, false);
				})(el, evt, fn, conf);
			}
		});
	},
	// Ensure mouse has actually entered or left root element before firing event
	mouseEvent: function(e, parent, fn) {
		var child = e.relatedTarget;

		if (child === parent || Wee.events.checkParent(parent, child)) {
			return;
		}

		var args = Array.prototype.slice.call(arguments);

		Wee.$exec(fn, {
			args: args.slice(0, 1).concat(args.slice(3)),
			scope: this
		});
	},
	// Compare parent element to child element
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
