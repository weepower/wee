(function(W, U) {
	'use strict';

	W.$chain({
		html: function(val) {
			var r = W.$html(this, val);
			return val !== U ? this : r;
		},
		hasClass: function(val) {
			return W.$hasClass(this, val);
		},
		addClass: function(val) {
			W.$addClass(this, val);
			return this;
		},
		removeClass: function(val) {
			W.$removeClass(this, val);
			return this;
		},
		css: function(a, b) {
			var r = W.$css(this, a, b);
			return b || W.$isObject(a) ? this : r;
		},
		clone: function() {
			return $(W.$clone(this));
		},
		removeAttr: function(key) {
			W.$removeAttr(this, key);
			return this;
		},
		prop: function(key, val) {
			var r = W.$prop(this, key, val);
			return val !== U ? this : r;
		},
		val: function(val) {
			var r = W.$val(this, val);
			return val !== U ? this : r;
		},
		show: function() {
			W.$show(this);
			return this;
		},
		hide: function() {
			W.$hide(this);
			return this;
		},
		toggle: function() {
			W.$toggle(this);
			return this;
		},
		children: function(filter) {
			return $(W.$children(this, filter));
		},
		contents: function() {
			return $(W.$contents(this));
		},
		siblings: function(filter) {
			return $(W.$siblings(this, filter));
		},
		parent: function() {
			return $(W.$parent(this));
		},
		contains: function(child) {
			return W.$contains(this, child);
		},
		append: function(child) {
			W.$append(this, child);
			return this;
		},
		appendTo: function(parent) {
			W.$append(parent, this);
			return this;
		},
		prepend: function(child) {
			W.$prepend(this, child);
			return this;
		},
		prependTo: function(parent) {
			W.$prepend(parent, this._reverse());
			return this;
		},
		before: function(pos) {
			W.$before(this, pos);
			return this;
		},
		insertBefore: function(sel) {
			W.$insertBefore(this, sel);
			return this;
		},
		after: function(pos) {
			W.$after(this, pos);
			return this;
		},
		insertAfter: function(sel) {
			W.$insertAfter(this, sel);
			return this;
		},
		replaceWith: function(sel) {
			return W.$replaceWith(this, sel);
		},
		remove: function(filter) {
			W.$remove(filter, this);
			return this;
		},
		empty: function() {
			W.$empty(this);
			return this;
		},
		wrap: function(html) {
			W.$wrap(this, html);
			return this;
		},
		wrapInner: function(html) {
			W.$wrapInner(this, html);
			return this;
		},
		text: function(val) {
			var r = W.$text(this, val);
			return val !== U ? this : r;
		},
		last: function() {
			return $(W.$last(this));
		},
		slice: function(start, end) {
			return $(W.$slice(this, start, end));
		},
		find: function(filter) {
			return $(W.$find(this, filter));
		},
		next: function(filter) {
			return $(W.$next(this, filter));
		},
		prev: function(filter) {
			return $(W.$prev(this, filter));
		},
		filter: function(filter) {
			return $(W.$filter(this, filter));
		},
		not: function(filter) {
			return $(W.$not(this, filter));
		},
		is: function(filter) {
			return W.$is(this, filter);
		},
		index: function() {
			return W.$index(this);
		},
		closest: function(filter) {
			return $(W.$closest(this, filter));
		},
		parents: function(filter) {
			return $(W.$parents(this, filter));
		},
		toggleClass: function(val, toggle) {
			W.$toggleClass(this, val, toggle);
			return this;
		},
		serialize: function() {
			return W.$serializeForm(this);
		},
		position: function() {
			return W.$position(this);
		},
		offset: function() {
			return W.$offset(this);
		},
		width: function(val) {
			var r = W.$width(this, val);
			return val === U || val === true ? r : this;
		},
		height: function(val) {
			var r = W.$height(this, val);
			return val === U || val === true ? r : this;
		},
		scrollTop: function(val) {
			var r = W.$scrollTop(this, val);
			return val === U || val === true ? r : this;
		},
		// Utilities
		_reverse: function() {
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
	});
})(Wee, undefined);