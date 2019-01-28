const paths = require('./paths');

/**
 * Process the entries from the wee.config.js into something
 * chain webpack can consume
 *
 * @param {Config} config - the config object
 * @param {Object} entries - the object of entries to process
 * @param {String} type - the type of entries, e.g. 'styles' or 'scripts'
 */
const addEntries = (config, entries, type) => {
    Object.keys(entries).forEach((entry) => {
        const files = entries[entry];
        const entryConfig = config.entry(entry);
        const entryType = paths[type];

        if (Array.isArray(files)) {
            files.forEach(entry => entryConfig.add(`${entryType}/${entry}`));
        } else {
            entryConfig.add(`${entryType}/${files}`);
        }
    });
};

/**
 * Calculate breakpoints with offset included
 *
 * @param {Object} breakpoints
 * @param {number} offset
 * @returns {Object}
 */
const calcBreakpoints = (breakpoints, offset) => {
    const breaks = { ...breakpoints };

    Object.keys(breaks).forEach((breakpoint) => {
        breaks[breakpoint] = breakpoints[breakpoint] - offset;
    });

    return breaks;
};

module.exports = {
    calcBreakpoints,
    addEntries,
};