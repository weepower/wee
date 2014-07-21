// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

var WeeAlias = WeeAlias || '$';

Wee.fn.extend('', {
	$chain: function(obj) {
		for (var key in obj) {
			Wee._win[WeeAlias]['prototype'][key] = obj[key];
		}
	}
});

(function(c, s) {
	function get(sel, context) {
		if (sel) {
			var el = (Wee._legacy ? sel.constructor === Array : Array.isArray(sel)) ? sel : Wee.$toArray(Wee.$(sel, context)),
				len = el.length,
				i = 0;

			for (; i < len; i++) {
				c.call(this, el[i]);
			}
		}
	}

	Wee._win[WeeAlias] = function(sel, context) {
		var o = new get(sel, context);
			o.sel = sel;

		return o;
	}

	Wee._win[WeeAlias]['prototype'] = get['prototype'] = {
		length: 0,
		_$_: true,
		// Utility
		reverse: function() {
			var cp = Wee.$extend({}, this),
				len = this.length,
				i = 0,
				x = len - 1;

			for (; i < len; i++) {
				this[i] = cp[x];
				x--;
			}

			return this;
		},
		// Base
		clone: function() {
			return $(Wee.$clone(this));
		},
		each: function(fn, opt) {
			Wee.$each(this, fn, opt);
		},
		map: function(fn) {
			return Wee.$map(this, fn);
		},
		addClass: function(val) {
			Wee.$addClass(this, val);
			return this;
		},
		removeClass: function(val) {
			Wee.$removeClass(this, val);
			return this;
		},
		css: function(a, b) {
			var r = Wee.$css(this, a, b);
			return b || Wee.$isObject(a) ? this : r;
		},
		attr: function(key, val) {
			var r = Wee.$attr(this, key, val);
			return val !== undefined ? this : r;
		},
		// DOM
		hasClass: function(val) {
			return Wee.$hasClass(this, val);
		},
		html: function(val) {
			var r = Wee.$html(this, val);
			return val !== undefined ? this : r;
		},
		removeAttr: function(key) {
			Wee.$removeAttr(this, key);
			return this;
		},
		data: function(key, val) {
			var r = Wee.$data(this, key, val);
			return val !== undefined ? this : r;
		},
		prop: function(key, val) {
			var r = Wee.$prop(this, key, val);
			return val !== undefined ? this : r;
		},
		val: function(key, val) {
			var r = Wee.$val(this, key, val);
			return val !== undefined ? this : r;
		},
		show: function() {
			Wee.$show(this);
			return this;
		},
		hide: function() {
			Wee.$hide(this);
			return this;
		},
		toggle: function() {
			Wee.$toggle(this);
			return this;
		},
		children: function(filter) {
			return $(Wee.$children(this, filter));
		},
		contents: function() {
			return $(Wee.$contents(this));
		},
		siblings: function(filter) {
			return $(Wee.$siblings(this, filter));
		},
		parent: function() {
			return $(Wee.$parent(this));
		},
		contains: function(child) {
			return Wee.$contains(this, child);
		},
		append: function(child) {
			Wee.$append(this, child);
			return this;
		},
		appendTo: function(parent) {
			Wee.$append(parent, this);
			return this;
		},
		prepend: function(child) {
			Wee.$prepend(this, child);
			return this;
		},
		prependTo: function(parent) {
			Wee.$prepend(parent, this.reverse());
			return this;
		},
		before: function(pos) {
			Wee.$before(this, pos);
			return this;
		},
		insertBefore: function(sel) {
			Wee.$insertBefore(this, sel);
			return this;
		},
		after: function(pos) {
			Wee.$after(this, pos);
			return this;
		},
		insertAfter: function(sel) {
			Wee.$insertAfter(this, sel);
			return this;
		},
		replaceWith: function(sel) {
			return Wee.$replaceWith(this, sel);
		},
		remove: function() {
			Wee.$remove(this);
			return this;
		},
		empty: function() {
			Wee.$empty(this);
			return this;
		},
		wrap: function(html) {
			Wee.$wrap(this, html);
			return this;
		},
		wrapInner: function(html) {
			Wee.$wrapInner(this, html);
			return this;
		},
		text: function(val) {
			var r = Wee.$text(this, val);
			return val !== undefined ? this : r;
		},
		eq: function(i) {
			return $(Wee.$eq(this, i));
		},
		first: function() {
			return $(Wee.$eq(this, 0));
		},
		last: function() {
			return $(Wee.$last(this));
		},
		find: function(filter) {
			return $(Wee.$find(this, filter));
		},
		next: function() {
			return $(Wee.$next(this));
		},
		prev: function() {
			return $(Wee.$prev(this));
		},
		filter: function(filter) {
			return $(Wee.$filter(this, filter));
		},
		not: function(filter) {
			return $(Wee.$not(this, filter));
		},
		is: function(filter) {
			return Wee.$is(this, filter);
		},
		index: function() {
			return Wee.$index(this);
		},
		closest: function(filter) {
			return $(Wee.$closest(this, filter));
		},
		toggleClass: function(val) {
			Wee.$toggleClass(this, val);
			return this;
		},
		position: function() {
			return Wee.$position(this);
		},
		offset: function() {
			return Wee.$offset(this);
		},
		width: function(val) {
			var r = Wee.$width(this, val);
			return (val === undefined || val === true) ? r : this;
		},
		height: function(val) {
			var r = Wee.$height(this, val);
			return (val === undefined || val === true) ? r : this;
		},
		// Events
		on: function(a, b, c) {
			Wee.events.on(this, a, b, c);
			return this;
		},
		off: function(evts, opt) {
			Wee.events.off(this, evts, opt);
			return this;
		},
		one: function(a, b, c) {
			Wee.events.one(this, a, b, c);
			return this;
		},
		trigger: function(evt) {
			Wee.events.trigger(this, evt);
			return this;
		},
		// Data
		parse: function(obj, opt) {
			var str = Wee.$html(this);
			str = Wee.data.parse(str, obj, opt);
			Wee.$html(this, str);
			return this;
		}
	}
})([].push);