import { renderToString, useMemo } from '@wordpress/element'
import { Icon } from '@wordpress/components'
import { Marker } from "react-leaflet"
import { divIcon } from 'leaflet'
import { getStyles } from '../utils/marker-icons'

import { useMarker } from '../contexts/marker'

/**
 * List of Leaflet markers to display on a map.
 *
 * @param {object} props
 * @param {Array<Object<string, any>>} props.markers List of marker CPTs.
 * @param {Array<Object<string, any>>} props.icons List of marker-icon terms.
 */
export default function MarkerPinList({ markers, icons }) {
	const [selectedMarker] = useMarker()

	if (!markers || !icons) return null

	// Persist the component list of all markers to be displayed on the map.
	const markerPins = useMemo(() => {
		return markers.map(marker => {
			const iconId = marker['marker-icons'][0]

			// Only display markers with icons and exclude the selected marker (it has it's own component).
			if (marker.id !== selectedMarker.id && iconId) {
				// Create a Leaflet icon for each marker, using the marker icon settings.
				const mi = icons.find(i => i.id === iconId)
				const icon = divIcon({
					html: renderToString(<Icon icon={mi.meta.icon} style={getStyles(mi.meta)} />),
					className: '',
					iconAnchor: [0, 0]
				})

				return (
					<Marker key={marker.id} position={marker.meta.coordinates}
						icon={icon}
					></Marker>
				)
			}
		})
	}, [selectedMarker.id, markers])

	return markerPins
}
