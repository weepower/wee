/* jshint maxparams: 5 */

(function(W) {
	'use strict';

	W.fn.make('events', {
		/**
		 * Bind specified function to specified element and event
		 *
		 * @param {(HTMLElement|object|string)} target
		 * @param {(object|string)} a - event name or object of events
		 * @param {(function|object)} [b] - event callback or options object
		 * @param {(object|string)} [c] - event options
		 * @param {Array} [c.args] - callback arguments
		 * @param {(HTMLElement|string)} [c.context=document]
		 * @param {(HTMLElement|string)} [c.delegate]
		 * @param {boolean} [c.once=false] - remove event after first execution
		 * @param {object} [c.scope]
		 */
		on: function(target, a, b, c) {
			var evts = [];

			if (W.$isObject(target) && ! target._$) {
				var keys = Object.keys(target),
					i = 0;

				for (; i < keys.length; i++) {
					var key = keys[i];
					evts = target[key];

					this.$private.bind(key, evts, a);
				}
			} else {
				if (typeof a == 'string') {
					evts[a] = b;
				} else {
					evts = a;
					c = b;
				}

				this.$private.bind(target, evts, c);
			}
		},

		/**
		 * Remove specified event from specified element
		 *
		 * @param {(HTMLElement|string)} [target]
		 * @param {(object|string)} a - event name or object of events
		 * @param {function} [b] - specific function to remove
		 */
		off: function(target, a, b) {
			var obj = a;

			if (a) {
				if (typeof a == 'string') {
					obj = [];
					obj[a] = b;
				}

				for (var key in obj) {
					var evts = key.split(' '),
						i = 0;

					for (; i < evts.length; i++) {
						var evt = evts[i],
						fn = obj[evt];

						this.$private.off(target, evt, fn);
					}
				}
			} else {
				this.$private.off(target);
			}
		},

		/**
		 * Get currently bound events to optional specified element and event|function
		 *
		 * @param {(HTMLElement|string)} [target]
		 * @param {string} [event] - event name to match
		 * @param {function} [fn] - specific function to match
		 * @returns {Array} matches
		 */
		bound: function(target, event, fn) {
			var bound = this.$get('evts', []),
				matches = [];
			target = target || [0];

			W.$each(target, function(el) {
				for (var e in bound) {
					var binding = bound[e];

					if (
						(
							el &&
							el !== binding.el
						) ||
						(
							event &&
							! new RegExp('^' + event).test(binding.ev) &&
							! new RegExp(event + '$').test(binding.ev)
						) ||
						(
							fn &&
							String(fn) !== String(binding.fn)
						)
					) {
						continue;
					}

					matches.push(binding);
				}
			});

			return matches;
		},

		/**
		 * Execute event for each matching selection
		 *
		 * @param {(HTMLElement|string)} target
		 * @param {string} event
		 */
		trigger: function(target, event) {
			W.$each(target, function(el) {
				if (W._doc.createEvent) {
					var ev = W._doc.createEvent('HTMLEvents');

					ev.initEvent(event, true, false);
					el.dispatchEvent(ev);
				} else {
					el.fireEvent('on' + event);
				}
			});
		}
	}, {
		/**
		 * Attach specific event logic to element
		 *
		 * @param {Array} els
		 * @param {object} obj
		 * @param {object} c
		 */
		bind: function(els, obj, c) {
			var scope = this;

			// Redefine variables when delegating
			if (c && c.delegate) {
				c.targ = els;
				els = c.delegate;
			}

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
						evt = evt.split('.')[0];

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
								var cont = true;

								if (W._legacy) {
									e = W._win.event;
									e.target = e.srcElement;

									e.preventDefault = function() {
										e.returnValue = false;
									};

									e.stopPropagation = function() {
										e.cancelBubble = true;
									};
								}

								conf.args[0] = e;

								// If watch within parent make sure the target matches the selector
								if (conf.targ) {
									var targ = conf.targ,
										sel = targ._$ ? targ.sel : targ;

									// Update refs when targeting ref
									if (sel.indexOf('ref:') > -1) {
										W.$setRef(el);
									}

									targ = W.$toArray(W.$(sel));

									if (! targ.some(function(el) {
										return el.contains(e.target);
									})) {
										cont = false;
									}

									// Ensure element argument is the target
									conf.args[1] = e.target;
								}

								if (cont) {
									W.$exec(fn, conf);

									// If the event is to be executed once unbind it immediately
									if (conf.once) {
										scope.$public.off(el, evt, f);
									}
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

		/**
		 * Ensure mouse has actually entered or left root element before firing event
		 *
		 * @param {event} e
		 * @param {HTMLElement} parent
		 * @param {function} fn
		 */
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

		/**
		 * Detach event(s) from element
		 *
		 * @param {(HTMLElement|string)} [sel]
		 * @param {string} [evt]
		 * @param {function} [fn]
		 */
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