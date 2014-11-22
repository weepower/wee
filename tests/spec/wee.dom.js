// Method: $hasClass(sel, val)

module('$hasClass');

test('check', 2, function() {
	Wee.$addClass('#qunit-fixture', 'test-class');

	ok(Wee.$hasClass('#qunit-fixture', 'test-class'), 'Test class was checked successfully.');
	strictEqual(Wee.$hasClass('#qunit-fixture', 'another-class'), false, 'Another class was checked successfully.');
});

// Method: $addClass(sel, val)

module('$addClass');

test('check', 1, function() {
	Wee.$addClass('#qunit-fixture', 'test-class');

	ok(Wee.$hasClass('#qunit-fixture', 'test-class'), 'Test class was added successfully.');
});

// Method: $removeClass(sel, val)

module('$removeClass');

test('check', 1, function() {
	Wee.$addClass('#qunit-fixture', 'test-class');
	Wee.$removeClass('#qunit-fixture', 'test-class');

	strictEqual(Wee.$hasClass('#qunit-fixture', 'test-class'), false, 'Test class was removed successfully.');
});

// Method: $css(sel, a, b)

module('$css');

test('single', 1, function() {
	Wee.$css('#qunit-fixture', 'fontSize', '10px');

	strictEqual(Wee.$css('#qunit-fixture', 'fontSize'), '10px', 'Font size was set correctly.');
});

test('object', 2, function() {
	Wee.$css('#qunit-fixture', {
		fontWeight: 'bold',
		marginTop: '10px'
	});

	strictEqual(Wee.$css('#qunit-fixture', 'fontWeight'), 'bold', 'Font weight was set correctly.');
	strictEqual(Wee.$css('#qunit-fixture', 'marginTop'), '10px', 'Top margin was set correctly.');
});

// Method: $html(sel, val)

module('$html');

test('get', 1, function() {
	Wee.$html('#qunit-fixture', '<h1>Testing</h1>');

	strictEqual(Wee.$html('#qunit-fixture'), '<h1>Testing</h1>', 'HTML "<h1>Testing</h1>" was set correctly.');
});

// Method: $clone(sel)

module('$clone');

// Method: $hide(sel)

module('$hide');

// Method: $show(sel)

module('$show');

// Method: $toggle(sel)

module('$toggle');

// Method: $children(sel, filter)

module('$children');

// Method: $contents(sel)

module('$contents');

// Method: $siblings(sel, filter)

module('$siblings');

// Method: $parent(sel)

module('$parent');

// Method: $last(sel)

module('$last');

// Method: $slice(sel, start, end)

module('$slice');

// Method: $contains(sel, child)

module('$contains');

// Method: $append(sel, child)

module('$append');

// Method: $prepend(sel, child)

module('$prepend');

// Method: $before(sel, pos, rem)

module('$before');

// Method: $insertBefore(prev, sel)

module('$insertBefore');

// Method: $after(sel, pos, rem)

module('$after');

// Method: $insertAfter(next, sel)

module('$insertAfter');

// Method: $replaceWith(sel, pos)

module('$replaceWith');

// Method: $remove(sel)

module('$remove');

// Method: $empty(sel)

module('$empty');

// Method: $wrap(sel, html)

module('$wrap');

// Method: $wrapInner(sel, html)

module('$wrapInner');

// Method: $prop(sel, key, val)

module('$prop');

// Method: $removeAttr(sel, key)

module('$removeAttr');

// Method: $text(sel, val)

module('$text');

// Method: $val(sel, val)

module('$val');

// Method: $find(sel, filter)

module('$find');

// Method: $next(sel, filter, opt)

module('$next');

// Method: $prev(sel, filter, opt)

module('$prev');

// Method: $filter(sel, filter, opt)

module('$filter');

// Method: $not(sel, filter, opt)

module('$not');

// Method: $is(sel, filter, opt)

module('$is');

// Method: $index(sel)

module('$index');

// Method: $closest(sel, filter, context)

module('$closest');

// Method: $parents(sel, filter)

module('$parents');

// Method: $toggleClass(sel, val)

module('$toggleClass');

// Method: $parseHTML(html, obj)

module('$parseHTML');

// Method: $position(sel)

module('$position');

// Method: $offset(sel)

module('$offset');

// Method: $width(sel, val)

module('$width');

// Method: $height(sel, val)

module('$height');

// Method: $scrollTop(sel, val)

module('$scrollTop');