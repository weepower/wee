(function(W) {
	'use strict';

	W.fn.make('events', {
		// Add bindings to bound object with optional exec object and/or init boolean
		// DEPRECATED
		map: function(evts, a, b) {
			this.$set('mapped', W.$extend(this.$get('mapped', {}), evts));

			if (a === true || b === true) {
				this.bind(evts, a === true ? {} : a);
			}
		},
		// Bind against elements stored in the DOM reference
		// DEPRECATED
		bind: function(evts, opt) {
			var mapped = evts || this.$get('mapped');
			evts = [];

			if (mapped) {
				var keys = Object.keys(mapped),
					i = 0;

				for (; i < keys.length; i++) {
					var key = keys[i];
					evts['ref:' + key] = mapped[key];
				}

				this.on(W.$extend({}, evts), opt);
			}
		},
		// Remove bindings to bound object
		// DEPRECATED
		unbind: function(id, evt) {
			this.off('ref:' + id, evt);
		},
		// Execute specific function by name and event
		// DEPRECATED
		fire: function(name, evt) {
			var bound = this.$get('mapped');

			if (bound.hasOwnProperty(name) && bound[name].hasOwnProperty(evt)) {
				W.$exec(bound[name][evt]);
			}
		},
		// Bind specified function to specified element and event
		// Options include arguments, context, one, scope, and delegate
		on: function(sel, a, b, c) {
			var evts = [];

			if (W.$isObject(sel) && ! sel._$) {
				var keys = Object.keys(sel),
					i = 0;

				for (; i < keys.length; i++) {
					var key = keys[i];
					evts = sel[key];

					this.$private('bind', key, evts, a);
				}
			} else {
				if (W.$isString(a)) {
					evts[a] = b;
				} else {
					evts = a;
					c = b;
				}

				// Reset variables when watching target
				if (c && c.delegate) {
					c.targ = sel;
					sel = c.delegate;
				}

				this.$private('bind', sel, evts, c);
			}
		},
		// Bind specified function to specified element and event for single execution
		// DEPRECATED
		one: function(sel, a, b, c) {
			if (W.$isString(a)) {
				var obj = [];
				obj[a] = b;
				a = obj;
			} else {
				c = b;
			}

			this.on(sel, a, W.$extend({
				one: true
			}, c));
		},
		// Remove specified function to specified element and optional event|function
		off: function(sel, a, b) {
			var obj = a;

			if (a) {
				if (W.$isString(a)) {
					obj = [];
					obj[a] = b;
				}

				for (var key in obj) {
					var evts = key.split(' '),
						i = 0;

					for (; i < evts.length; i++) {
						var evt = evts[i],
						fn = obj[evt];

						this.$private('off', sel, evt, fn);
					}
				}
			} else {
				this.$private('off', sel);
			}
		},
		// Get currently bound events to optional specified element and event|function
		// Returns array of objects
		bound: function(sel, evt, fn) {
			var bound = this.$get('evts'),
				matches = [];

			if (bound) {
				if (sel) {
					W.$each(sel, function(el) {
						for (var e in bound) {
							var ev = bound[e];

							if (el !== ev.el || (evt && (evt !== ev.ev || (fn && String(fn) !== String(ev.fn))))) {
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
			W.$each(sel, function(el) {
				if (W._win.createEvent) {
					var ev = W._win.createEvent('HTMLEvents');

					ev.initEvent(evt, true, false);
					el.dispatchEvent(ev);
				} else {
					el.fireEvent('on' + evt);
				}
			});
		}
	}, {
		bind: function(els, obj, c) {
			var scope = this;

			// For each element attach events
			W.$each(els, function(el) {
				// Loop through object events
				for (var key in obj) {
					var evts = key.split(' '),
						i = 0;

					for (; i < evts.length; i++) {
						var conf = W.$extend({
								args: [],
								one: false,
								scope: el
							}, c),
							fn = obj[key],
							evt = evts[i],
							ev = evt,
							f = fn;

						if (evt == 'mouseenter' || evt == 'mouseleave') {
							conf.args.unshift(fn);

							fn = scope.mouseEvent;
							evt = 'mouse' + ((evt == 'mouseenter') ? 'over' : 'out');

							conf.args.unshift(0, c && c.targ ? c.targ : el);
						} else {
							conf.args.unshift(0, el);
						}

						(function(el, evt, fn, f, conf) {
							var cb = function(e) {
								if (W._legacy) {
									e = W._win.event;
									e.target = e.srcElement;

									e.preventDefault = function() {
										e.returnValue = false;
									};
								}

								conf.args[0] = e;

								// If watch within parent make sure the target matches the selector
								if (conf.targ) {
									var t = conf.targ,
										sel = t._$ ? t.sel : t;
									t = W.$toArray(W.$(sel));

									if (! t.some(function(par) {
										return par.contains(e.target);
									})) {
										return false;
									}
								}

								W.$exec(fn, conf);

								// If the event is to be executed once unbind it immediately
								if (conf.one) {
									scope.$public.off(el, evt, f);
								}
							};

							// Ensure the specified element, event, and function combination hasn't already been bound
							if (evt != 'init' && scope.$public.bound(el, ev, f).length < 1) {
								W._legacy ?
									el.attachEvent('on' + evt, cb) :
									el.addEventListener(evt, cb);

								scope.$push('evts', {
									el: el,
									ev: ev,
									evt: evt,
									cb: cb,
									fn: f
								});
							}

							if (evt == 'init' || conf.init === true) {
								cb();
							}
						})(el, evt, fn, f, conf);
					}
				}
			});
		},
		// Ensure mouse has actually entered or left root element before firing event
		mouseEvent: function(e, parent, fn) {
			var child = e.relatedTarget,
				checkParent = function(parent, child) {
					if (parent !== child) {
						while (child && child !== parent) {
							child = child.parentNode;
						}

						return child === parent;
					}

					return false;
				};

			if (child === parent || checkParent(parent, child)) {
				return;
			}

			var args = W._slice.call(arguments);
			args.splice(2, 1);

			W.$exec(fn, {
				args: args,
				scope: this
			});
		},
		off: function(sel, evt, fn) {
			W.$each(this.$public.bound(sel, evt, fn), function(e) {
				W._legacy ?
					e.el.detachEvent('on' + e.evt, e.cb) :
					e.el.removeEventListener(e.evt, e.cb);

				// Remove object from the bound array
				var bound = this.$get('evts');

				bound.splice(bound.indexOf(e), 1);
			}, {
				scope: this
			});
		}
	});
})(Wee);