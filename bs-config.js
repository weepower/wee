const glob = require('glob');

module.exports = {
	// TODO: Base paths need to be configurable (resources and public)
    files: glob.sync('resources/views/**/*.{html,php,twig}')
		.concat(glob.sync('public/assets/**/*.{css,gif,jpg,js,png,svg,webp,woff}')),
    server: false, // Static file server
    proxy: 'https://monthlyreports.dev',
    port: 3000
};