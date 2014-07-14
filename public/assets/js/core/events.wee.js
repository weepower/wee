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
				var id = Wee.$data(el, 'bind');

				if (evts.hasOwnProperty(id)) {
					var inst = evts[id];

					for (var key in inst) {
						var fn = inst[key];

						if (key == 'init') {
							Wee.$exec(fn, Wee.$extend({
								scope: el
							}, opt));
						} else {
							var evt = {};
							evt[key] = fn;

							Wee.events.on(el, evt, opt);
						}
					}
				}
			});
		}
	},
	// Execute specific event by name and event
	fire: function(name, evt) {
		var bound = this.$get('bound');

		if (bound.hasOwnProperty(name)) {
			if (bound[name].hasOwnProperty(evt)) {
				Wee.$exec(bound[name][evt]);
			}
		}
	},
	// Bind specified function to specified element|selector and event
	// Options include arguments, context, one, scope, and delegate
	on: function(sel, a, b, c) {
		if (Wee.$isString(a)) {
			var obj = [];
			obj[a] = b;
			a = obj;
		} else {
			c = b;
		}

		// Reset variables when watching target
		if (c && c.delegate) {
			c.targ = sel;
			sel = c.delegate;
		}

		// For each element attach events
		Wee.$each(sel, function(el) {
			// Loop through object events
			for (var evt in a) {
				var conf = Wee.$extend({
						args: [],
						one: false,
						scope: el
					}, c),
					fn = a[evt],
					ev = evt,
					f = fn;

				if (evt == 'mouseenter' || evt == 'mouseleave') {
					conf.args.unshift(fn);

					fn = 'events:mouseEvent';
					evt = 'mouse' + ((evt == 'mouseenter') ? 'over' : 'out');
				}

				conf.args.unshift(0, el);

				(function(el, evt, fn, f, conf) {
					var cb = function(e) {
						conf.args[0] = e;

						// If watch within parent make sure the target matches the selector
						if (conf.targ) {
							var t = conf.targ,
								sel = t['_$_'] ? t.sel : t;
								t = Wee.$toArray(Wee.$(sel));

							if (Wee.$inArray(t, e.target) === false) {
								return false;
							}
						}

						Wee.$exec(fn, conf);

						// If the event is to be executed once unbind it immediately
						if (conf.one) {
							Wee.events.off(el, evt, f);
						}
					};

					// Ensure the speficied element, event, and function combination hasn't already been bound
					if (Wee.events.bound(el, ev, f).length < 1) {
						Wee._legacy ?
							el.attachEvent('on' + evt, cb) :
							el.addEventListener(evt, cb);

						Wee.events.$push('evts', {
							el: el,
							ev: ev,
							evt: evt,
							cb: cb,
							fn: f
						});
					}
				})(el, evt, fn, f, conf);
			}
		});
	},
	// Bind specified function to specified element|selector and event for single execution
	one: function(sel, a, b, c) {
		if (Wee.$isString(a)) {
			var obj = [];
			obj[a] = b;
			a = obj;
		} else {
			c = b;
		}

		this.on(sel, a, Wee.$extend({
			one: true
		}, c));
	},
	// Remove specified function to specified element|selector and optional event|function
	off: function(sel, evt, fn) {
		Wee.$each(this.bound(sel, evt, fn), function(e) {
			Wee._legacy ?
				e.el.detachEvent('on' + e.evt, e.cb) :
				e.el.removeEventListener(e.evt, e.cb);

			// Remove object from the bound array
			var bound = Wee.events.$get('evts');

			bound.splice(bound.indexOf(e), 1);
		});
	},
	// Get currently bound events to optional specified element|selector and event|function
	// Returns array of objects
	bound: function(sel, evt, fn) {
		var bound = this.$get('evts'),
			matches = [];

		if (bound) {
			if (sel) {
				Wee.$each(sel, function(el) {
					for (var e in bound) {
						var ev = bound[e];

						if (el !== ev.el || (evt && (evt !== ev.ev || (fn && '' + fn !== '' + ev.fn)))) {
							continue;
						}

						matches.push(ev);
					}
				});
			} else {
				return bound;
			}
		}

		return matches;
	},
	// Execute specific element|slector event by name and optional trigger
	trigger: function(sel, evt) {
		Wee.$each(sel, function(el) {
			if (document.createEvent) {
				var ev = document.createEvent('HTMLEvents');
				ev.initEvent(evt, true, false);
				el.dispatchEvent(ev);
			} else {
				el.fireEvent('on' + evt);
			}
		});
	},
	// Ensure mouse has actually entered or left root element before firing event
	mouseEvent: function(e, parent, fn) {
		var child = e.relatedTarget;

		if (child === parent || Wee.events.checkParent(parent, child)) {
			return;
		}

		var args = Wee._slice.call(arguments);

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