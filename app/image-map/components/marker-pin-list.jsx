import { renderToString, useMemo } from '@wordpress/element'
import { Icon } from '@wordpress/components'
import { Marker } from "react-leaflet"
import { divIcon } from 'leaflet'

import { useMarker } from '../contexts/marker'

/**
 * List of Leaflet markers to display on a map.
 *
 * @param {object} props
 * @param {Array<Object<string,any>>} props.markers List of marker CPTs.
 * @param {Array<Object<string, any>>} props.icons List of marker-icon terms.
 */
export default function MarkerPinList({ markers, icons }) {
	const [selectedMarker] = useMarker()

	if (!markers || !icons) return null

	const markerPins = useMemo(() => {
		return markers.map(marker => {
			const iconId = marker['marker-icons'][0]
			if (marker.id !== selectedMarker.id && iconId) {
				const mi = icons.find(i => i.id === iconId)
				const icon = divIcon({
					html: renderToString(<Icon icon={mi.meta.icon} style={{ color: mi.meta.colour }} />),
					className: ''
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
