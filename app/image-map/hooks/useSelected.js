import { useEffect, useState } from '@wordpress/element'
import { getItem } from 'common/utils/wp-fetch'

/**
 * Get controlled state for an item selected from a collection.
 *
 * @param {string} path Base for the REST endpoint of the collection.
 * @param {number} id ID of the item to fetch from the collection.
 * @param {object} query Query parameters for fetching the item.
 * @param {object} placeholder Empty object as placeholder for a new item.
 * @param {Array} deps Reset item when these values change.
 * @returns {[object, React.Dispatch<React.SetStateAction<{}>>, boolean]} Item state
 */
export default function useSelected(path, id, query, placeholder, deps) {
	// Manage state for selected item
	const [item, setItem] = useState(placeholder)
	const [status, setStatus] = useState('loading')

	// Set state to the selected item or the placeholder for a new item,
	useEffect(() => {
		switch (id) {
			case undefined:
				setStatus('none')
				break

			case item.id:
				setStatus('loaded')
				break

			case 'new':
				setItem(placeholder)
				setStatus('new')
				break

			default:
				if (!path) break
				setStatus('loading')
				getItem(path, id, query).then(({ body }) => {
					setItem(body)
					setStatus('loaded')
				})
				break
		}
	}, deps)

	return [item, setItem, status]
}
