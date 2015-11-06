Wee.fn.make('todo', {
	init: function() {
		$('ref:nav').after($.first('ref:template').text);

		Wee.app.make('items', {
			view: 'ref:todo',
			model: {
				todo: [
					{
						label: 'Download and run Wee',
						done: true
					},
					{
						label: 'Explore the welcome module'
					},
					{
						label: 'Configure wee.json'
					},
					{
						label: 'Run node wee reset'
					}
				]
			}
		});

		$('ref:toggle').on('click', function() {
			var id = $(this).data('id'),
				done = Wee.items.$get('todo.' + id + '.done');

			Wee.items.$set('todo.' + id + '.done', done ? false : true);
		}, {
			delegate: 'ref:todo'
		});
	}
});

Wee.routes.map({
	'$root': 'todo'
}, true);