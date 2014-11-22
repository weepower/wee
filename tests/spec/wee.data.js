module('Data');

// Method: data.request(opt)

asyncTest('Request JSON', 1, function() {
	Wee.data.request({
		url: 'testem.json',
		json: true,
		success: function(data) {
			strictEqual(data.framework, 'qunit', 'JSON data requested successfully.');
			start();
		}
	});
});

asyncTest('Request JSON & Parse', 1, function() {
	Wee.data.request({
		url: 'testem.json',
		json: true,
		template: '{{ framework }}',
		success: function(data) {
			strictEqual(data, 'qunit', 'JSON data requested and parsed successfully.');
			start();
		}
	});
});

// Method: data.parse(str, obj, opt)

test('Parse Template', 3, function() {
	strictEqual(Wee.data.parse('{{ name }}', {name: 'Keith'}), 'Keith', 'Single variable parsed successfully.');

	strictEqual(Wee.data.parse('{{ name }}', {}), '', 'Unavailable variable cleared successfully.');

	strictEqual(Wee.data.parse('{{ name || Keith }}', {}), 'Keith', 'Variable fallback output successfully.');
});