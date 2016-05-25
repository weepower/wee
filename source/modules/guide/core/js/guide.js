/* global hljs */

Wee.fn.make('guide', {
	init: function() {
		Wee.history.init({
			bind: true,
			extensions: ['html']
		});
	},

	/**
	 * Bind guide functionality on each page
	 */
	setup: function() {
		var priv = this.$private;

		// Setup syntax highlighting
		priv.highlightCode();

		// Bind code toggle and selection
		$('ref:code').on('dblclick.guide', function() {
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
			root: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.5.0/',
			files: [
				'highlight.min.js',
				'styles/github.min.css'
			],
			success: function() {
				$('ref:code').find('code').each(
					hljs.highlightBlock
				);
			}
		});
	},

	/**
	 * Select all content in a code block
	 *
	 * @private
	 * @param {HTMLElement} el - target code wrapper
	 */
	selectCode: function(el) {
		var range = Wee._doc.createRange(),
			sel = Wee._win.getSelection();

		range.selectNodeContents(el);

		sel.removeAllRanges();
		sel.addRange(range);
	}
});