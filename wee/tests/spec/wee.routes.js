/* global QUnit */

QUnit.module('Routes');

// Method: routes.uri(val)

QUnit.test('URI data', 4, function(assert) {
	var uriData = {
		path: '/segment/value',
		query: {
			key: 'val'
		},
		hash: 'test'
	};

	assert.strictEqual(Wee.routes.uri().path, '/assets/wee/tests/index.html', 'Default URI path is set correctly.');
	assert.strictEqual(Wee.routes.uri().hash, '', 'Default URI hash is set correctly.');
	assert.deepEqual(Wee.routes.uri(uriData), uriData, 'URI data set correctly.');
	assert.deepEqual(Wee.routes.uri(), uriData, 'URI data is still set correctly.');
});

// Method: routes.path(val, opt)

QUnit.test('set path', 1, function(assert) {
	assert.strictEqual(Wee.routes.path('/segment/value'), '/segment/value', 'Path was set to "/segment/value" correctly.');
});

QUnit.test('get set path', 1, function(assert) {
	Wee.routes.path('/segment/value');

	assert.strictEqual(Wee.routes.path(), '/segment/value', 'Path is still set to "/segment/value" correctly.');
});

// Method: routes.segments(i)

QUnit.test('get all segments', function(assert) {
	Wee.routes.path('/segment/value');

	assert.propEqual(Wee.routes.segments(), ['segment', 'value'], 'Segment array is set correctly.');
});

// Method: routes.map(routes, init)

QUnit.test('get mapped routes', function(assert) {
	assert.propEqual(Wee.routes.map(), {}, 'There are currently no mapped routes.');
});

QUnit.test('map routes', 1, function(assert) {
	assert.propEqual(Wee.routes.map({
		$root: function() {}
	}), {
		$root: function() {}
	}, 'The route was correctly mapped.');
});

// Method: routes.run(opt)

QUnit.test('run routes', function(assert) {
	Wee.routes.map({
		'$any': function() {
			return 'any';
		}
	});

	assert.strictEqual(Wee.routes.run(), undefined, 'Any route executed successfully.');
});

QUnit.test('run routes', function(assert) {
	Wee.routes.run({
		path: '/test/route',
		routes: {
			'test': {
				'route': function() {
					assert.ok(true, true, 'Specific route executed successfully.');
				}
			}
		}
	});
});