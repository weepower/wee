// Add custom style guide JavaScript here

/* global hljs */

Wee.fn.make('guide', {
	_construct: function() {
		// Setup syntax highlighting
		this.$private('highlightCode');

		// Bind code toggle and selection
		Wee.events.on({
			'ref:code': {
				dblclick: function(e, el) {
					this.$private('selectCode', el);
				}
			},
			'ref:toggle': {
				click: function(e, el) {
					this.$private('toggleCode', el);
				}
			}
		}, {
			scope: this
		});
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
	},
	selectCode: function(el) {
		var range = Wee._doc.createRange(),
			sel = Wee._win.getSelection();

		range.selectNodeContents(el);

		sel.removeAllRanges();
		sel.addRange(range);
	},
	toggleCode: function(el) {
		var $el = $(el);

		if ($el.text() == 'x') {
			$el.html('&lt;' + $el.data('lang') + '/&gt;').next().hide();
		} else {
			$el.text('x').next().show();
		}
	}
});