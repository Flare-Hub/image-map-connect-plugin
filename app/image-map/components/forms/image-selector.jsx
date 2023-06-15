import { useEffect, useState, forwardRef } from '@wordpress/element'
import { BaseControl, Button } from '@wordpress/components'
import { __ } from '@wordpress/i18n';

import useMediaMgr from '../../hooks/useMediaMgr';
import useNotice from '../../hooks/useNotice';

import cls from '../forms/edit-form.module.scss'

/**
 * Selector to select image and display selected image.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {number} props.value
 * @param {(image: Object<string, any>) => void} props.onChange
 * @param {string} props.className
 */
function ImageSelector({ label, value, onChange, className }, ref) {
	const [mediaImg, setMediaImg] = useState()

	/** Store selected image in state and pass it on to the parent component. */
	async function handleSelect(selImages) {
		if (selImages) {
			const newImg = await selImages.first().fetch()
			setMediaImg(newImg)
			onChange && onChange(newImg ? newImg.id : null)
		} else {
			setMediaImg(null)
			onChange(null)
		}
	}

	// Initiate Wordpress media manager to select a featured image.
	const mediaMgr = useMediaMgr(false, handleSelect)

	const createNotice = useNotice()

	// Update the image state when the image id changes.
	useEffect(() => {
		const promise = value
			? wp.media.attachment(value).fetch()
			: Promise.resolve(null)

		promise.then(newImg => {
			console.log({ value, newImg });
			setMediaImg(newImg)
		})
			.catch(() => createNotice({
				message: __('Unable to load featured image.', 'flare'),
				style: 'error'
			}))
	}, [value])

	// Reset image state before unmounting component.
	useEffect(() => {
		return () => onChange(null)
	}, [])

	return (
		<BaseControl label={label} className={className}>
			{mediaImg && <img
				src={mediaImg.sizes.thumbnail.url}
				alt={mediaImg.alt}
				width={mediaImg.sizes.thumbnail.width}
				height={mediaImg.sizes.thumbnail.height}
				className={`${cls.featured} ${cls.border}`}
			/>}
			<div className={cls.featuredButtons}>
				<Button variant='secondary' onClick={() => mediaMgr.open()} ref={ref}>
					{mediaImg ? 'Update' : 'Select image'}
				</Button>
				{mediaImg && (
					<Button variant='secondary' isDestructive onClick={() => handleSelect(null)} >
						Delete
					</Button>
				)}
			</div>
		</BaseControl>
	)
}

export default forwardRef(ImageSelector)
