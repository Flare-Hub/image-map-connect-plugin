import { useEffect, useState, forwardRef } from '@wordpress/element'
import { BaseControl, Button } from '@wordpress/components'

import useMediaMgr from '../../hooks/useMediaMgr';

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

	// Update the image state when the image id changes.
	useEffect(() => {
		if (!value) return
		wp.media.attachment(value).fetch({
			success: newImg => {
				setMediaImg(newImg.attributes)
			}
		})
	}, [value])

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
