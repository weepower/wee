// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.controller.extend('testing', {
	responsive: function() {
		var vars = this.$get('vars');

		(! vars) ?
			Wee.data.request({
				scope: this,
				url: '/assets/css/custom/variables.less',
				success: function(vars) {
					this.$set('vars', vars);
					this.setupResponsive(vars);
				}
			}) :
			this.setupResponsive(vars);
	},
	// If responsive test mode is enabled in variables.less start it
	setupResponsive: function(vars) {
		var matches = new RegExp('@responsiveTestMode:(.*?);', 'gi').exec(vars);

		if (matches && matches.length > 1 && matches[1].trim() != 'true') {
			alert('Responsive test mode is disabled in the custom variables.less');
		} else {
			this.getBreakpoints();
			this.addToolbar();
			this.addCues();

			// Set browser dimensions
			Wee.events.on(window, 'resize', 'testing:setDimensions');
		}
	},
	// Parse variables.less for enabled breakpoints
	getBreakpoints: function() {
		Wee.testing.breakpoints = [];

		var vars = {
				'mobileLandscape': [480, 'Mobile Landscape'],
				'tabletPortrait': [768, 'Tablet Portrait'],
				'desktopSmall': [1024, 'Small Desktop'],
				'desktopMedium': [1280, 'Medium Desktop'],
				'desktopLarge': [1440, 'Large Desktop']
			},
			offset = 25,
			i = 0;

		// Get offset
		var regexp = new RegExp('@responsiveOffset:(.*?);', 'gi'),
			matches = regexp.exec(this.$get('vars'));

		if (matches && matches.length > 1) {
			offset = parseInt(matches[1].trim());
		}

		for (var prop in vars) {
			var variable = vars[prop],
				regexp = new RegExp('@' + prop + 'Width:(.*?);', 'gi'),
				matches = regexp.exec(this.$get('vars'));

			if (matches && matches.length > 1) {
				var match = parseInt(matches[1].trim());

				if (match != '') {
					Wee.testing.breakpoints[(match - offset)] = variable[1];
				}
			} else {
				Wee.testing.breakpoints[(variable[0] - offset)] = variable[1];
			}
		}

		Wee.testing.breakpoints[320] = 'Mobile Portait';
	},
	addToolbar: function() {
		var d = document,
			b = d.body,
			bar = d.createElement('div');

		Wee.addClass(bar, 'js-testing-bar');
		b.appendChild(bar);

		Wee.testing.bar = bar;

		// Double-click to close
		Wee.events.on(bar, 'dblclick', function() {
			Wee.addClass(b, 'js-testing-disabled');
			Wee.removeClass(b, 'js-testing-enabled');
		});

		this.setDimensions();
	},
	addCues: function(showCues) {
		// Create cue wrapper
		var w = window,
			d = document,
			b = d.body,
			cues = d.createElement('div');

		Wee.addClass(cues, 'js-testing-cues');

		var resetDisplay = function() {
			Wee.css(cues, 'display', 'none');
			Wee.testing.setDimensions();
		};

		// Append cues to wrapper
		for (var width in Wee.testing.breakpoints) {
			var label = Wee.testing.breakpoints[width],
				cue = d.createElement('div');

			Wee.css(cue, {
				'width': width + 'px',
				'marginLeft': (width * -0.5) + 'px',
				'zIndex': (2000 - width)
			});

			Wee.addClass(cue, 'js-testing-cue');

			// Bind mouse events
			(function(label, width) {
				Wee.events.on(cue, 'mouseenter', function() {
					Wee.text(Wee.testing.bar, label + ' / ' + width + 'px');
				});

				Wee.events.on(cue, 'click', function() {
					Wee.addClass(b, 'js-testing-enabled');

					if (! Wee.testing.active) {
						var iframe = d.createElement('iframe');

						iframe.src = d.location.href;
						iframe.id = 'testing-frame';

						Wee.css(iframe, {
							'width': width + 'px',
							'height': w.innerHeight + 'px'
						});

						// Remove document markup
						Wee.html(b, '');

						Wee.testing.addToolbar();
						Wee.testing.addCues(true);

						// Append iframe
						b.appendChild(iframe);

						Wee.events.on(iframe, 'load', function() {
							Wee.addClass(iframe.contentDocument.body, 'js-testing-disabled');
						});

						Wee.testing.active = true;
					} else {
						var iframe = w.parent.document.getElementById('testing-frame');

						Wee.css(iframe, 'width', width + 'px');
					}
				});
			})(label, width);

			cues.appendChild(cue);
		}

		var escCues = function() {
			Wee.events.on(document, 'keyup', function(e) {
				if (e.keyCode == 27) {
					resetDisplay();
				}
			});
		};

		if (showCues) {
			Wee.css(cues, 'display', 'block');
			escCues();
		}

		// Bind mouse events
		Wee.events.on(Wee.testing.bar, 'mouseenter', function() {
			this.timer = setTimeout(function() {
				Wee.css(cues, 'display', 'block');

				if (! showCues) {
					escCues();
				}
			}, 500);
		});

		Wee.events.on(Wee.testing.bar, 'mouseleave', function() {
			clearTimeout(this.timer);
		});

		Wee.events.on(cues, 'mouseleave', function() {
			resetDisplay();
		});

		// Append wrapper to the DOM
		b.appendChild(cues);
	},
	setDimensions: function() {
		var w = window,
			width = w.innerWidth,
			height = w.innerHeight;

		Wee.text(Wee.testing.bar, width + 'x' + height);
	}
});

Wee.ready('testing:responsive');