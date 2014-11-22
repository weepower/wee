// Method: fn.make(name, pub, priv)

module('fn.make');

test('create', 1, function() {
	Wee.fn.make('controller', {
		test: function() {
			return 'response';
		}
	});

	strictEqual(Wee.controller.test(), 'response', 'Controller function response correctly returned.');
});

// Method: fn.extend(a, b, c)

module('fn.extend');

test('extend', 1, function() {
	Wee.fn.extend('controller', {
		test2: function() {
			return 'response';
		}
	});

	strictEqual(Wee.controller.test2(), 'response', 'Controller extended successfully.');
});

// Method: $env(obj, def)

module('$env');

test('default', 1, function() {
	strictEqual(Wee.$env(), 'local', 'Default environment is correctly set to "local".');
});

test('settings', 1, function() {
	Wee.$env({
		prod: 'www.weepower.com',
		stage: 'www.weepower.stage'
	}, 'here');

	strictEqual(Wee.$env(), 'here', 'Default environment is correctly set to "here".');
});

// Method: $envSecure(url)

module('$envSecure');

test('current', 1, function() {
	strictEqual(Wee.$envSecure(), false, 'The environment is correctly identified as insecure.');
});

test('override', 1, function() {
	ok(Wee.$envSecure('https://www.weepower.com'), 'The environment is correctly identified as secure.');
});

// Method: $get(key, def, set, opt)
// Method: $set(key, val, opt)
// Method: $push(key, a, b)

module('$get/$set/$push');

test('get empty', 2, function() {
	strictEqual(Wee.$get('var-123'), null, 'Variable "var-123" is currently null.');
	strictEqual(Wee.$get('123 var'), null, 'Variable "123 var" is currently null.');
});

test('get with default string', 4, function() {
	strictEqual(Wee.$get('var-123', 'string'), 'string', 'Variable "var-123" is returned as the default "string".');
	strictEqual(Wee.$get('var-123'), null, 'Variable "var-123" is still correctly set to null.');
	strictEqual(Wee.$get('cont:var-123', 'string'), 'string', 'Variable "var-123" is returned as the default "string" in the "cont" namespace.');
	strictEqual(Wee.$get('123 var', 'Testing 123'), 'Testing 123', 'Variable "123 var" is returned as the default "Testing 123".');
});

test('get with default string returned by callback', 1, function() {
	strictEqual(Wee.$get('var-123', function() {
		return 'string';
	}), 'string', 'Variable "var-123" is returned as the default "string".');
});

test('set string', 3, function() {
	strictEqual(Wee.$set('var-123', 'string'), 'string', 'Variable "var-123" was set to "string".');
	strictEqual(Wee.$set('cont:var-123', 'string'), 'string', 'Variable "var-123" was set to "string" in the "cont" namespace.');
	strictEqual(Wee.$set('123 var', 'Testing 123'), 'Testing 123', 'Variable "var-123" was set to "Testing 123".');
});

test('get string', 3, function() {
	strictEqual(Wee.$get('var-123'), 'string', 'Variable "var-123" is correctly set to "string".');
	strictEqual(Wee.$get('cont:var-123'), 'string', 'Variable "var-123" is correctly set to "string" in the "cont" namespace.');
	strictEqual(Wee.$get('123 var'), 'Testing 123', 'Variable "123 var" is correctly set to "Testing 123".');
});

test('get with set default string', 2, function() {
	strictEqual(Wee.$get('set-var-123', 'string', true), 'string', 'Variable "set-var-123" is set to the default "string".');
	strictEqual(Wee.$get('set-var-123'), 'string', 'Variable "set-var-123" is correctly set to "string".');
});

// Method: $exec(fn, opt)

module('$exec');

Wee.fn.make('execTest', {
	withParams: function(val) {
		return val;
	},
	withoutParams: function() {
		return 'value';
	}
});

test('callback', 1, function() {
	strictEqual(Wee.$exec(function() {
		return 'value';
	}), 'value', 'Simple callback was executed correctly.');
});

test('callback with argument', 1, function() {
	strictEqual(Wee.$exec(function(val) {
		return val;
	}, {
		args: ['value']
	}), 'value', 'Simple callback with argument was executed correctly.');
});

test('module callback', 1, function() {
	strictEqual(Wee.$exec('execTest:withoutParams'), 'value', 'Module callback was executed correctly.');
});

test('module callback', 1, function() {
	strictEqual(Wee.$exec('execTest:withoutParams', {
		args: ['value']
	}), 'value', 'Module callback with argument was executed correctly.');
});

// Method: $isArray(obj)

module('$isArray');

test('check different types against array', 4, function() {
	strictEqual(Wee.$isArray('string'), false, 'Variable "string" is not an array.');
	strictEqual(Wee.$isArray(function test() {}), false, 'Function "test()" is not an array.');
	strictEqual(Wee.$isArray({string: 'string'}), false, 'Object "string" is not an array.');
	ok(Wee.$isArray(['string']), 'Array "[\'string\']" is an array.');
});

// Method: $inArray(obj, el)

module('$inArray');

test('check if array is array', 1, function() {
	strictEqual(Wee.$isArray(['string']), true, 'Array "[\'string\']" is an array.');
});

// Method: $toArray(obj)

module('$toArray');

test('convert string to array', 1, function() {
	deepEqual(Wee.$toArray('string'), ['string'], 'String "string" is now ["string"].');
});
test('convert array to array', 1, function() {
	deepEqual(Wee.$toArray(['string']), ['string'], 'Array ["string"] is still ["string"].');
});

// Method: $isString(obj)

module('$isString');

test('check different types against string', 4, function() {
	strictEqual(Wee.$isString(function test() {}), false, 'Function "test()" is not a string.');
	strictEqual(Wee.$isString({string: 'string'}), false, 'Object "string" is not a string.');
	strictEqual(Wee.$isString(['string']), false, 'Array "[\'string\']" is not a string.');
	ok(Wee.$isString('string'), 'Variable "string" is a string.');
});

// Method: $isFunction(obj)

module('$isFunction');

test('check different types against function', 4, function() {
	strictEqual(Wee.$isFunction('string'), false, 'Variable "string" is not a function.');
	strictEqual(Wee.$isFunction({string: 'string'}), false, 'Object "string" is not a function.');
	strictEqual(Wee.$isFunction(['string']), false, 'Array "[\'string\']" is not a function.');
	ok(Wee.$isFunction(function test() {}), 'Function "test()" is a function.');
});

// Method: $isObject(obj)

module('$isObject');

test('check different types against object', 4, function() {
	strictEqual(Wee.$isObject('string'), false, 'Variable "string" is not an object.');
	strictEqual(Wee.$isObject(function test() {}), false, 'Function "test()" is not an object.');
	strictEqual(Wee.$isObject(['string']), false, 'Array "[\'string\']" is not an object.');
	ok(Wee.$isObject({string: 'string'}), 'Object "string" is an object.');
});

// Method: $getKeys(obj)

module('$getKeys');

test('check for properly set keys', 1, function() {
	deepEqual(Wee.$getKeys({
		key1: 'val1',
		key2: 'val2',
		key3: 'val3'
	}), ['key1', 'key2', 'key3'], 'Object keys properly returned.');
});

// Method: $serialize(obj)

module('$serialize');

test('check for properly serialized object', 1, function() {
	strictEqual(Wee.$serialize({
		key1: 'val1',
		key2: 'val2',
		key3: 'val3'
	}), 'key1=val1&key2=val2&key3=val3', 'Object serialization properly returned.');
});

// Method: $extend(obj, src, deep)

module('$extend');

test('extend shallow', 1, function() {
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

	deepEqual(Wee.$extend(obj, src), result, 'Objects merged at top level.');
});

test('extend deep', 1, function() {
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

	deepEqual(Wee.$extend(obj, src, true), result, 'Objects merged recursively.');
});

// Method: $merge(arr, arr2, dup)

module('$merge');

test('combine with duplicates', 1, function() {
	var arr = [1, 2, 3, 4],
		arr2 = [4, 5, 6],
		result = [1, 2, 3, 4, 4, 5, 6];

	deepEqual(Wee.$merge(arr, arr2), result, 'Arrays merged with duplicates remaining.');
});

test('combine and deduplicate', 1, function() {
	var arr = [1, 2, 3, 4],
		arr2 = [4, 5, 6];

	deepEqual(Wee.$merge(arr, arr2, true), [1, 2, 3, 4, 5, 6], 'Arrays merged with duplicates removed.');
});

// Method: $unique(arr)

module('$unique');

test('check for unique values', 1, function() {
	var arr = [1, 2, 3, 3, 4, 4, 5];

	deepEqual(Wee.$unique(arr), [1, 2, 3, 4, 5], 'Only unique elements were correctly returned.');
});

// Method: $(sel, context)

module('$');

test('select', 2, function() {
	Wee.$html('#qunit-fixture',
		'<div id="testing"></div>' +
		'<div class="testing"></div>'
	);

	strictEqual(Wee.$('#testing').length, 1, 'Element with ID "testing" was selected successfully.');
	strictEqual(Wee.$('.testing').length, 1, 'Element with class "testing" was selected successfully.');
});

// Method: $eq(sel, i, context)

module('$eq');

test('select index', 1, function() {
	Wee.$html('#qunit-fixture',
		'<div class="testing">1</div>' +
		'<div class="testing">2</div>' +
		'<div class="testing">3</div>'
	);

	var el = Wee.$eq('.testing', 1);

	strictEqual(Wee.$text(el), '2', 'Element with index 1 was selected successfully.');
});

// Method: $first(sel, context)

module('$first');

test('select first', 1, function() {
	Wee.$html('#qunit-fixture',
		'<div class="testing">1</div>' +
		'<div class="testing">2</div>' +
		'<div class="testing">3</div>'
	);

	var el = Wee.$first('.testing');

	strictEqual(Wee.$text(el), '1', 'First element was selected successfully.');
});

// Method: $each(sel, fn, opt)

module('$each');

test('iterate selection', 1, function() {
	Wee.$html('#qunit-fixture',
		'<div class="testing">1</div>' +
		'<div class="testing">2</div>' +
		'<div class="testing">3</div>'
	);

	var total = 0;

	Wee.$each('.testing', function(el) {
		total += parseInt(Wee.$text(el), 10);
	});

	strictEqual(total, 6, 'Elements successfully iterated.');
});

// Method: $map(sel, fn)

module('$map');

test('map selection', 1, function() {
	Wee.$html('#qunit-fixture',
		'<div class="testing">1</div>' +
		'<div class="testing">2</div>' +
		'<div class="testing">3</div>'
	);

	var values = Wee.$map('.testing', function(el) {
		return parseInt(Wee.$html(el), 10);
	});

	deepEqual(values, [1, 2, 3], 'Elements successfully iterated.');
});

// Method: $attr(sel, key, val)

module('$attr');

test('get', 1, function() {
	Wee.$attr('#qunit-fixture', 'test', 'value');

	strictEqual(Wee.$attr('#qunit-fixture', 'test'), 'value', 'Attribute "test" was set correctly.');
});

// Method: $data(sel, key, val)

module('$data');

test('get', 1, function() {
	Wee.$data('#qunit-fixture', 'test', 'value');

	strictEqual(Wee.$data('#qunit-fixture', 'test'), 'value', 'Data attribute "test" was set correctly.');
});

// Method: $setVars()

module('$setVars');

test('get', 3, function() {
	Wee.$html('#qunit-fixture',
		'<div data-set="test-var" data-value="Test Value"></div>' +
		'<div data-set="test:test-var" data-value="Test Value"></div>' +
		'<div data-set="test-arr[]" data-value="One"></div>' +
		'<div data-set="test-arr[]" data-value="Two"></div>' +
		'<div data-set="test-arr[]" data-value="Three"></div>'
	);

	Wee.$setVars();

	strictEqual(Wee.$get('test-var'), 'Test Value', 'Meta variable "test-var" was set correctly.');
	strictEqual(Wee.$get('test:test-var'), 'Test Value', 'Namespaced meta variable "test:test-var" was set correctly.');
	deepEqual(Wee.$get('test-arr'), ['One', 'Two', 'Three'], 'Meta array "test-arr" was set correctly.');
});

// Method: $setRef()

module('$setRef');

test('set', 1, function() {
	Wee.$html('#qunit-fixture', '<div data-ref="testElement">1</div>');

	Wee.$setRef();

	var el = Wee.$('ref:testElement');

	strictEqual(Wee.$text(el), '1', 'Reference element was successfully selected.');
});