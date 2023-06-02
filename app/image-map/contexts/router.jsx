import { useReducer, useEffect, useMemo, useContext, createContext, Children } from '@wordpress/element'
import { createBrowserHistory } from 'history'

/** Create client-side routing manager */
const globalHistory = createBrowserHistory()

/**
 * @typedef Query
 * @prop {string} map The selected map ID.
 * @prop {string} layer The selected layer ID.
 * @prop {string} marker THe slected marker ID.
 */

/**
 * @typedef RouteContext
 * @property {Query} query The Query parameters currently in the url.
 * @property {import('history').BrowserHistory} history
 *   See https://github.com/remix-run/history/blob/main/docs/api-reference.md
 * @property {navigate} navigate Function to navigate to new query parameters.
 * @property {createUrl} createUrl Function to generate url with updated query parameters
 */

/** @type {import('react').Context<RouteContext>} Create router context */
const routeContext = createContext(null)

/**
 * Create a URL with updated query parameters.
 *
 * @param {Query} query The query parameters to change.
 */
function createUrl(query) {
	const search = new URLSearchParams(globalHistory.location.search)
	for (const param in query) {
		if (query[param] === null) {
			search.delete(param)
		} else {
			search.set(param, query[param])
		}
	}
	return '?' + search.toString()
}

/**
 * Navigate to new query parameters using client side routing.
 *
 * @param {Query} query The query parameters to change.
 * @param {Object} state Any state to pass to the next page.
 * @param {boolean} replace Replace url in history instead of pushing a new entry.
 */
export function navigate(query, state, replace = false) {
	const route = createUrl(query)
	replace ? globalHistory.replace(route, state) : globalHistory.push(route, state)
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
		<routeContext.Provider value={{ query: state.query, history: state.history, navigate, createUrl }}>
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

/**
 * Display only the children of the child route component that has a path matching the provided query parameter.
 *
 * @param {object} props
 * @param {string} props.param The query parameter to use for routing.
 * @param {string} props.rootPath The path to route to if the query parameter has no value.
 * @param {string} props.errorPath The path to route to if the query parameter value can not be matched to a path.
 * @returns The Router provider wrapper.
*/
export function Router({ param, rootPath, errorPath, children }) {
	// Get current query parameters.
	const { query } = useRouter()

	// Set routing query parameter to the root parameter if it has no value.

	useEffect(() => {
		if (!query[param]) {
			navigate({ [param]: rootPath }, null, true)
		}
	}, [])

	// Get route component that corresponds to the route in the current query.
	const route = useMemo(() => {
		const routeParam = query[param] ?? rootPath
		const childArr = Children.toArray(children)
		return childArr.find(child => child.props.path && child.props.path === routeParam)
			?? childArr.find(child => child.props.path && child.props.path === errorPath)
	}, [query])

	return route.props.children
}

/**
 * A component to allow the router to filter by route.
 * @param {object} props
 * @param {string} props.path The route to filter by
 * @returns The Route component
 */
export function Route({ path, children }) {
	return <></>
}
