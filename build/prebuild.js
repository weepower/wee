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
 * @param {*} breakpoint
 * @param {*} count
 */
const buildBreakpoint = (breakpoint, count) => `@${breakpoint} { html { font-family: '${count}'; } }\n`;

/**
 * Create the responsive.scss file required for $screen
 * to work properly
 *
 * @param {*} breakpoints
 */
const createResponsiveFile = (breakpoints) => {
    let count = 2;
    let result = '/* stylelint-disable */\n\n';

    Object.keys(breakpoints).forEach((breakpoint) => {
        result += buildBreakpoint(breakpoint, count);
        count++;
    });

    if (! fs.existsSync(paths.temp)) {
        fs.mkdirSync(paths.temp);
    }

    fs.writeFileSync(path.resolve(paths.temp, 'responsive.scss'), result, 'utf-8');
};

/**
 * Create an scss file with all of the component imports
 *
 * @param {Array} files - an array of file paths
 */
const createComponentsFile = (files) => {
    let result = '/* stylelint-disable */\n\n';

    files.forEach((file) => {
        result += `@import "${file}";\n`;
    });

    fs.writeFileSync(path.resolve(paths.temp, 'components.scss'), result, 'utf-8');
};

// Create temp components.scss file
createComponentsFile(glob.sync(`${paths.components}/**/*.scss`));

// Create temp responsive.scss file
createResponsiveFile(config.style.breakpoints);
