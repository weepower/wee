const fs = require('fs-extra');
const glob = require('glob');
const paths = require('./paths');
const weeJson = fs.readJsonSync(paths.project + '/wee.json');
const config = weeJson.server;
const reload = config.reload;
let reloadPaths = reload ? [] : false;

if (reload.enable) {
	let watch = config.reload.watch,
		extensions = watch.extensions.join(',');

	if (watch.extensions.length > 1) {
		extensions = `{${extensions}}`;
	}

	// Add user-defined paths
	watch.paths.forEach(path => {
		reloadPaths.push(`${paths.project}/${path}/**/*.${extensions}`);
	});

	// Add root to watchlist
	if (watch.root === true) {
		reloadPaths.unshift(`${paths.root}/**/*.${extensions}`);
	}

	// Watch web root assets
	reloadPaths.unshift(paths.root + '/assets/**/*.{css,gif,jpg,jpeg,js,png,svg,webp,woff,woff2}');

	// Add ignored files
	watch.ignore.forEach(path => {
		reloadPaths.push(`!${paths.project}/${path}`);
	});
}

module.exports = {
	ghostMode: config.ghostMode,
    host: config.host === 'auto' ? null : config.host,
	port: config.port,
	open: 'external',
    files: reloadPaths,
	https: config.https,

	// Not using paths.root for better terminal print out
	server: config.static ? paths.root : false,
    proxy: config.proxy,
	logPrefix: 'Wee',
	logFileChanges: true
};