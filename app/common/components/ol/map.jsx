import {
	useRef,
	useEffect,
	useLayoutEffect,
	useMemo,
} from '@wordpress/element';
import { Map } from 'ol';

import { MapProvider } from './context';

import { getCenter } from 'ol/extent';

/**
 * @typedef MapEventHandler
 * @property {string}        event   Event name.
 * @property {boolean}       once    should this be triggered only once?
 * @property {(any) => void} handler Function to trigger.
 */

/**
 * Map with image overlay.
 *
 * @param {Object}                             props               Props.
 * @param {import('ol/coordinate').Coordinate} [props.center]      Initial center to focus the map on.
 * @param {number}                             [props.zoom]        Initial zoom level of the map.
 * @param {Array<MapEventHandler>}             props.eventHandlers Event handlers for OL map events.
 * @param {string}                             props.className     Class for the map container.
 * @param {import('react').ReactNode}          props.children      Child nodes.
 * @param {string}                             props.id
 */
export default function OlMap( {
	eventHandlers = [],
	center,
	zoom,
	className,
	id,
	children,
} ) {
	// Div to add the map to.
	const mapTarget = useRef();

	// OpenLayers Map with initial view.
	const map = useMemo( () => new Map(), [] );

	// After mounting the component.
	useLayoutEffect( () => {
		// Register event handlers.
		eventHandlers.forEach( ( { event, handler, once } ) => {
			const register = once ? 'once' : 'on';
			map[ register ].call( map, event, handler );
		} );

		/**
		 * Set the initial position of the map
		 *
		 * @param {import('ol').MapEvent} e Event
		 */
		function setPosition( e ) {
			const view = e.target.getView();
			if ( ! view )
				throw new Error(
					'No view found for map. Has a visible base layer been provided?'
				);
			const extent = view.getProjection().getExtent();
			view.setCenter( center ?? getCenter( extent ) );
			if ( ! view.getZoom() ) view.setZoom( zoom ?? view.getMinZoom() );
		}

		map.on( 'change:view', setPosition );

		// Remove event handlers on unmount
		return () => {
			eventHandlers.forEach( ( { event, handler, once } ) => {
				if ( ! once ) map.un( event, handler );
			} );

			map.un( 'change:view', setPosition );
		};
	}, [] ); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect( () => {
		// Add the map to the dom.
		map.setTarget( mapTarget.current );
	}, [ map ] );

	return (
		<MapProvider value={ { map } }>
			<div className={ className } ref={ mapTarget } id={ id }>
				{ children }
			</div>
		</MapProvider>
	);
}
