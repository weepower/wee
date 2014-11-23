// Wee (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY

(function(w, d) {
	'use strict';

	var W = (function() {
		var _store = {},
			_undefined;

		return {
			_body: d.body,
			_doc: d,
			_html: d.documentElement,
			_legacy: d.getElementsByClassName ? false : true,
			_slice: [].slice,
			_win: w,

			// Create namespaced controller with specified name, public object, and optional private object
			// Returns undefined
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
									if (Public._destruct !== _undefined) {
										Public._destruct();
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
							Public.$private = function(func) {
								var args = W._slice.call(arguments);

								// Bind all additional arguments to private method call
								args.length > 1 ?
									args.shift() :
									args = [];

								return Private[func].apply(Private, args);
							};
						}

						Private.$public = Public;

						_store[name] = {};

						if (Public._construct !== _undefined) {
							Public._construct();
						}

						return Public;
					})();
				},
				// Extend existing controller
				// Returns undefined
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
			// Get current environment or detect current environment against specified object
			// Defaults to local
			// Returns string|undefined
			$env: function(obj, def) {
				if (obj) {
					W.$set('env', function() {
						var host = location.host;

						Object.keys(obj).forEach(function(key) {
							var el = obj[key];

							if (W.$isString(el) && el.indexOf(':') == -1) {
								if (el == host) {
									return key;
								}
							} else if (W.$exec(el, {
									args: [host]
								}) === true) {
								return key;
							}
						});

						return def || 'local';
					});
				}

				return W.$get('env', 'local');
			},
			// Determine if the current environment is secured over https
			// Optional url can be passed for evaluation
			// Returns boolean
			$envSecure: function(url) {
				return (url || w.location.href).slice(0, 5) == 'https';
			},
			// Get public variable with optional default
			// Accepts optional boolean to set default value if variable doesn't exist
			// Options can be passed if default value being set is a callback
			// Returns mixed
			$get: function(key, def, set, opt) {
				if (key) {
					var split = W._storeData(key),
						root = split[0];
					key = split[1];

					if (root.hasOwnProperty(key)) {
						return root[key];
					} else if (def !== _undefined) {
						def = W.$isFunction(def) ?
							def() :
							(opt ? W.$exec(def, opt) : def);

						if (set) {
							W.$set(key, def);
						}

						return def;
					}

					return null;
				}

				return _store;
			},
			// Set public variable
			// Options can be passed if value is a callback
			// Returns mixed
			$set: function(key, val, opt) {
				var split = W._storeData(key),
					set = W.$isFunction(val) ?
						val() :
						(opt ? W.$exec(val, opt) : val);

				split[0][split[1]] = set;

				return set;
			},
			// Push specified value into public array
			// Returns array
			$push: function(key, a, b) {
				var split = W._storeData(key),
					root = split[0];

				key = split[1];

				if (! root.hasOwnProperty(key)) {
					root[key] = b ? {} : [];
				}

				if (b && ! root[key].hasOwnProperty(a)) {
					root[key][a] = Array.isArray(b) ? [] : {};
				}

				if (b) {
					Array.isArray(b) ?
						root[key][a] = root[key][a].concat(b) :
						root[key][a] = b;
				} else {
					Array.isArray(a) ?
						root[key] = root[key].concat(a) :
						root[key].push(a);
				}

				return root[key];
			},
			// Determine data storage root and key
			// Returns array
			_storeData: function(key) {
				if (key.indexOf(':') == -1) {
					return [_store, key];
				}

				var segs = key.split(':');
				key = segs[0];

				if (! _store.hasOwnProperty(key)) {
					_store[key] = [];
				}

				return [_store[key], segs[1]];
			},
			// Execute specified function or controller method
			// Arguments and scope can be set in the optional options object
			// Arguments defaults to an empty array and the scope defaults to null
			// Returns mixed
			$exec: function(fn, opt) {
				opt = opt || {};

				var conf = W.$extend({
						args: []
					}, opt),
					fns = W.$toArray(fn),
					len = fns.length,
					i = 0;

				for (; i < len; i++) {
					fn = fns[i];

					if (W.$isString(fn)) {
						var segs = fn.split(':');
						fn = W[segs[0]][segs.length > 1 ? segs[1] : 'init'];

						if (! opt.scope) {
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
			// Determine if specified argument is array
			// Returns boolean
			$isArray: function(obj) {
				return Array.isArray(obj);
			},
			// Determine if specified element belongs to specified array
			// Returns int|false
			$inArray: function(obj, el) {
				var i = obj.indexOf(el);
				return i < 0 ? false : i;
			},
			// Cast object to array if it isn't one
			// Returns array
			$toArray: function(obj) {
				return Array.isArray(obj) ? obj : [obj];
			},
			// Determine if specified argument is a string
			// Returns boolean
			$isString: function(obj) {
				return obj && typeof obj == 'string';
			},
			// Determine if specified argument is a function
			// Returns boolean
			$isFunction: function(obj) {
				return obj && {}.toString.call(obj) == '[object Function]';
			},
			// Determine if specified argument is an object
			// Returns boolean
			$isObject: function(obj) {
				return obj && obj.constructor === Object;
			},
			// Get keys from an object
			// Returns array
			$getKeys: function(obj) {
				return Object.keys(obj);
			},
			// Serialize specified object
			// Returns string
			$serialize: function(obj) {
				if (! W.$isObject(obj)) {
					var arr = [],
						sel = W.$first(obj),
						i = 0,
						x = 0;

					if (sel.nodeName == 'FORM') {
						for (; i < sel.elements.length; i++) {
							var el = sel.elements[i];

							if (el.name && el.type != 'file' && el.type != 'reset') {
								if (el.type == 'select-multiple') {
									for (; x < el.options.length; x++) {
										if (el.options[x].selected) {
											arr.push(el.name + '=' + encodeURIComponent(el.options[x].value).replace(/%20/g, '+'));
										}
									}
								} else {
									if (el.type != 'submit' && el.type != 'button') {
										if ((el.type != 'checkbox' && el.type != 'radio') || el.checked) {
											arr.push(el.name + '=' + encodeURIComponent(el.value).replace(/%20/g, '+'));
										}
									}
								}
							}
						}

						return arr.join('&');
					}

					return '';
				}

				return Object.keys(obj).map(function(key) {
					return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
				}).join('&');
			},
			// Extend specified object with specified source object
			// Optionally nest deep with third argument set to true
			// Returns object
			$extend: function(obj, src, deep) {
				obj = obj || {};

				if (src) {
					var keys = Object.keys(src),
						i = 0;

					for (; i < keys.length; i++) {
						var key = keys[i];

						// Attempt to deep nest else set property of object
						if (deep) {
							try {
								obj[key] = (W.$isObject(obj[key])) ?
									W.$extend(obj[key], src[key]) :
									src[key];
							} catch (e) {
								obj[key] = src[key];
							}
						} else {
							obj[key] = src[key];
						}
					}
				}

				return obj;
			},
			// Merge specified array with specified source array
			// Optionally de-duplicate the arrays by passing true
			// Returns array
			$merge: function(arr, arr2, dup) {
				arr = arr.concat(arr2);
				return dup === true ? W.$unique(arr) : arr;
			},
			// Create new array with only unique values from specified array
			// Returns array
			$unique: function(arr) {
				return arr.reverse().filter(function(e, i, arr) {
					return arr.indexOf(e, i + 1) === -1;
				}).reverse();
			},
			// Get matches to specified selector
			// Accepts optional context
			// Returns array
			$: function(sel, context) {
				var el = null;

				if (typeof sel != 'string') {
					el = sel;
				} else {
					// Check for pre-cached element
					if (sel.indexOf('ref:') === 0) {
						return W.$get(sel);
					}

					// Use third-party selector engine if defined
					if (w.WeeSelector !== _undefined) {
						el = w.WeeSelector(sel, context);
					} else {
						context = context !== _undefined ? W.$first(context) : d;

						// If selector doesn't have a space or [ assume its a simple selection
						if (sel == 'window') {
							return [w];
						} else if (sel == 'document') {
							return [d];
						} else if (sel.indexOf(' ') > 0 || sel.indexOf(':') > -1 || sel.indexOf('[') > -1 || sel.indexOf('#') > -1 || sel.lastIndexOf('.') > 0) {
							el = context.querySelectorAll(sel);
						} else {
							var c = sel.charAt(0);

							if (c == '#') {
								el = context.getElementById(sel.substr(1));
							} else if (c == '.') {
								el = W._legacy ?
									context.querySelectorAll(sel) :
									context.getElementsByClassName(sel.substr(1));
							} else {
								el = context.getElementsByTagName(sel);
							}
						}
					}
				}

				if (el === null) {
					return el;
				} else if (el.nodeType !== _undefined || el === w) {
					return [el];
				}

				return W._slice.call(el, 0);
			},
			// Get indexed node of specified element
			// Returns element
			$eq: function(sel, i, context) {
				var el = W.$(sel, context);
				return el[i < 0 ? el.length + i : i];
			},
			// Get first match to specified element
			// Returns element
			$first: function(sel, context) {
				return W.$eq(sel, 0, context);
			},
			// Execute specified function for specified elements|selector
			// Options include arguments, context, and scope
			// Returns undefined
			$each: function(sel, fn, opt) {
				var conf = W.$extend({
						args: []
					}, opt),
					els = W._selArray(sel, conf),
					i = 0;

				if (conf.reverse) {
					els = els.reverse();
				}

				for (; i < els.length; i++) {
					var el = els[i];

					W.$exec(fn, {
						args: [el, i].concat(conf.args),
						scope: conf.scope || el
					});
				}
			},
			// Translate items in an array|selection to new array
			// Returns array
			$map: function(sel, fn, opt) {
				if (! Array.isArray(sel)) {
					sel = W._selArray(sel, opt);
				}

				var conf = W.$extend({
						args: []
					}, opt),
					res = [],
					i = 0;

				for (; i < sel.length; i++) {
					var el = sel[i],
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
			// Get attribute of first element or set matched elements attribute with specified value
			// Returns string|undefined
			$attr: function(sel, a, b) {
				var obj = W.$isObject(a);

				if (b !== _undefined || obj) {
					W.$each(sel, function(el) {
						obj ?
							Object.keys(a).forEach(function(key) {
								el.setAttribute(key, a[key]);
							}) :
							el.setAttribute(a, b);
					});
				} else {
					return W.$first(sel).getAttribute(a);
				}
			},
			// Get data value of first element or set matched elements data with specified value
			// Returns string|undefined
			$data: function(sel, a, b) {
				if (W.$isObject(a)) {
					var obj = {};

					Object.keys(a).forEach(function(key) {
						obj['data-' + key] = a[key];
					});

					a = obj;
				} else {
					a = 'data-' + a;
				}

				return W.$attr(sel, a, b);
			},
			// Add metadata variables to datastore
			// Returns undefined
			$setVars: function() {
				W.$each('[data-set]', function(el) {
					var key = W.$data(el, 'set'),
						val = W.$data(el, 'value');

					key.slice(-2) == '[]' ?
						W.$push(key.slice(0, -2), val) :
						W.$set(key, val);
				});
			},
			// Add bind elements to datastore
			// Returns undefined
			$setRef: function() {
				W.$each('[data-ref], [data-bind]', function(el) {
					var ref = W.$data(el, 'ref');

					if (ref == null) {
						ref = W.$data(el, 'bind');
					}

					var arr = ref.slice(-2) == '[]';

					W.$push('ref',
						arr ? ref.slice(0, -2) : ref,
						arr ? [el] : el
					);
				});
			},
			// Fallback for non-existent chaining
			$chain: function() {},
			// Convert selection to array
			// Returns array
			_selArray: function(sel, opt) {
				opt = opt || {};

				return sel._$_ ?
					sel :
					W.$toArray(W.$isString(sel) ? this.$(sel, opt.context) : sel);
			},
			// Execute specified function when document is ready
			// Returns undefined
			ready: function(fn) {
				W._legacy ?
					d.attachEvent('onreadystatechange', function() {
						if (d.readyState == 'complete') {
							W.$exec(fn);
						}
					}) :
					d.addEventListener('DOMContentLoaded', function() {
						W.$exec(fn);
					});
			}
		};
	})();

	w.Wee = W;

	// Set data variables and bind elements
	W.$setVars();
	W.$setRef();

	// AMD setup
	if (typeof define == 'function' && define.amd) {
		define('wee', [], function() {
			return Wee;
		});
	}
})(this, document);