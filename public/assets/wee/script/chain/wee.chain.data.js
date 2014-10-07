// Wee 2.0.5 (weepower.com)
// Licensed under Apache 2 (http://www.apache.org/licenses/LICENSE-2.0)
// DO NOT MODIFY THIS FILE

Wee.$chain({
	parse: function(obj, opt) {
		Wee.$each(this, function(el) {
			Wee.$html(el, Wee.data.parse(Wee.$html(el), obj, opt));
		});
		return this;
	}
});