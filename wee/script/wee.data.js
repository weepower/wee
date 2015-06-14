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
				conf.data.dt = new Date().getTime();
			}

			if (conf.jsonp) {
				var head = W._doc.getElementsByTagName('head')[0];

				if (conf.success) {
					var func = conf.jsonpCallback;

					if (! func) {
						var v = this.$get('v', 1);
						func = 'jsonp' + v;
						this.$set('v', v + 1);
					}

					W._win[func] = function(data) {
						conf.args.unshift(data);

						W.$exec(conf.success, {
							args: conf.args,
							scope: conf.scope
						});
					};

					conf.data[conf.jsonp === true ? 'callback' : conf.jsonp] = func;
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
				var scope = this,
					x = new XMLHttpRequest();

				x.onreadystatechange = function() {
					return scope.$private.processChange(x, conf);
				};

				var send = null;

				// Post or get endpoint based on specification
				if (conf.method == 'post') {
					x.open('POST', conf.url, true);
					x.setRequestHeader(
						'Content-Type',
						'application/x-www-form-urlencoded; charset=UTF-8'
					);
					send = W.$isObject(conf.data) ?
						W.$serialize(conf.data) :
						conf.data;
				} else {
					if (Object.keys(conf.data).length > 0) {
						conf.url += '?' + W.$serialize(conf.data);
					}

					x.open(conf.method.toUpperCase(), conf.url, true);
				}

				// Add X-Requested-With header for same domain requests
				var xrw = 'X-Requested-With';

				if (! conf.headers.hasOwnProperty(xrw)) {
					var a = W._doc.createElement('a');
					a.href = conf.url;

					if (a.hostname == W._win.location.hostname) {
						conf.headers[xrw] = 'XMLHttpRequest';
					}
				}

				// Set request headers
				for (var key in conf.headers) {
					var val = conf.headers[key];

					if (val !== false) {
						x.setRequestHeader(key, val);
					}
				}

				// Send request
				x.send(send);
			}
		}
	}, {
		/**
		 * Process the ready state change event
		 *
		 * @param {XMLHttpRequest} x
		 * @param {object} conf
		 * @returns {*}
		 */
		processChange: function(x, conf) {
			if (x.readyState === 4) {
				if (x.status >= 200 && x.status < 400) {
					if (conf.success) {
						return this.processSuccess(x, conf);
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
		processSuccess: function(x, conf) {
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