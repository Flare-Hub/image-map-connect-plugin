import { useEffect, useState } from '@wordpress/element'

import { useRouter } from '../contexts/router'
import { getCollection } from '../utils/wp-fetch'

/** @typedef {import('../contexts/global').WpCollection} WpCollection */

/**
 * Import collection from wordpress and dispatch it to global state.
 *
 * @param {string} collection The name of the collection to fetch from Wordpress
 * @param {WpCollection | false} parent Parent collection from the global state.
 * @param {import('../contexts/global').Dispatcher} dispatcher Function to dispatch collection to global state.
 * @param {object} query The query to use when fetching the collection.
 * @returns {[boolean, (id: number) => void]}
 */
export default function useLoader(collection, parent, dispatcher, query) {
	const { query: queryParams } = useRouter()
	const [loading, setLoading] = useState(true)

	useEffect(async () => {
		if (parent === false || parent.selected || !queryParams[parent.object]) {
			// Get image maps from rest api and store the results
			const { body, totalPages } = (parent === false || parent.selected)
				? await getCollection(
					collection,
					query
				)
				: { body: [] }

			dispatcher({
				type: 'updateAll',
				payload: { list: body, totalPages }
			})

			setLoading(false)
		}
	}, [parent.selected])

	const setSelected = id => dispatcher({ type: 'select', payload: id })

	return [loading, setSelected]
}

