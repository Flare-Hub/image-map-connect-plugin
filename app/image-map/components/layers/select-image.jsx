import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useFormContext } from 'react-hook-form';
import useMediaMgr from '../../hooks/useMediaMgr';
import useNotice from '../../hooks/useNotice';

/**
 * Select Image from media manager.
 *
 * @param {Object}                                   props
 * @param {(image: Object<string, unknown>) => void} props.onChange Process the selected image.
 * @param {boolean}                                  props.invalid  The field has an invalid value.
 * @param {string}                                   props.id
 */
export default function SelectImage( { onChange, invalid, id } ) {
	const [ loading, setLoading ] = useState( false );

	const { setValue } = useFormContext();

	const createNotice = useNotice();

	// Initiate Wordpress media manager to select layer image
	const mediaMgr = useMediaMgr( false, async ( selImages ) => {
		setLoading( true );

		let selImg;

		try {
			// Get selected image
			selImg = await selImages.first();
		} catch ( error ) {
			createNotice( {
				message: error.message,
				style: 'error',
			} );

			return;
		}

		// Show selected image in the map.
		setValue( 'image_source', {
			url: selImg.attributes.url,
			width: selImg.attributes.width,
			height: selImg.attributes.height,
		} );

		onChange( selImg.attributes.id );

		setLoading( false );
	} );

	return (
		<Button
			id={ id }
			disabled={ loading }
			variant="secondary"
			isDestructive={ invalid }
			onClick={ () => mediaMgr.open() }
		>
			{ __( 'Select image', 'flare-imc' ) }
		</Button>
	);
}
