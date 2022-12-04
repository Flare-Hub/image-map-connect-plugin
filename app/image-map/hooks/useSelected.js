import { useEffect, useState } from '@wordpress/element'
import { useRouter } from '../contexts/router'
import { getItem } from '../utils/wp-fetch'

const empty = { meta: {} }

/**
 * Get controlled state for an item selected from a collection.
 *
 * @param {import('./useCollection').WpIdentifiers} collection Collection itentifiers.
 * @param {object} query Query parameters for fetching the item.
 * @param {object} placeholder Empty object as placeholder for a new item.
 * @returns {[object, React.Dispatch<React.SetStateAction<{}>>]} Item state
 */
export default function useSelected(collection, query, placeholder) {
	const { query: queryparams } = useRouter()
	const selected = queryparams[collection.model]

	// Manage state for selected item
	const [item, setItem] = useState(empty)

	// Set state to the selected item or the placeholder for a new item,
	useEffect(async () => {
		switch (selected) {
			case item.id:
				break

			case undefined:
				item.id && setItem(empty)
				break

			case 'new':
				setItem(placeholder)
				break

			default:
				const newItem = await getItem(collection.endpoint, selected, query)
				setItem(newItem.body)
				break
		}
	}, [queryparams])

	return [item, setItem]
}
