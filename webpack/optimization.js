'use strict';

const {production} = require('./define');
const TerserPlugin = require('terser-webpack-plugin');

const optimization = production
	? {
		minimize: true,
		minimizer: [new TerserPlugin()]
	}
	: {};

module.exports = optimization;
