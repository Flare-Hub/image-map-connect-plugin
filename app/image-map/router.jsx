import { useReducer, useEffect, Children } from '@wordpress/element'
import { createBrowserHistory } from 'history'

// Create client-side routing manager
const history = createBrowserHistory()

/**
 * Create a URL from existing and new query parameters
 *
 * @param {object} query The query parameters to change.
 */
function createUrl(query) {
	const search = new URLSearchParams(history.location.search)
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
 */
export function navigate(query, state) {
	const route = createUrl(query)
	history.push(route, state)
}

/**
 * Anchor tag that uses the router to navigate.
 *
 * @param {object} props
 * @param {object} props.query The query parameters to change.
 * @param {object} props.state Any state to pass to the next page.
 * @returns Link component
 */
export function Link(props) {
	const { query, state, children, ...attr } = props

	// Determine the url to link to
	const route = createUrl(query)

	// Update the url with the new query parameters
	function setQuery(e) {
		e.preventDefault()
		history.push(route, state)
	}

	return <a href={route} onClick={setQuery} {...attr}>{children}</a>
}

/**
 * A component to allow the router to filter by route.
 * @param {object} props
 * @param {string} props.path The route to filter by
 * @returns The Route component
 */
export function Route({ path, children }) {
	return <p>The Route component needs to be placed as a direct child of Router</p>
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
	let search = new URLSearchParams(history.location.search)

	// Set routing query parameter to the root parameter if it has no value.
	if (!search.get(param)) {
		search.set(param, rootPath)
		history.replace('?' + search.toString())
	}

	// Filter the child Route components to provide only the route matching the routing parameter.
	// Fall back to the error route if no route can be found.
	function setRoute(_, newSearch) {
		const path = newSearch.get(param)
		const childArr = Children.toArray(children)

		return childArr.find(child => child.props.path && child.props.path === path)
			?? childArr.find(child => child.props.path && child.props.path === errorPath)
	}

	// Set the content to show in the router
	let [route, dispatchRoute] = useReducer(setRoute, setRoute(null, search))

	// Update the router content if the routing parameter value has changed.
	useEffect(() => {
		return history.listen(({ location }) => {
			const newSearch = new URLSearchParams(location.search)
			if (newSearch.get(param) !== search.get(param)) {
				dispatchRoute(newSearch)
				search = newSearch
			}
		})
	})

	return route.props.children
}
