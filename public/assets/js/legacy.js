// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// REM polyfill based on https://github.com/chuckcarpenter/REM-unit-polyfill
// DO NOT MODIFY THIS FILE

var Wee = Wee || {};

Wee.legacy = (function(w, d) {

	var Utils = {
		// Get the CSS for parsing
		getResource: function(url, fn) {
			if (Utils.isExternal(url)) {
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
						fn(x.responseText);
					}
				};
			}

			x.open('GET', url, true);
			x.send(null);
		},
		// Detect if the CSS resource is local or external
		isExternal: function(url) {
			var host = function(url) {
				return url.replace('http://', '').replace('https://', '').split('/')[0];
			};

			return host(location.href) !== host(url);
		}
	};

	return {
		// Detect body size and get all stylesheets for processing
		remSupport: function() {
			var body = d.getElementsByTagName('body')[0],
				root = 10,
				sheets = d.styleSheets,
				len = sheets.length,
				i = 0

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

			Wee.root = root;

			for (; i < len; i++) {
				var href = sheets[i].href;

				if (href.indexOf('legacy.css') == -1) {
					Utils.getResource(href, Wee.legacy.remConvert);
				}
			}
		},
		// Rewrite REM units to pixels in appended stylesheet
		remConvert: function(css) {
			function convert(str, match) {
				return (match * Wee.root) + 'px';
			}

			var output = '',
				regex = /(-?[.\d]+)rem/gi,
				rules = css.match(/[\w\d\s\-\/\\\[\]:,.'"*()<>+~%#^$_=|@]+\{[\w\d\s\-\/\\%#:;,.'"*()=]+\d*\.?\d+rem[\w\d\s\-\/\\%#:;,.'"*()=]*\}/g),
				len = rules ? rules.length : 0,
				i = 0;

			for (; i < len; i++) {
				var rule = rules[i],
					split = rule.split('{'),
					sel = split[0],
					val = split[1],
					props = val.match(/[\w\d\s\-\/\\%#:,.'"*()]+\d*\.?\d+rem[\w\d\s\-\/\\%#:,.'"*()]*[;}]/g),
					propsTotal = props ? props.length : 0,
					x = 0;

				output += sel + '{';

				for (; x < propsTotal; x++) {
					var prop = props[x].replace(regex, convert);

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
		},
		// Support both image and inline SVG
		svgSupport: function() {
			var arr = d.getElementsByTagName('img'),
				len = arr.length,
				i = 0;

			for (; i < len; i++) {
				var img = arr[i],
					ext = img.src.split('.').pop();

				if (ext == 'svg') {
					var fallback = img.getAttribute('data-fallback');

					img.src = (fallback != null) ?
						fallback :
						img.src.slice(0, -3) + 'png';
				}
			}

			arr = d.getElementsByTagName('svg');
			len = arr.length;
			i = 0;

			for (; i < len; i++) {
				var svg = arr[i],
					fallback = svg.getAttribute('data-fallback');

				if (fallback != null) {
					var img = d.createElement('img'),
						attrs = svg.attributes,
						alen = attrs.length,
						x = 0;

					img.src = fallback;

					for (; x < alen; x++) {
						var attr = attrs.item(x);
						img.setAttribute(attr.nodeName, attr.nodeValue);
					}

					svg.parentNode.replaceChild(img, svg);
				}
			}
		}
	};
})(window, document);

window.attachEvent('onload', function() {
	Wee.legacy.remSupport();
	Wee.legacy.svgSupport();
});