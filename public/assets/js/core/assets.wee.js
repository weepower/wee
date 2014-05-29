// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.make('assets', {
	// Get the currently bound resource root or set the root with a specified value
	// Returns string
	root: function(val) {
		return val ?
			this.$set('root', val) :
			this.$get('root', '');
	},
	// Load specified assets with a specified set of options
	load: function(opt) {
		var conf = Wee.$extend({
				failure: false,
				files: [],
				group: false,
				root: false,
				success: false
			}, opt),
			files = Wee.$toArray(conf.files),
			root = conf.root || this.root(),
			len = files.length,
			i = 0;

		// Create group name if not specified
		if (! conf.group) {
			conf.group = 'load-' + new Date().getTime();
		}

		// Set file array length to check against
		this.$set(conf.group, len);
		this.$set(conf.group + '-fail', 0);

		// Request each specified file
		for (; i < len; i++) {
			this.$private('request', (root + files[i]), conf.group, conf.success, conf.failure);
		}
	},
	// When specified references are ready execute a callback
	ready: function(group, opt, recheck) {
		if (this.$get(group) === 0) {
			var conf = Wee.$extend({
					success: false,
					failure: false
				}, opt);

			if (this.$get(group + '-fail') > 0 && conf.failure) {
				Wee.$exec(conf.failure);
			} else if (conf.success) {
				Wee.$exec(conf.success);
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
		var d = document,
			scope = this,
			head = d.getElementsByTagName('head')[0],
			ext = path.split('.').pop();

		// Load the file based on file extension
		if (ext == 'js') {
			var el = d.createElement('script');

			el.src = path;
			el.async = true;

			el.onload = el.onreadystatechange = function() {
				var rs = this.readyState;

				if (rs && rs != 'complete' && rs != 'loaded') {
					return;
				}

				scope.done(group, success);
			};

			el.onerror = function() {
				scope.fail(group, failure);
			}

			head.appendChild(el);
		} else if (ext == 'css') {
			var el = d.createElement('link');

			el.rel = 'stylesheet';
			el.href = path;

			scope.done(group, success);

			head.appendChild(el);
		} else if ((/(gif|jpg|jpeg|png|svg)$/i).test(ext)) {
			var img = new Image();

			img.onload = function() {
				scope.done(group, success);
			}

			img.onerror = function() {
				scope.fail(group, failure);
			}

			img.src = path;
		}
	},
	// Decrement the remaining count of assets to be loaded
	done: function(group, success, failure) {
		this.$set(group, this.$get(group) - 1);

		this.$public.ready(group, {
			success: success,
			failure: failure
		}, false);
	},
	// Track any failed resources
	fail: function(group, failure) {
		var key = group + '-fail';

		this.$set(key, this.$get(key) + 1);
		this.done(group, false, failure);
	}
});