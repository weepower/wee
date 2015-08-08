/* global hljs */

Wee.fn.make('guide', {
	/**
	 * Highlight code and bind click events
	 *
	 * @constructor
	 */
	_construct: function() {
		var scope = this;

		// Setup syntax highlighting
		scope.$private.highlightCode();

		// Bind code toggle and selection
		Wee.events.on({
			'ref:code': {
				dblclick: function() {
					scope.$private.selectCode(this);
				}
			},
			'ref:toggle': {
				click: function() {
					scope.$private.toggleCode(this);
				}
			}
		});
	}
}, {
	/**
	 * Load highlight.js assets and highlight code
	 *
	 * @private
	 */
	highlightCode: function() {
		// Don't load in IE8-
		if (! Wee._legacy) {
			Wee.assets.load({
				root: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.7/',
				files: [
					'highlight.min.js',
					'styles/vs.min.css'
				],
				success: function() {
					hljs.initHighlightingOnLoad();
				}
			});
		}
	},

	/**
	 * Select all markup in a code block
	 *
	 * @private
	 * @param {HTMLElement} el - target code
	 */
	selectCode: function(el) {
		var range = Wee._doc.createRange(),
			sel = Wee._win.getSelection();

		range.selectNodeContents(el);

		sel.removeAllRanges();
		sel.addRange(range);
	},

	/**
	 * Toggle the visibility of a code block
	 *
	 * @private
	 * @param {($|HTMLElement|string)} el - source button
	 */
	toggleCode: function(el) {
		var $el = $(el),
			activeClass = '--is-active',
			ariaExpanded = 'aria-expanded',
			ariaHidden = 'aria-hidden';

		if ($el.attr(ariaExpanded) != 'false') {
			$el.removeClass(activeClass)
				.text('<' + $el.data('lang') + '/>')
				.attr(ariaExpanded, 'false')
				.next()
				.attr(ariaHidden, 'true')
				.hide();
		} else {
			$el.addClass(activeClass)
				.text('x')
				.attr(ariaExpanded, 'true')
				.next()
				.attr(ariaHidden, 'false')
				.show();
		}
	}
});