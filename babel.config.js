const paths = require('./build/paths');
const package = require(paths.packageJson);

module.exports = {
    presets: [
        ['@babel/env', {
            targets: package.browserslist
        }
    ]],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-syntax-dynamic-import',
    ],
};
