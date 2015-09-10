define(function(require) {
	var registerSuite = require('intern!object'),
		assert = require('intern/chai!assert'),
		Wee = require('Wee');

	registerSuite({
		name: 'Example Suite',

		setup: function() {
			// Execute before suite starts
		},

		teardown: function() {
			// Execute after suite ends
		},

		beforeEach: function() {
			// Execute before each test
		},

		afterEach: function() {
			// Execute after each test
		},

		'Example Test': function() {
			var type = Wee.$type('Example');

			assert.equal(type, 'string',
				'Type of value "Example" is a string.'
			);
		}
	});
});