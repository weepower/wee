// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.fn.make('data', {
	// Make Ajax request based on specified options
	request: function(opt) {
		var conf = Wee.$extend({
				args: [],
				data: {}
			}, opt),
			x = new XMLHttpRequest();

		x.onreadystatechange = function() {
			if (x.readyState === 4) {
				if (x.status >= 200 && x.status < 400) {
					if (conf.success) {
						var resp = x.responseText,
							orig = resp;

						// Parse JSON response if specified
						if (conf.json || conf.template) {
							try {
								resp = JSON.parse(resp);
							} catch (e) {
								resp = {};
							}

							if (conf.template) {
								resp = Wee.data.parse(conf.template, resp);
								conf.args.unshift(orig);
							}
						}

						conf.args.unshift(resp);

						// Execute success callback if specified
						Wee.$exec(conf.success, {
							args: conf.args,
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

		// Post or get endpoint based on specification
		if (conf.method == 'post') {
			x.open('POST', conf.url, true);
			x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			x.send(Wee.$serialize(conf.data));
		} else {
			if (conf.cache === false) {
				var dt = new Date().getTime();
				conf.data[dt] = dt;
			}

			x.open('GET', (conf.url + '?' + Wee.$serialize(conf.data)), true);
			x.send(null);
		}
	},
	// Parse specified data into specified template string
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