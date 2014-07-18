// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.extend('testing', {
	responsive: function() {
		if (window.self === window.top) {
			var vars = this.$get('vars');

			! vars ?
				Wee.data.request({
					scope: this,
					url: Wee.$get('variablesPath', '/assets/css/custom/variables.less'),
					success: function(vars) {
						this.$set('vars', vars);
						this.setupResponsive(vars);
					}
				}) :
				this.setupResponsive(vars);
		}
	},
	// If responsive test mode is enabled in variables.less start it
	setupResponsive: function(vars) {
		var matches = new RegExp('^@responsiveTestMode:(.*?);', 'mgi').exec(vars);

		if (matches && matches.length > 1 && matches[1].trim() != 'true') {
			alert('Responsive test mode is disabled in the variables.less');
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
		this.breakpoints = [];

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
		var regexp = new RegExp('@responsiveOffset:(.*?);', 'mgi'),
			matches = regexp.exec(this.$get('vars'));

		if (matches && matches.length > 1) {
			offset = parseInt(matches[1].trim());
		}

		for (var prop in vars) {
			var variable = vars[prop],
				regexp = new RegExp('@' + prop + 'Width:(.*?);', 'mgi'),
				matches = regexp.exec(this.$get('vars'));

			if (matches && matches.length > 1) {
				var match = parseInt(matches[1].trim());

				if (match != '') {
					this.breakpoints[(match - offset)] = variable[1];
				}
			} else {
				this.breakpoints[(variable[0] - offset)] = variable[1];
			}
		}

		this.breakpoints[320] = 'Mobile Portait';
	},
	addToolbar: function() {
		var bar = Wee._doc.createElement('div');

		Wee.$addClass(bar, 'js-testing-bar');
		Wee._body.appendChild(bar)

		Wee.testing.bar = bar;

		// Double-click to close
		Wee.events.on(bar, 'dblclick', 'testing:removeToolbar');

		Wee.$removeClass(Wee._html, 'js-testing-disabled');

		this.setDimensions();
	},
	removeToolbar: function() {
		Wee.$addClass(Wee._html, 'js-testing-disabled');
	},
	addCues: function(showCues) {
		// Create cue wrapper
		var cues = Wee._doc.createElement('div');

		Wee.$addClass(cues, 'js-testing-cues');

		var resetDisplay = function() {
			Wee.$css(cues, 'display', 'none');
			Wee.testing.setDimensions();
		};

		// Append cues to wrapper
		for (var width in this.breakpoints) {
			var label = this.breakpoints[width],
				cue = Wee._doc.createElement('div');

			Wee.$css(cue, {
				'width': width + 'px',
				'marginLeft': (width * -0.5) + 'px',
				'zIndex': (2000 - width)
			});

			Wee.$addClass(cue, 'js-testing-cue');

			// Bind mouse events
			(function(label, width) {
				Wee.events.on(cue, {
					mouseenter: function() {
						Wee.$html(Wee.testing.bar, label + ' / ' + width + 'px');
					},
					click: function() {
						Wee.$addClass(Wee._html, 'js-testing-enabled');

						if (! Wee.testing.active) {
							var iframe = Wee._doc.createElement('iframe');

							iframe.src = Wee._doc.location.href + (Wee._doc.location.href.indexOf('?') == -1 ? '?' : '');
							iframe.id = 'testing-frame';

							Wee.$css(iframe, {
								'width': width + 'px',
								'height': (Wee._win.innerHeight - 32) + 'px'
							});

							// Remove document markup
							Wee.$html(Wee._body, '');

							Wee.testing.addToolbar();
							Wee.testing.addCues(true);

							Wee.events.on(iframe, 'load', function(e, el) {
								Wee.$addClass(el.contentWindow.document.documentElement, 'js-testing-disabled');
							});

							// Append iframe
							Wee._body.appendChild(iframe);

							Wee.testing.active = true;
						} else {
							var iframe = Wee.$('#testing-frame');

							Wee.$css(iframe, 'width', width + 'px');
						}
					}
				});
			})(label, width);

			cues.appendChild(cue);
		}

		var escCues = function() {
			Wee.events.on(Wee._doc, 'keyup', function(e) {
				if (e.keyCode == 27) {
					resetDisplay();
				}
			});
		};

		if (showCues) {
			Wee.$css(cues, 'display', 'block');
			escCues();
		}

		// Bind mouse events
		Wee.events.on(Wee.testing.bar, {
			mouseenter: function() {
				this.timer = setTimeout(function() {
					Wee.$css(cues, 'display', 'block');

					if (! showCues) {
						escCues();
					}
				}, 500);
			},
			mouseleave: function() {
				clearTimeout(this.timer);
			}
		}, {
			scope: this
		});

		Wee.events.on(cues, 'mouseleave', function() {
			resetDisplay();
		});

		// Append wrapper to the DOM
		Wee._body.appendChild(cues);
	},
	setDimensions: function() {
		var iframe = Wee.$('#testing-frame');

		Wee.$html(Wee.testing.bar, Wee._win.innerWidth + 'x' + Wee._win.innerHeight);

		if (iframe) {
			Wee.$css(iframe, {
				'height': (Wee._win.innerHeight - 32) + 'px'
			});
		}
	}
});

Wee.ready('testing:responsive');