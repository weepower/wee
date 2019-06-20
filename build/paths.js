const path = require('path');

const env = process.env.NODE_ENV;
const build = __dirname;
const project = path.resolve(build, '../');
const wee = path.resolve(project, 'wee.config.js');
const packageJson = path.resolve(project, 'package.json');
const config = require(wee);
const source = path.resolve(project, config.paths.source);
const root = path.resolve(project, config.paths.root);
const assets = path.resolve(root, (env === 'development') ? `local-${config.paths.assets}` : config.paths.assets);
const nodeModules = path.resolve(project, 'node_modules');
const temp = path.resolve(build, 'temp');

module.exports = {
    temp,
    project,
    packageJson,
    build,
    root,
    source,
    assets,
    styles: path.resolve(source, 'styles'),
    scripts: path.resolve(source, 'scripts'),
    components: path.resolve(source, 'components'),
    images: path.resolve(source, 'images'),
    fonts: path.resolve(source, 'fonts'),
    output: {
        styles: path.resolve(assets, 'styles'),
        scripts: path.resolve(assets, 'scripts'),
        images: path.resolve(assets, 'images'),
        fonts: path.resolve(assets, 'fonts'),
    },
    nodeModules,
    weeCore: path.resolve(nodeModules, 'wee-core'),
};
