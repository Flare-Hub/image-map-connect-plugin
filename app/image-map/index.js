import { render, createElement } from '@wordpress/element'
import App from './app'

const appDiv = document.getElementById('image-map')

render(createElement(App), appDiv)
