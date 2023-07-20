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
 * @param {(image: Object<string, unknown>) => void} props.onChange  Process the selected image.
 * @param {boolean}                                  props.invalid   The field has an invalid value.
 * @param {import('./index').ImageSize}              props.matchSize Throw a warning if the selected image does not match this size.
 * @param {string}                                   props.id
 */
export default function SelectImage({ onChange, invalid, matchSize, id }) {
	const [loading, setLoading] = useState(false);

	const { setValue } = useFormContext();

	const createNotice = useNotice();

	// Initiate Wordpress media manager to select layer image
	const mediaMgr = useMediaMgr(false, async (selImages) => {
		setLoading(true);

		let selImg;

		try {
			// Get selected image
			selImg = await selImages.first();
		} catch (error) {
			createNotice({
				message: error.message,
				style: 'error',
			});

			return;
		}

		// Show selected image in the map.
		setValue('image_source', {
			url: selImg.attributes.url,
			width: selImg.attributes.width,
			height: selImg.attributes.height,
		});

		// Show a warning if the selected image size does not match the provided size.
		if (
			matchSize?.current?.height &&
			matchSize.current.width &&
			selImg.attributes.width !== matchSize.current.width &&
			selImg.attributes.height !== matchSize.current.height
		) {
			createNotice({
				style: 'warning',
				message: __(
					'The dimensions of the selected image are not the same as the first image. This might effect the usability for a visitor when switching layers.',
					'flare-imc'
				),
			});
		}

		onChange(selImg.attributes.id);

		setLoading(false);
	});

	return (
		<Button
			id={id}
			disabled={loading}
			variant="secondary"
			isDestructive={invalid}
			onClick={() => mediaMgr.open()}
		>
			{__('Select image', 'flare-imc')}
		</Button>
	);
}
