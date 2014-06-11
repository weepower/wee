// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.extend('', {
	// Determine if the specified element has a specified class name
	// Returns boolean
	$hasClass: function(el, val) {
		return (el.classList) ?
			el.classList.contains(val) :
			new RegExp('(^| )' + val + '( |$)', 'gi').test(el.className);
	},
	// Append a specified child element to a parent element
	$append: function(el, child) {
		el.appendChild(child);
	},
	// Insert a specified element before a specified element
	$before: function(el, html) {
		el.insertAdjacentHTML('beforebegin', html);
	},
	// Insert a specified element after a specified element
	$after: function(el, html) {
		el.insertAdjacentHTML('afterend', html);
	},
	// Get the text value of a specified element or selector or set the text with a specified value
	$text: function(el, val) {
		// If an element selector is specified get the DOM elements
		el = this.$(el);

		if (val) {
			if (el.textContent !== undefined) {
				el.textContent = val;
			} else {
				el.innerText = val;
			}
		} else {
			return el.textContent || el.innerText;
		}
	}
});