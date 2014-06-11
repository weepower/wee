// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.extend('testing', {
	placeholders: function() {
		var vars = this.$get('vars');

		(! vars) ?
			Wee.data.request({
				scope: this,
				url: '/assets/css/custom/variables.less',
				success: function(vars) {
					this.$set('vars', vars);
					this.setupPlaceholders(vars);
				}
			}) :
			this.setupPlaceholders(vars);
	},
	// If placeholders are enabled in variables.less create them
	setupPlaceholders: function(vars) {
		var matches = new RegExp('^@placeholdersEnabled:(.*?);', 'mgi').exec(vars);

		if (matches && matches.length > 1 && matches[1].trim() != 'true') {
			alert('Placeholders are disabled in the custom variables.less');
		} else {
			this.$private('createPlaceholders');
		}
	},
	// Loop through the placeholders and update the text overlays
	updatePlaceholders: function() {
		var placeholders = Wee.testing.$get('placeholders'),
			len = placeholders.length,
			i = 0;

		for(; i < len; i++) {
			var placeholder = placeholders[i],
				img = placeholder[0],
				span = placeholder[1],
				pos = this.$private('getPosition', img),
				width = img.offsetWidth,
				height = img.offsetHeight;

			Wee.$css(span, {
				left: pos[0] + 'px',
				top: pos[1] + 'px',
				width: width + 'px',
				lineHeight: height + 'px'
			});

			if (! placeholder[2]) {
				Wee.$html(span, width + 'x' + height);
			}
		}
	}
}, {
	// Build the placeholder images and text overlays
	createPlaceholders: function() {
		Wee.$each('.js-placeholder', function(el) {
			var size = Wee.$data(el, 'size') || '16:9',
				parts = size.split(':');
			
			if (parts.length == 2) {
				var d = document,
					x = parts[0],
					y = parts[1],
					fluid = Wee.$data(el, 'fluid'),
					title = Wee.$data(el, 'title'),
					span = d.createElement('span');

				// Transparent background
				el.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

				// Apply fluid ratio
				if (fluid == 'no') {
					Wee.$css(el, {
						width: x + 'px',
						height: y + 'px',
						paddingTop: 0
					});
				} else {
					Wee.$css(el, {
						'paddingTop': ((y / x) * 100) + '%'
					});

					Wee.events.on(window, {
						resize: 'testing:updatePlaceholders'
					});
				}

				Wee.$addClass(span, 'js-placeholder-text');

				// Append placeholder text span
				d.body.appendChild(span);

				// Push to array
				Wee.testing.$push('placeholders', [el, span, title]);

				setTimeout(function() {
					// Placeholder text
					if (title != null) {
						Wee.$html(span, title);
					}

					Wee.testing.updatePlaceholders();
				}, 300);
			}
		});
	},
	// Get the offset position of the placeholder image
	getPosition: function(el) {
		var root = document.getElementsByTagName('body')[0],
			x = el.offsetLeft,
			y = el.offsetTop;

		while (el.offsetParent) {
			if (el === root) {
				break;
			} else {
				var parent = el.offsetParent;

				x += parent.offsetLeft;
				y += parent.offsetTop;

				el = parent;
			}
		}

		return [x, y];
	}
});

Wee.ready('testing:placeholders');