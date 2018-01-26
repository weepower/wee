const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const glob = require('glob');
const paths = require('./paths');
const config = require(`${paths.project}/wee.json`);
const { buildEntries, calcBreakpoints } = require('./helpers');

const extractSCSS = new ExtractTextPlugin({
	// Add path to file name to output into it's own directory
	filename: '../styles/[name].[contenthash].css',
	allChunks: true
});

module.exports = {
	entry: buildEntries(config.script.entry),
	output: {
		filename: config.script.output.filename,
		path: paths.output.scripts,
		publicPath: paths.root,
	},
	module: {
		rules: [
			// Eslint config
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

			// Vue loader
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},

			// Babel loader
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
						// Use object rest and spread plugin
						require('babel-plugin-transform-object-rest-spread')
					],
					// Use the preset-env and target the latest 2 versions of every major browser as
					// well as IE 11
					presets: [
						['env', { targets: { browsers: ['last 2 versions', 'ie 11'] } }]
					]
				}
			},

			// Sass loader config
			{
				test: /\.scss$/,
				use: extractSCSS.extract({
					// Fallback to style loader
					fallback: 'style-loader',
					publicPath: '../../../',
					use: [
						{ loader: 'css-loader' },
						{
							loader: 'sass-loader',
							options: {
								// Include wee-core so we can @import core files
								// using the tilda character: @import "~wee-core/styles/mixins.scss"
								includePaths: [
									`${paths.weeCore}`
								]
							}
						},

						// Sass resource loader allows us to enable global access to
						// files. Note: Only include files that don't include any CSS, as
						// they will be output each time.
						{
							loader: 'sass-resources-loader',
							options: {
								resources: [
									`${paths.styles}/variables.scss`,
									`${paths.styles}/mixins.scss`,
								]
							},
						},
					],
				}),
			},
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				loader: 'file-loader',
				options: {
					name: 'fonts/[name].[ext]',
					// Adds the path for the font inside the CSS file
					publicPath: '../',
					// Move fonts one level back from scripts directory
					outputPath: '../'
				},
			},
		],
	},
	plugins: [
		// Delete output directory contents
		new CleanWebpackPlugin([
			paths.assets
		], {
			root: paths.project
		}),

		// Extract css into single file
		extractSCSS,

		// Process with postcss after extract text plugin does it's thing
		new PostCSSAssetsPlugin({
			test: /\.css$/,
			log: true,
			plugins: [
				// Use custom media query @ rules
				require('postcss-variable-media')({
					breakpoints: calcBreakpoints(config.style.breakpoints, config.style.breakpointOffset)
				}),
				// Autoprefix css properties
				require('autoprefixer')(),
				// Pack same CSS media query rules into one media query rule
				require('css-mqpacker')(),
				// Minify css
				require('cssnano')({
					safe: true
				}),
			],
		}),

		// Copy images from source to public
		new CopyWebpackPlugin([
			{ from: paths.images, to: paths.output.images },
		]),

		// Create a manifest json file of the output chunks
		new ManifestPlugin({
			// Move manifest file back one directory
			fileName: '../manifest.json',
			// Map over manifest and remove reference to style path,
			// for some reason overriding the publicPath in
			// extractTextPlugin doesn't work
			map(manifest) {
				if (manifest.path.includes('../styles/')) {
					manifest.path = manifest.path.replace('../styles/', '');
				}

				return manifest;
			}
		}),

		// Chunk all vendor scripts
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: module => module.context && module.context.includes('node_modules'),
		}),

		// Chunk all common scripts, this will include the
		// webpack boilerplate
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			minChunks: Infinity
		}),
	],
	resolve: {
		modules: [
			`${paths.weeCore}/scripts`,
			paths.nodeModules
		]
	}
}
