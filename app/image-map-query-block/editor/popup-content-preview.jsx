import { __ } from '@wordpress/i18n';
import cls from './popup-preview.module.scss';

/** @typedef {import('../../admin-page/components/markers/marker-form').Marker} Marker */
/**
 * Render the popup content for the editor.
 *
 * @param {Object}                 props
 * @param {Marker}                 props.marker   The marker to render in the popup.
 * @param {import('./edit').Popup} props.settings The popup setting defined in the block.
 */
export default function PopupContentPreview({
	marker,
	settings: { dimensions, excerpt, image, margins, meta, title },
}) {
	// Get human readable publish date of the marker.
	const publishDate = new Date(marker.date).toLocaleDateString(
		{},
		{ dateStyle: 'long' }
	);

	return (
		<div
			style={{
				width: dimensions.width,
				maxHeight: dimensions.height,
			}}
			className={cls.container}
		>
			{marker.imc_img_tag && image.show && (
				<figure
					dangerouslySetInnerHTML={{ __html: marker.imc_img_tag }}
					style={{
						aspectRatio:
							image.height && image.width
								? `${image.height} / ${image.width}`
								: null,
					}}
					className={cls.image}
				/>
			)}
			<div
				style={{
					marginTop: margins.top,
					marginRight: margins.right,
					marginBottom: margins.bottom,
					marginLeft: margins.left,
				}}
			>
				{title.show && (
					<title.tag className={cls.title}>
						{marker.title.rendered}
					</title.tag>
				)}
				{meta.show && (
					<div
						style={{
							fontSize: meta.size,
							marginTop: meta.marginTop,
						}}
					>
						{marker._embedded?.author?.[0].name} | {publishDate}
					</div>
				)}
				{marker.excerpt.rendered && excerpt.show && (
					<div
						style={{
							fontSize: excerpt.size,
							lineHeight: excerpt.line,
							marginTop: excerpt.marginTop,
						}}
						dangerouslySetInnerHTML={{
							__html: marker.excerpt.rendered,
						}}
					/>
				)}
				{marker.type !== 'imc-marker' && (
					<div
						className="flare-popup-readmore"
						style={{
							fontSize: excerpt.size,
							lineHeight: excerpt.line,
						}}
					>
						{__('Read more')}...
					</div>
				)}
			</div>
		</div>
	);
}
