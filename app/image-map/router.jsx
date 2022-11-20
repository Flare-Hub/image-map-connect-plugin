import { useState, useEffect, Children } from '@wordpress/element'
import { createBrowserHistory } from 'history'

// Create client-side routing manager
export const history = createBrowserHistory()

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
	const search = new URLSearchParams(history.location.search)
	for (const param in query) {
		search.set(param, query[param])
	}
	const route = '?' + search.toString()

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
	const search = new URLSearchParams(history.location.search)

	// Set routing query parameter to the root parameter if it has no value.
	if (!search.get(param)) {
		search.set(param, rootPath)
		history.replace('?' + search.toString())
	}

	// Filter the child Route components to provide only the route matching the routing parameter.
	// Fall back to the error route if no route can be found.
	function filterRoutes(path) {
		const childArr = Children.toArray(children)

		return childArr.find(child => child.props.path && child.props.path === path)
			?? childArr.find(child => child.props.path && child.props.path === errorPath)
	}

	// Set the content to show in the router
	// TODO: refactor to useReducer
	let [route, setRoute] = useState(filterRoutes(search.get(param)))

	// Update the router content if the routing parameter value has changed.
	useEffect(() => {
		return history.listen(({ location }) => {
			const newSearch = new URLSearchParams(location.search)
			if (newSearch.get(param) !== search.get(param)) {
				setRoute(filterRoutes(newSearch.get(param)))
			}
		})
	})

	return route.props.children
}
