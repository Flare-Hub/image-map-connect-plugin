import { useEntityRecords } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import useNotice from 'common/utils/use-notice';

/**
 * Get list of loaded records or empty list if the records should not be included.
 *
 * @param {boolean}                                            include Include the records in the marker list.
 * @param {Array<import('@wordpress/core-data').EntityRecord>} list    The records from useEntityRecords.
 */
function listIfIncluded( include, list ) {
	if ( ! include ) return [];
	if ( ! list ) return false;
	return list;
}

/**
 * Get marker details from provided posts and standalone markers
 *
 * @param {number}       map            The current map.
 * @param {number}       layer          The layer to show the markers for.
 * @param {string|false} posts          Comma separated list of posts.
 * @param {boolean}      showStandAlone Whether to show standalone markers.
 */
export default function useMarkers( map, layer, posts, showStandAlone ) {
	// Get marker details for provided post IDs.
	const linkedQuery = posts
		? {
				layers: layer,
				_fields: 'id,imc_icons,imc_loc',
				post_types: 'linked',
				include: posts,
				map,
		  }
		: false;

	const linked = useEntityRecords( 'postType', 'imc-marker', linkedQuery );

	// eslint-disable-next-line no-nested-ternary
	const linkedMarkerRecords = listIfIncluded( posts, linked.records );

	// Get standalone markers.
	const saQuery = showStandAlone
		? {
				layers: layer,
				_fields: 'id,imc_icons,imc_loc',
				post_types: 'standalone',
				map,
		  }
		: false;

	const standAlone = useEntityRecords( 'postType', 'imc-marker', saQuery );

	const saMarkerRecords = listIfIncluded(
		showStandAlone,
		standAlone.records
	);

	// Notify user if there is an issue fetching the markers.
	useNotice(
		( posts && linked.status === 'ERROR' ) ||
			( showStandAlone && standAlone?.status === 'ERROR' ),
		__(
			'Error loading correct markers. Please refresh the application to try again.',
			'flare-imc'
		),
		[ posts, linked.status, showStandAlone, standAlone?.status ]
	);

	// Merge post and standalone markers once both have been fetched.
	if (
		! Array.isArray( linkedMarkerRecords ) ||
		! Array.isArray( saMarkerRecords )
	)
		return [];

	return [ ...linkedMarkerRecords, ...saMarkerRecords ];
}
