import { useState, createContext, useEffect } from '@wordpress/element'
import EditMap from '../edit-map'
import MapList from '../map-list'

// Context to hold the current page and navigate between pages.
export const RouterCtx = createContext(null)

// Map of available pages.
const pages = {
	'map-list': MapList,
	'edit-map': EditMap
}

/**
 * A wrapper component to provide routing functionality using the action query parameter.
 * @param {object} props
 * @param {function} props.children
 * @returns The Router provider wrapper.
 */
export function Router({ children }) {
	// Get the action query parameter.
	const query = new URLSearchParams(window.location.search)

	// Default to list page is action is not valid.
	function validateAction(action) {
		return pages[action] ? action : 'map-list'
	}

	// Update the query parameter with a new action.
	function setQuery(pageId) {
		// Default to the list page.
		pageId = validateAction(pageId)

		// Compose the new url.
		query.set('action', pageId)
		const url = window.location.protocol + '//'
			+ window.location.host
			+ window.location.pathname + '?'
			+ query.toString()

		// Update the browser url.
		window.history.pushState({ path: url }, '', url)
	}

	// Ensure the query parameter is set correctly on loading
	useEffect(setQuery, [])

	// Provide the page and navigation as context.
	const [page, setPage] = useState(validateAction(query.get('action')))

	const routerVal = [
		pages[page],
		newAction => {
			setQuery(newAction)
			setPage(newAction)
		}
	]

	return <RouterCtx.Provider value={routerVal}>
		{children}
	</RouterCtx.Provider>
}
