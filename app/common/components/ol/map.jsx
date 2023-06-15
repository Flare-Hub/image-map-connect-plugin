import { useRef, useEffect, useLayoutEffect, useMemo } from '@wordpress/element'
import { Map } from 'ol'

import { MapProvider } from './context'

import { getCenter } from 'ol/extent'

/**
 * @typedef MapEventHandler
 * @prop {string} event
 * @prop {boolean} once
 * @prop {(any) => void} handler
 */

/**
 * Map with image overlay.
 *
 * @param {object} props
 * @param {Object<string, any>} props.layer The Wordpress layer
 * @param {import('ol/coordinate').Coordinate} [props.center] Initial center to focus the map on.
 * @param {number} [props.zoom] Initial zoom level of the map.
 * @param {Array<MapEventHandler>} props.eventHandlers Event handlers for OL map events.
 * @param {string} props.className Class for the map container.
 */
export default function OlMap({ eventHandlers = [], center, zoom, className, children }) {
	// Div to add the map to.
	const mapTarget = useRef()

	// OpenLayers Map with initial view.
	const map = useMemo(() => new Map(), [])

	// After mounting the component.
	useLayoutEffect(() => {
		// Register event handlers.
		eventHandlers.forEach(({ event, handler, once }) => {
			const register = once ? 'once' : 'on'
			map[register].call(map, event, handler)
		})

		/** Set the initial position of the map */
		function setPosition(e) {
			const view = e.target.getView()
			if (!view) throw new Error('No view found for map. Has a visible base layer been provided?')
			const extent = view.getProjection().getExtent()
			view.setCenter(center ?? getCenter(extent))
			if (!view.getZoom()) view.setZoom(zoom ?? view.getMinZoom())
		}

		map.on('change:view', setPosition)

		// Remove event handlers on unmount
		return () => {
			eventHandlers.forEach(({ event, handler, once }) => {
				if (!once) map.un(event, handler)
			})

			map.un('change:view', setPosition)
		}
	}, [])

	useEffect(() => {
		// Add the map to the dom.
		map.setTarget(mapTarget.current)
	}, [])

	return (
		<MapProvider value={{ map }}>
			<div className={className} ref={mapTarget}>
				{children}
			</div>
		</MapProvider>
	)
}
