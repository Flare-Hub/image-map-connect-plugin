import { useMemo, useState, useEffect, useCallback } from '@wordpress/element';
import { useFormContext } from 'react-hook-form';
import { DragPan } from 'ol/interaction';

import Marker from 'common/components/ol/marker';
import { useMap } from 'common/components/ol/context';
import { getStyles } from '../../utils/marker-icons';

import cls from './selected-marker-pin.module.scss';

/** @typedef {import ('.').Position} Position */

/**
 * Set marker coordinates for a new marker
 *
 * @param {Object}                                            props
 * @param {Array<import('../../utils/marker-icons').IconImg>} props.icons       List of possible pin icons.
 * @param {Position}                                          props.newPosition Position where a new marker is added.
 * @param {(pos: Position) => void}                           props.onMove      Called when a pin move is complete.
 */
export default function SelectedMarkerPin( { icons, newPosition, onMove } ) {
	// Set up state
	const { watch } = useFormContext();
	const { map } = useMap();

	/** @type {[Position, (pos: Position) => void]} Coordinates of the marker */
	const [ position, setPosition ] = useState( {} );

	// Reset coordinates when marker selection changes.
	useEffect( () => {
		if ( newPosition ) setPosition( newPosition );
	}, [ newPosition ] );

	// True after a move is complete.
	const [ moved, setMoved ] = useState( false );

	// Set marker icon for the current marker
	const iconId = watch( 'imc_icons.0' );
	const mi = useMemo( () => {
		if ( ! iconId ) return;
		return icons?.find( ( i ) => i.id === iconId );
	}, [ iconId, icons ] );

	// Update the marker pin position as it is being dragged.
	const handlePointerMove = useCallback(
		/** @param {import('ol').MapBrowserEvent} e */
		( e ) =>
			setPosition( { lng: e.coordinate[ 0 ], lat: e.coordinate[ 1 ] } ),
		[]
	);

	// Reset handlers when drag is complete.
	const handleMouseUp = useCallback( () => {
		// Unregister handlers
		map?.un( 'pointermove', handlePointerMove );
		window.removeEventListener( 'mouseup', handleMouseUp );

		// Reenable map panning.
		map?.getInteractions().forEach( ( i ) => {
			if ( i instanceof DragPan ) i.setActive( true );
		} );

		// Let the component know that dragging is complete.
		setMoved( true );
	}, [ handlePointerMove, map ] );

	/**
	 * Register handlers when holding the mouse down on the selected marker.
	 *
	 * @param {MouseEvent} e
	 */
	function handleMouseDown( e ) {
		e.stopPropagation();
		// Disable map panning.
		map?.getInteractions().forEach( ( i ) => {
			if ( i instanceof DragPan ) i.setActive( false );
		} );

		// Let component know that move is in progress
		setMoved( false );

		// Register drag handlers
		map?.on( 'pointermove', handlePointerMove );
		window.addEventListener( 'mouseup', handleMouseUp );
	}

	// Save the pin position to the marker when dragging is complete
	useEffect( () => {
		if ( moved ) onMove( position );
	}, [ moved ] ); // eslint-disable-line react-hooks/exhaustive-deps

	// Make sure everything is loaded.
	if ( ! mi || ! position.lat || ! position.lng ) return null;

	return (
		<Marker
			position={ position }
			anchor={ [
				-mi.img.iconAnchor.x * mi.size,
				-mi.img.iconAnchor.y * mi.size,
			] }
		>
			{ /* Unable to find a suitable aria role for a draggable marker. */ }
			{ /*	eslint-disable-next-line jsx-a11y/no-static-element-interactions */ }
			<div
				className={ cls.pin }
				style={ { height: mi.size } }
				onMouseDown={ handleMouseDown }
			>
				<i className={ mi.img.ref } style={ getStyles( mi ) } />
			</div>
		</Marker>
	);
}
