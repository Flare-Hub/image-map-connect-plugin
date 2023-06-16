import './view.scss';
import 'ol/ol.css';
import 'ol-ext/dist/ol-ext.css';
import 'remixicon/fonts/remixicon.css';
import Map from './map';

/* global addEventListener */

// Load all maps on current page.
addEventListener( 'DOMContentLoaded', () => {
	const mapQueries = document.querySelectorAll( '.wp-block-flare-image-map' );

	mapQueries.forEach( async ( blockEl ) => {
		const map = new Map( blockEl );
		map.addMarkerSupport();
		map.initBaseLayers( +blockEl.dataset.mapId );
	} );
} );
