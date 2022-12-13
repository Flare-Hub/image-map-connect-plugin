import { render } from '@wordpress/element'

import { RouterProvider } from './contexts/router'
import App from './app'

const appDiv = document.getElementById('image-map')

render(
	<RouterProvider>
		<App />
	</RouterProvider>,
	appDiv
)
