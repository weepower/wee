const webpack = require('webpack');
const prod = process.env.NODE_ENV === 'production';
const paths = require('./paths');
const glob = require('glob');
const config = require(paths.project + '/wee.json');

/**
 * Determine base path of provided file path
 *
 * @param {string} path
 * @returns {string}
 */
function getBasePath(path) {
	return path.split('/')[0] === '.' ? paths.project : paths.scripts;
}

/**
 * Find and return file path
 *
 * @param {string|Array} filePath
 * @returns {Array}
 */
function getPaths(filePaths) {
	if (Array.isArray(filePaths)) {
		let paths = [];

		filePaths.forEach(filePath => {
			paths = paths.concat(glob.sync(`${getBasePath(filePath)}/${filePath}`));
		});

		return paths;
	}

	return glob.sync(`${getBasePath(filePaths)}/${filePaths}`);
}

/**
 * Process entries from wee.json
 *
 * @param {Object} entries
 * @returns {Object}
 */
function buildEntries(entries) {
	let result = {};

	Object.keys(entries).forEach(entry => {
		let paths = getPaths(entries[entry]);

		// If single entry point, extract from array
		if (paths.length === 1) {
			paths = paths[0];
		}

		result[entry] = paths;
	});

	return result;
}

module.exports = {
	entry: buildEntries(config.script.entry),
	output: {
		filename: '[name].bundle.js',
		path: paths.output.scripts,
		pathinfo: prod === false
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.vue/,
				loader: 'vue-loader'
			},
			{
				test: /\.js/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}
		]
	}
};