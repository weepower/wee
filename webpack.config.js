const { resolve } = require('path');
const webpack = require('webpack');
const prod = process.env.NODE_ENV === 'production';

module.exports = {
	context: resolve('resources/assets'),
	entry: {
		app: './scripts/app.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: resolve(__dirname, 'public/assets/scripts'),
		pathinfo: prod === false
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.vue/,
				loader: 'vue-loader'
			},
			{
				test: /\.js/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}
		]
	}
};