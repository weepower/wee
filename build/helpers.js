/**
 * Calculate breakpoints with offset included
 *
 * @param {Object} breakpoints
 * @param {number} offset
 * @returns {Object}
 */
const calcBreakpoints = (breakpoints, offset) => {
	let breaks = { ...breakpoints };

	for (let breakpoint in breaks) {
		breaks[breakpoint] = breakpoints[breakpoint] - offset;
	}

	return breaks;
}

module.exports = {
    calcBreakpoints,
};