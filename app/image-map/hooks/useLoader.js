import { useEffect, useState } from '@wordpress/element'
import { useGlobalContext } from '../contexts/global'

import { useRouter } from '../contexts/router'
import { getCollection } from '../utils/wp-fetch'

/** @typedef {import('../contexts/global').WpCollection} WpCollection */

/**
 * Import collection from wordpress and dispatch it to global state.
 *
 * @param {WpCollection} collection The name of the collection to fetch from Wordpress
 * @param {object} query The query to use when fetching the collection.
 * @param {WpCollection | false} parent Parent collection from the global state.
 * @param {import('../contexts/global').Dispatcher} dispatcher Function to dispatch collection to global state.
 * @returns {boolean}
 */
export default function useLoader(collection, query, parent, dispatcher) {
	const { appLoading } = useGlobalContext()
	const { query: queryParams } = useRouter()
	const [loading, setLoading] = useState(true)

	useEffect(async () => {
		if (parent.selected && (collection.parent !== parent.selected || !queryParams[parent.object])) {
			// Get collection from rest api, checking that parent is available if needed.
			const { body, totalPages } = (parent === false || parent.selected)
				? await getCollection(
					collection.wp,
					query
				)
				: { body: [] }

			// Store the collection in global state.
			dispatcher({
				type: 'updateAll',
				payload: { list: body, totalPages, parent: parent ? parent.selected : false }
			})
		}

		// Collection is loaded.
		setLoading(false)
	}, [parent])

	return loading || appLoading
}

