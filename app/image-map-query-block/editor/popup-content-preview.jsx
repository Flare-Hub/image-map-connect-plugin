import { __ } from '@wordpress/i18n';

/**
 * @typedef PopupContentProps
 * @property {import('../../admin-page/components/markers/marker-form').Marker} marker The selected marker.
 */

/**
 * Provide component that renders the popup content for the editor.
 *
 * @return {(props: PopupContentProps) => any} The component.
 */
export default function getPopupContentPreview() {
	return ({ marker }) => {
		return (
			<>
				{marker.imc_img_tag && (
					<figure
						dangerouslySetInnerHTML={{ __html: marker.imc_img_tag }}
					/>
				)}
				<div className="flare-popup-desc">
					<div className="flare-popup-title">
						<strong>{marker.title.rendered}</strong>
					</div>
					{marker.excerpt.rendered && (
						<div
							className="flare-popup-excerpt"
							dangerouslySetInnerHTML={{
								__html: marker.excerpt.rendered,
							}}
						/>
					)}
					{marker.type !== 'imc-marker' && (
						<div className="flare-popup-readmore">
							{__('Read more')}...
						</div>
					)}
				</div>
			</>
		);
	};
}
