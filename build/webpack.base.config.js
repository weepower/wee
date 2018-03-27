const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const SuppressChunksPlugin = require('suppress-chunks-webpack-plugin').default;
const path = require('path');
const glob = require('glob');
const paths = require('./paths');
const config = require(`${paths.project}/wee.json`);
const { buildEntries, calcBreakpoints } = require('./helpers');

const babelConfig = {
	presets: [['env', { targets: { browsers: ['last 2 versions', 'ie 11'] } }]],
	plugins: [
		// Consolidates/reuses babel helpers
		require('babel-plugin-transform-runtime'),
		// Use object rest and spread plugin
		require('babel-plugin-transform-object-rest-spread'),
	],
};

const extractSCSS = new ExtractTextPlugin({
	// Add path to file name to output into it's own directory
	filename: `../styles/${config.style.output.filename}`,
	allChunks: true,
});

const plugins = [
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
		{ from: paths.fonts, to: paths.output.fonts },
	]),

	// Lint styles
	new StyleLintPlugin({
		configFile: `${paths.build}/.stylelintrc`,
		// Skip linting on start, and only lint dirty modules
		lintDirtyModulesOnly: true,
		syntax: 'scss'
	}),

	// Supress the creation of any style specific entry points
	new SuppressChunksPlugin(Object.keys(config.style.entry)),
];

if (config.script.vendor.enabled) {
	plugins.push(
		// Put any node_modules scripts into seperate bundle
		new webpack.optimize.CommonsChunkPlugin({
			name: config.script.vendor.options.name,
			minChunks: module => module.context && module.context.includes('node_modules')
		})
	);

	// Add hashed module ids
	plugins.push(new webpack.HashedModuleIdsPlugin());
}

if (config.script.manifest.enabled) {
	plugins.push(
		// Create a manifest json file of the output chunks
		new ManifestPlugin({
			// Move manifest file back one directory
			fileName: `../${config.script.manifest.options.name}.json`,
			// Map over manifest and remove reference to style path,
			// for some reason overriding the publicPath in
			// extractTextPlugin doesn't work
			map(manifest) {
				if (manifest.path.includes('../styles/')) {
					manifest.path = manifest.path.replace('../styles/', '');
				}

				return manifest;
			}
		})
	);
}

if (config.script.chunking.enabled) {
	const { name, minChunks } = config.script.chunking.options;

	plugins.push(
		// Enable chunking
		new webpack.optimize.CommonsChunkPlugin({ name, minChunks })
	);
}

module.exports = {
	entry: buildEntries(config.script.entry, config.style.entry),
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
					paths.scripts,
				],
				loader: 'eslint-loader',
				options: {
					configFile: 'build/.eslintrc'
				}
			},

			// Vue loader
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: [
						{ loader: 'babel-loader', options: babelConfig },
					],
				},
			},

			// Babel loader
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules\/(?!wee-core)/,
				options: babelConfig,
			},

			// Sass loader config
			{
				test: /\.scss$/,
				use: extractSCSS.extract({
					// Fallback to style loader
					fallback: 'style-loader',
					publicPath: '../../../',
					use: [
						{
                            loader: 'css-loader',
                            options: {
                                url: false
                            }
                        },
						{
							loader: 'sass-loader',
							options: {
								// Include wee-core so we can @import core files
								// using the tilda character: @import "~wee-core/styles/mixins.scss"
								includePaths: [
									`${paths.weeCore}`,
								],
							},
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
		],
	},
	resolve: {
		alias: {
			'@': paths.components,
		},
		modules: [
			`${paths.weeCore}/scripts`,
			paths.nodeModules,
		],
	},
	plugins,
};
