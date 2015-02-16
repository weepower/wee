/* global QUnit */

QUnit.module('View');

// Method: view.render(temp, data, opt)

QUnit.test('render template', 8, function(assert) {
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

	assert.strictEqual(Wee.view.render('{{ firstName }}', data), 'Keith', 'Single variable parsed successfully.');

	assert.strictEqual(Wee.view.render('{{firstName}}', {}), '', 'Unavailable variable cleared successfully.');

	assert.strictEqual(Wee.view.render('{{firstName || Keith}}', {}), 'Keith', 'Variable fallback output successfully.');

	assert.strictEqual(Wee.view.render('{{firstName}} {{lastName}}', data), 'Keith Roberts', 'Two variables parsed successfully.');

	assert.strictEqual(Wee.view.render('{{#children|notEmpty}}Has children{{/children}}', data), 'Has children', 'Children exist.');

	assert.strictEqual(Wee.view.render('{{#cousins|notEmpty}}Has cousins{{/cousins}}', data), '', 'There are no cousins.');

	assert.strictEqual(Wee.view.render('{{#cousins|isEmpty}}No cousins{{/cousins}}', data), 'No cousins', 'There are no cousins.');

	assert.strictEqual(Wee.view.render('<ul>{{#children}}<li>{{firstName}}</li>{{/children}}</ul>', data), '<ul><li>Tim</li><li>Kathy</li></ul>', 'Child variables parsed successfully.');
});

// Method: view.addFilter(a, b)

QUnit.test('render filter', 1, function(assert) {
	Wee.view.addFilter('range', function(offset, limit) {
		if (! this.empty) {
			var val = this.val;

			if (Wee.$isFunction(val)) {
				val = val();
			}

			if (Array.isArray(val)) {
				val = val.filter(function(el, i) {
					return i >= offset && i < limit;
				});
			} else if (Wee.$isObject(val)) {
				Object.keys(val).forEach(function(key, i) {
					if (i < offset || i >= limit) {
						delete val[key];
					}
				});
			} else {
				val = val.toString().slice(offset, limit);
			}

			this.data[this.tag] = val;
		}
	});

	var data = {
		numbers: [
			1,
			2,
			3,
			4,
			5
		]
	};

	assert.strictEqual(Wee.view.render('{{#numbers|range(2, 4)}}{{.}}{{/numbers}}', data), '34', 'Template parsed successfully.');
});

// Method: view.addHelper(a, b)

QUnit.test('render helper', 1, function(assert) {
	Wee.view.addHelper('upper', function() {
		return this.val.toUpperCase();
	});

	assert.strictEqual(Wee.view.render('{{name|upper}}', {name: 'Chris'}), 'CHRIS', 'Template parsed successfully.');
});

// Method: view.addPartial(a, b)

QUnit.test('render partial', 1, function(assert) {
	Wee.view.addPartial('partial', '123');
	Wee.view.addPartial('partial2', '456');

	assert.strictEqual(Wee.view.render('{{> partial}}{{> partial}}{{> partial2}}', {}), '123123456', 'Template parsed successfully.');
});