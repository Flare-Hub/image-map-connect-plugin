import { useEffect } from '@wordpress/element'
import { useMap } from "react-leaflet"

import { useMarker } from "../contexts/marker"
import SelectedMarkerPin from './selected-marker-pin'

/**
 * List of Leaflet markers to display on a map.
 *
 * @param {object} props
 * @param {Array<Object<string, any>>} props.icons
 */
export default function NewMarkerPin({ icons }) {
	const map = useMap()
	const [marker, setMarker] = useMarker()

	if (!icons || !marker) return null

	// Place a new marker when clicking on the map.
	// Do not move the marker by clicking once placed.
	useEffect(() => {
		if (marker.meta.coordinates) return

		// Event handlers.
		const events = {
			/** Set the coordinates of the click event as the location of the marker. */
			click(e) {
				setMarker(oldMarker => ({
					...oldMarker,
					meta: { ...oldMarker.meta, coordinates: e.latlng }
				}))
			}
		}

		// Add event listener to map and clean up afterwards.
		map.on(events)
		return () => map.off(events)
	}, [marker.id, marker.meta.coordinates])

	if (!marker.meta.coordinates) return null

	return (
		<SelectedMarkerPin key={marker.id} icons={icons} selected={marker} />
	)
}
