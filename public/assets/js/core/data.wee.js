// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.controller.create('data', {
	// Make an Ajax request based on the specified options
	request: function(opt) {
		var conf = Wee.extend({
				url: null,
				method: 'get',
				parse: false,
				data: {},
				template: false,
				scope: null,
				arguments: [],
				success: false,
				failure: false
			}, opt),
			x = new XMLHttpRequest();

		x.onreadystatechange = function() {
			if (x.readyState === 4) {
				if (x.status >= 200 && x.status < 400) {
					if (conf.success) {
						var resp = x.responseText;

						// Parse the JSON response if specified
						if (conf.parse || conf.bind) {
							resp = JSON.parse(resp);
						}

						if (conf.bind) {
							resp = Wee.data.bind(conf.template, resp);
						}

						conf.arguments.unshift(resp);

						// Execute the success callback if specified
						Wee.exec(conf.success, {
							arguments: conf.arguments,
							scope: conf.scope
						});
					}
				} else {
					return false;
				}
			}
		};

		// Post or get the endpoint based on the specification
		if (conf.method == 'post') {
			var data = Wee.serialize(conf.data);

			x.open('POST', conf.url, true);
			x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			x.send(data);
		} else {
			x.open('GET', conf.url, true);
			x.send(null);
		}
	},
	// Bind specified data to a specified template string
	bind: function(str, obj) {
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