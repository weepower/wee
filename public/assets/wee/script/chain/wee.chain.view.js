(function(W, V) {
	'use strict';

	W.$chain({
		render: function(obj, opt) {
			W.$each(this, function(el) {
				W.$html(el, V.render(W.$html(el), obj, opt));
			});
			return this;
		}
	});
})(Wee, Wee.view);