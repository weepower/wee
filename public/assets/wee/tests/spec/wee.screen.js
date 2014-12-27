/* global QUnit */

QUnit.module('Screen');

// Method: screen.size()

QUnit.test('get size', 1, function(assert) {
	assert.strictEqual(Wee.screen.size(), 5, 'Screen size returned 5 successfully.');
});

// Method: screen.map(val)

QUnit.test('map events', 2, function(assert) {
	assert.strictEqual(Wee.screen.map({
		size: 1,
		callback: function() {}
	}), undefined, 'Single event mapped successfully.');

	assert.strictEqual(Wee.screen.map([{
		size: 1,
		callback: function() {}
	}, {
		size: 2,
		callback: function() {}
	}]), undefined, 'Multiple events mapped successfully.');
});