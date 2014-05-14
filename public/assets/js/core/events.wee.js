// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.controller.create('events', {
	// Traverse the DOM for all available bindings
	bind: function() {
		var events = this.$get('bound');

		if (events) {
			Wee.$each('[data-bind]', function(el) {
				var id = Wee.$data(el, 'bind');

				if (events.hasOwnProperty(id)) {
					var obj = events[id];

					for (var key in inst) {
						var fn = inst[key];

						(key == 'init') ? Wee.exec(fn, {
							arguments: [el]
						}) : Wee.events.on(el, key, fn);
					}
				}
			});
		}
	},
	// Add bindings to the bound object
	map: function(events, init) {
		this.$set('bound', Wee.extend(this.$get('bound', {}), events));

		if (init) {
			this.bind();
		}
	},
	// Bind a specified function to a specified selector and event
	on: function(sel, evt, fn, opt) {
		var conf = Wee.extend({
				scope: null,
				arguments: []
			}, opt);

		// For each element attach the event
		Wee.$each(sel, function(el) {
			var obj = Wee.extend({}, conf);
			obj.arguments = [0, el];

			if (evt == 'mouseenter' || evt == 'mouseleave') {
				obj.arguments.push(fn);

				fn = 'events:mouseEvent';
				evt = (evt == 'mouseenter') ? 'mouseover' : 'mouseout';
			}

			el.attachEvent ? el.attachEvent('on' + evt, function(e) {
				obj.arguments[0] = e;
				Wee.exec(fn, obj);
			}) : el.addEventListener(evt, function(e) {
				obj.arguments[0] = e;
				Wee.exec(fn, obj);
			}, false);
		});
	},
	// Remove a bound event function from a specified selector
	off: function(sel, evt, fn) {
		Wee.$each(sel, function(el) {
			el.attachEvent ? el.detachEvent('on' + evt, function() {
				Wee.exec(fn);
			}) : el.removeEventListener(evt, function() {
				Wee.exec(fn);
			}, false);
		});
	},
	// Ensure the mouse has actually entered or left the root element before firing the event
	mouseEvent: function(e, parent, fn) {
		var child = e.relatedTarget;

		if (child === parent || this.checkParent(parent, child)) {
			return;
		}

		Wee.exec(fn);
	},
	// Compare a parent element to a child element
	checkParent: function(parent, child) {
		if (parent === child) {
			return false;
		}

		while (child && child !== parent) {
			child = child.parentNode;
		}

		return child === parent;
	}
});