/** External Dependencies */
const { resolve } = require( 'path' );
const CopyPlugin = require( 'copy-webpack-plugin' ); // eslint-disable-line import/no-extraneous-dependencies

/** WordPress Dependencies */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config.js' );

module.exports = {
	...defaultConfig,
	entry: () => ( {
		...defaultConfig.entry(),
		'image-map/index': resolve(
			__dirname,
			'app',
			'image-map',
			'index.jsx'
		),
	} ),
	output: {
		path: resolve( __dirname, 'assets/build' ),
	},
	resolve: {
		...defaultConfig.resolve,
		alias: {
			...defaultConfig.resolve.alias,
			common: resolve( __dirname, 'app', 'common' ),
		},
	},
	plugins: [
		...defaultConfig.plugins,
		new CopyPlugin( {
			patterns: [
				{ from: 'node_modules/remixicon/fonts', to: 'remixicon' },
			],
		} ),
	],
};
