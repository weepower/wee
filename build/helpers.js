const paths = require('./paths');
const glob = require('glob');

/**
 * Determine base path of provided file path
 *
 * @param {string} path
 * @returns {string}
 */
function getBasePath(path, type) {
	return path.split('/')[0] === '.' ? paths.project : paths[type];
}

/**
 * Find and return file path
 *
 * @param {string|Array} filePath
 * @returns {Array}
 */
function getPaths(filePaths, type) {
	if (Array.isArray(filePaths)) {
		let paths = [];

		filePaths.forEach(filePath => {
			paths = paths.concat(glob.sync(`${getBasePath(filePath, type)}/${filePath}`));
		});

		return paths;
	}

	return glob.sync(`${getBasePath(filePaths, type)}/${filePaths}`);
}

function buildEntry(entries, type) {
	let result = {};

	Object.keys(entries).forEach(entry => {
		let paths = getPaths(entries[entry], type);

		// If single entry point, extract from array
		if (paths.length === 1) {
			paths = paths[0];
		}

		result[entry] = paths;
	});

	return result;
}

/**
 * Process entries from wee.json
 *
 * @param {Object} entries
 * @returns {Object}
 */
function buildEntries(scripts, styles) {
	return {
		...buildEntry(scripts, 'scripts'),
		...buildEntry(styles, 'styles'),
	};
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
