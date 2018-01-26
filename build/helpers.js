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
	const firstEntry = Object.keys(entries)[0];
	let result = {};

	Object.keys(entries).forEach(entry => {
		result[entry] = getPaths(entries[entry]);
	});

	result[firstEntry] = [
		...result[firstEntry],
		`${paths.temp}/responsive.scss`,
		`${paths.styles}/global.scss`,
		`${paths.styles}/print.scss`,
		...glob.sync(`${paths.components}/**/*.scss`),
	];

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
