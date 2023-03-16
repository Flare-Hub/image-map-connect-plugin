import { useRef, useEffect, useMemo } from '@wordpress/element'
import { Map } from 'ol'

import { MapProvider } from './context'

import 'ol/ol.css'
import cls from './map.module.scss'

/**
 * Map with image overlay.
 *
 * @param {object} props
 * @param {Object<string, any>} props.layer The Wordpress layer
 * @param {Object<string, (any) => void>} props.eventHandlers Event handlers for OL map events.
 * @param {Object<string, (any) => void>} props.oneTimeHandlers One time event handlers for OL map events.
 * @param {string} props.className Class for the map container.
 * @param {import('react').CSSProperties} props.style Inline styling.
 */
export default function OlMap({ eventHandlers = {}, oneTimeHandlers = {}, className, style, children }) {
	// Div to add the map to.
	const mapTarget = useRef()

	/** OpenLayers Map with initial view. */
	const map = useMemo(
		() => new Map(),
		[]
	)

	// After mounting the component.
	useEffect(() => {
		// Register one time event handlers.
		Object.entries(oneTimeHandlers).forEach(([evt, handler]) => {
			map.once(evt, handler)
		})

		// Register event handlers.
		Object.entries(eventHandlers).forEach(([evt, handler]) => {
			map.on(evt, handler)
		})

		// Add the map to the dom.
		map.setTarget(mapTarget.current)

		// Remove event handlers on unmount
		return () => {
			Object.entries(eventHandlers).forEach(([evt, handler]) => {
				map.un(evt, handler)
			})

		}
	}, [])

	return (
		<MapProvider value={{ map }}>
			<div className={cls.map + (className ? ' ' + className : '')} style={style} ref={mapTarget}>
				{children}
			</div>
		</MapProvider>
	)
}
