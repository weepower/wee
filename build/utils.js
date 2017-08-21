const chalk = require('chalk');

module.exports = {
	log: {
		heading(text, color = 'white') {
			console.log(chalk[color].underline(`\n${text}\n`));
		},
		error(text) {
			this.message('Error: ' + text, 'red');
		},
		message(text, prefixColor = 'white') {
			let segments = text.split(':');
			const prefix = segments.shift().trim();
			const message = segments.join(':').trim();

			console.log(chalk[prefixColor](prefix + ':') + ' ' + message);
		}
	}
};