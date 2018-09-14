const merge = require('webpack-merge');
const config = require('./webpack.base.config');
const paths = require('../build/paths');
const wee = require(paths.wee);

// Plugins
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
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
        new UglifyJsPlugin({
            uglifyOptions: {
                output: {
                    comments: false
                },
                compress: {
                    // turn off flags with small gains to speed up minification
                    arrows: false,
                    collapse_vars: false, // 0.3kb
                    comparisons: false,
                    computed_props: false,
                    hoist_funs: false,
                    hoist_props: false,
                    hoist_vars: false,
                    inline: false,
                    loops: false,
                    negate_iife: false,
                    properties: false,
                    reduce_funcs: false,
                    reduce_vars: false,
                    switches: false,
                    toplevel: false,
                    typeofs: false,

                    // a few flags with noticable gains/speed ratio
                    // numbers based on out of the box vendor bundle
                    booleans: true, // 0.7kb
                    if_return: true, // 0.4kb
                    sequences: true, // 0.7kb
                    unused: true, // 2.3kb

                    // required features to drop conditional branches
                    conditionals: true,
                    dead_code: true,
                    evaluate: true
                },
                mangle: {
                    safari10: true
                }
            },
            sourceMap: true,
            cache: true,
            parallel: true
        }),
    ]);

// Minify images
config.plugin('imagemin')
    .use(ImageMinPlugin, [{
        pngquant: {
            quality: '99',
            test: /\.(jpe?g|png|gif|svg)$/i
        },
    }]);

module.exports = merge(config.toConfig(), wee.configureWebpack);
