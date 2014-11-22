module('Screen');

// Method: screen.size()

test('Get Size', 1, function() {
	strictEqual(Wee.screen.size(), 5, 'Screen size is properly returning 5.');
});

// Method: screen.map(sets)

// TODO