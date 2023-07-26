import { useEntityRecords } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import useNotice from 'common/utils/use-notice';

/**
 * Get marker details from provided posts and standalone markers
 *
 * @param {number}       map            The current map.
 * @param {number}       layer          The layer to show the markers for.
 * @param {string|false} posts          Comma separated list of posts.
 * @param {boolean}      showStandAlone Whether to show standalone markers.
 */
export default function useMarkers(map, layer, posts, showStandAlone) {
	// Get marker details for provided post IDs.
	const linkedQuery = {
		imc_layers: layer,
		_fields: 'id,imc_icons,imc_loc,type',
		post_types: 'linked',
		map,
	};

	if (posts) linkedQuery.include = posts;

	const linked = useEntityRecords('postType', 'imc-marker', linkedQuery);

	const linkedMarkerRecords = Array.isArray(linked.records)
		? linked.records
		: [];

	// Get standalone markers.
	const saQuery = showStandAlone
		? {
				imc_layers: layer,
				_fields: 'id,imc_icons,imc_loc,type',
				post_types: 'standalone',
				map,
		  }
		: false;

	const standAlone = useEntityRecords('postType', 'imc-marker', saQuery);

	const saMarkerRecords = Array.isArray(standAlone.records)
		? standAlone.records
		: [];

	// Notify user if there is an issue fetching the markers.
	useNotice(
		linked.status === 'ERROR' ||
			(showStandAlone && standAlone?.status === 'ERROR'),
		__(
			'Error loading correct markers. Please refresh the application to try again.',
			'image-map-connect'
		),
		[posts, linked.status, showStandAlone, standAlone?.status]
	);

	// Merge post and standalone markers once both have been fetched.
	if (!layer || linked.status === 'ERROR' || standAlone.status === 'ERROR')
		return [];

	return [...linkedMarkerRecords, ...saMarkerRecords];
}
