import { useRef, useEffect, useLayoutEffect, useMemo } from '@wordpress/element'
import { Map } from 'ol'

import { MapProvider } from './context'

import cls from './map.module.scss'
import { getCenter } from 'ol/extent'

/**
 * Map with image overlay.
 *
 * @param {object} props
 * @param {Object<string, any>} props.layer The Wordpress layer
 * @param {import('ol/coordinate').Coordinate} [props.center] Initial center to focus the map on.
 * @param {number} [props.zoom] Initial zoom level of the map.
 * @param {Object<string, (any) => void>} props.eventHandlers Event handlers for OL map events.
 * @param {Object<string, (any) => void>} props.oneTimeHandlers One time event handlers for OL map events.
 * @param {string} props.className Class for the map container.
 * @param {import('react').CSSProperties} props.style Inline styling.
 */
export default function OlMap({ eventHandlers = {}, oneTimeHandlers = {}, center, zoom, className, style, children }) {
	// Div to add the map to.
	const mapTarget = useRef()

	// OpenLayers Map with initial view.
	const map = useMemo(() => new Map(), [])

	// After mounting the component.
	useLayoutEffect(() => {
		// Register one time event handlers.
		Object.entries(oneTimeHandlers).forEach(([evt, handler]) => {
			map.once(evt, handler)
		})

		// Register event handlers.
		Object.entries(eventHandlers).forEach(([evt, handler]) => {
			map.on(evt, handler)
		})

		/** Set the initial position of the map */
		function setPosition(e) {
			const view = e.target.getView()
			if (!view) throw new Error('No view found for map. Has a visible base layer been provided?')
			const extent = view.getProjection().getExtent()
			view.setCenter(center ?? getCenter(extent))
			view.setZoom(zoom ?? view.getMinZoom())
		}

		map.on('change:view', setPosition)

		// Remove event handlers on unmount
		return () => {
			Object.entries(eventHandlers).forEach(([evt, handler]) => {
				map.un(evt, handler)
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
			<div className={cls.map + (className ? ' ' + className : '')} style={style} ref={mapTarget}>
				{children}
			</div>
		</MapProvider>
	)
}
