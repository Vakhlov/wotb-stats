// @flow
'use strict';

const {development, dist, mode, src} = require('./define');
const loaders = require('./loaders');
const optimization = require('./optimization');
const plugins = require('./plugins');
const resolve = require('./resolve');

module.exports = {
	context: src,
	devServer: {
		host: 'localhost',
		port: 3030
	},
	devtool: development ? 'inline-source-map' : false,
	entry: {
		'index': ['babel-polyfill', './index.js']
	},
	mode,
	module: loaders,
	optimization,
	output: {
		filename: 'bundle.js',
		path: dist
	},
	plugins,
	resolve
};
