import { useState, useEffect } from '@wordpress/element'
import { latLng, latLngBounds, CRS } from 'leaflet';
import { MapContainer, ImageOverlay } from 'react-leaflet'

/**
 * Map with image overlay.
 *
 * @param {object} props
 * @param {type} props.layer The layer to display in the map.
 * @param {object} props.className Class for the map container.
 */
export default function ImageMap({ layer, className, children }) {
	const [overlay, setOverlay] = useState()

	useEffect(async () => {
		if (layer.meta.image) {
			const img = await window.wp.media.attachment(layer.meta.image).fetch()
			setOverlay({
				url: img.url,
				bounds: latLngBounds(latLng(0, 0), latLng(+img.height, +img.width)),
				center: latLng(+img.height / 2, +img.width / 2)
			})
		}
	}, [layer.meta.image])

	if (!overlay) return <></>

	return (
		<MapContainer
			crs={CRS.Simple}
			className={className}
			bounds={layer.meta.initial_bounds.length ? layer.meta.initial_bounds : overlay.bounds}
			maxZoom={layer.meta.max_zoom}
			minZoom={layer.meta.min_zoom}
			maxBounds={overlay.bounds}
		>
			{children}
			<ImageOverlay url={overlay.url} bounds={overlay.bounds} />
		</MapContainer>
	)
}
