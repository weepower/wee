const postcss = require('postcss');
const glob = require('glob');
const fs = require('fs-extra');
const chalk = require('chalk');
const syntax = require('postcss-wee-syntax');
const paths = require('../paths');
const log = require('../utils').log;

// Config
const config = fs.readJsonSync(paths.project + '/wee.json');
const breakpoints = config.style.breakpoints;
const features = config.style.features;
const compile = config.style.compile;
const variables = require(paths.styles + '/variables.js')();
const plugins = [
	require('postcss-variables')({
		globals: variables
	}),
	require('postcss-js-mixins')({
		mixins: Object.assign(require(paths.weeCore + '/styles/mixins.js')(variables), require(paths.styles + '/mixins.js')(variables))
	}),
	require('postcss-nested-selectors')(),
	require('postcss-nested')({
		bubble: Object.keys(breakpoints)
	}),
	require('postcss-variable-media')({
		breakpoints: calcBreakpoints(breakpoints, config.style.breakpointOffset)
	}),
	require('autoprefixer')(),
	require('cssnano')({
		safe: true
	})
];
let ignore = [];
let result = '';

/**
 * Calculate breakpoints with offset included
 *
 * @param {Object} breakpoints
 * @param {number} offset
 * @returns {Object}
 */
function calcBreakpoints(breakpoints, offset) {
	for (let breakpoint in breakpoints) {
		breakpoints[breakpoint] = breakpoints[breakpoint] - offset;
	}

	return breakpoints;
}

/**
 * Change camelCase to dash-case (including numbers)
 *
 * @param value
 * @returns {string}
 */
function convertCamelToDash(value) {
	return value.replace(/([a-z])([A-Z])/g, '$1-$2')
		.toLowerCase()
		.replace(/([a-z])([0-9])/g, '$1-$2');
}

/**
 * Find and return file(s) content
 *
 * @param {string} filePath
 * @returns {string}
 */
function getCSS(filePath) {
	let base = filePath.split('/')[0] === '.' ? paths.project : paths.styles,
		result = '';

	glob.sync(`${base}/${filePath}`).forEach(file => {
		ignore.push(file);
		result += fs.readFileSync(file, 'utf-8');
	});

	return result;
}

/**
 * Process CSS into output
 *
 * @param {string} css
 * @param {string} destination
 */
function processCSS(css, destination) {
	return postcss(plugins)
		.process(css, {
			syntax: syntax
		})
		.then(result => {
			return new Promise((resolve, reject) => {
				fs.writeFile(destination, result.css, err => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
		})
		.catch(err => {
			log.error(err);
		});
}

/**
 * Start of process
 */

log.heading('Compiling CSS', 'red');

// Make sure output directories exist
fs.mkdirsSync(paths.output.styles);

// Process compile blocks
let files = Object.keys(compile);

for (let i = 0; i < files.length; i++) {
	let result = '',
		block = compile[files[i]];

	// Not sure how to get around using sync methods to ensure
	// compilation order as designated by array compile blocks
	if (Array.isArray(block)) {
		block.forEach(filePath => {
			// Concatenate files together
			result += getCSS(filePath);
		});
	} else {
		result += getCSS(block);
	}

	processCSS(result, `${paths.output.styles}/${files[i]}`).then(() => {
		log.message('Compiled: ' + files[i], 'red');
	});
}

// Main output file
result = '';

// Add reset and base styling
result += fs.readFileSync(paths.weeCore + '/styles/reset.pcss', 'utf-8');
result += fs.readFileSync(__dirname + '/../temp/responsive.pcss', 'utf-8');

// Add features
if (features.buttons) {
	result += fs.readFileSync(paths.weeCore + '/styles/components/buttons.pcss', 'utf-8');
}

if (features.code) {
	result += fs.readFileSync(paths.weeCore + '/styles/components/code.pcss', 'utf-8');
}

if (features.forms) {
	result += fs.readFileSync(paths.weeCore + '/styles/components/forms.pcss', 'utf-8');
}

if (features.tables) {
	result += fs.readFileSync(paths.weeCore + '/styles/components/tables.pcss', 'utf-8');
}

if (features.print) {
	// Add print files
	result += `@media print {
		${fs.readFileSync(paths.weeCore + '/styles/print.pcss')}
		${getCSS('print.pcss')}
	}`;
}

// Add class helpers
result += fs.readFileSync(paths.weeCore + '/styles/components/helpers.pcss', 'utf-8');

// Add breakpoint files
for (let breakpoint in breakpoints) {
	let file = `${paths.styles}/breakpoints/${convertCamelToDash(breakpoint)}.pcss`;

	// Create file if not already generated
	fs.ensureFileSync(file);

	ignore.push(file);

	if (breakpoints[breakpoint]) {
		result += `@${breakpoint} { ${fs.readFileSync(file, 'utf-8')} }`;
	} else {
		log.error('Unregistered breakpoint: ' + name);
		log.message('Check breakpoint files against registered breakpoints in wee.json');
	}
}

// Add component files
glob.sync(paths.components + '/**/*.{pcss,css}').forEach(file => {
	result += fs.readFileSync(file, 'utf-8');
});

// Add all build files
config.style.build.forEach(pattern => {
	result += getCSS(pattern);
});

// Concatenate all other files
glob.sync(paths.styles + '**/*.{pcss,css}', {
	ignore: ignore
}).forEach(file => {
	result += fs.readFileSync(file, 'utf-8');
});

// Process main style file
processCSS(result, paths.output.styles + '/style.min.css').then(() => {
	log.message('Compiled: style.min.css', 'red');

	// Add newline for separation from proceeding webpack printout
	console.log('\n');
});