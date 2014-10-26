var WeeAlias = WeeAlias || '$';

Wee.fn.extend({
	$chain: function(a, b) {
		var p = Wee._win[WeeAlias].prototype;

		Wee.$isString(a) ?
			p[a] = b :
			Object.keys(a).forEach(function(key) {
				p[key] = a[key];
			});
	}
});

(function(c) {
	function get(sel, context) {
		if (sel) {
			var el = Array.isArray(sel) ? sel : Wee.$toArray(Wee.$(sel, context)),
				i = 0;

			for (; i < el.length; i++) {
				c.call(this, el[i]);
			}
		}
	}

	Wee._win[WeeAlias] = function(sel, context) {
		var o = new get(sel, context);
			o.sel = sel;

		return o;
	}

	Wee._win[WeeAlias].prototype = get.prototype = {
		length: 0,
		_$_: true,
		// Utilities
		reverse: function() {
			var cp = Wee.$extend({}, this),
				len = this.length,
				x = len,
				i = 0;

			for (; i < len; i++) {
				x--;
				this[i] = cp[x];
			}

			return this;
		},
		// Core
		each: function(fn, opt) {
			Wee.$each(this, fn, opt);
		},
		map: function(fn) {
			return Wee.$map(this, fn);
		},
		attr: function(key, val) {
			var r = Wee.$attr(this, key, val);
			return val !== undefined ? this : r;
		},
		eq: function(i) {
			return $(Wee.$eq(this, i));
		},
		first: function() {
			return $(Wee.$eq(this, 0));
		},
		data: function(key, val) {
			var r = Wee.$data(this, key, val);
			return val !== undefined ? this : r;
		}
	}
})([].push);