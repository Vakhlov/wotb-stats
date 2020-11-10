// @flow
'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = [
	new webpack.DefinePlugin({
		'process.env': {NODE_ENV: JSON.stringify(process.env.NODE_ENV)}
	}),
	new MiniCssExtractPlugin({
		chunkFilename: '[id].css',
		filename: '[name].css'
	}),
	new HtmlWebpackPlugin({
		filename: 'index.html',
		template: 'index.html',
		title: ''
	})
];
