import { useEffect, useState, useReducer } from '@wordpress/element'

import { useRouter } from '../contexts/router'
import { getCollection } from '../../common/utils/wp-fetch'

/**
 * @typedef WpIdentifiers
 * @prop {string} model
 * @prop {string} endpoint
 * @prop {string} parent
 */

/**
 * @typedef WpCollection
 * @prop {Array.<object>} list
 * @prop {number} page
 * @prop {number} totalPages
 */

/** @typedef {Object.<string, any> | WpCollection | string} Payload */

/**
 * @typedef Action
 * @prop {string} type
 * @prop {Payload} payload
 */

/**
 * @typedef {import('react').Dispatch<Action>} Dispatcher
 */

/** @type {Object.<string, (state: WpCollection, payload: Payload) => WpCollection>} */
const actions = {
	/** Update the list of maps */
	setList(state, newList) {
		return { ...state, ...newList }
	},

	/** Update a map in the list */
	update(state, newItem) {
		// Get position of updated map in the map list
		const pos = state.list.findIndex(item => item.id === newItem.id)

		// Create new list with updated map and return state with the new list
		const newList = Object.assign([], state.list, { [pos]: newItem })
		return { ...state, list: newList }
	},

	/** Add a new map to the list and select it if required. */
	add(state, newItem) {
		return { ...state, list: [...state.list, newItem] }
	},

	/** Remove a collection from the list */
	delete(state, id) {
		const newList = state.list.filter(item => item.id !== id)
		return { ...state, list: newList }
	},
}

/**
 * @param {State} state
 * @param {Action} action
 * @returns
 */
function reducer(state, action) {
	const fn = actions[action.type]
	if (typeof fn !== 'function') throw new Error(action.type + ' is not a valid dispatch action')

	const newState = fn.call(null, state, action.payload)
	return newState
}

/**
 * Import collection from wordpress and dispatch it to global state.
 *
 * @param {WpIdentifiers} identifiers The name of the collection as registered in wordpress.
 * @param {object} query The query to use when fetching the collection.
 * @param {WpCollection} initialState The initializer value for the collection state. {list: [], page: 1}
 * @returns {[WpCollection, Dispatcher, boolean]}
 */
export default function useCollection(identifiers, query, initialState) {
	const { query: appQuery } = useRouter()
	const [loading, setLoading] = useState(true)
	const [collection, dispatch] = useReducer(reducer, initialState)

	useEffect(() => {
		// Get collection from rest api, checking that parent is available if needed.
		(async () => {
			const { body, totalPages } = (!identifiers.parent || appQuery[identifiers.parent])
				? await getCollection(
					identifiers.endpoint,
					query
				)
				: { body: [] }

			// Store the collection in global state.
			dispatch({
				type: 'setList',
				payload: { list: body, page: query.page, totalPages }
			})

			// Collection is loaded.
			setLoading(false)
		})()
	}, [query])

	return [collection, dispatch, loading]
}

