// Wee Slice 1.0.1 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

(function(d, s) {
	'use strict';

	try {
		s.call(d.documentElement);
	} catch(e) {
		Array.prototype.slice = function(start, end) {
			var arr = [],
				len = this.length,
				i = 0;

			if (this.charAt) {
				for (; i < len; i++) {
					arr.push(this.charAt(i));
				}
			} else {
				for (i = 0; i < len; i++) {
					arr.push(this[i]);
				}
			}

			return s.call(arr, start, end || arr.length);
		};
	}
})(document, [].slice);