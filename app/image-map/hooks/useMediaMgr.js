import { useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
/**
 * Provide the default Wordpress media manager with a handler for selected images.
 *
 * @param {boolean}                              multiple Whether to allow selecting multiple images
 * @param {(image: Object<string, any>) => void} onSelect Called when selecting an image and provided the selected image.
 * @return {Object<string, any>} The default Wordpress media manager.
 */
export default function useMediaMgr( multiple, onSelect ) {
	// Initialise media manager
	const mediaMgr = useMemo(
		() =>
			window.wp.media( {
				title: __( 'Select image' ),
				button: { text: __( 'Select image' ) },
				multiple,
			} ),
		[ multiple ]
	);

	// Load media manager
	useEffect( () => {
		// Update image and set the new image ID in the layer
		function getImage() {
			const newImage = mediaMgr.state().get( 'selection' );
			if ( onSelect ) onSelect( newImage );
		}

		// Action to take when selecting an image.
		mediaMgr.on( 'select', getImage );

		// Unregister media manager action.
		return () => mediaMgr.off( 'select', getImage );
	}, [ mediaMgr, onSelect ] );

	return mediaMgr;
}
