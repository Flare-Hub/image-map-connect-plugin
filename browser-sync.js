const { resolve } = require('path')
require('dotenv').config({ path: resolve(process.cwd(), 'docker.env') })

const browserSync = require("browser-sync");
const wait = require('wait-on');

const server = 'http://localhost:' + process.env.WP_PORT_MAP || 8000

// Wait for server to be available
wait({ resources: [server] })
	// Then proxy the server through browser-sync
	.then(() => browserSync({
		// Proxy the docker web server
		proxy: server,
		// Refresh on js, css or php changes
		files: [
			"inc/**/*.php",
			"assets/build/*.js",
			"assets/build/*.css",
		],
		// Don't open a browser if browsers is set to none
		open: process.env.BROWSERS !== 'none',
		// Otherwise open the provided browsers (system default if empty)
		browsers: process.env.BROWSERS
			? process.env.BROWSERS.split(',').forEach(
				browser => browser.trim()
			)
			: '',
	}))
