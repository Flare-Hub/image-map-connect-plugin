import { useMemo, useEffect, useRef } from '@wordpress/element'
import { Overlay } from 'ol'

import { useMap } from './context'

/** @typedef {Object<string, import('ol/events').ListenerFunction>} OverlayEventHandlers */

/**
 * Marker on an Openlayers map.
 *
 * @param {object} props
 * @param {{lng: number, lat: number}} props.position Icon coordinates on the map.
 * @param {{x: string, y: string}} props.anchor Relative position on the anchor that should be placed in the coordinates.
 * @param {OverlayEventHandlers} props.events Event handlers triggered by the marker overlay.
 * @param {string} props.className Class attached to the marker div.
 */
export default function Marker({ position, anchor, events, className, children }) {
	// Set up state
	const { map } = useMap()
	const markerDiv = useRef()

	// Create overlay when component is created.
	const overlay = useMemo(() => new Overlay({
		position: [position.lng, position.lat],
		stopEvent: false,
		offset: anchor
	}), [])

	// Add overlay to map after component is mounted.
	useEffect(() => {
		overlay.setElement(markerDiv.current)
		map.addOverlay(overlay)

		// Remove overlay when component is unmounted.
		return () => {
			map.removeOverlay(overlay)
		}
	}, [])

	// Register all event handlers with overlay if set.
	useEffect(() => {
		for (const e in events) {
			overlay.on(e, events[e])
		}

		// Unregister handlers before resetting updated ones.
		return () => {
			for (const e in events) {
				overlay.un(e, events[e])
			}
		}
	}, [events])

	// Update overlay position when marker position changes.
	useEffect(() => {
		overlay.setPosition([position.lng, position.lat])
	}, [position.lng, position.lat])

	return (
		<div>
			<div
				ref={markerDiv}
				className={className}
			>
				{children}
			</div>
		</div>
	)
}
