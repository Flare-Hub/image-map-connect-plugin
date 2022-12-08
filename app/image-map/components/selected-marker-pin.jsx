import { useMemo, renderToString } from '@wordpress/element'
import { Icon } from '@wordpress/components'
import { Marker } from "react-leaflet"
import { divIcon } from 'leaflet'

import { getStyles } from '../utils/marker-icons'
import { useMarker } from "../contexts/marker"

import cls from './selected-marker-pin.module.scss'

/**
 * Set marker coordinates for a new marker
 *
 * @param {object} props
 * @param {Array<Object<string, any>>} props.icons
 * @param {Object<string, any>} props.selected
 */
export default function SelectedMarkerPin({ icons, selected }) {
	if (!selected) return null

	// Persist selected marker to prevent it from updating each key entry when updating the marker.
	const iconId = selected['marker-icons'][0]
	if (!iconId) return null

	const icon = useMemo(() => {
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
	}, [iconId])

	if (!icon) return null

	return (
		<Marker position={selected.meta.coordinates} icon={icon} />
	)
}
