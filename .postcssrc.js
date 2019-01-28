const paths = require('./build/paths');
const config = require(`${paths.project}/wee.config.js`);
const { calcBreakpoints } = require('./build/utils');

module.exports = {
    plugins: [
        require('postcss-variable-media')({
            breakpoints: calcBreakpoints(config.style.breakpoints, config.style.breakpointOffset),
        }),
        require('autoprefixer')({
            grid: true,
        }),
        require('css-mqpacker')({
            sort: true,
        }),
        require('cssnano')({
            safe: true,
            preset: ['default', {
                calc: false,
            }],
        }),
    ],
};
