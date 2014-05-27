// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.create('breakpoints', {
	// Get the current breakpoint value
	val: function() {
		var w = window,
			d = document,
			size = this.$get('size') || w.getComputedStyle ?
				w.getComputedStyle(d.documentElement, null).getPropertyValue('font-family') :
				(d.documentElement.currentStyle ? d.documentElement.currentStyle['fontFamily'] : null);

		return parseInt(size.replace(/\D/g, ''), 10);
	},
	// Bind a single or set of breakpoint events with specified options
	watch: function(set) {
		var sets = Wee.toArray(set),
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
					Wee.events.on(window, 'resize', function() {
						this.$call('listen', false);
					}, {
						scope: this
					});
				}

				// Check for current breakpoint match if init = true
				if (settings.init) {
					this.$call('listen', true);
				}
			}
		}
	}
}, {
	listen: function(init) {
		var size = Wee.breakpoints.val(),
			prev = Wee.breakpoints.$get('size'),
			init = init || false;

		// If a breakpoint has been hit or resize logic initialized
		if (size != prev || init) {
			var events = Wee.breakpoints.$get('events'),
				events = init ? [(events[events.length - 1])] : events,
				len = events.length,
				i = 0;

			for (; i < len; i++) {
				var evt = events[i];

				// Check for match against settings
				if ((! evt.size && ! evt.min && ! evt.max) ||
					(evt.size && evt.size === size) ||
					(evt.min !== false && size >= evt.min && (init || prev < evt.min) && (evt.max === false || size <= evt.max)) ||
					(evt.max !== false && size <= evt.max && (init || prev > evt.max) && (evt.min === false || size >= evt.min))) {
					Wee.exec(evt.callback, {
						arguments: [{
							dir: (size > prev) ? 1 : 0,
							size: size,
							prev: prev,
							init: init
						}]
					});
				}
			}

			// Cache the updated breakpoint value
			Wee.breakpoints.$set('size', size);
		}
	}
});