const fs = require('fs-extra');
const buildPath = __dirname;
const projectPath = buildPath + '/..';
const packageJsonPath = projectPath + '/package.json';
const weeJsonPath = projectPath + '/wee.json';
const config = fs.readJsonSync(weeJsonPath);
const sourcePath = `${projectPath}/${config.paths.source}`;
const rootPath = `${projectPath}/${config.paths.root}`;
const modulesPath = projectPath + '/node_modules';

module.exports = {
	project: projectPath,
	packageJson: packageJsonPath,
	wee: weeJsonPath,
	temp: buildPath + '/temp',
	build: buildPath,
	root: rootPath,
	source: sourcePath,
	styles: `${sourcePath}/styles`,
	scripts: `${sourcePath}/scripts`,
	components: `${sourcePath}/components`,
	output: {
		styles: `${rootPath}/${config.paths.assets}/styles`,
		scripts: `${rootPath}/${config.paths.assets}/scripts`
	},
	nodeModules: modulesPath,
	weeCore: modulesPath + '/wee-core',

	/**
	 * Set paths on path object
	 *
	 * @param {string} key
	 * @param {string|Object} value
	 */
	set(key, value) {
		this[key] = value;
	}
};