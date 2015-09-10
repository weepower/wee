/* global chalk */

(function() {
	'use strict';

	module.exports = function(config) {
		var heading = chalk.bold.underline.cyan;

		console.log(heading('Project'));
		console.log(config.project.name);
		console.log();

		console.log(heading('Options'));
		console.dir(config.options, {
			colors: true
		});
		console.log();

		console.log(heading('Arguments'));
		console.dir(config.args, {
			colors: true
		});
		console.log();
	};
})();