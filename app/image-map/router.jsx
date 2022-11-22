import { useReducer, useEffect, useContext, createContext } from '@wordpress/element'
import { createBrowserHistory } from 'history'

/** Create client-side routing manager */
const globalHistory = createBrowserHistory()

/**
 * @typedef RouteContext
 * @property {object} query The Query parameters currently in the url.
 * @property {import('history').BrowserHistory} history
 *   @see https://github.com/remix-run/history/blob/main/docs/api-reference.md
 * @property {navigate} navigate Function to navigate to new query parameters. */

/** @type {import('react').Context<RouteContext>} Create router context */
const routeContext = createContext(null)

/**
 * Create a URL from existing and new query parameters
 *
 * @param {object} query The query parameters to change.
 */
function createUrl(query) {
	const search = new URLSearchParams(window.location.search)
	for (const param in query) {
		search.set(param, query[param])
	}
	return '?' + search.toString()
}

/**
 * Navigate to new query parameters using client side routing.
 *
 * @param {object} query The query parameters to change.
 * @param {object} state Any state to pass to the next page.
 * @param {boolean} replace Replace url in history instead of pushing a new entry.
 */
function navigate(query, state, replace) {
	const route = createUrl(query)
	replace ? globalHistory.replace(route, state) : globalHistory.push(route, state)
}

/**
 * Anchor tag that uses the router to navigate.
 *
 * @param {object} props
 * @param {object} props.query The query parameters to change.
 * @param {object} props.state Any state to pass to the next page.
 * @returns Link component
 */
export function Link({ query, state, children, ...attr }) {
	// Determine the url to link to
	const route = createUrl(query)

	// Update the url with the new query parameters
	function setQuery(e) {
		e.preventDefault()
		globalHistory.push(route, state)
	}

	return <a href={route} onClick={setQuery} {...attr}>{children}</a>
}

/**
 * Context provider providing routing state.
 */
export function RouterProvider({ children }) {
	// Filter the child Route components to provide only the route matching the routing parameter.
	// Fall back to the error route if no route can be found.
	function reducer(_, newQuery) {
		const queryObj = {}
		for (const [key, val] of Array.from(newQuery.entries())) {
			queryObj[key] = val
		}

		return { query: queryObj, history: globalHistory }
	}

	// Get current query parameters.
	const query = new URLSearchParams(globalHistory.location.search)

	// Set the content to show in the router
	const [state, dispatch] = useReducer(reducer, query, reducer.bind(null, null))

	// Update the router content if the routing parameter value has changed.
	useEffect(() => {
		return globalHistory.listen(({ location }) => {
			dispatch(new URLSearchParams(location.search))
		})
	}, [])

	return (
		<routeContext.Provider value={{ query: state.query, history: state.history, navigate }}>
			{children}
		</routeContext.Provider>
	)
}

/**
 * Get the context provided by the router.
 */
export function useRouter() {
	return useContext(routeContext)
}
