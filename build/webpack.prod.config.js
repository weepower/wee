const config = require('./webpack.base.config');
const paths = require('../build/paths');
const wee = require(paths.wee);

// Plugins
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const ImageMinPlugin = require('imagemin-webpack-plugin').default;

const env = process.env.NODE_ENV;

config.devtool('source-map');

config.output
    .pathinfo(true);

// Minify JS
config.optimization
    .nodeEnv(env)
    .minimizer([
        // Minify with dead-code elimination
        new UglifyJsPlugin(),
        // Uglify cannot minify bundle properly
        new BabelMinifyPlugin({}, {
            // Remove all comments
            comments: false
        })
    ]);

// Minify images
config.plugin('imagemin')
    .use(ImageMinPlugin, [{
        pngquant: {
            quality: '99',
            test: /\.(jpe?g|png|gif|svg)$/i
        },
    }]);

let cacheGroups = {};

if (wee.script.vendor.enabled) {
    cacheGroups.vendors = {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        chunks: 'initial',
        ...wee.script.vendor.options
    };
}

if (wee.script.chunking.enabled) {
    cacheGroups.chunking = {
        priority: -20,
        chunks: 'initial',
        reuseExistingChunk: true,
        ...wee.script.chunking.options
    }
}

if (Object.keys(cacheGroups).length) {
    config.optimization.splitChunks({ cacheGroups });
}

module.exports = config.toConfig();