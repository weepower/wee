const merge = require('webpack-merge');
const glob = require('glob');
const config = require('./webpack.base.config');
const paths = require('./paths');
const wee = require(`${paths.project}/wee.config.js`);
const env = process.env.NODE_ENV;

// Plugins
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ImageMinPlugin = require('imagemin-webpack-plugin').default;

config.devtool('source-map');

config.output
    .pathinfo(true);

// Minify JS
config.optimization
    .nodeEnv(env)
    .minimizer('uglify-js')
    .use(UglifyJsPlugin, [{
        uglifyOptions: {
            output: {
                comments: false,
            },
            compress: {
                // turn off flags with small gains to speed up minification
                collapse_vars: false, // 0.3kb
                // a few flags with noticable gains/speed ratio
                // numbers based on out of the box vendor bundle
                booleans: true, // 0.7kb
                if_return: true, // 0.4kb
                sequences: true, // 0.7kb
                unused: true, // 2.3kb

                // required features to drop conditional branches
                conditionals: true,
                dead_code: true,
                evaluate: true,
            },
        },
        sourceMap: true,
        cache: true,
        parallel: true,
    }]);

// Minify images
config.plugin('imagemin')
    .use(ImageMinPlugin, [{
        pngquant: {
            quality: '99',
            test: /\.(jpe?g|png|gif|svg)$/i,
        },
    }]);

module.exports = merge(config.toConfig(), wee.configureWebpack || {});
