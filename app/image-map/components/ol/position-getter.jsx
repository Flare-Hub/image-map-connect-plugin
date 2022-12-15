import { useMap } from './context'
import { useEffect } from '@wordpress/element'

/**
 * @typedef Position
 * @prop {import('ol/coordinate').Coordinate} enter The initial center point.
 * @prop {number} zoom The initial zoom level.
 */

/**
 * Track the position of the provided map and pass it to hte setter.
 *
 * @param {object} props
 * @param {(Position) => void} props.onMoveEnd Callback to set the position.
 */
export default function PositionGetter({ onMoveEnd, children }) {
	const { map } = useMap()

	useEffect(() => {
		function handleMoveEnd(e) {
			onMoveEnd({
				center: e.frameState.viewState.center,
				zoom: e.frameState.viewState.zoom
			})
		}

		map.on('moveend', handleMoveEnd)

		return () => map.un('moveend', handleMoveEnd)
	})

	return children ?? null
}
