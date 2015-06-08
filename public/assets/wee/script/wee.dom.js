(function(W, U) {
	'use strict';

	W.fn.extend({
		/**
		 * Add classes to each matching selection
		 *
		 * @param {(function|string)} target
		 */
		$addClass: function(target, value) {
			var func = W._canExec(value);

			W.$each(target, function(el, i) {
				var name = func ?
						W.$exec(value, {
							args: [i, el.className],
							scope: el
						}) :
						value;

				if (name) {
					el.className = (el.className + ' ' + name.split(/\s+/).filter(function(name) {
						return ! W.$hasClass(el, name);
					}).join(' ')).trim();
				}
			});
		},

		/**
		 * Insert selection or markup after each matching selection
		 *
		 * @param target
		 * @param source
		 * @param remove
		 */
		$after: function(target, source, remove) {
			var func = W._canExec(source);

			W.$each(target, function(el, i) {
				var aft = func ?
						W.$exec(source, {
							args: [i, el.innerHTML],
							scope: el
						}) :
						source;

				if (typeof aft == 'string') {
					aft = W.$parseHTML(aft);
				}

				if (aft) {
					W.$each(aft, function(cel) {
						if (i > 0) {
							cel = W.$clone(cel)[0];
						}

						el.parentNode.insertBefore(cel, el.nextSibling);
					}, {
						reverse: true
					});
				}

				if (remove) {
					W.$remove(el);
				}
			});
		},

		/**
		 * Append selection or markup after each matching selection
		 *
		 * @param target
		 * @param source
		 */
		$append: function(target, source) {
			var func = W._canExec(source);

			W.$each(target, function(el, i) {
				var app = func ?
						W.$exec(source, {
							args: [i, el.innerHTML],
							scope: el
						}) :
						source;

				if (typeof app == 'string') {
					app = W.$parseHTML(app);
				}

				if (app) {
					W.$each(app, function(cel) {
						el.appendChild(cel);
					});
				}
			});
		},

		/**
		 * Get attribute of first matching selection or set attribute of each matching selection
		 *
		 * @param target
		 * @param a
		 * @param b
		 * @returns {(string|undefined)}
		 */
		$attr: function(target, a, b) {
			var obj = W.$isObject(a);

			if (b !== U || obj) {
				var func = ! obj && W._canExec(b);

				W.$each(target, function(el, i) {
					obj ?
						Object.keys(a).forEach(function(key) {
							el.setAttribute(key, a[key]);
						}) :
						el.setAttribute(a, func ?
							W.$exec(b, {
								args: [i, el[a]],
								scope: el
							}) :
							b
						);
				});
			} else {
				return W.$first(target).getAttribute(a);
			}
		},

		/**
		 * Insert selection or markup before each matching selection
		 *
		 * @param target
		 * @param source
		 * @param remove
		 */
		$before: function(target, source, remove) {
			var func = W._canExec(source);

			W.$each(target, function(el, i) {
				var bef = func ?
						W.$exec(source, {
							args: [i, el.innerHTML],
							scope: el
						}) :
						source;

				if (typeof bef == 'string') {
					bef = W.$parseHTML(bef);
				}

				if (bef) {
					W.$each(bef, function(cel) {
						if (i > 0) {
							cel = W.$clone(cel)[0];
						}

						el.parentNode.insertBefore(cel, el);
					}, {
						reverse: true
					});
				}

				if (remove) {
					W.$remove(el);
				}
			});
		},

		/**
		 * Get unique direct children of each matching selection
		 *
		 * @param parent
		 * @param filter
		 * @returns {array}
		 */
		$children: function(parent, filter) {
			var arr = [];

			W.$each(parent, function(el) {
				var children = W._slice.call(el.children);

				arr = arr.concat(
					filter ?
						W.$filter(children, filter) :
						children
				);
			});

			return W.$unique(arr);
		},

		/**
		 * Clone each matching selection
		 *
		 * @param target
		 * @returns {array}
		 */
		$clone: function(target) {
			return W.$map(target, function(el) {
				return el.cloneNode(true);
			});
		},

		/**
		 * Get unique closest ancestors of each matching selection
		 *
		 * @param target
		 * @param filter
		 * @param context
		 * @returns {node}
		 */
		$closest: function(target, filter, context) {
			return W.$unique(W.$map(target, function(el) {
				if (W.$is(el, filter)) {
					return el;
				}

				while (el !== null) {
					el = el.parentNode;

					if (el === W._html) {
						return false;
					}

					if (W.$is(el, filter)) {
						return el;
					}
				}
			}, {
				context: context
			}));
		},

		/**
		 * Determine if any matching parent selection contains descendant selection
		 *
		 * @param parent
		 * @param descendant
		 * @returns {boolean}
		 */
		$contains: function(parent, descendant) {
			var b = false;

			W.$each(parent, function(el) {
				if (W.$(descendant, el).length > 0) {
					b = true;
					return;
				}
			});

			return b;
		},

		/**
		 * Get unique content of each matching selection
		 *
		 * @param parent
		 * @returns {array}
		 */
		$contents: function(parent) {
			var arr = [];

			W.$each(parent, function(el) {
				arr = arr.concat(W._slice.call(el.childNodes));
			});

			return W.$unique(arr);
		},

		/**
		 * Get CSS value of first matching selection or set value of each matching selection
		 *
		 * @param target
		 * @param {(object|string)} a
		 * @param {string} [b]
		 * @returns {(string|undefined)}
		 */
		$css: function(target, a, b) {
			var obj = W.$isObject(a);

			if (b !== U || obj) {
				var func = ! obj && W._canExec(b);

				W.$each(target, function(el, i) {
					obj ?
						Object.keys(a).forEach(function(key) {
							el.style[key] = a[key];
						}) :
						el.style[a] = func ?
							W.$exec(b, {
								args: [i, el.style[a]],
								scope: el
							}) :
							b;
				});
			} else {
				var el = W.$first(target);

				return W._legacy ?
					el.currentStyle[a] :
					getComputedStyle(el, null)[a];
			}
		},

		/**
		 * Get data of first matching selection or set data of each matching selection
		 *
		 * @param target
		 * @param a
		 * @param b
		 * @returns {(string|undefined)}
		 */
		$data: function(target, a, b) {
			if (a === U) {
				var el = W.$first(target),
					arr = {};

				W._slice.call(el.attributes).forEach(function(attr) {
					if (attr.name.substr(0, 5) == 'data-') {
						arr[attr.name.substring(5)] = attr.value;
					}
				});

				return arr;
			}

			if (W.$isObject(a)) {
				var obj = {};

				Object.keys(a).forEach(function(key) {
					obj['data-' + key] = a[key];
				});

				a = obj;
			} else {
				a = 'data-' + a;
			}

			return W.$attr(target, a, b);
		},

		/**
		 * Remove child nodes from each matching selection
		 *
		 * @param target
		 */
		$empty: function(target) {
			W.$each(target, function(el) {
				while (el.firstChild) {
					el.removeChild(el.firstChild);
				}
			});
		},

		/**
		 * Get indexed node of matching selection
		 *
		 * @param target
		 * @param index
		 * @param context
		 * @returns {node}
		 */
		$eq: function(target, index, context) {
			var el = W.$(target, context);
			return el[index < 0 ? el.length + index : index];
		},

		/**
		 * Return a filtered subset of elements from a matching selection
		 *
		 * @param target
		 * @param filter
		 * @param options
		 * @returns {Array} elements
		 */
		$filter: function(target, filter, options) {
			var func = W._canExec(filter);

			return W.$map(target, function(el, i) {
				var match = func ?
						W.$exec(filter, {
							args: [i, el],
							scope: el
						}) :
						W.$is(el, filter, options);

				return match ? el : false;
			});
		},

		/**
		 * Get unique filtered descendants from each matching selection
		 *
		 * @param parent
		 * @param filter
		 * @returns {Array} elements
		 */
		$find: function(parent, filter) {
			var arr = [];

			W.$each(parent, function(el) {
				arr = arr.concat(W.$(filter, el));
			});

			return W.$unique(arr);
		},

		/**
		 * Get the first element of a matching selection
		 *
		 * @param target
		 * @param context
		 * @returns {node}
		 */
		$first: function(target, context) {
			return W.$eq(target, 0, context);
		},

		/**
		 * Determine if the matching selection has a class
		 *
		 * @param target
		 * @param className
		 * @returns {boolean}
		 */
		$hasClass: function(target, className) {
			return W.$(target).some(function(el) {
				return new RegExp('(^| )' + className + '($| )', 'gim').test(el.className);
			});
		},

		/**
		 * Get or set the height of each matching selection
		 *
		 * @param target
		 * @param value
		 * @returns {int}
		 */
		$height: function(target, value) {
			var func = value && W._canExec(value),
				height;

			if (value === U || value === true || func) {
				var el = W.$first(target);

				if (el === W._win) {
					height = el.innerHeight;
				} else if (el === W._doc) {
					height = Math.max(
						W._body.offsetHeight,
						W._body.scrollHeight,
						W._html.clientHeight,
						W._html.offsetHeight,
						W._html.scrollHeight
					);
				} else {
					height = el.offsetHeight;

					if (value === true) {
						var style = el.currentStyle || getComputedStyle(el);
						height += parseInt(style.marginTop) + parseInt(style.marginBottom);
					}
				}

				if (! func) {
					return height;
				}
			}

			if (typeof value == 'number') {
				value = value + 'px';
			}

			W.$each(target, function(el, i) {
				W.$css(el, 'height', func ?
					W.$exec(value, {
						args: [i, height],
						scope: el
					}) :
					value
				);
			});
		},

		/**
		 * Hide each matching selection
		 *
		 * @param target
		 */
		$hide: function(target) {
			W.$addClass(target, 'js-hide');
		},

		/**
		 * Get inner HTML of first selection or set each matching selection's HTML
		 *
		 * @param target
		 * @param value
		 * @returns {(string|undefined)}
		 */
		$html: function(target, value) {
			if (value === U) {
				return W.$first(target).innerHTML;
			}

			var func = W._canExec(value);

			W.$each(target, function(el, i) {
				var html = func ?
						W.$exec(value, {
							args: [i, el.innerHTML],
							scope: el
						}) :
						value;

				if (html !== false && html !== U) {
					el.innerHTML = html;
				}
			});
		},

		/**
		 * Get the zero-based index of a matching selection relative to it's siblings
		 *
		 * @param target
		 * @returns {int}
		 */
		$index: function(target) {
			var el = W.$first(target),
				children = W.$children(W.$parent(el)),
				i = 0;

			for (; i < children.length; i++) {
				if (children[i] === el) {
					return i;
				}
			}

			return -1;
		},

		/**
		 * Insert each matching source selection element after
		 * each matching target selection
		 *
		 * @param target
		 * @param source
		 */
		$insertAfter: function(target, source) {
			W.$each(source, function(el, i) {
				W.$each(target, function(cel) {
					if (i > 0) {
						cel = W.$clone(cel)[0];
					}

					el.parentNode.insertBefore(cel, el.nextSibling);
				});
			});
		},

		/**
		 * Insert each matching source selection element before
		 * each matching target selection
		 *
		 * @param target
		 * @param source
		 */
		$insertBefore: function(target, source) {
			W.$each(source, function(el) {
				W.$each(target, function(cel) {
					el.parentNode.insertBefore(cel, el);
				});
			});
		},

		/**
		 * Determine if at least one matching selection matches a specified criteria
		 *
		 * @param target
		 * @param filter
		 * @param options
		 * @returns {boolean}
		 */
		$is: function(target, filter, options) {
			return W.$map(target, function(el, i) {
				if (typeof filter == 'string' && filter.slice(0, 4) == 'ref:') {
					filter = W.$get(filter);
					return filter ? filter.indexOf(el) > -1 : false;
				}

				if (W.$isObject(filter)) {
					for (var key in filter) {
						if (filter[key] === el) {
							return true;
						}
					}

					return false;
				}

				if (Array.isArray(filter)) {
					return filter.indexOf(el) > -1;
				}

				if (W._canExec(filter)) {
					return W.$exec(filter, W.$extend({
						args: [i, el],
						scope: el
					}, options));
				}

				var matches = el.matches || el.matchesSelector || el.msMatchesSelector ||
					el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector;

				return matches ?
					matches.call(el, filter) :
					W._slice.call(el.parentNode.querySelectorAll(filter)).indexOf(el) > -1;
			}).length > 0;
		},

		/**
		 * Get the last element of a matching selection
		 *
		 * @param target
		 * @param context
		 * @returns {node}
		 */
		$last: function(target, context) {
			return W.$eq(target, -1, context);
		},

		/**
		 * Get the unique next sibling of each matching selection
		 *
		 * @param target
		 * @param filter
		 * @param options
		 * @returns {Array} elements
		 */
		$next: function(target, filter, options) {
			return W.$unique(W.$map(target, function(el) {
				return W._sibling(el, 1, filter, options);
			}));
		},

		/**
		 * Returns elements not matching the filtered selection
		 *
		 * @param target
		 * @param filter
		 * @param options
		 * @returns {Array} elements
		 */
		$not: function(target, filter, options) {
			var func = W._canExec(filter);

			return W.$map(target, function(el, i) {
				return (func ?
					W.$exec(filter, {
						args: [i, el],
						scope: el
					}) :
					W.$is(el, filter, options)) ? false : el;
			});
		},

		/**
		 * Get the offset position of a matching selection relative to the document
		 *
		 * @param target
		 * @param value
		 * @returns {{top: number, left: number}}
		 */
		$offset: function(target, value) {
			var top = W._legacy ? W._html : W._win,
				rect = W.$first(target).getBoundingClientRect(),
				offset = {
					top: rect.top + (W._legacy ? top.scrollTop : top.pageYOffset),
					left: rect.left + (W._legacy ? top.scrollLeft : top.pageXOffset)
				};

			if (value) {
				var func = W._canExec(value);

				W.$each(target, function(el, i) {
					var set = func ?
						W.$exec(value, {
							args: [i, offset],
							scope: el
						}) :
						value;

					if (typeof set.top == 'number') {
						set.top = set.top + 'px';
					}

					if (typeof set.left == 'number') {
						set.left = set.left + 'px';
					}

					W.$css(el, set);
				});
			} else {
				return offset;
			}
		},

		/**
		 * Get unique parent from each matching selection
		 *
		 * @param child
		 * @param filter
		 * @returns {Array} elements
		 */
		$parent: function(child, filter) {
			return W.$unique(W.$map(child, function(el) {
				var parent = el.parentNode;
				return ! filter || W.$is(parent, filter) ? parent : false;
			}));
		},

		/**
		 * Get unique ancestors of each matching selection
		 *
		 * @param child
		 * @param filter
		 * @returns {Array} elements
		 */
		$parents: function(child, filter) {
			var arr = [];

			W.$each(child, function(el) {
				while (el !== null) {
					el = el.parentNode;

					if (! filter || (filter && W.$is(el, filter))) {
						arr.push(el);
					}

					if (el === W._html) {
						return false;
					}
				}
			});

			return W.$unique(arr);
		},

		/**
		 * Get the position of the first matching selection relative
		 * to its offset parent
		 *
		 * @param target
		 * @returns {{top: number, left: number}}
		 */
		$position: function(target) {
			var el = W.$first(target);

			return {
				top: el.offsetTop,
				left: el.offsetLeft
			};
		},

		/**
		 * Prepend selection or markup before each matching selection
		 *
		 * @param target
		 * @param source
		 */
		$prepend: function(target, source) {
			var func = W._canExec(source);

			W.$each(target, function(el, i) {
				var pre = func ?
						W.$exec(source, {
							args: [i, el.innerHTML],
							scope: el
						}) :
						source;

				if (typeof pre == 'string') {
					pre = W.$parseHTML(pre);
				}

				if (pre) {
					W.$each(pre, function(cel) {
						el.insertBefore(cel, el.firstChild);
					});
				}
			});
		},

		/**
		 * Get the unique previous sibling of each matching selection
		 *
		 * @param target
		 * @param filter
		 * @param options
		 * @returns {Array} elements
		 */
		$prev: function(target, filter, options) {
			return W.$unique(W.$map(target, function(el) {
				return W._sibling(el, -1, filter, options);
			}));
		},

		/**
		 * Get property of first matching selection or set property of
		 * each matching selection
		 *
		 * @param target
		 * @param a
		 * @param b
		 * @returns {*}
		 */
		$prop: function(target, a, b) {
			var obj = W.$isObject(a);

			if (b !== U || obj) {
				var func = ! obj && W._canExec(b);

				W.$each(target, function(el, i) {
					obj ?
						Object.keys(a).forEach(function(key) {
							el[key] = a[key];
						}) :
						el[a] = func ?
							W.$exec(b, {
								args: [i, el[a]],
								scope: el
							}) :
							b;
				});
			} else {
				var el = W.$first(target);

				return el[a];
			}
		},

		/**
		 * Remove each matching selection from the document
		 *
		 * @param target
		 * @param context
		 */
		$remove: function(target, context) {
			W.$each(target, function(el) {
				el.parentNode.removeChild(el);
			}, {
				context: context
			});
		},

		/**
		 * Remove specified attribute of each matching selection
		 *
		 * @param target
		 * @param name
		 */
		$removeAttr: function(target, name) {
			W.$each(target, function(el) {
				name.split(/\s+/).forEach(function(value) {
					el.removeAttribute(value);
				});
			});
		},

		/**
		 * Remove classes from each matching selection
		 *
		 * @param target
		 * @param {(function|string)} value
		 */
		$removeClass: function(target, value) {
			var func = W._canExec(value);

			W.$each(target, function(el, i) {
				var name = func ?
						W.$exec(value, {
							args: [i, el.className],
							scope: el
						}) :
						value;

				if (name) {
					el.className = el.className.replace(
						new RegExp('(^| )' + name.split(/\s+/).join('|') + '($| )', 'gi'
					), ' ').trim();
				}
			});
		},

		/**
		 * Replace each matching selection with selection or markup
		 *
		 * @param target
		 * @param source
		 */
		$replaceWith: function(target, source) {
			W.$after(target, source, true);
		},

		/**
		 * Get or set the X scroll position of each matching selection
		 *
		 * @param target
		 * @param value
		 * @returns {int}
		 */
		$scrollLeft: function(target, value) {
			if (value === U) {
				var el = target ? W.$first(target) : W._win;

				if (el === W._win) {
					if (! W._legacy) {
						return el.pageXOffset;
					}

					el = W._html;
				}

				return el.scrollLeft;
			}

			W.$each(target, function(el) {
				el.scrollLeft = value;
			});
		},

		/**
		 * Get or set the Y scroll position of each matching selection
		 *
		 * @param target
		 * @param value
		 * @returns {int}
		 */
		$scrollTop: function(target, value) {
			if (value === U) {
				var el = target ? W.$first(target) : W._win;

				if (el === W._win) {
					if (! W._legacy) {
						return el.pageYOffset;
					}

					el = W._html;
				}

				return el.scrollTop;
			}

			W.$each(target, function(el) {
				el.scrollTop = value;
			});
		},

		/**
		 * Serialize input values from first matching form selection
		 *
		 * @param target
		 * @returns {string}
		 */
		$serializeForm: function(target) {
			var el = W.$first(target);

			if (el.nodeName == 'FORM') {
				var arr = [],
					i = 0,
					x = 0;

				for (; i < el.elements.length; i++) {
					var child = el.elements[i],
						name = child.name,
						type = child.type;

					if (child.name && type != 'file' && type != 'reset') {
						if (type == 'select-multiple') {
							var opt = child.options;

							for (; x < opt.length; x++) {
								if (opt[x].selected) {
									arr.push(name + '=' + encodeURIComponent(opt[x].value).replace(/%20/g, '+'));
								}
							}
						} else {
							if (type != 'submit' && type != 'button' && ((type != 'checkbox' && type != 'radio') || el.checked)) {
								arr.push(name + '=' + encodeURIComponent(child.value).replace(/%20/g, '+'));
							}
						}
					}
				}

				return arr.join('&');
			}

			return '';
		},

		/**
		 * Show each matching selection
		 *
		 * @param target
		 */
		$show: function(target) {
			W.$removeClass(target, 'js-hide');
		},

		/**
		 * Get unique siblings of each matching selection
		 *
		 * @param target
		 * @param filter
		 * @returns {Array} elements
		 */
		$siblings: function(target, filter) {
			var arr = [];

			W.$each(target, function(el) {
				var siblings = W._slice.call(el.parentNode.children),
					i = 0;

				for (; i < siblings.length; i++) {
					if (siblings[i] === el) {
						siblings.splice(i, 1);
						break;
					}
				}

				arr = arr.concat(
					filter ?
						W.$filter(siblings, filter) :
						siblings
				);
			});

			return W.$unique(arr);
		},

		/**
		 * Get subset of selection matches from specified range
		 *
		 * @param target
		 * @param start
		 * @param end
		 * @returns {Array} elements
		 */
		$slice: function(target, start, end) {
			if (! target._$) {
				target = W._selArray(target);
			}

			return W._slice.call(target, start, end);
		},

		/**
		 * Get inner text of first selection or set each matching selection's text
		 *
		 * @param target
		 * @param value
		 * @returns {string}
		 */
		$text: function(target, value) {
			if (value === U) {
				return W.$map(target, function(el) {
					return (el.textContent || el.innerText).trim();
				}).join('');
			}

			var func = W._canExec(value);

			W.$each(target, function(el, i) {
				var text = func ?
						W.$exec(value, {
							args: [i, (el.textContent || el.innerText).trim()],
							scope: el
						}) :
						value;

				el.textContent === U ?
					el.innerText = text :
					el.textContent = text;
			});
		},

		/**
		 * Toggle the display of each matching selection
		 *
		 * @param target
		 */
		$toggle: function(target) {
			W.$each(target, function(el) {
				! W.$hasClass(el, 'js-hide') ?
					W.$hide(el) :
					W.$show(el);
			});
		},

		/**
		 * Toggle adding and removing class(es) from the specified element
		 *
		 * @param target
		 * @param className
		 * @param state
		 */
		$toggleClass: function(target, className, state) {
			var func = W._canExec(className);

			W.$each(target, function(el, i) {
				if (func) {
					className = W.$exec(className, {
						args: [i, el.className, state],
						scope: el
					});
				}

				if (className) {
					className.split(/\s+/).forEach(function(value) {
						state === false || (state === U && W.$hasClass(el, value)) ?
							W.$removeClass(el, value) :
							W.$addClass(el, value);
					});
				}
			});
		},

		/**
		 * Get value of first matching selection or set values of
		 * each matching selection
		 *
		 * @param target
		 * @param value
		 * @returns {string}
		 */
		$val: function(target, value) {
			if (value === U) {
				var el = W.$first(target);

				if (el.type == 'select-multiple') {
					var opt = el.options,
						arr = [],
						i = 0;

					for (; i < opt.length; i++) {
						if (opt[i].selected) {
							arr.push(opt[i].value);
						}
					}

					return arr;
				}

				return el.value;
			}

			var func = W._canExec(value);

			W.$each(target, function(el, i) {
				if (el.nodeName == 'SELECT') {
					var opt = W.$find(el, 'option');
					value = W.$toArray(value);

					opt.forEach(function(a) {
						if (value.indexOf(a.value) > -1) {
							a.selected = true;
						}
					});
				} else {
					el.value = func ?
						W.$exec(value, {
							args: [i, el.value],
							scope: el
						}) :
						value;
				}
			});
		},

		/**
		 * Get or set the width of each matching selection
		 *
		 * @param target
		 * @param value
		 * @returns {int}
		 */
		$width: function(target, value) {
			var func = value && W._canExec(value),
				width;

			if (value === U || value === true || func) {
				var el = W.$first(target);

				if (el === W._win) {
					width = el.innerWidth;
				} else if (el === W._doc) {
					width = Math.max(
						W._body.offsetWidth,
						W._body.scrollWidth,
						W._html.clientWidth,
						W._html.offsetWidth,
						W._html.scrollWidth
					);
				} else {
					width = el.offsetWidth;

					if (value === true) {
						var style = el.currentStyle || getComputedStyle(el);
						width += parseInt(style.marginLeft) + parseInt(style.marginRight);
					}
				}

				if (! func) {
					return width;
				}
			}

			if (typeof value == 'number') {
				value = value + 'px';
			}

			W.$each(target, function(el, i) {
				W.$css(el, 'width', func ?
					W.$exec(value, {
						args: [i, width],
						scope: el
					}) :
					value
				);
			});
		},

		/**
		 * Wrap markup around each matching selection
		 *
		 * @param target
		 * @param html
		 */
		$wrap: function(target, html) {
			var func = W._canExec(html);

			W.$each(target, function(el, i) {
				var wrap = W.$parseHTML(
					func ?
						W.$exec(html, {
							args: [i],
							scope: el
						}) :
						html
				);

				if (wrap) {
					W.$each(wrap, function(cel) {
						cel.appendChild(el.cloneNode(true));
						el.parentNode.replaceChild(cel, el);
					});
				}
			});
		},

		/**
		 * Wrap markup around the content of each matching selection
		 *
		 * @param target
		 * @param html
		 */
		$wrapInner: function(target, html) {
			var func = W._canExec(html);

			W.$each(target, function(el, i) {
				var wrap = W.$parseHTML(
					func ?
						W.$exec(html, {
							args: [i],
							scope: el
						}) :
						html
				);

				if (wrap) {
					var children = W.$children(el);

					if (children.length === 0) {
						children = W.$html(el);

						W.$empty(el);
						W.$html(wrap, children);
					} else {
						W.$each(children, function(cel) {
							wrap[0].appendChild(cel);
						});
					}

					W.$append(el, wrap);
				}
			});
		},

		/**
		 * Return either direct previous or next sibling
		 *
		 * @private
		 * @param target
		 * @param dir
		 * @param filter
		 * @param options
		 * @returns {*}
		 */
		_sibling: function(target, dir, filter, options) {
			var match;

			W.$each(target, function(el) {
				var nodes = W.$children(W.$parent(el)),
				index = W.$index(el) + dir;

				nodes.forEach(function(el, i) {
					if (i === index && (! filter || filter && W.$is(el, filter, options))) {
						match = el;
					}
				});
			});

			return match;
		}
	});
})(Wee, undefined);