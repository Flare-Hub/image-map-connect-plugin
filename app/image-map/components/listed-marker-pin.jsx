import { renderToString, useMemo } from '@wordpress/element'
import { Icon } from '@wordpress/components'
import { Marker } from "react-leaflet"
import { divIcon } from 'leaflet'

import { getStyles } from '../utils/marker-icons'
import { navigate } from '../contexts/router'

/**
 * The marker pin to display for unselected markers.
 *
 * @param {object} props
 * @param {Object<string, any>} props.marker The list fields of the marker to display
 * @param {Array<Object<string, any>>} props.icons
 */
export default function ListedMarkerPin({ marker, icons }) {

	const { icon, events } = useMemo(() => {
		const iconId = marker['marker-icons'][0]
		const mi = icons.find(i => i.id === iconId)
		return {
			icon: divIcon({
				html: renderToString(<Icon icon={mi.meta.icon} style={getStyles(mi.meta)} />),
				className: '',
				iconAnchor: [0, 0]
			}),

			events: {
				click() {
					navigate({ marker: marker.id })
				}
			}
		}
	}, [marker['marker-icons'], marker.id])


	return <Marker
		position={marker.meta.coordinates}
		icon={icon}
		eventHandlers={events}
	/>
}
