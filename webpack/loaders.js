// @flow
'use strict';

const {development} = require('./define');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	rules: [
		{
			test: /\.jsx?$/,
			// include: [src],
			use: {
				loader: 'babel-loader'
			}
		},
		{
			test: /\.(css|less)$/,
			use: [
				{
					loader: MiniCssExtractPlugin.loader
				},
				{
					loader: 'css-loader',
					options: {
						modules: {
							localIdentName: development ? '[path][name]__[local]' : ['hash:base64'],
							mode: 'local'
						},
						sourceMap: development,
						url: true
					}
				},
				{
					loader: 'less-loader',
					options: {
						sourceMap: development
					}
				}
			]
		},
		{
			test: /\.(eot|gif|jpeg|jpg|png|ttf|woff|woff2)$/,
			use: [
				{
					loader: 'file-loader',
					options: {
						name: '[path][name]-[hash:5].[ext]'
					}
				}
			]
		}
	]
};
