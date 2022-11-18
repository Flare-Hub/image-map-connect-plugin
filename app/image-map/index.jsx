import { render } from '@wordpress/element'
import { Router } from './contexts/router'
import App from './app'

const appDiv = document.getElementById('image-map')

render(<Router><App /></Router>, appDiv)
