// Wee Slice 1.0.2 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)

(function(D, S) {
	try {
		S.call(D.documentElement);
	} catch (e) {
		Array.prototype.slice = function(start, end) {
			var arr = [],
				len = this.length,
				i = 0;

			if (this.charAt) {
				for (; i < len; i++) {
					arr.push(this.charAt(i));
				}
			} else {
				for (; i < len; i++) {
					arr.push(this[i]);
				}
			}

			return S.call(arr, start, end || arr.length);
		};
	}
})(document, [].slice);