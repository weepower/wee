(function(W, U) {
	'use strict';

	var $ = W._win[W._$];

	W.$chain({
		/**
		 * Append additional selection to Wee object
		 *
		 * @param {($|HTMLElement|string)} source
		 * @returns {$}
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
		 * Add classes to each matching selection
		 *
		 * @param {(function|string)} value
		 * @returns {$}
		 */
		addClass: function(value) {
			W.$addClass(this, value);

			return this;
		},

		/**
		 * Insert selection or markup after each matching selection
		 *
		 * @param {($|function|HTMLElement|string)} source
		 * @param {boolean} [remove=false]
		 * @returns {$}
		 */
		after: function(source, remove) {
			W.$after(this, source, remove);

			return this;
		},

		/**
		 * Append selection or markup after each matching selection
		 *
		 * @param {($|function|HTMLElement|string)} source
		 * @returns {$}
		 */
		append: function(source) {
			W.$append(this, source);

			return this;
		},

		/**
		 * Append selection or markup to each matching selection
		 *
		 * @param {($|function|HTMLElement|string)} target
		 * @returns {$}
		 */
		appendTo: function(target) {
			W.$append(target, this);

			return this;
		},

		/**
		 * Get attribute of first matching selection or set attribute
		 * of each matching selection
		 *
		 * @param a
		 * @param b
		 * @returns {($|string)}
		 */
		attr: function(a, b) {
			var resp = W.$attr(this, a, b);

			return b !== U || W.$isObject(a) ? this : resp;
		},

		/**
		 * Insert selection or markup before each matching selection
		 *
		 * @param {($|function|HTMLElement|string)} source
		 * @param {boolean} [remove=false]
		 * @returns {$}
		 */
		before: function(source, remove) {
			W.$before(this, source, remove);

			return this;
		},

		/**
		 * Get unique direct children of each matching selection
		 *
		 * @param filter
		 * @returns {$}
		 */
		children: function(filter) {
			return $(W.$children(this, filter));
		},

		/**
		 * Clone each matching selection
		 *
		 * @returns {$}
		 */
		clone: function() {
			return $(W.$clone(this));
		},

		/**
		 * Get unique closest ancestors of each matching selection
		 *
		 * @param filter
		 * @returns {$}
		 */
		closest: function(filter) {
			return $(W.$closest(this, filter));
		},

		/**
		 * Determine if any matching parent selection contains descendant selection
		 *
		 * @param descendant
		 * @returns {boolean}
		 */
		contains: function(descendant) {
			return W.$contains(this, descendant);
		},

		/**
		 * Get unique content of each matching selection
		 *
		 * @returns {$}
		 */
		contents: function() {
			return $(W.$contents(this));
		},

		/**
		 * Get CSS value of first matching selection or set value
		 * of each matching selection
		 *
		 * @param {(object|string)} a
		 * @param {(function|string)} [b]
		 * @returns {($|string)}
		 */
		css: function(a, b) {
			var r = W.$css(this, a, b);

			return b !== U || W.$isObject(a) ? this : r;
		},

		/**
		 * Get data of first matching selection or set data
		 * of each matching selection
		 *
		 * @param a
		 * @param [b]
		 * @returns {($|string)}
		 */
		data: function(a, b) {
			var resp = W.$data(this, a, b);

			return b !== U || W.$isObject(a) ? this : resp;
		},

		/**
		 * Remove child nodes from each matching selection
		 *
		 * @returns {$}
		 */
		empty: function() {
			W.$empty(this);

			return this;
		},

		/**
		 * Get indexed node of matching selection
		 *
		 * @param index
		 * @returns {$}
		 */
		eq: function(index) {
			return $(W.$eq(this, index));
		},

		/**
		 * Return a filtered subset of elements from a matching selection
		 *
		 * @param filter
		 * @returns {$}
		 */
		filter: function(filter) {
			return $(W.$filter(this, filter));
		},

		/**
		 * Get unique filtered descendants from each matching selection
		 *
		 * @param filter
		 * @returns {$}
		 */
		find: function(filter) {
			return $(W.$find(this, filter));
		},

		/**
		 * Get the first element of a matching selection
		 *
		 * @returns {$}
		 */
		first: function() {
			return this.eq(0);
		},

		/**
		 * Return node from Wee object at specific index
		 *
		 * @returns {HTMLElement}
		 */
		get: function(index) {
			return W.$eq(this, index);
		},

		/**
		 * Determine if the matching selection has a class
		 *
		 * @param value
		 * @returns {boolean}
		 */
		hasClass: function(value) {
			return W.$hasClass(this, value);
		},

		/**
		 * Get or set the height of each matching selection
		 *
		 * @param {(function|number|string)} value
		 * @returns {($|number)}
		 */
		height: function(value) {
			var r = W.$height(this, value);

			return value === U || value === true ? r : this;
		},

		/**
		 * Hide each matching selection
		 *
		 * @returns {$}
		 */
		hide: function() {
			W.$hide(this);

			return this;
		},

		/**
		 * Get inner HTML of first selection or set each matching selection's HTML
		 *
		 * @param {(function|string)} value
		 * @returns {($|string)}
		 */
		html: function(value) {
			var r = W.$html(this, value);

			return value !== U ? this : r;
		},

		/**
		 * Get the zero-based index of a matching selection relative
		 * to it's siblings
		 *
		 * @returns {int}
		 */
		index: function() {
			return W.$index(this);
		},

		/**
		 * Insert each matching source selection element after
		 * each matching target selection
		 *
		 * @param {($|HTMLElement|string)} source
		 * @returns {$}
		 */
		insertAfter: function(source) {
			W.$insertAfter(this, source);

			return this;
		},

		/**
		 * Insert each matching source selection element before
		 * each matching target selection
		 *
		 * @param {($|HTMLElement|string)} source
		 * @returns {$}
		 */
		insertBefore: function(source) {
			W.$insertBefore(this, source);

			return this;
		},

		/**
		 * Determine if at least one matching selection matches
		 * a specified criteria
		 *
		 * @param filter
		 * @param [options]
		 * @returns {boolean}
		 */
		is: function(filter, options) {
			return W.$is(this, filter, options);
		},

		/**
		 * Get the last element of a matching selection
		 *
		 * @param {($|HTMLElement|string)} [context=document]
		 * @returns {$}
		 */
		last: function(context) {
			return $(W.$last(this, context));
		},

		/**
		 * Get the unique next sibling of each matching selection
		 *
		 * @param filter
		 * @param {object} [options]
		 * @returns {$}
		 */
		next: function(filter, options) {
			return $(W.$next(this, filter, options));
		},

		/**
		 * Returns elements not matching the filtered selection
		 *
		 * @param filter
		 * @param {object} [options]
		 * @returns {$}
		 */
		not: function(filter, options) {
			return $(W.$not(this, filter, options));
		},

		/**
		 * Get the offset position of a matching selection relative to the document
		 *
		 * @param {(function|number)} value
		 * @returns {number}
		 */
		offset: function(value) {
			return W.$offset(this, value);
		},

		/**
		 * Get unique parent from each matching selection
		 *
		 * @returns {$}
		 */
		parent: function(filter) {
			return $(W.$parent(this, filter));
		},

		/**
		 * Get unique ancestors of each matching selection
		 *
		 * @param filter
		 * @returns {$}
		 */
		parents: function(filter) {
			return $(W.$parents(this, filter));
		},

		/**
		 * Get the position of the first matching selection relative
		 * to its offset parent
		 *
		 * @returns {{top, left}}
		 */
		position: function() {
			return W.$position(this);
		},

		/**
		 * Prepend selection or markup before each matching selection
		 *
		 * @param {($|function|HTMLElement|string)} source
		 * @returns {$}
		 */
		prepend: function(source) {
			W.$prepend(this, source);

			return this;
		},

		/**
		 * Prepend selection or markup to each matching selection
		 *
		 * @param {($|HTMLElement|string)} target
		 * @returns {$}
		 */
		prependTo: function(target) {
			W.$prepend(target, this.reverse());

			return this;
		},

		/**
		 * Get the unique previous sibling of each matching selection
		 *
		 * @param filter
		 * @param {object} [options]
		 * @returns {$}
		 */
		prev: function(filter, options) {
			return $(W.$prev(this, filter, options));
		},

		/**
		 * Get property of first matching selection or set property of
		 * each matching selection
		 *
		 * @param a
		 * @param b
		 * @returns {($|string)}
		 */
		prop: function(a, b) {
			var r = W.$prop(this, a, b);

			return b !== U || W.$isObject(a) ? this : r;
		},

		/**
		 * Remove each matching selection from the document
		 *
		 * @returns {$}
		 * @param {($|HTMLElement|string)} [context=document]
		 */
		remove: function(context) {
			W.$remove(this, context);

			return this;
		},

		/**
		 * Remove specified attribute of each matching selection
		 *
		 * @param {string} name
		 * @returns {$}
		 */
		removeAttr: function(name) {
			W.$removeAttr(this, name);

			return this;
		},

		/**
		 * Remove classes from each matching selection
		 *
		 * @param {(function|string)} value
		 * @returns {$}
		 */
		removeClass: function(value) {
			W.$removeClass(this, value);

			return this;
		},

		/**
		 * Replace each matching selection with selection or markup
		 *
		 * @param {($|HTMLElement|string)} source
		 * @returns {$}
		 */
		replaceWith: function(source) {
			W.$replaceWith(this, source);

			return this;
		},

		/**
		 * Get or set the X scroll position of each matching selection
		 *
		 * @param value
		 * @returns {($|number)}
		 */
		scrollLeft: function(value) {
			var r = W.$scrollLeft(this, value);

			return value === U || value === true ? r : this;
		},

		/**
		 * Get or set the Y scroll position of each matching selection
		 *
		 * @param value
		 * @returns {($|number)}
		 */
		scrollTop: function(value) {
			var r = W.$scrollTop(this, value);

			return value === U || value === true ? r : this;
		},

		/**
		 * Serialize input values from first matching form selection
		 *
		 * @returns {string}
		 */
		serialize: function() {
			return W.$serializeForm(this);
		},

		/**
		 * Show each matching selection
		 *
		 * @returns {$}
		 */
		show: function() {
			W.$show(this);

			return this;
		},

		/**
		 * Get unique siblings of each matching selection
		 *
		 * @param filter
		 * @returns {$}
		 */
		siblings: function(filter) {
			return $(W.$siblings(this, filter));
		},

		/**
		 * Get subset of selection matches from specified range
		 *
		 * @param start
		 * @param end
		 * @returns {$}
		 */
		slice: function(start, end) {
			return $(W.$slice(this, start, end));
		},

		/**
		 * Get inner text of first selection or set each matching selection's text
		 *
		 * @param {(function|string)} value
		 * @returns {($|string)}
		 */
		text: function(value) {
			var r = W.$text(this, value);
			return value !== U ? this : r;
		},

		/**
		 * Toggle the display of each matching selection
		 *
		 * @returns {$}
		 */
		toggle: function() {
			W.$toggle(this);

			return this;
		},

		/**
		 * Toggle adding and removing class(es) from the specified element
		 *
		 * @param {(function|string)} className
		 * @param {boolean} [state]
		 * @returns {$}
		 */
		toggleClass: function(className, state) {
			W.$toggleClass(this, className, state);

			return this;
		},

		/**
		 * Get value of first matching selection or set values of
		 * each matching selection
		 *
		 * @param {(function|string)} value
		 * @returns {($|string)}
		 */
		val: function(value) {
			var r = W.$val(this, value);

			return value !== U ? this : r;
		},

		/**
		 * Get or set the width of each matching selection
		 *
		 * @param {(function|number|string)} value
		 * @returns {($|number)}
		 */
		width: function(value) {
			var r = W.$width(this, value);

			return value === U || value === true ? r : this;
		},

		/**
		 * Wrap markup around each matching selection
		 *
		 * @param {(function|string)} html
		 * @returns {$}
		 */
		wrap: function(html) {
			W.$wrap(this, html);

			return this;
		},

		/**
		 * Wrap markup around the content of each matching selection
		 *
		 * @param {(function|string)} html
		 * @returns {$}
		 */
		wrapInner: function(html) {
			W.$wrapInner(this, html);

			return this;
		}
	});
})(Wee, undefined);