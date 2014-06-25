// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

'use strict';

var Wee = (function(w, d) {
	var _store = {};

	return {
		// Create controller with specified name, public object, and optional private object
		fn: {
			make: function(name, pub, priv) {
				Wee[name] = (function() {
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
						},
						// Extend defined public and private objects with data functions
						Public = Wee.$extend(pub, data),
						Private = Wee.$extend(priv, data);

					// If private object exists expose $call function for executing private methods
					if (priv) {
						Public.$private = function(func) {
							var args = [].slice.call(arguments);

							// Bind all additional arguments to private method call
							(args.length > 1) ? args.shift() : args = null;

							return Private[func].apply(Private, args);
						};
					}

					Private.$public = Public;

					_store[name] = {};

					return Public;
				})();
			},
			// Extend existing controller
			extend: function(name, pub, priv) {
				if (name == '') {
					// Merge into the global object
					Wee.$extend(Wee, pub);
				} else if (Wee.hasOwnProperty(name)) {
					// Merge the objects else create the controller
					this.make('tMod', pub, priv);
					Wee.$extend(Wee[name], Wee.tMod);
					delete Wee.tMod;
				} else {
					this.make(name, pub, priv);
				}
			}
		},
		// Get current environment or detect current environment against specified object
		// Defaults to local
		// Returns environment string
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
		// Get public variable with optional default
		// Accepts optional boolean to set default value if variable doesn't exist
		// Options can be passed if default value being set is a callback
		// Returns mixed value
		$get: function(key, def, set, opt) {
			if (key) {
				var split = this._storeData(key),
					root = split[0],
					key = split[1];

				if (root.hasOwnProperty(key)) {
					return root[key]
				} else if (def !== undefined) {
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
		// Returns mixed value
		$set: function(key, val, opt) {
			var split = this._storeData(key),
				set = (this.$isFunction(val)) ? val() : (opt ? this.$exec(val, opt) : val);
				split[0][split[1]] = set;

			return set;
		},
		// Push specified value into public array
		// Returns modified array
		$push: function(key, a, b) {
			var split = this._storeData(key),
				root = split[0],
				key = split[1];

			if (! root.hasOwnProperty(key)) {
				root[key] = b ? {} : [];
			}

			if (b) {
				root[key][a] = b;
			} else {
				root[key].push(a);
			}

			return root[key];
		},
		// Determine data storage root and key
		// Returns array
		_storeData: function(key) {
			if (key.indexOf(':') !== -1) {
				var segs = key.split(':');
				key = segs[0];

				if (! _store.hasOwnProperty(key)) {
					_store[key] = [];
				}

				return [_store[key], segs[1]];
			}

			return [_store, key];
		},
		// Execute specified function or controller method
		// Arguments and scope can be set in the options object
		$exec: function(fn, opt) {
			var conf = this.$extend({
					args: [],
					scope: null
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

						if (conf.scope == null) {
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
			return (obj && (obj.isArray || Object.prototype.toString.call(obj) == '[object Array]'));
		},
		// Determine if specified element belongs to specified array
		// Returns index else false
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
			return typeof obj == 'string';
		},
		// Determine if specified argument is a function
		// Returns boolean
		$isFunction: function(obj) {
			return obj && {}.toString.call(obj) == '[object Function]';
		},
		// Determine if specified argument is an object
		// Returns boolean
		$isObject: function(obj) {
			return obj && typeof obj == 'object' && ! this.$isArray(obj);
		},
		// Get keys from an object
		// Returns array of strings
		$getKeys: function(obj) {
			if (Object.keys) {
				return Object.keys(obj);
			}

			return this.$map(obj, function(key) {
				return key
			});
		},
		// Serialize specified object
		// Returns string
		$serialize: function(obj) {
			var str = [];

			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					str.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
				}
			}

			return str.join('&');
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
		// Accepts optional context argument
		// Returns array of DOM objects
		$: function(sel, context) {
			if (! this.$isString(sel)) {
				return sel;
			}

			var el = null;
			context = context ? this.$first(context) : d;

			// If selector doesn't have a space or [ assume its a simple selection
			if (sel.indexOf(' ') + sel.indexOf('[') == -2) {
				var type = sel.match(/^(\W)?(.*)/);

				el = (context)[
					'getElement' + (type[1] ? (type[1] == '#') ? 'ById' : 'sByClassName' : 'sByTagName')
				](type[2]);
			} else {
				el = context.querySelectorAll(sel);
			}

			if (el === null || el.nodeType) {
				return el;
			}

			// If slice.call is available use it else loop through matches manually
			try {
				return [].slice.call(el, 0);
			} catch(e) {
				var matches = [],
					len = matches.length,
					i = 0;

				for (; i < len; i++) {
					var node = el[i];

					if (this.$isObject(node)) {
						matches.push(node);
					}
				}

				return matches;
			}
		},
		// Get first match to specified element|selector
		// Returns DOM object
		$first: function(sel) {
			if (sel['_$_']) {
				return sel[0];
			}

			var el = this.$(sel);

			return Wee.$isArray(el) ? el[0] : el;

		},
		// Execute specified function for specified elements|selector
		$each: function(sel, fn, opt) {
			var conf = this.$extend({
					args: [],
					scope: null
				}, opt),
				el = sel['_$_'] ?
					sel :
					this.$isString(sel) ?
						this.$toArray(this.$(sel)) :
						(this.$isArray(sel) ? sel : [sel]),
				len = el.length,
				i = 0;

			for (; i < len; i++) {
				this.$exec(fn, {
					args: [el[i], i],
					scope: conf.scope ? conf.scope : el[i]
				})
			}
		},
		// Translate items in an array|selection to new array
		$map: function(arr, fn) {
			if (! this.$isArray(arr)) {
				arr = this.$toArray(arr['_$_'] ? arr[0] : this.$(arr));
			}

			var res = [],
				len = arr.length,
				i = 0;

			for (; i < len; i++) {
				var el = arr[i],
					val = this.$exec(fn, {
						args: [el, i],
						scope: el
					});

				if (val) {
					res.push(val);
				}
			}

			return res;
		},
		// Add specified class name to specified element|selector
		$addClass: function(sel, val) {
			this.$each(sel, function(el) {
				if (el.classList) {
					el.classList.add(val);
				} else {
					var curr = el.className;

					// If specified class isn't already bound either set it or append it
					if (curr.indexOf(val) === -1) {
						if (curr === '') {
							el.className = val;
						} else {
							el.className += ' ' + className;
						}
					}
				}
			});
		},
		// Removes specified class from specified element|selector
		$removeClass: function(sel, val) {
			this.$each(sel, function(el) {
				if (el.classList) {
					el.classList.remove(val);
				} else {
					el.className = el.className.replace(new RegExp('(^|\\b)' + val.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
				}
			});
		},
		// Add specified CSS rules to element|selector
		// Accepts either rule object or rule, value
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

				return el.currentStyle ?
					el.currentStyle[a] :
					getComputedStyle(el, null)[a];
			}
		},
		// Get HTML value of a specified element|selector or set HTML with specified value
		$html: function(sel, val) {
			if (val !== undefined) {
				this.$each(sel, function(el) {
					el.innerHTML = val;
				});
			} else {
				return Wee.$first(sel).innerHTML;
			}
		},
		// Get attribute of specified element|selector or set attribute with specified value
		$attr: function(sel, key, val) {
			if (val !== undefined) {
				this.$each(sel, function(el) {
					el.setAttribute(key, val);
				});
			} else {
				return this.$first(sel).getAttribute(key);
			}
		},
		// Get data value of specified element|selector or set data with specified value
		$data: function(sel, key, val) {
			key = 'data-' + key;

			return this.$attr(sel, key, val);
		},
		// Add meta variables to data store
		$setVars: function() {
			this.$each('[data-set]', function(el) {
				var key = Wee.$data(el, 'set'),
					val = Wee.$data(el, 'value');

				(key.indexOf('[]') == -1) ?
					Wee.$set(key, val) :
					Wee.$push(key.replace('[]', ''), val);
			});
		},
		// Execute specified function when document is ready
		ready: function(fn) {
			if (d.addEventListener) {
				d.addEventListener('DOMContentLoaded', function() {
					Wee.$exec(fn);
				});
			} else {
				d.attachEvent('onreadystatechange', function() {
					if (d.readyState == 'interactive') {
						Wee.$exec(fn);
					}
				});
			}
		},
		// Toggle HTML JavaScript status class name and set data variables
		init: function() {
			var html = d.body.parentNode;

			this.$removeClass(html, 'no-js');
			this.$addClass(html, 'js');

			this.$setVars();
		}
	};
})(this, document);

Wee.init();