(function(W, A) {
	'use strict';

	/**
	 * Cast selection as Wee object
	 *
	 * @param {(Array|node|string)} sel
	 * @param {object} [context=document]
	 */
	var Get = function(sel, context) {
			if (sel) {
				var els = Array.isArray(sel) ?
						sel :
						W.$toArray(W.$(sel, context)),
					i = 0;

				for (; i < els.length; i++) {
					var el = els[i];

					if (el) {
						A.call(this, el);
					}
				}

				this.sel = sel;
			}
		},
		$;

	/**
	 * Create chainable Wee object from selection
	 *
	 * @param {(node|string)} sel
	 * @param {object} [context=document]
	 */
	$ = W._win[W._$] = function(sel, context) {
		return new Get(sel, context);
	};

	// Extend core with chain registration method
	W.fn.extend({
		/**
		 * Register a new chainable method
		 *
		 * @param {(object|string)} a - method name or object
		 * @param {function} b
		 */
		$chain: function(a, b) {
			if (typeof a == 'string') {
				$.fn[a] = b;
			} else {
				for (var key in a) {
					$.fn[key] = a[key];
				}
			}
		}
	});

	// Shortcut core methods from alias
	for (var key in W) {
		if (key.charAt(0) !== '_') {
			$[key.replace(/^\$/, '')] = W[key];
		}
	}

	// Bind core chainable methods
	$.fn = Get.prototype = {
		_$: true,
		length: 0,

		/**
		 * Execute function for each object element
		 *
		 * @param fn
		 * @param {object} [options]
		 * @param {Array} [options.args]
		 * @param {bool} [options.reverse=false]
		 * @param {context} [options.context=document]
		 * @param {Array} [options.scope]
		 */
		each: function(fn, options) {
			W.$each(this, fn, options);
		},

		/**
		 * Translate object elements to a new array
		 *
		 * @param fn
		 * @param {function} fn
		 * @param {object} [options]
		 * @param {Array} [options.args]
		 * @param {object} [options.scope]
		 * @returns {Array}
		 */
		map: function(fn, options) {
			return W.$map(this, fn, options);
		},

		/**
		 * Reverse the order of object elements
		 *
		 * @returns {$}
		 */
		reverse: function() {
			var copy = W.$extend({}, this),
				x = this.length,
				total = x,
				i = 0;

			for (; i < total; i++) {
				x--;
				this[i] = copy[x];
			}

			return this;
		}
	};
})(Wee, [].push);