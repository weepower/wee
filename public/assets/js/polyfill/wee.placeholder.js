// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

this.attachEvent('onload', function() {
	(function(d) {
		var arr = d.querySelectorAll('input[placeholder], textarea[placeholder]'),
			len = arr.length,
			i = 0;

		for (; i < len; i++) {
			var el = arr[i],
				val = el.getAttribute('placeholder');

			if (el.value == '') {
				el.value = val;
			}

			el.onblur = function() {
				if (this.value.replace(/^\s+|\s+$/g, '') == '') {
					this.value = val;
				}
			};

			el.onfocus = function() {
				if (this.value == val) {
					console.log('match');
					this.value = '';
				}
			};
		}

		arr = d.querySelectorAll('form');
		len = arr.length;
		i = 0;

		// Clear default placeholder values on form submit
		for (; i < len; i++) {
			var el = arr[i];

			el.onsubmit = function() {
				var inputs = el.querySelectorAll('input[placeholder], textarea[placeholder]'),
					xlen = inputs.length,
					x = 0;

				for (; x < xlen; x++) {
					var xel = inputs[x];

					if (xel.value == xel.getAttribute('placeholder')) {
						xel.value = '';
					}
				}
			}
		}
	})(document);
});