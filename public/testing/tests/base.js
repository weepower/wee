// $env(obj, def)

module('$env');

test('default', function() {
	equal(Wee.$env(), 'local', 'Default environment is correctly set to "local".');
});

test('settings', function() {
	Wee.$env({
		prod: 'www.weepower.com',
		stage: 'www.weepower.stage'
	}, 'here');

	equal(Wee.$env(), 'here', 'Default environment is correctly set to "here".');
});

// $setVars()

module('$setVars');

test('get', function() {
	Wee.$setVars();

	equal(Wee.$get('test-var'), 'Test Value', 'Meta variable "test-var" was set correctly.');
});

// $get(key, def, set, opt)
// $set(key, val, opt)

module('$get/$set');

test('get empty', function() {
	equal(Wee.$get('var-123'), null, 'Variable "var-123" is currently null.');
	equal(Wee.$get('123 var'), null, 'Variable "123 var" is currently null.');
});

test('get with default string', function() {
	equal(Wee.$get('var-123', 'string'), 'string', 'Variable "var-123" is returned as the default "string".');
	equal(Wee.$get('var-123'), null, 'Variable "var-123" is still correctly set to null.');
	equal(Wee.$get('cont:var-123', 'string'), 'string', 'Variable "var-123" is returned as the default "string" in the "cont" namespace.');
	equal(Wee.$get('123 var', 'Testing 123'), 'Testing 123', 'Variable "123 var" is returned as the default "Testing 123".');
});

test('set string', function() {
	equal(Wee.$set('var-123', 'string'), 'string', 'Variable "var-123" was set to "string".');
	equal(Wee.$set('cont:var-123', 'string'), 'string', 'Variable "var-123" was set to "string" in the "cont" namespace.');
	equal(Wee.$set('123 var', 'Testing 123'), 'Testing 123', 'Variable "var-123" was set to "Testing 123".');
});

test('get string', function() {
	equal(Wee.$get('var-123'), 'string', 'Variable "var-123" is correctly set to "string".');
	equal(Wee.$get('cont:var-123'), 'string', 'Variable "var-123" is correctly set to "string" in the "cont" namespace.');
	equal(Wee.$get('123 var'), 'Testing 123', 'Variable "123 var" is correctly set to "Testing 123".');
});

test('get with set default string', function() {
	equal(Wee.$get('set-var-123', 'string', true), 'string', 'Variable "set-var-123" is set to the default "string".');
	equal(Wee.$get('set-var-123'), 'string', 'Variable "set-var-123" is correctly set to "string".');
});