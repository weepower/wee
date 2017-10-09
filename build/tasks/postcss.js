const postcss = require('postcss');
const glob = require('glob');
const fs = require('fs-extra');
const chalk = require('chalk');
const sass = require('node-sass');
const paths = require('../paths');
const log = require('../utils').log;

// Config
const config = fs.readJsonSync(paths.project + '/wee.json');
const breakpoints = config.style.breakpoints;
const features = config.style.features;
const compile = config.style.compile;
const plugins = [
	require('postcss-variable-media')({
		breakpoints: calcBreakpoints(breakpoints, config.style.breakpointOffset)
	}),
	require('autoprefixer')(),
	require('cssnano')({
		safe: true
	})
];
let ignore = [];

// Main output file
let data;

let mixins;
let variables;

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
	let result = sass.renderSync({
		data: css,
		outputStyle: 'compressed'
	});

	return postcss(plugins)
		.process(result.css.toString())
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

data = '';

// Add user variable overrides and mixins
variables = paths.styles + '/variables.scss';
data += fs.readFileSync(variables, 'utf-8') + '\n';
ignore.push(variables);

// Add reset and base styling
data += fs.readFileSync(paths.weeCore + '/styles/variables.scss', 'utf-8') + '\n';

data += fs.readFileSync(paths.weeCore + '/styles/mixins.scss', 'utf-8') + '\n';

mixins = paths.styles + '/mixins.scss';
data += fs.readFileSync(mixins, 'utf-8') + '\n';
ignore.push(mixins);

data += fs.readFileSync(paths.weeCore + '/styles/reset.scss', 'utf-8') + '\n';
data += fs.readFileSync(__dirname + '/../temp/responsive.scss', 'utf-8') + '\n';

// Add features
if (features.buttons) {
	data += fs.readFileSync(paths.weeCore + '/styles/components/buttons.scss', 'utf-8') + '\n';
}

if (features.code) {
	data += fs.readFileSync(paths.weeCore + '/styles/components/code.scss', 'utf-8') + '\n';
}

if (features.forms) {
	data += fs.readFileSync(paths.weeCore + '/styles/components/forms.scss', 'utf-8') + '\n';
}

if (features.tables) {
	data += fs.readFileSync(paths.weeCore + '/styles/components/tables.scss', 'utf-8') + '\n';
}

if (features.print) {
	// Add print files
	data += `@media print {
		${fs.readFileSync(paths.weeCore + '/styles/print.scss', 'utf-8')}
		${getCSS('print.scss')}
	}\n`;
}

// Add class helpers
data += fs.readFileSync(paths.weeCore + '/styles/components/helpers.scss', 'utf-8') + '\n';

const screen = paths.styles + '/screen.scss';

data += fs.readFileSync(screen, 'utf-8') + '\n';

ignore.push(screen);

// Add breakpoint files
for (let breakpoint in breakpoints) {
	let name = convertCamelToDash(breakpoint),
		file = `${paths.styles}/breakpoints/${name}.scss`;

	// Create file if not already generated
	fs.ensureFileSync(file);

	ignore.push(file);

	if (breakpoints[breakpoint]) {
		data += `@${breakpoint} { ${fs.readFileSync(file, 'utf-8')} }\n`;
	} else {
		log.error(`Unregistered breakpoint: ${name}`);
		log.message('Check breakpoint files against registered breakpoints in wee.json');
	}
}

// Add component files
glob.sync(paths.components + '/**/*.{scss,css}').forEach(file => {
	data += fs.readFileSync(file, 'utf-8') + '\n';
});

// Add all build files
config.style.build.forEach(pattern => {
	data += getCSS(pattern);
});

// Concatenate all other files
glob.sync(paths.styles + '**/*.{scss,css}', {
	ignore
}).forEach(file => {
	console.log(file);
	data += fs.readFileSync(file, 'utf-8') + '\n';
});

// Process main style file
processCSS(data, paths.output.styles + '/style.min.css').then(() => {
	log.message('Compiled: style.min.css', 'red');

	// Add newline for separation from proceeding webpack printout
	console.log('\n');
});