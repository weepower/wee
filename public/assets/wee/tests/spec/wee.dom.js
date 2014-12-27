/* global QUnit */

// Method: $addClass(sel, val)

QUnit.module('$addClass, $removeClass, $hasClass', {
	beforeEach: function() {
		Wee.$addClass('#wee', 'test-class test-class-2');
	}
});

QUnit.test('add', 3, function(assert) {
	assert.ok(Wee.$hasClass('#wee', 'test-class'), 'Test class was added successfully.');
	assert.ok(Wee.$hasClass('#wee', 'test-class-2'), 'Test class 2 was added successfully.');
	assert.strictEqual(Wee.$hasClass('#wee', 'another-class'), false, 'Another class was not available.');
});

// Method: $removeClass(sel, val)

QUnit.test('remove', 2, function(assert) {
	Wee.$removeClass('#wee', 'test-class');

	assert.strictEqual(Wee.$hasClass('#wee', 'test-class'), false, 'Test class was removed successfully.');
	assert.ok(Wee.$hasClass('#wee', 'test-class-2'), 'Test class 2 is still available.');
});

// Method: $hasClass(sel, val)

QUnit.test('has', 2, function(assert) {
	Wee.$removeClass('#wee', 'test-class test-class-2');

	assert.strictEqual(Wee.$hasClass('#wee', 'test-class'), false, 'Test class was removed successfully.');
	assert.strictEqual(Wee.$hasClass('#wee', 'test-class-2'), false, 'Test class 2 was removed successfully.');
});

// Method: $css(sel, a, b)

QUnit.module('$css');

QUnit.test('default', 1, function(assert) {
	assert.strictEqual(Wee.$css('#wee', 'paddingTop'), '0px', 'Default padding was set correctly.');
});

QUnit.test('single', 1, function(assert) {
	Wee.$css('#wee', 'fontSize', '10px');

	assert.strictEqual(Wee.$css('#wee', 'fontSize'), '10px', 'Font size was set correctly.');
});

QUnit.test('object', 2, function(assert) {
	Wee.$css('#wee', {
		marginTop: '10px',
		marginBottom: '5px'
	});

	assert.strictEqual(Wee.$css('#wee', 'marginTop'), '10px', 'Top margin was set correctly.');
	assert.strictEqual(Wee.$css('#wee', 'marginBottom'), '5px', 'Bottom margin was set correctly.');
});

// Method: $html(sel, val)

QUnit.module('$html');

QUnit.test('single', 1, function(assert) {
	Wee.$html('#wee', '<h1>testing</h1>');

	assert.strictEqual(Wee.$html('#wee').toLowerCase(), '<h1>testing</h1>', 'HTML "<h1>testing</h1>" was set correctly.');
});

QUnit.test('multiple', 1, function(assert) {
	Wee.$html('#wee', '<span></span><span></span><span></span>');
	Wee.$html('#wee span', '1');

	assert.strictEqual(Wee.$html('#wee').toLowerCase(), '<span>1</span><span>1</span><span>1</span>', 'HTML span values returned successfully.');
});

// Method: $clone(sel)

QUnit.module('$clone');

QUnit.test('duplicate', 1, function(assert) {
	Wee.$html('#wee', '<h1>testing</h1>');

	var $clone = Wee.$clone('#wee');

	assert.strictEqual(Wee.$html($clone).toLowerCase(), '<h1>testing</h1>', 'Element was cloned successfully.');
});

// Method: $hide(sel)

QUnit.module('$hide');

QUnit.test('hide', 1, function(assert) {
	Wee.$hide('#wee');

	assert.ok(Wee.$hasClass('#wee', 'js-hide'), 'Element was hidden successfully.');
});

// Method: $show(sel)

QUnit.module('$show');

QUnit.test('show', 1, function(assert) {
	Wee.$hide('#wee');
	Wee.$show('#wee');

	assert.strictEqual(Wee.$hasClass('#wee', 'js-hide'), false, 'Element was shown successfully.');
});

// Method: $toggle(sel)

QUnit.module('$toggle');

QUnit.test('toggle', 2, function(assert) {
	Wee.$toggle('#wee');

	assert.ok(Wee.$hasClass('#wee', 'js-hide'), 'Element was hidden successfully.');

	Wee.$toggle('#wee');

	assert.strictEqual(Wee.$hasClass('#wee', 'js-hide'), false, 'Element was shown successfully.');
});

// Method: $children(sel, filter)

QUnit.module('$children');

QUnit.test('get', 1, function(assert) {
	Wee.$html('#wee', '<span></span><span></span>');

	assert.strictEqual(Wee.$children('#wee').length, 2, 'Children selected successfully.');
});

// Method: $contents(sel)

QUnit.module('$contents');

QUnit.test('get', 1, function(assert) {
	Wee.$html('#wee', '<span></span><span></span>');

	assert.strictEqual(Wee.$contents('#wee').length, 2, 'Contents selected successfully.');
});

// Method: $siblings(sel, filter)

QUnit.module('$siblings');

QUnit.test('get', 1, function(assert) {
	Wee.$html('#wee', '<span id="fixture-item"></span><span></span><span></span>');

	assert.strictEqual(Wee.$siblings('#fixture-item').length, 2, 'Siblings selected successfully.');
});

// Method: $parent(sel)

QUnit.module('$parent');

QUnit.test('get', 1, function(assert) {
	var $fixture = Wee.$('#wee');

	Wee.$html($fixture, '<span class="fixture-child"></span>');

	assert.deepEqual(Wee.$parent('.fixture-child'), $fixture, 'Parent returned successfully.');
});

// Method: $last(sel, context)

QUnit.module('$last');

QUnit.test('get', 1, function(assert) {
	Wee.$html('#wee', '<span>1</span><span>2</span><span>3</span>');

	assert.strictEqual(Wee.$html(Wee.$last('#wee span')), '3', 'Last element content returned successfully.');
});

// Method: $slice(sel, start, end)

QUnit.module('$slice');

QUnit.test('get', 1, function(assert) {
	Wee.$html('#wee', '<span>1</span><span>2</span><span>3</span>');

	assert.strictEqual(Wee.$html(Wee.$slice('#wee span', 1, 2)), '2', 'Second element selected successfully.');
});

// Method: $contains(sel, child)

QUnit.module('$contains');

QUnit.test('query', 2, function(assert) {
	Wee.$html('#wee', '<span class="testing"></span>');

	assert.ok(Wee.$contains('#wee', '.testing'), 'Testing element selected successfully.');
	assert.strictEqual(Wee.$contains('#wee', '.another'), false, 'Another element not available.');
});

// Method: $append(sel, child)

QUnit.module('$append');

QUnit.test('query', 1, function(assert) {
	Wee.$append('#wee', '<span class="testing"></span>');

	assert.ok(Wee.$contains('#wee', '.testing'), 'Testing element appended successfully.');
});

// Method: $prepend(sel, child)

QUnit.module('$prepend');

QUnit.test('query', 1, function(assert) {
	Wee.$append('#wee', '<span class="testing"></span>');

	assert.ok(Wee.$contains('#wee', '.testing'), 'Testing element prepended successfully.');
});

// Method: $before(sel, pos, rem)

QUnit.module('$before');

QUnit.test('query', 1, function(assert) {
	Wee.$before('#wee', '<span class="testing"></span>');

	var $prev = Wee.$prev('#wee');

	assert.ok(Wee.$hasClass($prev, 'testing'), 'Testing element added before successfully.');

	Wee.$remove('.testing');
});

// Method: $insertBefore(prev, sel)

QUnit.module('$insertBefore');

QUnit.test('query', 1, function(assert) {
	var $el = Wee.$parseHTML('<span class="testing"></span>');

	Wee.$insertBefore($el, '#wee');

	var $prev = Wee.$prev('#wee');

	assert.ok(Wee.$hasClass($prev, 'testing'), 'Testing element added before successfully.');

	Wee.$remove('.testing');
});

// Method: $after(sel, pos, rem)

QUnit.module('$after');

QUnit.test('query', 1, function(assert) {
	Wee.$after('#wee', '<span class="testing"></span>');

	var $prev = Wee.$next('#wee');

	assert.ok(Wee.$hasClass($prev, 'testing'), 'Testing element added after successfully.');

	Wee.$remove('.testing');
});

// Method: $insertAfter(next, sel)

QUnit.module('$insertAfter');

QUnit.test('query', 1, function(assert) {
	var $el = Wee.$parseHTML('<span class="testing"></span>');

	Wee.$insertAfter($el, '#wee');

	var $next = Wee.$next('#wee');

	assert.ok(Wee.$hasClass($next, 'testing'), 'Testing element added after successfully.');

	Wee.$remove('.testing');
});

// Method: $replaceWith(sel, pos)

QUnit.module('$replaceWith');

QUnit.test('query', 2, function(assert) {
	Wee.$replaceWith('#wee', '<span class="testing"></span>');

	assert.strictEqual(Wee.$('#wee').length, 0, 'Fixture removed successfully.');
	assert.strictEqual(Wee.$('.testing').length, 1, 'Testing element added successfully.');
});

// Method: $remove(sel, context)

QUnit.module('$remove');

QUnit.test('query', 1, function(assert) {
	Wee.$html('#wee', '<span class="testing"></span>');
	Wee.$remove('.testing');

	assert.strictEqual(Wee.$('.testing').length, 0, 'Fixture removed successfully.');
});

// Method: $empty(sel)

QUnit.module('$empty');

QUnit.test('query', 1, function(assert) {
	Wee.$html('#wee', '<span class="testing"></span>');
	Wee.$empty('#wee');

	assert.strictEqual(Wee.$('.testing').length, 0, 'Fixture emptied successfully.');
});

// Method: $wrap(sel, html)

QUnit.module('$wrap');

QUnit.test('query', 1, function(assert) {
	Wee.$wrap('#wee', '<div id="wrapper"></div>');

	assert.strictEqual(Wee.$parent('#wee')[0].id, 'wrapper', 'Element wrapped successfully.');
});

// Method: $wrapInner(sel, html)

QUnit.module('$wrapInner');

QUnit.test('query', 1, function(assert) {
	Wee.$wrapInner('#wee', '<div id="testing"></div>');

	assert.ok(Wee.$contains('#wee', '#testing'), 'Element wrapped successfully.');
});

// Method: $prop(sel, a, b)

QUnit.module('$prop');

QUnit.test('single', 1, function(assert) {
	Wee.$append('#wee', '<input type="text" class="testing">');

	Wee.$prop('.testing', 'disabled', true);

	assert.ok(Wee.$prop('.testing', 'disabled'), 'Disabled property was added successfully.');
});

QUnit.test('multiple', 2, function(assert) {
	Wee.$append('#wee', '<input type="text" class="testing">');

	Wee.$prop('.testing', {
		'disabled': true,
		'required': true
	});

	assert.ok(Wee.$prop('.testing', 'disabled'), 'Disabled property was negated successfully.');
	assert.ok(Wee.$prop('.testing', 'required'), 'Required property was added successfully.');
});

// Method: $removeAttr(sel, key)

QUnit.module('$removeAttr');

QUnit.test('query', 1, function(assert) {
	Wee.$attr('#wee', 'data-test', 'value');
	Wee.$removeAttr('#wee', 'data-test');

	assert.strictEqual(Wee.$attr('#wee', 'data-test'), null, 'Attribute removed successfully.');
});

// Method: $text(sel, val)

QUnit.module('$text');

QUnit.test('query', 1, function(assert) {
	Wee.$text('#wee', 'Testing 123');

	assert.strictEqual(Wee.$text('#wee'), 'Testing 123', 'Element text set successfully.');
});

// Method: $val(sel, val)

QUnit.module('$val');

QUnit.test('query', 1, function(assert) {
	Wee.$html('#wee', '<input type="text" class="testing">');
	Wee.$val('.testing', 'test');

	assert.strictEqual(Wee.$val('.testing'), 'test', 'Testing value set successfully.');
});

// Method: $find(sel, filter)

QUnit.module('$find');

QUnit.test('query', 1, function(assert) {
	Wee.$html('#wee', '<span class="testing"></span>');

	assert.strictEqual(Wee.$find('#wee', '.testing').length, 1, 'Testing element selected successfully.');
});

// Method: $next(sel, filter, opt)

QUnit.module('$next');

QUnit.test('query', 1, function(assert) {
	Wee.$append('#qunit-fixture', '<div id="appended"></div>');

	assert.strictEqual(Wee.$next('#wee')[0].id, 'appended', 'Next element returned successfully.');
});

// Method: $prev(sel, filter, opt)

QUnit.module('$prev');

QUnit.test('query', 1, function(assert) {
	Wee.$prepend('#qunit-fixture', '<div id="prepended"></div>');

	assert.strictEqual(Wee.$prev('#wee')[0].id, 'prepended', 'Previous element returned successfully.');
});

// Method: $filter(sel, filter, opt)

QUnit.module('$filter');

QUnit.test('query', 1, function(assert) {
	Wee.$html('#wee', '<span class="testing one"></span><span class="testing two"></span><span class="testing three"></span>');

	var $elements = Wee.$('.testing');

	assert.strictEqual(Wee.$filter($elements, '.one').length, 1, 'Filtered element returned successfully.');
});

// Method: $not(sel, filter, opt)

QUnit.module('$not');

QUnit.test('query', 1, function(assert) {
	Wee.$html('#wee', '<span class="testing one"></span><span class="testing two"></span><span class="testing three"></span>');

	var $elements = Wee.$('.testing');

	assert.strictEqual(Wee.$not($elements, '.one').length, 2, 'Filtered elements returned successfully.');
});

// Method: $is(sel, filter, opt)

QUnit.module('$is');

QUnit.test('query', 1, function(assert) {
	Wee.$addClass('#wee', 'one');

	assert.ok(Wee.$is('#wee', '.one'), 'Fixture successfully identified with "one" class.');
});

// Method: $index(sel)

QUnit.module('$index');

QUnit.test('query', 1, function(assert) {
	Wee.$html('#wee', '<div id="one"></div><div id="two"></div><div id="three"></div>');

	assert.strictEqual(Wee.$index('#three'), 2, 'Correct element index returned.');
});

// Method: $closest(sel, filter, context)

QUnit.module('$closest');

QUnit.test('query', 1, function(assert) {
	assert.strictEqual(Wee.$closest('#wee', '#qunit-fixture').length, 1, 'Another element not available.');
});

// Method: $parents(sel, filter)

QUnit.test('query', 1, function(assert) {
	assert.strictEqual(Wee.$parents('#wee').length, 3, 'Parent elements retrieved successfully.');
});

// Method: $toggleClass(sel, val, toggle)

QUnit.module('$toggleClass');

QUnit.test('query', 2, function(assert) {
	Wee.$toggleClass('#wee', 'test');

	assert.ok(Wee.$hasClass('#wee', 'test'), 'Class added successfully.');

	Wee.$toggleClass('#wee', 'test');

	assert.strictEqual(Wee.$hasClass('#wee', 'test'), false, 'Class removed successfully.');
});

// Method: $parseHTML(html, obj)

QUnit.module('$parseHTML');

QUnit.test('query', 1, function(assert) {
	var $el = Wee.$parseHTML('<span class="testing"><span class="child"></div></span>', true);

	assert.ok(Wee.$contains($el, '.child'), 'HTML parsed successfully.');

	Wee.$remove('.testing');
});

// Method: $position(sel)

QUnit.module('$position');

QUnit.test('query', 1, function(assert) {
	assert.deepEqual(Wee.$position('#qunit-fixture'), {
		top: -10000,
		left: -10000
	}, 'Position returned successfully.');

	Wee.$remove('.testing');
});

// Method: $offset(sel)

QUnit.module('$offset');

QUnit.test('query', 1, function(assert) {
	assert.deepEqual(Wee.$offset('#qunit-fixture'), {
		top: -10000,
		left: -10000
	}, 'Offset returned successfully.');

	Wee.$remove('.testing');
});

// Method: $width(sel, val)

QUnit.module('$width');

QUnit.test('query', 1, function(assert) {
	Wee.$width('#wee', '100px');

	assert.strictEqual(Wee.$width('#wee'), 100, 'Element width set successfully.');
});

// Method: $height(sel, val)

QUnit.module('$height');

QUnit.test('check', 1, function(assert) {
	Wee.$height('#wee', '100px');

	assert.strictEqual(Wee.$height('#wee'), 100, 'Element height set successfully.');
});

// Method: $scrollTop(sel, val)

QUnit.module('$scrollTop');

QUnit.test('check', 1, function(assert) {
	assert.strictEqual(Wee.$scrollTop(), 0, 'Scroll top value set successfully.');
});
