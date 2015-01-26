(function(W, U) {
	'use strict';

	var WeeAlias = WeeAlias || '$';

	W.fn.extend({
		$chain: function(a, b) {
			var p = W._win[WeeAlias].prototype;

			if (typeof a == 'string') {
				p[a] = b;
			} else {
				var keys = Object.keys(a),
					i = 0;

				for (; i < keys.length; i++) {
					var key = keys[i];
					p[key] = a[key];
				}
			}
		}
	});

	(function(A) {
		var Get = function(sel, context) {
			if (sel) {
				var els = Array.isArray(sel) ? sel : W.$toArray(W.$(sel, context)),
					i = 0;

				for (; i < els.length; i++) {
					A.call(this, els[i]);
				}
			}
		};

		W._win[WeeAlias] = function(sel, context) {
			var o = new Get(sel, context);
			o.sel = sel;

			return o;
		};

		W._win[WeeAlias].prototype = Get.prototype = {
			_$: true,
			length: 0,
			each: function(fn, opt) {
				W.$each(this, fn, opt);
			},
			map: function(fn) {
				return W.$map(this, fn);
			},
			attr: function(key, val) {
				var r = W.$attr(this, key, val);
				return val !== U ? this : r;
			},
			eq: function(i) {
				return $(W.$eq(this, i));
			},
			first: function() {
				return this.eq(0);
			},
			data: function(key, val) {
				var r = W.$data(this, key, val);
				return val !== U ? this : r;
			},
			reverse: function() {
				var cp = W.$extend({}, this),
					len = this.length,
					x = len,
					i = 0;

				for (; i < len; i++) {
					x--;
					this[i] = cp[x];
				}

				return this;
			}
		};
	})([].push);
})(Wee, undefined);