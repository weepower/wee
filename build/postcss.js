const postcss = require('postcss');
const glob = require('glob');
const fs = require('fs-extra');
const chalk = require('chalk');
const syntax = require('postcss-wee-syntax');
const args = require('command-line-args')([{
	name: 'config',
	alias: 'c',
	type: String
}]);
const paths = require('./paths');

// Config
const config = fs.readJsonSync(args.config);
const breakpoints = config.style.breakpoints;
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
	require('autoprefixer')({
		browsers: [
			'last 2 versions',
			'ie > 9'
		]
	}),
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
	postcss(plugins)
		.process(css, {
			syntax: syntax
		})
		.then(result => {
			fs.writeFile(destination, result.css, err => {
				if (err) {
					console.log(err);
				}
			});
		})
		.catch(err => {
			console.log(err);
		});
}

/**
 * Start of process
 */

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

	processCSS(result, `${paths.output.styles}/${files[i]}`);
}

// Main output file
result = '';

result += fs.readFileSync(paths.weeCore + '/styles/reset.pcss', 'utf-8');
result += fs.readFileSync(__dirname + '/temp/responsive.pcss', 'utf-8');

// TODO: Add forms,buttons,code,print,tables

// Add print files
result += `@media print {
	${fs.readFileSync(paths.weeCore + '/styles/print.pcss')}
	${getCSS('print.pcss')}
}`;

// Add breakpoint files
glob.sync(paths.styles + '/breakpoints/**/*.{pcss,css}').forEach(file => {
	let segments = file.split('/'),
		name = '';

	segments[segments.length - 1].replace(/\.pcss$|\.css$/, '')
		.split('-')
		.forEach((word, i) => {
			if (i) {
				name += (word.substr(0, 1).toUpperCase() + word.substr(1));
			} else {
				name += word;
			}
		});

	ignore.push(file);

	if (breakpoints[name]) {
		result += `@${name} { ${fs.readFileSync(file, 'utf-8')} }`;
	} else {
		console.log(chalk.bgRed(`Unregistered breakpoint: ${name}`));
		console.log('Check breakpoint files against registered breakpoints in wee.json');
	}
});

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
processCSS(result, paths.output.styles + '/style.min.css');