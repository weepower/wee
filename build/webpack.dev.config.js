const webpack = require('webpack');
const merge = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const fs = require('fs-extra');
const base = require('./webpack.base.config');
const paths = require('./paths');
const weeJson = fs.readJsonSync(`${paths.project}/wee.json`);
const config = weeJson.server;

module.exports = env => {
	const plugins = [
		new BrowserSyncPlugin({
			host: config.host === 'auto' ? null : config.host,
			port: config.port,
			ui: {
				port: config.port + 1,
				weinre: {
					port: config.port + 100
				}
			},
			open: 'external',
			https: config.https,
			server: config.static ? paths.root : false,
			proxy: config.static ? false : config.proxy,
			logPrefix: 'Wee',
			logFileChanges: true
		}),
	];

	// If analyze flag is passed, use BundleAnalyzerPlugin
	// to get a visual of the bundle size
	if (env.analyze) {
		plugins.push(new BundleAnalyzerPlugin());
	}

	return merge(base, {
		devtool: 'cheap-module-eval-source-map',
		plugins,
	});
};
