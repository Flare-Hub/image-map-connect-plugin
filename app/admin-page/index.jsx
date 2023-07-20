import { render, createRoot } from '@wordpress/element';

import { RouterProvider } from './contexts/router';
import App from './app';

import './styles.scss';
import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';

const appDiv = document.getElementById( 'image-map-connect' );
const el = (
	<RouterProvider>
		<App />
	</RouterProvider>
);

if ( createRoot ) {
	createRoot( appDiv ).render( el );
} else {
	render( el, appDiv );
}
