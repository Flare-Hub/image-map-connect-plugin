/** External Dependencies */
const { resolve } = require('path')

/** WordPress Dependencies */
const defaultConfig = require('@wordpress/scripts/config/webpack.config.js');

module.exports = {
	...defaultConfig,
	entry: () => ({
		...defaultConfig.entry(),
		'image-map/index': resolve(__dirname, 'app', 'image-map', 'index.jsx'),
	}),
	output: {
		path: resolve(__dirname, 'assets/build'),
	},
}
