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
 * @param {object} props.image Details of image to display in the map.
 * @param {number} props.minZoom The minimum zoom level allowed in this map.
 * @param {number} props.maxZoom The maximum zoom level allowed in this map.
 * @param {object} props.position The initial map position.
 * @param {import('ol/coordinate').Coordinate} props.position.center The initial center point.
 * @param {number} props.position.zoom The initial zoom level.
 * @param {object} props.className Class for the map container.
 */
export default function OlMap({ image, minZoom, maxZoom, position = {}, className, children }) {
	// Div to add the map to.
	const mapTarget = useRef()

	// Boundaries of the map.
	const imageExtent = [0, 0, image.width, image.height]

	/** Coordinate system to use. */
	const projection = useMemo(() => new Projection({
		code: 'layer-image',
		units: 'pixels',
		extent: imageExtent,
	}), [])

	/** Prove a new view using the current props. */
	function getView() {
		return new View({
			center: position.center ?? getCenter(imageExtent),
			zoom: position.zoom ?? 1,
			minZoom: minZoom,
			maxZoom: maxZoom,
			projection,
			extent: imageExtent,
			constrainOnlyCenter: true,
		})
	}

	/** OpenLayers Map with initial view. */
	const map = useMemo(() => {
		// Create the map on first render.
		return new Map({
			view: getView()
		})
	}, [])

	// Add the map to the dom after mounting the component.
	useEffect(() => map.setTarget(mapTarget.current), [])

	// Update the view when a new image is selected.
	useEffect(() => {
		map.setView(getView())
	}, [image])

	return (
		<MapProvider value={{ map, imageExtent, projection }}>
			<div className={`${className} ${cls.map}`} ref={mapTarget}>
				{children}
			</div>
		</MapProvider>
	)
}
