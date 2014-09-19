// path(val)

module('routes');

test('get path', function() {
	strictEqual(Wee.routes.path(), '/index.html', 'Current path is correctly set to "/index.html".');
});

test('set path', function() {
	strictEqual(Wee.routes.path('/segment/value'), '/segment/value', 'Path was correctly set to "/segment/value".');
});

test('get set path', function() {
	strictEqual(Wee.routes.path(), '/segment/value', 'Path is still correctly set to "/segment/value".');
});

// map(routes, init)

test('get mapped routes', function() {
	propEqual(Wee.routes.map(), {}, 'There are currently no mapped routes.');
});

test('map routes', function() {
	propEqual(Wee.routes.map({
		$root: function() {}
	}), {
		$root: function() {}
	}, 'There route was correctly mapped.');
});

// segments(i)

test('get all segments', function() {
	propEqual(Wee.routes.segments(), ['segment', 'value'], 'Segment array is correctly set.');
});

// run(opt)

// test('run routes', function() {
// 	propEqual(Wee.routes.run(), , 'Routes were correctly evaluated.');
// });