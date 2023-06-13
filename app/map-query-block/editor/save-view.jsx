import { Icon } from "@wordpress/components"
import { lock } from "@wordpress/icons"
import { useEffect } from "@wordpress/element"
import { useMap } from "common/components/ol/context"
import Control from "common/components/ol/control"

import cls from './save-view.module.scss'

/**
 * @typedef MapView
 * @prop {number} layer ID of the map layer to display.
 * @prop {import('ol/coordinate').Coordinate} center Map center.
 * @prop {number} zoom Map zoom level.
 */

/**
 * Save initial setting for the map view.
 *
 * @param {object} props
 * @param {MapView} view Initial settings for the map view.
 * @param {(mapView: MapView) => void} props.setView Update the initialView attribute.
 */
export default function SaveView({ view, setView }) {
	const { map } = useMap()

	/** Save map position and layer to block attributes */
	function save() {
		const mapView = map?.getView()
		setView({
			center: mapView?.getCenter(),
			zoom: mapView?.getZoom(),
			layer: map?.getLayers().getArray().find(l => l.getVisible() && l.get('baseLayer')).get('wpId')
		})
	}

	function setInitialView() {
		if (!view.layer && map?.getLayers().getLength()) save()
	}

	useEffect(() => {
		map?.on('loadend', setInitialView)

		return () => map?.un('loadend', setInitialView)
	}, [map])

	return (
		<Control>
			<button className={cls.saveButton} onClick={save}>
				<Icon icon={lock} size="40" />
			</button>
		</Control>
	)
}
