Wee.fn.make('data', {
	// Make Ajax request based on specified options
	request: function(opt) {
		var conf = Wee.$extend({
				args: [],
				data: {}
			}, opt);

		if (conf.cache === false) {
			conf.data.dt = new Date().getTime();
		}

		if (conf.jsonp) {
			var head = Wee._doc.getElementsByTagName('head')[0];

			if (conf.success) {
				var v = this.$get('v', 1),
					func = 'jsonp' + v;

				Wee._win[func] = function(data) {
					conf.args.unshift(data)

					Wee.$exec(conf.success, {
						args: conf.args,
						scope: conf.scope
					});
				};

				conf.data[conf.jsonp === true ? 'callback' : conf.jsonp] = func;

				this.$set('v', v + 1);
			}

			if (Object.keys(conf.data).length > 0) {
				conf.url += '?' + Wee.$serialize(conf.data);
			}

			var el = Wee._doc.createElement('script');

			el.src = conf.url;

			if (conf.failure) {
				el.onerror = function() {
					Wee.$exec(conf.failure, {
						args: conf.args,
						scope: conf.scope
					});
				}
			}

			head.appendChild(el);
		} else {
			var x = new XMLHttpRequest();

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

							conf.args.unshift(resp, x);

							// Execute success callback if specified
							Wee.$exec(conf.success, {
								args: conf.args,
								scope: conf.scope
							});

							return true;
						}
					} else {
						if (conf.failure) {
							conf.args.unshift(x);

							Wee.$exec(conf.failure, {
								args: conf.args,
								scope: conf.scope
							});
						}

						return false;
					}
				}
			};

			var send = null;

			// Post or get endpoint based on specification
			if (conf.method == 'post') {
				x.open('POST', conf.url, true);
				x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
				send = Wee.$isObject(conf.data) ? Wee.$serialize(conf.data) : conf.data;
			} else {
				if (Object.keys(conf.data).length > 0) {
					conf.url += '?' + Wee.$serialize(conf.data);
				}

				x.open('GET', conf.url, true);
			}

			// Set request headers
			if (conf.headers) {
				for (var key in conf.headers) {
					x.setRequestHeader(key, conf.headers[key]);
				}
			}

			// Send request
			x.send(send);
		}
	},
	// Parse specified data into specified template string
	// Return string
	parse: function(temp, data, opt) {
		return this.$private('render', temp, data, Wee.$extend({
			data: data,
			escape: true
		}, opt), 0);
	}
}, {
	pair: /{{([#^@]?)+(.+?)}}([\s\S]+?){{\/\1\2}}/g,
	single: /{{(.+?)}}/g,
	render: function(temp, data, conf, index) {
		var scope = this;

		return temp.replace(this.pair, function(m, pre, tag, inner) {
			var val = scope.getValue(data, tag, conf, index),
				empty = val === undefined || val.length === 0,
				resp = '';

			if (pre == '#' && ! empty && typeof val == 'object') {
				// Loop through objects and arrays
				if (typeof val == 'object') {
					var isObj = Wee.$isObject(val),
						i = 0;

					for (var key in val) {
						// Merge in iterative data
						var item = Wee.$extend({
							$key: key,
							$val: val[key],
							$i: i
						}, isObj ? val : val[key]);

						resp += scope.render(inner, item, conf, i);

						i++;
					}
				}
			} else if ((pre == '^' && empty) || (pre == '@' && ! empty)) {
				return scope.render(inner, data, conf);
			}

			return resp;
		}).replace(this.single, function(m, tag) {
			var opt = conf;

			// With % prefix output raw
			if (tag.charAt(0) == '%') {
				tag = tag.substring(1);
				opt = Wee.$extend({
					escape: false
				});
			}

			var resp = scope.getValue(data, tag, opt, index);

			return resp === undefined || typeof resp == 'object' ? '' : resp;
		});
	},
	getValue: function(data, key, conf, x) {
		var segs = key.split('||'),
			resp = segs[0].trim().split('.'),
			len = resp.length - 1,
			orig = data,
			i = 0;

		// Loop through object segments
		for (; i <= len; i++) {
			key = resp[i];
			data = data[key];

			// Return value on last segment
			if (i === len) {
				if (key.charAt(0) == '&') {
					data = conf.data[key.substring(1)];
				}

				if (typeof data == 'function') {
					data = data(orig, conf.data, x);
				}

				if (typeof data == 'string') {
					// Encode tags by default
					return conf.escape ? data
						.replace(/&amp;/g, '&')
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/"/g, '&quot;') :
						data;
				} else if (data !== undefined) {
					return data;
				}
			}
		}

		// Return fallback or empty string
		return segs.length > 1 ? segs[1].trim() : '';
	}
});