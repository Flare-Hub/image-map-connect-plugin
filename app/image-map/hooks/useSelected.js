import { useEffect, useState } from '@wordpress/element'
import { getItem } from '../utils/wp-fetch'

/**
 * Get controlled state for an item selected from a collection.
 *
* @param {import('../contexts/global').WpCollection} collection Collection to select item from.
 * @param {Object} placeholder Empty object as placeholder for a new item.
 * @returns {[Object, React.Dispatch<React.SetStateAction<{}>>]} Item state
 */
export default function useSelected(collection, placeholder) {
	const empty = { meta: {} }
	// Manage state for selected item
	const [item, setItem] = useState(empty)

	// Set state to the selected item, the placeholder for a new item,
	// or a blank object if no item is found.
	useEffect(async () => {
		const foundItem = (collection.selected === 'new')
			? { body: placeholder }
			: (collection.selected)
				? await getItem(collection.wp, collection.selected, { context: 'edit' })
				: { body: empty }

		setItem(foundItem.body || empty)
	}, [collection])

	return [item, setItem]
}
