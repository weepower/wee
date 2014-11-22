module('Assets');

// Method: assets.root(val)

test('Set Root', 1, function() {
	Wee.assets.root('http://assets.weepower.com');

	strictEqual(Wee.assets.root(), 'http://assets.weepower.com', 'Asset root set successfully.');
});

// Method: assets.load(conf)



// Method: assets.replace(conf)



// Method: assets.remove(files)



// Method: aseets.ready(group, opt, poll)

