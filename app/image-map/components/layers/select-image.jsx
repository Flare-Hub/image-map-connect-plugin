import { Button } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useState } from '@wordpress/element'
import useMediaMgr from '../../hooks/useMediaMgr'
import { useFormContext } from 'react-hook-form'

/**
 * Select Image from media manager.
 *
 * @param {object} props
 * @param {(image: Object<string, unknown>) => void} props.onChange Process the selected image.
 * @param {boolean} props.invalid The field has a valid value.
 */
export default function SelectImage({ onChange, invalid }) {
	const [loading, setLoading] = useState(false)

	const { setValue } = useFormContext()

	// Initiate Wordpress media manager to select layer image
	const mediaMgr = useMediaMgr(false, async (selImages) => {
		setLoading(true)
		// Get selected image
		const selImg = await selImages.first()

		// TODO: Handle error in selImg

		setValue('_embedded.flare:image', [{
			source_url: selImg.attributes.url,
			media_details: {
				width: selImg.attributes.width,
				height: selImg.attributes.height,
			},
		}])

		onChange(selImg.attributes.id)

		setLoading(false)
	})

	return (
		<Button disabled={loading} variant="secondary" isDestructive={invalid} onClick={() => mediaMgr.open()}>
			{__('Select image', 'flare')}
		</Button>
	)
}
