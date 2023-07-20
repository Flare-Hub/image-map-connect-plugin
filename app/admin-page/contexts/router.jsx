import {
	useState,
	useEffect,
	useMemo,
	useContext,
	createContext,
	Children,
} from '@wordpress/element';
import { createBrowserHistory } from 'history';

/** Create client-side routing manager */
const globalHistory = createBrowserHistory();

/**
 * @typedef Query
 * @property {string|null} [map]    The selected map ID.
 * @property {string|null} [layer]  The selected layer ID.
 * @property {string|null} [marker] The selected marker ID.
 * @property {string|null} [tab]    The active tab.
 */

/**
 * @typedef RouteContext
 * @property {Query}                            query     The Query parameters currently in the url.
 * @property {import('history').BrowserHistory} history   See https://github.com/remix-run/history/blob/main/docs/api-reference.md
 * @property {navigate}                         navigate  Function to navigate to new query parameters.
 * @property {createUrl}                        createUrl Function to generate url with updated query parameters
 */

/** @type {import('react').Context<RouteContext>} Create router context */
const routeContext = createContext(null);

/**
 * Create a URL with updated query parameters.
 *
 * @param {Query} query The query parameters to change.
 */
function createUrl(query) {
	const search = new URLSearchParams(globalHistory.location.search);
	for (const param in query) {
		if (query[param] === null) {
			search.delete(param);
		} else {
			search.set(param, query[param]);
		}
	}
	return '?' + search.toString();
}

/**
 * Navigate to new query parameters using client side routing.
 *
 * @param {Query}   query   The query parameters to change.
 * @param {Object}  state   Any state to pass to the next page.
 * @param {boolean} replace Replace url in history instead of pushing a new entry.
 */
export function navigate(query, state, replace = false) {
	const route = createUrl(query);
	if (replace) {
		globalHistory.replace(route, state);
	} else {
		globalHistory.push(route, state);
	}
}

/**
 * Context provider providing routing state.
 *
 * @param {Object}                    props
 * @param {import('react').ReactNode} props.children Child nodes.
 */
export function RouterProvider({ children }) {
	// Current search parameter string
	const [search, setSearch] = useState(globalHistory.location.search);

	// Current search parameter query
	const query = useMemo(
		() => Object.fromEntries(new URLSearchParams(search)),
		[search]
	);

	// Update the router context if the query parameter has changed.
	useEffect(() => {
		return globalHistory.listen(({ location }) => {
			setSearch(location.search);
		});
	}, []);

	return (
		<routeContext.Provider
			value={{
				query,
				history: globalHistory,
				navigate,
				createUrl,
			}}
		>
			{children}
		</routeContext.Provider>
	);
}

/**
 * Get the context provided by the router.
 */
export function useRouter() {
	return useContext(routeContext);
}

/**
 * Display only the children of the child route component that has a path matching the provided query parameter.
 *
 * @param {Object}                    props
 * @param {string}                    props.param     The query parameter to use for routing.
 * @param {string}                    props.rootPath  The path to route to if the query parameter has no value.
 * @param {string}                    props.errorPath The path to route to if the query parameter value can not be matched to a path.
 * @param {import('react').ReactNode} props.children  Child nodes.
 */
export function Router({ param, rootPath, errorPath, children }) {
	// Get current query parameters.
	const { query } = useRouter();

	// Set routing query parameter to the root parameter if it has no value.
	useEffect(() => {
		if (!query[param]) {
			navigate({ [param]: rootPath }, null, true);
		}
	}, [param, query, rootPath]);

	// Get route component that corresponds to the route in the current query.
	const route = useMemo(() => {
		const routeParam = query[param] ?? rootPath;
		const childArr = Children.toArray(children);
		return (
			childArr.find(
				(child) => child.props.path && child.props.path === routeParam
			) ??
			childArr.find(
				(child) => child.props.path && child.props.path === errorPath
			)
		);
	}, [children, errorPath, param, query, rootPath]);

	return route.props.children;
}

/**
 * A component to allow the router to filter by route.
 *
 * @param {Object} props
 * @param {string} props.path The route to filter by
 */
// eslint-disable-next-line no-unused-vars
export function Route(props) {
	return <></>;
}
