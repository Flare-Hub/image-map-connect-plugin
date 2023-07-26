import { useEffect, useState, forwardRef, useRef } from '@wordpress/element';
import { BaseControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import useMediaMgr from '../../hooks/useMediaMgr';
import useNotice from '../../hooks/useNotice';

import cls from '../forms/edit-form.module.scss';

/**
 * Selector to select image and display selected image.
 *
 * @param {Object}                               props
 * @param {string}                               props.label
 * @param {number}                               props.value
 * @param {(image: Object<string, any>) => void} props.onChange
 * @param {string}                               props.className
 * @param {import('react').Ref}                  ref
 */
function ImageSelector({ label, value, onChange, className }, ref) {
	const [mediaImg, setMediaImg] = useState();

	/**
	 * Store selected image in state and pass it on to the parent component.
	 *
	 * @param {Object<string, any>} selImages Selected image(s)
	 */
	async function handleSelect(selImages) {
		if (selImages) {
			const newImg = await selImages.first().fetch();
			setMediaImg(newImg);
			if (onChange) onChange(newImg ? newImg.id : null);
		} else {
			setMediaImg(null);
			onChange(null);
		}
	}

	// Initiate Wordpress media manager to select a featured image.
	const mediaMgr = useMediaMgr(false, handleSelect);

	const createNotice = useNotice();

	// Update the image state when the image id changes.
	useEffect(() => {
		const promise = value
			? wp.media.attachment(value).fetch()
			: Promise.resolve(null);

		promise
			.then((newImg) => {
				setMediaImg(newImg);
			})
			.catch(() =>
				createNotice({
					message: __(
						'Unable to load featured image.',
						'image-map-connect'
					),
					style: 'error',
				})
			);
	}, [createNotice, value]);

	// Reset image state before unmounting component.
	useEffect(() => {
		return () => onChange(null);
	}, [onChange]);

	const imgBtnId = useRef('img-' + Math.floor(Math.random() * 100000000));

	return (
		<BaseControl label={label} className={className} id={imgBtnId.current}>
			{mediaImg && (
				<img
					src={mediaImg.sizes.thumbnail.url}
					alt={mediaImg.alt}
					width={mediaImg.sizes.thumbnail.width}
					height={mediaImg.sizes.thumbnail.height}
					className={`${cls.featured} ${cls.border}`}
				/>
			)}
			<div className={mediaImg ? cls.featuredButtons : ''}>
				<Button
					id={imgBtnId.current}
					variant="secondary"
					onClick={() => mediaMgr.open()}
					ref={ref}
				>
					{mediaImg ? 'Update' : 'Select image'}
				</Button>
				{mediaImg && (
					<Button
						variant="secondary"
						isDestructive
						onClick={() => handleSelect(null)}
					>
						Delete
					</Button>
				)}
			</div>
		</BaseControl>
	);
}

export default forwardRef(ImageSelector);
