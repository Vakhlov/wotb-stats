// @flow
'use strict';

const {resolve} = require('path');
const {src} = require('./define');

module.exports = {
	alias: {
		'actions': resolve(src, 'actions'),
		'components': resolve(src, 'components'),
		'constants': resolve(src, 'constants'),
		'helpers': resolve(src, 'helpers'),
		'images': resolve(src, 'images'),
		'init': resolve(src, 'init'),
		'mock-data': resolve(src, 'mock-data'),
		'react': 'preact-compat',
		'react-dom': 'preact-compat',
		'reducers': resolve(src, 'reducers'),
		'rest': resolve(src, 'rest'),
		'settings': resolve(src, 'settings'),
		'store': resolve(src, 'store'),
		'styles': resolve(src, 'styles'),
		'templates': resolve(src, 'templates'),
		'types': resolve(src, 'types')
	},
	extensions: ['.js', '.jsx']
};
