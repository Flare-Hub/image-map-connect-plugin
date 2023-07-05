import { useState, useEffect, useCallback } from '@wordpress/element';
import { DragPan } from 'ol/interaction';

import Marker from 'common/components/ol/marker';
import { useMap } from 'common/components/ol/context';
import { getStyles } from '../../utils/marker-icons';

import cls from './selected-marker-pin.module.scss';

/** @typedef {import ('.').Position} Position */

/**
 * Set marker coordinates for a new marker
 *
 * @param {Object}                                     props
 * @param {import('../../utils/marker-icons').IconImg} props.icon        Icon details.
 * @param {Position}                                   props.newPosition Position where a new marker is added.
 * @param {(pos: Position) => void}                    props.onMove      Called when a pin move is complete.
 */
export default function SelectedMarkerPin({ icon, newPosition, onMove }) {
	// Set up state
	const { map } = useMap();

	/** @type {[Position, (pos: Position) => void]} Coordinates of the marker */
	const [position, setPosition] = useState({});

	// Reset coordinates when marker selection changes.
	useEffect(() => {
		if (newPosition) setPosition(newPosition);
	}, [newPosition]);

	// True after a move is complete.
	const [moved, setMoved] = useState(false);

	// Update the marker pin position as it is being dragged.
	const handlePointerMove = useCallback(
		/** @param {import('ol').MapBrowserEvent} e */
		(e) => setPosition({ lng: e.coordinate[0], lat: e.coordinate[1] }),
		[]
	);

	// Reset handlers when drag is complete.
	const handleMouseUp = useCallback(() => {
		// Unregister handlers
		map?.un('pointermove', handlePointerMove);
		window.removeEventListener('mouseup', handleMouseUp);

		// Reenable map panning.
		map?.getInteractions().forEach((i) => {
			if (i instanceof DragPan) i.setActive(true);
		});

		// Let the component know that dragging is complete.
		setMoved(true);
	}, [handlePointerMove, map]);

	/**
	 * Register handlers when holding the mouse down on the selected marker.
	 *
	 * @param {MouseEvent} e
	 */
	function handleMouseDown(e) {
		e.stopPropagation();
		// Disable map panning.
		map?.getInteractions().forEach((i) => {
			if (i instanceof DragPan) i.setActive(false);
		});

		// Let component know that move is in progress
		setMoved(false);

		// Register drag handlers
		map?.on('pointermove', handlePointerMove);
		window.addEventListener('mouseup', handleMouseUp);
	}

	// Save the pin position to the marker when dragging is complete
	useEffect(() => {
		if (moved) onMove(position);
	}, [moved]); // eslint-disable-line react-hooks/exhaustive-deps

	// Make sure everything is loaded.
	if (!icon || !position.lat || !position.lng) return null;

	return (
		<Marker
			position={position}
			anchor={[
				-icon.img.iconAnchor.x * icon.size,
				-icon.img.iconAnchor.y * icon.size,
			]}
		>
			{/* Unable to find a suitable aria role for a draggable marker. */}
			{/*	eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
			<div
				className={cls.pin}
				style={{ height: icon.size }}
				onMouseDown={handleMouseDown}
			>
				<i className={icon.img.ref} style={getStyles(icon)} />
			</div>
		</Marker>
	);
}
