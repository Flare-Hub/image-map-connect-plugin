import { useContext, createContext } from '@wordpress/element'

/**
 * @typedef MapContext
 * @prop {import('ol').Map} map
 * @prop {import('ol/extent').Extent} imageExtent
 * @prop {import('ol/proj').ProjectionLike} projection
 * @prop {import('ol-ext/control/Bar').default} controlBar
 */

/**
 * Create Map context.
 * @type {React.Context<MapContext>}
 */
const mapContext = createContext(null)

export const MapProvider = mapContext.Provider

export function useMap() {
	return useContext(mapContext)
}
