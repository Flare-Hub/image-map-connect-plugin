import { useEffect, useMemo } from '@wordpress/element'
import ImgLayer from 'ol/layer/Image'
import Static from 'ol/source/ImageStatic'
import { useMap, MapProvider } from './context'

/**
 * Description
 *
 * @param {object} props
 * @param {string} props.url Url of the image to use as a base for the map.
 */
export default function ImageLayer({ url, children }) {
	if (!url) return null

	const context = useMap()

	/** Create a new static source based on the new image url */
	function refreshSource() {
		return new Static({
			url,
			projection: context.projection,
			imageExtent: context.imageExtent,
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
	}, [url])

	return (
		<MapProvider value={{ ...context, imgLayer }}>
			{children}
		</MapProvider>
	)
}
