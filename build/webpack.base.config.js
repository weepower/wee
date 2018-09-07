const path = require('path');
const Config = require('webpack-chain');
const config = new Config();

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const paths = require('./paths');
const weeConfig = require(paths.wee);
const env = process.env.NODE_ENV;

// Set the enviornment
config.mode(env);

config
    .entry('app')
        .add(`${paths.scripts}/app.js`)
        .end()
    .output
        .path(paths.output.scripts)
        .filename('[name].bundle.js');

// Process and extract css
config.module
    .rule('extract-css')
    .test(/\.s?css$/)
    .use(MiniCssExtractPlugin.loader)
        .loader(MiniCssExtractPlugin.loader)
        .options({
            publicPath: '../'
        })
        .end()
    .use('css-loader')
        .loader('css-loader')
        .options({
            url: false
        })
        .end()
    .use('postcss-loader')
        .loader('postcss-loader')
        .end()
    .use('sass-loader')
        .loader('sass-loader')
        .end()
    .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
            resources: [
                path.join(paths.styles, 'variables.scss'),
                path.join(paths.styles, 'mixins.scss'),
            ]
        })
        .end();

// Lint JS/Vue files
config.module
    .rule('lint')
    .pre()
    .test(/\.(js|vue)$/)
    .exclude
        .add(/node_modules/)
        .end()
    .include
        .add(paths.scripts)
        .end()
    .use('eslint')
        .loader('eslint-loader')
        .end();

config
    .plugin('extract-css')
        .use(MiniCssExtractPlugin, [{
            filename: path.join('../styles', weeConfig.style.output.filename),
            chunkFileName: path.join('../styles', weeConfig.style.output.chunkFilename),
        }])
        .end();

config
    .plugin('stylelint')
        .use(StyleLintPlugin, [{
            // Skip linting on start, and only lint dirty modules
            lintDirtyModulesOnly: true,
            // Set context so we're not linting files in vendor or node_modules
            context: paths.source
        }])
        .end();

config
    .resolve
    .modules
        .add(path.join(paths.weeCore, 'scripts'))
        .add(paths.nodeModules);

module.exports = config;