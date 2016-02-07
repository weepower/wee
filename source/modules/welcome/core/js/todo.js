Wee.fn.make('todo', {
	init: function() {
		var app = Wee.app.make('todo', {
			view: 'welcome.todo',
			target: 'ref:todo',
			model: [
				{
					label: 'Download and run Wee',
					done: true
				},
				{
					label: 'Explore the guide and welcome modules'
				},
				{
					label: 'Reset your project to a blank slate'
				},
				{
					label: 'Customize wee.json'
				},
				{
					label: 'Build something incredible'
				}
			]
		});

		$('ref:toggle').on('click', function() {
			var id = $(this).data('id'),
				val = app.$get(id + '.done') ? false : true;

			app.$set(id + '.done', val);
		});
	}
});