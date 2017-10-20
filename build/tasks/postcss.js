const fs = require('fs-extra');
const glob = require('glob');
const postcss = require('postcss');
const sass = require('node-sass');
const paths = require('../paths');
const log = require('../utils').log;

const config = readFile(paths.project + '/wee.json', true);
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

let data = '';

// Add user variables
data += addImport(`${paths.styles}/variables.scss`);

// Add core variables
data += addImport(`${paths.weeCore}/styles/variables.scss`);

// Add core mixins
data += addImport(`${paths.weeCore}/styles/mixins.scss`);

// Add user mixins
data += addImport(`${paths.styles}/mixins.scss`);

// Add reset
data += addImport(`${paths.weeCore}/styles/reset.scss`);

// Add responsive helpers
data += addImport(`${paths.temp}/responsive.scss`);

// Add features
for (let feature in features) {
	if (feature !== 'print' && features[feature]) {
		data += addImport(`${paths.weeCore}/styles/components/${feature}.scss`);
	}
}

data += addImport(`${paths.weeCore}/styles/components/helpers.scss`);

// Add print
if (features.print) {
	// data += addImport(`${paths.weeCore}/styles/print.scss`);
	data += `@media print {
		${readFile(`${paths.weeCore}/styles/print.scss`)}
		${readFile(`${paths.styles}/print.scss`)}
	}\n`;
}

// Add breakpoint files
for (let breakpoint in breakpoints) {
	let name = convertCamelToDash(breakpoint),
		file = `${paths.styles}/breakpoints/${name}.scss`;

	// Create file if not already generated
	fs.ensureFileSync(file);

	if (breakpoints[breakpoint]) {
		data += `@${breakpoint} { ${readFile(file)} }\n`;
	} else {
		log.error(`Unregistered breakpoint: ${name}`);
		log.message('Check breakpoint files against registered breakpoints in wee.json');
	}
}

data += readFile(`${paths.styles}/screen.scss`);

// Add component files
glob.sync(paths.components + '/**/*.{scss,css}').forEach(file => {
	data += readFile(file) + '\n';
});

config.style.build.forEach(pattern => {
	data += getCSS(pattern);
});

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

// console.log(data);

/**
 * Add import path
 * @param path
 * @returns {string}
 */
function addImport(path) {
	return `@import "${path}";\n`;
}

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
 * Process CSS into output
 *
 * @param {string} css
 * @param {string} destination
 */
function processCSS(css, destination) {
	let result = sass.renderSync({
		data: css,
		includePaths: [
			paths.nodeModules
		],
		outputStyle: 'compressed'
	});

	return postcss(plugins)
		.process(result.css.toString())
		.then(result => {
			return new Promise((resolve, reject) => {
				fs.ensureFileSync(destination);

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
 * Find and return file(s) content
 *
 * @param {string} filePath
 * @returns {string}
 */
function getCSS(filePath) {
	let base = filePath.split('/')[0] === '.' ? paths.project : paths.styles,
		result = '';

	glob.sync(`${base}/${filePath}`).forEach(file => {
		result += readFile(file);
	});

	return result;
}

/**
 * Read a file
 *
 * @param path
 * @param json
 * @returns {*}
 */
function readFile(path, json) {
	let type = json ? 'Json' : 'File';

	return fs[`read${type}Sync`](path, json ? '' : 'utf-8');
}

// Process main style file
processCSS(data, paths.output.styles + '/style.min.css').then(() => {
	log.message('Compiled: style.min.css', 'red');

	// Add newline for separation from proceeding webpack printout
	console.log('\n');
});