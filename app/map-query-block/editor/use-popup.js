import {
	useEffect,
	useState,
	renderToString,
	useMemo,
} from '@wordpress/element';
import { store as dataStore } from '@wordpress/core-data';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { Select } from 'ol/interaction';
import Popup from 'ol-ext/overlay/Popup';
import Mustache from 'mustache';
import { useMap } from 'common/components/ol/context';
import { useSelect } from '@wordpress/data';

/** @typedef {import('ol-ext/overlay/Popup').default} Popup */

/**
 * Add ol-ext popup to an OpenLayers layer.
 *
 * @param {import('ol/layer').Vector} layer OpenLayers layer to add the popup to.
 */
export default function usePopup( layer ) {
	const { map } = useMap();

	/** @type {[Popup, import('react').Dispatch<Popup>]} */
	const [ popup, setPopup ] = useState();
	const [ { postType, id }, setMarker ] = useState( {} );

	const marker = useSelect(
		( select ) =>
			select( dataStore ).getEntityRecord( 'postType', postType, id, {
				_fields:
					'id,type,status,title,excerpt,date,modified,featured_media,meta,_embedded',
				_embed: true,
			} ),
		[ postType, id ]
	);

	/** The marker popup content template provided by a WordPress hook. */
	const template = useMemo( () => {
		const PopupTemplate = applyFilters( 'marker_popup' );
		return renderToString( <PopupTemplate /> );
	}, [] );

	// Set the popup and popup state based on the selected marker
	useEffect( () => {
		/** Interaction to select markers. */
		const selector = new Select( {
			style: null,
			layers: [ layer ],
			hitTolerance: 6,
		} );

		map.addInteraction( selector );

		/** Marker popup. */
		const newPopup = new Popup( {
			popupClass: 'flare-marker-popup',
			closeBox: true,
			positioning: 'auto',
			onclose: () => selector.getFeatures().clear(),
			autoPan: { animation: { duration: 500 } },
		} );

		map.addOverlay( newPopup );

		setPopup( newPopup );

		/**
		 * Open popup for selected feature and update selected marker props.
		 *
		 * @param {{element: import('ol').Feature<import('ol/geom').Point>}} e
		 */
		function handleSelect( e ) {
			// Show loading indicator.
			const point = e.element?.getGeometry()?.getCoordinates();
			if ( point ) {
				newPopup.show(
					point,
					`<p class="flare-popup-desc flare-popup-title"><strong>${ __(
						'Loading'
					) }...</string></p>`
				);
			}

			setMarker( {
				postType: e.element?.get( 'postType' ),
				id: e.element?.get( 'markerId' ),
			} );
		}

		/** Clear selected marker on closing popup. */
		function handleDeselect() {
			setMarker( {} );
		}

		const features = selector.getFeatures();
		features.on( 'add', handleSelect );
		features.on( 'remove', handleDeselect );

		return () => {
			features.un( 'add', handleSelect );
			features.un( 'remove', handleDeselect );
			map.removeOverlay( newPopup );
		};
	}, [ layer, map ] );

	// Set the popup content based on the selected marker
	useEffect( () => {
		if ( marker ) {
			// Prepare the Mustache view object containing the marker content.
			const view = {
				...marker,
				standalone: marker.type === 'imc-marker',
			};

			if ( marker._embedded?.author ) {
				view.author = marker._embedded.author[ 0 ];
			}

			if ( marker._embedded && marker._embedded[ 'wp:featuredmedia' ] ) {
				view.featured_media =
					marker._embedded[ 'wp:featuredmedia' ][ 0 ];
			}

			// Create popup content from Mustache template.
			const content = Mustache.render( template, view );

			// Update popup with marker content.
			popup?.show( popup.getPosition(), content );
			popup?.performAutoPan();
		} else {
			popup?.hide();
		}
	}, [ marker, popup, template ] );
}