/* eslint-disable import/newline-after-import */

const { browserslist } = require('./package.json');

module.exports = {
    presets: [
        [
            '@babel/env', {
                targets: browserslist,
            },
        ],
    ],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-syntax-dynamic-import',
        'minify-dead-code-elimination',
        'minify-mangle-names',
    ],
};
