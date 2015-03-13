(function(W, U) {
	'use strict';

	var $ = W._win[WeeAlias];

	W.$chain({
		addClass: function(value) {
			W.$addClass(this, value);
			return this;
		},
		after: function(source, remove) {
			W.$after(this, source, remove);
			return this;
		},
		append: function(source) {
			W.$append(this, source);
			return this;
		},
		appendTo: function(target) {
			W.$append(target, this);
			return this;
		},
		attr: function(key, value) {
			var resp = W.$attr(this, key, value);
			return value !== U ? this : resp;
		},
		before: function(source, remove) {
			W.$before(this, source, remove);
			return this;
		},
		children: function(filter) {
			return $(W.$children(this, filter));
		},
		clone: function() {
			return $(W.$clone(this));
		},
		closest: function(filter) {
			return $(W.$closest(this, filter));
		},
		contains: function(descendant) {
			return W.$contains(this, descendant);
		},
		contents: function() {
			return $(W.$contents(this));
		},
		css: function(a, b) {
			var r = W.$css(this, a, b);
			return b || W.$isObject(a) ? this : r;
		},
		data: function(key, value) {
			var resp = W.$data(this, key, value);
			return value !== U ? this : resp;
		},
		empty: function() {
			W.$empty(this);
			return this;
		},
		eq: function(index) {
			return $(W.$eq(this, index));
		},
		filter: function(filter) {
			return $(W.$filter(this, filter));
		},
		find: function(filter) {
			return $(W.$find(this, filter));
		},
		first: function() {
			return this.eq(0);
		},
		hasClass: function(value) {
			return W.$hasClass(this, value);
		},
		height: function(value) {
			var r = W.$height(this, value);
			return value === U || value === true ? r : this;
		},
		hide: function() {
			W.$hide(this);
			return this;
		},
		html: function(value) {
			var r = W.$html(this, value);
			return value !== U ? this : r;
		},
		index: function() {
			return W.$index(this);
		},
		insertAfter: function(source) {
			W.$insertAfter(this, source);
			return this;
		},
		insertBefore: function(source) {
			W.$insertBefore(this, source);
			return this;
		},
		is: function(filter) {
			return W.$is(this, filter);
		},
		last: function() {
			return $(W.$last(this));
		},
		next: function(filter) {
			return $(W.$next(this, filter));
		},
		not: function(filter) {
			return $(W.$not(this, filter));
		},
		offset: function() {
			return W.$offset(this);
		},
		parent: function() {
			return $(W.$parent(this));
		},
		parents: function(filter) {
			return $(W.$parents(this, filter));
		},
		position: function() {
			return W.$position(this);
		},
		prepend: function(source) {
			W.$prepend(this, source);
			return this;
		},
		prependTo: function(target) {
			W.$prepend(target, this.reverse());
			return this;
		},
		prev: function(filter) {
			return $(W.$prev(this, filter));
		},
		prop: function(key, value) {
			var r = W.$prop(this, key, value);
			return value !== U ? this : r;
		},
		remove: function() {
			W.$remove(this);
			return this;
		},
		removeAttr: function(key) {
			W.$removeAttr(this, key);
			return this;
		},
		removeClass: function(value) {
			W.$removeClass(this, value);
			return this;
		},
		replaceWith: function(source) {
			return W.$replaceWith(this, source);
		},
		scrollLeft: function(value) {
			var r = W.$scrollLeft(this, value);
			return value === U || value === true ? r : this;
		},
		scrollTop: function(value) {
			var r = W.$scrollTop(this, value);
			return value === U || value === true ? r : this;
		},
		serialize: function() {
			return W.$serializeForm(this);
		},
		show: function() {
			W.$show(this);
			return this;
		},
		siblings: function(filter) {
			return $(W.$siblings(this, filter));
		},
		slice: function(start, end) {
			return $(W.$slice(this, start, end));
		},
		text: function(value) {
			var r = W.$text(this, value);
			return value !== U ? this : r;
		},
		toggle: function() {
			W.$toggle(this);
			return this;
		},
		toggleClass: function(val, toggle) {
			W.$toggleClass(this, val, toggle);
			return this;
		},
		val: function(value) {
			var r = W.$val(this, value);
			return value !== U ? this : r;
		},
		width: function(value) {
			var r = W.$width(this, value);
			return value === U || value === true ? r : this;
		},
		wrap: function(html) {
			W.$wrap(this, html);
			return this;
		},
		wrapInner: function(html) {
			W.$wrapInner(this, html);
			return this;
		}
	});
})(Wee, undefined);