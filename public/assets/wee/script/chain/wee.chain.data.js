Wee.$chain({
	parse: function(obj, opt) {
		Wee.$each(this, function(el) {
			Wee.$html(el, Wee.data.parse(Wee.$html(el), obj, opt));
		});
		return this;
	}
});