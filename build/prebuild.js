const fs = require('fs');
const path = require('path');
const glob = require('glob');
const paths = require('./paths');

// Config files
const config = require(`${paths.project}/wee.config.js`);
const packageJson = require(paths.packageJson);

// Update package.json
if (! packageJson.config) {
    packageJson.config = {};
}

// Update config properties in package.json to be used by npm scripts
packageJson.config.root = config.paths.root;
packageJson.config.source = config.paths.source;
packageJson.config.build = config.paths.build;

fs.writeFileSync(paths.packageJson, JSON.stringify(packageJson, null, 2));

/**
 * Build the breakpoint
 *
 * @param {String} breakpoint
 * @param {Number} count
 */
const buildBreakpoint = (breakpoint, count) => `@include ${breakpoint} { html { font-family: '${count}'; } }\n`;

/**
 * Create a mixin based on the provided breakpoint information
 *
 * @param {String} breakpoint
 * @param {Number} condition
 */
const buildMixin = (breakpoint, condition) => `@mixin ${breakpoint}() { @media (min-width: ${condition}px) { @content; } }\n`;

/**
 * Create the responsive.scss file required for $screen
 * to work properly
 *
 * @param {*} breakpoints
 */
const createResponsiveFiles = (breakpoints) => {
    let count = 2;
    const result = {
        responsive: '/* stylelint-disable */\n\n',
        mixins: '/* stylelint-disable */\n\n',
    };

    Object.keys(breakpoints).forEach((breakpoint) => {
        result.responsive += buildBreakpoint(breakpoint, count);
        result.mixins += buildMixin(breakpoint, breakpoints[breakpoint]);
        count++;
    });

    if (! fs.existsSync(paths.temp)) {
        fs.mkdirSync(paths.temp);
    }

    fs.writeFileSync(path.resolve(paths.temp, 'responsive.scss'), result.responsive, 'utf-8');
    fs.writeFileSync(path.resolve(paths.temp, 'mixins.scss'), result.mixins, 'utf-8');
};

// Create temp responsive.scss file
createResponsiveFiles(config.style.breakpoints);
