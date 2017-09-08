const glob = require('glob');
const fs = require('fs-extra');
const paths = require('../paths');
const chalk = require('chalk');
const log = require('../utils').log;

// Declare start of image compression
log.heading('Copying Fonts', 'magenta');

glob.sync(paths.fonts + '/**/*.{svg,otf,ttf,woff,woff2,eot}').forEach(file => {
	let segments = file.split('/');
	let destination = '/' + segments.slice(segments.indexOf('fonts') + 1).join('/');

	fs.copy(file, paths.output.fonts + destination, error => {
		if (error) {
			return log.error('Error: ' + error.message);
		}

		log.message('Copied: /fonts' + destination, 'magenta');
	});
});