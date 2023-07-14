import { __ } from '@wordpress/i18n';
import MustacheCondition from './mustache-condition';

import cls from './style.module.scss';

/** @typedef {import('../../admin-page/components/markers/marker-form').Marker} Marker */
/**
 * Render the popup content for the editor or the popup mustache template during save.
 *
 * @param {Object}                 props
 * @param {'edit'|'save'}          props.mode     Render mode.
 * @param {Marker}                 props.marker   The marker to render in the popup.
 * @param {import('./edit').Popup} props.settings The popup setting defined in the block.
 */
export default function PopupContent({
	mode,
	marker,
	settings: { dimensions, excerpt, image, margins, meta, title },
}) {
	// Get human readable publish date of the marker.
	const publishDate =
		mode === 'edit'
			? new Date(marker.date).toLocaleDateString(
					{},
					{ dateStyle: 'long' }
			  )
			: marker.date;

	return (
		<MustacheCondition
			render={mode}
			js={true}
			mustache={(children) => (
				<>
					{'{{ ^standalone }}'}
					<a className={cls.link} href={marker.link}>
						{'{{ /standalone }}'}
						{children}
						{'{{ ^standalone }}'}
					</a>
					{'{{ /standalone }}'}
				</>
			)}
		>
			<div
				style={{
					maxWidth: dimensions.width,
					maxHeight: dimensions.height,
				}}
				className={cls.container}
			>
				{image.show && (
					<MustacheCondition
						render={mode}
						js={marker.imc_img_tag}
						mustache={(children) => (
							<>
								{'{{ #imc_img_tag }}'}
								{children}
								{'{{ /imc_img_tag }}'}
							</>
						)}
					>
						<figure
							dangerouslySetInnerHTML={{
								__html: marker.imc_img_tag,
							}}
							style={{
								aspectRatio:
									image.height && image.width
										? `${image.height} / ${image.width}`
										: null,
							}}
							className={cls.image}
						/>
					</MustacheCondition>
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
						<title.tag
							className={cls.title}
							style={{ marginBottom: title.marginBottom }}
						>
							{marker.title.rendered}
						</title.tag>
					)}
					{meta.show && (
						<div
							style={{
								fontSize: meta.size,
								marginBottom: meta.marginBottom,
							}}
						>
							{marker._embedded?.author?.[0].name} | {publishDate}
						</div>
					)}
					{excerpt.show && (
						<MustacheCondition
							render={mode}
							js={marker.excerpt.rendered}
							mustache={(children) => (
								<>
									{'{{ #excerpt.rendered }}'}
									{children}
									{'{{ /excerpt.rendered }}'}
								</>
							)}
						>
							<div
								style={{
									fontSize: excerpt.size,
									lineHeight: excerpt.line,
									marginBottom: excerpt.marginBottom,
								}}
								dangerouslySetInnerHTML={{
									__html: marker.excerpt.rendered,
								}}
							/>
						</MustacheCondition>
					)}
					<MustacheCondition
						render={mode}
						js={marker.type !== 'imc-marker'}
						mustache={(children) => (
							<>
								{'{{ ^standalone }}'}
								{children}
								{'{{ /standalone }}'}
							</>
						)}
					>
						<div
							className={cls.readmore}
							style={{
								fontSize: excerpt.size,
								lineHeight: excerpt.line,
							}}
						>
							{__('Read more')}...
						</div>
					</MustacheCondition>
				</div>
			</div>
		</MustacheCondition>
	);
}
