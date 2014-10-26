Wee.$chain({
	html: function(val) {
		var r = Wee.$html(this, val);
		return val !== undefined ? this : r;
	},
	hasClass: function(val) {
		return Wee.$hasClass(this, val);
	},
	addClass: function(val) {
		Wee.$addClass(this, val);
		return this;
	},
	removeClass: function(val) {
		Wee.$removeClass(this, val);
		return this;
	},
	css: function(a, b) {
		var r = Wee.$css(this, a, b);
		return b || Wee.$isObject(a) ? this : r;
	},
	clone: function() {
		return $(Wee.$clone(this));
	},
	removeAttr: function(key) {
		Wee.$removeAttr(this, key);
		return this;
	},
	prop: function(key, val) {
		var r = Wee.$prop(this, key, val);
		return val !== undefined ? this : r;
	},
	val: function(val) {
		var r = Wee.$val(this, val);
		return val !== undefined ? this : r;
	},
	show: function() {
		Wee.$show(this);
		return this;
	},
	hide: function() {
		Wee.$hide(this);
		return this;
	},
	toggle: function() {
		Wee.$toggle(this);
		return this;
	},
	children: function(filter) {
		return $(Wee.$children(this, filter));
	},
	contents: function() {
		return $(Wee.$contents(this));
	},
	siblings: function(filter) {
		return $(Wee.$siblings(this, filter));
	},
	parent: function() {
		return $(Wee.$parent(this));
	},
	contains: function(child) {
		return Wee.$contains(this, child);
	},
	append: function(child) {
		Wee.$append(this, child);
		return this;
	},
	appendTo: function(parent) {
		Wee.$append(parent, this);
		return this;
	},
	prepend: function(child) {
		Wee.$prepend(this, child);
		return this;
	},
	prependTo: function(parent) {
		Wee.$prepend(parent, this.reverse());
		return this;
	},
	before: function(pos) {
		Wee.$before(this, pos);
		return this;
	},
	insertBefore: function(sel) {
		Wee.$insertBefore(this, sel);
		return this;
	},
	after: function(pos) {
		Wee.$after(this, pos);
		return this;
	},
	insertAfter: function(sel) {
		Wee.$insertAfter(this, sel);
		return this;
	},
	replaceWith: function(sel) {
		return Wee.$replaceWith(this, sel);
	},
	remove: function() {
		Wee.$remove(this);
		return this;
	},
	empty: function() {
		Wee.$empty(this);
		return this;
	},
	wrap: function(html) {
		Wee.$wrap(this, html);
		return this;
	},
	wrapInner: function(html) {
		Wee.$wrapInner(this, html);
		return this;
	},
	text: function(val) {
		var r = Wee.$text(this, val);
		return val !== undefined ? this : r;
	},
	last: function() {
		return $(Wee.$last(this));
	},
	slice: function(start, end) {
		return $(Wee.$slice(this, start, end));
	},
	find: function(filter) {
		return $(Wee.$find(this, filter));
	},
	next: function(filter) {
		return $(Wee.$next(this, filter));
	},
	prev: function(filter) {
		return $(Wee.$prev(this, filter));
	},
	filter: function(filter) {
		return $(Wee.$filter(this, filter));
	},
	not: function(filter) {
		return $(Wee.$not(this, filter));
	},
	is: function(filter) {
		return Wee.$is(this, filter);
	},
	index: function() {
		return Wee.$index(this);
	},
	closest: function(filter) {
		return $(Wee.$closest(this, filter));
	},
	toggleClass: function(val) {
		Wee.$toggleClass(this, val);
		return this;
	},
	position: function() {
		return Wee.$position(this);
	},
	offset: function() {
		return Wee.$offset(this);
	},
	width: function(val) {
		var r = Wee.$width(this, val);
		return val === undefined || val === true ? r : this;
	},
	height: function(val) {
		var r = Wee.$height(this, val);
		return val === undefined || val === true ? r : this;
	},
	scrollTop: function(val) {
		var r = Wee.$scrollTop(this, val);
		return val === undefined || val === true ? r : this;
	}
});