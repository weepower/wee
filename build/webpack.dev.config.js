const merge = require('webpack-merge');
const config = require('./webpack.base.config');
const paths = require('../build/paths');
const wee = require(paths.wee);

// Plugins
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

config
    .devtool('cheap-module-eval-source-map');

config
    .plugin('browser-sync')
    .use(BrowserSyncPlugin, [{
        host: wee.server.host === 'auto' ? null : wee.server.host,
        port: wee.server.port,
        ui: {
            port: wee.server.port + 1,
            weinre: {
                port: wee.server.port + 100
            }
        },
        open: 'external',
        https: wee.server.https,
        server: wee.server.static ? paths.root : false,
        proxy: wee.server.static ? false : wee.server.proxy,
        logPrefix: 'Wee',
        logFileChanges: true
    }]);

module.exports = merge(config.toConfig(), wee.configureWebpack);