const webpack = require('webpack');
const prod = process.env.NODE_ENV === 'production';
const paths = require('./paths');
const glob = require('glob');
const BabiliPlugin = require('babili-webpack-plugin');
const config = require(paths.project + '/wee.json');
let plugins = [];

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
	let result = {};

	Object.keys(entries).forEach(entry => {
		let paths = getPaths(entries[entry]);

		// If single entry point, extract from array
		if (paths.length === 1) {
			paths = paths[0];
		}

		result[entry] = paths;
	});

	return result;
}

// Add chunking of shared modules between entry points
if (config.script.chunking.enable) {
	plugins.push(new webpack.optimize.CommonsChunkPlugin(config.script.chunking.options));
}
// Configure for maximum minification
if (prod) {
	// Short-circuits all Vue.js warning code
	plugins.push(new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: '"production"'
		}
    }));

	// Minify with dead-code elimination
    plugins.push(new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
    }));

	// Add babili plugin if building for production
	// Uglify cannot minify bundle properly
	plugins.push(new BabiliPlugin());
}

module.exports = {
	entry: buildEntries(config.script.entry),
	output: {
		filename: config.script.output.filename,
		path: paths.output.scripts,
		publicPath: paths.root,
		pathinfo: prod === false
	},
	devtool: prod ? 'source-map' : 'eval',
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.(js|vue)$/,
				exclude: /node_modules/,
				include: [
					paths.scripts
				],
				loader: 'eslint-loader',
				options: {
					configFile: 'build/.eslintrc'
				}
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules\/(?!wee-core)/,
				options: {
					// NOTE: Any changes to options need to be updated
					// in .babelrc - vue-loader uses .babelrc
					plugins: [
						// Consolidates/reuses babel helpers
						require('babel-plugin-transform-runtime'),
						require('babel-plugin-transform-object-rest-spread')
					],
					presets: [
						["env", {
							"targets": {
								"browsers": ["last 2 versions", "ie 10", "ie 11"]
							}
						}]
					]
				}
			}
		]
	},
	plugins: plugins,
	resolve: {
		modules: [
			`${paths.weeCore}/scripts`,
			paths.nodeModules
		]
	}
};