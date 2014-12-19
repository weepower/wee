/* global QUnit */

QUnit.module('View');

// Method: vide.render(str, obj, opt)

QUnit.test('Render Template', 8, function(assert) {
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

	assert.strictEqual(Wee.view.render('{{firstName}}', data), 'Keith', 'Single variable parsed successfully.');

	assert.strictEqual(Wee.view.render('{{firstName}}', {}), '', 'Unavailable variable cleared successfully.');

	assert.strictEqual(Wee.view.render('{{firstName || Keith}}', {}), 'Keith', 'Variable fallback output successfully.');

	assert.strictEqual(Wee.view.render('{{firstName}} {{lastName}}', data), 'Keith Roberts', 'Two variables parsed successfully.');

	assert.strictEqual(Wee.view.render('{{#children|notEmpty}}Has children{{/children|notEmpty}}', data), 'Has children', 'Children exist.');

	assert.strictEqual(Wee.view.render('{{#cousins|notEmpty}}Has cousins{{/cousins|notEmpty}}', data), '', 'There are no cousins.');

	assert.strictEqual(Wee.view.render('{{#cousins|empty}}No cousins{{/cousins|empty}}', data), 'No cousins', 'There are no cousins.');

	assert.strictEqual(Wee.view.render('<ul>{{#children}}<li>{{firstName}}</li>{{/children}}</ul>', data), '<ul><li>Tim</li><li>Kathy</li></ul>', 'Child variables parsed successfully.');
});