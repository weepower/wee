(function(W, U) {
	'use strict';

	W.$chain({
		html: function(value) {
			var r = W.$html(this, value);
			return value !== U ? this : r;
		},
		hasClass: function(value) {
			return W.$hasClass(this, value);
		},
		addClass: function(value) {
			W.$addClass(this, value);
			return this;
		},
		removeClass: function(value) {
			W.$removeClass(this, value);
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
		prop: function(key, value) {
			var r = W.$prop(this, key, value);
			return value !== U ? this : r;
		},
		val: function(value) {
			var r = W.$val(this, value);
			return value !== U ? this : r;
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
		contains: function(descendant) {
			return W.$contains(this, descendant);
		},
		append: function(source) {
			W.$append(this, source);
			return this;
		},
		appendTo: function(target) {
			W.$append(target, this);
			return this;
		},
		prepend: function(source) {
			W.$prepend(this, source);
			return this;
		},
		prependTo: function(target) {
			W.$prepend(target, this.reverse());
			return this;
		},
		before: function(source, remove) {
			W.$before(this, source, remove);
			return this;
		},
		insertBefore: function(source) {
			W.$insertBefore(this, source);
			return this;
		},
		after: function(source, remove) {
			W.$after(this, source, remove);
			return this;
		},
		insertAfter: function(source) {
			W.$insertAfter(this, source);
			return this;
		},
		replaceWith: function(source) {
			return W.$replaceWith(this, source);
		},
		remove: function() {
			W.$remove(this);
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
		text: function(value) {
			var r = W.$text(this, value);
			return value !== U ? this : r;
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
		width: function(value) {
			var r = W.$width(this, value);
			return value === U || value === true ? r : this;
		},
		height: function(value) {
			var r = W.$height(this, value);
			return value === U || value === true ? r : this;
		},
		scrollLeft: function(value) {
			var r = W.$scrollLeft(this, value);
			return value === U || value === true ? r : this;
		},
		scrollTop: function(value) {
			var r = W.$scrollTop(this, value);
			return value === U || value === true ? r : this;
		}
	});
})(Wee, undefined);