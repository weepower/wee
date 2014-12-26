(function(W, U) {
	'use strict';

	W.fn.make('view', {
		// Render specified data into specified template string
		// Return string
		render: function(temp, data, opt) {
			return this.$private('process', temp, data, {}, W.$extend({
				data: data,
				raw: false
			}, opt), 0);
		}
	}, {
		pair: /{{#(.+?)}}([\s\S]+?){{\/\1}}(?!.*{{\/\1}})/g,
		single: /{{(.+?)}}/g,
		process: function(temp, data, prev, conf, index) {
			var scope = this;

			return temp.replace(this.pair, function(m, tag, inner) {
				var segs = tag.match(/(?:[^|]|\|\|)+/g),
					len = segs.length,
					filter = len > 1 ? segs[len - 1] : '';
				tag = segs[0];

				var val = scope.getValue(data, prev, tag, conf, index),
					empty = val === false || val === U || val.length === 0,
					resp = '';

				if (filter === '' && ! empty && typeof val == 'object') {
					// Loop through objects and arrays
					var isObj = W.$isObject(val),
						i = 0;

					for (var key in val) {
						if (val.hasOwnProperty(key)) {
							var el = val[key],
								item = W.$extend({
									$key: key,
									$val: el,
									$i: i
								}, W.$isObject(el) ? el : (isObj ? val : {}));

							resp += scope.process(inner, item, data, conf, i);

							i++;
						}
					}
				} else if ((filter == 'notEmpty' && ! empty) || (filter == 'empty' && empty)) {
					return scope.process(inner, data, {}, conf);
				}

				return resp;
			}).replace(this.single, function(m, tag) {
				var opt = conf,
					segs = tag.match(/(?:[^|]|\|\|)+/g),
					len = segs.length,
					filter = len > 1 ? segs[len - 1] : '';
				tag = segs[0];

				if (filter == 'raw') {
					opt = W.$extend({
						raw: true
					});
				}

				var resp = scope.getValue(data, prev, tag, opt, index);

				return resp === U || typeof resp == 'object' ? '' : resp;
			});
		},
		getValue: function(data, prev, key, conf, x) {
			var segs = key.split('||'),
				trim = segs[0].trim(),
				resp = trim.split('.'),
				orig = data,
				i = 0;

			// Alter context
			if (resp[0] == '$root') {
				data = conf.data;
				resp.shift();
			} else if (trim.substring(0, 3) == '../') {
				data = prev;
				resp.splice(0, 3, trim.substring(3));
			}

			var len = resp.length - 1;

			// Loop through object segments
			for (; i <= len; i++) {
				key = resp[i];

				if (data.hasOwnProperty(key)) {
					data = data[key];

					// Return value on last segment
					if (i === len) {
						if (typeof data == 'function') {
							data = data(orig, conf.data, x);
						}

						if (typeof data == 'string') {
							// Encode tags by default
							return conf.raw ?
								data :
								data.replace(/&amp;/g, '&')
									.replace(/&/g, '&amp;')
									.replace(/</g, '&lt;')
									.replace(/>/g, '&gt;')
									.replace(/"/g, '&quot;');
						} else if (data !== U) {
							return data;
						}
					}
				}
			}

			// Return fallback or empty string
			return segs.length > 1 ? segs[1].trim() : '';
		}
	});
})(Wee, undefined);