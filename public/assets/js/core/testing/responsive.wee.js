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

			return;
		}

		this.getBreakpoints();
		this.addToolbar();
		this.addCues();

		// Set browser dimensions
		Wee.events.on(window, 'resize', 'testing:setDimensions');
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
				Wee.testing.breakpoints[variable[0]] = variable[1];
			}
		}
	},
	addToolbar: function() {
		var bar = document.createElement('div');

		bar.className = 'js-testing-bar';
		document.body.appendChild(bar);

		Wee.testing.bar = bar;

		// Double-click to close
		Wee.events.on(bar, 'dblclick', function() {
			document.body.classList.remove('js-testing-enabled');
			document.body.classList.add('js-testing-disabled');
		});

		this.setDimensions();
	},
	addCues: function(showCues) {
		// Create cue wrapper
		var cues = document.createElement('div');

		cues.className = 'js-testing-cues';

		var resetDisplay = function() {
			cues.style.display = 'none';
			Wee.testing.setDimensions();
		};

		// Append cues to wrapper
		for (var width in Wee.testing.breakpoints) {
			var label = Wee.testing.breakpoints[width],
				cue = document.createElement('div');

			cue.style.width = width + 'px';
			cue.style.marginLeft = (width * -0.5) + 'px';
			cue.style.zIndex = 2000 - width;
			cue.className = 'js-testing-cue';

			// Bind mouse events
			(function(label, width) {
				Wee.events.on(cue, 'mouseenter', function() {
					Wee.testing.bar.innerHTML = label;
				});

				Wee.events.on(cue, 'click', function() {
					document.body.classList.add('js-testing-enabled');

					if (! Wee.testing.active) {
						var iframe = document.createElement('iframe');

						iframe.src = document.location.href;

						iframe.style.width = width + 'px';
						iframe.style.height = window.innerHeight + 'px';

						iframe.id = 'testing-frame';

						// Remove document markup
						var body = document.body;

						body.innerHTML = '';

						Wee.testing.addToolbar();
						Wee.testing.addCues(true);

						// Append iframe
						body.appendChild(iframe);

						Wee.events.on(iframe, 'load', function() {
							iframe.contentDocument.body.classList.add('js-testing-disabled');
						});

						Wee.testing.active = true;
					} else {
						var iframe = window.parent.document.getElementById('testing-frame');

						iframe.style.width = width + 'px';
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
			cues.style.display = 'block';

			escCues();
		}

		// Bind mouse events
		Wee.events.on(Wee.testing.bar, 'mouseenter', function() {
			this.timer = setTimeout(function() {
				cues.style.display = 'block';

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
		document.body.appendChild(cues);
	},
	setDimensions: function() {
		var width = window.innerWidth,
			height = window.innerHeight;

		Wee.testing.bar.innerHTML = width + 'x' + height;
	}
});

Wee.ready('testing:responsive');