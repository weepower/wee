const fs = require('fs-extra');
const paths = require('./paths');
const utils = require('wee-core/utils');

fs.remove(paths.root + '/assets', err => {
	if (err) {
		utils.logError(err, 'error');
	}

	console.log('assets cleared');
});