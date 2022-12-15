import { useMemo } from '@wordpress/element'
import { Icon } from '@wordpress/components'

import { getStyles } from '../utils/marker-icons'
import { useMarker } from "../contexts/marker"
import Marker from './ol/marker'

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

	const mi = useMemo(() => (
		icons.find(i => i.id === iconId)
	), [marker['marker-icons']])

	return (
		<Marker
			position={[selected.meta.lng, selected.meta.lat]}
			anchor={mi.meta.iconAnchor}
		>
			<Icon icon={mi.meta.icon} style={getStyles(mi.meta)} className={cls.pin} />
		</Marker >
	)

	/**
	 * Persist selected marker to prevent it from updating each key entry when updating the marker.
	 * @type {PersistentMarkerProperties}
	 */
	/** Create a Leaflet icon using the marker icon settings. */
	/** Event listener on dragend to update the marker position to the new location. */
	// events: {s
	// 	dragend(e) {
	// 		setMarker(oldMarker => ({
	// 			...oldMarker,
	// 			meta: { ...oldMarker.meta, coordinates: e.target.getLatLng() }
	// 		}))
	// 	}
	// }
}
