/* global QUnit */

QUnit.module('Data');

// Method: data.request(opt)

QUnit.test('Request JSON', 1, function(assert) {
	var done = assert.async();

	Wee.data.request({
		url: 'sample.json',
		json: true,
		success: function(data) {
			assert.strictEqual(data.name, 'Wee', 'JSON data requested successfully.');
			done();
		}
	});
});

QUnit.test('Request JSON & Parse', 1, function(assert) {
	var done = assert.async();

	Wee.data.request({
		url: 'sample.json',
		json: true,
		template: '{{ name }}',
		success: function(data) {
			assert.strictEqual(data, 'Wee', 'JSON data requested and parsed successfully.');
			done();
		}
	});
});

// Method: data.parse(str, obj, opt)

QUnit.test('Parse Template', 8, function(assert) {
	var data = {
		firstName: 'Keith',
		lastName: 'Roberts',
		married: false,
		citizen: true,
		pets: [
			'dog',
			'cat',
			'turtle'
		],
		children: [
			{
				firstName: 'Tim',
				lastName: 'Roberts'
			},
			{
				firstName: 'Kathy',
				lastName: 'Jackson'
			}
		]
	};

	assert.strictEqual(Wee.data.parse('{{firstName}}', data), 'Keith', 'Single variable parsed successfully.');

	assert.strictEqual(Wee.data.parse('{{firstName}}', {}), '', 'Unavailable variable cleared successfully.');

	assert.strictEqual(Wee.data.parse('{{firstName || Keith}}', {}), 'Keith', 'Variable fallback output successfully.');

	assert.strictEqual(Wee.data.parse('{{firstName}} {{lastName}}', data), 'Keith Roberts', 'Two variables parsed successfully.');

	assert.strictEqual(Wee.data.parse('{{#children|notEmpty}}Has children{{/children|notEmpty}}', data), 'Has children', 'Children exist.');

	assert.strictEqual(Wee.data.parse('{{#cousins|notEmpty}}Has cousins{{/cousins|notEmpty}}', data), '', 'There are no cousins.');

	assert.strictEqual(Wee.data.parse('{{#cousins|empty}}No cousins{{/cousins|empty}}', data), 'No cousins', 'There are no cousins.');

	assert.strictEqual(Wee.data.parse('<ul>{{#children}}<li>{{firstName}}</li>{{/children}}</ul>', data), '<ul><li>Tim</li><li>Kathy</li></ul>', 'Child variables parsed successfully.');
});