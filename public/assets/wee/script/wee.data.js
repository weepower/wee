// Wee 2.0.4 (weepower.com)
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
			x.send(Wee.$isObject(conf.data) ? Wee.$serialize(conf.data) : conf.data);
		} else {
			if (conf.cache === false) {
				var dt = new Date().getTime();
				conf.data.dt = dt;
			}

			if (Object.keys(conf.data).length > 0) {
				conf.url += '?' + Wee.$serialize(conf.data);
			}

			x.open('GET', conf.url, true);
			x.send(null);
		}
	},
	// Parse specified data into specified template string
	// Return string
	parse: function(str, obj, opt) {
		opt = opt || {};
		obj = obj || {};

		var scope = this;

		// Make {{template}} variable replacements
		return str.replace(/{{([^}]*)}}/g, function(str, key) {
			return scope.$private('replace', obj, key, opt);
		});
	}
}, {
	clean: function(str) {
		return str
			.replace(/&amp;/g, '&')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	},
	replace: function(obj, key, opt) {
		var segs = key.split('||'),
			resp = segs[0].trim().split('.'),
			len = resp.length - 1,
			i = 0;

		for (; i <= len; i++) {
			key = resp[i];
			obj = obj[key];

			if (i === len && typeof obj == 'string') {
				return opt.encode === true ? this.clean(obj) : obj;
			}
		}

		return segs.length > 1 ? segs[1].trim() : '';
	}
});