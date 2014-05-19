// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.controller.make('data', {
	// Make an Ajax request based on the specified options
	request: function(opt) {
		var conf = Wee.$extend({
				url: null,
				method: 'get',
				json: false,
				data: {},
				template: false,
				scope: null,
				arguments: [],
				success: false,
				failure: false
			}, opt),
			data = Wee.$serialize(conf.data),
			x = new XMLHttpRequest();

		x.onreadystatechange = function() {
			if (x.readyState === 4) {
				if (x.status >= 200 && x.status < 400) {
					if (conf.success) {
						var resp = orig = x.responseText;

						// Parse the JSON response if specified
						if (conf.json || conf.template) {
							resp = JSON.json(resp);
						}

						if (conf.template) {
							resp = Wee.data.parse(conf.template, resp);
							conf.arguments.unshift(orig);
						}

						conf.arguments.unshift(resp);

						// Execute the success callback if specified
						Wee.$exec(conf.success, {
							arguments: conf.arguments,
							scope: conf.scope
						});

						return true;
					}
				} else {
					if (conf.failure) {
						Wee.$exec(conf.failure, {
							scope: conf.scope
						});
					}

					return false;
				}
			}
		};

		// Post or get the endpoint based on the specification
		if (conf.method == 'post') {
			x.open('POST', conf.url, true);
			x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			x.send(data);
		} else {
			x.open('GET', (conf.url + data), true);
			x.send(null);
		}
	},
	// Parse specified data to a specified template string
	parse: function(str, obj) {
		obj = obj || {};

		return str.replace(/{{([^}]*)}}/g, function(str, match) {
			var el = match.split('.'),
				len = (el.length - 1),
				i = 0;

			for (; i <= len; i++) {
				var key = el[i],
					segs = key.split('||'),
					fb = '';

				if (segs.length > 1) {
					key = segs[0].trim();
					fb = segs[1].trim();
				}

				obj = obj[key];

				if (i === len) {
					return obj || fb;
				}
			}
		});
	}
});