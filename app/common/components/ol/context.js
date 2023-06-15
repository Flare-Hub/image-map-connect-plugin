import { useContext, createContext } from '@wordpress/element';

/**
 * @typedef MapContext
 * @property {import('ol').Map}                     map         The Open Layers map.
 * @property {import('ol/extent').Extent}           imageExtent The Open Layers extent
 * @property {import('ol/proj').ProjectionLike}     projection  The Open Layers projection
 * @property {import('ol-ext/control/Bar').default} controlBar  The ol-ext control bar that contains the buttons.
 */

/**
 * Create Map context.
 *
 * @type {import('react').Context<MapContext>}
 */
const mapContext = createContext( null );

export const MapProvider = mapContext.Provider;

export function useMap() {
	return useContext( mapContext );
}
