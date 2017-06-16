const glob = require('glob');
const fs = require('fs-extra');
const paths = require('./paths');
const chalk = require('chalk');

// Declare start of image compression
console.log(chalk.underline.magenta('\nCopying Fonts\n'));

glob.sync(paths.fonts + '/**/*.{svg,otf,ttf,woff,woff2,eot}').forEach(file => {
	let segments = file.split('/');
	let destination = '/' + segments.slice(segments.indexOf('fonts') + 1).join('/');

	fs.copy(file, paths.output.fonts + destination, error => {
		if (error) {
			return console.log(chalk.red('Error: ') + error.message);
		}

		console.log(chalk.magenta('Copied: ') + '/fonts' + destination);
	});
});