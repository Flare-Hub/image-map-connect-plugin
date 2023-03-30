import { useSelect } from "@wordpress/data"

/**
 * Get marker details from provided posts and standalone markers
 * @param {number} layer The layer to show the markers for.
 * @param {string|false} posts Comma separated list of posts.
 * @param {boolean} showStandAlone Whether to show standalone markers.
 * @returns list of WordPress markers
 */
export default function useMarkers(layer, posts, showStandAlone) {
	return useSelect(
		select => {
			const { getEntityRecords } = select('core')

			// Get marker details for provided post IDs.
			const linkedMarkers = posts && getEntityRecords('postType', 'marker', {
				imagemaps: layer,
				_fields: 'id,marker-icons,flare_loc',
				post_types: 'linked',
				include: posts,
			})

			// Get standalone markers.
			const saMarkers = showStandAlone ? getEntityRecords('postType', 'marker', {
				imagemaps: layer,
				_fields: 'id,marker-icons,flare_loc',
				post_types: 'standalone',
			}) : []

			// Merge post and standalone markers once both have been fetched.
			if (!Array.isArray(linkedMarkers) || !Array.isArray(saMarkers)) return []
			return [...linkedMarkers, ...saMarkers]
		},
		[posts, layer, showStandAlone]
	)
}
