// Wee SVG 1.0.1 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY

(function(w, d) {
	'use strict';

	w.attachEvent('onload', function() {
		var imgs = d.getElementsByTagName('img'),
			svgs = d.getElementsByTagName('svg'),
			i = 0,
			fb,
			img;

		for (; i < imgs.length; i++) {
			img = imgs[i];

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

		for (i = 0; i < svgs.length; i++) {
			var svg = svgs[i];
			fb = svg.getAttribute('data-fallback');

			if (fb !== null) {
				img = d.createElement('img');

				var attrs = svg.attributes,
					x = 0;

				img.src = fb;

				for (; x < attrs.length; x++) {
					var attr = attrs.item(x);
					img.setAttribute(attr.nodeName, attr.nodeValue);
				}

				svg.parentNode.replaceChild(img, svg);
			}
		}
	});
})(this, document);