import { Icon } from '@wordpress/components';
import { lock } from '@wordpress/icons';
import { useCallback, useEffect } from '@wordpress/element';
import { useMap } from 'common/components/ol/context';
import Control from 'common/components/ol/control';

import cls from './save-view.module.scss';

/**
 * @typedef MapView
 * @property {number}                             layer  ID of the map layer to display.
 * @property {import('ol/coordinate').Coordinate} center Map center.
 * @property {number}                             zoom   Map zoom level.
 */

/**
 * Save initial setting for the map view.
 *
 * @param {Object}                     props
 * @param {MapView}                    props.layer   Initial layer.
 * @param {(mapView: MapView) => void} props.setView Update the initialView attribute.
 */
export default function SaveView( { layer, setView } ) {
	const { map } = useMap();

	/** Save map position and layer to block attributes */
	function save() {
		const mapView = map?.getView();
		setView( {
			center: mapView?.getCenter(),
			zoom: mapView?.getZoom(),
			layer: map
				?.getLayers()
				?.getArray()
				?.find( ( l ) => l.getVisible() && l.get( 'baseLayer' ) )
				.get( 'wpId' ),
		} );
	}

	const setInitialView = useCallback(
		() => ! layer && map?.getLayers()?.getLength() && save(),
		[ layer ] // eslint-disable-line react-hooks/exhaustive-deps
	);

	useEffect( () => {
		map?.on( 'loadend', setInitialView );

		return () => map?.un( 'loadend', setInitialView );
	}, [ map, setInitialView ] );

	return (
		<Control>
			<button className={ cls.saveButton } onClick={ save }>
				<Icon icon={ lock } size="40" />
			</button>
		</Control>
	);
}
