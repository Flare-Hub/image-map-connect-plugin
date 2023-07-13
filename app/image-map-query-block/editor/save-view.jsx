import { Tooltip } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useMap } from 'common/components/ol/context';
import Control from 'common/components/ol/control';

import cls from './save-view.module.scss';
import { ReactComponent as Desktop } from './icons/macbook-fill.svg';
import { ReactComponent as Tablet } from './icons/tablet-fill.svg';
import { ReactComponent as Mobile } from './icons/smartphone-fill.svg';

/**
 * @typedef MapView
 * @property {number}                             layer  ID of the map layer to display.
 * @property {import('ol/coordinate').Coordinate} center Map center.
 * @property {number}                             zoom   Map zoom level.
 */

const DEVICE = { Desktop, Tablet, Mobile };

/**
 * Save initial setting for the map view.
 *
 * @param {Object}                  props
 * @param {string}                  props.preview Name of device type currently previewed.
 * @param {number}                  props.layer   Initial layer.
 * @param {(view: MapView) => void} props.setView Update the initialView attribute.
 */
export default function SaveView({ preview, layer, setView }) {
	const { map } = useMap();

	const Icon = DEVICE[preview];

	/** Save map position and layer to block attributes */
	function save() {
		const mapView = map?.getView();
		setView({
			center: mapView?.getCenter(),
			zoom: mapView?.getZoom(),
			layer,
		});
	}

	return (
		<Control>
			<Tooltip
				text={__(
					'See instructions in the Initial Image Frame panel',
					'flare-imc'
				)}
			>
				<button className={cls.saveButton} onClick={save}>
					{Icon ? (
						<Icon width="30px" height="30px" />
					) : (
						<i className={cls.saveButton + ' ri-lock-fill'} />
					)}
				</button>
			</Tooltip>
		</Control>
	);
}
