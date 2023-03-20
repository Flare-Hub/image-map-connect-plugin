import { Icon } from "@wordpress/components"
import { lock } from "@wordpress/icons"
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
 * @param {(mapView: MapView) => void} props.setView Update the initialView attribute.
 */
export default function SaveView({ setView }) {
	const { map } = useMap()

	/** Save map position and layer to block attributes */
	function save() {
		const view = map.getView()
		setView({
			center: view.getCenter(),
			zoom: view.getZoom(),
			layer: map.getAllLayers().find(l => l.getVisible()).get('wpId')
		})
	}

	return (
		<Control>
			<button className={cls.saveButton} onClick={save}>
				<Icon icon={lock} size="40" />
			</button>
		</Control>
	)
}
