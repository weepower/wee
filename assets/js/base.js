$(function() {

	// Toggle js class
	$('html').removeClass('no-js').addClass('js');

	// Placeholder compatibility
	WEE.placeholderSupport();

	// Responsive nav example
	var $pull = $('#pull'),
		$nav = $('#nav');

	$pull.click(function() {
		$nav.addClass('nav-active').toggleClass('nav-show');
	});

	// Place your custom code here
});