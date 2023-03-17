import { useEffect, useMemo } from '@wordpress/element'
import { useMap, MapProvider } from './context'
import { createImgLayer, createProjection, createSource, createView } from './layer-helpers'

/**
 * Add Image layer to map.
 *
 * @param {object} props
 * @param {string} props.layer The Wordpress layer.
 */
export default function ImageLayer({ layer, children }) {
	// Get OpenLayer objects
	const context = useMap()
	const projection = useMemo(
		() => createProjection(layer),
		[layer._embedded['flare:image'][0].source_url]
	)
	const imgLayer = useMemo(() => createImgLayer(layer, projection), [])
	// Provide a new view using the current props.
	useEffect(() => {
		context.map.setView(createView(layer, projection))
	}, [layer, projection])

	// Add the layer to the map after mounting.
	useEffect(() => context.map.addLayer(imgLayer), [])

	// Update the image source when the url changes.
	useEffect(() => {
		imgLayer.setSource(createSource(layer, projection))
	}, [projection])

	return (
		<MapProvider value={{ ...context, projection, imgLayer }}>
			{children}
		</MapProvider>
	)
}
