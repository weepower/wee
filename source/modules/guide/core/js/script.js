/* global hljs */

Wee.fn.make('guide', {
	/**
	 * Highlight code and bind click events
	 *
	 * @constructor
	 */
	_construct: function() {
		var priv = this.$private;

		// Setup syntax highlighting
		priv.highlightCode();

		// Bind code toggle and selection
		$('ref:code').on('dblclick', function() {
			priv.selectCode(this);
		});
	}
}, {
	/**
	 * Load highlight.js assets and highlight code
	 *
	 * @private
	 */
	highlightCode: function() {
		Wee.assets.load({
			root: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.9.1/',
			files: [
				'highlight.min.js',
				'styles/github.min.css'
			],
			success: function() {
				hljs.initHighlightingOnLoad();
			}
		});
	},

	/**
	 * Select all markup in a code block
	 *
	 * @private
	 * @param {HTMLElement} el - target code wrapper
	 */
	selectCode: function(el) {
		var range = $._doc.createRange(),
			sel = $._win.getSelection();

		range.selectNodeContents(el);

		sel.removeAllRanges();
		sel.addRange(range);
	}
});