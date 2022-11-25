import { useContext, createContext, useReducer } from '@wordpress/element'
import { navigate } from './router'

/**
 * @typedef WpCollection
 * @prop {Array.<object>} list
 * @prop {number} parent
 * @prop {number} page
 * @prop {number} totalPages
 * @prop {number | 'new'} selected
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
	/** Set all selected items */
	setSelected(state, selected) {
		const newState = { ...state }
		for (const item in selected) {
			newState[item].selected = selected[item]
		}

		return newState
	},

	/** Update the list of maps */
	setMapList(state, maps) {
		return { ...state, maps: { ...state.maps, ...maps } }
	},

	/** Update the selected map and set the map query parameter accordingly  */
	selectMap(state, mapId) {
		navigate({ map: mapId })
		return { ...state, maps: { ...state.maps, selected: mapId } }
	},

	/** Update a map in the list */
	updateMap(state, newMap) {
		// Get position of updated map in the map list
		const mapPos = state.maps.list.findIndex(map => map.id === newMap.id)

		// Create new list with updated map and return state with the new list
		const newList = Object.assign([], state.maps.list, { [mapPos]: newMap })
		return { ...state, maps: { ...state.maps, list: newList } }
	},

	/** Add a new map to the list and select it if required. */
	addMap(state, payload) {
		if (payload.select) state = actions.selectMap(state, payload.map.id)
		return { ...state, maps: { ...state.maps, list: [...state.maps.list, payload.map] } }
	},

	/** Remove a collection from the list */
	deleteMap(state, mapId) {
		const newList = state.maps.list.filter(map => map.id !== mapId)
		return { ...state, maps: { ...state.maps, list: newList } }
	},

	/** Update the list of maps */
	setLayerList(state, layers) {
		return { ...state, layers: { ...state.layers, ...layers } }
	},

	/** Update the selected map and set the map query parameter accordingly  */
	selectLayer(state, layerId) {
		navigate({ layer: layerId })
		return { ...state, layers: { ...state.layers, selected: layerId } }
	},

	/** Update a map in the list */
	updateLayer(state, newLayer) {
		// Get position of updated map in the map list
		const layerPos = state.layers.list.findIndex(layer => layer.id === newLayer.id)

		// Create new list with updated map and return state with the new list
		const newList = Object.assign([], state.layers.list, { [layerPos]: newLayer })
		return { ...state, layers: { ...state.layers, list: newList } }
	},

	/** Add a new map to the list and select it if required. */
	addLayer(state, payload) {
		if (payload.select) state = actions.selectLayer(state, payload.layer.id)
		return { ...state, layers: { ...state.layers, list: [...state.layers.list, payload.layer] } }
	},

	/** Remove a collection from the list */
	deleteLayer(state, layerId) {
		const newList = state.layers.list.filter(layer => layer.id !== layerId)
		return { ...state, layers: { ...state.layers, list: newList } }
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
		maps: { list: [], page: 1, selected: 0 },
		layers: { list: [], page: 1, selected: 0 },
		markers: { list: [], page: 1, selected: 0 },
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
