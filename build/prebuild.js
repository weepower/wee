const fs = require('fs-extra');
const glob = require('glob');
const paths = require('./paths');

// Config files
const config = fs.readJsonSync(paths.project + '/wee.json');
const packageJson = fs.readJsonSync(paths.packageJson);

// Update package.json
if (! packageJson.config) {
	packageJson.config = {};
}

// Update config properties in package.json to be used by npm scripts
packageJson.config.root = config.paths.root;
packageJson.config.source = config.paths.source;
packageJson.config.build = config.paths.build;
packageJson.config.tasks = `${config.paths.build}/tasks`;
fs.writeJsonSync(paths.packageJson, packageJson, { spaces: 2 });

/**
 * Build the breakpoint
 *
 * @param {*} breakpoint
 * @param {*} count
 */
function buildBreakpoint(breakpoint, count) {
	let html = `html { font-family: '${count}'; }`;

	return `@${breakpoint} { ${html} }\n`;
}

/**
 * Create the responsive.scss file required for $screen
 * to work properly
 *
 * @param {*} breakpoints
 */
function createResponsiveFile(breakpoints) {
	let count = 2,
		result = '/* stylelint-disable */\n\n';

	for (let breakpoint in breakpoints) {
		result += buildBreakpoint(breakpoint, count);
		count++;
	}

	fs.mkdirsSync(paths.temp);

	fs.writeFileSync(paths.temp + '/responsive.scss', result);
};

// Create temp responsive.scss file
createResponsiveFile(config.style.breakpoints);
