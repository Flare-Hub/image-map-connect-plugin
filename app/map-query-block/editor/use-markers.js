import { useEntityRecords } from "@wordpress/core-data"
import { __ } from "@wordpress/i18n"
import useNotice from "common/utils/use-notice"

/**
 * Get marker details from provided posts and standalone markers
 * @param {number} map The current map.
 * @param {number} layer The layer to show the markers for.
 * @param {string|false} posts Comma separated list of posts.
 * @param {boolean} showStandAlone Whether to show standalone markers.
 * @returns list of WordPress markers
 */
export default function useMarkers(map, layer, posts, showStandAlone) {
	// Get marker details for provided post IDs.
	const linkedQuery = posts ? {
		layers: layer,
		_fields: 'id,marker-icons,flare_loc',
		post_types: 'linked',
		include: posts,
		map,
	} : false

	const linked = useEntityRecords('postType', 'marker', linkedQuery)

	const linkedMarkerRecords = posts ? (linked.records ? linked.records : false) : []

	// Get standalone markers.
	const saQuery = showStandAlone ? {
		layers: layer,
		_fields: 'id,marker-icons,flare_loc',
		post_types: 'standalone',
		map,
	} : false

	const standAlone = useEntityRecords('postType', 'marker', saQuery)

	const saMarkerRecords = showStandAlone ? (standAlone.records ? standAlone.records : false) : []

	// Notify user if there is an issue fetching the markers.
	useNotice(
		((posts && linked.status === 'ERROR') || (showStandAlone && standAlone.status === 'ERROR')),
		__('Error loading correct markers. Please refresh the application to try again.', 'flare'),
		[posts, linked.status, showStandAlone, standAlone.status]
	)

	// Merge post and standalone markers once both have been fetched.
	if (!Array.isArray(linkedMarkerRecords) || !Array.isArray(saMarkerRecords)) return []

	return [...linkedMarkerRecords, ...saMarkerRecords]

}
