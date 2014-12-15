// Add custom style guide JavaScript here

/* global hljs */

Wee.fn.make('guide', {
	_construct: function() {
		// Setup syntax highlighting
		this.$private('highlightCode');

		// Code toggle buttons
		$('ref:toggle').on('click', this.toggleCode);
	},
	toggleCode: function(e, el) {
		var $el = $(el);

		if ($el.text() == 'x') {
			$el.html('&lt;' + $el.data('lang') + '/&gt;').next().hide();
		} else {
			$el.text('x').next().show();
		}
	}
}, {
	highlightCode: function() {
		Wee.assets.load({
			root: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/',
			files: [
			'styles/default.min.css',
			'highlight.min.js'
			],
			success: function() {
				hljs.initHighlightingOnLoad();
			}
		});
	}
});