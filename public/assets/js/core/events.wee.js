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
	// Execute specific element|slector event by name and optional trigger
	trigger: function(sel, evt) {
		Wee.$each(sel, function(el) {
			if (document.createEvent) {
				var event = document.createEvent('HTMLEvents');
				event.initEvent(evt, true, false);
				el.dispatchEvent(event);
			} else {
				el.fireEvent('on' + evt);
			}
		});
	},
	// Bind specified function to specified element|selector and event
	on: function(sel, evts, opt) {
		// For each element attach events
		Wee.$each(sel, function(el) {
			// Loop through object events
			for (var evt in evts) {
				var conf = Wee.$extend({
						args: [],
						scope: el,
						one: false
					}, opt),
					fn = evts[evt];

				if (evt == 'mouseenter' || evt == 'mouseleave') {
					conf.args.unshift(fn);

					fn = 'events:mouseEvent';
					evt = 'mouse' + ((evt == 'mouseenter') ? 'over' : 'out');
				}

				conf.args.unshift(0, el);

				(function(el, evt, fn, conf) {
					var cb = function(e) {
						conf.args[0] = e;

						Wee.$exec(fn, conf);

						if (conf.one) {
							Wee.events.off(el, evt, fn);
						}
					};

					Wee.events.$push(el, evt, {
						fn: fn,
						cb: cb
					});

					el.attachEvent ?
						el.attachEvent('on' + evt, cb) :
						el.addEventListener(evt, cb);
				})(el, evt, fn, conf);
			}
		});
	},
	// Remove specified function to specified element|selector and optional event|function
	off: function(sel, evt, fn) {
		Wee.$each(sel, function(el) {
			var evts = Wee.events.$get(el);

			for (var e in evts) {
				var ev = evts[e];

				if (evt && (evt !== e || (fn && fn !== ev.fn))) {
					continue;
				}

				el.detachEvent ?
					el.detachEvent('on' + e, ev.cb) :
					el.removeEventListener(e, ev.cb);
			}
		});
	},
	// Bind specified function to specified element|selector and event for single execution
	one: function(sel, evts, opt) {
		this.on(sel, evts, Wee.$extend({
			one: true
		}, opt));
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