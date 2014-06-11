// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// Based on https://github.com/culshaw/srcset
// DO NOT MODIFY THIS FILE

Wee.fn.extend('polyfill', {
	srcset: function() {
		// Check for srcset support
		if ('srcset' in document.createElement('img')) {
			return true;
		}

		// Set fallback values
		var w = window,
			currWidth = (w.innerWidth > 0) ? w.innerWidth : screen.width,
			currHeight = (w.innerHeight > 0) ? w.innerHeight : screen.height,
			currDensity = w.devicePixelRatio || 1;

		function srcset(img) {
			var set = img.getAttribute('srcset');

			if (set === null) {
				return false;
			}

			var val = set.split(','),
				len = val.length,
				i = 0;

			for (; i < len; i++) {
				var options = val[i].match(/^\s*([^\s]+)\s*(\s(\d+)w)?\s*(\s(\d+)h)?\s*(\s(\d+)x)?\s*$/),
					filename = options[1],
					width = options[3] || false,
					height = options[5] || false,
					density = options[7] || 1;

				if ((width && width < currWidth) ||
					(height && height < currHeight) ||
					(density && density < currDensity)) {
					continue;
				}

				img.src = filename;
			}
		}

		var imgs = document.getElementsByTagName('img'),
			len = imgs.length,
			i = 0;

		for (; i < len; i++) {
			srcset(imgs[i]);
		}
	}
});

Wee.ready('polyfill:srcset');