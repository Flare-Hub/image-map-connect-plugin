import { useRouter } from "../contexts/router"

/**
 * Anchor tag that uses the router to navigate.
 *
 * @param {object} props
 * @param {object} props.query The query parameters to change.
 * @param {object} props.state Any state to pass to the next page.
 * @returns Link component
 */
export default function Link({ query, state, children, ...attr }) {
	const { createUrl, history } = useRouter()
	// Determine the url to link to
	const route = createUrl(query)

	// Update the url with the new query parameters
	function setQuery(e) {
		e.preventDefault()
		history.push(route, state)
	}

	return <a href={route} onClick={setQuery} {...attr}>{children}</a>
}

