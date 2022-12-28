import { useMemo } from '@wordpress/element'
import { Icon } from '@wordpress/components'

import { getStyles } from '../../utils/marker-icons'
import Marker from '../ol/marker'
import Link from '../link'

import cls from './listed-marker-pin.module.scss'

/**
 * The marker pin to display for unselected markers.
 *
 * @param {object} props
 * @param {Object<string, any>} props.marker The list fields of the marker to display
 * @param {Array<Object<string, any>>} props.icons
 */
export default function ListedMarkerPin({ marker, icons }) {
	// Marker icon for the current marker
	const mi = useMemo(() => {
		const iconId = marker['marker-icons'][0]
		return icons.find(i => i.id === iconId)
	}, [marker['marker-icons']])

	return (
		<Marker
			position={marker.flare_loc}
			anchor={mi.meta.iconAnchor}
		>
			<Link query={{ marker: marker.id }} className={cls.link} >
				<Icon icon={mi.meta.icon} style={getStyles(mi.meta)} />
			</Link>
		</Marker>
	)
}
