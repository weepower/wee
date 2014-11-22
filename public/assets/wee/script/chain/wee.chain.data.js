(function(W, D) {
	'use strict';

	W.$chain({
		parse: function(obj, opt) {
			W.$each(this, function(el) {
				W.$html(el, D.parse(W.$html(el), obj, opt));
			});
			return this;
		}
	});
})(Wee, Wee.data);