import { useEffect } from '@wordpress/element'

import { useMap } from "common/components/ol/context"
import { useRouter } from '../../contexts/router'

/**
 * List of Leaflet markers to display on a map.
 *
 * @param {object} props
 * @param {(pos: import('.').Position) => void} props.onSet
 */
export default function NewMarkerPin({ onSet }) {
	const { query } = useRouter()
	const { map } = useMap()

	useEffect(() => {
		/** Set the coordinates of the click event as the location of the marker. */
		const handleClick = e => onSet({ lng: e.coordinate[0], lat: e.coordinate[1] })

		// Add event listener to map and clean up afterwards.
		map.on('click', handleClick)
		return () => map.un('click', handleClick)
	}, [query.marker])

	return null
}
