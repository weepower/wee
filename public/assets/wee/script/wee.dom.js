// Wee 2.0.2 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.extend({
	// Clone specified element
	// Returns element array
	$clone: function(sel) {
		return this.$map(sel, function(el) {
			return el.cloneNode(true);
		});
	},
	// Show specified element
	$show: function(sel) {
		this.$each(sel, function(el) {
			Wee.$removeClass(el, 'js-hide');
		});
	},
	// Hide specified element
	$hide: function(sel) {
		this.$each(sel, function(el) {
			Wee.$addClass(el, 'js-hide');
		});
	},
	// Toggle the display of a specified element
	$toggle: function(sel) {
		this.$each(sel, function(el) {
			! Wee.$hasClass(el, 'js-hide') ? Wee.$hide(el) : Wee.$show(el);
		});
	},
	// Get children of specified element with optional filter
	// Returns element array
	$children: function(sel, filter) {
		var arr = [];

		this.$each(sel, function(el) {
			var children = Wee._slice.call(el.children);

			arr = arr.concat(filter ? Wee.$filter(children, filter) : children);
		});

		return this.$unique(arr);
	},
	// Get content of specified element
	// Returns element array
	$contents: function(sel) {
		var arr = [];

		this.$each(sel, function(el) {
			arr = arr.concat(Wee._nodeArray(el.childNodes));
		});

		return this.$unique(arr);
	},
	// Get siblings of specified element with optional filter
	// Returns element array
	$siblings: function(sel, filter) {
		var arr = [];

		this.$each(sel, function(el) {
			var siblings = Wee._slice.call(el.parentNode.children),
				len = siblings.length,
				i = 0;

			for (; i < len; i++) {
				if (siblings[i] === el) {
					siblings.splice(i, 1);
					break;
				}
			}

			arr = arr.concat(filter ? Wee.$filter(siblings, filter) : siblings);
		});

		return this.$unique(arr);
	},
	// Get parent of specified element
	// Returns element
	$parent: function(sel) {
		return this.$unique(this.$map(sel, function(el) {
			return el.parentNode;
		}));
	},
	// Get last match of specified element
	// Returns element
	$last: function(sel) {
		var arr = [];

		if (sel['_$_']) {
			return sel[sel.length - 1];
		}

		var el = this.$(sel);

		return Array.isArray(el) ? el[el.length - 1] : el;
	},
	// Determine if specified parent element contains specified child element
	// Returns boolean
	$contains: function(sel, child) {
		var b = false;

		this.$each(sel, function(el) {
			if (Wee.$(child, el).length > 0) {
				b = true;
				return;
			}
		});

		return b;
	},
	// Append specified child element to parent element
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
	// Prepend specified child element to specified parent element
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
	// Insert specified element before specified element
	$before: function(sel, pos) {
		var str = Wee.$isString(pos);

		this.$each(sel, function(el, i) {
			str ?
				el.insertAdjacentHTML('beforebegin', pos) :
				Wee.$each(pos, function(cel) {
					if (i > 0) {
						cel = Wee.$clone(cel)[0];
					}

					el.parentNode.insertBefore(cel, el);
				}, {
					reverse: true
				});
		});
	},
	// Insert specified element before specified element
	$insertBefore: function(prev, sel) {
		this.$each(sel, function(el) {
			Wee.$each(prev, function(cel) {
				el.parentNode.insertBefore(cel, el);
			});
		});
	},
	// Insert specified element after specified element
	$after: function(sel, pos, rem) {
		var str = this.$isString(pos);

		this.$each(sel, function(el, i) {
			str ?
				el.insertAdjacentHTML('afterend', pos) :
				Wee.$each(pos, function(cel) {
					if (i > 0) {
						cel = Wee.$clone(cel)[0];
					}

					el.parentNode.insertBefore(cel, el.nextSibling);
				}, {
					reverse: true
				});

			if (rem) {
				Wee.$remove(el);
			}
		});
	},
	// Insert specified element after specified element
	$insertAfter: function(next, sel) {
		this.$each(sel, function(el) {
			Wee.$each(next, function(cel) {
				el.parentNode.insertBefore(cel, el.nextSibling);
			});
		});
	},
	// Replace specified element with another specified element
	$replaceWith: function(sel, pos) {
		this.$after(sel, pos, true);
	},
	// Remove specified element from document
	$remove: function(sel) {
		this.$each(sel, function(el) {
			el.parentNode.removeChild(el);
		})
	},
	// Remove child nodes from specified element
	$empty: function(sel) {
		this.$each(sel, function(el) {
			while (el.firstChild) {
				el.removeChild(el.firstChild);
			}
		});
	},
	// Wrap HTML around specified element
	$wrap: function(sel, html) {
		this.$each(sel, function(el) {
			var wrap = Wee.$parseHTML(html);

			Wee.$each(wrap, function(cel) {
				cel.appendChild(el.cloneNode(true));
				el.parentNode.replaceChild(cel, el);
			});
		});
	},
	// Wrap HTML around the content of specified element
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
	// Get property of specified element or set property with specified value
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
	// Remove specified attribute of specified element
	$removeAttr: function(sel, key) {
		this.$each(sel, function(el) {
			el.removeAttribute(key);
		});
	},
	// Get text value of specified element or set text with specified value
	// Returns string
	$text: function(sel, val) {
		if (val !== undefined) {
			this.$each(sel, function(el) {
				el.textContent !== undefined ?
					el.textContent = val:
					el.innerText = val;
			});
		} else {
			var r = '';

			this.$each(sel, function(el) {
				r += (el.textContent || el.innerText).trim();
			});

			return r;
		}
	},
	// Get value of specified element or set specified value
	// Returns string
	$val: function(sel, val) {
		if (val !== undefined) {
			this.$each(sel, function(el) {
				if (el.nodeName == 'SELECT') {
					var opt = Wee.$find(el, 'option');
						val = Wee.$toArray(val);

					opt.forEach(function(a) {
						if (val.indexOf(a.value) > -1) {
							a.selected = true;
						}
					});
				} else {
					this.value = val;
				}
			});
		} else {
			var el = Wee.$first(sel);

			if (el.nodeName == 'SELECT') {
				var opt = this.$find(el, 'option'),
					val = [];

				opt.forEach(function(a) {
					if (a.selected) {
						val.push(a.value);
					}
				});

				return el.multiple ? val : val[0];
			} else {
				return el.value;
			}
		}
	},
	// Get indexed node of specified element
	// Returns element
	$eq: function(sel, i) {
		if (sel['_$_']) {
			return sel[i];
		}

		var el = this.$(sel);

		if (Array.isArray(el)) {
			return i < 0 ? el[el.length + i] : el[i];
		}

		return null;
	},
	// Get matching nodes based on a specified filter within a specified element
	// Returns element array
	$find: function(sel, filter) {
		var arr = [];

		this.$each(sel, function(el) {
			arr = arr.concat(Wee.$(filter, el));
		});

		return arr;
	},
	// Get the next sibling of a specified element
	// Returns element
	$next: function(sel) {
		return this.$map(sel, function(el) {
			do {
				el = el.nextSibling;
			} while (el && el.nodeType !== 1);

			return el || false;
		}).reverse();
	},
	// Get the previous sibling of a specified element
	// Returns element
	$prev: function(sel) {
		return this.$map(sel, function(el) {
			do {
				el = el.previousSibling;
			} while (el && el.nodeType !== 1);

			return el || false;
		});
	},
	// Return a subset of elements based on a specified filter from a specified element
	// Returns element array
	$filter: function(sel, filter, opt) {
		return this.$map(sel, function(el) {
			return Wee.$is(el, filter, opt) ? el : false;
		});
	},
	// Return a subset of elements based on a specified exclusion filter from a specified element
	// Returns element array
	$not: function(sel, filter, opt) {
		return this.$map(sel, function(el) {
			return Wee.$is(el, filter, opt) ? false : el;
		});
	},
	// Determines if a particular element matches a specified criteria
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
	// Get the sibling index of a specified element
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
	// Get the closest node of element with specified filter
	// Returns element
	$closest: function(sel, filter) {
		return this.$unique(this.$map(sel, function(el) {
			while (el !== null) {
				el = el.parentNode;

				if (el === Wee._html) {
					return false;
				}

				if (Wee.$is(el, filter)) {
					return el;
				}
			}
		}));
	},
	// Toggle the display of a specified element
	$toggleClass: function(sel, val) {
		this.$each(sel, function(el) {
			Wee.$each(val.split(' '), function(val) {
				Wee.$hasClass(el, val) ?
					Wee.$removeClass(el, val) :
					Wee.$addClass(el, val);
			});
		});
	},
	// Convert specified HTML string to a DOM object and optionally converts it to a Wee DOM object
	// Returns element
	$parseHTML: function(html, obj) {
		var el = Wee._doc.createElement('div');
			el.innerHTML = html;

		var children = this.$children(el);

		return obj ? $(children) : children;
	},
	// Get the position of a specified element
	// Returns object
	$position: function(sel) {
		var el = this.$first(sel);

		return {
			top: el.offsetTop,
			left: el.offsetLeft
		}
	},
	// Get the offset of a specified element
	// Returns object
	$offset: function(sel) {
		var el = this.$first(sel),
			rect = el.getBoundingClientRect(),
			b = Wee._body;

		return {
			top: rect.top + b.scrollTop,
			left: rect.left + b.scrollLeft
		}
	},
	// Get or set the width of a specified element, optionally accounting for margin
	// Returns int
	$width: function(sel, val) {
		if (sel === Wee._win) {
			return sel.innerWidth;
		}

		if (val === undefined || val === true) {
			var el = this.$first(sel),
				width = el.offsetWidth;

			if (val === true) {
				var style = el.currentStyle || getComputedStyle(el);

				width += parseInt(style.marginLeft) + parseInt(style.marginRight);
			}

			return width;
		}

		this.$css(sel, 'width', val);
	},
	// Get or set the height of an element, optionally accounting for margin
	// Returns int
	$height: function(sel, val) {
		if (val === undefined || val === true) {
			var el = this.$first(sel);

			switch (el) {
				case Wee._win:
					return el.innerHeight;
				case Wee._doc:
					return Math.max(Wee._body.scrollHeight, Wee._body.offsetHeight,
					Wee._html.clientHeight, Wee._html.scrollHeight, Wee._html.offsetHeight);
				default:
					var height = el.offsetHeight;

					if (val === true) {
						var style = el.currentStyle || getComputedStyle(el);

						height += parseInt(style.marginTop) + parseInt(style.marginBottom);
					}

					return height;
			}
		}

		this.$css(sel, 'height', val);
	},
	// Get or set the top scroll position of an element
	// Returns int
	$scrollTop: function(sel, val) {
		if (val === undefined) {
			var el = this.$first(sel);

			return el.pageYOffset !== undefined ?
				Wee._win.pageYOffset :
				(Wee._html || Wee._body).scrollTop;
		}

		this.$each(sel, function(el) {
			el.scrollTo(0, val);
		});
	}
});