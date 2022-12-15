import { renderToString, useMemo, useEffect, useRef } from '@wordpress/element'
import { Overlay } from 'ol'

import { useMap } from './context'

/** @typedef {Object<string, import('ol/events').ListenerFunction>} OverlayEventHandlers */

/**
 * Marker on an Openlayers map.
 *
 * @param {object} props
 * @param {import('ol/coordinate').Coordinate} props.position Icon coordinates on the map.
 * @param {{x: string, y: string}} props.anchor Relative position on the anchor that should be placed in the coordinates.
 * @param {OverlayEventHandlers} props.events Event handlers triggered by the marker overlay.
 */
export default function Marker({ position, anchor, events, className, children }) {
	const { map } = useMap()

	const markerDiv = useRef()

	const overlay = useMemo(() => new Overlay({
		position,
		stopEvent: false,
	}), [])

	useEffect(() => {
		overlay.setElement(markerDiv.current)
		map.addOverlay(overlay)
		return () => { map.removeOverlay(overlay) }
	}, [])

	useEffect(() => {
		for (const e in events) {
			overlay.on(e, events[e])
		}

		return () => {
			for (const e in events) {
				overlay.un(e, events[e])
			}
		}
	}, [events])

	useEffect(() => {
		overlay.setPosition(position)
	}, [position])

	// useEffect(() => {
	// 	overlay.setElement()
	// }, [children])

	return (
		<div>
			<div
				ref={markerDiv}
				style={{ marginLeft: '-' + anchor.x, marginTop: '-' + anchor.y }}
				className={className}
			>
				{children}
			</div>
		</div>
	)
}
