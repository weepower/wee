var WEE = WEE || {};

// REM fallback
// Based on https://github.com/chuckcarpenter/REM-unit-polyfill

WEE.remSupport = function() {
	var body = document.getElementsByTagName('body')[0],
		bodySize = 10,
		sheets = document.styleSheets,
		totalSheets = sheets.length;

	if (body.currentStyle) {
		var val = body.currentStyle.fontSize;
		if (val.indexOf('%') !== -1) {
			bodySize = (val.replace('%', '') / 100) * 16;
		} else if (val.indexOf('px') !== -1) {
			bodySize = val.replace('px', '');
		} else if (val.indexOf('em') !== -1) {
			bodySize = val.replace('em', '');
		} else {
			bodySize = val.replace('pt', '');
		}
	} else if (window.getComputedStyle) {
		bodySize = document.defaultView.getComputedStyle(body, null).getPropertyValue('font-size').replace('px', '');
	}

	WEE.bodySize = bodySize;

	for (var i = 0; i < totalSheets; i++) {
		var href = sheets[i].href;

		if (href.indexOf('legacy.css') == -1) {
			WEE.getResource(href, WEE.remConvert);
		}
	}
};

WEE.remConvert = function(css) {
	function convert(str, match) {
		return (match * WEE.bodySize) + 'px';
	}

	var output = '',
		regex = /(-?[.\d]+)rem/gi,
		rules = css.match(/[\w\d\s\-\/\\\[\]:,.'"*()<>+~%#^$_=|@]+\{[\w\d\s\-\/\\%#:;,.'"*()]+\d*\.?\d+rem[\w\d\s\-\/\\%#:;,.'"*()]*\}/g),
		rulesTotal = rules ? rules.length : 0;

	for (var i = 0; i < rulesTotal; i++) {
		var rule = rules[i],
			split = rule.split('{'),
			sel = split[0],
			val = split[1],
			props = val.match(/[\w\d\s\-\/\\%#:,.'"*()]+\d*\.?\d+rem[\w\d\s\-\/\\%#:,.'"*()]*[;}]/g),
			propsTotal = props ? props.length : 0;

		output += sel + '{'

		for (var x = 0; x < propsTotal; x++) {
			var prop = props[x].replace(regex, convert);
			output += prop.substring(0, prop.length - 1) + ';';
		}

		output += '}';
	}

	var style = document.createElement('style');
	style.setAttribute('type', 'text/css');

	if (style.styleSheet) {
		style.styleSheet.cssText = output;
	} else {
		style.appendChild(document.createTextNode(output));
	}

	document.body.appendChild(style);
};

// SVG fallback

WEE.svgSupport = function() {
	var imgs = document.getElementsByTagName('img'),
		total = imgs.length;
	for (var i = 0; i < total; i++) {
		var img = imgs[i],
			ext = img.src.split('.').pop();
		if (ext == 'svg') {
			var fallback = img.getAttribute('data-fallback');
			img.src = (fb != null) ? fallback : img.src.slice(0, -3) + 'png';
		}
	}
};

// Helpers

WEE.getResource = function(href, func) {
	try {
		if (WEE.isExternal(href)) {
			var x = new XDomainRequest();
			x.onload = function() {
				func(x.responseText);
			};
		} else {
			var x = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
			x.onreadystatechange = function() {
				if (x.readyState == 4 && x.status == 200) {
					func(x.responseText);
				}
			};
		}
		x.open('GET', href, true);
		x.send(null);
	} catch(e) {}
};

WEE.isExternal = function(url) {
	var domain = function(url) {
		return url.replace('http://','').replace('https://','').split('/')[0];
	};

	return domain(location.href) !== domain(url);
}

window.attachEvent('onload', function() {
	WEE.remSupport();
	WEE.svgSupport();
});