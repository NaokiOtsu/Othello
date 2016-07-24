var path = require('path');
var webpack = require('webpack');
var BowerWebpackPlugin = require('bower-webpack-plugin');

module.exports = {
	entry: {
		common: [
			'jquery',
			'underscore',
			'backbone'
		],
		index: [
			'app',
			'Stage'
		]
	},
	output: {
		filename: '[name].bundle.js'
	},
	resolve: {
		root: [
			path.resolve('./node_modules'),
			path.resolve('./js')
		]
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel",
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery'
		}),
		new BowerWebpackPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			filename: 'common.bundle.js',
			minChunks: 10
		})
	]
};