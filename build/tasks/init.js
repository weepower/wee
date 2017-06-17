const fs = require('fs-extra');
const paths = require('../paths');
const responsive = require('./responsive');

// Config files
const config = fs.readJsonSync(paths.project + '/wee.json');
const packageJson = fs.readJsonSync(paths.packageJson);

// Update package.json
if (! packageJson.config) {
	packageJson.config = {};
}

// Update config properties in package.json to be used by npm scripts
packageJson.config.root = config.paths.root;
packageJson.config.source = config.paths.source;
packageJson.config.build = config.paths.build;
packageJson.config.tasks = config.paths.build + '/tasks';
fs.writeJsonSync(paths.packageJson, packageJson, {spaces: 2});

// Create wee.responsive.pcss file
responsive(config.style.breakpoints);