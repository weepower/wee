// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.extend('', {
	// Determine if specified element|selector has specified class name
	// Returns boolean
	$hasClass: function(sel, val) {
		var el = this.$first(sel);

		return el.classList ?
			el.classList.contains(val) :
			new RegExp('(^| )' + val + '( |$)', 'gi').test(el.className);
	},
	// Show specified element|selector
	$show: function(sel) {
		this.$css(sel, display, '');
	},
	// Hide specified element|selector
	$hide: function(sel) {
		this.$css(sel, display, 'none');
	},
	// Get children of specified element|selector with optional filter
	// Returns element array
	$children: function(sel, filter) {
		var el = this.$first(sel);

		if (el) {
			var children = [],
				len = el.children.length,
				i = 0;

			for (; i < len; i++) {
				if (el.children[i].nodeType != 8) {
					children.push(el.children[i]);
				}
			}

			return filter ? this.$filter(children, filter) : children;
		}

		return null;
	},
	// Get siblings of specified element|selector with optional filter
	// Returns element array
	$siblings: function(sel, filter) {
		var el = this.$first(sel);

		if (el) {
				var siblings = Array.prototype.slice.call(el.parentNode.children),
					len = siblings.length,
					i = 0;

			for (; i < len; i++) {
				if (siblings[i] === el) {
					siblings.splice(i, 1);
					break;
				}
			}

			return filter ? this.$filter(siblings, filter) : siblings;
		}

		return null;
	},
	// Get parent of specified element|selector
	// Returns element
	$parent: function(sel) {
		return Wee.$first(sel).parentNode;
	},
	// Get last match to specified element|selector
	// Returns element
	$last: function(sel) {
		if (sel['_$_']) {
			var len = sel.length;

			return sel[len - 1];
		}

		var el = this.$(sel);

		if (Wee.$isArray(el)) {
			var len = el.length - 1;

			return el[len];
		}

		return el;
	},
	// Determine if parent element|selector contains child element|selector
	// Returns boolean
	$contains: function(sel, child) {
		var el = this.$first(sel);

		return Wee.$(child, el).length ? true : false;
	},
	// Append specified child element to parent element|selector
	$append: function(sel, child) {
		if (this.$isString(child)) {
			this.$each(sel, function(el) {
				el.innerHTML = el.innerHTML + child;
			});
		} else {
			this.$each(sel, function(el) {
				el.appendChild(child);
			});
		}
	},
	// Prepend specified child element to parent element|selector
	$prepend: function(sel, child) {
		if (this.$isString(child)) {
			this.$each(sel, function(el) {
				el.innerHTML = child + el.innerHTML;
			});
		} else {
			this.$each(sel, function(el) {
				el.insertBefore(child, el.firstChild);
			});
		}
	},
	// Insert specified element before specified element|selector
	$before: function(sel, html) {
		this.$each(sel, function(el) {
			el.insertAdjacentHTML('beforebegin', html);
		});
	},
	// Insert specified element after specified element|selector
	$after: function(sel, html) {
		this.$each(sel, function(el) {
			el.insertAdjacentHTML('afterend', html);
		});
	},
	// Remove specified element|selector from DOM
	$remove: function(sel) {
		this.$each(sel, function(el) {
			el.parentNode.removeChild(el);
		})
	},
	// Remove child nodes from specified element|selector
	$empty: function(sel) {
		this.$each(sel, function(el) {
			while (el.firstChild) {
				el.removeChild(el.firstChild);
			}
		});
	},
	// Get property of specified element|selector or set property with specified value
	$prop: function(sel, key, val) {
		if (val !== undefined) {
			this.$each(sel, function(el) {
				el[key] = val;
			});
		} else {
			var el = this.$first(sel);

			return el[key];
		}
	},
	// Remove specified attribute of specified element|selector
	$removeAttr: function(sel, key) {
		this.$each(sel, function(el) {
			el.removeAttr(key);
		});
	},
	// Get text value of specified element|selector or set text with specified value
	$text: function(sel, val) {
		if (val !== undefined) {
			this.$each(sel, function(el) {
				(el.textContent !== undefined) ?
					el.textContent = val:
					el.innerText = val;
			});
		} else {
			var el = this.$first(sel);

			return el.textContent || el.innerText;
		}
	},
	// Get value of specified element|selector or set specified value
	$val: function(sel, val) {
		if (val !== undefined) {
			this.$each(sel, function(el) {
				el.value = val;
			});
		} else {
			var el = this.$first(sel);

			return el.value;
		}
	},
	// Toggle the display of a specified element|selector
	$toggle: function(sel) {
		this.$each(sel, function(el) {
			(el.style.display != 'none') ? Wee.$hide(el) : Wee.$show(el);
		});
	},
	// Get indexed node of specified element|selector
	// Returns element
	$eq: function(sel, i) {
		if (sel['_$_']) {
			return sel[i];
		}

		var el = this.$(sel);

		if (Wee.$isArray(el)) {
			return (i < 0) ? el[el.length + i] : el[i];
		}

		return null;
	},
	// Get matching nodes based on a specified filter within a specified element|selector
	// Returns element array
	$find: function(sel, filter) {
		var matches = [];

		this.$each(sel, function(el) {
			matches.concat(Wee.$(filter, el));
		});

		return matches;
	},
	// Get the next sibling of a specified element|selector
	// Returns element
	$next: function(sel) {
		var el = this.$first(sel);

		do {
			el = el.nextSibling;
		} while (el && el.nodeType !== 1);

		return el;
	},
	// Get the previous sibling of a specified element|selector
	// Returns element
	$prev: function(sel) {
		var el = this.$first(sel);

		do {
			el = el.previousSibling;
		} while (el && el.nodeType !== 1);

		return el;
	},
	// Return a subset of elements based on a specified filter from a specified element|selector
	// Returns element array
	$filter: function(sel, filter) {
		var matches = [];

		this.$each(sel, function(el) {
			if (Wee.$is(el, filter)) {
				matches.push(el);
			}
		});

		return matches;
	},
	// Determines if a particular element|selector matches a specified criteria
	// Returns boolean
	$is: function(sel, filter) {
		var el = this.$first(sel),
			matches = (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector);

		if (matches) {
			return matches.call(el, filter);
		} else {
			var elem = el.parentNode.querySelectorAll(filter),
				len = elem.length;
				i = 0;

			for (; i < len; i++) {
				if (elem[i] === el) {
					return true;
				}
			}
		}

		return false;
	},
	// Get the sibling index of a specified element|selector
	// Returns int
	$indexOf: function(sel) {
		var el = this.$first(sel),
			parent = this.$parent(el),
			children = this.$children(parent),
			len = children.length,
			i = 0;

		for (; i < len; i++) {
			if (children[i] === el) {
				return i;
			}
		}

		return -1;
	},
	// Get the closest node of element|selector with specified filter
	// Returns element
	$closest: function(sel, filter) {
		var el = this.$first(sel);

		while (el !== null) {
			el = el.parentNode;

			if (this.$is(el, filter)) {
				return el;
			}
		}

		return null;
	},
	// Toggle the display of a specified element|selector
	$toggleClass: function(sel, val) {
		this.$each(sel, function(el) {
			Wee.$hasClass(el, val) ?
				Wee.$removeClass(el, val) :
				Wee.$addClass(el, val);
		});
	},
	// Convert HTML string to a DOM object
	// Returns element
	$parseHTML: function(html) {
		var el = document.createElement('div');
			el.innerHTML = html;

		return el.children;
	},
	// Get the position of an element|selector
	// Returns object
	$position: function() {
		var el = this.$first(sel);

		return {
			left: el.offsetLeft,
			top: el.offsetTop
		}
	},
	// Get the offset of an element|selector
	// Returns object
	$offset: function() {
		var rect = el.getBoundingClientRect(),
			b = document.body;

		return {
			top: rect.top + b.scrollTop,
			left: rect.left + b.scrollLeft
		}
	},
	// Get or set the width of an element|selector, optionally accounting for margin
	// Returns int
	$width: function(sel, val) {
		if (sel === window) {
			return sel.innerWidth;
		}

		var el = this.$first(sel);

		if (val === undefined || val === true) {
			var width = el.offsetWidth;

			if (val === true) {
				var style = el.currentStyle || getComputedStyle(el);

				width += parseInt(style.marginLeft) + parseInt(style.marginRight);
			}

			return width;
		}

		this.$css(el, 'width', val);
	},
	// Get or set the height of an element|selector, optionally accounting for margin
	// Returns int
	$height: function(sel, val) {
		if (sel === window) {
			return sel.innerHeight;
		}

		var el = this.$first(sel);

		if (val === undefined || val === true) {
			var height = el.offsetHeight;

			if (val === true) {
				var style = el.currentStyle || getComputedStyle(el);

				height += parseInt(style.marginTop) + parseInt(style.marginBottom);
			}

			return height;
		}

		this.$css(el, 'height', val);
	}
});

(function(c, p) {
	function get(sel, context) {
		var el = Wee.$toArray(Wee.$(sel, context)),
			len = el.length,
			i = 0;

		for (; i < len; i++) {
			c.push.call(this, el[i]);
		}
	}

	window.$ = function(sel, context) {
		return new get(sel, context);
	}

	$[p] = get[p] = {
		length: 0,
		_$_: true,
		// Base
		clone: function() {
			return Wee.$clone(this);
		},
		each: function(fn) {
			Wee.$each(this, fn);
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
			Wee.$css(this, a, b);
			return this;
		},
		attr: function(key, val) {
			var r = Wee.$attr(this, key, val);
			return val ? this : r;
		},
		// DOM
		hasClass: function(val) {
			return Wee.$hasClass(this, val);
		},
		html: function(val) {
			var r = Wee.$html(this, val);
			return val ? this : r;
		},
		removeAttr: function(key) {
			var r = Wee.$removeAttr(this, key);
			return val ? this : r;
		},
		data: function(key, val) {
			var r = Wee.$data(this, key, val);
			return val ? this : r;
		},
		prop: function(key, val) {
			var r = Wee.$prop(this, key, val);
			return val ? this : r;
		},
		val: function(key, val) {
			var r = Wee.$val(this, key, val);
			return val ? this : r;
		},
		show: function() {
			Wee.$show(this);
			return this;
		},
		hide: function() {
			Wee.$hide(this);
			return this;
		},
		children: function(filter) {
			return Wee.$children(this, filter);
		},
		siblings: function(filter) {
			return Wee.$siblings(this, filter);
		},
		parent: function() {
			return Wee.$parent(this);
		},
		contains: function(child) {
			return Wee.$contains(this, child);
		},
		append: function(child) {
			Wee.$append(this, child);
			return this;
		},
		appendTo: function(parent) {
			Wee.$prepend(parent, this);
			return this;
		},
		prepend: function(child) {
			Wee.$prepend(this, child);
			return this;
		},
		prependTo: function(parent) {
			Wee.$prepend(parent, this);
			return this;
		},
		before: function(html) {
			Wee.$before(this, html);
			return this;
		},
		insertBefore: function(sel) {
			Wee.$before(sel, this);
			return this;
		},
		after: function(html) {
			Wee.$after(this, html);
			return this;
		},
		insertAfter: function(sel) {
			Wee.$after(sel, this);
			return this;
		},
		remove: function() {
			Wee.$remove(this);
			return this;
		},
		empty: function() {
			Wee.$empty(this);
			return this;
		},
		text: function(val) {
			var r = Wee.$text(this, val);
			return val ? this : r;
		},
		toggle: function() {
			Wee.$toggle(this);
			return this;
		},
		eq: function(i) {
			return Wee.$eq(this, i);
		},
		first: function() {
			return Wee.$first(this);
		},
		last: function() {
			return Wee.$last(this);
		},
		find: function(filter) {
			return Wee.$find(this, filter);
		},
		next: function() {
			return Wee.$next(this);
		},
		prev: function() {
			return Wee.$prev(this);
		},
		filter: function(filter) {
			return Wee.$filter(this, filter);
		},
		is: function(filter) {
			return Wee.$is(this, filter);
		},
		indexOf: function() {
			return Wee.$indexOf(this);
		},
		closest: function(filter) {
			return Wee.$closest(this, filter);
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
		on: function(evts, opt) {
			Wee.events.on(this, evts, opt);
			return this;
		},
		off: function(evts, opt) {
			Wee.events.off(this, evts, opt);
			return this;
		},
		one: function(evts, opt) {
			Wee.events.one(this, evts, opt);
			return this;
		},
		trigger: function(evt) {
			Wee.events.trigger(this, evt);
		},
		// Data
		parse: function(obj) {
			var str = Wee.$html(this);
			str = Wee.data.parse(str, obj);
			Wee.$html(this, str);
			return this;
		}
	}
})([], 'prototype');