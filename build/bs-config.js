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
	reloadPaths = reloadPaths.concat(glob.sync(paths.output.scripts + '/*.js'))
		.concat(glob.sync(paths.output.styles + '/*.css'))
		.concat(paths.output.images + '/**/*.{gif,jpg,jpeg,png,svg}')
		.concat(paths.output.fonts + '/**/*.{webp,woff,woff2,svg}');

	// Add ignored files
	watch.ignore.forEach(path => {
		reloadPaths.push(`!${paths.project}/${path}`);
	});
}

module.exports = {
	ghostMode: config.ghostMode,
    host: config.host === 'auto' ? null : config.host,
	port: config.port,
	ui: {
		port: config.port + 1,
		weinre: {
			port: config.port + 100
		}
	},
	open: 'external',
    files: reloadPaths,
	https: config.https,
	server: config.static ? paths.root : false,
    proxy: config.static ? false : config.proxy,
	logPrefix: 'Wee',
	logFileChanges: true
};