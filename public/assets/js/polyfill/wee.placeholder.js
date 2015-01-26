// Wee Placeholder 1.0.1 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY

(function(w, d) {
	'use strict';

	w.attachEvent('onload', function() {
		var sel = 'input[placeholder], textarea[placeholder]',
			forms = d.querySelectorAll('form'),
			inputs = d.querySelectorAll(sel),
			i = 0;

		// Reset value to placeholder value on blur
		for (; i < inputs.length; i++) {
			(function() {
				var el = inputs[i],
					val = el.getAttribute('placeholder');

				if (el.value === '') {
					el.value = val;
				}

				el.onblur = function() {
					if (this.value.replace(/^\s+|\s+$/g, '') === '') {
						this.value = val;
					}
				};

				el.onfocus = function() {
					if (this.value === val) {
						this.value = '';
					}
				};
			})();
		}

		// Clear default placeholder values on form submit
		for (i = 0; i < forms.length; i++) {
			(function() {
				var form = forms[i];

				form.onsubmit = function() {
					var inputs = form.querySelectorAll(sel),
						x = 0;

					for (; x < inputs.length; x++) {
						var el = inputs[x];

						if (el.value == el.getAttribute('placeholder')) {
							el.value = '';
						}
					}
				};
			})();
		}
	});
})(this, document);