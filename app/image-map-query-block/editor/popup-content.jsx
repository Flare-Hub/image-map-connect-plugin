import { __ } from '@wordpress/i18n';

/**
 * @typedef PopupContentProps
 * @property {import('../../admin-page/components/markers/marker-form').Marker} marker The selected marker.
 */

/**
 * Provide component that renders the popup template in mustache.
 *
 * @return {(props: PopupContentProps) => any} The component rendering the popup content.
 */
export default function getPopupContent() {
	return ({ marker }) => (
		<>
			{'{{ ^standalone }}'}
			<a className="flare-popup-link" href="{{ link }}">
				{'{{ /standalone }}'}
				{'{{ #featured_media.media_details.sizes.thumbnail }}'}
				<img
					className="flare-popup-thumbnail"
					src="{{ featured_media.media_details.sizes.thumbnail.source_url }}"
					alt="{{ featured_media.alt_text }}"
				/>
				{'{{ /featured_media.media_details.sizes.thumbnail }}'}
				<div className="flare-popup-desc">
					<div className="flare-popup-title">
						<strong>{'{{ title.rendered }}'}</strong>
					</div>
					{'{{ #excerpt.rendered }}'}
					<div className="flare-popup-excerpt">
						{'{{{ excerpt.rendered }}}'}
					</div>
					{'{{ /excerpt.rendered }}'}
					{'{{ ^standalone }}'}
					<div className="flare-popup-readmore">
						{__('Read more')}...
					</div>
					{'{{ /standalone }}'}
				</div>
				{'{{ ^standalone }}'}
			</a>
			{'{{ /standalone }}'}
		</>
	);
}
