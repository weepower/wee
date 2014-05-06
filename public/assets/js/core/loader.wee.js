// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.controller.create('loader', {
	// Get the currently bound resource root or set the root with a specified value
	// Returns string
	root: function(val) {
		return val ?
			this.$set('root', val) :
			this.$get('root', '');
	},
	// Load specified assets with a specified set of options
	load: function(opt) {
		var conf = Wee.extend({
				files: [],
				group: false,
				success: false,
				failure: false,
				root: false
			}, opt),
			files = Wee.toArray(conf.files),
			root = conf.root || this.root(),
			len = files.length,
			i = 0;

		// Create group name if not specified
		if (! conf.group) {
			var id = this.$get('group', 1);
			conf.group = 'load-' + id;

			this.$set('group', (id + 1));
		}

		// Set file array length to check against
		this.$set(conf.group, len);

		// Request each specified file
		for (; i < len; i++) {
			this.$call('request', (root + files[i]), conf.group, conf.success, conf.failure);
		}
	},
	// When specified references are ready execute a callback
	ready: function(group, opt, recheck) {
		if (this.$get(group) === 0) {
			var conf = Wee.extend({
					success: false,
					failure: false
				}, opt);

			if (conf.success) {
				Wee.exec(conf.success);
			}
		} else {
			if (recheck !== false) {
				setTimeout(function() {
					Wee.loader.ready(group, opt);
				}, 20);
			}
		}
	}
}, {
	// Request a specific file
	request: function(path, group, success, failure) {
		var scope = this,
			head = document.getElementsByTagName('head')[0],
			ext = path.split('.').pop(),
			root = this.$get('root');

		// Load the file based on file extension
		if (ext == 'js') {
			var el = document.createElement('script');

			el.src = path;
			el.async = 'true';

			el.onload = el.onreadystatechange = function() {
				var rs = this.readyState;

				if (rs && rs != 'complete' && rs != 'loaded') {
					return;
				}

				scope.loaded(group);

				if (success) {
					scope.$call.ready(group, {
						success: success
					}, false);
				}
			};

			head.appendChild(el);
		} else if (ext == 'css') {
			var el = document.createElement('link');

			el.rel = 'stylesheet';
			el.href = path;

			scope.loaded(group);

			head.appendChild(el);
		} else if (ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'gif') {
			var img = new Image();

			img.onload = function() {
				scope.loaded(group);
			}

			img.src = path;
		}
	},
	// Decrement the remaining count of assets to be loaded
	loaded: function(group) {
		this.$set(group, this.$get(group) - 1);
	}
});