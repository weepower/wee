/* global QUnit */

// Method: $hasClass(sel, val)

QUnit.module('$hasClass');

QUnit.test('check', 2, function(assert) {
	Wee.$addClass('#qunit-fixture', 'test-class');

	assert.ok(Wee.$hasClass('#qunit-fixture', 'test-class'), 'Test class was checked successfully.');
	assert.strictEqual(Wee.$hasClass('#qunit-fixture', 'another-class'), false, 'Another class was checked successfully.');
});

// Method: $addClass(sel, val)

QUnit.module('$addClass');

QUnit.test('check', 1, function(assert) {
	Wee.$addClass('#qunit-fixture', 'test-class');

	assert.ok(Wee.$hasClass('#qunit-fixture', 'test-class'), 'Test class was added successfully.');
});

// Method: $removeClass(sel, val)

QUnit.module('$removeClass');

QUnit.test('check', 1, function(assert) {
	Wee.$addClass('#qunit-fixture', 'test-class');
	Wee.$removeClass('#qunit-fixture', 'test-class');

	assert.strictEqual(Wee.$hasClass('#qunit-fixture', 'test-class'), false, 'Test class was removed successfully.');
});

// Method: $css(sel, a, b)

QUnit.module('$css');

QUnit.test('single', 1, function(assert) {
	Wee.$css('#qunit-fixture', 'fontSize', '10px');

	assert.strictEqual(Wee.$css('#qunit-fixture', 'fontSize'), '10px', 'Font size was set correctly.');
});

QUnit.test('object', 2, function(assert) {
	Wee.$css('#qunit-fixture', {
		fontWeight: 'bold',
		marginTop: '10px'
	});

	assert.strictEqual(Wee.$css('#qunit-fixture', 'fontWeight'), 'bold', 'Font weight was set correctly.');
	assert.strictEqual(Wee.$css('#qunit-fixture', 'marginTop'), '10px', 'Top margin was set correctly.');
});

// Method: $html(sel, val)

QUnit.module('$html');

QUnit.test('get', 1, function(assert) {
	Wee.$html('#qunit-fixture', '<h1>Testing</h1>');

	assert.strictEqual(Wee.$html('#qunit-fixture'), '<h1>Testing</h1>', 'HTML "<h1>Testing</h1>" was set correctly.');
});

// Method: $clone(sel)

QUnit.module('$clone');

// Method: $hide(sel)

QUnit.module('$hide');

// Method: $show(sel)

QUnit.module('$show');

// Method: $toggle(sel)

QUnit.module('$toggle');

// Method: $children(sel, filter)

QUnit.module('$children');

// Method: $contents(sel)

QUnit.module('$contents');

// Method: $siblings(sel, filter)

QUnit.module('$siblings');

// Method: $parent(sel)

QUnit.module('$parent');

// Method: $last(sel)

QUnit.module('$last');

// Method: $slice(sel, start, end)

QUnit.module('$slice');

// Method: $contains(sel, child)

QUnit.module('$contains');

// Method: $append(sel, child)

QUnit.module('$append');

// Method: $prepend(sel, child)

QUnit.module('$prepend');

// Method: $before(sel, pos, rem)

QUnit.module('$before');

// Method: $insertBefore(prev, sel)

QUnit.module('$insertBefore');

// Method: $after(sel, pos, rem)

QUnit.module('$after');

// Method: $insertAfter(next, sel)

QUnit.module('$insertAfter');

// Method: $replaceWith(sel, pos)

QUnit.module('$replaceWith');

// Method: $remove(sel)

QUnit.module('$remove');

// Method: $empty(sel)

QUnit.module('$empty');

// Method: $wrap(sel, html)

QUnit.module('$wrap');

// Method: $wrapInner(sel, html)

QUnit.module('$wrapInner');

// Method: $prop(sel, key, val)

QUnit.module('$prop');

// Method: $removeAttr(sel, key)

QUnit.module('$removeAttr');

// Method: $text(sel, val)

QUnit.module('$text');

// Method: $val(sel, val)

QUnit.module('$val');

// Method: $find(sel, filter)

QUnit.module('$find');

// Method: $next(sel, filter, opt)

QUnit.module('$next');

// Method: $prev(sel, filter, opt)

QUnit.module('$prev');

// Method: $filter(sel, filter, opt)

QUnit.module('$filter');

// Method: $not(sel, filter, opt)

QUnit.module('$not');

// Method: $is(sel, filter, opt)

QUnit.module('$is');

// Method: $index(sel)

QUnit.module('$index');

// Method: $closest(sel, filter, context)

QUnit.module('$closest');

// Method: $parents(sel, filter)

QUnit.module('$parents');

// Method: $toggleClass(sel, val)

QUnit.module('$toggleClass');

// Method: $parseHTML(html, obj)

QUnit.module('$parseHTML');

// Method: $position(sel)

QUnit.module('$position');

// Method: $offset(sel)

QUnit.module('$offset');

// Method: $width(sel, val)

QUnit.module('$width');

// Method: $height(sel, val)

QUnit.module('$height');

// Method: $scrollTop(sel, val)

QUnit.module('$scrollTop');