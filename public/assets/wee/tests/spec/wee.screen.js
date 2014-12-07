/* global QUnit */

QUnit.module('Screen');

// Method: screen.size()

QUnit.test('Get Size', 1, function(assert) {
	assert.strictEqual(Wee.screen.size(), 5, 'Screen size is properly returning 5.');
});

// Method: screen.map(sets)

// TODO