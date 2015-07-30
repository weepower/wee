define(function(require) {
	var registerSuite = require('intern!object'),
		assert = require('intern/chai!assert'),
		Wee = require('Wee');

	registerSuite({
		name: 'Example Suite',

		setup: function() {
			// Executes before suite starts
		},

		teardown: function() {
			// Executes after suite ends
		},

		beforeEach: function() {
			// Executes before each test
		},

		afterEach: function() {
			// Executes after each test
		},

		'Example Test': function() {
			var type = Wee.$type('Wee');

			assert.equal(type, 'string',
				'Type value "string" is a string.'
			);
		}
	});
});