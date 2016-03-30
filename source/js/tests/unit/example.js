define(function(require) {
	var registerSuite = require('intern!object'),
		assert = require('intern/chai!assert');

	require('Script');

	registerSuite({
		name: 'Test Suite',

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

		'Type Test': function() {
			var type = Wee.$type('Example');

			assert.equal(type, 'string',
				'The type of value "Example" should equal "string"'
			);
		}
	});
});