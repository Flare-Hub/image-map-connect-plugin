import { useEffect, useMemo } from '@wordpress/element'
import { View } from 'ol'
import ImgLayer from 'ol/layer/Image'
import Static from 'ol/source/ImageStatic'
import Projection from 'ol/proj/Projection'
import { getCenter } from 'ol/extent'

import { useMap, MapProvider } from './context'

/**
 * Description
 *
 * @param {object} props
 * @param {string} props.layer The Wordpress layer.
 */
export default function ImageLayer({ layer, children }) {
	const context = useMap()

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

	// Provide a new view using the current props.
	context.map.setView(new View({
		center: layer.meta.initial_position.center ?? getCenter(imageExtent),
		zoom: layer.meta.initial_position.zoom ?? layer.meta.min_zoom,
		minZoom: layer.meta.min_zoom,
		maxZoom: layer.meta.max_zoom,
		projection,
		extent: imageExtent,
		constrainOnlyCenter: true,
	}))

	/** Create a new static source based on the new image url */
	function refreshSource() {
		return new Static({
			url: layer._embedded['flare:image'][0].source_url,
			projection: projection,
			imageExtent: imageExtent,
		})
	}

	/** The layer that displays the image. */
	const imgLayer = useMemo(() => new ImgLayer({
		source: refreshSource()
	}), [])

	// Add the layer to the map after mounting.
	useEffect(() => {
		context.map.addLayer(imgLayer)
	}, [])

	// Update the image source when the url changes.
	useEffect(() => {
		imgLayer.setSource(refreshSource())
	}, [layer._embedded['flare:image'][0].source_url])

	return (
		<MapProvider value={{ ...context, projection, imgLayer }}>
			{children}
		</MapProvider>
	)
}
