// Wee (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY

(function(N, U) {
	'use strict';

	var web = typeof window != 'undefined',
		W = (function() {
			var _store = {},
				D = web ? document : {};

			return {
				_body: D.body,
				_doc: D,
				_html: D.documentElement,
				_legacy: D.getElementsByClassName ? false : true,
				_slice: [].slice,
				_win: N,

				// Create namespaced controller
				fn: {
					make: function(name, pub, priv) {
						W[name] = (function() {
							var Public = pub,
								Private = priv || {};

							// Ensure the current controller is not being extended
							if (name != '_tmp') {
								var data = {
									// Private getter and setter methods for controllers
									$get: function(key, def, set, opt) {
										return W.$get(name + (key ? ':' + key : ''), def, set, opt);
									},
									$set: function(key, val, opt) {
										return W.$set(name + ':' + key, val, opt);
									},
									$push: function(key, a, b) {
										return W.$push(name + ':' + key, a, b);
									},
									// Destroy current controller
									$destroy: function() {
										if (Public._destruct) {
											Public._destruct();
										}

										if (Private._destruct) {
											Private._destruct();
										}

										delete W[name];
									}
								};

								// Extend defined public and private objects with data functions
								Public = W.$extend(pub, data);
								Private = W.$extend(priv, data);
							}

							// If private object exists expose $call function for executing private methods
							if (priv) {
								Public.$private = function(fn) {
									var args = W._slice.call(arguments);

									// Bind all additional arguments to private method call
									args.length ?
										args.shift() :
										args = [];

									return Private[fn].apply(Private, args);
								};
							}

							Private.$public = Public;

							_store[name] = {};

							if (Public._construct !== U) {
								Public._construct();
							}

							if (Private._construct !== U) {
								Private._construct();
							}

							return Public;
						})();
					},
					// Extend existing controller with additional methods and properties
					extend: function(a, b, c) {
						if (W.$isObject(a)) {
							// Merge into the global object
							W.$extend(W, a);
						} else if (W.hasOwnProperty(a)) {
							// Merge the objects else create the controller
							this.make('_tmp', b, c);
							W.$extend(W[a], W._tmp);
							delete W._tmp;
						} else {
							this.make(a, b, c);
						}
					}
				},
				// Get matches to specified selector
				// Accepts optional context
				// Returns array
				$: function(selector, context) {
					var el = null,
						ref = [];

					if (typeof selector != 'string') {
						el = selector;
					} else {
						if (selector == 'window') {
							return [N];
						}

						if (selector == 'document') {
							return [D];
						}

						// Lookup the context and return nothing if it doesn't exist
						context = context !== U ? W.$first(context) : D;

						if (! context) {
							return [];
						}

						// Check for pre-cached elements
						if (selector.indexOf('ref:') > -1) {
							var split = selector.split(',').filter(function(sel) {
								sel = sel.trim();

								if (sel.slice(0, 4) == 'ref:') {
									sel = W.$get(sel);

									// Apply context filter if not document
									if (sel) {
										ref = ref.concat(
											context === D ?
												sel :
												sel.filter(function(el) {
													return context.contains(el);
												})
										);
									}

									return false;
								}

								return true;
							});

							if (split.length) {
								selector = split.join(',');
							} else {
								return ref;
							}
						}

						if (N.WeeSelector !== U) { // Use third-party selector engine if defined
							el = N.WeeSelector(selector, context);
						} else if (
							selector.indexOf(' ') > 0 ||
							selector.indexOf(',') > 0 ||
							selector.indexOf(':') > -1 ||
							selector.indexOf('[') > -1 ||
							selector.indexOf('#') > -1 ||
							selector.lastIndexOf('.') > 0
						) {
							el = context.querySelectorAll(selector);
						} else {
							var pre = selector.charAt(0);

							if (pre == '#') {
								el = context.getElementById(selector.substr(1));
							} else if (pre == '.') {
								el = W._legacy ?
									context.querySelectorAll(selector) :
									context.getElementsByClassName(selector.substr(1));
							} else {
								el = context.getElementsByTagName(selector);
							}
						}
					}

					if (! el) {
						el = ref;
					} else if (el.nodeType !== U || el === N) {
						el = [el];
					} else {
						el = W._slice.call(el, 0);
					}

					// Join refs if available
					return ref.length ? el.concat(ref) : el;
				},
				// Set global variable
				// Options can be passed if value is a callback
				// Returns mixed
				$set: function(key, value, options) {
					var split = W._storeData(key),
						set = W._canExec(value) || options ?
							W.$exec(value, options) :
							value;

					split[0][split[1]] = set;

					return set;
				},
				// Get global variable
				// Accepts optional boolean to set default value if variable doesn't exist
				// Options can be passed if default value being set is a callback
				// Returns mixed
				$get: function(key, fallback, set, options) {
					if (key) {
						var split = W._storeData(key),
							root = split[0];
						key = split[1];

						if (root.hasOwnProperty(key)) {
							return root[key];
						}

						if (fallback !== U) {
							fallback = W._canExec(fallback) ?
							W.$exec(fallback, options) || options :
								fallback;

							if (set) {
								W.$set(key, fallback);
							}

							return fallback;
						}

						return null;
					}

					return _store;
				},
				// Get attribute of first matching selection or set attribute of each matching selection
				// Returns string|undefined
				$attr: function(target, a, b) {
					var obj = W.$isObject(a);

					if (b !== U || obj) {
						var func = ! obj && W._canExec(b);

						W.$each(target, function(el, i) {
							obj ?
								Object.keys(a).forEach(function(key) {
									el.setAttribute(key, a[key]);
								}) :
								el.setAttribute(a, func ?
										W.$exec(b, {
											args: [i, el[a]],
											scope: el
										}) :
										b
								);
						});
					} else {
						return W.$first(target).getAttribute(a);
					}
				},
				// Get data of first matching selection or set data of each matching selection
				// Returns string|undefined
				$data: function(target, a, b) {
					if (W.$isObject(a)) {
						var obj = {};

						Object.keys(a).forEach(function(key) {
							obj['data-' + key] = a[key];
						});

						a = obj;
					} else {
						a = 'data-' + a;
					}

					return W.$attr(target, a, b);
				},
				// Execute function for each matching selection
				// Options include arguments, reverse, context, and scope
				$each: function(target, fn, options) {
					if (target) {
						var conf = W.$extend({
								args: []
							}, options),
							els = W._selArray(target, conf),
							i = 0;

						if (conf.reverse && ! els._$) {
							els = els.reverse();
						}

						for (; i < els.length; i++) {
							var el = els[i];

							W.$exec(fn, {
								args: [el, i].concat(conf.args),
								scope: conf.scope || el
							});
						}
					}
				},
				// Get current environment or detect current environment against specified object
				// Defaults to local
				// Returns string|undefined
				$env: function(rules, fallback) {
					if (rules) {
						W.$set('_env', function() {
							var host = location.host;

							Object.keys(rules).forEach(function(key) {
								var el = rules[key];

								if (el == host || (W._canExec(el) && W.$exec(el, {
										args: [host]
									}))) {
									return key;
								}
							});

							return fallback || 'local';
						});
					}

					return W.$get('_env', 'local');
				},
				// Determine if the environment is secured over https
				// Optional url can be passed for evaluation
				// Returns boolean
				$envSecure: function(url) {
					return (url || N.location.href).slice(0, 5) == 'https';
				},
				// Get indexed node of matching selection
				// Returns element
				$eq: function(target, index, context) {
					var el = W.$(target, context);
					return el[index < 0 ? el.length + index : index];
				},
				// Execute specified function or controller method
				// Arguments and scope can be set in the optional options object
				// Arguments defaults to an empty array and the scope defaults to null
				// Returns mixed
				$exec: function(fn, options) {
					options = options || {};

					var conf = W.$extend({
							args: []
						}, options),
						fns = W.$toArray(fn),
						len = fns.length,
						i = 0;

					for (; i < len; i++) {
						fn = fns[i];

						if (typeof fn == 'string') {
							var segs = fn.split(':');
							fn = W[segs[0]][segs.length > 1 ? segs[1] : 'init'];

							if (! options.scope) {
								conf.scope = W[segs[0]];
							}
						}

						if (W.$isFunction(fn)) {
							var response = fn.apply(conf.scope, W.$toArray(conf.args));

							if (len === 1) {
								return response;
							}
						}
					}
				},
				// Extend target object with source object
				// Optionally nest deep with third argument set to true
				// Returns object
				$extend: function(target, source, deep) {
					target = target || {};

					if (source) {
						for (var key in source) {
							var src = source[key];

							if (deep && (W.$isObject(src) || W.$isArray(src))) {
								target[key] = W.$extend(target[key], src, deep);
							} else if (src !== U) {
								target[key] = src;
							}
						}
					}

					return target;
				},
				// Get the first element of a matching selection
				// Returns element
				$first: function(target, context) {
					return W.$eq(target, 0, context);
				},
				// Get keys from an object
				// Returns array
				// DEPRECATED
				$getKeys: function(value) {
					return Object.keys(value);
				},
				// Determine if value belongs to array
				// Returns int|false
				// DEPRECATED
				$inArray: function(array, value) {
					var i = array.indexOf(value);
					return i < 0 ? false : i;
				},
				// Determine if value is an array
				// Returns boolean
				$isArray: function(value) {
					return Array.isArray(value);
				},
				// Determine if value is a function
				// Returns boolean
				$isFunction: function(value) {
					return value && {}.toString.call(value) == '[object Function]';
				},
				// Determine if value is an object
				// Returns boolean
				$isObject: function(value) {
					return value && value.constructor === Object;
				},
				// Determine if value is a string
				// Returns boolean
				$isString: function(value) {
					return typeof value == 'string';
				},
				// Translate items in an array|selection to new array
				// Returns array
				$map: function(target, fn, options) {
					if (! Array.isArray(target)) {
						target = W._selArray(target, options);
					}

					var conf = W.$extend({
							args: []
						}, options),
						res = [],
						i = 0;

					for (; i < target.length; i++) {
						var el = target[i],
							val = W.$exec(fn, {
								args: [el, i].concat(conf.args),
								scope: conf.scope || el
							});

						if (val !== false) {
							res.push(val);
						}
					}

					return res;
				},
				// Merge source array into target array
				// Optionally de-duplicate the arrays by passing true
				// Returns array
				$merge: function(target, source, unique) {
					target = target.concat(source);
					return unique ? W.$unique(target) : target;
				},
				// Push value into global array
				// Returns array
				$push: function(key, a, b) {
					var split = W._storeData(key),
						root = split[0];
					key = split[1];

					if (! root.hasOwnProperty(key)) {
						root[key] = b !== U ? {} : [];
					}

					if (b !== U) {
						var isArr = Array.isArray(b);

						if (! root[key].hasOwnProperty(a)) {
							root[key][a] = isArr ? [] : {};
						}

						root[key][a] = isArr ? root[key][a].concat(b) : b;
					} else {
						Array.isArray(a) ?
							root[key] = root[key].concat(a) :
							root[key].push(a);
					}

					return root[key];
				},
				// Serialize object
				// Returns string
				$serialize: function(value) {
					return Object.keys(value).map(function(key) {
						if (typeof value[key] == 'string') {
							return encodeURIComponent(key) + '=' + encodeURIComponent(value[key]);
						}
					}).join('&');
				},
				// Add ref elements to datastore
				// data-bind is DEPRECATED
				$setRef: function(context) {
					var sets = W.$get('ref');
					context = context ? W.$first(context) : D;

					// Clear existing refs if reset
					if (sets) {
						Object.keys(sets).forEach(function(key) {
							W.$set('ref:' + key, sets[key].filter(function(el) {
								return ! (! D.contains(el) || (context.contains(el) && context !== el));
							}));
						});
					}

					// Set refs from DOM
					W.$each('[data-ref], [data-bind]', function(el) {
						var ref = el.getAttribute('data-ref') || el.getAttribute('data-bind');

						ref.split(/\s+/).forEach(function(val) {
							W.$push('ref', val, [el]);
						});
					}, {
						context: context
					});
				},
				// Add metadata variables to datastore
				$setVars: function() {
					W.$each('[data-set]', function(el) {
						var key = W.$data(el, 'set'),
							val = W.$data(el, 'value'),
							ind = key.search(/\[.*]/g);

						if (ind > 0) {
							var arr = key.slice(ind).slice(1, -1),
								obj = key.slice(0, ind);

							if (arr === '') {
								W.$push(obj, val);
							} else {
								var segs = arr.split(']['),
									len = segs.length - 1;
								key = segs[0];

								if (len) {
									var set = {},
										ref,
										i = 1;

									ref = set[key] = {};

									for (i; i <= len; i++) {
										var last = i === len;

										ref[segs[i]] = last ? val : {};

										if (! last) {
											ref = ref[segs[i]];
										}
									}

									W.$set(obj, W.$extend(Wee.$get(obj, {}), set, true));
								} else {
									W.$push(obj, key, val);
								}
							}
						} else {
							W.$set(key, val);
						}
					});
				},
				// Cast object to array if it isn't one
				// Returns array
				$toArray: function(value) {
					return Array.isArray(value) ? value : [value];
				},
				// Create new array with only unique values from source array
				// Returns array
				$unique: function(array) {
					return array.reverse().filter(function(e, i, array) {
						return array.indexOf(e, i + 1) < 0;
					}).reverse();
				},
				// Fallback for non-existent chaining
				$chain: function() {},
				// Determine if value can be executed
				// Returns boolean
				_canExec: function(value) {
					if (typeof value == 'string' && value.indexOf(':') > -1) {
						var split = value.split(':'),
							fn = split[0],
							method = split[1];

						if (W[fn] && W[fn][method]) {
							value = W[fn][method];
						}
					}

					return W.$isFunction(value);
				},
				// Convert selection to array
				// Returns array
				_selArray: function(selector, options) {
					if (selector._$) {
						return selector;
					}

					options = options || {};
					var el = typeof selector == 'string' ? W.$(selector, options.context) : selector;

					return el ? W.$toArray(el) : [];
				},
				// Determine data storage root and key
				// Returns array
				_storeData: function(key) {
					if (key.indexOf(':') < 0) {
						return [_store, key];
					}

					var segs = key.split(':');
					key = segs[0];

					if (! _store.hasOwnProperty(key)) {
						_store[key] = [];
					}

					return [_store[key], segs[1]];
				},
				// Execute specified function when document is ready
				ready: function(fn) {
					D.readyState == 'complete' ?
						W.$exec(fn) :
						W._legacy ?
							D.attachEvent('onreadystatechange', function() {
								if (D.readyState == 'complete') {
									W.$exec(fn);
								}
							}) :
							D.addEventListener('DOMContentLoaded', function() {
								W.$exec(fn);
							});
				}
			};
		})();

	N.Wee = W;

	// Set data variables and bind elements
	if (web) {
		W.$setVars();
		W.$setRef();
	}

	// AMD setup
	if (typeof define == 'function' && define.amd) {
		define('wee', [], function() {
			return W;
		});
	}
})(this, undefined);