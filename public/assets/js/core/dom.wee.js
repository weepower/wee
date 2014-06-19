// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.extend('', {
	// Determine if specified element|selector has specified class name
	// Returns boolean
	$hasClass: function(sel, val) {
		var el = this.$first(sel);

		el.classList ?
			el.classList.contains(val) :
			new RegExp('(^| )' + val + '( |$)', 'gi').test(el.className);
	},
	// Hide specified selector
	$show: function(sel) {
		this.$css(sel, {
			display: ''
		});
	},
	// Hide specified selector
	$hide: function(sel) {
		this.$css(sel, {
			display: 'none'
		});
	},
	// Get children of specified element|selector
	// Returns nodeList of children
	$children: function(sel) {
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

			return children;
		}

		return null;
	},
	// Get siblings of specified element|selector
	// Returns nodeList of siblings
	$siblings: function(sel) {
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

			return siblings;
		}

		return null;
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
	// Get text value of specified element|selector or set text with specified value
	$text: function(sel, val) {
		if (val) {
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
	// Convert HTML string to a DOM object
	$parseHTML: function(html) {
		var el = document.createElement('div');
			el.innerHTML = html;

		return el.children;
	}
});