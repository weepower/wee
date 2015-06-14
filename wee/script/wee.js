// Wee (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY

/* global define */

(function(N, U) {
	'use strict';

	var web = typeof window != 'undefined',
		W = (function() {
			var store = {},
				D = web ? document : {},

				/**
				 * Determine data storage root and key
				 *
				 * @param {string} key
				 * @param {object} [scope=Wee]
				 * @returns {Array} value
				 */
				storeData = function(key, scope) {
					if (key.indexOf(':') < 0) {
						return [scope !== W ? scope : store, key];
					}

					var segs = key.split(':');
					key = segs[0];

					if (! store.hasOwnProperty(key)) {
						store[key] = [];
					}

					return [store[key], segs[1]];
				},

				/**
				 * Check if a node contains another node
				 *
				 * @param {HTMLElement} source
				 * @param {HTMLElement} target
				 * @returns {boolean} match
				 */
				contains = function(source, target) {
					return (source === D ? W._html : source).contains(target);
				};

			return {
				_body: D.body,
				_doc: D,
				_html: D.documentElement,
				_legacy: D.getElementsByClassName ? false : true,
				_slice: [].slice,
				_win: N,
				_$: N.WeeAlias || '$',
				fn: {
					/**
					 * Create a namespaced controller
					 *
					 * @param {string} name
					 * @param {object} pub - public methods and properties
					 * @param {object} [priv] - private methods and properties
					 */
					make: function(name, pub, priv) {
						W.fn[name] = function() {
							var Public = pub,
								Private = priv || {};

							// Ensure the current controller is not being extended
							if (name != '_tmp') {
								var data = {
									store: {},

									/**
									 * Get value from controller storage
									 *
									 * @returns {*}
									 */
									$get: function() {
										return W.$get.apply(this.store, arguments);
									},

									/**
									 * Set value in controller storage
									 *
									 * @returns {*}
									 */
									$set: function() {
										return W.$set.apply(this.store, arguments);
									},

									/**
									 * Push value into controller storage
									 *
									 * @returns {Array}
									 */
									$push: function() {
										return W.$push.apply(this.store, arguments);
									},

									/**
									 * Destroy current controller
									 */
									$destroy: function() {
										if (Private._destruct) {
											Private._destruct();
										}

										if (Public._destruct) {
											Public._destruct();
										}

										delete W[name];
									}
								};

								// Extend public and private objects with data
								Public = W.$extend(Public, data);
								Private = W.$extend(Private, data);
							}

							// If private object exists expose $private methods
							if (priv) {
								/**
								 * Execute private method from public interface
								 *
								 * @deprecated
								 * @param {string} fn - method name
								 */
								Public.$private = function(fn) {
									Private.$public = this;

									return Private[fn].apply(
										Private,
										W._slice.call(arguments).slice(1)
									);
								};

								Private.$public = Public;

								// Execute private constructor
								if (Private._construct !== U) {
									Private._construct();
								}

								for (var fn in Private) {
									Public.$private[fn] = Private[fn];
								}
							}

							// Execute public constructor
							if (Public._construct !== U) {
								Public._construct();
							}

							return W.$extend({}, Public);
						};

						W[name] = new W.fn[name]();
					},

					/**
					 * Extend controller with additional methods and properties
					 *
					 * @param {(object|string)} a - method name or core methods
					 * @param {object} [b] - public methods and properties
					 * @param {object} [c] - private methods and properties
					 */
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

				/**
				 * Get matches to specified selector
				 *
				 * @param {($|HTMLElement|string)} selector
				 * @param {($|HTMLElement|string)} [context=document]
				 * @returns {Array} elements
				 */
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

						// Return nothing if context doesn't exist
						context = context !== U ? W.$(context)[0] : D;

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
													return contains(context, el);
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

						// Use third-party selector engine if defined
						if (N.WeeSelector !== U) {
							el = N.WeeSelector(selector, context);
						} else if (
							selector.indexOf(' ') > 0 ||
							selector.indexOf(',') > 0 ||
							selector.indexOf(':') > -1 ||
							selector.indexOf('[') > -1 ||
							selector.indexOf('#') > -1 ||
							selector.lastIndexOf('.') > 0
						) {
							try {
								el = context.querySelectorAll(selector);
							} catch (e) {
								return W.$parseHTML(selector);
							}
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

					// Join references if available
					return ref.length ? el.concat(ref) : el;
				},

				/**
				 * Create a DOM object from an HTML string
				 *
				 * @param {string} html
				 * @param {boolean} [convert=false] - deprecated
				 * @returns {HTMLElement} element
				 */
				$parseHTML: function(html, convert) {
					var el = W._doc.createElement('div');

					el.innerHTML = html;

					var children = W._slice.call(
						el.children.length ?
							el.children :
							el.childNodes
					);

					return convert ?
						W._win[W._$](children) :
						children;
				},

				/**
				 * Set global variable
				 *
				 * @param {string} key
				 * @param {*} value
				 * @param {object} [options] - available if value is a callback
				 * @param {Array} [options.args]
				 * @param {object} [options.scope]
				 * @returns {*} value
				 */
				$set: function(key, value, options) {
					var split = storeData(key, this),
						set = W._canExec(value) || options ?
							W.$exec(value, options) :
							value;

					split[0][split[1]] = set;

					return set;
				},

				/**
				 * Get global variable
				 *
				 * @param {string} key
				 * @param {*} [fallback]
				 * @param {boolean} [set=false]
				 * @param {object} [options] - available if fallback is a callback
				 * @param {Array} [options.args]
				 * @param {object} [options.scope]
				 * @returns {*} value
				 */
				$get: function(key, fallback, set, options) {
					if (key) {
						var split = storeData(key, this),
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

					return this !== W ? this : store;
				},

				/**
				 * Execute function for each matching selection
				 *
				 * @param {($|Array|HTMLElement|string)} target
				 * @param {function} fn
				 * @param {object} [options]
				 * @param {Array} [options.args]
				 * @param {boolean} [options.reverse=false]
				 * @param {($|HTMLElement|string)} [options.context=document]
				 * @param {object} [options.scope]
				 */
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
							var el = els[i],
								val = W.$exec(fn, {
									args: [el, i].concat(conf.args),
									scope: conf.scope || el
								});

							if (val === false) {
								return;
							}
						}
					}
				},

				/**
				 * Get current environment or set current environment against
				 * specified object
				 *
				 * @param {object} [rules]
				 * @param {string} [fallback=local]
				 * @returns {string} environment
				 */
				$env: function(rules, fallback) {
					if (rules) {
						W.$set('_env', function() {
							var env = fallback || 'local',
								host = location.host;

							for (var rule in rules) {
								var val = rules[rule];

								if (val == host || (W._canExec(val) && W.$exec(val, {
										args: [host]
									}) === true)) {
									env = rule;
									break;
								}
							}

							return env;
						});
					}

					return W.$get('_env', 'local');
				},

				/**
				 * Determine if the environment is secured over https
				 *
				 * @param {string} [url=current url]
				 * @returns {boolean} secure
				 */
				$envSecure: function(url) {
					return (url || N.location.href).slice(0, 5) == 'https';
				},

				/**
				 * Execute specified function or controller method
				 *
				 * @param {function} fn
				 * @param {object} [options]
				 * @param {Array} [options.args]
				 * @param {object} [options.scope]
				 * @returns {*} [response]
				 */
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
							var response = fn.apply(
								conf.scope,
								W.$toArray(conf.args)
							);

							if (len === 1) {
								return response;
							}
						}
					}
				},

				/**
				 * Extend target object with source object
				 *
				 * @param {object} target
				 * @param {object} source
				 * @param {boolean} [deep=false] - extend nested properties
				 * @returns {object} merged
				 */
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

				/**
				 * Extract keys from an object
				 *
				 * @deprecated since 2.1.0
				 * @param {object} value
				 * @returns {Array}
				 */
				$getKeys: function(value) {
					return Object.keys(value);
				},

				/**
				 * Determine if value belongs to array
				 *
				 * @deprecated since 2.1.0
				 * @param {Array} array
				 * @param {string} value
				 * @returns {(bool|int)} false or array index
				 */
				$inArray: function(array, value) {
					var i = array.indexOf(value);
					return i < 0 ? false : i;
				},

				/**
				 * Determine if value is an array
				 *
				 * @param {*} obj
				 * @returns {boolean}
				 */
				$isArray: function(obj) {
					return Array.isArray(obj);
				},

				/**
				 * Determine if value is a function
				 *
				 * @param {*} obj
				 * @returns {boolean}
				 */
				$isFunction: function(obj) {
					return W.$type(obj) == 'function';
				},

				/**
				 * Determine if value is an object
				 *
				 * @param {*} obj
				 * @returns {boolean}
				 */
				$isObject: function(obj) {
					return W.$type(obj) == 'object';
				},

				/**
				 * Determine if value is a string
				 *
				 * @param {*} obj
				 * @returns {boolean}
				 */
				$isString: function(obj) {
					return typeof obj == 'string';
				},

				/**
				 * Translate items in an array|selection to new array
				 *
				 * @param {($|Array|HTMLElement|string)} target - array or selector
				 * @param {function} fn
				 * @param {object} [options]
				 * @param {Array} [options.args]
				 * @param {object} [options.scope]
				 * @returns {Array}
				 */
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

				/**
				 * Merge source array into target array
				 *
				 * @param {Array} target
				 * @param {Array} source
				 * @param {boolean} [unique=false] de-duplicate values
				 * @returns {Array}
				 */
				$merge: function(target, source, unique) {
					target = target.concat(source);

					return unique ?
						W.$unique(target) :
						target;
				},

				/**
				 * Push value into global array
				 *
				 * @param {string} key
				 * @param {*} a
				 * @param {*} [b]
				 * @returns {Array} value
				 */
				$push: function(key, a, b) {
					var split = storeData(key, this),
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

				/**
				 * Serialize object
				 *
				 * @param {object} value
				 * @returns {string} value
				 */
				$serialize: function(value) {
					return Object.keys(value).map(function(key) {
						if (typeof value[key] != 'object') {
							return encodeURIComponent(key) + '=' +
								encodeURIComponent(value[key]);
						}
					}).join('&');
				},

				/**
				 * Add ref elements to datastore
				 * data-bind is deprecated
				 *
				 * @param {(HTMLElement|string)} [context=document]
				 */
				$setRef: function(context) {
					var sets = W.$get('ref');
					context = context ? W.$(context)[0] : D;

					// Clear existing refs if reset
					if (sets) {
						Object.keys(sets).forEach(function(key) {
							W.$set('ref:' + key, sets[key].filter(function(el) {
								return ! (
									! contains(D, el) ||
									(contains(context, el) && context !== el)
								);
							}));
						});
					}

					// Set refs from DOM
					W.$each('[data-ref], [data-bind]', function(el) {
						var ref = el.getAttribute('data-ref') ||
								el.getAttribute('data-bind');

						ref.split(/\s+/).forEach(function(val) {
							W.$push('ref', val, [el]);
						});
					}, {
						context: context
					});
				},

				/**
				 * Add metadata variables to datastore
				 */
				$setVars: function() {
					W.$each('[data-set]', function(el) {
						var key = el.getAttribute('data-set'),
							val = el.getAttribute('data-value'),
							ind = key.search(/\[.*]/g);

						if (ind == -1) {
							W.$set(key, val);
							return;
						}

						var arr = key.slice(ind).slice(1, -1),
							obj = key.slice(0, ind);

						if (arr === '') {
							W.$push(obj, val);
							return;
						}

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
					});
				},

				/**
				 * Cast value to array if it isn't one
				 *
				 * @param {*} value
				 * @returns {Array} value
				 */
				$toArray: function(value) {
					return Array.isArray(value) ? value : [value];
				},

				/**
				 * Determine the JavaScript type of an object
				 *
				 * @param {*} obj
				 * @returns string
				 */
				$type: function(obj) {
					return Object.prototype.toString.call(obj)
						.replace(/^\[object (.+)]$/, '$1')
						.toLowerCase();
				},

				/**
				 * Create new array with only unique values from source array
				 *
				 * @param {Array} array
				 * @returns {Array} unique values
				 */
				$unique: function(array) {
					return array.reverse().filter(function(e, i, array) {
						return array.indexOf(e, i + 1) < 0;
					}).reverse();
				},

				/**
				 * Fallback for non-existent chaining
				 */
				$chain: function() {},

				/**
				 * Determine if value can be executed as a function
				 *
				 * @private
				 * @param {*} value
				 * @returns {boolean} is executable
				 */
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

				/**
				 * Convert selection to array
				 *
				 * @private
				 * @param {($|HTMLElement|string)} selector
				 * @param {object} [options]
				 * @param {(HTMLElement|string)} [options.context=document]
				 * @returns {($|Array)} nodes
				 */
				_selArray: function(selector, options) {
					if (selector._$) {
						return selector;
					}

					options = options || {};
					var el = typeof selector == 'string' ?
						W.$(selector, options.context) :
						selector;

					return el ? W.$toArray(el) : [];
				},

				/**
				 * Execute specified function when document is ready
				 *
				 * @param {(Array|function|string)} fn
				 */
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