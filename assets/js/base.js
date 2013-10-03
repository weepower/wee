$(function() {

	// Remove js class
	$('html').removeClass('no-js').addClass('js');

	// Responsive nav
	var $pull = $('#pull'),
		$nav = $('#nav');

	$pull.click(function() {
		$nav.addClass('nav-active').toggleClass('nav-show');
	});

	// Placeholder fallback
	if (!('placeholder' in document.createElement('input'))) {
		$(':input[placeholder]').each(function() {
			var val = $(this).attr('placeholder');
			if (this.value == '') {
				this.value = val;
			}
			$(this).focus(function() {
				if (this.value == val) {
					this.value = '';
				}
			}).blur(function() {
				if ($.trim(this.value) == '') {
					this.value = val;
				}
			})
		});

		// Clear default placeholder values on form submit
		$('form').submit(function() {
			$(this).find(':input[placeholder]').each(function() {
				if (this.value == $(this).attr('placeholder')) {
					this.value = '';
				}
			});
		});
	}

	// Place your custom scripts here
});

var WEE = WEE || {};

WEE.browserSize = function() {
	var size = (window.getComputedStyle) ? window.getComputedStyle(document.documentElement, null).getPropertyValue('font-family') :
		(document.documentElement.currentStyle) ? document.documentElement.currentStyle['fontFamily'] : null;
	return parseInt(size.replace(/\D/g, ''), 10);
};