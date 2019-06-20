/* eslint import/newline-after-import: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
/* eslint import/order: 0 */
/* eslint indent: 0 */

const Config = require('webpack-chain');
const path = require('path');
const hash = require('hash-sum');
const glob = require('glob');
const config = new Config();
const paths = require('./paths');
const { addEntries } = require('./utils');
const env = process.env.NODE_ENV;
const wee = require(`${paths.project}/wee.config.js`);

// Plugins
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const DefineWebpackPlugin = require('webpack/lib/DefinePlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SuppressChunksPlugin = require('suppress-chunks-webpack-plugin').default;
const NamedChunksWebpackPlugin = require('webpack/lib/NamedChunksPlugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

// Set the environment
config.mode(env);

// Add script entries
addEntries(config, wee.script.entry, 'scripts');

// Add style entries
addEntries(config, wee.style.entry, 'styles');

// Set the output options
if (Object.keys(wee.script.output).length) {
    if (wee.script.output.filename) {
        config.output.filename(wee.script.output.filename);
    }

    if (wee.script.output.chunkFilename) {
        config.output.chunkFilename(wee.script.output.chunkFilename);
    }
}

config.output
    .path(paths.output.scripts)
    .publicPath((env === 'development') ? `/local-${wee.paths.assets}/scripts/` : `/${wee.paths.assets}/scripts/`);

// Babel
config
    .module
    .rule('js')
    .test(/\.js$/)
    .exclude
        .add(/node_modules(?!\/wee-core)/)
        .end()
    .use('babel')
        .loader('babel-loader')
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
        .add(paths.components)
        .end()
    .use('eslint')
        .loader('eslint-loader')
        .end();

// Vue
config.module
    .rule('vue')
    .test(/\.vue$/)
    .use('vue')
    .loader('vue-loader')
    .options({
        loaders: [
            {
                loader: 'babel-loader',
            },
        ],
    });

// Process and extract css
config.module
    .rule('extract-css')
    .test(/\.s?css$/)
    .use(MiniCssExtractPlugin.loader)
        .loader(MiniCssExtractPlugin.loader)
        .options({
            publicPath: '../',
        })
        .end()
    .use('css-loader')
        .loader('css-loader')
        .options({
            url: false,
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
                path.join(paths.build, 'temp/mixins.scss'),
                path.join(paths.styles, 'variables.scss'),
                path.join(paths.styles, 'mixins.scss'),
            ],
        })
        .end();


// Plugins
config.plugin('vue-loader-plugin')
    .use(VueLoaderPlugin)
    .end();

// Lint styles
config.plugin('stylelint')
    .use(StyleLintPlugin, [{
        // Set context so we're not linting files in vendor or node_modules
        context: paths.source,
    }])
    .end();

// Extract css
config.plugin('extract-css')
    .use(MiniCssExtractPlugin, [{
        filename: path.join('../styles', wee.style.output.filename),
        chunkFileName: path.join('../styles', wee.style.output.chunkFilename),
    }])
    .end();

// Define ENV
config.plugin('define')
    .use(DefineWebpackPlugin, [{
        'process.env': env,
    }]);

// Wee core alias
config.resolve
    .modules
        .add(path.join(paths.weeCore, 'scripts'))
        .add(paths.nodeModules);

// Shims
config.node
    .merge({
        setImmediate: false,
        process: 'mock',
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    });

// Clean output directory
config.plugin('clean-obsolete-chunks')
    .use(CleanObsoleteChunks)
    .end();

// Delete contents of output directory
config.plugin('clean-webpack')
    .use(CleanWebpackPlugin, [[
        paths.output.fonts,
        paths.output.images,
    ], {
        root: paths.project,
        watch: true,
    }])
    .end();

// Copy fonts and images
const copyWebpackIgnore = [
    '.gitkeep',
    '.DS_Store',
];

// Copy fonts and images
config.plugin('copy-webpack')
    .use(CopyWebpackPlugin, [[
        { from: paths.images, to: paths.output.images, ignore: copyWebpackIgnore },
        { from: paths.fonts, to: paths.output.fonts, ignore: copyWebpackIgnore },
    ], {
        copyUnmodified: true,
    }]);

// Don't generate js chunks for css only entry points
config.plugin('suppress-chunks')
    .use(SuppressChunksPlugin, [
        ...Object.keys(wee.style.entry).map(name => ({ name, match: /\.(js|js.map)$/ })),
    ]);

// Purge CSS
if (wee.purgeCss.enabled) {
    let contentPaths = [];

    if (Array.isArray(wee.purgeCss.paths)) {
        wee.purgeCss.paths.forEach((pattern) => {
            contentPaths = [
                ...glob.sync(pattern, { nodir: true }),
                ...contentPaths,
            ];
        });
    } else {
        contentPaths = [
            ...glob.sync(wee.purgeCss.paths, { nodir: true })
        ];
    }

    config.plugin('purge-css')
        .use(PurgecssPlugin, [{
            paths: contentPaths,
        }])
        .end();
}

// Run any project specific webpack config
if (wee.chainWebpack && typeof wee.chainWebpack === 'function') {
    wee.chainWebpack(config);
}

// keep chunk ids stable so async chunks have consistent hash (#1916)
const seen = new Set();
const nameLength = 4;

config.plugin('named-chunks')
    .use(NamedChunksWebpackPlugin, [(chunk) => {
        if (chunk.name) {
            return chunk.name;
        }

        const modules = Array.from(chunk.modulesIterable);

        if (modules.length > 1) {
            const joinedHash = hash(modules.map(m => m.id).join('_'));
            let len = nameLength;

            while (seen.has(joinedHash.substr(0, len))) len++;

            seen.add(joinedHash.substr(0, len));

            return `chunk-${joinedHash.substr(0, len)}`;
        }

        return modules[0].id;
    }]);

if (wee.chunking) {
    const cacheGroups = {};

    if (wee.chunking.vendor.enabled) {
        cacheGroups.vendors = {
            test: /[\\/]node_modules[\\/].+\.js$/,
            priority: -10,
            chunks: 'initial',
            ...wee.chunking.vendor.options,
        };
    }

    if (wee.chunking.common.enabled) {
        cacheGroups.common = {
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
            minChunks: 2,
            ...wee.chunking.common.option,
        };
    }

    if (Object.keys(cacheGroups).length) {
        config.optimization.splitChunks({ cacheGroups });
    }
}

if (wee.manifest.enabled) {
    config.plugin('manifest')
        .use(ManifestPlugin, [{
            publicPath: '',
            fileName: `../../${wee.manifest.options.filename}`,
            map: (file) => {
                file.path = file.path.replace('../styles/', '');

                return file;
            },
            // Filter out anything that isn't css, js or source map
            filter: (file) => {
                const entries = wee.style.entry;
                const styleEntries = [];

                // While we are suppresing the js file created by webpack
                // for the CSS only entry points, the manifest still includes
                // them so we must filter them out.
                Object.keys(entries).forEach((entry) => {
                    styleEntries.push(...[
                        entries[entry].replace('css', 'js'),
                        entries[entry].replace('css', 'js.map'),
                    ]);
                });

                return /\.(css|js|map)$/gi.test(file.name)
                    && ! styleEntries.includes(file.name);
            },
    }]);
}

module.exports = config;
