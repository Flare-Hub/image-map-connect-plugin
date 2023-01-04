import { useEffect, useState } from '@wordpress/element'
import { getItem } from '../utils/wp-fetch'

/**
 * Get controlled state for an item selected from a collection.
 *
 * @param {string} path Base for the REST endpoint of the collection.
 * @param {number} id ID of the item to fetch from the collection.
 * @param {object} query Query parameters for fetching the item.
 * @param {object} placeholder Empty object as placeholder for a new item.
 * @returns {[object, React.Dispatch<React.SetStateAction<{}>>, boolean]} Item state
 */
export default function useSelected(path, id, query, placeholder) {
	// Manage state for selected item
	const [item, setItem] = useState(placeholder)
	const [loaded, setLoaded] = useState(false)

	// Set state to the selected item or the placeholder for a new item,
	useEffect(async () => {
		switch (id) {
			case undefined:
				setLoaded(false)
				item.id && setItem(placeholder)
				break

			case item.id:
				setLoaded(true)
				break

			case 'new':
				setItem(placeholder)
				setLoaded(true)
				break

			default:
				if (!path) break
				setLoaded(false)
				const newItem = await getItem(path, id, query)
				setItem(newItem.body)
				setLoaded(true)
				break
		}
	}, [id, path])

	return [item, setItem, loaded]
}
