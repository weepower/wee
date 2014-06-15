// $env(obj, def)

module('$env');

test('default', function() {
	strictEqual(Wee.$env(), 'local', 'Default environment is correctly set to "local".');
});

test('settings', function() {
	Wee.$env({
		prod: 'www.weepower.com',
		stage: 'www.weepower.stage'
	}, 'here');

	strictEqual(Wee.$env(), 'here', 'Default environment is correctly set to "here".');
});

// $get(key, def, set, opt)
// $set(key, val, opt)
// $push(key, val)

module('$get/$set/$push');

test('get empty', function() {
	strictEqual(Wee.$get('var-123'), null, 'Variable "var-123" is currently null.');
	strictEqual(Wee.$get('123 var'), null, 'Variable "123 var" is currently null.');
});

test('get with default string', function() {
	strictEqual(Wee.$get('var-123', 'string'), 'string', 'Variable "var-123" is returned as the default "string".');
	strictEqual(Wee.$get('var-123'), null, 'Variable "var-123" is still correctly set to null.');
	strictEqual(Wee.$get('cont:var-123', 'string'), 'string', 'Variable "var-123" is returned as the default "string" in the "cont" namespace.');
	strictEqual(Wee.$get('123 var', 'Testing 123'), 'Testing 123', 'Variable "123 var" is returned as the default "Testing 123".');
});

test('set string', function() {
	strictEqual(Wee.$set('var-123', 'string'), 'string', 'Variable "var-123" was set to "string".');
	strictEqual(Wee.$set('cont:var-123', 'string'), 'string', 'Variable "var-123" was set to "string" in the "cont" namespace.');
	strictEqual(Wee.$set('123 var', 'Testing 123'), 'Testing 123', 'Variable "var-123" was set to "Testing 123".');
});

test('get string', function() {
	strictEqual(Wee.$get('var-123'), 'string', 'Variable "var-123" is correctly set to "string".');
	strictEqual(Wee.$get('cont:var-123'), 'string', 'Variable "var-123" is correctly set to "string" in the "cont" namespace.');
	strictEqual(Wee.$get('123 var'), 'Testing 123', 'Variable "123 var" is correctly set to "Testing 123".');
});

test('get with set default string', function() {
	strictEqual(Wee.$get('set-var-123', 'string', true), 'string', 'Variable "set-var-123" is set to the default "string".');
	strictEqual(Wee.$get('set-var-123'), 'string', 'Variable "set-var-123" is correctly set to "string".');
});

// $setVars()

module('$setVars');

test('get', function() {
	Wee.$setVars();

	strictEqual(Wee.$get('test-var'), 'Test Value', 'Meta variable "test-var" was set correctly.');
});

// $exec(fn, opt)



// $isArray(obj)

module('$isArray');

test('check if string is array', function() {
	strictEqual(Wee.$isArray('string'), false, 'Variable "string" is not an array.');
});

test('check if function is array', function() {
	strictEqual(Wee.$isArray(function test() {}), false, 'Function "test()" is not an array.');
});

test('check if object is array', function() {
	strictEqual(Wee.$isArray('{string: "string"}'), false, 'Object "string" is not an array.');
});

test('check if array is array', function() {
	ok(Wee.$isArray(['string']), 'Array "[\'string\']" is an array.');
});

// $isArray(obj)

module('$isArray');

test('check different types against array', function() {
	strictEqual(Wee.$isArray('string'), false, 'Variable "string" is not an array.');
	strictEqual(Wee.$isArray(function test() {}), false, 'Function "test()" is not an array.');
	strictEqual(Wee.$isArray({string: 'string'}), false, 'Object "string" is not an array.');
	ok(Wee.$isArray(['string']), 'Array "[\'string\']" is an array.');
});

// $inArray(obj, el)

module('$inArray');

test('check if array is array', function() {
	strictEqual(Wee.$isArray(['string']), true, 'Array "[\'string\']" is an array.');
});

// $toArray(obj)

module('$toArray');

test('convert string to array', function() {
	deepEqual(Wee.$toArray('string'), ['string'], 'String "string" is now ["string"].');
});
test('convert array to array', function() {
	deepEqual(Wee.$toArray(['string']), ['string'], 'Array ["string"] is still ["string"].');
});

// $isString(obj)

module('$isString');

test('check different types against string', function() {
	strictEqual(Wee.$isString(function test() {}), false, 'Function "test()" is not a string.');
	strictEqual(Wee.$isString({string: 'string'}), false, 'Object "string" is not a string.');
	strictEqual(Wee.$isString(['string']), false, 'Array "[\'string\']" is not a string.');
	ok(Wee.$isString('string'), 'Variable "string" is a string.');
});

// $isFunction(obj)

module('$isFunction');

test('check different types against function', function() {
	strictEqual(Wee.$isFunction('string'), false, 'Variable "string" is not a function.');
	strictEqual(Wee.$isFunction({string: 'string'}), false, 'Object "string" is not a function.');
	strictEqual(Wee.$isFunction(['string']), false, 'Array "[\'string\']" is not a function.');
	ok(Wee.$isFunction(function test() {}), 'Function "test()" is a function.');
});

// $isObject(obj)

module('$isObject');

test('check different types against object', function() {
	strictEqual(Wee.$isObject('string'), false, 'Variable "string" is not an object.');
	strictEqual(Wee.$isObject(function test() {}), false, 'Function "test()" is not an object.');
	strictEqual(Wee.$isObject(['string']), false, 'Array "[\'string\']" is not an object.');
	ok(Wee.$isObject({string: 'string'}), 'Object "string" is an object.');
});

// $getKeys(obj)

module('$getKeys');

test('check for properly set keys', function() {
	deepEqual(Wee.$getKeys({
		key1: 'val1',
		key2: 'val2',
		key3: 'val3'
	}), ['key1', 'key2', 'key3'], 'Object keys properly returned.');
});

// $serialize(obj)

module('$serialize');

test('check for properly serialized object', function() {
	strictEqual(Wee.$serialize({
		key1: 'val1',
		key2: 'val2',
		key3: 'val3'
	}), 'key1=val1&key2=val2&key3=val3', 'Object serialization properly returned.');
});

// $extend(obj, src, deep)



// $clone(obj)



// $(sel, context)



// $each(sel, fn)



// $setVars()



// $addClass(el, val)



// $removeClass(el, val)



// $css(sel, a, b)



// $html(el, val)



// $attr(el, key, val)



// $data(el, key, val)

