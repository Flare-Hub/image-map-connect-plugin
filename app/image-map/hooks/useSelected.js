import { useEffect, useState } from '@wordpress/element'
import { useRouter } from '../contexts/router'
import { getItem } from '../utils/wp-fetch'

const empty = { meta: {} }

/**
 * Get controlled state for an item selected from a collection.
 *
* @param {import('./useCollection').WpIdentifiers} collection Collection itentifiers.
 * @param {Object} placeholder Empty object as placeholder for a new item.
 * @returns {[Object, React.Dispatch<React.SetStateAction<{}>>]} Item state
 */
export default function useSelected(collection, placeholder) {
	const { query } = useRouter()
	const selected = query[collection.model]

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
				const newItem = await getItem(collection.endpoint, selected, { context: 'edit' })
				setItem(newItem.body)
				break
		}
	}, [query])

	return [item, setItem]
}
