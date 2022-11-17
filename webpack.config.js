/** External Dependencies */
const { resolve } = require('path');
const { readdirSync } = require('fs')

/** WordPress Dependencies */
const defaultConfig = require('@wordpress/scripts/config/webpack.config.js');

module.exports = {
	...defaultConfig,
	entry: {
		// Common styles
		styles: resolve(__dirname, 'app/styles.scss'),
		// Add index file (js, jsx, ts or tsx) from each subdirectory as entrypoint
		...readdirSync(resolve('./app'), { withFileTypes: true })
			.reduce((entries, dirent) => {
				if (dirent.isDirectory()) {
					const dir = resolve('./app', dirent.name)
					const index = readdirSync(dir).find(file => file.match(/^index\.[jt]sx?$/))
					if (index) entries[dirent.name] = resolve(dir, index)
				}
				return entries
			}, {}),
	},
	output: {
		path: resolve(__dirname, 'assets/build'),
	},
}
