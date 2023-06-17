import { useMemo } from '@wordpress/element';

import Marker from 'common/components/ol/marker';
import { getStyles } from '../../utils/marker-icons';
import Link from '../link';

import cls from './listed-marker-pin.module.scss';

/**
 * The marker pin to display for unselected markers.
 *
 * @param {Object}                     props
 * @param {Object<string, any>}        props.marker The list fields of the marker to display
 * @param {Array<Object<string, any>>} props.icons  List of marker icon terms.
 */
export default function ListedMarkerPin( { marker, icons } ) {
	// Marker icon for the current marker
	const mi = useMemo( () => {
		const iconId = marker[ 'marker-icons' ][ 0 ];
		return icons.find( ( i ) => i.id === iconId );
	}, [ icons, marker[ 'marker-icons' ] ] ); // eslint-disable-line react-hooks/exhaustive-deps

	if ( ! mi ) return null;

	return (
		<Marker
			position={ marker.flare_loc }
			anchor={ [
				-mi.img.iconAnchor.x * mi.size,
				-mi.img.iconAnchor.y * mi.size,
			] }
		>
			<Link
				query={ { marker: marker.id } }
				className={ cls.link }
				style={ { height: mi.size } }
			>
				<i className={ mi.img.ref } style={ getStyles( mi ) } />
			</Link>
		</Marker>
	);
}
