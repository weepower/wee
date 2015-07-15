define(function(require) {
	var registerSuite = require('intern!object'),
		assert = require('intern/chai!assert'),
		Wee = require('Wee');

	registerSuite({
		'type': function() {
			var type = Wee.$type('Wee');

			assert.equal(type, 'string',
				'Type correctly evaluated as a string.'
			);
		}
	});
});