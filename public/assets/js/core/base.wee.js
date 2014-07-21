// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

'use strict';

var Wee = (function(w, d) {
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
				Wee[name] = (function() {
					var Public = pub,
						Private = priv || {};

					// Ensure the current controller is not being extended
					if (name != '_tmp') {
						var data = {
							// Private getter and setter methods for controllers
							$get: function(key, def, set, opt) {
								return Wee.$get(name + (key ? ':' + key : ''), def, set, opt);
							},
							$set: function(key, val, opt) {
								return Wee.$set(name + ':' + key, val, opt);
							},
							$push: function(key, a, b) {
								return Wee.$push(name + ':' + key, a, b);
							}
						};

						// Extend defined public and private objects with data functions
						Public = Wee.$extend(pub, data);
						Private = Wee.$extend(priv, data);
					}

					// If private object exists expose $call function for executing private methods
					if (priv) {
						Public.$private = function(func) {
							var args = Wee._slice.call(arguments);

							// Bind all additional arguments to private method call
							args.length > 1 ? args.shift() : args = [];

							return Private[func].apply(Private, args);
						};
					}

					Private.$public = Public;

					_store[name] = {};

					return Public;
				})();
			},
			// Extend existing controller
			// Returns undefined
			extend: function(a, b, c) {
				if (Wee.$isObject(a)) {
					// Merge into the global object
					Wee.$extend(Wee, a);
				} else if (Wee.hasOwnProperty(a)) {
					// Merge the objects else create the controller
					this.make('_tmp', b, c);
					Wee.$extend(Wee[a], Wee._tmp);
					delete Wee._tmp;
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
				this.$set('env', function() {
					var host = location.host;

					for (var key in obj) {
						if (obj[key] == host) {
							return key;
						}
					}

					return def || 'local';
				});
			}

			return this.$get('env', 'local');
		},
		// Determine if the current environment is secured over https
		// Optional url can be passed for evaluation
		// Returns boolean
		$envSecure: function(url) {
			return (url || this._win.location.protocol) == 'https:';
		},
		// Get public variable with optional default
		// Accepts optional boolean to set default value if variable doesn't exist
		// Options can be passed if default value being set is a callback
		// Returns mixed
		$get: function(key, def, set, opt) {
			if (key) {
				var split = this._storeData(key),
					root = split[0],
					key = split[1];

				if (root.hasOwnProperty(key)) {
					return root[key]
				} else if (def !== _undefined) {
					def = this.$isFunction(def) ? def() : (opt ? this.$exec(def, opt) : def);

					if (set) {
						this.$set(key, def);
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
			var split = this._storeData(key),
				set = this.$isFunction(val) ? val() : (opt ? this.$exec(val, opt) : val);
				split[0][split[1]] = set;

			return set;
		},
		// Push specified value into public array
		// Returns array
		$push: function(key, a, b) {
			var split = this._storeData(key),
				root = split[0],
				key = split[1];

			if (! root.hasOwnProperty(key)) {
				root[key] = b ? {} : [];
			}

			b ?
				root[key][a] = b :
				root[key].push(a);

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
			var conf = this.$extend({
					args: []
				}, opt),
				fns = this.$toArray(fn),
				len = fns.length,
				i = 0;

			for (; i < len; i++) {
				var fn = fns[i];

				if (this.$isString(fn)) {
					var segs = fn.split(':');

					if (segs.length === 2) {
						fn = Wee[segs[0]][segs[1]];

						if (! conf.scope) {
							conf.scope = Wee[segs[0]];
						}
					} else {
						return false;
					}
				}

				var response = fn.apply(conf.scope, Wee.$toArray(conf.args));

				if (len === 1) {
					return response;
				}
			}
		},
		// Determine if specified argument is array
		// Returns boolean
		$isArray: function(obj) {
			return obj && (this._legacy ? obj.constructor === Array : Array.isArray(obj));
		},
		// Determine if specified element belongs to specified array
		// Returns int|false
		$inArray: function(obj, el) {
			for (var i = 0; i < obj.length; i++) {
				if (obj[i] === el) {
					return i;
				}
			}

			return false;
		},
		// Cast object to array if it isn't one
		// Returns array
		$toArray: function(obj) {
			return this.$isArray(obj) ? obj : [obj];
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
			if (Object.keys) {
				return Object.keys(obj);
			}

			var keys = [];

			for (var key in obj) {
				keys.push(key);
			}

			return keys;
		},
		// Serialize specified object
		// Returns string
		$serialize: function(obj) {
			var res = [];

			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					res.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
				}
			}

			return res.join('&');
		},
		// Remove leading and trailing whitespace
		// Returns string
		$trim: function(str) {
			return this._legacy ? str.replace(/^\s+|\s+$/g, '') : str.trim();
		},
		// Extend specified object with specified source object
		// Optionally nest deep with third argument set to true
		// Returns object
		$extend: function(obj, src, deep) {
			obj = obj || {};

			for (var key in src) {
				// Attempt to deep nest else set property of object
				if (deep) {
					try {
						obj[key] = (this.$isObject(obj[key])) ?
							this.$extend(obj[key], src[key]) :
							src[key];
					} catch(e) {
						obj[key] = src[key];
					}
				} else {
					obj[key] = src[key];
				}
			}

			return obj;
		},
		// Get matches to specified selector
		// Accepts optional context
		// Returns array
		$: function(sel, context) {
			if (typeof sel !== 'string') {
				return sel;
			}

			// Use third-party selector engine if defined
			if (this._win.WeeSelector !== _undefined) {
				return WeeSelector(sel, context);
			}

			var el = null;
				context = context !== _undefined ? this.$first(context) : d;

			// If selector doesn't have a space or [ assume its a simple selection
			if (sel == 'window') {
				return [w];
			} else if (sel == 'document') {
				return [d];
			} else if (sel.indexOf(' ') > 0 || sel.indexOf(':') > -1 || sel.indexOf('[') > -1 || sel.indexOf('#') > -1 || sel.indexOf('.') > 0) {
				el = context.querySelectorAll(sel);
			} else {
				var c = sel.charAt(0);

				if (c == '#') {
					el = context.getElementById(sel.substr(1));
				} else if (c == '.') {
					el = this._legacy ?
						context.querySelectorAll(sel) :
						context.getElementsByClassName(sel.substr(1));
				} else {
					el = context.getElementsByTagName(sel);
				}
			}

			if (el === null || el.nodeType !== _undefined) {
				return el;
			}

			return this._legacy ? this._nodeArray(el) : Wee._slice.call(el, 0);
		},
		// Get first match to specified element
		// Returns element
		$first: function(sel) {
			if (sel['_$_']) {
				return sel[0];
			}

			var el = this.$(sel);

			return Wee.$isArray(el) ? el[0] : el;

		},
		// Execute specified function for specified elements|selector
		// Options include arguments, context, and scope
		// Returns undefined
		$each: function(sel, fn, opt) {
			var conf = this.$extend({
					args: []
				}, opt),
				el = this._selArray(sel, conf),
				len = el.length,
				i = 0;

			if (conf.reverse) {
				el = el.reverse();
			}

			for (; i < len; i++) {
				this.$exec(fn, {
					args: [el[i], i].concat(conf.args),
					scope: conf.scope || el[i]
				});
			}
		},
		// Translate items in an array|selection to new array
		// Returns array
		$map: function(sel, fn) {
			if (! this.$isArray(sel)) {
				sel = this._selArray(sel);
			}

			var res = [],
				len = sel.length,
				i = 0;

			for (; i < len; i++) {
				var el = sel[i],
					val = this.$exec(fn, {
						args: [el, i],
						scope: el
					});

				if (val !== false) {
					res.push(val);
				}
			}

			return res;
		},
		// Determine if specified element has specified class
		// Returns boolean
		$hasClass: function(sel, val) {
			var el = this.$first(sel);

			return Wee._legacy ?
				new RegExp('(^| )' + val + '( |$)', 'gi').test(el.className) :
				el.classList.contains(val);
		},
		// Add specified class name to specified element
		// Returns undefined
		$addClass: function(sel, val) {
			this.$each(sel, function(el) {
				if (! Wee.$hasClass(el, val)) {
					Wee._legacy ?
						el.className = el.className + ' ' + val :
						el.classList.add(val);
				}
			});
		},
		// Removes specified class from specified element
		// Returns undefined
		$removeClass: function(sel, val) {
			this.$each(sel, function(el) {
				Wee._legacy ?
					el.className = el.className.replace(new RegExp('(^|\\b)' + val.split(' ').join('|') + '(\\b|$)', 'gi'), ' ') :
					el.classList.remove(val);
			});
		},
		// Get CSS value of first element or set matched elements CSS property with specified value
		// Accepts either rule object or rule, value
		// Returns string|undefined
		$css: function(sel, a, b) {
			if (b || this.$isObject(a)) {
				this.$each(sel, function(el) {
					if (Wee.$isObject(a)) {
						for (var key in a) {
							el.style[key] = a[key];
						}
					} else {
						el.style[a] = b;
					}
				});
			} else {
				var el = this.$first(sel);

				return this._legacy ?
					el.currentStyle[a] :
					getComputedStyle(el, null)[a];
			}
		},
		// Get HTML value of first element or set matched elements HTML with specified value
		// Returns string|undefined
		$html: function(sel, val) {
			if (val === _undefined) {
				return this.$first(sel).innerHTML;
			}

			this.$each(sel, function(el) {
				el.innerHTML = val;
			});
		},
		// Get attribute of first element or set matched elements attribute with specified value
		// Returns string|undefined
		$attr: function(sel, key, val) {
			if (val === _undefined) {
				return this.$first(sel).getAttribute(key);
			}

			this.$each(sel, function(el) {
				el.setAttribute(key, val);
			});
		},
		// Get data value of first element or set matched elements data with specified value
		// Returns string|undefined
		$data: function(sel, key, val) {
			return this.$attr(sel, 'data-' + key, val);
		},
		// Add metadata variables to datastore
		// Returns undefined
		$setVars: function() {
			this.$each('[data-set]', function(el) {
				var key = Wee.$data(el, 'set'),
					val = Wee.$data(el, 'value');

				key.indexOf('[]') == -1 ?
					Wee.$set(key, val) :
					Wee.$push(key.replace('[]', ''), val);
			});
		},
		// Convert selection to array
		// Returns array
		_selArray: function(sel, conf) {
			conf = conf || {};

			return sel['_$_'] ?
				sel :
				this.$isString(sel) ?
					this.$toArray(this.$(sel, conf.context)) :
					(this.$isArray(sel) ? sel : [sel]);
		},
		// Convert nodeList to array
		// Returns array
		_nodeArray: function(el) {
			var arr = [],
				i = 0;

			for (; i < el.length; i++) {
				arr[i] = el[i];
			}

			return arr;
		},
		// Execute specified function when document is ready
		// Returns undefined
		ready: function(fn) {
			this._legacy ?
				d.attachEvent('onreadystatechange', function() {
					if (d.readyState == 'complete') {
						Wee.$exec(fn);
					}
				}) :
				d.addEventListener('DOMContentLoaded', function() {
					Wee.$exec(fn);
				});
		},
		// Toggle HTML JavaScript status class and set data variables
		// Returns undefined
		init: function() {
			this.$removeClass(this._html, 'no-js');
			this.$addClass(this._html, 'js');
			this.$setVars();
		}
	};
})(this, document);

Wee.init();