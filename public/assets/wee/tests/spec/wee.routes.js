/* global QUnit */

QUnit.module('Routes');

// Method: routes.uri(val, opt)

QUnit.test('URI Data', 4, function(assert) {
	var uriData = {
		path: '/segment/value',
		query: {
			key: 'val'
		},
		hash: 'test'
	};

	assert.strictEqual(Wee.routes.uri().path, '/assets/wee/tests/index.html', 'Default URI path is correctly set.');
	assert.strictEqual(Wee.routes.uri().hash, '', 'Default URI hash is correctly set.');
	assert.deepEqual(Wee.routes.uri(uriData), uriData, 'URI data correctly set.');
	assert.deepEqual(Wee.routes.uri(), uriData, 'URI data is still correctly set.');
});

// Method: routes.path(val, opt)

QUnit.test('Set Path', 1, function(assert) {
	assert.strictEqual(Wee.routes.path('/segment/value'), '/segment/value', 'Path was correctly set to "/segment/value".');
});

QUnit.test('Get Set Path', 1, function(assert) {
	Wee.routes.path('/segment/value');

	assert.strictEqual(Wee.routes.path(), '/segment/value', 'Path is still correctly set to "/segment/value".');
});

// Method: routes.segments(i)

QUnit.test('get all segments', function(assert) {
	Wee.routes.path('/segment/value');

	assert.propEqual(Wee.routes.segments(), ['segment', 'value'], 'Segment array is correctly set.');
});

// Method: routes.map(routes, init)

QUnit.test('get mapped routes', function(assert) {
	assert.propEqual(Wee.routes.map(), {}, 'There are currently no mapped routes.');
});

QUnit.test('Map Routes', 1, function(assert) {
	assert.propEqual(Wee.routes.map({
		$root: function() {}
	}), {
		$root: function() {}
	}, 'The route was correctly mapped.');
});

// Method: routes.run(opt)

QUnit.test('Run Routes', function(assert) {
	Wee.routes.run({
		path: '/test/route',
		routes: {
			'test': {
				'route': function() {
					assert.ok(true, true, 'Route executed successfully.');
				}
			}
		}
	});
});