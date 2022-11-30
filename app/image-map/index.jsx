import { render } from '@wordpress/element'

import { RouterProvider } from './contexts/router'
import App from './app'
import { GlobalProvider } from './contexts/global'

import 'leaflet/dist/leaflet.css'

const appDiv = document.getElementById('image-map')

render(
	<GlobalProvider><RouterProvider>
		<App />
	</RouterProvider></GlobalProvider>,
	appDiv
)
