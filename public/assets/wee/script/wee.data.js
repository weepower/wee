(function(W) {
	'use strict';

	W.fn.make('data', {
		// Make Ajax request based on specified options
		request: function(opt) {
			var conf = W.$extend({
					args: [],
					data: {}
				}, opt);

			if (conf.cache === false) {
				conf.data.dt = new Date().getTime();
			}

			if (conf.jsonp) {
				var head = W._doc.getElementsByTagName('head')[0];

				if (conf.success) {
					var v = this.$get('v', 1),
						func = 'jsonp' + v;

					W._win[func] = function(data) {
						conf.args.unshift(data);

						W.$exec(conf.success, {
							args: conf.args,
							scope: conf.scope
						});
					};

					conf.data[conf.jsonp === true ? 'callback' : conf.jsonp] = func;

					this.$set('v', v + 1);
				}

				if (Object.keys(conf.data).length > 0) {
					conf.url += '?' + W.$serialize(conf.data);
				}

				var el = W._doc.createElement('script');

				el.src = conf.url;

				if (conf.failure) {
					el.onerror = function() {
						W.$exec(conf.failure, {
							args: conf.args,
							scope: conf.scope
						});
					};
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
										resp = W.view.render(conf.template, resp);
										conf.args.unshift(orig);
									}
								}

								conf.args.unshift(resp, x);

								// Execute success callback if specified
								W.$exec(conf.success, {
									args: conf.args,
									scope: conf.scope
								});

								return true;
							}
						} else {
							if (conf.failure) {
								conf.args.unshift(x);

								W.$exec(conf.failure, {
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
					send = W.$isObject(conf.data) ? W.$serialize(conf.data) : conf.data;
				} else {
					if (Object.keys(conf.data).length > 0) {
						conf.url += '?' + W.$serialize(conf.data);
					}

					x.open('GET', conf.url, true);
				}

				// Set request headers
				if (conf.headers) {
					var keys = Object.keys(conf.headers),
						i = 0;

					for (; i < keys.length; i++) {
						var key = keys[i];
						x.setRequestHeader(key, conf.headers[key]);
					}
				}

				// Send request
				x.send(send);
			}
		},
		// Render specified data into specified template string
		// Return string
		parse: function() {
			W.view.render(arguments);
		}
	});
})(Wee);