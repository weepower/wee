// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.extend('polyfill', {
	placeholder: function() {
		if (! ('placeholder' in document.createElement('input'))) {
			Wee.$each('input[placeholder], textarea[placeholder]', function(el) {
				var val = el.getAttribute('placeholder');

				if (el.value == '') {
					el.value = val;
				}

				Wee.events.on(el, {
					blur: function() {
						if (this.value.trim() == '') {
							this.value = val;
						}
					},
					focus: function() {
						if (this.value == val) {
							this.value = '';
						}
					}
				});
			});

			// Clear default placeholder values on form submit
			Wee.events.on('form', {
				submit: function() {
					Wee.$each('input[placeholder], textarea[placeholder]'), function(el) {
						if (el.value == el.getAttribute('placeholder')) {
							el.value = '';
						}
					}
				}
			});
		}
	}
});

Wee.ready('polyfill:placeholder');