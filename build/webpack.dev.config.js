const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');
const path = require('path');

module.exports = merge(base, {
	devtool: 'eval',
	// devServer: {
	// 	// hot: true, // this enables hot reload
	// 	inline: true, // use inline method for hmr
	// 	host: "localhost",
	// 	port: 8080,
	// 	contentBase: path.join(__dirname, "public"),
	// 	watchOptions: {
	// 		poll: false // needed for homestead/vagrant setup
	// 	}
	// },
	// output: {
	// 	publicPath: 'http://localhost:8080'
	// }
});
