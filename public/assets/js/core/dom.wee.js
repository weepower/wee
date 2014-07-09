// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.extend('', {
	// Clone specified element|selector
	// Returns element array
	$clone: function(sel) {
		return this.$map(sel, function(el) {
			return el.cloneNode(true);
		});
	},
	// Determine if specified element|selector has specified class
	// Returns boolean
	$hasClass: function(sel, val) {
		var el = this.$first(sel);

		return el.classList ?
			el.classList.contains(val) :
			new RegExp('(^| )' + val + '( |$)', 'gi').test(el.className);
	},
	// Show specified element|selector
	$show: function(sel) {
		this.$each(sel, function(el) {
			Wee.$removeClass(el, 'js-hide');
		});
	},
	// Hide specified element|selector
	$hide: function(sel) {
		this.$each(sel, function(el) {
			Wee.$addClass(el, 'js-hide');
		});
	},
	// Toggle the display of a specified element|selector
	$toggle: function(sel) {
		this.$each(sel, function(el) {
			! Wee.$hasClass(el, 'js-hide') ? Wee.$hide(el) : Wee.$show(el);
		});
	},
	// Get children of specified element|selector with optional filter
	// Returns element array
	$children: function(sel, filter) {
		var el = this.$first(sel);

		if (el) {
			var children = [].slice.call(el.children);

			return filter ? this.$filter(children, filter) : children;
		}

		return null;
	},
	// Get content of specified element|selector
	// Returns element array
	$contents: function(sel) {
		var el = this.$first(sel);

		return el ? el.childNodes : null;
	},
	// Get siblings of specified element|selector with optional filter
	// Returns element array
	$siblings: function(sel, filter) {
		var el = this.$first(sel);

		if (el) {
				var siblings = [].slice.call(el.parentNode.children),
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
			return sel[sel.length - 1];
		}

		var el = this.$(sel);

		return Wee.$isArray(el) ? el[el.length - 1] : el;
	},
	// Determine if specified parent element|selector contains specified child element|selector
	// Returns boolean
	$contains: function(sel, child) {
		var el = this.$first(sel);

		return Wee.$(child, el).length ? true : false;
	},
	// Append specified child element|selector to parent element|selector
	$append: function(sel, child) {
		var str = this.$isString(child);

		this.$each(sel, function(el) {
			str ?
				el.innerHTML = el.innerHTML + child :
				Wee.$each(child, function(cel) {
					el.appendChild(cel);
				});
		});
	},
	// Prepend specified child element|selector to specified parent element|selector
	$prepend: function(sel, child) {
		var str = Wee.$isString(child);

		this.$each(sel, function(el) {
			str ?
				el.innerHTML = child + el.innerHTML :
				Wee.$each(child, function(cel) {
					el.insertBefore(cel, el.firstChild);
				});
		});
	},
	// Insert specified element|selector before specified element|selector
	$before: function(sel, pos) {
		var str = Wee.$isString(pos);

		this.$each(sel, function(el) {
			str ?
				el.insertAdjacentHTML('beforebegin', pos) :
				Wee.$each(pos, function(cel) {
					el.parentNode.insertBefore(cel, el);
				});
		});
	},
	// Insert specified element|selector before specified element|selector
	$insertBefore: function(prev, sel) {
		this.$each(sel, function(el) {
			Wee.$each(prev, function(cel) {
				el.parentNode.insertBefore(cel, el);
			});
		});
	},
	// Insert specified element|selector after specified element|selector
	$after: function(sel, pos) {
		var str = this.$isString(pos);

		this.$each(sel, function(el) {
			str ?
				el.insertAdjacentHTML('afterend', pos) :
				Wee.$each(pos, function(cel) {
					el.parentNode.insertBefore(cel, el.nextSibling);
				});
		});
	},
	// Insert specified element|selector after specified element|selector
	$insertAfter: function(next, sel) {
		this.$each(sel, function(el) {
			Wee.$each(next, function(cel) {
				el.parentNode.insertBefore(cel, el.nextSibling);
			});
		});
	},
	// Remove specified element|selector from document
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
	// Wrap HTML around specified element|selector
	$wrap: function(sel, html) {
		this.$each(sel, function(el) {
			var wrap = Wee.$parseHTML(html);

			Wee.$each(wrap, function(cel) {
				cel.appendChild(el.cloneNode(true));
				el.parentNode.replaceChild(cel, el);
			});
		});
	},
	// Wrap HTML around the content of specified element|selector
	$wrapInner: function(sel, html) {
		this.$each(sel, function(el) {
			var wrap = Wee.$parseHTML(html),
				children = Wee.$children(el);

			if (children.length == 0) {
				children = Wee.$contents(el)[0];
			}

			Wee.$append(el, wrap);

			Wee.$each(children, function(cel) {
				wrap.appendChild(el.removeChild(cel));
			});
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
			el.removeAttribute(key);
		});
	},
	// Get text value of specified element|selector or set text with specified value
	$text: function(sel, val) {
		if (val !== undefined) {
			this.$each(sel, function(el) {
				el.textContent !== undefined ?
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
			this.$each(sel, function() {
				this.value = val;
			});
		} else {
			return this.$first(sel).value;
		}
	},
	// Get indexed node of specified element|selector
	// Returns element
	$eq: function(sel, i) {
		if (sel['_$_']) {
			return sel[i];
		}

		var el = this.$(sel);

		if (Wee.$isArray(el)) {
			return i < 0 ? el[el.length + i] : el[i];
		}

		return null;
	},
	// Get matching nodes based on a specified filter within a specified element|selector
	// Returns element array
	$find: function(sel, filter) {
		var arr = [];

		this.$each(sel, function(el) {
			arr = arr.concat(Wee.$(filter, el));
		});

		return arr;
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
	$filter: function(sel, filter, opt) {
		return this.$map(sel, function(el) {
			return Wee.$is(el, filter, opt) ? el : false;
		});
	},
	// Determines if a particular element|selector matches a specified criteria
	// Returns boolean
	$is: function(sel, filter, opt) {
		var el = this.$first(sel);

		if (this.$isFunction(filter)) {
			return Wee.$exec(filter, Wee.$extend({
				scope: el
			}, opt));
		} else {
			var matches = el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector;

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
		}

		return false;
	},
	// Get the sibling index of a specified element|selector
	// Returns int
	$index: function(sel) {
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
	// Convert specified HTML string to a DOM object and optionally converts it to a Wee DOM object
	// Returns element
	$parseHTML: function(html, obj) {
		var el = document.createElement('div');
			el.innerHTML = html;

		return obj ? $(el.firstChild) : el.firstChild;
	},
	// Get the position of a specified element|selector
	// Returns object
	$position: function(sel) {
		var el = this.$first(sel);

		return {
			left: el.offsetLeft,
			top: el.offsetTop
		}
	},
	// Get the offset of a specified element|selector
	// Returns object
	$offset: function(sel) {
		var el = this.$first(sel),
			rect = el.getBoundingClientRect(),
			b = document.body;

		return {
			top: rect.top + b.scrollTop,
			left: rect.left + b.scrollLeft
		}
	},
	// Get or set the width of a specified element|selector, optionally accounting for margin
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
		if (sel) {
			var el = sel.isArray || Object.prototype.toString.call(sel) == '[object Array]' ? sel : [sel],
				len = el.length,
				i = 0;

			c.sel = sel;

			for (; i < len; i++) {
				c.push.call(this, el[i]);
			}
		}
	}

	window.$ = function(sel, context) {
		var o = new get(sel, context);
			o.sel = sel;

		return o;
	}

	$[p] = get[p] = {
		length: 0,
		_$_: true,
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
			return $(Wee.$content(this));
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
			Wee.$prepend(parent, this);
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
		parse: function(obj) {
			var str = Wee.$html(this);
			str = Wee.data.parse(str, obj);
			Wee.$html(this, str);
			return this;
		}
	}
})([], 'prototype');