module.exports = {
    plugins: [
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
