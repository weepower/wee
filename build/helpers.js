const paths = require('./paths');
const glob = require('glob');

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

/**
 * Calculate breakpoints with offset included
 *
 * @param {Object} breakpoints
 * @param {number} offset
 * @returns {Object}
 */
function calcBreakpoints(breakpoints, offset) {
	let breaks = { ...breakpoints };

	for (let breakpoint in breaks) {
		breaks[breakpoint] = breakpoints[breakpoint] - offset;
	}

	return breaks;
}

module.exports = {
	calcBreakpoints,
	buildEntries
}
