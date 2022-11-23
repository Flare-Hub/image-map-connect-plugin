import { useContext, createContext, useReducer } from '@wordpress/element'
import { navigate } from './router'

/**
 * @typedef WpCollection
 * @prop {Array.<object>} list
 * @prop {number} page
 * @prop {number} totalPages
 * @prop {object} selected
 */

/**
 * @typedef State
 * @prop {WpCollection} maps
 * @prop {WpCollection} layers
 * @prop {WpCollection} markers
 * @prop {Array.<string>} errors
 */

/** @typedef {Object.<string, any> | WpCollection | string} Payload */

/**
 * @typedef Action
 * @prop {string} type
 * @prop {Payload} payload
 */

/**
 * @typedef Dispatcher
 * @prop {import('react').Dispatch.<Action>} dispatch
 */

/** @type {import('react').Context<State & Dispatcher>} Global context */
const globalContext = createContext(null)

/**
 * @callback doAction
 * @param {State} state
 * @param {Payload} payload
 * @return {state}
 */

/** @type {Object.<string, doAction>} */
const actions = {
	/** Update the list of maps */
	setMapList(state, maps) {
		return { ...state, maps: { ...state.maps, ...maps } }
	},

	/** Set all selected items */
	setSelected(state, selected) {
		const newState = { ...state }
		for (const [obj, item] of selected) {
			newState[obj].selected = item
		}

		return newState
	},

	/** Update the selected map and set the map query parameter accordingly  */
	selectMap(state, map) {
		navigate({ map: map.id })
		return { ...state, maps: { ...state.maps, selected: map } }
	},

	/** Update the selected map and set the layer query parameter accordingly  */
	selectLayer(state, layer) {
		return { ...state, layers: { ...state.layers, selected: layer } }
	},

	/** Update the selected map and set the marker query parameter accordingly  */
	selectMarker(state, marker) {
		return { ...state, markers: { ...state.markers, selected: marker } }
	},

	/** Add a new error message */
	setError(state, errorMsg) {
		return { ...state, errors: [...state.errors, errorMsg] }
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
	// Use a reducer for teh global state.
	const [state, dispatch] = useReducer(reducer, {
		maps: { list: [], page: 1, selected: {} },
		layers: { list: [], page: 1, selected: {} },
		markers: { list: [], page: 1, selected: {} },
		errors: []
	})

	return (
		<globalContext.Provider value={{ ...state, dispatch }}>
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
