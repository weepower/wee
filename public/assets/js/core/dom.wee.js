// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.extend('', {
	// Determine if specified element has specified class name
	// Returns boolean
	$hasClass: function(el, val) {
		return el.classList ?
			el.classList.contains(val) :
			new RegExp('(^| )' + val + '( |$)', 'gi').test(el.className);
	},
	// Hide specified element
	$show: function(sel) {
		this.$each(sel, function(el) {
			el.style.display = '';
		})
	},
	// Get children of specified element
	$children: function(el) {
		el = this.$(el);

		var children = [],
			len = el.children.length,
			i = 0;

		for (; i < len; i++) {
			if (el.children[i].nodeType != 8) {
				children.push(el.children[i]);
			}
		}
	},
	// Get siblings of specified element
	$siblings: function(el) {
		el = this.$(el);

		var siblings = Array.prototype.slice.call(el.parentNode.children),
			len = siblings.length,
			i = 0;

		for (; i < len; i++) {
			if (siblings[i] === el) {
				siblings.splice(i, 1);
				break;
			}
		}
	},
	// Hide specified element
	$hide: function(sel) {
		this.$each(sel, function(el) {
			el.style.display = 'none';
		})
	},
	// Append specified child element to parent element
	$append: function(el, child) {
		el.appendChild(child);
	},
	// Prepend specified child element to parent element
	$prepend: function(el, child) {
		el.insertBefore(child, el.firstChild);
	},
	// Insert specified element before specified element
	$before: function(el, html) {
		el.insertAdjacentHTML('beforebegin', html);
	},
	// Insert specified element after specified element
	$after: function(el, html) {
		el.insertAdjacentHTML('afterend', html);
	},
	// Remove specified element from DOM
	$remove: function(sel) {
		this.$each(sel, function(el) {
			el.parentNode.removeChild(el);
		})
	},
	// Get text value of specified element or selector or set text with specified value
	$text: function(el, val) {
		el = this.$(el);

		if (val) {
			(el.textContent !== undefined) ?
				el.textContent = val:
				el.innerText = val;
		} else {
			return el.textContent || el.innerText;
		}
	}
});