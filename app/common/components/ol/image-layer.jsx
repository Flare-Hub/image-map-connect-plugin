import { useMemo, useLayoutEffect, useEffect } from '@wordpress/element'
import { View } from 'ol'
import Static from 'ol/source/ImageStatic'
import Projection from 'ol/proj/Projection'
import ImgLayer from 'ol/layer/Image'

import { useMap, MapProvider } from './context'

/**
 * Add Image layer to map.
 *
 * @param {object} props
 * @param {Object<string, any>} props.layer The Wordpress layer.
 * @param {boolean} props.visible Whether to show the layer.
 */
export default function ImageLayer({ layer = {}, visible = true, children }) {
	// Get OpenLayer objects
	const context = useMap()

	/* Get boundaries of the layer */
	const extent = [
		0,
		0,
		layer.image_source?.width ?? 0,
		layer.image_source?.height ?? 0,
	]

	// OpenLayers image layer for source.
	const imgLayer = useMemo(() => new ImgLayer({
		title: layer.name,
		baseLayer: true,
		visible,
		wpId: layer.id
	}), [])

	// Add the layer to the map after mounting.
	useLayoutEffect(() => context.map.addLayer(imgLayer), [])

	useLayoutEffect(() => {
		imgLayer.setProperties({
			title: layer.name,
			wpId: layer.id,
		})
	}, [layer.id, layer.name])

	// Coordinate system to use in the map.
	const projection = useMemo(
		() => layer.image_source
			? new Projection({
				code: 'layer-image',
				units: 'pixels',
				extent,
			})
			: null,
		[layer.image_source?.url]
	)

	// Set static source based on the image url.
	useLayoutEffect(() => {
		if (projection) {
			imgLayer.setSource(new Static({
				url: layer.image_source?.url,
				projection,
				imageExtent: extent,
			}))
		} else {
			imgLayer.setSource()
		}
	}, [projection])

	// Provide a new view using the current props and zoom.
	useEffect(() => {
		const zoom = context.map.getView().getZoom()

		if (visible) context.map.setView(new View({
			projection,
			extent,
			constrainOnlyCenter: true,
			zoom,
		}))
	}, [visible, projection])

	// Update min and max zoom based on layer.
	useEffect(() => {
		if (visible) {
			const view = context.map.getView()
			view.setMinZoom(layer.meta.min_zoom)
			view.setMaxZoom(layer.meta.max_zoom)
		}
	}, [layer.meta.min_zoom, layer.meta.max_zoom])

	return (
		<MapProvider value={{ ...context, projection, imgLayer }}>
			{children}
		</MapProvider>
	)
}
