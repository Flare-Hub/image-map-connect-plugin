import { useMemo, renderToString } from '@wordpress/element'
import { Icon } from '@wordpress/components'
import { Marker } from "react-leaflet"
import { divIcon } from 'leaflet'

import { getStyles } from '../utils/marker-icons'
import { useMarker } from "../contexts/marker"

import cls from './selected-marker-pin.module.scss'

/**
 * @typedef PersistentMarkerProperties
 * @property {import('leaflet').DivIcon} icon
 * @property {{dragend: import('leaflet').DragEndEventHandlerFn}} events
 */

/**
 * Set marker coordinates for a new marker
 *
 * @param {object} props
 * @param {Array<Object<string, any>>} props.icons
 * @param {Object<string, any>} props.selected
 */
export default function SelectedMarkerPin({ icons, selected }) {
	const [marker, setMarker] = useMarker()

	// Make sure everything is loaded.
	const iconId = selected['marker-icons'][0]
	if (!iconId || !selected) return null

	/**
	 * Persist selected marker to prevent it from updating each key entry when updating the marker.
	 * @type {PersistentMarkerProperties}
	 */
	const { icon, events } = useMemo(() => {
		const mi = icons.find(i => i.id === iconId)
		return {
			/** Create a Leaflet icon using the marker icon settings. */
			icon: divIcon({
				html: renderToString(<Icon
					icon={mi.meta.icon}
					style={getStyles(mi.meta)}
					className={cls.pin}
				/>),
				className: '',
				iconAnchor: [0, 0]
			}),

			/** Event listener on dragend to update the marker position to the new location. */
			events: {
				dragend(e) {
					setMarker(oldMarker => ({
						...oldMarker,
						meta: { ...oldMarker.meta, coordinates: e.target.getLatLng() }
					}))
				}
			}
		}
	}, [iconId])

	if (!icon) return null

	return (
		<Marker position={selected.meta.coordinates} icon={icon} draggable eventHandlers={events} />
	)
}
