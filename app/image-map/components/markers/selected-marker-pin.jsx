import { useMemo, useState, useEffect, useCallback } from '@wordpress/element'
import { Icon } from '@wordpress/components'

import { getStyles } from '../../utils/marker-icons'
import { useMarker } from "../../contexts/marker"
import Marker from '../ol/marker'
import { useMap } from '../ol/context'
import { DragPan } from 'ol/interaction'

import cls from './selected-marker-pin.module.scss'

/**
 * Set marker coordinates for a new marker
 *
 * @param {object} props
 * @param {Array<Object<string, any>>} props.icons
 * @param {Object<string, any>} props.selected
 */
export default function SelectedMarkerPin({ icons, selected }) {
	// Set up state
	const { marker, setMarker } = useMarker()
	const { map } = useMap()

	/** @typedef {{lng: number, lat: number}} Position */
	/**
	 * Coordinates of the marker
	 * @type {[Position, (pos: Position) => void]}
	 * */
	const [position, setPosition] = useState(selected.flare_loc)

	// True after a move is complete.
	const [moved, setMoved] = useState(false)

	// Set marker icon for the current marker
	const iconId = selected['marker-icons'][0]

	const mi = useMemo(() => {
		if (!iconId) return
		return icons.find(i => i.id === iconId)
	}, [marker['marker-icons']])

	// Update the marker pin position as it is being dragged.
	const handlePointerMove = useCallback(
		/** @param {import('ol').MapBrowserEvent} e */
		e => setPosition({ lng: e.coordinate[0], lat: e.coordinate[1] }),
		[]
	)

	// Reset handlers when drag is complete.
	const handleMouseUp = useCallback(() => {
		// Unregister handlers
		map.un('pointermove', handlePointerMove)
		window.removeEventListener('mouseup', handleMouseUp)

		// Reenable map panning.
		map.getInteractions().forEach(i => {
			if (i instanceof DragPan) i.setActive(true)
		})

		// Let the component know that dragging is complete.
		setMoved(true)
	}, [])

	/**
	 * Register handlers when holding the mouse down on the selected marker.
	 *
	 * @param {MouseEvent} e
	 */
	function handleMouseDown(e) {
		e.stopPropagation()
		// Disable map panning.
		map.getInteractions().forEach(i => {
			if (i instanceof DragPan) i.setActive(false)
		})

		// Let component know that move is in progress
		setMoved(false)

		// Register drag handlers
		map.on('pointermove', handlePointerMove)
		window.addEventListener('mouseup', handleMouseUp)
	}

	// Save the pin position to the marker when dragging is complete
	useEffect(() => {
		if (moved) {
			setMarker(oldMarker => ({ ...oldMarker, flare_loc: position }))
		}
	}, [moved])

	// Make sure everything is loaded.
	if (!mi) return null

	return (
		<Marker
			position={position}
			anchor={mi.meta.iconAnchor}
		>
			<Icon
				icon={mi.meta.icon}
				style={getStyles(mi.meta)}
				className={cls.pin}
				onMouseDown={handleMouseDown}
			/>
		</Marker >
	)
}
