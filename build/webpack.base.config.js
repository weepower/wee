const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SuppressChunksPlugin = require('suppress-chunks-webpack-plugin').default;
const glob = require('glob');
const paths = require('./paths');
const config = require(`${paths.project}/wee.json`);
const { buildEntries, calcBreakpoints } = require('./helpers');

const extractSCSS = new ExtractTextPlugin({
	filename: '../styles/[name].[md5:contenthash:base64:12].css',
	allChunks: true
});

module.exports = {
	entry: {
		...buildEntries(config.script.entry),
		components: glob.sync(`${paths.components}/**/*.scss`),
		styles: glob.sync(`${paths.styles}/**/*.scss`),
		// TODO: Figure out
		// core: glob.sync(`${paths.weeCore}/styles/**/*.scss`)
	},
	output: {
		filename: config.script.output.filename,
		path: paths.output.scripts,
		publicPath: paths.root,
		// pathinfo: prod === false
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
					use: [
						// { loader: 'css-loader', options: { minimize: true } },
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
						{
							loader: 'postcss-loader',
							options: {
								ident: 'postcss',
								parser: require('postcss-comment'),
								plugins: loader => [
									// require('postcss-variable-media')({
									// 	breakpoints: calcBreakpoints(config.style.breakpoints, config.style.breakpointOffset)
									// }),
									// require('autoprefixer')()
								]
							}
						}
					]
				})
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
			}
		]
	},
	plugins: [
		// Delete output directory contents
		new CleanWebpackPlugin([
			'public/assets/scripts',
			'public/assets/fonts',
			'public/assets/images',
			'public/assets/styles',
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
				require('postcss-variable-media')({
					breakpoints: calcBreakpoints(config.style.breakpoints, config.style.breakpointOffset)
				}),
				require('autoprefixer')(),

				// Pack same CSS media query rules into one media query rule
				require('css-mqpacker')(),
				require('cssnano')({
					safe: true
				}),
			],
		}),

		// Copy images from source to public
		new CopyWebpackPlugin([
			{ from: paths.images, to: paths.output.images },
		]),

		new SuppressChunksPlugin(['components', 'styles']),
	],
	resolve: {
		modules: [
			`${paths.weeCore}/scripts`,
			paths.nodeModules
		]
	}
}
