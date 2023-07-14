import { useMap } from 'common/components/ol/context';
import { useBlockContext } from './block-context';
import { useEffect } from '@wordpress/element';

/**
 * Set Map Size
 */
export default function MapSize() {
	const { map } = useMap();
	const { setMapSize } = useBlockContext();

	// Propagate map size when it changes.
	useEffect(() => {
		/** Update map size context */
		function handleSize() {
			const size = map.getSize();
			setMapSize({ width: size[0], height: size[1] });
		}
		map.on('change:size', handleSize);

		// Set initial map size.
		// handleSize();

		return () => map.un('change:size', handleSize);
	}, [map, setMapSize]);

	return null;
}
