import { useEffect, useState } from '@wordpress/element'

import { getCollection, postItem, createItem, deleteItem } from "common/utils/wp-fetch";
import { useRouter } from '../contexts/router'

/**
 * @typedef WpIdentifiers
 * @prop {string} model
 * @prop {string} endpoint
 * @prop {string} parent
 */

/**
 * @typedef WpCollection
 * @prop {Array.<Object<string, unknown>>} list
 * @prop {number} page
 * @prop {number} totalPages
 */

/**
 * @typedef Actions
 * @prop {(item: Object<string, unknown>) => void} update Update an item in the collection.
 * @prop {(item: Object<string, unknown>) => void} add Add an item to the collection.
 * @prop {(item: Object<string, unknown>) => Promise<string>} save Save the provided item.
 * @prop {(id: string) => void} delete Remove an item from the list.
 */

/**
 * @typedef CollectionState
 * @prop {Actions} actions
 * @prop {boolean} loading
 * @prop {string | false} saving
 */

/** @typedef {WpCollection & CollectionState} Collection */

/**
 * Import collection from wordpress and dispatch it to global state.
 *
 * @param {WpIdentifiers} identifiers The name of the collection as registered in wordpress.
 * @param {object} query The query to use when fetching the collection.
 * @param {WpCollection} initialState The initializer value for the collection state. {list: [], page: 1}
 * @param {Array<unknown>} props.deps Dependencies that change the collection.
 * @returns {Collection}
 */
export default function useCollection(identifiers, query, initialState, deps) {
	const { query: appQuery } = useRouter()
	const [collection, setCollection] = useState(initialState)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		// Get collection from rest api, checking that parent is available if needed.
		(async () => {
			setLoading(true)
			const { body, totalPages } = (!identifiers.parent || (appQuery[identifiers.parent] !== 'new'))
				? await getCollection(
					identifiers.endpoint,
					query
				)
				: { body: [] }

			// Store the collection in global state.
			setCollection({ list: body, page: query.page, totalPages })

			// Collection is loaded.
			setLoading(false)
		})()
	}, deps)

	/** @type {Actions} */
	const actions = {
		/** Update an item in the collection. */
		update(item) {
			setCollection(prevCol => {
				// Get position of updated map in the map list.
				const pos = prevCol.list.findIndex(prevItem => prevItem.id === item.id)

				// Replace relevant item in list and return state with the new list.
				return {
					...prevCol,
					list: Object.assign([], prevCol.list, { [pos]: item })
				}
			})
		},

		/** Add an item to the collection. */
		add(item) {
			setCollection(prevCol => ({
				...prevCol,
				list: [...prevCol.list, item]
			}))
		},

		/** Update a map in the list. */
		async save(item) {
			// Register which item is being saved.
			setSaving(item.id ?? 'new')

			const saveQuery = { context: 'edit' }

			let res

			// Update item if it has an ID.
			if (item.id) {
				res = await postItem(identifiers.endpoint, item.id, item, saveQuery)
				this.update(res.body)

				// Create a new item if it doesn't have an ID.
			} else {
				res = await createItem(identifiers.endpoint, item, saveQuery)
				this.add(res.body)
			}

			setSaving(false)

			return res.body.id
		},

		/** Remove a collection from the list. */
		async delete(id) {
			// Register which item is being deleted.
			setSaving(id)

			// Update WordPress.
			const { body } = await deleteItem(identifiers.endpoint, id, { force: true })
			if (!body.deleted) throw new Error('To do: handle this!')

			// Remove item from collection
			setCollection(prevCol => ({
				...prevCol,
				list: prevCol.list.filter(item => item.id !== id)
			}))

			setSaving(false)
		},
	}


	return { ...collection, actions, loading, saving }
}

