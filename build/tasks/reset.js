const fs = require('fs-extra');
const paths = require('../paths');
const utils = require('wee-core/utils');
const chalk = require('chalk');

fs.remove(paths.assets, err => {
	if (err) {
		utils.logError(err, 'error');
	}

	console.log(chalk.underline('Assets cleared'));
});