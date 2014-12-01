// Add custom style guide JavaScript here

/* global hljs */

Wee.fn.make('guide', {
	_construct: function() {
		// Setup syntax highlighting
		this.$private('highlightCode');

		// Code toggle buttons
		$('ref:toggle').on('click', this.toggleCode);

		// Setup tabs
		this.$private('setupTabs');
	},
	toggleCode: function(e, el) {
		var $el = $(el);

		if ($el.text() == 'View Code') {
			$el.text('Hide Code').prev().show();
		} else {
			$el.text('View Code').prev().hide();
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
	},
	setupTabs: function() {
		var hash = Wee.routes.uri().hash;

		$('ref:group').slice(1).hide();

		$('ref:tab').on('click', function(e, el) {
			var $el = $(el),
				id = $el.data('tab');

			this.openTab(id);
		}, {
			scope: this
		});

		if (hash) {
			this.openTab(hash);
		}
	},
	openTab: function(id) {
		$('ref:group').hide();
		$('[data-group=' + id + ']').show();

		$('[data-tab=' + id + ']').addClass('is-active').siblings().removeClass('is-active');
	}
});