const fs = require('fs-extra');
const buildPath = __dirname;
const projectPath = buildPath.split('/').slice(0, -1).join('/');
const packageJsonPath = `${projectPath}/package.json`;
const weeJsonPath = `${projectPath}/wee.json`;
const config = require(weeJsonPath);
const sourcePath = `${projectPath}/${config.paths.source}`;
const rootPath = `${projectPath}/${config.paths.root}`;
const assetsPath = `${rootPath}/${config.paths.assets}`;
const modulesPath = `${projectPath}/node_modules`;

module.exports = {
	project: projectPath,
	packageJson: packageJsonPath,
	wee: weeJsonPath,
	temp: `${buildPath}/temp`,
	build: buildPath,
	root: rootPath,
	source: sourcePath,
	assets: assetsPath,
	styles: `${sourcePath}/styles`,
	scripts: `${sourcePath}/scripts`,
	components: `${sourcePath}/components`,
	images: `${sourcePath}/images`,
	fonts: `${sourcePath}/fonts`,
	output: {
		styles: `${assetsPath}/styles`,
		scripts: `${assetsPath}/scripts`,
		images: `${assetsPath}/images`,
		fonts: `${assetsPath}/fonts`
	},
	nodeModules: modulesPath,
	weeCore: `${modulesPath}/wee-core`
};