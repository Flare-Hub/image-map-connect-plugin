import { useEffect, useMemo, renderToString } from '@wordpress/element'
import { Icon } from '@wordpress/components'
import { Marker, useMap, Tooltip } from "react-leaflet"
import { divIcon } from 'leaflet'

import { useMarker } from "../contexts/marker"
import { getStyles } from '../utils/marker-icons'

import cls from './selected-marker-pin.module.scss'

/**
 * Set marker coordinates for a new marker
 *
 * @param {object} props
 * @param {Array<Object<string, any>>} props.icons
 */
export default function SelectedMarkerPin({ icons }) {
	const map = useMap()
	const [marker, setMarker] = useMarker()

	// Persist selected marker to prevent it from updating each key entry when updating the marker.
	const icon = useMemo(() => {
		// Ensure the marker exists and has an icon
		if (marker.status) {
			const iconId = marker['marker-icons'][0]
			if (iconId) {

				// Create a Leaflet icon using the marker icon settings.
				const mi = icons.find(i => i.id === iconId)
				return divIcon({
					html: renderToString(<Icon
						icon={mi.meta.icon}
						style={getStyles(mi.meta)}
						className={cls.pin}
					/>),
					className: '',
					iconAnchor: [0, 0]
				})
			}
		}
	}, [marker.id, marker.meta.coordinates, icons])

	// Place a new marker when clicking on the map.
	// Do not move the marker by clicking once placed.
	useEffect(() => {
		if (!map || marker.meta.coordinates) return
		const events = {
			/** Set the coordinates of the click event as the location of the marker. */
			click(e) {
				setMarker(oldMarker => ({
					...oldMarker,
					meta: { ...oldMarker.meta, coordinates: e.latlng }
				}))
			}
		}

		map.on(events)
		return () => map.off(events)
	}, [map, marker.id, marker.meta.coordinates])


	if (!marker.meta.coordinates || !icon) return null

	return (
		<Marker position={marker.meta.coordinates} icon={icon} />
	)
}
