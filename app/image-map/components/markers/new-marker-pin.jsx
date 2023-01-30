import { useEffect } from '@wordpress/element'

import { useMap } from "../ol/context"
import { useMarker } from "../../contexts/marker"
import SelectedMarkerPin from './selected-marker-pin'

/**
 * List of Leaflet markers to display on a map.
 *
 * @param {object} props
 * @param {Array<Object<string, any>>} props.icons
 */
export default function NewMarkerPin({ icons }) {
	const { map } = useMap()
	const { marker, setMarker, loaded } = useMarker()

	if (!icons || !marker) return null

	// Place a new marker when clicking on the map.
	// Do not move the marker by clicking once placed.
	useEffect(() => {
		if (!loaded || marker.flare_loc.lng || marker.flare_loc.lat) return

		/** Set the coordinates of the click event as the location of the marker. */
		function handleClick(e) {
			setMarker(oldMarker => ({
				...oldMarker,
				flare_loc: { lng: e.coordinate[0], lat: e.coordinate[1] }
			}))
		}

		// Add event listener to map and clean up afterwards.
		map.on('click', handleClick)
		return () => map.un('click', handleClick)
	}, [loaded, marker.id, marker.flare_loc.lng, marker.flare_loc.lat])

	if (!(marker.flare_loc.lng && marker.flare_loc.lat)) return null

	return (
		<SelectedMarkerPin key={marker.id} icons={icons} selected={marker} />
	)
}
