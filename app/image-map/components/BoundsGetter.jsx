import { useMapEvents } from 'react-leaflet'

/**
 * @callback BoundsHandler
 * @param {import('leaflet').Map} map
 */

/**
 * @param {import('leaflet').Map} map
 * @param {(bounds: Array) => void} setter
 */
function getBounds(map, setter) {
	const bounds = map.getBounds()
	const ne = bounds.getNorthEast()
	const sw = bounds.getSouthWest()
	setter([
		[Math.round(ne.lat), Math.round(ne.lng)],
		[Math.round(sw.lat), Math.round(sw.lng)]
	])
}

/**
 * Description
 *
 * @param {object} props
 * @param {BoundsHandler} props.onChange description
 */
export default function BoundsGetter({ onChange }) {
	const map = useMapEvents({
		moveend: () => getBounds(map, onChange),
		zoomend: () => getBounds(map, onChange),
	})
	return <></>
}
