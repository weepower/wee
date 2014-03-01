// Wee 1.2.0-beta (weepower.com)
// Licensed under the Apache License v2
// http://www.apache.org/licenses/LICENSE-2.0

var WEE = WEE || {};

WEE.browserSize = function() {
	var size = this.curr || (window.getComputedStyle) ? window.getComputedStyle(document.documentElement, null).getPropertyValue('font-family') :
		(document.documentElement.currentStyle) ? document.documentElement.currentStyle['fontFamily'] : null;

	return parseInt(size.replace(/\D/g, ''), 10);
};

WEE.browserSize.watch = function(init) {
	var size = WEE.browserSize(),
		prev = WEE.browserSize.curr,
		init = (init == true) ? true : false,
		events = (init == true) ? [(WEE.browserSize.events[WEE.browserSize.events.length - 1])] : WEE.browserSize.events;

	if (size != prev || init == true) {
		for (var i in events) {
			var evt = events[i];

			if ((evt.size == false && evt.min == false && evt.max == false) ||
				(evt.size != false && evt.size == size) ||
				(evt.min != false && size >= evt.min && (init || prev < evt.min) && (evt.max == false || size <= evt.max)) ||
				(evt.max != false && size <= evt.max && (init || prev > evt.max))) {
				evt.callback({
					dir: (size > prev) ? 1 : 0,
					size: size,
					prev: prev,
					init: init
				});
			}
		}

		WEE.browserSize.curr = size;
	}
};

WEE.browserSize.change = function(options) {
	var settings = {
		min: false,
		max: false,
		size: false,
		init: false,
		callback: false
	};

	for (var option in options) {
		settings[option] = options[option];
	}

	if (settings.callback) {
		this.curr = this.curr || this();

		if (this.watching == true) {
			this.events.push(settings);
		} else {
			this.watching = true;
			this.events = [settings];
			if (window.addEventListener) {
				window.addEventListener('resize', WEE.browserSize.watch, false);
			} else if (window.attachEvent) {
				window.attachEvent('onresize', WEE.browserSize.watch);
			}
		}

		if (settings.init) {
			this.watch(true);
		}
	}
};

WEE.placeholderSupport = function() {
	if (! ('placeholder' in document.createElement('input'))) {
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
}