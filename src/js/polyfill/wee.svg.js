// Wee SVG 1.0.2 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)

(function(W, D) {
	W.attachEvent('onload', function() {
		var imgs = D.getElementsByTagName('img'),
			svgs = D.getElementsByTagName('svg'),
			img,
			i = 0;

		for (; i < imgs.length; i++) {
			img = imgs[i];

			if (img.src.split('.').pop() == 'svg') {
				img.src = img.getAttribute('data-fallback') || img.src.slice(0, -3) + 'png';
			}
		}

		for (i = 0; i < svgs.length; i++) {
			var svg = svgs[i],
				fallback = svg.getAttribute('data-fallback');

			if (fallback) {
				img = D.createElement('img');
				img.src = fallback;

				var attrs = svg.attributes,
					x = 0;

				for (; x < attrs.length; x++) {
					var attr = attrs.item(x);
					img.setAttribute(attr.nodeName, attr.nodeValue);
				}

				svg.parentNode.replaceChild(img, svg);
			}
		}
	});
})(this, document);