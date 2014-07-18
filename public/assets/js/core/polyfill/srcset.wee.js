// Wee 2.0.0 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// Based on https://github.com/culshaw/srcset
// DO NOT MODIFY THIS FILE

Wee.fn.extend('polyfill', {
	srcset: function() {
		// Check for srcset support
		if (! ('srcset' in Wee._doc.createElement('img'))) {
			// Set fallback values
			var currWidth = Wee._win.innerWidth > 0 ? Wee._win.innerWidth : screen.width,
				currHeight = Wee._win.innerHeight > 0 ? Wee._win.innerHeight : screen.height,
				currDensity = Wee._win.devicePixelRatio || 1,
				srcset = function(img) {
					var ss = Wee.$attr(img, 'srcset');

					if (ss) {
						var val = ss.split(','),
							len = val.length,
							x = 0;

						for (; x < len; x++) {
							var options = val[x].match(/^\s*([^\s]+)\s*(\s(\d+)w)?\s*(\s(\d+)h)?\s*(\s(\d+)x)?\s*$/),
								width = options[3] || false,
								height = options[5] || false,
								density = options[7] || 1;

							if ((width && width < currWidth) ||
								(height && height < currHeight) ||
								(density && density < currDensity)) {
								continue;
							}

							img.src = options[1];
						}
					}
			}

			var imgs = Wee.$('img'),
				len = imgs.length,
				i = 0;

			for (; i < len; i++) {
				srcset(imgs[i]);
			}
		}
	}
});

Wee.ready('polyfill:srcset');