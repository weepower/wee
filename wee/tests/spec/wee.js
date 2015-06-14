/* global QUnit */

// Method: fn.make(name, pub, priv)

QUnit.module('fn.make');

QUnit.test('create', 1, function(assert) {
	Wee.fn.make('controller', {
		test: function() {
			return 'response';
		}
	});

	assert.strictEqual(Wee.controller.test(), 'response', 'Controller function response correctly returned.');
});

// Method: fn.extend(a, b, c)

QUnit.module('fn.extend');

QUnit.test('extend', 1, function(assert) {
	Wee.fn.extend('controller', {
		test2: function() {
			return 'response';
		}
	});

	assert.strictEqual(Wee.controller.test2(), 'response', 'Controller extended successfully.');
});

// Method: $env(obj, def)

QUnit.module('$env');

QUnit.test('default', 1, function(assert) {
	assert.strictEqual(Wee.$env(), 'local', 'Default environment is correctly set to "local".');
});

QUnit.test('settings', 1, function(assert) {
	Wee.$env({
		prod: 'www.weepower.com',
		stage: 'www.weepower.stage'
	}, 'here');

	assert.strictEqual(Wee.$env(), 'here', 'Default environment is correctly set to "here".');
});

// Method: $envSecure(url)

QUnit.module('$envSecure');

QUnit.test('override', 1, function(assert) {
	assert.ok(Wee.$envSecure('https://www.weepower.com'), 'The environment is correctly identified as secure.');
});

// Method: $get(key, def, set, opt)
// Method: $set(key, val, opt)
// Method: $push(key, a, b)

QUnit.module('$get, $set, $push');

QUnit.test('get empty', 2, function(assert) {
	assert.strictEqual(Wee.$get('var-123'), null, 'Variable "var-123" is currently null.');
	assert.strictEqual(Wee.$get('123 var'), null, 'Variable "123 var" is currently null.');
});

QUnit.test('get with default string', 4, function(assert) {
	assert.strictEqual(Wee.$get('var-123', 'string'), 'string', 'Variable "var-123" is returned as the default "string".');
	assert.strictEqual(Wee.$get('var-123'), null, 'Variable "var-123" is still correctly set to null.');
	assert.strictEqual(Wee.$get('cont:var-123', 'string'), 'string', 'Variable "var-123" is returned as the default "string" in the "cont" namespace.');
	assert.strictEqual(Wee.$get('123 var', 'Testing 123'), 'Testing 123', 'Variable "123 var" is returned as the default "Testing 123".');
});

QUnit.test('get with default string returned by callback', 1, function(assert) {
	assert.strictEqual(Wee.$get('var-123', function() {
		return 'string';
	}), 'string', 'Variable "var-123" is returned as the default "string".');
});

QUnit.test('set string', 3, function(assert) {
	assert.strictEqual(Wee.$set('var-123', 'string'), 'string', 'Variable "var-123" was set to "string".');
	assert.strictEqual(Wee.$set('cont:var-123', 'string'), 'string', 'Variable "var-123" was set to "string" in the "cont" namespace.');
	assert.strictEqual(Wee.$set('123 var', 'Testing 123'), 'Testing 123', 'Variable "var-123" was set to "Testing 123".');
});

QUnit.test('get string', 3, function(assert) {
	assert.strictEqual(Wee.$get('var-123'), 'string', 'Variable "var-123" is correctly set to "string".');
	assert.strictEqual(Wee.$get('cont:var-123'), 'string', 'Variable "var-123" is correctly set to "string" in the "cont" namespace.');
	assert.strictEqual(Wee.$get('123 var'), 'Testing 123', 'Variable "123 var" is correctly set to "Testing 123".');
});

QUnit.test('get with set default string', 2, function(assert) {
	assert.strictEqual(Wee.$get('set-var-123', 'string', true), 'string', 'Variable "set-var-123" is set to the default "string".');
	assert.strictEqual(Wee.$get('set-var-123'), 'string', 'Variable "set-var-123" is correctly set to "string".');
});

// Method: $exec(fn, opt)

QUnit.module('$exec');

Wee.fn.make('execTest', {
	withParams: function(val) {
		return val;
	},
	withoutParams: function() {
		return 'value';
	}
});

QUnit.test('callback', 1, function(assert) {
	assert.strictEqual(Wee.$exec(function() {
		return 'value';
	}), 'value', 'Simple callback was executed correctly.');
});

QUnit.test('callback with argument', 1, function(assert) {
	assert.strictEqual(Wee.$exec(function(val) {
		return val;
	}, {
		args: ['value']
	}), 'value', 'Simple callback with argument was executed correctly.');
});

QUnit.test('module callback', 1, function(assert) {
	assert.strictEqual(Wee.$exec('execTest:withoutParams'), 'value', 'Module callback was executed correctly.');
});

QUnit.test('module callback', 1, function(assert) {
	assert.strictEqual(Wee.$exec('execTest:withoutParams', {
		args: ['value']
	}), 'value', 'Module callback with argument was executed correctly.');
});

// Method: $isArray(obj)

QUnit.module('$isArray');

QUnit.test('check different types against array', 4, function(assert) {
	assert.notOk(Wee.$isArray('string'), 'Variable "string" is not an array.');
	assert.notOk(Wee.$isArray(function test() {}), 'Function "test()" is not an array.');
	assert.notOk(Wee.$isArray({
		string: 'string'
	}), 'Object "string" is not an array.');
	assert.ok(Wee.$isArray(['string']), 'Array "[\'string\']" is an array.');
});

// Method: $inArray(obj, el)

QUnit.module('$inArray');

QUnit.test('check if array is array', 1, function(assert) {
	assert.strictEqual(Wee.$isArray(['string']), true, 'Array "[\'string\']" is an array.');
});

// Method: $toArray(obj)

QUnit.module('$toArray');

QUnit.test('convert string to array', 1, function(assert) {
	assert.deepEqual(Wee.$toArray('string'), ['string'], 'String "string" is now ["string"].');
});
QUnit.test('convert array to array', 1, function(assert) {
	assert.deepEqual(Wee.$toArray(['string']), ['string'], 'Array ["string"] is still ["string"].');
});

// Method: $isString(obj)

QUnit.module('$isString');

QUnit.test('check different types against string', 4, function(assert) {
	assert.notOk(Wee.$isString(function test() {}), 'Function "test()" is not a string.');
	assert.notOk(Wee.$isString({
		string: 'string'
	}), 'Object "string" is not a string.');
	assert.notOk(Wee.$isString(['string']), 'Array "[\'string\']" is not a string.');
	assert.ok(Wee.$isString('string'), 'Variable "string" is a string.');
});

// Method: $isFunction(obj)

QUnit.module('$isFunction');

QUnit.test('check different types against function', 4, function(assert) {
	assert.notOk(Wee.$isFunction('string'), 'Variable "string" is not a function.');
	assert.notOk(Wee.$isFunction({
		string: 'string'
	}), 'Object "string" is not a function.');
	assert.notOk(Wee.$isFunction(['string']), 'Array "[\'string\']" is not a function.');
	assert.ok(Wee.$isFunction(function test() {}), 'Function "test()" is a function.');
});

// Method: $isObject(obj)

QUnit.module('$isObject');

QUnit.test('check different types against object', 4, function(assert) {
	assert.notOk(Wee.$isObject('string'), 'Variable "string" is not an object.');
	assert.notOk(Wee.$isObject(function test() {}), 'Function "test()" is not an object.');
	assert.notOk(Wee.$isObject(['string']), 'Array "[\'string\']" is not an object.');
	assert.ok(Wee.$isObject({
		string: 'string'
	}), 'Object "string" is an object.');
});

// Method: $getKeys(obj)

QUnit.module('$getKeys');

QUnit.test('check for properly set keys', 1, function(assert) {
	assert.deepEqual(Wee.$getKeys({
		key1: 'val1',
		key2: 'val2',
		key3: 'val3'
	}), ['key1', 'key2', 'key3'], 'Object keys properly returned.');
});

// Method: $serialize(obj)

QUnit.module('$serialize');

QUnit.test('check for properly serialized object', 1, function(assert) {
	assert.strictEqual(Wee.$serialize({
		key1: 'val1',
		key2: 'val2',
		key3: 'val3'
	}), 'key1=val1&key2=val2&key3=val3', 'Object serialization properly returned.');
});

// Method: $extend(obj, src, deep)

QUnit.module('$extend');

QUnit.test('extend shallow', 1, function(assert) {
	var obj = {
			key: 'value'
		},
		src = {
			key2: 'value2'
		},
		result = {
			key: 'value',
			key2: 'value2'
		};

	assert.deepEqual(Wee.$extend(obj, src), result, 'Objects merged at top level.');
});

QUnit.test('extend deep', 1, function(assert) {
	var obj = {
			key: {
				subKey: 'value'
			}
		},
		src = {
			key: {
				subKey2: 'value2'
			},
			key2: 'value2'
		},
		result = {
			key: {
				subKey: 'value',
				subKey2: 'value2'
			},
			key2: 'value2'
		};

	assert.deepEqual(Wee.$extend(obj, src, true), result, 'Objects merged recursively.');
});

// Method: $merge(arr, arr2, dup)

QUnit.module('$merge');

QUnit.test('combine with duplicates', 1, function(assert) {
	var arr = [1, 2, 3, 4],
		arr2 = [4, 5, 6],
		result = [1, 2, 3, 4, 4, 5, 6];

	assert.deepEqual(Wee.$merge(arr, arr2), result, 'Arrays merged with duplicates remaining.');
});

QUnit.test('combine and deduplicate', 1, function(assert) {
	var arr = [1, 2, 3, 4],
		arr2 = [4, 5, 6];

	assert.deepEqual(Wee.$merge(arr, arr2, true), [1, 2, 3, 4, 5, 6], 'Arrays merged with duplicates removed.');
});

// Method: $unique(arr)

QUnit.module('$unique');

QUnit.test('check for unique values', 1, function(assert) {
	var arr = [1, 2, 3, 3, 4, 4, 5];

	assert.deepEqual(Wee.$unique(arr), [1, 2, 3, 4, 5], 'Only unique elements were correctly returned.');
});

// Method: $(sel, context)

QUnit.module('$');

QUnit.test('select', 2, function(assert) {
	Wee.$html('#wee',
		'<div id="testing"></div>' +
		'<div class="testing"></div>'
	);

	assert.strictEqual(Wee.$('#testing').length, 1, 'Element with ID "testing" was selected successfully.');
	assert.strictEqual(Wee.$('.testing').length, 1, 'Element with class "testing" was selected successfully.');
});

// Method: $eq(sel, i, context)

QUnit.module('$eq');

QUnit.test('select index', 1, function(assert) {
	Wee.$html('#wee',
		'<div class="testing">1</div>' +
		'<div class="testing">2</div>' +
		'<div class="testing">3</div>'
	);

	var el = Wee.$eq('.testing', 1);

	assert.strictEqual(Wee.$text(el), '2', 'Element with index 1 was selected successfully.');
});

// Method: $first(sel, context)

QUnit.module('$first');

QUnit.test('select first', 1, function(assert) {
	Wee.$html('#wee',
		'<div class="testing">1</div>' +
		'<div class="testing">2</div>' +
		'<div class="testing">3</div>'
	);

	var el = Wee.$first('.testing');

	assert.strictEqual(Wee.$text(el), '1', 'First element was selected successfully.');
});

// Method: $each(sel, fn, opt)

QUnit.module('$each');

QUnit.test('iterate selection', 1, function(assert) {
	Wee.$html('#wee',
		'<div class="testing">1</div>' +
		'<div class="testing">2</div>' +
		'<div class="testing">3</div>'
	);

	var total = 0;

	Wee.$each('.testing', function(el) {
		total += parseInt(Wee.$text(el), 10);
	});

	assert.strictEqual(total, 6, 'Elements successfully iterated.');
});

// Method: $map(sel, fn)

QUnit.module('$map');

QUnit.test('map selection', 1, function(assert) {
	Wee.$html('#wee',
		'<div class="testing">1</div>' +
		'<div class="testing">2</div>' +
		'<div class="testing">3</div>'
	);

	var values = Wee.$map('.testing', function(el) {
		return parseInt(Wee.$html(el), 10);
	});

	assert.deepEqual(values, [1, 2, 3], 'Elements successfully iterated.');
});

// Method: $attr(sel, key, val)

QUnit.module('$attr');

QUnit.test('get', 1, function(assert) {
	Wee.$attr('#wee', 'test', 'value');

	assert.strictEqual(Wee.$attr('#wee', 'test'), 'value', 'Attribute "test" was set correctly.');
});

// Method: $data(sel, key, val)

QUnit.module('$data');

QUnit.test('get', 1, function(assert) {
	Wee.$data('#wee', 'test', 'value');

	assert.strictEqual(Wee.$data('#wee', 'test'), 'value', 'Data attribute "test" was set correctly.');
});

// Method: $setVars()

QUnit.module('$setVars');

QUnit.test('get', 3, function(assert) {
	Wee.$html('#wee',
		'<div data-set="test-var" data-value="Test Value"></div>' +
		'<div data-set="test:test-var" data-value="Test Value"></div>' +
		'<div data-set="test-arr[]" data-value="One"></div>' +
		'<div data-set="test-arr[]" data-value="Two"></div>' +
		'<div data-set="test-arr[]" data-value="Three"></div>'
	);

	Wee.$setVars();

	assert.strictEqual(Wee.$get('test-var'), 'Test Value', 'Meta variable "test-var" was set correctly.');
	assert.strictEqual(Wee.$get('test:test-var'), 'Test Value', 'Namespaced meta variable "test:test-var" was set correctly.');
	assert.deepEqual(Wee.$get('test-arr'), ['One', 'Two', 'Three'], 'Meta array "test-arr" was set correctly.');
});

// Method: $setRef()

QUnit.module('$setRef');

QUnit.test('set', 1, function(assert) {
	Wee.$html('#wee', '<div data-ref="testElement">1</div>');

	Wee.$setRef();

	assert.strictEqual(Wee.$text('ref:testElement'), '1', 'Reference element was successfully selected.');
});