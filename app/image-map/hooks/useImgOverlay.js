import { useState, useEffect } from '@wordpress/element'
import { latLng, latLngBounds } from 'leaflet';

/**
 * Create a controlled state to provide the necessary details for an image overlay
 * based on an attachment id.
 *
 * @param {number} imageId Id of the attachment to use.
 * @returns Image overlay object
 */
export default function useImgOverlay(imageId) {
	const [overlay, setOverlay] = useState()

	useEffect(async () => {
		if (imageId) {
			const img = await window.wp.media.attachment(imageId).fetch()
			setOverlay({
				url: img.url,
				bounds: latLngBounds(latLng(0, 0), latLng(+img.height, +img.width)),
				center: latLng(+img.height / 2, +img.width / 2)
			})
		}
	}, [imageId])

	return overlay
}
