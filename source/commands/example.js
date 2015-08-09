(function() {
	'use strict';

	module.exports = function(config) {
		console.log('Options');
		console.log(config.options);

		console.log('Arguments');
		console.log(config.args);

		console.log('Project');
		console.log(config.project.name);
	};
})();