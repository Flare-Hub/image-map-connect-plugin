import { useEffect, useMemo, renderToString } from '@wordpress/element'
import { Icon } from '@wordpress/components'
import { Marker, useMap } from "react-leaflet"
import { divIcon } from 'leaflet'

import { useMarker } from "../contexts/marker"

/**
 * Set marker coordinates for a new marker
 *
 * @param {object} props
 * @param {object<string, any>} props.icons
 */
export default function SelectedMarker({ icons }) {
	const map = useMap()
	const [marker, setMarker] = useMarker()

	const icon = useMemo(() => {
		if (marker.status) {
			const iconId = marker['marker-icons'][0]
			if (iconId) {
				const mi = icons.find(i => i.id === iconId)
				return divIcon({
					html: renderToString(<Icon icon={mi.meta.icon} style={{ color: mi.meta.colour }} />),
					className: ''
				})
			}
		}
	}, [marker.id, marker.meta.coordinates, icons])

	useEffect(() => {
		if (!map || marker.meta.coordinates) return
		const events = {
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

	return <Marker position={marker.meta.coordinates}
		icon={icon}
	>
	</Marker>
}
