// Wee SVG 1.0.1 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

(function(w, d) {
	'use strict';

	w.attachEvent('onload', function() {
		var arr = d.getElementsByTagName('img'),
			len = arr.length,
			i = 0,
			fb,
			img;

		for (; i < len; i++) {
			img = arr[i];

			if (img.hasAttribute('src')) {
				var ext = img.getAttribute('src').split('.').pop();

				if (ext == 'svg') {
					fb = img.getAttribute('data-fallback');

					img.src = fb !== null ?
						fb :
						img.src.slice(0, -3) + 'png';
				}
			}
		}

		arr = d.getElementsByTagName('svg');
		len = arr.length;
		i = 0;

		for (; i < len; i++) {
			var svg = arr[i];
				fb = svg.getAttribute('data-fallback');

			if (fb !== null) {
				img = d.createElement('img');

				var attrs = svg.attributes,
					alen = attrs.length,
					x = 0;

				img.src = fb;

				for (; x < alen; x++) {
					var attr = attrs.item(x);
					img.setAttribute(attr.nodeName, attr.nodeValue);
				}

				svg.parentNode.replaceChild(img, svg);
			}
		}
	});
})(this, document);