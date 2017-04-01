const fs = require('fs-extra');
const paths = require('./paths');
const responsive = require('./responsive');

// Config files
const config = fs.readJsonSync(paths.project + '/wee.json');
const packageJson = fs.readJsonSync(paths.packageJson);

// Set project paths
const assetsPath = `${config.paths.source}/${config.paths.assets}`;

// Update package.json
if (! packageJson.config) {
	packageJson.config = {};
}

packageJson.config.root = config.paths.root;
packageJson.config.source = assetsPath;
packageJson.config.build = config.paths.build;
fs.writeJsonSync(paths.packageJson, packageJson, {spaces: 2});

// Create wee.responsive.pcss file
responsive(config.style.breakpoints);