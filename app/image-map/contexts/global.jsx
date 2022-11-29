import { useContext, createContext, useReducer, useState } from '@wordpress/element'
import { navigate } from './router'

/**
 * @typedef WpCollection
 * @prop {string} object
 * @prop {Array.<object>} list
 * @prop {number} page
 * @prop {number} totalPages
 * @prop {number | 'new'} selected
 */

/** @typedef {Object.<string, any> | WpCollection | string} Payload */

/**
 * @typedef Action
 * @prop {string} type
 * @prop {Payload} payload
 */

/**
 * @typedef GlobalContext
 * @prop {WpCollection} maps
 * @prop {import('react').Dispatch<Action>} dispatchMap
 * @prop {WpCollection} layers
 * @prop {import('react').Dispatch<Action>} dispatchLayer
 * @prop {WpCollection} markers
 * @prop {import('react').Dispatch<Action>} dispatchMarker
 * @prop {Array|string>} messages
 * @prop {(error: string) => Array<string>} addMessage
 */

/** @type {import('react').Context<GlobalContext>} Global context */
const globalContext = createContext(null)

/** @type {Object.<string, (state: WpCollection, payload: Payload) => WpCollection>} */
const actions = {
	/** Update the list of maps */
	updateAll(state, newList) {
		return { ...state, ...newList }
	},

	/** Update the selected map and set the map query parameter accordingly  */
	select(state, id) {
		navigate({ [state.object]: id })
		return { ...state, selected: id }
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
	add(state, payload) {
		if (payload.select) state = actions.select(state, payload.item.id)
		return { ...state, list: [...state.list, payload.item] }
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
 * Context provider for the global state
 */
export function GlobalProvider({ children }) {
	// Use a reducers for the global collections.
	const [maps, dispatchMap] = useReducer(reducer, { object: 'map', list: [], page: 1, selected: 0 })
	const [layers, dispatchLayer] = useReducer(reducer, { object: 'layer', list: [], page: 1, selected: 0 })
	const [markers, dispatchMarker] = useReducer(reducer, { object: 'marker', list: [], page: 1, selected: 0 })

	// Handle message snackbars globally
	const [messages, setMessages] = useState([])
	const addMessage = (e) => setMessages(oldErr => oldErr.push(e))

	return (
		<globalContext.Provider value={
			{ maps, dispatchMap, layers, dispatchLayer, markers, dispatchMarker, messages, addMessage }
		}>
			{children}
		</globalContext.Provider>
	)
}

/**
 * Access the global state
 */
export function useGlobalContext() {
	return useContext(globalContext)
}
