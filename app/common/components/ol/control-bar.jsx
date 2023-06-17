import { useLayoutEffect, useMemo } from '@wordpress/element';
import Bar from 'ol-ext/control/Bar';

import { MapProvider, useMap } from './context';

/**
 * Add slot on map to place controls into.
 *
 * @param {Object}                                    props           Props.
 * @param {import('ol-ext/control/control').position} props.position  Position to place the bar.
 * @param {string}                                    props.className Added to the bar element.
 * @param {import('react').ReactNode}                 props.children  Child nodes.
 */
export default function ControlBar( { position, className, children } ) {
	const context = useMap();

	const controlBar = useMemo( () => {
		const bar = new Bar( { className } );
		bar.setPosition( position );
		return bar;
	}, [] ); // eslint-disable-line react-hooks/exhaustive-deps

	useLayoutEffect( () => {
		context.map.addControl( controlBar );
	}, [ context.map, controlBar ] );

	return (
		<MapProvider value={ { ...context, controlBar } }>
			{ children }
		</MapProvider>
	);
}
