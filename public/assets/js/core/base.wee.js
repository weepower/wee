// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

var Wee = (function(w, d) {
	var _store = {};

	return {
		// Create controller specified name, public object, and optional private object
		controller: {
			create: function(name, pub, priv) {
				Wee[name] = (function() {
					var data = {
							// Private getter and setter methods for controllers
							$get: function(key, def, opt) {
								if (_store[name].hasOwnProperty(key)) {
									return _store[name][key]
								} else if (def !== undefined) {
									return (Wee.isFunction(def)) ? def() : (opt ? Wee.exec(def, opt) : def);
								}

								return null;
							},
							$set: function(key, val, opt) {
								var set = (Wee.isFunction(val)) ? val() : (opt ? Wee.exec(val, opt) : val);
								_store[name][key] = set;

								return set;
							},
							$push: function(key, val) {
								if (! _store[name].hasOwnProperty(key)) {
									_store[name][key] = [];
								}

								_store[name][key].push(val);
							},
							$pop: function(key, val) {
								_store[name][key].pop(val);
							}
						},
						// Extend defined public and private objects with data functions
						Public = Wee.extend(pub, data),
						Private = Wee.extend(priv, data);

					// If private object exists expose the $call function for executing private methods
					if (priv !== undefined) {
						Public.$call = function(func) {
							var args = Array.prototype.slice.call(arguments);

							// Bind all additional arguments to the private method call
							if (args.length > 1) {
								args.shift();
							} else {
								args = null;
							}

							return Private[func].apply(Private, args);
						};
					}

					Private.$call = Public;

					_store[name] = {};

					return Public;
				})();
			},
			// Extend an existing controller
			extend: function(name, pub, priv) {
				// If named controller exists merge the objects else create the controller
				if (Wee.hasOwnProperty(name)) {
					this.create('tMod', pub, priv);
					Wee.extend(Wee[name], Wee.tMod);
					delete Wee.tMod;
				} else {
					this.create(name, pub, priv);
				}
			}
		},
		// Get the current environment or detect the current environment against a specified object
		env: function(obj, def) {
			if (obj) {
				this.$set('env', function() {
					var host = location.host;

					for (var key in obj) {
						if (obj[key] === host) {
							return key;
						}
					}

					return def || 'local';
				});
			}

			return this.$get('env', 'local');
		},
		// Add all meta variables to the data store
		setVars: function() {
			Wee.$each('[data-var]', function(el) {
				var key = Wee.$data(el, 'var'),
					val = el.getAttribute('content');

				Wee.$set(key, val);
			});
		},
		// Get a public variable with an optional fallback
		// Returns mixed
		$get: function(key, def, opt) {
			if (_store.hasOwnProperty(key)) {
				return _store[key]
			} else if (def !== undefined) {
				return (Wee.isFunction(def)) ? def() : (opt ? Wee.exec(def, opt) : def);
			}

			return null;
		},
		// Set a public variable
		$set: function(key, val, opt) {
			var set = (Wee.isFunction(val)) ? val() : (opt ? Wee.exec(val, opt) : val);
			_store[key] = set;

			return set;
		},
		// Push specified value to public array
		$push: function(key, val) {
			if (! _store.hasOwnProperty(key)) {
				_store[key] = [];
			}

			_store[key].push(val);
		},
		// Remove specified value from public array
		$pop: function(key, val) {
			_store[key].pop(val);
		},
		// Execute a specified function or controller call
		exec: function(fn, opt) {
			var conf = Wee.extend({
					scope: null,
					arguments: []
				}, opt),
				fns = (this.isArray(fn)) ? fn : [fn],
				len = fns.length,
				i = 0;

			for (; i < len; i++) {
				var fn = fns[i];

				if (typeof fn === 'string') {
					var segs = fn.split(':');

					if (segs.length === 2) {
						fn = Wee[segs[0]][segs[1]];

						if (conf.scope == null) {
							conf.scope = Wee[segs[0]];
						}
					}
				}

				var response = fn.apply(conf.scope, conf.arguments);

				if (len === 1) {
					return response;
				}
			}
		},
		// Determine if the specified argument is an array
		// Returns boolean
		isArray: function(obj) {
			return (obj !== undefined && (obj.isArray || (Object.prototype.toString.call(obj) == '[object Array]')));
		},
		// Determine if the specified element belongs to the specified array
		// Returns index else false
		inArray: function(obj, el) {
			var len = obj.length,
				i = 0;

			for (; i < len; i++) {
				if (obj[i] === el) {
					return i;
				}
			}

			return false;
		},
		// Push an object into a new array if it isn't one already
		// Returns array
		toArray: function(obj) {
			return this.isArray(obj) ? obj : [obj];
		},
		// Determine if the specified argument is a string
		// Returns boolean
		isString: function(obj) {
			return (typeof obj === 'string');
		},
		// Determine if the specified argument is a function
		// Returns boolean
		isFunction: function(obj) {
			return (obj && {}.toString.call(obj) == '[object Function]');
		},
		// Determine if the specified argument is an object
		// Returns boolean
		isObject: function(obj) {
			return (obj !== null && typeof obj == 'object');
		},
		// Get all the keys from an object
		// Returns array of key strings
		getKeys: function(obj) {
			if (Object.keys) {
				return Object.keys(obj);
			} else {
				var keys = [];

				for (var key in obj) {
					keys.push(key);
				}

				return keys;
			}
		},
		// Serialize a specified object
		serialize: function(obj) {
			var str = [];

			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					str.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
				}
			}

			return str.join('&');
		},
		// Extend a specified object with a specified source object
		// Returns object
		extend: function(obj, src, deep) {
			obj = obj || {};

			for (var key in src) {
				// Attempt to deep nest else set the property of the object
				if (deep) {
					try {
						obj[key] = (this.isObject(obj[key])) ? this.extend(obj[key], src[key]) : src[key];
					} catch(e) {
						obj[key] = src[key];
					}
				} else {
					obj[key] = src[key];
				}
			}

			return obj;
		},
		// Clone a specified object
		// Returns object
		clone: function(obj) {
			var copy = obj;

			// Based on the object type attempt to clone
			if (obj instanceof Date) {
				copy = new Date();

				copy.setTime(obj.getTime());
			} else if (this.isArray(obj)) {
				copy = [];
				
				var len = obj.length,
					i = 0;

				for (; i < len; i++) {
					copy[i] = clone(obj[i]);
				}
			} else if (this.isObject(obj)) {
				copy = {};

				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						copy[key] = this.clone(obj[key]);
					}
				}
			}

			return copy;
		},
		// Determine if the specified element has a specified class name
		// Return boolean
		hasClass: function(el, val) {
			return (el.classList) ? el.classList.contains(val) : new RegExp('(^| )' + val + '( |$)', 'gi').test(el.className);
		},
		// Add a specified class name to a specified element
		addClass: function(el, val) {
			if (el.classList) {
				el.classList.add(val);
			} else {
				var curr = el.className;

				// If the specified class isn't already bound either set it or append it
				if (curr.indexOf(val) === -1) {
					if (curr === '') {
						el.className = val;
					} else {
						el.className.concat(' ' + val);
					}
				}
			}
		},
		// Removes a specified class value from a specified element
		removeClass: function(el, val) {
			if (el.classList) {
				el.classList.remove(val);
			} else {
				el.className = el.className.replace(new RegExp('(^|\\b)' + val.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		},
		// Add specified css rules
		css: function(sel, a, b) {
			if (typeof sel == 'string') {
				sel = this.$(sel);
			}

			var obj = (! this.isObject(a)) ? {a: b} : a;

			for (var key in obj) {
				sel.style[key] = obj[key];
			}
		},
		// Append a specified child element to a parent element
		append: function(el, child) {
			el.appendChild(child);
		},
		// Insert a specified element before a specified element
		before: function(el, html) {
			el.insertAdjacentHTML('beforebegin', html);
		},
		// Insert a specified element after a specified element
		after: function(el, html) {
			el.insertAdjacentHTML('afterend', html);
		},
		// Get the text value of a specified element or selector or set the text with a specified value
		text: function(el, val) {
			// If an element selector is specified get the DOM elements
			if (typeof el == 'string') {
				el = this.$(el);
			}

			if (val) {
				if (el.textContent !== undefined) {
					el.textContent = val;
				} else {
					el.innerText = val;
				}
			} else {
				return el.textContent || el.innerText;
			}
		},
		// Get the HTML value of a specified element or selector or set the HTML with a specified value
		html: function(el, val) {
			// If an element selector is specified get the DOM elements
			if (typeof el == 'string') {
				el = this.$(el);
			}

			if (val) {
				if (el.textContent !== undefined) {
					el.textContent = val;
				} else {
					el.innerText = val;
				}
			} else {
				return el.textContent || el.innerText;
			}
		},
		// Get matches to a specified selector
		// Return array of DOM objects
		$: function(sel, context) {
			var el = null;
			context = context || document;

			// If the selector doesn't have a space or start with a [ assume its a simple selection
			if (sel.indexOf(' ') == -1 && sel[0] != '[') {
				var type = sel.match(/^(\W)?(.*)/);

				el = (context)[
					'getElement' + (type[1] ? (type[1] == '#') ? 'ById' : 'sByClassName' : 'sByTagName')
				](type[2]);
			} else {
				el = context.querySelectorAll(sel);
			}

			if (el.nodeType) {
				return el;
			}

			// If slice.call is available use it else loop through matches manually
			try {
				return Array.prototype.slice.call(el, 0);
			} catch(e) {
				var matches = [],
					len = matches.length,
					i = 0;

				for (; i < len; i++) {
					var node = el[i];

					if (this.isObject(node)) {
						matches.push(node);
					}
				}

				return matches;
			}
		},
		// Execute a specified function for a specified selector
		$each: function(sel, fn) {
			// If an element selector is specified get the DOM elements
			var el = (typeof sel === 'string') ? Wee.toArray(this.$(sel)) : [sel],
				len = el.length,
				i = 0;

			for (; i < len; i++) {
				fn(el[i], i);
			}
		},
		// Get the data value of a specified element or selector or set the data with a specified value
		$data: function(el, key, val) {
			// If an element selector is specified get the DOM elements
			if (typeof el == 'string') {
				el = this.$(el);
			}

			key = 'data-' + key;

			if (val) {
				el.setAttribute(key);
			} else {
				return el.getAttribute(key);
			}
		},
		// Execute a specified function once the document is ready
		ready: function(fn) {
			if (d.addEventListener) {
				d.addEventListener('DOMContentLoaded', function() {
					Wee.exec(fn);
				});
			} else {
				d.attachEvent('onreadystatechange', function() {
					if (d.readyState == 'interactive') {
						Wee.exec(fn);
					}
				});
			}
		},
		// Toggle the HTML js status class name
		init: function() {
			var html = d.body.parentNode;

			this.removeClass(html, 'no-js');
			this.addClass(html, 'js');

			this.setVars();
		}
	};
})(window, document);

Wee.init();