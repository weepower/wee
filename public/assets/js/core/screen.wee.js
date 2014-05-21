// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.controller.make('screen', {
	// Get the current screen value
	size: function() {
		var w = window,
			d = document,
			size = this.$get('size') || w.getComputedStyle ?
				w.getComputedStyle(d.documentElement, null).getPropertyValue('font-family') :
				(d.documentElement.currentStyle ? d.documentElement.currentStyle['fontFamily'] : null);

		return parseInt(size.replace(/\D/g, ''), 10);
	},
	// Bind a single or set of screen events with specified options
	map: function(set) {
		var sets = Wee.$toArray(set),
			len = sets.length,
			i = 0;

		for (; i < len; i++) {
			var set = sets[i],
				settings = {
					min: false,
					max: false,
					size: false,
					init: false,
					callback: false
				};

			for (var key in set) {
				settings[key] = set[key];
			}

			if (settings.callback) {
				// Determine if the event array needs to be created or appended to
				if (this.$get('watching')) {
					this.$push('events', settings);
				} else {
					this.$set('watching', true);
					this.$set('events', [settings]);

					// Watch the widow resize event for breakpoint changes
					Wee.events.on(window, {
						resize: function() {
							this.$private('listen', false);
						}
					}, {
						scope: this
					});
				}

				// Check for current screen match if init = true
				if (settings.init) {
					this.$private('listen', true);
				}
			}
		}
	}
}, {
	listen: function(init) {
		var size = Wee.screen.size(),
			prev = Wee.screen.$get('size'),
			init = init || false;

		// If a breakpoint has been hit or resize logic initialized
		if (size !== prev || init) {
			var evts = Wee.screen.$get('events'),
				evts = init ? [(evts[evts.length - 1])] : evts,
				len = evts.length,
				i = 0;

			for (; i < len; i++) {
				var evt = evts[i];

				// Check for match against settings
				if ((! evt.size && ! evt.min && ! evt.max) ||
					(evt.size && evt.size === size) ||
					(evt.min !== false && size >= evt.min && (init || prev < evt.min) && (evt.max === false || size <= evt.max)) ||
					(evt.max !== false && size <= evt.max && (init || prev > evt.max) && (evt.min === false || size >= evt.min))) {
					Wee.$exec(evt.callback, {
						arguments: [{
							dir: init ? 0 : ((size > prev) ? 1 : -1),
							size: size,
							prev: prev,
							init: init
						}]
					});
				}
			}

			// Cache the updated screen value
			Wee.screen.$set('size', size);
		}
	}
});