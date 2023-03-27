import { useMemo } from '@wordpress/element'

import Marker from 'common/components/ol/marker'
import { getStyles } from '../../utils/marker-icons'
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
		const icon = icons.find(i => i.id === iconId)
		return icon ? icon.meta : null
	}, [marker['marker-icons']])

	if (!mi) return null

	return (
		<Marker
			position={marker.flare_loc}
			anchor={[(-mi.iconAnchor.x * mi.size), (-mi.iconAnchor.y * mi.size)]}
		>
			<Link query={{ marker: marker.id }} className={cls.link} style={{ height: mi.size }} >
				<i className={mi.loc} style={getStyles(mi)} />
			</Link>
		</Marker>
	)
}
