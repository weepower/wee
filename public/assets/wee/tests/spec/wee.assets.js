/* global QUnit */

QUnit.module('Assets');

// Method: assets.root(val)

QUnit.test('set root', 1, function(assert) {
	Wee.assets.root('https://assets.weepower.com');

	assert.strictEqual(Wee.assets.root(), 'https://assets.weepower.com', 'Asset root set successfully.');
});

// Method: assets.load(conf)

// TODO

// Method: assets.replace(conf)

// TODO

// Method: assets.remove(files)

// TODO

// Method: aseets.ready(group, opt, poll)

// TODO