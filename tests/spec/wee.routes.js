module('Routes');

// Method: routes.path(val, opt)

test('Set Path', 1, function() {
	strictEqual(Wee.routes.path('/segment/value'), '/segment/value', 'Path was correctly set to "/segment/value".');
});

test('Get Set Path', 1, function() {
	Wee.routes.path('/segment/value');
	strictEqual(Wee.routes.path(), '/segment/value', 'Path is still correctly set to "/segment/value".');
});

// Method: routes.segments(i)

// test('get all segments', function() {
// 	// Wee.routes.path('/segment/value');
// 	// propEqual(Wee.routes.segments(), ['segment', 'value'], 'Segment array is correctly set.');
// });

// Method: routes.query(key)

// test('get query', function() {
// 	//propEqual(Wee.routes.query(), 'test', 'Query is correctly set.');
// });

// Method: routes.hash(val)

// test('get hash', function() {
// 	//propEqual(Wee.routes.hash(), 'test', 'Hash is correctly set.');
// });

// Method: routes.map(routes, init)

// test('get mapped routes', function() {
// 	//propEqual(Wee.routes.map(), {}, 'There are currently no mapped routes.');
// });

test('Map Routes', 1, function() {
	propEqual(Wee.routes.map({
		$root: function() {}
	}), {
		$root: function() {}
	}, 'The route was correctly mapped.');
});

// Method: routes.run(opt)

test('Run Routes', function() {
	Wee.routes.run({
		path: '/test/route',
		routes: {
			'test': {
				'route': function() {
					ok(true, true, 'Route executed successfully.');
				}
			}
		}
	});
});