(function(W) {
	'use strict';

	W.fn.make('data', {
		/**
		 * Make Ajax request based on specified options
		 *
		 * @param {object} options
		 * @param {string} options.url - endpoint to request
		 * @param {(Array|function|string)} [options.success] - callback if request succeeds
		 * @param {(Array|function|string)} [options.failure] - callback if request fails
		 * @param {Array} [options.args] - callback arguments appended after default values
		 * @param {object} [options.data] - object to serialize and pass along with request
		 * @param {object} [options.headers] - request headers
		 * @param {boolean} [options.json=false] - evaluate the response as JSON and return object
		 * @param {(boolean|string)} [options.jsonp=false] - boolean or override name for callback query string parameter
		 * @param {string} [options.jsonpCallback] - override the name of the JSONP callback function
		 * @param {string} [options.method=get] - request verb
		 * @param {object} [options.scope] - callback scope
		 * @param {string} [options.template] - template string to parse response JSON
		 */
		request: function(options) {
			var conf = W.$extend({
					args: [],
					data: {},
					headers: {},
					method: 'get'
				}, options);

			if (conf.cache === false) {
				conf.data.dt = Date.now();
			}

			if (conf.jsonp) {
				var head = W.$('head')[0];

				if (conf.success) {
					var fn = conf.jsonpCallback;

					if (! fn) {
						var v = this.$get('v', 1);
						fn = 'jsonp' + v;

						this.$set('v', v + 1);
					}

					W._win[fn] = function(data) {
						conf.args.unshift(data);

						W.$exec(conf.success, {
							args: conf.args,
							scope: conf.scope
						});
					};

					conf.data[
						conf.jsonp === true ?
							'callback' :
							conf.jsonp
						] = fn;
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

				return;
			}

			var scope = this,
				x = new XMLHttpRequest();

			x.onreadystatechange = function() {
				scope.$private.change(x, conf);
			};

			var contentTypeHeader = 'Content-Type',
				method = conf.method.toUpperCase(),
				send = null,
				headers = [];

			// Format data based on specified verb
			if (method == 'GET') {
				if (Object.keys(conf.data).length > 0) {
					conf.url += '?' + W.$serialize(conf.data);
				}
			} else {
				if (method == 'POST') {
					headers[contentTypeHeader] =
						'application/x-www-form-urlencoded; charset=UTF-8';
				}

				send = typeof (conf.data || '') == 'string' ?
					conf.data :
					JSON.stringify(conf.data);
			}

			x.open(method, conf.url, true);

			// Add JSON header
			if (conf.json) {
				headers[contentTypeHeader] = 'application/json';
			}

			// Add X-Requested-With header for same domain requests
			var xrw = 'X-Requested-With',
				a = W._doc.createElement('a');
			a.href = conf.url;

			if (a.hostname == W._win.location.hostname) {
				headers[xrw] = 'XMLHttpRequest';
			}

			headers = W.$extend(headers, conf.headers);

			// Set request headers
			for (var key in headers) {
				var val = headers[key];

				if (val !== false) {
					x.setRequestHeader(key, val);
				}
			}

			x.send(send);
		},

		/**
		 * Render data into template string
		 *
		 * @deprecated since 2.1.0
		 * @param {string} temp
		 * @param {object} data
		 * @returns {string} value
		 */
		parse: function(temp, data) {
			return W.view.render(temp, data);
		}
	}, {
		/**
		 * Process the ready state change event
		 *
		 * @param {XMLHttpRequest} x
		 * @param {object} conf
		 * @returns {*}
		 */
		change: function(x, conf) {
			if (x.readyState === 4) {
				if (x.status >= 200 && x.status < 400) {
					if (conf.success) {
						return this.success(x, conf);
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
		},

		/**
		 * Execute the request success callback
		 *
		 * @param {XMLHttpRequest} x
		 * @param {object} conf
		 * @returns {boolean}
		 */
		success: function(x, conf) {
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
	});
})(Wee);