(function(W, U) {
	'use strict';

	var $ = W._win[W._$];

	W.$chain({
		/**
		 *
		 * @param source
		 * @returns {*|jQuery|HTMLElement}
		 */
		add: function(source) {
			var orig = [],
				i = 0;

			for (; i < this.length; i++) {
				orig.push(this[i]);
			}

			return $(W.$merge(orig, W.$(source), true));
		},

		/**
		 *
		 * @param value
		 * @returns {addClass}
		 */
		addClass: function(value) {
			W.$addClass(this, value);
			return this;
		},

		/**
		 *
		 * @param source
		 * @param remove
		 * @returns {after}
		 */
		after: function(source, remove) {
			W.$after(this, source, remove);
			return this;
		},

		/**
		 *
		 * @param source
		 * @returns {append}
		 */
		append: function(source) {
			W.$append(this, source);
			return this;
		},

		/**
		 *
		 * @param target
		 * @returns {appendTo}
		 */
		appendTo: function(target) {
			W.$append(target, this);
			return this;
		},

		/**
		 *
		 * @param a
		 * @param b
		 * @returns {*}
		 */
		attr: function(a, b) {
			var resp = W.$attr(this, a, b);
			return b !== U || W.$isObject(a) ? this : resp;
		},

		/**
		 *
		 * @param source
		 * @param remove
		 * @returns {before}
		 */
		before: function(source, remove) {
			W.$before(this, source, remove);
			return this;
		},

		/**
		 *
		 * @param filter
		 * @returns {*|jQuery|HTMLElement}
		 */
		children: function(filter) {
			return $(W.$children(this, filter));
		},

		/**
		 *
		 * @returns {*|jQuery|HTMLElement}
		 */
		clone: function() {
			return $(W.$clone(this));
		},

		/**
		 *
		 * @param filter
		 * @returns {*|jQuery|HTMLElement}
		 */
		closest: function(filter) {
			return $(W.$closest(this, filter));
		},

		/**
		 *
		 * @param descendant
		 * @returns {*|boolean}
		 */
		contains: function(descendant) {
			return W.$contains(this, descendant);
		},

		/**
		 *
		 * @returns {*|jQuery|HTMLElement}
		 */
		contents: function() {
			return $(W.$contents(this));
		},

		/**
		 *
		 * @param a
		 * @param b
		 * @returns {*}
		 */
		css: function(a, b) {
			var r = W.$css(this, a, b);
			return b !== U || W.$isObject(a) ? this : r;
		},

		/**
		 *
		 * @param a
		 * @param b
		 * @returns {*}
		 */
		data: function(a, b) {
			var resp = W.$data(this, a, b);
			return b !== U || W.$isObject(a) ? this : resp;
		},

		/**
		 *
		 * @returns {empty}
		 */
		empty: function() {
			W.$empty(this);
			return this;
		},

		/**
		 *
		 * @param index
		 * @returns {*|jQuery|HTMLElement}
		 */
		eq: function(index) {
			return $(W.$eq(this, index));
		},

		/**
		 *
		 * @param filter
		 * @returns {*|jQuery|HTMLElement}
		 */
		filter: function(filter) {
			return $(W.$filter(this, filter));
		},

		/**
		 *
		 * @param filter
		 * @returns {*|jQuery|HTMLElement}
		 */
		find: function(filter) {
			return $(W.$find(this, filter));
		},

		/**
		 *
		 * @returns {*|jQuery|HTMLElement}
		 */
		first: function() {
			return this.eq(0);
		},

		/**
		 *
		 * @param value
		 * @returns {*}
		 */
		hasClass: function(value) {
			return W.$hasClass(this, value);
		},

		/**
		 *
		 * @param value
		 * @returns {*}
		 */
		height: function(value) {
			var r = W.$height(this, value);
			return value === U || value === true ? r : this;
		},

		/**
		 *
		 * @returns {hide}
		 */
		hide: function() {
			W.$hide(this);
			return this;
		},

		/**
		 *
		 * @param value
		 * @returns {*}
		 */
		html: function(value) {
			var r = W.$html(this, value);
			return value !== U ? this : r;
		},

		/**
		 *
		 * @returns {*}
		 */
		index: function() {
			return W.$index(this);
		},

		/**
		 *
		 * @param source
		 * @returns {insertAfter}
		 */
		insertAfter: function(source) {
			W.$insertAfter(this, source);
			return this;
		},

		/**
		 *
		 * @param source
		 * @returns {insertBefore}
		 */
		insertBefore: function(source) {
			W.$insertBefore(this, source);
			return this;
		},

		/**
		 *
		 * @param filter
		 * @returns {*}
		 */
		is: function(filter) {
			return W.$is(this, filter);
		},

		/**
		 *
		 * @returns {*|jQuery|HTMLElement}
		 */
		last: function() {
			return $(W.$last(this));
		},

		/**
		 *
		 * @param filter
		 * @returns {*|jQuery|HTMLElement}
		 */
		next: function(filter) {
			return $(W.$next(this, filter));
		},

		/**
		 *
		 * @param filter
		 * @returns {*|jQuery|HTMLElement}
		 */
		not: function(filter) {
			return $(W.$not(this, filter));
		},

		/**
		 *
		 * @param value
		 * @returns {*}
		 */
		offset: function(value) {
			return W.$offset(this, value);
		},

		/**
		 *
		 * @returns {*|jQuery|HTMLElement}
		 */
		parent: function() {
			return $(W.$parent(this));
		},

		/**
		 *
		 * @param filter
		 * @returns {*|jQuery|HTMLElement}
		 */
		parents: function(filter) {
			return $(W.$parents(this, filter));
		},

		/**
		 *
		 * @returns {*|{top, left}}
		 */
		position: function() {
			return W.$position(this);
		},

		/**
		 *
		 * @param source
		 * @returns {prepend}
		 */
		prepend: function(source) {
			W.$prepend(this, source);
			return this;
		},

		/**
		 *
		 * @param target
		 * @returns {prependTo}
		 */
		prependTo: function(target) {
			W.$prepend(target, this.reverse());
			return this;
		},

		/**
		 *
		 * @param filter
		 * @returns {*|jQuery|HTMLElement}
		 */
		prev: function(filter) {
			return $(W.$prev(this, filter));
		},

		/**
		 *
		 * @param a
		 * @param b
		 * @returns {*}
		 */
		prop: function(a, b) {
			var r = W.$prop(this, a, b);
			return b !== U || W.$isObject(a) ? this : r;
		},

		/**
		 *
		 * @returns {remove}
		 */
		remove: function() {
			W.$remove(this);
			return this;
		},

		/**
		 *
		 * @param key
		 * @returns {removeAttr}
		 */
		removeAttr: function(key) {
			W.$removeAttr(this, key);
			return this;
		},

		/**
		 *
		 * @param value
		 * @returns {removeClass}
		 */
		removeClass: function(value) {
			W.$removeClass(this, value);
			return this;
		},

		/**
		 *
		 * @param source
		 * @returns {*}
		 */
		replaceWith: function(source) {
			return W.$replaceWith(this, source);
		},

		/**
		 *
		 * @param value
		 * @returns {*}
		 */
		scrollLeft: function(value) {
			var r = W.$scrollLeft(this, value);
			return value === U || value === true ? r : this;
		},

		/**
		 *
		 * @param value
		 * @returns {*}
		 */
		scrollTop: function(value) {
			var r = W.$scrollTop(this, value);
			return value === U || value === true ? r : this;
		},

		/**
		 *
		 * @returns {*}
		 */
		serialize: function() {
			return W.$serializeForm(this);
		},

		/**
		 *
		 * @returns {show}
		 */
		show: function() {
			W.$show(this);
			return this;
		},

		/**
		 *
		 * @param filter
		 * @returns {*|jQuery|HTMLElement}
		 */
		siblings: function(filter) {
			return $(W.$siblings(this, filter));
		},

		/**
		 *
		 * @param start
		 * @param end
		 * @returns {*|jQuery|HTMLElement}
		 */
		slice: function(start, end) {
			return $(W.$slice(this, start, end));
		},

		/**
		 *
		 * @param value
		 * @returns {*}
		 */
		text: function(value) {
			var r = W.$text(this, value);
			return value !== U ? this : r;
		},

		/**
		 *
		 * @returns {toggle}
		 */
		toggle: function() {
			W.$toggle(this);
			return this;
		},

		/**
		 *
		 * @param val
		 * @param toggle
		 * @returns {toggleClass}
		 */
		toggleClass: function(val, toggle) {
			W.$toggleClass(this, val, toggle);
			return this;
		},

		/**
		 *
		 * @param value
		 * @returns {*}
		 */
		val: function(value) {
			var r = W.$val(this, value);
			return value !== U ? this : r;
		},

		/**
		 *
		 * @param value
		 * @returns {*}
		 */
		width: function(value) {
			var r = W.$width(this, value);
			return value === U || value === true ? r : this;
		},

		/**
		 *
		 * @param html
		 * @returns {wrap}
		 */
		wrap: function(html) {
			W.$wrap(this, html);
			return this;
		},

		/**
		 *
		 * @param html
		 * @returns {wrapInner}
		 */
		wrapInner: function(html) {
			W.$wrapInner(this, html);
			return this;
		}
	});
})(Wee, undefined);