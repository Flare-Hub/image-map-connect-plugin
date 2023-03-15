import { useRef, useEffect, useMemo } from '@wordpress/element'
import { Map, View } from 'ol'
import Projection from 'ol/proj/Projection'
import { getCenter } from 'ol/extent'

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
export default function OlMap({ layer, eventHandlers = {}, oneTimeHandlers = {}, className, style, children }) {
	if (!layer._embedded) return <div className={cls.map}></div>

	// Div to add the map to.
	const mapTarget = useRef()

	// Boundaries of the map.
	const imageExtent = [
		0,
		0,
		layer._embedded['flare:image'][0].media_details.width,
		layer._embedded['flare:image'][0].media_details.height
	]

	/** Coordinate system to use. */
	const projection = useMemo(() => new Projection({
		code: 'layer-image',
		units: 'pixels',
		extent: imageExtent,
	}), [layer._embedded['flare:image'][0].media_details])

	/** Prove a new view using the current props. */
	function getView() {
		return new View({
			center: layer.meta.initial_position.center ?? getCenter(imageExtent),
			zoom: layer.meta.initial_position.zoom ?? 1,
			minZoom: layer.meta.min_zoom,
			maxZoom: layer.meta.max_zoom,
			projection,
			extent: imageExtent,
			constrainOnlyCenter: true,
		})
	}

	/** OpenLayers Map with initial view. */
	const map = useMemo(
		() => new Map({ view: getView() }),
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

	// Reset the view when a new image is selected.
	useEffect(() => {
		map.setView(getView())
	}, [
		layer._embedded['flare:image'][0].media_details.width,
		layer._embedded['flare:image'][0].media_details.height,
	])

	// Update the view when the min or max zoom levels are changed
	useEffect(() => {
		const view = map.getView()
		view.setMinZoom(layer.meta.min_zoom)
		view.setMaxZoom(layer.meta.max_zoom)
	}, [layer.meta.min_zoom, layer.meta.max_zoom])

	return (
		<MapProvider value={{ map, imageExtent, projection }}>
			<div className={cls.map + (className ? ' ' + className : '')} style={style} ref={mapTarget}>
				{children}
			</div>
		</MapProvider>
	)
}
