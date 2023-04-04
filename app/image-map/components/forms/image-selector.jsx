import { useEffect, useState } from '@wordpress/element'
import { BaseControl, Button } from '@wordpress/components'

import useMediaMgr from '../../hooks/useMediaMgr';

import cls from '../forms/edit-form.module.scss'

/**
 * Selector to select image and display selected image.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {number} props.imageId
 * @param {(image: Object<string, any>) => void} props.onSelect
 */
export default function ImageSelector({ label, imageId, onSelect }) {
	const [mediaImg, setMediaImg] = useState()

	/** Store selected image in state and pass it on to the parent component. */
	async function handleSelect(selImages) {
		if (selImages) {
			const newImg = await selImages.first().fetch()
			setMediaImg(newImg)
			onSelect && onSelect(newImg ? newImg.id : null)
		} else {
			setMediaImg(null)
			onSelect(null)
		}
	}

	// Initiate Wordpress media manager to select a featured image.
	const mediaMgr = useMediaMgr(false, handleSelect)

	// Update the image state when the image id changes.
	useEffect(async () => {
		if (!imageId) return
		const newImg = await wp.media.attachment(imageId).fetch()
		setMediaImg(newImg)
	}, [imageId])

	return (
		<BaseControl label={label} className={cls.field}>
			{mediaImg && <img
				src={mediaImg.sizes.thumbnail.url}
				alt={mediaImg.alt}
				width={mediaImg.sizes.thumbnail.width}
				height={mediaImg.sizes.thumbnail.height}
				className={`${cls.featured} ${cls.border}`}
			/>}
			<div className={cls.featuredButtons}>
				<Button variant='secondary' onClick={() => mediaMgr.open()}>
					{mediaImg ? 'Update' : 'Select image'}
				</Button>
				{mediaImg && <Button variant='secondary' isDestructive onClick={() => handleSelect(null)} >
					Delete
				</Button>}
			</div>
		</BaseControl>
	)
}
