// @flow
'use strict';

const {resolve} = require('path');

const mode = process.env.NODE_ENV;
const development = mode === 'development';
const dist = resolve(__dirname, '../dist');
const production = mode === 'production';
const src = resolve(__dirname, '../src');

module.exports = {
	development,
	dist,
	mode,
	production,
	src
};
