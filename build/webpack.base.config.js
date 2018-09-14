const path = require('path');
const Config = require('webpack-chain');
const config = new Config();

// Plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const SuppressChunksPlugin = require('suppress-chunks-webpack-plugin').default;
const DefineWebpackPlugin = require('webpack/lib/DefinePlugin');
const NamedChunksWebpackPlugin = require('webpack/lib/NamedChunksPlugin');

const paths = require('./paths');
const wee = require(paths.wee);
const env = process.env.NODE_ENV;

/**
 *
 * @param {Object} entries
 * @param {String} type - The type of entry; scripts/styles
 */
const addEntries = (entries, type) => {
    for (const entry in entries) {
        const entryFiles = entries[entry];
        const entryConfig = config.entry(entry);

        if (Array.isArray(entryFiles)) {
            entryFiles.forEach(entry => entryConfig.add(`${paths[type]}/${entry}`));
        } else {
            entryConfig.add(`${paths[type]}/${entryFiles}`);
        }
    }
}

// Set the enviornment
config.mode(env);

config.stats({
    children: false,
});

// Add script entries
addEntries(wee.script.entry, 'scripts');

// Add style entries
addEntries(wee.style.entry, 'styles');

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
    .publicPath('/assets/scripts/')
    .filename(wee.script.output.filename)
    .chunkFilename(wee.script.output.filename);

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
                    loader: 'babel-loader'
                }
            ]
        });

config
    .plugin('extract-css')
        .use(MiniCssExtractPlugin, [{
            filename: path.join('../styles', wee.style.output.filename),
            chunkFileName: path.join('../styles', wee.style.output.chunkFilename),
        }])
        .end();

config.plugin('clean-obsolete-chunks')
    .use(CleanObsoleteChunks)
    .end();

// Delete contents of output directory
config.plugin('clean-webpack')
    .use(CleanWebpackPlugin, [[
        paths.output.fonts,
        paths.output.images
    ], {
        root: paths.project,
        watch: true
    }])
    .end();

// Lint styles
config
    .plugin('stylelint')
        .use(StyleLintPlugin, [{
            // Skip linting on start, and only lint dirty modules
            lintDirtyModulesOnly: true,
            // Set context so we're not linting files in vendor or node_modules
            context: paths.source
        }])
        .end();

config.plugin('vue-loader-plugin')
    .use(VueLoaderPlugin)
    .end();

const copyWebpackIgnore = [
    '.gitkeep',
    '.DS_Store'
];

// Copy fonts and images
config.plugin('copy-webpack')
    .use(CopyWebpackPlugin, [[
        { from: paths.images, to: paths.output.images, ignore: copyWebpackIgnore },
        { from: paths.fonts, to: paths.output.fonts, ignore: copyWebpackIgnore },
    ], {
        copyUnmodified: true
    }]);

// Don't generate js chunks for css only entry points
config.plugin('suppress-chunks')
    .use(SuppressChunksPlugin, [
        ...Object.keys(wee.style.entry).map(name => ({ name, match: /\.(js|js.map)$/ }))
    ]);

config.resolve
    .modules
        .add(path.join(paths.weeCore, 'scripts'))
        .add(paths.nodeModules);

if (wee.manifest.enabled) {
    config.plugin('manifest')
        .use(ManifestPlugin, [{
            publicPath: '',
            fileName: `../../${wee.manifest.options.filename}`,
            map(file) {
                file.path = file.path.replace('../styles/', '');

                return file;
            },
            // Filter out anything that isn't css, js or source map
            filter(file) {
                const entries = wee.style.entry;
                let styleEntries = [];

                // While we are suppresing the js file created by webpack
                // for the CSS only entry points, the manifest still includes
                // them so we must filter them out.
                for (const entry in entries) {
                    styleEntries.push(...[
                        entries[entry].replace('css', 'js'),
                        entries[entry].replace('css', 'js.map')
                    ])
                }

                return /\.(css|js|map)$/gi.test(file.name) &&
                    ! styleEntries.includes(file.name);
            }
        }])
}

// shims
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

config.plugin('define')
    .use(DefineWebpackPlugin, [{
        'process.env': env
    }]);

// keep chunk ids stable so async chunks have consistent hash (#1916)
const seen = new Set();
const nameLength = 4;

config.plugin('named-chunks')
    .use(NamedChunksWebpackPlugin, [chunk => {
        if (chunk.name) {
            return chunk.name;
        }

        const modules = Array.from(chunk.modulesIterable);

        if (modules.length > 1) {
            const hash = require('hash-sum');
            const joinedHash = hash(modules.map(m => m.id).join('_'));
            let len = nameLength;

            while (seen.has(joinedHash.substr(0, len))) len++

            seen.add(joinedHash.substr(0, len))

            return `chunk-${joinedHash.substr(0, len)}`;
        } else {
            return modules[0].id;
        }
    }]);

if (wee.chunking) {
    let cacheGroups = {};

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
        }
    }

    if (Object.keys(cacheGroups).length) {
        config.optimization.splitChunks({ cacheGroups });
    }
}

if (wee.chainWebpack && typeof wee.chainWebpack === 'function') {
    wee.chainWebpack(config);
}

module.exports = config;
