/* global chalk */

(function() {
	'use strict';

	module.exports = function(config) {
		var title = chalk.bold.underline.cyan;

		console.log(title('Project'));
		console.log(config.project.name);
		console.log();

		console.log(title('Options'));
		console.dir(config.options, {
			colors: true
		});
		console.log();

		console.log(title('Arguments'));
		console.dir(config.args, {
			colors: true
		});
		console.log();
	};
})();