// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// REM polyfill based on https://github.com/chuckcarpenter/REM-unit-polyfill
// DO NOT MODIFY THIS FILE

var WeeRem = (function(w, d) {
	return {
		// Detect body size and get all stylesheets for processing
		init: function() {
			var body = d.getElementsByTagName('body')[0],
				root = 10,
				sheets = d.styleSheets,
				len = sheets.length,
				i = 0;

			if (body.currentStyle) {
				var val = body.currentStyle.fontSize;

				if (val.indexOf('%') !== -1) {
					root = (val.replace('%', '') / 100) * 16;
				} else if (val.indexOf('px') !== -1) {
					root = val.replace('px', '');
				} else if (val.indexOf('em') !== -1) {
					root = val.replace('em', '');
				} else {
					root = val.replace('pt', '');
				}
			} else if (w.getComputedStyle) {
				root = d.defaultView.getComputedStyle(body, null).getPropertyValue('font-size').replace('px', '');
			}

			this.root = root;

			for (; i < len; i++) {
				var href = sheets[i].href;

				if (href && href.indexOf('ie8.css') == -1) {
					this.process(href);
				}
			}
		},
		// Get the CSS for parsing
		// Returns string
		process: function(url) {
			if (this.isExternal(url)) {
				var x = new XDomainRequest();

				x.onload = function() {
					fn(x.responseText);
				};
			} else {
				var x = w.XMLHttpRequest ?
					new XMLHttpRequest() :
					new ActiveXObject('Microsoft.XMLHTTP');

				x.onreadystatechange = function() {
					if (x.readyState == 4 && x.status == 200) {
						WeeRem.convert(x.responseText);
					}
				};
			}

			x.open('GET', url, true);
			x.send(null);
		},
		// Detect if the CSS resource is local or external
		// Returns boolean
		isExternal: function(url) {
			var host = function(url) {
				return url.replace('http://', '').replace('https://', '').split('/')[0];
			};

			return host(location.href) !== host(url);
		},
		// Rewrite REM units to pixels in appended stylesheet
		convert: function(css) {
			var output = '',
				regex = /(-?[.\d]+)rem/gi,
				rules = css.match(/[\w\d\s\-\/\\\[\]:,.'"*()<>+~%#^$_=|@ ]+\{[\w\d\s\-\/\\%#:!;,.'"*()]+(\d+rem|auto|inherit|initial|0)[\w\d\s\-\/\\%#:;,.'"*()=]*\}/g),
				len = rules ? rules.length : 0,
				i = 0;

			for (; i < len; i++) {
				var rule = rules[i],
					split = rule.split('{'),
					sel = split[0],
					val = split[1],
					props = val.match(/[\w\d\s\-\/\\%#:!;,.'"*()]+(\d+rem|auto|inherit|initial|0)[\w\d\s\-\/\\%#:,.'"*()]*[;}]/g),
					propsTotal = props ? props.length : 0,
					x = 0;

				output += sel + '{';

				for (; x < propsTotal; x++) {
					var prop = props[x].replace(regex, function(str, match) {
						return isNaN(match) ? match : (match * WeeRem.root) + 'px';
					});

					output += prop.substring(0, prop.length - 1) + ';';
				}

				output += '}';
			}

			var style = d.createElement('style');

			style.setAttribute('type', 'text/css');

			if (style.styleSheet) {
				style.styleSheet.cssText = output;
			} else {
				style.appendChild(d.createTextNode(output));
			}

			d.body.appendChild(style);
		}
	};
})(this, document);

this.attachEvent('onload', function() {
	WeeRem.init();
});